<?php

/**
 * Created by IntelliJ IDEA.
 * User: Egie Ramdan
 * Date: 07/02/2019
 * Time: 16.33
 */


namespace App\Http\Controllers\Bridging;

use App\Http\Controllers\ApiController;
use App\Master\Ruangan;
use App\Transaksi\Bioskeuangan;
use App\Transaksi\Biossaldo;
use App\Traits\Valet;
use Carbon\Carbon;
use Illuminate\Http\Request;
use DB;
use Date;

use App\Traits\PelayananPasienTrait;

class BridgingBiosController  extends ApiController
{

    use Valet, PelayananPasienTrait;
    protected $url_dinkes_jkt = 'http://eis.dinkes.jakarta.go.id/api-bed/bed';
    public function __construct()
    {
        parent::__construct($skip_authentication = true);
    }
    // protected  function kodeRS()
    // {
    //     return $this->settingDataFixed('userIdSisrute');
    // }
    // protected  function passwordRS()
    // {
    //     return $this->settingDataFixed('passwordSisrute');
    // }

    protected $kodeRS = 3174260;
    protected $passwordRS = "12345";

    function is_decimal($val)
    {
        return is_numeric($val) && floor($val) != $val;
    }


    public function hapusBed($kode_tipe_pasien, $kode_kelas_ruang)
    {
        # seting koneksi webservices #
        $xrsid = $this->kodeRS; # ID Rumah Sakit #
        $xpass = md5($this->passwordRS); # Password #

        $strURLSiranap = "http://sirs.yankes.kemkes.go.id/sirsservice/sisrute/hapusdata/$xrsid/$kode_tipe_pasien/$kode_kelas_ruang";

        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $strURLSiranap);
        curl_setopt(
            $curl,
            CURLOPT_HTTPHEADER,
            array(
                "X-rs-id: $xrsid",
                "X-pass:$xpass",
                "Content-Type:application/xml; charset=ISO-8859-1",
                "User-Agent: Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.15) Gecko/20080623 Firefox/2.0.0.15"
            )
        );
        curl_setopt($curl, CURLOPT_NOBODY, false);
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "Ada Kesalahan #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }
        return $this->respond($result);
    }
    public function getKunjungan($instalasi, Request $request)
    {
        $tgl = $request['tanggal'];
        $result = [];

        if ($instalasi == 'irj') {
            $data = DB::select(DB::raw(" select x.namaruangan,	sum(x.jkn)AS jkn,
				sum(x.nonjkn)AS nonjkn
				from 
				(
				select ru.namaruangan,case when pd.objectkelompokpasienlastfk in(2,4,10) then 1 else 0 end as jkn
				,case when pd.objectkelompokpasienlastfk not in (2,4,10) then 1 else 0 end as nonjkn,
				apd.norec 
				from  antrianpasiendiperiksa_t as apd 
				join pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
				join ruangan_m as ru on ru.id =apd.objectruanganfk
				where format(apd.tglregistrasi , 'dd-MM-yyyy') = '$tgl'
				and ru.objectdepartemenfk =18
				and pd.statusenabled=1
				) as x GROUP BY x.namaruangan
				order by x.namaruangan
					"));
            foreach ($data as $item) {
                $result[] = array(
                    'KLINIK' => $item->namaruangan,
                    'JKN' => (int) $item->jkn,
                    'NON JKN' =>  (int)  $item->nonjkn,
                );
            }
        }
        if ($instalasi == 'igd') {
            $data = DB::select(DB::raw("select x.namaruangan,	sum(x.jkn)AS jkn,
				sum(x.nonjkn)AS nonjkn
				from 
				(
				select ru.namaruangan,case when pd.objectkelompokpasienlastfk in(2,4,10) then 1 else 0 end as jkn
				,case when pd.objectkelompokpasienlastfk not in (2,4,10) then 1 else 0 end as nonjkn,
				apd.norec 
				from  antrianpasiendiperiksa_t as apd 
				join pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
				join ruangan_m as ru on ru.id =apd.objectruanganfk
				where format(apd.tglregistrasi , 'dd-MM-yyyy') = '$tgl'
				and ru.objectdepartemenfk =24
				and pd.statusenabled=1
				) as x GROUP BY x.namaruangan
				order by x.namaruangan
					"));
            if (count($data) > 0) {
                foreach ($data as $item) {
                    $result  = array(
                        'JKN' => (int) $item->jkn,
                        'NON JKN' =>  (int)  $item->nonjkn,
                    );
                }
            } else {
                $result  = array(
                    'JKN' => 0,
                    'NON JKN' => 0,
                );
            }
        }
        if ($instalasi == 'iri') {
            $tglAwal = $tgl . ' 00:00';
            $tglAkhir = $tgl . ' 23:59';
            $data = DB::select(DB::raw("select kls.namasiranap,count(pd.norec) as jml 
				from pasiendaftar_t as pd 
				join ruangan_m as ru on ru.id =pd.objectruanganlastfk
				join kelas_m as kls on kls.id =pd.objectkelasfk
				where format(pd.tglregistrasi,'dd-MM-yyyy') = '$tgl'
				  and (   format(pd.tglregistrasi,'dd-MM-yyyy HH:mm') < '$tglAwal'
				   AND  format(pd.tglpulang,'dd-MM-yyyy HH:mm') >= '$tglAkhir' 
	             )

	            or pd.tglpulang is null
	            and pd.statusenabled = 1
				and ru.objectdepartemenfk =16
				group by kls.namasiranap
					"));
            foreach ($data as $item) {
                $result[] = array(
                    'CONTENT' =>  $item->namasiranap,
                    'JLH' =>  (int)  $item->jml,
                );
            }
        }
        return $this->respond($result);
    }

    public function get($instalasi, Request $request)
    {
        $tgl = $request['tanggal'];
        $result = [];

        if ($instalasi == 'irj') {
            $data = DB::select(DB::raw("select x.namaruangan,	count(*) FILTER (WHERE x.objectkelompokpasienlastfk = 2 )   AS jkn,
					count(*) FILTER (WHERE x.objectkelompokpasienlastfk <> 2 )  AS nonjkn
					from 
					(
					select ru.namaruangan,pd.objectkelompokpasienlastfk,apd.norec 
					from pasiendaftar_t as pd 
					join antrianpasiendiperiksa_t as apd on apd.noregistrasifk =pd.norec
					join ruangan_m as ru on ru.id =apd.objectruanganfk
					where to_char(apd.tglregistrasi , 'DD-MM-YYYY') = '$tgl'
					and ru.objectdepartemenfk in(18,28,26,34,30)
					order by ru.namaruangan
					) as x GROUP BY x.namaruangan
					order by x.namaruangan
					"));
            foreach ($data as $item) {
                $result[] = array(
                    'KLINIK' => $item->namaruangan,
                    'JKN' => (int) $item->jkn,
                    'NON JKN' =>  (int)  $item->nonjkn,
                );
            }
        }
        if ($instalasi == 'igd') {
            $data = DB::select(DB::raw("select count(*) FILTER (WHERE x.objectkelompokpasienlastfk = 2 )   AS jkn,
					count(*) FILTER (WHERE x.objectkelompokpasienlastfk <> 2 )  AS nonjkn
					from 
					(
					select ru.namaruangan,pd.objectkelompokpasienlastfk,apd.norec 
					from pasiendaftar_t as pd 
					join antrianpasiendiperiksa_t as apd on apd.noregistrasifk =pd.norec
					join ruangan_m as ru on ru.id =apd.objectruanganfk
					where to_char(apd.tglregistrasi , 'DD-MM-YYYY') = '$tgl'
					and ru.objectdepartemenfk =24
					order by ru.namaruangan
					) as x 
					"));
            foreach ($data as $item) {
                $result  = array(
                    'JKN' => (int) $item->jkn,
                    'NON JKN' =>  (int)  $item->nonjkn,
                );
            }
        }
        if ($instalasi == 'iri') {
            $data = DB::select(DB::raw("select kls.namakelas,count(pd.norec) as jml 
				from pasiendaftar_t as pd 
				join ruangan_m as ru on ru.id =pd.objectruanganlastfk
				join kelas_m as kls on kls.id =pd.objectkelasfk
				where to_char(pd.tglregistrasi, 'DD-MM-YYYY') = '$tgl'
				and ru.objectdepartemenfk =16
				group by kls.namakelas
					"));
            foreach ($data as $item) {
                $result[] = array(
                    'CONTENT' =>  $item->namakelas,
                    'JLH' =>  (int)  $item->jml,
                );
            }
        }
        return $this->respond($result);
    }
    public function getDiagnosaRajal(Request $request)
    {
        $yM = $request['bulan'];
        if (isset($yM)) {
            $date = explode('-', $yM);
            $lengthBln = strlen($date[0]);
            $bln = $date[0];
            $thn = $date[1];
            if ($lengthBln == 1) {
                $bln = '0' . $date[0];
            }
            $blnThn = $bln . '-' . $thn;
        }
        //		return $blnThn;
        $data10 = [];
        $dataDiagnosa = DB::select(DB::raw("
		select x.kddiagnosa, count(x.kddiagnosa)as jumlah,x.tgldiagnosa from (
			select dm.kddiagnosa, 
			 dm.namadiagnosa, 
			 dp.norec, 
			 format(ddp.tglinputdiagnosa, 
			'dd-MM-yyyy') as tgldiagnosa
			 from antrianpasiendiperiksa_t as app
			 inner join diagnosapasien_t as dp on dp.noregistrasifk = app.norec
			 inner join detaildiagnosapasien_t as ddp on ddp.objectdiagnosapasienfk = dp.norec
			 inner join diagnosa_m as dm on ddp.objectdiagnosafk = dm.id
			 inner join ruangan_m as ru on ru.id = app.objectruanganfk
			 where ru.objectdepartemenfk in (18,28,26,34,30) and format(ddp.tglinputdiagnosa, 
			'MM-yyyy') = '$blnThn'
			and dm.kddiagnosa not in ('-')

			) as x
			group by x.kddiagnosa,x.tgldiagnosa
			order by x.kddiagnosa
			"));
        foreach ($dataDiagnosa as $item) {
            $data10[] = array(
                'ID_DIAG' => $item->kddiagnosa,
                'JUMLAH_KASUS' => $item->jumlah,
                'TANGGAL' => $item->tgldiagnosa,
            );
        }
        if (count($data10) != 0) {
            foreach ($data10 as $key => $row) {
                $count[$key] = $row['ID_DIAG'];
            }

            array_multisort($count, SORT_ASC, $data10);
        }



        return $this->respond($data10);
    }
    public function getDiagnosaRanap(Request $request)
    {
        $yM = $request['bulan'];
        if (isset($yM)) {
            $date = explode('-', $yM);
            $lengthBln = strlen($date[0]);
            $bln = $date[0];
            $thn = $date[1];
            if ($lengthBln == 1) {
                $bln = '0' . $date[0];
            }
            $blnThn = $bln . '-' . $thn;
        }
        //		return $blnThn;
        $dataDiagnosa = DB::select(DB::raw("
		select x.kddiagnosa, count(x.kddiagnosa)as jumlah,x.tgldiagnosa from (
			select dm.kddiagnosa, 
			 dm.namadiagnosa, 
			 dp.norec, 
			 format(ddp.tglinputdiagnosa, 
			'dd-MM-yyyy') as tgldiagnosa
			 from antrianpasiendiperiksa_t as app
			 inner join diagnosapasien_t as dp on dp.noregistrasifk = app.norec
			 inner join detaildiagnosapasien_t as ddp on ddp.objectdiagnosapasienfk = dp.norec
			 inner join diagnosa_m as dm on ddp.objectdiagnosafk = dm.id
			 inner join ruangan_m as ru on ru.id = app.objectruanganfk
			 where ru.objectdepartemenfk in (16,17,35,26) and format(ddp.tglinputdiagnosa, 
			'MM-yyyy') = '$blnThn'
			and dm.kddiagnosa not in ('-') and
			dm.kddiagnosa !=''
			) as x
			group by x.kddiagnosa,x.tgldiagnosa
			order by x.kddiagnosa
			"));
        foreach ($dataDiagnosa as $item) {
            $data10[] = array(
                'ID_DIAG' => $item->kddiagnosa,
                'JUMLAH_KASUS' => $item->jumlah,
                'TANGGAL' => $item->tgldiagnosa,
            );
        }

        foreach ($data10 as $key => $row) {
            $count[$key] = $row['ID_DIAG'];
        }

        array_multisort($count, SORT_ASC, $data10);


        return $this->respond($data10);
    }
    public function getdataBOR(Request $request)
    {
        $yM = $request['bulan'];
        if (isset($yM)) {
            $date = explode('-', $yM);
            $lengthBln = strlen($date[0]);
            $bln = $date[0];
            $blnKode = (int)$date[0];
            $thn = $date[1];
            if ($lengthBln == 1) {
                $bln = '0' . $date[0];
            }
            $blnThn = $bln . '-' . $thn;
        }
        $jmlHari = cal_days_in_month(CAL_GREGORIAN, $bln, $thn);

        $dateStart = Carbon::now();
        $dayInMonth = array();
        $type = CAL_GREGORIAN;

        $month = $bln; // Carbon::parse($blnKode)->format('m'); // Month ID, 1 through to 12.

        $year = $thn; // Carbon::parse($blnKode)->format('Y'); //date('Y'); // Year in 4 digit 2009 format.
        $day_count = cal_days_in_month($type, $month, $year); // Get the amount of days\
        // return $day_count ;
        $hp = 0;
        for ($i = 1; $i <= $day_count; $i++) {
            $date = $year . '/' . $month . '/' . $i; //format date
            $get_name = date('l', strtotime($date)); //get week day
            $day_name = substr($get_name, 0, 3); // Trim day name to 3 chars

            //if not a weekend add day to array
            //            if($day_name != 'Sun' && $day_name != 'Sat'){
            $strLength = strlen($i);
            if ($strLength  == 1) {
                $i = '0' . $i;
            }

            $dayInMonth[] = $thn . '-' . $month . '-' . $i; // date ('Y-'.$month.'-'.$i);

            $tglAwal = $thn . '-' . $month . '-' . $i . ' 00:00';
            $tglAkhir = $thn . '-' . $month . '-' . $i . ' 23:59';

            $pasien = DB::select(DB::raw(
                "
		     
                    SELECT
                        pd.noregistrasi,
                        pd.tglregistrasi,
                        pd.tglpulang
                    FROM
                        pasiendaftar_t AS pd
                    INNER JOIN ruangan_m AS ru ON ru.ID = pd.objectruanganlastfk
                    WHERE
                    ru.objectdepartemenfk = 16  and(
                     pd.tglregistrasi  < '$tglAwal' 
                    and pd.tglpulang  >= '$tglAkhir' 
                    )
                 OR (pd.tglpulang IS NULL and pd.tglregistrasi < '$tglAkhir') 
                    and pd.statusenabled = 1 "
            ));
            $hp =   $hp + count($pasien);
        }

        $data10 = [];
        $jumlahTT = 0;
        $jmlHariPerawatan = 0;
        $dataTT =  DB::select(DB::raw("SELECT
				COUNT (x.id) AS jml
			FROM
				(
					SELECT
						tt.id,
						ru.id AS idruangan,
						ru.namaruangan,
						km.id AS idkamar,
						km.namakamar,
						kl.id AS idkelas,
						kl.namakelas
					FROM
						tempattidur_m AS tt
					LEFT JOIN kamar_m AS km ON km.id = tt.objectkamarfk
					LEFT JOIN ruangan_m AS ru ON ru.id = km.objectruanganfk
					LEFT JOIN kelas_m AS kl ON kl.id = km.objectkelasfk
					WHERE
						ru.objectdepartemenfk IN (16, 35)
					AND ru.statusenabled = 1
					AND km.statusenabled = 1
					AND tt.statusenabled = 1
				) AS x"));
        if (count($dataTT) > 0) {
            $jumlahTT = $dataTT[0]->jml;
        }

        /** @var  $bor = (Jumlah hari perawatn RS dibagi ( jumlah TT x Jumlah hari dalam satu periode ) ) x 100 % */

        $bor = ($hp / ((float)$jumlahTT  * (float)$day_count)) * 100;
        $data10['BOR'] = (float) number_format($bor, 2);

        return $this->respond($data10);
    }
    public function postBedDinkesJKT(Request $r)
    {
        $q = collect(DB::select("
                select sum(kapasitas_vip) kapasitas_vip, sum(kapasitas_kelas_1) kapasitas_kelas_1, 
                sum(kapasitas_kelas_2) kapasitas_kelas_2, sum(kapasitas_kelas_3) kapasitas_kelas_3, sum(kapasitas_hcu) kapasitas_hcu, 
                sum(kapasitas_iccu) kapasitas_iccu, sum(kapasitas_icu_negatif_ventilator) kapasitas_icu_negatif_ventilator, sum(kosong_icu_negatif_tanpa_ventilator) kosong_icu_negatif_tanpa_ventilator, 
                sum(kosong_isolasi_negatif) kosong_isolasi_negatif, sum(kosong_isolasi_tanpa_negatif) kosong_isolasi_tanpa_negatif, 
                sum(kosong_nicu_covid) kosong_nicu_covid, 
                sum(kosong_perina_covid) kosong_perina_covid, sum(kosong_picu_covid) kosong_picu_covid, 
                sum(kosong_ok_covid) kosong_ok_covid, 
                sum(kosong_hd_covid) kosong_hd_covid,
                sum(kosong_vip)kosong_vip,sum(kosong_hcu)kosong_hcu,sum(kosong_iccu)kosong_iccu,sum(kosong_icu_negatif_ventilator)kosong_icu_negatif_ventilator,
                sum(kosong_icu_tanpa_negatif_ventilator)kosong_icu_tanpa_negatif_ventilator,sum(kosong_icu_tanpa_negatif_tanpa_ventilator)kosong_icu_tanpa_negatif_tanpa_ventilator,
                sum(kapasitas_icu_negatif_tanpa_ventilator) kapasitas_icu_negatif_tanpa_ventilator,
                sum(kapasitas_icu_tanpa_negatif_ventilator)kapasitas_icu_tanpa_negatif_ventilator,
                sum(kapasitas_icu_tanpa_negatif_tanpa_ventilator)kapasitas_icu_tanpa_negatif_tanpa_ventilator,
                sum(kapasitas_isolasi_negatif)kapasitas_isolasi_negatif,
                sum(kapasitas_isolasi_tanpa_negatif)kapasitas_isolasi_tanpa_negatif,
                sum(kapasitas_nicu_covid)kapasitas_nicu_covid,
                sum(kapasitas_perina_covid)kapasitas_perina_covid,
                sum(kapasitas_picu_covid)kapasitas_picu_covid,
                sum(kapasitas_ok_covid)kapasitas_ok_covid,
                sum(kapasitas_hd_covid)kapasitas_hd_covid,
                sum(kosong_kelas_1)kosong_kelas_1, sum(kosong_kelas_2)kosong_kelas_2, sum(kosong_kelas_3)kosong_kelas_3
                from (
                SELECT
                case when kl.id in (4,5,7,8) then 1 else 0 end as kapasitas_vip,
                case when kl.id in (3) then 1 else 0 end as kapasitas_kelas_1,
                case when kl.id in (2) then 1 else 0 end as kapasitas_kelas_2,
                case when kl.id in (1) then 1 else 0 end as kapasitas_kelas_3,
                0 as kapasitas_hcu,0 as kapasitas_iccu,0 as kapasitas_icu_negatif_ventilator,
                0 as kapasitas_icu_negatif_tanpa_ventilator,
                0 as kapasitas_icu_tanpa_negatif_ventilator,0 as kapasitas_isolasi_negatif,
                0 as kapasitas_isolasi_tanpa_negatif,0 as kapasitas_nicu_covid,0 as kapasitas_perina_covid,
                0 as kapasitas_picu_covid,0 as kapasitas_ok_covid,0 as kapasitas_hd_covid,
                0 as kapasitas_icu_tanpa_negatif_tanpa_ventilator,
                case when sb.id=2 and kl.id in (4,5,7,8)  then 1 else 0 end as kosong_vip,
                case when sb.id=2 and kl.id in (3)  then 1 else 0 end as kosong_kelas_1,
                case when sb.id=2 and kl.id in (2)  then 1 else 0 end as kosong_kelas_2,
                case when sb.id=2 and kl.id in (1)  then 1 else 0 end as kosong_kelas_3,
                0 as kosong_hcu,0 as kosong_iccu,0 as kosong_icu_negatif_ventilator,
                0 as kosong_icu_negatif_tanpa_ventilator,0 as kosong_icu_tanpa_negatif_ventilator,
                0 as kosong_icu_tanpa_negatif_tanpa_ventilator,0 as kosong_isolasi_negatif,0 as kosong_isolasi_tanpa_negatif,
                0 as kosong_nicu_covid,0 as kosong_perina_covid,0 as kosong_picu_covid,
                0 as kosong_ok_covid,0 as kosong_hd_covid
                FROM
                        tempattidur_m AS tt
                LEFT JOIN statusbed_m AS sb ON sb.id = tt.objectstatusbedfk
                LEFT JOIN kamar_m AS kmr ON kmr.id = tt.objectkamarfk
                LEFT JOIN ruangan_m AS ru ON ru.id = kmr.objectruanganfk
                LEFT JOIN kelas_m AS kl ON kl.id = kmr.objectkelasfk
                WHERE 
                        tt.statusenabled = 1
                and kmr.statusenabled=1 
                ) as x"))->first();
        $fields = array(
            'kapasitas_vip' => $q->kapasitas_vip != null ? $q->kapasitas_vip : 0,
            'kapasitas_kelas_1_l' =>  $q->kapasitas_kelas_1 != null ? round($q->kapasitas_kelas_1 / 2) : 0,
            'kapasitas_kelas_2_l' =>  $q->kapasitas_kelas_2 != null ? round($q->kapasitas_kelas_2 / 2) : 0,
            'kapasitas_kelas_3_l' => $q->kapasitas_kelas_3 != null ? round($q->kapasitas_kelas_3 / 2) : 0,
            'kapasitas_kelas_1_p' =>  $q->kapasitas_kelas_1 != null ? floor($q->kapasitas_kelas_1 / 2) : 0,
            'kapasitas_kelas_2_p' =>  $q->kapasitas_kelas_2 != null ? floor($q->kapasitas_kelas_2 / 2) : 0,
            'kapasitas_kelas_3_p' =>   $q->kapasitas_kelas_3 != null ? floor($q->kapasitas_kelas_3 / 2) : 0,
            'kapasitas_hcu' =>  $q->kapasitas_hcu != null ? $q->kapasitas_hcu : 0,
            'kapasitas_iccu' =>  $q->kapasitas_iccu != null ? $q->kapasitas_iccu : 0,
            'kapasitas_icu_negatif_ventilator' =>  $q->kapasitas_icu_negatif_ventilator != null ? $q->kapasitas_icu_negatif_ventilator : 0,
            'kapasitas_icu_negatif_tanpa_ventilator' =>  $q->kapasitas_icu_negatif_tanpa_ventilator != null ? $q->kapasitas_icu_negatif_tanpa_ventilator : 0,
            'kapasitas_icu_tanpa_negatif_ventilator' =>  $q->kapasitas_icu_tanpa_negatif_ventilator != null ? $q->kapasitas_icu_tanpa_negatif_ventilator : 0,
            'kapasitas_icu_tanpa_negatif_tanpa_ventilator' => $q->kapasitas_icu_tanpa_negatif_tanpa_ventilator != null ? $q->kapasitas_icu_tanpa_negatif_tanpa_ventilator : 0,
            'kapasitas_isolasi_negatif' => $q->kapasitas_isolasi_negatif != null ? $q->kapasitas_isolasi_negatif : 0,
            'kapasitas_isolasi_tanpa_negatif' =>  $q->kapasitas_isolasi_tanpa_negatif != null ? $q->kapasitas_isolasi_tanpa_negatif : 0,
            'kapasitas_nicu_covid' =>  $q->kapasitas_nicu_covid != null ? $q->kapasitas_nicu_covid : 0,
            'kapasitas_perina_covid' =>  $q->kapasitas_perina_covid != null ? $q->kapasitas_perina_covid : 0,
            'kapasitas_picu_covid' =>  $q->kapasitas_picu_covid != null ? $q->kapasitas_picu_covid : 0,
            'kapasitas_ok_covid' =>  $q->kapasitas_ok_covid != null ? $q->kapasitas_ok_covid : 0,
            'kapasitas_hd_covid' => $q->kapasitas_hd_covid != null ? $q->kapasitas_hd_covid : 0,
            'kosong_vip' =>  $q->kosong_vip != null ? $q->kosong_vip : 0,
            'kosong_kelas_1_l' =>  $q->kosong_kelas_1 != null ? round($q->kosong_kelas_1 / 2) : 0,
            'kosong_kelas_2_l' =>  $q->kosong_kelas_2 != null ? round($q->kosong_kelas_2 / 2) : 0,
            'kosong_kelas_3_l' => $q->kosong_kelas_3 != null ? round($q->kosong_kelas_3 / 2) : 0,
            'kosong_kelas_1_p' =>  $q->kosong_kelas_1 != null ? floor($q->kosong_kelas_1 / 2) : 0,
            'kosong_kelas_2_p' =>  $q->kosong_kelas_2 != null ? floor($q->kosong_kelas_2 / 2) : 0,
            'kosong_kelas_3_p' =>  $q->kosong_kelas_3 != null ? floor($q->kosong_kelas_3 / 2) : 0,
            'kosong_hcu' =>  $q->kosong_hcu != null ? $q->kosong_hcu : 0,
            'kosong_iccu' =>  $q->kosong_iccu != null ? $q->kosong_iccu : 0,
            'kosong_icu_negatif_ventilator' => $q->kosong_icu_negatif_ventilator != null ? $q->kosong_icu_negatif_ventilator : 0,
            'kosong_icu_negatif_tanpa_ventilator' => $q->kosong_icu_negatif_tanpa_ventilator != null ? $q->kosong_icu_negatif_tanpa_ventilator : 0,
            'kosong_icu_tanpa_negatif_ventilator' =>  $q->kosong_icu_tanpa_negatif_ventilator != null ? $q->kosong_icu_tanpa_negatif_ventilator : 0,
            'kosong_icu_tanpa_negatif_tanpa_ventilator' =>  $q->kosong_icu_tanpa_negatif_tanpa_ventilator != null ? $q->kosong_icu_tanpa_negatif_tanpa_ventilator : 0,
            'kosong_isolasi_negatif' =>  $q->kosong_isolasi_negatif != null ? $q->kosong_isolasi_negatif : 0,
            'kosong_isolasi_tanpa_negatif' =>  $q->kosong_isolasi_tanpa_negatif != null ? $q->kosong_isolasi_tanpa_negatif : 0,
            'kosong_nicu_covid' =>  $q->kosong_nicu_covid != null ? $q->kosong_nicu_covid : 0,
            'kosong_perina_covid' =>  $q->kosong_perina_covid != null ? $q->kosong_perina_covid : 0,
            'kosong_picu_covid' =>  $q->kosong_picu_covid != null ? $q->kosong_picu_covid : 0,
            'kosong_ok_covid' =>  $q->kosong_ok_covid != null ? $q->kosong_ok_covid : 0,
            'kosong_hd_covid' =>  $q->kosong_hd_covid != null ? $q->kosong_hd_covid : 0,
        );
        //        dd($fields);
        $dataJsonSend = json_encode($fields);

        $headers =  $this->headerDinkesJKT();
        $response = $this->sendBridgingCurl($headers, $dataJsonSend, $this->url_dinkes_jkt, 'POST');
        return $this->respond($response);
    }
    function headerDinkesJKT()
    {
        $user = '3172072';
        $password = '$2y$10$527Uvx6RwF8Gw6ycge7F6.1bHXvqfcQKPTgSZcb0P.9xWR0ufH8t.';
        $header = [
            "Api-Bed-User: " . $user,
            "Api-Bed-Key: " . $password,
            "Content-type: application/json",
        ];
        return $header;
    }
    public function getBedDinkes(Request $r)
    {
        $headers =  $this->headerDinkesJKT();
        $response = $this->sendBridgingCurl($headers, null, $this->url_dinkes_jkt, 'GET');
        return $this->respond($response);
    }
    public function deleteBedDinkes(Request $r)
    {
        $headers =  $this->headerDinkesJKT();
        $response = $this->sendBridgingCurl($headers, null, $this->url_dinkes_jkt, 'DELETE');
        return $this->respond($response);
    }

    public function PasienMasuk($method, Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers =  $this->getHeadersCovid($kdProfile);
        if ($method == 'post') {
            $now = date('Y-m-d');
            if (isset($request['tgl'])) {
                $now  = $request['tgl'];
            }
            $query = collect(DB::select("SELECT sum(x.igd_confirm_p) as igd_confirm_p,
				sum(x.igd_confirm_l)as igd_confirm_l,
				sum(x.rj_confirm_l) as rj_confirm_l,
				sum(x.rj_confirm_p) as rj_confirm_p,
				sum(x.ri_confirm_l) as ri_confirm_l,
				sum(x.ri_confirm_p) as ri_confirm_p,
				sum(x.igd_suspect_p) as igd_suspect_p,
				sum(x.igd_suspect_l)as igd_suspect_l,
				sum(x.rj_suspect_l) as rj_suspect_l,
				sum(x.rj_suspect_p) as rj_suspect_p,
				sum(x.ri_suspect_l) as ri_suspect_l,
				sum(x.ri_suspect_p) as ri_suspect_p 
				FROM(select pd.noregistrasi,dg.kddiagnosa, case when dg.kddiagnosa= 'B34.2' and ru.objectdepartemenfk=24 and ps.objectjeniskelaminfk =1  then 1 else 0 end as igd_confirm_l,
					case when dg.kddiagnosa= 'B34.2'  and ru.objectdepartemenfk=24 and ps.objectjeniskelaminfk =2  then 1 else 0 end as igd_confirm_p,
					case when dg.kddiagnosa= 'B34.2' and ru.objectdepartemenfk in(16,35) and ps.objectjeniskelaminfk =1  then 1 else 0 end as ri_confirm_l,
					case when dg.kddiagnosa= 'B34.2' and ru.objectdepartemenfk in(16,35)  and ps.objectjeniskelaminfk =2  then 1 else 0 end as ri_confirm_p,
					case when dg.kddiagnosa= 'B34.2' and ru.objectdepartemenfk=18 and ps.objectjeniskelaminfk =1  then 1 else 0 end as rj_confirm_l,
					case when dg.kddiagnosa= 'B34.2' and ru.objectdepartemenfk=18 and ps.objectjeniskelaminfk =2  then 1 else 0 end as rj_confirm_p,

				case when dg.kddiagnosa= 'Z03.8' and ru.objectdepartemenfk=24 and ps.objectjeniskelaminfk =1  then 1 else 0 end as igd_suspect_l,
					case when dg.kddiagnosa= 'Z03.8'  and ru.objectdepartemenfk=24 and ps.objectjeniskelaminfk =2  then 1 else 0 end as igd_suspect_p,
					case when dg.kddiagnosa= 'Z03.8' and ru.objectdepartemenfk in(16,35) and ps.objectjeniskelaminfk =1  then 1 else 0 end as ri_suspect_l,
					case when dg.kddiagnosa= 'Z03.8'  and ru.objectdepartemenfk in(16,35)  and ps.objectjeniskelaminfk =2  then 1 else 0 end as ri_suspect_p,
					case when dg.kddiagnosa= 'Z03.8'  and ru.objectdepartemenfk=18 and ps.objectjeniskelaminfk =1  then 1 else 0 end as rj_suspect_l,
					case when dg.kddiagnosa= 'Z03.8'  and ru.objectdepartemenfk=18 and ps.objectjeniskelaminfk =2  then 1 else 0 end as rj_suspect_p,
				row_number() over (partition by pd.noregistrasi order by ddg.tglinputdiagnosa ASC) as rownum 
                
                FROM
                                
                pasiendaftar_t as pd
                                inner JOIN antrianpasiendiperiksa_t as apd ON apd.noregistrasifk = pd.norec
                                INNER JOIN diagnosapasien_t as dgp ON dgp.noregistrasifk = apd.norec
                                INNER JOIN detaildiagnosapasien_t as ddg ON ddg.objectdiagnosapasienfk = dgp.norec
                                INNER JOIN diagnosa_m as dg ON dg.id = ddg.objectdiagnosafk
                inner join ruangan_m as ru on ru.id=apd.objectruanganfk
                                inner join pasien_m as ps on ps.id=pd.nocmfk
                WHERE
                pd.kdprofile=16
                and pd.statusenabled =true
                                and ddg.objectjenisdiagnosafk = '1'
                                and ddg.kdprofile = 16
                and pd.tglregistrasi BETWEEN'$now 00:00'
                AND '$now 23:59'  ) AS X
				WHERE X.rownum = 1"))->first();
            $methods = 'POST';
            $arr = array(
                "tanggal" =>  $now,
                "igd_suspect_l" => isset($query->igd_suspect_l) && $query->igd_suspect_l != null ? $query->igd_suspect_l : 0,
                "igd_suspect_p" => isset($query->igd_suspect_p) && $query->igd_suspect_p != null ? $query->igd_suspect_p : 0,
                "igd_confirm_l" => isset($query->igd_confirm_l) && $query->igd_confirm_l != null ? $query->igd_confirm_l : 0,
                "igd_confirm_p" => isset($query->igd_confirm_p) && $query->igd_confirm_p != null ? $query->igd_confirm_p : 0,
                "rj_suspect_l" => isset($query->rj_suspect_l) && $query->rj_suspect_l != null ? $query->rj_suspect_l : 0,
                "rj_suspect_p" => isset($query->rj_suspect_p) && $query->rj_suspect_p != null ? $query->rj_suspect_p : 0,
                "rj_confirm_l" => isset($query->rj_confirm_l) && $query->rj_confirm_l != null ? $query->rj_confirm_l : 0,
                "rj_confirm_p" => isset($query->rj_confirm_p) && $query->rj_confirm_p != null ? $query->rj_confirm_p : 0,
                "ri_suspect_l" => isset($query->ri_suspect_l) && $query->ri_suspect_l != null ? $query->ri_suspect_l : 0,
                "ri_suspect_p" => isset($query->ri_suspect_p) && $query->ri_suspect_p != null ? $query->ri_suspect_p : 0,
                "ri_confirm_l" => isset($query->ri_confirm_l) && $query->ri_confirm_l != null ? $query->ri_confirm_l : 0,
                "ri_confirm_p" => isset($query->ri_confirm_p) && $query->ri_confirm_p != null ? $query->ri_confirm_p : 0,
            );
            //                        return $this->respond($arr);
            $dataJsonSend = json_encode($arr);
        } else if ($method == 'get') {
            $methods = 'GET';
            $dataJsonSend = null;
        } else if ($method == 'delete') {
            $methods = 'DELETE';
            $now = date('Y-m-d');
            if (isset($request['tgl'])) {
                $now  = $request['tgl'];
            }
            $arr = array(
                "tanggal" => $now,
            );
            $dataJsonSend = json_encode($arr);
        }
        $url = "http://sirs.kemkes.go.id/fo/index.php/LapV2/PasienMasuk";
        $response = $this->sendBridgingCurl($headers, $dataJsonSend, $url, $methods);
        return $this->respond($response);
    }

    function getHeadersCovid($kdProfile)
    {
        $user = '3172072'; //polri
        $password = 'S!rs2020!!'; //

        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        $header = [
            "X-rs-id: " . $user,
            "X-Timestamp: " . $tStamp,
            "X-pass: " . $password,
            "Content-type: application/json",
        ];
        return $header;
    }

    public function getRefTT(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers =  $this->getHeadersCovid($kdProfile);
        $dataJsonSend = null;
        $methods = 'GET';
        $url = "http://sirs.kemkes.go.id/fo/index.php/Referensi/tempat_tidur";
        $response = $this->sendBridgingCurl($headers, $dataJsonSend, $url, $methods);
        return $this->respond($response);
    }
    public function getRefUsia(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers =  $this->getHeadersCovid($kdProfile);
        $dataJsonSend = null;
        $methods = 'GET';
        $url = "http://sirs.kemkes.go.id/fo/index.php/Referensi/usia_meninggal_probable";
        $response = $this->sendBridgingCurl($headers, $dataJsonSend, $url, $methods);
        return $this->respond($response);
    }


    public function getReffSDM(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers =  $this->getHeadersCovid($kdProfile);
        $dataJsonSend = null;
        $methods = 'GET';
        $url = "http://sirs.kemkes.go.id/fo/index.php/Referensi/kebutuhan_sdm";
        $response = $this->sendBridgingCurl($headers, $dataJsonSend, $url, $methods);
        return $this->respond($response);
    }


    // BIOS
    // public function deleteBedDinkes(Request $r)
    // {
    //     $headers =  $this->headerDinkesJKT();
    //     $response = $this->sendBridgingCurl($headers, null, $this->url_dinkes_jkt, 'DELETE');
    //     return $this->respond($response);
    // }
    public function getToken(Request $request)
    {
        // return ('x');
        // die();

        $satker = $this->getSatker();
        $secretKey = $this->getPasswordConsumerBios();

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => "80",
            // CURLOPT_URL => $this->getUrlBios() . "token" . '?satker=' . $satker . '$key=' . $secretKey,
            CURLOPT_URL => "http://training-bios2.kemenkeu.go.id/api/token?satker=648261&key=ueyX84m1MZdSESlc3Ky3YRJ6eah3tjjA",
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/SEP/".$request['nosep'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json; charset=utf-8",
            ),
            // CURLOPT_HTTPHEADER => array(
            //     "Cache-Control: no-cache",
            //     "Content-Type: Application/x-www-form-urlencoded",
            //     //                "Postman-Token: 07c605ad-c672-6e5b-562e-7cee1f9cd0ea",
            //     "X-cons-id: " .  (string)$data,
            //     "X-signature: " . (string)$encodedSignature,
            //     "X-timestamp: " . (string)$tStamp
            // ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);
    }
    // public function jumlahpasienrawatinap3(Request $request)
    // {
    //     $q = collect(DB::select("
    //     SELECT count(noregistrasi) as total, kelas_m.namakelas
    //     FROM     pasiendaftar_t INNER JOIN
    //                       antrianpasiendiperiksa_t ON pasiendaftar_t.norec = antrianpasiendiperiksa_t.noregistrasifk INNER JOIN
    //                       kelas_m ON antrianpasiendiperiksa_t.objectkelasfk = kelas_m.id INNER JOIN
    //                       ruangan_m ON antrianpasiendiperiksa_t.objectruanganfk = ruangan_m.id
    //     WHERE  (pasiendaftar_t.tglregistrasi < '2021-04-06 00:00:00') AND (pasiendaftar_t.tglpulang > '2021-04-06 00:00:00') AND (pasiendaftar_t.statusenabled = 1)
    //     and ruangan_m.objectdepartemenfk='16'
    //     group by namakelas"));
    //     foreach ($q as $item) {
    //         $results[] = array(
    //             'kelas' => '01',
    //             'jml_hari' => 1,
    //             'jml_pasien' => 2,
    //             'tgl_transaksi' => '2021-07-29'
    //         );
    //     }
    //     $dataJsonSend = json_encode($results);
    //     $headers = [
    //         "token: " . $request['token'],
    //         "Content-type: application/json",
    //     ];
    //     // return ($dataJsonSend);
    //     // die();
    //     // $headers =  $this->headerDinkesJKT();
    //     // https://training-bios2.kemenkeu.go.id/api/ws/kesehatan/prod
    //     $url = $this->getUrlBios() . 'ws/kesehatan/prod';
    //     // return ($url);
    //     // die();
    //     $response = $this->sendBridgingCurl($headers, $dataJsonSend, $url, 'POST');
    //     return $this->respond($response);
    // }
    public function jumlahpasienrawatinap(Request $request)
    {
        $tglAwal = $request['tglawal'];
        $tglAkhir = $request['tglakhir'];
        $q = DB::select("
        SELECT count(noregistrasi) as total,kelas_m.kodebios
        FROM     pasiendaftar_t INNER JOIN
                          antrianpasiendiperiksa_t ON pasiendaftar_t.norec = antrianpasiendiperiksa_t.noregistrasifk INNER JOIN
                          kelas_m ON antrianpasiendiperiksa_t.objectkelasfk = kelas_m.id INNER JOIN
                          ruangan_m ON antrianpasiendiperiksa_t.objectruanganfk = ruangan_m.id
        WHERE  (pasiendaftar_t.tglregistrasi < '$tglAwal') AND (pasiendaftar_t.tglpulang > '$tglAkhir') AND (pasiendaftar_t.statusenabled = 1)
        and ruangan_m.objectdepartemenfk='16'
        group by kodebios");

        foreach ($q as $value) {
            // return ($value->kodebios);
            // die();
            $arr = array(
                "kelas" =>  $value->kodebios,
                "jml_hari" =>  1,
                "jml_pasien" =>  $value->total,
                "tgl_transaksi" =>  $request['tgltransaksi'],
            );
            $dataJsonSend = json_encode($arr);
            $headers = [
                "token: " . $request['token'],
                "Content-type: application/json",
            ];
            $url = $this->getUrlBios() . 'ws/kesehatan/prod';
            $response = $this->sendBridgingCurl($headers, $dataJsonSend, $url, 'POST');
            return $this->respond($response);
        }
    }
    public function jumlahpasienrawatinap2(Request $request)
    {
        $tglAwal = $request['tglawal'];
        $tglAkhir = $request['tglakhir'];
        $arr = array(
            "kelas" =>  $request['kelas'],
            "jml_hari" =>  1,
            "jml_pasien" =>  $request['jmlpasien'],
            "tgl_transaksi" =>  $request['tgltransaksi'],
        );
        $dataJsonSend = json_encode($arr);
        $headers = [
            "token: " . $request['token'],
            "Content-type: application/json",
        ];
        $url = $this->getUrlBios() . 'ws/kesehatan/prod';
        $response = $this->sendBridgingCurl($headers, $dataJsonSend, $url, 'POST');
        return $this->respond($response);
    }
    public function simpanpenerimaan(Request $request)
    {
       


        $arr = array(
            "kd_akun" =>  $request['kode'],
            "jumlah" =>  $request['jumlah'],
            "tgl_transaksi" =>  $request['tgltransaksi'],
        );
        $dataJsonSend = json_encode($arr);
        $headers = [
            "token: " . $request['token'],
            "Content-type: application/json",
        ];
        $url = $this->getUrlBios() . 'ws/penerimaan/prod';
        $response = $this->sendBridgingCurl($headers, $dataJsonSend, $url, 'POST');
       
        if ($response->message == "Data berhasil disimpan") {
          
            DB::beginTransaction();
            try {
                $x = \DB::table('bioskeuangan')
                    ->select('norec')
                    ->where('tgltransaksi', $request['tgltransaksi'])
                    ->where('kode', $request['kode'])
                    ->get();
                $norec = '';
                foreach ($x as $epic) {
                    $norec = $epic->norec;
                }
                if ($norec == '') {
                    $dataSC = new Bioskeuangan();
                    $dataSC->norec = $dataSC->generateNewId();
                } else {
                    $dataSC = Bioskeuangan::where('norec', $norec)->first();
                }

                $dataSC->tgltransaksi = $request['tgltransaksi'];
                $dataSC->uraian = $request['uraian'];
                $dataSC->kode = $request['kode'];
                $dataSC->jumlah = $request['jumlah'];
                $dataSC->jenis = "Penerimaan";
                $dataSC->save();
                $transStatus = 'true';
            } catch (\Exception $e) {
                $transStatus = 'false';
            }
        } else {
            return $this->setStatusCode(400)->respond($response, $response->message);
        }

        if ($transStatus == 'true') {
            $transMessage = " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "resepones" =>   $response,
                // "data" => count($dataSave),
                // "norecsc" => $norecSC,
                // "request" => $rq,
                "by" => 'as@epic',
            );
        } else {
            $transMessage = " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        // return $this->respond($response);
    }
    public function simpanpengeluaran(Request $request)
    {
       

        $arr = array(
            "kd_akun" =>  $request['kode'],
            "jumlah" =>  $request['jumlah'],
            "tgl_transaksi" =>  $request['tgltransaksi'],
        );
        $dataJsonSend = json_encode($arr);
        $headers = [
            "token: " . $request['token'],
            "Content-type: application/json",
        ];
        $url = $this->getUrlBios() . 'ws/pengeluaran/prod';
        $response = $this->sendBridgingCurl($headers, $dataJsonSend, $url, 'POST');
        if ($response->message == "Data berhasil disimpan") {
            DB::beginTransaction();
            try {
                $x = \DB::table('bioskeuangan')
                ->select('norec')
                ->where('tgltransaksi', $request['tgltransaksi'])
                ->where('kode', $request['kode'])
                ->get();
                $norec = '';
                foreach ($x as $epic) {
                    $norec = $epic->norec;
                }
                if ($norec == '') {
                    $dataSC = new Bioskeuangan();
                    $dataSC->norec = $dataSC->generateNewId();
                } else {
                    $dataSC = Bioskeuangan::where('norec', $norec)->first();
                }

                $dataSC->tgltransaksi = $request['tgltransaksi'];
                $dataSC->uraian = $request['uraian'];
                $dataSC->kode = $request['kode'];
                $dataSC->jumlah = $request['jumlah'];
                $dataSC->jenis = "Pengeluaran";
                $dataSC->save();
                $transStatus = 'true';
            } catch (\Exception $e) {
                $transStatus = 'false';
            }
        } else {
            return $this->setStatusCode(400)->respond($response, $response->message);
        }
        if ($transStatus == 'true') {
            $transMessage = " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "resepones" =>   $response,
                // "data" => count($dataSave),
                // "norecsc" => $norecSC,
                // "request" => $rq,
                "by" => 'as@epic',
            );
        } else {
            $transMessage = " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function simpansaldoawal(Request $request)
    {   
     
        $arr = array(
            "kd_bank" =>  $request['kd_bank'],
            "kd_rek" =>  $request['kd_rekening'],
            "norek" =>  $request['norek'],
            "saldo" =>  $request['saldo'],
            "tgl_transaksi" =>  $request['tgltransaksi'],
        );
        $dataJsonSend = json_encode($arr);
        $headers = [
            "token: " . $request['token'],
            "Content-type: application/json",
        ];
        $url = $this->getUrlBios() . 'ws/saldo/prod';
        $response = $this->sendBridgingCurl($headers, $dataJsonSend, $url, 'POST');
        if ($response->message == "Data berhasil disimpan") {
            DB::beginTransaction();
            try {
                $x = \DB::table('biossaldo')
                    ->select('norec')
                    ->where('tgltransaksi', $request['tgltransaksi'])
                    ->where('kdbank', $request['kd_bank'])
                    ->where('kdrek', $request['kd_rekening'])
                    ->where('norek', $request['norek'])
                    ->get();
                $norec = '';
                foreach ($x as $epic) {
                    $norec = $epic->norec;
                }
                if ($norec == '') {
                    $dataSC = new Biossaldo();
                    $dataSC->norec = $dataSC->generateNewId();
                } else {
                    $dataSC = Biossaldo::where('norec', $norec)->first();
                }

                $dataSC->tgltransaksi = $request['tgltransaksi'];
                $dataSC->kdbank = $request['kd_bank'];
                $dataSC->namabank = $request['namabank'];
                $dataSC->kdrek = $request['kd_rekening'];
                $dataSC->rekening = $request['rekening'];
                $dataSC->norek = $request['norek'];
                $dataSC->saldo = $request['saldo'];
                $dataSC->save();
                $transStatus = 'true';
            } catch (\Exception $e) {
                $transStatus = 'false';
            }
        }else{
            return $this->setStatusCode(400)->respond($response, $response->message);           
        }
       

       
        if ($transStatus == 'true') {
            $transMessage = " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "resepones" =>   $response,
                "by" => 'as@epic',
            );
        } else {
            $transMessage = " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    // public function jumlahpasienrawatinap(Request $request)
    // {
    //     // $data = $this->getIdConsumerBPJS();
    //     $curl = curl_init();
    //     $url = $this->getUrlBios() . 'ws/kesehatan/prod';
    //     $headers = [
    //         "token: " . $request['token'],
    //         "Content-type: application/json",
    //     ];
    //     curl_setopt_array($curl, array(
    //         CURLOPT_PORT => $this->getPortBrigdingBPJS(),
    //         // CURLOPT_URL => $this->getUrlBrigdingBPJS() . "SEP/insert",
    //         CURLOPT_URL => $url,
    //         //                CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/SEP/insert",
    //         CURLOPT_RETURNTRANSFER => true,
    //         CURLOPT_ENCODING => "",
    //         CURLOPT_MAXREDIRS => 10,
    //         CURLOPT_TIMEOUT => 30,
    //         CURLOPT_SSL_VERIFYHOST => 0,
    //         CURLOPT_SSL_VERIFYPEER => 0,
    //         CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    //         CURLOPT_CUSTOMREQUEST => "POST",
    //         CURLOPT_POSTFIELDS =>
    //         "{  \r\n\"Kelas\": \"" . '01' . "\",
    //             \r\n\"jml_hari\": \"" . '2' . "\",
    //             \r\n\"jml_pasien\": \"" . '2' . "\",
    //             \r\n\"tgltransaksi\": \"" . '2021-07-29' . "\",              
    //                   }",
    //         // CURLOPT_POSTFIELDS =>
    //         // "{\r\n\"request\": 
    //         //              {\r\n\"t_sep\": 
    //         //                 {
    //         //                 \r\n\"noKartu\": \"" . $request['nokartu'] . "\",
    //         //                 \r\n\"tglSep\": \"" . $request['tglsep'] . "\",
    //         //                 \r\n\"ppkPelayanan\": \"0904R004\",
    //         //                 \r\n\"jnsPelayanan\": \"" . $request['jenispelayanan'] . "\",
    //         //                 \r\n\"klsRawat\": \"" . $request['kelasrawat'] . "\",
    //         //                 \r\n\"noMR\": \"" . $request['nomr'] . "\",
    //         //                 \r\n\"rujukan\": {\r\n\"asalRujukan\": \"" . $request['asalrujukan'] . "\",
    //         //                                 \r\n\"tglRujukan\": \"" . $request['tglrujukan'] . "\",
    //         //                                 \r\n\"noRujukan\": \"" . $request['norujukan'] . "\",
    //         //                                 \r\n\"ppkRujukan\": \"" . $request['ppkrujukan'] . "\"\r\n},
    //         //                 \r\n\"catatan\": \"" . $request['catatan'] . "\",
    //         //                 \r\n\"diagAwal\": \"" . $request['diagnosaawal'] . "\",
    //         //                 \r\n\"poli\": {\r\n\"tujuan\": \"" . $request['politujuan'] . "\",
    //         //                              \r\n\"eksekutif\": \"" . $request['eksekutif'] . "\"\r\n},
    //         //                 \r\n\"cob\": 
    //         //                             {\r\n\"cob\": \"" . $request['cob'] . "\"\r\n},
    //         //                 \r\n\"jaminan\": {\r\n\"lakaLantas\": \"" . $request['lakalantas'] . "\",
    //         //                                     \r\n\"penjamin\": \"" . $request['penjamin'] . "\",
    //         //                                     \r\n\"lokasiLaka\": \"" . $request['lokasilaka'] . "\"\r\n},
    //         //                 \r\n\"noTelp\": \"" . $request['notelp'] . "\",
    //         //                 \r\n\"user\": \"Ramdanegie\"\r\n}\r\n}\r\n

    //         //           }",

    //         CURLOPT_HTTPHEADER => $headers,
    //     ));

    //     $response = curl_exec($curl);
    //     $err = curl_error($curl);

    //     curl_close($curl);

    //     if ($err) {
    //         $result = "cURL Error #:" . $err;
    //     } else {
    //         $result = (array) json_decode($response);
    //     }
    //     return $this->respond($result);
    // }

    public function getKesehatanrs(Request $request)
    {
        $tglAwal = $request['tglawal'];
        $tglAkhir = $request['tglakhir'];
        $date = Carbon::parse($tglAwal);

        $now =  Carbon::parse($tglAkhir);
        $now->addDays(1);

        $diff = $date->diffInDays($now);
        // $q = collect(DB::select("
        // xSELECT count(noregistrasi) as total, kelas_m.namakelas,kelas_m.kodebios
        // FROM     pasiendaftar_t INNER JOIN
        //                   antrianpasiendiperiksa_t ON pasiendaftar_t.norec = antrianpasiendiperiksa_t.noregistrasifk INNER JOIN
        //                   kelas_m ON antrianpasiendiperiksa_t.objectkelasfk = kelas_m.id INNER JOIN
        //                   ruangan_m ON antrianpasiendiperiksa_t.objectruanganfk = ruangan_m.id
        // WHERE  (antrianpasiendiperiksa_t.tglmasuk < '$tglAkhir' AND antrianpasiendiperiksa_t.tglmasuk > '$tglAkhir') AND (pasiendaftar_t.statusenabled = 1)
        // and ruangan_m.objectdepartemenfk='16'
        // group by namakelas,kodebios"));
        $q= collect(DB::select("
                SELECT     count(pasiendaftarsensus_t.norec) as total,   kelas_m.namakelas,kelas_m.kodebios
                FROM            kelas_m INNER JOIN
                pasiendaftar_t ON kelas_m.id = pasiendaftar_t.objectkelasfk INNER JOIN
                pasiendaftarsensus_t ON pasiendaftar_t.norec = pasiendaftarsensus_t.noregistrasifk
                where pasiendaftarsensus_t.tglinsertsensus between  '$tglAwal' and '$tglAkhir'
                group by  kelas_m.namakelas,kelas_m.kodebios"));
        foreach ($q as $value) {
            $result[] = array(
                'namakelas'  => $value->namakelas,
                'jml_pasien'  => $value->total,
                'jml_hari'  => $diff,
                'tgl_transaksi'  => $tglAkhir,
                'kode' => $value->kodebios
            );
        }


        return $this->respond($result, "Kesehatan Rumah Sakit");
    }
    public function getKesehatanrsdetail(Request $request)
    {
        $namakelas = $request['namakelas'];
        $tglAwal = $request['tglawal'];
        $tglAkhir = $request['tglakhir'];
        $date = Carbon::parse($tglAwal);

        $now =  Carbon::parse($tglAkhir);
        $now->addDays(1);

        $diff = $date->diffInDays($now);
        // $q = collect(DB::select("
        // xSELECT count(noregistrasi) as total, kelas_m.namakelas,kelas_m.kodebios
        // FROM     pasiendaftar_t INNER JOIN
        //                   antrianpasiendiperiksa_t ON pasiendaftar_t.norec = antrianpasiendiperiksa_t.noregistrasifk INNER JOIN
        //                   kelas_m ON antrianpasiendiperiksa_t.objectkelasfk = kelas_m.id INNER JOIN
        //                   ruangan_m ON antrianpasiendiperiksa_t.objectruanganfk = ruangan_m.id
        // WHERE  (antrianpasiendiperiksa_t.tglmasuk < '$tglAkhir' AND antrianpasiendiperiksa_t.tglmasuk > '$tglAkhir') AND (pasiendaftar_t.statusenabled = 1)
        // and ruangan_m.objectdepartemenfk='16'
        // group by namakelas,kodebios"));
        $q= collect(DB::select("
               SELECT        pasiendaftarsensus_t.norec, pasiendaftarsensus_t.kdprofile, pasiendaftarsensus_t.statusenabled, pasiendaftarsensus_t.objectkelasfk, pasiendaftarsensus_t.objectkelompokpasienlastfk, pasiendaftarsensus_t.noregistrasi, 
                         pasiendaftarsensus_t.nocmfk, pasiendaftarsensus_t.noregistrasifk, pasiendaftarsensus_t.objectrekananfk, pasiendaftarsensus_t.objectruanganlastfk, pasiendaftarsensus_t.objectruanganasalfk, 
                         pasiendaftarsensus_t.tglregistrasi, pasiendaftarsensus_t.tglinsertsensus, pasiendaftarsensus_t.objectkasuspenyakitlastfk, kelas_m.namakelas, kelas_m.kodebios, ruangan_m.namaruangan, pasien_m.namapasien, 
                         pasien_m.nocm, pasiendaftar_t.noregistrasi AS noregistrasi
FROM            kelas_m INNER JOIN
                         pasiendaftar_t ON kelas_m.id = pasiendaftar_t.objectkelasfk INNER JOIN
                         pasiendaftarsensus_t ON pasiendaftar_t.norec = pasiendaftarsensus_t.noregistrasifk INNER JOIN
                         ruangan_m ON pasiendaftarsensus_t.objectruanganlastfk = ruangan_m.id INNER JOIN
                         pasien_m ON pasiendaftar_t.nocmfk = pasien_m.id
                where pasiendaftarsensus_t.tglinsertsensus between  '$tglAwal' and '$tglAkhir' and kelas_m.namakelas = '$namakelas'"));
                
        foreach ($q as $value) {
            $result[] = array(
                'namakelas'  => $value->namakelas,
                'tglinsertsensus'  => $value->tglinsertsensus,
                'namaruangan'  => $value->namaruangan,
                'nocm'  => $value->nocm,
                'namapasien' => $value->namapasien,
                'noregistrasi' => $value->noregistrasi
            );
        }


        return $this->respond($result, "Kesehatan Rumah Sakit");
    }
    public function getKesehatanrskirim(Request $request)
    {
        $tglAwal = $request['tglawal'];
        $tglAkhir = $request['tglakhir'];
       
        $date = Carbon::parse($tglAwal);
      
        $now =  Carbon::parse($tglAkhir);
        $now->addDays(1);

        $diff = $date->diffInDays($now);
        
        // $q = collect(DB::select("
        // SELECT count(noregistrasi) as total, kelas_m.kodebios
        // FROM     pasiendaftar_t INNER JOIN
        //                   antrianpasiendiperiksa_t ON pasiendaftar_t.norec = antrianpasiendiperiksa_t.noregistrasifk INNER JOIN
        //                   kelas_m ON antrianpasiendiperiksa_t.objectkelasfk = kelas_m.id INNER JOIN
        //                   ruangan_m ON antrianpasiendiperiksa_t.objectruanganfk = ruangan_m.id
        // WHERE  (pasiendaftar_t.tglregistrasi < '$tglAwal') AND (pasiendaftar_t.tglpulang > '$tglAkhir') AND (pasiendaftar_t.statusenabled = 1)
        // and ruangan_m.objectdepartemenfk='16'
        // group by kodebios"));
        $q = collect(DB::select("
                SELECT     count(pasiendaftarsensus_t.norec) as total,  kelas_m.kodebios
                FROM            kelas_m INNER JOIN
                pasiendaftar_t ON kelas_m.id = pasiendaftar_t.objectkelasfk INNER JOIN
                pasiendaftarsensus_t ON pasiendaftar_t.norec = pasiendaftarsensus_t.noregistrasifk
                where pasiendaftarsensus_t.tglinsertsensus between  '$tglAwal' and '$tglAkhir'
                group by  kelas_m.kodebios"));
        foreach ($q as $value) {
            $result[] = array(
                // 'namakelas'  => $value->namakelas,
                'jml_pasien'  => $value->total,
                'jml_hari'  => $diff,
                'tgl_transaksi'  => $tglAkhir,
                'kode' => $value->kodebios
            );
        }


        return $this->respond($result, "Kesehatan Rumah Sakit");
    }
    public function getKesehatan(Request $request)
    {
        $url = $this->getUrlBios() . 'get/data/kesehatan';
        $url = $url . '?tgl_transaksi=' . $request['tgltransaksi'];
        // return ($url);
        // die();
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => "80",
            CURLOPT_URL => $url,
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/Peserta/nokartu/".$request['nokartu']."/tglSEP/".$request['tglsep'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json; charset=utf-8",
                "token: " .  $request['token'],

            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);
    }
    public function getPenerimaan(Request $request)
    {
        $url = $this->getUrlBios() . 'get/data/penerimaan';
        $url = $url . '?tgl_transaksi=' . $request['tgltransaksi'];
        // return ($url);
        // die();
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => "80",
            CURLOPT_URL => $url,
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/Peserta/nokartu/".$request['nokartu']."/tglSEP/".$request['tglsep'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json; charset=utf-8",
                "token: " .  $request['token'],

            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);
    }
    public function getPengeluaran(Request $request)
    {
        $url = $this->getUrlBios() . 'get/data/pengeluaran';
        $url = $url . '?tgl_transaksi=' . $request['tgltransaksi'];
        // return ($url);
        // die();
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => "80",
            CURLOPT_URL => $url,
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/Peserta/nokartu/".$request['nokartu']."/tglSEP/".$request['tglsep'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json; charset=utf-8",
                "token: " .  $request['token'],

            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);
    }
    public function getSaldo(Request $request)
    {
        $url = $this->getUrlBios() . 'get/data/saldo';
        $url = $url . '?tgl_transaksi=' . $request['tgltransaksi'];
        // return ($url);
        // die();
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => "80",
            CURLOPT_URL => $url,
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/Peserta/nokartu/".$request['nokartu']."/tglSEP/".$request['tglsep'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json; charset=utf-8",
                "token: " .  $request['token'],

            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);
    }
    public function getListAkun(Request $request)
    {
        $url = $this->getUrlBios() . 'ws/ref/akun';
        // return ($url);
        // die();
        // $url = $url . '?tgl_transaksi=' . $request['tgltransaksi'];
        // return ($url);
        // die();
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => "80",
            CURLOPT_URL => $url,
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/Peserta/nokartu/".$request['nokartu']."/tglSEP/".$request['tglsep'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json; charset=utf-8",
                "token: " .  $request['token'],

            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);
    }
    public function getListBank(Request $request)
    {
        $url = $this->getUrlBios() . 'ws/ref/bank';
        // return ($url);
        // die();
        // $url = $url . '?tgl_transaksi=' . $request['tgltransaksi'];
        // return ($url);
        // die();
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => "80",
            CURLOPT_URL => $url,
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/Peserta/nokartu/".$request['nokartu']."/tglSEP/".$request['tglsep'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json; charset=utf-8",
                "token: " .  $request['token'],

            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);
    }
    public function getListRekening(Request $request)
    {
        $url = $this->getUrlBios() . 'ws/ref/rekening';
        // return ($url);
        // die();
        // $url = $url . '?tgl_transaksi=' . $request['tgltransaksi'];
        // return ($url);
        // die();
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => "80",
            CURLOPT_URL => $url,
            //            CURLOPT_URL => "http://dvlp.bpjs-kesehatan.go.id:8080/VClaim-Rest/Peserta/nokartu/".$request['nokartu']."/tglSEP/".$request['tglsep'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json; charset=utf-8",
                "token: " .  $request['token'],

            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result = (array) json_decode($response);
        }

        return $this->respond($result);
    }
}
