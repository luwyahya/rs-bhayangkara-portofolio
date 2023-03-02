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
use App\Master\Mappingsirs;
use App\Traits\Valet;
use Carbon\Carbon;
use Illuminate\Http\Request;
use DB;
use Date;
class BridgingSiranapController  extends ApiController
{
	use Valet;
    protected $url_dinkes_jkt = 'http://eis.dinkes.jakarta.go.id/api-bed/bed';
    public function __construct() {
        parent::__construct($skip_authentication=true);
    }
  protected  function kodeRS (){
       return $this->settingDataFixed('userIdSisrute');
    }
    protected  function passwordRS (){
        return $this->settingDataFixed('passwordSisrute');
    }

	// protected $kodeRS = 3174260;
	// protected $passwordRS = "12345";

	function is_decimal( $val )
	{
	    return is_numeric( $val ) && floor( $val ) != $val;
	}
	public function getBedMonitor(Request $request)
	{
		// $data = DB::select(DB::raw("select pd.noregistrasi , ps.objectjeniskelaminfk ,pd.objectkelasfk,
		// 	kmr.id as idkamar, kmr.namakamar, kmen.kodeexternal as kode_ruang,
		// 	kls.kodeexternal as tipe_pasien
		// 	from pasiendaftar_t as pd
		// 	join antrianpasiendiperiksa_t as apd  on pd.norec= apd.noregistrasifk and  apd.objectruanganfk =pd.objectruanganlastfk
		// 	join registrasipelayananpasien_t as rpp  on pd.norec= rpp.noregistrasifk and  rpp.objectruanganfk =pd.objectruanganlastfk
		// 	join kamar_m as kmr  on kmr.id= apd.objectkamarfk
		// 	join tempattidur_m as tt on tt.id= rpp.objecttempattidurfk
		// 	join kelas_m as kls on kls.id = pd.objectkelasfk
		// 	left join ruangperawatankemenkes_m as kmen on kmen.id = tt.objectruangperawatankemenkesfk
		// 	join pasien_m as ps on ps.id=pd.nocmfk
		// 	where pd.tglpulang is NULL
		// 	and apd.tglkeluar is null
		// 	and pd.objectkelasfk is not null
		// 	ORDER BY pd.noregistrasi;
		// 	"));
		// $dataTempatTidur = [];
		// $terpakaiMale = 0;
		// $terpakaiFemale = 0;
		// foreach ($data  as $item) {
		// 	if($item->kode_ruang != null && $item->tipe_pasien != null){
		// 		$sama = false;
		// 		$i = 0;
		// 		foreach ($dataTempatTidur as $item2) {
		// 			if ($item->kode_ruang == $dataTempatTidur[$i]['kode_ruang']
		// 				&& $item->tipe_pasien == $dataTempatTidur[$i]['tipe_pasien']) {
		// 				$sama = true;
		// 				$jml = (float)$item2['total_tt'] + 1;
		// 				$dataTempatTidur[$i]['total_tt'] = $jml;
		// 				if ($item->objectjeniskelaminfk == 1) {
		// 					$dataTempatTidur[$i]['terpakaiMale'] = (float)$item2['terpakaiMale'] + 1;
		// 				}
		// 				if ($item->objectjeniskelaminfk == 2) {
		// 					$dataTempatTidur[$i]['terpakaiFemale'] = (float)$item2['terpakaiFemale'] + 1;
		// 				}
		// 			}
		// 			$i = $i + 1;
		// 		}
		// 		if ($sama == false) {
		// 			$dataTempatTidur [] = array(
		// 				'total_tt' => 0,
		// 				'kode_ruang' =>$item->kode_ruang,
		// 				'tipe_pasien' =>$item->tipe_pasien,
		// 				'terpakaiMale' =>$terpakaiMale,
		// 				'terpakaiFemale' => $terpakaiFemale,
		// 				'kosongMale' => 0,
		// 				'kosongFemale' => 0,
		// 				'waiting' => 0,
		// 				'tgl_update' => date('Y-m-d H:i:s'),
		// 			);
		// 		}
		// 	}
		// }
		// return $this->respond($dataTempatTidur);
		$data = DB::select(DB::raw("SELECT
			x.kode_ruang,
			x.tipe_pasien,
			COUNT (x.id) AS total_tt,
			0 AS terpakaiMale,
			0 AS terpakaiFemale,
			sum(kosongMale) as kosongMale,
			sum(kosongFemale) as kosongFemale,
			0 AS waiting,
			format (getdate(), 'yyyy-MM-dd') AS tgl_update
				
		FROM
			(
				SELECT
					ru.kodesiranap AS kode_ruang,
					kl.kodesiranap AS tipe_pasien,
					[kmr].[id],
					[kmr].[namakamar],
					[kl].[id] AS [id_kelas],
					[kl].[namakelas],
					[ru].[id] AS [id_ruangan],
					[ru].[namaruangan],
					case when ru.jenis ='male' then 1 else 0 end as kosongMale ,
					case when ru.jenis ='female' then 1 else 0 end as kosongFemale 
				FROM
					[tempattidur_m] AS [tt]
				LEFT JOIN [statusbed_m] AS [sb] ON [sb].[id] = [tt].[objectstatusbedfk]
				LEFT JOIN [kamar_m] AS [kmr] ON [kmr].[id] = [tt].[objectkamarfk]
				LEFT JOIN [ruangan_m] AS [ru] ON [ru].[id] = [kmr].[objectruanganfk]
				LEFT JOIN [kelas_m] AS [kl] ON [kl].[id] = [kmr].[objectkelasfk]
				WHERE
					[tt].[statusenabled] = 1
			) AS x
		GROUP BY
			x.kode_ruang,
			x.tipe_pasien
		order by x.kode_ruang"));
	
		foreach ($data as $key => $values) {
			$dat = 0;
			if($values->kosongFemale == '0' && $values->kosongMale == '0' ){
				$dat =(float) $values->total_tt /2;
				if($this->is_decimal($dat)){
					$values->kosongMale =$values->total_tt ;
				}else{
					$values->kosongMale = $dat;
					$values->kosongFemale = $dat;
				}				
			}

				if(( $values->kosongFemale != '0' && $values->kosongMale != '0'  )&&(
					(float) $values->kosongFemale +(float) $values->kosongMale  != (float) $values->total_tt) ){
					$tot  = 0;
					$tot2  = 0;
					$totakhir =0;
					$tot = (float) $values->kosongFemale +(float) $values->kosongMale  ;
					$tot2 = (float) $values->total_tt - $tot ;

					$totakhir = $tot2 /2;

					if($this->is_decimal($totakhir)){
						$values->kosongMale =(float)$values->kosongMale +$tot2  ;
					}else{
						$values->kosongMale = (float)$values->kosongMale+ $totakhir ;
						$values->kosongFemale = (float)$values->kosongFemale+$totakhir ;
					}	
				}
			# code...
		}
		// return $data;


		 $pasien = DB::select(DB::raw("SELECT
				pd.noregistrasi,
					pd.tglregistrasi,
					pd.tglpulang,
					kl.kodesiranap AS tipe_pasien,
					ru.kodesiranap AS kode_ruang,
					DATEDIFF(
						DAY,
						pd.tglregistrasi,
						CASE
					WHEN pd.tglpulang IS NULL THEN
						getdate()
					ELSE
						pd.tglpulang
					END
					) AS hari,case when ps.objectjeniskelaminfk =1 then 'male' else 'female' end as jenis
				FROM
					pasiendaftar_t AS pd
				INNER JOIN ruangan_m AS ru ON ru.ID = pd.objectruanganlastfk
				INNER JOIN kelas_m AS kl ON kl.ID = pd.objectkelasfk
				INNER JOIN pasien_m AS ps ON ps.id= pd.nocmfk
				WHERE
					ru.objectdepartemenfk = 16
				AND pd.tglpulang IS NULL
				ORDER BY
					pd.tglregistrasi ASC
                "));
		 $total_tt=0;
		 foreach ($data as $key => $ruang) {
		 	 $total_tt=(float)$ruang->total_tt + $total_tt;
		 	foreach ($pasien as $key => $psn) {
		 		# code...
		 		if($ruang->kode_ruang  ==  $psn->kode_ruang && $ruang->tipe_pasien  ==  $psn->tipe_pasien 
		 			&& $psn->jenis == 'male'){
		 			$ruang->terpakaiMale  = (float)$ruang->terpakaiMale + 1;
		 			
		 		}
		 		if($ruang->kode_ruang  ==  $psn->kode_ruang && $ruang->tipe_pasien  ==  $psn->tipe_pasien 
		 			&& $psn->jenis == 'female'){
		 			$ruang->terpakaiFemale  = (float)$ruang->terpakaiFemale + 1;
		 			
		 		}

		 	}
		 	# code...
		 }
		 $terpakai = 0;
		 $kosong = 0;
		 foreach ( $data as $key => $value) {
		 	if( (float)$value->kosongMale!=0){
		 		 $value->kosongMale =(float) $value->kosongMale -(float) $value->terpakaiMale;
		 	}
		 	if( (float)$value->kosongFemale!=0){
		 		 $value->kosongFemale =(float) $value->kosongFemale -(float) $value->terpakaiFemale;
		 	}

			
			// if(((float) $value->total_tt !=)) 
		 	# code...
		 }
		 foreach ($data as $key ) {
		  	 $key->kosongFemale = (string) $key->kosongFemale;
		  	 $key->kosongMale = (string) $key->kosongMale;
		  	 $key->terpakaiFemale = (string) $key->terpakaiFemale;
		  	 $key->terpakaiMale = (string) $key->terpakaiMale;
		 }
		 // $res =  array(
		 // 			'total_tt' => $total_tt, 
	 	// 			'totalPakai' => $terpakai, 
	 	// 			'kosong' => $kosong, 
			// 		'data' => $data
			// 	);
		 return $this->respond($data);

	}
	private function getTotalBed (){
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
                 where ru.objectdepartemenfk in (16,35) and ru.statusenabled='t'
				 and km.statusenabled='t' and tt.statusenabled='t')as x limit 1"));
		return $data;
	}
	public function hapusBed($kode_tipe_pasien,$kode_kelas_ruang)
	{
		# seting koneksi webservices #
		$xrsid = $this->kodeRS; # ID Rumah Sakit #
		$xpass = md5( $this->passwordRS ); # Password #

		$strURLSiranap = "http://sirs.yankes.kemkes.go.id/sirsservice/sisrute/hapusdata/$xrsid/$kode_tipe_pasien/$kode_kelas_ruang";

		$curl = curl_init();
		curl_setopt($curl, CURLOPT_URL, $strURLSiranap);
		curl_setopt($curl, CURLOPT_HTTPHEADER, Array(
				"X-rs-id: $xrsid",
				"X-pass:$xpass",
				"Content-Type:application/xml; charset=ISO-8859-1",
				"User-Agent: Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.15) Gecko/20080623 Firefox/2.0.0.15")
		);
		curl_setopt($curl, CURLOPT_NOBODY, false);
		curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		$response = curl_exec($curl);
		$err = curl_error($curl);

		curl_close($curl);

		if ($err) {
			$result= "Ada Kesalahan #:" . $err;
		} else {
			$result = (array) json_decode($response);
		}
		return $this->respond($result);
	}
	public function getKunjungan($instalasi, Request $request)
	{
		$tgl = $request['tanggal'];
		$result = [];

		if($instalasi == 'irj'){
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
			foreach ($data as $item){
				$result [] = array(
					'KLINIK' => $item->namaruangan,
					'JKN' => (int) $item->jkn,
					'NON JKN' =>  (int)  $item->nonjkn,
				);
			}
		}
		if($instalasi == 'igd'){
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
			if(count($data) > 0){
				foreach ($data as $item){
				$result  = array(
					'JKN' => (int) $item->jkn,
					'NON JKN' =>  (int)  $item->nonjkn,
				);
				}
			}else{
				$result  = array(
					'JKN' => 0,
					'NON JKN' => 0,
				);
			}
			
		}
		if($instalasi == 'iri'){
			$tglAwal = $tgl.' 00:00';
			$tglAkhir = $tgl.' 23:59';
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
			foreach ($data as $item){
				$result [] = array(
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

		if($instalasi == 'irj'){
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
			foreach ($data as $item){
				$result [] = array(
					'KLINIK' => $item->namaruangan,
					'JKN' => (int) $item->jkn,
					'NON JKN' =>  (int)  $item->nonjkn,
				);
			}
		}
		if($instalasi == 'igd'){
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
			foreach ($data as $item){
				$result  = array(
					'JKN' => (int) $item->jkn,
					'NON JKN' =>  (int)  $item->nonjkn,
				);
			}
		}
		if($instalasi == 'iri'){
			$data = DB::select(DB::raw("select kls.namakelas,count(pd.norec) as jml 
				from pasiendaftar_t as pd 
				join ruangan_m as ru on ru.id =pd.objectruanganlastfk
				join kelas_m as kls on kls.id =pd.objectkelasfk
				where to_char(pd.tglregistrasi, 'DD-MM-YYYY') = '$tgl'
				and ru.objectdepartemenfk =16
				group by kls.namakelas
					"));
			foreach ($data as $item){
				$result [] = array(
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
		if (isset($yM)){
			$date = explode('-',$yM);
			$lengthBln = strlen($date[0]);
			$bln = $date[0];
			$thn = $date[1];
			if($lengthBln == 1){
				$bln = '0'.$date[0];
			}
			$blnThn = $bln.'-'.$thn;
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
			if(count($data10 )!= 0){
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
		if (isset($yM)){
			$date = explode('-',$yM);
			$lengthBln = strlen($date[0]);
			$bln = $date[0];
			$thn = $date[1];
			if($lengthBln == 1){
				$bln = '0'.$date[0];
			}
			$blnThn = $bln.'-'.$thn;
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
		if (isset($yM)){
			$date = explode('-',$yM);
			$lengthBln = strlen($date[0]);
			$bln = $date[0];
			$blnKode = (int)$date[0];
			$thn = $date[1];
			if($lengthBln == 1){
				$bln = '0'.$date[0];
			}
			$blnThn = $bln.'-'.$thn;
		}
		$jmlHari = cal_days_in_month(CAL_GREGORIAN,$bln,$thn);

		$dateStart = Carbon::now();
        $dayInMonth = array();
        $type = CAL_GREGORIAN;

        $month =$bln;// Carbon::parse($blnKode)->format('m'); // Month ID, 1 through to 12.

        $year =$thn;// Carbon::parse($blnKode)->format('Y'); //date('Y'); // Year in 4 digit 2009 format.
        $day_count = cal_days_in_month($type, $month, $year); // Get the amount of days\
        // return $day_count ;
        $hp = 0;
        for ($i = 1; $i <= $day_count; $i++) {
            $date = $year.'/'.$month.'/'.$i; //format date
            $get_name = date('l', strtotime($date)); //get week day
            $day_name = substr($get_name, 0, 3); // Trim day name to 3 chars

            //if not a weekend add day to array
//            if($day_name != 'Sun' && $day_name != 'Sat'){
            $strLength= strlen($i);
            if($strLength  == 1){
                $i = '0'.$i;
            }

            $dayInMonth[] =$thn.'-'.$month.'-'.$i;// date ('Y-'.$month.'-'.$i);

		    $tglAwal = $thn.'-'.$month.'-'.$i.' 00:00';
			$tglAkhir = $thn.'-'.$month.'-'.$i.' 23:59';
			
			$pasien = DB::select(DB::raw("
		     
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
      
		$data10=[];
		$jumlahTT= 0;
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
		if(count($dataTT) > 0){
			$jumlahTT = $dataTT[0]->jml;
		}
	
	 /** @var  $bor = (Jumlah hari perawatn RS dibagi ( jumlah TT x Jumlah hari dalam satu periode ) ) x 100 % */

		$bor = ( $hp / ((float)$jumlahTT  * (float)$day_count)) * 100;
		$data10['BOR'] = (float) number_format($bor,2);

		return $this->respond($data10);


	}
	public function postBedDinkesJKT(Request $r){
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
                        tt.statusenabled = true
                and kmr.statusenabled=true 
                ) as x"))->first();
        $fields = array (
            'kapasitas_vip' => $q->kapasitas_vip != null ? $q->kapasitas_vip : 0,
            'kapasitas_kelas_1_l' =>  $q->kapasitas_kelas_1 != null ? round( $q->kapasitas_kelas_1 / 2): 0,
            'kapasitas_kelas_2_l' =>  $q->kapasitas_kelas_2 != null ? round( $q->kapasitas_kelas_2 / 2): 0,
            'kapasitas_kelas_3_l' => $q->kapasitas_kelas_3 != null ? round( $q->kapasitas_kelas_3 / 2): 0,
            'kapasitas_kelas_1_p' =>  $q->kapasitas_kelas_1 != null ? floor( $q->kapasitas_kelas_1 / 2): 0,
            'kapasitas_kelas_2_p' =>  $q->kapasitas_kelas_2 != null ? floor( $q->kapasitas_kelas_2 / 2): 0,
            'kapasitas_kelas_3_p' =>   $q->kapasitas_kelas_3 != null ? floor( $q->kapasitas_kelas_3 / 2): 0,
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
            'kosong_kelas_1_l' =>  $q->kosong_kelas_1 != null ? round( $q->kosong_kelas_1 /2): 0,
            'kosong_kelas_2_l' =>  $q->kosong_kelas_2 != null ? round( $q->kosong_kelas_2 /2) : 0,
            'kosong_kelas_3_l' => $q->kosong_kelas_3 != null ? round( $q->kosong_kelas_3 /2) : 0,
            'kosong_kelas_1_p' =>  $q->kosong_kelas_1 != null ? floor( $q->kosong_kelas_1 /2) : 0,
            'kosong_kelas_2_p' =>  $q->kosong_kelas_2 != null ? floor( $q->kosong_kelas_2 /2) : 0,
            'kosong_kelas_3_p' =>  $q->kosong_kelas_3 != null ? floor( $q->kosong_kelas_3 /2) : 0,
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
        $dataJsonSend = json_encode ($fields);

        $headers =  $this->headerDinkesJKT();
        $response = $this->sendBridgingCurl( $headers, $dataJsonSend, $this->url_dinkes_jkt ,'POST');
        return $this->respond($response);
    }
    function headerDinkesJKT(){
        $user = '3172072';
        $password ='$2y$10$527Uvx6RwF8Gw6ycge7F6.1bHXvqfcQKPTgSZcb0P.9xWR0ufH8t.';
        $header = [
            "Api-Bed-User: ".$user,
            "Api-Bed-Key: ".$password,
            "Content-type: application/json",
        ];
        return $header;
    }
    public function getBedDinkes(Request $r){
        $headers =  $this->headerDinkesJKT();
        $response = $this->sendBridgingCurl( $headers, null, $this->url_dinkes_jkt ,'GET');
        return $this->respond($response);
    }
    public function deleteBedDinkes(Request $r){
        $headers =  $this->headerDinkesJKT();
        $response = $this->sendBridgingCurl( $headers, null, $this->url_dinkes_jkt ,'DELETE');
        return $this->respond($response);
	}
	
	public function PasienMasuk($method,Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers =  $this->getHeadersCovid($kdProfile);
        if($method == 'post'){
            $now = date('Y-m-d');
            if(isset($request['tgl'])){
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
				$methods ='POST';
				$arr = array(
					"tanggal" =>  $now,
					"igd_suspect_l"=> isset($query->igd_suspect_l) && $query->igd_suspect_l != null ? $query->igd_suspect_l : 0,
					"igd_suspect_p"=>isset($query->igd_suspect_p) && $query->igd_suspect_p != null ? $query->igd_suspect_p : 0,
					"igd_confirm_l"=> isset($query->igd_confirm_l) && $query->igd_confirm_l != null ? $query->igd_confirm_l : 0,
					"igd_confirm_p"=>isset($query->igd_confirm_p) && $query->igd_confirm_p != null ? $query->igd_confirm_p : 0,
					"rj_suspect_l"=> isset($query->rj_suspect_l) && $query->rj_suspect_l != null ? $query->rj_suspect_l : 0,
					"rj_suspect_p"=> isset($query->rj_suspect_p) && $query->rj_suspect_p != null ? $query->rj_suspect_p : 0,
					"rj_confirm_l"=>isset($query->rj_confirm_l) && $query->rj_confirm_l != null ? $query->rj_confirm_l : 0,
					"rj_confirm_p"=>isset($query->rj_confirm_p) && $query->rj_confirm_p != null ? $query->rj_confirm_p : 0,
					"ri_suspect_l"=>isset($query->ri_suspect_l) && $query->ri_suspect_l != null ? $query->ri_suspect_l : 0,
					"ri_suspect_p"=> isset($query->ri_suspect_p) && $query->ri_suspect_p != null ? $query->ri_suspect_p : 0,
					"ri_confirm_l"=>isset($query->ri_confirm_l) && $query->ri_confirm_l != null ? $query->ri_confirm_l : 0,
					"ri_confirm_p"=> isset($query->ri_confirm_p) && $query->ri_confirm_p != null ? $query->ri_confirm_p : 0,
				);
	//                        return $this->respond($arr);
				$dataJsonSend = json_encode ($arr);
			} else if($method == 'get'){
				$methods ='GET';
				$dataJsonSend = null;
			}else if($method == 'delete'){
				$methods ='DELETE';
				$now = date('Y-m-d');
				if(isset($request['tgl'])){
					$now  = $request['tgl'];
				}
				$arr = array(
					"tanggal" => $now,
				);
				$dataJsonSend = json_encode ($arr);
			}
        $url = "http://sirs.kemkes.go.id/fo/index.php/LapV2/PasienMasuk";
        $response = $this->sendBridgingCurl($headers , $dataJsonSend, $url, $methods);
        return $this->respond($response);
	}
	
	function getHeadersCovid($kdProfile){
        // if($kdProfile==16){
        //     $user = '3673004';//banten
        //     $password ='S!rs2020!!';//
        // }else if($kdProfile==17){
        //     $user = '2171066S';//galang
        //     $password ='S1Rs2020!!';//
        // }else if($kdProfile==18){
        //     $user = '3171900S'; //wisma
        //     $password ='S1Rs2020!!';//
        // }else if($kdProfile==21){
        //     $user = '3201046'; //wisma
        //     $password ='S1Rs2020!!';//
        // }
        // $user = 3174260;
        // $password = "12345";
		$user = '3172072';//polri
        $password ='S!rs2020!!';//

        date_default_timezone_set('UTC');
        $tStamp = strval(time()-strtotime('1970-01-01 00:00:00'));
        $header = [
            "X-rs-id: ".$user,
            "X-Timestamp: ".$tStamp,
            "X-pass: ".$password,
            "Content-type: application/json",
        ];
        return $header;
	}
	public function Komorbid($method,Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers =  $this->getHeadersCovid($kdProfile);
        if($method == 'post'){
            $now = date('Y-m-d');
            if(isset($request['tgl'])){
                $now  = $request['tgl'];
            }
            $query = collect(DB::select("SELECT sum(x.icu_dengan_ventilator_confirm_p) as icu_dengan_ventilator_confirm_p,
sum(x.icu_dengan_ventilator_confirm_l)as icu_dengan_ventilator_confirm_l,
sum(x.icu_dengan_ventilator_suspect_l) as icu_dengan_ventilator_suspect_l,
sum(x.icu_dengan_ventilator_suspect_p)as icu_dengan_ventilator_suspect_p,
sum(x.isolasi_tekanan_negatif_suspect_l) as isolasi_tekanan_negatif_suspect_l   ,
sum(x.isolasi_tekanan_negatif_suspect_p) as isolasi_tekanan_negatif_suspect_p,
sum(x.isolasi_tekanan_negatif_confirm_l) as isolasi_tekanan_negatif_confirm_l,
sum(x.isolasi_tekanan_negatif_confirm_p) as isolasi_tekanan_negatif_confirm_p,
sum(x.nicu_khusus_covid_suspect_l)as nicu_khusus_covid_suspect_l,
sum(x.nicu_khusus_covid_suspect_p) as nicu_khusus_covid_suspect_p,
sum(x.nicu_khusus_covid_confirm_l) as nicu_khusus_covid_confirm_l,
sum(x.nicu_khusus_covid_confirm_p) as nicu_khusus_covid_confirm_p,
sum(x.picu_khusus_covid_suspect_l) as picu_khusus_covid_suspect_l,
sum(x.picu_khusus_covid_suspect_p) as picu_khusus_covid_suspect_p,
sum(x.picu_khusus_covid_confirm_l) as picu_khusus_covid_confirm_l,
sum(x.picu_khusus_covid_confirm_p) as picu_khusus_covid_confirm_p
FROM(select case when dg.kddiagnosa= 'B34.2' and ru.id IN(654,655) and ps.objectjeniskelaminfk =1  then 1 else 0 end as isolasi_tekanan_negatif_confirm_l,
    case when dg.kddiagnosa= 'B34.2' and ru.id IN(654,655) and ps.objectjeniskelaminfk =2  then 1 else 0 end as isolasi_tekanan_negatif_confirm_p,
    case when dg.kddiagnosa= 'B34.2' and ru.id in(671) and ps.objectjeniskelaminfk =1  then 1 else 0 end as icu_dengan_ventilator_confirm_l,
    case when dg.kddiagnosa= 'B34.2' and ru.id in(671)  and ps.objectjeniskelaminfk =2  then 1 else 0 end as icu_dengan_ventilator_confirm_p,
    case when dg.kddiagnosa= 'B34.2' and ru.id in(673) and ps.objectjeniskelaminfk =1  then 1 else 0 end as nicu_khusus_covid_confirm_l,
    case when dg.kddiagnosa= 'B34.2' and ru.id in(673)and ps.objectjeniskelaminfk =2  then 1 else 0 end as nicu_khusus_covid_confirm_p,
    case when dg.kddiagnosa= 'B34.2' and ru.id=672 and ps.objectjeniskelaminfk =1  then 1 else 0 end as picu_khusus_covid_confirm_l,
    case when dg.kddiagnosa= 'B34.2' and ru.id=672 and ps.objectjeniskelaminfk =2  then 1 else 0 end as picu_khusus_covid_confirm_p,
        
case when dg.kddiagnosa= 'Z03.8' and ru.id IN(654,655) and ps.objectjeniskelaminfk =1  then 1 else 0 end as isolasi_tekanan_negatif_suspect_l,
    case when dg.kddiagnosa= 'Z03.8' and ru.id IN(654,655) and ps.objectjeniskelaminfk =2  then 1 else 0 end as isolasi_tekanan_negatif_suspect_p,
    case when dg.kddiagnosa= 'Z03.8' and ru.id in(671) and ps.objectjeniskelaminfk =1  then 1 else 0 end as icu_dengan_ventilator_suspect_l,
    case when dg.kddiagnosa= 'Z03.8' and ru.id in(671)  and ps.objectjeniskelaminfk =2  then 1 else 0 end as icu_dengan_ventilator_suspect_p,
    case when dg.kddiagnosa= 'Z03.8' and ru.id in(673) and ps.objectjeniskelaminfk =1  then 1 else 0 end as nicu_khusus_covid_suspect_l,
    case when dg.kddiagnosa= 'Z03.8' and ru.id in(673)and ps.objectjeniskelaminfk =2  then 1 else 0 end as nicu_khusus_covid_suspect_p,
    case when dg.kddiagnosa= 'Z03.8' and ru.id=672 and ps.objectjeniskelaminfk =1  then 1 else 0 end as picu_khusus_covid_suspect_l,
    case when dg.kddiagnosa= 'Z03.8' and ru.id=672 and ps.objectjeniskelaminfk =2  then 1 else 0 end as picu_khusus_covid_suspect_p
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
                                AND ddg.objectjenisdiagnosafk = 1
                                AND apd.norec IN (SELECT dip.noregistrasifk FROM diagnosapasien_t AS dip 
                                                                    INNER JOIN detaildiagnosapasien_t as ddip ON ddip.objectdiagnosapasienfk = dip.norec
                                                                    WHERE ddip.objectjenisdiagnosafk = 2)
                and pd.statusenabled =true
                                and ddg.kdprofile = 16
                and pd.tglpulang ISNULL ) as x
           "))->first();
            $methods ='POST';
            if($query->icu_dengan_ventilator_suspect_l== null )
            {$arr = array(
                "tanggal"=> $now,
                "icu_dengan_ventilator_suspect_l"=> "0",
                "icu_dengan_ventilator_suspect_p"=> "0",
                "icu_dengan_ventilator_confirm_l"=> "0",
                "icu_dengan_ventilator_confirm_p"=> "0",
                "icu_tanpa_ventilator_suspect_l"=> "0",
                "icu_tanpa_ventilator_suspect_p"=> "0",
                "icu_tanpa_ventilator_confirm_l"=> "0",
                "icu_tanpa_ventilator_confirm_p"=> "0",
                "icu_tekanan_negatif_dengan_ventilator_suspect_l"=> "0",
                "icu_tekanan_negatif_dengan_ventilator_suspect_p"=> "0",
                "icu_tekanan_negatif_dengan_ventilator_confirm_l"=> "0",
                "icu_tekanan_negatif_dengan_ventilator_confirm_p"=> "0",
                "icu_tekanan_negatif_tanpa_ventilator_suspect_l"=> "0",
                "icu_tekanan_negatif_tanpa_ventilator_suspect_p"=> "0",
                "icu_tekanan_negatif_tanpa_ventilator_confirm_l"=> "0",
                "icu_tekanan_negatif_tanpa_ventilator_confirm_p"=> "0",
                "isolasi_tekanan_negatif_suspect_l"=> "0",
                "isolasi_tekanan_negatif_suspect_p"=> "0",
                "isolasi_tekanan_negatif_confirm_l"=> "0",
                "isolasi_tekanan_negatif_confirm_p"=> "0",
                "isolasi_tanpa_tekanan_negatif_suspect_l"=> "0",
                "isolasi_tanpa_tekanan_negatif_suspect_p"=> "0",
                "isolasi_tanpa_tekanan_negatif_confirm_l"=> "0",
                "isolasi_tanpa_tekanan_negatif_confirm_p"=> "0",
                "isolasi_tanpa_tekanan_negatif_suspect_l"=> "0",
                "isolasi_tanpa_tekanan_negatif_suspect_p"=> "0",
                "isolasi_tanpa_tekanan_negatif_confirm_l"=> "0",
                "isolasi_tanpa_tekanan_negatif_confirm_p"=> "0",
                "nicu_khusus_covid_suspect_l"=> "0",
                "nicu_khusus_covid_suspect_p"=> "0",
                "nicu_khusus_covid_confirm_l"=> "0",
                "nicu_khusus_covid_confirm_p"=> "0",
                "picu_khusus_covid_suspect_l"=> "0",
                "picu_khusus_covid_suspect_p"=> "0",
                "picu_khusus_covid_confirm_l"=> "0",
                "picu_khusus_covid_confirm_p"=> "0", );
            }else {
                $arr = array(
                "tanggal"=> $now,
                "icu_dengan_ventilator_suspect_l"=> $query->icu_dengan_ventilator_suspect_l,
                "icu_dengan_ventilator_suspect_p"=> $query->icu_dengan_ventilator_suspect_p,
                "icu_dengan_ventilator_confirm_l"=> $query->icu_dengan_ventilator_confirm_l,
                "icu_dengan_ventilator_confirm_p"=> $query->icu_dengan_ventilator_confirm_p,
                "icu_tanpa_ventilator_suspect_l"=> "0",
                "icu_tanpa_ventilator_suspect_p"=> "0",
                "icu_tanpa_ventilator_confirm_l"=> "0",
                "icu_tanpa_ventilator_confirm_p"=> "0",
                // "icu_tanpa_ventilator_suspect_l"=> $query->icu_tanpa_ventilator_suspect_l,
                // "icu_tanpa_ventilator_suspect_p"=> $query->icu_tanpa_ventilator_suspect_p,
                // "icu_tanpa_ventilator_confirm_l"=> $query->icu_tanpa_ventilator_confirm_l,
                // "icu_tanpa_ventilator_confirm_p"=> $query->icu_tanpa_ventilator_confirm_p,
                "icu_tekanan_negatif_dengan_ventilator_suspect_l"=> "0",
                "icu_tekanan_negatif_dengan_ventilator_suspect_p"=> "0",
                "icu_tekanan_negatif_dengan_ventilator_confirm_l"=> "0",
                "icu_tekanan_negatif_dengan_ventilator_confirm_p"=> "0",
                // "icu_tekanan_negatif_dengan_ventilator_suspect_l"=> $query->icu_tekanan_negatif_dengan_ventilator_suspect_l,
                // "icu_tekanan_negatif_dengan_ventilator_suspect_p"=> $query->icu_tekanan_negatif_dengan_ventilator_suspect_p,
                // "icu_tekanan_negatif_dengan_ventilator_confirm_l"=> $query->icu_tekanan_negatif_dengan_ventilator_confirm_l,
                // "icu_tekanan_negatif_dengan_ventilator_confirm_p"=> $query->icu_tekanan_negatif_dengan_ventilator_confirm_p,
                "icu_tekanan_negatif_tanpa_ventilator_suspect_l"=> "0",
                "icu_tekanan_negatif_tanpa_ventilator_suspect_p"=> "0",
                "icu_tekanan_negatif_tanpa_ventilator_confirm_l"=> "0",
                "icu_tekanan_negatif_tanpa_ventilator_confirm_p"=> "0",
                // "icu_tekanan_negatif_tanpa_ventilator_suspect_l"=> $query->icu_tekanan_negatif_tanpa_ventilator_suspect_l,
                // "icu_tekanan_negatif_tanpa_ventilator_suspect_p"=> $query->icu_tekanan_negatif_tanpa_ventilator_suspect_p,
                // "icu_tekanan_negatif_tanpa_ventilator_confirm_l"=> $query->icu_tekanan_negatif_tanpa_ventilator_confirm_l,
                // "icu_tekanan_negatif_tanpa_ventilator_confirm_p"=> $query->icu_tekanan_negatif_tanpa_ventilator_confirm_p,
                "isolasi_tekanan_negatif_suspect_l"=> $query->isolasi_tekanan_negatif_suspect_l,
                "isolasi_tekanan_negatif_suspect_p"=> $query->isolasi_tekanan_negatif_suspect_p,
                "isolasi_tekanan_negatif_confirm_l"=> $query->isolasi_tekanan_negatif_confirm_l,
                "isolasi_tekanan_negatif_confirm_p"=> $query->isolasi_tekanan_negatif_confirm_p,
                "isolasi_tanpa_tekanan_negatif_suspect_l"=> "0",
                "isolasi_tanpa_tekanan_negatif_suspect_p"=> "0",
                "isolasi_tanpa_tekanan_negatif_confirm_l"=> "0",
                "isolasi_tanpa_tekanan_negatif_confirm_p"=> "0",
                "isolasi_tanpa_tekanan_negatif_suspect_l"=> "0",
                "isolasi_tanpa_tekanan_negatif_suspect_p"=> "0",
                "isolasi_tanpa_tekanan_negatif_confirm_l"=> "0",
                "isolasi_tanpa_tekanan_negatif_confirm_p"=> "0",
                // "isolasi_tanpa_tekanan_negatif_suspect_l"=> $query->isolasi_tanpa_tekanan_negatif_suspect_l,
                // "isolasi_tanpa_tekanan_negatif_suspect_p"=> $query->isolasi_tanpa_tekanan_negatif_suspect_p,
                // "isolasi_tanpa_tekanan_negatif_confirm_l"=> $query->isolasi_tanpa_tekanan_negatif_confirm_l,
                // "isolasi_tanpa_tekanan_negatif_confirm_p"=> $query->isolasi_tanpa_tekanan_negatif_confirm_p,
                // "isolasi_tanpa_tekanan_negatif_suspect_l"=> $query->isolasi_tanpa_tekanan_negatif_suspect_l,
                // "isolasi_tanpa_tekanan_negatif_suspect_p"=> $query->isolasi_tanpa_tekanan_negatif_suspect_p,
                // "isolasi_tanpa_tekanan_negatif_confirm_l"=> $query->isolasi_tanpa_tekanan_negatif_confirm_l,
                "nicu_khusus_covid_suspect_l"=> $query->nicu_khusus_covid_suspect_l,
                "nicu_khusus_covid_suspect_p"=> $query->nicu_khusus_covid_suspect_p,
                "nicu_khusus_covid_confirm_l"=> $query->nicu_khusus_covid_confirm_l,
                "nicu_khusus_covid_confirm_p"=> $query->nicu_khusus_covid_confirm_p,
                "picu_khusus_covid_suspect_l"=> $query->picu_khusus_covid_suspect_l,
                "picu_khusus_covid_suspect_p"=> $query->picu_khusus_covid_suspect_p,
                "picu_khusus_covid_confirm_l"=> $query->picu_khusus_covid_confirm_l,
                "picu_khusus_covid_confirm_p"=> $query->picu_khusus_covid_confirm_p, );

            }
            
           
//            return $this->respond($arr);
            $dataJsonSend = json_encode ($arr);
        } else if($method == 'get'){
            $methods ='GET';
            $dataJsonSend = null;
        }else if($method == 'delete'){
            $methods ='DELETE';
            $now =  date('Y-m-d');
            if(isset($request['tgl'])){
                $now  = $request['tgl'];
            }
            $arr = array(
                "tanggal" =>$now ,
            );
            $dataJsonSend = json_encode ($arr);
        }
        $url = "http://sirs.kemkes.go.id/fo/index.php/LapV2/PasienDirawatKomorbid";
        $response = $this->sendBridgingCurl($headers , $dataJsonSend, $url ,$methods);
        return $this->respond($response);

	}
	public function NonKomorbid($method,Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers =  $this->getHeadersCovid($kdProfile);
        if($method == 'post'){
            $now =  date('Y-m-d');
            if(isset($request['tgl'])){
                $now  = $request['tgl'];
            }
            $query = collect(DB::select("SELECT sum(x.icu_dengan_ventilator_suspect_l) as icu_dengan_ventilator_suspect_l,
sum(x.icu_dengan_ventilator_suspect_p)as icu_dengan_ventilator_suspect_p,
sum(x.icu_dengan_ventilator_confirm_l) as icu_dengan_ventilator_confirm_l,
sum(x.icu_dengan_ventilator_confirm_p)as icu_dengan_ventilator_confirm_p,
sum(x.isolasi_tekanan_negatif_suspect_l) as isolasi_tekanan_negatif_suspect_l   ,
sum(x.isolasi_tekanan_negatif_suspect_p) as isolasi_tekanan_negatif_suspect_p,
sum(x.isolasi_tekanan_negatif_confirm_l) as isolasi_tekanan_negatif_confirm_l,
sum(x.isolasi_tekanan_negatif_confirm_p) as isolasi_tekanan_negatif_confirm_p,
sum(x.nicu_khusus_covid_suspect_l)as nicu_khusus_covid_suspect_l,
sum(x.nicu_khusus_covid_suspect_p) as nicu_khusus_covid_suspect_p,
sum(x.nicu_khusus_covid_confirm_l) as nicu_khusus_covid_confirm_l,
sum(x.nicu_khusus_covid_confirm_p) as nicu_khusus_covid_confirm_p,
sum(x.picu_khusus_covid_suspect_l) as picu_khusus_covid_suspect_l,
sum(x.picu_khusus_covid_suspect_p) as picu_khusus_covid_suspect_p,
sum(x.picu_khusus_covid_confirm_l) as picu_khusus_covid_confirm_l,
sum(x.picu_khusus_covid_confirm_p) as picu_khusus_covid_confirm_p
FROM(select case when dg.kddiagnosa= 'B34.2' and ru.id IN(654,655) and ps.objectjeniskelaminfk =1  then 1 else 0 end as isolasi_tekanan_negatif_confirm_l,
    case when dg.kddiagnosa= 'B34.2' and ru.id IN(654,655) and ps.objectjeniskelaminfk =2  then 1 else 0 end as isolasi_tekanan_negatif_confirm_p,
    case when dg.kddiagnosa= 'B34.2' and ru.id in(671) and ps.objectjeniskelaminfk =1  then 1 else 0 end as icu_dengan_ventilator_confirm_l,
    case when dg.kddiagnosa= 'B34.2' and ru.id in(671)  and ps.objectjeniskelaminfk =2  then 1 else 0 end as icu_dengan_ventilator_confirm_p,
    case when dg.kddiagnosa= 'B34.2' and ru.id in(673) and ps.objectjeniskelaminfk =1  then 1 else 0 end as nicu_khusus_covid_confirm_l,
    case when dg.kddiagnosa= 'B34.2' and ru.id in(673)and ps.objectjeniskelaminfk =2  then 1 else 0 end as nicu_khusus_covid_confirm_p,
    case when dg.kddiagnosa= 'B34.2' and ru.id=672 and ps.objectjeniskelaminfk =1  then 1 else 0 end as picu_khusus_covid_confirm_l,
    case when dg.kddiagnosa= 'B34.2' and ru.id=672 and ps.objectjeniskelaminfk =2  then 1 else 0 end as picu_khusus_covid_confirm_p,
        
case when dg.kddiagnosa= 'Z03.8' and ru.id IN(654,655) and ps.objectjeniskelaminfk =1  then 1 else 0 end as isolasi_tekanan_negatif_suspect_l,
    case when dg.kddiagnosa= 'Z03.8' and ru.id IN(654,655) and ps.objectjeniskelaminfk =2  then 1 else 0 end as isolasi_tekanan_negatif_suspect_p,
    case when dg.kddiagnosa= 'Z03.8' and ru.id in(671) and ps.objectjeniskelaminfk =1  then 1 else 0 end as icu_dengan_ventilator_suspect_l,
    case when dg.kddiagnosa= 'Z03.8' and ru.id in(671)  and ps.objectjeniskelaminfk =2  then 1 else 0 end as icu_dengan_ventilator_suspect_p,
    case when dg.kddiagnosa= 'Z03.8' and ru.id in(673) and ps.objectjeniskelaminfk =1  then 1 else 0 end as nicu_khusus_covid_suspect_l,
    case when dg.kddiagnosa= 'Z03.8' and ru.id in(673)and ps.objectjeniskelaminfk =2  then 1 else 0 end as nicu_khusus_covid_suspect_p,
    case when dg.kddiagnosa= 'Z03.8' and ru.id=672 and ps.objectjeniskelaminfk =1  then 1 else 0 end as picu_khusus_covid_suspect_l,
    case when dg.kddiagnosa= 'Z03.8' and ru.id=672 and ps.objectjeniskelaminfk =2  then 1 else 0 end as picu_khusus_covid_suspect_p
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
                                AND ddg.objectjenisdiagnosafk = 1
                                AND apd.norec NOT IN (SELECT dip.noregistrasifk FROM diagnosapasien_t AS dip 
                                                                    INNER JOIN detaildiagnosapasien_t as ddip ON ddip.objectdiagnosapasienfk = dip.norec
                                                                    WHERE ddip.objectjenisdiagnosafk = 2)
                and pd.statusenabled =true
                                and ddg.kdprofile = 16
                and pd.tglpulang ISNULL ) as x
            "))->first();
            $methods ='POST';
            if($query->icu_dengan_ventilator_suspect_l== null )
            {
                $arr = array(
                "tanggal"=> $now,
                "icu_dengan_ventilator_suspect_l"=> "0",
                "icu_dengan_ventilator_suspect_p"=> "0",
                "icu_dengan_ventilator_confirm_l"=> "0",
                "icu_dengan_ventilator_confirm_p"=> "0",
                "icu_tanpa_ventilator_suspect_l"=> "0",
                "icu_tanpa_ventilator_suspect_p"=> "0",
                "icu_tanpa_ventilator_confirm_l"=> "0",
                "icu_tanpa_ventilator_confirm_p"=> "0",
                "icu_tekanan_negatif_dengan_ventilator_suspect_l"=> "0",
                "icu_tekanan_negatif_dengan_ventilator_suspect_p"=> "0",
                "icu_tekanan_negatif_dengan_ventilator_confirm_l"=> "0",
                "icu_tekanan_negatif_dengan_ventilator_confirm_p"=> "0",
                "icu_tekanan_negatif_tanpa_ventilator_suspect_l"=> "0",
                "icu_tekanan_negatif_tanpa_ventilator_suspect_p"=> "0",
                "icu_tekanan_negatif_tanpa_ventilator_confirm_l"=> "0",
                "icu_tekanan_negatif_tanpa_ventilator_confirm_p"=> "0",
                "isolasi_tekanan_negatif_suspect_l"=> "0",
                "isolasi_tekanan_negatif_suspect_p"=> "0",
                "isolasi_tekanan_negatif_confirm_l"=> "0",
                "isolasi_tekanan_negatif_confirm_p"=> "0",
                "isolasi_tanpa_tekanan_negatif_suspect_l"=> "0",
                "isolasi_tanpa_tekanan_negatif_suspect_p"=> "0",
                "isolasi_tanpa_tekanan_negatif_confirm_l"=> "0",
                "isolasi_tanpa_tekanan_negatif_confirm_p"=> "0",
                "nicu_khusus_covid_suspect_l"=> "0",
                "nicu_khusus_covid_suspect_p"=> "0",
                "nicu_khusus_covid_confirm_l"=> "0",
                "nicu_khusus_covid_confirm_p"=> "0",
                "picu_khusus_covid_suspect_l"=> "0",
                "picu_khusus_covid_suspect_p"=> "0",
                "picu_khusus_covid_confirm_l"=> "0",
                "picu_khusus_covid_confirm_p"=> "0", );
            }else {
                $arr = array(
                "tanggal"=> $now,
                "icu_dengan_ventilator_suspect_l"=> $query->icu_dengan_ventilator_suspect_l,
                "icu_dengan_ventilator_suspect_p"=> $query->icu_dengan_ventilator_suspect_p,
                "icu_dengan_ventilator_confirm_l"=> $query->icu_dengan_ventilator_confirm_l,
                "icu_dengan_ventilator_confirm_p"=> $query->icu_dengan_ventilator_confirm_p,
                "icu_tanpa_ventilator_suspect_l"=> "0",
                "icu_tanpa_ventilator_suspect_p"=> "0",
                "icu_tanpa_ventilator_confirm_l"=> "0",
                "icu_tanpa_ventilator_confirm_p"=> "0",
                // "icu_tanpa_ventilator_suspect_l"=> $query->icu_tanpa_ventilator_suspect_l,
                // "icu_tanpa_ventilator_suspect_p"=> $query->icu_tanpa_ventilator_suspect_p,
                // "icu_tanpa_ventilator_confirm_l"=> $query->icu_tanpa_ventilator_confirm_l,
                // "icu_tanpa_ventilator_confirm_p"=> $query->icu_tanpa_ventilator_confirm_p,
                "icu_tekanan_negatif_dengan_ventilator_suspect_l"=> "0",
                "icu_tekanan_negatif_dengan_ventilator_suspect_p"=> "0",
                "icu_tekanan_negatif_dengan_ventilator_confirm_l"=> "0",
                "icu_tekanan_negatif_dengan_ventilator_confirm_p"=> "0",
                // "icu_tekanan_negatif_dengan_ventilator_suspect_l"=> $query->icu_tekanan_negatif_dengan_ventilator_suspect_l,
                // "icu_tekanan_negatif_dengan_ventilator_suspect_p"=> $query->icu_tekanan_negatif_dengan_ventilator_suspect_p,
                // "icu_tekanan_negatif_dengan_ventilator_confirm_l"=> $query->icu_tekanan_negatif_dengan_ventilator_confirm_l,
                // "icu_tekanan_negatif_dengan_ventilator_confirm_p"=> $query->icu_tekanan_negatif_dengan_ventilator_confirm_p,
                "icu_tekanan_negatif_tanpa_ventilator_suspect_l"=> "0",
                "icu_tekanan_negatif_tanpa_ventilator_suspect_p"=> "0",
                "icu_tekanan_negatif_tanpa_ventilator_confirm_l"=> "0",
                "icu_tekanan_negatif_tanpa_ventilator_confirm_p"=> "0",
                // "icu_tekanan_negatif_tanpa_ventilator_suspect_l"=> $query->icu_tekanan_negatif_tanpa_ventilator_suspect_l,
                // "icu_tekanan_negatif_tanpa_ventilator_suspect_p"=> $query->icu_tekanan_negatif_tanpa_ventilator_suspect_p,
                // "icu_tekanan_negatif_tanpa_ventilator_confirm_l"=> $query->icu_tekanan_negatif_tanpa_ventilator_confirm_l,
                // "icu_tekanan_negatif_tanpa_ventilator_confirm_p"=> $query->icu_tekanan_negatif_tanpa_ventilator_confirm_p,
                "isolasi_tekanan_negatif_suspect_l"=> $query->isolasi_tekanan_negatif_suspect_l,
                "isolasi_tekanan_negatif_suspect_p"=> $query->isolasi_tekanan_negatif_suspect_p,
                "isolasi_tekanan_negatif_confirm_l"=> $query->isolasi_tekanan_negatif_confirm_l,
                "isolasi_tekanan_negatif_confirm_p"=> $query->isolasi_tekanan_negatif_confirm_p,
                "isolasi_tanpa_tekanan_negatif_suspect_l"=> "0",
                "isolasi_tanpa_tekanan_negatif_suspect_p"=> "0",
                "isolasi_tanpa_tekanan_negatif_confirm_l"=> "0",
                "isolasi_tanpa_tekanan_negatif_confirm_p"=> "0",
                "isolasi_tanpa_tekanan_negatif_suspect_l"=> "0",
                "isolasi_tanpa_tekanan_negatif_suspect_p"=> "0",
                "isolasi_tanpa_tekanan_negatif_confirm_l"=> "0",
                "isolasi_tanpa_tekanan_negatif_confirm_p"=> "0",
                // "isolasi_tanpa_tekanan_negatif_suspect_l"=> $query->isolasi_tanpa_tekanan_negatif_suspect_l,
                // "isolasi_tanpa_tekanan_negatif_suspect_p"=> $query->isolasi_tanpa_tekanan_negatif_suspect_p,
                // "isolasi_tanpa_tekanan_negatif_confirm_l"=> $query->isolasi_tanpa_tekanan_negatif_confirm_l,
                // "isolasi_tanpa_tekanan_negatif_confirm_p"=> $query->isolasi_tanpa_tekanan_negatif_confirm_p,
                // "isolasi_tanpa_tekanan_negatif_suspect_l"=> $query->isolasi_tanpa_tekanan_negatif_suspect_l,
                // "isolasi_tanpa_tekanan_negatif_suspect_p"=> $query->isolasi_tanpa_tekanan_negatif_suspect_p,
                // "isolasi_tanpa_tekanan_negatif_confirm_l"=> $query->isolasi_tanpa_tekanan_negatif_confirm_l,
                "nicu_khusus_covid_suspect_l"=> $query->nicu_khusus_covid_suspect_l,
                "nicu_khusus_covid_suspect_p"=> $query->nicu_khusus_covid_suspect_p,
                "nicu_khusus_covid_confirm_l"=> $query->nicu_khusus_covid_confirm_l,
                "nicu_khusus_covid_confirm_p"=> $query->nicu_khusus_covid_confirm_p,
                "picu_khusus_covid_suspect_l"=> $query->picu_khusus_covid_suspect_l,
                "picu_khusus_covid_suspect_p"=> $query->picu_khusus_covid_suspect_p,
                "picu_khusus_covid_confirm_l"=> $query->picu_khusus_covid_confirm_l,
                "picu_khusus_covid_confirm_p"=> $query->picu_khusus_covid_confirm_p, );

//            return $this->respond($arr);

            }
            $dataJsonSend = json_encode ($arr);
        } else if($method == 'get'){
            $methods ='GET';
            $dataJsonSend = null;
        }else if($method == 'delete'){
            $methods ='DELETE';
            $now =  date('Y-m-d');
            if(isset($request['tgl'])){
                $now  = $request['tgl'];
            }
            $arr = array(
                "tanggal" =>  $now,
            );
            $dataJsonSend = json_encode ($arr);
        }
        $url = "http://sirs.kemkes.go.id/fo/index.php/LapV2/PasienDirawatTanpaKomorbid";
        $response = $this->sendBridgingCurl($headers , $dataJsonSend, $url,$methods);
        return $this->respond($response);
	}
	public function PasienKeluar($method,Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers =  $this->getHeadersCovid($kdProfile);
        $now = date('Y-m-d');
        if($method == 'post'){
            $now =  date('Y-m-d');
            if(isset($request['tgl'])){
                $now  = $request['tgl'];
            }
            $kom = collect(DB::select("select
                    sum(z.sembuh) as sembuh,
                    sum(z.discarded) as discarded,
                    sum(z.meninggal_komorbid) as meninggal_komorbid,
                    sum(z.meninggal_prob_pre_komorbid) as meninggal_prob_pre_komorbid,
                    sum(z.meninggal_prob_bayi_komorbid) as meninggal_prob_bayi_komorbid,
                    sum(z.meninggal_prob_neo_komorbid) as meninggal_prob_neo_komorbid,
                    sum(z.meninggal_prob_balita_komorbid) as meninggal_prob_balita_komorbid,
                    sum(z.meninggal_prob_anak_komorbid) as meninggal_prob_anak_komorbid,
                    sum(z.meninggal_prob_remaja_komorbid) as meninggal_prob_remaja_komorbid,
                    sum(z.meninggal_prob_dws_komorbid) as meninggal_prob_dws_komorbid,
                       sum(z.meninggal_prob_lansia_komorbid) as meninggal_prob_lansia_komorbid,
                    sum(z.meninggal_disarded_komorbid) as meninggal_disarded_komorbid,
                    sum(z.aps) as aps,
                    sum(z.dirujuk) as dirujuk,
                    sum(z.isman) as isman
                    from (
                    select
                    case when x.spid in (6,34,20,1) and x.kddiagnosa='B34.2' then 1 else 0 end as sembuh,
                    case when x.spid in (5,4,3,10,11) and x.kddiagnosa='B34.2' then 1 else 0 end   as discarded ,
                    case when x.skid in (11,5,15) and x.kddiagnosa='B34.2' then 1 else 0 end as meninggal_komorbid ,
                    case when x.skid in (11,5,15) and x.kddiagnosa='Z03.8' and (x.hari <= 6) and x.scid =10 then 1 else 0 end as meninggal_prob_pre_komorbid,
                    case when x.skid in (11,5,15) and x.kddiagnosa='Z03.8' and (x.hari >= 7 and x.hari <= 28) and x.scid =10 then 1 else 0 end as meninggal_prob_neo_komorbid,
                    case when x.skid in (11,5,15) and x.kddiagnosa='Z03.8' and (x.hari >= 29 and x.umur < 1) and x.scid =10 then 1 else 0 end as meninggal_prob_bayi_komorbid,
                    case when x.skid in (11,5,15) and x.kddiagnosa='Z03.8' and (x.umur >= 1 and x.umur < 4) and x.scid =10 then 1 else 0 end as meninggal_prob_balita_komorbid,
                    case when x.skid in (11,5,15) and x.kddiagnosa='Z03.8' and (x.umur >= 5 and x.umur <= 18) and x.scid =10 then 1 else 0 end as meninggal_prob_anak_komorbid,
                    case when x.skid in (11,5,15) and x.kddiagnosa='Z03.8' and (x.umur >= 19 and x.umur <= 40) and x.scid =10 then 1 else 0 end as meninggal_prob_remaja_komorbid,
                    case when x.skid in (11,5,15) and x.kddiagnosa='Z03.8' and (x.umur >= 41 and x.umur <= 60) and x.scid =10 then 1 else 0 end as meninggal_prob_dws_komorbid,
                    case when x.skid in (11,5,15) and x.kddiagnosa='Z03.8' and (x.umur > 60 ) and x.scid =10 then 1 else 0 end as meninggal_prob_lansia_komorbid,
                    case when x.skid in (11,5,15) and x.kddiagnosa='Z03.8' and x.scid in (7) then 1 else 0 end as meninggal_disarded_komorbid ,
                    case when x.spid in (2) then 1 else 0 end as aps,
                    case when x.spid in (11,10,3,4) then 1 else 0 end as dirujuk,
                    0 as isman
                    from (
                    SELECT
                    dg.kddiagnosa,
                    ddg.objectjenisdiagnosafk,
                    pd.noregistrasi,
                    pd.tglpulang,
                    sk.statuskeluar,
                    sp.statuspulang,
                    ps.tgllahir,
                    0 as scid,
                    sp.id as spid,
                    sk.id as skid,
                    (CURRENT_DATE - ps.tgllahir::date) as hari,
                    DATE_PART('year',CURRENT_DATE) - DATE_PART('year', ps.tgllahir::date)as umur
                    FROM
                    pasiendaftar_t as pd
                    INNER JOIN statuskeluar_m as sk on sk.id = pd.objectstatuskeluarfk
                    INNER JOIN statuspulang_m as sp on sp.id = pd.objectstatuspulangfk
                    INNER JOIN antrianpasiendiperiksa_t as apd ON apd.noregistrasifk = pd.norec
                    INNER JOIN diagnosapasien_t as dgp ON dgp.noregistrasifk = apd.norec
                    INNER JOIN detaildiagnosapasien_t as ddg ON ddg.objectdiagnosapasienfk = dgp.norec
                    INNER JOIN diagnosa_m as dg ON dg.id = ddg.objectdiagnosafk
                    INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                    INNER JOIN pasien_m as ps on ps.id=pd.nocmfk
                    WHERE
                    pd.kdprofile=16
                    and pd.statusenabled = true
                    and pd.tglpulang between '$now 00:00' and '$now 23:59'
                    AND apd.norec  IN (SELECT dip.noregistrasifk FROM diagnosapasien_t AS dip 
                                                                INNER JOIN detaildiagnosapasien_t as ddip ON ddip.objectdiagnosapasienfk = dip.norec
                                                                WHERE ddip.objectjenisdiagnosafk = 2)
                    
                    ) as x
                    ) as z
                "))->first();

            $nonKom = collect(DB::select("select
                    sum(z.sembuh) as sembuh,
                    sum(z.discarded) as discarded,
                    sum(z.meninggal_tanpa_komorbid) as meninggal_tanpa_komorbid,
                    sum(z.meninggal_prob_pre_tanpa_komorbid) as meninggal_prob_pre_tanpa_komorbid,
                    sum(z.meninggal_prob_neo_tanpa_komorbid) as meninggal_prob_neo_tanpa_komorbid,
                    sum(z.meninggal_prob_bayi_tanpa_komorbid) as meninggal_prob_bayi_tanpa_komorbid,
                    sum(z.meninggal_prob_balita_tanpa_komorbid) as meninggal_prob_balita_tanpa_komorbid,
                    sum(z.meninggal_prob_anak_tanpa_komorbid) as meninggal_prob_anak_tanpa_komorbid,
                    sum(z.meninggal_prob_remaja_tanpa_komorbid) as meninggal_prob_remaja_tanpa_komorbid,
                    sum(z.meninggal_prob_dws_tanpa_komorbid) as meninggal_prob_dws_tanpa_komorbid,
                    sum(z.meninggal_prob_lansia_tanpa_komorbid) as meninggal_prob_lansia_tanpa_komorbid,
                    sum(z.meninggal_discarded_tanpa_komorbid) as meninggal_discarded_tanpa_komorbid,
                    sum(z.aps) as aps,
                    sum(z.dirujuk) as dirujuk,
                    sum(z.isman) as isman
                    from (
                    select
                    case when x.spid in (6,34,20,1) and x.kddiagnosa='B34.2' then 1 else 0 end as sembuh,
                    case when x.spid in (5,4,3,10,11) and x.kddiagnosa='B34.2' then 1 else 0 end   as discarded ,
                    case when x.skid in (11,5,15) and x.kddiagnosa='B34.2' then 1 else 0 end as meninggal_tanpa_komorbid ,
                    case when x.skid in (11,5,15) and x.kddiagnosa='Z03.8' and (x.hari <= 6) and x.scid =10 then 1 else 0 end as meninggal_prob_pre_tanpa_komorbid,
                    case when x.skid in (11,5,15) and x.kddiagnosa='Z03.8' and (x.hari >= 7 and x.hari <= 28) and x.scid =10 then 1 else 0 end as meninggal_prob_neo_tanpa_komorbid,
                    case when x.skid in (11,5,15) and x.kddiagnosa='Z03.8' and (x.hari >= 29 and x.umur < 1) and x.scid =10 then 1 else 0 end as meninggal_prob_bayi_tanpa_komorbid,
                    case when x.skid in (11,5,15) and x.kddiagnosa='Z03.8' and (x.umur >= 1 and x.umur < 4) and x.scid =10 then 1 else 0 end as meninggal_prob_balita_tanpa_komorbid,
                    case when x.skid in (11,5,15) and x.kddiagnosa='Z03.8' and (x.umur >= 5 and x.umur <= 18) and x.scid =10 then 1 else 0 end as meninggal_prob_anak_tanpa_komorbid,
                    case when x.skid in (11,5,15) and x.kddiagnosa='Z03.8' and (x.umur >= 19 and x.umur <= 40) and x.scid =10 then 1 else 0 end as meninggal_prob_remaja_tanpa_komorbid,
                    case when x.skid in (11,5,15) and x.kddiagnosa='Z03.8' and (x.umur >= 41 and x.umur <= 60) and x.scid =10 then 1 else 0 end as meninggal_prob_dws_tanpa_komorbid,
                    case when x.skid in (11,5,15) and x.kddiagnosa='Z03.8' and (x.umur > 60 ) and x.scid =10 then 1 else 0 end as meninggal_prob_lansia_tanpa_komorbid,
                    case when x.skid in (11,5,15) and x.kddiagnosa='Z03.8' and x.scid in (7) then 1 else 0 end as meninggal_discarded_tanpa_komorbid ,
                    case when x.spid in (2) then 1 else 0 end as aps,
                    case when x.spid in (11,10,3,4) then 1 else 0 end as dirujuk,
                    0 as isman
                    from (
                    SELECT
                    dg.kddiagnosa,
                    ddg.objectjenisdiagnosafk,
                    pd.noregistrasi,
                    pd.tglpulang,
                    sk.statuskeluar,
                    sp.statuspulang,
                    ps.tgllahir,
                    0 as scid,
                    sp.id as spid,
                    sk.id as skid,
                    (CURRENT_DATE - ps.tgllahir::date) as hari,
                    DATE_PART('year',CURRENT_DATE) - DATE_PART('year', ps.tgllahir::date)as umur
                    FROM
                    pasiendaftar_t as pd
                    INNER JOIN statuskeluar_m as sk on sk.id = pd.objectstatuskeluarfk
                    INNER JOIN statuspulang_m as sp on sp.id = pd.objectstatuspulangfk
                    INNER JOIN antrianpasiendiperiksa_t as apd ON apd.noregistrasifk = pd.norec
                    INNER JOIN diagnosapasien_t as dgp ON dgp.noregistrasifk = apd.norec
                    INNER JOIN detaildiagnosapasien_t as ddg ON ddg.objectdiagnosapasienfk = dgp.norec
                    INNER JOIN diagnosa_m as dg ON dg.id = ddg.objectdiagnosafk
                    INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                    INNER JOIN pasien_m as ps on ps.id=pd.nocmfk
                    WHERE
                    pd.kdprofile=16
                    and pd.statusenabled = true
                    and pd.tglpulang between '$now 00:00' and '$now 23:59'
                    AND apd.norec NOT IN (SELECT dip.noregistrasifk FROM diagnosapasien_t AS dip 
                                                                INNER JOIN detaildiagnosapasien_t as ddip ON ddip.objectdiagnosapasienfk = dip.norec
                                                                WHERE ddip.objectjenisdiagnosafk = 2)
                    
                    ) as x
                    ) as z
                "))->first();
//            dd($query);
            $methods ='POST';
            $discared = 0;
            if($nonKom->discarded != null ){ $discared= $nonKom->discarded ; }
            if($kom->discarded != null ){$discared= $discared + $kom->discarded ; }
            $sembuh = 0;
            if($nonKom->sembuh != null ){ $sembuh= $nonKom->sembuh ; }
            if($kom->sembuh != null ){$sembuh= $sembuh + $kom->sembuh ;}
            $rujuk = 0;
            if($nonKom->dirujuk != null ){ $rujuk= $nonKom->dirujuk ; }
            if($kom->dirujuk != null ){$rujuk= $rujuk + $kom->dirujuk ;  }
            $isman = 0;
            if($nonKom->isman != null ){ $isman= $nonKom->isman ; }
            if($kom->isman != null ){$isman= $isman + $kom->isman ;  }
            $aps = 0;
            if($nonKom->aps != null ){ $aps= $nonKom->aps ; }
            if($kom->aps != null ){$aps= $aps + $kom->aps ;  }
            $arr = array(
                "tanggal"=> $now,
                "sembuh"=> $sembuh,
                "discarded"=> $discared,
                "meninggal_komorbid"=>  $kom->meninggal_komorbid != null ? $kom->meninggal_komorbid : 0,
                "meninggal_tanpa_komorbid"=> $nonKom->meninggal_tanpa_komorbid != null ? $nonKom->meninggal_tanpa_komorbid : 0,
                "meninggal_prob_pre_komorbid"=>   $kom->meninggal_prob_pre_komorbid != null ? $kom->meninggal_prob_pre_komorbid : 0,
                "meninggal_prob_neo_komorbid"=>   $kom->meninggal_prob_neo_komorbid != null ? $kom->meninggal_prob_neo_komorbid : 0,
                "meninggal_prob_bayi_komorbid"=>  $kom->meninggal_prob_bayi_komorbid != null ? $kom->meninggal_prob_bayi_komorbid : 0,
                "meninggal_prob_balita_komorbid"=>   $kom->meninggal_prob_balita_komorbid != null ? $kom->meninggal_prob_balita_komorbid : 0,
                "meninggal_prob_anak_komorbid"=>   $kom->meninggal_prob_anak_komorbid != null ? $kom->meninggal_prob_anak_komorbid : 0,
                "meninggal_prob_remaja_komorbid"=>   $kom->meninggal_prob_remaja_komorbid != null ? $kom->meninggal_prob_remaja_komorbid : 0,
                "meninggal_prob_dws_komorbid"=>   $kom->meninggal_prob_dws_komorbid != null ? $kom->meninggal_prob_dws_komorbid : 0,
                "meninggal_prob_lansia_komorbid"=>  $kom->meninggal_prob_lansia_komorbid != null ? $kom->meninggal_prob_lansia_komorbid : 0,
                "meninggal_prob_pre_tanpa_komorbid"=>   $nonKom->meninggal_prob_pre_tanpa_komorbid != null ? $nonKom->meninggal_prob_pre_tanpa_komorbid : 0,
                "meninggal_prob_neo_tanpa_komorbid"=> $nonKom->meninggal_prob_neo_tanpa_komorbid != null ? $nonKom->meninggal_prob_neo_tanpa_komorbid : 0,
                "meninggal_prob_bayi_tanpa_komorbid"=> $nonKom->meninggal_prob_bayi_tanpa_komorbid != null ? $nonKom->meninggal_prob_bayi_tanpa_komorbid : 0,
                "meninggal_prob_balita_tanpa_komorbid"=>$nonKom->meninggal_prob_balita_tanpa_komorbid != null ? $nonKom->meninggal_prob_balita_tanpa_komorbid : 0,
                "meninggal_prob_anak_tanpa_komorbid"=> $nonKom->meninggal_prob_anak_tanpa_komorbid != null ? $nonKom->meninggal_prob_anak_tanpa_komorbid : 0,
                "meninggal_prob_remaja_tanpa_komorbid"=> $nonKom->meninggal_prob_remaja_tanpa_komorbid != null ? $nonKom->meninggal_prob_remaja_tanpa_komorbid : 0,
                "meninggal_prob_dws_tanpa_komorbid"=>$nonKom->meninggal_prob_dws_tanpa_komorbid != null ? $nonKom->meninggal_prob_dws_tanpa_komorbid : 0,
                "meninggal_prob_lansia_tanpa_komorbid"=> $nonKom->meninggal_prob_lansia_tanpa_komorbid != null ? $nonKom->meninggal_prob_lansia_tanpa_komorbid : 0,
                "meninggal_disarded_komorbid"=>$kom->meninggal_disarded_komorbid != null ? $kom->meninggal_disarded_komorbid : 0,
                "meninggal_discarded_tanpa_komorbid"=>$nonKom->meninggal_discarded_tanpa_komorbid != null ? $nonKom->meninggal_discarded_tanpa_komorbid : 0,
                "dirujuk"=>$rujuk,
                "isman"=>$isman,
                "aps"=>$aps,
            );
//            return $this->respond($arr);
            $dataJsonSend = json_encode ($arr);
        } else if($method == 'get'){
            $methods ='GET';
            $dataJsonSend = null;
        }else if($method == 'delete'){
            $methods ='DELETE';
            $now =  date('Y-m-d');
            if(isset($request['tgl'])){
                $now  = $request['tgl'];
            }
            $arr = array(
                "tanggal" =>  $now,
            );
            $dataJsonSend = json_encode ($arr);
        }
        $url = "http://sirs.kemkes.go.id/fo/index.php/LapV2/PasienKeluar";
        $response = $this->sendBridgingCurl($headers , $dataJsonSend, $url,$methods);
        return $this->respond($response);
	}
	public function getRefTT(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers =  $this->getHeadersCovid($kdProfile);
        $dataJsonSend = null;
        $methods ='GET';
        $url = "http://sirs.kemkes.go.id/fo/index.php/Referensi/tempat_tidur";
        $response = $this->sendBridgingCurl($headers , $dataJsonSend, $url,$methods);
        return $this->respond($response);
    }
    public function getRefUsia(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers =  $this->getHeadersCovid($kdProfile);
        $dataJsonSend = null;
        $methods ='GET';
        $url = "http://sirs.kemkes.go.id/fo/index.php/Referensi/usia_meninggal_probable";
        $response = $this->sendBridgingCurl($headers , $dataJsonSend, $url,$methods);
        return $this->respond($response);
	}
    public function Fasyankessatuan($method, Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers =  $this->getHeadersCovid($kdProfile);
        $dataJsonSend=null;
        $noreckamar = $request['noreckamar'];
        $nott = $request['nott'];
        // return($nott);
        // die();
        $arr =[];
        
            $q = collect(DB::select("SELECT       x.kodesiranap, x.kodesirs as id_tt,SUM(isi) AS terpakai, COUNT(tt_id) AS jumlah, SUM(jumlah_ruang) AS jumlah_ruang, namaruangan
            FROM            (SELECT DISTINCT 
            ru.kodesiranap ,tt.id AS tt_id, tt.nomorbed AS namabed, kmr.id AS kmr_id, kmr.namakamar, ru.id AS id_ruangan, 
                                                                case when ru.kodesirs =1 then 'VVIP/ Super VIP'
                                                                when ru.kodesirs =2 then 'VIP'
                                                                when ru.kodesirs =3 then 'Kelas I'
                                                                when ru.kodesirs =4 then 'Kelas II'
                                                                when ru.kodesirs =5 then 'Kelas III'
                                                                when ru.kodesirs =6 then 'ICU'
                                                                when ru.kodesirs =7 then 'HCU'
                                                                when ru.kodesirs =8 then 'ICCU/ICVCU'
                                                                when ru.kodesirs =9 then 'RICU'
                                                                when ru.kodesirs =10 then 'NICU'
                                                                when ru.kodesirs =11 then 'Picu'
                                                                when ru.kodesirs =12 then 'Isolasi'
                                                                when ru.kodesirs =14 then 'Perinatologi'
                                                                when ru.kodesirs =24 then 'ICU Tekanan Negatif dengan Ventilator'
                                                                when ru.kodesirs =25 then 'ICU Tekanan Negatif tanpa Ventilator'
                                                                when ru.kodesirs =26 then 'ICU Tanpa Tekanan Negatif Dengan Ventilator'
                                                                when ru.kodesirs =27 then 'ICU Tanpa Tekanan Negatif Tanpa Ventilator'
                                                                when ru.kodesirs =28 then 'Isolasi Tekanan Negatif'
                                                                when ru.kodesirs =29 then 'Isolasi Tanpa Tekanan Negatif'
                                                                when ru.kodesirs =30 then 'NICU Khusus Covid'
                                                                when ru.kodesirs =31 then 'PICU Khusus Covid'
                                                                when ru.kodesirs =32 then 'IGD Khusus Covid'
                                                                when ru.kodesirs =33 then 'VK (Ibu Melahirkan) Khusus Covid'  else 'Non Kelas' end  as namaruangan1,ru.namaruangan, ru.kodesirs, sb.statusbed, CASE WHEN sb.id IN (1) THEN 1 ELSE 0 END AS isi, 
                                                                CASE WHEN sb.id IN (2, 9, 6) THEN 1 ELSE 0 END AS kosong, dp.qdepartemen, 1 AS jumlah_ruang, ru.objectruanganfk
                                      FROM            tempattidur_m AS tt INNER JOIN
                                                                statusbed_m AS sb ON sb.id = tt.objectstatusbedfk INNER JOIN
                                                                kamar_m AS kmr ON kmr.id = tt.objectkamarfk INNER JOIN
                                                                ruangan_m AS ru ON ru.id = kmr.objectruanganfk INNER JOIN
                                                                kelas_m AS kls ON kls.id = kmr.objectkelasfk INNER JOIN
                                                                departemen_m AS dp ON ru.objectdepartemenfk = dp.id
                                      WHERE        (tt.statusenabled = 1) AND (kmr.statusenabled = 1) AND (kmr.norec= $noreckamar) and ru.objectruanganfk <> 19) AS x
            GROUP BY x.kodesiranap,x.kodesirs,namaruangan "));
            $methods ='POST';
       
            $tt = [];
          
            foreach ($q as $v){
                $arr = array(
                    "id_tt"=> (string)$nott ,
                    // "id_t_tt"=> (string)$v->kodesiranap ,
                    "ruang"=> $v->namaruangan,
                    "jumlah_ruang"=> $v->jumlah_ruang ,
                    "jumlah"=>  $v->jumlah ,
                    "terpakai"=>  $v->terpakai ,
                    "antrian"=>  "0",
                    "prepare"=>  "0",
                    "prepare_plan"=>  "0",
                    "covid"=>  0
                );
              ;
                $tt [] =   $arr;
                $dataJsonSend = json_encode ($arr);
                $url = "http://sirs.kemkes.go.id/fo/index.php/Fasyankes";
                $response = $this->sendBridgingCurl($headers , $dataJsonSend, $url, 'POST');
            
                // return $this->respond($response);

            }
           
            $methods ='POST';
       
            $tt = [];
          
            foreach ($q as $v){
                $arr = array(
                    "id_tt"=> (string)$v->id_tt ,
                    "id_t_tt"=> (string)$v->kodesiranap ,
                    "ruang"=> $v->namaruangan,
                    "jumlah_ruang"=> $v->jumlah_ruang ,
                    "jumlah"=>  $v->jumlah ,
                    "terpakai"=>  $v->terpakai ,
                    "antrian"=>  "0",
                    "prepare"=>  "0",
                    "prepare_plan"=>  "0",
                    "covid"=>  1
                );
              ;
                $tt [] =   $arr;
                $dataJsonSend = json_encode ($arr);
                $url = "http://sirs.kemkes.go.id/fo/index.php/Fasyankes";
                $response = $this->sendBridgingCurl($headers , $dataJsonSend, $url,$methods);
            
                // return $this->respond($response);

            }
          
           
            return $this->respond(  $response);
    }
	public function Fasyankes($method, Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers =  $this->getHeadersCovid($kdProfile);
        $dataJsonSend=null;
        $arr =[];
        
        if($method == 'post'){
            $q = collect(DB::select("SELECT       x.kodesiranap, x.kodesirs as id_tt,SUM(isi) AS terpakai, COUNT(tt_id) AS jumlah, SUM(jumlah_ruang) AS jumlah_ruang, namaruangan
            FROM            (SELECT DISTINCT 
            ru.kodesiranap ,tt.id AS tt_id, tt.nomorbed AS namabed, kmr.id AS kmr_id, kmr.namakamar, ru.id AS id_ruangan, 
                                                                case when ru.kodesirs =1 then 'VVIP/ Super VIP'
                                                                when ru.kodesirs =2 then 'VIP'
                                                                when ru.kodesirs =3 then 'Kelas I'
                                                                when ru.kodesirs =4 then 'Kelas II'
                                                                when ru.kodesirs =5 then 'Kelas III'
                                                                when ru.kodesirs =6 then 'ICU'
                                                                when ru.kodesirs =7 then 'HCU'
                                                                when ru.kodesirs =8 then 'ICCU/ICVCU'
                                                                when ru.kodesirs =9 then 'RICU'
                                                                when ru.kodesirs =10 then 'NICU'
                                                                when ru.kodesirs =11 then 'Picu'
                                                                when ru.kodesirs =12 then 'Isolasi'
                                                                when ru.kodesirs =14 then 'Perinatologi'
                                                                when ru.kodesirs =24 then 'ICU Tekanan Negatif dengan Ventilator'
                                                                when ru.kodesirs =25 then 'ICU Tekanan Negatif tanpa Ventilator'
                                                                when ru.kodesirs =26 then 'ICU Tanpa Tekanan Negatif Dengan Ventilator'
                                                                when ru.kodesirs =27 then 'ICU Tanpa Tekanan Negatif Tanpa Ventilator'
                                                                when ru.kodesirs =28 then 'Isolasi Tekanan Negatif'
                                                                when ru.kodesirs =29 then 'Isolasi Tanpa Tekanan Negatif'
                                                                when ru.kodesirs =30 then 'NICU Khusus Covid'
                                                                when ru.kodesirs =31 then 'PICU Khusus Covid'
                                                                when ru.kodesirs =32 then 'IGD Khusus Covid'
                                                                when ru.kodesirs =33 then 'VK (Ibu Melahirkan) Khusus Covid'  else 'Non Kelas' end  as namaruangan1,ru.namaruangan, ru.kodesirs, sb.statusbed, CASE WHEN sb.id IN (1) THEN 1 ELSE 0 END AS isi, 
                                                                CASE WHEN sb.id IN (2, 9, 6) THEN 1 ELSE 0 END AS kosong, dp.qdepartemen, 1 AS jumlah_ruang, ru.objectruanganfk
                                      FROM            tempattidur_m AS tt INNER JOIN
                                                                statusbed_m AS sb ON sb.id = tt.objectstatusbedfk INNER JOIN
                                                                kamar_m AS kmr ON kmr.id = tt.objectkamarfk INNER JOIN
                                                                ruangan_m AS ru ON ru.id = kmr.objectruanganfk INNER JOIN
                                                                kelas_m AS kls ON kls.id = kmr.objectkelasfk INNER JOIN
                                                                departemen_m AS dp ON ru.objectdepartemenfk = dp.id
                                      WHERE        (tt.statusenabled = 1) AND (kmr.statusenabled = 1) AND (ru.kodesirs IS NOT NULL) and ru.objectruanganfk <> 19) AS x
            GROUP BY x.kodesiranap,x.kodesirs,namaruangan "));
            $methods ='POST';
       
            $tt = [];
          
            foreach ($q as $v){
                $arr = array(
                    "id_tt"=> (string)$v->id_tt ,
                    "id_t_tt"=> (string)$v->kodesiranap ,
                    "ruang"=> $v->namaruangan,
                    "jumlah_ruang"=> $v->jumlah_ruang ,
                    "jumlah"=>  $v->jumlah ,
                    "terpakai"=>  $v->terpakai ,
                    "antrian"=>  "0",
                    "prepare"=>  "0",
                    "prepare_plan"=>  "0",
                    "covid"=>  0
                );
              ;
                $tt [] =   $arr;
                $dataJsonSend = json_encode ($arr);
                $url = "http://sirs.kemkes.go.id/fo/index.php/Fasyankes";
                $response = $this->sendBridgingCurl($headers , $dataJsonSend, $url,$methods);
            
                // return $this->respond($response);

            }
            $q = collect(DB::select("SELECT       x.kodesiranap, x.kodesirs as id_tt,SUM(isi) AS terpakai, COUNT(tt_id) AS jumlah, SUM(jumlah_ruang) AS jumlah_ruang, namaruangan
            FROM            (SELECT DISTINCT 
           ru.kodesiranap ,tt.id AS tt_id, tt.nomorbed AS namabed, kmr.id AS kmr_id, kmr.namakamar, ru.id AS id_ruangan, 
                                                                case when ru.kodesirs =1 then 'VVIP/ Super VIP'
                                                                when ru.kodesirs =2 then 'VIP'
                                                                when ru.kodesirs =3 then 'Kelas I'
                                                                when ru.kodesirs =4 then 'Kelas II'
                                                                when ru.kodesirs =5 then 'Kelas III'
                                                                when ru.kodesirs =6 then 'ICU'
                                                                when ru.kodesirs =7 then 'HCU'
                                                                when ru.kodesirs =8 then 'ICCU/ICVCU'
                                                                when ru.kodesirs =9 then 'RICU'
                                                                when ru.kodesirs =10 then 'NICU'
                                                                when ru.kodesirs =11 then 'Picu'
                                                                when ru.kodesirs =12 then 'Isolasi'
                                                                when ru.kodesirs =14 then 'Perinatologi'
                                                                when ru.kodesirs =24 then 'ICU Tekanan Negatif dengan Ventilator'
                                                                when ru.kodesirs =25 then 'ICU Tekanan Negatif tanpa Ventilator'
                                                                when ru.kodesirs =26 then 'ICU Tanpa Tekanan Negatif Dengan Ventilator'
                                                                when ru.kodesirs =27 then 'ICU Tanpa Tekanan Negatif Tanpa Ventilator'
                                                                when ru.kodesirs =28 then 'Isolasi Tekanan Negatif'
                                                                when ru.kodesirs =29 then 'Isolasi Tanpa Tekanan Negatif'
                                                                when ru.kodesirs =30 then 'NICU Khusus Covid'
                                                                when ru.kodesirs =31 then 'PICU Khusus Covid'
                                                                when ru.kodesirs =32 then 'IGD Khusus Covid'
                                                                when ru.kodesirs =33 then 'VK (Ibu Melahirkan) Khusus Covid'  else 'Non Kelas' end  as namaruangan1,ru.namaruangan, ru.kodesirs, sb.statusbed, CASE WHEN sb.id IN (1) THEN 1 ELSE 0 END AS isi, 
                                                                CASE WHEN sb.id IN (2, 9, 6) THEN 1 ELSE 0 END AS kosong, dp.qdepartemen, 1 AS jumlah_ruang, ru.objectruanganfk
                                      FROM            tempattidur_m AS tt INNER JOIN
                                                                statusbed_m AS sb ON sb.id = tt.objectstatusbedfk INNER JOIN
                                                                kamar_m AS kmr ON kmr.id = tt.objectkamarfk INNER JOIN
                                                                ruangan_m AS ru ON ru.id = kmr.objectruanganfk INNER JOIN
                                                                kelas_m AS kls ON kls.id = kmr.objectkelasfk INNER JOIN
                                                                departemen_m AS dp ON ru.objectdepartemenfk = dp.id
                                      WHERE        (tt.statusenabled = 1) AND (kmr.statusenabled = 1) AND (ru.kodesirs IS NOT NULL) and ru.objectruanganfk = 19) AS x
            GROUP BY x.kodesiranap,x.kodesirs,namaruangan "));
            $methods ='POST';
       
            $tt = [];
          
            foreach ($q as $v){
                $arr = array(
                    "id_tt"=> (string)$v->id_tt ,
                    "id_t_tt"=> (string)$v->kodesiranap ,
                    "ruang"=> $v->namaruangan,
                    "jumlah_ruang"=> $v->jumlah_ruang ,
                    "jumlah"=>  $v->jumlah ,
                    "terpakai"=>  $v->terpakai ,
                    "antrian"=>  "0",
                    "prepare"=>  "0",
                    "prepare_plan"=>  "0",
                    "covid"=>  1
                );
              ;
                $tt [] =   $arr;
                $dataJsonSend = json_encode ($arr);
                $url = "http://sirs.kemkes.go.id/fo/index.php/Fasyankes";
                $response = $this->sendBridgingCurl($headers , $dataJsonSend, $url,$methods);
            
                // return $this->respond($response);

            }
          
           
            return $this->respond(  $response);
            // return $this->respond(  $response1);
        } else if($method == 'get'){
            $methods ='GET';
            $dataJsonSend = null;
            $url = "http://sirs.kemkes.go.id/fo/index.php/Fasyankes";
            $response = $this->sendBridgingCurl($headers , $dataJsonSend, $url,$methods);
            return $this->respond($response);
            //  $tt [] ;
            
        
            // foreach ($response->fasyankes as $item) {
            //     $r = collect(DB::select("select distinct idttsirs  from tempattidur_m where idttsirsd =  $item->id_t_tt"));
            //     $arr = array(
            //         "id_tt"=>  $item->id_tt,
            //         "tt"=>  $item->tt,
            //         "ruang"=>  $item->ruang,
            //         "kode_siranap"=>  $item->kode_siranap,
            //         "jumlah_ruang"=>  $item->jumlah_ruang,
            //         "jumlah"=>  $item->jumlah,
            //         "terpakai"=>  $item->terpakai,
            //         "antrian"=>  $item->antrian,
            //         "prepare"=>  $item->prepare,
            //         "prepare_plan"=>  $item->prepare_plan,
            //         "kosong"=>  $item->kosong,
            //         "covid"=>  $item->covid,
            //         "id_t_tt"=>  $item->id_t_tt,
            //         "tglupdate"=>  $item->tglupdate
            //     );
            //    $tt [] =   $arr;
            
            // }
            //  return($tt);
            //     die();
        } else if($method == 'delete'){
            $methods ='DELETE';

            $arr = array(
                "id_t_tt"=> $request['id_t_tt'],
            );
            $dataJsonSend = json_encode ($arr);
        }else if($method == 'put'){
            // return('kadie');
            // die;
            $methods ='PUT';
            $q = collect(DB::select("select x.kodesiranap, x.tt_id as id_tt,SUM(isi) AS terpakai, COUNT(tt_id) AS jumlah, SUM(jumlah_ruang) AS jumlah_ruang,namaruangan
                                    FROM (SELECT DISTINCT
                                    mps.kodett as tt_id ,tt.idttsirs AS kodesiranap , tt.nomorbed AS namabed, kmr.id AS kmr_id, kmr.namakamar, ru.id AS id_ruangan,
                                    CASE WHEN mps.kodett =28 then'Isolasi Tekanan Negatif' else  ru.namaruangan end as namaruangan, mps.kodesirs, sb.statusbed, CASE WHEN sb.id IN (1) THEN 1 ELSE 0 END AS isi,
                                    CASE WHEN sb.id IN (2, 9, 6) THEN 1 ELSE 0 END AS kosong, dp.qdepartemen, 1 AS jumlah_ruang, ru.objectruanganfk
                                    FROM tempattidur_m AS tt INNER JOIN
                                    statusbed_m AS sb ON sb.id = tt.objectstatusbedfk INNER JOIN
                                    kamar_m AS kmr ON kmr.id = tt.objectkamarfk INNER JOIN
                                    mappingsirs_s as mps on mps.kodesirs = tt.idttsirs inner join
                                    ruangan_m AS ru ON ru.id = kmr.objectruanganfk INNER JOIN
                                    kelas_m AS kls ON kls.id = kmr.objectkelasfk INNER JOIN
                                    departemen_m AS dp ON ru.objectdepartemenfk = dp.id
                                    WHERE        (tt.statusenabled = 1) AND (kmr.statusenabled = 1) AND (tt.idttsirs IS NOT NULL) and (ru.objectruanganfk<>19)) AS x
            GROUP BY x.kodesiranap,x.tt_id,namaruangan "));

            // $methods ='PUT';
            foreach ($q as $v){
                $arr = array(
                    "id_tt"=> (string)$v->id_tt ,
                    "id_t_tt"=> (string)$v->kodesiranap ,
                    "ruang"=> $v->namaruangan,
                    "jumlah_ruang"=> $v->jumlah_ruang ,
                    "jumlah"=>  $v->jumlah ,
                    "terpakai"=>  $v->terpakai ,
                    "antrian"=>  "0",
                    "prepare"=>  "0",
                    "prepare_plan"=>  "0",
                    "covid"=>  0
                );
                $tt [] =   $arr;
                $dataJsonSend = json_encode ($arr);
               
                $url = "http://sirs.kemkes.go.id/fo/index.php/Fasyankes";
               
                $response = $this->sendBridgingCurl($headers , $dataJsonSend, $url,$methods);
            }

            $q = collect(DB::select("select x.kodesiranap, x.tt_id as id_tt,SUM(isi) AS terpakai, COUNT(tt_id) AS jumlah, SUM(jumlah_ruang) AS jumlah_ruang, namaruangan
                FROM (SELECT DISTINCT
                mps.kodett as tt_id ,tt.idttsirs AS kodesiranap , tt.nomorbed AS namabed, kmr.id AS kmr_id, kmr.namakamar, ru.id AS id_ruangan,
                CASE WHEN mps.kodett =28 then'Isolasi Tekanan Negatif' else  ru.namaruangan end as namaruangan, mps.kodesirs, sb.statusbed, CASE WHEN sb.id IN (1) THEN 1 ELSE 0 END AS isi,
                CASE WHEN sb.id IN (2, 9, 6) THEN 1 ELSE 0 END AS kosong, dp.qdepartemen, 1 AS jumlah_ruang, ru.objectruanganfk
                FROM tempattidur_m AS tt INNER JOIN
                statusbed_m AS sb ON sb.id = tt.objectstatusbedfk INNER JOIN
                kamar_m AS kmr ON kmr.id = tt.objectkamarfk INNER JOIN
                mappingsirs_s as mps on mps.kodesirs = tt.idttsirs inner join
                ruangan_m AS ru ON ru.id = kmr.objectruanganfk INNER JOIN
                kelas_m AS kls ON kls.id = kmr.objectkelasfk INNER JOIN
                departemen_m AS dp ON ru.objectdepartemenfk = dp.id
                                      WHERE        (tt.statusenabled = 1) AND (kmr.statusenabled = 1) AND (tt.idttsirs IS NOT NULL) and (ru.objectruanganfk=19)) AS x
            GROUP BY x.kodesiranap,x.tt_id,namaruangan "));

            // $methods ='PUT';
            foreach ($q as $v){
    
                    $arr = array(
                        "id_tt"=> (string)$v->id_tt ,
                        "id_t_tt"=> (string)$v->kodesiranap ,
                        "ruang"=> $v->namaruangan,
                        "jumlah_ruang"=> $v->jumlah_ruang ,
                        "jumlah"=>  $v->jumlah ,
                        "terpakai"=>  $v->terpakai ,
                        "antrian"=>  "0",
                        "prepare"=>  "0",
                        "prepare_plan"=>  "0",
                        "covid"=>  1
                    );
               
                
                $tt [] =   $arr;
                $dataJsonSend = json_encode ($arr);
               
                $url = "http://sirs.kemkes.go.id/fo/index.php/Fasyankes";
                $response = $this->sendBridgingCurl($headers , $dataJsonSend, $url,$methods);
            }
            // return('kadie');
            // die;
            // return $this->respond(  $response);
        }
        $url = "http://sirs.kemkes.go.id/fo/index.php/Fasyankes";
        
        $response = $this->sendBridgingCurl($headers , $dataJsonSend, $url,$methods);
        return $this->respond($response);
        //  $tt [] ;
       
    }
    public function Fasyankestt(Request $request){
        $r = collect(DB::select("select distinct idttsirs  from tempattidur_m where idttsirs is not null"));
        return $this->respond($r);
    }
    public function getReffSDM(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers =  $this->getHeadersCovid($kdProfile);
        $dataJsonSend = null;
        $methods ='GET';
        $url = "http://sirs.kemkes.go.id/fo/index.php/Referensi/kebutuhan_sdm";
        $response = $this->sendBridgingCurl($headers , $dataJsonSend, $url,$methods);
        return $this->respond($response);
    }
    public function FasyankesSDM($method,Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers =  $this->getHeadersCovid($kdProfile);
        if($method == 'post'){
            $q = collect(DB::select("
               select count(x.id) as jml,x.kdjabatan from (
                select pg.id,pg.namalengkap,jb.namajabatan,jb.kdjabatan
                from pegawai_m as pg 
                join jabatan_m as jb on jb.id=pg.objectjabatanfungsionalfk
                where pg.statusenabled =true 
                and pg.kdprofile=$kdProfile
                ) as x
                group  by x.kdjabatan"));
            $methods ='POST';
            foreach ($q as $v){
                $arr = array(
                    "id_kebutuhan"=>$v->kdjabatan,
                    "jumlah_eksisting"=> $v->jml,
                    "jumlah"=>  $v->jml,
                    "jumlah_diterima"=> "0"
                );
                $dataJsonSend = json_encode ($arr);
                $url = "http://sirs.kemkes.go.id/fo/index.php/Fasyankes/sdm";
                $response = $this->sendBridgingCurl($headers , $dataJsonSend, $url,$methods);
                return $this->respond($response);
            }

        } else if($method == 'get'){
            $methods ='GET';
            $dataJsonSend = null;
        } else if($method == 'delete'){
            $methods ='DELETE';
            $arr = array(
                "id_kebutuhan"=> $request['id_kebutuhan'],
            );
            $dataJsonSend = json_encode ($arr);
        }else if($method == 'put'){
            $q = collect(DB::select("
               select count(x.id) as jml,x.kdjabatan from (
                select pg.id,pg.namalengkap,jb.namajabatan,jb.kdjabatan
                from pegawai_m as pg 
                join jabatan_m as jb on jb.id=pg.objectjabatanfungsionalfk
                where pg.statusenabled =true 
                and pg.kdprofile=$kdProfile
                ) as x
                group  by x.kdjabatan"));
            $methods ='PUT';
            foreach ($q as $v){
                $arr = array(
                    "id_kebutuhan"=>$q->kdjabatan,
                    "jumlah_eksisting"=> $q->jml,
                    "jumlah"=>  $q->jml,
                    "jumlah_diterima"=> "0"
                );
                $dataJsonSend = json_encode ($arr);
                $url = "http://sirs.kemkes.go.id/fo/index.php/Fasyankes/sdm";
                $response = $this->sendBridgingCurl($headers , $dataJsonSend, $url,$methods);
                return $this->respond($response);
            }
        }
        $url = "http://sirs.kemkes.go.id/fo/index.php/Fasyankes/sdm";
        $response = $this->sendBridgingCurl($headers , $dataJsonSend, $url,$methods);
        return $this->respond($response);
    }

    public function getReffAPD(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers =  $this->getHeadersCovid($kdProfile);
        $dataJsonSend = null;
        $methods ='GET';
        $url = "http://sirs.kemkes.go.id/fo/index.php/Referensi/kebutuhan_apd";
        $response = $this->sendBridgingCurl($headers , $dataJsonSend, $url,$methods);
        return $this->respond($response);
    }
    public function FasyankesAPD($method,Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $headers =  $this->getHeadersCovid($kdProfile);
        if($method == 'post'){
            $methods ='POST';
            $arr = array(
                "id_kebutuhan"=> "16",
                "jumlah_eksisting"=> "154",
                "jumlah"=> "3",
                "jumlah_diterima"=> "1"
            );
            $dataJsonSend = json_encode ($arr);
        } else if($method == 'get'){
            $methods ='GET';
            $dataJsonSend = null;
        } else if($method == 'delete'){
            $methods ='DELETE';
            $arr = array(
                "id_kebutuhan"=> "24",
            );
            $dataJsonSend = json_encode ($arr);
        }else if($method == 'put'){
            $methods ='PUT';
            $arr = array(
                "id_kebutuhan"=> "16",
                "jumlah_eksisting"=> "154",
                "jumlah"=> "3",
                "jumlah_diterima"=> "1"
            );
            $dataJsonSend = json_encode ($arr);
        }
        $url = "http://sirs.kemkes.go.id/fo/index.php/Fasyankes/apd";
        $response = $this->sendBridgingCurl($headers , $dataJsonSend, $url,$methods);
        return $this->respond($response);

    }
    public function getJumlahBed(Request $request)
    {
        $data4 =  DB::select(DB::raw("SELECT        COUNT(tempattidur_m.id) AS jumlah, ruangan_m.namaruangan,tempattidur_m.idttsirs
                FROM            tempattidur_m INNER JOIN
                                        kamar_m ON tempattidur_m.objectkamarfk = kamar_m.id INNER JOIN
                                        ruangan_m ON kamar_m.objectruanganfk = ruangan_m.id
                WHERE     tempattidur_m.statusenabled=1 and kamar_m.statusenabled=1 and ruangan_m.statusenabled=1 
                GROUP BY ruangan_m.namaruangan,tempattidur_m.idttsirs
                order by tempattidur_m.idttsirs "));

        $result = array(
            'data' => $data4,
            'message' => 'a',
        );
        return $this->respond($result);
    }
    public function Fasyankesbedrs(Request $request)
    {
        $query = $request['query'];
        $kode='';
        if (isset($request['kode']) && $request['kode'] != '') {
           $kode = $request['kode'];
        }
        if($query == 'all'){
            $data4 =  DB::select(DB::raw("SELECT     tempattidur_m.norec, ruangan_m.namaruangan, kamar_m.namakamar,tempattidur_m.idttsirs,tempattidur_m.namaexternal, kelas_m.namakelas,kamar_m.qtybed
            FROM            kamar_m INNER JOIN
                                    tempattidur_m ON kamar_m.id = tempattidur_m.objectkamarfk INNER JOIN
                                    ruangan_m ON kamar_m.objectruanganfk = ruangan_m.id INNER JOIN
                                    kelas_m ON kamar_m.objectkelasfk = kelas_m.id
            WHERE        (tempattidur_m.statusenabled = 1) and tempattidur_m.idttsirs like '%$kode%'"));
        }else{
            $del = DB::table('mappingsirs_s')->delete();
            $data = $request['datasirs'];
            // return($request['y']);
            // die();
            foreach ($data  as $item) {
                $data1 = new Mappingsirs();
                $data1->norec = $data1->generateNewId();
                $data1->kodesirs = $item['kodesirs'];
                $data1->kodett = $item['kodett'];
                $data1->jumlah = $item['jumlah'];
                $data1->save();
            }
            
            
            
            $notin = $request['notin'];
            $data4 =  DB::select(DB::raw("SELECT     tempattidur_m.norec, ruangan_m.namaruangan, kamar_m.namakamar,tempattidur_m.idttsirs,tempattidur_m.namaexternal, kelas_m.namakelas,kamar_m.qtybed
                            FROM            kamar_m INNER JOIN
                                                    tempattidur_m ON kamar_m.id = tempattidur_m.objectkamarfk INNER JOIN
                                                    ruangan_m ON kamar_m.objectruanganfk = ruangan_m.id INNER JOIN
                                                    kelas_m ON kamar_m.objectkelasfk = kelas_m.id
                            WHERE        (tempattidur_m.statusenabled = 1) and idttsirs not in ( $notin)
                                        --or idttsirs is null
                            union all
                            SELECT     tempattidur_m.norec, ruangan_m.namaruangan, kamar_m.namakamar,tempattidur_m.idttsirs,tempattidur_m.namaexternal, kelas_m.namakelas,kamar_m.qtybed
                            FROM            kamar_m INNER JOIN
                                                    tempattidur_m ON kamar_m.id = tempattidur_m.objectkamarfk INNER JOIN
                                                    ruangan_m ON kamar_m.objectruanganfk = ruangan_m.id INNER JOIN
                                                    kelas_m ON kamar_m.objectkelasfk = kelas_m.id
                            WHERE        (tempattidur_m.statusenabled = 1) and idttsirs is null "));            
        }

        $result = array(
            'data' => $data4,
            'message' => 'a',
        );
        return $this->respond($result);
    }
    public function updatekodesirs(Request $request)
    {
        try {
            $update = DB::table('tempattidur_m')
            ->where('norec', $request['norecbed'])
            ->update([
                'idttsirs' =>  $request['kodesirs']
            ]);

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
    public function getJumlahBed2(Request $request)
    {
        $data4 =  DB::select(DB::raw(
            "select DISTINCT ruangan_m.namaruangan, kamar_m.id, kamar_m.namakamar, kamar_m.kodesirs, kamar_m.qtybed, Sirs_m.namasirs, tempattidur_m.idttsirs,kamar_m.norec as noreckamar
                         FROM            tempattidur_m INNER JOIN
                         kamar_m ON tempattidur_m.objectkamarfk = kamar_m.id INNER JOIN
                         ruangan_m ON kamar_m.objectruanganfk = ruangan_m.id LEFT OUTER JOIN
                         Sirs_m ON kamar_m.kodesirs = Sirs_m.id
                        WHERE        (tempattidur_m.statusenabled = 1) AND (kamar_m.statusenabled = 1) AND (ruangan_m.statusenabled = 1) AND (tempattidur_m.idttsirs IS NULL)  OR
                         (tempattidur_m.statusenabled = 1)  AND (kamar_m.statusenabled = 1) AND (ruangan_m.statusenabled = 1) AND (kamar_m.kodesirs IS NULL)
                        ORDER BY tempattidur_m.idttsirs "
                ));

        $result = array(
            'data' => $data4,
            'message' => 'a',
        );
        return $this->respond($result);
    }
    public function getBedMonitorRS(Request $request)
    {
        // return('kadie');
        // die;

        $kdProfile = $this->getDataKdProfile($request);
        if($kdProfile == 18){

        }
        $user = '3172072';//$this->settingDataFixed('userIdSisrute',$kdProfile);
        $password ='S!rs2020!!';// $this->settingDataFixed('userIdSisrute',$kdProfile);
        $data = collect(DB::select("
             select count(tt_id) as total ,sum(x.terpakaimale) as terpakaimale,
                    sum(x.terpakaifemale) as terpakaifemale,
                    sum(x.kosong) as kosong
                    from (
                    SELECT 
                    DISTINCT tt. ID AS tt_id,tt.nomorbed AS namabed,
                    kmr. ID AS kmr_id,kmr.namakamar,ru. ID AS id_ruangan,pd.jkid,
                    case when pd.jkid = 1 then 1 else 0 end as terpakaimale,
                    case when pd.jkid = 2 then 1 else 0 end as terpakaifemale,
                    case when pd.jkid is null then 1 else 0 end as kosong
                    FROM
                    tempattidur_m AS tt
                    INNER JOIN statusbed_m AS sb ON sb. ID = tt.objectstatusbedfk
                    INNER JOIN kamar_m AS kmr ON kmr. ID = tt.objectkamarfk
                    INNER JOIN ruangan_m AS ru ON ru. ID = kmr.objectruanganfk
                    left join (select * from (
                            select   row_number() over (partition by pd.noregistrasi 
                            order by apd.tglmasuk desc) as rownum ,ps.nocm,
                            ps.objectjeniskelaminfk AS jkid,ps.tgllahir,ps.namapasien,
                            pd.tglregistrasi,
                            EXTRACT (YEAR FROM
                            age(CURRENT_DATE, ps.tgllahir)
                            ) :: INT AS umur,   DATE_PART(
                            'day',
                            now() - pd.tglregistrasi
                            ) AS lamarawat,pd.noregistrasi,
                            ps.nohp,apd.objectruanganfk,apd.objectkamarfk,apd.nobed
                            from pasiendaftar_t as pd 
                            join antrianpasiendiperiksa_t as apd on pd.norec =apd.noregistrasifk
                            and apd.objectruanganfk=pd.objectruanganlastfk
                            join pasien_m as ps on ps.id=pd.nocmfk
                            where pd.tglpulang is null 
                            and pd.statusenabled=TRUE
                            and pd.kdprofile=$kdProfile
                            )as x where x.rownum=1
                    ) as pd on pd.objectruanganfk=ru.id 
                    and pd.objectkamarfk = kmr.id
                    and pd.nobed=tt.id
                    WHERE
                    tt.kdprofile =$kdProfile
                    AND tt.statusenabled = TRUE
                    AND kmr.statusenabled = TRUE
                    ) as x
           
            "))->first();
        $kosongmale = 0;
        $kosongfemale = 0;
        $totakhir = $data->kosong /2;
        if($this->is_decimal($totakhir)) {
            $kosongmale = $totakhir;
            $kosongfemale = $totakhir;
            $whole = floor($totakhir);      // 1
            $fraction = $totakhir - $whole; // .25
            $kosongmale = $totakhir - $fraction;
            $kosongfemale = ($whole + ($fraction * 2)) ;
        }else{
            $kosongmale = $totakhir;
            $kosongfemale = $totakhir;
        }
        $arr [] = array(
            'kode_ruang' => '0059',
            'tipe_pasien' => '0011',
            'terpakaiMale' => $data->terpakaimale,
            'terpakaiFemale' => $data->terpakaifemale,
            'kosongMale' => $kosongmale,
            'kosongFemale' => $kosongfemale,
            'waiting' => 0,
            'tgl_update' => date('Y-m-d H:i:s'),
        );
        // $passEn =  md5($password);
        // date_default_timezone_set('UTC');
        // $tStamp = strval(time()-strtotime('1970-01-01 00:00:00'));
        // $curl = curl_init();

        // $dataJsonSend = json_encode ($arr);
        // return $this->respond(   $arr);
        curl_setopt_array($curl, array(
//                CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL=>  "http://sirs.yankes.kemkes.go.id/sirsservice/ranap",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 60,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => $dataJsonSend,
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json;",
                "X-rs-id: $user",
                "X-pass: $passEn" ,
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result= "cURL Error #:" . $err;
        } else {
            $result =  json_decode($response);
        }
        return $this->respond($result );

    }
}