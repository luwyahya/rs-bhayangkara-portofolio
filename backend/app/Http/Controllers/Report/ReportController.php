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
use App\Transaksi\TempKonsulRehab;
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

    use Valet, PelayananPasienTrait;
    public function __construct()
    {
        parent::__construct($skip_authentication = true);
    }
    public function cetakCuti(Request $r)
    {
        $data = \DB::table('planningpegawaistatus_t as pps')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pps.objectpegawaifk')
            ->leftJoin('sdm_jeniscuti_m as jc', 'jc.id', '=', 'pps.objectstatuspegawaiplanfk')
            ->leftJoin('jabatan_m as jb', 'jb.id', '=', 'pg.objectjabatanstrukturalfk')
            ->leftJoin('unitkerja_m as ukp', 'ukp.id', '=', 'pg.objectunitkerjafk')
            ->leftJoin('pangkat_m as pan', 'pan.id', '=', 'pg.objectpangkatfk')
            ->leftJoin('golonganpegawai_m as gol', 'gol.id', '=', 'pan.objectgolonganpegawaifk')
            ->select(
                'pps.norec',
                'pps.noplanning',
                'pps.tglpengajuan',
                'pps.objectpegawaifk',
                'pps.objectstatuspegawaiplanfk',
                'pps.deskripsistatuspegawaiplan as desk',
                'pps.keterangan',
                'pg.namalengkap',
                'jc.name as statuspermohonan',
                'jb.namajabatan',
                'ukp.unitkerja',
                'pps.approvalstatus',
                'pg.nip',
                'pan.namapangkat',
                'gol.golonganpegawai'
            )
            ->where('pps.statusenabled', true)
            ->where('pps.norec', $r['norec'])
            ->first();
        $norec = $data->norec;
        $details = DB::select(DB::raw("select * from listtanggalcuti_t where objectplanningpegawaistatusfk='$norec'"));
        $tglVerif = [];
        foreach ($details as $itmde) {
            if ($itmde->approvalstatus == 4) {
                $tglVerif[] = array(
                    'norec' => $itmde->norec,
                    'tgl' => $itmde->tgl,
                    'approvalstatus' => $itmde->approvalstatus,
                    'objectplanningpegawaistatusfk' => $itmde->objectplanningpegawaistatusfk
                );
            }
        }
        $data->listtanggal = $details;
        $data->listtanggalapprove = $tglVerif;

        $url = $r->fullUrl();
        //           dd($url);
        $config['jabatan'] = 'Direktur Rumah Sakit Jiwa Daerah Surakarta';
        $config['pangkat'] = 'Pembina utama muda';
        $config['nip'] = '196010051986101001';
        $config['direktur'] = 'dr. ENDRO SUPRAYITNO, Sp.Kj, M.Si';
        $config['dibuatdi'] = 'Semarang';
        return view('report.cuti', compact('data', 'url', 'config'));
    }
    public function cetakEkspertise(Request $r)
    {
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
        if (!empty($raw)) {
            $raw->umur = $this->getAge($raw->tgllahir, date('Y-m-d')) . ' / ' . $raw->tgllahir2;
        } else {
            echo 'Data Tidak ada ';
            return;
        }
        // return ($raw);
        $raw2 = collect(DB::select("
            SELECT cetakanke from cetakanke
            WHERE  norec= '$r[norec]'
        "))->first();
        if (empty($raw2)) {
            $inserthistory = DB::insert("insert into  cetakanke values('" . $r['norec'] . "',1,'hasilradiologi_t') ");
            $raw2 = collect(DB::select("
                SELECT cetakanke from cetakanke
                WHERE  norec= '$r[norec]'
            "))->first();
        } else {
            foreach ($raw2 as $key) {

                $cetakanke = $key + 1;
            }
            $inserthistory = DB::update("update cetakanke set  cetakanke = '" . $cetakanke . "' where norec = '" . $r['norec'] . "' ");
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
        return view(
            'report.rad.expertise',
            compact('raw', 'pageWidth', 'r', 'now', 'raw2', 'qrCodePemeriksa2')
        );
    }
    public function cetakTtdFleksibel(Request $r)
    {
        //    $kdProfile = (int)$r['kdprofile'];
        $message = '';
        $where = '';
        $where2 = '';
        if (isset($r['idPegawai']) && $r['idPegawai'] != null && $r['idPegawai'] != "") {
            $where = "where pg.id = " . $r['idPegawai'];
            $where2 = "and pegawaifk =" . $r['idPegawai'];
        }
        if (isset($r['namaPegawai']) && $r['namaPegawai'] != null && $r['namaPegawai'] != "") {
            $where = "where pg.namalengkap = " . "'" . $r['namaPegawai'] . "'";
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
        if (!empty($raw)) {
            $raw->umur = $this->getAge($raw->tgllahir, date('Y-m-d'));
        } else {
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

        return view(
            'report.pdf.ttdfleksibel',
            compact('raw', 'pageWidth', 'r', 'now', 'message', 'tglpulang')
        );
    }
    public function cetakLab(Request $r)
    {
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
        if (!empty($raw)) {
            $raw->umur = $this->getAge($raw->tgllahir, date('Y-m-d'));
        } else {
            echo 'Data Tidak ada ';
            return;
        }




        $pageWidth = 950;
        $now =  $this->getDateTime();

        return view(
            'report.rad.lab',
            compact('raw', 'pageWidth', 'r', 'now')
        );
    }
    public function cetakKematian(Request $r)
    {
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
        if (!empty($raw)) {
            $raw->umur = $this->getAge($raw->tgllahir, date('Y-m-d'));
        } else {
            echo 'Data Tidak ada ';
            return;
        }




        $pageWidth = 950;
        $now =  $this->getDateTime();

        return view(
            'report.rad.kematian',
            compact('raw', 'pageWidth', 'r', 'now')
        );
    }

    public function cetakDokter(Request $r)
    {
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
        if (!empty($raw)) {
            $raw->umur = $this->getAge($raw->tgllahir, date('Y-m-d'));
        } else {
            echo 'Data Tidak ada ';
            return;
        }

        $pageWidth = 950;
        $now =  $this->getDateTime();

        return view(
            'report.pdf.infodokter',
            compact('raw', 'pageWidth', 'r', 'now')
        );
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

    public function doktermenerangkan(Request $r)
    {
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
        if (!empty($raw)) {
            $raw->umur = $this->getAge($raw->tgllahir, date('Y-m-d'));
        } else {
            echo 'Data Tidak ada ';
            return;
        }

        $pageWidth = 950;
        $now =  $this->getDateTime();

        return view(
            'report.pdf.doktermenerangkan',
            compact('raw', 'pageWidth', 'r', 'now')
        );
    }
    public function dokterdiagnosis(Request $r)
    {
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
        if (!empty($raw)) {
            $raw->umur = $this->getAge($raw->tgllahir, date('Y-m-d'));
        } else {
            echo 'Data Tidak ada ';
            return;
        }

        $pageWidth = 950;
        $now =  $this->getDateTime();

        return view(
            'report.pdf.dokterdiagnosis',
            compact('raw', 'pageWidth', 'r', 'now')
        );
    }

    public function cetakPasien(Request $r)
    {
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
        if (!empty($raw)) {
            $raw->umur = $this->getAge($raw->tgllahir, date('Y-m-d'));
        } else {
            echo 'Data Tidak ada ';
            return;
        }




        $pageWidth = 950;
        $now =  $this->getDateTime();

        return view(
            'report.pdf.infopasien',
            compact('raw', 'pageWidth', 'r', 'now')
        );
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
        if (strlen($Noregistrasi) <= 10) {
            $where = "pd.noregistrasi ='" . $Noregistrasi . "'";
        } else {

            $where = "pa.nosep ='" . $Noregistrasi . "'";
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
            'noantrian' => $registrasi->namahafis . '-' . $registrasi->noantrianhafis,
        );
        return view(
            'pendaftaran.sep',
            compact('dataReport', 'pageWidth', 'profile')
        );
        //        return view('','$result');
    }
    public function cekSep($sep)
    {
        // $data = '12098';//$this->getIdConsumerBPJSV2();
        // $secretKey = '8pX68721CC';//$this->getPasswordConsumerBPJSV2();
        $data = $this->getIdConsumerBPJSV2();
        $secretKey = $this->getPasswordConsumerBPJSV2();
        $userKey = $this->getUserKeyVclaimV2();
        // Computes the timestamp
        date_default_timezone_set('UTC');
        $tStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
        // Computes the signature by hashing the salt with the secret key as the key
        $signature = hash_hmac('sha256', $data . "&" . $tStamp, $secretKey, true);

        // base64 encode…
        $encodedSignature = base64_encode($signature);
        // return($this->getUrlBrigdingBPJSV2());
        // die();
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL => $this->getUrlBrigdingBPJSV2() . "SEP/" . $sep,
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
                "X-cons-id: " .  (string)$data,
                "X-signature: " . (string)$encodedSignature,
                "X-timestamp: " . (string)$tStamp,
                "user_key: " . $userKey
            ),
            CURLOPT_SSL_CIPHER_LIST => 'DEFAULT@SECLEVEL=1'
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
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
            'noantrian' => $registrasi->namahafis . '-' . $registrasi->noantrian,
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

    public function cetakBuktiRegistrasiDom(Request $request)
    {
        $kdProfile = (int)$request['kdprofile'];
        $profile = collect(DB::select("
                select * from profile_m where id = $kdProfile limit 1
            "))->first();

        $registrasi = DB::table('pasiendaftar_t AS pd')
            ->Join('antrianpasiendiperiksa_t as apdp', 'apdp.noregistrasifk', '=', 'pd.norec')
            ->Join('pasien_m as ps', 'pd.nocmfk', '=', 'ps.id')
            ->leftJoin('kebangsaan_m as k', 'ps.objectkebangsaanfk', '=', 'k.id')
            ->leftJoin('ruangan_m as ru', 'pd.objectruanganlastfk', '=', 'ru.id')
            ->leftJoin('pegawai_m as pp', 'pd.objectpegawaifk', '=', 'pp.id')
            ->leftJoin('kelompokpasien_m as kp', 'pd.objectkelompokpasienlastfk', '=', 'kp.id')
            ->select(DB::raw("pp.namahafis, pd.noregistrasi, ps.nocm, ps.namapasien, k.name as kebangsaan, pd.tglregistrasi, 
                     ru.namaruangan, pp.namalengkap AS namadokter, kp.kelompokpasien, apdp.noantrian,
                     EXTRACT(year FROM age(pd.tglregistrasi, ps.tgllahir)) || ' thn ' || 
                     EXTRACT(month FROM age(pd.tglregistrasi, ps.tgllahir)) || ' bln ' ||
                     EXTRACT(day FROM age(pd.tglregistrasi, ps.tgllahir)) || ' hr' as umur"))
            ->where('pd.noregistrasi', $request['noregistrasi'])
            ->first();

        if(!$registrasi) {
            return "Data Registrasi Tidak Ditemukan";
        }

        $noantrian = $registrasi->noantrian;
        if(strlen($noantrian) == 1) {
            $noantrian = "00" . $noantrian;
        } else if(strlen($noantrian) == 2) {
            $noantrian = "0" . $noantrian;
        }

        $dataReport = array(
            'namaprofile' => $profile->namalengkap,
            'noregistrasi' => $registrasi->noregistrasi,
            'tglregistrasi' => $registrasi->tglregistrasi,
            'jamregistrasi' => date('H:i:s', strtotime($registrasi->tglregistrasi)),
            'norm' => $registrasi->nocm,
            'namapasien' => $registrasi->namapasien,
            'kebangsaan' => $registrasi->kebangsaan ? $registrasi->kebangsaan : 'WNI',
            'umur' => $registrasi->umur,
            'noantrian' => ($registrasi->namahafis ? $registrasi->namahafis . '-' : '') . $noantrian,
            'namaruangan' => $registrasi->namaruangan,
            'namadokter' => $registrasi->namadokter,
            'kelompokpasien' => $registrasi->kelompokpasien,
        );

        return view('pendaftaran.buktipendaftaran-dom', compact('dataReport', 'profile'));
    }
    public function cetakHispatologi(Request $r)
    {
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
        if (!empty($raw)) {
            $raw->umur = $this->getAge($raw->tgllahir, date('Y-m-d'));
        } else {
            echo 'Data Tidak ada ';
            return;
        }
        //        dd($raw);
        $pageWidth = 950;

        return view(
            'report.lab.hasil-pa',
            compact('raw', 'pageWidth', 'r')
        );
    }
    public function cetakBadanSehat(Request $request)
    {
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

        return view(
            'mcu.hasil-badan-sehat',
            compact('raw', 'request')
        );
    }
    public function cetakBebasNarkoba(Request $request)
    {
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

        return view(
            'mcu.hasil-bebas-narkoba',
            compact('raw', 'request')
        );
    }
    public function cetakKesehatanJiwa(Request $request)
    {
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

        return view(
            'mcu.hasil-kesehatan-jiwa',
            compact('raw', 'pageWidth', 'request')
        );
    }
    public function cetakBebasNarkobav2(Request $request)
    {
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

        return view(
            'mcu.hasil-bebas-narkobav2',
            compact('raw', 'pageWidth', 'request')
        );
    }
    public function cetakBebasPenyakitMenular(Request $request)
    {
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

        return view(
            'mcu.hasil-bebas-penyakit-menular',
            compact('raw', 'pageWidth', 'request')
        );
    }
    public function cetakBebasHIV(Request $request)
    {
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

        return view(
            'mcu.hasil-bebas-hiv',
            compact('raw', 'pageWidth', 'request')
        );
    }
    public function cetakHasilTidakHamil(Request $request)
    {
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

        return view(
            'mcu.hasil-tidak-hamil',
            compact('raw', 'pageWidth', 'request')
        );
    }
    public function cetakForensik(Request $request)
    {
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

        return view(
            'forensik.hasil-forensik',
            compact('raw', 'request')
        );
    }
    public function cetakGambarForensik(Request $request)
    {
        $raw = collect(DB::select("
        SELECT pdf.foto,pdf.keterangangambar FROM pemeriksaandokterforensik_t as pdf
        WHERE pdf.norec = '$request[norec]'
        "))->first();

        return view(
            'forensik.hasil-gambar',
            compact('raw', 'request')
        );
    }
    public function cetakPemeriksaanCovid(Request $request)
    {
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

        return view(
            'mcu.hasil-pemeriksaan-covid',
            compact('raw', 'pageWidth', 'request')
        );
    }
    public function cetakPemeriksaanCovidLn(Request $request)
    {
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

        return view(
            'mcu.hasil-pemeriksaan-covid-ln',
            compact('raw', 'pageWidth', 'request')
        );
    }
    public function cetakKllVisum(Request $request)
    {
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

        return view(
            'visum.kll',
            compact('raw', 'request')
        );
    }
    public function cetakKllVisumKoreksiII(Request $request)
    {
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

        return view(
            'visum.kll-koreksi-ii',
            compact('raw', 'request')
        );
    }
    public function cetakKllVisumKoreksiSpesialis(Request $request)
    {
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

        return view(
            'visum.kll-koreksi-spesialis',
            compact('raw', 'request')
        );
    }
    public function cetakKllVisumKoreksiInstalasi(Request $request)
    {
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

        return view(
            'visum.kll-koreksi-instalasi',
            compact('raw', 'request')
        );
    }
    public function cetakKllVisum2(Request $request)
    {
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

        return view(
            'visum.kll-visum',
            compact('raw', 'request')
        );
    }
    public function cetakKfdVisum(Request $request)
    {
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

        return view(
            'visum.kfd',
            compact('raw', 'request')
        );
    }
    public function cetakKfdVisumKoreksiII(Request $request)
    {
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

        return view(
            'visum.kfd-koreksi-ii',
            compact('raw', 'request')
        );
    }
    public function cetakKfdVisumKoreksiSpesialis(Request $request)
    {
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

        return view(
            'visum.kfd-koreksi-spesialis',
            compact('raw', 'request')
        );
    }
    public function cetakKfdVisumKoreksiInstalasi(Request $request)
    {
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

        return view(
            'visum.kfd-koreksi-instalasi',
            compact('raw', 'request')
        );
    }
    public function cetakKfdVisum2(Request $request)
    {
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

        return view(
            'visum.kfd-visum',
            compact('raw', 'request')
        );
    }
    public function cetakKsdVisum(Request $request)
    {
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

        return view(
            'visum.ksd',
            compact('raw', 'request')
        );
    }
    public function cetakKsdVisumKoreksiII(Request $request)
    {
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

        return view(
            'visum.ksd-koreksi-ii',
            compact('raw', 'request')
        );
    }
    public function cetakKsdVisumKoreksiSpesialis(Request $request)
    {
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

        return view(
            'visum.ksd-koreksi-spesialis',
            compact('raw', 'request')
        );
    }
    public function cetakKsdVisumKoreksiInstalasi(Request $request)
    {
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

        return view(
            'visum.ksd-koreksi-instalasi',
            compact('raw', 'request')
        );
    }
    public function cetakKsdVisum2(Request $request)
    {
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

        return view(
            'visum.ksd-visum',
            compact('raw', 'request')
        );
    }
    public function cetakVisumNew(Request $request)
    {
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

        return view(
            'visum.visumnew',
            compact('raw', 'request')
        );
    }
    public function cetakTTDAnestesi(Request $r)
    {
        DB::connection()->setForceWritePdo();
        $emrpasienfk = $r['emrpasienfk'];

        $emrpasiennew_t = DB::table('emrpasien_t')
            ->select('noemr')
            ->where('noemr', $emrpasienfk)
            ->exists();

        if ($emrpasiennew_t) {
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
    public function cetakLaporanTriase(Request $r)
    {
        DB::connection()->setForceWritePdo();
        //    $kdProfile = (int)$r['kdprofile'];
        $message = '';
        $where = '';
        if (isset($r['idPegawai']) && $r['idPegawai'] != null && $r['idPegawai'] != "") {
            $where = "where pg.id = " . $r['idPegawai'];
        }
        if (isset($r['namaPegawai']) && $r['namaPegawai'] != null && $r['namaPegawai'] != "") {
            $where = "where pg.namalengkap = " . "'" . $r['namaPegawai'] . "'";
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
        if (!empty($raw)) {
            $raw->umur = $this->getAge($raw->tgllahir, date('Y-m-d'));
        } else {
            echo 'Data Tidak ada ';
            return;
        }
        $tglcetak = $r['tglcetak'];


        $pageWidth = 950;
        $now =  $this->getDateTime();

        return view(
            'report.pdf.ttddokter',
            compact('raw', 'pageWidth', 'r', 'now', 'message', 'tglcetak')
        );
    }
    public function cetakTTDAnestesiLokal(Request $r)
    {
        // DB::connection()->setForceWritePdo();
        $emrpasienfk = $r['emrpasienfk'];

        $emrpasiennew_t = DB::table('emrpasien_t')
            ->select('noemr')
            ->where('noemr', (string)$emrpasienfk)
            ->exists();

        // return json_encode($emrpasiennew_t);

        if ($emrpasiennew_t) {
            $data = DB::select(DB::raw("
            SELECT        noemr
            FROM            emrpasien_t
            WHERE        (noemr = '$emrpasienfk') AND (emrfk = '869')
            "));
        } else {
            $data = DB::select(DB::raw("
            SELECT        noemr
            FROM            emrpasien_t
            WHERE        (noemr = '$emrpasienfk') AND (emrfk = '869')
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
    public function cetakTTDAnestesiLokal2(Request $r)
    {
        // DB::connection()->setForceWritePdo();
        $emrpasienfk = $r['emrpasienfk'];
        $emrpasiennew_t = DB::table('emrpasien_t')
            ->select('noemr')
            ->where('noemr', $emrpasienfk)
            ->exists();

        if ($emrpasiennew_t) {
            $raw = collect(DB::select("
            SELECT        ed.value AS namalengkap2, pg.namalengkap AS namalengkap, sp.statuspegawai, CASE WHEN pg.nip IS NULL THEN pg.nippns ELSE pg.nip END AS nip, ttp.tandatangan, jp.jenispegawai, jk.jeniskelamin, 
                            CASE WHEN pk.namapangkat IS NULL THEN '-' ELSE pk.namapangkat END AS namapangkat,  pg.nosip,TO_CHAR(ep.tglemr, 'YYYY-MM-DD') AS tgl,ep.tglemr
   FROM            emrpasien_t AS ep LEFT OUTER JOIN
                            emrpasiend_t AS ed ON ed.emrpasienfk = ep.noemr LEFT OUTER JOIN
                            pegawai_m AS pg ON pg.namalengkap = ed.value LEFT OUTER JOIN
                            jenispegawai_m AS jp ON jp.id = pg.objectjenispegawaifk LEFT OUTER JOIN
                            statuspegawai_m AS sp ON sp.id = pg.objectstatuspegawaifk LEFT OUTER JOIN
                            jeniskelamin_m AS jk ON jk.id = pg.objectjeniskelaminfk LEFT OUTER JOIN
                            pangkat_m AS pk ON pk.id = pg.objectpangkatfk LEFT OUTER JOIN
                            tandatanganppa_t AS ttp ON ttp.objectpegawaifk = pg.id
   WHERE         (ed.emrfk = '869') AND (ep.noemr = '$emrpasienfk')
            "))->first();
        } else {
            $raw = collect(DB::select("
            SELECT        ed.value AS namalengkap2, pg.namalengkap AS namalengkap, sp.statuspegawai, CASE WHEN pg.nip IS NULL THEN pg.nippns ELSE pg.nip END AS nip, ttp.tandatangan, jp.jenispegawai, jk.jeniskelamin, 
                            CASE WHEN pk.namapangkat IS NULL THEN '-' ELSE pk.namapangkat END AS namapangkat,  pg.nosip,TO_CHAR(ep.tglemr, 'YYYY-MM-DD') AS tgl, ,ep.tglemr
   FROM            emrpasien_t AS ep LEFT OUTER JOIN
                            emrpasiend_t AS ed ON ed.emrpasienfk = ep.noemr LEFT OUTER JOIN
                            pegawai_m AS pg ON pg.namalengkap = ed.value LEFT OUTER JOIN
                            jenispegawai_m AS jp ON jp.id = pg.objectjenispegawaifk LEFT OUTER JOIN
                            statuspegawai_m AS sp ON sp.id = pg.objectstatuspegawaifk LEFT OUTER JOIN
                            jeniskelamin_m AS jk ON jk.id = pg.objectjeniskelaminfk LEFT OUTER JOIN
                            pangkat_m AS pk ON pk.id = pg.objectpangkatfk LEFT OUTER JOIN
                            tandatanganppa_t AS ttp ON ttp.objectpegawaifk = pg.id
   WHERE       (ed.emrfk = '934') AND (ep.noemr = '$emrpasienfk')
            "))->first();
        }

        if (!empty($raw)) {
            $raw->umur = $this->getAge($raw->tglemr, date('Y-m-d'));
        } else {
            echo 'Data Tidak ada ';
            return;
        }




        $pageWidth = 950;

        return view(
            'report.pdf.ttdanestesi',
            compact('raw', 'pageWidth')
        );
    }

    public function TescetakSemuaInaCbgDonwload(Request $request)
    {
        set_time_limit(300);
        ini_set('max_execution_time', 300);

        // Disarankan juga menaikkan memory limit karena merge PDF memakan RAM
        ini_set('memory_limit', '512M');
        $noregistrasi = $request['noregistrasi'];
        $norecpd = $request['norecpd'];
        $dokumenallArray = "";

        if (!empty($request['dokumenall'])) {
            //$dokumenallArray=explode(",",$request['dokumenall']);
            //$dokumenallArray = array_unique($dokumenallArray);
            // Langkah 1: Memisahkan string menjadi array
            $array = explode(",", $request['dokumenall']);
            // Langkah 2: Menghapus nilai duplikat dari array
            $array_unique = array_unique($array);
            // Langkah 3: Menggabungkan kembali array menjadi string
            $string_unique = implode(",", $array_unique);
            $dokumenallArray = explode(",", $string_unique);
            // print_r($dokumenallArray); 
        } else $dokumenallArray = "";
        //-- BEGIN -----------------------------
        if (!empty($dokumenallArray)) {
            $xcetaksep = 0;
            $xcetakresumemedis = 0;
            $xcetakbilling = 0;
            $xcetakrekapbilling = 0;
            $xcetaklab = 0;
            $xcetakrad = 0;
            $xcetakkemenkes = 0;
            $xcetakecho = 0;
            $xcetakekg = 0;
            $xcetakpa = 0;
            $xcetakusg = 0;
            $xcetaksurkon = 0;
            $xcetakdoktambahan = 0;
            $xcetakinfasi = 0;
            $xcetaktriase = 0;
            $xcetakhemodialisa = 0;
            $xcetakasesmenrehab = 0;
            $xcetaklaporanoperasi = 0;
            $xcetakspri = 0;
            $xcetakpengkajianigd = 0;
            $xcetakcppt = 0;
            $xcetakmtd = 0;
            $xcetaktf = 0;
            $xcetakcodeblue = 0;
            $xcetakderajatdehidrasi = 0;
            $xcetakewsdewasa = 0;
            $xcetakpendampinganrehab = 0;
            $xcetakpengkajianawalmedisri = 0;
            $xcetakpengkajianawalmedisgizi = 0;
            $xcetakkonsul = 0;

            $arraydok = [];
            $arraydata = [];
            $datjumdok = count($dokumenallArray);
            for ($i = 0; $i < $datjumdok; $i++) {
                if (!empty($dokumenallArray[$i])) {
                    if ($dokumenallArray[$i] == 'cetaksep') $xcetaksep = 1;
                    else if ($dokumenallArray[$i] == 'cetakresumemedis') $xcetakresumemedis = 1;
                    else if ($dokumenallArray[$i] == 'cetakbilling') $xcetakbilling = 1;
                    else if ($dokumenallArray[$i] == 'cetakrekapbilling') $xcetakrekapbilling = 1;
                    else if ($dokumenallArray[$i] == 'cetaklab') $xcetaklab = 1;
                    else if ($dokumenallArray[$i] == 'cetakrad') $xcetakrad = 1;
                    else if ($dokumenallArray[$i] == 'cetakkemenkes') $xcetakkemenkes = 1;
                    else if ($dokumenallArray[$i] == 'cetakecho') $xcetakecho = 1;
                    else if ($dokumenallArray[$i] == 'cetakekg') $xcetakekg = 1;
                    else if ($dokumenallArray[$i] == 'cetakpa') $xcetakpa = 1;
                    else if ($dokumenallArray[$i] == 'cetakusg') $xcetakusg = 1;
                    else if ($dokumenallArray[$i] == 'cetaksurkon') $xcetaksurkon = 1;
                    else if ($dokumenallArray[$i] == 'cetakdoktambahan') $xcetakdoktambahan = 1;
                    else if ($dokumenallArray[$i] == 'cetakinfasi') $xcetakinfasi = 1;
                    else if ($dokumenallArray[$i] == 'cetaktriase') $xcetaktriase = 1;
                    else if ($dokumenallArray[$i] == 'cetakhemodialisa') $xcetakhemodialisa = 1;
                    else if ($dokumenallArray[$i] == 'cetakasesmenrehab') $xcetakasesmenrehab = 1;
                    else if ($dokumenallArray[$i] == 'cetaklaporanoperasi') $xcetaklaporanoperasi = 1;
                    else if ($dokumenallArray[$i] == 'cetakspri') $xcetakspri = 1;
                    else if ($dokumenallArray[$i] == 'cetakpengkajianigd') $xcetakpengkajianigd = 1;
                    else if ($dokumenallArray[$i] == 'cetakcppt') $xcetakcppt = 1;
                    else if ($dokumenallArray[$i] == 'cetakmtd') $xcetakmtd = 1;
                    else if ($dokumenallArray[$i] == 'cetaktf') $xcetaktf = 1;
                    else if ($dokumenallArray[$i] == 'cetakcodeblue') $xcetakcodeblue = 1;
                    else if ($dokumenallArray[$i] == 'cetakderajatdehidrasi') $xcetakderajatdehidrasi = 1;
                    else if ($dokumenallArray[$i] == 'cetakewsdewasa') $xcetakewsdewasa = 1;
                    else if ($dokumenallArray[$i] == 'cetakpendampinganrehab') $xcetakpendampinganrehab = 1;
                    else if ($dokumenallArray[$i] == 'cetakpengkajianawalmedisri') $xcetakpengkajianawalmedisri = 1;
                    else if ($dokumenallArray[$i] == 'cetakpengkajianawalmedisgizi') $xcetakpengkajianawalmedisgizi = 1;
                    else if ($dokumenallArray[$i] == 'cetakkonsul') $xcetakkonsul = 1;
                }
            }
        } else {
            $xcetaksep = 1;
            $xcetakresumemedis = 1;
            $xcetakbilling = 1;
            $xcetakrekapbilling = 1;
            $xcetaklab = 1;
            $xcetakrad = 1;
            $xcetakkemenkes = 1;
            $xcetakecho = 1;
            $xcetakekg = 1;
            $xcetakpa = 1;
            $xcetakusg = 1;
            $xcetaksurkon = 1;
            $xcetakdoktambahan = 1;
            $xcetakinfasi = 1;
            $xcetaktriase = 1;
            $xcetakhemodialisa = 1;
            $xcetakasesmenrehab = 1;
            $xcetaklaporanoperasi = 1;
            $xcetakspri = 1;
            $xcetakpengkajianigd = 1;
            $xcetakcppt = 1;
            $xcetakmtd = 1;
            $xcetaktf = 1;
            $xcetakcodeblue = 1;
            $xcetakderajatdehidrasi = 1;
            $xcetakewsdewasa = 1;
            $xcetakpendampinganrehab = 1;
            $xcetakpengkajianawalmedisri = 1;
            $xcetakpengkajianawalmedisgizi = 1;
            $xcetakkonsul = 1;
        }
        //check table 2024-01-11
        $filesep = '';
        $filebilling = '';
        $filerekapbilling = '';
        $fileresumemedis = '';
        $fileradiologi = '';
        $filelaboratorium = '';
        $filekemenkes = '';
        $fileecho[] = '';
        // $fileekg[] = '';
        // $fileusg = [];
        $fileinfasi[] = '';
        $adaecho = false;
        $checkfile = DB::select(DB::raw("SELECT DISTINCT ON (fp.norec) 
                                            fp.*, 
                                            pd.*, 
                                            d.*
                                        FROM 
                                            filepapj_t AS fp
                                        INNER JOIN 
                                            pasiendaftar_t AS pd ON pd.noregistrasi = fp.noregistrasi
                                        INNER JOIN 
                                            dokumen_t AS d ON d.norec_pd = pd.norec
                                        WHERE 
                                            fp.noregistrasi = '$noregistrasi'
                                            AND d.statusenabled = TRUE
                                        ORDER BY 
                                            fp.norec, d.norec_pd"));
        if (empty($checkfile)) {
            $checkfile = [];
        } else {
            foreach ($checkfile as $chk) {
                // if($xcetaksep) { 
                //     if(!empty($chk->filesep)) {
                //         $xcetaksep = 2;
                //         $filesep = $this->convertHtmlToPdfBase64($chk->filesep);
                //     } 
                // }
                // if($xcetakbilling) { 
                //     if(!empty($chk->filebilling)) {
                //         $xcetakbilling = 2;
                //         $filebilling=$chk->filebilling;
                //     } 
                // }
                // if($xcetakrekapbilling) {             
                //     if(!empty($chk->filerekapbilling)) {
                //         $xcetakrekapbilling = 2;
                //         $filerekapbilling=$chk->filerekapbilling;
                //     } 
                // }
                // if($xcetakresumemedis) { 
                //     if(!empty($chk->fileresumemedis)) {
                //         $xcetakresumemedis = 2;
                //         $fileresumemedis=$chk->fileresumemedis;
                //     } 
                // }
                // if($xcetakrad) { 
                //     if(!empty($chk->fileradiologi)) {
                //         $xcetakrad = 2;
                //         $fileradiologi=$chk->fileradiologi;
                //     } 
                // }
                // if ($xcetaklab) {
                //     if (!empty($chk->filelaboratorium)) {
                //         $xcetaklab = 2;
                //         $filelaboratorium = $chk->filelaboratorium;
                //     }
                // }
                // if($xcetakkemenkes) { 
                //     if(!empty($chk->filekemenkes)) {
                //         $xcetakkemenkes = 2;
                //         $filekemenkes=$chk->filekemenkes;
                //     } 
                // }
                if ($xcetakecho) {
                    if (!empty($chk->fileecho)) {
                        $xcetakecho = 2;
                        $fileecho[] = $chk->fileecho;
                        $adaecho = true;
                    }
                }
                // if ($xcetakekg) {
                //     if (!empty($chk->fileekg)) {
                //         $xcetakekg = 2;
                //         $fileekg[] = $chk->fileekg;
                //     }
                // }
                // if ($xcetakusg) {
                //     if (!empty($chk->fileusg)) {
                //         $xcetakusg = 2;
                //         $fileusg[] = $chk->fileusg;
                //     }
                // }
                if ($xcetakinfasi) {
                    if (!empty($chk->fileinfasi)) {
                        $xcetakinfasi = 2;
                        $fileinfasi[] = $chk->fileinfasi;
                    }
                }
            }
        }
        // $fileecho[] = '';
        $fileusg[] = '';
        $filesurkon[] = '';
        $fileekg[] = '';
        $filepa[] = '';
        $filedoktambahan[] = '';
        $checkfile2 = DB::select(DB::raw("SELECT
                                            d.* 
                                        FROM 
																						dokumen_t AS d
                                        INNER JOIN 
                                            pasiendaftar_t AS pd ON pd.norec = d.norec_pd
                                        WHERE 
                                            pd.noregistrasi = '$noregistrasi'
                                            AND d.statusenabled = TRUE
                                        ORDER BY d.norec_pd"));
        if (empty($checkfile2)) {
            $checkfile2 = [];
        } else {
            foreach ($checkfile2 as $chk) {
                if ($xcetakecho) {
                    if ($chk->jenisdokumenfk == '53' && $adaecho == false) {
                        $xcetakecho = 2;
                        $fileecho[] = $chk->dokumen;
                    }
                }
                if ($xcetakusg) {
                    if ($chk->jenisdokumenfk == '65') {
                        $xcetakusg = 2;
                        $fileusg[] = $chk->dokumen;
                    }
                }
                if ($xcetaksurkon) {
                    if ($chk->jenisdokumenfk == '70') {
                        $xcetaksurkon = 2;
                        $filesurkon[] = $chk->dokumen;
                    }
                }
                if ($xcetakekg) {
                    if ($chk->jenisdokumenfk == '52' || $chk->jenisdokumenfk == '43') {
                        $xcetakekg = 2;
                        $fileekg[] = $chk->dokumen;
                    }
                }
                if ($xcetakpa) {
                    if ($chk->jenisdokumenfk == '58') {
                        $xcetakpa = 2;
                        $filepa[] = $chk->dokumen;
                    }
                }
                if ($xcetakdoktambahan) {
                    if ($chk->jenisdokumenfk == '68' || $chk->jenisdokumenfk == '63') {
                        $xcetakdoktambahan = 2;
                        $filedoktambahan[] = $chk->dokumen;
                    }
                }
            }
        }
        //-----------------------pasien-----------------------------------------
        $dataPasien = DB::select(DB::raw("
            SELECT
                pd.tglregistrasi,
                pd.tglpulang,
                rk.namarekanan,
                pd.noregistrasi,
                kp.kelompokpasien,
                ps.tgllahir,
                jk.jeniskelamin,
                alm.alamatlengkap || ' ' || dk.namadesakelurahan || ' ' || kc.namakecamatan || ' ' || kk.namakotakabupaten || ' ' || pro.namapropinsi AS alamatlengkap,
                ps.tempatlahir,
                ps.noidentitas,
                ps.notelepon,
                pp.namapangkatpolisi,
                ks.kesatuanpasien,
                ps.objectjeniskelaminfk,
                ps.nocm,
                ps.namapasien,
                pd.objectkelompokpasienlastfk,
                kls.namakelas,
                ru.objectdepartemenfk,
                pd.objectruanganlastfk,
                ru.namaruangan AS lastruangan 
            FROM
                pasiendaftar_t AS pd
                LEFT JOIN pasien_m AS ps ON ps.ID = pd.nocmfk
                LEFT JOIN jeniskelamin_m AS jk ON jk.ID = ps.objectjeniskelaminfk
                LEFT JOIN alamat_m AS alm ON alm.nocmfk = ps.ID 
                LEFT JOIN desakelurahan_m AS dk ON dk.ID = alm.objectdesakelurahanfk
                LEFT JOIN kecamatan_m AS kc ON kc.ID = alm.objectkecamatanfk
                LEFT JOIN kotakabupaten_m AS kk ON kk.ID = alm.objectkotakabupatenfk
                LEFT JOIN propinsi_m AS pro ON pro.ID = alm.objectpropinsifk
                LEFT JOIN pangkatpolisi_m AS pp ON pp.ID = ps.pangkatpolisi
                LEFT JOIN kesatuanpasien_m AS ks ON ks.ID = ps.objectkesatuanfk
                LEFT JOIN kelas_m AS kls ON kls.ID = pd.objectkelasfk
                LEFT JOIN ruangan_m AS ru ON ru.ID = pd.objectruanganlastfk 
                LEFT JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
                LEFT JOIN rekanan_m as rk ON rk.id = pd.objectrekananfk
            WHERE
                pd.noregistrasi = '$noregistrasi'
            "));
        $objectruanganlastfk = $dataPasien[0]->objectruanganlastfk;
        //-----------------------------Kamar-----------------------------------
        $kamar = '';
        $nobed = '';

        $cekkamar = DB::select("
            SELECT 
                ru.namaruangan AS namaruangan,
                km.namakamar,
                kl.namakelas,
                tt.reportdisplay
            FROM 
                pasiendaftar_t AS pd
            LEFT JOIN 
                ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
            LEFT JOIN 
                antrianpasiendiperiksa_t AS apd 
                    ON apd.noregistrasifk = pd.norec AND apd.objectruanganfk = pd.objectruanganlastfk
            LEFT JOIN 
                kamar_m AS km ON km.id = apd.objectkamarfk
            LEFT JOIN 
                tempattidur_m AS tt ON apd.nobed = tt.id
            LEFT JOIN 
                pemakaianasuransi_t AS pa ON pa.noregistrasifk = pd.norec
            LEFT JOIN 
                asuransipasien_m AS asu ON asu.id = pa.objectasuransipasienfk
            LEFT JOIN 
                kelas_m AS kl ON kl.id = asu.objectkelasdijaminfk
            WHERE 
                pd.noregistrasi = :noregistrasi
            GROUP BY 
                ru.namaruangan, km.namakamar, kl.namakelas, tt.reportdisplay, apd.tglmasuk
            ORDER BY 
                apd.tglmasuk DESC
            LIMIT 1
        ", [
            'noregistrasi' => $noregistrasi
        ]);

        if (!empty($cekkamar)) {
            $kamar = $cekkamar[0]->namakamar ?? '';
            $nobed = $cekkamar[0]->reportdisplay ?? '';
        }

        //----------------------------Kelas faktur------------------------------------
        $umurpasien = $this->getAge($dataPasien[0]->tgllahir, date('Y-m-d'));
        $kelasfaktur = '';
        $kelasdijamin = DB::select(DB::raw("
        select kls.namakelas from pasiendaftar_t as pd left join
        pemakaianasuransi_t as pa on pa.noregistrasifk = pd.norec left join
        asuransipasien_m as ap on ap.id = pa.objectasuransipasienfk left join
        kelas_m as kls on kls.id = ap.objectkelasdijaminfk
        where pd.noregistrasi = '$noregistrasi'
        "));
        if ($dataPasien[0]->objectkelompokpasienlastfk == 2) {
            if (count($kelasdijamin) > 0) {
                $kelasfaktur = $kelasdijamin[0]->namakelas;
            }
        } else {
            $kelasfaktur = $dataPasien[0]->namakelas;
        }
        //-----------------------total bill-----------------------------------------
        if ($objectruanganlastfk == 721) {
            $dataTotalBill = DB::select(
                DB::raw(" select sum(((case when pp.hargajual is null then 0 else pp.hargajual  end - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah) + case when pp.jasa is null then 0 else pp.jasa end) as total
                        from pasiendaftar_t as pd
                        INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                        INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                        where  pd.noregistrasi=:noregistrasi and pp.produkfk not in (402611) ;
                    "),
                array(
                    'noregistrasi' => $noregistrasi,
                )
            );
        } else {
            $dataTotalBill = DB::select(
                DB::raw("select sum((case when pp.hargajual is null then 0 else pp.hargajual  end  * pp.jumlah - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) + case when pp.jasa is null then 0 else pp.jasa end) as total
                        from pasiendaftar_t as pd
                        INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                        INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                        where  pd.noregistrasi=:noregistrasi and pp.produkfk not in (402611) and pp.isobatnoninacbg is null ;
                    "),
                array(
                    'noregistrasi' => $noregistrasi,
                )
            );
        }
        //-----------------------billing-----------------------------------------
        $rincianbilling = [];
        $tampungnosep = '';
        $isi = "";
        $terbilang = "";
        $rincianbillingnamaruangan = "";
        $rincianbillingnamadokter = "";
        $rincianbillingnamakelas = "";
        $dataTotalBilltotal = "";
        if ($xcetakbilling == 1 || $xcetakrekapbilling == 1) {
            $rincianbilling = DB::select(DB::raw("
            SELECT 
                pp.norec,
                pp.tglpelayanan,
                pp.rke,
                pr.id AS prid,
                pr.namaproduk,
                pp.jumlah,
                kl.id AS klid,
                kl.namakelas,
                pd.catatan,
                pd.statuscatatan,
                ru.id AS ruid,
                ru.namaruangan,
                pp.produkfk,
                pp.hargajual,
                pp.hargadiscount,
                sp.nostruk,
                sp.tglstruk,
                apd.norec AS norec_apd,
                pp.qtydetailresep,
                pg.id AS pgid,
                pd.objectpegawaifk AS pgpjid,
                asu.objectkelasdijaminfk,
                pd.objectkelompokpasienlastfk,
                pg.namalengkap,
                sbm.nosbm,
                sp.norec AS norec_sp,
                pp.jasa,
                pd.nocmfk,
                ru.objectdepartemenfk AS deptid,
                pd.nocmfk,
                pd.nostruklastfk,
                ag.id AS agid,
                ag.agama,
                pas.tgllahir,
                kp.id AS kpid,
                kp.kelompokpasien,
                pas.objectstatusperkawinanfk,
                pas.namaayah,
                pas.namasuamiistri,
                pas.id AS pasid,
                pas.nocm,
                jkel.id AS jkelid,
                jkel.jeniskelamin,
                jkel.reportdisplay AS jk,
                pd.noregistrasi,
                pas.namapasien,
                pd.tglregistrasi,
                dpm.namadepartemen,
                dpm.id AS iddepartemen,
                pd.norec AS norec_pd,
                pd.tglpulang,
                pas.notelepon,
                kls.id AS klsid,
                kls.namakelas,
                pd.objectrekananfk AS rekananid,
                ru2.namaruangan AS ruanganlast,
                kls2.id AS klsid2,
                kls2.namakelas AS namakelas2,
                sr.noresep,
                sr.norec AS norec_resep,
                rk.namarekanan,
                rusr.namaruangan AS ruanganfarmasi,
                pgsr.namalengkap AS penulisresep,
                jp.jenisproduk,
                kpBpjs.kelompokprodukbpjs AS kelompokprodukbpjs,
                pgpj.namalengkap AS dokterpj,
                pp.jasa,
                kamar.namakamar,
                sp.totalharusdibayar,
                sp.totalprekanan,
                sppj.totalppenjamin,
                sp.totalbiayatambahan,
                pgsbm.namalengkap AS namalengkapsbm,
                pd.kdprofile,
                pp.aturanpakai,
                pp.iscito,
                pd.statuspasien,
                pp.isparamedis,
                ru2.id AS ruanganlastid,
                pa.nosep
            FROM 
                pasiendaftar_t AS pd
                LEFT JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
                LEFT JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
                LEFT JOIN produk_m AS pr ON pr.id = pp.produkfk
                LEFT JOIN detailjenisproduk_m AS djp ON djp.id = pr.objectdetailjenisprodukfk
                LEFT JOIN jenisproduk_m AS jp ON jp.id = djp.objectjenisprodukfk
                LEFT JOIN kelompokprodukbpjs_m AS kpBpjs ON kpBpjs.id = pr.objectkelompokprodukbpjsfk
                LEFT JOIN kelas_m AS kl ON kl.id = apd.objectkelasfk
                LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                JOIN ruangan_m AS ru2 ON ru2.id = pd.objectruanganlastfk
                JOIN departemen_m AS dpm ON dpm.id = ru.objectdepartemenfk
                JOIN pasien_m AS pas ON pas.id = pd.nocmfk
                LEFT JOIN agama_m AS ag ON ag.id = pas.objectagamafk
                LEFT JOIN jeniskelamin_m AS jkel ON jkel.id = pas.objectjeniskelaminfk
                LEFT JOIN kelompokpasien_m AS kp ON kp.id = pd.objectkelompokpasienlastfk
                LEFT JOIN kelas_m AS kls ON kls.id = apd.objectkelasfk
                LEFT JOIN kelas_m AS kls2 ON kls2.id = pd.objectkelasfk
                LEFT JOIN pegawai_m AS pg ON pg.id = apd.objectpegawaifk
                LEFT JOIN pegawai_m AS pgpj ON pgpj.id = pd.objectpegawaifk
                LEFT JOIN pemakaianasuransi_t AS pa ON pa.noregistrasifk = pd.norec
                LEFT JOIN asuransipasien_m AS asu ON asu.id = pa.objectasuransipasienfk
                LEFT JOIN rekanan_m AS rk ON rk.id = pd.objectrekananfk
                LEFT JOIN strukresep_t AS sr ON sr.norec = pp.strukresepfk
                LEFT JOIN ruangan_m AS rusr ON rusr.id = sr.ruanganfk
                LEFT JOIN kamar_m AS kamar ON kamar.id = apd.objectkamarfk
                LEFT JOIN pegawai_m AS pgsr ON pgsr.id = sr.penulisresepfk
                LEFT JOIN strukpelayanan_t AS sp ON sp.norec = pp.strukfk
                LEFT JOIN strukpelayananpenjamin_t AS sppj ON sp.norec = sppj.nostrukfk
                LEFT JOIN strukbuktipenerimaan_t AS sbm ON sp.nosbmlastfk = sbm.norec
                LEFT JOIN pegawai_m AS pgsbm ON pgsbm.id = sbm.objectpegawaipenerimafk
            WHERE 
                pd.noregistrasi = '$noregistrasi'
            ORDER BY 
                pp.tglpelayanan, pp.rke;
            "));
            if (!empty($rincianbilling[0])) $tampungnosep = $rincianbilling[0]->nosep;
            else $tampungnosep = '';

            $rincianproduk = DB::select(DB::raw("
            SELECT 
                ROW_NUMBER() OVER (PARTITION BY noregistrasi ORDER BY jenisproduk, namaproduk) AS rownum,
                *,
                tglpelayanan AS tglpelayananx
            FROM
                temp_billing_t 
            WHERE
                noregistrasi = '$noregistrasi' 
                AND tglpelayanan IS NOT NULL 
                AND namaproduk NOT IN ('Biaya Administrasi', 'Biaya Materai')
            ORDER BY
                 ruangantindakan, jenisproduk, namaproduk;
            "));

            $riwayatinap = \DB::table('antrianpasiendiperiksa_t as apd')
                ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                ->select('ru.namaruangan', 'apd.tglmasuk', 'apd.tglkeluar', 'pd.noregistrasi')
                ->where('pd.noregistrasi', $noregistrasi)
                ->where('ru.objectdepartemenfk', '16')
                ->where('apd.statusenabled', true)
                ->orderBy('apd.tglmasuk')
                ->get();


            foreach ($riwayatinap as $x) {
                $isi = $isi . ' ' . $x->namaruangan . ' Tgl.Masuk ' . $x->tglmasuk . ' \ ' . $x->tglkeluar . ' # ';
            }

            if ($dataTotalBill[0]->total != 0.0) {
                $terbilang = $this->makeTerbilang($dataTotalBill[0]->total);
            }

            if (!empty($rincianbilling)) {
                $rincianbillingnamaruangan = $rincianbilling[0]->ruanganlast;
                $rincianbillingnamadokter = $rincianbilling[0]->dokterpj;
                $rincianbillingnamakelas = $rincianbilling[0]->namakelas;
                // $rincianbillingharusbayar=$rincianbilling[0]->lastharusbayar;
                $dataTotalBilltotal = $dataTotalBill[0]->total;
            }
        }
        //----------------------------------------------------------------
        $namaruanganresume = '';
        $tglmasukresume = '';
        $tglkeluarresume = '';
        $keluhanutamaRM = '';
        $diagdok = '';
        $diagsek = '';
        $alergiresume = '';
        $keadaanumumresume = '';
        $pfnadi = '';
        $pfspo = '';
        $pfbb = '';
        $pftb = '';
        $pfe = '';
        $pfm = '';
        $pfv = '';
        $kondisiwaktukeluar = '';
        $carapulang = '';
        $kesadaranresume = '';
        $denyutjantung = '';
        $pernapasanresume = '';
        $systole = '';
        $diastole = '';
        $suhuresume = '';
        $pemeriksaanfisik = '';
        $diet = '';
        $keterangandiet = '';
        $prognosis = '';
        $edukasi = '-';
        $rencanatindaklanjut = '-';
        $kontrol = '-';
        $tglkontrolpoli = '-';
        $keadaandarurat2 = '-';
        $sarantransportasi = '-';
        $kondisimeninggalkan = '-';
        $pasienkeluarga = '';
        $namadokter = '';
        $tindakanlab = 'Laboratorium Klinik : ';
        $tindakanrad = 'Radiologi : ';
        // $tindakanpa = 'Laboratorium Patalogi Anatomi : ';
        $tampung2 = '';
        $tampungbaruuuuu = '';
        $penunjanglab = '-';
        $penunjangrad = '-';
        $penunjangpa = '-';
        $obatResume = '';
        $obatPulang = '';
        $nourutobat = 1;
        $nourutobatpulang = 1;
        $qrdpjpresume = '';
        $qrpasienrm = '';
        $ringkasanriwayatpenyakit = '';
        $alasanrawat = '';
        $pemeriksaanfisik = '';
        $result = [];
        //--------------------Resume--------------------------------------------
        $resumeMedis = [];
        $adaresume = 'false';
        $result = [];
        $konsultasi = '';
        $keteranganresume = '';
        $indikasirawatinap = '-';
        $tindakanrm = '-';
        $isreaksiobat = '';
        $listReaksiObat = '';
        $listRO = '';
        $ku = '';
        $kesadaranpulang = '';
        $tekanandarahpulang = '';
        $suhupulang = '';
        $pernafasanpulang = '';
        $nadipulang = '';
        $msp = '';
        $ab = '';
        $akyt = '';
        $perawatandirumah = '';
        $perawatandirumahlanjut = '';
        $ppp = '';
        $kebutuhanedukasi = '';
        $opr = '';
        $namapasienrm = '';
        $temuanpenting = '';
        $hasilkonsultasi = '';

        $diagnosaawal = 'Diagnosis Awal : ';
        $diagnosasekunder = 'Diagnosis Sekunder : ';
        $diagnosautama = 'Diagnosis Primer / Utama : ';
        $diagnosatindakan = '';
        $dehidrasiresusitasi = '';
        $tatalaksanaaritmia = '';
        $resusiitasijantungparu = '';
        $transfusi = '';
        $fibrinolitik = '';
        $antikoagulanantiagregrasi = '';
        $ventilatorkurangdari96jam = '';
        $ventilatorlebih96jam = '';
        $oksigenasi = '';
        $nebulisasi = '';
        $trakeostomi = '';
        $koreksielektrolitmetabolic = '';
        $bantuanpersalinan = '';
        $monitoringttvkesadaranskalanyeri = '';
        $pemberianinotropikvasoaktif = '';
        $antibiotik3kali24jam = '';

        if ($xcetakresumemedis == 1) {
            if ($dataPasien[0]->objectdepartemenfk == 16) {
                $resumeMedis = DB::select(DB::raw("
                select rm.norec, ru.namaruangan, rm.tglmasuk, rm.pemeriksaandisik, rm.pemeriksaanfisik, 
                case when rm.tglkontrol is not null then to_char(rm.tglkontrol, 'DD-MM-YYYY') else '-' end as tglkontrol, 
                rm.kondisiwaktukeluar, rm.tglkeluar, rm.keluhanutama, rm.diagdok, rm.diagsek, rm.alergi, rm.keadaanumum, rm.kesadaran, 
                rm.denyutjantung, rm.pernapasan, rm.systole, rm.diastole, rm.suhu, rm.diet, rm.keterangandiet, 
                rm.edukasi, rm.prognosis, rm.rencanatindaklanjut, rm.instruksianjuran, kontrol, 
                case when tglkontrolpoli is not null then to_char(tglkontrolpoli, 'DD-MM-YYYY') else '-' end as tglkontrolpoli, 
                keadaandarurat2, rm.sarantransportasi, rm.kondisimeninggalkan, rm.pasienkeluarga, rm.namadokter, 
                rm.pemeriksaanfisik, rm.pegawaifk, rm.ringkasanriwayatpenyakit, rm.alasanrawat, rm.keteranganlainnya, rm.indikasirawatinap, rm.pfnadi, rm.pfspo, rm.pfbb, rm.pftb, rm.pfe, rm.pfm, rm.pfv, rm.carapulang, rm.kondisiwaktukeluar, rm.tindakanrm, rm.isreaksiobatya, rm.isreaksiobattidak, rm.ku, rm.kesadaranpulang, rm.tekanandarah, rm.suhupulang, rm.pernafasanpulang, rm.nadipulang, rm.ismandiriya, rm.isdibantusetengahya, rm.isdibantupenuhya, rm.iswalkerya, rm.isalatbantulainlainya, rm.istidakadaalatkesehatanya, rm.isivcateterya, rm.isdobellumenya, rm.isngtya, rm.isoksigenya, rm.iscateterurineya, rm.isalatkesehatanlainlainya, rm.israwatdirumahtidak, rm.israwatdirumahya, rm.ishomecareya, rm.isperawatanlanjutanya, rm.ispengobatanlukaya, rm.ispengobatanlanjutanya, rm.isfaskesterdekatya, rm.faskesterdekat, rm.islaboratoriumya, rm.isradiologiya, rm.ispemeriksaanpenunjanglainlainya, rm.pemeriksaanpenunjanglainlain, rm.ispenyakitya, rm.isefeksampingobatya, rm.isdietya, rm.isaktifitasistirahatya, rm.ishygieneya, rm.isperawatanlukadirumahya, rm.isnyeriya, rm.isperawatanibubayiya, rm.ispertolonganmendesakya, rm.pertolonganmendesak, rm.iskebutuhanedukasilainlainya, rm.kebutuhanedukasilainlain, rm.pasienkeluarga, rm.temuanpenting, rm.hasilkonsultasi,
                rm.dehidrasiresusitasi,
                rm.tatalaksanaaritmia,
                rm.resusiitasijantungparu,
                rm.transfusi,
                rm.fibrinolitik,
                rm.antikoagulanantiagregrasi,
                rm.ventilatorkurangdari96jam,
                rm.ventilatorlebih96jam,
                rm.oksigenasi,
                rm.nebulisasi,
                rm.trakeostomi,
                rm.koreksielektrolitmetabolic,
                rm.bantuanpersalinan,
                rm.monitoringttvkesadaranskalanyeri,
                rm.pemberianinotropikvasoaktif,
                rm.antibiotik3kali24jam
                from pasiendaftar_t as pd 
                left join antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec 
                left join resumemedis_t as rm on rm.noregistrasifk = apd.norec 
                left join ruangan_m as ru on ru.id = pd.objectruanganlastfk
                where pd.noregistrasi = '$noregistrasi' and rm.statusenabled = 't' and rm.keteranganlainnya = 'RawatInap' 
                order by rm.tglresume desc
                "));
            } else if ($dataPasien[0]->objectdepartemenfk == 24) {
                $resumeMedis = DB::select(DB::raw("
                select rm.norec, ru.namaruangan, rm.pemeriksaandisik, rm.pemeriksaanfisik, 
                case when rm.tglkontrol is not null then to_char(rm.tglkontrol, 'DD-MM-YYYY') else '-' end as tglkontrol, 
                rm.tglmasuk, rm.kondisiwaktukeluar, rm.tglkeluar, rm.keluhanutama, rm.diagdok, rm.diagsek, rm.alergi, rm.keadaanumum, rm.kesadaran, 
                rm.denyutjantung, rm.pernapasan, rm.systole, rm.diastole, rm.suhu, rm.diet, rm.keterangandiet, rm.edukasi, 
                rm.prognosis, rm.rencanatindaklanjut, rm.instruksianjuran, kontrol, 
                case when tglkontrolpoli is not null then to_char(tglkontrolpoli, 'DD-MM-YYYY') else '-' end as tglkontrolpoli, 
                keadaandarurat2, rm.sarantransportasi, rm.kondisimeninggalkan, rm.pasienkeluarga, rm.namadokter, 
                rm.pemeriksaanfisik, rm.pegawaifk, rm.ringkasanriwayatpenyakit, rm.alasanrawat, rm.keteranganlainnya, rm.indikasirawatinap, rm.pfnadi, rm.pfspo, rm.pfbb, rm.pftb, rm.pfe, rm.pfm, rm.pfv, rm.carapulang, rm.kondisiwaktukeluar, rm.tindakanrm, rm.isreaksiobatya, rm.isreaksiobattidak, rm.ku, rm.kesadaranpulang, rm.tekanandarah, rm.suhupulang, rm.pernafasanpulang, rm.nadipulang, rm.ismandiriya, rm.isdibantusetengahya, rm.isdibantupenuhya, rm.iswalkerya, rm.isalatbantulainlainya, rm.istidakadaalatkesehatanya, rm.isivcateterya, rm.isdobellumenya, rm.isngtya, rm.isoksigenya, rm.iscateterurineya, rm.isalatkesehatanlainlainya, rm.israwatdirumahtidak, rm.israwatdirumahya, rm.ishomecareya, rm.isperawatanlanjutanya, rm.ispengobatanlukaya, rm.ispengobatanlanjutanya, rm.isfaskesterdekatya, rm.faskesterdekat, rm.islaboratoriumya, rm.isradiologiya, rm.ispemeriksaanpenunjanglainlainya, rm.pemeriksaanpenunjanglainlain, rm.ispenyakitya, rm.isefeksampingobatya, rm.isdietya, rm.isaktifitasistirahatya, rm.ishygieneya, rm.isperawatanlukadirumahya, rm.isnyeriya, rm.isperawatanibubayiya, rm.ispertolonganmendesakya, rm.pertolonganmendesak, rm.iskebutuhanedukasilainlainya, rm.kebutuhanedukasilainlain, rm.pasienkeluarga, rm.temuanpenting, rm.hasilkonsultasi
                from pasiendaftar_t as pd 
                left join antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec 
                left join resumemedis_t as rm on rm.noregistrasifk = apd.norec 
                left join ruangan_m as ru on ru.id = apd.objectruanganfk
                where pd.noregistrasi = '$noregistrasi' and rm.statusenabled = 't' and rm.keteranganlainnya = 'IGD' 
                order by rm.tglresume desc
                "));
            } else {
                $resumeMedis = DB::select(DB::raw("
                select rm.norec, ru.namaruangan, rm.tglmasuk, rm.pemeriksaandisik, rm.pemeriksaanfisik, 
                case when rm.tglkontrol is not null then to_char(rm.tglkontrol, 'DD-MM-YYYY') else '-' end as tglkontrol, 
                rm.kondisiwaktukeluar, rm.tglkeluar, rm.keluhanutama, rm.alergi, rm.diagdok, rm.diagsek, rm.keadaanumum, rm.kesadaran, 
                rm.denyutjantung, rm.pernapasan, rm.systole, rm.diastole, rm.suhu, rm.diet, rm.keterangandiet, rm.edukasi, 
                rm.prognosis, rm.rencanatindaklanjut, rm.instruksianjuran, kontrol, 
                case when tglkontrolpoli is not null then to_char(tglkontrolpoli, 'DD-MM-YYYY') else '-' end as tglkontrolpoli, 
                keadaandarurat2, rm.sarantransportasi, rm.kondisimeninggalkan, rm.pasienkeluarga, rm.namadokter, 
                rm.pemeriksaanfisik, rm.pegawaifk, rm.ringkasanriwayatpenyakit, rm.alasanrawat, rm.keteranganlainnya, rm.indikasirawatinap, rm.pfnadi, rm.pfspo, rm.pfbb, rm.pftb, rm.pfe, rm.pfm, rm.pfv, rm.carapulang, rm.kondisiwaktukeluar, rm.tindakanrm, rm.isreaksiobatya, rm.isreaksiobattidak, rm.ku, rm.kesadaranpulang, rm.tekanandarah, rm.suhupulang, rm.pernafasanpulang, rm.nadipulang, rm.ismandiriya, rm.isdibantusetengahya, rm.isdibantupenuhya, rm.iswalkerya, rm.isalatbantulainlainya, rm.istidakadaalatkesehatanya, rm.isivcateterya, rm.isdobellumenya, rm.isngtya, rm.isoksigenya, rm.iscateterurineya, rm.isalatkesehatanlainlainya, rm.israwatdirumahtidak, rm.israwatdirumahya, rm.ishomecareya, rm.isperawatanlanjutanya, rm.ispengobatanlukaya, rm.ispengobatanlanjutanya, rm.isfaskesterdekatya, rm.faskesterdekat, rm.islaboratoriumya, rm.isradiologiya, rm.ispemeriksaanpenunjanglainlainya, rm.pemeriksaanpenunjanglainlain, rm.ispenyakitya, rm.isefeksampingobatya, rm.isdietya, rm.isaktifitasistirahatya, rm.ishygieneya, rm.isperawatanlukadirumahya, rm.isnyeriya, rm.isperawatanibubayiya, rm.ispertolonganmendesakya, rm.pertolonganmendesak, rm.iskebutuhanedukasilainlainya, rm.kebutuhanedukasilainlain, rm.pasienkeluarga, rm.temuanpenting, rm.hasilkonsultasi
                from pasiendaftar_t as pd 
                left join antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec 
                left join resumemedis_t as rm on rm.noregistrasifk = apd.norec 
                left join ruangan_m as ru on ru.id = apd.objectruanganfk
                where pd.noregistrasi = '$noregistrasi' and rm.statusenabled = 't' and rm.keteranganlainnya = 'RawatJalan' 
                order by rm.tglresume desc
                "));
            }
            // return($resumeMedis);
            // die();
            $adaresume = 'false';
            if (count($resumeMedis) > 0) {
                if ($resumeMedis[0]->isreaksiobatya != null && $resumeMedis[0]->isreaksiobatya == true) {
                    $isreaksiobat = 'Ya';
                    $dataRO = \DB::table('reaksiobatresumemedis_t as ro')
                        ->select(
                            'ro.*'
                        )
                        ->Join('resumemedis_t as rm', 'rm.norec', '=', 'ro.norecresumefk')
                        ->Join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'rm.noregistrasifk')
                        ->Join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                        ->Join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                        ->where('rm.statusenabled', true)
                        ->where('pd.noregistrasi', $noregistrasi)
                        ->where('rm.keteranganlainnya', 'RawatInap');
                    $dataRO = $dataRO->get();
                    foreach ($dataRO as $ro) {
                        $listRO = $listRO . $ro->namaobatro . '-' . $ro->manifestasiro . '-' . $ro->keteranganro . "<br>";
                    }
                } else {
                    $isreaksiobat = 'Tidak';
                }

                if ($resumeMedis[0]->ismandiriya != null && $resumeMedis[0]->ismandiriya == true) {
                    $msp = 'mandiri';
                } else if ($resumeMedis[0]->isdibantusetengahya != null && $resumeMedis[0]->isdibantusetengahya == true) {
                    $msp = 'Dibantu Sebagian';
                } else if ($resumeMedis[0]->isdibantupenuhya != null && $resumeMedis[0]->isdibantupenuhya == true) {
                    $msp = 'Dibantu Penuh';
                }

                if ($resumeMedis[0]->iswalkerya != null && $resumeMedis[0]->iswalkerya == true) {
                    $ab = 'Walker';
                } else if ($resumeMedis[0]->isalatbantulainlainya != null && $resumeMedis[0]->isalatbantulainlainya == true) {
                    $ab = 'Lain-lain';
                }
                if ($resumeMedis[0]->istidakadaalatkesehatanya != null && $resumeMedis[0]->istidakadaalatkesehatanya == true) {
                    $akyt .= 'Tidak Ada';
                }
                if ($resumeMedis[0]->isivcateterya != null && $resumeMedis[0]->isefeksampingobatya == true) {
                    if (!empty($akyt)) {
                        $akyt .= ', ';
                    }
                    $akyt .= 'IV Cateter';
                }
                if ($resumeMedis[0]->isdobellumenya != null && $resumeMedis[0]->isdobellumenya == true) {
                    if (!empty($akyt)) {
                        $akyt .= ', ';
                    }
                    $akyt .= 'Dobel Lumen';
                }
                if ($resumeMedis[0]->isngtya != null && $resumeMedis[0]->isngtya == true) {
                    if (!empty($akyt)) {
                        $akyt .= ', ';
                    }
                    $akyt .= 'NGT';
                }
                if ($resumeMedis[0]->isoksigenya != null && $resumeMedis[0]->isoksigenya == true) {
                    if (!empty($akyt)) {
                        $akyt .= ', ';
                    }
                    $akyt .= 'Oksigen';
                }
                if ($resumeMedis[0]->iscateterurineya != null && $resumeMedis[0]->iscateterurineya == true) {
                    if (!empty($akyt)) {
                        $akyt .= ', ';
                    }
                    $akyt .= 'Cateter Urine';
                }
                if ($resumeMedis[0]->isalatkesehatanlainlainya != null && $resumeMedis[0]->isalatkesehatanlainlainya == true) {
                    if (!empty($akyt)) {
                        $akyt .= ', ';
                    }
                    $akyt .= 'Lain-lain';
                }
                if ($resumeMedis[0]->israwatdirumahya != null && $resumeMedis[0]->israwatdirumahya == true) {
                    $perawatandirumah = 'Ada';
                    if ($resumeMedis[0]->ishomecareya != null && $resumeMedis[0]->ishomecareya == true) {
                        $perawatandirumahlanjut .= 'Home Care';
                    }
                    if ($resumeMedis[0]->isperawatanlanjutanya != null && $resumeMedis[0]->isperawatanlanjutanya == true) {
                        if (!empty($perawatandirumahlanjut)) {
                            $perawatandirumahlanjut .= ', ';
                        }
                        $perawatandirumahlanjut .= 'Perawatan Lanjutan';
                    }
                    if ($resumeMedis[0]->ispengobatanlukaya != null && $resumeMedis[0]->ispengobatanlukaya == true) {
                        if (!empty($perawatandirumahlanjut)) {
                            $perawatandirumahlanjut .= ', ';
                        }
                        $perawatandirumahlanjut .= 'Perawatan Luka';
                    }
                    if ($resumeMedis[0]->ispengobatanlanjutanya != null && $resumeMedis[0]->ispengobatanlanjutanya == true) {
                        if (!empty($perawatandirumahlanjut)) {
                            $perawatandirumahlanjut .= ', ';
                        }
                        $perawatandirumahlanjut .= 'Pengobatan Lanjutan';
                    }
                    if ($resumeMedis[0]->isfaskesterdekatya != null && $resumeMedis[0]->isfaskesterdekatya == true) {
                        if (!empty($perawatandirumahlanjut)) {
                            $perawatandirumahlanjut .= ', ';
                        }
                        $perawatandirumahlanjut .= 'Fasilitas Kesehatan Terdekat Dari Rumah';
                        if ($resumeMedis[0]->faskesterdekat != null) {
                            $perawatandirumahlanjut .= ' - ' . $resumeMedis[0]->faskesterdekat;
                        }
                    }
                } else {
                    $perawatandirumah = 'Tidak';
                }
                if ($resumeMedis[0]->islaboratoriumya != null && $resumeMedis[0]->islaboratoriumya == true) {
                    $ppp .= 'Laboratorium';
                }
                if ($resumeMedis[0]->isradiologiya != null && $resumeMedis[0]->isradiologiya == true) {
                    if (!empty($ppp)) {
                        $ppp .= ', ';
                    }
                    $ppp .= 'Radiologi';
                }
                if ($resumeMedis[0]->ispemeriksaanpenunjanglainlainya != null && $resumeMedis[0]->ispemeriksaanpenunjanglainlainya == true) {
                    if (!empty($ppp)) {
                        $ppp .= ', ';
                    }
                    $ppp .= 'Lain-lain';
                    if ($resumeMedis[0]->pemeriksaanpenunjanglainlain != null) {
                        $ppp .= ' - ' . $resumeMedis[0]->pemeriksaanpenunjanglainlain;
                    }
                }
                if ($resumeMedis[0]->ispenyakitya != null && $resumeMedis[0]->ispenyakitya == true) {
                    $kebutuhanedukasi .= 'Penyakit';
                }
                if ($resumeMedis[0]->isefeksampingobatya != null && $resumeMedis[0]->isefeksampingobatya == true) {
                    if (!empty($kebutuhanedukasi)) {
                        $kebutuhanedukasi .= ', ';
                    }
                    $kebutuhanedukasi .= 'Obat dan Efek Samping Obat';
                }
                if ($resumeMedis[0]->isdietya != null && $resumeMedis[0]->isdietya == true) {
                    if (!empty($kebutuhanedukasi)) {
                        $kebutuhanedukasi .= ', ';
                    }
                    $kebutuhanedukasi .= 'Diet';
                }
                if ($resumeMedis[0]->isaktifitasistirahatya != null && $resumeMedis[0]->isaktifitasistirahatya == true) {
                    if (!empty($kebutuhanedukasi)) {
                        $kebutuhanedukasi .= ', ';
                    }
                    $kebutuhanedukasi .= 'Aktifitas dan Istirahat Dirumah';
                }
                if ($resumeMedis[0]->ishygieneya != null && $resumeMedis[0]->ishygieneya == true) {
                    if (!empty($kebutuhanedukasi)) {
                        $kebutuhanedukasi .= ', ';
                    }
                    $kebutuhanedukasi .= 'Hygiene';
                }
                if ($resumeMedis[0]->isperawatanlukadirumahya != null && $resumeMedis[0]->isperawatanlukadirumahya == true) {
                    if (!empty($kebutuhanedukasi)) {
                        $kebutuhanedukasi .= ', ';
                    }
                    $kebutuhanedukasi .= 'Perawatan Luka Dirumah';
                }
                if ($resumeMedis[0]->isnyeriya != null && $resumeMedis[0]->isnyeriya == true) {
                    if (!empty($kebutuhanedukasi)) {
                        $kebutuhanedukasi .= ', ';
                    }
                    $kebutuhanedukasi .= 'Nyeri';
                }
                if ($resumeMedis[0]->isperawatanibubayiya != null && $resumeMedis[0]->isperawatanibubayiya == true) {
                    if (!empty($kebutuhanedukasi)) {
                        $kebutuhanedukasi .= ', ';
                    }
                    $kebutuhanedukasi .= 'Perawatan Ibu dan Bayi';
                }
                if ($resumeMedis[0]->ispertolonganmendesakya != null && $resumeMedis[0]->ispertolonganmendesakya == true) {
                    if (!empty($kebutuhanedukasi)) {
                        $kebutuhanedukasi .= ', ';
                    }
                    $kebutuhanedukasi .= 'Pertolongan Mendesak';
                    if ($resumeMedis[0]->pertolonganmendesak != null) {
                        $kebutuhanedukasi .= ' - ' . $resumeMedis[0]->pertolonganmendesak;
                    }
                }
                if ($resumeMedis[0]->iskebutuhanedukasilainlainya != null && $resumeMedis[0]->iskebutuhanedukasilainlainya == true) {
                    if (!empty($kebutuhanedukasi)) {
                        $kebutuhanedukasi .= ', ';
                    }
                    $kebutuhanedukasi .= 'Lain-lain';
                    if ($resumeMedis[0]->kebutuhanedukasilainlain != null) {
                        $kebutuhanedukasi .= ' - ' . $resumeMedis[0]->kebutuhanedukasilainlain;
                    }
                }
                $adaresume = 'true';
                $namaruanganresume = $resumeMedis[0]->namaruangan;
                $tglmasukresume = $resumeMedis[0]->tglmasuk;
                $tglkeluarresume = $resumeMedis[0]->tglkeluar;
                $keluhanutamaRM = $resumeMedis[0]->keluhanutama;
                $diagdok = $resumeMedis[0]->diagdok;
                $diagsek = $resumeMedis[0]->diagsek;
                $alergiresume = $resumeMedis[0]->alergi;
                $keadaanumumresume = $resumeMedis[0]->keadaanumum;
                $pfnadi = $resumeMedis[0]->pfnadi;
                $pfspo = $resumeMedis[0]->pfspo;
                $pfbb = $resumeMedis[0]->pfbb;
                $pftb = $resumeMedis[0]->pftb;
                $pfe = $resumeMedis[0]->pfe;
                $pfm = $resumeMedis[0]->pfm;
                $pfv = $resumeMedis[0]->pfv;
                $tindakanrm = $resumeMedis[0]->tindakanrm;
                $isreaksiobat = $isreaksiobat;
                $listReaksiObat = $listRO;
                $kondisiwaktukeluar = $resumeMedis[0]->kondisiwaktukeluar;
                $carapulang = $resumeMedis[0]->carapulang;
                $ku = $resumeMedis[0]->ku;
                $kesadaranpulang = $resumeMedis[0]->kesadaranpulang;
                $tekanandarahpulang = $resumeMedis[0]->tekanandarah;
                $suhupulang = $resumeMedis[0]->suhupulang;
                $pernafasanpulang = $resumeMedis[0]->pernafasanpulang;
                $nadipulang = $resumeMedis[0]->nadipulang;
                $msp = $msp;
                $ab = $ab;
                $akyt = $akyt;
                $perawatandirumah = $perawatandirumah;
                $perawatandirumahlanjut = $perawatandirumahlanjut;
                $ppp = $ppp;
                $kebutuhanedukasi = $kebutuhanedukasi;
                $kesadaranresume = $resumeMedis[0]->kesadaran;
                $indikasirawatinap = $resumeMedis[0]->indikasirawatinap;
                $denyutjantung = $resumeMedis[0]->denyutjantung;
                $pernapasanresume = $resumeMedis[0]->pernapasan;
                $systole = $resumeMedis[0]->systole;
                $diastole = $resumeMedis[0]->diastole;
                $suhuresume = $resumeMedis[0]->suhu;
                $diet = $resumeMedis[0]->diet;
                $keterangandiet = $resumeMedis[0]->keterangandiet;
                $prognosis = $resumeMedis[0]->prognosis;
                $edukasi = $resumeMedis[0]->edukasi;
                $rencanatindaklanjut = $resumeMedis[0]->rencanatindaklanjut;
                $kontrol = $resumeMedis[0]->kontrol;
                $keteranganresume = $resumeMedis[0]->keteranganlainnya;
                $temuanpenting = $resumeMedis[0]->temuanpenting;
                $hasilkonsultasi = $resumeMedis[0]->hasilkonsultasi;
                if ($dataPasien[0]->objectdepartemenfk == 16) {
                    $tglkontrolpoli = $resumeMedis[0]->tglkontrol;
                } else {
                    $tglkontrolpoli = $resumeMedis[0]->tglkontrol;
                }
                $keadaandarurat2 = $resumeMedis[0]->keadaandarurat2;
                $sarantransportasi = $resumeMedis[0]->sarantransportasi;
                if ($dataPasien[0]->objectdepartemenfk == 16) {
                    $kondisimeninggalkan = $resumeMedis[0]->kondisiwaktukeluar;
                } else {
                    $kondisimeninggalkan = $resumeMedis[0]->kondisimeninggalkan;
                }
                $pasienkeluarga = $resumeMedis[0]->pasienkeluarga;
                if ($resumeMedis[0]->namadokter == null || $resumeMedis[0]->namadokter == "") {
                    $namadokter = 'Data DPJP Tidak tersedia';
                } else {
                    $namadokter = $resumeMedis[0]->namadokter;
                }
                if ($resumeMedis[0]->pasienkeluarga == null || $resumeMedis[0]->pasienkeluarga == "") {
                    $namapasienrm = 'Data Nama Pasien Tidak tersedia';
                } else {
                    $namapasienrm = $resumeMedis[0]->pasienkeluarga;
                }
                if ($resumeMedis[0]->pemeriksaanfisik == null) {
                    $pemeriksaanfisik = $resumeMedis[0]->pemeriksaandisik;
                } else {
                    $pemeriksaanfisik = $resumeMedis[0]->pemeriksaanfisik;
                }
                $ringkasanriwayatpenyakit = $resumeMedis[0]->ringkasanriwayatpenyakit;
                $alasanrawat = $resumeMedis[0]->alasanrawat;
                $qrCoderesume = new QrCode('"' . $namadokter . '"');
                header('Contert-Type: application/' . $qrCoderesume->getContentType());
                $qrdpjpresume = $qrCoderesume->writeDataUri();
                $qrCoderesumep = new QrCode('"' . $namapasienrm . '"');
                header('Contert-Type: application/' . $qrCoderesumep->getContentType());
                $qrpasienrm = $qrCoderesumep->writeDataUri();
                // $qrCoderesume = new QrCode("http://rsudmariawm.com/service/medifirst2000/report/cetak-ttd-new?idPegawai=" . $resumeMedis[0]->pegawaifk);
                // echo "</br>";
                // header('Contert-Type: application/' . $qrCoderesume->getContentType());
                // $qrdpjpresume = $qrCoderesume->writeDataUri();
                // $noedukasiresume = 0;
                // $edukasiresume = \DB::table('tempedukasipasien_t as tep')
                //     ->join('pegawai_m as pg', 'pg.id', '=', 'tep.pemberiedukasi')
                //     ->select('tep.norec','tep.noregistrasifk', 'tep.tgljamedukasi', 'tep.materiedukasi', 'tep.kodeleaflet', 'tep.lamaedukasi', 'tep.hasilverifikasi', 'tep.tglredukasi', 'pg.namalengkap', 'tep.pasienkeluarga', 'tep.tglinput')
                //     ->where('tep.noregistrasifk', $request['norec'])
                //     ->OrderBy('tep.tglinput','desc')
                //     ->get();
                // foreach ($edukasiresume as $ed) {
                //     $noedukasiresume += 1;
                //     $edukasi = $edukasi . $noedukasiresume . ". " . $ed->materiedukasi . " \n";
                // }
                //matikan sementara
                // $detailResumeMedis = \DB::table('tempresumerj_t as tr')
                // ->leftjoin('produk_m as pr', 'pr.id', '=', 'tr.objectprodukfk')
                // ->select('tglpelayanan', 'pr.namaproduk', 'jenispenunjang', 'pr.id', 'frekuensi', 'pr.objectkelompokprodukbpjsfk','hasilpenunjang', 'detailpemeriksaan', 'flaglab', 'objectprodukfk')
                // ->where('resumemedisfk', $resumeMedis[0]->norec)
                // // ->where('objectprodukfk', 4056683)
                // // ->where('jenispenunjang', 'LAB')
                // // ->distinct()
                // ->orderBy('jenispenunjang', 'asc', 'pr.id', 'asc', 'tglpelayanan', 'asc')
                // ->get();
                // return($detailResumeMedis);
                // die();
                $dataObatPulangResume = \DB::table('resumemedis_t as rm')
                    ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'rm.noregistrasifk')
                    ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                    ->leftjoin('tempresumerj_t as tj', 'tj.resumemedisfk', '=', 'rm.norec')
                    ->leftjoin('produk_m as pr', 'pr.id', '=', 'tj.objectprodukfk')
                    ->where('tj.statusenabled', true)
                    ->where('pd.noregistrasi', $noregistrasi)
                    ->where('tj.jenispenunjang', '=', 'OBATPULANG')
                    ->select('pr.namaproduk', 'tj.jenispenunjang', 'tj.qty', 'tj.frekuensi', 'tj.namadiagnosa', 'tj.kddiagnosa', 'tj.flaglab', 'tj.hasilpenunjang')
                    ->distinct()
                    ->OrderBy('tj.jenispenunjang')
                    ->get();
                if (count($dataObatPulangResume) > 0) {
                    foreach ($dataObatPulangResume as $op) {
                        $namaproduk = isset($op->namaproduk) ? $op->namaproduk : 'Nama Produk Tidak Ditemukan';
                        $frekuensi = isset($op->frekuensi) ? $op->frekuensi : '';

                        $obatPulang .= $nourutobatpulang . ". " . $namaproduk . " " . $frekuensi . "\n";
                        $nourutobatpulang++;
                    }
                }
                $dataObatResume = \DB::table('resumemedis_t as rm')
                    ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'rm.noregistrasifk')
                    ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                    ->leftjoin('tempresumerj_t as tj', 'tj.resumemedisfk', '=', 'rm.norec')
                    ->leftjoin('produk_m as pr', 'pr.id', '=', 'tj.objectprodukfk')
                    ->where('tj.statusenabled', true)
                    ->where('pd.noregistrasi', $noregistrasi)
                    ->whereIn('tj.jenispenunjang', ['OBAT', 'OBATPULANG'])
                    ->select('pr.namaproduk', 'tj.jenispenunjang', 'tj.qty', 'tj.frekuensi', 'tj.namadiagnosa', 'tj.kddiagnosa', 'tj.flaglab', 'tj.hasilpenunjang')
                    ->distinct()
                    ->OrderBy('tj.jenispenunjang')
                    ->get();
                if (count($dataObatResume) > 0) {
                    foreach ($dataObatResume as $ob) {
                        $namaproduk = isset($ob->namaproduk) ? $ob->namaproduk : 'Nama Produk Tidak Ditemukan';
                        $frekuensi = isset($ob->frekuensi) ? $ob->frekuensi : '';

                        $obatResume .= $nourutobat . ". " . $namaproduk . " " . $frekuensi . "\n";
                        $nourutobat++;
                    }
                }
                $detailResumeMedis = DB::select(DB::raw("
                    SELECT 
                        ROW_NUMBER() OVER (PARTITION BY noregistrasi ORDER BY jenisproduk, namaproduk) AS rownum,
                        *,
                        tglpelayanan AS tglpelayananx
                    FROM
                        temp_billing_t 
                    WHERE
                        noregistrasi = '$noregistrasi' 
                        AND tglpelayanan IS NOT NULL 
                        AND namaproduk NOT IN ('Biaya Administrasi', 'Biaya Materai')
                    ORDER BY
                        jenisproduk, ruangantindakan, namaproduk;
                    "));
                $tampungtindakanlab = '';
                $tampungtindakanpa = '';
                $tampungtindakanrad = '';
                if (count($detailResumeMedis) > 0) {
                    foreach ($detailResumeMedis as $drm) {
                        if ($drm->jenisproduk == "Laboratorium") {
                            if ($tampungtindakanlab != $drm->namaproduk) {
                                $tampungtindakanlab = $drm->namaproduk;
                                $tindakanlab = $tindakanlab . "- " . $drm->namaproduk . " \n";
                            }
                            // matikan sementara
                            // if($drm->namaproduk == "Gambaran Darah Tepi") {
                            //     $kalimat = $drm->hasilpenunjang;
                            //     $panjang = strlen($drm->hasilpenunjang);
                            //     $temukan = strpos($kalimat, "KESAN");
                            //     if ($temukan < 0) {
                            //         $temukan = strpos($kalimat, "KESAN");
                            //     }
                            //     $filter = substr($kalimat, $temukan, $panjang);
                            //     $tampungbaruuuuu =  $tampungbaruuuuu . $filter;
                            // } else {
                            //     if ($drm->hasilpenunjang != null) {
                            //         if ($drm->flaglab == 'Y' || $drm->flaglab == 'K') {
                            //             $tampungbaruuuuu = $tampungbaruuuuu . $drm->detailpemeriksaan . ":" . $drm->hasilpenunjang . " / ";
                            //         }
                            //     }
                            // }
                            //
                            // } else if ($drm->jenispenunjang == "LABPA" || $drm->jenispenunjang == "LABORATORIUM PATALOGI ANATOMI") {
                            //     if ($tampungtindakanpa != $drm->namaproduk) {
                            //         $tampungtindakanpa = $drm->namaproduk;
                            //         $tindakanpa = $tindakanpa . "- " . $drm->namaproduk . " \n";
                            //     }
                            //     $kalimat = $drm->hasilpenunjang;
                            //     $panjang = strlen($drm->hasilpenunjang);
                            //     $temukan = strpos($kalimat, "KESIMPULAN");
                            //     if ($temukan < 0) {
                            //         $temukan = strpos($kalimat, "KESIMPULAN");
                            //     }
                            //     $filter = substr($kalimat, $temukan, $panjang);
                            //     $penunjangpa =  $penunjangpa . $filter;
                        } else if ($drm->jenisproduk == "Radiologi") {
                            if ($tampungtindakanrad != $drm->namaproduk) {
                                $tampungtindakanrad = $drm->namaproduk;
                                $tindakanrad = $tindakanrad . "- " . $drm->namaproduk . " \n";
                            }
                            //matikan sementara
                            // $kalimat = $drm->hasilpenunjang;
                            // $panjang = strlen($drm->hasilpenunjang);
                            // $temukan = strpos($kalimat, "Kesan");
                            // if ($temukan < 0) {
                            //     $temukan = strpos($kalimat, "kesan");
                            // }
                            // $filter = substr($kalimat, $temukan, $panjang);
                            // $penunjangrad =  $penunjangrad . $filter;
                        }
                        // else if ($drm->jenisproduk == "Obat") {
                        //     $obatResume = $obatResume . $nourutobat . ". " . $drm->namaproduk;
                        //     $obatResume = $obatResume . "\n";
                        //     $nourutobat = $nourutobat + 1;
                        // }
                        // else if ($drm->jenisproduk == "OBATPULANG") {
                        //     $obatPulang = $obatPulang . $nourutobatpulang . ". " . $drm->namaproduk . $drm->frekuensi;
                        //     $obatPulang = $obatPulang . "\n";
                        //     $nourutobatpulang = $nourutobatpulang + 1;
                        // }
                    }
                    $penunjanglab = $penunjanglab . $tampungbaruuuuu;
                }
                // $obatPulangResume = DB::select(DB::raw("
                // WITH LastResep AS (
                //     SELECT
                //         pr.namaproduk,
                //         CAST(pp.jumlah AS INT) as jumlah,
                //         sr.noresep,
                //         sr.tglresep,
                //         pg.namalengkap,
                //         ru.namaruangan,
                //         pp.produkfk,
                //         pp.aturanpakai,
                //         pp.norec AS norecpp,
                //         DENSE_RANK() OVER (ORDER BY sr.tglresep DESC) AS rownum,
                //         sr.ruanganfk AS depoid,
                //         pp.dosisobat,
                //         wm.waktuminum,
                //         kpb.kelompokprodukbpjs,
                //         pp.isobatpulang
                //     FROM
                //         pasiendaftar_t AS pd
                //         INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
                //         INNER JOIN strukresep_t AS sr ON sr.pasienfk = apd.norec
                //         INNER JOIN pelayananpasien_t AS pp on pp.strukresepfk = sr.norec
                //         INNER JOIN produk_m AS pr on pr.id = pp.produkfk
                //         INNER JOIN pegawai_m AS pg on pg.id = sr.penulisresepfk 
                //         INNER JOIN ruangan_m as ru on ru.id = sr.ruanganfk
                //         LEFT JOIN waktuminum_m AS wm ON wm.id = pp.objectwaktuminumfk
                //         LEFT JOIN kelompokprodukbpjs_m as kpb ON kpb.id = pr.objectkelompokprodukbpjsfk
                //     WHERE
                //         pd.noregistrasi = '$noregistrasi' and pp.isobatpulang = true
                // )

                // SELECT
                //     namaproduk,
                //     jumlah,
                //     noresep,
                //     tglresep,
                //     namalengkap,
                //     namaruangan,
                //     produkfk,
                //     aturanpakai,
                //     norecpp,
                //     depoid,
                //     dosisobat,
                //     waktuminum,
                //     kelompokprodukbpjs,
                //     isobatpulang
                // FROM
                //     LastResep     
                // "));
                // foreach ($obatPulangResume as $oprr) {
                //     $opr = $opr . $oprr->namaproduk
                // }
            }


            $konsul = DB::select(DB::raw("
            select so.keteranganlainnya from strukorder_t as so inner join
            pasiendaftar_t as pd on pd.norec = so.noregistrasifk
            where pd.noregistrasi = '$noregistrasi' and so.objectkelompoktransaksifk = 108 and so.statusenabled = 't'
            "));
            if (count($konsul) > 0) {
                $konsultasi = $konsul[0]->keteranganlainnya;
            }


            //--x---
            $diagnosatindakan = 'Tindakan : ';
            $diagnosa9 = DB::select(DB::raw("
            SELECT 
            dt.kddiagnosatindakan || ' - ' || dt.namadiagnosatindakan AS namadiagnosa,
                    pd.noregistrasi,
                    pd.tglregistrasi,
                    apd.objectruanganfk,
                    ru.namaruangan,
                    apd.norec AS norec_apd,
                    ddt.objectdiagnosatindakanfk,
                    dt.kddiagnosatindakan,
                    dt.namadiagnosatindakan,
                    dtp.norec AS norec_diagnosapasien,
                    ddt.norec AS norec_detaildpasien,
                    dt.*,
                    ddt.keterangantindakan,
                    pg.namalengkap,
                    ddt.tglinputdiagnosa,
                    ddt.jumlah
                FROM 
                    pasiendaftar_t AS pd
                JOIN 
                    antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
                JOIN 
                    ruangan_m AS ru ON ru.id = apd.objectruanganfk
                JOIN 
                    diagnosatindakanpasien_t AS dtp ON dtp.objectpasienfk = apd.norec
                JOIN 
                    detaildiagnosatindakanpasien_t AS ddt ON ddt.objectdiagnosatindakanpasienfk = dtp.norec
                JOIN 
                    diagnosatindakanidrg_m AS dt ON dt.id = ddt.objectdiagnosatindakanfk
                LEFT JOIN 
                    pegawai_m AS pg ON pg.id = ddt.objectpegawaifk
                WHERE 
                    pd.noregistrasi = '$noregistrasi'
                ORDER BY 
                    ddt.tglinputdiagnosa ASC;
            "));
            foreach ($diagnosa9 as $d9) {
                $diagnosatindakan = $diagnosatindakan . $d9->namadiagnosa . "\n";
            }


            //--x---
            $diagnosa10 = DB::select(DB::raw("
            SELECT
            dg.kddiagnosa || ' - ' || dg.namadiagnosa AS namadiagnosakd,
                    dg.ID,
                    pd.noregistrasi,
                    pd.tglregistrasi,
                    apd.objectruanganfk,
                    ru.namaruangan,
                    apd.norec AS norec_apd,
                    ddp.objectdiagnosafk,
                    dg.kddiagnosa,
                    dg.namadiagnosa,
                    ddp.objectjenisdiagnosafk,
                    jd.jenisdiagnosa,
                    dp.norec AS norec_diagnosapasien,
                    ddp.norec AS norec_detaildpasien,
                    dp.ketdiagnosis,
                    ddp.keterangan,
                    ddp.tglinputdiagnosa,
                    apd.tglkeluar 
                FROM
                    pasiendaftar_t AS pd
                    JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
                    JOIN ruangan_m AS ru ON ru.ID = apd.objectruanganfk
                    LEFT JOIN diagnosapasien_t AS dp ON dp.noregistrasifk = apd.norec
                    LEFT JOIN detaildiagnosapasien_t AS ddp ON ddp.objectdiagnosapasienfk = dp.norec
                    LEFT JOIN diagnosa_m AS dg ON dg.ID = ddp.objectdiagnosafk
                    LEFT JOIN jenisdiagnosa_m AS jd ON jd.ID = ddp.objectjenisdiagnosafk 
                WHERE
                    ru.objectdepartemenfk IN ( 18, 16, 24, 28, 73, 74 ) 
                    AND pd.noregistrasi = '$noregistrasi' 
                ORDER BY
                    jd.jenisdiagnosa ASC;
            "));


            foreach ($diagnosa10 as $dg) {
                if ($dg->jenisdiagnosa == 'Primary') {
                    $diagnosautama = $diagnosautama . $dg->namadiagnosakd . "\n";
                } else if ($dg->jenisdiagnosa == 'Diagnosa Awal') {
                    $diagnosaawal = $diagnosaawal . $dg->namadiagnosakd . "\n";
                } else {
                    $diagnosasekunder = $diagnosasekunder . $dg->namadiagnosakd . "\n";
                }
            }
        }

        if ($diagnosaawal == 'Diagnosis Awal : ') {
            $diagnosaawal = '';
        }
        if ($diagnosasekunder == 'Diagnosis Sekunder : ') {
            $diagnosasekunder = '';
        }
        if ($diagnosautama == 'Diagnosis Primer / Utama : ') {
            $diagnosautama = '';
        }
        //--------------------kemenkes--------------------------------------------
        $dataPasienKemenkes = [];
        if ($xcetakkemenkes == 1) {
            $dataPasienKemenkes = DB::select(DB::raw("
                WITH CTE AS (
                SELECT
                sp.namaexternal as carapulang,
                jk.jeniskelamin,
                EXTRACT(YEAR FROM AGE(ps.tgllahir)) AS umurtahun,
                EXTRACT(day FROM (NOW() - ps.tgllahir)) as umurhari,
                DATE_PART('day', pd.tglpulang::timestamp - pd.tglregistrasi::timestamp) + 1 AS los,
                    cmi.namaexternal AS caramasuk,
                    pd.norec AS noregistrasifk,
                    pas.nosep,
                    hg.cbgcode,
                    pd.noregistrasi,
                    kls2.namakelas AS namakelas,
                    TO_CHAR(ps.tgllahir, 'DD/MM/YYYY') AS tgllahir,
                    pg.namalengkap AS namadokter,
                    pd.objectstatuspulangfk,
                    pd.objectruanganlastfk,
                    pd.nocmfk,
                    pd.beratbayi,
                    pv.jmljam,
                    pv.mulai,
                    pv.selesai,
                    pv.norec AS norecpv,
                    dbb.beratbadan,
                    dbb.appearance,
                    dbb.appearance2,
                    dbb.pulse,
                    dbb.pulse2,
                    dbb.grimace,
                    dbb.grimace2,
                    dbb.activity,
                    dbb.activity2,
                    dbb.respiration,
                    dbb.respiration2,
                    dbb.kantongdarah,
                    dbb.dializer,
                    hg.cbgdescription,
                    ps.nocm,
                    ps.namapasien,
                    ps.objectjeniskelaminfk,
                    kls2.nourut AS nokelasdijamin,
                    ps.noidentitas,
                    pd.caramasukinacbgfk,
                    cmi.kodeexternal AS kodecaramasuk,
                    pd.sistoleinacbg,
                    pd.diastoleinacbg,
                    nki.nama AS namanaikkelas,
                    TO_CHAR(pd.tglregistrasi, 'DD/MM/YYYY') AS tglmasuk,
                    ps.nobpjs AS nokepesertaan,
                    TO_CHAR(pd.tglpulang, 'DD/MM/YYYY') AS tglpulang,
                    CASE 
                        WHEN pd.objectkelompokpasienlastfk = 2 THEN 'JKN' 
                        ELSE 'Belum Dimapping' 
                    END AS jaminan,
                    CASE 
                        WHEN pd.objectkelompokpasienlastfk = 2 THEN '3' 
                        ELSE 'Belum Dimapping' 
                    END AS kodejaminan,
                    CASE 
                        WHEN ru.objectdepartemenfk = 18 THEN 'Rawat Jalan' 
                        WHEN ru.objectdepartemenfk = 16 THEN 'Rawat Inap' 
                        ELSE 'Rawat Jalan' 
                    END AS tipe,
                    CASE 
                        WHEN pas.polirujukankode = 'RJ' AND ru.objectdepartemenfk = 16 THEN '2' 
                        WHEN pas.polirujukankode <> 'RJ' AND ru.objectdepartemenfk = 16 THEN '1' 
                        ELSE '2' 
                    END AS jenisrawat,
                    hg.status AS statusgrouping,
                    COALESCE(hg.totalpiutangpenjamin, 0) AS totalpiutangpenjamin,
                    hg.biayanaikkelas,
										ROW_NUMBER() OVER (PARTITION BY pd.norec) AS row_num
                FROM pasiendaftar_t AS pd
                JOIN pemakaianasuransi_t AS pas ON pas.noregistrasifk = pd.norec
                LEFT JOIN batalregistrasi_t AS br ON br.pasiendaftarfk = pd.norec
                LEFT JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                LEFT JOIN rekanan_m AS rk ON rk.id = pd.objectrekananfk
                JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                LEFT JOIN departemen_m AS dept ON dept.id = ru.objectdepartemenfk
                LEFT JOIN hasilgrouping_t AS hg ON hg.noregistrasifk = pd.norec
                LEFT JOIN asuransipasien_m AS asu ON asu.id = pas.objectasuransipasienfk
                LEFT JOIN kelas_m AS kls ON kls.id = pd.objectkelasfk
                LEFT JOIN kelas_m AS kls2 ON kls2.id = asu.objectkelasdijaminfk
                LEFT JOIN pegawai_m AS pg ON pg.id = pd.objectpegawaifk
                LEFT JOIN diagnosaberatbadanbayi_t AS dbb ON dbb.noregistrasifk = pd.norec
                LEFT JOIN pemakaianventilator_t AS pv ON pv.norecpd = pd.norec
                LEFT JOIN naikkelasinacbg_m AS nki ON nki.id = pd.upgradeclasspayorinacbg
                LEFT JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec AND apd.objectruanganfk = pd.objectruanganlastfk
                LEFT JOIN asalrujukan_m AS ar ON ar.id = apd.objectasalrujukanfk
                LEFT JOIN caramasukinacbg_m AS cmi ON cmi.asalrujukanfk = ar.id
                LEFT JOIN jeniskelamin_m AS jk ON jk.id = ps.objectjeniskelaminfk
                LEFT JOIN statuspulang_m AS sp on sp.id = pd.objectstatuspulangfk
                WHERE br.norec IS NULL
                AND pd.objectrekananfk <> '5906'
                AND pd.tglpulang IS NOT NULL
                AND pd.noregistrasi = '$noregistrasi'
                ) SELECT
                carapulang,
                jeniskelamin,
                umurtahun,
                umurhari,
                los,
                    caramasuk,
                    noregistrasifk,
                    nosep,
                    cbgcode,
                    noregistrasi,
                    namakelas,
                    tgllahir,
                    namadokter,
                    objectstatuspulangfk,
                    objectruanganlastfk,
                    nocmfk,
                    beratbayi,
                    jmljam,
                    mulai,
                    selesai,
                    norecpv,
                    beratbadan,
                    appearance,
                    appearance2,
                    pulse,
                    pulse2,
                    grimace,
                    grimace2,
                    activity,
                    activity2,
                    respiration,
                    respiration2,
                    kantongdarah,
                    dializer,
                    cbgdescription,
                    nocm,
                    namapasien,
                    objectjeniskelaminfk,
                    nokelasdijamin,
                    noidentitas,
                    caramasukinacbgfk,
                    caramasuk,
                    kodecaramasuk,
                    sistoleinacbg,
                    diastoleinacbg,
                    namanaikkelas,
                    tglmasuk,
                    nokepesertaan,
                    tglpulang,
                    jaminan,
                    kodejaminan,
                    tipe,
                    jenisrawat,
                    statusgrouping,
                    totalpiutangpenjamin,
                    biayanaikkelas
                    FROM
                        CTE
                    WHERE
                        row_num = 1
                    "));

            // $dataIcd10Pasien = DB::select(DB::raw("
            //     SELECT
            //         dg.ID,
            //         pd.noregistrasi,
            //         pd.tglregistrasi,
            //         apd.objectruanganfk,
            //         ru.namaruangan,
            //         apd.norec AS norec_apd,
            //         ddp.objectdiagnosafk,
            //         dg.kddiagnosa,
            //         dg.namadiagnosa,
            //         ddp.objectjenisdiagnosafk,
            //         jd.jenisdiagnosa,
            //         dp.norec AS norec_diagnosapasien,
            //         ddp.norec AS norec_detaildpasien,
            //         dp.ketdiagnosis,
            //         ddp.keterangan,
            //         ddp.tglinputdiagnosa,
            //         apd.tglkeluar 
            //     FROM
            //         pasiendaftar_t AS pd
            //         JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
            //         JOIN ruangan_m AS ru ON ru.ID = apd.objectruanganfk
            //         LEFT JOIN diagnosapasien_t AS dp ON dp.noregistrasifk = apd.norec
            //         LEFT JOIN detaildiagnosapasien_t AS ddp ON ddp.objectdiagnosapasienfk = dp.norec
            //         LEFT JOIN diagnosa_m AS dg ON dg.ID = ddp.objectdiagnosafk
            //         LEFT JOIN jenisdiagnosa_m AS jd ON jd.ID = ddp.objectjenisdiagnosafk 
            //     WHERE
            //         ru.objectdepartemenfk IN ( 18, 16, 24, 28, 73, 74 ) 
            //         AND pd.noregistrasi = '$noregistrasi' 
            //     ORDER BY
            //         jd.jenisdiagnosa ASC;
            // "));
            $dataIcd10Pasien = \DB::table('pasiendaftar_t as pd')
                ->select(
                    'dg.id',
                    'pd.noregistrasi',
                    'pd.tglregistrasi',
                    'apd.objectruanganfk',
                    'ru.namaruangan',
                    'apd.norec as norec_apd',
                    'ddp.objectdiagnosafk',
                    'dg.kddiagnosa',
                    'dg.namadiagnosa',
                    'ddp.objectjenisdiagnosafk',
                    'jd.jenisdiagnosa',
                    'dp.norec as norec_diagnosapasien',
                    'ddp.norec as norec_detaildpasien',
                    'dp.ketdiagnosis',
                    'ddp.keterangan',
                    'ddp.tglinputdiagnosa',
                    'apd.tglkeluar'
                )
                ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
                ->join('diagnosapasien_t as dp', 'dp.noregistrasifk', '=', 'apd.norec')
                ->join('detaildiagnosapasien_t as ddp', 'ddp.objectdiagnosapasienfk', '=', 'dp.norec')
                ->join('diagnosa_m as dg', 'dg.id', '=', 'ddp.objectdiagnosafk')
                ->join('jenisdiagnosa_m as jd', 'jd.id', '=', 'ddp.objectjenisdiagnosafk')
                ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'ddp.objectpegawaifk')
                ->whereIn('ru.objectdepartemenfk', [18, 16, 24, 28, 73, 74])
                ->where('pd.noregistrasi', $noregistrasi)
                ->orderBy('jd.jenisdiagnosa', 'asc');

            $dataIcd10Pasien = $dataIcd10Pasien->get();
            $icd10primary = '';
            $icd10secondary = [];
            foreach ($dataIcd10Pasien as $diagnosa) {
                if ($diagnosa->objectjenisdiagnosafk == 1) {
                    $icd10primary = $diagnosa->kddiagnosa . ' ' . $diagnosa->namadiagnosa;
                } elseif ($diagnosa->objectjenisdiagnosafk == 2) {
                    $icd10secondary[] = $diagnosa->kddiagnosa . ' ' . $diagnosa->namadiagnosa;
                }
            }

            // =======================================
            // AMBIL INACBG DIAGNOSA
            // =======================================
            $inacbgDiagnosaRaw = DB::table('pasiendaftar_t')
                ->select('inacbg_diagnosa_set_request')
                ->where('noregistrasi', $noregistrasi)
                ->first();

            $icd10primary_inacbg = '';
            $icd10secondary_inacbg = [];

            if ($inacbgDiagnosaRaw && $inacbgDiagnosaRaw->inacbg_diagnosa_set_request) {
                $decoded = json_decode($inacbgDiagnosaRaw->inacbg_diagnosa_set_request, true);

                // --- CASE 1: Format expanded (baru)
                if (isset($decoded['data']['expanded']) && is_array($decoded['data']['expanded'])) {
                    foreach ($decoded['data']['expanded'] as $item) {
                        if (!isset($item['no'], $item['code'])) continue;

                        $code = $item['code'];
                        $diagnosa = DB::table('diagnosa_m')->where('kddiagnosa', $code)->first();
                        $nama = $diagnosa ? $diagnosa->namadiagnosa : '';

                        if ($item['no'] === '1') {
                            $icd10primary_inacbg = $code . ' - ' . $nama;
                        } else {
                            $icd10secondary_inacbg[] = $code . ' - ' . $nama;
                        }
                    }
                }

                // --- CASE 2: Format diagnosa string (contoh: "Z49.1#N18.5")
                elseif (isset($decoded['data']['diagnosa'])) {
                    $diagnosaString = $decoded['data']['diagnosa'];
                    $codes = explode('#', $diagnosaString);

                    foreach ($codes as $index => $code) {
                        $code = trim($code);
                        if ($code === '') continue;

                        $diagnosa = DB::table('diagnosa_m')->where('kddiagnosa', $code)->first();
                        $nama = $diagnosa ? $diagnosa->namadiagnosa : '';

                        if ($index === 0) {
                            $icd10primary_inacbg = $code . ' - ' . $nama;
                        } else {
                            $icd10secondary_inacbg[] = $code . ' - ' . $nama;
                        }
                    }
                }
            }

            // =======================================
            // AMBIL INACBG PROCEDURE
            // =======================================
            $inacbgProcedureRaw = DB::table('pasiendaftar_t')
                ->select('inacbg_procedure_set_request')
                ->where('noregistrasi', $noregistrasi)
                ->first();

            $icd9_inacbg = [];

            if ($inacbgProcedureRaw && $inacbgProcedureRaw->inacbg_procedure_set_request) {
                $decodedProc = json_decode($inacbgProcedureRaw->inacbg_procedure_set_request, true);

                // --- CASE 1: Format expanded
                if (isset($decodedProc['data']['expanded']) && is_array($decodedProc['data']['expanded'])) {
                    foreach ($decodedProc['data']['expanded'] as $item) {
                        if (!isset($item['code'])) continue;

                        $code = $item['code'];
                        $tindakan = DB::table('diagnosatindakan_m')->where('kddiagnosatindakan', $code)->first();
                        $nama = $tindakan ? $tindakan->namadiagnosatindakan : '';

                        $icd9_inacbg[] = $code . ' - ' . $nama;
                    }
                }

                // --- CASE 2: Format procedure string (contoh: "96.04#99.15")
                elseif (isset($decodedProc['data']['procedure'])) {
                    $procedureString = $decodedProc['data']['procedure'];
                    $codes = explode('#', $procedureString);

                    foreach ($codes as $code) {
                        $code = trim($code);
                        if ($code === '') continue;

                        $tindakan = DB::table('diagnosatindakan_m')->where('kddiagnosatindakan', $code)->first();
                        $nama = $tindakan ? $tindakan->namadiagnosatindakan : '';

                        $icd9_inacbg[] = $code . ' - ' . $nama;
                    }
                }
            }

            $dataIcd9Pasien = DB::select(DB::raw("
                SELECT 
                    pd.noregistrasi,
                    pd.tglregistrasi,
                    apd.objectruanganfk,
                    ru.namaruangan,
                    apd.norec AS norec_apd,
                    ddt.objectdiagnosatindakanfk,
                    dt.kddiagnosatindakan,
                    dt.namadiagnosatindakan,
                    dtp.norec AS norec_diagnosapasien,
                    ddt.norec AS norec_detaildpasien,
                    dt.*,
                    ddt.keterangantindakan,
                    pg.namalengkap,
                    ddt.tglinputdiagnosa,
                    ddt.jumlah
                FROM 
                    pasiendaftar_t AS pd
                JOIN 
                    antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
                JOIN 
                    ruangan_m AS ru ON ru.id = apd.objectruanganfk
                JOIN 
                    diagnosatindakanpasien_t AS dtp ON dtp.objectpasienfk = apd.norec
                JOIN 
                    detaildiagnosatindakanpasien_t AS ddt ON ddt.objectdiagnosatindakanpasienfk = dtp.norec
                JOIN 
                    diagnosatindakanidrg_m AS dt ON dt.id = ddt.objectdiagnosatindakanfk
                LEFT JOIN 
                    pegawai_m AS pg ON pg.id = ddt.objectpegawaifk
                WHERE 
                    pd.noregistrasi = '$noregistrasi'
                ORDER BY 
                    ddt.tglinputdiagnosa ASC;
            "));
        }

        //---------------------radiologi-------------------------------------------
        $ekspertise = [];
        $idorder = '';
        $umur = '';
        $nokepesertaan = '';
        $nosep = '';
        $ruanganasal = '';
        $namalengkap = '';
        $tanggal = '';
        $tanggalcetak = '';
        $namaproduk = '';
        $keterangan = '';
        $umurrad = '';
        $dokterrad = '';
        $nippns = '';
        $qrdpjpradiologi = '';

        // if ($xcetakrad == 1) {
        //     $ekspertise = collect(DB::select("
        //     SELECT 
        //             pd.noregistrasi,
        //             kps.kelompokpasien,
        //             pg.namalengkap,
        //             pr.namaproduk,
        //             ru.namaruangan as ruanganasal,
        //             ru2.namaruangan,
        //             pa.nosep,
        //             ps.nobpjs,
        //             ps.nocm,
        //         he.*,
        //         pp.norec AS norecpp,
        //         pp.isclaim,
        //         pdk.mintime,
        //         pdk.maxtime
        //     FROM 
        //         hasilexpertise_t AS he
        //     JOIN 
        //         pelayananpasien_t AS pp ON pp.idorderpacs = he.idorder
        //     LEFT JOIN 
        //         antrianpasiendiperiksa_t AS apd ON apd.norec = pp.noregistrasifk
        //             LEFT JOIN pasiendaftar_t as pd on apd.noregistrasifk = pd.norec
        //             left join pasien_m as ps on ps.id = pd.nocmfk
        //             left JOIN pemakaianasuransi_t as pa ON pd.norec = pa.noregistrasifk
        //             LEFT JOIN kelompokpasien_m AS kps ON kps.ID = pd.objectkelompokpasienlastfk
        //             LEFT JOIN ruangan_m AS ru ON ru.ID = pd.objectruanganlastfk
        //             LEFT JOIN ruangan_m AS ru2 ON ru2.ID = apd.objectruanganfk
        //             LEFT JOIN pegawai_m AS pg ON pd.objectpegawaifk = pg.id
        //             LEFT JOIN produk_m AS pr ON pr.ID = pp.produkfk
        //     LEFT JOIN 
        //         produk_m AS pdk ON pdk.id = pp.produkfk
        //     WHERE 
        //         he.statusenabled = TRUE
        //         AND pd.noregistrasi = '$noregistrasi'
        //     "));
        //     if (count($ekspertise) > 0) {
        //         $umurrad = $this->getAge($ekspertise[0]->birthdate, date('Y-m-d'));
        //         $idorder = $ekspertise[0]->idorder;
        //         $umur = $umurrad;
        //         $nokepesertaan = $ekspertise[0]->nobpjs;
        //         $nosep = $ekspertise[0]->nosep;
        //         $ruanganasal = $ekspertise[0]->ruanganasal;
        //         $namalengkap = $ekspertise[0]->name;
        //         $tanggal = $ekspertise[0]->orderdate;
        //         $tanggalcetak = $ekspertise[0]->reportdate;
        //         $namaproduk = $ekspertise[0]->namaproduk;
        //         $keterangan = $ekspertise[0]->description;
        //         $dokterrad = $ekspertise[0]->doctorname;
        //         // $nippns = $ekspertise[0]->nippns;
        //     }
        // }

        if ($xcetakrad == 1) {
            $ekspertise = collect(DB::select("
            WITH CTE AS (SELECT so.tanggalbacaradiologi, so.nofoto as idorder, ps.nocm, ps.namapasien as name, ps.tgllahir,	to_char(ps.tgllahir, 'DD TMMonth YYYY') AS tgllahir2,(kp.kelompokpasien || ' / ' || case when jks.namaexternal is null then '-' else 'Jaminan Khusus   : ' || jks.namaexternal end ) as  kelompokpasien,
            ru.namaruangan, so.tanggal as orderdate,pp.tglpelayanan as tanggal, jk.jeniskelamin as sex, CASE WHEN alm.alamatlengkap IS NULL 
                         THEN '-' ELSE (alm.alamatlengkap || ' ' || ds.namadesakelurahan || ' ' || kc.namakecamatan || ' ' || kk.namakotakabupaten || ' ' || pro.namapropinsi) END AS address, pg.namalengkap AS doctor, 
                         pg2.namalengkap AS doctorname, pr.namaproduk, so.keterangan as description, pd.noregistrasi, pg2.nosip, pg2.id AS pgid, pemakaianasuransi_t.nokepesertaan, pemakaianasuransi_t.nosep, so.tanggalcetak as reportdate, pegawai_m.namalengkap, 
                         ruangan_m.namaruangan AS ruanganasal,pg2.ttd,op.diagnosa,
												 ROW_NUMBER() OVER (PARTITION BY so.norec) AS row_num
            FROM ruangan_m RIGHT OUTER JOIN
             pegawai_m RIGHT OUTER JOIN
             hasilradiologi_t AS so INNER JOIN
             pasiendaftar_t AS pd ON pd.norec = so.noregristrasifk INNER JOIN
             pasien_m AS ps ON ps.id = pd.nocmfk INNER JOIN
             kelompokpasien_m AS kp ON kp.id = pd.objectkelompokpasienlastfk INNER JOIN
             ruangan_m AS ru ON ru.id = pd.objectruanganlastfk INNER JOIN
             pelayananpasien_t AS pp ON pp.norec = so.pelayananpasienfk LEFT OUTER JOIN
             orderpelayanan_t AS op ON op.strukorderfk = pp.strukorderfk INNER JOIN
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
            pd.noregistrasi = '$noregistrasi'
     
            AND so.statusenabled = 'y')
						SELECT
						tanggalbacaradiologi,
						idorder,
						nocm,
						name,
						tgllahir,
						tgllahir2,
						kelompokpasien,
						namaruangan,
						orderdate,
						tanggal,
						sex,
						address,
						doctor,
						doctorname,
						namaproduk,
						description,
						noregistrasi,
						nosip,
						pgid,
						nokepesertaan,
						nosep,
						reportdate,
						namalengkap,
						ruanganasal,
						ttd,
                        diagnosa
						FROM
							CTE
						WHERE
							row_num = 1
            "));
            if (count($ekspertise) > 0) {
                $umurrad = $this->getAge($ekspertise[0]->tgllahir, date('Y-m-d'));
                $idorder = $ekspertise[0]->idorder;
                $umur = $umurrad;
                $nokepesertaan = $ekspertise[0]->nokepesertaan;
                $nosep = $ekspertise[0]->nosep;
                $ruanganasal = $ekspertise[0]->ruanganasal;
                $namalengkap = $ekspertise[0]->name;
                $tanggal = $ekspertise[0]->orderdate;
                $tanggalcetak = $ekspertise[0]->reportdate;
                $namaproduk = $ekspertise[0]->namaproduk;
                $keterangan = $ekspertise[0]->description;
                $dokterrad = $ekspertise[0]->doctorname;
                // $nippns = $ekspertise[0]->nippns;
            }
        }
        // -----------------------------lab----------------------------------
        $validatorlab = '';
        $qrvalidatorlab = '';
        $validatorlabgdt = '';
        $qrvalidatorlabgdt = '';
        if ($xcetaklab == 1) {
            $hasillab = collect(DB::select("
            WITH CTE AS (
                SELECT *,
                       ROW_NUMBER() OVER (PARTITION BY 
                                            tglpelayanan, 
                                            nourutjenispemeriksaan, 
                                            nourutdetail,
                                            ruanganperejuk, 
                                            ruanganperejuk1,
                                            nocm, 
                                            noregistrasi, 
                                            noorder, 
                                            namapasien, 
                                            alamatlengkap, 
                                            namadesakelurahan, 
                                            namakecamatan, 
                                            namakotakabupaten, 
                                            kelompokpasien, 
                                            namarekanan, 
                                            tglregistrasi, 
                                            tglRegiss,
                                            tglawal, 
                                            dokterperiksa, 
                                            dokterperiksaedi, 
                                            tgllahir, 
                                            tglLahirs,
                                            detailjenisproduk, 
                                            namaproduk, 
                                            detailpemeriksaan, 
                                            memohasil, 
                                            satuanstandar, 
                                            nilaitext, 
                                            nilaimin, 
                                            nilaimax, 
                                            hasil, 
                                            jeniskelamin, 
                                            tglverif, 
                                            tglakhir, 
                                            FLAG, 
                                            hasil_s, 
                                            hasil_i, 
                                            catatan, 
                                            jenispemeriksaan,
                                            nourutdetailjenispemeriksaanlab
                                         ORDER BY
                                            nourutdetailjenispemeriksaanlab ASC, 
                                            nourutjenispemeriksaan ASC) AS rn
                FROM (
                    SELECT
                        pp.tglpelayanan,
                        maps.nourutjenispemeriksaan,
                        maps.nourutdetail,
                        rj.namaruangan AS ruanganperejuk,
                        rj2.namaruangan AS ruanganperejuk1,
                        pm.nocm,
                        pd.noregistrasi,
                        so.noorder,
                        pm.namapasien,
                        alm.alamatlengkap,
                        alm.namadesakelurahan,
                        alm.namakecamatan,
                        alm.namakotakabupaten,
                        kp.kelompokpasien,
                        rkn.namarekanan,
                        pd.tglregistrasi,
                        to_char(pd.tglregistrasi, 'MON-DD-YYYY HH12:MIPM'::text) AS tglRegiss,
                        pp.tglpelayanan AS tglawal,
                        pg1.namalengkap AS dokterperiksa,
                        pg2.namalengkap AS dokterperiksaedi,
                        pm.tgllahir,
                        to_char ( pm.tgllahir,  'MON-DD-YYYY HH12:MIPM'::text) AS tglLahirs,
                        djp.detailjenisproduk,
                        prd.namaproduk,
                        maps.detailpemeriksaan,
                        maps.memohasil,
                        CASE
                            WHEN pp.produkfk IN (100061) THEN 'µIU/mL'
                            WHEN pp.produkfk IN (501404) THEN 'pmol/L'
                            ELSE ss.satuanstandar
                        END AS satuanstandar,
                        CASE
                            WHEN pp.produkfk IN (100048, 100070) AND nn.nilaitext = 'Negatif' THEN '< 0,9 Negatif'
                            WHEN pp.produkfk IN (100048, 100070) AND nn.nilaitext = 'Positif' THEN '> 1,1 Positif'
                            WHEN pp.produkfk IN (100048, 100070) AND nn.nilaitext = 'Indeterminate' THEN '> 0,9 COI < 1,1'
                            WHEN pp.produkfk IN (100061) THEN '0,4 - 4,0'
                            WHEN pp.produkfk IN (501404) THEN '9 - 22'
                            ELSE nn.nilaitext
                        END AS nilaitext,
                        nn.nilaimin,
                        nn.nilaimax,
                        hh.hasil,
                        jk.jeniskelamin,
                        apd.tglmasuk AS tglverif,
                        hh.tglhasil AS tglakhir,
                        hh.FLAG,
                        hh.hasil_s,
                        hh.hasil_i,
                        hh.catatan,
                        detailjenisproduk_m.detailjenisproduk as jenispemeriksaan,
                        case when prd.nourutdetailjenispemeriksaanlab is null then 9999 else prd.nourutdetailjenispemeriksaanlab end as nourutdetailjenispemeriksaanlab
                        FROM pelayananpasien_t AS pp
                        INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.norec = pp.noregistrasifk
                        INNER JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk
                        LEFT OUTER JOIN strukorder_t AS so ON so.norec = apd.objectstrukorderfk
                        LEFT OUTER JOIN ruangan_m AS rj ON pd.objectruanganlastfk = rj.ID
                        LEFT OUTER JOIN ruangan_m AS rj2 ON apd.objectruanganasalfk = rj2.ID
                        INNER JOIN pasien_m AS pm ON pm.ID = pd.nocmfk
                        LEFT OUTER JOIN jeniskelamin_m AS jk ON jk.ID = pm.objectjeniskelaminfk
                        LEFT OUTER JOIN alamat_m AS alm ON alm.nocmfk = pm.ID
                        LEFT OUTER JOIN kelompokpasien_m AS kp ON kp.ID = pd.objectkelompokpasienlastfk
                        LEFT OUTER JOIN rekanan_m AS rkn ON rkn.ID = pd.objectrekananfk
                        LEFT OUTER JOIN pegawai_m AS pg ON pg.ID = so.objectpegawaiorderfk
                        LEFT OUTER JOIN pegawai_m AS pg1 ON pg1.ID = apd.objectpegawaifk
                        LEFT OUTER JOIN produk_m AS prd ON prd.ID = pp.produkfk
                        LEFT OUTER JOIN pelayananpasienpetugas_t AS p3 ON pp.norec = p3.pelayananpasien
                        INNER JOIN pegawai_m AS pg2 ON pg2.ID = p3.objectpegawaifk
                        INNER JOIN detailjenisproduk_m AS djp ON djp.ID = prd.objectdetailjenisprodukfk
                        INNER JOIN maphasillab_m AS maps ON maps.produkfk = prd.ID
                        INNER JOIN maphasillabdetail_m AS maps2 ON maps2.maphasilfk = maps.ID
                        AND maps2.kelompokumurfk IN (
                            SELECT
                                ID
                            FROM
                                kelompokumur_m AS kuu
                        )
                        LEFT OUTER JOIN pegawai_m AS pg3 ON pg3.ID = p3.objectpegawaifk
                        AND p3.objectpegawaifk = '4'
                        INNER JOIN nilainormal_m AS nn ON nn.ID = maps2.nilainormalfk
                        LEFT OUTER JOIN satuanstandar_m AS ss ON ss.ID = maps.satuanstandarfk
                        LEFT OUTER JOIN hasillaboratorium_t AS hh ON hh.norecpelayanan = pp.norec
                        AND pp.noregistrasifk = hh.noregistrasifk
                        AND maps.detailpemeriksaan = hh.detailpemeriksaan
                        AND maps.ID = hh.maphasilfk
                        LEFT OUTER JOIN detailjenisproduk_m AS detailjenisproduk_m ON detailjenisproduk_m.id = prd.detailjenispemeriksaanlabfk
                        WHERE apd.noregistrasifk = '$norecpd'
                        AND pg2.objectjenispegawaifk=1 
                        AND hh.hasil IS NOT NULL
                    ) AS data
                )
            SELECT * 
            FROM CTE
            WHERE rn = 1
            ORDER BY 
                nourutdetailjenispemeriksaanlab ASC, 
                nourutjenispemeriksaan ASC"));
            // $groupedHasillab = $hasillab->groupBy(function ($item) {
            //     return \Carbon\Carbon::parse($item->tglpelayanan)->format('Y-m-d');
            // })->toArray();
            $groupedHasillab = $hasillab->groupBy(function ($item) {
                return $item->tglpelayanan;
            })->toArray();
            ksort($groupedHasillab);
            if (count($hasillab) > 0) {
                if ($hasillab[0]->dokterperiksaedi != null) {
                    $validatorlab = $hasillab[0]->dokterperiksaedi;
                } else {
                    $validatorlab = 'Data tidak tersedia';
                }
                $qrCodeValidatorLab = new QrCode('"' . $validatorlab . '"');
                header('Contert-Type: application/' . $qrCodeValidatorLab->getContentType());
                $qrvalidatorlab = $qrCodeValidatorLab->writeDataUri();
            }

            // --------------------- gdt lab ---------------------
            $hasillabgdt = collect(DB::select("
            SELECT        ps.nocm, ps.namapasien, to_char( ps.tgllahir, 'YYYY-MM-DD') AS tgllahir, kp.kelompokpasien, ru.namaruangan, so.tanggal, DATE_PART( 'year', now( ) :: TIMESTAMP ) - DATE_PART( 'year', ps.tgllahir :: TIMESTAMP ) AS umur,jk.jeniskelamin, CASE WHEN alm.alamatlengkap IS NULL
                         THEN '-' ELSE (alm.alamatlengkap || ' ' || ds.namadesakelurahan || ' ' || kc.namakecamatan || ' ' || kk.namakotakabupaten || ' ' || pro.namapropinsi) END AS alamatlengkap,
                         CASE WHEN so.dokterperujuk = 1 THEN '-' ELSE pg3.namalengkap END AS dokterperujuk,  pg.namalengkap AS perujuk,
                         CASE WHEN pg2.ID IS NOT NULL
							THEN concat('http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-new?idPegawai=', CAST ( pg2.ID AS VARCHAR ))
							ELSE 'Data Tidak Ditemukan'
                            END AS qrdokterrad,
						 pg2.namalengkap AS dokterrad,
						 pr.namaproduk, pd.noregistrasi, so.expertise, so.diagnosaklinik
                         FROM hasilpemeriksaanlab_t AS so INNER JOIN
                         pasiendaftar_t AS pd ON pd.norec = so.noregistrasifk INNER JOIN
                         pasien_m AS ps ON ps.id = pd.nocmfk INNER JOIN
                         kelompokpasien_m AS kp ON kp.id = pd.objectkelompokpasienlastfk INNER JOIN
                         ruangan_m AS ru ON ru.id = pd.objectruanganlastfk INNER JOIN
                         pelayananpasien_t AS pp ON pp.norec = so.pelayananpasienfk INNER JOIN
                         produk_m AS pr ON pr.id = pp.produkfk LEFT OUTER JOIN
                         jeniskelamin_m AS jk ON jk.id = ps.objectjeniskelaminfk LEFT OUTER JOIN
                         kelompokpasien_m AS kps ON kps.id = pd.objectkelompokpasienlastfk LEFT OUTER JOIN
                         alamat_m AS alm ON alm.nocmfk = ps.id LEFT OUTER JOIN
                         desakelurahan_m AS ds ON ds.id = alm.objectdesakelurahanfk LEFT OUTER JOIN
                         kotakabupaten_m AS kk ON kk.id = alm.objectkotakabupatenfk LEFT OUTER JOIN
                         kecamatan_m AS kc ON kc.id = alm.objectkecamatanfk LEFT OUTER JOIN
                         propinsi_m AS pro ON pro.id = alm.objectpropinsifk LEFT OUTER JOIN
                         pegawai_m AS pg ON pg.id = pd.objectpegawaifk LEFT OUTER JOIN
                         pegawai_m AS pg2 ON pg2.id = so.pegawaifk LEFT OUTER JOIN
                         pegawai_m AS pg3 ON pg3.id = so.dokterperujuk
                         WHERE        (pd.noregistrasi = '$noregistrasi') AND (so.statusenabled = true)"));
            if (count($hasillabgdt) > 0) {
                if ($hasillabgdt[0]->dokterrad != null) {
                    $validatorlabgdt = $hasillabgdt[0]->dokterrad;
                } else {
                    $validatorlabgdt = 'Data tidak tersedia';
                }
                $qrCodeValidatorLabgdt = new QrCode('"' . $validatorlabgdt . '"');
                header('Contert-Type: application/' . $qrCodeValidatorLabgdt->getContentType());
                $qrvalidatorlabgdt = $qrCodeValidatorLabgdt->writeDataUri();
            }
        }
        //----------------------sep------------------------------------------
        $sep = [];
        $qrCodePSep = '';
        $qrCodePSep2 = '';
        if ($xcetaksep == 1) {
            $sep = DB::select(DB::raw(
                "select '' as cob, pd.objectjenispasienfk, pa.namadjpjpmelayani,pa.polirujukannama as namaruangan,pa.nosep,pa.tanggalsep as tanggalsep,pa.nokepesertaan,pi.nocm,pd.noregistrasi, 
                        pa.norujukan,case when ap.namapeserta != '' then ap.namapeserta || '(' || jk.jeniskelamin || ')' else pi.namapasien || '(' || jk.jeniskelamin || ')' end as namapeserta2,pi.tgllahir,jk.jeniskelamin, 
                        rp.namaruangan as namaruangans,rp.kdinternal as namapolibpjs,pa.ppkrujukan, case when ap.namapeserta != '' then ap.namapeserta else pi.namapasien end as namapeserta,
                        --(CASE WHEN rp.objectdepartemenfk=16 AND pd.objectjenispasienfk=1 OR  rp.objectdepartemenfk=16 AND pd.objectjenispasienfk IS NULL then 'R. Inap' else 'R. Jalan' END) as jenisrawat, 
                        --case when pa.polirujukankode = 'RI' and rp.objectdepartemenfk='16' then 'R. Inap' else 'R. Jalan' end as jenisrawat,
                        case when rp.objectdepartemenfk='16' then 'R. Inap' else 'R. Jalan' end as jenisrawat,
                        dg.kddiagnosa, (case when dg.namadiagnosa is null then '-' else dg.namadiagnosa end) as namadiagnosa , 
                        ap.jenispeserta,ap.kdprovider,ap.nmprovider, pa.catatan, 
                        --(case when rp.objectdepartemenfk=16 then kls2.namakelas else '-' end) as namakelas, 
                        --(case when rp.objectdepartemenfk=16 then kls.namakelas else '-' end) as namakelas, 
                        (case when pa.polirujukankode='RI' then kls2.namakelas else '-' end) as namakelas,
                        (case when pa.polirujukankode='RI' then kls.namakelas else '-' end) as namakelas,
                        kls.namakelas as namakelashak, 
                        ap.notelpmobile,pa.penjaminlaka,
                        (case when pa.penjaminlaka='1' then 'Jasa Raharja PT' 
                        when pa.penjaminlaka='2' then 'BPJS Ketenagakerjaan' 
                        when pa.penjaminlaka='3' then 'TASPEN PT' 
                        when pa.penjaminlaka='4' then 'ASABRI PT' 
                        Else '-' end) as penjaminlakalantas,case when pa.prolanisprb is null then '-' else pa.prolanisprb end as prolanisprb , tp.namaexternal as titlepasien , (kls.namakelas ) as namakelasDitanggung
                        ,case when pa.polirujukannama is null then rp.namaruangan || '(' || rp.kdinternal || ')' else pa.polirujukannama end as namaruanganfix
                        from pemakaianasuransi_t pa 
                        LEFT JOIN asuransipasien_m ap on pa.objectasuransipasienfk= ap.id 
                        LEFT JOIN pasiendaftar_t pd on pd.norec=pa.noregistrasifk 
                        LEFT JOIN pasien_m pi on pi.id=pd.nocmfk 
                        LEFT JOIN jeniskelamin_m jk on jk.id=pi.objectjeniskelaminfk 
                        LEFT JOIN ruangan_m rp on rp.id=pd.objectruanganlastfk 
                        LEFT JOIN diagnosa_m dg on pa.diagnosisfk=dg.id
                        LEFT JOIN kelas_m kls on kls.id=ap.objectkelasdijaminfk 
                        LEFT JOIN kelas_m kls2 on kls2.id=pd.objectkelasfk 
                        LEFT JOIN titlepasien_m tp on pi.objecttitlefk=tp.id 
                        where pd.noregistrasi = '$noregistrasi' 
                            and pa.nosep is not null"
            ));

            $validSep = true;
            $responseSEP = $this->cekSep($sep[0]->nosep);
            // dd($responseSEP);

            if (!isset($responseSEP['metaData']) || $responseSEP['metaData']->code != "200") {
                $validSep = false;
            }

            $qrCodePSep = new QrCode($sep[0]->nokepesertaan);
            echo "</br>";
            header('Contert-Type: application/' . $qrCodePSep->getContentType());
            $qrCodePSep2 = $qrCodePSep->writeDataUri();
        }
        // key 17-07-2024
        // ------------------------Triase IGD-------------------------
        if ($xcetaktriase == 1) {
            $dataTriaseIGD = [];
            $tgl = '';
            $nama = '';
            $noHp = '';
            $transportasi = '';
            $keluhanUtama = '';
            $tekananDarah = '';
            $pernapasan = '';
            $suhu = '';
            $Nadi = '';
            $spo2 = '';
            $kesadaran = '';
            $keadaanUmum = '';
            $beratBadan = '';
            $tinggiBadan = '';
            $e = '';
            $m = '';
            $v = '';
            $ats1 = '';
            $ats2 = '';
            $ats3 = '';
            $ats4 = '';
            $ats5 = '';
            $doa1 = '';
            $airway1 = '';
            $airway2 = '';
            $airway3 = '';
            $airway4 = '';
            $airway5 = '';
            $airwaydoa = '';
            $breathing1 = '';
            $breathing2 = '';
            $breathing3 = '';
            $breathing4 = '';
            $breathing5 = '';
            $breathing66 = '';
            $breathing6 = '';
            $breathing7 = '';
            $breathing8 = '';
            $breathing9 = '';
            $breathing10 = '';
            $circulation1 = '';
            $circulation2 = '';
            $circulation3 = '';
            $circulation4 = '';
            $circulation5 = '';
            $circulation6 = '';
            $circulation7 = '';
            $circulation8 = '';
            $circulation9 = '';
            $circulation100 = '';
            $circulation10 = '';
            $circulation11 = '';
            $circulation12 = '';
            $circulation13 = '';
            $circulation14 = '';
            $circulation15 = '';
            $circulation16 = '';
            $circulation17 = '';
            $circulation18 = '';
            $circulation19 = '';
            $circulation20 = '';
            $disability1 = '';
            $disability2 = '';
            $disability3 = '';
            $disability4 = '';
            $disability5 = '';
            $disability6 = '';
            $disability7 = '';
            $disability8 = '';
            $disability9 = '';
            $disability10 = '';
            $disability11 = '';
            $disability12 = '';
            $gawat1 = '';
            $gawattext2 = '';
            $gawattext3 = '';
            $gawat4 = '';
            $gawat5 = '';
            $gawat6 = '';
            $gawat7 = '';
            $gawat8 = '';
            $gawattext9 = '';
            $gawattext10 = '';
            $gawat11 = '';
            $gawat12 = '';
            $gawat13 = '';
            $gawat14 = '';
            $gawat15 = '';
            $gawattext16 = '';
            $gawattext17 = '';
            $gawat18 = '';
            $gawattext19 = '';
            $gawattext20 = '';
            $gawat21 = '';
            $gawat22 = '';
            $gawat23 = '';
            $gawat24 = '';
            $gawat25 = '';
            $gawat26 = '';
            $gawat27 = '';
            $gawat28 = '';
            $gawat29 = '';
            $gawat30 = '';
            $gawat31 = '';
            $hasilPasien = '';
            $pasienNyeri = '';
            $scoreNyeri = '';
            $lokasi = '';
            $durasi = '';
            $nyeriresusitasi = '';
            $nyeriberat = '';
            $nyerisedang = '';
            $nyeriringan = '';
            $nyerifalseemergency = '';
            $cara_datang_berjalan = '';
            $cara_datang_brankar = '';
            $cara_datang_kursi_roda = '';
            $cara_datang_digendong = '';
            $cara_datang_dibantu = '';
            $sudah_terpasang_infus = '';
            $sudah_terpasang_ngt = '';
            $sudah_terpasang_ett = '';
            $sudah_terpasang_lain = '';
            $sudah_terpasang_keterangan = '';
            $alasan_sendiri = '';
            $alasan_polisi = '';
            $alasan_ambulance = '';
            $alasan_rujukan = '';
            $alasan_rujukan_dari = '';
            $alasan_rujukan_untuk = '';
            $kendaraan_ambulance = '';
            $kendaraan_non_ambulance = '';
            $pengantar_nama = '';
            $pengantar_telp = '';
            $pengantar_hubungan = '';
            $kasus_trauma = '';
            $kasus_kll_tunggal = '';
            $kasus_kll = '';
            $kasus_vs1 = '';
            $kasus_vs2 = '';
            $kasus_trauma_lain = '';
            $kasus_tempat = '';
            $kasus_tempat_keterangan = '';
            $kasus_non_trauma = '';
            $kasus_tanggal = '';
            $kasus_waktu = '';
            $ttdPetugasTriase = '';
            $emrPasien = DB::table('emrpasien_t as ep')
                ->join('pegawai_m as pg', 'ep.pegawaifk', '=', 'pg.id')
                ->select('ep.noemr', 'ep.emrfk', 'ep.tglemr')
                ->where('ep.statusenabled', true)
                ->where('ep.emrfk', 697)
                ->where('ep.noregistrasifk', $noregistrasi)
                ->orderBy('ep.tglemr', 'desc')
                ->first();
            if ($emrPasien) {
                $detailTriase = DB::table('emrpasiend_t')
                    ->select('value', 'emrdfk')
                    ->where('emrpasienfk', $emrPasien->noemr)
                    ->where('emrfk', $emrPasien->emrfk)
                    // ->where('tgl', $emrPasien->tglemr)
                    ->get();
                if (count($detailTriase) > 0) {
                    foreach ($detailTriase as $tris) {
                        if ($tris->emrdfk == 1901300076) {
                            $nama = $tris->value;
                        } elseif ($tris->emrdfk == 1901300077) {
                            $noHp = $tris->value;
                        } elseif ($tris->emrdfk == 1901300078 && $tris->value == 1) {
                            $transportasi = 'AMBULANCE';
                        } elseif ($tris->emrdfk == 1901300079 && $tris->value == 1) {
                            $transportasi = 'MOBIL';
                        } elseif ($tris->emrdfk == 1901300080 && $tris->value == 1) {
                            $transportasi = 'MOTOR';
                        } elseif ($tris->emrdfk == 1901300081 && $tris->value == 1) {
                            $transportasi = 'LAINNYA';
                        } elseif ($tris->emrdfk == 1901300082) {
                            $keluhanUtama = $tris->value;
                        } elseif ($tris->emrdfk == 1901300122) {
                            $tekananDarah = $tris->value;
                        } elseif ($tris->emrdfk == 1901300127) {
                            $pernapasan = $tris->value;
                        } elseif ($tris->emrdfk == 1901300125) {
                            $suhu = $tris->value;
                        } elseif ($tris->emrdfk == 1901300126) {
                            $Nadi = $tris->value;
                        } elseif ($tris->emrdfk == 1901300129) {
                            $spo2 = $tris->value;
                        } elseif ($tris->emrdfk == 1901300128) {
                            $kesadaran = $tris->value;
                        } elseif ($tris->emrdfk == 1901300130) {
                            $keadaanUmum = $tris->value;
                        } elseif ($tris->emrdfk == 1901300124) {
                            $beratBadan = $tris->value;
                        } elseif ($tris->emrdfk == 1901300123) {
                            $tinggiBadan = $tris->value;
                        } elseif ($tris->emrdfk == 1901300131) {
                            $e = $tris->value;
                        } elseif ($tris->emrdfk == 1901300132) {
                            $m = $tris->value;
                        } elseif ($tris->emrdfk == 1901300133) {
                            $v = $tris->value;
                        } elseif ($tris->emrdfk == 1901300140 && $tris->value == 1) {
                            $airway1 = 'checked';
                        } elseif ($tris->emrdfk == 1901300141 && $tris->value == 1) {
                            $airway2 = 'checked';
                        } elseif ($tris->emrdfk == 1901300142 && $tris->value == 1) {
                            $airway3 = 'checked';
                        } elseif ($tris->emrdfk == 1901300143 && $tris->value == 1) {
                            $airway4 = 'checked';
                        } elseif ($tris->emrdfk == 1901300144 && $tris->value == 1) {
                            $airway5 = 'checked';
                        } elseif ($tris->emrdfk == 28 && $tris->value == 1) {
                            $ats1 = 'checked';
                        } elseif ($tris->emrdfk == 32 && $tris->value == 1) {
                            $ats2 = 'checked';
                        } elseif ($tris->emrdfk == 34 && $tris->value == 1) {
                            $ats3 = 'checked';
                        } elseif ($tris->emrdfk == 35 && $tris->value == 1) {
                            $ats4 = 'checked';
                        } elseif ($tris->emrdfk == 37 && $tris->value == 1) {
                            $ats5 = 'checked';
                        } elseif ($tris->emrdfk == 38 && $tris->value == 1) {
                            $doa1 = 'checked';
                        } elseif ($tris->emrdfk == 1901300145) {
                            $airwaydoa = $tris->value;
                        } elseif ($tris->emrdfk == 1901300146) {
                            $breathing1 = 'checked';
                        } elseif ($tris->emrdfk == 1901300166) {
                            $breathing2 = 'checked';
                        } elseif ($tris->emrdfk == 1901300147) {
                            $breathing3 = 'checked';
                        } elseif ($tris->emrdfk == 1901300168) {
                            $breathing4 = 'checked';
                        } elseif ($tris->emrdfk == 1901300169) {
                            $breathing5 = 'checked';
                        } elseif ($tris->emrdfk == 1901300283) {
                            $breathing66 = 'checked';
                        } elseif ($tris->emrdfk == 1901300170 && $tris->value == 1) {
                            $breathing6 = 'checked';
                        } elseif ($tris->emrdfk == 1901300171) {
                            $breathing7 = 'checked';
                        } elseif ($tris->emrdfk == 1901300149) {
                            $breathing8 = 'checked';
                        } elseif ($tris->emrdfk == 1901300150) {
                            $breathing9 = 'checked';
                        } elseif ($tris->emrdfk == 1901300151) {
                            $breathing10 = 'checked';
                        } elseif ($tris->emrdfk == 1901300209 && $tris->value == 1) {
                            $circulation1 = 'checked';
                        } elseif ($tris->emrdfk == 1901300172 && $tris->value == 1) {
                            $circulation2 = 'checked';
                        } elseif ($tris->emrdfk == 1901300173 && $tris->value == 1) {
                            $circulation3 = 'checked';
                        } elseif ($tris->emrdfk == 1901300210 && $tris->value == 1) {
                            $circulation4 = 'checked';
                        } elseif ($tris->emrdfk == 1901300174 && $tris->value == 1) {
                            $circulation5 = 'checked';
                        } elseif ($tris->emrdfk == 1901300175 && $tris->value == 1) {
                            $circulation6 = 'checked';
                        } elseif ($tris->emrdfk == 1901300176 && $tris->value == 1) {
                            $circulation7 = 'checked';
                        } elseif ($tris->emrdfk == 1901300177 && $tris->value == 1) {
                            $circulation8 = 'checked';
                        } elseif ($tris->emrdfk == 1901300178 && $tris->value == 1) {
                            $circulation9 = 'checked';
                        } elseif ($tris->emrdfk == 1901300284 && $tris->value == 1) {
                            $circulation100 = 'checked';
                        } elseif ($tris->emrdfk == 1901300179 && $tris->value == 1) {
                            $circulation10 = 'checked';
                        } elseif ($tris->emrdfk == 1901300180 && $tris->value == 1) {
                            $circulation11 = 'checked';
                        } elseif ($tris->emrdfk == 1901300181 && $tris->value == 1) {
                            $circulation12 = 'checked';
                        } elseif ($tris->emrdfk == 1901300182 && $tris->value == 1) {
                            $circulation13 = 'checked';
                        } elseif ($tris->emrdfk == 1901300183 && $tris->value == 1) {
                            $circulation14 = 'checked';
                        } elseif ($tris->emrdfk == 1901300184 && $tris->value == 1) {
                            $circulation15 = 'checked';
                        } elseif ($tris->emrdfk == 1901300211 && $tris->value == 1) {
                            $circulation16 = 'checked';
                        } elseif ($tris->emrdfk == 1901300185 && $tris->value == 1) {
                            $circulation17 = 'checked';
                        } elseif ($tris->emrdfk == 1901300212 && $tris->value == 1) {
                            $circulation18 = 'checked';
                        } elseif ($tris->emrdfk == 1901300213 && $tris->value == 1) {
                            $circulation19 = 'checked';
                        } elseif ($tris->emrdfk == 1901300214 && $tris->value == 1) {
                            $circulation20 = 'checked';
                        } elseif ($tris->emrdfk == 1901300152 && $tris->value == 1) {
                            $disability1 = 'checked';
                        } elseif ($tris->emrdfk == 1901300186 && $tris->value == 1) {
                            $disability2 = 'checked';
                        } elseif ($tris->emrdfk == 1901300187 && $tris->value == 1) {
                            $disability3 = 'checked';
                        } elseif ($tris->emrdfk == 1901300153 && $tris->value == 1) {
                            $disability4 = 'checked';
                        } elseif ($tris->emrdfk == 1901300188 && $tris->value == 1) {
                            $disability5 = 'checked';
                        } elseif ($tris->emrdfk == 1901300189 && $tris->value == 1) {
                            $disability6 = 'checked';
                        } elseif ($tris->emrdfk == 1901300154 && $tris->value == 1) {
                            $disability7 = 'checked';
                        } elseif ($tris->emrdfk == 1901300190 && $tris->value == 1) {
                            $disability8 = 'checked';
                        } elseif ($tris->emrdfk == 1901300191 && $tris->value == 1) {
                            $disability9 = 'checked';
                        } elseif ($tris->emrdfk == 1901300155 && $tris->value == 1) {
                            $disability10 = 'checked';
                        } elseif ($tris->emrdfk == 1901300156 && $tris->value == 1) {
                            $disability11 = 'checked';
                        } elseif ($tris->emrdfk == 1901300157 && $tris->value == 1) {
                            $disability12 = 'checked';
                        } elseif ($tris->emrdfk == 1901300158 && $tris->value == 1) {
                            $gawat1 = 'checked';
                        } elseif ($tris->emrdfk == 1901300192) {
                            $gawattext2 = $tris->value;
                        } elseif ($tris->emrdfk == 1901300193) {
                            $gawattext3 = $tris->value;
                        } elseif ($tris->emrdfk == 1901300159 && $tris->value == 1) {
                            $gawat4 = 'checked';
                        } elseif ($tris->emrdfk == 1901300194 && $tris->value == 1) {
                            $gawat5 = 'checked';
                        } elseif ($tris->emrdfk == 1901300195 && $tris->value == 1) {
                            $gawat6 = 'checked';
                        } elseif ($tris->emrdfk == 1901300196 && $tris->value == 1) {
                            $gawat7 = 'checked';
                        } elseif ($tris->emrdfk == 1901300197 && $tris->value == 1) {
                            $gawat8 = 'checked';
                        } elseif ($tris->emrdfk == 1901300198) {
                            $gawattext9 = $tris->value;
                        } elseif ($tris->emrdfk == 1901300199) {
                            $gawattext10 = $tris->value;
                        } elseif ($tris->emrdfk == 1901300160 && $tris->value == 1) {
                            $gawat11 = 'checked';
                        } elseif ($tris->emrdfk == 1901300200 && $tris->value == 1) {
                            $gawat12 = 'checked';
                        } elseif ($tris->emrdfk == 1901300201 && $tris->value == 1) {
                            $gawat13 = 'checked';
                        } elseif ($tris->emrdfk == 1901300202 && $tris->value == 1) {
                            $gawat14 = 'checked';
                        } elseif ($tris->emrdfk == 1901300203 && $tris->value == 1) {
                            $gawat15 = 'checked';
                        } elseif ($tris->emrdfk == 1901300204) {
                            $gawattext16 = $tris->value;
                        } elseif ($tris->emrdfk == 1901300205) {
                            $gawattext17 = $tris->value;
                        } elseif ($tris->emrdfk == 1901300161 && $tris->value == 1) {
                            $gawat18 = 'checked';
                        } elseif ($tris->emrdfk == 1901300206) {
                            $gawattext19 = $tris->value;
                        } elseif ($tris->emrdfk == 1901300207) {
                            $gawattext20 = $tris->value;
                        } elseif ($tris->emrdfk == 1901300162 && $tris->value == 1) {
                            $gawat21 = 'checked';
                        } elseif ($tris->emrdfk == 1901300163 && $tris->value == 1) {
                            $gawat22 = 'checked';
                        } elseif ($tris->emrdfk == 1901300208 && $tris->value == 1) {
                            $gawat23 = 'checked';
                        } elseif ($tris->emrdfk == 1901300215 && $tris->value == 1) {
                            $gawat24 = 'checked';
                        } elseif ($tris->emrdfk == 1901300216 && $tris->value == 1) {
                            $gawat25 = 'checked';
                        } elseif ($tris->emrdfk == 1901300217 && $tris->value == 1) {
                            $gawat26 = 'checked';
                        } elseif ($tris->emrdfk == 1901300218 && $tris->value == 1) {
                            $gawat27 = 'checked';
                        } elseif ($tris->emrdfk == 1901300219 && $tris->value == 1) {
                            $gawat28 = 'checked';
                        } elseif ($tris->emrdfk == 1901300220 && $tris->value == 1) {
                            $gawat29 = 'checked';
                        } elseif ($tris->emrdfk == 1901300221 && $tris->value == 1) {
                            $gawat30 = 'checked';
                        } elseif ($tris->emrdfk == 1901300222 && $tris->value == 1) {
                            $gawat31 = 'checked';
                        } elseif ($tris->emrdfk == 1901300105 && $tris->value == 1) {
                            $pasienNyeri = '1';
                        } elseif ($tris->emrdfk == 1901300106 && $tris->value == 1) {
                            $pasienNyeri = '2';
                        } elseif ($tris->emrdfk == 1901300134 && $tris->value == 1) {
                            $scoreNyeri = '1';
                        } elseif ($tris->emrdfk == 1901300135 && $tris->value == 1) {
                            $scoreNyeri = '2';
                        } elseif ($tris->emrdfk == 1901300136 && $tris->value == 1) {
                            $scoreNyeri = '3';
                        } elseif ($tris->emrdfk == 1901300137 && $tris->value == 1) {
                            $scoreNyeri = '4';
                        } elseif ($tris->emrdfk == 1901300138 && $tris->value == 1) {
                            $scoreNyeri = '5';
                        } elseif ($tris->emrdfk == 1901300139 && $tris->value == 1) {
                            $scoreNyeri = '6';
                        } elseif ($tris->emrdfk == 1901300113) {
                            $lokasi = $tris->value;
                        } elseif ($tris->emrdfk == 1901300114) {
                            $durasi = $tris->value;
                        } elseif ($tris->emrdfk == 1901300115) {
                            $ttdPetugasTriase = $tris->value;
                        } elseif ($tris->emrdfk == 1901300075) {
                            $tgl = $tris->value;
                        }

                        // Nyeri
                        elseif ($tris->emrdfk == 1901300254) {
                            $nyeriresusitasi = $tris->value;
                        } elseif ($tris->emrdfk == 1901300255 && $tris->value == 1) {
                            $nyeriberat = 'checked';
                        } elseif ($tris->emrdfk == 1901300256 && $tris->value == 1) {
                            $nyerisedang = 'checked';
                        } elseif ($tris->emrdfk == 1901300257 && $tris->value == 1) {
                            $nyeriringan = 'checked';
                        } elseif ($tris->emrdfk == 1901300258) {
                            $nyerifalseemergency = $tris->value;
                        }

                        // Cara Datang
                        elseif ($tris->emrdfk == 1901300223 && $tris->value == 1) {
                            $cara_datang_berjalan = 'checked';
                        } elseif ($tris->emrdfk == 1901300224 && $tris->value == 1) {
                            $cara_datang_brankar = 'checked';
                        } elseif ($tris->emrdfk == 1901300225 && $tris->value == 1) {
                            $cara_datang_kursi_roda = 'checked';
                        } elseif ($tris->emrdfk == 1901300226 && $tris->value == 1) {
                            $cara_datang_digendong = 'checked';
                        } elseif ($tris->emrdfk == 1901300227 && $tris->value == 1) {
                            $cara_datang_dibantu = 'checked';
                        }

                        // Sudah Terpasang
                        elseif ($tris->emrdfk == 1901300228 && $tris->value == 1) {
                            $sudah_terpasang_infus = 'checked';
                        } elseif ($tris->emrdfk == 1901300229 && $tris->value == 1) {
                            $sudah_terpasang_ngt = 'checked';
                        } elseif ($tris->emrdfk == 1901300230 && $tris->value == 1) {
                            $sudah_terpasang_ett = 'checked';
                        } elseif ($tris->emrdfk == 1901300231 && $tris->value == 1) {
                            $sudah_terpasang_lain = 'checked';
                        } elseif ($tris->emrdfk == 1901300232) {
                            $sudah_terpasang_keterangan = $tris->value;
                        }

                        // Alasan Datang
                        elseif ($tris->emrdfk == 1901300233 && $tris->value == 1) {
                            $alasan_sendiri = 'checked';
                        } elseif ($tris->emrdfk == 1901300234 && $tris->value == 1) {
                            $alasan_polisi = 'checked';
                        } elseif ($tris->emrdfk == 1901300235 && $tris->value == 1) {
                            $alasan_ambulance = 'checked';
                        } elseif ($tris->emrdfk == 1901300236 && $tris->value == 1) {
                            $alasan_rujukan = 'checked';
                        } elseif ($tris->emrdfk == 1901300237) {
                            $alasan_rujukan_dari = $tris->value;
                        } elseif ($tris->emrdfk == 1901300238) {
                            $alasan_rujukan_untuk = $tris->value;
                        }

                        // Kendaraan
                        elseif ($tris->emrdfk == 1901300078 && $tris->value == 1) {
                            $kendaraan_ambulance = 'checked';
                        } elseif (in_array($transportasi, ['MOBIL', 'MOTOR', 'LAINNYA'])) {
                            $kendaraan_non_ambulance = 'checked';
                        }

                        // Pengantar
                        elseif ($tris->emrdfk == 1901300239) {
                            $pengantar_nama = $tris->value;
                        } elseif ($tris->emrdfk == 1901300240) {
                            $pengantar_hubungan = $tris->value;
                        } elseif ($tris->emrdfk == 1901300241) {
                            $pengantar_telp = $tris->value;
                        }

                        // Kasus
                        elseif ($tris->emrdfk == 1901300242 && $tris->value == 1) {
                            $kasus_trauma = 'checked';
                        } elseif ($tris->emrdfk == 1901300243 && $tris->value == 1) {
                            $kasus_kll_tunggal = 'checked';
                        } elseif ($tris->emrdfk == 1901300244 && $tris->value == 1) {
                            $kasus_kll = 'checked';
                        } elseif ($tris->emrdfk == 1901300245) {
                            $kasus_vs1 = $tris->value;
                        } elseif ($tris->emrdfk == 1901300246) {
                            $kasus_vs2 = $tris->value;
                        } elseif ($tris->emrdfk == 1901300247 && $tris->value == 1) {
                            $kasus_trauma_lain = 'checked';
                        } elseif ($tris->emrdfk == 1901300259 && $tris->value == 1) {
                            $kasus_tempat = 'checked';
                        } elseif ($tris->emrdfk == 1901300248) {
                            $kasus_tempat_keterangan = $tris->value;
                        } elseif ($tris->emrdfk == 1901300249 && $tris->value == 1) {
                            $kasus_non_trauma = 'checked';
                        } elseif ($tris->emrdfk == 1901300250 && $tris->value == 1) {
                            $kasus_tanggal = 'checked';
                        } elseif ($tris->emrdfk == 1901300251) {
                            $kasus_waktu = $tris->value;
                        }
                    }
                    $ttdPetugasTriaseBarcode = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-new?namaPegawai=" . $ttdPetugasTriase);
                    echo "</br>";
                    header('Contert-Type: application/' . $ttdPetugasTriaseBarcode->getContentType());
                    $ttdPetugasTriaseBarcode2 = $ttdPetugasTriaseBarcode->writeDataUri();
                }
                $dataTriaseIGD = array(
                    'nama' => $nama,
                    'noHp' => $noHp,
                    'transportasi' => $transportasi,
                    'keluhanUtama' => $keluhanUtama,
                    'tekananDarah' => $tekananDarah,
                    'pernapasan' => $pernapasan,
                    'suhu' => $suhu,
                    'nadi' => $Nadi,
                    'spo2' => $spo2,
                    'kesadaran' => $kesadaran,
                    'keadaanUmum' => $keadaanUmum,
                    'beratBadan' => $beratBadan,
                    'tinggiBadan' => $tinggiBadan,
                    'e' => $e,
                    'm' => $m,
                    'v' => $v,
                    'airway1' => $airway1,
                    'airway2' => $airway2,
                    'airway3' => $airway3,
                    'airway4' => $airway4,
                    'airway5' => $airway5,
                    'airwaydoa' => $airwaydoa,
                    'ats1' => $ats1,
                    'ats2' => $ats2,
                    'ats3' => $ats3,
                    'ats4' => $ats4,
                    'ats5' => $ats5,
                    'doa1' => $doa1,
                    'breathing1' => $breathing1,
                    'breathing2' => $breathing2,
                    'breathing3' => $breathing3,
                    'breathing4' => $breathing4,
                    'breathing5' => $breathing5,
                    'breathing6' => $breathing6,
                    'breathing66' => $breathing66,
                    'breathing7' => $breathing7,
                    'breathing8' => $breathing8,
                    'breathing9' => $breathing9,
                    'breathing10' => $breathing10,
                    'circulation1' => $circulation1,
                    'circulation2' => $circulation2,
                    'circulation3' => $circulation3,
                    'circulation4' => $circulation4,
                    'circulation5' => $circulation5,
                    'circulation6' => $circulation6,
                    'circulation7' => $circulation7,
                    'circulation8' => $circulation8,
                    'circulation9' => $circulation9,
                    'circulation100' => $circulation100,
                    'circulation10' => $circulation10,
                    'circulation11' => $circulation11,
                    'circulation12' => $circulation12,
                    'circulation13' => $circulation13,
                    'circulation14' => $circulation14,
                    'circulation15' => $circulation15,
                    'circulation16' => $circulation16,
                    'circulation17' => $circulation17,
                    'circulation18' => $circulation18,
                    'circulation19' => $circulation19,
                    'circulation20' => $circulation20,
                    'disability1' => $disability1,
                    'disability2' => $disability2,
                    'disability3' => $disability3,
                    'disability4' => $disability4,
                    'disability5' => $disability5,
                    'disability6' => $disability6,
                    'disability7' => $disability7,
                    'disability8' => $disability8,
                    'disability9' => $disability9,
                    'disability10' => $disability10,
                    'disability11' => $disability11,
                    'disability12' => $disability12,
                    'gawattext2' => $gawattext2,
                    'gawattext3' => $gawattext3,
                    'gawattext9' => $gawattext9,
                    'gawattext10' => $gawattext10,
                    'gawattext16' => $gawattext16,
                    'gawattext17' => $gawattext17,
                    'gawattext19' => $gawattext19,
                    'gawattext20' => $gawattext20,
                    'gawat1' => $gawat1,
                    'gawat4' => $gawat4,
                    'gawat5' => $gawat5,
                    'gawat6' => $gawat6,
                    'gawat7' => $gawat7,
                    'gawat8' => $gawat8,
                    'gawat11' => $gawat11,
                    'gawat12' => $gawat12,
                    'gawat13' => $gawat13,
                    'gawat14' => $gawat14,
                    'gawat15' => $gawat15,
                    'gawat18' => $gawat18,
                    'gawat21' => $gawat21,
                    'gawat22' => $gawat22,
                    'gawat23' => $gawat23,
                    'gawat24' => $gawat24,
                    'gawat25' => $gawat25,
                    'gawat26' => $gawat26,
                    'gawat27' => $gawat27,
                    'gawat28' => $gawat28,
                    'gawat29' => $gawat29,
                    'gawat30' => $gawat30,
                    'gawat31' => $gawat31,
                    'hasilPasien' => $hasilPasien,
                    'pasienNyeri' => $pasienNyeri,
                    'scoreNyeri' => $scoreNyeri,
                    'lokasi' => $lokasi,
                    'durasi' => $durasi,
                    // Tingkat nyeri
                    'nyeriresusitasi' => $nyeriresusitasi,
                    'nyeriringan' => $nyeriringan,
                    'nyerisedang' => $nyerisedang,
                    'nyeriberat' => $nyeriberat,
                    'nyerifalseemergency' => $nyerifalseemergency,

                    // Cara datang
                    'cara_datang_berjalan' => $cara_datang_berjalan,
                    'cara_datang_brankar' => $cara_datang_brankar,
                    'cara_datang_kursi_roda' => $cara_datang_kursi_roda,
                    'cara_datang_digendong' => $cara_datang_digendong,
                    'cara_datang_dibantu' => $cara_datang_dibantu,

                    // Sudah terpasang
                    'sudah_terpasang_infus' => $sudah_terpasang_infus,
                    'sudah_terpasang_ngt' => $sudah_terpasang_ngt,
                    'sudah_terpasang_ett' => $sudah_terpasang_ett,
                    'sudah_terpasang_lain' => $sudah_terpasang_lain,
                    'sudah_terpasang_keterangan' => $sudah_terpasang_keterangan,

                    // Alasan
                    'alasan_sendiri' => $alasan_sendiri,
                    'alasan_polisi' => $alasan_polisi,
                    'alasan_ambulance' => $alasan_ambulance,
                    'alasan_rujukan' => $alasan_rujukan,
                    'alasan_rujukan_dari' => $alasan_rujukan_dari,
                    'alasan_rujukan_untuk' => $alasan_rujukan_untuk,

                    // Kendaraan
                    'kendaraan_ambulance' => $kendaraan_ambulance,
                    'kendaraan_non_ambulance' => $kendaraan_non_ambulance,

                    // Pengantar
                    'pengantar_nama' => $pengantar_nama,
                    'pengantar_telp' => $pengantar_telp,
                    'pengantar_hubungan' => $pengantar_hubungan,

                    // Kasus
                    'kasus_trauma' => $kasus_trauma,
                    'kasus_kll_tunggal' => $kasus_kll_tunggal,
                    'kasus_kll' => $kasus_kll,
                    'kasus_vs1' => $kasus_vs1,
                    'kasus_vs2' => $kasus_vs2,
                    'kasus_trauma_lain' => $kasus_trauma_lain,
                    'kasus_tempat' => $kasus_tempat,
                    'kasus_tempat_keterangan' => $kasus_tempat_keterangan,
                    'kasus_non_trauma' => $kasus_non_trauma,
                    'kasus_tanggal' => $kasus_tanggal,
                    'kasus_waktu' => $kasus_waktu,
                    'ttdPetugasTriase' => $ttdPetugasTriase,
                    'ttdPetugasTriaseBarcode' => $ttdPetugasTriaseBarcode2,
                    'ruangan' => 'IGD',
                    'tgl' => $tgl
                );
            }
        }

        // key 29-07-2024
        // --------------------Hemodialisa-------------------
        if ($xcetakhemodialisa == 1) {
            $dataHemodialisa = [];
            $laporanhemodialisa = [];

            $dataprehd = '';
            $tdhd = '';
            $nadihd = '';
            $pernapasanhd = '';
            $suhuhd = '';
            $respiratoryhd = '';
            $edemahd = '';
            $bbkeringhd = '';
            $bbprahd = '';
            $perbedaanbbhd = '';
            $avfistula = '';
            $femotarishd = '';
            $doublelumenhd = '';
            $yanyerihd = '';
            $tidaknyerihd = '';
            $tidakadanyerihd = '';
            $sedikitnyerihd = '';
            $cukupnyerihd = '';
            $lumayannyerihd = '';
            $sangatnyerihd = '';
            $amatsangatnyerihd = '';
            $skalanyerihd = '';
            $lokasihd = '';
            $durasihd = '';
            $frekuensihd = '';
            $karakteristikhd = '';
            $minumobathd = '';
            $mendengarmusikhd = '';
            $istirahathd = '';
            $berubahposisihd = '';
            $lainlainhd = '';
            $sebutkanhd = '';
            $luasmembranehd = '';
            $lowfluxhd = '';
            $highthd = '';
            $dializerhd = '';
            $priminghd = '';
            $singelusekehd = '';
            $tessisa0hd = '';
            $tessisa1hd = '';
            $tessisa3hd = '';
            $petugas4hd = '';
            $alarmtesttidakhd = '';
            $alarmtestyahd = '';
            $hurufmesinhd = '';
            $angkamesinhd = '';
            $jenisprogramhd = '';
            $dialisthd = '';
            $conductivithd = '';
            $anticoagulehd = '';
            $dosisawalhd = '';
            $dosispemeliharaanhd = '';
            $jamtotalhd = '';
            $jam11hd = '';
            $jam12hd = '';
            $masalahkeperawatan13hd = '';
            $jam21hd = '';
            $jam22hd = '';
            $masalahkeperawatan23hd = '';
            $jam31hd = '';
            $jam32hd = '';
            $masalahkeperawatan33hd = '';
            $jam41hd = '';
            $jam42hd = '';
            $masalahkeperawatan43hd = '';
            $waktumulaihd = '';
            $waktuselesaihd = '';
            $lamawaktuhd = '';
            $keluhanhd = '';
            $keadaanhd = '';
            $td2hd = '';
            $nadi2hd = '';
            $pernapasan2hd = '';
            $suhu2hd = '';
            $bbposthd = '';
            $sisacairanhd = '';
            $transfusicairanhd = '';
            $washcairanhd = '';
            $minumcairanhd = '';
            $jumlahcairanhd = '';
            $petugaspunksihd = '';
            $petugasterminasihd = '';
            $selesaihd = '';
            $perawatpasienhd = '';
            $qrCodeHD2 = '';
            $hd1 = '';
            $hd2 = '';
            $hd3 = '';
            $hd4 = '';
            $hd5 = '';
            $hd6 = '';
            $hd7 = '';
            $hd8 = '';
            $hd9 = '';
            $hd10 = '';
            $hd11 = '';
            $hd12 = '';
            $hd13 = '';
            $hd14 = '';
            $hd15 = '';
            $hd16 = '';
            $hd17 = '';
            $hd18 = '';
            $hd19 = '';
            $hd20 = '';
            $hd21 = '';
            $hd22 = '';
            $hd23 = '';
            $hd24 = '';
            $hd25 = '';
            $hd26 = '';
            $hd27 = '';
            $hd28 = '';
            $hd29 = '';
            $hd30 = '';
            $hd31 = '';
            $hd32 = '';
            $hd33 = '';
            $hd34 = '';
            $hd35 = '';
            $hd36 = '';
            $hd37 = '';
            $hd38 = '';
            $hd39 = '';
            $hd40 = '';
            $hd41 = '';
            $hd42 = '';
            $hd43 = '';
            $hd44 = '';
            $hd45 = '';
            $hd46 = '';
            $hd47 = '';
            $hd48 = '';
            $hd49 = '';
            $hd50 = '';
            $hd51 = '';
            $hd52 = '';
            $hd53 = '';
            $hd54 = '';
            $hd55 = '';
            $hd56 = '';
            $hd57 = '';
            $hd58 = '';
            $hd59 = '';
            $hd60 = '';
            $hd61 = '';
            $hd62 = '';
            $hd63 = '';
            $hd64 = '';
            $hd65 = '';
            $hd66 = '';
            $hd67 = '';
            $hd68 = '';
            $hd69 = '';
            $hd70 = '';
            $hd71 = '';
            $hd72 = '';
            $hd73 = '';
            $hd74 = '';
            $hd75 = '';
            $hd76 = '';
            $hd77 = '';
            $hd78 = '';
            $hd79 = '';
            $hd80 = '';
            $hd81 = '';
            $hd82 = '';
            $hd83 = '';
            $hd84 = '';
            $hd85 = '';
            $hd86 = '';
            $hd87 = '';
            $hd88 = '';
            $hd89 = '';
            $hd90 = '';
            $hd91 = '';
            $hd92 = '';
            $hd93 = '';
            $hd94 = '';
            $hd95 = '';
            $hd96 = '';
            $hd97 = '';
            $hd98 = '';
            $hd99 = '';
            $hd100 = '';
            if ($xcetakhemodialisa) {
                $laporanhemodialisa = DB::select(DB::raw("
                    select epd.emrdfk, epd.value, ep.namaruangan from emrpasiend_t as epd join
                    emrpasien_t as ep on ep.noemr = epd.emrpasienfk 
                    where ep.noregistrasifk = '$noregistrasi' and ep.emrfk = 890
                    "));
                if (count($laporanhemodialisa) > 0) {
                    foreach ($laporanhemodialisa as $hd) {

                        // --- DATA PRE HD & TANDA VITAL ---
                        if ($hd->emrdfk == 3255 || $hd->emrdfk == 6138) {
                            $dataprehd = $hd->value; // Keluhan
                        } else if ($hd->emrdfk == 3256 || $hd->emrdfk == 6139) {
                            $tdhd = $hd->value; // TD
                        } else if ($hd->emrdfk == 3257 || $hd->emrdfk == 6140) {
                            $pernapasanhd = $hd->value; // Pernapasan
                        } else if ($hd->emrdfk == 3258 || $hd->emrdfk == 6141) {
                            $suhuhd = $hd->value; // Suhu
                        } else if ($hd->emrdfk == 3259 || $hd->emrdfk == 6142) {
                            $nadihd = $hd->value; // Nadi
                        } else if ($hd->emrdfk == 3260 || $hd->emrdfk == 6143) {
                            $hd95 = $hd->value; // SpO2
                        }

                        // --- PEMERIKSAAN UMUM ---
                        else if ($hd->emrdfk == 3261 || $hd->emrdfk == 6144) {
                            $hd96 = $hd->value; // Keadaan Umum
                        } else if ($hd->emrdfk == 3262 || $hd->emrdfk == 6145) {
                            $hd97 = $hd->value; // Kesadaran
                        } else if ($hd->emrdfk == 3263 || $hd->emrdfk == 6146) {
                            $hd98 = $hd->value; // BB
                        } else if ($hd->emrdfk == 3264 || $hd->emrdfk == 6147) {
                            $hd99 = $hd->value; // TB
                        }

                        // --- RESPIRATORY & EDEMA & BB ---
                        else if ($hd->emrdfk == 3268 || $hd->emrdfk == 6151) {
                            $respiratoryhd = $hd->value;
                        } else if ($hd->emrdfk == 3269 || $hd->emrdfk == 6152) {
                            $edemahd = $hd->value;
                        } else if ($hd->emrdfk == 3270 || $hd->emrdfk == 6153) {
                            $bbkeringhd = $hd->value;
                        } else if ($hd->emrdfk == 3271 || $hd->emrdfk == 6154) {
                            $bbprahd = $hd->value;
                        } else if ($hd->emrdfk == 3272 || $hd->emrdfk == 6155) {
                            $perbedaanbbhd = $hd->value;
                        }

                        // --- AKSES VASKULER ---
                        else if ($hd->emrdfk == 4507 || $hd->emrdfk == 6177) {
                            $avfistula = $hd->value;
                        } else if ($hd->emrdfk == 4508 || $hd->emrdfk == 6178) {
                            $femotarishd = $hd->value;
                        } else if ($hd->emrdfk == 4509 || $hd->emrdfk == 6179) {
                            $doublelumenhd = $hd->value;
                        }

                        // --- SKALA NYERI (Wong Baker) ---
                        else if ($hd->emrdfk == 3275 || $hd->emrdfk == 6343) {
                            $tidakadanyerihd = $hd->value; // 0
                        } else if ($hd->emrdfk == 3273 || $hd->emrdfk == 6156) {
                            $yanyerihd = $hd->value; // Ya
                        } else if ($hd->emrdfk == 3274 || $hd->emrdfk == 6157) {
                            $tidaknyerihd = $hd->value; // Tidak
                        } else if ($hd->emrdfk == 3276 || $hd->emrdfk == 6344) {
                            $sedikitnyerihd = $hd->value; // 2-3
                        } else if ($hd->emrdfk == 3277 || $hd->emrdfk == 6345) {
                            $cukupnyerihd = $hd->value; // 4-5
                        } else if ($hd->emrdfk == 3278 || $hd->emrdfk == 6346) {
                            $lumayannyerihd = $hd->value; // 6-7
                        } else if ($hd->emrdfk == 3279 || $hd->emrdfk == 6347) {
                            $sangatnyerihd = $hd->value; // 8-9
                        } else if ($hd->emrdfk == 3280 || $hd->emrdfk == 6348) {
                            $amatsangatnyerihd = $hd->value; // 10
                        } else if ($hd->emrdfk == 3283 || $hd->emrdfk == 6166) {
                            $skalanyerihd = $hd->value;
                        } else if ($hd->emrdfk == 3284 || $hd->emrdfk == 6167) {
                            $lokasihd = $hd->value;
                        } else if ($hd->emrdfk == 3285 || $hd->emrdfk == 6168) {
                            $durasihd = $hd->value;
                        } else if ($hd->emrdfk == 3286 || $hd->emrdfk == 6169) {
                            $frekuensihd = $hd->value;
                        } else if ($hd->emrdfk == 3287 || $hd->emrdfk == 6170) {
                            $karakteristikhd = $hd->value;
                        }

                        // --- PENANGANAN NYERI ---
                        else if ($hd->emrdfk == 3288 || $hd->emrdfk == 6171) {
                            $minumobathd = $hd->value;
                        } else if ($hd->emrdfk == 3289 || $hd->emrdfk == 6172) {
                            $mendengarmusikhd = $hd->value;
                        } else if ($hd->emrdfk == 3290 || $hd->emrdfk == 6173) {
                            $istirahathd = $hd->value;
                        } else if ($hd->emrdfk == 3291 || $hd->emrdfk == 6174) {
                            $berubahposisihd = $hd->value;
                        } else if ($hd->emrdfk == 3292 || $hd->emrdfk == 6175) {
                            $lainlainhd = $hd->value;
                        } else if ($hd->emrdfk == 1225 || $hd->emrdfk == 6181) {
                            $sebutkanhd = $hd->value;
                        }

                        // --- DATA DIALIZER ---
                        else if ($hd->emrdfk == 3400 || $hd->emrdfk == 6182) {
                            $luasmembranehd = $hd->value;
                        } else if ($hd->emrdfk == 3401 || $hd->emrdfk == 6183) {
                            $lowfluxhd = $hd->value;
                        } else if ($hd->emrdfk == 3402 || $hd->emrdfk == 6184) {
                            $highthd = $hd->value;
                        } else if ($hd->emrdfk == 3403 || $hd->emrdfk == 6185) {
                            $dializerhd = $hd->value;
                        } else if ($hd->emrdfk == 3404 || $hd->emrdfk == 6187) {
                            $priminghd = $hd->value;
                        } else if ($hd->emrdfk == 3405 || $hd->emrdfk == 6188) {
                            $singelusekehd = $hd->value;
                        }

                        // --- SISA RENALIN ---
                        else if ($hd->emrdfk == 3406 || $hd->emrdfk == 6189) {
                            $tessisa0hd = $hd->value;
                        } else if ($hd->emrdfk == 3407 || $hd->emrdfk == 6190) {
                            $tessisa1hd = $hd->value;
                        } else if ($hd->emrdfk == 3408 || $hd->emrdfk == 6191) {
                            $tessisa3hd = $hd->value;
                        } else if ($hd->emrdfk == 3409 || $hd->emrdfk == 6192) {
                            $petugas4hd = $hd->value;
                        }

                        // --- PARAMETER MESIN ---
                        else if ($hd->emrdfk == 3415 || $hd->emrdfk == 6193) {
                            $alarmtesttidakhd = $hd->value;
                        } else if ($hd->emrdfk == 3416 || $hd->emrdfk == 6194) {
                            $alarmtestyahd = $hd->value;
                        } else if ($hd->emrdfk == 3417 || $hd->emrdfk == 6195) {
                            $hurufmesinhd = $hd->value;
                        } else if ($hd->emrdfk == 3418 || $hd->emrdfk == 6196) {
                            $angkamesinhd = $hd->value;
                        } else if ($hd->emrdfk == 3419 || $hd->emrdfk == 6197) {
                            $jenisprogramhd = $hd->value;
                        } else if ($hd->emrdfk == 3420 || $hd->emrdfk == 6198) {
                            $dialisthd = $hd->value;
                        } else if ($hd->emrdfk == 3421 || $hd->emrdfk == 6199) {
                            $conductivithd = $hd->value;
                        } else if ($hd->emrdfk == 3422 || $hd->emrdfk == 6200) {
                            $anticoagulehd = $hd->value;
                        } else if ($hd->emrdfk == 3423 || $hd->emrdfk == 6201) {
                            $dosisawalhd = $hd->value;
                        } else if ($hd->emrdfk == 3424 || $hd->emrdfk == 6202) {
                            $dosispemeliharaanhd = $hd->value;
                        } else if ($hd->emrdfk == 3425 || $hd->emrdfk == 6203) {
                            $jamtotalhd = $hd->value;
                        }

                        // --- OBSERVASI PROGRAM DIALISIS (JAM-JAMAN) ---
                        // JAM 11-13 (Header)
                        else if ($hd->emrdfk == 3426 || $hd->emrdfk == 6204) {
                            $jam11hd = $hd->value;
                        } else if ($hd->emrdfk == 3430 || $hd->emrdfk == 6205) {
                            $jam12hd = $hd->value;
                        } else if ($hd->emrdfk == 3434 || $hd->emrdfk == 6206) {
                            $masalahkeperawatan13hd = $hd->value;
                        }

                        // JAM 21-23
                        else if ($hd->emrdfk == 3427 || $hd->emrdfk == 6207) {
                            $jam21hd = $hd->value;
                        } else if ($hd->emrdfk == 3431 || $hd->emrdfk == 6208) {
                            $jam22hd = $hd->value;
                        } else if ($hd->emrdfk == 3435 || $hd->emrdfk == 6209) {
                            $masalahkeperawatan23hd = $hd->value;
                        }

                        // JAM 31-33
                        else if ($hd->emrdfk == 3428 || $hd->emrdfk == 6210) {
                            $jam31hd = $hd->value;
                        } else if ($hd->emrdfk == 3432 || $hd->emrdfk == 6211) {
                            $jam32hd = $hd->value;
                        } else if ($hd->emrdfk == 3436 || $hd->emrdfk == 6212) {
                            $masalahkeperawatan33hd = $hd->value;
                        }

                        // JAM 41-43
                        else if ($hd->emrdfk == 3429 || $hd->emrdfk == 6213) {
                            $jam41hd = $hd->value;
                        } else if ($hd->emrdfk == 3433 || $hd->emrdfk == 6214) {
                            $jam42hd = $hd->value;
                        } else if ($hd->emrdfk == 3558 || $hd->emrdfk == 6215) {
                            $masalahkeperawatan43hd = $hd->value;
                        }

                        // --- TABEL GRID OBSERVASI ---
                        // Baris 1
                        else if ($hd->emrdfk == 3440 || $hd->emrdfk == 6219) {
                            $hd1 = $hd->value;
                        } else if ($hd->emrdfk == 3441 || $hd->emrdfk == 6220) {
                            $hd2 = $hd->value;
                        } else if ($hd->emrdfk == 3442 || $hd->emrdfk == 6221) {
                            $hd3 = $hd->value;
                        } else if ($hd->emrdfk == 3443 || $hd->emrdfk == 6222) {
                            $hd4 = $hd->value;
                        } else if ($hd->emrdfk == 3444 || $hd->emrdfk == 6223) {
                            $hd5 = $hd->value;
                        } else if ($hd->emrdfk == 3445 || $hd->emrdfk == 6224) {
                            $hd6 = $hd->value;
                        } else if ($hd->emrdfk == 3446 || $hd->emrdfk == 6225) {
                            $hd7 = $hd->value;
                        } else if ($hd->emrdfk == 3447 || $hd->emrdfk == 6226) {
                            $hd8 = $hd->value;
                        } else if ($hd->emrdfk == 3448 || $hd->emrdfk == 6227) {
                            $hd9 = $hd->value;
                        }
                        // Baris 2
                        else if ($hd->emrdfk == 3449 || $hd->emrdfk == 6228) {
                            $hd10 = $hd->value;
                        } else if ($hd->emrdfk == 3450 || $hd->emrdfk == 6229) {
                            $hd11 = $hd->value;
                        } else if ($hd->emrdfk == 3451 || $hd->emrdfk == 6230) {
                            $hd12 = $hd->value;
                        } else if ($hd->emrdfk == 3452 || $hd->emrdfk == 6231) {
                            $hd13 = $hd->value;
                        } else if ($hd->emrdfk == 3453 || $hd->emrdfk == 6232) {
                            $hd14 = $hd->value;
                        } else if ($hd->emrdfk == 3454 || $hd->emrdfk == 6233) {
                            $hd15 = $hd->value;
                        } else if ($hd->emrdfk == 3455 || $hd->emrdfk == 6234) {
                            $hd16 = $hd->value;
                        } else if ($hd->emrdfk == 3456 || $hd->emrdfk == 6235) {
                            $hd17 = $hd->value;
                        } else if ($hd->emrdfk == 3457 || $hd->emrdfk == 6236) {
                            $hd18 = $hd->value;
                        }
                        // Baris 3 (Dengan Fix ID)
                        else if ($hd->emrdfk == 3458 || $hd->emrdfk == 6237) {
                            $hd19 = $hd->value;
                        } else if ($hd->emrdfk == 3459 || $hd->emrdfk == 6238) {
                            $hd20 = $hd->value;
                        } else if ($hd->emrdfk == 3460 || $hd->emrdfk == 6351) {
                            $hd21 = $hd->value;
                        } // Fix Nadi RI
                        else if ($hd->emrdfk == 3461 || $hd->emrdfk == 6352) {
                            $hd22 = $hd->value;
                        } // Fix QB RI
                        else if ($hd->emrdfk == 3462 || $hd->emrdfk == 6240) {
                            $hd23 = $hd->value;
                        } else if ($hd->emrdfk == 3463 || $hd->emrdfk == 6241) {
                            $hd24 = $hd->value;
                        } else if ($hd->emrdfk == 3464 || $hd->emrdfk == 6242) {
                            $hd25 = $hd->value;
                        } else if ($hd->emrdfk == 3465 || $hd->emrdfk == 6243) {
                            $hd26 = $hd->value;
                        } else if ($hd->emrdfk == 3466 || $hd->emrdfk == 6244) {
                            $hd27 = $hd->value;
                        }
                        // Baris 4
                        else if ($hd->emrdfk == 3467 || $hd->emrdfk == 6245) {
                            $hd28 = $hd->value;
                        } else if ($hd->emrdfk == 3468 || $hd->emrdfk == 6246) {
                            $hd29 = $hd->value;
                        } else if ($hd->emrdfk == 3469 || $hd->emrdfk == 6247) {
                            $hd30 = $hd->value;
                        } else if ($hd->emrdfk == 3470 || $hd->emrdfk == 6248) {
                            $hd31 = $hd->value;
                        } else if ($hd->emrdfk == 3471 || $hd->emrdfk == 6249) {
                            $hd32 = $hd->value;
                        } else if ($hd->emrdfk == 3472 || $hd->emrdfk == 6250) {
                            $hd33 = $hd->value;
                        } else if ($hd->emrdfk == 3473 || $hd->emrdfk == 6251) {
                            $hd34 = $hd->value;
                        } else if ($hd->emrdfk == 3474 || $hd->emrdfk == 6252) {
                            $hd35 = $hd->value;
                        } else if ($hd->emrdfk == 3475 || $hd->emrdfk == 6253) {
                            $hd36 = $hd->value;
                        }
                        // Baris 5
                        else if ($hd->emrdfk == 3476 || $hd->emrdfk == 6254) {
                            $hd37 = $hd->value;
                        } else if ($hd->emrdfk == 3477 || $hd->emrdfk == 6255) {
                            $hd38 = $hd->value;
                        } else if ($hd->emrdfk == 3478 || $hd->emrdfk == 6256) {
                            $hd39 = $hd->value;
                        } else if ($hd->emrdfk == 3479 || $hd->emrdfk == 6257) {
                            $hd40 = $hd->value;
                        } else if ($hd->emrdfk == 3480 || $hd->emrdfk == 6258) {
                            $hd41 = $hd->value;
                        } else if ($hd->emrdfk == 3481 || $hd->emrdfk == 6259) {
                            $hd42 = $hd->value;
                        } else if ($hd->emrdfk == 3482 || $hd->emrdfk == 6260) {
                            $hd43 = $hd->value;
                        } else if ($hd->emrdfk == 3483 || $hd->emrdfk == 6261) {
                            $hd44 = $hd->value;
                        } else if ($hd->emrdfk == 3484 || $hd->emrdfk == 6262) {
                            $hd45 = $hd->value;
                        }
                        // Baris 6
                        else if ($hd->emrdfk == 3485 || $hd->emrdfk == 6263) {
                            $hd46 = $hd->value;
                        } else if ($hd->emrdfk == 3486 || $hd->emrdfk == 6264) {
                            $hd47 = $hd->value;
                        } else if ($hd->emrdfk == 3487 || $hd->emrdfk == 6265) {
                            $hd48 = $hd->value;
                        } else if ($hd->emrdfk == 3488 || $hd->emrdfk == 6266) {
                            $hd49 = $hd->value;
                        } else if ($hd->emrdfk == 3489 || $hd->emrdfk == 6267) {
                            $hd50 = $hd->value;
                        } else if ($hd->emrdfk == 3490 || $hd->emrdfk == 6268) {
                            $hd51 = $hd->value;
                        } else if ($hd->emrdfk == 3491 || $hd->emrdfk == 6269) {
                            $hd52 = $hd->value;
                        } else if ($hd->emrdfk == 3492 || $hd->emrdfk == 6270) {
                            $hd53 = $hd->value;
                        } else if ($hd->emrdfk == 3493 || $hd->emrdfk == 6271) {
                            $hd54 = $hd->value;
                        }
                        // Baris 7
                        else if ($hd->emrdfk == 3494 || $hd->emrdfk == 6272) {
                            $hd55 = $hd->value;
                        } else if ($hd->emrdfk == 3495 || $hd->emrdfk == 6273) {
                            $hd56 = $hd->value;
                        } else if ($hd->emrdfk == 3496 || $hd->emrdfk == 6274) {
                            $hd57 = $hd->value;
                        } else if ($hd->emrdfk == 3497 || $hd->emrdfk == 6275) {
                            $hd58 = $hd->value;
                        } else if ($hd->emrdfk == 3498 || $hd->emrdfk == 6276) {
                            $hd59 = $hd->value;
                        } else if ($hd->emrdfk == 3499 || $hd->emrdfk == 6277) {
                            $hd60 = $hd->value;
                        } else if ($hd->emrdfk == 3500 || $hd->emrdfk == 6278) {
                            $hd61 = $hd->value;
                        } else if ($hd->emrdfk == 3501 || $hd->emrdfk == 6279) {
                            $hd62 = $hd->value;
                        } else if ($hd->emrdfk == 3502 || $hd->emrdfk == 6280) {
                            $hd63 = $hd->value;
                        }
                        // Baris 8
                        else if ($hd->emrdfk == 3503 || $hd->emrdfk == 6281) {
                            $hd64 = $hd->value;
                        } else if ($hd->emrdfk == 3504 || $hd->emrdfk == 6282) {
                            $hd65 = $hd->value;
                        } else if ($hd->emrdfk == 3505 || $hd->emrdfk == 6283) {
                            $hd66 = $hd->value;
                        } else if ($hd->emrdfk == 3506 || $hd->emrdfk == 6284) {
                            $hd67 = $hd->value;
                        } else if ($hd->emrdfk == 3507 || $hd->emrdfk == 6285) {
                            $hd68 = $hd->value;
                        } else if ($hd->emrdfk == 3508 || $hd->emrdfk == 6286) {
                            $hd69 = $hd->value;
                        } else if ($hd->emrdfk == 3509 || $hd->emrdfk == 6287) {
                            $hd70 = $hd->value;
                        } else if ($hd->emrdfk == 3510 || $hd->emrdfk == 6288) {
                            $hd71 = $hd->value;
                        } else if ($hd->emrdfk == 3511 || $hd->emrdfk == 6289) {
                            $hd72 = $hd->value;
                        }
                        // Baris 9
                        else if ($hd->emrdfk == 3512 || $hd->emrdfk == 6290) {
                            $hd73 = $hd->value;
                        } else if ($hd->emrdfk == 3513 || $hd->emrdfk == 6291) {
                            $hd74 = $hd->value;
                        } else if ($hd->emrdfk == 3514 || $hd->emrdfk == 6292) {
                            $hd75 = $hd->value;
                        } else if ($hd->emrdfk == 3515 || $hd->emrdfk == 6293) {
                            $hd76 = $hd->value;
                        } else if ($hd->emrdfk == 3516 || $hd->emrdfk == 6294) {
                            $hd77 = $hd->value;
                        } else if ($hd->emrdfk == 3517 || $hd->emrdfk == 6295) {
                            $hd78 = $hd->value;
                        } else if ($hd->emrdfk == 3518 || $hd->emrdfk == 6296) {
                            $hd79 = $hd->value;
                        } else if ($hd->emrdfk == 3519 || $hd->emrdfk == 6297) {
                            $hd80 = $hd->value;
                        } else if ($hd->emrdfk == 3520 || $hd->emrdfk == 6298) {
                            $hd81 = $hd->value;
                        }
                        // Baris 10
                        else if ($hd->emrdfk == 3521 || $hd->emrdfk == 6299) {
                            $hd82 = $hd->value;
                        } else if ($hd->emrdfk == 3522 || $hd->emrdfk == 6300) {
                            $hd83 = $hd->value;
                        } else if ($hd->emrdfk == 3523 || $hd->emrdfk == 6301) {
                            $hd84 = $hd->value;
                        } else if ($hd->emrdfk == 3524 || $hd->emrdfk == 6302) {
                            $hd85 = $hd->value;
                        } else if ($hd->emrdfk == 3525 || $hd->emrdfk == 6303) {
                            $hd86 = $hd->value;
                        } else if ($hd->emrdfk == 3526 || $hd->emrdfk == 6304) {
                            $hd87 = $hd->value;
                        } else if ($hd->emrdfk == 3527 || $hd->emrdfk == 6305) {
                            $hd88 = $hd->value;
                        } else if ($hd->emrdfk == 3528 || $hd->emrdfk == 6306) {
                            $hd89 = $hd->value;
                        } else if ($hd->emrdfk == 3529 || $hd->emrdfk == 6307) {
                            $hd90 = $hd->value;
                        } else if ($hd->emrdfk == 3554 || $hd->emrdfk == 6332) {
                            $petugaspunksihd = $hd->value;
                        } else if ($hd->emrdfk == 3555 || $hd->emrdfk == 6333) {
                            $petugasterminasihd = $hd->value;
                        } else if ($hd->emrdfk == 3556 || $hd->emrdfk == 6334) {
                            $perawatpasienhd = $hd->value;
                        }
                    }

                    // --- PENGATURAN CHECKBOX & EXPLODE (POST PROCESSING) ---
                    if ($avfistula != '' && $avfistula != '0') {
                        $avfistula = 'checked';
                    }
                    if ($femotarishd != '' && $femotarishd != '0') {
                        $femotarishd = 'checked';
                    }
                    if ($doublelumenhd != '' && $doublelumenhd != '0') {
                        $doublelumenhd = 'checked';
                    }
                    if ($yanyerihd != '' && $yanyerihd != '0') {
                        $yanyerihd = 'checked';
                    }
                    if ($tidaknyerihd != '' && $tidaknyerihd != '0') {
                        $tidaknyerihd = 'checked';
                    }
                    if ($tidakadanyerihd != '' && $tidakadanyerihd != '0') {
                        $tidakadanyerihd = 'checked';
                    }
                    if ($sedikitnyerihd != '' && $sedikitnyerihd != '0') {
                        $sedikitnyerihd = 'checked';
                    }
                    if ($cukupnyerihd != '' && $cukupnyerihd != '0') {
                        $cukupnyerihd = 'checked';
                    }
                    if ($lumayannyerihd != '' && $lumayannyerihd != '0') {
                        $lumayannyerihd = 'checked';
                    }
                    if ($sangatnyerihd != '' && $sangatnyerihd != '0') {
                        $sangatnyerihd = 'checked';
                    }
                    if ($amatsangatnyerihd != '' && $amatsangatnyerihd != '0') {
                        $amatsangatnyerihd = 'checked';
                    }
                    if ($minumobathd != '' && $minumobathd != '0') {
                        $minumobathd = 'checked';
                    }
                    if ($mendengarmusikhd != '' && $mendengarmusikhd != '0') {
                        $mendengarmusikhd = 'checked';
                    }
                    if ($istirahathd != '' && $istirahathd != '0') {
                        $istirahathd = 'checked';
                    }
                    if ($berubahposisihd != '' && $berubahposisihd != '0') {
                        $berubahposisihd = 'checked';
                    }
                    if ($lainlainhd != '' && $lainlainhd != '0') {
                        $lainlainhd = 'checked';
                    }
                    if ($lowfluxhd != '' && $lowfluxhd != '0') {
                        $lowfluxhd = 'checked';
                    }
                    if ($highthd != '' && $highthd != '0') {
                        $highthd = 'checked';
                    }
                    if ($tessisa0hd != '' && $tessisa0hd != '0') {
                        $tessisa0hd = 'checked';
                    }
                    if ($tessisa1hd != '' && $tessisa1hd != '0') {
                        $tessisa1hd = 'checked';
                    }
                    if ($tessisa3hd != '' && $tessisa3hd != '0') {
                        $tessisa3hd = 'checked';
                    }
                    if ($alarmtestyahd != '' && $alarmtestyahd != '0') {
                        $alarmtestyahd = 'checked';
                    }
                    if ($alarmtesttidakhd != '' && $alarmtesttidakhd != '0') {
                        $alarmtesttidakhd = 'checked';
                    }

                    if ($dializerhd != '') {
                        $tampungdializerhd = explode("~", $dializerhd);
                        $dializerhd = $tampungdializerhd[1];
                    }
                    if ($petugas4hd != '') {
                        $tampungpetugas4hd = explode("~", $petugas4hd);
                        $petugas4hd = $tampungpetugas4hd[1];
                    }
                    if ($hurufmesinhd != '') {
                        $tampunghurufmesinhd = explode("~", $hurufmesinhd);
                        $hurufmesinhd = $tampunghurufmesinhd[1];
                    }
                    if ($angkamesinhd != '') {
                        $tampungangkamesinhd = explode("~", $angkamesinhd);
                        $angkamesinhd = $tampungangkamesinhd[1];
                    }
                    if ($dialisthd != '') {
                        $tampungdialisthd = explode("~", $dialisthd);
                        $dialisthd = $tampungdialisthd[1];
                    }
                    if ($anticoagulehd != '') {
                        $tampunganticoagulehd = explode("~", $anticoagulehd);
                        $anticoagulehd = $tampunganticoagulehd[1];
                    }
                    if ($jenisprogramhd != '') {
                        $tampungjenisprogramhd = explode("~", $jenisprogramhd);
                        $jenisprogramhd = $tampungjenisprogramhd[1];
                    }
                    if ($petugaspunksihd != '') {
                        $tampungpetugaspunksihd = explode("~", $petugaspunksihd);
                        $petugaspunksihd = $tampungpetugaspunksihd[1];
                    }
                    if ($petugasterminasihd != '') {
                        $tampungpetugasterminasihd = explode("~", $petugasterminasihd);
                        $petugasterminasihd = $tampungpetugasterminasihd[1];
                    }
                    if ($perawatpasienhd != '') {
                        $tampungperawatpasienhd = explode("~", $perawatpasienhd);
                        $perawatpasienhd = $tampungperawatpasienhd[1];
                    }
                    if ($hd97 != '') {
                        $tampunghd97 = explode("~", $hd97);
                        $hd97 = $tampunghd97[1];
                    }

                    $idDokterHDArray = DB::select(DB::raw("SELECT id FROM pegawai_m where namalengkap = '$perawatpasienhd' LIMIT 1"));

                    $qrCodeHD = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-new?idPegawai=" . $idDokterHDArray[0]->id);
                    echo "</br>";
                    header('Contert-Type: application/' . $qrCodeHD->getContentType());
                    $qrCodeHD2 = $qrCodeHD->writeDataUri();

                    $dataHemodialisa = array(
                        'dataprehd' => $dataprehd,
                        'tdhd' => $tdhd,
                        'nadihd' => $nadihd,
                        'pernapasanhd' => $pernapasanhd,
                        'suhuhd' => $suhuhd,
                        'respiratoryhd' => $respiratoryhd,
                        'edemahd' => $edemahd,
                        'bbkeringhd' => $bbkeringhd,
                        'bbprahd' => $bbprahd,
                        'perbedaanbbhd' => $perbedaanbbhd,
                        'avfistula' => $avfistula,
                        'femotarishd' => $femotarishd,
                        'doublelumenhd' => $doublelumenhd,
                        'yanyerihd' => $yanyerihd,
                        'tidaknyerihd' => $tidaknyerihd,
                        'tidakadanyerihd' => $tidakadanyerihd,
                        'sedikitnyerihd' => $sedikitnyerihd,
                        'cukupnyerihd' => $cukupnyerihd,
                        'lumayannyerihd' => $lumayannyerihd,
                        'sangatnyerihd' => $sangatnyerihd,
                        'amatsangatnyerihd' => $amatsangatnyerihd,
                        'skalanyerihd' => $skalanyerihd,
                        'lokasihd' => $lokasihd,
                        'durasihd' => $durasihd,
                        'frekuensihd' => $frekuensihd,
                        'karakteristikhd' => $karakteristikhd,
                        'minumobathd' => $minumobathd,
                        'mendengarmusikhd' => $mendengarmusikhd,
                        'istirahathd' => $istirahathd,
                        'berubahposisihd' => $berubahposisihd,
                        'lainlainhd' => $lainlainhd,
                        'sebutkanhd' => $sebutkanhd,
                        'luasmembranehd' => $luasmembranehd,
                        'lowfluxhd' => $lowfluxhd,
                        'highthd' => $highthd,
                        'dializerhd' => $dializerhd,
                        'priminghd' => $priminghd,
                        'singelusekehd' => $singelusekehd,
                        'tessisa0hd' => $tessisa0hd,
                        'tessisa1hd' => $tessisa1hd,
                        'tessisa3hd' => $tessisa3hd,
                        'petugas4hd' => $petugas4hd,
                        'alarmtesttidakhd' => $alarmtesttidakhd,
                        'alarmtestyahd' => $alarmtestyahd,
                        'hurufmesinhd' => $hurufmesinhd,
                        'angkamesinhd' => $angkamesinhd,
                        'jenisprogramhd' => $jenisprogramhd,
                        'dialisthd' => $dialisthd,
                        'conductivithd' => $conductivithd,
                        'anticoagulehd' => $anticoagulehd,
                        'dosisawalhd' => $dosisawalhd,
                        'dosispemeliharaanhd' => $dosispemeliharaanhd,
                        'jamtotalhd' => $jamtotalhd,
                        'jam11hd' => $jam11hd,
                        'jam12hd' => $jam12hd,
                        'masalahkeperawatan13hd' => $masalahkeperawatan13hd,
                        'jam21hd' => $jam21hd,
                        'jam22hd' => $jam22hd,
                        'masalahkeperawatan23hd' => $masalahkeperawatan23hd,
                        'jam31hd' => $jam31hd,
                        'jam32hd' => $jam32hd,
                        'masalahkeperawatan33hd' => $masalahkeperawatan33hd,
                        'jam41hd' => $jam41hd,
                        'jam42hd' => $jam42hd,
                        'masalahkeperawatan43hd' => $masalahkeperawatan43hd,
                        'waktumulaihd' => $waktumulaihd,
                        'waktuselesaihd' => $waktuselesaihd,
                        'lamawaktuhd' => $lamawaktuhd,
                        'keluhanhd' => $keluhanhd,
                        'keadaanhd' => $keadaanhd,
                        'td2hd' => $td2hd,
                        'nadi2hd' => $nadi2hd,
                        'pernapasan2hd' => $pernapasan2hd,
                        'suhu2hd' => $suhu2hd,
                        'bbposthd' => $bbposthd,
                        'sisacairanhd' => $sisacairanhd,
                        'transfusicairanhd' => $transfusicairanhd,
                        'washcairanhd' => $washcairanhd,
                        'minumcairanhd' => $minumcairanhd,
                        'jumlahcairanhd' => $jumlahcairanhd,
                        'petugaspunksihd' => $petugaspunksihd,
                        'petugasterminasihd' => $petugasterminasihd,
                        'selesaihd' => $selesaihd,
                        'perawatpasienhd' => $perawatpasienhd,
                        'qrhd' => $qrCodeHD2,
                        'hd1' => $hd1,
                        'hd2' => $hd2,
                        'hd3' => $hd3,
                        'hd4' => $hd4,
                        'hd5' => $hd5,
                        'hd6' => $hd6,
                        'hd7' => $hd7,
                        'hd8' => $hd8,
                        'hd9' => $hd9,
                        'hd10' => $hd10,
                        'hd11' => $hd11,
                        'hd12' => $hd12,
                        'hd13' => $hd13,
                        'hd14' => $hd14,
                        'hd15' => $hd15,
                        'hd16' => $hd16,
                        'hd17' => $hd17,
                        'hd18' => $hd18,
                        'hd19' => $hd19,
                        'hd20' => $hd20,
                        'hd21' => $hd21,
                        'hd22' => $hd22,
                        'hd23' => $hd23,
                        'hd24' => $hd24,
                        'hd25' => $hd25,
                        'hd26' => $hd26,
                        'hd27' => $hd27,
                        'hd28' => $hd28,
                        'hd29' => $hd29,
                        'hd30' => $hd30,
                        'hd31' => $hd31,
                        'hd32' => $hd32,
                        'hd33' => $hd33,
                        'hd34' => $hd34,
                        'hd35' => $hd35,
                        'hd36' => $hd36,
                        'hd37' => $hd37,
                        'hd38' => $hd38,
                        'hd39' => $hd39,
                        'hd40' => $hd40,
                        'hd41' => $hd41,
                        'hd42' => $hd42,
                        'hd43' => $hd43,
                        'hd44' => $hd44,
                        'hd45' => $hd45,
                        'hd46' => $hd46,
                        'hd47' => $hd47,
                        'hd48' => $hd48,
                        'hd49' => $hd49,
                        'hd50' => $hd50,
                        'hd51' => $hd51,
                        'hd52' => $hd52,
                        'hd53' => $hd53,
                        'hd54' => $hd54,
                        'hd55' => $hd55,
                        'hd56' => $hd56,
                        'hd57' => $hd57,
                        'hd58' => $hd58,
                        'hd59' => $hd59,
                        'hd60' => $hd60,
                        'hd61' => $hd61,
                        'hd62' => $hd62,
                        'hd63' => $hd63,
                        'hd64' => $hd64,
                        'hd65' => $hd65,
                        'hd66' => $hd66,
                        'hd67' => $hd67,
                        'hd68' => $hd68,
                        'hd69' => $hd69,
                        'hd70' => $hd70,
                        'hd71' => $hd71,
                        'hd72' => $hd72,
                        'hd73' => $hd73,
                        'hd74' => $hd74,
                        'hd75' => $hd75,
                        'hd76' => $hd76,
                        'hd77' => $hd77,
                        'hd78' => $hd78,
                        'hd79' => $hd79,
                        'hd80' => $hd80,
                        'hd81' => $hd81,
                        'hd82' => $hd82,
                        'hd83' => $hd83,
                        'hd84' => $hd84,
                        'hd85' => $hd85,
                        'hd86' => $hd86,
                        'hd87' => $hd87,
                        'hd88' => $hd88,
                        'hd89' => $hd89,
                        'hd90' => $hd90,
                        'hd91' => $hd91,
                        'hd92' => $hd92,
                        'hd93' => $hd93,
                        'hd94' => $hd94,
                        'hd95' => $hd95,
                        'hd96' => $hd96,
                        'hd97' => $hd97,
                        'hd98' => $hd98,
                        'hd99' => $hd99,
                        'hd100' => $hd100
                    );
                }
            }
        };

        // key 29-07-2024
        // --------------------Asesmen Rehabilitasi Medis-------------------
        //     if ($xcetakasesmenrehab == 1) {
        //         $asesmenrehab = [];

        //         $tanggaldanjam = '';
        //         $bb = '';
        //         $tb = '';
        //         $yadaricheck = '';
        //         $rscheck = '';
        //         $rs = '';
        //         $puskesmascheck = '';
        //         $puskesmes = '';
        //         $drcheck = '';
        //         $dr = '';
        //         $lainnyacheck = '';
        //         $diagnosarujukan = '';
        //         $tidakcheck = '';
        //         $datangsendiricheck = '';
        //         $diantarcheck = '';
        //         $riwayatalergiyacheck = '';
        //         $riwayatalergitidakcheck = '';
        //         $riwayatalergiket = '';
        //         $pemeriksaanrehabmedik = '';
        //         $anamnesa = '';
        //         $riwayatsosialekonomi = '';
        //         $riwayatavocasionaldanvocasional = '';
        //         $kesadaran = '';
        //         $tvtd = '';
        //         $tvn = '';
        //         $tvr = '';
        //         $tvs = '';
        //         $nyeritidakcheck = '';
        //         $nyeriyacheck = '';
        //         $nyerilokasi = '';
        //         $nyeriintensitas = '';
        //         $tidakadanyerirehab = '';
        //         $sedikitnyerirehab = '';
        //         $cukupnyerirehab = '';
        //         $lumayannyerirehab = '';
        //         $sangatnyerirehab = '';
        //         $amatsangatnyerirehab = '';
        //         $imttb = '';
        //         $imtbb = '';
        //         $postur = '';
        //         $ambulasi = '';
        //         $resikojatuhtidakcheck = '';
        //         $resikojatuhyacheck = '';
        //         $pemeriksaanssp = '';
        //         $pemeriksaanatregioacheck = '';
        //         $pemeriksaanatregiorcheck = '';
        //         $headandneckcheck = '';
        //         $arthoraks = '';
        //         $arabdomen = '';
        //         $arback = '';
        //         $aranggotagerak = '';
        //         $tanggaldanjam = '';
        //         $look = '';
        //         $feel = '';
        //         $movement = '';
        //         $testprovokasi = '';
        //         $testfungsional = '';
        //         $pemeriksaanpenunjang = '';
        //         $impairment = '';
        //         $disability = '';
        //         $handycap = '';
        //         $problem = '';
        //         $program = '';
        //         $goal = '';
        //         $evaluasi = '';
        //         $prosedurkfr = '';
        //         $koding = '';
        //         $diagnosafungsional = '';
        //         $diagnosamedis = '';
        //         $instrumenujifungsi = '';
        //         $hasilyangdidapat = '';
        //         $kesimpulan = '';
        //         $rekomendasi = '';
        //         $dpjprehabmedis = '';
        //         $cekdatakonsul = false;
        //         $cekdatarehab = false;
        //         $qrCodeSpKFR2 = '';
        //         $qrCodeKonsPas = '';
        //         $dataListKonsul = [];
        //         $normkonsul = '';
        //         $namapasienkonsul = '';
        //         $pasienkonsulnama = '';
        //         $dokterkonsul = '';
        //         $diagnosakonsul = '';
        //         $permintaanterapikonsul = '';
        //         $tempatkonsul = '';
        //         $tanggalkonsul = '';
        //         $pasienkonsul = '';
        //         $drskfrkonsul = '';
        //         $qrCodeKonsPas2 = '';
        //         if ($xcetakasesmenrehab) {
        //             $asesmenrehab = DB::select(DB::raw("
        // select epd.emrdfk, epd.value, ep.namaruangan from emrpasiend_t as epd join
        // emrpasien_t as ep on ep.noemr = epd.emrpasienfk 
        // where ep.noregistrasifk = '$noregistrasi' and ep.emrfk = 2021
        // "));
        //             if (count($asesmenrehab) > 0) {
        //                 $cekdatarehab = true;
        //                 foreach ($asesmenrehab as $rehab) {
        //                     if ($rehab->emrdfk == 8195) {
        //                         $tanggaldanjam = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8196) {
        //                         $bb = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8197) {
        //                         $tb = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8198) {
        //                         $yadaricheck = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8199) {
        //                         $rscheck = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8200) {
        //                         $rs = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8201) {
        //                         $puskesmascheck = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8202) {
        //                         $puskesmas = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8203) {
        //                         $drcheck = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8204) {
        //                         $dr = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8205) {
        //                         $lainnyacheck = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8207) {
        //                         $diagnosarujukan = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8208) {
        //                         $tidakcheck = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8209) {
        //                         $datangsendiricheck = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8210) {
        //                         $diantarcheck = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8211) {
        //                         $riwayatalergiyacheck = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8212) {
        //                         $riwayatalergitidakcheck = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8213) {
        //                         $riwayatalergiket = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8219) {
        //                         $pemeriksaanrehabmedik = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8220) {
        //                         $anamnesa = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8221) {
        //                         $riwayatsosialekonomi = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8222) {
        //                         $riwayatavocasionaldanvocasional = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8223) {
        //                         $kesadaran = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8224) {
        //                         $tvtd = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8225) {
        //                         $tvn = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8226) {
        //                         $tvr = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8227) {
        //                         $tvs = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8228) {
        //                         $nyeritidakcheck = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8229) {
        //                         $nyeriyacheck = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8230) {
        //                         $nyerilokasi = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8231) {
        //                         $nyeriintensitas = $rehab->value;
        //                     } else if ($rehab->emrdfk == 3275) {
        //                         $tidakadanyerirehab = $rehab->value;
        //                     } else if ($rehab->emrdfk == 3276) {
        //                         $sedikitnyerirehab = $rehab->value;
        //                     } else if ($rehab->emrdfk == 3277) {
        //                         $cukupnyerirehab = $rehab->value;
        //                     } else if ($rehab->emrdfk == 3278) {
        //                         $lumayannyerirehab = $rehab->value;
        //                     } else if ($rehab->emrdfk == 3279) {
        //                         $sangatnyerirehab = $rehab->value;
        //                     } else if ($rehab->emrdfk == 3280) {
        //                         $amatsangatnyerirehab = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8232) {
        //                         $imttb = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8233) {
        //                         $imtbb = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8234) {
        //                         $postur = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8235) {
        //                         $ambulasi = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8236) {
        //                         $resikojatuhtidakcheck = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8237) {
        //                         $resikojatuhyacheck = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8238) {
        //                         $pemeriksaanssp = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8239) {
        //                         $pemeriksaanatregioacheck = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8240) {
        //                         $pemeriksaanatregiorcheck = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8241) {
        //                         $headandneckcheck = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8242) {
        //                         $arthoraks = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8243) {
        //                         $arabdomen = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8244) {
        //                         $arback = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8245) {
        //                         $aranggotagerak = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8246) {
        //                         $look = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8247) {
        //                         $feel = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8248) {
        //                         $movement = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8249) {
        //                         $testprovokasi = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8250) {
        //                         $testfungsional = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8251) {
        //                         $pemeriksaanpenunjang = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8252) {
        //                         $impairment = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8253) {
        //                         $disability = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8254) {
        //                         $handycap = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8256) {
        //                         $problem = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8257) {
        //                         $program = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8258) {
        //                         $goal = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8259) {
        //                         $evaluasi = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8261) {
        //                         $prosedurkfr = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8262) {
        //                         $koding = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8269) {
        //                         $diagnosafungsional = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8270) {
        //                         $diagnosamedis = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8271) {
        //                         $instrumenujifungsi = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8272) {
        //                         $hasilyangdidapat = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8273) {
        //                         $kesimpulan = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8274) {
        //                         $rekomendasi = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8275) {
        //                         $dpjprehabmedis = $rehab->value;
        //                     }
        //                 }
        //                 if ($yadaricheck != '') {
        //                     if ($yadaricheck != '0') {
        //                         $yadaricheck = 'checked';
        //                     }
        //                 }
        //                 if ($rscheck != '') {
        //                     if ($rscheck != '0') {
        //                         $rscheck = 'checked';
        //                     }
        //                 }
        //                 if ($puskesmascheck != '') {
        //                     if ($puskesmascheck != '0') {
        //                         $puskesmascheck = 'checked';
        //                     }
        //                 }
        //                 if ($drcheck != '') {
        //                     if ($drcheck != '0') {
        //                         $drcheck = 'checked';
        //                     }
        //                 }
        //                 if ($lainnyacheck != '') {
        //                     if ($lainnyacheck != '0') {
        //                         $lainnyacheck = 'checked';
        //                     }
        //                 }
        //                 if ($riwayatalergiyacheck != '') {
        //                     if ($riwayatalergiyacheck != '0') {
        //                         $riwayatalergiyacheck = 'checked';
        //                     }
        //                 }
        //                 if ($riwayatalergitidakcheck != '') {
        //                     if ($riwayatalergitidakcheck != '0') {
        //                         $riwayatalergitidakcheck = 'checked';
        //                     }
        //                 }
        //                 if ($tidakcheck != '') {
        //                     if ($tidakcheck != '0') {
        //                         $tidakcheck = 'checked';
        //                     }
        //                 }
        //                 if ($datangsendiricheck != '') {
        //                     if ($datangsendiricheck != '0') {
        //                         $datangsendiricheck = 'checked';
        //                     }
        //                 }
        //                 if ($diantarcheck != '') {
        //                     if ($diantarcheck != '0') {
        //                         $diantarcheck = 'checked';
        //                     }
        //                 }
        //                 if ($tidakadanyerirehab != '') {
        //                     if ($tidakadanyerirehab != '0') {
        //                         $tidakadanyerirehab = 'checked';
        //                     }
        //                 }
        //                 if ($sedikitnyerirehab != '') {
        //                     if ($sedikitnyerirehab != '0') {
        //                         $sedikitnyerirehab = 'checked';
        //                     }
        //                 }
        //                 if ($cukupnyerirehab != '') {
        //                     if ($cukupnyerirehab != '0') {
        //                         $cukupnyerirehab = 'checked';
        //                     }
        //                 }
        //                 if ($lumayannyerirehab != '') {
        //                     if ($lumayannyerirehab != '0') {
        //                         $lumayannyerirehab = 'checked';
        //                     }
        //                 }
        //                 if ($sangatnyerirehab != '') {
        //                     if ($sangatnyerirehab != '0') {
        //                         $sangatnyerirehab = 'checked';
        //                     }
        //                 }
        //                 if ($amatsangatnyerirehab != '') {
        //                     if ($amatsangatnyerirehab != '0') {
        //                         $amatsangatnyerirehab = 'checked';
        //                     }
        //                 }
        //                 if ($resikojatuhtidakcheck != '') {
        //                     if ($resikojatuhtidakcheck != '0') {
        //                         $resikojatuhtidakcheck = 'checked';
        //                     }
        //                 }
        //                 if ($resikojatuhyacheck != '') {
        //                     if ($resikojatuhyacheck != '0') {
        //                         $resikojatuhyacheck = 'checked';
        //                     }
        //                 }
        //                 if ($pemeriksaanatregioacheck != '') {
        //                     if ($pemeriksaanatregioacheck != '0') {
        //                         $pemeriksaanatregioacheck = 'checked';
        //                     }
        //                 }
        //                 if ($pemeriksaanatregiorcheck != '') {
        //                     if ($pemeriksaanatregiorcheck != '0') {
        //                         $pemeriksaanatregiorcheck = 'checked';
        //                     }
        //                 }
        //                 if ($dpjprehabmedis != '') {
        //                     $tampungdpjprehabmedis = explode("~", $dpjprehabmedis);
        //                     $dpjprehabmedis = $tampungdpjprehabmedis[1];
        //                 }
        //             }

        //             $idDokterRehabArray = DB::select(DB::raw("SELECT id FROM pegawai_m where namalengkap = '$dpjprehabmedis' LIMIT 1"));

        //             $qrCodeRehab = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-new?idPegawai=" . $idDokterRehabArray[0]->id);
        //             echo "</br>";
        //             header('Contert-Type: application/' . $qrCodeRehab->getContentType());
        //             $qrCodeRehab2 = $qrCodeRehab->writeDataUri();

        //             $getNoCM = DB::select(DB::raw("SELECT ps.nocm FROM pasiendaftar_t as pd inner join pasien_m as ps on ps.id = pd.nocmfk where pd.noregistrasi = '$noregistrasi' LIMIT 1"));

        //             if (!empty($getNoCM)) {
        //                 $nocm = $getNoCM[0]->nocm;
        //                 $dataKonsul = TempKonsulRehab::where('noregistrasi', $noregistrasi)->first();
        //                 if ($dataKonsul) {
        //                     $qrCodeSpKFR = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-new?idPegawai=" . $dataKonsul->idspkfr);
        //                     $qrCodeSpKFR2 = $qrCodeSpKFR->writeDataUri();
        //                     $qrCodeKonsPas = new QrCode("Ditanda tangani oleh : " . $dataKonsul->namapasien);
        //                     $qrCodeKonsPas2 = $qrCodeKonsPas->writeDataUri();

        //                     $normkonsul = $dataKonsul->nocm;
        //                     $namapasienkonsul = $dataKonsul->namapasien;
        //                     $pasienkonsulnama = $dataKonsul->pasien;
        //                     $dokterkonsul = $dataKonsul->spkfr;
        //                     $diagnosakonsul = $dataKonsul->diagnosa;
        //                     $permintaanterapikonsul = $dataKonsul->terapi;
        //                     $tempatkonsul = $dataKonsul->tempat;
        //                     $tanggalkonsul = $dataKonsul->tanggal;
        //                     $pasienkonsul = $qrCodeKonsPas2;
        //                     $drskfrkonsul = $qrCodeSpKFR2;
        //                     $cekdatakonsul = true;
        //                 }
        //                 $dataTglKonsul = DB::table('tempkonsul_t as tkr')->select('tkr.*')->where('tkr.noregistrasi', $noregistrasi)->orderBy('tanggal', 'asc')->take(10)->get();

        //                 foreach ($dataTglKonsul as $konsul) {
        //                     if ($konsul->iddokter != null) {
        //                         $qrCodeDokter = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-new?idPegawai=" . $konsul->iddokter);
        //                         $qrCodeDokter2 = $qrCodeDokter->writeDataUri();
        //                     } else {
        //                         $qrCodeDokter2 = '';
        //                     }
        //                     if ($konsul->idterapis != null) {
        //                         $qrCodeTerapis = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-new?idPegawai=" . $konsul->idterapis);
        //                         $qrCodeTerapis2 = $qrCodeTerapis->writeDataUri();
        //                     } else {
        //                         $qrCodeTerapis2 = '';
        //                     }
        //                     if ($konsul->namapasien != null) {
        //                         $qrCodePasien = new QrCode('Ditanda tangani oleh ' . $konsul->namapasien);
        //                         $qrCodePasien2 = $qrCodePasien->writeDataUri();
        //                     } else {
        //                         $qrCodePasien2 = '';
        //                     }

        //                     $dataListKonsul[] = [
        //                         'program' => $konsul->program,
        //                         'tanggal' => $konsul->tanggal,
        //                         'pasien' => $qrCodePasien2,
        //                         'qrCodeDokter' => $qrCodeDokter2,
        //                         'qrCodeTerapis' => $qrCodeTerapis2
        //                     ];
        //                 }
        //             } else {
        //                 $dataKonsul = null;
        //                 $dataTglKonsul = null;
        //             }
        //         }

        //         $dataAsesmenRehab = array(
        //             'tanggaldanjam' => $tanggaldanjam,
        //             'bb' => $bb,
        //             'tb' => $tb,
        //             'yadaricheck' => $yadaricheck,
        //             'rscheck' => $rscheck,
        //             'rs' => $rs,
        //             'puskesmascheck' => $puskesmascheck,
        //             'puskesmes' => $puskesmes,
        //             'drcheck' => $drcheck,
        //             'dr' => $dr,
        //             'lainnyacheck' => $lainnyacheck,
        //             'diagnosarujukan' => $diagnosarujukan,
        //             'tidakcheck' => $tidakcheck,
        //             'datangsendiricheck' => $datangsendiricheck,
        //             'diantarcheck' => $diantarcheck,
        //             'riwayatalergiyacheck' => $riwayatalergiyacheck,
        //             'riwayatalergitidakcheck' => $riwayatalergitidakcheck,
        //             'riwayatalergiket' => $riwayatalergiket,
        //             'pemeriksaanrehabmedik' => $pemeriksaanrehabmedik,
        //             'anamnesa' => $anamnesa,
        //             'riwayatsosialekonomi' => $riwayatsosialekonomi,
        //             'riwayatavocasionaldanvocasional' => $riwayatavocasionaldanvocasional,
        //             'kesadaran' => $kesadaran,
        //             'tvtd' => $tvtd,
        //             'tvn' => $tvn,
        //             'tvr' => $tvr,
        //             'tvs' => $tvs,
        //             'nyeritidakcheck' => $nyeritidakcheck,
        //             'nyeriyacheck' => $nyeriyacheck,
        //             'nyerilokasi' => $nyerilokasi,
        //             'nyeriintensitas' => $nyeriintensitas,
        //             'tidakadanyerirehab' => $tidakadanyerirehab,
        //             'sedikitnyerirehab' => $sedikitnyerirehab,
        //             'cukupnyerirehab' => $cukupnyerirehab,
        //             'lumayannyerirehab' => $lumayannyerirehab,
        //             'sangatnyerirehab' => $sangatnyerirehab,
        //             'amatsangatnyerirehab' => $amatsangatnyerirehab,
        //             'imttb' => $imttb,
        //             'imtbb' => $imtbb,
        //             'postur' => $postur,
        //             'ambulasi' => $ambulasi,
        //             'resikojatuhtidakcheck' => $resikojatuhtidakcheck,
        //             'resikojatuhyacheck' => $resikojatuhyacheck,
        //             'pemeriksaanssp' => $pemeriksaanssp,
        //             'pemeriksaanatregioacheck' => $pemeriksaanatregioacheck,
        //             'pemeriksaanatregiorcheck' => $pemeriksaanatregiorcheck,
        //             'headandneckcheck' => $headandneckcheck,
        //             'arthoraks' => $arthoraks,
        //             'arabdomen' => $arabdomen,
        //             'arback' => $arback,
        //             'aranggotagerak' => $aranggotagerak,
        //             'tanggaldanjam' => $tanggaldanjam,
        //             'look' => $look,
        //             'feel' => $feel,
        //             'movement' => $movement,
        //             'testprovokasi' => $testprovokasi,
        //             'testfungsional' => $testfungsional,
        //             'pemeriksaanpenunjang' => $pemeriksaanpenunjang,
        //             'impairment' => $impairment,
        //             'disability' => $disability,
        //             'handycap' => $handycap,
        //             'problem' => $problem,
        //             'program' => $program,
        //             'goal' => $goal,
        //             'evaluasi' => $evaluasi,
        //             'prosedurkfr' => $prosedurkfr,
        //             'koding' => $koding,
        //             'diagnosafungsional' => $diagnosafungsional,
        //             'diagnosamedis' => $diagnosamedis,
        //             'instrumenujifungsi' => $instrumenujifungsi,
        //             'hasilyangdidapat' => $hasilyangdidapat,
        //             'kesimpulan' => $kesimpulan,
        //             'rekomendasi' => $rekomendasi,
        //             'dpjprehabmedis' => $qrCodeRehab2,
        //             'dpjprehabmedisnama' => $dpjprehabmedis,
        //             'normkonsul' => $normkonsul,
        //             'namapasienkonsul' => $namapasienkonsul,
        //             'pasienkonsulnama' => $pasienkonsulnama,
        //             'dokterkonsul' => $dokterkonsul,
        //             'diagnosakonsul' => $diagnosakonsul,
        //             'permintaanterapikonsul' => $permintaanterapikonsul,
        //             'tempatkonsul' => $tempatkonsul,
        //             'tanggalkonsul' => $tanggalkonsul,
        //             'pasienkonsul' => $qrCodeKonsPas2,
        //             'drskfrkonsul' => $qrCodeSpKFR2,
        //             'cekdatakonsul' => $cekdatakonsul,
        //             'dataListKonsul' => $dataListKonsul,
        //             'cekdatarehab' => $cekdatarehab
        //         );
        //     };

        // coba rehab
        if ($xcetakasesmenrehab == 1) {
            $asesmenrehab = [];
            $dataKonsulRehab = [];
            $cekdatakonsul = false;
            $qrCodeSpKFR2 = '';
            $qrCodeKonsPas = '';
            $dataListKonsulRehab = [];
            $normkonsul = '';
            $namapasienkonsul = '';
            $pasienkonsulnama = '';
            $dokterkonsul = '';
            $diagnosakonsul = '';
            $permintaanterapikonsul = '';
            $tempatkonsul = '';
            $tanggalkonsul = '';
            $pasienkonsul = '';
            $drskfrkonsul = '';
            $qrCodeKonsPas2 = '';
            $nocmrh = $dataPasien[0]->nocm;

            $asesmenrehab = DB::select(DB::raw("
                SELECT epd.emrdfk, epd.value, ep.namaruangan, ep.noemr
                FROM emrpasiend_t AS epd 
                JOIN emrpasien_t AS ep ON ep.noemr = epd.emrpasienfk 
                WHERE ep.nocm = '$nocmrh' AND ep.emrfk = 2021
            "));

            $dataAsesmenRehab = [];

            foreach ($asesmenrehab as $item) {
                $emrpasienfk = $item->noemr;
                if (!isset($dataAsesmenRehab[$emrpasienfk])) {
                    $dataAsesmenRehab[$emrpasienfk] = [];
                }

                // Cek apakah emrdfk adalah 8275
                if ($item->emrdfk == 8275) {
                    $qrDokterSp = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-new?idPegawai=" . $item->value);
                    $qrDokterSp2 = $qrDokterSp->writeDataUri(); // Simpan QR Code ke dalam variabel

                    $dataAsesmenRehab[$emrpasienfk][] = [
                        'emrdfk' => $item->emrdfk,
                        'value' => $qrDokterSp2, // Ganti value dengan QR Code
                        'namaruangan' => $item->namaruangan,
                        'emrpasienfk' => $emrpasienfk
                    ];
                } else {
                    $dataAsesmenRehab[$emrpasienfk][] = [
                        'emrdfk' => $item->emrdfk,
                        'value' => $item->value, // Tetap gunakan value asli
                        'namaruangan' => $item->namaruangan,
                        'emrpasienfk' => $emrpasienfk
                    ];
                }
            }
            $dataAsesmenRehab = array_values($dataAsesmenRehab);

            $getNoCM = DB::select(DB::raw("SELECT ps.nocm FROM pasiendaftar_t as pd inner join pasien_m as ps on ps.id = pd.nocmfk where pd.noregistrasi = '$noregistrasi' LIMIT 1"));

            if (!empty($getNoCM)) {
                $nocm = $getNoCM[0]->nocm;
                $dataKonsul = TempKonsulRehab::where('noregistrasi', $noregistrasi)->first();
                if ($dataKonsul) {
                    $qrCodeSpKFR = new QrCode("http:rsbsaonline.com/service/medifirst2000/report/cetak-ttd-new?idPegawai=" . $dataKonsul->idspkfr);
                    $qrCodeSpKFR2 = $qrCodeSpKFR->writeDataUri();
                    $qrCodeKonsPas = new QrCode("Ditanda tangani oleh : " . $dataKonsul->namapasien);
                    $qrCodeKonsPas2 = $qrCodeKonsPas->writeDataUri();

                    $normkonsul = $dataKonsul->nocm;
                    $namapasienkonsul = $dataKonsul->namapasien;
                    $pasienkonsulnama = $dataKonsul->pasien;
                    $dokterkonsul = $dataKonsul->spkfr;
                    $diagnosakonsul = $dataKonsul->diagnosa;
                    $permintaanterapikonsul = $dataKonsul->terapi;
                    $tempatkonsul = $dataKonsul->tempat;
                    $tanggalkonsul = $dataKonsul->tanggal;
                    $pasienkonsul = $qrCodeKonsPas2;
                    $drskfrkonsul = $qrCodeSpKFR2;
                    $cekdatakonsul = true;
                }
                $dataTglKonsul = DB::table('tempkonsul_t as tkr')->select('tkr.*')->where('tkr.noregistrasi', $noregistrasi)->orderBy('tanggal', 'asc')->take(10)->get();

                foreach ($dataTglKonsul as $konsul) {
                    if ($konsul->iddokter != null) {
                        $qrCodeDokter = new QrCode("http:rsbsaonline.com/service/medifirst2000/report/cetak-ttd-new?idPegawai=" . $konsul->iddokter);
                        $qrCodeDokter2 = $qrCodeDokter->writeDataUri();
                    } else {
                        $qrCodeDokter2 = '';
                    }
                    if ($konsul->idterapis != null) {
                        $qrCodeTerapis = new QrCode("http:rsbsaonline.com/service/medifirst2000/report/cetak-ttd-new?idPegawai=" . $konsul->idterapis);
                        $qrCodeTerapis2 = $qrCodeTerapis->writeDataUri();
                    } else {
                        $qrCodeTerapis2 = '';
                    }
                    if ($konsul->namapasien != null) {
                        $qrCodePasien = new QrCode('Ditanda tangani oleh ' . $konsul->namapasien);
                        $qrCodePasien2 = $qrCodePasien->writeDataUri();
                    } else {
                        $qrCodePasien2 = '';
                    }

                    $dataListKonsulRehab[] = [
                        'program' => $konsul->program,
                        'tanggal' => $konsul->tanggal,
                        'pasien' => $qrCodePasien2,
                        'qrCodeDokter' => $qrCodeDokter2,
                        'qrCodeTerapis' => $qrCodeTerapis2
                    ];
                }
            } else {
                $dataKonsul = [];
                $dataTglKonsul = [];
            }

            $dataKonsulRehab = array(
                'normkonsul' => $normkonsul,
                'namapasienkonsul' => $namapasienkonsul,
                'pasienkonsulnama' => $pasienkonsulnama,
                'dokterkonsul' => $dokterkonsul,
                'diagnosakonsul' => $diagnosakonsul,
                'permintaanterapikonsul' => $permintaanterapikonsul,
                'tempatkonsul' => $tempatkonsul,
                'tanggalkonsul' => $tanggalkonsul,
                'pasienkonsul' => $qrCodeKonsPas2,
                'drskfrkonsul' => $qrCodeSpKFR2,
                'dataListKonsulRehab' => $dataListKonsulRehab,
                'cekdatakonsul' => $cekdatakonsul
            );
        };

        // key 27-08-2024
        // --------------------Laporan Operasi-------------------
        if ($xcetaklaporanoperasi == 1) {
            $dataLaporanOperasi = [];
            $laporanoperasi = [];

            $tanggaloperasi = '';
            $dokterbedah = '';
            $asisten1 = '';
            $perawatinstrumen = '';
            $asisten2 = '';
            $perawatsirkuler = '';
            $ahlianestesi = '';
            $jenisanestesi = '';
            $perawatanestesi = '';
            $diagnosaprabedah = '';
            $indikasioperasi = '';
            $diagnosapascabedah = '';
            $jenisoperasi = '';
            $desinfeksikulit = '';
            $jaringaneksisiya = '';
            $jaringaneksisitidak = '';
            $mulai = '';
            $selesai = '';
            $lamaoperasi = '';
            $jenisbahan = '';
            $macamsayatan = '';
            $posisipenderita = '';
            $teknikoperasi = '';
            $komplikasiya = '';
            $komplikasitidak = '';
            $penjabarankomplikasi = '';
            $pendarahan = '';
            $transfusidarah = '';
            $implan = '';
            $kontrolnadi = '';
            $tensi = '';
            $pernapasan = '';
            $suhu = '';
            $text1234 = '';
            $puasa = '';
            $drain = '';
            $infus = '';
            $obatobatan = '';
            $gantibalut = '';
            $lainlain = '';
            $teknikoperasi = '';
            $ttddokterbedahop = '';
            if ($xcetaklaporanoperasi) {
                $laporanoperasi = DB::select(DB::raw("
                    select epd.emrdfk, epd.value, ep.namaruangan from emrpasiend_t as epd join
                    emrpasien_t as ep on ep.noemr = epd.emrpasienfk 
                    where ep.noregistrasifk = '$noregistrasi' and ep.emrfk = 899 AND ep.noemr = (
                    SELECT ep_inner.noemr
                    FROM emrpasien_t AS ep_inner
                    WHERE ep_inner.noregistrasifk = '$noregistrasi' 
                    AND ep_inner.emrfk = 899
                    ORDER BY ep_inner.tglemr DESC
                    LIMIT 1);
                    "));
                if (count($laporanoperasi) > 0) {
                    foreach ($laporanoperasi as $op) {

                        if ($op->emrdfk == 4491) {
                            $tanggaloperasi = $op->value;
                        } else if ($op->emrdfk == 4478) {
                            $dokterbedah = $op->value;
                        } else if ($op->emrdfk == 4479) {
                            $asisten1 = $op->value;
                        } else if ($op->emrdfk == 4480) {
                            $perawatinstrumen = $op->value;
                        } else if ($op->emrdfk == 6584) {
                            $asisten2 = $op->value;
                        } else if ($op->emrdfk == 6585) {
                            $perawatsirkuler = $op->value;
                        } else if ($op->emrdfk == 6583) {
                            $ahlianestesi = $op->value;
                        } else if ($op->emrdfk == 4495) {
                            $jenisanestesi = $op->value;
                        } else if ($op->emrdfk == 6586) {
                            $perawatanestesi = $op->value;
                        } else if ($op->emrdfk == 4481) {
                            $diagnosaprabedah = $op->value;
                        } else if ($op->emrdfk == 6587) {
                            $indikasioperasi = $op->value;
                        } else if ($op->emrdfk == 4482) {
                            $diagnosapascabedah = $op->value;
                        } else if ($op->emrdfk == 8144) {
                            $jenisoperasi = $op->value;
                        } else if ($op->emrdfk == 6588) {
                            $desinfeksikulit = $op->value;
                        } else if ($op->emrdfk == 4489) {
                            $jaringaneksisiya = $op->value;
                        } else if ($op->emrdfk == 4488) {
                            $jaringaneksisitidak = $op->value;
                        } else if ($op->emrdfk == 4493) {
                            $lamaoperasi = $op->value;
                        } else if ($op->emrdfk == 4490) {
                            $jenisbahan = $op->value;
                        } else if ($op->emrdfk == 4494) {
                            $mulai = $op->value;
                        } else if ($op->emrdfk == 4496) {
                            $selesai = $op->value;
                        } else if ($op->emrdfk == 6589) {
                            $macamsayatan = $op->value;
                        } else if ($op->emrdfk == 6590) {
                            $posisipenderita = $op->value;
                        } else if ($op->emrdfk == 6591) {
                            $teknikoperasi = $op->value;
                        } else if ($op->emrdfk == 6592) {
                            $komplikasiya = $op->value;
                        } else if ($op->emrdfk == 6593) {
                            $komplikasitidak = $op->value;
                        } else if ($op->emrdfk == 6594) {
                            $penjabarankomplikasi = $op->value;
                        } else if ($op->emrdfk == 6595) {
                            $pendarahan = $op->value;
                        } else if ($op->emrdfk == 6596) {
                            $transfusidarah = $op->value;
                        } else if ($op->emrdfk == 6597) {
                            $implan = $op->value;
                        } else if ($op->emrdfk == 6598) {
                            $kontrolnadi = $op->value;
                        } else if ($op->emrdfk == 6599) {
                            $tensi = $op->value;
                        } else if ($op->emrdfk == 6600) {
                            $pernapasan = $op->value;
                        } else if ($op->emrdfk == 6601) {
                            $suhu = $op->value;
                        } else if ($op->emrdfk == 6602) {
                            $text1234 = $op->value;
                        } else if ($op->emrdfk == 6603) {
                            $puasa = $op->value;
                        } else if ($op->emrdfk == 6604) {
                            $drain = $op->value;
                        } else if ($op->emrdfk == 6605) {
                            $infus = $op->value;
                        } else if ($op->emrdfk == 6606) {
                            $obatobatan = $op->value;
                        } else if ($op->emrdfk == 6607) {
                            $gantibalut = $op->value;
                        } else if ($op->emrdfk == 6608) {
                            $lainlain = $op->value;
                        } else if ($op->emrdfk == 4503) {
                            $ttddokterbedahop = $op->value;
                        }
                    }
                    if ($jaringaneksisiya != '') {
                        if ($jaringaneksisiya != '0') {
                            $jaringaneksisiya = 'checked';
                        }
                    }
                    if ($jaringaneksisitidak != '') {
                        if ($jaringaneksisitidak != '0') {
                            $jaringaneksisitidak = 'checked';
                        }
                    }
                    if ($komplikasiya != '') {
                        if ($komplikasiya != '0') {
                            $komplikasiya = 'checked';
                        }
                    }
                    if ($komplikasitidak != '') {
                        if ($komplikasitidak != '0') {
                            $komplikasitidak = 'checked';
                        }
                    }
                    if ($kontrolnadi != '') {
                        if ($kontrolnadi != '0') {
                            $kontrolnadi = 'checked';
                        }
                    }
                    if ($tensi != '') {
                        if ($tensi != '0') {
                            $tensi = 'checked';
                        }
                    }
                    if ($pernapasan != '') {
                        if ($pernapasan != '0') {
                            $pernapasan = 'checked';
                        }
                    }
                    if ($suhu != '') {
                        if ($suhu != '0') {
                            $suhu = 'checked';
                        }
                    }

                    $idDokterBedahArray = DB::select(DB::raw("SELECT id FROM pegawai_m where namalengkap = '$ttddokterbedahop' LIMIT 1"));

                    $qrCodeOP = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-new?idPegawai=" . $idDokterBedahArray[0]->id);
                    echo "</br>";
                    header('Contert-Type: application/' . $qrCodeOP->getContentType());
                    $qrCodeOP2 = $qrCodeOP->writeDataUri();

                    $dataLaporanOperasi = array(
                        'tanggaloperasi' => $tanggaloperasi,
                        'dokterbedah' => $dokterbedah,
                        'asisten1' => $asisten1,
                        'perawatinstrumen' => $perawatinstrumen,
                        'asisten2' => $asisten2,
                        'perawatsirkuler' => $perawatsirkuler,
                        'ahlianestesi' => $ahlianestesi,
                        'jenisanestesi' => $jenisanestesi,
                        'perawatanestesi' => $perawatanestesi,
                        'diagnosaprabedah' => $diagnosaprabedah,
                        'indikasioperasi' => $indikasioperasi,
                        'diagnosapascabedah' => $diagnosapascabedah,
                        'jenisoperasi' => $jenisoperasi,
                        'desinfeksikulit' => $desinfeksikulit,
                        'jaringaneksisiya' => $jaringaneksisiya,
                        'jaringaneksisitidak' => $jaringaneksisitidak,
                        'mulai' => $mulai,
                        'selesai' => $selesai,
                        'lamaoperasi' => $lamaoperasi,
                        'jenisbahan' => $jenisbahan,
                        'macamsayatan' => $macamsayatan,
                        'posisipenderita' => $posisipenderita,
                        'teknikoperasi' => $teknikoperasi,
                        'komplikasiya' => $komplikasiya,
                        'komplikasitidak' => $komplikasitidak,
                        'penjabarankomplikasi' => $penjabarankomplikasi,
                        'pendarahan' => $pendarahan,
                        'transfusidarah' => $transfusidarah,
                        'implan' => $implan,
                        'kontrolnadi' => $kontrolnadi,
                        'tensi' => $tensi,
                        'pernapasan' => $pernapasan,
                        'suhu' => $suhu,
                        'text1234' => $text1234,
                        'puasa' => $puasa,
                        'drain' => $drain,
                        'infus' => $infus,
                        'obatobatan' => $obatobatan,
                        'gantibalut' => $gantibalut,
                        'lainlain' => $lainlain,
                        'teknikoperasi' => $teknikoperasi,
                        'ttddokterbedahop' => $qrCodeOP2,
                        'ttddokterbedahopnama' => $ttddokterbedahop
                    );
                }
            }
        };
        // key 30-09-2024
        // --------------------SPRI-------------------
        if ($xcetakspri == 1) {
            $dataSPRI = [];
            $spri = [];

            $darisp = '';
            $diagnosissp = '';
            $indikasisp = '';
            $tujuansp = '';
            $rencanasp = '';
            $perkiraansp = '';
            $risikotransmisi = '';
            $tglmasuksp = '';
            $tgloperasisp = '';
            $picucheckbox = '';
            $nicucheckbox = '';
            $icucheckbox = '';
            $perinacheckbox = '';
            $isolasitbcheckbox = '';
            $isolasinontbcheckbox = '';
            $isolasipinerecheckbox = '';
            $tahanancheckbox = '';
            $rawatbiasacheckbox = '';
            $konfirmasisp = '';
            $ruangansp = '';
            $statussp = '';
            $tglsuratsp = '';
            $ttdpasiensp = '';
            $doktersp = '';

            if ($xcetakspri) {
                $spri = DB::select(DB::raw("
                    select epd.emrdfk, epd.value, ep.namaruangan from emrpasiend_t as epd join
                    emrpasien_t as ep on ep.noemr = epd.emrpasienfk 
                    where ep.noregistrasifk = '$noregistrasi' and ep.emrfk = 2022 AND epd.emrfk = 2022 AND ep.noemr = (
                    SELECT ep_inner.noemr
                    FROM emrpasien_t AS ep_inner
                    WHERE ep_inner.noregistrasifk = '$noregistrasi' 
                    AND ep_inner.emrfk = 2022
                    AND ep_inner.jenisemr = 'spri'
                    AND ep_inner.isfinal = TRUE
                    ORDER BY ep_inner.tglemr DESC
                    LIMIT 1);
                    "));
                if (count($spri) > 0) {
                    foreach ($spri as $sp) {

                        if ($sp->emrdfk == 367) {
                            $darisp = $sp->value;
                        } else if ($sp->emrdfk == 702) {
                            $diagnosissp = $sp->value;
                        } else if ($sp->emrdfk == 358) {
                            $indikasisp = $sp->value;
                        } else if ($sp->emrdfk == 218) {
                            $tujuansp = $sp->value;
                        } else if ($sp->emrdfk == 379) {
                            $rencanasp = $sp->value;
                        } else if ($sp->emrdfk == 372) {
                            $perkiraansp = $sp->value;
                        } else if ($sp->emrdfk == 1901302607) {
                            $risikotransmisi = $sp->value;
                        } else if ($sp->emrdfk == 796) {
                            $tglmasuksp = $sp->value;
                        } else if ($sp->emrdfk == 797) {
                            $tgloperasisp = $sp->value;
                        } else if ($sp->emrdfk == 1) {
                            $picucheckbox = $sp->value;
                        } else if ($sp->emrdfk == 2) {
                            $nicucheckbox = $sp->value;
                        } else if ($sp->emrdfk == 3) {
                            $icucheckbox = $sp->value;
                        } else if ($sp->emrdfk == 5) {
                            $perinacheckbox = $sp->value;
                        } else if ($sp->emrdfk == 4) {
                            $isolasitbcheckbox = $sp->value;
                        } else if ($sp->emrdfk == 7) {
                            $isolasinontbcheckbox = $sp->value;
                        } else if ($sp->emrdfk == 8) {
                            $isolasipinerecheckbox = $sp->value;
                        } else if ($sp->emrdfk == 10) {
                            $tahanancheckbox = $sp->value;
                        } else if ($sp->emrdfk == 6) {
                            $rawatbiasacheckbox = $sp->value;
                        } else if ($sp->emrdfk == 366) {
                            $konfirmasisp = $sp->value;
                        } else if ($sp->emrdfk == 4806) {
                            $ruangansp = $sp->value;
                        } else if ($sp->emrdfk == 130) {
                            $statussp = $sp->value;
                        } else if ($sp->emrdfk == 798) {
                            $tglsuratsp = $sp->value;
                        } else if ($sp->emrdfk == 19) {
                            $ttdpasiensp = $sp->value;
                        } else if ($sp->emrdfk == 799) {
                            $doktersp = $sp->value;
                        }
                    }
                    if ($picucheckbox != '') {
                        if ($picucheckbox != '0') {
                            $picucheckbox = 'checked';
                        }
                    }
                    if ($nicucheckbox != '') {
                        if ($nicucheckbox != '0') {
                            $nicucheckbox = 'checked';
                        }
                    }
                    if ($icucheckbox != '') {
                        if ($icucheckbox != '0') {
                            $icucheckbox = 'checked';
                        }
                    }
                    if ($perinacheckbox != '') {
                        if ($perinacheckbox != '0') {
                            $perinacheckbox = 'checked';
                        }
                    }
                    if ($isolasitbcheckbox != '') {
                        if ($isolasitbcheckbox != '0') {
                            $isolasitbcheckbox = 'checked';
                        }
                    }
                    if ($isolasinontbcheckbox != '') {
                        if ($isolasinontbcheckbox != '0') {
                            $isolasinontbcheckbox = 'checked';
                        }
                    }
                    if ($isolasipinerecheckbox != '') {
                        if ($isolasipinerecheckbox != '0') {
                            $isolasipinerecheckbox = 'checked';
                        }
                    }
                    if ($tahanancheckbox != '') {
                        if ($tahanancheckbox != '0') {
                            $tahanancheckbox = 'checked';
                        }
                    }
                    if ($rawatbiasacheckbox != '') {
                        if ($rawatbiasacheckbox != '0') {
                            $rawatbiasacheckbox = 'checked';
                        }
                    }

                    $qrNamaPasien = new QrCode($ttdpasiensp);
                    echo "</br>";
                    header('Contert-Type: application/' . $qrNamaPasien->getContentType());
                    $qrNamaPasien2 = $qrNamaPasien->writeDataUri();

                    $qrDokterSp = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-new?namaPegawai=" . $doktersp);
                    echo "</br>";
                    header('Contert-Type: application/' . $qrDokterSp->getContentType());
                    $qrDokterSp2 = $qrDokterSp->writeDataUri();

                    $dataSPRI = array(
                        'darisp' => $darisp,
                        'diagnosissp' => $diagnosissp,
                        'indikasisp' => $indikasisp,
                        'tujuansp' => $tujuansp,
                        'rencanasp' => $rencanasp,
                        'perkiraansp' => $perkiraansp,
                        'risikotransmisi' => $risikotransmisi,
                        'tglmasuksp' => $tglmasuksp,
                        'tgloperasisp' => $tgloperasisp,
                        'picucheckbox' => $picucheckbox,
                        'nicucheckbox' => $nicucheckbox,
                        'icucheckbox' => $icucheckbox,
                        'perinacheckbox' => $perinacheckbox,
                        'isolasitbcheckbox' => $isolasitbcheckbox,
                        'isolasinontbcheckbox' => $isolasinontbcheckbox,
                        'isolasipinerecheckbox' => $isolasipinerecheckbox,
                        'tahanancheckbox' => $tahanancheckbox,
                        'rawatbiasacheckbox' => $rawatbiasacheckbox,
                        'konfirmasisp' => $konfirmasisp,
                        'ruangansp' => $ruangansp,
                        'statussp' => $statussp,
                        'tglsuratsp' => $tglsuratsp,
                        'ttdpasiensp' => $ttdpasiensp,
                        'doktersp' => $doktersp,
                        'qrDokterSp' => $qrDokterSp2,
                        'qrNamaPasien' => $qrNamaPasien2
                    );
                }
            }
        };

        // ---------------------Pengkajian Awal Medis IGD---------------------
        $pengkajianmedisigd = [];
        $dataPengkajianMedisIGD = [];
        $adapengkajianmedisigd = 'false';
        $tgldilayani = '';
        $alergi = '';
        $anamnesis = '';
        $allo = '';
        $auto = '';
        $tekanandarah = '';
        $pernapasan = '';
        $suhu = '';
        $nadi = '';
        $spo2 = '';
        $kesadaran = '';
        $keadaanumum = '';
        $beratbadan = '';
        $tinggibadan = '';
        $e = '';
        $m = '';
        $v = '';
        $tidakkepala = '';
        $adakepala = '';
        $kepala = '';
        $tidakleher = '';
        $adaleher = '';
        $leher = '';
        $tidakthorax = '';
        $adathorax = '';
        $thorax = '';
        $tidakabdomen = '';
        $adaabdomen = '';
        $abdomen = '';
        $tidakextremitas = '';
        $adaextremitas = '';
        $extremitas = '';
        $tidakgenitalia = '';
        $adagenitalia = '';
        $genitalia = '';
        $tidakanus = '';
        $adaanus = '';
        $anus = '';
        $tidakneurologis = '';
        $adaneurologis = '';
        $neurologis = '';
        $tidakkulit = '';
        $adakulit = '';
        $kulit = '';
        $oksigen = '';
        $tatalaksana = '';
        $daftarmasalah = '';
        $instruksimedis = '';
        $ketoksigen = '';
        $kettatalaksana = '';
        $ekg = '';
        $pulang = '';
        $tglpulangigd = '';
        $rawat = '';
        $sembuh = '';
        $belumsembuh = '';
        $meninggal = '';
        $intensif = '';
        $ketintensif = '';
        $ruanganlain = '';
        $ketruanganlain = '';
        $tidakkontrol = '';
        $adakontrol = '';
        $tglkontroligd = '';
        $ketkontrol = '';
        $politujuankontrol = '';
        $persutujuandokter = '';
        $melarikandiri = '';
        $apsigd = '';
        $pindahkerslain = '';
        $tgligd = '';
        $menanganiigd = '';
        $dpjpigd = '';
        $qrDokterMenanganiPMI2 = '';
        $qrDokterDPJPPMI2 = '';
        $qrPemberiPesan2 = '';
        $qrPemberiPesan4 = '';
        $igdicd10 = '';
        $PemberiPesan1 = '';
        $PemberiPesan2 = '';
        $ats = '';
        $alergiobattidak = '';
        $alergiobatya = '';
        $namaobat = '';
        $alergimakanantidak = '';
        $alergimakananya = '';
        $namamakanan = '';
        $alergilaintidak = '';
        $alergilainya = '';
        $namalain = '';
        $namakeluarga = '';
        $keluhanutama = '';
        $riwayatpenyakitdahulutidak = '';
        $riwayatpenyakitdahuluya = '';
        $riwayatpenyakitdahulu = '';
        $anamnesistambahan = '';
        $riwayatpenggunaanobat = '';
        $tidakmata = '';
        $adamata = '';
        $mata = '';
        $hamilya = '';
        $hamiltidak = '';
        $hamilG = '';
        $hamilP = '';
        $hamilA = '';
        $usiahamil = '';
        $masalahkeperawatan = '';
        $diagnosabanding = '';
        $tgltatalaksana = '';
        $pasien = '';
        $namapasien = '';
        $keluarga = '';
        $hubungankeluarga = '';
        $penanggungjawab = '';
        $namapenanggungjawab = '';
        $rresusitasi = '';
        $rawatinap = '';
        $rtindakan = '';
        $rujukinternal = '';
        $pulangaps = '';
        $diijinkanpulang = '';
        $meninggal = '';
        $tanggalmeninggal = '';
        $ambulancersbsa = '';
        $mobiljenazah = '';
        $kendaraanpribadi = '';
        $transportasilain = '';
        $kategoritransfer0 = '';
        $kategoritransfer05 = '';
        $kategoritransfer1 = '';
        $kategoritransfer2 = '';
        $kategoritransfer3 = '';
        $saatpulang = '';
        $saatdirujukeksternal = '';
        $melarikandiri = '';
        $kesadaran2 = '';
        $e2 = '';
        $m2 = '';
        $v2 = '';
        $tekananDarah2 = '';
        $pernafasan2 = '';
        $suhu2 = '';
        $nadi2 = '';
        $spo22 = '';
        $tglkonsultasidokter = '';
        $tglpulangjam = '';
        if ($xcetakpengkajianigd == 1) {
            //         $pengkajianmedisigd = DB::select(DB::raw("
            // select epd.emrdfk, epd.value from   emrpasiend_t as epd join
            // emrpasien_t as ep on ep.noemr = epd.emrpasienfk
            // where ep.noregistrasifk = '$noregistrasi' and ep.emrfk = 869
            // "));

            $lastEmr = \DB::table('emrpasien_t')
                ->where('noregistrasifk', $noregistrasi)
                ->where('emrfk', 869)
                ->orderBy('tglemr', 'desc')
                ->first();

            if ($lastEmr) {
                $pengkajianmedisigd = \DB::table('emrpasiend_t as emrdp')
                    ->select('emrdp.emrdfk', 'emrdp.value')
                    ->where('emrdp.emrpasienfk', $lastEmr->noemr)
                    ->where('emrdp.statusenabled', true)
                    ->get();
            }


            if (count($pengkajianmedisigd) > 0) {
                $adapengkajianmedisigd = 'true';
                foreach ($pengkajianmedisigd as $pmi) {

                    if ($pmi->emrdfk == 2404) {
                        $tgldilayani = $pmi->value;
                    } else if ($pmi->emrdfk == 2405) {
                        $alergi = $pmi->value;
                    } else if ($pmi->emrdfk == 2406) {
                        $allo = $pmi->value;
                    } else if ($pmi->emrdfk == 2407) {
                        $auto = $pmi->value;
                    } else if ($pmi->emrdfk == 2408) {
                        $anamnesis = $pmi->value;
                    } else if ($pmi->emrdfk == 2409) {
                        $tekanandarah = $pmi->value;
                    } else if ($pmi->emrdfk == 2410) {
                        $pernapasan = $pmi->value;
                    } else if ($pmi->emrdfk == 2411) {
                        $suhu = $pmi->value;
                    } else if ($pmi->emrdfk == 2412) {
                        $nadi = $pmi->value;
                    } else if ($pmi->emrdfk == 2413) {
                        $spo2 = $pmi->value;
                    } else if ($pmi->emrdfk == 2414) {
                        $split = explode('~', $pmi->value);
                        $kesadaran = isset($split[1]) ? $split[1] : $pmi->value;
                    } else if ($pmi->emrdfk == 2415) {
                        $keadaanumum = $pmi->value;
                    } else if ($pmi->emrdfk == 2416) {
                        $beratbadan = $pmi->value;
                    } else if ($pmi->emrdfk == 2417) {
                        $tinggibadan = $pmi->value;
                    } else if ($pmi->emrdfk == 2418) {
                        $e = $pmi->value;
                    } else if ($pmi->emrdfk == 2419) {
                        $m = $pmi->value;
                    } else if ($pmi->emrdfk == 2420) {
                        $v = $pmi->value;
                    } else if ($pmi->emrdfk == 2618) {
                        $tidakkepala = $pmi->value;
                    } else if ($pmi->emrdfk == 2619) {
                        $adakepala = $pmi->value;
                    } else if ($pmi->emrdfk == 2620) {
                        $kepala = $pmi->value;
                    } else if ($pmi->emrdfk == 2621) {
                        $tidakleher = $pmi->value;
                    } else if ($pmi->emrdfk == 2622) {
                        $adaleher = $pmi->value;
                    } else if ($pmi->emrdfk == 2623) {
                        $leher = $pmi->value;
                    } else if ($pmi->emrdfk == 2624) {
                        $tidakthorax = $pmi->value;
                    } else if ($pmi->emrdfk == 2625) {
                        $adathorax = $pmi->value;
                    } else if ($pmi->emrdfk == 2626) {
                        $thorax = $pmi->value;
                    } else if ($pmi->emrdfk == 2627) {
                        $tidakabdomen = $pmi->value;
                    } else if ($pmi->emrdfk == 2628) {
                        $adaabdomen = $pmi->value;
                    } else if ($pmi->emrdfk == 2629) {
                        $abdomen = $pmi->value;
                    } else if ($pmi->emrdfk == 2630) {
                        $tidakextremitas = $pmi->value;
                    } else if ($pmi->emrdfk == 2631) {
                        $adaextremitas = $pmi->value;
                    } else if ($pmi->emrdfk == 2632) {
                        $extremitas = $pmi->value;
                    } else if ($pmi->emrdfk == 2633) {
                        $tidakgenitalia = $pmi->value;
                    } else if ($pmi->emrdfk == 2634) {
                        $adagenitalia = $pmi->value;
                    } else if ($pmi->emrdfk == 2635) {
                        $genitalia = $pmi->value;
                    } else if ($pmi->emrdfk == 2676) {
                        $tidakanus = $pmi->value;
                    } else if ($pmi->emrdfk == 2677) {
                        $adaanus = $pmi->value;
                    } else if ($pmi->emrdfk == 2678) {
                        $anus = $pmi->value;
                    } else if ($pmi->emrdfk == 2679) {
                        $tidakneurologis = $pmi->value;
                    } else if ($pmi->emrdfk == 2680) {
                        $adaneurologis = $pmi->value;
                    } else if ($pmi->emrdfk == 2681) {
                        $neurologis = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300359) {
                        $tidakkulit = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300360) {
                        $adakulit = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300361) {
                        $kulit = $pmi->value;
                    } else if ($pmi->emrdfk == 2425) {
                        $daftarmasalah = $pmi->value;
                    } else if ($pmi->emrdfk == 2636) {
                        $oksigen = $pmi->value;
                    } else if ($pmi->emrdfk == 2637) {
                        $tatalaksana = $pmi->value;
                    } else if ($pmi->emrdfk == 2440) {
                        $instruksimedis = $pmi->value;
                    } else if ($pmi->emrdfk == 2638) {
                        $ketoksigen = $pmi->value;
                    } else if ($pmi->emrdfk == 2639) {
                        $kettatalaksana = $pmi->value;
                    } else if ($pmi->emrdfk == 2427) {
                        $ekg = $pmi->value;
                    } else if ($pmi->emrdfk == 2428) {
                        $pulang = $pmi->value;
                    } else if ($pmi->emrdfk == 2429) {
                        $tglpulangigd = $pmi->value;
                    } else if ($pmi->emrdfk == 2430) {
                        $rawat = $pmi->value;
                    } else if ($pmi->emrdfk == 2431) {
                        $sembuh = $pmi->value;
                    } else if ($pmi->emrdfk == 2432) {
                        $belumsembuh = $pmi->value;
                    } else if ($pmi->emrdfk == 2433) {
                        $meninggal = $pmi->value;
                    } else if ($pmi->emrdfk == 2434) {
                        $intensif = $pmi->value;
                    } else if ($pmi->emrdfk == 2435) {
                        $ketintensif = $pmi->value;
                    } else if ($pmi->emrdfk == 2436) {
                        $ruanganlain = $pmi->value;
                    } else if ($pmi->emrdfk == 2437) {
                        $ketruanganlain = $pmi->value;
                    } else if ($pmi->emrdfk == 2438) {
                        $tidakkontrol = $pmi->value;
                    } else if ($pmi->emrdfk == 2439) {
                        $adakontrol = $pmi->value;
                    } else if ($pmi->emrdfk == 2449) {
                        $tglkontroligd = $pmi->value;
                    } else if ($pmi->emrdfk == 2440) {
                        $ketkontrol = $pmi->value;
                    } else if ($pmi->emrdfk == 2441) {
                        $politujuankontrol = $pmi->value;
                    } else if ($pmi->emrdfk == 2442) {
                        $persutujuandokter = $pmi->value;
                    } else if ($pmi->emrdfk == 2443) {
                        $melarikandiri = $pmi->value;
                    } else if ($pmi->emrdfk == 2444) {
                        $apsigd = $pmi->value;
                    } else if ($pmi->emrdfk == 2445) {
                        $pindahkerslain = $pmi->value;
                    } else if ($pmi->emrdfk == 2446) {
                        $tgligd = $pmi->value;
                    } else if ($pmi->emrdfk == 2447) {
                        $menanganiigd = $pmi->value;
                    } else if ($pmi->emrdfk == 2448) {
                        $dpjpigd = $pmi->value;
                    } else if ($pmi->emrdfk == 2426) {
                        $igdicd10 = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300363) {
                        $PemberiPesan1 = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300364) {
                        $PemberiPesan2 = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300286) {
                        $ats = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300287) {
                        $alergiobattidak = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300288) {
                        $alergiobatya = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300289) {
                        $namaobat = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300290) {
                        $alergimakanantidak = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300291) {
                        $alergimakananya = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300292) {
                        $namamakanan = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300293) {
                        $alergilaintidak = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300294) {
                        $alergilainya = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300295) {
                        $namalain = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300296) {
                        $namakeluarga = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300297) {
                        $keluhanutama = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300306) {
                        $riwayatpenyakitdahulutidak = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300305) {
                        $riwayatpenyakitdahuluya = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300299) {
                        $riwayatpenyakitdahulu = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300300) {
                        $anamnesistambahan = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300301) {
                        $riwayatpenggunaanobat = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300302) {
                        $nyeriringan = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300303) {
                        $nyerisedang = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300304) {
                        $nyeriberat = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300356) {
                        $tidakmata = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300357) {
                        $adamata = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300358) {
                        $mata = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300307) {
                        $hamiltidak = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300308) {
                        $hamilya = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300309) {
                        $hamilG = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300310) {
                        $hamilP = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300311) {
                        $hamilA = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300312) {
                        $usiahamil = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300314) {
                        $masalahkeperawatan = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300313) {
                        $diagnosabanding = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300315) {
                        $tgltatalaksana = !empty($pmi->value) ? $pmi->value : '';
                    } else if ($pmi->emrdfk == 1901300362) {
                        $tglkonsultasidokter = !empty($pmi->value) ? $pmi->value : '';
                    } else if ($pmi->emrdfk == 1901300340) {
                        $tglpulangjam = !empty($pmi->value) ? $pmi->value : '';
                    } else if ($pmi->emrdfk == 1901300316) {
                        $pasien = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300317) {
                        $namapasien = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300318) {
                        $keluarga = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300319) {
                        $hubungankeluarga = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300320) {
                        $penanggungjawab = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300321) {
                        $namapenanggungjawab = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300322) {
                        $penerimapenjelasan = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300323) {
                        $rresusitasi = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300324) {
                        $rawatinap = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300325) {
                        $rtindakan = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300326) {
                        $rujukinternal = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300327) {
                        $pulangaps = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300328) {
                        $diijinkanpulang = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300329) {
                        $meninggal = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300330) {
                        $tanggalmeninggal = !empty($pmi->value) ? $pmi->value : null;
                    } else if ($pmi->emrdfk == 1901300331) {
                        $ambulancersbsa = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300332) {
                        $mobiljenazah = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300333) {
                        $kendaraanpribadi = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300334) {
                        $transportasilain = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300335) {
                        $kategoritransfer0 = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300336) {
                        $kategoritransfer05 = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300337) {
                        $kategoritransfer1 = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300338) {
                        $kategoritransfer2 = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300339) {
                        $kategoritransfer3 = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300353) {
                        $saatpulang = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300354) {
                        $saatdirujukeksternal = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300355) {
                        $melarikandiri = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300341) {
                        $tekananDarah2 = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300342) {
                        $pernapasan2 = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300343) {
                        $suhu2 = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300344) {
                        $nadi2 = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300345) {
                        $spo22 = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300346) {
                        $split = explode('~', $pmi->value);
                        $kesadaran2 = isset($split[1]) ? $split[1] : $pmi->value;
                    } else if ($pmi->emrdfk == 1901300350) {
                        $split = explode('~', $pmi->value);
                        $e2 = isset($split[1]) ? $split[1] : $pmi->value;
                    } else if ($pmi->emrdfk == 1901300351) {
                        $split = explode('~', $pmi->value);
                        $m2 = isset($split[1]) ? $split[1] : $pmi->value;
                    } else if ($pmi->emrdfk == 1901300352) {
                        $split = explode('~', $pmi->value);
                        $v2 = isset($split[1]) ? $split[1] : $pmi->value;
                    }
                }
                $dt = Carbon::parse($tgldilayani)->timezone('Asia/Jakarta');
                $tgldilayani = $dt->format('Y-m-d H:i:s');
                $tampunge = explode("~", $e);
                $e = $tampunge[0];
                $tampungm = explode("~", $m);
                $m = $tampungm[0];
                $tampungv = explode("~", $v);
                $v = $tampungv[0];
                if ($auto != '') {
                    $auto = 'checked';
                }
                if ($allo != '') {
                    $allo = 'checked';
                }
                if ($tidakkepala != '') {
                    if ($tidakkepala != '0') {
                        $tidakkepala = 'checked';
                    }
                }
                if ($adakepala != '') {
                    if ($adakepala != '0') {
                        $adakepala = 'checked';
                    }
                }
                if ($tidakleher != '') {
                    if ($tidakleher != '0') {
                        $tidakleher = 'checked';
                    }
                }
                if ($adaleher != '') {
                    if ($adaleher != '0') {
                        $adaleher = 'checked';
                    }
                }
                if ($tidakthorax != '') {
                    if ($tidakthorax != '0') {
                        $tidakthorax = 'checked';
                    }
                }
                if ($adathorax != '') {
                    if ($adathorax != '0') {
                        $adathorax = 'checked';
                    }
                }
                if ($tidakabdomen != '') {
                    if ($tidakabdomen != '0') {
                        $tidakabdomen = 'checked';
                    }
                }
                if ($adaabdomen != '') {
                    if ($adaabdomen != '0') {
                        $adaabdomen = 'checked';
                    }
                }
                if ($tidakextremitas != '') {
                    if ($tidakextremitas != '0') {
                        $tidakextremitas = 'checked';
                    }
                }
                if ($adaextremitas != '') {
                    if ($adaextremitas != '0') {
                        $adaextremitas = 'checked';
                    }
                }
                if ($tidakgenitalia != '') {
                    if ($tidakgenitalia != '0') {
                        $tidakgenitalia = 'checked';
                    }
                }
                if ($adagenitalia != '') {
                    if ($adagenitalia != '0') {
                        $adagenitalia = 'checked';
                    }
                }
                if ($tidakanus != '') {
                    if ($tidakanus != '0') {
                        $tidakanus = 'checked';
                    }
                }
                if ($adaanus != '') {
                    if ($adaanus != '0') {
                        $adaanus = 'checked';
                    }
                }
                if ($tidakneurologis != '') {
                    if ($tidakneurologis != '0') {
                        $tidakneurologis = 'checked';
                    }
                }
                if ($adaneurologis != '') {
                    if ($adaneurologis != '0') {
                        $adaneurologis = 'checked';
                    }
                }
                if ($tidakkulit != '') {
                    if ($tidakkulit != '0') {
                        $tidakkulit = 'checked';
                    }
                }
                if ($adakulit != '') {
                    if ($adakulit != '0') {
                        $adakulit = 'checked';
                    }
                }
                if ($oksigen != '') {
                    if ($oksigen != '0') {
                        $oksigen = 'checked';
                    }
                }
                if ($tatalaksana != '') {
                    if ($tatalaksana != '0') {
                        $tatalaksana = 'checked';
                    }
                }
                if ($pulang != '') {
                    if ($pulang != '0') {
                        $pulang = 'checked';
                    }
                }
                if ($rawat != '') {
                    if ($rawat != '0') {
                        $rawat = 'checked';
                    }
                }
                if ($sembuh != '') {
                    if ($sembuh != '0') {
                        $sembuh = 'checked';
                    }
                }
                if ($belumsembuh != '') {
                    if ($belumsembuh != '0') {
                        $belumsembuh = 'checked';
                    }
                }
                if ($meninggal != '') {
                    if ($meninggal != '0') {
                        $meninggal = 'checked';
                    }
                }
                if ($intensif != '') {
                    if ($intensif != '0') {
                        $intensif = 'checked';
                    }
                }
                if ($ruanganlain != '') {
                    if ($ruanganlain != '0') {
                        $ruanganlain = 'checked';
                    }
                }
                if ($tidakkontrol != '') {
                    if ($tidakkontrol != '0') {
                        $tidakkontrol = 'checked';
                    }
                }
                if ($adakontrol != '') {
                    if ($adakontrol != '0') {
                        $adakontrol = 'checked';
                    }
                }
                if ($persutujuandokter != '') {
                    if ($persutujuandokter != '0') {
                        $persutujuandokter = 'checked';
                    }
                }
                if ($melarikandiri != '') {
                    if ($melarikandiri != '0') {
                        $melarikandiri = 'checked';
                    }
                }
                if ($apsigd != '') {
                    if ($apsigd != '0') {
                        $apsigd = 'checked';
                    }
                }
                if ($pindahkerslain != '') {
                    if ($pindahkerslain != '0') {
                        $pindahkerslain = 'checked';
                    }
                }
                if ($alergiobattidak != '') {
                    if ($alergiobattidak != '0') {
                        $alergiobattidak = 'checked';
                    }
                }
                if ($alergiobatya != '') {
                    if ($alergiobatya != '0') {
                        $alergiobatya = 'checked';
                    }
                }
                if ($alergimakanantidak != '') {
                    if ($alergimakanantidak != '0') {
                        $alergimakanantidak = 'checked';
                    }
                }
                if ($alergimakananya != '') {
                    if ($alergimakananya != '0') {
                        $alergimakananya = 'checked';
                    }
                }
                if ($alergilaintidak != '') {
                    if ($alergilaintidak != '0') {
                        $alergilaintidak = 'checked';
                    }
                }
                if ($alergilainya != '') {
                    if ($alergilainya != '0') {
                        $alergilainya = 'checked';
                    }
                }
                if ($riwayatpenyakitdahulutidak != '') {
                    if ($riwayatpenyakitdahulutidak != '0') {
                        $riwayatpenyakitdahulutidak = 'checked';
                    }
                }
                if ($riwayatpenyakitdahuluya != '') {
                    if ($riwayatpenyakitdahuluya != '0') {
                        $riwayatpenyakitdahuluya = 'checked';
                    }
                }
                if ($nyeriringan != '') {
                    if ($nyeriringan != '0') {
                        $nyeriringan = 'checked';
                    }
                }
                if ($nyerisedang != '') {
                    if ($nyerisedang != '0') {
                        $nyerisedang = 'checked';
                    }
                }
                if ($nyeriberat != '') {
                    if ($nyeriberat != '0') {
                        $nyeriberat = 'checked';
                    }
                }
                if ($tidakmata != '') {
                    if ($tidakmata != '0') {
                        $tidakmata = 'checked';
                    }
                }
                if ($adamata != '') {
                    if ($adamata != '0') {
                        $adamata = 'checked';
                    }
                }
                if ($hamiltidak != '') {
                    if ($hamiltidak != '0') {
                        $hamiltidak = 'checked';
                    }
                }
                if ($hamilya != '') {
                    if ($hamilya != '0') {
                        $hamilya = 'checked';
                    }
                }
                if ($pasien != '') {
                    if ($pasien != '0') {
                        $pasien = 'checked';
                    }
                }
                if ($keluarga != '') {
                    if ($keluarga != '0') {
                        $keluarga = 'checked';
                    }
                }
                if ($penanggungjawab != '') {
                    if ($penanggungjawab != '0') {
                        $penanggungjawab = 'checked';
                    }
                }
                if ($rresusitasi != '') {
                    if ($rresusitasi != '0') {
                        $rresusitasi = 'checked';
                    }
                }
                if ($rawatinap != '') {
                    if ($rawatinap != '0') {
                        $rawatinap = 'checked';
                    }
                }
                if ($rtindakan != '') {
                    if ($rtindakan != '0') {
                        $rtindakan = 'checked';
                    }
                }
                if ($rujukinternal != '') {
                    if ($rujukinternal != '0') {
                        $rujukinternal = 'checked';
                    }
                }
                if ($pulangaps != '') {
                    if ($pulangaps != '0') {
                        $pulangaps = 'checked';
                    }
                }
                if ($diijinkanpulang != '') {
                    if ($diijinkanpulang != '0') {
                        $diijinkanpulang = 'checked';
                    }
                }
                if ($meninggal != '') {
                    if ($meninggal != '0') {
                        $meninggal = 'checked';
                    }
                }
                if ($ambulancersbsa != '') {
                    if ($ambulancersbsa != '0') {
                        $ambulancersbsa = 'checked';
                    }
                }
                if ($mobiljenazah != '') {
                    if ($mobiljenazah != '0') {
                        $mobiljenazah = 'checked';
                    }
                }
                if ($kendaraanpribadi != '') {
                    if ($kendaraanpribadi != '0') {
                        $kendaraanpribadi = 'checked';
                    }
                }
                if ($transportasilain != '') {
                    if ($transportasilain != '0') {
                        $transportasilain = 'checked';
                    }
                }
                if ($kategoritransfer0 != '') {
                    if ($kategoritransfer0 != '0') {
                        $kategoritransfer0 = 'checked';
                    }
                }
                if ($kategoritransfer05 != '') {
                    if ($kategoritransfer05 != '0') {
                        $kategoritransfer05 = 'checked';
                    }
                }
                if ($kategoritransfer1 != '') {
                    if ($kategoritransfer1 != '0') {
                        $kategoritransfer1 = 'checked';
                    }
                }
                if ($kategoritransfer2 != '') {
                    if ($kategoritransfer2 != '0') {
                        $kategoritransfer2 = 'checked';
                    }
                }
                if ($kategoritransfer3 != '') {
                    if ($kategoritransfer3 != '0') {
                        $kategoritransfer3 = 'checked';
                    }
                }
                if ($saatpulang != '') {
                    if ($saatpulang != '0') {
                        $saatpulang = 'checked';
                    }
                }
                if ($saatdirujukeksternal != '') {
                    if ($saatdirujukeksternal != '0') {
                        $saatdirujukeksternal = 'checked';
                    }
                }
                if ($melarikandiri != '') {
                    if ($melarikandiri != '0') {
                        $melarikandiri = 'checked';
                    }
                }

                $qrDokterMenanganiPMI = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $menanganiigd);
                echo "</br>";
                header('Contert-Type: application/' . $qrDokterMenanganiPMI->getContentType());
                $qrDokterMenanganiPMI2 = $qrDokterMenanganiPMI->writeDataUri();

                $qrDokterDPJPPMI = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $dpjpigd);
                echo "</br>";
                header('Contert-Type: application/' . $qrDokterDPJPPMI->getContentType());
                $qrDokterDPJPPMI2 = $qrDokterDPJPPMI->writeDataUri();

                if (!empty($PemberiPesan1)) {
                    $qrPemberiPesan = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $PemberiPesan1);
                    $qrPemberiPesan2 = $qrPemberiPesan->writeDataUri();
                } else {
                    $qrPemberiPesan2 = null;
                }

                if (!empty($PemberiPesan2)) {
                    $qrPemberiPesan3 = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $PemberiPesan2);
                    $qrPemberiPesan4 = $qrPemberiPesan3->writeDataUri();
                } else {
                    $qrPemberiPesan4 = null;
                }

                $dataPengkajianMedisIGD = array(
                    'adapengkajianmedisigd' => $adapengkajianmedisigd,
                    'tgldilayani' => $tgldilayani,
                    'alergi' => $alergi,
                    'allo' => $allo,
                    'auto' => $auto,
                    'anamnesis' => $anamnesis,
                    'tekanandarah' => $tekanandarah,
                    'pernapasan' => $pernapasan,
                    'suhu' => $suhu,
                    'nadi' => $nadi,
                    'spo2' => $spo2,
                    'kesadaran' => $kesadaran,
                    'keadaanumum' => $keadaanumum,
                    'beratbadan' => $beratbadan,
                    'tinggibadan' => $tinggibadan,
                    'e' => $e,
                    'm' => $m,
                    'v' => $v,
                    'tidakkepala' => $tidakkepala,
                    'adakepala' => $adakepala,
                    'kepala' => $kepala,
                    'tidakleher' => $tidakleher,
                    'adaleher' => $adaleher,
                    'leher' => $leher,
                    'tidakthorax' => $tidakthorax,
                    'adathorax' => $adathorax,
                    'thorax' => $thorax,
                    'tidakabdomen' => $tidakabdomen,
                    'adaabdomen' => $adaabdomen,
                    'abdomen' => $abdomen,
                    'tidakextremitas' => $tidakextremitas,
                    'adaextremitas' => $adaextremitas,
                    'extremitas' => $extremitas,
                    'tidakgenitalia' => $tidakgenitalia,
                    'adagenitalia' => $adagenitalia,
                    'genitalia' => $genitalia,
                    'tidakanus' => $tidakanus,
                    'adaanus' => $adaanus,
                    'anus' => $anus,
                    'tidakneurologis' => $tidakneurologis,
                    'adaneurologis' => $adaneurologis,
                    'neurologis' => $neurologis,
                    'tidakkulit' => $tidakkulit,
                    'adakulit' => $adakulit,
                    'kulit' => $kulit,
                    'daftarmasalah' => $daftarmasalah,
                    'igdicd10' => $igdicd10,
                    'oksigen' => $oksigen,
                    'tatalaksana' => $tatalaksana,
                    'instruksimedis' => $instruksimedis,
                    'ketoksigen' => $ketoksigen,
                    'kettatalaksana' => $kettatalaksana,
                    'ekg' => $ekg,
                    'pulang' => $pulang,
                    'tglpulangigd' => $tglpulangigd,
                    'rawat' => $rawat,
                    'sembuh' => $sembuh,
                    'belumsembuh' => $belumsembuh,
                    'meninggal' => $meninggal,
                    'intensif' => $intensif,
                    'ketintensif' => $ketintensif,
                    'ruanganlain' => $ruanganlain,
                    'ketruanganlain' => $ketruanganlain,
                    'tidakkontrol' => $tidakkontrol,
                    'adakontrol' => $adakontrol,
                    'tglkontroligd' => $tglkontroligd,
                    'ketkontrol' => $ketkontrol,
                    'politujuankontrol' => $politujuankontrol,
                    'persutujuandokter' => $persutujuandokter,
                    'melarikandiri' => $melarikandiri,
                    'apsigd' => $apsigd,
                    'pindahkerslain' => $pindahkerslain,
                    'tgligd' => $tgligd,
                    'menanganiigd' => $menanganiigd,
                    'dpjpigd' => $dpjpigd,
                    'PemberiPesan1' => $PemberiPesan1,
                    'PemberiPesan2' => $PemberiPesan2,
                    'qrDokterMenanganiPMI2' => $qrDokterMenanganiPMI2,
                    'qrDokterDPJPPMI2' => $qrDokterDPJPPMI2,
                    'qrPemberiPesan2' => $qrPemberiPesan2,
                    'qrPemberiPesan4' => $qrPemberiPesan4,
                    'ats' => $ats,
                    'alergiobattidak' => $alergiobattidak,
                    'alergiobatya' => $alergiobatya,
                    'namaobat' => $namaobat,
                    'alergimakanantidak' => $alergimakanantidak,
                    'alergimakananya' => $alergimakananya,
                    'namamakanan' => $namamakanan,
                    'alergilaintidak' => $alergilaintidak,
                    'alergilainya' => $alergilainya,
                    'namalain' => $namalain,
                    'namakeluarga' => $namakeluarga,
                    'keluhanutama' => $keluhanutama,
                    'riwayatpenyakitdahulutidak' => $riwayatpenyakitdahulutidak,
                    'riwayatpenyakitdahuluya' => $riwayatpenyakitdahuluya,
                    'riwayatpenyakitdahulu' => $riwayatpenyakitdahulu,
                    'anamnesistambahan' => $anamnesistambahan,
                    'riwayatpenggunaanobat' => $riwayatpenggunaanobat,
                    'nyeriringan' => $nyeriringan,
                    'nyerisedang' => $nyerisedang,
                    'nyeriberat' => $nyeriberat,
                    'tidakmata' => $tidakmata,
                    'adamata' => $adamata,
                    'mata' => $mata,
                    'hamiltidak' => $hamiltidak,
                    'hamilya' => $hamilya,
                    'hamilG' => $hamilG,
                    'hamilP' => $hamilP,
                    'hamilA' => $hamilA,
                    'usiahamil' => $usiahamil,
                    'masalahkeperawatan' => $masalahkeperawatan,
                    'diagnosabanding' => $diagnosabanding,
                    'tgltatalaksana' => $tgltatalaksana,
                    'tglkonsultasidokter' => $tglkonsultasidokter,
                    'tglpulangjam' => $tglpulangjam,
                    'pasien' => $pasien,
                    'namapasien' => $namapasien,
                    'keluarga' => $keluarga,
                    'hubungankeluarga' => $hubungankeluarga,
                    'penanggungjawab' => $penanggungjawab,
                    'namapenanggungjawab' => $namapenanggungjawab,
                    'rresusitasi' => $rresusitasi,
                    'rawatinap' => $rawatinap,
                    'rtindakan' => $rtindakan,
                    'rujukinternal' => $rujukinternal,
                    'pulangaps' => $pulangaps,
                    'diijinkanpulang' => $diijinkanpulang,
                    'meninggal' => $meninggal,
                    'tanggalmeninggal' => $tanggalmeninggal,
                    'ambulancersbsa' => $ambulancersbsa,
                    'mobiljenazah' => $mobiljenazah,
                    'kendaraanpribadi' => $kendaraanpribadi,
                    'transportasilain' => $transportasilain,
                    'kategoritransfer0' => $kategoritransfer0,
                    'kategoritransfer05' => $kategoritransfer05,
                    'kategoritransfer1' => $kategoritransfer1,
                    'kategoritransfer2' => $kategoritransfer2,
                    'kategoritransfer3' => $kategoritransfer3,
                    'saatpulang' => $saatpulang,
                    'saatdirujukeksternal' => $saatdirujukeksternal,
                    'melarikandiri' => $melarikandiri,
                    'kesadaran2' => $kesadaran2,
                    'e2' => $e2,
                    'm2' => $m2,
                    'v2' => $v2,
                    'tekananDarah2' => $tekananDarah2,
                    'pernafasan2' => $pernafasan2,
                    'suhu2' => $suhu2,
                    'nadi2' => $nadi2,
                    'spo22' => $spo22,
                );
            }
            //--x---
            //         $diagnosaigd = DB::select(DB::raw("
            // select jd.jenisdiagnosa, dg.namadiagnosa, dg.kddiagnosa || ' - ' || dg.namadiagnosa as namadiagnosakd from pasiendaftar_t as pd left join
            // antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec left join
            // diagnosapasien_t as dp on dp.noregistrasifk = apd.norec left join
            // detaildiagnosapasien_t as ddp on ddp.objectdiagnosapasienfk = dp.norec left join
            // diagnosa_m as dg on dg.id = ddp.objectdiagnosafk left join
            // jenisdiagnosa_m as jd on jd.id = ddp.objectjenisdiagnosafk
            // where pd.noregistrasi = '$noregistrasi' and apd.objectruanganfk = 569
            // "));
            // if (count($diagnosaigd) > 0) {
            //     foreach ($diagnosaigd as $digd) {
            //         $igdicd10 = $igdicd10 . $digd->namadiagnosakd . "\n";
            //     }
            // }
        };

        // CPPT
        $cppt = [];
        $adacppt = 'false';
        $qrcppt = '';
        $qrcodecppt = '';
        if ($xcetakcppt == 1) {
            $cppt = DB::select(DB::raw("
        select te.tgljam, te.profesi, te.subjective, te.objective, te.hasilpemeriksaan, te.assesment, te.plann, te.instruksitenaga , te.pegawai,
        te.subjective || '\n' || te.objective || '\n' || te.assesment || '\n' || te.plann as hasilpemeriksaan2, te.ttd, ttp2.tandatangan
        from emrpasien_t as ep left join
        tempemr_t as te on te.emrpasienfk = ep.noemr left join
        pegawai_m as pg on pg.namalengkap = te.pegawai left join
        tandatanganppa_t as ttp on ttp.objectpegawaifk = pg.id left join
        pegawai_m as pg2 on pg2.namalengkap = te.ttd left join
        tandatanganppa_t as ttp2 on ttp2.objectpegawaifk = pg2.id
        where ep.noregistrasifk = '$noregistrasi' and ep.emrfk = 518 and ispapj is not null
        order by tgljam
        "));
            $adacppt = 'false';
            if (count($cppt) > 0) {
                $adacppt = 'true';
                foreach ($cppt as $cp) {
                    $qrcppt = '';
                    $qrcodecppt = '';
                    if ($cp->ttd != null) {
                        $cp->ttd2 = "Penulis CPPT :";
                    } else {
                        $cp->ttd2 = "";
                    }
                    if ($cp->pegawai != null) {
                        $qrcodecppt = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $cp->pegawai);
                        echo "</br>";
                        header('Contert-Type: application/' . $qrcodecppt->getContentType());
                        $qrcppt = $qrcodecppt->writeDataUri();
                        $cp->ttdpegawai = $qrcppt;
                    } else {
                        $cp->ttdpegawai = "";
                    }
                }
            }
        }

        // --------------------MONITORING TRANSFUSI DARAH--------------------
        $transfusiDarahFix = [];
        if ($xcetakmtd == 1) {
            $noEmrTfDh = \DB::table('emrpasien_t as ep')
                ->join('pegawai_m as pg', 'pg.id', '=', 'ep.pegawaifk')
                ->select('ep.noemr', 'ep.emrfk')
                ->where('ep.noregistrasifk', $noregistrasi)
                ->where('ep.statusenabled', true)
                ->where('ep.emrfk', 2020)
                ->OrderBy('ep.tglemr', 'desc')
                ->get();

            if (count($noEmrTfDh) > 0) {
                foreach ($noEmrTfDh as $i) {
                    $detailTfDh = \DB::table('emrpasiend_t as emrdp')
                        ->leftjoin('emrdpolri_t as emrd', 'emrd.id', '=', 'emrdp.emrdfk')
                        ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'emrdp.pegawaifk')
                        ->select('emrdp.*', 'emrd.caption', 'emrd.type', 'emrd.nourut', 'emrdp.emrfk', 'emrd.reportdisplay', 'emrd.kodeexternal as kodeex', 'emrd.satuan', 'pg.namalengkap')
                        ->where('emrdp.statusenabled', true)
                        ->where('emrdp.emrpasienfk', $i->noemr)
                        ->where('emrdp.emrfk', $i->emrfk)
                        ->orderBy('emrdp.emrdfk', 'asc')
                        ->get();

                    $detailTfDhFix = [];
                    if (count($detailTfDh) > 0) {
                        foreach ($detailTfDh as $j) {
                            if (
                                intval($j->emrdfk) == 50
                                || intval($j->emrdfk) == 51
                                || intval($j->emrdfk) == 52
                                || intval($j->emrdfk) == 53
                                || intval($j->emrdfk) == 54
                            ) {
                                if ($j->value == 1) {
                                    $detailTfDhFix[$j->emrdfk] = true;
                                } else {
                                    $detailTfDhFix[$j->emrdfk] = false;
                                }
                            } elseif (intval($j->emrdfk) == 1466) {
                                if (strpos($j->value, '~') == true) {
                                    $split = explode('~', $j->value);
                                    $detailTfDhFix[$j->emrdfk] = $split[1];

                                    $qrcode = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $split[1]);
                                    $qr = $qrcode->writeDataUri();
                                    $detailTfDhFix[999] = $qr;
                                }
                            } else {
                                if (strpos($j->value, '~') == true) {
                                    $split = explode('~', $j->value);
                                    $detailTfDhFix[$j->emrdfk] = $split[1];
                                } else {
                                    $detailTfDhFix[$j->emrdfk] = $j->value;
                                }
                            }
                        }
                    }
                    $i->details = $detailTfDhFix;
                }
                $transfusiDarahFix = $noEmrTfDh;
            }
        }

        // --------------------TRIASE FETOMATERNAL--------------------
        $triaseFetomaternalFix = [];
        if ($xcetaktf == 1) {
            $noEmrTF = \DB::table('emrpasien_t as ep')
                ->join('pegawai_m as pg', 'pg.id', '=', 'ep.pegawaifk')
                ->select('ep.noemr', 'ep.emrfk')
                ->where('ep.noregistrasifk', $noregistrasi)
                ->where('ep.statusenabled', true)
                ->where('ep.emrfk', 2028)
                ->OrderBy('ep.tglemr', 'desc')
                ->first();

            if ($noEmrTF) {
                $detailTF = \DB::table('emrpasiend_t as emrdp')
                    ->leftjoin('emrd_t as emrd', 'emrd.id', '=', 'emrdp.emrdfk')
                    ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'emrdp.pegawaifk')
                    ->select('emrdp.*', 'emrd.caption', 'emrd.type', 'emrd.nourut', 'emrdp.emrfk', 'emrd.reportdisplay', 'emrd.kodeexternal as kodeex', 'emrd.satuan', 'pg.namalengkap')
                    ->where('emrdp.statusenabled', true)
                    ->where('emrdp.emrpasienfk', $noEmrTF->noemr)
                    ->where('emrdp.emrfk', $noEmrTF->emrfk)
                    ->orderBy('emrdp.emrdfk', 'asc')
                    ->get();

                $detailTFFix = [];
                if (count($detailTF) > 0) {
                    foreach ($detailTF as $j) {
                        if (
                            intval($j->emrdfk) == 1901300140
                            || intval($j->emrdfk) == 1901300141
                            || intval($j->emrdfk) == 28
                            || intval($j->emrdfk) == 32
                            || intval($j->emrdfk) == 34
                            || intval($j->emrdfk) == 35
                            || intval($j->emrdfk) == 37
                            || intval($j->emrdfk) == 1901300142
                            || intval($j->emrdfk) == 38
                            || intval($j->emrdfk) == 40
                            || intval($j->emrdfk) == 1901300143
                            || intval($j->emrdfk) == 1901300144
                            || intval($j->emrdfk) == 1901300146
                            || intval($j->emrdfk) == 1901300168
                            || intval($j->emrdfk) == 1901300170
                            || intval($j->emrdfk) == 1901300149
                            || intval($j->emrdfk) == 1901300150
                            || intval($j->emrdfk) == 1901300209
                            || intval($j->emrdfk) == 1901300172
                            || intval($j->emrdfk) == 1901300173
                            || intval($j->emrdfk) == 1901300210
                            || intval($j->emrdfk) == 1901300174
                            || intval($j->emrdfk) == 1901300214
                            || intval($j->emrdfk) == 1901300175
                            || intval($j->emrdfk) == 1901300179
                            || intval($j->emrdfk) == 1901300180
                            || intval($j->emrdfk) == 1901300181
                            || intval($j->emrdfk) == 1901300182
                            || intval($j->emrdfk) == 1901300211
                            || intval($j->emrdfk) == 1901300212
                            || intval($j->emrdfk) == 1901300152
                            || intval($j->emrdfk) == 1901300186
                            || intval($j->emrdfk) == 1901300187
                            || intval($j->emrdfk) == 1901300153
                            || intval($j->emrdfk) == 1901300188
                            || intval($j->emrdfk) == 1901300154
                            || intval($j->emrdfk) == 1901300155
                            || intval($j->emrdfk) == 1901300156
                            || intval($j->emrdfk) == 1901300158
                            || intval($j->emrdfk) == 41
                            || intval($j->emrdfk) == 46
                            || intval($j->emrdfk) == 47
                            || intval($j->emrdfk) == 1901300159
                            || intval($j->emrdfk) == 1901300194
                            || intval($j->emrdfk) == 1901300195
                            || intval($j->emrdfk) == 1901300160
                            || intval($j->emrdfk) == 1901300200
                            || intval($j->emrdfk) == 1901300201
                            || intval($j->emrdfk) == 1901300202
                            || intval($j->emrdfk) == 1901300203
                            || intval($j->emrdfk) == 1901300161
                            || intval($j->emrdfk) == 49
                            || intval($j->emrdfk) == 50
                            || intval($j->emrdfk) == 1901300260
                            || intval($j->emrdfk) == 1901300261
                            || intval($j->emrdfk) == 1901300262
                            || intval($j->emrdfk) == 1901300263
                            || intval($j->emrdfk) == 1901300264
                            || intval($j->emrdfk) == 1901300265
                            || intval($j->emrdfk) == 1901300266
                            || intval($j->emrdfk) == 1901300267
                            || intval($j->emrdfk) == 1901300268
                            || intval($j->emrdfk) == 1901300270
                            || intval($j->emrdfk) == 1901300271
                            || intval($j->emrdfk) == 1901300272
                            || intval($j->emrdfk) == 1901300273
                            || intval($j->emrdfk) == 1901300276
                            || intval($j->emrdfk) == 1901300277
                            || intval($j->emrdfk) == 1901300278
                            || intval($j->emrdfk) == 1901300279
                        ) {
                            if ($j->value == 1) {
                                $detailTFFix[$j->emrdfk] = true;
                            } else {
                                $detailTFFix[$j->emrdfk] = false;
                            }
                        } elseif (
                            intval($j->emrdfk) == 1901300269
                            || intval($j->emrdfk) == 1901300274
                            || intval($j->emrdfk) == 1901300275
                            || intval($j->emrdfk) == 1901300280
                            || intval($j->emrdfk) == 1901300281
                            || intval($j->emrdfk) == 1901300282
                            || intval($j->emrdfk) == 1901300285
                        ) {
                            $detailTFFix[$j->emrdfk] = $j->value; // simpan teks apa adanya
                        } elseif (intval($j->emrdfk) == 1901300115) {
                            if (strpos($j->value, '~') == true) {
                                $split = explode('~', $j->value);
                                $detailTFFix[$j->emrdfk] = $split[1];

                                $qrcode = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $split[1]);
                                $qr = $qrcode->writeDataUri();
                                if (!isset($detailTFFix[999])) {
                                    $detailTFFix[999] = $qr;
                                }
                            } else {
                                $detailTFFix[$j->emrdfk] = $j->value;
                                $qrcode = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $j->value);
                                $qr = $qrcode->writeDataUri();
                                $detailTFFix[999] = $qr;
                            }
                        } else {
                            if (strpos($j->value, '~') == true) {
                                $split = explode('~', $j->value);
                                $detailTFFix[$j->emrdfk] = $split[1];
                            } else {
                                $detailTFFix[$j->emrdfk] = $j->value;
                            }
                        }
                    }
                }
                $triaseFetomaternalFix = $detailTFFix;
            }
        }

        // --------------------CODE BLUE--------------------
        $codeBlueFix = [];
        if ($xcetakcodeblue == 1) {
            $noEmrCB = \DB::table('emrpasien_t as ep')
                ->join('pegawai_m as pg', 'pg.id', '=', 'ep.pegawaifk')
                ->select('ep.noemr', 'ep.emrfk')
                ->where('ep.noregistrasifk', $noregistrasi)
                ->where('ep.statusenabled', true)
                ->where('ep.emrfk', 2047)
                ->OrderBy('ep.tglemr', 'desc')
                ->first();

            if ($noEmrCB) {
                $detailCB = \DB::table('emrpasiend_t as emrdp')
                    ->leftjoin('emrd_t as emrd', 'emrd.id', '=', 'emrdp.emrdfk')
                    ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'emrdp.pegawaifk')
                    ->select('emrdp.*', 'emrd.caption', 'emrd.type', 'emrd.nourut', 'emrdp.emrfk', 'emrd.reportdisplay', 'emrd.kodeexternal as kodeex', 'emrd.satuan', 'pg.namalengkap')
                    ->where('emrdp.statusenabled', true)
                    ->where('emrdp.emrpasienfk', $noEmrCB->noemr)
                    ->where('emrdp.emrfk', $noEmrCB->emrfk)
                    ->orderBy('emrdp.emrdfk', 'asc')
                    ->get();

                $detailCBFix = [];
                if (count($detailCB) > 0) {
                    foreach ($detailCB as $j) {
                        if (
                            intval($j->emrdfk) == 1
                            || intval($j->emrdfk) == 2
                            || intval($j->emrdfk) == 3
                            || intval($j->emrdfk) == 4
                            || intval($j->emrdfk) == 5
                            || intval($j->emrdfk) == 6
                            || intval($j->emrdfk) == 7
                            || intval($j->emrdfk) == 8
                            || intval($j->emrdfk) == 10
                            || intval($j->emrdfk) == 11
                            || intval($j->emrdfk) == 12
                            || intval($j->emrdfk) == 13
                            || intval($j->emrdfk) == 14
                            || intval($j->emrdfk) == 16
                            || intval($j->emrdfk) == 17
                            || intval($j->emrdfk) == 18
                            || intval($j->emrdfk) == 24
                            || intval($j->emrdfk) == 25
                            || intval($j->emrdfk) == 26
                            || intval($j->emrdfk) == 27
                            || intval($j->emrdfk) == 28
                            || intval($j->emrdfk) == 51
                            || intval($j->emrdfk) == 52
                            || intval($j->emrdfk) == 31
                            || intval($j->emrdfk) == 40
                            || intval($j->emrdfk) == 42
                            || intval($j->emrdfk) == 44
                            || intval($j->emrdfk) == 45
                            || intval($j->emrdfk) == 46
                            || intval($j->emrdfk) == 47
                            || intval($j->emrdfk) == 49
                            || intval($j->emrdfk) == 50
                        ) {
                            if ($j->value == 1) {
                                $detailCBFix[$j->emrdfk] = true;
                            } else {
                                $detailCBFix[$j->emrdfk] = false;
                            }
                        } elseif (
                            intval($j->emrdfk) == 19
                            || intval($j->emrdfk) == 20
                            || intval($j->emrdfk) == 21
                            || intval($j->emrdfk) == 22
                            || intval($j->emrdfk) == 32
                            || intval($j->emrdfk) == 33
                            || intval($j->emrdfk) == 2373
                            || intval($j->emrdfk) == 2337
                            || intval($j->emrdfk) == 2341
                            || intval($j->emrdfk) == 2370
                            || intval($j->emrdfk) == 2371
                            || intval($j->emrdfk) == 2372
                            || intval($j->emrdfk) == 798
                            || intval($j->emrdfk) == 810
                            || intval($j->emrdfk) == 5137
                            || intval($j->emrdfk) == 6263
                            || intval($j->emrdfk) == 6254
                            || intval($j->emrdfk) == 1148
                            || intval($j->emrdfk) == 5152
                            || intval($j->emrdfk) == 36
                            || intval($j->emrdfk) == 37
                            || intval($j->emrdfk) == 69
                            || intval($j->emrdfk) == 84
                            || intval($j->emrdfk) == 85
                            || intval($j->emrdfk) == 95
                            || intval($j->emrdfk) == 108
                            || intval($j->emrdfk) == 113
                            || intval($j->emrdfk) == 120
                            || intval($j->emrdfk) == 2376
                            || intval($j->emrdfk) == 4173
                            || intval($j->emrdfk) == 124
                            || intval($j->emrdfk) == 131
                            || intval($j->emrdfk) == 176
                        ) {
                            $detailCBFix[$j->emrdfk] = $j->value;
                        } elseif (intval($j->emrdfk) == 39) {
                            if (strpos($j->value, '~') == true) {
                                $split = explode('~', $j->value);
                                $detailCBFix[$j->emrdfk] = $split[1];

                                $qrcode = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $split[1]);
                                $qr = $qrcode->writeDataUri();
                                if (!isset($detailCBFix[999])) {
                                    $detailCBFix[997] = $qr;
                                }
                            } else {
                                $detailCBFix[$j->emrdfk] = $j->value;
                                $qrcode = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $j->value);
                                $qr = $qrcode->writeDataUri();
                                $detailCBFix[997] = $qr;
                            }
                        } elseif (intval($j->emrdfk) == 129) {
                            if (strpos($j->value, '~') == true) {
                                $split = explode('~', $j->value);
                                $detailCBFix[$j->emrdfk] = $split[1];

                                $qrcode = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $split[1]);
                                $qr = $qrcode->writeDataUri();
                                if (!isset($detailCBFix[999])) {
                                    $detailCBFix[998] = $qr;
                                }
                            } else {
                                $detailCBFix[$j->emrdfk] = $j->value;
                                $qrcode = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $j->value);
                                $qr = $qrcode->writeDataUri();
                                $detailCBFix[998] = $qr;
                            }
                        } else {
                            if (strpos($j->value, '~') == true) {
                                $split = explode('~', $j->value);
                                $detailCBFix[$j->emrdfk] = $split[1];
                            } else {
                                $detailCBFix[$j->emrdfk] = $j->value;
                            }
                        }
                    }
                }
                $codeBlueFix = $detailCBFix;
            }
        }

        // --------------------PENILAIAN DERAJAT DEHIDRASI--------------------
        $derajatDehidrasiFix = [];
        if ($xcetakderajatdehidrasi == 1) {
            $noEmrDD = \DB::table('emrpasien_t as ep')
                ->join('pegawai_m as pg', 'pg.id', '=', 'ep.pegawaifk')
                ->select('ep.noemr', 'ep.emrfk')
                ->where('ep.noregistrasifk', $noregistrasi)
                ->where('ep.statusenabled', true)
                ->where('ep.emrfk', 2049)
                ->OrderBy('ep.tglemr', 'desc')
                ->first();

            if ($noEmrDD) {
                $detailDD = \DB::table('emrpasiend_t as emrdp')
                    ->leftjoin('emrd_t as emrd', 'emrd.id', '=', 'emrdp.emrdfk')
                    ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'emrdp.pegawaifk')
                    ->select('emrdp.*', 'emrd.caption', 'emrd.type', 'emrd.nourut', 'emrdp.emrfk', 'emrd.reportdisplay', 'emrd.kodeexternal as kodeex', 'emrd.satuan', 'pg.namalengkap')
                    ->where('emrdp.statusenabled', true)
                    ->where('emrdp.emrpasienfk', $noEmrDD->noemr)
                    ->where('emrdp.emrfk', $noEmrDD->emrfk)
                    ->orderBy('emrdp.emrdfk', 'asc')
                    ->get();

                $detailDDFix = [];
                if (count($detailDD) > 0) {
                    foreach ($detailDD as $j) {
                        if (
                            intval($j->emrdfk) == 1
                            || intval($j->emrdfk) == 2
                            || intval($j->emrdfk) == 3
                            || intval($j->emrdfk) == 4
                            || intval($j->emrdfk) == 5
                            || intval($j->emrdfk) == 6
                            || intval($j->emrdfk) == 7
                            || intval($j->emrdfk) == 8
                            || intval($j->emrdfk) == 10
                            || intval($j->emrdfk) == 11
                            || intval($j->emrdfk) == 12
                            || intval($j->emrdfk) == 13
                            || intval($j->emrdfk) == 14
                            || intval($j->emrdfk) == 16
                            || intval($j->emrdfk) == 17
                            || intval($j->emrdfk) == 18
                            || intval($j->emrdfk) == 24
                            || intval($j->emrdfk) == 25
                            || intval($j->emrdfk) == 26
                            || intval($j->emrdfk) == 27
                            || intval($j->emrdfk) == 28
                            || intval($j->emrdfk) == 51
                            || intval($j->emrdfk) == 52
                            || intval($j->emrdfk) == 31
                            || intval($j->emrdfk) == 40
                            || intval($j->emrdfk) == 42
                            || intval($j->emrdfk) == 44
                            || intval($j->emrdfk) == 45
                            || intval($j->emrdfk) == 46
                            || intval($j->emrdfk) == 47
                            || intval($j->emrdfk) == 49
                            || intval($j->emrdfk) == 50
                            || intval($j->emrdfk) == 51
                            || intval($j->emrdfk) == 52
                            || intval($j->emrdfk) == 53
                            || intval($j->emrdfk) == 55
                        ) {
                            if ($j->value == 1) {
                                $detailDDFix[$j->emrdfk] = true;
                            } else {
                                $detailDDFix[$j->emrdfk] = false;
                            }
                        } elseif (intval($j->emrdfk) == 39) {
                            if (strpos($j->value, '~') == true) {
                                $split = explode('~', $j->value);
                                $detailDDFix[$j->emrdfk] = $split[1];

                                $qrcode = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $split[1]);
                                $qr = $qrcode->writeDataUri();
                                if (!isset($detailDDFix[999])) {
                                    $detailDDFix[997] = $qr;
                                }
                            } else {
                                $detailDDFix[$j->emrdfk] = $j->value;
                                $qrcode = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $j->value);
                                $qr = $qrcode->writeDataUri();
                                $detailDDFix[997] = $qr;
                            }
                        } else {
                            if (strpos($j->value, '~') == true) {
                                $split = explode('~', $j->value);
                                $detailDDFix[$j->emrdfk] = $split[1];
                            } else {
                                $detailDDFix[$j->emrdfk] = $j->value;
                            }
                        }
                    }
                }
                $derajatDehidrasiFix = $detailDDFix;
            }
        }

        // --------------------EWS DEWASA--------------------
        $ewsDewasaFix = [];
        if ($xcetakewsdewasa == 1) {
            $noEmrEwsD = \DB::table('emrpasien_t as ep')
                ->join('pegawai_m as pg', 'pg.id', '=', 'ep.pegawaifk')
                ->select('ep.noemr', 'ep.emrfk')
                ->where('ep.noregistrasifk', $noregistrasi)
                ->where('ep.statusenabled', true)
                ->where('ep.emrfk', 876)
                ->OrderBy('ep.tglemr', 'desc')
                ->get();

            if (count($noEmrEwsD) > 0) {
                foreach ($noEmrEwsD as $i) {
                    $detailEwsD = \DB::table('emrpasiend_t as emrdp')
                        ->leftjoin('emrdpolri_t as emrd', 'emrd.id', '=', 'emrdp.emrdfk')
                        ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'emrdp.pegawaifk')
                        ->select('emrdp.*', 'emrd.caption', 'emrd.type', 'emrd.nourut', 'emrdp.emrfk', 'emrd.reportdisplay', 'emrd.kodeexternal as kodeex', 'emrd.satuan', 'pg.namalengkap')
                        ->where('emrdp.statusenabled', true)
                        ->where('emrdp.emrpasienfk', $i->noemr)
                        ->where('emrdp.emrfk', $i->emrfk)
                        ->whereExists(function ($query) use ($i) {
                            $query->select(DB::raw(1))
                                ->from('emrpasiend_t as emrdp_sub')
                                ->where('emrdp_sub.emrpasienfk', $i->noemr)
                                ->where('emrdp_sub.emrfk', $i->emrfk)
                                ->where('emrdp_sub.value', 'EWS DEWASA (BARU)');
                        })
                        ->orderBy('emrdp.emrdfk', 'asc')
                        ->get();

                    $emrdfkQrPegawai = [8136, 8137, 8138, 8139, 8140, 8141, 8142, 8143];
                    $detailEwsDFix = [];
                    if (count($detailEwsD) > 0) {
                        foreach ($detailEwsD as $j) {
                            if (
                                intval($j->emrdfk) == 7728 ||
                                intval($j->emrdfk) == 7729 ||
                                intval($j->emrdfk) == 7730 ||
                                intval($j->emrdfk) == 7731 ||
                                intval($j->emrdfk) == 7732 ||
                                intval($j->emrdfk) == 7733 ||
                                intval($j->emrdfk) == 7734 ||
                                intval($j->emrdfk) == 7735 ||
                                intval($j->emrdfk) == 7736 ||
                                intval($j->emrdfk) == 7737 ||
                                intval($j->emrdfk) == 7738 ||
                                intval($j->emrdfk) == 7739 ||
                                intval($j->emrdfk) == 7740 ||
                                intval($j->emrdfk) == 7741 ||
                                intval($j->emrdfk) == 7742 ||
                                intval($j->emrdfk) == 7743 ||
                                intval($j->emrdfk) == 7744 ||
                                intval($j->emrdfk) == 7745 ||
                                intval($j->emrdfk) == 7746 ||
                                intval($j->emrdfk) == 7747 ||
                                intval($j->emrdfk) == 7748 ||
                                intval($j->emrdfk) == 7749 ||
                                intval($j->emrdfk) == 7750 ||
                                intval($j->emrdfk) == 7751 ||
                                intval($j->emrdfk) == 7760 ||
                                intval($j->emrdfk) == 7761 ||
                                intval($j->emrdfk) == 7762 ||
                                intval($j->emrdfk) == 7763 ||
                                intval($j->emrdfk) == 7764 ||
                                intval($j->emrdfk) == 7765 ||
                                intval($j->emrdfk) == 7766 ||
                                intval($j->emrdfk) == 7767 ||
                                intval($j->emrdfk) == 7768 ||
                                intval($j->emrdfk) == 7769 ||
                                intval($j->emrdfk) == 7770 ||
                                intval($j->emrdfk) == 7771 ||
                                intval($j->emrdfk) == 7772 ||
                                intval($j->emrdfk) == 7773 ||
                                intval($j->emrdfk) == 7774 ||
                                intval($j->emrdfk) == 7775 ||
                                intval($j->emrdfk) == 7776 ||
                                intval($j->emrdfk) == 7777 ||
                                intval($j->emrdfk) == 7778 ||
                                intval($j->emrdfk) == 7779 ||
                                intval($j->emrdfk) == 7780 ||
                                intval($j->emrdfk) == 7781 ||
                                intval($j->emrdfk) == 7782 ||
                                intval($j->emrdfk) == 7783 ||
                                intval($j->emrdfk) == 7784 ||
                                intval($j->emrdfk) == 7785 ||
                                intval($j->emrdfk) == 7786 ||
                                intval($j->emrdfk) == 7787 ||
                                intval($j->emrdfk) == 7788 ||
                                intval($j->emrdfk) == 7789 ||
                                intval($j->emrdfk) == 7790 ||
                                intval($j->emrdfk) == 7791 ||
                                intval($j->emrdfk) == 7792 ||
                                intval($j->emrdfk) == 7793 ||
                                intval($j->emrdfk) == 7794 ||
                                intval($j->emrdfk) == 7795 ||
                                intval($j->emrdfk) == 7796 ||
                                intval($j->emrdfk) == 7797 ||
                                intval($j->emrdfk) == 7798 ||
                                intval($j->emrdfk) == 7799 ||
                                intval($j->emrdfk) == 7800 ||
                                intval($j->emrdfk) == 7801 ||
                                intval($j->emrdfk) == 7802 ||
                                intval($j->emrdfk) == 7803 ||
                                intval($j->emrdfk) == 7804 ||
                                intval($j->emrdfk) == 7805 ||
                                intval($j->emrdfk) == 7806 ||
                                intval($j->emrdfk) == 7807 ||
                                intval($j->emrdfk) == 7808 ||
                                intval($j->emrdfk) == 7809 ||
                                intval($j->emrdfk) == 7810 ||
                                intval($j->emrdfk) == 7811 ||
                                intval($j->emrdfk) == 7812 ||
                                intval($j->emrdfk) == 7813 ||
                                intval($j->emrdfk) == 7814 ||
                                intval($j->emrdfk) == 7815 ||
                                intval($j->emrdfk) == 7816 ||
                                intval($j->emrdfk) == 7817 ||
                                intval($j->emrdfk) == 7818 ||
                                intval($j->emrdfk) == 7819 ||
                                intval($j->emrdfk) == 7820 ||
                                intval($j->emrdfk) == 7821 ||
                                intval($j->emrdfk) == 7822 ||
                                intval($j->emrdfk) == 7823 ||
                                intval($j->emrdfk) == 7824 ||
                                intval($j->emrdfk) == 7825 ||
                                intval($j->emrdfk) == 7826 ||
                                intval($j->emrdfk) == 7827 ||
                                intval($j->emrdfk) == 7828 ||
                                intval($j->emrdfk) == 7829 ||
                                intval($j->emrdfk) == 7830 ||
                                intval($j->emrdfk) == 7831 ||
                                intval($j->emrdfk) == 7832 ||
                                intval($j->emrdfk) == 7833 ||
                                intval($j->emrdfk) == 7834 ||
                                intval($j->emrdfk) == 7835 ||
                                intval($j->emrdfk) == 7836 ||
                                intval($j->emrdfk) == 7837 ||
                                intval($j->emrdfk) == 7838 ||
                                intval($j->emrdfk) == 7839 ||
                                intval($j->emrdfk) == 7840 ||
                                intval($j->emrdfk) == 7841 ||
                                intval($j->emrdfk) == 7842 ||
                                intval($j->emrdfk) == 7843 ||
                                intval($j->emrdfk) == 7844 ||
                                intval($j->emrdfk) == 7845 ||
                                intval($j->emrdfk) == 7846 ||
                                intval($j->emrdfk) == 7847 ||
                                intval($j->emrdfk) == 7848 ||
                                intval($j->emrdfk) == 7849 ||
                                intval($j->emrdfk) == 7850 ||
                                intval($j->emrdfk) == 7851 ||
                                intval($j->emrdfk) == 7852 ||
                                intval($j->emrdfk) == 7853 ||
                                intval($j->emrdfk) == 7854 ||
                                intval($j->emrdfk) == 7855 ||
                                intval($j->emrdfk) == 7856 ||
                                intval($j->emrdfk) == 7857 ||
                                intval($j->emrdfk) == 7858 ||
                                intval($j->emrdfk) == 7859 ||
                                intval($j->emrdfk) == 7860 ||
                                intval($j->emrdfk) == 7861 ||
                                intval($j->emrdfk) == 7862 ||
                                intval($j->emrdfk) == 7863 ||
                                intval($j->emrdfk) == 7864 ||
                                intval($j->emrdfk) == 7865 ||
                                intval($j->emrdfk) == 7866 ||
                                intval($j->emrdfk) == 7867 ||
                                intval($j->emrdfk) == 7868 ||
                                intval($j->emrdfk) == 7869 ||
                                intval($j->emrdfk) == 7870 ||
                                intval($j->emrdfk) == 7871 ||
                                intval($j->emrdfk) == 7872 ||
                                intval($j->emrdfk) == 7873 ||
                                intval($j->emrdfk) == 7874 ||
                                intval($j->emrdfk) == 7875 ||
                                intval($j->emrdfk) == 7876 ||
                                intval($j->emrdfk) == 7877 ||
                                intval($j->emrdfk) == 7878 ||
                                intval($j->emrdfk) == 7879 ||
                                intval($j->emrdfk) == 7880 ||
                                intval($j->emrdfk) == 7881 ||
                                intval($j->emrdfk) == 7882 ||
                                intval($j->emrdfk) == 7883 ||
                                intval($j->emrdfk) == 7884 ||
                                intval($j->emrdfk) == 7885 ||
                                intval($j->emrdfk) == 7886 ||
                                intval($j->emrdfk) == 7887 ||
                                intval($j->emrdfk) == 7888 ||
                                intval($j->emrdfk) == 7889 ||
                                intval($j->emrdfk) == 7890 ||
                                intval($j->emrdfk) == 7891 ||
                                intval($j->emrdfk) == 7892 ||
                                intval($j->emrdfk) == 7893 ||
                                intval($j->emrdfk) == 7894 ||
                                intval($j->emrdfk) == 7895 ||
                                intval($j->emrdfk) == 7896 ||
                                intval($j->emrdfk) == 7897 ||
                                intval($j->emrdfk) == 7898 ||
                                intval($j->emrdfk) == 7899 ||
                                intval($j->emrdfk) == 7900 ||
                                intval($j->emrdfk) == 7901 ||
                                intval($j->emrdfk) == 7902 ||
                                intval($j->emrdfk) == 7903 ||
                                intval($j->emrdfk) == 7904 ||
                                intval($j->emrdfk) == 7905 ||
                                intval($j->emrdfk) == 7906 ||
                                intval($j->emrdfk) == 7907 ||
                                intval($j->emrdfk) == 7908 ||
                                intval($j->emrdfk) == 7909 ||
                                intval($j->emrdfk) == 7910 ||
                                intval($j->emrdfk) == 7911 ||
                                intval($j->emrdfk) == 7912 ||
                                intval($j->emrdfk) == 7913 ||
                                intval($j->emrdfk) == 7914 ||
                                intval($j->emrdfk) == 7915 ||
                                intval($j->emrdfk) == 7916 ||
                                intval($j->emrdfk) == 7917 ||
                                intval($j->emrdfk) == 7918 ||
                                intval($j->emrdfk) == 7919 ||
                                intval($j->emrdfk) == 7920 ||
                                intval($j->emrdfk) == 7921 ||
                                intval($j->emrdfk) == 7922 ||
                                intval($j->emrdfk) == 7923 ||
                                intval($j->emrdfk) == 7924 ||
                                intval($j->emrdfk) == 7925 ||
                                intval($j->emrdfk) == 7926 ||
                                intval($j->emrdfk) == 7927 ||
                                intval($j->emrdfk) == 7928 ||
                                intval($j->emrdfk) == 7929 ||
                                intval($j->emrdfk) == 7930 ||
                                intval($j->emrdfk) == 7931 ||
                                intval($j->emrdfk) == 7932 ||
                                intval($j->emrdfk) == 7933 ||
                                intval($j->emrdfk) == 7934 ||
                                intval($j->emrdfk) == 7935 ||
                                intval($j->emrdfk) == 7936 ||
                                intval($j->emrdfk) == 7937 ||
                                intval($j->emrdfk) == 7938 ||
                                intval($j->emrdfk) == 7939 ||
                                intval($j->emrdfk) == 7940 ||
                                intval($j->emrdfk) == 7941 ||
                                intval($j->emrdfk) == 7942 ||
                                intval($j->emrdfk) == 7943 ||
                                intval($j->emrdfk) == 7944 ||
                                intval($j->emrdfk) == 7945 ||
                                intval($j->emrdfk) == 7946 ||
                                intval($j->emrdfk) == 7947 ||
                                intval($j->emrdfk) == 7948 ||
                                intval($j->emrdfk) == 7949 ||
                                intval($j->emrdfk) == 7950 ||
                                intval($j->emrdfk) == 7951 ||
                                intval($j->emrdfk) == 7952 ||
                                intval($j->emrdfk) == 7953 ||
                                intval($j->emrdfk) == 7954 ||
                                intval($j->emrdfk) == 7955 ||
                                intval($j->emrdfk) == 7956 ||
                                intval($j->emrdfk) == 7957 ||
                                intval($j->emrdfk) == 7958 ||
                                intval($j->emrdfk) == 7959 ||
                                intval($j->emrdfk) == 7960 ||
                                intval($j->emrdfk) == 7961 ||
                                intval($j->emrdfk) == 7962 ||
                                intval($j->emrdfk) == 7963 ||
                                intval($j->emrdfk) == 7964 ||
                                intval($j->emrdfk) == 7965 ||
                                intval($j->emrdfk) == 7966 ||
                                intval($j->emrdfk) == 7967 ||
                                intval($j->emrdfk) == 7968 ||
                                intval($j->emrdfk) == 7969 ||
                                intval($j->emrdfk) == 7970 ||
                                intval($j->emrdfk) == 7971 ||
                                intval($j->emrdfk) == 7972 ||
                                intval($j->emrdfk) == 7973 ||
                                intval($j->emrdfk) == 7974 ||
                                intval($j->emrdfk) == 7975 ||
                                intval($j->emrdfk) == 7976 ||
                                intval($j->emrdfk) == 7977 ||
                                intval($j->emrdfk) == 7978 ||
                                intval($j->emrdfk) == 7979 ||
                                intval($j->emrdfk) == 7980 ||
                                intval($j->emrdfk) == 7981 ||
                                intval($j->emrdfk) == 7982 ||
                                intval($j->emrdfk) == 7983 ||
                                intval($j->emrdfk) == 7984 ||
                                intval($j->emrdfk) == 7985 ||
                                intval($j->emrdfk) == 7986 ||
                                intval($j->emrdfk) == 7987 ||
                                intval($j->emrdfk) == 7988 ||
                                intval($j->emrdfk) == 7989 ||
                                intval($j->emrdfk) == 7990 ||
                                intval($j->emrdfk) == 7991 ||
                                intval($j->emrdfk) == 7992 ||
                                intval($j->emrdfk) == 7993 ||
                                intval($j->emrdfk) == 7994 ||
                                intval($j->emrdfk) == 7995 ||
                                intval($j->emrdfk) == 7996 ||
                                intval($j->emrdfk) == 7997 ||
                                intval($j->emrdfk) == 7998 ||
                                intval($j->emrdfk) == 7999 ||
                                intval($j->emrdfk) == 8000 ||
                                intval($j->emrdfk) == 8001 ||
                                intval($j->emrdfk) == 8002 ||
                                intval($j->emrdfk) == 8003 ||
                                intval($j->emrdfk) == 8004 ||
                                intval($j->emrdfk) == 8005 ||
                                intval($j->emrdfk) == 8006 ||
                                intval($j->emrdfk) == 8007 ||
                                intval($j->emrdfk) == 8008 ||
                                intval($j->emrdfk) == 8009 ||
                                intval($j->emrdfk) == 8010 ||
                                intval($j->emrdfk) == 8011 ||
                                intval($j->emrdfk) == 8012 ||
                                intval($j->emrdfk) == 8013 ||
                                intval($j->emrdfk) == 8014 ||
                                intval($j->emrdfk) == 8015 ||
                                intval($j->emrdfk) == 8016 ||
                                intval($j->emrdfk) == 8017 ||
                                intval($j->emrdfk) == 8018 ||
                                intval($j->emrdfk) == 8019 ||
                                intval($j->emrdfk) == 8020 ||
                                intval($j->emrdfk) == 8021 ||
                                intval($j->emrdfk) == 8022 ||
                                intval($j->emrdfk) == 8023 ||
                                intval($j->emrdfk) == 8024 ||
                                intval($j->emrdfk) == 8025 ||
                                intval($j->emrdfk) == 8026 ||
                                intval($j->emrdfk) == 8027 ||
                                intval($j->emrdfk) == 8028 ||
                                intval($j->emrdfk) == 8029 ||
                                intval($j->emrdfk) == 8030 ||
                                intval($j->emrdfk) == 8031 ||
                                intval($j->emrdfk) == 8032 ||
                                intval($j->emrdfk) == 8033 ||
                                intval($j->emrdfk) == 8034 ||
                                intval($j->emrdfk) == 8035 ||
                                intval($j->emrdfk) == 8036 ||
                                intval($j->emrdfk) == 8037 ||
                                intval($j->emrdfk) == 8038 ||
                                intval($j->emrdfk) == 8039 ||
                                intval($j->emrdfk) == 8040 ||
                                intval($j->emrdfk) == 8041 ||
                                intval($j->emrdfk) == 8042 ||
                                intval($j->emrdfk) == 8043 ||
                                intval($j->emrdfk) == 8044 ||
                                intval($j->emrdfk) == 8045 ||
                                intval($j->emrdfk) == 8046 ||
                                intval($j->emrdfk) == 8047 ||
                                intval($j->emrdfk) == 8048 ||
                                intval($j->emrdfk) == 8049 ||
                                intval($j->emrdfk) == 8050 ||
                                intval($j->emrdfk) == 8051 ||
                                intval($j->emrdfk) == 8052 ||
                                intval($j->emrdfk) == 8053 ||
                                intval($j->emrdfk) == 8054 ||
                                intval($j->emrdfk) == 8055 ||
                                intval($j->emrdfk) == 8056 ||
                                intval($j->emrdfk) == 8057 ||
                                intval($j->emrdfk) == 8058 ||
                                intval($j->emrdfk) == 8059 ||
                                intval($j->emrdfk) == 8060 ||
                                intval($j->emrdfk) == 8061 ||
                                intval($j->emrdfk) == 8062 ||
                                intval($j->emrdfk) == 8063 ||
                                intval($j->emrdfk) == 8064 ||
                                intval($j->emrdfk) == 8065 ||
                                intval($j->emrdfk) == 8066 ||
                                intval($j->emrdfk) == 8067 ||
                                intval($j->emrdfk) == 8068 ||
                                intval($j->emrdfk) == 8069 ||
                                intval($j->emrdfk) == 8070 ||
                                intval($j->emrdfk) == 8071 ||
                                intval($j->emrdfk) == 8072 ||
                                intval($j->emrdfk) == 8073 ||
                                intval($j->emrdfk) == 8074 ||
                                intval($j->emrdfk) == 8075 ||
                                intval($j->emrdfk) == 8076 ||
                                intval($j->emrdfk) == 8077 ||
                                intval($j->emrdfk) == 8078 ||
                                intval($j->emrdfk) == 8079 ||
                                intval($j->emrdfk) == 8080 ||
                                intval($j->emrdfk) == 8081 ||
                                intval($j->emrdfk) == 8082 ||
                                intval($j->emrdfk) == 8083 ||
                                intval($j->emrdfk) == 8084 ||
                                intval($j->emrdfk) == 8085 ||
                                intval($j->emrdfk) == 8086 ||
                                intval($j->emrdfk) == 8087 ||
                                intval($j->emrdfk) == 8088 ||
                                intval($j->emrdfk) == 8089 ||
                                intval($j->emrdfk) == 8090 ||
                                intval($j->emrdfk) == 8091 ||
                                intval($j->emrdfk) == 8092 ||
                                intval($j->emrdfk) == 8093 ||
                                intval($j->emrdfk) == 8094 ||
                                intval($j->emrdfk) == 8095 ||
                                intval($j->emrdfk) == 8145 ||
                                intval($j->emrdfk) == 8146 ||
                                intval($j->emrdfk) == 8147 ||
                                intval($j->emrdfk) == 8148 ||
                                intval($j->emrdfk) == 8149 ||
                                intval($j->emrdfk) == 8150 ||
                                intval($j->emrdfk) == 8151 ||
                                intval($j->emrdfk) == 8152 ||
                                intval($j->emrdfk) == 8153 ||
                                intval($j->emrdfk) == 8154 ||
                                intval($j->emrdfk) == 8155 ||
                                intval($j->emrdfk) == 8156 ||
                                intval($j->emrdfk) == 8157 ||
                                intval($j->emrdfk) == 8158 ||
                                intval($j->emrdfk) == 8159 ||
                                intval($j->emrdfk) == 8160 ||
                                intval($j->emrdfk) == 8161 ||
                                intval($j->emrdfk) == 8162 ||
                                intval($j->emrdfk) == 8163 ||
                                intval($j->emrdfk) == 8164 ||
                                intval($j->emrdfk) == 8165 ||
                                intval($j->emrdfk) == 8166 ||
                                intval($j->emrdfk) == 8167 ||
                                intval($j->emrdfk) == 8168 ||
                                intval($j->emrdfk) == 8169 ||
                                intval($j->emrdfk) == 8170 ||
                                intval($j->emrdfk) == 8171 ||
                                intval($j->emrdfk) == 8172 ||
                                intval($j->emrdfk) == 8173 ||
                                intval($j->emrdfk) == 8174 ||
                                intval($j->emrdfk) == 8175 ||
                                intval($j->emrdfk) == 8176 ||
                                intval($j->emrdfk) == 8177 ||
                                intval($j->emrdfk) == 8178 ||
                                intval($j->emrdfk) == 8179 ||
                                intval($j->emrdfk) == 8180 ||
                                intval($j->emrdfk) == 8181 ||
                                intval($j->emrdfk) == 8182 ||
                                intval($j->emrdfk) == 8183 ||
                                intval($j->emrdfk) == 8184 ||
                                intval($j->emrdfk) == 8185 ||
                                intval($j->emrdfk) == 8186 ||
                                intval($j->emrdfk) == 8187 ||
                                intval($j->emrdfk) == 8188 ||
                                intval($j->emrdfk) == 8189 ||
                                intval($j->emrdfk) == 8190 ||
                                intval($j->emrdfk) == 8191 ||
                                intval($j->emrdfk) == 8192
                            ) {
                                if ($j->value == 1) {
                                    $detailEwsDFix[$j->emrdfk] = true;
                                } else {
                                    $detailEwsDFix[$j->emrdfk] = false;
                                }
                            } elseif (in_array(intval($j->emrdfk), $emrdfkQrPegawai)) {
                                $detailEwsDFix[$j->emrdfk] = $j->value;

                                $qrcode = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $j->value);
                                $qr = $qrcode->writeDataUri();

                                $detailEwsDFix[intval($j->emrdfk) * 10 + 9] = $qr;
                            } else {
                                if (strpos($j->value, '~') == true) {
                                    $split = explode('~', $j->value);
                                    $detailEwsDFix[$j->emrdfk] = $split[1];
                                } else {
                                    $detailEwsDFix[$j->emrdfk] = $j->value;
                                }
                            }
                        }
                    }
                    $i->details = $detailEwsDFix;
                }
                $ewsDewasaFix = $noEmrEwsD;
            }
        }

        // --------------------LEMBAR PENDAMPINGAN REHABILITASI MEDIK--------------------
        $pendampingRehabFix = [];
        if ($xcetakpendampinganrehab == 1) {
            $noEmrPR = \DB::table('emrpasien_t as ep')
                ->join('pegawai_m as pg', 'pg.id', '=', 'ep.pegawaifk')
                ->select('ep.noemr', 'ep.emrfk')
                ->where('ep.noregistrasifk', $noregistrasi)
                ->where('ep.statusenabled', true)
                ->where('ep.emrfk', 2030)
                ->OrderBy('ep.tglemr', 'desc')
                ->first();

            if ($noEmrPR) {
                $detailPR = \DB::table('emrpasiend_t as emrdp')
                    ->leftjoin('emrd_t as emrd', 'emrd.id', '=', 'emrdp.emrdfk')
                    ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'emrdp.pegawaifk')
                    ->select('emrdp.*', 'emrd.caption', 'emrd.type', 'emrd.nourut', 'emrdp.emrfk', 'emrd.reportdisplay', 'emrd.kodeexternal as kodeex', 'emrd.satuan', 'pg.namalengkap')
                    ->where('emrdp.statusenabled', true)
                    ->where('emrdp.emrpasienfk', $noEmrPR->noemr)
                    ->where('emrdp.emrfk', $noEmrPR->emrfk)
                    ->orderBy('emrdp.emrdfk', 'asc')
                    ->get();

                $emrdfkQrPegawai = [3555, 3556];
                $detailPRFix = [];
                if (count($detailPR) > 0) {
                    foreach ($detailPR as $j) {
                        if (
                            intval($j->emrdfk) == 1901300140
                            || intval($j->emrdfk) == 1901300141
                        ) {
                            if ($j->value == 1) {
                                $detailPRFix[$j->emrdfk] = true;
                            } else {
                                $detailPRFix[$j->emrdfk] = false;
                            }
                        } elseif (in_array(intval($j->emrdfk), $emrdfkQrPegawai)) {
                            $split = explode('~', $j->value);
                            $detailPRFix[$j->emrdfk] = $split[1];

                            $qrcode = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $split[1]);
                            $qr = $qrcode->writeDataUri();

                            $detailPRFix[intval($j->emrdfk) * 10 + 9] = $qr;
                        } else {
                            if (strpos($j->value, '~') == true) {
                                $split = explode('~', $j->value);
                                $detailPRFix[$j->emrdfk] = $split[1];
                            } else {
                                $detailPRFix[$j->emrdfk] = $j->value;
                            }
                        }
                    }
                }
                $pendampingRehabFix = $detailPRFix;
            }
        }

        // --------------------PENGKAJIAN AWAL MEDIS RI--------------------
        $pengkajianAwalMedisRIFix = [];
        if ($xcetakpengkajianawalmedisri == 1) {
            $noEmrPAMRI = \DB::table('emrpasien_t as ep')
                ->join('pegawai_m as pg', 'pg.id', '=', 'ep.pegawaifk')
                ->select('ep.noemr', 'ep.emrfk')
                ->where('ep.noregistrasifk', $noregistrasi)
                ->where('ep.statusenabled', true)
                ->where('ep.emrfk', 2029)
                ->OrderBy('ep.tglemr', 'desc')
                ->first();

            if ($noEmrPAMRI) {
                $detailPAMRI = \DB::table('emrpasiend_t as emrdp')
                    ->leftjoin('emrd_t as emrd', 'emrd.id', '=', 'emrdp.emrdfk')
                    ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'emrdp.pegawaifk')
                    ->select('emrdp.*', 'emrd.caption', 'emrd.type', 'emrd.nourut', 'emrdp.emrfk', 'emrd.reportdisplay', 'emrd.kodeexternal as kodeex', 'emrd.satuan', 'pg.namalengkap')
                    ->where('emrdp.statusenabled', true)
                    ->where('emrdp.emrpasienfk', $noEmrPAMRI->noemr)
                    ->where('emrdp.emrfk', $noEmrPAMRI->emrfk)
                    ->orderBy('emrdp.emrdfk', 'asc')
                    ->get();

                $emrdfkQrPegawai = [1257];
                $detailPAMRIFix = [];
                if (count($detailPAMRI) > 0) {
                    foreach ($detailPAMRI as $j) {
                        if (
                            intval($j->emrdfk) == 1901300140
                            || intval($j->emrdfk) == 1901300141
                        ) {
                            if ($j->value == 1) {
                                $detailPAMRIFix[$j->emrdfk] = true;
                            } else {
                                $detailPAMRIFix[$j->emrdfk] = false;
                            }
                        } elseif (in_array(intval($j->emrdfk), $emrdfkQrPegawai)) {
                            $split = explode('~', $j->value);
                            $detailPAMRIFix[$j->emrdfk] = $split[1];

                            $qrcode = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $split[1]);
                            $qr = $qrcode->writeDataUri();

                            $detailPAMRIFix[intval($j->emrdfk) * 10 + 9] = $qr;
                        } else {
                            if (strpos($j->value, '~') == true) {
                                $split = explode('~', $j->value);
                                $detailPAMRIFix[$j->emrdfk] = $split[1];
                            } else {
                                $detailPAMRIFix[$j->emrdfk] = $j->value;
                            }
                        }
                    }
                }
                $pengkajianAwalMedisRIFix = $detailPAMRIFix;
            }
        }

        // --------------------PENGKAJIAN AWAL MEDIS GIZI--------------------
        $pengkajianAwalMedisGiziFix = [];
        if ($xcetakpengkajianawalmedisgizi == 1) {
            $noEmrPAMRI = \DB::table('emrpasien_t as ep')
                ->join('pegawai_m as pg', 'pg.id', '=', 'ep.pegawaifk')
                ->select('ep.noemr', 'ep.emrfk')
                ->where('ep.noregistrasifk', $noregistrasi)
                ->where('ep.statusenabled', true)
                ->where('ep.emrfk', 890)
                ->OrderBy('ep.tglemr', 'desc')
                ->first();

            if ($noEmrPAMRI) {
                $detailPAMRI = \DB::table('emrpasiend_t as emrdp')
                    ->leftjoin('emrd_t as emrd', 'emrd.id', '=', 'emrdp.emrdfk')
                    ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'emrdp.pegawaifk')
                    ->select('emrdp.*', 'emrd.caption', 'emrd.type', 'emrd.nourut', 'emrdp.emrfk', 'emrd.reportdisplay', 'emrd.kodeexternal as kodeex', 'emrd.satuan', 'pg.namalengkap')
                    ->where('emrdp.statusenabled', true)
                    ->where('emrdp.emrpasienfk', $noEmrPAMRI->noemr)
                    ->where('emrdp.emrfk', $noEmrPAMRI->emrfk)
                    ->orderBy('emrdp.emrdfk', 'asc')
                    ->get();

                $emrdfkQrPegawai = [1501];
                $detailPAMRIFix = [];
                if (count($detailPAMRI) > 0) {
                    foreach ($detailPAMRI as $j) {
                        if (
                            intval($j->emrdfk) == 1901300140
                            || intval($j->emrdfk) == 1901300141
                        ) {
                            if ($j->value == 1) {
                                $detailPAMRIFix[$j->emrdfk] = true;
                            } else {
                                $detailPAMRIFix[$j->emrdfk] = false;
                            }
                        } elseif (in_array(intval($j->emrdfk), $emrdfkQrPegawai)) {
                            $split = explode('~', $j->value);
                            $detailPAMRIFix[$j->emrdfk] = $split[0];
                            $qrcode = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $split[0]);
                            $qr = $qrcode->writeDataUri();

                            $detailPAMRIFix[intval($j->emrdfk) * 10 + 9] = $qr;
                        } else {
                            if (strpos($j->value, '~') == true) {
                                $split = explode('~', $j->value);
                                $detailPAMRIFix[$j->emrdfk] = $split[1];
                            } else {
                                $detailPAMRIFix[$j->emrdfk] = $j->value;
                            }
                        }
                    }
                }
                $pengkajianAwalMedisGiziFix = $detailPAMRIFix;
            }
        }

        //----------------------------------------------------------------

        // --------------------KONSULTASI--------------------
        $KonsultasiFix = [];
        if ($xcetakkonsul == 1) {
            $data = DB::table('strukorder_t as so')
                ->join('pegawai_m as pg', 'pg.id', '=', 'so.objectpegawaiorderfk')
                ->join('pegawai_m as pg2', 'pg2.id', '=', 'so.objectpetugasfk')
                ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'so.noregistrasifk')
                ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                ->select([
                    'pg.namalengkap as ppatujuan',
                    'so.keteranganorder',
                    'so.tglorder',
                    'so.tgljawab',
                    'pg2.namalengkap as pengonsul',
                    'so.keteranganlainnya as jawabankonsul',
                    'ps.nocm',
                    'ps.namapasien',
                    'ps.tgllahir',
                    'ps.noidentitas as nik',
                ])
                ->where('pd.noregistrasi', $noregistrasi)
                ->where('so.statusenabled', true)
                ->first();

            if ($data) {
                $qrDokterKons = new QrCode(
                    "http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $data->pengonsul
                );
                $qrDokterKons2 = $qrDokterKons->writeDataUri();

                $qrDokterJaw = new QrCode(
                    "http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $data->ppatujuan
                );
                $qrDokterJaw2 = $qrDokterJaw->writeDataUri();

                $KonsultasiFix[] = [ // dijadikan array biar count() aman
                    'ppatujuan'      => $data->ppatujuan,
                    'keteranganorder' => $data->keteranganorder,
                    'tglorder'       => $data->tglorder,
                    'tgljawab'       => $data->tgljawab,
                    'pengonsul'      => $data->pengonsul,
                    'jawabankonsul'  => $data->jawabankonsul,
                    'nocm'           => $data->nocm,
                    'namapasien'     => $data->namapasien,
                    'tgllahir'       => $data->tgllahir,
                    'nik'            => $data->nik,
                    'qrDokterKons2'  => $qrDokterKons2,
                    'qrDokterJaw2'   => $qrDokterJaw2,
                ];
            }
        }

        //----------------------------------------------------------------
        $dataReport = array(
            'namaprofile' => "RS Bhayangkara TK.IV CIANJUR",
            'alamat' => "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211",
            'datakemenkes' => $dataPasienKemenkes,
            'dataicd10' => $dataIcd10Pasien,
            'dataicd9' => $dataIcd9Pasien,
            'icd10primer' => $icd10primary,
            'icd10primer_inacbg' => $icd10primary_inacbg,
            'icd10sekunder_inacbg' => $icd10secondary_inacbg,
            'icd9_inacbg' => $icd9_inacbg,
            'icd10sekunder' => $icd10secondary,
            'datasep' => $sep,
            'validSep' => $validSep,
            'tglSep' => $responseSEP['response']['tglSep'] ?? null,
            'qrsep' => $qrCodePSep2,
            'namaprofile' => "RS Bhayangkara TK.IV CIANJUR",
            'nocm' => $dataPasien[0]->nocm,
            'umurrad' => $umurrad,
            'idorder' => $idorder,
            'umur' => $umurpasien,
            'nokepesertaan' => $nokepesertaan,
            'nosep' => $nosep,
            'dokterpj' => $rincianbillingnamadokter,
            'nosepaaa' => $tampungnosep,
            'ruanganasal' => $ruanganasal,
            'namalengkap' => $namalengkap,
            'tanggal' => $tanggal,
            'tanggalcetak' => $tanggalcetak,
            'namaproduk' => $namaproduk,
            'keterangan' => $keterangan,
            'dokterrad' => $dokterrad,
            // 'nippns' =>    $nippns,
            'ekspertise' => $ekspertise,
            'hasillab' => $hasillab,
            'groupedHasillab' => $groupedHasillab,
            'qrvalidatorlab' => $qrvalidatorlab,
            'hasillabgdt' => $hasillabgdt,
            'qrvalidatorlabgdt' => $qrvalidatorlabgdt,
            'tindakanlab' => $tindakanlab,
            'tindakanrad' => $tindakanrad,
            'penunjanglab' => $penunjanglab,
            'penunjangrad' => $penunjangrad,
            'obatResume' => $obatResume,
            'obatpulang' => $obatPulang,
            'adaresume' => $adaresume,
            'objectdepartemenfk' => $dataPasien[0]->objectdepartemenfk,
            'tempatlahir' => $dataPasien[0]->tempatlahir,
            'nocm' => $dataPasien[0]->nocm,
            'tgllahir' => $dataPasien[0]->tgllahir,
            'namapasienjk' => $dataPasien[0]->namapasien,
            'jeniskelamin' => $dataPasien[0]->jeniskelamin,
            'noidentitas' => $dataPasien[0]->noidentitas,
            'kelompokpasien' => $dataPasien[0]->kelompokpasien,
            // 'tipepasien' => $dataReport2[0]->tipepasien,
            'notelepon' => $dataPasien[0]->notelepon,
            'namaruanganresume' => $namaruanganresume,
            'tglkeluarresume' => $tglkeluarresume,
            'tglmasukresume' => $tglmasukresume,
            'keluhanutamaRM' => $keluhanutamaRM,
            'diagdok' => $diagdok,
            'diagsek' => $diagsek,
            'ringkasanriwayatpenyakit' => $ringkasanriwayatpenyakit,
            'keteranganresume' => $keteranganresume,
            'alergiresume' => $alergiresume,
            'kesadaranresume' => $kesadaranresume,
            'indikasirawatinap' => $indikasirawatinap,
            'keadaanumumresume' => $keadaanumumresume,
            'pfnadi' => $pfnadi,
            'pfspo' => $pfspo,
            'pfbb' => $pfbb,
            'pftb' => $pftb,
            'pfe' => $pfe,
            'pfm' => $pfm,
            'pfv' => $pfv,
            'tindakanrm' => $tindakanrm,
            'isreaksiobat' => $isreaksiobat,
            'listreaksiobat' => $listReaksiObat,
            'kondisiwaktukeluar' => $kondisiwaktukeluar,
            'carapulang' => $carapulang,
            'ku' => $ku,
            'kesadaranpulang' => $kesadaranpulang,
            'tekanandarah' => $tekanandarahpulang,
            'suhupulang' => $suhupulang,
            'pernafasanpulang' => $pernafasanpulang,
            'nadipulang' => $nadipulang,
            'msp' => $msp,
            'ab' => $ab,
            'akyt' => $akyt,
            'perawatandirumah' => $perawatandirumah,
            'perawatandirumahlanjut' => $perawatandirumahlanjut,
            'ppp' => $ppp,
            'kebutuhanedukasi' => $kebutuhanedukasi,
            'denyutjantung' => $denyutjantung,
            'pernapasanresume' => $pernapasanresume,
            'temuanpenting' => $temuanpenting,
            'hasilkonsultasi' => $hasilkonsultasi,
            'systole' => $systole,
            'diastole' => $diastole,
            'suhuresume' => $suhuresume,
            'pemeriksaanfisik' => $pemeriksaanfisik,
            'tindakanlab' => $tindakanlab,
            'tindakanrad' => $tindakanrad,
            'penunjanglab' => $penunjanglab,
            'penunjangrad' => $penunjangrad,
            'alasanrawat' => $alasanrawat,
            'konsultasi' => $konsultasi,
            'diagnosautama' => $diagnosautama,
            'diagnosaawal' => $diagnosaawal,
            'diagnosasekunder' => $diagnosasekunder,
            'diagnosatindakan' => $diagnosatindakan,
            'diet' => $diet,
            'keterangandiet' => $keterangandiet,
            'edukasi' => $edukasi,
            'prognosis' => $prognosis,
            'rencanatindaklanjut' => $rencanatindaklanjut,
            'kontrol' => $kontrol,
            'tglkontrolpoli' => $tglkontrolpoli,
            'keadaandarurat2' => $keadaandarurat2,
            'sarantransportasi' => $sarantransportasi,
            'kondisimeninggalkan' => $kondisimeninggalkan,
            'qrdpjpresume' => $qrdpjpresume,
            'namapasienrm' => $namapasienrm,
            'qrpasienrm' => $qrpasienrm,
            'pasienkeluarga' => $pasienkeluarga,
            'namadokter' => $namadokter,
            'datarincianbilling' => $rincianbilling,
            'datarincianproduk' => $rincianproduk,
            'namarekanan' => $dataPasien[0]->namarekanan,
            'kelasfaktur' => $kelasfaktur,
            'namapasienjk' => $dataPasien[0]->namapasien,
            'tglpulang' => $dataPasien[0]->tglpulang,
            'namakamar' => $kamar,
            'nobed' => $nobed,
            'tglregistrasi' => $dataPasien[0]->tglregistrasi,
            'lastruangan' => $rincianbillingnamaruangan,
            'noregistrasi' => $dataPasien[0]->noregistrasi,
            'alamatlengkap' => $dataPasien[0]->alamatlengkap,
            'kesatuanpasien' => $dataPasien[0]->kesatuanpasien,
            'lastharusbayar' => $this->getLaststruk($rincianbilling[0]->norec_pd),
            'cppt' => $cppt,
            'transfusiDarahFix' => $transfusiDarahFix,
            'triaseFetomaternalFix' => $triaseFetomaternalFix,
            'codeBlueFix' => $codeBlueFix,
            'derajatDehidrasiFix' => $derajatDehidrasiFix,
            'ewsDewasaFix' => $ewsDewasaFix,
            'pendampingRehabFix' => $pendampingRehabFix,
            'pengkajianAwalMedisRIFix' => $pengkajianAwalMedisRIFix,
            'pengkajianAwalMedisGiziFix' => $pengkajianAwalMedisGiziFix,
            'KonsultasiFix' => $KonsultasiFix,
            'dehidrasiresusitasi' => $dehidrasiresusitasi,
            'tatalaksanaaritmia' => $tatalaksanaaritmia,
            'resusiitasijantungparu' => $resusiitasijantungparu,
            'transfusi' => $transfusi,
            'fibrinolitik' => $fibrinolitik,
            'antikoagulanantiagregrasi' => $antikoagulanantiagregrasi,
            'ventilatorkurangdari96jam' => $ventilatorkurangdari96jam,
            'ventilatorlebih96jam' => $ventilatorlebih96jam,
            'oksigenasi' => $oksigenasi,
            'nebulisasi' => $nebulisasi,
            'trakeostomi' => $trakeostomi,
            'koreksielektrolitmetabolic' => $koreksielektrolitmetabolic,
            'bantuanpersalinan' => $bantuanpersalinan,
            'monitoringttvkesadaranskalanyeri' => $monitoringttvkesadaranskalanyeri,
            'pemberianinotropikvasoaktif' => $pemberianinotropikvasoaktif,
            'antibiotik3kali24jam' => $antibiotik3kali24jam,
            'result' => array(
                'kelasRawat' => $rincianbillingnamakelas,
                'jenisPasien' => $dataPasien[0]->kelompokpasien,
                'kelasPenjamin' => $rincianbillingnamakelas,
                'deposit' => $this->getDepositPasien($dataPasien[0]->noregistrasi),
                'billing' => $dataTotalBilltotal,
                'isi' => $isi,
                // 'lastharusbayar' => $rincianbillingharusbayar,
                'terbilang' => $terbilang
            ),
            'result2' => array(
                'kelasRawat' => $rincianbillingnamakelas,
                'jenisPasien' => $dataPasien[0]->kelompokpasien,
                'kelasPenjamin' => $rincianbillingnamakelas,
                'deposit' => $this->getDepositPasien($dataPasien[0]->noregistrasi),
                'billing' => $dataTotalBilltotal,
                'isi' => $isi,
                // 'lastharusbayar' => $rincianbillingharusbayar,
                'terbilang' => $terbilang
            ),
        );
        if ($xcetaktriase == 1) {
            $dataReport['dataTriaseIGD'] = $dataTriaseIGD;
        } else {
            $dataReport['dataTriaseIGD'] = [];
        }
        if ($xcetakhemodialisa == 1) {
            $dataReport['dataHemodialisa'] = $dataHemodialisa;
        } else {
            $dataReport['dataHemodialisa'] = [];
        }
        if ($xcetakasesmenrehab == 1) {
            $dataReport['dataAsesmenRehab'] = $dataAsesmenRehab;
            $dataReport['dataKonsulRehab'] = $dataKonsulRehab;
        } else {
            $dataReport['dataAsesmenRehab'] = [];
            $dataReport['dataKonsulRehab'] = [];
        }
        // $dataReport['dataAsesmenRehab'] = $xcetakasesmenrehab == 1 ? [$dataAsesmenRehab] : [];
        if ($xcetaklaporanoperasi == 1) {
            $dataReport['dataLaporanOperasi'] = $dataLaporanOperasi;
        } else {
            $dataReport['dataLaporanOperasi'] = [];
        }
        if ($xcetakspri == 1) {
            $dataReport['dataSPRI'] = $dataSPRI;
        } else {
            $dataReport['dataSPRI'] = [];
        }
        if ($xcetakpengkajianigd == 1) {
            $dataReport['dataPengkajianMedisIGD'] = $dataPengkajianMedisIGD;
        } else {
            $dataReport['dataPengkajianMedisIGD'] = [];
        }
        $documents = [
            'kemenkes' => $filekemenkes,
            'sep' => $filesep,
            'resume_medis' => $fileresumemedis,
            'radiologi' => $fileradiologi,
            'laboratorium' => $filelaboratorium,
            'echo' => $fileecho,
            'ekg' => $fileekg,
            'usg' => $fileusg,
            'surkon' => $filesurkon,
            'pa' => $filepa,
            'doktambahan' => $filedoktambahan,
            'billing' => $filebilling,
            'infasi' => $fileinfasi
        ];
        // $documents = array_filter($documents, function ($doc) {
        //     return !empty($doc);
        // });
        // $pageWidth = 1000;
        // // dd($documents);
        // return view(
        //     'report.rad.cetaknewtes',
        //     compact('documents', 'dokumenallArray', 'pageWidth', 'dataReport')
        // );
        // ... (kode logika data di atas TETAP SAMA, jangan diubah) ...

        // --- MULAI MODIFIKASI DARI SINI ---

        // Import class di bagian paling atas file controller:
        // use PDF;
        // use Webklex\PDFMerger\Facades\PDFMergerFacade as PDFMerger;
        // use Illuminate\Support\Facades\Storage;
        $pageWidth = '100%';
        // PURE Sartika Asih approach for rendering, but using the original Bhayangkara view
        return view('report.rad.cetaknewtes_donwload', compact('documents', 'dokumenallArray', 'pageWidth', 'dataReport'));
    }


    public function TescetakSemuaInaCbg(Request $request)
    {
        ini_set('memory_limit', '512M');
        $noregistrasi = $request['noregistrasi'];
        $norecpd = $request['norecpd'];
        $dokumenallArray = "";

        if (!empty($request['dokumenall'])) {
            //$dokumenallArray=explode(",",$request['dokumenall']);
            //$dokumenallArray = array_unique($dokumenallArray);
            // Langkah 1: Memisahkan string menjadi array
            $array = explode(",", $request['dokumenall']);
            // Langkah 2: Menghapus nilai duplikat dari array
            $array_unique = array_unique($array);
            // Langkah 3: Menggabungkan kembali array menjadi string
            $string_unique = implode(",", $array_unique);
            $dokumenallArray = explode(",", $string_unique);
            // print_r($dokumenallArray); 
        } else $dokumenallArray = "";
        //-- BEGIN -----------------------------
        if (!empty($dokumenallArray)) {
            $xcetaksep = 0;
            $xcetakresumemedis = 0;
            $xcetakbilling = 0;
            $xcetakrekapbilling = 0;
            $xcetaklab = 0;
            $xcetakrad = 0;
            $xcetakkemenkes = 0;
            $xcetakecho = 0;
            $xcetakekg = 0;
            $xcetakpa = 0;
            $xcetakusg = 0;
            $xcetaksurkon = 0;
            $xcetakdoktambahan = 0;
            $xcetakinfasi = 0;
            $xcetaktriase = 0;
            $xcetakhemodialisa = 0;
            $xcetakasesmenrehab = 0;
            $xcetaklaporanoperasi = 0;
            $xcetakspri = 0;
            $xcetakpengkajianigd = 0;
            $xcetakcppt = 0;
            $xcetakmtd = 0;
            $xcetaktf = 0;
            $xcetakcodeblue = 0;
            $xcetakderajatdehidrasi = 0;
            $xcetakewsdewasa = 0;
            $xcetakpendampinganrehab = 0;
            $xcetakpengkajianawalmedisri = 0;
            $xcetakpengkajianawalmedisgizi = 0;
            $xcetakkonsul = 0;
            $xcetaklaporantindakan = 0;

            $arraydok = [];
            $arraydata = [];
            $datjumdok = count($dokumenallArray);
            for ($i = 0; $i < $datjumdok; $i++) {
                if (!empty($dokumenallArray[$i])) {
                    if ($dokumenallArray[$i] == 'cetaksep') $xcetaksep = 1;
                    else if ($dokumenallArray[$i] == 'cetakresumemedis') $xcetakresumemedis = 1;
                    else if ($dokumenallArray[$i] == 'cetakbilling') $xcetakbilling = 1;
                    else if ($dokumenallArray[$i] == 'cetakrekapbilling') $xcetakrekapbilling = 1;
                    else if ($dokumenallArray[$i] == 'cetaklab') $xcetaklab = 1;
                    else if ($dokumenallArray[$i] == 'cetakrad') $xcetakrad = 1;
                    else if ($dokumenallArray[$i] == 'cetakkemenkes') $xcetakkemenkes = 1;
                    else if ($dokumenallArray[$i] == 'cetakecho') $xcetakecho = 1;
                    else if ($dokumenallArray[$i] == 'cetakekg') $xcetakekg = 1;
                    else if ($dokumenallArray[$i] == 'cetakpa') $xcetakpa = 1;
                    else if ($dokumenallArray[$i] == 'cetakusg') $xcetakusg = 1;
                    else if ($dokumenallArray[$i] == 'cetaksurkon') $xcetaksurkon = 1;
                    else if ($dokumenallArray[$i] == 'cetakdoktambahan') $xcetakdoktambahan = 1;
                    else if ($dokumenallArray[$i] == 'cetakinfasi') $xcetakinfasi = 1;
                    else if ($dokumenallArray[$i] == 'cetaktriase') $xcetaktriase = 1;
                    else if ($dokumenallArray[$i] == 'cetakhemodialisa') $xcetakhemodialisa = 1;
                    else if ($dokumenallArray[$i] == 'cetakasesmenrehab') $xcetakasesmenrehab = 1;
                    else if ($dokumenallArray[$i] == 'cetaklaporanoperasi') $xcetaklaporanoperasi = 1;
                    else if ($dokumenallArray[$i] == 'cetakspri') $xcetakspri = 1;
                    else if ($dokumenallArray[$i] == 'cetakpengkajianigd') $xcetakpengkajianigd = 1;
                    else if ($dokumenallArray[$i] == 'cetakcppt') $xcetakcppt = 1;
                    else if ($dokumenallArray[$i] == 'cetakmtd') $xcetakmtd = 1;
                    else if ($dokumenallArray[$i] == 'cetaktf') $xcetaktf = 1;
                    else if ($dokumenallArray[$i] == 'cetakcodeblue') $xcetakcodeblue = 1;
                    else if ($dokumenallArray[$i] == 'cetakderajatdehidrasi') $xcetakderajatdehidrasi = 1;
                    else if ($dokumenallArray[$i] == 'cetakewsdewasa') $xcetakewsdewasa = 1;
                    else if ($dokumenallArray[$i] == 'cetakpendampinganrehab') $xcetakpendampinganrehab = 1;
                    else if ($dokumenallArray[$i] == 'cetakpengkajianawalmedisri') $xcetakpengkajianawalmedisri = 1;
                    else if ($dokumenallArray[$i] == 'cetakpengkajianawalmedisgizi') $xcetakpengkajianawalmedisgizi = 1;
                    else if ($dokumenallArray[$i] == 'cetakkonsul') $xcetakkonsul = 1;
                    else if ($dokumenallArray[$i] == 'cetaklaporantindakan') $xcetaklaporantindakan = 1;
                }
            }
        } else {
            $xcetaksep = 1;
            $xcetakresumemedis = 1;
            $xcetakbilling = 1;
            $xcetakrekapbilling = 1;
            $xcetaklab = 1;
            $xcetakrad = 1;
            $xcetakkemenkes = 1;
            $xcetakecho = 1;
            $xcetakekg = 1;
            $xcetakpa = 1;
            $xcetakusg = 1;
            $xcetaksurkon = 1;
            $xcetakdoktambahan = 1;
            $xcetakinfasi = 1;
            $xcetaktriase = 1;
            $xcetakhemodialisa = 1;
            $xcetakasesmenrehab = 1;
            $xcetaklaporanoperasi = 1;
            $xcetakspri = 1;
            $xcetakpengkajianigd = 1;
            $xcetakcppt = 1;
            $xcetakmtd = 1;
            $xcetaktf = 1;
            $xcetakcodeblue = 1;
            $xcetakderajatdehidrasi = 1;
            $xcetakewsdewasa = 1;
            $xcetakpendampinganrehab = 1;
            $xcetakpengkajianawalmedisri = 1;
            $xcetakpengkajianawalmedisgizi = 1;
            $xcetakkonsul = 1;
            $xcetalaporantindakan = 1;
        }
        //check table 2024-01-11
        $filesep = '';
        $filebilling = '';
        $filerekapbilling = '';
        $fileresumemedis = '';
        $fileradiologi = '';
        $filelaboratorium = '';
        $filekemenkes = '';
        $fileecho[] = '';
        // $fileekg[] = '';
        // $fileusg = [];
        $fileinfasi[] = '';
        $adaecho = false;
        $checkfile = DB::select(DB::raw("SELECT DISTINCT ON (fp.norec) 
                                            fp.*, 
                                            pd.*, 
                                            d.*
                                        FROM 
                                            filepapj_t AS fp
                                        INNER JOIN 
                                            pasiendaftar_t AS pd ON pd.noregistrasi = fp.noregistrasi
                                        INNER JOIN 
                                            dokumen_t AS d ON d.norec_pd = pd.norec
                                        WHERE 
                                            fp.noregistrasi = '$noregistrasi'
                                            AND d.statusenabled = TRUE
                                        ORDER BY 
                                            fp.norec, d.norec_pd"));
        if (empty($checkfile)) {
            $checkfile = [];
        } else {
            foreach ($checkfile as $chk) {
                // if($xcetaksep) { 
                //     if(!empty($chk->filesep)) {
                //         $xcetaksep = 2;
                //         $filesep = $this->convertHtmlToPdfBase64($chk->filesep);
                //     } 
                // }
                // if($xcetakbilling) { 
                //     if(!empty($chk->filebilling)) {
                //         $xcetakbilling = 2;
                //         $filebilling=$chk->filebilling;
                //     } 
                // }
                // if($xcetakrekapbilling) {             
                //     if(!empty($chk->filerekapbilling)) {
                //         $xcetakrekapbilling = 2;
                //         $filerekapbilling=$chk->filerekapbilling;
                //     } 
                // }
                // if($xcetakresumemedis) { 
                //     if(!empty($chk->fileresumemedis)) {
                //         $xcetakresumemedis = 2;
                //         $fileresumemedis=$chk->fileresumemedis;
                //     } 
                // }
                // if($xcetakrad) { 
                //     if(!empty($chk->fileradiologi)) {
                //         $xcetakrad = 2;
                //         $fileradiologi=$chk->fileradiologi;
                //     } 
                // }
                // if ($xcetaklab) {
                //     if (!empty($chk->filelaboratorium)) {
                //         $xcetaklab = 2;
                //         $filelaboratorium = $chk->filelaboratorium;
                //     }
                // }
                // if($xcetakkemenkes) { 
                //     if(!empty($chk->filekemenkes)) {
                //         $xcetakkemenkes = 2;
                //         $filekemenkes=$chk->filekemenkes;
                //     } 
                // }
                if ($xcetakecho) {
                    if (!empty($chk->fileecho)) {
                        $xcetakecho = 2;
                        $fileecho[] = $chk->fileecho;
                        $adaecho = true;
                    }
                }
                // if ($xcetakekg) {
                //     if (!empty($chk->fileekg)) {
                //         $xcetakekg = 2;
                //         $fileekg[] = $chk->fileekg;
                //     }
                // }
                // if ($xcetakusg) {
                //     if (!empty($chk->fileusg)) {
                //         $xcetakusg = 2;
                //         $fileusg[] = $chk->fileusg;
                //     }
                // }
                if ($xcetakinfasi) {
                    if (!empty($chk->fileinfasi)) {
                        $xcetakinfasi = 2;
                        $fileinfasi[] = $chk->fileinfasi;
                    }
                }
            }
        }
        // $fileecho[] = '';
        $fileusg[] = '';
        $filesurkon[] = '';
        $fileekg[] = '';
        $filepa[] = '';
        $filedoktambahan[] = '';
        $checkfile2 = DB::select(DB::raw("SELECT
                                            d.* 
                                        FROM 
																						dokumen_t AS d
                                        INNER JOIN 
                                            pasiendaftar_t AS pd ON pd.norec = d.norec_pd
                                        WHERE 
                                            pd.noregistrasi = '$noregistrasi'
                                            AND d.statusenabled = TRUE
                                        ORDER BY d.norec_pd"));
        if (empty($checkfile2)) {
            $checkfile2 = [];
        } else {
            foreach ($checkfile2 as $chk) {
                if ($xcetakecho) {
                    if ($chk->jenisdokumenfk == '53' && $adaecho == false) {
                        $xcetakecho = 2;
                        $fileecho[] = $chk->dokumen;
                    }
                }
                if ($xcetakusg) {
                    if ($chk->jenisdokumenfk == '65') {
                        $xcetakusg = 2;
                        $fileusg[] = $chk->dokumen;
                    }
                }
                if ($xcetaksurkon) {
                    if ($chk->jenisdokumenfk == '70') {
                        $xcetaksurkon = 2;
                        $filesurkon[] = $chk->dokumen;
                    }
                }
                if ($xcetakekg) {
                    if ($chk->jenisdokumenfk == '52' || $chk->jenisdokumenfk == '43') {
                        $xcetakekg = 2;
                        $fileekg[] = $chk->dokumen;
                    }
                }
                if ($xcetakpa) {
                    if ($chk->jenisdokumenfk == '58') {
                        $xcetakpa = 2;
                        $filepa[] = $chk->dokumen;
                    }
                }
                if ($xcetakdoktambahan) {
                    if ($chk->jenisdokumenfk == '68' || $chk->jenisdokumenfk == '63') {
                        $xcetakdoktambahan = 2;
                        $filedoktambahan[] = $chk->dokumen;
                    }
                }
            }
        }
        //-----------------------pasien-----------------------------------------
        $dataPasien = DB::select(DB::raw("
            SELECT
                pd.tglregistrasi,
                pd.tglpulang,
                rk.namarekanan,
                pd.noregistrasi,
                kp.kelompokpasien,
                ps.tgllahir,
                jk.jeniskelamin,
                alm.alamatlengkap || ' ' || dk.namadesakelurahan || ' ' || kc.namakecamatan || ' ' || kk.namakotakabupaten || ' ' || pro.namapropinsi AS alamatlengkap,
                ps.tempatlahir,
                ps.noidentitas,
                ps.notelepon,
                pp.namapangkatpolisi,
                ks.kesatuanpasien,
                ps.objectjeniskelaminfk,
                ps.nocm,
                ps.namapasien,
                pd.objectkelompokpasienlastfk,
                kls.namakelas,
                ru.objectdepartemenfk,
                pd.objectruanganlastfk,
                ru.namaruangan AS lastruangan 
            FROM
                pasiendaftar_t AS pd
                LEFT JOIN pasien_m AS ps ON ps.ID = pd.nocmfk
                LEFT JOIN jeniskelamin_m AS jk ON jk.ID = ps.objectjeniskelaminfk
                LEFT JOIN alamat_m AS alm ON alm.nocmfk = ps.ID 
                LEFT JOIN desakelurahan_m AS dk ON dk.ID = alm.objectdesakelurahanfk
                LEFT JOIN kecamatan_m AS kc ON kc.ID = alm.objectkecamatanfk
                LEFT JOIN kotakabupaten_m AS kk ON kk.ID = alm.objectkotakabupatenfk
                LEFT JOIN propinsi_m AS pro ON pro.ID = alm.objectpropinsifk
                LEFT JOIN pangkatpolisi_m AS pp ON pp.ID = ps.pangkatpolisi
                LEFT JOIN kesatuanpasien_m AS ks ON ks.ID = ps.objectkesatuanfk
                LEFT JOIN kelas_m AS kls ON kls.ID = pd.objectkelasfk
                LEFT JOIN ruangan_m AS ru ON ru.ID = pd.objectruanganlastfk 
                LEFT JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
                LEFT JOIN rekanan_m as rk ON rk.id = pd.objectrekananfk
            WHERE
                pd.noregistrasi = '$noregistrasi'
            "));
        $objectruanganlastfk = $dataPasien[0]->objectruanganlastfk;
        //-----------------------------Kamar-----------------------------------
        $kamar = '';
        $nobed = '';

        $cekkamar = DB::select("
            SELECT 
                ru.namaruangan AS namaruangan,
                km.namakamar,
                kl.namakelas,
                tt.reportdisplay
            FROM 
                pasiendaftar_t AS pd
            LEFT JOIN 
                ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
            LEFT JOIN 
                antrianpasiendiperiksa_t AS apd 
                    ON apd.noregistrasifk = pd.norec AND apd.objectruanganfk = pd.objectruanganlastfk
            LEFT JOIN 
                kamar_m AS km ON km.id = apd.objectkamarfk
            LEFT JOIN 
                tempattidur_m AS tt ON apd.nobed = tt.id
            LEFT JOIN 
                pemakaianasuransi_t AS pa ON pa.noregistrasifk = pd.norec
            LEFT JOIN 
                asuransipasien_m AS asu ON asu.id = pa.objectasuransipasienfk
            LEFT JOIN 
                kelas_m AS kl ON kl.id = asu.objectkelasdijaminfk
            WHERE 
                pd.noregistrasi = :noregistrasi
            GROUP BY 
                ru.namaruangan, km.namakamar, kl.namakelas, tt.reportdisplay, apd.tglmasuk
            ORDER BY 
                apd.tglmasuk DESC
            LIMIT 1
        ", [
            'noregistrasi' => $noregistrasi
        ]);

        if (!empty($cekkamar)) {
            $kamar = $cekkamar[0]->namakamar ?? '';
            $nobed = $cekkamar[0]->reportdisplay ?? '';
        }

        //----------------------------Kelas faktur------------------------------------
        $umurpasien = $this->getAge($dataPasien[0]->tgllahir, date('Y-m-d'));
        $kelasfaktur = '';
        $kelasdijamin = DB::select(DB::raw("
        select kls.namakelas from pasiendaftar_t as pd left join
        pemakaianasuransi_t as pa on pa.noregistrasifk = pd.norec left join
        asuransipasien_m as ap on ap.id = pa.objectasuransipasienfk left join
        kelas_m as kls on kls.id = ap.objectkelasdijaminfk
        where pd.noregistrasi = '$noregistrasi'
        "));
        if ($dataPasien[0]->objectkelompokpasienlastfk == 2) {
            if (count($kelasdijamin) > 0) {
                $kelasfaktur = $kelasdijamin[0]->namakelas;
            }
        } else {
            $kelasfaktur = $dataPasien[0]->namakelas;
        }
        //-----------------------total bill-----------------------------------------
        if ($objectruanganlastfk == 721) {
            $dataTotalBill = DB::select(
                DB::raw(" select sum(((case when pp.hargajual is null then 0 else pp.hargajual  end - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah) + case when pp.jasa is null then 0 else pp.jasa end) as total
                        from pasiendaftar_t as pd
                        INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                        INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                        where  pd.noregistrasi=:noregistrasi and pp.produkfk not in (402611) ;
                    "),
                array(
                    'noregistrasi' => $noregistrasi,
                )
            );
        } else {
            $dataTotalBill = DB::select(
                DB::raw("select sum((case when pp.hargajual is null then 0 else pp.hargajual  end  * pp.jumlah - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) + case when pp.jasa is null then 0 else pp.jasa end) as total
                        from pasiendaftar_t as pd
                        INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                        INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                        where  pd.noregistrasi=:noregistrasi and pp.produkfk not in (402611) and pp.isobatnoninacbg is null ;
                    "),
                array(
                    'noregistrasi' => $noregistrasi,
                )
            );
        }
        //-----------------------billing-----------------------------------------
        $rincianbilling = [];
        $tampungnosep = '';
        $isi = "";
        $terbilang = "";
        $rincianbillingnamaruangan = "";
        $rincianbillingnamadokter = "";
        $rincianbillingnamakelas = "";
        $dataTotalBilltotal = "";
        if ($xcetakbilling == 1 || $xcetakrekapbilling == 1) {
            $rincianbilling = DB::select(DB::raw("
            SELECT 
                pp.norec,
                pp.tglpelayanan,
                pp.rke,
                pr.id AS prid,
                pr.namaproduk,
                pp.jumlah,
                kl.id AS klid,
                kl.namakelas,
                pd.catatan,
                pd.statuscatatan,
                ru.id AS ruid,
                ru.namaruangan,
                pp.produkfk,
                pp.hargajual,
                pp.hargadiscount,
                sp.nostruk,
                sp.tglstruk,
                apd.norec AS norec_apd,
                pp.qtydetailresep,
                pg.id AS pgid,
                pd.objectpegawaifk AS pgpjid,
                asu.objectkelasdijaminfk,
                pd.objectkelompokpasienlastfk,
                pg.namalengkap,
                sbm.nosbm,
                sp.norec AS norec_sp,
                pp.jasa,
                pd.nocmfk,
                ru.objectdepartemenfk AS deptid,
                pd.nocmfk,
                pd.nostruklastfk,
                ag.id AS agid,
                ag.agama,
                pas.tgllahir,
                kp.id AS kpid,
                kp.kelompokpasien,
                pas.objectstatusperkawinanfk,
                pas.namaayah,
                pas.namasuamiistri,
                pas.id AS pasid,
                pas.nocm,
                jkel.id AS jkelid,
                jkel.jeniskelamin,
                jkel.reportdisplay AS jk,
                pd.noregistrasi,
                pas.namapasien,
                pd.tglregistrasi,
                dpm.namadepartemen,
                dpm.id AS iddepartemen,
                pd.norec AS norec_pd,
                pd.tglpulang,
                pas.notelepon,
                kls.id AS klsid,
                kls.namakelas,
                pd.objectrekananfk AS rekananid,
                ru2.namaruangan AS ruanganlast,
                kls2.id AS klsid2,
                kls2.namakelas AS namakelas2,
                sr.noresep,
                sr.norec AS norec_resep,
                rk.namarekanan,
                rusr.namaruangan AS ruanganfarmasi,
                pgsr.namalengkap AS penulisresep,
                jp.jenisproduk,
                kpBpjs.kelompokprodukbpjs AS kelompokprodukbpjs,
                pgpj.namalengkap AS dokterpj,
                pp.jasa,
                kamar.namakamar,
                sp.totalharusdibayar,
                sp.totalprekanan,
                sppj.totalppenjamin,
                sp.totalbiayatambahan,
                pgsbm.namalengkap AS namalengkapsbm,
                pd.kdprofile,
                pp.aturanpakai,
                pp.iscito,
                pd.statuspasien,
                pp.isparamedis,
                ru2.id AS ruanganlastid,
                pa.nosep
            FROM 
                pasiendaftar_t AS pd
                LEFT JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
                LEFT JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
                LEFT JOIN produk_m AS pr ON pr.id = pp.produkfk
                LEFT JOIN detailjenisproduk_m AS djp ON djp.id = pr.objectdetailjenisprodukfk
                LEFT JOIN jenisproduk_m AS jp ON jp.id = djp.objectjenisprodukfk
                LEFT JOIN kelompokprodukbpjs_m AS kpBpjs ON kpBpjs.id = pr.objectkelompokprodukbpjsfk
                LEFT JOIN kelas_m AS kl ON kl.id = apd.objectkelasfk
                LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                JOIN ruangan_m AS ru2 ON ru2.id = pd.objectruanganlastfk
                JOIN departemen_m AS dpm ON dpm.id = ru.objectdepartemenfk
                JOIN pasien_m AS pas ON pas.id = pd.nocmfk
                LEFT JOIN agama_m AS ag ON ag.id = pas.objectagamafk
                LEFT JOIN jeniskelamin_m AS jkel ON jkel.id = pas.objectjeniskelaminfk
                LEFT JOIN kelompokpasien_m AS kp ON kp.id = pd.objectkelompokpasienlastfk
                LEFT JOIN kelas_m AS kls ON kls.id = apd.objectkelasfk
                LEFT JOIN kelas_m AS kls2 ON kls2.id = pd.objectkelasfk
                LEFT JOIN pegawai_m AS pg ON pg.id = apd.objectpegawaifk
                LEFT JOIN pegawai_m AS pgpj ON pgpj.id = pd.objectpegawaifk
                LEFT JOIN pemakaianasuransi_t AS pa ON pa.noregistrasifk = pd.norec
                LEFT JOIN asuransipasien_m AS asu ON asu.id = pa.objectasuransipasienfk
                LEFT JOIN rekanan_m AS rk ON rk.id = pd.objectrekananfk
                LEFT JOIN strukresep_t AS sr ON sr.norec = pp.strukresepfk
                LEFT JOIN ruangan_m AS rusr ON rusr.id = sr.ruanganfk
                LEFT JOIN kamar_m AS kamar ON kamar.id = apd.objectkamarfk
                LEFT JOIN pegawai_m AS pgsr ON pgsr.id = sr.penulisresepfk
                LEFT JOIN strukpelayanan_t AS sp ON sp.norec = pp.strukfk
                LEFT JOIN strukpelayananpenjamin_t AS sppj ON sp.norec = sppj.nostrukfk
                LEFT JOIN strukbuktipenerimaan_t AS sbm ON sp.nosbmlastfk = sbm.norec
                LEFT JOIN pegawai_m AS pgsbm ON pgsbm.id = sbm.objectpegawaipenerimafk
            WHERE 
                pd.noregistrasi = '$noregistrasi'
            ORDER BY 
                pp.tglpelayanan, pp.rke;
            "));
            if (!empty($rincianbilling[0])) $tampungnosep = $rincianbilling[0]->nosep;
            else $tampungnosep = '';

            $rincianproduk = DB::select(DB::raw("
            SELECT 
                ROW_NUMBER() OVER (PARTITION BY noregistrasi ORDER BY jenisproduk, namaproduk) AS rownum,
                *,
                tglpelayanan AS tglpelayananx
            FROM
                temp_billing_t 
            WHERE
                noregistrasi = '$noregistrasi' 
                AND tglpelayanan IS NOT NULL 
                AND namaproduk NOT IN ('Biaya Administrasi', 'Biaya Materai')
            ORDER BY
                 ruangantindakan, jenisproduk, namaproduk;
            "));

            $riwayatinap = \DB::table('antrianpasiendiperiksa_t as apd')
                ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                ->select('ru.namaruangan', 'apd.tglmasuk', 'apd.tglkeluar', 'pd.noregistrasi')
                ->where('pd.noregistrasi', $noregistrasi)
                ->where('ru.objectdepartemenfk', '16')
                ->where('apd.statusenabled', true)
                ->orderBy('apd.tglmasuk')
                ->get();


            foreach ($riwayatinap as $x) {
                $isi = $isi . ' ' . $x->namaruangan . ' Tgl.Masuk ' . $x->tglmasuk . ' \ ' . $x->tglkeluar . ' # ';
            }

            if ($dataTotalBill[0]->total != 0.0) {
                $terbilang = $this->makeTerbilang($dataTotalBill[0]->total);
            }

            if (!empty($rincianbilling)) {
                $rincianbillingnamaruangan = $rincianbilling[0]->ruanganlast;
                $rincianbillingnamadokter = $rincianbilling[0]->dokterpj;
                $rincianbillingnamakelas = $rincianbilling[0]->namakelas;
                // $rincianbillingharusbayar=$rincianbilling[0]->lastharusbayar;
                $dataTotalBilltotal = $dataTotalBill[0]->total;
            }
        }
        //----------------------------------------------------------------
        $namaruanganresume = '';
        $tglmasukresume = '';
        $tglkeluarresume = '';
        $keluhanutamaRM = '';
        $diagdok = '';
        $diagsek = '';
        $alergiresume = '';
        $keadaanumumresume = '';
        $pfnadi = '';
        $pfspo = '';
        $pfbb = '';
        $pftb = '';
        $pfe = '';
        $pfm = '';
        $pfv = '';
        $kondisiwaktukeluar = '';
        $carapulang = '';
        $kesadaranresume = '';
        $denyutjantung = '';
        $pernapasanresume = '';
        $systole = '';
        $diastole = '';
        $suhuresume = '';
        $pemeriksaanfisik = '';
        $diet = '';
        $keterangandiet = '';
        $prognosis = '';
        $edukasi = '-';
        $rencanatindaklanjut = '-';
        $kontrol = '-';
        $tglkontrolpoli = '-';
        $keadaandarurat2 = '-';
        $sarantransportasi = '-';
        $kondisimeninggalkan = '-';
        $pasienkeluarga = '';
        $namadokter = '';
        $tindakanlab = 'Laboratorium Klinik : ';
        $tindakanrad = 'Radiologi : ';
        // $tindakanpa = 'Laboratorium Patalogi Anatomi : ';
        $tampung2 = '';
        $tampungbaruuuuu = '';
        $penunjanglab = '-';
        $penunjangrad = '-';
        $penunjangpa = '-';
        $obatResume = '';
        $obatPulang = '';
        $nourutobat = 1;
        $nourutobatpulang = 1;
        $qrdpjpresume = '';
        $qrpasienrm = '';
        $ringkasanriwayatpenyakit = '';
        $alasanrawat = '';
        $pemeriksaanfisik = '';
        $result = [];
        //--------------------Resume--------------------------------------------
        $resumeMedis = [];
        $adaresume = 'false';
        $result = [];
        $konsultasi = '';
        $keteranganresume = '';
        $indikasirawatinap = '-';
        $tindakanrm = '-';
        $isreaksiobat = '';
        $listReaksiObat = '';
        $listRO = '';
        $ku = '';
        $kesadaranpulang = '';
        $tekanandarahpulang = '';
        $suhupulang = '';
        $pernafasanpulang = '';
        $nadipulang = '';
        $msp = '';
        $ab = '';
        $akyt = '';
        $perawatandirumah = '';
        $perawatandirumahlanjut = '';
        $ppp = '';
        $kebutuhanedukasi = '';
        $opr = '';
        $namapasienrm = '';
        $temuanpenting = '';
        $hasilkonsultasi = '';

        $diagnosaawal = 'Diagnosis Awal : ';
        $diagnosasekunder = 'Diagnosis Sekunder : ';
        $diagnosautama = 'Diagnosis Primer / Utama : ';
        $diagnosatindakan = '';
        $dehidrasiresusitasi = '';
        $tatalaksanaaritmia = '';
        $resusiitasijantungparu = '';
        $transfusi = '';
        $fibrinolitik = '';
        $antikoagulanantiagregrasi = '';
        $ventilatorkurangdari96jam = '';
        $ventilatorlebih96jam = '';
        $oksigenasi = '';
        $nebulisasi = '';
        $trakeostomi = '';
        $koreksielektrolitmetabolic = '';
        $bantuanpersalinan = '';
        $monitoringttvkesadaranskalanyeri = '';
        $pemberianinotropikvasoaktif = '';
        $antibiotik3kali24jam = '';

        if ($xcetakresumemedis == 1) {
            if ($dataPasien[0]->objectdepartemenfk == 16) {
                $resumeMedis = DB::select(DB::raw("
                select rm.norec, ru.namaruangan, rm.tglmasuk, rm.pemeriksaandisik, rm.pemeriksaanfisik, 
                case when rm.tglkontrol is not null then to_char(rm.tglkontrol, 'DD-MM-YYYY') else '-' end as tglkontrol, 
                rm.kondisiwaktukeluar, rm.tglkeluar, rm.keluhanutama, rm.diagdok, rm.diagsek, rm.alergi, rm.keadaanumum, rm.kesadaran, 
                rm.denyutjantung, rm.pernapasan, rm.systole, rm.diastole, rm.suhu, rm.diet, rm.keterangandiet, 
                rm.edukasi, rm.prognosis, rm.rencanatindaklanjut, rm.instruksianjuran, kontrol, 
                case when tglkontrolpoli is not null then to_char(tglkontrolpoli, 'DD-MM-YYYY') else '-' end as tglkontrolpoli, 
                keadaandarurat2, rm.sarantransportasi, rm.kondisimeninggalkan, rm.pasienkeluarga, rm.namadokter, 
                rm.pemeriksaanfisik, rm.pengobatan, rm.pegawaifk, rm.ringkasanriwayatpenyakit, rm.alasanrawat, rm.keteranganlainnya, rm.indikasirawatinap, rm.pfnadi, rm.pfspo, rm.pfbb, rm.pftb, rm.pfe, rm.pfm, rm.pfv, rm.carapulang, rm.kondisiwaktukeluar, rm.tindakanrm, rm.isreaksiobatya, rm.isreaksiobattidak, rm.ku, rm.kesadaranpulang, rm.tekanandarah, rm.suhupulang, rm.pernafasanpulang, rm.nadipulang, rm.ismandiriya, rm.isdibantusetengahya, rm.isdibantupenuhya, rm.iswalkerya, rm.isalatbantulainlainya, rm.istidakadaalatkesehatanya, rm.isivcateterya, rm.isdobellumenya, rm.isngtya, rm.isoksigenya, rm.iscateterurineya, rm.isalatkesehatanlainlainya, rm.israwatdirumahtidak, rm.israwatdirumahya, rm.ishomecareya, rm.isperawatanlanjutanya, rm.ispengobatanlukaya, rm.ispengobatanlanjutanya, rm.isfaskesterdekatya, rm.faskesterdekat, rm.islaboratoriumya, rm.isradiologiya, rm.ispemeriksaanpenunjanglainlainya, rm.pemeriksaanpenunjanglainlain, rm.ispenyakitya, rm.isefeksampingobatya, rm.isdietya, rm.isaktifitasistirahatya, rm.ishygieneya, rm.isperawatanlukadirumahya, rm.isnyeriya, rm.isperawatanibubayiya, rm.ispertolonganmendesakya, rm.pertolonganmendesak, rm.iskebutuhanedukasilainlainya, rm.kebutuhanedukasilainlain, rm.pasienkeluarga, rm.temuanpenting, rm.hasilkonsultasi,
                rm.dehidrasiresusitasi,
                rm.tatalaksanaaritmia,
                rm.resusiitasijantungparu,
                rm.transfusi,
                rm.fibrinolitik,
                rm.antikoagulanantiagregrasi,
                rm.ventilatorkurangdari96jam,
                rm.ventilatorlebih96jam,
                rm.oksigenasi,
                rm.nebulisasi,
                rm.trakeostomi,
                rm.koreksielektrolitmetabolic,
                rm.bantuanpersalinan,
                rm.monitoringttvkesadaranskalanyeri,
                rm.pemberianinotropikvasoaktif,
                rm.antibiotik3kali24jam
                from pasiendaftar_t as pd 
                left join antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec 
                left join resumemedis_t as rm on rm.noregistrasifk = apd.norec 
                left join ruangan_m as ru on ru.id = pd.objectruanganlastfk
                where pd.noregistrasi = '$noregistrasi' and rm.statusenabled = 't' and rm.keteranganlainnya = 'RawatInap' 
                order by rm.tglresume desc
                "));
            } else if ($dataPasien[0]->objectdepartemenfk == 24) {
                $resumeMedis = DB::select(DB::raw("
                select rm.norec, ru.namaruangan, rm.pemeriksaandisik, rm.pemeriksaanfisik, 
                case when rm.tglkontrol is not null then to_char(rm.tglkontrol, 'DD-MM-YYYY') else '-' end as tglkontrol, 
                rm.tglmasuk, rm.kondisiwaktukeluar, rm.tglkeluar, rm.keluhanutama, rm.diagdok, rm.diagsek, rm.alergi, rm.keadaanumum, rm.kesadaran, 
                rm.denyutjantung, rm.pernapasan, rm.systole, rm.diastole, rm.suhu, rm.diet, rm.keterangandiet, rm.edukasi, 
                rm.prognosis, rm.rencanatindaklanjut, rm.instruksianjuran, kontrol, 
                case when tglkontrolpoli is not null then to_char(tglkontrolpoli, 'DD-MM-YYYY') else '-' end as tglkontrolpoli, 
                keadaandarurat2, rm.sarantransportasi, rm.kondisimeninggalkan, rm.pasienkeluarga, rm.namadokter, 
                rm.pemeriksaanfisik, rm.pengobatan, rm.pegawaifk, rm.ringkasanriwayatpenyakit, rm.alasanrawat, rm.keteranganlainnya, rm.indikasirawatinap, rm.pfnadi, rm.pfspo, rm.pfbb, rm.pftb, rm.pfe, rm.pfm, rm.pfv, rm.carapulang, rm.kondisiwaktukeluar, rm.tindakanrm, rm.isreaksiobatya, rm.isreaksiobattidak, rm.ku, rm.kesadaranpulang, rm.tekanandarah, rm.suhupulang, rm.pernafasanpulang, rm.nadipulang, rm.ismandiriya, rm.isdibantusetengahya, rm.isdibantupenuhya, rm.iswalkerya, rm.isalatbantulainlainya, rm.istidakadaalatkesehatanya, rm.isivcateterya, rm.isdobellumenya, rm.isngtya, rm.isoksigenya, rm.iscateterurineya, rm.isalatkesehatanlainlainya, rm.israwatdirumahtidak, rm.israwatdirumahya, rm.ishomecareya, rm.isperawatanlanjutanya, rm.ispengobatanlukaya, rm.ispengobatanlanjutanya, rm.isfaskesterdekatya, rm.faskesterdekat, rm.islaboratoriumya, rm.isradiologiya, rm.ispemeriksaanpenunjanglainlainya, rm.pemeriksaanpenunjanglainlain, rm.ispenyakitya, rm.isefeksampingobatya, rm.isdietya, rm.isaktifitasistirahatya, rm.ishygieneya, rm.isperawatanlukadirumahya, rm.isnyeriya, rm.isperawatanibubayiya, rm.ispertolonganmendesakya, rm.pertolonganmendesak, rm.iskebutuhanedukasilainlainya, rm.kebutuhanedukasilainlain, rm.pasienkeluarga, rm.temuanpenting, rm.hasilkonsultasi
                from pasiendaftar_t as pd 
                left join antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec 
                left join resumemedis_t as rm on rm.noregistrasifk = apd.norec 
                left join ruangan_m as ru on ru.id = apd.objectruanganfk
                where pd.noregistrasi = '$noregistrasi' and rm.statusenabled = 't' and rm.keteranganlainnya = 'IGD' 
                order by rm.tglresume desc
                "));
            } else {
                $resumeMedis = DB::select(DB::raw("
                select rm.norec, ru.namaruangan, rm.tglmasuk, rm.pemeriksaandisik, rm.pemeriksaanfisik, 
                case when rm.tglkontrol is not null then to_char(rm.tglkontrol, 'DD-MM-YYYY') else '-' end as tglkontrol, 
                rm.kondisiwaktukeluar, rm.tglkeluar, rm.keluhanutama, rm.alergi, rm.diagdok, rm.diagsek, rm.keadaanumum, rm.kesadaran, 
                rm.denyutjantung, rm.pernapasan, rm.systole, rm.diastole, rm.suhu, rm.diet, rm.keterangandiet, rm.edukasi, 
                rm.prognosis, rm.rencanatindaklanjut, rm.instruksianjuran, kontrol, 
                case when tglkontrolpoli is not null then to_char(tglkontrolpoli, 'DD-MM-YYYY') else '-' end as tglkontrolpoli, 
                keadaandarurat2, rm.sarantransportasi, rm.kondisimeninggalkan, rm.pasienkeluarga, rm.namadokter, 
                rm.pemeriksaanfisik, rm.pengobatan, rm.pegawaifk, rm.ringkasanriwayatpenyakit, rm.alasanrawat, rm.keteranganlainnya, rm.indikasirawatinap, rm.pfnadi, rm.pfspo, rm.pfbb, rm.pftb, rm.pfe, rm.pfm, rm.pfv, rm.carapulang, rm.kondisiwaktukeluar, rm.tindakanrm, rm.isreaksiobatya, rm.isreaksiobattidak, rm.ku, rm.kesadaranpulang, rm.tekanandarah, rm.suhupulang, rm.pernafasanpulang, rm.nadipulang, rm.ismandiriya, rm.isdibantusetengahya, rm.isdibantupenuhya, rm.iswalkerya, rm.isalatbantulainlainya, rm.istidakadaalatkesehatanya, rm.isivcateterya, rm.isdobellumenya, rm.isngtya, rm.isoksigenya, rm.iscateterurineya, rm.isalatkesehatanlainlainya, rm.israwatdirumahtidak, rm.israwatdirumahya, rm.ishomecareya, rm.isperawatanlanjutanya, rm.ispengobatanlukaya, rm.ispengobatanlanjutanya, rm.isfaskesterdekatya, rm.faskesterdekat, rm.islaboratoriumya, rm.isradiologiya, rm.ispemeriksaanpenunjanglainlainya, rm.pemeriksaanpenunjanglainlain, rm.ispenyakitya, rm.isefeksampingobatya, rm.isdietya, rm.isaktifitasistirahatya, rm.ishygieneya, rm.isperawatanlukadirumahya, rm.isnyeriya, rm.isperawatanibubayiya, rm.ispertolonganmendesakya, rm.pertolonganmendesak, rm.iskebutuhanedukasilainlainya, rm.kebutuhanedukasilainlain, rm.pasienkeluarga, rm.temuanpenting, rm.hasilkonsultasi
                from pasiendaftar_t as pd 
                left join antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec 
                left join resumemedis_t as rm on rm.noregistrasifk = apd.norec 
                left join ruangan_m as ru on ru.id = apd.objectruanganfk
                where pd.noregistrasi = '$noregistrasi' and rm.statusenabled = 't' and rm.keteranganlainnya = 'RawatJalan' 
                order by rm.tglresume desc
                "));
            }
            // return($resumeMedis);
            // die();
            $adaresume = 'false';
            if (count($resumeMedis) > 0) {
                if ($resumeMedis[0]->isreaksiobatya != null && $resumeMedis[0]->isreaksiobatya == true) {
                    $isreaksiobat = 'Ya';
                    $dataRO = \DB::table('reaksiobatresumemedis_t as ro')
                        ->select(
                            'ro.*'
                        )
                        ->Join('resumemedis_t as rm', 'rm.norec', '=', 'ro.norecresumefk')
                        ->Join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'rm.noregistrasifk')
                        ->Join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                        ->Join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                        ->where('rm.statusenabled', true)
                        ->where('pd.noregistrasi', $noregistrasi)
                        ->where('rm.keteranganlainnya', 'RawatInap');
                    $dataRO = $dataRO->get();
                    foreach ($dataRO as $ro) {
                        $listRO = $listRO . $ro->namaobatro . '-' . $ro->manifestasiro . '-' . $ro->keteranganro . "<br>";
                    }
                } else {
                    $isreaksiobat = 'Tidak';
                }

                if ($resumeMedis[0]->ismandiriya != null && $resumeMedis[0]->ismandiriya == true) {
                    $msp = 'mandiri';
                } else if ($resumeMedis[0]->isdibantusetengahya != null && $resumeMedis[0]->isdibantusetengahya == true) {
                    $msp = 'Dibantu Sebagian';
                } else if ($resumeMedis[0]->isdibantupenuhya != null && $resumeMedis[0]->isdibantupenuhya == true) {
                    $msp = 'Dibantu Penuh';
                }

                if ($resumeMedis[0]->iswalkerya != null && $resumeMedis[0]->iswalkerya == true) {
                    $ab = 'Walker';
                } else if ($resumeMedis[0]->isalatbantulainlainya != null && $resumeMedis[0]->isalatbantulainlainya == true) {
                    $ab = 'Lain-lain';
                }
                if ($resumeMedis[0]->istidakadaalatkesehatanya != null && $resumeMedis[0]->istidakadaalatkesehatanya == true) {
                    $akyt .= 'Tidak Ada';
                }
                if ($resumeMedis[0]->isivcateterya != null && $resumeMedis[0]->isefeksampingobatya == true) {
                    if (!empty($akyt)) {
                        $akyt .= ', ';
                    }
                    $akyt .= 'IV Cateter';
                }
                if ($resumeMedis[0]->isdobellumenya != null && $resumeMedis[0]->isdobellumenya == true) {
                    if (!empty($akyt)) {
                        $akyt .= ', ';
                    }
                    $akyt .= 'Dobel Lumen';
                }
                if ($resumeMedis[0]->isngtya != null && $resumeMedis[0]->isngtya == true) {
                    if (!empty($akyt)) {
                        $akyt .= ', ';
                    }
                    $akyt .= 'NGT';
                }
                if ($resumeMedis[0]->isoksigenya != null && $resumeMedis[0]->isoksigenya == true) {
                    if (!empty($akyt)) {
                        $akyt .= ', ';
                    }
                    $akyt .= 'Oksigen';
                }
                if ($resumeMedis[0]->iscateterurineya != null && $resumeMedis[0]->iscateterurineya == true) {
                    if (!empty($akyt)) {
                        $akyt .= ', ';
                    }
                    $akyt .= 'Cateter Urine';
                }
                if ($resumeMedis[0]->isalatkesehatanlainlainya != null && $resumeMedis[0]->isalatkesehatanlainlainya == true) {
                    if (!empty($akyt)) {
                        $akyt .= ', ';
                    }
                    $akyt .= 'Lain-lain';
                }
                if ($resumeMedis[0]->israwatdirumahya != null && $resumeMedis[0]->israwatdirumahya == true) {
                    $perawatandirumah = 'Ada';
                    if ($resumeMedis[0]->ishomecareya != null && $resumeMedis[0]->ishomecareya == true) {
                        $perawatandirumahlanjut .= 'Home Care';
                    }
                    if ($resumeMedis[0]->isperawatanlanjutanya != null && $resumeMedis[0]->isperawatanlanjutanya == true) {
                        if (!empty($perawatandirumahlanjut)) {
                            $perawatandirumahlanjut .= ', ';
                        }
                        $perawatandirumahlanjut .= 'Perawatan Lanjutan';
                    }
                    if ($resumeMedis[0]->ispengobatanlukaya != null && $resumeMedis[0]->ispengobatanlukaya == true) {
                        if (!empty($perawatandirumahlanjut)) {
                            $perawatandirumahlanjut .= ', ';
                        }
                        $perawatandirumahlanjut .= 'Perawatan Luka';
                    }
                    if ($resumeMedis[0]->ispengobatanlanjutanya != null && $resumeMedis[0]->ispengobatanlanjutanya == true) {
                        if (!empty($perawatandirumahlanjut)) {
                            $perawatandirumahlanjut .= ', ';
                        }
                        $perawatandirumahlanjut .= 'Pengobatan Lanjutan';
                    }
                    if ($resumeMedis[0]->isfaskesterdekatya != null && $resumeMedis[0]->isfaskesterdekatya == true) {
                        if (!empty($perawatandirumahlanjut)) {
                            $perawatandirumahlanjut .= ', ';
                        }
                        $perawatandirumahlanjut .= 'Fasilitas Kesehatan Terdekat Dari Rumah';
                        if ($resumeMedis[0]->faskesterdekat != null) {
                            $perawatandirumahlanjut .= ' - ' . $resumeMedis[0]->faskesterdekat;
                        }
                    }
                } else {
                    $perawatandirumah = 'Tidak';
                }
                if ($resumeMedis[0]->islaboratoriumya != null && $resumeMedis[0]->islaboratoriumya == true) {
                    $ppp .= 'Laboratorium';
                }
                if ($resumeMedis[0]->isradiologiya != null && $resumeMedis[0]->isradiologiya == true) {
                    if (!empty($ppp)) {
                        $ppp .= ', ';
                    }
                    $ppp .= 'Radiologi';
                }
                if ($resumeMedis[0]->ispemeriksaanpenunjanglainlainya != null && $resumeMedis[0]->ispemeriksaanpenunjanglainlainya == true) {
                    if (!empty($ppp)) {
                        $ppp .= ', ';
                    }
                    $ppp .= 'Lain-lain';
                    if ($resumeMedis[0]->pemeriksaanpenunjanglainlain != null) {
                        $ppp .= ' - ' . $resumeMedis[0]->pemeriksaanpenunjanglainlain;
                    }
                }
                if ($resumeMedis[0]->ispenyakitya != null && $resumeMedis[0]->ispenyakitya == true) {
                    $kebutuhanedukasi .= 'Penyakit';
                }
                if ($resumeMedis[0]->isefeksampingobatya != null && $resumeMedis[0]->isefeksampingobatya == true) {
                    if (!empty($kebutuhanedukasi)) {
                        $kebutuhanedukasi .= ', ';
                    }
                    $kebutuhanedukasi .= 'Obat dan Efek Samping Obat';
                }
                if ($resumeMedis[0]->isdietya != null && $resumeMedis[0]->isdietya == true) {
                    if (!empty($kebutuhanedukasi)) {
                        $kebutuhanedukasi .= ', ';
                    }
                    $kebutuhanedukasi .= 'Diet';
                }
                if ($resumeMedis[0]->isaktifitasistirahatya != null && $resumeMedis[0]->isaktifitasistirahatya == true) {
                    if (!empty($kebutuhanedukasi)) {
                        $kebutuhanedukasi .= ', ';
                    }
                    $kebutuhanedukasi .= 'Aktifitas dan Istirahat Dirumah';
                }
                if ($resumeMedis[0]->ishygieneya != null && $resumeMedis[0]->ishygieneya == true) {
                    if (!empty($kebutuhanedukasi)) {
                        $kebutuhanedukasi .= ', ';
                    }
                    $kebutuhanedukasi .= 'Hygiene';
                }
                if ($resumeMedis[0]->isperawatanlukadirumahya != null && $resumeMedis[0]->isperawatanlukadirumahya == true) {
                    if (!empty($kebutuhanedukasi)) {
                        $kebutuhanedukasi .= ', ';
                    }
                    $kebutuhanedukasi .= 'Perawatan Luka Dirumah';
                }
                if ($resumeMedis[0]->isnyeriya != null && $resumeMedis[0]->isnyeriya == true) {
                    if (!empty($kebutuhanedukasi)) {
                        $kebutuhanedukasi .= ', ';
                    }
                    $kebutuhanedukasi .= 'Nyeri';
                }
                if ($resumeMedis[0]->isperawatanibubayiya != null && $resumeMedis[0]->isperawatanibubayiya == true) {
                    if (!empty($kebutuhanedukasi)) {
                        $kebutuhanedukasi .= ', ';
                    }
                    $kebutuhanedukasi .= 'Perawatan Ibu dan Bayi';
                }
                if ($resumeMedis[0]->ispertolonganmendesakya != null && $resumeMedis[0]->ispertolonganmendesakya == true) {
                    if (!empty($kebutuhanedukasi)) {
                        $kebutuhanedukasi .= ', ';
                    }
                    $kebutuhanedukasi .= 'Pertolongan Mendesak';
                    if ($resumeMedis[0]->pertolonganmendesak != null) {
                        $kebutuhanedukasi .= ' - ' . $resumeMedis[0]->pertolonganmendesak;
                    }
                }
                if ($resumeMedis[0]->iskebutuhanedukasilainlainya != null && $resumeMedis[0]->iskebutuhanedukasilainlainya == true) {
                    if (!empty($kebutuhanedukasi)) {
                        $kebutuhanedukasi .= ', ';
                    }
                    $kebutuhanedukasi .= 'Lain-lain';
                    if ($resumeMedis[0]->kebutuhanedukasilainlain != null) {
                        $kebutuhanedukasi .= ' - ' . $resumeMedis[0]->kebutuhanedukasilainlain;
                    }
                }
                $adaresume = 'true';
                $namaruanganresume = $resumeMedis[0]->namaruangan;
                $tglmasukresume = $resumeMedis[0]->tglmasuk;
                $tglkeluarresume = $resumeMedis[0]->tglkeluar;
                $keluhanutamaRM = $resumeMedis[0]->keluhanutama;
                $diagdok = $resumeMedis[0]->diagdok;
                $diagsek = $resumeMedis[0]->diagsek;
                $alergiresume = $resumeMedis[0]->alergi;
                $keadaanumumresume = $resumeMedis[0]->keadaanumum;
                $pfnadi = $resumeMedis[0]->pfnadi;
                $pfspo = $resumeMedis[0]->pfspo;
                $pfbb = $resumeMedis[0]->pfbb;
                $pftb = $resumeMedis[0]->pftb;
                $pfe = $resumeMedis[0]->pfe;
                $pfm = $resumeMedis[0]->pfm;
                $pfv = $resumeMedis[0]->pfv;
                $tindakanrm = $resumeMedis[0]->tindakanrm;
                $isreaksiobat = $isreaksiobat;
                $listReaksiObat = $listRO;
                $kondisiwaktukeluar = $resumeMedis[0]->kondisiwaktukeluar;
                $carapulang = $resumeMedis[0]->carapulang;
                $ku = $resumeMedis[0]->ku;
                $kesadaranpulang = $resumeMedis[0]->kesadaranpulang;
                $tekanandarahpulang = $resumeMedis[0]->tekanandarah;
                $suhupulang = $resumeMedis[0]->suhupulang;
                $pernafasanpulang = $resumeMedis[0]->pernafasanpulang;
                $nadipulang = $resumeMedis[0]->nadipulang;
                $msp = $msp;
                $ab = $ab;
                $akyt = $akyt;
                $perawatandirumah = $perawatandirumah;
                $perawatandirumahlanjut = $perawatandirumahlanjut;
                $ppp = $ppp;
                $kebutuhanedukasi = $kebutuhanedukasi;
                $kesadaranresume = $resumeMedis[0]->kesadaran;
                $indikasirawatinap = $resumeMedis[0]->indikasirawatinap;
                $denyutjantung = $resumeMedis[0]->denyutjantung;
                $pernapasanresume = $resumeMedis[0]->pernapasan;
                $systole = $resumeMedis[0]->systole;
                $diastole = $resumeMedis[0]->diastole;
                $suhuresume = $resumeMedis[0]->suhu;
                $diet = $resumeMedis[0]->diet;
                $keterangandiet = $resumeMedis[0]->keterangandiet;
                $prognosis = $resumeMedis[0]->prognosis;
                $edukasi = $resumeMedis[0]->edukasi;
                $rencanatindaklanjut = $resumeMedis[0]->rencanatindaklanjut;
                $kontrol = $resumeMedis[0]->kontrol;
                $keteranganresume = $resumeMedis[0]->keteranganlainnya;
                $temuanpenting = $resumeMedis[0]->temuanpenting;
                $hasilkonsultasi = $resumeMedis[0]->hasilkonsultasi;
                if ($dataPasien[0]->objectdepartemenfk == 16) {
                    $tglkontrolpoli = $resumeMedis[0]->tglkontrol;
                } else {
                    $tglkontrolpoli = $resumeMedis[0]->tglkontrol;
                }
                $keadaandarurat2 = $resumeMedis[0]->keadaandarurat2;
                $sarantransportasi = $resumeMedis[0]->sarantransportasi;
                if ($dataPasien[0]->objectdepartemenfk == 16) {
                    $kondisimeninggalkan = $resumeMedis[0]->kondisiwaktukeluar;
                } else {
                    $kondisimeninggalkan = $resumeMedis[0]->kondisimeninggalkan;
                }
                $pasienkeluarga = $resumeMedis[0]->pasienkeluarga;
                if ($resumeMedis[0]->namadokter == null || $resumeMedis[0]->namadokter == "") {
                    $namadokter = 'Data DPJP Tidak tersedia';
                } else {
                    $namadokter = $resumeMedis[0]->namadokter;
                }
                if ($resumeMedis[0]->pasienkeluarga == null || $resumeMedis[0]->pasienkeluarga == "") {
                    $namapasienrm = 'Data Nama Pasien Tidak tersedia';
                } else {
                    $namapasienrm = $resumeMedis[0]->pasienkeluarga;
                }
                if ($resumeMedis[0]->pemeriksaanfisik == null) {
                    $pemeriksaanfisik = $resumeMedis[0]->pemeriksaandisik;
                } else {
                    $pemeriksaanfisik = $resumeMedis[0]->pemeriksaanfisik;
                }
                if ($resumeMedis[0]->pengobatan == null) {
                    $pengobatan = $resumeMedis[0]->pengobatan;
                } else {
                    $pengobatan = $resumeMedis[0]->pengobatan;
                }
                $ringkasanriwayatpenyakit = $resumeMedis[0]->ringkasanriwayatpenyakit;
                $alasanrawat = $resumeMedis[0]->alasanrawat;
                // $qrCoderesume = new QrCode('"' . $namadokter . '"');
                // header('Contert-Type: application/' . $qrCoderesume->getContentType());
                // $qrdpjpresume = $qrCoderesume->writeDataUri();
                // $qrCoderesumep = new QrCode('"' . $namapasienrm . '"');
                // header('Contert-Type: application/' . $qrCoderesumep->getContentType());
                // $qrpasienrm = $qrCoderesumep->writeDataUri();

                $qrCoderesumep = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-pasien?nocm=" . $dataPasien[0]->nocm);
                echo "</br>";
                header('Contert-Type: application/' . $qrCoderesumep->getContentType());
                $qrpasienrm = $qrCoderesumep->writeDataUri();

                $qrCoderesume = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $namadokter);
                echo "</br>";
                header('Contert-Type: application/' . $qrCoderesume->getContentType());
                $qrdpjpresume = $qrCoderesume->writeDataUri();

                // $qrCoderesume = new QrCode("http://rsudmariawm.com/service/medifirst2000/report/cetak-ttd-new?idPegawai=" . $resumeMedis[0]->pegawaifk);
                // echo "</br>";
                // header('Contert-Type: application/' . $qrCoderesume->getContentType());
                // $qrdpjpresume = $qrCoderesume->writeDataUri();
                // $noedukasiresume = 0;
                // $edukasiresume = \DB::table('tempedukasipasien_t as tep')
                //     ->join('pegawai_m as pg', 'pg.id', '=', 'tep.pemberiedukasi')
                //     ->select('tep.norec','tep.noregistrasifk', 'tep.tgljamedukasi', 'tep.materiedukasi', 'tep.kodeleaflet', 'tep.lamaedukasi', 'tep.hasilverifikasi', 'tep.tglredukasi', 'pg.namalengkap', 'tep.pasienkeluarga', 'tep.tglinput')
                //     ->where('tep.noregistrasifk', $request['norec'])
                //     ->OrderBy('tep.tglinput','desc')
                //     ->get();
                // foreach ($edukasiresume as $ed) {
                //     $noedukasiresume += 1;
                //     $edukasi = $edukasi . $noedukasiresume . ". " . $ed->materiedukasi . " \n";
                // }
                //matikan sementara
                // $detailResumeMedis = \DB::table('tempresumerj_t as tr')
                // ->leftjoin('produk_m as pr', 'pr.id', '=', 'tr.objectprodukfk')
                // ->select('tglpelayanan', 'pr.namaproduk', 'jenispenunjang', 'pr.id', 'frekuensi', 'pr.objectkelompokprodukbpjsfk','hasilpenunjang', 'detailpemeriksaan', 'flaglab', 'objectprodukfk')
                // ->where('resumemedisfk', $resumeMedis[0]->norec)
                // // ->where('objectprodukfk', 4056683)
                // // ->where('jenispenunjang', 'LAB')
                // // ->distinct()
                // ->orderBy('jenispenunjang', 'asc', 'pr.id', 'asc', 'tglpelayanan', 'asc')
                // ->get();
                // return($detailResumeMedis);
                // die();
                $dataObatPulangResume = \DB::table('resumemedis_t as rm')
                    ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'rm.noregistrasifk')
                    ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                    ->leftjoin('tempresumerj_t as tj', 'tj.resumemedisfk', '=', 'rm.norec')
                    ->leftjoin('produk_m as pr', 'pr.id', '=', 'tj.objectprodukfk')
                    ->where('tj.statusenabled', true)
                    ->where('pd.noregistrasi', $noregistrasi)
                    ->where('tj.jenispenunjang', '=', 'OBATPULANG')
                    ->select('pr.namaproduk', 'tj.jenispenunjang', 'tj.qty', 'tj.frekuensi', 'tj.namadiagnosa', 'tj.kddiagnosa', 'tj.flaglab', 'tj.hasilpenunjang')
                    ->distinct()
                    ->OrderBy('tj.jenispenunjang')
                    ->get();
                if (count($dataObatPulangResume) > 0) {
                    foreach ($dataObatPulangResume as $op) {
                        $namaproduk = isset($op->namaproduk) ? $op->namaproduk : 'Nama Produk Tidak Ditemukan';
                        $frekuensi = isset($op->frekuensi) ? $op->frekuensi : '';

                        $obatPulang .= $nourutobatpulang . ". " . $namaproduk . " " . $frekuensi . "\n";
                        $nourutobatpulang++;
                    }
                }
                $dataObatResume = \DB::table('resumemedis_t as rm')
                    ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'rm.noregistrasifk')
                    ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                    ->leftjoin('tempresumerj_t as tj', 'tj.resumemedisfk', '=', 'rm.norec')
                    ->leftjoin('produk_m as pr', 'pr.id', '=', 'tj.objectprodukfk')
                    ->where('tj.statusenabled', true)
                    ->where('pd.noregistrasi', $noregistrasi)
                    ->whereIn('tj.jenispenunjang', ['OBAT', 'OBATPULANG'])
                    ->select('pr.namaproduk', 'tj.jenispenunjang', 'tj.qty', 'tj.frekuensi', 'tj.namadiagnosa', 'tj.kddiagnosa', 'tj.flaglab', 'tj.hasilpenunjang')
                    ->distinct()
                    ->OrderBy('tj.jenispenunjang')
                    ->get();
                if (count($dataObatResume) > 0) {
                    foreach ($dataObatResume as $ob) {
                        $namaproduk = isset($ob->namaproduk) ? $ob->namaproduk : 'Nama Produk Tidak Ditemukan';
                        $frekuensi = isset($ob->frekuensi) ? $ob->frekuensi : '';

                        $obatResume .= $nourutobat . ". " . $namaproduk . " " . $frekuensi . "\n";
                        $nourutobat++;
                    }
                }
                $detailResumeMedis = DB::select(DB::raw("
                    SELECT 
                        ROW_NUMBER() OVER (PARTITION BY noregistrasi ORDER BY jenisproduk, namaproduk) AS rownum,
                        *,
                        tglpelayanan AS tglpelayananx
                    FROM
                        temp_billing_t 
                    WHERE
                        noregistrasi = '$noregistrasi' 
                        AND tglpelayanan IS NOT NULL 
                        AND namaproduk NOT IN ('Biaya Administrasi', 'Biaya Materai')
                    ORDER BY
                        jenisproduk, ruangantindakan, namaproduk;
                    "));
                $tampungtindakanlab = '';
                $tampungtindakanpa = '';
                $tampungtindakanrad = '';
                if (count($detailResumeMedis) > 0) {
                    foreach ($detailResumeMedis as $drm) {
                        if ($drm->jenisproduk == "Laboratorium") {
                            if ($tampungtindakanlab != $drm->namaproduk) {
                                $tampungtindakanlab = $drm->namaproduk;
                                $tindakanlab = $tindakanlab . "- " . $drm->namaproduk . " \n";
                            }
                            // matikan sementara
                            // if($drm->namaproduk == "Gambaran Darah Tepi") {
                            //     $kalimat = $drm->hasilpenunjang;
                            //     $panjang = strlen($drm->hasilpenunjang);
                            //     $temukan = strpos($kalimat, "KESAN");
                            //     if ($temukan < 0) {
                            //         $temukan = strpos($kalimat, "KESAN");
                            //     }
                            //     $filter = substr($kalimat, $temukan, $panjang);
                            //     $tampungbaruuuuu =  $tampungbaruuuuu . $filter;
                            // } else {
                            //     if ($drm->hasilpenunjang != null) {
                            //         if ($drm->flaglab == 'Y' || $drm->flaglab == 'K') {
                            //             $tampungbaruuuuu = $tampungbaruuuuu . $drm->detailpemeriksaan . ":" . $drm->hasilpenunjang . " / ";
                            //         }
                            //     }
                            // }
                            //
                            // } else if ($drm->jenispenunjang == "LABPA" || $drm->jenispenunjang == "LABORATORIUM PATALOGI ANATOMI") {
                            //     if ($tampungtindakanpa != $drm->namaproduk) {
                            //         $tampungtindakanpa = $drm->namaproduk;
                            //         $tindakanpa = $tindakanpa . "- " . $drm->namaproduk . " \n";
                            //     }
                            //     $kalimat = $drm->hasilpenunjang;
                            //     $panjang = strlen($drm->hasilpenunjang);
                            //     $temukan = strpos($kalimat, "KESIMPULAN");
                            //     if ($temukan < 0) {
                            //         $temukan = strpos($kalimat, "KESIMPULAN");
                            //     }
                            //     $filter = substr($kalimat, $temukan, $panjang);
                            //     $penunjangpa =  $penunjangpa . $filter;
                        } else if ($drm->jenisproduk == "Radiologi") {
                            if ($tampungtindakanrad != $drm->namaproduk) {
                                $tampungtindakanrad = $drm->namaproduk;
                                $tindakanrad = $tindakanrad . "- " . $drm->namaproduk . " \n";
                            }
                            //matikan sementara
                            // $kalimat = $drm->hasilpenunjang;
                            // $panjang = strlen($drm->hasilpenunjang);
                            // $temukan = strpos($kalimat, "Kesan");
                            // if ($temukan < 0) {
                            //     $temukan = strpos($kalimat, "kesan");
                            // }
                            // $filter = substr($kalimat, $temukan, $panjang);
                            // $penunjangrad =  $penunjangrad . $filter;
                        }
                        // else if ($drm->jenisproduk == "Obat") {
                        //     $obatResume = $obatResume . $nourutobat . ". " . $drm->namaproduk;
                        //     $obatResume = $obatResume . "\n";
                        //     $nourutobat = $nourutobat + 1;
                        // }
                        // else if ($drm->jenisproduk == "OBATPULANG") {
                        //     $obatPulang = $obatPulang . $nourutobatpulang . ". " . $drm->namaproduk . $drm->frekuensi;
                        //     $obatPulang = $obatPulang . "\n";
                        //     $nourutobatpulang = $nourutobatpulang + 1;
                        // }
                    }
                    $penunjanglab = $penunjanglab . $tampungbaruuuuu;
                }
                // $obatPulangResume = DB::select(DB::raw("
                // WITH LastResep AS (
                //     SELECT
                //         pr.namaproduk,
                //         CAST(pp.jumlah AS INT) as jumlah,
                //         sr.noresep,
                //         sr.tglresep,
                //         pg.namalengkap,
                //         ru.namaruangan,
                //         pp.produkfk,
                //         pp.aturanpakai,
                //         pp.norec AS norecpp,
                //         DENSE_RANK() OVER (ORDER BY sr.tglresep DESC) AS rownum,
                //         sr.ruanganfk AS depoid,
                //         pp.dosisobat,
                //         wm.waktuminum,
                //         kpb.kelompokprodukbpjs,
                //         pp.isobatpulang
                //     FROM
                //         pasiendaftar_t AS pd
                //         INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
                //         INNER JOIN strukresep_t AS sr ON sr.pasienfk = apd.norec
                //         INNER JOIN pelayananpasien_t AS pp on pp.strukresepfk = sr.norec
                //         INNER JOIN produk_m AS pr on pr.id = pp.produkfk
                //         INNER JOIN pegawai_m AS pg on pg.id = sr.penulisresepfk 
                //         INNER JOIN ruangan_m as ru on ru.id = sr.ruanganfk
                //         LEFT JOIN waktuminum_m AS wm ON wm.id = pp.objectwaktuminumfk
                //         LEFT JOIN kelompokprodukbpjs_m as kpb ON kpb.id = pr.objectkelompokprodukbpjsfk
                //     WHERE
                //         pd.noregistrasi = '$noregistrasi' and pp.isobatpulang = true
                // )

                // SELECT
                //     namaproduk,
                //     jumlah,
                //     noresep,
                //     tglresep,
                //     namalengkap,
                //     namaruangan,
                //     produkfk,
                //     aturanpakai,
                //     norecpp,
                //     depoid,
                //     dosisobat,
                //     waktuminum,
                //     kelompokprodukbpjs,
                //     isobatpulang
                // FROM
                //     LastResep     
                // "));
                // foreach ($obatPulangResume as $oprr) {
                //     $opr = $opr . $oprr->namaproduk
                // }
            }


            $konsul = DB::select(DB::raw("
            select so.keteranganlainnya from strukorder_t as so inner join
            pasiendaftar_t as pd on pd.norec = so.noregistrasifk
            where pd.noregistrasi = '$noregistrasi' and so.objectkelompoktransaksifk = 108 and so.statusenabled = 't'
            "));
            if (count($konsul) > 0) {
                $konsultasi = $konsul[0]->keteranganlainnya;
            }


            //--x---
            $diagnosatindakan = 'Tindakan : ';
            $diagnosa9 = DB::select(DB::raw("
            SELECT 
            dt.kddiagnosatindakan || ' - ' || dt.namadiagnosatindakan AS namadiagnosa,
                    pd.noregistrasi,
                    pd.tglregistrasi,
                    apd.objectruanganfk,
                    ru.namaruangan,
                    apd.norec AS norec_apd,
                    ddt.objectdiagnosatindakanfk,
                    dt.kddiagnosatindakan,
                    dt.namadiagnosatindakan,
                    dtp.norec AS norec_diagnosapasien,
                    ddt.norec AS norec_detaildpasien,
                    dt.*,
                    ddt.keterangantindakan,
                    pg.namalengkap,
                    ddt.tglinputdiagnosa,
                    ddt.jumlah
                FROM 
                    pasiendaftar_t AS pd
                JOIN 
                    antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
                JOIN 
                    ruangan_m AS ru ON ru.id = apd.objectruanganfk
                JOIN 
                    diagnosatindakanpasien_t AS dtp ON dtp.objectpasienfk = apd.norec
                JOIN 
                    detaildiagnosatindakanpasien_t AS ddt ON ddt.objectdiagnosatindakanpasienfk = dtp.norec
                JOIN 
                    diagnosatindakanidrg_m AS dt ON dt.id = ddt.objectdiagnosatindakanfk
                LEFT JOIN 
                    pegawai_m AS pg ON pg.id = ddt.objectpegawaifk
                WHERE 
                    pd.noregistrasi = '$noregistrasi'
                ORDER BY 
                    ddt.tglinputdiagnosa ASC;
            "));
            foreach ($diagnosa9 as $d9) {
                $diagnosatindakan = $diagnosatindakan . $d9->namadiagnosa . "\n";
            }


            //--x---
            $diagnosa10 = DB::select(DB::raw("
            SELECT
            dg.kddiagnosa || ' - ' || dg.namadiagnosa AS namadiagnosakd,
                    dg.ID,
                    pd.noregistrasi,
                    pd.tglregistrasi,
                    apd.objectruanganfk,
                    ru.namaruangan,
                    apd.norec AS norec_apd,
                    ddp.objectdiagnosafk,
                    dg.kddiagnosa,
                    dg.namadiagnosa,
                    ddp.objectjenisdiagnosafk,
                    jd.jenisdiagnosa,
                    dp.norec AS norec_diagnosapasien,
                    ddp.norec AS norec_detaildpasien,
                    dp.ketdiagnosis,
                    ddp.keterangan,
                    ddp.tglinputdiagnosa,
                    apd.tglkeluar 
                FROM
                    pasiendaftar_t AS pd
                    JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
                    JOIN ruangan_m AS ru ON ru.ID = apd.objectruanganfk
                    LEFT JOIN diagnosapasien_t AS dp ON dp.noregistrasifk = apd.norec
                    LEFT JOIN detaildiagnosapasien_t AS ddp ON ddp.objectdiagnosapasienfk = dp.norec
                    LEFT JOIN diagnosa_m AS dg ON dg.ID = ddp.objectdiagnosafk
                    LEFT JOIN jenisdiagnosa_m AS jd ON jd.ID = ddp.objectjenisdiagnosafk 
                WHERE
                    ru.objectdepartemenfk IN ( 18, 16, 24, 28, 73, 74 ) 
                    AND pd.noregistrasi = '$noregistrasi' 
                ORDER BY
                    jd.jenisdiagnosa ASC;
            "));


            foreach ($diagnosa10 as $dg) {
                if ($dg->jenisdiagnosa == 'Primary') {
                    $diagnosautama = $diagnosautama . $dg->namadiagnosakd . "\n";
                } else if ($dg->jenisdiagnosa == 'Diagnosa Awal') {
                    $diagnosaawal = $diagnosaawal . $dg->namadiagnosakd . "\n";
                } else {
                    $diagnosasekunder = $diagnosasekunder . $dg->namadiagnosakd . "\n";
                }
            }
        }

        if ($diagnosaawal == 'Diagnosis Awal : ') {
            $diagnosaawal = '';
        }
        if ($diagnosasekunder == 'Diagnosis Sekunder : ') {
            $diagnosasekunder = '';
        }
        if ($diagnosautama == 'Diagnosis Primer / Utama : ') {
            $diagnosautama = '';
        }
        //--------------------kemenkes--------------------------------------------
        $dataPasienKemenkes = [];
        if ($xcetakkemenkes == 1) {
            $dataPasienKemenkes = DB::select(DB::raw("
                WITH CTE AS (
                SELECT
                sp.namaexternal as carapulang,
                jk.jeniskelamin,
                EXTRACT(YEAR FROM AGE(ps.tgllahir)) AS umurtahun,
                EXTRACT(day FROM (NOW() - ps.tgllahir)) as umurhari,
                DATE_PART('day', pd.tglpulang::timestamp - pd.tglregistrasi::timestamp) + 1 AS los,
                    cmi.namaexternal AS caramasuk,
                    pd.norec AS noregistrasifk,
                    pas.nosep,
                    hg.cbgcode,
                    pd.noregistrasi,
                    kls2.namakelas AS namakelas,
                    TO_CHAR(ps.tgllahir, 'DD/MM/YYYY') AS tgllahir,
                    pg.namalengkap AS namadokter,
                    pd.objectstatuspulangfk,
                    pd.objectruanganlastfk,
                    pd.nocmfk,
                    pd.beratbayi,
                    pv.jmljam,
                    pv.mulai,
                    pv.selesai,
                    pv.norec AS norecpv,
                    dbb.beratbadan,
                    dbb.appearance,
                    dbb.appearance2,
                    dbb.pulse,
                    dbb.pulse2,
                    dbb.grimace,
                    dbb.grimace2,
                    dbb.activity,
                    dbb.activity2,
                    dbb.respiration,
                    dbb.respiration2,
                    dbb.kantongdarah,
                    dbb.dializer,
                    hg.cbgdescription,
                    ps.nocm,
                    ps.namapasien,
                    ps.objectjeniskelaminfk,
                    kls2.nourut AS nokelasdijamin,
                    ps.noidentitas,
                    pd.caramasukinacbgfk,
                    cmi.kodeexternal AS kodecaramasuk,
                    pd.sistoleinacbg,
                    pd.diastoleinacbg,
                    nki.nama AS namanaikkelas,
                    TO_CHAR(pd.tglregistrasi, 'DD/MM/YYYY') AS tglmasuk,
                    ps.nobpjs AS nokepesertaan,
                    TO_CHAR(pd.tglpulang, 'DD/MM/YYYY') AS tglpulang,
                    CASE 
                        WHEN pd.objectkelompokpasienlastfk = 2 THEN 'JKN' 
                        ELSE 'Belum Dimapping' 
                    END AS jaminan,
                    CASE 
                        WHEN pd.objectkelompokpasienlastfk = 2 THEN '3' 
                        ELSE 'Belum Dimapping' 
                    END AS kodejaminan,
                    CASE 
                        WHEN ru.objectdepartemenfk = 18 THEN 'Rawat Jalan' 
                        WHEN ru.objectdepartemenfk = 16 THEN 'Rawat Inap' 
                        ELSE 'Rawat Jalan' 
                    END AS tipe,
                    CASE 
                        WHEN pas.polirujukankode = 'RJ' AND ru.objectdepartemenfk = 16 THEN '2' 
                        WHEN pas.polirujukankode <> 'RJ' AND ru.objectdepartemenfk = 16 THEN '1' 
                        ELSE '2' 
                    END AS jenisrawat,
                    hg.status AS statusgrouping,
                    COALESCE(hg.totalpiutangpenjamin, 0) AS totalpiutangpenjamin,
                    hg.biayanaikkelas,
										ROW_NUMBER() OVER (PARTITION BY pd.norec) AS row_num
                FROM pasiendaftar_t AS pd
                JOIN pemakaianasuransi_t AS pas ON pas.noregistrasifk = pd.norec
                LEFT JOIN batalregistrasi_t AS br ON br.pasiendaftarfk = pd.norec
                LEFT JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                LEFT JOIN rekanan_m AS rk ON rk.id = pd.objectrekananfk
                JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                LEFT JOIN departemen_m AS dept ON dept.id = ru.objectdepartemenfk
                LEFT JOIN hasilgrouping_t AS hg ON hg.noregistrasifk = pd.norec
                LEFT JOIN asuransipasien_m AS asu ON asu.id = pas.objectasuransipasienfk
                LEFT JOIN kelas_m AS kls ON kls.id = pd.objectkelasfk
                LEFT JOIN kelas_m AS kls2 ON kls2.id = asu.objectkelasdijaminfk
                LEFT JOIN pegawai_m AS pg ON pg.id = pd.objectpegawaifk
                LEFT JOIN diagnosaberatbadanbayi_t AS dbb ON dbb.noregistrasifk = pd.norec
                LEFT JOIN pemakaianventilator_t AS pv ON pv.norecpd = pd.norec
                LEFT JOIN naikkelasinacbg_m AS nki ON nki.id = pd.upgradeclasspayorinacbg
                LEFT JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec AND apd.objectruanganfk = pd.objectruanganlastfk
                LEFT JOIN asalrujukan_m AS ar ON ar.id = apd.objectasalrujukanfk
                LEFT JOIN caramasukinacbg_m AS cmi ON cmi.asalrujukanfk = ar.id
                LEFT JOIN jeniskelamin_m AS jk ON jk.id = ps.objectjeniskelaminfk
                LEFT JOIN statuspulang_m AS sp on sp.id = pd.objectstatuspulangfk
                WHERE br.norec IS NULL
                AND pd.objectrekananfk <> '5906'
                AND pd.tglpulang IS NOT NULL
                AND pd.noregistrasi = '$noregistrasi'
                ) SELECT
                carapulang,
                jeniskelamin,
                umurtahun,
                umurhari,
                los,
                    caramasuk,
                    noregistrasifk,
                    nosep,
                    cbgcode,
                    noregistrasi,
                    namakelas,
                    tgllahir,
                    namadokter,
                    objectstatuspulangfk,
                    objectruanganlastfk,
                    nocmfk,
                    beratbayi,
                    jmljam,
                    mulai,
                    selesai,
                    norecpv,
                    beratbadan,
                    appearance,
                    appearance2,
                    pulse,
                    pulse2,
                    grimace,
                    grimace2,
                    activity,
                    activity2,
                    respiration,
                    respiration2,
                    kantongdarah,
                    dializer,
                    cbgdescription,
                    nocm,
                    namapasien,
                    objectjeniskelaminfk,
                    nokelasdijamin,
                    noidentitas,
                    caramasukinacbgfk,
                    caramasuk,
                    kodecaramasuk,
                    sistoleinacbg,
                    diastoleinacbg,
                    namanaikkelas,
                    tglmasuk,
                    nokepesertaan,
                    tglpulang,
                    jaminan,
                    kodejaminan,
                    tipe,
                    jenisrawat,
                    statusgrouping,
                    totalpiutangpenjamin,
                    biayanaikkelas
                    FROM
                        CTE
                    WHERE
                        row_num = 1
                    "));

            // $dataIcd10Pasien = DB::select(DB::raw("
            //     SELECT
            //         dg.ID,
            //         pd.noregistrasi,
            //         pd.tglregistrasi,
            //         apd.objectruanganfk,
            //         ru.namaruangan,
            //         apd.norec AS norec_apd,
            //         ddp.objectdiagnosafk,
            //         dg.kddiagnosa,
            //         dg.namadiagnosa,
            //         ddp.objectjenisdiagnosafk,
            //         jd.jenisdiagnosa,
            //         dp.norec AS norec_diagnosapasien,
            //         ddp.norec AS norec_detaildpasien,
            //         dp.ketdiagnosis,
            //         ddp.keterangan,
            //         ddp.tglinputdiagnosa,
            //         apd.tglkeluar 
            //     FROM
            //         pasiendaftar_t AS pd
            //         JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
            //         JOIN ruangan_m AS ru ON ru.ID = apd.objectruanganfk
            //         LEFT JOIN diagnosapasien_t AS dp ON dp.noregistrasifk = apd.norec
            //         LEFT JOIN detaildiagnosapasien_t AS ddp ON ddp.objectdiagnosapasienfk = dp.norec
            //         LEFT JOIN diagnosa_m AS dg ON dg.ID = ddp.objectdiagnosafk
            //         LEFT JOIN jenisdiagnosa_m AS jd ON jd.ID = ddp.objectjenisdiagnosafk 
            //     WHERE
            //         ru.objectdepartemenfk IN ( 18, 16, 24, 28, 73, 74 ) 
            //         AND pd.noregistrasi = '$noregistrasi' 
            //     ORDER BY
            //         jd.jenisdiagnosa ASC;
            // "));
            $dataIcd10Pasien = \DB::table('pasiendaftar_t as pd')
                ->select(
                    'dg.id',
                    'pd.noregistrasi',
                    'pd.tglregistrasi',
                    'apd.objectruanganfk',
                    'ru.namaruangan',
                    'apd.norec as norec_apd',
                    'ddp.objectdiagnosafk',
                    'dg.kddiagnosa',
                    'dg.namadiagnosa',
                    'ddp.objectjenisdiagnosafk',
                    'jd.jenisdiagnosa',
                    'dp.norec as norec_diagnosapasien',
                    'ddp.norec as norec_detaildpasien',
                    'dp.ketdiagnosis',
                    'ddp.keterangan',
                    'ddp.tglinputdiagnosa',
                    'apd.tglkeluar'
                )
                ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
                ->join('diagnosapasien_t as dp', 'dp.noregistrasifk', '=', 'apd.norec')
                ->join('detaildiagnosapasien_t as ddp', 'ddp.objectdiagnosapasienfk', '=', 'dp.norec')
                ->join('diagnosa_m as dg', 'dg.id', '=', 'ddp.objectdiagnosafk')
                ->join('jenisdiagnosa_m as jd', 'jd.id', '=', 'ddp.objectjenisdiagnosafk')
                ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'ddp.objectpegawaifk')
                ->whereIn('ru.objectdepartemenfk', [18, 16, 24, 28, 73, 74])
                ->where('pd.noregistrasi', $noregistrasi)
                ->orderBy('jd.jenisdiagnosa', 'asc');

            $dataIcd10Pasien = $dataIcd10Pasien->get();
            $icd10primary = '';
            $icd10secondary = [];
            foreach ($dataIcd10Pasien as $diagnosa) {
                if ($diagnosa->objectjenisdiagnosafk == 1) {
                    $icd10primary = $diagnosa->kddiagnosa . ' ' . $diagnosa->namadiagnosa;
                } elseif ($diagnosa->objectjenisdiagnosafk == 2) {
                    $icd10secondary[] = $diagnosa->kddiagnosa . ' ' . $diagnosa->namadiagnosa;
                }
            }

            // =======================================
            // AMBIL INACBG DIAGNOSA
            // =======================================
            $inacbgDiagnosaRaw = DB::table('pasiendaftar_t')
                ->select('inacbg_diagnosa_set_request')
                ->where('noregistrasi', $noregistrasi)
                ->first();

            $icd10primary_inacbg = '';
            $icd10secondary_inacbg = [];

            if ($inacbgDiagnosaRaw && $inacbgDiagnosaRaw->inacbg_diagnosa_set_request) {
                $decoded = json_decode($inacbgDiagnosaRaw->inacbg_diagnosa_set_request, true);

                // --- CASE 1: Format expanded (baru)
                if (isset($decoded['data']['expanded']) && is_array($decoded['data']['expanded'])) {
                    foreach ($decoded['data']['expanded'] as $item) {
                        if (!isset($item['no'], $item['code'])) continue;

                        $code = $item['code'];
                        $diagnosa = DB::table('diagnosa_m')->where('kddiagnosa', $code)->first();
                        $nama = $diagnosa ? $diagnosa->namadiagnosa : '';

                        if ($item['no'] === '1') {
                            $icd10primary_inacbg = $code . ' - ' . $nama;
                        } else {
                            $icd10secondary_inacbg[] = $code . ' - ' . $nama;
                        }
                    }
                }

                // --- CASE 2: Format diagnosa string (contoh: "Z49.1#N18.5")
                elseif (isset($decoded['data']['diagnosa'])) {
                    $diagnosaString = $decoded['data']['diagnosa'];
                    $codes = explode('#', $diagnosaString);

                    foreach ($codes as $index => $code) {
                        $code = trim($code);
                        if ($code === '') continue;

                        $diagnosa = DB::table('diagnosa_m')->where('kddiagnosa', $code)->first();
                        $nama = $diagnosa ? $diagnosa->namadiagnosa : '';

                        if ($index === 0) {
                            $icd10primary_inacbg = $code . ' - ' . $nama;
                        } else {
                            $icd10secondary_inacbg[] = $code . ' - ' . $nama;
                        }
                    }
                }
            }

            // =======================================
            // AMBIL INACBG PROCEDURE
            // =======================================
            $inacbgProcedureRaw = DB::table('pasiendaftar_t')
                ->select('inacbg_procedure_set_request')
                ->where('noregistrasi', $noregistrasi)
                ->first();

            $icd9_inacbg = [];

            if ($inacbgProcedureRaw && $inacbgProcedureRaw->inacbg_procedure_set_request) {
                $decodedProc = json_decode($inacbgProcedureRaw->inacbg_procedure_set_request, true);

                // --- CASE 1: Format expanded
                if (isset($decodedProc['data']['expanded']) && is_array($decodedProc['data']['expanded'])) {
                    foreach ($decodedProc['data']['expanded'] as $item) {
                        if (!isset($item['code'])) continue;

                        $code = $item['code'];
                        $tindakan = DB::table('diagnosatindakan_m')->where('kddiagnosatindakan', $code)->first();
                        $nama = $tindakan ? $tindakan->namadiagnosatindakan : '';

                        $icd9_inacbg[] = $code . ' - ' . $nama;
                    }
                }

                // --- CASE 2: Format procedure string (contoh: "96.04#99.15")
                elseif (isset($decodedProc['data']['procedure'])) {
                    $procedureString = $decodedProc['data']['procedure'];
                    $codes = explode('#', $procedureString);

                    foreach ($codes as $code) {
                        $code = trim($code);
                        if ($code === '') continue;

                        $tindakan = DB::table('diagnosatindakan_m')->where('kddiagnosatindakan', $code)->first();
                        $nama = $tindakan ? $tindakan->namadiagnosatindakan : '';

                        $icd9_inacbg[] = $code . ' - ' . $nama;
                    }
                }
            }

            $dataIcd9Pasien = DB::select(DB::raw("
                SELECT 
                    pd.noregistrasi,
                    pd.tglregistrasi,
                    apd.objectruanganfk,
                    ru.namaruangan,
                    apd.norec AS norec_apd,
                    ddt.objectdiagnosatindakanfk,
                    dt.kddiagnosatindakan,
                    dt.namadiagnosatindakan,
                    dtp.norec AS norec_diagnosapasien,
                    ddt.norec AS norec_detaildpasien,
                    dt.*,
                    ddt.keterangantindakan,
                    pg.namalengkap,
                    ddt.tglinputdiagnosa,
                    ddt.jumlah
                FROM 
                    pasiendaftar_t AS pd
                JOIN 
                    antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
                JOIN 
                    ruangan_m AS ru ON ru.id = apd.objectruanganfk
                JOIN 
                    diagnosatindakanpasien_t AS dtp ON dtp.objectpasienfk = apd.norec
                JOIN 
                    detaildiagnosatindakanpasien_t AS ddt ON ddt.objectdiagnosatindakanpasienfk = dtp.norec
                JOIN 
                    diagnosatindakanidrg_m AS dt ON dt.id = ddt.objectdiagnosatindakanfk
                LEFT JOIN 
                    pegawai_m AS pg ON pg.id = ddt.objectpegawaifk
                WHERE 
                    pd.noregistrasi = '$noregistrasi'
                ORDER BY 
                    ddt.tglinputdiagnosa ASC;
            "));
        }

        //---------------------radiologi-------------------------------------------
        $ekspertise = [];
        $idorder = '';
        $umur = '';
        $nokepesertaan = '';
        $nosep = '';
        $ruanganasal = '';
        $namalengkap = '';
        $tanggal = '';
        $tanggalcetak = '';
        $namaproduk = '';
        $keterangan = '';
        $umurrad = '';
        $dokterrad = '';
        $nippns = '';
        $qrdpjpradiologi = '';

        // if ($xcetakrad == 1) {
        //     $ekspertise = collect(DB::select("
        //     SELECT 
        //             pd.noregistrasi,
        //             kps.kelompokpasien,
        //             pg.namalengkap,
        //             pr.namaproduk,
        //             ru.namaruangan as ruanganasal,
        //             ru2.namaruangan,
        //             pa.nosep,
        //             ps.nobpjs,
        //             ps.nocm,
        //         he.*,
        //         pp.norec AS norecpp,
        //         pp.isclaim,
        //         pdk.mintime,
        //         pdk.maxtime
        //     FROM 
        //         hasilexpertise_t AS he
        //     JOIN 
        //         pelayananpasien_t AS pp ON pp.idorderpacs = he.idorder
        //     LEFT JOIN 
        //         antrianpasiendiperiksa_t AS apd ON apd.norec = pp.noregistrasifk
        //             LEFT JOIN pasiendaftar_t as pd on apd.noregistrasifk = pd.norec
        //             left join pasien_m as ps on ps.id = pd.nocmfk
        //             left JOIN pemakaianasuransi_t as pa ON pd.norec = pa.noregistrasifk
        //             LEFT JOIN kelompokpasien_m AS kps ON kps.ID = pd.objectkelompokpasienlastfk
        //             LEFT JOIN ruangan_m AS ru ON ru.ID = pd.objectruanganlastfk
        //             LEFT JOIN ruangan_m AS ru2 ON ru2.ID = apd.objectruanganfk
        //             LEFT JOIN pegawai_m AS pg ON pd.objectpegawaifk = pg.id
        //             LEFT JOIN produk_m AS pr ON pr.ID = pp.produkfk
        //     LEFT JOIN 
        //         produk_m AS pdk ON pdk.id = pp.produkfk
        //     WHERE 
        //         he.statusenabled = TRUE
        //         AND pd.noregistrasi = '$noregistrasi'
        //     "));
        //     if (count($ekspertise) > 0) {
        //         $umurrad = $this->getAge($ekspertise[0]->birthdate, date('Y-m-d'));
        //         $idorder = $ekspertise[0]->idorder;
        //         $umur = $umurrad;
        //         $nokepesertaan = $ekspertise[0]->nobpjs;
        //         $nosep = $ekspertise[0]->nosep;
        //         $ruanganasal = $ekspertise[0]->ruanganasal;
        //         $namalengkap = $ekspertise[0]->name;
        //         $tanggal = $ekspertise[0]->orderdate;
        //         $tanggalcetak = $ekspertise[0]->reportdate;
        //         $namaproduk = $ekspertise[0]->namaproduk;
        //         $keterangan = $ekspertise[0]->description;
        //         $dokterrad = $ekspertise[0]->doctorname;
        //         // $nippns = $ekspertise[0]->nippns;
        //     }
        // }

        if ($xcetakrad == 1) {
            $ekspertise = collect(DB::select("
            WITH CTE AS (SELECT so.tanggalbacaradiologi, so.nofoto as idorder, ps.nocm, ps.namapasien as name, ps.tgllahir,	to_char(ps.tgllahir, 'DD TMMonth YYYY') AS tgllahir2,(kp.kelompokpasien || ' / ' || case when jks.namaexternal is null then '-' else 'Jaminan Khusus   : ' || jks.namaexternal end ) as  kelompokpasien,
            ru.namaruangan, so.tanggal as orderdate,pp.tglpelayanan as tanggal, jk.jeniskelamin as sex, CASE WHEN alm.alamatlengkap IS NULL 
                         THEN '-' ELSE (alm.alamatlengkap || ' ' || ds.namadesakelurahan || ' ' || kc.namakecamatan || ' ' || kk.namakotakabupaten || ' ' || pro.namapropinsi) END AS address, pg.namalengkap AS doctor, 
                         pg2.namalengkap AS doctorname, pr.namaproduk, so.keterangan as description, pd.noregistrasi, pg2.nosip, pg2.id AS pgid, pemakaianasuransi_t.nokepesertaan, pemakaianasuransi_t.nosep, so.tanggalcetak as reportdate, pegawai_m.namalengkap, 
                         ruangan_m.namaruangan AS ruanganasal,pg2.ttd,op.diagnosa,
												 ROW_NUMBER() OVER (PARTITION BY so.norec) AS row_num
            FROM ruangan_m RIGHT OUTER JOIN
             pegawai_m RIGHT OUTER JOIN
             hasilradiologi_t AS so INNER JOIN
             pasiendaftar_t AS pd ON pd.norec = so.noregristrasifk INNER JOIN
             pasien_m AS ps ON ps.id = pd.nocmfk INNER JOIN
             kelompokpasien_m AS kp ON kp.id = pd.objectkelompokpasienlastfk INNER JOIN
             ruangan_m AS ru ON ru.id = pd.objectruanganlastfk INNER JOIN
             pelayananpasien_t AS pp ON pp.norec = so.pelayananpasienfk LEFT OUTER JOIN
             orderpelayanan_t AS op ON op.strukorderfk = pp.strukorderfk INNER JOIN
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
            pd.noregistrasi = '$noregistrasi'
     
            AND so.statusenabled = 'y')
						SELECT
						tanggalbacaradiologi,
						idorder,
						nocm,
						name,
						tgllahir,
						tgllahir2,
						kelompokpasien,
						namaruangan,
						orderdate,
						tanggal,
						sex,
						address,
						doctor,
						doctorname,
						namaproduk,
						description,
						noregistrasi,
						nosip,
						pgid,
						nokepesertaan,
						nosep,
						reportdate,
						namalengkap,
						ruanganasal,
						ttd,
                        diagnosa
						FROM
							CTE
						WHERE
							row_num = 1
            "));
            if (count($ekspertise) > 0) {
                $umurrad = $this->getAge($ekspertise[0]->tgllahir, date('Y-m-d'));
                $idorder = $ekspertise[0]->idorder;
                $umur = $umurrad;
                $nokepesertaan = $ekspertise[0]->nokepesertaan;
                $nosep = $ekspertise[0]->nosep;
                $ruanganasal = $ekspertise[0]->ruanganasal;
                $namalengkap = $ekspertise[0]->name;
                $tanggal = $ekspertise[0]->orderdate;
                $tanggalcetak = $ekspertise[0]->reportdate;
                $namaproduk = $ekspertise[0]->namaproduk;
                $keterangan = $ekspertise[0]->description;
                $dokterrad = $ekspertise[0]->doctorname;
                // $nippns = $ekspertise[0]->nippns;
            }
        }
        // -----------------------------lab----------------------------------
        $validatorlab = '';
        $qrvalidatorlab = '';
        $validatorlabgdt = '';
        $qrvalidatorlabgdt = '';
        if ($xcetaklab == 1) {
            $hasillab = collect(DB::select("
            WITH CTE AS (
                SELECT *,
                       ROW_NUMBER() OVER (PARTITION BY 
                                            tglpelayanan, 
                                            nourutjenispemeriksaan, 
                                            nourutdetail,
                                            ruanganperejuk, 
                                            ruanganperejuk1,
                                            nocm, 
                                            noregistrasi, 
                                            noorder, 
                                            namapasien, 
                                            alamatlengkap, 
                                            namadesakelurahan, 
                                            namakecamatan, 
                                            namakotakabupaten, 
                                            kelompokpasien, 
                                            namarekanan, 
                                            tglregistrasi, 
                                            tglRegiss,
                                            tglawal, 
                                            dokterperiksa, 
                                            dokterperiksaedi, 
                                            tgllahir, 
                                            tglLahirs,
                                            detailjenisproduk, 
                                            namaproduk, 
                                            detailpemeriksaan, 
                                            memohasil, 
                                            satuanstandar, 
                                            nilaitext, 
                                            nilaimin, 
                                            nilaimax, 
                                            hasil, 
                                            jeniskelamin, 
                                            tglverif, 
                                            tglakhir, 
                                            FLAG, 
                                            hasil_s, 
                                            hasil_i, 
                                            catatan, 
                                            jenispemeriksaan,
                                            nourutdetailjenispemeriksaanlab
                                         ORDER BY
                                            nourutdetailjenispemeriksaanlab ASC, 
                                            nourutjenispemeriksaan ASC) AS rn
                FROM (
                    SELECT
                        pp.tglpelayanan,
                        maps.nourutjenispemeriksaan,
                        maps.nourutdetail,
                        rj.namaruangan AS ruanganperejuk,
                        rj2.namaruangan AS ruanganperejuk1,
                        pm.nocm,
                        pd.noregistrasi,
                        so.noorder,
                        pm.namapasien,
                        alm.alamatlengkap,
                        alm.namadesakelurahan,
                        alm.namakecamatan,
                        alm.namakotakabupaten,
                        kp.kelompokpasien,
                        rkn.namarekanan,
                        pd.tglregistrasi,
                        to_char(pd.tglregistrasi, 'MON-DD-YYYY HH12:MIPM'::text) AS tglRegiss,
                        pp.tglpelayanan AS tglawal,
                        pg1.namalengkap AS dokterperiksa,
                        pg2.namalengkap AS dokterperiksaedi,
                        pm.tgllahir,
                        to_char ( pm.tgllahir,  'MON-DD-YYYY HH12:MIPM'::text) AS tglLahirs,
                        djp.detailjenisproduk,
                        prd.namaproduk,
                        maps.detailpemeriksaan,
                        maps.memohasil,
                        CASE
                            WHEN pp.produkfk IN (100061) THEN 'µIU/mL'
                            WHEN pp.produkfk IN (501404) THEN 'pmol/L'
                            ELSE ss.satuanstandar
                        END AS satuanstandar,
                        CASE
                            WHEN pp.produkfk IN (100048, 100070) AND nn.nilaitext = 'Negatif' THEN '< 0,9 Negatif'
                            WHEN pp.produkfk IN (100048, 100070) AND nn.nilaitext = 'Positif' THEN '> 1,1 Positif'
                            WHEN pp.produkfk IN (100048, 100070) AND nn.nilaitext = 'Indeterminate' THEN '> 0,9 COI < 1,1'
                            WHEN pp.produkfk IN (100061) THEN '0,4 - 4,0'
                            WHEN pp.produkfk IN (501404) THEN '9 - 22'
                            ELSE nn.nilaitext
                        END AS nilaitext,
                        nn.nilaimin,
                        nn.nilaimax,
                        hh.hasil,
                        jk.jeniskelamin,
                        apd.tglmasuk AS tglverif,
                        hh.tglhasil AS tglakhir,
                        hh.FLAG,
                        hh.hasil_s,
                        hh.hasil_i,
                        hh.catatan,
                        detailjenisproduk_m.detailjenisproduk as jenispemeriksaan,
                        case when prd.nourutdetailjenispemeriksaanlab is null then 9999 else prd.nourutdetailjenispemeriksaanlab end as nourutdetailjenispemeriksaanlab
                    FROM
                        pelayananpasien_t AS pp
                    INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.norec = pp.noregistrasifk
                    INNER JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk
                    LEFT OUTER JOIN strukorder_t AS so ON so.norec = apd.objectstrukorderfk
                    LEFT OUTER JOIN ruangan_m AS rj ON pd.objectruanganlastfk = rj.ID
                    LEFT OUTER JOIN ruangan_m AS rj2 ON apd.objectruanganasalfk = rj2.ID
                    INNER JOIN pasien_m AS pm ON pm.ID = pd.nocmfk
                    LEFT OUTER JOIN jeniskelamin_m AS jk ON jk.ID = pm.objectjeniskelaminfk
                    LEFT OUTER JOIN alamat_m AS alm ON alm.nocmfk = pm.ID
                    LEFT OUTER JOIN kelompokpasien_m AS kp ON kp.ID = pd.objectkelompokpasienlastfk
                    LEFT OUTER JOIN rekanan_m AS rkn ON rkn.ID = pd.objectrekananfk
                    LEFT OUTER JOIN pegawai_m AS pg ON pg.ID = so.objectpegawaiorderfk
                    LEFT OUTER JOIN pegawai_m AS pg1 ON pg1.ID = apd.objectpegawaifk
                    LEFT OUTER JOIN produk_m AS prd ON prd.ID = pp.produkfk
                    LEFT OUTER JOIN pelayananpasienpetugas_t AS p3 ON pp.norec = p3.pelayananpasien
                    INNER JOIN pegawai_m AS pg2 ON pg2.ID = p3.objectpegawaifk
                    INNER JOIN detailjenisproduk_m AS djp ON djp.ID = prd.objectdetailjenisprodukfk
                    INNER JOIN maphasillab_m AS maps ON maps.produkfk = prd.ID
                    INNER JOIN maphasillabdetail_m AS maps2 ON maps2.maphasilfk = maps.ID
                    AND maps2.kelompokumurfk IN (
                        SELECT
                            ID
                        FROM
                            kelompokumur_m AS kuu
                    )
                    LEFT OUTER JOIN pegawai_m AS pg3 ON pg3.ID = p3.objectpegawaifk
                    AND p3.objectpegawaifk = '4'
                    INNER JOIN nilainormal_m AS nn ON nn.ID = maps2.nilainormalfk
                    LEFT OUTER JOIN satuanstandar_m AS ss ON ss.ID = maps.satuanstandarfk
                    LEFT OUTER JOIN hasillaboratorium_t AS hh ON hh.norecpelayanan = pp.norec
                    AND pp.noregistrasifk = hh.noregistrasifk
                    AND maps.detailpemeriksaan = hh.detailpemeriksaan
                    AND maps.ID = hh.maphasilfk
                    LEFT OUTER JOIN detailjenisproduk_m AS detailjenisproduk_m ON detailjenisproduk_m.id = prd.detailjenispemeriksaanlabfk
                    WHERE apd.noregistrasifk = '$norecpd'
                    AND pg2.objectjenispegawaifk=1 
                    AND hh.hasil IS NOT NULL
                ) AS data
            )
            SELECT * 
            FROM CTE
            WHERE rn = 1
            ORDER BY 
                nourutdetailjenispemeriksaanlab ASC, 
                nourutjenispemeriksaan ASC"));
            // $groupedHasillab = $hasillab->groupBy(function ($item) {
            //     return \Carbon\Carbon::parse($item->tglpelayanan)->format('Y-m-d');
            // })->toArray();
            $groupedHasillab = $hasillab->groupBy(function ($item) {
                return $item->tglpelayanan;
            })->toArray();
            ksort($groupedHasillab);
            if (count($hasillab) > 0) {
                if ($hasillab[0]->dokterperiksaedi != null) {
                    $validatorlab = $hasillab[0]->dokterperiksaedi;
                } else {
                    $validatorlab = 'Data tidak tersedia';
                }
                $qrCodeValidatorLab = new QrCode('"' . $validatorlab . '"');
                header('Contert-Type: application/' . $qrCodeValidatorLab->getContentType());
                $qrvalidatorlab = $qrCodeValidatorLab->writeDataUri();
            }

            // --------------------- gdt lab ---------------------
            $hasillabgdt = collect(DB::select("
            SELECT        ps.nocm, ps.namapasien, to_char( ps.tgllahir, 'YYYY-MM-DD') AS tgllahir, kp.kelompokpasien, ru.namaruangan, so.tanggal, DATE_PART( 'year', now( ) :: TIMESTAMP ) - DATE_PART( 'year', ps.tgllahir :: TIMESTAMP ) AS umur,jk.jeniskelamin, CASE WHEN alm.alamatlengkap IS NULL
                         THEN '-' ELSE (alm.alamatlengkap || ' ' || ds.namadesakelurahan || ' ' || kc.namakecamatan || ' ' || kk.namakotakabupaten || ' ' || pro.namapropinsi) END AS alamatlengkap,
                         CASE WHEN so.dokterperujuk = 1 THEN '-' ELSE pg3.namalengkap END AS dokterperujuk,  pg.namalengkap AS perujuk,
						 CASE WHEN pg2.ID IS NOT NULL
							THEN concat('http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-new?idPegawai=', CAST ( pg2.ID AS VARCHAR ))
							ELSE 'Data Tidak Ditemukan'
						END AS qrdokterrad,
						 pg2.namalengkap AS dokterrad,
						 pr.namaproduk, pd.noregistrasi, so.expertise, so.diagnosaklinik
        FROM            hasilpemeriksaanlab_t AS so INNER JOIN
                         pasiendaftar_t AS pd ON pd.norec = so.noregistrasifk INNER JOIN
                         pasien_m AS ps ON ps.id = pd.nocmfk INNER JOIN
                         kelompokpasien_m AS kp ON kp.id = pd.objectkelompokpasienlastfk INNER JOIN
                         ruangan_m AS ru ON ru.id = pd.objectruanganlastfk INNER JOIN
                         pelayananpasien_t AS pp ON pp.norec = so.pelayananpasienfk INNER JOIN
                         produk_m AS pr ON pr.id = pp.produkfk LEFT OUTER JOIN
                         jeniskelamin_m AS jk ON jk.id = ps.objectjeniskelaminfk LEFT OUTER JOIN
                         kelompokpasien_m AS kps ON kps.id = pd.objectkelompokpasienlastfk LEFT OUTER JOIN
                         alamat_m AS alm ON alm.nocmfk = ps.id LEFT OUTER JOIN
                         desakelurahan_m AS ds ON ds.id = alm.objectdesakelurahanfk LEFT OUTER JOIN
                         kotakabupaten_m AS kk ON kk.id = alm.objectkotakabupatenfk LEFT OUTER JOIN
                         kecamatan_m AS kc ON kc.id = alm.objectkecamatanfk LEFT OUTER JOIN
                         propinsi_m AS pro ON pro.id = alm.objectpropinsifk LEFT OUTER JOIN
                         pegawai_m AS pg ON pg.id = pd.objectpegawaifk LEFT OUTER JOIN
                         pegawai_m AS pg2 ON pg2.id = so.pegawaifk LEFT OUTER JOIN
                         pegawai_m AS pg3 ON pg3.id = so.dokterperujuk
            WHERE        (pd.noregistrasi = '$noregistrasi') AND (so.statusenabled = true)"));
            if (count($hasillabgdt) > 0) {
                if ($hasillabgdt[0]->dokterrad != null) {
                    $validatorlabgdt = $hasillabgdt[0]->dokterrad;
                } else {
                    $validatorlabgdt = 'Data tidak tersedia';
                }
                $qrCodeValidatorLabgdt = new QrCode('"' . $validatorlabgdt . '"');
                header('Contert-Type: application/' . $qrCodeValidatorLabgdt->getContentType());
                $qrvalidatorlabgdt = $qrCodeValidatorLabgdt->writeDataUri();
            }
        }
        //----------------------sep------------------------------------------
        $sep = [];
        $qrCodePSep = '';
        $qrCodePSep2 = '';
        if ($xcetaksep == 1) {
            $sep = DB::select(DB::raw(
                "select '' as cob, pd.objectjenispasienfk, pa.namadjpjpmelayani,pa.polirujukannama as namaruangan,pa.nosep,pa.tanggalsep as tanggalsep,pa.nokepesertaan,pi.nocm,pd.noregistrasi, 
                        pa.norujukan,case when ap.namapeserta != '' then ap.namapeserta || '(' || jk.jeniskelamin || ')' else pi.namapasien || '(' || jk.jeniskelamin || ')' end as namapeserta2,pi.tgllahir,jk.jeniskelamin, 
                        rp.namaruangan as namaruangans,rp.kdinternal as namapolibpjs,pa.ppkrujukan, case when ap.namapeserta != '' then ap.namapeserta else pi.namapasien end as namapeserta,
                        --(CASE WHEN rp.objectdepartemenfk=16 AND pd.objectjenispasienfk=1 OR  rp.objectdepartemenfk=16 AND pd.objectjenispasienfk IS NULL then 'R. Inap' else 'R. Jalan' END) as jenisrawat, 
                        --case when pa.polirujukankode = 'RI' and rp.objectdepartemenfk='16' then 'R. Inap' else 'R. Jalan' end as jenisrawat,
                        case when rp.objectdepartemenfk='16' then 'R. Inap' else 'R. Jalan' end as jenisrawat,
                        dg.kddiagnosa, (case when dg.namadiagnosa is null then '-' else dg.namadiagnosa end) as namadiagnosa , 
                        ap.jenispeserta,ap.kdprovider,ap.nmprovider, pa.catatan, 
                        --(case when rp.objectdepartemenfk=16 then kls2.namakelas else '-' end) as namakelas, 
                        --(case when rp.objectdepartemenfk=16 then kls.namakelas else '-' end) as namakelas, 
                        (case when pa.polirujukankode='RI' then kls2.namakelas else '-' end) as namakelas,
                        (case when pa.polirujukankode='RI' then kls.namakelas else '-' end) as namakelas,
                        kls.namakelas as namakelashak, 
                        ap.notelpmobile,pa.penjaminlaka,
                        (case when pa.penjaminlaka='1' then 'Jasa Raharja PT' 
                        when pa.penjaminlaka='2' then 'BPJS Ketenagakerjaan' 
                        when pa.penjaminlaka='3' then 'TASPEN PT' 
                        when pa.penjaminlaka='4' then 'ASABRI PT' 
                        Else '-' end) as penjaminlakalantas,case when pa.prolanisprb is null then '-' else pa.prolanisprb end as prolanisprb , tp.namaexternal as titlepasien , (kls.namakelas ) as namakelasDitanggung
                        ,case when pa.polirujukannama is null then rp.namaruangan || '(' || rp.kdinternal || ')' else pa.polirujukannama end as namaruanganfix
                        from pemakaianasuransi_t pa 
                        LEFT JOIN asuransipasien_m ap on pa.objectasuransipasienfk= ap.id 
                        LEFT JOIN pasiendaftar_t pd on pd.norec=pa.noregistrasifk 
                        LEFT JOIN pasien_m pi on pi.id=pd.nocmfk 
                        LEFT JOIN jeniskelamin_m jk on jk.id=pi.objectjeniskelaminfk 
                        LEFT JOIN ruangan_m rp on rp.id=pd.objectruanganlastfk 
                        LEFT JOIN diagnosa_m dg on pa.diagnosisfk=dg.id
                        LEFT JOIN kelas_m kls on kls.id=ap.objectkelasdijaminfk 
                        LEFT JOIN kelas_m kls2 on kls2.id=pd.objectkelasfk 
                        LEFT JOIN titlepasien_m tp on pi.objecttitlefk=tp.id 
                        where pd.noregistrasi = '$noregistrasi' 
                            and pa.nosep is not null"
            ));

            $validSep = true;
            $responseSEP = $this->cekSep($sep[0]->nosep);
            // dd($responseSEP);

            if (!isset($responseSEP['metaData']) || $responseSEP['metaData']->code != "200") {
                $validSep = false;
            }

            $qrCodePSep = new QrCode($sep[0]->nokepesertaan);
            echo "</br>";
            header('Contert-Type: application/' . $qrCodePSep->getContentType());
            $qrCodePSep2 = $qrCodePSep->writeDataUri();
        }
        // key 17-07-2024
        // ------------------------Triase IGD-------------------------
        if ($xcetaktriase == 1) {
            $dataTriaseIGD = [];
            $tgl = '';
            $nama = '';
            $noHp = '';
            $transportasi = '';
            $keluhanUtama = '';
            $tekananDarah = '';
            $pernapasan = '';
            $suhu = '';
            $Nadi = '';
            $spo2 = '';
            $kesadaran = '';
            $keadaanUmum = '';
            $beratBadan = '';
            $tinggiBadan = '';
            $e = '';
            $m = '';
            $v = '';
            $ats1 = '';
            $ats2 = '';
            $ats3 = '';
            $ats4 = '';
            $ats5 = '';
            $doa1 = '';
            $airway1 = '';
            $airway2 = '';
            $airway3 = '';
            $airway4 = '';
            $airway5 = '';
            $airwaydoa = '';
            $breathing1 = '';
            $breathing2 = '';
            $breathing3 = '';
            $breathing4 = '';
            $breathing5 = '';
            $breathing66 = '';
            $breathing6 = '';
            $breathing7 = '';
            $breathing8 = '';
            $breathing9 = '';
            $breathing10 = '';
            $circulation1 = '';
            $circulation2 = '';
            $circulation3 = '';
            $circulation4 = '';
            $circulation5 = '';
            $circulation6 = '';
            $circulation7 = '';
            $circulation8 = '';
            $circulation9 = '';
            $circulation100 = '';
            $circulation10 = '';
            $circulation11 = '';
            $circulation12 = '';
            $circulation13 = '';
            $circulation14 = '';
            $circulation15 = '';
            $circulation16 = '';
            $circulation17 = '';
            $circulation18 = '';
            $circulation19 = '';
            $circulation20 = '';
            $disability1 = '';
            $disability2 = '';
            $disability3 = '';
            $disability4 = '';
            $disability5 = '';
            $disability6 = '';
            $disability7 = '';
            $disability8 = '';
            $disability9 = '';
            $disability10 = '';
            $disability11 = '';
            $disability12 = '';
            $gawat1 = '';
            $gawattext2 = '';
            $gawattext3 = '';
            $gawat4 = '';
            $gawat5 = '';
            $gawat6 = '';
            $gawat7 = '';
            $gawat8 = '';
            $gawattext9 = '';
            $gawattext10 = '';
            $gawat11 = '';
            $gawat12 = '';
            $gawat13 = '';
            $gawat14 = '';
            $gawat15 = '';
            $gawattext16 = '';
            $gawattext17 = '';
            $gawat18 = '';
            $gawattext19 = '';
            $gawattext20 = '';
            $gawat21 = '';
            $gawat22 = '';
            $gawat23 = '';
            $gawat24 = '';
            $gawat25 = '';
            $gawat26 = '';
            $gawat27 = '';
            $gawat28 = '';
            $gawat29 = '';
            $gawat30 = '';
            $gawat31 = '';
            $hasilPasien = '';
            $pasienNyeri = '';
            $scoreNyeri = '';
            $lokasi = '';
            $durasi = '';
            $nyeriresusitasi = '';
            $nyeriberat = '';
            $nyerisedang = '';
            $nyeriringan = '';
            $nyerifalseemergency = '';
            $cara_datang_berjalan = '';
            $cara_datang_brankar = '';
            $cara_datang_kursi_roda = '';
            $cara_datang_digendong = '';
            $cara_datang_dibantu = '';
            $sudah_terpasang_infus = '';
            $sudah_terpasang_ngt = '';
            $sudah_terpasang_ett = '';
            $sudah_terpasang_lain = '';
            $sudah_terpasang_keterangan = '';
            $alasan_sendiri = '';
            $alasan_polisi = '';
            $alasan_ambulance = '';
            $alasan_rujukan = '';
            $alasan_rujukan_dari = '';
            $alasan_rujukan_untuk = '';
            $kendaraan_ambulance = '';
            $kendaraan_non_ambulance = '';
            $pengantar_nama = '';
            $pengantar_telp = '';
            $pengantar_hubungan = '';
            $kasus_trauma = '';
            $kasus_kll_tunggal = '';
            $kasus_kll = '';
            $kasus_vs1 = '';
            $kasus_vs2 = '';
            $kasus_trauma_lain = '';
            $kasus_tempat = '';
            $kasus_tempat_keterangan = '';
            $kasus_non_trauma = '';
            $kasus_tanggal = '';
            $kasus_waktu = '';
            $ttdPetugasTriase = '';
            $emrPasien = DB::table('emrpasien_t as ep')
                ->join('pegawai_m as pg', 'ep.pegawaifk', '=', 'pg.id')
                ->select('ep.noemr', 'ep.emrfk', 'ep.tglemr')
                ->where('ep.statusenabled', true)
                ->where('ep.emrfk', 697)
                ->where('ep.noregistrasifk', $noregistrasi)
                ->orderBy('ep.tglemr', 'desc')
                ->first();
            if ($emrPasien) {
                $detailTriase = DB::table('emrpasiend_t')
                    ->select('value', 'emrdfk')
                    ->where('emrpasienfk', $emrPasien->noemr)
                    ->where('emrfk', $emrPasien->emrfk)
                    // ->where('tgl', $emrPasien->tglemr)
                    ->get();
                if (count($detailTriase) > 0) {
                    foreach ($detailTriase as $tris) {
                        if ($tris->emrdfk == 1901300076) {
                            $nama = $tris->value;
                        } elseif ($tris->emrdfk == 1901300077) {
                            $noHp = $tris->value;
                        } elseif ($tris->emrdfk == 1901300078 && $tris->value == 1) {
                            $transportasi = 'AMBULANCE';
                        } elseif ($tris->emrdfk == 1901300079 && $tris->value == 1) {
                            $transportasi = 'MOBIL';
                        } elseif ($tris->emrdfk == 1901300080 && $tris->value == 1) {
                            $transportasi = 'MOTOR';
                        } elseif ($tris->emrdfk == 1901300081 && $tris->value == 1) {
                            $transportasi = 'LAINNYA';
                        } elseif ($tris->emrdfk == 1901300082) {
                            $keluhanUtama = $tris->value;
                        } elseif ($tris->emrdfk == 1901300122) {
                            $tekananDarah = $tris->value;
                        } elseif ($tris->emrdfk == 1901300127) {
                            $pernapasan = $tris->value;
                        } elseif ($tris->emrdfk == 1901300125) {
                            $suhu = $tris->value;
                        } elseif ($tris->emrdfk == 1901300126) {
                            $Nadi = $tris->value;
                        } elseif ($tris->emrdfk == 1901300129) {
                            $spo2 = $tris->value;
                        } elseif ($tris->emrdfk == 1901300128) {
                            $kesadaran = $tris->value;
                        } elseif ($tris->emrdfk == 1901300130) {
                            $keadaanUmum = $tris->value;
                        } elseif ($tris->emrdfk == 1901300124) {
                            $beratBadan = $tris->value;
                        } elseif ($tris->emrdfk == 1901300123) {
                            $tinggiBadan = $tris->value;
                        } elseif ($tris->emrdfk == 1901300131) {
                            $e = $tris->value;
                        } elseif ($tris->emrdfk == 1901300132) {
                            $m = $tris->value;
                        } elseif ($tris->emrdfk == 1901300133) {
                            $v = $tris->value;
                        } elseif ($tris->emrdfk == 1901300140 && $tris->value == 1) {
                            $airway1 = 'checked';
                        } elseif ($tris->emrdfk == 1901300141 && $tris->value == 1) {
                            $airway2 = 'checked';
                        } elseif ($tris->emrdfk == 1901300142 && $tris->value == 1) {
                            $airway3 = 'checked';
                        } elseif ($tris->emrdfk == 1901300143 && $tris->value == 1) {
                            $airway4 = 'checked';
                        } elseif ($tris->emrdfk == 1901300144 && $tris->value == 1) {
                            $airway5 = 'checked';
                        } elseif ($tris->emrdfk == 28 && $tris->value == 1) {
                            $ats1 = 'checked';
                        } elseif ($tris->emrdfk == 32 && $tris->value == 1) {
                            $ats2 = 'checked';
                        } elseif ($tris->emrdfk == 34 && $tris->value == 1) {
                            $ats3 = 'checked';
                        } elseif ($tris->emrdfk == 35 && $tris->value == 1) {
                            $ats4 = 'checked';
                        } elseif ($tris->emrdfk == 37 && $tris->value == 1) {
                            $ats5 = 'checked';
                        } elseif ($tris->emrdfk == 38 && $tris->value == 1) {
                            $doa1 = 'checked';
                        } elseif ($tris->emrdfk == 1901300145) {
                            $airwaydoa = $tris->value;
                        } elseif ($tris->emrdfk == 1901300146) {
                            $breathing1 = 'checked';
                        } elseif ($tris->emrdfk == 1901300166) {
                            $breathing2 = 'checked';
                        } elseif ($tris->emrdfk == 1901300147) {
                            $breathing3 = 'checked';
                        } elseif ($tris->emrdfk == 1901300168) {
                            $breathing4 = 'checked';
                        } elseif ($tris->emrdfk == 1901300169) {
                            $breathing5 = 'checked';
                        } elseif ($tris->emrdfk == 1901300283) {
                            $breathing66 = 'checked';
                        } elseif ($tris->emrdfk == 1901300170 && $tris->value == 1) {
                            $breathing6 = 'checked';
                        } elseif ($tris->emrdfk == 1901300171) {
                            $breathing7 = 'checked';
                        } elseif ($tris->emrdfk == 1901300149) {
                            $breathing8 = 'checked';
                        } elseif ($tris->emrdfk == 1901300150) {
                            $breathing9 = 'checked';
                        } elseif ($tris->emrdfk == 1901300151) {
                            $breathing10 = 'checked';
                        } elseif ($tris->emrdfk == 1901300209 && $tris->value == 1) {
                            $circulation1 = 'checked';
                        } elseif ($tris->emrdfk == 1901300172 && $tris->value == 1) {
                            $circulation2 = 'checked';
                        } elseif ($tris->emrdfk == 1901300173 && $tris->value == 1) {
                            $circulation3 = 'checked';
                        } elseif ($tris->emrdfk == 1901300210 && $tris->value == 1) {
                            $circulation4 = 'checked';
                        } elseif ($tris->emrdfk == 1901300174 && $tris->value == 1) {
                            $circulation5 = 'checked';
                        } elseif ($tris->emrdfk == 1901300175 && $tris->value == 1) {
                            $circulation6 = 'checked';
                        } elseif ($tris->emrdfk == 1901300176 && $tris->value == 1) {
                            $circulation7 = 'checked';
                        } elseif ($tris->emrdfk == 1901300177 && $tris->value == 1) {
                            $circulation8 = 'checked';
                        } elseif ($tris->emrdfk == 1901300178 && $tris->value == 1) {
                            $circulation9 = 'checked';
                        } elseif ($tris->emrdfk == 1901300284 && $tris->value == 1) {
                            $circulation100 = 'checked';
                        } elseif ($tris->emrdfk == 1901300179 && $tris->value == 1) {
                            $circulation10 = 'checked';
                        } elseif ($tris->emrdfk == 1901300180 && $tris->value == 1) {
                            $circulation11 = 'checked';
                        } elseif ($tris->emrdfk == 1901300181 && $tris->value == 1) {
                            $circulation12 = 'checked';
                        } elseif ($tris->emrdfk == 1901300182 && $tris->value == 1) {
                            $circulation13 = 'checked';
                        } elseif ($tris->emrdfk == 1901300183 && $tris->value == 1) {
                            $circulation14 = 'checked';
                        } elseif ($tris->emrdfk == 1901300184 && $tris->value == 1) {
                            $circulation15 = 'checked';
                        } elseif ($tris->emrdfk == 1901300211 && $tris->value == 1) {
                            $circulation16 = 'checked';
                        } elseif ($tris->emrdfk == 1901300185 && $tris->value == 1) {
                            $circulation17 = 'checked';
                        } elseif ($tris->emrdfk == 1901300212 && $tris->value == 1) {
                            $circulation18 = 'checked';
                        } elseif ($tris->emrdfk == 1901300213 && $tris->value == 1) {
                            $circulation19 = 'checked';
                        } elseif ($tris->emrdfk == 1901300214 && $tris->value == 1) {
                            $circulation20 = 'checked';
                        } elseif ($tris->emrdfk == 1901300152 && $tris->value == 1) {
                            $disability1 = 'checked';
                        } elseif ($tris->emrdfk == 1901300186 && $tris->value == 1) {
                            $disability2 = 'checked';
                        } elseif ($tris->emrdfk == 1901300187 && $tris->value == 1) {
                            $disability3 = 'checked';
                        } elseif ($tris->emrdfk == 1901300153 && $tris->value == 1) {
                            $disability4 = 'checked';
                        } elseif ($tris->emrdfk == 1901300188 && $tris->value == 1) {
                            $disability5 = 'checked';
                        } elseif ($tris->emrdfk == 1901300189 && $tris->value == 1) {
                            $disability6 = 'checked';
                        } elseif ($tris->emrdfk == 1901300154 && $tris->value == 1) {
                            $disability7 = 'checked';
                        } elseif ($tris->emrdfk == 1901300190 && $tris->value == 1) {
                            $disability8 = 'checked';
                        } elseif ($tris->emrdfk == 1901300191 && $tris->value == 1) {
                            $disability9 = 'checked';
                        } elseif ($tris->emrdfk == 1901300155 && $tris->value == 1) {
                            $disability10 = 'checked';
                        } elseif ($tris->emrdfk == 1901300156 && $tris->value == 1) {
                            $disability11 = 'checked';
                        } elseif ($tris->emrdfk == 1901300157 && $tris->value == 1) {
                            $disability12 = 'checked';
                        } elseif ($tris->emrdfk == 1901300158 && $tris->value == 1) {
                            $gawat1 = 'checked';
                        } elseif ($tris->emrdfk == 1901300192) {
                            $gawattext2 = $tris->value;
                        } elseif ($tris->emrdfk == 1901300193) {
                            $gawattext3 = $tris->value;
                        } elseif ($tris->emrdfk == 1901300159 && $tris->value == 1) {
                            $gawat4 = 'checked';
                        } elseif ($tris->emrdfk == 1901300194 && $tris->value == 1) {
                            $gawat5 = 'checked';
                        } elseif ($tris->emrdfk == 1901300195 && $tris->value == 1) {
                            $gawat6 = 'checked';
                        } elseif ($tris->emrdfk == 1901300196 && $tris->value == 1) {
                            $gawat7 = 'checked';
                        } elseif ($tris->emrdfk == 1901300197 && $tris->value == 1) {
                            $gawat8 = 'checked';
                        } elseif ($tris->emrdfk == 1901300198) {
                            $gawattext9 = $tris->value;
                        } elseif ($tris->emrdfk == 1901300199) {
                            $gawattext10 = $tris->value;
                        } elseif ($tris->emrdfk == 1901300160 && $tris->value == 1) {
                            $gawat11 = 'checked';
                        } elseif ($tris->emrdfk == 1901300200 && $tris->value == 1) {
                            $gawat12 = 'checked';
                        } elseif ($tris->emrdfk == 1901300201 && $tris->value == 1) {
                            $gawat13 = 'checked';
                        } elseif ($tris->emrdfk == 1901300202 && $tris->value == 1) {
                            $gawat14 = 'checked';
                        } elseif ($tris->emrdfk == 1901300203 && $tris->value == 1) {
                            $gawat15 = 'checked';
                        } elseif ($tris->emrdfk == 1901300204) {
                            $gawattext16 = $tris->value;
                        } elseif ($tris->emrdfk == 1901300205) {
                            $gawattext17 = $tris->value;
                        } elseif ($tris->emrdfk == 1901300161 && $tris->value == 1) {
                            $gawat18 = 'checked';
                        } elseif ($tris->emrdfk == 1901300206) {
                            $gawattext19 = $tris->value;
                        } elseif ($tris->emrdfk == 1901300207) {
                            $gawattext20 = $tris->value;
                        } elseif ($tris->emrdfk == 1901300162 && $tris->value == 1) {
                            $gawat21 = 'checked';
                        } elseif ($tris->emrdfk == 1901300163 && $tris->value == 1) {
                            $gawat22 = 'checked';
                        } elseif ($tris->emrdfk == 1901300208 && $tris->value == 1) {
                            $gawat23 = 'checked';
                        } elseif ($tris->emrdfk == 1901300215 && $tris->value == 1) {
                            $gawat24 = 'checked';
                        } elseif ($tris->emrdfk == 1901300216 && $tris->value == 1) {
                            $gawat25 = 'checked';
                        } elseif ($tris->emrdfk == 1901300217 && $tris->value == 1) {
                            $gawat26 = 'checked';
                        } elseif ($tris->emrdfk == 1901300218 && $tris->value == 1) {
                            $gawat27 = 'checked';
                        } elseif ($tris->emrdfk == 1901300219 && $tris->value == 1) {
                            $gawat28 = 'checked';
                        } elseif ($tris->emrdfk == 1901300220 && $tris->value == 1) {
                            $gawat29 = 'checked';
                        } elseif ($tris->emrdfk == 1901300221 && $tris->value == 1) {
                            $gawat30 = 'checked';
                        } elseif ($tris->emrdfk == 1901300222 && $tris->value == 1) {
                            $gawat31 = 'checked';
                        } elseif ($tris->emrdfk == 1901300105 && $tris->value == 1) {
                            $pasienNyeri = '1';
                        } elseif ($tris->emrdfk == 1901300106 && $tris->value == 1) {
                            $pasienNyeri = '2';
                        } elseif ($tris->emrdfk == 1901300134 && $tris->value == 1) {
                            $scoreNyeri = '1';
                        } elseif ($tris->emrdfk == 1901300135 && $tris->value == 1) {
                            $scoreNyeri = '2';
                        } elseif ($tris->emrdfk == 1901300136 && $tris->value == 1) {
                            $scoreNyeri = '3';
                        } elseif ($tris->emrdfk == 1901300137 && $tris->value == 1) {
                            $scoreNyeri = '4';
                        } elseif ($tris->emrdfk == 1901300138 && $tris->value == 1) {
                            $scoreNyeri = '5';
                        } elseif ($tris->emrdfk == 1901300139 && $tris->value == 1) {
                            $scoreNyeri = '6';
                        } elseif ($tris->emrdfk == 1901300113) {
                            $lokasi = $tris->value;
                        } elseif ($tris->emrdfk == 1901300114) {
                            $durasi = $tris->value;
                        } elseif ($tris->emrdfk == 1901300115) {
                            $ttdPetugasTriase = $tris->value;
                        } elseif ($tris->emrdfk == 1901300075) {
                            $tgl = $tris->value;
                        }

                        // Nyeri
                        elseif ($tris->emrdfk == 1901300254) {
                            $nyeriresusitasi = $tris->value;
                        } elseif ($tris->emrdfk == 1901300255 && $tris->value == 1) {
                            $nyeriberat = 'checked';
                        } elseif ($tris->emrdfk == 1901300256 && $tris->value == 1) {
                            $nyerisedang = 'checked';
                        } elseif ($tris->emrdfk == 1901300257 && $tris->value == 1) {
                            $nyeriringan = 'checked';
                        } elseif ($tris->emrdfk == 1901300258) {
                            $nyerifalseemergency = $tris->value;
                        }

                        // Cara Datang
                        elseif ($tris->emrdfk == 1901300223 && $tris->value == 1) {
                            $cara_datang_berjalan = 'checked';
                        } elseif ($tris->emrdfk == 1901300224 && $tris->value == 1) {
                            $cara_datang_brankar = 'checked';
                        } elseif ($tris->emrdfk == 1901300225 && $tris->value == 1) {
                            $cara_datang_kursi_roda = 'checked';
                        } elseif ($tris->emrdfk == 1901300226 && $tris->value == 1) {
                            $cara_datang_digendong = 'checked';
                        } elseif ($tris->emrdfk == 1901300227 && $tris->value == 1) {
                            $cara_datang_dibantu = 'checked';
                        }

                        // Sudah Terpasang
                        elseif ($tris->emrdfk == 1901300228 && $tris->value == 1) {
                            $sudah_terpasang_infus = 'checked';
                        } elseif ($tris->emrdfk == 1901300229 && $tris->value == 1) {
                            $sudah_terpasang_ngt = 'checked';
                        } elseif ($tris->emrdfk == 1901300230 && $tris->value == 1) {
                            $sudah_terpasang_ett = 'checked';
                        } elseif ($tris->emrdfk == 1901300231 && $tris->value == 1) {
                            $sudah_terpasang_lain = 'checked';
                        } elseif ($tris->emrdfk == 1901300232) {
                            $sudah_terpasang_keterangan = $tris->value;
                        }

                        // Alasan Datang
                        elseif ($tris->emrdfk == 1901300233 && $tris->value == 1) {
                            $alasan_sendiri = 'checked';
                        } elseif ($tris->emrdfk == 1901300234 && $tris->value == 1) {
                            $alasan_polisi = 'checked';
                        } elseif ($tris->emrdfk == 1901300235 && $tris->value == 1) {
                            $alasan_ambulance = 'checked';
                        } elseif ($tris->emrdfk == 1901300236 && $tris->value == 1) {
                            $alasan_rujukan = 'checked';
                        } elseif ($tris->emrdfk == 1901300237) {
                            $alasan_rujukan_dari = $tris->value;
                        } elseif ($tris->emrdfk == 1901300238) {
                            $alasan_rujukan_untuk = $tris->value;
                        }

                        // Kendaraan
                        elseif ($tris->emrdfk == 1901300078 && $tris->value == 1) {
                            $kendaraan_ambulance = 'checked';
                        } elseif (in_array($transportasi, ['MOBIL', 'MOTOR', 'LAINNYA'])) {
                            $kendaraan_non_ambulance = 'checked';
                        }

                        // Pengantar
                        elseif ($tris->emrdfk == 1901300239) {
                            $pengantar_nama = $tris->value;
                        } elseif ($tris->emrdfk == 1901300240) {
                            $pengantar_hubungan = $tris->value;
                        } elseif ($tris->emrdfk == 1901300241) {
                            $pengantar_telp = $tris->value;
                        }

                        // Kasus
                        elseif ($tris->emrdfk == 1901300242 && $tris->value == 1) {
                            $kasus_trauma = 'checked';
                        } elseif ($tris->emrdfk == 1901300243 && $tris->value == 1) {
                            $kasus_kll_tunggal = 'checked';
                        } elseif ($tris->emrdfk == 1901300244 && $tris->value == 1) {
                            $kasus_kll = 'checked';
                        } elseif ($tris->emrdfk == 1901300245) {
                            $kasus_vs1 = $tris->value;
                        } elseif ($tris->emrdfk == 1901300246) {
                            $kasus_vs2 = $tris->value;
                        } elseif ($tris->emrdfk == 1901300247 && $tris->value == 1) {
                            $kasus_trauma_lain = 'checked';
                        } elseif ($tris->emrdfk == 1901300259 && $tris->value == 1) {
                            $kasus_tempat = 'checked';
                        } elseif ($tris->emrdfk == 1901300248) {
                            $kasus_tempat_keterangan = $tris->value;
                        } elseif ($tris->emrdfk == 1901300249 && $tris->value == 1) {
                            $kasus_non_trauma = 'checked';
                        } elseif ($tris->emrdfk == 1901300250 && $tris->value == 1) {
                            $kasus_tanggal = 'checked';
                        } elseif ($tris->emrdfk == 1901300251) {
                            $kasus_waktu = $tris->value;
                        }
                    }
                    $ttdPetugasTriaseBarcode = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-new?namaPegawai=" . $ttdPetugasTriase);
                    echo "</br>";
                    header('Contert-Type: application/' . $ttdPetugasTriaseBarcode->getContentType());
                    $ttdPetugasTriaseBarcode2 = $ttdPetugasTriaseBarcode->writeDataUri();
                }
                $dataTriaseIGD = array(
                    'nama' => $nama,
                    'noHp' => $noHp,
                    'transportasi' => $transportasi,
                    'keluhanUtama' => $keluhanUtama,
                    'tekananDarah' => $tekananDarah,
                    'pernapasan' => $pernapasan,
                    'suhu' => $suhu,
                    'nadi' => $Nadi,
                    'spo2' => $spo2,
                    'kesadaran' => $kesadaran,
                    'keadaanUmum' => $keadaanUmum,
                    'beratBadan' => $beratBadan,
                    'tinggiBadan' => $tinggiBadan,
                    'e' => $e,
                    'm' => $m,
                    'v' => $v,
                    'airway1' => $airway1,
                    'airway2' => $airway2,
                    'airway3' => $airway3,
                    'airway4' => $airway4,
                    'airway5' => $airway5,
                    'airwaydoa' => $airwaydoa,
                    'ats1' => $ats1,
                    'ats2' => $ats2,
                    'ats3' => $ats3,
                    'ats4' => $ats4,
                    'ats5' => $ats5,
                    'doa1' => $doa1,
                    'breathing1' => $breathing1,
                    'breathing2' => $breathing2,
                    'breathing3' => $breathing3,
                    'breathing4' => $breathing4,
                    'breathing5' => $breathing5,
                    'breathing6' => $breathing6,
                    'breathing66' => $breathing66,
                    'breathing7' => $breathing7,
                    'breathing8' => $breathing8,
                    'breathing9' => $breathing9,
                    'breathing10' => $breathing10,
                    'circulation1' => $circulation1,
                    'circulation2' => $circulation2,
                    'circulation3' => $circulation3,
                    'circulation4' => $circulation4,
                    'circulation5' => $circulation5,
                    'circulation6' => $circulation6,
                    'circulation7' => $circulation7,
                    'circulation8' => $circulation8,
                    'circulation9' => $circulation9,
                    'circulation100' => $circulation100,
                    'circulation10' => $circulation10,
                    'circulation11' => $circulation11,
                    'circulation12' => $circulation12,
                    'circulation13' => $circulation13,
                    'circulation14' => $circulation14,
                    'circulation15' => $circulation15,
                    'circulation16' => $circulation16,
                    'circulation17' => $circulation17,
                    'circulation18' => $circulation18,
                    'circulation19' => $circulation19,
                    'circulation20' => $circulation20,
                    'disability1' => $disability1,
                    'disability2' => $disability2,
                    'disability3' => $disability3,
                    'disability4' => $disability4,
                    'disability5' => $disability5,
                    'disability6' => $disability6,
                    'disability7' => $disability7,
                    'disability8' => $disability8,
                    'disability9' => $disability9,
                    'disability10' => $disability10,
                    'disability11' => $disability11,
                    'disability12' => $disability12,
                    'gawattext2' => $gawattext2,
                    'gawattext3' => $gawattext3,
                    'gawattext9' => $gawattext9,
                    'gawattext10' => $gawattext10,
                    'gawattext16' => $gawattext16,
                    'gawattext17' => $gawattext17,
                    'gawattext19' => $gawattext19,
                    'gawattext20' => $gawattext20,
                    'gawat1' => $gawat1,
                    'gawat4' => $gawat4,
                    'gawat5' => $gawat5,
                    'gawat6' => $gawat6,
                    'gawat7' => $gawat7,
                    'gawat8' => $gawat8,
                    'gawat11' => $gawat11,
                    'gawat12' => $gawat12,
                    'gawat13' => $gawat13,
                    'gawat14' => $gawat14,
                    'gawat15' => $gawat15,
                    'gawat18' => $gawat18,
                    'gawat21' => $gawat21,
                    'gawat22' => $gawat22,
                    'gawat23' => $gawat23,
                    'gawat24' => $gawat24,
                    'gawat25' => $gawat25,
                    'gawat26' => $gawat26,
                    'gawat27' => $gawat27,
                    'gawat28' => $gawat28,
                    'gawat29' => $gawat29,
                    'gawat30' => $gawat30,
                    'gawat31' => $gawat31,
                    'hasilPasien' => $hasilPasien,
                    'pasienNyeri' => $pasienNyeri,
                    'scoreNyeri' => $scoreNyeri,
                    'lokasi' => $lokasi,
                    'durasi' => $durasi,
                    // Tingkat nyeri
                    'nyeriresusitasi' => $nyeriresusitasi,
                    'nyeriringan' => $nyeriringan,
                    'nyerisedang' => $nyerisedang,
                    'nyeriberat' => $nyeriberat,
                    'nyerifalseemergency' => $nyerifalseemergency,

                    // Cara datang
                    'cara_datang_berjalan' => $cara_datang_berjalan,
                    'cara_datang_brankar' => $cara_datang_brankar,
                    'cara_datang_kursi_roda' => $cara_datang_kursi_roda,
                    'cara_datang_digendong' => $cara_datang_digendong,
                    'cara_datang_dibantu' => $cara_datang_dibantu,

                    // Sudah terpasang
                    'sudah_terpasang_infus' => $sudah_terpasang_infus,
                    'sudah_terpasang_ngt' => $sudah_terpasang_ngt,
                    'sudah_terpasang_ett' => $sudah_terpasang_ett,
                    'sudah_terpasang_lain' => $sudah_terpasang_lain,
                    'sudah_terpasang_keterangan' => $sudah_terpasang_keterangan,

                    // Alasan
                    'alasan_sendiri' => $alasan_sendiri,
                    'alasan_polisi' => $alasan_polisi,
                    'alasan_ambulance' => $alasan_ambulance,
                    'alasan_rujukan' => $alasan_rujukan,
                    'alasan_rujukan_dari' => $alasan_rujukan_dari,
                    'alasan_rujukan_untuk' => $alasan_rujukan_untuk,

                    // Kendaraan
                    'kendaraan_ambulance' => $kendaraan_ambulance,
                    'kendaraan_non_ambulance' => $kendaraan_non_ambulance,

                    // Pengantar
                    'pengantar_nama' => $pengantar_nama,
                    'pengantar_telp' => $pengantar_telp,
                    'pengantar_hubungan' => $pengantar_hubungan,

                    // Kasus
                    'kasus_trauma' => $kasus_trauma,
                    'kasus_kll_tunggal' => $kasus_kll_tunggal,
                    'kasus_kll' => $kasus_kll,
                    'kasus_vs1' => $kasus_vs1,
                    'kasus_vs2' => $kasus_vs2,
                    'kasus_trauma_lain' => $kasus_trauma_lain,
                    'kasus_tempat' => $kasus_tempat,
                    'kasus_tempat_keterangan' => $kasus_tempat_keterangan,
                    'kasus_non_trauma' => $kasus_non_trauma,
                    'kasus_tanggal' => $kasus_tanggal,
                    'kasus_waktu' => $kasus_waktu,
                    'ttdPetugasTriase' => $ttdPetugasTriase,
                    'ttdPetugasTriaseBarcode' => $ttdPetugasTriaseBarcode2,
                    'ruangan' => 'IGD',
                    'tgl' => $tgl
                );
            }
        }

        // key 29-07-2024
        // --------------------Hemodialisa-------------------
        if ($xcetakhemodialisa == 1) {
            $dataHemodialisa = [];
            $laporanhemodialisa = [];

            $dataprehd = '';
            $tdhd = '';
            $nadihd = '';
            $pernapasanhd = '';
            $suhuhd = '';
            $respiratoryhd = '';
            $edemahd = '';
            $bbkeringhd = '';
            $bbprahd = '';
            $perbedaanbbhd = '';
            $avfistula = '';
            $femotarishd = '';
            $doublelumenhd = '';
            $yanyerihd = '';
            $tidaknyerihd = '';
            $tidakadanyerihd = '';
            $sedikitnyerihd = '';
            $cukupnyerihd = '';
            $lumayannyerihd = '';
            $sangatnyerihd = '';
            $amatsangatnyerihd = '';
            $skalanyerihd = '';
            $lokasihd = '';
            $durasihd = '';
            $frekuensihd = '';
            $karakteristikhd = '';
            $minumobathd = '';
            $mendengarmusikhd = '';
            $istirahathd = '';
            $berubahposisihd = '';
            $lainlainhd = '';
            $sebutkanhd = '';
            $luasmembranehd = '';
            $lowfluxhd = '';
            $highthd = '';
            $dializerhd = '';
            $priminghd = '';
            $singelusekehd = '';
            $tessisa0hd = '';
            $tessisa1hd = '';
            $tessisa3hd = '';
            $petugas4hd = '';
            $alarmtesttidakhd = '';
            $alarmtestyahd = '';
            $hurufmesinhd = '';
            $angkamesinhd = '';
            $jenisprogramhd = '';
            $dialisthd = '';
            $conductivithd = '';
            $anticoagulehd = '';
            $dosisawalhd = '';
            $dosispemeliharaanhd = '';
            $jamtotalhd = '';
            $jam11hd = '';
            $jam12hd = '';
            $masalahkeperawatan13hd = '';
            $jam21hd = '';
            $jam22hd = '';
            $masalahkeperawatan23hd = '';
            $jam31hd = '';
            $jam32hd = '';
            $masalahkeperawatan33hd = '';
            $jam41hd = '';
            $jam42hd = '';
            $masalahkeperawatan43hd = '';
            $waktumulaihd = '';
            $waktuselesaihd = '';
            $lamawaktuhd = '';
            $keluhanhd = '';
            $keadaanhd = '';
            $td2hd = '';
            $nadi2hd = '';
            $pernapasan2hd = '';
            $suhu2hd = '';
            $bbposthd = '';
            $sisacairanhd = '';
            $transfusicairanhd = '';
            $washcairanhd = '';
            $minumcairanhd = '';
            $jumlahcairanhd = '';
            $petugaspunksihd = '';
            $petugasterminasihd = '';
            $selesaihd = '';
            $perawatpasienhd = '';
            $qrCodeHD2 = '';
            $hd1 = '';
            $hd2 = '';
            $hd3 = '';
            $hd4 = '';
            $hd5 = '';
            $hd6 = '';
            $hd7 = '';
            $hd8 = '';
            $hd9 = '';
            $hd10 = '';
            $hd11 = '';
            $hd12 = '';
            $hd13 = '';
            $hd14 = '';
            $hd15 = '';
            $hd16 = '';
            $hd17 = '';
            $hd18 = '';
            $hd19 = '';
            $hd20 = '';
            $hd21 = '';
            $hd22 = '';
            $hd23 = '';
            $hd24 = '';
            $hd25 = '';
            $hd26 = '';
            $hd27 = '';
            $hd28 = '';
            $hd29 = '';
            $hd30 = '';
            $hd31 = '';
            $hd32 = '';
            $hd33 = '';
            $hd34 = '';
            $hd35 = '';
            $hd36 = '';
            $hd37 = '';
            $hd38 = '';
            $hd39 = '';
            $hd40 = '';
            $hd41 = '';
            $hd42 = '';
            $hd43 = '';
            $hd44 = '';
            $hd45 = '';
            $hd46 = '';
            $hd47 = '';
            $hd48 = '';
            $hd49 = '';
            $hd50 = '';
            $hd51 = '';
            $hd52 = '';
            $hd53 = '';
            $hd54 = '';
            $hd55 = '';
            $hd56 = '';
            $hd57 = '';
            $hd58 = '';
            $hd59 = '';
            $hd60 = '';
            $hd61 = '';
            $hd62 = '';
            $hd63 = '';
            $hd64 = '';
            $hd65 = '';
            $hd66 = '';
            $hd67 = '';
            $hd68 = '';
            $hd69 = '';
            $hd70 = '';
            $hd71 = '';
            $hd72 = '';
            $hd73 = '';
            $hd74 = '';
            $hd75 = '';
            $hd76 = '';
            $hd77 = '';
            $hd78 = '';
            $hd79 = '';
            $hd80 = '';
            $hd81 = '';
            $hd82 = '';
            $hd83 = '';
            $hd84 = '';
            $hd85 = '';
            $hd86 = '';
            $hd87 = '';
            $hd88 = '';
            $hd89 = '';
            $hd90 = '';
            $hd91 = '';
            $hd92 = '';
            $hd93 = '';
            $hd94 = '';
            $hd95 = '';
            $hd96 = '';
            $hd97 = '';
            $hd98 = '';
            $hd99 = '';
            $hd100 = '';
            if ($xcetakhemodialisa) {
                $laporanhemodialisa = DB::select(DB::raw("
                select epd.emrdfk, epd.value, ep.namaruangan from emrpasiend_t as epd join
                emrpasien_t as ep on ep.noemr = epd.emrpasienfk 
                where ep.noregistrasifk = '$noregistrasi' and ep.emrfk = 890
                "));
                if (count($laporanhemodialisa) > 0) {
                    foreach ($laporanhemodialisa as $hd) {

                        // --- DATA PRE HD & TANDA VITAL ---
                        if ($hd->emrdfk == 3255 || $hd->emrdfk == 6138) {
                            $dataprehd = $hd->value; // Keluhan
                        } else if ($hd->emrdfk == 3256 || $hd->emrdfk == 6139) {
                            $tdhd = $hd->value; // TD
                        } else if ($hd->emrdfk == 3257 || $hd->emrdfk == 6140) {
                            $pernapasanhd = $hd->value; // Pernapasan
                        } else if ($hd->emrdfk == 3258 || $hd->emrdfk == 6141) {
                            $suhuhd = $hd->value; // Suhu
                        } else if ($hd->emrdfk == 3259 || $hd->emrdfk == 6142) {
                            $nadihd = $hd->value; // Nadi
                        } else if ($hd->emrdfk == 3260 || $hd->emrdfk == 6143) {
                            $hd95 = $hd->value; // SpO2
                        }

                        // --- PEMERIKSAAN UMUM ---
                        else if ($hd->emrdfk == 3261 || $hd->emrdfk == 6144) {
                            $hd96 = $hd->value; // Keadaan Umum
                        } else if ($hd->emrdfk == 3262 || $hd->emrdfk == 6145) {
                            $hd97 = $hd->value; // Kesadaran
                        } else if ($hd->emrdfk == 3263 || $hd->emrdfk == 6146) {
                            $hd98 = $hd->value; // BB
                        } else if ($hd->emrdfk == 3264 || $hd->emrdfk == 6147) {
                            $hd99 = $hd->value; // TB
                        }

                        // --- RESPIRATORY & EDEMA & BB ---
                        else if ($hd->emrdfk == 3268 || $hd->emrdfk == 6151) {
                            $respiratoryhd = $hd->value;
                        } else if ($hd->emrdfk == 3269 || $hd->emrdfk == 6152) {
                            $edemahd = $hd->value;
                        } else if ($hd->emrdfk == 3270 || $hd->emrdfk == 6153) {
                            $bbkeringhd = $hd->value;
                        } else if ($hd->emrdfk == 3271 || $hd->emrdfk == 6154) {
                            $bbprahd = $hd->value;
                        } else if ($hd->emrdfk == 3272 || $hd->emrdfk == 6155) {
                            $perbedaanbbhd = $hd->value;
                        }

                        // --- AKSES VASKULER ---
                        else if ($hd->emrdfk == 4507 || $hd->emrdfk == 6177) {
                            $avfistula = $hd->value;
                        } else if ($hd->emrdfk == 4508 || $hd->emrdfk == 6178) {
                            $femotarishd = $hd->value;
                        } else if ($hd->emrdfk == 4509 || $hd->emrdfk == 6179) {
                            $doublelumenhd = $hd->value;
                        }

                        // --- SKALA NYERI (Wong Baker) ---
                        else if ($hd->emrdfk == 3275 || $hd->emrdfk == 6343) {
                            $tidakadanyerihd = $hd->value; // 0
                        } else if ($hd->emrdfk == 3273 || $hd->emrdfk == 6156) {
                            $yanyerihd = $hd->value; // Ya
                        } else if ($hd->emrdfk == 3274 || $hd->emrdfk == 6157) {
                            $tidaknyerihd = $hd->value; // Tidak
                        } else if ($hd->emrdfk == 3276 || $hd->emrdfk == 6344) {
                            $sedikitnyerihd = $hd->value; // 2-3
                        } else if ($hd->emrdfk == 3277 || $hd->emrdfk == 6345) {
                            $cukupnyerihd = $hd->value; // 4-5
                        } else if ($hd->emrdfk == 3278 || $hd->emrdfk == 6346) {
                            $lumayannyerihd = $hd->value; // 6-7
                        } else if ($hd->emrdfk == 3279 || $hd->emrdfk == 6347) {
                            $sangatnyerihd = $hd->value; // 8-9
                        } else if ($hd->emrdfk == 3280 || $hd->emrdfk == 6348) {
                            $amatsangatnyerihd = $hd->value; // 10
                        } else if ($hd->emrdfk == 3283 || $hd->emrdfk == 6166) {
                            $skalanyerihd = $hd->value;
                        } else if ($hd->emrdfk == 3284 || $hd->emrdfk == 6167) {
                            $lokasihd = $hd->value;
                        } else if ($hd->emrdfk == 3285 || $hd->emrdfk == 6168) {
                            $durasihd = $hd->value;
                        } else if ($hd->emrdfk == 3286 || $hd->emrdfk == 6169) {
                            $frekuensihd = $hd->value;
                        } else if ($hd->emrdfk == 3287 || $hd->emrdfk == 6170) {
                            $karakteristikhd = $hd->value;
                        }

                        // --- PENANGANAN NYERI ---
                        else if ($hd->emrdfk == 3288 || $hd->emrdfk == 6171) {
                            $minumobathd = $hd->value;
                        } else if ($hd->emrdfk == 3289 || $hd->emrdfk == 6172) {
                            $mendengarmusikhd = $hd->value;
                        } else if ($hd->emrdfk == 3290 || $hd->emrdfk == 6173) {
                            $istirahathd = $hd->value;
                        } else if ($hd->emrdfk == 3291 || $hd->emrdfk == 6174) {
                            $berubahposisihd = $hd->value;
                        } else if ($hd->emrdfk == 3292 || $hd->emrdfk == 6175) {
                            $lainlainhd = $hd->value;
                        } else if ($hd->emrdfk == 1225 || $hd->emrdfk == 6181) {
                            $sebutkanhd = $hd->value;
                        }

                        // --- DATA DIALIZER ---
                        else if ($hd->emrdfk == 3400 || $hd->emrdfk == 6182) {
                            $luasmembranehd = $hd->value;
                        } else if ($hd->emrdfk == 3401 || $hd->emrdfk == 6183) {
                            $lowfluxhd = $hd->value;
                        } else if ($hd->emrdfk == 3402 || $hd->emrdfk == 6184) {
                            $highthd = $hd->value;
                        } else if ($hd->emrdfk == 3403 || $hd->emrdfk == 6185) {
                            $dializerhd = $hd->value;
                        } else if ($hd->emrdfk == 3404 || $hd->emrdfk == 6187) {
                            $priminghd = $hd->value;
                        } else if ($hd->emrdfk == 3405 || $hd->emrdfk == 6188) {
                            $singelusekehd = $hd->value;
                        }

                        // --- SISA RENALIN ---
                        else if ($hd->emrdfk == 3406 || $hd->emrdfk == 6189) {
                            $tessisa0hd = $hd->value;
                        } else if ($hd->emrdfk == 3407 || $hd->emrdfk == 6190) {
                            $tessisa1hd = $hd->value;
                        } else if ($hd->emrdfk == 3408 || $hd->emrdfk == 6191) {
                            $tessisa3hd = $hd->value;
                        } else if ($hd->emrdfk == 3409 || $hd->emrdfk == 6192) {
                            $petugas4hd = $hd->value;
                        }

                        // --- PARAMETER MESIN ---
                        else if ($hd->emrdfk == 3415 || $hd->emrdfk == 6193) {
                            $alarmtesttidakhd = $hd->value;
                        } else if ($hd->emrdfk == 3416 || $hd->emrdfk == 6194) {
                            $alarmtestyahd = $hd->value;
                        } else if ($hd->emrdfk == 3417 || $hd->emrdfk == 6195) {
                            $hurufmesinhd = $hd->value;
                        } else if ($hd->emrdfk == 3418 || $hd->emrdfk == 6196) {
                            $angkamesinhd = $hd->value;
                        } else if ($hd->emrdfk == 3419 || $hd->emrdfk == 6197) {
                            $jenisprogramhd = $hd->value;
                        } else if ($hd->emrdfk == 3420 || $hd->emrdfk == 6198) {
                            $dialisthd = $hd->value;
                        } else if ($hd->emrdfk == 3421 || $hd->emrdfk == 6199) {
                            $conductivithd = $hd->value;
                        } else if ($hd->emrdfk == 3422 || $hd->emrdfk == 6200) {
                            $anticoagulehd = $hd->value;
                        } else if ($hd->emrdfk == 3423 || $hd->emrdfk == 6201) {
                            $dosisawalhd = $hd->value;
                        } else if ($hd->emrdfk == 3424 || $hd->emrdfk == 6202) {
                            $dosispemeliharaanhd = $hd->value;
                        } else if ($hd->emrdfk == 3425 || $hd->emrdfk == 6203) {
                            $jamtotalhd = $hd->value;
                        }

                        // --- OBSERVASI PROGRAM DIALISIS (JAM-JAMAN) ---
                        // JAM 11-13 (Header)
                        else if ($hd->emrdfk == 3426 || $hd->emrdfk == 6204) {
                            $jam11hd = $hd->value;
                        } else if ($hd->emrdfk == 3430 || $hd->emrdfk == 6205) {
                            $jam12hd = $hd->value;
                        } else if ($hd->emrdfk == 3434 || $hd->emrdfk == 6206) {
                            $masalahkeperawatan13hd = $hd->value;
                        }

                        // JAM 21-23
                        else if ($hd->emrdfk == 3427 || $hd->emrdfk == 6207) {
                            $jam21hd = $hd->value;
                        } else if ($hd->emrdfk == 3431 || $hd->emrdfk == 6208) {
                            $jam22hd = $hd->value;
                        } else if ($hd->emrdfk == 3435 || $hd->emrdfk == 6209) {
                            $masalahkeperawatan23hd = $hd->value;
                        }

                        // JAM 31-33
                        else if ($hd->emrdfk == 3428 || $hd->emrdfk == 6210) {
                            $jam31hd = $hd->value;
                        } else if ($hd->emrdfk == 3432 || $hd->emrdfk == 6211) {
                            $jam32hd = $hd->value;
                        } else if ($hd->emrdfk == 3436 || $hd->emrdfk == 6212) {
                            $masalahkeperawatan33hd = $hd->value;
                        }

                        // JAM 41-43
                        else if ($hd->emrdfk == 3429 || $hd->emrdfk == 6213) {
                            $jam41hd = $hd->value;
                        } else if ($hd->emrdfk == 3433 || $hd->emrdfk == 6214) {
                            $jam42hd = $hd->value;
                        } else if ($hd->emrdfk == 3554 || $hd->emrdfk == 6332) {
                            $petugaspunksihd = $hd->value;
                        } else if ($hd->emrdfk == 3555 || $hd->emrdfk == 6333) {
                            $petugasterminasihd = $hd->value;
                        } else if ($hd->emrdfk == 3556 || $hd->emrdfk == 6334) {
                            $perawatpasienhd = $hd->value;
                        } else if ($hd->emrdfk == 3558 || $hd->emrdfk == 6215) {
                            $masalahkeperawatan43hd = $hd->value;
                        }

                        // --- TABEL GRID OBSERVASI ---
                        // Baris 1
                        else if ($hd->emrdfk == 3440 || $hd->emrdfk == 6219) {
                            $hd1 = $hd->value;
                        } else if ($hd->emrdfk == 3441 || $hd->emrdfk == 6220) {
                            $hd2 = $hd->value;
                        } else if ($hd->emrdfk == 3442 || $hd->emrdfk == 6221) {
                            $hd3 = $hd->value;
                        } else if ($hd->emrdfk == 3443 || $hd->emrdfk == 6222) {
                            $hd4 = $hd->value;
                        } else if ($hd->emrdfk == 3444 || $hd->emrdfk == 6223) {
                            $hd5 = $hd->value;
                        } else if ($hd->emrdfk == 3445 || $hd->emrdfk == 6224) {
                            $hd6 = $hd->value;
                        } else if ($hd->emrdfk == 3446 || $hd->emrdfk == 6225) {
                            $hd7 = $hd->value;
                        } else if ($hd->emrdfk == 3447 || $hd->emrdfk == 6226) {
                            $hd8 = $hd->value;
                        } else if ($hd->emrdfk == 3448 || $hd->emrdfk == 6227) {
                            $hd9 = $hd->value;
                        }
                        // Baris 2
                        else if ($hd->emrdfk == 3449 || $hd->emrdfk == 6228) {
                            $hd10 = $hd->value;
                        } else if ($hd->emrdfk == 3450 || $hd->emrdfk == 6229) {
                            $hd11 = $hd->value;
                        } else if ($hd->emrdfk == 3451 || $hd->emrdfk == 6230) {
                            $hd12 = $hd->value;
                        } else if ($hd->emrdfk == 3452 || $hd->emrdfk == 6231) {
                            $hd13 = $hd->value;
                        } else if ($hd->emrdfk == 3453 || $hd->emrdfk == 6232) {
                            $hd14 = $hd->value;
                        } else if ($hd->emrdfk == 3454 || $hd->emrdfk == 6233) {
                            $hd15 = $hd->value;
                        } else if ($hd->emrdfk == 3455 || $hd->emrdfk == 6234) {
                            $hd16 = $hd->value;
                        } else if ($hd->emrdfk == 3456 || $hd->emrdfk == 6235) {
                            $hd17 = $hd->value;
                        } else if ($hd->emrdfk == 3457 || $hd->emrdfk == 6236) {
                            $hd18 = $hd->value;
                        }
                        // Baris 3 (Dengan Fix ID)
                        else if ($hd->emrdfk == 3458 || $hd->emrdfk == 6237) {
                            $hd19 = $hd->value;
                        } else if ($hd->emrdfk == 3459 || $hd->emrdfk == 6238) {
                            $hd20 = $hd->value;
                        } else if ($hd->emrdfk == 3460 || $hd->emrdfk == 6351) {
                            $hd21 = $hd->value;
                        } // Fix Nadi RI
                        else if ($hd->emrdfk == 3461 || $hd->emrdfk == 6352) {
                            $hd22 = $hd->value;
                        } // Fix QB RI
                        else if ($hd->emrdfk == 3462 || $hd->emrdfk == 6240) {
                            $hd23 = $hd->value;
                        } else if ($hd->emrdfk == 3463 || $hd->emrdfk == 6241) {
                            $hd24 = $hd->value;
                        } else if ($hd->emrdfk == 3464 || $hd->emrdfk == 6242) {
                            $hd25 = $hd->value;
                        } else if ($hd->emrdfk == 3465 || $hd->emrdfk == 6243) {
                            $hd26 = $hd->value;
                        } else if ($hd->emrdfk == 3466 || $hd->emrdfk == 6244) {
                            $hd27 = $hd->value;
                        }
                        // Baris 4
                        else if ($hd->emrdfk == 3467 || $hd->emrdfk == 6245) {
                            $hd28 = $hd->value;
                        } else if ($hd->emrdfk == 3468 || $hd->emrdfk == 6246) {
                            $hd29 = $hd->value;
                        } else if ($hd->emrdfk == 3469 || $hd->emrdfk == 6247) {
                            $hd30 = $hd->value;
                        } else if ($hd->emrdfk == 3470 || $hd->emrdfk == 6248) {
                            $hd31 = $hd->value;
                        } else if ($hd->emrdfk == 3471 || $hd->emrdfk == 6249) {
                            $hd32 = $hd->value;
                        } else if ($hd->emrdfk == 3472 || $hd->emrdfk == 6250) {
                            $hd33 = $hd->value;
                        } else if ($hd->emrdfk == 3473 || $hd->emrdfk == 6251) {
                            $hd34 = $hd->value;
                        } else if ($hd->emrdfk == 3474 || $hd->emrdfk == 6252) {
                            $hd35 = $hd->value;
                        } else if ($hd->emrdfk == 3475 || $hd->emrdfk == 6253) {
                            $hd36 = $hd->value;
                        }
                        // Baris 5
                        else if ($hd->emrdfk == 3476 || $hd->emrdfk == 6254) {
                            $hd37 = $hd->value;
                        } else if ($hd->emrdfk == 3477 || $hd->emrdfk == 6255) {
                            $hd38 = $hd->value;
                        } else if ($hd->emrdfk == 3478 || $hd->emrdfk == 6256) {
                            $hd39 = $hd->value;
                        } else if ($hd->emrdfk == 3479 || $hd->emrdfk == 6257) {
                            $hd40 = $hd->value;
                        } else if ($hd->emrdfk == 3480 || $hd->emrdfk == 6258) {
                            $hd41 = $hd->value;
                        } else if ($hd->emrdfk == 3481 || $hd->emrdfk == 6259) {
                            $hd42 = $hd->value;
                        } else if ($hd->emrdfk == 3482 || $hd->emrdfk == 6260) {
                            $hd43 = $hd->value;
                        } else if ($hd->emrdfk == 3483 || $hd->emrdfk == 6261) {
                            $hd44 = $hd->value;
                        } else if ($hd->emrdfk == 3484 || $hd->emrdfk == 6262) {
                            $hd45 = $hd->value;
                        }
                        // Baris 6
                        else if ($hd->emrdfk == 3485 || $hd->emrdfk == 6263) {
                            $hd46 = $hd->value;
                        } else if ($hd->emrdfk == 3486 || $hd->emrdfk == 6264) {
                            $hd47 = $hd->value;
                        } else if ($hd->emrdfk == 3487 || $hd->emrdfk == 6265) {
                            $hd48 = $hd->value;
                        } else if ($hd->emrdfk == 3488 || $hd->emrdfk == 6266) {
                            $hd49 = $hd->value;
                        } else if ($hd->emrdfk == 3489 || $hd->emrdfk == 6267) {
                            $hd50 = $hd->value;
                        } else if ($hd->emrdfk == 3490 || $hd->emrdfk == 6268) {
                            $hd51 = $hd->value;
                        } else if ($hd->emrdfk == 3491 || $hd->emrdfk == 6269) {
                            $hd52 = $hd->value;
                        } else if ($hd->emrdfk == 3492 || $hd->emrdfk == 6270) {
                            $hd53 = $hd->value;
                        } else if ($hd->emrdfk == 3493 || $hd->emrdfk == 6271) {
                            $hd54 = $hd->value;
                        }
                        // Baris 7
                        else if ($hd->emrdfk == 3494 || $hd->emrdfk == 6272) {
                            $hd55 = $hd->value;
                        } else if ($hd->emrdfk == 3495 || $hd->emrdfk == 6273) {
                            $hd56 = $hd->value;
                        } else if ($hd->emrdfk == 3496 || $hd->emrdfk == 6274) {
                            $hd57 = $hd->value;
                        } else if ($hd->emrdfk == 3497 || $hd->emrdfk == 6275) {
                            $hd58 = $hd->value;
                        } else if ($hd->emrdfk == 3498 || $hd->emrdfk == 6276) {
                            $hd59 = $hd->value;
                        } else if ($hd->emrdfk == 3499 || $hd->emrdfk == 6277) {
                            $hd60 = $hd->value;
                        } else if ($hd->emrdfk == 3500 || $hd->emrdfk == 6278) {
                            $hd61 = $hd->value;
                        } else if ($hd->emrdfk == 3501 || $hd->emrdfk == 6279) {
                            $hd62 = $hd->value;
                        } else if ($hd->emrdfk == 3502 || $hd->emrdfk == 6280) {
                            $hd63 = $hd->value;
                        }
                        // Baris 8
                        else if ($hd->emrdfk == 3503 || $hd->emrdfk == 6281) {
                            $hd64 = $hd->value;
                        } else if ($hd->emrdfk == 3504 || $hd->emrdfk == 6282) {
                            $hd65 = $hd->value;
                        } else if ($hd->emrdfk == 3505 || $hd->emrdfk == 6283) {
                            $hd66 = $hd->value;
                        } else if ($hd->emrdfk == 3506 || $hd->emrdfk == 6284) {
                            $hd67 = $hd->value;
                        } else if ($hd->emrdfk == 3507 || $hd->emrdfk == 6285) {
                            $hd68 = $hd->value;
                        } else if ($hd->emrdfk == 3508 || $hd->emrdfk == 6286) {
                            $hd69 = $hd->value;
                        } else if ($hd->emrdfk == 3509 || $hd->emrdfk == 6287) {
                            $hd70 = $hd->value;
                        } else if ($hd->emrdfk == 3510 || $hd->emrdfk == 6288) {
                            $hd71 = $hd->value;
                        } else if ($hd->emrdfk == 3511 || $hd->emrdfk == 6289) {
                            $hd72 = $hd->value;
                        }
                        // Baris 9
                        else if ($hd->emrdfk == 3512 || $hd->emrdfk == 6290) {
                            $hd73 = $hd->value;
                        } else if ($hd->emrdfk == 3513 || $hd->emrdfk == 6291) {
                            $hd74 = $hd->value;
                        } else if ($hd->emrdfk == 3514 || $hd->emrdfk == 6292) {
                            $hd75 = $hd->value;
                        } else if ($hd->emrdfk == 3515 || $hd->emrdfk == 6293) {
                            $hd76 = $hd->value;
                        } else if ($hd->emrdfk == 3516 || $hd->emrdfk == 6294) {
                            $hd77 = $hd->value;
                        } else if ($hd->emrdfk == 3517 || $hd->emrdfk == 6295) {
                            $hd78 = $hd->value;
                        } else if ($hd->emrdfk == 3518 || $hd->emrdfk == 6296) {
                            $hd79 = $hd->value;
                        } else if ($hd->emrdfk == 3519 || $hd->emrdfk == 6297) {
                            $hd80 = $hd->value;
                        } else if ($hd->emrdfk == 3520 || $hd->emrdfk == 6298) {
                            $hd81 = $hd->value;
                        }
                        // Baris 10
                        else if ($hd->emrdfk == 3521 || $hd->emrdfk == 6299) {
                            $hd82 = $hd->value;
                        } else if ($hd->emrdfk == 3522 || $hd->emrdfk == 6300) {
                            $hd83 = $hd->value;
                        } else if ($hd->emrdfk == 3523 || $hd->emrdfk == 6301) {
                            $hd84 = $hd->value;
                        } else if ($hd->emrdfk == 3524 || $hd->emrdfk == 6302) {
                            $hd85 = $hd->value;
                        } else if ($hd->emrdfk == 3525 || $hd->emrdfk == 6303) {
                            $hd86 = $hd->value;
                        } else if ($hd->emrdfk == 3526 || $hd->emrdfk == 6304) {
                            $hd87 = $hd->value;
                        } else if ($hd->emrdfk == 3527 || $hd->emrdfk == 6305) {
                            $hd88 = $hd->value;
                        } else if ($hd->emrdfk == 3528 || $hd->emrdfk == 6306) {
                            $hd89 = $hd->value;
                        } else if ($hd->emrdfk == 3529 || $hd->emrdfk == 6307) {
                            $hd90 = $hd->value;
                        } else if ($hd->emrdfk == 3553 || $hd->emrdfk == 6331) {
                            $hd100 = $hd->value;
                        }
                    }

                    // --- PENGATURAN CHECKBOX & EXPLODE (POST PROCESSING) ---
                    if ($avfistula != '' && $avfistula != '0') {
                        $avfistula = 'checked';
                    }
                    if ($femotarishd != '' && $femotarishd != '0') {
                        $femotarishd = 'checked';
                    }
                    if ($doublelumenhd != '' && $doublelumenhd != '0') {
                        $doublelumenhd = 'checked';
                    }
                    if ($yanyerihd != '' && $yanyerihd != '0') {
                        $yanyerihd = 'checked';
                    }
                    if ($tidaknyerihd != '' && $tidaknyerihd != '0') {
                        $tidaknyerihd = 'checked';
                    }
                    if ($tidakadanyerihd != '' && $tidakadanyerihd != '0') {
                        $tidakadanyerihd = 'checked';
                    }
                    if ($sedikitnyerihd != '' && $sedikitnyerihd != '0') {
                        $sedikitnyerihd = 'checked';
                    }
                    if ($cukupnyerihd != '' && $cukupnyerihd != '0') {
                        $cukupnyerihd = 'checked';
                    }
                    if ($lumayannyerihd != '' && $lumayannyerihd != '0') {
                        $lumayannyerihd = 'checked';
                    }
                    if ($sangatnyerihd != '' && $sangatnyerihd != '0') {
                        $sangatnyerihd = 'checked';
                    }
                    if ($amatsangatnyerihd != '' && $amatsangatnyerihd != '0') {
                        $amatsangatnyerihd = 'checked';
                    }
                    if ($minumobathd != '' && $minumobathd != '0') {
                        $minumobathd = 'checked';
                    }
                    if ($mendengarmusikhd != '' && $mendengarmusikhd != '0') {
                        $mendengarmusikhd = 'checked';
                    }
                    if ($istirahathd != '' && $istirahathd != '0') {
                        $istirahathd = 'checked';
                    }
                    if ($berubahposisihd != '' && $berubahposisihd != '0') {
                        $berubahposisihd = 'checked';
                    }
                    if ($lainlainhd != '' && $lainlainhd != '0') {
                        $lainlainhd = 'checked';
                    }
                    if ($lowfluxhd != '' && $lowfluxhd != '0') {
                        $lowfluxhd = 'checked';
                    }
                    if ($highthd != '' && $highthd != '0') {
                        $highthd = 'checked';
                    }
                    if ($tessisa0hd != '' && $tessisa0hd != '0') {
                        $tessisa0hd = 'checked';
                    }
                    if ($tessisa1hd != '' && $tessisa1hd != '0') {
                        $tessisa1hd = 'checked';
                    }
                    if ($tessisa3hd != '' && $tessisa3hd != '0') {
                        $tessisa3hd = 'checked';
                    }
                    if ($alarmtestyahd != '' && $alarmtestyahd != '0') {
                        $alarmtestyahd = 'checked';
                    }
                    if ($alarmtesttidakhd != '' && $alarmtesttidakhd != '0') {
                        $alarmtesttidakhd = 'checked';
                    }

                    if ($dializerhd != '') {
                        $tampungdializerhd = explode("~", $dializerhd);
                        $dializerhd = $tampungdializerhd[1];
                    }
                    if ($petugas4hd != '') {
                        $tampungpetugas4hd = explode("~", $petugas4hd);
                        $petugas4hd = $tampungpetugas4hd[1];
                    }
                    if ($hurufmesinhd != '') {
                        $tampunghurufmesinhd = explode("~", $hurufmesinhd);
                        $hurufmesinhd = $tampunghurufmesinhd[1];
                    }
                    if ($angkamesinhd != '') {
                        $tampungangkamesinhd = explode("~", $angkamesinhd);
                        $angkamesinhd = $tampungangkamesinhd[1];
                    }
                    if ($dialisthd != '') {
                        $tampungdialisthd = explode("~", $dialisthd);
                        $dialisthd = $tampungdialisthd[1];
                    }
                    if ($anticoagulehd != '') {
                        $tampunganticoagulehd = explode("~", $anticoagulehd);
                        $anticoagulehd = $tampunganticoagulehd[1];
                    }
                    if ($jenisprogramhd != '') {
                        $tampungjenisprogramhd = explode("~", $jenisprogramhd);
                        $jenisprogramhd = $tampungjenisprogramhd[1];
                    }
                    if ($petugaspunksihd != '') {
                        $tampungpetugaspunksihd = explode("~", $petugaspunksihd);
                        $petugaspunksihd = $tampungpetugaspunksihd[1];
                    }
                    if ($petugasterminasihd != '') {
                        $tampungpetugasterminasihd = explode("~", $petugasterminasihd);
                        $petugasterminasihd = $tampungpetugasterminasihd[1];
                    }
                    // if ($perawatpasienhd != '') { $tampungperawatpasienhd = explode("~", $perawatpasienhd); $perawatpasienhd = $tampungperawatpasienhd[1]; }
                    if ($hd97 != '') {
                        $tampunghd97 = explode("~", $hd97);
                        $hd97 = $tampunghd97[1];
                    }


                    // $idDokterHDArray = DB::select(DB::raw("SELECT id FROM pegawai_m where namalengkap = '$perawatpasienhd' LIMIT 1"));

                    // $qrCodeHD = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-new?idPegawai=" . $idDokterHDArray[0]->id);
                    // echo "</br>";
                    // header('Contert-Type: application/' . $qrCodeHD->getContentType());
                    // $qrCodeHD2 = $qrCodeHD->writeDataUri();

                    $idPerawatHD = ''; // Inisialisasi variabel penampung ID
                    if ($perawatpasienhd != '') {
                        $tampungperawatpasienhd = explode("~", $perawatpasienhd);
                        $idPerawatHD = $tampungperawatpasienhd[0];     // Menangkap ID (Index ke-0)
                        $perawatpasienhd = $tampungperawatpasienhd[1]; // Menangkap Nama (Index ke-1)
                    }

                    // Langsung pakai $idPerawatHD, tidak perlu query ke tabel pegawai_m lagi
                    $qrCodeHD2 = '';
                    if ($idPerawatHD != '') {
                        $qrCodeHD = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-new?idPegawai=" . $idPerawatHD);
                        // echo "</br>";
                        // header('Content-Type: application/' . $qrCodeHD->getContentType()); // Typo 'Contert-Type' di kode lama juga saya perbaiki
                        $qrCodeHD2 = $qrCodeHD->writeDataUri();
                    }

                    $dataHemodialisa = array(
                        'dataprehd' => $dataprehd,
                        'tdhd' => $tdhd,
                        'nadihd' => $nadihd,
                        'pernapasanhd' => $pernapasanhd,
                        'suhuhd' => $suhuhd,
                        'respiratoryhd' => $respiratoryhd,
                        'edemahd' => $edemahd,
                        'bbkeringhd' => $bbkeringhd,
                        'bbprahd' => $bbprahd,
                        'perbedaanbbhd' => $perbedaanbbhd,
                        'avfistula' => $avfistula,
                        'femotarishd' => $femotarishd,
                        'doublelumenhd' => $doublelumenhd,
                        'yanyerihd' => $yanyerihd,
                        'tidaknyerihd' => $tidaknyerihd,
                        'tidakadanyerihd' => $tidakadanyerihd,
                        'sedikitnyerihd' => $sedikitnyerihd,
                        'cukupnyerihd' => $cukupnyerihd,
                        'lumayannyerihd' => $lumayannyerihd,
                        'sangatnyerihd' => $sangatnyerihd,
                        'amatsangatnyerihd' => $amatsangatnyerihd,
                        'skalanyerihd' => $skalanyerihd,
                        'lokasihd' => $lokasihd,
                        'durasihd' => $durasihd,
                        'frekuensihd' => $frekuensihd,
                        'karakteristikhd' => $karakteristikhd,
                        'minumobathd' => $minumobathd,
                        'mendengarmusikhd' => $mendengarmusikhd,
                        'istirahathd' => $istirahathd,
                        'berubahposisihd' => $berubahposisihd,
                        'lainlainhd' => $lainlainhd,
                        'sebutkanhd' => $sebutkanhd,
                        'luasmembranehd' => $luasmembranehd,
                        'lowfluxhd' => $lowfluxhd,
                        'highthd' => $highthd,
                        'dializerhd' => $dializerhd,
                        'priminghd' => $priminghd,
                        'singelusekehd' => $singelusekehd,
                        'tessisa0hd' => $tessisa0hd,
                        'tessisa1hd' => $tessisa1hd,
                        'tessisa3hd' => $tessisa3hd,
                        'petugas4hd' => $petugas4hd,
                        'alarmtesttidakhd' => $alarmtesttidakhd,
                        'alarmtestyahd' => $alarmtestyahd,
                        'hurufmesinhd' => $hurufmesinhd,
                        'angkamesinhd' => $angkamesinhd,
                        'jenisprogramhd' => $jenisprogramhd,
                        'dialisthd' => $dialisthd,
                        'conductivithd' => $conductivithd,
                        'anticoagulehd' => $anticoagulehd,
                        'dosisawalhd' => $dosisawalhd,
                        'dosispemeliharaanhd' => $dosispemeliharaanhd,
                        'jamtotalhd' => $jamtotalhd,
                        'jam11hd' => $jam11hd,
                        'jam12hd' => $jam12hd,
                        'masalahkeperawatan13hd' => $masalahkeperawatan13hd,
                        'jam21hd' => $jam21hd,
                        'jam22hd' => $jam22hd,
                        'masalahkeperawatan23hd' => $masalahkeperawatan23hd,
                        'jam31hd' => $jam31hd,
                        'jam32hd' => $jam32hd,
                        'masalahkeperawatan33hd' => $masalahkeperawatan33hd,
                        'jam41hd' => $jam41hd,
                        'jam42hd' => $jam42hd,
                        'masalahkeperawatan43hd' => $masalahkeperawatan43hd,
                        'waktumulaihd' => $waktumulaihd,
                        'waktuselesaihd' => $waktuselesaihd,
                        'lamawaktuhd' => $lamawaktuhd,
                        'keluhanhd' => $keluhanhd,
                        'keadaanhd' => $keadaanhd,
                        'td2hd' => $td2hd,
                        'nadi2hd' => $nadi2hd,
                        'pernapasan2hd' => $pernapasan2hd,
                        'suhu2hd' => $suhu2hd,
                        'bbposthd' => $bbposthd,
                        'sisacairanhd' => $sisacairanhd,
                        'transfusicairanhd' => $transfusicairanhd,
                        'washcairanhd' => $washcairanhd,
                        'minumcairanhd' => $minumcairanhd,
                        'jumlahcairanhd' => $jumlahcairanhd,
                        'petugaspunksihd' => $petugaspunksihd,
                        'petugasterminasihd' => $petugasterminasihd,
                        'selesaihd' => $selesaihd,
                        'perawatpasienhd' => $perawatpasienhd,
                        'qrhd' => $qrCodeHD2,
                        'hd1' => $hd1,
                        'hd2' => $hd2,
                        'hd3' => $hd3,
                        'hd4' => $hd4,
                        'hd5' => $hd5,
                        'hd6' => $hd6,
                        'hd7' => $hd7,
                        'hd8' => $hd8,
                        'hd9' => $hd9,
                        'hd10' => $hd10,
                        'hd11' => $hd11,
                        'hd12' => $hd12,
                        'hd13' => $hd13,
                        'hd14' => $hd14,
                        'hd15' => $hd15,
                        'hd16' => $hd16,
                        'hd17' => $hd17,
                        'hd18' => $hd18,
                        'hd19' => $hd19,
                        'hd20' => $hd20,
                        'hd21' => $hd21,
                        'hd22' => $hd22,
                        'hd23' => $hd23,
                        'hd24' => $hd24,
                        'hd25' => $hd25,
                        'hd26' => $hd26,
                        'hd27' => $hd27,
                        'hd28' => $hd28,
                        'hd29' => $hd29,
                        'hd30' => $hd30,
                        'hd31' => $hd31,
                        'hd32' => $hd32,
                        'hd33' => $hd33,
                        'hd34' => $hd34,
                        'hd35' => $hd35,
                        'hd36' => $hd36,
                        'hd37' => $hd37,
                        'hd38' => $hd38,
                        'hd39' => $hd39,
                        'hd40' => $hd40,
                        'hd41' => $hd41,
                        'hd42' => $hd42,
                        'hd43' => $hd43,
                        'hd44' => $hd44,
                        'hd45' => $hd45,
                        'hd46' => $hd46,
                        'hd47' => $hd47,
                        'hd48' => $hd48,
                        'hd49' => $hd49,
                        'hd50' => $hd50,
                        'hd51' => $hd51,
                        'hd52' => $hd52,
                        'hd53' => $hd53,
                        'hd54' => $hd54,
                        'hd55' => $hd55,
                        'hd56' => $hd56,
                        'hd57' => $hd57,
                        'hd58' => $hd58,
                        'hd59' => $hd59,
                        'hd60' => $hd60,
                        'hd61' => $hd61,
                        'hd62' => $hd62,
                        'hd63' => $hd63,
                        'hd64' => $hd64,
                        'hd65' => $hd65,
                        'hd66' => $hd66,
                        'hd67' => $hd67,
                        'hd68' => $hd68,
                        'hd69' => $hd69,
                        'hd70' => $hd70,
                        'hd71' => $hd71,
                        'hd72' => $hd72,
                        'hd73' => $hd73,
                        'hd74' => $hd74,
                        'hd75' => $hd75,
                        'hd76' => $hd76,
                        'hd77' => $hd77,
                        'hd78' => $hd78,
                        'hd79' => $hd79,
                        'hd80' => $hd80,
                        'hd81' => $hd81,
                        'hd82' => $hd82,
                        'hd83' => $hd83,
                        'hd84' => $hd84,
                        'hd85' => $hd85,
                        'hd86' => $hd86,
                        'hd87' => $hd87,
                        'hd88' => $hd88,
                        'hd89' => $hd89,
                        'hd90' => $hd90,
                        'hd91' => $hd91,
                        'hd92' => $hd92,
                        'hd93' => $hd93,
                        'hd94' => $hd94,
                        'hd95' => $hd95,
                        'hd96' => $hd96,
                        'hd97' => $hd97,
                        'hd98' => $hd98,
                        'hd99' => $hd99,
                        'hd100' => $hd100
                    );
                }
            }
        };

        // key 29-07-2024
        // --------------------Asesmen Rehabilitasi Medis-------------------
        //     if ($xcetakasesmenrehab == 1) {
        //         $asesmenrehab = [];

        //         $tanggaldanjam = '';
        //         $bb = '';
        //         $tb = '';
        //         $yadaricheck = '';
        //         $rscheck = '';
        //         $rs = '';
        //         $puskesmascheck = '';
        //         $puskesmes = '';
        //         $drcheck = '';
        //         $dr = '';
        //         $lainnyacheck = '';
        //         $diagnosarujukan = '';
        //         $tidakcheck = '';
        //         $datangsendiricheck = '';
        //         $diantarcheck = '';
        //         $riwayatalergiyacheck = '';
        //         $riwayatalergitidakcheck = '';
        //         $riwayatalergiket = '';
        //         $pemeriksaanrehabmedik = '';
        //         $anamnesa = '';
        //         $riwayatsosialekonomi = '';
        //         $riwayatavocasionaldanvocasional = '';
        //         $kesadaran = '';
        //         $tvtd = '';
        //         $tvn = '';
        //         $tvr = '';
        //         $tvs = '';
        //         $nyeritidakcheck = '';
        //         $nyeriyacheck = '';
        //         $nyerilokasi = '';
        //         $nyeriintensitas = '';
        //         $tidakadanyerirehab = '';
        //         $sedikitnyerirehab = '';
        //         $cukupnyerirehab = '';
        //         $lumayannyerirehab = '';
        //         $sangatnyerirehab = '';
        //         $amatsangatnyerirehab = '';
        //         $imttb = '';
        //         $imtbb = '';
        //         $postur = '';
        //         $ambulasi = '';
        //         $resikojatuhtidakcheck = '';
        //         $resikojatuhyacheck = '';
        //         $pemeriksaanssp = '';
        //         $pemeriksaanatregioacheck = '';
        //         $pemeriksaanatregiorcheck = '';
        //         $headandneckcheck = '';
        //         $arthoraks = '';
        //         $arabdomen = '';
        //         $arback = '';
        //         $aranggotagerak = '';
        //         $tanggaldanjam = '';
        //         $look = '';
        //         $feel = '';
        //         $movement = '';
        //         $testprovokasi = '';
        //         $testfungsional = '';
        //         $pemeriksaanpenunjang = '';
        //         $impairment = '';
        //         $disability = '';
        //         $handycap = '';
        //         $problem = '';
        //         $program = '';
        //         $goal = '';
        //         $evaluasi = '';
        //         $prosedurkfr = '';
        //         $koding = '';
        //         $diagnosafungsional = '';
        //         $diagnosamedis = '';
        //         $instrumenujifungsi = '';
        //         $hasilyangdidapat = '';
        //         $kesimpulan = '';
        //         $rekomendasi = '';
        //         $dpjprehabmedis = '';
        //         $cekdatakonsul = false;
        //         $cekdatarehab = false;
        //         $qrCodeSpKFR2 = '';
        //         $qrCodeKonsPas = '';
        //         $dataListKonsul = [];
        //         $normkonsul = '';
        //         $namapasienkonsul = '';
        //         $pasienkonsulnama = '';
        //         $dokterkonsul = '';
        //         $diagnosakonsul = '';
        //         $permintaanterapikonsul = '';
        //         $tempatkonsul = '';
        //         $tanggalkonsul = '';
        //         $pasienkonsul = '';
        //         $drskfrkonsul = '';
        //         $qrCodeKonsPas2 = '';
        //         if ($xcetakasesmenrehab) {
        //             $asesmenrehab = DB::select(DB::raw("
        // select epd.emrdfk, epd.value, ep.namaruangan from emrpasiend_t as epd join
        // emrpasien_t as ep on ep.noemr = epd.emrpasienfk 
        // where ep.noregistrasifk = '$noregistrasi' and ep.emrfk = 2021
        // "));
        //             if (count($asesmenrehab) > 0) {
        //                 $cekdatarehab = true;
        //                 foreach ($asesmenrehab as $rehab) {
        //                     if ($rehab->emrdfk == 8195) {
        //                         $tanggaldanjam = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8196) {
        //                         $bb = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8197) {
        //                         $tb = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8198) {
        //                         $yadaricheck = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8199) {
        //                         $rscheck = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8200) {
        //                         $rs = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8201) {
        //                         $puskesmascheck = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8202) {
        //                         $puskesmas = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8203) {
        //                         $drcheck = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8204) {
        //                         $dr = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8205) {
        //                         $lainnyacheck = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8207) {
        //                         $diagnosarujukan = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8208) {
        //                         $tidakcheck = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8209) {
        //                         $datangsendiricheck = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8210) {
        //                         $diantarcheck = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8211) {
        //                         $riwayatalergiyacheck = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8212) {
        //                         $riwayatalergitidakcheck = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8213) {
        //                         $riwayatalergiket = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8219) {
        //                         $pemeriksaanrehabmedik = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8220) {
        //                         $anamnesa = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8221) {
        //                         $riwayatsosialekonomi = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8222) {
        //                         $riwayatavocasionaldanvocasional = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8223) {
        //                         $kesadaran = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8224) {
        //                         $tvtd = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8225) {
        //                         $tvn = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8226) {
        //                         $tvr = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8227) {
        //                         $tvs = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8228) {
        //                         $nyeritidakcheck = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8229) {
        //                         $nyeriyacheck = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8230) {
        //                         $nyerilokasi = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8231) {
        //                         $nyeriintensitas = $rehab->value;
        //                     } else if ($rehab->emrdfk == 3275) {
        //                         $tidakadanyerirehab = $rehab->value;
        //                     } else if ($rehab->emrdfk == 3276) {
        //                         $sedikitnyerirehab = $rehab->value;
        //                     } else if ($rehab->emrdfk == 3277) {
        //                         $cukupnyerirehab = $rehab->value;
        //                     } else if ($rehab->emrdfk == 3278) {
        //                         $lumayannyerirehab = $rehab->value;
        //                     } else if ($rehab->emrdfk == 3279) {
        //                         $sangatnyerirehab = $rehab->value;
        //                     } else if ($rehab->emrdfk == 3280) {
        //                         $amatsangatnyerirehab = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8232) {
        //                         $imttb = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8233) {
        //                         $imtbb = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8234) {
        //                         $postur = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8235) {
        //                         $ambulasi = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8236) {
        //                         $resikojatuhtidakcheck = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8237) {
        //                         $resikojatuhyacheck = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8238) {
        //                         $pemeriksaanssp = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8239) {
        //                         $pemeriksaanatregioacheck = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8240) {
        //                         $pemeriksaanatregiorcheck = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8241) {
        //                         $headandneckcheck = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8242) {
        //                         $arthoraks = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8243) {
        //                         $arabdomen = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8244) {
        //                         $arback = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8245) {
        //                         $aranggotagerak = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8246) {
        //                         $look = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8247) {
        //                         $feel = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8248) {
        //                         $movement = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8249) {
        //                         $testprovokasi = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8250) {
        //                         $testfungsional = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8251) {
        //                         $pemeriksaanpenunjang = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8252) {
        //                         $impairment = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8253) {
        //                         $disability = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8254) {
        //                         $handycap = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8256) {
        //                         $problem = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8257) {
        //                         $program = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8258) {
        //                         $goal = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8259) {
        //                         $evaluasi = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8261) {
        //                         $prosedurkfr = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8262) {
        //                         $koding = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8269) {
        //                         $diagnosafungsional = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8270) {
        //                         $diagnosamedis = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8271) {
        //                         $instrumenujifungsi = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8272) {
        //                         $hasilyangdidapat = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8273) {
        //                         $kesimpulan = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8274) {
        //                         $rekomendasi = $rehab->value;
        //                     } else if ($rehab->emrdfk == 8275) {
        //                         $dpjprehabmedis = $rehab->value;
        //                     }
        //                 }
        //                 if ($yadaricheck != '') {
        //                     if ($yadaricheck != '0') {
        //                         $yadaricheck = 'checked';
        //                     }
        //                 }
        //                 if ($rscheck != '') {
        //                     if ($rscheck != '0') {
        //                         $rscheck = 'checked';
        //                     }
        //                 }
        //                 if ($puskesmascheck != '') {
        //                     if ($puskesmascheck != '0') {
        //                         $puskesmascheck = 'checked';
        //                     }
        //                 }
        //                 if ($drcheck != '') {
        //                     if ($drcheck != '0') {
        //                         $drcheck = 'checked';
        //                     }
        //                 }
        //                 if ($lainnyacheck != '') {
        //                     if ($lainnyacheck != '0') {
        //                         $lainnyacheck = 'checked';
        //                     }
        //                 }
        //                 if ($riwayatalergiyacheck != '') {
        //                     if ($riwayatalergiyacheck != '0') {
        //                         $riwayatalergiyacheck = 'checked';
        //                     }
        //                 }
        //                 if ($riwayatalergitidakcheck != '') {
        //                     if ($riwayatalergitidakcheck != '0') {
        //                         $riwayatalergitidakcheck = 'checked';
        //                     }
        //                 }
        //                 if ($tidakcheck != '') {
        //                     if ($tidakcheck != '0') {
        //                         $tidakcheck = 'checked';
        //                     }
        //                 }
        //                 if ($datangsendiricheck != '') {
        //                     if ($datangsendiricheck != '0') {
        //                         $datangsendiricheck = 'checked';
        //                     }
        //                 }
        //                 if ($diantarcheck != '') {
        //                     if ($diantarcheck != '0') {
        //                         $diantarcheck = 'checked';
        //                     }
        //                 }
        //                 if ($tidakadanyerirehab != '') {
        //                     if ($tidakadanyerirehab != '0') {
        //                         $tidakadanyerirehab = 'checked';
        //                     }
        //                 }
        //                 if ($sedikitnyerirehab != '') {
        //                     if ($sedikitnyerirehab != '0') {
        //                         $sedikitnyerirehab = 'checked';
        //                     }
        //                 }
        //                 if ($cukupnyerirehab != '') {
        //                     if ($cukupnyerirehab != '0') {
        //                         $cukupnyerirehab = 'checked';
        //                     }
        //                 }
        //                 if ($lumayannyerirehab != '') {
        //                     if ($lumayannyerirehab != '0') {
        //                         $lumayannyerirehab = 'checked';
        //                     }
        //                 }
        //                 if ($sangatnyerirehab != '') {
        //                     if ($sangatnyerirehab != '0') {
        //                         $sangatnyerirehab = 'checked';
        //                     }
        //                 }
        //                 if ($amatsangatnyerirehab != '') {
        //                     if ($amatsangatnyerirehab != '0') {
        //                         $amatsangatnyerirehab = 'checked';
        //                     }
        //                 }
        //                 if ($resikojatuhtidakcheck != '') {
        //                     if ($resikojatuhtidakcheck != '0') {
        //                         $resikojatuhtidakcheck = 'checked';
        //                     }
        //                 }
        //                 if ($resikojatuhyacheck != '') {
        //                     if ($resikojatuhyacheck != '0') {
        //                         $resikojatuhyacheck = 'checked';
        //                     }
        //                 }
        //                 if ($pemeriksaanatregioacheck != '') {
        //                     if ($pemeriksaanatregioacheck != '0') {
        //                         $pemeriksaanatregioacheck = 'checked';
        //                     }
        //                 }
        //                 if ($pemeriksaanatregiorcheck != '') {
        //                     if ($pemeriksaanatregiorcheck != '0') {
        //                         $pemeriksaanatregiorcheck = 'checked';
        //                     }
        //                 }
        //                 if ($dpjprehabmedis != '') {
        //                     $tampungdpjprehabmedis = explode("~", $dpjprehabmedis);
        //                     $dpjprehabmedis = $tampungdpjprehabmedis[1];
        //                 }
        //             }

        //             $idDokterRehabArray = DB::select(DB::raw("SELECT id FROM pegawai_m where namalengkap = '$dpjprehabmedis' LIMIT 1"));

        //             $qrCodeRehab = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-new?idPegawai=" . $idDokterRehabArray[0]->id);
        //             echo "</br>";
        //             header('Contert-Type: application/' . $qrCodeRehab->getContentType());
        //             $qrCodeRehab2 = $qrCodeRehab->writeDataUri();

        //             $getNoCM = DB::select(DB::raw("SELECT ps.nocm FROM pasiendaftar_t as pd inner join pasien_m as ps on ps.id = pd.nocmfk where pd.noregistrasi = '$noregistrasi' LIMIT 1"));

        //             if (!empty($getNoCM)) {
        //                 $nocm = $getNoCM[0]->nocm;
        //                 $dataKonsul = TempKonsulRehab::where('noregistrasi', $noregistrasi)->first();
        //                 if ($dataKonsul) {
        //                     $qrCodeSpKFR = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-new?idPegawai=" . $dataKonsul->idspkfr);
        //                     $qrCodeSpKFR2 = $qrCodeSpKFR->writeDataUri();
        //                     $qrCodeKonsPas = new QrCode("Ditanda tangani oleh : " . $dataKonsul->namapasien);
        //                     $qrCodeKonsPas2 = $qrCodeKonsPas->writeDataUri();

        //                     $normkonsul = $dataKonsul->nocm;
        //                     $namapasienkonsul = $dataKonsul->namapasien;
        //                     $pasienkonsulnama = $dataKonsul->pasien;
        //                     $dokterkonsul = $dataKonsul->spkfr;
        //                     $diagnosakonsul = $dataKonsul->diagnosa;
        //                     $permintaanterapikonsul = $dataKonsul->terapi;
        //                     $tempatkonsul = $dataKonsul->tempat;
        //                     $tanggalkonsul = $dataKonsul->tanggal;
        //                     $pasienkonsul = $qrCodeKonsPas2;
        //                     $drskfrkonsul = $qrCodeSpKFR2;
        //                     $cekdatakonsul = true;
        //                 }
        //                 $dataTglKonsul = DB::table('tempkonsul_t as tkr')->select('tkr.*')->where('tkr.noregistrasi', $noregistrasi)->orderBy('tanggal', 'asc')->take(10)->get();

        //                 foreach ($dataTglKonsul as $konsul) {
        //                     if ($konsul->iddokter != null) {
        //                         $qrCodeDokter = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-new?idPegawai=" . $konsul->iddokter);
        //                         $qrCodeDokter2 = $qrCodeDokter->writeDataUri();
        //                     } else {
        //                         $qrCodeDokter2 = '';
        //                     }
        //                     if ($konsul->idterapis != null) {
        //                         $qrCodeTerapis = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-new?idPegawai=" . $konsul->idterapis);
        //                         $qrCodeTerapis2 = $qrCodeTerapis->writeDataUri();
        //                     } else {
        //                         $qrCodeTerapis2 = '';
        //                     }
        //                     if ($konsul->namapasien != null) {
        //                         $qrCodePasien = new QrCode('Ditanda tangani oleh ' . $konsul->namapasien);
        //                         $qrCodePasien2 = $qrCodePasien->writeDataUri();
        //                     } else {
        //                         $qrCodePasien2 = '';
        //                     }

        //                     $dataListKonsul[] = [
        //                         'program' => $konsul->program,
        //                         'tanggal' => $konsul->tanggal,
        //                         'pasien' => $qrCodePasien2,
        //                         'qrCodeDokter' => $qrCodeDokter2,
        //                         'qrCodeTerapis' => $qrCodeTerapis2
        //                     ];
        //                 }
        //             } else {
        //                 $dataKonsul = null;
        //                 $dataTglKonsul = null;
        //             }
        //         }

        //         $dataAsesmenRehab = array(
        //             'tanggaldanjam' => $tanggaldanjam,
        //             'bb' => $bb,
        //             'tb' => $tb,
        //             'yadaricheck' => $yadaricheck,
        //             'rscheck' => $rscheck,
        //             'rs' => $rs,
        //             'puskesmascheck' => $puskesmascheck,
        //             'puskesmes' => $puskesmes,
        //             'drcheck' => $drcheck,
        //             'dr' => $dr,
        //             'lainnyacheck' => $lainnyacheck,
        //             'diagnosarujukan' => $diagnosarujukan,
        //             'tidakcheck' => $tidakcheck,
        //             'datangsendiricheck' => $datangsendiricheck,
        //             'diantarcheck' => $diantarcheck,
        //             'riwayatalergiyacheck' => $riwayatalergiyacheck,
        //             'riwayatalergitidakcheck' => $riwayatalergitidakcheck,
        //             'riwayatalergiket' => $riwayatalergiket,
        //             'pemeriksaanrehabmedik' => $pemeriksaanrehabmedik,
        //             'anamnesa' => $anamnesa,
        //             'riwayatsosialekonomi' => $riwayatsosialekonomi,
        //             'riwayatavocasionaldanvocasional' => $riwayatavocasionaldanvocasional,
        //             'kesadaran' => $kesadaran,
        //             'tvtd' => $tvtd,
        //             'tvn' => $tvn,
        //             'tvr' => $tvr,
        //             'tvs' => $tvs,
        //             'nyeritidakcheck' => $nyeritidakcheck,
        //             'nyeriyacheck' => $nyeriyacheck,
        //             'nyerilokasi' => $nyerilokasi,
        //             'nyeriintensitas' => $nyeriintensitas,
        //             'tidakadanyerirehab' => $tidakadanyerirehab,
        //             'sedikitnyerirehab' => $sedikitnyerirehab,
        //             'cukupnyerirehab' => $cukupnyerirehab,
        //             'lumayannyerirehab' => $lumayannyerirehab,
        //             'sangatnyerirehab' => $sangatnyerirehab,
        //             'amatsangatnyerirehab' => $amatsangatnyerirehab,
        //             'imttb' => $imttb,
        //             'imtbb' => $imtbb,
        //             'postur' => $postur,
        //             'ambulasi' => $ambulasi,
        //             'resikojatuhtidakcheck' => $resikojatuhtidakcheck,
        //             'resikojatuhyacheck' => $resikojatuhyacheck,
        //             'pemeriksaanssp' => $pemeriksaanssp,
        //             'pemeriksaanatregioacheck' => $pemeriksaanatregioacheck,
        //             'pemeriksaanatregiorcheck' => $pemeriksaanatregiorcheck,
        //             'headandneckcheck' => $headandneckcheck,
        //             'arthoraks' => $arthoraks,
        //             'arabdomen' => $arabdomen,
        //             'arback' => $arback,
        //             'aranggotagerak' => $aranggotagerak,
        //             'tanggaldanjam' => $tanggaldanjam,
        //             'look' => $look,
        //             'feel' => $feel,
        //             'movement' => $movement,
        //             'testprovokasi' => $testprovokasi,
        //             'testfungsional' => $testfungsional,
        //             'pemeriksaanpenunjang' => $pemeriksaanpenunjang,
        //             'impairment' => $impairment,
        //             'disability' => $disability,
        //             'handycap' => $handycap,
        //             'problem' => $problem,
        //             'program' => $program,
        //             'goal' => $goal,
        //             'evaluasi' => $evaluasi,
        //             'prosedurkfr' => $prosedurkfr,
        //             'koding' => $koding,
        //             'diagnosafungsional' => $diagnosafungsional,
        //             'diagnosamedis' => $diagnosamedis,
        //             'instrumenujifungsi' => $instrumenujifungsi,
        //             'hasilyangdidapat' => $hasilyangdidapat,
        //             'kesimpulan' => $kesimpulan,
        //             'rekomendasi' => $rekomendasi,
        //             'dpjprehabmedis' => $qrCodeRehab2,
        //             'dpjprehabmedisnama' => $dpjprehabmedis,
        //             'normkonsul' => $normkonsul,
        //             'namapasienkonsul' => $namapasienkonsul,
        //             'pasienkonsulnama' => $pasienkonsulnama,
        //             'dokterkonsul' => $dokterkonsul,
        //             'diagnosakonsul' => $diagnosakonsul,
        //             'permintaanterapikonsul' => $permintaanterapikonsul,
        //             'tempatkonsul' => $tempatkonsul,
        //             'tanggalkonsul' => $tanggalkonsul,
        //             'pasienkonsul' => $qrCodeKonsPas2,
        //             'drskfrkonsul' => $qrCodeSpKFR2,
        //             'cekdatakonsul' => $cekdatakonsul,
        //             'dataListKonsul' => $dataListKonsul,
        //             'cekdatarehab' => $cekdatarehab
        //         );
        //     };

        // coba rehab
        if ($xcetakasesmenrehab == 1) {
            $asesmenrehab = [];
            $dataKonsulRehab = [];
            $cekdatakonsul = false;
            $qrCodeSpKFR2 = '';
            $qrCodeKonsPas = '';
            $dataListKonsulRehab = [];
            $normkonsul = '';
            $namapasienkonsul = '';
            $pasienkonsulnama = '';
            $dokterkonsul = '';
            $diagnosakonsul = '';
            $permintaanterapikonsul = '';
            $tempatkonsul = '';
            $tanggalkonsul = '';
            $pasienkonsul = '';
            $drskfrkonsul = '';
            $qrCodeKonsPas2 = '';
            $nocmrh = $dataPasien[0]->nocm;

            $asesmenrehab = DB::select(DB::raw("
                SELECT epd.emrdfk, epd.value, ep.namaruangan, ep.noemr
                FROM emrpasiend_t AS epd 
                JOIN emrpasien_t AS ep ON ep.noemr = epd.emrpasienfk 
                WHERE ep.nocm = '$nocmrh' AND ep.emrfk = 2021
            "));

            $dataAsesmenRehab = [];

            foreach ($asesmenrehab as $item) {
                $emrpasienfk = $item->noemr;
                if (!isset($dataAsesmenRehab[$emrpasienfk])) {
                    $dataAsesmenRehab[$emrpasienfk] = [];
                }

                // Cek apakah emrdfk adalah 8275
                if ($item->emrdfk == 8275) {
                    $qrDokterSp = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-new?idPegawai=" . $item->value);
                    $qrDokterSp2 = $qrDokterSp->writeDataUri(); // Simpan QR Code ke dalam variabel

                    $dataAsesmenRehab[$emrpasienfk][] = [
                        'emrdfk' => $item->emrdfk,
                        'value' => $qrDokterSp2, // Ganti value dengan QR Code
                        'namaruangan' => $item->namaruangan,
                        'emrpasienfk' => $emrpasienfk
                    ];
                } else {
                    $dataAsesmenRehab[$emrpasienfk][] = [
                        'emrdfk' => $item->emrdfk,
                        'value' => $item->value, // Tetap gunakan value asli
                        'namaruangan' => $item->namaruangan,
                        'emrpasienfk' => $emrpasienfk
                    ];
                }
            }
            $dataAsesmenRehab = array_values($dataAsesmenRehab);

            $getNoCM = DB::select(DB::raw("SELECT ps.nocm FROM pasiendaftar_t as pd inner join pasien_m as ps on ps.id = pd.nocmfk where pd.noregistrasi = '$noregistrasi' LIMIT 1"));

            if (!empty($getNoCM)) {
                $nocm = $getNoCM[0]->nocm;
                $dataKonsul = TempKonsulRehab::where('noregistrasi', $noregistrasi)->first();
                if ($dataKonsul) {
                    $qrCodeSpKFR = new QrCode("http:rsbsaonline.com/service/medifirst2000/report/cetak-ttd-new?idPegawai=" . $dataKonsul->idspkfr);
                    $qrCodeSpKFR2 = $qrCodeSpKFR->writeDataUri();
                    $qrCodeKonsPas = new QrCode("Ditanda tangani oleh : " . $dataKonsul->namapasien);
                    $qrCodeKonsPas2 = $qrCodeKonsPas->writeDataUri();

                    $normkonsul = $dataKonsul->nocm;
                    $namapasienkonsul = $dataKonsul->namapasien;
                    $pasienkonsulnama = $dataKonsul->pasien;
                    $dokterkonsul = $dataKonsul->spkfr;
                    $diagnosakonsul = $dataKonsul->diagnosa;
                    $permintaanterapikonsul = $dataKonsul->terapi;
                    $tempatkonsul = $dataKonsul->tempat;
                    $tanggalkonsul = $dataKonsul->tanggal;
                    $pasienkonsul = $qrCodeKonsPas2;
                    $drskfrkonsul = $qrCodeSpKFR2;
                    $cekdatakonsul = true;
                }
                $dataTglKonsul = DB::table('tempkonsul_t as tkr')->select('tkr.*')->where('tkr.noregistrasi', $noregistrasi)->orderBy('tanggal', 'asc')->take(10)->get();

                foreach ($dataTglKonsul as $konsul) {
                    if ($konsul->iddokter != null) {
                        $qrCodeDokter = new QrCode("http:rsbsaonline.com/service/medifirst2000/report/cetak-ttd-new?idPegawai=" . $konsul->iddokter);
                        $qrCodeDokter2 = $qrCodeDokter->writeDataUri();
                    } else {
                        $qrCodeDokter2 = '';
                    }
                    if ($konsul->idterapis != null) {
                        $qrCodeTerapis = new QrCode("http:rsbsaonline.com/service/medifirst2000/report/cetak-ttd-new?idPegawai=" . $konsul->idterapis);
                        $qrCodeTerapis2 = $qrCodeTerapis->writeDataUri();
                    } else {
                        $qrCodeTerapis2 = '';
                    }
                    if ($konsul->namapasien != null) {
                        $qrCodePasien = new QrCode('Ditanda tangani oleh ' . $konsul->namapasien);
                        $qrCodePasien2 = $qrCodePasien->writeDataUri();
                    } else {
                        $qrCodePasien2 = '';
                    }

                    $dataListKonsulRehab[] = [
                        'program' => $konsul->program,
                        'tanggal' => $konsul->tanggal,
                        'pasien' => $qrCodePasien2,
                        'qrCodeDokter' => $qrCodeDokter2,
                        'qrCodeTerapis' => $qrCodeTerapis2
                    ];
                }
            } else {
                $dataKonsul = [];
                $dataTglKonsul = [];
            }

            $dataKonsulRehab = array(
                'normkonsul' => $normkonsul,
                'namapasienkonsul' => $namapasienkonsul,
                'pasienkonsulnama' => $pasienkonsulnama,
                'dokterkonsul' => $dokterkonsul,
                'diagnosakonsul' => $diagnosakonsul,
                'permintaanterapikonsul' => $permintaanterapikonsul,
                'tempatkonsul' => $tempatkonsul,
                'tanggalkonsul' => $tanggalkonsul,
                'pasienkonsul' => $qrCodeKonsPas2,
                'drskfrkonsul' => $qrCodeSpKFR2,
                'dataListKonsulRehab' => $dataListKonsulRehab,
                'cekdatakonsul' => $cekdatakonsul
            );
        };

        // key 27-08-2024
        // --------------------Laporan Operasi-------------------
        if ($xcetaklaporanoperasi == 1) {
            $dataLaporanOperasi = [];

            $laporanoperasi = DB::select(DB::raw("
                SELECT ep.noemr, epd.emrdfk, epd.value, ep.namaruangan 
                FROM emrpasiend_t as epd 
                JOIN emrpasien_t as ep on ep.noemr = epd.emrpasienfk 
                WHERE ep.noregistrasifk = '$noregistrasi' and ep.emrfk = 899 
                ORDER BY ep.tglemr ASC
            "));

            if (count($laporanoperasi) > 0) {
                $groupedOperasi = [];
                foreach ($laporanoperasi as $op) {
                    $groupedOperasi[$op->noemr][] = $op;
                }

                foreach ($groupedOperasi as $noemr => $details) {

                    $tanggaloperasi = '';
                    $dokterbedah = '';
                    $asisten1 = '';
                    $perawatinstrumen = '';
                    $asisten2 = '';
                    $perawatsirkuler = '';
                    $ahlianestesi = '';
                    $jenisanestesi = '';
                    $perawatanestesi = '';
                    $diagnosaprabedah = '';
                    $indikasioperasi = '';
                    $diagnosapascabedah = '';
                    $jenisoperasi = '';
                    $desinfeksikulit = '';
                    $jaringaneksisiya = '';
                    $jaringaneksisitidak = '';
                    $mulai = '';
                    $selesai = '';
                    $lamaoperasi = '';
                    $jenisbahan = '';
                    $macamsayatan = '';
                    $posisipenderita = '';
                    $teknikoperasi = '';
                    $komplikasiya = '';
                    $komplikasitidak = '';
                    $penjabarankomplikasi = '';
                    $pendarahan = '';
                    $transfusidarah = '';
                    $implan = '';
                    $kontrolnadi = '';
                    $tensi = '';
                    $pernapasan = '';
                    $suhu = '';
                    $text1234 = '';
                    $puasa = '';
                    $drain = '';
                    $infus = '';
                    $obatobatan = '';
                    $gantibalut = '';
                    $lainlain = '';
                    $ttddokterbedahop = '';

                    foreach ($details as $op) {
                        if ($op->emrdfk == 4491) {
                            $tanggaloperasi = $op->value;
                        } else if ($op->emrdfk == 4478) {
                            $dokterbedah = $op->value;
                        } else if ($op->emrdfk == 4479) {
                            $asisten1 = $op->value;
                        } else if ($op->emrdfk == 4480) {
                            $perawatinstrumen = $op->value;
                        } else if ($op->emrdfk == 6584) {
                            $asisten2 = $op->value;
                        } else if ($op->emrdfk == 6585) {
                            $perawatsirkuler = $op->value;
                        } else if ($op->emrdfk == 6583) {
                            $ahlianestesi = $op->value;
                        } else if ($op->emrdfk == 4495) {
                            $jenisanestesi = $op->value;
                        } else if ($op->emrdfk == 6586) {
                            $perawatanestesi = $op->value;
                        } else if ($op->emrdfk == 4481) {
                            $diagnosaprabedah = $op->value;
                        } else if ($op->emrdfk == 6587) {
                            $indikasioperasi = $op->value;
                        } else if ($op->emrdfk == 4482) {
                            $diagnosapascabedah = $op->value;
                        } else if ($op->emrdfk == 8144) {
                            $jenisoperasi = $op->value;
                        } else if ($op->emrdfk == 6588) {
                            $desinfeksikulit = $op->value;
                        } else if ($op->emrdfk == 4489) {
                            $jaringaneksisiya = $op->value;
                        } else if ($op->emrdfk == 4488) {
                            $jaringaneksisitidak = $op->value;
                        } else if ($op->emrdfk == 4493) {
                            $lamaoperasi = $op->value;
                        } else if ($op->emrdfk == 4490) {
                            $jenisbahan = $op->value;
                        } else if ($op->emrdfk == 4494) {
                            $mulai = $op->value;
                        } else if ($op->emrdfk == 4496) {
                            $selesai = $op->value;
                        } else if ($op->emrdfk == 6589) {
                            $macamsayatan = $op->value;
                        } else if ($op->emrdfk == 6590) {
                            $posisipenderita = $op->value;
                        } else if ($op->emrdfk == 6591) {
                            $teknikoperasi = $op->value;
                        } else if ($op->emrdfk == 6592) {
                            $komplikasiya = $op->value;
                        } else if ($op->emrdfk == 6593) {
                            $komplikasitidak = $op->value;
                        } else if ($op->emrdfk == 6594) {
                            $penjabarankomplikasi = $op->value;
                        } else if ($op->emrdfk == 6595) {
                            $pendarahan = $op->value;
                        } else if ($op->emrdfk == 6596) {
                            $transfusidarah = $op->value;
                        } else if ($op->emrdfk == 6597) {
                            $implan = $op->value;
                        } else if ($op->emrdfk == 6598) {
                            $kontrolnadi = $op->value;
                        } else if ($op->emrdfk == 6599) {
                            $tensi = $op->value;
                        } else if ($op->emrdfk == 6600) {
                            $pernapasan = $op->value;
                        } else if ($op->emrdfk == 6601) {
                            $suhu = $op->value;
                        } else if ($op->emrdfk == 6602) {
                            $text1234 = $op->value;
                        } else if ($op->emrdfk == 6603) {
                            $puasa = $op->value;
                        } else if ($op->emrdfk == 6604) {
                            $drain = $op->value;
                        } else if ($op->emrdfk == 6605) {
                            $infus = $op->value;
                        } else if ($op->emrdfk == 6606) {
                            $obatobatan = $op->value;
                        } else if ($op->emrdfk == 6607) {
                            $gantibalut = $op->value;
                        } else if ($op->emrdfk == 6608) {
                            $lainlain = $op->value;
                        } else if ($op->emrdfk == 4503) {
                            $ttddokterbedahop = $op->value;
                        }
                    }

                    if ($jaringaneksisiya != '' && $jaringaneksisiya != '0') {
                        $jaringaneksisiya = 'checked';
                    }
                    if ($jaringaneksisitidak != '' && $jaringaneksisitidak != '0') {
                        $jaringaneksisitidak = 'checked';
                    }
                    if ($komplikasiya != '' && $komplikasiya != '0') {
                        $komplikasiya = 'checked';
                    }
                    if ($komplikasitidak != '' && $komplikasitidak != '0') {
                        $komplikasitidak = 'checked';
                    }
                    if ($kontrolnadi != '' && $kontrolnadi != '0') {
                        $kontrolnadi = 'checked';
                    }
                    if ($tensi != '' && $tensi != '0') {
                        $tensi = 'checked';
                    }
                    if ($pernapasan != '' && $pernapasan != '0') {
                        $pernapasan = 'checked';
                    }
                    if ($suhu != '' && $suhu != '0') {
                        $suhu = 'checked';
                    }

                    $qrCodeOP2 = '';
                    if ($ttddokterbedahop != '') {
                        $idDokterBedahArray = DB::select(DB::raw("SELECT id FROM pegawai_m where namalengkap = '$ttddokterbedahop' LIMIT 1"));
                        if (count($idDokterBedahArray) > 0) {
                            $qrCodeOP = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-new?idPegawai=" . $idDokterBedahArray[0]->id);
                            $qrCodeOP2 = $qrCodeOP->writeDataUri();
                        }
                    }

                    $dataLaporanOperasi[] = array(
                        'tanggaloperasi' => $tanggaloperasi,
                        'dokterbedah' => $dokterbedah,
                        'asisten1' => $asisten1,
                        'perawatinstrumen' => $perawatinstrumen,
                        'asisten2' => $asisten2,
                        'perawatsirkuler' => $perawatsirkuler,
                        'ahlianestesi' => $ahlianestesi,
                        'jenisanestesi' => $jenisanestesi,
                        'perawatanestesi' => $perawatanestesi,
                        'diagnosaprabedah' => $diagnosaprabedah,
                        'indikasioperasi' => $indikasioperasi,
                        'diagnosapascabedah' => $diagnosapascabedah,
                        'jenisoperasi' => $jenisoperasi,
                        'desinfeksikulit' => $desinfeksikulit,
                        'jaringaneksisiya' => $jaringaneksisiya,
                        'jaringaneksisitidak' => $jaringaneksisitidak,
                        'mulai' => $mulai,
                        'selesai' => $selesai,
                        'lamaoperasi' => $lamaoperasi,
                        'jenisbahan' => $jenisbahan,
                        'macamsayatan' => $macamsayatan,
                        'posisipenderita' => $posisipenderita,
                        'teknikoperasi' => $teknikoperasi,
                        'komplikasiya' => $komplikasiya,
                        'komplikasitidak' => $komplikasitidak,
                        'penjabarankomplikasi' => $penjabarankomplikasi,
                        'pendarahan' => $pendarahan,
                        'transfusidarah' => $transfusidarah,
                        'implan' => $implan,
                        'kontrolnadi' => $kontrolnadi,
                        'tensi' => $tensi,
                        'pernapasan' => $pernapasan,
                        'suhu' => $suhu,
                        'text1234' => $text1234,
                        'puasa' => $puasa,
                        'drain' => $drain,
                        'infus' => $infus,
                        'obatobatan' => $obatobatan,
                        'gantibalut' => $gantibalut,
                        'lainlain' => $lainlain,
                        'teknikoperasi' => $teknikoperasi,
                        'ttddokterbedahop' => $qrCodeOP2,
                        'ttddokterbedahopnama' => $ttddokterbedahop
                    );
                }
            }
        };
        // key 30-09-2024
        // --------------------SPRI-------------------
        if ($xcetakspri == 1) {
            $dataSPRI = [];
            $spri = [];

            $darisp = '';
            $diagnosissp = '';
            $indikasisp = '';
            $tujuansp = '';
            $rencanasp = '';
            $perkiraansp = '';
            $risikotransmisi = '';
            $tglmasuksp = '';
            $tgloperasisp = '';
            $picucheckbox = '';
            $nicucheckbox = '';
            $icucheckbox = '';
            $perinacheckbox = '';
            $isolasitbcheckbox = '';
            $isolasinontbcheckbox = '';
            $isolasipinerecheckbox = '';
            $tahanancheckbox = '';
            $rawatbiasacheckbox = '';
            $konfirmasisp = '';
            $ruangansp = '';
            $statussp = '';
            $tglsuratsp = '';
            $ttdpasiensp = '';
            $doktersp = '';

            if ($xcetakspri) {
                $spri = DB::select(DB::raw("
                select epd.emrdfk, epd.value, ep.namaruangan from emrpasiend_t as epd join
                emrpasien_t as ep on ep.noemr = epd.emrpasienfk 
                where ep.noregistrasifk = '$noregistrasi' and ep.emrfk = 2022 and epd.emrfk = 2022 AND ep.noemr = (
                SELECT ep_inner.noemr
                FROM emrpasien_t AS ep_inner
                WHERE ep_inner.noregistrasifk = '$noregistrasi' 
                AND ep_inner.emrfk = 2022
                ORDER BY ep_inner.tglemr DESC
                LIMIT 1);
                "));
                if (count($spri) > 0) {
                    foreach ($spri as $sp) {

                        if ($sp->emrdfk == 367) {
                            $darisp = $sp->value;
                        } else if ($sp->emrdfk == 702) {
                            $diagnosissp = $sp->value;
                        } else if ($sp->emrdfk == 358) {
                            $indikasisp = $sp->value;
                        } else if ($sp->emrdfk == 218) {
                            $tujuansp = $sp->value;
                        } else if ($sp->emrdfk == 379) {
                            $rencanasp = $sp->value;
                        } else if ($sp->emrdfk == 372) {
                            $perkiraansp = $sp->value;
                        } else if ($sp->emrdfk == 1901302607) {
                            $risikotransmisi = $sp->value;
                        } else if ($sp->emrdfk == 796) {
                            $tglmasuksp = $sp->value;
                        } else if ($sp->emrdfk == 797) {
                            $tgloperasisp = $sp->value;
                        } else if ($sp->emrdfk == 1) {
                            $picucheckbox = $sp->value;
                        } else if ($sp->emrdfk == 2) {
                            $nicucheckbox = $sp->value;
                        } else if ($sp->emrdfk == 3) {
                            $icucheckbox = $sp->value;
                        } else if ($sp->emrdfk == 5) {
                            $perinacheckbox = $sp->value;
                        } else if ($sp->emrdfk == 4) {
                            $isolasitbcheckbox = $sp->value;
                        } else if ($sp->emrdfk == 7) {
                            $isolasinontbcheckbox = $sp->value;
                        } else if ($sp->emrdfk == 8) {
                            $isolasipinerecheckbox = $sp->value;
                        } else if ($sp->emrdfk == 10) {
                            $tahanancheckbox = $sp->value;
                        } else if ($sp->emrdfk == 6) {
                            $rawatbiasacheckbox = $sp->value;
                        } else if ($sp->emrdfk == 366) {
                            $konfirmasisp = $sp->value;
                        } else if ($sp->emrdfk == 4806) {
                            $ruangansp = $sp->value;
                        } else if ($sp->emrdfk == 130) {
                            $statussp = $sp->value;
                        } else if ($sp->emrdfk == 798) {
                            $tglsuratsp = $sp->value;
                        } else if ($sp->emrdfk == 19) {
                            $ttdpasiensp = $sp->value;
                        } else if ($sp->emrdfk == 799) {
                            $doktersp = $sp->value;
                        }
                    }
                    if ($picucheckbox != '') {
                        if ($picucheckbox != '0') {
                            $picucheckbox = 'checked';
                        }
                    }
                    if ($nicucheckbox != '') {
                        if ($nicucheckbox != '0') {
                            $nicucheckbox = 'checked';
                        }
                    }
                    if ($icucheckbox != '') {
                        if ($icucheckbox != '0') {
                            $icucheckbox = 'checked';
                        }
                    }
                    if ($perinacheckbox != '') {
                        if ($perinacheckbox != '0') {
                            $perinacheckbox = 'checked';
                        }
                    }
                    if ($isolasitbcheckbox != '') {
                        if ($isolasitbcheckbox != '0') {
                            $isolasitbcheckbox = 'checked';
                        }
                    }
                    if ($isolasinontbcheckbox != '') {
                        if ($isolasinontbcheckbox != '0') {
                            $isolasinontbcheckbox = 'checked';
                        }
                    }
                    if ($isolasipinerecheckbox != '') {
                        if ($isolasipinerecheckbox != '0') {
                            $isolasipinerecheckbox = 'checked';
                        }
                    }
                    if ($tahanancheckbox != '') {
                        if ($tahanancheckbox != '0') {
                            $tahanancheckbox = 'checked';
                        }
                    }
                    if ($rawatbiasacheckbox != '') {
                        if ($rawatbiasacheckbox != '0') {
                            $rawatbiasacheckbox = 'checked';
                        }
                    }

                    $qrNamaPasien = new QrCode($ttdpasiensp);
                    echo "</br>";
                    header('Contert-Type: application/' . $qrNamaPasien->getContentType());
                    $qrNamaPasien2 = $qrNamaPasien->writeDataUri();

                    $qrDokterSp = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-new?namaPegawai=" . $doktersp);
                    echo "</br>";
                    header('Contert-Type: application/' . $qrDokterSp->getContentType());
                    $qrDokterSp2 = $qrDokterSp->writeDataUri();

                    $dataSPRI = array(
                        'darisp' => $darisp,
                        'diagnosissp' => $diagnosissp,
                        'indikasisp' => $indikasisp,
                        'tujuansp' => $tujuansp,
                        'rencanasp' => $rencanasp,
                        'perkiraansp' => $perkiraansp,
                        'risikotransmisi' => $risikotransmisi,
                        'tglmasuksp' => $tglmasuksp,
                        'tgloperasisp' => $tgloperasisp,
                        'picucheckbox' => $picucheckbox,
                        'nicucheckbox' => $nicucheckbox,
                        'icucheckbox' => $icucheckbox,
                        'perinacheckbox' => $perinacheckbox,
                        'isolasitbcheckbox' => $isolasitbcheckbox,
                        'isolasinontbcheckbox' => $isolasinontbcheckbox,
                        'isolasipinerecheckbox' => $isolasipinerecheckbox,
                        'tahanancheckbox' => $tahanancheckbox,
                        'rawatbiasacheckbox' => $rawatbiasacheckbox,
                        'konfirmasisp' => $konfirmasisp,
                        'ruangansp' => $ruangansp,
                        'statussp' => $statussp,
                        'tglsuratsp' => $tglsuratsp,
                        'ttdpasiensp' => $ttdpasiensp,
                        'doktersp' => $doktersp,
                        'qrDokterSp' => $qrDokterSp2,
                        'qrNamaPasien' => $qrNamaPasien2
                    );
                }
            }
        };

        // ---------------------Pengkajian Awal Medis IGD---------------------
        $pengkajianmedisigd = [];
        $dataPengkajianMedisIGD = [];
        $adapengkajianmedisigd = 'false';
        $tgldilayani = '';
        $alergi = '';
        $anamnesis = '';
        $allo = '';
        $auto = '';
        $tekanandarah = '';
        $pernapasan = '';
        $suhu = '';
        $nadi = '';
        $spo2 = '';
        $kesadaran = '';
        $keadaanumum = '';
        $beratbadan = '';
        $tinggibadan = '';
        $e = '';
        $m = '';
        $v = '';
        $tidakkepala = '';
        $adakepala = '';
        $kepala = '';
        $tidakleher = '';
        $adaleher = '';
        $leher = '';
        $tidakthorax = '';
        $adathorax = '';
        $thorax = '';
        $tidakabdomen = '';
        $adaabdomen = '';
        $abdomen = '';
        $tidakextremitas = '';
        $adaextremitas = '';
        $extremitas = '';
        $tidakgenitalia = '';
        $adagenitalia = '';
        $genitalia = '';
        $tidakanus = '';
        $adaanus = '';
        $anus = '';
        $tidakneurologis = '';
        $adaneurologis = '';
        $neurologis = '';
        $tidakkulit = '';
        $adakulit = '';
        $kulit = '';
        $oksigen = '';
        $tatalaksana = '';
        $daftarmasalah = '';
        $instruksimedis = '';
        $ketoksigen = '';
        $kettatalaksana = '';
        $ekg = '';
        $pulang = '';
        $tglpulangigd = '';
        $rawat = '';
        $sembuh = '';
        $belumsembuh = '';
        $meninggal = '';
        $intensif = '';
        $ketintensif = '';
        $ruanganlain = '';
        $ketruanganlain = '';
        $tidakkontrol = '';
        $adakontrol = '';
        $tglkontroligd = '';
        $ketkontrol = '';
        $politujuankontrol = '';
        $persutujuandokter = '';
        $melarikandiri = '';
        $apsigd = '';
        $pindahkerslain = '';
        $tgligd = '';
        $menanganiigd = '';
        $dpjpigd = '';
        $qrDokterMenanganiPMI2 = '';
        $qrDokterDPJPPMI2 = '';
        $qrPemberiPesan2 = '';
        $qrPemberiPesan4 = '';
        $igdicd10 = '';
        $PemberiPesan1 = '';
        $PemberiPesan2 = '';
        $ats = '';
        $alergiobattidak = '';
        $alergiobatya = '';
        $namaobat = '';
        $alergimakanantidak = '';
        $alergimakananya = '';
        $namamakanan = '';
        $alergilaintidak = '';
        $alergilainya = '';
        $berharapmatitidak = '';
        $berharapmatiya = '';
        $menyakitidiritidak = '';
        $menyakitidiriya = '';
        $berfikirbundirtidak = '';
        $berfikirbundirya = '';
        $rencanabundirtidak = '';
        $rencanabundirya = '';
        $mencobabundirtidak = '';
        $mencobabundirya = '';
        $riwayatmencobabundirtidak = '';
        $riwayatmencobabundirya = '';
        $namalain = '';
        $namakeluarga = '';
        $keluhanutama = '';
        $riwayatpenyakitdahulutidak = '';
        $riwayatpenyakitdahuluya = '';
        $riwayatpenyakitdahulu = '';
        $anamnesistambahan = '';
        $riwayatpenggunaanobat = '';
        $tidakmata = '';
        $adamata = '';
        $mata = '';
        $hamilya = '';
        $hamiltidak = '';
        $hamilG = '';
        $hamilP = '';
        $hamilA = '';
        $usiahamil = '';
        $masalahkeperawatan = '';
        $diagnosabanding = '';
        $tgltatalaksana = '';
        $pasien = '';
        $namapasien = '';
        $keluarga = '';
        $hubungankeluarga = '';
        $penanggungjawab = '';
        $namapenanggungjawab = '';
        $rresusitasi = '';
        $rawatinap = '';
        $rtindakan = '';
        $rujukinternal = '';
        $pulangaps = '';
        $diijinkanpulang = '';
        $meninggal = '';
        $tanggalmeninggal = '';
        $ambulancersbsa = '';
        $mobiljenazah = '';
        $kendaraanpribadi = '';
        $transportasilain = '';
        $kategoritransfer0 = '';
        $kategoritransfer05 = '';
        $kategoritransfer1 = '';
        $kategoritransfer2 = '';
        $kategoritransfer3 = '';
        $saatpulang = '';
        $saatdirujukeksternal = '';
        $melarikandiri = '';
        $kesadaran2 = '';
        $e2 = '';
        $m2 = '';
        $v2 = '';
        $tekananDarah2 = '';
        $pernafasan2 = '';
        $suhu2 = '';
        $nadi2 = '';
        $spo22 = '';
        $tglkonsultasidokter = '';
        $tglpulangjam = '';
        if ($xcetakpengkajianigd == 1) {
            //         $pengkajianmedisigd = DB::select(DB::raw("
            // select epd.emrdfk, epd.value from   emrpasiend_t as epd join
            // emrpasien_t as ep on ep.noemr = epd.emrpasienfk
            // where ep.noregistrasifk = '$noregistrasi' and ep.emrfk = 869
            // "));

            $lastEmr = \DB::table('emrpasien_t')
                ->where('noregistrasifk', $noregistrasi)
                ->where('emrfk', 869)
                ->orderBy('tglemr', 'desc')
                ->first();

            if ($lastEmr) {
                $pengkajianmedisigd = \DB::table('emrpasiend_t as emrdp')
                    ->select('emrdp.emrdfk', 'emrdp.value')
                    ->where('emrdp.emrpasienfk', $lastEmr->noemr)
                    ->where('emrdp.statusenabled', true)
                    ->get();
            }


            if (count($pengkajianmedisigd) > 0) {
                $adapengkajianmedisigd = 'true';
                foreach ($pengkajianmedisigd as $pmi) {

                    if ($pmi->emrdfk == 2404) {
                        $tgldilayani = $pmi->value;
                    } else if ($pmi->emrdfk == 2405) {
                        $alergi = $pmi->value;
                    } else if ($pmi->emrdfk == 2406) {
                        $allo = $pmi->value;
                    } else if ($pmi->emrdfk == 2407) {
                        $auto = $pmi->value;
                    } else if ($pmi->emrdfk == 2408) {
                        $anamnesis = $pmi->value;
                    } else if ($pmi->emrdfk == 2409) {
                        $tekanandarah = $pmi->value;
                    } else if ($pmi->emrdfk == 2410) {
                        $pernapasan = $pmi->value;
                    } else if ($pmi->emrdfk == 2411) {
                        $suhu = $pmi->value;
                    } else if ($pmi->emrdfk == 2412) {
                        $nadi = $pmi->value;
                    } else if ($pmi->emrdfk == 2413) {
                        $spo2 = $pmi->value;
                    } else if ($pmi->emrdfk == 2414) {
                        $split = explode('~', $pmi->value);
                        $kesadaran = isset($split[1]) ? $split[1] : $pmi->value;
                    } else if ($pmi->emrdfk == 2415) {
                        $keadaanumum = $pmi->value;
                    } else if ($pmi->emrdfk == 2416) {
                        $beratbadan = $pmi->value;
                    } else if ($pmi->emrdfk == 2417) {
                        $tinggibadan = $pmi->value;
                    } else if ($pmi->emrdfk == 2418) {
                        $e = $pmi->value;
                    } else if ($pmi->emrdfk == 2419) {
                        $m = $pmi->value;
                    } else if ($pmi->emrdfk == 2420) {
                        $v = $pmi->value;
                    } else if ($pmi->emrdfk == 2618) {
                        $tidakkepala = $pmi->value;
                    } else if ($pmi->emrdfk == 2619) {
                        $adakepala = $pmi->value;
                    } else if ($pmi->emrdfk == 2620) {
                        $kepala = $pmi->value;
                    } else if ($pmi->emrdfk == 2621) {
                        $tidakleher = $pmi->value;
                    } else if ($pmi->emrdfk == 2622) {
                        $adaleher = $pmi->value;
                    } else if ($pmi->emrdfk == 2623) {
                        $leher = $pmi->value;
                    } else if ($pmi->emrdfk == 2624) {
                        $tidakthorax = $pmi->value;
                    } else if ($pmi->emrdfk == 2625) {
                        $adathorax = $pmi->value;
                    } else if ($pmi->emrdfk == 2626) {
                        $thorax = $pmi->value;
                    } else if ($pmi->emrdfk == 2627) {
                        $tidakabdomen = $pmi->value;
                    } else if ($pmi->emrdfk == 2628) {
                        $adaabdomen = $pmi->value;
                    } else if ($pmi->emrdfk == 2629) {
                        $abdomen = $pmi->value;
                    } else if ($pmi->emrdfk == 2630) {
                        $tidakextremitas = $pmi->value;
                    } else if ($pmi->emrdfk == 2631) {
                        $adaextremitas = $pmi->value;
                    } else if ($pmi->emrdfk == 2632) {
                        $extremitas = $pmi->value;
                    } else if ($pmi->emrdfk == 2633) {
                        $tidakgenitalia = $pmi->value;
                    } else if ($pmi->emrdfk == 2634) {
                        $adagenitalia = $pmi->value;
                    } else if ($pmi->emrdfk == 2635) {
                        $genitalia = $pmi->value;
                    } else if ($pmi->emrdfk == 2676) {
                        $tidakanus = $pmi->value;
                    } else if ($pmi->emrdfk == 2677) {
                        $adaanus = $pmi->value;
                    } else if ($pmi->emrdfk == 2678) {
                        $anus = $pmi->value;
                    } else if ($pmi->emrdfk == 2679) {
                        $tidakneurologis = $pmi->value;
                    } else if ($pmi->emrdfk == 2680) {
                        $adaneurologis = $pmi->value;
                    } else if ($pmi->emrdfk == 2681) {
                        $neurologis = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300359) {
                        $tidakkulit = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300360) {
                        $adakulit = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300361) {
                        $kulit = $pmi->value;
                    } else if ($pmi->emrdfk == 2425) {
                        $daftarmasalah = $pmi->value;
                    } else if ($pmi->emrdfk == 2636) {
                        $oksigen = $pmi->value;
                    } else if ($pmi->emrdfk == 2637) {
                        $tatalaksana = $pmi->value;
                    } else if ($pmi->emrdfk == 2440) {
                        $instruksimedis = $pmi->value;
                    } else if ($pmi->emrdfk == 2638) {
                        $ketoksigen = $pmi->value;
                    } else if ($pmi->emrdfk == 2639) {
                        $kettatalaksana = $pmi->value;
                    } else if ($pmi->emrdfk == 2427) {
                        $ekg = $pmi->value;
                    } else if ($pmi->emrdfk == 2428) {
                        $pulang = $pmi->value;
                    } else if ($pmi->emrdfk == 2429) {
                        $tglpulangigd = $pmi->value;
                    } else if ($pmi->emrdfk == 2430) {
                        $rawat = $pmi->value;
                    } else if ($pmi->emrdfk == 2431) {
                        $sembuh = $pmi->value;
                    } else if ($pmi->emrdfk == 2432) {
                        $belumsembuh = $pmi->value;
                    } else if ($pmi->emrdfk == 2433) {
                        $meninggal = $pmi->value;
                    } else if ($pmi->emrdfk == 2434) {
                        $intensif = $pmi->value;
                    } else if ($pmi->emrdfk == 2435) {
                        $ketintensif = $pmi->value;
                    } else if ($pmi->emrdfk == 2436) {
                        $ruanganlain = $pmi->value;
                    } else if ($pmi->emrdfk == 2437) {
                        $ketruanganlain = $pmi->value;
                    } else if ($pmi->emrdfk == 2438) {
                        $tidakkontrol = $pmi->value;
                    } else if ($pmi->emrdfk == 2439) {
                        $adakontrol = $pmi->value;
                    } else if ($pmi->emrdfk == 2449) {
                        $tglkontroligd = $pmi->value;
                    } else if ($pmi->emrdfk == 2440) {
                        $ketkontrol = $pmi->value;
                    } else if ($pmi->emrdfk == 2441) {
                        $politujuankontrol = $pmi->value;
                    } else if ($pmi->emrdfk == 2442) {
                        $persutujuandokter = $pmi->value;
                    } else if ($pmi->emrdfk == 2443) {
                        $melarikandiri = $pmi->value;
                    } else if ($pmi->emrdfk == 2444) {
                        $apsigd = $pmi->value;
                    } else if ($pmi->emrdfk == 2445) {
                        $pindahkerslain = $pmi->value;
                    } else if ($pmi->emrdfk == 2446) {
                        $tgligd = $pmi->value;
                    } else if ($pmi->emrdfk == 2447) {
                        $menanganiigd = $pmi->value;
                    } else if ($pmi->emrdfk == 2448) {
                        $dpjpigd = $pmi->value;
                    } else if ($pmi->emrdfk == 2426) {
                        $igdicd10 = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300363) {
                        $PemberiPesan1 = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300364) {
                        $PemberiPesan2 = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300286) {
                        $ats = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300287) {
                        $alergiobattidak = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300288) {
                        $alergiobatya = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300289) {
                        $namaobat = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300290) {
                        $alergimakanantidak = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300291) {
                        $alergimakananya = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300292) {
                        $namamakanan = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300293) {
                        $alergilaintidak = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300294) {
                        $alergilainya = $pmi->value;
                    } else if ($pmi->emrdfk == 1) {
                        $berharapmatiya = $pmi->value;
                    } else if ($pmi->emrdfk == 2) {
                        $berharapmatitidak = $pmi->value;
                    } else if ($pmi->emrdfk == 3) {
                        $menyakitidiriya = $pmi->value;
                    } else if ($pmi->emrdfk == 4) {
                        $menyakitidiritidak = $pmi->value;
                    } else if ($pmi->emrdfk == 5) {
                        $berfikirbundirya = $pmi->value;
                    } else if ($pmi->emrdfk == 6) {
                        $berfikirbundirtidak = $pmi->value;
                    } else if ($pmi->emrdfk == 7) {
                        $rencanabundirya = $pmi->value;
                    } else if ($pmi->emrdfk == 8) {
                        $rencanabundirtidak = $pmi->value;
                    } else if ($pmi->emrdfk == 10) {
                        $mencobabundirya = $pmi->value;
                    } else if ($pmi->emrdfk == 11) {
                        $mencobabundirtidak = $pmi->value;
                    } else if ($pmi->emrdfk == 12) {
                        $riwayatmencobabundirya = $pmi->value;
                    } else if ($pmi->emrdfk == 13) {
                        $riwayatmencobabundirtidak = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300295) {
                        $namalain = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300296) {
                        $namakeluarga = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300297) {
                        $keluhanutama = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300306) {
                        $riwayatpenyakitdahulutidak = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300305) {
                        $riwayatpenyakitdahuluya = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300299) {
                        $riwayatpenyakitdahulu = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300300) {
                        $anamnesistambahan = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300301) {
                        $riwayatpenggunaanobat = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300302) {
                        $nyeriringan = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300303) {
                        $nyerisedang = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300304) {
                        $nyeriberat = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300356) {
                        $tidakmata = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300357) {
                        $adamata = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300358) {
                        $mata = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300307) {
                        $hamiltidak = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300308) {
                        $hamilya = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300309) {
                        $hamilG = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300310) {
                        $hamilP = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300311) {
                        $hamilA = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300312) {
                        $usiahamil = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300314) {
                        $masalahkeperawatan = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300313) {
                        $diagnosabanding = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300315) {
                        $tgltatalaksana = !empty($pmi->value) ? $pmi->value : '';
                    } else if ($pmi->emrdfk == 1901300362) {
                        $tglkonsultasidokter = !empty($pmi->value) ? $pmi->value : '';
                    } else if ($pmi->emrdfk == 1901300340) {
                        $tglpulangjam = !empty($pmi->value) ? $pmi->value : '';
                    } else if ($pmi->emrdfk == 1901300316) {
                        $pasien = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300317) {
                        $namapasien = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300318) {
                        $keluarga = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300319) {
                        $hubungankeluarga = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300320) {
                        $penanggungjawab = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300321) {
                        $namapenanggungjawab = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300322) {
                        $penerimapenjelasan = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300323) {
                        $rresusitasi = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300324) {
                        $rawatinap = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300325) {
                        $rtindakan = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300326) {
                        $rujukinternal = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300327) {
                        $pulangaps = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300328) {
                        $diijinkanpulang = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300329) {
                        $meninggal = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300330) {
                        $tanggalmeninggal = !empty($pmi->value) ? $pmi->value : null;
                    } else if ($pmi->emrdfk == 1901300331) {
                        $ambulancersbsa = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300332) {
                        $mobiljenazah = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300333) {
                        $kendaraanpribadi = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300334) {
                        $transportasilain = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300335) {
                        $kategoritransfer0 = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300336) {
                        $kategoritransfer05 = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300337) {
                        $kategoritransfer1 = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300338) {
                        $kategoritransfer2 = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300339) {
                        $kategoritransfer3 = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300353) {
                        $saatpulang = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300354) {
                        $saatdirujukeksternal = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300355) {
                        $melarikandiri = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300341) {
                        $tekananDarah2 = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300342) {
                        $pernapasan2 = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300343) {
                        $suhu2 = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300344) {
                        $nadi2 = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300345) {
                        $spo22 = $pmi->value;
                    } else if ($pmi->emrdfk == 1901300346) {
                        $split = explode('~', $pmi->value);
                        $kesadaran2 = isset($split[1]) ? $split[1] : $pmi->value;
                    } else if ($pmi->emrdfk == 1901300350) {
                        $split = explode('~', $pmi->value);
                        $e2 = isset($split[1]) ? $split[1] : $pmi->value;
                    } else if ($pmi->emrdfk == 1901300351) {
                        $split = explode('~', $pmi->value);
                        $m2 = isset($split[1]) ? $split[1] : $pmi->value;
                    } else if ($pmi->emrdfk == 1901300352) {
                        $split = explode('~', $pmi->value);
                        $v2 = isset($split[1]) ? $split[1] : $pmi->value;
                    }
                }
                $dt = Carbon::parse($tgldilayani)->timezone('Asia/Jakarta');
                $tgldilayani = $dt->format('Y-m-d H:i:s');
                $tampunge = explode("~", $e);
                $e = $tampunge[0];
                $tampungm = explode("~", $m);
                $m = $tampungm[0];
                $tampungv = explode("~", $v);
                $v = $tampungv[0];
                if ($auto != '') {
                    $auto = 'checked';
                }
                if ($allo != '') {
                    $allo = 'checked';
                }
                if ($tidakkepala != '') {
                    if ($tidakkepala != '0') {
                        $tidakkepala = 'checked';
                    }
                }
                if ($adakepala != '') {
                    if ($adakepala != '0') {
                        $adakepala = 'checked';
                    }
                }
                if ($tidakleher != '') {
                    if ($tidakleher != '0') {
                        $tidakleher = 'checked';
                    }
                }
                if ($adaleher != '') {
                    if ($adaleher != '0') {
                        $adaleher = 'checked';
                    }
                }
                if ($tidakthorax != '') {
                    if ($tidakthorax != '0') {
                        $tidakthorax = 'checked';
                    }
                }
                if ($adathorax != '') {
                    if ($adathorax != '0') {
                        $adathorax = 'checked';
                    }
                }
                if ($tidakabdomen != '') {
                    if ($tidakabdomen != '0') {
                        $tidakabdomen = 'checked';
                    }
                }
                if ($adaabdomen != '') {
                    if ($adaabdomen != '0') {
                        $adaabdomen = 'checked';
                    }
                }
                if ($tidakextremitas != '') {
                    if ($tidakextremitas != '0') {
                        $tidakextremitas = 'checked';
                    }
                }
                if ($adaextremitas != '') {
                    if ($adaextremitas != '0') {
                        $adaextremitas = 'checked';
                    }
                }
                if ($tidakgenitalia != '') {
                    if ($tidakgenitalia != '0') {
                        $tidakgenitalia = 'checked';
                    }
                }
                if ($adagenitalia != '') {
                    if ($adagenitalia != '0') {
                        $adagenitalia = 'checked';
                    }
                }
                if ($tidakanus != '') {
                    if ($tidakanus != '0') {
                        $tidakanus = 'checked';
                    }
                }
                if ($adaanus != '') {
                    if ($adaanus != '0') {
                        $adaanus = 'checked';
                    }
                }
                if ($tidakneurologis != '') {
                    if ($tidakneurologis != '0') {
                        $tidakneurologis = 'checked';
                    }
                }
                if ($adaneurologis != '') {
                    if ($adaneurologis != '0') {
                        $adaneurologis = 'checked';
                    }
                }
                if ($tidakkulit != '') {
                    if ($tidakkulit != '0') {
                        $tidakkulit = 'checked';
                    }
                }
                if ($adakulit != '') {
                    if ($adakulit != '0') {
                        $adakulit = 'checked';
                    }
                }
                if ($oksigen != '') {
                    if ($oksigen != '0') {
                        $oksigen = 'checked';
                    }
                }
                if ($tatalaksana != '') {
                    if ($tatalaksana != '0') {
                        $tatalaksana = 'checked';
                    }
                }
                if ($pulang != '') {
                    if ($pulang != '0') {
                        $pulang = 'checked';
                    }
                }
                if ($rawat != '') {
                    if ($rawat != '0') {
                        $rawat = 'checked';
                    }
                }
                if ($sembuh != '') {
                    if ($sembuh != '0') {
                        $sembuh = 'checked';
                    }
                }
                if ($belumsembuh != '') {
                    if ($belumsembuh != '0') {
                        $belumsembuh = 'checked';
                    }
                }
                if ($meninggal != '') {
                    if ($meninggal != '0') {
                        $meninggal = 'checked';
                    }
                }
                if ($intensif != '') {
                    if ($intensif != '0') {
                        $intensif = 'checked';
                    }
                }
                if ($ruanganlain != '') {
                    if ($ruanganlain != '0') {
                        $ruanganlain = 'checked';
                    }
                }
                if ($tidakkontrol != '') {
                    if ($tidakkontrol != '0') {
                        $tidakkontrol = 'checked';
                    }
                }
                if ($adakontrol != '') {
                    if ($adakontrol != '0') {
                        $adakontrol = 'checked';
                    }
                }
                if ($persutujuandokter != '') {
                    if ($persutujuandokter != '0') {
                        $persutujuandokter = 'checked';
                    }
                }
                if ($melarikandiri != '') {
                    if ($melarikandiri != '0') {
                        $melarikandiri = 'checked';
                    }
                }
                if ($apsigd != '') {
                    if ($apsigd != '0') {
                        $apsigd = 'checked';
                    }
                }
                if ($pindahkerslain != '') {
                    if ($pindahkerslain != '0') {
                        $pindahkerslain = 'checked';
                    }
                }
                if ($alergiobattidak != '') {
                    if ($alergiobattidak != '0') {
                        $alergiobattidak = 'checked';
                    }
                }
                if ($alergiobatya != '') {
                    if ($alergiobatya != '0') {
                        $alergiobatya = 'checked';
                    }
                }
                if ($alergimakanantidak != '') {
                    if ($alergimakanantidak != '0') {
                        $alergimakanantidak = 'checked';
                    }
                }
                if ($alergimakananya != '') {
                    if ($alergimakananya != '0') {
                        $alergimakananya = 'checked';
                    }
                }
                if ($alergilaintidak != '') {
                    if ($alergilaintidak != '0') {
                        $alergilaintidak = 'checked';
                    }
                }
                if ($alergilainya != '') {
                    if ($alergilainya != '0') {
                        $alergilainya = 'checked';
                    }
                }
                if ($berharapmatiya != '') {
                    if ($berharapmatiya != '0') {
                        $berharapmatiya = 'checked';
                    }
                }
                if ($berharapmatitidak != '') {
                    if ($berharapmatitidak != '0') {
                        $berharapmatitidak = 'checked';
                    }
                }
                if ($menyakitidiriya != '') {
                    if ($menyakitidiriya != '0') {
                        $menyakitidiriya = 'checked';
                    }
                }
                if ($menyakitidiritidak != '') {
                    if ($menyakitidiritidak != '0') {
                        $menyakitidiritidak = 'checked';
                    }
                }
                if ($berfikirbundirya != '') {
                    if ($berfikirbundirya != '0') {
                        $berfikirbundirya = 'checked';
                    }
                }
                if ($berfikirbundirtidak != '') {
                    if ($berfikirbundirtidak != '0') {
                        $berfikirbundirtidak = 'checked';
                    }
                }
                if ($rencanabundirya != '') {
                    if ($rencanabundirya != '0') {
                        $rencanabundirya = 'checked';
                    }
                }
                if ($rencanabundirtidak != '') {
                    if ($rencanabundirtidak != '0') {
                        $rencanabundirtidak = 'checked';
                    }
                }
                if ($mencobabundirya != '') {
                    if ($mencobabundirya != '0') {
                        $mencobabundirya = 'checked';
                    }
                }
                if ($mencobabundirtidak != '') {
                    if ($mencobabundirtidak != '0') {
                        $mencobabundirtidak = 'checked';
                    }
                }
                if ($riwayatmencobabundirya != '') {
                    if ($riwayatmencobabundirya != '0') {
                        $riwayatmencobabundirya = 'checked';
                    }
                }
                if ($riwayatmencobabundirtidak != '') {
                    if ($riwayatmencobabundirtidak != '0') {
                        $riwayatmencobabundirtidak = 'checked';
                    }
                }
                if ($riwayatpenyakitdahuluya != '') {
                    if ($riwayatpenyakitdahuluya != '0') {
                        $riwayatpenyakitdahuluya = 'checked';
                    }
                }
                if ($nyeriringan != '') {
                    if ($nyeriringan != '0') {
                        $nyeriringan = 'checked';
                    }
                }
                if ($nyerisedang != '') {
                    if ($nyerisedang != '0') {
                        $nyerisedang = 'checked';
                    }
                }
                if ($nyeriberat != '') {
                    if ($nyeriberat != '0') {
                        $nyeriberat = 'checked';
                    }
                }
                if ($tidakmata != '') {
                    if ($tidakmata != '0') {
                        $tidakmata = 'checked';
                    }
                }
                if ($adamata != '') {
                    if ($adamata != '0') {
                        $adamata = 'checked';
                    }
                }
                if ($hamiltidak != '') {
                    if ($hamiltidak != '0') {
                        $hamiltidak = 'checked';
                    }
                }
                if ($hamilya != '') {
                    if ($hamilya != '0') {
                        $hamilya = 'checked';
                    }
                }
                if ($pasien != '') {
                    if ($pasien != '0') {
                        $pasien = 'checked';
                    }
                }
                if ($keluarga != '') {
                    if ($keluarga != '0') {
                        $keluarga = 'checked';
                    }
                }
                if ($penanggungjawab != '') {
                    if ($penanggungjawab != '0') {
                        $penanggungjawab = 'checked';
                    }
                }
                if ($rresusitasi != '') {
                    if ($rresusitasi != '0') {
                        $rresusitasi = 'checked';
                    }
                }
                if ($rawatinap != '') {
                    if ($rawatinap != '0') {
                        $rawatinap = 'checked';
                    }
                }
                if ($rtindakan != '') {
                    if ($rtindakan != '0') {
                        $rtindakan = 'checked';
                    }
                }
                if ($rujukinternal != '') {
                    if ($rujukinternal != '0') {
                        $rujukinternal = 'checked';
                    }
                }
                if ($pulangaps != '') {
                    if ($pulangaps != '0') {
                        $pulangaps = 'checked';
                    }
                }
                if ($diijinkanpulang != '') {
                    if ($diijinkanpulang != '0') {
                        $diijinkanpulang = 'checked';
                    }
                }
                if ($meninggal != '') {
                    if ($meninggal != '0') {
                        $meninggal = 'checked';
                    }
                }
                if ($ambulancersbsa != '') {
                    if ($ambulancersbsa != '0') {
                        $ambulancersbsa = 'checked';
                    }
                }
                if ($mobiljenazah != '') {
                    if ($mobiljenazah != '0') {
                        $mobiljenazah = 'checked';
                    }
                }
                if ($kendaraanpribadi != '') {
                    if ($kendaraanpribadi != '0') {
                        $kendaraanpribadi = 'checked';
                    }
                }
                if ($transportasilain != '') {
                    if ($transportasilain != '0') {
                        $transportasilain = 'checked';
                    }
                }
                if ($kategoritransfer0 != '') {
                    if ($kategoritransfer0 != '0') {
                        $kategoritransfer0 = 'checked';
                    }
                }
                if ($kategoritransfer05 != '') {
                    if ($kategoritransfer05 != '0') {
                        $kategoritransfer05 = 'checked';
                    }
                }
                if ($kategoritransfer1 != '') {
                    if ($kategoritransfer1 != '0') {
                        $kategoritransfer1 = 'checked';
                    }
                }
                if ($kategoritransfer2 != '') {
                    if ($kategoritransfer2 != '0') {
                        $kategoritransfer2 = 'checked';
                    }
                }
                if ($kategoritransfer3 != '') {
                    if ($kategoritransfer3 != '0') {
                        $kategoritransfer3 = 'checked';
                    }
                }
                if ($saatpulang != '') {
                    if ($saatpulang != '0') {
                        $saatpulang = 'checked';
                    }
                }
                if ($saatdirujukeksternal != '') {
                    if ($saatdirujukeksternal != '0') {
                        $saatdirujukeksternal = 'checked';
                    }
                }
                if ($melarikandiri != '') {
                    if ($melarikandiri != '0') {
                        $melarikandiri = 'checked';
                    }
                }

                $qrDokterMenanganiPMI = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $menanganiigd);
                echo "</br>";
                header('Contert-Type: application/' . $qrDokterMenanganiPMI->getContentType());
                $qrDokterMenanganiPMI2 = $qrDokterMenanganiPMI->writeDataUri();

                $qrDokterDPJPPMI = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $dpjpigd);
                echo "</br>";
                header('Contert-Type: application/' . $qrDokterDPJPPMI->getContentType());
                $qrDokterDPJPPMI2 = $qrDokterDPJPPMI->writeDataUri();

                if (!empty($PemberiPesan1)) {
                    $qrPemberiPesan = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $PemberiPesan1);
                    $qrPemberiPesan2 = $qrPemberiPesan->writeDataUri();
                } else {
                    $qrPemberiPesan2 = null;
                }

                if (!empty($PemberiPesan2)) {
                    $qrPemberiPesan3 = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $PemberiPesan2);
                    $qrPemberiPesan4 = $qrPemberiPesan3->writeDataUri();
                } else {
                    $qrPemberiPesan4 = null;
                }

                $dataPengkajianMedisIGD = array(
                    'adapengkajianmedisigd' => $adapengkajianmedisigd,
                    'tgldilayani' => $tgldilayani,
                    'alergi' => $alergi,
                    'allo' => $allo,
                    'auto' => $auto,
                    'anamnesis' => $anamnesis,
                    'tekanandarah' => $tekanandarah,
                    'pernapasan' => $pernapasan,
                    'suhu' => $suhu,
                    'nadi' => $nadi,
                    'spo2' => $spo2,
                    'kesadaran' => $kesadaran,
                    'keadaanumum' => $keadaanumum,
                    'beratbadan' => $beratbadan,
                    'tinggibadan' => $tinggibadan,
                    'e' => $e,
                    'm' => $m,
                    'v' => $v,
                    'tidakkepala' => $tidakkepala,
                    'adakepala' => $adakepala,
                    'kepala' => $kepala,
                    'tidakleher' => $tidakleher,
                    'adaleher' => $adaleher,
                    'leher' => $leher,
                    'tidakthorax' => $tidakthorax,
                    'adathorax' => $adathorax,
                    'thorax' => $thorax,
                    'tidakabdomen' => $tidakabdomen,
                    'adaabdomen' => $adaabdomen,
                    'abdomen' => $abdomen,
                    'tidakextremitas' => $tidakextremitas,
                    'adaextremitas' => $adaextremitas,
                    'extremitas' => $extremitas,
                    'tidakgenitalia' => $tidakgenitalia,
                    'adagenitalia' => $adagenitalia,
                    'genitalia' => $genitalia,
                    'tidakanus' => $tidakanus,
                    'adaanus' => $adaanus,
                    'anus' => $anus,
                    'tidakneurologis' => $tidakneurologis,
                    'adaneurologis' => $adaneurologis,
                    'neurologis' => $neurologis,
                    'tidakkulit' => $tidakkulit,
                    'adakulit' => $adakulit,
                    'kulit' => $kulit,
                    'daftarmasalah' => $daftarmasalah,
                    'igdicd10' => $igdicd10,
                    'oksigen' => $oksigen,
                    'tatalaksana' => $tatalaksana,
                    'instruksimedis' => $instruksimedis,
                    'ketoksigen' => $ketoksigen,
                    'kettatalaksana' => $kettatalaksana,
                    'ekg' => $ekg,
                    'pulang' => $pulang,
                    'tglpulangigd' => $tglpulangigd,
                    'rawat' => $rawat,
                    'sembuh' => $sembuh,
                    'belumsembuh' => $belumsembuh,
                    'meninggal' => $meninggal,
                    'intensif' => $intensif,
                    'ketintensif' => $ketintensif,
                    'ruanganlain' => $ruanganlain,
                    'ketruanganlain' => $ketruanganlain,
                    'tidakkontrol' => $tidakkontrol,
                    'adakontrol' => $adakontrol,
                    'tglkontroligd' => $tglkontroligd,
                    'ketkontrol' => $ketkontrol,
                    'politujuankontrol' => $politujuankontrol,
                    'persutujuandokter' => $persutujuandokter,
                    'melarikandiri' => $melarikandiri,
                    'apsigd' => $apsigd,
                    'pindahkerslain' => $pindahkerslain,
                    'tgligd' => $tgligd,
                    'menanganiigd' => $menanganiigd,
                    'dpjpigd' => $dpjpigd,
                    'PemberiPesan1' => $PemberiPesan1,
                    'PemberiPesan2' => $PemberiPesan2,
                    'qrDokterMenanganiPMI2' => $qrDokterMenanganiPMI2,
                    'qrDokterDPJPPMI2' => $qrDokterDPJPPMI2,
                    'qrPemberiPesan2' => $qrPemberiPesan2,
                    'qrPemberiPesan4' => $qrPemberiPesan4,
                    'ats' => $ats,
                    'alergiobattidak' => $alergiobattidak,
                    'alergiobatya' => $alergiobatya,
                    'namaobat' => $namaobat,
                    'alergimakanantidak' => $alergimakanantidak,
                    'alergimakananya' => $alergimakananya,
                    'namamakanan' => $namamakanan,
                    'alergilaintidak' => $alergilaintidak,
                    'alergilainya' => $alergilainya,
                    'berharapmatitidak' => $berharapmatitidak,
                    'berharapmatiya' => $berharapmatiya,
                    'menyakitidiritidak' => $menyakitidiritidak,
                    'menyakitidiriya' => $menyakitidiriya,
                    'berfikirbundirtidak' => $berfikirbundirtidak,
                    'berfikirbundirya' => $berfikirbundirya,
                    'rencanabundirtidak' => $rencanabundirtidak,
                    'rencanabundirya' => $rencanabundirya,
                    'mencobabundirtidak' => $mencobabundirtidak,
                    'mencobabundirya' => $mencobabundirya,
                    'riwayatmencobabundirtidak' => $riwayatmencobabundirtidak,
                    'riwayatmencobabundirya' => $riwayatmencobabundirya,
                    'namalain' => $namalain,
                    'namakeluarga' => $namakeluarga,
                    'keluhanutama' => $keluhanutama,
                    'riwayatpenyakitdahulutidak' => $riwayatpenyakitdahulutidak,
                    'riwayatpenyakitdahuluya' => $riwayatpenyakitdahuluya,
                    'riwayatpenyakitdahulu' => $riwayatpenyakitdahulu,
                    'anamnesistambahan' => $anamnesistambahan,
                    'riwayatpenggunaanobat' => $riwayatpenggunaanobat,
                    'nyeriringan' => $nyeriringan,
                    'nyerisedang' => $nyerisedang,
                    'nyeriberat' => $nyeriberat,
                    'tidakmata' => $tidakmata,
                    'adamata' => $adamata,
                    'mata' => $mata,
                    'hamiltidak' => $hamiltidak,
                    'hamilya' => $hamilya,
                    'hamilG' => $hamilG,
                    'hamilP' => $hamilP,
                    'hamilA' => $hamilA,
                    'usiahamil' => $usiahamil,
                    'masalahkeperawatan' => $masalahkeperawatan,
                    'diagnosabanding' => $diagnosabanding,
                    'tgltatalaksana' => $tgltatalaksana,
                    'tglkonsultasidokter' => $tglkonsultasidokter,
                    'tglpulangjam' => $tglpulangjam,
                    'pasien' => $pasien,
                    'namapasien' => $namapasien,
                    'keluarga' => $keluarga,
                    'hubungankeluarga' => $hubungankeluarga,
                    'penanggungjawab' => $penanggungjawab,
                    'namapenanggungjawab' => $namapenanggungjawab,
                    'rresusitasi' => $rresusitasi,
                    'rawatinap' => $rawatinap,
                    'rtindakan' => $rtindakan,
                    'rujukinternal' => $rujukinternal,
                    'pulangaps' => $pulangaps,
                    'diijinkanpulang' => $diijinkanpulang,
                    'meninggal' => $meninggal,
                    'tanggalmeninggal' => $tanggalmeninggal,
                    'ambulancersbsa' => $ambulancersbsa,
                    'mobiljenazah' => $mobiljenazah,
                    'kendaraanpribadi' => $kendaraanpribadi,
                    'transportasilain' => $transportasilain,
                    'kategoritransfer0' => $kategoritransfer0,
                    'kategoritransfer05' => $kategoritransfer05,
                    'kategoritransfer1' => $kategoritransfer1,
                    'kategoritransfer2' => $kategoritransfer2,
                    'kategoritransfer3' => $kategoritransfer3,
                    'saatpulang' => $saatpulang,
                    'saatdirujukeksternal' => $saatdirujukeksternal,
                    'melarikandiri' => $melarikandiri,
                    'kesadaran2' => $kesadaran2,
                    'e2' => $e2,
                    'm2' => $m2,
                    'v2' => $v2,
                    'tekananDarah2' => $tekananDarah2,
                    'pernafasan2' => $pernafasan2,
                    'suhu2' => $suhu2,
                    'nadi2' => $nadi2,
                    'spo22' => $spo22,
                );
            }
            //--x---
            //         $diagnosaigd = DB::select(DB::raw("
            // select jd.jenisdiagnosa, dg.namadiagnosa, dg.kddiagnosa || ' - ' || dg.namadiagnosa as namadiagnosakd from pasiendaftar_t as pd left join
            // antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec left join
            // diagnosapasien_t as dp on dp.noregistrasifk = apd.norec left join
            // detaildiagnosapasien_t as ddp on ddp.objectdiagnosapasienfk = dp.norec left join
            // diagnosa_m as dg on dg.id = ddp.objectdiagnosafk left join
            // jenisdiagnosa_m as jd on jd.id = ddp.objectjenisdiagnosafk
            // where pd.noregistrasi = '$noregistrasi' and apd.objectruanganfk = 569
            // "));
            // if (count($diagnosaigd) > 0) {
            //     foreach ($diagnosaigd as $digd) {
            //         $igdicd10 = $igdicd10 . $digd->namadiagnosakd . "\n";
            //     }
            // }
        };

        // CPPT
        $cppt = [];
        $adacppt = 'false';
        $qrcppt = '';
        $qrcodecppt = '';
        if ($xcetakcppt == 1) {
            $cppt = DB::select(DB::raw("
        select te.tgljam, te.profesi, te.subjective, te.objective, te.hasilpemeriksaan, te.assesment, te.plann, te.instruksitenaga , te.pegawai,
        te.subjective || '\n' || te.objective || '\n' || te.assesment || '\n' || te.plann as hasilpemeriksaan2, te.ttd, ttp2.tandatangan
        from emrpasien_t as ep left join
        tempemr_t as te on te.emrpasienfk = ep.noemr left join
        pegawai_m as pg on pg.namalengkap = te.pegawai left join
        tandatanganppa_t as ttp on ttp.objectpegawaifk = pg.id left join
        pegawai_m as pg2 on pg2.namalengkap = te.ttd left join
        tandatanganppa_t as ttp2 on ttp2.objectpegawaifk = pg2.id
        where ep.noregistrasifk = '$noregistrasi' and ep.emrfk = 518 and ispapj is not null
        order by tgljam
        "));
            $adacppt = 'false';
            if (count($cppt) > 0) {
                $adacppt = 'true';
                foreach ($cppt as $cp) {
                    $qrcppt = '';
                    $qrcodecppt = '';
                    if ($cp->ttd != null) {
                        $cp->ttd2 = "Penulis CPPT :";
                    } else {
                        $cp->ttd2 = "";
                    }
                    if ($cp->pegawai != null) {
                        $qrcodecppt = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $cp->pegawai);
                        echo "</br>";
                        header('Contert-Type: application/' . $qrcodecppt->getContentType());
                        $qrcppt = $qrcodecppt->writeDataUri();
                        $cp->ttdpegawai = $qrcppt;
                    } else {
                        $cp->ttdpegawai = "";
                    }
                }
            }
        }

        // --------------------MONITORING TRANSFUSI DARAH--------------------
        $transfusiDarahFix = [];
        if ($xcetakmtd == 1) {
            $noEmrTfDh = \DB::table('emrpasien_t as ep')
                ->join('pegawai_m as pg', 'pg.id', '=', 'ep.pegawaifk')
                ->select('ep.noemr', 'ep.emrfk')
                ->where('ep.noregistrasifk', $noregistrasi)
                ->where('ep.statusenabled', true)
                ->whereIn('ep.emrfk', [2020, 2044])
                ->OrderBy('ep.tglemr', 'desc')
                ->get();

            if (count($noEmrTfDh) > 0) {
                foreach ($noEmrTfDh as $i) {
                    $detailTfDh = \DB::table('emrpasiend_t as emrdp')
                        ->leftjoin('emrdpolri_t as emrd', 'emrd.id', '=', 'emrdp.emrdfk')
                        ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'emrdp.pegawaifk')
                        ->select('emrdp.*', 'emrd.caption', 'emrd.type', 'emrd.nourut', 'emrdp.emrfk', 'emrd.reportdisplay', 'emrd.kodeexternal as kodeex', 'emrd.satuan', 'pg.namalengkap')
                        ->where('emrdp.statusenabled', true)
                        ->where('emrdp.emrpasienfk', $i->noemr)
                        ->where('emrdp.emrfk', $i->emrfk)
                        ->orderBy('emrdp.emrdfk', 'asc')
                        ->get();

                    $detailTfDhFix = [];
                    if (count($detailTfDh) > 0) {
                        foreach ($detailTfDh as $j) {
                            if (
                                intval($j->emrdfk) == 50
                                || intval($j->emrdfk) == 51
                                || intval($j->emrdfk) == 52
                                || intval($j->emrdfk) == 53
                                || intval($j->emrdfk) == 54
                            ) {
                                if ($j->value == 1) {
                                    $detailTfDhFix[$j->emrdfk] = true;
                                } else {
                                    $detailTfDhFix[$j->emrdfk] = false;
                                }
                            } elseif (intval($j->emrdfk) == 1466) {
                                if (strpos($j->value, '~') == true) {
                                    $split = explode('~', $j->value);
                                    $detailTfDhFix[$j->emrdfk] = $split[1];

                                    $qrcode = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $split[1]);
                                    $qr = $qrcode->writeDataUri();
                                    $detailTfDhFix[999] = $qr;
                                }
                            } else {
                                if (strpos($j->value, '~') == true) {
                                    $split = explode('~', $j->value);
                                    $detailTfDhFix[$j->emrdfk] = $split[1];
                                } else {
                                    $detailTfDhFix[$j->emrdfk] = $j->value;
                                }
                            }
                        }
                    }
                    $i->details = $detailTfDhFix;
                }
                $transfusiDarahFix = $noEmrTfDh;
            }
        }

        // --------------------TRIASE FETOMATERNAL--------------------
        $triaseFetomaternalFix = [];
        if ($xcetaktf == 1) {
            $noEmrTF = \DB::table('emrpasien_t as ep')
                ->join('pegawai_m as pg', 'pg.id', '=', 'ep.pegawaifk')
                ->select('ep.noemr', 'ep.emrfk')
                ->where('ep.noregistrasifk', $noregistrasi)
                ->where('ep.statusenabled', true)
                ->where('ep.emrfk', 2028)
                ->OrderBy('ep.tglemr', 'desc')
                ->first();

            if ($noEmrTF) {
                $detailTF = \DB::table('emrpasiend_t as emrdp')
                    ->leftjoin('emrd_t as emrd', 'emrd.id', '=', 'emrdp.emrdfk')
                    ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'emrdp.pegawaifk')
                    ->select('emrdp.*', 'emrd.caption', 'emrd.type', 'emrd.nourut', 'emrdp.emrfk', 'emrd.reportdisplay', 'emrd.kodeexternal as kodeex', 'emrd.satuan', 'pg.namalengkap')
                    ->where('emrdp.statusenabled', true)
                    ->where('emrdp.emrpasienfk', $noEmrTF->noemr)
                    ->where('emrdp.emrfk', $noEmrTF->emrfk)
                    ->orderBy('emrdp.emrdfk', 'asc')
                    ->get();

                $detailTFFix = [];
                if (count($detailTF) > 0) {
                    foreach ($detailTF as $j) {
                        if (
                            intval($j->emrdfk) == 1901300140
                            || intval($j->emrdfk) == 1901300141
                            || intval($j->emrdfk) == 28
                            || intval($j->emrdfk) == 32
                            || intval($j->emrdfk) == 34
                            || intval($j->emrdfk) == 35
                            || intval($j->emrdfk) == 37
                            || intval($j->emrdfk) == 1901300142
                            || intval($j->emrdfk) == 38
                            || intval($j->emrdfk) == 40
                            || intval($j->emrdfk) == 1901300143
                            || intval($j->emrdfk) == 1901300144
                            || intval($j->emrdfk) == 1901300146
                            || intval($j->emrdfk) == 1901300168
                            || intval($j->emrdfk) == 1901300170
                            || intval($j->emrdfk) == 1901300149
                            || intval($j->emrdfk) == 1901300150
                            || intval($j->emrdfk) == 1901300209
                            || intval($j->emrdfk) == 1901300172
                            || intval($j->emrdfk) == 1901300173
                            || intval($j->emrdfk) == 1901300210
                            || intval($j->emrdfk) == 1901300174
                            || intval($j->emrdfk) == 1901300214
                            || intval($j->emrdfk) == 1901300175
                            || intval($j->emrdfk) == 1901300179
                            || intval($j->emrdfk) == 1901300180
                            || intval($j->emrdfk) == 1901300181
                            || intval($j->emrdfk) == 1901300182
                            || intval($j->emrdfk) == 1901300211
                            || intval($j->emrdfk) == 1901300212
                            || intval($j->emrdfk) == 1901300152
                            || intval($j->emrdfk) == 1901300186
                            || intval($j->emrdfk) == 1901300187
                            || intval($j->emrdfk) == 1901300153
                            || intval($j->emrdfk) == 1901300188
                            || intval($j->emrdfk) == 1901300154
                            || intval($j->emrdfk) == 1901300155
                            || intval($j->emrdfk) == 1901300156
                            || intval($j->emrdfk) == 1901300158
                            || intval($j->emrdfk) == 41
                            || intval($j->emrdfk) == 46
                            || intval($j->emrdfk) == 47
                            || intval($j->emrdfk) == 1901300159
                            || intval($j->emrdfk) == 1901300194
                            || intval($j->emrdfk) == 1901300195
                            || intval($j->emrdfk) == 1901300160
                            || intval($j->emrdfk) == 1901300200
                            || intval($j->emrdfk) == 1901300201
                            || intval($j->emrdfk) == 1901300202
                            || intval($j->emrdfk) == 1901300203
                            || intval($j->emrdfk) == 1901300161
                            || intval($j->emrdfk) == 49
                            || intval($j->emrdfk) == 50
                            || intval($j->emrdfk) == 1901300260
                            || intval($j->emrdfk) == 1901300261
                            || intval($j->emrdfk) == 1901300262
                            || intval($j->emrdfk) == 1901300263
                            || intval($j->emrdfk) == 1901300264
                            || intval($j->emrdfk) == 1901300265
                            || intval($j->emrdfk) == 1901300266
                            || intval($j->emrdfk) == 1901300267
                            || intval($j->emrdfk) == 1901300268
                            || intval($j->emrdfk) == 1901300270
                            || intval($j->emrdfk) == 1901300271
                            || intval($j->emrdfk) == 1901300272
                            || intval($j->emrdfk) == 1901300273
                            || intval($j->emrdfk) == 1901300276
                            || intval($j->emrdfk) == 1901300277
                            || intval($j->emrdfk) == 1901300278
                            || intval($j->emrdfk) == 1901300279
                        ) {
                            if ($j->value == 1) {
                                $detailTFFix[$j->emrdfk] = true;
                            } else {
                                $detailTFFix[$j->emrdfk] = false;
                            }
                        } elseif (
                            intval($j->emrdfk) == 1901300269
                            || intval($j->emrdfk) == 1901300274
                            || intval($j->emrdfk) == 1901300275
                            || intval($j->emrdfk) == 1901300280
                            || intval($j->emrdfk) == 1901300281
                            || intval($j->emrdfk) == 1901300282
                            || intval($j->emrdfk) == 1901300285
                        ) {
                            $detailTFFix[$j->emrdfk] = $j->value; // simpan teks apa adanya
                        } elseif (intval($j->emrdfk) == 1901300115) {
                            if (strpos($j->value, '~') == true) {
                                $split = explode('~', $j->value);
                                $detailTFFix[$j->emrdfk] = $split[1];

                                $qrcode = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $split[1]);
                                $qr = $qrcode->writeDataUri();
                                if (!isset($detailTFFix[999])) {
                                    $detailTFFix[999] = $qr;
                                }
                            } else {
                                $detailTFFix[$j->emrdfk] = $j->value;
                                $qrcode = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $j->value);
                                $qr = $qrcode->writeDataUri();
                                $detailTFFix[999] = $qr;
                            }
                        } else {
                            if (strpos($j->value, '~') == true) {
                                $split = explode('~', $j->value);
                                $detailTFFix[$j->emrdfk] = $split[1];
                            } else {
                                $detailTFFix[$j->emrdfk] = $j->value;
                            }
                        }
                    }
                }
                $triaseFetomaternalFix = $detailTFFix;
            }
        }

        // --------------------CODE BLUE--------------------
        $codeBlueFix = [];
        if ($xcetakcodeblue == 1) {
            $noEmrCB = \DB::table('emrpasien_t as ep')
                ->join('pegawai_m as pg', 'pg.id', '=', 'ep.pegawaifk')
                ->select('ep.noemr', 'ep.emrfk')
                ->where('ep.noregistrasifk', $noregistrasi)
                ->where('ep.statusenabled', true)
                ->where('ep.emrfk', 2047)
                ->OrderBy('ep.tglemr', 'desc')
                ->first();

            if ($noEmrCB) {
                $detailCB = \DB::table('emrpasiend_t as emrdp')
                    ->leftjoin('emrd_t as emrd', 'emrd.id', '=', 'emrdp.emrdfk')
                    ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'emrdp.pegawaifk')
                    ->select('emrdp.*', 'emrd.caption', 'emrd.type', 'emrd.nourut', 'emrdp.emrfk', 'emrd.reportdisplay', 'emrd.kodeexternal as kodeex', 'emrd.satuan', 'pg.namalengkap')
                    ->where('emrdp.statusenabled', true)
                    ->where('emrdp.emrpasienfk', $noEmrCB->noemr)
                    ->where('emrdp.emrfk', $noEmrCB->emrfk)
                    ->orderBy('emrdp.emrdfk', 'asc')
                    ->get();

                $detailCBFix = [];
                if (count($detailCB) > 0) {
                    foreach ($detailCB as $j) {
                        if (
                            intval($j->emrdfk) == 1
                            || intval($j->emrdfk) == 2
                            || intval($j->emrdfk) == 3
                            || intval($j->emrdfk) == 4
                            || intval($j->emrdfk) == 5
                            || intval($j->emrdfk) == 6
                            || intval($j->emrdfk) == 7
                            || intval($j->emrdfk) == 8
                            || intval($j->emrdfk) == 10
                            || intval($j->emrdfk) == 11
                            || intval($j->emrdfk) == 12
                            || intval($j->emrdfk) == 13
                            || intval($j->emrdfk) == 14
                            || intval($j->emrdfk) == 16
                            || intval($j->emrdfk) == 17
                            || intval($j->emrdfk) == 18
                            || intval($j->emrdfk) == 24
                            || intval($j->emrdfk) == 25
                            || intval($j->emrdfk) == 26
                            || intval($j->emrdfk) == 27
                            || intval($j->emrdfk) == 28
                            || intval($j->emrdfk) == 51
                            || intval($j->emrdfk) == 52
                            || intval($j->emrdfk) == 31
                            || intval($j->emrdfk) == 40
                            || intval($j->emrdfk) == 42
                            || intval($j->emrdfk) == 44
                            || intval($j->emrdfk) == 45
                            || intval($j->emrdfk) == 46
                            || intval($j->emrdfk) == 47
                            || intval($j->emrdfk) == 49
                            || intval($j->emrdfk) == 50
                        ) {
                            if ($j->value == 1) {
                                $detailCBFix[$j->emrdfk] = true;
                            } else {
                                $detailCBFix[$j->emrdfk] = false;
                            }
                        } elseif (
                            intval($j->emrdfk) == 19
                            || intval($j->emrdfk) == 20
                            || intval($j->emrdfk) == 21
                            || intval($j->emrdfk) == 22
                            || intval($j->emrdfk) == 32
                            || intval($j->emrdfk) == 33
                            || intval($j->emrdfk) == 2373
                            || intval($j->emrdfk) == 2337
                            || intval($j->emrdfk) == 2341
                            || intval($j->emrdfk) == 2370
                            || intval($j->emrdfk) == 2371
                            || intval($j->emrdfk) == 2372
                            || intval($j->emrdfk) == 798
                            || intval($j->emrdfk) == 810
                            || intval($j->emrdfk) == 5137
                            || intval($j->emrdfk) == 6263
                            || intval($j->emrdfk) == 6254
                            || intval($j->emrdfk) == 1148
                            || intval($j->emrdfk) == 5152
                            || intval($j->emrdfk) == 36
                            || intval($j->emrdfk) == 37
                            || intval($j->emrdfk) == 69
                            || intval($j->emrdfk) == 84
                            || intval($j->emrdfk) == 85
                            || intval($j->emrdfk) == 95
                            || intval($j->emrdfk) == 108
                            || intval($j->emrdfk) == 113
                            || intval($j->emrdfk) == 120
                            || intval($j->emrdfk) == 2376
                            || intval($j->emrdfk) == 4173
                            || intval($j->emrdfk) == 124
                            || intval($j->emrdfk) == 131
                            || intval($j->emrdfk) == 176
                        ) {
                            $detailCBFix[$j->emrdfk] = $j->value;
                        } elseif (intval($j->emrdfk) == 39) {
                            if (strpos($j->value, '~') == true) {
                                $split = explode('~', $j->value);
                                $detailCBFix[$j->emrdfk] = $split[1];

                                $qrcode = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $split[1]);
                                $qr = $qrcode->writeDataUri();
                                if (!isset($detailCBFix[999])) {
                                    $detailCBFix[997] = $qr;
                                }
                            } else {
                                $detailCBFix[$j->emrdfk] = $j->value;
                                $qrcode = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $j->value);
                                $qr = $qrcode->writeDataUri();
                                $detailCBFix[997] = $qr;
                            }
                        } elseif (intval($j->emrdfk) == 129) {
                            if (strpos($j->value, '~') == true) {
                                $split = explode('~', $j->value);
                                $detailCBFix[$j->emrdfk] = $split[1];

                                $qrcode = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $split[1]);
                                $qr = $qrcode->writeDataUri();
                                if (!isset($detailCBFix[999])) {
                                    $detailCBFix[998] = $qr;
                                }
                            } else {
                                $detailCBFix[$j->emrdfk] = $j->value;
                                $qrcode = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $j->value);
                                $qr = $qrcode->writeDataUri();
                                $detailCBFix[998] = $qr;
                            }
                        } else {
                            if (strpos($j->value, '~') == true) {
                                $split = explode('~', $j->value);
                                $detailCBFix[$j->emrdfk] = $split[1];
                            } else {
                                $detailCBFix[$j->emrdfk] = $j->value;
                            }
                        }
                    }
                }
                $codeBlueFix = $detailCBFix;
            }
        }

        // --------------------PENILAIAN DERAJAT DEHIDRASI--------------------
        $derajatDehidrasiFix = [];
        if ($xcetakderajatdehidrasi == 1) {
            $noEmrDD = \DB::table('emrpasien_t as ep')
                ->join('pegawai_m as pg', 'pg.id', '=', 'ep.pegawaifk')
                ->select('ep.noemr', 'ep.emrfk')
                ->where('ep.noregistrasifk', $noregistrasi)
                ->where('ep.statusenabled', true)
                ->where('ep.emrfk', 2049)
                ->OrderBy('ep.tglemr', 'desc')
                ->first();

            if ($noEmrDD) {
                $detailDD = \DB::table('emrpasiend_t as emrdp')
                    ->leftjoin('emrd_t as emrd', 'emrd.id', '=', 'emrdp.emrdfk')
                    ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'emrdp.pegawaifk')
                    ->select('emrdp.*', 'emrd.caption', 'emrd.type', 'emrd.nourut', 'emrdp.emrfk', 'emrd.reportdisplay', 'emrd.kodeexternal as kodeex', 'emrd.satuan', 'pg.namalengkap')
                    ->where('emrdp.statusenabled', true)
                    ->where('emrdp.emrpasienfk', $noEmrDD->noemr)
                    ->where('emrdp.emrfk', $noEmrDD->emrfk)
                    ->orderBy('emrdp.emrdfk', 'asc')
                    ->get();

                $detailDDFix = [];
                if (count($detailDD) > 0) {
                    foreach ($detailDD as $j) {
                        if (
                            intval($j->emrdfk) == 1
                            || intval($j->emrdfk) == 2
                            || intval($j->emrdfk) == 3
                            || intval($j->emrdfk) == 4
                            || intval($j->emrdfk) == 5
                            || intval($j->emrdfk) == 6
                            || intval($j->emrdfk) == 7
                            || intval($j->emrdfk) == 8
                            || intval($j->emrdfk) == 10
                            || intval($j->emrdfk) == 11
                            || intval($j->emrdfk) == 12
                            || intval($j->emrdfk) == 13
                            || intval($j->emrdfk) == 14
                            || intval($j->emrdfk) == 16
                            || intval($j->emrdfk) == 17
                            || intval($j->emrdfk) == 18
                            || intval($j->emrdfk) == 24
                            || intval($j->emrdfk) == 25
                            || intval($j->emrdfk) == 26
                            || intval($j->emrdfk) == 27
                            || intval($j->emrdfk) == 28
                            || intval($j->emrdfk) == 51
                            || intval($j->emrdfk) == 52
                            || intval($j->emrdfk) == 31
                            || intval($j->emrdfk) == 40
                            || intval($j->emrdfk) == 42
                            || intval($j->emrdfk) == 44
                            || intval($j->emrdfk) == 45
                            || intval($j->emrdfk) == 46
                            || intval($j->emrdfk) == 47
                            || intval($j->emrdfk) == 49
                            || intval($j->emrdfk) == 50
                            || intval($j->emrdfk) == 51
                            || intval($j->emrdfk) == 52
                            || intval($j->emrdfk) == 53
                            || intval($j->emrdfk) == 55
                        ) {
                            if ($j->value == 1) {
                                $detailDDFix[$j->emrdfk] = true;
                            } else {
                                $detailDDFix[$j->emrdfk] = false;
                            }
                        } elseif (intval($j->emrdfk) == 39) {
                            if (strpos($j->value, '~') == true) {
                                $split = explode('~', $j->value);
                                $detailDDFix[$j->emrdfk] = $split[1];

                                $qrcode = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $split[1]);
                                $qr = $qrcode->writeDataUri();
                                if (!isset($detailDDFix[999])) {
                                    $detailDDFix[997] = $qr;
                                }
                            } else {
                                $detailDDFix[$j->emrdfk] = $j->value;
                                $qrcode = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $j->value);
                                $qr = $qrcode->writeDataUri();
                                $detailDDFix[997] = $qr;
                            }
                        } else {
                            if (strpos($j->value, '~') == true) {
                                $split = explode('~', $j->value);
                                $detailDDFix[$j->emrdfk] = $split[1];
                            } else {
                                $detailDDFix[$j->emrdfk] = $j->value;
                            }
                        }
                    }
                }
                $derajatDehidrasiFix = $detailDDFix;
            }
        }

        // --------------------LAPORAN TINDAKAN--------------------
        $laporanTindakanFix = [];
        if ($xcetaklaporantindakan == 1) {
            $noEmrLP = \DB::table('emrpasien_t as ep')
                ->join('pegawai_m as pg', 'pg.id', '=', 'ep.pegawaifk')
                ->select('ep.noemr', 'ep.emrfk')
                ->where('ep.noregistrasifk', $noregistrasi)
                ->where('ep.statusenabled', true)
                ->where('ep.emrfk', 2056)
                ->OrderBy('ep.tglemr', 'desc')
                ->first();

            if ($noEmrLP) {
                $detailLP = \DB::table('emrpasiend_t as emrdp')
                    ->leftjoin('emrd_t as emrd', 'emrd.id', '=', 'emrdp.emrdfk')
                    ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'emrdp.pegawaifk')
                    ->select('emrdp.*', 'emrd.caption', 'emrd.type', 'emrd.nourut', 'emrdp.emrfk', 'emrd.reportdisplay', 'emrd.kodeexternal as kodeex', 'emrd.satuan', 'pg.namalengkap')
                    ->where('emrdp.statusenabled', true)
                    ->where('emrdp.emrpasienfk', $noEmrLP->noemr)
                    ->where('emrdp.emrfk', $noEmrLP->emrfk)
                    ->orderBy('emrdp.emrdfk', 'asc')
                    ->get();

                $detailLPFix = [];
                if (count($detailLP) > 0) {
                    foreach ($detailLP as $j) {
                        if (intval($j->emrdfk) == 129) {
                            if (strpos($j->value, '~') == true) {
                                $split = explode('~', $j->value);
                                $detailLPFix[$j->emrdfk] = $split[1];

                                $qrcode = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $split[1]);
                                $qr = $qrcode->writeDataUri();
                                $detailLPFix[129999] = $qr;
                            } else {
                                $detailLPFix[$j->emrdfk] = $j->value;
                                $qrcode = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $j->value);
                                $qr = $qrcode->writeDataUri();
                                $detailLPFix[129999] = $qr;
                            }
                        } else if (intval($j->emrdfk) == 130) {
                            if (strpos($j->value, '~') == true) {
                                $split = explode('~', $j->value);
                                $detailLPFix[$j->emrdfk] = $split[1];

                                $qrcode = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $split[1]);
                                $qr = $qrcode->writeDataUri();
                                $detailLPFix[130999] = $qr;
                            } else {
                                $detailLPFix[$j->emrdfk] = $j->value;
                                $qrcode = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $j->value);
                                $qr = $qrcode->writeDataUri();
                                $detailLPFix[130999] = $qr;
                            }
                        } else if (intval($j->emrdfk) == 39) {
                            if (strpos($j->value, '~') == true) {
                                $split = explode('~', $j->value);
                                $detailLPFix[$j->emrdfk] = $split[1];

                                $qrcode = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $split[1]);
                                $qr = $qrcode->writeDataUri();
                                $detailLPFix[39999] = $qr;
                            } else {
                                $detailLPFix[$j->emrdfk] = $j->value;
                                $qrcode = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $j->value);
                                $qr = $qrcode->writeDataUri();
                                $detailLPFix[39999] = $qr;
                            }
                        } else {
                            if (strpos($j->value, '~') == true) {
                                $split = explode('~', $j->value);
                                $detailLPFix[$j->emrdfk] = $split[1];
                            } else {
                                $detailLPFix[$j->emrdfk] = $j->value;
                            }
                        }
                    }
                }
                $laporanTindakanFix = $detailLPFix;
            }
        }

        // --------------------EWS DEWASA--------------------
        $ewsDewasaFix = [];
        if ($xcetakewsdewasa == 1) {
            $noEmrEwsD = \DB::table('emrpasien_t as ep')
                ->join('pegawai_m as pg', 'pg.id', '=', 'ep.pegawaifk')
                ->select('ep.noemr', 'ep.emrfk')
                ->where('ep.noregistrasifk', $noregistrasi)
                ->where('ep.statusenabled', true)
                ->where('ep.emrfk', 876)
                ->OrderBy('ep.tglemr', 'desc')
                ->get();

            if (count($noEmrEwsD) > 0) {
                foreach ($noEmrEwsD as $i) {
                    $detailEwsD = \DB::table('emrpasiend_t as emrdp')
                        ->leftjoin('emrdpolri_t as emrd', 'emrd.id', '=', 'emrdp.emrdfk')
                        ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'emrdp.pegawaifk')
                        ->select('emrdp.*', 'emrd.caption', 'emrd.type', 'emrd.nourut', 'emrdp.emrfk', 'emrd.reportdisplay', 'emrd.kodeexternal as kodeex', 'emrd.satuan', 'pg.namalengkap')
                        ->where('emrdp.statusenabled', true)
                        ->where('emrdp.emrpasienfk', $i->noemr)
                        ->where('emrdp.emrfk', $i->emrfk)
                        ->whereExists(function ($query) use ($i) {
                            $query->select(DB::raw(1))
                                ->from('emrpasiend_t as emrdp_sub')
                                ->where('emrdp_sub.emrpasienfk', $i->noemr)
                                ->where('emrdp_sub.emrfk', $i->emrfk)
                                ->where('emrdp_sub.value', 'EWS DEWASA (BARU)');
                        })
                        ->orderBy('emrdp.emrdfk', 'asc')
                        ->get();

                    $emrdfkQrPegawai = [8136, 8137, 8138, 8139, 8140, 8141, 8142, 8143];
                    $detailEwsDFix = [];
                    if (count($detailEwsD) > 0) {
                        foreach ($detailEwsD as $j) {
                            if (
                                intval($j->emrdfk) == 7728 ||
                                intval($j->emrdfk) == 7729 ||
                                intval($j->emrdfk) == 7730 ||
                                intval($j->emrdfk) == 7731 ||
                                intval($j->emrdfk) == 7732 ||
                                intval($j->emrdfk) == 7733 ||
                                intval($j->emrdfk) == 7734 ||
                                intval($j->emrdfk) == 7735 ||
                                intval($j->emrdfk) == 7736 ||
                                intval($j->emrdfk) == 7737 ||
                                intval($j->emrdfk) == 7738 ||
                                intval($j->emrdfk) == 7739 ||
                                intval($j->emrdfk) == 7740 ||
                                intval($j->emrdfk) == 7741 ||
                                intval($j->emrdfk) == 7742 ||
                                intval($j->emrdfk) == 7743 ||
                                intval($j->emrdfk) == 7744 ||
                                intval($j->emrdfk) == 7745 ||
                                intval($j->emrdfk) == 7746 ||
                                intval($j->emrdfk) == 7747 ||
                                intval($j->emrdfk) == 7748 ||
                                intval($j->emrdfk) == 7749 ||
                                intval($j->emrdfk) == 7750 ||
                                intval($j->emrdfk) == 7751 ||
                                intval($j->emrdfk) == 7760 ||
                                intval($j->emrdfk) == 7761 ||
                                intval($j->emrdfk) == 7762 ||
                                intval($j->emrdfk) == 7763 ||
                                intval($j->emrdfk) == 7764 ||
                                intval($j->emrdfk) == 7765 ||
                                intval($j->emrdfk) == 7766 ||
                                intval($j->emrdfk) == 7767 ||
                                intval($j->emrdfk) == 7768 ||
                                intval($j->emrdfk) == 7769 ||
                                intval($j->emrdfk) == 7770 ||
                                intval($j->emrdfk) == 7771 ||
                                intval($j->emrdfk) == 7772 ||
                                intval($j->emrdfk) == 7773 ||
                                intval($j->emrdfk) == 7774 ||
                                intval($j->emrdfk) == 7775 ||
                                intval($j->emrdfk) == 7776 ||
                                intval($j->emrdfk) == 7777 ||
                                intval($j->emrdfk) == 7778 ||
                                intval($j->emrdfk) == 7779 ||
                                intval($j->emrdfk) == 7780 ||
                                intval($j->emrdfk) == 7781 ||
                                intval($j->emrdfk) == 7782 ||
                                intval($j->emrdfk) == 7783 ||
                                intval($j->emrdfk) == 7784 ||
                                intval($j->emrdfk) == 7785 ||
                                intval($j->emrdfk) == 7786 ||
                                intval($j->emrdfk) == 7787 ||
                                intval($j->emrdfk) == 7788 ||
                                intval($j->emrdfk) == 7789 ||
                                intval($j->emrdfk) == 7790 ||
                                intval($j->emrdfk) == 7791 ||
                                intval($j->emrdfk) == 7792 ||
                                intval($j->emrdfk) == 7793 ||
                                intval($j->emrdfk) == 7794 ||
                                intval($j->emrdfk) == 7795 ||
                                intval($j->emrdfk) == 7796 ||
                                intval($j->emrdfk) == 7797 ||
                                intval($j->emrdfk) == 7798 ||
                                intval($j->emrdfk) == 7799 ||
                                intval($j->emrdfk) == 7800 ||
                                intval($j->emrdfk) == 7801 ||
                                intval($j->emrdfk) == 7802 ||
                                intval($j->emrdfk) == 7803 ||
                                intval($j->emrdfk) == 7804 ||
                                intval($j->emrdfk) == 7805 ||
                                intval($j->emrdfk) == 7806 ||
                                intval($j->emrdfk) == 7807 ||
                                intval($j->emrdfk) == 7808 ||
                                intval($j->emrdfk) == 7809 ||
                                intval($j->emrdfk) == 7810 ||
                                intval($j->emrdfk) == 7811 ||
                                intval($j->emrdfk) == 7812 ||
                                intval($j->emrdfk) == 7813 ||
                                intval($j->emrdfk) == 7814 ||
                                intval($j->emrdfk) == 7815 ||
                                intval($j->emrdfk) == 7816 ||
                                intval($j->emrdfk) == 7817 ||
                                intval($j->emrdfk) == 7818 ||
                                intval($j->emrdfk) == 7819 ||
                                intval($j->emrdfk) == 7820 ||
                                intval($j->emrdfk) == 7821 ||
                                intval($j->emrdfk) == 7822 ||
                                intval($j->emrdfk) == 7823 ||
                                intval($j->emrdfk) == 7824 ||
                                intval($j->emrdfk) == 7825 ||
                                intval($j->emrdfk) == 7826 ||
                                intval($j->emrdfk) == 7827 ||
                                intval($j->emrdfk) == 7828 ||
                                intval($j->emrdfk) == 7829 ||
                                intval($j->emrdfk) == 7830 ||
                                intval($j->emrdfk) == 7831 ||
                                intval($j->emrdfk) == 7832 ||
                                intval($j->emrdfk) == 7833 ||
                                intval($j->emrdfk) == 7834 ||
                                intval($j->emrdfk) == 7835 ||
                                intval($j->emrdfk) == 7836 ||
                                intval($j->emrdfk) == 7837 ||
                                intval($j->emrdfk) == 7838 ||
                                intval($j->emrdfk) == 7839 ||
                                intval($j->emrdfk) == 7840 ||
                                intval($j->emrdfk) == 7841 ||
                                intval($j->emrdfk) == 7842 ||
                                intval($j->emrdfk) == 7843 ||
                                intval($j->emrdfk) == 7844 ||
                                intval($j->emrdfk) == 7845 ||
                                intval($j->emrdfk) == 7846 ||
                                intval($j->emrdfk) == 7847 ||
                                intval($j->emrdfk) == 7848 ||
                                intval($j->emrdfk) == 7849 ||
                                intval($j->emrdfk) == 7850 ||
                                intval($j->emrdfk) == 7851 ||
                                intval($j->emrdfk) == 7852 ||
                                intval($j->emrdfk) == 7853 ||
                                intval($j->emrdfk) == 7854 ||
                                intval($j->emrdfk) == 7855 ||
                                intval($j->emrdfk) == 7856 ||
                                intval($j->emrdfk) == 7857 ||
                                intval($j->emrdfk) == 7858 ||
                                intval($j->emrdfk) == 7859 ||
                                intval($j->emrdfk) == 7860 ||
                                intval($j->emrdfk) == 7861 ||
                                intval($j->emrdfk) == 7862 ||
                                intval($j->emrdfk) == 7863 ||
                                intval($j->emrdfk) == 7864 ||
                                intval($j->emrdfk) == 7865 ||
                                intval($j->emrdfk) == 7866 ||
                                intval($j->emrdfk) == 7867 ||
                                intval($j->emrdfk) == 7868 ||
                                intval($j->emrdfk) == 7869 ||
                                intval($j->emrdfk) == 7870 ||
                                intval($j->emrdfk) == 7871 ||
                                intval($j->emrdfk) == 7872 ||
                                intval($j->emrdfk) == 7873 ||
                                intval($j->emrdfk) == 7874 ||
                                intval($j->emrdfk) == 7875 ||
                                intval($j->emrdfk) == 7876 ||
                                intval($j->emrdfk) == 7877 ||
                                intval($j->emrdfk) == 7878 ||
                                intval($j->emrdfk) == 7879 ||
                                intval($j->emrdfk) == 7880 ||
                                intval($j->emrdfk) == 7881 ||
                                intval($j->emrdfk) == 7882 ||
                                intval($j->emrdfk) == 7883 ||
                                intval($j->emrdfk) == 7884 ||
                                intval($j->emrdfk) == 7885 ||
                                intval($j->emrdfk) == 7886 ||
                                intval($j->emrdfk) == 7887 ||
                                intval($j->emrdfk) == 7888 ||
                                intval($j->emrdfk) == 7889 ||
                                intval($j->emrdfk) == 7890 ||
                                intval($j->emrdfk) == 7891 ||
                                intval($j->emrdfk) == 7892 ||
                                intval($j->emrdfk) == 7893 ||
                                intval($j->emrdfk) == 7894 ||
                                intval($j->emrdfk) == 7895 ||
                                intval($j->emrdfk) == 7896 ||
                                intval($j->emrdfk) == 7897 ||
                                intval($j->emrdfk) == 7898 ||
                                intval($j->emrdfk) == 7899 ||
                                intval($j->emrdfk) == 7900 ||
                                intval($j->emrdfk) == 7901 ||
                                intval($j->emrdfk) == 7902 ||
                                intval($j->emrdfk) == 7903 ||
                                intval($j->emrdfk) == 7904 ||
                                intval($j->emrdfk) == 7905 ||
                                intval($j->emrdfk) == 7906 ||
                                intval($j->emrdfk) == 7907 ||
                                intval($j->emrdfk) == 7908 ||
                                intval($j->emrdfk) == 7909 ||
                                intval($j->emrdfk) == 7910 ||
                                intval($j->emrdfk) == 7911 ||
                                intval($j->emrdfk) == 7912 ||
                                intval($j->emrdfk) == 7913 ||
                                intval($j->emrdfk) == 7914 ||
                                intval($j->emrdfk) == 7915 ||
                                intval($j->emrdfk) == 7916 ||
                                intval($j->emrdfk) == 7917 ||
                                intval($j->emrdfk) == 7918 ||
                                intval($j->emrdfk) == 7919 ||
                                intval($j->emrdfk) == 7920 ||
                                intval($j->emrdfk) == 7921 ||
                                intval($j->emrdfk) == 7922 ||
                                intval($j->emrdfk) == 7923 ||
                                intval($j->emrdfk) == 7924 ||
                                intval($j->emrdfk) == 7925 ||
                                intval($j->emrdfk) == 7926 ||
                                intval($j->emrdfk) == 7927 ||
                                intval($j->emrdfk) == 7928 ||
                                intval($j->emrdfk) == 7929 ||
                                intval($j->emrdfk) == 7930 ||
                                intval($j->emrdfk) == 7931 ||
                                intval($j->emrdfk) == 7932 ||
                                intval($j->emrdfk) == 7933 ||
                                intval($j->emrdfk) == 7934 ||
                                intval($j->emrdfk) == 7935 ||
                                intval($j->emrdfk) == 7936 ||
                                intval($j->emrdfk) == 7937 ||
                                intval($j->emrdfk) == 7938 ||
                                intval($j->emrdfk) == 7939 ||
                                intval($j->emrdfk) == 7940 ||
                                intval($j->emrdfk) == 7941 ||
                                intval($j->emrdfk) == 7942 ||
                                intval($j->emrdfk) == 7943 ||
                                intval($j->emrdfk) == 7944 ||
                                intval($j->emrdfk) == 7945 ||
                                intval($j->emrdfk) == 7946 ||
                                intval($j->emrdfk) == 7947 ||
                                intval($j->emrdfk) == 7948 ||
                                intval($j->emrdfk) == 7949 ||
                                intval($j->emrdfk) == 7950 ||
                                intval($j->emrdfk) == 7951 ||
                                intval($j->emrdfk) == 7952 ||
                                intval($j->emrdfk) == 7953 ||
                                intval($j->emrdfk) == 7954 ||
                                intval($j->emrdfk) == 7955 ||
                                intval($j->emrdfk) == 7956 ||
                                intval($j->emrdfk) == 7957 ||
                                intval($j->emrdfk) == 7958 ||
                                intval($j->emrdfk) == 7959 ||
                                intval($j->emrdfk) == 7960 ||
                                intval($j->emrdfk) == 7961 ||
                                intval($j->emrdfk) == 7962 ||
                                intval($j->emrdfk) == 7963 ||
                                intval($j->emrdfk) == 7964 ||
                                intval($j->emrdfk) == 7965 ||
                                intval($j->emrdfk) == 7966 ||
                                intval($j->emrdfk) == 7967 ||
                                intval($j->emrdfk) == 7968 ||
                                intval($j->emrdfk) == 7969 ||
                                intval($j->emrdfk) == 7970 ||
                                intval($j->emrdfk) == 7971 ||
                                intval($j->emrdfk) == 7972 ||
                                intval($j->emrdfk) == 7973 ||
                                intval($j->emrdfk) == 7974 ||
                                intval($j->emrdfk) == 7975 ||
                                intval($j->emrdfk) == 7976 ||
                                intval($j->emrdfk) == 7977 ||
                                intval($j->emrdfk) == 7978 ||
                                intval($j->emrdfk) == 7979 ||
                                intval($j->emrdfk) == 7980 ||
                                intval($j->emrdfk) == 7981 ||
                                intval($j->emrdfk) == 7982 ||
                                intval($j->emrdfk) == 7983 ||
                                intval($j->emrdfk) == 7984 ||
                                intval($j->emrdfk) == 7985 ||
                                intval($j->emrdfk) == 7986 ||
                                intval($j->emrdfk) == 7987 ||
                                intval($j->emrdfk) == 7988 ||
                                intval($j->emrdfk) == 7989 ||
                                intval($j->emrdfk) == 7990 ||
                                intval($j->emrdfk) == 7991 ||
                                intval($j->emrdfk) == 7992 ||
                                intval($j->emrdfk) == 7993 ||
                                intval($j->emrdfk) == 7994 ||
                                intval($j->emrdfk) == 7995 ||
                                intval($j->emrdfk) == 7996 ||
                                intval($j->emrdfk) == 7997 ||
                                intval($j->emrdfk) == 7998 ||
                                intval($j->emrdfk) == 7999 ||
                                intval($j->emrdfk) == 8000 ||
                                intval($j->emrdfk) == 8001 ||
                                intval($j->emrdfk) == 8002 ||
                                intval($j->emrdfk) == 8003 ||
                                intval($j->emrdfk) == 8004 ||
                                intval($j->emrdfk) == 8005 ||
                                intval($j->emrdfk) == 8006 ||
                                intval($j->emrdfk) == 8007 ||
                                intval($j->emrdfk) == 8008 ||
                                intval($j->emrdfk) == 8009 ||
                                intval($j->emrdfk) == 8010 ||
                                intval($j->emrdfk) == 8011 ||
                                intval($j->emrdfk) == 8012 ||
                                intval($j->emrdfk) == 8013 ||
                                intval($j->emrdfk) == 8014 ||
                                intval($j->emrdfk) == 8015 ||
                                intval($j->emrdfk) == 8016 ||
                                intval($j->emrdfk) == 8017 ||
                                intval($j->emrdfk) == 8018 ||
                                intval($j->emrdfk) == 8019 ||
                                intval($j->emrdfk) == 8020 ||
                                intval($j->emrdfk) == 8021 ||
                                intval($j->emrdfk) == 8022 ||
                                intval($j->emrdfk) == 8023 ||
                                intval($j->emrdfk) == 8024 ||
                                intval($j->emrdfk) == 8025 ||
                                intval($j->emrdfk) == 8026 ||
                                intval($j->emrdfk) == 8027 ||
                                intval($j->emrdfk) == 8028 ||
                                intval($j->emrdfk) == 8029 ||
                                intval($j->emrdfk) == 8030 ||
                                intval($j->emrdfk) == 8031 ||
                                intval($j->emrdfk) == 8032 ||
                                intval($j->emrdfk) == 8033 ||
                                intval($j->emrdfk) == 8034 ||
                                intval($j->emrdfk) == 8035 ||
                                intval($j->emrdfk) == 8036 ||
                                intval($j->emrdfk) == 8037 ||
                                intval($j->emrdfk) == 8038 ||
                                intval($j->emrdfk) == 8039 ||
                                intval($j->emrdfk) == 8040 ||
                                intval($j->emrdfk) == 8041 ||
                                intval($j->emrdfk) == 8042 ||
                                intval($j->emrdfk) == 8043 ||
                                intval($j->emrdfk) == 8044 ||
                                intval($j->emrdfk) == 8045 ||
                                intval($j->emrdfk) == 8046 ||
                                intval($j->emrdfk) == 8047 ||
                                intval($j->emrdfk) == 8048 ||
                                intval($j->emrdfk) == 8049 ||
                                intval($j->emrdfk) == 8050 ||
                                intval($j->emrdfk) == 8051 ||
                                intval($j->emrdfk) == 8052 ||
                                intval($j->emrdfk) == 8053 ||
                                intval($j->emrdfk) == 8054 ||
                                intval($j->emrdfk) == 8055 ||
                                intval($j->emrdfk) == 8056 ||
                                intval($j->emrdfk) == 8057 ||
                                intval($j->emrdfk) == 8058 ||
                                intval($j->emrdfk) == 8059 ||
                                intval($j->emrdfk) == 8060 ||
                                intval($j->emrdfk) == 8061 ||
                                intval($j->emrdfk) == 8062 ||
                                intval($j->emrdfk) == 8063 ||
                                intval($j->emrdfk) == 8064 ||
                                intval($j->emrdfk) == 8065 ||
                                intval($j->emrdfk) == 8066 ||
                                intval($j->emrdfk) == 8067 ||
                                intval($j->emrdfk) == 8068 ||
                                intval($j->emrdfk) == 8069 ||
                                intval($j->emrdfk) == 8070 ||
                                intval($j->emrdfk) == 8071 ||
                                intval($j->emrdfk) == 8072 ||
                                intval($j->emrdfk) == 8073 ||
                                intval($j->emrdfk) == 8074 ||
                                intval($j->emrdfk) == 8075 ||
                                intval($j->emrdfk) == 8076 ||
                                intval($j->emrdfk) == 8077 ||
                                intval($j->emrdfk) == 8078 ||
                                intval($j->emrdfk) == 8079 ||
                                intval($j->emrdfk) == 8080 ||
                                intval($j->emrdfk) == 8081 ||
                                intval($j->emrdfk) == 8082 ||
                                intval($j->emrdfk) == 8083 ||
                                intval($j->emrdfk) == 8084 ||
                                intval($j->emrdfk) == 8085 ||
                                intval($j->emrdfk) == 8086 ||
                                intval($j->emrdfk) == 8087 ||
                                intval($j->emrdfk) == 8088 ||
                                intval($j->emrdfk) == 8089 ||
                                intval($j->emrdfk) == 8090 ||
                                intval($j->emrdfk) == 8091 ||
                                intval($j->emrdfk) == 8092 ||
                                intval($j->emrdfk) == 8093 ||
                                intval($j->emrdfk) == 8094 ||
                                intval($j->emrdfk) == 8095 ||
                                intval($j->emrdfk) == 8145 ||
                                intval($j->emrdfk) == 8146 ||
                                intval($j->emrdfk) == 8147 ||
                                intval($j->emrdfk) == 8148 ||
                                intval($j->emrdfk) == 8149 ||
                                intval($j->emrdfk) == 8150 ||
                                intval($j->emrdfk) == 8151 ||
                                intval($j->emrdfk) == 8152 ||
                                intval($j->emrdfk) == 8153 ||
                                intval($j->emrdfk) == 8154 ||
                                intval($j->emrdfk) == 8155 ||
                                intval($j->emrdfk) == 8156 ||
                                intval($j->emrdfk) == 8157 ||
                                intval($j->emrdfk) == 8158 ||
                                intval($j->emrdfk) == 8159 ||
                                intval($j->emrdfk) == 8160 ||
                                intval($j->emrdfk) == 8161 ||
                                intval($j->emrdfk) == 8162 ||
                                intval($j->emrdfk) == 8163 ||
                                intval($j->emrdfk) == 8164 ||
                                intval($j->emrdfk) == 8165 ||
                                intval($j->emrdfk) == 8166 ||
                                intval($j->emrdfk) == 8167 ||
                                intval($j->emrdfk) == 8168 ||
                                intval($j->emrdfk) == 8169 ||
                                intval($j->emrdfk) == 8170 ||
                                intval($j->emrdfk) == 8171 ||
                                intval($j->emrdfk) == 8172 ||
                                intval($j->emrdfk) == 8173 ||
                                intval($j->emrdfk) == 8174 ||
                                intval($j->emrdfk) == 8175 ||
                                intval($j->emrdfk) == 8176 ||
                                intval($j->emrdfk) == 8177 ||
                                intval($j->emrdfk) == 8178 ||
                                intval($j->emrdfk) == 8179 ||
                                intval($j->emrdfk) == 8180 ||
                                intval($j->emrdfk) == 8181 ||
                                intval($j->emrdfk) == 8182 ||
                                intval($j->emrdfk) == 8183 ||
                                intval($j->emrdfk) == 8184 ||
                                intval($j->emrdfk) == 8185 ||
                                intval($j->emrdfk) == 8186 ||
                                intval($j->emrdfk) == 8187 ||
                                intval($j->emrdfk) == 8188 ||
                                intval($j->emrdfk) == 8189 ||
                                intval($j->emrdfk) == 8190 ||
                                intval($j->emrdfk) == 8191 ||
                                intval($j->emrdfk) == 8192
                            ) {
                                if ($j->value == 1) {
                                    $detailEwsDFix[$j->emrdfk] = true;
                                } else {
                                    $detailEwsDFix[$j->emrdfk] = false;
                                }
                            } elseif (in_array(intval($j->emrdfk), $emrdfkQrPegawai)) {
                                $detailEwsDFix[$j->emrdfk] = $j->value;

                                $qrcode = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $j->value);
                                $qr = $qrcode->writeDataUri();

                                $detailEwsDFix[intval($j->emrdfk) * 10 + 9] = $qr;
                            } else {
                                if (strpos($j->value, '~') == true) {
                                    $split = explode('~', $j->value);
                                    $detailEwsDFix[$j->emrdfk] = $split[1];
                                } else {
                                    $detailEwsDFix[$j->emrdfk] = $j->value;
                                }
                            }
                        }
                    }
                    $i->details = $detailEwsDFix;
                }
                $ewsDewasaFix = $noEmrEwsD;
            }
        }

        // --------------------LEMBAR PENDAMPINGAN REHABILITASI MEDIK--------------------
        $pendampingRehabFix = [];
        if ($xcetakpendampinganrehab == 1) {
            $noEmrPR = \DB::table('emrpasien_t as ep')
                ->join('pegawai_m as pg', 'pg.id', '=', 'ep.pegawaifk')
                ->select('ep.noemr', 'ep.emrfk')
                ->where('ep.noregistrasifk', $noregistrasi)
                ->where('ep.statusenabled', true)
                ->where('ep.emrfk', 2030)
                ->OrderBy('ep.tglemr', 'desc')
                ->first();

            if ($noEmrPR) {
                $detailPR = \DB::table('emrpasiend_t as emrdp')
                    ->leftjoin('emrd_t as emrd', 'emrd.id', '=', 'emrdp.emrdfk')
                    ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'emrdp.pegawaifk')
                    ->select('emrdp.*', 'emrd.caption', 'emrd.type', 'emrd.nourut', 'emrdp.emrfk', 'emrd.reportdisplay', 'emrd.kodeexternal as kodeex', 'emrd.satuan', 'pg.namalengkap')
                    ->where('emrdp.statusenabled', true)
                    ->where('emrdp.emrpasienfk', $noEmrPR->noemr)
                    ->where('emrdp.emrfk', $noEmrPR->emrfk)
                    ->orderBy('emrdp.emrdfk', 'asc')
                    ->get();

                $emrdfkQrPegawai = [3555, 3556];
                $detailPRFix = [];
                if (count($detailPR) > 0) {
                    foreach ($detailPR as $j) {
                        if (
                            intval($j->emrdfk) == 1901300140
                            || intval($j->emrdfk) == 1901300141
                        ) {
                            if ($j->value == 1) {
                                $detailPRFix[$j->emrdfk] = true;
                            } else {
                                $detailPRFix[$j->emrdfk] = false;
                            }
                        } elseif (in_array(intval($j->emrdfk), $emrdfkQrPegawai)) {
                            $split = explode('~', $j->value);
                            $detailPRFix[$j->emrdfk] = $split[1];

                            $qrcode = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $split[1]);
                            $qr = $qrcode->writeDataUri();

                            $detailPRFix[intval($j->emrdfk) * 10 + 9] = $qr;
                        } else {
                            if (strpos($j->value, '~') == true) {
                                $split = explode('~', $j->value);
                                $detailPRFix[$j->emrdfk] = $split[1];
                            } else {
                                $detailPRFix[$j->emrdfk] = $j->value;
                            }
                        }
                    }
                }
                $pendampingRehabFix = $detailPRFix;
            }
        }

        // --------------------PENGKAJIAN AWAL MEDIS RI--------------------
        $pengkajianAwalMedisRIFix = [];
        if ($xcetakpengkajianawalmedisri == 1) {
            $noEmrPAMRI = \DB::table('emrpasien_t as ep')
                ->join('pegawai_m as pg', 'pg.id', '=', 'ep.pegawaifk')
                ->select('ep.noemr', 'ep.emrfk')
                ->where('ep.noregistrasifk', $noregistrasi)
                ->where('ep.statusenabled', true)
                ->where('ep.emrfk', 2029)
                ->OrderBy('ep.tglemr', 'desc')
                ->first();

            if ($noEmrPAMRI) {
                $detailPAMRI = \DB::table('emrpasiend_t as emrdp')
                    ->leftjoin('emrd_t as emrd', 'emrd.id', '=', 'emrdp.emrdfk')
                    ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'emrdp.pegawaifk')
                    ->select('emrdp.*', 'emrd.caption', 'emrd.type', 'emrd.nourut', 'emrdp.emrfk', 'emrd.reportdisplay', 'emrd.kodeexternal as kodeex', 'emrd.satuan', 'pg.namalengkap')
                    ->where('emrdp.statusenabled', true)
                    ->where('emrdp.emrpasienfk', $noEmrPAMRI->noemr)
                    ->where('emrdp.emrfk', $noEmrPAMRI->emrfk)
                    ->orderBy('emrdp.emrdfk', 'asc')
                    ->get();

                $emrdfkQrPegawai = [1257];
                $detailPAMRIFix = [];
                if (count($detailPAMRI) > 0) {
                    foreach ($detailPAMRI as $j) {
                        if (
                            intval($j->emrdfk) == 1901300140
                            || intval($j->emrdfk) == 1901300141
                        ) {
                            if ($j->value == 1) {
                                $detailPAMRIFix[$j->emrdfk] = true;
                            } else {
                                $detailPAMRIFix[$j->emrdfk] = false;
                            }
                        } elseif (in_array(intval($j->emrdfk), $emrdfkQrPegawai)) {
                            $split = explode('~', $j->value);
                            $detailPAMRIFix[$j->emrdfk] = $split[1];

                            $qrcode = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $split[1]);
                            $qr = $qrcode->writeDataUri();

                            $detailPAMRIFix[intval($j->emrdfk) * 10 + 9] = $qr;
                        } else {
                            if (strpos($j->value, '~') == true) {
                                $split = explode('~', $j->value);
                                $detailPAMRIFix[$j->emrdfk] = $split[1];
                            } else {
                                $detailPAMRIFix[$j->emrdfk] = $j->value;
                            }
                        }
                    }
                }
                $pengkajianAwalMedisRIFix = $detailPAMRIFix;
            }
        }

        // --------------------PENGKAJIAN AWAL MEDIS GIZI--------------------
        $pengkajianAwalMedisGiziFix = [];
        if ($xcetakpengkajianawalmedisgizi == 1) {
            $noEmrPAMRI = \DB::table('emrpasien_t as ep')
                ->join('pegawai_m as pg', 'pg.id', '=', 'ep.pegawaifk')
                ->select('ep.noemr', 'ep.emrfk')
                ->where('ep.noregistrasifk', $noregistrasi)
                ->where('ep.statusenabled', true)
                ->where('ep.emrfk', 890)
                ->OrderBy('ep.tglemr', 'desc')
                ->first();

            if ($noEmrPAMRI) {
                $detailPAMRI = \DB::table('emrpasiend_t as emrdp')
                    ->leftjoin('emrd_t as emrd', 'emrd.id', '=', 'emrdp.emrdfk')
                    ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'emrdp.pegawaifk')
                    ->select('emrdp.*', 'emrd.caption', 'emrd.type', 'emrd.nourut', 'emrdp.emrfk', 'emrd.reportdisplay', 'emrd.kodeexternal as kodeex', 'emrd.satuan', 'pg.namalengkap')
                    ->where('emrdp.statusenabled', true)
                    ->where('emrdp.emrpasienfk', $noEmrPAMRI->noemr)
                    ->where('emrdp.emrfk', $noEmrPAMRI->emrfk)
                    ->orderBy('emrdp.emrdfk', 'asc')
                    ->get();

                $emrdfkQrPegawai = [1501];
                $detailPAMRIFix = [];
                if (count($detailPAMRI) > 0) {
                    foreach ($detailPAMRI as $j) {
                        if (
                            intval($j->emrdfk) == 1901300140
                            || intval($j->emrdfk) == 1901300141
                        ) {
                            if ($j->value == 1) {
                                $detailPAMRIFix[$j->emrdfk] = true;
                            } else {
                                $detailPAMRIFix[$j->emrdfk] = false;
                            }
                        } elseif (in_array(intval($j->emrdfk), $emrdfkQrPegawai)) {
                            $split = explode('~', $j->value);
                            $detailPAMRIFix[$j->emrdfk] = $split[0];
                            $qrcode = new QrCode("http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $split[0]);
                            $qr = $qrcode->writeDataUri();

                            $detailPAMRIFix[intval($j->emrdfk) * 10 + 9] = $qr;
                        } else {
                            if (strpos($j->value, '~') == true) {
                                $split = explode('~', $j->value);
                                $detailPAMRIFix[$j->emrdfk] = $split[1];
                            } else {
                                $detailPAMRIFix[$j->emrdfk] = $j->value;
                            }
                        }
                    }
                }
                $pengkajianAwalMedisGiziFix = $detailPAMRIFix;
            }
        }

        //----------------------------------------------------------------

        // --------------------KONSULTASI--------------------
        $KonsultasiFix = [];
        if ($xcetakkonsul == 1) {
            $data = DB::table('strukorder_t as so')
                ->join('pegawai_m as pg', 'pg.id', '=', 'so.objectpegawaiorderfk')
                ->join('pegawai_m as pg2', 'pg2.id', '=', 'so.objectpetugasfk')
                ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'so.noregistrasifk')
                ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                ->select([
                    'pg.namalengkap as ppatujuan',
                    'so.keteranganorder',
                    'so.tglorder',
                    'so.tgljawab',
                    'pg2.namalengkap as pengonsul',
                    'so.keteranganlainnya as jawabankonsul',
                    'ps.nocm',
                    'ps.namapasien',
                    'ps.tgllahir',
                    'ps.noidentitas as nik',
                ])
                ->where('pd.noregistrasi', $noregistrasi)
                ->where('so.statusenabled', true)
                ->first();

            if ($data) {
                $qrDokterKons = new QrCode(
                    "http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $data->pengonsul
                );
                $qrDokterKons2 = $qrDokterKons->writeDataUri();

                $qrDokterJaw = new QrCode(
                    "http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-nama?namaPegawai=" . $data->ppatujuan
                );
                $qrDokterJaw2 = $qrDokterJaw->writeDataUri();

                $KonsultasiFix[] = [ // dijadikan array biar count() aman
                    'ppatujuan'      => $data->ppatujuan,
                    'keteranganorder' => $data->keteranganorder,
                    'tglorder'       => $data->tglorder,
                    'tgljawab'       => $data->tgljawab,
                    'pengonsul'      => $data->pengonsul,
                    'jawabankonsul'  => $data->jawabankonsul,
                    'nocm'           => $data->nocm,
                    'namapasien'     => $data->namapasien,
                    'tgllahir'       => $data->tgllahir,
                    'nik'            => $data->nik,
                    'qrDokterKons2'  => $qrDokterKons2,
                    'qrDokterJaw2'   => $qrDokterJaw2,
                ];
            }
        }

        //----------------------------------------------------------------
        $dataReport = array(
            'namaprofile' => "RS TK. II BHAYANGKARA SARTIKA ASIH",
            'alamat' => "Jl. Moh. Toha No.369, Ciseureuh, Kec. Regol, Kota Bandung, Jawa Barat 40256",
            'datakemenkes' => $dataPasienKemenkes,
            'dataicd10' => $dataIcd10Pasien,
            'dataicd9' => $dataIcd9Pasien,
            'icd10primer' => $icd10primary,
            'icd10primer_inacbg' => $icd10primary_inacbg,
            'icd10sekunder_inacbg' => $icd10secondary_inacbg,
            'icd9_inacbg' => $icd9_inacbg,
            'icd10sekunder' => $icd10secondary,
            'datasep' => $sep,
            'validSep' => $validSep,
            'tglSep' => $responseSEP['response']['tglSep'] ?? null,
            'qrsep' => $qrCodePSep2,
            'namaprofile' => "RS TK. II BHAYANGKARA SARTIKA ASIH",
            'nocm' => $dataPasien[0]->nocm,
            'umurrad' => $umurrad,
            'idorder' => $idorder,
            'umur' => $umurpasien,
            'nokepesertaan' => $nokepesertaan,
            'nosep' => $nosep,
            'dokterpj' => $rincianbillingnamadokter,
            'nosepaaa' => $tampungnosep,
            'ruanganasal' => $ruanganasal,
            'namalengkap' => $namalengkap,
            'tanggal' => $tanggal,
            'tanggalcetak' => $tanggalcetak,
            'namaproduk' => $namaproduk,
            'keterangan' => $keterangan,
            'dokterrad' => $dokterrad,
            // 'nippns' =>    $nippns,
            'ekspertise' => $ekspertise,
            'hasillab' => $hasillab,
            'groupedHasillab' => $groupedHasillab,
            'qrvalidatorlab' => $qrvalidatorlab,
            'hasillabgdt' => $hasillabgdt,
            'qrvalidatorlabgdt' => $qrvalidatorlabgdt,
            'tindakanlab' => $tindakanlab,
            'tindakanrad' => $tindakanrad,
            'penunjanglab' => $penunjanglab,
            'penunjangrad' => $penunjangrad,
            'obatResume' => $obatResume,
            'obatpulang' => $obatPulang,
            'adaresume' => $adaresume,
            'objectdepartemenfk' => $dataPasien[0]->objectdepartemenfk,
            'tempatlahir' => $dataPasien[0]->tempatlahir,
            'nocm' => $dataPasien[0]->nocm,
            'tgllahir' => $dataPasien[0]->tgllahir,
            'namapasienjk' => $dataPasien[0]->namapasien,
            'jeniskelamin' => $dataPasien[0]->jeniskelamin,
            'noidentitas' => $dataPasien[0]->noidentitas,
            'kelompokpasien' => $dataPasien[0]->kelompokpasien,
            // 'tipepasien' => $dataReport2[0]->tipepasien,
            'notelepon' => $dataPasien[0]->notelepon,
            'namaruanganresume' => $namaruanganresume,
            'tglkeluarresume' => $tglkeluarresume,
            'tglmasukresume' => $tglmasukresume,
            'keluhanutamaRM' => $keluhanutamaRM,
            'diagdok' => $diagdok,
            'diagsek' => $diagsek,
            'ringkasanriwayatpenyakit' => $ringkasanriwayatpenyakit,
            'keteranganresume' => $keteranganresume,
            'alergiresume' => $alergiresume,
            'kesadaranresume' => $kesadaranresume,
            'indikasirawatinap' => $indikasirawatinap,
            'keadaanumumresume' => $keadaanumumresume,
            'pfnadi' => $pfnadi,
            'pfspo' => $pfspo,
            'pfbb' => $pfbb,
            'pftb' => $pftb,
            'pfe' => $pfe,
            'pfm' => $pfm,
            'pfv' => $pfv,
            'tindakanrm' => $tindakanrm,
            'isreaksiobat' => $isreaksiobat,
            'listreaksiobat' => $listReaksiObat,
            'kondisiwaktukeluar' => $kondisiwaktukeluar,
            'carapulang' => $carapulang,
            'ku' => $ku,
            'kesadaranpulang' => $kesadaranpulang,
            'tekanandarah' => $tekanandarahpulang,
            'suhupulang' => $suhupulang,
            'pernafasanpulang' => $pernafasanpulang,
            'nadipulang' => $nadipulang,
            'msp' => $msp,
            'ab' => $ab,
            'akyt' => $akyt,
            'perawatandirumah' => $perawatandirumah,
            'perawatandirumahlanjut' => $perawatandirumahlanjut,
            'ppp' => $ppp,
            'kebutuhanedukasi' => $kebutuhanedukasi,
            'denyutjantung' => $denyutjantung,
            'pernapasanresume' => $pernapasanresume,
            'temuanpenting' => $temuanpenting,
            'hasilkonsultasi' => $hasilkonsultasi,
            'systole' => $systole,
            'diastole' => $diastole,
            'suhuresume' => $suhuresume,
            'pemeriksaanfisik' => $pemeriksaanfisik,
            'pengobatan' => $pengobatan ?? '',
            'tindakanlab' => $tindakanlab,
            'tindakanrad' => $tindakanrad,
            'penunjanglab' => $penunjanglab,
            'penunjangrad' => $penunjangrad,
            'alasanrawat' => $alasanrawat,
            'konsultasi' => $konsultasi,
            'diagnosautama' => $diagnosautama,
            'diagnosaawal' => $diagnosaawal,
            'diagnosasekunder' => $diagnosasekunder,
            'diagnosatindakan' => $diagnosatindakan,
            'diet' => $diet,
            'keterangandiet' => $keterangandiet,
            'edukasi' => $edukasi,
            'prognosis' => $prognosis,
            'rencanatindaklanjut' => $rencanatindaklanjut,
            'kontrol' => $kontrol,
            'tglkontrolpoli' => $tglkontrolpoli,
            'keadaandarurat2' => $keadaandarurat2,
            'sarantransportasi' => $sarantransportasi,
            'kondisimeninggalkan' => $kondisimeninggalkan,
            'qrdpjpresume' => $qrdpjpresume,
            'namapasienrm' => $namapasienrm,
            'qrpasienrm' => $qrpasienrm,
            'pasienkeluarga' => $pasienkeluarga,
            'namadokter' => $namadokter,
            'datarincianbilling' => $rincianbilling,
            'datarincianproduk' => $rincianproduk,
            'namarekanan' => $dataPasien[0]->namarekanan,
            'kelasfaktur' => $kelasfaktur,
            'namapasienjk' => $dataPasien[0]->namapasien,
            'tglpulang' => $dataPasien[0]->tglpulang,
            'namakamar' => $kamar,
            'nobed' => $nobed,
            'tglregistrasi' => $dataPasien[0]->tglregistrasi,
            'lastruangan' => $rincianbillingnamaruangan,
            'noregistrasi' => $dataPasien[0]->noregistrasi,
            'alamatlengkap' => $dataPasien[0]->alamatlengkap,
            'kesatuanpasien' => $dataPasien[0]->kesatuanpasien,
            'lastharusbayar' => $this->getLaststruk($rincianbilling[0]->norec_pd),
            'cppt' => $cppt,
            'transfusiDarahFix' => $transfusiDarahFix,
            'triaseFetomaternalFix' => $triaseFetomaternalFix,
            'codeBlueFix' => $codeBlueFix,
            'derajatDehidrasiFix' => $derajatDehidrasiFix,
            'laporanTindakanFix' => $laporanTindakanFix,
            'ewsDewasaFix' => $ewsDewasaFix,
            'pendampingRehabFix' => $pendampingRehabFix,
            'pengkajianAwalMedisRIFix' => $pengkajianAwalMedisRIFix,
            'pengkajianAwalMedisGiziFix' => $pengkajianAwalMedisGiziFix,
            'KonsultasiFix' => $KonsultasiFix,
            'dehidrasiresusitasi' => $dehidrasiresusitasi,
            'tatalaksanaaritmia' => $tatalaksanaaritmia,
            'resusiitasijantungparu' => $resusiitasijantungparu,
            'transfusi' => $transfusi,
            'fibrinolitik' => $fibrinolitik,
            'antikoagulanantiagregrasi' => $antikoagulanantiagregrasi,
            'ventilatorkurangdari96jam' => $ventilatorkurangdari96jam,
            'ventilatorlebih96jam' => $ventilatorlebih96jam,
            'oksigenasi' => $oksigenasi,
            'nebulisasi' => $nebulisasi,
            'trakeostomi' => $trakeostomi,
            'koreksielektrolitmetabolic' => $koreksielektrolitmetabolic,
            'bantuanpersalinan' => $bantuanpersalinan,
            'monitoringttvkesadaranskalanyeri' => $monitoringttvkesadaranskalanyeri,
            'pemberianinotropikvasoaktif' => $pemberianinotropikvasoaktif,
            'antibiotik3kali24jam' => $antibiotik3kali24jam,
            'result' => array(
                'kelasRawat' => $rincianbillingnamakelas,
                'jenisPasien' => $dataPasien[0]->kelompokpasien,
                'kelasPenjamin' => $rincianbillingnamakelas,
                'deposit' => $this->getDepositPasien($dataPasien[0]->noregistrasi),
                'billing' => $dataTotalBilltotal,
                'isi' => $isi,
                // 'lastharusbayar' => $rincianbillingharusbayar,
                'terbilang' => $terbilang
            ),
            'result2' => array(
                'kelasRawat' => $rincianbillingnamakelas,
                'jenisPasien' => $dataPasien[0]->kelompokpasien,
                'kelasPenjamin' => $rincianbillingnamakelas,
                'deposit' => $this->getDepositPasien($dataPasien[0]->noregistrasi),
                'billing' => $dataTotalBilltotal,
                'isi' => $isi,
                // 'lastharusbayar' => $rincianbillingharusbayar,
                'terbilang' => $terbilang
            ),
        );
        if ($xcetaktriase == 1) {
            $dataReport['dataTriaseIGD'] = $dataTriaseIGD;
        } else {
            $dataReport['dataTriaseIGD'] = [];
        }
        if ($xcetakhemodialisa == 1) {
            $dataReport['dataHemodialisa'] = $dataHemodialisa;
        } else {
            $dataReport['dataHemodialisa'] = [];
        }
        if ($xcetakasesmenrehab == 1) {
            $dataReport['dataAsesmenRehab'] = $dataAsesmenRehab;
            $dataReport['dataKonsulRehab'] = $dataKonsulRehab;
        } else {
            $dataReport['dataAsesmenRehab'] = [];
            $dataReport['dataKonsulRehab'] = [];
        }
        // $dataReport['dataAsesmenRehab'] = $xcetakasesmenrehab == 1 ? [$dataAsesmenRehab] : [];
        if ($xcetaklaporanoperasi == 1) {
            $dataReport['dataLaporanOperasi'] = $dataLaporanOperasi;
        } else {
            $dataReport['dataLaporanOperasi'] = [];
        }
        if ($xcetakspri == 1) {
            $dataReport['dataSPRI'] = $dataSPRI;
        } else {
            $dataReport['dataSPRI'] = [];
        }
        if ($xcetakpengkajianigd == 1) {
            $dataReport['dataPengkajianMedisIGD'] = $dataPengkajianMedisIGD;
        } else {
            $dataReport['dataPengkajianMedisIGD'] = [];
        }
        $documents = [
            'kemenkes' => $filekemenkes,
            'sep' => $filesep,
            'resume_medis' => $fileresumemedis,
            'radiologi' => $fileradiologi,
            'laboratorium' => $filelaboratorium,
            'echo' => $fileecho,
            'ekg' => $fileekg,
            'usg' => $fileusg,
            'surkon' => $filesurkon,
            'pa' => $filepa,
            'doktambahan' => $filedoktambahan,
            'billing' => $filebilling,
            'infasi' => $fileinfasi
        ];
        $documents = array_filter($documents, function ($doc) {
            return !empty($doc);
        });
        $pageWidth = '100%';
        // dd($documents);
        return view(
            'report.rad.cetaknewtes_donwload',
            compact('documents', 'dokumenallArray', 'pageWidth', 'dataReport')
        );
    }
}
