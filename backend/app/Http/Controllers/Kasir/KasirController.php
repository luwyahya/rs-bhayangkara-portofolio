<?php
/**
 * Created by PhpStorm.
 * User: Efan Andrian(ea@epic)
 * Date: 02-Sept-19
 * Time: 08:49
 */

namespace App\Http\Controllers\Kasir;
use App\Http\Controllers\ApiController;
use App\Master\JadwalPraktekBulanan;
use App\Master\MapRuanganToProduk;
use App\Master\Pasien;
use App\Master\SettingDataFixed;
use App\Traits\InternalList;
use App\Traits\PelayananPasienTrait;
use App\Traits\SettingDataFixedTrait;
use App\Traits\Valet;
use App\Master\TempatTidur;
use App\Master\Ruangan;
use App\Transaksi\AntrianPasienDiperiksa;
use App\Transaksi\LogAcc;
use App\Transaksi\LoggingUser;
use App\Transaksi\MonitoringPengajuanPelatihanDetail;
use App\Transaksi\PasienDaftar;
use App\Transaksi\PelayananPasien;
use App\Transaksi\RegistrasiPelayananPasien;
use App\Transaksi\StrukBuktiPenerimaan;
use App\Transaksi\StrukBuktiPenerimaanCaraBayar;
use App\Transaksi\StrukOrder;
use App\Transaksi\StrukPelayanan;
use App\Transaksi\StrukPelayananDetail;
use App\Transaksi\StrukPelayananPenjamin;
use App\Transaksi\TargetAnggaran;
use App\Transaksi\StrukPlanning;
use App\Transaksi\KendaliDokumenRekamMedis;
use Illuminate\Http\Request;
use App\Http\Requests;
use Illuminate\Support\Facades\DB;
use Response;

class KasirController extends ApiController{
    use Valet, InternalList, PelayananPasienTrait, SettingDataFixedTrait;
    public function __construct()
    {
        parent::__construct($skip_authentication=false);

    }

    protected function  getKdTransaksiNonLayanan(){
        $set = SettingDataFixed::where('namafield', 'kdTransaksiNonLayanan')->first();
        if($set){
            return $set->nilaifield;
        }else{
            return null;
        }
    }

    public function getDataComboKasir(Request $request) {
        $dataLogin=$request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->join('pegawai_m as pg','pg.id','=','lu.objectpegawaifk')
            ->select('pg.namalengkap','lu.objectpegawaifk','lu.objectkelompokuserfk')
            ->where('lu.id',$dataLogin['userData']['id'])
            ->first();
        $dataInstalasi = \DB::table('departemen_m as dp')
            ->whereIn('dp.id',[3, 14, 16, 17, 18, 19, 24, 25, 26, 27, 28, 35])
            ->where('dp.statusenabled', 1)
            ->orderBy('dp.namadepartemen')
            ->get();
        $dataRuangan = \DB::table('ruangan_m as ru')
            ->where('ru.statusenabled', 1)
            ->orderBy('ru.namaruangan')
            ->get();
        $kelTrans = \DB::table('kelompoktransaksi_m')
            ->select('id','kelompoktransaksi')
            ->where('statusenabled',1)
            ->get();
        $caraBayar = \DB::table('carabayar_m')
            ->select('id','carabayar as caraBayar','carabayar as namaExternal')
            ->where('statusenabled',1)
            ->get();
        $jenisKartu = \DB::table('jeniskartu_m')
            ->select('id','jeniskartu as jenisKartu','jeniskartu as namaExternal')
            ->where('statusenabled',1)
            ->get();
        $dataKelompok = \DB::table('kelompokpasien_m as kp')
            ->select('kp.id', 'kp.kelompokpasien')
            ->where('kp.statusenabled', 1)
            ->orderBy('kp.kelompokpasien')
            ->get();
        $dataRuanganRi = \DB::table('ruangan_m as ru')
            ->select('ru.id','ru.namaruangan','ru.objectdepartemenfk','ru.kdinternal')
            ->where('ru.statusenabled', 1)
            ->where('ru.objectdepartemenfk', 16)
            ->orderBy('ru.namaruangan')
            ->get();
        // $dataKasir= \DB::select(DB::raw("select pg.id,pg.namalengkap from loginuser_s lu
        //         INNER JOIN pegawai_m pg on lu.objectpegawaifk=pg.id
        //         where objectkelompokuserfk=20 and pg.statusenabled='true'")
            // array(
            //     'id' => 20,
            // )
        // );
        $dataKasir = \DB::table('loginuser_s as lu')
                ->join('pegawai_m as pg', 'pg.id', '=', 'lu.objectpegawaifk')
                ->select('pg.id', 'pg.namalengkap')
                ->where('lu.objectkelompokuserfk', 20)
                // ->where('pg.statusenabled', 1)
                ->get();

        $dataCB= DB::select(DB::raw("select id,carabayar from carabayar_m
                where  statusenabled=:tt;"),
            array(
                'tt' => 1,
            )
        );
        // $dataKP= DB::select(DB::raw("select id,kelompoktransaksi from kelompoktransaksi_m
        //         where  statusenabled=:tt and id in (2,3,4,5,6,10,13,16,34,8,9,20,21,23,24,26,62,70,71);"),
        //     array(
        //         'tt' => 1,
        //     )
        // );
        $dataKP= DB::select(DB::raw("select id,kelompoktransaksi from kelompoktransaksi_m
                where  statusenabled=:tt and id in (1,2,63,4);"),
            array(
                'tt' => 1,
            )
        );

         $rekanan = \DB::table('rekanan_m')
            ->select('id','namarekanan')
            ->where('statusenabled',1)
            // ->where('objectjenisrekananfk',2)
            ->orderBy('namarekanan')
            ->get();
        $dataDokter = \DB::table('pegawai_m as ru')
            ->where('ru.statusenabled', 1)
            ->where('ru.objectjenispegawaifk', 1)
            ->orderBy('ru.namalengkap')
            ->get();
        $dataPegawaiAll = \DB::table('pegawai_m as ru')
            ->where('ru.statusenabled', 1)
            // ->where('ru.objectjenispegawaifk', 1)
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

        $diklit= $this->settingDataFixed('KdKelompokUserDiklat',null);
        $ListKode= explode(',',$this->settingDataFixed('kdTransaksiNonLayananFix'));
        $list = explode(',',$this->settingDataFixed('kdTransaksiNonLayanan'));
        $arry=[];
        foreach ($list as $item){
            $arry [] = (int)$item;
        }
        $arrKode=[];
        foreach ($ListKode as $items){
            $arrKode [] = (int)$items;
        }
        $kelTransNon = \DB::table('kelompoktransaksi_m')
            ->select('id','kelompoktransaksi')
            ->where('statusenabled',1)
            ->whereIn('id',$arry)
            ->get();

        $kelTransNonFIX = \DB::table('kelompoktransaksi_m')
            ->select('id','kelompoktransaksi')
            ->where('statusenabled',1)
            ->whereIn('id',$arrKode)
            ->get();
        $listBank = \DB::table('bank_m')
            ->select('id','nama')
            ->where('statusenabled',true)
            ->get();

        $listBankKe = DB::table('mapaccountbank_m as kr')
            ->join('bank_m as ba', 'ba.id', '=', 'kr.objectbankfk')
            ->join('chartofaccount_m as coa','coa.id','=','kr.objectcoafk')
            ->select('kr.id','ba.nama', 'coa.namaaccount','coa.noaccount')
            ->get();

        $result = array(
            'ruangan' => $dataRuangan,
            'kelompoktransaksi' => $kelTrans,
            'carabayar' => $caraBayar,
            'jeniskartu' => $jenisKartu,
            'datapegawai'=>$dataPegawai,
            'kelompokpasien'=>$dataKelompok,
            'ruanganri'=>$dataRuanganRi,
            'datakasir'=>$dataKasir,
            'dataInstalasi' =>$dataInstalasi,
            'dataCB' =>$dataCB,
            'dataKP' =>$dataKP,
            'datalogin'=>$dataLogin,
            'dokter' => $dataDokter,
            'departemen' => $dataDepartemen,
            'diklit' => $diklit,
            'kelnon' => $kelTransNon,
            'kelfix' => $kelTransNonFIX,
            'rekanan' => $rekanan,
            'dataPegawaiAll' => $dataPegawaiAll,
            'listbank' => $listBank,
            'listBankKe' => $listBankKe,
            'message' => 'ihuman@epic'
        );
        return $this->respond($result);
    }

    public function getLaporanPendapatan(Request $request){

        $filter = $request->all();
        // $tglAwal = $request['tglAwal'];
        // $tglAkhir = $request['tglAkhir'];
        // $idDept = $request['idDepartemen'];
        // $idRuangan = $request['idRuangan'];
        // $idDokter = $request['idDokter'];
        // $idKelompok = $request['idKelompok'];
        // if (isset($filter['idDepartemen']) && $filter['idDepartemen'] != "" && $filter['idDepartemen'] != "undefined") {
        //     $datas = "where pp.tglregistrasi', '>=', $filter['idDepartemen']";
        // }

        // $data = DB::select(DB::raw("SELECT
        // ROW_NUMBER() OVER() as no,
        // pp.tglregistrasi AS tglpelayanan,
        // ps.nocm,
        // dp.namaexternal,
        // ps.namapasien,
        // case when pg.namaexternal ='dl' then 'Dokter Luar' else 'Dokter Dalam' end as tipedokter,
        // ru.namaexternal AS namaruangan,
        // km.kelompokpasien,
        // pg.namalengkap AS namadokter,
        // pp.hargajual AS harga,
        // pp.jumlah AS qty,
        // pp.hargajual * pp.jumlah AS totalbayar,
        // pr.namaexternal as namaproduk,
        // case when sc.noclosing is not null then 'Lunas' else  ' ' end as noclosing
        // FROM
        // pasiendaftar_t AS pd
        // LEFT JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
        // LEFT JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
        // LEFT JOIN kelompokpasien_m AS km ON km.ID = pd.objectkelompokpasienlastfk
        // LEFT JOIN pegawai_m AS pg ON pg.ID = apd.objectpegawaifk
        // LEFT JOIN ruangan_m AS ru ON ru.ID = apd.objectruanganfk
        // LEFT JOIN departemen_m AS dp ON dp.ID = ru.objectdepartemenfk
        // LEFT JOIN produk_m AS pr ON pr.ID = pp.produkfk
        // LEFT JOIN detailjenisproduk_m AS djp ON djp.ID = pr.objectdetailjenisprodukfk
        // LEFT JOIN jenisproduk_m AS jp ON jp.ID = djp.objectjenisprodukfk
        // LEFT JOIN kelompokproduk_m AS kp ON kp.ID = jp.objectkelompokprodukfk
        // LEFT JOIN pasien_m AS ps ON ps.ID = pd.nocmfk
        // LEFT JOIN kelompokpasien_m AS kps ON kps.ID = pd.objectkelompokpasienlastfk
        // LEFT JOIN strukpelayanan_t AS sp ON sp.norec = pp.strukfk
        // INNER JOIN strukbuktipenerimaan_t AS sbm ON sbm.nostrukfk = sp.norec
        // LEFT JOIN strukclosing_t AS sc ON sc.norec = sbm.noclosingfk
        // where sc.noclosing is not null and pp.tglregistrasi between :tglAwal and :tglAkhir as x $datas
        // "), array(
        //     'tglAwal' => $request['tglAwal'],
        //     'tglAkhir' => $request['tglAkhir']
        // ));
        $filter = $request->all();
        $data = \DB::table('pasiendaftar_t as pd')
        ->leftJoin('antrianpasiendiperiksa_t as apd','apd.noregistrasifk', '=','pd.norec')
        ->leftjoin('pelayananpasien_t as pp','pp.noregistrasifk','=','apd.norec')
        ->leftJoin('kelompokpasien_m as km','km.id','=','pd.objectkelompokpasienlastfk')
        ->leftjoin('pegawai_m as pg','pg.id','=','apd.objectpegawaifk')
        ->leftjoin('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
        ->leftjoin('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
        ->leftjoin('produk_m as pr','pr.id','=','pp.produkfk')
        ->leftjoin('detailjenisproduk_m as djp','djp.id','=','pr.objectdetailjenisprodukfk')
        ->leftjoin('jenisproduk_m as jp','jp.id','=','djp.objectjenisprodukfk')
        ->leftjoin('kelompokproduk_m as kp','kp.id','=','jp.objectkelompokprodukfk')
        ->leftjoin('pasien_m as ps','ps.id','=','pd.nocmfk')
        ->leftjoin('kelompokpasien_m as kps','kps.id','=','pd.objectkelompokpasienlastfk')
        ->leftjoin('strukpelayanan_t as sp','sp.norec','=','pp.strukfk')
        ->leftjoin('strukbuktipenerimaan_t as sbm','sbm.nostrukfk','=','sp.norec')
        ->leftjoin('strukclosing_t as sc','sc.norec','=','sbm.noclosingfk')
        ->select(
           DB::raw("
        ROW_NUMBER() OVER() as no,
        pp.tglregistrasi AS tglpelayanan,
        ps.nocm,
        dp.namaexternal,
        ps.namapasien,
        case when pg.namaexternal ='dl' then 'Dokter Luar' else 'Dokter Dalam' end as tipedokter,
        ru.namaexternal AS namaruangan,
        km.kelompokpasien,
        pg.namalengkap AS namadokter,
        pp.hargajual AS harga,
        pp.jumlah AS qty,
        pp.hargajual * pp.jumlah AS totalbayar,
        pr.namaexternal as namaproduk,
        case when sc.noclosing is not null then 'Lunas' else  ' ' end as noclosing")
        )
        ->where('sc.noclosing','!=',null);
        
        
        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('pp.tglregistrasi', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $data = $data->where('pp.tglregistrasi', '<=', $filter['tglAkhir']);
        }
        if (isset($filter['idDepartemen']) && $filter['idDepartemen'] != "" && $filter['idDepartemen'] != "undefined") {
            $data = $data->where('dp.id', '=', $filter['idDepartemen']);
        }
        if (isset($filter['TipeDokter']) && $filter['TipeDokter'] != "" && $filter['TipeDokter'] != "undefined") {
            $data = $data->where('pg.namaexternal', '=', 'dl');
        }
        if (isset($filter['idRuangan']) && $filter['idRuangan'] != "" && $filter['idRuangan'] != "undefined") {
            $data = $data->where('ru.id', '=', $filter['idRuangan']);
        }
        if (isset($filter['idDokter']) && $filter['idDokter'] != "" && $filter['idDokter'] != "undefined") {
            $data = $data->where('pg.id', '=', $filter['idDokter']);
        }
        if (isset($filter['idKelompok']) && $filter['idKelompok'] != "" && $filter['idKelompok'] != "undefined") {
            $data = $data->where('kps.id', '=', $filter['idKelompok']);
        }

        $data = $data->groupBy('pp.tglregistrasi', 'ps.nocm', 'dp.namaexternal', 'ps.namapasien', 'pg.namaexternal', 'ru.namaexternal',
            'km.kelompokpasien', 'pg.namalengkap',
            'pp.hargajual', 'pp.jumlah', 'pr.namaexternal', 'pp.hargajual', 'sc.noclosing');
        $data = $data->get();

        return $this->respond($data);


    }

    public function getRekaPendapatan(Request $request){
        //  $data = DB::select(DB::raw("SELECT
        //     ROW_NUMBER() OVER() as no,
        // ps.nocm,
        //         dp.namadepartemen,
        // ru.namaexternal AS namaruangan,
        // km.kelompokpasien,
        // pg.namalengkap AS namadokter,
        // pp.hargajual * pp.jumlah AS totalbayar
        // FROM
        // pasiendaftar_t AS pd
        // LEFT JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
        // LEFT JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
        // LEFT JOIN kelompokpasien_m AS km ON km.ID = pd.objectkelompokpasienlastfk
        // LEFT JOIN pegawai_m AS pg ON pg.ID = apd.objectpegawaifk
        // LEFT JOIN ruangan_m AS ru ON ru.ID = apd.objectruanganfk
        // LEFT JOIN departemen_m AS dp ON dp.ID = ru.objectdepartemenfk
        // LEFT JOIN produk_m AS pr ON pr.ID = pp.produkfk
        // LEFT JOIN detailjenisproduk_m AS djp ON djp.ID = pr.objectdetailjenisprodukfk
        // LEFT JOIN jenisproduk_m AS jp ON jp.ID = djp.objectjenisprodukfk
        // LEFT JOIN kelompokproduk_m AS kp ON kp.ID = jp.objectkelompokprodukfk
        // LEFT JOIN pasien_m AS ps ON ps.ID = pd.nocmfk
        // LEFT JOIN kelompokpasien_m AS kps ON kps.ID = pd.objectkelompokpasienlastfk
        // LEFT JOIN strukpelayanan_t AS sp ON sp.norec = pp.strukfk
        // INNER JOIN strukbuktipenerimaan_t AS sbm ON sbm.nostrukfk = sp.norec
        // LEFT JOIN strukclosing_t AS sc ON sc.norec = sbm.noclosingfk
        // where sc.noclosing is not null
        // "));

         $filter = $request->all();
         $data = \DB::table('pasiendaftar_t as pd')
        ->leftJoin('antrianpasiendiperiksa_t as apd','apd.noregistrasifk', '=','pd.norec')
        ->leftjoin('pelayananpasien_t as pp','pp.noregistrasifk','=','apd.norec')
        ->leftJoin('kelompokpasien_m as km','km.id','=','pd.objectkelompokpasienlastfk')
        ->leftjoin('pegawai_m as pg','pg.id','=','apd.objectpegawaifk')
        ->leftjoin('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
        ->leftjoin('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
        ->leftjoin('produk_m as pr','pr.id','=','pp.produkfk')
        ->leftjoin('detailjenisproduk_m as djp','djp.id','=','pr.objectdetailjenisprodukfk')
        ->leftjoin('jenisproduk_m as jp','jp.id','=','djp.objectjenisprodukfk')
        ->leftjoin('kelompokproduk_m as kp','kp.id','=','jp.objectkelompokprodukfk')
        ->leftjoin('pasien_m as ps','ps.id','=','pd.nocmfk')
        ->leftjoin('kelompokpasien_m as kps','kps.id','=','pd.objectkelompokpasienlastfk')
        ->leftjoin('strukpelayanan_t as sp','sp.norec','=','pp.strukfk')
        ->leftjoin('strukbuktipenerimaan_t as sbm','sbm.nostrukfk','=','sp.norec')
        ->leftjoin('strukclosing_t as sc','sc.norec','=','sbm.noclosingfk')
        ->select(
           DB::raw("
        ROW_NUMBER() OVER() as no,
        pp.tglregistrasi AS tglpelayanan,
        ps.nocm,
        dp.namaexternal,
        dp.namadepartemen,
        ps.namapasien,
        case when pg.namaexternal ='dl' then 'Dokter Luar' else 'Dokter Dalam' end as tipedokter,
        ru.namaexternal AS namaruangan,
        km.kelompokpasien,
        pg.namalengkap AS namadokter,
        pp.hargajual AS harga,
        pp.jumlah AS qty,
        pp.hargajual * pp.jumlah AS totalbayar,
        pr.namaexternal as namaproduk,
        case when sc.noclosing is not null then 'Lunas' else  ' ' end as noclosing")
        )
        ->where('sc.noclosing','!=',null);
        
        
        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('pp.tglregistrasi', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $data = $data->where('pp.tglregistrasi', '<=', $filter['tglAkhir']);
        }
        if (isset($filter['idDepartemen']) && $filter['idDepartemen'] != "" && $filter['idDepartemen'] != "undefined") {
            $data = $data->where('dp.id', '=', $filter['idDepartemen']);
        }
        if (isset($filter['TipeDokter']) && $filter['TipeDokter'] != "" && $filter['TipeDokter'] != "undefined") {
            $data = $data->where('pg.namaexternal', '=', 'dl');
        }
        if (isset($filter['idRuangan']) && $filter['idRuangan'] != "" && $filter['idRuangan'] != "undefined") {
            $data = $data->where('ru.id', '=', $filter['idRuangan']);
        }
        if (isset($filter['idDokter']) && $filter['idDokter'] != "" && $filter['idDokter'] != "undefined") {
            $data = $data->where('pg.id', '=', $filter['idDokter']);
        }
        if (isset($filter['idKelompok']) && $filter['idKelompok'] != "" && $filter['idKelompok'] != "undefined") {
            $data = $data->where('kps.id', '=', $filter['idKelompok']);
        }

        $data = $data->groupBy('pp.tglregistrasi', 'dp.namadepartemen', 'ps.nocm', 'dp.namaexternal', 'ps.namapasien', 'pg.namaexternal', 'ru.namaexternal',
            'km.kelompokpasien', 'pg.namalengkap',
            'pp.hargajual', 'pp.jumlah', 'pr.namaexternal', 'pp.hargajual', 'sc.noclosing');
        $data = $data->get();

        return $this->respond($data);

        // return $this->respond($data);




    }

    public function getRekaPendapatanKeuangan(Request $request){
        // $data = DB::select(DB::raw("SELECT
        // ROW_NUMBER() OVER() as no,
        // pp.tglregistrasi AS tglpelayanan,
        // ps.nocm,
        // dp.namaexternal,
        // ps.namapasien,
        // case when pg.namaexternal ='dl' then 'Dokter Luar' else 'Dokter Dalam' end as tipedokter,
        // ru.namaexternal AS namaruangan,
        // km.kelompokpasien,
        // pg.namalengkap AS namadokter,
        // pp.hargajual AS harga,
        // pp.jumlah AS qty,
        // pp.hargajual * pp.jumlah AS totalbayar,
        // case when sc.noclosing is not null then 'Lunas' else  ' ' end as noclosing
        // FROM
        // pasiendaftar_t AS pd
        // LEFT JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
        // LEFT JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
        // LEFT JOIN kelompokpasien_m AS km ON km.ID = pd.objectkelompokpasienlastfk
        // LEFT JOIN pegawai_m AS pg ON pg.ID = apd.objectpegawaifk
        // LEFT JOIN ruangan_m AS ru ON ru.ID = apd.objectruanganfk
        // LEFT JOIN departemen_m AS dp ON dp.ID = ru.objectdepartemenfk
        // LEFT JOIN produk_m AS pr ON pr.ID = pp.produkfk
        // LEFT JOIN detailjenisproduk_m AS djp ON djp.ID = pr.objectdetailjenisprodukfk
        // LEFT JOIN jenisproduk_m AS jp ON jp.ID = djp.objectjenisprodukfk
        // LEFT JOIN kelompokproduk_m AS kp ON kp.ID = jp.objectkelompokprodukfk
        // LEFT JOIN pasien_m AS ps ON ps.ID = pd.nocmfk
        // LEFT JOIN kelompokpasien_m AS kps ON kps.ID = pd.objectkelompokpasienlastfk
        // LEFT JOIN strukpelayanan_t AS sp ON sp.norec = pp.strukfk
        // INNER JOIN strukbuktipenerimaan_t AS sbm ON sbm.nostrukfk = sp.norec
        // LEFT JOIN strukclosing_t AS sc ON sc.norec = sbm.noclosingfk
        // where sc.noclosing is not null
        // "));

        // return $this->respond($data);

        $data = \DB::table('pasiendaftar_t as pd')
        ->leftJoin('antrianpasiendiperiksa_t as apd','apd.noregistrasifk', '=','pd.norec')
        ->leftjoin('pelayananpasien_t as pp','pp.noregistrasifk','=','apd.norec')
        ->leftJoin('kelompokpasien_m as km','km.id','=','pd.objectkelompokpasienlastfk')
        ->leftjoin('pegawai_m as pg','pg.id','=','apd.objectpegawaifk')
        ->leftjoin('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
        ->leftjoin('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
        ->leftjoin('produk_m as pr','pr.id','=','pp.produkfk')
        ->leftjoin('detailjenisproduk_m as djp','djp.id','=','pr.objectdetailjenisprodukfk')
        ->leftjoin('jenisproduk_m as jp','jp.id','=','djp.objectjenisprodukfk')
        ->leftjoin('kelompokproduk_m as kp','kp.id','=','jp.objectkelompokprodukfk')
        ->leftjoin('pasien_m as ps','ps.id','=','pd.nocmfk')
        ->leftjoin('kelompokpasien_m as kps','kps.id','=','pd.objectkelompokpasienlastfk')
        ->leftjoin('strukpelayanan_t as sp','sp.norec','=','pp.strukfk')
        ->leftjoin('strukbuktipenerimaan_t as sbm','sbm.nostrukfk','=','sp.norec')
        ->leftjoin('strukclosing_t as sc','sc.norec','=','sbm.noclosingfk')
        ->select(
           DB::raw("
        ROW_NUMBER() OVER() as no,
        pp.tglregistrasi AS tglpelayanan,
        ps.nocm,
        dp.namaexternal,
        ps.namapasien,
        case when pg.namaexternal ='dl' then 'Dokter Luar' else 'Dokter Dalam' end as tipedokter,
        ru.namaexternal AS namaruangan,
        km.kelompokpasien,
        pg.namalengkap AS namadokter,
        pp.hargajual AS harga,
        pp.jumlah AS qty,
        pp.hargajual * pp.jumlah AS totalbayar,
        pr.namaexternal as namaproduk,
        case when sc.noclosing is not null then 'Lunas' else  ' ' end as noclosing")
        )
        ->where('sc.noclosing','!=',null);
        
        
        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('pp.tglregistrasi', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $data = $data->where('pp.tglregistrasi', '<=', $filter['tglAkhir']);
        }
        if (isset($filter['idDepartemen']) && $filter['idDepartemen'] != "" && $filter['idDepartemen'] != "undefined") {
            $data = $data->where('dp.id', '=', $filter['idDepartemen']);
        }
        if (isset($filter['TipeDokter']) && $filter['TipeDokter'] != "" && $filter['TipeDokter'] != "undefined") {
            $data = $data->where('pg.namaexternal', '=', 'dl');
        }
        if (isset($filter['idRuangan']) && $filter['idRuangan'] != "" && $filter['idRuangan'] != "undefined") {
            $data = $data->where('ru.id', '=', $filter['idRuangan']);
        }
        if (isset($filter['idDokter']) && $filter['idDokter'] != "" && $filter['idDokter'] != "undefined") {
            $data = $data->where('pg.id', '=', $filter['idDokter']);
        }
        if (isset($filter['idKelompok']) && $filter['idKelompok'] != "" && $filter['idKelompok'] != "undefined") {
            $data = $data->where('kps.id', '=', $filter['idKelompok']);
        }

        $data = $data->groupBy('pp.tglregistrasi', 'ps.nocm', 'dp.namaexternal', 'ps.namapasien', 'pg.namaexternal', 'ru.namaexternal',
            'km.kelompokpasien', 'pg.namalengkap',
            'pp.hargajual', 'pp.jumlah', 'pr.namaexternal', 'pp.hargajual', 'sc.noclosing');
        $data = $data->get();

        return $this->respond($data);
    }
    
    public function getDataComboKasirSelect(Request $request) {
        $dataLogin=$request->all();
        $result = [];
        $result['datalogin'] = $dataLogin;
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->join('pegawai_m as pg','pg.id','=','lu.objectpegawaifk')
            ->select('pg.namalengkap','lu.objectpegawaifk','lu.objectkelompokuserfk')
            ->where('lu.id',$dataLogin['userData']['id'])
            ->first();
        $result['datapegawai'] = $dataPegawai;
            
        if (isset($dataLogin['dataInstalasi']) && $dataLogin['dataInstalasi']!="" && $dataLogin['dataInstalasi']!="undefined"){
            $dataInstalasi = \DB::table('departemen_m as dp')
                ->whereIn('dp.id',[3, 14, 16, 17, 18, 19, 24, 25, 26, 27, 28, 35])
                ->where('dp.statusenabled', 1)
                ->orderBy('dp.namadepartemen')
                ->get();
                
            //     'dataInstalasi' =>$dataInstalasi,
            $result['dataInstalasi'] = $dataInstalasi;
        }
        // $dataRuangan = \DB::table('ruangan_m as ru')
        //     ->where('ru.statusenabled', 1)
        //     ->orderBy('ru.namaruangan')
        //     ->get();
        if (isset($dataLogin['kelompokTransaksi']) && $dataLogin['kelompokTransaksi']!="" && $dataLogin['kelompokTransaksi']!="undefined"){
            $kelTrans = \DB::table('kelompoktransaksi_m')
                ->select('id','kelompoktransaksi')
                ->where('statusenabled',1)
                ->get();
            $result['kelompoktransaksi'] = $kelTrans;
        }
        // $caraBayar = \DB::table('carabayar_m')
        //     ->select('id','carabayar as caraBayar','carabayar as namaExternal')
        //     ->where('statusenabled',1)
        //     ->get();
        // $jenisKartu = \DB::table('jeniskartu_m')
        //     ->select('id','jeniskartu as jenisKartu','jeniskartu as namaExternal')
        //     ->where('statusenabled',1)
        //     ->get();
        // $dataKelompok = \DB::table('kelompokpasien_m as kp')
        //     ->select('kp.id', 'kp.kelompokpasien')
        //     ->where('kp.statusenabled', 1)
        //     ->orderBy('kp.kelompokpasien')
        //     ->get();
        // $dataRuanganRi = \DB::table('ruangan_m as ru')
        //     ->select('ru.id','ru.namaruangan','ru.objectdepartemenfk','ru.kdinternal')
        //     ->where('ru.statusenabled', 1)
        //     ->where('ru.objectdepartemenfk', 16)
        //     ->orderBy('ru.namaruangan')
        //     ->get();
        if (isset($dataLogin['dataKasir']) && $dataLogin['dataKasir']!="" && $dataLogin['dataKasir']!="undefined"){
            $dataKasir= \DB::select(DB::raw("select pg.id,pg.namalengkap from loginuser_s lu
                    INNER JOIN pegawai_m pg on lu.objectpegawaifk=pg.id
                    where objectkelompokuserfk=:id and pg.statusenabled=1"),
                array(
                    'id' => 20,
                )
            );
            $result['datakasir'] = $dataKasir;
        }
        if (isset($dataLogin['dataCB']) && $dataLogin['dataCB']!="" && $dataLogin['dataCB']!="undefined"){
            $dataCB= DB::select(DB::raw("select id,carabayar from carabayar_m
                    where  statusenabled=:tt;"),
                array(
                    'tt' => 1,
                )
            );
            $result['dataCB'] = $dataCB;
        }
        // // $dataKP= DB::select(DB::raw("select id,kelompoktransaksi from kelompoktransaksi_m
        // //         where  statusenabled=:tt and id in (2,3,4,5,6,10,13,16,34,8,9,20,21,23,24,26,62,70,71);"),
        // //     array(
        // //         'tt' => 1,
        // //     )
        // // );
        // $dataKP= DB::select(DB::raw("select id,kelompoktransaksi from kelompoktransaksi_m
        //         where  statusenabled=:tt and id in (1,2,63,4);"),
        //     array(
        //         'tt' => 1,
        //     )
        // );

        //  $rekanan = \DB::table('rekanan_m')
        //     ->select('id','namarekanan')
        //     ->where('statusenabled',1)
        //     ->where('objectjenisrekananfk',2)
        //     ->orderBy('namarekanan')
        //     ->get();
        if (isset($dataLogin['dokter']) && $dataLogin['dokter']!="" && $dataLogin['dokter']!="undefined"){
            $dataDokter = \DB::table('pegawai_m as ru')
                ->where('ru.statusenabled', 1)
                ->where('ru.objectjenispegawaifk', 1)
                ->orderBy('ru.namalengkap')
                ->get();
            $result['dokter'] = $dataDokter;
        }
        // $dataPegawaiAll = \DB::table('pegawai_m as ru')
        //     ->where('ru.statusenabled', 1)
        //     // ->where('ru.objectjenispegawaifk', 1)
        //     ->orderBy('ru.namalengkap')
        //     ->get();
        // foreach ($dataInstalasi as $item) {
        //     $detail = [];
        //     foreach ($dataRuangan as $item2) {
        //         if ($item->id == $item2->objectdepartemenfk) {
        //             $detail[] = array(
        //                 'id' => $item2->id,
        //                 'ruangan' => $item2->namaruangan,
        //             );
        //         }
        //     }
        // }

        //     $dataDepartemen[] = array(
        //         'id' => $item->id,
        //         'departemen' => $item->namadepartemen,
        //         'ruangan' => $detail,
        //     );
        // }

        if (isset($dataLogin['dikLit']) && $dataLogin['dikLit']!="" && $dataLogin['dikLit']!="undefined"){
            $diklit= $this->settingDataFixed('KdKelompokUserDiklat',null);
            $result['diklit'] = $diklit;
        }
        $ListKode= explode(',',$this->settingDataFixed('kdTransaksiNonLayananFix'));
        $list = explode(',',$this->settingDataFixed('kdTransaksiNonLayanan'));
        $arry=[];
        foreach ($list as $item){
            $arry [] = (int)$item;
        }
        $arrKode=[];
        foreach ($ListKode as $items){
            $arrKode [] = (int)$items;
        }
        // $kelTransNon = \DB::table('kelompoktransaksi_m')
        //     ->select('id','kelompoktransaksi')
        //     ->where('statusenabled',1)
        //     ->whereIn('id',$arry)
        //     ->get();

        if (isset($dataLogin['kelFix']) && $dataLogin['kelFix']!="" && $dataLogin['kelFix']!="undefined"){
            $kelTransNonFIX = \DB::table('kelompoktransaksi_m')
                ->select('id','kelompoktransaksi')
                ->where('statusenabled',1)
                ->whereIn('id',$arrKode)
                ->get();
            $result['kelfix'] = $kelTransNonFIX;
        }

        // $result = array(
        //     'ruangan' => $dataRuangan,
        //     'kelompoktransaksi' => $kelTrans,
        //     'carabayar' => $caraBayar,
        //     'jeniskartu' => $jenisKartu,
        //     'datapegawai'=>$dataPegawai,
        //     'kelompokpasien'=>$dataKelompok,
        //     'ruanganri'=>$dataRuanganRi,
        //     'datakasir'=>$dataKasir,
        //     'dataInstalasi' =>$dataInstalasi,
        //     'dataCB' =>$dataCB,
        //     'dataKP' =>$dataKP,
        //     'datalogin'=>$dataLogin,
        //     'dokter' => $dataDokter,
        //     'departemen' => $dataDepartemen,
        //     'diklit' => $diklit,
        //     'kelnon' => $kelTransNon,
        //     'kelfix' => $kelTransNonFIX,
        //     'rekanan' => $rekanan,
        //     'dataPegawaiAll' => $dataPegawaiAll,
        //     'message' => 'ihuman@epic'
        // );
        return $this->respond($result);
    }
    public function daftarTagihanNonLayanan(Request $request){
        $filter=$request->all();
        $list = explode (',',$this->settingDataFixed('kdTransaksiNonLayananFix'));
        $KdList = [];
        foreach ($list as $item){
            $KdList []=  (int)$item;
        }
        $datakelompokuser= \DB::table('loginuser_s as lu')
            ->select('lu.objectkelompokuserfk')
            ->where('lu.id','=',$filter['userData']['id'])
            ->get();

        if ($datakelompokuser[0]->objectkelompokuserfk == 58){
            $dataNonLayanan = \DB::table('strukpelayanan_t as sp')
                ->join('kelompoktransaksi_m as kt', 'sp.objectkelompoktransaksifk', '=', 'kt.id')
                ->select('sp.norec', 'sp.tglstruk', 'sp.namapasien_klien', 'kt.reportdisplay as jenistagihan',
                    'sp.totalharusdibayar', 'keteranganlainnya', 'sp.nosbklastfk', 'sp.nosbmlastfk', 'kt.id as jenisTagihanId')
                ->whereNotNull('sp.totalharusdibayar')
                ->whereIn('sp.objectkelompoktransaksifk', $KdList)
                ->whereIn('kt.id', [13,138]);
        }else {
            $dataNonLayanan = \DB::table('strukpelayanan_t as sp')
                ->join('kelompoktransaksi_m as kt', 'sp.objectkelompoktransaksifk', '=', 'kt.id')
                ->select('sp.norec', 'sp.tglstruk', 'sp.namapasien_klien', 'kt.reportdisplay as jenistagihan',
                    'sp.totalharusdibayar', 'keteranganlainnya', 'sp.nosbklastfk', 'sp.nosbmlastfk', 'kt.id as jenisTagihanId')
//            ->whereNull('sp.noregistrasifk')
                ->whereNotNull('sp.totalharusdibayar')
                ->whereIn('sp.objectkelompoktransaksifk',$KdList)
                ->whereNotIn('sp.keteranganlainnya',['Registrasi Linen Ruangan']);
//            ->where('spp.kdrekananpenjamin', 0);->whereIn('id', [1, 2, 3])
        }

        if(isset($filter['tglAwal']) && $filter['tglAwal']!=""){
            $dataNonLayanan = $dataNonLayanan->where('sp.tglstruk','>=', $filter['tglAwal']);
        }

        if(isset($filter['tglAkhir']) && $filter['tglAkhir']!=""){
            $tgl= $filter['tglAkhir'];//." 23:59:59";
            $dataNonLayanan = $dataNonLayanan->where('sp.tglstruk','<=', $tgl);
        }
//
        if(isset($filter['jenisTagihanId']) && $filter['jenisTagihanId']!=""){
            $dataNonLayanan = $dataNonLayanan->where('kt.id','=', $filter['jenisTagihanId']);
        }

        if(isset($filter['namaPelanggan']) && $filter['namaPelanggan']!=""){
            $dataNonLayanan = $dataNonLayanan->where('sp.namapasien_klien','like','%'. $filter['namaPelanggan'] . '%');
        }
//
        if(isset($filter['status']) && $filter['status']!=""){
            if($filter['status']=='Lunas'){
                $dataNonLayanan = $dataNonLayanan->whereNotNull('sp.nosbmlastfk');
            }else{
                $dataNonLayanan = $dataNonLayanan->whereNull('sp.nosbmlastfk');
            }
        }
        if(isset($filter['statusK']) && $filter['statusK']!=""){
            if($filter['statusK']=='Lunas'){
                $dataNonLayanan = $dataNonLayanan->whereNotNull('sp.nosbklastfk');
            }else{
                $dataNonLayanan = $dataNonLayanan->whereNull('sp.nosbklastfk');
            }
        }

//        $dataPiutang=$dataPiutang->groupBy('kp.kelompokpasien', 'spp.norec','sp.tglstruk', 'pd.noregistrasi', 'pd.tglregistrasi','p.nocm','p.namapasien','spp.totalppenjamin','spp.totalharusdibayar',
//            'spp.totalsudahdibayar', 'r.namarekanan', 'spp.totalbiaya', 'spp.noverifikasi');
        $dataNonLayanan =$dataNonLayanan->where('sp.statusenabled','=',true);
        $dataNonLayanan =$dataNonLayanan->get();
        $result = array();
        foreach ($dataNonLayanan as $item) {
            $statusBayar = "Belum Bayar";
            if($item->nosbmlastfk!=null ||$item->nosbklastfk!=null){
                $statusBayar = "Lunas";
            }
            $result[] = array(
                'noRec' => $item->norec,
                'tglTransaksi' => $item->tglstruk,
                'namaPelanggan' => $item->namapasien_klien,
                'jenisTagihan' => $item->jenistagihan,
                'total' => $item->totalharusdibayar,
                'keterangan' => $item->keteranganlainnya,
                'jenisTagihanId' => $item->jenisTagihanId,
                'statusBayar' =>$statusBayar

            );
        }

        return $this->respond($result, 'Data Tagihan Penunjang');

//        $strukOrder = StrukOrder::has('order_pelayanan')->where('noregistrasifk', null)->get();
//        $result = array();
//        foreach ($strukOrder as $item) {
//            $orderPelayanan = $item->order_pelayanan;
//            $totalTagihan = ($item->totalhargasatuan*$item->qtyproduk);
//            if($totalTagihan>0){
//                $result[] = array(
//                    'noRec' => $item->norec,
//                    'tglTransaksi' => $item->tglorder,
//                    'namaPelanggan' => $item->namapenyewa,
//                    'jenisTagihan' => 'x', //dari mana kelompokTransaksi
//                    'total' => $totalTagihan,
//                    'keterangan' => $item->keteranganorder,
//                    'statusBayar' =>"-", //belum bayar / lunas
//                );
//            }
//        }
//        return $this->respond($result, 'Data tagihan non layanan');
    }

    public function getDataProduk(Request $request) {
        $dataLogin = $request->all();
        $data = \DB::table('produk_m as pr')
            ->JOIN('harganettoprodukbykelas_m as het','het.objectprodukfk','=','pr.id')
            ->select('pr.id','pr.namaproduk','het.harganetto1 as harga')
            ->where('pr.statusenabled',true)
            ->where('het.objectkelasfk',6)
            ->where('het.objectjenispelayananfk',1)
            ->where('het.statusenabled',true);
//            ->take($request['take']);

        if(isset($request['prid']) && $request['prid']!="" && $request['prid']!="undefined"){
            $data = $data->where('ru.id', $request['prid']);
        }
        if(isset($request['namaproduk']) && $request['namaproduk']!="" && $request['namaproduk']!="undefined"){
            $data = $data->where('pr.namaproduk','ilike','%'. $request['namaproduk'].'%');
        }
        $data = $data->get();



        $result = array(
            'data' => $data,
            'datalogin' => $dataLogin,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }

    public function SaveInputTagihan(Request $request) {
        \DB::beginTransaction();
        $transMessage='';
        $req = $request->all();
//        return $this->respond($req);
        // try {
        if($req['norec'] == ''){
            $SP = new StrukPelayanan();
            $norecSP = $SP->generateNewId();
            $noStruk = $this->generateCode(new StrukPelayanan, 'nostruk', 10, 'NL'.$this->getDateTime()->format('ym'));
            $SP->norec = $norecSP;
            $SP->kdprofile = 0;
            $SP->statusenabled = true;
            $SP->nostruk = $noStruk;
        }else{
            $SP = StrukPelayanan::where('norec', $req['norec'])->first();
            $DelSPD = StrukPelayananDetail::where('nostrukfk', $req['norec'])->delete();
        }
            $SP->objectkelompoktransaksifk = $req['kelompoktransaksifk'];
            $SP->keteranganlainnya = $req['keteranganlainnya'];
            $SP->namapasien_klien = $req['namapasien_klien'];
            if (isset($req['notelp_klien'])){
                $SP->noteleponfaks = $req['notelp_klien'];
            }
            $SP->tglstruk = $req['tglstruk'];
            $SP->totalharusdibayar = $req['totalharusdibayar'];
            $SP->save();

        foreach ($req['details'] as $item) {
            $SPD = new StrukPelayananDetail();
            $norecKS = $SPD->generateNewId();
            $SPD->norec = $norecKS;
            $SPD->kdprofile = 0;
            $SPD->statusenabled = true;
            $SPD->nostrukfk = $SP->norec;
            $SPD->objectprodukfk = $item['id'];
            $SPD->hargadiscount = 0;
            $SPD->hargadiscountgive = 0;
            $SPD->hargadiscountsave = 0;
            $SPD->harganetto = $item['harga'];
            $SPD->hargapph = 0;
            $SPD->hargappn = 0;
            $SPD->hargasatuan = $item['harga'];
            $SPD->hargasatuandijamin = 0;
            $SPD->hargasatuanppenjamin = 0;
            $SPD->hargasatuanpprofile = 0;
            $SPD->hargatambahan = 0;
            $SPD->isonsiteservice = 0;
            $SPD->kdpenjaminpasien = 0;
            $SPD->persendiscount = 0;
            $SPD->qtyproduk = $item['jumlah'];
            $SPD->qtyoranglast = $item['qtyoranglast'];
            $SPD->qtyprodukoutext = 0;
            $SPD->qtyprodukoutint = 0;
            $SPD->qtyprodukretur = 0;
            $SPD->satuan = 0;
            $SPD->tglpelayanan = $req['tglstruk'];
            $SPD->is_terbayar = 0;
            $SPD->linetotal = 0;
            $SPD->iddokter = $item['dokter'];
            if(isset($item['keterangan'])){
                $SPD->keteranganlainnya = $item['keterangan'];
            }
            $SPD->save();
        }
            $transStatus = 'true';
        // } catch (\Exception $e) {
        //     $transStatus = 'false';
        // }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "data" => $SP,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Simpan Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "data" => $SP,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function detailTagihanNonLayanan(Request $request){
        $noRec = $request['noRec'];
        $strukPelayanan = StrukPelayanan::where('norec', $noRec)->first();
//        if($strukPelayanan){
//            //return notfound
//        }
        $strukPelayananDetail = $strukPelayanan->struk_pelayanan_detail;
        $totalBilling= 0;
        $totalKlaim= 0;
        $detailTagihan = array();
        foreach ($strukPelayananDetail as $value){
            $totalBilling = $totalBilling + ($value->harganetto*$value->qtyproduk);
            $totalKlaim = $totalKlaim + ($value->hargasatuanppenjamin*$value->qtyproduk);
            $detailTagihan[] = array(
                'namaLayanan'  => @$value->produk->namaproduk,
                'namaproduk' => @$value->produk->namaproduk,
                'id' => @$value->produk->id,
                'jumlah'  => $value->qtyproduk,
                'qtyoranglast' => $value->qtyoranglast,
                'harga'  => $value->hargasatuan,
                'total'  => $value->hargasatuan * $value->qtyproduk,
                'totalK'  => (($value->hargasatuan * $value->qtyoranglast) * $value->qtyproduk),
                'keterangan' => $value->keteranganlainnya,
            );
        }
        $totalBayar = $totalBilling -$totalKlaim;
        $result =array(
            "tglTransaksi" => $strukPelayanan->tglstruk,
            "namaPasien_klien"  => $strukPelayanan->namapasien_klien,
            "jumlahBayar" => 0,
            "kdkelompokTransaksi" => $strukPelayanan->kelompok_transaksi->id,
            "kelompokTransaksi" => $strukPelayanan->kelompok_transaksi->reportdisplay,
            "notelepon" => $strukPelayanan->noteleponfaks,
            "keterangan" => $strukPelayanan->keteranganlainnya,
            "noRecStruk"  => $strukPelayanan->norec,
            "totalBilling" => $strukPelayanan->totalharusdibayar,
            "detailTagihan"  => $detailTagihan,

        );

        return $this->respond($result, "Detail Tagihan Pasien");
    }

    public function daftarTagihanPasien(Request $request){
        $result = array();
        $filter = $request->all();

        $dataStrukPelayanan= \DB::table('strukpelayanan_t as sp')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'sp.noregistrasifk')
            ->join('pasien_m as p', 'p.id', '=', 'pd.nocmfk')
            ->leftJoin('ruangan_m as r', 'r.id', '=', 'pd.objectruanganlastfk')
            ->leftJoin('departemen_m as dept', 'dept.id', '=', 'r.objectdepartemenfk')
            ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftJoin('kelas_m as k', 'k.id', '=', 'pd.objectkelasfk')
            ->select('pd.noregistrasi', 'p.nocm','p.namapasien','pd.tglregistrasi','pd.tglpulang','r.namaruangan',
                'kp.kelompokpasien','sp.totalharusdibayar','sp.norec', 'sp.nostruk', 'k.namakelas', 'sp.tglstruk',
                'sp.totalprekanan', 'r.id as ruanganId', 'dept.id as departmentId');

        if(isset($filter['noReg']) && $filter['noReg']!="" && $filter['noReg']!="undefined"){
            $dataStrukPelayanan  = $dataStrukPelayanan->where('pd.noregistrasi', $filter['noReg']);
        }

        if(isset($filter['noRm']) && $filter['noRm']!="" && $filter['noRm']!="undefined"){
            $dataStrukPelayanan  = $dataStrukPelayanan->where('p.nocm','like','%'. $filter['noRm'].'%');
        }
//
//        if(isset($filter['tglAwal']) && $filter['tglAwal']!="" && $filter['tglAwal']!="undefined"){
//            $dataStrukPelayanan = $dataStrukPelayanan->where('pd.tglregistrasi','>=', $filter['tglAwal']);
//        }
        if(isset($filter['tglAwal']) && $filter['tglAwal']!="" && $filter['tglAwal']!="undefined"){
            $dataStrukPelayanan = $dataStrukPelayanan->where('sp.tglstruk','>=', $filter['tglAwal']);
        }

//        if(isset($filter['tglAkhir']) && $filter['tglAkhir']!="" && $filter['tglAkhir']!="undefined"){
//            $tgl= $filter['tglAkhir']." 23:59:59";
//            $dataStrukPelayanan = $dataStrukPelayanan->where('pd.tglregistrasi','<=', $tgl);
//        }
        if(isset($filter['tglAkhir']) && $filter['tglAkhir']!="" && $filter['tglAkhir']!="undefined"){
            $tgl= $filter['tglAkhir'];//." 23:59:59";
            $dataStrukPelayanan = $dataStrukPelayanan->where('sp.tglstruk','<=', $tgl);
        }

        if(isset($filter['instalasiId']) && $filter['instalasiId']!="" && $filter['instalasiId']!="undefined"){
            $dataStrukPelayanan = $dataStrukPelayanan->where('dept.id','=', $filter['instalasiId']);
        }

        if(isset($filter['ruanganId']) && $filter['ruanganId']!="" && $filter['ruanganId']!="undefined"){
            $dataStrukPelayanan = $dataStrukPelayanan->where('r.id','=', $filter['ruanganId']);
        }

        if(isset($filter['namaPasien']) && $filter['namaPasien']!="" && $filter['namaPasien']!="undefined"){
            $dataStrukPelayanan = $dataStrukPelayanan->where('p.namapasien','like', '%'.$filter['namaPasien'].'%');
        }

        if(isset($filter['kelompokPasienId']) && $filter['kelompokPasienId']!="" && $filter['kelompokPasienId']!="undefined"){
            $dataStrukPelayanan = $dataStrukPelayanan->where('pd.objectkelompokpasienlastfk','=', $filter['kelompokPasienId']);
        }

//        if($filter['tglAwal']!=""){
//            $dataStrukPelayanan = $dataStrukPelayanan->where('tglregistrasi','>=', $filter['tglAwal']);
//        }
//
//        if($filter['tglAkhir']!=""){
//            $tgl= $filter['tglAkhir']." 23:59:59";
//            $dataStrukPelayanan = $dataStrukPelayanan->where('tglregistrasi','<=', $tgl);
//        }
        if(isset($filter['status']) && $filter['status']!=""){
            if($filter['status']=='Lunas'){
                $dataStrukPelayanan  = $dataStrukPelayanan->whereNotNull('sp.nosbmlastfk');
            }else{
                $dataStrukPelayanan  = $dataStrukPelayanan->whereNull('sp.nosbmlastfk');
            }
        }
        $dataStrukPelayanan = $dataStrukPelayanan->take(50);
        $dataStrukPelayanan = $dataStrukPelayanan->whereNull('sp.statusenabled');
        $dataStrukPelayanan  = $dataStrukPelayanan->whereNotNull('sp.totalharusdibayar');
        $dataStrukPelayanan  = $dataStrukPelayanan->where('sp.totalharusdibayar','<>',0);
        $dataStrukPelayanan  = $dataStrukPelayanan->whereNotNull('sp.noregistrasifk');
        if(!empty($filter['tglAwal']) && !empty($filter['tglAkhir']) && empty($filter['noReg']) && empty($filter['noRm']) && empty($filter['status']) && empty($filter['ruanganId']) && empty($filter['namaPasien']) && empty($filter['instalasiId'])){
            $dataStrukPelayanan = $dataStrukPelayanan->get();
        }else if (empty($filter['tglAwal']) && empty($filter['tglAkhir']) && empty($filter['noReg']) && empty($filter['noRm']) && empty($filter['status']) && empty($filter['ruanganId']) && empty($filter['namaPasien']) && empty($filter['instalasiId'])) {
            $dataStrukPelayanan = $dataStrukPelayanan->limit(10)->get();
        }else if(!empty($filter['tglAwal']) && !empty($filter['tglAkhir']) && empty($filter['noReg']) && empty($filter['noRm']) && empty($filter['status'])&& empty( $filter['ruanganId']) && empty($filter['namaPasien']) && $filter['instalasiId'] == "undefined"){
            $dataStrukPelayanan = $dataStrukPelayanan->limit(10)->get();
        } else{
            $dataStrukPelayanan    = $dataStrukPelayanan->get();
        }

        foreach ($dataStrukPelayanan as $key => $item){
            $sp=StrukPelayanan::find($item->norec);
            $result[] = array(
                'noRec' => $item->norec,
                'tglStruk' => $item->tglstruk,
                'tglMasuk' => $item->tglregistrasi,
                'tglPulang' => $item->tglpulang,
                'noRegistrasi' => $item->noregistrasi,
                'namaPasien' => $item->namapasien,
                'noCm' => $item->nocm,
                'kelasRawat' => $item->namakelas,
                'lastRuangan' => $item->namaruangan,
                'jenisPasien' => $item->kelompokpasien,
                'kelasPenjamin' => "-", //ambilnya dari mana ?
                'totalBilling' => $item->totalharusdibayar,
                'totalKlaim' => $item->totalprekanan ,
                'totalBayar' => $item->totalharusdibayar,
                'statusBayar' => $sp->statusBayar,
                'ruanganId' => $item->ruanganId,
                'departmentId' => $item->departmentId,
            );
        }
        return $this->respond($result, 'Data Daftar Pasien');
    }

    public function detailTagihanPasien(Request $request){
        $noRecStrukPelayanan = $request['noRecStrukPelayanan'];
        $strukPelayanan = StrukPelayanan::where('norec', $noRecStrukPelayanan)->first();
        if($strukPelayanan){
            //return notfound
        }
        $pelayanan_pasien = $strukPelayanan->pelayanan_pasien;
        $deposit= 0;
        $detailTagihan = array();
    
        foreach ($pelayanan_pasien as $value){
            $harga = ($value->hargajual==null) ? 0 : $value->hargajual;
            $diskon = ($value->hargadiscount==null) ? 0 : $value->hargadiscount;
            $jasa = ($value->jasa==null) ? 0 : $value->jasa;
            // $harga = $harga + $jasa;
            if($value->nilainormal== -1){
                $deposit += $harga;
            }else{
                $detailTagihan[] = array(
                    'namaLayanan'  => $value->produk->namaproduk,
                    "ruangan" => @$value->antrian_pasien_diperiksa->ruangan->reportdisplay,
                    'jumlah'  => $value->jumlah,
                    'harga'  => $harga,
                    'diskon'  => $diskon,
                    'total'  => (($harga-$diskon) * $value->jumlah)+$jasa,
                );
            }

        }

        $noregistasi =$strukPelayanan->pasien_daftar->noregistrasi;
        $result =array(
            "noRegistrasi"  => $strukPelayanan->pasien_daftar->noregistrasi,
            "noCm"  => $strukPelayanan->pasien_daftar->pasien->nocm,
            "namaPasien"  => $strukPelayanan->pasien_daftar->pasien->namapasien,
            "jenisPenjamin"  => $strukPelayanan->pasien_daftar->kelompok_pasien->kelompokpasien,
            "jenisKelamin"  => $strukPelayanan->pasien_daftar->pasien->jenis_kelamin->jeniskelamin,
            "umur"  => $strukPelayanan->pasien_daftar->pasien->Umur,
            "totalDeposit"  => $this->getDepositPasien($noregistasi),// $deposit,
            "jumlahBayar"  => $strukPelayanan->totalharusdibayar,//+ $this->getDepositPasien($noregistasi),
            "totalPenjamin" => ($strukPelayanan->totalprekanan==null) ? 0 : $strukPelayanan->totalprekanan,
            "detailTagihan"  => $detailTagihan,

        );
        return $this->respond($result, "Detail Tagihan Pasien");
    }

    public function daftarPiutang(Request $request){
        $filter = $request->all();
        $dataPiutang= \DB::table('strukpelayananpenjamin_t as spp')
            ->join('strukpelayanan_t as sp', 'sp.norec', '=', 'spp.nostrukfk')
            ->join('pasien_m as p', 'p.id', '=', 'sp.nocmfk')
            ->join('pasiendaftar_t as pd', 'sp.noregistrasifk', '=', 'pd.norec')
            ->join('ruangan_m as ru','ru.id','=','pd.objectruanganlastfk')
            ->leftjoin('rekanan_m as rkn', 'rkn.id', '=', 'pd.objectrekananfk')
            ->join('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftjoin('postinghutangpiutang_t as php', 'php.nostrukfk', '=', 'spp.norec')
            ->leftjoin('strukposting_t as spt', 'spt.noposting', '=', 'php.noposting')
            ->select('kp.kelompokpasien', 'spp.norec','pd.tglpulang as tglstruk', 'pd.noregistrasi', 'pd.tglregistrasi','p.nocm',
                'p.namapasien','ru.namaruangan','spp.totalppenjamin','spp.totalharusdibayar',
                'spp.totalsudahdibayar',  'spp.totalbiaya', 'spp.noverifikasi','rkn.namarekanan','php.noposting','spt.statusenabled',
                'pd.norec as norec_pd','php.statusenabled as sttts')
            ->whereNotNull('spp.noverifikasi')
            ->whereNull('sp.statusenabled');

        if(isset($filter['tglAwal']) && $filter['tglAwal']!=""){
            $dataPiutang = $dataPiutang->where('pd.tglpulang','>=', $filter['tglAwal']);
        }

        if(isset($filter['tglAkhir']) && $filter['tglAkhir']!=""){
            $tgl= $filter['tglAkhir']." 23:59:59";
            $dataPiutang = $dataPiutang->where('pd.tglpulang','<=', $tgl);
        }

        if(isset($filter['kelompokpasienfk']) && $filter['kelompokpasienfk']!=""){
            $dataPiutang = $dataPiutang->where('pd.objectkelompokpasienlastfk','=', $filter['kelompokpasienfk']);
        }

        if(isset($filter['penjaminID']) && $filter['penjaminID']!=""){
            $dataPiutang = $dataPiutang->where('pd.objectkelompokpasienlastfk','=', $filter['penjaminID']);
        }
        if(isset($filter['rekananfk']) && $filter['rekananfk']!=""){
            $dataPiutang = $dataPiutang->where('pd.objectrekananfk','=', $filter['rekananfk']);
        }

        if(isset($filter['ruanganId']) && $filter['ruanganId']!=""){
            $dataPiutang = $dataPiutang->where('ru.id','=', $filter['ruanganId']);
        }
        if(isset($filter['namaPasien']) && $filter['namaPasien']!=""){
            $dataPiutang = $dataPiutang->where('p.namapasien','like', '%'.$filter['namaPasien'].'%');
        }
        if(isset($filter['noregistrasi']) && $filter['noregistrasi']!=""){
            $dataPiutang = $dataPiutang->where('pd.noregistrasi','like', '%'.$filter['noregistrasi'].'');
        }
        if(isset($filter['nocm']) && $filter['nocm']!=""){
            $dataPiutang = $dataPiutang->where('p.nocm','=', $filter['nocm']);
        }
        $dataPiutang =$dataPiutang->get();
        $result = array();
        foreach ($dataPiutang as $item) {
            if ($item->statusenabled ==  1 || is_null($item->statusenabled)) {
                if ($item->sttts == 1 || is_null($item->sttts)) {
                    if ($item->totalppenjamin > $item->totalsudahdibayar) {
                        if (!isset($item->noposting)) {
                            $status = 'Piutang';
                        } else {
                            $status = 'Collecting';
                        }
                    } else {
                        $status = 'Lunas';
                    }

                    $result[] = array(
                        'noRec' => $item->norec,
                        'tglTransaksi' => $item->tglstruk,
                        'noRegistrasi' => $item->noregistrasi,
                        'namaPasien' => $item->namapasien,
                        'ruangan'=>$item->namaruangan,
                        'kelasRawat' => $item->kelompokpasien,
                        'jenisPasien' => $item->kelompokpasien,
                        'umur' => $this->hitungUmur($item->tglstruk),
                        'kelasPenjamin' => "-",
                        'totalBilling' => $item->totalbiaya,
                        'totalKlaim' => $item->totalppenjamin,
                        'totalBayar' => $item->totalsudahdibayar,
                        'rekanan' => $item->namarekanan,
                        'status' => $status,
                        'norec_pd' => $item->norec_pd,
                        'noposting' => $item->noposting,
                        'stts' => $item->statusenabled,
                        'deposit' => $this->getDepositPasien($item->noregistrasi),
                    );
                }
            }
        }
        return $this->respond($result, 'Data Piutang Layanan');
    }

    public function daftarPasienAktif(Request $request){

        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as p', 'p.id', '=', 'pd.nocmfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftJoin('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            ->join('antrianpasiendiperiksa_t as apd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->select('pd.tglregistrasi', 'p.nocm', 'pd.noregistrasi', 'ru.namaruangan', 'p.namapasien', 'kp.kelompokpasien',
                'pd.tglpulang', 'pd.statuspasien')
            ->whereNull('pd.tglpulang');

        $filter = $request->all();
//        if(isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
//            $tgl0 = $filter['tglAwal'] . " 00:00:00";
//            $data = $data->where('pd.tglregistrasi', '>=', $tgl0);
//        }
//
//        if(isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
//            $tgl = $filter['tglAkhir'] . " 23:59:59";
//            $data = $data->where('pd.tglregistrasi', '<=', $tgl);
//        }

        if(isset($filter['instalasiId']) && $filter['instalasiId'] != "" && $filter['instalasiId'] != "undefined") {
            $data = $data->where('dept.id', '=', $filter['instalasiId']);
        }

        if(isset($filter['ruanganId']) && $filter['ruanganId'] != "" && $filter['ruanganId'] != "undefined") {
            $data = $data->where('ru.id', '=', $filter['ruanganId']);
        }

        if(isset($filter['namaPasien']) && $filter['namaPasien'] != "" && $filter['namaPasien'] != "undefined") {
            $data = $data->where('p.namapasien', 'like', '%' . $filter['namaPasien'] . '%');
        }

        if(isset($filter['noReg']) && $filter['noReg'] != "" && $filter['noReg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', 'like', '%' . $filter['noReg'] . '%');
        }

        $data = $data->groupBy('pd.tglregistrasi', 'p.nocm', 'pd.noregistrasi', 'ru.namaruangan', 'p.namapasien', 'kp.kelompokpasien',
            'pd.tglpulang', 'pd.statuspasien');

        $data = $data->get();

        $result = array();
        foreach ($data as $pasienD) {
            $result[] = array(
                'tanggalMasuk' => $pasienD->tglregistrasi,
                'noCm' => $pasienD->nocm,
                'noRegistrasi' => $pasienD->noregistrasi,
                'namaRuangan' => $pasienD->namaruangan,
                'namaPasien' => $pasienD->namapasien,
                'jenisAsuransi' => $pasienD->kelompokpasien,
                'tanggalPulang' => $pasienD->tglpulang,
                'status' => $pasienD->statuspasien
            );
        }
        return $this->respond($result);
    }

    public function daftarSBM(Request $request){

        $dataLogin=$request->all();
        $data = \DB::table('strukbuktipenerimaan_t as sbm')
            ->join('strukpelayanan_t as sp', 'sbm.nostrukfk', '=', 'sp.norec')
            ->leftjoin('pasiendaftar_t as pd', 'sp.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftjoin('loginuser_s as lu', 'lu.id', '=', 'sbm.objectpegawaipenerimafk')
            ->leftjoin('pegawai_m as p', 'p.id', '=', 'lu.objectpegawaifk')
            ->leftjoin('pasien_m as ps', 'ps.id', '=', 'sp.nocmfk')
            ->leftjoin('strukbuktipenerimaancarabayar_t as sbmcr', 'sbmcr.nosbmfk', '=', 'sbm.norec')
            ->leftjoin('carabayar_m as cb', 'cb.id', '=', 'sbmcr.objectcarabayarfk')
            ->leftjoin('kelompoktransaksi_m as kt', 'kt.id', '=', 'sbm.objectkelompoktransaksifk')
            ->leftjoin('strukclosing_t as sc', 'sc.norec', '=', 'sbm.noclosingfk')
            ->leftjoin('strukverifikasi_t as sv', 'sv.norec', '=', 'sbm.noverifikasifk')
            ->select('sbm.norec as noRec','sbm.diterimadari','cb.carabayar as caraBayar','sbmcr.objectcarabayarfk as idCaraBayar','sbm.objectkelompoktransaksifk as idKelTransaksi',
                'kt.kelompoktransaksi as kelTransaksi','sbm.keteranganlainnya as keterangan','p.id as idPegawai','p.namalengkap as namaPenerima',
                'sc.noclosing as noClosing','sbm.nosbm as noSbm','sv.noverifikasi as noVerifikasi','sc.tglclosing as tglClosing',
                'sbm.tglsbm as tglSbm','sv.tglverifikasi as tglVerif','sbm.totaldibayar as totalPenerimaan','pd.noregistrasi','ps.namapasien',
                'sp.norec as norec_sp','ru.id as ruid','ru.namaruangan','sp.namapasien_klien','ps.nocm','sbm.iscorona',
                db::raw(" '' as terbilang")
            
            );

        $filter = $request->all();
        if(isset($filter['dateStartTglSbm']) && $filter['dateStartTglSbm'] != "" && $filter['dateStartTglSbm'] != "undefined") {
            $tgl2 = $filter['dateStartTglSbm'] ;//. " 00:00:00";
            $data = $data->where('sbm.tglsbm', '>=', $tgl2);
        }
        if(isset($filter['dateEndTglSbm']) && $filter['dateEndTglSbm'] != "" && $filter['dateEndTglSbm'] != "undefined") {
            $tgl = $filter['dateEndTglSbm'] ;//. " 23:59:59";
            $data = $data->where('sbm.tglsbm', '<=', $tgl);
        }
        // if(isset($filter['idPegawai']) && $filter['idPegawai'] != "" && $filter['idPegawai'] != "undefined") {
        //     $data = $data->where('p.id', '=', $filter['idPegawai']);
        // }
        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $arrKasir = explode(',',$request['idPegawai']) ;
            $kodeRuang = [];
            foreach ( $arrKasir as $item){
                $kodeRuang[] = (int) $item;
            }
            $data = $data->whereIn('p.id',$kodeRuang);
        }
        if(isset($filter['idCaraBayar']) && $filter['idCaraBayar'] != "" && $filter['idCaraBayar'] != "undefined") {
            $data = $data->where('cb.id', '=', $filter['idCaraBayar']);
        }
        if(isset($filter['idKelTransaksi']) && $filter['idKelTransaksi'] != "" && $filter['idKelTransaksi'] != "undefined") {
            $data = $data->where('kt.id', $filter['idKelTransaksi']);
        }
        if(isset($filter['ins']) && $filter['ins'] != "" && $filter['ins'] != "undefined") {
            $data = $data->where('ru.objectdepartemenfk', $filter['ins']);
        }
        if(isset($filter['nosbm']) && $filter['nosbm'] != "" && $filter['nosbm'] != "undefined") {
            $data = $data->where('sbm.nosbm','ilike','%'.$filter['nosbm'].'%');
        }
        if(isset($filter['nocm']) && $filter['nocm'] != "" && $filter['nocm'] != "undefined") {
            $data = $data->where('ps.nocm','ilike','%'.$filter['nocm'].'%');
        }
        if(isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $data = $data->where('ps.namapasien','ilike','%'.$filter['nama'].'%');
        }
        if(isset($filter['desk']) && $filter['desk'] != "" && $filter['desk'] != "undefined") {
            $data = $data->where('sp.namapasien_klien','ilike','%'.$filter['desk'].'%');
        }
         
//        $data = $data->take($request['jmlRows']);
        $data = $data->groupBy('sbm.norec','cb.carabayar','sbmcr.objectcarabayarfk','sbm.objectkelompoktransaksifk',
        'kt.kelompoktransaksi','sbm.keteranganlainnya','p.id','p.namalengkap',
        'sc.noclosing','sbm.nosbm','sv.noverifikasi','sc.tglclosing',
        'sbm.tglsbm','sv.tglverifikasi','sbm.totaldibayar','pd.noregistrasi','ps.namapasien',
        'sp.norec','ru.id','ru.namaruangan','sp.namapasien_klien','ps.nocm','sbm.iscorona');
        $data = $data->get();
        //  $result = array(
        //      'noRec'=>$data->noRec,
        //      'caraBayar'=>$data->caraBayar,
        //      'idCaraBayar'=>$data->idCaraBayar,
        //      'idKelTransaksi'=>$data->idKelTransaksi,
        //      'kelTransaksi'=>$data->kelTransaksi,
        //      'keterangan'=>$data->keterangan,
        //      'idPegawai'=>$data->idPegawai,
        //      'namaPenerima'=>$data->namaPenerima,
        //      'noClosing'=>$data->noClosing,
        //      'noSbm'=>$data->noSbm,
        //      'noVerifikasi'=>$data-> noVerifikasi,
        //      'tglClosing'=>$data->tglClosing,
        //      'tglSbm'=>$data->tglSbm,
        //      'tglVerif'=>$data-> tglVerif,
        //      'totalPenerimaan'=>$data->totalPenerimaan,
        //      'noregistrasi'=>$data->noregistrasi,
        //      'namapasien'=>$data->namapasien,
        //      'norec_sp'=>$data->norec_sp,
        //      'ruid'=>$data->ruid,
        //      'namaruangan'=>$data->namaruangan,
        //      'namapasien_klien'=>$data->namapasien_klien,
        //      'nocm'=>$data->nocm,
        //      'iscorona'=>$data->iscorona,
        //      'terbilang'=>ucwords($this->makeTerbilang($data->terbilang, ' rupiah'))

        // );
        return $this->respond($data);
    }
    public function daftarSBMRajal(Request $request){

        $dataLogin=$request->all();
        ini_set('max_execution_time', 500);
        $data = \DB::table('strukbuktipenerimaan_t as sbm')
            ->join('strukpelayanan_t as sp', 'sbm.nostrukfk', '=', 'sp.norec')
            ->leftjoin('pasiendaftar_t as pd', 'sp.noregistrasifk', '=', 'pd.norec')
            ->join('pelayananpasien_t as pp', 'pp.strukfk', '=', 'sp.norec')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
            // ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftjoin('loginuser_s as lu', 'lu.id', '=', 'sbm.objectpegawaipenerimafk')
            ->leftjoin('pegawai_m as p', 'p.id', '=', 'lu.objectpegawaifk')
            ->leftjoin('pasien_m as ps', 'ps.id', '=', 'sp.nocmfk')
            ->leftjoin('strukbuktipenerimaancarabayar_t as sbmcr', 'sbmcr.nosbmfk', '=', 'sbm.norec')
            ->leftjoin('carabayar_m as cb', 'cb.id', '=', 'sbmcr.objectcarabayarfk')
            ->leftjoin('kelompoktransaksi_m as kt', 'kt.id', '=', 'sbm.objectkelompoktransaksifk')
            ->leftjoin('strukclosing_t as sc', 'sc.norec', '=', 'sbm.noclosingfk')
            ->leftjoin('strukverifikasi_t as sv', 'sv.norec', '=', 'sbm.noverifikasifk')
            ->select('sbm.norec as noRec','cb.carabayar as caraBayar','sbmcr.objectcarabayarfk as idCaraBayar','sbm.objectkelompoktransaksifk as idKelTransaksi',
                'kt.kelompoktransaksi as kelTransaksi','sbm.keteranganlainnya as keterangan','p.id as idPegawai','p.namalengkap as namaPenerima',
                'sc.noclosing as noClosing','sbm.nosbm as noSbm','sv.noverifikasi as noVerifikasi','sc.tglclosing as tglClosing',
                'sbm.tglsbm as tglSbm','sv.tglverifikasi as tglVerif','sbm.totaldibayar as totalPenerimaan','pd.noregistrasi','ps.namapasien',
                'sp.norec as norec_sp','ru.id as ruid','ru.namaruangan','sp.namapasien_klien','ps.nocm','sbm.iscorona',
                db::raw(" '' as terbilang")
            
            )
            ->where('sbm.keteranganlainnya', 'Pembayaran Tagihan Pasien');

        $filter = $request->all();
        if(isset($filter['dateStartTglSbm']) && $filter['dateStartTglSbm'] != "" && $filter['dateStartTglSbm'] != "undefined") {
            $tgl2 = $filter['dateStartTglSbm'] ;//. " 00:00:00";
            $data = $data->where('sbm.tglsbm', '>=', $tgl2);
        }
        if(isset($filter['dateEndTglSbm']) && $filter['dateEndTglSbm'] != "" && $filter['dateEndTglSbm'] != "undefined") {
            $tgl = $filter['dateEndTglSbm'] ;//. " 23:59:59";
            $data = $data->where('sbm.tglsbm', '<=', $tgl);
        }
        // if(isset($filter['idPegawai']) && $filter['idPegawai'] != "" && $filter['idPegawai'] != "undefined") {
        //     $data = $data->where('p.id', '=', $filter['idPegawai']);
        // }
        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $arrKasir = explode(',',$request['idPegawai']) ;
            $kodeRuang = [];
            foreach ( $arrKasir as $item){
                $kodeRuang[] = (int) $item;
            }
            $data = $data->whereIn('p.id',$kodeRuang);
        }
        if(isset($filter['idCaraBayar']) && $filter['idCaraBayar'] != "" && $filter['idCaraBayar'] != "undefined") {
            $data = $data->where('cb.id', '=', $filter['idCaraBayar']);
        }
        if(isset($filter['idKelTransaksi']) && $filter['idKelTransaksi'] != "" && $filter['idKelTransaksi'] != "undefined") {
            $data = $data->where('kt.id', $filter['idKelTransaksi']);
        }
        if(isset($filter['ins']) && $filter['ins'] != "" && $filter['ins'] != "undefined") {
            $data = $data->where('ru.objectdepartemenfk', $filter['ins']);
        }
        if(isset($filter['nosbm']) && $filter['nosbm'] != "" && $filter['nosbm'] != "undefined") {
            $data = $data->where('sbm.nosbm','like','%'.$filter['nosbm'].'%');
        }
        if(isset($filter['nocm']) && $filter['nocm'] != "" && $filter['nocm'] != "undefined") {
            $data = $data->where('ps.nocm','like','%'.$filter['nocm'].'%');
        }
        if(isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $data = $data->where('ps.namapasien','like','%'.$filter['nama'].'%');
        }
        if(isset($filter['desk']) && $filter['desk'] != "" && $filter['desk'] != "undefined") {
            $data = $data->where('sp.namapasien_klien','like','%'.$filter['desk'].'%');
        }
         
//        $data = $data->take($request['jmlRows']);
        $data = $data->groupBy('sbm.norec','cb.carabayar','sbmcr.objectcarabayarfk','sbm.objectkelompoktransaksifk',
        'kt.kelompoktransaksi','sbm.keteranganlainnya','p.id','p.namalengkap',
        'sc.noclosing','sbm.nosbm','sv.noverifikasi','sc.tglclosing',
        'sbm.tglsbm','sv.tglverifikasi','sbm.totaldibayar','pd.noregistrasi','ps.namapasien',
        'sp.norec','ru.id','ru.namaruangan','sp.namapasien_klien','ps.nocm','sbm.iscorona');
        $data = $data->get();
        //  $result = array(
        //      'noRec'=>$data->noRec,
        //      'caraBayar'=>$data->caraBayar,
        //      'idCaraBayar'=>$data->idCaraBayar,
        //      'idKelTransaksi'=>$data->idKelTransaksi,
        //      'kelTransaksi'=>$data->kelTransaksi,
        //      'keterangan'=>$data->keterangan,
        //      'idPegawai'=>$data->idPegawai,
        //      'namaPenerima'=>$data->namaPenerima,
        //      'noClosing'=>$data->noClosing,
        //      'noSbm'=>$data->noSbm,
        //      'noVerifikasi'=>$data-> noVerifikasi,
        //      'tglClosing'=>$data->tglClosing,
        //      'tglSbm'=>$data->tglSbm,
        //      'tglVerif'=>$data-> tglVerif,
        //      'totalPenerimaan'=>$data->totalPenerimaan,
        //      'noregistrasi'=>$data->noregistrasi,
        //      'namapasien'=>$data->namapasien,
        //      'norec_sp'=>$data->norec_sp,
        //      'ruid'=>$data->ruid,
        //      'namaruangan'=>$data->namaruangan,
        //      'namapasien_klien'=>$data->namapasien_klien,
        //      'nocm'=>$data->nocm,
        //      'iscorona'=>$data->iscorona,
        //      'terbilang'=>ucwords($this->makeTerbilang($data->terbilang, ' rupiah'))

        // );
        return $this->respond($data);
    }public function daftarSBMRajalNonLayanan(Request $request){

        $dataLogin=$request->all();
        ini_set('max_execution_time', 500);
        $data = \DB::table('strukbuktipenerimaan_t as sbm')
            ->join('strukpelayanan_t as sp', 'sbm.nostrukfk', '=', 'sp.norec')
            ->leftjoin('pasiendaftar_t as pd', 'sp.noregistrasifk', '=', 'pd.norec')
            // ->leftjoin('pelayananpasien_t as pp', 'pp.strukfk', '=', 'sp.norec')
            // ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            // ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftjoin('loginuser_s as lu', 'lu.id', '=', 'sbm.objectpegawaipenerimafk')
            ->leftjoin('pegawai_m as p', 'p.id', '=', 'lu.objectpegawaifk')
            ->leftjoin('pasien_m as ps', 'ps.id', '=', 'sp.nocmfk')
            ->leftjoin('strukbuktipenerimaancarabayar_t as sbmcr', 'sbmcr.nosbmfk', '=', 'sbm.norec')
            ->leftjoin('carabayar_m as cb', 'cb.id', '=', 'sbmcr.objectcarabayarfk')
            ->leftjoin('kelompoktransaksi_m as kt', 'kt.id', '=', 'sbm.objectkelompoktransaksifk')
            ->leftjoin('strukclosing_t as sc', 'sc.norec', '=', 'sbm.noclosingfk')
            ->leftjoin('strukverifikasi_t as sv', 'sv.norec', '=', 'sbm.noverifikasifk')
            ->select('sbm.norec as noRec','cb.carabayar as caraBayar','sbmcr.objectcarabayarfk as idCaraBayar','sbm.objectkelompoktransaksifk as idKelTransaksi',
                'kt.kelompoktransaksi as kelTransaksi','sbm.keteranganlainnya as keterangan','p.id as idPegawai','p.namalengkap as namaPenerima',
                'sc.noclosing as noClosing','sbm.nosbm as noSbm','sv.noverifikasi as noVerifikasi','sc.tglclosing as tglClosing',
                'sbm.tglsbm as tglSbm','sv.tglverifikasi as tglVerif','sbm.totaldibayar as totalPenerimaan','ps.namapasien',
                'sp.norec as norec_sp','sp.namapasien_klien','ps.nocm','sbm.iscorona','ru.id','ru.namaruangan','pd.noregistrasi',
                db::raw(" '' as terbilang")
            
    )
            ->where('sbm.keteranganlainnya', '!=', 'Pembayaran Tagihan Pasien');

        $filter = $request->all();
        if(isset($filter['dateStartTglSbm']) && $filter['dateStartTglSbm'] != "" && $filter['dateStartTglSbm'] != "undefined") {
            $tgl2 = $filter['dateStartTglSbm'] ;//. " 00:00:00";
            $data = $data->where('sbm.tglsbm', '>=', $tgl2);
        }
        if(isset($filter['dateEndTglSbm']) && $filter['dateEndTglSbm'] != "" && $filter['dateEndTglSbm'] != "undefined") {
            $tgl = $filter['dateEndTglSbm'] ;//. " 23:59:59";
            $data = $data->where('sbm.tglsbm', '<=', $tgl);
        }
        // if(isset($filter['idPegawai']) && $filter['idPegawai'] != "" && $filter['idPegawai'] != "undefined") {
        //     $data = $data->where('p.id', '=', $filter['idPegawai']);
        // }
        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $arrKasir = explode(',',$request['idPegawai']) ;
            $kodeRuang = [];
            foreach ( $arrKasir as $item){
                $kodeRuang[] = (int) $item;
            }
            $data = $data->whereIn('p.id',$kodeRuang);
        }
        if(isset($filter['idCaraBayar']) && $filter['idCaraBayar'] != "" && $filter['idCaraBayar'] != "undefined") {
            $data = $data->where('cb.id', '=', $filter['idCaraBayar']);
        }
        if(isset($filter['idKelTransaksi']) && $filter['idKelTransaksi'] != "" && $filter['idKelTransaksi'] != "undefined") {
            $data = $data->where('kt.id', $filter['idKelTransaksi']);
        }
        if(isset($filter['ins']) && $filter['ins'] != "" && $filter['ins'] != "undefined") {
            $data = $data->where('ru.objectdepartemenfk', $filter['ins']);
        }
        if(isset($filter['nosbm']) && $filter['nosbm'] != "" && $filter['nosbm'] != "undefined") {
            $data = $data->where('sbm.nosbm','like','%'.$filter['nosbm'].'%');
        }
        if(isset($filter['nocm']) && $filter['nocm'] != "" && $filter['nocm'] != "undefined") {
            $data = $data->where('ps.nocm','like','%'.$filter['nocm'].'%');
        }
        if(isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $data = $data->where('ps.namapasien','like','%'.$filter['nama'].'%');
        }
        if(isset($filter['desk']) && $filter['desk'] != "" && $filter['desk'] != "undefined") {
            $data = $data->where('sp.namapasien_klien','like','%'.$filter['desk'].'%');
        }
         
//        $data = $data->take($request['jmlRows']);
        $data = $data->groupBy('sbm.norec','cb.carabayar','sbmcr.objectcarabayarfk','sbm.objectkelompoktransaksifk',
        'kt.kelompoktransaksi','sbm.keteranganlainnya','p.id','p.namalengkap',
        'sc.noclosing','sbm.nosbm','sv.noverifikasi','sc.tglclosing',
        'sbm.tglsbm','sv.tglverifikasi','sbm.totaldibayar','ps.namapasien',
        'sp.norec','sp.namapasien_klien','ps.nocm','sbm.iscorona','ru.id','ru.namaruangan','pd.noregistrasi');
        $data = $data->get();
        //  $result = array(
        //      'noRec'=>$data->noRec,
        //      'caraBayar'=>$data->caraBayar,
        //      'idCaraBayar'=>$data->idCaraBayar,
        //      'idKelTransaksi'=>$data->idKelTransaksi,
        //      'kelTransaksi'=>$data->kelTransaksi,
        //      'keterangan'=>$data->keterangan,
        //      'idPegawai'=>$data->idPegawai,
        //      'namaPenerima'=>$data->namaPenerima,
        //      'noClosing'=>$data->noClosing,
        //      'noSbm'=>$data->noSbm,
        //      'noVerifikasi'=>$data-> noVerifikasi,
        //      'tglClosing'=>$data->tglClosing,
        //      'tglSbm'=>$data->tglSbm,
        //      'tglVerif'=>$data-> tglVerif,
        //      'totalPenerimaan'=>$data->totalPenerimaan,
        //      'noregistrasi'=>$data->noregistrasi,
        //      'namapasien'=>$data->namapasien,
        //      'norec_sp'=>$data->norec_sp,
        //      'ruid'=>$data->ruid,
        //      'namaruangan'=>$data->namaruangan,
        //      'namapasien_klien'=>$data->namapasien_klien,
        //      'nocm'=>$data->nocm,
        //      'iscorona'=>$data->iscorona,
        //      'terbilang'=>ucwords($this->makeTerbilang($data->terbilang, ' rupiah'))

        // );
        return $this->respond($data);
    }
    public function daftarSBMIgd(Request $request){

        $dataLogin=$request->all();
        ini_set('max_execution_time', 500);
        $data = \DB::table('strukbuktipenerimaan_t as sbm')
            ->join('strukpelayanan_t as sp', 'sbm.nostrukfk', '=', 'sp.norec')
            ->leftjoin('pasiendaftar_t as pd', 'sp.noregistrasifk', '=', 'pd.norec')
            ->join('pelayananpasien_t as pp', 'pp.strukfk', '=', 'sp.norec')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
            // ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftjoin('loginuser_s as lu', 'lu.id', '=', 'sbm.objectpegawaipenerimafk')
            ->leftjoin('pegawai_m as p', 'p.id', '=', 'lu.objectpegawaifk')
            ->leftjoin('pasien_m as ps', 'ps.id', '=', 'sp.nocmfk')
            ->leftjoin('strukbuktipenerimaancarabayar_t as sbmcr', 'sbmcr.nosbmfk', '=', 'sbm.norec')
            ->leftjoin('carabayar_m as cb', 'cb.id', '=', 'sbmcr.objectcarabayarfk')
            ->leftjoin('kelompoktransaksi_m as kt', 'kt.id', '=', 'sbm.objectkelompoktransaksifk')
            ->leftjoin('strukclosing_t as sc', 'sc.norec', '=', 'sbm.noclosingfk')
            ->leftjoin('strukverifikasi_t as sv', 'sv.norec', '=', 'sbm.noverifikasifk')
            ->select('sbm.norec as noRec','cb.carabayar as caraBayar','sbmcr.objectcarabayarfk as idCaraBayar','sbm.objectkelompoktransaksifk as idKelTransaksi',
                'kt.kelompoktransaksi as kelTransaksi','sbm.keteranganlainnya as keterangan','p.id as idPegawai','p.namalengkap as namaPenerima',
                'sc.noclosing as noClosing','sbm.nosbm as noSbm','sv.noverifikasi as noVerifikasi','sc.tglclosing as tglClosing',
                'sbm.tglsbm as tglSbm','sv.tglverifikasi as tglVerif','sbm.totaldibayar as totalPenerimaan','pd.noregistrasi','ps.namapasien',
                'sp.norec as norec_sp','ru.id as ruid','ru.namaruangan','sp.namapasien_klien','ps.nocm','sbm.iscorona',
                db::raw(" '' as terbilang")
            
            )
            ->whereIn('sbm.keteranganlainnya', ['Pembayaran Tagihan Pasien','PELAYANAN TINDAKAN']);

        $filter = $request->all();
        if(isset($filter['dateStartTglSbm']) && $filter['dateStartTglSbm'] != "" && $filter['dateStartTglSbm'] != "undefined") {
            $tgl2 = $filter['dateStartTglSbm'] ;//. " 00:00:00";
            $data = $data->where('sbm.tglsbm', '>=', $tgl2);
        }
        if(isset($filter['dateEndTglSbm']) && $filter['dateEndTglSbm'] != "" && $filter['dateEndTglSbm'] != "undefined") {
            $tgl = $filter['dateEndTglSbm'] ;//. " 23:59:59";
            $data = $data->where('sbm.tglsbm', '<=', $tgl);
        }
        // if(isset($filter['idPegawai']) && $filter['idPegawai'] != "" && $filter['idPegawai'] != "undefined") {
        //     $data = $data->where('p.id', '=', $filter['idPegawai']);
        // }
        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $arrKasir = explode(',',$request['idPegawai']) ;
            $kodeRuang = [];
            foreach ( $arrKasir as $item){
                $kodeRuang[] = (int) $item;
            }
            $data = $data->whereIn('p.id',$kodeRuang);
        }
        if(isset($filter['idCaraBayar']) && $filter['idCaraBayar'] != "" && $filter['idCaraBayar'] != "undefined") {
            $data = $data->where('cb.id', '=', $filter['idCaraBayar']);
        }
        if(isset($filter['idKelTransaksi']) && $filter['idKelTransaksi'] != "" && $filter['idKelTransaksi'] != "undefined") {
            $data = $data->where('kt.id', $filter['idKelTransaksi']);
        }
        if(isset($filter['ins']) && $filter['ins'] != "" && $filter['ins'] != "undefined") {
            $data = $data->where('ru.objectdepartemenfk', $filter['ins']);
        }
        if(isset($filter['nosbm']) && $filter['nosbm'] != "" && $filter['nosbm'] != "undefined") {
            $data = $data->where('sbm.nosbm','like','%'.$filter['nosbm'].'%');
        }
        if(isset($filter['nocm']) && $filter['nocm'] != "" && $filter['nocm'] != "undefined") {
            $data = $data->where('ps.nocm','like','%'.$filter['nocm'].'%');
        }
        if(isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $data = $data->where('ps.namapasien','like','%'.$filter['nama'].'%');
        }
        if(isset($filter['desk']) && $filter['desk'] != "" && $filter['desk'] != "undefined") {
            $data = $data->where('sp.namapasien_klien','like','%'.$filter['desk'].'%');
        }
         
//        $data = $data->take($request['jmlRows']);
        $data = $data->groupBy('sbm.norec','cb.carabayar','sbmcr.objectcarabayarfk','sbm.objectkelompoktransaksifk',
        'kt.kelompoktransaksi','sbm.keteranganlainnya','p.id','p.namalengkap',
        'sc.noclosing','sbm.nosbm','sv.noverifikasi','sc.tglclosing',
        'sbm.tglsbm','sv.tglverifikasi','sbm.totaldibayar','pd.noregistrasi','ps.namapasien',
        'sp.norec','ru.id','ru.namaruangan','sp.namapasien_klien','ps.nocm','sbm.iscorona');
        $data = $data->get();
        //  $result = array(
        //      'noRec'=>$data->noRec,
        //      'caraBayar'=>$data->caraBayar,
        //      'idCaraBayar'=>$data->idCaraBayar,
        //      'idKelTransaksi'=>$data->idKelTransaksi,
        //      'kelTransaksi'=>$data->kelTransaksi,
        //      'keterangan'=>$data->keterangan,
        //      'idPegawai'=>$data->idPegawai,
        //      'namaPenerima'=>$data->namaPenerima,
        //      'noClosing'=>$data->noClosing,
        //      'noSbm'=>$data->noSbm,
        //      'noVerifikasi'=>$data-> noVerifikasi,
        //      'tglClosing'=>$data->tglClosing,
        //      'tglSbm'=>$data->tglSbm,
        //      'tglVerif'=>$data-> tglVerif,
        //      'totalPenerimaan'=>$data->totalPenerimaan,
        //      'noregistrasi'=>$data->noregistrasi,
        //      'namapasien'=>$data->namapasien,
        //      'norec_sp'=>$data->norec_sp,
        //      'ruid'=>$data->ruid,
        //      'namaruangan'=>$data->namaruangan,
        //      'namapasien_klien'=>$data->namapasien_klien,
        //      'nocm'=>$data->nocm,
        //      'iscorona'=>$data->iscorona,
        //      'terbilang'=>ucwords($this->makeTerbilang($data->terbilang, ' rupiah'))

        // );
        return $this->respond($data);
    }public function daftarSBMIgdNonLayanan(Request $request){

        $dataLogin=$request->all();
        ini_set('max_execution_time', 500);
        $data = \DB::table('strukbuktipenerimaan_t as sbm')
            ->join('strukpelayanan_t as sp', 'sbm.nostrukfk', '=', 'sp.norec')
            ->leftjoin('pasiendaftar_t as pd', 'sp.noregistrasifk', '=', 'pd.norec')
            // ->leftjoin('pelayananpasien_t as pp', 'pp.strukfk', '=', 'sp.norec')
            // ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            // ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftjoin('loginuser_s as lu', 'lu.id', '=', 'sbm.objectpegawaipenerimafk')
            ->leftjoin('pegawai_m as p', 'p.id', '=', 'lu.objectpegawaifk')
            ->leftjoin('pasien_m as ps', 'ps.id', '=', 'sp.nocmfk')
            ->leftjoin('strukbuktipenerimaancarabayar_t as sbmcr', 'sbmcr.nosbmfk', '=', 'sbm.norec')
            ->leftjoin('carabayar_m as cb', 'cb.id', '=', 'sbmcr.objectcarabayarfk')
            ->leftjoin('kelompoktransaksi_m as kt', 'kt.id', '=', 'sbm.objectkelompoktransaksifk')
            ->leftjoin('strukclosing_t as sc', 'sc.norec', '=', 'sbm.noclosingfk')
            ->leftjoin('strukverifikasi_t as sv', 'sv.norec', '=', 'sbm.noverifikasifk')
            ->select('sbm.norec as noRec','cb.carabayar as caraBayar','sbmcr.objectcarabayarfk as idCaraBayar','sbm.objectkelompoktransaksifk as idKelTransaksi',
                'kt.kelompoktransaksi as kelTransaksi','sbm.keteranganlainnya as keterangan','p.id as idPegawai','p.namalengkap as namaPenerima',
                'sc.noclosing as noClosing','sbm.nosbm as noSbm','sv.noverifikasi as noVerifikasi','sc.tglclosing as tglClosing',
                'sbm.tglsbm as tglSbm','sv.tglverifikasi as tglVerif','sbm.totaldibayar as totalPenerimaan','ps.namapasien',
                'sp.norec as norec_sp','sp.namapasien_klien','ps.nocm','sbm.iscorona','ru.id','ru.namaruangan','pd.noregistrasi',
                db::raw(" '' as terbilang")
            
    )
            ->whereNotIn('sbm.keteranganlainnya', ['Pembayaran Tagihan Pasien','PELAYANAN TINDAKAN']);

        $filter = $request->all();
        if(isset($filter['dateStartTglSbm']) && $filter['dateStartTglSbm'] != "" && $filter['dateStartTglSbm'] != "undefined") {
            $tgl2 = $filter['dateStartTglSbm'] ;//. " 00:00:00";
            $data = $data->where('sbm.tglsbm', '>=', $tgl2);
        }
        if(isset($filter['dateEndTglSbm']) && $filter['dateEndTglSbm'] != "" && $filter['dateEndTglSbm'] != "undefined") {
            $tgl = $filter['dateEndTglSbm'] ;//. " 23:59:59";
            $data = $data->where('sbm.tglsbm', '<=', $tgl);
        }
        // if(isset($filter['idPegawai']) && $filter['idPegawai'] != "" && $filter['idPegawai'] != "undefined") {
        //     $data = $data->where('p.id', '=', $filter['idPegawai']);
        // }
        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $arrKasir = explode(',',$request['idPegawai']) ;
            $kodeRuang = [];
            foreach ( $arrKasir as $item){
                $kodeRuang[] = (int) $item;
            }
            $data = $data->whereIn('p.id',$kodeRuang);
        }
        if(isset($filter['idCaraBayar']) && $filter['idCaraBayar'] != "" && $filter['idCaraBayar'] != "undefined") {
            $data = $data->where('cb.id', '=', $filter['idCaraBayar']);
        }
        if(isset($filter['idKelTransaksi']) && $filter['idKelTransaksi'] != "" && $filter['idKelTransaksi'] != "undefined") {
            $data = $data->where('kt.id', $filter['idKelTransaksi']);
        }
        if(isset($filter['ins']) && $filter['ins'] != "" && $filter['ins'] != "undefined") {
            $data = $data->where('ru.objectdepartemenfk', $filter['ins']);
        }
        if(isset($filter['nosbm']) && $filter['nosbm'] != "" && $filter['nosbm'] != "undefined") {
            $data = $data->where('sbm.nosbm','like','%'.$filter['nosbm'].'%');
        }
        if(isset($filter['nocm']) && $filter['nocm'] != "" && $filter['nocm'] != "undefined") {
            $data = $data->where('ps.nocm','like','%'.$filter['nocm'].'%');
        }
        if(isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $data = $data->where('ps.namapasien','like','%'.$filter['nama'].'%');
        }
        if(isset($filter['desk']) && $filter['desk'] != "" && $filter['desk'] != "undefined") {
            $data = $data->where('sp.namapasien_klien','like','%'.$filter['desk'].'%');
        }
         
//        $data = $data->take($request['jmlRows']);
        $data = $data->groupBy('sbm.norec','cb.carabayar','sbmcr.objectcarabayarfk','sbm.objectkelompoktransaksifk',
        'kt.kelompoktransaksi','sbm.keteranganlainnya','p.id','p.namalengkap',
        'sc.noclosing','sbm.nosbm','sv.noverifikasi','sc.tglclosing',
        'sbm.tglsbm','sv.tglverifikasi','sbm.totaldibayar','ps.namapasien',
        'sp.norec','sp.namapasien_klien','ps.nocm','sbm.iscorona','ru.id','ru.namaruangan','pd.noregistrasi');
        $data = $data->get();
        //  $result = array(
        //      'noRec'=>$data->noRec,
        //      'caraBayar'=>$data->caraBayar,
        //      'idCaraBayar'=>$data->idCaraBayar,
        //      'idKelTransaksi'=>$data->idKelTransaksi,
        //      'kelTransaksi'=>$data->kelTransaksi,
        //      'keterangan'=>$data->keterangan,
        //      'idPegawai'=>$data->idPegawai,
        //      'namaPenerima'=>$data->namaPenerima,
        //      'noClosing'=>$data->noClosing,
        //      'noSbm'=>$data->noSbm,
        //      'noVerifikasi'=>$data-> noVerifikasi,
        //      'tglClosing'=>$data->tglClosing,
        //      'tglSbm'=>$data->tglSbm,
        //      'tglVerif'=>$data-> tglVerif,
        //      'totalPenerimaan'=>$data->totalPenerimaan,
        //      'noregistrasi'=>$data->noregistrasi,
        //      'namapasien'=>$data->namapasien,
        //      'norec_sp'=>$data->norec_sp,
        //      'ruid'=>$data->ruid,
        //      'namaruangan'=>$data->namaruangan,
        //      'namapasien_klien'=>$data->namapasien_klien,
        //      'nocm'=>$data->nocm,
        //      'iscorona'=>$data->iscorona,
        //      'terbilang'=>ucwords($this->makeTerbilang($data->terbilang, ' rupiah'))

        // );
        return $this->respond($data);
    }

    public function saveLogBatalBayar(Request $request){
        \DB::beginTransaction();
        $transStatus = true;
        $dataLogin = $request->all();

        $pasienDaftar = PasienDaftar::where('noregistrasi', $request['noregistrasi'])->first();
        $pasien = Pasien::where('id',$pasienDaftar->nocmfk)->first();
        $newId = LoggingUser::max('id');
        $newId = $newId +1;
        $logUser = new LoggingUser();
        $logUser->id = $newId;
        $logUser->norec = $logUser->generateNewId();
        $logUser->kdprofile= 11;
        $logUser->statusenabled=true;
        $logUser->jenislog = 'Batal Bayar';
        $logUser->noreff = $pasienDaftar->norec;
        $logUser->referensi='norec Pasien Daftar';
        $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
        $logUser->tanggal = $this->getDateTime()->format('Y-m-d H:i:s');
        $logUser->keterangan ='No SBM - '.$request['nosbm'].' atas nama '.$pasien->namapasien .' ( '.$pasien->nocm.' ) No Registrasi '.$pasienDaftar->noregistrasi;
        $logUser->save();


        if ($transStatus == true) {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => 'Inhuman'
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => 'Inhuman'
            );
        }
        return $this->respond($result);
    }

    protected function UbahCaraBayar(Request $request){
        \DB::beginTransaction();
        $transStatus = 'true';
        try{
            $data = StrukBuktiPenerimaanCaraBayar::where('nosbmfk', $request['norec_sbm'])
                ->update([
                        'objectcarabayarfk' => $request['idCaraBayar']
                    ]
                );
        }
        catch(\Exception $e){
            $transStatus = 'false';
            $transMsg =   "Batal Pembayaran Gagal {SP}";

        }

        //JURNAL
        //jurnal verif sP
        $logAcc =new  LogAcc;
        $logAcc->norec = $logAcc->generateNewId();
        $logAcc->jenistransaksi = 'Ubah Pembayaran Tagihan';
        $logAcc->noreff = $request['norec_sbm'];
        $logAcc->status = 0;
        $logAcc->tanggal = $this->getDateTime()->format('Y-m-d H:i:s');
        try{
            $logAcc->save();
        }
        catch(\Exception $e){
            $transStatus = 'false';
            $transMsg =   "Simpan logAcc Gagal {SP}";

        }
        //END jurnal verif sP

        if ($transStatus == 'true') {
            $transMsg = "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMsg,
                "as" => 'as@epic',
            );
        } else {
            $transMsg = "Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMsg,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMsg);
    }

    protected function deletePembayaranTagihan(Request $request){
        \DB::beginTransaction();
        try{
            $produkDeposit =$this->getProdukIdDeposit();
            $noreg = $request['noregistrasi'];
            $sbm = StrukBuktiPenerimaan::where('nostrukfk', $request['norec_sp'])->first();
            if ($request['isdeposit'] == true) {
                $getPP = DB::select(DB::raw("select pp.norec ,pp.produkfk,prd.namaproduk,pp.hargasatuan 
                            from pasiendaftar_t as pd
                            inner join antrianpasiendiperiksa_t as apd on pd.norec=apd.noregistrasifk
                            inner join pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                            inner join produk_m as prd on prd.id=pp.produkfk
                            where pd.noregistrasi ='$noreg' and pp.produkfk='$produkDeposit'" ));
                if (count($getPP) > 0) {
                    foreach ($getPP as $item) {
                        if ($item->hargasatuan == $sbm['totaldibayar']) {
                            $pelayananPasien = PelayananPasien::where('norec', $item->norec)
                                ->delete();
                        }
                    }
                }
            }

            $strukPelayanan = StrukPelayanan::where('norec', $request['norec_sp'])
                ->update([
                        'nosbmlastfk'    => null,
                    ]
                );
            $strukBuktiPenerimanan = StrukBuktiPenerimaan::where('nostrukfk', $request['norec_sp'])
                ->where('nosbm', $request['nosbm'])
                ->update([
                        'statusenabled' => false,
                        'nostrukfk'    => null,
                    ]
                );
            $pasienDaftar = PasienDaftar::where('nostruklastfk', $request['norec_sp'])
                ->update([
                        'nosbmlastfk'    => null,
                    ]
                );
            $norecsp = $request['norec_sp'];
            $data = \DB::select(DB::raw("select * from strukpelayananpenjamin_t where nostrukfk = '$norecsp'"));
            $totalsudahdibayar = 0;
            foreach ($data as $itm) {
                $penerimaan = $request['totalpenerimaan'];
                $totalsudahdibayar = $itm->totalsudahdibayar;
                $totalsudahdibayar = $totalsudahdibayar -   $penerimaan;
            }
            $strukPelayananPenjamin = StrukPelayananPenjamin::where('nostrukfk', $request['norec_sp'])
                ->update([
                        'totalsudahdibayar' => $totalsudahdibayar,
                    ]
                );
        $transStatus = 'true';
        }catch(\Exception $e){
            $transStatus = 'false';
            $transMsg =   "Batal Pembayaran Gagal {SP}";
        }

        //JURNAL
        //jurnal verif sP
        $logAcc =new  LogAcc;
        $logAcc->norec = $logAcc->generateNewId();
        $logAcc->jenistransaksi = 'Batal Pembayaran Tagihan';
        $logAcc->noreff = $request['norec_sp'];
        $logAcc->status = 0;
        $logAcc->tanggal = $this->getDateTime()->format('Y-m-d H:i:s');
        try{
            $logAcc->save();
        }
        catch(\Exception $e){
            $transStatus = 'false';
            $transMsg =   "Simpan logAcc Gagal {SP}";

        }
        //END jurnal verif sP

        if ($transStatus == 'true') {
            $transMsg = "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMsg,
                "as" => 'as@epic',
            );
        } else {
            $transMsg = "Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMsg,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMsg);
    }

    public function getDataLaporanPenerimaanKasirHarian(Request $request){
        $dataLogin = $request->all();
        $data = \DB::table('strukbuktipenerimaan_t as sbm')
            ->leftJOIN('strukbuktipenerimaancarabayar_t as sbmc', 'sbmc.nosbmfk', '=', 'sbm.norec')
            ->leftJOIN('carabayar_m as cb', 'cb.id', '=', 'sbmc.objectcarabayarfk')
            ->join('strukpelayanan_t as sp', 'sp.norec', '=', 'sbm.nostrukfk')
            ->leftJOIN('loginuser_s as lu', 'lu.id', '=', 'sbm.objectpegawaipenerimafk')
            ->leftJOIN('pegawai_m as pg2', 'pg2.id', '=', 'lu.objectpegawaifk')
            ->leftJOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'sp.noregistrasifk')
            ->leftJOIN('pasien_m as ps', 'ps.id', '=', 'sp.nocmfk')
            ->leftJOIN('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->leftJOIN('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJOIN('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftJoin('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
            ->leftJOIN('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftjoin('strukclosing_t as sc', 'sc.norec', '=', 'sbm.noclosingfk')
            ->select('sbm.tglsbm', 'ps.nocm', 'ru.namaruangan', 'pg.namalengkap', 'pg2.namaexternal as kasir',
                'sp.totalharusdibayar', 'sbm.totaldibayar','sc.tglclosing',
                \DB::raw('( case when pd.noregistrasi is null then sp.nostruk else pd.noregistrasi end) as noregistrasi, 
                (case when ps.namapasien is null then sp.namapasien_klien else ps.namapasien end) as namapasien,
                (case when kp.kelompokpasien is null then null else kp.kelompokpasien end) as kelompokpasien,
                (CASE WHEN sp.totalprekanan is null then 0 else sp.totalprekanan end) as hutangpenjamin,
                (case when cb.id = 1 then sbm.totaldibayar else 0 end) as tunai, 
                (case when cb.id > 1 then sbm.totaldibayar else 0 end) as nontunai')
            );

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('sbm.tglsbm', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];//." 23:59:59";
            $data = $data->where('sbm.tglsbm', '<=', $request['tglAkhir']);
        }
        if (isset($request['listKasir']) && $request['listKasir'] != "" && $request['listKasir'] != "undefined") {
           

            $arrKasir = explode(',',$request['listKasir']) ;
            $kodeRuang = [];
            foreach ( $arrKasir as $item){
                $kodeRuang[] = (int) $item;
            }
            $data = $data->wherein('pg2.id',  $kodeRuang);

        }
        if (isset($request['idDokter']) && $request['idDokter'] != "" && $request['idDokter'] != "undefined") {
            $data = $data->where('pd.objectpegawaifk', '=', $request['idDokter']);
        }
        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
            $data = $data->where('ru.objectdepartemenfk', '=', $request['idDept']);
        }
        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
            $data = $data->where('pd.objectruanganlastfk', '=', $request['idRuangan']);
        }
        if (isset($request['kelompokPasien']) && $request['kelompokPasien'] != "" && $request['kelompokPasien'] != "undefined") {
            $data = $data->where('kp.id', '=', $request['kelompokPasien']);
        }


        $data = $data->orderBy('pd.noregistrasi', 'ASC');

        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'egie@epic'
        );
        return $this->respond($result);
    }

    public function getDataLaporanPenerimaanKasirPerusahaan(Request $request){
        $dataLogin = $request->all();
        $data = \DB::table('strukpelayananpenjamin_t as spp')
            ->join('strukpelayanan_t as sp', 'sp.norec', '=', 'spp.nostrukfk')
            ->join('pelayananpasien_t as pp', 'pp.strukfk', '=', 'sp.norec')
            ->join('antrianpasiendiperiksa_t as ap', 'ap.norec', '=', 'pp.noregistrasifk')
            ->join('pasiendaftar_t as pd ', 'pd.norec', '=', 'ap.noregistrasifk')
            ->JOIN('pasien_m as p', 'p.id', '=', 'pd.nocmfk')
            ->leftJOIN('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJOIN('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftJoin('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
            ->leftJOIN('rekanan_m as r', 'r.id', '=', 'spp.kdrekananpenjamin')
            ->leftJOIN('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->select('kp.kelompokpasien', 'spp.norec', 'sp.tglstruk', 'pd.noregistrasi', 'pd.tglregistrasi',
                'p.nocm', 'p.namapasien', 'ru.namaruangan', 'pg.namalengkap', 'spp.totalppenjamin', 'spp.totalharusdibayar',
                'spp.totalsudahdibayar',
                'spp.totalbiaya', 'spp.noverifikasi',
                \DB::raw('(spp.totalharusdibayar - spp.totalppenjamin) as sisaBayar'))
            ->where('kp.id', '=', 5);

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('sp.tglstruk', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];//." 23:59:59";
            $data = $data->where('sp.tglstruk', '<=', $tgl);
        }
        if (isset($request['idDokter']) && $request['idDokter'] != "" && $request['idDokter'] != "undefined") {
            $data = $data->where('pg.id', '=', $request['idDokter']);
        }
        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
            $data = $data->where('ru.objectdepartemenfk', '=', $request['idDept']);
        }
        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
            $data = $data->where('ru.id', '=', $request['idRuangan']);
        }
        $data = $data->groupBy('kp.kelompokpasien', 'spp.norec', 'sp.tglstruk', 'pd.noregistrasi', 'pd.tglregistrasi',
            'p.nocm', 'p.namapasien', 'ru.namaruangan', 'pg.namalengkap', 'spp.totalppenjamin', 'spp.totalharusdibayar',
            'spp.totalsudahdibayar',
            'spp.totalbiaya','spp.noverifikasi');
        $data = $data->orderBy('pd.noregistrasi', 'ASC');
        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'egie@epic'
        );
        return $this->respond($result);
    }

    public function getDataLapPendapatan(Request $request){
        $dataLogin = $request->all();

        $data = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->join('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
            ->join('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->join('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
            ->join('jenisproduk_m as jp', 'jp.id', '=', 'djp.objectjenisprodukfk')
            ->join('kelompokproduk_m as kp', 'kp.id', '=', 'jp.objectkelompokprodukfk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->join('kelompokpasien_m as kps', 'kps.id', '=', 'pd.objectkelompokpasienlastfk')
            ->join('strukpelayanan_t as sp', 'sp.noregistrasifk', '=', 'pd.norec')
            ->select('apd.objectruanganfk', 'ru.namaruangan', 'apd.objectpegawaifk', 'pg.namalengkap', 'ps.nocm',
                'ps.namapasien', 'pd.noregistrasi', 'kps.kelompokpasien',
                \DB::raw('sum(case when pr.id =395 then pp.hargajual* pp.jumlah else 0 end) as karcis,
                         sum(CASE WHEN kp.id = 26 THEN pp.hargajual* pp.jumlah ELSE 0 END) as konsul,
                         sum(case when pr.id =10013116  then pp.hargajual* pp.jumlah else 0 end) as embos,
                         sum(case when kp.id in (1,2,3,4,8,9,10,11,13,14) then pp.hargajual* pp.jumlah else 0 end) as tindakan,
                         sum((case when pp.hargadiscount is null then 0 else pp.hargadiscount end)* pp.jumlah) as diskon,
                         sum(case when pr.id =395 then pp.hargajual* pp.jumlah else 0 end)
                         +sum(case when pr.id =10013116  then pp.hargajual* pp.jumlah else 0 end)
                         +sum(case when kp.id = 26 then pp.hargajual* pp.jumlah else 0 end)
                         +sum(case when kp.id in (1,2,3,4,8,9,10,11,13,14) then pp.hargajual* pp.jumlah else 0 end)
                         -sum((case when pp.hargadiscount is null then 0 else pp.hargadiscount end)* pp.jumlah) as total,
                          (case when pd.objectkelompokpasienlastfk > 1 then 0 end) as NonPj')
            )
            ->where('djp.objectjenisprodukfk', '<>', 97)
            ->whereNull('sp.statusenabled');
//            ->where('ru.objectdepartemenfk', 18);

        $kelompokpasiens = array('1', '3', '5');
        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];//." 23:59:59";
            $data = $data->where('pd.tglregistrasi', '<=', $tgl);
        }
        if (isset($request['idDokter']) && $request['idDokter'] != "" && $request['idDokter'] != "undefined") {
            $data = $data->where('apd.objectpegawaifk', '=', $request['idDokter']);
        }
        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
            if ($request['idDept'] == '12345') {
                $data = $data->wherein('ru.objectdepartemenfk', [3,14,16,17,18,19,24,25,26,27,28,35]);
            } else {
                $data = $data->where('ru.objectdepartemenfk', '=', $request['idDept']);
            }
        }
        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
            $data = $data->where('apd.objectruanganfk', '=', $request['idRuangan']);
        }
        if (isset($request['kelompokPasien']) && $request['kelompokPasien'] != "" && $request['kelompokPasien'] != "undefined") {
            if ($request['kelompokPasien'] == 153) {
                $data = $data->wherein('kps.id', [1, 5, 3]);
            } else {
                $data = $data->where('kps.id', '=', $request['kelompokPasien']);
            }
        }

        $data = $data->groupBy('apd.objectruanganfk', 'ru.namaruangan', 'apd.objectpegawaifk', 'pg.namalengkap',
            'ps.nocm', 'ps.namapasien', 'pd.noregistrasi', 'kps.kelompokpasien', 'pd.objectkelompokpasienlastfk',
            'sp.norec');
        $data = $data->orderBy('pd.noregistrasi', 'ASC');
        $data = $data->distinct();
        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'egie@epic'
        );
        return $this->respond($result);
    }

    public function getDataLaporanPendapatanRuangan(Request $request){
        $dataLogin = $request->all();
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $idDept = '';
        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
            $idDept = ' and x.objectdepartemenfk =  ' . $request['idDept'];
        }
        $idRuangan='';
        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
            $idRuangan = ' and x.objectruanganfk = ' . $request['idRuangan'];
        }
        $idKelompok='';
        if (isset($request['kelompokPasien']) && $request['kelompokPasien'] != "" && $request['kelompokPasien'] != "undefined") {
            $idKelompok = 'and x.objectkelompokpasienlastfk = '. $request['kelompokPasien'];
        }
        $idDokter = ' ';
        if (isset($request['idDokter']) && $request['idDokter'] != "" && $request['idDokter'] != "undefined") {
            $idDokter = 'and x.pegawaifk  = '. $request['idDokter'];
        }


        $strstr = "SELECT sp.statusenabled,pj.nojurnal_intern,pj.keteranganlainnya,
                    apd.objectruanganfk,ru.namaruangan,pg.namalengkap,ps.nocm,upper(ps.namapasien) AS namapasien,pr.id AS prid,
                        CASE
                            WHEN pp.produkfk in (395) THEN 
                            CASE
                                WHEN pp.hargajual IS NULL THEN 0
                                ELSE pp.hargajual
                            END * pp.jumlah +
                            CASE
                                WHEN pp.jasa IS NULL THEN 0
                                ELSE pp.jasa
                            END
                            ELSE 0
                        END AS administrasi,
                        CASE
                            WHEN pp.produkfk in (395) THEN 
															
case when pjd.hargasatuand = 0 then pjd.hargasatuank else pjd.hargasatuand end
				
	ELSE 0
                        END AS administrasijurnal,
                        CASE
                            WHEN pp.produkfk not in(395, 10011572, 10011571, 402611) AND djp.objectjenisprodukfk = 101 THEN 
                            CASE
                                WHEN pp.hargajual IS NULL THEN 0
                                ELSE pp.hargajual
                            END * pp.jumlah +
                            CASE
                                WHEN pp.jasa IS NULL THEN 0
                                ELSE pp.jasa
                            END
                            ELSE 0
                        END AS visite,
                        CASE
                            WHEN pp.produkfk not in(395, 10011572, 10011571, 402611) AND djp.objectjenisprodukfk = 101 THEN 
															
case when pjd.hargasatuand = 0 then pjd.hargasatuank else pjd.hargasatuand end
				
	ELSE 0
                        END AS visitejurnal,
                        CASE
                            WHEN pp.produkfk not in(395, 10011572, 10011571, 402611) AND djp.objectjenisprodukfk = 100 THEN 
                            CASE
                                WHEN pp.hargajual IS NULL THEN 0
                                ELSE pp.hargajual
                            END * pp.jumlah +
                            CASE
                                WHEN pp.jasa IS NULL THEN 0
                                ELSE pp.jasa
                            END
                            ELSE 0
                        END AS konsultasi,
                        CASE
                            WHEN pp.produkfk not in(395, 10011572, 10011571, 402611) AND djp.objectjenisprodukfk = 100 THEN 
                            case when pjd.hargasatuand = 0 then pjd.hargasatuank else pjd.hargasatuand end
                            ELSE 0
                        END AS konsultasijurnal,
                        CASE
                            WHEN pp.produkfk not in(395, 10011572, 10011571, 402611) AND djp.objectjenisprodukfk = 99 THEN 
                            CASE
                                WHEN pp.hargajual IS NULL THEN 0
                                ELSE pp.hargajual
                            END * pp.jumlah +
                            CASE
                                WHEN pp.jasa IS NULL THEN 0
                                ELSE pp.jasa
                            END
                            ELSE 0
                        END AS akomodasi,
                        CASE
                            WHEN pp.produkfk not in(395, 10011572, 10011571, 402611) AND djp.objectjenisprodukfk = 99 THEN 
                            case when pjd.hargasatuand = 0 then pjd.hargasatuank else pjd.hargasatuand end
                            ELSE 0
                        END AS akomodasijurnal,
                        CASE
                            WHEN pp.produkfk not in(395, 10011572, 10011571, 402611) AND djp.objectjenisprodukfk = 27666 THEN 
                            CASE
                                WHEN pp.hargajual IS NULL THEN 0
                                ELSE pp.hargajual
                            END * pp.jumlah +
                            CASE
                                WHEN pp.jasa IS NULL THEN 0
                                ELSE pp.jasa
                            END
                            ELSE 0
                        END AS alatcanggih,
                        CASE
                            WHEN pp.produkfk not in(395, 10011572, 10011571, 402611) AND djp.objectjenisprodukfk = 27666 THEN 
                            case when pjd.hargasatuand = 0 then pjd.hargasatuank else pjd.hargasatuand end
                            ELSE 0
                        END AS alatcanggihjurnal,
                        CASE
                            WHEN pp.produkfk not in(395, 10011572, 10011571, 402611) AND djp.objectjenisprodukfk = 97 THEN 
                            CASE
                                WHEN pp.hargajual IS NULL THEN 0
                                ELSE pp.hargajual
                            END * pp.jumlah +
                            CASE
                                WHEN pp.jasa IS NULL THEN 0
                                ELSE pp.jasa
                            END
                            ELSE 0
                        END AS obatalkes,
                        CASE
                            WHEN pp.produkfk not in(395, 10011572, 10011571, 402611) AND djp.objectjenisprodukfk = 97 THEN 
                            case when pjd.hargasatuand = 0 then pjd.hargasatuank else pjd.hargasatuand end
                            ELSE 0
                        END AS obatalkesjurnal,
                        CASE
                            WHEN pp.produkfk not in(395, 10011572, 10011571, 402611) AND djp.objectjenisprodukfk not in(97, 101, 100, 99, 27666) THEN 
                            CASE
                                WHEN pp.hargajual IS NULL THEN 0
                                ELSE pp.hargajual
                            END * pp.jumlah +
                            CASE
                                WHEN pp.jasa IS NULL THEN 0
                                ELSE pp.jasa
                            END
                            ELSE 0
                        END AS tindakan,
                        CASE
                            WHEN pp.produkfk not in(395, 10011572, 10011571, 402611) AND djp.objectjenisprodukfk not in(97, 101, 100, 99, 27666) THEN 
                            case when pjd.hargasatuand = 0 then pjd.hargasatuank else pjd.hargasatuand end
                            ELSE 0
                        END AS tindakanjurnal,
                    
                        CASE
                            WHEN pp.hargadiscount IS NULL THEN 0
                            ELSE pp.hargadiscount
                        END * pp.jumlah AS diskon,
                    
                        CASE
                            WHEN pp.hargadiscount IS NULL and pj.deskripsiproduktransaksi != 'diskon' THEN 0
                            ELSE case when pjd.hargasatuand = 0 then pjd.hargasatuank else pjd.hargasatuand end
                        END * pp.jumlah AS diskonjurnal,
                    pd.noregistrasi,
                    kps.kelompokpasien,
                        CASE
                            WHEN pd.objectkelompokpasienlastfk > 1 THEN '-'
                            ELSE 'v'
                        END AS nonpj,
                        CASE
                            WHEN pd.objectkelompokpasienlastfk = 1 THEN '-'
                            ELSE 'v'
                        END AS pj,
                        CASE
                            WHEN sp.norec IS NULL THEN '-'
                            ELSE 'v'
                        END AS verif,
                    pd.tglregistrasi,
                    pr.objectdetailjenisprodukfk,
                    ru.objectdepartemenfk,
                    pd.objectkelompokpasienlastfk,
                    pg.id AS pegawaifk,
                    djp.objectjenisprodukfk,
                    br.norec AS norecbatal,
                    dp.namadepartemen,
                    pp.produkfk,
                        CASE
                            WHEN pp.produkfk in (402611) THEN 
                            CASE
                                WHEN pp.hargajual IS NULL THEN 0
                                ELSE pp.hargajual
                            END * pp.jumlah +
                            CASE
                                WHEN pp.jasa IS NULL THEN 0
                                ELSE pp.jasa
                            END
                            ELSE 0
                        END AS deposit,
                        CASE
                            WHEN pp.produkfk in (402611) THEN 
                            case when pjd.hargasatuand = 0 then pjd.hargasatuank else pjd.hargasatuand end
                            ELSE 0
                        END AS depositjurnal,
                    pp.tglpelayanan AS tgllayan
                   FROM pasiendaftar_t pd
                     LEFT JOIN antrianpasiendiperiksa_t apd ON apd.noregistrasifk = pd.norec
                     LEFT JOIN pelayananpasien_t pp ON pp.noregistrasifk = apd.norec
                     left JOIN postingjurnaltransaksi_t pj ON pj.norecrelated = pp.norec and pj.deskripsiproduktransaksi ='pelayananpasien_t' 
                     left JOIN postingjurnaltransaksid_t pjd ON pjd.norecrelated = pj.norec and pjd.hargasatuand >0
                     LEFT JOIN pegawai_m pg ON pg.id = apd.objectpegawaifk
                     LEFT JOIN ruangan_m ru ON ru.id = apd.objectruanganfk
                     LEFT JOIN produk_m pr ON pr.id = pp.produkfk
                     LEFT JOIN detailjenisproduk_m djp ON djp.id = pr.objectdetailjenisprodukfk
                     LEFT JOIN pasien_m ps ON ps.id = pd.nocmfk
                     LEFT JOIN kelompokpasien_m kps ON kps.id = pd.objectkelompokpasienlastfk
                     LEFT JOIN strukpelayanan_t sp ON sp.norec = pp.strukfk
                     LEFT JOIN batalregistrasi_t br ON br.pasiendaftarfk = pd.norec
                     LEFT JOIN departemen_m dp ON dp.id = ru.objectdepartemenfk";
        $strstr2 =  " SELECT sp.statusenabled,pj.nojurnal_intern,pj.keteranganlainnya,
                    pd.objectruanganlastfk AS objectruanganfk,
                    ru.namaruangan,
                    pg.namalengkap,
                    ps.nocm,
                    upper(ps.namapasien) AS namapasien,
                    pr.id AS prid,
                        CASE
                            WHEN pp.produkfk in (10011572, 10011571) THEN 
                            CASE
                                WHEN pp.hargajual IS NULL THEN 0
                                ELSE pp.hargajual
                            END * pp.jumlah +
                            CASE
                                WHEN pp.jasa IS NULL THEN 0
                                ELSE pp.jasa
                            END
                            ELSE 0
                        END AS administrasi, 
                        CASE
                            WHEN pp.produkfk in (10011572, 10011571) THEN 
                              case when pjd.hargasatuand = 0 then pjd.hargasatuank else pjd.hargasatuand end
                            ELSE 0
                        END as administrasijurnal,
                    0 AS visite,0 AS visite,
                    0 AS konsultasi,0 AS konsultasijurnal,
                    0 AS akomodasi,0 AS akomodasijurnal,
                    0 AS alatcanggih,0 AS alatcanggihjurnal,
                    0 AS obatalkes,0 AS obatalkesjurnal,
                    0 AS tindakan,0 AS tindakanjurnal,
                    0 AS diskon,0 AS diskonjurnal,
                    pd.noregistrasi,
                    kps.kelompokpasien,
                        CASE
                            WHEN pd.objectkelompokpasienlastfk > 1 THEN '-'
                            ELSE 'v'
                        END AS nonpj,
                        CASE
                            WHEN pd.objectkelompokpasienlastfk = 1 THEN '-'
                            ELSE 'v'
                        END AS pj,
                        CASE
                            WHEN sp.norec IS NULL THEN '-'
                            ELSE 'v'
                        END AS verif,
                    pd.tglregistrasi,
                    pr.objectdetailjenisprodukfk,
                    ru.objectdepartemenfk,
                    pd.objectkelompokpasienlastfk,
                    pg.id AS pegawaifk,
                    djp.objectjenisprodukfk,
                    br.norec AS norecbatal,
                    dp.namadepartemen,
                    pp.produkfk,
                    0 AS deposit,0 as depositjurnal,
                    pp.tglpelayanan AS tgllayan
                   FROM pasiendaftar_t pd
                     LEFT JOIN antrianpasiendiperiksa_t apd ON apd.noregistrasifk = pd.norec
                     LEFT JOIN pelayananpasien_t pp ON pp.noregistrasifk = apd.norec
                     left JOIN postingjurnaltransaksi_t pj ON pj.norecrelated = pp.norec 
                     left JOIN postingjurnaltransaksid_t pjd ON pjd.norecrelated = pj.norec 
                     LEFT JOIN pegawai_m pg ON pg.id = apd.objectpegawaifk
                     LEFT JOIN ruangan_m ru ON ru.id = pd.objectruanganlastfk
                     LEFT JOIN produk_m pr ON pr.id = pp.produkfk
                     LEFT JOIN detailjenisproduk_m djp ON djp.id = pr.objectdetailjenisprodukfk
                     LEFT JOIN pasien_m ps ON ps.id = pd.nocmfk
                     LEFT JOIN kelompokpasien_m kps ON kps.id = pd.objectkelompokpasienlastfk
                     LEFT JOIN strukpelayanan_t sp ON sp.norec = pp.strukfk
                     LEFT JOIN batalregistrasi_t br ON br.pasiendaftarfk = pd.norec
                     LEFT JOIN departemen_m dp ON dp.id = ru.objectdepartemenfk";

        $strLast = $strstr . "  " .
            " union all " .
//                    $strstr . " where pj.deskripsiproduktransaksi ='diskon' and pjd.hargasatuand >0 "  . ' union all ' .
            $strstr2;

        $data = \DB::select(DB::raw("select p.nocm,p.noregistrasi,p.namapasien,p.objectruanganfk,p.namaruangan,p.namalengkap,
			              SUM(p.administrasi) as administrasi,SUM(p.visite) as visite,SUM(p.konsultasi) as konsultasi,SUM(p.akomodasi) as akomodasi,
			              SUM(p.alatcanggih) as alatcanggih,SUM(p.obatalkes) as obatalkes, SUM(p.tindakan) as tindakan,SUM(p.deposit) as deposit,
				          SUM(p.diskon) as diskon,
				           SUM(case when p.administrasijurnal is null then 0 else p.administrasijurnal end) as administrasij,
				           SUM(case when p.visitejurnal is null then 0 else p.visitejurnal end) as visitej,
				           SUM(case when p.konsultasijurnal is null then 0 else p.konsultasijurnal end) as konsultasij,
				           SUM(case when p.akomodasijurnal is null then 0 else p.akomodasijurnal end) as akomodasij,
			               SUM(case when p.alatcanggihjurnal is null then 0 else p.alatcanggihjurnal end) as alatcanggihj,
			               SUM(case when p.obatalkesjurnal is null then 0 else p.obatalkesjurnal end) as obatalkesj, 
			               SUM(case when p.tindakanjurnal is null then 0 else p.tindakanjurnal end) as tindakanj, 
			              SUM(p.deposit) as deposit,SUM(p.depositjurnal) as depositj,
				          SUM(p.diskonjurnal) as diskonj,p.nojurnal_intern,p.keteranganlainnya,
				          p.kelompokpasien,p.nonpj,p.pj,p.verif from
                          (select x.*
                          from ($strLast) as x
                          where
                                        x.tgllayan >= '$tglAwal' and x.tgllayan <= '$tglAkhir'
                                        $idDept
                                        $idKelompok
                                        $idRuangan
                                        $idDokter
                                        --and p.noregistrasi='1810021802'
                         ) as p
                         GROUP BY p.noregistrasi,p.nocm,p.namapasien,p.objectruanganfk,p.namaruangan,
                                  p.namalengkap,p.kelompokpasien,p.nonpj,p.nojurnal_intern,p.pj,p.verif,p.keteranganlainnya"));
        $dataBEda = [];
        $sama = false;
        $dataGroupNoJurnal = [];
        foreach ($data as $itm){
            if ((float)$itm->administrasi != (float)$itm->administrasij){
                $dataBEda[] =$itm;
            }
            if ((float)$itm->visite != (float)$itm->visitej){
                $dataBEda[] =$itm;
            }
            if ((float)$itm->konsultasi != (float)$itm->konsultasij){
                $dataBEda[] =$itm;
            }
            if ((float)$itm->akomodasi != (float)$itm->akomodasij){
                $dataBEda[] =$itm;
            }
            if ((float)$itm->alatcanggih != (float)$itm->alatcanggihj){
                $dataBEda[] =$itm;
            }
            if ((float)$itm->obatalkes != (float)$itm->obatalkesj){
                $dataBEda[] =$itm;
            }
            if ((float)$itm->tindakan != (float)$itm->tindakanj){
                $dataBEda[] =$itm;
            }
            $sama=false;
            foreach ($dataGroupNoJurnal as $items) {
                if ($items['nojurnal_intern'] == $itm->nojurnal_intern) {
                    $sama = true;
                    break;
                }
            }
            if ($sama == false) {
                $dataGroupNoJurnal[] =  array(
                    'nojurnal_intern' => $itm->nojurnal_intern,
                    'keteranganlainnya' => $itm->keteranganlainnya,
                );
            }

        }

        $result = array(
            'data' => $data,
            'dataselisih' => $dataBEda,
            'data_jurnal' => $dataGroupNoJurnal,
            'as' => 'efan@epic',
            'edited1' => 'as@epic - 18xxxx',
            'edited2' => 'as@epic - 190415',
        );
        return $this->respond($result);
    }

    public function getDataLaporanPiutangPenjamin(Request $request){
        $dataLogin = $request->all();
        $data = \DB::table('strukpelayananpenjamin_t as spp')
            // ->LEFTJOIN ('pelayananpasien_t as pp','pp.strukfk','=','sp.norec')
            ->JOIN('strukpelayanan_t as sp', 'sp.norec', '=', 'spp.nostrukfk')
            ->JOIN('pelayananpasien_t as pp', 'pp.strukfk', '=', 'sp.norec')
            ->LEFTJOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->JOIN('antrianpasiendiperiksa_t as ap', 'ap.norec', '=', 'pp.noregistrasifk')
            ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'ap.noregistrasifk')
            ->LEFTJOIN('ruangan_m as ru', 'ru.id', '=', 'ap.objectruanganfk')
            ->join('departemen_m as dpt', 'dpt.id', '=', 'ru.objectdepartemenfk')
            ->JOIN('pasien_m as p', 'p.id', '=', 'pd.nocmfk')
            ->JOIN('postinghutangpiutang_t as php', 'php.nostrukfk', '=', 'spp.norec')
            ->JOIN('strukposting_t as stp', 'stp.noposting', '=', 'php.noposting')
            ->LEFTJOIN('rekanan_m as r', 'r.id', '=', 'pd.objectrekananfk')
            ->LEFTJOIN('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->LEFTJOIN('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
            ->LEFTJOIN('jenisproduk_m as jp', 'jp.id', '=', 'djp.objectjenisprodukfk')
            ->LEFTJOIN('kelompokproduk_m as kpr', 'kpr.id', '=', 'jp.objectkelompokprodukfk')
            ->select('kp.kelompokpasien', 'spp.norec', 'stp.tglposting', 'pd.noregistrasi', 'pd.tglregistrasi',
                'p.nocm', 'p.namapasien',
                'ru.namaruangan',
                \DB::raw('case when pr.id =395 then pp.hargajual* pp.jumlah else 0 end as karcis,
                        case when pr.id =10013116  then pp.hargajual* pp.jumlah else 0 end as embos,
                        case when kpr.id = 26 then pp.hargajual* pp.jumlah else 0 end as konsul,
                        case when kpr.id in (1,2,3,4,8,9,10,11,13,14) then pp.hargajual* pp.jumlah else 0 end as tindakan,
                        (case when pp.hargadiscount is null then 0 else pp.hargadiscount end)* pp.jumlah as diskon,
                        (case when pr.objectdetailjenisprodukfk=474 then pp.hargajual* pp.jumlah else 0 end) as totalresep,
                        sp.totalharusdibayar as totalharusdibayar, sp.totalprekanan as totalprekanan, spp.totalppenjamin, spp.totalharusdibayar,
                        spp.totalsudahdibayar, r.namarekanan, spp.totalbiaya , spp.noverifikasi, php.noposting, stp.kdhistorylogins')
            );

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglpulang', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];//." 23:59:59";
            $data = $data->where('pd.tglpulang', '<=', $tgl);
        }
        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
            $data = $data->where('ru.objectdepartemenfk', '=', $request['idDept']);
        }
        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
            $data = $data->where('ru.id', '=', $request['idRuangan']);
        }
        if (isset($request['kelompokPasien']) && $request['kelompokPasien'] != "" && $request['kelompokPasien'] != "undefined") {
            $data = $data->where('pd.objectkelompokpasienlastfk', '=', $request['kelompokPasien']);
        }
        $data = $data->groupby('sp.totalharusdibayar', 'sp.totalprekanan', 'kp.kelompokpasien', 'spp.norec',
            'stp.tglposting', 'pd.noregistrasi', 'pd.tglregistrasi', 'p.nocm', 'p.namapasien',
            'ru.namaruangan', 'pr.id', 'pp.hargajual', 'pp.jumlah', 'pp.hargadiscount', 'kpr.id',
            'pr.objectdetailjenisprodukfk', 'spp.totalppenjamin', 'spp.totalharusdibayar',
            'spp.totalsudahdibayar', 'r.namarekanan', 'spp.totalbiaya', 'spp.noverifikasi',
            'php.noposting', 'stp.kdhistorylogins');
        $data = $data->distinct();
        $data = $data->orderBy('pd.tglregistrasi');

        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    protected function getDepositPasien($noregistrasi){
        $produkIdDeposit = $this->getProdukIdDeposit();
        $deposit = 0;
        $pasienDaftar  = PasienDaftar::has('pelayanan_pasien')->where('noregistrasi', $noregistrasi)->first();
        if($pasienDaftar){
            $depositList =$pasienDaftar->pelayanan_pasien()->where('nilainormal', '-1')->whereNull('strukfk')->get();
            foreach ($depositList as $item){
                if($item->produkfk==$produkIdDeposit){
                    $deposit = $deposit + $item->hargasatuan;
                }
            }
        }
        return $deposit;
    }

    protected function simpanPembayaranDeposit($request){
        $mapTipePelayanan = \DB::select(DB::raw("select objectkelompokfk from maptipelayanan_m where id=1"));
        $pasienDaftar = PasienDaftar::where('noregistrasi', $request['parameterTambahan']['noRegistrasi'])->first();
        $dataLogin = $request->all();
        $dataPegawaiUser = \DB::select(DB::raw("select pg.id,pg.namalengkap from loginuser_s as lu
                INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id
                where lu.id=:idLoginUser"),
            array(
                'idLoginUser' => $dataLogin['userData']['id'],
            )
        );

        DB::beginTransaction();
        $NOSBM = array();
        $SP = new StrukPelayanan();
        $SP->norec = $SP->generateNewId();
        $AntrianPasienDiperiksa = $pasienDaftar->antrian_pasien_diperiksa->first();
        $PP = new PelayananPasien();
        $PP->norec  = $PP->generateNewId();
        $PP->kdprofile = $this->getKdProfile();
        $PP->kdprofile = $this->getKdProfile();
        $PP->noregistrasifk = $AntrianPasienDiperiksa->norec; //salah
        $PP->aturanpakai = "-";
        $PP->hargasatuan= (float)$request['jumlahBayar'];
        $PP->hargajual= (float)$request['jumlahBayar'];
        $PP->jumlah= 1;
        $PP->nilainormal= -1;
        $PP->keteranganlain = "-";
        $PP->keteranganpakai2 = "-";
        $PP->produkfk= $this->getProdukIdDeposit();
        $PP->stock= 1;
        $PP->tglpelayanan= $request['tglsbm'];//$this->getDateTime();

        try{
            $PP->save();
        }
        catch(\Exception $e){
            $this->transStatus = false;
            $this->transMessage = "Simpan deposit Gagal {PP}";
        }

        $SP->kdprofile =  $this->getKdProfile();
        $SP->statusenabled =  false;
        $SP->nocmfk =  $pasienDaftar->nocmfk;
        $SP->noregistrasifk =  $pasienDaftar->norec;
        $SP->objectkelaslastfk =  $pasienDaftar->objectkelasfk;
        $SP->objectkelompoktransaksifk =  $mapTipePelayanan[0]->objectkelompokfk;
        $SP->objectpegawaipenerimafk =  $dataPegawaiUser[0]->id;//$this->getCurrentLoginID();
        $SP->nostruk =  $this->generateCode(new StrukPelayanan, 'nostruk', 10, 'S');
        $SP->tglstruk =  $request['tglsbm'];//$this->getDateTime();
        $SP->objectruanganfk=  $pasienDaftar->objectruanganlastfk;
        try{
            $SP->save();
        }
        catch(\Exception $e){
            $this->transStatus= false;
            $this->transMessage = "Simpan deposit Gagal {SP}";
        }

        $strukPelayananDetail = new StrukPelayananDetail();
        $strukPelayananDetail->norec = $strukPelayananDetail->generateNewId();
        $strukPelayananDetail->nostrukfk = $SP->norec;
        $strukPelayananDetail->hargadiscount = 0;
        $strukPelayananDetail->hargadiscountgive = 0;
        $strukPelayananDetail->hargadiscountsave = 0;
        $strukPelayananDetail->harganetto = $PP->hargajual;
        $strukPelayananDetail->hargapph = $PP->hargajual;
        $strukPelayananDetail->hargappn = $PP->hargajual;
        $strukPelayananDetail->hargasatuan = $PP->hargasatuan;
        $strukPelayananDetail->hargasatuandijamin = 0;
        $strukPelayananDetail->hargasatuanppenjamin = 0;
        $strukPelayananDetail->hargasatuanpprofile = 0;
        $strukPelayananDetail->hargatambahan = 0;
        $strukPelayananDetail->isonsiteservice = 0;
        $strukPelayananDetail->persendiscount = 0;
        $strukPelayananDetail->qtyproduk = $PP->jumlah;
        $strukPelayananDetail->qtyprodukoutext = 0;
        $strukPelayananDetail->qtyprodukoutint = 0;
        $strukPelayananDetail->qtyprodukretur = 0;
        $strukPelayananDetail->satuan = 0;
        $strukPelayananDetail->satuanstandar = 0;
        $strukPelayananDetail->is_terbayar = 0;
        $strukPelayananDetail->tglpelayanan = $SP->tglstruk;
        $strukPelayananDetail->objectprodukfk = $PP->produkfk;
        $strukPelayananDetail->objectkelasfk = $PP->kelasfk;

        try{
            $strukPelayananDetail->save();
        }
        catch(\Exception $e){
            $this->transStatus= false;
            $this->transMessage = "Simpan deposit Gagal {SPD}";
        }
//        if($this->transStatus){
        foreach($request['pembayaran'] as $pembayaran){
            $strukBuktiPenerimanan = new StrukBuktiPenerimaan();
            //$SBM123213 = $strukBuktiPenerimanan->generateNewId();
            $strukBuktiPenerimanan->norec = $strukBuktiPenerimanan->generateNewId();
            $strukBuktiPenerimanan->kdprofile= $this->getKdProfile();
            $strukBuktiPenerimanan->statusenabled = 1;
            $strukBuktiPenerimanan->keteranganlainnya = "Pembayaran Deposit Pasien";
            $strukBuktiPenerimanan->nostrukfk = $SP->norec;
            $strukBuktiPenerimanan->objectkelompokpasienfk = $SP->pasien_daftar->pasien->objectkelompokpasienfk;
            $strukBuktiPenerimanan->objectkelompoktransaksifk = $mapTipePelayanan[0]->objectkelompokfk;//1;
            $strukBuktiPenerimanan->objectpegawaipenerimafk  =$this->getCurrentLoginID();
            $strukBuktiPenerimanan->tglsbm  = $SP->tglstruk;
            $strukBuktiPenerimanan->totaldibayar  = $pembayaran['nominal'];
            $sbmKode = $this->generateCode(new StrukBuktiPenerimaan, 'nosbm', 14, 'RV-'.$this->getDateTime()->format('ym'));
            $strukBuktiPenerimanan->nosbm = $sbmKode;//$this->generateCode(new StrukBuktiPenerimaan, 'nosbm', 14, 'RV-'.$this->getDateTime()->format('ym'));
            $NOSBM[] = $strukBuktiPenerimanan->nosbm;

            //$nostrukfkSTR = $strukBuktiPenerimanan->norec ;
            try{
                $strukBuktiPenerimanan->save();
            }
            catch(\Exception $e){
                $this->transStatus = false;
                throw new \Exception($e->getMessage());
                $this->transMessage = "Simpan deposit Gagal {SBP}";
            }


            if($this->transStatus){
                $SBPCB = new StrukBuktiPenerimaanCaraBayar();
                $SBPCB->norec = $SBPCB->generateNewId();
                $SBPCB->kdprofile= $this->getKdProfile();
                $SBPCB->statusenabled = 1;
                $SBPCB->nosbmfk = $strukBuktiPenerimanan->norec;
                $SBPCB->objectcarabayarfk = $pembayaran['caraBayar']['id'];
                $SBPCB->totaldibayar = $pembayaran['nominal'];
                if(isset($pembayaran['detailBank'])){
                    $SBPCB->objectjeniskartufk = $pembayaran['detailBank']['jenisKartu']['id'];
                    $SBPCB->nokartuaccount = $pembayaran['detailBank']['noKartu'];
                    $SBPCB->namabankprovider = $pembayaran['detailBank']['namaKartu'];
                    $SBPCB->namapemilik = $pembayaran['detailBank']['namaKartu'];
                }
                try{
                    $SBPCB->save();
                }
                catch(\Exception $e){
                    $this->transStatus = false;
//                        throw new \Exception($e);
                    $this->transMessage = "Simpan deposit Gagal {SBPCB}";
                }
                //jurnal verif sP
                $logAcc =new  LogAcc;
                $logAcc->norec = $logAcc->generateNewId();
                $logAcc->jenistransaksi = 'Penerimaan Deposit';
                $logAcc->noreff = $SBPCB->norec;
                $logAcc->status = 0;
                $logAcc->tanggal = $this->getDateTime()->format('Y-m-d H:i:s');
                if($this->transStatus){
                    try{
                        $logAcc->save();
                    }
                    catch(\Exception $e){
                        $transStatus= false;
                        $transMsg =   "Simpan logAcc Gagal {SP}";

                    }
                }
            }
        }

        if($this->transStatus){
            $this->transMessage = "Simpan deposit Berhasil";
            $this->statusCode = 201;
            DB::commit();
        }else{
            $this->statusCode = 400;
            DB::rollBack();
        }
        return $this->respond(array('noSBM'=> $NOSBM), $this->transMessage);
    }

    protected function simpanPembayaranTagihanPasien($request){
        \DB::beginTransaction();
        $mapTipePelayanan = \DB::select(DB::raw("select objectkelompokfk from maptipelayanan_m where id=3"));
        if (isset($request['keteranganlainya']) && $request['keteranganlainya'] != "" && $request['keteranganlainya'] != "undefined") {
           $keteranganlainnya   = $request['keteranganlainya'];
       }else{
            $keteranganlainnya = "Pembayaran Tagihan Pasien"  ;
       }
       
        $strukPelayanan = StrukPelayanan::where('norec', $request['parameterTambahan']['noRecStrukPelayanan'])->first();
        $strukPelayananpenjamin = StrukPelayananPenjamin::where('nostrukfk', $request['parameterTambahan']['noRecStrukPelayanan'])->first();
       
        $sisa =0;
        if($strukPelayanan->nosbmlastfk==null || $strukPelayanan->nosbmlastfk==''){
            $sisa = $sisa + $this->getDepositPasien($strukPelayanan->pasien_daftar->noregistrasi);
        }

        $deposit = $sisa;

        $sisa = $sisa + $request['jumlahBayar'];


        $NOSBM = array();
        $biaya = 0;
        foreach($request['pembayaran'] as $pembayaran){
            $strukBuktiPenerimanan = new StrukBuktiPenerimaan();
            $strukBuktiPenerimanan->norec = $strukBuktiPenerimanan->generateNewId();
            $strukBuktiPenerimanan->kdprofile= $this->getKdProfile();
            $strukBuktiPenerimanan->keteranganlainnya = $keteranganlainnya;
            $strukBuktiPenerimanan->statusenabled= 1;
            $strukBuktiPenerimanan->nostrukfk = $strukPelayanan->norec;
            $strukBuktiPenerimanan->objectkelompokpasienfk = $strukPelayanan->pasien_daftar->pasien->objectkelompokpasienfk;
            $strukBuktiPenerimanan->objectkelompoktransaksifk = $mapTipePelayanan[0]->objectkelompokfk;
            $strukBuktiPenerimanan->objectpegawaipenerimafk  = $this->getCurrentLoginID();
            $strukBuktiPenerimanan->tglsbm  =  $request['tglsbm'];//$this->getDateTime();
            $strukBuktiPenerimanan->totaldibayar  = $pembayaran['nominal'];
            $strukBuktiPenerimanan->nosbm = $this->generateCode(new StrukBuktiPenerimaan, 'nosbm', 14, 'RV-'.$this->getDateTime()->format('ym'));
            $NOSBM[] = $strukBuktiPenerimanan->nosbm;
            $strukBuktiPenerimanan->diterimadari = $request['diterimadari'];
            $nostrukfkSTR = $strukPelayanan->norec ;
//            try{
            $strukBuktiPenerimanan->save();
//            }
//            catch(\Exception $e){
//                throw new \Exception($e->getMessage());
            $this->transMessage = "Simpan Pembayaran Gagal {SBP}";
//            }

            if($this->transStatus){
                $SBPCB = new StrukBuktiPenerimaanCaraBayar();
                $SBPCB->norec = $SBPCB->generateNewId();
                $SBPCB->kdprofile= $this->getKdProfile();
                $SBPCB->statusenabled = 1;
                $SBPCB->nosbmfk = $strukBuktiPenerimanan->norec;
                $SBPCB->objectcarabayarfk = $pembayaran['caraBayar']['id'];
                $SBPCB->totaldibayar = $pembayaran['nominal'];

                if($pembayaran['caraBayar']['id']==3){
                    if(isset($pembayaran['detailBank'])){
                        $SBPCB->nokartuaccount = $pembayaran['detailBank']['noKartu'];
                        $SBPCB->namabankprovider = $pembayaran['detailBank']['namaBank'];
                        $SBPCB->namapemilik = $pembayaran['detailBank']['namaKartu'];
                        $SBPCB->kdbankrumahsakitfk = $pembayaran['detailBank']['namaBankKe'];
                    }
                }

//                if(isset($pembayaran['detailBank'])){
//                    $SBPCB->objectjeniskartufk = $pembayaran['detailBank']['jenisKartu']['id'];
//                    $SBPCB->nokartuaccount = $pembayaran['detailBank']['noKartu'];
//                    $SBPCB->namabankprovider = $pembayaran['detailBank']['namaKartu'];
//                    $SBPCB->namapemilik = $pembayaran['detailBank']['namaKartu'];
//                }
                try{
                    $SBPCB->save();
                }
                catch(\Exception $e){
                    $this->transStatus = false;
//                    throw new \Exception($e->getMessage());
                    $this->transMessage = "Simpan Pembayaran Gagal {SBPCB}";
                }

            }

            //JURNAL
            //jurnal verif sP
            $logAcc =new  LogAcc;
            $logAcc->norec = $logAcc->generateNewId();
            $logAcc->jenistransaksi = 'Pembayaran Tagihan';
            $logAcc->noreff = $nostrukfkSTR;
            $logAcc->status = 0;
            $logAcc->tanggal = $this->getDateTime()->format('Y-m-d H:i:s');
            if($this->transStatus){
                try{
                    $logAcc->save();
                }
                catch(\Exception $e){
                    $transStatus= false;
                    $transMsg =   "Simpan logAcc Gagal {SP}";

                }
            }
               $biaya = $biaya+(float)$pembayaran['nominal'];
                if ($strukPelayananpenjamin != '') {

                    foreach ($strukPelayananpenjamin as $spp) {
                        $strukPelayananpenjamin->totalsudahdibayar = (float)$spp['totalsudahdibayar'] + (float)$biaya;

                        $strukPelayananpenjamin->save();
                    }
                }
            //END jurnal verif sP
//            $detailJurnal = array();
//            $saldo = (float)$pembayaran['nominal'];
//            $idbendahara = ((int)$pembayaran['caraBayar']['id']==1) ? 1318 : 1333; //Kas Bendahara Penerimaan : Bank In Transit
//            if($this->transStatus){
//                $saldoJurnal = array();
//                $saldoJurnal[] = array(
//                    'account_id' => $idbendahara,
//                    'balance'    => 'D',
//                    'saldo'      => $saldo
//                );
//                if($deposit>0){
//                    $saldoJurnal[] = array(
//                        'account_id' =>   1475, //Uang Muka PAsien
//                        'balance'    =>  'D',
//                        'saldo'      => $deposit
//                    );
//                }
//
//                $saldoJurnal[] = array(
//                    'account_id' =>   1348, //Piutang Perorangan
//                    'balance'    =>  'K',
//                    'saldo'      => $saldo + $deposit
//                );
//
//                $detailJurnal[] = array(
//                    "tgltransaksi" => $this->getDateTime(),
//                    "notransaksi" =>  $strukBuktiPenerimanan->nosbm,
//                    "saldoJurnal" => $saldoJurnal,
//                    "ruanganid" => $strukPelayanan->objectruanganfk,
//                    "kelompoktransaksiid" => 1,
//                    "nobuktitransaksi" => $strukBuktiPenerimanan->nosbm,
//                    "tglbuktitransaksi" => $this->getDateTime(),
//                    "keteranganlainnya" => "Pembayaran Tagihan Pasien",
//                );
//
//                $jurnal = array(
//                    "noposting" => $noPosting = $this->generateCode(new PostingJurnalTransaksi, 'noposting', 14, 'BT-'.$this->getDateTime()->format('ym')),
//                    "detailJurnal" =>$detailJurnal
//                );
//                $this->postingJournal($jurnal);
//            }
        }

        if($this->transStatus){
//            $strukPelayananDetail = $strukPelayanan->struk_pelayanan_detail;
//            foreach ($strukPelayananDetail as $item){
//                $total = ($item->harganetto-$item->hargasatuandijamin)*$item->qtyproduk;
//                if(($total<=$sisa || $total<=($sisa+ 0.0001)) && $item->is_terbayar==0){
//                    $item->is_terbayar=1;
//                    $sisa = $sisa - $total;
//                    try{
//                        $item->save();
//                    }
//                    catch(\Exception $e){
//                        $this->transStatus = false;
//                        $this->transMessage = "Simpan Pembayaran Gagal {SPD}";
//                        break;
//                    }
//                }
//            }

            //INSERT DARI PELAYANANPASIEN KE STUKPELAYANANPASIENBAYAR
            //INSERT DARI PELAYAANPASIENDETIAL KE STRUKPEKAYANANPASIENKBAYAR
        }

        if($this->transStatus){
            $strukPelayanan->nosbmlastfk =$strukBuktiPenerimanan->norec;
//            $strukPelayanan->sisa = $sisa;
            try{
                $strukPelayanan->save();
            }
            catch(\Exception $e){
                throw new \Exception($e->getMessage());
                $this->transStatus = false;
                $this->transMessage = "Simpan Pembayaran Gagal {SPD}";
            }
        }

        if($this->transStatus){
            $pd = $strukPelayanan->pasien_daftar;
            $pd->nosbmlastfk =$strukBuktiPenerimanan->norec;
            $noRegistrasi = $pd['noregistrasi'];
//            $strukPelayanan->sisa = $sisa;
            try{
                $pd->save();
            }
            catch(\Exception $e){
                throw new \Exception($e->getMessage());
                $this->transStatus = false;
                $this->transMessage = "Simpan Pembayaran Gagal {pasienDaftar}";
            }
        }


        if($this->transStatus){
            $this->transMessage = "Simpan Pembayaran Berhasil";
            $this->statusCode = 201;
            DB::commit();
        }else{
            $this->statusCode = 400;
            DB::rollBack();
        }
        return $this->respond(array('noSBM'=> $NOSBM,'noReg'=>$noRegistrasi,), $this->transMessage);
    }

    protected function simpanPengembalianDeposit($request){
        \DB::beginTransaction();
        $mapTipePelayanan = \DB::select(DB::raw("select objectkelompokfk from maptipelayanan_m where id=2"));
        $pasienDaftar = PasienDaftar::where('noregistrasi', $request['parameterTambahan']['noRegistrasi'])->first();
        $dataSP = StrukPelayanan::where('noregistrasifk',$pasienDaftar->norec)
            ->wherenull('statusenabled')
            ->first();
        $norec_sp = $dataSP['norec'];
        $dataLogin = $request->all();
        $dataPegawaiUser = DB::select(DB::raw("select pg.id,pg.namalengkap from loginuser_s as lu
                INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id
                where lu.id=:idLoginUser"),
            array(
                'idLoginUser' => $dataLogin['userData']['id'],
            )
        );

        $NOSBM = array();

        foreach($request['pembayaran'] as $pembayaran){
            try{
                $strukBuktiPenerimanan = new StrukBuktiPenerimaan();
                //$SBM123213 = $strukBuktiPenerimanan->generateNewId();
                $strukBuktiPenerimanan->norec = $strukBuktiPenerimanan->generateNewId();
                $strukBuktiPenerimanan->kdprofile= $this->getKdProfile();
                $strukBuktiPenerimanan->statusenabled = 1;
                $strukBuktiPenerimanan->keteranganlainnya = "Pengembalian Deposit Pasien";
                $strukBuktiPenerimanan->nostrukfk = $norec_sp;
                $strukBuktiPenerimanan->objectkelompokpasienfk = $pasienDaftar->objectkelompokpasienlastfk;
                $strukBuktiPenerimanan->objectkelompoktransaksifk = $mapTipePelayanan[0]->objectkelompokfk;
                $strukBuktiPenerimanan->objectpegawaipenerimafk  =$this->getCurrentLoginID();
                $strukBuktiPenerimanan->tglsbm  = $dataSP['tglstruk'];
                $strukBuktiPenerimanan->totaldibayar  = $pembayaran['nominal'];
                $sbmKode = $this->generateCode(new StrukBuktiPenerimaan, 'nosbm', 14, 'RV-'.$this->getDateTime()->format('ym'));
                $strukBuktiPenerimanan->nosbm = $sbmKode;//$this->generateCode(new StrukBuktiPenerimaan, 'nosbm', 14, 'RV-'.$this->getDateTime()->format('ym'));
                $NOSBM[] = $strukBuktiPenerimanan->nosbm;
                $NOSBM2 = $strukBuktiPenerimanan->nosbm;

                $strukBuktiPenerimanan->save();
                $transStatus = 'true';
            }
            catch(\Exception $e){
                $transStatus = 'false';
                $this->transMessage = "Simpan deposit Gagal {SBP}";
            }
            $norec_sbm=$strukBuktiPenerimanan->norec;

            try{
                $SBPCB = new StrukBuktiPenerimaanCaraBayar();
                $SBPCB->norec = $SBPCB->generateNewId();
                $SBPCB->kdprofile= $this->getKdProfile();
                $SBPCB->statusenabled = 1;
                $SBPCB->nosbmfk = $strukBuktiPenerimanan->norec;
                $SBPCB->objectcarabayarfk = $pembayaran['caraBayar']['id'];
                $SBPCB->totaldibayar = $pembayaran['nominal'];
                if(isset($pembayaran['detailBank'])){
                    $SBPCB->objectjeniskartufk = $pembayaran['detailBank']['jenisKartu']['id'];
                    $SBPCB->nokartuaccount = $pembayaran['detailBank']['noKartu'];
                    $SBPCB->namabankprovider = $pembayaran['detailBank']['namaKartu'];
                    $SBPCB->namapemilik = $pembayaran['detailBank']['namaKartu'];
                }
                $SBPCB->save();
                $transStatus = 'true';
            }
            catch(\Exception $e){
                $transStatus = 'false';
                $this->transMessage = "Simpan deposit Gagal {SBPCB}";
            }
            //jurnal
            try{
                $logAcc =new  LogAcc;
                $logAcc->norec = $logAcc->generateNewId();
                $logAcc->jenistransaksi = 'Penerimaan Deposit';
                $logAcc->noreff = $SBPCB->norec;
                $logAcc->status = 0;
                $logAcc->tanggal = $this->getDateTime()->format('Y-m-d H:i:s');
                $logAcc->save();
                $transStatus = 'true';
            }
            catch(\Exception $e){
                $transStatus = 'false';
                $transMsg =   "Simpan logAcc Gagal {SP}";
            }
            //END jurnal
            try{
                $dt=StrukPelayanan::where('noregistrasifk', $pasienDaftar->norec)
                    ->wherenull('statusenabled')
                    ->update([
                            'nosbmlastfk' => $norec_sbm]
                    );
                $transStatus = 'true';
            }
            catch(\Exception $e){
                $transStatus = 'false';
                $this->transMessage = "Simpan Pembayaran Gagal {SPD}";
            }

            try{
                $pasienDaftar->nosbmlastfk =$norec_sbm;
                $noRegistrasi = $pasienDaftar['noregistrasi'];
                $pasienDaftar->save();
                $transStatus = 'true';
            }
            catch(\Exception $e){
                $transStatus = 'false';
                $this->transMessage = "Simpan Pembayaran Gagal {pasienDaftar}";
            }
        }

        if($transStatus == 'true'){
            $this->transMessage = "Simpan deposit Berhasil";
            $this->statusCode = 201;
            DB::commit();
        }else{
            $this->transMessage = "Simpan deposit gagal";
            $this->statusCode = 400;
            DB::rollBack();
        }
        return $this->respond(array('noSBM'=> $NOSBM2,'noReg'=>$request['parameterTambahan']['noRegistrasi'],), $this->transMessage);
    }

    protected function simpanCicilanPasien($request){
        \DB::beginTransaction();
        $mapTipePelayanan = \DB::select(DB::raw("select objectkelompokfk from maptipelayanan_m where id=4"));
        $strukPelayananPenjamin = StrukPelayananPenjamin::where('norec', $request['parameterTambahan']['noRecStrukPelayanan'])->first();
        $strukPelayanan = StrukPelayanan::where('norec', $strukPelayananPenjamin->nostrukfk)->first();
//        $sisa =0;
//        if($strukPelayanan->nosbmlastfk==null || $strukPelayanan->nosbmlastfk==''){
//            $sisa = $sisa + $this->getDepositPasien($strukPelayanan->pasien_daftar->noregistrasi);
//        }
//
//        $deposit = $sisa;
//
//        $sisa = $sisa + $request['jumlahBayar'];


        $NOSBM = array();
        foreach($request['pembayaran'] as $pembayaran){
            $strukBuktiPenerimanan = new StrukBuktiPenerimaan();
            $strukBuktiPenerimanan->norec = $strukBuktiPenerimanan->generateNewId();
            $strukBuktiPenerimanan->kdprofile= $this->getKdProfile();
            $strukBuktiPenerimanan->keteranganlainnya = "Pembayaran Cicilan Tagihan Pasien";
            $strukBuktiPenerimanan->statusenabled= 1;
            $strukBuktiPenerimanan->nostrukfk = $strukPelayanan->norec;
            $strukBuktiPenerimanan->objectkelompokpasienfk = $strukPelayanan->pasien_daftar->pasien->objectkelompokpasienfk;
            $strukBuktiPenerimanan->objectkelompoktransaksifk = $mapTipePelayanan[0]->objectkelompokfk;
            $strukBuktiPenerimanan->diterimadari = $request['diterimadari'];
            $strukBuktiPenerimanan->objectpegawaipenerimafk  = $this->getCurrentLoginID();
            $strukBuktiPenerimanan->tglsbm  = $this->getDateTime();
            $strukBuktiPenerimanan->totaldibayar  = $pembayaran['nominal'];
            $strukBuktiPenerimanan->nosbm = $this->generateCode(new StrukBuktiPenerimaan, 'nosbm', 14, 'RV-'.$this->getDateTime()->format('ym'));
            $NOSBM[] = $strukBuktiPenerimanan->nosbm;
            $nostrukfkSTR = $strukPelayanan->norec ;
            try{
                $strukBuktiPenerimanan->save();
                $strukPelayananPenjamin->totalsudahdibayar =$strukPelayananPenjamin->totalsudahdibayar+$pembayaran['nominal'];
            }
            catch(\Exception $e){
                throw new \Exception($e->getMessage());
                $this->transMessage = "Simpan Pembayaran Gagal {SBP}";
            }

            if($this->transStatus){
                $SBPCB = new StrukBuktiPenerimaanCaraBayar();
                $SBPCB->norec = $SBPCB->generateNewId();
                $SBPCB->kdprofile= $this->getKdProfile();
                $SBPCB->statusenabled = 1;
                $SBPCB->nosbmfk = $strukBuktiPenerimanan->norec;
                $SBPCB->objectcarabayarfk = $pembayaran['caraBayar']['id'];

                if(isset($pembayaran['detailBank'])){
                    $SBPCB->objectjeniskartufk = $pembayaran['detailBank']['jenisKartu']['id'];
                    $SBPCB->nokartuaccount = $pembayaran['detailBank']['noKartu'];
                    $SBPCB->namabankprovider = $pembayaran['detailBank']['namaKartu'];
                    $SBPCB->namapemilik = $pembayaran['detailBank']['namaKartu'];
                }
                try{
                    $SBPCB->save();
                }
                catch(\Exception $e){
                    $this->transStatus = false;
//                    throw new \Exception($e->getMessage());
                    $this->transMessage = "Simpan Pembayaran Gagal {SBPCB}";
                }

            }

            //JURNAL
            //jurnal verif sP
//            $logAcc =new  LogAcc;
//            $logAcc->norec = $logAcc->generateNewId();
//            $logAcc->jenistransaksi = 'Pembayaran Cicilan Piutang';
//            $logAcc->noreff = $nostrukfkSTR;
//            $logAcc->status = 0;
//            $logAcc->tanggal = $this->getDateTime()->format('Y-m-d H:i:s');
//            if($this->transStatus){
//                try{
//                    $logAcc->save();
//                }
//                catch(\Exception $e){
//                    $transStatus= false;
//                    $transMsg =   "Simpan logAcc Gagal {SP}";
//
//                }
//            }
            //END jurnal verif sP
//            $detailJurnal = array();
//            $saldo = (float)$pembayaran['nominal'];
//            $idbendahara = ((int)$pembayaran['caraBayar']['id']==1) ? 1318 : 1333; //Kas Bendahara Penerimaan : Bank In Transit
//            if($this->transStatus){
//                $saldoJurnal = array();
//                $saldoJurnal[] = array(
//                    'account_id' => $idbendahara,
//                    'balance'    => 'D',
//                    'saldo'      => $saldo
//                );
//                if($deposit>0){
//                    $saldoJurnal[] = array(
//                        'account_id' =>   1475, //Uang Muka PAsien
//                        'balance'    =>  'D',
//                        'saldo'      => $deposit
//                    );
//                }
//
//                $saldoJurnal[] = array(
//                    'account_id' =>   1348, //Piutang Perorangan
//                    'balance'    =>  'K',
//                    'saldo'      => $saldo + $deposit
//                );
//
//                $detailJurnal[] = array(
//                    "tgltransaksi" => $this->getDateTime(),
//                    "notransaksi" =>  $strukBuktiPenerimanan->nosbm,
//                    "saldoJurnal" => $saldoJurnal,
//                    "ruanganid" => $strukPelayanan->objectruanganfk,
//                    "kelompoktransaksiid" => 1,
//                    "nobuktitransaksi" => $strukBuktiPenerimanan->nosbm,
//                    "tglbuktitransaksi" => $this->getDateTime(),
//                    "keteranganlainnya" => "Pembayaran Tagihan Pasien",
//                );
//
//                $jurnal = array(
//                    "noposting" => $noPosting = $this->generateCode(new PostingJurnalTransaksi, 'noposting', 14, 'BT-'.$this->getDateTime()->format('ym')),
//                    "detailJurnal" =>$detailJurnal
//                );
//                $this->postingJournal($jurnal);
//            }
        }

        if($this->transStatus){
//            $strukPelayananDetail = $strukPelayanan->struk_pelayanan_detail;
//            foreach ($strukPelayananDetail as $item){
//                $total = ($item->harganetto-$item->hargasatuandijamin)*$item->qtyproduk;
//                if(($total<=$sisa || $total<=($sisa+ 0.0001)) && $item->is_terbayar==0){
//                    $item->is_terbayar=1;
//                    $sisa = $sisa - $total;
//                    try{
//                        $item->save();
//                    }
//                    catch(\Exception $e){
//                        $this->transStatus = false;
//                        $this->transMessage = "Simpan Pembayaran Gagal {SPD}";
//                        break;
//                    }
//                }
//            }

        }

        if($this->transStatus){
            try{
                $strukPelayananPenjamin->save();
            }
            catch(\Exception $e){
                throw new \Exception($e->getMessage());
                $this->transStatus = false;
                $this->transMessage = "Simpan Pembayaran Gagal {SPP}";
            }
        }


        if($this->transStatus){
            $this->transMessage = "Simpan Pembayaran Berhasil";
            $this->statusCode = 201;
//            DB::rollBack();

            DB::commit();
        }else{
            $this->statusCode = 400;
            DB::rollBack();
        }
        return $this->respond(array('noSBM'=> $NOSBM), $this->transMessage);
//        disini ngikutin pembayaran laginya..
//        return $this->respond([], "Simpan Pembayaran Berhasil");
    }

    protected function simpanPembayaranTagihanNonLayanan($request){
        \DB::beginTransaction();
        $mapTipePelayanan = \DB::select(DB::raw("select objectkelompokfk from maptipelayanan_m where id=5"));
        $strukPelayanan = StrukPelayanan::where('norec', $request['parameterTambahan']['noRecStrukPelayanan'])->first();
        $sisa =0;
//        if($strukPelayanan->nosbmlastfk==null || $strukPelayanan->nosbmlastfk==''){
//            $sisa = $sisa + $this->getDepositPasien($strukPelayanan->pasien_daftar->noregistrasi);
//        }

        $deposit = $sisa;

        $sisa = $sisa + $request['jumlahBayar'];


        $NOSBM = array();
        foreach($request['pembayaran'] as $pembayaran){
            $strukBuktiPenerimanan = new StrukBuktiPenerimaan();
            $strukBuktiPenerimanan->norec = $strukBuktiPenerimanan->generateNewId();
            $strukBuktiPenerimanan->kdprofile= $this->getKdProfile();
            $strukBuktiPenerimanan->keteranganlainnya = "Pembayaran Tagihan Non Layanan";
            $strukBuktiPenerimanan->statusenabled= 1;
            $strukBuktiPenerimanan->nostrukfk = $strukPelayanan->norec;
//            $strukBuktiPenerimanan->objectkelompokpasienfk = $strukPelayanan->pasien_daftar->pasien->objectkelompokpasienfk;
            $strukBuktiPenerimanan->objectkelompoktransaksifk = $mapTipePelayanan[0]->objectkelompokfk;
            $strukBuktiPenerimanan->objectpegawaipenerimafk  = $this->getCurrentLoginID();
            $strukBuktiPenerimanan->tglsbm  = $request['tglsbm'];//$this->getDateTime();
            $strukBuktiPenerimanan->totaldibayar  = $pembayaran['nominal'];
            $strukBuktiPenerimanan->nosbm = $this->generateCode(new StrukBuktiPenerimaan, 'nosbm', 14, 'RV-'.$this->getDateTime()->format('ym'));
            $NOSBM[] = $strukBuktiPenerimanan->nosbm;
            $nostrukfkSTR = $strukPelayanan->norec ;
            try{
                $strukBuktiPenerimanan->save();
            }
            catch(\Exception $e){
                throw new \Exception($e->getMessage());
                $this->transMessage = "Simpan Pembayaran Gagal {SBP}";
            }

            if($this->transStatus){
                $SBPCB = new StrukBuktiPenerimaanCaraBayar();
                $SBPCB->norec = $SBPCB->generateNewId();
                $SBPCB->kdprofile= $this->getKdProfile();
                $SBPCB->statusenabled = 1;
                $SBPCB->nosbmfk = $strukBuktiPenerimanan->norec;
                $SBPCB->objectcarabayarfk = $pembayaran['caraBayar']['id'];

                if(isset($pembayaran['detailBank'])){
                    $SBPCB->objectjeniskartufk = $pembayaran['detailBank']['jenisKartu']['id'];
                    $SBPCB->nokartuaccount = $pembayaran['detailBank']['noKartu'];
                    $SBPCB->namabankprovider = $pembayaran['detailBank']['namaKartu'];
                    $SBPCB->namapemilik = $pembayaran['detailBank']['namaKartu'];
                }
                try{
                    $SBPCB->save();
                }
                catch(\Exception $e){
                    $this->transStatus = false;
//                    throw new \Exception($e->getMessage());
                    $this->transMessage = "Simpan Pembayaran Gagal {SBPCB}";
                }

            }

            //JURNAL

            //jurnal verif sP
            $logAcc =new  LogAcc;
            $logAcc->norec = $logAcc->generateNewId();
            $logAcc->jenistransaksi = 'Pembayaran Tagihan Non Layanan';
            $logAcc->noreff = $nostrukfkSTR;
            $logAcc->status = 0;
            $logAcc->tanggal = $this->getDateTime()->format('Y-m-d H:i:s');
            if($this->transStatus){
                try{
                    $logAcc->save();
                }
                catch(\Exception $e){
                    $transStatus= false;
                    $transMsg =   "Simpan logAcc Gagal {SP}";

                }
            }
            //END jurnal verif sP
//            $detailJurnal = array();
//            $saldo = (float)$pembayaran['nominal'];
//            $idbendahara = ((int)$pembayaran['caraBayar']['id']==1) ? 1318 : 1333; //Kas Bendahara Penerimaan : Bank In Transit
//            if($this->transStatus && 1==2){  //nanti aja yaa bosss..
//                $saldoJurnal = array();
//                $saldoJurnal[] = array(
//                    'account_id' => $idbendahara,
//                    'balance'    => 'D',
//                    'saldo'      => $saldo
//                );
//                if($deposit>0){
//                    $saldoJurnal[] = array(
//                        'account_id' =>   1475, //Uang Muka PAsien
//                        'balance'    =>  'D',
//                        'saldo'      => $deposit
//                    );
//                }
//
//                $saldoJurnal[] = array(
//                    'account_id' =>   1348, //Piutang Perorangan
//                    'balance'    =>  'K',
//                    'saldo'      => $saldo + $deposit
//                );
//
//                $detailJurnal[] = array(
//                    "tgltransaksi" => $this->getDateTime(),
//                    "notransaksi" =>  $strukBuktiPenerimanan->nosbm,
//                    "saldoJurnal" => $saldoJurnal,
//                    "ruanganid" => $strukPelayanan->objectruanganfk,
//                    "kelompoktransaksiid" => 1,
//                    "nobuktitransaksi" => $strukBuktiPenerimanan->nosbm,
//                    "tglbuktitransaksi" => $this->getDateTime(),
//                    "keteranganlainnya" => "Pembayaran Tagihan Pasien",
//                );
//
//                $jurnal = array(
//                    "noposting" => $noPosting = $this->generateCode(new PostingJurnalTransaksi, 'noposting', 14, 'BT-'.$this->getDateTime()->format('ym')),
//                    "detailJurnal" =>$detailJurnal
//                );
//                $this->postingJournal($jurnal);
//            }
        }

        if($this->transStatus){
//            $strukPelayananDetail = $strukPelayanan->struk_pelayanan_detail;
//            foreach ($strukPelayananDetail as $item){
//                $total = ($item->harganetto-$item->hargasatuandijamin)*$item->qtyproduk;
//                if(($total<=$sisa || $total<=($sisa+ 0.0001)) && $item->is_terbayar==0){
//                    $item->is_terbayar=1;
//                    $sisa = $sisa - $total;
//                    try{
//                        $item->save();
//                    }
//                    catch(\Exception $e){
//                        $this->transStatus = false;
//                        $this->transMessage = "Simpan Pembayaran Gagal {SPD}";
//                        break;
//                    }
//                }
//            }

            //INSERT DARI PELAYANANPASIEN KE STUKPELAYANANPASIENBAYAR
            //INSERT DARI PELAYAANPASIENDETIAL KE STRUKPEKAYANANPASIENKBAYAR
        }

        if($this->transStatus){
            $strukPelayanan->nosbmlastfk =$strukBuktiPenerimanan->norec;
//            $strukPelayanan->sisa = $sisa;
            try{
                $strukPelayanan->save();
            }
            catch(\Exception $e){
                throw new \Exception($e->getMessage());
                $this->transStatus = false;
                $this->transMessage = "Simpan Pembayaran Gagal {SPD}";
            }
        }


        if($this->transStatus){
            $this->transMessage = "Simpan Pembayaran Berhasil";
            $this->statusCode = 201;
//            DB::rollBack();

            DB::commit();
        }else{
            $this->statusCode = 400;
            DB::rollBack();
        }
        return $this->respond(array('noSBM'=> $NOSBM), $this->transMessage);
    }

    protected function simpanCicilanPasienCollect($request){
        \DB::beginTransaction();
        $mapTipePelayanan = \DB::select(DB::raw("select objectkelompokfk from maptipelayanan_m where id=6"));
        $strukPelayananPenjamin = StrukPelayananPenjamin::where('norec', $request['parameterTambahan']['noRecStrukPelayanan'])->first();
        $strukPelayanan = StrukPelayanan::where('norec', $strukPelayananPenjamin->nostrukfk)->first();
        $pasienDaftar = PasienDaftar::where('norec', $strukPelayanan->noregistrasifk)->first();
        $noSBM = '';
        try{
        $NOSBM = array();
        foreach($request['pembayaran'] as $pembayaran){
            $strukBuktiPenerimanan = new StrukBuktiPenerimaan();
            $strukBuktiPenerimanan->norec = $strukBuktiPenerimanan->generateNewId();
            $strukBuktiPenerimanan->kdprofile= $this->getKdProfile();
            $strukBuktiPenerimanan->keteranganlainnya = "Pembayaran Cicilan Tagihan Pasien Collecting";
            $strukBuktiPenerimanan->statusenabled= 1;
            $strukBuktiPenerimanan->nostrukfk = $strukPelayanan->norec;
            $strukBuktiPenerimanan->objectkelompokpasienfk = $strukPelayanan->pasien_daftar->pasien->objectkelompokpasienfk;
            $strukBuktiPenerimanan->objectkelompoktransaksifk = $mapTipePelayanan[0]->objectkelompokfk;
            $strukBuktiPenerimanan->objectpegawaipenerimafk  = $this->getCurrentLoginID();
            $strukBuktiPenerimanan->tglsbm  = $this->getDateTime();
            $strukBuktiPenerimanan->totaldibayar  = $pembayaran['nominal'];
            $strukBuktiPenerimanan->nosbm = $this->generateCode(new StrukBuktiPenerimaan, 'nosbm', 14, 'RV-'.$this->getDateTime()->format('ym'));
            $NOSBM[] = $strukBuktiPenerimanan->nosbm;
            $nostrukfkSTR = $strukPelayanan->norec ;
            $noSBM = $strukBuktiPenerimanan->nosbm;
            $strukBuktiPenerimanan->save();
            $strukPelayananPenjamin->totalsudahdibayar =$strukPelayananPenjamin->totalsudahdibayar+$pembayaran['nominal'];

            if($this->transStatus){
                $SBPCB = new StrukBuktiPenerimaanCaraBayar();
                $SBPCB->norec = $SBPCB->generateNewId();
                $SBPCB->kdprofile= $this->getKdProfile();
                $SBPCB->statusenabled = 1;
                $SBPCB->nosbmfk = $strukBuktiPenerimanan->norec;
                $SBPCB->objectcarabayarfk = $pembayaran['caraBayar']['id'];

                if(isset($pembayaran['detailBank'])){
                    $SBPCB->objectjeniskartufk = $pembayaran['detailBank']['jenisKartu']['id'];
                    $SBPCB->nokartuaccount = $pembayaran['detailBank']['noKartu'];
                    $SBPCB->namabankprovider = $pembayaran['detailBank']['namaKartu'];
                    $SBPCB->namapemilik = $pembayaran['detailBank']['namaKartu'];
                }
                $SBPCB->save();
            }

        }

//            $pd = $strukPelayanan->pasien_daftar;
//            $pd->nosbmlastfk =$strukBuktiPenerimanan->norec;
//            $pd->save();

            //JURNAL
            //jurnal verif sP
            $logAcc =new  LogAcc;
            $logAcc->norec = $logAcc->generateNewId();
            $logAcc->jenistransaksi = 'Pembayaran Cicilan Piutang';
            $logAcc->noreff = $nostrukfkSTR;
            $logAcc->status = 0;
            $logAcc->tanggal = $this->getDateTime()->format('Y-m-d H:i:s');
            $logAcc->save();

        foreach($request['detailSPP'] as $DetailSPP) {
            $SPP = StrukPelayananPenjamin::where('norec', $DetailSPP['noRecSPP'])->first();
            $SP = StrukPelayanan::where('norec', $SPP->nostrukfk)->first();
            $PD = PasienDaftar::where('norec', $SP->noregistrasifk)->first();
            $SPP->totalsudahdibayar = $SPP->totalsudahdibayar + $DetailSPP['bayarKlaim'];
            $SPP->save();
            $pd = $SP->pasien_daftar;
            $pd->nosbmlastfk = $strukBuktiPenerimanan->norec;
            $noRegistrasi = $pd['noregistrasi'];
            $pd->save();
        }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        $transMessage = "Pembayaran Piutang";
        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            \DB::commit();
            $result = array(
                "status" => 201,
//                "message" => $transMessage,
//                "data" => $aingMacan,
                "as" => 'ea@epic',
            );
        } else {
            $transMessage = $transMessage ." Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
//                "message"  => $transMessage,
                "as" => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
//            if($this->transStatus){
//                $this->transMessage = "Simpan Pembayaran Berhasil";
//                $this->statusCode = 201;
////            DB::rollBack();
//
//                DB::commit();
//            }else{
//                $this->statusCode = 400;
//                DB::rollBack();
//            }
//
//        }
//        return $this->respond(array('noSBM'=> $NOSBM), $this->transMessage);
    }

    public function simpanPembayaran(Request $request){
        switch ($request['parameterTambahan']['tipePembayaran']) {
            case 'depositPasien':
                return $this->simpanPembayaranDeposit($request);
                break;
            case 'PenyetoranDepositKasirKembali':
                return $this->simpanPengembalianDeposit($request);
                break;
            case 'tagihanPasien':
                return $this->simpanPembayaranTagihanPasien($request);
                break;
            case 'cicilanPasien':
                return $this->simpanCicilanPasien($request);
                break;
            case 'tagihanNonLayanan':
                return $this->simpanPembayaranTagihanNonLayanan($request);
                break;
            case 'cicilanPasienCollect':
                return $this->simpanCicilanPasienCollect($request);
//                return $this->simpanCicilanPiutang($request);
                break;
            default:
                return 0;
        }
    }

    protected function getDetailPembayaranDeposit($request){
        $result = array(
            'jumlahBayar' => $request['jumlahBayar'],
            'tipePembayaran' => $request['tipePembayaran'],
            'noRegistrasi' => $request['noRegistrasi'],
        );
        return $this->respond($result, "Data Pembayaran");
    }

    protected function getDetailTagihanPasien($request){
        $strukPelayanan = StrukPelayanan::where('norec', $request['noRecStrukPelayanan'])->first();

        $totalBilling= $strukPelayanan->totalharusdibayar;
        $totalBayar = $totalBilling;
        $result =array(
            "noRecStrukPelayanan"  => $strukPelayanan->norec,
            "jumlahBayar"  => $totalBayar,
        );
        return $this->respond($result, "Data Pembayaran");
    }

    protected  function getDetailCicilanPasien($request){
        $result =array(
            "noRecStrukPelayanan"  => $request['noRecStrukPelayanan'],
            "jumlahBayar"  => $request['jumlahBayar'],
        );
        return $this->respond($result, "Data Pembayaran");
    }

    protected  function getDetailPembayaranNonLayanan($request){
        return $this->respond("Data Pembayaran");
    }

    public function pembayaran(Request $request){
        switch ($request['tipePembayaran']) {
            case 'depositPasien':
                return $this->getDetailPembayaranDeposit($request);
                break;
            case 'tagihanPasien':
                return $this->getDetailTagihanPasien($request);
                break;
            case 'cicilanPasien':
                return $this->getDetailCicilanPasien($request);
                break;
            case 'pembayaranNonLayanan':
                return $this->getDetailPembayaranNonLayanan($request);
            default:
                return 0;
        }
    }
    public function detailPasienDeposit($noRegister){

        $pasienDaftar = PasienDaftar::where('noregistrasi', $noRegister)->first();
        if(!$pasienDaftar){
            //kalau tidak ditemukan
            return false;
        }

        $listDeposit = array();
        $pasienDaftar->DepositId = $this->getProdukIdDeposit();
        $deposit = $pasienDaftar->list_deposit;
        foreach ($deposit as $item){
            $listDeposit[] = array(
                "tglTransaksi" => $item->tglpelayanan,
                "jumlahDeposit" => $item->hargasatuan*$item->jumlah
            );
        }

        $result = array(
            'noCm'  => $pasienDaftar->pasien->nocm,
            'noRegistrasi' => $pasienDaftar->noregistrasi,
            'jenisKelamin' => $pasienDaftar->pasien->jenis_kelamin->namaexternal,
            'namaPasien'  => $pasienDaftar->pasien->namapasien,
            'umur'  => $pasienDaftar->pasien->Umur,
            'status'        => $pasienDaftar->statuspasien,
            'detailDeposit' => $listDeposit
        );


        return $this->respond($result, "Detail Deposit Pasien");
    }
    public function HapusTglPulang(Request $request){
        DB::beginTransaction();
        $tglAyeuna = date('Y-m-d H:i:s');
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id',$dataLogin['userData']['id'])
            ->first();
        $pasienDaftar = PasienDaftar::where('noregistrasi',$request['noregistrasi'])->first();
        // try {
            $data=$dataAsalRujukan = \DB::table('pasiendaftar_t as pd')
                ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
                ->leftjoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
                ->join('ruangan_m as ru','ru.id','=','pd.objectruanganlastfk')
                ->select('ru.objectdepartemenfk')
                ->where('pd.noregistrasi',$request['noregistrasi'])
//                ->whereIn('ru.objectdepartemenfk',array(16,17,35))
                ->first();

            $stt=false;
            if ($data->objectdepartemenfk==16){
                $stt=true;
            }
            if ($data->objectdepartemenfk==17){
                $stt=true;
            }
            if ($data->objectdepartemenfk==35){
                $stt=true;
            }
            if ($data->objectdepartemenfk==26){
                $stt=true;
            }


            if ($stt==false){
                $ddddd=[];
                $transMessage = "Hanya Pasien Rawat Inap yang Bisa Batal Pulang!";
            }else{
                $antrian = AntrianPasienDiperiksa::where('noregistrasifk',$pasienDaftar->norec )
                    ->where('objectruanganfk',$pasienDaftar->objectruanganlastfk)
                    ->orderBy('tglmasuk','desc')
                    ->first();
                $registrasiPelPas = RegistrasiPelayananPasien::where('noregistrasifk',$pasienDaftar->norec )
                    ->where('objectruanganfk',$pasienDaftar->objectruanganlastfk)
                    ->orderBy('tglmasuk','desc')
                    ->first();
                $DelKDR = KendaliDokumenRekamMedis::where('noregistrasifk', $antrian->norec)->delete();
                if ($request['tglpulang']== 'null'){
                    $ddddd=PasienDaftar::where('noregistrasi', $request['noregistrasi'])
                        ->update([
                                'tglpulang' => null]
//                        'tglpulang' => $request['tglpulang']]
                        );
                    $ru =  Ruangan::where('id',$pasienDaftar->objectruanganlastfk)->first();
                    if($ru->objectruanganfk=='19'){
                        $apd = AntrianPasienDiperiksa::where('norec',$antrian->norec)
                        ->update([ 
                            'tglkeluar' => null ,
                            'objectkasuspenyakitfk' => '19'] );
                    }else{
                        $apd = AntrianPasienDiperiksa::where('norec',$antrian->norec)
                        ->update([ 'tglkeluar' => null ] );
                    }
                    $rpp = RegistrasiPelayananPasien::where('norec',$registrasiPelPas->norec)
                        ->update([ 'tglkeluar' => null ] );
                    $tt = TempatTidur::where('id', $request['nobed'])
                        ->update(['objectstatusbedfk' => 1]);

                }else{
                    $ddddd=PasienDaftar::where('noregistrasi', $request['noregistrasi'])
                        ->update([
                                'tglpulang' => $request['tglpulang']]
                        );

                    $ru =  Ruangan::where('id',$pasienDaftar->objectruanganlastfk)->first();
                    if($ru->objectruanganfk=='19'){
                        $apd = AntrianPasienDiperiksa::where('norec',$antrian->norec)
                        ->update([ 
                            'tglkeluar' => null ,
                            'objectkasuspenyakitfk' => '19'] );
                    }else{
                        $apd = AntrianPasienDiperiksa::where('norec',$antrian->norec)
                        ->update([ 'tglkeluar' => null ] );
                    }
                    $rpp = RegistrasiPelayananPasien::where('norec',$registrasiPelPas->norec)
                        ->update([ 'tglkeluar' => null ] );
                    $tt = TempatTidur::where('id', $request['nobed'])
                        ->update(['objectstatusbedfk' => 1]);
                    //## Logging User
                    $newId = LoggingUser::max('id');
                    $newId = $newId +1;
                    $logUser = new LoggingUser();
                    $logUser->id = $newId;
                    $logUser->norec = $logUser->generateNewId();
                    $logUser->kdprofile= 0;
                    $logUser->statusenabled=true;
                    $logUser->jenislog = 'Batal Pulang Pasien';
                    $logUser->noreff =$request['noregistrasi'];
                    $logUser->referensi='noregistrasi Pasien';
                    $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
                    $logUser->tanggal = $tglAyeuna;
                    $logUser->save();
                }
                $transMessage = "Sukses";
            }




            $transStatus = 'true';
        // } catch (\Exception $e) {
        //     $transStatus = 'false';
        // }

        if ($transStatus == 'true') {

            DB::commit();
            $result = array(
                "status" => 201,
//                "message" =>   $transMessae,
                "message" => $transMessage,
                "struk" => $ddddd,//$noResep,,//$noResep,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Simpan  Tanggal Pulang Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "struk" => $ddddd,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function HapusTglPulangDanBed(Request $request){
        DB::beginTransaction();
        $tglAyeuna = date('Y-m-d H:i:s');
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id',$dataLogin['userData']['id'])
            ->first();
        $pasienDaftar = PasienDaftar::where('noregistrasi',$request['noregistrasi'])->first();
        // try {
            $data=$dataAsalRujukan = \DB::table('pasiendaftar_t as pd')
                ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
                ->leftjoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
                ->join('ruangan_m as ru','ru.id','=','pd.objectruanganlastfk')
                ->select('ru.objectdepartemenfk')
                ->where('pd.noregistrasi',$request['noregistrasi'])
//                ->whereIn('ru.objectdepartemenfk',array(16,17,35))
                ->first();

            $stt=false;
            if ($data->objectdepartemenfk==16){
                $stt=true;
            }
            if ($data->objectdepartemenfk==17){
                $stt=true;
            }
            if ($data->objectdepartemenfk==35){
                $stt=true;
            }
            if ($data->objectdepartemenfk==26){
                $stt=true;
            }


            if ($stt==false){
                $ddddd=[];
                $transMessage = "Hanya Pasien Rawat Inap yang Bisa Batal Pulang!";
            }else{
                $antrian = AntrianPasienDiperiksa::where('noregistrasifk',$pasienDaftar->norec )
                    ->where('objectruanganfk',$pasienDaftar->objectruanganlastfk)
                    ->orderBy('tglmasuk','desc')
                    ->first();
                $registrasiPelPas = RegistrasiPelayananPasien::where('noregistrasifk',$pasienDaftar->norec )
                    ->where('objectruanganfk',$pasienDaftar->objectruanganlastfk)
                    ->orderBy('tglmasuk','desc')
                    ->first();
               
                $DelKDR = KendaliDokumenRekamMedis::where('noregistrasifk', $antrian->norec)->delete();

                if ($request['tglpulang']== 'null'){
                    $ddddd=PasienDaftar::where('noregistrasi', $request['noregistrasi'])
                        ->update([
                                'tglpulang' => null]
//                        'tglpulang' => $request['tglpulang']]
                        );
                    $apd = AntrianPasienDiperiksa::where('norec',$antrian->norec)
                        ->update([ 'tglkeluar' => null, 
                                    'objectkamarfk' =>$request['objectkamarfk'],
                                    'nobed' => $request['nobed']] );
                    $rpp = RegistrasiPelayananPasien::where('norec',$registrasiPelPas->norec)
                        ->update([ 'tglkeluar' => null ] );
                    $tt = TempatTidur::where('id', $request['nobed'])
                        ->update(['objectstatusbedfk' => 1]);

                }else{
                    $ddddd=PasienDaftar::where('noregistrasi', $request['noregistrasi'])
                        ->update([
                                'tglpulang' => $request['tglpulang']]
                        );

                    $apd = AntrianPasienDiperiksa::where('norec',$antrian->norec)
                        ->update([ 'tglkeluar' => null, 
                                    'objectkamarfk' =>$request['objectkamarfk'],
                                    'nobed' => $request['nobed']] );
                    $rpp = RegistrasiPelayananPasien::where('norec',$registrasiPelPas->norec)
                        ->update([ 'tglkeluar' => null ] );
                    $tt = TempatTidur::where('id', $request['nobed'])
                        ->update(['objectstatusbedfk' => 1]);
                    //## Logging User
                    $newId = LoggingUser::max('id');
                    $newId = $newId +1;
                    $logUser = new LoggingUser();
                    $logUser->id = $newId;
                    $logUser->norec = $logUser->generateNewId();
                    $logUser->kdprofile= 0;
                    $logUser->statusenabled=true;
                    $logUser->jenislog = 'Batal Pulang Pasien';
                    $logUser->noreff =$request['noregistrasi'];
                    $logUser->referensi='noregistrasi Pasien';
                    $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
                    $logUser->tanggal = $tglAyeuna;
                    $logUser->save();
                }
                $transMessage = "Sukses";
            }




            $transStatus = 'true';
        // } catch (\Exception $e) {
        //     $transStatus = 'false';
        // }

        if ($transStatus == 'true') {

            DB::commit();
            $result = array(
                "status" => 201,
//                "message" =>   $transMessae,
                "message" => $transMessage,
                "struk" => $ddddd,//$noResep,,//$noResep,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Simpan  Tanggal Pulang Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "struk" => $ddddd,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function BatalInputTagihanNonLayanan(Request $request) {
        \DB::beginTransaction();
        $tglAyeuna = date('Y-m-d H:i:s');
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id',$dataLogin['userData']['id'])
            ->first();
        try{

            $Kel = StrukPelayanan::where('norec', $request['norec'])
                ->update([
                    'statusenabled' => 0,
                ]);

            //## Logging User
            $newId = LoggingUser::max('id');
            $newId = $newId +1;
            $logUser = new LoggingUser();
            $logUser->id = $newId;
            $logUser->norec = $logUser->generateNewId();
            $logUser->kdprofile= 0;
            $logUser->statusenabled=true;
            $logUser->jenislog = 'Batal Transaksi Non Layanan Dengan Nostruk : ' . $request['nostruk'];
            $logUser->noreff =$request['norec'];
            $logUser->referensi='norec strukpelayanan_t';
            $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
            $logUser->tanggal = $tglAyeuna;
            $logUser->save();

            $transStatus = true;
        } catch (\Exception $e) {
            $transStatus = false;
        }

        if ($transStatus) {
            $transMessage = 'Sukses';
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'ea@epic',
            );
        } else {
            $transMessage = 'Hapus Gagal';
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDataLaporanPenerimaan(Request $request){
        //todo : laporan penerimaan
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
//
        $data = \DB::select(DB::raw("1select pk.kelompokpenerimaan,pk.kelompok,SUM(z.total) AS total 
                from penerimaankasir_m as pk 
                left JOIN (SELECT x.id,SUM(x.total) as total
                FROM(select 1 as id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                 from pelayananpasien_t as pp
                 INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                 INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                 INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                 INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                 INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                 INNER JOIN produk_m as pro on pro.id = pp.produkfk
                 INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                 INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                 where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                 and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                 and pp.produkfk in (4040398,4040406) and ru.objectdepartemenfk not in (24,16)
                 and ru.id not in (558,559,560,561,577,580)
                 and pp.strukresepfk IS NULL
                
                 UNION ALL
                
                select 2 as id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in (4040399) and ru.objectdepartemenfk not in (24,16)
                and pp.strukresepfk IS NULL
                
                UNION ALL
                -- psikiatri geriatri dan jiwa dewasa
                select 3 as id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in (4040397,4040400,4040401,4040402,4040403)
                and ru.id in (566,567,564) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select CASE WHEN ru.id = 558 THEN 4 WHEN ru.id = 559 THEN 6 WHEN ru.id = 560 THEN 10 WHEN ru.id = 561 THEN 8 WHEN ru.id IN (577,580) THEN 12 END as id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and jp.id in (27682) and ru.id in (558,559,560,561,577,580)
                and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select CASE WHEN ru.id = 558 THEN 5 WHEN ru.id = 559 THEN 7 WHEN ru.id = 560 THEN 11 WHEN ru.id = 561 THEN 9 WHEN ru.id IN (577,580) THEN 13 END as id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in (4040397,4040400,4040401,4040402,4040403)
                and ru.id in (558,559,560,561,577,580) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 14 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk not in (4040399,4040398,4040406)
                and ru.id in (562) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select jp.objectpenerimaankasirfk as id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and jp.id in (27681) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select CASE WHEN ru.objectdepartemenfk not in (16) THEN 16 ELSE 43 END AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in (4040563,4040564,4040567,4040568) and pp.strukresepfk IS NULL
                
                UNION ALL

                select CASE WHEN ru.objectdepartemenfk not in (16) THEN 16 ELSE 43 END AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN pelayananpasientidakterklaim_t as ptt on ptt.pelayananpasien = pp.norec
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pd.nostruklastfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = ptt.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                and ptt.produkfk in (4040563,4040564,4040567,4040568) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 17 as id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in (4040413) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select jp.objectpenerimaankasirfk as id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and jp.id in (27677,27678,27679,27680) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 22 AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between  '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in (4040398,4040406) and ru.id in (569) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select  22 AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN pelayananpasientidakterklaim_t as ptt on ptt.pelayananpasien = pp.norec
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pd.nostruklastfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = ptt.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between  '$tglAwal' and '$tglAkhir'
                and ptt.produkfk in (4040398,4040406) and ru.id in (569) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 23 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between  '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in (4041110) and ru.id in (569)
                and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select  23 AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN pelayananpasientidakterklaim_t as ptt on ptt.pelayananpasien = pp.norec
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pd.nostruklastfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = ptt.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between  '$tglAwal' and '$tglAkhir'
                and ptt.produkfk in (4041110) and ru.id in (569) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 24 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between  '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in (4040405,4040404,4040400,4040402,4040407) and ru.id in (569)
                and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select  24 AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN pelayananpasientidakterklaim_t as ptt on ptt.pelayananpasien = pp.norec
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pd.nostruklastfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = ptt.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between  '$tglAwal' and '$tglAkhir'
                and ptt.produkfk in (4040405,4040404,4040400,4040402,4040407) and ru.id in (569) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 25 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between  '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk not in (4040398,4040406,4041110,4040405,4040404,4040400,4040402,4040407) and ru.id in (569) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select  25 AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN pelayananpasientidakterklaim_t as ptt on ptt.pelayananpasien = pp.norec
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pd.nostruklastfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = ptt.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between  '$tglAwal' and '$tglAkhir'
                and ptt.produkfk not in (4040398,4040406,4041110,4040405,4040404,4040400,4040402,40404072) and ru.id in (569) and pp.strukresepfk IS NULL

                
                UNION ALL
                
                select CASE WHEN pp.produkfk = 28079 and apd.objectkelasfk = 1 THEN 39
                WHEN pp.produkfk = 28080 and apd.objectkelasfk = 1 THEN 40
                WHEN pp.produkfk in (4040479,4040483,4040470) and apd.objectkelasfk = 2 THEN 37
                WHEN pp.produkfk = 4040473 and apd.objectkelasfk = 2 THEN 38
                WHEN pp.produkfk = 4040472 and apd.objectkelasfk = 3 THEN 36
                WHEN pp.produkfk in (4040469,4040478,4040482) and apd.objectkelasfk = 3 THEN 35
                WHEN pp.produkfk in (4040468,4040477,4040481) and apd.objectkelasfk in (4,5,8) THEN 33
                WHEN pp.produkfk = 4040471 and apd.objectkelasfk in (4,5,8) THEN 34
                WHEN pp.produkfk in (4040467,4040476,4040480) and apd.objectkelasfk = 7 THEN 31
                WHEN pp.produkfk = 4040471 and apd.objectkelasfk = 7 THEN 32
                WHEN pp.produkfk in (4040474,4040475) THEN 41
                WHEN pp.produkfk in (4040411,4041749,4041750,4041751,4041752) THEN 42 END AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and ru.objectdepartemenfk in (16)
                and pp.produkfk in (28079,28080,4040467,4040468,4040469,4040470,
                4040471,4040472,4040473,4040474,4040475,4040411,4040479,4040483,
                4041749,4041750,4041751,4041752,4040476,4040480,4040477,4040481,
                4040478,4040482)  and ru.id not in (596)
                and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select CASE WHEN ptt.produkfk = 28079 and apd.objectkelasfk = 1 THEN 39
                WHEN ptt.produkfk = 28080 and apd.objectkelasfk = 1 THEN 40
                WHEN ptt.produkfk in (4040479,4040483,4040470) and apd.objectkelasfk = 2 THEN 37
                WHEN ptt.produkfk = 4040473 and apd.objectkelasfk = 2 THEN 38
                WHEN ptt.produkfk = 4040472 and apd.objectkelasfk = 3 THEN 36
                WHEN ptt.produkfk in (4040469,4040478,4040482) and apd.objectkelasfk = 3 THEN 35
                WHEN ptt.produkfk in (4040468,4040477,4040481) and apd.objectkelasfk in (4,5,8) THEN 33
                WHEN ptt.produkfk = 4040471 and apd.objectkelasfk in (4,5,8) THEN 34
                WHEN ptt.produkfk in (4040467,4040476,4040480) and apd.objectkelasfk = 7 THEN 31
                WHEN ptt.produkfk = 4040471 and apd.objectkelasfk = 7 THEN 32
                WHEN ptt.produkfk in (4040474,4040475) THEN 41
                WHEN ptt.produkfk in (4040411,4041749,4041750,4041751,4041752) THEN 42 END AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN pelayananpasientidakterklaim_t as ptt on ptt.pelayananpasien = pp.norec
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pd.nostruklastfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = ptt.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                and ru.objectdepartemenfk in (16) and ru.id not in (596)
                and ptt.produkfk in (28079,28080,4040467,4040468,4040469,4040470,
                4040471,4040472,4040473,4040474,4040475,4040411,4040479,4040483,
                4041749,4041750,4041751,4041752,4040476,4040480,4040477,4040481,
                4040478,4040482)
                and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select CASE WHEN pp.produkfk = 28079 and apd.objectkelasfk = 1 THEN 30
                WHEN pp.produkfk = 28080 and apd.objectkelasfk = 1 THEN 30
                WHEN pp.produkfk = 4040470 and apd.objectkelasfk = 2 THEN 29
                WHEN pp.produkfk = 4040473 and apd.objectkelasfk = 2 THEN 29
                WHEN pp.produkfk = 4040472 and apd.objectkelasfk = 3 THEN 28
                WHEN pp.produkfk = 4040469 and apd.objectkelasfk = 3 THEN 28
                WHEN pp.produkfk = 4040468 and apd.objectkelasfk = 7 THEN 26
                WHEN pp.produkfk = 4040471 and apd.objectkelasfk = 7 THEN 26
                WHEN pp.produkfk = 4040467 and apd.objectkelasfk = 8 THEN 27
                WHEN pp.produkfk = 4040471 and apd.objectkelasfk = 8 THEN 27 END AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and ru.objectdepartemenfk in (24)
                and pp.produkfk in (28079,28080,4040467,4040468,4040469,4040470,4040471,4040472,4040473)
                and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select CASE WHEN pp.produkfk = 28079 and apd.objectkelasfk = 1 THEN 30
                WHEN pp.produkfk = 28080 and apd.objectkelasfk = 1 THEN 30
                WHEN pp.produkfk = 4040470 and apd.objectkelasfk = 2 THEN 29
                WHEN pp.produkfk = 4040473 and apd.objectkelasfk = 2 THEN 29
                WHEN pp.produkfk = 4040472 and apd.objectkelasfk = 3 THEN 28
                WHEN pp.produkfk = 4040469 and apd.objectkelasfk = 3 THEN 28
                WHEN pp.produkfk = 4040468 and apd.objectkelasfk = 7 THEN 26
                WHEN pp.produkfk = 4040471 and apd.objectkelasfk = 7 THEN 26
                WHEN pp.produkfk = 4040467 and apd.objectkelasfk = 8 THEN 27
                WHEN pp.produkfk = 4040471 and apd.objectkelasfk = 8 THEN 27 END AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                 from pelayananpasien_t as pp
                INNER JOIN pelayananpasientidakterklaim_t as ptt on ptt.pelayananpasien = pp.norec
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pd.nostruklastfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = ptt.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                and ru.objectdepartemenfk in (16) and ru.id not in (596)
                and ptt.produkfk in (28079,28080,4040467,4040468,4040469,4040470,4040471,4040472,4040473)
                and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 44 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                -- and pp.produkfk not in (28079,28080,4040467,4040468,4040469,4040470,4040471,4040472,4040473,4040474,4040475,4040411,4041749,4041750,4041751,4041752,4040398,4040397)
                and ru.id = 596 and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 44 AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk not in (4040398,4040397,4040400,4040401,4040402,4040403,4040399)
                and ru.id in (564) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 45 AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in (4040550,4040551,4040552)
                and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 46 AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                -- and pp.produkfk not in (4040398,4040397,4040400,4040401,4040402,4040403)
                and pp.produkfk not in (4040398,4040399)
                and ru.id in (565,573) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 47 AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk not in (4040398,4040397,4040400,4040401,4040402,4040403,27682,27683)
                and ru.id in (577,580) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                SELECT CASE WHEN ru.id = 568 THEN 52 WHEN ru.id IN (575,563) THEN 48
                WHEN ru.id = 576 THEN 49 WHEN ru.id = 571 THEN 50
                WHEN ru.id=572 THEN 51 WHEN ru.id=535 THEN 76 WHEN ru.id=332 THEN 75 END AS id,
                ((pp.hargasatuan-(CASE WHEN pp.hargadiscount IS NULL THEN 0 ELSE pp.hargadiscount END))*pp.jumlah)+ CASE WHEN pp.jasa is null then 0 else pp.jasa end as total
                FROM pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                --INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                --AND pp.produkfk not in (4040398,4040398,4040397,4040400,4040401,4040402,4040403,27682,27683)
                AND pp.produkfk not in (4040398,4040397,4040400,4040401,4040402,4040403,27682,27683,4040399,4040575,4041196,4041195,4041198,4041237,4041212,4041211,4041194,4041207,4041209)
                AND ru.id in (568,575,576,571,535,332,563,572)
                AND pp.strukresepfk IS NULL
                
                UNION ALL
                
                select CASE WHEN ru.objectdepartemenfk in (16,24) THEN 54
                WHEN ru.objectdepartemenfk not in (16,24) THEN 53 END AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN strukresep_t as sr on sr.norec = pp.strukresepfk
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                
                UNION ALL
                
                select CASE WHEN ru.id in (116,125) THEN 54 ELSE 53 END AS id,CASE WHEN sbm.totaldibayar IS NULL THEN 0 ELSE sbm.totaldibayar END AS total
                from strukpelayanan_t as sp
                INNER JOIN ruangan_m as ru on ru.id = sp.objectruanganfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk = sp.norec
                WHERE SUBSTRING(sp.nostruk, 1, 2) = 'OB' AND sp.keteranganlainnya = 'Penjualan Obat Bebas'
                AND sbm.tglsbm BETWEEN '$tglAwal' and '$tglAkhir'
                AND sp.nosbmlastfk IS NOT NULL
                
                UNION ALL
                
                select 55 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8) and produkfk in (4041191,4041190) and pp.strukresepfk IS NULL
                
                UNION ALL

                select 55 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN pelayananpasientidakterklaim_t as ptt on ptt.pelayananpasien = pp.norec
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pd.nostruklastfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = ptt.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'                
                and ptt.produkfk in (4041191,4041190) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select CASE WHEN ru.objectdepartemenfk in (16) THEN 57 ELSE 56 END AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                and (pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and jp.id in(329,330) and pp.strukresepfk IS NULL
                or pro.id IN (4041194,4041198,4041202,4041206))
                
                UNION ALL
                
                select 58 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in(4041219,4041220,4041221,4041222) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 59 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8) and ru.objectdepartemenfk not in (24)  and ru.id not in (596)
                and pp.produkfk in(4041106,4041107,4041108,4041109,4041110,4041111,4041112) and pp.strukresepfk IS NULL
                
                UNION ALL

                select 59 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN pelayananpasientidakterklaim_t as ptt on ptt.pelayananpasien = pp.norec
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pd.nostruklastfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = ptt.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                and ru.objectdepartemenfk not in (24) and ru.id not in (596)
                and ptt.produkfk in (4041106,4041107,4041108,4041109,4041110,4041111,4041112) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 60 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in(4041193,4041194,4041195) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 61 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in(4041197,4041199) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 62 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in(4041201,4041202,4041203) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 63 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in(4041196,4041200,4041204,4041212) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 69 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in(4041209) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 69 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in(4041209) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 70 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in(4041236) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 71 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in(4041213,4041214,4041215) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 72 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in(4041216,4041217,4041218) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 74 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in(4041210,4041211,4041212) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 82 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in(4041237) and pp.strukresepfk IS NULL
                
                --UNION ALL
                
                --select 77 AS id,sp.totalharusdibayar as total
                --from strukpelayanan_t as sp
                --INNER JOIN pasiendaftar_t as pd on pd.norec=sp.noregistrasifk
                --INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk = sp.norec
                --where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                --and pd.objectkelompokpasienlastfk in (2,4,10) and sp.totalharusdibayar <> 0
                
                --UNION ALL
                
                --select 78 AS id,sp.totalharusdibayar as total
                --from strukpelayanan_t as sp
                --INNER JOIN pasiendaftar_t as pd on pd.norec=sp.noregistrasifk
                --INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk = sp.norec
                --where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                --and pd.objectkelompokpasienlastfk in (8) and sp.totalharusdibayar <> 0
                
                --UNION ALL
                
                --select 79 AS id,sp.totalharusdibayar as total
                --from strukpelayanan_t as sp
                --INNER JOIN pasiendaftar_t as pd on pd.norec=sp.noregistrasifk
                --INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk = sp.norec
                --where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                --and pd.objectkelompokpasienlastfk in (9) and sp.totalharusdibayar <> 0
                
                UNION ALL
                
                select CASE WHEN sp.objectkelompoktransaksifk = 138 THEN 81
                WHEN sp.objectkelompoktransaksifk = 13 THEN 80
                WHEN sp.objectkelompoktransaksifk = 140 THEN 82
                WHEN sp.objectkelompoktransaksifk in (139,142) THEN 84
                WHEN sp.objectkelompoktransaksifk = 143 THEN 86
                WHEN sp.objectkelompoktransaksifk = 145 THEN 88
                WHEN sp.objectkelompoktransaksifk = 146 THEN 89
                WHEN sp.objectkelompoktransaksifk = 147 THEN 90
                WHEN sp.objectkelompoktransaksifk in (148,149,4) THEN 92
                WHEN sp.objectkelompoktransaksifk = 6 THEN 91
                WHEN sp.objectkelompoktransaksifk = 150 THEN 85
                WHEN sp.objectkelompoktransaksifk = 147 THEN 90
                WHEN sp.objectkelompoktransaksifk = 147 THEN 90
                WHEN sp.objectkelompoktransaksifk = 9 THEN 83 END AS id,
                CASE WHEN sbm.totaldibayar IS NULL THEN 0 ELSE sbm.totaldibayar END AS total
                from strukpelayanan_t as sp
                INNER JOIN strukpelayanandetail_t as spd on spd.nostrukfk = sp.norec
                INNER JOIN produk_m as pro on pro.id = spd.objectprodukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk = sp.norec
                WHERE sp.objectkelompoktransaksifk in (138,140,139,142,143,144,145,146,147,148,149,13,6,2,9,150,4)
                AND sbm.tglsbm BETWEEN '$tglAwal' and '$tglAkhir'
                AND sp.nosbmlastfk IS NOT NULL) as x
                GROUP BY x.id) as z on z.id = pk.id
                GROUP BY pk.kelompokpenerimaan,pk.kelompok
                ORDER BY pk.kelompokpenerimaan"));
        return $this->respond($data);


    }
    public function getDataLaporanPenerimaanRev202011(Request $request){
        //todo : laporan penerimaan
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $data = \DB::select(DB::raw("
                select pk.kdkelompokpenerimaan,pk.kelompokpenerimaan ,pk.kelompok,sum(x.total) as total from penerimaankasir_m pk 
                        left join
                        (
                       select case when pm.id is null and pt.isobat  is not null then 53 when pm.id is null then null else pm.id end as id, case when pm.kelompok is null and pt.isobat  is not null then '13. Instalasi Farmasi' else pm.kelompok end as kelompok
                        ,sum(((pt.hargasatuan-(case when pt.hargadiscount is null then 0 else pt.hargadiscount end))* pt.jumlah) + CASE when pt.jasa is null then 0 else pt.jasa end) as total
                        --,pt.produkfk ,pt.hargasatuan ,pt.jumlah ,st.nostruk ,sbm.nosbm ,at2.objectruanganfk ,mm.id as mmid,mm.objectlappenerimaanfk ,pt.isobat ,pt.strukresepfk 
                        from pelayananpasien_t pt 
                        inner join strukpelayanan_t st on st.norec=pt.strukfk 
                        inner join strukbuktipenerimaan_t sbm on sbm.nostrukfk =st.norec 
                        inner join antrianpasiendiperiksa_t at2 on at2.norec=pt.noregistrasifk 
                        LEFT join mapruangantoproduk_m mm on mm.objectprodukfk =pt.produkfk and at2.objectruanganfk =mm.objectruanganfk 
                        left join penerimaankasir_m pm on pm.id=mm.objectlappenerimaanfk 
                        where sbm.tglsbm  BETWEEN '$tglAwal' and '$tglAkhir' 
                        --and pm.id =44
                        --and at2.objectruanganfk =571
                        group by pm.id,pm.kelompok,pt.isobat
                        union ALL 
                        
                        select 77 as id, 'BPJS' as kelompok 
                        ,sum(((pt.hargasatuan-(case when pt.hargadiscount is null then 0 else pt.hargadiscount end))* pt.jumlah) + CASE when pt.jasa is null then 0 else pt.jasa end) as total
                        from pelayananpasien_t pt 
                        inner join strukpelayanan_t st on st.norec=pt.strukfk 
                        inner join antrianpasiendiperiksa_t at2 on at2.norec=pt.noregistrasifk 
                        inner join pasiendaftar_t pd on pd.norec =at2.noregistrasifk 
                        where st.tglstruk  BETWEEN '$tglAwal' and '$tglAkhir' 
                        and pd.objectkelompokpasienlastfk in (2,4,10)
                        
                        union all
                        
                         select 79 as id, 'JKD' as kelompok 
                        ,sum(((pt.hargasatuan-(case when pt.hargadiscount is null then 0 else pt.hargadiscount end))* pt.jumlah) + CASE when pt.jasa is null then 0 else pt.jasa end) as total
                        from pelayananpasien_t pt 
                        inner join strukpelayanan_t st on st.norec=pt.strukfk 
                        inner join antrianpasiendiperiksa_t at2 on at2.norec=pt.noregistrasifk 
                        inner join pasiendaftar_t pd on pd.norec =at2.noregistrasifk 
                        where st.tglstruk  BETWEEN '$tglAwal' and '$tglAkhir' 
                        and pd.objectkelompokpasienlastfk in (8)
                        
                        union all
                        
                        select 22 as id, 'JKD' as kelompok 
                        ,sum(((pt.hargasatuan-(case when pt.hargadiscount is null then 0 else pt.hargadiscount end))* pt.jumlah) + CASE when pt.jasa is null then 0 else pt.jasa end) as total
                        from pelayananpasien_t pt 
                        inner join strukpelayanan_t st on st.norec=pt.strukfk 
                        inner join antrianpasiendiperiksa_t at2 on at2.norec=pt.noregistrasifk 
                        inner join pasiendaftar_t pd on pd.norec =at2.noregistrasifk 
                        where st.tglstruk  BETWEEN '$tglAwal' and '$tglAkhir' 
                        and pd.objectkelompokpasienlastfk in (9)
                        
                        UNION ALL
                
                        select CASE WHEN sp.objectkelompoktransaksifk = 138 THEN 81
                        WHEN sp.objectkelompoktransaksifk = 13 THEN 80
                        WHEN sp.objectkelompoktransaksifk = 140 THEN 82
                        WHEN sp.objectkelompoktransaksifk in (139,142) THEN 84
                        WHEN sp.objectkelompoktransaksifk = 143 THEN 86
                        WHEN sp.objectkelompoktransaksifk = 145 THEN 88
                        WHEN sp.objectkelompoktransaksifk = 146 THEN 89
                        WHEN sp.objectkelompoktransaksifk = 147 THEN 90
                        WHEN sp.objectkelompoktransaksifk in (148,149,4) THEN 92
                        WHEN sp.objectkelompoktransaksifk = 6 THEN 91
                        WHEN sp.objectkelompoktransaksifk = 150 THEN 85
                        WHEN sp.objectkelompoktransaksifk = 9 THEN 83 END AS id,
                        'pendapatan lain lain' as kelompok,
                        CASE WHEN sbm.totaldibayar IS NULL THEN 0 ELSE sbm.totaldibayar END AS total
                        from strukpelayanan_t as sp
                        INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk = sp.norec
                        WHERE sp.objectkelompoktransaksifk in (138,140,139,142,143,144,145,146,147,148,149,13,6,9,150,4)
                        AND sbm.tglsbm BETWEEN '$tglAwal' and '$tglAkhir' 
                        AND sp.nosbmlastfk IS NOT NULL
                        
                        ) as x on x.id=pk.id
                        group by pk.kdkelompokpenerimaan,pk.kelompokpenerimaan ,pk.kelompok
                        order by pk.kelompokpenerimaan ,pk.kelompok
                "
        ));

        return $this->respond($data);

    }
    public function updateMapLapPenerimaan(Request $request) {
        \DB::beginTransaction();
        //        return $this->respond($request->all());
        try {
            $updateMap = MapRuanganToProduk::where('id',$request['idmap'])
                ->update([
                    'objectlappenerimaanfk' => $request['idlap']
                ]);

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
                "as" => 'ea@epic',
            );
        } else {
            $transMessage = "Simpan Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDataLaporanPenerimaanDetailRev202011(Request $request){
        //todo : laporan penerimaan
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $kdkelompok = $request['kdkelompok'];
        if($kdkelompok == 13){
            $data = \DB::select(DB::raw("
                select  ru.namaruangan ,pr.namaproduk ,
                    pt.produkfk ,pt.hargasatuan ,pt.jumlah,((pt.hargasatuan-(case when pt.hargadiscount is null then 0 else pt.hargadiscount end))* pt.jumlah) + CASE when pt.jasa is null then 0 else pt.jasa end as total ,
                    st.nostruk ,sbm.nosbm ,at2.objectruanganfk ,mm.id as mmid,mm.objectlappenerimaanfk ,pt.isobat ,pt.strukresepfk , pm.kdkelompokpenerimaan,pm.kdkelompoklayanan,pm.kdlayanan,
                    pm.kelompok,pm.kelompoklayanan,pm.layanan,pd.noregistrasi,ps.namapasien
                    from pelayananpasien_t pt 
                    inner join strukpelayanan_t st on st.norec=pt.strukfk 
                    inner join strukbuktipenerimaan_t sbm on sbm.nostrukfk =st.norec 
                    inner join antrianpasiendiperiksa_t at2 on at2.norec=pt.noregistrasifk 
                    inner join pasiendaftar_t as pd on pd.norec=at2.noregistrasifk
                    inner join pasien_m as ps on ps.id=pd.nocmfk
                    inner join produk_m pr on pr.id=pt.produkfk
                    inner join ruangan_m ru on ru.id=at2.objectruanganfk 
                    LEFT join mapruangantoproduk_m mm on mm.objectprodukfk =pt.produkfk and at2.objectruanganfk =mm.objectruanganfk 
                    left join penerimaankasir_m pm on pm.id=mm.objectlappenerimaanfk 
                    where sbm.tglsbm  BETWEEN '$tglAwal' and '$tglAkhir' 
                    and pm.kdkelompokpenerimaan = $kdkelompok
                    union all
                    select  ru.namaruangan ,pr.namaproduk ,
                    pt.produkfk ,pt.hargasatuan ,pt.jumlah,((pt.hargasatuan-(case when pt.hargadiscount is null then 0 else pt.hargadiscount end))* pt.jumlah) + CASE when pt.jasa is null then 0 else pt.jasa end as total ,
                    st.nostruk ,sbm.nosbm ,at2.objectruanganfk ,1 as mmid,1 as objectlappenerimaanfk ,pt.isobat ,pt.strukresepfk , 13 as kdkelompokpenerimaan,1 as kdkelompoklayanan,1 as kdlayanan,
                    '13. Instalasi Farmasi' as kelompok,'a. Instalasi Farmasi' as kelompoklayanan,'1. R. Jalan' as layanan,pd.noregistrasi,ps.namapasien
                    from pelayananpasien_t pt 
                    inner join strukpelayanan_t st on st.norec=pt.strukfk 
                    inner join strukbuktipenerimaan_t sbm on sbm.nostrukfk =st.norec 
                    inner join antrianpasiendiperiksa_t at2 on at2.norec=pt.noregistrasifk 
                    inner join pasiendaftar_t as pd on pd.norec=at2.noregistrasifk
                    inner join pasien_m as ps on ps.id=pd.nocmfk
                    inner join produk_m pr on pr.id=pt.produkfk
                    inner join ruangan_m ru on ru.id=at2.objectruanganfk 
                    -- LEFT join mapruangantoproduk_m mm on mm.objectprodukfk =pt.produkfk and at2.objectruanganfk =mm.objectruanganfk 
                    -- left join penerimaankasir_m pm on pm.id=mm.objectlappenerimaanfk 
                    where sbm.tglsbm  BETWEEN '$tglAwal' and '$tglAkhir'  and pt.isobat =1
                    -- and pm.kdkelompokpenerimaan = 13
                    order by pr.namaproduk
                "
            ));

            return $this->respond($data);
        }
        if($kdkelompok == 101){
            $data = \DB::select(DB::raw("
                
                    select   '' as namaruangan ,pr.namaproduk ,
                    pr.id as produkfk , spd.hargasatuan ,spd.qtyproduk,((spd.hargasatuan-(case when spd.hargadiscount is null then 0 else spd.hargadiscount end))* spd.qtyproduk)   as total ,
                    sp.nostruk ,sbm.nosbm ,1 as objectruanganfk ,1 as mmid,1 as objectlappenerimaanfk ,0 as isobat ,'' as strukresepfk , 138 as kdkelompokpenerimaan,1 as kdkelompoklayanan,1 as kdlayanan,
                    '' as kelompok,'' as kelompoklayanan,'' as layanan,sp.nostruk as noregistrasi,sp.namapasien_klien as namapasien
                        from strukpelayanan_t as sp
                    INNER JOIN strukpelayanandetail_t as spd on spd.nostrukfk=sp.norec
                    INNER JOIN produk_m as pr on pr.id=spd.objectprodukfk
                        INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk = sp.norec
                        WHERE  sp.objectkelompoktransaksifk in (13)
                        AND sbm.tglsbm BETWEEN '$tglAwal' and '$tglAkhir'
                        AND sp.nosbmlastfk IS NOT NULL
                "
            ));
            return $this->respond($data);
        }
        if($kdkelompok == 102){
            $data = \DB::select(DB::raw("
                
                    select   '' as namaruangan ,pr.namaproduk ,
                    pr.id as produkfk , spd.hargasatuan ,spd.qtyproduk,((spd.hargasatuan-(case when spd.hargadiscount is null then 0 else spd.hargadiscount end))* spd.qtyproduk)   as total ,
                    sp.nostruk ,sbm.nosbm ,1 as objectruanganfk ,1 as mmid,1 as objectlappenerimaanfk ,0 as isobat ,'' as strukresepfk , 138 as kdkelompokpenerimaan,1 as kdkelompoklayanan,1 as kdlayanan,
                    '' as kelompok,'' as kelompoklayanan,'' as layanan,sp.nostruk as noregistrasi,sp.namapasien_klien as namapasien
                        from strukpelayanan_t as sp
                    INNER JOIN strukpelayanandetail_t as spd on spd.nostrukfk=sp.norec
                    INNER JOIN produk_m as pr on pr.id=spd.objectprodukfk
                        INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk = sp.norec
                        WHERE  sp.objectkelompoktransaksifk in (138)
                        AND sbm.tglsbm BETWEEN '$tglAwal' and '$tglAkhir'
                        AND sp.nosbmlastfk IS NOT NULL
                "
            ));
            return $this->respond($data);
        }
        if($kdkelompok == 201){
            $data = \DB::select(DB::raw("
                
                    select   '' as namaruangan ,pr.namaproduk ,
                    pr.id as produkfk , spd.hargasatuan ,spd.qtyproduk,((spd.hargasatuan-(case when spd.hargadiscount is null then 0 else spd.hargadiscount end))* spd.qtyproduk)   as total ,
                    sp.nostruk ,sbm.nosbm ,1 as objectruanganfk ,1 as mmid,1 as objectlappenerimaanfk ,0 as isobat ,'' as strukresepfk , 138 as kdkelompokpenerimaan,1 as kdkelompoklayanan,1 as kdlayanan,
                    '' as kelompok,'' as kelompoklayanan,'' as layanan,sp.nostruk as noregistrasi,sp.namapasien_klien as namapasien
                        from strukpelayanan_t as sp
                    INNER JOIN strukpelayanandetail_t as spd on spd.nostrukfk=sp.norec
                    INNER JOIN produk_m as pr on pr.id=spd.objectprodukfk
                        INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk = sp.norec
                        WHERE  sp.objectkelompoktransaksifk in (9)
                        AND sbm.tglsbm BETWEEN '$tglAwal' and '$tglAkhir'
                        AND sp.nosbmlastfk IS NOT NULL
                "
            ));
            return $this->respond($data);
        }
        if($kdkelompok == 202){
            $data = \DB::select(DB::raw("
                
                    select   '' as namaruangan ,pr.namaproduk ,
                    pr.id as produkfk , spd.hargasatuan ,spd.qtyproduk,((spd.hargasatuan-(case when spd.hargadiscount is null then 0 else spd.hargadiscount end))* spd.qtyproduk)   as total ,
                    sp.nostruk ,sbm.nosbm ,1 as objectruanganfk ,1 as mmid,1 as objectlappenerimaanfk ,0 as isobat ,'' as strukresepfk , 138 as kdkelompokpenerimaan,1 as kdkelompoklayanan,1 as kdlayanan,
                    '' as kelompok,'' as kelompoklayanan,'' as layanan,sp.nostruk as noregistrasi,sp.namapasien_klien as namapasien
                        from strukpelayanan_t as sp
                    INNER JOIN strukpelayanandetail_t as spd on spd.nostrukfk=sp.norec
                    INNER JOIN produk_m as pr on pr.id=spd.objectprodukfk
                        INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk = sp.norec
                        WHERE  sp.objectkelompoktransaksifk in (139,142)
                        AND sbm.tglsbm BETWEEN '$tglAwal' and '$tglAkhir'
                        AND sp.nosbmlastfk IS NOT NULL
                "
            ));
            return $this->respond($data);
        }
        if($kdkelompok == 203){
            $data = \DB::select(DB::raw("
                
                    select   '' as namaruangan ,pr.namaproduk ,
                    pr.id as produkfk , spd.hargasatuan ,spd.qtyproduk,((spd.hargasatuan-(case when spd.hargadiscount is null then 0 else spd.hargadiscount end))* spd.qtyproduk)   as total ,
                    sp.nostruk ,sbm.nosbm ,1 as objectruanganfk ,1 as mmid,1 as objectlappenerimaanfk ,0 as isobat ,'' as strukresepfk , 138 as kdkelompokpenerimaan,1 as kdkelompoklayanan,1 as kdlayanan,
                    '' as kelompok,'' as kelompoklayanan,'' as layanan,sp.nostruk as noregistrasi,sp.namapasien_klien as namapasien
                        from strukpelayanan_t as sp
                    INNER JOIN strukpelayanandetail_t as spd on spd.nostrukfk=sp.norec
                    INNER JOIN produk_m as pr on pr.id=spd.objectprodukfk
                        INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk = sp.norec
                        WHERE  sp.objectkelompoktransaksifk in (150)
                        AND sbm.tglsbm BETWEEN '$tglAwal' and '$tglAkhir'
                        AND sp.nosbmlastfk IS NOT NULL
                "
            ));
            return $this->respond($data);
        }
        if($kdkelompok == 204){
            $data = \DB::select(DB::raw("
                
                    select   '' as namaruangan ,pr.namaproduk ,
                    pr.id as produkfk , spd.hargasatuan ,spd.qtyproduk,((spd.hargasatuan-(case when spd.hargadiscount is null then 0 else spd.hargadiscount end))* spd.qtyproduk)   as total ,
                    sp.nostruk ,sbm.nosbm ,1 as objectruanganfk ,1 as mmid,1 as objectlappenerimaanfk ,0 as isobat ,'' as strukresepfk , 138 as kdkelompokpenerimaan,1 as kdkelompoklayanan,1 as kdlayanan,
                    '' as kelompok,'' as kelompoklayanan,'' as layanan,sp.nostruk as noregistrasi,sp.namapasien_klien as namapasien
                        from strukpelayanan_t as sp
                    INNER JOIN strukpelayanandetail_t as spd on spd.nostrukfk=sp.norec
                    INNER JOIN produk_m as pr on pr.id=spd.objectprodukfk
                        INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk = sp.norec
                        WHERE  sp.objectkelompoktransaksifk in (143)
                        AND sbm.tglsbm BETWEEN '$tglAwal' and '$tglAkhir'
                        AND sp.nosbmlastfk IS NOT NULL
                "
            ));
            return $this->respond($data);
        }
        if($kdkelompok == 206){
            $data = \DB::select(DB::raw("
                
                    select   '' as namaruangan ,pr.namaproduk ,
                    pr.id as produkfk , spd.hargasatuan ,spd.qtyproduk,((spd.hargasatuan-(case when spd.hargadiscount is null then 0 else spd.hargadiscount end))* spd.qtyproduk)   as total ,
                    sp.nostruk ,sbm.nosbm ,1 as objectruanganfk ,1 as mmid,1 as objectlappenerimaanfk ,0 as isobat ,'' as strukresepfk , 138 as kdkelompokpenerimaan,1 as kdkelompoklayanan,1 as kdlayanan,
                    '' as kelompok,'' as kelompoklayanan,'' as layanan,sp.nostruk as noregistrasi,sp.namapasien_klien as namapasien
                        from strukpelayanan_t as sp
                    INNER JOIN strukpelayanandetail_t as spd on spd.nostrukfk=sp.norec
                    INNER JOIN produk_m as pr on pr.id=spd.objectprodukfk
                        INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk = sp.norec
                        WHERE  sp.objectkelompoktransaksifk in (145)
                        AND sbm.tglsbm BETWEEN '$tglAwal' and '$tglAkhir'
                        AND sp.nosbmlastfk IS NOT NULL
                "
            ));
            return $this->respond($data);
        }
        if($kdkelompok == 207){
            $data = \DB::select(DB::raw("
                
                    select   '' as namaruangan ,pr.namaproduk ,
                    pr.id as produkfk , spd.hargasatuan ,spd.qtyproduk,((spd.hargasatuan-(case when spd.hargadiscount is null then 0 else spd.hargadiscount end))* spd.qtyproduk)   as total ,
                    sp.nostruk ,sbm.nosbm ,1 as objectruanganfk ,1 as mmid,1 as objectlappenerimaanfk ,0 as isobat ,'' as strukresepfk , 138 as kdkelompokpenerimaan,1 as kdkelompoklayanan,1 as kdlayanan,
                    '' as kelompok,'' as kelompoklayanan,'' as layanan,sp.nostruk as noregistrasi,sp.namapasien_klien as namapasien
                        from strukpelayanan_t as sp
                    INNER JOIN strukpelayanandetail_t as spd on spd.nostrukfk=sp.norec
                    INNER JOIN produk_m as pr on pr.id=spd.objectprodukfk
                        INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk = sp.norec
                        WHERE  sp.objectkelompoktransaksifk in (146)
                        AND sbm.tglsbm BETWEEN '$tglAwal' and '$tglAkhir'
                        AND sp.nosbmlastfk IS NOT NULL
                "
            ));
            return $this->respond($data);
        }
        if($kdkelompok == 208){
            $data = \DB::select(DB::raw("
                
                    select   '' as namaruangan ,pr.namaproduk ,
                    pr.id as produkfk , spd.hargasatuan ,spd.qtyproduk,((spd.hargasatuan-(case when spd.hargadiscount is null then 0 else spd.hargadiscount end))* spd.qtyproduk)   as total ,
                    sp.nostruk ,sbm.nosbm ,1 as objectruanganfk ,1 as mmid,1 as objectlappenerimaanfk ,0 as isobat ,'' as strukresepfk , 138 as kdkelompokpenerimaan,1 as kdkelompoklayanan,1 as kdlayanan,
                    '' as kelompok,'' as kelompoklayanan,'' as layanan,sp.nostruk as noregistrasi,sp.namapasien_klien as namapasien
                        from strukpelayanan_t as sp
                    INNER JOIN strukpelayanandetail_t as spd on spd.nostrukfk=sp.norec
                    INNER JOIN produk_m as pr on pr.id=spd.objectprodukfk
                        INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk = sp.norec
                        WHERE  sp.objectkelompoktransaksifk in (147)
                        AND sbm.tglsbm BETWEEN '$tglAwal' and '$tglAkhir'
                        AND sp.nosbmlastfk IS NOT NULL
                "
            ));
            return $this->respond($data);
        }
        if($kdkelompok == 209){
            $data = \DB::select(DB::raw("
                
                    select   '' as namaruangan ,pr.namaproduk ,
                    pr.id as produkfk , spd.hargasatuan ,spd.qtyproduk,((spd.hargasatuan-(case when spd.hargadiscount is null then 0 else spd.hargadiscount end))* spd.qtyproduk)   as total ,
                    sp.nostruk ,sbm.nosbm ,1 as objectruanganfk ,1 as mmid,1 as objectlappenerimaanfk ,0 as isobat ,'' as strukresepfk , 138 as kdkelompokpenerimaan,1 as kdkelompoklayanan,1 as kdlayanan,
                    '' as kelompok,'' as kelompoklayanan,'' as layanan,sp.nostruk as noregistrasi,sp.namapasien_klien as namapasien
                        from strukpelayanan_t as sp
                    INNER JOIN strukpelayanandetail_t as spd on spd.nostrukfk=sp.norec
                    INNER JOIN produk_m as pr on pr.id=spd.objectprodukfk
                        INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk = sp.norec
                        WHERE  sp.objectkelompoktransaksifk in (6)
                        AND sbm.tglsbm BETWEEN '$tglAwal' and '$tglAkhir'
                        AND sp.nosbmlastfk IS NOT NULL
                "
            ));
            return $this->respond($data);
        }
        if($kdkelompok == 210){
            $data = \DB::select(DB::raw("
                
                    select   '' as namaruangan ,pr.namaproduk ,
                    pr.id as produkfk , spd.hargasatuan ,spd.qtyproduk,((spd.hargasatuan-(case when spd.hargadiscount is null then 0 else spd.hargadiscount end))* spd.qtyproduk)   as total ,
                    sp.nostruk ,sbm.nosbm ,1 as objectruanganfk ,1 as mmid,1 as objectlappenerimaanfk ,0 as isobat ,'' as strukresepfk , 138 as kdkelompokpenerimaan,1 as kdkelompoklayanan,1 as kdlayanan,
                    '' as kelompok,'' as kelompoklayanan,'' as layanan,sp.nostruk as noregistrasi,sp.namapasien_klien as namapasien
                        from strukpelayanan_t as sp
                    INNER JOIN strukpelayanandetail_t as spd on spd.nostrukfk=sp.norec
                    INNER JOIN produk_m as pr on pr.id=spd.objectprodukfk
                        INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk = sp.norec
                        WHERE  sp.objectkelompoktransaksifk in (148,149,4)
                        AND sbm.tglsbm BETWEEN '$tglAwal' and '$tglAkhir'
                        AND sp.nosbmlastfk IS NOT NULL
                "
            ));
            return $this->respond($data);
        }
            $data = \DB::select(DB::raw("
                select  ru.namaruangan ,pr.namaproduk ,
                    pt.produkfk ,pt.hargasatuan ,pt.jumlah,((pt.hargasatuan-(case when pt.hargadiscount is null then 0 else pt.hargadiscount end))* pt.jumlah) + CASE when pt.jasa is null then 0 else pt.jasa end as total ,
                    st.nostruk ,sbm.nosbm ,at2.objectruanganfk ,mm.id as mmid,mm.objectlappenerimaanfk ,pt.isobat ,pt.strukresepfk , pm.kdkelompokpenerimaan,pm.kdkelompoklayanan,pm.kdlayanan,
                    pm.kelompok,pm.kelompoklayanan,pm.layanan,pd.noregistrasi,ps.namapasien
                    from pelayananpasien_t pt 
                    inner join strukpelayanan_t st on st.norec=pt.strukfk 
                    inner join strukbuktipenerimaan_t sbm on sbm.nostrukfk =st.norec 
                    inner join antrianpasiendiperiksa_t at2 on at2.norec=pt.noregistrasifk 
                    inner join pasiendaftar_t as pd on pd.norec=at2.noregistrasifk
                    inner join pasien_m as ps on ps.id=pd.nocmfk
                    inner join produk_m pr on pr.id=pt.produkfk
                    inner join ruangan_m ru on ru.id=at2.objectruanganfk 
                    LEFT join mapruangantoproduk_m mm on mm.objectprodukfk =pt.produkfk and at2.objectruanganfk =mm.objectruanganfk 
                    left join penerimaankasir_m pm on pm.id=mm.objectlappenerimaanfk 
                    where sbm.tglsbm  BETWEEN '$tglAwal' and '$tglAkhir' 
                    and pm.kdkelompokpenerimaan = $kdkelompok
                    
                "
            ));
            return $this->respond($data);
        





    }
    public function get1MapLaporanPenerimaan(Request $request){
        //todo : laporan penerimaan
        if  ($request['kdkelompok'] == '-'){
            $kdkelompok = ' is null';
        }else{
            $kdkelompok = '=  ' . $request['kdkelompok'];
        }
        $data = \DB::select(DB::raw("
                select mp.id,dm.namadepartemen ,ru.namaruangan ,pr.namaproduk ,pm.kdkelompokpenerimaan ,pm.kelompokpenerimaan ,pm.kelompok ,pm.kelompoklayanan ,pm.layanan ,
                  pm.kdkelompoklayanan,pm.kdlayanan
                    from mapruangantoproduk_m as mp
                    INNER JOIN produk_m as pr on pr.id = mp.objectprodukfk
                    INNER JOIN ruangan_m as ru on ru.id=mp.objectruanganfk 
                    INNER JOIN departemen_m dm on dm.id=ru.objectdepartemenfk 
                    left join penerimaankasir_m pm on pm.id =mp.objectlappenerimaanfk 
                    --WHERE ru.namaruangan  like '%lab%' --and mp.objectprodukfk =4041209
                    --WHERE ru.objectdepartemenfk =16
                    --where  ru.id=573 and pr.id=1002121632
                    --WHERE mp.id=2601
                    --WHERE mp.objectlappenerimaanfk =48
                    --and pr.namaproduk  like 'Administrasi%'
                    --WHERE  pr.id in (4040398) and ru.id=564
                    where pm.kdkelompokpenerimaan $kdkelompok
                    order by pr.namaproduk;
                "
        ));

        return $this->respond($data);

    }
    public function get1DataComboLaporanPenerimaan(Request $request){
        //todo : laporan penerimaan
        $kdkelompok = $request['kdkelompok'];
        $data = \DB::select(DB::raw("
                select DISTINCT kdkelompokpenerimaan,kelompok from penerimaankasir_m;
                "
        ));
        $data2 = \DB::select(DB::raw("
                select DISTINCT kdkelompokpenerimaan,kdkelompoklayanan,kelompoklayanan from penerimaankasir_m
                "
        ));
        $data3 = \DB::select(DB::raw("
                select DISTINCT kdkelompokpenerimaan,kdkelompoklayanan,kdlayanan,layanan,id as idlap from penerimaankasir_m
                "
        ));

        $result = array(
            'kelompok' => $data,
            'kelomopoklayanan' => $data2,
            'layanan' => $data3,
            'by' =>'as@epic'
        );

        return $this->respond($result);

    }

    public function getDataLaporanRekapPendapatanHarian(Request $request){
        //todo : laporan penerimaan
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
//        $data = \DB::select(DB::raw("SELECT x.subheader,x.penerimaankasir,x.kelompokpenerimaan_produk,x.penerimaan_produk,SUM(x.total) AS total,x.nopenerimaan
//                            FROM ruangan_m AS ru
//                            LEFT JOIN (SELECT 'a. Rekam Medik' as subheader,ru.id,'A.1. Rawat Jalan' as penerimaankasir,((pp.hargasatuan-(CASE WHEN pp.hargadiscount IS NULL THEN  0
//                                      ELSE pp.hargadiscount END))*pp.jumlah)+CASE WHEN pp.jasa is null then 0 else pp.jasa end as total,
//                                      pro.penerimaankasir as penerimaan_produk,pro.kelompokpenerimaan as kelompokpenerimaan_produk,1 as nopenerimaan
//                            FROM pelayananpasien_t as pp
//                            INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
//                            INNER JOIN produk_m as pro on pro.id = pp.produkfk
//                            INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
//                            INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
//                            INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
//                            INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
//                            where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
//                                  and pro.id in (4040398,4040399,4040406) and ru.id not in (558,560,561,559,577,580,569)
//
//                            UNION ALL
//
//                            SELECT 'b. Poli Spesialis Psikiatri' as subheader,ru.id,'A.1. Rawat Jalan' as penerimaankasir,((pp.hargasatuan-(CASE WHEN pp.hargadiscount IS NULL THEN  0
//                                     ELSE pp.hargadiscount END))*pp.jumlah)+CASE WHEN pp.jasa is null then 0 else pp.jasa end as total,
//                                     pro.penerimaankasir as penerimaan_produk,pro.kelompokpenerimaan as kelompokpenerimaan_produk,1 as nopenerimaan
//                            from pelayananpasien_t as pp
//                            INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
//                            INNER JOIN produk_m as pro on pro.id = pp.produkfk
//                            INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
//                            INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
//                            INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
//                            INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
//                            where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
//                                        and pro.id in (4040404,4040405,40411416,4040400,4040407)
//                                        and ru.id in (566,563)
//
//                            UNION ALL
//
//                            SELECT 'c. Poli Spesialis Saraf' as subheader,ru.id,'A.1. Rawat Jalan' as penerimaankasir,((pp.hargasatuan-(CASE WHEN pp.hargadiscount IS NULL THEN  0
//                                     ELSE pp.hargadiscount END))*pp.jumlah)+CASE WHEN pp.jasa is null then 0 else pp.jasa end as total,
//                                     pro.penerimaankasir as penerimaan_produk,pro.kelompokpenerimaan as kelompokpenerimaan_produk,1 as nopenerimaan
//                            from pelayananpasien_t as pp
//                            INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
//                            INNER JOIN produk_m as pro on pro.id = pp.produkfk
//                            INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
//                            INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
//                            INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
//                            INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
//                            where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
//                                and pro.id in (4040404,4040405,40411416,4040400,4040407,4040398,4040406,4040399)
//                                and ru.id in (558)
//
//                            UNION ALL
//
//                            SELECT 'd. Poli Spesialis PD' as subheader,ru.id,'A.1. Rawat Jalan' as penerimaankasir,((pp.hargasatuan-(CASE WHEN pp.hargadiscount IS NULL THEN  0
//                                 ELSE pp.hargadiscount END))*pp.jumlah)+CASE WHEN pp.jasa is null then 0 else pp.jasa end as total,
//                                 pro.penerimaankasir as penerimaan_produk,pro.kelompokpenerimaan as kelompokpenerimaan_produk,1 as nopenerimaan
//                            from pelayananpasien_t as pp
//                            INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
//                            INNER JOIN produk_m as pro on pro.id = pp.produkfk
//                            INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
//                            INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
//                            INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
//                            INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
//                            where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
//                                        and pro.id in (4040404,4040405,40411416,4040400,4040407,4040398,4040406,4040399)
//                                        and ru.id in (559)
//
//                            UNION ALL
//
//                            SELECT 'e. Poli Spesialis K&K' as subheader,ru.id,'A.1. Rawat Jalan' as penerimaankasir,((pp.hargasatuan-(CASE WHEN pp.hargadiscount IS NULL THEN  0
//                                     ELSE pp.hargadiscount END))*pp.jumlah)+CASE WHEN pp.jasa is null then 0 else pp.jasa end as total,
//                                     pro.penerimaankasir as penerimaan_produk,pro.kelompokpenerimaan as kelompokpenerimaan_produk,1 as nopenerimaan
//                            from pelayananpasien_t as pp
//                            INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
//                            INNER JOIN produk_m as pro on pro.id = pp.produkfk
//                            INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
//                            INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
//                            INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
//                            INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
//                            where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
//                                and pro.id in (4040404,4040405,40411416,4040400,4040407,4040398,4040406,4040399)
//                                and ru.id in (561)
//
//                            UNION ALL
//
//                            SELECT 'f. Poli Spesialis Anak' as subheader,ru.id,'A.1. Rawat Jalan' as penerimaankasir,((pp.hargasatuan-(CASE WHEN pp.hargadiscount IS NULL THEN  0
//                                     ELSE pp.hargadiscount END))*pp.jumlah)+CASE WHEN pp.jasa is null then 0 else pp.jasa end as total,
//                                     pro.penerimaankasir as penerimaan_produk,pro.kelompokpenerimaan as kelompokpenerimaan_produk,1 as nopenerimaan
//                            from pelayananpasien_t as pp
//                            INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
//                            INNER JOIN produk_m as pro on pro.id = pp.produkfk
//                            INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
//                            INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
//                            INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
//                            INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
//                            where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
//                                        and pro.id in (4040404,4040405,40411416,4040400,4040407,4040398,4040406,4040399)
//                                        and ru.id in (560)
//
//                            UNION ALL
//
//                            SELECT 'g. Poli Spesialis Rehab Medik' as subheader,ru.id,'A.1. Rawat Jalan' as penerimaankasir,((pp.hargasatuan-(CASE WHEN pp.hargadiscount IS NULL THEN  0
//                                     ELSE pp.hargadiscount END))*pp.jumlah)+CASE WHEN pp.jasa is null then 0 else pp.jasa end as total,
//                                     pro.penerimaankasir as penerimaan_produk,pro.kelompokpenerimaan as kelompokpenerimaan_produk,1 as nopenerimaan
//                            from pelayananpasien_t as pp
//                            INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
//                            INNER JOIN produk_m as pro on pro.id = pp.produkfk
//                            INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
//                            INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
//                            INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
//                            INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
//                            where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
//                                and pro.id in (4040404,4040405,40411416,4040400,4040407,4040398,4040406,4040399)
//                                and ru.id in (577,580)
//
//                            UNION ALL
//
//                            SELECT CASE WHEN ru.id = 558 THEN 'l. TM Penyakit Saraf'
//                             WHEN ru.id = 559 THEN 'm. TM Penyakit Dalam'
//                             WHEN ru.id = 561 THEN 'n. TM Penyakit Kulit & Kel'
//                             WHEN ru.id = 560 THEN 'o. TM Penyakit ANAK'
//                             WHEN pro.id = 4040575 THEN 'i. MMPI'
//                             WHEN ru.id in (566,563) THEN 'j. Psikoterapi'
//                             ELSE 'k. Tindakan' END AS subheader,
//                             ru.id,'A.1. Rawat Jalan' as penerimaankasir,((pp.hargasatuan-(CASE WHEN pp.hargadiscount IS NULL THEN  0
//                             ELSE pp.hargadiscount END))*pp.jumlah)+CASE WHEN pp.jasa is null then 0 else pp.jasa end as total,
//                             CASE WHEN ru.id = 558 THEN 'TM Penyakit Saraf'
//                             WHEN ru.id = 559 THEN 'TM Penyakit Dalam'
//                             WHEN ru.id = 561 THEN 'TM Penyakit Kulit & Kel'
//                             WHEN ru.id = 560 THEN 'TM Penyakit ANAK'
//                             WHEN pro.id = 4040575 THEN 'MMPI'
//                             WHEN ru.id in (566,563) THEN 'Psikoterapi'
//                             ELSE 'Tindakan' END AS penerimaan_produk,
//                             'A. PELAYANAN PASIEN' AS kelompokpenerimaan_produk,1 as nopenerimaan
//                            from pelayananpasien_t as pp
//                            INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
//                            INNER JOIN produk_m as pro on pro.id = pp.produkfk
//                            INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
//                            INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
//                            INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
//                            INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
//                            where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
//                                        and pro.id not in (44040404,4040405,40411416,4040400,4040407,4040398,4040406,4040399)
//                                        and ru.id in (558,559,561,560,563,566) AND pp.strukresepfk IS NULL
//
//                            UNION ALL
//
//                            SELECT CASE WHEN pro.id in (4040398,4040399,4040406) THEN 'a. Rekam Medik IGD'
//                                         WHEN pro.id in (4040507,4041106,4041107,4041108,4041110,4041170,4041181,4041776) THEN 'b. Askep(Perawatan)'
//                                         WHEN pro.id in (4040404,4040405,40411416,4040400) THEN 'c. Pemeriksaan dr'
//                                         WHEN pro.id in (4040467,4040468,4040469,4040470,4040471,4040472,4040473) THEN 'e. AKOMODASI HCU/PICU/NICU'
//                                         ELSE 'd. Tindakan Medik IGD' END AS subheader,ru.id,'A.2. Instalasi Gawat Darurat' as penerimaankasir,
//                                         ((pp.hargasatuan-(CASE WHEN pp.hargadiscount IS NULL THEN  0 ELSE pp.hargadiscount END))*pp.jumlah)+CASE WHEN pp.jasa is null then 0 else pp.jasa end as total,
//                                         CASE WHEN pro.id in (4040398,4040399,4040406) THEN 'Rekam Medik IGD'
//                                         WHEN pro.id in (4040507,4041106,4041107,4041108,4041110,4041170,4041181,4041776) THEN 'Askep(Perawatan)'
//                                         WHEN pro.id in (4040404,4040405,40411416,4040400) THEN 'Pemeriksaan dr'
//                                         WHEN pro.id in (4040467,4040471) THEN 'VVIP'
//                                         WHEN pro.id in (4040468) THEN 'VIP'
//                                         WHEN pro.id in (4040469,4040472) THEN 'I'
//                                         WHEN pro.id in (4040470,4040473) THEN 'II'
//                                         WHEN pro.id in (28079,28080) THEN 'III'
//                                         ELSE 'Tindakan Medik IGD' END AS penerimaan_produk,'A. PELAYANAN PASIEN' AS kelompokpenerimaan_produk,2 as nopenerimaan
//                            FROM pelayananpasien_t as pp
//                            INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
//                            INNER JOIN produk_m as pro on pro.id = pp.produkfk
//                            INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
//                            INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
//                            INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
//                            INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
//                            where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
//                                        and ru.id = 569 and pp.strukresepfk IS NULL AND pro.id not in (4040575)
//
//
//                            UNION ALL
//
//                            SELECT CASE WHEN apd.objectkelasfk = 7 AND pro.id = 4041109 THEN 'VVIP Biasa'
//                                         WHEN apd.objectkelasfk = 4 AND pro.id = 4041109 THEN 'VIP Biasa'
//                                         WHEN apd.objectkelasfk = 3 AND pro.id = 4041109 THEN 'Kls I Biasa'
//                                         WHEN apd.objectkelasfk = 2 AND pro.id = 4041109 THEN 'Kls II Biasa'
//                                         WHEN apd.objectkelasfk = 1 AND pro.id = 4041109 THEN 'Kls III Biasa'
//                                         WHEN pro.id in (4040474,4040475) THEN 'Visite Dokter'
//                                         WHEN pro.id in (4040411,4041749,4041750,4041751,4041752) Then 'Gelang Pasien'
//                                         ELSE 'Psikoterapi RI' END AS subheader,
//                                         ru.id,'A.3. Rawat Inap' as penerimaankasir,((pp.hargasatuan-(CASE WHEN pp.hargadiscount IS NULL THEN  0
//                                         ELSE pp.hargadiscount END))*pp.jumlah)+CASE WHEN pp.jasa is null then 0 else pp.jasa end as total,
//                                         CASE WHEN apd.objectkelasfk = 7 AND pro.id = 4041109 THEN 'Intensif Care'
//                                         WHEN apd.objectkelasfk = 4 AND pro.id = 4041109 THEN 'Intensif Care'
//                                         WHEN apd.objectkelasfk = 3 AND pro.id = 4041109 THEN 'Intensif Care'
//                                         WHEN apd.objectkelasfk = 2 AND pro.id = 4041109 THEN 'Intensif Care'
//                                         WHEN apd.objectkelasfk = 1 AND pro.id = 4041109 THEN 'Intensif Care'
//                                         WHEN pro.id in (4040474,4040475) THEN 'Visite Dokter'
//                                         WHEN pro.id in (4040411,4041749,4041750,4041751,4041752) Then 'Gelang Pasien'
//                                         ELSE 'Psikoterapi RI' END AS penerimaan_produk,'A. PELAYANAN PASIEN' AS kelompokpenerimaan_produk,3 as nopenerimaan
//                            from pelayananpasien_t as pp
//                            INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
//                            INNER JOIN produk_m as pro on pro.id = pp.produkfk
//                            INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
//                            INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
//                            INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
//                            INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
//                            where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
//                                        and pp.strukresepfk IS NULL	and ru.objectdepartemenfk = 16
//                                        and pro.id not in (44040404,4040405,40411416,4040400,4040407,4040398,4040406,4040399,4040575)
//
//                            UNION ALL
//
//                            SELECT 'Instalasi Psikogeriatri' as subheader,ru.id,'A.5. Instalasi Psikogeriatri' as penerimaankasir,
//                                        ((pp.hargasatuan-(CASE WHEN pp.hargadiscount IS NULL THEN  0 ELSE pp.hargadiscount END))*pp.jumlah)+CASE WHEN pp.jasa is null then 0 else pp.jasa end as total,
//                                         'Instalasi Psikogeriatri' as penerimaan_produk,'A. PELAYANAN PASIEN' as kelompokpenerimaan_produk,5 as nopenerimaan
//                            from pelayananpasien_t as pp
//                            INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
//                            INNER JOIN produk_m as pro on pro.id = pp.produkfk
//                            INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
//                            INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
//                            INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
//                            INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
//                            where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
//                                        and pro.id NOT IN (4040398,4040399,4040406,4040575)
//                                        and pp.strukresepfk is null and ru.id in (567)
//
//                            UNION ALL
//
//                            SELECT CASE WHEN ru.id = 564 THEN 'Instalasi Napza'
//                                     WHEN ru.id = 565 THEN 'Instalasi Kes Jiwa Anak Remaja (TKA)'
//                                     WHEN ru.id = 575 THEN 'Instalasi Laboratorium'
//                                     WHEN ru.id = 576 THEN 'Instalasi Radiologi'
//                                     WHEN ru.id = 571 THEN 'Instalasi Elektromedik'
//                                     WHEN ru.id IN (572,573) THEN 'Instalasi Rehab Mental'
//                                     WHEN ru.id = 568 THEN 'Instalasi Gigi & Mulut'
//                                     WHEN ru.id = 574 THEN 'Instalasi Gizi' END AS subheader,ru.id,
//                                     CASE WHEN ru.id = 564 THEN 'A.4 Instalasi Napza'
//                                     WHEN ru.id = 565 THEN 'A.6. Instalasi Kes Jiwa Anak Remaja (TKA)'
//                                     WHEN ru.id = 575 THEN 'A.8. Instalasi Laboratorium'
//                                     WHEN ru.id = 576 THEN 'A.9. Instalasi Radiologi'
//                                     WHEN ru.id = 571 THEN 'A.10. Instalasi Elektromedik'
//                                     WHEN ru.id IN (572,573) THEN 'A.11. Instalasi Rehab Mental'
//                                     WHEN ru.id = 568 THEN 'A.12. Instalasi Gigi & Mulut'
//                                     WHEN ru.id = 574 THEN 'A.15. Instalasi Gizi' END AS penerimaankasir,
//                                     ((pp.hargasatuan-(CASE WHEN pp.hargadiscount IS NULL THEN  0 ELSE pp.hargadiscount END))*pp.jumlah)+
//                                     CASE WHEN pp.jasa is null then 0 else pp.jasa end as total,
//                                     CASE WHEN ru.id = 564 THEN 'Instalasi Napza'
//                                     WHEN ru.id = 565 THEN 'Instalasi Kes Jiwa Anak Remaja (TKA)'
//                                     WHEN ru.id = 575 THEN 'Instalasi Laboratorium'
//                                     WHEN ru.id = 576 THEN 'Instalasi Radiologi'
//                                     WHEN ru.id = 571 THEN 'Instalasi Elektromedik'
//                                     WHEN ru.id IN (572,573) THEN 'Instalasi Rehab Mental'
//                                     WHEN ru.id = 568 THEN 'Instalasi Gigi & Mulut'
//                                     WHEN ru.id = 574 THEN 'Instalasi Gizi' END AS penerimaan_produk,
//                                    'A. PELAYANAN PASIEN' AS kelompokpenerimaan_produk,
//                                    CASE WHEN ru.id = 564 THEN 4
//                                    WHEN ru.id = 565 THEN 6
//                                    WHEN ru.id = 575 THEN 8
//                                    WHEN ru.id = 576 THEN 9
//                                    WHEN ru.id = 571 THEN 10
//                                    WHEN ru.id IN (572,573) THEN 11
//                                    WHEN ru.id = 568 THEN 12
//                                    WHEN ru.id = 574 THEN 15 END AS nopenerimaan
//                            FROM pelayananpasien_t as pp
//                            INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
//                            INNER JOIN produk_m as pro on pro.id = pp.produkfk
//                            INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
//                            INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
//                            INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
//                            INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
//                            where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
//                                        AND ru.id in (564,565,575,576,571,568,574,572,573)
//                                        AND pp.strukresepfk IS NULL and pro.id not in (4040398,4040406,4040399,4040575) --(44040404,4040405,40411416,4040400,4040407,4040398,4040406,4040399)
//
//                            UNION ALL
//
//                            SELECT 'Instalasi Fisioterapi' as subheader,ru.id,'A.7. Instalasi Fisioterapi' as penerimaankasir,
//                                        ((pp.hargasatuan-(CASE WHEN pp.hargadiscount IS NULL THEN  0 ELSE pp.hargadiscount END))*pp.jumlah)+CASE WHEN pp.jasa is null then 0 else pp.jasa end as total,
//                                         'Instalasi Fisioterapi' as penerimaan_produk,'A. PELAYANAN PASIEN' as kelompokpenerimaan_produk,7 as nopenerimaan
//                            from pelayananpasien_t as pp
//                            INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
//                            INNER JOIN produk_m as pro on pro.id = pp.produkfk
//                            INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
//                            INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
//                            INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
//                            INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
//                            where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
//                                        and pro.id NOT IN (44040404,4040405,40411416,4040400,4040407,4040398,4040406,4040399,4040575)
//                                        and pp.strukresepfk is null and ru.id in (577)
//
//                            UNION ALL
//
//                            SELECT CASE WHEN ru.id in (94,125) THEN 'R. Jalan'
//                                         WHEN ru.id in (116) THEN 'R. Ranap' END AS subheader,ru.id,
//                                         'A.13. Instalasi Farmasi' AS penerimaankasir,
//                                         ((pp.hargasatuan - (case when pp.hargadiscount is null then 0 else pp.hargadiscount end)) * pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total,
//                                         CASE WHEN ru.id in (94,125) THEN 'R. Jalan'
//                                         WHEN  ru.id in (116) THEN 'R. Ranap' END AS penerimaan_produk,
//                                         'A. PELAYANAN PASIEN' AS kelompokpenerimaan_produk,13 AS nopenerimaan
//                            from pelayananpasien_t as pp
//                            INNER JOIN strukresep_t as sr on sr.norec=pp.strukresepfk
//                            INNER JOIN ruangan_m as ru on ru.id=sr.ruanganfk
//                            INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
//                            INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
//                            where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
//
//                            UNION ALL
//
//                            select
//                                     CASE WHEN ru.id in (94,125) THEN 'R. Jalan'
//                                     WHEN  ru.id in (116) THEN 'R. Ranap' END AS subheader,ru.id,
//                                     'A.13. Instalasi Farmasi' AS penerimaankasir,
//                                     CASE WHEN sbm.totaldibayar IS NULL THEN 0 ELSE sbm.totaldibayar END AS total,
//                                     CASE WHEN ru.id in (94,125) THEN 'R. Jalan'
//                                     WHEN  ru.id in (116) THEN 'R. Ranap' END AS penerimaan_produk,
//                                     'A. PELAYANAN PASIEN' AS kelompokpenerimaan_produk,13 AS nopenerimaan
//                            from strukpelayanan_t as sp
//                                 INNER JOIN ruangan_m as ru on ru.id = sp.objectruanganfk
//                                 INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk = sp.norec
//                                 WHERE sp.objectkelompoktransaksifk = 2 AND sp.keteranganlainnya = 'Penjualan Obat Bebas'
//                                 AND sbm.tglsbm BETWEEN '$tglAwal' and '$tglAkhir'
//
//                            UNION ALL
//
//                            SELECT  'Visite Apt' AS subheader,ru.id,
//                                            'A.13. Instalasi Farmasi' AS penerimaankasir,
//                                            ((pp.hargasatuan-(CASE WHEN pp.hargadiscount IS NULL THEN 0 ELSE pp.hargadiscount END))*pp.jumlah)+
//                                            CASE WHEN pp.jasa is null then 0 else pp.jasa end as total,'Visite Apt' AS penerimaan_produk,
//                                            'A. PELAYANAN PASIEN' AS kelompokpenerimaan_produk,13 AS nopenerimaan
//                            FROM pelayananpasien_t as pp
//                                            INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
//                                            INNER JOIN produk_m as pro on pro.id = pp.produkfk
//                                            INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
//                                            INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
//                                            INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
//                                            INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
//                            where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
//                            AND pro.id = 4041191
//
//                            UNION ALL
//
//                            SELECT  CASE WHEN ru1.objectdepartemenfk = 16 THEN 'R. Ranap' ELSE 'R.Jalan' END AS subheader,ru.id,
//                                            'A.14. Instalasi Psikologi' AS penerimaankasir,
//                                            ((pp.hargasatuan-(CASE WHEN pp.hargadiscount IS NULL THEN 0 ELSE pp.hargadiscount END))*pp.jumlah)+
//                                            CASE WHEN pp.jasa is null then 0 else pp.jasa end as total,
//                                            CASE WHEN ru.objectdepartemenfk = 16 THEN 'R. Ranap' ELSE 'R.Jalan' END AS penerimaan_produk,
//                                            'A. PELAYANAN PASIEN' AS kelompokpenerimaan_produk,14 AS nopenerimaan
//                            FROM pelayananpasien_t as pp
//                            INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
//                            INNER JOIN produk_m as pro on pro.id = pp.produkfk
//                            INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
//                            INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
//                            INNER JOIN ruangan_m as ru1 on ru1.id=pd.objectruanganlastfk
//                            INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
//                            INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
//                            where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
//                                        AND pro.id not in (4040398,4040399,4040406,4040575)
//                                        AND ru.id = 570 and pp.strukresepfk IS NULL
//
//                            UNION ALL
//
//                            select 'Diklat' AS subheader,579 as id,'B.1. Diklat' AS penerimaankasir,
//                                         CASE WHEN sbm.totaldibayar IS NULL THEN 0 ELSE sbm.totaldibayar END AS total,
//                                         'Diklat' AS penerimaan_produk,'B. PENDAPATAN PENDIDIKAN DAN PELATIHAN' AS kelompokpenerimaan_produk,
//                                         15 AS nopenerimaan
//                            from strukpelayanan_t as sp
//                            INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk = sp.norec
//                            WHERE sp.objectkelompoktransaksifk =13
//                                        AND sp.tglstruk BETWEEN '$tglAwal' and '$tglAkhir'
//
//                            UNION ALL
//
//                            select 'Jasa Ketatausahaan' AS subheader,604 as id,'B.2. Jasa Ketatausahaan' AS penerimaankasir,
//                                         CASE WHEN sbm.totaldibayar IS NULL THEN 0 ELSE sbm.totaldibayar END AS total,
//                                         'Jasa Ketatausahaan' AS penerimaan_produk,'B. PENDAPATAN PENDIDIKAN DAN PELATIHAN' AS kelompokpenerimaan_produk,
//                                         16 AS nopenerimaan
//                            from strukpelayanan_t as sp
//                            INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk = sp.norec
//                            WHERE sp.objectkelompoktransaksifk = 2
//                                        AND sp.keteranganlainnya <> 'Penjualan Obat Bebas'
//                                        AND sbm.tglsbm BETWEEN '$tglAwal' and '$tglAkhir'
//
//                             UNION ALL
//
//                            select
//                                         'Sewa Ruang' AS subheader,605 as id,'B.3. Sewa Ruang' AS penerimaankasir,
//                                         CASE WHEN sbm.totaldibayar IS NULL THEN 0 ELSE sbm.totaldibayar END AS total,
//                                         'Sewa Ruang' AS penerimaan_produk,'C. PENDAPATAN LAIN_LAIN' AS kelompokpenerimaan_produk,
//                                         17 AS nopenerimaan
//                            from strukpelayanan_t as sp
//                            INNER JOIN strukpelayanandetail_t as spd on spd.nostrukfk = sp.norec
//                            LEFT JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk = sp.norec
//                            WHERE spd.objectprodukfk in (4041304,4041305,4041306,4041307,4041308,4041309,4041310,4041311,4041312)
//                                                    AND sbm.tglsbm BETWEEN '$tglAwal' and '$tglAkhir'
//
//
//                            UNION ALL
//
//                            select 'Pendapatan Lainnya' AS subheader,606 as id,'B.4. Pendapatan Lainnya' AS penerimaankasir,
//                                         CASE WHEN sbm.totaldibayar IS NULL THEN 0 ELSE sbm.totaldibayar END AS total,
//                                         'Pendapatan Lainnya' AS penerimaan_produk,'C. PENDAPATAN LAIN_LAIN' AS kelompokpenerimaan_produk,
//                                         18 AS nopenerimaan
//                            from strukpelayanan_t as sp
//                            INNER JOIN strukpelayanandetail_t as spd on spd.nostrukfk = sp.norec
//                            INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk = sp.norec
//                            WHERE spd.objectprodukfk in (1002121435,402611) AND sp.objectkelompoktransaksifk not in (13)
//                                        AND sbm.tglsbm BETWEEN '$tglAwal' and '$tglAkhir'
//                            GROUP BY sbm.totaldibayar) as x on x.id=ru.id
//                            WHERE ru.ipaddress is not null and ru.kelompokpenerimaan is not null
//                            and x.subheader is not null
//                            GROUP BY x.subheader,x.penerimaankasir,x.kelompokpenerimaan_produk,x.penerimaan_produk,x.nopenerimaan
//                            ORDER BY x.nopenerimaan ASC"));
        $data = \DB::select(DB::raw("select pk.penerimaankasir,pk.kelompokpenerimaan,pk.kelompoklayanan,pk.layanan,SUM(z.total) AS total 
                from penerimaankasir_m as pk 
                left JOIN (SELECT x.id,SUM(x.total) as total
                FROM(select 1 as id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                 from pelayananpasien_t as pp
                 INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                 INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                 INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                 INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                 INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                 INNER JOIN produk_m as pro on pro.id = pp.produkfk
                 INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                 INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                 where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                 and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                 and pp.produkfk in (4040398,4040406) and ru.objectdepartemenfk not in (24,16)
                 and ru.id not in (558,559,560,561,577,580)
                 and pp.strukresepfk IS NULL
                
                 UNION ALL
                
                select 2 as id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in (4040399) and ru.objectdepartemenfk not in (24,16)
                and pp.strukresepfk IS NULL
                
                UNION ALL
                -- psikiatri geriatri dan jiwa dewasa
                select 3 as id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in (4040397,4040400,4040401,4040402,4040403)
                and ru.id in (566,567) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select CASE WHEN ru.id = 558 THEN 4 WHEN ru.id = 559 THEN 6 WHEN ru.id = 560 THEN 10 WHEN ru.id = 561 THEN 8 WHEN ru.id IN (577,580) THEN 12 END as id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and jp.id in (27682) and ru.id in (558,559,560,561,577,580)
                and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select CASE WHEN ru.id = 558 THEN 5 WHEN ru.id = 559 THEN 7 WHEN ru.id = 560 THEN 11 WHEN ru.id = 561 THEN 9 WHEN ru.id IN (577,580) THEN 13 END as id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in (4040397,4040400,4040401,4040402,4040403)
                and ru.id in (558,559,560,561,577,580) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 14 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk not in (4040399,4040398,4040406)
                and ru.id in (562) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select jp.objectpenerimaankasirfk as id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and jp.id in (27681) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select CASE WHEN ru.objectdepartemenfk not in (16) THEN 16 ELSE 43 END AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in (4040563,4040564,4040567,4040568) and pp.strukresepfk IS NULL
                
                UNION ALL

                select CASE WHEN ru.objectdepartemenfk not in (16) THEN 16 ELSE 43 END AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN pelayananpasientidakterklaim_t as ptt on ptt.pelayananpasien = pp.norec
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pd.nostruklastfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = ptt.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and ptt.produkfk in (4040563,4040564,4040567,4040568) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 17 as id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in (4040413) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select jp.objectpenerimaankasirfk as id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and jp.id in (27677,27678,27679,27680) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 22 AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between  '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in (4040398,4040406) and ru.id in (569) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select  22 AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN pelayananpasientidakterklaim_t as ptt on ptt.pelayananpasien = pp.norec
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pd.nostruklastfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = ptt.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between  '$tglAwal' and '$tglAkhir'
                and ptt.produkfk in (4040398,4040406) and ru.id in (569) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 23 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between  '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in (4041110) and ru.id in (569)
                and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select  23 AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN pelayananpasientidakterklaim_t as ptt on ptt.pelayananpasien = pp.norec
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pd.nostruklastfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = ptt.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between  '$tglAwal' and '$tglAkhir'
                and ptt.produkfk in (4041110) and ru.id in (569) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 24 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between  '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in (4040405,4040404,4040400,4040402,4040407) and ru.id in (569)
                and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select  24 AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN pelayananpasientidakterklaim_t as ptt on ptt.pelayananpasien = pp.norec
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pd.nostruklastfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = ptt.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between  '$tglAwal' and '$tglAkhir'
                and ptt.produkfk in (4040405,4040404,4040400,4040402,4040407) and ru.id in (569) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 25 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between  '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in (4040399,4040411,4041749,4041750,4041751,4041752) and ru.id in (569) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select  25 AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN pelayananpasientidakterklaim_t as ptt on ptt.pelayananpasien = pp.norec
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pd.nostruklastfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = ptt.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between  '$tglAwal' and '$tglAkhir'
                and ptt.produkfk in (4040399,4040411,4041749,4041750,4041751,4041752) and ru.id in (569) and pp.strukresepfk IS NULL

                
                UNION ALL
                
                select CASE WHEN pp.produkfk = 28079 and apd.objectkelasfk = 1 THEN 39
                WHEN pp.produkfk = 28080 and apd.objectkelasfk = 1 THEN 40
                WHEN pp.produkfk in (4040479,4040483,4040470) and apd.objectkelasfk = 2 THEN 37
                WHEN pp.produkfk = 4040473 and apd.objectkelasfk = 2 THEN 38
                WHEN pp.produkfk = 4040472 and apd.objectkelasfk = 3 THEN 36
                WHEN pp.produkfk in (4040469,4040478,4040482) and apd.objectkelasfk = 3 THEN 35
                WHEN pp.produkfk in (4040468,4040477,4040481) and apd.objectkelasfk in (4,5,8) THEN 33
                WHEN pp.produkfk = 4040471 and apd.objectkelasfk in (4,5,8) THEN 34
                WHEN pp.produkfk in (4040467,4040476,4040480) and apd.objectkelasfk = 7 THEN 31
                WHEN pp.produkfk = 4040471 and apd.objectkelasfk = 7 THEN 32
                WHEN pp.produkfk in (4040474,4040475) THEN 41
                WHEN pp.produkfk in (4040411,4041749,4041750,4041751,4041752) THEN 42 END AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and ru.objectdepartemenfk in (16)
                and pp.produkfk in (28079,28080,4040467,4040468,4040469,4040470,
                4040471,4040472,4040473,4040474,4040475,4040411,4040479,4040483,
                4041749,4041750,4041751,4041752,4040476,4040480,4040477,4040481,
                4040478,4040482)  and ru.id not in (596)
                and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select CASE WHEN ptt.produkfk = 28079 and apd.objectkelasfk = 1 THEN 39
                WHEN ptt.produkfk = 28080 and apd.objectkelasfk = 1 THEN 40
                WHEN ptt.produkfk in (4040479,4040483,4040470) and apd.objectkelasfk = 2 THEN 37
                WHEN ptt.produkfk = 4040473 and apd.objectkelasfk = 2 THEN 38
                WHEN ptt.produkfk = 4040472 and apd.objectkelasfk = 3 THEN 36
                WHEN ptt.produkfk in (4040469,4040478,4040482) and apd.objectkelasfk = 3 THEN 35
                WHEN ptt.produkfk in (4040468,4040477,4040481) and apd.objectkelasfk in (4,5,8) THEN 33
                WHEN ptt.produkfk = 4040471 and apd.objectkelasfk in (4,5,8) THEN 34
                WHEN ptt.produkfk in (4040467,4040476,4040480) and apd.objectkelasfk = 7 THEN 31
                WHEN ptt.produkfk = 4040471 and apd.objectkelasfk = 7 THEN 32
                WHEN ptt.produkfk in (4040474,4040475) THEN 41
                WHEN ptt.produkfk in (4040411,4041749,4041750,4041751,4041752) THEN 42 END AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN pelayananpasientidakterklaim_t as ptt on ptt.pelayananpasien = pp.norec
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pd.nostruklastfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = ptt.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and ru.objectdepartemenfk in (16) and ru.id not in (596)
                and ptt.produkfk in (28079,28080,4040467,4040468,4040469,4040470,
                4040471,4040472,4040473,4040474,4040475,4040411,4040479,4040483,
                4041749,4041750,4041751,4041752,4040476,4040480,4040477,4040481,
                4040478,4040482)
                and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select CASE WHEN pp.produkfk = 28079 and apd.objectkelasfk = 1 THEN 30
                WHEN pp.produkfk = 28080 and apd.objectkelasfk = 1 THEN 30
                WHEN pp.produkfk = 4040470 and apd.objectkelasfk = 2 THEN 29
                WHEN pp.produkfk = 4040473 and apd.objectkelasfk = 2 THEN 29
                WHEN pp.produkfk = 4040472 and apd.objectkelasfk = 3 THEN 28
                WHEN pp.produkfk = 4040469 and apd.objectkelasfk = 3 THEN 28
                WHEN pp.produkfk = 4040468 and apd.objectkelasfk = 7 THEN 26
                WHEN pp.produkfk = 4040471 and apd.objectkelasfk = 7 THEN 26
                WHEN pp.produkfk = 4040467 and apd.objectkelasfk = 8 THEN 27
                WHEN pp.produkfk = 4040471 and apd.objectkelasfk = 8 THEN 27 END AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and ru.objectdepartemenfk in (24)
                and pp.produkfk in (28079,28080,4040467,4040468,4040469,4040470,4040471,4040472,4040473)
                and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select CASE WHEN pp.produkfk = 28079 and apd.objectkelasfk = 1 THEN 30
                WHEN pp.produkfk = 28080 and apd.objectkelasfk = 1 THEN 30
                WHEN pp.produkfk = 4040470 and apd.objectkelasfk = 2 THEN 29
                WHEN pp.produkfk = 4040473 and apd.objectkelasfk = 2 THEN 29
                WHEN pp.produkfk = 4040472 and apd.objectkelasfk = 3 THEN 28
                WHEN pp.produkfk = 4040469 and apd.objectkelasfk = 3 THEN 28
                WHEN pp.produkfk = 4040468 and apd.objectkelasfk = 7 THEN 26
                WHEN pp.produkfk = 4040471 and apd.objectkelasfk = 7 THEN 26
                WHEN pp.produkfk = 4040467 and apd.objectkelasfk = 8 THEN 27
                WHEN pp.produkfk = 4040471 and apd.objectkelasfk = 8 THEN 27 END AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                 from pelayananpasien_t as pp
                INNER JOIN pelayananpasientidakterklaim_t as ptt on ptt.pelayananpasien = pp.norec
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pd.nostruklastfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = ptt.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and ru.objectdepartemenfk in (16) and ru.id not in (596)
                and ptt.produkfk in (28079,28080,4040467,4040468,4040469,4040470,4040471,4040472,4040473)
                and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 44 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                -- and pp.produkfk not in (28079,28080,4040467,4040468,4040469,4040470,4040471,4040472,4040473,4040474,4040475,4040411,4041749,4041750,4041751,4041752,4040398,4040397)
                and ru.id = 596 and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 44 AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk not in (4040398,4040397,4040400,4040401,4040402,4040403,4040399)
                and ru.id in (564) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 45 AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in (4040550,4040551,4040552)
                and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 46 AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                -- and pp.produkfk not in (4040398,4040397,4040400,4040401,4040402,4040403)
                and pp.produkfk not in (4040398,4040399)
                and ru.id in (565,573) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 47 AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk not in (4040398,4040397,4040400,4040401,4040402,4040403,27682,27683)
                and ru.id in (577,580) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                SELECT CASE WHEN ru.id = 568 THEN 52 WHEN ru.id = 575 THEN 48
                WHEN ru.id = 576 THEN 49 WHEN ru.id = 571 THEN 50
                WHEN ru.id=572 THEN 51 WHEN ru.id=535 THEN 76 WHEN ru.id=332 THEN 75 END AS id,
                ((pp.hargasatuan-(CASE WHEN pp.hargadiscount IS NULL THEN 0 ELSE pp.hargadiscount END))*pp.jumlah)+ CASE WHEN pp.jasa is null then 0 else pp.jasa end as total
                FROM pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                --AND pp.produkfk not in (4040398,4040398,4040397,4040400,4040401,4040402,4040403,27682,27683)
                AND pp.produkfk not in (4040398,4040397,4040400,4040401,4040402,4040403,27682,27683)
                AND ru.id in (568,575,576,571,535,332)
                AND pp.strukresepfk IS NULL
                
                UNION ALL
                
                select CASE WHEN ru.objectdepartemenfk in (16,24) THEN 54
                WHEN ru.objectdepartemenfk not in (16,24) THEN 53 END AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN strukresep_t as sr on sr.norec = pp.strukresepfk
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                
                UNION ALL
                
                select CASE WHEN ru.id in (116,125) THEN 54 ELSE 53 END AS id,CASE WHEN sbm.totaldibayar IS NULL THEN 0 ELSE sbm.totaldibayar END AS total
                from strukpelayanan_t as sp
                INNER JOIN ruangan_m as ru on ru.id = sp.objectruanganfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk = sp.norec
                WHERE SUBSTRING(sp.nostruk, 1, 2) = 'OB' AND sp.keteranganlainnya = 'Penjualan Obat Bebas'
                AND sbm.tglsbm BETWEEN '$tglAwal' and '$tglAkhir'
                AND sp.nosbmlastfk IS NOT NULL
                
                UNION ALL
                
                select 55 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8) and produkfk in (4041191,4041190) and pp.strukresepfk IS NULL
                
                UNION ALL

                select 55 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN pelayananpasientidakterklaim_t as ptt on ptt.pelayananpasien = pp.norec
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pd.nostruklastfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = ptt.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'                
                and ptt.produkfk in (4041191,4041190) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select CASE WHEN ru.objectdepartemenfk in (16) THEN 57 ELSE 56 END AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and jp.id in(329,330) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 58 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in(4041219,4041220,4041221,4041222) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 59 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8) and ru.objectdepartemenfk not in (24)  and ru.id not in (596)
                and pp.produkfk in(4041106,4041107,4041108,4041109,4041110,4041111,4041112) and pp.strukresepfk IS NULL
                
                UNION ALL

                select 59 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN pelayananpasientidakterklaim_t as ptt on ptt.pelayananpasien = pp.norec
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pd.nostruklastfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = ptt.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and ru.objectdepartemenfk not in (24) and ru.id not in (596)
                and ptt.produkfk in (4041106,4041107,4041108,4041109,4041110,4041111,4041112) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 60 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in(4041193,4041194,4041195) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 61 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in(4041197,4041198,4041199) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 62 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in(4041201,4041202,4041203) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 63 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in(4041196,4041200,4041204) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 69 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in(4041209) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 69 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in(4041209) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 70 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in(4041236) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 71 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in(4041213,4041214,4041215) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 72 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in(4041216,4041217,4041218) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 74 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in(4041210,4041211,4041212) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 82 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in(4041237) and pp.strukresepfk IS NULL
                
                --UNION ALL
                
                --select 77 AS id,sp.totalharusdibayar as total
                --from strukpelayanan_t as sp
                --INNER JOIN pasiendaftar_t as pd on pd.norec=sp.noregistrasifk
                --INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk = sp.norec
                --where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                --and pd.objectkelompokpasienlastfk in (2,4,10) and sp.totalharusdibayar <> 0
                
                --UNION ALL
                
                --select 78 AS id,sp.totalharusdibayar as total
                --from strukpelayanan_t as sp
                --INNER JOIN pasiendaftar_t as pd on pd.norec=sp.noregistrasifk
                --INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk = sp.norec
                --where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                --and pd.objectkelompokpasienlastfk in (8) and sp.totalharusdibayar <> 0
                
                --UNION ALL
                
                --select 79 AS id,sp.totalharusdibayar as total
                --from strukpelayanan_t as sp
                --INNER JOIN pasiendaftar_t as pd on pd.norec=sp.noregistrasifk
                --INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk = sp.norec
                --where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                --and pd.objectkelompokpasienlastfk in (9) and sp.totalharusdibayar <> 0
                
                UNION ALL
                
                select CASE WHEN sp.objectkelompoktransaksifk = 138 THEN 81
                WHEN sp.objectkelompoktransaksifk = 13 THEN 80
                WHEN sp.objectkelompoktransaksifk = 140 THEN 82
                WHEN sp.objectkelompoktransaksifk in (139,142) THEN 84
                WHEN sp.objectkelompoktransaksifk = 143 THEN 86
                WHEN sp.objectkelompoktransaksifk = 145 THEN 88
                WHEN sp.objectkelompoktransaksifk = 146 THEN 89
                WHEN sp.objectkelompoktransaksifk = 147 THEN 90
                WHEN sp.objectkelompoktransaksifk in (148,149,4) THEN 92
                WHEN sp.objectkelompoktransaksifk = 6 THEN 91
                WHEN sp.objectkelompoktransaksifk = 150 THEN 85
                WHEN sp.objectkelompoktransaksifk = 147 THEN 90
                WHEN sp.objectkelompoktransaksifk = 147 THEN 90
                WHEN sp.objectkelompoktransaksifk = 9 THEN 83 END AS id,
                CASE WHEN sbm.totaldibayar IS NULL THEN 0 ELSE sbm.totaldibayar END AS total
                from strukpelayanan_t as sp
                INNER JOIN strukpelayanandetail_t as spd on spd.nostrukfk = sp.norec
                INNER JOIN produk_m as pro on pro.id = spd.objectprodukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk = sp.norec
                WHERE sp.objectkelompoktransaksifk in (138,140,139,142,143,144,145,146,147,148,149,13,6,2,9,150,4)
                AND sbm.tglsbm BETWEEN '$tglAwal' and '$tglAkhir'
                AND sp.nosbmlastfk IS NOT NULL) as x
                GROUP BY x.id) as z on z.id = pk.id
                GROUP BY pk.penerimaankasir,pk.kelompokpenerimaan,pk.kelompoklayanan,pk.layanan
                ORDER BY pk.kelompokpenerimaan"));
       return $this->respond($data);
    }

    public function getDataLaporanPendapatanRuanganNew(Request $request) {
//        $data = \DB::table('pasiendaftar_t as pd')
//            ->JOIN ('antrianpasiendiperiksa_t as apd','apd.noregistrasifk','=','pd.norec')
//            ->JOIN ('pasien_m as ps','ps.id','=','pd.nocmfk')
//            ->leftjoin ('pegawai_m as pgw','pgw.id','=','pd.objectdokterpemeriksafk')
//            ->join ('ruangan_m as rg','rg.id','=','apd.objectruanganfk')
//            ->leftJoin('kelompokpasien_m as klp','klp.id','=','pd.objectkelompokpasienlastfk')
//            ->leftJoin('pelayananpasien_t as ply', 'ply.noregistrasifk','=','apd.norec')
//            ->leftJoin('produk_m as prd','prd.id','=','ply.produkfk')
//
//            ->select('pd.norec','pd.noregistrasi','ps.namapasien','pgw.namalengkap as namadokter','pd.statuspasien','rg.namaruangan','ply.hargajual','ply.jumlah','prd.namaproduk','klp.kelompokpasien',
//                DB::raw('(ply.hargajual*ply.jumlah) as   total'))
//            ->where('pd.statusenabled', true);
//        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
//            $data = $data->where('ply.tglpelayanan', '>=', $request['tglAwal']);
//        }
//        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
//            $data = $data->where('ply.tglpelayanan', '<=', $request['tglAkhir']);
//        }
//        if (isset($request['ruanganId']) && $request['ruanganId'] != "" && $request['ruanganId'] != "undefined") {
//            $data = $data->where('rg.id', '=', $request['ruanganId']);
//        }
//        if (isset($request['dokter']) && $request['dokter'] != "" && $request['dokter'] != "undefined") {
//            $data = $data->Where('pgw.id', '=', $request['dokter'])	;
//        }
//        if (isset($request['kelompokPasien']) && $request['kelompokPasien'] != "" && $request['kelompokPasien'] != "undefined") {
//            $data = $data->Where('klp.id', '=', $request['kelompokPasien'])	;
//        }
//        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
//            $data = $data->where('rg.objectdepartemenfk', '=', $request['idDept']);
//        }
//
//        $data =  $data ->get();
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $ruanganId = '';
        $dokter = '';
        $idDept ='';
        $kelompokPasien= '';
        $tindakan= '';
        if (isset($request['ruanganId']) && $request['ruanganId'] != "" && $request['ruanganId'] != "undefined") {
            $ruanganId = ' and ru.id='.$request['ruanganId'];
        }
        if (isset($request['dokter']) && $request['dokter'] != "" && $request['dokter'] != "undefined") {
            $dokter = '  and pg.id='. $request['dokter']	;
        }
        if (isset($request['kelompokPasien']) && $request['kelompokPasien'] != "" && $request['kelompokPasien'] != "undefined") {
            $kelompokPasien = ' and kps.id='. $request['kelompokPasien'];
        }
        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
            $idDept =' and ru.objectdepartemenfk='.$request['idDept'];
        }
        if (isset($request['idProduk']) && $request['idProduk'] != "" && $request['idProduk'] != "undefined") {
            $tindakan =' and prd.id='.$request['idProduk'];
        }
        $data = DB::select(DB::raw("
            SELEC
                pd.noregistrasi,pd.tglregistrasi,	pp.tglpelayanan,	ru.namaruangan,	ru2.namaruangan AS namaruanganasal, jk.jeniskelamin, dpm.namadepartemen,	kps.kelompokpasien,	rek.namarekanan,	
                prd.namaproduk,pg.namalengkap,		ps.nocm,ps.namapasien, 
                (((	CASE WHEN pp.hargajual IS NULL THEN	0	ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                0 ELSE pp.hargadiscount	END) ) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE pp.jasa	END	) AS harga,
                 pp.jumlah,		
               (((	CASE WHEN pp.hargajual IS NULL THEN	0 ELSE pp.hargajual END - CASE WHEN pp.hargadiscount IS NULL THEN
                0 ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) AS total
                    FROM
                        pelayananpasien_t AS pp
                    JOIN antrianpasiendiperiksa_t AS apd ON apd.norec = pp.noregistrasifk
                    JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk
                    JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                    JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                    LEFT JOIN ruangan_m AS ru2 ON ru2.id = pd.objectruanganlastfk
                    LEFT JOIN jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk
                    JOIN produk_m AS prd ON prd.id = pp.produkfk
                    LEFT JOIN kelompokpasien_m AS kps ON kps.id = pd.objectkelompokpasienlastfk
                    LEFT JOIN departemen_m AS dpm ON dpm.id = ru.objectdepartemenfk
                    LEFT JOIN pegawai_m AS pg ON pg.id = pd.objectpegawaifk
                    LEFT JOIN rekanan_m AS rek ON rek.id = pd.objectrekananfk
                    WHERE
                        pp.tglpelayanan BETWEEN '$tglAwal' 	AND '$tglAkhir'	AND pp.aturanpakai IS NULL	
                    AND pd.statusenabled = 1
                    $ruanganId 
                    $dokter
                    $idDept 
                    $kelompokPasien
                    $tindakan
                
                UNION ALL
            
                  SELECT   '-'  as noregistrasi,  sp.tglstruk as tglregistrasi, sp.tglstruk as tglpelayanan,
                    ru.namaruangan,	ru2.namaruangan AS namaruanganasal, jk.jeniskelamin, dp.namadepartemen,	'Umum/Pribadi' AS kelompokpasien, rek.namarekanan, prd.namaproduk,pg.namalengkap,
                    '-' AS nocm,  
                    UPPER(sp.namapasien_klien) AS namapasien,
                    (spd.hargasatuan - CASE	WHEN spd.hargadiscount IS NULL THEN	0 ELSE spd.hargadiscount
                    END	) + CASE WHEN spd.hargatambahan IS NULL THEN	0 ELSE spd.hargatambahan END AS harga,
                    spd.qtyproduk as jumlah, spd.qtyproduk * (spd.hargasatuan - CASE WHEN spd.hargadiscount IS NULL THEN 0	ELSE spd.hargadiscount
                    END	) + CASE WHEN spd.hargatambahan IS NULL THEN 0 ELSE spd.hargatambahan END AS total
                    FROM
                        strukpelayanan_t AS sp
                    JOIN strukpelayanandetail_t AS spd ON spd.nostrukfk = sp.norec
                    LEFT JOIN ruangan_m AS ru ON ru.id = sp.objectruanganfk
                    JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = sp.noregistrasifk 
                    JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk
                    LEFT JOIN ruangan_m AS ru2 ON ru2.id = pd.objectruanganlastfk
                    JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                    LEFT JOIN jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk
                    LEFT JOIN departemen_m AS dp ON dp.id = ru.objectdepartemenfk
                    LEFT JOIN pegawai_m AS pg ON pg.id = sp.objectpegawaipenerimafk
                    JOIN produk_m AS prd ON prd.id = spd.objectprodukfk
                    LEFT JOIN rekanan_m AS rek ON rek.id = pd.objectrekananfk
                    WHERE
                        sp.tglstruk BETWEEN '$tglAwal' 	AND '$tglAkhir'	
                            AND sp.nostruk_intern='-' AND substring(sp.nostruk,1,2)='OB'  
                    AND sp.statusenabled <> 0
                     $ruanganId 
                    $dokter
                    $idDept 
                    $tindakan
                       UNION ALL
              SELECT   '-'  as noregistrasi,  sp.tglstruk as tglregistrasi, sp.tglstruk as tglpelayanan,
                    ru.namaruangan,	ru2.namaruangan AS namaruanganasal, jk.jeniskelamin, dp.namadepartemen,	'Umum/Pribadi' AS kelompokpasien, rek.namarekanan, prd.namaproduk,pg.namalengkap,
                    ps.nocm,  
                   UPPER(sp.namapasien_klien) AS namapasien,
                    (spd.hargasatuan - CASE	WHEN spd.hargadiscount IS NULL THEN	0 ELSE spd.hargadiscount
                    END	) + CASE WHEN spd.hargatambahan IS NULL THEN	0 ELSE spd.hargatambahan END AS harga,
                    spd.qtyproduk as jumlah, spd.qtyproduk * (spd.hargasatuan - CASE WHEN spd.hargadiscount IS NULL THEN 0	ELSE spd.hargadiscount
                    END	) + CASE WHEN spd.hargatambahan IS NULL THEN 0 ELSE spd.hargatambahan END AS total
                    FROM
                        strukpelayanan_t AS sp
                    JOIN strukpelayanandetail_t AS spd ON spd.nostrukfk = sp.norec
                    LEFT JOIN ruangan_m AS ru ON ru.id = sp.objectruanganfk
                    JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = sp.noregistrasifk 
                    JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk
                    LEFT JOIN ruangan_m AS ru2 ON ru2.id = pd.objectruanganlastfk
                    LEFT JOIN departemen_m AS dp ON dp.id = ru.objectdepartemenfk
                    LEFT JOIN pegawai_m AS pg ON pg.id = sp.objectpegawaipenerimafk
                    LEFT JOIN pasien_m as ps on ps.nocm=sp.nostruk_intern 
                    LEFT JOIN jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk 
                    JOIN produk_m AS prd ON prd.id = spd.objectprodukfk
                    LEFT JOIN rekanan_m AS rek ON rek.id = pd.objectrekananfk
                    WHERE
                        sp.tglstruk BETWEEN '$tglAwal' 	AND '$tglAkhir'	
                     AND sp.nostruk_intern not in ('-') AND substring(sp.nostruk,1,2)= 'OB'  
                    AND sp.statusenabled <> 0
                     $ruanganId 
                    $dokter
                    $idDept 
                    $tindakan
                    
                    UNION ALL
                            
                SELECT
                    pd.noregistrasi,pd.tglregistrasi,	pp.tglpelayanan,	ru.namaruangan,	ru2.namaruangan AS namaruanganasal, jk.jeniskelamin, dpm.namadepartemen,	kps.kelompokpasien, rek.namarekanan,
                    prd.namaproduk,	pg.namalengkap,ps.nocm,ps.namapasien,
                    (((	CASE WHEN pp.hargajual IS NULL THEN	0	ELSE pp.hargajual	END - CASE WHEN pp.hargadiscount IS NULL THEN
                      0	ELSE pp.hargadiscount	END) ) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) AS harga,
                     pp.jumlah,		
                    (((	CASE WHEN pp.hargajual IS NULL THEN	0	ELSE pp.hargajual		END - CASE WHEN pp.hargadiscount IS NULL THEN
                     0	ELSE pp.hargadiscount	END) * pp.jumlah) + CASE WHEN pp.jasa IS NULL THEN	0 ELSE	pp.jasa	END	) AS total
                    FROM
                        pelayananpasien_t AS pp
                    join strukresep_t AS sr ON sr.norec= pp.strukresepfk
                    JOIN antrianpasiendiperiksa_t AS apd ON apd.norec = pp.noregistrasifk
                    JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk
                     JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                    JOIN ruangan_m AS ru ON ru.id = sr.ruanganfk
                    LEFT JOIN ruangan_m AS ru2 ON ru2.id = pd.objectruanganlastfk
                    LEFT JOIN jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk
                    JOIN produk_m AS prd ON prd.id = pp.produkfk
                    
                    LEFT JOIN kelompokpasien_m AS kps ON kps.id = pd.objectkelompokpasienlastfk
                    LEFT JOIN departemen_m AS dpm ON dpm.id = ru.objectdepartemenfk
                    LEFT JOIN pegawai_m AS pg ON pg.id = sr.penulisresepfk
                    LEFT JOIN rekanan_m AS rek ON rek.id = pd.objectrekananfk
                    WHERE
                        pp.tglpelayanan BETWEEN '$tglAwal' 	AND '$tglAkhir'		AND pp.aturanpakai IS not NULL	
                    AND pd.statusenabled = 1
                    $ruanganId 
                    $dokter
                    $idDept 
                    $kelompokPasien
                    $tindakan
            
           "));

        $result = array(
            'data'=> $data,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }

    public function getDataLaporanOPDAdministrasi(Request $request){
        //todo : laporan penerimaan
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $data = \DB::select(DB::raw("SELECT x.grup,SUM(x.total) AS total,x.namadepartemen,'-' as sisa
                FROM (
                SELECT '1.02.1.02.07.00.00.4.1.4.16.01.01. : A. Pendapatan Pelayanan Kesehatan' as grup,                       
                         ((pp.hargasatuan-(CASE WHEN pp.hargadiscount IS NULL THEN  0 
                     ELSE pp.hargadiscount END))*pp.jumlah)+CASE WHEN pp.jasa is null then 0 else pp.jasa end as total,
                         dept.namadepartemen
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN produk_m as pro on pro.id = pp.produkfk 
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN departemen_m as dept on dept.id = ru.objectdepartemenfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec 
                where pp.tglpelayanan between '$tglAwal' and '$tglAkhir' and pro.id in (4040398,4040399,4040406)
                            AND pd.objectkelompokpasienlastfk NOT IN (2,10,8,4)
                
                UNION ALL
                
                SELECT '1.02.1.02.07.00.00.4.1.4.16.01.01. : A. Pendapatan Pelayanan Kesehatan' as grup,                       
                         ((pp.hargasatuan-(CASE WHEN pp.hargadiscount IS NULL THEN  0 
                     ELSE pp.hargadiscount END))*pp.jumlah)+CASE WHEN pp.jasa is null then 0 else pp.jasa end as total,
                         'BPJS Kesehatan' as namadepartemen
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN produk_m as pro on pro.id = pp.produkfk 
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec 
                where pp.tglpelayanan between '$tglAwal' and '$tglAkhir' and pro.id in (4040398,4040399,4040406)
                            AND pd.objectkelompokpasienlastfk IN (2,10,4)
                
                UNION ALL
                
                SELECT '1.02.1.02.07.00.00.4.1.4.16.01.01. : A. Pendapatan Pelayanan Kesehatan' as grup,                       
                         ((pp.hargasatuan-(CASE WHEN pp.hargadiscount IS NULL THEN  0 
                     ELSE pp.hargadiscount END))*pp.jumlah)+CASE WHEN pp.jasa is null then 0 else pp.jasa end as total,
                         'Jamkesda' as namadepartemen
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN produk_m as pro on pro.id = pp.produkfk 
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec 
                where pp.tglpelayanan between '$tglAwal' and '$tglAkhir' and pro.id in (4040398,4040399,4040406)
                            AND pd.objectkelompokpasienlastfk IN (8)
                
                UNION ALL
                
                SELECT '1.02.1.02.07.00.00.4.1.4.16.01.02. : B. Pendapatan Pendidikan dan Pelatihan' as grup,                       
                         ((spd.hargasatuan-(CASE WHEN spd.hargadiscount IS NULL THEN  0 
                                ELSE spd.hargadiscount END))*spd.qtyproduk)+CASE WHEN spd.hargatambahan is null then 0 else spd.hargatambahan end as total,
                         'DIKLAT' as namadepartemen
                from strukpelayanan_t AS sp
                INNER JOIN strukpelayanandetail_t AS spd ON spd.nostrukfk = sp.norec
                INNER JOIN produk_m as pro on pro.id = spd.objectprodukfk 
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec 
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                            and pro.id in ('4041226','4041227','4041228','4041229','4041230','4041231','4041232','4041233','4041234','4041235','4041246','4041247','4041248','4041249','4041250','4041251','4041252','4041253',
                                           '4041254','4041255','4041256','4041257','4041258','4041259','4041260','4041261','4041262','4041263','4041264','4041265','4041266','4041267','4041268','4041269','4041270','4041271',
                                           '4041272','4041273','4041274','4041275','4041276','4041277','4041278','4041279','4041280','4041281','4041282','4041283','4041284','4041285')
                
                UNION ALL
                
                SELECT '1.02.1.02.07.00.00.4.1.4.16.01.02. : B. Pendapatan Pendidikan dan Pelatihan' as grup,                       
                         ((spd.hargasatuan-(CASE WHEN spd.hargadiscount IS NULL THEN  0 
                                ELSE spd.hargadiscount END))*spd.qtyproduk)+CASE WHEN spd.hargatambahan is null then 0 else spd.hargatambahan end as total,
                         'Jasa Ketatausahaan' as namadepartemen
                from strukpelayanan_t AS sp
                INNER JOIN strukpelayanandetail_t AS spd ON spd.nostrukfk = sp.norec
                INNER JOIN produk_m as pro on pro.id = spd.objectprodukfk 
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec 
                where sp.tglstruk between '2019-12-01 00:00' and '2019-12-10 23:59'
                            and pro.id in ('4041236','4041237','4041238','4041239','4041240',
                                           '4041241','4041242','4041243','4041244','4041245')
                
                UNION ALL
                
                SELECT '1.02.1.02.07.00.00.4.1.4.16.01.03. : C. Pendapatan Lain-lain' as grup,                       
                         ((spd.hargasatuan-(CASE WHEN spd.hargadiscount IS NULL THEN  0 
                                ELSE spd.hargadiscount END))*spd.qtyproduk)+CASE WHEN spd.hargatambahan is null then 0 else spd.hargatambahan end as total,
                         'Sewa Ambulance' as namadepartemen
                from strukpelayanan_t AS sp
                INNER JOIN strukpelayanandetail_t AS spd ON spd.nostrukfk = sp.norec
                INNER JOIN produk_m as pro on pro.id = spd.objectprodukfk 
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec 
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                            and pro.id in (4041286,4041287,4041288,4041289,4041290,4041291,4041292,4041293,4041294)
                
                UNION ALL
                
                
                SELECT '1.02.1.02.07.00.00.4.1.4.16.01.03. : C. Pendapatan Lain-lain' as grup,                       
                         ((spd.hargasatuan-(CASE WHEN spd.hargadiscount IS NULL THEN  0 
                                ELSE spd.hargadiscount END))*spd.qtyproduk)+CASE WHEN spd.hargatambahan is null then 0 else spd.hargatambahan end as total,
                         'Sewa Kendaraan' as namadepartemen
                from strukpelayanan_t AS sp
                INNER JOIN strukpelayanandetail_t AS spd ON spd.nostrukfk = sp.norec
                INNER JOIN produk_m as pro on pro.id = spd.objectprodukfk 
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec 
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                            and pro.id in (4041295)	
                
                ) as x
                GROUP BY x.grup,x.namadepartemen"));

        return $this->respond($data);
    }

    public function getDataLaporanPerRekening(Request $request){
        //todo : laporan penerimaan
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $data = \DB::select(DB::raw("SELECT x.grup,SUM(x.total) AS total,x.namadepartemen,'-' as sisa
                FROM (
                SELECT '1.02.1.02.07.00.00.4.1.4.16.01.01. : A. Pendapatan Pelayanan Kesehatan' as grup,
                         ((pp.hargasatuan-(CASE WHEN pp.hargadiscount IS NULL THEN  0 
                     ELSE pp.hargadiscount END))*pp.jumlah)+CASE WHEN pp.jasa is null then 0 else pp.jasa end as total,
                         dept.namadepartemen
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN produk_m as pro on pro.id = pp.produkfk 
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN departemen_m as dept on dept.id = ru.objectdepartemenfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec 
                where pp.tglpelayanan between '$tglAwal' and '$tglAkhir'
                      AND pd.objectkelompokpasienlastfk NOT IN (2,10,8,4)
                
                UNION ALL
                
                SELECT '1.02.1.02.07.00.00.4.1.4.16.01.01. : A. Pendapatan Pelayanan Kesehatan' as grup,
                         ((pp.hargasatuan-(CASE WHEN pp.hargadiscount IS NULL THEN  0 
                     ELSE pp.hargadiscount END))*pp.jumlah)+CASE WHEN pp.jasa is null then 0 else pp.jasa end as total,
                         'BPJS Kesehatan' as namadepartemen
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN produk_m as pro on pro.id = pp.produkfk 
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec 
                where pp.tglpelayanan between '$tglAwal' and '$tglAkhir'
                      AND pd.objectkelompokpasienlastfk IN (2,10,4)
                
                UNION ALL
                
                SELECT '1.02.1.02.07.00.00.4.1.4.16.01.01. : A. Pendapatan Pelayanan Kesehatan' as grup,
                         ((pp.hargasatuan-(CASE WHEN pp.hargadiscount IS NULL THEN  0 
                     ELSE pp.hargadiscount END))*pp.jumlah)+CASE WHEN pp.jasa is null then 0 else pp.jasa end as total,
                         'Jamkesda' as namadepartemen
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN produk_m as pro on pro.id = pp.produkfk 
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec 
                where pp.tglpelayanan between '$tglAwal' and '$tglAkhir'
                      AND pd.objectkelompokpasienlastfk IN (8)
                
                UNION ALL
                
                SELECT '1.02.1.02.07.00.00.4.1.4.16.01.02. : B. Pendapatan Pendidikan dan Pelatihan' as grup,                       
                         ((spd.hargasatuan-(CASE WHEN spd.hargadiscount IS NULL THEN  0 
                                ELSE spd.hargadiscount END))*spd.qtyproduk)+CASE WHEN spd.hargatambahan is null then 0 else spd.hargatambahan end as total,
                         'DIKLAT' as namadepartemen
                from strukpelayanan_t AS sp
                INNER JOIN strukpelayanandetail_t AS spd ON spd.nostrukfk = sp.norec
                INNER JOIN produk_m as pro on pro.id = spd.objectprodukfk 
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec 
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                            and pro.id in ('4041226','4041227','4041228','4041229','4041230','4041231','4041232','4041233','4041234','4041235','4041246','4041247','4041248','4041249','4041250','4041251','4041252','4041253',
                                           '4041254','4041255','4041256','4041257','4041258','4041259','4041260','4041261','4041262','4041263','4041264','4041265','4041266','4041267','4041268','4041269','4041270','4041271',
                                           '4041272','4041273','4041274','4041275','4041276','4041277','4041278','4041279','4041280','4041281','4041282','4041283','4041284','4041285')
                
                UNION ALL
                
                SELECT '1.02.1.02.07.00.00.4.1.4.16.01.02. : B. Pendapatan Pendidikan dan Pelatihan' as grup,
                         ((spd.hargasatuan-(CASE WHEN spd.hargadiscount IS NULL THEN  0 
                                ELSE spd.hargadiscount END))*spd.qtyproduk)+CASE WHEN spd.hargatambahan is null then 0 else spd.hargatambahan end as total,
                         'Jasa Ketatausahaan' as namadepartemen
                from strukpelayanan_t AS sp
                INNER JOIN strukpelayanandetail_t AS spd ON spd.nostrukfk = sp.norec
                INNER JOIN produk_m as pro on pro.id = spd.objectprodukfk 
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec 
                where sp.tglstruk between '2019-12-01 00:00' and '2019-12-10 23:59'
                            and pro.id in ('4041236','4041237','4041238','4041239','4041240',
                                           '4041241','4041242','4041243','4041244','4041245')
                
                UNION ALL
                
                SELECT '1.02.1.02.07.00.00.4.1.4.16.01.03. : C. Pendapatan Lain-lain' as grup,                      
                         ((spd.hargasatuan-(CASE WHEN spd.hargadiscount IS NULL THEN  0 
                                ELSE spd.hargadiscount END))*spd.qtyproduk)+CASE WHEN spd.hargatambahan is null then 0 else spd.hargatambahan end as total,
                         'Sewa Ambulance' as namadepartemen
                from strukpelayanan_t AS sp
                INNER JOIN strukpelayanandetail_t AS spd ON spd.nostrukfk = sp.norec
                INNER JOIN produk_m as pro on pro.id = spd.objectprodukfk 
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec 
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                            and pro.id in (4041286,4041287,4041288,4041289,4041290,4041291,4041292,4041293,4041294)
                
                UNION ALL
                
                
                SELECT '1.02.1.02.07.00.00.4.1.4.16.01.03. : C. Pendapatan Lain-lain' as grup,                        
                         ((spd.hargasatuan-(CASE WHEN spd.hargadiscount IS NULL THEN  0 
                                ELSE spd.hargadiscount END))*spd.qtyproduk)+CASE WHEN spd.hargatambahan is null then 0 else spd.hargatambahan end as total,
                         'Sewa Kendaraan' as namadepartemen
                from strukpelayanan_t AS sp
                INNER JOIN strukpelayanandetail_t AS spd ON spd.nostrukfk = sp.norec
                INNER JOIN produk_m as pro on pro.id = spd.objectprodukfk 
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec 
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                            and pro.id in (4041295)	
                
                ) as x
                GROUP BY x.grup,x.namadepartemen"));

        return $this->respond($data);
    }

    public function getDataLaporanOPDFungsional(Request $request){
        //todo : laporan penerimaan
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
//        $data = \DB::select(DB::raw("SELECT x.grup,SUM(x.total) AS total,x.namadepartemen,'-' as sisa, x.anggaran
//                FROM (
//                SELECT '1.02.1.02.07.00.00.4.1.4.16.01.01. : A. Pendapatan Pelayanan Kesehatan' as grup,
//                         ((pp.hargasatuan-(CASE WHEN pp.hargadiscount IS NULL THEN  0
//                     ELSE pp.hargadiscount END))*pp.jumlah)+CASE WHEN pp.jasa is null then 0 else pp.jasa end as total,
//                         dept.namadepartemen, ta.anggaran
//                from pelayananpasien_t as pp
//                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
//                INNER JOIN produk_m as pro on pro.id = pp.produkfk
//                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
//                INNER JOIN departemen_m as dept on dept.id = ru.objectdepartemenfk
//                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
//                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
//                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
//                LEFT JOIN targetanggaran_t as ta on ta.namadepartemen = dept.namadepartemen
//                where pp.tglpelayanan between '$tglAwal' and '$tglAkhir' and pro.id NOT IN (4040398,4040399,4040406)
//                            AND pd.objectkelompokpasienlastfk NOT IN (2,10,8,4)
//
//                UNION ALL
//
//                SELECT '1.02.1.02.07.00.00.4.1.4.16.01.01. : A. Pendapatan Pelayanan Kesehatan' as grup,
//                         ((pp.hargasatuan-(CASE WHEN pp.hargadiscount IS NULL THEN  0
//                     ELSE pp.hargadiscount END))*pp.jumlah)+CASE WHEN pp.jasa is null then 0 else pp.jasa end as total,
//                         'BPJS Kesehatan' as namadepartemen, ta.anggaran
//                from pelayananpasien_t as pp
//                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
//                INNER JOIN produk_m as pro on pro.id = pp.produkfk
//                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
//                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
//                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
//                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
//                LEFT JOIN targetanggaran_t as ta on ta.namadepartemen = 'BPJS Kesehatan'
//                where pp.tglpelayanan between '$tglAwal' and '$tglAkhir' and pro.id NOT IN (4040398,4040399,4040406)
//                            AND pd.objectkelompokpasienlastfk IN (2,10,4)
//
//                UNION ALL
//
//                SELECT '1.02.1.02.07.00.00.4.1.4.16.01.01. : A. Pendapatan Pelayanan Kesehatan' as grup,
//                         ((pp.hargasatuan-(CASE WHEN pp.hargadiscount IS NULL THEN  0
//                     ELSE pp.hargadiscount END))*pp.jumlah)+CASE WHEN pp.jasa is null then 0 else pp.jasa end as total,
//                         'Jamkesda' as namadepartemen, ta.anggaran
//                from pelayananpasien_t as pp
//                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
//                INNER JOIN produk_m as pro on pro.id = pp.produkfk
//                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
//                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
//                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
//                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
//                LEFT JOIN targetanggaran_t as ta on ta.namadepartemen = 'Jamkesda'
//                where pp.tglpelayanan between '$tglAwal' and '$tglAkhir' and pro.id NOT IN (4040398,4040399,4040406)
//                            AND pd.objectkelompokpasienlastfk IN (8)
//
//                UNION ALL
//
//                SELECT '1.02.1.02.07.00.00.4.1.4.16.01.02. : B. Pendapatan Pendidikan dan Pelatihan' as grup,
//                         ((spd.hargasatuan-(CASE WHEN spd.hargadiscount IS NULL THEN  0
//                                ELSE spd.hargadiscount END))*spd.qtyproduk)+CASE WHEN spd.hargatambahan is null then 0 else spd.hargatambahan end as total,
//                         'DIKLAT' as namadepartemen, ta.anggaran
//                from strukpelayanan_t AS sp
//                INNER JOIN strukpelayanandetail_t AS spd ON spd.nostrukfk = sp.norec
//                INNER JOIN produk_m as pro on pro.id = spd.objectprodukfk
//                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
//                LEFT JOIN targetanggaran_t as ta on ta.namadepartemen = 'DIKLAT'
//                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
//                            and pro.id in ('4041226','4041227','4041228','4041229','4041230','4041231','4041232','4041233','4041234','4041235','4041246','4041247','4041248','4041249','4041250','4041251','4041252','4041253',
//                                           '4041254','4041255','4041256','4041257','4041258','4041259','4041260','4041261','4041262','4041263','4041264','4041265','4041266','4041267','4041268','4041269','4041270','4041271',
//                                           '4041272','4041273','4041274','4041275','4041276','4041277','4041278','4041279','4041280','4041281','4041282','4041283','4041284','4041285')
//
//                UNION ALL
//
//                SELECT '1.02.1.02.07.00.00.4.1.4.16.01.02. : B. Pendapatan Pendidikan dan Pelatihan' as grup,
//                         ((spd.hargasatuan-(CASE WHEN spd.hargadiscount IS NULL THEN  0
//                                ELSE spd.hargadiscount END))*spd.qtyproduk)+CASE WHEN spd.hargatambahan is null then 0 else spd.hargatambahan end as total,
//                         'Jasa Ketatausahaan' as namadepartemen, ta.anggaran
//                from strukpelayanan_t AS sp
//                INNER JOIN strukpelayanandetail_t AS spd ON spd.nostrukfk = sp.norec
//                INNER JOIN produk_m as pro on pro.id = spd.objectprodukfk
//                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
//                LEFT JOIN targetanggaran_t as ta on ta.namadepartemen = 'Jasa Ketatausahaan'
//                where sp.tglstruk between '2019-12-01 00:00' and '2019-12-10 23:59'
//                            and pro.id in ('4041236','4041237','4041238','4041239','4041240',
//                                           '4041241','4041242','4041243','4041244','4041245')
//
//                UNION ALL
//
//                SELECT '1.02.1.02.07.00.00.4.1.4.16.01.03. :  C. Pendapatan Lain-lain' as grup,
//                         ((spd.hargasatuan-(CASE WHEN spd.hargadiscount IS NULL THEN  0
//                                ELSE spd.hargadiscount END))*spd.qtyproduk)+CASE WHEN spd.hargatambahan is null then 0 else spd.hargatambahan end as total,
//                         'Sewa Ambulance' as namadepartemen, ta.anggaran
//                from strukpelayanan_t AS sp
//                INNER JOIN strukpelayanandetail_t AS spd ON spd.nostrukfk = sp.norec
//                INNER JOIN produk_m as pro on pro.id = spd.objectprodukfk
//                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
//                LEFT JOIN targetanggaran_t as ta on ta.namadepartemen = 'Sewa Ambulance'
//                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
//                            and pro.id in (4041286,4041287,4041288,4041289,4041290,4041291,4041292,4041293,4041294)
//
//                UNION ALL
//
//
//                SELECT '1.02.1.02.07.00.00.4.1.4.16.01.03. : C. Pendapatan Lain-lain' as grup,
//                         ((spd.hargasatuan-(CASE WHEN spd.hargadiscount IS NULL THEN  0
//                                ELSE spd.hargadiscount END))*spd.qtyproduk)+CASE WHEN spd.hargatambahan is null then 0 else spd.hargatambahan end as total,
//                         'Sewa Kendaraan' as namadepartemen, ta.anggaran
//                from strukpelayanan_t AS sp
//                INNER JOIN strukpelayanandetail_t AS spd ON spd.nostrukfk = sp.norec
//                INNER JOIN produk_m as pro on pro.id = spd.objectprodukfk
//                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
//                LEFT JOIN targetanggaran_t as ta on ta.namadepartemen = 'Sewa Kendaraan'
//                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
//                            and pro.id in (4041295)
//
//                ) as x
//                GROUP BY x.grup, x.namadepartemen, x.anggaran"));

        $data = \DB::select(DB::raw("select 
                CASE 
                    WHEN pk.kelompokpenerimaan = 'A. PELAYANAN KESEHATAN' THEN '1.02.1.02.07.00.00.4.1.4.16.01.01. : ' + pk.kelompokpenerimaan
                    WHEN pk.kelompokpenerimaan = 'B. PENDAPATAN PENDIDIKAN DAN PELATIHAN' THEN '1.02.1.02.07.00.00.4.1.4.16.01.02. : ' + pk.kelompokpenerimaan
                    WHEN pk.kelompokpenerimaan = 'C. PENDAPATAN LAIN-LAIN' THEN '1.02.1.02.07.00.00.4.1.4.16.01.03. : ' + pk.kelompokpenerimaan
                END AS grup,
                pk.kelompok as namadepartemen,SUM(z.total) AS total, '-' as sisa, ta.anggaran 
                from penerimaankasir_m as pk 
                LEFT JOIN targetanggaran_t as ta on ta.namadepartemen = pk.kelompok
                left JOIN (SELECT x.id,SUM(x.total) as total
                FROM(select 1 as id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                 from pelayananpasien_t as pp
                 INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                 INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                 INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                 INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                 INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                 INNER JOIN produk_m as pro on pro.id = pp.produkfk
                 INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                 INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                 where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                 and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                 and pp.produkfk in (4040398,4040406) and ru.objectdepartemenfk not in (24,16)
                 and ru.id not in (558,559,560,561,577,580)
                 and pp.strukresepfk IS NULL
                
                 UNION ALL
                
                select 2 as id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in (4040399) and ru.objectdepartemenfk not in (24,16)
                and pp.strukresepfk IS NULL
                
                UNION ALL
                -- psikiatri geriatri dan jiwa dewasa
                select 3 as id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in (4040397,4040400,4040401,4040402,4040403)
                and ru.id in (566,567) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select CASE WHEN ru.id = 558 THEN 4 WHEN ru.id = 559 THEN 6 WHEN ru.id = 560 THEN 10 WHEN ru.id = 561 THEN 8 WHEN ru.id IN (577,580) THEN 12 END as id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and jp.id in (27682) and ru.id in (558,559,560,561,577,580)
                and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select CASE WHEN ru.id = 558 THEN 5 WHEN ru.id = 559 THEN 7 WHEN ru.id = 560 THEN 11 WHEN ru.id = 561 THEN 9 WHEN ru.id IN (577,580) THEN 13 END as id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in (4040397,4040400,4040401,4040402,4040403)
                and ru.id in (558,559,560,561,577,580) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 14 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk not in (4040399,4040398,4040406)
                and ru.id in (562) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select jp.objectpenerimaankasirfk as id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and jp.id in (27681) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select CASE WHEN ru.objectdepartemenfk not in (16) THEN 16 ELSE 43 END AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in (4040563,4040564,4040567,4040568) and pp.strukresepfk IS NULL
                
                UNION ALL

                select CASE WHEN ru.objectdepartemenfk not in (16) THEN 16 ELSE 43 END AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN pelayananpasientidakterklaim_t as ptt on ptt.pelayananpasien = pp.norec
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pd.nostruklastfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = ptt.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and ptt.produkfk in (4040563,4040564,4040567,4040568) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 17 as id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in (4040413) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select jp.objectpenerimaankasirfk as id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and jp.id in (27677,27678,27679,27680) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 22 AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between  '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in (4040398,4040406) and ru.id in (569) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select  22 AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN pelayananpasientidakterklaim_t as ptt on ptt.pelayananpasien = pp.norec
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pd.nostruklastfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = ptt.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between  '$tglAwal' and '$tglAkhir'
                and ptt.produkfk in (4040398,4040406) and ru.id in (569) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 23 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between  '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in (4041110) and ru.id in (569)
                and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select  23 AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN pelayananpasientidakterklaim_t as ptt on ptt.pelayananpasien = pp.norec
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pd.nostruklastfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = ptt.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between  '$tglAwal' and '$tglAkhir'
                and ptt.produkfk in (4041110) and ru.id in (569) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 24 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between  '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in (4040405,4040404,4040400,4040402,4040407) and ru.id in (569)
                and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select  24 AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN pelayananpasientidakterklaim_t as ptt on ptt.pelayananpasien = pp.norec
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pd.nostruklastfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = ptt.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between  '$tglAwal' and '$tglAkhir'
                and ptt.produkfk in (4040405,4040404,4040400,4040402,4040407) and ru.id in (569) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 25 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between  '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in (4040399,4040411,4041749,4041750,4041751,4041752) and ru.id in (569) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select  25 AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN pelayananpasientidakterklaim_t as ptt on ptt.pelayananpasien = pp.norec
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pd.nostruklastfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = ptt.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between  '$tglAwal' and '$tglAkhir'
                and ptt.produkfk in (4040399,4040411,4041749,4041750,4041751,4041752) and ru.id in (569) and pp.strukresepfk IS NULL

                
                UNION ALL
                
                select CASE WHEN pp.produkfk = 28079 and apd.objectkelasfk = 1 THEN 39
                WHEN pp.produkfk = 28080 and apd.objectkelasfk = 1 THEN 40
                WHEN pp.produkfk in (4040479,4040483,4040470) and apd.objectkelasfk = 2 THEN 37
                WHEN pp.produkfk = 4040473 and apd.objectkelasfk = 2 THEN 38
                WHEN pp.produkfk = 4040472 and apd.objectkelasfk = 3 THEN 36
                WHEN pp.produkfk in (4040469,4040478,4040482) and apd.objectkelasfk = 3 THEN 35
                WHEN pp.produkfk in (4040468,4040477,4040481) and apd.objectkelasfk in (4,5,8) THEN 33
                WHEN pp.produkfk = 4040471 and apd.objectkelasfk in (4,5,8) THEN 34
                WHEN pp.produkfk in (4040467,4040476,4040480) and apd.objectkelasfk = 7 THEN 31
                WHEN pp.produkfk = 4040471 and apd.objectkelasfk = 7 THEN 32
                WHEN pp.produkfk in (4040474,4040475) THEN 41
                WHEN pp.produkfk in (4040411,4041749,4041750,4041751,4041752) THEN 42 END AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and ru.objectdepartemenfk in (16)
                and pp.produkfk in (28079,28080,4040467,4040468,4040469,4040470,
                4040471,4040472,4040473,4040474,4040475,4040411,4040479,4040483,
                4041749,4041750,4041751,4041752,4040476,4040480,4040477,4040481,
                4040478,4040482)  and ru.id not in (596)
                and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select CASE WHEN ptt.produkfk = 28079 and apd.objectkelasfk = 1 THEN 39
                WHEN ptt.produkfk = 28080 and apd.objectkelasfk = 1 THEN 40
                WHEN ptt.produkfk in (4040479,4040483,4040470) and apd.objectkelasfk = 2 THEN 37
                WHEN ptt.produkfk = 4040473 and apd.objectkelasfk = 2 THEN 38
                WHEN ptt.produkfk = 4040472 and apd.objectkelasfk = 3 THEN 36
                WHEN ptt.produkfk in (4040469,4040478,4040482) and apd.objectkelasfk = 3 THEN 35
                WHEN ptt.produkfk in (4040468,4040477,4040481) and apd.objectkelasfk in (4,5,8) THEN 33
                WHEN ptt.produkfk = 4040471 and apd.objectkelasfk in (4,5,8) THEN 34
                WHEN ptt.produkfk in (4040467,4040476,4040480) and apd.objectkelasfk = 7 THEN 31
                WHEN ptt.produkfk = 4040471 and apd.objectkelasfk = 7 THEN 32
                WHEN ptt.produkfk in (4040474,4040475) THEN 41
                WHEN ptt.produkfk in (4040411,4041749,4041750,4041751,4041752) THEN 42 END AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN pelayananpasientidakterklaim_t as ptt on ptt.pelayananpasien = pp.norec
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pd.nostruklastfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = ptt.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and ru.objectdepartemenfk in (16) and ru.id not in (596)
                and ptt.produkfk in (28079,28080,4040467,4040468,4040469,4040470,
                4040471,4040472,4040473,4040474,4040475,4040411,4040479,4040483,
                4041749,4041750,4041751,4041752,4040476,4040480,4040477,4040481,
                4040478,4040482)
                and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select CASE WHEN pp.produkfk = 28079 and apd.objectkelasfk = 1 THEN 30
                WHEN pp.produkfk = 28080 and apd.objectkelasfk = 1 THEN 30
                WHEN pp.produkfk = 4040470 and apd.objectkelasfk = 2 THEN 29
                WHEN pp.produkfk = 4040473 and apd.objectkelasfk = 2 THEN 29
                WHEN pp.produkfk = 4040472 and apd.objectkelasfk = 3 THEN 28
                WHEN pp.produkfk = 4040469 and apd.objectkelasfk = 3 THEN 28
                WHEN pp.produkfk = 4040468 and apd.objectkelasfk = 7 THEN 26
                WHEN pp.produkfk = 4040471 and apd.objectkelasfk = 7 THEN 26
                WHEN pp.produkfk = 4040467 and apd.objectkelasfk = 8 THEN 27
                WHEN pp.produkfk = 4040471 and apd.objectkelasfk = 8 THEN 27 END AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and ru.objectdepartemenfk in (24)
                and pp.produkfk in (28079,28080,4040467,4040468,4040469,4040470,4040471,4040472,4040473)
                and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select CASE WHEN pp.produkfk = 28079 and apd.objectkelasfk = 1 THEN 30
                WHEN pp.produkfk = 28080 and apd.objectkelasfk = 1 THEN 30
                WHEN pp.produkfk = 4040470 and apd.objectkelasfk = 2 THEN 29
                WHEN pp.produkfk = 4040473 and apd.objectkelasfk = 2 THEN 29
                WHEN pp.produkfk = 4040472 and apd.objectkelasfk = 3 THEN 28
                WHEN pp.produkfk = 4040469 and apd.objectkelasfk = 3 THEN 28
                WHEN pp.produkfk = 4040468 and apd.objectkelasfk = 7 THEN 26
                WHEN pp.produkfk = 4040471 and apd.objectkelasfk = 7 THEN 26
                WHEN pp.produkfk = 4040467 and apd.objectkelasfk = 8 THEN 27
                WHEN pp.produkfk = 4040471 and apd.objectkelasfk = 8 THEN 27 END AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                 from pelayananpasien_t as pp
                INNER JOIN pelayananpasientidakterklaim_t as ptt on ptt.pelayananpasien = pp.norec
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pd.nostruklastfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = ptt.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and ru.objectdepartemenfk in (16) and ru.id not in (596)
                and ptt.produkfk in (28079,28080,4040467,4040468,4040469,4040470,4040471,4040472,4040473)
                and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 44 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                -- and pp.produkfk not in (28079,28080,4040467,4040468,4040469,4040470,4040471,4040472,4040473,4040474,4040475,4040411,4041749,4041750,4041751,4041752,4040398,4040397)
                and ru.id = 596 and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 44 AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk not in (4040398,4040397,4040400,4040401,4040402,4040403,4040399)
                and ru.id in (564) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 45 AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in (4040550,4040551,4040552)
                and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 46 AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                -- and pp.produkfk not in (4040398,4040397,4040400,4040401,4040402,4040403)
                and pp.produkfk not in (4040398,4040399)
                and ru.id in (565,573) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 47 AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk not in (4040398,4040397,4040400,4040401,4040402,4040403,27682,27683)
                and ru.id in (577,580) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                SELECT CASE WHEN ru.id = 568 THEN 52 WHEN ru.id = 575 THEN 48
                WHEN ru.id = 576 THEN 49 WHEN ru.id = 571 THEN 50
                WHEN ru.id=572 THEN 51 WHEN ru.id=535 THEN 76 WHEN ru.id=332 THEN 75 END AS id,
                ((pp.hargasatuan-(CASE WHEN pp.hargadiscount IS NULL THEN 0 ELSE pp.hargadiscount END))*pp.jumlah)+ CASE WHEN pp.jasa is null then 0 else pp.jasa end as total
                FROM pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                --AND pp.produkfk not in (4040398,4040398,4040397,4040400,4040401,4040402,4040403,27682,27683)
                AND pp.produkfk not in (4040398,4040397,4040400,4040401,4040402,4040403,27682,27683)
                AND ru.id in (568,575,576,571,535,332)
                AND pp.strukresepfk IS NULL
                
                UNION ALL
                
                select CASE WHEN ru.objectdepartemenfk in (16,24) THEN 54
                WHEN ru.objectdepartemenfk not in (16,24) THEN 53 END AS id,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN strukresep_t as sr on sr.norec = pp.strukresepfk
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                
                UNION ALL
                
                select CASE WHEN ru.id in (116,125) THEN 54 ELSE 53 END AS id,CASE WHEN sbm.totaldibayar IS NULL THEN 0 ELSE sbm.totaldibayar END AS total
                from strukpelayanan_t as sp
                INNER JOIN ruangan_m as ru on ru.id = sp.objectruanganfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk = sp.norec
                WHERE SUBSTRING(sp.nostruk, 1, 2) = 'OB' AND sp.keteranganlainnya = 'Penjualan Obat Bebas'
                AND sbm.tglsbm BETWEEN '$tglAwal' and '$tglAkhir'
                AND sp.nosbmlastfk IS NOT NULL
                
                UNION ALL
                
                select 55 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8) and produkfk in (4041191,4041190) and pp.strukresepfk IS NULL
                
                UNION ALL

                select 55 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN pelayananpasientidakterklaim_t as ptt on ptt.pelayananpasien = pp.norec
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pd.nostruklastfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = ptt.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'                
                and ptt.produkfk in (4041191,4041190) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select CASE WHEN ru.objectdepartemenfk in (16) THEN 57 ELSE 56 END AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and jp.id in(329,330) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 58 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in(4041219,4041220,4041221,4041222) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 59 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8) and ru.objectdepartemenfk not in (24)  and ru.id not in (596)
                and pp.produkfk in(4041106,4041107,4041108,4041109,4041110,4041111,4041112) and pp.strukresepfk IS NULL
                
                UNION ALL

                select 59 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN pelayananpasientidakterklaim_t as ptt on ptt.pelayananpasien = pp.norec
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pd.nostruklastfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = ptt.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and ru.objectdepartemenfk not in (24) and ru.id not in (596)
                and ptt.produkfk in (4041106,4041107,4041108,4041109,4041110,4041111,4041112) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 60 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in(4041193,4041194,4041195) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 61 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in(4041197,4041198,4041199) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 62 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in(4041201,4041202,4041203) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 63 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in(4041196,4041200,4041204) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 69 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in(4041209) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 69 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in(4041209) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 70 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in(4041236) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 71 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in(4041213,4041214,4041215) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 72 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in(4041216,4041217,4041218) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 74 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in(4041210,4041211,4041212) and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select 82 AS id,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN produk_m as pro on pro.id = pp.produkfk
                INNER JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10,9,8)
                and pp.produkfk in(4041237) and pp.strukresepfk IS NULL
                
                --UNION ALL
                
                --select 77 AS id,sp.totalharusdibayar as total
                --from strukpelayanan_t as sp
                --INNER JOIN pasiendaftar_t as pd on pd.norec=sp.noregistrasifk
                --INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk = sp.norec
                --where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                --and pd.objectkelompokpasienlastfk in (2,4,10) and sp.totalharusdibayar <> 0
                
                --UNION ALL
                
                --select 78 AS id,sp.totalharusdibayar as total
                --from strukpelayanan_t as sp
                --INNER JOIN pasiendaftar_t as pd on pd.norec=sp.noregistrasifk
                --INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk = sp.norec
                --where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                --and pd.objectkelompokpasienlastfk in (8) and sp.totalharusdibayar <> 0
                
                --UNION ALL
                
                --select 79 AS id,sp.totalharusdibayar as total
                --from strukpelayanan_t as sp
                --INNER JOIN pasiendaftar_t as pd on pd.norec=sp.noregistrasifk
                --INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk = sp.norec
                --where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                --and pd.objectkelompokpasienlastfk in (9) and sp.totalharusdibayar <> 0
                
                UNION ALL
                
                select CASE WHEN sp.objectkelompoktransaksifk = 138 THEN 81
                WHEN sp.objectkelompoktransaksifk = 13 THEN 80
                WHEN sp.objectkelompoktransaksifk = 140 THEN 82
                WHEN sp.objectkelompoktransaksifk in (139,142) THEN 84
                WHEN sp.objectkelompoktransaksifk = 143 THEN 86
                WHEN sp.objectkelompoktransaksifk = 145 THEN 88
                WHEN sp.objectkelompoktransaksifk = 146 THEN 89
                WHEN sp.objectkelompoktransaksifk = 147 THEN 90
                WHEN sp.objectkelompoktransaksifk in (148,149,4) THEN 92
                WHEN sp.objectkelompoktransaksifk = 6 THEN 91
                WHEN sp.objectkelompoktransaksifk = 150 THEN 85
                WHEN sp.objectkelompoktransaksifk = 147 THEN 90
                WHEN sp.objectkelompoktransaksifk = 147 THEN 90
                WHEN sp.objectkelompoktransaksifk = 9 THEN 83 END AS id,
                CASE WHEN sbm.totaldibayar IS NULL THEN 0 ELSE sbm.totaldibayar END AS total
                from strukpelayanan_t as sp
                INNER JOIN strukpelayanandetail_t as spd on spd.nostrukfk = sp.norec
                INNER JOIN produk_m as pro on pro.id = spd.objectprodukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk = sp.norec
                WHERE sp.objectkelompoktransaksifk in (138,140,139,142,143,144,145,146,147,148,149,13,6,2,9,150,4)
                AND sbm.tglsbm BETWEEN '$tglAwal' and '$tglAkhir'
                AND sp.nosbmlastfk IS NOT NULL) as x
                GROUP BY x.id) as z on z.id = pk.id
                GROUP BY pk.kelompokpenerimaan,pk.kelompok,ta.anggaran
                ORDER BY pk.kelompokpenerimaan"));

        return $this->respond($data);
    }
    public function getDataLaporanPenerimaanMingguan(Request $request){
        //todo : laporan penerimaan
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $data = \DB::select(DB::raw("
            select y.kelompokpenerimaan,y.penerimaankasir,
            sum(c1) as c1,
            sum(c2) as c2,
            sum(c3) as c3,
            sum(c4) as c4,
            sum(c5) as c5,
            sum(c6) as c6,
            sum(c7) as c7,
            sum(c8) as c8,
            sum(c9) as c9,
            sum(c10) as c10,
            sum(c11) as c11,
            sum(c12) as c12,
            sum(c13) as c13,
            sum(c14) as c14,
            sum(c15) as c15,
            sum(c16) as c16,
            sum(c17) as c17,
            sum(c18) as c18,
            sum(c19) as c19,
            sum(c20) as c20,
            sum(c21) as c21,
            sum(c22) as c22,
            sum(c23) as c23,
            sum(c24) as c24,
            sum(c25) as c25,
            sum(c26) as c26,
            sum(c27) as c27,
            sum(c28) as c28,
            sum(c29) as c29,
            sum(c30) as c30,
            sum(c31) as c31
            from
            (select ru.kelompokpenerimaan,ru.penerimaankasir,
            case when x.tgl='01' then sum(x.total) else 0 end as c1,
            case when x.tgl='02' then sum(x.total) else 0 end as c2,
            case when x.tgl='03' then sum(x.total) else 0 end as c3,
            case when x.tgl='04' then sum(x.total) else 0 end as c4,
            case when x.tgl='05' then sum(x.total) else 0 end as c5,
            case when x.tgl='06' then sum(x.total) else 0 end as c6,
            case when x.tgl='07' then sum(x.total) else 0 end as c7,
            case when x.tgl='08' then sum(x.total) else 0 end as c8,
            case when x.tgl='09' then sum(x.total) else 0 end as c9,
            case when x.tgl='10' then sum(x.total) else 0 end as c10,
            case when x.tgl='11' then sum(x.total) else 0 end as c11,
            case when x.tgl='12' then sum(x.total) else 0 end as c12,
            case when x.tgl='13' then sum(x.total) else 0 end as c13,
            case when x.tgl='14' then sum(x.total) else 0 end as c14,
            case when x.tgl='15' then sum(x.total) else 0 end as c15,
            case when x.tgl='16' then sum(x.total) else 0 end as c16,
            case when x.tgl='17' then sum(x.total) else 0 end as c17,
            case when x.tgl='18' then sum(x.total) else 0 end as c18,
            case when x.tgl='19' then sum(x.total) else 0 end as c19,
            case when x.tgl='20' then sum(x.total) else 0 end as c20,
            case when x.tgl='21' then sum(x.total) else 0 end as c21,
            case when x.tgl='22' then sum(x.total) else 0 end as c22,
            case when x.tgl='23' then sum(x.total) else 0 end as c23,
            case when x.tgl='24' then sum(x.total) else 0 end as c24,
            case when x.tgl='25' then sum(x.total) else 0 end as c25,
            case when x.tgl='26' then sum(x.total) else 0 end as c26,
            case when x.tgl='27' then sum(x.total) else 0 end as c27,
            case when x.tgl='28' then sum(x.total) else 0 end as c28,
            case when x.tgl='29' then sum(x.total) else 0 end as c29,
            case when x.tgl='30' then sum(x.total) else 0 end as c30,
            case when x.tgl='31' then sum(x.total) else 0 end as c31
                             from ruangan_m as ru 
                             left JOIN (
            
                                            select ru.id,ru.namaruangan,ru.penerimaankasir,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 
                                            else pp.hargadiscount end))*pp.jumlah)+CASE when pp.jasa is null then 0 else pp.jasa end as total,
            format(pp.tglpelayanan,'dd')as tgl
                            from pelayananpasien_t as pp
                            INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                            INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                            INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                            INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                            INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                            where pp.tglpelayanan between '$tglAwal' and '$tglAkhir' and pd.objectkelompokpasienlastfk=1
                            
                            UNION ALL
                            
                            select ru.id,ru.namaruangan,ru.penerimaankasir,((pp.hargasatuan-
                                         (case when pp.hargadiscount is null then 0 else pp.hargadiscount end))*pp.jumlah)
                                         +CASE when pp.jasa is null then 0 else pp.jasa end as total,
            format(sr.tglresep,'dd')as tgl
                            from pelayananpasien_t as pp
                            INNER JOIN strukresep_t as sr on sr.norec=pp.strukresepfk
                            INNER JOIN ruangan_m as ru on ru.id=sr.ruanganfk
                            INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                            INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                            where sr.tglresep between '$tglAwal' and '$tglAkhir'
                            
                            UNION ALL
                             
                            select 599 as id,'bpjs' as namaruangan,'20. BPJS Kesehatan' as penerimaankasir,sp.totalprekanan as total,
            format(sp.tglstruk,'dd')as tgl
                            from  strukpelayanan_t as sp 
                            INNER JOIN pasiendaftar_t as pd on pd.norec=sp.noregistrasifk
                            where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                            and sp.totalprekanan <> 0 and pd.objectkelompokpasienlastfk = 2
                            
                            UNION ALL
                            
                            select 600 as id,'Jamkesda' as namaruangan,'21. Jamkesda' as penerimaankasir,sp.totalprekanan as total,
            format(sp.tglstruk,'dd')as tgl
                            from  strukpelayanan_t as sp 
                            INNER JOIN pasiendaftar_t as pd on pd.norec=sp.noregistrasifk
                            where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                            and sp.totalprekanan <> 0
                            and pd.objectkelompokpasienlastfk=8
                            ) as x on x.id=ru.id
                            WHERE ru.ipaddress is not null and ru.kelompokpenerimaan is not null
                            GROUP BY ru.kelompokpenerimaan,ru.penerimaankasir,x.tgl
            ) as y
            group by y.kelompokpenerimaan,y.penerimaankasir
            ORDER BY y.kelompokpenerimaan,y.penerimaankasir ASC

         "));

        return $this->respond($data);
    }
    public function getDataLaporanRekapHasilRetribusiDaerah(Request $request){
        //todo : laporan penerimaan
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $data = \DB::select(DB::raw("

        select y.subheader,y.penerimaankasir,y.kelompokpenerimaan_produk,y.penerimaan_produk,y.nopenerimaan,
        case when y.tgl ='01' then SUM(y.total) else 0 end AS c1,
        case when y.tgl ='02' then SUM(y.total) else 0 end AS c2,
        case when y.tgl ='03' then SUM(y.total) else 0 end AS c3,
        case when y.tgl ='04' then SUM(y.total) else 0 end AS c4,
        case when y.tgl ='05' then SUM(y.total) else 0 end AS c5,
        case when y.tgl ='06' then SUM(y.total) else 0 end AS c6,
        case when y.tgl ='07' then SUM(y.total) else 0 end AS c7,
        case when y.tgl ='08' then SUM(y.total) else 0 end AS c8,
        case when y.tgl ='09' then SUM(y.total) else 0 end AS c9,
        case when y.tgl ='10' then SUM(y.total) else 0 end AS c10,
        case when y.tgl ='11' then SUM(y.total) else 0 end AS c11,
        case when y.tgl ='12' then SUM(y.total) else 0 end AS c12
        from
        (SELECT x.subheader,x.penerimaankasir,x.kelompokpenerimaan_produk,x.penerimaan_produk,SUM(x.total) AS total,x.nopenerimaan,x.tgl
        FROM ruangan_m AS ru 
        LEFT JOIN (
        SELECT 'a. Rekam Medik' as subheader,ru.id,'A.1. Rawat Jalan' as penerimaankasir,((pp.hargasatuan-(CASE WHEN pp.hargadiscount IS NULL THEN  0 
        ELSE pp.hargadiscount END))*pp.jumlah)+CASE WHEN pp.jasa is null then 0 else pp.jasa end as total,
        pro.penerimaankasir as penerimaan_produk,pro.kelompokpenerimaan as kelompokpenerimaan_produk,1 as nopenerimaan,
        format(pp.tglpelayanan,'MM') as tgl
        from pelayananpasien_t as pp
        INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
        INNER JOIN produk_m as pro on pro.id = pp.produkfk 
        INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
        INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
        INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
        INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec 
        where pp.tglpelayanan between '$tglAwal' and '$tglAkhir'
        and pro.id in (4040398,4040399,4040406) 
        
        UNION ALL
        
        SELECT 'b. Poli Spesialis Psikiatri' as subheader,ru.id,'A.1. Rawat Jalan' as penerimaankasir,((pp.hargasatuan-(CASE WHEN pp.hargadiscount IS NULL THEN  0 
        ELSE pp.hargadiscount END))*pp.jumlah)+CASE WHEN pp.jasa is null then 0 else pp.jasa end as total,
        pro.penerimaankasir as penerimaan_produk,pro.kelompokpenerimaan as kelompokpenerimaan_produk,1 as nopenerimaan,
        format(pp.tglpelayanan,'MM') as tgl
        from pelayananpasien_t as pp
        INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
        INNER JOIN produk_m as pro on pro.id = pp.produkfk 
        INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
        INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
        INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
        INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec 
        where pp.tglpelayanan between '$tglAwal' and '$tglAkhir'
        and pro.id in (4040404,4040405,40411416,4040400,4040407) and ru.id in (564,565,566,572,572)
        
        UNION ALL
        
        SELECT 'c. Poli Spesialis Saraf' as subheader,ru.id,'A.1. Rawat Jalan' as penerimaankasir,((pp.hargasatuan-(CASE WHEN pp.hargadiscount IS NULL THEN  0 
        ELSE pp.hargadiscount END))*pp.jumlah)+CASE WHEN pp.jasa is null then 0 else pp.jasa end as total,
        pro.penerimaankasir as penerimaan_produk,pro.kelompokpenerimaan as kelompokpenerimaan_produk,1 as nopenerimaan,
        format(pp.tglpelayanan,'MM') as tgl
        from pelayananpasien_t as pp
        INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
        INNER JOIN produk_m as pro on pro.id = pp.produkfk 
        INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
        INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
        INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
        INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec 
        where pp.tglpelayanan between '$tglAwal' and '$tglAkhir'
        and pro.id in (4040404,4040405,40411416,4040400,4040407,4040398,4040406) 
        and ru.id in (558)
        
        UNION ALL
        
        SELECT 'd. Poli Spesialis PD' as subheader,ru.id,'A.1. Rawat Jalan' as penerimaankasir,((pp.hargasatuan-(CASE WHEN pp.hargadiscount IS NULL THEN  0 
        ELSE pp.hargadiscount END))*pp.jumlah)+CASE WHEN pp.jasa is null then 0 else pp.jasa end as total,
        pro.penerimaankasir as penerimaan_produk,pro.kelompokpenerimaan as kelompokpenerimaan_produk,1 as nopenerimaan,
        format(pp.tglpelayanan,'MM') as tgl
        from pelayananpasien_t as pp
        INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
        INNER JOIN produk_m as pro on pro.id = pp.produkfk 
        INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
        INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
        INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
        INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec 
        where pp.tglpelayanan between '$tglAwal' and '$tglAkhir'
        and pro.id in (4040404,4040405,40411416,4040400,4040407,4040398,4040406) 
        and ru.id in (559)
        
        UNION ALL
        
        SELECT 'e. Poli Spesialis K&K' as subheader,ru.id,'A.1. Rawat Jalan' as penerimaankasir,((pp.hargasatuan-(CASE WHEN pp.hargadiscount IS NULL THEN  0 
        ELSE pp.hargadiscount END))*pp.jumlah)+CASE WHEN pp.jasa is null then 0 else pp.jasa end as total,
        pro.penerimaankasir as penerimaan_produk,pro.kelompokpenerimaan as kelompokpenerimaan_produk,1 as nopenerimaan,
        format(pp.tglpelayanan,'MM') as tgl
        from pelayananpasien_t as pp
        INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
        INNER JOIN produk_m as pro on pro.id = pp.produkfk 
        INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
        INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
        INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
        INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec 
        where pp.tglpelayanan between '$tglAwal' and '$tglAkhir'
        and pro.id in (4040404,4040405,40411416,4040400,4040407,4040398,4040406) 
        and ru.id in (561)
        
        UNION ALL
        
        SELECT 'f. Poli Spesialis Anak' as subheader,ru.id,'A.1. Rawat Jalan' as penerimaankasir,((pp.hargasatuan-(CASE WHEN pp.hargadiscount IS NULL THEN  0 
        ELSE pp.hargadiscount END))*pp.jumlah)+CASE WHEN pp.jasa is null then 0 else pp.jasa end as total,
        pro.penerimaankasir as penerimaan_produk,pro.kelompokpenerimaan as kelompokpenerimaan_produk,1 as nopenerimaan,
        format(pp.tglpelayanan,'MM') as tgl
        from pelayananpasien_t as pp
        INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
        INNER JOIN produk_m as pro on pro.id = pp.produkfk 
        INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
        INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
        INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
        INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec 
        where pp.tglpelayanan between '$tglAwal' and '$tglAkhir'
        and pro.id in (4040404,4040405,40411416,4040400,4040407,4040398,4040406) 
        and ru.id in (560)
        
        UNION ALL
        
        SELECT 'g. Poli Spesialis Rehab Medik' as subheader,ru.id,'A.1. Rawat Jalan' as penerimaankasir,((pp.hargasatuan-(CASE WHEN pp.hargadiscount IS NULL THEN  0 
        ELSE pp.hargadiscount END))*pp.jumlah)+CASE WHEN pp.jasa is null then 0 else pp.jasa end as total,
        pro.penerimaankasir as penerimaan_produk,pro.kelompokpenerimaan as kelompokpenerimaan_produk,1 as nopenerimaan,
        format(pp.tglpelayanan,'MM') as tgl
        from pelayananpasien_t as pp
        INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
        INNER JOIN produk_m as pro on pro.id = pp.produkfk 
        INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
        INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
        INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
        INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec 
        where pp.tglpelayanan between '$tglAwal' and '$tglAkhir'
        and pro.id in (4040404,4040405,40411416,4040400,4040407,4040398,4040406) 
        and ru.id in (570,571,572,573)
        
        UNION ALL
        
        SELECT CASE WHEN ru.id = 558 THEN 'l. TM Penyakit Saraf' 
        WHEN ru.id = 559 THEN 'm. TM Penyakit Dalam' 
        WHEN ru.id = 561 THEN 'n. TM Penyakit Kulit & Kel' 
        WHEN ru.id = 560 THEN 'o. TM Penyakit ANAK' 
        WHEN pro.id = 4040575 THEN 'i. MMPI' 
        WHEN ru.id in (565,566,570,572) THEN 'j. Psikoterapi' 
        ELSE 'k. Tindakan' END AS subheader,
        ru.id,'A.1. Rawat Jalan' as penerimaankasir,((pp.hargasatuan-(CASE WHEN pp.hargadiscount IS NULL THEN  0 
        ELSE pp.hargadiscount END))*pp.jumlah)+CASE WHEN pp.jasa is null then 0 else pp.jasa end as total,
        CASE WHEN ru.id = 558 THEN 'TM Penyakit Saraf' 
        WHEN ru.id = 559 THEN 'TM Penyakit Dalam' 
        WHEN ru.id = 561 THEN 'TM Penyakit Kulit & Kel' 
        WHEN ru.id = 560 THEN 'TM Penyakit ANAK' 
        WHEN pro.id = 4040575 THEN 'MMPI' 
        WHEN ru.id in (565,566,570,572) THEN 'Psikoterapi' 
        ELSE 'Tindakan' END AS penerimaan_produk,'A. PELAYANAN PASIEN' AS kelompokpenerimaan_produk,1 as nopenerimaan,
        format(pp.tglpelayanan,'MM') as tgl
        from pelayananpasien_t as pp
        INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
        INNER JOIN produk_m as pro on pro.id = pp.produkfk 
        INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
        INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
        INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
        INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec 
        where pp.tglpelayanan between '$tglAwal' and '$tglAkhir'		
        and pro.id not in (4040404,4040405,40411416,4040400,4040407)
        
        UNION ALL
        
        SELECT CASE WHEN pro.id in (4040398,4040399,4040406) THEN 'a. Rekam Medik IGD' 
        WHEN pro.id in (4040507,4041106,4041107,4041108,4041110,4041170,4041181,4041776) THEN 'b. Askep(Perawatan)' 
        WHEN pro.id in (4040404,4040405,40411416,4040400) THEN 'c. Pemeriksaan dr' 		 
        WHEN pro.id in (4040467,4040468,4040469,4040470,4040471,4040472,4040473) THEN 'e. AKOMODASI HCU/PICU/NICU' 		 
        ELSE 'd. Tindakan Medik IGD' END AS subheader,ru.id,'A.2. Instalasi Gawat Darurat' as penerimaankasir,
        ((pp.hargasatuan-(CASE WHEN pp.hargadiscount IS NULL THEN  0 ELSE pp.hargadiscount END))*pp.jumlah)+CASE WHEN pp.jasa is null then 0 else pp.jasa end as total,
        CASE WHEN pro.id in (4040398,4040399,4040406) THEN 'Rekam Medik IGD'
        WHEN pro.id in (4040507,4041106,4041107,4041108,4041110,4041170,4041181,4041776) THEN 'Askep(Perawatan)' 		   
        WHEN pro.id in (4040404,4040405,40411416,4040400) THEN 'Pemeriksaan dr'
        WHEN pro.id in (4040467,4040471) THEN 'VVIP'
        WHEN pro.id in (4040468) THEN 'VIP'
        WHEN pro.id in (4040469,4040472) THEN 'I'
        WHEN pro.id in (4040470,4040473) THEN 'II'
        WHEN pro.id in (28079,28080) THEN 'III'
        ELSE 'Tindakan Medik IGD' END AS penerimaan_produk,'A. PELAYANAN PASIEN' AS kelompokpenerimaan_produk,2 as nopenerimaan,
        format(pp.tglpelayanan,'MM') as tgl
        FROM pelayananpasien_t as pp
        INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
        INNER JOIN produk_m as pro on pro.id = pp.produkfk 
        INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
        INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
        INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
        INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec 
        where pp.tglpelayanan between '$tglAwal' and '$tglAkhir'		
        and ru.id = 569
        
        UNION ALL
        
        SELECT CASE WHEN apd.objectkelasfk = 7 AND pro.id = 4041109 THEN 'VVIP Biasa' 
        WHEN apd.objectkelasfk = 4 AND pro.id = 4041109 THEN 'VIP Biasa' 
        WHEN apd.objectkelasfk = 3 AND pro.id = 4041109 THEN 'Kls I Biasa' 		 
        WHEN apd.objectkelasfk = 2 AND pro.id = 4041109 THEN 'Kls II Biasa'
        WHEN apd.objectkelasfk = 1 AND pro.id = 4041109 THEN 'Kls III Biasa'
        WHEN pro.id in (4040474,4040475) THEN 'Visite Dokter'
        WHEN pro.id in (4040411,4041749,4041750,4041751,4041752) Then 'Gelang Pasien'			
        ELSE 'Psikoterapi RI' END AS subheader,
        ru.id,'A.3. Rawat Inap' as penerimaankasir,((pp.hargasatuan-(CASE WHEN pp.hargadiscount IS NULL THEN  0 
        ELSE pp.hargadiscount END))*pp.jumlah)+CASE WHEN pp.jasa is null then 0 else pp.jasa end as total,
        CASE WHEN apd.objectkelasfk = 7 AND pro.id = 4041109 THEN 'Intensif Care' 
        WHEN apd.objectkelasfk = 4 AND pro.id = 4041109 THEN 'Intensif Care' 
        WHEN apd.objectkelasfk = 3 AND pro.id = 4041109 THEN 'Intensif Care' 		 
        WHEN apd.objectkelasfk = 2 AND pro.id = 4041109 THEN 'Intensif Care'
        WHEN apd.objectkelasfk = 1 AND pro.id = 4041109 THEN 'Intensif Care'
        WHEN pro.id in (4040474,4040475) THEN 'Visite Dokter'
        WHEN pro.id in (4040411,4041749,4041750,4041751,4041752) Then 'Gelang Pasien'			
        ELSE 'Psikoterapi RI' END AS penerimaan_produk,'A. PELAYANAN PASIEN' AS kelompokpenerimaan_produk,3 as nopenerimaan,
        format(pp.tglpelayanan,'MM') as tgl
        from pelayananpasien_t as pp
        INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
        INNER JOIN produk_m as pro on pro.id = pp.produkfk 
        INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
        INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
        INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
        INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec 
        where pp.tglpelayanan between '$tglAwal' and '$tglAkhir'
        and pro.id not in (4040404,4040405,40411416,4040400,4040407)						
        and ru.objectdepartemenfk = 16                                                        
        
        UNION ALL
        
        SELECT CASE WHEN ru.id = 564 THEN 'Instalasi Napza' 
        WHEN ru.id = 567 THEN 'Instalasi Psikogeriatri' 
        WHEN ru.id = 573 THEN 'Instalasi Kes Jiwa Anak Remaja (TKA)' 
        WHEN ru.id = 577 THEN 'Instalasi Fisioterapi'
        WHEN ru.id = 575 THEN 'Instalasi Laboratorium' 
        WHEN ru.id = 576 THEN 'Instalasi Radiologi'
        WHEN ru.id = 571 THEN 'Instalasi Elektromedik' 
        WHEN ru.id = 580 THEN 'Instalasi Rehab Mental'
        WHEN ru.id = 568 THEN 'Instalasi Gigi & Mulut' 
        WHEN ru.id = 574 THEN 'Instalasi Gizi' END AS subheader,ru.id,
        CASE WHEN ru.id = 564 THEN 'Instalasi Napza' 
        WHEN ru.id = 567 THEN 'A.5. Instalasi Psikogeriatri' 
        WHEN ru.id = 573 THEN 'A.6. Instalasi Kes Jiwa Anak Remaja (TKA)' 
        WHEN ru.id = 577 THEN 'A.7. Instalasi Fisioterapi'
        WHEN ru.id = 575 THEN 'A.8. Instalasi Laboratorium' 
        WHEN ru.id = 576 THEN 'A.9. Instalasi Radiologi'
        WHEN ru.id = 571 THEN 'A.10. Instalasi Elektromedik' 
        WHEN ru.id = 580 THEN 'A.11. Instalasi Rehab Mental'
        WHEN ru.id = 568 THEN 'A.12. Instalasi Gigi & Mulut' 
        WHEN ru.id = 574 THEN 'A.15. Instalasi Gizi' END AS penerimaankasir,
        ((pp.hargasatuan-(CASE WHEN pp.hargadiscount IS NULL THEN  0 ELSE pp.hargadiscount END))*pp.jumlah)+
        CASE WHEN pp.jasa is null then 0 else pp.jasa end as total,
        CASE WHEN ru.id = 564 THEN 'Instalasi Napza' 
        WHEN ru.id = 567 THEN 'Instalasi Psikogeriatri' 
        WHEN ru.id = 573 THEN 'Instalasi Kes Jiwa Anak Remaja (TKA)' 
        WHEN ru.id = 577 THEN 'Instalasi Fisioterapi'
        WHEN ru.id = 575 THEN 'Instalasi Laboratorium' 
        WHEN ru.id = 576 THEN 'Instalasi Radiologi'
        WHEN ru.id = 571 THEN 'Instalasi Elektromedik' 
        WHEN ru.id = 580 THEN 'Instalasi Rehab Mental'
        WHEN ru.id = 568 THEN 'Instalasi Gigi & Mulut' 
        WHEN ru.id = 574 THEN 'Instalasi Gizi' END AS penerimaan_produk,
        'A. PELAYANAN PASIEN' AS kelompokpenerimaan_produk,
        CASE WHEN ru.id = 564 THEN 4
        WHEN ru.id = 567 THEN 5
        WHEN ru.id = 573 THEN 6
        WHEN ru.id = 577 THEN 7
        WHEN ru.id = 575 THEN 8
        WHEN ru.id = 576 THEN 9
        WHEN ru.id = 571 THEN 10
        WHEN ru.id = 580 THEN 11
        WHEN ru.id = 568 THEN 12
        WHEN ru.id = 574 THEN 15 END AS nopenerimaan,
        format(pp.tglpelayanan,'MM') as tgl
        FROM pelayananpasien_t as pp
        INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
        INNER JOIN produk_m as pro on pro.id = pp.produkfk 
        INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
        INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
        INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
        INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec 
        where pp.tglpelayanan between '$tglAwal' and '$tglAkhir'					
        AND ru.objectdepartemenfk in (34,45,30,26,6,3,27,28) AND pro.id NOT IN (4040398,4040399,4040406)
        
        UNION ALL
        
        SELECT CASE WHEN ru1.id in (94,125) THEN 'R. Jalan'
        WHEN  ru1.id in (116) THEN 'R. Ranap' END AS subheader,ru.id,
        'A.13. Instalasi Farmasi' AS penerimaankasir,
        ((pp.hargasatuan-(CASE WHEN pp.hargadiscount IS NULL THEN 0 ELSE pp.hargadiscount END))*pp.jumlah)+
        CASE WHEN pp.jasa is null then 0 else pp.jasa end as total,
        CASE WHEN ru1.id in (94,125) THEN 'R. Jalan'
        WHEN  ru1.id in (116) THEN 'R. Ranap' END AS penerimaan_produk,
        'A. PELAYANAN PASIEN' AS kelompokpenerimaan_produk,13 AS nopenerimaan,
        format(pp.tglpelayanan,'MM') as tgl
        FROM pelayananpasien_t as pp
        INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
        INNER JOIN strukresep_t as sr on sr.norec = pp.strukresepfk
        INNER JOIN produk_m as pro on pro.id = pp.produkfk 
        INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
        INNER JOIN ruangan_m as ru1 on ru1.id=sr.ruanganfk
        INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
        INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
        INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec 
        where pp.tglpelayanan between '$tglAwal' and '$tglAkhir'			
        AND pro.id NOT IN (4040398,4040399,4040406)
        
        UNION ALL
        
        SELECT 'Visite Apt' AS subheader,ru.id,
        'A.13. Instalasi Farmasi' AS penerimaankasir,
        ((pp.hargasatuan-(CASE WHEN pp.hargadiscount IS NULL THEN 0 ELSE pp.hargadiscount END))*pp.jumlah)+
        CASE WHEN pp.jasa is null then 0 else pp.jasa end as total,'Visite Apt' AS penerimaan_produk,
        'A. PELAYANAN PASIEN' AS kelompokpenerimaan_produk,13 AS nopenerimaan,
        format(pp.tglpelayanan,'MM') as tgl
        FROM pelayananpasien_t as pp
        INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk        
        INNER JOIN produk_m as pro on pro.id = pp.produkfk 
        INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk        
        INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
        INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
        INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec 
        where pp.tglpelayanan between '$tglAwal' and '$tglAkhir'							
        AND pro.id = 4041191
        
        UNION ALL
        
        SELECT  CASE WHEN ru.objectdepartemenfk = 16 THEN 'R. Ranap' ELSE 'R.Jalan' END AS subheader,ru.id,
        'A.14. Instalasi Psikologi' AS penerimaankasir,
        ((pp.hargasatuan-(CASE WHEN pp.hargadiscount IS NULL THEN 0 ELSE pp.hargadiscount END))*pp.jumlah)+
        CASE WHEN pp.jasa is null then 0 else pp.jasa end as total,
        CASE WHEN ru.objectdepartemenfk = 16 THEN 'R. Ranap' ELSE 'R.Jalan' END AS penerimaan_produk,
        'A. PELAYANAN PASIEN' AS kelompokpenerimaan_produk,14 AS nopenerimaan,
        format(pp.tglpelayanan,'MM') as tgl
        FROM pelayananpasien_t as pp
        INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
        INNER JOIN produk_m as pro on pro.id = pp.produkfk 
        INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
        INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
        INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
        INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec 
        where pp.tglpelayanan between '$tglAwal' and '$tglAkhir'							
        AND pro.id not in (4040404,4040405,40411416,4040400,4040407) AND ru.id = 570) as x on x.id=ru.id
        WHERE ru.ipaddress is not null and ru.kelompokpenerimaan is not null
        and x.subheader is not null
        GROUP BY x.subheader,x.penerimaankasir,x.kelompokpenerimaan_produk,x.penerimaan_produk,x.nopenerimaan,x.tgl
        ) as y 
        GROUP BY y.subheader,y.penerimaankasir,y.kelompokpenerimaan_produk,y.penerimaan_produk,y.nopenerimaan,y.tgl
        ORDER BY y.subheader,y.penerimaankasir,y.kelompokpenerimaan_produk
       
       "));
        return $this->respond($data);
    }

    public function getDataLaporanTargetRealisasiPendapatan(Request $request){
        //todo : laporan penerimaan
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $data = \DB::select(DB::raw("
            select ru.kelompokpenerimaan,ru.penerimaankasir,sum(x.total)  as totalrealisai,0 as totaltarget,(sum(x.total)/100)*0 as persen
                             from ruangan_m as ru 
                             left JOIN (
            
                                            select ru.id,ru.namaruangan,ru.penerimaankasir,((pp.hargasatuan-(case when pp.hargadiscount is null then 0 
                                            else pp.hargadiscount end))*pp.jumlah)+CASE when pp.jasa is null then 0 else pp.jasa end as total,
            format(pp.tglpelayanan,'dd')as tgl
                            from pelayananpasien_t as pp
                            INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                            INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                            INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                            INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                            INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                            where pp.tglpelayanan between '$tglAwal' and '$tglAkhir' and pd.objectkelompokpasienlastfk=1
                            
                            UNION ALL
                            
                            select ru.id,ru.namaruangan,ru.penerimaankasir,((pp.hargasatuan-
                                         (case when pp.hargadiscount is null then 0 else pp.hargadiscount end))*pp.jumlah)
                                         +CASE when pp.jasa is null then 0 else pp.jasa end as total,
            format(sr.tglresep,'dd')as tgl
                            from pelayananpasien_t as pp
                            INNER JOIN strukresep_t as sr on sr.norec=pp.strukresepfk
                            INNER JOIN ruangan_m as ru on ru.id=sr.ruanganfk
                            INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                            INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                            where sr.tglresep between '$tglAwal' and '$tglAkhir'
                            
                            UNION ALL
                             
                            select 599 as id,'bpjs' as namaruangan,'20. BPJS Kesehatan' as penerimaankasir,sp.totalprekanan as total,
            format(sp.tglstruk,'dd')as tgl
                            from  strukpelayanan_t as sp 
                            INNER JOIN pasiendaftar_t as pd on pd.norec=sp.noregistrasifk
                            where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                            and sp.totalprekanan <> 0 and pd.objectkelompokpasienlastfk = 2
                            
                            UNION ALL
                            
                            select 600 as id,'Jamkesda' as namaruangan,'21. Jamkesda' as penerimaankasir,sp.totalprekanan as total,
            format(sp.tglstruk,'dd')as tgl
                            from  strukpelayanan_t as sp 
                            INNER JOIN pasiendaftar_t as pd on pd.norec=sp.noregistrasifk
                            where sp.tglstruk between '$tglAwal' and '$tglAkhir'
                            and sp.totalprekanan <> 0
                            and pd.objectkelompokpasienlastfk=8
                            ) as x on x.id=ru.id
                            WHERE ru.ipaddress is not null and ru.kelompokpenerimaan is not null
                            GROUP BY ru.kelompokpenerimaan,ru.penerimaankasir
            
            ORDER BY ru.kelompokpenerimaan,ru.penerimaankasir ASC

         "));

        return $this->respond($data);
    }

    public function getDataLaporanPendapatanDiklat(Request $request){
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $kelompokTransaksi = "";
        if (isset($request['kelompokTransaksi']) && $request['kelompokTransaksi'] != ""){
            $kelompokTransaksi = " and [kt].[reportdisplay] ='" .$request['kelompokTransaksi']. "' ";
        }


        $data = \DB::select(DB::raw("
            select [sp].[norec], 
                [sp].[tglstruk], 
                [sp].[namapasien_klien], 
                [kt].[reportdisplay] as [jenistagihan], 
                [sp].[totalharusdibayar], 
                [keteranganlainnya], 
                [sp].[nosbklastfk], 
                [sp].[nosbmlastfk], 
                [kt].[id] as [jenisTagihanId],
                [sp].[totalharusdibayar] * 39/100 as jasa 
                from [strukpelayanan_t] as [sp] 
                inner join [kelompoktransaksi_m] as [kt] on [sp].[objectkelompoktransaksifk] = [kt].[id] 
                where [sp].[totalharusdibayar] is not null 
                and [sp].[objectkelompoktransaksifk] in (138,140,139,141,142,143,144,145,146,147,148,149,13,6,2,9,150,4) 
                and [sp].[tglstruk] >= '$tglAwal' 
                and [sp].[tglstruk] <= '$tglAkhir' 
                and [kt].[id] IN (13,138) and [sp].[nosbmlastfk] is not null 
                and [sp].[statusenabled] = 1
                $kelompokTransaksi
                ORDER BY sp.tglstruk DESC

         "));

        return $this->respond($data);

    }

    public function getDataRekapDiklat(Request $request){
        $tahun = $request['tahun'];


        $data = \DB::select(DB::raw("
                SELECT x.jenistagihan,x.bulanku,SUM(x.totalharusdibayar) as total FROM (select sp.norec,sp.tglstruk, sp.namapasien_klien,kt.reportdisplay as jenistagihan,
							 sp.totalharusdibayar,sp.keteranganlainnya,sp.nosbklastfk,sp.nosbmlastfk, 
							 kt.id as jenisTagihanId, 
                CASE
                WHEN MONTH(sp.tglstruk) = 1 THEN 'Januari'
                WHEN MONTH(sp.tglstruk) = 2 THEN 'Februari'
                WHEN MONTH(sp.tglstruk) = 3 THEN 'Maret'
                WHEN MONTH(sp.tglstruk) = 4 THEN 'April'
                WHEN MONTH(sp.tglstruk) = 5 THEN 'Mei'
                WHEN MONTH(sp.tglstruk) = 6 THEN 'Juni'
                WHEN MONTH(sp.tglstruk) = 7 THEN 'Juli'
                WHEN MONTH(sp.tglstruk) = 8 THEN 'Agustus'
                WHEN MONTH(sp.tglstruk) = 9 THEN 'September'
                WHEN MONTH(sp.tglstruk) = 10 THEN 'Oktober' 
                WHEN MONTH(sp.tglstruk) = 11 THEN 'November' 
                WHEN MONTH(sp.tglstruk) = 12 THEN 'Desember'
                END AS bulanku
                    from strukpelayanan_t as sp 
                    inner join kelompoktransaksi_m as kt on sp.objectkelompoktransaksifk = kt.id 
                    LEFT JOIN strukpelayanandetail_t as spd on spd.nostrukfk = sp.norec	
                    LEFT JOIN produk_m as pro ON pro.id = spd.objectprodukfk 
                LEFT JOIN detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk
                    where sp.totalharusdibayar is not null 
                    and sp.objectkelompoktransaksifk in (2, 3, 4, 5, 6, 10, 13, 16, 34, 8, 9, 20, 21, 23, 24, 26, 62, 70, 71) 
                    and sp.tglstruk >= '$tahun' 
                -- 	and sp.tglstruk <= '2019-11-30' 
                    and kt.id = 13 and sp.nosbmlastfk is not null and sp.statusenabled = 1) as x
                GROUP BY x.jenistagihan,x.bulanku
                ORDER BY x.bulanku DESC

         "));
        return $this->respond($data);

    }

// all
    public function getPendapatanAll(Request $request){
        // return($request['idDept']);
        // die();
        ini_set('max_execution_time', 500); //6 minuts
        $datas = [];
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $depart ="";
        if($request['idDept'] != "NULL" && $request['idDept'] != "")
        {
            if($request['idDept'] == 18) {
                $depart = " and depUse in (18,24)";
            } else if($request['idDept'] == 16) {
                $depart ="   and depUse = '$request[idDept]'";
                // $depart ="   and depUse ='$request[idDept]' and namaproduk like '%akomodasi%'";
                $departadministrasi ="   and depUse ='$request[idDept]' and namaproduk like '%administrasi%'";
            } else {
                $depart ="   and depUse NOT IN (18,16, 24)";
            }
        }
         $ruangan="";
        if($request['idRuangan'] != "NULL" && $request['idRuangan'] != "")
        {
            $ruangan ="   and namaruangan like '%$request[namaruangan]%'";
        }
        // $data = \DB::select(DB::raw("
        // SELECT        namaruangan, SUM(jasaMedis) AS jasaMedis, SUM(jasaLain) AS jasaLain, SUM(jasaAdm) AS jasaAdm, SUM(jasaTotal) AS jasaTotal, Judul, subJudul, groupjudul
        // FROM            V_RekapPendapatanPelayananPerkomponenNonKpJadi
        // WHERE        (tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir')  $depart $ruangan
        // GROUP BY namaruangan, Judul, subJudul, groupjudul
        //  "));

        if($request['idDept'] == 18) {
            $data = \DB::select(DB::raw("
            SELECT        namaruangan, SUM(jasaMedis) AS jasaMedis, SUM(jasaLain) AS jasaLain, SUM(jasaAdm) AS jasaAdm, SUM(jasaTotal) AS jasaTotal, Judul, subJudul, groupjudul
            FROM            V_RekapPendapatanPelayananPerkomponenNonKpJadi
            WHERE        (tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir')  $depart $ruangan
            GROUP BY namaruangan, Judul, subJudul, groupjudul
            "));
            $datas = \DB::select(DB::raw("SELECT DISTINCT CASE WHEN objectprodukfk = '4056959' THEN 'Pembuatan Kartu Pasien' ELSE 'Permintaan Resume Medis' END AS namaruangan, jasaMedis, jasaLain, SUM(jasaAdm * jumlahQty) AS jasaAdm, SUM(jasaTotal) AS jasaTotal, Judul, subJudul, groupjudul
            FROM V_PendapatanPelayananKartuPasien
            WHERE        (tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir')  $depart $ruangan
            GROUP BY namaruangan, Judul, subJudul, groupjudul, jasaMedis, jasaLain, jasaAdm, jasaTotal, Judul, subJudul, groupjudul, jumlahQty, objectprodukfk
            ORDER BY Judul, subJudul, groupjudul,namaruangan
            "));
            foreach ($data as $item) {
                $dataall[] = array(
                    'namaruangan' => $item->namaruangan,
                    'Judul' => $item->judul,
                    'subJudul' => $item->subjudul,
                    'groupjudul' => $item->groupjudul,
                    'jasaMedis' => $item->jasamedis,
                    'jasaLain' => $item->jasalain,
                    'jasaAdm' => $item->jasaadm,
                    'jasaTotal' => $item->jasatotal,
                    'Judul' => $item->judul,
                    'subJudul' => $item->subjudul,
                    'groupjudul' => $item->groupjudul
                );
            }
        // return($datas);
        // die();
            foreach ($datas as $items) {
                $dataall[] = array(
                    'namaruangan' => $items->namaruangan,
                    'Judul' => $items->judul,
                    'subJudul' => $items->subjudul,
                    'groupjudul' => $items->groupjudul,
                    'jasaMedis' => $items->jasamedis,
                    'jasaLain' => $items->jasalain,
                    'jasaAdm' => $items->jasaadm,
                    'jasaTotal' => $items->jasatotal,
                    'Judul' => $items->judul,
                    'subJudul' => $items->subjudul,
                    'groupjudul' => $items->groupjudul
                );
            }
        } else if($request['idDept'] == 16) {
            $data = \DB::select(DB::raw("SELECT        namaruangan, SUM(jasaMedis) AS jasaMedis, SUM(jasaLain) AS jasaLain, SUM(jasaAdm) AS jasaAdm, SUM(jasaTotal) AS jasaTotal, Judul, subJudul, groupjudul
            FROM            V_RekapPendapatanPelayananPerkomponenNonKpJadi
            WHERE        (tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir')  $depart $ruangan
            GROUP BY namaruangan, Judul, subJudul, groupjudul
             "));

            $dataadministrasi = [];
            // $dataadministrasi = \DB::select(DB::raw("SELECT        'Penerimaan Pendapatan Administrasi Rawat Inap' AS namaruangan, SUM(jasaMedis) AS jasaMedis, SUM(jasaLain) AS jasaLain, SUM(jasaAdm) AS jasaAdm, SUM(jasaTotal) AS jasaTotal, Judul, subJudul, groupjudul
            // FROM            V_RekapPendapatanPelayananPerkomponenNonKpJadi
            // WHERE        (tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir')  $departadministrasi $ruangan
            // GROUP BY Judul, subJudul, groupjudul, groupjudul
            //  "));

            // return($data);
            // die();


            foreach ($data as $item) {
                $dataall[] = array(
                    'namaruangan' => $item->namaruangan,
                    'Judul' => $item->Judul,
                    'subJudul' => $item->subJudul,
                    'groupjudul' => $item->groupjudul,
                    'jasaMedis' => $item->jasaMedis,
                    'jasaLain' => $item->jasaLain,
                    'jasaAdm' => $item->jasaAdm,
                    'jasaTotal' => $item->jasaTotal,
                    'Judul' => $item->Judul,
                    'subJudul' => $item->subJudul,
                    'groupjudul' => $item->groupjudul
                );
            }
             
            foreach ($dataadministrasi as $itemadministrasi) {
                $dataall[] = array(
                    'namaruangan' => $itemadministrasi->namaruangan,
                    'Judul' => $itemadministrasi->Judul,
                    'subJudul' => $itemadministrasi->subJudul,
                    'groupjudul' => $itemadministrasi->groupjudul,
                    'jasaMedis' => $itemadministrasi->jasaMedis,
                    'jasaLain' => $itemadministrasi->jasaLain,
                    'jasaAdm' => $itemadministrasi->jasaAdm,
                    'jasaTotal' => $itemadministrasi->jasaTotal,
                    'Judul' => $itemadministrasi->Judul,
                    'subJudul' => $itemadministrasi->subJudul,
                    'groupjudul' => $itemadministrasi->groupjudul
                );
            }
        } else if($request['idDept'] == 14) {
            $dataOB = \DB::select(DB::raw("
            SELECT        namaruangan, SUM(jasaMedis) AS jasaMedis, SUM(jasaLain) AS jasaLain, 0 AS jasaAdm, SUM(jasaLain) AS jasaTotal, Judul, subJudul, groupjudul

            FROM            V_RekapPendapatanPelayananObatBebas
            WHERE        (tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir')  and depUse = 14 $ruangan
            GROUP BY namaruangan, Judul, subJudul, groupjudul
             "));
             $datas = \DB::select(DB::raw("
             SELECT        namaruangan, SUM(jasaMedis) AS jasaMedis, SUM(jasaLain) AS jasaLain, 0 AS jasaAdm, SUM(jasaLain) AS jasaTotal, Judul, subJudul, groupjudul
 
             FROM            V_RekapPendapatanPelayananObatInap
             WHERE        (tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir')  and depUse = 14  $ruangan
             GROUP BY namaruangan, Judul, subJudul, groupjudul
              "));
            //  return($data);
            //  die();

            foreach ($dataOB as $itemOB) {
                $dataall[] = array(
                    'namaruangan' => $itemOB->namaruangan,
                    'Judul' => $itemOB->Judul,
                    'subJudul' => $itemOB->subJudul,
                    'groupjudul' => $itemOB->groupjudul,
                    'jasaMedis' => $itemOB->jasaMedis,
                    'jasaLain' => $itemOB->jasaLain,
                    'jasaAdm' => $itemOB->jasaAdm,
                    'jasaTotal' => $itemOB->jasaTotal,
                    'Judul' => $itemOB->Judul,
                    'subJudul' => $itemOB->subJudul,
                    'groupjudul' => $itemOB->groupjudul
                );
            }
            foreach ($datas as $items) {
                $dataall[] = array(
                    'namaruangan' => $items->namaruangan,
                    'Judul' => $items->Judul,
                    'subJudul' => $items->subJudul,
                    'groupjudul' => $items->groupjudul,
                    'jasaMedis' => $items->jasaMedis,
                    'jasaLain' => $items->jasaLain,
                    'jasaAdm' => $items->jasaAdm,
                    'jasaTotal' => $items->jasaTotal,
                    'Judul' => $items->Judul,
                    'subJudul' => $items->subJudul,
                    'groupjudul' => $items->groupjudul
                );
            }

        } else {
            $data = \DB::select(DB::raw("
            SELECT        namaruangan, SUM(jasaMedis) AS jasaMedis, SUM(jasaLain) AS jasaLain, SUM(jasaAdm) AS jasaAdm, SUM(jasaTotal) AS jasaTotal, Judul, subJudul, groupjudul
            FROM            V_RekapPendapatanPelayananPerkomponenNonKpJadi
            WHERE        (tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir')  $depart $ruangan
            GROUP BY namaruangan, Judul, subJudul, groupjudul
             "));

            foreach ($data as $item) {
                $dataall[] = array(
                    'namaruangan' => $item->namaruangan,
                    'Judul' => $item->Judul,
                    'subJudul' => $item->subJudul,
                    'groupjudul' => $item->groupjudul,
                    'jasaMedis' => $item->jasaMedis,
                    'jasaLain' => $item->jasaLain,
                    'jasaAdm' => $item->jasaAdm,
                    'jasaTotal' => $item->jasaTotal,
                    'Judul' => $item->Judul,
                    'subJudul' => $item->subJudul,
                    'groupjudul' => $item->groupjudul
                );
            }
            
            $dataOB = \DB::select(DB::raw("
            SELECT        namaruangan, SUM(jasaMedis) AS jasaMedis, SUM(jasaLain) AS jasaLain, 0 AS jasaAdm, SUM(jasaLain) AS jasaTotal, Judul, subJudul, groupjudul

            FROM            V_RekapPendapatanPelayananObatBebas
            WHERE        (tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir')  and depUse = 14 $ruangan
            GROUP BY namaruangan, Judul, subJudul, groupjudul
             "));
             $datas = \DB::select(DB::raw("
             SELECT        namaruangan, SUM(jasaMedis) AS jasaMedis, SUM(jasaLain) AS jasaLain, 0 AS jasaAdm, SUM(jasaLain) AS jasaTotal, Judul, subJudul, groupjudul
 
             FROM            V_RekapPendapatanPelayananObatInap
             WHERE        (tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir')  and depUse = 14  $ruangan
             GROUP BY namaruangan, Judul, subJudul, groupjudul
              "));
            //  return($data);
            //  die();

            foreach ($dataOB as $itemOB) {
                $dataall[] = array(
                    'namaruangan' => $itemOB->namaruangan,
                    'Judul' => $itemOB->Judul,
                    'subJudul' => $itemOB->subJudul,
                    'groupjudul' => $itemOB->groupjudul,
                    'jasaMedis' => $itemOB->jasaMedis,
                    'jasaLain' => $itemOB->jasaLain,
                    'jasaAdm' => $itemOB->jasaAdm,
                    'jasaTotal' => $itemOB->jasaTotal,
                    'Judul' => $itemOB->Judul,
                    'subJudul' => $itemOB->subJudul,
                    'groupjudul' => $itemOB->groupjudul
                );
            }
            foreach ($datas as $items) {
                $dataall[] = array(
                    'namaruangan' => $items->namaruangan,
                    'Judul' => $items->Judul,
                    'subJudul' => $items->subJudul,
                    'groupjudul' => $items->groupjudul,
                    'jasaMedis' => $items->jasaMedis,
                    'jasaLain' => $items->jasaLain,
                    'jasaAdm' => $items->jasaAdm,
                    'jasaTotal' => $items->jasaTotal,
                    'Judul' => $items->Judul,
                    'subJudul' => $items->subJudul,
                    'groupjudul' => $items->groupjudul
                );
            }

        }

        // foreach ($data as $item) {
        //     $dataall[] = array(
        //         'namaruangan' => $item->namaruangan,
        //         'Judul' => $item->Judul,
        //         'subJudul' => $item->subJudul,
        //         'groupjudul' => $item->groupjudul,
        //         'jasaMedis' => $item->jasaMedis,
        //         'jasaLain' => $item->jasaLain,
        //         'jasaAdm' => $item->jasaAdm,
        //         'jasaTotal' => $item->jasaTotal,
        //         'Judul' => $item->Judul,
        //         'subJudul' => $item->subJudul,
        //         'groupjudul' => $item->groupjudul
        //     );
        // }
        // return($datas);
        // die();
        // foreach ($datas as $items) {
        //     $dataall[] = array(
        //         'namaruangan' => $items->namaruangan,
        //         'Judul' => $items->Judul,
        //         'subJudul' => $items->subJudul,
        //         'groupjudul' => $items->groupjudul,
        //         'jasaMedis' => $items->jasaMedis,
        //         'jasaLain' => $items->jasaLain,
        //         'jasaAdm' => $items->jasaAdm,
        //         'jasaTotal' => $items->jasaTotal,
        //         'Judul' => $items->Judul,
        //         'subJudul' => $items->subJudul,
        //         'groupjudul' => $items->groupjudul
        //     );
        // }

        // $data[]
        // return($datas);
        // die();

        return $this->respond($dataall);

    }
    public function SaveAnggaranLaporanOPDFungsional(Request $request) {
        \DB::beginTransaction();
        $transMessage='';
        $transStatus='';
        $anggaran = $request['anggaran'];
        $departemen = $request['namadepartemen'];
        $tahun = $request['tahun'];
        //try {
            if($request['action'] == "insert"){
                $TA = new TargetAnggaran();
                $norecTA = $TA->generateNewId();
                $TA->norec = $norecTA;
                $TA->kdprofile = 12;
                $TA->statusenabled = true;
                $TA->anggaran = $request['anggaran'];
                $TA->namadepartemen = $request['namadepartemen'];
                $TA->tahun = $request['tahun'];
                $TA->save();

                $transStatus = 'true';
            }else if($request['action'] == "update"){
                  $TA = TargetAnggaran::where('namadepartemen', $request['namadepartemen']);
                  $TA->where('tahun', $request['tahun']);
                  $TA->update(['anggaran' => $request['anggaran']]);
               $transStatus = 'true';
            }else{
                $transStatus = 'false';
            }

//        } catch (\Exception $e) {
//            $transStatus = 'false';
//        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "data" => $TA,
                "as" => 'dy@epic',
            );
        } else {
            $transMessage = "Simpan Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "data" => $TA,
                "as" => 'dy@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function detailPiutangPasien($norec){
        $spp = StrukPelayananPenjamin::where('norec', $norec)->first();
//        $sp = StrukPelayanan::where('norec', $spp->nostrukfk)->first();
        $sbp = StrukBuktiPenerimaan::where('nostrukfk', $spp->nostrukfk)->orderBy('nosbm')->get();

        $detailPembayaran = array();
        foreach ($sbp as $item){
            $detailPembayaran[] = array(
                'noSbm' => $item->nosbm,
                'tglPembayaran' => $item->tglsbm,
                'jlhPembayaran' => $item->totaldibayar
            );
        }
        
        $dibayarAwal = $spp->totalbiaya - $spp->totalharusdibayar ;
        // return($dibayarAwal );
        // die();
        // $data = array(
        //     "noRegistrasi" => $spp->struk_pelayanan->pasien_daftar->noregistrasi,
        //     "namaPasien" => $spp->struk_pelayanan->pasien_daftar->pasien->namapasien,
        //     "jenisPenjamin" => $spp->struk_pelayanan->pasien_daftar->kelompok_pasien->kelompokpasien,
        //     "jenisKelamin" => $spp->struk_pelayanan->pasien_daftar->pasien->jenis_kelamin->jeniskelamin,
        //     "umurPiutang" => $spp->struk_pelayanan->UmurPiutang,
        //     "noCM" => $spp->struk_pelayanan->pasien_daftar->pasien->nocm,
        //     "totalTagihan" => $spp->totalbiaya,
        //     "sudahDibayar" => $spp->totalsudahdibayar+$dibayarAwal,
        //     "sisaPiutang" => $spp->totalbiaya - $dibayarAwal-$spp->totalsudahdibayar,
        //     "detailPembayaran" => $detailPembayaran
        // );
        $deposit = $this->getDepositPasien($spp->struk_pelayanan->pasien_daftar->noregistrasi);
        $data = array(
            "noRegistrasi" => $spp->struk_pelayanan->pasien_daftar->noregistrasi,
            "namaPasien" => $spp->struk_pelayanan->pasien_daftar->pasien->namapasien,
            "jenisPenjamin" => $spp->struk_pelayanan->pasien_daftar->kelompok_pasien->kelompokpasien,
            "jenisKelamin" => $spp->struk_pelayanan->pasien_daftar->pasien->jenis_kelamin->jeniskelamin,
            "umurPiutang" => $spp->struk_pelayanan->UmurPiutang,
            "noCM" => $spp->struk_pelayanan->pasien_daftar->pasien->nocm,
            "totalTagihan" => $spp->totalbiaya,
            "sudahDibayar" => $spp->totalsudahdibayar + $spp->totalppenjamin +$deposit,
            "sisaPiutang" => $spp->totalbiaya -  $spp->totalharusdibayar - $spp->totalsudahdibayar - $spp->totalppenjamin,
            "detailPembayaran" => $detailPembayaran
        );

        return $this->respond($data);
    }

    public function SaveKelompokTransaksiKasir(Request $request) {
        \DB::beginTransaction();
        $tglAyeuna = date('Y-m-d H:i:s');
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id',$dataLogin['userData']['id'])
            ->first();
        try{

            $Kel = StrukPelayanan::where('norec', $request['norec'])
                ->update([
                    'objectkelompoktransaksifk' => $request['idKelompokTransaksi'],
                ]);

//            //## Logging User
//            $newId = LoggingUser::max('id');
//            $newId = $newId +1;
//            $logUser = new LoggingUser();
//            $logUser->id = $newId;
//            $logUser->norec = $logUser->generateNewId();
//            $logUser->kdprofile= 0;
//            $logUser->statusenabled=true;
//            $logUser->jenislog = 'Batal Transaksi Non Layanan Dengan Nostruk : ' . $request['nostruk'];
//            $logUser->noreff =$request['norec'];
//            $logUser->referensi='norec strukpelayanan_t';
//            $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
//            $logUser->tanggal = $tglAyeuna;
//            $logUser->save();

            $transStatus = true;
        } catch (\Exception $e) {
            $transStatus = false;
        }

        if ($transStatus) {
            $transMessage = 'Sukses';
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'dy@epic',
            );
        } else {
            $transMessage = 'Hapus Gagal';
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'dy@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }
}