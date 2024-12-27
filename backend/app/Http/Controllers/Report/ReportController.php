<?php
/**
 * Created by PhpStorm.
 * User: Egie Ramdan
 */

namespace App\Http\Controllers\Report;
use App\Http\Controllers\ApiController;
use App\Traits\PelayananPasienTrait;
use App\Traits\Valet;
use App\Master\SettingDataFixed;
use App\Transaksi\PasienDaftar;
use Illuminate\Http\Request;
use App\Master\KelompokTransaksi;
use Carbon\Carbon;
use Endroid\QrCode\Color\Color;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Label\Label;
use Endroid\QrCode\Logo\Logo;
use Endroid\QrCode\RoundBlockSizeMode;
use Endroid\QrCode\Writer\PngWriter;
use Endroid\QrCode\Writer\ValidationException;

use Illuminate\Support\Facades\DB;


class ReportController extends ApiController
{
    
    use Valet,PelayananPasienTrait;
    public function __construct()
    {
        parent::__construct($skip_authentication = true);
    }
	public function cetakCuti (Request $r){
        $data =\DB::table('planningpegawaistatus_t as pps')
            ->leftJoin('pegawai_m as pg','pg.id','=','pps.objectpegawaifk')
            ->leftJoin('sdm_jeniscuti_m as jc','jc.id','=','pps.objectstatuspegawaiplanfk')
            ->leftJoin('jabatan_m as jb','jb.id','=','pg.objectjabatanstrukturalfk')
            ->leftJoin('unitkerja_m as ukp','ukp.id','=','pg.objectunitkerjafk')
            ->leftJoin('pangkat_m as pan','pan.id','=','pg.objectpangkatfk')
            ->leftJoin('golonganpegawai_m as gol','gol.id','=','pan.objectgolonganpegawaifk')
            ->select( 'pps.norec','pps.noplanning','pps.tglpengajuan','pps.objectpegawaifk','pps.objectstatuspegawaiplanfk',
                'pps.deskripsistatuspegawaiplan as desk','pps.keterangan','pg.namalengkap','jc.name as statuspermohonan',
                'jb.namajabatan','ukp.unitkerja','pps.approvalstatus','pg.nip','pan.namapangkat','gol.golonganpegawai')
            ->where('pps.statusenabled',true)
            ->where('pps.norec',$r['norec'])
            ->first();
        $norec= $data->norec;
        $details = DB::select(DB::raw("select * from listtanggalcuti_t where objectplanningpegawaistatusfk='$norec'"));
        $tglVerif = [];
        foreach ($details as $itmde){
            if( $itmde-> approvalstatus == 4){
                $tglVerif [] = array(
                    'norec' => $itmde->norec,
                    'tgl' => $itmde->tgl,
                    'approvalstatus' => $itmde->approvalstatus,
                    'objectplanningpegawaistatusfk' => $itmde->objectplanningpegawaistatusfk
                );
            }
        }
        $data->listtanggal = $details;
        $data->listtanggalapprove= $tglVerif;

        $url = $r->fullUrl();
//           dd($url);
        $config['jabatan'] ='Direktur Rumah Sakit Jiwa Daerah Surakarta';
        $config['pangkat'] ='Pembina utama muda';
        $config['nip'] = '196010051986101001';
        $config['direktur'] ='dr. ENDRO SUPRAYITNO, Sp.Kj, M.Si';
        $config['dibuatdi'] ='Semarang';
		return view('report.cuti',compact('data','url','config'));
	}
    public function cetakEkspertise(Request $r) {
        $kdProfile = (int)$r['kdprofile'];
        $raw = collect(DB::select("
            SELECT       so.tanggalbacaradiologi, so.nofoto, ps.nocm, ps.namapasien, ps.tgllahir,	to_char(ps.tgllahir, 'DD TMMonth YYYY') AS tgllahir2,(kp.kelompokpasien || ' / ' || case when jks.namaexternal is null then '-' else 'Jaminan Khusus   : ' || jks.namaexternal end ) as  kelompokpasien,
            ru.namaruangan, so.tanggal as tanggalso,pp.tglpelayanan as tanggal, jk.jeniskelamin, CASE WHEN alm.alamatlengkap IS NULL 
                         THEN '-' ELSE (alm.alamatlengkap || ' ' || ds.namadesakelurahan || ' ' || kc.namakecamatan || ' ' || kk.namakotakabupaten || ' ' || pro.namapropinsi) END AS alamatlengkap, pg.namalengkap AS perujuk, 
                         pg2.namalengkap AS dokterrad, pr.namaproduk, so.keterangan, pd.noregistrasi, pg2.nosip, pg2.id AS pgid, pemakaianasuransi_t.nokepesertaan, pemakaianasuransi_t.nosep, so.tanggalcetak, pegawai_m.namalengkap, 
                         ruangan_m.namaruangan AS ruanganasal, pg2.id as iddokterrad
            FROM ruangan_m RIGHT OUTER JOIN
             pegawai_m RIGHT OUTER JOIN
             hasilradiologi_t AS so INNER JOIN
             pasiendaftar_t AS pd ON pd.norec = so.noregristrasifk INNER JOIN
             pasien_m AS ps ON ps.id = pd.nocmfk INNER JOIN
             kelompokpasien_m AS kp ON kp.id = pd.objectkelompokpasienlastfk INNER JOIN
             ruangan_m AS ru ON ru.id = pd.objectruanganlastfk INNER JOIN
             pelayananpasien_t AS pp ON pp.norec = so.pelayananpasienfk INNER JOIN
             produk_m AS pr ON pr.id = pp.produkfk ON pegawai_m.id = so.dokterperujuk ON ruangan_m.id = so.ruanganperujukfk LEFT OUTER JOIN
             jeniskelamin_m AS jk ON ps.objectjeniskelaminfk = jk.id LEFT OUTER JOIN
             pegawai_m AS pg ON pd.objectpegawaifk = pg.id LEFT OUTER JOIN
             pegawai_m AS pg2 ON pg2.id = so.pegawaifk AND so.statusenabled = 'y' LEFT OUTER JOIN
             pemakaianasuransi_t ON pd.norec = pemakaianasuransi_t.noregistrasifk LEFT OUTER JOIN
             kelompokpasien_m AS kps ON kps.id = pd.objectkelompokpasienlastfk LEFT OUTER JOIN
             alamat_m AS alm ON alm.nocmfk = ps.id LEFT OUTER JOIN
             desakelurahan_m AS ds ON ds.id = alm.objectdesakelurahanfk LEFT OUTER JOIN
             kotakabupaten_m AS kk ON kk.id = alm.objectkotakabupatenfk LEFT OUTER JOIN
             kecamatan_m AS kc ON kc.id = alm.objectkecamatanfk LEFT OUTER JOIN
             propinsi_m AS pro ON pro.id = alm.objectpropinsifk LEFT OUTER JOIN jaminankhusus_m as jks on pd.objectjaminankhusus = jks.id
            WHERE
                so.norec = '$r[norec]'
     
            AND so.statusenabled = 'y'
        "))->first();
        if(!empty($raw)){
            $raw->umur = $this->getAge($raw->tgllahir ,date('Y-m-d')) .' / '. $raw->tgllahir2;
        }else{
            echo 'Data Tidak ada ';
            return;
        }
// return ($raw);
        $raw2 = collect(DB::select("
            SELECT cetakanke from cetakanke
            WHERE  norec= '$r[norec]'
        "))->first();
        if(empty($raw2)){
             $inserthistory = DB::insert("insert into  cetakanke values('".$r['norec'] ."',1,'hasilradiologi_t') ");
                  $raw2 = collect(DB::select("
                SELECT cetakanke from cetakanke
                WHERE  norec= '$r[norec]'
            "))->first();
        }else{
            foreach ($raw2 as $key) {
               
                $cetakanke = $key + 1;
            }
             $inserthistory = DB::update("update cetakanke set  cetakanke = '".$cetakanke."' where norec = '".$r['norec'] ."' ");
            // return;
        }
        // return $raw->noregistrasi;
        $qrCodePemeriksa = new QrCode("https://rsbcianjur.com/service/medifirst2000/report/cetak-ttd-new?idPegawai=" . $raw->iddokterrad . "&pesan=" . "EXPERTISE RADIOLOGI" . "&noregistrasi=" . $raw->noregistrasi);
        echo "</br>";
        header('Contert-Type: application/' . $qrCodePemeriksa->getContentType());
        $qrCodePemeriksa2 = $qrCodePemeriksa->writeDataUri();




        $pageWidth = 950;
        $now =  $this->getDateTime();
        // return response()->json($raw);
        return view('report.rad.expertise',
            compact('raw', 'pageWidth','r','now','raw2','qrCodePemeriksa2'));

    }
    public function cetakTtdFleksibel(Request $r) {
        //    $kdProfile = (int)$r['kdprofile'];
        $message = '';
        $where = '';
        $where2 = '';
        if (isset($r['idPegawai']) && $r['idPegawai'] != null && $r['idPegawai'] != "") {
            $where = "where pg.id = ". $r['idPegawai'];
            $where2= "and pegawaifk =". $r['idPegawai'];
        }
        if (isset($r['namaPegawai']) && $r['namaPegawai'] != null && $r['namaPegawai'] != "") {
            $where = "where pg.namalengkap = " ."'".$r['namaPegawai']."'";
        }
        if (isset($r['pesan']) && $r['pesan'] != null && $r['pesan'] != "") {
            $message = $r['pesan'];
        }
           $raw = collect(DB::select("
           select case when kp.kategorypegawai = 'POLRI' THEN pg.nrp when kp.kategorypegawai = 'PNS' THEN pg.nippns else '-' end as nip,namalengkap, jp.jenispegawai, ms.nosip, jk.jeniskelamin, pg.tgllahir, ked.name as statuspegawai,convert(varchar, getdate(), 103) as tglcetak,ttp.tandatangan,case when pt.namapangkat is null then '-' else pt.namapangkat end as namapangkat 
           from pegawai_m as pg left join 
           jenispegawai_m as jp on jp.id = pg.objectjenispegawaifk left join
           jeniskelamin_m as jk on jk.id = pg.objectjeniskelaminfk left join
           sdm_kedudukan_m as ked on ked.id = pg.kedudukanfk left join
           tandatanganppa_t as ttp on ttp.objectpegawaifk = pg.id left join
           pangkat_m as pt on pt.id = pg.objectpangkatfk 
           left join kategorypegawai_m as kp on kp.id = pg.kategorypegawai
             LEFT JOIN (
                 SELECT TOP 1 pegawaifk, nosip
                 FROM masaberlakusipstr_t
                 WHERE statusenabled = 1 $where2
                 ORDER BY berakhirsip DESC
             ) AS ms ON ms.pegawaifk = pg.id 
           $where
           "))->first();
           if(!empty($raw)){
               $raw->umur = $this->getAge($raw->tgllahir ,date('Y-m-d'));
           }else{
               echo 'Data Tidak ada ';
               return;
           }
           $tglpulang = '';
           $pasien = DB::select(DB::raw("
           select tglpulang from pasiendaftar_t where noregistrasi = '$r[noregistrasi]'
           "));
           $tglpulang = $pasien[0]->tglpulang;
        //    pd.noregistrasi = '$r[reg]'
     
          
     
     
           $pageWidth = 950;
           $now =  $this->getDateTime();
     
           return view('report.pdf.ttdfleksibel',
               compact('raw', 'pageWidth','r','now', 'message', 'tglpulang'));
     
       }
     public function cetakLab(Request $r) {
        $kdProfile = (int)$r['kdprofile'];
        $raw = collect(DB::select("
           select ps.nocm, ps.namapasien, ps.tgllahir, kp.kelompokpasien, ru.namaruangan, jk.jeniskelamin, CASE WHEN alm.alamatlengkap IS NULL 
                         THEN '-' ELSE (alm.alamatlengkap + ' ' + ds.namadesakelurahan + ' ' + kc.namakecamatan + ' ' + kk.namakotakabupaten + ' ' + pro.namapropinsi) END AS alamatlengkap, pd.noregistrasi, pemakaianasuransi_t.nokepesertaan, 
                         pemakaianasuransi_t.nosep
FROM            jeniskelamin_m AS jk RIGHT OUTER JOIN
                         pasiendaftar_t AS pd INNER JOIN
                         pasien_m AS ps ON ps.id = pd.nocmfk INNER JOIN
                         kelompokpasien_m AS kp ON kp.id = pd.objectkelompokpasienlastfk INNER JOIN
                         ruangan_m AS ru ON ru.id = pd.objectruanganlastfk ON jk.id = ps.objectjeniskelaminfk LEFT OUTER JOIN
                         pemakaianasuransi_t ON pd.norec = pemakaianasuransi_t.noregistrasifk LEFT OUTER JOIN
                         kelompokpasien_m AS kps ON kps.id = pd.objectkelompokpasienlastfk LEFT OUTER JOIN
                         alamat_m AS alm ON alm.nocmfk = ps.id LEFT OUTER JOIN
                         desakelurahan_m AS ds ON ds.id = alm.objectdesakelurahanfk LEFT OUTER JOIN
                         kotakabupaten_m AS kk ON kk.id = alm.objectkotakabupatenfk LEFT OUTER JOIN
                         kecamatan_m AS kc ON kc.id = alm.objectkecamatanfk LEFT OUTER JOIN
                         propinsi_m AS pro ON pro.id = alm.objectpropinsifk
            WHERE
                pd.noregistrasi = '$r[reg]'
        "))->first();
        if(!empty($raw)){
            $raw->umur = $this->getAge($raw->tgllahir ,date('Y-m-d'));
        }else{
            echo 'Data Tidak ada ';
            return;
        }

       


        $pageWidth = 950;
        $now =  $this->getDateTime();

        return view('report.rad.lab',
            compact('raw', 'pageWidth','r','now'));

    }
     public function cetakKematian(Request $r) {
        $kdProfile = (int)$r['kdprofile'];
        $raw = collect(DB::select("
        select pd.namalengkapambilpasien, pd.tglmeninggal, pd.namapemeriksajenazah, pd.tgldimakamkan, pd.tglpemeriksaanjenazah, pm.namapasien, pm.nocm, pm.noidentitas, jk.jeniskelamin, pm.tempatlahir,
		cast(pm.tgllahir as date) as tgllahir, ag.agama, al.alamatlengkap, al.namadesakelurahan, al.kecamatan, al.kotakabupaten, al.kodepos, pm.nohp, hk.hubungankeluarga, sk.statuskependudukan,
		sj.statusjenazah, kp.kualifikasipemeriksa,pg.namalengkap AS doktermenerangkan, pk.penyebabkematian, dd.dasardiagnosis, pg2.namalengkap as dokterdiagnosis, pd.penyebablangsunga,pd.penyebablangsungb,
		pd.penyebablangsungc,pd.penyebablangsungd,pd.penyebablangsunge,pd.penyebabutamabayi,pd.penyebablainbayi,pd.penyebabutamaibu,pd.penyebablainibu
from pasiendaftar_t as pd left outer join
	pasien_m as pm on pm.id = pd.nocmfk left outer join
	jeniskelamin_m as jk on jk.id = pm.objectjeniskelaminfk left outer join
	agama_m as ag on ag.id = pm.objectagamafk left outer join
	hubungankeluarga_m as hk on hk.id = pd.objecthubungankeluargaambilpasienfk left outer join
	alamat_m as al on pm.id = al.nocmfk left outer join
	statuskependudukan_m as sk on sk.id = pd.objectstatuskependudukanfk left outer join
	statusjenazah_m as sj on sj.id = pd.objectstatusjenazahfk left outer join
	kualifikasipemeriksa_m as kp on kp.id = pd.objectkualifikasipemeriksafk	left outer join
	pegawai_m AS pg ON pg.id = pd.objectdoktermenerangkanfk left outer join
	penyebabkematian_m as pk on pk.id = pd.objectpenyebabkematianfk left outer join
	dasardiagnosis_m as dd on dd.id = pd.objectdasardiagnosisfk left outer join
	pegawai_m as pg2 on pg2.id = pd.objectdokterdiagnosisfk
            WHERE
                pd.noregistrasi = '$r[reg]'
        "))->first();
        if(!empty($raw)){
            $raw->umur = $this->getAge($raw->tgllahir ,date('Y-m-d'));
        }else{
            echo 'Data Tidak ada ';
            return;
        }

       


        $pageWidth = 950;
        $now =  $this->getDateTime();

        return view('report.rad.kematian',
            compact('raw', 'pageWidth','r','now'));

    }
    
    public function cetakDokter(Request $r) {
        $kdProfile = (int)$r['kdprofile'];
        $raw = collect(DB::select("
        SELECT pg.nip, pg.nosip,pg.nama, jk.jeniskelamin, pg.tgllahir, ps.namapasien, ps.nocm, CONVERT(varchar, rm.tglresume, 105) AS tglresume
        FROM pasiendaftar_t AS pd LEFT OUTER JOIN
        antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk=pd.norec INNER JOIN
        resumemedis_t AS rm ON rm.noregistrasifk=apd.norec LEFT OUTER JOIN
        pegawai_m AS pg ON pg.id=pd.objectpegawaifk LEFT OUTER JOIN
        jeniskelamin_m AS jk ON jk.id=pg.objectjeniskelaminfk LEFT OUTER JOIN
        pasien_m AS ps ON ps.id=pd.nocmfk
            WHERE
                pd.noregistrasi = '$r[reg]'
        "))->first();
        if(!empty($raw)){
            $raw->umur = $this->getAge($raw->tgllahir ,date('Y-m-d'));
        }else{
            echo 'Data Tidak ada ';
            return;
        }

        $pageWidth = 950;
        $now =  $this->getDateTime();

        return view('report.pdf.infodokter',
            compact('raw', 'pageWidth','r','now'));

    }
      public function cetakTtd(Request $r)
    {
        //    $kdProfile = (int)$r['kdprofile'];
        $where = '';
        if (isset($r['idPegawai']) && $r['idPegawai'] != null && $r['idPegawai'] != "") {
            $where = "where pg.id = " . $r['idPegawai'];
        }
        if (isset($r['namaPegawai']) && $r['namaPegawai'] != null && $r['namaPegawai'] != "") {
            $where = "where pg.namalengkap = " . $r['namaPegawai'];
        }
        $raw = collect(DB::select("
        select 
            case when pg.nippns is null then '-' else pg.nippns end as nip,
            pg.ttd, 
            COALESCE(pg.nikintern, COALESCE(pg.nik_intern, '-')) AS nik,
            namalengkap, 
            jp.jenispegawai, 
            pg.nosip, 
            jk.jeniskelamin, 
            pg.tgllahir, 
            ked.name as statuspegawai,
            to_char(now(), 'DD-MM-YYYY HH24:MI:SS') as tglcetak,
            ttp.tandatangan,
            case when pt.namapangkat is null then '-' else pt.namapangkat end as namapangkat
        from pegawai_m as pg 
        left join jenispegawai_m as jp on jp.id = pg.objectjenispegawaifk
        left join jeniskelamin_m as jk on jk.id = pg.objectjeniskelaminfk
        left join sdm_kedudukan_m as ked on ked.id = pg.kedudukanfk
        left join tandatanganppa_t as ttp on ttp.objectpegawaifk::integer = pg.id
        left join pangkat_m as pt on pt.id = pg.objectpangkatfk
        where pg.id = :idPegawai
     ", ['idPegawai' => (int) $r['idPegawai']]))->first();
     
        if (!empty($raw)) {
            $raw->umur = $this->getAge($raw->tgllahir, date('Y-m-d'));
        } else {
            echo 'Data Tidak ada ';
            return;
        }
        //    pd.noregistrasi = '$r[reg]'




        $pageWidth = 950;
        $now =  $this->getDateTime();

        return view(
            'report.pdf.ttd',
            compact('raw', 'pageWidth', 'r', 'now')
        );
    }

    public function doktermenerangkan(Request $r) {
        $kdProfile = (int)$r['kdprofile'];
        $raw = collect(DB::select("
        select pd.namalengkapambilpasien, pd.tglmeninggal, pd.namapemeriksajenazah, pd.tgldimakamkan, pd.tglpemeriksaanjenazah, pm.namapasien, pm.nocm, pm.noidentitas, jk.jeniskelamin, pm.tempatlahir,
		cast(pm.tgllahir as date) as tgllahir, ag.agama, al.alamatlengkap, al.namadesakelurahan, al.kecamatan, al.kotakabupaten, al.kodepos, pm.nohp, hk.hubungankeluarga, sk.statuskependudukan,
		sj.statusjenazah, kp.kualifikasipemeriksa,pg.namalengkap AS doktermenerangkan, pk.penyebabkematian, dd.dasardiagnosis, pg2.namalengkap as dokterdiagnosis, pd.penyebablangsunga,pd.penyebablangsungb,
		pd.penyebablangsungc,pd.penyebablangsungd,pd.penyebablangsunge,pd.penyebabutamabayi,pd.penyebablainbayi,pd.penyebabutamaibu,pd.penyebablainibu,pg.nip as nipdoktermenerangkan, pg.nosip as sipdoktermenerangkan, jk2.jeniskelamin as jkdoktermenerangkan, pg2.nip as nipdokterdiagnosis,
		pg2.nosip as sipdokterdiagnosis, jk3.jeniskelamin as jkdokterdiagnosis, convert(varchar, getdate(), 103) as tglcetak
from pasiendaftar_t as pd left outer join
	pasien_m as pm on pm.id = pd.nocmfk left outer join
	jeniskelamin_m as jk on jk.id = pm.objectjeniskelaminfk left outer join
	agama_m as ag on ag.id = pm.objectagamafk left outer join
	hubungankeluarga_m as hk on hk.id = pd.objecthubungankeluargaambilpasienfk left outer join
	alamat_m as al on pm.id = al.nocmfk left outer join
	statuskependudukan_m as sk on sk.id = pd.objectstatuskependudukanfk left outer join
	statusjenazah_m as sj on sj.id = pd.objectstatusjenazahfk left outer join
	kualifikasipemeriksa_m as kp on kp.id = pd.objectkualifikasipemeriksafk	left outer join
	pegawai_m AS pg ON pg.id = pd.objectdoktermenerangkanfk left outer join
	penyebabkematian_m as pk on pk.id = pd.objectpenyebabkematianfk left outer join
	dasardiagnosis_m as dd on dd.id = pd.objectdasardiagnosisfk left outer join
	pegawai_m as pg2 on pg2.id = pd.objectdokterdiagnosisfk left outer join
	jeniskelamin_m as jk2 on jk2.id = pg.objectjeniskelaminfk left outer join
	jeniskelamin_m as jk3 on jk3.id = pg2.objectjeniskelaminfk
            WHERE
                pd.noregistrasi = '$r[reg]'
        "))->first();
        if(!empty($raw)){
            $raw->umur = $this->getAge($raw->tgllahir ,date('Y-m-d'));
        }else{
            echo 'Data Tidak ada ';
            return;
        }

        $pageWidth = 950;
        $now =  $this->getDateTime();

        return view('report.pdf.doktermenerangkan',
            compact('raw', 'pageWidth','r','now'));

    }
    public function dokterdiagnosis(Request $r) {
        $kdProfile = (int)$r['kdprofile'];
        $raw = collect(DB::select("
        select pd.namalengkapambilpasien, pd.tglmeninggal, pd.namapemeriksajenazah, pd.tgldimakamkan, pd.tglpemeriksaanjenazah, pm.namapasien, pm.nocm, pm.noidentitas, jk.jeniskelamin, pm.tempatlahir,
		cast(pm.tgllahir as date) as tgllahir, ag.agama, al.alamatlengkap, al.namadesakelurahan, al.kecamatan, al.kotakabupaten, al.kodepos, pm.nohp, hk.hubungankeluarga, sk.statuskependudukan,
		sj.statusjenazah, kp.kualifikasipemeriksa,pg.namalengkap AS doktermenerangkan, pk.penyebabkematian, dd.dasardiagnosis, pg2.namalengkap as dokterdiagnosis, pd.penyebablangsunga,pd.penyebablangsungb,
		pd.penyebablangsungc,pd.penyebablangsungd,pd.penyebablangsunge,pd.penyebabutamabayi,pd.penyebablainbayi,pd.penyebabutamaibu,pd.penyebablainibu,pg.nip as nipdoktermenerangkan, pg.nosip as sipdoktermenerangkan, jk2.jeniskelamin as jkdoktermenerangkan, pg2.nip as nipdokterdiagnosis,
		pg2.nosip as sipdokterdiagnosis, jk3.jeniskelamin as jkdokterdiagnosis, convert(varchar, getdate(), 103) as tglcetak
from pasiendaftar_t as pd left outer join
	pasien_m as pm on pm.id = pd.nocmfk left outer join
	jeniskelamin_m as jk on jk.id = pm.objectjeniskelaminfk left outer join
	agama_m as ag on ag.id = pm.objectagamafk left outer join
	hubungankeluarga_m as hk on hk.id = pd.objecthubungankeluargaambilpasienfk left outer join
	alamat_m as al on pm.id = al.nocmfk left outer join
	statuskependudukan_m as sk on sk.id = pd.objectstatuskependudukanfk left outer join
	statusjenazah_m as sj on sj.id = pd.objectstatusjenazahfk left outer join
	kualifikasipemeriksa_m as kp on kp.id = pd.objectkualifikasipemeriksafk	left outer join
	pegawai_m AS pg ON pg.id = pd.objectdoktermenerangkanfk left outer join
	penyebabkematian_m as pk on pk.id = pd.objectpenyebabkematianfk left outer join
	dasardiagnosis_m as dd on dd.id = pd.objectdasardiagnosisfk left outer join
	pegawai_m as pg2 on pg2.id = pd.objectdokterdiagnosisfk left outer join
	jeniskelamin_m as jk2 on jk2.id = pg.objectjeniskelaminfk left outer join
	jeniskelamin_m as jk3 on jk3.id = pg2.objectjeniskelaminfk
            WHERE
                pd.noregistrasi = '$r[reg]'
        "))->first();
        if(!empty($raw)){
            $raw->umur = $this->getAge($raw->tgllahir ,date('Y-m-d'));
        }else{
            echo 'Data Tidak ada ';
            return;
        }

        $pageWidth = 950;
        $now =  $this->getDateTime();

        return view('report.pdf.dokterdiagnosis',
            compact('raw', 'pageWidth','r','now'));

    }

    public function cetakPasien(Request $r) {
       $kdProfile = (int)$r['kdprofile'];
       $raw = collect(DB::select("
       select ps.nocm, ps.namapasien, ps.tgllahir, kp.kelompokpasien, ru.namaruangan, jk.jeniskelamin, pd.noregistrasi, pd.namalengkapambilpasien, CONVERT(varchar, rm.tglresume, 105) as tglresume, CASE WHEN alm.alamatlengkap IS NULL 
       THEN '-' ELSE (alm.alamatlengkap + ' ' + ds.namadesakelurahan + ' ' + kc.namakecamatan + ' ' + kk.namakotakabupaten + ' ' + pro.namapropinsi) END AS alamatlengkap, pd.noregistrasi, pemakaianasuransi_t.nokepesertaan, 
       pemakaianasuransi_t.nosep, ps.noidentitas
FROM            jeniskelamin_m AS jk RIGHT OUTER JOIN
       pasiendaftar_t AS pd INNER JOIN
       antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk=pd.norec INNER JOIN
       resumemedis_t AS rm ON rm.noregistrasifk=apd.norec INNER JOIN
       pasien_m AS ps ON ps.id = pd.nocmfk INNER JOIN
       kelompokpasien_m AS kp ON kp.id = pd.objectkelompokpasienlastfk INNER JOIN
       ruangan_m AS ru ON ru.id = pd.objectruanganlastfk ON jk.id = ps.objectjeniskelaminfk LEFT OUTER JOIN
       pemakaianasuransi_t ON pd.norec = pemakaianasuransi_t.noregistrasifk LEFT OUTER JOIN
       kelompokpasien_m AS kps ON kps.id = pd.objectkelompokpasienlastfk LEFT OUTER JOIN
       alamat_m AS alm ON alm.nocmfk = ps.id LEFT OUTER JOIN
       desakelurahan_m AS ds ON ds.id = alm.objectdesakelurahanfk LEFT OUTER JOIN
       kotakabupaten_m AS kk ON kk.id = alm.objectkotakabupatenfk LEFT OUTER JOIN
       kecamatan_m AS kc ON kc.id = alm.objectkecamatanfk LEFT OUTER JOIN
       propinsi_m AS pro ON pro.id = alm.objectpropinsifk
           WHERE
               pd.noregistrasi = '$r[reg]'
       "))->first();
       if(!empty($raw)){
           $raw->umur = $this->getAge($raw->tgllahir ,date('Y-m-d'));
       }else{
           echo 'Data Tidak ada ';
           return;
       }

      


       $pageWidth = 950;
       $now =  $this->getDateTime();

       return view('report.pdf.infopasien',
           compact('raw', 'pageWidth','r','now'));

   }
public function cetakAntrianKiosk(Request $request)
    {
        $kdProfile = (int)$request['kdprofile'];
        $norec = $request['norec'];
        $TglAwal =  date('Y-m-d ') . '00:00';
        $TglAkhir = date('Y-m-d ') . '23:59';
        $tglAyeuna = date('Y-m-d H:i:s');
        $profile = collect(DB::select("
                select * from profile_m where id = $kdProfile limit 1
            "))->first();

        $antrian = DB::table('antrianpasienregistrasi_t AS apr')
        ->leftJoin('ruangan_m AS ru', 'ru.id', '=', 'apr.objectruanganfk')
        ->select(DB::raw("apr.*,CASE WHEN ru.namaruangan IS NULL 
                                        THEN '' ELSE ru.namaruangan END AS namaruangan"))
        ->where('apr.norec', '=', $norec)
            ->first();

        $str = $antrian->jenis;
        $jmlAntrian = DB::table('antrianpasienregistrasi_t')
        ->select(DB::raw("count(noantrian) as jmlantri"))
        ->where('statuspanggil', '=', 0)
            ->whereBetween('tanggalreservasi', [$TglAwal, $TglAkhir])
            ->where('jenis', '=', $str)
            ->first();

        $noAntrian = $antrian->noantrian;
        $strJenis = $antrian->jenis;
        $jenis = "";
        if ($strJenis == "A") {
            $jenis = "UMUM";
        } elseif ($strJenis == "B") {
            $jenis = "BPJS";
        }
        if (strlen($antrian->noantrian) == 1) {
            $noAntrian = "00" . $antrian->noantrian;
        } else {
            $noAntrian = "0" . $antrian->noantrian;
        }
        $pageWidth = 250;
        $dataReport = array(
            'namaprofile' => $profile->namalengkap,
            'alamat' => $profile->alamatlengkap,
            'jenis' => $jenis,
            'noantrian' => $strJenis . "-" . $noAntrian,
            'jmlantrian' => $jmlAntrian->jmlantri,
            'pageWidth'  => 365,
            'tanggal'  => $tglAyeuna,
        );

        //        $pdf = PDF::loadView('report.pendaftaran.antrian', array(
        //                'dataReport' => $dataReport,
        //        ));
        //        return $pdf->stream();

        return view(
            'pendaftaran.antrian',
            compact('dataReport', 'pageWidth', 'profile')
        );
        //        return view('','$result');
    }
    public function cetakSEP(Request $request)
    {
        $kdProfile = (int)$request['kdprofile'];
        $Noregistrasi = $request['noregistrasi'];
        $tglAyeuna = date('Y-m-d H:i:s');

        $profile = collect(DB::select("
                select * from profile_m where id = $kdProfile limit 1
            "))->first(); 
        if(strlen($Noregistrasi)<=10){
            $where = "pd.noregistrasi ='".$Noregistrasi."'";
        }else{

            $where = "pa.nosep ='".$Noregistrasi."'";
        }
        /*$registrasi = collect(DB::select("
             SELECT pa.nosep,to_char(pa.tanggalsep, 'DD-MM-YYYY HH:mm') AS tanggalsep,pa.nokepesertaan,pi.nocm,pd.noregistrasi,
                    pa.norujukan,ap.namapeserta,to_char(pi.tgllahir, 'DD-MM-YYYY') AS tgllahir,jk.jeniskelamin, 
                    rp.namaruangan,rp.kodeexternal as namapoli,pa.ppkrujukan,  
                    (CASE WHEN rp.objectdepartemenfk=16 then 'Rawat Inap' else 'Rawat Jalan' END) as jenisrawat, 
                    dg.kddiagnosa, (case when dg.namadiagnosa is null then '-' else dg.namadiagnosa end) as namadiagnosa ,  
                    ap.jenispeserta,ap.kdprovider,ap.nmprovider,kls.namakelas,pa.catatan
             FROM pemakaianasuransi_t pa  
             LEFT JOIN asuransipasien_m ap on pa.objectasuransipasienfk= ap.id  
             LEFT JOIN pasiendaftar_t pd on pd.norec=pa.noregistrasifk  

             LEFT JOIN antrianpasiendiperiksa_t apd on apd.noregistrasifk=pd.norec  

             LEFT JOIN pasien_m pi on pi.id=pd.nocmfk  
             LEFT JOIN jeniskelamin_m jk on jk.id=pi.objectjeniskelaminfk  
             LEFT JOIN ruangan_m rp on rp.id=pd.objectruanganlastfk  
             LEFT JOIN diagnosa_m dg on pa.diagnosisfk=dg.id 
             LEFT JOIN kelas_m kls on kls.id=ap.objectkelasdijaminfk  
             where pd.noregistrasi ='$Noregistrasi' 


        "))->first();*/
        
        $registrasi = collect(DB::select("SELECT pa.nosep,to_char(pa.tanggalsep, 'DD-MM-YYYY HH:mm') AS tanggalsep,pa.nokepesertaan,pi.nocm,pd.noregistrasi,
            pa.norujukan,ap.namapeserta,to_char(pi.tgllahir, 'DD-MM-YYYY') AS tgllahir,jk.jeniskelamin, 
            rp.namaruangan,rp.kodeexternal as namapoli,pa.ppkrujukan,  
            (CASE WHEN rp.objectdepartemenfk=16 then 'Rawat Inap' else 'Rawat Jalan' END) as jenisrawat, 
            dg.kddiagnosa, (case when dg.namadiagnosa is null then '-' else dg.namadiagnosa end) as namadiagnosa ,  
            ap.jenispeserta,ap.kdprovider,ap.nmprovider,kls.namakelas,pa.catatan
            , apd.namahafis,apd.noantrian as noantrianhafis
            FROM pemakaianasuransi_t pa  
            LEFT JOIN asuransipasien_m ap on pa.objectasuransipasienfk= ap.id  
            LEFT JOIN pasiendaftar_t pd on pd.norec=pa.noregistrasifk  

            LEFT JOIN antrianpasiendiperiksa_t apd on apd.noregistrasifk=pa.noregistrasifk 

            LEFT JOIN pasien_m pi on pi.id=pd.nocmfk  
            LEFT JOIN jeniskelamin_m jk on jk.id=pi.objectjeniskelaminfk  
            LEFT JOIN ruangan_m rp on rp.id=pd.objectruanganlastfk  
            LEFT JOIN diagnosa_m dg on pa.diagnosisfk=dg.id 
            LEFT JOIN kelas_m kls on kls.id=ap.objectkelasdijaminfk  
            
            where  $where
            order by apd.namahafis ASC
        "))->first();
        
        $SEP = $this->cekSep($registrasi->nosep);
        if ($SEP['metaData']->code != 200) {
            echo 'Data Tidak ada ';
            return;
        }
            
        //     $x = json_encode($SEP['response']['peserta']->nama);
            // return($SEP['response']['peserta']->noKartu);
        // return($SEP['response'] );
        $pageWidth = 719;
        $dataReport = array(
            'namaprofile' => $profile->namalengkap,
            'alamat' => $profile->alamatlengkap,
            'nosep' => $registrasi->nosep,
            'tanggalsep' => $SEP['response']['tglSep'],
            'nokepesertaan' => $SEP['response']['peserta']->noKartu,
            'norm' => $registrasi->nocm,
            'noregistrasi' => $registrasi->noregistrasi,
            'jenispeserta' => $registrasi->jenispeserta,
            'namapeserta' => $SEP['response']['peserta']->nama,
            'cob' => "",
            'tgllahir' => $registrasi->tgllahir,
            'jeniskelamin' => $registrasi->jeniskelamin,
            'norujukan' => $registrasi->norujukan, 
            'namaruangan' => $registrasi->namaruangan,
            'namapoli' => $SEP['response']['poli'],
            'ppkrujukan' => $registrasi->ppkrujukan,
            'jenisrawat' => $registrasi->jenisrawat,
            'kddiagnosa' => $registrasi->kddiagnosa,
            'namadiagnosa' => $registrasi->namadiagnosa,
            'kdprovider' => $registrasi->kdprovider,
            'nmprovider' => $registrasi->nmprovider,
            'namakelas' => $registrasi->namakelas,
            'catatan' => $registrasi->catatan,
            'tanggal' => $tglAyeuna,
            'noantrian' => $registrasi->namahafis.'-'.$registrasi->noantrianhafis,
        );
        return view(
            'pendaftaran.sep',
            compact('dataReport', 'pageWidth', 'profile')
        );
        //        return view('','$result');
    }
    public function cekSep($sep) {
        // $data = '12098';//$this->getIdConsumerBPJSV2();
        // $secretKey = '8pX68721CC';//$this->getPasswordConsumerBPJSV2();
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time()-strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data."&".$tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);
        // return($this->getUrlBrigdingBPJSV2());
        // die();
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL=> $this->getUrlBrigdingBPJSV2()."SEP/". $sep,
        //    CURLOPT_URL => "https://new-api.bpjs-kesehatan.go.id:8080/new-vclaim-rest/SEP/".$request['nosep'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "Cache-Control: no-cache",
                "Content-Type: Application/x-www-form-urlencoded",
//                "Postman-Token: 07c605ad-c672-6e5b-562e-7cee1f9cd0ea",
                "X-cons-id: ".  (string)$data,
                "X-signature: ". (string)$encodedSignature,
                "X-timestamp: ". (string)$tStamp,
                "user_key: ". $userKey
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

        $key = $data . $secretKey . (string)$tStamp;
        $result = $this->stringDecryptVclaim($key, $result);
        return ($result);
    }
    function stringDecryptVclaim($key, $string)
    {

        $bahan = $string['response'];
        $metadata = $string['metaData'];
        //    return($bahan);
        //    die();
        $encrypt_method = 'AES-256-CBC';

        // hash
        $key_hash = hex2bin(hash('sha256', $key));

        // iv - encrypt method AES-256-CBC expects 16 bytes - else you will get a warning
        $iv = substr(hex2bin(hash('sha256', $key)), 0, 16);

        $output = openssl_decrypt(base64_decode($bahan), $encrypt_method, $key_hash, OPENSSL_RAW_DATA, $iv);

        $x = \LZCompressor\LZString::decompressFromEncodedURIComponent($output);
        $result = (array) json_decode($x);
        // return($metadata);
        // die();
        if ($metadata->code != 200) {
            $result = null;
        }
        $data2 = array(
            'metaData' => $metadata,
            'response' => $result,
        );
        return $data2;
    }
    public function cetakBuktiPendaftaran(Request $request)
    {
        $kdProfile = (int)$request['kdprofile'];
        $profile = collect(DB::select("
                select * from profile_m where id = $kdProfile limit 1
            "))->first();

        $registrasi = DB::table('pasiendaftar_t AS pd')
        ->Join('antrianpasiendiperiksa_t as apdp', 'apdp.noregistrasifk', '=', 'pd.norec')
        ->Join('pasien_m as ps', 'pd.nocmfk', '=', 'ps.id')
        ->leftJoin('alamat_m as ap', 'ap.nocmfk', '=', 'ps.id')
        ->leftJoin('jeniskelamin_m as jk', 'ps.objectjeniskelaminfk', '=', 'jk.id')
        ->leftJoin('ruangan_m as ru', 'pd.objectruanganlastfk', '=', 'ru.id')
        ->leftJoin('pegawai_m as pp', 'pd.objectpegawaifk', '=', 'pp.id')
        ->leftJoin('kelompokpasien_m as kp', 'pd.objectkelompokpasienlastfk', '=', 'kp.id')
        ->leftJoin('antrianpasienregistrasi_t as apr', 'apr.noreservasi', '=', 'pd.statusschedule')
        ->select(DB::raw("pp.namahafis,pd.noregistrasi,ps.nocm,ps.tgllahir,ps.namapasien,to_char(pd.tglregistrasi, 'DD-MM-YYYY HH:mm') AS tglregistrasi,jk.reportdisplay AS jk, 
                     ap.alamatlengkap,ap.mobilephone2,ru.namaruangan AS ruanganperiksa,pp.namalengkap AS namadokter, 
                     kp.kelompokpasien,apdp.noantrian,pd.statuspasien,apr.noreservasi,CASE WHEN apr.tanggalreservasi IS NULL THEN '' 
                     ELSE to_char(apr.tanggalreservasi, 'DD-MM-YYYY HH:mm') END AS tanggalreservasi"))
        ->where('pd.noregistrasi', $request['noregistrasi'])
        ->first();

        $statusonline = "";
        $status = "";
        if ($registrasi->tanggalreservasi != '') {
            $statusonline = "PASIEN ONLINE";
            $status = "Kartu ini adalah bukti anda mendaftar hari ini";
        } else {
            $statusonline = "Kartu ini adalah bukti anda mendaftar hari ini";
        }
        $pageWidth = 365;
        $dataReport = array(
            'namaprofile' => $profile->namalengkap,
            'alamat' => $profile->alamatlengkap,
            'tglregistrasi' => $registrasi->tglregistrasi,
            'noregistrasi' => $registrasi->noregistrasi,
            'norm' => $registrasi->nocm,
            'tgllahir' => $registrasi->tgllahir,
            'namapasien' => $registrasi->namapasien,
            'jeniskelamin' => $registrasi->jk,
            'alamatlengkap' => $registrasi->alamatlengkap,
            'mobilephone2' => $registrasi->mobilephone2,
            'ruangan' => $registrasi->ruanganperiksa,
            'namadokter' => $registrasi->namadokter,
            'kelompokpasien' => $registrasi->kelompokpasien,
            'noantrian' => $registrasi->namahafis.'-'.$registrasi->noantrian,
            'statuspasien' => $registrasi->statuspasien,
            'noreservasi' => $registrasi->noreservasi,
            'tanggalreservasi' => $registrasi->tanggalreservasi,
            'statusonline' => $statusonline,
            'status' => $status,
        );

        return view(
            'pendaftaran.buktipendaftaran',
            compact('dataReport', 'pageWidth', 'profile')
        );
        //        return view('','$result');
    }
    public function cetakHispatologi(Request $r) {
//        $kdProfile = (int)$r['kdprofile'];
//        $raw = collect(DB::select("
//            SELECT
//                pd.noregistrasi, pm.nocm, pm.namapasien, hpl.dokterluar, dokterpengirim.namalengkap as namadokterpengirim,
//                jk.jeniskelamin + '/ ' + EXTRACT ( YEAR
//                    FROM AGE(  pd.tglregistrasi,pm.tgllahir )
//                ) + ' Thn ' + EXTRACT (MONTH  FROM AGE(  pd.tglregistrasi, pm.tgllahir )
//                ) + ' Bln ' + EXTRACT ( DAY  FROM  AGE( pd.tglregistrasi, pm.tgllahir )  ) + ' Hr' + '(' + to_char(pm.tgllahir, 'DD-MM-YYYY') + ')' AS umur,
//                to_char(  so.tglorder, 'DD-MM-YYYY HH24:MI:SS') AS tglorder,
//                to_char( hpl.tanggal, 'DD-MM-YYYY HH24:MI:SS'  ) AS tgljawab,
//                to_char( pp.tglpelayanan,'DD-MM-YYYY HH24:MI:SS' ) AS tglterima,
//                to_char(  sbm.tglsbm,'DD-MM-YYYY HH24:MI:SS' ) AS tglbayar, pg.namalengkap,
//             CASE WHEN hpl.diagnosaklinik IS NULL THEN  ''  ELSE  diagnosaklinik  END AS diagnosaklinik,
//             CASE WHEN hpl.keteranganklinik IS NULL THEN ''   ELSE hpl.keteranganklinik  END AS keteranganklinik,
//             CASE WHEN hpl.makroskopik IS NULL THEN   '' ELSE  hpl.makroskopik END AS makroskopik,
//             CASE WHEN hpl.mikroskopik IS NULL THEN ''   ELSE  hpl.mikroskopik END AS mikroskopik,
//             CASE WHEN hpl.kesimpulan IS NULL THEN '' ELSE hpl.kesimpulan END AS kesimpulan,
//             CASE WHEN hpl.anjuran IS NULL THEN  '' ELSE  hpl.anjuran END AS anjuran,
//             CASE WHEN hpl.topografi IS NULL THEN   '' ELSE hpl.topografi  END AS topografi,
//             CASE WHEN hpl.morfologi IS NULL THEN  '' ELSE hpl.morfologi END AS morfologi,
//             CASE WHEN hpl.diagnosapb IS NULL THEN  '' ELSE  hpl.diagnosapb  END AS diagnosapb,
//             CASE WHEN hpl.keteranganpb IS NULL THEN ''  ELSE hpl.keteranganpb END AS keteranganpb,
//             CASE WHEN pg1.namalengkap IS NULL THEN '' ELSE  pg1.namalengkap   END AS namapenanggungjawab,
//             CASE WHEN pg1.nippns IS NULL THEN ''ELSE  pg1.nippns END AS nippns,hpl.nomorpa,
//             ru.namaruangan as asal,pg1.nosip,
//              CASE
//                    WHEN alm.alamatlengkap IS NULL THEN
//                        '-'
//                    ELSE
//                        (
//                            alm.alamatlengkap + ' ' + (
//                                CASE
//                                WHEN ds.namadesakelurahan IS NOT NULL THEN
//                                   'Kel. ' +  ds.namadesakelurahan
//                                ELSE
//                                    ''
//                                END
//                            ) + ' ' + (
//                                CASE
//                                WHEN kc.namakecamatan IS NOT NULL THEN
//                                   'Kec. ' + kc.namakecamatan
//                                ELSE
//                                    ''
//                                END
//                            ) + ' ' + (
//                                CASE
//                                WHEN kk.namakotakabupaten IS NOT NULL THEN
//                                  kk.namakotakabupaten
//                                ELSE
//                                    ''
//                                END
//                            ) + ' ' + (
//                                CASE
//                                WHEN prop.namapropinsi IS NOT NULL THEN
//                                 'Prov. ' +   prop.namapropinsi
//                                ELSE
//                                    ''
//                                END
//                            )
//                        )
//                    END AS alamatlengkap,
//                    kps.kelompokpasien,pd.norec as norec_pd,pd.objectruanganlastfk
//            FROM
//                hasilpemeriksaanlab_t AS hpl
//            INNER JOIN pasiendaftar_t AS pd ON pd.norec = hpl.noregistrasifk
//            INNER JOIN pelayananpasien_t AS pp ON pp.norec = hpl.pelayananpasienfk
//            LEFT JOIN strukorder_t AS so ON so.norec = pp.strukorderfk
//            LEFT JOIN strukpelayanan_t AS sp ON sp.norec = pp.strukfk
//            LEFT JOIN strukbuktipenerimaan_t AS sbm ON sbm.nostrukfk = pp.norec
//            INNER JOIN produk_m AS pro ON pro. ID = pp.produkfk
//            INNER JOIN pasien_m AS pm ON pm. ID = pd.nocmfk
//            LEFT JOIN jeniskelamin_m AS jk ON jk. ID = pm.objectjeniskelaminfk
//            LEFT JOIN pegawai_m AS pg ON pg. ID = so.objectpegawaiorderfk
//            LEFT JOIN pegawai_m AS pg1 ON pg1. ID = hpl.pegawaifk
//            LEFT JOIN pegawai_m AS dokterpengirim ON dokterpengirim. ID = hpl.dokterpengirimfk
//             LEFT JOIN ruangan_m AS ru ON ru. ID = pd.objectruanganlastfk
//            left join alamat_m as alm on alm.nocmfk=pm.id
//            left join desakelurahan_m as ds on ds.id=alm.objectdesakelurahanfk
//            left join kotakabupaten_m as kk on kk.id=alm.objectkotakabupatenfk
//            left join kecamatan_m as kc on kc.id=alm.objectkecamatanfk
//            left join propinsi_m as prop on prop.id=alm.objectpropinsifk
//              left join kelompokpasien_m as kps on kps.id=pd.objectkelompokpasienlastfk
//            WHERE
//                pp.norec = '$r[norec]'
//                and hpl.statusenabled=true
//        "))->first();
////        dd($raw);
//        if(!empty($raw)){
//            $norec_pd = $raw->norec_pd;
//            $objectruanganlastfk = $raw->objectruanganlastfk;
//            $asalRujukan = collect(DB::select("select
//                    asalrujukan from antrianpasiendiperiksa_t as apd
//                join asalrujukan_m as asl on asl.id=apd.objectasalrujukanfk
//                where apd.noregistrasifk='$norec_pd'
//                and apd.objectruanganfk=$objectruanganlastfk
//                and apd.kdprofile=$kdProfile
//                "))->first();
//            $raw->asalrujukan ='';
//            if(!empty( $asalRujukan )){
//                $raw->asalrujukan=  $asalRujukan->asalrujukan;
//            }
//
////            $raw->umur = $this->getAge($raw->tgllahir ,date('Y-m-d'));
//        }else{
//            echo 'Data Tidak ada ';
//            return;
//        }
////        dd($raw);
//        $pageWidth = 950;
        $raw = collect(DB::select("
            SELECT
               ps.nocm, ps.namapasien,ps.tgllahir,kp.kelompokpasien,
            ru.namaruangan, so.tanggal,jk.jeniskelamin,  
            CASE WHEN alm.alamatlengkap IS NULL THEN
                '-' ELSE (
                alm.alamatlengkap || ' ' || ds.namadesakelurahan || ' '|| kc.namakecamatan
                || ' ' || kk.namakotakabupaten || ' '  || pro.namapropinsi )
            END AS alamatlengkap,
            CASE WHEN so.dokterperujuk = 1 then '-' else pg3.namalengkap end as dokterperujuk,
            CASE WHEN so.dokterperujukluar is null then '-' else so.dokterperujukluar end as dokterperujukluar, 
            pg.namalengkap as perujuk,pg2.namalengkap as dokterrad,
            pr.namaproduk,pd.noregistrasi,pg2.nosip,
            pg2.id as pgid,so.expertise,so.tanggal_terima,so.tanggal_jawab,so.topologi,so.morfologi,so.nomorpa
            FROM
                hasilpemeriksaanlab_t AS so
            INNER JOIN pasiendaftar_t AS pd ON pd.norec = so.noregistrasifk
            INNER JOIN pasien_m AS ps ON ps. ID = pd.nocmfk
            INNER JOIN kelompokpasien_m AS kp ON kp. ID = pd.objectkelompokpasienlastfk
            INNER JOIN ruangan_m AS ru ON ru. ID = pd.objectruanganlastfk
            INNER JOIN pelayananpasien_t AS pp ON pp.norec = so.pelayananpasienfk
            INNER JOIN produk_m AS pr ON pr.id = pp.produkfk
            LEFT JOIN jeniskelamin_m AS jk ON jk. ID = ps.objectjeniskelaminfk
            LEFT JOIN kelompokpasien_m AS kps ON kps. ID = pd.objectkelompokpasienlastfk
            LEFT JOIN alamat_m AS alm ON alm.nocmfk = ps. ID
            left join desakelurahan_m as ds on ds.id=alm.objectdesakelurahanfk
            left join kotakabupaten_m as kk on kk.id=alm.objectkotakabupatenfk
            left join kecamatan_m as kc on kc.id=alm.objectkecamatanfk
            left join propinsi_m as pro on pro.id=alm.objectpropinsifk
            LEFT JOIN pegawai_m AS pg ON pg. ID = pd.objectpegawaifk
            LEFT JOIN pegawai_m AS pg2 ON pg2. ID = so.pegawaifk
            LEFT JOIN pegawai_m AS pg3 ON pg3. ID = so.dokterperujuk
            WHERE
                so.norec = '$r[norec]'
     
            AND so.statusenabled = true
        "))->first();
//        dd($raw);
        if(!empty($raw)){
            $raw->umur = $this->getAge($raw->tgllahir ,date('Y-m-d'));
        }else{
            echo 'Data Tidak ada ';
            return;
        }
//        dd($raw);
        $pageWidth = 950;

        return view('report.lab.hasil-pa',
            compact('raw', 'pageWidth','r'));


    }
    public function cetakBadanSehat(Request $request){
        $raw = collect(DB::select("
        SELECT ps.namapasien,ps.tgllahir,pd.norec as norec_pd,jk.jeniskelamin,
        CASE WHEN alm.alamatlengkap IS NULL THEN
        '-' ELSE (
        alm.alamatlengkap|| ' ' || ds.namadesakelurahan || ' '|| kc.namakecamatan
        || ' ' || kk.namakotakabupaten || ' ' || pro.namapropinsi )
        END AS alamatlengkap,hbs.tinggibadan,hbs.beratbadan,hbs.tensidarah,hbs.suhutubuh,
        alm.alamatlengkap as alamatlengkap2, pg.namalengkap as namadokter,hbs.persyaratan,hbs.nomor2,pg.nippns,
        '$request[noSurat]'|| '/' || case when to_char(now(),'MM') = '01' then 'I' when to_char(now(),'MM') = '02' then 'II'
        when to_char(now(),'MM') = '03' then 'III'
        when to_char(now(),'MM') = '04' then 'IV'
        when to_char(now(),'MM') = '05' then 'V'
        when to_char(now(),'MM') = '06' then 'VI'
        when to_char(now(),'MM') = '07' then 'VII'
        when to_char(now(),'MM') = '08' then 'VIII'
        when to_char(now(),'MM') = '09' then 'IX'
        when to_char(now(),'MM') = '10' then 'X'
        when to_char(now(),'MM') = '11' then 'XI' else 'XII' end || '/' || to_char(now(),'yyyy') || '/' || 'Inst.MCU' as nosurat
            FROM hasilpemeriksaanmcu_t as hbs
        INNER JOIN pasiendaftar_t as pd on pd.norec = hbs.noregistrasifk
        INNER JOIN pasien_m as ps on ps.id = pd.nocmfk
        INNER JOIN jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk
        LEFT JOIN alamat_m AS alm ON alm.nocmfk = ps.id
            left join desakelurahan_m as ds on ds.id=alm.objectdesakelurahanfk
            left join kotakabupaten_m as kk on kk.id=alm.objectkotakabupatenfk
            left join kecamatan_m as kc on kc.id=alm.objectkecamatanfk
            left join propinsi_m as pro on pro.id=alm.objectpropinsifk
        INNER JOIN pegawai_m as pg on pg.id = hbs.pegawaifk
        WHERE hbs.norec = '$request[norec]'
        AND pd.statusenabled = true
        AND hbs.keterangan = 'Surat Keterangan Hasil Badan Sehat'
        ORDER BY hbs.nomor2 DESC
        
        "))->first();
        $pageWidth = 940;

        return view('mcu.hasil-badan-sehat',
        compact('raw','request'));
    }
    public function cetakBebasNarkoba(Request $request){
        $raw = collect(DB::select("
        SELECT ps.namapasien,ps.tgllahir,pd.norec as norec_pd,jk.jeniskelamin,hpm.nomor2,
        CASE WHEN alm.alamatlengkap IS NULL THEN
                '-' ELSE (
                alm.alamatlengkap || ' ' || ds.namadesakelurahan || ' '|| kc.namakecamatan
                || ' ' || kk.namakotakabupaten || ' '  || pro.namapropinsi )
            END AS alamatlengkap,
            alm.alamatlengkap as alamatlengkap2
            FROM pasien_m as ps
        INNER JOIN pasiendaftar_t as pd on pd.nocmfk = ps.id
        INNER JOIN jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk
        INNER JOIN hasilpemeriksaanmcu_t as hpm on hpm.noregistrasifk = pd.norec
        LEFT JOIN alamat_m AS alm ON alm.nocmfk = ps.id
            left join desakelurahan_m as ds on ds.id=alm.objectdesakelurahanfk
            left join kotakabupaten_m as kk on kk.id=alm.objectkotakabupatenfk
            left join kecamatan_m as kc on kc.id=alm.objectkecamatanfk
            left join propinsi_m as pro on pro.id=alm.objectpropinsifk
        WHERE pd.norec = '$request[norec]'
        AND pd.statusenabled = true
        AND hpm.keterangan = 'Surat Keterangan Bebas Narkoba'
        ORDER BY hpm.nomor2 DESC
        
        "))->first();
        // $pageWidth = 960;

        return view('mcu.hasil-bebas-narkoba',
        compact('raw','request'));
    }
    public function cetakKesehatanJiwa(Request $request){
        $raw = collect(DB::select("
        SELECT ps.namapasien,ps.tgllahir,pd.norec as norec_pd,jk.jeniskelamin,
        CASE WHEN alm.alamatlengkap IS NULL THEN
                '-' ELSE (
                alm.alamatlengkap + ' ' + ds.namadesakelurahan + ' '+ kc.namakecamatan
                + ' ' + kk.namakotakabupaten + ' '  + pro.namapropinsi )
            END AS alamatlengkap,
            CASE WHEN pg.objectpangkatfk = 37 THEN pt.namaexternal + ' ' + 'NRP .' + ' ' + pg.nrp
            WHEN pg.objectpangkatfk in (14,15) THEN pt.namapangkat + ' ' + 'NIP .' + ' ' + pg.nippns
            WHEN pg.objectpangkatfk = 46 THEN pt.namapangkat + ' ' + 'SIP .' + ' ' + pg.nosip else '-' end as pangkatnrp,
            alm.alamatlengkap as alamatlengkap2, pg.namalengkap as namadokter,pt.namapangkat,hbs.persyaratan,hbs.nomor2
            FROM pasien_m as ps
        INNER JOIN pasiendaftar_t as pd on pd.nocmfk = ps.id
        INNER JOIN jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk
        LEFT JOIN alamat_m AS alm ON alm.nocmfk = ps.id
            left join desakelurahan_m as ds on ds.id=alm.objectdesakelurahanfk
            left join kotakabupaten_m as kk on kk.id=alm.objectkotakabupatenfk
            left join kecamatan_m as kc on kc.id=alm.objectkecamatanfk
            left join propinsi_m as pro on pro.id=alm.objectpropinsifk
        INNER JOIN hasilpemeriksaanmcu_t as hbs on hbs.noregistrasifk = pd.norec
        INNER JOIN pegawai_m as pg on pg.id = hbs.pegawaifk
        INNER JOIN pangkat_m as pt on pt.id = pg.objectpangkatfk
        WHERE hbs.norec = '$request[norec]'
        AND pd.statusenabled = 1
        AND hbs.keterangan = 'Surat Keterangan Dokter Kesehatan Jiwa'
        ORDER BY hbs.nomor2 DESC
        
        "))->first();
        $pageWidth = 940;

        return view('mcu.hasil-kesehatan-jiwa',
        compact('raw','pageWidth','request'));
    }
    public function cetakBebasNarkobav2(Request $request){
        $raw = collect(DB::select("
        SELECT ps.namapasien,ps.tgllahir,pd.norec as norec_pd,jk.jeniskelamin,hpm.nomor2,
        CASE WHEN alm.alamatlengkap IS NULL THEN
                '-' ELSE (
                alm.alamatlengkap || ' ' || ds.namadesakelurahan || ' '|| kc.namakecamatan
                || ' ' || kk.namakotakabupaten || ' '  || pro.namapropinsi )
            END AS alamatlengkap,
            alm.alamatlengkap as alamatlengkap2
            FROM pasien_m as ps
        INNER JOIN pasiendaftar_t as pd on pd.nocmfk = ps.id
        INNER JOIN jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk
        INNER JOIN hasilpemeriksaanmcu_t as hpm on hpm.noregistrasifk = pd.norec
        LEFT JOIN alamat_m AS alm ON alm.nocmfk = ps.id
            left join desakelurahan_m as ds on ds.id=alm.objectdesakelurahanfk
            left join kotakabupaten_m as kk on kk.id=alm.objectkotakabupatenfk
            left join kecamatan_m as kc on kc.id=alm.objectkecamatanfk
            left join propinsi_m as pro on pro.id=alm.objectpropinsifk
        WHERE pd.norec = '$request[norec]'
        AND pd.statusenabled = true
        AND hpm.keterangan = 'Surat Keterangan Bebas Narkoba v2'
        ORDER BY hpm.nomor2 DESC
        
        "))->first();
        $pageWidth = 940;

        return view('mcu.hasil-bebas-narkobav2',
        compact('raw','pageWidth','request'));
    }
    public function cetakBebasPenyakitMenular(Request $request){
        $raw = collect(DB::select("
        SELECT ps.namapasien,ps.tgllahir,pd.norec as norec_pd,jk.jeniskelamin,
        CASE WHEN alm.alamatlengkap IS NULL THEN
                '-' ELSE (
                alm.alamatlengkap || ' ' || ds.namadesakelurahan || ' '|| kc.namakecamatan
                || ' ' || kk.namakotakabupaten || ' '  || pro.namapropinsi )
            END AS alamatlengkap,
            alm.alamatlengkap as alamatlengkap2, pg.namalengkap as namadokter,hbs.persyaratan,hbs.nomor2
            FROM hasilpemeriksaanmcu_t as hbs
        INNER JOIN pasiendaftar_t as pd on pd.norec = hbs.noregistrasifk
        INNER JOIN pasien_m as ps on ps.id = pd.nocmfk
        INNER JOIN jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk
        LEFT JOIN alamat_m AS alm ON alm.nocmfk = ps.id
            left join desakelurahan_m as ds on ds.id=alm.objectdesakelurahanfk
            left join kotakabupaten_m as kk on kk.id=alm.objectkotakabupatenfk
            left join kecamatan_m as kc on kc.id=alm.objectkecamatanfk
            left join propinsi_m as pro on pro.id=alm.objectpropinsifk
        INNER JOIN pegawai_m as pg on pg.id = hbs.pegawaifk
        WHERE hbs.norec = '$request[norec]'
        AND pd.statusenabled = true
        AND hbs.keterangan = 'Surat Keterangan Bebas Penyakit Menular'
        ORDER BY hbs.nomor2 DESC
        
        "))->first();
        $pageWidth = 940;

        return view('mcu.hasil-bebas-penyakit-menular',
        compact('raw','pageWidth','request'));
    }
    public function cetakBebasHIV(Request $request){
        $raw = collect(DB::select("
        SELECT ps.namapasien,ps.tgllahir,pd.norec as norec_pd,jk.jeniskelamin,
        CASE WHEN alm.alamatlengkap IS NULL THEN
                '-' ELSE (
                alm.alamatlengkap || ' ' || ds.namadesakelurahan || ' '|| kc.namakecamatan
                || ' ' || kk.namakotakabupaten || ' '  || pro.namapropinsi )
            END AS alamatlengkap,
            alm.alamatlengkap as alamatlengkap2, pg.namalengkap as namadokter,hbs.persyaratan,hbs.nomor2
            FROM hasilpemeriksaanmcu_t as hbs
        INNER JOIN pasiendaftar_t as pd on pd.norec = hbs.noregistrasifk
        INNER JOIN pasien_m as ps on ps.id = pd.nocmfk
        INNER JOIN jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk
        LEFT JOIN alamat_m AS alm ON alm.nocmfk = ps.id
            left join desakelurahan_m as ds on ds.id=alm.objectdesakelurahanfk
            left join kotakabupaten_m as kk on kk.id=alm.objectkotakabupatenfk
            left join kecamatan_m as kc on kc.id=alm.objectkecamatanfk
            left join propinsi_m as pro on pro.id=alm.objectpropinsifk
        INNER JOIN pegawai_m as pg on pg.id = hbs.pegawaifk
        WHERE hbs.norec = '$request[norec]'
        AND pd.statusenabled = true
        AND hbs.keterangan = 'Surat Keterangan Bebas HIV'
        ORDER BY hbs.nomor2 DESC
        
        "))->first();
        $pageWidth = 940;

        return view('mcu.hasil-bebas-hiv',
        compact('raw','pageWidth','request'));
    }
    public function cetakHasilTidakHamil(Request $request){
        $raw = collect(DB::select("
        SELECT ps.namapasien,ps.tgllahir,pd.norec as norec_pd,jk.jeniskelamin,
        CASE WHEN alm.alamatlengkap IS NULL THEN
                '-' ELSE (
                alm.alamatlengkap || ' ' || ds.namadesakelurahan || ' '|| kc.namakecamatan
                || ' ' || kk.namakotakabupaten || ' '  || pro.namapropinsi )
            END AS alamatlengkap,
            alm.alamatlengkap as alamatlengkap2, pg.namalengkap as namadokter,hbs.persyaratan,hbs.nomor2,pg.nippns,
            '$request[noSurat]'|| '/' || case when to_char(now(),'MM') = '01' then 'I' when to_char(now(),'MM') = '02' then 'II'
        when to_char(now(),'MM') = '03' then 'III'
        when to_char(now(),'MM') = '04' then 'IV'
        when to_char(now(),'MM') = '05' then 'V'
        when to_char(now(),'MM') = '06' then 'VI'
        when to_char(now(),'MM') = '07' then 'VII'
        when to_char(now(),'MM') = '08' then 'VIII'
        when to_char(now(),'MM') = '09' then 'IX'
        when to_char(now(),'MM') = '10' then 'X'
        when to_char(now(),'MM') = '11' then 'XI' else 'XII' end || '/' || to_char(now(),'yyyy') || '/' || 'Inst.MCU' as nosurat
            FROM hasilpemeriksaanmcu_t as hbs
        INNER JOIN pasiendaftar_t as pd on pd.norec = hbs.noregistrasifk
        INNER JOIN pasien_m as ps on ps.id = pd.nocmfk
        INNER JOIN jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk
        LEFT JOIN alamat_m AS alm ON alm.nocmfk = ps.id
            left join desakelurahan_m as ds on ds.id=alm.objectdesakelurahanfk
            left join kotakabupaten_m as kk on kk.id=alm.objectkotakabupatenfk
            left join kecamatan_m as kc on kc.id=alm.objectkecamatanfk
            left join propinsi_m as pro on pro.id=alm.objectpropinsifk
        INNER JOIN pegawai_m as pg on pg.id = hbs.pegawaifk
        WHERE hbs.norec = '$request[norec]'
        AND pd.statusenabled = true
        AND hbs.keterangan = 'Surat Keterangan Tidak Hamil'
        ORDER BY hbs.nomor2 DESC
        
        "))->first();
        $pageWidth = 940;

        return view('mcu.hasil-tidak-hamil',
        compact('raw','pageWidth','request'));
    }
    public function cetakForensik(Request $request){
        $raw = collect(DB::select("
        SELECT ps.namapasien,jk.jeniskelamin,ps.tgllahir,ag.agama,ng.namanegara,
        CASE WHEN pdf.pegawailuar1 is not null then 'Pegawai Luar 1' else ' ' end as pgf1,
        CASE WHEN pdf.pegawailuar2 is not null then 'Pegawai Luar 2' else ' ' end as pgf2,
        CASE WHEN pdf.pegawailuar3 is not null then 'Pegawai Luar 3' else ' ' end as pgf3,
        CASE WHEN pdf.pegawaidalam1 is not null then 'Pegawai Dalam 1' else ' ' end as pgf4,
        CASE WHEN pdf.pegawaidalam2 is not null then 'Pegawai Dalam 2' else ' ' end as pgf5,
        CASE WHEN pdf.pegawaidalam3 is not null then 'Pegawai Dalam 3' else ' ' end as pgf6,
        CASE WHEN ps.objectpekerjaanfk is null then '-' else pk.pekerjaan end as pekerjaan,
        CASE WHEN ps.objectpekerjaanfk is null then '-' else pk.pekerjaan end as pekerjaan2
        ,pd.tglregistrasi,
        CASE WHEN alm.alamatlengkap IS NULL THEN
                '-' ELSE (
                alm.alamatlengkap || ' ' || ds.namadesakelurahan || ' '|| kc.namakecamatan
                || ' ' || kk.namakotakabupaten || ' '  || pro.namapropinsi )
            END AS alamatlengkap,ps.tempatlahir, ps.tempatlahir as tempatlahir2, ps.tgllahir as tgllahir2,
            pg1.namalengkap as namalengkap1,pg2.namalengkap as namalengkap2,pg3.namalengkap as namalengkap3,pg4.namalengkap as namalengkap4,pg5.namalengkap as namalengkap5,pg6.namalengkap as namalengkap6,
            pdf.jumlahgigikananatas || pdf.jumlahgigikananbawah || pdf.jumlahgigikiriatas || pdf.jumlahgigikiribawah as jumlahgigitotal, * FROM pemeriksaandokterforensik_t as pdf
        INNER JOIN pasiendaftar_t as pd on pd.norec = pdf.noregistrasifk
        INNER JOIN pasien_m as ps on ps.id = pd.nocmfk
        INNER JOIN jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk
        LEFT JOIN agama_m as ag on ag.id = ps.objectagamafk
        LEFT JOIN negara_m as ng on ng.id = ps.objectnegarafk
        LEFT JOIN pekerjaan_m as pk on pk.id = ps.objectpekerjaanfk
        LEFT JOIN alamat_m AS alm ON alm.nocmfk = ps.id
            left join desakelurahan_m as ds on ds.id=alm.objectdesakelurahanfk
            left join kotakabupaten_m as kk on kk.id=alm.objectkotakabupatenfk
            left join kecamatan_m as kc on kc.id=alm.objectkecamatanfk
            left join propinsi_m as pro on pro.id=alm.objectpropinsifk
        LEFT JOIN pegawai_m as pg1 on pg1.id = pdf.pegawailuar1
        LEFT JOIN pegawai_m as pg2 on pg2.id = pdf.pegawailuar2
        LEFT JOIN pegawai_m as pg3 on pg3.id = pdf.pegawailuar3
        LEFT JOIN pegawai_m as pg4 on pg4.id = pdf.pegawaidalam1
        LEFT JOIN pegawai_m as pg5 on pg5.id = pdf.pegawaidalam2
        LEFT JOIN pegawai_m as pg6 on pg6.id = pdf.pegawaidalam3
        WHERE pdf.norec = '$request[norec]'
        "))->first();

        return view('forensik.hasil-forensik',
        compact('raw','request'));
    }
    public function cetakGambarForensik(Request $request) {
        $raw = collect(DB::select("
        SELECT pdf.foto,pdf.keterangangambar FROM pemeriksaandokterforensik_t as pdf
        WHERE pdf.norec = '$request[norec]'
        "))->first();

        return view('forensik.hasil-gambar',
        compact('raw','request'));
    }
    public function cetakPemeriksaanCovid(Request $request){
        $raw = collect(DB::select("
        SELECT ps.namapasien,ps.tgllahir,pd.norec as norec_pd,jk.jeniskelamin,
        CASE WHEN alm.alamatlengkap IS NULL THEN
                '-' ELSE (
                alm.alamatlengkap || ' ' || ds.namadesakelurahan || ' '|| kc.namakecamatan
                || ' ' || kk.namakotakabupaten || ' '  || pro.namapropinsi )
            END AS alamatlengkap,
            CASE WHEN pg.objectpangkatfk = 37 THEN pt.namaexternal || ' ' || 'NRP .' || ' ' || pg.nrp
            WHEN pg.objectpangkatfk in (14,15) THEN pt.namapangkat || ' ' || 'NIP .' || ' ' || pg.nippns
            WHEN pg.objectpangkatfk = 46 THEN pt.namapangkat || ' ' || 'SIP .' || ' ' || pg.nosip else '-' end as pangkatnrp, case when hbs.nomor2 is not null then hbs.nomor2 else '-' end as nomor3,
            alm.alamatlengkap as alamatlengkap2, pg.namalengkap as namadokter,hbs.persyaratan,hbs.nomor2,hbs.tglcetak,hbs.tinggibadan,hbs.beratbadan,hbs.suhutubuh,hbs.tensidarah,hbs.jenispemeriksaan
            FROM hasilpemeriksaanmcu_t as hbs
        INNER JOIN pasiendaftar_t as pd on pd.norec = hbs.noregistrasifk
        INNER JOIN pasien_m as ps on ps.id = pd.nocmfk
        INNER JOIN jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk
        LEFT JOIN alamat_m AS alm ON alm.nocmfk = ps.id
            left join desakelurahan_m as ds on ds.id=alm.objectdesakelurahanfk
            left join kotakabupaten_m as kk on kk.id=alm.objectkotakabupatenfk
            left join kecamatan_m as kc on kc.id=alm.objectkecamatanfk
            left join propinsi_m as pro on pro.id=alm.objectpropinsifk
        INNER JOIN pegawai_m as pg on pg.id = hbs.pegawaifk
        LEFT JOIN pangkat_m as pt on pt.id = pg.objectpangkatfk
        WHERE hbs.norec = '$request[norec]'
        AND pd.statusenabled = true
        AND hbs.keterangan = 'Surat Hasil Pemeriksaan Covid'
        ORDER BY hbs.nomor2 DESC
        
        "))->first();
        $pageWidth = 940;

        return view('mcu.hasil-pemeriksaan-covid',
        compact('raw','pageWidth','request'));
    }
    public function cetakPemeriksaanCovidLn(Request $request){
        $raw = collect(DB::select("
        SELECT ps.namapasien,ps.tgllahir,pd.norec as norec_pd,jk.jeniskelamin,
        CASE WHEN alm.alamatlengkap IS NULL THEN
                '-' ELSE (
                alm.alamatlengkap || ' ' || ds.namadesakelurahan || ' '|| kc.namakecamatan
                || ' ' || kk.namakotakabupaten || ' '  || pro.namapropinsi )
            END AS alamatlengkap,
            CASE WHEN pg.objectpangkatfk = 37 THEN pt.namaexternal || ' ' || 'NRP .' || ' ' || pg.nrp
            WHEN pg.objectpangkatfk in (14,15) THEN pt.namapangkat || ' ' || 'NIP .' || ' ' || pg.nippns
            WHEN pg.objectpangkatfk = 46 THEN pt.namapangkat || ' ' || 'SIP .' || ' ' || pg.nosip else '-' end as pangkatnrp, case when hbs.nomor2 is not null then hbs.nomor2 else '-' end as nomor3,
            alm.alamatlengkap as alamatlengkap2, pg.namalengkap as namadokter,hbs.nopasspor,'$request[tgldafta]' as tglregistrasi,'$request[tglambil]' as tglambil,pg.nippns
            FROM hasilpemeriksaanmcu_t as hbs
        INNER JOIN pasiendaftar_t as pd on pd.norec = hbs.noregistrasifk
        INNER JOIN pasien_m as ps on ps.id = pd.nocmfk
        INNER JOIN jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk
        LEFT JOIN alamat_m AS alm ON alm.nocmfk = ps.id
            left join desakelurahan_m as ds on ds.id=alm.objectdesakelurahanfk
            left join kotakabupaten_m as kk on kk.id=alm.objectkotakabupatenfk
            left join kecamatan_m as kc on kc.id=alm.objectkecamatanfk
            left join propinsi_m as pro on pro.id=alm.objectpropinsifk
        INNER JOIN pegawai_m as pg on pg.id = hbs.pegawaifk
        LEFT JOIN pangkat_m as pt on pt.id = pg.objectpangkatfk
        WHERE hbs.norec = '$request[norec]'
        AND pd.statusenabled = true
        AND hbs.keterangan = 'Surat Hasil Pemeriksaan Covid Luar Negeri'
        ORDER BY hbs.nomor2 DESC
        
        "))->first();
        $pageWidth = 940;

        return view('mcu.hasil-pemeriksaan-covid-ln',
        compact('raw','pageWidth','request'));
    }
    public function cetakKllVisum(Request $request) {
        $raw = collect(DB::select("
        select 'a/n : ' || ps.namapasien as namapasien,ps.namapasien as namapasien2, ps.tempatlahir || ', ' || convert(varchar, ps.tgllahir, 105) as ttl, jk.jeniskelamin, neg.namanegara, ag.agama, pk.pekerjaan,
        case when al.alamatlengkap is null then '-' else al.alamatlengkap || ' ' || al.namadesakelurahan || ' ' || al.namakecamatan || ' ' || al.namakotakabupaten || ' ' || pro.namapropinsi end as alamat,
        pv.nosurat, pv.kllvisum , pg.namalengkap as dokter, pg2.namalengkap as dokterkonsultan, pv.permintaan, pv.nosuratpermintaan, pv.tglpermintaan from pasienvisum_t as pv inner join
        pasiendaftar_t as pd on pd.norec = pv.noregistrasifk inner join
        pasien_m as ps on ps.id = pd.nocmfk inner join
        jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk inner join
        negara_m as neg on neg.id = ps.objectnegarafk inner join
        agama_m as ag on ag.id = ps.objectagamafk inner join
        pekerjaan_m as pk on pk.id = ps.objectpekerjaanfk left join
        alamat_m as al on al.nocmfk = pd.nocmfk inner join
        propinsi_m as pro on pro.id = al.objectpropinsifk left join
        pegawai_m as pg on pg.id = pv.dokterfk left join
        pegawai_m as pg2 on pg2.id = pv.dokterkonsultanfk
        where pd.noregistrasi = '$request[noregistrasi]'
        "))->first();

        return view('visum.kll',
        compact('raw','request'));
    }
    public function cetakKllVisumKoreksiII(Request $request) {
        $raw = collect(DB::select("
        select 'a/n : ' || ps.namapasien as namapasien,ps.namapasien as namapasien2, ps.tempatlahir || ', ' || convert(varchar, ps.tgllahir, 105) as ttl, jk.jeniskelamin, neg.namanegara, ag.agama, pk.pekerjaan,
        case when al.alamatlengkap is null then '-' else al.alamatlengkap || ' ' || al.namadesakelurahan || ' ' || al.namakecamatan || ' ' || al.namakotakabupaten || ' ' || pro.namapropinsi end as alamat,
        pv.nosurat, pv.kllvisum2 , pg.namalengkap as dokter, pg2.namalengkap as dokterkonsultan, pv.permintaan, pv.nosuratpermintaan, pv.tglpermintaan from pasienvisum_t as pv inner join
        pasiendaftar_t as pd on pd.norec = pv.noregistrasifk inner join
        pasien_m as ps on ps.id = pd.nocmfk inner join
        jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk inner join
        negara_m as neg on neg.id = ps.objectnegarafk inner join
        agama_m as ag on ag.id = ps.objectagamafk inner join
        pekerjaan_m as pk on pk.id = ps.objectpekerjaanfk left join
        alamat_m as al on al.nocmfk = pd.nocmfk inner join
        propinsi_m as pro on pro.id = al.objectpropinsifk left join
        pegawai_m as pg on pg.id = pv.dokterfk left join
        pegawai_m as pg2 on pg2.id = pv.dokterkonsultanfk
        where pd.noregistrasi = '$request[noregistrasi]'
        "))->first();

        return view('visum.kll-koreksi-ii',
        compact('raw','request'));
    }
    public function cetakKllVisumKoreksiSpesialis(Request $request) {
        $raw = collect(DB::select("
        select 'a/n : ' || ps.namapasien as namapasien,ps.namapasien as namapasien2, ps.tempatlahir || ', ' || convert(varchar, ps.tgllahir, 105) as ttl, jk.jeniskelamin, neg.namanegara, ag.agama, pk.pekerjaan,
        case when al.alamatlengkap is null then '-' else al.alamatlengkap || ' ' || al.namadesakelurahan || ' ' || al.namakecamatan || ' ' || al.namakotakabupaten || ' ' || pro.namapropinsi end as alamat,
        pv.nosurat, pv.kllvisum3 , pg.namalengkap as dokter, pg2.namalengkap as dokterkonsultan, pv.permintaan, pv.nosuratpermintaan, pv.tglpermintaan from pasienvisum_t as pv inner join
        pasiendaftar_t as pd on pd.norec = pv.noregistrasifk inner join
        pasien_m as ps on ps.id = pd.nocmfk inner join
        jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk inner join
        negara_m as neg on neg.id = ps.objectnegarafk inner join
        agama_m as ag on ag.id = ps.objectagamafk inner join
        pekerjaan_m as pk on pk.id = ps.objectpekerjaanfk left join
        alamat_m as al on al.nocmfk = pd.nocmfk inner join
        propinsi_m as pro on pro.id = al.objectpropinsifk left join
        pegawai_m as pg on pg.id = pv.dokterfk left join
        pegawai_m as pg2 on pg2.id = pv.dokterkonsultanfk
        where pd.noregistrasi = '$request[noregistrasi]'
        "))->first();

        return view('visum.kll-koreksi-spesialis',
        compact('raw','request'));
    }
    public function cetakKllVisumKoreksiInstalasi(Request $request) {
        $raw = collect(DB::select("
        select 'a/n : ' || ps.namapasien as namapasien,ps.namapasien as namapasien2, ps.tempatlahir || ', ' || convert(varchar, ps.tgllahir, 105) as ttl, jk.jeniskelamin, neg.namanegara, ag.agama, pk.pekerjaan,
        case when al.alamatlengkap is null then '-' else al.alamatlengkap || ' ' || al.namadesakelurahan || ' ' || al.namakecamatan || ' ' || al.namakotakabupaten || ' ' || pro.namapropinsi end as alamat,
        pv.nosurat, pv.kllvisum4 , pg.namalengkap as dokter, pg2.namalengkap as dokterkonsultan, pv.permintaan, pv.nosuratpermintaan, pv.tglpermintaan from pasienvisum_t as pv inner join
        pasiendaftar_t as pd on pd.norec = pv.noregistrasifk inner join
        pasien_m as ps on ps.id = pd.nocmfk inner join
        jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk inner join
        negara_m as neg on neg.id = ps.objectnegarafk inner join
        agama_m as ag on ag.id = ps.objectagamafk inner join
        pekerjaan_m as pk on pk.id = ps.objectpekerjaanfk left join
        alamat_m as al on al.nocmfk = pd.nocmfk inner join
        propinsi_m as pro on pro.id = al.objectpropinsifk left join
        pegawai_m as pg on pg.id = pv.dokterfk left join
        pegawai_m as pg2 on pg2.id = pv.dokterkonsultanfk
        where pd.noregistrasi = '$request[noregistrasi]'
        "))->first();

        return view('visum.kll-koreksi-instalasi',
        compact('raw','request'));
    }
    public function cetakKllVisum2(Request $request) {
        $raw = collect(DB::select("
        select 'a/n : ' || ps.namapasien as namapasien,ps.namapasien as namapasien2, ps.tempatlahir || ', ' || convert(varchar, ps.tgllahir, 105) as ttl, jk.jeniskelamin, neg.namanegara, ag.agama, pk.pekerjaan,
        case when al.alamatlengkap is null then '-' else al.alamatlengkap || ' ' || al.namadesakelurahan || ' ' || al.namakecamatan || ' ' || al.namakotakabupaten || ' ' || pro.namapropinsi end as alamat,
        pv.nosurat, pv.kllprint , pg.namalengkap as dokter, pg2.namalengkap as dokterkonsultan, pv.permintaan, pv.nosuratpermintaan, pv.tglpermintaan, 
		case when pv.dokterkonsultanfk is not null and pv.dokterkonsultan2fk is null and pv.dokterkonsultan3fk is null then 'dan diketahui oleh ' || pg2.namalengkap || 'sebagai konsultan forensik'
		when pv.dokterkonsultanfk is not null and pv.dokterkonsultan2fk is not null and pv.dokterkonsultan3fk is null then 'dan diketahui oleh ' || pg2.namalengkap || ', ' || pg3.namalengkap || 'sebagai konsultan forensik'
		when pv.dokterkonsultanfk is not null and pv.dokterkonsultan2fk is not null and pv.dokterkonsultan3fk is not null then 'dan diketahui oleh ' || pg2.namalengkap || ', ' || pg3.namalengkap || ', ' || pg4.namalengkap || 'sebagai konsultan forensik' else '' end as formatkonsultan,
		case when pg2.namalengkap is not null then 'Mengetahui :' else '' end as mengetahuikonsulen, case when pg2.namalengkap is not null then '2. Dokter Konsulen' else '' end as formatkonsulen, case when pg2.namalengkap is not null then pg2.namalengkap else '' end as konsulen,
		case when pg3.namalengkap is not null then '3. Dokter Konsulen' else '' end as formatkonsulen2, case when pg3.namalengkap is not null then pg3.namalengkap else '' end as konsulen2,
		case when pg4.namalengkap is not null then '4. Dokter Konsulen' else '' end as formatkonsulen3, case when pg4.namalengkap is not null then pg4.namalengkap else '' end as konsulen3
		from pasienvisum_t as pv inner join
        pasiendaftar_t as pd on pd.norec = pv.noregistrasifk inner join
        pasien_m as ps on ps.id = pd.nocmfk inner join
        jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk inner join
        negara_m as neg on neg.id = ps.objectnegarafk inner join
        agama_m as ag on ag.id = ps.objectagamafk inner join
        pekerjaan_m as pk on pk.id = ps.objectpekerjaanfk left join
        alamat_m as al on al.nocmfk = pd.nocmfk inner join
        propinsi_m as pro on pro.id = al.objectpropinsifk left join
        pegawai_m as pg on pg.id = pv.dokterfk left join
        pegawai_m as pg2 on pg2.id = pv.dokterkonsultanfk left join
        pegawai_m as pg3 on pg3.id = pv.dokterkonsultan2fk left join
        pegawai_m as pg4 on pg4.id = pv.dokterkonsultan3fk
        where pd.noregistrasi = '$request[noregistrasi]'
        "))->first();

        return view('visum.kll-visum',
        compact('raw','request'));
    }
    public function cetakKfdVisum(Request $request) {
        $raw = collect(DB::select("
        select 'a/n : ' || ps.namapasien as namapasien,ps.namapasien as namapasien2, ps.tempatlahir || ', ' || convert(varchar, ps.tgllahir, 105) as ttl, jk.jeniskelamin, neg.namanegara, ag.agama, pk.pekerjaan,
        case when al.alamatlengkap is null then '-' else al.alamatlengkap || ' ' || al.namadesakelurahan || ' ' || al.namakecamatan || ' ' || al.namakotakabupaten || ' ' || pro.namapropinsi end as alamat,
        pv.nosurat, pv.kllvisum , pg.namalengkap as dokter, pg2.namalengkap as dokterkonsultan, pv.permintaan, pv.nosuratpermintaan, pv.tglpermintaan, case when pv.dokterkonsultanfk is not null then 'dan diketahui oleh ' || pg2.namalengkap else '' end as dokterkonsultan from pasienvisum_t as pv inner join
        pasiendaftar_t as pd on pd.norec = pv.noregistrasifk inner join
        pasien_m as ps on ps.id = pd.nocmfk inner join
        jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk inner join
        negara_m as neg on neg.id = ps.objectnegarafk inner join
        agama_m as ag on ag.id = ps.objectagamafk inner join
        pekerjaan_m as pk on pk.id = ps.objectpekerjaanfk left join
        alamat_m as al on al.nocmfk = pd.nocmfk inner join
        propinsi_m as pro on pro.id = al.objectpropinsifk left join
        pegawai_m as pg on pg.id = pv.dokterfk left join
        pegawai_m as pg2 on pg2.id = pv.dokterkonsultanfk
        where pd.noregistrasi = '$request[noregistrasi]'
        "))->first();

        return view('visum.kfd',
        compact('raw','request'));
    }
    public function cetakKfdVisumKoreksiII(Request $request) {
        $raw = collect(DB::select("
        select 'a/n : ' || ps.namapasien as namapasien,ps.namapasien as namapasien2, ps.tempatlahir || ', ' || convert(varchar, ps.tgllahir, 105) as ttl, jk.jeniskelamin, neg.namanegara, ag.agama, pk.pekerjaan,
        case when al.alamatlengkap is null then '-' else al.alamatlengkap || ' ' || al.namadesakelurahan || ' ' || al.namakecamatan || ' ' || al.namakotakabupaten || ' ' || pro.namapropinsi end as alamat,
        pv.nosurat, pv.kllvisum2 , pg.namalengkap as dokter, pg2.namalengkap as dokterkonsultan, pv.permintaan, pv.nosuratpermintaan, pv.tglpermintaan, case when pv.dokterkonsultanfk is not null then 'dan diketahui oleh ' || pg2.namalengkap else '' end as dokterkonsultan from pasienvisum_t as pv inner join
        pasiendaftar_t as pd on pd.norec = pv.noregistrasifk inner join
        pasien_m as ps on ps.id = pd.nocmfk inner join
        jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk inner join
        negara_m as neg on neg.id = ps.objectnegarafk inner join
        agama_m as ag on ag.id = ps.objectagamafk inner join
        pekerjaan_m as pk on pk.id = ps.objectpekerjaanfk left join
        alamat_m as al on al.nocmfk = pd.nocmfk inner join
        propinsi_m as pro on pro.id = al.objectpropinsifk left join
        pegawai_m as pg on pg.id = pv.dokterfk left join
        pegawai_m as pg2 on pg2.id = pv.dokterkonsultanfk
        where pd.noregistrasi = '$request[noregistrasi]'
        "))->first();

        return view('visum.kfd-koreksi-ii',
        compact('raw','request'));
    }
    public function cetakKfdVisumKoreksiSpesialis(Request $request) {
        $raw = collect(DB::select("
        select 'a/n : ' || ps.namapasien as namapasien,ps.namapasien as namapasien2, ps.tempatlahir || ', ' || convert(varchar, ps.tgllahir, 105) as ttl, jk.jeniskelamin, neg.namanegara, ag.agama, pk.pekerjaan,
        case when al.alamatlengkap is null then '-' else al.alamatlengkap || ' ' || al.namadesakelurahan || ' ' || al.namakecamatan || ' ' || al.namakotakabupaten || ' ' || pro.namapropinsi end as alamat,
        pv.nosurat, pv.kllvisum3 , pg.namalengkap as dokter, pg2.namalengkap as dokterkonsultan, pv.permintaan, pv.nosuratpermintaan, pv.tglpermintaan, case when pv.dokterkonsultanfk is not null then 'dan diketahui oleh ' || pg2.namalengkap else '' end as dokterkonsultan from pasienvisum_t as pv inner join
        pasiendaftar_t as pd on pd.norec = pv.noregistrasifk inner join
        pasien_m as ps on ps.id = pd.nocmfk inner join
        jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk inner join
        negara_m as neg on neg.id = ps.objectnegarafk inner join
        agama_m as ag on ag.id = ps.objectagamafk inner join
        pekerjaan_m as pk on pk.id = ps.objectpekerjaanfk left join
        alamat_m as al on al.nocmfk = pd.nocmfk inner join
        propinsi_m as pro on pro.id = al.objectpropinsifk left join
        pegawai_m as pg on pg.id = pv.dokterfk left join
        pegawai_m as pg2 on pg2.id = pv.dokterkonsultanfk
        where pd.noregistrasi = '$request[noregistrasi]'
        "))->first();

        return view('visum.kfd-koreksi-spesialis',
        compact('raw','request'));
    }
    public function cetakKfdVisumKoreksiInstalasi(Request $request) {
        $raw = collect(DB::select("
        select 'a/n : ' || ps.namapasien as namapasien,ps.namapasien as namapasien2, ps.tempatlahir || ', ' || convert(varchar, ps.tgllahir, 105) as ttl, jk.jeniskelamin, neg.namanegara, ag.agama, pk.pekerjaan,
        case when al.alamatlengkap is null then '-' else al.alamatlengkap || ' ' || al.namadesakelurahan || ' ' || al.namakecamatan || ' ' || al.namakotakabupaten || ' ' || pro.namapropinsi end as alamat,
        pv.nosurat, pv.kllvisum4 , pg.namalengkap as dokter, pg2.namalengkap as dokterkonsultan, pv.permintaan, pv.nosuratpermintaan, pv.tglpermintaan, case when pv.dokterkonsultanfk is not null then 'dan diketahui oleh ' || pg2.namalengkap else '' end as dokterkonsultan from pasienvisum_t as pv inner join
        pasiendaftar_t as pd on pd.norec = pv.noregistrasifk inner join
        pasien_m as ps on ps.id = pd.nocmfk inner join
        jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk inner join
        negara_m as neg on neg.id = ps.objectnegarafk inner join
        agama_m as ag on ag.id = ps.objectagamafk inner join
        pekerjaan_m as pk on pk.id = ps.objectpekerjaanfk left join
        alamat_m as al on al.nocmfk = pd.nocmfk inner join
        propinsi_m as pro on pro.id = al.objectpropinsifk left join
        pegawai_m as pg on pg.id = pv.dokterfk left join
        pegawai_m as pg2 on pg2.id = pv.dokterkonsultanfk
        where pd.noregistrasi = '$request[noregistrasi]'
        "))->first();

        return view('visum.kfd-koreksi-instalasi',
        compact('raw','request'));
    }
    public function cetakKfdVisum2(Request $request) {
        $raw = collect(DB::select("
        select 'a/n : ' || ps.namapasien as namapasien,ps.namapasien as namapasien2, ps.tempatlahir || ', ' || convert(varchar, ps.tgllahir, 105) as ttl, jk.jeniskelamin, neg.namanegara, ag.agama, pk.pekerjaan,
        case when al.alamatlengkap is null then '-' else al.alamatlengkap || ' ' || al.namadesakelurahan || ' ' || al.namakecamatan || ' ' || al.namakotakabupaten || ' ' || pro.namapropinsi end as alamat,
        pv.nosurat, pv.kllprint , pg.namalengkap as dokter, pg2.namalengkap as dokterkonsultan, pv.permintaan, pv.nosuratpermintaan, pv.tglpermintaan, 
		case when pv.dokterkonsultanfk is not null and pv.dokterkonsultan2fk is null and pv.dokterkonsultan3fk is null then 'dan diketahui oleh ' || pg2.namalengkap || 'sebagai konsultan forensik'
		when pv.dokterkonsultanfk is not null and pv.dokterkonsultan2fk is not null and pv.dokterkonsultan3fk is null then 'dan diketahui oleh ' || pg2.namalengkap || ', ' || pg3.namalengkap || 'sebagai konsultan forensik'
		when pv.dokterkonsultanfk is not null and pv.dokterkonsultan2fk is not null and pv.dokterkonsultan3fk is not null then 'dan diketahui oleh ' || pg2.namalengkap || ', ' || pg3.namalengkap || ', ' || pg4.namalengkap || 'sebagai konsultan forensik' else '' end as formatkonsultan,
		case when pg2.namalengkap is not null then 'Mengetahui :' else '' end as mengetahuikonsulen, case when pg2.namalengkap is not null then '2. Dokter Konsulen' else '' end as formatkonsulen, case when pg2.namalengkap is not null then pg2.namalengkap else '' end as konsulen,
		case when pg3.namalengkap is not null then '3. Dokter Konsulen' else '' end as formatkonsulen2, case when pg3.namalengkap is not null then pg3.namalengkap else '' end as konsulen2,
		case when pg4.namalengkap is not null then '4. Dokter Konsulen' else '' end as formatkonsulen3, case when pg4.namalengkap is not null then pg4.namalengkap else '' end as konsulen3
		from pasienvisum_t as pv inner join
        pasiendaftar_t as pd on pd.norec = pv.noregistrasifk inner join
        pasien_m as ps on ps.id = pd.nocmfk inner join
        jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk inner join
        negara_m as neg on neg.id = ps.objectnegarafk inner join
        agama_m as ag on ag.id = ps.objectagamafk inner join
        pekerjaan_m as pk on pk.id = ps.objectpekerjaanfk left join
        alamat_m as al on al.nocmfk = pd.nocmfk inner join
        propinsi_m as pro on pro.id = al.objectpropinsifk left join
        pegawai_m as pg on pg.id = pv.dokterfk left join
        pegawai_m as pg2 on pg2.id = pv.dokterkonsultanfk left join
        pegawai_m as pg3 on pg3.id = pv.dokterkonsultan2fk left join
        pegawai_m as pg4 on pg4.id = pv.dokterkonsultan3fk
        where pd.noregistrasi = '$request[noregistrasi]'
        "))->first();

        return view('visum.kfd-visum',
        compact('raw','request'));
    }
    public function cetakKsdVisum(Request $request) {
        $raw = collect(DB::select("
        select 'a/n : ' || ps.namapasien as namapasien,ps.namapasien as namapasien2, ps.tempatlahir || ', ' || convert(varchar, ps.tgllahir, 105) as ttl, jk.jeniskelamin, neg.namanegara, ag.agama, pk.pekerjaan,
        case when al.alamatlengkap is null then '-' else al.alamatlengkap || ' ' || al.namadesakelurahan || ' ' || al.namakecamatan || ' ' || al.namakotakabupaten || ' ' || pro.namapropinsi end as alamat,
        pv.nosurat, pv.kllvisum , pg.namalengkap as dokter, pg2.namalengkap as dokterkonsultan, pv.permintaan, pv.nosuratpermintaan, pv.tglpermintaan, case when pv.dokterkonsultanfk is not null then 'dan diketahui oleh ' || pg2.namalengkap || ' sebagai konsultan forensik' else '' end as dokterkonsultan from pasienvisum_t as pv inner join
        pasiendaftar_t as pd on pd.norec = pv.noregistrasifk inner join
        pasien_m as ps on ps.id = pd.nocmfk inner join
        jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk inner join
        negara_m as neg on neg.id = ps.objectnegarafk inner join
        agama_m as ag on ag.id = ps.objectagamafk inner join
        pekerjaan_m as pk on pk.id = ps.objectpekerjaanfk left join
        alamat_m as al on al.nocmfk = pd.nocmfk inner join
        propinsi_m as pro on pro.id = al.objectpropinsifk left join
        pegawai_m as pg on pg.id = pv.dokterfk left join
        pegawai_m as pg2 on pg2.id = pv.dokterkonsultanfk
        where pd.noregistrasi = '$request[noregistrasi]'
        "))->first();

        return view('visum.ksd',
        compact('raw','request'));
    }
    public function cetakKsdVisumKoreksiII(Request $request) {
        $raw = collect(DB::select("
        select 'a/n : ' || ps.namapasien as namapasien,ps.namapasien as namapasien2, ps.tempatlahir || ', ' || convert(varchar, ps.tgllahir, 105) as ttl, jk.jeniskelamin, neg.namanegara, ag.agama, pk.pekerjaan,
        case when al.alamatlengkap is null then '-' else al.alamatlengkap || ' ' || al.namadesakelurahan || ' ' || al.namakecamatan || ' ' || al.namakotakabupaten || ' ' || pro.namapropinsi end as alamat,
        pv.nosurat, pv.kllvisum2 , pg.namalengkap as dokter, pg2.namalengkap as dokterkonsultan, pv.permintaan, pv.nosuratpermintaan, pv.tglpermintaan, case when pv.dokterkonsultanfk is not null then 'dan diketahui oleh ' || pg2.namalengkap else '' end as dokterkonsultan from pasienvisum_t as pv inner join
        pasiendaftar_t as pd on pd.norec = pv.noregistrasifk inner join
        pasien_m as ps on ps.id = pd.nocmfk inner join
        jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk inner join
        negara_m as neg on neg.id = ps.objectnegarafk inner join
        agama_m as ag on ag.id = ps.objectagamafk inner join
        pekerjaan_m as pk on pk.id = ps.objectpekerjaanfk left join
        alamat_m as al on al.nocmfk = pd.nocmfk inner join
        propinsi_m as pro on pro.id = al.objectpropinsifk left join
        pegawai_m as pg on pg.id = pv.dokterfk left join
        pegawai_m as pg2 on pg2.id = pv.dokterkonsultanfk
        where pd.noregistrasi = '$request[noregistrasi]'
        "))->first();

        return view('visum.ksd-koreksi-ii',
        compact('raw','request'));
    }
    public function cetakKsdVisumKoreksiSpesialis(Request $request) {
        $raw = collect(DB::select("
        select 'a/n : ' || ps.namapasien as namapasien,ps.namapasien as namapasien2, ps.tempatlahir || ', ' || convert(varchar, ps.tgllahir, 105) as ttl, jk.jeniskelamin, neg.namanegara, ag.agama, pk.pekerjaan,
        case when al.alamatlengkap is null then '-' else al.alamatlengkap || ' ' || al.namadesakelurahan || ' ' || al.namakecamatan || ' ' || al.namakotakabupaten || ' ' || pro.namapropinsi end as alamat,
        pv.nosurat, pv.kllvisum3 , pg.namalengkap as dokter, pg2.namalengkap as dokterkonsultan, pv.permintaan, pv.nosuratpermintaan, pv.tglpermintaan, case when pv.dokterkonsultanfk is not null then 'dan diketahui oleh ' || pg2.namalengkap else '' end as dokterkonsultan from pasienvisum_t as pv inner join
        pasiendaftar_t as pd on pd.norec = pv.noregistrasifk inner join
        pasien_m as ps on ps.id = pd.nocmfk inner join
        jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk inner join
        negara_m as neg on neg.id = ps.objectnegarafk inner join
        agama_m as ag on ag.id = ps.objectagamafk inner join
        pekerjaan_m as pk on pk.id = ps.objectpekerjaanfk left join
        alamat_m as al on al.nocmfk = pd.nocmfk inner join
        propinsi_m as pro on pro.id = al.objectpropinsifk left join
        pegawai_m as pg on pg.id = pv.dokterfk left join
        pegawai_m as pg2 on pg2.id = pv.dokterkonsultanfk
        where pd.noregistrasi = '$request[noregistrasi]'
        "))->first();

        return view('visum.ksd-koreksi-spesialis',
        compact('raw','request'));
    }
    public function cetakKsdVisumKoreksiInstalasi(Request $request) {
        $raw = collect(DB::select("
        select 'a/n : ' || ps.namapasien as namapasien,ps.namapasien as namapasien2, ps.tempatlahir || ', ' || convert(varchar, ps.tgllahir, 105) as ttl, jk.jeniskelamin, neg.namanegara, ag.agama, pk.pekerjaan,
        case when al.alamatlengkap is null then '-' else al.alamatlengkap || ' ' || al.namadesakelurahan || ' ' || al.namakecamatan || ' ' || al.namakotakabupaten || ' ' || pro.namapropinsi end as alamat,
        pv.nosurat, pv.kllvisum4 , pg.namalengkap as dokter, pg2.namalengkap as dokterkonsultan, pv.permintaan, pv.nosuratpermintaan, pv.tglpermintaan, case when pv.dokterkonsultanfk is not null then 'dan diketahui oleh ' || pg2.namalengkap else '' end as dokterkonsultan from pasienvisum_t as pv inner join
        pasiendaftar_t as pd on pd.norec = pv.noregistrasifk inner join
        pasien_m as ps on ps.id = pd.nocmfk inner join
        jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk inner join
        negara_m as neg on neg.id = ps.objectnegarafk inner join
        agama_m as ag on ag.id = ps.objectagamafk inner join
        pekerjaan_m as pk on pk.id = ps.objectpekerjaanfk left join
        alamat_m as al on al.nocmfk = pd.nocmfk inner join
        propinsi_m as pro on pro.id = al.objectpropinsifk left join
        pegawai_m as pg on pg.id = pv.dokterfk left join
        pegawai_m as pg2 on pg2.id = pv.dokterkonsultanfk
        where pd.noregistrasi = '$request[noregistrasi]'
        "))->first();

        return view('visum.ksd-koreksi-instalasi',
        compact('raw','request'));
    }
    public function cetakKsdVisum2(Request $request) {
        $raw = collect(DB::select("
        select 'a/n : ' || ps.namapasien as namapasien,ps.namapasien as namapasien2, ps.tempatlahir || ', ' || convert(varchar, ps.tgllahir, 105) as ttl, jk.jeniskelamin, neg.namanegara, ag.agama, pk.pekerjaan,
        case when al.alamatlengkap is null then '-' else al.alamatlengkap || ' ' || al.namadesakelurahan || ' ' || al.namakecamatan || ' ' || al.namakotakabupaten || ' ' || pro.namapropinsi end as alamat,
        pv.nosurat, pv.kllprint , pg.namalengkap as dokter, pg2.namalengkap as dokterkonsultan, pv.permintaan, pv.nosuratpermintaan, pv.tglpermintaan, 
		case when pv.dokterkonsultanfk is not null and pv.dokterkonsultan2fk is null and pv.dokterkonsultan3fk is null then 'dan diketahui oleh ' || pg2.namalengkap || 'sebagai konsultan forensik'
		when pv.dokterkonsultanfk is not null and pv.dokterkonsultan2fk is not null and pv.dokterkonsultan3fk is null then 'dan diketahui oleh ' || pg2.namalengkap || ', ' || pg3.namalengkap || 'sebagai konsultan forensik'
		when pv.dokterkonsultanfk is not null and pv.dokterkonsultan2fk is not null and pv.dokterkonsultan3fk is not null then 'dan diketahui oleh ' || pg2.namalengkap || ', ' || pg3.namalengkap || ', ' || pg4.namalengkap + 'sebagai konsultan forensik' else '' end as formatkonsultan,
		case when pg2.namalengkap is not null then 'Mengetahui :' else '' end as mengetahuikonsulen, case when pg2.namalengkap is not null then '2. Dokter Konsulen' else '' end as formatkonsulen, case when pg2.namalengkap is not null then pg2.namalengkap else '' end as konsulen,
		case when pg3.namalengkap is not null then '3. Dokter Konsulen' else '' end as formatkonsulen2, case when pg3.namalengkap is not null then pg3.namalengkap else '' end as konsulen2,
		case when pg4.namalengkap is not null then '4. Dokter Konsulen' else '' end as formatkonsulen3, case when pg4.namalengkap is not null then pg4.namalengkap else '' end as konsulen3
		from pasienvisum_t as pv inner join
        pasiendaftar_t as pd on pd.norec = pv.noregistrasifk inner join
        pasien_m as ps on ps.id = pd.nocmfk inner join
        jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk inner join
        negara_m as neg on neg.id = ps.objectnegarafk inner join
        agama_m as ag on ag.id = ps.objectagamafk inner join
        pekerjaan_m as pk on pk.id = ps.objectpekerjaanfk left join
        alamat_m as al on al.nocmfk = pd.nocmfk inner join
        propinsi_m as pro on pro.id = al.objectpropinsifk left join
        pegawai_m as pg on pg.id = pv.dokterfk left join
        pegawai_m as pg2 on pg2.id = pv.dokterkonsultanfk left join
        pegawai_m as pg3 on pg3.id = pv.dokterkonsultan2fk left join
        pegawai_m as pg4 on pg4.id = pv.dokterkonsultan3fk
        where pd.noregistrasi = '$request[noregistrasi]'
        "))->first();

        return view('visum.ksd-visum',
        compact('raw','request'));
    }
    public function cetakVisumNew(Request $request) {
        $raw = collect(DB::select("
        select pv.nosurat, pv.tglhasil, pv.nosuratpermintaan, pv.permintaan, pv.tglpermintaan
		from pasienvisum_t as pv inner join
        pasiendaftar_t as pd on pd.norec = pv.noregistrasifk inner join
        pasien_m as ps on ps.id = pd.nocmfk inner join
        jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk inner join
        negara_m as neg on neg.id = ps.objectnegarafk inner join
        agama_m as ag on ag.id = ps.objectagamafk inner join
        pekerjaan_m as pk on pk.id = ps.objectpekerjaanfk left join
        alamat_m as al on al.nocmfk = pd.nocmfk inner join
        propinsi_m as pro on pro.id = al.objectpropinsifk left join
        pegawai_m as pg on pg.id = pv.dokterfk left join
        pegawai_m as pg2 on pg2.id = pv.dokterkonsultanfk left join
        pegawai_m as pg3 on pg3.id = pv.dokterkonsultan2fk left join
        pegawai_m as pg4 on pg4.id = pv.dokterkonsultan3fk
        where pd.noregistrasi = '$request[noregistrasi]'
        "))->first();

        return view('visum.visumnew',
        compact('raw','request'));
    }
    public function cetakTTDAnestesi(Request $r) {
        DB::connection()->setForceWritePdo();
        $emrpasienfk = $r['emrpasienfk'];

        $emrpasiennew_t = DB::table('emrpasien_t')
        ->select('noemr')
        ->where('noemr', $emrpasienfk)
        ->exists();

        if($emrpasiennew_t){
            $data = DB::select(DB::raw("
            SELECT        noemr
            FROM            emrpasien_t
            WHERE        (noemr = '$emrpasienfk') AND (emrfk = '916')
            "));
        } else {
            $data = DB::select(DB::raw("
            SELECT        noemr
            FROM            emrpasien_t
            WHERE        (noemr = '$emrpasienfk') AND (emrfk = '916')
            "));
        }

        
    
        if (!empty($data)) {
            $ambildaridata = $data[0]->noemr;
    
            $qrCodePemeriksa = new QrCode("http://simrs-rspusatpolri.com:9000/service/medifirst2000/report/cetak-ttd-anestesi-2?emrpasienfk=" . $ambildaridata);
            $qrCodePemeriksa2 = $qrCodePemeriksa->writeDataUri();
    
            // Ubah respons menjadi URL gambar
            $imageUrl = 'data:image/png;base64,' . str_replace('data:image/png;base64,', '', $qrCodePemeriksa2);
    
            return $this->respond(['imageUrl' => $imageUrl]);
        } else {
            return $this->respond("Data not found for the given emrpasienfk.");
        }
    }
    public function cetakLaporanTriase(Request $r) {
        DB::connection()->setForceWritePdo();
      //    $kdProfile = (int)$r['kdprofile'];
      $message = '';
      $where = '';
      if (isset($r['idPegawai']) && $r['idPegawai'] != null && $r['idPegawai'] != "") {
          $where = "where pg.id = ". $r['idPegawai'];
      }
      if (isset($r['namaPegawai']) && $r['namaPegawai'] != null && $r['namaPegawai'] != "") {
          $where = "where pg.namalengkap = " ."'".$r['namaPegawai']."'";
      }
      if (isset($r['pesan']) && $r['pesan'] != null && $r['pesan'] != "") {
          $message = $r['pesan'];
      }
         $raw = collect(DB::select("
         select case when pg.nippns is null then '-' else pg.nippns end as nip,namalengkap, jp.jenispegawai, pg.nosip, jk.jeniskelamin, pg.tgllahir, ked.name as statuspegawai,convert(varchar, getdate(), 103) as tglcetak,ttp.tandatangan,case when pt.namapangkat is null then '-' else pt.namapangkat end as namapangkat 
         from pegawai_m as pg left join 
         jenispegawai_m as jp on jp.id = pg.objectjenispegawaifk left join
         jeniskelamin_m as jk on jk.id = pg.objectjeniskelaminfk left join
         sdm_kedudukan_m as ked on ked.id = pg.kedudukanfk left join
         tandatanganppa_t as ttp on ttp.objectpegawaifk = pg.id left join
         pangkat_m as pt on pt.id = pg.objectpangkatfk
         $where
         "))->first();
         if(!empty($raw)){
             $raw->umur = $this->getAge($raw->tgllahir ,date('Y-m-d'));
         }else{
             echo 'Data Tidak ada ';
             return;
         }
         $tglcetak = $r['tglcetak'];  
    
    
         $pageWidth = 950;
         $now =  $this->getDateTime();
    
         return view('report.pdf.ttddokter',
             compact('raw', 'pageWidth','r','now', 'message', 'tglcetak'));
    
     }
     public function cetakTTDAnestesiLokal(Request $r) {
        // DB::connection()->setForceWritePdo();
        $emrpasienfk = $r['emrpasienfk'];

        $emrpasiennew_t = DB::table('emrpasien_t')
        ->select('noemr')
        ->where('noemr', $emrpasienfk)
        ->exists();

        if($emrpasiennew_t){
            $data = DB::select(DB::raw("
            SELECT        noemr
            FROM            emrpasien_t
            WHERE        (noemr = '$emrpasienfk') AND (emrfk = '934')
            "));
        } else {
            $data = DB::select(DB::raw("
            SELECT        noemr
            FROM            emrpasien_t
            WHERE        (noemr = '$emrpasienfk') AND (emrfk = '934')
            "));
        }

        
    
        if (!empty($data)) {
            $ambildaridata = $data[0]->noemr;
    
            $qrCodePemeriksa = new QrCode("https://rsbcianjur.com/service/medifirst2000/report/cetak-ttd-anestesi-lokal-2?emrpasienfk=" . $ambildaridata);
            $qrCodePemeriksa2 = $qrCodePemeriksa->writeDataUri();
    
            // Ubah respons menjadi URL gambar
            $imageUrl = 'data:image/png;base64,' . str_replace('data:image/png;base64,', '', $qrCodePemeriksa2);
    
            return $this->respond(['imageUrl' => $imageUrl]);
        } else {
            return $this->respond("Data not found for the given emrpasienfk.");
        }
    }
    public function cetakTTDAnestesiLokal2(Request $r) {
        // DB::connection()->setForceWritePdo();
        $emrpasienfk = $r['emrpasienfk'];
        $emrpasiennew_t = DB::table('emrpasiennew_t')
        ->select('noemr')
        ->where('noemr', $emrpasienfk)
        ->exists();

        if($emrpasiennew_t){
            $raw = collect(DB::select("
            SELECT        ed.value AS namalengkap2, pg.namalengkap AS namalengkap, sp.statuspegawai, CASE WHEN pg.nip IS NULL THEN pg.nippns ELSE pg.nip END AS nip, ttp.tandatangan, jp.jenispegawai, jk.jeniskelamin, 
                            CASE WHEN pk.namapangkat IS NULL THEN '-' ELSE pk.namapangkat END AS namapangkat,  pg.nosip,FORMAT(ep.tglemr, 'dd MMMM yyyy', 'id-ID') AS tgl,ep.tglemr
   FROM            emrpasien_t AS ep LEFT OUTER JOIN
                            emrpasiend_t AS ed ON ed.emrpasienfk = ep.noemr LEFT OUTER JOIN
                            pegawai_m AS pg ON pg.namalengkap = ed.value LEFT OUTER JOIN
                            jenispegawai_m AS jp ON jp.id = pg.objectjenispegawaifk LEFT OUTER JOIN
                            statuspegawai_m AS sp ON sp.id = pg.objectstatuspegawaifk LEFT OUTER JOIN
                            jeniskelamin_m AS jk ON jk.id = pg.objectjeniskelaminfk LEFT OUTER JOIN
                            pangkat_m AS pk ON pk.id = pg.objectpangkatfk LEFT OUTER JOIN
                            tandatanganppa_t AS ttp ON ttp.objectpegawaifk = pg.id
   WHERE        (ed.emrdfk = '6636') AND (ed.emrfk = '934') AND (ep.noemr = '$emrpasienfk')
            "))->first();
        } else {
            $raw = collect(DB::select("
            SELECT        ed.value AS namalengkap2, pg.namalengkap AS namalengkap, sp.statuspegawai, CASE WHEN pg.nip IS NULL THEN pg.nippns ELSE pg.nip END AS nip, ttp.tandatangan, jp.jenispegawai, jk.jeniskelamin, 
                            CASE WHEN pk.namapangkat IS NULL THEN '-' ELSE pk.namapangkat END AS namapangkat,  pg.nosip,FORMAT(ep.tglemr, 'dd MMMM yyyy', 'id-ID') AS tgl,ep.tglemr
   FROM            emrpasien_t AS ep LEFT OUTER JOIN
                            emrpasiend_t AS ed ON ed.emrpasienfk = ep.noemr LEFT OUTER JOIN
                            pegawai_m AS pg ON pg.namalengkap = ed.value LEFT OUTER JOIN
                            jenispegawai_m AS jp ON jp.id = pg.objectjenispegawaifk LEFT OUTER JOIN
                            statuspegawai_m AS sp ON sp.id = pg.objectstatuspegawaifk LEFT OUTER JOIN
                            jeniskelamin_m AS jk ON jk.id = pg.objectjeniskelaminfk LEFT OUTER JOIN
                            pangkat_m AS pk ON pk.id = pg.objectpangkatfk LEFT OUTER JOIN
                            tandatanganppa_t AS ttp ON ttp.objectpegawaifk = pg.id
   WHERE         (ed.emrdfk = '6636') AND (ed.emrfk = '934') AND (ep.noemr = '$emrpasienfk')
            "))->first();
        }
         
         if(!empty($raw)){
            $raw->umur = $this->getAge($raw->tglemr ,date('Y-m-d'));
        }else{
            echo 'Data Tidak ada ';
            return;
        }
    
        
    
    
         $pageWidth = 950;
    
         return view('report.pdf.ttdanestesi',
             compact('raw', 'pageWidth'));
    
     }

}    