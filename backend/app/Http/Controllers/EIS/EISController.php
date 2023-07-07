<?php
/**
 * Created by PhpStorm.
 * User: Egie Ramdan
 * Date: 10/4/2019
 * Time: 1:40 PM
 */


namespace App\Http\Controllers\EIS;

use App\Http\Controllers\ApiController;
use App\Master\JenisIndikator;
use App\Master\KelompokTransaksi;
use App\Master\MapBkutoKelompokTransaksi;
use App\Master\Pasien;
use App\Master\SettingDataFixed;
use App\Master\TargetIndikator;
use App\Transaksi\ruanganindikatorrensar;
use App\Transaksi\IndikatorPasienJatuh;
use App\Transaksi\IndikatorRensar;
use App\Transaksi\IndikatorRensarDetail;
use App\Transaksi\PasienDaftar;
use App\Transaksi\PelayananPasien;
use App\Transaksi\MataAnggaran;
use Carbon\Carbon;
use Illuminate\Http\Request;
use DB;
use App\Master\Ruangan;
use App\Traits\Valet;
use Jimmyjs\ReportGenerator\ReportMedia\PdfReport;

class EISController extends ApiController
{
    use Valet;

    public function __construct() {
        parent::__construct($skip_authentication=true);
    }

    public function getPasienRawatJalan(Request $request)
    {
        $dataLogin = $request->all();
        $tglAwal = date('Y-m-d'.' 00:00');
        $tglAkhir = date('Y-m-d'.' 23:59');
        $depRawatJalan = 18;
        $depRehabMedik = 28;
        $data = DB::select(DB::raw("select count(x.noregistrasi) as jumlah  
            from ( select pd.noregistrasi,pd.tglregistrasi
            from pasiendaftar_t as pd 
            inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk =pd.norec
            inner join ruangan_m as ru on ru.id = apd.objectruanganfk 
            where ru.objectdepartemenfk ='$depRawatJalan'
            and  pd.tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir'
            GROUP BY pd.tglregistrasi, pd.noregistrasi) as x
            "));
        foreach ($data as $item){
            $dataResult = array(
                'jumlahData' => $item->jumlah
            );
        }

        $result = array(
            'result' => $dataResult,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);

    }
    public function getPasienIGDTerlayani(Request $request)
    {
        $dataLogin = $request->all();
        $tglAwal = date('Y-m-d'.' 00:00');
        $tglAkhir = date('Y-m-d'.' 23:59');
        $igd= 36;
        $data = DB::select(DB::raw("select count(x.noregistrasi) as jumlah, count (x.terlayani) as  terlayani ,
                count (x.tidakterlayani) as  tidakterlayani 
                from (
                select DISTINCT pd.noregistrasi,pd.tglregistrasi, ps.nocm,ps.namapasien,
                ru.namaruangan, case when pp.norec is null then 'tidak terlayani' end as tidakterlayani,
                case when pp.norec is not null  then 'terlayani' end as terlayani
                 from pasiendaftar_t as pd 
                inner join ruangan_m as ru on ru.id = pd.objectruanganlastfk
                inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec and pd.objectruanganlastfk=ru.id
                left join pelayananpasien_t as pp on pp.noregistrasifk =apd.norec
                inner join pasien_m as ps on ps.id = pd.nocmfk
                where 
                ru.id ='$igd'
                and  pd.tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir'
                GROUP BY pd.tglregistrasi, ps.nocm,ps.namapasien,ru.namaruangan ,pd.noregistrasi, pp.norec
                ) as x;  "));
        foreach ($data as $item){
            if( (float) $item->jumlah > 0){
                $dataResult = array(
                    'jumlahData' => (float)$item->jumlah,
                    'terlayani' => (float)$item->terlayani / (float)$item->jumlah * 100 .' %',
                    'tidakTerlayani' => (float) $item->tidakterlayani /(float) $item->jumlah * 100 .' %'
                );
            }else{
                $dataResult = array(
                    'jumlahData' => 0,
                    'terlayani' => 0 .' %',
                    'tidakTerlayani' =>  0 .' %'
                );
            }
        }

        $result = array(
            'result' => $dataResult,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getPasienRawatInap(Request $request)
    {
        $dataLogin = $request->all();
        $tglAwal = date('Y-m-d'.' 00:00');
        $tglAkhir = date('Y-m-d'.' 23:59');
        $deptRawatInap = 16;
        $data = DB::select(DB::raw("select count(x.noregistrasi) as jumlah  
            from ( select distinct pd.noregistrasi,pd.tglregistrasi
            from pasiendaftar_t as pd 
            inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
            inner join ruangan_m as ru on ru.id = apd.objectruanganfk
            where ru.objectdepartemenfk ='$deptRawatInap'
            and pd.tglpulang
          --  and  pd.tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir'
            GROUP BY pd.tglregistrasi, pd.noregistrasi) as x
            "));

        foreach ($data as $item){
            $dataResult = array(
                'jumlahData' => (float) $item->jumlah
            );
        }

        $result = array(
            'result' => $dataResult,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getPasienRadiologi(Request $request)
    {
        $dataLogin = $request->all();
        $tglAwal = date('Y-m-d'.' 00:00');
        $tglAkhir = date('Y-m-d'.' 23:59');
        $depRadiologi = 27;
        $data = DB::select(DB::raw("select count(x.noregistrasi) as jumlah  
            from ( select DISTINCT pd.noregistrasi,pd.tglregistrasi
            from pasiendaftar_t as pd 
            inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
            inner join ruangan_m as ru on ru.id = apd.objectruanganfk
            where ru.objectdepartemenfk = '$depRadiologi'
            and  pd.tglregistrasi BETWEEN   '$tglAwal' and '$tglAkhir'
            GROUP BY pd.tglregistrasi, pd.noregistrasi) as x;
            "));
        foreach ($data as $item){
            $dataResult = array(
                'jumlahData' =>(float)  $item->jumlah
            );
        }

        $result = array(
            'result' => $dataResult,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }

    public function getPasienLaborat(Request $request)
    {
        $dataLogin = $request->all();
        $tglAwal = date('Y-m-d'.' 00:00');
        $tglAkhir = date('Y-m-d'.' 23:59');
        $depRadiologi = 3;
        $data = DB::select(DB::raw("select count(x.noregistrasi) as jumlah  
            from ( select DISTINCT pd.noregistrasi,pd.tglregistrasi
            from pasiendaftar_t as pd 
            inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
            inner join ruangan_m as ru on ru.id = apd.objectruanganfk
            where ru.objectdepartemenfk = '$depRadiologi'
            and  pd.tglregistrasi BETWEEN   '$tglAwal' and '$tglAkhir'
            GROUP BY pd.tglregistrasi, pd.noregistrasi) as x;
            "));
        foreach ($data as $item){
            $dataResult = array(
                'jumlahData' =>(float)  $item->jumlah
            );
        }

        $result = array(
            'result' => $dataResult,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getPasienOperasi(Request $request)
    {
        $dataLogin = $request->all();
        $tglAwal = date('Y-m-d'.' 00:00');
        $tglAkhir = date('Y-m-d'.' 23:59');
        $depBedah = 25;
        $data = DB::select(DB::raw("
                select count(x.noregistrasi) as jumlah,
                 count(*) FILTER (WHERE x.keterangan = 'pasien bedah') AS operasi,
                 count(*) FILTER (WHERE x.keterangan = 'pasien non bedah') AS nonoperasi
                from ( 
                select distinct pd.noregistrasi,pd.tglregistrasi,ru.objectdepartemenfk ,
                CASE
                WHEN (ru.objectdepartemenfk = 25) THEN 'pasien bedah'::text
                ELSE 'pasien non bedah'::text
                END AS keterangan from pasiendaftar_t as pd 
                inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk =pd.norec
                inner join ruangan_m as ru on ru.id = apd.objectruanganfk 
        -- 		where ru.objectdepartemenfk = 25
                and  pd.tglregistrasi BETWEEN   '$tglAwal' and '$tglAkhir'
                GROUP BY pd.tglregistrasi, pd.noregistrasi,ru.objectdepartemenfk
                order by pd.noregistrasi
                ) as x

            "));
        foreach ($data as $item){
            if ((float)$item->jumlah > 0){
                $dataResult = array(
                    'jumlahPasien' =>(float) $item->jumlah,
                    'operasi' =>(float)  $item->operasi,
                    'nonOperasi' => (float) $item->nonoperasi,
                    'percenOperasi' => (float) $item->operasi / (float) $item->jumlah * 100 .' %',
                    'percenNonOperasi' =>  (float) $item->nonoperasi / (float) $item->jumlah * 100 .' %'
                );
            }else{
                $dataResult = array(
                    'jumlahPasien' => 0,
                    'operasi' =>0,
                    'nonOperasi' => 0,
                    'percenOperasi' => 0 .' %',
                    'percenNonOperasi' =>  0 .' %'
                );
            }
        }

        $result = array(
            'result' => $dataResult,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }

    public function getPasienRehabMedik(Request $request)
    {
        $dataLogin = $request->all();
        $tglAwal = date('Y-m-d'.' 00:00');
        $tglAkhir = date('Y-m-d'.' 23:59');
        $depRehabMedik = 28;
        $data = DB::select(DB::raw("select count(x.noregistrasi) as jumlah  
            from ( select distinct pd.noregistrasi,pd.tglregistrasi
            from pasiendaftar_t as pd 
            inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk =pd.norec
            inner join ruangan_m as ru on ru.id = apd.objectruanganfk 
            where 
            ru.objectdepartemenfk = '$depRehabMedik'
            and  pd.tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir'
            GROUP BY pd.tglregistrasi, pd.noregistrasi) as x
            "));
        foreach ($data as $item){
            $dataResult = array(
                'jumlahData' => (float)$item->jumlah
            );
        }

        $result = array(
            'result' => $dataResult,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }

    public function getKunjunganRS(Request $request)
    {
        $dataLogin = $request->all();
        $tglAwal =  $request['tgl'].' 00:00'; //Carbon::now()->startOfMonth()->subMonth(1);
        $tglAkhir =  $request['tgl'].' 23:59';
        $bulan = Carbon::now()->format('F');
        $data = DB::select(DB::raw("select count(x.noregistrasi) as total  ,
                         count(case when x.keterangan = 'Instalasi Rawat Jalan' then 1 end) AS rawatjalan,
                         count(case when x.keterangan = 'Instalasi Rehabilitasi Medik' then 1 end) AS rehabmedik,
                         count(case when x.keterangan = 'Instalasi Rawat Inap' then 1 end) AS rawatinap,
                         count(case when x.keterangan = 'Instalasi Radiologi' then 1 end) AS radiologi,
                         count(case when x.keterangan = 'Instalasi Laboratorium' then 1 end) AS laboratorium,
                         count(case when x.keterangan = 'Instalasi Gawat Darurat' then 1 end) AS igd
                         from ( 
                                    select DISTINCT pd.noregistrasi,pd.tglregistrasi,
                                    case when ru.objectdepartemenfk = 18 and br.norec is null then 'Instalasi Rawat Jalan'
                                    when ru.objectdepartemenfk = 28 and br.norec is null then 'Instalasi Rehabilitasi Medik'
                                    when ru.objectdepartemenfk in ( 16,17, 35, 26) and br.norec is null then 'Instalasi Rawat Inap'
                                    when ru.objectdepartemenfk =27 and br.norec is null then 'Instalasi Radiologi'
                                    when ru.objectdepartemenfk = 3  and br.norec is null then 'Instalasi Laboratorium'
                                    when ru.objectdepartemenfk = 24 and br.norec is null then 'Instalasi Gawat Darurat'
                                    end as keterangan
                                    from pasiendaftar_t as pd 
                                    inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk =pd.norec
                                     left join batalregistrasi_t as br on br.pasiendaftarfk =pd.norec
                                    inner join ruangan_m as ru on ru.id = apd.objectruanganfk 
                                    and  pd.tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir'
                                    GROUP BY pd.tglregistrasi, pd.noregistrasi, br.norec,
                                    ru.objectdepartemenfk  
                                  --  order by pd.noregistrasi
                         ) as x;
            "));
        foreach ($data as $item){
            $datas = array(
                'total' =>  (int)$item->total,
                'rawatjalan' =>  (int)$item->rawatjalan,
                'rawatinap' =>  (int)$item->rawatinap,
                'rehabmedik' =>  (int)$item->rehabmedik,
                'radiologi' =>  (int)$item->radiologi,
                'laboratorium' =>  (int)$item->laboratorium,
                'igd' =>  (int)$item->igd,
            );
        }
        $result = array(
            'result' => $datas,
            'bulan' => $bulan,
            'message' => 'ramdanegie',

        );
        return $this->respond($datas);
    }

    public function getTopTenDiagnosa(Request $request)
    {
        // $dataLogin = $request->all();
        $tglAwal =  $request['tgl'].' 00:00'; //Carbon::now()->startOfMonth()->subMonth(1);
        $tglAkhir =  $request['tgl'].' 23:59';
        // $tglAwal =Carbon::now()->format('Y-m-d 00:00');;// Carbon::now()->startOfMonth();//  Carbon::now()->subMonth(1);
        // $tglAkhir = Carbon::now()->format('Y-m-d 23:59');

        $bulan = Carbon::now()->format('F');
        $paramProp = '';
        $paramKota ='';
        $paramKec = '';
        if(isset($request['propinsiId']) && $request['propinsiId']!=''&& $request['propinsiId']!='undefined'){
            $paramProp = ' and pro.id='.$request['propinsiId'];
        }
        if(isset($request['kotaId']) && $request['kotaId']!=''&& $request['kotaId']!='undefined'){
            $paramKota = ' and kot.id='.$request['kotaId'];
        }
        if(isset($request['kecamatanId']) && $request['kecamatanId']!='' && $request['kecamatanId']!='undefined'){
            $paramKec = ' and kec.id='.$request['kecamatanId'];
        }
        $data = DB::select(DB::raw("select * from (
                select count(x.kddiagnosa)as jumlah,x.kddiagnosa,x.namadiagnosa
                from (select dm.kddiagnosa, 
                dm.namadiagnosa
                from antrianpasiendiperiksa_t as app
                left join diagnosapasien_t as dp on dp.noregistrasifk = app.norec
                left join detaildiagnosapasien_t as ddp on ddp.objectdiagnosapasienfk = dp.norec
                inner join diagnosa_m as dm on ddp.objectdiagnosafk = dm.id
                inner join pasiendaftar_t as pd on pd.norec = app.noregistrasifk
                inner join pasien_m as ps on ps.id = pd.nocmfk
                left join alamat_m as alm on alm.nocmfk = ps.id
                 left join kecamatan_m as kec on kec.id = alm.objectkecamatanfk
                left join kotakabupaten_m as kot on kot.id = alm.objectkotakabupatenfk
                left join propinsi_m as pro on pro.id = alm.objectpropinsifk
                left join ruangan_m as ru on ru.id = pd.objectruanganlastfk
                where  dm.kddiagnosa <> '-'  and   pd.statusenabled=true and               
                pd.tglregistrasi BETWEEN '$tglAwal' AND '$tglAkhir'
                $paramProp
                $paramKota 
                 $paramKec

                )as x GROUP BY x.namadiagnosa ,x.kddiagnosa 
                ) as z
                ORDER BY z.jumlah desc  limit 10

            "));
        if (count($data)>0){
            foreach ($data as $item){
                $result[] = array(
                    'jumlah' =>$item->jumlah,
                    'kddiagnosa' => $item->kddiagnosa .' '.$item->namadiagnosa  ,
                    'namadiagnosa' => $item->namadiagnosa,
                );
            }

        }else{
            $result[] = array(
                'jumlah' => 0,
                'kddiagnosa' => null,
                'namadiagnosa' => null
            );
        }

        $results = array(
            'result' => $result,
            'month' => $bulan,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }

    public function getTopTenAsalPerujukBPJS(Request $request)
    {
        $dataLogin = $request->all();
        $IdBPJS=2;
           $tglAwal =  $request['tgl'].' 00:00'; //Carbon::now()->startOfMonth()->subMonth(1);
        $tglAkhir =  $request['tgl'].' 23:59';
        $bulan = Carbon::now()->format('F');
        $data = DB::select(DB::raw("SELECT * FROM
			(
				SELECT COUNT (x.ppkrujukan) AS jumlah, x.ppkrujukan, x.kodeperujuk AS kodeppkrujukan
				FROM (SELECT pd.noregistrasi, CASE WHEN ap.kdprovider IS NULL THEN '-' ELSE ap.kdprovider
				END AS kodeperujuk,CASE WHEN ap.nmprovider IS NULL THEN '-' ELSE ap.nmprovider END AS ppkrujukan,
				pa.ppkrujukan AS kodepa
				FROM pasiendaftar_t AS pd
				LEFT JOIN pemakaianasuransi_t AS pa ON pa.noregistrasifk = pd.norec
				LEFT JOIN asuransipasien_m AS ap ON ap. ID = pa.objectasuransipasienfk
				WHERE pd.tglregistrasi BETWEEN '$tglAwal' AND '$tglAkhir'
				AND pd.objectkelompokpasienlastfk in (2,4,10) 
                and   pd.statusenabled=true
				-- and ap.kdprovider  <> ''
				-- and ap.kdprovider  <> '-'
				--order by ap.kdprovider
				) AS x GROUP BY x.ppkrujukan, x.kodeperujuk
			) AS z
		  ORDER BY
		  z.jumlah DESC
         "));
        if (count($data) > 0){
            $result = $data ;
        }else{
            $result []= array(
                'jumlah' => 0,
                'kodeppkrujukan' => null,
                'ppkrujukan' => null,
            );
        }

        $results = array(
            'result' => $result,
            'month' => $bulan,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getKunjunganRuanganRawatInap(Request $request)
    {
        $dataLogin = $request->all();
        $depInap = 16;
        $tglAwal =  $request['tgl'].' 00:00'; //Carbon::now()->startOfMonth()->subMonth(1);
        $tglAkhir =  $request['tgl'].' 23:59';
        $bulan = Carbon::now()->format('F');
        $data = DB::select(DB::raw("SELECT
                        COUNT (z.kdruangan) AS jumlah,
                        z.namaruangan
                    FROM
                        (
                            select pd.noregistrasi, pd.tglregistrasi, ru.namaruangan, ru.id as kdruangan
                            from pasiendaftar_t as pd 
                            left join registrasipelayananpasien_t as rpp on rpp.noregistrasifk = pd.norec 
                            left join ruangan_m as ru on ru.id = pd.objectruanganlastfk 
                            where ru.objectdepartemenfk = 16 

                            and (  pd.tglregistrasi < '$tglAwal' AND pd.tglpulang >= '$tglAkhir' 
                           -- and pd.statusenabled=true 
                            )
                            or pd.tglpulang is null
                              and pd.statusenabled=true 
                             group by pd.tglregistrasi, pd.noregistrasi, ru.namaruangan, ru.id
                           
                        ) AS z
                    GROUP BY
                        z.namaruangan
            "));

        $result = array(
            'result' => $data,
            'month' => $bulan,
            'jml' => count($data),
            'message' => 'ramdanegie',
        );
        return $this->respond($data);
    }

    public function getKunjunganFasilitasLain(Request $request)
    {
        $tglAwal =date('Y-m-d'.' 00:00');// Carbon::now()->startOfMonth();//  Carbon::now()->subMonth(1);
        $tglAkhir = Carbon::now()->format('Y-m-d 23:59');
        $bulan = Carbon::now()->format('F');
        $idPerjanjian = 6;
        $data = DB::select(DB::raw("
                    select DISTINCT pd.noregistrasi, kps.kelompokpasien,pd.objectkelompokpasienlastfk
                    from pasiendaftar_t as pd
                    inner join kelompokpasien_m as kps on kps.id= pd.objectkelompokpasienlastfk
                    where pd.tglregistrasi BETWEEN '$tglAwal'  and '$tglAkhir'
                    order by pd.noregistrasi desc
                     --SELECT count(x.kelompokpasien) as jumlah , x.kelompokpasien from 
                    --) as x group by x.kelompokpasien
            "));
        $jmlBPJS  = 0;
        $jmlAsuransiLain  = 0;
        $jmlPerusahaan  = 0;
        $jmlUmum  = 0;
        $jmlPerjanjian  = 0;

        foreach ($data as $item){
            if ($item->objectkelompokpasienlastfk == 1){
                $jmlUmum= (float)$jmlUmum +1 ;
            } if ($item->objectkelompokpasienlastfk == 2){
                $jmlBPJS= (float)$jmlBPJS +1 ;
            } if ($item->objectkelompokpasienlastfk == 3){
                $jmlAsuransiLain= (float)$jmlAsuransiLain +1 ;
            } if ($item->objectkelompokpasienlastfk == 5){
                $jmlPerusahaan= (float)$jmlPerusahaan +1 ;
            } if ($item->objectkelompokpasienlastfk == 6){
                $jmlPerjanjian= (float)$jmlPerjanjian +1 ;
            }

        }
        $resultData = array(
            'Umum/Pribadi' => $jmlUmum,
            'BPJS' => $jmlBPJS,
            'Asuransi Lain' => $jmlAsuransiLain,
            'Perusahaan' => $jmlPerusahaan,
            'Perjanjian' => $jmlPerjanjian,
        );
        $result = array(
            'result' => $resultData,
            'month' => $bulan,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getTempatTidurTerpakai(Request $request)
    {
        $idDepRanap =16;
        $tglAwal = $request['tgl'].' 00:00';//date('Y-m-d 00:00');//Carbon::now()->startOfMonth();//  Carbon::now()->subMonth(1);
        $tglAkhir =  $request['tgl'].' 23:59';//Carbon::now()->format('Y-m-d 23:59');
//        $data = \DB::table('pasiendaftar_t as pds')
////              ->leftjoin ('antrianpasiendiperiksa_t as apd','apd.noregistrasifk','=','pd.norec')
////              ->join ('registrasipelayananpasien_t as rpp','rpp.noregistrasifk','=',
////                       DB::raw('pd.norec and rpp.objectruanganfk =pd.objectruanganlastfk') )
////              ->join ('tempattidur_m ass tt','tt.id','=','rpp.objecttempattidurfk')
//            ->leftjoin('registrasipelayananpasien_t AS rpp','rpp.noregistrasifk','=','pd.norec')
//            ->leftjoin ('pasien_m as ps','ps.id','=','pd.nocmfk')
//            ->leftjoin ('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
//            ->leftjoin ('ruangan_m as ru','ru.id','=','pd.objectruanganlastfk')
//            ->select('pd.noregistrasi','pd.tglregistrasi','ru.namaruangan',
//                'jk.jeniskelamin','ps.objectjeniskelaminfk',
//                DB::raw("CONVERT(int,ROUND(DATEDIFF(hour,ps.tgllahir,GETDATE())/8766.0,0)) AS umur,
//                    DATEDIFF(DAY,  ps.tgllahir, GETDATE()) as hari
//                    "))
////              ->wherein('ru.objectdepartemenfk',[16,35])
//            ->whereNull('pd.tglpulang')
////              ->whereBetween('pd.tglregistrasi',[$tglAwal,$tglAkhir])
//            ->groupBy('pd.tglregistrasi', 'pd.noregistrasi','ru.namaruangan',
//                'ru.objectdepartemenfk'  ,'ps.tgllahir', 'jk.jeniskelamin',
//                'ps.objectjeniskelaminfk')
//            ->orderBy('pd.noregistrasi','desc')
//            ->get();
// $data = DB::select(DB::raw("SELECT
//                 pd.noregistrasi,
//                 pd.tglregistrasi,
//                 ru.namaruangan,
//                 jk.jeniskelamin,
//                 ps.objectjeniskelaminfk,
//               date_part('year',age(ps.tgllahir))as umur,
//                 date_part('day',now()-ps.tgllahir)as hari
//             FROM
//                 pasiendaftar_t AS pd
//             LEFT JOIN pasien_m AS ps ON ps.id = pd.nocmfk
//             LEFT JOIN jeniskelamin_m AS jk ON jk.id = ps.objectjeniskelaminfk
//             LEFT JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
            
//             WHERE pd.kdprofile = $idProfile 
//                 and ru.objectdepartemenfk = $idDepRanap 
//                  and pd.statusenabled = true
//                 and (pd.tglregistrasi < '$tglAwal' AND pd.tglpulang >= '$tglAkhir' 
//                 )
//                 or pd.tglpulang is null
//                 and pd.kdprofile = $idProfile 
//                 and pd.statusenabled = true
//                 and ru.objectdepartemenfk = $idDepRanap "));
        $data = DB::select(DB::raw("SELECT
                pd.noregistrasi,
                pd.tglregistrasi,
                ru.namaruangan,
                jk.jeniskelamin,
                ps.objectjeniskelaminfk,
                  date_part('year',age(ps.tgllahir))as umur,
                 date_part('day',now()-ps.tgllahir)as hari
            FROM
                pasiendaftar_t AS pd
            LEFT JOIN pasien_m AS ps ON ps.id = pd.nocmfk
            LEFT JOIN jeniskelamin_m AS jk ON jk.id = ps.objectjeniskelaminfk
            LEFT JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
            
            WHERE
                ru.objectdepartemenfk = 16 
                and (  pd.tglregistrasi < '$tglAwal' AND pd.tglpulang >= '$tglAkhir' 
                 )
                or pd.tglpulang is null
                and pd.statusenabled=true"));
        $jmlBalitaL = 0;
        $jmlBalitaP = 0;
        $jmlAnakLaki = 0;
        $jmlAnakPerempuan = 0;
        $jmlDewasa = 0;
        $jmlGeriatri = 0;
        $jmlAll = 0;
        $jmlLakiDewasa= 0;
        $jmlGeriatriLaki= 0;

        foreach ($data as $item) {
            $jmlAll = $jmlAll + 1;
            //   bayi 0-30 hari
//               anak 30 hari - 17 th
            //   dewsa >17-50 th
//               geriatri >50  keatas
//            return  $this->respond($item->)
            if ($item->objectjeniskelaminfk == 1 && (float)$item->hari <= 30) {
                $jmlBalitaL = (float)$jmlBalitaL + 1;
            }
            if ($item->objectjeniskelaminfk == 2 && (float)$item->hari <= 30) {
                $jmlBalitaP = (float)$jmlBalitaP + 1;
            }
            if ($item->objectjeniskelaminfk == 1 &&(float) $item->hari > 30 && (float)$item->umur <= 17) {
                $jmlAnakLaki = (float)$jmlAnakLaki + 1;
            }
            if ($item->objectjeniskelaminfk == 2 && (float)$item->hari > 30 &&(float) $item->umur <= 17) {
                $jmlAnakPerempuan = (float)$jmlAnakPerempuan + 1;
            }
            if ($item->objectjeniskelaminfk == 2 && (float)$item->umur > 17 && (float)$item->umur <= 50) {
                $jmlDewasa = (float)$jmlDewasa + 1;
            }
            if ($item->objectjeniskelaminfk == 1 && (float)$item->umur > 17 && (float)$item->umur <= 50) {
                $jmlLakiDewasa = (float)$jmlLakiDewasa + 1;
            }
            if ( $item->objectjeniskelaminfk == 2 && (float)$item->umur > 50) {
                $jmlGeriatri = (float)$jmlGeriatri + 1;
            }
            if ($item->objectjeniskelaminfk == 1 &&  (float)$item->umur > 50) {
                $jmlGeriatriLaki = (float)$jmlGeriatriLaki + 1;
            }


        }

        $resultData = array(
            'jumlah' =>count($data),
            'geriatri' => $jmlGeriatri,
            'geriatrilaki' => $jmlGeriatriLaki,
            'lakidewasa' => $jmlLakiDewasa,
            'perempuandewasa' => $jmlDewasa,
            'anaklaki' => $jmlAnakLaki,
            'anakperempuan' => $jmlAnakPerempuan,
            'balitalaki' => $jmlBalitaL,
            'balitaperempuan' => $jmlBalitaP,
            'all' => $jmlAll,

        );
        $result = array(
            'result' => $resultData,
            'message' => 'ramdanegie',

        );

        return $this->respond($resultData);
    }
    public function getKetersediaanTempatTidurPerkelas(Request $request)
    {
         $tglAwal =$request['tgl'].' 00:00';
         $tglAkhir = $request['tgl'].' 23:59';
        //  $dataRanap = DB::select(DB::raw("select * from (SELECT pd.noregistrasi,pd.tglregistrasi,pd.tglpulang,apd.nobed
        //          ,row_number() over (partition by pd.noregistrasi order by apd.tglmasuk desc) as rownum 
        //         FROM pasiendaftar_t AS pd
        //         LEFT JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
        //          join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
        //         WHERE ru.objectdepartemenfk = 16 
        //         and (  pd.tglregistrasi < '$tglAwal' AND pd.tglpulang >= '$tglAkhir' 
        //         and pd.statusenabled=true )
        //         or pd.tglpulang is null
        //         ) as x  where x.rownum=1

        //     "));

        // $data = \DB::table('tempattidur_m as tt')
        //     ->leftjoin ('statusbed_m as sb','sb.id','=','tt.objectstatusbedfk')
        //     ->leftjoin ('kamar_m as kmr','kmr.id','=','tt.objectkamarfk')
        //     ->leftjoin ('ruangan_m as ru','ru.id','=','kmr.objectruanganfk')
        //     ->leftjoin ('kelas_m as kl','kl.id','=','kmr.objectkelasfk')
        //     ->select('kmr.id','kmr.namakamar','kl.id as id_kelas','kl.namakelas','ru.id as id_ruangan',
        //         'ru.namaruangan','kmr.jumlakamarisi','kmr.qtybed','sb.id as id_statusbed','tt.id as nobed')

        //     ->where('tt.statusenabled',1)
        //     ->get();


        // foreach ($data as $kamar  ){

        //    foreach ( $dataRanap as $pasien ) {
        //     # code...
        //     if($pasien->nobed == $kamar->nobed){
        //         $result []= array(
        //             'namakelas' => $kamar->namakelas, 
        //             // 'jumlah' =>  ,
        //             'kosong' => 0,
        //             'terpakai' => $isi ,

        //             ); 
        //         }   
        //     }
        //  }    
        // return $this->respond($result);
        //         $kls1 = 0;
        //         $kls2 = 0;
        //         $kls3 = 0;
        //         $vipA = 0;
        //         $vipB = 0;
        //         $vip = 0;
        //         $vvip =0;
        //         $nonKelas = 0;
        //         $terpakaikls1 = 0;
        //         $terpakaikls2 = 0;
        //         $terpakaikls3 = 0;
        //         $terpakaivipA = 0;
        //         $terpakaivipB = 0;
        //         $terpakainonKelas = 0;
        //         $terpakaivip = 0;
        //         $terpakaivvip= 0;
        //         foreach ($data as $item) {
        //             if ( $item->id_statusbed == 2 ) {
        //                 if ($item->id_kelas == 3  ) {
        //                     $kls1 = (float)$kls1 + 1;
        //                 }
        //                 if ($item->id_kelas == 2 ) {
        //                     $kls2 = (float)$kls2 + 1;
        //                 }
        //                 if ($item->id_kelas == 1 ) {
        //                     $kls3 = (float)$kls3 + 1;
        //                 }
        //                 if ($item->id_kelas == 5  ) {
        //                     $vipA = (float)$vipA + 1;
        //                 }
        //                 if ($item->id_kelas == 8 ) {
        //                     $vipB = (float)$vipB + 1;
        //                 }
        //                 if ($item->id_kelas == 6  ) {
        //                     $nonKelas = (float)$nonKelas + 1;
        //                 }
        //                 if ($item->id_kelas == 4  ) {
        //                     $vip = (float)$vip + 1;
        //                 }

        //                 if ($item->id_kelas == 7  ) {
        //                     $vvip = (float)$vvip + 1;
        //                 }
        //             }

        // //            terpakai
        //             if ($item->id_statusbed == 1 ){
        //                 if ($item->id_kelas == 3) {
        //                     $terpakaikls1 = (float)$terpakaikls1 + 1;
        //                 }
        //                 if ($item->id_kelas == 2 ) {
        //                     $terpakaikls2 = (float)$terpakaikls2 + 1;
        //                 }
        //                 if ($item->id_kelas == 1 ) {
        //                     $terpakaikls3 = (float)$terpakaikls3 + 1;
        //                 }
        //                 if ($item->id_kelas == 5  ) {
        //                     $terpakaivipA = (float)$terpakaivipA + 1;
        //                 }
        //                 if ($item->id_kelas == 8  ) {
        //                     $terpakaivipB = (float)$terpakaivipB + 1;
        //                 }
        //                 if ($item->id_kelas == 6) {
        //                     $terpakainonKelas = (float)$terpakainonKelas + 1;
        //                 }
        //                 if ($item->id_kelas == 4  ) {
        //                     $terpakaivip = (float)$terpakaivip + 1;
        //                 }

        //                 if ($item->id_kelas == 7  ) {
        //                     $terpakaivvip = (float)$terpakaivvip + 1;
        //                 }
        //             }
        //         }
        //         $kamarKosong = array(
        //             'kelas_1' =>$kls1,
        //             'kelas_2' => $kls2,
        //             'kelas_3' => $kls3,
        //             'vip_a' => $vipA,
        //             'vip_b' => $vipB,
        //             'vip' => $vip,
        //             'vvip' => $vvip,
        //             'non_kelas' => $nonKelas,
        //             'jumlah' => $nonKelas + $kls1 + $kls2 + $kls3 +$vipA +  $vipB +$vip +$vvip,

        //             'kelas_1a' =>$terpakaikls1,
        //             'kelas_2a' => $terpakaikls2,
        //             'kelas_3a' => $terpakaikls3,
        //             'vip_aa' => $terpakaivipA,
        //             'vip_ba' => $terpakaivipB,
        //             'non_kelasa' => $terpakainonKelas,
        //             'vvip_aa' => $terpakaivip,
        //             'vvvip_aa' => $terpakaivvip,
        //             'jumlaha' => $terpakainonKelas + $terpakaikls1 + $terpakaikls2 + $terpakaikls3 +$terpakaivipA +  $terpakaivipB + $terpakaivvip + $terpakaivip,

        //             'kelas_1b' =>$kls1 + $terpakaikls1,
        //             'kelas_2b' => $kls2 + $terpakaikls2,
        //             'kelas_3b' => $kls3 + $terpakaikls3,
        //             'vip_ab' => $vipA + $terpakaivipA,
        //             'vip_bb' => $vipB + $terpakaivipB,
        //             'non_kelasb' => $nonKelas + $terpakainonKelas,
        //             'vvip_bb' => $vip + $terpakaivip,
        //             'vvvip_bb' => $vvip + $terpakaivvip,
        //             'jumlahb' => $nonKelas + $kls1 + $kls2 + $kls3 +$vipA +  $vipB + $vvip+  $vip+$terpakainonKelas + $terpakaikls1 + $terpakaikls2 + $terpakaikls3 +$terpakaivipA +  $terpakaivipB,

        //         );
        //         $kamarTerpakai = array(
        //             'kelas_1' =>$terpakaikls1,
        //             'kelas_2' => $terpakaikls2,
        //             'kelas_3' => $terpakaikls3,
        //             'vip_a' => $terpakaivipA,
        //             'vip_b' => $terpakaivipB,
        //             'vip' => $terpakaivip,
        //             'vvip' => $terpakaivvip,
        //             'non_kelas' => $terpakainonKelas,
        //             'jumlah' => $terpakainonKelas + $terpakaikls1 + $terpakaikls2 + $terpakaikls3 +$terpakaivipA +  $terpakaivipB +$terpakaivip,$terpakaivvip,
        //         );
        $data = DB::select(DB::raw("select sum(COALESCE (x.isi, 0)) as terpakai, sum(COALESCE (x.kosong, 0)) as kosong,x.namakelas,
        sum(COALESCE (x.isi, 0))+ sum(COALESCE (x.kosong, 0)) as jml from (
            select klz.namakelas,ttt.* from kelas_m as klz 
                    left join (SELECT 
                kmr.id,
                kmr.namakamar,
                kl.id AS id_kelas,
              
                ru.id AS id_ruangan,
                ru.namaruangan,
                kmr.jumlakamarisi,
                kmr.qtybed,
                case when sb.id=1 then 1 else 0 end as isi,
                case when sb.id=2 then 1 else 0 end as kosong,
kmr.objectkelasfk
            FROM
                tempattidur_m AS tt
            LEFT JOIN statusbed_m AS sb ON sb.id = tt.objectstatusbedfk
            LEFT JOIN kamar_m AS kmr ON kmr.id = tt.objectkamarfk
            LEFT JOIN ruangan_m AS ru ON ru.id = kmr.objectruanganfk
            LEFT JOIN kelas_m AS kl ON kl.id = kmr.objectkelasfk
            WHERE 
                tt.statusenabled = true
              and   kmr.statusenabled = true) ttt on (ttt.objectkelasfk=klz.id) 
where klz.statusenabled =true 
                ) as x GROUP BY x.namakelas
            order by  x.namakelas

            "));

        // $result = array(
        //     // 'kosong' => $kamarKosong,
        //     // 'terpakai' => $kamarTerpakai,
        //     'data'=>   $data,
        //     'message' => 'ramdanegie',

        // );

        return $this->respond($data);
    }
    public function getKetersediaanTempatTidurPerkelasCovid(Request $request)
    {
         $tglAwal =$request['tgl'].' 00:00';
         $tglAkhir = $request['tgl'].' 23:59';
        
        $data = DB::select(DB::raw("SELECT
                    SUM (x.isia) AS terpakai,
                    SUM (x.kosonga) AS kosong,
                    x.namakelas,
                    SUM (x.isi) + SUM (x.kosong) AS jml,
                    SUM (x.siap) AS siap
                FROM
                    (
                        SELECT
                            kmr.id,
                            kmr.namakamar,
                            kl.id AS id_kelas,
                            kl.namakelas,
                            ru.id AS id_ruangan,
                            ru.namaruangan,
                            kmr.jumlakamarisi,
                            kmr.qtybed,
                            CASE
                        WHEN sb.id = 1 THEN
                            1
                        ELSE
                            0
                        END AS isi,
                        CASE
                    WHEN sb.id = 2 THEN
                        1
                    ELSE
                        0
                    END AS kosong,
                CASE
                        WHEN sb.id = 1 and tt.objectstatusbedfktriger = 5 THEN
                            1
                        ELSE
                            0
                        END AS isia,
                        CASE
                    WHEN sb.id = 2 and tt.objectstatusbedfktriger = 5 THEN
                        1
                    ELSE
                        0
                    END AS kosonga,
                CASE
                    WHEN tt.objectstatusbedfktriger = 5 THEN
                        1
                    ELSE
                        0
                    END AS siap
                    FROM
                        tempattidur_m AS tt
                    LEFT JOIN statusbed_m AS sb ON sb.id = tt.objectstatusbedfk
                    LEFT JOIN kamar_m AS kmr ON kmr.id = tt.objectkamarfk
                    LEFT JOIN ruangan_m AS ru ON ru.id = kmr.objectruanganfk
                    LEFT JOIN kelas_m AS kl ON kl.id = kmr.objectkelasfk
                    WHERE
                        tt.statusenabled = true
                    AND kmr.statusenabled=true
                    and ru.objectruanganfk= 19
                    ) AS x
                GROUP BY
                    x.namakelas
                ORDER BY
                    x.namakelas

            "));
    

        return $this->respond($data);
    }
    public function getTrendKunjunganPasienRajal(Request $request)
    {

        $idDepRaJal = 18;
        $tglAwal = Carbon::now()->subWeek(3);//  Carbon::now()->subMonth(1);
        $tglAkhir = Carbon::now()->format('Y-m-d 23:59');
        $currentDate = Carbon::now();
        $last2week = $currentDate->subWeek();
        // $data = DB::select(DB::raw("
        //            select pd.norec,pd.noregistrasi, Format( pd.tglregistrasi, 'dd, MMM yyyy') as tglregistrasi,
        //                 Format( pd.tglregistrasi, 'dd. MMM') as tanggal,
        //             pd.tglregistrasi as tgl,
        //             case when  br.norec is null and pd.nostruklastfk is not null then 'sudahdiperiksa' 
        //             when br.norec is null and pd.nostruklastfk is null then 'belumdiperiksa'
        //             when br.norec is not null then 'batalregis'  end as keterangan,
        //             ps.namapasien, br.norec as norec_batal
        //             from pasiendaftar_t as pd
        //              --  inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
        //             inner join ruangan_m as ru on ru.id = pd.objectruanganlastfk
        //             inner join pasien_m as ps on ps.id = pd.nocmfk
        //             left join batalregistrasi_t as br on br.pasiendaftarfk = pd.norec
        //             where pd.tglregistrasi between '$tglAwal' and '$tglAkhir'  and ru.objectdepartemenfk = '18'
        //              -- GROUP BY pd.noregistrasi ,apd.tglregistrasi,ps.namapasien,br.norec,apd.statusantrian,pd.nostruklastfk
        //             order by pd.noregistrasi
        //        "));

        // $data = DB::select(DB::raw("
        //         select * from (
        //         SELECT
        //             pd.norec,
        //             pd.noregistrasi,
        //             to_char (
        //                 pd.tglregistrasi,
        //                'dd, Mon YYYY'
        //             ) AS tglregistrasi,
        //             to_char (pd.tglregistrasi, 'dd. Mon') AS tanggal,
        //             pd.tglregistrasi AS tgl,
        //             CASE
        //         WHEN  apd.tgldipanggilsuster IS NOT NULL  and br.norec is  null THEN
        //             'sudahdiperiksa'
        //         WHEN  apd.tgldipanggilsuster IS NULL  and br.norec is  null THEN
        //             'belumdiperiksa'
        //         WHEN br.norec is not null THEN
        //             'batalregis'
        //         END AS keterangan,
        //          ps.namapasien
        //         ,
        //         row_number() over (partition by pd.noregistrasi order by apd.tglmasuk desc) as rownum 
        //         FROM
        //             pasiendaftar_t AS pd
        //         inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
        //         INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
        //         INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
        //          left join batalregistrasi_t as br on br.pasiendaftarfk = pd.norec
        //         WHERE pd.kdprofile = $idProfile and
        //             pd.tglregistrasi BETWEEN  '$tglAwal'
        //         AND '$tglAkhir'
        //         AND ru.objectdepartemenfk = $idDepRaJal 
        //         ) as x where x.rownum=1
        //         ORDER BY
        //         x.noregistrasi
        // "));
         $data = DB::select(DB::raw("
                select * from (
                 SELECT
                    pd.norec,
                    pd.noregistrasi,
                    to_char (
                        pd.tglregistrasi,
                       'dd, Mon YYYY'
                    ) AS tglregistrasi,
                    to_char (pd.tglregistrasi, 'dd. Mon') AS tanggal,
                    pd.tglregistrasi AS tgl,
                    br.pasiendaftarfk,
                    CASE
                WHEN  kendalidokumenrekammedis_t.objectstatuskendalidokumenfk <> 1  and br.norec is  null THEN
                    'sudahdiperiksa'
                WHEN pd.statusenabled=true and kendalidokumenrekammedis_t.objectstatuskendalidokumenfk <> 9 or kendalidokumenrekammedis_t.objectstatuskendalidokumenfk is null and br.norec is  null THEN
                    'belumdiperiksa'
                WHEN br.pasiendaftarfk is not null THEN
                    'batalregis'
                END AS keterangan,
                 ps.namapasien,
                row_number() over (partition by pd.noregistrasi order by apd.tglmasuk desc) as rownum,
                to_char (pd.tglregistrasi,'dd') as tgls,
                to_char (pd.tglregistrasi,'mm') as bulan
                
                FROM            pasiendaftar_t AS pd INNER JOIN
                 antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec INNER JOIN
                 ruangan_m AS ru ON ru.id = pd.objectruanganlastfk INNER JOIN
                 pasien_m AS ps ON ps.id = pd.nocmfk LEFT OUTER JOIN
                 kendalidokumenrekammedis_t ON apd.norec = kendalidokumenrekammedis_t.noregistrasifk LEFT OUTER JOIN
                 batalregistrasi_t AS br ON br.pasiendaftarfk = pd.norec
                WHERE
                    pd.tglregistrasi BETWEEN  '$tglAwal'
                AND '$tglAkhir'
                AND ru.objectdepartemenfk = '18' 
                AND ru.id <> '251' 
                ) as x where x.rownum=1
                ORDER BY
                x.bulan,x.tgls,x.keterangan
        "));
        $data10=[];
        $sudahPeriksa = 0;
        $belumPeriksa = 0;
        $batalRegis = 0;
        $totalAll = 0;
        if (count($data) > 0) {
            foreach ($data as $item) {
                $sama = false;
                $i = 0;
                foreach ($data10 as $hideung) {
                    if ($item->tglregistrasi == $data10[$i]['tglregistrasi']) {
                        $sama = 1;
                        $jml = (float)$hideung['totalterdaftar'] + 1;
                        $data10[$i]['totalterdaftar'] = $jml;
                        if ($item->keterangan == 'sudahdiperiksa') {
                            $data10[$i]['diperiksa'] = (float)$hideung['diperiksa'] + 1;
                        }
                        if ($item->keterangan == 'belumdiperiksa') {
                            $data10[$i]['belumperiksa'] = (float)$hideung['belumperiksa'] + 1;
                        }
                        if ($item->keterangan == 'batalregis') {
                            $data10[$i]['batalregistrasi'] = (float)$hideung['batalregistrasi'] + 1;
                        }
                        // if($item->tglregistrasi=='02, Mar 2021' && $data10[$i]['diperiksa']==578){
                        //     return($item->norec);
                        //     die();
                        // }
                    }
                    $i = $i + 1;
                }
                if ($sama == false) {
                    if ($item->keterangan == 'sudahdiperiksa') {
//                    if ($item->nostruklastfk != null && $item->norec_batal == null) {
                        $sudahPeriksa = 1;
                        $belumPeriksa = 0;
                        $batalRegis = 0;
                    }
//                    if ($item->nostruklastfk == null && $item->norec_batal == null) {
                    if ($item->keterangan == 'belumdiperiksa') {
                        $sudahPeriksa = 0;
                        $belumPeriksa = 1;
                        $batalRegis = 0;
                    }
//                    if ($item->norec_batal != null) {
                    if ($item->keterangan == 'batalregis') {
                        $sudahPeriksa = 0;
                        $belumPeriksa = 0;
                        $batalRegis = 1;
                    }
                    $data10[] = array(
                        'tglregistrasi' => $item->tglregistrasi,
                        'tanggal' =>$item->tanggal,
                        'totalterdaftar' => 1,
                        'diperiksa' => $sudahPeriksa,
                        'belumperiksa' => $belumPeriksa,
                        'batalregistrasi' => $batalRegis,

                    );
                }
                // foreach ($data10 as $key => $row) {
                //     $count[$key] = $row['totalterdaftar'];
                // }
                // array_multisort($count, SORT_DESC, $data10);
            }
        }
        return $this->respond($data10);

    }
    public function getTrendKunjunganPasienCovid(Request $request)
    {

        $idDepRaJal = 18;
        $tglAwal = Carbon::now()->subWeek(3);//  Carbon::now()->subMonth(1);
        $tglAkhir = Carbon::now()->format('Y-m-d 23:59');
        $currentDate = Carbon::now();
        $last2week = $currentDate->subWeek();
      
        //  $data = DB::select(DB::raw("
        //         select * from (
        //             SELECT
        //             pp.produkfk,
        //         Format (pp.tglpelayanan,'dd, MMM yyyy') AS tglpelayanan,
        //         Format (pp.tglpelayanan, 'dd. MMM') AS tanggal,
        //         format(pp.tglpelayanan,'dd') as tgls,
        //         format(pp.tglpelayanan,'MM') as bulan,
        //         pp.tglpelayanan AS tgl,ru.namaruangan
        //         FROM
        //             antrianpasiendiperiksa_t AS apd
        //         JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
        //         JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
        //         WHERE
        //         ru.objectruanganfk = 19
        //         AND pp.produkfk IN (4057038,4057039,4057040,4057041,4057042,4057043,4057044,4057045,4057046,4057047,4057048,4057049,4057050,4057051,4057052,4057053,4057054,4057055,4057056,4057057,4057058,4057059,4057060,4074477,4075025,4075133)
        //         and pp.tglpelayanan BETWEEN  '$tglAwal'
        //         AND '$tglAkhir'                
        //         ) as x
        //         ORDER BY
        //         x.bulan,x.tgls,x.namaruangan
        // "));
        // $data = DB::select(DB::raw("
        // select * from (
        //     SELECT
        //     Format (apd.tglregistrasi,'dd, MMM yyyy') AS tglpelayanan,
        //     Format (apd.tglregistrasi, 'dd. MMM') AS tanggal,
        //     format(apd.tglregistrasi,'dd') as tgls,
        //     format(apd.tglregistrasi,'MM') as bulan,
        //     --apd.tglregistrasi AS tgl,ru.namaruangan
        //     pd.noregistrasi
        //     FROM
        //     antrianpasiendiperiksa_t AS apd
        //     JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
        //     JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk
        //     WHERE
        //     ru.objectruanganfk = 19
        //     and apd.tglregistrasi  BETWEEN  '$tglAwal'
        //     AND '$tglAkhir' 
        //     ) as x
        //     group by x.noregistrasi,x.tglpelayanan,x.tanggal,x.tgls,x.bulan
        //     ORDER BY
        //     x.noregistrasi,x.bulan,x.tgls
        // "));
        $data = DB::select(DB::raw("
        select * from (
            SELECT
            
          to_date(cast(pds.tglinsertsensus as TEXT),'YYYY')AS tglpelayanan,
to_date(cast(pds.tglinsertsensus as TEXT),'MMDD')AS tanggal,

to_date(cast(pds.tglinsertsensus as TEXT),'dd')AS tgls,

to_date(cast(pds.tglinsertsensus  as TEXT),'MM')AS bulan,
            pds.tglregistrasi AS tgl,ru.namaruangan
            FROM
                pasiendaftarsensus_t pds
            INNER JOIN pasiendaftar_t pd ON pd.norec = pds.noregistrasifk
            INNER JOIN antrianpasiendiperiksa_t apd ON apd.noregistrasifk = pd.norec
            AND apd.objectruanganfk = pd.objectruanganlastfk
            INNER JOIN ruangan_m ru ON ru.id = pd.objectruanganlastfk
            WHERE
                tglinsertsensus BETWEEN  '$tglAwal'
                                                            AND '$tglAkhir'
            AND apd.objectkasuspenyakitfk = '19'
            AND apd.statusenabled=true
            AND pd.statusenabled=true
            --and pd.tglpulang is null
            GROUP BY
                pds.noregistrasi,
                ru.namaruangan,
                pd.tglpulang,
                pds.tglinsertsensus,
            pds.tglregistrasi
            ) as x
            ORDER BY
            x.bulan,x.tgls,x.namaruangan
        "));
        $data10=[];
        $sudahPeriksa = 0;
        $belumPeriksa = 0;
        $batalRegis = 0;
        $totalAll = 0;
        if (count($data) > 0) {
            foreach ($data as $item) {
                $sama = false;
                $i = 0;
                foreach ($data10 as $hideung) {
                    if ($item->tglpelayanan == $data10[$i]['tglpelayanan']) {
                        $sama = 1;
                        $jml = (float)$hideung['totalterdaftar'] + 1;
                        $data10[$i]['totalterdaftar'] = $jml;
                        // if ($item->keterangan == 'sudahdiperiksa') {
                        //     $data10[$i]['diperiksa'] = (float)$hideung['diperiksa'] + 1;
                        // }
                        // if ($item->keterangan == 'belumdiperiksa') {
                        //     $data10[$i]['belumperiksa'] = (float)$hideung['belumperiksa'] + 1;
                        // }
                        // if ($item->keterangan == 'batalregis') {
                        //     $data10[$i]['batalregistrasi'] = (float)$hideung['batalregistrasi'] + 1;
                        // }
                    }
                    $i = $i + 1;
                }
                if ($sama == false) {
                    // if ($item->keterangan == 'sudahdiperiksa') {
                    //     $sudahPeriksa = 1;
                    //     $belumPeriksa = 0;
                    //     $batalRegis = 0;
                    // }
                    // if ($item->keterangan == 'belumdiperiksa') {
                    //     $sudahPeriksa = 0;
                    //     $belumPeriksa = 1;
                    //     $batalRegis = 0;
                    // }
                    // if ($item->keterangan == 'batalregis') {
                    //     $sudahPeriksa = 0;
                    //     $belumPeriksa = 0;
                    //     $batalRegis = 1;
                    // }
                    $data10[] = array(
                        'tglpelayanan' => $item->tglpelayanan,
                        'tanggal' =>$item->tanggal,
                        'totalterdaftar' => 1,
                        // 'diperiksa' => $sudahPeriksa,
                        // 'belumperiksa' => $belumPeriksa,
                        // 'batalregistrasi' => $batalRegis,

                    );
                }

            }
        }
        return $this->respond($data10);

    }
    public function getTrendKunjunganPasienCovidPulang(Request $request)
    {

        $idDepRaJal = 18;
        $tglAwal = Carbon::now()->subWeek(3);//  Carbon::now()->subMonth(1);
        $tglAkhir = Carbon::now()->format('Y-m-d 23:59');
        $currentDate = Carbon::now();
        $last2week = $currentDate->subWeek();
      
        $data = DB::select(DB::raw("
        select * from (
            SELECT DISTINCT
                  to_char (
                        pd.tglpulang,
                       'dd, Mon YYYY'
                    ) AS tglpelayanan,
      
                
                to_date(cast(pd.tglpulang as TEXT),'dd. MMM')AS tanggal,
                to_date(cast(pd.tglpulang as TEXT),'dd')AS tgls,
                to_date(cast(pd.tglpulang as TEXT),'MM')AS bulan,
                pd.noregistrasi,pd.tglmeninggal
            FROM
                pasiendaftar_t pd
            INNER JOIN antrianpasiendiperiksa_t apd ON pd.norec = apd.noregistrasifk
            AND pd.objectruanganlastfk = apd.objectruanganfk
            WHERE
                pd.tglpulang BETWEEN '$tglAwal'
            AND '$tglAkhir'
            AND apd.objectkasuspenyakitfk = 19
            AND pd.statusenabled=true
            GROUP BY
                pd.noregistrasi,
                pd.tglpulang,
                pd.tglmeninggal
                ) as x
            ORDER BY
            x.bulan,x.tgls
        "));
        $data10=[];
        $meninggal = 0;
        $hidup = 0;
        $batalRegis = 0;
        $totalAll = 0;
        if (count($data) > 0) {
            foreach ($data as $item) {
                $sama = false;
                $i = 0;
                foreach ($data10 as $hideung) {
                    if ($item->tglpelayanan == $data10[$i]['tglpelayanan']) {
                        $sama = 1;
                        $jml = (float)$hideung['totalterdaftar'] + 1;
                        $data10[$i]['totalterdaftar'] = $jml;
                        if ($item->tglmeninggal != null) {
                            $data10[$i]['meninggal'] = (float)$hideung['meninggal'] + 1;
                        }
                        if ($item->tglmeninggal == null) {
                            $data10[$i]['hidup'] = (float)$hideung['hidup'] + 1;
                        }
                        // if ($item->keterangan == 'batalregis') {
                        //     $data10[$i]['batalregistrasi'] = (float)$hideung['batalregistrasi'] + 1;
                        // }
                    }
                    $i = $i + 1;
                }
                if ($sama == false) {
                    if ($item->tglmeninggal != null) {
                        $meninggal = 1;
                        $hidup = 0;
                    }
                    if ($item->tglmeninggal == null) {
                        $meninggal = 0;
                        $hidup = 1;
                    }
                    // if ($item->keterangan == 'batalregis') {
                    //     $sudahPeriksa = 0;
                    //     $belumPeriksa = 0;
                    //     $batalRegis = 1;
                    // }
                    $data10[] = array(
                        'tglpelayanan' => $item->tglpelayanan,
                        'tanggal' =>$item->tanggal,
                        'totalterdaftar' => 1,
                        'meninggal' => $meninggal,
                        'hidup' => $hidup,
                        // 'batalregistrasi' => $batalRegis,

                    );
                }

            }
        }
        return $this->respond($data10);

    }
    public function getTrendPerbulan(Request $request)
    {

        $idDepRaJal = 18;
        $tglAwal = Carbon::now()->subWeek(3);//  Carbon::now()->subMonth(1);
        $tglAkhir = Carbon::now()->format('Y-m-d 23:59');
        $currentDate = Carbon::now();
        $last2week = $currentDate->subWeek();
        // return($request['idRuangan']);
        // die();
        if($request['idRuangan']=='1001'){
            $data = DB::select(DB::raw("
            select * from (
                SELECT
                                    Format (pd.tglinsertsensus,'dd, MMM yyyy') AS tglpelayanan,
                                                        Format (pd.tglinsertsensus, 'dd. MMM') AS tanggal,
                                                        format(pd.tglinsertsensus,'dd') as tgls,
                                                        format(pd.tglinsertsensus,'MM') as bulan,
                                                        pd.tglregistrasi AS tgl,ru.namaruangan
                                FROM
                                    [pasiendaftarsensus_t] AS [pd] 
                                INNER JOIN [pasien_m] AS [ps] ON [ps].[id] = [pd].[nocmfk]
                                INNER JOIN [ruangan_m] AS [ru] ON ru.id = [pd].[objectruanganlastfk]
                                left JOIN [ruangan_m] AS [ruu] ON [ruu].[id] = [pd].[objectruanganasalfk]
                                INNER JOIN [departemen_m] AS [dp] ON [dp].[id] = [ru].[objectdepartemenfk]
                                WHERE
                                    ru.objectdepartemenfk = 16
                                                and tglinsertsensus BETWEEN  '$tglAwal'
                                                AND '$tglAkhir' 
                                AND pd.statusenabled=true
                ) as x
                            ORDER BY
                            x.bulan,x.tgls,x.namaruangan
            "));
        }else if($request['idRuangan']=='19'){
            // $data = DB::select(DB::raw("
            // select * from (
            //     SELECT
            //                         Format (pd.tglinsertsensus,'dd, MMM yyyy') AS tglpelayanan,
            //                                             Format (pd.tglinsertsensus, 'dd. MMM') AS tanggal,
            //                                             format(pd.tglinsertsensus,'dd') as tgls,
            //                                             format(pd.tglinsertsensus,'MM') as bulan,
            //                                             pd.tglregistrasi AS tgl,ru.namaruangan
            //                     FROM
            //                         [pasiendaftarsensus_t] AS [pd] 
            //                     INNER JOIN [pasien_m] AS [ps] ON [ps].[id] = [pd].[nocmfk]
            //                     INNER JOIN [ruangan_m] AS [ru] ON ru.id = [pd].[objectruanganlastfk]
            //                     left JOIN [ruangan_m] AS [ruu] ON [ruu].[id] = [pd].[objectruanganasalfk]
            //                     INNER JOIN [departemen_m] AS [dp] ON [dp].[id] = [ru].[objectdepartemenfk]
            //                     WHERE
            //                         ru.objectdepartemenfk = 16
            //                                     and tglinsertsensus BETWEEN  '$tglAwal'
            //                                     AND '$tglAkhir' 
            //                     AND pd.statusenabled=true
            //                     AND ru.objectruanganfk = 19
            //     ) as x
            //                 ORDER BY
            //                 x.bulan,x.tgls,x.namaruangan
            // "));
            $data = DB::select(DB::raw("
            select * from (
                SELECT
                Format (pds.tglinsertsensus,'dd, MMM yyyy') AS tglpelayanan,
                Format (pds.tglinsertsensus, 'dd. MMM') AS tanggal,
                format(pds.tglinsertsensus,'dd') as tgls,
                format(pds.tglinsertsensus,'MM') as bulan,
                pds.tglregistrasi AS tgl,ru.namaruangan
                FROM
                    pasiendaftarsensus_t pds
                INNER JOIN pasiendaftar_t pd ON pd.norec = pds.noregistrasifk
                INNER JOIN antrianpasiendiperiksa_t apd ON apd.noregistrasifk = pd.norec
                AND apd.objectruanganfk = pd.objectruanganlastfk
                INNER JOIN ruangan_m ru ON ru.id = pd.objectruanganlastfk
                WHERE
                    tglinsertsensus BETWEEN  '$tglAwal'
                                                                AND '$tglAkhir'
                AND apd.objectkasuspenyakitfk = '19'
                AND apd.statusenabled=true
                AND pd.statusenabled=true
                --and pd.tglpulang is null
                GROUP BY
                    pds.noregistrasi,
                    ru.namaruangan,
                    pd.tglpulang,
                    pds.tglinsertsensus,
                pds.tglregistrasi
                ) as x
                ORDER BY
                x.bulan,x.tgls,x.namaruangan
            "));
        }else if($request['idRuangan']=='717'){
            $data = DB::select(DB::raw("
            select * from (
                SELECT
                                    Format (pd.tglinsertsensus,'dd, MMM yyyy') AS tglpelayanan,
                                                        Format (pd.tglinsertsensus, 'dd. MMM') AS tanggal,
                                                        format(pd.tglinsertsensus,'dd') as tgls,
                                                        format(pd.tglinsertsensus,'MM') as bulan,
                                                        pd.tglregistrasi AS tgl,ru.namaruangan
                                FROM
                                    [pasiendaftarsensus_t] AS [pd] 
                                INNER JOIN [pasien_m] AS [ps] ON [ps].[id] = [pd].[nocmfk]
                                INNER JOIN [ruangan_m] AS [ru] ON ru.id = [pd].[objectruanganlastfk]
                                left JOIN [ruangan_m] AS [ruu] ON [ruu].[id] = [pd].[objectruanganasalfk]
                                INNER JOIN [departemen_m] AS [dp] ON [dp].[id] = [ru].[objectdepartemenfk]
                                WHERE
                                    ru.objectdepartemenfk = 16
                                                and tglinsertsensus BETWEEN  '$tglAwal'
                                                AND '$tglAkhir' 
                                AND pd.statusenabled=true
                                and ru.id in (717,722,724,758,759,760,761,762,763,764,781)
                ) as x
                            ORDER BY
                            x.bulan,x.tgls,x.namaruangan
            "));
        }else if($request['idRuangan']=='24'){
            $data = DB::select(DB::raw("
            select * from (
                SELECT 
                Format (pd.tglregistrasi,'MMM yyyy') AS tglpelayanan,
                Format (pd.tglregistrasi, 'MMM') AS tanggal,
                to_date(cast(pd.tglregistrasi as TEXT),'dd')AS tgls,
                to_date(cast(pd.tglregistrasi as TEXT),'MM')AS bulan,
                pd.tglregistrasi AS tgl,ru.namaruangan
                FROM departemen_m dp
                join ruangan_m as ru on ru.objectdepartemenfk=dp.id
                LEFT JOIN (SELECT antrianpasiendiperiksa_t.norec,objectruanganfk,antrianpasiendiperiksa_t.tglregistrasi FROM antrianpasiendiperiksa_t
                left join batalregistrasi_t as br on br.pasiendaftarfk=antrianpasiendiperiksa_t.noregistrasifk
                where tglregistrasi BETWEEN '2021-01-14 00:00' and '$tglAkhir' and br.norec is null) pd ON (ru.id= pd.objectruanganfk)
                WHERE dp.id =24 and pd.norec is not null
                )as x
                ORDER BY
                x.bulan,x.tgls,x.namaruangan
            "));
        }else if($request['idRuangan']=='16'){
            $data = DB::select(DB::raw("
            select * from (
                SELECT
                                    Format (pd.tglregistrasi,'MMM yyyy') AS tglpelayanan,
                                                        Format (pd.tglregistrasi, 'MMM') AS tanggal,
                                                        to_date(cast(pd.tglregistrasi as TEXT),'dd')AS tgls,
                                                        to_date(cast(pd.tglregistrasi as TEXT),'MM')AS bulan,
                                                        pd.tglregistrasi AS tgl,ru.namaruangan
                FROM
                    [pasiendaftar_t] AS [pd]
                INNER JOIN [pasien_m] AS [ps] ON [ps].[id] = [pd].[nocmfk]
                INNER JOIN [ruangan_m] AS [ru] ON ru.id = [pd].[objectruanganlastfk]
                LEFT JOIN [ruangan_m] AS [ruu] ON [ruu].[id] = [pd].[objectruanganasalfk]
                INNER JOIN [departemen_m] AS [dp] ON [dp].[id] = [ru].[objectdepartemenfk]
                WHERE
                    [pd].[tglregistrasi] BETWEEN '2021-01-14 00:00'
                AND '$tglAkhir'
                AND [pd].[statusenabled] = 1
                AND [ru].[objectdepartemenfk] = 16
                AND ru.id NOT IN (251,322,12,448,453)
                ) as x
                            ORDER BY
                            x.bulan,x.tgls,x.namaruangan
            "));
        }else if($request['idRuangan']=='18'){
            $data = DB::select(DB::raw("
            select * from (
                SELECT
                                    Format (pd.tglregistrasi,'MMM yyyy') AS tglpelayanan,
                                                        Format (pd.tglregistrasi, 'MMM') AS tanggal,
                                                        to_date(cast(pd.tglregistrasi as TEXT),'dd')AS tgls,
                                                        to_date(cast(pd.tglregistrasi as TEXT),'MM')AS bulan,
                                                        pd.tglregistrasi AS tgl,ru.namaruangan
                FROM
                    [pasiendaftar_t] AS [pd]
                INNER JOIN [pasien_m] AS [ps] ON [ps].[id] = [pd].[nocmfk]
                INNER JOIN [ruangan_m] AS [ru] ON ru.id = [pd].[objectruanganlastfk]
                LEFT JOIN [ruangan_m] AS [ruu] ON [ruu].[id] = [pd].[objectruanganasalfk]
                INNER JOIN [departemen_m] AS [dp] ON [dp].[id] = [ru].[objectdepartemenfk]
                WHERE
                    [pd].[tglregistrasi] BETWEEN '2021-01-14 00:00'
                AND '$tglAkhir'
                AND [pd].[statusenabled] = 1
                AND [ru].[objectdepartemenfk] = 18
                AND ru.id NOT IN (251,322,12,448,453)
                ) as x
                            ORDER BY
                            x.bulan,x.tgls,x.namaruangan
            "));
        }else if($request['idRuangan']=='27'){
            $data = DB::select(DB::raw("
            select * from (
                SELECT
                                    Format (pd.tglregistrasi,'MMM yyyy') AS tglpelayanan,
                                                        Format (pd.tglregistrasi, 'MMM') AS tanggal,
                                                        to_date(cast(pd.tglregistrasi as TEXT),'dd')AS tgls,
                                                        to_date(cast(pd.tglregistrasi as TEXT),'MM')AS bulan,
                                                        pd.tglregistrasi AS tgl,ru.namaruangan
                FROM
                    [pasiendaftar_t] AS [pd]
                INNER JOIN [pasien_m] AS [ps] ON [ps].[id] = [pd].[nocmfk]
                INNER JOIN [ruangan_m] AS [ru] ON ru.id = [pd].[objectruanganlastfk]
                LEFT JOIN [ruangan_m] AS [ruu] ON [ruu].[id] = [pd].[objectruanganasalfk]
                INNER JOIN [departemen_m] AS [dp] ON [dp].[id] = [ru].[objectdepartemenfk]
                WHERE
                    [pd].[tglregistrasi] BETWEEN '2021-01-14 00:00'
                AND '$tglAkhir'
                AND [pd].[statusenabled] = 1
                AND [ru].[objectdepartemenfk] = 27
                AND ru.id NOT IN (251,322,12,448,453)
                ) as x
                            ORDER BY
                            x.bulan,x.tgls,x.namaruangan
            "));
        }else if($request['idRuangan']=='277'){
            $data = DB::select(DB::raw("
            select * from (
                SELECT 
                Format (pd.tglregistrasi,'MMM yyyy') AS tglpelayanan,
                Format (pd.tglregistrasi, 'MMM') AS tanggal,
                to_date(cast(pd.tglregistrasi as TEXT),'dd')AS tgls,
                to_date(cast(pd.tglregistrasi as TEXT),'MM')AS bulan,
                pd.tglregistrasi AS tgl,ru.namaruangan
                FROM departemen_m dp
                join ruangan_m as ru on ru.objectdepartemenfk=dp.id
                LEFT JOIN (SELECT antrianpasiendiperiksa_t.norec,objectruanganfk,antrianpasiendiperiksa_t.tglregistrasi FROM antrianpasiendiperiksa_t
                left join batalregistrasi_t as br on br.pasiendaftarfk=antrianpasiendiperiksa_t.noregistrasifk
                where tglregistrasi BETWEEN '2021-01-14 00:00' and '$tglAkhir' and br.norec is null) pd ON (ru.id= pd.objectruanganfk)
                WHERE dp.id =27 and pd.norec is not null
                )as x
                ORDER BY
                x.bulan,x.tgls,x.namaruangan
            "));
        }else if($request['idRuangan']=='1000'){
            $data = DB::select(DB::raw("
            select * from (
                SELECT
                                    Format (pd.tglregistrasi,'MMM yyyy') AS tglpelayanan,
                                                        Format (pd.tglregistrasi, 'MMM') AS tanggal,
                                                        to_date(cast(pd.tglregistrasi as TEXT),'dd')AS tgls,
                                                        to_date(cast(pd.tglregistrasi as TEXT),'MM')AS bulan,
                                                        pd.tglregistrasi AS tgl,ru.namaruangan
                FROM
                    [pasiendaftar_t] AS [pd]
                INNER JOIN [pasien_m] AS [ps] ON [ps].[id] = [pd].[nocmfk]
                INNER JOIN [ruangan_m] AS [ru] ON ru.id = [pd].[objectruanganlastfk]
                LEFT JOIN [ruangan_m] AS [ruu] ON [ruu].[id] = [pd].[objectruanganasalfk]
                INNER JOIN [departemen_m] AS [dp] ON [dp].[id] = [ru].[objectdepartemenfk]
                WHERE
                    [pd].[tglregistrasi] BETWEEN '2021-01-14 00:00'
                AND '$tglAkhir'
                AND [pd].[statusenabled] = 1
                AND ru.id IN (717,722,724,758,759,760,761,762,763,764,781)
                ) as x
                            ORDER BY
                            x.bulan,x.tgls,x.namaruangan
            "));
        }else if($request['idRuangan']=='999'){
            $data = DB::select(DB::raw("
            select * from (
                SELECT
                                    Format (pd.tglregistrasi,'MMM yyyy') AS tglpelayanan,
                                                        Format (pd.tglregistrasi, 'MMM') AS tanggal,
                                                        to_date(cast(pd.tglregistrasi as TEXT),'dd')AS tgls,
                                                        to_date(cast(pd.tglregistrasi as TEXT),'MM')AS bulan,
                                                        pd.tglregistrasi AS tgl,ru.namaruangan
                FROM
                    [pasiendaftar_t] AS [pd]
                INNER JOIN [pasien_m] AS [ps] ON [ps].[id] = [pd].[nocmfk]
                INNER JOIN [ruangan_m] AS [ru] ON ru.id = [pd].[objectruanganlastfk]
                LEFT JOIN [ruangan_m] AS [ruu] ON [ruu].[id] = [pd].[objectruanganasalfk]
                INNER JOIN [departemen_m] AS [dp] ON [dp].[id] = [ru].[objectdepartemenfk]
                WHERE
                    [pd].[tglregistrasi] BETWEEN '2021-01-14 00:00'
                AND '$tglAkhir'
                AND [pd].[statusenabled] = 1
                AND [ru].[objectruanganfk] = 19
                ) as x
                            ORDER BY
                            x.bulan,x.tgls,x.namaruangan
            "));
        }else if($request['idRuangan']=='3'){
            $data = DB::select(DB::raw("
            select * from (
                SELECT
                                    Format (pd.tglregistrasi,'MMM yyyy') AS tglpelayanan,
                                                        Format (pd.tglregistrasi, 'MMM') AS tanggal,
                                                        to_date(cast(pd.tglregistrasi as TEXT),'dd')AS tgls,
                                                        to_date(cast(pd.tglregistrasi as TEXT),'MM')AS bulan,
                                                        pd.tglregistrasi AS tgl,ru.namaruangan
                FROM
                    [pasiendaftar_t] AS [pd]
                INNER JOIN [pasien_m] AS [ps] ON [ps].[id] = [pd].[nocmfk]
                INNER JOIN [ruangan_m] AS [ru] ON ru.id = [pd].[objectruanganlastfk]
                LEFT JOIN [ruangan_m] AS [ruu] ON [ruu].[id] = [pd].[objectruanganasalfk]
                INNER JOIN [departemen_m] AS [dp] ON [dp].[id] = [ru].[objectdepartemenfk]
                WHERE
                    [pd].[tglregistrasi] BETWEEN '2021-01-14 00:00'
                AND '$tglAkhir'
                AND [pd].[statusenabled] = 1
                AND ru.id=575
                ) as x
                            ORDER BY
                            x.bulan,x.tgls,x.namaruangan
            "));
        }else if($request['idRuangan']=='575'){
            $data = DB::select(DB::raw("
            select * from (
                SELECT 
                Format (pd.tglregistrasi,'MMM yyyy') AS tglpelayanan,
                Format (pd.tglregistrasi, 'MMM') AS tanggal,
                to_date(cast(pd.tglregistrasi as TEXT),'dd')AS tgls,
                to_date(cast(pd.tglregistrasi as TEXT),'MM')AS bulan,
                pd.tglregistrasi AS tgl,ru.namaruangan
                FROM departemen_m dp
                join ruangan_m as ru on ru.objectdepartemenfk=dp.id
                LEFT JOIN (SELECT antrianpasiendiperiksa_t.norec,objectruanganfk,antrianpasiendiperiksa_t.tglregistrasi FROM antrianpasiendiperiksa_t
                left join batalregistrasi_t as br on br.pasiendaftarfk=antrianpasiendiperiksa_t.noregistrasifk
                where tglregistrasi BETWEEN '2021-01-14 00:00' and '$tglAkhir' and br.norec is null) pd ON (ru.id= pd.objectruanganfk)
                WHERE ru.id =575 and pd.norec is not null
                )as x
                ORDER BY
                x.bulan,x.tgls,x.namaruangan
            "));
        }else if($request['idRuangan']=='453'){
            $data = DB::select(DB::raw("
            select * from (
                SELECT 
                Format (pd.tglregistrasi,'MMM yyyy') AS tglpelayanan,
                Format (pd.tglregistrasi, 'MMM') AS tanggal,
                to_date(cast(pd.tglregistrasi as TEXT),'dd')AS tgls,
                to_date(cast(pd.tglregistrasi as TEXT),'MM')AS bulan,
                pd.tglregistrasi AS tgl,ru.namaruangan
                FROM departemen_m dp
                join ruangan_m as ru on ru.objectdepartemenfk=dp.id
                LEFT JOIN (SELECT antrianpasiendiperiksa_t.norec,objectruanganfk,antrianpasiendiperiksa_t.tglregistrasi FROM antrianpasiendiperiksa_t
                left join batalregistrasi_t as br on br.pasiendaftarfk=antrianpasiendiperiksa_t.noregistrasifk
                where tglregistrasi BETWEEN '2021-01-14 00:00' and '$tglAkhir' and br.norec is null) pd ON (ru.id= pd.objectruanganfk)
                WHERE ru.id =453 and pd.norec is not null
                )as x
                ORDER BY
                x.bulan,x.tgls,x.namaruangan
            "));
        }else if($request['idRuangan']=='4533'){
            $data = DB::select(DB::raw("
            select * from (
                SELECT
                                    Format (pd.tglregistrasi,'MMM yyyy') AS tglpelayanan,
                                                        Format (pd.tglregistrasi, 'MMM') AS tanggal,
                                                        to_date(cast(pd.tglregistrasi as TEXT),'dd')AS tgls,
                                                        to_date(cast(pd.tglregistrasi as TEXT),'MM')AS bulan,
                                                        pd.tglregistrasi AS tgl,ru.namaruangan
                FROM
                    [pasiendaftar_t] AS [pd]
                INNER JOIN [pasien_m] AS [ps] ON [ps].[id] = [pd].[nocmfk]
                INNER JOIN [ruangan_m] AS [ru] ON ru.id = [pd].[objectruanganlastfk]
                LEFT JOIN [ruangan_m] AS [ruu] ON [ruu].[id] = [pd].[objectruanganasalfk]
                INNER JOIN [departemen_m] AS [dp] ON [dp].[id] = [ru].[objectdepartemenfk]
                WHERE
                    [pd].[tglregistrasi] BETWEEN '2021-01-14 00:00'
                AND '$tglAkhir'
                AND [pd].[statusenabled] = 1
                AND ru.id =453
                ) as x
                            ORDER BY
                            x.bulan,x.tgls,x.namaruangan
            "));
        }else if($request['idRuangan']=='28'){
            $data = DB::select(DB::raw("
            select * from (
                SELECT 
                Format (pd.tglregistrasi,'MMM yyyy') AS tglpelayanan,
                Format (pd.tglregistrasi, 'MMM') AS tanggal,
                to_date(cast(pd.tglregistrasi as TEXT),'dd')AS tgls,
                to_date(cast(pd.tglregistrasi as TEXT),'MM')AS bulan,
                pd.tglregistrasi AS tgl,ru.namaruangan
                FROM departemen_m dp
                join ruangan_m as ru on ru.objectdepartemenfk=dp.id
                LEFT JOIN (SELECT antrianpasiendiperiksa_t.norec,objectruanganfk,antrianpasiendiperiksa_t.tglregistrasi FROM antrianpasiendiperiksa_t
                left join batalregistrasi_t as br on br.pasiendaftarfk=antrianpasiendiperiksa_t.noregistrasifk
                where tglmasuk BETWEEN '2021-01-14 00:00' and '$tglAkhir' and br.norec is null) pd ON (ru.id= pd.objectruanganfk)
                WHERE dp.id =28 and pd.norec is not null
                )as x
                ORDER BY
                x.bulan,x.tgls,x.namaruangan
            "));
        }else if($request['idRuangan']=='12'){
            $data = DB::select(DB::raw("
            select * from (
                SELECT 
                Format (pd.tglregistrasi,'MMM yyyy') AS tglpelayanan,
                Format (pd.tglregistrasi, 'MMM') AS tanggal,
                to_date(cast(pd.tglregistrasi as TEXT),'dd')AS tgls,
                to_date(cast(pd.tglregistrasi as TEXT),'MM')AS bulan,
                pd.tglregistrasi AS tgl,ru.namaruangan
                FROM departemen_m dp
                join ruangan_m as ru on ru.objectdepartemenfk=dp.id
                LEFT JOIN (SELECT antrianpasiendiperiksa_t.norec,objectruanganfk,antrianpasiendiperiksa_t.tglregistrasi FROM antrianpasiendiperiksa_t
                left join batalregistrasi_t as br on br.pasiendaftarfk=antrianpasiendiperiksa_t.noregistrasifk
                where tglregistrasi BETWEEN '2021-01-14 00:00' and '$tglAkhir' and br.norec is null) pd ON (ru.id= pd.objectruanganfk)
                WHERE ru.id =12 and pd.norec is not null
                )as x
                ORDER BY
                x.bulan,x.tgls,x.namaruangan
            "));
        }else if($request['idRuangan']=='322'){
            $data = DB::select(DB::raw("
            select * from (
                SELECT
                                    Format (pd.tglregistrasi,'MMM yyyy') AS tglpelayanan,
                                                        Format (pd.tglregistrasi, 'MMM') AS tanggal,
                                                        to_date(cast(pd.tglregistrasi as TEXT),'dd')AS tgls,
                                                        to_date(cast(pd.tglregistrasi as TEXT),'MM')AS bulan,
                                                        pd.tglregistrasi AS tgl,ru.namaruangan
                FROM
                    [pasiendaftar_t] AS [pd]
                INNER JOIN [pasien_m] AS [ps] ON [ps].[id] = [pd].[nocmfk]
                INNER JOIN [ruangan_m] AS [ru] ON ru.id = [pd].[objectruanganlastfk]
                LEFT JOIN [ruangan_m] AS [ruu] ON [ruu].[id] = [pd].[objectruanganasalfk]
                INNER JOIN [departemen_m] AS [dp] ON [dp].[id] = [ru].[objectdepartemenfk]
                WHERE
                    [pd].[tglregistrasi] BETWEEN '2021-01-14 00:00'
                AND '$tglAkhir'
                AND [pd].[statusenabled] = 1
                AND ru.id=322
                ) as x
                            ORDER BY
                            x.bulan,x.tgls,x.namaruangan
            "));
        }else if($request['idRuangan']=='448'){
            $data = DB::select(DB::raw("
            select * from (
                SELECT
                                    Format (pd.tglregistrasi,'MMM yyyy') AS tglpelayanan,
                                                        Format (pd.tglregistrasi, 'MMM') AS tanggal,
                                                        to_date(cast(pd.tglregistrasi as TEXT),'dd')AS tgls,
                                                        to_date(cast(pd.tglregistrasi as TEXT),'MM')AS bulan,
                                                        pd.tglregistrasi AS tgl,ru.namaruangan
                FROM
                    [pasiendaftar_t] AS [pd]
                INNER JOIN [pasien_m] AS [ps] ON [ps].[id] = [pd].[nocmfk]
                INNER JOIN [ruangan_m] AS [ru] ON ru.id = [pd].[objectruanganlastfk]
                LEFT JOIN [ruangan_m] AS [ruu] ON [ruu].[id] = [pd].[objectruanganasalfk]
                INNER JOIN [departemen_m] AS [dp] ON [dp].[id] = [ru].[objectdepartemenfk]
                WHERE
                    [pd].[tglregistrasi] BETWEEN '2021-01-14 00:00'
                AND '$tglAkhir'
                AND [pd].[statusenabled] = 1
                AND ru.id=448
                ) as x
                            ORDER BY
                            x.bulan,x.tgls,x.namaruangan
            "));
        }else if($request['idRuangan']=='496'){
            $data = DB::select(DB::raw("
            select * from (
                SELECT 
                Format (pd.tglregistrasi,'MMM yyyy') AS tglpelayanan,
                Format (pd.tglregistrasi, 'MMM') AS tanggal,
                to_date(cast(pd.tglregistrasi as TEXT),'dd')AS tgls,
                to_date(cast(pd.tglregistrasi as TEXT),'MM')AS bulan,
                pd.tglregistrasi AS tgl,ru.namaruangan
                FROM departemen_m dp
                join ruangan_m as ru on ru.objectdepartemenfk=dp.id
                LEFT JOIN (SELECT antrianpasiendiperiksa_t.norec,objectruanganfk,antrianpasiendiperiksa_t.tglregistrasi FROM antrianpasiendiperiksa_t
                left join batalregistrasi_t as br on br.pasiendaftarfk=antrianpasiendiperiksa_t.noregistrasifk
                where tglregistrasi BETWEEN '2021-01-14 00:00' and '$tglAkhir' and br.norec is null) pd ON (ru.id= pd.objectruanganfk)
                WHERE ru.id =496 and pd.norec is not null
                )as x
                ORDER BY
                x.bulan,x.tgls,x.namaruangan
            "));
        }else if($request['idRuangan']=='44'){
            $data = DB::select(DB::raw("
            select * from (
                SELECT 
                Format (pd.tglregistrasi,'MMM yyyy') AS tglpelayanan,
                Format (pd.tglregistrasi, 'MMM') AS tanggal,
                to_date(cast(pd.tglregistrasi as TEXT),'dd')AS tgls,
                to_date(cast(pd.tglregistrasi as TEXT),'MM')AS bulan,
                pd.tglregistrasi AS tgl,ru.namaruangan
                FROM departemen_m dp
                join ruangan_m as ru on ru.objectdepartemenfk=dp.id
                LEFT JOIN (SELECT antrianpasiendiperiksa_t.norec,objectruanganfk,antrianpasiendiperiksa_t.tglregistrasi FROM antrianpasiendiperiksa_t
                left join batalregistrasi_t as br on br.pasiendaftarfk=antrianpasiendiperiksa_t.noregistrasifk
                where tglregistrasi BETWEEN '2021-01-14 00:00' and '$tglAkhir' and br.norec is null) pd ON (ru.id= pd.objectruanganfk)
                WHERE ru.id in (44,277,447) and pd.norec is not null
                )as x
                ORDER BY
                x.bulan,x.tgls,x.namaruangan
            "));
        }else if($request['idRuangan']=='320'){
            $data = DB::select(DB::raw("
            select * from (
                SELECT 
                Format (pd.tglregistrasi,'MMM yyyy') AS tglpelayanan,
                Format (pd.tglregistrasi, 'MMM') AS tanggal,
                to_date(cast(pd.tglregistrasi as TEXT),'dd')AS tgls,
                to_date(cast(pd.tglregistrasi as TEXT),'MM')AS bulan,
                pd.tglregistrasi AS tgl,ru.namaruangan
                FROM departemen_m dp
                join ruangan_m as ru on ru.objectdepartemenfk=dp.id
                LEFT JOIN (SELECT antrianpasiendiperiksa_t.norec,objectruanganfk,antrianpasiendiperiksa_t.tglregistrasi FROM antrianpasiendiperiksa_t
                left join batalregistrasi_t as br on br.pasiendaftarfk=antrianpasiendiperiksa_t.noregistrasifk
                where tglregistrasi BETWEEN '2021-01-14 00:00' and '$tglAkhir' and br.norec is null) pd ON (ru.id= pd.objectruanganfk)
                WHERE ru.id =320 and pd.norec is not null
                )as x
                ORDER BY
                x.bulan,x.tgls,x.namaruangan
            "));
        }else if($request['idRuangan']=='251'){
            $data = DB::select(DB::raw("
            select * from (
                SELECT 
                Format (pd.tglregistrasi,'MMM yyyy') AS tglpelayanan,
                Format (pd.tglregistrasi, 'MMM') AS tanggal,
                to_date(cast(pd.tglregistrasi as TEXT),'dd')AS tgls,
                to_date(cast(pd.tglregistrasi as TEXT),'MM')AS bulan,
                pd.tglregistrasi AS tgl,ru.namaruangan
                FROM departemen_m dp
                join ruangan_m as ru on ru.objectdepartemenfk=dp.id
                LEFT JOIN (SELECT antrianpasiendiperiksa_t.norec,objectruanganfk,antrianpasiendiperiksa_t.tglregistrasi FROM antrianpasiendiperiksa_t
                left join batalregistrasi_t as br on br.pasiendaftarfk=antrianpasiendiperiksa_t.noregistrasifk
                where tglregistrasi BETWEEN '2021-01-14 00:00' and '$tglAkhir' and br.norec is null) pd ON (ru.id= pd.objectruanganfk)
                WHERE ru.id =251 and pd.norec is not null
                )as x
                ORDER BY
                x.bulan,x.tgls,x.namaruangan
            "));
        }else if($request['idRuangan']=='5'){
            $data = DB::select(DB::raw("
            select * from (
                SELECT 
                Format (pd.tglregistrasi,'MMM yyyy') AS tglpelayanan,
                Format (pd.tglregistrasi, 'MMM') AS tanggal,
                to_date(cast(pd.tglregistrasi as TEXT),'dd')AS tgls,
                to_date(cast(pd.tglregistrasi as TEXT),'MM')AS bulan,
                pd.tglregistrasi AS tgl,ru.namaruangan
                FROM departemen_m dp
                join ruangan_m as ru on ru.objectdepartemenfk=dp.id
                LEFT JOIN (SELECT antrianpasiendiperiksa_t.norec,objectruanganfk,antrianpasiendiperiksa_t.tglregistrasi FROM antrianpasiendiperiksa_t
                left join batalregistrasi_t as br on br.pasiendaftarfk=antrianpasiendiperiksa_t.noregistrasifk
                where tglmasuk BETWEEN '2021-01-14 00:00' and '$tglAkhir' and br.norec is null) pd ON (ru.id= pd.objectruanganfk)
                WHERE dp.id =5 and pd.norec is not null
                )as x
                ORDER BY
                x.bulan,x.tgls,x.namaruangan
            "));
        }else{
            $data=[];
        }
        
        $data10=[];
        $sudahPeriksa = 0;
        $belumPeriksa = 0;
        $batalRegis = 0;
        $totalAll = 0;
        if (count($data) > 0) {
            foreach ($data as $item) {
                $sama = false;
                $i = 0;
                foreach ($data10 as $hideung) {
                    if ($item->tglpelayanan == $data10[$i]['tglpelayanan']) {
                        $sama = 1;
                        $jml = (float)$hideung['totalterdaftar'] + 1;
                        $data10[$i]['totalterdaftar'] = $jml;
                        // if ($item->keterangan == 'sudahdiperiksa') {
                        //     $data10[$i]['diperiksa'] = (float)$hideung['diperiksa'] + 1;
                        // }
                        // if ($item->keterangan == 'belumdiperiksa') {
                        //     $data10[$i]['belumperiksa'] = (float)$hideung['belumperiksa'] + 1;
                        // }
                        // if ($item->keterangan == 'batalregis') {
                        //     $data10[$i]['batalregistrasi'] = (float)$hideung['batalregistrasi'] + 1;
                        // }
                    }
                    $i = $i + 1;
                }
                if ($sama == false) {
                    // if ($item->keterangan == 'sudahdiperiksa') {
                    //     $sudahPeriksa = 1;
                    //     $belumPeriksa = 0;
                    //     $batalRegis = 0;
                    // }
                    // if ($item->keterangan == 'belumdiperiksa') {
                    //     $sudahPeriksa = 0;
                    //     $belumPeriksa = 1;
                    //     $batalRegis = 0;
                    // }
                    // if ($item->keterangan == 'batalregis') {
                    //     $sudahPeriksa = 0;
                    //     $belumPeriksa = 0;
                    //     $batalRegis = 1;
                    // }
                    $data10[] = array(
                        'tglpelayanan' => $item->tglpelayanan,
                        'tanggal' =>$item->tanggal,
                        'totalterdaftar' => 1,
                        // 'diperiksa' => $sudahPeriksa,
                        // 'belumperiksa' => $belumPeriksa,
                        // 'batalregistrasi' => $batalRegis,

                    );
                }

            }
        }
        return $this->respond($data10);

    }
    public function getInfoKunjunganRawatJalanPerhari(Request $request)
    {
        $idDepRaJal = 18;
        $tglAwal = $request['tgl'].' 00:00';
        $tglAkhir =$request['tgl'].' 23:59';
//         $data = \DB::table('pasiendaftar_t as pds')
// //            ->join('antrianpasiendiperiksa_t as apd','apd.noregistrasifk','=','pd.norec')
//             ->join('ruangan_m as ru','ru.id','=','pd.objectruanganlastfk')
//             ->join ( 'pasien_m as ps','ps.id','=','pd.nocmfk')
//             ->leftJoin('batalregistrasi_t as br','br.pasiendaftarfk','=','pd.norec')
//             ->select('pd.noregistrasi','ps.namapasien','br.norec as norec_batal','pd.nostruklastfk',
//                 'ru.namaruangan','pd.objectruanganlastfk as kdruangan')
//             ->whereBetween('pd.tglregistrasi',[ $tglAwal, $tglAkhir ])
//             ->where('ru.objectdepartemenfk',$idDepRaJal);
// //            ->groupBy('pd.noregistrasi','ps.namapasien','br.norec','pd.nostruklastfk',
// //                'ru.namaruangan','pd.objectruanganlastfk',);
//         $data= $data->get();
        // $data = DB::select(DB::raw("
        
        //             select * from (SELECT
        //             pd.noregistrasi,
        //             ps.namapasien,
        //             br.norec AS norec_batal,
        //             pd.nostruklastfk,
        //             ru.namaruangan,
        //             apd.tgldipanggilsuster,
        //             pd.objectruanganlastfk AS kdruangan,row_number() over (partition by pd.noregistrasi order by apd.tglmasuk desc) as rownum , kendalidokumenrekammedis_t.objectstatuskendalidokumenfk, pd.statusenabled,
        //             CASE
        //             WHEN kendalidokumenrekammedis_t.objectstatuskendalidokumenfk <> 1
        //             AND br.norec IS NULL THEN
        //                 'sudahdiperiksa'
        //             WHEN pd.statusenabled=true and kendalidokumenrekammedis_t.objectstatuskendalidokumenfk <> 9
        //             OR kendalidokumenrekammedis_t.objectstatuskendalidokumenfk IS NULL
        //             AND br.norec IS NULL THEN
        //                 'belumdiperiksa'
        //             WHEN br.pasiendaftarfk IS NOT NULL THEN
        //                 'batalregis'
        //             END AS keterangan
        //             FROM            pasiendaftar_ AS pd INNER JOIN
        //              antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec INNER JOIN
        //              ruangan_m AS ru ON ru.id = pd.objectruanganlastfk INNER JOIN
        //              pasien_m AS ps ON ps.id = pd.nocmfk LEFT OUTER JOIN
        //              kendalidokumenrekammedis_t ON apd.norec = kendalidokumenrekammedis_t.noregistrasifk LEFT OUTER JOIN
        //              batalregistrasi_t AS br ON br.pasiendaftarfk = pd.norec
        //             WHERE
        //             pd.tglregistrasi BETWEEN '$tglAwal'
        //             AND '$tglAkhir'
        //             AND ru.objectdepartemenfk = 18) as x where x.rownum=1
        //             ORDER BY
        //             x.noregistrasi"));

        $data = DB::select(DB::raw("
                SELECT
            *
        FROM
            (
                SELECT
                    pd.norec,
                    pd.noregistrasi,
                    to_date(cast(pd.tglregistrasi as TEXT),'dd, MMM yyyy') ,
                    to_date(cast(pd.tglregistrasi as TEXT),'dd. MMM') ,
                   
                    pd.tglregistrasi AS tgl,
                    br.pasiendaftarfk,
                    ru.namaruangan,
                    pd.objectruanganlastfk AS kdruangan,
                    CASE
                WHEN kendalidokumenrekammedis_t.objectstatuskendalidokumenfk <> 1
                AND br.norec IS NULL THEN
                    'sudahdiperiksa'
                WHEN pd.statusenabled=true
                AND kendalidokumenrekammedis_t.objectstatuskendalidokumenfk <> 9
                OR kendalidokumenrekammedis_t.objectstatuskendalidokumenfk IS NULL
                AND br.norec IS NULL THEN
                    'belumdiperiksa'
                WHEN br.pasiendaftarfk IS NOT NULL THEN
                    'batalregis'
                END AS keterangan,
                ps.namapasien,
                row_number () OVER (
                    partition BY pd.noregistrasi
                    ORDER BY
                        apd.tglmasuk DESC
                ) AS rownum,
               
to_date(cast(pd.tglregistrasi as TEXT),'dd')AS tgls,
to_date(cast(pd.tglregistrasi as TEXT),'MM')AS bulan
            FROM
                pasiendaftar_t AS pd
            INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
            INNER JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
            INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
            LEFT OUTER JOIN kendalidokumenrekammedis_t ON apd.norec = kendalidokumenrekammedis_t.noregistrasifk
            LEFT OUTER JOIN batalregistrasi_t AS br ON br.pasiendaftarfk = pd.norec
            WHERE
                pd.tglregistrasi BETWEEN '$tglAwal'
                AND '$tglAkhir'
            AND ru.objectdepartemenfk = '18'
            ) AS x
        WHERE
            x.rownum = 1
        ORDER BY
            x.bulan,
            x.tgls,
            x.keterangan"));

        $data10=[];
        $sudahPeriksa = 0;
        $belumPeriksa = 0;
        $batalRegis = 0;
        $totalAll = 0;
        if (count($data) > 0) {
            foreach ($data as $item) {
                $sama = false;
                $i = 0;
                foreach ($data10 as $hideung) {
                    if ($item->kdruangan == $data10[$i]['kdruangan']) {
                        $sama = 1;
                        $jml = (float)$hideung['total'] + 1;
                        $data10[$i]['total'] = $jml;
                        if ($item->keterangan == 'sudahdiperiksa') {
//                         if ($item->statusantrian != '0' && $item->norec_batal == null) {
                            $data10[$i]['diperiksa'] = (float)$hideung['diperiksa'] + 1;

                        }
                        if ($item->keterangan == 'belumdiperiksa') {
//                        if ($item->statusantrian == '0' && $item->norec_batal == null) {
                            $data10[$i]['belumperiksa'] = (float)$hideung['belumperiksa'] + 1;
                        }
                        if ($item->keterangan == 'batalregis') {
                            $data10[$i]['batalregistrasi'] = (float)$hideung['batalregistrasi'] + 1;
                        }
                        //                    $data10[$i]['totalAll'] = $data10[$i]['diperiksa'] + $data10[$i]['belumperiksa'] + $data10[$i]['batalregistrasi'];
                    }
                    $i = $i + 1;
                }
                if ($sama == false) {
                    if ($item->keterangan == 'sudahdiperiksa') {
                        $sudahPeriksa = 1;
                        $belumPeriksa = 0;
                        $batalRegis = 0;
                    }
                    if ($item->keterangan == 'belumdiperiksa') {
                        $sudahPeriksa = 0;
                        $belumPeriksa = 1;
                        $batalRegis = 0;
                    }
                    if ($item->keterangan == 'batalregis') {
                        $sudahPeriksa = 0;
                        $belumPeriksa = 0;
                        $batalRegis = 1;
                    }
                    $data10[] = array(
                        'kdruangan' => $item->kdruangan,
                        'namaruangan' => $item->namaruangan,
                        'total' => 1,
                        'diperiksa' => $sudahPeriksa,
                        'belumperiksa' => $belumPeriksa,
                        'batalregistrasi' => $batalRegis,
//                        'count' => $totalAll,
                    );
                }
                foreach ($data10 as $key => $row) {
                    $count[$key] = $row['total'];
                }
                array_multisort($count, SORT_DESC, $data10);
            }
        }else{
            $data10[] = array(
                'kdruangan' => '-',
                'namaruangan' => 'Tidak Ada Data',
                'total' => 0,
                'diperiksa' => 0,
                'belumperiksa' => 0,
                'batalregistrasi' => 0,
            );
        }
        $result = array(
            'result' => $data10,
            'date' => date('d F Y'),
            'message' => 'ramdanegie',
        );
        return $this->respond($data10);
    }
    public function getKunjunganRSPerJenisPasien(Request $request)
    {
        // $tglAwal =  date('Y-m-d'.' 00:00');
        $tglAwal = $request['tgl'].' 00:00';//Carbon::now()->subMonth(2);
        $tglAkhir =$request['tgl'].' 23:59';
        $dataALL = DB::select(DB::raw("select x.kelompokpasien ,count(x.kelompokpasien) as jumlah from (
                select pd.noregistrasi, 
                 kps.kelompokpasien, 
                 pd.objectkelompokpasienlastfk, 
               to_date(cast(pd.tglregistrasi as TEXT),'YYYY')AS tahunregis
                 from pasiendaftar_t as pd
                 inner join kelompokpasien_m as kps on kps.id = pd.objectkelompokpasienlastfk
                left join batalregistrasi_t as br on br.pasiendaftarfk=pd.norec
				 --left join pemakaianasuransi_t as pa on pa.noregistrasifk=pd.norec
                 WHERE pd.tglregistrasi BETWEEN '$tglAwal'AND '$tglAkhir'
                and br.norec is null
                )as  x
                GROUP BY x.kelompokpasien"));


        $data = \DB::table('pasiendaftar_t as pd')
            ->join('kelompokpasien_m as kps','kps.id','=','pd.objectkelompokpasienlastfk')
            ->join('ruangan_m as ru','ru.id','=','pd.objectruanganlastfk')
            ->join('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
            ->select('pd.noregistrasi','kps.kelompokpasien',
                'pd.objectkelompokpasienlastfk','dp.id',
                'dp.namadepartemen',
                'pd.norec as norec_pd',
                DB::raw("to_date(cast(pd.tglregistrasi as TEXT),'YYYY')AS tahunregis"))
             ->where('pd.statusenabled',1)
            ->whereBetween('pd.tglregistrasi',[ $tglAwal, $tglAkhir ]);

        $data = $data ->get();

        $data10=[];
        $jmlBPJS  = 0;
        $jmlAsuransiLain  = 0;
        $jmlTahanan  = 0;
        $jmlUmum  = 0;
        $jmlAtensi  = 0;
//         if (count($data) > 0) {
        foreach ($data as $item) {
            $sama = false;
            $i = 0;
            foreach ($data10 as $hideung) {
                if ($item->id == $data10[$i]['id']) {
                    $sama = 1;
                    $jml = (float)$hideung['total'] + 1;
                    $data10[$i]['total'] = $jml;
                    if ($item->objectkelompokpasienlastfk == 1) {
                        $data10[$i]['jmlUmum'] = (float)$hideung['jmlUmum'] + 1;
                    }
                    if ($item->objectkelompokpasienlastfk == 2) {
                        $data10[$i]['jmlBPJS'] = (float)$hideung['jmlBPJS'] + 1;
                    }
                    if ($item->objectkelompokpasienlastfk == 3 || $item->objectkelompokpasienlastfk == 4 || $item->objectkelompokpasienlastfk == 11 || $item->objectkelompokpasienlastfk == 12 || $item->objectkelompokpasienlastfk == 13 || $item->objectkelompokpasienlastfk == 14) {
                        $data10[$i]['jmlAsuransiLain'] = (float)$hideung['jmlAsuransiLain'] + 1;
                    }
                    if ($item->objectkelompokpasienlastfk == 9) {
                        $data10[$i]['jmlTahanan'] = (float)$hideung['jmlTahanan'] + 1;
                    }
                    if ($item->objectkelompokpasienlastfk == 10) {
                        $data10[$i]['jmlAtensi'] = (float)$hideung['jmlAtensi'] + 1;
                    }
                }
                $i = $i + 1;
            }
            if ($sama == false) {
                if ($item->objectkelompokpasienlastfk == 1) {
                    $jmlBPJS  = 0;
                    $jmlAsuransiLain  = 0;
                    $jmlTahanan  = 0;
                    $jmlUmum  = 1;
                    $jmlAtensi  = 0;
                }
                if ($item->objectkelompokpasienlastfk == 2) {
                    $jmlBPJS  = 1;
                    $jmlAsuransiLain  = 0;
                    $jmlTahanan  = 0;
                    $jmlUmum  = 0;
                    $jmlAtensi  = 0;
                }
                if ($item->objectkelompokpasienlastfk == 3 || $item->objectkelompokpasienlastfk == 4 || $item->objectkelompokpasienlastfk == 11 || $item->objectkelompokpasienlastfk == 12 || $item->objectkelompokpasienlastfk == 13 || $item->objectkelompokpasienlastfk == 14) {
                    $jmlBPJS  = 0;
                    $jmlAsuransiLain  = 1;
                    $jmlTahanan  = 0;
                    $jmlUmum  = 0;
                    $jmlAtensi  = 0;
                }
                if ($item->objectkelompokpasienlastfk == 9) {
                    $jmlBPJS  = 0;
                    $jmlAsuransiLain  = 0;
                    $jmlTahanan  = 1;
                    $jmlUmum  = 0;
                    $jmlAtensi  = 0;
                }
                if ($item->objectkelompokpasienlastfk == 10) {
                    $jmlBPJS  = 0;
                    $jmlAsuransiLain  = 0;
                    $jmlTahanan  = 0;
                    $jmlUmum  = 0;
                    $jmlAtensi  = 1;
                }
                $data10[] = array(
                    'id' => $item->id,
                    'namadepartemen' => $item->namadepartemen,
                    'total' => 1,
                    'jmlBPJS' => $jmlBPJS,
                    'jmlAsuransiLain' => $jmlAsuransiLain,
                    'jmlTahanan' => $jmlTahanan,
                    'jmlUmum' => $jmlUmum,
                    'jmlAtensi' => $jmlAtensi,
                );
            }
            foreach ($data10 as $key => $row) {
                $count[$key] = $row['total'];
            }
            array_multisort($count, SORT_DESC, $data10);
        }

        $result = array(
            'dataAll' => $dataALL,
            'data' => $data10,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }


    public function getPasienMasihDirawat(Request $request)
    {
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as p', 'p.id', '=', 'pd.nocmfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->join('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->join('jeniskelamin_m as jk', 'jk.id', '=', 'p.objectjeniskelaminfk')
            ->leftJoin('pegawai_m as pg','pg.id','=','pd.objectpegawaifk')
            ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftJoin('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            ->join('antrianpasiendiperiksa_t as apd', 'pd.norec', '=',
                DB::raw("apd.noregistrasifk and apd.objectruanganfk=pd.objectruanganlastfk"))
//            ->leftjoin('registrasipelayananpasien_t as rpp', 'rpp.noregistrasifk', '=',
//                DB::raw("pd.norec and rpp.objectruanganfk=pd.objectruanganlastfk"))
            ->leftjoin('kamar_m as kmr', 'kmr.id', '=', 'apd.objectkamarfk')
//            ->leftjoin('tempattidur_m as tt', 'tt.id', '=', 'rpp.objecttempattidurfk')
            ->select('pd.tglregistrasi', 'p.nocm', 'pd.noregistrasi', 'ru.namaruangan',
                'p.namapasien', 'kp.kelompokpasien','kmr.namakamar',
                'kls.namakelas','jk.jeniskelamin','pg.namalengkap','apd.nobed',
                'p.tgllahir')
            ->whereNull('pd.tglpulang');

        $filter = $request->all();
//        if(isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
//            $data = $data->where('pd.tglregistrasi', '>=', $filter['tglAwal']);
//        }
//
//        if(isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
//            $tgl = $filter['tglAkhir'] ;//. " 23:59:59";
//            $data = $data->where('pd.tglregistrasi', '<=', $tgl);
//        }

        if(isset($filter['instalasiId']) && $filter['instalasiId'] != "" && $filter['instalasiId'] != "undefined") {
            $data = $data->where('dept.id', '=', $filter['instalasiId']);
        }

        if(isset($filter['ruanganId']) && $filter['ruanganId'] != "" && $filter['ruanganId'] != "undefined") {
            $data = $data->where('ru.id', '=', $filter['ruanganId']);
        }

        if(isset($filter['namaPasien']) && $filter['namaPasien'] != "" && $filter['namaPasien'] != "undefined") {
            $data = $data->where('p.namapasien', 'ilike', '%' . $filter['namaPasien'] . '%');
        }

        if(isset($filter['noReg']) && $filter['noReg'] != "" && $filter['noReg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', 'ilike', '%' . $filter['noReg'] . '%');
        }
        if(isset($filter['noRm']) && $filter['noRm'] != "" && $filter['noRm'] != "undefined") {
            $data = $data->where('p.nocm', 'ilike', '%' . $filter['noRm'] . '%');
        }

        $data = $data->groupBy('pd.tglregistrasi', 'p.nocm', 'pd.noregistrasi', 'ru.namaruangan', 'p.namapasien', 'kp.kelompokpasien',
            'kls.namakelas','jk.jeniskelamin','pg.namalengkap','pd.norec','kmr.namakamar','apd.nobed',
            'pd.tglpulang', 'pd.statuspasien','p.tgllahir','pd.objectruanganlastfk');
        $data = $data->orderBy('pd.tglregistrasi','desc');
        $data = $data->get();
        foreach ($data as $item){
            $tgllahir = $this->getAge($item->tgllahir) ;
            $tglregis = new \DateTime(date($item->tglregistrasi));
            $tglregis = $tglregis->format('Y-m-d');
            $res[]=array(
                'tglmasuk' => $tglregis,
                'nocm' => $item->nocm,
                'noregistrasi' => $item->noregistrasi,
                'namapasien' => $item->namapasien,
                'jenispasien' => $item->kelompokpasien,
                'ruangperawatan' => $item->namaruangan,
                'kelas' => $item->namakelas,
                'jeniskelamin' => $item->jeniskelamin,
                'dokter' => $item->namalengkap,
                'tgllahir' => $tgllahir,
                'kamar' => $item->namakamar,
                'nobed' => $item->nobed,
            );
        }
        $result = array(
            'data' => $res,
            'count' => count($res),
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getAge($tgllahir){
        $datetime = new \DateTime(date($tgllahir));
        return $datetime->diff(Carbon::now())
            ->format('%ythn %mbln %dhr');
    }
    public function getRekapKunjunganPasienPertahun(Request $request)
    {
        $idDepRaJal = 18;
        $tglAwal = Carbon::now()->startOfYear()->subMonth(5);
        $tglAkhir = date('Y-m-d' . ' 23:59');
        $data = \DB::table('pasiendaftar_t as pd')
//            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('batalregistrasi_t as kps', 'kps.pasiendaftarfk', '=', 'pd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->select('pd.noregistrasi', 'kps.norec as norec_batal','pd.nostruklastfk',
                'pd.objectkelompokpasienlastfk',
                DB::raw("extract (year from pd.tglregistrasi) as tahunregis"))

            ->where('ru.objectdepartemenfk',$idDepRaJal)
            ->whereBetween('pd.tglregistrasi', [$tglAwal, $tglAkhir])
            ->groupBy('pd.noregistrasi', 'kps.norec','pd.nostruklastfk',
                'pd.objectkelompokpasienlastfk','pd.tglregistrasi');
        $data = $data->get();

        $data10 = [];
        $sudahPeriksa = 0;
        $belumPeriksa = 0;
        $batalRegis = 0;
        if (count($data) > 0) {
            foreach ($data as $item) {
                $sama = false;
                $i = 0;
                foreach ($data10 as $hideung) {
                    if ($item->tahunregis == $data10[$i]['tahunregis']) {
                        $sama = 1;
                        $jml = (float)$hideung['total'] + 1;
                        $data10[$i]['total'] = $jml;
                        if ($item->nostruklastfk != null && $item->norec_batal == null) {
                            $data10[$i]['diperiksa'] = (float)$hideung['diperiksa'] + 1;
                        }
                        if ($item->nostruklastfk == null && $item->norec_batal == null) {
                            $data10[$i]['belumperiksa'] = (float)$hideung['belumperiksa'] + 1;
                        }
                        if ($item->norec_batal != null) {
                            $data10[$i]['batalregistrasi'] = (float)$hideung['batalregistrasi'] + 1;
                        }
                    }
                    $i = $i + 1;
                }
                if ($sama == false) {
                    if ($item->nostruklastfk != null && $item->norec_batal == null) {
                        $sudahPeriksa = 1;
                        $belumPeriksa = 0;
                        $batalRegis = 0;
                    }
                    if ($item->nostruklastfk == null && $item->norec_batal == null) {
                        $sudahPeriksa = 0;
                        $belumPeriksa = 1;
                        $batalRegis = 0;
                    }
                    if ($item->norec_batal != null) {
                        $sudahPeriksa = 0;
                        $belumPeriksa = 0;
                        $batalRegis = 1;
                    }
                    $data10[] = array(
                        'tahunregis' => $item->tahunregis,
                        'total' => 1,
                        'diperiksa' => $sudahPeriksa,
                        'belumperiksa' => $belumPeriksa,
                        'batalregistrasi' => $batalRegis,
//
                    );
                }
                foreach ($data10 as $key => $row) {
                    $count[$key] = $row['total'];
                }
                array_multisort($count, SORT_DESC, $data10);
            }
        } else {
            $data10[] = array(
                'tahunregis' => null,
                'total' => 0,
                'diperiksa' => 0,
                'belumperiksa' => 0,
                'batalregistrasi' => 0,
            );
        }
        $result = array(
            'result' => $data10,
            'count' => count($data),
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function countPasienRS(Request $request)
    {
        $tglAwal = $request['tgl'] .' 00:00' ;//date('Y-m-d 00:00');
        $tglAkhir =  $request['tgl'] .' 23:59' ;//date('Y-m-d 23:59');
        $dept = $this->settingDataFixed('kdDepartemenEIS');
         $data = DB::select(DB::raw("SELECT dp.id ,dp.namadepartemen,count(pd.norec) as jumlah,dp.qdepartemen
                FROM departemen_m dp
                join ruangan_m as ru on ru.objectdepartemenfk=dp.id
                LEFT JOIN (SELECT norec,objectruanganlastfk FROM pasiendaftar_t
                where tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir' and statusenabled=true) pd ON (ru.id= pd.objectruanganlastfk)
                WHERE dp.id in ($dept) and ru.id not in (251,322,12,448,453)
                -- and ru.id not in (717,722,724,758,759,760,761,762,763,764,781,251,322,12,448,453)
                group by dp.namadepartemen,dp.id,dp.qdepartemen
                union all
                select 1001 as id,'Jumlah Pasien Rawat Inap Hari ini',count(x.noregistrasi) as jumlah,3 as qdepartemen
                from ( select  pd.noregistrasi,pd.tglregistrasi
                from pasiendaftar_t as pd 
                inner join ruangan_m as ru on ru.id = pd.objectruanganlastfk
                where ru.objectdepartemenfk = 16 
                -- and (  pd.tglregistrasi < '$tglAwal' AND pd.tglpulang >= '$tglAkhir' or pd.tglpulang is null)
                and ( pd.tglpulang is null)
                -- and ru.objectruanganfk is null
                and pd.statusenabled=true 
                -- AND ru.id NOT IN (717,722,724,758,759,760,761,762,763,764,781)
                ) as x
                union all
                SELECT 277 as id ,'Jumlah Pengunjung Radiologi Hari ini',count(pd.norec) as jumlah,4 as qdepartemen
                FROM departemen_m dp
                join ruangan_m as ru on ru.objectdepartemenfk=dp.id
                LEFT JOIN (SELECT antrianpasiendiperiksa_t.norec,objectruanganfk FROM antrianpasiendiperiksa_t
                left  join batalregistrasi_t as br on br.pasiendaftarfk=antrianpasiendiperiksa_t.noregistrasifk
                where tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir' and   br.norec is null) pd ON (ru.id= pd.objectruanganfk)
                WHERE dp.id =27
                group by dp.namadepartemen,dp.id,dp.qdepartemen
                union all
                SELECT 28 as id ,'Jumlah Pengunjung Rehabilitasi Medik Hari ini',count(pd.norec) as jumlah,9 as qdepartemen
                FROM departemen_m dp
                join ruangan_m as ru on ru.objectdepartemenfk=dp.id
                LEFT JOIN (SELECT antrianpasiendiperiksa_t.norec,objectruanganfk FROM antrianpasiendiperiksa_t
                left  join batalregistrasi_t as br on br.pasiendaftarfk=antrianpasiendiperiksa_t.noregistrasifk
                where tglmasuk BETWEEN '$tglAwal' and '$tglAkhir' and   br.norec is null) pd ON (ru.id= pd.objectruanganfk)
                WHERE dp.id =28 
                group by dp.namadepartemen,dp.id,dp.qdepartemen
                union all
                SELECT 575 as id ,'Jumlah Pengunjung Laboratorium Hari ini',count(pd.norec) as jumlah,5 as qdepartemen
                FROM departemen_m dp
                join ruangan_m as ru on ru.objectdepartemenfk=dp.id
                LEFT JOIN (SELECT antrianpasiendiperiksa_t.norec,objectruanganfk FROM antrianpasiendiperiksa_t
                left  join batalregistrasi_t as br on br.pasiendaftarfk=antrianpasiendiperiksa_t.noregistrasifk
                where tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir' and   br.norec is null) pd ON (ru.id= pd.objectruanganfk)
                WHERE dp.id =3 and ru.id<>453
                group by dp.namadepartemen,dp.id,dp.qdepartemen
                union all
                SELECT 453 as id ,'Jumlah Pengunjung Laboratorium PA Hari ini',count(pd.norec) as jumlah,5 as qdepartemen
                FROM departemen_m dp
                join ruangan_m as ru on ru.objectdepartemenfk=dp.id
                LEFT JOIN (SELECT antrianpasiendiperiksa_t.norec,objectruanganfk FROM antrianpasiendiperiksa_t
                left  join batalregistrasi_t as br on br.pasiendaftarfk=antrianpasiendiperiksa_t.noregistrasifk
                where tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir' and   br.norec is null) pd ON (ru.id= pd.objectruanganfk)
                WHERE dp.id =3 and ru.id=453
                group by dp.namadepartemen,dp.id,dp.qdepartemen
                union all
                SELECT 24 as id ,'Jumlah Pasien IGD Hari ini',count(pd.norec) as jumlah, 2 as qdepartemen
                FROM departemen_m dp
                join ruangan_m as ru on ru.objectdepartemenfk=dp.id
                LEFT JOIN (SELECT antrianpasiendiperiksa_t.norec,objectruanganfk FROM antrianpasiendiperiksa_t
                left  join batalregistrasi_t as br on br.pasiendaftarfk=antrianpasiendiperiksa_t.noregistrasifk
                where tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir' and   br.norec is null) pd ON (ru.id= pd.objectruanganfk)
                WHERE dp.id =24
                group by dp.namadepartemen,dp.id,dp.qdepartemen
                union all
                SELECT 5 as id ,'Jumlah Kasus Meninggal(Ruang + dari Luar)',count(pd.norec) as jumlah, 500 as qdepartemen
                FROM departemen_m dp
                join ruangan_m as ru on ru.objectdepartemenfk=dp.id
                LEFT JOIN (SELECT antrianpasiendiperiksa_t.norec,objectruanganfk FROM antrianpasiendiperiksa_t
                left  join batalregistrasi_t as br on br.pasiendaftarfk=antrianpasiendiperiksa_t.noregistrasifk
                where tglmasuk BETWEEN '$tglAwal' and '$tglAkhir' and   br.norec is null) pd ON (ru.id= pd.objectruanganfk)
                WHERE dp.id =5
                group by dp.namadepartemen,dp.id,dp.qdepartemen
                union all
                --SELECT 496 as id,'Pasien Caterisasi Jantung Hari ini',count(pd.norec) as jumlah,44 as qdepartemen
                --FROM departemen_m dp
                --join ruangan_m as ru on ru.objectdepartemenfk=dp.id
                --LEFT JOIN (SELECT antrianpasiendiperiksa_t.norec,objectruanganfk FROM antrianpasiendiperiksa_t
                --left  join batalregistrasi_t as br on br.pasiendaftarfk=antrianpasiendiperiksa_t.noregistrasifk
                --where tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir' and   br.norec is null) pd ON (ru.id= pd.objectruanganfk)
                --WHERE ru.id =496
                --group by dp.namadepartemen,dp.id,dp.qdepartemen
                --union all
                SELECT 44 as id,'Pasien Operasi Hari ini',count(pd.norec) as jumlah,44 as qdepartemen
                FROM departemen_m dp
                join ruangan_m as ru on ru.objectdepartemenfk=dp.id
                LEFT JOIN (SELECT antrianpasiendiperiksa_t.norec,objectruanganfk FROM antrianpasiendiperiksa_t
                left  join batalregistrasi_t as br on br.pasiendaftarfk=antrianpasiendiperiksa_t.noregistrasifk
                where tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir' and   br.norec is null) pd ON (ru.id= pd.objectruanganfk)
                WHERE ru.id in (44,277)
                group by dp.namadepartemen,dp.id,dp.qdepartemen
                union all
                --SELECT 320 as id,'Pasien ESWL Hari ini',count(pd.norec) as jumlah,44 as qdepartemen
                --FROM departemen_m dp
                --join ruangan_m as ru on ru.objectdepartemenfk=dp.id
                --LEFT JOIN (SELECT antrianpasiendiperiksa_t.norec,objectruanganfk FROM antrianpasiendiperiksa_t
                --left  join batalregistrasi_t as br on br.pasiendaftarfk=antrianpasiendiperiksa_t.noregistrasifk
                --where tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir' and   br.norec is null) pd ON (ru.id= pd.objectruanganfk)
                --WHERE ru.id =320
                --group by dp.namadepartemen,dp.id,dp.qdepartemen
                --union all
                SELECT 4533 as id,'Pengunjung Laboratorium PA dari Luar Hari ini',count(pd.norec) as jumlah,5 as qdepartemen
                FROM departemen_m dp
                join ruangan_m as ru on ru.objectdepartemenfk=dp.id
                LEFT JOIN (SELECT norec,objectruanganlastfk FROM pasiendaftar_t
                where tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir' and statusenabled=true) pd ON (ru.id= pd.objectruanganlastfk)
                WHERE ru.objectruanganfk is null and ru.id=453
                group by dp.namadepartemen,dp.id,dp.qdepartemen
                --union all
                --SELECT 448 as id,'Pengunjung Masuk HIPERBARIK Hari ini',count(pd.norec) as jumlah,44 as qdepartemen
                --FROM departemen_m dp
                --join ruangan_m as ru on ru.objectdepartemenfk=dp.id
                --LEFT JOIN (SELECT norec,objectruanganlastfk FROM pasiendaftar_t
                --where tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir' and statusenabled=true) pd ON (ru.id= pd.objectruanganlastfk)
                --WHERE ru.objectruanganfk is null and ru.id=448
                --group by dp.namadepartemen,dp.id,dp.qdepartemen
                union all
                SELECT 12 as id,'Pasien Masuk HEMODIALISA Hari ini',count(pd.norec) as jumlah,9 as qdepartemen
                FROM departemen_m dp
                join ruangan_m as ru on ru.objectdepartemenfk=dp.id
                LEFT JOIN (SELECT antrianpasiendiperiksa_t.norec,objectruanganfk FROM antrianpasiendiperiksa_t
                left  join batalregistrasi_t as br on br.pasiendaftarfk=antrianpasiendiperiksa_t.noregistrasifk
                where tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir' and   br.norec is null) pd ON (ru.id= pd.objectruanganfk)
                WHERE ru.id =12
                group by dp.namadepartemen,dp.id,dp.qdepartemen
                union all
                SELECT 322 as id,'Pengunjung Masuk MCU/RIKES Hari ini',count(pd.norec) as jumlah,10 as qdepartemen
                FROM departemen_m dp
                join ruangan_m as ru on ru.objectdepartemenfk=dp.id
                LEFT JOIN (SELECT norec,objectruanganlastfk FROM pasiendaftar_t
                where tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir' and statusenabled=true) pd ON (ru.id= pd.objectruanganlastfk)
                WHERE ru.objectruanganfk is null and ru.id=322
                group by dp.namadepartemen,dp.id,dp.qdepartemen
                union all
                SELECT 251 as id,'Pengunjung Sentra Visum Hari ini',count(pd.norec) as jumlah,11 as qdepartemen
                FROM departemen_m dp
                join ruangan_m as ru on ru.objectdepartemenfk=dp.id
                LEFT JOIN (SELECT norec,objectruanganfk FROM antrianpasiendiperiksa_t
                where tglmasuk BETWEEN '$tglAwal' and '$tglAkhir' and statusenabled=true) pd ON (ru.id= pd.objectruanganfk)
                WHERE ru.objectruanganfk is null and ru.id=251
                group by dp.namadepartemen,dp.id,dp.qdepartemen
                union all
                SELECT 1000 as id,'Pasien Masuk ICU Hari ini',count(pd.norec) as jumlah,8 as qdepartemen
                FROM departemen_m dp
                join ruangan_m as ru on ru.objectdepartemenfk=dp.id
                LEFT JOIN (SELECT norec,objectruanganlastfk FROM pasiendaftar_t
                where tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir' and statusenabled=true) pd ON (ru.id= pd.objectruanganlastfk)
                WHERE dp.id in ($dept) and ru.id in (717,722,724,758,759,760,761,762,763,764,781)
                group by dp.namadepartemen,dp.id,dp.qdepartemen
                union all
                select 717 as id,'Jumlah Pasien ICU Hari ini',count(x.noregistrasi) as jumlah,8 as qdepartemen
                from ( select  pd.noregistrasi,pd.tglregistrasi
                from pasiendaftar_t as pd 
                inner join ruangan_m as ru on ru.id = pd.objectruanganlastfk
                where ru.objectdepartemenfk = 16 
                and (  pd.tglpulang is null)
                and pd.statusenabled=true AND ru.id IN (717,722,724,758,759,760,761,762,763,764,781)) as x
                union all
                select 19 as id,'Jumlah Pasien Covid-19 Hari ini',count(x.noregistrasi) as jumlah,12 as qdepartemen
                from ( select  pd.noregistrasi,pd.tglregistrasi
                from pasiendaftar_t as pd 
                inner join ruangan_m as ru on ru.id = pd.objectruanganlastfk
                where ru.objectdepartemenfk = 16 
                and ( pd.tglpulang is null)and ru.objectruanganfk=19
                and pd.statusenabled=true ) as x
                union all
                SELECT 999 as id,'Pasien Masuk Covid-19 Hari Ini',count(pd.norec) as jumlah,12 as qdepartemen
                FROM departemen_m dp
                join ruangan_m as ru on ru.objectdepartemenfk=dp.id
                LEFT JOIN (SELECT norec,objectruanganlastfk FROM pasiendaftar_t
                where tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir' and statusenabled=true) pd ON (ru.id= pd.objectruanganlastfk)
                WHERE dp.id in ($dept) and ru.objectruanganfk=19
                group by dp.namadepartemen,dp.id,dp.qdepartemen
       
        "));
        
        $volume = array_column($data, 'qdepartemen');
       

        array_multisort($volume, SORT_ASC, $data);
         return $this->respond($data);
        // $data = DB::select(DB::raw("select dp.id ,dp.namadepartemen,count(pd.norec) as jumlah
        //             from pasiendaftar_t as pd
        //             join ruangan_m as ru on ru.id =pd.objectruanganlastfk
        //             join departemen_m as dp on dp.id =ru.objectdepartemenfk
        //               left join batalregistrasi_t as br on br.pasiendaftarfk=pd.norec
        //             where pd.tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir' 
        //             --and ru.objectdepartemenfk =24
        //             and br.norec is null
        //             group by dp.namadepartemen,dp.id 
        //     "));
        // $rawatjalan =0;
        // $rawatinap=0;
        // $igd =0;
        // $rehab =0;
        // $bedah =0;
        // $lab =0;
        // $rad=0;
        // $res=[];
        // if(count($data)> 0) {
        //     foreach ($data as $item) {
        //         if ($item->id == 18) {
        //             $rawatjalan = $item->jumlah;
        //         }
        //         if ($item->id == 16) {
        //             $rawatinap = $item->jumlah;
        //         }
        //         if ($item->id == 28) {
        //             $rehab = $item->jumlah;
        //         }
        //         if ($item->id == 25) {
        //             $bedah = $item->jumlah;
        //         }
        //         if ($item->id == 3) {
        //             $lab = $item->jumlah;
        //         }
        //         if ($item->id == 27) {
        //             $rad = $item->jumlah;
        //         }
        //         if ($item->id == 24) {
        //             $igd = $item->jumlah;
        //         }
        //         $res = array(
        //             'rawat_jalan' => (int)$rawatjalan,
        //             'igd' => (int)$igd,
        //             'rawat_inap' => (int)$rawatinap,
        //             'radiologi' => (int)$rad,
        //             'laboratorium' => (int)$lab,
        //             'operasi' => (int)$bedah,
        //             'rehab_medik' => (int)$rehab,
        //             'jumlah' => (int)$rawatjalan + (int)$igd + (int)$rawatinap + (int)$rad
        //                 + (int)$lab + (int)$bedah + (int)$rehab
        //         );
        //     }
        // }else{
        //     $res = array(
        //         'rawat_jalan' => 0,
        //         'igd' => 0,
        //         'rawat_inap' => 0,
        //         'radiologi' => 0,
        //         'laboratorium' => 0,
        //         'operasi' => 0,
        //         'rehab_medik' => 0,
        //         'jumlah' => 0,
        //     );
        // }
        // $result = array(
        //     'result' => $data,
        //     'message' => 'ramdanegie',
        // );
        // return $this->respond($res);

    }
    public function getRekapPasienDirawat(Request $request)
    {
//        $data = DB::select(DB::raw("
//            select DISTINCT pd.tglregistrasi, pd.noregistrasi,ps.namapasien,
//            date_part('day'::text, ((('now'::text)::date)::timestamp without time zone - pd.tglregistrasi)) AS hari
//            FROM pasiendaftar_t pd
//            JOIN antrianpasiendiperiksa_t apd On apd.noregistrasifk = pd.norec
//            JOIN ruangan_m ru ON ru.id = pd.objectruanganlastfk
//            JOIN pasien_m ps ON ps.id = pd.nocmfk
//            WHERE ru.objectdepartemenfk = ANY (ARRAY[35, 16]) AND pd.tglpulang IS NULL
//            --AND pd.nostruklastfk IS NULL
//           -- and pd.tglregistrasi between '2018-07-01' and '2018-08-21'
//            "));

        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as p', 'p.id', '=', 'pd.nocmfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->join('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->join('jeniskelamin_m as jk', 'jk.id', '=', 'p.objectjeniskelaminfk')
            ->leftJoin('pegawai_m as pg','pg.id','=','pd.objectpegawaifk')
            ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftJoin('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            ->join('antrianpasiendiperiksa_t as apd', 'pd.norec', '=',
                DB::raw("apd.noregistrasifk and apd.objectruanganfk=pd.objectruanganlastfk"))
            ->leftjoin('kamar_m as kmr', 'kmr.id', '=', 'apd.objectkamarfk')
            ->select('pd.tglregistrasi', 'p.nocm', 'pd.noregistrasi', 'ru.namaruangan',
                'p.namapasien', 'kp.kelompokpasien','kmr.namakamar',
                'kls.namakelas','jk.jeniskelamin','pg.namalengkap','apd.nobed',
                'p.tgllahir',
                DB::raw("date_part('day'::text, ((('now'::text)::date)::timestamp without time zone - pd.tglregistrasi)) AS hari "))
            ->whereNull('pd.tglpulang');

        $data = $data->groupBy('pd.tglregistrasi', 'p.nocm', 'pd.noregistrasi', 'ru.namaruangan', 'p.namapasien', 'kp.kelompokpasien',
            'kls.namakelas','jk.jeniskelamin','pg.namalengkap','pd.norec','kmr.namakamar','apd.nobed',
            'pd.tglpulang', 'pd.statuspasien','p.tgllahir','pd.objectruanganlastfk');
        $data = $data->orderBy('pd.tglregistrasi','desc');
        $data = $data->get();

        $data10=[];
        $satusampai3 = 0;
        $empatsampai5 = 0;
        $enamsampai10 = 0;
        $sebelassampai15 = 0;
        $enambelassampai20 = 0;
        $lebih20 = 0;
        $persen1 =0;
        $persen4 =0;
        $persen6 =0;
        $persen11 =0;
        $persen16 =0;
        $persen20 =0;
        foreach ($data as $item) {
            $total = 0;
            if ($item->hari >= 0 && $item->hari <= 3 ) {
                $satusampai3= (float) $satusampai3 + 1;
            }
            if ($item->hari >= 4 && $item->hari <= 5 ) {
                $empatsampai5= (float) $empatsampai5 + 1;
            }
            if ($item->hari >= 6 && $item->hari <= 10 ) {
                $enamsampai10= (float)   $enamsampai10 + 1;
            }
            if ($item->hari >= 11 && $item->hari <= 15 ) {
                $sebelassampai15 = (float) $sebelassampai15  + 1;
            }
            if ($item->hari >= 16 && $item->hari <= 20 ) {
                $enambelassampai20  = (float) $enambelassampai20   + 1;
            }
            if ($item->hari > 20  ) {
                $lebih20= (float) $lebih20 + 1;
            }
            $total = $satusampai3+ $empatsampai5 +$enamsampai10+ $sebelassampai15 +  $enambelassampai20 + $lebih20;

            if ($satusampai3 > 0){
                $persen1 = $satusampai3 * 100 /$total;
            }
            if ($empatsampai5 > 0){
                $persen4 = $empatsampai5 * 100 /$total;
            }
            if ($enamsampai10 > 0){
                $persen6 = $enamsampai10 * 100 /$total;
            }
            if ($sebelassampai15 > 0){
                $persen11 = $sebelassampai15 * 100 /$total;
            }
            if ($enambelassampai20 > 0){
                $persen16 = $enambelassampai20 * 100 /$total;
            }
            if ($lebih20 > 0){
                $persen20 = $lebih20 * 100 /$total;
            }

            $data10 = array(
                'total' => $total,
                'satu' => $satusampai3,
                'persen1' =>number_format($persen1,1).'%',
                'empat' => $empatsampai5,
                'persen4' => number_format($persen4,1) .'%',
                'enam' => $enamsampai10,
                'persen6' =>number_format($persen6,1) .'%',
                'sebelas' => $sebelassampai15,
                'persen11' => number_format($persen11,1) .'%',
                'enambelas' => $enambelassampai20,
                'persen16' => number_format($persen16,1) .'%',
                'lebih20' => $lebih20,
                'persen20' =>number_format($persen20,1) .'%',
            );
        }
        return $this->respond( $data10);
    }
    public function getPasienPerjenisPenjadwalan(Request $request)
    {
        $tglAwal= $request['tgl'].' 00:00';
        $tglAkhir=$request['tgl'].' 23:59';
        $data = DB::select(DB::raw("
                                   select count(x.noregistrasi) as jumlah  ,x.keterangan,
	count (case when x.departemen = 'rawat_jalan' then 1 end) AS rawatjalan,
count(case when x.departemen = 'igd' then 1 end) AS igd,
count(case when x.departemen = 'rawat_inap' then 1 end) AS rawat_inap,
count(case when x.departemen = 'radiologi' then 1 end) AS radiologi,
count(case when x.departemen = 'laboratorium' then 1 end) AS laboratorium,
count(case when x.departemen = 'operasi' then 1 end) AS operasi,
count(case when x.departemen = 'rahab_medik' then 1 end) AS rehab_medik
	from (
	SELECT
	--case when apr.noreservasi is not null then 'Registrasi Online' else 'Loket Pendaftaran' end as keterangan,
    case when length(pd.statusschedule) = 7  then 'Registrasi Online' when pd.statusschedule = 'Kios-K' THEN
    'Anjungan Mandiri' else 'Loket Pendaftaran' end as keterangan,
			pd.noregistrasi,
	ru.namaruangan,pd.statusschedule,
	case when ru.objectdepartemenfk =18  then 'rawat_jalan'
	when ru.objectdepartemenfk =24 then 'igd'
	when ru.objectdepartemenfk =16   then 'rawat_inap'
	when ru.objectdepartemenfk =27  then 'radiologi'
	when ru.objectdepartemenfk =3  then 'laboratorium'
	when ru.objectdepartemenfk =25  then 'operasi'
	when ru.objectdepartemenfk =28  then 'rahab_medik'
	end as departemen
	FROM            pasiendaftar_t AS pd LEFT OUTER JOIN
     antrianpasienregistrasi_t AS apr ON apr.noreservasi = pd.statusschedule INNER JOIN
     ruangan_m AS ru ON ru.id = pd.objectruanganlastfk LEFT OUTER JOIN
     batalregistrasi_t ON pd.norec = batalregistrasi_t.pasiendaftarfk
	WHERE pd.tglregistrasi BETWEEN '$tglAwal' 	AND '$tglAkhir' and batalregistrasi_t.norec is null
	) as x  group BY x.keterangan 

            "));
        if (count($data) >0){
            $res = array(
                'data' => $data,
                'message' => 'inhuman',
            );
        }else{
            $res = array(
                'data' => '',
                'message' => 'inhuman',
            );
        }

        return $this->respond($res);
    }
    public function getBorLosToiPolri(Request $request)
    {
      $idDepRaJal = 18;
        $tglAwal =  date('Y-m-d 00:00'); //Carbon::now()->startOfMonth()->subMonth(1);
        $tglAkhir = date('Y-m-d 23:59');
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        // $bulan = $request['tglAwal']->format('y-m');
        $bulan=date_create($tglAwal);
        $bulan=date_format($bulan,"Y-m");
        $bulanregis=date_create($tglAwal);
        $bulanregis=date_format($bulanregis,"m");
       
        // return($tglAkhir);
        // die();
 
        $tahun = new \DateTime($tglAkhir);
        $tahun = date ('Y');
        $datetime1 = new \DateTime($tglAwal);
        $datetime2 = new \DateTime($tglAkhir);
        $interval = $datetime1->diff($datetime2);
        $sehari = 1;//$interval->format('%d');

        $year = Carbon::now()->year;
        $num_of_days = [];
        if($year == date('Y'))
            $total_month = date('m');
        else
            $total_month = 12;

        for($m=1; $m<=$total_month; $m++){
            $num_of_days[] = array(
                'bulan' =>  $m,
                'jumlahhari' =>  cal_days_in_month(CAL_GREGORIAN, $m, $year),
            );
        }
        foreach ($num_of_days as $numday){
            if ($numday['bulan'] == $bulanregis){
                $total_day = $numday['jumlahhari'];
                $tglAkhir=$bulan.'-'.$total_day.' 23:59:59';
            }
        }

        
        
        $data10=[];
        $jumlahTT =  0;
        $dataTTs =DB::select(DB::raw("SELECT sum (x.jmlbed) AS tt FROM 
            (select to_char (tglaktif,'yyyy-MM') AS bulanregis,jmlbed from skbeddinamis_m ) as x where x.bulanregis='$bulan'
        "));
           $jumlahTT =   (int)$dataTTs[0]->tt;

        $dataTTD =DB::select(DB::raw("SELECT * FROM 
           (SELECT to_char(skbeddinamis_m.tglaktif, 'yyyy-MM') AS bulanregis, to_char(skbeddinamis_m.tglnonaktif, 'yyyy-MM') AS bulannonaktip, skbeddinamis_m.jmlbed, skbeddinamis_m.koderuangan, ruangan_m.namaruangan
            FROM skbeddinamis_m INNER JOIN ruangan_m ON skbeddinamis_m.koderuangan = ruangan_m.id::VARCHAR) as x where x.bulanregis='$bulan'
       "));
           
     
        
        $jumlahhariperawatan = 0;
        // for($m=1; $m<=$total_day; $m++){
        //     $tglregistrasi =$bulan.'-'.$m.' 00:00:00';
        //     $tglpulang =$bulan.'-'.$m.' 23:59:59';
            
        //     $hariPerawatan = DB::select(DB::raw("
        //     SELECT   COUNT (x.noregistrasi) AS jumlahhariperawatan
        //                             FROM
        //                                 (
        //                                     SELECT
        //                                         pd.noregistrasi,
        //                                         pd.tglpulang,
        //                                         to_char ( pd.tglregistrasi,'MM') AS bulanregis
        //                                     FROM
        //                                         pasiendaftar_t AS pd
        //                                     INNER JOIN ruangan_m AS ru ON ru.ID = pd.objectruanganlastfk
        //                                     WHERE
        //                                         ru.objectdepartemenfk = 16
        //                                     and pd.statusenabled=true
        //                                     AND pd.tglpulang > '$tglpulang'
        //                                     AND pd.tglregistrasi < '$tglregistrasi'
        //                                 ) AS x"
        //     ));
        //     foreach ($hariPerawatan as $item) {
        //         $jumlahhariperawatan = $jumlahhariperawatan + (int)$item->jumlahhariperawatan;
        //     }
        // }
        $tglregistrasi =$bulan.'-'.'01 00:00:00';
        $tglpulang =$bulan.'-'.$total_day.' 23:59:59';
        $hariPerawatan = DB::select(DB::raw("
                        select  count(x.noregistrasi)as jumlahhariperawatan from (
                            select pds.noregistrasi,pd.tglregistrasi,pd.tglpulang,pds.tglinsertsensus from pasiendaftarsensus_t as pds 
                            JOIN pasiendaftar_t as pd on pd.norec=pds.noregistrasifk where 
                            pds.tglinsertsensus BETWEEN '$tglregistrasi' and '$tglpulang' and 
                            pds.tglinsertsensus BETWEEN pd.tglregistrasi and pd.tglpulang
                            ORDER BY pds.noregistrasi,pds.tglinsertsensus
                            ) as x       
                "));
        foreach ($hariPerawatan as $item) {
            $jumlahhariperawatan = $jumlahhariperawatan + (int)$item->jumlahhariperawatan;
        }
        $hariPerawatan = DB::select(DB::raw("
                        select  count(x.noregistrasi)as jumlahhariperawatan from (
                            select pds.noregistrasi,pd.tglregistrasi,pd.tglpulang,pds.tglinsertsensus from pasiendaftarsensus_t as pds 
                            JOIN pasiendaftar_t as pd on pd.norec=pds.noregistrasifk where 
                            pds.tglinsertsensus BETWEEN '$tglregistrasi' and '$tglpulang' and 
                            pd.tglpulang is null
                            ORDER BY pds.noregistrasi,pds.tglinsertsensus
                            ) as x       
                "));
        foreach ($hariPerawatan as $item) {
            $jumlahhariperawatan = $jumlahhariperawatan + (int)$item->jumlahhariperawatan;
        }
        // return($jumlahhariperawatan);
        // die();
       
      
       $lamaRawat = DB::select(DB::raw("
                        select sum(x.hari) as lamarawat, count(x.noregistrasi)as jumlahpasienpulang from (
                        SELECT 
                            case when to_char(tglpulang, 'YYYY-MM-DD')::TIMESTAMP=to_char(tglregistrasi, 'YYYY-MM-DD')::TIMESTAMP then 1
                             else date_part('DAY', to_char(tglpulang, 'YYYY-MM-DD')::TIMESTAMP- to_char(tglregistrasi, 'YYYY-MM-DD')::TIMESTAMP) end as hari,
                             pd.noregistrasi
                            FROM
                                    pasiendaftar_t AS pd
                        -- 	INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
                            INNER JOIN ruangan_m AS ru ON ru. ID = pd.objectruanganlastfk
                            WHERE
                                            pd.tglpulang BETWEEN '$tglAwal'
                            AND '$tglAkhir' and
                            ru.objectdepartemenfk = 16 
                            and pd.tglpulang is not null
                            and pd.statusenabled=true
                            GROUP BY pd.noregistrasi,pd.tglpulang,pd.tglregistrasi
                         -- order by pd.noregistrasi 
                            ) as x       
                "));
           
        $pasienpulang = DB::select(DB::raw("
                select * from (
                SELECT 
                    date_part('day', pd.tglregistrasi)-date_part('day',pd.tglpulang) as hari ,pd.noregistrasi,pd.tglpulang,ps.namapasien
                    ,kp.reportdisplay
                    FROM
                            pasiendaftar_t AS pd
                --  INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
                    INNER JOIN ruangan_m AS ru ON ru. ID = pd.objectruanganlastfk
                    inner join pasien_m as ps on ps.id = pd.nocmfk
                    left join kondisipasien_m as kp on kp.id = pd.objectkondisipasienfk
                    WHERE
                                    pd.tglpulang BETWEEN '$tglAwal'
                AND '$tglAkhir' and
                    ru.objectdepartemenfk = 16 
                    and pd.tglpulang is not null
                    and pd.statusenabled=true
                    GROUP BY pd.noregistrasi,pd.tglpulang,pd.tglregistrasi,ps.namapasien,kp.reportdisplay
                 -- order by pd.noregistrasi 
                    ) as x       
        "));

        // return($lamaRawat);
        // die();

        $dataMeninggal = DB::select(DB::raw("select count(x.noregistrasi) as jumlahmeninggal, 
                count(case when x.objectkondisipasienfk = '6' then 1 end ) AS jumlahlebih48,
                count(case when x.objectkondisipasienfk <> '6' then 1 end ) AS jumlahkurang48 FROM
                (
                select noregistrasi ,statuskeluar,kondisipasien,objectkondisipasienfk
                from pasiendaftar_t 
                join statuskeluar_m on statuskeluar_m.id =pasiendaftar_t.objectstatuskeluarfk
                left join kondisipasien_m on kondisipasien_m.id =pasiendaftar_t.objectkondisipasienfk
                LEFT JOIN ruangan_m AS ru ON ru.id = pasiendaftar_t.objectruanganlastfk
                where objectstatuskeluarfk =5
                AND ( ru.objectdepartemenfk = '16' )
                and pasiendaftar_t.tglpulang BETWEEN '$tglAwal' and '$tglAkhir'
                and pasiendaftar_t.statusenabled=true
                ) as x ;"));
//        return $this->respond($sehari);
        $year = Carbon::now()->year;
        $num_of_days = [];
        if($year == date('Y'))
            $total_month = date('m');
        else
            $total_month = 12;

        for($m=1; $m<=$total_month; $m++){
            $num_of_days[] = array(
                'bulan' =>  $m,
                'jumlahhari' =>  cal_days_in_month(CAL_GREGORIAN, $m, $year),
            );
        }
        // return($jumlahTT);
        // die();
        $bor = 0;
        $alos = 0;
        $toi = 0;
        $bto = 0;
        $ndr = 0;
        $gdr = 0;
        $hariPerawatanJml = 0;
        $jmlPasienPlg = 0;
        $jmlLamaRawat = 0;
        $jmlMeninggal = 0;
        $jmlMatilebih48=0;
        $jmlMatikurang48=0;
        $dataTTDetail= [];
        // foreach ($hariPerawatan as $item){
            foreach ($lamaRawat as $itemLamaRawat){
                foreach ($dataMeninggal as $itemDead) {
//                         if ($item->bulanregis == $itemLamaRawat->bulanpulang &&
//                             $itemLamaRawat->bulanpulang == $itemDead->bulanregis ) {
                    /** @var  $gdr = (Jumlah Mati dibagi Jumlah pasien Keluar (Hidup dan Mati) */
                    if((int) $itemDead->jumlahmeninggal > 0 && (int) $itemLamaRawat->jumlahpasienpulang > 0){
                        $gdr = (int) $itemDead->jumlahmeninggal * 1000 /(int)$itemLamaRawat->jumlahpasienpulang ;
                    }
                    /** @var  $NDR = (Jumlah Mati > 48 Jam dibagi Jumlah pasien Keluar (Hidup dan Mati) */
                    if((int) $itemDead->jumlahlebih48 > 0 && (int) $itemLamaRawat->jumlahpasienpulang > 0){
                        $ndr = (int) $itemDead->jumlahlebih48 * 1000 /(int)$itemLamaRawat->jumlahpasienpulang ;
                    }
                    

                    $jmlMeninggal = (int) $itemDead->jumlahmeninggal ;
                    $jmlMatilebih48= (int) $itemDead->jumlahlebih48;
                    $jmlMatikurang48= (int) $itemDead->jumlahkurang48;
//                         }
                }
//                if ($item->bulanregis == $itemLamaRawat->bulanpulang ) {
                /** @var  $alos = (Jumlah Lama Dirawat dibagi Jumlah pasien Keluar (Hidup dan Mati) */
//                return $this->respond($itemLamaRawat->jumlahpasienpulang );
                if ( (int)$itemLamaRawat->jumlahpasienpulang > 0){
                    $alos = (int)$itemLamaRawat->lamarawat / (int)$itemLamaRawat->jumlahpasienpulang;
                }

                /** @var  $bto = Jumlah pasien Keluar (Hidup dan Mati) DIBAGI Jumlah tempat tidur */
                if ( (int)$itemLamaRawat->jumlahpasienpulang > 0){
                    $bto = (int)$itemLamaRawat->jumlahpasienpulang / $jumlahTT;
                }
//                }
               foreach ($num_of_days as $numday){
                   if ($numday['bulan'] == $bulanregis){
                /** @var  $bor = (Jumlah hari perawatn RS dibagi ( jumlah TT x Jumlah hari dalam satu periode ) ) x 100 % */
                if ( (int)$jumlahhariperawatan > 0){
                    $bor = ( (int)$jumlahhariperawatan * 100 / ($jumlahTT * $numday['jumlahhari']));
                }
                /** @var  $toi = (Jumlah TT X Periode) - Hari Perawatn DIBAGI Jumlah pasien Keluar (Hidup dan Mati)*/
//                        $toi = ( ( $jumlahTT * $numday['jumlahhari'] )- (int)$item->jumlahhariperawatan ) /(int)$itemLamaRawat->jumlahpasienpulang ;
                if ( (int)$itemLamaRawat->jumlahpasienpulang > 0){
                    $toi = ( ( $jumlahTT * $numday['jumlahhari'])- (int)$jumlahhariperawatan ) /(int)$itemLamaRawat->jumlahpasienpulang ;
                }
                $hariPerawatanJml = (int)$jumlahhariperawatan;
                $jmlPasienPlg = (int)$itemLamaRawat->jumlahpasienpulang-$jmlMeninggal;
                   }
               }
            }
            ini_set('max_execution_time', 1000); //6 minutes
            
            foreach ($dataTTD as $itemTTD) {
                $jumlahhariperawatanperruangan = 0;
                // for($m=1; $m<=$total_day; $m++){
                //     $tglregistrasi =$bulan.'-'.$m.' 00:00:00';
                //     $tglpulang =$bulan.'-'.$m.' 23:59:59';
                    
                //     $hariPerawatanperruangan = DB::select(DB::raw("
                //     SELECT   COUNT (x.noregistrasi) AS jumlahhariperawatan
                //                             FROM
                //                                 (
                //                                     SELECT
                //                                         pd.noregistrasi,
                //                                         pd.tglpulang,
                //                                         to_char ( pd.tglregistrasi,'MM') AS bulanregis
                //                                     FROM
                //                                         pasiendaftar_t AS pd
                //                                     INNER JOIN ruangan_m AS ru ON ru.ID = pd.objectruanganlastfk
                //                                     WHERE
                //                                         ru.objectdepartemenfk = 16
                //                                     and pd.statusenabled=true
                //                                     AND pd.tglpulang > '$tglpulang'
                //                                     AND pd.tglregistrasi < '$tglregistrasi'
                //                                     and pd.objectruanganlastfk ='$itemTTD->koderuangan'
                //                                 ) AS x"
                //     ));
                //     // $hariPerawatanperruangan = DB::select(DB::raw("
                //     // SELECT   COUNT (x.norec) AS jumlahhariperawatan
                //     //                         FROM
                //     //                             (
                //     //                                 SELECT
                //     //                                     pd.norec,
                //     //                                     pd.tglkeluar,
                //     //                                     to_char ( pd.tglmasuk,'MM') AS bulanregis
                //     //                                 FROM
                //     //                                     antrianpasiendiperiksa_t AS pd
                //     //                                 INNER JOIN ruangan_m AS ru ON ru.ID = pd.objectruanganfk
                //     //                                 WHERE
                //     //                                     ru.objectdepartemenfk = 16
                //     //                                 and pd.statusenabled=true
                //     //                                 AND pd.tglkeluar > '$tglpulang'
                //     //                                 AND pd.tglmasuk < '$tglregistrasi'
                //     //                                 and pd.objectruanganfk ='$itemTTD->koderuangan'
                //     //                             ) AS x"
                //     // ));
                //     foreach ($hariPerawatanperruangan as $item) {
                //         $jumlahhariperawatanperruangan = $jumlahhariperawatanperruangan + (int)$item->jumlahhariperawatan;
                //     }
                // }
                $hariPerawatanperruangan = DB::select(DB::raw("
                        select  count(x.noregistrasi)as jumlahhariperawatan from (
                                    select pds.noregistrasi,pd.tglregistrasi,pd.tglpulang,pds.tglinsertsensus from pasiendaftarsensus_t as pds 
                                    JOIN pasiendaftar_t as pd on pd.norec=pds.noregistrasifk where 
                                    pds.tglinsertsensus BETWEEN '$tglregistrasi' and '$tglpulang' and 
                                    pds.tglinsertsensus BETWEEN pd.tglregistrasi and pd.tglpulang and
                                    pds.objectruanganlastfk ='$itemTTD->koderuangan'
                                    ORDER BY pds.noregistrasi,pds.tglinsertsensus
                                    ) as x       
                        "));
                foreach ($hariPerawatanperruangan as $item) {
                    $jumlahhariperawatanperruangan = $jumlahhariperawatanperruangan + (int)$item->jumlahhariperawatan;
                }
                $hariPerawatanperruangan = DB::select(DB::raw("
                        select  count(x.noregistrasi)as jumlahhariperawatan from (
                                    select pds.noregistrasi,pd.tglregistrasi,pd.tglpulang,pds.tglinsertsensus from pasiendaftarsensus_t as pds 
                                    JOIN pasiendaftar_t as pd on pd.norec=pds.noregistrasifk where 
                                    pds.tglinsertsensus BETWEEN '$tglregistrasi' and '$tglpulang' and 
                                    pd.tglpulang is null and
                                    pds.objectruanganlastfk ='$itemTTD->koderuangan'
                                    ORDER BY pds.noregistrasi,pds.tglinsertsensus
                                    ) as x       
                        "));
                foreach ($hariPerawatanperruangan as $item) {
                    $jumlahhariperawatanperruangan = $jumlahhariperawatanperruangan + (int)$item->jumlahhariperawatan;
                }
                $jumlahlamaRawatperruangan =0 ;
                $lamaRawatperruangan = DB::select(DB::raw("
                        select sum(x.hari) as lamarawat, count(x.noregistrasi)as jumlahpasienpulang from (
                        SELECT 
                            date_part('DAY', to_char(tglpulang, 'YYYY-MM-DD')::TIMESTAMP- to_char(tglregistrasi, 'YYYY-MM-DD')::TIMESTAMP) as hari,pd.noregistrasi
                            FROM
                                    pasiendaftar_t AS pd
                        --  INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
                            INNER JOIN ruangan_m AS ru ON ru. ID = pd.objectruanganlastfk
                            WHERE
                                            pd.tglpulang BETWEEN '$tglAwal'
                        AND '$tglAkhir' and
                            ru.objectdepartemenfk = 16 
                            and pd.tglpulang is not null
                            and pd.statusenabled=true
                            and pd.objectruanganlastfk ='$itemTTD->koderuangan'
                            GROUP BY pd.noregistrasi,pd.tglpulang,pd.tglregistrasi
                         -- order by pd.noregistrasi 
                            ) as x       
                "));
                // $lamaRawatperruangan = DB::select(DB::raw("
                //         select sum(x.hari) as lamarawat, count(x.norec)as jumlahpasienpulang from (
                //         SELECT 
                //             date_part('DAY', to_char(tglkeluar, 'YYYY-MM-DD')::TIMESTAMP- to_char(tglmasuk, 'YYYY-MM-DD')::TIMESTAMP) as hari,pd.norec
                //             FROM
                //                     antrianpasiendiperiksa_t AS pd
                //         --  INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
                //             INNER JOIN ruangan_m AS ru ON ru. ID = pd.objectruanganfk
                //             WHERE
                //                             pd.tglkeluar BETWEEN '$tglAwal'
                //         AND '$tglAkhir' and
                //             ru.objectdepartemenfk = 16 
                //             and pd.tglkeluar is not null
                //             and pd.statusenabled=true
                //             and pd.objectruanganfk ='$itemTTD->koderuangan'
                //             GROUP BY pd.norec,pd.tglkeluar,pd.tglmasuk
                //          -- order by pd.noregistrasi 
                //             ) as x       
                // "));
                foreach ($lamaRawatperruangan as $itemjumlahlamaRawatperruangan) {
                    $jumlahlamaRawatperruangan = $jumlahlamaRawatperruangan + (int)$itemjumlahlamaRawatperruangan->lamarawat;
                }
                $jmldataMeninggalperruangan=0;
                $dataMeninggalperruangan = DB::select(DB::raw("select count(x.noregistrasi) as jumlahmeninggal,  
                    count(case when x.objectkondisipasienfk = '6' then 1 end ) AS jumlahlebih48,
                    count(case when x.objectkondisipasienfk <> '6' then 1 end ) AS jumlahkurang48 FROM
                    (
                    select noregistrasi,to_char(tglregistrasi , 'mm')  as bulanregis ,statuskeluar,kondisipasien,objectkondisipasienfk
                    from pasiendaftar_t 
                    join statuskeluar_m on statuskeluar_m.id =pasiendaftar_t.objectstatuskeluarfk
                    left join kondisipasien_m on kondisipasien_m.id =pasiendaftar_t.objectkondisipasienfk
                    LEFT JOIN ruangan_m AS ru ON ru.id = pasiendaftar_t.objectruanganlastfk
                    where objectstatuskeluarfk =5
                    AND ( ru.objectdepartemenfk = '16' )
                    and pasiendaftar_t.tglpulang BETWEEN '$tglAwal' and '$tglAkhir'
                    and pasiendaftar_t.statusenabled=true
                    and pasiendaftar_t.objectruanganlastfk ='$itemTTD->koderuangan'
                    ) as x;"));
                    foreach ($dataMeninggalperruangan as $itemdataMeninggalperruangan) {
                        $jmldataMeninggalperruangan =  (int)$itemdataMeninggalperruangan->jumlahmeninggal;
                    }

                    // $jmlpasienpulangperruangan= (int)$itemjumlahlamaRawatperruangan->jumlahpasienpulang;
                    $borruangan=0;
                    $alosruangan=0;
                    $btoruangan=0;
                    $gdrruangan=0;
                    $ndrruangan=0;
                    $toiruangan=0;
                    $borruangan = ( (int)$jumlahhariperawatanperruangan * 100 / ($itemTTD->jmlbed * $total_day));
                    if ( (int)$itemjumlahlamaRawatperruangan->jumlahpasienpulang > 0){
                        $alosruangan = $jumlahlamaRawatperruangan / (int)$itemjumlahlamaRawatperruangan->jumlahpasienpulang;
                    }
                    if ( (int)$itemjumlahlamaRawatperruangan->jumlahpasienpulang > 0){
                        $toiruangan = ( ( $itemTTD->jmlbed * $total_day)- (int)$jumlahhariperawatanperruangan ) /(int)$itemjumlahlamaRawatperruangan->jumlahpasienpulang ;
                        /** @var  $gdr = (Jumlah Mati dibagi Jumlah pasien Keluar (Hidup dan Mati) */
                        $gdrruangan = $jmldataMeninggalperruangan * 1000 /(int)$itemjumlahlamaRawatperruangan->jumlahpasienpulang ;
                        /** @var  $NDR = (Jumlah Mati > 48 Jam dibagi Jumlah pasien Keluar (Hidup dan Mati) */
                        $ndrruangan = (int)$itemdataMeninggalperruangan->jumlahlebih48 * 1000 /(int)$itemjumlahlamaRawatperruangan->jumlahpasienpulang ;
                        /** @var  $bto = Jumlah pasien Keluar (Hidup dan Mati) DIBAGI Jumlah tempat tidur */
                        $btoruangan = (int)$itemjumlahlamaRawatperruangan->jumlahpasienpulang / $itemTTD->jmlbed;
                    }
                $dataTTDetail [] =array(
                    'namaruangan' => $itemTTD->namaruangan,
                    'hariperawatan' => $jumlahhariperawatanperruangan,
                    'lamarawat' => $jumlahlamaRawatperruangan,
                    'jmlbed' => $itemTTD->jmlbed,
                    'bulanregis' => $itemTTD->bulanregis,
                    'jmlpasienpulangperruangan' => (int)$itemjumlahlamaRawatperruangan->jumlahpasienpulang,
                    'jmlpasienmeninggalperruangan' => (int)$jmldataMeninggalperruangan,
                    'jmlpasienmeninggallebih48perruangan' => (int)$itemdataMeninggalperruangan->jumlahlebih48,
                    'jmlpasienmeninggalkurang48perruangan' => (int)$itemdataMeninggalperruangan->jumlahkurang48,
                    'borruangan' => (float) number_format($borruangan,2),
                    'alosruangan' => (float) number_format($alosruangan,2),
                    'btoruangan' => (float) number_format($btoruangan,2),
                    'gdrruangan' => (float) number_format($gdrruangan,2),
                    'ndrruangan' => (float) number_format($ndrruangan,2),
                    'toiruangan' => (float) number_format($toiruangan,2),
                );
            }
            // return($dataTTDetail);
            // die();

            $data10[] = array(
                'tt' =>$jumlahTT,
                'lamarawat'=>(int)$itemLamaRawat->lamarawat,
                'hariperawatan' => $hariPerawatanJml,
                'pasienpulang' => $jmlPasienPlg,
                'meninggal' => $jmlMeninggal,
                'matilebih48' =>  $jmlMatilebih48,
                'tahun' => $tahun,
                'bulan' => date('d-M-Y') ,//(float)$item->bulanregis ,
                'bor' =>(float) number_format($bor,2),
                'alos' =>(float) number_format($alos,2),
                'bto' =>(float) number_format($bto,2),
                'toi' => (float)number_format($toi,2),
                'gdr' => (float)number_format($gdr,2),
                'ndr' => (float) number_format($ndr,2),
                'bulanregis' => $bulan,
                'matikurang48' =>  $jmlMatikurang48,
                'ttDetail' => $dataTTDetail,
                'pasienpulangdetail' => $pasienpulang
            );
        // }
        return $this->respond($data10);
    }
    public function getBorLosToiPolritahun(Request $request)
    {
      $idDepRaJal = 18;
        $tglAwal =  date('Y-m-d 00:00'); //Carbon::now()->startOfMonth()->subMonth(1);
        $tglAkhir = date('Y-m-d 23:59');
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        // $bulan = $request['tglAwal']->format('y-m');
        $bulan=date_create($tglAwal);
        $bulan=date_format($bulan,"yy");
        $bulanregis=date_create($tglAwal);
        $bulanregis=date_format($bulanregis,"m");
        
        // return($tglAkhir);
        // die();
 
        $tahun = new \DateTime($tglAkhir);
        $tahun = date ('Y');
        $datetime1 = new \DateTime($tglAwal);
        $datetime2 = new \DateTime($tglAkhir);
        $interval = $datetime1->diff($datetime2);
        $sehari = 1;//$interval->format('%d');

        $year = Carbon::now()->year;
        $num_of_days = [];
        // if($year == date('Y'))
        //     $total_month = date('m');
        // else
            $total_month = 12;

        for($m=1; $m<=$total_month; $m++){
            $num_of_days[] = array(
                'bulan' =>  $m,
                'jumlahhari' =>  cal_days_in_month(CAL_GREGORIAN, $m, $year),
            );
        }
        
        $total_daytahun=0;
        foreach ($num_of_days as $numday){
            $total_daytahun = $total_daytahun+$numday['jumlahhari'];
        }
        
        $data10=[];
        $jumlahTT =  0;
        $dataTTs =DB::select(DB::raw("SELECT sum (x.jmlbed) AS tt FROM 
            (select Format (tglaktif,'yyyy-MM') AS bulanregis,jmlbed from skbeddinamis_m ) as x where x.bulanregis between '$tglAwal'
            and '$tglAkhir'
        "));
           $jumlahTT =   (int)$dataTTs[0]->tt;
// return($dataTTs);
// die();

        ini_set('max_execution_time', 1000); //6 minutes
        $jumlahhariperawatantemp = 0;
        $jumlahhariperawatan = 0;
        for($th=1; $th<=$total_month; $th++){
            foreach ($num_of_days as $numday){
                if ($numday['bulan'] == $th){
                    $total_day = $numday['jumlahhari'];
                }
            }
            // return($total_day);
            // die();
            for($m=1; $m<=$total_day; $m++){
                $tglregistrasi =$bulan.'-'.$th.'-'.$m.' 00:00:00';
                $tglpulang =$bulan.'-'.$th.'-'.$m.' 23:59:59';
                
                $hariPerawatan = DB::select(DB::raw("
                SELECT   COUNT (x.noregistrasi) AS jumlahhariperawatan
                                        FROM
                                            (
                                                SELECT
                                                    pd.noregistrasi,
                                                    pd.tglpulang,
                                                    Format ( pd.tglregistrasi,'MM') AS bulanregis
                                                FROM
                                                    pasiendaftar_t AS pd
                                                INNER JOIN ruangan_m AS ru ON ru.ID = pd.objectruanganlastfk
                                                WHERE
                                                    ru.objectdepartemenfk = 16
                                                and pd.statusenabled=true
                                                AND pd.tglpulang > '$tglpulang'
                                                AND pd.tglregistrasi < '$tglregistrasi'
                                            ) AS x"
                ));
                foreach ($hariPerawatan as $item) {
                    $jumlahhariperawatantemp = $jumlahhariperawatantemp + (int)$item->jumlahhariperawatan;
                }
            }
            $jumlahhariperawatan = $jumlahhariperawatan + $jumlahhariperawatantemp;
        }
        
        // return($jumlahhariperawatan);
        // die();
       
      
        $lamaRawat = DB::select(DB::raw("
                        select sum(x.hari) as lamarawat, count(x.noregistrasi)as jumlahpasienpulang from (
                        SELECT 
                            date_part('DAY', pd.tglpulang- pd.tglregistrasi) as hari ,pd.noregistrasi
                            FROM
                                    pasiendaftar_t AS pd
                        --  INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
                            INNER JOIN ruangan_m AS ru ON ru. ID = pd.objectruanganlastfk
                            WHERE
                                            pd.tglpulang BETWEEN '$tglAwal'
                        AND '$tglAkhir' and
                            ru.objectdepartemenfk = 16 
                            and pd.tglpulang is not null
                            and pd.statusenabled=true
                            GROUP BY pd.noregistrasi,pd.tglpulang,pd.tglregistrasi
                         -- order by pd.noregistrasi 
                            ) as x       
                "));
        $pasienpulang = DB::select(DB::raw("
                select * from (
                SELECT 
                    DATEDIFF(DAY, pd.tglregistrasi, pd.tglpulang) as hari ,pd.noregistrasi,pd.tglpulang,ps.namapasien
                    FROM
                            pasiendaftar_t AS pd
                --  INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
                    INNER JOIN ruangan_m AS ru ON ru. ID = pd.objectruanganlastfk
                    inner join pasien_m as ps on ps.id = pd.nocmfk
                    WHERE
                                    pd.tglpulang BETWEEN '$tglAwal'
                AND '$tglAkhir' and
                    ru.objectdepartemenfk = 16 
                    and pd.tglpulang is not null
                    and pd.statusenabled=true
                    GROUP BY pd.noregistrasi,pd.tglpulang,pd.tglregistrasi,ps.namapasien
                 -- order by pd.noregistrasi 
                    ) as x       
        "));

        // return($lamaRawat);
        // die();

        $dataMeninggal = DB::select(DB::raw("select count(x.noregistrasi) as jumlahmeninggal, 
                count(case when x.objectkondisipasienfk = '6' then 1 end ) AS jumlahlebih48,
                count(case when x.objectkondisipasienfk <> '6' then 1 end ) AS jumlahkurang48 FROM
                (
                select noregistrasi ,statuskeluar,kondisipasien,objectkondisipasienfk
                from pasiendaftar_t 
                join statuskeluar_m on statuskeluar_m.id =pasiendaftar_t.objectstatuskeluarfk
                left join kondisipasien_m on kondisipasien_m.id =pasiendaftar_t.objectkondisipasienfk
                where objectstatuskeluarfk =5
                and pasiendaftar_t.tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir'
                and pasiendaftar_t.statusenabled=true
                ) as x ;"));
//        return $this->respond($sehari);
      
        
        $bor = 0;
        $alos = 0;
        $toi = 0;
        $bto = 0;
        $ndr = 0;
        $gdr = 0;
        $hariPerawatanJml = 0;
        $jmlPasienPlg = 0;
        $jmlLamaRawat = 0;
        $jmlMeninggal = 0;
        $jmlMatilebih48=0;
        $jmlMatikurang48=0;
        // foreach ($hariPerawatan as $item){
            foreach ($lamaRawat as $itemLamaRawat){
                foreach ($dataMeninggal as $itemDead) {
//                         if ($item->bulanregis == $itemLamaRawat->bulanpulang &&
//                             $itemLamaRawat->bulanpulang == $itemDead->bulanregis ) {
                    /** @var  $gdr = (Jumlah Mati dibagi Jumlah pasien Keluar (Hidup dan Mati) */
                    $gdr = (int) $itemDead->jumlahmeninggal * 1000 /(int)$itemLamaRawat->jumlahpasienpulang ;
                    /** @var  $NDR = (Jumlah Mati > 48 Jam dibagi Jumlah pasien Keluar (Hidup dan Mati) */
                    $ndr = (int) $itemDead->jumlahlebih48 * 1000 /(int)$itemLamaRawat->jumlahpasienpulang ;

                    $jmlMeninggal = (int) $itemDead->jumlahmeninggal ;
                    $jmlMatilebih48= (int) $itemDead->jumlahlebih48;
                    $jmlMatikurang48= (int) $itemDead->jumlahkurang48;
//                         }
                }
             
//                if ($item->bulanregis == $itemLamaRawat->bulanpulang ) {
                /** @var  $alos = (Jumlah Lama Dirawat dibagi Jumlah pasien Keluar (Hidup dan Mati) */
//                return $this->respond($itemLamaRawat->jumlahpasienpulang );
                if ( (int)$itemLamaRawat->jumlahpasienpulang > 0){
                    $alos = (int)$itemLamaRawat->lamarawat / (int)$itemLamaRawat->jumlahpasienpulang;
                }

                /** @var  $bto = Jumlah pasien Keluar (Hidup dan Mati) DIBAGI Jumlah tempat tidur */
                // return($jumlahTT);
                // die();
                $bto = (int)$itemLamaRawat->jumlahpasienpulang / $jumlahTT;
                
//                }
            //    foreach ($num_of_days as $numday){
            //        if ($numday['bulan'] == $bulanregis){
                /** @var  $bor = (Jumlah hari perawatn RS dibagi ( jumlah TT x Jumlah hari dalam satu periode ) ) x 100 % */
                $bor = ( (int)$jumlahhariperawatan * 100 / ($jumlahTT * $total_daytahun));
                /** @var  $toi = (Jumlah TT X Periode) - Hari Perawatn DIBAGI Jumlah pasien Keluar (Hidup dan Mati)*/
//                        $toi = ( ( $jumlahTT * $numday['jumlahhari'] )- (int)$item->jumlahhariperawatan ) /(int)$itemLamaRawat->jumlahpasienpulang ;
                if ( (int)$itemLamaRawat->jumlahpasienpulang > 0){
                    $toi = ( ( $jumlahTT * $total_daytahun)- (int)$jumlahhariperawatan ) /(int)$itemLamaRawat->jumlahpasienpulang ;
                }
                $hariPerawatanJml = (int)$jumlahhariperawatan;
                $jmlPasienPlg = (int)$itemLamaRawat->jumlahpasienpulang-$jmlMeninggal;
            //        }
            //    }
            }
            
            // return($dataTTDetail);
            // die();

            $data10[] = array(
                'tt' =>$jumlahTT,
                'lamarawat'=>(int)$itemLamaRawat->lamarawat,
                'hariperawatan' => $hariPerawatanJml,
                'pasienpulang' => $jmlPasienPlg,
                'meninggal' => $jmlMeninggal,
                'matilebih48' =>  $jmlMatilebih48,
                'tahun' => $tahun,
                'bulan' => date('d-M-Y') ,//(float)$item->bulanregis ,
                'bor' =>(float) number_format($bor,2),
                'alos' =>(float) number_format($alos,2),
                'bto' =>(float) number_format($bto,2),
                'toi' => (float)number_format($toi,2),
                'gdr' => (float)number_format($gdr,2),
                'ndr' => (float) number_format($ndr,2),
                'bulanregis' => $bulan,
                'matikurang48' =>  $jmlMatikurang48,
                
            );
        // }
        return $this->respond($data10);
    }
    public function getBorLosToi(Request $request)
    {
        $idDepRaJal = 18;
        $tglAwal =  $request['tgl'].' 00:00'; //Carbon::now()->startOfMonth()->subMonth(1);
        $tglAkhir =  $request['tgl'].' 23:59';
        $tahun = new \DateTime($tglAkhir);
        $tahun = date ('Y');
        $datetime1 = new \DateTime($tglAwal);
        $datetime2 = new \DateTime($tglAkhir);
        $interval = $datetime1->diff($datetime2);
        $sehari = 1;//$interval->format('%d');
        $data10=[];
        $jumlahTT = (float) $this->settingDataFixed('jmlTempatTidur');
//        $hariPerawatan = DB::select(DB::raw("select count (x.noregistrasi) as jumlahhariperawatan,x.bulanregis from (
//									select pd.noregistrasi ,extract (month from pd.tglregistrasi) as bulanregis
//									from pasiendaftar_t as pd
//									inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec and pd.objectruanganlastfk=apd.objectruanganfk
//									inner join ruangan_m as ru on ru.id=apd.objectruanganfk
//									where
//									pd.tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir'
//									and ru.objectdepartemenfk =16
//									GROUP BY pd.noregistrasi, pd.tglregistrasi,pd.tglpulang
//									order by pd.tglregistrasi
//                    )as x
//                    group by x.bulanregis order by x.bulanregis;
//                "));
        $hariPerawatan = DB::select(DB::raw("
        SELECT   COUNT (x.noregistrasi) AS jumlahhariperawatan
                                FROM
                                    (
                                        SELECT
                                            pd.noregistrasi,
                                            pd.tglpulang,
                                            to_char ( pd.tglregistrasi,'mm') AS bulanregis
                                        FROM
                                            pasiendaftar_t AS pd
                                        INNER JOIN ruangan_m AS ru ON ru.ID = pd.objectruanganlastfk
                                        WHERE
                                            ru.objectdepartemenfk = 16 
                                    and (  pd.tglregistrasi < '$tglAwal' AND pd.tglpulang >= '$tglAkhir' 
                                    )
                                    or pd.tglpulang is null
                                    and pd.statusenabled=true 
                                    ) AS x"
        ));
//        $hariPerawatan = DB::select(DB::raw("SELECT
//                            SUM (z.jumlah) AS jumlahhariperawatan
//                        FROM
//                            (
//                                SELECT
//                                    COUNT (x.noregistrasi) AS jumlah
//                                FROM
//                                    (
//                                        SELECT
//                                            pd.noregistrasi,
//                                            pd.tglpulang,
//                                            Format ( pd.tglregistrasi,'mm') AS bulanregis
//                                        FROM
//                                            pasiendaftar_t AS pd
//                                        INNER JOIN ruangan_m AS ru ON ru.ID = pd.objectruanganlastfk
//                                        WHERE
//                                            ru.objectdepartemenfk = 16
//                                        AND pd.tglpulang IS NULL
//                                        AND pd.tglregistrasi NOT BETWEEN '$tglAwal'
//                                        AND '$tglAkhir'
//                                    ) AS x
//                                UNION ALL
//                                    SELECT
//                                        COUNT (x.noregistrasi) AS jumlah
//                                    FROM
//                                        (
//                                            SELECT
//                                                pd.noregistrasi,
//                                                pd.tglpulang,
//                                                    Format ( pd.tglregistrasi,'mm')  AS bulanregis
//                                            FROM
//                                                pasiendaftar_t AS pd
//                                            INNER JOIN ruangan_m AS ru ON ru.ID = pd.objectruanganlastfk
//                                            WHERE
//                                                ru.objectdepartemenfk = 16
//                                            AND pd.tglregistrasi NOT BETWEEN '$tglAwal'
//                                        AND '$tglAkhir'
//                                            AND pd.tglpulang IS NULL
//                                        ) AS x
//                                    UNION ALL
//                                        SELECT
//                                            COUNT (x.noregistrasi) AS jumlah
//                                        FROM
//                                            (
//                                                SELECT
//                                                    pd.noregistrasi,
//                                                    pd.tglpulang,
//                                                    Format ( pd.tglregistrasi,'mm')  AS bulanregis
//                                                FROM
//                                                    pasiendaftar_t AS pd
//                                                INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
//                                                WHERE
//                                                    ru.objectdepartemenfk = 16
//                                                  AND pd.tglregistrasi NOT BETWEEN '$tglAwal'
//                                             AND '$tglAkhir'
//                                            ) AS x
//                            ) AS z"));
        $lamaRawat = DB::select(DB::raw("
                        select sum(x.hari) as lamarawat, count(x.noregistrasi)as jumlahpasienpulang from (
                        SELECT 
                            date_part('DAY', to_char(tglpulang, 'YYYY-MM-DD')::TIMESTAMP- to_char(tglregistrasi, 'YYYY-MM-DD')::TIMESTAMP) as hari,pd.noregistrasi
                            FROM
                                    pasiendaftar_t AS pd
                        -- 	INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
                            INNER JOIN ruangan_m AS ru ON ru. ID = pd.objectruanganlastfk
                            WHERE
                                            pd.tglpulang BETWEEN '$tglAwal'
                            AND '$tglAkhir' and
                            ru.objectdepartemenfk = 16 
                            and pd.tglpulang is not null
                            GROUP BY pd.noregistrasi,pd.tglpulang,pd.tglregistrasi
                         -- order by pd.noregistrasi 
                            ) as x       
                "));
//        $lamaRawat = DB::select(DB::raw("select count(x.tglpulang) as jumlahpasienpulang, sum(x.hari) as lamarawat ,x.bulanpulang from (
//									select
//									date_part('day'::text, ((pd.tglpulang::date)::timestamp without time zone - pd.tglregistrasi))  AS hari,pd.tglpulang,
//                                    extract (month from pd.tglpulang) as bulanpulang
//									from pasiendaftar_t as pd
//									inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec and pd.objectruanganlastfk=apd.objectruanganfk
//									inner join ruangan_m as ru on ru.id=apd.objectruanganfk
//									where
//									pd.tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir'
//									and ru.objectdepartemenfk =16
//								    and pd.tglpulang is not null
//									GROUP BY pd.noregistrasi, pd.tglregistrasi,pd.tglpulang
//									order by pd.tglregistrasi
//                    )as x
//                    group by x.bulanpulang "));

        $dataMeninggal = DB::select(DB::raw("select count(x.noregistrasi) as jumlahmeninggal, x.bulanregis,  
                count(case when x.objectkondisipasienfk = '6' then 1 end ) AS jumlahlebih48 FROM
                (
                select noregistrasi,to_char(tglregistrasi , 'mm')  as bulanregis ,statuskeluar,kondisipasien,objectkondisipasienfk
                from pasiendaftar_t 
                join statuskeluar_m on statuskeluar_m.id =pasiendaftar_t.objectstatuskeluarfk
                left join kondisipasien_m on kondisipasien_m.id =pasiendaftar_t.objectkondisipasienfk
                where objectstatuskeluarfk =5
                and  tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir'
                ) as x
                GROUP BY x.bulanregis;"));
//        return $this->respond($sehari);
        $year = Carbon::now()->year;
        $num_of_days = [];
        if($year == date('Y'))
            $total_month = date('m');
        else
            $total_month = 12;

        for($m=1; $m<=$total_month; $m++){
            $num_of_days[] = array(
                'bulan' =>  $m,
                'jumlahhari' =>  cal_days_in_month(CAL_GREGORIAN, $m, $year),
            );
        }
        $bor = 0;
        $alos = 0;
        $toi = 0;
        $bto = 0;
        $ndr = 0;
        $gdr = 0;
        $hariPerawatanJml = 0;
        $jmlPasienPlg = 0;
        $jmlLamaRawat = 0;
        $jmlMeninggal = 0;
        $jmlMatilebih48=0;
        foreach ($hariPerawatan as $item){
            foreach ($lamaRawat as $itemLamaRawat){
                foreach ($dataMeninggal as $itemDead) {
//                         if ($item->bulanregis == $itemLamaRawat->bulanpulang &&
//                             $itemLamaRawat->bulanpulang == $itemDead->bulanregis ) {
                    /** @var  $gdr = (Jumlah Mati dibagi Jumlah pasien Keluar (Hidup dan Mati) */
                    $gdr = (int) $itemDead->jumlahmeninggal * 1000 /(int)$itemLamaRawat->jumlahpasienpulang ;
                    /** @var  $NDR = (Jumlah Mati > 48 Jam dibagi Jumlah pasien Keluar (Hidup dan Mati) */
                    $ndr = (int) $itemDead->jumlahlebih48 * 1000 /(int)$itemLamaRawat->jumlahpasienpulang ;

                    $jmlMeninggal = (int) $itemDead->jumlahmeninggal ;
                    $jmlMatilebih48= (int) $itemDead->jumlahlebih48;
//                         }
                }
//                if ($item->bulanregis == $itemLamaRawat->bulanpulang ) {
                /** @var  $alos = (Jumlah Lama Dirawat dibagi Jumlah pasien Keluar (Hidup dan Mati) */
//                return $this->respond($itemLamaRawat->jumlahpasienpulang );
                if ( (int)$itemLamaRawat->jumlahpasienpulang > 0){
                    $alos = (int)$itemLamaRawat->lamarawat / (int)$itemLamaRawat->jumlahpasienpulang;
                }

                /** @var  $bto = Jumlah pasien Keluar (Hidup dan Mati) DIBAGI Jumlah tempat tidur */
                $bto = (int)$itemLamaRawat->jumlahpasienpulang / $jumlahTT;

//                }
//                foreach ($num_of_days as $numday){
//                    if ($numday['bulan'] == $item->bulanregis){
                /** @var  $bor = (Jumlah hari perawatn RS dibagi ( jumlah TT x Jumlah hari dalam satu periode ) ) x 100 % */
                $bor = ( (int)$item->jumlahhariperawatan * 100 / ($jumlahTT *  (float)$sehari ));//$numday['jumlahhari']));
                /** @var  $toi = (Jumlah TT X Periode) - Hari Perawatn DIBAGI Jumlah pasien Keluar (Hidup dan Mati)*/
//                        $toi = ( ( $jumlahTT * $numday['jumlahhari'] )- (int)$item->jumlahhariperawatan ) /(int)$itemLamaRawat->jumlahpasienpulang ;
                if ( (int)$itemLamaRawat->jumlahpasienpulang > 0){
                    $toi = ( ( $jumlahTT * (float)$sehari)- (int)$item->jumlahhariperawatan ) /(int)$itemLamaRawat->jumlahpasienpulang ;
                }
                $hariPerawatanJml = (int)$item->jumlahhariperawatan;
                $jmlPasienPlg = (int)$itemLamaRawat->jumlahpasienpulang;
//                    }
//                }
            }

            $data10[] = array(
                'jmltt'=>  $jumlahTT,
                'lamarawat'=>(int)$itemLamaRawat->lamarawat,
                'hariperawatan' => $hariPerawatanJml,
                'pasienpulang' => $jmlPasienPlg,
                'meninggal' => $jmlMeninggal,
                'matilebih48' =>  $jmlMatilebih48,
                'tahun' => $tahun,
                'bulan' => date('d-M-Y') ,//(float)$item->bulanregis ,
                'bor' =>(float) number_format($bor,2),
                'alos' =>(float) number_format($alos,2),
                'bto' =>(float) number_format($bto,2),
                'toi' => (float)number_format($toi,2),
                'gdr' => (float)number_format($gdr,2),
                'ndr' => (float) number_format($ndr,2),
            );
        }
        return $this->respond($data10);

    }
    public function getHakAkses(Request $request)
    {
        $reqAll = $request->all();
        $data = DB::table('loginuser_s as lu')
            ->join('kelompokuser_s as kps','kps.id','=','lu.objectkelompokuserfk')
            ->select('lu.namauser','kps.kelompokuser','lu.objectkelompokuserfk')
//            ->where('lu.objectkelompokuserfk',  42)
            ->where('lu.objectpegawaifk',$request['pegawaiId'])
            ->first();
        $message ='sukses';
//        if ($data->objectkelompokuserfk == 42){
//            $message ='sukses';
//        }else{
//            $message ='gagal';
//        }

        return $this->respond($message);

    }

    public  function getKunjunganPerJenisPelayanan (Request $request){
        $tglAwal =  $request['tgl'].' 00:00'; //Carbon::now()->startOfMonth()->subMonth(1);
        $tglAkhir =  $request['tgl'].' 23:59';
        $data = DB::select(DB::raw("
            SELECT dp.id,
            dp.namadepartemen,
            pd.norec as norec_pd,
            CASE WHEN jp.jenispelayanan IS NULL THEN 'REGULER' else jp.jenispelayanan end as jenispelayanan
            FROM
            pasiendaftar_t AS pd
            left JOIN jenispelayanan_m AS jp ON CAST (jp.id AS CHAR) = pd.jenispelayanan
            JOIN ruangan_m AS ru ON ru. ID = pd.objectruanganlastfk
            JOIN departemen_m AS dp ON dp. ID = ru.objectdepartemenfk
            WHERE
            pd.tglregistrasi BETWEEN '$tglAwal'
           
            AND '$tglAkhir'
            and pd.statusenabled=true
        "));
        $data10=[];
        $data20=[];
        $reguler=0;
        $eksekutif=0;
        if (count($data) > 0) {
            foreach ($data as $item) {
                $sama = false;
                $i = 0;
                foreach ($data10 as $hideung) {
                    if ($item->id == $data10[$i]['id']) {
                        $sama = 1;
                        $jml = (float)$hideung['total'] + 1;
                        $data10[$i]['total'] = $jml;
                        if ($item->jenispelayanan == 'REGULER') {
                            $data10[$i]['reguler'] = (float)$hideung['reguler'] + 1;
                        }
                        if ($item->jenispelayanan == 'EKSEKUTIF') {
                            $data10[$i]['eksekutif'] = (float)$hideung['eksekutif'] + 1;
                        }
                    }
                    $i = $i + 1;
                }
                if ($sama == false) {
                    if ($item->jenispelayanan == 'REGULER') {
                        $reguler = 1;
                        $eksekutif = 0;

                    }
                    if ($item->jenispelayanan == 'EKSEKUTIF') {
                        $reguler = 0;
                        $eksekutif = 1;
                    }

                    $data10[] = array(
                        'id' => $item->id,
                        'namadepartemen' => $item->namadepartemen,
                        'total' => 1,
                        'reguler' => $reguler,
                        'eksekutif' => $eksekutif


                    );

                }
                foreach ($data10 as $key => $row) {
                    $count[$key] = $row['id'];
                }
                array_multisort($count, SORT_DESC, $data10);
            }
        }



        $result = array(
            'data'=> $data10 ,
            'jml' => count($data),

        );
        return $this->respond($result);

    }
    public function detailPasienRJ(Request $request)
    {
        $tglAwal = $request['tgl'].' 00:00';
        $tglAkhir =  $request['tgl'].' 23:59';
        if($request['idRuangan']==999){
             $data = DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps','ps.id','=','pd.nocmfk')
            ->join('ruangan_m as ru','ru.id','=','pd.objectruanganlastfk')
            ->leftjoin('ruangan_m as ruu','ruu.id','=','pd.objectruanganasalfk')
            ->join ('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
            ->select('pd.noregistrasi','pd.tglregistrasi','ps.nocm','ps.namapasien','ru.namaruangan',
                'pd.tglpulang','ruu.namaruangan as namaruanganasal')
            ->whereBetween('pd.tglregistrasi',[$tglAwal,$tglAkhir])
            ->where('ru.objectruanganfk',19)
                 ->where('pd.statusenabled',1)
            ->get();
        }else if ($request['idRuangan']==44){
            $data = DB::table('antrianpasiendiperiksa_t as apd')
                ->join('pasiendaftar_t as pd','pd.norec','=','apd.noregistrasifk')
                ->join('pasien_m as ps','ps.id','=','pd.nocmfk')
                ->join('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
                ->leftjoin('ruangan_m as ruu','ruu.id','=','apd.objectruanganasalfk')
                ->join ('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
                ->select('pd.noregistrasi','pd.tglregistrasi','ps.nocm','ps.namapasien','ru.namaruangan',
                    'pd.tglpulang','ruu.namaruangan as namaruanganasal')
                ->whereBetween('apd.tglregistrasi',[$tglAwal,$tglAkhir])
                     ->where('pd.statusenabled',1)
                ->wherein('ru.id',array(44,277,447))
                ->get();
        }else if ($request['idRuangan']==496){
            $data = DB::table('antrianpasiendiperiksa_t as apd')
                ->join('pasiendaftar_t as pd','pd.norec','=','apd.noregistrasifk')
                ->join('pasien_m as ps','ps.id','=','pd.nocmfk')
                ->join('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
                ->leftjoin('ruangan_m as ruu','ruu.id','=','apd.objectruanganasalfk')
                ->join ('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
                ->select('pd.noregistrasi','pd.tglregistrasi','ps.nocm','ps.namapasien','ru.namaruangan',
                    'pd.tglpulang','ruu.namaruangan as namaruanganasal')
                ->whereBetween('apd.tglregistrasi',[$tglAwal,$tglAkhir])
                     ->where('pd.statusenabled',1)
                ->where('ru.id',496)
                ->get();
        }else if ($request['idRuangan'] == 1001) {
            $data = DB::select(DB::raw("SELECT
                    [pd].[noregistrasi],
                    [pd].[tglregistrasi],
                    [ps].[nocm],
                    [ps].[namapasien],
                    [ru].[namaruangan],
                    [ru].[namaruangan] as [namaruanganasal],
                    [pd].[tglpulang]
                FROM
                    [pasiendaftar_t] AS [pd] 
                INNER JOIN [pasien_m] AS [ps] ON [ps].[id] = [pd].[nocmfk]
                INNER JOIN [ruangan_m] AS [ru] ON ru.id = [pd].[objectruanganlastfk]
                left JOIN [ruangan_m] AS [ruu] ON [ruu].[id] = [pd].[objectruanganasalfk]
                INNER JOIN [departemen_m] AS [dp] ON [dp].[id] = [ru].[objectdepartemenfk]
                WHERE
                    ru.objectdepartemenfk = 16
                AND pd.tglpulang IS NULL
                -- AND ru.objectruanganfk IS NULL
                AND pd.statusenabled=true"));
                // AND ru.id NOT IN (717,722,724,758,759,760,761,762,763,764,781)"));
        }else if ($request['idRuangan'] == 277) {
            $data = DB::table('antrianpasiendiperiksa_t as apd')
                ->join('pasiendaftar_t as pd','pd.norec','=','apd.noregistrasifk')
                ->join('pasien_m as ps','ps.id','=','pd.nocmfk')
                ->join('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
                ->leftjoin('ruangan_m as ruu','ruu.id','=','apd.objectruanganasalfk')
                ->join ('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
                ->select('pd.noregistrasi','pd.tglregistrasi','ps.nocm','ps.namapasien','ru.namaruangan',
                    'pd.tglpulang','ruu.namaruangan as namaruanganasal')
                ->whereBetween('apd.tglregistrasi',[$tglAwal,$tglAkhir])
                     ->where('pd.statusenabled',1)
                ->where('ru.objectdepartemenfk',277)
                ->get();
        }else if ($request['idRuangan'] == 575) {
            $data = DB::table('antrianpasiendiperiksa_t as apd')
                ->join('pasiendaftar_t as pd','pd.norec','=','apd.noregistrasifk')
                ->join('pasien_m as ps','ps.id','=','pd.nocmfk')
                ->join('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
                ->leftjoin('ruangan_m as ruu','ruu.id','=','apd.objectruanganasalfk')
                ->join ('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
                ->select('pd.noregistrasi','pd.tglregistrasi','ps.nocm','ps.namapasien','ru.namaruangan',
                    'pd.tglpulang','ruu.namaruangan as namaruanganasal')
                ->whereBetween('apd.tglregistrasi',[$tglAwal,$tglAkhir])
                     ->where('pd.statusenabled',1)
                ->where('ru.objectdepartemenfk',3)
                ->where('ru.id','<>',453)
                ->get();
        }else if ($request['idRuangan'] == 453) {
            $data = DB::table('antrianpasiendiperiksa_t as apd')
                ->join('pasiendaftar_t as pd','pd.norec','=','apd.noregistrasifk')
                ->join('pasien_m as ps','ps.id','=','pd.nocmfk')
                ->join('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
                ->leftjoin('ruangan_m as ruu','ruu.id','=','apd.objectruanganasalfk')
                ->join ('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
                ->select('pd.noregistrasi','pd.tglregistrasi','ps.nocm','ps.namapasien','ru.namaruangan',
                    'pd.tglpulang','ruu.namaruangan as namaruanganasal')
                ->whereBetween('apd.tglregistrasi',[$tglAwal,$tglAkhir])
                     ->where('pd.statusenabled',1)
                ->where('ru.objectdepartemenfk',3)
                ->where('ru.id',453)
                ->get();
        }else if ($request['idRuangan'] == 717) {
            $data = DB::select(DB::raw("SELECT
                    [pd].[noregistrasi],
                    [pd].[tglregistrasi],
                    [ps].[nocm],
                    [ps].[namapasien],
                    [ru].[namaruangan],
                    [ru].[namaruangan] as [namaruanganasal],
                    [pd].[tglpulang]
                FROM
                    [pasiendaftar_t] AS [pd] 
                INNER JOIN [pasien_m] AS [ps] ON [ps].[id] = [pd].[nocmfk]
                INNER JOIN [ruangan_m] AS [ru] ON ru.id = [pd].[objectruanganlastfk]
                left JOIN [ruangan_m] AS [ruu] ON [ruu].[id] = [pd].[objectruanganasalfk]
                INNER JOIN [departemen_m] AS [dp] ON [dp].[id] = [ru].[objectdepartemenfk]
                WHERE
                    ru.objectdepartemenfk = 16
                AND
                --  (
                --     pd.tglregistrasi < '$tglAwal'
                --     AND pd.tglpulang >= '$tglAkhir'
                -- )
                -- OR 
                pd.tglpulang IS NULL
                -- AND ru.objectruanganfk IS NULL
                AND pd.statusenabled=true
                AND ru.id IN (717,722,724,758,759,760,761,762,763,764,781)"));
        }else if ($request['idRuangan'] == 19) {
            $data = DB::select(DB::raw("SELECT
                    [pd].[noregistrasi],
                    [pd].[tglregistrasi],
                    [ps].[nocm],
                    [ps].[namapasien],
                    [ru].[namaruangan],
                    [ru].[namaruangan] as [namaruanganasal],
                    [pd].[tglpulang]
                FROM
                    [pasiendaftar_t] AS [pd] 
                INNER JOIN [pasien_m] AS [ps] ON [ps].[id] = [pd].[nocmfk]
                INNER JOIN [ruangan_m] AS [ru] ON ru.id = [pd].[objectruanganlastfk]
                left JOIN [ruangan_m] AS [ruu] ON [ruu].[id] = [pd].[objectruanganasalfk]
                INNER JOIN [departemen_m] AS [dp] ON [dp].[id] = [ru].[objectdepartemenfk]
                WHERE
                    ru.objectdepartemenfk = 16
                AND
                --  (
                --     pd.tglregistrasi < '$tglAwal'
                --     AND pd.tglpulang >= '$tglAkhir'
                -- )
                -- OR 
                pd.tglpulang IS NULL
                AND ru.objectruanganfk=19
                AND pd.statusenabled=true"));
        }else if ($request['idRuangan'] == 24){
            $data = DB::table('antrianpasiendiperiksa_t as apd')
                ->join('pasiendaftar_t as pd','pd.norec','=','apd.noregistrasifk')
                ->join('pasien_m as ps','ps.id','=','pd.nocmfk')
                ->join('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
                ->leftjoin('ruangan_m as ruu','ruu.id','=','apd.objectruanganasalfk')
                ->join ('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
                ->select('pd.noregistrasi','pd.tglregistrasi','ps.nocm','ps.namapasien','ru.namaruangan',
                    'pd.tglpulang','ruu.namaruangan as namaruanganasal')
                ->whereBetween('apd.tglregistrasi',[$tglAwal,$tglAkhir])
                     ->where('pd.statusenabled',1)
                ->where('ru.objectdepartemenfk',24)
                ->get();
        }else if($request['idRuangan'] == 5){
            $data = DB::table('antrianpasiendiperiksa_t as apd')
                ->join('pasiendaftar_t as pd','pd.norec','=','apd.noregistrasifk')
                ->join('pasien_m as ps','ps.id','=','pd.nocmfk')
                ->join('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
                ->leftjoin('ruangan_m as ruu','ruu.id','=','apd.objectruanganasalfk')
                ->join ('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
                ->select('pd.noregistrasi','ps.tglmeninggal as tglregistrasi','ps.nocm','ps.namapasien','ru.namaruangan',
                    'pd.tglpulang','ruu.namaruangan as namaruanganasal')
                ->whereBetween('apd.tglmasuk',[$tglAwal,$tglAkhir])
                     ->where('pd.statusenabled',1)
                ->where('ru.objectdepartemenfk',5)
                ->get();
        }else if($request['idRuangan'] == 28){
            $data = DB::table('antrianpasiendiperiksa_t as apd')
                ->join('pasiendaftar_t as pd','pd.norec','=','apd.noregistrasifk')
                ->join('pasien_m as ps','ps.id','=','pd.nocmfk')
                ->join('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
                ->leftjoin('ruangan_m as ruu','ruu.id','=','apd.objectruanganasalfk')
                ->join ('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
                ->select('pd.noregistrasi','pd.tglregistrasi','ps.nocm','ps.namapasien','ru.namaruangan',
                    'pd.tglpulang','ruu.namaruangan as namaruanganasal')
                ->whereBetween('apd.tglmasuk',[$tglAwal,$tglAkhir])
                     ->where('pd.statusenabled',1)
                ->where('ru.objectdepartemenfk',28)
                ->get();
        }else{
             $data = DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps','ps.id','=','pd.nocmfk')
            ->join('ruangan_m as ru','ru.id','=','pd.objectruanganlastfk')
            ->leftjoin('ruangan_m as ruu','ruu.id','=','pd.objectruanganasalfk')
            ->join ('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
            ->select('pd.noregistrasi','pd.tglregistrasi','ps.nocm','ps.namapasien','ru.namaruangan',
                'pd.tglpulang','ruu.namaruangan as namaruanganasal')
            ->whereBetween('pd.tglregistrasi',[$tglAwal,$tglAkhir])
            // ->whereNull('ru.objectruanganfk')
            ->where('pd.statusenabled',1);
            if($request['idRuangan']==16){
                $data = $data->where('ru.objectdepartemenfk',$request['idRuangan']);
                $data = $data->wherenotin('ru.id', array(251,322,12,448,453));
            }else if($request['idRuangan']==27){
                $data = $data->where('ru.objectdepartemenfk',$request['idRuangan']);
                $data = $data->wherenotin('ru.id', array(251,322,12,448,453));
            }else if($request['idRuangan']==1000){
                $data = $data->wherein('ru.id', array(717,722,724,758,759,760,761,762,763,764,781));
                $data = $data->whereNull('ru.objectruanganfk');
            }else if($request['idRuangan']==251){
                $data = $data->where('ru.id', 251);
                $data = $data->whereNull('ru.objectruanganfk');
            }else if($request['idRuangan']==322){
                $data = $data->where('ru.id', 322);
                $data = $data->whereNull('ru.objectruanganfk');
            }else if($request['idRuangan']==12){
                $data = $data->where('ru.id', 12);
                $data = $data->whereNull('ru.objectruanganfk');
            }else if($request['idRuangan']==4533){
                $data = $data->where('ru.id', 453);
                $data = $data->whereNull('ru.objectruanganfk');
            }else{
                $data = $data->whereNotin('ru.id', array(251,322,12,453));
                $data = $data->where('ru.objectdepartemenfk',$request['idRuangan']);
                $data = $data->whereNull('ru.objectruanganfk');
            }
            $data = $data->get();
        }
       

        $result = array(
            'data' => $data,
            'count' =>count($data),
            'message' => 'ramdanegie',
        );
        return $this->respond($result);

    }
    public function countPasienRSTerlayani(Request $request)
    {
        $tglAwal = $request['tgl'] .' 00:00' ;//date('Y-m-d 00:00');
        $tglAkhir =  $request['tgl'] .' 23:59' ;//date('Y-m-d 23:59');


         $dept = '18';//$this->settingDataFixed('kdDepartemenRawatJalanFix');
         $data = DB::select(DB::raw("SELECT dp.id ,dp.namadepartemen,count(pd.norec) as jumlah, dp.qdepartemen
                FROM departemen_m dp
                join ruangan_m as ru on ru.objectdepartemenfk=dp.id
                LEFT JOIN (SELECT antrianpasiendiperiksa_t.norec,objectruanganfk FROM antrianpasiendiperiksa_t
                left  join batalregistrasi_t as br on br.pasiendaftarfk=antrianpasiendiperiksa_t.noregistrasifk

                where tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir' and   br.norec is null) pd ON (ru.id= pd.objectruanganfk)
                WHERE dp.id in ($dept) and ru.id not in (251,453)
                group by dp.namadepartemen,dp.id,dp.qdepartemen
                order by dp.qdepartemen asc
        "));
        // $data = DB::select(DB::raw("
        //              select dp.id ,dp.namadepartemen,count(apd.norec) as jumlah
        //             from antrianpasiendiperiksa_t  as apd 
        //             join ruangan_m as ru on ru.id =apd.objectruanganfk
        //             join departemen_m as dp on dp.id =ru.objectdepartemenfk
        //             left join batalregistrasi_t as br on br.pasiendaftarfk=apd.noregistrasifk
        //             where apd.tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir'
        //             --and ru.objectdepartemenfk =24
        //             and br.norec is null
        //             group by dp.namadepartemen,dp.id 
        //     "));

        // $dataJenazah = DB::select(DB::raw("SELECT dp.id ,dp.namadepartemen,count(pd.norec) as jumlah, dp.qdepartemen
        //         FROM departemen_m dp
        //         join ruangan_m as ru on ru.objectdepartemenfk=dp.id
        //         LEFT JOIN (SELECT antrianpasiendiperiksa_t.norec,objectruanganfk FROM antrianpasiendiperiksa_t
        //         left  join batalregistrasi_t as br on br.pasiendaftarfk=antrianpasiendiperiksa_t.noregistrasifk

        //         where tglmasuk BETWEEN '$tglAwal' and '$tglAkhir' and   br.norec is null) pd ON (ru.id= pd.objectruanganfk)
        //         WHERE dp.id='5' and ru.id=507
        //         group by dp.namadepartemen,dp.id,dp.qdepartemen
        //         order by dp.qdepartemen asc
        // "));
        // $dataSentraVisum = DB::select(DB::raw("SELECT '251' as id ,'Pasien Sentra Visum' as namadepartemen,count(pd.norec) as jumlah, dp.qdepartemen
        //         FROM departemen_m dp
        //         join ruangan_m as ru on ru.objectdepartemenfk=dp.id
        //         LEFT JOIN (SELECT antrianpasiendiperiksa_t.norec,objectruanganfk FROM antrianpasiendiperiksa_t
        //         left  join batalregistrasi_t as br on br.pasiendaftarfk=antrianpasiendiperiksa_t.noregistrasifk

        //         where tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir' and   br.norec is null) pd ON (ru.id= pd.objectruanganfk)
        //         WHERE ru.id=251
        //         group by dp.namadepartemen,dp.id,dp.qdepartemen
        //         order by dp.qdepartemen asc
        // "));
        // $dataRanap = DB::select(DB::raw("select count(x.noregistrasi) as jumlah  
        //     from ( select  pd.noregistrasi,pd.tglregistrasi
        //     from pasiendaftar_t as pd 
        //     inner join ruangan_m as ru on ru.id = pd.objectruanganlastfk
        //     where ru.objectdepartemenfk = 16 
        //     and (  pd.tglregistrasi < '$tglAwal' AND pd.tglpulang >= '$tglAkhir' or pd.tglpulang is null  
        //      )
        //      and ru.objectruanganfk is null
            
        //     and pd.statusenabled=true AND ru.id NOT IN (717,722,724,758,759,760,761,762,763,764,781)
        //  ) as x
        //     "));
//         $dataLabPA = DB::select(DB::raw("SELECT '453' as id ,'Kunjungan Laboratorium PA' as namadepartemen,count(pd.norec) as jumlah, 453 as qdepartemen
//                 FROM departemen_m dp
//                 join ruangan_m as ru on ru.objectdepartemenfk=dp.id
//                 LEFT JOIN (SELECT antrianpasiendiperiksa_t.norec,objectruanganfk FROM antrianpasiendiperiksa_t
//                 left  join batalregistrasi_t as br on br.pasiendaftarfk=antrianpasiendiperiksa_t.noregistrasifk

//                 where tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir' and   br.norec is null) pd ON (ru.id= pd.objectruanganfk)
//                 WHERE ru.id=453
//                 group by dp.namadepartemen,dp.id,dp.qdepartemen
//                 order by dp.qdepartemen asc
//         "));
//         $dataRanapICU = DB::select(DB::raw("select count(x.noregistrasi) as jumlah  
//             from ( select  pd.noregistrasi,pd.tglregistrasi
//             from pasiendaftar_t as pd 
//             inner join ruangan_m as ru on ru.id = pd.objectruanganlastfk
//             where ru.objectdepartemenfk = 16 
//             and ( pd.tglpulang is null  
//              )
//              and ru.objectruanganfk is null
            
//             and pd.statusenabled=true AND ru.id IN (717,722,724,758,759,760,761,762,763,764,781)
//          ) as x
//             "));
//          $dataRanapCovid = DB::select(DB::raw("select count(x.noregistrasi) as jumlah  
//             from ( select  pd.noregistrasi,pd.tglregistrasi
//             from pasiendaftar_t as pd 
//             inner join ruangan_m as ru on ru.id = pd.objectruanganlastfk
//             where ru.objectdepartemenfk = 16 
//             and (   pd.tglpulang is null
//              )
// and ru.objectruanganfk = 19
//             and pd.statusenabled=true
//          ) as x
//             "));
        $dataFarmasi =DB::select(DB::raw("
             SELECT
                COUNT (x.noresep) AS jumlah
              FROM
                (
                    SELECT *
                    FROM
                        strukresep_t AS sr
                    WHERE
                        sr.tglresep BETWEEN '$tglAwal'
                    AND '$tglAkhir'
                     and (sr.statusenabled is null or sr.statusenabled=true)
                ) AS x"));
        $farmasi = 0;
        $masihDirawat = 0;
        if (count($dataFarmasi) > 0){
            $farmasi =$dataFarmasi[0]->jumlah;
        }
        // if (count($dataRanap) > 0){
        //     $masihDirawat =$dataRanap[0]->jumlah;
        // }
        // if (count($dataRanapICU) > 0){
        //     $masihDirawatICU =$dataRanapICU[0]->jumlah;
        // }
        // if (count($dataRanapCovid) > 0){
        //     $masihDirawatCovid =$dataRanapCovid[0]->jumlah;
        // }
        // if (count($dataLabPA) > 0){
        //     $masihDirawatLabPA =$dataLabPA[0]->jumlah;
        // }
        // if (count($dataSentraVisum) > 0){
        //     $masihDirawatSentraVisum =$dataSentraVisum[0]->jumlah;
        // }
        // if (count($dataJenazah) > 0){
        //     $masihJenazah =$dataJenazah[0]->jumlah;
        // }
        $data10 = [];
        foreach ($data as $key => $value) {
             $data10 [] =  array('id' => $value->id,
             'namadepartemen' => $value->namadepartemen,
             'jumlah' => $value->jumlah,
             'qdepartemen' =>  $value->qdepartemen  ); 

            # code...
        }
        // $data10 [] =  array(
        //          'id' => 16,
        //          'namadepartemen' => 'Instalasi Rawat Inap',
        //          'jumlah' =>$masihDirawat,
        //          'qdepartemen' => 3
        // );
        // $data10 [] =  array(
        //         'id' => 1000,
        //         'namadepartemen' => 'Jumlah Pasien ICU Hari ini',
        //         'jumlah' =>$masihDirawatICU,
        //         'qdepartemen' => 2
        // );  
        //  $data10 [] =  array(
        //          'id' => 999,
        //          'namadepartemen' => 'jumlah pasien covid-19 dirawat hari ini',
        //          'jumlah' =>$masihDirawatCovid,
        //          'qdepartemen' => 3
        // );      
        $data10 [] =  array(
                 'id' => 14,
                 'namadepartemen' => 'Jumlah Resep',
                 'jumlah' =>$farmasi,
                  'qdepartemen' => 13
            );
        // $data10 [] =  array(
        //          'id' => 453,
        //          'namadepartemen' => 'Kunjungan Pasien Lab PA',
        //          'jumlah' =>$masihDirawatLabPA,
        //           'qdepartemen' => 6
        //     );
        // $data10 [] =  array(
        //         'id' => 251,
        //         'namadepartemen' => 'Pasien Sentra Visum',
        //         'jumlah' =>$masihDirawatSentraVisum,
        //         'qdepartemen' => 251
        // ); 
        // $data10 [] =  array(
        //     'id' => 507,
        //     'namadepartemen' => 'Inst. Pemulasaran Jenazah',
        //     'jumlah' =>$masihJenazah,
        //     'qdepartemen' => 507
        // ); 
        if(count($data10) >0){
            foreach ($data10 as $key => $row) {
                $count[$key] = $row['qdepartemen'];
            }


            array_multisort($count, SORT_ASC, $data10);
        }
   
          
       // $result = array(
       //      'data' => $data10,
       //      // 'farmasi'=> (float)$farmasi,
       //      // 'masihDirawat'=> (float)$masihDirawat,
       //      'message' => 'ramdanegie',
       //  );
        // return $this->respond($result);
        return $this->respond($data10);
        // $rawatjalan =0;
        // $rawatinap=0;
        // $igd =0;
        // $rehab =0;
        // $bedah =0;
        // $lab =0;
        // $rad=0;
        // $farmasi=0;
        // $masihDirawat=0;
        // $res=[];
        // if (count($dataFarmasi) > 0){
        //     $farmasi =$dataFarmasi[0]->jumlah;
        // }
        // if (count($dataRanap) > 0){
        //     $masihDirawat =$dataRanap[0]->jumlah;
        // }
        // foreach ($data as $item) {
        //     if ($item->id == 18) {
        //         $rawatjalan = $item->jumlah;
        //     }
        //     if ($item->id == 16) {
        //         $rawatinap = $item->jumlah;
        //     }
        //     if ($item->id == 28) {
        //         $rehab = $item->jumlah;
        //     }
        //     if ($item->id == 25) {
        //         $bedah = $item->jumlah;
        //     }
        //     if ($item->id == 3) {
        //         $lab = $item->jumlah;
        //     }
        //     if ($item->id == 27) {
        //         $rad = $item->jumlah;
        //     }
        //     if ($item->id == 24) {
        //         $igd = $item->jumlah;
        //     }
        //     $res = array(
        //         'rawat_jalan' => (int)$rawatjalan,
        //         'igd' => (int)$igd,
        //         'rawat_inap' => (int)$rawatinap,
        //         'radiologi' => (int)$rad,
        //         'laboratorium' => (int)$lab,
        //         'operasi' => (int)$bedah,
        //         'rehab_medik' => (int)$rehab,
        //         'jumlah' => (int)$rawatjalan + (int)$igd + (int)$rawatinap + (int)$rad
        //             + (int)$lab + (int)$bedah + (int)$rehab
        //     );
        // }

        // $result = array(
        //     'data' => $res,
        //     'farmasi'=> (float) $farmasi,
        //     'masihDirawat'=>(float) $masihDirawat,
        //     'message' => 'ramdanegie',
        // );
        // return $this->respond($result);

    }
    public function detailPasienTerlayani($idDept,Request $request)
    {
        $tglAwal = $request['tgl'].' 00:00';
        $tglAkhir =  $request['tgl'].' 23:59';
        if ($idDept == 16) {
            $data = DB::select(DB::raw("SELECT
                    [pd].[noregistrasi],
                    [pd].[tglregistrasi],
                    [ps].[nocm],
                    [ps].[namapasien],
                    [ru].[namaruangan],
                    [ruu].[namaruangan] as [namaruanganasal],
                    [pd].[tglpulang]
                FROM
                    [pasiendaftar_t] AS [pd] 
                INNER JOIN [pasien_m] AS [ps] ON [ps].[id] = [pd].[nocmfk]
                INNER JOIN [ruangan_m] AS [ru] ON ru.id = [pd].[objectruanganlastfk]
                left JOIN [ruangan_m] AS [ruu] ON [ruu].[id] = [pd].[objectruanganasalfk]
                INNER JOIN [departemen_m] AS [dp] ON [dp].[id] = [ru].[objectdepartemenfk]
                WHERE
                    ru.objectdepartemenfk = 16
                AND (
                    pd.tglregistrasi < '$tglAwal'
                    AND pd.tglpulang >= '$tglAkhir'
                )
                OR pd.tglpulang IS NULL
                AND ru.objectruanganfk IS NULL
                AND pd.statusenabled=true
                AND ru.id NOT IN (717,722,724,758,759,760,761,762,763,764,781)"));
        }else if ($idDept == 251) {
            $data = DB::table('antrianpasiendiperiksa_t as apd')
                ->join('pasiendaftar_t as pd','pd.norec','=','apd.noregistrasifk')
                ->join('pasien_m as ps','ps.id','=','pd.nocmfk')
                ->join('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
                ->leftjoin('ruangan_m as ruu','ruu.id','=','apd.objectruanganasalfk')
                ->join ('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
                ->select('pd.noregistrasi','pd.tglregistrasi','ps.nocm','ps.namapasien','ru.namaruangan',
                    'pd.tglpulang','ru.namaruangan as namaruanganasal')
                ->whereBetween('apd.tglregistrasi',[$tglAwal,$tglAkhir])
                     ->where('pd.statusenabled',1)
                ->where('ru.id',251)
                ->get();
        }else if ($idDept == 507) {
            $data = DB::table('antrianpasiendiperiksa_t as apd')
                ->join('pasiendaftar_t as pd','pd.norec','=','apd.noregistrasifk')
                ->join('pasien_m as ps','ps.id','=','pd.nocmfk')
                ->join('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
                ->leftjoin('ruangan_m as ruu','ruu.id','=','apd.objectruanganasalfk')
                ->join ('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
                ->select('pd.noregistrasi','pd.tglregistrasi','ps.nocm','ps.namapasien','ru.namaruangan',
                    'pd.tglpulang','ru.namaruangan as namaruanganasal')
                ->whereBetween('apd.tglmasuk',[$tglAwal,$tglAkhir])
                     ->where('pd.statusenabled',1)
                ->where('ru.id',507)
                ->get();
        }else if ($idDept == 1000) {
            $data = DB::select(DB::raw("SELECT
                    [pd].[noregistrasi],
                    [pd].[tglregistrasi],
                    [ps].[nocm],
                    [ps].[namapasien],
                    [ru].[namaruangan],
                    [ruu].[namaruangan] as [namaruanganasal],
                    [pd].[tglpulang]
                FROM
                    [pasiendaftar_t] AS [pd] 
                INNER JOIN [pasien_m] AS [ps] ON [ps].[id] = [pd].[nocmfk]
                INNER JOIN [ruangan_m] AS [ru] ON ru.id = [pd].[objectruanganlastfk]
                left JOIN [ruangan_m] AS [ruu] ON [ruu].[id] = [pd].[objectruanganasalfk]
                INNER JOIN [departemen_m] AS [dp] ON [dp].[id] = [ru].[objectdepartemenfk]
                WHERE
                    ru.objectdepartemenfk = 16
                    AND ru.objectruanganfk IS NULL
                    AND ru.id NOT IN (717,722,724,758,759,760,761,762,763,764,781)
                AND (
                    pd.tglregistrasi < '$tglAwal'
                    AND pd.tglpulang >= '$tglAkhir'
                )
                or pd.tglpulang IS NULL 
                AND ru.objectruanganfk IS NULL
                AND pd.statusenabled=true
                AND ru.id IN (717,722,724,758,759,760,761,762,763,764,781)"));
        }else if($idDept==14){
            $data =DB::select(DB::raw("
                SELECT
                    apd.norec,	pd.noregistrasi,pd.tglregistrasi,
                    ps.nocm,ps.namapasien,
                    ru.namaruangan,	ru2.namaruangan AS ruanganfarmasi,sr.noresep,
                    sr.tglresep,	pg.namalengkap
                FROM
                    pasiendaftar_t AS pd
                INNER JOIN ruangan_m AS ru ON ru. ID = pd.objectruanganlastfk
                left JOIN ruangan_m AS ruu ON ruu. ID = pd.objectruanganasalfk
                INNER JOIN pasien_m AS ps ON ps. ID = pd.nocmfk
                INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
                INNER JOIN strukresep_t AS sr ON sr.pasienfk = apd.norec
                LEFT JOIN pegawai_m AS pg ON sr.penulisresepfk = pg. ID
                LEFT JOIN ruangan_m AS ru2 ON ru2. ID = sr.ruanganfk
                WHERE
                    sr.tglresep BETWEEN '$tglAwal'
                AND '$tglAkhir'
                 and (sr.statusenabled is null or sr.statusenabled=true)
               "));
        }else if ($idDept == 999) {
            $data = DB::select(DB::raw("SELECT
                    [pd].[noregistrasi],
                    [pd].[tglregistrasi],
                    [ps].[nocm],
                    [ps].[namapasien],
                    [ru].[namaruangan],
                    [ruu].[namaruangan] as [namaruanganasal],
                    [pd].[tglpulang]
                FROM
                    [pasiendaftar_t] AS [pd] 
                INNER JOIN [pasien_m] AS [ps] ON [ps].[id] = [pd].[nocmfk]
                INNER JOIN [ruangan_m] AS [ru] ON ru.id = [pd].[objectruanganlastfk]
                left JOIN [ruangan_m] AS [ruu] ON [ruu].[id] = [pd].[objectruanganasalfk]
                INNER JOIN [departemen_m] AS [dp] ON [dp].[id] = [ru].[objectdepartemenfk]
                WHERE
                    ru.objectdepartemenfk = 16
                    and ru.objectruanganfk=19
                AND (
                    pd.statusenabled=true
                )
                AND pd.tglpulang IS NULL "));
        }else if ($idDept == 453){
            $data = DB::table('antrianpasiendiperiksa_t as apd')
                ->join('pasiendaftar_t as pd','pd.norec','=','apd.noregistrasifk')
                ->join('pasien_m as ps','ps.id','=','pd.nocmfk')
                ->join('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
                ->leftjoin('ruangan_m as ruu','ruu.id','=','apd.objectruanganasalfk')
                ->join ('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
                ->select('pd.noregistrasi','pd.tglregistrasi','ps.nocm','ps.namapasien','ru.namaruangan',
                    'pd.tglpulang','ruu.namaruangan as namaruanganasal')
                ->whereBetween('apd.tglregistrasi',[$tglAwal,$tglAkhir])
                     ->where('pd.statusenabled',1)
                ->where('ru.id',453)
                ->get();
        }else{
            $data = DB::table('antrianpasiendiperiksa_t as apd')
                ->join('pasiendaftar_t as pd','pd.norec','=','apd.noregistrasifk')
                ->join('pasien_m as ps','ps.id','=','pd.nocmfk')
                ->join('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
                ->leftjoin('ruangan_m as ruu','ruu.id','=','apd.objectruanganasalfk')
                ->join ('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
                ->select('pd.noregistrasi','pd.tglregistrasi','ps.nocm','ps.namapasien','ru.namaruangan',
                    'pd.tglpulang','ruu.namaruangan as namaruanganasal')
                ->whereBetween('apd.tglregistrasi',[$tglAwal,$tglAkhir])
                     ->where('pd.statusenabled',1)
                ->where('ru.objectdepartemenfk',$idDept)
                ->whereNotIn('ru.id',array(251,453))
                ->get();
        }


        $result = array(
            'data' => $data,
            'count' => count($data),
            'message' => 'ramdanegie',
        );
        return $this->respond($result);

    }
    public function getPendapatanRumahSakit(Request $request)
    {
        $data =[];

        if($request['tipe'] == 'sehari'){
            $tglAwal = $request['tglAwal'];
            $tglAkhir = $request['tglAkhir'];
        }
        if($request['tipe'] == 'seminggu'){
            $tglAwal = Carbon::now()->subWeek(1)->toDateString();//  Carbon::now()->subMonth(1);
            $tglAwal = date($tglAwal.' 00:00');
            $tglAkhir =date('Y-m-d 23:59');
        }


        //region Old Query
        //        $data =DB::select(DB::raw("
        //         SELECT p.tglpencarian,p.nocm,p.noregistrasi,p.namapasien,
        //            p.namaruangan,p.namalengkap,p.kelompokpasien,p.namadepartemen,
        //            SUM (p.karcis + p.embos +p.konsul + p.tindakan -p.diskon) AS total
        //            FROM
        //                (SELECT p.tglpelayanan as tglpencarian,* FROM v_eispendapatan AS p
        //                            WHERE p.tglpelayanan BETWEEN  '$tglAwal' and '$tglAkhir'
        //                    AND p.objectjenisprodukfk <> 97
        //                    AND p.norecbatal IS NULL
        //                    ORDER BY p.tglpelayanan
        //                ) AS p
        //            GROUP BY p.tglpencarian,p.nocm,p.noregistrasi,p.namapasien,
        //            p.namaruangan,p.namalengkap,p.kelompokpasien,p.namadepartemen
        //         UNION ALL
        //            select p.tglpencarian , p.nocm,p.noregistrasi,p.namapasien,p.ruanganapotik as namaruangan,p.namalengkap,p.kelompokpasien,
        //            p.namadepartemen, sum(p.subtotal - p.diskon  + p.jasa) as total
        //            from (
        //                    select sr.tglresep as tglpencarian, sr.noresep,pd.tglregistrasi,pd.noregistrasi, ps.nocm,upper(ps.namapasien) as namapasien,
        //                     kp.kelompokpasien, pg.namalengkap, ru2.namaruangan, ru.namaruangan as ruanganapotik, dp.namadepartemen,
        //                    pp.jumlah, pp.hargajual as harga, pp.rke as rke, (pp.jumlah)*(pp.hargajual) as subtotal,
        //                     case when pp.hargadiscount is null then 0 else pp.hargadiscount end as diskon,
        //                    case when pp.jasa is null then 0 else pp.jasa end as jasa, 0 as ppn, (pp.jumlah*pp.hargajual)-0-0-0 as total,
        //                     case when pd.nosbmlastfk is null then 'n' else'p' end as statuspaid,
        //                    pg3.namalengkap as namakasir
        //                     from strukresep_t as sr
        //                     left join pelayananpasien_t as pp on pp.strukresepfk = sr.norec
        //                     left join antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
        //                     left join pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
        //                     left join pasien_m as ps on ps.id=pd.nocmfk
        //                     left join jeniskelamin_m as jk on jk.id=ps.objectjeniskelaminfk
        //                     left join pegawai_m as pg on pg.id=sr.penulisresepfk
        //                     left join ruangan_m as ru on ru.id=sr.ruanganfk
        //                     left join ruangan_m as ru2 on ru2.id=apd.objectruanganfk
        //                     left join departemen_m as dp on dp.id=ru.objectdepartemenfk
        //                     left join kelompokpasien_m kp on kp.id=pd.objectkelompokpasienlastfk
        //                     left join strukbuktipenerimaan_t as sbm on sbm.norec = pd.nosbmlastfk
        //                     left join loginuser_s as lu on lu.id = sbm.objectpegawaipenerimafk
        //                     left join pegawai_m as pg3 on pg3.id = lu.objectpegawaifk
        //                     where sr.tglresep between   '$tglAwal' and '$tglAkhir'
        //              UNION ALL
        //                    select  sp.tglstruk as tglpencarian,
        //                    sp.nostruk,
        //                    sp.tglstruk as tglregistrasi,
        //                    '-' as noregistrasi, sp.nostruk_intern as nocm,upper(sp.namapasien_klien) as namapasien, 'Umum/Pribadi' as kelompokpasien,
        //                    pg.namalengkap, '-' as namaruangan, ru.namaruangan as ruanganapotik, dp.namadepartemen,
        //                    spd.qtyproduk as jumlah, spd.hargasatuan as harga, cast(spd.resepke as text) as rke,
        //                     (spd.qtyproduk)*(spd.hargasatuan) as subtotal,
        //                    case when spd.hargadiscount is null then 0 else spd.hargadiscount end as diskon,
        //                    case when spd.hargatambahan is null then 0 else spd.hargatambahan end as jasa,
        //                     0 as ppn,
        //                    (spd.qtyproduk*spd.hargasatuan)-0-0-0 as total,
        //                    case when sp.nosbmlastfk is null then 'n' else'p' end as statuspaid,
        //                    pg3.namalengkap as namakasir
        //                     from strukpelayanan_t as sp
        //                     left join strukpelayanandetail_t as spd on spd.nostrukfk = sp.norec
        //                     left join pegawai_m as pg on pg.id=sp.objectpegawaipenanggungjawabfk
        //                     left join strukbuktipenerimaan_t as sbm on sbm.norec = sp.nosbmlastfk
        //                     left join pegawai_m as pg2 on pg2.id = sbm.objectpegawaipenerimafk
        //                     left join loginuser_s as lu on lu.id = sbm.objectpegawaipenerimafk
        //                     left join pegawai_m as pg3 on pg3.id = lu.objectpegawaifk
        //                     left join ruangan_m as ru on ru.id=sp.objectruanganfk
        //                     left join departemen_m as dp on dp.id=ru.objectdepartemenfk
        //                     where sp.tglstruk between '$tglAwal' and '$tglAkhir' and sp.nostruk_intern='-' and substring(sp.nostruk
        //                     from 1 for 2)='OB'
        //               UNION ALL
        //                    select  sp.tglstruk as tglpencarian,
        //                    sp.nostruk,  sp.tglstruk as tglregistrasi, '-' as noregistrasi,sp.nostruk_intern as nocm,
        //                    upper(sp.namapasien_klien) as namapasien,  'Umum/Pribadi' as kelompokpasien,
        //                    pg.namalengkap, '-' as namaruangan, ru.namaruangan as ruanganapotik, dp.namadepartemen,
        //                    spd.qtyproduk as jumlah, spd.hargasatuan as harga, cast(spd.resepke as text) as rke,
        //                    (spd.qtyproduk)*(spd.hargasatuan) as subtotal,
        //                    case when spd.hargadiscount is null then 0 else spd.hargadiscount end as diskon,
        //                    case when spd.hargatambahan is null then 0 else spd.hargatambahan end as jasa,
        //                     0 as ppn,(spd.qtyproduk*spd.hargasatuan)-0-0-0 as total,
        //                    case when sp.nosbmlastfk is null then 'n' else'p' end as statuspaid,
        //                    pg3.namalengkap as namakasir
        //                     from strukpelayanan_t as sp
        //                     left join strukpelayanandetail_t as spd on spd.nostrukfk = sp.norec
        //                     left join pasien_m as ps on ps.nocm=sp.nostruk_intern
        //                     left join jeniskelamin_m as jk on jk.id=ps.objectjeniskelaminfk
        //                     left join pegawai_m as pg on pg.id=sp.objectpegawaipenanggungjawabfk
        //                     left join strukbuktipenerimaan_t as sbm on sbm.norec = sp.nosbmlastfk
        //                     left join pegawai_m as pg2 on pg2.id = sbm.objectpegawaipenerimafk
        //                     left join loginuser_s as lu on lu.id = sbm.objectpegawaipenerimafk
        //                     left join pegawai_m as pg3 on pg3.id = lu.objectpegawaifk
        //                     left join ruangan_m as ru on ru.id=sp.objectruanganfk
        //                     left join departemen_m as dp on dp.id=ru.objectdepartemenfk
        //                     where sp.tglstruk between   '$tglAwal' and '$tglAkhir'   and sp.nostruk_intern not in ('-') and substring(sp.nostruk
        //                     from 1 for 2)='OB'
        //                    -- order by tglresep
        //          ) as p WHERE p.total is not null
        //          GROUP BY  p.tglpencarian, p.nocm,p.noregistrasi,p.namapasien,p.ruanganapotik ,p.namalengkap,p.kelompokpasien,
        //            p.namadepartemen
        //
        //           "));
        //endregion
        $data = DB::select(DB::raw("
        
      SELECT
    x.tglpencarian,
    x.namaruangan,
    x.namadepartemen,
    x.kelompokpasien,
    SUM (x.total) AS total
FROM
    (
        SELECT
            to_char (
                pp.tglpelayanan,
                'yyyy-MM-dd HH:mm'
            ) AS tglpencarian,
            ru.namaruangan,
            dpm.namadepartemen,
            kps.kelompokpasien,
            SUM (
                (
                    (
                        CASE
                        WHEN pp.hargajual IS NULL THEN
                            0
                        ELSE
                            pp.hargajual
                        END - CASE
                        WHEN pp.hargadiscount IS NULL THEN
                            0
                        ELSE
                            pp.hargadiscount
                        END
                    ) * pp.jumlah
                ) + CASE
                WHEN pp.jasa IS NULL THEN
                    0
                ELSE
                    pp.jasa
                END
            ) AS total
        FROM
            pelayananpasien_t AS pp
        JOIN antrianpasiendiperiksa_t AS apd ON apd.norec = pp.noregistrasifk
        JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk
        JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
        LEFT JOIN kelompokpasien_m AS kps ON kps.id = pd.objectkelompokpasienlastfk
        LEFT JOIN departemen_m AS dpm ON dpm.id = ru.objectdepartemenfk
        WHERE  
            pp.tglpelayanan BETWEEN '$tglAwal'
        AND '$tglAkhir'
        AND pp.strukresepfk IS NULL
        AND pd.statusenabled = true
        GROUP BY
            ru.namaruangan,
            dpm.namadepartemen,
            kps.kelompokpasien,
            pp.tglpelayanan
        UNION ALL
            SELECT
                to_char (
                    sp.tglstruk,
                    'yyyy-MM-dd HH:mm'
                ) AS tglpencarian,
                ru.namaruangan,
                dp.namadepartemen,
                'Umum/Pribadi' AS kelompokpasien,
                SUM (
                    spd.qtyproduk * (
                        spd.hargasatuan - CASE
                        WHEN spd.hargadiscount IS NULL THEN
                            0
                        ELSE
                            spd.hargadiscount
                        END
                    ) + CASE
                    WHEN spd.hargatambahan IS NULL THEN
                        0
                    ELSE
                        spd.hargatambahan
                    END
                ) AS total
            FROM
                strukpelayanan_t AS sp
            JOIN strukpelayanandetail_t AS spd ON spd.nostrukfk = sp.norec
            LEFT JOIN ruangan_m AS ru ON ru.id = sp.objectruanganfk
            LEFT JOIN departemen_m AS dp ON dp.id = ru.objectdepartemenfk
            WHERE 
                sp.tglstruk BETWEEN '$tglAwal'
            AND '$tglAkhir'
            AND sp.nostruk LIKE 'OB%'
            AND sp.statusenabled <> false
            GROUP BY
                sp.tglstruk,
                ru.namaruangan,
                dp.namadepartemen
            UNION ALL
                SELECT
                    to_char (
                        pp.tglpelayanan,
                        'yyyy-MM-dd HH:mm'
                    ) AS tglpencarian,
                    ru.namaruangan,
                    dpm.namadepartemen,
                    kps.kelompokpasien,
                    SUM (
                        (
                            (
                                CASE
                                WHEN pp.hargajual IS NULL THEN
                                    0
                                ELSE
                                    pp.hargajual
                                END - CASE
                                WHEN pp.hargadiscount IS NULL THEN
                                    0
                                ELSE
                                    pp.hargadiscount
                                END
                            ) * pp.jumlah
                        ) + CASE
                        WHEN pp.jasa IS NULL THEN
                            0
                        ELSE
                            pp.jasa
                        END
                    ) AS total
                FROM
                    pelayananpasien_t AS pp
                JOIN antrianpasiendiperiksa_t AS apd ON apd.norec = pp.noregistrasifk
                JOIN strukresep_t AS sr ON sr.norec = pp.strukresepfk
                JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk
                JOIN ruangan_m AS ru ON ru.id = sr.ruanganfk
                LEFT JOIN kelompokpasien_m AS kps ON kps.id = pd.objectkelompokpasienlastfk
                LEFT JOIN departemen_m AS dpm ON dpm.id = ru.objectdepartemenfk
                WHERE
                    pp.tglpelayanan BETWEEN '$tglAwal'
                AND '$tglAkhir'
                AND pp.strukresepfk IS NOT NULL
                AND pd.statusenabled = true
                GROUP BY
                    ru.namaruangan,
                    dpm.namadepartemen,
                    kps.kelompokpasien,
                    pp.tglpelayanan
    ) AS x
GROUP BY
    x.tglpencarian,
    x.kelompokpasien,
    x.namaruangan,
    x.namadepartemen
   
   

           "));
    if(count($data) >0){
        foreach ($data as $key => $row) {
            $count[$key] = $row->tglpencarian;
        }


        array_multisort($count, SORT_ASC, $data);
    }


        $result = array(
            'data' => $data,
//            'count' => count($data),
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
//        SELECT
//            p.tglregistrasi,p.nocm,p.noregistrasi,p.namapasien,
//            p.ruanganfarmasi as namaruangan,p.namalengkap,p.kelompokpasien,'Instalasi Farmasi' as  namadepartemen,
//            SUM (p.farmasi) AS total
//            FROM(
//                SELECT * FROM v_eispendapatan AS p
//                WHERE p.tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir'
//    AND p.norecbatal IS NULL
//    and p.statuenabledfarmasi =1
//                ORDER BY p.noregistrasi ASC
//            ) AS p
//            GROUP BY  p.tglregistrasi,p.nocm,p.noregistrasi,p.namapasien,
//            p.ruanganfarmasi,p.namalengkap,p.kelompokpasien,p.namadepartemen
//        UNION ALL
//            SELECT
//           p.tglstruk as tglregistrasi ,p.nostruk_intern as nocm,p.nostruk as noregistrasi,p.namapasien_klien as namapasien,
//            p.namaruangan,p.namalengkap, 'Umum/Pribadi' as kelompokpasien,'Instalasi Farmasi' as  namadepartemen,
//            SUM (p.totalharusdibayar) AS total
//            FROM(
//                SELECT * FROM strukpelayanan_t AS p
//								left join pegawai_m as pg on pg.id = p.objectpegawaipenanggungjawabfk
//								left join ruangan_m as ru on ru.id = p.objectruanganfk
//                WHERE p.tglstruk BETWEEN '$tglAwal' and '$tglAkhir'
//    and p.objectkelompoktransaksifk =2 and p.statusenabled=true
//    and ru.objectdepartemenfk=14
//                ORDER BY p.nostruk ASC
//            ) AS p
//            GROUP BY  p.tglstruk,p.nostruk_intern,p.nostruk,p.namapasien_klien,
//            p.namaruangan,p.namalengkap,p.namarekanan
    }
    public function getPenerimaanKasir(Request $request)
    {
//         $dataLogin = $request->all();
//         $data = \DB::table('strukbuktipenerimaan_t as sbm')
//             ->leftJOIN('strukbuktipenerimaancarabayar_t as sbmc', 'sbmc.nosbmfk', '=', 'sbm.norec')
//             ->leftJOIN('carabayar_m as cb', 'cb.id', '=', 'sbmc.objectcarabayarfk')
//             ->join('strukpelayanan_t as sp', 'sp.nosbmlastfk', '=', 'sbm.norec')
//             ->leftJOIN('loginuser_s as lu', 'lu.id', '=', 'sbm.objectpegawaipenerimafk')
//             ->leftJOIN('pegawai_m as pg2', 'pg2.id', '=', 'lu.objectpegawaifk')
//             ->leftJOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'sp.noregistrasifk')
//             ->leftJOIN('pasien_m as ps', 'ps.id', '=', 'sp.nocmfk')
//             ->leftJOIN('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
//             ->leftJOIN('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
//             ->leftJOIN('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
//             ->leftJoin('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
//             ->leftJOIN('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
//             ->select('sbm.tglsbm', 'ps.nocm', 'ru.namaruangan', 'pg.namalengkap', 'pg2.namalengkap as kasir',
//                 'sp.totalharusdibayar', 'sbm.totaldibayar','ru.objectdepartemenfk','ru.id as ruid','dp.namadepartemen',
//                 DB::raw('( case when pd.noregistrasi is null then sp.nostruk else pd.noregistrasi end) as noregistrasi, 
//                 (case when ps.namapasien is null then sp.namapasien_klien else ps.namapasien end) as namapasien,
//                 (case when kp.kelompokpasien is null then null else kp.kelompokpasien end) as kelompokpasien,
//                 (CASE WHEN sp.totalprekanan is null then 0 else sp.totalprekanan end) as hutangpenjamin,
//                 (case when cb.id = 1 then sbm.totaldibayar else 0 end) as tunai, 
//                 (case when cb.id > 1 then sbm.totaldibayar else 0 end) as nontunai')
//             );
// //            ->where('djp.objectjenisprodukfk','<>',97)
// //            ->whereNull('sp.statusenabled')
// //            ->where('ru.objectdepartemenfk',18);

//         if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
//             $data = $data->where('sbm.tglsbm', '>=', $request['tglAwal']);
//         }
//         if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
//             $tgl = $request['tglAkhir'];//." 23:59:59";
//             $data = $data->where('sbm.tglsbm', '<=', $tgl);
//         }
//         if (isset($request['idKasir']) && $request['idKasir'] != "" && $request['idKasir'] != "undefined") {
//             $data = $data->where('pg2.id', '=', $request['idKasir']);
//         }
//         if (isset($request['idDokter']) && $request['idDokter'] != "" && $request['idDokter'] != "undefined") {
//             $data = $data->where('pd.objectpegawaifk', '=', $request['idDokter']);
//         }
//         if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
//             $data = $data->where('ru.objectdepartemenfk', '=', $request['idDept']);
//         }
//         if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
//             $data = $data->where('pd.objectruanganlastfk', '=', $request['idRuangan']);
//         }
//         if (isset($request['kelompokPasien']) && $request['kelompokPasien'] != "" && $request['kelompokPasien'] != "undefined") {
//             $data = $data->where('kp.id', '=', $request['kelompokPasien']);
//         }


//         $data = $data->orderBy('pd.noregistrasi', 'ASC');

//         $data = $data->get();
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
            // ->select('sbm.tglsbm', 'ps.nocm', 'ru.namaruangan', 'pg.namalengkap', 'pg2.namaexternal as kasir',
            //     'sp.totalharusdibayar', 'sbm.totaldibayar',
            //     \DB::raw('( case when pd.noregistrasi is null then sp.nostruk else pd.noregistrasi end) as noregistrasi, 
            //     (case when ps.namapasien is null then sp.namapasien_klien else ps.namapasien end) as namapasien,
            //     (case when kp.kelompokpasien is null then null else kp.kelompokpasien end) as kelompokpasien,
            //     (CASE WHEN sp.totalprekanan is null then 0 else sp.totalprekanan end) as hutangpenjamin,
            //     (case when cb.id = 1 then sbm.totaldibayar else 0 end) as tunai, 
            //     (case when cb.id > 1 then sbm.totaldibayar else 0 end) as nontunai')
            // );
            ->select('sbm.tglsbm', 'ps.nocm', 'ru.namaruangan', 'pg.namalengkap', 'pg2.namalengkap as kasir',
                            'sp.totalharusdibayar', 'sbm.totaldibayar','ru.objectdepartemenfk','ru.id as ruid','dp.namadepartemen',
                            DB::raw('( case when pd.noregistrasi is null then sp.nostruk else pd.noregistrasi end) as noregistrasi, 
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
            $data = $data->where('sbm.tglsbm', '<=', $tgl);
        }
        if (isset($request['idKasir']) && $request['idKasir'] != "" && $request['idKasir'] != "undefined") {
            $data = $data->where('pg2.id', '=', $request['idKasir']);
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
            'message' => 'inhuman'
        );
        return $this->respond($result);
    }

    public function getCountPegawai(Request $request)
    {
        $kateg = SettingDataFixed::where('namafield', 'statusDataPegawaiException')->first();
        $keduduk = SettingDataFixed::where('namafield', 'listDataKedudukanException')->first();
        $jenisKelamin = DB::select(DB::raw("select count ( x.namalengkap) as total, x.jeniskelamin from (
                select jp.jeniskelamin,pg.namalengkap 
                from pegawai_m  as pg
                left JOIN jeniskelamin_m as jp on jp.id =pg.objectjeniskelaminfk
                where pg.statusenabled=true
                --and pg.kedudukanfk not in ($keduduk->nilaifield)
                --and pg.kategorypegawai in ($kateg->nilaifield)
                 )as x GROUP BY x.jeniskelamin"));
        $kategoryPegawai = DB::select(DB::raw("select count ( x.namalengkap) as total, x.kategorypegawai from (
                select jp.kategorypegawai,pg.namalengkap 
                from pegawai_m  as pg
                left JOIN kategorypegawai_m as jp on jp.id =pg.kategorypegawai
                where pg.statusenabled=true
                 -- and pg.kedudukanfk not in ($keduduk->nilaifield)
               -- and pg.kategorypegawai in ($kateg->nilaifield)
                )as x GROUP BY x.kategorypegawai"));
        $kelompokJabatan = DB::select(DB::raw("select count ( x.id) as total, x.namakelompokjabatan from (
                select jp.detailkelompokjabatan as namakelompokjabatan,pg.namalengkap ,pg.id
                from pegawai_m  as pg
                inner JOIN nilaikelompokjabatan_m as jp on jp.id =pg.objectkelompokjabatanfk
                where pg.statusenabled=true
                --and pg.kedudukanfk not in ($keduduk->nilaifield)
               -- and pg.kategorypegawai in ($kateg->nilaifield)
                 )as x GROUP BY x.namakelompokjabatan"));
        $unitKerja = DB::select(DB::raw("
            
            select count ( x.id) as total, x.unitkerja from (
            select uk.name as unitkerja,pg.namalengkap ,pg.id
            from pegawai_m as pg
           left JOIN unitkerjapegawai_m as uk on uk.id=pg.objectunitkerjapegawaifk
            where pg.statusenabled=true
              )
            as x GROUP BY x.unitkerja
                "));
        $statusPegawai = DB::select(DB::raw("select count ( x.id) as total,x.jenis as statuspegawai from (
                select pg.namalengkap ,pg.id, case when pg.kedudukanfk not in ($keduduk->nilaifield)  
                  and pg.kategorypegawai in ($kateg->nilaifield) then 'tetap' else 'outsourcing' end as jenis
                from pegawai_m  as pg
                left JOIN statuspegawai_m as jp on jp.id =pg.objectstatuspegawaifk
                where pg.statusenabled=true
                and pg.kodeexternal != 'dua'
                )as x
                GROUP BY x.jenis
                "));

        $kedudukanPeg = DB::select(DB::raw("select count ( x.namalengkap) as total, x.kedudukan  from (
                select jp.name as kedudukan,pg.namalengkap from pegawai_m  as pg
                left JOIN sdm_kedudukan_m as jp on jp.id =pg.kedudukanfk
                where pg.statusenabled=true
                --and pg.kedudukanfk not in ($keduduk->nilaifield)
              
                )as x
                GROUP BY x.kedudukan
                "));

        $pendidikan = DB::select(DB::raw("select x.total, x.pendidikan  from (
                select jp.pendidikan, count(pg.namalengkap) as total from pegawai_m  as pg
                left JOIN pendidikan_m as jp on pg.objectpendidikanterakhirfk = jp.id
                where pg.statusenabled=true
               -- and pg.kedudukanfk not in ($keduduk->nilaifield)
               -- and pg.kategorypegawai in ($kateg->nilaifield)
                 GROUP by jp.pendidikan
                )as x
                order by x.total  
                "));
        // $usia = DB::select(DB::raw("
        //         select pg.namalengkap,pg.tgllahir ,                
        //           date_part('year',age(ps.tgllahir))as umur,
        //          from pegawai_m  as pg
        //         where pg.statusenabled=true
        //         --and pg.kedudukanfk not in ($keduduk->nilaifield)
        //         --and pg.kategorypegawai in ($kateg->nilaifield)
        //         "));
        $usia = DB::select(DB::raw("
                select pg.namalengkap,pg.tgllahir ,
                --CONVERT(int,ROUND(DATEDIFF(hour,pg.tgllahir,GETDATE())/8766.0,0)) AS umur
                 date_part('year',pg.tgllahir ) as umur
                 from pegawai_m  as pg
                where  pg.statusenabled=true
                --and pg.kedudukanfk not in ($keduduk->nilaifield)
                --and pg.kategorypegawai in ($kateg->nilaifield)
                "));
        $under20 = 0;
        $under30 =0;
        $under40 =0;
        $under50 =0;
        $up51=0;
        $usiaa =[];
        foreach ($usia as $itemu){
            if($itemu->umur <= 20){
                $under20 = $under20 +1;
            }
            if( $itemu->umur > 20 && $itemu->umur <= 30){
                $under30 = $under30 +1;
            }
            if($itemu->umur > 30 && $itemu->umur <=40){
                $under40 = $under40 +1;
            }
            if($itemu->umur > 40 && $itemu->umur <=50){
                $under50 = $under50 +1;
            }
            if($itemu->umur > 50){
                $up51 = $up51 +1;
            }
        }
        $usiaa []= array(
            'total' => $under20,
            'usia' => 'dibawah 20 Tahun',
        );
        $usiaa []= array(
            'total' => $under30,
            'usia' => '21 s/d 30 Tahun',
        );
        $usiaa []= array(
            'total' => $under40,
            'usia' => '31 s/d 40 Tahun',
        );
        $usiaa []= array(
            'total' => $under50,
            'usia' => '41 s/d 50 Tahun',
        );
        $usiaa []= array(
            'total' => $up51,
            'usia' =>'diatas 51 Tahun' ,
        );
        $tglAwal = Carbon::now()->startOfMonth();
        $tglAkhir = Carbon::now()->endOfMonth();
         $dataPensiun = DB::select(DB::raw("
            select pg.id,pg.namalengkap,to_char(pg.tglpensiun,'YYYY-MM-DD') as tglpensiun,to_char (pg.tgllahir,'YYYY-MM-DD') as tgllahir,
            pg.nippns,gp.golonganpegawai,
            pdd.pendidikan,sm.name as subunitkerja,uk.name as unitkerja
            from mappegawaijabatantounitkerja_m as mappe
            left join pegawai_m as pg on mappe.objectpegawaifk =pg.id
            left join golonganpegawai_m as gp on pg.objectgolonganpegawaifk = gp.id
            left join pendidikan_m as pdd on pg.objectpendidikanterakhirfk = pdd.id
            left join subunitkerja_m sm on mappe.objectsubunitkerjapegawaifk = sm.id
            left join unitkerjapegawai_m  as uk on mappe.objectunitkerjapegawaifk = uk.id
            where  mappe.isprimary=true
            and pg.tglpensiun between '$tglAwal' and '$tglAkhir'
            order by pg.namalengkap"));

        $pensiun['tglAwal'] =$tglAwal;
        $pensiun['tglAkhir'] =$tglAkhir;
        $pensiun['bulan'] = Carbon::now()->format('F Y');
        $pensiun['data'] =$dataPensiun;

        $result = array(
            'jeniskelamin' => $jenisKelamin,
            'countjk'=>count($jenisKelamin),
            'kategoripegawai' => $kategoryPegawai,
            'kelompokjabatan' => $kelompokJabatan,
            'unitkerjapegawai' => $unitKerja,
            'statuspegawai' => $statusPegawai,
            'kedudukan' => $kedudukanPeg,
            'pendidikan' => $pendidikan,
            'usia' => $usiaa,
            'datapensiun' => $pensiun,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);

    }
    public function getInfoStok(Request $request) {

        $data = DB::select(DB::raw("select sum(spd.qtyproduk) as qtyproduk,prd.namaproduk,
                ru.namaruangan,ss.satuanstandar
                from stokprodukdetail_t as spd
                inner JOIN strukpelayanan_t as sk on sk.norec=spd.nostrukterimafk
                inner JOIN ruangan_m as ru on ru.id=spd.objectruanganfk
                inner JOIN produk_m as prd on prd.id=spd.objectprodukfk
                left JOIN satuanstandar_m as ss on ss.id=prd.objectsatuanstandarfk
                inner JOIN asalproduk_m as ap on ap.id=spd.objectasalprodukfk
                where spd.qtyproduk > 0 
                and prd.statusenabled=true 
                and ru.statusenabled=true  
                group by prd.namaproduk,ru.namaruangan,ss.satuanstandar
                order by prd.namaproduk"));
        if(count($data) > 0){
            foreach ($data as $key => $row) {
                $count[$key] = $row->qtyproduk;
            }
            array_multisort($count, SORT_DESC, $data);
        }


        $result= array(
            'data' => $data,
            'message' => 'inhuman',
        );
        return $this->respond($result);
    }
    public function getPenerimaanRealisasiTarget (Request $request)
    {
        $tglAwal= Carbon::now()->startOfYear()->format('Y-m-d 00:00');
        $tglAkhir =Carbon::now()->endOfYear()->format('Y-m-d 23:59');
//        $data = DB::select(DB::raw("select x.blnpelayanan,sum(x.total) as total, sum(x.volume) as volume, x.keterangan from
//                             (select Format(tp.tglpelayanan, 'MM')as blnpelayanan, pd.noregistrasi, ru.namaruangan, tp.produkfk,
//                             (case when ru2.objectdepartemenfk <> 16 then 'Pendapatan R.Jalan'
//                             else 'Pendapatan R.Inap' end)as keterangan,
//                             (case when tp.hargajual is null then 0 else tp.hargajual end-(case when tp.hargadiscount is null then 0 else tp.hargadiscount end))*tp.jumlah as total,
//                             tp.jumlah as volume
//                             from pasiendaftar_t as pd left JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
//                             left join pelayananpasien_t as tp on tp.noregistrasifk = apd.norec
//                             LEFT JOIN produk_m AS pro ON tp.produkfk = pro.id
//                             left JOIN detailjenisproduk_m as djp on djp.id=pro.objectdetailjenisprodukfk
//                             left JOIN jenisproduk_m as jp on jp.id=djp.objectjenisprodukfk
//                             left JOIN kelompokproduk_m as kp on kp.id=jp.objectkelompokprodukfk
//						     left JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
//						     left JOIN ruangan_m as ru2 on ru2.id=pd.objectruanganlastfk
//                             left join mapjurnalmanual as map on map.objectruanganfk = ru.id and map.jpid=jp.id or map.jpid=jp.id and map.objectruanganfk = 999
//                             left join departemen_m as dp on dp.id = ru.objectdepartemenfk inner JOIN pasien_m as ps on ps.id=pd.nocmfk
//                             where tp.tglpelayanan between :tglAwal and :tglAkhir and tp.produkfk not in (402611,10011571,10011572) and tp.strukresepfk is null and map.jenis='Pendapatan'
//						     order by pro.namaproduk) as x
//						     group by x.blnpelayanan,x.keterangan
//						     order by x.blnpelayanan"),
//            array(
//                'tglAwal' => $tglAwal,
//                'tglAkhir' => $tglAkhir,
//            )
//        );
        $data = DB::select(DB::raw("select x.blnpelayanan,sum(x.total) as total, sum(x.volume) as volume, x.keterangan
                    from(
                    select Format(pp.tglpelayanan, 'MM')as blnpelayanan,
                    (case when ru.objectdepartemenfk <> 16 then 'Pendapatan R.Jalan' else 'Pendapatan R.Inap' end)as keterangan,
                    sum(((case when pp.hargajual is null then 0 else pp.hargajual  end - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) 
                    * pp.jumlah )+ case when pp.jasa is null then 0 else pp.jasa end ) as total,sum(pp.jumlah) as volume
                    from pelayananpasien_t as pp
                    join antrianpasiendiperiksa_t as apd on apd.norec= pp.noregistrasifk
                    join pasiendaftar_t as pd on pd.norec= apd.noregistrasifk
                    join ruangan_m as ru on ru.id = pd.objectruanganlastfk
                    where  pp.tglpelayanan BETWEEN  '$tglAwal' and '$tglAkhir'  
                     and pp.strukresepfk is null
                    GROUP BY pp.tglpelayanan,ru.objectdepartemenfk
                    ) as x
                    GROUP BY x.blnpelayanan, x.keterangan
                    order by x.blnpelayanan asc"));
        $dataHeader1=[];
        $dataHeader=[];
        foreach ($data as $item) {
            $arr=[];
            $arr[]=(integer)$item->total;
            if ($item->keterangan == 'Pendapatan R.Jalan') {
                $dataTargetHeader = \DB::table('targetkinerja_m as tk')
                    ->select('tk.pelayanan','tk.targetvolume','tk.targetrupiah','tk.tahun')
                    ->where('pelayanan','Total Rawat Jalan & IGD')
                    ->where('tk.statusenabled',1)
                    ->orderBy('tk.pelayanan')
                    ->get();

                foreach ($dataTargetHeader as $get) {
                    $dataHeader[] = array(
//                        'id' => $item->id,
                        'blnpelayanan' => $item->blnpelayanan,
                        'pelayanan' => $item->keterangan,
                        'totaltarget' =>  number_format($get->targetrupiah / 12, 2, '.', ''),
                        'volumetarget' =>  number_format($get->targetvolume/ 12, 2, '.', ''),
                        'total' => $item->total,
                        'volume' => $item->volume,
//                        'detail' => $dataIsi,
                    );
                }
            }elseif ($item->keterangan == 'Pendapatan R.Inap'){
                $dataTargetHeader = \DB::table('targetkinerja_m as tk')
                    ->select('tk.pelayanan','tk.targetvolume','tk.targetrupiah','tk.tahun')
                    ->where('pelayanan','Total Rawat Inap')
                    ->where('tk.statusenabled',1)
                    ->orderBy('tk.pelayanan')
                    ->get();

                foreach ($dataTargetHeader as $gets) {
                    $dataHeader1[] = array(
//                        'id' => $item->id,
                        'blnpelayanan' => $item->blnpelayanan,
                        'pelayanan' => $item->keterangan,
                        'totaltargetinap' =>   number_format($gets->targetrupiah / 12, 2, '.', ''),
                        'volumetargetinap' =>  number_format($gets->targetvolume / 12, 2, '.', ''),
                        'totalinap' => $item->total,
                        'volumeinap' => $item->volume,
//                        'detail' => $dataIsi1,
                    );
                }
            }
        }
        $result = array(
            'Rajal' => $dataHeader,
            'Ranap' => $dataHeader1,
//            'maxDataTot' => $maxDataTot,
//            'maxtDataVol' => $maxtDataVol,
            'message' => '@UNKNOWS',
        );
        return $this->respond($result);
    }
    public function displayReportBilling(Request $request)
    {
        $fromDate = date('Y-m-d 00:00');//$request->input('from_date');
        $toDate = date('Y-m-d 23:00');
//        $sortBy = $request->input('sort_by');

        $title = 'Registered User Report'; // Report title

        $meta = [ // For displaying filters description on header
            'Registered on' => $fromDate . ' To ' . $toDate,
//            'Sort By' => $sortBy
        ];

        $queryBuilder = PelayananPasien::select(['produkfk', 'hargasatuan', 'tglpelayanan']) // Do some querying..
        ->whereBetween('tglpelayanan', [$fromDate, $toDate]);
//            ->orderBy($sortBy);

        $columns = [
            'Name' => function($customer) {
                return $customer->produkfk;
            },
            'Registered At' => function($customer) {
                return $customer->tglpelayanan;
            },
            'Total Balance' => function($customer) {
                return $customer->hargasatuan;
            },
            'Status' => function($customer) { // You can do if statement or any action do you want inside this closure
                return ($customer->hargasatuan > 100000) ? 'Rich Man' : 'Normal Guy';
            }
        ];
        $pdf =PdfReport::of ($title, $meta, $queryBuilder, $columns)
            ->editColumn('Registered At', [ // Change column class or manipulate its data for displaying to report
                'displayAs' => function($result) {
                    return $result->tglpelayanan->format('d M Y');
                },
                'class' => 'left'
            ])
            ->editColumns(['Total Balance', 'Status'], [ // Mass edit column
                'class' => 'right bold'
            ])
            ->setPaper('a4')
            ->showTotal([ // Used to sum all value on specified column on the last table (except using groupBy method). 'point' is a type for displaying total with a thousand separator
                'Total Balance' => 'point' // if you want to show dollar sign ($) then use 'Total Balance' => '$'
            ])
            ->limit(20) // Limit record to be showed
            ->stream(); // other available method: download('filename') to download pdf / make() that will producing DomPDF / SnappyPdf instance so you could do any other DomPDF / snappyPdf method such as stream() or download()

        // Generate Report with flexibility to manipulate column class even manipulate column value (using Carbon, etc).
        return   $pdf ;}

    public function getPenerimaanRealisasiTargetGrid (Request $request)
    {
        $tglAwal= Carbon::now()->startOfYear()->format('Y-m-d 00:00');
        $tglAkhir =Carbon::now()->endOfYear()->format('Y-m-d 23:59');

        $data =  DB::select(DB::raw("select sum(x.total) as total, sum(x.volume) as volume, x.keterangan
                    from(
                    select Format(pp.tglpelayanan, 'MM')as blnpelayanan,
                    (case when ru.objectdepartemenfk <> 16 then 'Pendapatan R.Jalan' else 'Pendapatan R.Inap' end)as keterangan,
                    sum(((case when pp.hargajual is null then 0 else pp.hargajual  end - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) 
                    * pp.jumlah )+ case when pp.jasa is null then 0 else pp.jasa end ) as total,sum(pp.jumlah) as volume
                    from pelayananpasien_t as pp
                    join antrianpasiendiperiksa_t as apd on apd.norec= pp.noregistrasifk
                    join pasiendaftar_t as pd on pd.norec= apd.noregistrasifk
                    join ruangan_m as ru on ru.id = pd.objectruanganlastfk
                    where  pp.tglpelayanan BETWEEN  :tglAwal and :tglAkhir
                   and pp.strukresepfk is null
                    GROUP BY pp.tglpelayanan,ru.objectdepartemenfk
                    ) as x
                    GROUP BY x.keterangan
          "),
            array(
                'tglAwal' => $tglAwal,
                'tglAkhir' => $tglAkhir,
            )
        );

        $i = 0;
        $jmlstok=0;
        $dataHeader=[];
        $dataHeader1=[];
        $dataIsi=[];
        $dataIsi1=[];
        $results =array();
        foreach ($data as $item) {
            if($item->keterangan == 'Pendapatan R.Jalan'){
                $details = DB::select(DB::raw("select x.tipepasien, sum(x.total) as total, sum(x.volume) as volume, x.keterangan
						from(
						select 	(case when pd.objectkelompokpasienlastfk=2 then 'Pasien BPJS' ELSE
		               'Pasien Non BPJS' end) as tipepasien, Format(pp.tglpelayanan, 'MM')as blnpelayanan,
						(case when ru.objectdepartemenfk <> 16 then 'Pendapatan R.Jalan' else 'Pendapatan R.Inap' end)as keterangan,
						sum(((case when pp.hargajual is null then 0 else pp.hargajual  end - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) 
						* pp.jumlah )+ case when pp.jasa is null then 0 else pp.jasa end ) as total,sum(pp.jumlah) as volume
						from pelayananpasien_t as pp
						join antrianpasiendiperiksa_t as apd on apd.norec= pp.noregistrasifk
						join pasiendaftar_t as pd on pd.norec= apd.noregistrasifk
						join ruangan_m as ru on ru.id = pd.objectruanganlastfk
						where  pp.tglpelayanan BETWEEN  :tglAwal and :tglAkhir
					    and pp.strukresepfk is null
					    and ru.objectdepartemenfk <> 16
						GROUP BY pp.tglpelayanan,ru.objectdepartemenfk,pd.objectkelompokpasienlastfk
						) as x
						GROUP BY x.keterangan,x.tipepasien
                       "),
                    array(
                        'tglAwal' => $tglAwal,
                        'tglAkhir' => $tglAkhir,
//                        'id' => $item->id,
                    )
                );
                foreach ($details as $item2) {
                    if ($item2->tipepasien == 'Pasien BPJS') {
                        $datas = \DB::table('targetkinerja_m as tk')
                            ->select('tk.pelayanan','tk.targetvolume','tk.targetrupiah','tk.tahun')
                            ->where('pelayanan','Pasien BPJS Rawat Jalan & IGD')
                            ->where('tk.statusenabled',1)
                            ->orderBy('tk.pelayanan')
                            ->get();

                        foreach ($datas as $get) {
                            $dataIsi[] = array(
//                                    'id' => $item2->id,
                                'pelayanan' => $item2->keterangan,
                                'pelayanantarget' => $get->pelayanan,
                                'totaltarget' => $get->targetrupiah,
                                'volumetarget' => (float) $get->targetvolume,
                                'total' => $item2->total,
                                'volume' => $item2->volume,
                            );
                        }
                    }elseif ($item2->tipepasien == 'Pasien Non BPJS') {
                        $datas = \DB::table('targetkinerja_m as tk')
                            ->select('tk.pelayanan','tk.targetvolume','tk.targetrupiah','tk.tahun')
                            ->where('pelayanan','Pasien Umum Rawat Jalan & IGD')
                            ->where('tk.statusenabled',1)
                            ->orderBy('tk.pelayanan')
                            ->get();

                        foreach ($datas as $get) {
                            $dataIsi[] = array(
//                                    'id' => $item2->id,
                                'pelayanan' => $item2->keterangan,
                                'pelayanantarget' => $get->pelayanan,
                                'totaltarget' => $get->targetrupiah,
                                'volumetarget' => $get->targetvolume,
                                'total' => $item2->total,
                                'volume' => $item2->volume,
                            );
                        }
                    }
                }
            }
            elseif ($item->keterangan == 'Pendapatan R.Inap'){
                $details = DB::select(DB::raw("select x.tipepasien, sum(x.total) as total, sum(x.volume) as volume, x.keterangan
						from(
						select 	(case when pd.objectkelompokpasienlastfk=2 then 'Pasien BPJS' ELSE
		               'Pasien Non BPJS' end) as tipepasien, Format(pp.tglpelayanan, 'MM')as blnpelayanan,
						(case when ru.objectdepartemenfk <> 16 then 'Pendapatan R.Jalan' else 'Pendapatan R.Inap' end)as keterangan,
						sum(((case when pp.hargajual is null then 0 else pp.hargajual  end - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) 
						* pp.jumlah )+ case when pp.jasa is null then 0 else pp.jasa end ) as total,sum(pp.jumlah) as volume
						from pelayananpasien_t as pp
						join antrianpasiendiperiksa_t as apd on apd.norec= pp.noregistrasifk
						join pasiendaftar_t as pd on pd.norec= apd.noregistrasifk
						join ruangan_m as ru on ru.id = pd.objectruanganlastfk
						where  pp.tglpelayanan BETWEEN  :tglAwal and :tglAkhir
					    and pp.strukresepfk is null
					    and ru.objectdepartemenfk = 16
						GROUP BY pp.tglpelayanan,ru.objectdepartemenfk,pd.objectkelompokpasienlastfk
						) as x
						GROUP BY x.keterangan,x.tipepasien
                       "),
                    array(
                        'tglAwal' => $tglAwal,
                        'tglAkhir' => $tglAkhir,
//                        'id' => $item->id,
                    )
                );
                foreach ($details as $item2) {
                    if ($item2->tipepasien == 'Pasien BPJS') {
                        $datas = \DB::table('targetkinerja_m as tk')
                            ->select('tk.pelayanan','tk.targetvolume','tk.targetrupiah','tk.tahun')
                            ->where('pelayanan','Pasien BPJS Rawat Inap')
                            ->where('tk.statusenabled',1)
                            ->orderBy('tk.pelayanan')
                            ->get();

                        foreach ($datas as $get) {
                            $dataIsi1[] = array(
//                                    'id' => $item2->id,
                                'pelayanan' => $item2->keterangan,
                                'pelayanantarget' => $get->pelayanan,
                                'totaltarget' => $get->targetrupiah,
                                'volumetarget' => $get->targetvolume,
                                'total' => $item2->total,
                                'volume' => $item2->volume,
                            );
                        }
                    }elseif ($item2->tipepasien == 'Pasien Non BPJS'){
                        $datas = \DB::table('targetkinerja_m as tk')
                            ->select('tk.pelayanan','tk.targetvolume','tk.targetrupiah','tk.tahun')
                            ->where('pelayanan','Pasien Umum Rawat Inap')
                            ->where('tk.statusenabled',1)
                            ->orderBy('tk.pelayanan')
                            ->get();

                        foreach ($datas as $get) {
                            $dataIsi1[] = array(
//                                    'id' => $item2->id,
                                'pelayanan' => $item2->keterangan,
                                'pelayanantarget' => $get->pelayanan,
                                'totaltarget' => $get->targetrupiah,
                                'volumetarget' => $get->targetvolume,
                                'total' => $item2->total,
                                'volume' => $item2->volume,
                            );
                        }
                    }
                }
            }
            if ($item->keterangan == 'Pendapatan R.Jalan') {
                $dataTargetHeader = \DB::table('targetkinerja_m as tk')
                    ->select('tk.pelayanan','tk.targetvolume','tk.targetrupiah','tk.tahun')
                    ->where('pelayanan','Total Rawat Jalan & IGD')
                    ->where('tk.statusenabled',1)
                    ->orderBy('tk.pelayanan')
                    ->get();

                foreach ($dataTargetHeader as $get) {
                    $dataHeader[] = array(
//                        'id' => $item->id,
                        'pelayanan' => $item->keterangan,
                        'totaltarget' => number_format( $get->targetrupiah/ 12, 2, '.', ''),
                        'volumetarget' =>  number_format( $get->targetvolume/ 12, 2, '.', ''),
                        'total' => $item->total,
                        'volume' => $item->volume,
                        'detail' => $dataIsi,
                    );
                }
            }elseif ($item->keterangan == 'Pendapatan R.Inap'){
                $dataTargetHeader = \DB::table('targetkinerja_m as tk')
                    ->select('tk.pelayanan','tk.targetvolume','tk.targetrupiah','tk.tahun')
                    ->where('pelayanan','Total Rawat Inap')
                    ->where('tk.statusenabled',1)
                    ->orderBy('tk.pelayanan')
                    ->get();

                foreach ($dataTargetHeader as $get) {
                    $dataHeader1[] = array(
//                        'id' => $item->id,
                        'pelayanan' => $item->keterangan,
                        'totaltarget' =>number_format( $get->targetrupiah/ 12, 2, '.', ''),
                        'volumetarget' =>number_format( $get->targetvolume/ 12, 2, '.', ''),
                        'total' => $item->total,
                        'volume' => $item->volume,
                        'detail' => $dataIsi1,
                    );
                }
            }
        }


        $result = array(
            'datajalan' => $dataHeader,
            'datainap' => $dataHeader1,
            'message' => 'giw',
        );

        return $this->respond($result);
    }
    public function getRealisasiTargetFarmasi (Request $request)
    {
        $tglAwal= Carbon::now()->startOfYear()->format('Y-m-d 00:00');
        $tglAkhir =Carbon::now()->endOfYear()->format('Y-m-d 23:59');
        $data = DB::select(DB::raw("select x.tipepasien,x.blnpelayanan,sum(x.total) as total,sum(x.volume) as volume from
                        (select (case when pd.objectkelompokpasienlastfk=2 then 'Pasien BPJS' ELSE
	                	 'Pasien Non BPJS' end) as tipepasien, Format(pp.tglpelayanan, 'MM')as blnpelayanan,
						(case when ru.objectdepartemenfk <> 16 then 'Pendapatan R.Jalan' else 'Pendapatan R.Inap' end)as keterangan,
						sum(((case when pp.hargajual is null then 0 else pp.hargajual  end - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) 
						* pp.jumlah )+ case when pp.jasa is null then 0 else pp.jasa end ) as total,sum(pp.jumlah) as volume
						from pelayananpasien_t as pp
						join antrianpasiendiperiksa_t as apd on apd.norec= pp.noregistrasifk
						join pasiendaftar_t as pd on pd.norec= apd.noregistrasifk
						join ruangan_m as ru on ru.id = pd.objectruanganlastfk
						where  pp.tglpelayanan BETWEEN  :tglAwal and :tglAkhir
						and pp.strukresepfk is not null
						GROUP BY pp.tglpelayanan,ru.objectdepartemenfk,pd.objectkelompokpasienlastfk) as x
						group by x.tipepasien,x.blnpelayanan
						order by x.blnpelayanan asc"),
            array(
                'tglAwal' => $tglAwal,
                'tglAkhir' => $tglAkhir,
            )
        );
        $datas=[];
        $datasu=[];
        foreach ($data as $item) {
            if ($item->tipepasien == 'Pasien BPJS') {
                $dataTarget = \DB::table('targetkinerja_m as tk')
                    ->select('tk.pelayanan','tk.targetvolume','tk.targetrupiah','tk.tahun')
                    ->where('id',18)
                    ->where('tk.statusenabled',1)
                    ->orderBy('tk.pelayanan')
                    ->get();
                foreach ($dataTarget as $get) {
                    $datas[] = array(
//                        'id' => $item->id,
                        'blnpelayanan' => $item->blnpelayanan,
                        'jenispasien' => $item->tipepasien,
                        'totaltarget' => number_format(  $get->targetrupiah/ 12, 2, '.', ''),
                        'volumetarget' => number_format(  $get->targetvolume/ 12, 2, '.', ''),
                        'total' => $item->total,
                        'volume' => $item->volume,
//                        'detail' => $dataIsi,
                    );
                }

            }elseif ($item->tipepasien == 'Pasien Non BPJS') {
                $dataTarget = \DB::table('targetkinerja_m as tk')
                    ->select('tk.pelayanan','tk.targetvolume','tk.targetrupiah','tk.tahun')
                    ->where('id',18)
                    ->where('tk.statusenabled',1)
                    ->orderBy('tk.pelayanan')
                    ->get();

                foreach ($dataTarget as $get) {
                    $datasu[] = array(
//                        'id' => $item->id,
                        'blnpelayanan' => $item->blnpelayanan,
                        'jenispasien' => $item->tipepasien,
                        'totaltarget' => number_format(  $get->targetrupiah/ 12, 2, '.', ''),
                        'volumetarget' =>  number_format(  $get->targetvolume/ 12, 2, '.', ''),
                        'total' => $item->total,
                        'volume' => $item->volume,
//                        'detail' => $dataIsi,
                    );
                }
            }
        }
        $dataTarget = \DB::table('targetkinerja_m as tk')
            ->select('tk.pelayanan','tk.targetvolume','tk.targetrupiah','tk.tahun')
            ->whereIn('id',[18,73,74,75,76,77,78])
            ->where('tk.statusenabled',1)
            ->orderBy('tk.pelayanan')
            ->get();
        $result = array(
            'bpjs' => $datas,
            'nonbpjs' =>$datasu,
            'targetfarmasi' =>$dataTarget,
            'message' => 'giw',
        );
        return $this->respond($result);
    }

    public function getUsahaLainnya (Request $request)
    {
        $tglAwal= Carbon::now()->startOfYear()->format('Y-m-d 00:00');
        $tglAkhir =Carbon::now()->endOfYear()->format('Y-m-d 23:59');
        $data = DB::select(DB::raw("select x.tgl,sum(x.totalharusdibayar)as total from
                (select Format(sp.tglstruk, 'MM') as tgl,sp.nostruk,sp.qtyproduk,sp.totalharusdibayar,kt.kelompoktransaksi
                from strukpelayanan_t as sp 
                LEFT JOIN strukpelayanandetail_t as spd on spd.nostrukfk = sp.norec
                LEFT JOIN kelompoktransaksi_m as kt on kt.id = sp.objectkelompoktransaksifk
                where sp.tglstruk between :tglAwal and :tglAkhir  and
                kt.id in (2,3,4,5,6,10,13,16,34,8,9,20,21,23,24,26,62,70,71)) as x
                GROUP BY x.tgl
                order by x.tgl"),
            array(
                'tglAwal' => $tglAwal,
                'tglAkhir' => $tglAkhir,
            )
        );
        $datas=[];
        $datasu=[];
        foreach ($data as $item) {
            $dataTarget = \DB::table('targetkinerja_m as tk')
                ->select('tk.pelayanan','tk.targetvolume','tk.targetrupiah','tk.tahun')
                ->whereIn('id',[8])
                ->where('tk.statusenabled',1)
                ->orderBy('tk.pelayanan')
                ->get();
            foreach ($dataTarget as $get) {
                $datas[] = array(
                    'blnpelayanan' => $item->tgl,
                    'totaltarget' => $get->targetrupiah,
                    'total' => $item->total,
                );
            }
        }

        $dataTarget = \DB::table('targetkinerja_m as tk')
            ->select('tk.id','tk.pelayanan','tk.targetvolume','tk.targetrupiah','tk.tahun')
            ->whereIn('id',[8,82,83,84])
            ->where('tk.statusenabled',1)
            ->orderBy('tk.pelayanan')
            ->get();

        $resTarget = [];
        $totalcapain = 0;
        $totalcapainBLU = 0;
        foreach ($data as $itemss){
            $totalcapain = $totalcapain + (float)$itemss->total;
        }
        foreach ( $dataTarget as $itemtarget){
            if ( $itemtarget->id == 8)//usaha lain
            {
                $jenis = 'PENDAPATAN BLU LAINNYA';
                $totalcapainBLU = $totalcapain;
            }else{
                $jenis = 'PENERIMAAN RUPIAH MURNI (RM)';

            }
            $resTarget []= array(
                'jenis' => $jenis,
                'pelayanan' => $itemtarget->pelayanan,
                'targetvolume' => (float) $itemtarget->targetvolume,
                'targetrupiah' =>(float)  $itemtarget->targetrupiah,
                'totalcapaian' => $totalcapainBLU,
                'tahun' => $itemtarget->tahun,
            );

        }

        $result = array(
            'chart' => $data,
            'grid' => $resTarget,
            'message' => 'giw',
        );
        return $this->respond($result);
    }
    public function getTrendPemakaianObat(Request $request)
    {
       
        $tglAwal = Carbon::now()->format('Y-m-d 00:00');
        $tglAkhir = Carbon::now()->format('Y-m-d 23:59');
        $data = DB::select(
            DB::raw("select * from
                (
                select sum(pp.jumlah) as jumlah,prd.namaproduk  
                from pelayananpasien_t  as pp 
                join produk_m as prd on pp.produkfk= prd.id
                where pp.tglpelayanan BETWEEN '$tglAwal' and  '$tglAkhir'
                and pp.strukresepfk is not null
                GROUP BY prd.namaproduk

                UNION ALL
                SELECT  sum(spd.qtyproduk) as jumlah,pr.namaproduk
               FROM strukpelayanan_t as sp  
                JOIN strukpelayanandetail_t as spd on spd.nostrukfk = sp.norec  
                join produk_m as pr  on pr.id =spd.objectprodukfk
                WHERE sp.tglstruk BETWEEN '$tglAwal' and  '$tglAkhir'
                AND sp.nostruk_intern='-' AND substring(sp.nostruk,1,2)='OB'  
                and sp.statusenabled != false
                GROUP BY pr.namaproduk
                UNION ALL    
                 SELECT sum  (spd.qtyproduk) as jumlah,pr.namaproduk
               FROM strukpelayanan_t as sp  
                JOIN strukpelayanandetail_t as spd on spd.nostrukfk = sp.norec  
                join produk_m as pr  on pr.id =spd.objectprodukfk
                WHERE  sp.tglstruk BETWEEN '$tglAwal' and  '$tglAkhir'
              AND sp.nostruk_intern not in ('-') AND substring(sp.nostruk,1,2)='OB'  
                and sp.statusenabled != false
                        GROUP BY pr.namaproduk
                ) as x
                order by x.jumlah desc")
        );

        $result = array(
            'chart' => $data,
            'message' => 'er@epic',
        );
        return $this->respond($result);
    }
    public function getIndikatorRensar(Request $request)
    {

        $tahun = $request['tahun'];//Carbon::now()->format('Y');

        $data = DB::select(DB::raw("
                 select * from (
                    select  x.indikator as namaindikator, x.satuan, 
                    sum (x.capaian) / (case count(x.tanggal) when 0 then 1 else count(x.tanggal) end ) as capaian,
                    x.tahun,x.bulan, x.monthmm,
                    sum (x.targets) / (case count(x.targets) when 0 then 1 else count(x.targets) end )  as target, x.pic,
                    x.warnagrafik,x.urutan
                    from (
                        select head.indikator,head.satuan,dt.capaian,
                        dt.target,dt.tahun,dt.bulan,
                        Format(dt.tgl,'Month')  as tanggal,  Format(dt.tgl,'MM')  as monthmm,  head.pic,
                        cast(tg.target as float) as targets,head.warnagrafik,head.urutan
                        from indikatorrensar_m as head
                        INNER JOIN indikatorrensardetail_t as dt on dt.indikatorfk =head.id
                        left join targetindikator_m as tg on head.id= tg.indikatorrensarfk 
                        where dt.tahun ilike '$tahun%'
                        and tg.tahun  ilike '$tahun%'
                        and dt.statusenabled=true
                        and tg.kdprofile=1
                        and tg.statusenabled=true
                        and head.jenisindikatorfk = 5 --IKI DIRUT
                        order by dt.tgl asc
                    )as x 
                    GROUP BY x.indikator, x.satuan, x.pic,x.monthmm,
                    x.tahun,x.bulan,x.bulan,x.warnagrafik,x.urutan
                ) as y
                order BY y.monthmm
              ") );

        $result = array(
            'data' => $data,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);

    }
    public function saveIndikatorRensar(Request $request){
        DB::beginTransaction();
        try{
            $getHead = IndikatorRensar::where('id',$request['indikatorfk'])->first();
            if ($request['norec'] == ''){
                $TP = new IndikatorRensarDetail();
                $TP->kdprofile = 1;
                $TP->norec = $TP->generateNewId();
                $TP->statusenabled=true;
            }else{
                $TP = IndikatorRensarDetail::where('norec', $request['norec'])->first();
            }

            $TP->bulan = $request['bulan'];
            $TP->indikatorfk =$request['indikatorfk'];
            $TP->capaian = $request['capaian'];
            $TP->denumerator = $request['denumerator'];
            $TP->numerator = $request['numerator'];
            $TP->tahun = $request['tahun'];
            $TP->tgl = $request['tgl'];
            $TP->save();

            $transStatus = 1;
        } catch (\Exception $e) {
            $transStatus = false;
        }

        if ($transStatus) {
            $transMessage = 'Sukses';
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $TP,
                'as' => 'inhuman',
            );
        } else {
            $transMessage = 'Simpan Gagal';
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDaftarIndikatorRensar(Request $request)
    {
        $tahun = Carbon::now()->format('Y');
        $data = DB::table('indikatorrensar_m as head')
            ->join('indikatorrensardetail_t as dt','head.id','=','dt.indikatorfk')
            ->leftjoin('targetindikator_m as tg','head.id','=','tg.indikatorrensarfk')
            ->leftjoin('jenisindikator_m as ji','ji.id','=','head.jenisindikatorfk')
            ->select('dt.norec','head.indikator','head.satuan','dt.capaian','dt.indikatorfk',
//                    'dt.target',
                     'dt.tahun','dt.bulan','dt.tgl','head.pic','ji.jenisindikator','head.jenisindikatorfk',
                     'dt.numerator','dt.denumerator',
                DB::raw("day(dt.tgl)  as tanggal,   sum( cast(tg.target as float) ) / count ( tg.target)as target"))
            ->where('dt.statusenabled',1)
//            ->where('dt.kdprofile','1')
            ->where('tg.statusenabled',1)
            ->where('ji.statusenabled',1)
            ->groupBy('dt.norec','head.indikator','head.satuan','dt.capaian','dt.indikatorfk',
//                    'dt.target',
                'dt.tahun','dt.bulan','dt.tgl','head.pic','ji.jenisindikator','head.jenisindikatorfk','dt.numerator','dt.denumerator')
            ->orderBy('dt.tgl','asc');


        if(isset($request['indikator']) && $request['indikator']!= ''){
            $data = $data->where('head.id',$request['indikator']);
        }
        if(isset($request['capaian']) && $request['capaian']!= ''){
            $data = $data->where('dt.capaian',$request['capaian']);
        }
        if(isset($request['target']) && $request['target']!= ''){
            $data = $data->where('dt.target',$request['target']);
        }
        if(isset($request['bulan']) && $request['bulan']!= ''){
            $data = $data->where('dt.bulan',$request['bulan']);
        }
        if(isset($request['tahun']) && $request['tahun']!= ''){
            $data = $data->where('dt.tahun',$request['tahun']);
        }
        if(isset($request['jenisindikatorfk']) && $request['jenisindikatorfk']!= ''){
            $data = $data->where('head.jenisindikatorfk',$request['jenisindikatorfk']);
        }
        if(isset($request['idDept']) && $request['idDept']!= ''){
            $data = $data->where('head.objectdepartemenfk',$request['idDept']);
        }
        $data = $data->get();

        $result = array(
            'data' => $data,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);

    }
    public function deleteIndikatorRensar(Request $request){
        DB::beginTransaction();
        try{
            if ($request['norec'] != '') {
                $TP = IndikatorRensarDetail::where('norec', $request['norec'])->delete();
            }
            $transStatus = 1;
        } catch (\Exception $e) {
            $transStatus = false;
        }

        if ($transStatus) {
            $transMessage = 'Sukses';
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
//                'result' => $TP,
                'as' => 'inhuman',
            );
        } else {
            $transMessage = 'Simpan Gagal';
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getTargetIndikator(Request $request)
    {
        $tahun = Carbon::now()->format('Y');
        $data = DB::select(DB::raw("
                    select tg.id,ids.indikator, tg.tahun as tahuns, tg.target,tg.keterangan,ids.pic,
                    tg.indikatorrensarfk,ids.jenisindikatorfk,jd.jenisindikator
                    from targetindikator_m as tg
                    join indikatorrensar_m as ids on tg.indikatorrensarfk =ids.id
                    left join jenisindikator_m as jd on jd.id =ids.jenisindikatorfk
                    where tg.statusenabled=true and tg.kdprofile=1
                    and jd.statusenabled=true and jd.kdprofile=1
                    order by ids.urutan"

        ));

        $result = array(
            'data' => $data,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);

    }
    public function saveTargetIndikator(Request $request){
        DB::beginTransaction();
        try{
            $newID = TargetIndikator::max('id') + 1;
            if ($request['Id'] == null) {
                $TG = new TargetIndikator();
                $TG->id = $newID;
                $TG->kdprofile = 1;
                $TG->statusenabled=true;
            }else{
                $TG = TargetIndikator::where('id',$request['Id'])->first();
            }
            $TG->indikatorrensarfk = $request['Indikator'] ;
            $TG->tahun = $request['Tahun'] ;
            $TG->target = $request['Target'] ;
            if(isset($request['Keterangan'])){
                $TG->keterangan = $request['Keterangan'] ;
            }else{
                $TG->keterangan = '-';
            }

            $TG->save();

            $transStatus = 1;
        } catch (\Exception $e) {
            $transStatus = false;
        }

        if ($transStatus) {
            $transMessage = 'Sukses';
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $TG,
                'as' => 'inhuman',
            );
        } else {
            $transMessage = 'Simpan Gagal';
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function deleteTargetIndikator(Request $request){
        DB::beginTransaction();
        try{
            $TG = TargetIndikator::where('id',$request['id'])->update(
                [ 'statusenabled' => false]
            );
            $transStatus = 1;
        } catch (\Exception $e) {
            $transStatus = false;
        }

        if ($transStatus) {
            $transMessage = 'Sukses';
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $TG,
                'as' => 'inhuman',
            );
        } else {
            $transMessage = 'Simpan Gagal';
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getCombo(Request $request) {

        $indikator = IndikatorRensar::where('statusenabled',1)
//            ->where('kdprofile',1)
            ->get();

        $Jenisindikator = JenisIndikator::where('statusenabled',1)
//            ->where('kdprofile',1)
            ->get();

        $result = array(
            'indikator' => $indikator,
            'jenisindikator' => $Jenisindikator,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }

    public function getComboDataRuangan(Request $request) {

        $data = Ruangan::where('statusenabled',1);

        if(isset($request['objectdepartemenfk']) &&
            $request['objectdepartemenfk']!="" &&
            $request['objectdepartemenfk']!="undefined"){
               $data = $data->where('objectdepartemenfk','=',$request['objectdepartemenfk']);
            }
        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }

    public function saveJenisInidkator(Request $request){
        DB::beginTransaction();
        try{
            if ($request['id'] == ''){
                $TP = new JenisIndikator();
                $idMax = JenisIndikator::max('id');
                $TP->kdprofile = 1;
                $TP->id = $idMax + 1 ;
                $TP->norec = $TP->generateNewId();
            }else{
                $TP = JenisIndikator::where('id', $request['id'])->first();
            }
            $TP->statusenabled = $request['statusenabled'];;
            $TP->kodeexternal = $request['kodeexternal'];
            $TP->namaexternal = $request['jenisindikator'];
            $TP->reportdisplay = $request['jenisindikator'];
            $TP->jenisindikator = $request['jenisindikator'];
            $TP->save();

            $transStatus = 1;
        } catch (\Exception $e) {
            $transStatus = false;
        }

        if ($transStatus) {
            $transMessage = 'Sukses';
            DB::commit();
            $result = array(
                'status' => 201,
                'result' => $TP,
                'as' => 'inhuman',
            );
        } else {
            $transMessage = 'Simpan Gagal';
            DB::rollBack();
            $result = array(
                'status' => 400,
                'as' => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getEisPolri(Request $request)
    {
        ini_set('max_execution_time', 5000);
        $saidsukanto = $this->getApiEisPolri("http://simrs-rspusatpolri.com:9000/service/medifirst2000/registrasi/geteisperrstotalinstalasi?&tglAwal=2022-07-25%2000:00:00&tglAkhir=2022-07-25%2023:59:00");
        // $sartikaasih = $this->getApiEisPolri("http://bdg2.jasamedika.com:8000/service/medifirst2000/registrasi/geteisperrstotalinstalasi?&tglAwal=2022-07-18%2000:00:00&tglAkhir=2022-07-18%2023:59:00");
        $update1 = array(
                            "tglAwal"=> '2022-07-25 00:00:00',
                            "tglAkhir"=> '2022-07-25 23:59:00',
                            );
        $sartikaasih = $this->geteisperrstotalinstalasi($update1);
        // return($sartikaasih);
        // die();
        $tempdata = array_merge($saidsukanto['data'],$sartikaasih['data']);
        
        return $this->respond($tempdata);
    }
    public function getEisPolriDetail(Request $request)
    {
        ini_set('max_execution_time', 5000);
       if($request['idrs']==1){
            // $api="http://simrs-rspusatpolri.com:9000/service/medifirst2000/registrasi/get-geteisperrs?&tglAwal=2022-07-18%2000:00:00&tglAkhir=2022-07-18%2023:59:00&iddepartemen".$request['idinstalasi'];
            $tempdata = $this->getApiEisPolri("http://simrs-rspusatpolri.com:9000/service/medifirst2000/registrasi/get-geteisperrs?&tglAwal=2022-07-25%2000:00:00&tglAkhir=2022-07-25%2023:59:00&iddepartemen=".$request['idinstalasi']);
       }else{
            // $tempdata = $this->getApiEisPolri("http://bdg2.jasamedika.com:8000/service/medifirst2000/registrasi/get-geteisperrs?&tglAwal=2022-07-18%2000:00:00&tglAkhir=2022-07-18%2023:59:00&iddepartemen=".$request['idinstalasi']);
            $update1 = array(
                            "tglAwal"=> '2022-07-25 00:00:00',
                            "tglAkhir"=> '2022-07-25 23:59:00',
                            "iddepartemen"=>$request['idinstalasi']
                            );
            $tempdata = $this->geteisperrs($update1);
       }
        
        
        return $this->respond($tempdata['data']);
    }
    function geteisperrs($request){
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $iddepartemen = '';
         if (isset($request['iddepartemen']) && $request['iddepartemen'] != "" && $request['iddepartemen'] != "undefined") {
                    $iddepartemen =  'and dp.id in ('. $request['iddepartemen'].')'  ;
        }
         $data =  DB::select(DB::raw("select
                                    ps.namapasien AS nama,
                                    ps.tgllahir,
                                    pd.tglregistrasi AS tglmasuk,
                                    pd.tglpulang AS tglkeluar,
                                    rpd.namaruangan,
                                    rasal.namaruangan as ruanganasal,
                                    rpd.id as idruangan,
                                    rasal.id as idruanganasal,
                                    dpjp.namalengkap,
                                    dpjp.id as iddpjp,
                                    kp.kelompokpasien as rekanan,
                                    dp.namadepartemen,
                                    dp.id,
                                    ps.nocm,
                                    pd.noregistrasi,
	                                apd.norec as norecapd
                                FROM
                                    pasien_m AS ps
                                    INNER JOIN pasiendaftar_t AS pd ON ps.ID = pd.nocmfk
                                    INNER JOIN ruangan_m AS rpd ON rpd.ID = pd.objectruanganlastfk
                                    right JOIN ruangan_m AS rasal ON rasal.ID = pd.objectruanganasalfk  
                                    left join pegawai_m as dpjp on pd.objectpegawaifk = dpjp.id
                                    inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec  and apd.objectruanganfk = pd.objectruanganlastfk
                                    inner join kelompokpasien_m as kp on pd.objectkelompokpasienlastfk = kp.id
                                    inner join departemen_m as dp on rpd.objectdepartemenfk = dp.id                                
                                    where pd.tglregistrasi  BETWEEN '$tglAwal' and '$tglAkhir'  $iddepartemen "));
            
            foreach ($data  as $item) {
                $datRek = \DB::table('detaildiagnosapasien_t as dd')
                     ->join('diagnosa_m','diagnosa_m.id','=','dd.objectdiagnosafk')
                    ->where('noregistrasifk', $item->norecapd)                   
                    ->where('dd.objectjenisdiagnosafk',1)
                    ->get();
                $diagnosa = '';
               
                if ($datRek != "" || $datRek != [] || $datRek != NULL || count($datRek) != 0) {
                     foreach ($datRek  as $itemx) {
                        $diagnosa =  $itemx->namadiagnosa;
                     }
                     
                }
                 $tempDesa[] = array(
                        'nama' => $item->nama,
                        'tgllahir' => $item->tgllahir,
                        'tglmasuk' => $item->tglmasuk,
                        'tglkeluar' => $item->tglkeluar,
                        'namaruangan' => $item->namaruangan,
                        'ruanganasal' => $item->ruanganasal,
                        'idruangan' => $item->idruangan,
                        // 'idinstalasi' => $item->idinstalasi,
                        'instalasi' => $item->namadepartemen,
                        'dpjp' => $item->namalengkap,
                        'rekanan' => $item->rekanan,
                        'diagnosa' =>  $diagnosa,
                        'namadepartemen' => $item->namadepartemen,
                        'nocm' => $item->nocm,
                        'noregistrasi' => $item->noregistrasi,
                         
                    );
            }
        $result = array(
            'idrs' => '2',
            'data' => $tempDesa,
            'message' => 'deurlah',
        );
        return ($result);
    }
    function geteisperrstotalinstalasi($request){
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $iddepartemen = '';
         if (isset($request['iddepartemen']) && $request['iddepartemen'] != "" && $request['iddepartemen'] != "undefined") {
                    $iddepartemen =  'and dp.id in ('. $request['iddepartemen'].')'  ;
        }
         $data =  DB::select(DB::raw("select count(ps.id) as total,dp.namadepartemen ,dp.id as iddepartemen
                                FROM
                                    pasien_m AS ps
                                    INNER JOIN pasiendaftar_t AS pd ON ps.ID = pd.nocmfk
                                    INNER JOIN ruangan_m AS rpd ON rpd.ID = pd.objectruanganlastfk
                                    right JOIN ruangan_m AS rasal ON rasal.ID = pd.objectruanganasalfk  
                                    left join pegawai_m as dpjp on pd.objectpegawaifk = dpjp.id
                                    inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec  and apd.objectruanganfk = pd.objectruanganlastfk
                                    inner join kelompokpasien_m as kp on pd.objectkelompokpasienlastfk = kp.id
                                    inner join departemen_m as dp on rpd.objectdepartemenfk = dp.id                                
                                    where pd.tglregistrasi  BETWEEN '$tglAwal' and '$tglAkhir'  $iddepartemen group by dp.id"));
          
           $igd=0;
           $rj=0;
           $ri=0;
           $lab=0;
           foreach ($data as $item) {
                if($item->iddepartemen == 24){
                      $igd =   $igd + $item->total;
                };
                if($item->iddepartemen == 16){
                      $ri =   $ri + $item->total;
                };
                if($item->iddepartemen == 3){
                      $lab =   $lab + $item->total;
                };
                if($item->iddepartemen == 18){
                      $rj =   $rj + $item->total;
                };
           };
           $tempDesa[] = array(
            'idrs' => '2',
            'namars' => 'Rumah Sakit Sartika Asih',
            'igd' => $igd,
            'ri' => $ri,
            'lab' => $lab,
            'rj' => $rj,
           );
           
        $result = array(
            'idrs' => '2',
            'namars' => 'Rumah Sakit Sartika Asih',
            'data' => $tempDesa,
            'message' => 'deurlah',
        );
        return ($result);
    }
    function getApiEisPolri($request){
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time()-strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        // $signature = hash_hmac('sha256', $data."&".$tStamp, $secretKey, true);
        // return($request['data']);
        // die();
        // base64 encode…
        // $encodedSignature = base64_encode($signature);
            $curl = curl_init();
            // $dataJsonSend = json_encode($request['data']);
            curl_setopt_array($curl, array(
                // CURLOPT_PORT =>  $this->getPortBrigdingBPJS(),
                CURLOPT_URL => $request,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_SSL_VERIFYHOST => 0,
                CURLOPT_SSL_VERIFYPEER => 0,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => "GET",
                CURLOPT_HTTPHEADER => array(
                    "Content-Type: Application/x-www-form-urlencoded",
                    "x-token: ".  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbi5yZWdpc3RyYXNpIn0.z1sCAtuc6ODM-HKzftAXqvqUPlFs7bm4wd-qTY-EvnBN1uHSk-OHhlHEpgs2vznkiem7u579VFGC2kxAhxD3NA",
                ),
                CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
            ));

            $response = curl_exec($curl);
            $err = curl_error($curl);

            curl_close($curl);

            if ($err) {
                $result= "cURL Error #:" . $err;
            } else {
                $result = (array) json_decode($response);
            }
           
        return($result);
    }
    public function getJenisIndikator(Request $request)
    {
        $indikator = JenisIndikator::where('statusenabled',1)->get();
        $result = array(
            'data' => $indikator,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);

    }
    public function deleteIndikatorRensar_M(Request $request){
        
        DB::beginTransaction();
        try{
        if($request['id'] != '' || $request['id']  != undifine)
        {
            
                $idas=$request['id'] ;

                
                    $dataA = DB::delete(DB::raw("delete from ruanganindikatorrensar_t where indikatorrensarfk = $idas "));
                    $dataA = DB::delete(DB::raw("delete from indikatorrensar_m where id = $idas "));
                        
             

        }
      
        
        $transStatus = 1;
    } catch (\Exception $e) {
        $transStatus = false;
    }

    if ($transStatus) {
        $transMessage = 'Sukses';
        DB::commit();
        $result = array(
            'status' => 201,
            // 'result' => $new,
            'as' => 'noname',
        );
    } else {
        $transMessage = 'Simpan Gagal';
        DB::rollBack();
        $result = array(
            'status' => 400,
            'as' => 'noname',
        );
    }
    return $this->setStatusCode($result['status'])->respond($result, $transMessage);


    }
    public function saveIndikatorRensar_M(Request $request){
        DB::beginTransaction();
        
        // return($request[0]['data']);
        // die;
        // try{
            if ($request[0]['data']['id'] == ''){
                $new = new \App\Master\IndikatorRensar();
                $id = IndikatorRensar::max('id');
                $new->id = $id + 1;
                $new->kdprofile = 1;
                $new->norec = $new->generateNewId();

            }else{
                $new = \App\Master\IndikatorRensar::where('id', $request[0]['data']['id'])->first();
            }
            $new->statusenabled =  $request[0]['data']['statusenabled'] ;
            $new->definisioperasional = $request[0]['data']['definisioperasional'] ;
            $new->formula = $request[0]['data']['formula'] ;
            $new->indikator = $request[0]['data']['indikator'] ;
//            $new->objectsasaranstrategisfk = $request['objectsasaranstrategisfk'] ;
            $new->pic = $request[0]['data']['pic'] ;
//            $new->urutan = $request['urutan'] ;
            // $new->objectdepartemenfk = $request['objectdepartemenfk'] ;
            $new->jenisindikatorfk = $request[0]['data']['jenisindikatorfk'] ;
            $new->numerator = $request[0]['data']['numerator'] ;
            $new->denominator = $request[0]['data']['denominator'] ;
            $new->dasarpemikiran = $request[0]['data']['dasarpemikiran'] ;
            $new->demensimutufk = $request[0]['data']['dimensimutu'] ;
            $new->tujuan = $request[0]['data']['tujuan'] ;
            $new->targetpencapaian = $request[0]['data']['targetpencapaian'] ;
            $new->inklusi = $request[0]['data']['inklusi'] ;
            $new->eksklusi = $request[0]['data']['eksklusi'] ;
            $new->sumberdata = $request[0]['data']['sumberdata'] ;
            $new->frekuensifk = $request[0]['data']['pengumpulandata'] ;
            $new->waktulaporanfk = $request[0]['data']['jangkalaporan'] ;
            $new->periodefk = $request[0]['data']['periodeanalis'] ;
            $new->metologifk = $request[0]['data']['metodologipengumpulandata'] ;
            $new->cakupandatafk = $request[0]['data']['cakupandata'] ;
            $new->sampel = $request[0]['data']['sampel'] ;
            $new->analisisdatafk = $request[0]['data']['metodologianalisisdata'] ;
            $new->instrumenpengambilandata = $request[0]['data']['instrumenpengambilandata'] ;
            $new->publikasidatafk = $request[0]['data']['publikasidata'] ;
            $new->penanggungjawab = $request[0]['data']['penanggungjawab'];
            $new->objectdepartemenfk = $request[0]['data']['objectdepartemenfk'];
            $new->kategoryindikatorfk = $request[0]['data']['kategoryindikatorfk'];
            $new->keteranganinput = $request[0]['data']['ketaranganinput'];
            $new->keteranganmaster = $request[0]['data']['ketaranganmaster'];
            $new->nourut = $request[0]['data']['nourut'];
            $new->lamatemuan = $request[0]['data']['lamatemuan'] ; 
            $new->objectruanganfk = 2;
            $new->objectjenisbeckendindikatorfk = $request[0]['data']['jenismap'] ;
            $new->save();
            //    return($request[0]['dataRuangan']);
            //    die;

            if($request[0]['dataRuangan'] != '' || $request[0]['dataRuangan']  !=  "undefined")
            {
                $idas=$request[0]['data']['id'] ;
                // return(count($request[0]['dataRuangan']));
                //     die;
                if( $idas != '')
                {
                $dataA = DB::delete(DB::raw("delete from ruanganindikatorrensar_t where indikatorrensarfk = $idas "));
                }
                else
                {
                    $idtambah = $id+1;
                    // $dataA = DB::delete(DB::raw("delete ruanganindikatorrensar_t where indikatorrensarfk = $id + 1 "));
                    $dataA = DB::delete(DB::raw("delete from ruanganindikatorrensar_t where indikatorrensarfk = $idtambah"));
                }
                for ($i=0; $i < count($request[0]['dataRuangan']); $i++) {
                // foreach( $request[0]['dataRuangan'] as $item)
                // {
                    
                      $idRuanganInsert = $request[0]['dataRuangan'][$i]['objectruanganfk'];
                    // return($request[0]['dataRuangan'][$i]['objectruanganfk']);
                    // die;
                    if( $idas != '')
                    {
                        
                        $dataPegawaiUser = DB::insert(DB::raw("
                            INSERT INTO ruanganindikatorrensar_t
                            (indikatorrensarfk, objctruanganfk, keterangan, statusenabled)
                                VALUES        ( $idas,$idRuanganInsert,'',1)"));
                    }
                    else{
                        $dataPegawaiUser = DB::insert(DB::raw("
                        INSERT INTO ruanganindikatorrensar_t
                        (indikatorrensarfk, objctruanganfk, keterangan, statusenabled)
                            VALUES        ( $id + 1,$idRuanganInsert,'',1)"));
                    }
                   
                    
                
                            
                          
                // }
            }

            }else{
               

                    // return($item['objectruanganfk']);
                    // die;
                    if( $idas != '')
                    {
                        $dataA = DB::delete(DB::raw("delete from ruanganindikatorrensar_t where indikatorrensarfk = $idas "));
                        
                    }
                    else{
                        $idtambah = $id+1;
                        // $dataA = DB::delete(DB::raw("delete ruanganindikatorrensar_t where indikatorrensarfk = $id + 1 "));
                        $dataA = DB::delete(DB::raw("delete from ruanganindikatorrensar_t where indikatorrensarfk = $idtambah"));
                    }
            }
          
            
            $transStatus = 1;
        // } catch (\Exception $e) {
        //     $transStatus = false;
        // }

        if ($transStatus) {
            $transMessage = 'Sukses';
            DB::commit();
            $result = array(
                'status' => 201,
                'result' => $new,
                'as' => 'inhuman',
            );
        } else {
            $transMessage = 'Simpan Gagal';
            DB::rollBack();
            $result = array(
                'status' => 400,
                'as' => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getIndikatorRensar_M(Request $request){
        $indikator = DB::table('indikatorrensar_m as ir')
            ->leftjoin('jenisindikator_m as ji','ji.id','=','ir.jenisindikatorfk')
            ->leftjoin('dimensimutu_m as dm','dm.id','=','ir.demensimutufk')
            ->leftjoin('frekuensidata_m as fd','fd.id','=','ir.frekuensifk')
            ->leftjoin('waktulaporan_m as wl','wl.id','=','ir.waktulaporanfk')
            ->leftjoin('periodepelaporan_m as pl','pl.id','=','ir.periodefk')
            ->leftjoin('metologi_m as mtl','mtl.id','=','ir.metologifk')
            ->leftjoin('metologianalisisdata_m as man','ji.id','=','ir.analisisdatafk')
            ->leftjoin('cakupandata_m as cd','cd.id','=','ir.analisisdatafk')
            ->leftjoin('publikasidata_m as pd','pd.id','=','ir.publikasidatafk')
            ->leftjoin('kategoryindikator_m as ki','ki.id','=','ir.kategoryindikatorfk')
            ->leftjoin('departemen_m as dept','dept.id','=','ir.objectdepartemenfk')
            ->leftjoin('jenisbeckendindikator_m as jbi','jbi.id','=','ir.objectjenisbeckendindikatorfk')
            ->select('ir.*','ji.jenisindikator','dm.demensimutu','fd.frekuensi',
                     'wl.waktulaporan','pl.periodepelaporan','mtl.metologi','man.analisisdata',
                     'cd.cakupandata','pd.publikasidata','ki.kategoryindikator','dept.namadepartemen','ir.keteranganinput','ir.keteranganmaster'
                     ,DB::raw("case when ir.keteranganmaster = 1 then 'PPI' else 'PMKP' end as namaketeranganmaster,ir.nourut,ir.objectjenisbeckendindikatorfk,jbi.namaexternal as jenisbeckendindikator "))
            ->where('ir.statusenabled',1)
            ->where('ir.kdprofile',1)
            ->orderBy('ir.urutan');
//            ->get();
            if(isset($request['idDept']) && $request['idDept']!= ''){
                $indikator = $indikator->where('ir.objectdepartemenfk',$request['idDept']);
            }
        $indikator = $indikator->get();

        $result = array(
            'data' => $indikator,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);

    }
    // \ruanganindikatorrensar_t
    public function getRuanganIndikatorRensar(Request $request){
        // $indikator = DB::table('ruangan_m as ru')
        //     ->leftjoin('ruanganindikatorrensar_t as ir','ru.id','=','ir.objctruanganfk')
        //     ->select('ir.indikatorrensarfk','ir.objctruanganfk','ru.namaruangan','ru.id' ,DB::raw("case when ir.indikatorrensarfk is null then 1 else 0 end as statCheckbox"))
        //     ->where('ru.statusenabled',1)
        //     ->where('ir.indikatorrensarfk','=',$request['indikatorrensarfk'])
        //     ->where('ru.objectdepartemanfk','=',$request['objectdepartemanfk'])
            
        //     ->orderBy('ru.namaruangan')
        //    ->get();
        // return($request['indikatorrensarfk']);
        // die;
    
    if($request['indikatorrensarfk'] =='')
    { $indikator = DB::select(DB::raw("  SELECT        namaruangan, id, 0 AS statCheckbox
        FROM            ruangan_m AS ru
        WHERE        (statusenabled=true) AND (objectdepartemenfk = $request[objectdepartemanfk])
        ORDER BY namaruangan"));
        

    }else{
        $indikator = DB::select(DB::raw("  SELECT        namaruangan, id, CASE WHEN (select objctruanganfk from ruanganindikatorrensar_t where indikatorrensarfk= $request[indikatorrensarfk] and objctruanganfk = ru.id) IS NULL THEN 0 ELSE 1 END AS statCheckbox
        FROM            ruangan_m AS ru
        WHERE        (statusenabled=true) AND (objectdepartemenfk = $request[objectdepartemanfk])
        ORDER BY namaruangan"));
        
    }
       
        $result = array(
            'data' => $indikator,
            'message' => 'noname',
        );
        return $this->respond($result);

    }
    public function postWaktuTungguPelayananLab(Request $request){

        DB::beginTransaction();
        try{
            $tahun = Carbon::now()->format('Y');

            $delete = IndikatorRensarDetail::where('indikatorfk',13779)
//                ->where('keterangan','batching')
                ->where('tahun',$tahun)
                ->delete();

            $dataIhHeuh = DB::select(DB::raw("select * from (
                    select ind.id,ind.indikator,ind.satuan,sum(z.menit)/ count(z.tanggal) as capaian , tg.tahun,
                    z.tanggal || '-01' as tanggal ,     z.bulans , sum (cast(tg.target as float)) / count(tg.target) as target,ind.pic
                    from (select *,
                    case when x.tglakhir is not null then 
                    ( extract(minute from x.tglakhir::TIMESTAMP - x.tglawal::TIMESTAMP) +
                    extract(hour from x.tglakhir::TIMESTAMP - x.tglawal::TIMESTAMP) * 60 )::int else 0 end as menit
                    from (select DISTINCT  pd.noregistrasi,so.tglorder as tglawal,rep.validate_on, 
                    Format(so.tglorder,'YYYY-MM')  as tanggal,  Format(so.tglorder,'Month')  as bulans,
                    case when rep.validate_on <> '' then
                    SUBSTRING ( rep.validate_on , 1 , 4 )|| '-'|| 
                    SUBSTRING ( rep.validate_on , 5 , 2 ) || '-'||
                    SUBSTRING ( rep.validate_on , 7 , 2 ) || ' '||
                    SUBSTRING ( rep.validate_on , 9 , 2 ) || ':'||
                    SUBSTRING ( rep.validate_on , 11 , 2 ) else null end as tglakhir
                    from pasiendaftar_t as pd 
                    join strukorder_t as so on so.noregistrasifk=pd.norec
                    join lisorder as lis on so.noorder=lis.ono
                    join resdt as rep on lis.ono= rep.ono
                    where 
                    Format(so.tglorder,'YYYY')  ='$tahun'
                    and rep.validate_on <>''
                    ) as x ORDER BY x.tanggal
                    ) as z
                    join indikatorrensar_m as ind on ind.id=13779
                    join targetindikator_m as tg on tg.indikatorrensarfk =ind.id
                    where tg.tahun='$tahun'
                    group by z.tanggal,ind.indikator,ind.satuan, tg.target,tg.tahun,ind.pic, ind.id, z.bulans 
                    ) as y 
                    order BY y.tanggal"));


            foreach ( $dataIhHeuh as $item){
                $TP = new IndikatorRensarDetail();
                $TP->kdprofile = 1;
                $TP->norec = $TP->generateNewId();
                $TP->statusenabled=true;
                $TP->bulan = $item->bulans;
                $TP->indikatorfk = $item->id;
                $TP->capaian =  $item->capaian;
                $TP->tahun = $item->tahun;
                $TP->tgl =  $item->tanggal;
                $TP->keterangan = 'batching';
                $TP->save();
            }

            $transStatus = 1;
        } catch (\Exception $e) {
            $transStatus = false;
        }

        if ($transStatus) {
            $transMessage = 'Post WTPL';
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
//                'result' => $TP,
                'as' => 'inhuman',
            );
        } else {
            $transMessage = ' ';
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function postWaktuTungguPelayananRad(Request $request){

        DB::beginTransaction();
        try{
            $tahun = Carbon::now()->format('Y');

            $delete = IndikatorRensarDetail::where('indikatorfk',13780)
                ->where('keterangan','batching')
                ->where('tahun',$tahun)
                ->delete();

            $dataIhHeuh = DB::select(DB::raw("select * from (
                    select ind.id,ind.indikator,ind.satuan,sum(z.menit)/ count(z.tanggal) as capaian , tg.tahun,
                    z.tanggal ||'-01' as tanggal, sum (cast(tg.target as float)) / count(tg.target) as target,ind.pic,z.bulans
                    from (
                    select *,
                    case when x.tglakhir is not null then 
                    ( extract(minute from x.tglakhir::TIMESTAMP - x.tglawal::TIMESTAMP) +
                    extract(hour from x.tglakhir::TIMESTAMP - x.tglawal::TIMESTAMP) * 60 )::int else 0 end as menit
                    from (select pd.noregistrasi,so.tglorder as tglawal,ris.create_date,rep.confirm_date,  Format(so.tglorder,'YYYY-MM')  as tanggal,
                    Format(so.tglorder,'Month')  as bulans,
                    case when rep.confirm_date <> '' then
                    SUBSTRING ( rep.confirm_date , 1 , 4 )|| '-'|| 
                    SUBSTRING ( rep.confirm_date , 5 , 2 ) || '-'||
                    SUBSTRING ( rep.confirm_date , 7 , 2 ) || ' '||
                    SUBSTRING ( rep.confirm_date , 9 , 2 ) || ':'||
                    SUBSTRING ( rep.confirm_date , 11 , 2 ) else null end as tglakhir
                    from pasiendaftar_t as pd 
                    join strukorder_t  as so on pd.norec=so.noregistrasifk
                    join ris_order as ris on so.noorder=ris.order_no
                    join ris_report as rep on ris.accession_num = rep.accession_num
                    where Format(so.tglorder,'YYYY')  ='$tahun'
                    ) as x  ORDER BY x.tanggal
                    ) as z
                    join indikatorrensar_m as ind on ind.id=13780
                    join targetindikator_m as tg on tg.indikatorrensarfk =ind.id
                    where tg.tahun='$tahun'
                    group by z.tanggal,ind.indikator,ind.satuan, tg.target,tg.tahun,ind.pic, z.bulans ,ind.id
                    ) as y 
                    order BY y.tanggal"));

            foreach ( $dataIhHeuh as $item){
                $TP = new IndikatorRensarDetail();
                $TP->kdprofile = 1;
                $TP->norec = $TP->generateNewId();
                $TP->statusenabled=true;
                $TP->bulan = $item->bulans;
                $TP->indikatorfk = $item->id;
                $TP->capaian =  $item->capaian;
                $TP->tahun = $item->tahun;
                $TP->tgl =  $item->tanggal;
                $TP->keterangan = 'batching';
                $TP->save();
            }

            $transStatus = 1;
        } catch (\Exception $e) {
            $transStatus = false;
        }

        if ($transStatus) {
            $transMessage = 'Post WTPR';
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
//                'result' => $TP,
                'as' => 'inhuman',
            );
        } else {
            $transMessage = ' ';
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveIndikatorPasienJatuh(Request $request){
        DB::beginTransaction();
        try{
            if ($request['norec'] == ''){
                $new = new IndikatorPasienJatuh();
                $new->kdprofile = 1;
                $new->norec = $new->generateNewId();

            }else{
                $new = IndikatorPasienJatuh::where('norec', $request['norec'])->first();
            }

            $new->statusenabled = $request['statusenabled'];
            $pasien = Pasien::where('nocm', $request['nocm'])->first();
            if(isset($request['nocmfk'])){
                $new->nocmfk = $request['nocmfk'] ;
            }ELSE{
                $new->nocmfk =$pasien->id;
            }

            $new->noregistrasifk = $request['noregistrasifk'] ;
            $new->tgljatuh = $request['tgljatuh'] ;
            $new->keterangan = $request['keterangan'] ;
            $new->jumlah = $request['jumlah'] ;
            $new->save();

            $transStatus = 1;
        } catch (\Exception $e) {
            $transStatus = false;
        }

        if ($transStatus) {
            $transMessage = 'Sukses';
            DB::commit();
            $result = array(
                'status' => 201,
                'result' => $new,
                'as' => 'inhuman',
            );
        } else {
            $transMessage = 'Simpan Gagal';
            DB::rollBack();
            $result = array(
                'status' => 400,
                'as' => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getIndikatorPasienJatuh(Request $request){
        $data = DB::table('indikatorpasienjatuh_t as in')
            ->join('pasiendaftar_t as pd','pd.norec','=','in.noregistrasifk')
            ->join('pasien_m as ps','ps.id','=','pd.nocmfk')
            ->join('ruangan_m as ru','ru.id','=','pd.objectruanganlastfk')
            ->select('in.*','ps.nocm','pd.tglregistrasi','pd.noregistrasi','ps.namapasien','ru.namaruangan',
                'pd.norec as norec_pd')
            ->where('in.statusenabled',1);
        if(isset($request['tglAwal'] ) && $request['tglAwal']!= ''){
            $data = $data->where('in.tgljatuh','>=' ,$request['tglAwal'] );
        }
        if(isset($request['tglAkhir'] ) && $request['tglAkhir']!= ''){
            $data = $data->where('in.tgljatuh','<=' ,$request['tglAkhir'] );
        }
        if(isset($request['noreg'] ) && $request['noreg']!= ''){
            $data = $data->where('pd.noregistrasi',$request['noreg'] );
        }
        if(isset($request['norm'] ) && $request['norm']!= ''){
            $data = $data->where('ps.nocm','ilike','%'.$request['norm'].'%' );
        }
        if(isset($request['nama'] ) && $request['nama']!= ''){
            $data = $data->where('ps.namapasien','ilike','%'.$request['nama'].'%' );
        }
        if(isset($request['deptId'] ) && $request['deptId']!= ''){
            $data = $data->where('ru.objectdepartemenfk',$request['deptId'] );
        }
        if(isset($request['ruangId'] ) && $request['ruangId']!= ''){
            $data = $data->where('ru.id',$request['ruangId'] );
        }
        if(isset($request['ket'] ) && $request['ket']!= ''){
            $data = $data->where('in.keterangan','ilike','%'.$request['ket'].'%' );
        }
        $data = $data->get();
        $result = array(
            'data' => $data,
            'as' => 'inhuman',
        );

        return $this->respond($result);
    }
    public function postPasienJatuh(Request $request){
        DB::beginTransaction();
        try{
            $tahun = Carbon::now()->format('Y');

            $delete = IndikatorRensarDetail::where('indikatorfk',13786)
//                ->where('keterangan','batching')
                ->where('tahun',$tahun)
                ->delete();

            $dataPasien = DB::select(DB::raw("select count(x.bulan),x.bulan,x.tanggal || '-01' as tangal from(
                select pd.noregistrasi, Format(tglregistrasi, 'Month') as bulan ,
                Format(tglregistrasi, 'YYYY-MM') as tanggal ,ru.namaruangan
                from pasiendaftar_t as pd
                join ruangan_m as ru on ru.id= pd.objectruanganlastfk
                where ru.objectdepartemenfk=16 and Format(pd.tglregistrasi, 'YYYY')= '$tahun'
                order by pd.noregistrasi
                ) as x GROUP BY x.bulan,x.tanggal
                ORDER BY x.tanggal;"));

            $dataJatuh = DB::select(DB::raw("select x.bulan,sum( COALESCE (x.jumlah,0) ) as jumlah,
                    x.tanggal || '-01' as tangal 
                    from(
                    select pd.noregistrasi, Format(ind.tgljatuh, 'Month') as bulan ,
                    Format(ind.tgljatuh, 'YYYY-MM') as tanggal,
                    ind.jumlah
                    from pasiendaftar_t as pd
                    join indikatorpasienjatuh_t as ind on ind.noregistrasifk=pd.norec
                    where Format(tgljatuh, 'YYYY')= '$tahun'
                    and ind.statusenabled=true
                    ) as x GROUP BY x.bulan,x.tanggal
                    ORDER BY x.tanggal "));

            $arr = [];
            if(count($dataPasien) > 0 ){
                foreach ($dataPasien as $item){
                    foreach ($dataJatuh as $item2){
                        if($item->bulan == $item2->bulan ){
                            $jumlahJatuh = $item2->jumlah ;
                        }else{
                            $jumlahJatuh = 0;
                        }

                    }
                    $arr [] = array(
                        'jumlahinap' => (float) $item->count,
                        'bulan' => $item->bulan,
                        'pasienjatuh' => (float) $jumlahJatuh,
                        'tanggal' => $item->tangal,
                        'capaian' => number_format(( (float) $jumlahJatuh /(float) $item->count ) * 100, 1) ,
                        //(Jumlah kejadian pasien jatuh dibagi jumlah pasien rawat inap) x 100%
                    );
                }
            }

//            return $this->respond($arr);
            foreach ( $arr as $item){
                $TP = new IndikatorRensarDetail();
                $TP->kdprofile = 1;
                $TP->norec = $TP->generateNewId();
                $TP->statusenabled=true;
                $TP->bulan = $item['bulan'];
                $TP->indikatorfk = 13786;
                $TP->capaian =  $item['capaian'];
                $TP->tahun = $tahun;
                $TP->tgl = $item['tanggal'];
                $TP->keterangan = 'batching';
                $TP->save();
            }

            $transStatus = 1;
        } catch (\Exception $e) {
            $transStatus = false;
        }

        if ($transStatus) {
            $transMessage = 'Post Pasien Jatuh';
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $TP,
                'as' => 'inhuman',
            );
        } else {
            $transMessage = ' ';
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function postTindakanOperasiNICU(Request $request){

        DB::beginTransaction();
        try{
            $tahun = Carbon::now()->format('Y');

            $dataPasien = DB::select(DB::raw("select (z.jumlah/z.jumlah*100 ) as capaian ,z.bulan,z.tanggal
                        from (
                        select sum(x.jumlah) as jumlah,x.bulan, (SUBSTRING(x.tanggal, 1, 7)) + '-01' as tanggal from(
                        select Month(pp.tglpelayanan) as bulan ,convert(VARCHAR(10),pp.tglpelayanan,121) AS  tanggal,
                        prd.namaproduk,pp.jumlah
                        from pelayananpasien_t as pp
                        join produk_m as prd on prd.id = pp.produkfk 
                        where prd.id=10111734
                        and year(pp.tglpelayanan) = '$tahun'
                        ) as x
                        GROUP BY x.bulan,x.tanggal
                        ) as z ORDER BY z.bulan;
                "));

//           return $this->respond($dataPasien);

            foreach ( $dataPasien as $item){
                $delete = IndikatorRensarDetail::where('indikatorfk',13792)
                    ->where('bulan',$item->bulan)
                    ->where('tahun',$tahun)
                    ->delete();
                $TP = new IndikatorRensarDetail();
                $TP->kdprofile = 1;
                $TP->norec = $TP->generateNewId();
                $TP->statusenabled=true;
                $TP->bulan = $item->bulan;
                $TP->indikatorfk = 13792;
                $TP->capaian =  $item->capaian;
                $TP->tahun = $tahun;
                $TP->tgl = $item->tanggal;
                $TP->keterangan = 'batching';
                $TP->save();
            }
//
            $transStatus = 1;
        } catch (\Exception $e) {
            $transStatus = false;
        }

        if ($transStatus) {
            $transMessage = 'Rensar NICU';
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
//                'result' => $TP,
                'as' => 'inhuman',
            );
        } else {
            $transMessage = ' ';
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function postKeluhanPelanggan(Request $request){
        DB::beginTransaction();
        try{
            $tahun = Carbon::now()->format('Y');
            $dataJumlah = DB::select(DB::raw("select count(x.bulan),x.bulan,x.tanggal || '-01' as tangal from(
                select kp.id, Format(kp.tglkeluhan, 'Month') as bulan ,
                Format(kp.tglkeluhan, 'YYYY-MM') as tanggal
                from keluhanpelanggan_m as kp
                where Format(kp.tglkeluhan, 'YYYY')= '2018'
                order by kp.id
                ) as x GROUP BY x.bulan,x.tanggal
                ORDER BY x.bulan;
            ;"));

            $dataTertangani = DB::select(DB::raw("select count(x.bulan),x.bulan,x.tanggal || '-01' as tangal from(
                select pkp.norec, Format(pkp.tglpenanganan, 'Month') as bulan ,
                Format(pkp.tglpenanganan, 'YYYY-MM') as tanggal
                from keluhanpelanggan_m as kp
                join penanganankeluhanpelanggan_t as pkp on pkp.keluhanpelangganfk = kp.id
                where Format(pkp.tglpenanganan, 'YYYY')= '2018'
                order by kp.id
                ) as x GROUP BY x.bulan,x.tanggal
                ORDER BY x.bulan;"));

            $arr = [];
            if(count($dataJumlah) > 0 ){
                foreach ($dataJumlah as $item){
                    foreach ($dataTertangani as $item2){
                        if($item->bulan == $item2->bulan ){
                            $direspon = $item2->count ;
                        }else{
                            $direspon = 0;
                        }
                        $arr [] = array(
                            'jumlah' => (float) $item->count,
                            'bulan' => $item->bulan,
                            'direspon' => (float) $direspon,
                            'tanggal' => $item->tangal,
                            'capaian' => number_format(( (float) $direspon /(float) $item->count ) * 100, 1) ,
                            //(Jumlah seluruh komplain (kategori merah, kuning, hijau) yg ditanggapi & ditindaklanjuti sesuai masing-masing standar waktu / Jumlah seluruh komplain (merah, kuning, hijau)) x 100%
                        );
                    }
                }
            }

//            return $this->respond($arr);
            foreach ( $arr as $item){
                $delete = IndikatorRensarDetail::where('indikatorfk',13776)
                    ->where('bulan', $item['bulan'])
                    ->where('tahun',$tahun)
                    ->delete();
                $TP = new IndikatorRensarDetail();
                $TP->kdprofile = 1;
                $TP->norec = $TP->generateNewId();
                $TP->statusenabled=true;
                $TP->bulan = $item['bulan'];
                $TP->indikatorfk = 13776;
                $TP->capaian =  $item['capaian'];
                $TP->tahun = $tahun;
                $TP->tgl = $item['tanggal'];
                $TP->keterangan = 'batching';
                $TP->save();
            }
//
            $transStatus = 1;
        } catch (\Exception $e) {
            $transStatus = false;
        }

        if ($transStatus) {
            $transMessage = 'Post Repon Pelanggan';
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $TP,
                'as' => 'inhuman',
            );
        } else {
            $transMessage = ' ';
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function postPengembalianRekamMedik(Request $request){
        DB::beginTransaction();
        try{
            $tahun = Carbon::now()->format('Y');
            $delete = IndikatorRensarDetail::whereIn('indikatorfk',[13777,13796])
//                ->where('keterangan','batching')
                ->where('tahun',$tahun)
                ->delete();

            $dataPasien = DB::select(DB::raw("select count(x.bulan),x.bulan,x.tanggal || '-01' as tangal from(
                    select * from ( 
                    select pd.noregistrasi,   row_number() over (partition by pd.noregistrasi order by kdrm.tglkembali desc) as rownum,
                    Format (pd.tglpulang,'YYYY-MM') as tanggal,Format (pd.tglpulang,'Month') AS bulan,  
                    (extract(day from kdrm.tglkembali::TIMESTAMP - pd.tglpulang::TIMESTAMP) * 24 + 
                    extract(hour from kdrm.tglkembali::TIMESTAMP - pd.tglpulang::TIMESTAMP)  )::int as jam
                    from pasiendaftar_t as pd
                    inner join kendalidokumenrekammedis_t as kdrm on kdrm.nocmfk = pd.nocmfk
                    where kdrm.objectstatuskendalidokumenfk = 3 and Format (pd.tglpulang,'YYYY')='$tahun'
                    and kdrm.tglkembali is not null
                    ) as z where  z.rownum=1 
                    ) as x 
                    GROUP BY x.bulan,x.tanggal
                    order by x.tanggal
                    "));

            $dataJatuh = DB::select(DB::raw("select count(x.bulan),x.bulan,x.tanggal || '-01' as tangal from(
                    select * from ( 
                    select pd.noregistrasi,   row_number() over (partition by pd.noregistrasi order by kdrm.tglkembali desc) as rownum,
                    Format (pd.tglpulang,'YYYY-MM') as tanggal,Format (pd.tglpulang,'Month') AS bulan,  
                    (extract(day from kdrm.tglkembali::TIMESTAMP - pd.tglpulang::TIMESTAMP) * 24 + 
                    extract(hour from kdrm.tglkembali::TIMESTAMP - pd.tglpulang::TIMESTAMP)  )::int as jam
                    from pasiendaftar_t as pd
                    inner join kendalidokumenrekammedis_t as kdrm on kdrm.nocmfk = pd.nocmfk
                    where kdrm.objectstatuskendalidokumenfk = 3 and Format (pd.tglpulang,'YYYY')='$tahun'
                    and kdrm.tglkembali is not null
                    ) as z where  z.rownum=1 
                    ) as x where x.jam > 24
                    GROUP BY x.bulan,x.tanggal
                    order by x.tanggal"));


            if(count($dataPasien) > 0 ){
                $arr = [];
                foreach ($dataPasien as $item){
                    foreach ($dataJatuh as $item2){
                        if($item->bulan == $item2->bulan ){
                            $jumlahJatuh = $item2->count ;
                        }
//                        else{
//                            $jumlahJatuh = 0;
//                        }

                    }
                    $arr [] = array(
                        'jumlah' => (float) $item->count,
                        'bulan' => $item->bulan,
                        'jumlah24' => (float) $jumlahJatuh,
                        'tanggal' => $item->tangal,
                        'capaian' => number_format(( (float) $jumlahJatuh /(float) $item->count ) * 100, 1) ,
                        //(Jumlah kejadian pasien jatuh dibagi jumlah pasien rawat inap) x 100%
                    );
                }
            }

            $data10=[];
            foreach ($arr as $item) {
                $sama=false;
                $i=0;
                foreach ($data10 as $hideung){
                    if ($item['bulan'] == $data10[$i]['bulan']){
                        $sama=1;
                        $data10[$i]['capaian'] = (float)$data10[$i]['capaian'] + (float)($item['capaian']);
                    }
                    $i=$i+1;
                }
                if ($sama==false){
                    $data10[]=array(
                        'tanggal'=>$item['tanggal'],
                        'bulan'=>$item['bulan'],
                        'capaian'=>$item['capaian'],
                    );
                }
            }

//            return $this->respond($data10);
            foreach ( $data10 as $item){
                $TP = new IndikatorRensarDetail();
                $TP->kdprofile = 1;
                $TP->norec = $TP->generateNewId();
                $TP->statusenabled=true;
                $TP->bulan = $item['bulan'];
                $TP->indikatorfk = 13777;
                $TP->capaian =  $item['capaian'];
                $TP->tahun = $tahun;
                $TP->tgl = $item['tanggal'];
                $TP->keterangan = 'batching';
                $TP->save();
            }
            foreach ( $data10 as $item){
                $TP = new IndikatorRensarDetail();
                $TP->kdprofile = 1;
                $TP->norec = $TP->generateNewId();
                $TP->statusenabled=true;
                $TP->bulan = $item['bulan'];
                $TP->indikatorfk = 13796;
                $TP->capaian =  $item['capaian'];
                $TP->tahun = $tahun;
                $TP->tgl = $item['tanggal'];
                $TP->keterangan = 'batching';
                $TP->save();
            }

            $transStatus = 1;
        } catch (\Exception $e) {
            $transStatus = false;
        }

        if ($transStatus) {
            $transMessage = 'Post Pengembalian Rekam Medik';
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $TP,
                'as' => 'inhuman',
            );
        } else {
            $transMessage = ' ';
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function postWaktuTungguRawatJalan(Request $request){

        DB::beginTransaction();
        try{
            $tahun = Carbon::now()->format('Y');

            $delete = IndikatorRensarDetail::where('indikatorfk',13782)
                ->where('keterangan','batching')
                ->where('tahun',$tahun)
                ->delete();

            $dataIhHeuh = DB::select(DB::raw("select * from (
                select ind.id,ind.indikator,ind.satuan,sum(z.menit)/ count(z.tanggal) as capaian , tg.tahun,
                z.tanggal || '-01' as tanggal, z.bulan, sum (cast(tg.target as float)) / count(tg.target) as target,ind.pic
                from (
                SELECT Format( pd.tglregistrasi,'Month') as bulan,Format( pd.tglregistrasi,'YYYY-MM') as tanggal, 
                case when app.tgldipanggildokter is not null then 
                ( extract(minute from app.tgldipanggildokter::TIMESTAMP - pd.tglregistrasi::TIMESTAMP) +
                extract(hour from app.tgldipanggildokter::TIMESTAMP - pd.tglregistrasi::TIMESTAMP) * 60 )::int else 0 end as menit,
                pd.noregistrasi, pd.tglregistrasi, app.tgldipanggildokter
                from antrianpasiendiperiksa_t as app
                left join pasiendaftar_t as pd on pd.norec = app.noregistrasifk
                left join ruangan_m as ru on ru.id = pd.objectruanganlastfk
                where ru.objectdepartemenfk in (18,27,28,24,3) and    Format(pd.tglregistrasi,'YYYY')  ='$tahun'
                order by pd.tglregistrasi
                ) as z
                join indikatorrensar_m as ind on ind.id=13782
                join targetindikator_m as tg on tg.indikatorrensarfk =ind.id
                where tg.tahun ilike '$tahun%'
                group by z.tanggal,ind.indikator,ind.satuan, tg.target,tg.tahun,ind.pic, ind.id, z.bulan
                ) as y 
                order BY y.tanggal"));

//            return $this->respond($dataIhHeuh);
            foreach ( $dataIhHeuh as $item){
                $TP = new IndikatorRensarDetail();
                $TP->kdprofile = 1;
                $TP->norec = $TP->generateNewId();
                $TP->statusenabled=true;
                $TP->bulan = $item->bulan;
                $TP->indikatorfk = $item->id;
                $TP->capaian =  $item->capaian;
                $TP->tahun = $item->tahun;
                $TP->tgl =  $item->tanggal;
                $TP->keterangan = 'batching';
                $TP->save();
            }

            $transStatus = 1;
        } catch (\Exception $e) {
            $transStatus = false;
        }

        if ($transStatus) {
            $transMessage = 'Post WTRJ';
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
//                'result' => $TP,
                'as' => 'inhuman',
            );
        } else {
            $transMessage = ' ';
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getIndikatorIKT(Request $request)
    {
        $tahun = $request['tahun'];//Carbon::now()->format('Y');

        $data = DB::select(DB::raw("
                     select * from (
                        select  x.indikator as namaindikator, x.satuan, 
                        sum (x.capaian) / (case count(x.tanggal) when 0 then 1 else count(x.tanggal) end ) as capaian,
                        x.tahun,x.bulan, x.monthmm,
                        sum (x.targets) / (case count(x.targets) when 0 then 1 else count(x.targets) end )  as target, x.pic,
                        x.warnagrafik,x.urutan
                        from (
                            select head.indikator,head.satuan,dt.capaian,
                            dt.target,dt.tahun,dt.bulan,dt.tgl,
                            Format(dt.tgl,'Month')  as tanggal,  Format(dt.tgl,'MM')  as monthmm,  head.pic,
                            cast(tg.target as float) as targets,head.warnagrafik,head.urutan
                            from indikatorrensar_m as head
                            INNER JOIN indikatorrensardetail_t as dt on dt.indikatorfk =head.id
                            left join targetindikator_m as tg on head.id= tg.indikatorrensarfk 
                            where dt.tahun ilike '$tahun%'
                            and tg.tahun  ilike '$tahun%'
                            and dt.statusenabled=true
                            and tg.kdprofile=1
                            and tg.statusenabled=true
                            and head.jenisindikatorfk = 6 -- IKT
                            order by dt.tgl asc
                        )as x 
                        GROUP BY x.indikator, x.satuan, x.pic,x.monthmm,
                        x.tahun,x.bulan,x.tgl,x.bulan,x.warnagrafik,x.urutan
                    ) as y
                    order BY y.monthmm

              ") );
        $resul = [];
        $categories = '';
        foreach ($data as $item){
            if($item->monthmm == '01' ||$item->monthmm == '02' ||$item->monthmm == '03'){
                $categories = 'Triwulan 1';
            }
            if($item->monthmm == '04' ||$item->monthmm == '05' ||$item->monthmm == '06'){
                $categories = 'Triwulan 2';
            }
            if($item->monthmm == '07' ||$item->monthmm == '08' ||$item->monthmm == '09'){
                $categories = 'Triwulan 3';
            }
            if($item->monthmm == '10' ||$item->monthmm == '11' ||$item->monthmm == '12'){
                $categories = 'Triwulan 4';
            }
            $resul []= array(
                'namaindikator' => $item->namaindikator,
                'satuan' => $item->satuan,
                'capaian' => $item->capaian,
                'tahun' => $item->tahun,
                'bulan' => $item->bulan,
                'monthmm' => $item->monthmm,
                'target' => $item->target,
                'pic' => $item->pic,
                'warnagrafik' => $item->warnagrafik,
                'urutan' => $item->urutan,
                'category' => $categories,
                'jumlah' => 1,
            );
        }
        $data10 =[];
//                return $this->respond($resul);
        foreach ($resul as $res2){
            $i = 0;
            $sama = false;
            foreach ($data10 as $hideung){
                if($res2['category'] ==  $data10[$i]['category'] && $res2['namaindikator'] ==  $data10[$i]['namaindikator']){
                    $sama = 1;
                    $jml = (float)$hideung['jumlah'] + 1;
                    $data10[$i]['jumlah'] = $jml;
                    $data10[$i]['capaian'] = (float) $data10[$i]['capaian'] + (float)$res2['capaian'] ;

                }
                $i = $i +1;
            }
            if($sama == false){
                $data10 [] = array(
                    'namaindikator' => $res2['namaindikator'],
                    'satuan' => $res2['satuan'],
                    'capaian' => (float)$res2['capaian']  ,
                    'tahun' => $res2['tahun'],
                    'target' => $res2['target'],
                    'pic' => $res2['pic'],
                    'warnagrafik' => $res2['warnagrafik'],
                    'urutan' => $res2['urutan'],
                    'category' =>$res2['category'],
                    'jumlah' => 1
                );
            }
        }
        $data11 = [];
        foreach ($data10 as $item){
            $data11 [] = array(
                'namaindikator' => $item['namaindikator'],
                'satuan' => $item['satuan'],
                'capaian' =>number_format(((float) $item['capaian']/ $item['jumlah'] ),0),
                'tahun' => $item['tahun'],
                'target' => $item['target'],
                'pic' => $item['pic'],
                'warnagrafik' => $item['warnagrafik'],
                'urutan' => $item['urutan'],
                'category' =>$item['category'],
            );
        }
//        return $this->respond($data11);
        if(count($data11) > 0){
            foreach ($data11 as $key => $row ) {
                $count[$key] = $row['category'];
            }
            array_multisort($count, SORT_ASC, $data11);
        }
//        return $this->respond($resul);

        $result = array(
            'data' => $data11,
            'jenis' => 'IKT',
            'message' => 'ramdanegie',
        );
        return $this->respond($result);

    }
    public function postKetepatanJamVisite(Request $request){

        DB::beginTransaction();
        try{
            $tahun = Carbon::now()->format('Y');

            $delete = IndikatorRensarDetail::where('indikatorfk',13798)
//                ->where('keterangan','batching')
                ->where('tahun',$tahun)
                ->delete();

            $dataIhHeuh = DB::select(DB::raw("           
                select (z.jam1 + z.jam2 + z.jam3) / z.jumlah as capaian, z.bulan,z.tanggal  from (
                select SUM(CASE When x.jam <='12.00' Then x.jumlah * 100 Else 0 End ) as jam1 ,
                SUM(CASE When x.jam >  '12.00' and  x.jam <  '14.00' Then x.jumlah  * 50 Else 0 End ) as jam2,
                SUM(CASE When x.jam >=  '14.00' Then x.jumlah Else 0 End ) as jam3,sum(x.jumlah) as jumlah,
                x.bulan,x.tanggal
                from (
                select Format(pp.tglpelayanan, 'Month') as bulan , 
                Format(pp.tglpelayanan, 'YYYY-MM') as tanggal,
                Format(pp.tglpelayanan, 'HH24.MI') as jam,
                prd.namaproduk, sum (pp.jumlah) as jumlah
                from pelayananpasien_t as pp
                join produk_m as prd on prd.id = pp.produkfk 
                where prd.id=402509
                and Format(pp.tglpelayanan, 'YYYY')= '$tahun'
                GROUP BY prd.namaproduk,pp.tglpelayanan
                ) as x GROUP BY x.bulan,x.tanggal
                ) as z ORDER BY z.bulan;
                
                "));
//            return $this->respond(number_format ($dataIhHeuh[0]->capaian,2));
//            return $this->respond($dataIhHeuh);
            foreach ( $dataIhHeuh as $item){
                $TP = new IndikatorRensarDetail();
                $TP->kdprofile = 1;
                $TP->norec = $TP->generateNewId();
                $TP->statusenabled=true;
                $TP->bulan = $item->bulan;
                $TP->indikatorfk = 13798;
                $TP->capaian = number_format ($item->capaian,2);
                $TP->tahun = $tahun;
                $TP->tgl =  $item->tanggal.'-01';
                $TP->keterangan = 'batching';
                $TP->save();
            }


            $transStatus = 1;
        } catch (\Exception $e) {
            $transStatus = false;
        }

        if ($transStatus) {
            $transMessage = 'Post IKT Visite';
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
//                'result' => $TP,
                'as' => 'inhuman',
            );
        } else {
            $transMessage = ' ';
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getLaporanLayanan(Request $request)
    {
////        $dataLogin = $request->all();
//        $tglAwal = $request['tglAwal'];
//        $tglAkhir = $request['tglAkhir'];
//        $idDept =  ' ';
//        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
//            $idDept =  ' and ru.objectdepartemenfk =  ' . $request['idDept'];
//        }
//        $idRuangan =  ' ';
//        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
//            $idRuangan = ' and ru.id = ' . $request['idRuangan'];
//        }
//        $idKelompok = ' ';
//        if (isset($request['idKelompok']) && $request['idKelompok'] != "" && $request['idKelompok'] != "undefined") {
//            if ($idKelompok == 135 || $idKelompok == '135'){
//                $idKelompok = 'and pd.objectkelompokpasienlastfk in (1,5,3)';
//            }else{
//                $idKelompok = 'and pd.objectkelompokpasienlastfk = '. $request['idKelompok'];
//            }
//        }
//        $idDokter = ' ';
//        if (isset($request['idDokter']) && $request['idDokter'] != "" && $request['idDokter'] != "undefined") {
//            $idDokter = 'and pg.id  = '. $request['idDokter'];
//        }
//        $tindakan = ' ';
//        if (isset($request['tindakan']) && $request['tindakan'] != "" && $request['tindakan'] != "undefined") {
//            $tindakan = ' and pr.id = ' . $request['tindakan'];
//        }
//        $kelas = ' ';
//        if (isset($request['kelas']) && $request['kelas'] != "" && $request['kelas'] != "undefined") {
//            $kelas = ' and kl.id = ' . $request['kelas'];
//        }
//        $PetugasPe= ' ';
//        if (isset($request['PetugasPe']) && $request['PetugasPe'] != "" && $request['PetugasPe'] != "undefined") {
//            $PetugasPe = ' and ppp.objectjenispetugaspefk =' . $request['PetugasPe'];
//        }
//        if ($request['kondisi'] == ''){
//            $data = \DB::table('pasiendaftar_t as pd')
//                ->leftJOIN ('antrianpasiendiperiksa_t as apd','apd.noregistrasifk','=','pd.norec')
//                ->leftJOIN ('pelayananpasien_t as pp','pp.noregistrasifk','=','apd.norec')
//                ->leftJoin ('pelayananpasienpetugas_t as ppp','ppp.pelayananpasien','=','pp.norec')
//                ->leftJoin ('pegawai_m as pg','pg.id','=','ppp.objectpegawaifk')
//                ->leftJOIN ('produk_m as pr','pr.id','=','pp.produkfk')
//                ->leftJOIN ('detailjenisproduk_m as djp','djp.id','=','pr.objectdetailjenisprodukfk')
//                ->leftJOIN ('pasien_m as ps','ps.id','=','pd.nocmfk')
//                ->leftJOIN ('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
//                ->leftJOIN ('kelas_m as kl','kl.id','=','apd.objectkelasfk')
//                ->leftJOIN ('strukpelayanan_t as sp','sp.noregistrasifk','=','pd.norec')
//                ->leftJOIN ('strukbuktipenerimaan_t as sbm','sbm.norec','=','sp.nosbmlastfk')
//                ->leftjoin ('mapruangantoproduk_m as mrtp',function($join)
//                {
//                    $join->on('mrtp.objectprodukfk','=','pr.id');
//                    $join->on('mrtp.objectruanganfk','=','apd.objectruanganfk');
//                })
//                ->leftjoin ('ruangan_m as ru1','ru1.id','=','mrtp.objectruanganfk')
//                ->leftJOIN ('rekanan_m as rk','rk.id','=','pd.objectrekananfk')
//                ->leftJOIN ('kelompokpasien_m as kps','kps.id','=','pd.objectkelompokpasienlastfk')
//                ->select('pp.norec','pp.tglpelayanan','apd.objectruanganfk','ru.namaruangan','kl.namakelas','pg.id as iddokter','pg.namalengkap',
//                    'pd.noregistrasi', 'ps.nocm','ps.namapasien',
//                    'pr.namaproduk','pp.jumlah','kps.kelompokpasien',
//                    DB::raw('case when ru.objectdepartemenfk in (16,35) then \'Y\' ELSE \'N\' END as inap,
//                           case when rk.namarekanan is not null then rk.namarekanan else \' - \' end as namarekanan,
//                           case when pp.hargajual is not null then pp.hargajual else 0 end as harga,
//                           case when pd.nosbmlastfk is null then \'n\' else \'y\' end as sbm'
//                    ))
////            ->whereNull('sp.statusenabled')
//                ->Where('pg.objectjenispegawaifk','=',1)
//                ->whereNotIn('djp.objectjenisprodukfk', [97,283])
////                ->whereNotIn('djp.id',[58,155,161,167,476,477,149,1435,1440])
//                ->whereNotIn('pr.id',[395])
//                ->where('mrtp.statusenabled','=',true)
////                ->whereNotIn('ru1.objectdepartemenfk',[3,27])
//                ->groupBy( 'pp.norec','pp.tglpelayanan',
//                    'apd.objectruanganfk',
//                    'ru.namaruangan',
//                    'kl.namakelas',
//                    'pg.id',
//                    'pg.namalengkap',
//                    'pd.noregistrasi',
//                    'ps.nocm',
//                    'ps.namapasien',
//                    'pr.namaproduk',
//                    'pp.jumlah',
//                    'kps.kelompokpasien','ru.objectdepartemenfk',
//                    'rk.namarekanan','pp.hargajual',
//                    'pd.nosbmlastfk');
//
//            if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
//                $data = $data->where('pp.tglpelayanan', '>=', $request['tglAwal']);
//            }
//            if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
//                $tgl = $request['tglAkhir'];//." 23:59:59";
//                $data = $data->where('pp.tglpelayanan', '<=', $tgl);
//            }
//            if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
//                $data = $data->where('ru.objectdepartemenfk', '=', $request['idDept']);
//            }
//            if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
//                $data = $data->where('ru.id', '=', $request['idRuangan']);
//            }
//            if (isset($request['idKelompok']) && $request['idKelompok'] != "" && $request['idKelompok'] != "undefined") {
//                if ($request['idKelompok'] == 135 || $request['idKelompok']=='135'){
//                    $data = $data->whereIn('pd.objectkelompokpasienlastfk',[1,5,3]);
//                }else{
//                    $data = $data->where('pd.objectkelompokpasienlastfk', '=', $request['idKelompok']);
//                }
//            }
//            if (isset($request['idDokter']) && $request['idDokter'] != "" && $request['idDokter'] != "undefined") {
//                $data = $data->where('pg.id', '=', $request['idDokter']);
//            }
//            if (isset($request['tindakan']) && $request['tindakan'] != "" && $request['tindakan'] != "undefined") {
//                $data = $data->where('pr.id', '=', $request['tindakan']);
//            }
//            if (isset($request['kelas']) && $request['kelas'] != "" && $request['kelas'] != "undefined") {
//                $data = $data->where('kl.id', '=', $request['kelas']);
//            }
//            if (isset($request['PetugasPe']) && $request['PetugasPe'] != "" && $request['PetugasPe'] != "undefined") {
//                $data = $data->where('ppp.objectjenispetugaspefk', '=', $request['PetugasPe']);
//            }
////            $data = $data->distinct();
//            $data = $data->get();
//
//            $results =array();
//            foreach ($data as $item) {
//                $results[]=array(
//                    'tglpelayanan'=>$item->tglpelayanan,
//                    'nocm'=>$item->nocm,
//                    'noregistrasi'=>$item->noregistrasi,
//                    'namapasien'=>$item->namapasien,
//                    'namakelas'=>$item->namakelas,
//                    'kelompokpasien'=>$item->kelompokpasien,
//                    'rekanan'=>$item->namarekanan,
//                    'inap'=>$item->inap,
//                    'ruangan'=>$item->namaruangan,
//                    'layanan'=>$item->namaproduk,
//                    'tarif'=>$item->harga,
//                    'jumlah'=>$item->jumlah,
//                    'statusbayar'=>$item->sbm,
//                    'iddokter'=>$item->iddokter,
//                    'dokter'=>$item->namalengkap,
//                );
//            }
//        }elseif ($request['kondisi'] == 1){
//
//            $data = DB::select(DB::raw("select pp.norec,pp.tglpelayanan,apd.objectruanganfk,ru.namaruangan,kl.namakelas,pg.id as iddokter,pg.namalengkap,
//                 pd.noregistrasi,ps.nocm,upper(ps.namapasien) as namapasien,case when ru.objectdepartemenfk in (16,35) then 'y' else 'n' end as inap,
//                 pr.namaproduk,pp.jumlah,case when pp.hargajual is not null then pp.hargajual else 0 end as harga,
//                 case when pd.nosbmlastfk is null then 'n' else 'y' end as sbm,sf.jammasuk,
//                 case when rk.namarekanan is not null then rk.namarekanan else ' - ' end as namarekanan,kps.kelompokpasien
//                 from pasiendaftar_t as pd
//                 inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
//                 left join pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
//                 left join pelayananpasienpetugas_t as ppp on ppp.pelayananpasien = pp.norec
//                 left join pegawai_m as pg on pg.id=ppp.objectpegawaifk
//                 inner join produk_m as pr on pr.id=pp.produkfk
//                 inner join detailjenisproduk_m as djp on djp.id=pr.objectdetailjenisprodukfk
//                 inner join pasien_m as ps on ps.id=pd.nocmfk
//                 left join strukpelayanan_t as sp  on sp.noregistrasifk=pd.norec
//                 left join strukbuktipenerimaan_t as sbm  on sbm.norec=sp.nosbmlastfk
//                 left join ruangan_m as ru on ru.id=apd.objectruanganfk
//                 left join kelas_m as kl on kl.id = apd.objectkelasfk
//                 left join mapruangantoproduk_m as mrtp on mrtp.objectprodukfk = pr.id and mrtp.objectruanganfk=apd.objectruanganfk
//                 left join ruangan_m as ru1 on ru1.id = mrtp.objectruanganfk
//                INNER JOIN pegawaijadwalkerja_m as jdw on jdw.objectpegawaifk=ppp.objectpegawaifk
//                INNER JOIN kalender_s as kld on kld.id=jdw.objecttanggalfk
//                INNER JOIN shiftkerja_m as sf on sf.id=jdw.objectshiftfk
//                left join  rekanan_m as rk on rk.id = pd.objectrekananfk
//                left join kelompokpasien_m as kps on kps.id = pd.objectkelompokpasienlastfk
//                where pg.objectjenispegawaifk = 1 and djp.objectjenisprodukfk not in  (97,283)
//                --and ru1.objectdepartemenfk not in (3,27)
//
//                and pr.id not in (395) and mrtp.statusenabled =true
//                and pp.tglpelayanan >= '$tglAwal' and pp.tglpelayanan <= '$tglAkhir'
//                $idDept
//                $idKelompok
//                $idRuangan
//                $idDokter
//                $tindakan
//                $kelas
//                $PetugasPe
//                and (pp.tglpelayanan between  to_timestamp(to_char(kld.tanggal, 'YYYY-MM-DD')  || ' ' || replace(jammasuk,'.',':'),'YYYY-MM-DD HH24:MI')
//                and to_timestamp(to_char(kld.tanggal, 'YYYY-MM-DD')  || ' ' || replace(jampulang,'.',':'),'YYYY-MM-DD HH24:MI') )
//                GROUP BY pp.norec,pp.tglpelayanan,
//                 apd.objectruanganfk,
//                 ru.namaruangan,
//                 kl.namakelas,
//                 pg.id,
//                 pg.namalengkap,
//                 pd.noregistrasi,
//                 ps.nocm,
//                 ps.namapasien,
//                 pr.namaproduk,
//                 pp.jumlah,
//                 kps.kelompokpasien,ru.objectdepartemenfk,
//                rk.namarekanan,pp.hargajual,
//                pd.nosbmlastfk,
//                sf.jammasuk
//                order by pp.tglpelayanan")
//            );
//            $results =array();
//            foreach ($data as $item) {
//                $results[]=array(
//                    'tglpelayanan'=>$item->tglpelayanan,
//                    'nocm'=>$item->nocm,
//                    'noregistrasi'=>$item->noregistrasi,
//                    'namapasien'=>$item->namapasien,
//                    'namakelas'=>$item->namakelas,
//                    'kelompokpasien'=>$item->kelompokpasien,
//                    'rekanan'=>$item->namarekanan,
//                    'inap'=>$item->inap,
//                    'ruangan'=>$item->namaruangan,
//                    'layanan'=>$item->namaproduk,
//                    'tarif'=>$item->harga,
//                    'jumlah'=>$item->jumlah,
//                    'statusbayar'=>$item->sbm,
//                    'iddokter'=>$item->iddokter,
//                    'dokter'=>$item->namalengkap,
//                );
//            }
//        }elseif ($request['kondisi'] == 2){
//
//            $data = DB::select(DB::raw("select pp.norec, pp.tglpelayanan,apd.objectruanganfk,ru.namaruangan,kl.namakelas,pg.id as iddokter,pg.namalengkap,
//                 pd.noregistrasi,ps.nocm,upper(ps.namapasien) as namapasien,case when ru.objectdepartemenfk in (16,35) then 'y' else 'n' end as inap,
//                 pr.namaproduk,pp.jumlah,case when pp.hargajual is not null then pp.hargajual else 0 end as harga,
//                 case when pd.nosbmlastfk is null then 'n' else 'y' end as sbm,sf.jammasuk,
//                  case when rk.namarekanan is not null then rk.namarekanan else ' - ' end as namarekanan,kps.kelompokpasien
//                 from pasiendaftar_t as pd
//                 inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
//                 left join pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
//                 left join pelayananpasienpetugas_t as ppp on ppp.pelayananpasien = pp.norec
//                 left join pegawai_m as pg on pg.id=ppp.objectpegawaifk
//                 inner join produk_m as pr on pr.id=pp.produkfk
//                 inner join detailjenisproduk_m as djp on djp.id=pr.objectdetailjenisprodukfk
//                 inner join pasien_m as ps on ps.id=pd.nocmfk
//                 left join strukpelayanan_t as sp  on sp.noregistrasifk=pd.norec
//                 left join strukbuktipenerimaan_t as sbm  on sbm.norec=sp.nosbmlastfk
//                 left join ruangan_m as ru on ru.id=apd.objectruanganfk
//                 left join kelas_m as kl on kl.id = apd.objectkelasfk
//                 left join mapruangantoproduk_m as mrtp on mrtp.objectprodukfk = pr.id and mrtp.objectruanganfk=apd.objectruanganfk
//                 left join ruangan_m as ru1 on ru1.id = mrtp.objectruanganfk
//                INNER JOIN pegawaijadwalkerja_m as jdw on jdw.objectpegawaifk=ppp.objectpegawaifk
//                INNER JOIN kalender_s as kld on kld.id=jdw.objecttanggalfk
//                INNER JOIN shiftkerja_m as sf on sf.id=jdw.objectshiftfk
//                 left join  rekanan_m as rk on rk.id = pd.objectrekananfk
//                 left join kelompokpasien_m as kps on kps.id = pd.objectkelompokpasienlastfk
//                where pg.objectjenispegawaifk = 1 and djp.objectjenisprodukfk not in (97,283)
//                 --and ru1.objectdepartemenfk not in (3,27)
//
//                and pr.id not in (395) and mrtp.statusenabled =true
//                and pp.tglpelayanan >= '$tglAwal' and pp.tglpelayanan <= '$tglAkhir'
//                $idDept
//                $idKelompok
//                $idRuangan
//                $idDokter
//                $tindakan
//                $kelas
//                $PetugasPe
//                and ((pp.tglpelayanan between  to_timestamp(to_char(kld.tanggal, 'YYYY-MM-DD')  || ' 00:00','YYYY-MM-DD HH24:MI')
//                        and to_timestamp(to_char(kld.tanggal, 'YYYY-MM-DD')  || ' ' || replace(jammasuk,'.',':'),'YYYY-MM-DD HH24:MI')- interval '1' minute  )
//                or (pp.tglpelayanan between  to_timestamp(to_char(kld.tanggal, 'YYYY-MM-DD')  || ' ' || replace(jampulang,'.',':'),'YYYY-MM-DD HH24:MI') + interval '1' minute
//                        and to_timestamp(to_char(kld.tanggal, 'YYYY-MM-DD')  || ' 23:59:59','YYYY-MM-DD HH24:MI') ))
//                GROUP BY pp.norec,pp.tglpelayanan,
//                 apd.objectruanganfk,
//                 ru.namaruangan,
//                 kl.namakelas,
//                 pg.id,
//                 pg.namalengkap,
//                 pd.noregistrasi,
//                 ps.nocm,
//                 ps.namapasien,
//                 pr.namaproduk,
//                 pp.jumlah,
//                 kps.kelompokpasien,ru.objectdepartemenfk,
//                rk.namarekanan,pp.hargajual,
//                pd.nosbmlastfk,
//                sf.jammasuk
//                order by pp.tglpelayanan")
//            );
//            $results =array();
//            foreach ($data as $item) {
//                $results[]=array(
//                    'tglpelayanan'=>$item->tglpelayanan,
//                    'nocm'=>$item->nocm,
//                    'noregistrasi'=>$item->noregistrasi,
//                    'namapasien'=>$item->namapasien,
//                    'namakelas'=>$item->namakelas,
//                    'kelompokpasien'=>$item->kelompokpasien,
//                    'rekanan'=>$item->namarekanan,
//                    'inap'=>$item->inap,
//                    'ruangan'=>$item->namaruangan,
//                    'layanan'=>$item->namaproduk,
//                    'tarif'=>$item->harga,
//                    'jumlah'=>$item->jumlah,
//                    'statusbayar'=>$item->sbm,
//                    'iddokter'=>$item->iddokter,
//                    'dokter'=>$item->namalengkap,
//                );
//            }
//        }
        $tglAwal = date('Y-m-d 00:00');
        $tglAkhir = date('Y-m-d 23:59');
//        $results = DB::select(DB::raw("select x.id,x.namalengkap as dokter, sum(x.jumlah) as count from (
//                select pg.id, pp.norec,pg.namalengkap,pp.jumlah from pelayananpasien_t as pp
//                join pelayananpasienpetugas_t as ppp on ppp.pelayananpasien = pp.norec
//                join pegawai_m as pg on pg.id =ppp.objectpegawaifk
//                where pp.tglpelayanan BETWEEN '$tglAwal'  and '$tglAkhir'
//                and pp.strukresepfk is null
//                and ppp.objectjenispetugaspefk=4
//                ) as x
//                GROUP BY x.namalengkap,x.id"));
        $results = DB::select(DB::raw("
                select pg.id as iddokter,pp.norec,pg.namalengkap as dokter,pp.jumlah as count, pp.hargasatuan as tariff ,
                pr.namaproduk as layanan, pp.hargasatuan * pp.jumlah as totall ,
                ps.nocm,ps.namapasien,pp.tglpelayanan
                from pelayananpasien_t as pp 
                join antrianpasiendiperiksa_t as apd on apd.norec = pp.noregistrasifk
                join pasiendaftar_t as pd on pd.norec = apd.noregistrasifk
                join pasien_m as ps on ps.id = pd.nocmfk
                join pelayananpasienpetugas_t as ppp on ppp.pelayananpasien = pp.norec
                join pegawai_m as pg on pg.id =ppp.objectpegawaifk
                join produk_m as pr on pr.id = pp.produkfk
                where pp.tglpelayanan BETWEEN '$tglAwal'  and '$tglAkhir'
                and pp.strukresepfk is null
                and ppp.objectjenispetugaspefk=4
                "));
        $result = array(
            'data' => $results,
            'message' => 'er@epic',
        );

        return $this->respond($result);
    }
     public function getRegisterSummary(Request $request)
    {
        $data = [];
      $tglAwal =  $request['tgl'].' 00:00'; //Carbon::now()->startOfMonth()->subMonth(1);
        $tglAkhir =  $request['tgl'].' 23:59';
        $ruanganId = $request['ruanganId'];
        $kelompokId = $request['kelompokPasien'];

        $paramRuangan = ' ';
        if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
            $paramRuangan = ' and pd.objectruanganlastfk = ' . $ruanganId;
        }

        $paramKelompok = ' ';
        if (isset($kelompokId) && $kelompokId != "" && $kelompokId != "undefined") {
            $paramKelompok = ' and pd.objectkelompokpasienlastfk = ' . $kelompokId;
        }

        // $deptRawatJalan = $this->settingDataFixed('kdDepartemenRawatJalanFix');
        if($request['tipe'] == 'Ruangan'){
             $data = DB::select(DB::raw("select x.namaruangan,x.kelompokpasien,sum(x.laki)as laki,sum(x.wanita)as wanita,
                    sum(x.baru) as baru,sum(x.lama) as lama ,sum(x.laki + x.wanita) as jml
                     from (SELECT  ru.namaruangan,kp.kelompokpasien,CASE WHEN jk.id = 1 THEN 1 ELSE 0 END AS laki,
                                     CASE WHEN jk.id = 2 THEN 1 ELSE 0 END AS wanita,CASE WHEN pd.statuspasien = 'BARU' THEN 1 ELSE 0 END AS baru,
                                     CASE WHEN pd.statuspasien = 'LAMA' or pd.statuspasien = '' THEN 1 ELSE 0 END AS lama
                                    FROM pasiendaftar_t as pd 
                                    INNER JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
                                    LEFT JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
                                    INNER JOIN pasien_m as ps on ps.id = pd.nocmfk
                                    LEFT JOIN jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk
                                    WHERE pd.tglregistrasi BETWEEN '$tglAwal' AND '$tglAkhir'
                                         and pd.statusenabled=true
                                ) as x
                               GROUP BY x.namaruangan,x.kelompokpasien
                    order by x.namaruangan"
                    )
                );
        }
        if($request['tipe'] == 'Instalasi'){
              $data = DB::select(DB::raw("select x.namaruangan,x.kelompokpasien,sum(x.laki)as laki,sum(x.wanita)as wanita,
                    sum(x.baru) as baru,sum(x.lama) as lama ,sum(x.laki + x.wanita) as jml
                     from (SELECT  dp.namadepartemen as namaruangan,kp.kelompokpasien,CASE WHEN jk.id = 1 THEN 1 ELSE 0 END AS laki,
                                     CASE WHEN jk.id = 2 THEN 1 ELSE 0 END AS wanita,CASE WHEN pd.statuspasien = 'BARU' THEN 1 ELSE 0 END AS baru,
                                     CASE WHEN pd.statuspasien = 'LAMA' or pd.statuspasien = '' THEN 1 ELSE 0 END AS lama
                                    FROM pasiendaftar_t as pd 
                                    INNER JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk
                                    INNER JOIN departemen_m as dp on dp.id = ru.objectdepartemenfk
                                    LEFT JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
                                    INNER JOIN pasien_m as ps on ps.id = pd.nocmfk
                                    LEFT JOIN jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk
                                    WHERE pd.tglregistrasi BETWEEN '$tglAwal' AND '$tglAkhir'
                                         and pd.statusenabled=true
                                ) as x
                               GROUP BY x.namaruangan,x.kelompokpasien
                    order by x.namaruangan"
                    )
                );
        }
       
        return $this->respond($data);
    }
     public function getKunjunganBerdasarkanParameter(Request $request)
    {
        // $tglAwal =  date('Y-m-d'.' 00:00');
        $tglAwal =  $request['tgl'].' 00:00'; //Carbon::now()->startOfMonth()->subMonth(1);
        $tglAkhir =  $request['tgl'].' 23:59';
        if($request['params'] == 'Asal Rujukan'){
            $dataALL = DB::select(DB::raw("select x.name ,count(x.name) as jumlah from (
                select apd.norec, 
                kps.asalrujukan as name, 
                pd.objectasalrujukanfk
                from antrianpasiendiperiksa_t as pd
                inner join pasiendaftar_t as apd on apd.norec =pd.noregistrasifk
                inner join asalrujukan_m as kps on kps.id = pd.objectasalrujukanfk
                -- left join batalregistrasi_t as br on br.pasiendaftarfk=pd.norec
                --left join pemakaianasuransi_t as pa on pa.noregistrasifk=pd.norec
                WHERE apd.tglregistrasi BETWEEN '$tglAwal' AND '$tglAkhir'
                and apd.statusenabled=true
                -- and br.norec is null
                )as  x
                GROUP BY x.name"));

        }
         if($request['params'] == 'Diagnosa'){
             $dataALL = DB::select(DB::raw("select * from (
                select count(x.kddiagnosa)as jumlah,x.kddiagnosa + ' - ' + x.namadiagnosa as name
                from (select dm.kddiagnosa, 
                dm.namadiagnosa
                from antrianpasiendiperiksa_t as app
                left join diagnosapasien_t as dp on dp.noregistrasifk = app.norec
                left join detaildiagnosapasien_t as ddp on ddp.objectdiagnosapasienfk = dp.norec
                inner join diagnosa_m as dm on ddp.objectdiagnosafk = dm.id
                inner join pasiendaftar_t as pd on pd.norec = app.noregistrasifk
                inner join pasien_m as ps on ps.id = pd.nocmfk
                left join ruangan_m as ru on ru.id = pd.objectruanganlastfk
                where dm.kddiagnosa <> '-' and
                                pd.statusenabled=true
                        and
                --ru.objectdepartemenfk in (16, 17, 35, 26) and
                pd.tglregistrasi BETWEEN '$tglAwal' AND '$tglAkhir'
                )as x GROUP BY x.namadiagnosa ,x.kddiagnosa 
                ) as z
                ORDER BY z.jumlah desc"));
         }
          if($request['params'] == 'Tindakan'){
             $dataALL = DB::select(DB::raw("select * from (select count(x.namaproduk) as jumlah,x.namaproduk as name from (
                    select pr.namaproduk,pp.norec from pelayananpasien_t as pp 
                    inner join produk_m as pr on pr.id=pp.produkfk
                    where pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
                    and pp.strukresepfk is null
                    ) as x
                    GROUP BY x.namaproduk
                    ) as z order by z.jumlah desc"));
         }
         if($request['params'] == 'Wilayah'){
             $dataALL = DB::select(DB::raw("select * from (
                    select x.name,count(x.name) as jumlah from (
                    select pd.norec, 
                    kec.namakecamatan as name
                    from pasiendaftar_t as pd
                    inner join pasien_m as ps on ps.id = pd.nocmfk
                    inner join alamat_m as alm on alm.nocmfk= ps.id
                    inner join kecamatan_m as kec on kec.id= alm.objectkecamatanfk
                    WHERE pd.tglregistrasi BETWEEN   '$tglAwal' AND '$tglAkhir'
                    and pd.statusenabled=true
                    )as  x
                    GROUP BY x.name
                    )as z
                    order by z.jumlah desc
                    "));
        }



     
        return $this->respond($dataALL);
    }

 public function getLaporanPemakaianObat (Request $request)
    {
        $tglAwal= Carbon::now()->format('Y-m-d 00:00');
        $tglAkhir =Carbon::now()->format('Y-m-d 23:59');
        $data = DB::select(DB::raw("
            select * from (
                select x.namaproduk ,sum (x.jumlah) as jumlah ,sum(x.total ) as total from (

                select
                prd.namaproduk  , pp.jumlah , (
                ((  CASE WHEN   pp.hargasatuan IS NULL THEN 0 ELSE pp.hargasatuan END 
                - CASE WHEN pp.hargadiscount IS NULL THEN   0 ELSE pp.hargadiscount END     ) * pp.jumlah
                ) + CASE    WHEN    pp.jasa IS NULL THEN 0  ELSE        pp.jasa END) AS total
                from  strukresep_t as sr
                join pelayananpasien_t  as pp  on pp.strukresepfk =sr.norec
                join produk_m as prd on pp.produkfk= prd.id
                where pp.tglpelayanan BETWEEN  '$tglAwal' and '$tglAkhir'
                and pp.strukresepfk is not null

                Union all

                SELECT pr.namaproduk,  (spd.qtyproduk) as jumlah,
                  (((   CASE WHEN   spd.hargasatuan IS NULL THEN 0 ELSE spd.hargasatuan END 
                - CASE WHEN spd.hargadiscount IS NULL THEN  0 ELSE spd.hargadiscount END    ) * spd.qtyproduk
                ) + CASE    WHEN    spd.hargatambahan IS NULL THEN 0    ELSE        spd.hargatambahan END) AS total
                FROM strukpelayanan_t as sp  
                JOIN strukpelayanandetail_t as spd on spd.nostrukfk = sp.norec  
                join produk_m as pr  on pr.id =spd.objectprodukfk
                WHERE sp.tglstruk BETWEEN   '$tglAwal' and '$tglAkhir'
                AND sp.nostruk_intern='-' AND substring(sp.nostruk,1,2)='OB'  
                and sp.statusenabled != 0
                Union ALL

                SELECT pr.namaproduk, (spd.qtyproduk) as jumlah,
                  (((   CASE WHEN   spd.hargasatuan IS NULL THEN 0 ELSE spd.hargasatuan END 
                - CASE WHEN spd.hargadiscount IS NULL THEN  0 ELSE spd.hargadiscount END    ) * spd.qtyproduk
                ) + CASE    WHEN    spd.hargatambahan IS NULL THEN 0    ELSE        spd.hargatambahan END) AS total
                FROM strukpelayanan_t as sp  
                JOIN strukpelayanandetail_t as spd on spd.nostrukfk = sp.norec  
                join produk_m as pr  on pr.id =spd.objectprodukfk
                WHERE sp.tglstruk BETWEEN   '$tglAwal' and '$tglAkhir'
                AND sp.nostruk_intern not in ('-') AND substring(sp.nostruk,1,2)='OB'  
                and sp.statusenabled != 0
                ) as x
                group by x.namaproduk
            )  as z order by z.total desc")
        );

        $result = array(
            'data' => $data,
            'message' => 'er@epic',
        );
        return $this->respond($result);
    }
     public function getDaftarPenerimaanSuplier(Request $request){
        $dataLogin = $request->all();
        $data = \DB::table('strukpelayanan_t as sp')
            ->JOIN('strukpelayanandetail_t as spd', 'spd.nostrukfk', '=', 'sp.norec')
            ->leftJOIN('rekanan_m as rkn', 'rkn.id', '=', 'sp.objectrekananfk')
            ->LEFTJOIN('pegawai_m as pg', 'pg.id', '=', 'sp.objectpegawaipenerimafk')
            ->LEFTJOIN('ruangan_m as ru', 'ru.id', '=', 'sp.objectruanganfk')
            ->LEFTJOIN('strukbuktipengeluaran_t as sbk', 'sbk.norec', '=', 'sp.nosbklastfk')
//            ->LEFTJOIN('produk_m as pr','pr.id','=','spd.objectprodukfk')
//            ->LEFTJOIN('jeniskemasan_m as jkm','jkm.id','=','spd.objectjeniskemasanfk')
            ->select('sp.tglstruk', 'sp.nostruk', 'rkn.namarekanan', 'pg.namalengkap', 'sp.nokontrak',
                'ru.namaruangan', 'sp.norec', 'sp.nofaktur', 'sp.tglfaktur', 'sp.totalharusdibayar', 'sbk.nosbk',
                'sp.nosppb', 'sp.noorderfk', 'sp.qtyproduk'
//                'spd.hargasatuan','spd.hargadiscount','spd.qtyproduk','spd.hargatambahan' ,
//                'pr.namaproduk as namaprodukstandar',
//                'spd.resepke as rke','jkm.jeniskemasan'
            )
            ->groupBy('sp.tglstruk', 'sp.nostruk', 'rkn.namarekanan', 'pg.namalengkap', 'sp.nokontrak', 'ru.namaruangan', 'sp.norec', 'sp.nofaktur',
                'sp.tglfaktur', 'sp.totalharusdibayar', 'sbk.nosbk', 'sp.nosppb', 'sp.noorderfk', 'sp.qtyproduk');

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('sp.tglstruk', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];
            $data = $data->where('sp.tglstruk', '<=', $tgl);
        }
        if (isset($request['nostruk']) && $request['nostruk'] != "" && $request['nostruk'] != "undefined") {
            $data = $data->where('sp.nostruk', 'like', '%' . $request['nostruk']);
        }
        if (isset($request['namarekanan']) && $request['namarekanan'] != "" && $request['namarekanan'] != "undefined") {
            $data = $data->where('rkn.namarekanan', 'like', '%' . $request['namarekanan'] . '%');
        }
        if (isset($request['nofaktur']) && $request['nofaktur'] != "" && $request['nofaktur'] != "undefined") {
            $data = $data->where('sp.nofaktur', 'like', '%' . $request['nofaktur'] . '%');
        }
        if (isset($request['produkfk']) && $request['produkfk'] != "" && $request['produkfk'] != "undefined") {
            $data = $data->where('spd.objectprodukfk', '=', $request['produkfk']);
        }
        if (isset($request['noSppb']) && $request['noSppb'] != "" && $request['noSppb'] != "undefined") {
            $data = $data->where('sp.nosppb', 'like', '%' . $request['noSppb'] . '%');
        }
//        $data = $data->distinct();
        $data = $data->where('sp.statusenabled', true);
        $data = $data->where('sp.objectkelompoktransaksifk', 35);
        $data = $data->orderBy('sp.nostruk');
        $data = $data->get();

        foreach ($data as $item) {
            $details = \DB::select(DB::raw("select  pr.namaproduk,ss.satuanstandar,spd.qtyproduk,spd.qtyprodukretur,spd.hargasatuan,spd.hargadiscount,
                    --spd.hargappn,((spd.hargasatuan-spd.hargadiscount+spd.hargappn)*spd.qtyproduk) as total,spd.tglkadaluarsa,spd.nobatch
                    spd.hargappn,((spd.hargasatuan * spd.qtyproduk)-spd.hargadiscount+spd.hargappn) as total,spd.tglkadaluarsa,spd.nobatch
                    from strukpelayanandetail_t as spd 
                    left JOIN produk_m as pr on pr.id=spd.objectprodukfk
                    left JOIN satuanstandar_m as ss on ss.id=spd.objectsatuanstandarfk
                    where nostrukfk=:norec"),
                array(
                    'norec' => $item->norec,
                )
            );
            $result[] = array(
                'tglstruk' => $item->tglstruk,
                'nostruk' => $item->nostruk,
                'nofaktur' => $item->nofaktur,
                'tglfaktur' => $item->tglfaktur,
                'namarekanan' => $item->namarekanan,
                'norec' => $item->norec,
                'namaruangan' => $item->namaruangan,
                'namapenerima' => $item->namalengkap,
                'totalharusdibayar' => $item->totalharusdibayar,
                'nosbk' => $item->nosbk,
                'nosppb' => $item->nosppb,
                'nokontrak' => $item->nokontrak,
                'noorderfk' => $item->noorderfk,
                'jmlitem' => $item->qtyproduk,
                'details' => $details,
            );
        }
        if (count($data) == 0) {
            $result = [];
        }

        $result = array(
            'daftar' => $result,
            'datalogin' => $dataLogin,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
      public function getDaftarDistribusiBarangPerUnit(Request $request) {
        $kdSirs1 = $request['KdSirs1'];
        $kdSirs2= $request['KdSirs2'];
        // $dataLogin = $request->all();
        // $dataPegawaiUser = \DB::select(DB::raw("select pg.id,pg.namalengkap from loginuser_s as lu
        //         INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id
        //         where lu.id=:idLoginUser"),
        //     array(
        //         'idLoginUser' => $request['userData']['id'],
        //     )
        // );
        // $dataRuangan = \DB::table('maploginusertoruangan_s as mlu')
        //     ->JOIN('ruangan_m as ru','ru.id','=','mlu.objectruanganfk')
        //     ->select('ru.id')
        //     ->where('mlu.objectloginuserfk',$dataLogin['userData']['id'])
            // ->get();
//        $strRuangan = [];

        $data = \DB::table('strukkirim_t as sp')
            ->LEFTJOIN('pegawai_m as pg','pg.id','=','sp.objectpegawaipengirimfk')
            ->LEFTJOIN('ruangan_m as ru','ru.id','=','sp.objectruanganasalfk')
            ->LEFTJOIN('ruangan_m as ru2','ru2.id','=','sp.objectruangantujuanfk')
            ->LEFTJOIN ('kirimproduk_t as kp','kp.nokirimfk','=','sp.norec')
            ->LEFTJOIN ('produk_m as pr','pr.id','=','kp.objectprodukfk')
            ->LEFTJOIN ('detailjenisproduk_m as djp','djp.id','=','pr.objectdetailjenisprodukfk')
            ->LEFTJOIN ('jenisproduk_m as jp','jp.id','=','djp.objectjenisprodukfk')
            ->LEFTJOIN ('kelompokproduk_m as kps','kps.id','=','jp.objectkelompokprodukfk')
            ->LEFTJOIN ('asalproduk_m as ap','ap.id','=','kp.objectasalprodukfk')
            ->LEFTJOIN ('satuanstandar_m as ss','ss.id','=','kp.objectsatuanstandarfk')
            ->select(
                DB::raw('sp.norec,pr.id as kodebarang,pr.kdproduk as kdsirs,pr.namaproduk,sp.nokirim,sp.jenispermintaanfk,sp.tglkirim,ss.satuanstandar,
                         kp.qtyproduk,kp.hargasatuan,ru.namaruangan as ruanganasal,ru2.namaruangan as ruangantujuan,(kp.qtyproduk*kp.hargasatuan) as total,
                         pr.objectdetailjenisprodukfk,djp.detailjenisproduk,djp.objectjenisprodukfk,jp.jenisproduk,jp.jenisproduk,jp.objectkelompokprodukfk,
                         kps.kelompokproduk,kp.objectasalprodukfk,ap.asalproduk')
            );

        if(isset($request['tglAwal']) && $request['tglAwal']!="" && $request['tglAwal']!="undefined"){
            $data = $data->where('sp.tglkirim','>=', $request['tglAwal']);
        }
        if(isset($request['tglAkhir']) && $request['tglAkhir']!="" && $request['tglAkhir']!="undefined"){
            $tgl= $request['tglAkhir'];
            $data = $data->where('sp.tglkirim','<=', $tgl);
        }
        if(isset($request['nokirim']) && $request['nokirim']!="" && $request['nokirim']!="undefined"){
            $data = $data->where('sp.nokirim','like','%'. $request['nokirim']);
        }
        if(isset($request['ruanganasalfk']) && $request['ruanganasalfk']!="" && $request['ruanganasalfk']!="undefined"){
            $data = $data->where('ru.id','=', $request['ruanganasalfk']);
        }
        if(isset($request['ruangantujuanfk']) && $request['ruangantujuanfk']!="" && $request['ruangantujuanfk']!="undefined"){
            $data = $data->where('ru2.id','=', $request['ruangantujuanfk']);
        }
        if(isset($request['namaproduk']) && $request['namaproduk']!="" && $request['namaproduk']!="undefined"){
            $data = $data->where('pr.namaproduk','like','%'. $request['namaproduk']);
        }

        if(isset($request['jenisProduk']) && $request['jenisProduk']!="" && $request['jenisProduk']!="undefined"){
            $data = $data->where('djp.objectjenisprodukfk','=', $request['jenisProduk']);
        }
        if(isset($request['AsalProduk']) && $request['AsalProduk']!="" && $request['AsalProduk']!="undefined"){
            $data = $data->where('kp.objectasalprodukfk','=',$request['AsalProduk']);
        }
        if(isset($request['kelompokProduk']) && $request['kelompokProduk']!="" && $request['kelompokProduk']!="undefined"){
            $data = $data->where('jp.objectkelompokprodukfk','=',$request['kelompokProduk']);
        }
        if(isset( $request['KdSirs1'])&&  $request['KdSirs1']!=''){
            if($request['KdSirs2'] != null &&  $request['KdSirs2']!='' && $request['KdSirs1'] != null &&  $request['KdSirs1']!= ''){
                $data = $data->whereRaw (" (pr.kdproduk BETWEEN '".$request['KdSirs1']."' and '".$request['KdSirs2']."') ");
            }elseif ($request['KdSirs2'] &&  $request['KdSirs2']!= '' && $request['KdSirs1'] == '' ||  $request['KdSirs1'] == null){
                $data = $data->whereRaw = (" pr.kdproduk like '".$request['KdSirs2']."%'");
            }elseif ($request['KdSirs1'] &&  $request['KdSirs1']!= '' && $request['KdSirs2'] == '' ||  $request['KdSirs2'] == null){
                $data = $data->whereRaw = (" pr.kdproduk like '".$request['KdSirs1']."%'");
            }
        }

        $data = $data->where('sp.statusenabled',true);
        $data = $data->where('sp.objectkelompoktransaksifk',34);
        $data = $data->where('kp.qtyproduk','>', 0);
        $data = $data->orderBy('sp.nokirim');
        $data = $data->get();
        $result = array(
//            'datalogin' => $dataLogin,
            'data' => $data,
            'message' => 'Cepot'
        );
        return $this->respond($result);
    }
   public function getComboAddressEIS(Request $request)
    {
        $kebangsaan = DB::table('kebangsaan_m')
            ->select(DB::raw("id, UPPER(name) as name"))
            ->where('statusenabled',true)
            ->get();

        $negara = DB::table('negara_m')
            ->select(DB::raw("id, UPPER(namanegara) as namanegara"))
            ->where('statusenabled',true)
            ->orderBy('namanegara')
            ->get();

        $kotakabupaten = DB::table('kotakabupaten_m')
            ->select(DB::raw("id, UPPER(namakotakabupaten) as namakotakabupaten"))
            ->where('statusenabled',true)
            ->orderBy('namakotakabupaten')
            ->get();

        $propinsi = DB::table('propinsi_m')
            ->select(DB::raw("id, UPPER(namapropinsi) as namapropinsi"))
            ->where('statusenabled',true)
            ->orderBy('namapropinsi')
            ->get();

        $kecamatan = DB::table('kecamatan_m')
            ->select(DB::raw("id, UPPER(namakecamatan) as namakecamatan"))
            ->where('statusenabled',true)
            ->orderBy('namakecamatan')
            ->get();
        $result = array(
            'kebangsaan' => $kebangsaan,
            'negara' => $negara,
            'kotakabupaten' => $kotakabupaten,
            'propinsi' => $propinsi,
            'kecamatan' => $kecamatan,
            'message' => 'inhuman',
        );

        return $this->respond($result);
    }
    public function getPropinsi(Request $request)
    {
        $propinsi = DB::table('propinsi_m')
            ->select(DB::raw("id, UPPER(namapropinsi) as namapropinsi"))
            ->where('statusenabled',true)
            ->where('namapropinsi','like','%'.$request['params'].'%')
            ->orderBy('namapropinsi')
            ->get();
         

        return $this->respond($propinsi);
    }
    public function getKecamatan(Request $request)
    {
        $propinsi = DB::table('kecamatan_m')
            ->select(DB::raw("id, UPPER(namakecamatan) as namakecamatan"))
            ->where('statusenabled',true)
            ->where('namakecamatan','like','%'.$request['params'].'%')
            ->orderBy('namakecamatan')
            ->get();
         

        return $this->respond($propinsi);
    }
    public function getKota(Request $request)
    {
        $propinsi = DB::table('kotakabupaten_m')
            ->select(DB::raw("id, UPPER(namakotakabupaten) as namakotakabupaten"))
            ->where('statusenabled',true)
            ->where('namakotakabupaten','like','%'.$request['params'].'%')
            ->orderBy('namakotakabupaten')
            ->get();
         

        return $this->respond($propinsi);
    }
    public function getInfoAbsen(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAwal = date('Y-m-d 00:00');
        $tgAkhir = date('Y-m-d 23:59');
        $data = \DB::table('pegawai_m as pg')
        ->Join('sdm_absensipegawai_t as abn', 'abn.pegawaifk', '=', 'pg.id')
        ->select(\DB::raw("abn.pegawaifk,pg.namalengkap,to_char( abn.jammasuk,'dd-MM-yyyy') as tglabsen , to_char(abn.jammasuk,'HH:mm') as jammasuk, to_char(abn.jamkeluar,'HH:mm')  as jamkeluar,'-' as namaruangan"))
        ->where('pg.kdprofile', $idProfile)
            ->where('pg.statusenabled', true)
            ->where('abn.statusenabled', true);

        //        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
        $data = $data->where('abn.jammasuk', '>=', $tglAwal);
        //        }

        //        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
        //            $tgl = $request['tglAkhir'];//." 23:59:59";
        $data = $data->where('abn.jammasuk', '<=', $tgAkhir);
        //        }

        if (isset($request['idPegawai']) && $request['idPegawai'] != "" && $request['idPegawai'] != "undefined") {
            $data = $data->where('pg.id', '=', $request['idPegawai']);
        }
        if (isset($request['norec']) && $request['norec'] != "" && $request['norec'] != "undefined") {
            $data = $data->where('abn.norec', '=', $request['norec']);
        }

        $data = $data->orderBy('pg.namalengkap');
        $data = $data->get();
        $result = array(
            'data'  => $data,
            'as' => 'ea@epic',
        );
        return $this->respond($data);
    }

    public function getKelompokTransaksi(Request $request)
    {
        //$indikator = KelompokTransaksi::where('statusenabled',1)->get();
        $indikator = DB::table('kelompoktransaksi_m as kt')
            ->leftjoin('mapbkutokelompoktransaksi_m as mt','mt.kelompoktransaksifk','=','kt.id')
            ->leftjoin('bku_m as bk','bk.id','=','mt.idbku')
            ->select('kt.*','mt.idbku','bk.bku')
            ->where('kt.statusenabled',1)->get();
        $result = array(
            'data' => $indikator,
            'message' => 'khris@epic',
        );
        return $this->respond($result);

    }

    public function saveKelompokTransaksi(Request $request){
        DB::beginTransaction();
        try{
            if ($request['id'] == ''){
                $TP = new KelompokTransaksi();
                $idMax = KelompokTransaksi::max('id');
                $newId = $idMax + 1;
                $TP->kdprofile = 1;
                $TP->id =  $newId;
                $TP->norec = $TP->generateNewId();
                $TP->kodeexternal = $newId ;
                $TP->kdkelompoktransaksi = $newId ;
                $TP->qkelompoktransaksi = $newId ;
            }else{
                $TP = KelompokTransaksi::where('id', $request['id'])->first();
            }
            $TP->statusenabled = $request['statusenabled'];

            $TP->namaexternal = $request['kelompoktransaksi'];
            $TP->reportdisplay = $request['kelompoktransaksi'];
            $TP->kelompoktransaksi = $request['kelompoktransaksi'];
            $TP->save();

            $transStatus = 1;
        } catch (\Exception $e) {
            $transStatus = false;
        }

        if ($transStatus) {
            $transMessage = 'Sukses';
            DB::commit();
            $result = array(
                'status' => 201,
                'result' => $TP,
                'as' => 'khris@epic',
            );
        } else {
            $transMessage = 'Simpan Gagal';
            DB::rollBack();
            $result = array(
                'status' => 400,
                'as' => 'khris@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }


    //ash
    public function saveKelompokTransaksiNew(Request $request){
        DB::beginTransaction();
        try{
            $tempedit=0;
            if ($request['id'] == ''){
                $TP = new KelompokTransaksi();
                $idMax = KelompokTransaksi::max('id');
                $newId = $idMax + 1;
                $TP->kdprofile = 1;
                $TP->id = $newId;
                $TP->norec = $TP->generateNewId();
                $TP->kodeexternal = $newId ;
                $TP->kdkelompoktransaksi = $newId ;
                $TP->qkelompoktransaksi = $newId ;
            }else{
                $TP = KelompokTransaksi::where('id', $request['id'])->first();
                $tempedit=1;
            }
            $TP->statusenabled = true;
            $TP->namaexternal = $request['kelompoktransaksi'];
            $TP->reportdisplay = $request['kelompoktransaksi'];
            $TP->kelompoktransaksi = $request['kelompoktransaksi'];
            $TP->save();

            $transStatus = 1;

            
            //------
            if($tempedit==0) {
                $MTP = new MapBKUtoKelompokTransaksi();
                $idMax = MapBKUtoKelompokTransaksi::max('id'); 
                $newIdm = $idMax + 1;
                $MTP->kdprofile = 12;
                $MTP->id =  $newIdm;
                $MTP->norec = $MTP->generateNewId();
                $MTP->statusenabled = true; 
                $MTP->kelompoktransaksifk = $newId;
                $MTP->idbku = $request['bku']; 
            } else {                
                $MTP = MapBKUtoKelompokTransaksi::where('kelompoktransaksifk', $request['id'])->first();
                $MTP->idbku = $request['bku']; 
            }
            $MTP->save();


        } catch (\Exception $e) {
            $transStatus = false;
        }

        if ($transStatus) {
            $transMessage = 'Sukses';
            DB::commit();
            $result = array(
                'status' => 201,
                'result' => $TP,
                'as' => 'khris@epic',
            );
        } else {
            $transMessage = 'Simpan Gagal';
            DB::rollBack();
            $result = array(
                'status' => 400,
                'as' => 'khris@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }





    public function getKepatuhanCuciTangan(Request $req)
    {
        $bulan = '';
        if(isset($req['bulan']) && $req['bulan']!=''){
            $bulan ="  AND format(kh.tanggal,'yyyy-MM') = '".$req['bulan']."'";
        }
        $tglAwal = '';
        if(isset($req['tglAwal']) && $req['tglAwal']!=''){
            $tglAwal ="  AND kh.tanggal >= '".$req['tglAwal']."'";
        }
        $tglAkhir = '';
        if(isset($req['tglAkhir']) && $req['tglAkhir']!=''){
            $tglAkhir ="  AND kh.tanggal <= '".$req['tglAkhir']."'";
        }
        $data = DB::select(DB::raw("select upper(x.namaruangan) as namaruangan,  
            sum(x.presentase) / case when count(x.namaruangan) =0 then 1 else count(x.namaruangan)  end  as total 
            from (SELECT kh.tanggal,kh.objectruanganfk,ru.namaruangan,
            pg.namalengkap,kh.langkah,kh.kesempatan,
            case when langkah = 0 then 0 
            when langkah = 1 then 50
            when langkah = 2 then 100
            end as presentase
            FROM kepatuhanhandhygiene_t AS kh
            LEFT JOIN ruangan_m AS ru ON ru.id = kh.objectruanganfk
            LEFT JOIN pegawai_m AS pg ON pg.id = kh.objectpegawaifk
            LEFT JOIN jenispegawai_m AS jp ON jp.id = kh.objectjenispegawaifk
            WHERE
            kh.statusenabled=true
            $bulan
            $tglAwal
            $tglAkhir
            ) as x
            group by x.namaruangan
            order by  x.namaruangan"));

        return $this->respond($data);

        
    }
    public function getDetailPendapatan(Request $r)
    {

           $data =DB::select(DB::raw("
        

SELECT
    x.namapasien,
    x.nocm,
    x.noregistrasi,
    x.tglpencarian,
    x.namaruangan,
    x.namadepartemen,
    x.kelompokpasien,
    SUM (x.total) AS total,
    x.layanan
FROM
    (
        SELECT
            pm.namapasien,
            pm.nocm,
            pd.noregistrasi,
            Format (
                pp.tglpelayanan,
                'yyyy-MM-dd'
            ) AS tglpencarian,
            ru.namaruangan,
            dpm.namadepartemen,
            kps.kelompokpasien,
            SUM (
                (
                    (
                        CASE
                        WHEN pp.hargajual IS NULL THEN
                            0
                        ELSE
                            pp.hargajual
                        END - CASE
                        WHEN pp.hargadiscount IS NULL THEN
                            0
                        ELSE
                            pp.hargadiscount
                        END
                    ) * pp.jumlah
                ) + CASE
                WHEN pp.jasa IS NULL THEN
                    0
                ELSE
                    pp.jasa
                END
            ) AS total,
            'Layanan' AS layanan
        FROM
            pelayananpasien_t AS pp
        JOIN antrianpasiendiperiksa_t AS apd ON apd.norec = pp.noregistrasifk
        JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk
        JOIN pasien_m AS pm ON pm.id = pd.nocmfk
        JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
        LEFT JOIN kelompokpasien_m AS kps ON kps.id = pd.objectkelompokpasienlastfk
        LEFT JOIN departemen_m AS dpm ON dpm.id = ru.objectdepartemenfk
        WHERE
            pp.tglpelayanan BETWEEN '$r[tglawal]'
        AND '$r[tglakhir]'
            and ru.namaruangan='$r[ruangan]'
        AND pp.aturanpakai IS NULL
        AND pd.statusenabled=true
        GROUP BY
            pm.namapasien,
            pm.nocm,
            pd.noregistrasi,
            ru.namaruangan,
            dpm.namadepartemen,
            kps.kelompokpasien,
            pp.tglpelayanan
        UNION ALL
            SELECT
                sp.namapasien_klien AS namapasien,
                sp.nostruk_intern AS nocm,
                '-' AS noregistrasi,
                Format (
                    sp.tglstruk,
                    'yyyy-MM-dd'
                ) AS tglpencarian,
                ru.namaruangan,
                dp.namadepartemen,
                'Umum/Pribadi' AS kelompokpasien,
                SUM (
                    spd.qtyproduk * (
                        spd.hargasatuan - CASE
                        WHEN spd.hargadiscount IS NULL THEN
                            0
                        ELSE
                            spd.hargadiscount
                        END
                    ) + CASE
                    WHEN spd.hargatambahan IS NULL THEN
                        0
                    ELSE
                        spd.hargatambahan
                    END
                ) AS total,
                'Non Layanan' AS layanan
            FROM
                strukpelayanan_t AS sp
            JOIN strukpelayanandetail_t AS spd ON spd.nostrukfk = sp.norec
            LEFT JOIN ruangan_m AS ru ON ru.id = sp.objectruanganfk
            LEFT JOIN departemen_m AS dp ON dp.id = ru.objectdepartemenfk
            WHERE
                sp.tglstruk BETWEEN '$r[tglawal]'
        AND '$r[tglakhir]'
            and ru.namaruangan='$r[ruangan]'
            AND SUBSTRING (sp.nostruk, 1, 2) = 'OB'
            AND sp.statusenabled <> 0
            GROUP BY
                sp.namapasien_klien,
                sp.nostruk_intern,
                sp.tglstruk,
                ru.namaruangan,
                dp.namadepartemen
            UNION ALL
                SELECT
                    pm.namapasien,
                    pm.nocm,
                    pd.noregistrasi,
                    Format (
                        pp.tglpelayanan,
                        'yyyy-MM-dd'
                    ) AS tglpencarian,
                    ru.namaruangan,
                    dpm.namadepartemen,
                    kps.kelompokpasien,
                    SUM (
                        (
                            (
                                CASE
                                WHEN pp.hargajual IS NULL THEN
                                    0
                                ELSE
                                    pp.hargajual
                                END - CASE
                                WHEN pp.hargadiscount IS NULL THEN
                                    0
                                ELSE
                                    pp.hargadiscount
                                END
                            ) * pp.jumlah
                        ) + CASE
                        WHEN pp.jasa IS NULL THEN
                            0
                        ELSE
                            pp.jasa
                        END
                    ) AS total,
                    'Layanan' AS layanan
                FROM
                    pelayananpasien_t AS pp
                JOIN antrianpasiendiperiksa_t AS apd ON apd.norec = pp.noregistrasifk
                JOIN strukresep_t AS sr ON sr.norec = pp.strukresepfk
                JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk
                JOIN pasien_m AS pm ON pm.id = pd.nocmfk
                JOIN ruangan_m AS ru ON ru.id = sr.ruanganfk
                LEFT JOIN kelompokpasien_m AS kps ON kps.id = pd.objectkelompokpasienlastfk
                LEFT JOIN departemen_m AS dpm ON dpm.id = ru.objectdepartemenfk
                WHERE
                    pp.tglpelayanan BETWEEN'$r[tglawal]'
        AND '$r[tglakhir]'
            and ru.namaruangan='$r[ruangan]'
                AND pp.aturanpakai IS NOT NULL
                AND pd.statusenabled=true
                GROUP BY
                    pm.namapasien,
                    pm.nocm,
                    pd.noregistrasi,
                    ru.namaruangan,
                    dpm.namadepartemen,
                    kps.kelompokpasien,
                    pp.tglpelayanan
    ) AS x
GROUP BY
    x.namapasien,
    x.nocm,
    x.noregistrasi,
    x.tglpencarian,
    x.kelompokpasien,
    x.namaruangan,
    x.namadepartemen,
    x.layanan

                

           "));



        $result = array(
            'data' => $data,

            'message' => 'ramdanegie',
        );
        return $this->respond($result);

        
    }
    public function getTrendLaundry(Request $request){
        $tglAwal = Carbon::now()->startOfYear()->format('Y-m-d 00:00:00'); //  $request['tglAwal'];
//        return $tglAwal;
        $tglAkhir = Carbon::now()->format('Y-m-d 23:59:59');//  $request['tglAkhir'];

        $listBulan  =['Jan' ,'Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Des'];
        $i = 0;
        $data10 = [];
        foreach ($listBulan as $b){
            $data10 [] =array(
                'tanggal' => $listBulan[$i],
                'masuk' => 0,
                'keluar' => 0
            );
            $i++;
        }
//        return $data10;
        $data = DB::select(DB::raw("
                   select z.bulan,sum(z.masuk) as masuk,sum(z.keluar) as keluar from (
                    select x.bulan2, x.bulan,sum(x.qtyproduk) as masuk ,0 as keluar from (
                    select sk.tglkirim,
                    Format (sk.tglkirim, 'MMM') AS bulan,Format (sk.tglkirim, 'MM') AS bulan2,
                    sk.nokirim, pr.id as kdproduk, pr.namaproduk,
                    ss.satuanstandar,spd.qtyproduk,spd.qtyprodukretur,
                    CASE
                    WHEN spd.isinfeksius = 0 THEN 'Infeksius'
                    WHEN spd.isinfeksius = 1 THEN 'Non Infeksius'
                    ELSE ''
                    END AS isinfeksius, spd.berat,
                      'penerimaan' as keterangan
                    from kirimproduk_t as spd 
                    left JOIN produk_m as pr on pr.id=spd.objectprodukfk
                    left join strukkirim_t as sk on sk.norec=spd.nokirimfk
                    left JOIN satuanstandar_m as ss on ss.id=spd.objectsatuanstandarfk
                    where  spd.qtyproduk > 0
                    and sk.objectkelompoktransaksifk=119
                    and sk.statusenabled=true
                    and sk.tglkirim BETWEEN '$tglAwal' and '$tglAkhir'
                    ) as x group by x.bulan,x.bulan2
                    union ALL
                    
                    select x.bulan2,x.bulan,0 as masuk, sum(x.qtyproduk) as keluar from (
                    select sk.tglkirim,
                     Format (sk.tglkirim, 'MMM') AS bulan, Format (sk.tglkirim, 'MM') AS bulan2,
                    sk.nokirim, pr.id as kdproduk, pr.namaproduk,
                    ss.satuanstandar,spd.qtyproduk,spd.qtyprodukretur,
                    CASE
                    WHEN spd.isinfeksius = 0 THEN 'Infeksius'
                    WHEN spd.isinfeksius = 1 THEN 'Non Infeksius'
                    ELSE ''
                    END AS isinfeksius, spd.berat,
                      'distribusi' as keterangan
                    from kirimproduk_t as spd 
                    left JOIN produk_m as pr on pr.id=spd.objectprodukfk
                    left join strukkirim_t as sk on sk.norec=spd.nokirimfk
                    left JOIN satuanstandar_m as ss on ss.id=spd.objectsatuanstandarfk
                    where  spd.qtyproduk > 0
                    and sk.objectkelompoktransaksifk=120
                    and sk.statusenabled=true
                    and sk.tglkirim BETWEEN '$tglAwal' and '$tglAkhir'
                    
                    ) as x group by x.bulan,x.bulan2
                    ) as z group BY z.bulan,z.bulan2
                    order by z.bulan2
        "));
        if(count($data) > 0) {
            $i=0;
            foreach ($data10 as $da) {
                foreach ($data as $d) {
                    if ($data10[$i]['tanggal'] == $d->bulan) {
                        $data10[$i]['masuk'] = (float)$d->masuk;
                        $data10[$i]['keluar'] = (float)$d->keluar;
                    }
                }
                $i++;
            }
        }
        return $this->respond($data10);

    }

    public function getTrendBackOff(Request $request)
    {
        $kelTran ='';
        if($request['jenis'] =='sanitasi'){
            $kelTran =121;
        }
        if($request['jenis'] =='ipsrs'){
            $kelTran =122;
        }
        if($request['jenis'] =='it'){
            $kelTran =151;
        }

        $tglAwal = Carbon::now()->startOfYear()->format('Y-m-d 00:00:00'); //  $request['tglAwal'];
//        return $tglAwal;
        $tglAkhir = Carbon::now()->format('Y-m-d 23:59:59');//  $request['tglAkhir'];

        $listBulan  =['Jan' ,'Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Des'];
        $i = 0;
        $data10 = [];
        foreach ($listBulan as $b){
            $data10 [] =array(
                'tanggal' => $listBulan[$i],
                'masuk' => 0,
                'keluar' => 0
            );
            $i++;
        }
//        return $data10;
        $data = DB::select(DB::raw("
                    select z.bulan,sum(z.orderr) as orderr,sum(z.responds) as responds from (
                    select x.bulan2, x.bulan,count(x.norec) as orderr ,0 as responds from (
                    SELECT  Format (stp.tglplanning, 'MMM') AS bulan,Format (stp.tglplanning, 'MM') AS bulan2,
                    case when stp.startdate is null then 0 else (datediff(minute, stp.tglplanning, stp.startdate)) end as respond,
                    stp.norec, rg.namaruangan, stp.tglplanning, stp.startdate, 
                    stp.duedate, stp.rincianexecuteplanning_askep, stp.pelapor, stp.deskripsiplanning, 
                    stp.keteranganverifikasi,stp.signdate, 
                    stp.worklist
                    FROM strukplanning_t as stp
                    INNER JOIN ruangan_m as rg on rg.id = stp.objectruanganfk
                    WHERE stp.objectkelompoktransaksifk=$kelTran
                    AND stp.statusenabled=true
                    AND stp.tglplanning BETWEEN '$tglAwal' AND '$tglAkhir'
                    )  as x
                     group by x.bulan,x.bulan2
                    
                    union all 
                    
                    select x.bulan2, x.bulan,0 as orderr ,sum(x.respond) / count(x.norec)  as responds from (
                    SELECT  Format (stp.tglplanning, 'MMM') AS bulan,Format (stp.tglplanning, 'MM') AS bulan2,
                    case when stp.startdate is null then 0 else (datediff(minute, stp.tglplanning, stp.startdate)) end as respond,
                    stp.norec, rg.namaruangan, stp.tglplanning, stp.startdate, 
                    stp.duedate, stp.rincianexecuteplanning_askep, stp.pelapor, stp.deskripsiplanning, 
                    stp.keteranganverifikasi,stp.signdate, 
                    stp.worklist
                    FROM strukplanning_t as stp
                    INNER JOIN ruangan_m as rg on rg.id = stp.objectruanganfk
                    WHERE stp.objectkelompoktransaksifk=$kelTran
                    AND stp.statusenabled=true
                    AND stp.tglplanning BETWEEN '$tglAwal' AND '$tglAkhir'
                    )  as x
                     group by x.bulan,x.bulan2
                    ) as z group BY z.bulan,z.bulan2
                    order by z.bulan2
        "));
        if(count($data) > 0) {
            $i=0;
            foreach ($data10 as $da) {
                foreach ($data as $d) {
                    if ($data10[$i]['tanggal'] == $d->bulan) {
                        $data10[$i]['masuk'] = (float)$d->orderr;
                        $data10[$i]['keluar'] = (float)$d->responds;
                    }
                }
                $i++;
            }
        }
        return $this->respond($data10);

    }
    public function getTrendDiklat(Request $request)
    {
        $tglAwal = Carbon::now()->startOfYear()->format('Y-m-d 00:00:00'); //  $request['tglAwal'];
//        return $tglAwal;
        $tglAkhir = Carbon::now()->format('Y-m-d 23:59:59');//  $request['tglAkhir'];

        $listBulan  =['Jan' ,'Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Des'];
        $i = 0;
        $data10 = [];
        foreach ($listBulan as $b){
            $data10 [] =array(
                'tanggal' => $listBulan[$i],
                'masuk' => 0,
                'keluar' => 0
            );
            $i++;
        }
//        return $data10;
        $data = DB::select(DB::raw("
                    select x.bulan,x.bulan2,sum(x.totalharusdibayar) as jml from (
                    select Format (sp.tglstruk, 'MMM') AS bulan,Format (sp.tglstruk, 'MM') AS bulan2,sp.norec, 
                        sp.tglstruk, 
                        sp.namapasien_klien, 
                        kt.reportdisplay as jenistagihan, 
                        sp.totalharusdibayar, 
                        keteranganlainnya, 
                        sp.nosbklastfk, 
                        sp.nosbmlastfk, 
                        kt.id as jenisTagihanId,
                        sp.totalharusdibayar * 39/100 as jasa 
                        from strukpelayanan_t as sp 
                        inner join kelompoktransaksi_m as kt on sp.objectkelompoktransaksifk = kt.id 
                        where sp.totalharusdibayar is not null 
                        and sp.objectkelompoktransaksifk in (138,140,139,141,142,143,144,145,146,147,148,149,13,6,2,9,150,4) 
                        and sp.tglstruk BETWEEN  '2020-01-01 00:00:00' AND '2020-11-04 23:59:00'
                        and kt.id IN (13,138) and sp.nosbmlastfk is not null 
                        and sp.statusenabled=true
                     and sp.objectkelompoktransaksifk in (13,138)
                    ) as x group by x.bulan,x.bulan2
                    order by x.bulan2
        "));
        if(count($data) > 0) {
            $i=0;
            foreach ($data10 as $da) {
                foreach ($data as $d) {
                    if ($data10[$i]['tanggal'] == $d->bulan) {
                        $data10[$i]['masuk'] = (float)$d->jml;
//                        $data10[$i]['keluar'] = (float)$d->responds;
                    }
                }
                $i++;
            }
        }
        return $this->respond($data10);

    }
    public function getTrendGizi(Request $request)
    {
        $tglAwal = Carbon::now()->startOfYear()->format('Y-m-d 00:00:00'); //  $request['tglAwal'];
//        return $tglAwal;
        $tglAkhir = Carbon::now()->format('Y-m-d 23:59:59');//  $request['tglAkhir'];

        $listBulan  =['Jan' ,'Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Des'];
        $i = 0;
        $data10 = [];
        foreach ($listBulan as $b){
            $data10 [] =array(
                'tanggal' => $listBulan[$i],
                'masuk' => 0,
                'keluar' => 0
            );
            $i++;
        }
//        return $data10;
        $data = DB::select(DB::raw("
                     select z.bulan,z.bulan2,sum(z.masuk) as masuk,sum(z.keluar) as keluar from (
                     
                        select x.bulan,x.bulan2,sum(x.qtyproduk) as keluar, 0 as masuk from (
                        SELECT
                        Format (so.tglpelayananawal, 'MMM') AS bulan,Format (so.tglpelayananawal, 'MM') AS bulan2,
                            op.norec AS norec_op,
                            so.noorder,
                            so.tglpelayananawal as tglorder,
                            op.qtyproduk
                        FROM
                            orderpelayanan_t AS op
                        INNER JOIN strukorder_t AS so ON so.norec = op.strukorderfk
                        WHERE
                            so.statusenabled=true
                        AND so.objectkelompoktransaksifk = 8
                        AND so.tglpelayananawal BETWEEN '$tglAwal' AND '$tglAkhir'
                        ) as x GROUP BY x.bulan,x.bulan2
                        
                        union ALL
                        
                        select x.bulan,x.bulan2,0 as keluar, sum(x.qtyproduk)  as masuk from (
                        SELECT
                        Format (so.tglorder, 'MMM') AS bulan,Format (so.tglorder, 'MM') AS bulan2,
                            op.norec AS norec_op,
                            so.noorder,
                            so.tglorder,
                            op.qtyproduk
                            
                        FROM
                            orderpelayanan_t AS op
                        INNER JOIN strukorder_t AS so ON so.norec = op.strukorderfk
                        WHERE
                            so.statusenabled=true
                        AND so.objectkelompoktransaksifk = 8
                        AND so.tglorder BETWEEN '$tglAwal' AND '$tglAkhir'
                        ) as x GROUP BY x.bulan,x.bulan2
                        
                        ) as z
                         GROUP BY z.bulan,z.bulan2
                        order by z.bulan2
        "));
        if(count($data) > 0) {
            $i=0;
            foreach ($data10 as $da) {
                foreach ($data as $d) {
                    if ($data10[$i]['tanggal'] == $d->bulan) {
                        $data10[$i]['masuk'] = (float)$d->masuk;
                        $data10[$i]['keluar'] = (float)$d->keluar;
                    }
                }
                $i++;
            }
        }
        return $this->respond($data10);

    }
    public function getDataAsset(Request $request)
    {
        $asal = DB::select(DB::raw("SELECT
            sum(ra.qtyprodukaset)as jumlah,ap.asalproduk
            FROM
                registrasiaset_t AS ra
            INNER JOIN produk_m AS pr ON pr.id = ra.objectprodukfk
            LEFT JOIN asalproduk_m AS ap ON ap.id = ra.objectasalprodukfk
            GROUP BY ap.asalproduk
            "));
        $jenis = DB::select(DB::raw("select sum(x.qtyprodukaset) as jumlah, x.jenis 
                from (
                SELECT
                ra.qtyprodukaset, case when jp.jenisproduk is null then '-' else jp.jenisproduk end as jenis
                FROM
                    registrasiaset_t AS ra
                INNER JOIN produk_m AS pr ON pr.id = ra.objectprodukfk
                LEFT JOIN asalproduk_m AS ap ON ap.id = ra.objectasalprodukfk
                LEFT JOIN jenisproduk_m AS jp ON jp.id = ra.objectjenisproduk
                ) as x
                GROUP BY x.jenis


            "));
        $res['asalproduk'] = $asal;
        $res['jenisproduk'] = $jenis;

        return $this->respond($res);
    }

    public function getLaporanKunjunganPolri(Request $request){
        // $tglAwal =  date('Y-m-d'.' 00:00');
        $tglAwal = $request['tgl'].' 00:00';//Carbon::now()->subMonth(2);
        $tglAkhir =$request['tgl'].' 23:59';
        $dataALL = DB::select(DB::raw("SELECT
                x.namarekanan,
                COUNT (x.namarekanan) AS jumlah
            FROM
                (
                    SELECT
                        pd.noregistrasi,
                        -- rk.namarekanan,
                        case when rk.namarekanan is null then 'Non Pol/Non PNS' else rk.namarekanan end as namarekanan,
                        pd.objectrekananfk,
                        to_date(cast(pd.tglregistrasi as TEXT),'YYYY')AS tahunregis
                        
                    FROM
                        pasiendaftar_t AS pd
                    left JOIN rekanan_m AS rk ON rk.id = pd.objectrekananfk
                    LEFT JOIN batalregistrasi_t AS br ON br.pasiendaftarfk = pd.norec
                    WHERE
                        pd.tglregistrasi BETWEEN ' $tglAwal'
                    AND '$tglAkhir'
                    AND br.norec IS NULL
                ) AS x
            -- where x.namarekanan is not null
            GROUP BY
                x.namarekanan"));


        $data = \DB::table('pasiendaftar_t as pd')
            ->leftjoin('rekanan_m as rk','rk.id','=','pd.objectrekananfk')
            ->join('ruangan_m as ru','ru.id','=','pd.objectruanganlastfk')
            ->join('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
            ->select('pd.noregistrasi','rk.namarekanan',
                'pd.objectrekananfk','dp.id',
                'dp.namadepartemen',
                'pd.norec as norec_pd',
                DB::raw(" to_date(cast(pd.tglregistrasi as TEXT),'YYYY')AS tahunregis   "))
             ->where('pd.statusenabled',1)
            ->whereBetween('pd.tglregistrasi',[ $tglAwal, $tglAkhir ]);

        $data = $data ->get();

        $data10=[];
        $jmlPasienBpjsPol = 0;
        $jmlPasienBpjsNonPol = 0;
        $jmlPasienBpjsNonPolPBI = 0;
        $jmlPasienBpjsNonPolPBICSR = 0;
        $jmlPasienPTT = 0;
        $jmlPasienUmum = 0;
        $jmlPasienTagihan = 0;
//         if (count($data) > 0) {
        foreach ($data as $item) {
            $sama = false;
            $i = 0;
            foreach ($data10 as $hideung) {
                if ($item->id == $data10[$i]['id']) {
                    $sama = 1;
                    $jml = (float)$hideung['total'] + 1;
                    $data10[$i]['total'] = $jml;
                    if ($item->objectrekananfk == '581368') {
                        $data10[$i]['jmlPasienBpjsPol'] = (float)$hideung['jmlPasienBpjsPol'] + 1;
                    }else if ($item->objectrekananfk=='581367' || $item->objectrekananfk=='5906'){
                        $data10[$i]['jmlPasienBpjsNonPol'] = (float)$hideung['jmlPasienBpjsNonPol'] + 1;
                    }else if ($item->objectrekananfk=='581669'){
                        $data10[$i]['jmlPasienBpjsNonPolPBI'] = (float)$hideung['jmlPasienBpjsNonPolPBI'] + 1;
                    }else if ($item->objectrekananfk=='581673'){
                        $data10[$i]['jmlPasienBpjsNonPolPBICSR'] = (float)$hideung['jmlPasienBpjsNonPolPBICSR'] + 1;
                    }else if ($item->objectrekananfk == '581456') {
                        $data10[$i]['jmlPasienPTT'] = (float)$hideung['jmlPasienPTT'] + 1;
                    }else if ($item->objectrekananfk==NULL || $item->objectrekananfk==0) {
                        $data10[$i]['jmlPasienUmum'] = (float)$hideung['jmlPasienUmum'] + 1;
                    }else{
                        $data10[$i]['jmlPasienTagihan'] = (float)$hideung['jmlPasienTagihan'] + 1;
                    }
                }
                $i = $i + 1;
            }
            if ($sama == false) {
                if ($item->objectrekananfk == '581368') {
                    $jmlPasienBpjsPol = 1;
                    $jmlPasienBpjsNonPol = 0;
                    $jmlPasienBpjsNonPolPBI = 0;
                    $jmlPasienBpjsNonPolPBICSR = 0;
                    $jmlPasienPTT = 0;
                    $jmlPasienUmum = 0;
                    $jmlPasienTagihan = 0;
                }else if ($item->objectrekananfk=='581367' || $item->objectrekananfk=='5906') {
                    $jmlPasienBpjsPol = 0;
                    $jmlPasienBpjsNonPol = 1;
                    $jmlPasienBpjsNonPolPBI = 0;
                    $jmlPasienBpjsNonPolPBICSR = 0;
                    $jmlPasienPTT = 0;
                    $jmlPasienUmum = 0;
                    $jmlPasienTagihan = 0;
                }else if ($item->objectrekananfk=='581669') {
                    $jmlPasienBpjsPol = 0;
                    $jmlPasienBpjsNonPol = 0;
                    $jmlPasienBpjsNonPolPBI = 1;
                    $jmlPasienBpjsNonPolPBICSR = 0;
                    $jmlPasienPTT = 0;
                    $jmlPasienUmum = 0;
                    $jmlPasienTagihan = 0;
                }else if ($item->objectrekananfk=='581673') {
                    $jmlPasienBpjsPol = 0;
                    $jmlPasienBpjsNonPol = 0;
                    $jmlPasienBpjsNonPolPBI = 0;
                    $jmlPasienBpjsNonPolPBICSR = 1;
                    $jmlPasienPTT = 0;
                    $jmlPasienUmum = 0;
                    $jmlPasienTagihan = 0;
                }else if ($item->objectrekananfk == '581456') {
                    $jmlPasienBpjsPol = 0;
                    $jmlPasienBpjsNonPol = 0;
                    $jmlPasienBpjsNonPolPBI = 0;
                    $jmlPasienBpjsNonPolPBICSR = 0;
                    $jmlPasienPTT = 1;
                    $jmlPasienUmum = 0;
                    $jmlPasienTagihan = 0;
                }else if ($item->objectrekananfk==NULL || $item->objectrekananfk=='0') {
                    $jmlPasienBpjsPol = 0;
                    $jmlPasienBpjsNonPol = 0;
                    $jmlPasienBpjsNonPolPBI = 0;
                    $jmlPasienBpjsNonPolPBICSR = 0;
                    $jmlPasienPTT = 0;
                    $jmlPasienUmum = 1;
                    $jmlPasienTagihan = 0;
                }else {
                    $jmlPasienBpjsPol = 0;
                    $jmlPasienBpjsNonPol = 0;
                    $jmlPasienBpjsNonPolPBI = 0;
                    $jmlPasienBpjsNonPolPBICSR = 0;
                    $jmlPasienPTT = 0;
                    $jmlPasienUmum = 0;
                    $jmlPasienTagihan = 1;
                }
                $data10[] = array(
                    'id' => $item->id,
                    'namadepartemen' => $item->namadepartemen,
                    'total' => 1,
                    'jmlPasienBpjsPol' => $jmlPasienBpjsPol,
                    'jmlPasienBpjsNonPol' => $jmlPasienBpjsNonPol,
                    'jmlPasienBpjsNonPolPBI' => $jmlPasienBpjsNonPolPBI,
                    'jmlPasienBpjsNonPolPBICSR' => $jmlPasienBpjsNonPolPBICSR,
                    'jmlPasienPTT' => $jmlPasienPTT,
                    'jmlPasienUmum' => $jmlPasienUmum,
                    'jmlPasienTagihan' => $jmlPasienTagihan,
                );
            }
            foreach ($data10 as $key => $row) {
                $count[$key] = $row['total'];
            }
            array_multisort($count, SORT_DESC, $data10);
        }

        $result = array(
            'dataAll' => $dataALL,
            'data' => $data10,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getLaporanGolonganPolri(Request $request){
        // $tglAwal =  date('Y-m-d'.' 00:00');
        $tglAwal = $request['tgl'].' 00:00';//Carbon::now()->subMonth(2);
        $tglAkhir =$request['tgl'].' 23:59';
        $dataALL = DB::select(DB::raw("SELECT
                x.jeniskelompokpasien,
                COUNT (x.jeniskelompokpasien) AS jumlah
            FROM
                (
                    SELECT
                        pd.noregistrasi,
                        rk.namarekanan,
                        pd.objectrekananfk,
                         to_date(cast(pd.tglregistrasi as TEXT),'YYYY')AS tahunregis,
                        ps.objectjeniskelompokpasienfk,
                        -- kp.jeniskelompokpasien
                        case when kp.jeniskelompokpasien is null then 'Non Pol/Non PNS' else kp.jeniskelompokpasien end as jeniskelompokpasien
                    FROM
                        pasiendaftar_t AS pd
                    left JOIN rekanan_m AS rk ON rk.id = pd.objectrekananfk
                    LEFT JOIN batalregistrasi_t AS br ON br.pasiendaftarfk = pd.norec
                    INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                    left JOIN jeniskelompokpasien_m AS kp ON kp.id = ps.objectjeniskelompokpasienfk
                    WHERE
                        pd.tglregistrasi BETWEEN ' $tglAwal'
                    AND '$tglAkhir'
                    AND br.norec IS NULL
                ) AS x
            -- where x.jeniskelompokpasien is not null
            GROUP BY
                x.jeniskelompokpasien"));


        $data = \DB::table('pasiendaftar_t as pd')
            ->leftjoin('rekanan_m as rk','rk.id','=','pd.objectrekananfk')
            ->join('ruangan_m as ru','ru.id','=','pd.objectruanganlastfk')
            ->join('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
            ->join('pasien_m as ps','ps.id','=','pd.nocmfk')
            ->leftjoin('jeniskelompokpasien_m as jk','jk.id','=','ps.objectjeniskelompokpasienfk')
            ->select('pd.noregistrasi','rk.namarekanan',
                'pd.objectrekananfk','dp.id',
                'dp.namadepartemen',
                'pd.norec as norec_pd',
                'ps.objectjeniskelompokpasienfk',
                DB::raw(" to_date(cast(pd.tglregistrasi as TEXT),'YYYY')AS tahunregis, case when ps.objectjeniskelompokpasienfk is null then 'Non Pol/Non PNS' else jk.jeniskelompokpasien end as jeniskelompokpasien"))
             ->where('pd.statusenabled',1)
            ->whereBetween('pd.tglregistrasi',[ $tglAwal, $tglAkhir ]);

        $data = $data ->get();

        $data10=[];
        $jmlP1 = 0;
        $jmlP2 = 0;
        $jmlP3= 0;
        $jmlP4 = 0;
        $jmlP5 = 0;
        $jmlP6 = 0;
        $jmlP7 = 0;
        $jmlP8 = 0;
        $jmlP9 = 0;
        $jmlP10 = 0;
        $jmlP11 = 0;
        $jmlP12 = 0;
        $jmlP13 = 0;
        $jmlP14 = 0;
        $jmlP15 = 0;
        $jmlP16 = 0;
        $jmlP17 = 0;
        $jmlP18 = 0;
        $jmlP19 = 0;
        $jmlP20 = 0;
        $jmlP21 = 0;
        $jmlP22 = 0;
        $jmlP23 = 0;
        $jmlP24 = 0;
        $jmlP25 = 0;
        $jmlP26 = 0;
        $jmlP27 = 0;
        $jmlP28 = 0;
        $jmlP29 = 0;
        $jmlKosong = 0;
//         if (count($data) > 0) {
        foreach ($data as $item) {
            $sama = false;
            $i = 0;
            foreach ($data10 as $hideung) {
                if ($item->id == $data10[$i]['id']) {
                    $sama = 1;
                    $jml = (float)$hideung['total'] + 1;
                    $data10[$i]['total'] = $jml;
                    if($item->objectjeniskelompokpasienfk==1){
                        $jmlP1 = (float)$hideung['jmlP1'] + 1;
                        $data10[$i]['jmlP1'] = $jmlP1;
                    }
                    if($item->objectjeniskelompokpasienfk==2){
                        $jmlP2 = (float)$hideung['jmlP2'] + 1;
                        $data10[$i]['jmlP2'] = $jmlP2;
                    }
                    if($item->objectjeniskelompokpasienfk==3){
                        $jmlP3 = (float)$hideung['jmlP3'] + 1;
                        $data10[$i]['jmlP3'] = $jmlP3;
                    }
                    if($item->objectjeniskelompokpasienfk==4){
                        $jmlP4 = (float)$hideung['jmlP4'] + 1;
                        $data10[$i]['jmlP4'] = $jmlP4;
                    }
                    if($item->objectjeniskelompokpasienfk==5){
                        $jmlP5 = (float)$hideung['jmlP5'] + 1;
                        $data10[$i]['jmlP5'] = $jmlP5;
                    }
                    if($item->objectjeniskelompokpasienfk==6){
                        $jmlP6 = (float)$hideung['jmlP6'] + 1;
                        $data10[$i]['jmlP6'] = $jmlP6;
                    }
                    if($item->objectjeniskelompokpasienfk==7){
                        $jmlP7 = (float)$hideung['jmlP7'] + 1;
                        $data10[$i]['jmlP7'] = $jmlP7;
                    }
                    if($item->objectjeniskelompokpasienfk==8){
                        $jmlP8 = (float)$hideung['jmlP8'] + 1;
                        $data10[$i]['jmlP8'] = $jmlP8;
                    }
                    if($item->objectjeniskelompokpasienfk==9){
                        $jmlP9 = (float)$hideung['jmlP9'] + 1;
                        $data10[$i]['jmlP9'] = $jmlP9;
                    }
                    if($item->objectjeniskelompokpasienfk==10){
                        $jmlP10 = (float)$hideung['jmlP10'] + 1;
                        $data10[$i]['jmlP10'] = $jmlP10;
                    }
                    if($item->objectjeniskelompokpasienfk==11){
                        $jmlP11 = (float)$hideung['jmlP11'] + 1;
                        $data10[$i]['jmlP11'] = $jmlP11;
                    }
                    if($item->objectjeniskelompokpasienfk==12){
                        $jmlP12 = (float)$hideung['jmlP12'] + 1;
                        $data10[$i]['jmlP12'] = $jmlP12;
                    }
                    if($item->objectjeniskelompokpasienfk==13){
                        $jmlP13 = (float)$hideung['jmlP13'] + 1;
                        $data10[$i]['jmlP13'] = $jmlP13;
                    }
                    if($item->objectjeniskelompokpasienfk==14){
                        $jmlP14 = (float)$hideung['jmlP14'] + 1;
                        $data10[$i]['jmlP14'] = $jmlP14;
                    }
                    if($item->objectjeniskelompokpasienfk==15){
                        $jmlP15 = (float)$hideung['jmlP15'] + 1;
                        $data10[$i]['jmlP15'] = $jmlP15;
                    }
                    if($item->objectjeniskelompokpasienfk==16){
                        $jmlP16 = (float)$hideung['jmlP16'] + 1;
                        $data10[$i]['jmlP16'] = $jmlP16;
                    }
                    if($item->objectjeniskelompokpasienfk==17){
                        $jmlP17 = (float)$hideung['jmlP17'] + 1;
                        $data10[$i]['jmlP17'] = $jmlP17;
                    }
                    if($item->objectjeniskelompokpasienfk==18){
                        $jmlP18 = (float)$hideung['jmlP18'] + 1;
                        $data10[$i]['jmlP18'] = $jmlP18;
                    }
                    if($item->objectjeniskelompokpasienfk==19){
                        $jmlP19 = (float)$hideung['jmlP19'] + 1;
                        $data10[$i]['jmlP19'] = $jmlP19;
                    }
                    if($item->objectjeniskelompokpasienfk==20){
                        $jmlP20 = (float)$hideung['jmlP20'] + 1;
                        $data10[$i]['jmlP20'] = $jmlP20;
                    }
                    if($item->objectjeniskelompokpasienfk==21){
                        $jmlP21 = (float)$hideung['jmlP21'] + 1;
                        $data10[$i]['jmlP21'] = $jmlP21;
                    }
                    if($item->objectjeniskelompokpasienfk==22){
                        $jmlP22 = (float)$hideung['jmlP22'] + 1;
                        $data10[$i]['jmlP22'] = $jmlP22;
                    }
                    if($item->objectjeniskelompokpasienfk==23){
                        $jmlP23 = (float)$hideung['jmlP23'] + 1;
                        $data10[$i]['jmlP23'] = $jmlP23;
                    }
                    if($item->objectjeniskelompokpasienfk==24){
                        $jmlP24 = (float)$hideung['jmlP24'] + 1;
                        $data10[$i]['jmlP24'] = $jmlP24;
                    }
                    if($item->objectjeniskelompokpasienfk==25){
                        $jmlP25 = (float)$hideung['jmlP25'] + 1;
                        $data10[$i]['jmlP25'] = $jmlP25;
                    }
                    if($item->objectjeniskelompokpasienfk==26){
                        $jmlP26 = (float)$hideung['jmlP26'] + 1;
                        $data10[$i]['jmlP26'] = $jmlP26;
                    }
                    if($item->objectjeniskelompokpasienfk==27){
                        $jmlP27 = (float)$hideung['jmlP27'] + 1;
                        $data10[$i]['jmlP27'] = $jmlP27;
                    }
                    if($item->objectjeniskelompokpasienfk==28){
                        $jmlP28 = (float)$hideung['jmlP28'] + 1;
                        $data10[$i]['jmlP28'] = $jmlP28;
                    }
                    if($item->objectjeniskelompokpasienfk==29){
                        $jmlP29 = (float)$hideung['jmlP29'] + 1;
                        $data10[$i]['jmlP29'] = $jmlP29;
                    }
                    if($item->objectjeniskelompokpasienfk==null){
                        $jmlKosong = (float)$hideung['jmlKosong'] + 1;
                        $data10[$i]['jmlKosong'] = $jmlKosong;
                    }
                }
                $i = $i + 1;
            }
            if ($sama == false) {
                $jmlP1 = 0;
                $jmlP2 = 0;
                $jmlP3= 0;
                $jmlP4 = 0;
                $jmlP5 = 0;
                $jmlP6 = 0;
                $jmlP7 = 0;
                $jmlP8 = 0;
                $jmlP9 = 0;
                $jmlP10 = 0;
                $jmlP11 = 0;
                $jmlP12 = 0;
                $jmlP13 = 0;
                $jmlP14 = 0;
                $jmlP15 = 0;
                $jmlP16 = 0;
                $jmlP17 = 0;
                $jmlP18 = 0;
                $jmlP19 = 0;
                $jmlP20 = 0;
                $jmlP21 = 0;
                $jmlP22 = 0;
                $jmlP23 = 0;
                $jmlP24 = 0;
                $jmlP25 = 0;
                $jmlP26 = 0;
                $jmlP27 = 0;
                $jmlP28 = 0;
                $jmlP29 = 0;
                $jmlKosong = 0;
                if($item->objectjeniskelompokpasienfk == 1){
                    $jmlP1 = 1;
                }
                if($item->objectjeniskelompokpasienfk == 2){
                    $jmlP2 = 1;
                }
                if($item->objectjeniskelompokpasienfk == 3){
                    $jmlP3 = 1;
                }
                if($item->objectjeniskelompokpasienfk == 4){
                    $jmlP4 = 1;
                }
                if($item->objectjeniskelompokpasienfk == 5){
                    $jmlP5 = 1;
                }
                if($item->objectjeniskelompokpasienfk == 6){
                    $jmlP6 = 1;
                }
                if($item->objectjeniskelompokpasienfk == 7){
                    $jmlP7 = 1;
                }
                if($item->objectjeniskelompokpasienfk == 8){
                    $jmlP8 = 1;
                }
                if($item->objectjeniskelompokpasienfk == 9){
                    $jmlP9 = 1;
                }
                if($item->objectjeniskelompokpasienfk == 10){
                    $jmlP10 = 1;
                }
                if($item->objectjeniskelompokpasienfk == 11){
                    $jmlP11 = 1;
                }
                if($item->objectjeniskelompokpasienfk == 12){
                    $jmlP12 = 1;
                }
                if($item->objectjeniskelompokpasienfk == 13){
                    $jmlP13 = 1;
                }
                if($item->objectjeniskelompokpasienfk == 14){
                    $jmlP14 = 1;
                }
                if($item->objectjeniskelompokpasienfk == 15){
                    $jmlP15 = 1;
                }
                if($item->objectjeniskelompokpasienfk == 16){
                    $jmlP16 = 1;
                }
                if($item->objectjeniskelompokpasienfk == 17){
                    $jmlP17 = 1;
                }
                if($item->objectjeniskelompokpasienfk == 18){
                    $jmlP18 = 1;
                }
                if($item->objectjeniskelompokpasienfk == 19){
                    $jmlP19 = 1;
                }
                if($item->objectjeniskelompokpasienfk == 20){
                    $jmlP20 = 1;
                }
                if($item->objectjeniskelompokpasienfk == 21){
                    $jmlP21 = 1;
                }
                if($item->objectjeniskelompokpasienfk == 22){
                    $jmlP22 = 1;
                }
                if($item->objectjeniskelompokpasienfk == 23){
                    $jmlP23 = 1;
                }
                if($item->objectjeniskelompokpasienfk == 24){
                    $jmlP24 = 1;
                }
                if($item->objectjeniskelompokpasienfk == 25){
                    $jmlP25 = 1;
                }
                if($item->objectjeniskelompokpasienfk == 26){
                    $jmlP26 = 1;
                }
                if($item->objectjeniskelompokpasienfk == 27){
                    $jmlP27 = 1;
                }
                if($item->objectjeniskelompokpasienfk == 28){
                    $jmlP28 = 1;
                }
                if($item->objectjeniskelompokpasienfk == 29){
                    $jmlP29 = 1;
                }
                if($item->objectjeniskelompokpasienfk == null){
                    $jmlKosong = 1;
                }
                $data10[] = array(
                    'id' => $item->id,
                    'namadepartemen' => $item->namadepartemen,
                    'total' => 1,
                    'jmlP1'=> $jmlP1,
                    'jmlP2'=> $jmlP2,
                    'jmlP3'=> $jmlP3,
                    'jmlP4'=> $jmlP4,
                    'jmlP5'=> $jmlP5,
                    'jmlP6'=> $jmlP6,
                    'jmlP7'=> $jmlP7,
                    'jmlP8'=> $jmlP8,
                    'jmlP9'=> $jmlP9,
                    'jmlP10'=> $jmlP10,
                    'jmlP11'=> $jmlP11,
                    'jmlP12'=> $jmlP12,
                    'jmlP13'=> $jmlP13,
                    'jmlP14'=> $jmlP14,
                    'jmlP15'=> $jmlP15,
                    'jmlP16'=> $jmlP16,
                    'jmlP17'=> $jmlP17,
                    'jmlP18'=> $jmlP18,
                    'jmlP19'=> $jmlP19,
                    'jmlP20'=> $jmlP20,
                    'jmlP21'=> $jmlP21,
                    'jmlP22'=> $jmlP22,
                    'jmlP23'=> $jmlP23,
                    'jmlP24'=> $jmlP24,
                    'jmlP25'=> $jmlP25,
                    'jmlP26'=> $jmlP26,
                    'jmlP27'=> $jmlP27,
                    'jmlP28'=> $jmlP28,
                    'jmlP29'=> $jmlP29,
                    'jmlKosong'=> $jmlKosong,
                );
            }
            foreach ($data10 as $key => $row) {
                $count[$key] = $row['total'];
            }
            array_multisort($count, SORT_DESC, $data10);
        }

        $result = array(
            'dataAll' => $dataALL,
            'data' => $data10,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getLaporanGolonganPolriCovid(Request $request){
        // $tglAwal =  date('Y-m-d'.' 00:00');
        $tglAwal = $request['tgl'].' 00:00';//Carbon::now()->subMonth(2);
        $tglAkhir =$request['tgl'].' 23:59';
        $dataALL = DB::select(DB::raw("SELECT
                x.jeniskelompokpasien,
                COUNT (x.jeniskelompokpasien) AS jumlah
            FROM
                (
                    SELECT
                        pd.noregistrasi,
                        rk.namarekanan,
                        pd.objectrekananfk,
                        to_date(cast(pd.tglregistrasi as TEXT),'YYYY')AS tahunregis,
                        ps.objectjeniskelompokpasienfk,
                        case when kp.jeniskelompokpasien is null then 'Non Pol/Non PNS' else kp.jeniskelompokpasien end as jeniskelompokpasien
                    FROM
                        pasiendaftar_t AS pd
                    left JOIN rekanan_m AS rk ON rk.id = pd.objectrekananfk
                    LEFT JOIN batalregistrasi_t AS br ON br.pasiendaftarfk = pd.norec
                    INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                    left JOIN jeniskelompokpasien_m AS kp ON kp.id = ps.objectjeniskelompokpasienfk
                    join ruangan_m as ru on ru.id=pd.objectruanganlastfk
                    WHERE
                    --     pd.tglregistrasi BETWEEN ' $tglAwal'
                    -- AND '$tglAkhir'
                    -- AND
                     br.norec IS NULL
                    and ru.objectruanganfk=19
                    and pd.tglpulang is null
                ) AS x
            -- where x.jeniskelompokpasien is not null
            GROUP BY
                x.jeniskelompokpasien"));

        $result = array(
            'dataAll' => $dataALL,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getLaporanCsrPolri(Request $request){
        // $tglAwal =  date('Y-m-d'.' 00:00');
        $tglAwal = $request['tgl'].' 00:00';//Carbon::now()->subMonth(2);
        $tglAkhir =$request['tgl'].' 23:59';
        $dataALL = DB::select(DB::raw("SELECT
                x.namaexternal,
                COUNT (x.namaexternal) AS jumlah
            FROM
                (
                    SELECT
                        pd.noregistrasi,
                        rk.namarekanan,
                        pd.objectrekananfk,
                       to_date(cast(pd.tglregistrasi as TEXT),'YYYY')AS tahunregis,
                        pd.objectjaminankhusus,
                        kp.namaexternal
                    FROM
                        pasiendaftar_t AS pd
                    left JOIN rekanan_m AS rk ON rk.id = pd.objectrekananfk
                    LEFT JOIN batalregistrasi_t AS br ON br.pasiendaftarfk = pd.norec
                    INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                    JOIN jaminankhusus_m AS kp ON kp.id = pd.objectjaminankhusus
                    WHERE
                        pd.tglregistrasi BETWEEN ' $tglAwal'
                    AND '$tglAkhir'
                    AND br.norec IS NULL
                ) AS x
            -- where x.namaexternal is not null
            GROUP BY
                x.namaexternal"));


        $data = \DB::table('pasiendaftar_t as pd')
            ->leftjoin('rekanan_m as rk','rk.id','=','pd.objectrekananfk')
            ->join('ruangan_m as ru','ru.id','=','pd.objectruanganlastfk')
            ->join('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
            ->join('pasien_m as ps','ps.id','=','pd.nocmfk')
            ->join('jaminankhusus_m as jk','jk.id','=','pd.objectjaminankhusus')
            ->select('pd.noregistrasi','rk.namarekanan',
                'pd.objectrekananfk','dp.id',
                'dp.namadepartemen',
                'pd.norec as norec_pd',
                'pd.objectjaminankhusus',
                DB::raw("to_date(cast(pd.tglregistrasi as TEXT),'YYYY')AS tahunregis"))
             ->where('pd.statusenabled',1)
            ->whereBetween('pd.tglregistrasi',[ $tglAwal, $tglAkhir ]);

        $data = $data ->get();

        $data10=[];
        $csrP1 = 0;
        $csrP2 = 0;
        $csrP3= 0;
        $csrP4 = 0;
        $csrP5 = 0;
        $csrP6 = 0;
        $csrP7 = 0;
        $csrP8 = 0;
        $csrP9 = 0;
        $csrP10 = 0;
        $csrP11 = 0;
        $csrP12 = 0;
        $csrP13 = 0;
        $csrP14 = 0;
        $csrP15 = 0;
//         if (count($data) > 0) {
        foreach ($data as $item) {
            $sama = false;
            $i = 0;
            foreach ($data10 as $hideung) {
                if ($item->id == $data10[$i]['id']) {
                    $sama = 1;
                    $jml = (float)$hideung['total'] + 1;
                    $data10[$i]['total'] = $jml;
                    if($item->objectjaminankhusus==1){
                        $csrP1 = (float)$hideung['csrP1'] + 1;
                        $data10[$i]['csrP1'] = $csrP1;
                    }
                    if($item->objectjaminankhusus==2){
                        $csrP2 = (float)$hideung['csrP2'] + 1;
                        $data10[$i]['csrP2'] = $csrP2;
                    }
                    if($item->objectjaminankhusus==3){
                        $csrP3 = (float)$hideung['csrP3'] + 1;
                        $data10[$i]['csrP3'] = $csrP3;
                    }
                    if($item->objectjaminankhusus==4){
                        $csrP = (float)$hideung['csrP4'] + 1;
                        $data10[$i]['csrP4'] = $csrP4;
                    }
                    if($item->objectjaminankhusus==5){
                        $csrP5 = (float)$hideung['csrP5'] + 1;
                        $data10[$i]['csrP5'] = $csrP5;
                    }
                    if($item->objectjaminankhusus==6){
                        $csrP6 = (float)$hideung['csrP6'] + 1;
                        $data10[$i]['csrP6'] = $csrP6;
                    }
                    if($item->objectjaminankhusus==7){
                        $csrP7 = (float)$hideung['csrP7'] + 1;
                        $data10[$i]['csrP7'] = $csrP7;
                    }
                    if($item->objectjaminankhusus==8){
                        $csrP8 = (float)$hideung['csrP8'] + 1;
                        $data10[$i]['csrP8'] = $csrP8;
                    }
                    if($item->objectjaminankhusus==9){
                        $csrP9 = (float)$hideung['csrP9'] + 1;
                        $data10[$i]['csrP9'] = $csrP9;
                    }
                    if($item->objectjaminankhusus==10){
                        $csrP10 = (float)$hideung['csrP10'] + 1;
                        $data10[$i]['csrP10'] = $csrP10;
                    }
                    if($item->objectjaminankhusus==11){
                        $csrP11 = (float)$hideung['csrP11'] + 1;
                        $data10[$i]['csrP11'] = $csrP11;
                    }
                    if($item->objectjaminankhusus==12){
                        $csrP12 = (float)$hideung['csrP12'] + 1;
                        $data10[$i]['csrP12'] = $csrP12;
                    }
                    if($item->objectjaminankhusus==13){
                        $csrP13 = (float)$hideung['csrP13'] + 1;
                        $data10[$i]['csrP13'] = $csrP13;
                    }
                    if($item->objectjaminankhusus==14){
                        $csrP14 = (float)$hideung['csrP14'] + 1;
                        $data10[$i]['csrP14'] = $csrP14;
                    }
                    if($item->objectjaminankhusus==15){
                        $csrP15 = (float)$hideung['csrP15'] + 1;
                        $data10[$i]['csrP15'] = $csrP15;
                    }
                }
                $i = $i + 1;
            }
            if ($sama == false) {
                $csrP1 = 0;
                $csrP2 = 0;
                $csrP3= 0;
                $csrP4 = 0;
                $csrP5 = 0;
                $csrP6 = 0;
                $csrP7 = 0;
                $csrP8 = 0;
                $csrP9 = 0;
                $csrP10 = 0;
                $csrP11 = 0;
                $csrP12 = 0;
                $csrP13 = 0;
                $csrP14 = 0;
                $csrP15 = 0;
                if($item->objectjaminankhusus == 1){
                    $csrP1 = 1;
                }
                if($item->objectjaminankhusus == 2){
                    $csrP2 = 1;
                }
                if($item->objectjaminankhusus == 3){
                    $csrP3 = 1;
                }
                if($item->objectjaminankhusus == 4){
                    $csrP4= 1;
                }
                if($item->objectjaminankhusus == 5){
                    $csrP5= 1;
                }
                if($item->objectjaminankhusus == 6){
                    $csrP6 = 1;
                }
                if($item->objectjaminankhusus == 7){
                    $csrP7 = 1;
                }
                if($item->objectjaminankhusus == 8){
                    $csrP8 = 1;
                }
                if($item->objectjaminankhusus == 9){
                    $csrP9 = 1;
                }
                if($item->objectjaminankhusus == 10){
                    $csrP10 = 1;
                }
                if($item->objectjaminankhusus == 11){
                    $csrP11 = 1;
                }
                if($item->objectjaminankhusus == 12){
                    $csrP12 = 1;
                }
                if($item->objectjaminankhusus == 13){
                    $csrP13 = 1;
                }
                if($item->objectjaminankhusus == 14){
                    $csrP14 = 1;
                }
                if($item->objectjaminankhusus == 15){
                    $csrP15= 1;
                }
                $data10[] = array(
                    'id' => $item->id,
                    'namadepartemen' => $item->namadepartemen,
                    'total' => 1,
                    'csrP1'=> $csrP1,
                    'csrP2'=> $csrP2,
                    'csrP3'=> $csrP3,
                    'csrP4'=> $csrP4,
                    'csrP5'=> $csrP5,
                    'csrP6'=> $csrP6,
                    'csrP7'=> $csrP7,
                    'csrP8'=> $csrP8,
                    'csrP9'=> $csrP9,
                    'csrP10'=> $csrP10,
                    'csrP11'=> $csrP11,
                    'csrP12'=> $csrP12,
                    'csrP13'=> $csrP13,
                    'csrP14'=> $csrP14,
                    'csrP15'=> $csrP15,
                );
            }
            foreach ($data10 as $key => $row) {
                $count[$key] = $row['total'];
            }
            array_multisort($count, SORT_DESC, $data10);
        }

        $result = array(
            'dataAll' => $dataALL,
            'data' => $data10,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
     public function getDataRealisasi(Request $request) {
        $tahun = $request['tahun'];
        $kelompok = $request['kelompok'];
        // return($kelompok);
        // die()
         $data = DB::select(DB::raw("select *,round((bulanlalu/dipa)*100,2) as persenbulanlalu,round((bulanini/dipa)*100,2) as persenbulanini,bulanlalu+bulanini as sdbulanini,round((bulanlalu/dipa)*100,2)+round((bulanini/dipa)*100,2) as persensdini,dipa-bulanlalu-bulanini as sisadana,100-(round((bulanlalu/dipa)*100,2)+round((bulanini/dipa)*100,2)) as persensisa 
                  from v_realisasi
                  where tahun=$tahun
            and namaexternal like '%$kelompok%' 
                  order by kd2 "));
          foreach ($data as $item){
            $dataResult[] = array(
                'jumlahData' => (float)$item->persensisa,
                'kd' => $item->kd,
                'dipa' => (float)$item->dipa,
                'bulanlalu' => (float)$item->bulanlalu,
                'persenbulanlalu' => round((float)$item->persenbulanlalu,2),
                'bulanini' => (float)$item->bulanini,
                'persenbulanini' => round((float)$item->persenbulanini,2),
                'sdbulanini' => (float)$item->sdbulanini,
                'persensdini' => round((float)$item->persensdini,2),
                'sisadana' => (float)$item->sisadana,
                'persensisa' => round((float)$item->persensisa,2),
                'desk' => $item->desk

            );

        }

        return $this->respond($dataResult);
    }
    public function getLaporanRealisasi(Request $request){
        $dataLogin = $request->all();
        // $Pengendali =  ' ';
        $tahun =  $request['tahun'];
        $bulan =  $request['bulan'];
        $kelompok =  $request['kelompok'];

       
        //tanda
       
        $data = DB::select(DB::raw("select norec,saldoawalblu,tahun,
                                    kdkelompokhead,kelompokhead,kdchildpertama,childpertama,kdchildkedua, childkedua,kdchildketiga,childketiga,kdchildkeempat, childkeempat,kdchildkelima,childkelima,kdchildkeenam,childkeenam,kdchildketujuh,childketujuh 
                                    from v_dataanggaran
                                    where statusenabled=true
                                    and tahun  = $tahun 
                                  "));

        $databulanlalu = DB::select(DB::raw("
                                    select sum(realisasi) as jumlah,norecanggaranfk from realisasianggaran_t
                                    where MONTH(tanggalrealisasi)<$bulan
                                    and year(tanggalrealisasi)=$tahun
                                    group by norecanggaranfk
                                    
                                  "));
        $databulanini= DB::select(DB::raw(" select sum(realisasi) as jumlah,norecanggaranfk  from realisasianggaran_t
                                    where MONTH(tanggalrealisasi)=$bulan
                                    and year(tanggalrealisasi)=$tahun
                                    group by norecanggaranfk
                                  "));

        $dataalokasi = DB::select(DB::raw("
                                    select CAST(SUM(saldoawalblu) + SUM(saldoawalrm) AS float) 
                                    AS dipa from v_dataanggaran
                                    where 
                                     tahun  = $tahun 
                                     and kd like '%$kelompok%'
                                    
                                  "));
        $alokasi=0;
         foreach ($dataalokasi as $itemx) {
             $alokasi= $itemx->dipa;
         }

     
        $data1 = MataAnggaran::where('statusenabled', 1)
                    ->update([
                        'bulanlalu' => 0,
                        'bulanini' => 0
                    ]);
        $x=0;
        foreach ($data as $item) {
            // $count[$key] = $row->kd;
            $x=$x+1;
            $bulanlalu= 0;
            $bulansekarang = 0;

            // $norec = $item->norec;
            
            foreach ($databulanlalu as $item2) {
               if($item->norec == $item2->norecanggaranfk){
                    $bulanlalu = $item2->jumlah;
               }
            }
            foreach ($databulanini as $item3) {
            //     return($norec);
            // die();
               if($item->norec == $item3->norecanggaranfk){
                    $bulansekarang = $item3->jumlah;
               }
            }
            // return($item->norec);
            // die();
             $data1 = MataAnggaran::where('norec', $item->norec)
                    ->update([
                        'bulanlalu' => $bulanlalu,
                        'bulanini' => $bulansekarang
                    ]);
        }
        // return($x);
        // die();
        $result = array(
            'data' => $alokasi,
            'message' => 'dy',
        );
        return $this->respond($result);
    }
    public function getLaporanSatker(Request $request){
        // $tglAwal =  date('Y-m-d'.' 00:00');
        $tglAwal = $request['tgl'].' 00:00';//Carbon::now()->subMonth(2);
        $tglAkhir =$request['tgl'].' 23:59';
        $dataALL = DB::select(DB::raw("SELECT
                x.satuankerjapasien,
                COUNT (x.satuankerjapasien) AS jumlah
            FROM
                (
                    SELECT
                        pd.noregistrasi,
                        rk.namarekanan,
                        pd.objectrekananfk,
                        to_date(cast(pd.tglregistrasi as TEXT),'YYYY')AS tahunregis,
                        pd.objectjaminankhusus,
                        sk.satuankerjapasien
                    FROM
                        pasiendaftar_t AS pd
                    left JOIN rekanan_m AS rk ON rk.id = pd.objectrekananfk
                    LEFT JOIN batalregistrasi_t AS br ON br.pasiendaftarfk = pd.norec
                    INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                    JOIN satuankerjapasien_m AS sk ON sk.id = ps.objectsatuankerjafk
                    WHERE
                        pd.tglregistrasi BETWEEN ' $tglAwal'
                    AND '$tglAkhir'
                    AND br.norec IS NULL
                ) AS x
            GROUP BY
                x.satuankerjapasien"));


        

        $result = array(
            'dataAll' => $dataALL,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
}