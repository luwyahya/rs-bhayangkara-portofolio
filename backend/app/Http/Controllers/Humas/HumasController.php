<?php
/**
 * Created by PhpStorm.
 * HumasController
 * User: Efan Andrian (ea@epic)
 * Date: 07/08/2019
 * Time: 11:44 PM
 */
namespace App\Http\Controllers\Humas;
use App\Http\Controllers\Transaksi\Pegawai\Pegawai;
use App\Master\JadwalPraktekBulanan;
use App\Master\JadwalPraktekMingguan;
use App\Master\KeluhanPelanggan;
use App\Traits\Valet;
use App\Transaksi\LoggingUser;
use App\Transaksi\PenangananKeluhanPelanggan;
use App\Transaksi\PenangananKeluhanPelangganD;
use Illuminate\Http\Request;
use App\Http\Requests;
use Illuminate\Support\Facades\DB;
use Response;
use App\Http\Controllers\ApiController;

class HumasController extends ApiController
{
    use Valet;
    public function __construct()
    {
        parent::__construct($skip_authentication=false);
    }

    public function getDataComboHumas(Request $request)
    {
        $dataLogin = $request->all();
        $dataPegawaiUser = DB::select(DB::raw("select pg.id,pg.namalengkap from loginuser_s as lu
                INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id
                where lu.id=:idLoginUser"),
            array(
                'idLoginUser' => $dataLogin['userData']['id'],
            )
        );
        $dataInstalasi = \DB::table('departemen_m as dp')
            ->whereIn('dp.id',[3, 14, 16, 17, 18, 19, 24, 25, 26, 27, 28, 35])
            ->where('dp.statusenabled', true)
            ->orderBy('dp.namadepartemen')
            ->get();
        $dataRuangan = \DB::table('ruangan_m as ru')
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
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
        $dataRuangan = \DB::table('ruangan_m as ru')
            ->select('ru.id','ru.namaruangan','ru.objectdepartemenfk','ru.kdinternal')
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();
        $dataKelas = \DB::table('kelas_m as kl')
            ->select('kl.id', 'kl.namakelas')
            ->whereIn('kl.id',[1,2,3,4,5,6,8,9])
            ->where('kl.statusenabled', true)
            ->orderBy('kl.namakelas')
            ->get();
        $dataRuanganRi = \DB::table('ruangan_m as ru')
            ->select('ru.id','ru.namaruangan','ru.objectdepartemenfk','ru.kdinternal')
            ->where('ru.statusenabled', true)
            ->where('ru.objectdepartemenfk', 16)
            ->orderBy('ru.namaruangan')
            ->get();
        $dataKelasKamar = \DB::table('kelas_m as kl')
            ->select('kl.id', 'kl.namakelas')
            ->whereIn('kl.id',[1,2,3,4,5,6,8,9,17,18,19])
            ->where('kl.statusenabled', true)
            ->orderBy('kl.namakelas')
            ->get();
        $datadept = \DB::table('departemen_m as dp')
            ->select('dp.id', 'dp.namadepartemen')
            ->where('dp.statusenabled', true)
            ->orderBy('dp.namadepartemen')
            ->get();
        $dataklpro = \DB::table('kelompokproduk_m as dp')
            ->select('dp.id', 'dp.kelompokproduk')
            ->where('dp.statusenabled', true)
            ->orderBy('dp.kelompokproduk')
            ->get();
        $unitkerja = \DB::table('unitkerjapegawai_m as ukp')
            ->select('ukp.id','ukp.name')
            ->where('ukp.statusenabled', true)
            ->orderBy('ukp.id')
            ->get();
        $pekerjaan = \DB::table('pekerjaan_m as ukp')
            ->select('ukp.id','ukp.pekerjaan')
            ->where('ukp.statusenabled', true)
            ->orderBy('ukp.id')
            ->get();
        $jeniskelamin = \DB::table('jeniskelamin_m as ukp')
            ->select('ukp.id','ukp.jeniskelamin')
            ->where('ukp.statusenabled', true)
            ->orderBy('ukp.id')
            ->get();
        $dataKelompok = \DB::table('kelompokpasien_m as kp')
            ->select('kp.id', 'kp.kelompokpasien')
            ->where('kp.statusenabled', true)
            ->orderBy('kp.kelompokpasien')
            ->get();
        $dataJabatan = \DB::table('jabatan_m as kp')
            ->select('kp.id','kp.namajabatan')
            ->where('kp.statusenabled',true)
            ->orderBy('kp.namajabatan')
            ->get();
        $AsalProduk = \DB::table('asalproduk_m as kp')
            ->select('kp.id','kp.asalproduk')
            ->where('kp.statusenabled',true)
            ->orderBy('kp.asalproduk')
            ->get();
        $dataRuanganRj = \DB::table('ruangan_m as ru')
            ->select('ru.id','ru.namaruangan','ru.objectdepartemenfk','ru.kdinternal')
            ->where('ru.statusenabled', true)
            ->whereIn('ru.objectdepartemenfk',[18,28])
            ->orderBy('ru.namaruangan')
            ->get();
        $dataJenisKelamin = \DB::table('jeniskelamin_m as jk')
            ->select('jk.id','jk.reportdisplay','jk.jeniskelamin')
            ->where('jk.statusenabled', true)
            ->orderBy('jk.id')
            ->get();

        $result = array(
            'ruangan' => $dataRuangan,
            'ruanganrawatinap' => $dataRuanganRi,
            'datalogin' => $dataLogin,
            'kelas' => $dataKelas,
            'kelaskamar' => $dataKelasKamar,
            'departemen' => $datadept,
            'kelompokproduk' => $dataklpro,
            'unitkerja' => $unitkerja,
            'pegawaiuser' => $dataPegawaiUser,
            'pekerjaan' => $pekerjaan,
            'jeniskelamin' => $jeniskelamin,
            'kelompokpasien' => $dataKelompok,
            'datadept' => $dataDepartemen,
            'dataruangan' => $dataRuangan,
            'jabatan' => $dataJabatan,
            'asalproduk' => $AsalProduk,
            'ruanganrj' => $dataRuanganRj,
            'jeniskelamin' => $dataJenisKelamin,
            'message' => 'cepot',
        );

        return $this->respond($result);
    }

    public function getDataPegawai(Request $request) {
        $req=$request->all();
        $dataPenulis = \DB::table('pegawai_m as st')
            ->select('st.id','st.namalengkap','st.nip_pns')
            ->where('st.statusenabled',true)
            ->where('st.objectjenispegawaifk','1')
            ->orderBy('st.namalengkap');
        if(isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value']!="" &&
            $req['filter']['filters'][0]['value']!="undefined"){
            $dataPenulis = $dataPenulis->where('namalengkap','like', '%'.$req['filter']['filters'][0]['value'].'%' );
        };
        $dataPenulis = $dataPenulis->take(10);
        $dataPenulis = $dataPenulis->get();
        foreach ($dataPenulis as $item){
            $dataPenulis2[]=array(
                'id' => $item->id,
                'namalengkap' => $item->namalengkap,
                'nip_pns' => $item->nip_pns,
            );
        }
        return $this->respond($dataPenulis2);
    }

    public function getDataPegawaiAll(Request $request) {
        $req=$request->all();
        $dataPenulis = \DB::table('pegawai_m as st')
            ->select('st.id','st.namalengkap','st.nip_pns')
            ->where('st.statusenabled',true)
            ->orderBy('st.namalengkap');
        if(isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value']!="" &&
            $req['filter']['filters'][0]['value']!="undefined"){
            $dataPenulis = $dataPenulis->where('namalengkap','like', '%'.$req['filter']['filters'][0]['value'].'%' );
        };
        $dataPenulis = $dataPenulis->take(10);
        $dataPenulis = $dataPenulis->get();
        foreach ($dataPenulis as $item){
            $dataPenulis2[]=array(
                'id' => $item->id,
                'namalengkap' => $item->namalengkap,
                'nip_pns' => $item->nip_pns,
            );
        }
        return $this->respond($dataPenulis2);
    }

    public function getDataPegawaiPP (Request $request) {
        $req=$request->all();
        $dataPenulis = \DB::table('pegawai_m as st')
            ->select('st.id','st.namalengkap','st.nip_pns')
            ->where('st.statusenabled',true)
            ->orderBy('st.namalengkap');
        if(isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value']!="" &&
            $req['filter']['filters'][0]['value']!="undefined"){
            $dataPenulis = $dataPenulis->where('namalengkap','like', '%'.$req['filter']['filters'][0]['value'].'%' );
        };
        $dataPenulis = $dataPenulis->take(10);
        $dataPenulis = $dataPenulis->get();
        foreach ($dataPenulis as $item){
            $dataPenulis2[]=array(
                'id' => $item->id,
                'namalengkap' => $item->namalengkap,
                'nip_pns' => $item->nip_pns,
            );
        }
        return $this->respond($dataPenulis2);
    }

    public function getDataproduk(Request $request) {
        $req=$request->all();
        $dataProduk=[];
        $dataProduk  = \DB::table('produk_m as pro')
            ->leftJoin('detailjenisproduk_m as djp','djp.id','=','pro.objectdetailjenisprodukfk')
            ->leftJoin('jenisproduk_m as jp','jp.id','=','djp.objectjenisprodukfk')
            ->leftJoin('kelompokproduk_m as kp','kp.id','=','jp.objectkelompokprodukfk')
            ->select('pro.id as kdproduk','pro.namaproduk','djp.id as djid','djp.detailjenisproduk','jp.id as jpid','jp.jenisproduk')
            ->where('pro.statusenabled',true)
            ->orderBy('pro.namaproduk');

        if(isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value']!="" &&
            $req['filter']['filters'][0]['value']!="undefined"){
            $dataProduk = $dataProduk->where('pro.namaproduk','like','%'. $req['filter']['filters'][0]['value'].'%' );
        };
        $dataProduk = $dataProduk->take(10);
        $dataProduk = $dataProduk->get();
        return $this->respond($dataProduk);
    }

    public function getDaftarTarif(Request $request)
    {
        $filter = $request->all();
        $produkid= '';
        if  ($filter['produkId'] != ''){
            $produkid= 'AND pr.id = ' . $filter['produkId'];
        }
        $ruanganid = '';
        if ($filter['ruanganId'] != ''){
            $ruanganid ='AND mprtp.objectruanganfk =' . $filter['ruanganId'];
        }
        $kelasid = '';
        if ($filter['kelasId'] != ''){
            $kelasid ='AND kls.id =' . $filter['kelasId'];
        }
        $jenispelid = '';
        if ($filter['jenispelayananId'] != ''){
            $jenispelid ='AND jnsp.id =' . $filter['jenispelayananId'];
        }
        $namaproduk = '';
        if ($filter['namaproduk'] != ''){
            $namaproduk ="AND pr.namaproduk ilike '%" . $filter['namaproduk'] . "%'";
        }

        $data =DB::select(DB::raw("
               SELECT distinct
         
                pr.id,
                pr.namaproduk,
                hrpk.harganetto1 AS hargalayanan,kls.id as idkelas,kls.namakelas ,jnsp.id as jenispelayananid,jnsp.jenispelayanan,mprtp.objectruanganfk as ruid,
                  ru.id as ruid,ru.namaruangan
                FROM
                produk_m AS pr
                INNER JOIN mapruangantoproduk_m AS mprtp ON mprtp.objectprodukfk = pr.id
               -- LEFT JOIN detailjenisproduk_m AS djp ON djp.id = pr.objectdetailjenisprodukfk
                --LEFT JOIN jenisproduk_m AS jp ON jp.id = djp.objectjenisprodukfk
                LEFT JOIN harganettoprodukbykelas_m AS hrpk ON hrpk.objectprodukfk = pr.id
                INNER JOIN kelas_m as kls on kls.id=hrpk.objectkelasfk
                INNER JOIN jenispelayanan_m as jnsp on jnsp.id=hrpk.objectjenispelayananfk
                INNER JOIN ruangan_m as ru on ru.id=mprtp.objectruanganfk
                WHERE
                -- hrpk.statusenabled = true
                -- AND pr.statusenabled = true
                hrpk.statusenabled = true
                AND pr.statusenabled = true
              --  AND jp.id NOT IN (97)
                AND hrpk.objectkelasfk IN (1, 2, 3, 5, 6, 8)
                $produkid
                 $ruanganid 
                 $kelasid $jenispelid $namaproduk
                 limit 50
                 ")
        );

        $result = array(
            'data'=>$data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }
    public function getDaftarTarifDetail(Request $request)
    {
        $filter = $request->all();
        $produkid= '';
        if  ($filter['produkId'] != ''){
            $produkid= 'AND pr.id = ' . $filter['produkId'];
        }
        $ruanganid = '';
        if ($filter['ruanganId'] != ''){
            $ruanganid ='AND mprtp.objectruanganfk =' . $filter['ruanganId'];
        }
        $kelasid = '';
        if ($filter['kelasId'] != ''){
            $kelasid ='AND kls.id =' . $filter['kelasId'];
        }
        $jenispelid = '';
        if ($filter['jenispelayananId'] != ''){
            $jenispelid ='AND jnspel.id =' . $filter['jenispelayananId'];
        }

        $data =DB::select(DB::raw("
                select  pr.id as kdeproduk,pr.namaproduk,kls.id as klsid,kh.id as idkomponen,kh.komponenharga,hrpkd.harganetto1,
                hrpkd.harganetto2,hrpkd.hargasatuan,jnspel.id as jnspelid,kls.namakelas,jnspel.jenispelayanan
                from produk_m as pr
                INNER JOIN mapruangantoproduk_m AS mprtp ON mprtp.objectprodukfk = pr.id
                left join detailjenisproduk_m as djp on djp.id = pr.objectdetailjenisprodukfk
                left join jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk
                left join kelompokproduk_m as kp on kp.id = jp.objectkelompokprodukfk
                left join harganettoprodukbykelasd_m as hrpkd on hrpkd.objectprodukfk = pr.id
                inner join kelas_m as kls on kls.id = hrpkd.objectkelasfk
                inner join komponenharga_m as kh on kh.id = hrpkd.objectkomponenhargafk
                INNER JOIN jenispelayanan_m as jnspel on jnspel.id=hrpkd.objectjenispelayananfk
                where 
                pr.statusenabled=1 
                and hrpkd.statusenabled = 1
                -- pr.statusenabled = true
                -- and hrpkd.statusenabled = true
                $produkid $ruanganid $kelasid $jenispelid
                GROUP BY pr.id,pr.namaproduk,kls.id,kh.id,kh.komponenharga,hrpkd.harganetto1,
				         hrpkd.harganetto2,hrpkd.hargasatuan,jnspel.id,kls.namakelas,
				         jnspel.jenispelayanan")
        );
        $result = array(
            'data'=>$data,
//            'detail'=> $details,
            'message' => 'cepot',
        );
        return $this->respond($result);
    }

    public function getJadwalDokter (Request $request){
        $filter = $request->all();
        // return($request['ruanganId']);
        // die();
          //** POSTGRESQL **//
//        $data = \DB::table('jadwaldokter_m as jd')
//            ->join('jadwalpraktek_m as jp','jp.id','=','jd.objectjadwalpraktekfk')
//            ->join('pegawai_m as pg','pg.id','=','jd.objectpegawaifk')
//            ->join('ruangan_m as ru','ru.id','=','jd.objectruanganfk')
//            ->select('jd.tanggaljadwal','jp.jampraktek','pg.id as pegawaiid','pg.namalengkap','ru.id as ruanganid','ru.namaruangan',
//                DB::raw('to_date(to_char(jd.tanggaljadwal,\'yyyy/mm/dd\'),\'yyyy/mm/dd\')||\' \'||jp.waktumulai as start,
//                        to_date(to_char(jd.tanggaljadwal,\'yyyy/mm/dd\'),\'yyyy/mm/dd\')||\' \'||jp.waktuselesai as end,
//                        EXTRACT(epoch from to_timestamp(to_date(to_char(jd.tanggaljadwal,\'yyyy/mm/dd\'),\'yyyy/mm/dd\')||\' \'||jp.waktumulai,\'yyyy/mm/dd HH24\')) as startepoch,
//                        EXTRACT(epoch from to_timestamp(to_date(to_char(jd.tanggaljadwal,\'yyyy/mm/dd\'),\'yyyy/mm/dd\')||\' \'||jp.waktuselesai,\'yyyy/mm/dd HH24\')) as endpoch')
//            );

        //** SQLSERVER **//
        // INI YG ASLI //
        // $data = \DB::table('jadwaldokter_m as jd')
        //     ->join('jadwalpraktek_m as jp','jp.id','=','jd.objectjadwalpraktekfk')
        //     ->join('pegawai_m as pg','pg.id','=','jd.objectpegawaifk')
        //     ->join('ruangan_m as ru','ru.id','=','jd.objectruanganfk')
        //     ->select('jd.tanggaljadwal','jp.jampraktek','pg.id as pegawaiid','pg.namalengkap','ru.id as ruanganid','ru.namaruangan',
        //         DB::raw(" convert(char, 	jd.tanggaljadwal, 111) + ' ' +  convert(char, jp.waktumulai, 108)  AS start,
        //         convert(char, 	jd.tanggaljadwal, 111) + ' ' +  convert(char, jp.waktuselesai, 108) AS ends,
        //         convert(char, 	jd.tanggaljadwal, 111) + ' ' + convert(char, jp.waktumulai, 108) AS startepoch,
        //          convert(char, 	jd.tanggaljadwal, 111) + ' ' +  convert(char, jp.waktuselesai, 108) AS endpoch")
        //     );

        $data = \DB::table('jadwalpraktekbulanan_m as jpb')
            ->join('pegawai_m as pg','pg.id','=','jpb.objectpegawaifk')
            ->join('ruangan_m as ru','ru.id','=','jpb.objectruanganfk')
            ->select('pg.nama', 'jpb.jammulai as start', 'jpb.jamselesai as ends', 'jpb.tglmulai', 'ru.namaruangan'
                // DB::raw("
                // convert(char, 	jpb.tanggalmuali, 111) AS tanggaljadwal)
                // ")
            );

         if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
             $data = $data->where('jpb.tglmulai', '>=', $request['tglAwal']);
         }
         if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];
            $data = $data->where('jpb.tglmulai', '<=', $tgl);
         }
        if (isset($request['dokterId']) && $request['dokterId'] != "" && $request['dokterId'] != "undefined") {
            $data = $data->where('pg.id', '=', $request['dokterId']);
        }
        if (isset($request['ruanganId']) && $request['ruanganId'] != "" && $request['ruanganId'] != "undefined") {
            $data = $data->where('ru.id', '=', $request['ruanganId']);
        }
        $data = $data->orderBy('jpb.tglmulai', 'asc');
        $data = $data->get();

        $results =array();
        foreach ($data as $item){
            $tanggaljadwal =date_format(date_create($item->tglmulai),'Y-m-d');
            $jampraktek = $item->start .' - '. $item->ends;
            $results[] = array(
                // 'pegawaiid' => $item->pegawaiid,
                // 'namalengkap' => $item->namalengkap,
                // 'ruanganid' => $item->ruanganid,
                'namaruangan' => $item->namaruangan,
                'tanggaljadwal' => $tanggaljadwal,
                'jampraktek' => $jampraktek,
                'namalengkap' => $item->nama,
                'start' => $item->start,
                'end' => $item->ends,
                // 'startepoch' =>  (int)$item->startepoch ,
                // 'endpoch' => $item->endpoch,
            );
        }
        $result = array(
            'callback'=>$results,
            'message' => 'cepot',
        );
        return $this->respond($result);
    }

    public function getKetersediaanTempatTidur (Request $request)
    {
        $filter = $request->all();
        $data = \DB::table('tempattidur_m as tdr')
            ->leftJoin('kamar_m as kr','kr.id','=','tdr.objectkamarfk')
            ->leftJoin('statusbed_m as sb','sb.id','=','tdr.objectstatusbedfk')
            ->leftJoin('ruangan_m as ru','ru.id','=','kr.objectruanganfk')
            ->leftJoin('kelas_m as kl','kl.id','=','kr.objectkelasfk')
            ->leftJoin('departemen_m as dept','dept.id','=','ru.objectdepartemenfk')
            ->select('kr.tglupdate','kr.namakamar','ru.namaruangan','kl.namakelas','sb.statusbed'
            );

        if (isset($request['kelasId']) && $request['kelasId'] != "" && $request['kelasId'] != "undefined") {
            $data = $data->where('kls.id', '=', $request['kelasId']);
        }
        if (isset($request['ruanganId']) && $request['ruanganId'] != "" && $request['ruanganId'] != "undefined") {
            $data = $data->where('ru.id', '=', $request['ruanganId']);
        }
        $data = $data->orderBy('kr.namakamar', 'asc');
        $data = $data->get();
        $result = array(
            'data'=>$data,
            'message' => 'cepot',
        );
        return $this->respond($result);
    }

    public function getKetersediaanTempatTidurView (Request $request)
    {
        $namaruangan= $request['namaruangan'];
        $idkelas= $request['idkelas'];
        $dataLogin = $request->all();
        if($namaruangan == "" && $idkelas == ""){
            $data = DB::select(DB::raw("select top 1 COUNT(x.idstatusbed) as kamartotal, SUM(x.kamarisi) as kamarisi, sum(x.kamarkosong) as kamarkosong, 
			    sum(x.kamarprosesadmin) as kamarprosesadmin, sum(x.kamartakterpakai) as kamartakterpakai from 
                (select 
                 ru.namaruangan, 
                 km.namakamar,
                 kl.id as kelasid,
                 kl.namakelas, 
                 tt.reportdisplay, 
                 tt.nomorbed, 
                 sb.id as idstatusbed, 
                 sb.statusbed,
                 (case when sb.id=1 then 1 else 0 end) as kamarisi,
                 (case when sb.id=2 then 1 else 0 end) as kamarkosong,
                 (case when sb.id=3 then 1 else 0 end) as kamarprosesadmin,
                 (case when sb.id=4 then 1 else 0 end) as kamartakterpakai
                 from tempattidur_m as tt
                 left join kamar_m as km on km.id = tt.objectkamarfk
                 left join ruangan_m as ru on ru.id = km.objectruanganfk
                 left join statusbed_m as sb on sb.id = tt.objectstatusbedfk
                 left join kelas_m as kl on kl.id = km.objectkelasfk
                 where ru.objectdepartemenfk in (16,35) and ru.statusenabled=1
				 and km.statusenabled=1 and tt.statusenabled=1)as x "),
                array(
//                    'namaruangan' => $namaruangan,
//                    'idkelas' => $idkelas,
                )
            );
        } elseif ($namaruangan != "" && $idkelas == ""){
            $data = DB::select(DB::raw("select COUNT(x.idstatusbed) as kamartotal, SUM(x.kamarisi) as kamarisi, sum(x.kamarkosong) as kamarkosong, 
			    sum(x.kamarprosesadmin) as kamarprosesadmin, sum(x.kamartakterpakai) as kamartakterpakai from 
                (select 
                 ru.namaruangan, 
                 km.namakamar,
                 kl.id as kelasid,
                 kl.namakelas, 
                 tt.reportdisplay, 
                 tt.nomorbed, 
                 sb.id as idstatusbed, 
                 sb.statusbed,
                 (case when sb.id=1 then 1 else 0 end) as kamarisi,
                 (case when sb.id=2 then 1 else 0 end) as kamarkosong,
                 (case when sb.id=3 then 1 else 0 end) as kamarprosesadmin,
                 (case when sb.id=4 then 1 else 0 end) as kamartakterpakai
                 from tempattidur_m as tt
                 left join kamar_m as km on km.id = tt.objectkamarfk
                 left join ruangan_m as ru on ru.id = km.objectruanganfk
                 left join statusbed_m as sb on sb.id = tt.objectstatusbedfk
                 left join kelas_m as kl on kl.id = km.objectkelasfk
                 where ru.objectdepartemenfk in (16,35) and ru.namaruangan=:namaruangan)as x"),
                array(
                    'namaruangan' => $namaruangan,
//                    'idkelas' => $idkelas,
                )
            );
        } elseif ($namaruangan == "" && $idkelas != ""){
            $data = DB::select(DB::raw("select COUNT(x.idstatusbed) as kamartotal, SUM(x.kamarisi) as kamarisi, sum(x.kamarkosong) as kamarkosong, 
			    sum(x.kamarprosesadmin) as kamarprosesadmin, sum(x.kamartakterpakai) as kamartakterpakai from 
                (select 
                 ru.namaruangan, 
                 km.namakamar,
                 kl.id as kelasid,
                 kl.namakelas, 
                 tt.reportdisplay, 
                 tt.nomorbed, 
                 sb.id as idstatusbed, 
                 sb.statusbed,
                 (case when sb.id=1 then 1 else 0 end) as kamarisi,
                 (case when sb.id=2 then 1 else 0 end) as kamarkosong,
                 (case when sb.id=3 then 1 else 0 end) as kamarprosesadmin,
                 (case when sb.id=4 then 1 else 0 end) as kamartakterpakai
                 from tempattidur_m as tt
                 left join kamar_m as km on km.id = tt.objectkamarfk
                 left join ruangan_m as ru on ru.id = km.objectruanganfk
                 left join statusbed_m as sb on sb.id = tt.objectstatusbedfk
                 left join kelas_m as kl on kl.id = km.objectkelasfk
                 where ru.objectdepartemenfk in (16,35) and kl.id=:idkelas)as x"),
                array(
//                    'namaruangan' => $namaruangan,
                    'idkelas' => $idkelas,
                )
            );
        } else {
            $data = DB::select(DB::raw("select COUNT(x.idstatusbed) as kamartotal, SUM(x.kamarisi) as kamarisi, sum(x.kamarkosong) as kamarkosong, 
			    sum(x.kamarprosesadmin) as kamarprosesadmin, sum(x.kamartakterpakai) as kamartakterpakai from 
                (select 
                 ru.namaruangan, 
                 km.namakamar,
                 kl.id as kelasid,
                 kl.namakelas, 
                 tt.reportdisplay, 
                 tt.nomorbed, 
                 sb.id as idstatusbed, 
                 sb.statusbed,
                 (case when sb.id=1 then 1 else 0 end) as kamarisi,
                 (case when sb.id=2 then 1 else 0 end) as kamarkosong,
                 (case when sb.id=3 then 1 else 0 end) as kamarprosesadmin,
                 (case when sb.id=4 then 1 else 0 end) as kamartakterpakai
                 from tempattidur_m as tt
                 left join kamar_m as km on km.id = tt.objectkamarfk
                 left join ruangan_m as ru on ru.id = km.objectruanganfk
                 left join statusbed_m as sb on sb.id = tt.objectstatusbedfk
                 left join kelas_m as kl on kl.id = km.objectkelasfk
                 where ru.objectdepartemenfk in (16,35) and ru.namaruangan=:namaruangan and kl.id=:idkelas)as x"),
                array(
                    'namaruangan' => $namaruangan,
                    'idkelas' => $idkelas,
                )
            );
        }
        return $this->respond($data);
    }

    public function GetDataPegawaiAtasan (Request $request)
    {
        $dataLogin = $request->all();
        $dataPegawaiUser = DB::select(DB::raw("select pg.id,pg.namalengkap from loginuser_s as lu
                INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id
                where lu.id=:idLoginUser"),
            array(
                'idLoginUser' => $dataLogin['userData']['id'],
            )
        );

        $datapegawai = \DB::table('pegawai_m as pg')
            ->leftJoin('mappingpegawaitoatasan_m as mpa','mpa.objectpegawaifk','=','pg.id')
            ->leftJoin('pegawai_m as pg1','pg1.id','=','mpa.objectatasanlangsungfk')
            ->leftJoin('jabatan_m as jb','jb.id','=','mpa.objectatasanpejabatpenilaifk')
            ->leftJoin('satuankerja_m as sk','sk.id','=', 'pg.objectsatuankerjafk')
            ->leftJoin('unitkerjapegawai_m as ukp','ukp.id','=','pg.objectunitkerjapegawaifk')
            ->select('pg.id','pg.namalengkap as namaLengkap','pg1.namalengkap as namaatasan','jb.namajabatan',
                     'sk.id as idsatuankerja','sk.satuankerja','ukp.id as ukpid','ukp.name as unitkerja')
            ->where('pg.id',$request['pegawaiuser'])
            ->orWhere('pg1.id',$request['pegawaiuser'])
            ->where('pg.statusenabled',true)
            ->where('pg1.statusenabled',true)
            ->get();

        $result = array(
            'datalogin'=>$dataLogin,
            'pegawaiuser'=>$dataPegawaiUser,
            'datapegawai'=>$datapegawai,
            'message' => 'cepot',
        );
        return $this->respond($result);
    }

    public function SaveKeluhanPelanggan(Request $request) {
        DB::beginTransaction();
        $tglAyeuna = date('Y-m-d H:i:s');
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id',$dataLogin['userData']['id'])
            ->first();
        try{
        if ($request['data']['id']==''){
            $dataKeluhan = new KeluhanPelanggan();
            $idDK = KeluhanPelanggan::max('id');
            $norecDK = $dataKeluhan->generateNewId();
            $dataKeluhan->kdprofile = 0;
            $dataKeluhan->statusenabled = true;
            $dataKeluhan->id = $idDK + 1;
            $dataKeluhan->norec = $norecDK;

        }else{
            $dataKeluhan =  KeluhanPelanggan::where('id',$request['data']['id'])->first();
        }
          $dataKeluhan->alamat =  $request['data']['alamat'];
          $dataKeluhan->email =  $request['data']['email'];
          $dataKeluhan->keluhan = $request['data']['keluhan'];
          $dataKeluhan->namapasien = $request['data']['namapasien'];
          $dataKeluhan->norm =  $request['data']['norm'];
          $dataKeluhan->notlp =  $request['data']['notlp'];
          $dataKeluhan->objectruanganfk = $request['data']['objectruanganfk'];
          $dataKeluhan->saran = $request['data']['saran'];
          $dataKeluhan->objectpekerjaanfk = $request['data']['objectpekerjaanfk'];
          $dataKeluhan->umur = $request['data']['umur'];
          $dataKeluhan->tglkeluhan = $request['data']['tglkeluhan'];
//          $dataKeluhan->tglorder = $request['data']['tglorder'];
          $dataKeluhan->objectpegawaifk = (int)$dataPegawai->objectpegawaifk;//$request['data']['objectpegawaifk'];
          $dataKeluhan->notlpkntr = $request['data']['notlpkntr'];
          $dataKeluhan->save();
          $norecKeluhan = $dataKeluhan->norec;

        //## Logging User
        $newId = LoggingUser::max('id');
        $newId = $newId +1;
        $logUser = new LoggingUser();
        $logUser->id = $newId;
        $logUser->norec = $logUser->generateNewId();
        $logUser->kdprofile= 0;
        $logUser->statusenabled=true;
        $logUser->jenislog = 'Keluhan Pelanggan atas nama ' . $request['data']['namapasien'];
        $logUser->noreff = $norecKeluhan;
        $logUser->referensi='norec Keluhan Pelanggan';
        $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
        $logUser->tanggal = $tglAyeuna;
        $logUser->save();

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
                "norec" => $norecKeluhan,
                "as" => 'Cepot',
            );
        } else {
            $transMessage = "Simpan Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "norec" => $norecKeluhan,
                "as" => 'Cepot',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDaftarKeluhan (Request $request)
    {
        $data = \DB::table('keluhanpelanggan_m as kp')
            ->leftJoin('pasien_m as ps','ps.nocm','=','kp.norm')
            ->leftJoin('alamat_m as al','al.nocmfk','=','ps.id')
            ->leftJoin('pekerjaan_m as pkr','pkr.id','=','kp.objectpekerjaanfk')
            ->leftJoin('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
            ->leftJoin('jeniskelamin_m as jk1','jk1.id','=','kp.objectjeniskelaminfk')
            ->leftJoin('ruangan_m as ru','ru.id','=','kp.objectruanganfk')
            ->leftJoin('pegawai_m as pg','pg.id','=','kp.objectpegawaifk')
            ->select(DB::raw('kp.norec,kp.id as kpid,kp.tglkeluhan,kp.tglorder,
                         CASE WHEN ps.nocm = kp.norm then ps.nocm else kp.norm end as nocm,
			             CASE WHEN ps.nocm = kp.norm then ps.namapasien else kp.namapasien end as namapasien,
                         kp.umur,
                         CASE WHEN ps.nocm = kp.norm then al.alamatlengkap else kp.alamat end as alamat,
                         CASE WHEN ps.nocm = kp.norm then ps.notelepon else kp.notlp end as notlp,
                         CASE WHEN ps.nocm = kp.norm then jk.id else jk1.id end as jkid,
                         CASE WHEN ps.nocm = kp.norm then jk.jeniskelamin else jk1.jeniskelamin end as jeniskelamin,
                         ru.id as ruid,ru.namaruangan,kp.keluhan,kp.saran,pkr.id as pekerjaanid,pkr.pekerjaan,kp.notlpkntr,
                         pg.id as pegawaiid,pg.namalengkap','kp.email')
            );
        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('kp.tglkeluhan', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];
            $data = $data->where('kp.tglkeluhan', '<=', $tgl);
        }
        if (isset($request['noRm']) && $request['noRm'] != "" && $request['noRm'] != "undefined") {
            $data = $data->where('kp.norm', '=', $request['noRm']);
        }
        if (isset($request['namaPasien']) && $request['namaPasien'] != "" && $request['namaPasien'] != "undefined") {
            $data = $data->where('kp.namapasien', 'like', '%'. $request['namaPasien'].'%');
        }
        if (isset($request['IdKeluhan']) && $request['IdKeluhan'] != "" && $request['IdKeluhan'] != "undefined") {
            $data = $data->where('kp.id', '=', $request['IdKeluhan']);
        }

        $data = $data->where('kp.statusenabled',true);
        $data = $data->orderBy('kp.tglkeluhan', 'asc');
        $data = $data->get();

        $result = array(
            'datas'=>$data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function savePenangananKeluhan(Request $request)
    {
        $detLogin = $request->all();
        DB::beginTransaction();
        try{
            if ($request['data']['norec_pp'] == ''){
                $dataPP = new PenangananKeluhanPelanggan();
                $dataPP->kdprofile = 0;
                $dataPP->statusenabled = true;
                $dataPP->norec = $dataPP->generateNewId();
            }else{
                $dataPP =  PenangananKeluhanPelanggan::where('norec',$request['data']['norec_pp'])->first();
                $delPPD = PenangananKeluhanPelangganD::where('penanganankeluhanfk', $request['data']['norec_pp'])
                         ->delete();
            }
            $dataPP->email = $request['data']['email'];
            $dataPP->namapetugas = $request['data']['namapetugas'];
            $dataPP->objectpegawaifk = $request['data']['objectpegawaifk'];
            $dataPP->reply = $request['data']['reply']; //count tgl pasien perruanga
            $dataPP->keluhanpelangganfk = $request['data']['keluhanpelangganfk'];
            $dataPP->tglpenanganan=$request['data']['tglpenanganan'];
            $dataPP->save();
            $idPP=$dataPP->norec;

            $dataPPD = new PenangananKeluhanPelangganD();
            $dataPPD->norec = $dataPPD->generateNewId();;
            $dataPPD->kdprofile = 0;
            $dataPPD->statusenabled = true;
            $dataPPD->penanganankeluhanfk = $dataPP->norec;
            $dataPPD->hasilklarifikasi =$request['data']['reply'];
            $dataPPD->kesimpulankronologis =$request['data']['kesimpulanKronologis'];
            $dataPPD->tindaklanjut=$request['data']['tindakLanjut'];
            $dataPPD->respon=$request['data']['respon'];
            $dataPPD->solusikeluhan=$request['data']['solusikeluhan'];
            $dataPPD->kategorikomplain=$request['data']['kategorikomplain'];
            $dataPPD->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan Penangangan Keluhan Pelanggan";
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'noPenangangan' => $idPP,
                'message' => $transMessage,
                'as' => 'ea@epic',
            );
        } else {
            $transMessage = "Gagal Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'noPenangangan' => $idPP,
                'message'  => $transStatus,
                'as' => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveBatalKeluhan(Request $request){
        DB::beginTransaction();
        $tglAyeuna = date('Y-m-d H:i:s');
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id',$dataLogin['userData']['id'])
            ->first();
        try{

            $Kel = KeluhanPelanggan::where('id', $request['data']['kpid'])
                ->update([
                    'statusenabled' => 'f',
                ]);

            //## Logging User
            $newId = LoggingUser::max('id');
            $newId = $newId +1;
            $logUser = new LoggingUser();
            $logUser->id = $newId;
            $logUser->norec = $logUser->generateNewId();
            $logUser->kdprofile= 0;
            $logUser->statusenabled=true;
            $logUser->jenislog = 'Batal Keluhan Pelanggan';
            $logUser->noreff =$request['data']['norec'];
            $logUser->referensi='norec Keluhan Pelanggan';
            $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
            $logUser->tanggal = $tglAyeuna;
            $logUser->save();

        $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Batal Keluhan Gagal";
        }

        if ($transStatus == 'true') {
            $transMessage = "Batal Keluhan Berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'Mr.Cepot',
            );
        } else {
            $transMessage = "Batal Keluhan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transStatus,
                'as' => 'Mr.Cepot',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getJadwalDokterss(Request $request) {
        $data = \DB::table('jadwalpraktikdokter_m as jpd')
            ->leftjoin('ruangan_m as ruangan','ruangan.id','=','jpd.objectruanganfk')
            ->leftjoin('jadwalpraktek_m as jp','jp.id','=','jpd.objectjadwalpraktekfk')
            ->leftjoin('hari_m as hari','hari.id','=','jpd.objectharifk')
            ->leftjoin('pegawai_m as pgw','pgw.id','=','jpd.objectpegawaifk')

            ->select('ruangan.namaruangan as namaruangan','ruangan.id as idruangan',
                'jp.jampraktek as jampraktek', 'jp.id as idjampraktek',
                'hari.namahari as namahari', 'hari.id as idhari',
                'pgw.namalengkap as namalengkap','pgw.id as idpeg',
                'jpd.id as id','jpd.quota as quota')
            ->orderBy('hari.namahari','jp.jampraktek');

        if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
            $data = $data->where('ruangan.id', $request['ruangan']);
        }
        if(isset($request['hari']) && $request['hari']!="" && $request['hari']!="undefined"){
            $data = $data->where('hari.id', $request['hari']);
        }
        $data = $data->where('jpd.statusenabled',true);
        // $data = $data->take(100);
        $data = $data->get();
        return $this->respond($data);
    }

    public function getDaftarPenanganKeluhan (Request $request)
    {
        $data = \DB::table('keluhanpelanggan_m as kp')
            ->leftJoin('penanganankeluhanpelanggan_t as pkp','pkp.keluhanpelangganfk','=','kp.id')
            ->leftJoin('penanganankeluhanpelanggand_t as pkpd','pkpd.penanganankeluhanfk','=','pkp.norec')
            ->leftJoin('pasien_m as ps','ps.nocm','=','kp.norm')
            ->leftJoin('alamat_m as al','al.nocmfk','=','ps.id')
            ->leftJoin('pekerjaan_m as pkr','pkr.id','=','kp.objectpekerjaanfk')
            ->leftJoin('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
            ->leftJoin('jeniskelamin_m as jk1','jk1.id','=','kp.objectjeniskelaminfk')
            ->leftJoin('ruangan_m as ru','ru.id','=','kp.objectruanganfk')
            ->leftJoin('pegawai_m as pg','pg.id','=','kp.objectpegawaifk')
            ->select(DB::raw('kp.norec,kp.id as kpid,kp.tglkeluhan,kp.tglorder,
                         CASE WHEN ps.nocm = kp.norm then ps.nocm else kp.norm end as nocm,
			             CASE WHEN ps.nocm = kp.norm then ps.namapasien else kp.namapasien end as namapasien,
                         kp.umur,
                         CASE WHEN ps.nocm = kp.norm then al.alamatlengkap else kp.alamat end as alamat,
                         CASE WHEN ps.nocm = kp.norm then ps.notelepon else kp.notlp end as notlp,
                         CASE WHEN ps.nocm = kp.norm then jk.id else jk1.id end as jkid,
                         CASE WHEN ps.nocm = kp.norm then jk.jeniskelamin else jk1.jeniskelamin end as jeniskelamin,
                         ru.id as ruid,ru.namaruangan,kp.keluhan,kp.saran,pkr.id as pekerjaanid,pkr.pekerjaan,kp.notlpkntr,
                         pg.id as pegawaiid,pg.namalengkap,kp.email,pkp.reply,pkpd.hasilklarifikasi,pkpd.kesimpulankronologis,
                         pkpd.solusikeluhan,pkpd.tindaklanjut,pkpd.respon,pkp.norec as norec_pp,pkp.tglpenanganan,pkpd.kategorikomplain')
            );
        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('kp.tglkeluhan', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];
            $data = $data->where('kp.tglkeluhan', '<=', $tgl);
        }
        if (isset($request['noRm']) && $request['noRm'] != "" && $request['noRm'] != "undefined") {
            $data = $data->where('kp.norm', '=', $request['noRm']);
        }
        if (isset($request['namaPasien']) && $request['namaPasien'] != "" && $request['namaPasien'] != "undefined") {
            $data = $data->where('kp.namapasien', 'like', '%'. $request['namaPasien'].'%');
        }
        if (isset($request['IdKeluhan']) && $request['IdKeluhan'] != "" && $request['IdKeluhan'] != "undefined") {
            $data = $data->where('kp.id', '=', $request['IdKeluhan']);
        }

        $data = $data->where('pkp.statusenabled',true);
        $data = $data->orderBy('kp.tglkeluhan', 'asc');
        $data = $data->get();

        $result = array(
            'datas'=>$data,
            'message' => 'cepot',
        );
        return $this->respond($result);
    }

    public function saveBatalPenangananKeluhan(Request $request)
    {
        DB::beginTransaction();
        $tglAyeuna = date('Y-m-d H:i:s');
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id',$dataLogin['userData']['id'])
            ->first();
        try{

            $Kel = PenangananKeluhanPelanggan::where('norec', $request['data']['norec'])
                ->update([
                    'statusenabled' => 'f',
                ]);

            //## Logging User
            $newId = LoggingUser::max('id');
            $newId = $newId +1;
            $logUser = new LoggingUser();
            $logUser->id = $newId;
            $logUser->norec = $logUser->generateNewId();
            $logUser->kdprofile= 0;
            $logUser->statusenabled=true;
            $logUser->jenislog = 'Batal Penanganan Keluhan Pelanggan';
            $logUser->noreff =$request['data']['norec'];
            $logUser->referensi='norec Penanganan Keluhan Pelanggan';
            $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
            $logUser->tanggal = $tglAyeuna;
            $logUser->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Batal Penanganan Keluhan Gagal";
        }

        if ($transStatus == 'true') {
            $transMessage = "Batal Penanganan Keluhan Berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'Mr.Cepot',
            );
        } else {
            $transMessage = "Batal Penanganan Keluhan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transStatus,
                'as' => 'Mr.Cepot',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDataDokterCoy(Request $request) {
        $req=$request->all();
        $dataPenulis = \DB::table('pegawai_m as st')
            ->select('st.id','st.namalengkap','st.nip_pns')
            ->where('st.statusenabled',true)
            ->where('st.objectjenispegawaifk',1)
            ->orderBy('st.namalengkap');
        if(isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value']!="" &&
            $req['filter']['filters'][0]['value']!="undefined"){
            $dataPenulis = $dataPenulis->where('namalengkap','like', '%'.$req['filter']['filters'][0]['value'].'%' );
        };
        $dataPenulis = $dataPenulis->take(20);
        $dataPenulis = $dataPenulis->get();
        foreach ($dataPenulis as $item){
            $dataPenulis2[]=array(
                'id' => $item->id,
                'namalengkap' => $item->namalengkap,
            );
        }
        return $this->respond($dataPenulis2);
    }

    public function getDaftarMapKelompokKerjaToPegawai (Request $request)
    {
        $data = \DB::table('pegawai_m as pgw')
            ->Join('kelompokkerja_m as kk','kk.id','=','pgw.objectkelompokkerjafk')
            ->Join('kelompokkerjahead_m as kkh','kkh.id','=','kk.objectkelompokkerjahead')
            ->select(DB::raw('pgw.id as pgwid,pgw.namalengkap,kk.id as kkid,kk.kelompokkerja,kkh.id as kkhid,kkh.kelompokkerjahead')
            );

        if (isset($request['kkHead']) && $request['kkHead'] != "" && $request['kkHead'] != "undefined") {
            $data = $data->where('kkh.id', '=', $request['kkHead']);
        }
        if (isset($request['Kkerja']) && $request['Kkerja'] != "" && $request['Kkerja'] != "undefined") {
            $data = $data->where('kk.id', '=', $request['Kkerja']);
        }
        if (isset($request['PegawaiId']) && $request['PegawaiId'] != "" && $request['PegawaiId'] != "undefined") {
            $data = $data->where('pgw.id', '=', $request['PegawaiId']);
        }

        $data = $data->where('pgw.statusenabled',true);
        $data = $data->orderBy('kk.id', 'asc');
        $data = $data->get();

        $result = array(
            'datas'=>$data,
            'message' => 'cepot',
        );
        return $this->respond($result);
    }

    public function UpdaterObjectKelompokKerja(Request $request)
    {
        DB::beginTransaction();
        try {
            $dataPegawai = \App\Master\Pegawai::where('id', $request['idPegawai'])
                ->update([
                    'objectkelompokkerjafk' => $request['objectkelompokkerja'],
                ]);

            $transStatus = 'true';
        }catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Gagal";
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

    public function getDataViewBed(Request $request){

        $data= \DB::table('tempattidur_m as tt')
            ->leftjoin('kamar_m as km', 'km.id', '=', 'tt.objectkamarfk')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'km.objectruanganfk')
            ->leftjoin('statusbed_m as sb', 'sb.id', '=', 'tt.objectstatusbedfk')
            ->leftjoin('kelas_m as kl', 'kl.id', '=', 'km.objectkelasfk')
            ->leftjoin('statusbed_m as sb2', 'sb2.id', '=', 'tt.objectstatusbedfktriger')
            ->select('ru.id as idruangan','ru.namaruangan','km.id as idkamar','km.namakamar','tt.id as idtempattidur',
                'tt.reportdisplay','tt.nomorbed','sb.id as idstatusbed','sb.statusbed','kl.id as idkelas','kl.namakelas','tt.objectstatusbedfktriger'
                ,'sb2.id as id_kondisibed', 
                DB::raw('case when tt.objectstatusbedfktriger is null then \'Belum Siap Pakai\' else sb2.statusbed end as kondisibed'))
            ->whereIn('ru.objectdepartemenfk',array(16,35))
            ->where('ru.statusenabled',true)
            ->where('km.statusenabled',true)
            ->where('tt.statusenabled',true);
            // ->where('tt.objectstatusbedfktriger', 5);

        if(isset($request['namaruangan']) && $request['namaruangan']!="" && $request['namaruangan']!="undefined"){
            $data = $data->where('ru.namaruangan','like','%'. $request['namaruangan'] .'%');
        };
        if(isset($request['namakamar']) && $request['namakamar']!="" && $request['namakamar']!="undefined"){
            $data = $data->where('km.namakamar','like','%'. $request['namakamar'] .'%');
        };
        if(isset($request['idkelas']) && $request['idkelas']!="" && $request['idkelas']!="undefined"){
            $data = $data->where('kl.id', $request['idkelas']);
        };
        if(isset($request['namabed']) && $request['namabed']!="" && $request['namabed']!="undefined"){
            $data = $data->where('tt.reportdisplay','like','%'. $request['namabed'] .'%');
        };
        if(isset($request['idstatusbed']) && $request['idstatusbed']!="" && $request['idstatusbed']!="undefined"){
            $data = $data->where('sb.id', $request['idstatusbed']);
        };
        $data = $data->get();


        return $this->respond($data);
    }

    public function getRuanganPart(Request $request) {
        // $req=$request->all();
        // $data  = \DB::table('ruangan_m as st')
        //     ->select('st.id','st.namaruangan')
        //     ->where('st.statusenabled',true)
        //     ->orderBy('st.namaruangan');
        // if(isset($req['filter']['filters'][0]['value']) &&
        //     $req['filter']['filters'][0]['value']!="" &&
        //     $req['filter']['filters'][0]['value']!="undefined"){
        //     $data = $data->where('st.namaruangan','like','%'. $req['filter']['filters'][0]['value'].'%' );
        // };
        // if(isset($req['namaruangan']) && $req['namaruangan']!="" && $req['namaruangan']!="undefined"){
        //     $data = $data
        //         ->where('st.namaruangan','like','%'.$req['namaruangan'].'%' );
        // }
        // if(isset($req['idRuangan']) && $req['idRuangan']!="" && $req['idRuangan']!="undefined"){
        //     $data = $data
        //         ->where('st.id','=',$req['idRuangan'] );
        // }
        // $data = $data->take(10);
        // $data = $data->get();

        // return $this->respond($data);

        $req = $request->all();
        $dataProduk = \DB::table('ruangan_m')
            ->select('id', 'namaruangan')
            ->where('statusenabled', true)
            ->orderBy('namaruangan');
        if (isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined") {
            $dataProduk = $dataProduk->where('namaruangan', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%');
        };
        $dataProduk = $dataProduk->take(10);
        $dataProduk = $dataProduk->get();

        return $this->respond($dataProduk);
    }

    public function getComboDokter(Request $request){
        $kdJenisPegawaiDokter = $this->settingDataFixed('kdJenisPegawaiDokter');
        $req = $request->all();
        $data = \DB::table('pegawai_m')
            ->select('id','namalengkap')
            ->where('statusenabled', true)
            ->where('objectjenispegawaifk',$kdJenisPegawaiDokter)
            ->orderBy('namalengkap');

        if(isset($req['namalengkap']) &&
            $req['namalengkap']!="" &&
            $req['namalengkap']!="undefined"){
            $data = $data->where('namalengkap','like','%'. $req['namalengkap'] .'%' );
        };
        if(isset($req['idpegawai']) &&
            $req['idpegawai']!="" &&
            $req['idpegawai']!="undefined"){
            $data = $data->where('id', $req['idpegawai'] );
        };
        if(isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value']!="" &&
            $req['filter']['filters'][0]['value']!="undefined"){
            $data = $data
                ->where('namalengkap','like','%'.$req['filter']['filters'][0]['value'].'%' );
        }

        $data = $data->get();
        return $this->respond($data);
    }

    public function saveJadwalBulanan(Request $request) {
        DB::beginTransaction();
        try {
            foreach ($request['data'] as $item) {
                if ($request['id'] == '') {
                    $id = JadwalPraktekBulanan::max('id');
                    $dataJadwal = new JadwalPraktekBulanan();
                    $dataJadwal->id = $id + 1;
                    $dataJadwal->norec = $dataJadwal->generateNewId();
                    $dataJadwal->kdprofile = 0;
                    $dataJadwal->statusenabled = true;

                } else {
                    $dataJadwal = JadwalPraktekBulanan::where('id', $request['id'])->first();
                }
                $dataJadwal->reportdisplay = '';
                $dataJadwal->objectpegawaifk = $item['idpegawai'];
                $dataJadwal->objectruanganfk = $request['ruanganfk'];
                $dataJadwal->jammulai = $request['jammulai'];
                $dataJadwal->jamselesai = $request['jamselesai'];
                $dataJadwal->keterangan = $request['keterangan'];
                $dataJadwal->tglmulai = $item['tglmulai'];
                $dataJadwal->tglselesai = $item['tglselesai'];
                $dataJadwal->objectstatushadirfk = 1;//hadir $request['objectstatushadirfk'];
                $dataJadwal->save();
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Jadwal Dokter";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "res" => $dataJadwal,
                "as" => 'ramdanegie@epic',
            );
        } else {
            $transMessage = "Simpan Jadwal Dokter Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'ramdanegie@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveJadwalMingguan(Request $request) {
        DB::beginTransaction();
        try {
            foreach ($request['data'] as $item) {
                if ($request['id'] == '') {
                    $id = JadwalPraktekMingguan::max('id');
                    $dataJadwal = new JadwalPraktekMingguan();
                    $dataJadwal->id = $id + 1;
                    $dataJadwal->norec = $dataJadwal->generateNewId();
                    $dataJadwal->kdprofile = 0;
                    $dataJadwal->statusenabled = true;

                } else {
                    $dataJadwal = JadwalPraktekMingguan::where('id', $request['id'])->first();
                }
                $dataJadwal->reportdisplay = '';
                $dataJadwal->objectpegawaifk = $item['idpegawai'];
                $dataJadwal->objectruanganfk = $request['ruanganfk'];
                $dataJadwal->jammulai = $request['jammulai'];
                $dataJadwal->jamselesai = $request['jamselesai'];
                $dataJadwal->keterangan = $request['keterangan'];
                $dataJadwal->tglmulai = $item['tglmulai'];
                $dataJadwal->tglselesai = $item['tglselesai'];
                $dataJadwal->objectstatushadirfk = 1;//hadir $request['objectstatushadirfk'];
                $dataJadwal->save();
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Jadwal Dokter";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "res" => $dataJadwal,
                "as" => 'ramdanegie@epic',
            );
        } else {
            $transMessage = "Simpan Jadwal Dokter Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'ramdanegie@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    
    public function deleteJawdalDokterBulanan(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        DB::beginTransaction();
        try{
            foreach ($request['data'] as $item) {
                $Edit = JadwalPraktekBulanan::where('id', $item['id'])
                ->delete();
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = " PP PPD PPP";
        }
        if ($transStatus == 'true') {
            $transMessage = "Delete Pelayanan Pasien";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Delete Pelayanan Pasien Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function deleteJawdalDokterMingguan(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        DB::beginTransaction();
        try{
            foreach ($request['data'] as $item) {
                $Edit = JadwalPraktekMingguan::where('id', $item['id'])
                ->delete();
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = " PP PPD PPP";
        }
        if ($transStatus == 'true') {
            $transMessage = "Delete Pelayanan Pasien";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Delete Pelayanan Pasien Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getJadwalBulananDokter(Request $request){

        $data = \DB::table('jadwalpraktekbulanan_m as jd')
            ->join('pegawai_m as pg','pg.id','=','jd.objectpegawaifk')
            ->join('ruangan_m as ru','ru.id','=','jd.objectruanganfk')
            ->select('jd.*','pg.namalengkap','ru.namaruangan')
            ->where('jd.statusenabled', true)
            ->orderByRaw('pg.namalengkap,jd.tglmulai desc');


        if(isset($request['bulan']) &&
            $request['bulan']!="" &&
            $request['bulan']!="undefined"){
            $tgl = $request['bulan']  ;
            $data = $data->whereRaw("STUFF(CONVERT(varchar(10), jd.tglmulai,104),1,3,'')  ='$tgl' " );
        };
        if(isset($request['namalengkap']) &&
            $request['namalengkap']!="" &&
            $request['namalengkap']!="undefined"){
            $data = $data->where('pg.namalengkap','like','%'. $request['namalengkap'] .'%' );
        };
        if(isset($request['idRuangan']) &&
            $request['idRuangan']!="" &&
            $request['idRuangan']!="undefined"){
            $data = $data->where('ru.id','=', $request['idRuangan'] );
        };
        if(isset($request['idPegawai']) &&
            $request['idPegawai']!="" &&
            $request['idPegawai']!="undefined"){
            $idPegawai =$request['idPegawai'];
            $data = $data->whereRaw("pg.id in ( $idPegawai )");
        };

        $data = $data->get();
        return $this->respond($data);
    }
    public function getJadwalMingguanDokter(Request $request){

        $data = \DB::table('jadwalpraktekmingguan_m as jd')
            ->join('pegawai_m as pg','pg.id','=','jd.objectpegawaifk')
            ->join('ruangan_m as ru','ru.id','=','jd.objectruanganfk')
            ->select('jd.*','pg.namalengkap','ru.namaruangan', 
            (DB::raw("to_char(jd.tglmulai, 'dddd') as day")))
            ->where('jd.statusenabled', true)
            ->orderByRaw('pg.namalengkap,jd.tglmulai desc');


        if(isset($request['namalengkap']) &&
            $request['namalengkap']!="" &&
            $request['namalengkap']!="undefined"){
            $data = $data->where('pg.namalengkap','like','%'. $request['namalengkap'] .'%' );
        };
        if(isset($request['idRuangan']) &&
            $request['idRuangan']!="" &&
            $request['idRuangan']!="undefined"){
            $data = $data->where('ru.id','=', $request['idRuangan'] );
        };
        if(isset($request['idPegawai']) &&
            $request['idPegawai']!="" &&
            $request['idPegawai']!="undefined"){
            $idPegawai =$request['idPegawai'];
            $data = $data->whereRaw("pg.id in ( $idPegawai )");
        };

        $data = $data->get();
        return $this->respond($data);
    }

    public function getDaftarRegistrasiPasien(Request $request){

        $filter = $request->all();
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->join('antrianpasiendiperiksa_t as apd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftJoin('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            ->leftJoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pd.nostruklastfk')
            ->leftJoin('strukbuktipenerimaan_t as sbm', 'sbm.norec', '=', 'pd.nosbmlastfk')
            ->leftjoin('loginuser_s as lu', 'lu.id', '=', 'sbm.objectpegawaipenerimafk')
            ->leftjoin('pegawai_m as pgs', 'pgs.id', '=', 'lu.objectpegawaifk')
            ->leftjoin('pemakaianasuransi_t as pas', 'pas.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('batalregistrasi_t as br', 'br.pasiendaftarfk', '=', 'pd.norec')
            ->leftjoin('alamat_m as alm','alm.nocmfk','=','ps.id')
            ->select('pd.norec', 'pd.tglregistrasi', 'ps.nocm', 'pd.noregistrasi', 'ru.namaruangan', 'ps.namapasien', 'kp.kelompokpasien',
                    'pd.tglpulang', 'pd.statuspasien', 'sp.nostruk', 'sbm.nosbm', 'pg.id as pgid', 'pg.namalengkap as namadokter',
                    'pgs.namalengkap as kasir','pd.objectruanganlastfk as ruanganid','pas.nosep','br.norec as norec_br','alm.alamatlengkap',
                    'ps.notelepon','dept.namadepartemen as departemen')
            ->whereNull('br.norec');

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
            $data = $data->where('pd.noregistrasi', 'like', '%' . $filter['noreg'] . '%');
        }
        if (isset($filter['norm']) && $filter['norm'] != "" && $filter['norm'] != "undefined") {
            $data = $data->where('ps.nocm', 'like', '%' . $filter['norm'] . '%');
        }
        if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $data = $data->where('ps.namapasien', 'like', '%' . $filter['nama'] . '%');
        }
        if (isset($filter['jmlRows']) && $filter['jmlRows'] != "" && $filter['jmlRows'] != "undefined") {
            $data = $data->take($filter['jmlRows']);
        }
        $data = $data->orderBy('pd.noregistrasi');
        $data = $data->get();
        return $this->respond($data);
    }

    public function getDataAntrianPasien(Request $request){
        $filter = $request->all();
        $noreg = '';
        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
            $noreg = " AND pd.noregistrasi = '" .  $filter['noreg']."'";
        }
        $ruangId = '';
        if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
            $ruangId = ' AND apd.objectruanganfk = ' . $filter['ruangId'];
        }
        $namaRuangan = '';
        if (isset($filter['namaRuangan']) && $filter['namaRuangan'] != "" && $filter['namaRuangan'] != "undefined") {
            $ruangId = " AND ru.namaruangan like '%"  . $filter['namaRuangan']."%'";
        }
        $data = DB::select(DB::raw("select * from
                (select pd.tglregistrasi,pd.noregistrasi, ru.namaruangan,
                 pd.norec as norec_pd, apd.tglmasuk, apd.norec as norec_apd, 
                 row_number() over (partition by pd.noregistrasi order by apd.tglmasuk desc) as rownum 
                 from antrianpasiendiperiksa_t as apd
                 inner join pasiendaftar_t as pd on pd.norec = apd.noregistrasifk and pd.objectruanganlastfk = apd.objectruanganfk
                 left join batalregistrasi_t as br on br.pasiendaftarfk = pd.norec
                 inner join ruangan_m as ru on ru.id = apd.objectruanganfk
                 where br.norec is null 
                and pd.tglpulang is null
                $ruangId $noreg  $namaRuangan
              ) as x where x.rownum=1")
        );
        return $this->respond($data);
    }

    public function getDataInformasiPasienPulang(Request $request){
        $filter = $request->all();
        $data= \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as p', 'p.id', '=', 'pd.nocmfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftJoin('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            ->leftjoin('alamat_m as alm','alm.nocmfk','=','p.id')
            ->select('pd.norec','pd.tglregistrasi', 'p.nocm', 'pd.noregistrasi', 'ru.namaruangan', 'p.namapasien', 'kp.kelompokpasien',
                     'pd.tglpulang', 'pd.statuspasien','pd.nostruklastfk', 'pd.nosbmlastfk','dept.id as deptid','pd.tglclosing',
                     'alm.alamatlengkap','p.notelepon','dept.namadepartemen as departemen')
            ->where('pd.statusenabled',true)
            ->whereNotNull('pd.tglpulang');

        if(isset($filter['tglAwal']) && $filter['tglAwal']!="" && $filter['tglAwal']!="undefined"){
            $data = $data->where('pd.tglpulang','>=', $filter['tglAwal']);
        }
        if(isset($filter['tglAkhir']) && $filter['tglAkhir']!="" && $filter['tglAkhir']!="undefined"){
            $data = $data->where('pd.tglpulang','<=', $filter['tglAkhir']);
        }
        if(isset($filter['instalasiId']) && $filter['instalasiId']!="" && $filter['instalasiId']!="undefined"){
            $data = $data->where('dept.id','=', $filter['instalasiId']);
        }
        if(isset($filter['ruanganId']) && $filter['ruanganId']!="" && $filter['ruanganId']!="undefined"){
            $data = $data->where('ru.id','=', $filter['ruanganId']);
        }
        if(isset($filter['namaPasien']) && $filter['namaPasien']!="" && $filter['namaPasien']!="undefined"){
            $data = $data->where('p.namapasien','like', '%'.$filter['namaPasien'].'%');
        }
        if(isset($filter['noReg']) && $filter['noReg']!="" && $filter['noReg']!="undefined"){
            $data = $data->where('pd.noregistrasi','like', '%'.$filter['noReg'].'%');
        }
        if (isset($filter['noRm']) && $filter['noRm']!="" && $filter['noRm']!="undefined") {
            $data = $data->where('p.nocm','like','%'.$filter['noRm'].'%');
        }
        if (isset($filter['kelompokPasienId']) && $filter['kelompokPasienId']!="" && $filter['kelompokPasienId']!="undefined") {
            $data = $data->where('kp.id','=',$filter['kelompokPasienId']);
        }
        if(isset($filter['status']) && $filter['status']!="" && $filter['status']!="undefined"){
            if($filter['status']=='Belum Verifikasi'){
                $data = $data ->whereNull('pd.nostruklastfk')->whereNull('pd.nosbmlastfk');
            }elseif($filter['status']=='Verifikasi'){
                $data = $data ->whereNotNull('pd.nostruklastfk')->whereNull('pd.nosbmlastfk');
            }elseif($filter['status']=='Lunas'){
                $data = $data ->whereNotNull('pd.nostruklastfk')->whereNotNull('pd.nosbmlastfk');;
            }
        }
        if (isset($filter['jmlRows']) && $filter['jmlRows']!="" && $filter['jmlRows']!="undefined") {
            $data = $data->take($filter['jmlRows']);
        }
        $data =$data->get();

        $result = array();
        foreach ($data as $pasienD){
            $status="-";
            if ($pasienD->nostruklastfk == null && $pasienD->nosbmlastfk == null) {
                $status = "Belum Verifikasi";
            } elseif ($pasienD->nostruklastfk != null && $pasienD->nosbmlastfk == null) {
                $status = "Verifikasi";
            } elseif ($pasienD->nostruklastfk != null && $pasienD->nosbmlastfk != null) {
                $status = '-';//"Lunas";
            }
            $result[] = array(
                'tanggalMasuk'  =>$pasienD->tglregistrasi,
                'noCm'  =>$pasienD->nocm,
                'noRegistrasi'  =>$pasienD->noregistrasi,
                'namaRuangan'  =>$pasienD->namaruangan,
                'namaPasien'  =>$pasienD->namapasien,
                'jenisAsuransi'  =>$pasienD->kelompokpasien,
                'tanggalPulang' => $pasienD->tglpulang,
                'status'    =>  $status,
                'deptid' => $pasienD->deptid,
                'tglclosing' => $pasienD->tglclosing,
                'alamatlengkap'    =>  $pasienD->alamatlengkap,
                'notelepon' => $pasienD->notelepon,
                'departemen' => $pasienD->departemen,
            );
        }
        return $this->respond($result);
    }

    public function getDataInformasiPasien( Request $request) {
        $data = \DB::table('pasien_m as ps')
            ->leftjoin('alamat_m as alm','alm.nocmfk','=','ps.id')
            ->leftjoin('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
            ->select('ps.nocm','ps.namapasien','ps.tgldaftar', 'ps.tgllahir',
                'jk.jeniskelamin','ps.noidentitas','alm.alamatlengkap',
                'ps.id as nocmfk','ps.namaayah','ps.notelepon','ps.nohp','ps.tglmeninggal'
        );

        if(isset($request['tglLahir']) && $request['tglLahir']!="" && $request['tglLahir']!="undefined"){
            $data = $data->where('ps.tgllahir','>=', $request['tglLahir'].' 00:00');
        };
        if(isset($request['tglLahir']) && $request['tglLahir']!="" && $request['tglLahir']!="undefined"){
            $data = $data->where('ps.tgllahir','<=', $request['tglLahir'].' 23:59');
        };
        if(isset($request['norm']) && $request['norm']!="" && $request['norm']!="undefined") {
            $data = $data->where('ps.nocm', 'like', '%'. $request['norm'] .'%');
        };
        if(isset($request['namaPasien']) && $request['namaPasien']!="" && $request['namaPasien']!="undefined") {
            $data = $data->where('ps.namapasien', 'like', '%'. $request['namaPasien'] .'%');
        };
        if(isset($request['alamat']) && $request['alamat']!="" && $request['alamat']!="undefined") {
            $data = $data->where('alm.alamatlengkap', 'like', '%'. $request['alamat'] .'%');
        };
        if(isset($request['namaAyah']) && $request['namaAyah']!="" && $request['namaAyah']!="undefined"){
            $data = $data->where('ps.namaayah','=', $request['namaAyah']);
        };
        if (isset($request['jmlRows']) && $request['jmlRows']!="" && $request['jmlRows']!="undefined") {
            $data = $data->take($request['jmlRows']);
        };
        $data = $data->where('ps.statusenabled',true);
        $data=$data->get();
        $result = array(
            'daftar' => $data,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }

    public function getDataInformasiRiwayatRegistrasi( Request $request) {
        $data = \DB::table('pasien_m as ps')
            ->join('pasiendaftar_t as pd','pd.nocmfk','=','ps.id')
            ->join('ruangan_m as ru','ru.id','=','pd.objectruanganlastfk')
            ->leftjoin('pegawai_m as pg','pg.id','=','pd.objectpegawaifk')
            ->leftJoin('batalregistrasi_t as br','br.pasiendaftarfk','=','pd.norec')
            ->select(DB::raw("pd.tglregistrasi,ps.nocm,pd.noregistrasi,ps.namapasien,pd.objectruanganlastfk,ru.namaruangan,
			                  pd.objectpegawaifk,pg.namalengkap as namadokter,pd.tglpulang,ru.objectdepartemenfk,
			                  CASE when ru.objectdepartemenfk in (16,25,26) then 1 else 0 end as statusinap"))
            ->whereNull('br.pasiendaftarfk');
        if(isset($request['norm']) && $request['norm']!="" && $request['norm']!="undefined") {
            $data = $data->where('ps.nocm', 'like', '%'. $request['norm'] .'%');
        };
        if(isset($request['namaPasien']) && $request['namaPasien']!="" && $request['namaPasien']!="undefined") {
            $data = $data->where('ps.namapasien', 'like', '%'. $request['namaPasien'] .'%');
        };
        if(isset($request['noReg']) && $request['noReg']!="" && $request['noReg']!="undefined"){
            $data = $data->where('pd.noregistrasi','=', $request['noReg']);
        };
        if(isset($request['idRuangan']) && $request['idRuangan']!="" && $request['idRuangan']!="undefined"){
            $data = $data->where('pd.objectruanganlastfk','=', $request['idRuangan']);
        };

        $data = $data->where('ps.statusenabled',true);
        $data = $data->orderBy('pd.tglregistrasi');
        $data=$data->get();
        $result = array(
            'daftar' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getInformasiDataPasienDalamPerawatan (Request $request){
        ini_set('max_execution_time', 1000); //6 minutes
        $dataLogin = $request->all();
//        $tglAwal = $request['tglAwal'];
//        $tglAkhir = $request['tglAkhir'];
        $paramIdRuang = '';
        $paramKelompokPasien = '';
        $paramNoregistrasi='';
        $paramNoRM ='';
        $paramPasien ='';
        if (isset($request['ruangId']) && $request['ruangId'] != "" && $request['ruangId'] != "undefined") {
            $paramIdRuang = ' and ru.id='.$request['ruangId'] ;
        }
        if (isset($request['kelId']) && $request['kelId'] != "" && $request['kelId'] != "undefined") {
            $paramKelompokPasien = ' and kp.id='.$request['kelId'];
        }

        if (isset($request['noregistrasi']) && $request['noregistrasi'] != "" && $request['noregistrasi'] != "undefined") {
            $paramNoregistrasi =' and pd.noregistrasi ='.$request['noregistrasi'] ;
        }
        if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
            $paramNoRM = " and ps.nocm like '%".$request['nocm']."%'";
        }
        if (isset($request['namapasien']) && $request['namapasien'] != "" && $request['namapasien'] != "undefined") {
            $paramPasien = " and ps.namapasien like '%".$request['namapasien']."%'";
        }
        $data = \DB::select(DB::raw("
      
          SELECT DATEDIFF(day, pd.tglregistrasi,GETDATE()) AS hari,
                pd.tglregistrasi,pd.noregistrasi,ps.nocm,ps.namapasien,ru.namaruangan,kp.kelompokpasien,kls.namakelas,ps.tgllahir,
                sum((pp.hargasatuan * pp.jumlah) + case when pp.jasa is not null then pp.jasa else 0 end )as total,
                sUM(CASE WHEN (pp.produkfk = 402611) THEN pp.hargasatuan ELSE (0) END * pp.jumlah) AS deposit, 
                SUM(CASE WHEN (pp.hargadiscount IS NULL) THEN (0) ELSE pp.hargadiscount END) AS diskon,
                 sum((((pp.hargasatuan - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah) + case when pp.jasa is not null then pp.jasa else 0 end ) 
                 -(CASE WHEN (pp.produkfk = 402611) THEN pp.hargasatuan ELSE (0) END * pp.jumlah)) as totalkabeh, alm.alamatlengkap,ps.notelepon
                FROM
                    pasiendaftar_t AS pd
                INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
                inner join ruangan_m as ru on ru.id= pd.objectruanganlastfk
                inner join kelas_m as kls on kls.id= pd.objectkelasfk
                inner join kelompokpasien_m as kp on kp.id= pd.objectkelompokpasienlastfk
                inner join pasien_m as ps on ps.id= pd.nocmfk
                LEFT JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
                LEFT JOIN alamat_m AS alm ON alm.nocmfk = ps.id
                WHERE
                
                 pd.tglpulang is null
                $paramIdRuang
                $paramKelompokPasien
                $paramNoregistrasi
                $paramNoRM
                $paramPasien
                GROUP BY pd.tglregistrasi,pd.noregistrasi,ps.nocm,kls.namakelas,ps.tgllahir,
                ps.namapasien,ru.namaruangan,kp.kelompokpasien, alm.alamatlengkap,ps.notelepon
                order by pd.tglregistrasi"));
//            $data = \DB::table('v_pasiendalamperawatan as v');


        $result = array(
            'data' => $data,
            'message' => 'inhuman',
        );
        return $this->respond($result);
    }

    public function getDataInformasiPasienPerjanjian(Request $request){

        $filter = $request;
        $data = \DB::table('antrianpasienregistrasi_t as apr')
            ->leftJoin('pasien_m as pm','pm.id','=','apr.nocmfk')
            ->leftJoin('ruangan_m as ru','ru.id','=','apr.objectruanganfk')
            ->leftJoin('pegawai_m as pg','pg.id','=','apr.objectpegawaifk')
            ->leftJoin('kelompokpasien_m as kps','kps.id','=','apr.objectkelompokpasienfk')
            ->select('apr.norec','pm.nocm','apr.noreservasi','apr.tanggalreservasi','apr.objectruanganfk',
                'apr.objectpegawaifk','ru.namaruangan','apr.isconfirm','pg.namalengkap as dokter',
                'apr.notelepon','pm.namapasien','apr.namapasien','apr.objectkelompokpasienfk','kps.kelompokpasien',
                'apr.tglinput',
                DB::raw('(case when pm.namapasien is null then apr.namapasien else pm.namapasien end) as namapasien, 
                (case when apr.isconfirm=true then \'Confirm\' else \'Reservasi\' end) as status')
            )
            ->where('apr.noreservasi','<>','-')
            ->where('apr.statusenabled',true)
            ->whereNotNull('apr.noreservasi');

        if(isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('apr.tanggalreservasi', '>=', $filter['tglAwal']. " 00:00:00");
        }
        if(isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $data = $data->where('apr.tanggalreservasi', '<=', $filter['tglAkhir']. " 23:59:59" );
        }
        if(isset($filter['ruanganId']) && $filter['ruanganId'] != "" && $filter['ruanganId'] != "undefined") {
            $data = $data->where('ru.id','=',$filter['ruanganId']);
        }
        if(isset($filter['kdReservasi']) && $filter['kdReservasi'] != "" && $filter['kdReservasi'] != "undefined") {
            $data = $data->where('apr.noreservasi','=',$filter['kdReservasi']);
        }
        if(isset($filter['statusRev']) && $filter['statusRev'] == "Confirm" && $filter['statusRev'] == "Confirm" && $filter['statusRev'] == "Confirm") {
            $data = $data->where('apr.isconfirm','=',true);
        }
        if(isset($filter['statusRev']) && $filter['statusRev'] == "Reservasi" && $filter['statusRev'] == "Reservasi" && $filter['statusRev'] == "Reservasi") {
            $data = $data->whereNull('apr.isconfirm');
        }
        if(isset($filter['namapasienpm']) && $filter['namapasienpm'] != "" && $filter['namapasienpm'] != "undefined") {
            $data = $data->where('pm.namapasien','like','%'. $filter['namapasienpm'] .'%');
        }

        $data = $data->orderBy('apr.tanggalreservasi','asc');
        $data = $data->get();

        $result = array(
            'data' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getDetailPasien(Request $request) {
        $data = \DB::table('pasien_m as ps')
            ->leftJOIN('alamat_m as al','al.nocmfk','=','ps.id')
            ->leftJOIN('pekerjaan_m as pkr','pkr.id','=','ps.objectpekerjaanfk')
            ->leftJOIN('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
            ->select('ps.nocm','ps.namapasien','ps.notelepon','ps.tgllahir','al.alamatlengkap','pkr.id as pekerjaanid','pkr.pekerjaan','jk.id as jkid',
                'jk.jeniskelamin','al.alamatemail')
            ->where('ps.statusenabled',true);
        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('ps.nocm', $request['nocm'] );
        };
        $data = $data->first();
        return $this->respond($data);
    }

    public function getInformasiDataPasienDalamPerawatanKeswamas (Request $request){
        ini_set('max_execution_time', 1000); //6 minutes
        $dataLogin = $request->all();
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $paramIdRuang = '';
        $paramKelompokPasien = '';
        $paramNoregistrasi='';
        $paramNoRM ='';
        $paramPasien ='';
        $paramAlamat ='';
        if (isset($request['ruangId']) && $request['ruangId'] != "" && $request['ruangId'] != "undefined") {
            $paramIdRuang = ' and ru.id='.$request['ruangId'] ;
        }
        if (isset($request['kelId']) && $request['kelId'] != "" && $request['kelId'] != "undefined") {
            $paramKelompokPasien = ' and kp.id='.$request['kelId'];
        }

        if (isset($request['noregistrasi']) && $request['noregistrasi'] != "" && $request['noregistrasi'] != "undefined") {
            $paramNoregistrasi =' and pd.noregistrasi ='.$request['noregistrasi'] ;
        }
        if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
            $paramNoRM = " and ps.nocm like '%".$request['nocm']."%'";
        }
        if (isset($request['namapasien']) && $request['namapasien'] != "" && $request['namapasien'] != "undefined") {
            $paramPasien = " and ps.namapasien like '%".$request['namapasien']."%'";
        }
        if (isset($request['alamat']) && $request['alamat'] != "" && $request['alamat'] != "undefined") {
            $paramPasien = " and alm.alamatlengkap like '%".$request['alamat']."%'";
        }
        $data = \DB::select(DB::raw("
      
          SELECT DATEDIFF(day, pd.tglregistrasi,GETDATE()) AS hari,
                pd.tglregistrasi,pd.noregistrasi,ps.nocm,ps.namapasien,ru.namaruangan,kp.kelompokpasien,kls.namakelas,ps.tgllahir, jk.jeniskelamin, alm.alamatlengkap, ps.penanggungjawab
                FROM
                    pasiendaftar_t AS pd
                INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
                inner join ruangan_m as ru on ru.id= pd.objectruanganlastfk
                inner join kelas_m as kls on kls.id= pd.objectkelasfk
                inner join kelompokpasien_m as kp on kp.id= pd.objectkelompokpasienlastfk
                inner join pasien_m as ps on ps.id= pd.nocmfk
                INNER JOIN jeniskelamin_m AS jk ON jk.id = ps.objectjeniskelaminfk
                LEFT JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
                LEFT JOIN alamat_m AS alm ON alm.nocmfk = ps.id
                WHERE
                
                 pd.tglpulang is null
                $paramIdRuang
                $paramKelompokPasien
                $paramNoregistrasi
                $paramNoRM
                $paramPasien
                AND pd.tglregistrasi BETWEEN '$tglAwal' AND '$tglAkhir'
                GROUP BY pd.tglregistrasi,pd.noregistrasi,ps.nocm,kls.namakelas,ps.tgllahir,
                ps.namapasien,ru.namaruangan,kp.kelompokpasien, jk.jeniskelamin, alm.alamatlengkap, ps.penanggungjawab
                order by pd.tglregistrasi"));
//            $data = \DB::table('v_pasiendalamperawatan as v');


        $result = array(
            'data' => $data,
            'message' => 'inhuman',
        );
        return $this->respond($result);
    }

    public function getDataEvaluasiPasienKontrol(Request $request)
    {
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];


        $nama =  ' ';
        if (isset($request['nama']) && $request['nama'] != "" && $request['nama'] != "undefined") {
            $nama =  " AND ps.namapasien LIKE '%" . $request['nama']."%'";
        }

        $norm =  ' ';
        if (isset($request['norm']) && $request['norm'] != "" && $request['norm'] != "undefined") {
            $norm =  " AND ps.nocm LIKE '%" . $request['norm']."%'";
        }

        $data = DB::select(DB::raw("
                        SELECT
                        CONVERT (VARCHAR, pd.tglpulang, 105) AS tglpulang,
                        pd.noregistrasi,
                        ps.nocm,
                        ps.namapasien,
                        ru2.namaruangan AS ruanganlast,
                        (
                            SELECT TOP 1 SUBSTRING(CONVERT(VARCHAR, pd2.tglregistrasi, 105), 1, 10)
                            FROM pasiendaftar_t AS pd2
                            INNER JOIN pasien_m AS ps2 ON ps2.id = pd2.nocmfk
                            INNER JOIN ruangan_m AS ru ON ru.id = pd2.objectruanganlastfk
                            INNER JOIN departemen_m AS dpt ON dpt.id = ru.objectdepartemenfk
                            WHERE ps2.nocm = ps.nocm AND dpt.id = 18 AND pd2.tglregistrasi > pd.tglpulang
                            ORDER BY pd2.tglregistrasi DESC
                        ) AS tglkontrolterakhir,
                        (
                            SELECT TOP 1 ru.namaruangan
                            FROM pasiendaftar_t AS pd2 
                            INNER JOIN pasien_m AS ps2 ON ps2.id = pd2.nocmfk
                            INNER JOIN ruangan_m AS ru ON ru.id = pd2.objectruanganlastfk
                            INNER JOIN departemen_m AS dpt ON dpt.id = ru.objectdepartemenfk
                            WHERE ps2.nocm = ps.nocm AND dpt.id = 18 AND pd2.tglregistrasi > pd.tglpulang
                            ORDER BY pd2.tglregistrasi DESC
                        ) AS ruangankontrolterakhir,
                        CASE
                        WHEN dpt2.id = 16 THEN
                        'Rawat Inap'
                        WHEN dpt2.id = 24 THEN
                        'Gawat Darurat'
                        ELSE
                        'Rawat Jalan'
                        END AS jenispelayanan,
                        kp.kelompokpasien AS tipepasien,
                        pd.statuspasien AS jenispasien,
                        ps.nohp,
                        jk.jeniskelamin,
                        ag.agama,
                        pend.pendidikan,
                        pkr.pekerjaan,
                        sp.statusperkawinan,
                        kl.namakelas,
                        CASE
                        WHEN pc.ALAMAT IS NULL THEN
                        ps.alamatrmh
                        ELSE
                        REPLACE(
                            REPLACE(pc.ALAMAT, CHAR(13), ''),
                            CHAR (10),
                            ''
                        )
                        END AS alamat,
                        CASE
                        WHEN kel.KELURAHANI IS NULL THEN
                        dsk.namadesakelurahan
                        ELSE
                        LTRIM(RTRIM(kel.KELURAHANI))
                        END AS kelurahan,
                        CASE
                        WHEN kec.KECAMATANI IS NULL THEN
                        kcm.namakecamatan
                        ELSE
                        LTRIM(RTRIM(kec.KECAMATANI))
                        END AS kecamatan,
                        CASE
                        WHEN kab.KABUPATENI IS NULL THEN
                        kb.namakotakabupaten
                        ELSE
                        LTRIM(RTRIM(kab.KABUPATENI))
                        END AS kabupaten,
                        ps.tgllahir,
                        CASE
                        WHEN ps.penanggungjawab IS NULL THEN
                        ''
                        ELSE
                        ps.penanggungjawab
                        END AS penanggungjawab
                        FROM
                        antrianpasiendiperiksa_t AS apd
                        INNER JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk
                        INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                        INNER JOIN ruangan_m AS ru2 ON ru2.id = pd.objectruanganlastfk
                        INNER JOIN departemen_m AS dpt2 ON dpt2.id = ru2.objectdepartemenfk
                        LEFT JOIN asuransipasien_m AS ap ON ap.nocmfk = ps.id
                        LEFT JOIN kelompokpasien_m AS kp ON kp.id = pd.objectkelompokpasienlastfk
                        LEFT JOIN jeniskelamin_m AS jk ON jk.id = ps.objectjeniskelaminfk
                        LEFT JOIN agama_m AS ag ON ag.id = ps.objectagamafk
                        LEFT JOIN pendidikan_m AS pend ON pend.id = ps.objectpendidikanfk
                        LEFT JOIN pekerjaan_m AS pkr ON pkr.id = ps.objectpekerjaanfk
                        LEFT JOIN statusperkawinan_m AS sp ON sp.id = ps.objectstatusperkawinanfk
                        LEFT JOIN alamat_m AS alm ON alm.nocmfk = ps.id
                        LEFT JOIN desakelurahan_m AS dsk ON dsk.id = alm.objectdesakelurahanfk
                        LEFT JOIN kecamatan_m AS kcm ON kcm.id = alm.objectkecamatanfk
                        LEFT JOIN kotakabupaten_m AS kb ON kb.id = alm.objectkotakabupatenfk
                        LEFT JOIN PASIEN_copy AS pc ON pc.nocmfk = ps.id
                        LEFT JOIN KELURAHANI AS kel ON kel.KD_KELURAHANI = pc.KD_KELURAHAN
                        LEFT JOIN KECAMATANI AS kec ON kec.KD_KECAMATANI = kel.KD_KECAMATAN
                        LEFT JOIN KABUPATENI AS kab ON kab.KD_KABUPATENI = kec.KD_KABUPATEN
                        LEFT JOIN batalregistrasi_t AS br ON br.pasiendaftarfk = pd.norec
                        LEFT JOIN kelas_m AS kl ON kl.id = pd.objectkelasfk
                        WHERE
                        pd.tglpulang BETWEEN '$tglAwal'
                        AND '$tglAkhir' 
                        AND dpt2.id = 16 $nama $norm
                        GROUP BY
                        pd.tglpulang,
                        pd.noregistrasi,
                        ps.nocm,
                        ps.namapasien,
                        ru2.namaruangan,
                        dpt2.id,
                        kp.kelompokpasien,
                        pd.statuspasien,
                        ps.nohp,
                        ps.tgllahir,
                        jk.jeniskelamin,
                        ag.agama,
                        pend.pendidikan,
                        pkr.pekerjaan,
                        sp.statusperkawinan,
                        pc.ALAMAT,
                        kel.KELURAHANI,
                        kec.KECAMATANI,
                        kab.KABUPATENI,
                        ps.alamatrmh,
                        dsk.namadesakelurahan,
                        kcm.namakecamatan,
                        kb.namakotakabupaten,
                        ps.penanggungjawab,
                        kl.namakelas
                        ORDER BY
                        pd.tglpulang ASC"));

        $result = array(
            'data' => $data,
            'message' => 'dy',
        );
        return $this->respond($result);
    }

    public function getLaporanPasienKontrol(Request $request)
    {
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];


        $nama =  ' ';
        if (isset($request['nama']) && $request['nama'] != "" && $request['nama'] != "undefined") {
            $nama =  " AND ps.namapasien LIKE '%" . $request['nama']."%'";
        }

        $norm =  ' ';
        if (isset($request['norm']) && $request['norm'] != "" && $request['norm'] != "undefined") {
            $norm =  " AND ps.nocm LIKE '%" . $request['norm']."%'";
        }

        $data = DB::select(DB::raw("
                            SELECT
                            CONVERT (VARCHAR, pd.tglpulang, 105) AS tglpulang,
                            pd.noregistrasi,
                            ps.nocm,
                            ps.namapasien,
                            ru2.namaruangan AS ruanganlast,
                            kp.kelompokpasien AS tipepasien,
                            pd.statuspasien AS jenispasien,
                            ps.nohp,
                            jk.jeniskelamin,
                            kl.namakelas,
                            CASE
                            WHEN pc.ALAMAT IS NULL THEN
                            ps.alamatrmh
                            ELSE
                            REPLACE(
                            REPLACE(pc.ALAMAT, CHAR(13), ''),
                            CHAR (10),
                            ''
                            )
                            END AS alamat,
                            ps.tgllahir,
                            CASE
                            WHEN ps.penanggungjawab IS NULL THEN
                            ''
                            ELSE
                            ps.penanggungjawab
                            END AS penanggungjawab,
                            so.tglkontrol
                            FROM
                            antrianpasiendiperiksa_t AS apd
                            INNER JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk
                            INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                            INNER JOIN ruangan_m AS ru2 ON ru2.id = pd.objectruanganlastfk
                            LEFT JOIN kelompokpasien_m AS kp ON kp.id = pd.objectkelompokpasienlastfk
                            LEFT JOIN jeniskelamin_m AS jk ON jk.id = ps.objectjeniskelaminfk
                            LEFT JOIN alamat_m AS alm ON alm.nocmfk = ps.id
                            LEFT JOIN PASIEN_copy AS pc ON pc.nocmfk = ps.id
                            LEFT JOIN kelas_m AS kl ON kl.id = pd.objectkelasfk
                            INNER JOIN strukorder_t AS so ON so.noregistrasifk = pd.norec
                            WHERE
                            so.tglkontrol BETWEEN '$tglAwal'
                            AND '$tglAkhir' $nama $norm
                            GROUP BY
                            pd.tglpulang,
                            pd.noregistrasi,
                            ps.nocm,
                            ps.namapasien,
                            ru2.namaruangan,
                            kp.kelompokpasien,
                            pd.statuspasien,
                            ps.nohp,
                            ps.tgllahir,
                            jk.jeniskelamin,
                            pc.ALAMAT,
                            ps.alamatrmh,
                            ps.penanggungjawab,
                            kl.namakelas,
                            so.tglkontrol
                            ORDER BY
                            tglkontrol ASC"));

        $result = array(
            'data' => $data,
            'message' => 'dy',
        );
        return $this->respond($result);
    }
}
