<?php

/**
 * Created by PhpStorm.
 * User: as@epic
 * Date: 9/19/2017
 * Time: 11:44 PM
 */

namespace App\Http\Controllers\EMR;

use App\Http\Controllers\ApiController;
use App\Master\DiagnosaKeperawatan;
use App\Master\Evaluasi;
use App\Master\Implementasi;
use App\Master\Intervensi;
use App\Master\JenisKelamin;
use App\Master\Kelas;
use App\Master\KelompokPasien;
use App\Master\KelompokTransaksi;
use App\Master\Pasien;
use App\Master\Pegawai;
use App\Master\Ruangan;
use App\Master\SettingDataFixed;
use App\Master\ResepMaster;
use App\Master\DetailResepMaster;
use App\Transaksi\Anamnesis;
use App\Transaksi\AntrianPasienDiperiksa;
use App\Transaksi\AntrianPasienRegistrasi;
use App\Transaksi\CPPT;
use App\Transaksi\CPPTDetail;
use App\Transaksi\DetailDiagnosaPasien;
use App\Transaksi\DetailDiagnosaTindakanPasien;
use App\Transaksi\DiagnosaPasien;
use App\Transaksi\DiagnosaTindakanPasien;
use App\Transaksi\Edukasi;
use App\Transaksi\EECG;
use App\Transaksi\EmrFoto;
use App\Transaksi\EmrAnestesi;
use App\Transaksi\EMRPasienD_Temp;
use App\Transaksi\FormulisObat;
use App\Transaksi\FormulisObatDetail;
use App\Transaksi\KendaliDokumenRekamMedis;
use App\Transaksi\LoggingUser;
use App\Transaksi\OrderPelayanan;
use App\Transaksi\PasienDaftar;
use App\Transaksi\PasienPerjanjian;
use App\Transaksi\PemeriksaanUmum;
use App\Transaksi\PengkajianAwalBaru;
use App\Transaksi\RekamMedisDokter;
use App\Transaksi\RekamMedis;
use App\Transaksi\Tatalaksana;
use App\Transaksi\tempviewicu;
use App\Transaksi\MasalahICU;
use App\Transaksi\MasalahICUHead;
use App\Transaksi\SoapEmr;
use App\Transaksi\temporariigd;
use App\Transaksi\RekamMedisICU;
use App\Transaksi\RekamMedisICUDetail;
use App\Transaksi\Rencana;
use App\Transaksi\ResumeMedis;
use App\Transaksi\ResumeMedisDetail;
use App\Transaksi\RisOrder;
use App\Transaksi\RiwayatPengobatan;
use App\Transaksi\RmPemeriksaanFisik;
use App\Transaksi\StrukOrder;
use App\Transaksi\EMRPasien;
use App\Transaksi\EMRPasienD;
use App\Transaksi\EMROdontogram;
use App\Transaksi\Surveilans;
use App\Transaksi\SurveilansAntibiotik;
use App\Transaksi\SurveilansFaktorResiko;
use App\Transaksi\SurveilansFrd;
use App\Transaksi\SurveilansOperasi;
use App\Transaksi\TempEMR;
use App\Transaksi\RencanaAskep;

use App\Transaksi\KepatuhanCuciTangan;
use App\Transaksi\KepatuhanHandHygiene;
use App\Transaksi\SeqNumberEMR;
use Illuminate\Http\Request;
//use Illuminate\Http\Response;
use DB;
use App\Traits\Valet;
//use Carbon\Carbon;
use MongoDB\Driver\ReadConcern;
use phpDocumentor\Reflection\Types\Null_;
use Webpatser\Uuid\Uuid;



class EMRController  extends ApiController
{
    use Valet;

    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }

    public function saveRekamMedis(Request $request)
    {
        DB::beginTransaction();
        try {
            if (
                isset($request['form']) &&
                $request['form'] == "masalahkeperawatan" &&
                isset($request['kodeexternal'])
            ) {
                $delete = RekamMedis::where('riwayatpapfk', $request['riwayatpapfk'])
                    ->where('noregistrasifk', $request['noregistrasifk'])
                    ->where('kodeexternal', $request['kodeexternal'])
                    ->delete();
            }
            foreach ($request['data'] as $item) {
                if ($item['norec'] == '-') {
                    $RekamMedis = new RekamMedis();
                    $RekamMedis->norec = $RekamMedis->generateNewId();
                    $RekamMedis->kdprofile = 0;
                    $RekamMedis->statusenabled = true;
                } else {
                    $RekamMedis = RekamMedis::where('norec', $item['norec'])->first();
                }
                $RekamMedis->objectfk = $item['objectfk'];
                if (isset($request['noregistrasifk'])) {
                    $RekamMedis->noregistrasifk = $request['noregistrasifk'];
                }
                $RekamMedis->nilai = $item['nilai'];
                $RekamMedis->satuan = $item['satuan'];
                $RekamMedis->jenisobject = $item['jenisobject'];
                if (isset($request['riwayatpapfk'])) {
                    $RekamMedis->riwayatpapfk = $request['riwayatpapfk'];
                }
                if (isset($request['kodeexternal'])) {
                    $RekamMedis->kodeexternal = $request['kodeexternal'];
                }
                if (isset($request['jenisskrining'])) {
                    $RekamMedis->jenisskrining = $request['jenisskrining'];
                }
                if (isset($request['nocm'])) {
                    $RekamMedis->nocm = $request['nocm'];
                }
                $RekamMedis->save();
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Data Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'ea@epic',
            );
        } else {
            $transMessage = "Simpan Data Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message' => $transMessage,
                'as' => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getRekamMedis(Request $request)
    {
        $dataLogin = $request->all();
        $data = \DB::table('rekammedis_t as rm')
            ->select('rm.norec', 'rm.objectfk', 'rm.nilai', 'rm.satuan', 'rm.jenisobject', 'rm.noregistrasifk')
            //            ->where('rm.noregistrasifk',$request['noregistrasifk'])
            ->where('rm.objectfk', 'ilike', $request['objectfk'] . '%');
        //            ->where('rm.kodeexternal','igd');
        if (isset($request['riwayatfk']) && $request['riwayatfk'] != '') {
            $data = $data->where('rm.riwayatpapfk', '=', $request['riwayatfk']);
        }
        if (isset($request['Nocm']) && $request['Nocm'] != '') {
            $data = $data->where('rm.nocm', '=', $request['Nocm']);
        }
        if (isset($request['kodeExt']) && $request['kodeExt'] != '') {
            $data = $data->where('rm.jenisskrining', '=', $request['kodeExt']);
        }

        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'miftah',
        );

        return $this->respond($result);
    }

    public function getDiagnosaPasien(Request $request)
    {
        $noregistrasi = $request['noregistrasi'];
        $data = DB::select(
            DB::raw("select DISTINCT 
                         pasiendaftar_t.tglregistrasi, detaildiagnosapasien_t.objectdiagnosafk, detaildiagnosapasien_t.objectdiagnosapasienfk, detaildiagnosapasien_t.objectjenisdiagnosafk, detaildiagnosapasien_t.tglinputdiagnosa, 
                         detaildiagnosapasien_t.keterangan, detaildiagnosapasien_t.objectpegawaifk, pasiendaftar_t.noregistrasi, diagnosa_m.namadiagnosa, diagnosa_m.kddiagnosa, jenisdiagnosa_m.jenisdiagnosa, ruangan_m.namaruangan
                        FROM            ruangan_m INNER JOIN
                         antrianpasiendiperiksa_t ON ruangan_m.id = antrianpasiendiperiksa_t.objectruanganfk RIGHT OUTER JOIN
                         detaildiagnosapasien_t ON antrianpasiendiperiksa_t.norec = detaildiagnosapasien_t.noregistrasifk LEFT OUTER JOIN
                         pasiendaftar_t ON antrianpasiendiperiksa_t.noregistrasifk = pasiendaftar_t.norec LEFT OUTER JOIN
                         diagnosa_m ON detaildiagnosapasien_t.objectdiagnosafk = diagnosa_m.id LEFT OUTER JOIN
                         jenisdiagnosa_m ON detaildiagnosapasien_t.objectjenisdiagnosafk = jenisdiagnosa_m.id where pasiendaftar_t.noregistrasi = $noregistrasi")
        );
        return $this->respond($data);
    }
    public function getComboRekMed(Request $request)
    {
        $dataLogin = $request->all();
        $dataPegawaiLogin = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id', $dataLogin['userData']['id'])
            ->first();

        $kebangsaan = \DB::table('kebangsaan_m as rm')
            ->select('rm.id', 'rm.name')
            ->where('rm.statusenabled', true)
            ->get();

        $agama = \DB::table('agama_m as rm')
            ->select('rm.id', 'rm.agama')
            ->where('rm.statusenabled', true)
            ->get();

        $ruangan = \DB::table('ruangan_m as rm')
            ->select('rm.id', 'rm.namaruangan')
            ->where('rm.statusenabled', true)
            ->get();
        $statusperkawinan = \DB::table('statusperkawinan_m as rm')
            ->select('rm.id', 'rm.statusperkawinan')
            ->where('rm.statusenabled', true)
            ->get();
        $golongandarah = \DB::table('golongandarah_m as rm')
            ->select('rm.id', 'rm.golongandarah')
            ->where('rm.statusenabled', true)
            ->where('rm.golongandarah', '!=', '-')
            ->get();
        $dokter = \DB::table('pegawai_m as rm')
            ->select('rm.id', 'rm.namalengkap')
            ->where('rm.statusenabled', true)
            ->where('rm.objectjenispegawaifk', 1)
            ->orderBy('rm.namalengkap')
            ->get();

        $deptJalan = explode(',', $this->settingDataFixed('kdDepartemenRawatJalanFix'));
        $kdDepartemenRawatJalan = [];
        foreach ($deptJalan as $item) {
            $kdDepartemenRawatJalan[] = (int)$item;
        }
        $ruangKonsul = \DB::table('ruangan_m as ru')
            ->select('ru.id', 'ru.namaruangan')
            ->whereIn('ru.objectdepartemenfk', $kdDepartemenRawatJalan)
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();
        $dataRuanganJalan = \DB::table('ruangan_m as ru')
            ->select('ru.id', 'ru.namaruangan', 'ru.objectdepartemenfk')
            ->where('ru.statusenabled', true)
            ->wherein('ru.objectdepartemenfk', $kdDepartemenRawatJalan)
            ->orderBy('ru.namaruangan')
            ->get();
        $JenisKelamin = JenisKelamin::where('statusenabled', true)
            ->select('id', 'jeniskelamin')
            ->get();
        $ruangKonsulNonPenunjang = \DB::table('ruangan_m as ru')
            ->select('ru.id', 'ru.namaruangan')
            ->whereIn('ru.objectdepartemenfk', [18, 24, 28, 34, 26, 40, 30, 45, 27, 6])
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();
        $pegawai = \DB::table('pegawai_m as pg')
            ->select('pg.id', 'pg.namalengkap')
            ->where('pg.statusenabled', true)
            ->get();
        $jenispetugas = \DB::table('jenispetugaspelaksana_m as jpp')
            ->select('jpp.id', 'jpp.jenispetugaspe')
            // ->whereIn('jpp.id', [22, 23, 24])
            ->where('jpp.kodeexternal', 99)
            ->orderBy('jpp.id')
            ->get();

        $perawat = \DB::table('pegawai_m as rm')
            ->select('rm.id', 'rm.namalengkap')
            ->where('rm.statusenabled', true)
            ->where('rm.objectjenispegawaifk', 2)
            ->orderBy('rm.namalengkap')
            ->get();
        $perawatBidan = \DB::table('pegawai_m as rm')
            ->select('rm.id', 'rm.namalengkap')
            ->where('rm.statusenabled', true)
            ->whereIn('rm.objectjenispegawaifk', [2,3])
            ->orderBy('rm.namalengkap')
            ->get();
        $pegawaiAll = \DB::table('pegawai_m as rm')
            ->select('rm.id', 'rm.namalengkap')
            ->where('rm.statusenabled', true)
            ->whereNotNull('rm.objectjenispegawaifk')
            ->orderBy('rm.namalengkap')
            ->get();
        $reouteFarmasi = \DB::table('routefarmasi as rf')
            ->select('rf.id', 'rf.name as text')
            ->where('rf.statusenabled', true)
            // ->whereNotNull('rm.objectjenispegawaifk')
            ->orderBy('rf.name')
            ->get();
        //  $diagnosa = \DB::table('diagnosa_m as dg')
        //     ->select((DB::raw("id,kddiagnosa||' '||namadiagnosa as diagnosa")))            
        //     ->where('dg.statusenabled', true)
        //     ->orderBy('dg.kddiagnosa')
        //     ->get();
        $adatidak = [
            0 => ["id" => "1", "adatidak" => "Ada"],
            1 => ["id" => "2", "adatidak" => "Tidak Ada"]
        ];

        $sedasi = [
            0 => ["id" => "1", "sedasi" => "Moderat"],
            1 => ["id" => "2", "sedasi" => "Dalam"]
        ];

        $anestesi = [
            0 => ["id" => "1", "anestesi" => "LMA"],
            1 => ["id" => "2", "anestesi" => "Intubasi"]
        ];

        $teknik = [
            0 => ["id" => "1", "teknik" => "Caudal"],
            1 => ["id" => "2", "teknik" => "Saddle block"],
            2 => ["id" => "3", "teknik" => "Spinal"],
            3 => ["id" => "4", "teknik" => "Epidural"],
            4 => ["id" => "5", "teknik" => "Blockade saraf tepi"]
        ];

        $yatidak = [
            0 => ["id" => "1", "yatidak" => "Ya"],
            1 => ["id" => "2", "yatidak" => "Tidak"]
        ];

        $letak = [
            0 => ["id" => "1", "letak" => "Supine"],
            1 => ["id" => "2", "letak" => "Prone"],
            2 => ["id" => "3", "letak" => "Lithotomi"],
            3 => ["id" => "4", "letak" => "Fowler"],
            4 => ["id" => "5", "letak" => "Lateral dekubitus (R / L)"],
            5 => ["id" => "6", "letak" => "Trendelenburg"]
        ];

        $airway = [
            0 => ["id" => "1", "airway" => "O2 Canule"],
            1 => ["id" => "2", "airway" => "Face mask"],
            2 => ["id" => "3", "airway" => "LMA"],
            3 => ["id" => "4", "airway" => "Single lumen ETT"],
            4 => ["id" => "5", "airway" => "Double Lumen ETT (R / L)"]
        ];

        $keadaan = [
            0 => ["id" => "1", "keadaan" => "Hidup"],
            1 => ["id" => "2", "keadaan" => "Meninggal"]
        ];

        $kesadaran = [
            0 => ["id" => "1", "kesadaran" => "Sadar"],
            1 => ["id" => "2", "kesadaran" => "Belum Sadar"],
            2 => ["id" => "3", "kesadaran" => "Tidur Dalam"]
        ];

        $dibantu = [
            0 => ["id" => "1", "dibantu" => "Kanul Nasal"],
            1 => ["id" => "2", "dibantu" => "Simple Mask"],
            2 => ["id" => "3", "dibantu" => "ETT"]
        ];

        $VitalSigns = \DB::table('vitalsigns_m as emr')
            ->select('emr.id', 'emr.vitalsigns')
            ->where('emr.statusenabled', true)
            ->whereNotIn('emr.id', [1, 2, 4])
            ->get();

        $result = array(
            'kebangsaan' => $kebangsaan,
            'agama' => $agama,
            'ruangan' => $ruangan,
            'statusperkawinan' => $statusperkawinan,
            'golongandarah' => $golongandarah,
            'dokter' => $dokter,
            'perawat' => $perawat,
            'perawatBidan' => $perawatBidan,
            'pegawaiAll' => $pegawaiAll,
            'adaTidak' => $adatidak,
            'sedasi' => $sedasi,
            'anestesi' => $anestesi,
            'teknik' => $teknik,
            'yatidak' => $yatidak,
            'letak' => $letak,
            'airway' => $airway,
            'keadaan' => $keadaan,
            'kesadaran' => $kesadaran,
            'vitalsigns' => $VitalSigns,
            'ruangankonsul' => $ruangKonsul,
            'ruanganrajal' => $dataRuanganJalan,
            'pegawailogin' => $dataPegawaiLogin,
            'jeniskelamin' => $JenisKelamin,
            'ruangkonsulnonpenunjang' => $ruangKonsulNonPenunjang,
            'pegawai' => $pegawai,
            'jenispetugas' => $jenispetugas,
            'dibantu' => $dibantu,
            'message' => 'inhuman',
            'reouteFarmasi' => $reouteFarmasi,
            // 'diagnosa'=> $diagnosa
        );

        return $this->respond($result);
    }
    public function getComboListAskep(Request $request)
    {
        $noregistrasi = $request['noregistrasi'];
        $askep = DB::select(
            DB::raw("
                    SELECT DISTINCT emrpasiend_t.emrfk as id,emr_t.caption, CONCAT( emr_t.caption, emrpasien_t.tglemr) AS diagnosa,emrpasien_t.noregistrasifk,emrpasiend_t.emrpasienfk 
                    FROM emrpasiend_t INNER JOIN
                    emr_t ON emrpasiend_t.emrfk = emr_t.id INNER JOIN
                    emrpasien_t ON emrpasiend_t.emrpasienfk = emrpasien_t.noemr
                    WHERE emrpasien_t.noregistrasifk = '$noregistrasi' and emr_t.caption like '%D.%' and emrpasiend_t.value <>'0' ")
        );
        $result = array(
            'askep' => $askep
      
        );

        return $this->respond($result);

    }
     public function getDataAskep(Request $request)
    {
        $noemr = $request['noemr'];
        $emrfk = $request['emrfk'];
        $askep = DB::select(
            DB::raw("
                    select distinct * from (
                    SELECT      emraskep_t.kolom,  emrpasiend_t.emrpasienfk, emrpasiend_t.emrdfk, emrpasiend_t.emrfk, emrpasiend_t.tgl, emr_t.namaemr, emr_t.caption, case when type ='combobox' then  '-'+emraskep_t.caption + substring(emrpasiend_t.value,3,10) else '-'+ emraskep_t.caption end AS captionemr, emrpasiend_t.value, emraskep_t.type,emraskep_t.nourut
                    FROM            emrpasiend_t INNER JOIN
                                            emraskep_t ON emrpasiend_t.emrdfk = emraskep_t.id INNER JOIN
                                            emr_t ON emrpasiend_t.emrfk = emr_t.id
                    WHERE        (emrpasiend_t.emrpasienfk =  '$noemr' ) and emraskep_t.emrfk=$emrfk
                    union all

                    SELECT  distinct   emraskep_t.kolom, '' as emrpasienfk,'' as emrdfk,'' as  emrfk, '' as tgl, emr_t.namaemr, emr_t.caption, emraskep_t.caption AS captionemr, '' as value, emraskep_t.type, emraskep_t.nourut
                    FROM            emrpasiend_t INNER JOIN
                                            emr_t ON emrpasiend_t.emrfk = emr_t.id RIGHT OUTER JOIN
                                            emraskep_t ON emr_t.id = emraskep_t.emrfk
                    WHERE        (emrpasiend_t.emrpasienfk =  '$noemr' ) and style is not null and type='label' and emraskep_t.emrfk=$emrfk ) as x
                    order by kolom DESC, nourut ASC
                    ")
        );
        // $datadiagnosa="";
        // foreach ($askep as $item) {
        //     if($item->kolom == 1){
        //         $datadiagnosa = $datadiagnosa . " \ " .$item->captionemr;
        //     }
        // }
        $result = array(
            'askep' => $askep
      
        );

        return $this->respond($result);

    }
    public function getAPD(Request $request)
    {
        $data = \DB::table('antrianpasiendiperiksa_t as apd')
            ->select('apd.*')
            ->where('apd.noregistrasifk', $request['norec_pd'])
            ->where('apd.objectruanganfk', $request['ruangan'])
            ->get();

        return $this->respond($data);
    }
    public function getRMI(Request $request)
    {
        $data = \DB::table('antrianpasiendiperiksa_t as apd')
            ->join('rekammedisicu_t as rmi', 'rmi.noregistrasifk', '=', 'apd.norec')
            ->select('rmi.norec')
            ->where('apd.noregistrasifk', $request['norec_pd'])
            ->where('rmi.jenisemr', $request['jenisemr'])
            ->get();
        $result = array(
            'Data' => $data,
            'message' => 'dahlah'
        );

        return $this->respond($result);
    }
    public function getRMI2(Request $request)
    {
        $data = \DB::table('antrianpasiendiperiksa_t as apd')
            ->join('rekammedisicu_t as rmi', 'rmi.noregistrasifk', '=', 'apd.norec')
            ->select('rmi.norec')
            ->where('apd.noregistrasifk', $request['norec_pd'])
            ->where('rmi.jenisemr', $request['jenisemr'])
            ->get();

        $result = array(
            'Data' => $data,
            'message' => 'dahlah'
        );

        return $this->respond($result);
    }
    public function getHistoryIntraAnestesi(Request $request)
    {
        $data = \DB::table('emranestesi_t as eia')
            // ->join('rekammedisicu_t as rmi', 'rmi.norec', '=', 'eia.emricufk')
            ->select('eia.*')
            ->where('eia.emricufk', $request['noregistrasifk'])
            // ->where('rmi.norec', $request['norec_apd'])
            // ->where('rmi.jenisemr', 'intra')
            ->get();

        return $this->respond($data);
    }
    public function getHistoryPascaAnestesi(Request $request)
    {
        $data = \DB::table('emranestesi_t as eia')
            // ->join('rekammedisicu_t as rmi', 'rmi.norec', '=', 'eia.emricufk')
            ->select('eia.*')
            ->where('eia.emricufk', $request['norecemr'])
            // ->where('rmi.norec', $request['norec_apd'])
            // ->where('rmi.jenisemr', 'pasca')
            ->get();

        return $this->respond($data);
    }
    public function getInfoPasien(Request $request)
    {
        $data = \DB::table('pasien_m as ps')
            ->leftJoin('pasiendaftar_t as pd', 'pd.nocmfk', '=', 'ps.id')
            ->leftJoin('agama_m as agm', 'agm.id', '=', 'ps.objectagamafk')
            ->leftJoin('statusperkawinan_m as sp', 'sp.id', '=', 'ps.objectstatusperkawinanfk')
            ->leftJoin('kebangsaan_m as kb', 'kb.id', '=', 'ps.objectkebangsaanfk')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->select(
                'pd.noregistrasi',
                'ps.nocm',
                'ps.namapasien',
                'ps.objectagamafk',
                'agm.agama',
                'ps.objectstatusperkawinanfk',
                'sp.statusperkawinan',
                'ps.objectkebangsaanfk',
                'kb.name as kebangsaan',
                'pd.objectruanganlastfk',
                'ru.namaruangan',
                'pd.tglpulang',
                DB::raw("case when pd.noregistrasi is not null and pd.tglpulang is null then 'dirawat' else 'tidak dirawat' end
                as statusrawat, case when ps.objectstatusperkawinanfk in (2,3) then 'kawin' else 'belum kawin' end as statuskawin")
            )
            ->where('ps.nocm', $request['noCm'])
            ->orderBy('pd.noregistrasi', 'desc')
            ->get();

        $result = array(
            'data' => $data,
            'message' => 'inhuman',
        );
        return $this->respond($result);
    }

    public function getMasterPAP(Request $request)
    {
        $dataLogin = $request->all();
        $dataHead = DB::table('pengkajianawal_m as pap')
            ->select('*');

        if (isset($request['id']) && $request['id'] != "") {
            $dataHead = $dataHead->where('pap.id', '=', $request['id']);
        }
        $dataHead = $dataHead->get();

        $result = array();
        foreach ($dataHead as $item) {
            $headfk = $item->id;
            $child1 = DB::select(
                DB::raw("
                      select *
                      from pengkajianawal_m as pap
                      where pap.headpengkajianawalfk=$headfk;")
            );
            foreach ($child1 as $items) {
                $headfk1 = $items->id;
                $child2 = DB::select(
                    DB::raw("
                      select *
                      from pengkajianawal_m as pap
                      where pap.headpengkajianawalfk=$headfk1;")
                );

                foreach ($child2 as $items2) {
                    $headfk2 = $items2->id;
                    $child3 = DB::select(
                        DB::raw("
                      select *
                      from pengkajianawal_m as pap
                      where pap.headpengkajianawalfk=$headfk2;")
                    );

                    foreach ($child3 as $items3) {
                        $headfk3 = $items3->id;
                        $child4 = DB::select(
                            DB::raw("
                              select *
                              from pengkajianawal_m as pap
                              where pap.headpengkajianawalfk=$headfk3;")
                        );
                    }
                }
            }
        }
        $detail4[] = array(
            'id' => $items3->id,
            'nama' => $items3->nama,
            'descNilai' => $items3->descnilai,
            'value' => null,
            'detail' => $child4
        );

        $detail3[] = array(
            'id' => $items2->id,
            'nama' => $items2->nama,
            'descNilai' => $items2->descnilai,
            'value' => null,
            'detail' => $detail4
        );

        $detail2[] = array(
            'id' => $items->id,
            'nama' => $items->nama,
            'descNilai' => $items->descnilai,
            'value' => null,
            'detail' => $detail3
        );
        $detail[] = array(
            'id' => $item->id,
            'nama' => $item->nama,
            'descNilai' => $item->descnilai,
            'value' => null,
            'detail' => $detail2
        );

        $result[] = array(
            'pengkajianawal' => $detail
        );

        return $this->respond($result);
    }

    public function getDiagnosaKeperawatan(Request $request)
    {
        $data = \DB::table('diagnosakeperawatan_m as dp')
            ->select('dp.id', 'dp.namadiagnosakep as namaDiagnosaKep', 'dp.kodeexternal', 'dp.diagnosakep', 'dp.deskripsidiagnosakep')
            ->where('dp.statusenabled', true);

        if (isset($request['id']) && $request['id'] != '') {
            $data = $data->where('dp.id', $request['id']);
        }

        if (isset($request['namadiagnosakep']) && $request['namadiagnosakep'] != '') {
            $data = $data->where('dp.namadiagnosakep', 'ilike', '%' . $request['namadiagnosakep'] . '%');
        }
        if (isset($request['kodeexternal']) && $request['kodeexternal'] != '') {
            $data = $data->where('dp.kodeexternal', 'ilike', '%' . $request['kodeexternal'] . '%');
        }
        $data = $data->orderBy('dp.namadiagnosakep');
        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'inhuman',
        );
        return $this->respond($result);
    }

    public function getDetailDiagnosaKeperawatan($id)
    {
        $dataHead = DB::table('diagnosakeperawatan_m as pap')
            ->select('pap.id', 'pap.namadiagnosakep')
            ->where('pap.id', $id)
            ->where('pap.statusenabled', true)
            ->get();
        $detail = [];
        foreach ($dataHead as $item) {

            $implementasi = DB::table('implementasi_m as pap')
                ->select('pap.name', 'pap.id', 'pap.kodeexternal')
                ->where('pap.objectdiagnosakeperawatanfk', $id)
                ->where('pap.statusenabled', true)
                ->get();
            $intervensi = DB::table('intervensi_m as pap')
                ->select('pap.name', 'pap.id', 'pap.kodeexternal')
                ->where('pap.objectdiagnosakeperawatanfk', $id)
                ->where('pap.statusenabled', true)
                ->get();
            $evaluasi = DB::table('evaluasi_m as pap')
                ->select('pap.name', 'pap.id', 'pap.kodeexternal')
                ->where('pap.objectdiagnosakeperawatanfk', $id)
                ->where('pap.statusenabled', true)
                ->get();
            $detail[] = array(
                'nama' => $item->namadiagnosakep,
                'header' => 'Intervensi',
                'id' => $item->id,
                'detail' => $intervensi
            );
            $detail[] = array(
                'nama' => $item->namadiagnosakep,
                'header' => 'Implementasi',
                'id' => $item->id,
                'detail' => $implementasi
            );
            $detail[] = array(
                'nama' => $item->namadiagnosakep,
                'header' => 'Evaluasi',
                'id' => $item->id,
                'detail' => $evaluasi
            );
        }
        return $this->respond($detail);
    }

    public function getHistoryDiagnosaKeperawatan(Request $request)
    {
        $head = [];
        $object = $request['objectfk'];
        $arrObject = explode(",", $object);
        $imp = \DB::table('rekammedis_t as rm')
            ->select(
                'rm.norec',
                'rm.objectfk',
                'rm.nilai',
                'rm.satuan',
                'rm.jenisobject',
                'rm.noregistrasifk',
                'ev.name',
                'ev.id',
                'dp.kodeexternal',
                'dp.id as diagnosakep_id',
                'dp.namadiagnosakep'
            )
            ->leftjoin('diagnosakeperawatan_m as dp', DB::raw("dp.id"), '=', 'rm.nilai')
            ->leftjoin('implementasi_m as ev', 'ev.kodeexternal', '=', 'rm.objectfk')
            ->where('rm.noregistrasifk', $request['noregistrasifk'])
            ->where('rm.riwayatpapfk', '=', $request['riwayatfk'])
            ->where(function ($query) use ($arrObject) {
                for ($i = 0; $i < count($arrObject); $i++) {
                    $query->orWhere('rm.objectfk', 'ilike', $arrObject[$i] . '%');
                }
            })
            ->orderBy('dp.id')
            ->get();

        foreach ($imp as $itemhead) {
            if ($itemhead->diagnosakep_id !== null) {
                $implementasi = DB::table('implementasi_m as pap')
                    ->select('pap.name', 'pap.id', 'pap.kodeexternal')
                    ->join('rekammedis_t as rm', DB::raw("pap.id"), '=', 'rm.nilai')
                    ->where('rm.objectfk', 'ilike', '%IMP%')
                    ->where('pap.objectdiagnosakeperawatanfk', $itemhead->diagnosakep_id)
                    ->where('pap.statusenabled', true)
                    ->where('rm.noregistrasifk', $request['noregistrasifk'])
                    ->where('rm.riwayatpapfk', $request['riwayatfk'])
                    ->groupBy('pap.name', 'pap.id', 'pap.kodeexternal')
                    ->get();
                if (count($implementasi) > 0) {
                    $head[] = array(
                        'header' => 'Implementasi',
                        'id' => $itemhead->diagnosakep_id,
                        'nama' => $itemhead->namadiagnosakep,
                        'kodeexternal' => $itemhead->kodeexternal,
                        'detail' => $implementasi,
                    );
                }
            }
        }
        $ev = \DB::table('rekammedis_t as rm')
            ->select(
                'rm.norec',
                'rm.objectfk',
                'rm.nilai',
                'rm.satuan',
                'rm.jenisobject',
                'rm.noregistrasifk',
                'ev.name',
                'ev.id',
                'dp.kodeexternal',
                'dp.id as diagnosakep_id',
                'dp.namadiagnosakep'
            )
            ->leftjoin('diagnosakeperawatan_m as dp', DB::raw("dp.id "), '=', 'rm.nilai')
            ->leftjoin('evaluasi_m as ev', 'ev.kodeexternal', '=', 'rm.objectfk')
            ->where('rm.noregistrasifk', $request['noregistrasifk'])
            ->where('rm.riwayatpapfk', '=', $request['riwayatfk'])
            ->where(function ($query) use ($arrObject) {
                for ($i = 0; $i < count($arrObject); $i++) {
                    $query->orWhere('rm.objectfk', 'ilike', $arrObject[$i] . '%');
                }
            })
            ->orderBy('dp.id')
            ->get();

        foreach ($ev as $itemhead) {
            if ($itemhead->diagnosakep_id !== null) {
                $evaluasi = DB::table('evaluasi_m as pap')
                    ->select('pap.name', 'pap.id', 'pap.kodeexternal')
                    ->join('rekammedis_t as rm', DB::raw("pap.id"), '=', 'rm.nilai')
                    ->where('rm.objectfk', 'ilike', '%EVL%')
                    ->where('pap.objectdiagnosakeperawatanfk', $itemhead->diagnosakep_id)
                    ->where('pap.statusenabled', true)
                    ->where('rm.noregistrasifk', $request['noregistrasifk'])
                    ->where('rm.riwayatpapfk', $request['riwayatfk'])
                    ->groupBy('pap.name', 'pap.id', 'pap.kodeexternal')
                    ->get();
                if (count($evaluasi) > 0) {
                    $head[] = array(
                        'header' => 'Evaluasi',
                        'id' => $itemhead->diagnosakep_id,
                        'nama' => $itemhead->namadiagnosakep,
                        'kodeexternal' => $itemhead->kodeexternal,
                        'detail' => $evaluasi,
                    );
                }
            }
        }
        $int = \DB::table('rekammedis_t as rm')
            ->select(
                'rm.norec',
                'rm.objectfk',
                'rm.nilai',
                'rm.satuan',
                'rm.jenisobject',
                'rm.noregistrasifk',
                'ev.name',
                'ev.id',
                'dp.kodeexternal',
                'dp.id as diagnosakep_id',
                'dp.namadiagnosakep'
            )
            ->leftjoin('diagnosakeperawatan_m as dp', DB::raw("dp.id "), '=', 'rm.nilai')
            ->leftjoin('intervensi_m as ev', 'ev.kodeexternal', '=', 'rm.objectfk')
            ->where('rm.noregistrasifk', $request['noregistrasifk'])
            ->where('rm.riwayatpapfk', '=', $request['riwayatfk'])
            ->where(function ($query) use ($arrObject) {
                for ($i = 0; $i < count($arrObject); $i++) {
                    $query->orWhere('rm.objectfk', 'ilike', $arrObject[$i] . '%');
                }
            })
            ->orderBy('dp.id')
            ->get();

        foreach ($int as $itemhead) {
            if ($itemhead->diagnosakep_id !== null) {
                $intervensi = DB::table('intervensi_m as pap')
                    ->select('pap.name', 'pap.id', 'pap.kodeexternal')
                    ->join('rekammedis_t as rm', DB::raw("pap.id"), '=', 'rm.nilai')
                    ->where('rm.objectfk', 'ilike', '%INT%')
                    ->where('pap.objectdiagnosakeperawatanfk', $itemhead->diagnosakep_id)
                    ->where('pap.statusenabled', true)
                    ->where('rm.noregistrasifk', $request['noregistrasifk'])
                    ->where('rm.riwayatpapfk', '=', $request['riwayatfk'])
                    ->groupBy('pap.name', 'pap.id', 'pap.kodeexternal')
                    ->get();
                if (count($intervensi) > 0) {
                    $head[] = array(
                        'header' => 'Intervensi',
                        'id' => $itemhead->diagnosakep_id,
                        'nama' => $itemhead->namadiagnosakep,
                        'kodeexternal' => $itemhead->kodeexternal,
                        'detail' => $intervensi,
                    );
                }
            }
        }

        return $this->respond($head);
    }

    public function getHistoriDiagnosaKeperawatan(Request $request)
    {
        $data = \DB::table('diagnosakeperawatan_m as dp')
            ->leftjoin('rekammedis_t as rm', 'rm.objectfk', '=', 'dp.kodeexternal')
            ->select(
                'dp.id',
                'dp.namadiagnosakep as namaDiagnosaKep',
                'dp.kodeexternal',
                'rm.norec',
                'rm.objectfk',
                'rm.nilai',
                'rm.satuan',
                'rm.jenisobject',
                'rm.noregistrasifk'
            )
            ->where('dp.statusenabled', true)
            ->where('rm.noregistrasifk', $request['noregistrasifk'])
            ->orderBy('dp.namadiagnosakep')
            ->where('rm.objectfk', 'ilike', $request['objectfk'] . '%');
        if (isset($request['riwayatfk']) && $request['riwayatfk'] != '') {
            $data = $data->where('rm.riwayatpapfk', '=', $request['riwayatfk']);
        }
        $data = $data->get();
        $data10 = [];
        foreach ($data as $item) {
            $samateu = false;
            $i = 0;
            foreach ($data10 as $hideung) {
                if ($item->id == $data10[$i]['id']) {
                    $samateu = true;
                    if ($item->satuan == 'tgl-awal') {
                        $data10[$i]['tglAwal'] = $item->nilai;
                    }
                    if ($item->satuan == 'tgl-akhir') {
                        $data10[$i]['tglAkhir'] = $item->nilai;
                    }
                }
                $i = $i + 1;
            }
            if ($samateu == false) {
                $data10[] = array(
                    'id' => $item->id,
                    'namaDiagnosaKep' => $item->namaDiagnosaKep,
                    'kodeexternal' => $item->kodeexternal,
                    'tglAwal' => $item->nilai,
                    'tglAkhir' => $item->nilai,
                    'noregistrasifk' => $item->noregistrasifk,
                );
            }
        }
        $result = array(
            'data' => $data10,
            'message' => 'inhuman',
        );
        return $this->respond($result);
    }

    public function getRekamMedisDokter(Request $request)
    {
        $dataLogin = $request->all();
        $data = \DB::table('rekammedisdokter_t as rm')
            ->select(
                'rm.norec',
                'rm.keterangan',
                'rm.keterangantambahan',
                'rm.tglinput',
                'rm.jenisinput',
                'rm.noregistrasifk',
                'rm.pegawaifk',
                'pg.namalengkap',
                'rm.ruanganfk',
                'ru.namaruangan'
            )
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'rm.pegawaifk')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'rm.ruanganfk')
            ->where('rm.noregistrasifk', $request['noregistrasifk'])
            ->where('rm.statusenabled', true)
            ->where('rm.jenisinput', 'ilike', '%' . $request['jenisinput'] . '%');

        if (isset($request['riwayatfk']) && $request['riwayatfk'] != '') {
            $data = $data->where('rm.riwayatpapfk', '=', $request['riwayatfk']);
        }

        $data = $data->get();


        $result = array(
            'data' => $data,
            'message' => 'Inhuman',
        );

        return $this->respond($result);
    }

    public function saveRekamMedisDokter(Request $request)
    {
        DB::beginTransaction();
        try {

            if ($request['norec'] == '') {
                $RekamMedis = new RekamMedisDokter();
                $RekamMedis->norec = $RekamMedis->generateNewId();
                $RekamMedis->kdprofile = 0;
                $RekamMedis->statusenabled = true;
            } else {
                $RekamMedis = RekamMedisDokter::where('norec', $request['norec'])->first();
            }
            $RekamMedis->noregistrasifk = $request['noregistrasifk'];
            $RekamMedis->keterangan = $request['keterangan'];
            $RekamMedis->keterangantambahan = $request['keterangantambahan'];
            $RekamMedis->ruanganfk = $request['ruanganfk'];
            $RekamMedis->pegawaifk = $request['pegawaifk'];
            $RekamMedis->tglinput = date('Y-m-d H:i:s');
            $RekamMedis->jenisinput = $request['jenisinput'];
            $RekamMedis->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Data Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'Inhuman',
            );
        } else {
            $transMessage = "Simpan Data Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message' => $transMessage,
                'as' => 'Inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function hapusRekamMedisDokter(Request $request)
    {
        DB::beginTransaction();
        try {
            $RekamMedis = RekamMedisDokter::where('norec', $request['norec'])
                ->where('jenisinput', $request['jenisinput'])
                ->update([
                    'statusenabled' => false
                ]);

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Hapus Data Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'Inhuman',
            );
        } else {
            $transMessage = "Hapus Data Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message' => $transMessage,
                'as' => 'Inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function postAnamnesis(Request $request, $method)
    {
        DB::beginTransaction();
        try {
            $norec = '';
            if ($method == 'save') {
                if ($request['norec'] == '') {
                    $RekamMedis = new Anamnesis();
                    $RekamMedis->norec = $RekamMedis->generateNewId();
                    $RekamMedis->kdprofile = 0;
                    $RekamMedis->statusenabled = true;
                } else {
                    $RekamMedis = Anamnesis::where('norec', $request['norec'])->first();
                }
                $RekamMedis->noregistrasifk = $request['noregistrasifk'];
                //                $RekamMedis->tglregistrasi =  $request['tglregistrasi'];
                $RekamMedis->anamnesisdokter = $request['anamnesisdokter'];
                $RekamMedis->anamnesissuster = $request['anamnesissuster'];
                $RekamMedis->pegawaifk = $request['pegawaifk'];
                $RekamMedis->tglinput = date('Y-m-d H:i:s');
                $RekamMedis->ruanganfk = $request['ruanganfk'];
                $RekamMedis->save();
                $norec = $RekamMedis->norec;
            }
            if ($method == 'delete') {
                Anamnesis::where('norec', $request['norec'])->update(
                    ['statusenabled' => false]
                );
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'norec' => $norec,
                'message' => $transMessage,
                'as' => 'Inhuman',
            );
        } else {
            $transMessage = "Error";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message' => $transMessage,
                'as' => 'Inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getAnamnesis(Request $request)
    {
        $data = \DB::table('anamnesis_t as rm')
            ->select(
                'rm.norec',
                'rm.anamnesisdokter',
                'rm.anamnesissuster',
                'rm.tglinput',
                'rm.noregistrasifk',
                'rm.pegawaifk',
                'pg.namalengkap',
                'rm.ruanganfk',
                'ru.namaruangan',
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'ps.nocm',
                'ps.namapasien'
            )
            ->leftJoin('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'rm.noregistrasifk')
            ->leftJoin('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->leftJoin('pasien_m as ps', 'pd.nocmfk', '=', 'ps.id')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'rm.pegawaifk')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'rm.ruanganfk')
            ->where('rm.statusenabled', true);

        if (isset($request['noregistrasifk']) && $request['noregistrasifk'] != '') {
            $data = $data->where('rm.noregistrasifk', $request['noregistrasifk']);
        }
        if (isset($request['nocm']) && $request['nocm'] != '') {
            $data = $data->where('ps.nocm', $request['nocm']);
        }
        if (isset($request['norec_pd']) && $request['norec_pd'] != '') {
            $data = $data->where('pd.norec', $request['norec_pd']);
        }
        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'Inhuman',
        );
        return $this->respond($result);
    }

    public function postRiwayatPengobatan(Request $request, $method)
    {
        DB::beginTransaction();
        try {
            $norec = '';
            if ($method == 'save') {
                if ($request['norec'] == '') {
                    $RekamMedis = new RiwayatPengobatan();
                    $RekamMedis->norec = $RekamMedis->generateNewId();
                    $RekamMedis->kdprofile = 0;
                    $RekamMedis->statusenabled = true;
                } else {
                    $RekamMedis = RiwayatPengobatan::where('norec', $request['norec'])->first();
                }
                $RekamMedis->noregistrasifk = $request['noregistrasifk'];
                //                $RekamMedis->tglregistrasi =  $request['tglregistrasi'];
                $RekamMedis->riwayatpengobatan = $request['riwayatpengobatan'];
                $RekamMedis->riwayatpenyakit = $request['riwayatpenyakit'];
                $RekamMedis->pegawaifk = $request['pegawaifk'];
                $RekamMedis->tglinput = date('Y-m-d H:i:s');
                $RekamMedis->ruanganfk = $request['ruanganfk'];
                $RekamMedis->save();
                $norec = $RekamMedis->norec;
            }
            if ($method == 'delete') {
                RiwayatPengobatan::where('norec', $request['norec'])->update(
                    ['statusenabled' => false]
                );
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'norec' => $norec,
                'message' => $transMessage,
                'as' => 'Inhuman',
            );
        } else {
            $transMessage = "Error";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message' => $transMessage,
                'as' => 'Inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getRiwayatPengobatan(Request $request)
    {

        $data = \DB::table('riwayatpengobatan_t as rm')
            ->select(
                'rm.norec',
                'rm.riwayatpengobatan',
                'rm.riwayatpenyakit',
                'rm.tglinput',
                'rm.noregistrasifk',
                'rm.pegawaifk',
                'pg.namalengkap',
                'rm.ruanganfk',
                'ru.namaruangan',
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'ps.nocm',
                'ps.namapasien'
            )
            ->leftJoin('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'rm.noregistrasifk')
            ->leftJoin('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->leftJoin('pasien_m as ps', 'pd.nocmfk', '=', 'ps.id')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'rm.pegawaifk')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'rm.ruanganfk')
            ->where('rm.statusenabled', true);

        if (isset($request['noregistrasifk']) && $request['noregistrasifk'] != '') {
            $data = $data->where('rm.noregistrasifk', $request['noregistrasifk']);
        }
        if (isset($request['nocm']) && $request['nocm'] != '') {
            $data = $data->where('ps.nocm', $request['nocm']);
        }
        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'Inhuman',
        );
        return $this->respond($result);
    }

    public function postPemeriksaanUmum(Request $request, $method)
    {
        DB::beginTransaction();
        try {
            $norec = '';
            if ($method == 'save') {
                if ($request['norec'] == '') {
                    $RekamMedis = new PemeriksaanUmum();
                    $RekamMedis->norec = $RekamMedis->generateNewId();
                    $RekamMedis->kdprofile = 0;
                    $RekamMedis->statusenabled = true;
                } else {
                    $RekamMedis = PemeriksaanUmum::where('norec', $request['norec'])->first();
                }
                $RekamMedis->noregistrasifk = $request['noregistrasifk'];
                //                $RekamMedis->tglregistrasi =  $request['tglregistrasi'];
                $RekamMedis->pemeriksaanumum = $request['pemeriksaanumum'];
                //                $RekamMedis->riwayatpenyakit =  $request['riwayatpenyakit'];
                $RekamMedis->objectpetugas = $request['pegawaifk'];
                $RekamMedis->tanggalinput = date('Y-m-d H:i:s');
                $RekamMedis->objectruanganfk = $request['ruanganfk'];
                $RekamMedis->save();
                $norec = $RekamMedis->norec;
            }
            if ($method == 'delete') {
                PemeriksaanUmum::where('norec', $request['norec'])->update(
                    ['statusenabled' => false]
                );
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'norec' => $norec,
                'message' => $transMessage,
                'as' => 'Inhuman',
            );
        } else {
            $transMessage = "Error";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message' => $transMessage,
                'as' => 'Inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getPemeriksaanUmum(Request $request)
    {
        $data = \DB::table('pemeriksaanumum_t as rm')
            ->select(
                'rm.norec',
                'rm.pemeriksaanumum',
                'rm.tanggalinput as tglinput',
                'rm.noregistrasifk',
                'rm.objectpetugas as pegawaifk',
                'pg.namalengkap',
                'rm.objectruanganfk as ruanganfk',
                'ru.namaruangan',
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'ps.nocm',
                'ps.namapasien'
            )
            ->leftJoin('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'rm.noregistrasifk')
            ->leftJoin('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->leftJoin('pasien_m as ps', 'pd.nocmfk', '=', 'ps.id')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'rm.objectpetugas')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'rm.objectruanganfk')
            ->where('rm.statusenabled', true);

        if (isset($request['noregistrasifk']) && $request['noregistrasifk'] != '') {
            $data = $data->where('rm.noregistrasifk', $request['noregistrasifk']);
        }
        if (isset($request['nocm']) && $request['nocm'] != '') {
            $data = $data->where('ps.nocm', $request['nocm']);
        }
        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'Inhuman',
        );
        return $this->respond($result);
    }

    public function postEdukasi(Request $request, $method)
    {
        DB::beginTransaction();
        try {
            $norec = '';
            if ($method == 'save') {
                if ($request['norec'] == '') {
                    $RekamMedis = new Edukasi();
                    $RekamMedis->norec = $RekamMedis->generateNewId();
                    $RekamMedis->kdprofile = 0;
                    $RekamMedis->statusenabled = true;
                } else {
                    $RekamMedis = Edukasi::where('norec', $request['norec'])->first();
                }
                $RekamMedis->noregistrasifk = $request['noregistrasifk'];
                //                $RekamMedis->tglregistrasi =  $request['tglregistrasi'];
                $RekamMedis->edukasi = $request['edukasi'];
                //                $RekamMedis->riwayatpenyakit =  $request['riwayatpenyakit'];
                $RekamMedis->objectpetugas = $request['pegawaifk'];
                $RekamMedis->tanggalinput = date('Y-m-d H:i:s');
                $RekamMedis->objectruanganfk = $request['ruanganfk'];
                $RekamMedis->save();
                $norec = $RekamMedis->norec;
            }
            if ($method == 'delete') {
                Edukasi::where('norec', $request['norec'])->update(
                    ['statusenabled' => false]
                );
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'norec' => $norec,
                'message' => $transMessage,
                'as' => 'Inhuman',
            );
        } else {
            $transMessage = "Error";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message' => $transMessage,
                'as' => 'Inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getEdukasi(Request $request)
    {
        $data = \DB::table('edukasi_t as rm')
            ->select(
                'rm.norec',
                'rm.edukasi',
                'rm.tanggalinput as tglinput',
                'rm.noregistrasifk',
                'rm.objectpetugas as pegawaifk',
                'pg.namalengkap',
                'rm.objectruanganfk as ruanganfk',
                'ru.namaruangan',
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'ps.nocm',
                'ps.namapasien'
            )
            ->leftJoin('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'rm.noregistrasifk')
            ->leftJoin('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->leftJoin('pasien_m as ps', 'pd.nocmfk', '=', 'ps.id')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'rm.objectpetugas')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'rm.objectruanganfk')
            ->where('rm.statusenabled', true);

        if (isset($request['noregistrasifk']) && $request['noregistrasifk'] != '') {
            $data = $data->where('rm.noregistrasifk', $request['noregistrasifk']);
        }
        if (isset($request['nocm']) && $request['nocm'] != '') {
            $data = $data->where('ps.nocm', $request['nocm']);
        }
        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'Inhuman',
        );
        return $this->respond($result);
    }

    public function postRencana(Request $request, $method)
    {
        DB::beginTransaction();
        try {
            $norec = '';
            if ($method == 'save') {
                if ($request['norec'] == '') {
                    $RekamMedis = new Rencana();
                    $RekamMedis->norec = $RekamMedis->generateNewId();
                    $RekamMedis->kdprofile = 0;
                    $RekamMedis->statusenabled = true;
                } else {
                    $RekamMedis = Rencana::where('norec', $request['norec'])->first();
                }
                $RekamMedis->noregistrasifk = $request['noregistrasifk'];
                //                $RekamMedis->tglregistrasi =  $request['tglregistrasi'];
                $RekamMedis->rencana = $request['rencana'];
                //                $RekamMedis->riwayatpenyakit =  $request['riwayatpenyakit'];
                $RekamMedis->objectpetugas = $request['pegawaifk'];
                $RekamMedis->tanggalinput = date('Y-m-d H:i:s');
                $RekamMedis->objectruanganfk = $request['ruanganfk'];
                $RekamMedis->save();
                $norec = $RekamMedis->norec;
            }
            if ($method == 'delete') {
                Rencana::where('norec', $request['norec'])->update(
                    ['statusenabled' => false]
                );
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'norec' => $norec,
                'message' => $transMessage,
                'as' => 'Inhuman',
            );
        } else {
            $transMessage = "Error";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message' => $transMessage,
                'as' => 'Inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getRencana(Request $request)
    {
        $data = \DB::table('rencana_t as rm')
            ->select(
                'rm.norec',
                'rm.rencana',
                'rm.tanggalinput as tglinput',
                'rm.noregistrasifk',
                'rm.objectpetugas as pegawaifk',
                'pg.namalengkap',
                'rm.objectruanganfk as ruanganfk',
                'ru.namaruangan',
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'ps.nocm',
                'ps.namapasien'
            )
            ->leftJoin('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'rm.noregistrasifk')
            ->leftJoin('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->leftJoin('pasien_m as ps', 'pd.nocmfk', '=', 'ps.id')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'rm.objectpetugas')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'rm.objectruanganfk')
            ->where('rm.statusenabled', true);

        if (isset($request['noregistrasifk']) && $request['noregistrasifk'] != '') {
            $data = $data->where('rm.noregistrasifk', $request['noregistrasifk']);
        }
        if (isset($request['nocm']) && $request['nocm'] != '') {
            $data = $data->where('ps.nocm', $request['nocm']);
        }
        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'Inhuman',
        );
        return $this->respond($result);
    }

    public function postPerjanjianPasien(Request $request, $method)
    {
        DB::beginTransaction();
        try {
            $norec = '';
            if ($method == 'save') {
                if ($request['norec'] == '') {
                    $RekamMedis = new PasienPerjanjian();
                    $RekamMedis->norec = $RekamMedis->generateNewId();
                    $RekamMedis->kdprofile = 1;
                    $RekamMedis->statusenabled = true;
                    $noJanji = $this->generateCode(new PasienPerjanjian, 'noperjanjian', 12, 'P' . $this->getDateTime()->format('ymd'));
                } else {
                    $RekamMedis = PasienPerjanjian::where('norec', $request['norec'])->first();
                    $noJanji = $RekamMedis->noperjanjian;
                }
                $idPasien = Pasien::where('nocm', $request['nocm'])->first();
                $RekamMedis->objectpasienfk = $idPasien->id;
                $RekamMedis->objectdokterfk = $request['objectdokterfk'];
                $RekamMedis->jumlahkujungan = $request['jumlahkujungan'];
                $RekamMedis->keterangan = $request['keterangan'];
                $RekamMedis->tglperjanjian = $request['tglperjanjian'];
                $RekamMedis->tglinput = date('Y-m-d H:i:s');
                $RekamMedis->objectruanganfk = $request['objectruanganfk'];
                $RekamMedis->noperjanjian = $noJanji;
                $RekamMedis->save();
                $norec = $RekamMedis->norec;


                $APR = new AntrianPasienRegistrasi();
                $APR->norec = $APR->generateNewId();
                $APR->kdprofile = 1;
                $APR->statusenabled = true;
                $APR->noreservasi = substr(Uuid::generate(), 0, 7);
                $APR->nocmfk = $idPasien->id;
                $APR->objectpegawaifk = $request['objectdokterfk'];
                if ($idPasien->objectpendidikanfk != null) {
                    $APR->objectpendidikanfk = $idPasien->objectpendidikanfk;
                } else {
                    $APR->objectpendidikanfk = 0;
                }

                $APR->objectjeniskelaminfk = $idPasien->objectjeniskelaminfk;
                $APR->objectruanganfk = $request['objectruanganfk'];
                $APR->tanggalreservasi = $request['tglperjanjian'];
                $APR->tipepasien = 'LAMA';
                $APR->type = '';
                $APR->save();
            }
            if ($method == 'delete') {
                PasienPerjanjian::where('norec', $request['norec'])->update(
                    ['statusenabled' => false]
                );
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'norec' => $norec,
                'message' => $transMessage,
                'as' => 'Inhuman',
            );
        } else {
            $transMessage = "Error";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message' => $transMessage,
                'as' => 'Inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getPasienPerjanjian(Request $request)
    {
        $data = \DB::table('pasienperjanjian_t as rm')
            ->select(
                'rm.norec',
                'rm.objectdokterfk',
                'pg.namalengkap',
                'rm.jumlahkujungan',
                'rm.keterangan',
                'rm.objectpasienfk',
                'rm.tglinput',
                'rm.tglperjanjian',
                'rm.noperjanjian',
                'rm.objectruanganfk',
                'ru.namaruangan',
                //                'pd.noregistrasi','pd.tglregistrasi',
                'ps.nocm',
                'ps.namapasien'
            )
            ->leftJoin('pasien_m as ps', 'rm.objectpasienfk', '=', 'ps.id')
            //            ->leftJoin('pasiendaftar_t as pd','pd.nocmfk','=','ps.id')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'rm.objectdokterfk')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'rm.objectruanganfk')
            ->where('rm.statusenabled', true)
            ->orderBy('rm.noperjanjian');

        if (isset($request['noregistrasifk']) && $request['noregistrasifk'] != '') {
            $data = $data->where('rm.noregistrasifk', $request['noregistrasifk']);
        }
        if (isset($request['nocm']) && $request['nocm'] != '') {
            $data = $data->where('ps.nocm', $request['nocm']);
        }
        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'Inhuman',
        );
        return $this->respond($result);
    }

    public function postCPPT(Request $request, $method)
    {
        DB::beginTransaction();
        try {
            $norec = '';
            if ($method == 'save') {
                if ($request['norec'] == '') {
                    $RekamMedis = new CPPT();
                    $RekamMedis->norec = $RekamMedis->generateNewId();
                    $RekamMedis->kdprofile = 0;
                    $RekamMedis->statusenabled = true;
                    $noCPPT = date('dmYHisu'); // $this->generateCode(new CPPT, 'noperjanjian', 12, 'CPPT' . $this->getDateTime()->format('ymd') );

                } else {
                    $RekamMedis = CPPT::where('norec', $request['norec'])->first();
                    //                    $noCPPT = $RekamMedis->nocppt;
                    //                    CPPTDetail::where('objectcpptfk', $request['norec'])->detele();
                }
                $idJenisPeg = Pegawai::where('id', $request['pegawaifk'])->first();
                if ($idJenisPeg->objectjenispegawaifk == 1) { //dokter
                    $RekamMedis->isverifikasi = true;
                } else {
                    $RekamMedis->isverifikasi = false;
                }
                $idPasien = Pasien::where('nocm', $request['pasienfk'])->first();
                $RekamMedis->pasienfk = $idPasien->id;
                $RekamMedis->pegawaifk = $request['pegawaifk'];
                if ($request['pegawaiasalfk'] != $request['pegawaifk']) {
                    $RekamMedis->pegawaiasalfk = $request['pegawaiasalfk'];
                }
                $RekamMedis->noregistrasifk = $request['noregistrasifk'];
                $RekamMedis->ruanganfk = $request['ruanganfk'];
                $RekamMedis->tglinput = date('Y-m-d H:i:s');
                $RekamMedis->s = $request['s'];
                $RekamMedis->o = $request['o'];
                $RekamMedis->a = $request['a'];
                $RekamMedis->p = $request['p'];
                //                $RekamMedis->nocppt = $noCPPT;
                $RekamMedis->save();
                $norec = $RekamMedis->norec;
                //
                //                $detail = new CPPTDetail();
                //                $detail->norec = $detail->generateNewId();
                //                $detail->kdprofile = 0;
                //                $detail->statusenabled = true;
                //                $detail->objectcpptfk = $RekamMedis->norec ;
                //                $detail->s = $request['details']['s'];
                //                $detail->o = $request['details']['o'];
                //                $detail->a = $request['details']['a'];
                //                $detail->p = $request['details']['p'];
                //                $detail->tglinput = date('Y-m-d H:i:s');

            }
            if ($method == 'delete') {
                CPPT::where('norec', $request['norec'])->update(
                    ['statusenabled' => false]
                );
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'norec' => $norec,
                'message' => $transMessage,
                'as' => 'Inhuman',
            );
        } else {
            $transMessage = "Error";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message' => $transMessage,
                'as' => 'Inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getCPPT(Request $request)
    {
        $data = \DB::table('cppt_t as cp')
            ->select(
                'cp.norec',
                'cp.pegawaifk',
                'cp.tglinput',
                'cp.noregistrasifk',
                'cp.isverifikasi',
                'cp.pegawaifk',
                'pg.namalengkap',
                'ru.namaruangan',
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'ps.nocm',
                'ps.namapasien',
                'cp.s',
                'cp.o',
                'cp.a',
                'cp.p',
                'cp.nocppt',
                'pg2.namalengkap as pegawaiasal',
                'pg2.id as pegawaiasalfk'
            )
            ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'cp.noregistrasifk')
            ->leftJoin('pasien_m as ps', 'cp.pasienfk', '=', 'ps.id')
            ->leftJoin('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'cp.pegawaifk')
            ->leftJoin('pegawai_m as pg2', 'pg2.id', '=', 'cp.pegawaiasalfk')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'cp.ruanganfk')
            ->where('cp.statusenabled', true);

        if (isset($request['noregistrasifk']) && $request['noregistrasifk'] != '') {
            $data = $data->where('rm.noregistrasifk', $request['noregistrasifk']);
        }
        if (isset($request['nocm']) && $request['nocm'] != '') {
            $data = $data->where('ps.nocm', $request['nocm']);
        }
        $data = $data->orderBy('cp.tglinput', 'desc');
        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'Inhuman',
        );
        return $this->respond($result);
    }

    public function getAntrianPasienDiperiksa($norecAPD)
    {
        $data = \DB::table('antrianpasiendiperiksa_t as apd')
            ->leftjoin('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->leftJoin('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftJoin('kelompokpasien_m as kps', 'kps.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            ->leftJoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->leftJoin('alamat_m as alm', 'alm.nocmfk', '=', 'ps.id')
            ->leftJoin('pendidikan_m as pdd', 'pdd.id', '=', 'ps.objectpendidikanfk')
            ->leftjoin('pekerjaan_m as pk', 'pk.id', '=', 'ps.objectpekerjaanfk')
            ->leftjoin('golongandarah_m as gd', 'gd.id', '=', 'ps.objectgolongandarahfk')
            ->leftjoin('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
            ->leftjoin('kelas_m as kls', 'kls.id', '=', 'apd.objectkelasfk')
            ->leftJoin('pegawai_m as pg1', 'pg1.id', '=', 'pd.objectpegawaifk')
            ->select(
                'apd.norec',
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'ps.nocm',
                'ps.namapasien',
                'ps.tgllahir',
                'ru.objectdepartemenfk',
                'alm.alamatlengkap',
                'kps.kelompokpasien',
                'ru.namaruangan',
                'pg.namalengkap',
                'jk.jeniskelamin',
                'pd.norec as norec_pd',
                'pdd.pendidikan',
                'pk.pekerjaan',
                'pd.tglpulang',
                'rk.namarekanan',
                'kls.namakelas',
                'pd.nocmfk',
                'pd.objectkelompokpasienlastfk',
                'apd.objectruanganfk',
                'apd.objectpegawaifk',
                'ps.objectjeniskelaminfk',
                'apd.objectkelasfk',
                'ps.objectgolongandarahfk',
                'gd.golongandarah',
                'ps.foto',
                'pg1.namalengkap as dokterdpjp',
                'pg1.id as iddpjp'
            )
            ->where('apd.norec', $norecAPD);

        $data = $data->first();
        if ($data->foto != null) {
            $data->foto = "data:image/jpeg;base64," . base64_encode($data->foto);
        }
        $result = array(
            'result' => $data,
            'message' => 'Inhuman',
        );
        return $this->respond($result);
    }

    public function getAntrianPasienDiperiksaGrid($norecAPD)
    {
        $data = \DB::table('antrianpasiendiperiksa_t as apd')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->join('pasiendaftar_t as pd1', 'ps.id', '=', 'pd1.nocmfk')
            ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd1.norec')
            ->leftjoin('asuransipasien_m as asu', 'asu.id', '=', 'pa.objectasuransipasienfk')
            ->leftjoin('kelas_m as kl', 'kl.id', '=', 'asu.objectkelasdijaminfk')
            ->join('kelas_m as kls', 'kls.id', '=', 'pd1.objectkelasfk')
            ->select(
                'pd1.noregistrasi', 'kls.namakelas as kelasPasien', 'kl.namakelas as kelasPenjamin'
            )
            ->where('apd.norec', $norecAPD)
            ->where('apd.statusenabled', true)
            ->where('pd.statusenabled', true)
            ->orderBy('pd1.tglregistrasi', 'asc')
            ->get();

        $datass = [];
        foreach ($data as $item) {

            $detail = [];
            $datas = \DB::table('pasiendaftar_t as pd')
                ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                ->leftjoin('kamar_m as km', 'km.id', '=', 'apd.objectkamarfk')
                ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                ->leftJoin('kelompokpasien_m as kps', 'kps.id', '=', 'pd.objectkelompokpasienlastfk')
                ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
                ->join('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
                ->join('alamat_m as alm', 'alm.nocmfk', '=', 'ps.id')
                ->leftJoin('pendidikan_m as pdd', 'pdd.id', '=', 'ps.objectpendidikanfk')
                ->leftjoin('pekerjaan_m as pk', 'pk.id', '=', 'ps.objectpekerjaanfk')
                ->leftjoin('golongandarah_m as gd', 'gd.id', '=', 'ps.objectgolongandarahfk')
                ->leftjoin('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
                ->join('kelas_m as kls', 'kls.id', '=', 'apd.objectkelasfk')
                ->leftJoin('pegawai_m as pg1', 'pg1.id', '=', 'pd.objectpegawaifk')
                ->select(
                    'apd.norec',
                    'pd.noregistrasi',
                    'pd.tglregistrasi',
                    'ps.nocm',
                    'ps.namapasien',
                    'ps.tgllahir',
                    'km.namakamar',
                    'ru.objectdepartemenfk',
                    'alm.alamatlengkap',
                    'kps.kelompokpasien',
                    'ru.namaruangan',
                    'pg.namalengkap',
                    'jk.jeniskelamin',
                    'pd.norec as norec_pd',
                    'pdd.pendidikan',
                    'pk.pekerjaan',
                    'pd.tglpulang',
                    'rk.namarekanan',
                    'kls.namakelas',
                    'pd.nocmfk',
                    'pd.objectkelompokpasienlastfk',
                    'apd.objectruanganfk',
                    'apd.objectpegawaifk',
                    'ps.objectjeniskelaminfk',
                    'apd.objectkelasfk',
                    'ps.objectgolongandarahfk',
                    'gd.golongandarah',
                    'ps.foto',
                    'pg1.namalengkap as dokterdpjp',
                    'pg1.id as iddpjp'
                )
                ->where('pd.noregistrasi', $item->noregistrasi)
                ->whereIn('ru.objectdepartemenfk', [16, 18, 24])
                ->where('apd.statusenabled', true)
                ->where('pd.statusenabled', true)
                ->orderBy('apd.tglmasuk', 'DESC')
                ->take(1)
                ->get(1);

            $dataresumemedis = \DB::table('pasiendaftar_t as pd')
                ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                ->JOIN('resumemedis_t as rm', 'rm.noregistrasifk', '=', 'apd.norec')
                ->select('rm.norec')
                ->where('pd.noregistrasi', $item->noregistrasi)
                ->where('apd.statusenabled', true)
                ->where('pd.statusenabled', true)
                ->get();
            if (count($dataresumemedis) > 0) {
                $resummedis = 'Sudah diisi';
                $detail[] = array(
                    'path' => "RekamMedis.ResumeRI",
                    'name' => "Resume Medis"
                );
            } else {
                $resummedis = 'Belum diisi';
            }

            $lab = 'Belum diisi';
            $rad = 'Belum diisi';
            $pelayananpasien = \DB::table('pasiendaftar_t as pd')
                ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                ->JOIN('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
                ->select('apd.objectruanganfk')
                ->where('pd.noregistrasi', $item->noregistrasi)
                ->where('apd.statusenabled', true)
                ->where('pd.statusenabled', true)
                ->whereIn('apd.objectruanganfk', [575, 576])
                ->distinct()
                ->get();
            if (count($pelayananpasien) > 0) {
                foreach ($pelayananpasien as $ppitem) {
                    if ($ppitem->objectruanganfk == 575) {
                        $lab = 'Sudah diisi';
                        $detail[] = array(
                            'path' => "RekamMedis.TransaksiPelayananLaboratoriumDokterRev",
                            'name' => "Laboratorium"
                        );
                    } else if ($ppitem->objectruanganfk == 576) {
                        $rad = 'Sudah diisi';
                        $detail[] = array(
                            'path' => "RekamMedis.TransaksiPelayananRadiologiDokterRev",
                            'name' => "Radiologi"
                        );
                    }
                }
            }
            $rencanaaskep = 'Belum diisi';
            $datarencanaaskep = \DB::table('rencanaaskep_t as te')
                ->join('emrpasien_t as et', 'et.noemr', '=', 'te.emrpasienfk')
                ->orderBy('te.emrpasienfk', 'desc')
                
                ->select('te.*');

            $datarencanaaskep = $datarencanaaskep->where('et.noregistrasifk', '=', $item->noregistrasi);
  
            $datarencanaaskep = $datarencanaaskep->get();

            foreach ($datarencanaaskep as $itemaskep) {
                $rencanaaskep = 'Sudah diisi';
                $detail[] = array(
                    'path' => "RekamMedis.RencanaAskep",
                    'name' => "Rencana Askep"
                );
                break;
             }

            $diagnosa = 'Belum diisi';
            $datadiagnosa = DB::select(
            DB::raw("select DISTINCT 
                    detaildiagnosapasien_t.tglregistrasi
                FROM            ruangan_m INNER JOIN
                    antrianpasiendiperiksa_t ON ruangan_m.id = antrianpasiendiperiksa_t.objectruanganfk RIGHT OUTER JOIN
                    detaildiagnosapasien_t ON antrianpasiendiperiksa_t.norec = detaildiagnosapasien_t.noregistrasifk LEFT OUTER JOIN
                    pasiendaftar_t ON antrianpasiendiperiksa_t.noregistrasifk = pasiendaftar_t.norec LEFT OUTER JOIN
                    diagnosa_m ON detaildiagnosapasien_t.objectdiagnosafk = diagnosa_m.id LEFT OUTER JOIN
                    jenisdiagnosa_m ON detaildiagnosapasien_t.objectjenisdiagnosafk = jenisdiagnosa_m.id where pasiendaftar_t.noregistrasi =  '$item->noregistrasi' limit 1")
            );

         

            foreach ($datadiagnosa as $itemaskep) {
                $rencanaaskep = 'Sudah diisi';
                $detail[] = array(
                    'path' => "RekamMedis.TransaksiDiagnosa",
                    'name' => "Diagnosa"
                );
                break;
            }

            $datarekammedis = \DB::table('emrpasien_t as emrp')
                // ->leftJoin('emrpasien_t as emrp', 'emrp.noregistrasifk', '=', 'pd.noregistrasi')
                // ->leftJoin('emrpasien_t as emrp', function ($join) {
                //     $join->on('emrp.noregistrasifk','=','pd.noregistrasi');
                //     $join->on('emrp.jenisemr','=','umum');
                // })
                // ->join ('kamar_m as kmr',function ($join){
                //     $join->on('kmr.objectkelasfk','=','kl.id');
                //     $join->on('kmr.objectruanganfk','=','ru.id');
                // })
                ->select(
                    'emrp.emrfk',
                    'emrp.jenisemr'
                    // , DB::raw(
                    //     // 'SUM(emrp.norec) as nonpsikiatri'
                    //     "case when emrp.noregistrasifk is null and emrp.jenisemr='umum' then 'Lihat' else 'Tambah' end as nonpsikiatri,
                    //     case when emrp.noregistrasifk is null and emrp.jenisemr='emrigd' then 'Lihat' else 'Tambah' end as emrigd,
                    //     case when emrp.noregistrasifk is null and emrp.jenisemr='suratpersetujuan' then 'Lihat' else 'Tambah' end as suratpersetujuan,
                    //     case when emrp.noregistrasifk is null and emrp.jenisemr='asesmen' then 'Lihat' else 'Tambah' end as testicu,
                    //     case when emrp.noregistrasifk is null and emrp.jenisemr='intra' then 'Lihat' else 'Tambah' end as asd
                    //     "
                    // )
                )
                ->where('emrp.noregistrasifk', $item->noregistrasi)
                // ->whereRaw("emrp.noregistrasifk = '$item->noregistrasi'")
                ->distinct()
                // ->where('emrp.jenisemr','=','umum')
                ->get();

                        

            $nonpsikiatri = 'Belum diisi';
            $emrigd = 'Belum diisi';
            $suratpersetujuan = 'Belum diisi';
            $testicu = 'Belum diisi';
            $laporananestesi = 'Belum diisi';
            $evaluasiawal = 'Belum diisi';
            $laporanoperasi = 'Belum diisi';
            $catatankeperawatan = 'Belum diisi';
            $catatandokter = 'Belum diisi';
            // return($dataresumemedis);
            // die();
            foreach ($datarekammedis as $itemrekammedis) {
                if ($itemrekammedis->jenisemr == 'umum') {
                    $nonpsikiatri = 'Sudah diisi';
                    // $detail[] = array(
                    //     'path' =>"RekamMedis.ResumeRI",
                    //     'name' => "Resume Medis"
                    // );
                } else
                if ($itemrekammedis->emrfk == '515') {
                    $emrigd = 'Sudah diisi';
                    $detail[] = array(
                        'path' => "RekamMedis.EmrIgd",
                        'name' => "EMR IGD"
                    );
                } else
                if ($itemrekammedis->emrfk == '522') {
                    $suratpersetujuan = 'Sudah diisi';
                    $detail[] = array(
                        'path' => "RekamMedis.SuratPersetujuan",
                        'name' => "Surat Persetujuan"
                    );
                } else
                if ($itemrekammedis->emrfk == '188') {
                    $testicu = 'Sudah diisi';
                    $detail[] = array(
                        'path' => "RekamMedis.CatatanGrafikTandaVital",
                        'name' => "ICU"
                    );
                } else
                if ($itemrekammedis->jenisemr == 'intra' || $itemrekammedis->jenisemr == 'pasca') {
                    $laporananestesi = 'Sudah diisi';
                    $detail[] = array(
                        'path' => "RekamMedis.LaporanAnestesi",
                        'name' => "Laporan Anestesi"
                    );
                } else
                if ($itemrekammedis->jenisemr == 'emrigdevaluasi') {
                    $evaluasiawal = 'Sudah diisi';
                    $detail[] = array(
                        'path' => "RekamMedis.EmrIgdEvaluasi",
                        'name' => "Evaluasi Awal IGD"
                    );
                } else

                if ($itemrekammedis->jenisemr == 'emrranapevaluasi') {
                    $evaluasiawal = 'Sudah diisi';
                    $detail[] = array(
                        'path' => "RekamMedis.EmrRanapEvaluasi",
                        'name' => "Evaluasi Awal Ranap"
                    );
                } else
                if ($itemrekammedis->emrfk == '516') {
                    $laporanoperasi = 'Sudah diisi';
                    $detail[] = array(
                        'path' => "RekamMedis.LaporanOperasi",
                        'name' => "Laporan Operasi"
                    );
                }
                if ($itemrekammedis->jenisemr == 'catatankeperawatan') {
                    $catatankeperawatan = 'Sudah diisi';
                    $detail[] = array(
                        'path' => "RekamMedis.CatatanKeperawatan",
                        'name' => "Catatan Keperawatan"
                    );
                } else
                if ($itemrekammedis->jenisemr == 'catatandokter') {
                    $catatandokter = 'Sudah diisi';
                    $detail[] = array(
                        'path' => "RekamMedis.CatatanDokter",
                        'name' => "Catatan Dokter"
                    );
                }
            }
            


            foreach ($datas as $items) {
                $detail[] = array(
                    'path' => "RekamMedis.InputResepApotikOrderRev",
                    'name' => "Resep Elektronik"
                );
                // $detail[] = array(
                //     'path' => "RekamMedis.EmrRanapEvaluasi",
                //     'name' => "Evealuasi Awal Ranap"
                // );
                $datass[] = array(
                    'nonpsikiatri' => $nonpsikiatri,
                    'emrigd' => $emrigd,
                    'suratpersetujuan' => $suratpersetujuan,
                    'testicu' => $testicu,
                    'laporananestesi' => $laporananestesi,
                    'evaluasiawal' => $evaluasiawal,
                    'laporanoperasi' => $laporanoperasi,
                    'catatankeperawatan' => $catatankeperawatan,
                    'catatandokter' => $catatandokter,
                    'resumemedis' => $resummedis,
                    'radiologi' => $rad,
                    'laboratorium' => $lab,
                    'resepobat' => 'Sudah diisi',
                    'details' => $detail,


                    'kelaspasien' => $item->kelasPasien,
                    'kelaspenjamin' => $item->kelasPenjamin,
                    'norec' => $items->norec,
                    'noregistrasi' => $items->noregistrasi,
                    'tglregistrasi' => $items->tglregistrasi,
                    'nocm' => $items->nocm,
                    'namapasien' => $items->namapasien,
                    'tgllahir' => $items->tgllahir,
                    'namakamar' => $items->namakamar,
                    'objectdepartemenfk' => $items->objectdepartemenfk,
                    'alamatlengkap' => $items->alamatlengkap,
                    'kelompokpasien' => $items->kelompokpasien,
                    'namaruangan' => $items->namaruangan,
                    'namalengkap' => $items->namalengkap,
                    'jeniskelamin' => $items->jeniskelamin,
                    'norec_pd' => $items->norec_pd,
                    'pendidikan' => $items->pendidikan,
                    'pekerjaan' => $items->pekerjaan,
                    'tglpulang' => $items->tglpulang,
                    'namarekanan' => $items->namarekanan,
                    'namakelas' => $items->namakelas,
                    'nocmfk' => $items->nocmfk,
                    'objectkelompokpasienlastfk' => $items->objectkelompokpasienlastfk,
                    'objectruanganfk' => $items->objectruanganfk,
                    'objectpegawaifk' => $items->objectpegawaifk,
                    'objectjeniskelaminfk' => $items->objectjeniskelaminfk,
                    'objectkelasfk' => $items->objectkelasfk,
                    'objectgolongandarahfk' => $items->objectgolongandarahfk,
                    'golongandarah' => $items->golongandarah,
                    'foto' => $items->foto,
                    'dokterdpjp' => $items->dokterdpjp,
                    'iddpjp' => $items->iddpjp
                );
            }
        }

        $result = array(
            'result' => $datass,
            'message' => 'Inhuman',
        );
        return $this->respond($datass);
    }

    public function savePengkajianPasien(Request $request)
    {
        DB::beginTransaction();
        try {
            if ($request['norec'] == '') {
                $RekamMedis = new PengkajianAwalBaru();
                $RekamMedis->norec = $RekamMedis->generateNewId();
                $RekamMedis->kdprofile = 0;
                $RekamMedis->statusenabled = true;
                $ruang = Ruangan::where('id', $request['objectruanganfk'])->first();
                $prefix = 'RJ';
                if ($ruang->objectdepartemenfk == 16) {
                    $prefix = 'RI';
                } else {
                    $prefix = 'RJ';
                }
                $kdPap = $this->generateCode(new PengkajianAwalBaru, 'kdpap', 10, $prefix, $this->getDateTime()->format('ymd'));
            } else {
                $RekamMedis = PengkajianAwalBaru::where('norec', $request['norec'])->first();
                $kdPap = $RekamMedis->kdpap;
            }
            $idPasien = Pasien::where('nocm', $request['nocm'])->first();
            $RekamMedis->objectpasienfk = $idPasien->id;
            $RekamMedis->objectnoregistrasifk = $request['noregistrasifk'];
            $RekamMedis->objectruanganfk = $request['objectruanganfk'];
            $RekamMedis->tglregistrasi = date('Y-m-d H:i:s');
            $RekamMedis->pegawaifk = $request['pegawaifk'];
            $RekamMedis->kdpap = $kdPap;
            $RekamMedis->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'pap' => $RekamMedis,
                'message' => $transMessage,
                'as' => 'Inhuman',
            );
        } else {
            $transMessage = "Error";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message' => $transMessage,
                'as' => 'Inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getPengkajianPasien(Request $request)
    {
        $data = \DB::table('pengkajianawalbaru_t as cp')
            ->select(
                'cp.norec',
                'cp.tglregistrasi as tglinput',
                'cp.objectnoregistrasifk',
                'ru.namaruangan',
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'ps.nocm',
                'cp.objectpasienfk',
                'ps.namapasien',
                'cp.kdpap',
                'pg.namalengkap',
                'cp.pegawaifk'
            )
            ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'cp.objectnoregistrasifk')
            ->leftJoin('pasien_m as ps', 'cp.objectpasienfk', '=', 'ps.id')
            ->leftJoin('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'cp.objectruanganfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'cp.pegawaifk')
            ->where('cp.statusenabled', true);

        if (isset($request['nocm']) && $request['nocm'] != '') {
            $data = $data->where('ps.nocm', $request['nocm']);
        }
        if (isset($request['noregistrasi']) && $request['noregistrasi'] != '') {
            $data = $data->where('pd.noregistrasi', $request['noregistrasi']);
        }

        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'Inhuman',
        );
        return $this->respond($result);
    }

    public function hapusPengkajianPasien(Request $request)
    {
        DB::beginTransaction();
        try {

            if ($request['norec'] != '') {
                $transStatus = 'true';
                $cekRekam = RekamMedis::where('riwayatpapfk', $request['norec'])->get();
                if (count($cekRekam) > 0) {
                    $transStatus = 'false';
                } else {
                    PengkajianAwalBaru::where('norec', $request['norec'])->update(
                        ['statusenabled' => false]
                    );
                }
            }
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'Inhuman',
            );
        } else {
            $transMessage = "Tidak bisa di hapus, Sudah ada riwayat Pengkajian";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message' => $transMessage,
                'as' => 'Inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function postMasterDiagnosaKeperawatan(Request $request, $method)
    {
        DB::beginTransaction();
        try {
            if ($method == 'save') {
                if ($request['id'] == '') {
                    $RekamMedis = new DiagnosaKeperawatan();
                    $RekamMedis->id = DiagnosaKeperawatan::max('id') + 1;
                    $RekamMedis->norec = $RekamMedis->generateNewId();
                    $RekamMedis->kdprofile = 11;
                    $RekamMedis->statusenabled = true;
                    $kode = DiagnosaKeperawatan::max('kodeexternal');
                    $sub = substr($kode, 7, 3);
                    $kodeEx = $sub + 1;
                    $kodeEx = substr($kode, 0, 7) . $kodeEx;
                    $RekamMedis->kodeexternal = $kodeEx;
                } else {
                    $RekamMedis = DiagnosaKeperawatan::where('id', $request['id'])->first();
                }
                $RekamMedis->deskripsidiagnosakep = $request['deskripsidiagnosakep'];
                $RekamMedis->reportdisplay = $request['namadiagnosakep'];
                $RekamMedis->namadiagnosakep = $request['namadiagnosakep'];
                $RekamMedis->save();
            }
            if ($method == 'delete') {
                DiagnosaKeperawatan::where('id', $request['id'])->update(
                    ['statusenabled' => false]
                );
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'Inhuman',
            );
        } else {
            $transMessage = "Error";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message' => $transMessage,
                'as' => 'Inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveResumeMedis(Request $request, $method)
    {
        DB::beginTransaction();
        try {
            $norec = '';
            if ($method == 'save') {
                if ($request['norec'] == '') {
                    $RekamMedis = new ResumeMedis();
                    $RekamMedis->norec = $RekamMedis->generateNewId();
                    $RekamMedis->kdprofile = 0;
                    $RekamMedis->statusenabled = true;
                } else {
                    $RekamMedis = ResumeMedis::where('norec', $request['norec'])->first();
                }
                $RekamMedis->tglresume = $request['tglresume'];
                $RekamMedis->diagnosisawal = $request['diagnosis'];
                $RekamMedis->icd = $request['icd'];
                $RekamMedis->jenispemeriksaan = $request['jenispemeriksaan'];
                $RekamMedis->riwayatlalu = $request['riwayatlalu'];
                //                $RekamMedis->namadokter = $request['namadokter'];
                $RekamMedis->pegawaifk = $request['pegawaifk'];
                $RekamMedis->noregistrasifk = $request['noregistrasifk'];
                $RekamMedis->keteranganlainnya = 'RawatJalan';
                $RekamMedis->save();
                $norec = $RekamMedis->norec;
            }
            if ($method == 'delete') {
                $RekamMedis = ResumeMedis::where('norec', $request['norec'])->update(
                    ['statusenabled' => false]
                );
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'resume' => $RekamMedis,
                'message' => $transMessage,
                'as' => 'Inhuman',
            );
        } else {
            $transMessage = "Error";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message' => $transMessage,
                'as' => 'Inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getResumeMedis(Request $request, $nocm)
    {
        $data = \DB::table('resumemedis_t as rm')
            ->select(
                'rm.norec',
                'rm.tglresume',
                'ru.namaruangan',
                'rm.diagnosisawal as diagnosis',
                'rm.icd',
                'rm.jenispemeriksaan',
                'rm.riwayatlalu',
                'pg.namalengkap as namadokter',
                'rm.pegawaifk',
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'ps.nocm',
                'ps.namapasien'
            )
            ->Join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'rm.noregistrasifk')
            ->Join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->Join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'rm.pegawaifk')
            ->where('rm.statusenabled', true)
            ->where('ps.nocm', $nocm)
            ->where('rm.keteranganlainnya', 'RawatJalan');
        //            ->whereIn('ru.objectdepartemenfk',$iddept);

        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'Inhuman',
        );
        return $this->respond($result);
    }

    public function postResumeMedisInap(Request $request, $method)
    {
        // return($request['tglresume']);
        // // return(date_format(date_create($request['tglkontrolpoli']), 'Y-m-d'));
        // die();
        DB::beginTransaction();
        try {
            $norec = '';
            if ($method == 'save') {
                if ($request['norec'] == '') {
                    $RekamMedis = new ResumeMedis();
                    $RekamMedis->norec = $RekamMedis->generateNewId();
                    $RekamMedis->kdprofile = 0;
                    $RekamMedis->statusenabled = true;
                    $kdResume = $this->generateCode(new ResumeMedis, 'koderesume', 12, 'RI' . $this->getDateTime()->format('ymd'));
                } else { 
                    $RekamMedis = ResumeMedis::where('norec', $request['norec'])->first();
                    $kdResume = $RekamMedis->koderesume;
                    ResumeMedisDetail::where('resumefk', $request['norec'])->delete();
                }

                // $RekamMedis->tglresume = date('Y-m-d H:i:s');
                $RekamMedis->tglresume = date_format(date_create($request['tglresume']), 'Y-m-d');
                $RekamMedis->ringkasanriwayatpenyakit = $request['ringkasanriwayatpenyakit'];
                $RekamMedis->pemeriksaanfisik = $request['pemeriksaanfisik'];
                $RekamMedis->pemeriksaanpenunjang = $request['pemeriksaanpenunjang'];
                $RekamMedis->pemeriksaanpenunjanglab = $request['pemeriksaanpenunjanglab'];
                $RekamMedis->hasilkonsultasi = $request['hasilkonsultasi'];
                $RekamMedis->terapi = $request['terapi'];
                $RekamMedis->pegawaifk = $this->getCurrentUserID();
                $RekamMedis->noregistrasifk = $request['noregistrasifk'];
                $RekamMedis->keteranganlainnya = 'RawatInap';
                $RekamMedis->diagnosisawal = $request['diagnosisutama'];
                $RekamMedis->alasanrawat = $request['alasanrawat'];
                $RekamMedis->kondisiklinis = $request['kondisiklinis'];
                $RekamMedis->diagnosissekunder = $request['diagnosissekunder'];
                $RekamMedis->tindakanprosedur = $request['tindakanprosedur'];
                $RekamMedis->alergi = $request['alergi'];
                $RekamMedis->pasienkeluarga = $request['pasienkeluarga'];
                $RekamMedis->diet = $request['diet'];
                $RekamMedis->instruksianjuran = $request['instruksianjuran'];
                $RekamMedis->hasillab = $request['hasillab'];
                $RekamMedis->tglkontrolpoli = date_format(date_create($request['tglkontrolpoli']), 'Y-m-d');
                $RekamMedis->kondisiwaktukeluar = $request['kondisiwaktukeluar'];
                $RekamMedis->pengobatandilanjutkan = $request['pengobatandilanjutkan'];
                $RekamMedis->koderesume = $kdResume;
                $RekamMedis->save();
                $norec = $RekamMedis->norec;
                $norecHead = $RekamMedis->norec;

                // return($request['objectpegawaifk']);
                // die();
                $PasienDaftar = PasienDaftar::where('noregistrasi', $request['noregistrasi'])->first();
                $PasienDaftar->objectpegawaifk = $request['objectpegawaifk'];
                $PasienDaftar->save();

                foreach ($request['detail'] as $item) {
                    $det = new ResumeMedisDetail();
                    $det->norec = $det->generateNewId();
                    $det->kdprofile = 0;
                    $det->statusenabled = true;
                    $det->noregistrasifk = $request['noregistrasifk'];
                    $det->resumefk = $norecHead;
                    if (isset($item['namaobat'])) {
                        $det->namaobat = $item['namaobat'];
                    }
                    if (isset($item['jumlah'])) {
                        $det->jumlah = $item['jumlah'];
                    }
                    if (isset($item['frekuensi'])) {
                        $det->frekuensi = $item['frekuensi'];
                    }
                    if (isset($item['dosis'])) {
                        $det->dosis = $item['dosis'];
                    }
                    if (isset($item['carapemberian'])) {
                        $det->carapemberian = $item['carapemberian'];
                    }
                    $det->save();
                }
            }
            if ($method == 'delete') {
                //                ResumeMedisDetail::where('resumefk', $request['norec'])->delete();

                $RekamMedis = ResumeMedis::where('norec', $request['norec'])->update(
                    ['statusenabled' => false]
                );
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'resume' => $RekamMedis,
                'message' => $transMessage,
                'as' => 'Inhuman',
            );
        } else {
            $transMessage = "Error";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message' => $transMessage,
                'as' => 'Inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getResumeMedisInap(Request $request, $nocm)
    {
        $data = \DB::table('resumemedis_t as rm')
            ->select(
                'rm.norec',
                'rm.tglresume',
                'ru.namaruangan',
                'pg1.namalengkap as namadokter',
                'pg1.signature',
                'pd.objectpegawaifk',
                'rm.ringkasanriwayatpenyakit',
                'rm.pemeriksaanfisik',
                'rm.pemeriksaanpenunjang',
                'rm.pasienkeluarga',
                'rm.hasilkonsultasi',
                'rm.terapi',
                'rm.diagnosisawal',
                'rm.diagnosissekunder',
                'rm.tindakanprosedur',
                'rm.alergi',
                'rm.diet',
                'rm.instruksianjuran',
                'rm.hasillab',
                'rm.kondisiwaktukeluar',
                'rm.pengobatandilanjutkan',
                'rm.koderesume',
                'rm.pegawaifk',
                'rm.alasanrawat',
                'rm.tglkontrolpoli',
                'rm.kondisiklinis',
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'ps.nocm',
                'rm.noregistrasifk',
                'pd.tglpulang',
                'ps.namapasien',
                'pd.norec as norec_pd',
                'ps.objectjeniskelaminfk',
                'ps.tgllahir',
                'jk.jeniskelamin',
                'kp.kelompokpasien',
                'sr.noresep',
                'sr.norec as strukresepfk',
                DB::raw("DATEDIFF(d, ps.tgllahir, GETDATE()) as umur")
            )
            ->Join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'rm.noregistrasifk')
            ->Join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->leftJoin('antrianpasiendiperiksa_t as apd1', 'apd1.noregistrasifk', '=', 'pd.norec')
            ->leftJoin('strukresep_t as sr', 'sr.pasienfk', '=', 'apd1.norec')
            ->Join('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->Join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->Join('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'rm.pegawaifk')
            ->leftJoin('pegawai_m as pg1', 'pg1.id', '=', 'pd.objectpegawaifk')
            ->where('rm.statusenabled', true)
            ->where('ps.nocm', $nocm)
            ->where('rm.keteranganlainnya', 'RawatInap');
        //            ->whereIn('ru.objectdepartemenfk',$iddept);

        $data = $data->take(1);
        $data = $data->get(1);



        // $objectjeniskelaminfk = $data[0]->objectjeniskelaminfk;
        // $norec_pd = $data[0]->norec_pd;
        // $umur = $data[0]->umur;
        // $datahasillab = DB::select(DB::raw("SELECT DISTINCT 
        // pp.noregistrasifk AS norec_apd, djp.detailjenisproduk, pp.produkfk, prd.namaproduk, maps.detailpemeriksaan, maps.memohasil, maps.nourutdetail, maps.satuanstandarfk, ss.satuanstandar, nn.nilaitext, nn.tipedata, nn.nilaimin,
        // nn.nilaimax, hh.hasil, maps.id AS map_id, hh.norec AS norec_hasil, maps.nourutjenispemeriksaan, maps.nourutdetail AS Expr1, pp.norec AS norecpp, nn.nilaimin + '-' + nn.nilaimax AS nilainormalstr, hh.flag, nn.id AS idnn, 
        // maps2.jeniskelaminfk, nn.metode AS Metode, pp.tglpelayanan, hh.tglhasil, pg.id, pg.namalengkap, hh.hasil_s, hh.hasil_i, hh.catatan, hh.catatancetak, hh.tglcetak, pp.isclaim
        // FROM antrianpasiendiperiksa_t AS apd JOIN
        // pelayananpasien_t AS pp ON pp.noregistrasifk=apd.norec LEFT OUTER JOIN
        // produk_m AS prd ON prd.id = pp.produkfk LEFT OUTER JOIN
        // detailjenisproduk_m AS djp ON djp.id = prd.objectdetailjenisprodukfk LEFT OUTER JOIN
        // maphasillab_m AS maps ON maps.produkfk = prd.id LEFT OUTER JOIN
        // maphasillabdetail_m AS maps2 ON maps2.maphasilfk = maps.id AND maps2.jeniskelaminfk = $objectjeniskelaminfk AND maps2.kelompokumurfk IN
        // (SELECT        id
        // FROM            kelompokumur_m AS kuu
        // WHERE        ($umur BETWEEN umurmin AND umurmax)) INNER JOIN
        // nilainormal_m AS nn ON nn.id = maps2.nilainormalfk LEFT OUTER JOIN
        // pegawai_m AS pg ON pg.id = pp.objectpegawaipengirimfk LEFT OUTER JOIN
        // satuanstandar_m AS ss ON ss.id = maps.satuanstandarfk LEFT OUTER JOIN
        // hasillaboratorium_t AS hh ON hh.norecpelayanan = pp.norec AND pp.noregistrasifk = hh.noregistrasifk AND maps.detailpemeriksaan = hh.detailpemeriksaan
        // WHERE  apd.noregistrasifk = '$norec_pd' AND pp.isclaim='true'
        // ORDER BY maps.nourutjenispemeriksaan, maps.nourutdetail"));
        $result = [];
        foreach ($data as $item) {
            $noregistrasi = $item->noregistrasi;
            $datad = DB::select(DB::raw("SELECT pd.noregistrasi, apd.tglmasuk, jd.id as idjd, CASE WHEN dg.kddiagnosa IS NULL THEN '-' ELSE dg.kddiagnosa END AS kddiagnosa,
                CASE WHEN ddp.objectdiagnosafk IS NULL THEN ddp.keterangan ELSE dg.namadiagnosa END as namadiagnosa
                FROM pasiendaftar_t as pd
                inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                left join diagnosapasien_t as dp on dp.noregistrasifk=apd.norec
                left join detaildiagnosapasien_t as ddp on ddp.objectdiagnosapasienfk=dp.norec
                left join diagnosa_m as dg on dg.id=ddp.objectdiagnosafk
                inner join jenisdiagnosa_m as jd on jd.id=ddp.objectjenisdiagnosafk
                WHERE pd.noregistrasi = $noregistrasi
                "));

            $namadiagnosaprimary = "";
            $kddiagnosaprimary = "";
            $namadiagnosasecondary = "";
            $kddiagnosasecondary = "";
            $namadiagnosaawal = "";
            $kddiagnosaawal = "";
            // return($datad);
            // die();
            foreach ($datad as $itemd) {
                if ($itemd->idjd === '1') {
                    $namadiagnosaprimary = $itemd->namadiagnosa;
                    $kddiagnosaprimary = $itemd->kddiagnosa;
                }
                if ($itemd->idjd === '2') {
                    if ($namadiagnosasecondary == "") {
                        $namadiagnosasecondary = $itemd->namadiagnosa;
                        $kddiagnosasecondary = $itemd->kddiagnosa;
                    } else {
                        $namadiagnosasecondary = $namadiagnosasecondary . "\r\n" . $itemd->namadiagnosa;
                        $kddiagnosasecondary = $kddiagnosasecondary . "\r\n" . $itemd->kddiagnosa;
                    }
                }
                if ($itemd->idjd === '5') {
                    if ($namadiagnosaawal == "") {
                        $namadiagnosaawal = $itemd->namadiagnosa;
                    } else {
                        $namadiagnosaawal = $namadiagnosaawal . ', ' . $itemd->namadiagnosa;
                        $kddiagnosaawal = $itemd->kddiagnosa;
                    }
                }
            }

            $datadt = DB::select(DB::raw("SELECT CASE WHEN dt.kddiagnosatindakan IS NULL THEN '-' ELSE dt.kddiagnosatindakan END AS kddiagnosatindakan,
                CASE WHEN ddt.objectdiagnosatindakanfk IS NULL THEN ddt.keterangantindakan ELSE dt.namadiagnosatindakan END as namadiagnosatindakan
                FROM pasiendaftar_t as pd
                inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                left join diagnosatindakanpasien_t as dpt on dpt.objectpasienfk=apd.norec
                left join detaildiagnosatindakanpasien_t as ddt on ddt.objectdiagnosatindakanpasienfk=dpt.norec
                left join diagnosatindakan_m as dt on dt.id=ddt.objectdiagnosatindakanfk
                WHERE pd.noregistrasi = $noregistrasi
                "));

            $namadiagnosatindakan = "";
            $kddiagnosatindakan = "";
            // return($datadt);
            // die();
            if (count($datadt) != 0) {
                foreach ($datadt as $itemdt) {
                    if ($namadiagnosatindakan == "") {
                        $namadiagnosatindakan = $itemdt->namadiagnosatindakan;
                        $kddiagnosatindakan = $itemdt->kddiagnosatindakan;
                    } else {
                        $namadiagnosatindakan = $namadiagnosatindakan . "\r\n" . $itemdt->namadiagnosatindakan;
                        $kddiagnosatindakan = $kddiagnosatindakan . "\r\n" . $itemdt->kddiagnosatindakan;
                    }
                }
            }

            // return($noregistrasi);
            // die();
            $datahl = DB::select(DB::raw("SELECT format(pp.tglpelayanan,'yyyy-MM-dd HH:mm') as tglpelayanan, pp.norec, pdk.namaproduk,
            CASE WHEN hh.hasil IS NOT NULL THEN hh.hasil ELSE '-' END as hasil
            FROM pasiendaftar_t as pd
            inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
            inner join pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
            inner join produk_m as pdk on pdk.id=pp.produkfk
            inner join hasillaboratorium_t  as hh on hh.norecpelayanan  = pp.norec 
            inner join maphasillab_m  as maps on maps.produkfk = pdk.id AND maps.detailpemeriksaan =hh.detailpemeriksaan  AND maps.id =hh.maphasilfk 
            WHERE pd.noregistrasi = $noregistrasi AND pp.isrm=1 order by pp.tglpelayanan, maps.nourutjenispemeriksaan,maps.nourutdetail asc
            "));

            $datapp = DB::select(DB::raw("SELECT DISTINCT pdk.namaproduk, pp.aturanpakai, pp.dosisobat
            FROM pasiendaftar_t AS pd
            INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk=pd.norec
            INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk=apd.norec
            INNER JOIN produk_m AS pdk ON pdk.id = pp.produkfk
            WHERE pd.noregistrasi = $noregistrasi AND pp.isobat=1 AND pdk.objectkelompokprodukbpjsfk IN ('13','14','15') ORDER BY pdk.namaproduk
            "));

            $obatobat = '';
            if (count($datapp) != 0) {
                foreach ($datapp as $itempp) {
                    if ($obatobat == '') {
                        $obatobat = $itempp->namaproduk . '(' . $itempp->dosisobat . ')';
                    } else {
                        $obatobat = $obatobat . ', ' . $itempp->namaproduk . '(' . $itempp->dosisobat . ')';
                    }
                }
            }

            $norechl = 'as';
            $hasillab = '';
            $namaproduk = '';
            if (count($datahl) != 0) {
                // return($datahl);
                // die();
                foreach ($datahl as $itemhl) {
                    // $itemhl->norec = '"'.$itemhl->norec.'"';
                    // return($norechl);
                    // die();
                    // return($itemhl->norec);
                    // die();
                    if ($norechl == $itemhl->norec) {
                        // $hasillab = "{$hasillab}/{$itemhl->hasi}"
                        // $hasillab + .'/'. + $itemhl->hasil;
                        $hasillab = $hasillab . '/' . $itemhl->hasil;
                    } else {
                        $norechl = $itemhl->norec;
                        //     // $hasillab = " {$itemhl->namaproduk}:{$itemhl->hasil}"
                        $namaproduk = $itemhl->namaproduk;
                        // if(count($itemhl) != 1)
                        if ($hasillab == '') {
                            $hasillab = $itemhl->tglpelayanan . ':' . $namaproduk . '=' . $itemhl->hasil;
                        } else {
                            $hasillab = $hasillab . "\r\n" . $itemhl->tglpelayanan . ':' . $namaproduk . '=' . $itemhl->hasil;
                        }
                    }
                }
            }

            // return($noregistrasi);
            // die();

            $details = DB::select(
                DB::raw("
                select prd.namaproduk as namaobat, pp.jumlah, pp.dosisobat, pp.carapemberian, rt.id,
                case when pp.frekuensi is null then pp.aturanpakai else pp.frekuensi end as frekuensi
                from pasiendaftar_t as pd
                inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                inner join pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                inner join produk_m as prd on prd.id=pp.produkfk
                left join routefarmasi as rt on rt.id=pp.routefk
                where pp.ispulang=1 and pd.noregistrasi=$noregistrasi")
            );

            $namaobat = "";
            $jumlah = "";
            $dosis = "";
            $frekuensi = "";
            $carapemberian = "";
            foreach ($details as $itemdetails) {
                if ($namaobat == "") {
                    $namaobat = $itemdetails->namaobat;
                    $jumlah = $itemdetails->jumlah;
                    $dosis = $itemdetails->dosisobat;
                    $frekuensi = $itemdetails->frekuensi;
                    $carapemberian = $itemdetails->carapemberian;
                } else {
                    $namaobat = $namaobat . "\r\n" . $itemdetails->namaobat;
                    $jumlah = $jumlah . "\r\n" . $itemdetails->jumlah;
                    $dosis = $dosis . "\r\n" . $itemdetails->dosisobat;
                    $frekuensi = $frekuensi . "\r\n" . $itemdetails->frekuensi;
                    $carapemberian = $carapemberian . "\r\n" . $itemdetails->carapemberian;
                }
                // if ($itemd->idjd === '1') {
                //     $namadiagnosaprimary = $itemd->namadiagnosa;
                //     $kddiagnosaprimary = $itemd->kddiagnosa;
                // }
                // if ($itemd->idjd === '2') {
                //     if ($namadiagnosasecondary == "") {
                //         $namadiagnosasecondary = $itemd->namadiagnosa;
                //         $kddiagnosasecondary = $itemd->kddiagnosa;
                //     } else {
                //         $namadiagnosasecondary = $namadiagnosasecondary . "\r\n" . $itemd->namadiagnosa;
                //         $kddiagnosasecondary = $kddiagnosasecondary . "\r\n" . $itemd->kddiagnosa;
                //     }
                // }
                // if ($itemd->idjd === '5') {
                //     if ($namadiagnosaawal == "") {
                //         $namadiagnosaawal = $itemd->namadiagnosa;
                //     }
                //     $namadiagnosaawal = $namadiagnosaawal . ', ' . $itemd->namadiagnosa;
                //     $kddiagnosaawal = $itemd->kddiagnosa;
                // }
            }

            // return($details);
            // die();
            $result[] = array(
                'norec' => $item->norec,
                'tglresume' => $item->tglresume,
                'namaruangan' => $item->namaruangan,
                'namadokter' => $item->namadokter,
                'signature' => $item->signature,
                'objectpegawaifk' => $item->objectpegawaifk,
                'ringkasanriwayatpenyakit' => $item->ringkasanriwayatpenyakit,
                'pemeriksaanfisik' => $item->pemeriksaanfisik,
                'pasienkeluarga' => $item->pasienkeluarga,
                'pemeriksaanpenunjang' => $item->pemeriksaanpenunjang,
                'pemeriksaanpenunjangaddlab' => $hasillab . "\r\n" . $item->pemeriksaanpenunjang,
                'hasilkonsultasi' => $item->hasilkonsultasi,
                'terapi' => $item->terapi,
                // 'diagnosisawal' => $item->diagnosisawal,
                'diagnosissekunder' => $namadiagnosasecondary,
                'tindakanprosedur' => $item->tindakanprosedur,
                'alergi' => $item->alergi,
                'alasanrawat' => $item->alasanrawat,
                'diet' => $item->diet,
                'tglkontrolpoli' => date_format(date_create($item->tglkontrolpoli), 'd-m-Y'),
                'instruksianjuran' => $item->instruksianjuran,
                // 'hasillabadd' => $hasillab.' '.$item->hasilkonsultasi,
                'hasillab' => $item->hasillab,
                'kelompokpasien' => $item->kelompokpasien,
                'kondisiwaktukeluar' => $item->kondisiwaktukeluar,
                'pengobatandilanjutkan' => $item->pengobatandilanjutkan,
                'koderesume' => $item->koderesume,
                'pegawaifk' => $item->pegawaifk,
                'jeniskelamin' => $item->jeniskelamin,
                'obatobat' => $obatobat,
                'namadiagnosaprimary' => $namadiagnosaprimary,
                'kondisiklinis' => $item->kondisiklinis,
                'kddiagnosaprimary' => $kddiagnosaprimary,
                'namadiagnosasecondary' => $namadiagnosasecondary,
                'kddiagnosasecondary' => $kddiagnosasecondary,
                'diagnosisawal' => $namadiagnosaawal,
                'kddiagnosaawal' => $kddiagnosaawal,
                'namadiagnosatindakan' => $namadiagnosatindakan,
                'kddiagnosatindakan' => $kddiagnosatindakan,
                'noregistrasi' => $item->noregistrasi,
                'tgllahir' => date_format(date_create($item->tgllahir), 'd-m-Y'),
                'tglpulang' => $item->tglpulang,
                'nocm' => $item->nocm,
                'datadiagnosa' => $datad,
                'datadiagnosatindakan' => $datadt,
                // 'datahasillab' => $datahasillab,
                'tglregistrasi' => $item->tglregistrasi,
                'namapasien' => $item->namapasien,
                'noregistrasifk' => $item->noregistrasifk,
                'noresep' => $item->noresep,
                'details' => $details,
                'namaobat' => $namaobat,
                'jumlah' => $jumlah,
                'dosis' => $dosis,
                'frekuensi' => $frekuensi,
                'carapemberian' => $carapemberian,
            );
        }
        $result = array(
            'data' => $result,
            'message' => 'Inhuman',
        );
        return $this->respond($result);
    }

    public function getResumeMedisInapNoRegistrasi(Request $request, $noregistrasi)
    {
        $data = \DB::table('resumemedis_t as rm')
            ->select(
                'rm.norec',
                'rm.tglresume',
                'ru.namaruangan',
                'pg1.namalengkap as namadokter',
                'pg1.signature',
                'pd.objectpegawaifk',
                'rm.ringkasanriwayatpenyakit',
                'rm.pemeriksaanfisik',
                'rm.pemeriksaanpenunjang',
                'rm.pemeriksaanpenunjanglab',
                'rm.pasienkeluarga',
                'rm.hasilkonsultasi',
                'rm.terapi',
                'rm.diagnosisawal',
                'rm.diagnosissekunder',
                'rm.tindakanprosedur',
                'rm.alergi',
                'rm.diet',
                'rm.instruksianjuran',
                'rm.hasillab',
                'rm.kondisiwaktukeluar',
                'rm.pengobatandilanjutkan',
                'rm.koderesume',
                'rm.pegawaifk',
                'rm.alasanrawat',
                'rm.tglkontrolpoli',
                'rm.kondisiklinis',
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'ps.nocm',
                'rm.noregistrasifk',
                'pd.tglpulang',
                'ps.namapasien',
                'pd.norec as norec_pd',
                'ps.objectjeniskelaminfk',
                'ps.tgllahir',
                'jk.jeniskelamin',
                'kp.kelompokpasien',
                'sr.noresep',
                'sr.norec as strukresepfk',
                'ar.asalrujukan',
                DB::raw("age (   ps.tgllahir, now( ) ) AS umur")
            )
            ->Join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'rm.noregistrasifk')
            ->Join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->leftJoin('antrianpasiendiperiksa_t as apd1', 'apd1.noregistrasifk', '=', 'pd.norec')
            ->leftJoin('strukresep_t as sr', 'sr.pasienfk', '=', 'apd.norec')
            ->Join('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->Join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->Join('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'rm.pegawaifk')
            ->leftJoin('pegawai_m as pg1', 'pg1.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('asalrujukan_m as ar', 'apd.objectasalrujukanfk', '=', 'ar.id')
            ->where('rm.statusenabled', true)
            ->where('pd.noregistrasi', $noregistrasi);
            // ->where('rm.keteranganlainnya', 'RawatInap');
        //            ->whereIn('ru.objectdepartemenfk',$iddept);
        // $data = $data->orderBy('sr.tglresep', DESC)
        $data = $data->take(1);
        $data = $data->get(1);



        // $objectjeniskelaminfk = $data[0]->objectjeniskelaminfk;
        // $norec_pd = $data[0]->norec_pd;
        // $umur = $data[0]->umur;
        // $datahasillab = DB::select(DB::raw("SELECT DISTINCT 
        // pp.noregistrasifk AS norec_apd, djp.detailjenisproduk, pp.produkfk, prd.namaproduk, maps.detailpemeriksaan, maps.memohasil, maps.nourutdetail, maps.satuanstandarfk, ss.satuanstandar, nn.nilaitext, nn.tipedata, nn.nilaimin,
        // nn.nilaimax, hh.hasil, maps.id AS map_id, hh.norec AS norec_hasil, maps.nourutjenispemeriksaan, maps.nourutdetail AS Expr1, pp.norec AS norecpp, nn.nilaimin + '-' + nn.nilaimax AS nilainormalstr, hh.flag, nn.id AS idnn, 
        // maps2.jeniskelaminfk, nn.metode AS Metode, pp.tglpelayanan, hh.tglhasil, pg.id, pg.namalengkap, hh.hasil_s, hh.hasil_i, hh.catatan, hh.catatancetak, hh.tglcetak, pp.isclaim
        // FROM antrianpasiendiperiksa_t AS apd JOIN
        // pelayananpasien_t AS pp ON pp.noregistrasifk=apd.norec LEFT OUTER JOIN
        // produk_m AS prd ON prd.id = pp.produkfk LEFT OUTER JOIN
        // detailjenisproduk_m AS djp ON djp.id = prd.objectdetailjenisprodukfk LEFT OUTER JOIN
        // maphasillab_m AS maps ON maps.produkfk = prd.id LEFT OUTER JOIN
        // maphasillabdetail_m AS maps2 ON maps2.maphasilfk = maps.id AND maps2.jeniskelaminfk = $objectjeniskelaminfk AND maps2.kelompokumurfk IN
        // (SELECT        id
        // FROM            kelompokumur_m AS kuu
        // WHERE        ($umur BETWEEN umurmin AND umurmax)) INNER JOIN
        // nilainormal_m AS nn ON nn.id = maps2.nilainormalfk LEFT OUTER JOIN
        // pegawai_m AS pg ON pg.id = pp.objectpegawaipengirimfk LEFT OUTER JOIN
        // satuanstandar_m AS ss ON ss.id = maps.satuanstandarfk LEFT OUTER JOIN
        // hasillaboratorium_t AS hh ON hh.norecpelayanan = pp.norec AND pp.noregistrasifk = hh.noregistrasifk AND maps.detailpemeriksaan = hh.detailpemeriksaan
        // WHERE  apd.noregistrasifk = '$norec_pd' AND pp.isclaim='true'
        // ORDER BY maps.nourutjenispemeriksaan, maps.nourutdetail"));
        $result = [];
        foreach ($data as $item) {
           
            $noregistrasi = $item->noregistrasi;
            $datad = DB::select(DB::raw("SELECT pd.noregistrasi, apd.tglmasuk, jd.id as idjd, CASE WHEN dg.kddiagnosa IS NULL THEN '-' ELSE dg.kddiagnosa END AS kddiagnosa,
                CASE WHEN ddp.objectdiagnosafk IS NULL THEN ddp.keterangan ELSE dg.namadiagnosa END as namadiagnosa
                FROM pasiendaftar_t as pd
                inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                left join diagnosapasien_t as dp on dp.noregistrasifk=apd.norec
                left join detaildiagnosapasien_t as ddp on ddp.objectdiagnosapasienfk=dp.norec
                left join diagnosa_m as dg on dg.id=ddp.objectdiagnosafk
                inner join jenisdiagnosa_m as jd on jd.id=ddp.objectjenisdiagnosafk
                WHERE pd.noregistrasi = '$noregistrasi'
                "));

            $namadiagnosaprimary = "";
            $kddiagnosaprimary = "";
            $namadiagnosasecondary = "";
            $kddiagnosasecondary = "";
            $namadiagnosaawal = "";
            $kddiagnosaawal = "";
            // return($datad);
            // die();
            foreach ($datad as $itemd) {
                if ($itemd->idjd == '1') {
                    $namadiagnosaprimary = $itemd->namadiagnosa;
                    $kddiagnosaprimary = $itemd->kddiagnosa;
                }
                if ($itemd->idjd == '2') {
                    if ($namadiagnosasecondary == "") {
                        $namadiagnosasecondary = $itemd->namadiagnosa;
                        $kddiagnosasecondary = $itemd->kddiagnosa;
                    } else {
                        $namadiagnosasecondary = $namadiagnosasecondary . "\r\n" . $itemd->namadiagnosa;
                        $kddiagnosasecondary = $kddiagnosasecondary . "\r\n" . $itemd->kddiagnosa;
                    }
                }
                if ($itemd->idjd == '5') {
                   
                    if ($namadiagnosaawal == "") {
                        $namadiagnosaawal = $itemd->namadiagnosa;
                    } else {
                        $namadiagnosaawal = $namadiagnosaawal . ', ' . $itemd->namadiagnosa;
                        $kddiagnosaawal = $itemd->kddiagnosa;
                    }
                }
            }

            $datadt = DB::select(DB::raw("SELECT CASE WHEN dt.kddiagnosatindakan IS NULL THEN '-' ELSE dt.kddiagnosatindakan END AS kddiagnosatindakan,
                CASE WHEN ddt.objectdiagnosatindakanfk IS NULL THEN ddt.keterangantindakan ELSE dt.namadiagnosatindakan END as namadiagnosatindakan
                FROM pasiendaftar_t as pd
                inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                left join diagnosatindakanpasien_t as dpt on dpt.objectpasienfk=apd.norec
                left join detaildiagnosatindakanpasien_t as ddt on ddt.objectdiagnosatindakanpasienfk=dpt.norec
                left join diagnosatindakan_m as dt on dt.id=ddt.objectdiagnosatindakanfk
                WHERE pd.noregistrasi = '$noregistrasi'
                "));

            $namadiagnosatindakan = "";
            $kddiagnosatindakan = "";
            // return($datadt);
            // die();
            if (count($datadt) != 0) {
                foreach ($datadt as $itemdt) {
                    if ($namadiagnosatindakan == "") {
                        $namadiagnosatindakan = $itemdt->namadiagnosatindakan;
                        $kddiagnosatindakan = $itemdt->kddiagnosatindakan;
                    } else {
                        $namadiagnosatindakan = $namadiagnosatindakan . "\r\n" . $itemdt->namadiagnosatindakan;
                        $kddiagnosatindakan = $kddiagnosatindakan . "\r\n" . $itemdt->kddiagnosatindakan;
                    }
                }
            }

            // return($noregistrasi);
            // die();
            // $datahl = DB::select(DB::raw("SELECT format(pp.tglpelayanan,'yyyy-MM-dd HH:mm') as tglpelayanan, pp.norec, pdk.namaproduk, hh.detailpemeriksaan,
            // CASE WHEN hh.hasil IS NOT NULL THEN hh.hasil ELSE '-' END as hasil, maps.nourutjenispemeriksaan,maps.nourutdetail
            // FROM pasiendaftar_t as pd
            // inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
            // inner join pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
            // inner join produk_m as pdk on pdk.id=pp.produkfk
            // inner join hasillaboratorium_t  as hh on hh.norecpelayanan  = pp.norec 
            // inner join maphasillab_m  as maps on maps.produkfk = pdk.id AND maps.detailpemeriksaan =hh.detailpemeriksaan  AND maps.id =hh.maphasilfk 
            // WHERE pd.noregistrasi = $noregistrasi AND pp.isrm=1
            // UNION
            // SELECT format(pp.tglpelayanan,'yyyy-MM-dd HH:mm') as tglpelayanan, pp.norec, pdk.namaproduk, hh.detailpemeriksaan,
            // CASE WHEN hh.hasil IS NOT NULL THEN hh.hasil ELSE '-' END as hasil, maps.nourutjenispemeriksaan,maps.nourutdetail
            // FROM pelayananpasien_t as pp
            // inner join produk_m as pdk on pdk.id=pp.produkfk
            // inner join hasillaboratorium_t  as hh on hh.norecpelayanan  = pp.norec 
            // inner join maphasillab_m  as maps on maps.produkfk = pdk.id AND maps.detailpemeriksaan =hh.detailpemeriksaan  AND maps.id =hh.maphasilfk 
            // WHERE pp.noregistrasiresume = $noregistrasi 
            // order by tglpelayanan, maps.nourutjenispemeriksaan,maps.nourutdetail asc
            // "));
            
            $datahl = DB::select(DB::raw("SELECT to_char(pp.tglpelayanan,'yyyy-MM-dd HH:mm') as tglpelayanan, pp.norec, pdk.namaproduk, hh.detailpemeriksaan,
            CASE WHEN hh.hasil IS NOT NULL THEN hh.hasil ELSE '-' END as hasil
            FROM pasiendaftar_t as pd
            inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
            inner join pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
            inner join produk_m as pdk on pdk.id=pp.produkfk
            inner join hasillaboratorium_t  as hh on hh.norecpelayanan  = pp.norec 
            inner join maphasillab_m  as maps on maps.produkfk = pdk.id AND maps.detailpemeriksaan =hh.detailpemeriksaan  AND maps.id =hh.maphasilfk 
            WHERE pd.noregistrasi = '$noregistrasi' AND pp.isrm=true order by pp.tglpelayanan, maps.nourutjenispemeriksaan,maps.nourutdetail asc
            "));

            $datapp = DB::select(DB::raw("SELECT DISTINCT pdk.namaproduk, pp.aturanpakai, pp.dosisobat
            FROM pasiendaftar_t AS pd
            INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk=pd.norec
            INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk=apd.norec
            INNER JOIN produk_m AS pdk ON pdk.id = pp.produkfk
            WHERE pd.noregistrasi = '$noregistrasi' AND pp.isobat=true AND pdk.objectkelompokprodukbpjsfk IN ('13','14','15') ORDER BY pdk.namaproduk
            "));

            $obatobat = '';
            if (count($datapp) != 0) {
                foreach ($datapp as $itempp) {
                    if ($obatobat == '') {
                        $obatobat = $itempp->namaproduk . '(' . $itempp->dosisobat . ')';
                    } else {
                        $obatobat = $obatobat . ', ' . $itempp->namaproduk . '(' . $itempp->dosisobat . ')';
                    }
                }
            }

            $norechl = 'as';
            $hasillab = '';
            $namaproduk = '';
            if (count($datahl) != 0) {
                // return($datahl);
                // die();
                foreach ($datahl as $itemhl) {
                    // $itemhl->norec = '"'.$itemhl->norec.'"';
                    // return($norechl);
                    // die();
                    // return($itemhl->norec);
                    // die();
                    if ($norechl == $itemhl->norec) {
                        // $hasillab = "{$hasillab}/{$itemhl->hasi}"
                        // $hasillab + .'/'. + $itemhl->hasil;
                        $hasillab = $hasillab . '/' . $itemhl->detailpemeriksaan . ':' . $itemhl->hasil;
                    } else {
                        $norechl = $itemhl->norec;
                        //     // $hasillab = " {$itemhl->namaproduk}: $itemhl->detailpemeriksaan . ':' .{$itemhl->hasil}"
                        $namaproduk = $itemhl->namaproduk;
                        // if(count($itemhl) != 1)
                        if ($hasillab == '') {
                            $hasillab = $itemhl->tglpelayanan . ':' . $namaproduk . '=' . $itemhl->detailpemeriksaan . ':' . $itemhl->hasil;
                        } else {
                            $hasillab = $hasillab . "\r\n" . $itemhl->tglpelayanan . ':' . $namaproduk . '=' . $itemhl->detailpemeriksaan . ':' . $itemhl->hasil;
                        }
                    }
                }
            }

            // return($noregistrasi);
            // die();

            $details = DB::select(
                DB::raw("
                select prd.namaproduk as namaobat, pp.jumlah, pp.dosisobat, pp.carapemberian, rt.id,
                case when pp.frekuensi is null then pp.aturanpakai else pp.frekuensi end as frekuensi
                from pasiendaftar_t as pd
                inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                inner join pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                inner join produk_m as prd on prd.id=pp.produkfk
                left join routefarmasi as rt on rt.id=pp.routefk
                where pp.ispulang=true and pd.noregistrasi='$noregistrasi'")
            );

            $namaobat = "";
            $jumlah = "";
            $dosis = "";
            $frekuensi = "";
            $carapemberian = "";
            foreach ($details as $itemdetails) {
                if ($namaobat == "") {
                    $namaobat = $itemdetails->namaobat;
                    $jumlah = $itemdetails->jumlah;
                    $dosis = $itemdetails->dosisobat;
                    $frekuensi = $itemdetails->frekuensi;
                    $carapemberian = $itemdetails->carapemberian;
                } else {
                    $namaobat = $namaobat . "\r\n" . $itemdetails->namaobat;
                    $jumlah = $jumlah . "\r\n" . $itemdetails->jumlah;
                    $dosis = $dosis . "\r\n" . $itemdetails->dosisobat;
                    $frekuensi = $frekuensi . "\r\n" . $itemdetails->frekuensi;
                    $carapemberian = $carapemberian . "\r\n" . $itemdetails->carapemberian;
                }
                // if ($itemd->idjd === '1') {
                //     $namadiagnosaprimary = $itemd->namadiagnosa;
                //     $kddiagnosaprimary = $itemd->kddiagnosa;
                // }
                // if ($itemd->idjd === '2') {
                //     if ($namadiagnosasecondary == "") {
                //         $namadiagnosasecondary = $itemd->namadiagnosa;
                //         $kddiagnosasecondary = $itemd->kddiagnosa;
                //     } else {
                //         $namadiagnosasecondary = $namadiagnosasecondary . "\r\n" . $itemd->namadiagnosa;
                //         $kddiagnosasecondary = $kddiagnosasecondary . "\r\n" . $itemd->kddiagnosa;
                //     }
                // }
                // if ($itemd->idjd === '5') {
                //     if ($namadiagnosaawal == "") {
                //         $namadiagnosaawal = $itemd->namadiagnosa;
                //     }
                //     $namadiagnosaawal = $namadiagnosaawal . ', ' . $itemd->namadiagnosa;
                //     $kddiagnosaawal = $itemd->kddiagnosa;
                // }
            }

            // return($details);
            // die();
            $result[] = array(
                'norec' => $item->norec,
                'tglresume' => $item->tglresume,
                'asalrujukan' => $item->asalrujukan,
                'namaruangan' => $item->namaruangan,
                'namadokter' => $item->namadokter,
                'signature' => $item->signature,
                'objectpegawaifk' => $item->objectpegawaifk,
                'ringkasanriwayatpenyakit' => $item->ringkasanriwayatpenyakit,
                'pemeriksaanfisik' => $item->pemeriksaanfisik,
                'pasienkeluarga' => $item->pasienkeluarga,
                'pemeriksaanpenunjang' => $item->pemeriksaanpenunjang,
                'pemeriksaanpenunjanglab' => $item->pemeriksaanpenunjanglab,
                'pemeriksaanpenunjangaddlab' => $hasillab . "\r\n" . $item->pemeriksaanpenunjang,
                'hasilkonsultasi' => $item->hasilkonsultasi,
                'terapi' => $item->terapi,
                // 'diagnosisawal' => $item->diagnosisawal,
                'diagnosissekunder' => $namadiagnosasecondary,
                'tindakanprosedur' => $item->tindakanprosedur,
                'alergi' => $item->alergi,
                'alasanrawat' => $item->alasanrawat,
                'diet' => $item->diet,
                'tglkontrolpoli' => $item->tglkontrolpoli,
                // 'tglkontrolpoli' => date_format(date_create($item->tglkontrolpoli), 'd-m-Y'),
                'instruksianjuran' => $item->instruksianjuran,
                // 'hasillabadd' => $hasillab.' '.$item->hasilkonsultasi,
                'hasillab' => $item->hasillab,
                'kelompokpasien' => $item->kelompokpasien,
                'kondisiwaktukeluar' => $item->kondisiwaktukeluar,
                'pengobatandilanjutkan' => $item->pengobatandilanjutkan,
                'koderesume' => $item->koderesume,
                'pegawaifk' => $item->pegawaifk,
                'jeniskelamin' => $item->jeniskelamin,
                'obatobat' => $obatobat,
                'namadiagnosaprimary' => $namadiagnosaprimary,
                'kondisiklinis' => $item->kondisiklinis,
                'kddiagnosaprimary' => $kddiagnosaprimary,
                'namadiagnosasecondary' => $namadiagnosasecondary,
                'kddiagnosasecondary' => $kddiagnosasecondary,
                'diagnosisawal' => $namadiagnosaawal,
                'kddiagnosaawal' => $kddiagnosaawal,
                'namadiagnosatindakan' => $namadiagnosatindakan,
                'kddiagnosatindakan' => $kddiagnosatindakan,
                'noregistrasi' => $item->noregistrasi,
                'tgllahir' => date_format(date_create($item->tgllahir), 'd-m-Y'),
                'tglpulang' => $item->tglpulang,
                'nocm' => $item->nocm,
                'datadiagnosa' => $datad,
                'datadiagnosatindakan' => $datadt,
                // 'datahasillab' => $datahasillab,
                'tglregistrasi' => $item->tglregistrasi,
                'namapasien' => $item->namapasien,
                'noregistrasifk' => $item->noregistrasifk,
                'noresep' => $item->noresep,
                'details' => $details,
                'namaobat' => $namaobat,
                'jumlah' => $jumlah,
                'dosis' => $dosis,
                'frekuensi' => $frekuensi,
                'carapemberian' => $carapemberian,
            );
        }
        $result = array(
            'data' => $result,
            'message' => 'Inhuman',
        );
        return $this->respond($result);
    }

    public function saveOrderKonsul(Request $request)
    {
        DB::beginTransaction();
        try {
            $dataPD = PasienDaftar::where('norec', $request['norec_pd'])->first();
            if ($request['norec_so'] == "") {
                $dataSO = new StrukOrder();
                $dataSO->norec = $dataSO->generateNewId();
                $dataSO->kdprofile = 0;
                $dataSO->statusenabled = true;
                $noOrder = $this->generateCode(new StrukOrder, 'noorder', 11, 'K' . $this->getDateTime()->format('ym'));
            } else {
                $dataSO = StrukOrder::where('norec', $request['norec_so'])->first();
                $noOrder = $dataSO->noorder;
            }
            $dataSO->nocmfk = $dataPD->nocmfk;
            $dataSO->isdelivered = 1;
            $dataSO->noorder = $noOrder;
            $dataSO->noorderintern = $noOrder;
            $dataSO->noregistrasifk = $dataPD->norec;
            $dataSO->objectpegawaiorderfk = $request['pegawaifk'];
            $dataSO->objectpetugasfk = $this->getCurrentUserID();
            $dataSO->qtyjenisproduk = 0;
            $dataSO->qtyproduk = 0;
            $dataSO->objectruanganfk = $request['objectruanganasalfk'];
            $dataSO->objectruangantujuanfk = $request['objectruangantujuanfk'];
            $dataSO->keteranganorder = $request['keterangan'];
            $kelompokTransaksi = KelompokTransaksi::where('kelompoktransaksi', 'KONSULTASI DOKTER')->first();
            $dataSO->objectkelompoktransaksifk = $kelompokTransaksi->id;
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

            //            foreach ($request['details'] as $item) {
            //                $dataOP = new OrderPelayanan();
            //                $dataOP->norec = $dataOP->generateNewId();
            //                $dataOP->kdprofile = 0;
            //                $dataOP->statusenabled = true;
            //                $dataOP->iscito = 0;
            //                $dataOP->noorderfk = $dataSOnorec;
            //                $dataOP->objectprodukfk = $item['produkfk'];
            //                $dataOP->qtyproduk = $item['qtyproduk'];
            //                $dataOP->objectkelasfk = $item['objectkelasfk'];
            //                $dataOP->qtyprodukretur = 0;
            //                $dataOP->objectruanganfk = $request['objectruanganfk'];
            //                $dataOP->objectruangantujuanfk = $request['objectruangantujuanfk'];
            //                $dataOP->strukorderfk = $dataSOnorec;
            //                $dataOP->keteranganlainnya =  'isPemeriksaanKeluar';
            //                $dataOP->tglpelayanan = date('Y-m-d H:i:s');
            //                $dataOP->strukorderfk = $dataSOnorec;
            //                $dataOP->save();
            //            }
            //
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        if ($transStatus == 'true') {
            $transMessage = 'Sukses';
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "strukorder" => $dataSO,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getOrderKonsul(Request $request)
    {
        $kelTrans = KelompokTransaksi::where('kelompoktransaksi', 'KONSULTASI DOKTER')->first();
        $data = \DB::table('strukorder_t as so')
            ->Join('pasiendaftar_t as pd', 'pd.norec', '=', 'so.noregistrasifk')
            ->Join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'so.objectruanganfk')
            ->leftJoin('ruangan_m as rutuju', 'rutuju.id', '=', 'so.objectruangantujuanfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'so.objectpegawaiorderfk')
            ->leftJoin('pegawai_m as pet', 'pet.id', '=', 'so.objectpetugasfk')
            ->leftJoin('antrianpasiendiperiksa_t as apd', 'apd.objectstrukorderfk', '=', 'so.norec')
            ->select(
                'so.norec',
                'so.noorder',
                'so.tglorder',
                'ru.namaruangan as ruanganasal',
                'pg.namalengkap',
                'pet.namalengkap AS pengonsul',
                'rutuju.namaruangan as ruangantujuan',
                'pet.namalengkap as pengonsul',
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'ps.nocm',
                'so.keteranganorder',
                'pd.norec as norec_pd',
                'ps.namapasien',
                'pg.id as pegawaifk',
                'so.objectruangantujuanfk',
                'so.objectruanganfk',
                'apd.norec as norec_apd',
                'so.keteranganlainnya'
            )
            ->where('so.statusenabled', true)
            ->where('so.objectkelompoktransaksifk', $kelTrans->id)
            // ->where(function($q){
            //     $q->wherenull('so.istolak')
            //     ->orwhere('so.istolak', 0);
            // })
            ->orderBy('so.tglorder', 'desc');
        if (isset($request['norecpd']) && $request['norecpd'] != '') {
            $data = $data->where('pd.norec', $request['norecpd']);
        }
        if (isset($request['dokterid']) && $request['dokterid'] != '') {
            $data = $data->where('pg.id', $request['dokterid']);
        }
        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'Inhuman',
        );
        return $this->respond($result);
    }

    public function disabledOrderKonsul(Request $request)
    {
        try {
            $dataSO = StrukOrder::where('norec', $request['norec'])->update(
                ['statusenabled' => false]
            );
            $transStatus = 'true';
        } catch (\Exception $e) {
            //            $transStatus = 'false';
        }
        if ($transStatus == 'true') {
            $transMessage = 'Sukses';
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "strukorder" => $dataSO,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveKonsulFromOrder(Request $request)
    {
        DB::beginTransaction();
        try {
            $pd = PasienDaftar::where('norec', $request['norec_pd'])->first();
            $apd = AntrianPasienDiperiksa::where('noregistrasifk', $request['norec_pd'])->first();
            $dataAPD = new AntrianPasienDiperiksa;
            $dataAPD->norec = $dataAPD->generateNewId();
            $dataAPD->kdprofile = 1;
            $dataAPD->statusenabled = true;
            $dataAPD->objectasalrujukanfk = $apd->objectasalarujukanfk;
            $dataAPD->objectkelasfk = $request['kelasfk'];
            $dataAPD->noantrian = $request['noantrian'];
            $dataAPD->noregistrasifk = $request['norec_pd'];
            $dataAPD->objectpegawaifk = $request['dokterfk'];
            $dataAPD->objectruanganfk = $request['objectruangantujuanfk'];
            $dataAPD->statusantrian = 0;
            $dataAPD->statuspasien = 1;
            $dataAPD->statuskunjungan = 'LAMA';
            $dataAPD->statuspenyakit = 'BARU';
            $dataAPD->objectruanganasalfk = $request['objectruanganasalfk'];;
            $dataAPD->tglregistrasi = $pd->tglregistrasi; //date('Y-m-d H:i:s');
            $dataAPD->tglkeluar = date('Y-m-d H:i:s');
            $dataAPD->tglmasuk = date('Y-m-d H:i:s');
            $dataAPD->objectstrukorderfk = $request['norec_so'];
            $dataAPD->save();

            $dataAPDnorec = $dataAPD->norec;
            $transStatus = 'true';
            $transMessage = "simpan AntrianPasienDiperiksa";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan Gagal";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => $dataAPD,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getRekamMedisAskep(Request $request) {
        $dataRaw = \DB::table('emraskep_t as emrd')
            // ->join('emr_t as emr', 'emr.id', '=', 'emrd.emrfk')
            ->where('emrd.emrfk', $request['emrid'])
            ->where('emrd.statusenabled', '=',true)
            ->select('emrd.*')
            ->orderBy('emrd.nourut');
        $dataRaw = $dataRaw->get();

        $dataraw3A =[];
        $dataraw3B =[];
        $dataraw3C =[];
        $dataraw3D =[];
        foreach ($dataRaw as $dataRaw2) {
            $head = '';
            if ($dataRaw2->kolom == 1){
                $dataraw3A[] = array(
                    'kdprofile' => $dataRaw2->kdprofile,
                    'statusenabled' => $dataRaw2->statusenabled,
                    'kodeexternal'=> $dataRaw2->kodeexternal,
                    'namaexternal' => $dataRaw2->namaexternal,
                    'reportdisplay' => $dataRaw2->reportdisplay,
                    'emrfk' => $dataRaw2->emrfk,
                    'caption' => $head . $dataRaw2->caption ,
                    'type' => $dataRaw2->type,
                    'nourut' => $dataRaw2->nourut,
                    'satuan' => $dataRaw2->satuan,
                    'id' => $dataRaw2->id ,
                    'headfk' => $dataRaw2->headfk ,
                    // 'namaemr' => $dataRaw2->namaemr,
                    'style' => $dataRaw2->style,
                    'cbotable' => $dataRaw2->cbotable,
                    'child' => []
                );
            }elseif ($dataRaw2->kolom == 2){
                $dataraw3B[] = array(
                    'kdprofile' => $dataRaw2->kdprofile,
                    'statusenabled' => $dataRaw2->statusenabled,
                    'kodeexternal'=> $dataRaw2->kodeexternal,
                    'namaexternal' => $dataRaw2->namaexternal,
                    'reportdisplay' => $dataRaw2->reportdisplay,
                    'emrfk' => $dataRaw2->emrfk,
                    'caption' => $head . $dataRaw2->caption ,
                    'type' => $dataRaw2->type,
                    'nourut' => $dataRaw2->nourut,
                    'satuan' => $dataRaw2->satuan,
                    'id' => $dataRaw2->id ,
                    'headfk' => $dataRaw2->headfk ,
                    // 'namaemr' => $dataRaw2->namaemr,
                    'style' => $dataRaw2->style,
                    'cbotable' => $dataRaw2->cbotable,
                    'child' => []
                );
            }elseif($dataRaw2->kolom == 3){
                $dataraw3C[] = array(
                    'kdprofile' => $dataRaw2->kdprofile,
                    'statusenabled' => $dataRaw2->statusenabled,
                    'kodeexternal'=> $dataRaw2->kodeexternal,
                    'namaexternal' => $dataRaw2->namaexternal,
                    'reportdisplay' => $dataRaw2->reportdisplay,
                    'emrfk' => $dataRaw2->emrfk,
                    'caption' => $head . $dataRaw2->caption ,
                    'type' => $dataRaw2->type,
                    'nourut' => $dataRaw2->nourut,
                    'satuan' => $dataRaw2->satuan,
                    'id' => $dataRaw2->id ,
                    'headfk' => $dataRaw2->headfk ,
                    // 'namaemr' => $dataRaw2->namaemr,
                    'style' => $dataRaw2->style,
                    'cbotable' => $dataRaw2->cbotable,
                    'child' => []
                );
            }else{
                $dataraw3D[] = array(
                    'kdprofile' => $dataRaw2->kdprofile,
                    'statusenabled' => $dataRaw2->statusenabled,
                    'kodeexternal'=> $dataRaw2->kodeexternal,
                    'namaexternal' => $dataRaw2->namaexternal,
                    'reportdisplay' => $dataRaw2->reportdisplay,
                    'emrfk' => $dataRaw2->emrfk,
                    'caption' => $head . $dataRaw2->caption ,
                    'type' => $dataRaw2->type,
                    'nourut' => $dataRaw2->nourut,
                    'satuan' => $dataRaw2->satuan,
                    'id' => $dataRaw2->id ,
                    'headfk' => $dataRaw2->headfk ,
                    // 'namaemr' => $dataRaw2->namaemr,
                    'style' => $dataRaw2->style,
                    'cbotable' => $dataRaw2->cbotable,
                    'child' => []
                );
            }

            // $title = $dataRaw2->captionemr;
            $classgrid = $dataRaw2->classgrid;
        }
        function recursiveElements($data)
        {
            $elements = [];
            $tree = [];
            foreach ($data as &$element) {
//                $element['child'] = [];
                $id = $element['id'];
                $parent_id = $element['headfk'];

                $elements[$id] = &$element;
                if (isset($elements[$parent_id])) {
                    $elements[$parent_id]['child'][] = &$element;
                } else {
                    if ($parent_id <= 10) {
                        $tree[] = &$element;
                    }
                }
                //}
            }
            return $tree;
        }


        $dataA = [];
        $dataB = [];
        $dataC = [];
        $dataD = [];
        if (count($dataraw3A) > 0){
            $dataA = recursiveElements($dataraw3A);
        }
        if (count($dataraw3B) > 0){
            $dataB = recursiveElements($dataraw3B);
        }
        if (count($dataraw3C) > 0){
            $dataC = recursiveElements($dataraw3C);
        }
        if (count($dataraw3D) > 0){
            $dataD = recursiveElements($dataraw3D);
        }


        $result = array(
            'kolom1' => $dataA,
            'kolom2' => $dataB,
            'kolom3' => $dataC,
            'kolom4' => $dataD,
            // 'title' => $title,
            'classgrid' => $classgrid,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
    public function getRekamMedisAtuh(Request $request)
    {
        $dataRaw = \DB::table('emrd_t as emrd')
            ->where('emrd.emrfk', $request['emrid'])
            ->where('emrd.statusenabled', '=', true)
            ->select('emrd.*')
            ->orderBy('emrd.nourut');
        $dataRaw = $dataRaw->get();
        $dataTitle = \DB::table('emr_t as emr')
            ->where('emr.id', $request['emrid'])
            ->select('emr.caption as captionemr', 'emr.classgrid', 'emr.namaemr')
            ->get();
        $title = $dataTitle[0]->captionemr;
        $classgrid = $dataTitle[0]->classgrid;
        $namaemr = $dataTitle[0]->namaemr;

        $dataraw3A = [];
        $dataraw3B = [];
        $dataraw3C = [];
        $dataraw3D = [];
        foreach ($dataRaw as $dataRaw2) {
            $head = '';
            if ($dataRaw2->kolom == 1) {
                $dataraw3A[] = array(
                    'kdprofile' => $dataRaw2->kdprofile,
                    'statusenabled' => $dataRaw2->statusenabled,
                    'kodeexternal' => $dataRaw2->kodeexternal,
                    'namaexternal' => $dataRaw2->namaexternal,
                    'reportdisplay' => $dataRaw2->reportdisplay,
                    'emrfk' => $dataRaw2->emrfk,
                    'caption' => $head . $dataRaw2->caption,
                    'type' => $dataRaw2->type,
                    'nourut' => $dataRaw2->nourut,
                    'satuan' => $dataRaw2->satuan,
                    'id' => $dataRaw2->id,
                    'headfk' => $dataRaw2->headfk,
                    'namaemr' => $namaemr,
                    'style' => $dataRaw2->style,
                    'cbotable' => $dataRaw2->cbotable,
                    'child' => []
                );
            } elseif ($dataRaw2->kolom == 2) {
                $dataraw3B[] = array(
                    'kdprofile' => $dataRaw2->kdprofile,
                    'statusenabled' => $dataRaw2->statusenabled,
                    'kodeexternal' => $dataRaw2->kodeexternal,
                    'namaexternal' => $dataRaw2->namaexternal,
                    'reportdisplay' => $dataRaw2->reportdisplay,
                    'emrfk' => $dataRaw2->emrfk,
                    'caption' => $head . $dataRaw2->caption,
                    'type' => $dataRaw2->type,
                    'nourut' => $dataRaw2->nourut,
                    'satuan' => $dataRaw2->satuan,
                    'id' => $dataRaw2->id,
                    'headfk' => $dataRaw2->headfk,
                    'namaemr' => $namaemr,
                    'style' => $dataRaw2->style,
                    'cbotable' => $dataRaw2->cbotable,
                    'child' => []
                );
            } elseif ($dataRaw2->kolom == 3) {
                $dataraw3C[] = array(
                    'kdprofile' => $dataRaw2->kdprofile,
                    'statusenabled' => $dataRaw2->statusenabled,
                    'kodeexternal' => $dataRaw2->kodeexternal,
                    'namaexternal' => $dataRaw2->namaexternal,
                    'reportdisplay' => $dataRaw2->reportdisplay,
                    'emrfk' => $dataRaw2->emrfk,
                    'caption' => $head . $dataRaw2->caption,
                    'type' => $dataRaw2->type,
                    'nourut' => $dataRaw2->nourut,
                    'satuan' => $dataRaw2->satuan,
                    'id' => $dataRaw2->id,
                    'headfk' => $dataRaw2->headfk,
                    'namaemr' => $namaemr,
                    'style' => $dataRaw2->style,
                    'cbotable' => $dataRaw2->cbotable,
                    'child' => []
                );
            } else {
                $dataraw3D[] = array(
                    'kdprofile' => $dataRaw2->kdprofile,
                    'statusenabled' => $dataRaw2->statusenabled,
                    'kodeexternal' => $dataRaw2->kodeexternal,
                    'namaexternal' => $dataRaw2->namaexternal,
                    'reportdisplay' => $dataRaw2->reportdisplay,
                    'emrfk' => $dataRaw2->emrfk,
                    'caption' => $head . $dataRaw2->caption,
                    'type' => $dataRaw2->type,
                    'nourut' => $dataRaw2->nourut,
                    'satuan' => $dataRaw2->satuan,
                    'id' => $dataRaw2->id,
                    'headfk' => $dataRaw2->headfk,
                    'namaemr' => $namaemr,
                    'style' => $dataRaw2->style,
                    'cbotable' => $dataRaw2->cbotable,
                    'child' => []
                );
            }

            //            $title = $dataRaw2->captionemr;
            //            $classgrid = $dataRaw2->classgrid;
        }
        //        $dataA = $dataraw3A;

        function recursiveElements($data)
        {
            $elements = [];
            $tree = [];
            foreach ($data as &$element) {
                //                $element['child'] = [];
                $id = $element['id'];
                $parent_id = $element['headfk'];

                $elements[$id] = &$element;
                if (isset($elements[$parent_id])) {
                    $elements[$parent_id]['child'][] = &$element;
                } else {
                    if ($parent_id <= 10) {
                        $tree[] = &$element;
                    }
                }
                //}
            }
            return $tree;
        }


        $dataA = [];
        $dataB = [];
        $dataC = [];
        $dataD = [];
        if (count($dataraw3A) > 0) {
            $dataA = recursiveElements($dataraw3A);
        }
        if (count($dataraw3B) > 0) {
            $dataB = recursiveElements($dataraw3B);
        }
        if (count($dataraw3C) > 0) {
            $dataC = recursiveElements($dataraw3C);
        }
        if (count($dataraw3D) > 0) {
            $dataD = recursiveElements($dataraw3D);
        }


        $result = array(
            'kolom1' => $dataA,
            'kolom2' => $dataB,
            'kolom3' => $dataC,
            'kolom4' => $dataD,
            'title' => $title,
            'classgrid' => $classgrid,
            'namaemr' => $namaemr,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
    public function getSkala(Request $request){
        $dataProduk= \DB::table('skala_m as skl')
        ->select('id as value','nama as text')
        ->orderBy('skl.id');
 
        $dataProduk = $dataProduk->take(10);
        $dataProduk = $dataProduk->get();

        return $this->respond($dataProduk);
    }
    public function getRekamMedisAtuhPolri(Request $request)
    {
        $dataRaw = \DB::table('emrdpolri_t as emrd')
            ->where('emrd.emrfk', $request['emrid'])
            ->where('emrd.statusenabled', '=', true)
            ->select('emrd.*')
            ->orderBy('emrd.nourut');
        $dataRaw = $dataRaw->get();
        $dataTitle = \DB::table('emr_t as emr')
            ->where('emr.id', $request['emrid'])
            ->select('emr.caption as captionemr', 'emr.classgrid', 'emr.namaemr')
            ->get();
        $title = $dataTitle[0]->captionemr;
        $classgrid = $dataTitle[0]->classgrid;
        $namaemr = $dataTitle[0]->namaemr;

        $dataraw3A = [];
        $dataraw3B = [];
        $dataraw3C = [];
        $dataraw3D = [];
        foreach ($dataRaw as $dataRaw2) {
            $head = '';
            if ($dataRaw2->kolom == 1) {
                $dataraw3A[] = array(
                    'kdprofile' => $dataRaw2->kdprofile,
                    'statusenabled' => $dataRaw2->statusenabled,
                    'kodeexternal' => $dataRaw2->kodeexternal,
                    'namaexternal' => $dataRaw2->namaexternal,
                    'reportdisplay' => $dataRaw2->reportdisplay,
                    'emrfk' => $dataRaw2->emrfk,
                    'caption' => $head . $dataRaw2->caption,
                    'type' => $dataRaw2->type,
                    'nourut' => $dataRaw2->nourut,
                    'satuan' => $dataRaw2->satuan,
                    'id' => $dataRaw2->id,
                    'headfk' => $dataRaw2->headfk,
                    'namaemr' => $namaemr,
                    'style' => $dataRaw2->style,
                    'cbotable' => $dataRaw2->cbotable,
                    'child' => []
                );
            } elseif ($dataRaw2->kolom == 2) {
                $dataraw3B[] = array(
                    'kdprofile' => $dataRaw2->kdprofile,
                    'statusenabled' => $dataRaw2->statusenabled,
                    'kodeexternal' => $dataRaw2->kodeexternal,
                    'namaexternal' => $dataRaw2->namaexternal,
                    'reportdisplay' => $dataRaw2->reportdisplay,
                    'emrfk' => $dataRaw2->emrfk,
                    'caption' => $head . $dataRaw2->caption,
                    'type' => $dataRaw2->type,
                    'nourut' => $dataRaw2->nourut,
                    'satuan' => $dataRaw2->satuan,
                    'id' => $dataRaw2->id,
                    'headfk' => $dataRaw2->headfk,
                    'namaemr' => $namaemr,
                    'style' => $dataRaw2->style,
                    'cbotable' => $dataRaw2->cbotable,
                    'child' => []
                );
            } elseif ($dataRaw2->kolom == 3) {
                $dataraw3C[] = array(
                    'kdprofile' => $dataRaw2->kdprofile,
                    'statusenabled' => $dataRaw2->statusenabled,
                    'kodeexternal' => $dataRaw2->kodeexternal,
                    'namaexternal' => $dataRaw2->namaexternal,
                    'reportdisplay' => $dataRaw2->reportdisplay,
                    'emrfk' => $dataRaw2->emrfk,
                    'caption' => $head . $dataRaw2->caption,
                    'type' => $dataRaw2->type,
                    'nourut' => $dataRaw2->nourut,
                    'satuan' => $dataRaw2->satuan,
                    'id' => $dataRaw2->id,
                    'headfk' => $dataRaw2->headfk,
                    'namaemr' => $namaemr,
                    'style' => $dataRaw2->style,
                    'cbotable' => $dataRaw2->cbotable,
                    'child' => []
                );
            } else {
                $dataraw3D[] = array(
                    'kdprofile' => $dataRaw2->kdprofile,
                    'statusenabled' => $dataRaw2->statusenabled,
                    'kodeexternal' => $dataRaw2->kodeexternal,
                    'namaexternal' => $dataRaw2->namaexternal,
                    'reportdisplay' => $dataRaw2->reportdisplay,
                    'emrfk' => $dataRaw2->emrfk,
                    'caption' => $head . $dataRaw2->caption,
                    'type' => $dataRaw2->type,
                    'nourut' => $dataRaw2->nourut,
                    'satuan' => $dataRaw2->satuan,
                    'id' => $dataRaw2->id,
                    'headfk' => $dataRaw2->headfk,
                    'namaemr' => $namaemr,
                    'style' => $dataRaw2->style,
                    'cbotable' => $dataRaw2->cbotable,
                    'child' => []
                );
            }

            //            $title = $dataRaw2->captionemr;
            //            $classgrid = $dataRaw2->classgrid;
        }
        //        $dataA = $dataraw3A;

        function recursiveElements($data)
        {
            $elements = [];
            $tree = [];
            foreach ($data as &$element) {
                //                $element['child'] = [];
                $id = $element['id'];
                $parent_id = $element['headfk'];

                $elements[$id] = &$element;
                if (isset($elements[$parent_id])) {
                    $elements[$parent_id]['child'][] = &$element;
                } else {
                    if ($parent_id <= 10) {
                        $tree[] = &$element;
                    }
                }
                //}
            }
            return $tree;
        }


        $dataA = [];
        $dataB = [];
        $dataC = [];
        $dataD = [];
        if (count($dataraw3A) > 0) {
            $dataA = recursiveElements($dataraw3A);
        }
        if (count($dataraw3B) > 0) {
            $dataB = recursiveElements($dataraw3B);
        }
        if (count($dataraw3C) > 0) {
            $dataC = recursiveElements($dataraw3C);
        }
        if (count($dataraw3D) > 0) {
            $dataD = recursiveElements($dataraw3D);
        }


        $result = array(
            'kolom1' => $dataA,
            'kolom2' => $dataB,
            'kolom3' => $dataC,
            'kolom4' => $dataD,
            'title' => $title,
            'classgrid' => $classgrid,
            'namaemr' => $namaemr,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
     public function getnorecIGD(Request $request)
    {
        $req = $request->all();
        $icdIX = \DB::table('antrianpasiendiperiksa_t as apd') 
        ->select('apd.norec')
        ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk') 
        ->where('apd.noregistrasifk', '=', $req['norec_pd'])
        ->where('ru.objectdepartemenfk','=', 24);
        $icdIX = $icdIX->get();

        return $this->respond($icdIX);
    }
      public function getnorecruanganlast(Request $request)
    {
        $req = $request->all();
        $icdIX = \DB::table('antrianpasiendiperiksa_t as apd') 
        ->select('apd.norec','ru.namaruangan','apd.objectruanganfk')
        ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk') 
        ->where('apd.noregistrasifk', '=', $req['norec_pd'])
        ->whereNotIn('ru.objectdepartemenfk', [3, 25, 27])
        ->orderby('apd.tglmasuk','desc')
        ->take(1);
        $icdIX = $icdIX->get();

        return $this->respond($icdIX);
    }
     public function getEMRTransaksiDetailPolriUmum(Request $request)
    {
        //todo : detail
        $data = \DB::table('emrpasiend_t as emrdp')
            //            ->join('emrpasien_t as emrp', 'emrp.noemr', '=', 'emrdp.emrpasienfk')
            ->leftjoin('emrdpolri_t as emrd', 'emrd.id', '=', 'emrdp.emrdfk')
            // ->JOIN('emrd_t as emrd',function ($join){
            // $join->on('emrd.id','=','emrdp.emrdfk');
            // $join->on('emrd.emrfk','=','emrdp.emrfk');
            // })
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'emrdp.pegawaifk')
            //->leftjoin('emrfoto_t as ef', 'ef.noemrpasienfk', '=', 'emrp.noemr')
            ->select('emrdp.*', 'emrd.caption', 'emrd.type', 'emrd.nourut', 'emrdp.emrfk', 'emrd.reportdisplay', 'emrd.kodeexternal as kodeex', 'emrd.satuan', 'pg.namalengkap')
            ->where('emrdp.statusenabled', true)
            ->whereIn('emrd.id', [1168, 1169, 1170, 1171, 1172, 1173, 1174, 1175])
            // ->orderBy('emrd.nourut');
            ->orderBy('emrdp.emrdfk', 'asc');
        if (isset($request['noemr']) && $request['noemr'] != '') {
            $data = $data->where('emrdp.emrpasienfk', $request['noemr']);
        }
        if (isset($request['emrfk']) && $request['emrfk'] != '') {
            $data = $data->where('emrdp.emrfk', $request['emrfk']);
        }
        //        if (isset($request['norec']) && $request['norec'] != '') {
        //            $data = $data->where('emrp.norec', $request['norec']);
        //        }
        //        if (isset($request['noregistrasi']) && $request['noregistrasi'] != '') {
        //            $data = $data->where('emrp.noregistrasifk', $request['noregistrasi']);
        //        }
        if (isset($request['objectid']) && $request['objectid'] != '') {
            $data = $data->where('emrdp.emrdfk', $request['objectid']);
        }
        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'as@epic',
        );
    }
    public function getComboDiagnosaPengkajian(Request $request)
    {
        $req = $request->all();
        $icdIX = \DB::table('diagnosa_m as dg')
        ->select('dg.id', DB::raw("dg.kddiagnosa || ' - ' || dg.namadiagnosa as namadiagnosa"))
        ->where('dg.statusenabled', true)
            ->orderBy('dg.kddiagnosa');

        if (
            isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $icdIX = $icdIX
                ->where('dg.namadiagnosa', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%')
                ->orWhere('dg.kddiagnosa', 'ilike', $req['filter']['filters'][0]['value'] . '%');
        }


        $icdIX = $icdIX->take(10);
        $icdIX = $icdIX->get();

        return $this->respond($icdIX);
    }
    public function getVitalSignForPengkajian(Request $request)
    {
        $data = \DB::table('emrpasien_t as ep')
        ->select('ep.noemr')
        ->where('ep.noregistrasifk', $request['noRegistrasi'])
        ->where('ep.emrfk', 147)
            ->orderBy('ep.tglemr', 'desc')
            ->take(1)
            ->get();

        foreach ($data as $item) {
            $detail = \DB::table('emrpasiend_t as epd')
            ->join('emrd_t as ed', 'ed.id', '=', 'epd.emrdfk')
            ->select('epd.value', 'ed.caption')
            ->where('epd.emrpasienfk', $item->noemr)
                ->get();
        }
        return $this->respond($detail);
    }
    public function getMenuRekamMedisAtuh(Request $request)
    {

        $dataRaw = \DB::table('emr_t as emr')
            ->where('emr.statusenabled', true)
            ->where('emr.namaemr', $request['namaemr'])
            ->select('emr.*')
            ->orderBy('emr.nourut');
        $dataRaw = $dataRaw->get();
        foreach ($dataRaw as $dataRaw2) {
            $dataraw3[] = array(
                'id' => $dataRaw2->id,
                'kdprofile' => $dataRaw2->kdprofile,
                'statusenabled' => $dataRaw2->statusenabled,
                'kodeexternal' => $dataRaw2->kodeexternal,
                'namaexternal' => $dataRaw2->namaexternal,
                'reportdisplay' => $dataRaw2->reportdisplay,
                'namaemr' => $dataRaw2->namaemr,
                'caption' => $dataRaw2->caption,
                'headfk' => $dataRaw2->headfk,
                'nourut' => $dataRaw2->nourut
            );
        }
        $data = $dataraw3;

        function recursiveElements($data)
        {
            $elements = [];
            $tree = [];
            foreach ($data as &$element) {
                //                $element['child'] = [];
                $id = $element['id'];
                $parent_id = $element['headfk'];

                $elements[$id] = &$element;
                if (isset($elements[$parent_id])) {
                    $elements[$parent_id]['child'][] = &$element;
                } else {
                    if ($parent_id <= 10) {
                        $tree[] = &$element;
                    }
                }
                //}
            }
            return $tree;
        }

        $data = recursiveElements($data);

        $result = array(
            'data' => $data,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
    public function getMenuRekamMedisAtuhNav(Request $request)
    {

        $data = \DB::table('pasiendaftar_t as pd')
        ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
        ->select('apd.objectruanganfk')
        ->where('pd.noregistrasi', $request['noregistrasi'])
        ->where('pd.statusenabled', true)
            ->where('apd.statusenabled', true)
            ->get();

        $arr = [];

        foreach ($data as $item) {
            array_push($arr, $item->objectruanganfk);
        }

        // return($arr);
        // die();

        $dataRaw = \DB::table('emr_t as emr')
        ->join('mapruangantonavigasiemr_t as mre', 'mre.objectemrfk', '=', 'emr.id')
        ->whereIn('mre.objectruanganfk', $arr)
            ->where('emr.namaemr', $request['namaemr'])
            ->where('emr.statusenabled', true)
            ->where('mre.statusenabled', true)
            ->select(
                'mre.objectdepartemenfk',
                'emr.*',
                DB::raw("CASE WHEN mre.objectdepartemenfk=16 THEN 'RAWAT INAP' WHEN  mre.objectdepartemenfk=18 THEN 'RAWAT JALAN' ELSE 'PENUNJANG' END AS kelompok ")
            )
            ->distinct()
            ->orderBy('kelompok', 'emr.nourut');
        $dataRaw = $dataRaw->get();
        $ini = [];
        // $datas['ranap'] = [];
        // $datas['rajal'] = [];
        // $datas['penunjang'] = [];
        // $ranap = [];
        // $rajal = [];
        // $penunjang = [];
        $datas['igd']['id'] = 2;
        $datas['igd']['caption'] = "IGD";
        $datas['ranap']['id'] = 32;
        $datas['ranap']['caption'] = "RAWAT INAP";
        $datas['rajal']['id'] = 4;
        $datas['rajal']['caption'] = "RAWAT JALAN";
        $datas['penunjang']['id'] = 5;
        $datas['penunjang']['caption'] = "PENUNJANG";
        foreach ($dataRaw as $dataRaw2) {
            if ($dataRaw2->id == 525) {
                // return($dataRaw2->kdprofile);
                // die();
                $datas['history']['id'] = 1;
                $datas['history']['caption'] = "HISTORY";
                $datas['history']['kdprofile'] = $dataRaw2->kdprofile;
                $datas['history']['statusenabled'] = $dataRaw2->statusenabled;
                $datas['history']['kodeexternal'] = $dataRaw2->kodeexternal;
                $datas['history']['namaexternal'] = $dataRaw2->namaexternal;
                $datas['history']['reportdisplay'] = $dataRaw2->reportdisplay;
                $datas['history']['namaemr'] = $dataRaw2->namaemr;
                $datas['history']['caption'] = $dataRaw2->caption;
                $datas['history']['headfk'] = $dataRaw2->headfk;
                $datas['history']['nourut'] = $dataRaw2->nourut;
                $datas['history']['objectdepartemenfk'] = $dataRaw2->objectdepartemenfk;
                $datas['history']['kelompok'] = $dataRaw2->kelompok;
            } else if ($dataRaw2->objectdepartemenfk == 24 && $dataRaw2->id != 525) {
                $igd[] = array(
                    'id' => $dataRaw2->id,
                    'kdprofile' => $dataRaw2->kdprofile,
                    'statusenabled' => $dataRaw2->statusenabled,
                    'kodeexternal' => $dataRaw2->kodeexternal,
                    'namaexternal' => $dataRaw2->namaexternal,
                    'reportdisplay' => $dataRaw2->reportdisplay,
                    'namaemr' => $dataRaw2->namaemr,
                    'caption' => $dataRaw2->caption,
                    'headfk' => $dataRaw2->headfk,
                    'nourut' => $dataRaw2->nourut,
                    'objectdepartemenfk' => $dataRaw2->objectdepartemenfk,
                    'kelompok' => $dataRaw2->kelompok
                );
                $datas['igd']['child'] = $igd;
                // array_push($ini, $datas['ranap']);
            } else if ($dataRaw2->objectdepartemenfk == 16 && $dataRaw2->id != 525) {
                $ranap[] = array(
                    'id' => $dataRaw2->id,
                    'kdprofile' => $dataRaw2->kdprofile,
                    'statusenabled' => $dataRaw2->statusenabled,
                    'kodeexternal' => $dataRaw2->kodeexternal,
                    'namaexternal' => $dataRaw2->namaexternal,
                    'reportdisplay' => $dataRaw2->reportdisplay,
                    'namaemr' => $dataRaw2->namaemr,
                    'caption' => $dataRaw2->caption,
                    'headfk' => $dataRaw2->headfk,
                    'nourut' => $dataRaw2->nourut,
                    'objectdepartemenfk' => $dataRaw2->objectdepartemenfk,
                    'kelompok' => $dataRaw2->kelompok
                );
                $datas['ranap']['child'] = $ranap;
                // array_push($ini, $datas['ranap']);
            } else if ($dataRaw2->objectdepartemenfk == 18 && $dataRaw2->id != 525) {
                $rajal[] = array(
                    'id' => $dataRaw2->id,
                    'kdprofile' => $dataRaw2->kdprofile,
                    'statusenabled' => $dataRaw2->statusenabled,
                    'kodeexternal' => $dataRaw2->kodeexternal,
                    'namaexternal' => $dataRaw2->namaexternal,
                    'reportdisplay' => $dataRaw2->reportdisplay,
                    'namaemr' => $dataRaw2->namaemr,
                    'caption' => $dataRaw2->caption,
                    'headfk' => $dataRaw2->headfk,
                    'nourut' => $dataRaw2->nourut,
                    'objectdepartemenfk' => $dataRaw2->objectdepartemenfk,
                    'kelompok' => $dataRaw2->kelompok
                );
                $datas['rajal']['child'] = $rajal;
            } else if ($dataRaw2->id != 525) {
                $penunjang[] = array(
                    'id' => $dataRaw2->id,
                    'kdprofile' => $dataRaw2->kdprofile,
                    'statusenabled' => $dataRaw2->statusenabled,
                    'kodeexternal' => $dataRaw2->kodeexternal,
                    'namaexternal' => $dataRaw2->namaexternal,
                    'reportdisplay' => $dataRaw2->reportdisplay,
                    'namaemr' => $dataRaw2->namaemr,
                    'caption' => $dataRaw2->caption,
                    'headfk' => $dataRaw2->headfk,
                    'nourut' => $dataRaw2->nourut,
                    'objectdepartemenfk' => $dataRaw2->objectdepartemenfk,
                    'kelompok' => $dataRaw2->kelompok
                );
                $datas['penunjang']['child'] = $penunjang;
            }
        }

        array_push($ini, $datas['history']);
        array_push($ini, $datas['igd']);
        array_push($ini, $datas['ranap']);
        array_push($ini, $datas['rajal']);
        array_push($ini, $datas['penunjang']);
        // if($datas['ranap'] != "undefined") {
        //     array_push($ini, $datas['ranap']);
        // }
        // // return($datas['rajal']);
        // // die();
        // if($datas['rajal'] != "undefined") {
        //     array_push($ini, $datas['rajal']);
        // }
        // if($datas['penunjang'] != "undefined") {
        //     array_push($ini, $datas['penunjang']);
        // }
        // return($ini);
        // die();
        // foreach ($datas as $items) {
        //     array_push($ini, $items);
        // }
        // $data = $ini;

        $result = array(
            'data' => $ini,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
    public function getMenuRekamMedisAtuhv2(Request $request)
    {

        $dataRaw = \DB::table('navigasiemr_s as emr')
        ->where('emr.statusenabled', true)
            ->leftJoin('emr_t as et', 'et.id', '=', 'emr.norecemr')
            // ->where('emr.namaemr', $request['namaemr'])
            ->select('emr.*', 'et.*')
            ->orderBy('emr.nourut', 'desc');
        $dataRaw = $dataRaw->get();
        foreach ($dataRaw as $dataRaw2) {
            $dataraw3[] = array(
                'id' => $dataRaw2->norec,
                'namanavigasi' => $dataRaw2->namanavigasi,
                'reportdisplay' => $dataRaw2->reportdisplay,

                'namaemr' => $dataRaw2->namanavigasi,
                'caption' => $dataRaw2->namanavigasi,
                'norecemr' => $dataRaw2->norecemr
            );
        }
        $data = $dataraw3;



        // function recursiveElements($data)
        // {
        //     $elements = [];
        //     $tree = [];
        //     foreach ($data as &$element) {
        //         //                $element['child'] = [];
        //         $id = $element['id'];
        //         $parent_id = $element['headfk'];

        //         $elements[$id] = &$element;
        //         if (isset($elements[$parent_id])) {
        //             $elements[$parent_id]['child'][] = &$element;
        //         } else {
        //             if ($parent_id <= 10) {
        //                 $tree[] = &$element;
        //             }
        //         }
        //         //}
        //     }
        //     return $tree;
        // }

        // $data = recursiveElements($data);



        //detail1
        $ruanganfk = $request['objectruanganfk'];
        $datadet1 = \DB::table('navigasiemr_detail1_s as emr')
        ->where('emr.statusenabled', true)
            ->leftJoin('emr_t as et', 'et.id', '=', 'emr.norecemr')
            // ->where('emr.objectruanganfk', $ruanganfk)
            ->select('emr.*', 'et.*');
        $datadet1 = $datadet1->get();
        foreach ($datadet1 as $dataRaw21) {
            $datarawdet1[] = array(
                'id' => $dataRaw21->norec,
                'namanavigasi' => $dataRaw21->detailnavigasi,
                'reportdisplay' => $dataRaw21->reportdisplay,
                'norecnavigasi' => $dataRaw21->norecnavigasi,

                'namaemr' => $dataRaw21->detailnavigasi,
                'caption' => $dataRaw21->detailnavigasi,
                'norecemr' => $dataRaw2->norecemr
                // 'headfk' => $dataRaw2->headfk,
                // 'nourut' => $dataRaw2->nourut
            );
        }
        $datadet1 = $datarawdet1;
        // return($request->all);
        // die();
        $datadet2 = \DB::table('navigasiemr_detail2_s as emr')
        ->leftJoin('emr_t as et', 'et.id', '=', 'emr.norecemr')
        ->where('emr.statusenabled', true)
            ->where('emr.objectruanganfk', $ruanganfk)
            ->select('emr.*', 'et.*');
        $datadet2 = $datadet2->get();
        $datarawdet2 = [];
        foreach ($datadet2 as $dataRaw21) {
            $datarawdet2[] = array(
                'id' => $dataRaw21->norec,
                'namanavigasi' => $dataRaw21->detailnavigasi2,
                'reportdisplay' => $dataRaw21->reportdisplay,
                'norecnavigasi1' => $dataRaw21->norecnavigasi1,

                'namaemr' => $dataRaw21->detailnavigasi2,
                'caption' => $dataRaw21->detailnavigasi2,
                'norecemr' => $dataRaw2->norecemr
            );
        }
        $datadet2 = $datarawdet2;

        $result = array(
            'data' => $data,
            'datadet1' => $datarawdet1,
            'datadet2' => $datarawdet2,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
    public function getcombomappingemr(Request $request)
    {

        $dataRaw = \DB::table('navigasiemr_s as emr')
        ->where('emr.statusenabled', true)
            ->select('emr.*')
            ->orderBy('emr.nourut', 'desc')
            ->get();


        //detail1

        $dataRaw2 = \DB::table('navigasiemr_detail1_s as emr')
        ->join('navigasiemr_s as nv', 'nv.norec', '=', 'emr.norecnavigasi')
        ->where('emr.statusenabled', true)
            ->select(DB::raw("emr.norec as norec,nv.namanavigasi' / ' +emr.detailnavigasi as detailnavigasi"))
            // ->select('emr.*')
            ->get();
        $dataemr = \DB::table('emr_t as emr')
        ->where('emr.statusenabled', true)
            ->select('emr.*')
            ->get();




        $result = array(
            'nav1' => $dataRaw,
            'nav2' => $dataRaw2,
            'dataemr' => $dataemr,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
    public function getMenuRekamMedisAtuhGrid(Request $request)
    {

        $dataRaw = \DB::table('emr_t as emr')
            ->where('emr.statusenabled', true)
            ->where('emr.namaemr', $request['namaemr'])
            ->select('emr.*')
            ->orderBy('emr.nourut');
        $dataRaw = $dataRaw->get();
        foreach ($dataRaw as $dataRaw2) {
            $dataraw3[] = array(
                'id' => $dataRaw2->id,
                'kdprofile' => $dataRaw2->kdprofile,
                'statusenabled' => $dataRaw2->statusenabled,
                'kodeexternal' => $dataRaw2->kodeexternal,
                'namaexternal' => $dataRaw2->namaexternal,
                'reportdisplay' => $dataRaw2->reportdisplay,
                'namaemr' => $dataRaw2->namaemr,
                'caption' => $dataRaw2->caption,
                'headfk' => $dataRaw2->headfk,
                'nourut' => $dataRaw2->nourut
            );
        }
        // return($dataraw3);
        // die();
        $data = $dataraw3;

        function recursiveElements($data)
        {
            $elements = [];
            $tree = [];
            foreach ($data as &$element) {
                //                $element['child'] = [];
                $id = $element['id'];
                $parent_id = $element['headfk'];

                $elements[$id] = &$element;
                if (isset($elements[$parent_id])) {
                    $elements[$parent_id]['child'][] = &$element;
                } else {
                    if ($parent_id <= 10) {
                        $tree[] = &$element;
                    }
                }
                //}
            }
            return $tree;
        }

        $data = recursiveElements($data);

        $result = array(
            'data' => $data,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }

    public function SaveTransaksiEMR(Request $request)
    {

        $dataReq = $request->all();

        $head = $dataReq['head'];
        $data = $dataReq['data'];

        //        foreach ($data as $itm){
        //            $dtdt[] = $itm;
        //        }
        //
        //        $keys = array_keys($data);

        DB::beginTransaction();
        try {

            if ($head['norec_emr'] == '-') {

                $noemr = $this->generateCodeEMR(new EMRPasien, 'noemr', 15, 'MR' . date('ym') . '/');
                // return $noemr;
                if ($noemr == '') {
                    $transMessage = "Gagal mengumpukan data, Coba lagi.!";
                    DB::rollBack();
                    $result = array(
                        "status" => 400,
                        "message" => $transMessage,
                        "as" => 'as@epic',
                    );
                    return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                }
                //                $noemr = $this->generateCode(new EMRPasien, 'noemr', 12, 'MR' . $this->getDateTime()->format('ym') . '/');
                //                $noemr = $this->generateCode(new EMRPasien, 'noemr', 14, 'MR' . $this->getDateTime()->format('ym') . '/');

                $EMR = new EMRPasien();
                $norecHead = $EMR->generateNewId();
                $EMR->norec = $norecHead;
                $norecTehMenikitunyaeuy = $norecHead;
                $EMR->norec = $norecTehMenikitunyaeuy;
                $EMR->kdprofile = 11;
                $EMR->statusenabled = 1;
            } else {
                $EMR = EMRPasien::where('noemr', $head['norec_emr'])->first();
                $noemr = $EMR->noemr;
            }
            $EMR->noemr = $noemr;
            $EMR->emrfk = $head['emrfk'];
            if (isset($head['norec_pd'])) {
                $EMR->noregistrasifk = $head['norec_pd'];
            }
            $EMR->nocm = $head['nocm'];
            $EMR->namapasien = $head['namapasien'];
            $EMR->jeniskelamin = $head['jeniskelamin'];
            if (isset($head['noregistrasi'])) {
                $EMR->noregistrasifk = $head['noregistrasi'];
            }
            $EMR->umur = $head['umur'];
            if (isset($head['kelompokpasien'])) {
                $EMR->kelompokpasien = $head['kelompokpasien'];
            }
            if (isset($head['tglregistrasi'])) {
                $EMR->tglregistrasi = $head['tglregistrasi'];
            }
            if (isset($head['norec'])) {
                $EMR->norec_apd = $head['norec'];
            }
            if (isset($head['namakelas'])) {
                $EMR->namakelas = $head['namakelas'];
            }
            if (isset($head['namaruangan'])) {
                $EMR->namaruangan = $head['namaruangan'];
            } else {
                $EMR->namaruangan = "Triage Gawat Darurat";
            }
            if (isset($head['tgllahir'])) {
                $EMR->tgllahir = $head['tgllahir'];
            }
            if (isset($head['notelepon'])) {
                $EMR->notelepon = $head['notelepon'];
            }
            if (isset($head['alamatlengkap'])) {
                $EMR->alamat = $head['alamatlengkap'];
            }
            if (isset($head['jenisemr'])) {
                $EMR->jenisemr = $head['jenisemr'];
            }
            $EMR->pegawaifk = $this->getCurrentUserID();
            $EMR->tglemr = $this->getDateTime()->format('Y-m-d H:i:s');
            $EMR->save();

            $norec_EMR = $EMR->noemr;

            $EMRDelete = EMRPasienD::where('emrpasienfk', $norec_EMR)
                ->where('emrfk', $head['emrfk'])
                ->update([
                    'statusenabled' => false
                ]);
            $i = 0;
            //            foreach ($keys as $ky) {
            //                $emrdfk = $ky;
            //                $valueemr = $dtdt[$i];
            foreach ($data as $item) {
                $emrdfk = $item['id'];
                if (is_array($item['values'])) {
                    $valueemr = $item['values']['value'] . '~' . $item['values']['text'];
                } else {
                    $valueemr = $item['values'];
                }

                $EMRD = new EMRPasienD();
                $norecD = $EMRD->generateNewId();
                $EMRD->norec = $norecD;
                $EMRD->kdprofile = 1;
                $EMRD->statusenabled = 1;
                $EMRD->emrpasienfk = $norec_EMR;
                $EMRD->value = $valueemr;
                $EMRD->emrdfk = $emrdfk;
                $EMRD->emrfk = $head['emrfk'];
                $EMRD->pegawaifk = $this->getCurrentUserID();
                $EMRD->tgl = $this->getDateTime()->format('Y-m-d H:i:s');
                $EMRD->save();
                $i = $i + 1;
            }

            if (isset($dataReq['image']) && $dataReq['image'] != null) {
                //egi
                $img = $dataReq['image'];
                $datas = unpack("H*hex", $img);
                $datas = '0x' . $datas['hex'];
                #egi
                $dataGambar = \DB::table('emrfoto_t as tt')
                    ->where('tt.noemrpasienfk', '=', $norec_EMR)
                    ->where('tt.emrfk', '=', $head['emrfk'])
                    ->first();
                //                return $this->respond($noRec);
                if ($dataGambar == '' || $dataGambar == null) {
                    $emrFto = new EmrFoto();
                    $norecFto = $emrFto->generateNewId();
                    $emrFto->norec = $norecFto;
                    $emrFto->kdprofile = 12;
                    $emrFto->statusenabled = 1;
                    $emrFto->noemrpasienfk = $norec_EMR;
                    $emrFto->emrfk = $head['emrfk'];
                } else {
                    $emrFto = EmrFoto::where('noemrpasienfk', $norec_EMR)->first();
                }
                $emrFto->image = \DB::raw("CONVERT(VARBINARY(MAX), $datas)");
                $emrFto->save();
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = 'Saving EMR Pasien ';

        if ($transStatus == 'true') {
            $transMessage = $transMessage . "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => $EMR,
                "data2" => $EMRD,
                //                "keys" => $keys,
                //                "dtdt" => $dtdt,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "data" => $data,
                //                "keys" => $keys,
                //                "dtdt" => $dtdt,
                "as" => 'as@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getEMRTransaksiRiwayat(Request $request)
    {
        //todo : Riwayat
        $data = \DB::table('emrpasien_t as emrp')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'emrp.pegawaifk')
            ->leftJoin('pegawai_m as pg2', 'pg2.id', '=', 'emrp.dokterfk')
            ->leftJoin('pegawai_m as pg3', 'pg3.id', '=', 'emrp.notifikasifk')
            ->select('emrp.*', 'emrp.noregistrasifk as noregistrasi', 'pg.namalengkap', 'pg2.namalengkap as dokter', 'pg3.namalengkap as notifikasi')
            ->where('emrp.statusenabled', true)
            ->orderBy('emrp.tglemr', 'desc');
        if (isset($request['norec_pd']) && $request['norec_pd'] != '') {
            $data = $data->where('emrp.noregistrasifk', $request['norec_pd']);
        }
        if (isset($request['norec_apd']) && $request['norec_apd'] != '') {
            $data = $data->where('emrp.norec_apd', $request['norec_apd']);
        }
        if (isset($request['nocm']) && $request['nocm'] != '') {
            $data = $data->where('emrp.nocm', $request['nocm']);
        }
        if (isset($request['noregistrasi']) && $request['noregistrasi'] != '') {
            $data = $data->where('emrp.noregistrasifk', $request['noregistrasi']);
        }
        if (isset($request['tgllahir']) && $request['tgllahir'] != "" && $request['tgllahir'] != "undefined" && $request['tgllahir'] != "null") {
            $tgllahir = $request['tgllahir'];
            $data = $data->whereRaw("format( emrp.tgllahir, 'yyyy-MM-dd')  ='$tgllahir' ");
        }
        if (isset($request['namapasien']) && $request['namapasien'] != '') {
            $data = $data->where('emrp.namapasien', $request['namapasien']);
        }
        if (isset($request['jenisEmr']) && $request['jenisEmr'] != '') {
            // $data = $data->where('emrp.jenisemr', 'ilike', '%' . $request['jenisEmr'] . '%');
            $data = $data->where('emrp.jenisemr', '=',  $request['jenisEmr'] );
        } else {
            $data = $data->whereNull('emrp.jenisemr');
        }
        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'as@epic',
        );
        return $this->respond($result);
    }

    
    public function getEMRTransaksiRiwayatCheck(Request $request)
    {
        //todo : Riwayat
        $data = \DB::table('emrpasien_t as emrp')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'emrp.pegawaifk')
            ->leftJoin('pegawai_m as pg2', 'pg2.id', '=', 'emrp.dokterfk')
            ->leftJoin('pegawai_m as pg3', 'pg3.id', '=', 'emrp.notifikasifk')
            ->select('emrp.*', 'emrp.noregistrasifk as noregistrasi', 'pg.namalengkap', 'pg2.namalengkap as dokter', 'pg3.namalengkap as notifikasi')
            ->where('emrp.statusenabled', true)
            ->orderBy('emrp.tglemr', 'desc');
            if (isset($request['norec_pd']) && $request['norec_pd'] != '') {
                $data = $data->where('emrp.noregistrasifk', $request['norec_pd']);
            }
            if (isset($request['norec_apd']) && $request['norec_apd'] != '') {
                $data = $data->where('emrp.norec_apd', $request['norec_apd']);
            }
            if (isset($request['nocm']) && $request['nocm'] != '') {
                $data = $data->where('emrp.nocm', $request['nocm']);
            }
            if (isset($request['noregistrasi']) && $request['noregistrasi'] != '') {
                $data = $data->where('emrp.noregistrasifk', $request['noregistrasi']);
            }
            if (isset($request['tgllahir']) && $request['tgllahir'] != "" && $request['tgllahir'] != "undefined" && $request['tgllahir'] != "null") {
                $tgllahir = $request['tgllahir'];
                $data = $data->whereRaw("format( emrp.tgllahir, 'yyyy-MM-dd')  ='$tgllahir' ");
            }
            if (isset($request['namapasien']) && $request['namapasien'] != '') {
                $data = $data->where('emrp.namapasien', $request['namapasien']);
            }
            if (isset($request['jenisEmr']) && $request['jenisEmr'] != '') {
                $data = $data->where('emrp.jenisemr', 'ilike', '%' . $request['jenisEmr'] . '%');
            } else {
                $data = $data->whereNull('emrp.jenisemr');
            }
            $data = $data->get();
            // return($data);
            // die();
            $result = array(
            'data' => $data,
            'message' => 'as@epic',
        );
        return $this->respond($result);
    }

    public function getEMRTransaksiDetail(Request $request)
    {
        //todo : detail
        $data = \DB::table('emrpasiend_t as emrdp')
            //            ->join('emrpasien_t as emrp', 'emrp.noemr', '=', 'emrdp.emrpasienfk')
            ->leftjoin('emrd_t as emrd', 'emrd.id', '=', 'emrdp.emrdfk')
            // ->JOIN('emrd_t as emrd',function ($join){
            // $join->on('emrd.id','=','emrdp.emrdfk');
            // $join->on('emrd.emrfk','=','emrdp.emrfk');
            // })
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'emrdp.pegawaifk')
            //->leftjoin('emrfoto_t as ef', 'ef.noemrpasienfk', '=', 'emrp.noemr')
            ->select('emrdp.*', 'emrd.caption', 'emrd.type', 'emrd.nourut', 'emrdp.emrfk', 'emrd.reportdisplay', 'emrd.kodeexternal as kodeex', 'emrd.satuan', 'pg.namalengkap')
            ->where('emrdp.statusenabled', true)
            ->orderBy('emrd.nourut');
        if (isset($request['noemr']) && $request['noemr'] != '') {
            $data = $data->where('emrdp.emrpasienfk', $request['noemr']);
        }
        if (isset($request['emrfk']) && $request['emrfk'] != '') {
            $data = $data->where('emrdp.emrfk', $request['emrfk']);
        }
        //        if (isset($request['norec']) && $request['norec'] != '') {
        //            $data = $data->where('emrp.norec', $request['norec']);
        //        }
        //        if (isset($request['noregistrasi']) && $request['noregistrasi'] != '') {
        //            $data = $data->where('emrp.noregistrasifk', $request['noregistrasi']);
        //        }
        if (isset($request['objectid']) && $request['objectid'] != '') {
            $data = $data->where('emrdp.emrdfk', $request['objectid']);
        }
        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'as@epic',
        );
        return $this->respond($result);
    }
    public function getEMRTransaksiDetailaskep(Request $request)
    {
        //todo : detail
        $data = \DB::table('emrpasiend_t as emrdp')
            //            ->join('emrpasien_t as emrp', 'emrp.noemr', '=', 'emrdp.emrpasienfk')
            ->leftjoin('emraskep_t as emrd', 'emrd.id', '=', 'emrdp.emrdfk')
            // ->JOIN('emrd_t as emrd',function ($join){
            // $join->on('emrd.id','=','emrdp.emrdfk');
            // $join->on('emrd.emrfk','=','emrdp.emrfk');
            // })
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'emrdp.pegawaifk')
            //->leftjoin('emrfoto_t as ef', 'ef.noemrpasienfk', '=', 'emrp.noemr')
            ->select('emrdp.*', 'emrd.caption', 'emrd.type', 'emrd.nourut', 'emrdp.emrfk', 'emrd.reportdisplay', 'emrd.kodeexternal as kodeex', 'emrd.satuan', 'pg.namalengkap')
            ->where('emrdp.statusenabled', true)
            ->orderBy('emrd.nourut');
        if (isset($request['noemr']) && $request['noemr'] != '') {
            $data = $data->where('emrdp.emrpasienfk', $request['noemr']);
        }
        if (isset($request['emrfk']) && $request['emrfk'] != '') {
            $data = $data->where('emrdp.emrfk', $request['emrfk']);
        }
        //        if (isset($request['norec']) && $request['norec'] != '') {
        //            $data = $data->where('emrp.norec', $request['norec']);
        //        }
        //        if (isset($request['noregistrasi']) && $request['noregistrasi'] != '') {
        //            $data = $data->where('emrp.noregistrasifk', $request['noregistrasi']);
        //        }
        if (isset($request['objectid']) && $request['objectid'] != '') {
            $data = $data->where('emrdp.emrdfk', $request['objectid']);
        }
        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'as@epic',
        );
        return $this->respond($result);
    }

    public function getEMRTransaksiDetailPolri(Request $request)
    {
        //todo : detail
        $data = \DB::table('emrpasiend_t as emrdp')
            //            ->join('emrpasien_t as emrp', 'emrp.noemr', '=', 'emrdp.emrpasienfk')
            ->leftjoin('emrdpolri_t as emrd', 'emrd.id', '=', 'emrdp.emrdfk')
            // ->JOIN('emrd_t as emrd',function ($join){
            // $join->on('emrd.id','=','emrdp.emrdfk');
            // $join->on('emrd.emrfk','=','emrdp.emrfk');
            // })
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'emrdp.pegawaifk')
            //->leftjoin('emrfoto_t as ef', 'ef.noemrpasienfk', '=', 'emrp.noemr')
            ->select('emrdp.*', 'emrd.caption', 'emrd.type', 'emrd.nourut', 'emrdp.emrfk', 'emrd.reportdisplay', 'emrd.kodeexternal as kodeex', 'emrd.satuan', 'pg.namalengkap')
            ->where('emrdp.statusenabled', true)
            // ->orderBy('emrd.nourut');
            ->orderBy('emrdp.emrdfk', 'asc');
        if (isset($request['noemr']) && $request['noemr'] != '') {
            $data = $data->where('emrdp.emrpasienfk', $request['noemr']);
        }
        if (isset($request['emrfk']) && $request['emrfk'] != '') {
            $data = $data->where('emrdp.emrfk', $request['emrfk']);
        }
        //        if (isset($request['norec']) && $request['norec'] != '') {
        //            $data = $data->where('emrp.norec', $request['norec']);
        //        }
        //        if (isset($request['noregistrasi']) && $request['noregistrasi'] != '') {
        //            $data = $data->where('emrp.noregistrasifk', $request['noregistrasi']);
        //        }
        if (isset($request['objectid']) && $request['objectid'] != '') {
            $data = $data->where('emrdp.emrdfk', $request['objectid']);
        }
        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'as@epic',
        );
        return $this->respond($result);
    }
    public function getEMRTransaksiDetailPolrinourut(Request $request)
    {
        //todo : detail
        $data = \DB::table('emrpasiend_t as emrdp')
        //            ->join('emrpasien_t as emrp', 'emrp.noemr', '=', 'emrdp.emrpasienfk')
        ->leftjoin('emrdpolri_t as emrd', 'emrd.id', '=', 'emrdp.emrdfk')
        // ->JOIN('emrd_t as emrd',function ($join){
        // $join->on('emrd.id','=','emrdp.emrdfk');
        // $join->on('emrd.emrfk','=','emrdp.emrfk');
        // })
        ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'emrdp.pegawaifk')
        //->leftjoin('emrfoto_t as ef', 'ef.noemrpasienfk', '=', 'emrp.noemr')
        ->select('emrdp.*', 'emrd.caption', 'emrd.type', 'emrd.nourut', 'emrdp.emrfk', 'emrd.reportdisplay', 'emrd.kodeexternal as kodeex', 'emrd.satuan', 'pg.namalengkap')
        ->where('emrdp.statusenabled', true)
            // ->orderBy('emrd.nourut');
            ->orderBy('emrdp.emrdfk', 'asc');
        if (isset($request['noemr']) && $request['noemr'] != '') {
            $data = $data->where('emrdp.emrpasienfk', $request['noemr']);
        }
        if (isset($request['emrfk']) && $request['emrfk'] != '') {
            $data = $data->where('emrdp.emrfk', $request['emrfk']);
        }
        //        if (isset($request['norec']) && $request['norec'] != '') {
        //            $data = $data->where('emrp.norec', $request['norec']);
        //        }
        //        if (isset($request['noregistrasi']) && $request['noregistrasi'] != '') {
        //            $data = $data->where('emrp.noregistrasifk', $request['noregistrasi']);
        //        }
        if (isset($request['objectid']) && $request['objectid'] != '') {
            $data = $data->where('emrdp.emrdfk', $request['objectid']);
        }
        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'as@epic',
        );
        return $this->respond($result);
    }

    public function getDataComboPegawaiPart(Request $request)
    {
        $req = $request->all();
        $dataProduk = \DB::table('pegawai_m')
            ->select('id as value', 'nama as text')
            ->where('statusenabled', true)
            ->orderBy('nama');
        if (
            isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $dataProduk = $dataProduk->where('nama', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%');
        };
        $dataProduk = $dataProduk->take(10);
        $dataProduk = $dataProduk->get();

        return $this->respond($dataProduk);
    }

    public function getDataComboDokterPart(Request $request)
    {
        $req = $request->all();
        $dataProduk = \DB::table('pegawai_m')
            ->select('id as value', 'namalengkap as text')
            ->where('statusenabled', true)
            ->where('objectjenispegawaifk', 1)
            ->orderBy('namalengkap');
        if (
            isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $dataProduk = $dataProduk->where('namalengkap', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%');
        };
        $dataProduk = $dataProduk->take(10);
        $dataProduk = $dataProduk->get();

        return $this->respond($dataProduk);
    }

    public function getDataComboRuanganPart(Request $request)
    {
        $req = $request->all();
        $dataProduk = \DB::table('ruangan_m')
            ->select('id as value', 'namaruangan as text')
            ->where('statusenabled', true)
            ->orderBy('namaruangan');
        if (
            isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $dataProduk = $dataProduk->where('namaruangan', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%');
        };
        $dataProduk = $dataProduk->take(10);
        $dataProduk = $dataProduk->get();

        return $this->respond($dataProduk);
    }

    public function getDataComboRuanganPelayananPart(Request $request)
    {
        $req = $request->all();
        $dataProduk = \DB::table('ruangan_m')
            ->select('id as value', 'namaruangan as text')
            ->where('statusenabled', true)
            ->wherein('objectdepartemenfk', array(25, 27, 24, 3, 17, 35, 26, 28, 16, 18))
            ->orderBy('objectdepartemenfk');
        if (
            isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $dataProduk = $dataProduk->where('namaruangan', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%');
        };
        $dataProduk = $dataProduk->take(10);
        $dataProduk = $dataProduk->get();

        return $this->respond($dataProduk);
    }

    public function getDataComboDiagnosaPart(Request $request)
    {
        $req = $request->all();
        $data = \DB::table('diagnosa_m')
            ->select('id as value', 'kddiagnosa', 'namadiagnosa as text')
            ->where('statusenabled', true)
            ->orderBy('kddiagnosa');
        if (
            isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $data = $data->where('kddiagnosa', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%');
            $data = $data->orwhere('namadiagnosa', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%');
        };
        $data = $data->take(10);
        $data = $data->get();

        $dt = [];
        foreach ($data as $item) {
            $dt[] = array(
                'value' => $item->value,
                'text' => $item->kddiagnosa . ' ' . $item->text,
            );
        }

        return $this->respond($dt);
    }

    public function getDataComboTindakanPart(Request $request)
    {
        $req = $request->all();
        $data = \DB::table('produk_m as pr')
            ->join('mapruangantoproduk_m as map', 'pr.id', '=', 'map.objectprodukfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'map.objectruanganfk')
            ->select('pr.id as value', 'pr.namaproduk as text')
            ->where('pr.statusenabled', true)
            ->where('ru.objectdepartemenfk', 25)
            ->orderBy('pr.namaproduk');
        if (
            isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $data = $data->where('pr.namaproduk', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%');
        };
        $data = $data->take(10);
        $data = $data->get();

        return $this->respond($data);
    }

    public function getDataComboJKPart(Request $request)
    {
        //        $req=$request->all();
        //        $data  = \DB::table('produk_m as pr')
        //            ->select('pr.id as value','pr.namaproduk as text')
        //            ->where('pr.statusenabled',true)
        //            ->where('ru.objectdepartemenfk',25)
        //            ->orderBy('pr.namaproduk');
        //        if(isset($req['filter']['filters'][0]['value']) &&
        //            $req['filter']['filters'][0]['value']!="" &&
        //            $req['filter']['filters'][0]['value']!="undefined"){
        //            $data = $data->where('pr.namaproduk','ilike','%'. $req['filter']['filters'][0]['value'].'%' );
        //        };
        //        $data = $data->take(10);
        //        $data = $data->get();
        $data[] = array(
            'values' => 1,
            'text' => 'Laki-laki'
        );
        $data[] = array(
            'values' => 2,
            'text' => 'Perempuan'
        );


        return $this->respond($data);
    }
    //Select epd.* from emrpasien_t as ep
    //INNER JOIN emrpasiend_t as epd on epd.emrpasienfk =ep.noemr;
    //
    //select * from emrpasien_t;
    public function getDataDiagnosis(Request $request)
    {
        $noRegistrasi = $request['NorRegistrasi'];
        $dataDiagnosa = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('diagnosapasien_t as dp', 'dp.noregistrasifk', '=', 'apd.norec')
            ->join('detaildiagnosapasien_t as ddp', 'ddp.objectdiagnosapasienfk', '=', 'dp.norec')
            ->join('diagnosa_m as d', 'd.id', '=', 'ddp.objectdiagnosafk')
            ->select('pd.noregistrasi', 'd.kddiagnosa', 'd.namadiagnosa')
            ->where('pd.noregistrasi', $noRegistrasi)
            ->orderBy('d.kddiagnosa')
            ->get();

        $dataDiagnosa1 = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('diagnosatindakanpasien_t as dtp', 'dtp.objectpasienfk', '=', 'apd.norec')
            ->join('detaildiagnosatindakanpasien_t as ddtp', 'ddtp.objectdiagnosatindakanpasienfk', '=', 'dtp.norec')
            ->join('diagnosatindakan_m as dt', 'dt.id', '=', 'ddtp.objectdiagnosatindakanfk')
            ->select('pd.noregistrasi', 'dt.kddiagnosatindakan', 'dt.namadiagnosatindakan')
            ->where('pd.noregistrasi', $noRegistrasi)
            ->orderBy('dt.kddiagnosatindakan')
            ->get();

        $result = array(
            'icd10' => $dataDiagnosa,
            'icd9' => $dataDiagnosa1,
            'message' => 'as@epic',
        );
        return $this->respond($result);
    }

    public function getDataUserResumeMedis(Request $request)
    {
        $noRegistrasi = $request['NorRegistrasi'];
        $data = \DB::table('resumemedis_t as rm ')
            ->leftjoin('logginguser_t as lg', 'lg.noreff', '=', 'rm.norec')
            ->leftjoin('loginuser_s as lu', 'lu.id', '=', 'lg.objectloginuserfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'lu.objectpegawaifk')
            ->select('rm.tglresume', 'pg.id as pegawaifk', 'lu.id as userid', 'lu.namauser', 'pg.namalengkap')
            ->where('rm.norec', $noRegistrasi)
            ->get();

        $result = array(
            'data' => $data,
            'message' => 'as@epic',
        );
        return $this->respond($result);
    }

    public function SaveTransaksiEMROdontogram(Request $request)
    {
        DB::beginTransaction();
        $dataReq = $request->all();
        $head = $dataReq['head'];
        $data = $dataReq['data'];
        //        emrodontogram_t

        try {

            $EMR = EMROdontogram::where('nocm', $head['nocm'])->delete();

            foreach ($data as $item) {
                //                if ($head['norec_emr'] == '-') {
                $noemr = $this->generateCode(new EMROdontogram, 'noemr', 10, 'DG' . $this->getDateTime()->format('ym') . '/');
                $EMR = new EMROdontogram();
                $norecHead = $EMR->generateNewId();
                $EMR->norec = $norecHead;
                $norecTehMenikitunyaeuy = $norecHead;
                $EMR->norec = $norecTehMenikitunyaeuy;
                $EMR->kdprofile = 1;
                $EMR->statusenabled = 1;
                $EMR->noemr = $noemr;
                //                } else {

                $EMR->noregistrasifk = $head['norec_pd'];
                $EMR->nocm = $head['nocm'];
                $EMR->namapasien = $head['namapasien'];
                $EMR->jeniskelamin = $head['jeniskelamin'];
                $EMR->noregistrasi = $head['noregistrasi'];
                $EMR->umur = $head['umur'];
                $EMR->kelompokpasien = $head['kelompokpasien'];
                $tglregistrasi = date('Y-m-d H:i:s', strtotime($head['tglregistrasi'])); //;
                $EMR->tglregistrasi = $tglregistrasi;
                $EMR->norec_apd = $head['norec'];
                $EMR->namakelas = $head['namakelas'];
                $EMR->namaruangan = $head['namaruangan'];
                $EMR->tglemr = $this->getDateTime()->format('Y-m-d H:i:s');

                $EMR->colour = $item['colour'];
                $EMR->width = $item['width'];
                $EMR->height = $item['height'];
                $EMR->top = $item['top'];
                $EMR->left = $item['left'];
                $EMR->id = $item['id'];
                $EMR->brs = $item['brs'];
                $EMR->kol = $item['kol'];
                $EMR->seg = $item['seg'];
                $EMR->type = $item['type'];
                $EMR->color = $item['color'];
                $EMR->save();
            }


            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = 'Saving EMR Odontogram Pasien ';

        if ($transStatus == 'true') {
            $transMessage = $transMessage . "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => $EMR,
                //                "data2" => $EMRD,
                //                "keys" => $keys,
                //                "dtdt" => $dtdt,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "data" => $data,
                //                "keys" => $keys,
                //                "dtdt" => $dtdt,
                "as" => 'as@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDataOdontogram(Request $request)
    {
        //        $noRegistrasi = $request['noregistrasi'];
        $data = \DB::table('emrodontogram_t as emr')
            ->select(
                'emr.colour',
                'emr.width',
                'emr.height',
                'emr.top',
                'emr.left',
                'emr.id',
                'emr.brs',
                'emr.kol',
                'emr.seg',
                'emr.type',
                'emr.color'
            )
            ->where('emr.nocm', $request['nocm'])
            ->get();

        foreach ($data as $itm) {
            $dt2[] = array(
                'colour' => $itm->colour,
                'width' => (int)$itm->width,
                'height' => (int)$itm->height,
                'top' => (int)$itm->top,
                'left' => (int)$itm->left,
                'id' => (int)$itm->id,
                'brs' => (int)$itm->brs,
                'kol' => (int)$itm->kol,
                'seg' => (int)$itm->seg,
                'type' => $itm->type,
                'color' => $itm->color
            );
        }

        $result = array(
            'data' => $dt2,
            'message' => 'as@epic',
        );
        return $this->respond($result);
        //        return Response::json($result, 200, [], JSON_NUMERIC_CHECK);
        //        return response()->json($result)->setEncodingOptions(JSON_NUMERIC_CHECK);
    }

    public function getDaftarDokumenRekamMedis(Request $request)
    {
        $filter = $request->all();
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->join('alamat_m as alm', 'alm.nocmfk', '=', 'ps.id')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftJoin('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            ->leftjoin('batalregistrasi_t as br', 'br.pasiendaftarfk', '=', 'pd.norec')
            ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            //			->leftjoin('kendalidokumenrekammedis_t as ken', 'ken.noregistrasifk', '=', 'pd.norec')
            //			->leftjoin('statuskendalidokumen_m as ss', 'ss.id', '=', 'ken.objectstatuskendalidokumenfk')
            ->select(
                'pd.norec',
                'pd.statusenabled',
                'pd.tglregistrasi',
                'ps.nocm',
                'pd.nocmfk',
                'pd.noregistrasi',
                'ru.namaruangan',
                'ps.namapasien',
                'kp.kelompokpasien',
                'pg.namalengkap as namadokter',
                'pd.tglpulang',
                'pd.statuspasien',
                'pd.objectpegawaifk as pgid',
                'pd.objectruanganlastfk',
                'br.norec as norec_br',
                'pd.nostruklastfk',
                'jk.jeniskelamin',
                'alm.alamatlengkap',
                'pg.namalengkap',
                'ps.tgllahir'
            )
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
        $data = $data->groupBy(
            'pd.norec',
            'pd.statusenabled',
            'pd.tglregistrasi',
            'ps.nocm',
            'pd.nocmfk',
            'pd.noregistrasi',
            'ru.namaruangan',
            'ps.namapasien',
            'kp.kelompokpasien',
            'pg.namalengkap',
            'pd.tglpulang',
            'pd.statuspasien',
            'pd.objectpegawaifk',
            'pd.objectruanganlastfk',
            'br.norec',
            'pd.nostruklastfk',
            'jk.jeniskelamin',
            'alm.alamatlengkap',
            'ps.tgllahir'
        );
        $data = $data->get();
        $datafix = [];
        foreach ($data as $item) {
            $kendali = \DB::table('kendalidokumenrekammedis_t as ken')
                ->join('statuskendalidokumen_m as ss', 'ss.id', '=', 'ken.objectstatuskendalidokumenfk')
                ->select('ken.*', 'ss.name')
                ->where('noregistrasifk', $item->norec);
            if (isset($filter['diterima']) && $filter['diterima'] != "" && $filter['diterima'] != "undefined" && $filter['diterima'] != "false") {
                $kendali = $kendali->where('ss.name', 'ilike', '%terima%');
            }
            if (isset($filter['dikirim']) && $filter['dikirim'] != "" && $filter['dikirim'] != "undefined" && $filter['dikirim'] != "false") {
                $kendali = $kendali->where('ss.name', 'ilike', '%kirim%');
            }
            $kendali = $kendali->get();

            $datafix[] = array(
                'norec' => $item->norec,
                'tglregistrasi' => $item->tglregistrasi,
                'nocm' => $item->nocm,
                'nocmfk' => $item->nocmfk,
                'noregistrasi' => $item->noregistrasi,
                'namaruangan' => $item->namaruangan,
                'namapasien' => $item->namapasien,
                'kelompokpasien' => $item->kelompokpasien,
                'namadokter' => $item->namadokter,
                'tglpulang' => $item->tglpulang,
                'statuspasien' => $item->statuspasien,
                'pgid' => $item->pgid,
                'objectruanganlastfk' => $item->objectruanganlastfk,
                'norec_br' => $item->norec_br,
                'jeniskelamin' => $item->jeniskelamin,
                'alamatlengkap' => $item->alamatlengkap,
                'tgllahir' => $item->tgllahir,
            );
        }

        return $this->respond($datafix);
    }

    public function getComboDokRekMed(Request $request)
    {
        $dataInstalasi = \DB::table('departemen_m as dp')
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
        $dataRuanganrak = \DB::table('ruangan_m as ru')
            ->where('ru.id', 469)
            ->orderBy('ru.namaruangan')
            ->get();
        $result = array(
            'departemen' => $dataDepartemen,
            'ruanganrak' => $dataRuanganrak,
            'ruangan' => $dataRuangan,
            'message' => 'ramdanegie',
        );

        return $this->respond($result);
    }

    public function saveDokumenRekamMedis(Request $request)
    {

        DB::beginTransaction();
        try {
            $status = \DB::table('statuskendalidokumen_m')
                ->where('name', 'ilike', '%' . $request['statuskendali'] . '%')->first();
            if ($request['statuskendali'] == 'pinjam') {
                foreach ($request['pasien'] as $item) {
                    if ($request['norec_kdr'] == '') {
                        $newKDR = new KendaliDokumenRekamMedis();
                        $norec = $newKDR->generateNewId();
                        $newKDR->norec = $norec;
                        $newKDR->kdprofile = 0;
                        $newKDR->statusenabled = true;
                    } else {
                        $newKDR = KendaliDokumenRekamMedis::where('norec', $request['norec_kdr'])->first();
                    }

                    $newKDR->objectruanganasalfk = $item['objectruanganlastfk'];
                    $newKDR->objectruangantujuanfk = $item['objectruanganlastfk'];
                    $newKDR->nocmfk = $item['nocmfk'];
                    $newKDR->objectstatuskendalidokumenfk = $status->id;
                    $newKDR->tglupdate = date('Y-m-d H:i:s');
                    if (isset($request['tglkeluar'])) {
                        $newKDR->tglkeluar = $request['tglkeluar'];
                    }
                    if (isset($request['tglkembali'])) {
                        $newKDR->tglkembali = $request['tglkembali'];
                    }
                    $newKDR->catatan = $request['keterangan'];
                    $newKDR->noregistrasifk = $item['norec'];
                    $newKDR->pegawaifk = $request['pegawaifk'];
                    $newKDR->save();
                }
            }
            if ($request['statuskendali'] == 'kirim') {
                foreach ($request['pasien'] as $item) {
                    if ($request['norec_kdr'] == '') {
                        $newKDR = new KendaliDokumenRekamMedis();
                        $norec = $newKDR->generateNewId();
                        $newKDR->norec = $norec;
                        $newKDR->kdprofile = 0;
                        $newKDR->statusenabled = true;
                    } else {
                        $newKDR = KendaliDokumenRekamMedis::where('norec', $request['norec_kdr'])->first();
                    }

                    $newKDR->objectruanganasalfk = $item['objectruanganlastfk'];
                    $newKDR->objectruangantujuanfk = $request['ruangantujuanfk'];
                    $newKDR->nocmfk = $item['nocmfk'];
                    $newKDR->objectstatuskendalidokumenfk = $status->id;
                    $newKDR->tglupdate = date('Y-m-d H:i:s');
                    if (isset($request['tglkeluar'])) {
                        $newKDR->tglkeluar = $request['tglkeluar'];
                    }
                    if (isset($request['tglkembali'])) {
                        $newKDR->tglkembali = $request['tglkembali'];
                    }
                    $newKDR->catatan = $request['keterangan'];
                    $newKDR->noregistrasifk = $item['norec'];
                    $newKDR->pegawaifk = $request['pegawaifk'];
                    $newKDR->save();
                }
            }

            if ($request['statuskendali'] == 'terima') {
                foreach ($request['pasien'] as $item) {
                    if ($request['norec_kdr'] == '') {
                        $newKDR = new KendaliDokumenRekamMedis();
                        $norec = $newKDR->generateNewId();
                        $newKDR->norec = $norec;
                        $newKDR->kdprofile = 0;
                        $newKDR->statusenabled = true;
                    } else {
                        $newKDR = KendaliDokumenRekamMedis::where('norec', $request['norec_kdr'])->first();
                    }

                    $newKDR->objectruanganasalfk = $item['objectruanganlastfk'];
                    $newKDR->objectruangantujuanfk = $request['ruanganterimafk'];
                    $newKDR->nocmfk = $item['nocmfk'];
                    $newKDR->objectstatuskendalidokumenfk = $status->id;
                    $newKDR->tglupdate = date('Y-m-d H:i:s');
                    if (isset($request['tglkeluar'])) {
                        $newKDR->tglkeluar = $request['tglkeluar'];
                    }
                    if (isset($request['tglkembali'])) {
                        $newKDR->tglkembali = $request['tglkembali'];
                    }
                    $newKDR->catatan = $request['keterangan'];
                    $newKDR->noregistrasifk = $item['norec'];
                    $newKDR->pegawaifk = $request['pegawaifk'];
                    $newKDR->save();
                }
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'data' => $newKDR,
                'as' => 'ramdanegie',
            );
        } else {
            $transMessage = "Data Gagal Disimpan";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'data' => $newKDR,
                'as' => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getHistoriDokumenRekmed(Request $request, $nocm)
    {
        $data = \DB::table('kendalidokumenrekammedis_t as ken')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'ken.noregistrasifk')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'ken.objectruanganasalfk')
            ->leftJoin('ruangan_m as ru2', 'ru2.id', '=', 'ken.objectruangantujuanfk')
            ->leftJoin('statuskendalidokumen_m as st', 'st.id', '=', 'ken.objectstatuskendalidokumenfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'ken.pegawaifk')
            ->leftJoin('pasien_m as ps', 'ps.id', '=', 'ken.nocmfk')
            ->select(
                'ken.*',
                'ru.namaruangan as ruanganasal',
                'ru2.namaruangan as ruangantujuan',
                'st.name as status',
                'pg.namalengkap',
                'pd.noregistrasi'
            )
            ->where('ken.statusenabled', true)
            ->where('ps.nocm', '=', $nocm)
            ->orderBy('ken.tglupdate', 'desc')
            ->get();


        $result = array(
            'data' => $data,
            'message' => 'ramdanegie',
        );

        return $this->respond($result);
    }

    public function getRuanganPart(Request $request)
    {
        $req = $request->all();
        $data = \DB::table('ruangan_m as st')
            ->select('st.id', 'st.namaruangan')
            ->where('st.statusenabled', true)
            ->orderBy('st.namaruangan');
        if (
            isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $data = $data->where('st.namaruangan', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%');
        };
        if (isset($req['namaruangan']) && $req['namaruangan'] != "" && $req['namaruangan'] != "undefined") {
            $data = $data
                ->where('st.namaruangan', 'ilike', '%' . $req['namaruangan'] . '%');
        }
        if (isset($req['idRuangan']) && $req['idRuangan'] != "" && $req['idRuangan'] != "undefined") {
            $data = $data
                ->where('st.id', '=', $req['idRuangan']);
        }
        $data = $data->take(10);
        $data = $data->get();

        return $this->respond($data);
    }

    public function getDaftarDokumenRekamMedisRuangan(Request $request)
    {
        $filter = $request->all();
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftJoin('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            ->leftjoin('batalregistrasi_t as br', 'br.pasiendaftarfk', '=', 'pd.norec')
            ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->leftjoin('kendalidokumenrekammedis_t as ken', 'ken.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('ruangan_m as tuju', 'tuju.id', '=', 'ken.objectruangantujuanfk')
            ->leftjoin('ruangan_m as asal', 'asal.id', '=', 'ken.objectruanganasalfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'ken.pegawaifk')
            ->leftjoin('pegawai_m as pg2', 'pg2.id', '=', 'ken.penerimafk')
            ->leftjoin('statuskendalidokumen_m as ss', 'ss.id', '=', 'ken.objectstatuskendalidokumenfk')
            ->leftJoin('maploginusertoruangan_s as maps', 'maps.objectruanganfk', '=', 'ken.objectruangantujuanfk') //ambil map login
            ->leftJoin('maploginusertoruangan_s as maps2', 'maps2.objectruanganfk', '=', 'ken.objectruanganasalfk') //ambil map login
            ->select(
                'pd.norec',
                'pd.tglregistrasi',
                'ps.nocm',
                'pd.nocmfk',
                'pd.noregistrasi',
                'ru.namaruangan',
                'ps.namapasien',
                'kp.kelompokpasien',
                'pg.namalengkap as namadokter',
                'pd.tglpulang',
                'pd.statuspasien',
                'pd.objectpegawaifk as pgid',
                'pd.objectruanganlastfk',
                'br.norec as norec_br',
                'pd.nostruklastfk',
                'jk.jeniskelamin',
                'pg2.namalengkap as penerima',
                'ps.tgllahir',
                'asal.namaruangan as ruangankirim',
                'tuju.namaruangan as ruangantujuan',
                'pg.namalengkap as pengirim',
                'ken.tglkembali',
                'ken.tglkeluar',
                'ken.norec as norec_ken',
                'tuju.id as ruangantujuanid',
                'asal.id as ruanganasalid'
            )
            ->whereNull('br.norec');
        if (isset($filter['isTglMasuk']) && $filter['isTglMasuk'] != "" && $filter['isTglMasuk'] != "undefined") {
            if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
                $data = $data->where('pd.tglregistrasi', '>=', $filter['tglAwal']);
            }
            if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
                $data = $data->where('pd.tglregistrasi', '<=', $filter['tglAkhir']);
            }
        }
        if (isset($filter['isTglPulang']) && $filter['isTglPulang'] != "" && $filter['isTglPulang'] != "undefined") {
            if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
                $data = $data->where('pd.tglpulang', '>=', $filter['tglAwal']);
            }
            if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
                $data = $data->where('pd.tglpulang', '<=', $filter['tglAkhir']);
            }
        }
        if (isset($filter['isTglKirim']) && $filter['isTglKirim'] != "" && $filter['isTglKirim'] != "undefined") {
            if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
                $data = $data->where('ken.tglkeluar', '>=', $filter['tglAwal']);
            }
            if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
                $data = $data->where('ken.tglkeluar', '<=', $filter['tglAkhir']);
            }
        }
        if (isset($filter['isTglTerima']) && $filter['isTglTerima'] != "" && $filter['isTglTerima'] != "undefined") {
            if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
                $data = $data->where('ken.tglkembali', '>=', $filter['tglAwal']);
            }
            if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
                $data = $data->where('ken.tglkembali', '<=', $filter['tglAkhir']);
            }
        }

        if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
            $data = $data->where('ru.id', '=', $filter['ruangId']);
        }
        if (isset($filter['ruKirimId']) && $filter['ruKirimId'] != "" && $filter['ruKirimId'] != "undefined") {
            $data = $data->where('ken.objectruanganasalfk', '=', $filter['ruKirimId']);
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
        if (isset($filter['status']) && $filter['status'] != "" && $filter['status'] != "undefined") {
            if ($filter['status'] == '1') {
                $data = $data->wherenull('ken.norec')
                    ->wherenull('maps.norec');
            }
            if ($filter['status'] == '2') {
                $data = $data->where('ss.id', '=', '8')
                    ->where('ss.id', '<>', '9')
                    ->wherenotnull('maps.norec');
            }
            if ($filter['status'] == '3') {
                $data = $data->wherenotnull('maps.norec');
            }
            if ($filter['status'] == '4') {
                $data = $data
                    ->wherenull('ken.tglkembali')
                    ->wherenotnull('maps2.norec');
            }
            if ($filter['status'] == '5') {
                $data = $data->whereNotNull('ken.kembali')
                    ->where('ss.id', '9')
                    ->wherenotnull('maps.norec');
            }
        }

        $data = $data->orderBy('pd.noregistrasi');
        $data = $data->groupBy(
            'pd.norec',
            'pd.tglregistrasi',
            'ps.nocm',
            'pd.nocmfk',
            'pd.noregistrasi',
            'ru.namaruangan',
            'ps.namapasien',
            'kp.kelompokpasien',
            'pg.namalengkap',
            'pd.tglpulang',
            'pd.statuspasien',
            'pg2.namalengkap',
            'pd.objectpegawaifk',
            'pd.objectruanganlastfk',
            'ken.norec',
            'tuju.id',
            'asal.id',
            'br.norec',
            'pd.nostruklastfk',
            'jk.jeniskelamin',
            'ken.tglkembali',
            'ken.tglkeluar',
            'ps.tgllahir',
            'asal.namaruangan',
            'tuju.namaruangan',
            'pg.namalengkap'
        );
        $data = $data->get();
        $res = array(
            'data' => $data,
        );
        return $this->respond($res);
    }

    public function saveDokumenRekamMedisRuangan(Request $request)
    {

        DB::beginTransaction();
        try {
            $status = \DB::table('statuskendalidokumen_m')
                ->where('name', 'ilike', '%' . $request['statuskendali'] . '%')->first();
            if ($request['statuskendali'] == 'terima') {
                foreach ($request['pasien'] as $item) {
                    if ($item['norec_ken'] == '') {
                        $newKDR = new KendaliDokumenRekamMedis();
                        $norec = $newKDR->generateNewId();
                        $newKDR->norec = $norec;
                        $newKDR->kdprofile = 0;
                        $newKDR->statusenabled = true;
                    } else {
                        $newKDR = KendaliDokumenRekamMedis::where('norec', $item['norec_ken'])->first();
                    }

                    $newKDR->objectruanganasalfk = $item['ruanganasalid'];
                    $newKDR->objectruangantujuanfk = $item['ruangantujuanid'];
                    $newKDR->nocmfk = $item['nocmfk'];
                    $newKDR->objectstatuskendalidokumenfk = $status->id;
                    $newKDR->tglupdate = date('Y-m-d H:i:s');
                    //                    if(isset($request['tglkeluar'])){
                    //                        $newKDR->tglkeluar = $request['tglkeluar'];
                    //                    }
                    //                    if(isset($request['tglkembali'])){
                    $newKDR->tglkembali = date('Y-m-d H:i:s');
                    //                    }
                    $newKDR->catatan = $request['keterangan'];
                    $newKDR->noregistrasifk = $item['norec'];
                    $newKDR->penerimafk = $request['pegawaifk'];
                    $newKDR->save();
                }
            }
            if ($request['statuskendali'] == 'kirim') {
                foreach ($request['pasien'] as $item) {
                    if ($item['norec_ken'] == '') {
                        $newKDR = new KendaliDokumenRekamMedis();
                        $norec = $newKDR->generateNewId();
                        $newKDR->norec = $norec;
                        $newKDR->kdprofile = 0;
                        $newKDR->statusenabled = true;
                    } else {
                        $newKDR = KendaliDokumenRekamMedis::where('norec', $item['norec_ken'])->first();
                    }

                    $newKDR->objectruanganasalfk = $item['ruanganasalid'];
                    $newKDR->objectruangantujuanfk = $request['ruangantujuanfk'];
                    $newKDR->nocmfk = $item['nocmfk'];
                    $newKDR->objectstatuskendalidokumenfk = $status->id;
                    $newKDR->tglupdate = date('Y-m-d H:i:s');
                    //                    if(isset($request['tglkeluar'])){
                    //                        $newKDR->tglkeluar = $request['tglkeluar'];
                    //                    }
                    //                    if(isset($request['tglkembali'])){
                    $newKDR->tglkembali = date('Y-m-d H:i:s');
                    //                    }
                    $newKDR->catatan = $request['keterangan'];
                    $newKDR->noregistrasifk = $item['norec'];
                    $newKDR->penerimafk = $request['pegawaifk'];
                    $newKDR->save();
                }
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'data' => $newKDR,
                'as' => 'ramdanegie',
            );
        } else {
            $transMessage = "Data Gagal Disimpan";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'data' => $newKDR,
                'as' => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDataPengakajianICU(Request $request)
    {
        $data = \DB::table('glasgowcdmascale_m as emr')
            ->select('emr.id', 'emr.reportdisplay', 'emr.namagcs')
            ->where('emr.statusenabled', true)
            ->get();

        $data1 = \DB::table('infus_m as emr')
            ->select('emr.id', 'emr.namainfus')
            ->where('emr.statusenabled', true)
            ->get();

        $data2 = \DB::table('jenisvent_m as emr')
            ->select('emr.id', 'emr.namajenisvent')
            ->where('emr.statusenabled', true)
            ->get();

        $result = array(
            'gcs' => $data,
            'infus' => $data1,
            'jenisvent' => $data2,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getDataComboERM(Request $request)
    {
        $viTals = $request['vitalSigns'];
        $VitalSigns = \DB::table('vitalsigns_m as emr')
            ->select('emr.id', 'emr.vitalsigns')
            ->where('emr.statusenabled', true)
            ->get();
        $VitalSigns2 = \DB::table('vitalsigns_m as emr')
            ->select('emr.id', 'emr.vitalsigns')
            ->where('emr.statusenabled', true)
            ->where('emr.kodeexternal','1')
            ->get();

        $VitalSignsSearch = \DB::table('vitalsigns_m as emr')
            ->select('emr.id', 'emr.vitalsigns')
            ->where('emr.statusenabled', true)
            ->where('emr.vitalsigns', 'ilike', '%' . $viTals . '%')
            ->get();

        $KodeGambar = \DB::table('kodegambar_m as kg')
            ->select('kg.id', 'kg.reportdisplay as group', 'kg.kodegambar')
            ->where('kg.statusenabled', true)
            ->orderBy('kg.id', 'asc')
            ->get();

        $result = array(
            'vitalsigns' => $VitalSigns,
            'vitalsign2' => $VitalSigns2,
            'searchvitalsigns' => $VitalSignsSearch,
            'kodegambar' => $KodeGambar,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function SaveTransaksiEMRICU(Request $request)
    {
        DB::beginTransaction();
        $tglAyeuna = date('Y-m-d H:i:s');
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id', $dataLogin['userData']['id'])
            ->first();
        $dataReq = $request->all();
        $dataDetail = $dataReq['details'];
        $norecEMR = "";

        try {
            if ($dataReq['norec'] == '') {
                $dataEMRICU = new RekamMedisICU();
                $dataEMRICU->kdprofile = 0;
                $dataEMRICU->statusenabled = 1;
                $dataEMRICU->norec = $dataEMRICU->generateNewId();
            } else {
                $dataEMRICU = RekamMedisICU::where('norec', $dataReq['norec'])->first();
                $dataEMRICU_D = RekamMedisICUDetail::where('emricufk', $dataReq['norec'])
                    ->delete();
            }
            $dataEMRICU->noregistrasifk = $dataReq['norec_apd'];
            $dataEMRICU->tglemr = $dataReq['tglinput'];
            $dataEMRICU->objectpegawaifk = $dataPegawai->objectpegawaifk;
            $dataEMRICU->save();
            $norecEMR = $dataEMRICU->norec;

            foreach ($dataDetail as $item) {
                $dataEMRICU_D = new RekamMedisICUDetail();
                $dataEMRICU_D->norec = $dataEMRICU_D->generateNewId();
                $dataEMRICU_D->kdprofile = 0;
                $dataEMRICU_D->statusenabled = 1;
                $dataEMRICU_D->emricufk = $norecEMR;
                if (isset($item['keteranganobservasi']) && $item['keteranganobservasi'] != "" && $item['keteranganobservasi'] != "undefined") {
                    $dataEMRICU_D->nilaiobservasi = $item['keteranganobservasi'];
                }
                $dataEMRICU_D->group = $item['group'];
                $dataEMRICU_D->field = $item['field'];
                $dataEMRICU_D->column = $item['desc'];
                $dataEMRICU_D->jam = $item['column'];
                $dataEMRICU_D->save();
            }

            //## Logging User
            $newId = LoggingUser::max('id');
            $newId = $newId + 1;
            $logUser = new LoggingUser();
            $logUser->id = $newId;
            $logUser->norec = $logUser->generateNewId();
            $logUser->kdprofile = 0;
            $logUser->statusenabled = 1;
            $logUser->jenislog = 'Simpan EMR ICU';
            $logUser->noreff = $request['data']['norec'];
            $logUser->referensi = 'norec EMR ICU';
            $logUser->objectloginuserfk = $dataLogin['userData']['id'];
            $logUser->tanggal = $tglAyeuna;
            $logUser->save();


            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = 'Saving EMR ICU';
        }


        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                'message' => $transMessage,
                "norec_emr" => $norecEMR,
                "data_emr" => $dataEMRICU,
                "data_emr_d" => $dataEMRICU_D,
                "as" => 'ea@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                'message' => $transMessage,
                "norec_emr" => $norecEMR,
                "data_emr" => $dataEMRICU,
                "data_emr_d" => $dataEMRICU_D,
                "as" => 'ea@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function SaveEMRIntraAnestesi(Request $request)
    {
        DB::beginTransaction();
        $tglAyeuna = date('Y-m-d H:i:s');
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id', $dataLogin['userData']['id'])
            ->first();
        $dataReq = $request->all();
        $dataDetail = $dataReq['details'];
        $dataIntra = $dataReq['intra'];
        $norecEMR = "";

        // try {
        if ($dataReq['norec'] == '') {
            $dataEMRICU = new RekamMedisICU();
            $dataEMRICU->kdprofile = 0;
            $dataEMRICU->statusenabled = 1;
            $dataEMRICU->norec = $dataEMRICU->generateNewId();
        } else {
            $dataEMRICU = RekamMedisICU::where('norec', $dataReq['norec'])->first();
            $dataEMRICU_D = RekamMedisICUDetail::where('emricufk', $dataReq['norec'])->delete();
            $dataEMRIntraAnestesi = EmrAnestesi::where('emricufk', $dataReq['norec'])
                ->delete();
        }
        $dataEMRICU->noregistrasifk = $dataReq['norec_apd'];
        $dataEMRICU->tglemr = $dataReq['tglinput'];
        $dataEMRICU->objectpegawaifk = $dataPegawai->objectpegawaifk;
        $dataEMRICU->jenisemr = $dataReq['jenisemr'];
        $dataEMRICU->save();
        $norecEMR = $dataEMRICU->norec;

        foreach ($dataDetail as $item) {
            $dataEMRICU_D = new RekamMedisICUDetail();
            $dataEMRICU_D->norec = $dataEMRICU_D->generateNewId();
            $dataEMRICU_D->kdprofile = 0;
            $dataEMRICU_D->statusenabled = 1;
            $dataEMRICU_D->emricufk = $norecEMR;
            $dataEMRICU_D->nilaiobservasi = $item['keteranganobservasi'];
            $dataEMRICU_D->group = $item['group'];
            $dataEMRICU_D->field = $item['field'];
            $dataEMRICU_D->column = $item['desc'];
            $dataEMRICU_D->jam = $item['column'];
            $dataEMRICU_D->save();
        }
        foreach ($dataIntra as $item) {
            $dataEMRIntraAnestesi = new EmrAnestesi();
            $dataEMRIntraAnestesi->norec = $dataEMRIntraAnestesi->generateNewId();
            $dataEMRIntraAnestesi->statusenabled = 1;
            $dataEMRIntraAnestesi->noregistrasi = $dataReq['noregistrasi'];
            $dataEMRIntraAnestesi->nilaiintra = $item['nilaiintra'];
            $dataEMRIntraAnestesi->tanggalintra = $item['tanggalintra'];
            $dataEMRIntraAnestesi->jenisintra = $item['jenisintra'];
            $dataEMRIntraAnestesi->labelintra = $item['labelintra'];
            $dataEMRIntraAnestesi->nilaipasca = $item['nilaipasca'];
            $dataEMRIntraAnestesi->tanggalpasca = $item['tanggalpasca'];
            $dataEMRIntraAnestesi->jenispasca = $item['jenispasca'];
            $dataEMRIntraAnestesi->labelpasca = $item['labelpasca'];
            $dataEMRIntraAnestesi->emricufk = $norecEMR;
            $dataEMRIntraAnestesi->save();
        }

        //## Logging User
        $newId = LoggingUser::max('id');
        $newId = $newId + 1;
        $logUser = new LoggingUser();
        $logUser->id = $newId;
        $logUser->norec = $logUser->generateNewId();
        $logUser->kdprofile = 0;
        $logUser->statusenabled = 1;
        $logUser->jenislog = 'Simpan EMR ICU';
        $logUser->noreff = $request['data']['norec'];
        $logUser->referensi = 'norec EMR ICU';
        $logUser->objectloginuserfk = $dataLogin['userData']['id'];
        $logUser->tanggal = $tglAyeuna;
        $logUser->save();


        $transStatus = 'true';
        // } catch (\Exception $e) {
        //     $transStatus = 'false';
        //     $transMessage = 'Saving EMR ICU';
        // }


        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                'message' => $transMessage,
                "norec_emr" => $norecEMR,
                "data_emr" => $dataEMRICU,
                "data_emr_d" => $dataEMRICU_D,
                "as" => 'ea@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                'message' => $transMessage,
                "norec_emr" => $norecEMR,
                "data_emr" => $dataEMRICU,
                "data_emr_d" => $dataEMRICU_D,
                "as" => 'ea@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function SaveEMRPascaAnestesi(Request $request)
    {
        DB::beginTransaction();
        $tglAyeuna = date('Y-m-d H:i:s');
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id', $dataLogin['userData']['id'])
            ->first();
        $dataReq = $request->all();
        $dataDetail = $dataReq['details'];
        $dataPasca = $dataReq['pasca'];
        $norecEMR = "";

        // try {
        if ($dataReq['norec'] == '') {
            $dataEMRICU = new RekamMedisICU();
            $dataEMRICU->kdprofile = 0;
            $dataEMRICU->statusenabled = 1;
            $dataEMRICU->norec = $dataEMRICU->generateNewId();
        } else {
            $dataEMRICU = RekamMedisICU::where('norec', $dataReq['norec'])->first();
            $dataEMRICU_D = RekamMedisICUDetail::where('emricufk', $dataReq['norec'])->delete();
            $dataEMRPascaAnestesi = EmrAnestesi::where('emricufk', $dataReq['norec'])
                ->delete();
        }
        $dataEMRICU->noregistrasifk = $dataReq['norec_apd'];
        $dataEMRICU->tglemr = $dataReq['tglinput'];
        $dataEMRICU->objectpegawaifk = $dataPegawai->objectpegawaifk;
        $dataEMRICU->jenisemr = $dataReq['jenisemr'];
        $dataEMRICU->save();
        $norecEMR = $dataEMRICU->norec;

        foreach ($dataDetail as $item) {
            $dataEMRICU_D = new RekamMedisICUDetail();
            $dataEMRICU_D->norec = $dataEMRICU_D->generateNewId();
            $dataEMRICU_D->kdprofile = 0;
            $dataEMRICU_D->statusenabled = 1;
            $dataEMRICU_D->emricufk = $norecEMR;
            $dataEMRICU_D->nilaiobservasi = $item['keteranganobservasi'];
            $dataEMRICU_D->group = $item['group'];
            $dataEMRICU_D->field = $item['field'];
            $dataEMRICU_D->column = $item['desc'];
            $dataEMRICU_D->jam = $item['column'];
            $dataEMRICU_D->save();
        }
        foreach ($dataPasca as $item) {
            $dataEMRPascaAnestesi = new EmrAnestesi();
            $dataEMRPascaAnestesi->norec = $dataEMRPascaAnestesi->generateNewId();
            $dataEMRPascaAnestesi->statusenabled = 1;
            $dataEMRPascaAnestesi->noregistrasi = $dataReq['noregistrasi'];
            $dataEMRPascaAnestesi->nilaiintra = $item['nilaiintra'];
            $dataEMRPascaAnestesi->tanggalintra = $item['tanggalintra'];
            $dataEMRPascaAnestesi->jenisintra = $item['jenisintra'];
            $dataEMRPascaAnestesi->labelintra = $item['labelintra'];
            $dataEMRPascaAnestesi->nilaipasca = $item['nilaipasca'];
            $dataEMRPascaAnestesi->tanggalpasca = $item['tanggalpasca'];
            $dataEMRPascaAnestesi->jenispasca = $item['jenispasca'];
            $dataEMRPascaAnestesi->labelpasca = $item['labelpasca'];
            $dataEMRPascaAnestesi->emricufk = $norecEMR;
            $dataEMRPascaAnestesi->save();
        }

        //## Logging User
        $newId = LoggingUser::max('id');
        $newId = $newId + 1;
        $logUser = new LoggingUser();
        $logUser->id = $newId;
        $logUser->norec = $logUser->generateNewId();
        $logUser->kdprofile = 0;
        $logUser->statusenabled = 1;
        $logUser->jenislog = 'Simpan EMR ICU';
        $logUser->noreff = $request['data']['norec'];
        $logUser->referensi = 'norec EMR ICU';
        $logUser->objectloginuserfk = $dataLogin['userData']['id'];
        $logUser->tanggal = $tglAyeuna;
        $logUser->save();


        $transStatus = 'true';
        // } catch (\Exception $e) {
        //     $transStatus = 'false';
        //     $transMessage = 'Saving EMR ICU';
        // }


        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                'message' => $transMessage,
                "norec_emr" => $norecEMR,
                "data_emr" => $dataEMRICU,
                "data_emr_d" => $dataEMRICU_D,
                "as" => 'ea@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                'message' => $transMessage,
                "norec_emr" => $norecEMR,
                "data_emr" => $dataEMRICU,
                "data_emr_d" => $dataEMRICU_D,
                "as" => 'ea@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDataRiwayatERMICU(Request $request)
    {
        $noregPasien = $request['NoRegistrasi'];
        $data_Riwayat = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('rekammedisicu_t as rmi', 'rmi.noregistrasifk', '=', 'apd.norec')
            ->join('pegawai_m as pg', 'pg.id', '=', 'rmi.objectpegawaifk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            // ->join('emrpasien_t as et','et.noemr','=','rmi.nomoremr')
            ->select(DB::raw("pd.norec as norec_pd,rmi.norec,rmi.tglemr,apd.objectruanganfk,ru.namaruangan,
			                  rmi.objectpegawaifk,pg.namalengkap,rmi.nomoremr,rmi.nomoremr as norec_emr"))
            ->where('pd.norec', $noregPasien)
            ->where('rmi.statusenabled', true)
            ->get();

        $result = array(
            'data_riwayat' => $data_Riwayat,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getDataDetailEMRICU(Request $request)
    {
        $norcRMI = $request['NorecRmi'];
        $data = \DB::table('rekammedisicu_t as rmi')
            ->join('rekammedisicud_t as rmid', 'rmid.emricufk', '=', 'rmi.norec')
            ->select(DB::raw("rmid.*"))
            ->where('rmi.norec', $norcRMI)
            ->where('rmi.statusenabled', true)
            ->get();

        $result = array(
            'Details' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getDataRiwayatERMICUDetail(Request $request)
    {
        $noregPasien = $request['NoRegistrasi'];
        $data_Riwayat = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('rekammedisicu_t as rmi', 'rmi.noregistrasifk', '=', 'apd.norec')
            ->join('rekammedisicud_t as rmid', 'rmid.emricufk', '=', 'rmi.norec')
            ->join('pegawai_m as pg', 'pg.id', '=', 'rmi.objectpegawaifk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftJoin('vitalsigns_m as vs', 'vs.id', '=', 'rmid.objectvitalsigns')
            ->select(DB::raw("rmid.*,vs.vitalsigns"))
            ->where('pd.norec', $noregPasien)
            ->where('rmi.statusenabled', true)
            ->get();

        $result = array(
            'data_riwayat' => $data_Riwayat,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getDataPasien($noCmFk)
    {
        $data = \DB::table('pasien_m as pm')
            ->leftJoin('jeniskelamin_m as jk', 'jk.id', '=', 'pm.objectjeniskelaminfk')
            ->leftJoin('alamat_m as alm', 'alm.nocmfk', '=', 'pm.id')
            ->select(DB::raw("getDataRiwayatEMR"))
            ->where('pm.nocm', $noCmFk);

        $data = $data->first();
        $result = array(
            'result' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getDataPasienNew(Request $request)
    {
        $data = \DB::table('pasien_m as pm')
            ->leftJoin('jeniskelamin_m as jk', 'jk.id', '=', 'pm.objectjeniskelaminfk')
            ->leftJoin('alamat_m as alm', 'alm.nocmfk', '=', 'pm.id')
            ->select(DB::raw("pm.id as nocmfk,pm.nocm,pm.namapasien,pm.tgllahir,
			                 pm.objectjeniskelaminfk,jk.jeniskelamin,alm.alamatlengkap,pm.notelepon"))
            ->where('pm.statusenabled', true);

        if (isset($request['idPasien']) && $request['idPasien'] != "" && $request['idPasien'] != "undefined") {
            $data = $data->where('pm.id', '=', $request['idPasien']);
        }
        if (isset($request['noCmPasien']) && $request['noCmPasien'] != "" && $request['noCmPasien'] != "undefined") {
            $data = $data->where('pm.nocm', '=', $request['noCmPasien']);
        }
        $data = $data->first();
        $result = array(
            'result' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getDataComboAsalRujukan(Request $request)
    {
        $req = $request->all();
        $dataProduk = \DB::table('asalrujukan_m')
            ->select('id as value', 'asalrujukan as text')
            ->where('statusenabled', true)
            ->orderBy('id');
        if (
            isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $dataProduk = $dataProduk->where('asalrujukan', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%');
        };
        $dataProduk = $dataProduk->take(10);
        $dataProduk = $dataProduk->get();

        return $this->respond($dataProduk);
    }

    public function getDataComboKelompokpPasien(Request $request)
    {
        $req = $request->all();
        $dataProduk = \DB::table('kelompokpasien_m')
            ->select('id as value', 'kelompokpasien as text')
            ->where('statusenabled', true)
            ->orderBy('id');
        if (
            isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $dataProduk = $dataProduk->where('kelompokpasien', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%');
        };
        $dataProduk = $dataProduk->take(10);
        $dataProduk = $dataProduk->get();
        return $this->respond($dataProduk);
    }

    public function saveRekamMedisPemeriksaanFisik(Request $request)
    {
        DB::beginTransaction();
        $tglAyeuna = date('Y-m-d H:i:s');
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id', $dataLogin['userData']['id'])
            ->first();
        $dataReq = $request->all();
        $norecEMR = "";

        try {

            if ($dataReq['norec'] == '') {
                $dataEMR = new RmPemeriksaanFisik();
                $dataEMR->kdprofile = 11;
                $dataEMR->statusenabled = 1;
                $dataEMR->norec = $dataEMR->generateNewId();
                $dataEMR->nocm = $dataReq['nocm'];
            } else {
                $dataEMR = RmPemeriksaanFisik::where('norec', $dataReq['norec'])->first();
            }
            $dataEMR->gcs = $dataReq['gcs'];
            $dataEMR->eyes = $dataReq['eyes'];
            $dataEMR->verbal = $dataReq['verbal'];
            $dataEMR->motoric = $dataReq['motoric'];
            $dataEMR->total = $dataReq['total'];
            $dataEMR->kepalawajah = $dataReq['kepalawajah'];
            $dataEMR->leher = $dataReq['leher'];
            $dataEMR->thoraksinpeksi = $dataReq['thoraksinpeksi'];
            $dataEMR->thorakspalpasi = $dataReq['thorakspalpasi'];
            $dataEMR->thoraksperkusi = $dataReq['thoraksperkusi'];
            $dataEMR->thoraksauskultasi = $dataReq['thoraksauskultasi'];
            $dataEMR->abdomeninpeksi = $dataReq['abdomeninpeksi'];
            $dataEMR->abdomenauskultasi = $dataReq['abdomenauskultasi'];
            $dataEMR->abdomenpalpasi = $dataReq['abdomenpalpasi'];
            $dataEMR->abdomenperkusi = $dataReq['abdomenperkusi'];
            $dataEMR->anogenital = $dataReq['anogenital'];
            $dataEMR->ekstremitas = $dataReq['ekstremitas'];
            $dataEMR->neurologis = $dataReq['neurologis'];
            $dataEMR->tglemr = $dataReq['tglemr'];
            $dataEMR->objectpegawaifk = $dataPegawai->objectpegawaifk;
            $dataEMR->save();
            $norecEMR = $dataEMR->norec;

            //## Logging User
            $newId = LoggingUser::max('id');
            $newId = $newId + 1;
            $logUser = new LoggingUser();
            $logUser->id = $newId;
            $logUser->norec = $logUser->generateNewId();
            $logUser->kdprofile = 0;
            $logUser->statusenabled = true;
            $logUser->jenislog = 'Input Rekam Medis IGD Pemeriksaan fisik dengan nocm ' . $dataReq['nocm'];
            $logUser->noreff = $norecEMR;
            $logUser->referensi = 'norec rmpemeriksaanfisik';
            $logUser->objectloginuserfk = $dataLogin['userData']['id'];
            $logUser->tanggal = $tglAyeuna;
            $logUser->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Data Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'norec' => $norecEMR,
                'message' => $transMessage,
                'as' => 'ea@epic',
            );
        } else {
            $transMessage = "Simpan Data Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message' => $transMessage,
                'norec' => $norecEMR,
                'as' => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDataRiwayatERMPemeriksaanFisik(Request $request)
    {
        $noregPasien = $request['noCm'];
        $data_Riwayat = RmPemeriksaanFisik::where('nocm', $noregPasien)->get();

        $result = array(
            'data_riwayat' => $data_Riwayat,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getDiagnisaKepIntervensi(Request $request)
    {

        $data = \DB::table('intervensi_m as imp')
            ->join('diagnosakeperawatan_m as dg', 'dg.id', '=', 'imp.objectdiagnosakeperawatanfk')
            ->select('imp.*', 'dg.namadiagnosakep')
            ->where('imp.statusenabled', true);
        if (isset($request['id']) && $request['id'] != '') {
            $data = $data->where('imp.id', $request['id']);
        }

        if (isset($request['name']) && $request['name'] != '') {
            $data = $data->where('imp.name', 'ilike', '%' . $request['name'] . '%');
        }
        if (isset($request['iddiagnosakep']) && $request['iddiagnosakep'] != '') {
            $data = $data->where('imp.objectdiagnosakeperawatanfk', $request['iddiagnosakep']);
        }
        $data = $data->orderBy('imp.id', 'desc');
        $data = $data->take(50);
        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'inhuman',
        );
        return $this->respond($result);
    }

    public function getDiagnisaKepImplemen(Request $request)
    {
        $data = \DB::table('implementasi_m as imp')
            ->join('diagnosakeperawatan_m as dg', 'dg.id', '=', 'imp.objectdiagnosakeperawatanfk')
            ->select('imp.*', 'dg.namadiagnosakep')
            ->where('imp.statusenabled', true);

        if (isset($request['id']) && $request['id'] != '') {
            $data = $data->where('imp.id', $request['id']);
        }

        if (isset($request['name']) && $request['name'] != '') {
            $data = $data->where('imp.name', 'ilike', '%' . $request['name'] . '%');
        }
        if (isset($request['iddiagnosakep']) && $request['iddiagnosakep'] != '') {
            $data = $data->where('imp.objectdiagnosakeperawatanfk', $request['iddiagnosakep']);
        }
        $data = $data->orderBy('imp.id', 'desc');
        $data = $data->take(50);

        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'inhuman',
        );
        return $this->respond($result);
    }

    public function getDiagnisaKepEvaluasi(Request $request)
    {

        $data = \DB::table('evaluasi_m as imp')
            ->join('diagnosakeperawatan_m as dg', 'dg.id', '=', 'imp.objectdiagnosakeperawatanfk')
            ->select('imp.*', 'dg.namadiagnosakep')
            ->where('imp.statusenabled', true);
        if (isset($request['id']) && $request['id'] != '') {
            $data = $data->where('imp.id', $request['id']);
        }

        if (isset($request['name']) && $request['name'] != '') {
            $data = $data->where('imp.name', 'ilike', '%' . $request['name'] . '%');
        }
        if (isset($request['iddiagnosakep']) && $request['iddiagnosakep'] != '') {
            $data = $data->where('imp.objectdiagnosakeperawatanfk', $request['iddiagnosakep']);
        }
        $data = $data->orderBy('imp.id', 'desc');
        $data = $data->take(50);
        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'inhuman',
        );
        return $this->respond($result);
    }

    public function postDetailDiagnoaKep(Request $request, $table, $method)
    {
        DB::beginTransaction();
        try {
            if ($method == 'save') {
                if ($table == 'intervensi') {
                    if ($request['id'] == '') {
                        $RekamMedis = new Intervensi();
                        $RekamMedis->id = Intervensi::max('id') + 1;
                        $RekamMedis->norec = $RekamMedis->generateNewId();
                        $RekamMedis->kdprofile = 11;
                        $RekamMedis->statusenabled = true;
                        $kode = Intervensi::max('kodeexternal');
                        $sub = substr($kode, 7, 3);
                        $kodeEx = $sub + 1;
                        $kodeEx = substr($kode, 0, 7) . $kodeEx;
                        $RekamMedis->kodeexternal = $kodeEx;
                    } else {
                        $RekamMedis = Intervensi::where('id', $request['id'])->first();
                    }
                    $RekamMedis->name = $request['name'];
                    $RekamMedis->objectdiagnosakeperawatanfk = $request['objectdiagnosakeperawatanfk'];
                    $RekamMedis->reportdisplay = $request['name'];
                    $RekamMedis->save();
                }

                if ($table == 'implementasi') {
                    if ($request['id'] == '') {
                        $RekamMedis = new Implementasi();
                        $RekamMedis->id = Implementasi::max('id') + 1;
                        $RekamMedis->norec = $RekamMedis->generateNewId();
                        $RekamMedis->kdprofile = 11;
                        $RekamMedis->statusenabled = true;
                        $kode = Implementasi::max('kodeexternal');
                        $sub = substr($kode, 7, 3);
                        $kodeEx = $sub + 1;
                        $kodeEx = substr($kode, 0, 7) . $kodeEx;
                        $RekamMedis->kodeexternal = $kodeEx;
                    } else {
                        $RekamMedis = Implementasi::where('id', $request['id'])->first();
                    }
                    $RekamMedis->name = $request['name'];
                    $RekamMedis->objectdiagnosakeperawatanfk = $request['objectdiagnosakeperawatanfk'];
                    $RekamMedis->reportdisplay = $request['name'];
                    $RekamMedis->save();
                }
                if ($table == 'evaluasi') {
                    if ($request['id'] == '') {
                        $RekamMedis = new Evaluasi();
                        $RekamMedis->id = Evaluasi::max('id') + 1;
                        $RekamMedis->norec = $RekamMedis->generateNewId();
                        $RekamMedis->kdprofile = 11;
                        $RekamMedis->statusenabled = true;
                        $kode = Evaluasi::max('kodeexternal');
                        $sub = substr($kode, 7, 3);
                        $kodeEx = $sub + 1;
                        $kodeEx = substr($kode, 0, 7) . $kodeEx;
                        $RekamMedis->kodeexternal = $kodeEx;
                    } else {
                        $RekamMedis = Evaluasi::where('id', $request['id'])->first();
                    }
                    $RekamMedis->name = $request['name'];
                    $RekamMedis->objectdiagnosakeperawatanfk = $request['objectdiagnosakeperawatanfk'];
                    $RekamMedis->reportdisplay = $request['name'];
                    $RekamMedis->save();
                }
            }
            if ($method == 'delete') {
                if ($table == 'intervensi') {
                    Intervensi::where('id', $request['id'])->update(
                        ['statusenabled' => false]
                    );
                }

                if ($table == 'implementasi') {
                    Implementasi::where('id', $request['id'])->update(
                        ['statusenabled' => false]
                    );
                }
                if ($table == 'evaluasi') {
                    Evaluasi::where('id', $request['id'])->update(
                        ['statusenabled' => false]
                    );
                }
            }


            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'Inhuman',
            );
        } else {
            $transMessage = "Error";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message' => $transMessage,
                'as' => 'Inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDataRiwayatEMR(Request $request)
    {
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $paramNoRM = '';
        $paramtglLahir = '';
        $paramnamaPasien = '';
        $paramnamaPasien2 = '';
        if (isset($request['norm']) && $request['norm'] != '') {
            $paramNoRM = " AND pm.nocm  LIKE '%" . $request['norm'] . "%'";
        }
        if (isset($request['namaPasien']) && $request['namaPasien'] != '') {
            $paramnamaPasien = " AND pm.namapasien  LIKE '%" . $request['namaPasien'] . "%'";
            $paramnamaPasien2 = " AND ep.namapasien  LIKE '%" . $request['namaPasien'] . "%'";
        }
        if (isset($request['tglLahir']) && $request['tglLahir'] != '') {
            $paramtglLahir = " AND format(pm.tgllahir,'yyyy-MM-dd')  =" . $request['tglLahir'] . "%'";
        }

        $data2 = DB::select(DB::raw("SELECT
                    pm.nocm,
                    pm.namapasien,
                    pm.objectjeniskelaminfk,
                    jk.jeniskelamin,
                    pm.tgllahir,
                    pm.notelepon,
                    alm.alamatlengkap,
                    ep.noemr,
                    ep.tglemr,
                    ep.noregistrasi
                FROM
                    emrpasien_t AS ep
                INNER JOIN pasien_m AS pm ON pm.nocm = ep.nocm
                INNER JOIN alamat_m AS alm ON alm.nocmfk = pm.id
                INNER JOIN jeniskelamin_m AS jk ON jk.id = pm.objectjeniskelaminfk
                WHERE
                    ep.statusenabled = 1
                AND ep.namaruangan = 'Triage Gawat Darurat'
                AND ep.nocm <> '-'
                AND ep.tglemr >= '$tglAwal'
                AND ep.tglemr <= '$tglAkhir'
               $paramNoRM
               $paramtglLahir
               $paramnamaPasien
                UNION ALL
                    SELECT
                        ep.nocm,
                        ep.namapasien,
                        jk.id AS objectjeniskelaminfk,
                        jk.jeniskelamin,
                        ep.tgllahir,
                        ep.notelepon,
                        ep.alamat AS alamatlengkap,
                        ep.noemr,
                        ep.tglemr,
                        ep.noregistrasi
                    FROM
                        emrpasien_t AS ep
                    LEFT JOIN jeniskelamin_m AS jk ON jk.jeniskelamin = ep.jeniskelamin
                LEFT JOIN pasien_m AS pm ON pm.nocm = ep.nocm
                    WHERE
                        ep.statusenabled = 1
                    AND ep.nocm ='-'
                    AND ep.namaruangan = 'Triage Gawat Darurat'
                  
                   $paramtglLahir
                   $paramnamaPasien2
                    ORDER BY
                        ep.tglemr DESC"));
        //        $data = \DB::table('emrpasien_t as ep')
        //            ->leftjoin('pasien_m as pm','pm.nocm','=','ep.nocm')
        //            ->leftJoin('jeniskelamin_m as jk','jk.jeniskelamin','=','ep.jeniskelamin')
        //            ->select('ep.nocm','ep.namapasien','jk.id as objectjeniskelaminfk','jk.jeniskelamin',
        //                     'ep.tgllahir','ep.notelepon','ep.alamat as alamatlengkap','ep.noemr','ep.tglemr','ep.noregistrasi')
        //            ->where('ep.statusenabled',true)
        //            ->where('ep.nocm','=','-')
        ////            ->whereNull('ep.noregistrasi')
        //            ->where('ep.namaruangan','Triage Gawat Darurat');
        //        $data2 = \DB::table('emrpasien_t as ep')
        //            ->join('pasien_m as pm','pm.nocm','=','ep.nocm')
        //            ->join('alamat_m as alm','alm.nocmfk','=','pm.id')
        //            ->join('jeniskelamin_m as jk','jk.id','=','pm.objectjeniskelaminfk')
        //            ->select('pm.nocm','pm.namapasien','pm.objectjeniskelaminfk','jk.jeniskelamin',
        //                     'pm.tgllahir','pm.notelepon','alm.alamatlengkap','ep.noemr','ep.tglemr','ep.noregistrasi')
        //            ->where('ep.statusenabled',true)
        //            ->where('ep.namaruangan','Triage Gawat Darurat')
        //            ->where('ep.nocm','<>','-')
        ////            ->whereNull('ep.noregistrasi')
        //            ->unionAll($data)
        //            ->orderBy('ep.tglemr','desc');

        //        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
        //            $data2 = $data2->where('ep.tglemr', '>=', $request['tglAwal']);
        //        }
        //        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
        //            $tgl = $request['tglAkhir'];//." 23:59:59";
        //            $data2 = $data2->where('ep.tglemr', '<=', $tgl);
        //        }
        //        if(isset($request['norm']) && $request['norm'] != ''){
        //            $data2 = $data2->where('ep.nocm', $request['norm']);
        //        }
        //        if(isset($request['namaPasien']) && $request['namaPasien'] != ''){
        //            $data2 = $data2->where('pm.namapasien','ilike' .'%'.$request['namaPasien'].'%');
        //        }
        //        if(isset($request['tglLahir']) && $request['tglLahir'] != ''){
        //            $data2 = $data2->where('pm.tgllahir',$request['tglLahir']);
        //        }
        //        $data2 = $data2->get();
        $result = array(
            'data' => $data2,
            'message' => 'as@epic',
        );
        return $this->respond($result);
    }

    public function updateNoCmInEmrPasien(Request $request)
    {
        DB::beginTransaction();
        try {
            $dataKelas = Kelas::where('id', $request['kelas'])
                ->where('statusenabled', true)
                ->select('id', 'namakelas')
                ->first();

            if (isset($request['nocm']) || $request['nocm'] != "-" | $request['nocm'] != "") {
                $dataUpt = EMRPasien::where('noemr', $request['noemr'])
                    ->update([
                        'nocm' => $request['nocm'],
                    ]);
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
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
                "message" => $transMessage,
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function updatePdInEmrPasien(Request $request)
    {
        DB::beginTransaction();
        try {
            $dataKelas = Kelas::where('id', $request['kelas'])
                ->where('statusenabled', true)
                ->select('id', 'namakelas')
                ->first();

            $dataKelompokPasien = KelompokPasien::where('id', $request['kelompokpasien'])
                ->where('statusenabled', true)
                ->select('id', 'kelompokpasien')
                ->first();

            //            if ($dataKelas == "" && $dataKelompokPasien ==""){
            if (isset($request['norecpd']) || $request['norecpd'] != "-" | $request['norecpd'] != "") {
                $dataUpt = EMRPasien::where('noemr', $request['noemr'])
                    ->update([
                        'norec_apd' => $request['norecapd'],
                        'noregistrasifk' => $request['norecpd'],
                        'noregistrasi' => $request['noregistrasi'],
                        'kelompokpasien' => $dataKelompokPasien->kelompokpasien,
                        'namakelas' => $dataKelas->namakelas,
                        'tglregistrasi' => $request['tglregistrasi'],
                    ]);
            }
            //            }
            $transStatus = 'true';
        } catch (\Exception $e) {
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
                "message" => $transMessage,
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDataPasienPengkajianMedis(Request $request)
    {
        $data = \DB::table('pasiendaftar_t as pd')
            ->select(DB::raw("pd.tglregistrasi,pd.noregistrasi,pm.nocm,pm.namapasien,ru.namaruangan,
                     CASE WHEN an.anamnesisdokter is not null then an.anamnesisdokter
                     WHEN an.anamnesissuster is not null then an.anamnesissuster
                     ELSE '-' end as anamnesis,
                     CASE WHEN rp.riwayatpengobatan is null then '-'
                     ELSE rp.riwayatpengobatan end AS riwayatpengobatan,
                     CASE WHEN rp.riwayatpenyakit is null then '-'
                     ELSE rp.riwayatpenyakit end as riwayatpenyakit,
                     CASE WHEN pu.pemeriksaanumum is null then '-'
                     ELSE pu.pemeriksaanumum end as pemeriksaanumum,
                     CASE WHEN ed.edukasi is null then '-'
                     ELSE ed.edukasi end as edukasi,
                     CASE WHEN rn.rencana is null then '-'
                     ELSE rn.rencana end as rencana,
                     pp.tglperjanjian,pg.namalengkap as namadokter,
                     ru1.namaruangan as ruangankontrol,pp.keterangan,
                     CASE WHEN cp.s is not NULL then cp.s else '-' end as s,
                     CASE WHEN cp.o is not NULL then cp.o else '-' end as o,
                     CASE WHEN cp.a is not NULL then cp.a else '-' end as a,
                     CASE WHEN cp.p is not NULL then cp.p else '-' end as p"))
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('pasien_m as pm', 'pm.id', '=', 'pd.nocmfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftJoin('anamnesis_t as an', 'an.noregistrasifk', '=', 'apd.norec')
            ->leftJoin('riwayatpengobatan_t as rp', 'rp.noregistrasifk', '=', 'apd.norec')
            ->leftJoin('pemeriksaanumum_t as pu', 'pu.noregistrasifk', '=', 'apd.norec')
            ->leftJoin('edukasi_t as ed', 'ed.noregistrasifk', '=', 'apd.norec')
            ->leftJoin('rencana_t as rn', 'rn.noregistrasifk', '=', 'apd.norec')
            ->leftJoin('pasienperjanjian_t as pp', 'pp.objectpasienfk', '=', 'pm.id')
            ->leftJoin('cppt_t as cp', 'cp.noregistrasifk', '=', 'apd.norec')
            ->leftJoin('ruangan_m as ru1', 'ru1.id', '=', 'pp.objectruanganfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pp.objectdokterfk')
            ->orderBy('pd.tglregistrasi', 'desc')
            ->take(1);

        if (isset($request['noregistrasifk']) && $request['noregistrasifk'] != '') {
            $data = $data->where('rm.noregistrasifk', $request['noregistrasifk']);
        }
        if (isset($request['nocm']) && $request['nocm'] != '') {
            $data = $data->where('ps.nocm', $request['nocm']);
        }
        if (isset($request['noReg']) && $request['noReg'] != '') {
            $data = $data->where('pd.noregistrasi', $request['noReg']);
        }
        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }


    public function getDataPasienPengkajianKeperawatan(Request $request)
    {
        $data = \DB::table('pasiendaftar_t as pd')
            ->select(DB::raw("pd.tglregistrasi,pd.noregistrasi,pm.nocm,pm.namapasien,ru.namaruangan,
                     rm.objectfk,rm.nilai,rm.satuan"))
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('pasien_m as pm', 'pm.id', '=', 'pd.nocmfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftJoin('rekammedis_t as rm', 'rm.noregistrasifk', '=', 'apd.norec')
            ->orderBy('rm.objectfk', 'ASC');

        if (isset($request['noregistrasifk']) && $request['noregistrasifk'] != '') {
            $data = $data->where('rm.noregistrasifk', $request['noregistrasifk']);
        }
        if (isset($request['nocm']) && $request['nocm'] != '') {
            $data = $data->where('ps.nocm', $request['nocm']);
        }
        if (isset($request['noReg']) && $request['noReg'] != '') {
            $data = $data->where('pd.noregistrasi', $request['noReg']);
        }
        if (isset($request['Norec_apd']) && $request['Norec_apd']) {
            $data = $data->where('apd.norec', $request['Norec_apd']);
        }

        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'Inhuman',
        );
        return $this->respond($result);
    }

    public function getDaftarRiwayatRegistrasi(Request $request)
    {
        $data = \DB::table('pasien_m as ps')
            ->join('pasiendaftar_t as pd', 'pd.nocmfk', '=', 'ps.id')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('batalregistrasi_t as br', 'br.pasiendaftarfk', '=', 'pd.norec')
            ->select(DB::raw("pd.tglregistrasi,ps.nocm,pd.noregistrasi,ps.namapasien,pd.objectruanganlastfk,ru.namaruangan,
			                  pd.objectpegawaifk,pg.namalengkap as namadokter,pd.tglpulang,ru.objectdepartemenfk,
			                  CASE when ru.objectdepartemenfk in (16,25,26) then 1 else 0 end as statusinap"))
            ->whereNull('br.pasiendaftarfk');

        //        if(isset($request['tglLahir']) && $request['tglLahir']!="" && $request['tglLahir']!="undefined"){
        //            $data = $data->where('ps.tgllahir','>=', $request['tglLahir'].' 00:00');
        //        };
        //        if(isset($request['tglLahir']) && $request['tglLahir']!="" && $request['tglLahir']!="undefined"){
        //            $data = $data->where('ps.tgllahir','<=', $request['tglLahir'].' 23:59');
        //        };
        if (isset($request['norm']) && $request['norm'] != "" && $request['norm'] != "undefined") {
            $data = $data->where('ps.nocm', 'ilike', '%' . $request['norm'] . '%');
        };
        if (isset($request['namaPasien']) && $request['namaPasien'] != "" && $request['namaPasien'] != "undefined") {
            $data = $data->where('ps.namapasien', 'ilike', '%' . $request['namaPasien'] . '%');
        };
        if (isset($request['noReg']) && $request['noReg'] != "" && $request['noReg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $request['noReg']);
        };
        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
            $data = $data->where('pd.objectruanganlastfk', '=', $request['idRuangan']);
        };

        $data = $data->where('ps.statusenabled', true);
        $data = $data->orderBy('pd.tglregistrasi');
        $data = $data->get();
        $result = array(
            'daftar' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getDaftarPasien(Request $request)
    {
        $data = \DB::table('pasien_m as ps')
            ->leftjoin('alamat_m as alm', 'alm.nocmfk', '=', 'ps.id')
            ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->select(
                'ps.nocm',
                'ps.namapasien',
                'ps.tgldaftar',
                'ps.tgllahir',
                'jk.jeniskelamin',
                'ps.noidentitas',
                'alm.alamatlengkap',
                'ps.id as nocmfk',
                'ps.namaayah',
                'ps.notelepon',
                'ps.nohp',
                'ps.tglmeninggal'
            );
        //        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
        //            $data = $data->where('ps.tgldaftar', '>=', $request['tglAwal']);
        //        }
        //        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
        //            $tgl = $request['tglAkhir'];
        //            $data = $data->where('ps.tgldaftar', '<=', $tgl);
        //        }
        if (isset($request['tglLahir']) && $request['tglLahir'] != "" && $request['tglLahir'] != "undefined") {
            $data = $data->where('ps.tgllahir', '>=', $request['tglLahir'] . ' 00:00');
        };
        if (isset($request['tglLahir']) && $request['tglLahir'] != "" && $request['tglLahir'] != "undefined") {
            $data = $data->where('ps.tgllahir', '<=', $request['tglLahir'] . ' 23:59');
        };
        if (isset($request['norm']) && $request['norm'] != "" && $request['norm'] != "undefined") {
            $data = $data->where('ps.nocm', 'ilike', '%' . $request['norm'] . '%');
            //                ->OrWhere('ps.namapasien', 'ilike', '%'. $request['norm'] .'%');
        };
        if (isset($request['namaPasien']) && $request['namaPasien'] != "" && $request['namaPasien'] != "undefined") {
            $data = $data->where('ps.namapasien', 'ilike', '%' . $request['namaPasien'] . '%');
            //                ->OrWhere('ps.namapasien', 'ilike', '%'. $request['norm'] .'%');
        };
        if (isset($request['alamat']) && $request['alamat'] != "" && $request['alamat'] != "undefined") {
            $data = $data->where('alm.alamatlengkap', 'ilike', '%' . $request['alamat'] . '%');
        };

        if (isset($request['namaAyah']) && $request['namaAyah'] != "" && $request['namaAyah'] != "undefined") {
            $data = $data->where('ps.namaayah', '=', $request['namaAyah']);
        };
        $data = $data->where('ps.statusenabled', true);
        // $data=$data->orderBy('ps.namapasien','asc');
        $data = $data->take(50);
        $data = $data->get();
        $result = array(
            'daftar' => $data,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }

    public function saveOrderPelayanan(Request $request)
    {
        $detLogin = $request->all();
        if ($request['pegawaiorderfk'] == "") {
            $dokter2 = null;
        } else {
            $dokter2 = $request['pegawaiorderfk'];
        }


        DB::beginTransaction();
        try {
            if ($request['departemenfk'] == 3) {
                $noOrder = $this->generateCode(new StrukOrder, 'noorder', 11, 'L' . $this->getDateTime()->format('ym'));
            }
            if ($request['departemenfk'] == 27) {
                $noOrder = $this->generateCode(new StrukOrder, 'noorder', 11, 'R' . $this->getDateTime()->format('ym'));
            }
            if ($request['departemenfk'] == 25) {
                $noOrder = $this->generateCode(new StrukOrder, 'noorder', 11, 'OK' . $this->getDateTime()->format('ym'));
            }
            if ($request['departemenfk'] == 5) {
                $noOrder = $this->generateCode(new StrukOrder, 'noorder', 11, 'PJ' . $this->getDateTime()->format('ym'));
            }
            if ($request['departemenfk'] == 31) {
                $noOrder = $this->generateCode(new StrukOrder, 'noorder', 11, 'ABM' . $this->getDateTime()->format('ym'));
            }

            $dataPD = PasienDaftar::where('norec', $request['norec_pd'])->first();
            if ($request['norec_so'] == "") {
                $dataSO = new StrukOrder;
                $dataSO->norec = $dataSO->generateNewId();
                $dataSO->kdprofile = 0;
                $dataSO->statusenabled = true;
                $dataSO->nocmfk = $dataPD->nocmfk; //$dataPD;
                //            $dataSO->cito = '0';
                //            $dataSO->objectdiagnosafk = true;
                $dataSO->isdelivered = 1;
                $dataSO->noorder = $noOrder;
                $dataSO->noorderintern = $noOrder;
                $dataSO->noregistrasifk = $dataPD->norec; //$dataAPD['noregistrasifk'];
                $dataSO->objectpegawaiorderfk = $dokter2; //$request['pegawaiorderfk'];
                $dataSO->qtyjenisproduk = 1;
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
                if (isset($request['keterangan'])) {
                    $dataSO->keteranganlainnya = $request['keterangan'];
                }
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
                    if ($request['status'] == 'bridinglangsung') {
                        $updatePP = PelayananPasien::where('norec', $item['norec_pp'])
                            ->update(
                                [
                                    'strukorderfk' => $dataSOnorec
                                ]
                            );
                    }

                    $dataOP = new OrderPelayanan;
                    $dataOP->norec = $dataOP->generateNewId();
                    $dataOP->kdprofile = 0;
                    $dataOP->statusenabled = true;
                    if (isset($item['iscito'])) {
                        $dataOP->iscito = (float)$item['iscito'];
                    } else {
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
                    if (isset($item['pemeriksaanluar'])) {
                        if ($item['pemeriksaanluar'] == 1) {
                            $dataOP->keteranganlainnya = 'isPemeriksaanKeluar';
                        }
                    }

                    if (isset($item['tglrencana'])) {
                        $dataOP->tglpelayanan = $item['tglrencana'];
                    } else {
                        $dataOP->tglpelayanan = date('Y-m-d H:i:s');
                    }

                    $dataOP->strukorderfk = $dataSOnorec;
                    if (isset($item['dokterid']) && $item['dokterid'] != "") {
                        $dataOP->objectnamapenyerahbarangfk = $item['dokterid'];
                    }
                    $dataOP->save();
                }
            } else {

                foreach ($request['details'] as $item) {
                    $dataOP = new OrderPelayanan;
                    $dataOP->norec = $dataOP->generateNewId();
                    $dataOP->kdprofile = 0;
                    $dataOP->statusenabled = true;
                    if (isset($item['iscito'])) {
                        $dataOP->iscito = (float)$item['iscito'];
                    } else {
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

                    if (isset($item['tglrencana'])) {
                        $dataOP->tglpelayanan = $item['tglrencana'];
                    } else {
                        $dataOP->tglpelayanan = date('Y-m-d H:i:s');
                    }

                    if (isset($item['dokterid']) && $item['dokterid'] != "") {
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
            if ($request['norec_so'] == "") {
                $transMessage = "Simpan Order Pelayanan";
                DB::commit();
                $result = array(
                    "status" => 201,
                    "message" => $transMessage,
                    "strukorder" => $dataSO,
                    "as" => 'inhuman',
                );
            } else {
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
                "message" => $transMessage,
                //                "nokirim" => $dataSO,//$noResep,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getIcd9(Request $request)
    {
        $req = $request->all();
        $icdIX = \DB::table('diagnosatindakan_m as dg')
            ->select(
                'dg.id',
                'dg.reportdisplay as kdDiagnosaTindakan',
                'dg.namadiagnosatindakan as namaDiagnosaTindakan'
            )
            ->where('dg.statusenabled', true)
            ->orderBy('dg.reportdisplay');

        if (
            isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $icdIX = $icdIX
                ->where('dg.reportdisplay', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%')
                ->orWhere('dg.kddiagnosatindakan', 'ilike', $req['filter']['filters'][0]['value'] . '%');
        }


        $icdIX = $icdIX->take(10);
        $icdIX = $icdIX->get();
        $data = [];
        if (count($icdIX) > 0) {
            foreach ($icdIX as $item) {
                $data[] = array(
                    'kodeNama' => $item->kdDiagnosaTindakan . ' - ' . $item->namaDiagnosaTindakan,
                    'id' => $item->id,
                    'kdDiagnosaTindakan' => $item->kdDiagnosaTindakan,
                    'namaDiagnosaTindakan' => $item->namaDiagnosaTindakan,

                );
            }
        }

        return $this->respond($data);
    }

    public function getDiagnosaIcd10Part(Request $request)
    {
        $req = $request->all();
        $dataProduk = [];
        $dataProduk = \DB::table('diagnosa_m as st')
            ->select('st.id', 'st.kddiagnosa as kdDiagnosa', 'st.namadiagnosa as namaDiagnosa')
            ->where('st.statusenabled', true)
            ->orderBy('st.kddiagnosa');
        if (
            isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $dataProduk = $dataProduk->where('st.kddiagnosa', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%')
                ->orWhere('st.namadiagnosa', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%');
        };
        $dataProduk = $dataProduk->take(10);
        $dataProduk = $dataProduk->get();


        $data = [];
        if (count($dataProduk) > 0) {
            foreach ($dataProduk as $item) {
                $data[] = array(
                    'kodeNama' => $item->kdDiagnosa . ' - ' . $item->namaDiagnosa,
                    'id' => $item->id,
                    'kdDiagnosa' => $item->kdDiagnosa,
                    'namaDiagnosa' => $item->namaDiagnosa,

                );
            }
        }

        return $this->respond($data);
    }

    public function getComboDiagnosis(Request $request)
    {
        $dataLogin = $request->all();
        $jd = \DB::table('jenisdiagnosa_m as lu')
            ->select('lu.id', 'lu.jenisdiagnosa as jenisDiagnosa')
            ->where('lu.statusenabled', true)
            ->get();


        $result = array(
            'jenisdiagnosa' => $jd,

            'message' => 'inhuman',
        );

        return $this->respond($result);
    }


    public function getDiagnosaPasienByNoregICD9RM(Request $request)
    {
        $data = \DB::table('pasiendaftar_t as pd')
            ->select(
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'apd.objectruanganfk',
                'ru.namaruangan',
                'apd.norec as norec_apd',
                'ddt.objectdiagnosatindakanfk',
                'dt.kddiagnosatindakan',
                'dt.namadiagnosatindakan',
                'dtp.norec as norec_diagnosapasien',
                'ddt.norec as norec_detaildpasien',
                'dt.*',
                'ddt.keterangantindakan',
                'pg.namalengkap',
                'ddt.tglinputdiagnosa'
            )
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('diagnosatindakanpasien_t as dtp', 'dtp.objectpasienfk', '=', 'apd.norec')
            ->leftjoin('detaildiagnosatindakanpasien_t as ddt', 'ddt.objectdiagnosatindakanpasienfk', '=', 'dtp.norec')
            ->leftjoin('diagnosatindakan_m as dt', 'dt.id', '=', 'ddt.objectdiagnosatindakanfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'ddt.objectpegawaifk');
        //            ->join ('jenisdiagnosa_m as jd','jd.id','=','ddp.objectjenisdiagnosafk');
        if (isset($request['noCm']) && $request['noCm'] != "" && $request['noCm'] != "undefined") {
            $data = $data->where('ps.nocm', '=', $request['noCm']);
        };
        if (isset($request['noReg']) && $request['noReg'] != "" && $request['noReg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $request['noReg']);
        };
        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
            $data = $data->where('apd.objectruanganfk', '=', $request['idDept']);
        };
        if (isset($request['kddiagnosatindakan']) && $request['kddiagnosatindakan'] != "" && $request['kddiagnosatindakan'] != "undefined") {
            $data = $data->where('dt.kddiagnosatindakan', '=', $request['kddiagnosatindakan']);
        }
        $data = $data->get();

        $result = array(
            'datas' => $data,
            'message' => 'giw@cepot',
        );
        return $this->respond($result);
    }

    public function getDiagnosaPasienByNoregICD9(Request $request)
    {
        $data = \DB::table('pasiendaftar_t as pd')
            ->select(
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'apd.objectruanganfk',
                'ru.namaruangan',
                'apd.norec as norec_apd',
                'ddt.objectdiagnosatindakanfk',
                'dt.kddiagnosatindakan',
                'dt.namadiagnosatindakan',
                'dtp.norec as norec_diagnosapasien',
                'ddt.norec as norec_detaildpasien',
                'dt.*',
                'ddt.keterangantindakan',
                'pg.namalengkap',
                'ddt.tglinputdiagnosa'
            )
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('diagnosatindakanpasien_t as dtp', 'dtp.objectpasienfk', '=', 'apd.norec')
            ->join('detaildiagnosatindakanpasien_t as ddt', 'ddt.objectdiagnosatindakanpasienfk', '=', 'dtp.norec')
            ->join('diagnosatindakan_m as dt', 'dt.id', '=', 'ddt.objectdiagnosatindakanfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'ddt.objectpegawaifk');
        //            ->join ('jenisdiagnosa_m as jd','jd.id','=','ddp.objectjenisdiagnosafk');
        if (isset($request['noCm']) && $request['noCm'] != "" && $request['noCm'] != "undefined") {
            $data = $data->where('ps.nocm', '=', $request['noCm']);
        };
        if (isset($request['noReg']) && $request['noReg'] != "" && $request['noReg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $request['noReg']);
        };
        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
            $data = $data->where('apd.objectruanganfk', '=', $request['idDept']);
        };
        if (isset($request['kddiagnosatindakan']) && $request['kddiagnosatindakan'] != "" && $request['kddiagnosatindakan'] != "undefined") {
            $data = $data->where('dt.kddiagnosatindakan', '=', $request['kddiagnosatindakan']);
        }
        $data = $data->get();

        $result = array(
            'datas' => $data,
            'message' => 'giw@cepot',
        );
        return $this->respond($result);
    }


    public function getObatObat(Request $request)
    {
        $noregistrasi = $request['noReg'];
        $datapp = DB::select(DB::raw("SELECT DISTINCT pdk.namaproduk, pp.aturanpakai, pp.dosisobat
        FROM pasiendaftar_t AS pd
        INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk=pd.norec
        INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk=apd.norec
        INNER JOIN produk_m AS pdk ON pdk.id = pp.produkfk
        WHERE pd.noregistrasi = '$noregistrasi' AND pp.isobat=true AND pdk.objectkelompokprodukbpjsfk IN ('13','14','15')
        "));

        $obatobat = '';
        if (count($datapp) != 0) {
            foreach ($datapp as $itempp) {
                if ($obatobat == '') {
                    $obatobat = $itempp->namaproduk . '(' . $itempp->dosisobat . ')';
                } else {
                    $obatobat = $obatobat . ', ' . $itempp->namaproduk . '(' . $itempp->dosisobat . ')';
                }
            }
        }

        // // return($request['noReg']);
        // // die();
        // $data = \DB::table('pasiendaftar_t as pd')
        //     ->select('sr.norec as strukresepfk')
        //     ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
        //     ->leftjoin('strukresep_t as sr', 'sr.pasienfk', '=', 'apd.norec');
        // $data = $data->where('pd.noregistrasi', '=', $request['noReg']);
        // // if (isset($request['noReg']) && $request['noReg'] != "" && $request['noReg'] != "undefined") {
        // //     $data = $data->where('pd.noregistrasi', '=', $request['noReg']);
        // // };
        // $data = $data->take(1);
        // $data = $data->get();

        // // return($data);
        // // die();

        $result = array(
            'datas' => $obatobat,
            'message' => 'giw@cepot',
        );
        return $this->respond($result);
    }

    public function getObatResepAkhir(Request $request)
    {
        // return($request['noReg']);
        // die();
        $data = \DB::table('pasiendaftar_t as pd')
            ->select('sr.norec as strukresepfk')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('strukresep_t as sr', 'sr.pasienfk', '=', 'apd.norec');
        $data = $data->where('pd.noregistrasi', '=', $request['noReg']);
        // if (isset($request['noReg']) && $request['noReg'] != "" && $request['noReg'] != "undefined") {
        //     $data = $data->where('pd.noregistrasi', '=', $request['noReg']);
        // };
        $data = $data->take(1);
        $data = $data->get();

        // return($data);
        // die();
        foreach ($data as $item) {
            # code...
            $details = DB::select(
                DB::raw("
                    select prd.namaproduk as namaobat, pp.jumlah, pp.dosis, case when pp.frekuensi is null then pp.aturanpakai else pp.frekuensi end as frekuensi, sr.noresep,
                    case when rt.name is null then '-' else rt.name end as carapemberian 
                    from pelayananpasien_t as pp
                    inner join produk_m as prd on prd.id=pp.produkfk
                    inner join strukresep_t as sr on sr.norec=pp.strukresepfk
                    left join routefarmasi as rt on rt.id=pp.routefk
                    where pp.strukresepfk=:strukresepfk and prd.objectkelompokprodukbpjsfk IN ('13','14','15')"),
                // where pp.strukresepfk=:strukresepfk"),
                array(
                    'strukresepfk' => $item->strukresepfk,
                )
            );
        }

        $result = array(
            'datas' => $details,
            'message' => 'giw@cepot',
        );
        return $this->respond($result);
    }

    public function getDiagnosaPasienByNoreg(Request $request)
    {
        $data = \DB::table('pasiendaftar_t as pd')
            ->select(
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'apd.objectruanganfk',
                'ru.namaruangan',
                'apd.norec as norec_apd',
                'ddp.objectdiagnosafk',
                'dg.kddiagnosa',
                'dg.namadiagnosa',
                'ddp.tglinputdiagnosa',
                'ddp.objectjenisdiagnosafk',
                'jd.jenisdiagnosa',
                'dp.norec as norec_diagnosapasien',
                'ddp.norec as norec_detaildpasien',
                'ddp.tglinputdiagnosa',
                'pg.namalengkap',
                'dp.ketdiagnosis',
                'ddp.keterangan',
                'ddp.penyakitponekigd',
                'dg.*',
                'dp.iskasusbaru',
                'dp.iskasuslama'
            )
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('diagnosapasien_t as dp', 'dp.noregistrasifk', '=', 'apd.norec')
            ->join('detaildiagnosapasien_t as ddp', 'ddp.objectdiagnosapasienfk', '=', 'dp.norec')
            ->join('diagnosa_m as dg', 'dg.id', '=', 'ddp.objectdiagnosafk')
            ->join('jenisdiagnosa_m as jd', 'jd.id', '=', 'ddp.objectjenisdiagnosafk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'ddp.objectpegawaifk')
            ->orderby('ddp.tglinputdiagnosa', 'desc');
        if (isset($request['noReg']) && $request['noReg'] != "" && $request['noReg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $request['noReg']);
        };

        if (isset($request['noCm']) && $request['noCm'] != "" && $request['noCm'] != "undefined") {
            $data = $data->where('ps.nocm', '=', $request['noCm']);
        };

        $data = $data->get();

        $result = array(
            'datas' => $data,
            'message' => 'giw',
        );
        return $this->respond($result);
    }

    public function getDiagnosaPasienByNoregRM(Request $request)
    {
        $data = \DB::table('pasiendaftar_t as pd')
            ->select(
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'apd.objectruanganfk',
                'ru.namaruangan',
                'apd.norec as norec_apd',
                'ddp.objectdiagnosafk',
                'dg.kddiagnosa',
                'dg.namadiagnosa',
                'ddp.tglinputdiagnosa',
                'ddp.objectjenisdiagnosafk',
                'jd.jenisdiagnosa',
                'dp.norec as norec_diagnosapasien',
                'ddp.norec as norec_detaildpasien',
                'ddp.tglinputdiagnosa',
                'pg.namalengkap',
                'dp.ketdiagnosis',
                'ddp.keterangan',
                'dg.*',
                'dp.iskasusbaru',
                'dp.iskasuslama'
            )
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('diagnosapasien_t as dp', 'dp.noregistrasifk', '=', 'apd.norec')
            ->join('detaildiagnosapasien_t as ddp', 'ddp.objectdiagnosapasienfk', '=', 'dp.norec')
            ->leftjoin('diagnosa_m as dg', 'dg.id', '=', 'ddp.objectdiagnosafk')
            ->leftjoin('jenisdiagnosa_m as jd', 'jd.id', '=', 'ddp.objectjenisdiagnosafk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'ddp.objectpegawaifk')
            ->orderby('ddp.tglinputdiagnosa', 'desc');
        if (isset($request['noReg']) && $request['noReg'] != "" && $request['noReg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $request['noReg']);
        };

        if (isset($request['noCm']) && $request['noCm'] != "" && $request['noCm'] != "undefined") {
            $data = $data->where('ps.nocm', '=', $request['noCm']);
        };

        $data = $data->get();

        $result = array(
            'datas' => $data,
            'message' => 'giw',
        );
        return $this->respond($result);
    }

    public function saveDiagnosaTindakanPasien(Request $request)
    {
        $dataLogin = $request->all();
        DB::beginTransaction();
        $dataPegawaiUser = DB::select(
            DB::raw("select pg.id,pg.namalengkap from loginuser_s as lu
                INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id
                where lu.id=:idLoginUser"),
            array(
                'idLoginUser' => $dataLogin['userData']['id'],
            )
        );

        //        try{
        if ($request['detaildiagnosatindakanpasien']['norec_dp'] == '') {
            $dataDiagnosa = new DiagnosaTindakanPasien();
            $dataDiagnosa->norec = $dataDiagnosa->generateNewId();
            $dataDiagnosa->kdprofile = 0;
            $dataDiagnosa->statusenabled = true;
        } else {
            $dataDiagnosa = DiagnosaTindakanPasien::where('norec', $request['detaildiagnosatindakanpasien']['norec_dp'])->first();
        }
        $dataDiagnosa->objectpasienfk = $request['detaildiagnosatindakanpasien']['objectpasienfk'];
        $dataDiagnosa->tglpendaftaran = $request['detaildiagnosatindakanpasien']['tglpendaftaran'];


        try {
            $dataDiagnosa->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan Diagnosa Baru";
        }


        if ($request['detaildiagnosatindakanpasien']['norec_dp'] == '') {
            $dataDetailDiagnosa = new DetailDiagnosaTindakanPasien();
            $dataDetailDiagnosa->norec = $dataDetailDiagnosa->generateNewId();
            $dataDetailDiagnosa->kdprofile = 0;
            $dataDetailDiagnosa->statusenabled = true;
            $dataDetailDiagnosa->objectpegawaifk = $dataPegawaiUser[0]->id; // $this->getCurrentLoginID();
        } else {
            $dataDetailDiagnosa = DetailDiagnosaTindakanPasien::where('objectdiagnosatindakanpasienfk', $request['detaildiagnosatindakanpasien']['norec_dp'])->first();
        }

        $dataDetailDiagnosa->objectdiagnosatindakanfk = $request['detaildiagnosatindakanpasien']['objectdiagnosatindakanfk'];
        $dataDetailDiagnosa->objectdiagnosatindakanpasienfk = $dataDiagnosa->norec;
        $dataDetailDiagnosa->jumlah = null;
        $dataDetailDiagnosa->objectpegawaifk = $dataPegawaiUser[0]->id; // $this->getCurrentLoginID()
        if (isset($request['detaildiagnosatindakanpasien']['keterangantindakan'])) {
            $dataDetailDiagnosa->keterangantindakan = $request['detaildiagnosatindakanpasien']['keterangantindakan'];
        }

        $dataDetailDiagnosa->tglinputdiagnosa = date('Y-m-d H:i:s');

        try {
            $dataDetailDiagnosa->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan Pasien Baru";
        }

        if ($transStatus == 'true') {
            $transMessage = "Data Tersimpan";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'data' => $dataDiagnosa,
                'as' => 'egie@ramdan',
            );
        } else {
            $transMessage = "Data Gagal Disimpan";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message' => $transMessage,
                'data' => $dataDiagnosa,
                'as' => 'egie@ramdan',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveDiagnosaTindakanPasienRM(Request $request)
    {
        $dataLogin = $request->all();
        DB::beginTransaction();
        $dataPegawaiUser = DB::select(
            DB::raw("select pg.id,pg.namalengkap from loginuser_s as lu
                INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id
                where lu.id=:idLoginUser"),
            array(
                'idLoginUser' => $dataLogin['userData']['id'],
            )
        );

        try {
            foreach ($request['dataDiagnosaD9'] as $item) {
                // return($item['objectdiagnosatindakanfk']);
                // die();
                if ($item['norec_dp'] == '') {
                    $dataDiagnosa = new DiagnosaTindakanPasien();
                    $dataDiagnosa->norec = $dataDiagnosa->generateNewId();
                    $dataDiagnosa->kdprofile = 0;
                    $dataDiagnosa->statusenabled = true;
                } else {
                    $dataDiagnosa = DiagnosaTindakanPasien::where('norec', $item['norec_dp'])->first();
                }
                $dataDiagnosa->objectpasienfk = $item['objectpasienfk'];
                $dataDiagnosa->tglpendaftaran = $item['tglpendaftaran'];


                // try {
                $dataDiagnosa->save();
                //     $transStatus = 'true';
                // } catch (\Exception $e) {
                //     $transStatus = 'false';
                //     $transMessage = "simpan Diagnosa Baru";
                // }


                if ($item['norec_dp'] == '') {
                    $dataDetailDiagnosa = new DetailDiagnosaTindakanPasien();
                    $dataDetailDiagnosa->norec = $dataDetailDiagnosa->generateNewId();
                    $dataDetailDiagnosa->kdprofile = 0;
                    $dataDetailDiagnosa->statusenabled = true;
                    $dataDetailDiagnosa->objectpegawaifk = $dataPegawaiUser[0]->id; // $this->getCurrentLoginID();
                } else {
                    $dataDetailDiagnosa = DetailDiagnosaTindakanPasien::where('objectdiagnosatindakanpasienfk', $item['norec_dp'])->first();
                }

                $dataDetailDiagnosa->objectdiagnosatindakanfk = $item['objectdiagnosatindakanfk'];
                $dataDetailDiagnosa->objectdiagnosatindakanpasienfk = $dataDiagnosa->norec;
                $dataDetailDiagnosa->jumlah = null;
                $dataDetailDiagnosa->objectpegawaifk = $dataPegawaiUser[0]->id; // $this->getCurrentLoginID()
                if (isset($item['keterangantindakan'])) {
                    $dataDetailDiagnosa->keterangantindakan = $item['keterangantindakan'];
                }

                $dataDetailDiagnosa->tglinputdiagnosa = date('Y-m-d H:i:s');

                // try {
                $dataDetailDiagnosa->save();
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan Pasien Baru";
        }

        if ($transStatus == 'true') {
            $transMessage = "Data Tersimpan";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'data' => $dataDiagnosa,
                'as' => 'egie@ramdan',
            );
        } else {
            $transMessage = "Data Gagal Disimpan";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message' => $transMessage,
                'data' => $dataDiagnosa,
                'as' => 'egie@ramdan',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function deleteDiagnosaTindakanPasien(Request $request)
    {
        $dataLogin = $request->all();
        DB::beginTransaction();
        if ($request['diagnosa']['norec_dp'] != '') {
            try {
                $data1 = DetailDiagnosaTindakanPasien::where('objectdiagnosatindakanpasienfk', $request['diagnosa']['norec_dp'])->delete();
                $transStatus = 'true';
            } catch (\Exception $e) {
                $transStatus = false;
            }
            try {
                $data2 = DiagnosaTindakanPasien::where('norec', $request['diagnosa']['norec_dp'])->delete();
                $transStatus = 'true';
            } catch (\Exception $e) {
                $transStatus = false;
            }
        }
        if ($transStatus = 'true') {
            DB::commit();
            $transMessage = "Data Terhapus";
        } else {
            DB::rollBack();
            $transMessage = "Data Gagal Dihapus";
        }
        return $this->setStatusCode(201)->respond([], $transMessage);
    }


    public function saveDiagnosaPasien(Request $request)
    {
        $dataLogin = $request->all();
        DB::beginTransaction();
        // return($request['detaildiagnosapasien']);
        // die();
        //        try{
        $dataPegawaiUser = DB::select(
            DB::raw("select pg.id,pg.namalengkap from loginuser_s as lu
                INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id
                where lu.id=:idLoginUser"),
            array(
                'idLoginUser' => $dataLogin['userData']['id'],
            )
        );

        if ($request['detaildiagnosapasien']['norec_dp'] == '') {
            $dataDiagnosa = new DiagnosaPasien();
            $dataDiagnosa->norec = $dataDiagnosa->generateNewId();
            $dataDiagnosa->kdprofile = 0;
            $dataDiagnosa->statusenabled = true;
        } else {
            $dataDiagnosa = DiagnosaPasien::where('norec', $request['detaildiagnosapasien']['norec_dp'])->first();
        }

        $dataDiagnosa->noregistrasifk = $request['detaildiagnosapasien']['noregistrasifk'];
        $dataDiagnosa->ketdiagnosis = 'Diagnosa Pasien';
        $dataDiagnosa->tglregistrasi = null;
        $dataDiagnosa->tglpendaftaran = $request['detaildiagnosapasien']['tglregistrasi'];
        if (isset($request['detaildiagnosapasien']['kasusbaru'])) {
            $dataDiagnosa->iskasusbaru = $request['detaildiagnosapasien']['kasusbaru'];
        }
        if (isset($request['detaildiagnosapasien']['kasuslama'])) {
            $dataDiagnosa->iskasuslama = $request['detaildiagnosapasien']['kasuslama'];
        }
        try {

            $dataDiagnosa->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan Diagnosa Baru";
        }


        if ($request['detaildiagnosapasien']['norec_dp'] == '' || $request['detaildiagnosapasien']['keterangan'] == '') {
            $dataDetailDiagnosa = new DetailDiagnosaPasien();
            $dataDetailDiagnosa->norec = $dataDetailDiagnosa->generateNewId();
            $dataDetailDiagnosa->kdprofile = 0;
            $dataDetailDiagnosa->statusenabled = true;
            //               $dataDetailDiagnosa->keterangan = '-';
            $dataDetailDiagnosa->objectpegawaifk = $dataPegawaiUser[0]->id; // $this->getCurrentLoginID();

        } else {
            $dataDetailDiagnosa = DetailDiagnosaPasien::where('objectdiagnosapasienfk', $request['detaildiagnosapasien']['norec_dp'])->first();
        }

        $dataDetailDiagnosa->noregistrasifk = $request['detaildiagnosapasien']['noregistrasifk'];
        $dataDetailDiagnosa->tglregistrasi = $request['detaildiagnosapasien']['tglregistrasi'];
        $dataDetailDiagnosa->norec = $dataDetailDiagnosa->generateNewId();
        $dataDetailDiagnosa->objectdiagnosafk = $request['detaildiagnosapasien']['objectdiagnosafk'];
        $dataDetailDiagnosa->objectdiagnosapasienfk = $dataDiagnosa->norec;
        $dataDetailDiagnosa->objectjenisdiagnosafk = $request['detaildiagnosapasien']['objectjenisdiagnosafk'];
        $dataDetailDiagnosa->tglinputdiagnosa = date('Y-m-d H:i:s'); //$request['detaildiagnosapasien']['tglinputdiagnosa'];
        $dataDetailDiagnosa->keterangan = $request['detaildiagnosapasien']['keterangan'];
        if (isset($request['detaildiagnosapasien']['penyakitponekigd']) && $request['detaildiagnosapasien']['penyakitponekigd'] != "" && $request['detaildiagnosapasien']['penyakitponekigd'] != "undefined") {
            $dataDetailDiagnosa->penyakitponekigd = $request['detaildiagnosapasien']['penyakitponekigd'];
        };
        $dataDetailDiagnosa->objectpegawaifk = $dataPegawaiUser[0]->id; // $this->getCurrentLoginID();


        try {
            $dataDetailDiagnosa->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan Pasien Baru";
        }

        if ($transStatus == 'true') {
            $transMessage = "Data Tersimpan";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'data' => $dataDiagnosa,
                'as' => 'egie@ramdan',
            );
        } else {
            $transMessage = "Data Gagal Disimpan";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message' => $transMessage,
                'data' => $dataDiagnosa,
                'as' => 'egie@ramdan',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }


    public function saveDiagnosaPasienRM(Request $request)
    {
        $dataLogin = $request->all();
        DB::beginTransaction();
        //        try{
        // return($request['dataDiagnosaD10']);
        // die();
        $dataPegawaiUser = DB::select(
            DB::raw("select pg.id,pg.namalengkap from loginuser_s as lu
                INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id
                where lu.id=:idLoginUser"),
            array(
                'idLoginUser' => $dataLogin['userData']['id'],
            )
        );

        try {
            foreach ($request['dataDiagnosaD10'] as $item) {
                // return($item['tglregistrasi']);
                // die();
                if ($item['norec_dp'] == '') {
                    $dataDiagnosa = new DiagnosaPasien();
                    $dataDiagnosa->norec = $dataDiagnosa->generateNewId();
                    $dataDiagnosa->kdprofile = 0;
                    $dataDiagnosa->statusenabled = true;
                    // return($item['objectdiagnosafk']);
                    // die();
                } else {
                    $dataDiagnosa = DiagnosaPasien::where('norec', $item['norec_dp'])->first();
                }

                $dataDiagnosa->noregistrasifk = $item['noregistrasifk'];
                $dataDiagnosa->ketdiagnosis = 'Diagnosa Pasien';
                $dataDiagnosa->tglregistrasi = null;
                $dataDiagnosa->tglpendaftaran = $item['tglregistrasi'];
                if (isset($item['kasusbaru'])) {
                    $dataDiagnosa->iskasusbaru = $item['kasusbaru'];
                }
                if (isset($item['kasuslama'])) {
                    $dataDiagnosa->iskasuslama = $item['kasuslama'];
                }
                try {

                    $dataDiagnosa->save();
                    $transStatus = 'true';
                } catch (\Exception $e) {
                    $transStatus = 'false';
                    $transMessage = "simpan Diagnosa Baru";
                }


                if ($item['norec_dp'] == '') {
                    $dataDetailDiagnosa = new DetailDiagnosaPasien();
                    $dataDetailDiagnosa->norec = $dataDetailDiagnosa->generateNewId();
                    $dataDetailDiagnosa->kdprofile = 0;
                    $dataDetailDiagnosa->statusenabled = true;
                    //               $dataDetailDiagnosa->keterangan = '-';
                    $dataDetailDiagnosa->objectpegawaifk = $dataPegawaiUser[0]->id; // $this->getCurrentLoginID();

                } else {
                    $dataDetailDiagnosa = DetailDiagnosaPasien::where('objectdiagnosapasienfk', $item['norec_dp'])->first();
                }

                $dataDetailDiagnosa->noregistrasifk = $item['noregistrasifk'];
                $dataDetailDiagnosa->tglregistrasi = $item['tglregistrasi'];
                $dataDetailDiagnosa->norec = $dataDetailDiagnosa->generateNewId();
                $dataDetailDiagnosa->objectdiagnosafk = $item['objectdiagnosafk'];
                $dataDetailDiagnosa->objectdiagnosapasienfk = $dataDiagnosa->norec;
                $dataDetailDiagnosa->objectjenisdiagnosafk = $item['objectjenisdiagnosafk'];
                $dataDetailDiagnosa->tglinputdiagnosa = date('Y-m-d H:i:s'); //$item['tglinputdiagnosa'];
                $dataDetailDiagnosa->keterangan = $item['keterangan'];
                $dataDetailDiagnosa->objectpegawaifk = $dataPegawaiUser[0]->id; // $this->getCurrentLoginID();
                $dataDetailDiagnosa->save();
            }


            // try {
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan Pasien Baru";
        }

        if ($transStatus == 'true') {
            $transMessage = "Data Tersimpan";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'data' => $dataDiagnosa,
                'as' => 'egie@ramdan',
            );
        } else {
            $transMessage = "Data Gagal Disimpan";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message' => $transMessage,
                'data' => $dataDiagnosa,
                'as' => 'egie@ramdan',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function deleteDiagnosaPasien(Request $request)
    {
        $dataLogin = $request->all();
        DB::beginTransaction();
        if ($request['diagnosa']['norec_dp'] != '') {
            try {
                $data1 = DetailDiagnosaPasien::where('objectdiagnosapasienfk', $request['diagnosa']['norec_dp'])->delete();
                $transStatus = 'true';
            } catch (\Exception $e) {
                $transStatus = false;
            }
            try {
                $data2 = DiagnosaPasien::where('norec', $request['diagnosa']['norec_dp'])->delete();
                $transStatus = 'true';
            } catch (\Exception $e) {
                $transStatus = false;
            }
        }
        if ($transStatus = 'true') {
            DB::commit();
            $transMessage = "Data Terhapus";
        } else {
            DB::rollBack();
            $transMessage = "Data Gagal Dihapus";
        }

        return $this->setStatusCode(201)->respond([], $transMessage);
    }

    public function getDataComboResepEMR(Request $request)
    {
        $dataLogin = $request->all();

        $dataSigna = \DB::table('stigma as st')
            ->select('st.id', 'st.name')
            ->orderBy('st.name')
            ->get();

        $dataRuangan = \DB::table('maploginusertoruangan_s as mlu')
            ->JOIN('ruangan_m as ru', 'ru.id', '=', 'mlu.objectruanganfk')
            ->select('ru.id', 'ru.namaruangan')
            ->where('mlu.objectloginuserfk', $request['userData']['id'])
            ->get();

        $dataRuanganFamasi = \DB::table('ruangan_m as ru')
            ->select('ru.id', 'ru.namaruangan')
            ->where('ru.objectdepartemenfk', 14)
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
            

        $dataProduk = \DB::table('produk_m as pr')
            ->JOIN('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
            ->JOIN('jenisproduk_m as jp', 'jp.id', '=', 'djp.objectjenisprodukfk')
            ->leftJOIN('satuanstandar_m as ss', 'ss.id', '=', 'pr.objectsatuanstandarfk')
            ->JOIN('stokprodukdetail_t as spd', 'spd.objectprodukfk', '=', 'pr.id')
            ->select('pr.id', 'pr.namaproduk', 'ss.id as ssid', 'ss.satuanstandar')
            ->where('pr.statusenabled', true)
            ->whereIn('jp.id', [97, 283])
            ->where('spd.qtyproduk', '>', 0)
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

        $dataRoute = \DB::table('routefarmasi as rt')
            ->select('rt.id', 'rt.name')
            ->where('rt.statusenabled', true)
            ->orderBy('rt.id')
            ->get();

        $kdJenisPegawaiDokter = $this->settingDataFixed('kdJenisPegawaiDokter');
        // $req = $request->all();
        $datadokter = \DB::table('pegawai_m')
        ->select('id', 'namalengkap')
        ->where('statusenabled', true)
        ->where('objectjenispegawaifk', $kdJenisPegawaiDokter)
            ->orderBy('namalengkap')
            ->get();
        $dataProdukResult = [];
        foreach ($dataProduk as $item) {
            $satuanKonversi = [];
            foreach ($dataKonversiProduk as $item2) {
                if ($item->id == $item2->objekprodukfk) {
                    $satuanKonversi[] = array(
                        'ssid' => $item2->satuanstandar_tujuan,
                        'satuanstandar' => $item2->satuanstandar2,
                        'nilaikonversi' => $item2->nilaikonversi,
                    );
                }
            }

            $dataProdukResult[] = array(
                'id' => $item->id,
                'namaproduk' => $item->namaproduk,
                'ssid' => $item->ssid,
                'satuanstandar' => $item->satuanstandar,
                'konversisatuan' => $satuanKonversi,
            );
        }
        // untuk combobox keterangan
        $datawaktuminum = \DB::table('waktuminum_m as wm')
            ->select('wm.id', 'wm.waktuminum')
            ->where('wm.statusenabled', true)
            ->get();
        // untuk resepmaster
        $dataResepMaster = \DB::table('resepmaster_m as rm')
        ->where('rm.statusenabled', true)
        ->where('id_pegawaifk', $request['id'])
            ->get();

        $dataDetailResepMaster = \DB::table('detailresepmaster_m as drm')
            ->JOIN('resepmaster_m as rm', 'rm.norec', '=', 'drm.objectresepmaster')
            ->select('drm.*','rm.namamaster', 'rm.statusenabled')
            ->where('rm.statusenabled', true)
            // ->where('mlu.objectloginuserfk', $request['userData']['id'])
            ->get();

        $result = array(
            'ruanganfarmasi' => $dataRuanganFamasi,
            'jeniskemasan' => $dataJenisKemasan,
            'produk' => $dataProdukResult,
            'ruangan' => $dataRuangan,
            'asalproduk' => $dataAsalProduk,
            'signa' => $dataSigna,
            'jenisracikan' => $dataJenisRacikan,
            'tarifadminresep' => $dataTarifAdminResep,
            'route' => $dataRoute,
            'penulisresep' => $datadokter,
            'waktuminum' => $datawaktuminum ,
            'resepmaster' => $dataResepMaster,
            'detailresepmaster' => $dataDetailResepMaster,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }

    public function getDetailResepMaster(Request $request){
        $where = "";
        if (isset($request['objectresepmaster']) && $request['objectresepmaster'] != "" && $request['objectresepmaster'] != "undefined") {
            $where = $request['objectresepmaster'];
        }
        $dataDetailResepMaster = \DB::table('detailresepmaster_m as drm')
        ->JOIN('resepmaster_m as rm', 'rm.norec', '=', 'drm.objectresepmaster')
        ->select('drm.*','rm.namamaster','rm.statusenabled')
        ->where('drm.objectresepmaster', $where)
        ->get();


        $result = array(
            'data' => $dataDetailResepMaster,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
    

    public function getDaftarDetailOrder(Request $request)
    {
        $data = \DB::table('strukorder_t as so')
            ->JOIN('pasien_m as ps', 'ps.id', '=', 'so.nocmfk')
            ->JOIN('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->JOIN('ruangan_m as ru', 'ru.id', '=', 'so.objectruanganfk')
            ->JOIN('ruangan_m as ru2', 'ru2.id', '=', 'so.objectruangantujuanfk')
            ->leftJOIN('pegawai_m as pg', 'pg.id', '=', 'so.objectpegawaiorderfk')
            ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'so.noregistrasifk')
            ->JOIN('kelas_m as kl', 'kl.id', '=', 'pd.objectkelasfk')
            ->leftJOIN('antrianpasiendiperiksa_t as apd', function ($join) {
                $join->on('apd.noregistrasifk', '=', 'pd.norec')
                    ->on('apd.objectruanganfk', '=', 'so.objectruanganfk');
                //                    ->on('apd.objectpegawaifk', '=', 'so.objectpegawaiorderfk');
            })
            ->leftJOIN('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->select(
                'so.noorder',
                'ps.nocm',
                'ps.namapasien',
                'jk.jeniskelamin',
                'ru.namaruangan as namaruanganrawat',
                'so.tglorder',
                'pg.namalengkap',
                'ru2.namaruangan',
                'so.statusorder',
                'so.namapengambilorder',
                'so.noregistrasifk',
                'pd.noregistrasi',
                'kp.kelompokpasien',
                'apd.norec as norec_apd',
                'pd.tglregistrasi',
                'ps.tgllahir',
                'kl.namakelas',
                'kl.id as klid',
                'so.tglambilorder',
                'so.norec as norec_order',
                'so.isreseppulang'
            );

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('so.tglorder', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'] . " 23:59:59";
            $data = $data->where('so.tglorder', '<=', $tgl);
        }
        if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
            $data = $data->where('ps.nocm', 'ilike', '%' . $request['nocm'] . '%');
        }
        if (isset($request['norec_apd']) && $request['norec_apd'] != "" && $request['norec_apd'] != "undefined") {
            $data = $data->where('apd.norec', $request['norec_apd']);
        }
        $data = $data->where('so.keteranganorder', 'ilike', '%' . 'Order Farmasi' . '%');
        $data = $data->where('so.objectkelompoktransaksifk', 4);
        $data = $data->where('so.statusenabled', true);
        $data = $data->get();
        $status = '';

        $result = [];
        foreach ($data as $item) {
            $details = DB::select(
                DB::raw("
                    SELECT so.noorder,op.rke, jk.jeniskemasan, pr.namaproduk, ss.satuanstandar, op.aturanpakai, op.jumlah, op.hargasatuan,op.keteranganpakai as keterangan                           
                    from strukorder_t as so 
                    left join orderpelayanan_t as op on op.strukorderfk = so.norec
                    left join produk_m as pr on pr.id=op.objectprodukfk
                    left join jeniskemasan_m as jk on jk.id=op.jeniskemasanfk
                    left join satuanstandar_m as ss on ss.id=op.objectsatuanstandarfk
                    where noorder=:noorder"),
                array(
                    'noorder' => $item->noorder,
                )
            );
            if ($item->statusorder == 0) {
                $status = 'Menunggu';
            };
            if ($item->statusorder == 5) {
                $status = 'Verifikasi';
            };
            if ($item->statusorder == 1) {
                $status = 'Produksi';
            };
            if ($item->statusorder == 2) {
                $status = 'Packaging';
            };
            if ($item->statusorder == 3) {
                $status = 'Selesai';
            };
            if ($item->statusorder == 4) {
                $status = 'Penyerahan Obat';
            };
            if ($item->tglambilorder != null) {
                $status = 'Sudah Di Ambil';
            };
            $result[] = array(
                'noregistrasi' => $item->noregistrasi,
                'norec_order' => $item->norec_order,
                'norec' => $item->noregistrasifk,
                'tglregistrasi' => $item->tglregistrasi,
                'norec_apd' => $item->norec_apd,
                'noorder' => $item->noorder,
                'nocm' => $item->nocm,
                'namapasien' => $item->namapasien,
                'jeniskelamin' => $item->jeniskelamin,
                'namaruanganrawat' => $item->namaruanganrawat,
                'tglorder' => $item->tglorder,
                'namalengkap' => $item->namalengkap,
                'kelompokpasien' => $item->kelompokpasien,
                'namaruangan' => $item->namaruangan,
                'statusorder' => $status,
                'namapengambilorder' => $item->namapengambilorder,
                'tgllahir' => $item->tgllahir,
                'klid' => $item->klid,
                'namakelas' => $item->namakelas,
                'reseppulang' => $item->isreseppulang,
                'details' => $details
            );
        }

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
                    where spd.objectprodukfk =:produkId and ru.statusenabled = 1
                    and spd.qtyproduk > 0
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
                    'qtyproduk' => (float) $nenden->qtyproduk,
                    'kdruangan' => $nenden->kdruangan,
                    'namaruangan' => $nenden->namaruangan,
                );
            }
        }

        $result = array(
            'jmlstok' => $jmlstok,
            'infostok' => $a,
            'detail' => $results,
            'message' => 'er@epic',
        );
        return $this->respond($result);
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

    public function SimpanOrderPelayananObat(Request $request)
    {
        DB::beginTransaction();
        $r_SR = $request['0']['strukorder'];
        try {
            $dataDetail = \DB::table('antrianpasiendiperiksa_t as apd')
                ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                ->select('pd.norec', 'pd.nocmfk', 'apd.objectruanganfk', 'pd.objectkelasfk', 'apd.norec as apdnorec')
                ->where('apd.norec', $r_SR['noregistrasifk'])
                ->first();
            //        return $this->respond(array($dataDetail->nocmfk));

            if ($r_SR['norec'] == '') {


                $noOrder = $this->generateCodeBySeqTable(new StrukOrder, 'noorder', 10, $this->getDateTime()->format('ym'));
                // return $noOrder;
                if ($noOrder == '') {
                    $transMessage = "Gagal mengumpukan data, Coba lagi.!";
                    DB::rollBack();
                    $result = array(
                        "status" => 400,
                        "message"  => $transMessage,
                        "as" => 'as@epic',
                    );
                    return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                }


                $newSO = new StrukOrder();
                $norecSO = $newSO->generateNewId();
                // $newId = StrukOrder::where('noorder', 'ilike', $this->getDateTime()->format('ym') . '%')->max('noorder');
                // $newId = substr(trim($newId), 4);
                // $newId = (int)$newId + 1;
                // $noOrder = $this->getDateTime()->format('ym') . str_pad($newId, 6, "0", STR_PAD_LEFT);
                $newSO->norec = $norecSO;
                $newSO->kdprofile = 0;
                $newSO->statusenabled = true;
            } else {
                $newSO = StrukOrder::where('norec', $r_SR['norec'])->first();

                $noOrder = $newSO->noorder;
                OrderPelayanan::where('noorderfk', $newSO->norec)->delete();
            }
            $newSO->caraambil = $r_SR['caraambil'];
            $newSO->isreseppulang = $r_SR['isreseppulang'];
            $newSO->nocmfk = $dataDetail->nocmfk;
            $newSO->kddokter = $r_SR['penulisresepfk'];
            $newSO->objectjenisorderfk = 5;
            $newSO->isdelivered = 1;
            $newSO->objectkelompoktransaksifk = 4;
            $newSO->keteranganorder = 'Order Farmasi';
            $newSO->noorder = $noOrder;
            $newSO->noregistrasifk = $dataDetail->norec;
            $newSO->objectpegawaiorderfk = $r_SR['penulisresepfk'];
            $newSO->qtyproduk = $r_SR['qtyproduk'];
            $newSO->qtyjenisproduk = $r_SR['qtyproduk'];
            $newSO->objectruanganfk = $dataDetail->objectruanganfk;
            $newSO->objectruangantujuanfk = $r_SR['ruanganfk'];
            $newSO->statusorder = 0;
            $newSO->tglorder = $r_SR['tglresep'];
            //        $newSO->tglorderexpired =  $r_SR['tglresep'];
            $newSO->totalbeamaterai = 0;
            $newSO->totalbiayakirim = 0;
            $newSO->totalbiayatambahan = 0;
            $newSO->totaldiscount = 0;
            $newSO->totalhargasatuan = 0;
            $newSO->totalharusdibayar = 0;
            $newSO->totalpph = 0;
            $newSO->totalppn = 0;
            if (isset($r_SR['noruangan'])) {
                $newSO->nourutruangan = $r_SR['noruangan'];
            }

            //        try {
            $newSO->save();
            //            $transStatus = 'true';
            //        } catch (\Exception $e) {
            //            $transStatus = 'false';
            //            $transMessage = "Simpan StrukOrder";
            //        }

            $norec_SR = $newSO->norec;
            $dokterPenulis = $newSO->penulisresepfk;

            //        $newSR = new StrukResep();
            //        $norecSR = $newSR->generateNewId();
            //        $noResep = $this->generateCode(new StrukResep, 'noresep', 12, 'O/' . $this->getDateTime()->format('ym') . '/');
            //        $newSR->norec = $norecSR;
            //        $newSR->kdprofile = 0;
            //        $newSR->statusenabled = true;
            //        $newSR->noresep = $noResep;
            //        $newSR->pasienfk = $dataDetail->apdnorec;
            //        $newSR->orderfk = $norec_SR;
            //        $newSR->penulisresepfk = $r_SR['penulisresepfk'];
            //        $newSR->ruanganfk = $r_SR['ruanganfk'];
            //        $newSR->status = 0;
            //        $newSR->tglresep =  $r_SR['tglresep'];//->format('Y-m-d H:i:s');
            //
            //        try {
            //            $newSR->save();
            //            $transStatus = 'true';
            //        } catch (\Exception $e) {
            //            $transStatus = 'false';
            //            $transMessage = "Simpan StrukResep Pasien";
            //        }

            //## PelayananPasien
            $r_PP = $request['0']['orderfarmasi'];
            foreach ($r_PP as $r_PPL) {
                $qtyJumlah = (float)$r_PPL['jumlah'] * (float)$r_PPL['nilaikonversi'];

                $newPP = new OrderPelayanan();
                $norecPP = $newPP->generateNewId();
                $newPP->norec = $norecPP;
                $newPP->kdprofile = 0;
                $newPP->statusenabled = true;

                //            $newPP->objectasalprodukfk = $r_PPL['asalprodukfk'];
                $newPP->aturanpakai = $r_PPL['aturanpakai'];
                $newPP->isreadystok = 1;
                $newPP->kddokter = $r_SR['penulisresepfk'];;
                $newPP->objectkelasfk = $dataDetail->objectkelasfk;;
                $newPP->nocmfk = $dataDetail->nocmfk;
                $newPP->noorderfk = $norec_SR;
                $newPP->noregistrasifk = $dataDetail->norec;
                $newPP->objectprodukfk = $r_PPL['produkfk'];
                $newPP->qtyproduk = (float)$r_PPL['jumlah'];
                $newPP->qtystokcurrent = $r_PPL['jmlstok'];
                $newPP->racikanke = $r_PPL['rke'];
                $newPP->objectruanganfk = $dataDetail->objectruanganfk;
                $newPP->objectruangantujuanfk = $r_PPL['ruanganfk'];
                $newPP->objectsatuanstandarfk = $r_PPL['satuanstandarfk'];
                $newPP->strukorderfk = $norec_SR;
                $newPP->tglpelayanan = $r_SR['tglresep'];
                if (isset($r_PPL['jenisobatfk'])) {
                    $newPP->jenisobatfk = $r_PPL['jenisobatfk']; //5;
                }
                $newPP->jumlah = (float)$qtyJumlah; //$r_PPL['jumlah'];
                $newPP->iscito = 0;
                $newPP->hargasatuan = $r_PPL['hargasatuan'];
                $newPP->hargadiscount = $r_PPL['hargadiscount'];
                $newPP->qtyprodukretur = 0;
                $newPP->hasilkonversi = $r_PPL['nilaikonversi'];;
                $newPP->jeniskemasanfk = $r_PPL['jeniskemasanfk'];
                $newPP->dosis = $r_PPL['dosis'];
                $newPP->rke = $r_PPL['rke'];
                $newPP->satuanviewfk = $r_PPL['satuanviewfk'];
                $newPP->ispagi = $r_PPL['ispagi'];
                $newPP->issiang = $r_PPL['issiang'];
                $newPP->ismalam = $r_PPL['ismalam'];
                $newPP->issore = $r_PPL['issore'];
                $newPP->keteranganpakai = $r_PPL['keterangan'];
                if (isset($r_PPL['routefk'])) {
                    $newPP->routefk = $r_PPL['routefk']; //5;
                }
                //            try {
                $newPP->save();
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Simpan Order Pelayanan";

        if ($transStatus == 'true') {
            $transMessage = "Simpan Order Pelayanan Apotik Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "noresep" => $newSO, //$noResep,,//$noResep,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Simpan Order Pelayanan Apotik Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "noresep" => $newSO, //$noResep,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }


    public function simpanResepMaster(Request $request)
    {
        try {
            $strukorder = $request['0']['strukorder'];
            $orderfarmasi = $request['0']['orderfarmasi'];
            $namamaster = $request['0']['namamaster'];
            $id_pegawaifk = $request['0']['id_pegawaifk'];
            $data1 = new ResepMaster();
            $data1->norec = $data1->generateNewId();
            $data1->namamaster = $namamaster;
            $data1->statusenabled = true;
            $data1->id_pegawaifk = $id_pegawaifk;
            $data1->save();

            foreach ($orderfarmasi as $order) {
                            $data = new DetailResepMaster();
            $data->norec = $data->generateNewId();
            $data->noruang = $strukorder['noruangan'];
            $data->penulis_resep = $strukorder['penulisresepfk'];
            $data->ruangan = $strukorder['ruanganfk'];
            $data->namaproduk = $order['namaproduk'];
            // $data->kekuatan = $strukorder['penulisresepfk'];
            $data->caraambil = $strukorder['caraambil'];
            $data->objectresepmaster = $data1->norec;

            $data->rke = $order['rke'];
            $data->jeniskemasan = $order['jeniskemasan'];
            $data->jumlah = $order['jumlah'];
            $data->dosis = $order['dosis'];
            $data->qtyobat = $order['nilaikonversi'];
            $data->aturanpakai = $order['aturanpakai'];
            $data->keterangan = $order['keterangan'];
            $data->route = $order['route'];
            $data->satuan = $order['satuanview'];
            $data->hargasatuan = $order['hargasatuan'];

            $data->total = (int)$order['jumlah'] * $order['hargasatuan'];
            $data->jmldosis = $order['jmldosis'] ;


            $data->asalproduk = $order['asalproduk'];
            $data->asalprodukfk = $order['asalprodukfk'];
            $data->aturanpakaifk = $order['aturanpakaifk'];
            $data->generik = $order['generik'];
            $data->hargadiscount = $order['hargadiscount'];
            $data->hargajual = $order['hargajual'];
            $data->harganetto = $order['harganetto'];
            $data->ismalam = $order['ismalam'];
            $data->ispagi = $order['ispagi'];
            $data->issiang = $order['issiang'];
            $data->issore = $order['issore'];
            $data->jeniskemasanfk = $order['jeniskemasanfk'];
            $data->jenisobatfk = $order['jenisobatfk'];
            $data->jumlahxmakan = null;
            $data->nilaikonversi = $order['nilaikonversi'];
            $data->nostrukterimafk = $order['nostrukterimafk'];
            $data->produkfk = $order['produkfk'];
            $data->routefk = $order['routefk'];
            $data->ruanganfk = $order['ruanganfk'];
            $data->satuanstandar = $order['satuanstandar'];
            $data->satuanstandarfk = $order['satuanstandarfk'];
            $data->satuanview = $order['satuanview'];
            $data->satuanviewfk = $order['satuanviewfk'];
            $data->jmlstok = $order['jmlstok'];
            $data->stock = $order['stock'];
            
            $data->save();
            }


    
          
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Simpan Order Pelayanan";

        if ($transStatus == 'true') {
            $transMessage = "Simpan Resep Master Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                // "noresep" => $newSO, //$noResep,,//$noResep,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Simpan Resep Master Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                // "noresep" => $newSO, //$noResep,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    // 
    public function hapusResepMaster(Request $request)
    {
        try {

            ResepMaster::where('norec', $request['norec'])->update(['statusenabled' => false]);

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        // $transMessage = "Simpan Order Pelayanan";

        if ($transStatus == 'true') {
            $transMessage = "Hapus Resep Master Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                // "noresep" => $newSO, //$noResep,,//$noResep,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Hapus Resep Master Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                // "noresep" => $newSO, //$noResep,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }


    public function hapusResepMasterDetail(Request $request)
    {
        try {
            DetailResepMaster::where('norec', $request['norec'])->delete();;
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        // $transMessage = "Simpan Order Pelayanan";

        if ($transStatus == 'true') {
            $transMessage = "Hapus Resep Master Detail Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                // "noresep" => $newSO, //$noResep,,//$noResep,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Hapus Resep Master Detail Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                // "noresep" => $newSO, //$noResep,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
     public function simpanDetailToMasterResep(Request $request)
    {
        try {
            $data = new DetailResepMaster();
            $data->norec = $data->generateNewId();
            $data->noruang = $request['noruangan'];
            $data->penulis_resep = $request['penulisresep'];
            $data->ruangan = $request['ruanganfk'];
            $data->namaproduk = $request['namaproduk'];
            $data->kekuatan = $request['kekuatan'];
            $data->caraambil = $request['caraambil'];
            $data->jmldosis = $request['jmldosis'] ;
            $data->total = $request['total'] ;

            $data->objectresepmaster = $request['norec'];
            
            $data->rke = $request['rke'];
            $data->jeniskemasan = $request['jeniskemasan'];
            $data->jeniskemasanfk = $request['jeniskemasanfk'];
            $data->jumlah = $request['jumlah'];
            $data->dosis = $request['dosis'];
            $data->qtyobat = $request['nilaikonversi'];
            $data->aturanpakai = $request['aturanpakai'];
            $data->keterangan = $request['keterangan'];
            $data->route = $request['route'];
            $data->satuan = $request['satuanviewfk'];
            $data->hargasatuan = $request['hargasatuan'];



            $data->asalproduk = $request['asalproduk'];
            $data->asalprodukfk = $request['asalprodukfk'];
            $data->aturanpakaifk = $request['aturanpakaifk'];
            $data->generik = $request['generik'];
            $data->hargadiscount = $request['hargadiscount'];
            $data->hargajual = $request['hargajual'];
            $data->harganetto = $request['harganetto'];
            $data->ismalam = 0;// $request['ismalam'];
            $data->ispagi =  0;//$request['ispagi'];
            $data->issiang = 0;//$request['issiang'];
            $data->issore = 0;//$request['issore'];
            $data->jenisobatfk = $request['jenisobatfk'];
            $data->jmlstok = $request['jmlstok'];
            $data->jumlahxmakan = null;
            $data->nilaikonversi = $request['nilaikonversi'];
            $data->nostrukterimafk = $request['nostrukterimafk'];
            $data->produkfk = $request['produkfk'];
            $data->routefk = $request['routefk'];
            $data->ruanganfk = $request['ruanganfk'];
            $data->satuanstandar = $request['satuanstandar'];
            $data->satuanstandarfk = $request['satuanstandarfk'];
            $data->satuanview = $request['satuanview'];
            $data->satuanviewfk = $request['satuanviewfk'];
            $data->stock = $request['stock'];

            $data->save();
            // DetailResepMaster::where('norec', $request['norec'])->delete();;
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        // $transMessage = "Simpan Order Pelayanan";

        if ($transStatus == 'true') {
            $transMessage = "Simpan Resep Master Detail Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                // "noresep" => $newSO, //$noResep,,//$noResep,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Simpan Resep Master Detail Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                // "noresep" => $newSO, //$noResep,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

     public function ubahDetailMasterResep(Request $request)
    {
        try {
            // ResepMaster::where('norec', $request['norec'])->update([
            //     'namamaster' => $request['namamaster']]);

            DetailResepMaster::where('norec', $request['norec'])->update([
            'noruang' => $request['noruangan'],
            'penulis_resep' => $request['penulisresep'],
            'ruangan' => $request['ruanganfk'],
            'namaproduk' => $request['namaproduk'],
            'kekuatan' => $request['kekuatan'],
            'caraambil' => $request['caraambil'],
            'jmldosis' => $request['jmldosis'] ,
            'total' => $request['total'] ,

            // // 'objectresepmaster' => $request['norec'],
            
            'rke' => $request['rke'],
            'jeniskemasan' => $request['jeniskemasan'],
            'jeniskemasanfk' => $request['jeniskemasanfk'],
            'jumlah' => $request['jumlah'],
            'dosis' => $request['dosis'],
            'qtyobat' => $request['nilaikonversi'],
            'aturanpakai' => $request['aturanpakai'],
            'keterangan' => $request['keterangan'],
            'route' => $request['route'],
            'satuan' => $request['satuanviewfk'],
            'hargasatuan' => $request['hargasatuan'],



            'asalproduk' => $request['asalproduk'],
            'asalprodukfk' => $request['asalprodukfk'],
            'aturanpakaifk' => $request['aturanpakaifk'],
            'generik' => $request['generik'],
            'hargadiscount' => $request['hargadiscount'],
            'hargajual' => $request['hargajual'],
            'harganetto' => $request['harganetto'],
            'ismalam' => 0,// $request['ismalam'],
            'ispagi' =>  0,//$request['ispagi'],
            'issiang' => 0,//$request['issiang'],
            'issore' => 0,//$request['issore'],
            'jenisobatfk' => $request['jenisobatfk'],
            'jmlstok' => $request['jmlstok'],
            'jumlahxmakan' => null,
            'nilaikonversi' => $request['nilaikonversi'],
            'nostrukterimafk' => $request['nostrukterimafk'],
            'produkfk' => $request['produkfk'],
            'routefk' => $request['routefk'],
            'ruanganfk' => $request['ruanganfk'],
            'satuanstandar' => $request['satuanstandar'],
            'satuanstandarfk' => $request['satuanstandarfk'],
            'satuanview' => $request['satuanview'],
            'satuanviewfk' => $request['satuanviewfk'],
            'stock' => $request['stock'],
            ]);
            // DetailResepMaster::where('norec', $request['norec'])->delete();;
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        // $transMessage = "Simpan Order Pelayanan";

        if ($transStatus == 'true') {
            $transMessage = "Ubah Resep Master Detail Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                // "noresep" => $newSO, //$noResep,,//$noResep,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Ubah Resep Master Detail Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                // "noresep" => $newSO, //$noResep,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    

    

    public function ubahNamaResepMaster(Request $request)
    {
        try {

            ResepMaster::where('norec', $request['norec'])->update(['namamaster' => $request['namamaster']]);

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        // $transMessage = "Simpan Order Pelayanan";

        if ($transStatus == 'true') {
            $transMessage = "Ubah Nama Resep Master Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                // "noresep" => $newSO, //$noResep,,//$noResep,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Ubah Nama Resep Master Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                // "noresep" => $newSO, //$noResep,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    

    

    public function getComboPenunjangOrder(Request $request)
    {
        //        $details=$request->all();


        $deptPenunjang = explode(',', $this->settingDataFixed('kdDepartemenPenunjang'));
        $kode = [];
        foreach ($deptPenunjang as $itemRanap) {
            $kode[] = (int)$itemRanap;
        }
        $dataInstalasi = \DB::table('departemen_m as dp')
            ->whereIn('dp.id', $kode)
            ->where('dp.statusenabled', true)
            ->orderBy('dp.namadepartemen')
            ->get();
        $dataRuanganTujuan = \DB::table('ruangan_m as ru')
            ->select('ru.id', 'ru.namaruangan')
            ->where('ru.objectdepartemenfk', $request['departemenfk'])
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();
        $ruangan = \DB::table('ruangan_m as ru')
            ->select('ru.id', 'ru.namaruangan')
            ->whereIn('ru.objectdepartemenfk', $kode)
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();
        //        $ruangan = \DB::table('ruangan_m as ru')
        //            ->select('ru.id','ru.namaruangan','ru.objectdepartemenfk')
        //            ->where('ru.statusenabled',true)
        //            ->orderBy('ru.namaruangan')
        //            ->get();
        //        foreach ($dataInstalasi as $item) {
        //            $detail = [];
        //            foreach ($ruangan as $item2) {
        //                if ($item->id == $item2->objectdepartemenfk) {
        //                    $detail[] = array(
        //                        'id' => $item2->id,
        //                        'namaruangan' => $item2->namaruangan,
        //                    );
        //                }
        //            }
        //
        //            $dataDepartemen[] = array(
        //                'id' => $item->id,
        //                'departemen' => $item->namadepartemen,
        //                'ruangan' => $detail,
        //            );
        //        }

        //        $dataProduk=[];
        //        if ($request['departemenfk'] == 3){
        //            $dataProduk = \DB::table('produk_m as pr')
        //                ->join('detailjenisproduk_m as djp','djp.id','=','pr.objectdetailjenisprodukfk')
        //                ->join('jenisproduk_m as jp','jp.id','=','djp.objectjenisprodukfk')
        //                ->join('kelompokproduk_m as kp','kp.id','=','jp.objectkelompokprodukfk')
        //                ->select('pr.id','pr.namaproduk')
        //                // ->where('kp.id',1)
        //                ->where('pr.statusenabled',true)
        //                ->orderBy('pr.namaproduk')
        //                ->get();
        //        }
        //        if ($request['departemenfk'] == 27){
        //            $dataProduk = \DB::table('produk_m as pr')
        //                ->join('detailjenisproduk_m as djp','djp.id','=','pr.objectdetailjenisprodukfk')
        //                ->join('jenisproduk_m as jp','jp.id','=','djp.objectjenisprodukfk')
        //                ->join('kelompokproduk_m as kp','kp.id','=','jp.objectkelompokprodukfk')
        //                ->select('pr.id','pr.namaproduk')
        //                // ->where('kp.id',2)
        //                ->where('pr.statusenabled',true)
        //                ->orderBy('pr.namaproduk')
        //                ->get();
        //        }
        //        if ($request['departemenfk'] == 25){
        //            $dataProduk = \DB::table('produk_m as pr')
        //                ->join('detailjenisproduk_m as djp','djp.id','=','pr.objectdetailjenisprodukfk')
        //                ->join('jenisproduk_m as jp','jp.id','=','djp.objectjenisprodukfk')
        //                ->join('kelompokproduk_m as kp','kp.id','=','jp.objectkelompokprodukfk')
        //                ->select('pr.id','pr.namaproduk')
        //                ->where('kp.id',3)
        //                ->where('pr.statusenabled',true)
        //                ->orderBy('pr.namaproduk')
        //                ->get();
        //        }
        //        if ($request['departemenfk'] == 18){
        //            $dataProduk = \DB::table('produk_m as pr')
        //                ->join('detailjenisproduk_m as djp','djp.id','=','pr.objectdetailjenisprodukfk')
        //                ->join('jenisproduk_m as jp','jp.id','=','djp.objectjenisprodukfk')
        //                ->join('kelompokproduk_m as kp','kp.id','=','jp.objectkelompokprodukfk')
        //                ->select('pr.id','pr.namaproduk')
        //                ->where('kp.id',9)
        //                ->where('pr.statusenabled',true)
        //                ->orderBy('pr.namaproduk')
        //                ->get();
        //        }


        $dataTea = array(
            //            'data' => $data,
            'ruangantujuan' => $dataRuanganTujuan,
            'ruangan' => $ruangan,

            //            'produk' => $dataProduk,
            //            'detaillogin' => $details,
            'message' => 'as@epic'
        );
        return $this->respond($dataTea);
    }

    public function getRiwayatOrderPenunjang(Request $request)
    {
        $results = [];
        $ruanganLab = explode(',', $this->settingDataFixed('kdRuanganLabNew'));
        $kdRuangLab = [];
        foreach ($ruanganLab as $item) {
            $kdRuangLab[] = (int)$item;
        }

        $data = \DB::table('strukorder_t as so')
            ->LEFTJOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'so.noregistrasifk')
            ->JOIN('pasien_m as pas', 'pas.id', '=', 'pd.nocmfk')
            ->LEFTJOIN('ruangan_m as ru', 'ru.id', '=', 'so.objectruanganfk')
            ->LEFTJOIN('ruangan_m as ru2', 'ru2.id', '=', 'so.objectruangantujuanfk')
            ->LEFTJOIN('pegawai_m as p', 'p.id', '=', 'so.objectpegawaiorderfk')
            //            ->LEFTJOIN('reshd as pp','pp.ono','=','so.noorder')
            ->select(
                'so.norec',
                'pd.norec as norecpd',
                'pd.noregistrasi',
                'so.tglorder',
                'so.noorder',
                'ru.namaruangan as ruanganasal',
                'ru2.namaruangan as ruangantujuan',
                'p.namalengkap',
                'so.noorder',
                'pd.noregistrasi',
                'so.keteranganlainnya'
                //                ,
                //                DB::raw('case when pp.ono is null then \'PENDING\' else \'SELESAI DIPERIKSA\' end as statusorder')
            );
        if (isset($request['noregistrasi']) && $request['noregistrasi'] != "" && $request['noregistrasi'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $request['noregistrasi']);
        }
        if (isset($request['NoCM']) && $request['NoCM'] != "" && $request['NoCM'] != "undefined") {
            $data = $data->where('pas.nocm', 'ilike', '%' . $request['NoCM'] . '%');
        }
        $data = $data->whereIn('so.objectruangantujuanfk', $kdRuangLab);
        $data = $data->where('so.statusenabled', true);
        //        $data = $data->where('apd.objectruanganfk',276);
        $data = $data->orderBy('so.tglorder');
        //        $data = $data->distinct();
        $data = $data->get();

        //$results =array();
        foreach ($data as $item) {
            $noorder = $item->noorder;
            $hasil = DB::select(DB::raw("select * from order_lab where no_lab='$noorder'"));
            if (count($hasil) > 0) {
                $item->statusorder = 'SELESAI DIPERIKSA';
            } else {
                $item->statusorder = 'PENDING';
            }
            $details = DB::select(
                DB::raw("
                            select so.tglorder,so.noorder,
                            pr.id,pr.namaproduk,op.qtyproduk
                            from strukorder_t as so
                            left join orderpelayanan_t as op on op.noorderfk = so.norec
                            left join pasiendaftar_t as pd on pd.norec=so.noregistrasifk
                            left join produk_m as pr on pr.id=op.objectprodukfk
                            left join ruangan_m as ru on ru.id=so.objectruanganfk
                            left join ruangan_m as ru2 on ru2.id=so.objectruangantujuanfk
                            left join pegawai_m as p on p.id=so.objectpegawaiorderfk
                            where so.noorder=:noorder"),
                array(
                    'noorder' => $item->noorder,
                )
            );
            $results[] = array(
                'noregistrasi' => $item->noregistrasi,
                'tglorder' => $item->tglorder,
                'noorder' => $item->noorder,
                'norec' => $item->norec,
                'norecpd' => $item->norecpd,
                //                'norecapd' => $item->norecapd,
                'namaruanganasal' => $item->ruanganasal,
                'namaruangantujuan' => $item->ruangantujuan,
                'dokter' => $item->namalengkap,
                'statusorder' => $item->statusorder,
                'keteranganlainnya' => $item->keteranganlainnya,
                'details' => $details,
            );
        }

        $result = array(
            'daftar' => $results,
            'message' => 'mn@epic',
        );

        return $this->respond($result);
    }

    public function saveOrderPelayananLabRad(Request $request)
    {
        $detLogin = $request->all();
        if ($request['pegawaiorderfk'] == "") {
            $dokter2 = null;
        } else {
            $dokter2 = $request['pegawaiorderfk'];
        }


        DB::beginTransaction();
        try {
            if ($request['departemenfk'] == 3) {
                $noOrder = $this->generateCode(new StrukOrder, 'noorder', 11, 'L' . $this->getDateTime()->format('ym'));
            }
            if ($request['departemenfk'] == 27) {
                $noOrder = $this->generateCode(new StrukOrder, 'noorder', 11, 'R' . $this->getDateTime()->format('ym'));
            }
            if ($request['departemenfk'] == 25) {
                $noOrder = $this->generateCode(new StrukOrder, 'noorder', 11, 'OK' . $this->getDateTime()->format('ym'));
            }
            if ($request['departemenfk'] == 5) {
                $noOrder = $this->generateCode(new StrukOrder, 'noorder', 11, 'PJ' . $this->getDateTime()->format('ym'));
            }
            if ($request['departemenfk'] == 31) {
                $noOrder = $this->generateCode(new StrukOrder, 'noorder', 11, 'ABM' . $this->getDateTime()->format('ym'));
            }

            $dataPD = PasienDaftar::where('norec', $request['norec_pd'])->first();
            if ($request['norec_so'] == "") {
                $dataSO = new StrukOrder;
                $dataSO->norec = $dataSO->generateNewId();
                $dataSO->kdprofile = 0;
                $dataSO->statusenabled = true;
                $dataSO->nocmfk = $dataPD->nocmfk; //$dataPD;
                //            $dataSO->cito = '0';
                //            $dataSO->objectdiagnosafk = true;
                $dataSO->isdelivered = 1;
                $dataSO->noorder = $noOrder;
                $dataSO->noorderintern = $noOrder;
                $dataSO->noregistrasifk = $dataPD->norec; //$dataAPD['noregistrasifk'];
                $dataSO->objectpegawaiorderfk = $dokter2; //$request['pegawaiorderfk'];
                $dataSO->qtyjenisproduk = 1;
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
                if (isset($request['keterangan'])) {
                    $dataSO->keteranganlainnya = $request['keterangan'];
                }
                if (isset($request['objectruanganinap'])) {
                    $dataSO->objectunitpemesanfk = $request['objectruanganinap'];
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
                    if ($request['status'] == 'bridinglangsung') {
                        $updatePP = PelayananPasien::where('norec', $item['norec_pp'])
                            ->update(
                                [
                                    'strukorderfk' => $dataSOnorec
                                ]
                            );
                    }

                    $dataOP = new OrderPelayanan;
                    $dataOP->norec = $dataOP->generateNewId();
                    $dataOP->kdprofile = 0;
                    $dataOP->statusenabled = true;
                    if (isset($item['iscito'])) {
                        $dataOP->iscito = (float)$item['iscito'];
                    } else {
                        $dataOP->iscito = 0;
                    }
                
                    if (isset( $item['keterangan'])) {
                        $dataOP->keteranganlainnya = $item['keterangan'];
                    }
                    if (isset( $item['keterangan2'])) {
                        $dataOP->keteranganlainnya_quo = $item['keterangan2'];
                    }
                    // return($item['diagnosa']);
                    // die();
                    if (isset( $item['diagnosa'])) {
                        $dataOP->diagnosa = $item['diagnosa'];
                    }
                   
                    $dataOP->noorderfk = $dataSOnorec;
                    $dataOP->objectprodukfk = $item['produkfk'];
                    $dataOP->qtyproduk = $item['qtyproduk'];
                    $dataOP->objectkelasfk = $item['objectkelasfk'];
                    $dataOP->qtyprodukretur = 0;
                    $dataOP->objectruanganfk = $request['objectruanganfk'];
                    $dataOP->objectruangantujuanfk = $request['objectruangantujuanfk'];
                    $dataOP->strukorderfk = $dataSOnorec;
                    if (isset($item['pemeriksaanluar'])) {
                        if ($item['pemeriksaanluar'] == 1) {
                            $dataOP->keteranganlainnya = 'isPemeriksaanKeluar';
                        }
                    }

                    if (isset($item['tglrencana'])) {
                        $dataOP->tglpelayanan = $item['tglrencana'];
                    } else {
                        $dataOP->tglpelayanan = date('Y-m-d H:i:s');
                    }

                    $dataOP->strukorderfk = $dataSOnorec;
                    if (isset($item['dokterid']) && $item['dokterid'] != "") {
                        $dataOP->objectnamapenyerahbarangfk = $item['dokterid'];
                    }
                    $dataOP->save();
                }
            } else {
               

                $dataSO = StrukOrder::where('norec', $request['norec_so'])->first();               
   
                if (isset($request['objectruanganinap'])) {
                    $dataSO->objectunitpemesanfk = $request['objectruanganinap'];
                }

                $dataSO->save();

                $norecsotemp = $request['norec_so'];
                DB::delete("delete from orderpelayanan_t where noorderfk = '$norecsotemp'");
                foreach ($request['details'] as $item) {
                    $dataOP = new OrderPelayanan;
                    $dataOP->norec = $dataOP->generateNewId();
                    $dataOP->kdprofile = 0;
                    $dataOP->statusenabled = true;
                    if (isset($item['iscito'])) {
                        $dataOP->iscito = (float)$item['iscito'];
                    } else {
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

                    if (isset($item['tglrencana'])) {
                        $dataOP->tglpelayanan = $item['tglrencana'];
                    } else {
                        $dataOP->tglpelayanan = date('Y-m-d H:i:s');
                    }

                    if (isset($item['dokterid']) && $item['dokterid'] != "") {
                        $dataOP->objectnamapenyerahbarangfk = $item['dokterid'];
                    }
                    if (isset($item['keterangan'])) {
                        $dataOP->keteranganlainnya = $item['keterangan'];
                    }
                    if (isset($item['keterangan2'])) {
                        $dataOP->keteranganlainnya_quo = $item['keterangan2'];
                    }
                    // return($item['diagnosa']);
                    // die();
                    if (isset($item['diagnosa'])) {
                        $dataOP->diagnosa = $item['diagnosa'];
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
            if ($request['norec_so'] == "") {
                $transMessage = "Simpan Order Pelayanan";
                DB::commit();
                $result = array(
                    "status" => 201,
                    "message" => $transMessage,
                    "strukorder" => $dataSO,
                    "as" => 'inhuman',
                );
            } else {
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
                "message" => $transMessage,
                //                "nokirim" => $dataSO,//$noResep,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function hapusOrderPelayananLabRad(Request $request)
    {
        DB::beginTransaction();
        try {
            StrukOrder::where('norec', $request['norec_order'])->update(['statusenabled' => false]);

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Data Terhapus";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                //                    "strukorder" => $dataSO,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getRiwayatOrderRad(Request $request)
    {
        $results = [];

        $ruanganRad = explode(',', $this->settingDataFixed('kdRuanganRadiologiNew'));
        $kdRuangRad = [];
        foreach ($ruanganRad as $item) {
            $kdRuangRad[] = (int)$item;
        }
        $data = \DB::table('strukorder_t as so')
            //            ->LEFTJOIN('orderpelayanan_t as op','op.noorderfk','=','so.norec')
            ->LEFTJOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'so.noregistrasifk')
            ->LEFTJOIN('pasien_m as ps', 'pd.nocmfk', '=', 'ps.id')
            ->LEFTJOIN('ruangan_m as ru', 'ru.id', '=', 'so.objectruanganfk')
            ->LEFTJOIN('ruangan_m as ru2', 'ru2.id', '=', 'so.objectruangantujuanfk')
            ->LEFTJOIN('pegawai_m as p', 'p.id', '=', 'so.objectpegawaiorderfk')
            //            ->LEFTJOIN('ris_order as pp','pp.order_no','=','so.noorder')
            ->select(
                'so.norec',
                'so.tglorder',
                'so.noorder',
                'ru.namaruangan as ruanganasal',
                'ru2.namaruangan as ruangantujuan',
                'p.namalengkap',
                'so.statusorder',
                'pd.noregistrasi',
                'so.objectruangantujuanfk',
                'so.statusorder',
                'so.keteranganlainnya'
                //                DB::raw('case when pp.order_no is null then \'PENDING\' else \'SELESAI DIPERIKSA\' end as statusorder')
            );
        if (isset($request['noregistrasi']) && $request['noregistrasi'] != "" && $request['noregistrasi'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $request['noregistrasi']);
        }
        if (isset($request['NoCM']) && $request['NoCM'] != "" && $request['NoCM'] != "undefined") {
            $data = $data->where('ps.nocm', '=', $request['NoCM']);
        }
        $data = $data->whereIn('so.objectruangantujuanfk', $kdRuangRad);
        $data = $data->where('so.statusenabled', true);
        $data = $data->orderBy('so.tglorder');
        //        $data = $data->distinct();
        $data = $data->get();
        $status = '';
        foreach ($data as $item) {

            if ($item->objectruangantujuanfk != $this->settingDataFixed('kdRuanganElektromedik')) {
                $risorder = RisOrder::where('order_no', $item->noorder)->get();
                if (count($risorder) > 0) {
                    $status = 'Selesai Diperiksa';
                } else {
                    $status = 'Belum Kirim Ke RIS';
                }
            } else {
                if ($item->statusorder != null) {
                    $status = 'Verifikasi';
                } else {
                    $status = 'Belum Verifikasi';
                }
            }

            $details = DB::select(
                DB::raw("
                             select so.norec,so.tglorder,so.noorder,
                            pr.id,pr.namaproduk,op.qtyproduk
                            from strukorder_t as so
                            left join orderpelayanan_t as op on op.noorderfk = so.norec
                            left join pasiendaftar_t as pd on pd.norec=so.noregistrasifk
                            left join produk_m as pr on pr.id=op.objectprodukfk
                            left join ruangan_m as ru on ru.id=so.objectruanganfk
                            left join ruangan_m as ru2 on ru2.id=so.objectruangantujuanfk
                            left join pegawai_m as p on p.id=so.objectpegawaiorderfk
                            where so.noorder=:noorder"),
                array(
                    'noorder' => $item->noorder,
                )
            );
            $results[] = array(
                'noregistrasi' => $item->noregistrasi,
                'tglorder' => $item->tglorder,
                'noorder' => $item->noorder,
                'norec' => $item->norec,
                'namaruanganasal' => $item->ruanganasal,
                'namaruangantujuan' => $item->ruangantujuan,
                'dokter' => $item->namalengkap,
                'statusorder' => $status,
                'keteranganlainnya' =>  $item->keteranganlainnya,
                'details' => $details,
            );
        }

        $result = array(
            'daftar' => $results,
            'message' => 'er@epic',
        );

        return $this->respond($result);
    }

    public function getComboSurveilans(Request $request)
    {
        $dataLogin = $request->all();
        $dataPegawaiLogin = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id', $dataLogin['userData']['id'])
            ->first();

        $AsaScore = \DB::table('asascore_m as asa')
            ->select('asa.id', 'asa.asascore')
            ->where('asa.statusenabled', true)
            ->get();

        $JenisOperasi = \DB::table('jenisoperasi_m as jo')
            ->select('jo.id', 'jo.jenisoperasi')
            ->where('jo.kdprofile', 11)
            ->where('jo.statusenabled', true)
            ->get();

        $TindakanOperasi = \DB::table('tindakanoperasi_m as to')
            ->select('to.id', 'to.tindakanoperasi as namaproduk')
            ->where('to.kdprofile', 11)
            ->where('to.statusenabled', true)
            ->get();

        $JenisWaktu = \DB::table('jeniswaktu_m as jw')
            ->select('jw.id', 'jw.jeniswaktu')
            ->where('jw.statusenabled', true)
            ->get();

        $ruanganRi = \DB::table('ruangan_m as ru')
            ->whereIn('ru.objectdepartemenfk', [16, 17, 25, 35])
            //            ->wherein('ru.objectdepartemenfk', ['18', '28'])
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();

        $Infeksi = \DB::table('infeksinosokomial_m as ru')
            ->select('ru.id', 'ru.infeksinosokomial as infeksi')
            ->where('ru.statusenabled', true)
            ->orderBy('ru.id')
            ->get();

        $dataProduk = \DB::table('produk_m as pr')
            ->JOIN('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
            ->JOIN('jenisproduk_m as jp', 'jp.id', '=', 'djp.objectjenisprodukfk')
            ->leftJOIN('satuanstandar_m as ss', 'ss.id', '=', 'pr.objectsatuanstandarfk')
            ->JOIN('stokprodukdetail_t as spd', 'spd.objectprodukfk', '=', 'pr.id')
            ->select('pr.id', 'pr.kdproduk as kdsirs', 'pr.namaproduk', 'ss.id as ssid', 'ss.satuanstandar')
            ->where('pr.statusenabled', true)
            ->where('jp.id', 97)
            ->where('pr.isantibiotik', 1)
            ->groupBy('pr.id', 'pr.kdproduk', 'pr.namaproduk', 'ss.id', 'ss.satuanstandar')
            ->orderBy('pr.namaproduk')
            ->get();

        //
        $result = array(
            'asascore' => $AsaScore,
            'jenisoperasi' => $JenisOperasi,
            'ruangan' => $ruanganRi,
            'pegawailogin' => $dataPegawaiLogin,
            'jeniswaktu' => $JenisWaktu,
            'tindakanoperasi' => $TindakanOperasi,
            'infeksi' => $Infeksi,
            'produk' => $dataProduk,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getHistorySurveilans(Request $request)
    {
        $data = \DB::table('surveilans_t as sv')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'sv.noregistrasifk')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'sv.norec_apd')
            ->join('pasien_m as pm', 'pm.id', '=', 'pd.nocmfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftJoin('batalregistrasi_t as br', 'br.pasiendaftarfk', '=', 'pd.norec')
            ->select(DB::raw("sv.norec,sv.tglsurveilans,sv.nosurvailens,pm.nocm + ' / ' + pd.noregistrasi as nocmregis,
			                  pm.namapasien,ru.namaruangan"))
            ->whereNull('br.norec')
            ->where('sv.statusenabled', true);

        $filter = $request->all();
        if (isset($filter['namaPasien']) && $filter['namaPasien'] != "" && $filter['namaPasien'] != "undefined") {
            $data = $data->where('pm.namapasien', 'ilike', '%' . $filter['namaPasien'] . '%');
        }
        if (isset($filter['noRegis']) && $filter['noRegis'] != "" && $filter['noRegis'] != "undefined") {
            $data = $data->where('pd.noregistrasi', 'ilike', '%' . $filter['noRegis'] . '%');
        }
        if (isset($filter['noCm']) && $filter['noCm'] != "" && $filter['noCm'] != "undefined") {
            $data = $data->where('pm.nocm', 'ilike', '%' . $filter['noCm'] . '%');
        }
        $data = $data->get();

        $result = array(
            'data' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getHistoryDetailSurveilans(Request $request)
    {
        $filter = $request->all();
        $dataHead = \DB::table('surveilans_t as sv')
            ->leftJoin('diagnosa_m as dg', 'dg.id', '=', 'sv.diagnosamasukfk')
            ->leftJoin('diagnosa_m as dg1', 'dg1.id', '=', 'sv.diagnosakeluarfk')
            ->leftJoin('jeniswaktu_m as jw', 'jw.id', '=', 'sv.jeniswaktufk')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'sv.ruanganfk')
            ->select(DB::raw("sv.norec,sv.tglsurveilans,sv.nosurvailens,sv.diagnosamasukfk,dg.kddiagnosa,dg.namadiagnosa,
                             sv.keterangandiagnosamasuk,sv.diagnosakeluarfk,dg1.kddiagnosa as kddiagnosakeluar,dg1.namadiagnosa as namadiagnosakeluar,
                             sv.keterangandiagnosakeluar,sv.antibiotikprofillaksis,sv.dosis,sv.ruanganfk,ru.namaruangan,
                             sv.jeniswaktufk,jw.jeniswaktu,sv.culturdarah,sv.cultururine,sv.cultursputum"))
            ->where('sv.norec', $filter['noRec'])
            ->where('sv.statusenabled', true)
            ->get();

        $dataFaktorResiko = \DB::table('surveilansfaktorresiko_t as sv')
            ->Join('surveilans_t as svh', 'svh.norec', '=', 'sv.nosurvailensfk')
            ->select(DB::raw("sv.statusgizi,sv.dm,sv.guladarah,sv.merokok,
                             sv.obesitas,sv.pemeriksaankultur,sv.temp,sv.hasilkultur,
                             sv.tglinput"))
            ->where('svh.norec', $filter['noRec'])
            ->where('svh.statusenabled', true)
            ->get();

        $dataOperasi = \DB::table('surveilansoperasi_t as sv')
            ->Join('surveilans_t as svh', 'svh.norec', '=', 'sv.nosurvailensfk')
            ->leftJoin('diagnosa_m as dg', 'dg.id', '=', 'sv.diagnosafk')
            ->leftJoin('produk_m as pro', 'pro.id', '=', 'sv.produkfk')
            ->leftJoin('asascore_m as asa', 'asa.id', '=', 'sv.asascorefk')
            ->leftJoin('tindakanoperasi_m as op', 'op.id', '=', 'sv.tindakanoperasifk')
            ->leftJoin('jenisoperasi_m as jo', 'jo.id', '=', 'sv.jenisoperasifk')
            ->select(DB::raw("sv.diagnosafk,dg.kddiagnosa,dg.namadiagnosa,sv.keterangandiagnosa,
                             sv.produkfk,pro.namaproduk,sv.tgloperasi,sv.jamoperasi,sv.menitoperasi,
                             sv.asascorefk,asa.asascore,sv.tindakanoperasifk as idtindakan,op.tindakanoperasi,
                             sv.tglinput,sv.jenisoperasifk,jo.jenisoperasi,sv.score,sv.penyakitpenyerta,
                             sv.implant"))
            ->where('svh.norec', $filter['noRec'])
            ->where('svh.statusenabled', true)
            ->get();

        $dataFrd = \DB::table('surveilansfrd_t as sv')
            ->Join('surveilans_t as svh', 'svh.norec', '=', 'sv.nosurvailensfk')
            ->leftJoin('tindakanoperasi_m as op', 'op.id', '=', 'sv.tindakanoperasifk')
            ->leftJoin('infeksinosokomial_m as inf', 'inf.id', '=', 'sv.infeksifk')
            ->select(DB::raw("sv.norec,sv.tglmulai,sv.tglakhir,sv.tindakanoperasifk as idtindakan,op.tindakanoperasi as tindakan,
		                     sv.tglinfeksi,sv.infeksifk as idinfeksi,inf.infeksinosokomial as infeksi,sv.score,sv.status,
			                 sv.idsah,sv.idbatal,sv.lamapasang,sv.hasilkultur"))
            ->where('svh.norec', $filter['noRec'])
            ->where('svh.statusenabled', true)
            ->get();

        $dataAnti = \DB::table('surveilansantibiotik_t as sv')
            ->Join('surveilans_t as svh', 'svh.norec', '=', 'sv.nosurvailensfk')
            ->leftJoin('produk_m as op', 'op.id', '=', 'sv.tindakanoperasifk')
            ->select(DB::raw("sv.norec,sv.tglmulai,sv.tglakhir,sv.tindakanoperasifk as idantibiotika,op.namaproduk as antibiotika,
			                 sv.dosis,sv.metodepemberian,sv.status,sv.sah as idsah,sv.batal as idbatal"))
            ->where('svh.norec', $filter['noRec'])
            ->where('svh.statusenabled', true)
            ->get();

        $result = array(
            'datahead' => $dataHead,
            'faktorresiko' => $dataFaktorResiko,
            'operasi' => $dataOperasi,
            'datafrd' => $dataFrd,
            'dataanti' => $dataAnti,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function saveDataSurveilans(Request $request)
    {
        DB::beginTransaction();
        $tglAyeuna = date('Y-m-d H:i:s');
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id', $dataLogin['userData']['id'])
            ->first();

        try {

            $dataHead = $request['datahead'];
            $dataFaktorResiko = $request['faktorresiko'];
            $dataOperasi = $request['operasi'];
            $dataFrd = $request['faktorResikorawat'];
            $dataAnti = $request['antibiotika'];


            if ($dataHead['norec'] == '') {
                $noSurvailens = $this->generateCode(new Surveilans(), 'nosurvailens', 12, 'SV-' . $this->getDateTime()->format('ym'));
                $dataSurveilans = new Surveilans();
                $dataSurveilans->norec = $dataSurveilans->generateNewId();
                $dataSurveilans->kdprofile = 11;
                $dataSurveilans->statusenabled = 1;
                $dataSurveilans->nosurvailens = $noSurvailens;
                $dataSurveilans->noregistrasifk = $dataHead['norec_pd'];
                $dataSurveilans->norec_apd = $dataHead['norec_apd'];
            } else {
                $dataSurveilans = Surveilans::where('norec', $dataHead['norec'])->first();
            }
            $dataSurveilans->tglsurveilans = $dataHead['tglsurveilans'];
            $dataSurveilans->diagnosamasukfk = $dataHead['diagnosamasukfk'];
            $dataSurveilans->diagnosakeluarfk = $dataHead['diagnosakeluarfk'];
            $dataSurveilans->keterangandiagnosamasuk = $dataHead['keterangandiagnosamasuk'];
            $dataSurveilans->keterangandiagnosakeluar = $dataHead['keterangandiagnosakeluar'];
            $dataSurveilans->antibiotikprofillaksis = $dataHead['antibiotikprofillaksis'];
            $dataSurveilans->dosis = $dataHead['dosis'];
            $dataSurveilans->ruanganfk = $dataHead['ruanganfk'];
            $dataSurveilans->jeniswaktufk = $dataHead['jeniswaktufk'];
            $dataSurveilans->culturdarah = $dataHead['culturdarah'];
            $dataSurveilans->cultururine = $dataHead['cultururine'];
            $dataSurveilans->cultursputum = $dataHead['cultursputum'];
            $dataSurveilans->save();
            $norecSurveilan = $dataSurveilans->norec;

            if ($dataFaktorResiko != "") {
                if ($dataHead['norec'] == "") {
                    $dataSurveilansFR = new SurveilansFaktorResiko();
                    $dataSurveilansFR->kdprofile = 11;
                    $dataSurveilansFR->statusenabled = true;
                    $dataSurveilansFR->norec = $dataSurveilansFR->generateNewId();
                    $dataSurveilansFR->nosurvailensfk = $norecSurveilan;
                } else {
                    $dataSurveilansFR = SurveilansFaktorResiko::where('nosurvailensfk', $dataHead['norec'])->first();
                }
                $dataSurveilansFR->statusgizi = $dataFaktorResiko['statusgizi'];
                $dataSurveilansFR->dm = $dataFaktorResiko['dm'];
                $dataSurveilansFR->guladarah = $dataFaktorResiko['guladarah'];
                $dataSurveilansFR->merokok = $dataFaktorResiko['merokok'];
                $dataSurveilansFR->obesitas = $dataFaktorResiko['obesitas'];
                $dataSurveilansFR->pemeriksaankultur = $dataFaktorResiko['pemeriksaankultur'];
                $dataSurveilansFR->temp = $dataFaktorResiko['temp'];
                $dataSurveilansFR->hasilkultur = $dataFaktorResiko['hasilkultur'];
                $dataSurveilansFR->tglinput = $dataFaktorResiko['tglinput'];
                $dataSurveilansFR->save();
            }

            if ($dataOperasi != "") {
                if ($dataHead['norec'] == "") {
                    $dataSurveilansOPM = new SurveilansOperasi();
                    $dataSurveilansOPM->kdprofile = 11;
                    $dataSurveilansOPM->statusenabled = 1;
                    $dataSurveilansOPM->norec = $dataSurveilansOPM->generateNewId();
                    $dataSurveilansOPM->nosurvailensfk = $norecSurveilan;
                } else {
                    $dataSurveilansOPM = SurveilansOperasi::where('nosurvailensfk', $dataHead['norec'])->first();
                }
                $dataSurveilansOPM->diagnosafk = $dataOperasi['diagnosafk'];
                $dataSurveilansOPM->keterangandiagnosa = $dataOperasi['keterangandiagnosa'];
                $dataSurveilansOPM->produkfk = $dataOperasi['produkfk'];
                $dataSurveilansOPM->tgloperasi = $dataOperasi['tgloperasi'] != 'Invalid date' ? $dataOperasi['tgloperasi'] : null;
                $dataSurveilansOPM->jamoperasi = $dataOperasi['jamoperasi'];
                $dataSurveilansOPM->menitoperasi = $dataOperasi['menitoperasi'];
                $dataSurveilansOPM->asascorefk = $dataOperasi['asascorefk'];
                //                        $dataSurveilansOPM->tindakanoperasifk = $dataOperasi['tindakanoperasifk'];
                $dataSurveilansOPM->tglinput = $dataOperasi['tglinput'];
                $dataSurveilansOPM->jenisoperasifk = $dataOperasi['jenisoperasifk'];
                $dataSurveilansOPM->score = $dataOperasi['score'];
                $dataSurveilansOPM->penyakitpenyerta = $dataOperasi['penyakitpenyerta'];
                $dataSurveilansOPM->implant = $dataOperasi['implant'];
                $dataSurveilansOPM->save();
            }

            if ($dataFrd != "") {
                foreach ($dataFrd as $hideung) {
                    if ($hideung['norec'] == "") {
                        $dataSaveFRD = new SurveilansFrd();
                        $dataSaveFRD->kdprofile = 11;
                        $dataSaveFRD->statusenabled = 1;
                        $dataSaveFRD->norec = $dataSaveFRD->generateNewId();
                        $dataSaveFRD->nosurvailensfk = $norecSurveilan;
                    } else {
                        $dataSaveFRD = SurveilansFrd::where('norec', $hideung['norec'])
                            ->where('nosurvailensfk', $dataHead['norec'])
                            ->first();
                    }
                    //                    return $this->respond($hideung['tglakhir'] != "Invalid date");
                    if (isset($hideung['tglmulai']) && $hideung['tglmulai'] != "Invalid date") {
                        $dataSaveFRD->tglmulai = $hideung['tglmulai'];
                    }

                    if (isset($hideung['tglakhir']) && $hideung['tglakhir'] != "Invalid date") {
                        $dataSaveFRD->tglakhir = $hideung['tglakhir'];
                    }

                    if (isset($hideung['tglinfeksi']) && $hideung['tglinfeksi'] != "Invalid date") {
                        $dataSaveFRD->tglinfeksi = $hideung['tglinfeksi'];
                    }

                    $dataSaveFRD->tindakanoperasifk = $hideung['idtindakan'];
                    $dataSaveFRD->infeksifk = $hideung['idinfeksi'];
                    $dataSaveFRD->score = $hideung['score'];
                    $dataSaveFRD->status = $hideung['status'];
                    $dataSaveFRD->idsah = $hideung['idsah'];
                    $dataSaveFRD->idbatal = $hideung['idbatal'];
                    $dataSaveFRD->lamapasang = $hideung['lamapasang'];
                    $dataSaveFRD->hasilkultur = $hideung['hasilkultur'];
                    $dataSaveFRD->save();
                }
            }

            if ($dataAnti != "") {
                if (count($dataAnti) == 0) {
                    $dataSaveAnti = SurveilansAntibiotik::where('nosurvailensfk', $dataHead['norec'])
                        // ->where('nosurvailensfk',$dataHead['norec'])
                        ->delete();
                }
                foreach ($dataAnti as $hideung) {
                    if ($hideung['norec'] == "") {
                        $dataSaveAnti = new SurveilansAntibiotik();
                        $dataSaveAnti->kdprofile = 11;
                        $dataSaveAnti->statusenabled = 1;
                        $dataSaveAnti->norec = $dataSaveAnti->generateNewId();
                        $dataSaveAnti->nosurvailensfk = $norecSurveilan;
                    } else {
                        $dataSaveAnti = SurveilansAntibiotik::where('norec', $hideung['norec'])
                            ->where('nosurvailensfk', $dataHead['norec'])
                            ->first();
                    }

                    if (isset($hideung['tglmulai']) && $hideung['tglmulai'] != "Invalid date") {
                        $dataSaveAnti->tglmulai = $hideung['tglmulai'];
                    }

                    if (isset($hideung['tglakhir']) && $hideung['tglakhir'] != "Invalid date") {
                        $dataSaveAnti->tglakhir = $hideung['tglakhir'];
                    }

                    $dataSaveAnti->tindakanoperasifk = $hideung['idantibiotika'];
                    $dataSaveAnti->dosis = $hideung['dosis'];
                    $dataSaveAnti->metodepemberian = $hideung['metodepemberian'];
                    $dataSaveAnti->status = $hideung['status'];
                    $dataSaveAnti->sah = $hideung['idsah'];
                    $dataSaveAnti->batal = $hideung['idbatal'];
                    $dataSaveAnti->save();
                }
            }

            ## Logging User
            if ($dataHead['norec'] == "") {
                $newId = LoggingUser::max('id');
                $newId = $newId + 1;
                $logUser = new LoggingUser();
                $logUser->id = $newId;
                $logUser->norec = $logUser->generateNewId();
                $logUser->kdprofile = 0;
                $logUser->statusenabled = true;
                $logUser->jenislog = 'Input Data Surveilans';
                $logUser->noreff = $norecSurveilan;
                $logUser->referensi = 'norec surveilans';
                $logUser->objectloginuserfk = $dataLogin['userData']['id'];
                $logUser->tanggal = $tglAyeuna;
                $logUser->save();
            } else {
                $newId = LoggingUser::max('id');
                $newId = $newId + 1;
                $logUser = new LoggingUser();
                $logUser->id = $newId;
                $logUser->norec = $logUser->generateNewId();
                $logUser->kdprofile = 0;
                $logUser->statusenabled = true;
                $logUser->jenislog = 'Edit Data Surveilans';
                $logUser->noreff = $norecSurveilan;
                $logUser->referensi = 'norec surveilans';
                $logUser->objectloginuserfk = $dataLogin['userData']['id'];
                $logUser->tanggal = $tglAyeuna;
                $logUser->save();
            }


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
                "message" => $transMessage,
                "as" => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function hapusDataSurveilans(Request $request)
    {
        DB::beginTransaction();
        $tglAyeuna = date('Y-m-d H:i:s');
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id', $dataLogin['userData']['id'])
            ->first();
        try {

            $Kel = Surveilans::where('norec', $request['norec'])
                ->update([
                    'statusenabled' => '0',
                ]);

            //## Logging User
            $newId = LoggingUser::max('id');
            $newId = $newId + 1;
            $logUser = new LoggingUser();
            $logUser->id = $newId;
            $logUser->norec = $logUser->generateNewId();
            $logUser->kdprofile = 0;
            $logUser->statusenabled = true;
            $logUser->jenislog = 'Batal Surveilans';
            $logUser->noreff = $request['data']['norec'];
            $logUser->referensi = 'norec surveilans';
            $logUser->objectloginuserfk = $dataLogin['userData']['id'];
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
                'message' => $transMessage,
                'as' => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDataECG(Request $request)
    {
        //        $noRegistrasi = $request['noregistrasi'];
        $data = \DB::table('eecg_t as emr')
            ->select('emr.*')
            //            ->where('emr.customerid','=',$request['custid'])
            ->orderBy('emr.urut');
        if (isset($request['custid']) && $request['custid'] != '') {
            $data = $data->where('emr.customerid', $request['custid']);
        }
        if (isset($request['datesend']) && $request['datesend'] != '') {
            $data = $data->where('emr.norec', 'ilike', $request['datesend'] . '%');
        }
        if (isset($request['vis']) && $request['vis'] != '') {
            if ($request['vis'] == 'true') {
                $data = $data->where('emr.statusenabled', $request['vis']);
            } else {
                $data = $data->whereNull('emr.statusenabled');
            }
        }
        //        $data= $data->whereNull('emr.kodeexternal');
        $data = $data->get();
        //            ->where('statusenabled','true')
        //            ->get();


        $result = array(
            'data' => $data,
            'message' => 'as@epic',
        );
        return $this->respond($result);
    }

    public function SaveTransaksiECG(Request $request)
    {
        DB::beginTransaction();
        //        $dataReq = $request->all();

        try {

            $data1 = EECG::where('norec', 'ilike', $request['head']['datesend'] . '%')
                //                ->where('customerid', $request['head']['customerid'])
                ->where('kunci', 'expertise')
                ->update(
                    [
                        'nilai' => $request['head']['expertise']
                    ]
                );
            $data1 = EECG::where('datesend', 'ilike', $request['head']['datesend'] . '%')
                //                ->where('customerid', $request['head']['customerid'])
                ->where('kunci', 'CustomerID')
                ->update(
                    [
                        'nilai' => $request['head']['customerid']
                    ]
                );
            //            $data3 = EECG::where('customerid', $request['head']['customerid'])
            //                ->where('statusenabled', true)
            //                ->update([
            //                        'kodeexternal' => 'old']
            //                );
            $data2 = EECG::where('datesend', 'ilike', $request['head']['datesend'] . '%')
                //              ->where('customerid', $request['head']['customerid'])
                //                ->where('kunci', $request->kunci)
                ->update(
                    [
                        'statusenabled' => true,
                        'dateverif' => $this->getDateTime()->format('Y-m-d H:i:s'),
                        'customerid' => $request['head']['customerid']
                    ]
                );


            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = 'Saving ECG ';

        if ($transStatus == 'true') {
            $transMessage = $transMessage . "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => $data1,
                "data2" => $data2,
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

    public function getDaftarECG(Request $request)
    {
        $custid = '';
        if (isset($request['custid']) && $request['custid'] != '') {
            $custid = "where  customerid = '" . $request['custid'] . "'";
        }
        $data = DB::select(DB::raw(
            " 
              select distinct top 20  SUBSTRING(norec,1,10) as datesend,customerid 
              from eecg_t 
               $custid order by SUBSTRING(norec,1,10)  desc"
        ));

        return $this->respond($data);
    }

    public function getOrderOK(Request $request)
    {
        $results = [];
        $data = \DB::table('strukorder_t as so')
            ->LEFTJOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'so.noregistrasifk')
            ->JOIN('pasien_m as pas', 'pas.id', '=', 'pd.nocmfk')
            ->LEFTJOIN('ruangan_m as ru', 'ru.id', '=', 'so.objectruanganfk')
            ->LEFTJOIN('ruangan_m as ru2', 'ru2.id', '=', 'so.objectruangantujuanfk')
            ->LEFTJOIN('pegawai_m as p', 'p.id', '=', 'so.objectpegawaiorderfk')
            ->LEFTJOIN('reshd as pp', 'pp.ono', '=', 'so.noorder')
            ->leftJoin('jadwaloperasijkn_t as jdop', 'jdop.noregistrasifk', '=', 'pd.norec')
            ->select(
                'so.norec',
                'pd.norec as norecpd',
                'pd.noregistrasi',
                'so.tglorder',
                'so.noorder',
                'ru.namaruangan as ruanganasal',
                'ru2.namaruangan as ruangantujuan',
                'p.namalengkap',
                'pp.ono',
                // DB::raw('case when pd.noregistrasi is null then \'PENDING\' else \'Verifikasi\' end as statusorder')
                 (DB::raw("CASE WHEN so.status IS NULL 
                         THEN 'MASUK' ELSE 'Sudah Verifikasi' END AS statusorder,                       
						 CASE WHEN so.status IS NULL 
                         THEN 'MENUNGGU'
                         WHEN jdop.terlaksana = false THEN 'ANTREAN' ELSE 'Selesai'
                         END AS statusantrianjkn"))
            );
        if (isset($request['noregistrasi']) && $request['noregistrasi'] != "" && $request['noregistrasi'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $request['noregistrasi']);
        }
        if (isset($request['NoCM']) && $request['NoCM'] != "" && $request['NoCM'] != "undefined") {
            $data = $data->where('pas.nocm', 'ilike', '%' . $request['NoCM'] . '%');
        }
        $data = $data->where('ru2.objectdepartemenfk', 25);
        $data = $data->where('so.statusenabled', true);
        //        $data = $data->where('apd.objectruanganfk',276);
        $data = $data->orderBy('so.tglorder');
        //        $data = $data->distinct();
        $data = $data->get();

        //$results =array();
        foreach ($data as $item) {
            $details = DB::select(
                DB::raw("
                            select so.tglorder,so.noorder,
                            pr.id,pr.namaproduk,op.*
                            from strukorder_t as so
                            left join orderpelayanan_t as op on op.noorderfk = so.norec
                            left join pasiendaftar_t as pd on pd.norec=so.noregistrasifk
                            left join produk_m as pr on pr.id=op.objectprodukfk
                            left join ruangan_m as ru on ru.id=so.objectruanganfk
                            left join ruangan_m as ru2 on ru2.id=so.objectruangantujuanfk
                            left join pegawai_m as p on p.id=so.objectpegawaiorderfk
                            where so.noorder=:noorder"),
                array(
                    'noorder' => $item->noorder,
                )
            );
            $results[] = array(
                'tglorder' => $item->tglorder,
                'noorder' => $item->noorder,
                'norec' => $item->norec,
                'norecpd' => $item->norecpd,
                //                'norecapd' => $item->norecapd,
                'namaruanganasal' => $item->ruanganasal,
                'namaruangantujuan' => $item->ruangantujuan,
                'dokter' => $item->namalengkap,
                'statusorder' => $item->statusorder,
                'details' => $details,
            );
        }

        $result = array(
            'daftar' => $results,
            'message' => 'mn@epic',
        );

        return $this->respond($result);
    }

    public function getPegawaiParts(Request $request)
    {
        $req = $request->all();
        $dataProduk = \DB::table('pegawai_m')
            ->select('id', 'namalengkap')
            ->where('statusenabled', true)
            ->orderBy('namalengkap');
        if (
            isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $dataProduk = $dataProduk->where('namalengkap', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%');
        };
        if (
            isset($req['namalengkap']) &&
            $req['namalengkap'] != "" &&
            $req['namalengkap'] != "undefined"
        ) {
            $dataProduk = $dataProduk->where('namalengkap', 'ilike', '%' . $req['namalengkap'] . '%');
        };
        if (
            isset($req['id']) &&
            $req['id'] != "" &&
            $req['id'] != "undefined"
        ) {
            $dataProduk = $dataProduk->where('id', $req['id']);
        };
        $dataProduk = $dataProduk->take(10);
        $dataProduk = $dataProduk->get();

        return $this->respond($dataProduk);
    }

    public function getComboJensiDiagnosaPart(Request $request)
    {
        $req = $request->all();
        $dataProduk = \DB::table('jenisdiagnosa_m')
            ->select('id as value', 'jenisdiagnosa as text')
            ->where('statusenabled', true)
            //            ->where('objectjenispegawaifk',1)
            ->orderBy('jenisdiagnosa');
        if (
            isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $dataProduk = $dataProduk->where('jenisdiagnosa', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%');
        };
        $dataProduk = $dataProduk->take(10);
        $dataProduk = $dataProduk->get();

        return $this->respond($dataProduk);
    }

    public function getDataComboDiagnosa9Part(Request $request)
    {
        $req = $request->all();
        $data = \DB::table('diagnosatindakan_m')
            ->select('id as value', 'kddiagnosatindakan', 'namadiagnosatindakan as text')
            ->where('statusenabled', true)
            ->orderBy('kddiagnosatindakan');
        if (
            isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $data = $data->where('kddiagnosatindakan', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%');
            $data = $data->orwhere('namadiagnosatindakan', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%');
        };
        $data = $data->take(10);
        $data = $data->get();

        $dt = [];
        foreach ($data as $item) {
            $dt[] = array(
                'value' => $item->value,
                'text' => $item->kddiagnosatindakan . ' ' . $item->text,
            );
        }

        return $this->respond($dt);
    }

    public function hapusOrderResep(Request $request)
    {
        DB::beginTransaction();
        try {
            $so = StrukOrder::where('norec', $request['norec'])->first();
            if ($so->statusorder == 5) {
                $transMessage = "Tidak Bisa dihapus sudah Di Verifikasi";
                $result = array(
                    "status" => 400,
                    "message" => $transMessage,
                    "as" => 'er@epic',
                );
                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }
            StrukOrder::where('norec', $request['norec'])->update(['statusenabled' => false]);

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Data Terhapus";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                //                    "strukorder" => $dataSO,
                "as" => 'er@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "as" => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    

    public function hapusEMRTransaksi(Request $request)
    {
        DB::beginTransaction();
        try {

            EMRPasien::where('norec', $request['norec'])
                ->where('emrfk', $request['emrfk'])
                ->update(['statusenabled' => false]);

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Data Terhapus";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                //                    "strukorder" => $dataSO,
                "as" => 'er@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "as" => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getObatSeringDiresepkanDokter(Request $request)
    {
        $data = DB::select(DB::raw('select top 10 * from (select prd.id,prd.namaproduk , count(prd.id) as jml
             from orderpelayanan_t as op
            join strukorder_t as so on so.norec= op.noorderfk
            join produk_m as prd on prd.id = op.objectprodukfk
            join pegawai_m as pg on pg.id = so.kddokter
            where pg.objectjenispegawaifk =1
            group by prd.namaproduk,prd.id
            ) as x order by x.jml desc '));
        $result = array(
            'data' => $data,
            'as' => 'er@epic'
        );
        return $this->respond($result);
    }

    public function getDataComboKelompokPaisnePart(Request $request)
    {
        $req = $request->all();
        $data = \DB::table('kelompokpasien_m as pr')
            ->select('pr.id as value', 'pr.kelompokpasien as text')
            ->where('pr.statusenabled', true)
            ->orderBy('pr.kelompokpasien');
        if (
            isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $data = $data->where('pr.kelompokpasien', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%');
        };
        $data = $data->take(10);
        $data = $data->get();

        return $this->respond($data);
    }

    public function getDataComboKelasPart(Request $request)
    {
        $req = $request->all();
        $data = \DB::table('kelas_m as pr')
            ->select('pr.id as value', 'pr.namakelas as text')
            ->where('pr.statusenabled', true)
            ->orderBy('pr.namakelas');
        if (
            isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $data = $data->where('pr.namakelas', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%');
        };
        $data = $data->take(10);
        $data = $data->get();

        return $this->respond($data);
    }

    public function getDataComboAgama(Request $request)
    {
        $req = $request->all();
        $dataProduk = \DB::table('agama_m')
            ->select('id as value', 'agama as text')
            ->where('statusenabled', true)
            ->orderBy('agama');
        if (
            isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $dataProduk = $dataProduk->where('agama', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%');
        };
        $dataProduk = $dataProduk->take(10);
        $dataProduk = $dataProduk->get();

        return $this->respond($dataProduk);
    }

    public function SimpanDelegasiPemberiObat(Request $request)
    {
        DB::beginTransaction();

        $r_SR = $request["0"]['strukorder'];
        try {

            $tglpelayanan1 = $r_SR['tglpelayanan'];
            $tglpelayanan2 = $r_SR['tglpelayanan2'];

            $period = new \DatePeriod(
                new \DateTime($tglpelayanan1),
                new \DateInterval('P1D'),
                new \DateTime($tglpelayanan2)
            );



            foreach ($period as $key => $value) {
                $tglpelayanan = $value->format('Y-m-d');

                if ($r_SR['norec'] == '') {
                    $newSO = new FormulisObat();
                    $norecSO = $newSO->generateNewId();
                    $newSO->norec = $norecSO;
                    $newSO->kdprofile = 0;
                    $newSO->statusenabled = true;
                } else {
                    $newSO = FormulisObat::where('norec', $r_SR['norec'])->first();
                    //   $noOrder = $newSO->noorder;
                    FormulisObatDetail::where('formulirobatfk', $newSO->norec)->delete();
                }
                $newSO->norec_pd = $r_SR['norec_pd'];
                $newSO->norec_apd = $r_SR['norec_apd'];
                $newSO->nocmfk = $r_SR['nocmfk'];
                $newSO->tglpelayanan = $tglpelayanan;
                $newSO->pegawaifarmasifk = $r_SR['pegawaifarmasifk'];
                $newSO->perawatfk = $r_SR['perawatfk'];
                $newSO->alergi = $r_SR['alergi'];
                $newSO->save();
                $norec_SR = $newSO->norec;


                //## PelayananPasien
                $r_PP = $request["0"]['detail'];
                foreach ($r_PP as $r_PPL) {
                    $newPP = new FormulisObatDetail();
                    $norecPP = $newPP->generateNewId();
                    $newPP->norec = $norecPP;
                    $newPP->kdprofile = 0;
                    $newPP->statusenabled = true;
                    $newPP->produkfk = $r_PPL['produkfk'];
                    $newPP->tglpelayanan = $tglpelayanan;
                    $newPP->routefk = $r_PPL['routefk'];
                    $newPP->dosis = $r_PPL['dosis'];
                    $newPP->ispagi = $r_PPL['ispagi'];
                    $newPP->issiang = $r_PPL['issiang'];
                    $newPP->ismalam = $r_PPL['ismalam'];
                    $newPP->issore = $r_PPL['issore'];
                    $newPP->pegawaifarmasifk = $r_SR['pegawaifarmasifk'];
                    $newPP->perawatfk = $r_SR['perawatfk'];
                    $newPP->formulirobatfk = $norec_SR;
                    $newPP->save();
                }
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "noresep" => $newSO, //$noResep,,//$noResep,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Simpan Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "noresep" => $newSO, //$noResep,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDaftarDelegasiObat(Request $request)
    {
        $dataLogin = $request->all();
        $data = \DB::table('formulirobat_t as fr')
            ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'fr.norec_pd')
            ->JOIN('pasien_m as pm', 'pm.id', '=', 'pd.nocmfk')
            ->LEFTJOIN('pegawai_m as pg', 'pg.id', '=', 'fr.pegawaifarmasifk')
            ->LEFTJOIN('pegawai_m as pg1', 'pg1.id', '=', 'fr.perawatfk')
            ->select(DB::raw("fr.norec,pd.noregistrasi,pm.nocm,pm.namapasien,fr.tglpelayanan,fr.pegawaifarmasifk,
                              fr.perawatfk,pg.namalengkap as pegawaifarmasi,pg1.namalengkap as perawat,fr.alergi"))
            ->orderBy('fr.tglpelayanan', 'desc');

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('fr.tglpelayanan', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];
            $data = $data->where('fr.tglpelayanan', '<=', $tgl);
        }
        if (isset($request['Noreg']) && $request['Noreg'] != "" && $request['Noreg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $request['Noreg']);
        }
        if (isset($request['noRM']) && $request['noRM'] != "" && $request['noRM'] != "undefined") {
            $data = $data->where('pm.nocm', 'ilike', '%' . $request['noRM'] . '%');
        }
        $data = $data->where('fr.statusenabled', true);
        $data = $data->get();
        $result = [];
        // CASE WHEN frd.keterangan IS NOT NULL THEN frd.keterangan
        // WHEN frd.keterangansiang IS NOT NULL THEN frd.keterangansiang
        // WHEN frd.keterangansore IS NOT NULL THEN frd.keterangansore
        // WHEN frd.keteranganmalam IS NOT NULL THEN frd.keteranganmalam
        // END AS keterangan,
        // CASE WHEN frd.jamperawatdelegasi IS NOT NULL THEN frd.jamperawatdelegasi
        // WHEN frd.jamperawatdelegasisiang IS NOT NULL THEN frd.jamperawatdelegasisiang
        // WHEN frd.jamperawatdelegasisore IS NOT NULL THEN frd.jamperawatdelegasisore
        // WHEN frd.jamperawatdelegasimalam IS NOT NULL THEN frd.jamperawatdelegasimalam
        // END AS jamperawatdelegasi	
        foreach ($data as $item) {
            $details = DB::select(
                DB::raw("select x.* from (select frd.norec,frd.produkfk,pr.namaproduk,frd.routefk,rf.name as route,
                                         frd.dosis,CASE WHEN frd.ispagi = 1 THEN 'P (6.00 - 7.00)' 
                                         WHEN frd.issiang = 1 THEN 'S (12.00 - 13.00)' 
                                         WHEN frd.issore = 1 THEN 'SR (18.00 - 19.00)' 
                                         WHEN frd.ismalam = 1 THEN 'M (23.00 - 24.00)' ELSE '-' END AS waktuminum,
                                         frd.pegawaifarmasifk,frd.perawatfk,pg.namalengkap as pegawaifarmasi,
                                         frd.formulirobatfk, frd.keterangan,
                                         CASE WHEN frd.perawatfk IS NOT NULL THEN pg1.namalengkap 
                                         WHEN frd.perawatsiangfk IS NOT NULL THEN pg2.namalengkap
                                         WHEN frd.perawatsorefk IS NOT NULL THEN pg3.namalengkap
                                         WHEN frd.perawatmalamfk IS NOT NULL THEN pg4.namalengkap
                                         END AS perawat,
                                         CASE WHEN frd.perawatfk IS NOT NULL THEN frd.perawatfk
                                         WHEN frd.perawatsiangfk IS NOT NULL THEN frd.perawatsiangfk
                                         WHEN frd.perawatsorefk IS NOT NULL THEN frd.perawatsorefk
                                         WHEN frd.perawatmalamfk IS NOT NULL THEN frd.perawatmalamfk
                                         END AS perawatdetail, SUBSTRING(CONVERT(VARCHAR, frd.tglperawatdelegasi, 120), 12, 5) AS jamperawatdelegasi		
                                    from formulirobatdetail_t as frd 
                                    left JOIN produk_m as pr on pr.id=frd.produkfk
                                    left JOIN routefarmasi as rf on rf.id=frd.routefk
                                    left JOIN pegawai_m as pg on pg.id=frd.pegawaifarmasifk
                                    left JOIN pegawai_m as pg1 on pg1.id=frd.perawatfk
                                    left JOIN pegawai_m as pg2 on pg2.id=frd.perawatsiangfk
                                    left JOIN pegawai_m as pg3 on pg3.id=frd.perawatsorefk
                                    left JOIN pegawai_m as pg4 on pg4.id=frd.perawatmalamfk) as x
                                    where x.formulirobatfk=:norec"),
                array(
                    'norec' => $item->norec,
                )
            );
            //            $details = DB::select(DB::raw("
            //                select x.* from
            //                (
            //                select
            //                    frd.norec,
            //                    frd.produkfk,
            //                    pr.namaproduk,
            //                    frd.routefk,
            //                    rf.name as route,
            //                    frd.dosis,
            //                    'P (6.00 - 7.00)' AS waktuminum,
            //                    frd.pegawaifarmasifk,
            //                    frd.perawatfk,
            //                    pg.namalengkap as pegawaifarmasi,
            //                    pg1.namalengkap as perawat,
            //                    frd.formulirobatfk,
            //                    frd.keterangan,
            //                    frd.perawatfk AS perawatdetail
            //                from formulirobatdetail_t as frd
            //                left JOIN produk_m as pr on pr.id=frd.produkfk
            //                left JOIN routefarmasi as rf on rf.id=frd.routefk
            //                left JOIN pegawai_m as pg on pg.id=frd.pegawaifarmasifk
            //                left JOIN pegawai_m as pg1 on pg1.id=frd.perawatfk
            //                where frd.ispagi=1
            //
            //
            //                UNION
            //
            //                select
            //                    frd.norec,
            //                    frd.produkfk,
            //                    pr.namaproduk,
            //                    frd.routefk,
            //                    rf.name as route,
            //                    frd.dosis,
            //                    'S (12.00 - 13.00)' AS waktuminum,
            //                    frd.pegawaifarmasifk,
            //                    frd.perawatfk,
            //                    pg.namalengkap as pegawaifarmasi,
            //                    pg1.namalengkap as perawat,
            //                    frd.formulirobatfk,
            //                    frd.keterangan,
            //                    frd.perawatsiangfk AS perawatdetail
            //                from formulirobatdetail_t as frd
            //                left JOIN produk_m as pr on pr.id=frd.produkfk
            //                left JOIN routefarmasi as rf on rf.id=frd.routefk
            //                left JOIN pegawai_m as pg on pg.id=frd.pegawaifarmasifk
            //                left JOIN pegawai_m as pg1 on pg1.id=frd.perawatsiangfk
            //                where frd.issiang=1
            //
            //
            //                UNION
            //
            //                select
            //                    frd.norec,
            //                    frd.produkfk,
            //                    pr.namaproduk,
            //                    frd.routefk,
            //                    rf.name as route,
            //                    frd.dosis,
            //                    'SR (18.00 - 19.00)' AS waktuminum,
            //                    frd.pegawaifarmasifk,
            //                    frd.perawatfk,
            //                    pg.namalengkap as pegawaifarmasi,
            //                    pg1.namalengkap as perawat,
            //                    frd.formulirobatfk,
            //                    frd.keterangan,
            //                    frd.perawatsorefk AS perawatdetail
            //                from formulirobatdetail_t as frd
            //                left JOIN produk_m as pr on pr.id=frd.produkfk
            //                left JOIN routefarmasi as rf on rf.id=frd.routefk
            //                left JOIN pegawai_m as pg on pg.id=frd.pegawaifarmasifk
            //                left JOIN pegawai_m as pg1 on pg1.id=frd.perawatsorefk
            //                where frd.issore=1
            //
            //
            //                UNION
            //
            //                select
            //                    frd.norec,
            //                    frd.produkfk,
            //                    pr.namaproduk,
            //                    frd.routefk,
            //                    rf.name as route,
            //                    frd.dosis,
            //                    'M (23.00 - 24.00)' AS waktuminum,
            //                    frd.pegawaifarmasifk,
            //                    frd.perawatfk,
            //                    pg.namalengkap as pegawaifarmasi,
            //                    pg1.namalengkap as perawat,
            //                    frd.formulirobatfk,
            //                    frd.keterangan,
            //                    frd.perawatmalamfk AS perawatdetail
            //                from formulirobatdetail_t as frd
            //                left JOIN produk_m as pr on pr.id=frd.produkfk
            //                left JOIN routefarmasi as rf on rf.id=frd.routefk
            //                left JOIN pegawai_m as pg on pg.id=frd.pegawaifarmasifk
            //                left JOIN pegawai_m as pg1 on pg1.id=frd.perawatmalamfk
            //                where frd.ismalam=1) as x
            //                where x.formulirobatfk=:norec
            //
            //            "),
            //                array(
            //                    'norec' => $item->norec,
            //                )
            //            );

            //            $details = DB::select(DB::raw("select frd.produkfk,pr.namaproduk,frd.routefk,rf.name as route,
            //                                            frd.dosis,frd.ispagi,frd.issiang,frd.ismalam,frd.issore,frd.pegawaifarmasifk,
            //                                            frd.perawatfk,pg.namalengkap as pegawaifarmasi,pg1.namalengkap as perawat
            //                                from formulirobatdetail_t as frd
            //                                left JOIN produk_m as pr on pr.id=frd.produkfk
            //                                left JOIN routefarmasi as rf on rf.id=frd.routefk
            //                                left JOIN pegawai_m as pg on pg.id=frd.pegawaifarmasifk
            //                                left JOIN pegawai_m as pg1 on pg1.id=frd.perawatfk
            //                                where frd.formulirobatfk=:norec"),
            //                array(
            //                    'norec' => $item->norec,
            //                )
            //            );
            $result[] = array(
                'tglpelayanan' => $item->tglpelayanan,
                'norec' => $item->norec,
                'noregistrasi' => $item->noregistrasi,
                'nocm' => $item->nocm,
                'namapasien' => $item->namapasien,
                'pegawaifarmasifk' => $item->pegawaifarmasifk,
                'perawatfk' => $item->perawatfk,
                'pegawaifarmasi' => $item->pegawaifarmasi,
                'perawat' => $item->perawat,
                'details' => $details,
            );
        }
        $results = array(
            'daftar' => $result,
            'datalogin' => $dataLogin,
            'message' => 'as@epic',
        );

        return $this->respond($results);
    }

    public function getDelegasiObat(Request $request)
    {
        $dataLogin = $request->all();
        $Norec = $request['Norec'];
        $data = \DB::table('formulirobat_t as fr')
            ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'fr.norec_pd')
            ->JOIN('pasien_m as pm', 'pm.id', '=', 'pd.nocmfk')
            ->LEFTJOIN('pegawai_m as pg', 'pg.id', '=', 'fr.pegawaifarmasifk')
            ->LEFTJOIN('pegawai_m as pg1', 'pg1.id', '=', 'fr.perawatfk')
            ->select(DB::raw("fr.norec,pd.noregistrasi,pm.nocm,pm.namapasien,fr.tglpelayanan,fr.pegawaifarmasifk,
                              fr.perawatfk,pg.namalengkap as pegawaifarmasi,pg1.namalengkap as perawat,fr.alergi"));
        $data = $data->where('fr.statusenabled', true);
        $data = $data->where('fr.norec', '=', $Norec);
        $data = $data->get();

        $details = DB::select(
            DB::raw("select frd.produkfk,pr.namaproduk,frd.routefk,rf.name as route,
                                        frd.dosis,frd.ispagi,frd.issiang,frd.ismalam,frd.issore,frd.pegawaifarmasifk,
                                        frd.perawatfk,pg.namalengkap as pegawaifarmasi,pg1.namalengkap as perawat,
                                        CASE WHEN frd.ispagi = 1 THEN 'P (6.00 - 7.00)' 
                                             WHEN frd.issiang = 1 THEN 'S (12.00 - 13.00)' 
                                             WHEN frd.issore = 1 THEN 'SR (18.00 - 19.00)' 
                                             WHEN frd.ismalam = 1 THEN 'M (23.00 - 24.00)' ELSE '-' END AS waktuminum
                            from formulirobatdetail_t as frd 
                            left JOIN produk_m as pr on pr.id=frd.produkfk
                            left JOIN routefarmasi as rf on rf.id=frd.routefk
                            left JOIN pegawai_m as pg on pg.id=frd.pegawaifarmasifk
                            left JOIN pegawai_m as pg1 on pg1.id=frd.perawatfk
                            where frd.formulirobatfk=:norec"),
            array(
                'norec' => $Norec
            )
        );

        $result = array(
            'daftar' => $data,
            'detail' => $details,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }

    public function hapusDelegasiObat(Request $request)
    {
        DB::beginTransaction();
        try {

            FormulisObat::where('norec', $request['norec'])
                ->update(['statusenabled' => false]);

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Data Terhapus";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'er@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "as" => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getEMRTransaksiDetailForm(Request $request)
    {
        //todo : detail
        $paramNocm = '';
        $paramNoreg = '';
        $data = \DB::table('emrpasien_t as emrp')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'emrp.pegawaifk')
            ->select('emrp.*', 'emrp.noregistrasifk as noregistrasi', 'pg.namalengkap')
            ->where('emrp.statusenabled', true)
            ->orderBy('emrp.tglemr', 'desc');

        if (isset($request['noemr']) && $request['noemr'] != '') {
            $data = $data->where('emrp.noemr', $request['noemr']);
        }
        if (isset($request['emrfk']) && $request['emrfk'] != '') {
            $data = $data->where('emrdp.emrfk', $request['emrfk']);
        }
        if (isset($request['norec']) && $request['norec'] != '') {
            $data = $data->where('emrp.norec', $request['norec']);
        }
        if (isset($request['nocm']) && $request['nocm'] != '') {
            $data = $data->where('emrp.nocm', $request['nocm']);
            $paramNocm = "AND emrp.nocm='" . $request['nocm'] . "'";
        }
        if (isset($request['noregistrasi']) && $request['noregistrasi'] != '') {
            $data = $data->where('emrp.noregistrasifk', $request['noregistrasi']);
            $paramNoreg = "AND emrp.noregistrasifk='" . $request['noregistrasi'] . "'";
        }
        if (isset($request['tgllahir']) && $request['tgllahir'] != "" && $request['tgllahir'] != "undefined" && $request['tgllahir'] != "null") {
            $tgllahir = $request['tgllahir'];
            $data = $data->whereRaw("format( emrp.tgllahir, 'yyyy-MM-dd')  ='$tgllahir' ");
        }
        if (isset($request['namapasien']) && $request['namapasien'] != '') {
            $data = $data->where('emrp.namapasien', $request['namapasien']);
        }
        if (isset($request['jenisEmr']) && $request['jenisEmr'] != '') {
            $data = $data->where('emrp.jenisemr',  $request['jenisEmr']);
        } else {
            $data = $data->whereNull('emrp.jenisemr');
        }
        $data = $data->get();
        $jenisEMr = $request['jenisEmr'];
        $result = [];
        $details = DB::select(DB::raw("
             SELECT 
                    emrdp.emrpasienfk,
                    emrdp.emrfk,
                    emr.reportdisplay,
                    emrp.norec,emr.caption as namaform
                FROM
                    emrpasiend_t AS emrdp
                INNER JOIN emrpasien_t AS emrp ON emrp.noemr = emrdp.emrpasienfk
                --INNER JOIN emrd_t AS emrd ON emrd.id = emrdp.emrdfk
               INNER JOIN emr_t AS emr ON emr.id = emrdp.emrfk
                WHERE
                    emrdp.statusenabled = 1
                   $paramNocm
                   $paramNoreg
                    AND emrp.jenisemr = '$jenisEMr'
                    
                    GROUP BY emrdp.emrpasienfk,
                    emrdp.emrfk,emrp.norec,emr.caption,
                    emr.reportdisplay 

            "));
        // return $this->respond( $details);
        // -- and emrdp.emrpasienfk='$noemr'
        foreach ($data as $item) {
            $noemr = $item->noemr;
            $detail = [];
            foreach ($details as $key => $value) {
                if ($value->emrpasienfk == $noemr) {
                    $detail[] =  $value;
                }
            }

            $result[] = array(
                'norec' => $item->norec,
                'kdprofile' => $item->kdprofile,
                'statusenabled' => $item->statusenabled,
                'kodeexternal' => $item->kodeexternal,
                'emrfk' => $item->emrfk,
                'noregistrasifk' => $item->noregistrasifk,
                'noemr' => $item->noemr,
                'nocm' => $item->nocm,
                'namapasien' => $item->namapasien,
                'jeniskelamin' => $item->jeniskelamin,
                'noregistrasi' => $item->noregistrasi,
                'umur' => $item->umur,
                'kelompokpasien' => $item->kelompokpasien,
                'tglregistrasi' => $item->tglregistrasi,
                'norec_apd' => $item->norec_apd,
                'namakelas' => $item->namakelas,
                'namaruangan' => $item->namaruangan,
                'tglemr' => $item->tglemr,
                'tgllahir' => $item->tgllahir,
                'notelepon' => $item->notelepon,
                'alamat' => $item->alamat,
                'jenisemr' => $item->jenisemr,
                'pegawaifk' => $item->pegawaifk,
                'namalengkap' => $item->namalengkap,
                'details' => $detail
            );
        }
        $result = array(
            'data' => $result,
            'message' => 'as@epic',
        );
        return $this->respond($result);
    }

    public function hapusEMRtransaksiNorec(Request $request)
    {
        DB::beginTransaction();
        try {
            EMRPasien::where('norec', $request['norec'])->update(
                ['statusenabled' => false]
            );
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'er@epic',
            );
        } else {
            $transMessage = " Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message' => $transMessage,
                'as' => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }


    //2019-12 penambahan arif awal
    public function getAntrianPasienDiperiksaDbLama($notransaksi)
    {
        $data = \DB::connection('sqlsrv2')
            ->table('KUNJUNGANPASIEN as kp')
            ->join('pasien as p', 'p.KD_PASIEN', '=', 'kp.KPKD_PASIEN')
            ->join('DOKTER as dok', 'dok.FMDDOKTER_ID', '=', 'kp.KPKD_DOKTER')
            ->join('CUSTOMER as cus', 'cus.CUSID', '=', 'kp.KD_CUSTOMER')
            ->join('POLIKLINIK as pol', 'pol.FMPKLINIK_ID', '=', 'kp.KPKD_POLY')
            ->limit('5')
            ->select(
                'kp.KPKD_PASIEN as nocm',
                'p.NAMAPASIEN as namapasien',
                'kp.KPNO_TRANSAKSI as notransaksi',
                'pol.FMPKLINIKN as namaruangan',
                'kp.KPTGL_PERIKSA as tglregistrasi',
                'p.JENIS_KELAMIN as jeniskelamin',
                'dok.FMDDOKTERN as namadokter',
                'cus.NAME as kelompokpasien',
                'kp.KPJAM_MASUK as jam_masuk',
                'p.TGL_LAHIR as tgllahir',
                'p.alamat as alamatlengkap'
            )
            ->where('kp.KPNO_TRANSAKSI', '=', $notransaksi);

        $data = $data->first();
        $data->foto = null;
        if ($data->jeniskelamin == "1") {
            $data->jeniskelamin = "Laki-laki";
        } else {
            $data->jeniskelamin = "Perempuan";
        }
        $result = array(
            'result' => $data,
            'message' => 'Inhuman',
        );
        return $this->respond($result);
    }

    public function getMenuRekamMedisAtuhDbLama()
    {

        $data[] = array(array(
            'id' => 1,
            'kdprofile' => null,
            'statusenabled' => 1,
            'kodeexternal' => null,
            'namaexternal' => null,
            'reportdisplay' => "RekamMedisDbLama.ResumeDBLama",
            'namaemr' => 'navigasi',
            'caption' => "Diagnosa, Penyakit, Obat",
            'headfk' => null,
            'nourut' => 0
        ), array(
            'id' => 1,
            'kdprofile' => null,
            'statusenabled' => 1,
            'kodeexternal' => null,
            'namaexternal' => null,
            'reportdisplay' => "RekamMedisDbLama.Laboratorium",
            'namaemr' => 'navigasi',
            'caption' => "Laboratorium",
            'headfk' => null,
            'nourut' => 2
        ), array(
            'id' => 1,
            'kdprofile' => null,
            'statusenabled' => 1,
            'kodeexternal' => null,
            'namaexternal' => null,
            'reportdisplay' => "RekamMedisDbLama.Radiologi",
            'namaemr' => 'navigasi',
            'caption' => "Radiologi",
            'headfk' => null,
            'nourut' => 2
        ));


        //$data = recursiveElements($data);

        $result = array(
            'data' => $data[0],
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }

    public function getDiagnosaByNotransaksi(Request $request)
    {
        $filter = $request->all();
        $diagnosa = \DB::connection('sqlsrv2')
            ->table('MR_DIAGNOSA as md')
            ->join('pasien as p', 'p.KD_PASIEN', '=', 'md.MRDKD_PASIEN')
            ->join('DOKTER as dok', 'dok.FMDDOKTER_ID', '=', 'md.MRDKD_DOKTER')
            ->join('POLIKLINIK as pol', 'pol.FMPKLINIK_ID', '=', 'md.MRDKD_UNIT')
            ->select(
                'pol.FMPKLINIKN as poliklinik',
                'dok.FMDDOKTERN as namadokter',
                'p.NAMAPASIEN as namapasien',
                'md.*'
            )
            ->where('md.MRDNO_TRANSAKSI', '=', $filter['notransaksi'])->get();

        $penyakit = \DB::connection('sqlsrv2')
            ->table('MR_PENYAKIT as mp')
            ->join('penyakit as p', 'p.KD_PENYAKIT', '=', 'mp.MRPKD_PENYAKIT')
            ->select(
                'p.PENYAKIT as penyakit',
                'p.DESCRIPTION as description',
                'mp.MRPKD_PENYAKIT'
            )
            ->where('mp.MRPNO_TRANSAKSI', '=', $filter['notransaksi'])->get();

        $fhrbukti = \DB::connection('sqlsrv2')
            ->table('RESEPDOKTER as rd')
            ->select('rd.FHRBUKTI_ID as fhrbukti')
            ->where('rd.FHRNO_TRANSAKSI', '=', $filter['notransaksi'])->first();
        if (!empty($fhrbukti)) {
            $obat = \DB::connection('sqlsrv2')
                ->table('RESEPDOKTERD as rd')
                ->select('rd.*')
                ->where('rd.FDRBUKTI_ID', '=', $fhrbukti->fhrbukti)->get();
        } else {
            $obat = [];
        }


        $result = array(
            'diagnosa' => $diagnosa[0],
            'penyakit' => $penyakit[0],
            'obat' => $obat,
            'message' => 'as@arif',
        );
        return $this->respond($result);
    }


    public function getLabByNotransaksi(Request $request)
    {
        $filter = $request->all();

        $lab = \DB::connection('sqlsrv2')
            ->table('LAB_HASIL as lh')
            ->join('LAB_TEST as lt', 'lt.MTLKD_LAB', '=', 'lh.MLHKD_LAB')
            ->join('KLAS_PRODUK_RAD_LAB as prod', 'prod.FMKKLAS_ID', '=', 'lh.MLHKKD_PRODUK')
            ->select(
                'lt.MTLLABN as namapemeriksaan',
                'lh.MLHHASIL as hasil',
                'lt.MTLSATUAN as satuan',
                'MTLNORMAL_LAKI2 as normal_laki',
                'MTLNORMAL_WANITA as normal_wanita',
                'prod.FMKKLASN as golongan'
            )
            ->where('lh.MLHNO_TRANSAKSI', '=', $filter['notransaksi'])->get();

        $result = array(
            'lab' => $lab,
            'message' => 'as@arif',
        );
        return $this->respond($result);
    }

    public function getRadiologiByNotransaksi(Request $request)
    {
        $filter = $request->all();

        $radiologi = \DB::connection('sqlsrv2')
            ->table('RAD_HASIL as rh')
            ->join('PRODUK as p', 'p.FMPPRODUK_ID', '=', 'rh.MRHKD_PRODUK')
            ->select('p.FMPPRODUKN as produk', 'rh.MRHTGL_MASUK as tglperiksa', 'rh.MRHHASIL as hasil')
            ->where('rh.MRHNO_TRANSAKSI', '=', $filter['notransaksi'])->get();

        $result = array(
            'radiologi' => $radiologi,
            'message' => 'as@arif',
        );
        return $this->respond($result);
    }

    public function saveVerifCPPTEmr(Request $request)
    {
        DB::beginTransaction();
        $dataReq = $request->all();

        //        return $this->respond($noemr);
        try {

            if ($request['tipe'] == 'verif') {
                $EMR = EMRPasien::where('norec', $request['norec'])->update(
                    [
                        'dokterfk' => $request['iddokter'],

                    ]
                );
            }
            if ($request['tipe'] == 'notif') {
                $EMR = EMRPasien::where('norec', $request['norec'])->update(
                    [

                        'notifikasifk' => $request['iddokter']
                    ]
                );
            }
            //
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = ' ';

        if ($transStatus == 'true') {
            $transMessage = $transMessage . "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => $EMR,
                //                "data2" => $EMRD,
                //                "keys" => $keys,
                //                "dtdt" => $dtdt,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                //                "data" => $data,
                //                "keys" => $keys,
                //                "dtdt" => $dtdt,
                "as" => 'as@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    //2019-12 penambahan arif akhir

    public function saveDataKepatuhanCuci(Request $request)
    {
        DB::beginTransaction();
        $dataReq = $request->all();

        try {

            if ($dataReq['norec'] == '') {
                $dataSave = new KepatuhanCuciTangan();
                $dataSave->norec = $dataSave->generateNewId();
                $dataSave->kdprofile = 0;
                $dataSave->statusenabled = true;
                # code...
            } else {

                $dataSave = KepatuhanCuciTangan::where('norec', $dataReq['norec'])->first();
            }
            $dataSave->tanggal = $dataReq['tanggal'];
            $dataSave->doktersp_p = $dataReq['doktersp_p'];
            $dataSave->doktersp_t = $dataReq['doktersp_t'];
            $dataSave->dokteru_p = $dataReq['dokteru_p'];
            $dataSave->dokteru_t = $dataReq['dokteru_t'];
            $dataSave->perawat_p = $dataReq['perawat_p'];
            $dataSave->perawat_t = $dataReq['perawat_t'];
            $dataSave->penunjang_p = $dataReq['penunjang_p'];
            $dataSave->penunjang_t = $dataReq['penunjang_t'];
            $dataSave->administrasi_p = $dataReq['administrasi_p'];
            $dataSave->administrasi_t = $dataReq['administrasi_t'];
            $dataSave->coas_p = $dataReq['coas_p'];
            $dataSave->coas_t = $dataReq['coas_t'];
            $dataSave->siswa_p = $dataReq['siswa_p'];
            $dataSave->siswa_t = $dataReq['siswa_t'];
            $dataSave->lain_p = $dataReq['lain_p'];
            $dataSave->lain_t = $dataReq['lain_t'];
            $dataSave->noruanganfk = $dataReq['noruanganfk'];

            $dataSave->save();


            $transStatus = 1;
        } catch (\Exception $e) {
            $transStatus = false;
        }

        if ($transStatus) {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => $dataSave,
                "as" => 'afd@epic',
            );
        } else {
            $transMessage = " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'afd@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDataKepatuhanCuciTangan(Request $request)
    {
        $filter = $request->all();
        $bulan = $filter['bulan'];
        $dataLap = DB::select(DB::raw("SELECT
            x.tanggal,SUM(x.doktersp_p) as doktersp_p,SUM(x.doktersp_t) as doktersp_t,
            SUM(x.dokteru_p) as dokteru_p,SUM(x.dokteru_t) as dokteru_t,
            SUM(x.perawat_p) as perawat_p,SUM(x.perawat_t) as perawat_t,
            SUM(x.penunjang_p) as penunjang_p,SUM(x.penunjang_t) as penunjang_t,
            SUM(x.administrasi_p) as administrasi_p,SUM(x.administrasi_t) as administrasi_t,
            SUM(x.coas_p) as coas_p,SUM(x.coas_t) as coas_t,
            SUM(x.siswa_p) as siswa_p,SUM(x.siswa_t) as siswa_t,
            SUM(x.lain_p) as lain_p,SUM(x.lain_t) as lain_t, x.namaruangan
            FROM(SELECT CONVERT(VARCHAR,kc.tanggal,105) as tanggal,kc.doktersp_p,kc.doktersp_t,kc.dokteru_p,kc.dokteru_t,kc.perawat_p,
            kc.perawat_t,kc.penunjang_p,kc.penunjang_t,kc.administrasi_p,kc.administrasi_t,kc.coas_p,kc.coas_t,kc.siswa_p,kc.siswa_t,
            kc.lain_p,kc.lain_t,kc.noruanganfk,ru.namaruangan
            FROM kepatuhancucitangan_t as kc
            LEFT JOIN ruangan_m as ru on ru.id=kc.noruanganfk
            WHERE kc.statusenabled=1 AND MONTH(kc.tanggal) BETWEEN 1 AND 12) as x
            GROUP BY x.tanggal,x.namaruangan"));

        $result = array(
            'data' => $dataLap,
            'message' => 'az@epic',
        );

        return $this->respond($result);
    }

    public function getDataKepatuhanCuciTanganload(Request $request)
    {
        //todo : Riwayat
        $data = \DB::table('kepatuhancucitangan_t AS kc')
            ->leftJoin('ruangan_m AS ru', 'ru.id', '=', 'kc.noruanganfk')
            ->select(
                'kc.norec',
                'kc.tanggal',
                'kc.doktersp_p',
                'kc.doktersp_t',
                'kc.dokteru_p',
                'kc.dokteru_t',
                'kc.perawat_p',
                'kc.perawat_t',
                'kc.penunjang_p',
                'kc.penunjang_t',
                'kc.administrasi_p',
                'kc.administrasi_t',
                'kc.coas_p',
                'kc.coas_t',
                'kc.siswa_p',
                'kc.siswa_t',
                'kc.lain_p',
                'kc.lain_t',
                'kc.noruanganfk',
                'ru.namaruangan'
            )
            ->where('kc.statusenabled', true);

        if (isset($request['tanggal']) && $request['tanggal'] != "" && $request['tanggal'] != "undefined" && $request['tanggal'] != "null") {
            $tgllahir = $request['tanggal'];
            $data = $data->whereRaw("format( emrp.tgllahir, 'yyyy-MM-dd')  ='$tanggal' ");
        }
        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'afd@epic',
        );
        return $this->respond($result);
    }

    public function saveBatalKepatuhanCuciTangan(Request $request)
    {
        DB::beginTransaction();
        $dataReq = $request->all();

        try {

            // ($dataReq['norec'] == '')
            // $dataSave = new KepatuhanCuciTangan();
            // $dataSave->norec = $dataSave->generateNewId();
            # code...


            KepatuhanCuciTangan::where('norec', $request['norec'])
                ->update([

                    'statusenabled' => 0,
                ]);


            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Hapus Berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'afd@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message' => $transStatus,
                'as' => 'afd@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveDataKepatuhanHandHygiene(Request $request)
    {
        DB::beginTransaction();
        $dataReq = $request->all();

        try {

            if ($dataReq['norec'] == '') {
                $dataSave = new KepatuhanHandHygiene();
                $dataSave->norec = $dataSave->generateNewId();
                $dataSave->kdprofile = 0;
                $dataSave->statusenabled = true;
                # code...
            } else {

                $dataSave = KepatuhanHandHygiene::where('norec', $dataReq['norec'])->first();
            }
            $dataSave->tanggal = $dataReq['tanggal'];
            $dataSave->objectjenispegawaifk = $dataReq['objectjenispegawaifk'];
            $dataSave->objectpegawaifk = $dataReq['objectpegawaifk'];
            $dataSave->objectindikasifk = $dataReq['objectindikasifk'];
            $dataSave->objecthygienefk = $dataReq['objecthygienefk'];
            $dataSave->langkah = $dataReq['langkah'];
            $dataSave->objectruanganfk = $dataReq['objectruanganfk'];
            $dataSave->kesempatan = $dataReq['kesempatan'];

            $dataSave->save();


            $transStatus = 1;
        } catch (\Exception $e) {
            $transStatus = false;
        }

        if ($transStatus) {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => $dataSave,
                "as" => 'afd@epic',
            );
        } else {
            $transMessage = " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'afd@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDataKepatuhanHandHygiene(Request $request)
    {
        //todo : Riwayat

        $data = \DB::table('kepatuhanhandhygiene_t AS kh')
            ->leftJoin('ruangan_m AS ru', 'ru.id', '=', 'kh.objectruanganfk')
            //->leftJoin('indikasi_m AS ink', 'ink.id', '=', 'kh.objectindikasifk')
            //->leftJoin('handhygiene_m AS hh', 'hh.id', '=', 'kh.objecthygienefk')
            ->leftJoin('pegawai_m AS pg', 'pg.id', '=', 'kh.objectpegawaifk')
            ->leftJoin('jenispegawai_m AS jp', 'jp.id', '=', 'kh.objectjenispegawaifk')
            ->select('kh.norec', 'kh.tanggal', 'kh.objectruanganfk', 'kh.objectindikasifk', 'ru.namaruangan', 'kh.objecthygienefk', 'kh.objectpegawaifk', 'pg.namalengkap', 'kh.langkah', 'kh.objectjenispegawaifk', 'jp.jenispegawai', 'kh.kesempatan', 'kh.langkah')
            ->where('kh.statusenabled', true)
            ->orderBy('kh.tanggal');
        $filter = $request->all();

        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('kh.tanggal', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $data = $data->where('kh.tanggal', '<=', $filter['tglAkhir']);
        }
        if (isset($filter['pgid']) && $filter['pgid'] != "" && $filter['pgid'] != "undefined") {
            $data = $data->where('kh.objectpegawaifk', '=', $filter['pgid']);
        }
        if (isset($filter['prid']) && $filter['prid'] != "" && $filter['prid'] != "undefined") {
            $data = $data->where('kh.objectjenispegawaifk', '=', $filter['prid']);
        }
        if (isset($filter['bngid']) && $filter['bngid'] != "" && $filter['bngid'] != "undefined") {
            $data = $data->where('kh.objectruanganfk', '=', $filter['bngid']);
        }
        if (isset($filter['indikasiid']) && $filter['indikasiid'] != "" && $filter['indikasiid'] != "undefined") {
            $data = $data->where('ink.id', '=', $filter['indikasiid']);
        }
        $data = $data->get();

        // foreach ($data as $key => $value) {
        //        $indikasi = \DB::table('indikasi_m')->get();
        //        $handhygiene = \DB::table('handhygiene_m')->get();

        //     # code...
        // }
        $result = array(
            'data' => $data,
            'message' => 'afd@epic',
        );
        return $this->respond($result);
    }

    public function getDataKepatuhanHandHygienePegawai(Request $request)
    {
        //todo : Riwayat

        $data = \DB::table('kepatuhanhandhygiene_t AS kh')
            ->leftJoin('ruangan_m AS ru', 'ru.id', '=', 'kh.objectruanganfk')
            //->leftJoin('indikasi_m AS ink', 'ink.id', '=', 'kh.objectindikasifk')
            //->leftJoin('handhygiene_m AS hh', 'hh.id', '=', 'kh.objecthygienefk')
            ->leftJoin('pegawai_m AS pg', 'pg.id', '=', 'kh.objectpegawaifk')
            ->leftJoin('jenispegawai_m AS jp', 'jp.id', '=', 'kh.objectjenispegawaifk')
            ->select('kh.norec', 'kh.tanggal', 'kh.objectruanganfk', 'kh.objectindikasifk', 'ru.namaruangan', 'kh.objecthygienefk', 'kh.objectpegawaifk', 'pg.namalengkap', 'kh.langkah', 'kh.objectjenispegawaifk', 'jp.jenispegawai', 'kh.kesempatan', 'kh.langkah')
            ->where('kh.statusenabled', true)
            ->where('kh.objectpegawaifk',0)
            ->orderBy('kh.tanggal');
        $filter = $request->all();

        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('kh.tanggal', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $data = $data->where('kh.tanggal', '<=', $filter['tglAkhir']);
        }
        if (isset($filter['pgid']) && $filter['pgid'] != "" && $filter['pgid'] != "undefined") {
            $data = $data->where('kh.objectpegawaifk', '=', $filter['pgid']);
        }
        if (isset($filter['prid']) && $filter['prid'] != "" && $filter['prid'] != "undefined") {
            $data = $data->where('kh.objectjenispegawaifk', '=', $filter['prid']);
        }
        if (isset($filter['bngid']) && $filter['bngid'] != "" && $filter['bngid'] != "undefined") {
            $data = $data->where('kh.objectruanganfk', '=', $filter['bngid']);
        }
        if (isset($filter['indikasiid']) && $filter['indikasiid'] != "" && $filter['indikasiid'] != "undefined") {
            $data = $data->where('kh.objectindikasifk', '=', $filter['indikasiid']);
        }
        $data = $data->get();

        // foreach ($data as $key => $value) {
        //        $indikasi = \DB::table('indikasi_m')->get();
        //        $handhygiene = \DB::table('handhygiene_m')->get();

        //     # code...
        // }
        $result = array(
            'data' => $data,
            'message' => 'afd@epic',
        );
        return $this->respond($result);
    }

    public function getDataKepatuhanHandHygieneBulanan(Request $request)
    {

        // $data = \DB::table('')

        $data = \DB::table('kepatuhanhandhygiene_t AS kh')
            ->leftJoin('ruangan_m AS ru', 'ru.id', '=', 'kh.objectruanganfk')
            //->leftJoin('indikasi_m AS ink', 'ink.id', '=', 'kh.objectindikasifk')
            //->leftJoin('handhygiene_m AS hh', 'hh.id', '=', 'kh.objecthygienefk')
            ->leftJoin('pegawai_m AS pg', 'pg.id', '=', 'kh.objectpegawaifk')
            ->leftJoin('jenispegawai_m AS jp', 'jp.id', '=', 'kh.objectjenispegawaifk')
            ->select(DB::raw('ru.namaruangan, COUNT(CASE kh.langkah WHEN 2 THEN 1 ELSE NULL END)  as ya,COUNT(CASE kh.langkah WHEN 0 THEN 1 ELSE NULL END)  as tidak, COUNT(kh.langkah) AS jumlah, 
            ROUND(cast(COUNT(CASE kh.langkah WHEN 2 THEN 1 ELSE NULL END) as float)/cast(COUNT(kh.langkah) as float),2) * 100 as persentase'))
            ->where('kh.statusenabled', true)
            ->groupBy('ru.namaruangan')
            ->orderBy('ru.namaruangan');
        $filter = $request->all();

        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('kh.tanggal', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $data = $data->where('kh.tanggal', '<=', $filter['tglAkhir']);
        }
        if (isset($filter['pgid']) && $filter['pgid'] != "" && $filter['pgid'] != "undefined") {
            $data = $data->where('kh.objectpegawaifk', '=', $filter['pgid']);
        }
        if (isset($filter['prid']) && $filter['prid'] != "" && $filter['prid'] != "undefined") {
            $data = $data->where('kh.objectjenispegawaifk', '=', $filter['prid']);
        }
        if (isset($filter['bngid']) && $filter['bngid'] != "" && $filter['bngid'] != "undefined") {
            $data = $data->where('kh.objectruanganfk', '=', $filter['bngid']);
        }
        if (isset($filter['indikasiid']) && $filter['indikasiid'] != "" && $filter['indikasiid'] != "undefined") {
            $data = $data->where('ink.id', '=', $filter['indikasiid']);
        }
        $data = $data->get();

        // foreach ($data as $key => $value) {
        //        $indikasi = \DB::table('indikasi_m')->get();
        //        $handhygiene = \DB::table('handhygiene_m')->get();

        //     # code...
        // }
        $result = array(
            'data' => $data,
            'message' => 'afd@epic',
        );
        return $this->respond($result);
    }
    
    public function getDataKepatuhanHandHygieneBulananTahun(Request $request)
    {

        // $data = \DB::table('')

        $data = \DB::table('kepatuhanhandhygiene_t AS kh')
            ->leftJoin('ruangan_m AS ru', 'ru.id', '=', 'kh.objectruanganfk')
            //->leftJoin('indikasi_m AS ink', 'ink.id', '=', 'kh.objectindikasifk')
            //->leftJoin('handhygiene_m AS hh', 'hh.id', '=', 'kh.objecthygienefk')
            ->leftJoin('pegawai_m AS pg', 'pg.id', '=', 'kh.objectpegawaifk')
            ->leftJoin('jenispegawai_m AS jp', 'jp.id', '=', 'kh.objectjenispegawaifk')
            ->select(DB::raw('to_char( kh.tanggal,\'MM\') as bulan, 
            COUNT(CASE WHEN kh.langkah = 2 AND kh.objectjenispegawaifk = 1 THEN 1 END)  as ya_dokter,
            COUNT(CASE WHEN kh.langkah = 0 AND kh.objectjenispegawaifk = 1 THEN 1 END)  as tidak_dokter,
            COUNT(CASE WHEN kh.objectjenispegawaifk = 1 THEN 1 END)  as jumlah_dokter,
            COUNT(CASE WHEN kh.langkah = 2 AND kh.objectjenispegawaifk = 2 THEN 1 END)  as ya_perawat,
            COUNT(CASE WHEN kh.langkah = 0 AND kh.objectjenispegawaifk = 2 THEN 1 END)  as tidak_perawat,
            COUNT(CASE WHEN kh.objectjenispegawaifk = 2 THEN 1 END)  as jumlah_perawat,
            COUNT(CASE WHEN kh.langkah = 2 AND kh.objectjenispegawaifk = 32 THEN 1 END)  as ya_fisioterapi,
            COUNT(CASE WHEN kh.langkah = 0 AND kh.objectjenispegawaifk = 32 THEN 1 END)  as tidak_fisioterapi,
            COUNT(CASE WHEN kh.objectjenispegawaifk = 32 THEN 1 ELSE 0 END)  as jumlah_fisioterapi'))
            ->where('kh.statusenabled', true)
            ->groupBy(DB::raw('to_char( kh.tanggal,\'MM\' )'))
            ->orderBy(DB::raw('to_char( kh.tanggal,\'MM\' )'));
            // ->groupBy('MONTH(kh.tanggal)')
            // ->orderBy('MONTH(kh.tanggal)');
        $filter = $request->all();

        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('kh.tanggal', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $data = $data->where('kh.tanggal', '<=', $filter['tglAkhir']);
        }
        if (isset($filter['pgid']) && $filter['pgid'] != "" && $filter['pgid'] != "undefined") {
            $data = $data->where('kh.objectpegawaifk', '=', $filter['pgid']);
        }
        if (isset($filter['prid']) && $filter['prid'] != "" && $filter['prid'] != "undefined") {
            $data = $data->where('kh.objectjenispegawaifk', '=', $filter['prid']);
        }
        if (isset($filter['bngid']) && $filter['bngid'] != "" && $filter['bngid'] != "undefined") {
            $data = $data->where('kh.objectruanganfk', '=', $filter['bngid']);
        }
        if (isset($filter['indikasiid']) && $filter['indikasiid'] != "" && $filter['indikasiid'] != "undefined") {
            $data = $data->where('kh.objectindikasifk', '=', $filter['indikasiid']);
        }
        // $data = $data->groupBy('kh.tanggal');
        // $data = $data->orderBy('kh.tanggal');
        $data = $data->get();

        $datas = [];
        foreach ($data as $item) {
// return(count($item->jumlah_dokter));
// die();
            $persentase_avg = 0;
            $persentase_dokter = 0;
            $persentase_perawat = 0;
            $persentase_fisioterapi = 0;
            if($item->jumlah_dokter > 0 && $item->ya_dokter > 0) {
                $persentase_dokter = ($item->ya_dokter/$item->jumlah_dokter) * 100;
            } else {
                $persentase_dokter = 0;
            }
            if($item->jumlah_perawat > 0 && $item->ya_perawat > 0) {
                $persentase_perawat = ($item->ya_perawat/$item->jumlah_perawat) * 100;
            } else {
                $persentase_perawat = 0;
            }
            if($item->jumlah_fisioterapi > 0 && $item->ya_fisioterapi > 0) {
                $persentase_fisioterapi = ($item->ya_fisioterapi/$item->jumlah_fisioterapi) * 100;
            } else {
                $persentase_fisioterapi = 0;
            }

            $persentase_dokter_per = round($persentase_dokter,2) . " %";
            $persentase_perawat_per = round($persentase_perawat,2) . " %";
            $persentase_fisioterapi_per = round($persentase_fisioterapi,2) . " %";
            // return(round(($persentase_dokter + $persentase_perawat + $persentase_fisioterapi)/3,2));
            // die();
            // return($persentase_dokter_per);
            // die();
            $persentase_avg = round(($persentase_dokter + $persentase_perawat + $persentase_fisioterapi)/3,2) . " %";

            if($item->bulan == 1) {
                $bulan = "Januari";
            } else if($item->bulan == 2) {
                $bulan = "Februari";
            } else if($item->bulan == 3) {
                $bulan = "Maret";
            } else if($item->bulan == 4) {
                $bulan = "April";
            } else if($item->bulan == 5) {
                $bulan = "Mei";
            } else if($item->bulan == 6) {
                $bulan = "Juni";
            } else if($item->bulan == 7) {
                $bulan = "Juli";
            } else if($item->bulan == 8) {
                $bulan = "Agustus";
            } else if($item->bulan == 9) {
                $bulan = "September";
            } else if($item->bulan == 10) {
                $bulan = "Oktober";
            } else if($item->bulan == 11) {
                $bulan = "November";
            } else if($item->bulan == 12) {
                $bulan = "Desember";
            } else {
                $bulan = "-";
            }

            $datas[] =array(
                'bulan' => $bulan,
                'ya_dokter' => $item->ya_dokter,
                'tidak_dokter' => $item->tidak_dokter,
                'jumlah_dokter' => $item->jumlah_dokter,
                'persentase_dokter' => $persentase_dokter_per,
                'ya_perawat' => $item->ya_perawat,
                'tidak_perawat' => $item->tidak_perawat,
                'jumlah_perawat' => $item->jumlah_perawat,
                'persentase_perawat' => $persentase_perawat_per,
                'ya_fisioterapi' => $item->ya_fisioterapi,
                'tidak_fisioterapi' => $item->tidak_fisioterapi,
                'jumlah_fisioterapi' => $item->jumlah_fisioterapi,
                'persentase_fisioterapi' => $persentase_fisioterapi_per,
                'persentase_avg' => $persentase_avg,
                'standar' => '85%'
            );
        }
        // foreach ($data as $key => $value) {
        //        $indikasi = \DB::table('indikasi_m')->get();
        //        $handhygiene = \DB::table('handhygiene_m')->get();

        //     # code...
        // }
        $result = array(
            'data' => $datas,
            'message' => 'afd@epic',
        );
        return $this->respond($result);
    }
    
    public function getDataKepatuhanHandHygieneIndikasi(Request $request)
    {

        // $data = \DB::table('')

        $data = \DB::table('kepatuhanhandhygiene_t AS kh')
            // ->leftJoin('ruangan_m AS ru', 'ru.id', '=', 'kh.objectruanganfk')
            ->Join('indikasi_m AS ink', 'ink.id', '=', 'kh.objectindikasifk')
            //->leftJoin('handhygiene_m AS hh', 'hh.id', '=', 'kh.objecthygienefk')
            // ->leftJoin('pegawai_m AS pg', 'pg.id', '=', 'kh.objectpegawaifk')
            // ->leftJoin('jenispegawai_m AS jp', 'jp.id', '=', 'kh.objectjenispegawaifk')
            ->select(DB::raw('ink.indikasi, COUNT(CASE kh.langkah WHEN 2 THEN 1 ELSE NULL END)  as ya,COUNT(CASE kh.langkah WHEN 0 THEN 1 ELSE NULL END)  as tidak, COUNT(kh.langkah) AS jumlah, 
            ROUND(cast(COUNT(CASE kh.langkah WHEN 2 THEN 1 ELSE NULL END) as numeric)/cast(COUNT(kh.langkah) as numeric),2) * 100 as persentase'))
            ->where('kh.statusenabled', true)
            ->groupBy('ink.indikasi')
            ->orderBy('ink.indikasi');
        $filter = $request->all();

        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('kh.tanggal', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $data = $data->where('kh.tanggal', '<=', $filter['tglAkhir']);
        }
        if (isset($filter['pgid']) && $filter['pgid'] != "" && $filter['pgid'] != "undefined") {
            $data = $data->where('kh.objectpegawaifk', '=', $filter['pgid']);
        }
        if (isset($filter['prid']) && $filter['prid'] != "" && $filter['prid'] != "undefined") {
            $data = $data->where('kh.objectjenispegawaifk', '=', $filter['prid']);
        }
        if (isset($filter['bngid']) && $filter['bngid'] != "" && $filter['bngid'] != "undefined") {
            $data = $data->where('kh.objectruanganfk', '=', $filter['bngid']);
        }
        if (isset($filter['indikasiid']) && $filter['indikasiid'] != "" && $filter['indikasiid'] != "undefined") {
            $data = $data->where('ink.id', '=', $filter['indikasiid']);
        }
        $data = $data->get();

        // foreach ($data as $key => $value) {
        //        $indikasi = \DB::table('indikasi_m')->get();
        //        $handhygiene = \DB::table('handhygiene_m')->get();

        //     # code...
        // }
        $result = array(
            'data' => $data,
            'message' => 'afd@epic',
        );
        return $this->respond($result);
    }
    
    
    public function getDataKepatuhanHandHygienePerRuangan(Request $request)
    {
        //todo : Riwayat

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

        $data = \DB::table('kepatuhanhandhygiene_t AS kh')
            ->leftJoin('ruangan_m AS ru', 'ru.id', '=', 'kh.objectruanganfk')
            //->leftJoin('indikasi_m AS ink', 'ink.id', '=', 'kh.objectindikasifk')
            //->leftJoin('handhygiene_m AS hh', 'hh.id', '=', 'kh.objecthygienefk')
            ->leftJoin('pegawai_m AS pg', 'pg.id', '=', 'kh.objectpegawaifk')
            ->leftJoin('jenispegawai_m AS jp', 'jp.id', '=', 'kh.objectjenispegawaifk')
            ->select('kh.norec', 'kh.tanggal', 'kh.objectruanganfk', 'kh.objectindikasifk', 'ru.namaruangan', 'kh.objecthygienefk', 'kh.objectpegawaifk', 'pg.namalengkap', 'kh.langkah', 'kh.objectjenispegawaifk', 'jp.jenispegawai', 'kh.kesempatan', 'kh.langkah')
            ->where('kh.statusenabled', true)
            ->orderBy('kh.tanggal');
        $filter = $request->all();

        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('kh.tanggal', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $data = $data->where('kh.tanggal', '<=', $filter['tglAkhir']);
        }
        if (isset($filter['pgid']) && $filter['pgid'] != "" && $filter['pgid'] != "undefined") {
            $data = $data->where('kh.objectpegawaifk', '=', $filter['pgid']);
        }
        if (isset($filter['prid']) && $filter['prid'] != "" && $filter['prid'] != "undefined") {
            $data = $data->where('kh.objectjenispegawaifk', '=', $filter['prid']);
        }
        if (isset($filter['bngid']) && $filter['bngid'] != "" && $filter['bngid'] != "undefined") {
            $data = $data->where('kh.objectruanganfk', '=', $filter['bngid']);
        }
        if (isset($filter['indikasiid']) && $filter['indikasiid'] != "" && $filter['indikasiid'] != "undefined") {
            $data = $data->where('ink.id', '=', $filter['indikasiid']);
        }
        $data = $data->get();

        // foreach ($data as $key => $value) {
        //        $indikasi = \DB::table('indikasi_m')->get();
        //        $handhygiene = \DB::table('handhygiene_m')->get();

        //     # code...
        // }
        $result = array(
            'data' => $data,
            'message' => 'afd@epic',
        );
        return $this->respond($result);
    }

    public function saveBatalKepatuhanHandHygiene(Request $request)
    {
        DB::beginTransaction();
        $dataReq = $request->all();

        try {

            // ($dataReq['norec'] == '')
            // $dataSave = new KepatuhanCuciTangan();
            // $dataSave->norec = $dataSave->generateNewId();
            # code...


            KepatuhanHandHygiene::where('norec', $request['norec'])
                ->update([

                    'statusenabled' => 0,
                ]);


            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Hapus Berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'afd@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message' => $transStatus,
                'as' => 'afd@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    
    public function saveDataKepatuhanHandHygieneArray(Request $request)
    {
        DB::beginTransaction();
        // $dataReq = $request->all();
        // return($dataReq);
        // die();

        // try {
            foreach ($request['datas'] as $key => $value) {
                // return($value['norec']);
                // die();
                if ($value['norec'] == '') {
                    $dataSave = new KepatuhanHandHygiene();
                    $dataSave->norec = $dataSave->generateNewId();
                    $dataSave->kdprofile = 0;
                    $dataSave->statusenabled = true;
                    # code...
                } else {
    
                    // return($value['tanggal']);
                    // die();
                    $dataSave = KepatuhanHandHygiene::where('norec', $value['norec'])->first();
                }
                $dataSave->tanggal = $value['tanggal'];
                $dataSave->objectjenispegawaifk = $value['objectjenispegawaifk'];
                $dataSave->objectpegawaifk = $value['objectpegawaifk'];
                $dataSave->objectindikasifk = $value['objectindikasifk'];
                $dataSave->objecthygienefk = $value['objecthygienefk'];
                $dataSave->langkah = $value['langkah'];
                $dataSave->objectruanganfk = $value['objectruanganfk'];
                $dataSave->kesempatan = $value['kesempatan'];
    
                $dataSave->save();
    
    
                // $transStatus = 1;
            }
        // } catch (\Exception $e) {
        //     $transStatus = false;
        // }

        $transStatus = 'true';
        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => $dataSave,
                "as" => 'afd@epic',
            );
        } else {
            $transMessage = " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'afd@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getNilaiStatisIGD(Request $request)
    {
        $objectid = '';
        $noregistrasi = '';
        $idemr = '';

        if (isset($request['objectidawal']) && $request['objectidawal'] != '' && isset($request['objectidakhir']) && $request['objectidakhir'] != '') {
            $objectid = ' and emrdp.emrdfk BETWEEN ' . $request['objectidawal'] . ' and ' . $request['objectidakhir'];
        }
        if (isset($request['noregistrasi']) && $request['noregistrasi'] != '') {
            $noregistrasi = " and emrp.noregistrasifk='" . $request['noregistrasi'] . "'";
        }
        if (isset($request['idemr']) && $request['idemr'] != '') {
            $idemr = ' and emrdp.emrfk=' . $request['idemr'];
        }
        $data = DB::select(DB::raw("select sum( x.nilai) as nilai from (
                SELECT emrp.tglemr , emrdp.[value], emrdp.emrdfk, emrdp.emrfk, cast(emd.reportdisplay as int)as nilai
                FROM [dbo].[emrpasien_t] emrp
                left join emrpasiend_t emrdp on emrdp.emrpasienfk =emrp.noemr
                left join emrd_t emd on emd.id =emrdp.emrdfk
                where emrp.statusenabled= 1
                and emrdp.statusenabled= 1 
                and emrdp.value= 1
               $idemr
                $objectid
                $noregistrasi
                GROUP BY  emrdp.[value],emrdp.emrdfk,emrdp.emrfk,emd.reportdisplay,emrp.tglemr
                ) as x
                GROUP BY x.tglemr
                ORDER BY x.tglemr desc"));

        $result = array(
            'data' => $data,
            'message' => 'as@epic',
        );
        return $this->respond($result);
    }

    public function disableEMRdetail(Request $request)
    {
        DB::beginTransaction();
        try {
            $emr = EMRPasienD::where('emrfk', $request['idemr'])
                ->where('emrpasienfk', $request['noemr'])
                ->first();
            $pegawai = Pegawai::where('id', $request['idpegawai'])->first();

            if ($emr->pegawaifk != null && $emr->pegawaifk != $request['idpegawai']) {
                $pegawaiInput = Pegawai::where('id', $emr->pegawaifk)->first();
                $transMessage = "Hanya User yang mengisi yang bisa menghapus. ( " . $pegawaiInput->namalengkap . " )";
                DB::rollBack();
                $result = array(
                    "status" => 400,
                    "message" => $transMessage,
                    "as" => 'er@epic',
                );
                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }

            EMRPasienD::where('emrfk', $request['idemr'])
                ->where('emrpasienfk', $request['noemr'])
                ->update([
                    'statusenabled' => false,
                ]);
            $emrdetail = EMRPasienD::where('emrpasienfk', $request['noemr'])
                ->where('statusenabled', true)
                ->get();
            if (count($emrdetail) == 0) {
                EMRPasien::where('norec', $request['norec'])
                    ->update([
                        'statusenabled' => false,
                    ]);
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Hapus Berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'er@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message' => $transStatus,
                'as' => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDataMetodebelajar(Request $request)
    {
        $req = $request->all();
        $dataProduk = \DB::table('Metodecarabelajar_m')
            ->select('id as value', 'indikasi as text')
            ->where('statusenabled', true)
            ->orderBy('indikasi');
        if (
            isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $dataProduk = $dataProduk->where('indikasi', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%');
        };
        $dataProduk = $dataProduk->take(10);
        $dataProduk = $dataProduk->get();

        return $this->respond($dataProduk);
    }

    public function getDataDiagnosaPrimary(Request $request, $Noregistrasi)
    {
        $data = \DB::table('pasiendaftar_t AS pd')
            ->select(DB::raw("dg.id,dg.kddiagnosa,dg.namadiagnosa"))
            ->Join('antrianpasiendiperiksa_t AS apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->Join('diagnosapasien_t AS dp', 'dp.noregistrasifk', '=', 'apd.norec')
            ->Join('detaildiagnosapasien_t AS ddp', 'ddp.objectdiagnosapasienfk', '=', 'dp.norec')
            ->Join('diagnosa_m AS dg', 'dg.id', '=', 'ddp.objectdiagnosafk')
            ->where('dp.statusenabled', true)
            ->where('pd.noregistrasi', $Noregistrasi)
            ->take(1)
            ->get();
        return $this->respond($data);
    }

    public function getDataDiagnosaJiwa(Request $request)
    {
        $req = $request->all();
        $dataProduk = \DB::table('diagnosajiwa_m')
            ->select('id as value', 'diagnosajiwa as text')
            ->where('statusenabled', true)
            ->orderBy('diagnosajiwa');
        if (
            isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $dataProduk = $dataProduk->where('diagnosajiwa', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%');
        };
        $dataProduk = $dataProduk->take(10);
        $dataProduk = $dataProduk->get();

        return $this->respond($dataProduk);
    }
    public function jawabKonsul(Request $request)
    {
        DB::beginTransaction();
        try {

            $dataSO = StrukOrder::where('norec', $request['norec_so'])->update([
                'keteranganlainnya' =>  $request['jawaban']
            ]);



            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        if ($transStatus == 'true') {
            $transMessage = 'Sukses';
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,

                "as" => 'er@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "as" => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDataPendidikan(Request $request)
    {
        $req = $request->all();
        $dataProduk = \DB::table('pendidikan_m')
            ->select('id as value', 'pendidikan as text')
            ->where('statusenabled', true)
            ->orderBy('pendidikan');
        if (
            isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $dataProduk = $dataProduk->where('pendidikan', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%');
        };
        $dataProduk = $dataProduk->take(10);
        $dataProduk = $dataProduk->get();

        return $this->respond($dataProduk);
    }
    public function getDataPerkawinan(Request $request)
    {
        $req = $request->all();
        $dataProduk = \DB::table('statusperkawinan_m')
            ->select('id as value', 'statusperkawinan as text')
            ->where('statusenabled', true)
            ->orderBy('statusperkawinan');
        if (
            isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $dataProduk = $dataProduk->where('statusperkawinan', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%');
        };
        $dataProduk = $dataProduk->take(10);
        $dataProduk = $dataProduk->get();

        return $this->respond($dataProduk);
    }
    public function getDataPekerjaan(Request $request)
    {
        $req = $request->all();
        $dataProduk = \DB::table('pekerjaan_m')
            ->select('id as value', 'pekerjaan as text')
            ->where('statusenabled', true)
            ->orderBy('pekerjaan');
        if (
            isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $dataProduk = $dataProduk->where('pekerjaan', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%');
        };
        $dataProduk = $dataProduk->take(10);
        $dataProduk = $dataProduk->get();

        return $this->respond($dataProduk);
    }

    public function getMenuEmrById(Request $request)
    {

        $dataRaw = \DB::table('emr_t as emr')
            ->where('emr.statusenabled', true)
            ->where('emr.id', $request['id'])
            ->select('emr.*')
            ->first();

        $result = array(
            'data' => $dataRaw,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }

    public function getDataKepatuhanHandHygieneIPCN(Request $request)
    {
        $bln = '';
        if (isset($request['bln']) && $request['bln'] != "" && $request['bln'] != "undefined") {
            $bln = "AND format([kh].[tanggal],'yyyy-MM') ='" . $request['bln'] . "' ";
        };

        $data = \DB::select(DB::raw("SELECT x.bulan, x.tahun, x.namaruangan, x.jenispegawai, SUM(x.patuh) AS patuh, SUM(x.tidakpatuh) AS tidakpatuh
            FROM 
                (SELECT
                    MONTH([kh].[tanggal]) AS bulan,
                    YEAR([kh].[tanggal]) AS tahun,
                    [ru].[namaruangan],
                    [jp].[jenispegawai],
                    CASE WHEN[kh].[langkah]=2 THEN 1 ELSE 0 END AS patuh,
                    CASE WHEN[kh].[langkah]!=2 THEN 1 ELSE 0 END AS tidakpatuh
                FROM
                    [kepatuhanhandhygiene_t] AS [kh]
                LEFT JOIN [ruangan_m] AS [ru] ON [ru].[id] = [kh].[objectruanganfk]
                LEFT JOIN [pegawai_m] AS [pg] ON [pg].[id] = [kh].[objectpegawaifk]
                LEFT JOIN [jenispegawai_m] AS [jp] ON [jp].[id] = [kh].[objectjenispegawaifk]
                WHERE
                    [kh].[statusenabled] = 1 
                    $bln) AS x
            GROUP BY x.tahun, x.bulan, x.namaruangan, x.jenispegawai "));

        $result = array(
            'data' => $data,
            'message' => 'dy@epic',
        );
        return $this->respond($result);
    }
    public function getEMRTransaksiDetailEkg(Request $request)
    {
        //todo : detail
        $data = \DB::table('emrpasiend_t as emrdp')
            ->join('emrpasien_t as emrp', 'emrp.noemr', '=', 'emrdp.emrpasienfk')
            ->leftjoin('emrd_t as emrd', 'emrd.id', '=', 'emrdp.emrdfk')
            // ->JOIN('emrd_t as emrd',function ($join){
            // $join->on('emrd.id','=','emrdp.emrdfk');
            // $join->on('emrd.emrfk','=','emrdp.emrfk');
            // })
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'emrdp.pegawaifk')
            ->leftjoin('emrfoto_t as ef', 'ef.noemrpasienfk', '=', 'emrp.noemr')
            ->select('emrdp.*', 'emrd.caption', 'emrd.type', 'emrd.nourut', 'emrdp.emrfk', 'emrd.reportdisplay', 'emrd.kodeexternal as kodeex', 'emrd.satuan', 'pg.namalengkap', 'ef.image')
            ->where('emrdp.statusenabled', true)
            ->orderBy('emrd.nourut');
        if (isset($request['noemr']) && $request['noemr'] != '') {
            $data = $data->where('emrp.noemr', $request['noemr']);
        }
        if (isset($request['emrfk']) && $request['emrfk'] != '') {
            $data = $data->where('emrdp.emrfk', $request['emrfk']);
        }
        if (isset($request['norec']) && $request['norec'] != '') {
            $data = $data->where('emrp.norec', $request['norec']);
        }
        if (isset($request['noregistrasi']) && $request['noregistrasi'] != '') {
            $data = $data->where('emrp.noregistrasifk', $request['noregistrasi']);
        }
        if (isset($request['objectid']) && $request['objectid'] != '') {
            $data = $data->where('emrdp.emrdfk', $request['objectid']);
        }
        if (isset($request['emrfk']) && $request['emrfk'] != '') {
            $data = $data->where('ef.emrfk', $request['emrfk']);
        }
        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'as@epic',
        );
        return $this->respond($result);
    }
    public function SaveTransaksiEMRnew(Request $request)
    {
        DB::beginTransaction();
        $dataReq = $request->all();

        $head = $dataReq['head'];
        $data = $dataReq['data'];

        //        foreach ($data as $itm){
        //            $dtdt[] = $itm;
        //        }
        //
        //        $keys = array_keys($data);
        $noemr = $this->generateCodeBySeqTable(new EMRPasien, 'noemr', 15, 'MR' . date('ym') . '/');

        if ($noemr == '') {
            $transMessage = "Gagal mengumpukan data, Coba lagi.!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "as" => 'as@epic',
            );
            return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        }

        try {
            if ($head['norec_emr'] == '-') {
                //                $noemr = $this->generateCode(new EMRPasien, 'noemr', 12, 'MR' . $this->getDateTime()->format('ym') . '/');
                //                $noemr = $this->generateCode(new EMRPasien, 'noemr', 14, 'MR' . $this->getDateTime()->format('ym') . '/');

                $EMR = new EMRPasien();
                $norecHead = $EMR->generateNewId();
                $EMR->norec = $norecHead;
                $norecTehMenikitunyaeuy = $norecHead;
                $EMR->norec = $norecTehMenikitunyaeuy;
                $EMR->kdprofile = 11;
                $EMR->statusenabled = 1;
            } else {
                $EMR = EMRPasien::where('noemr', $head['norec_emr'])->first();
                $noemr = $EMR->noemr;
            }
            $EMR->noemr = $noemr;
            $EMR->emrfk = $head['emrfk'];
            if (isset($head['norec_pd'])) {
                $EMR->noregistrasifk = $head['norec_pd'];
            }
            $EMR->nocm = $head['nocm'];
            $EMR->namapasien = $head['namapasien'];
            $EMR->jeniskelamin = $head['jeniskelamin'];
            if (isset($head['noregistrasi'])) {
                $EMR->noregistrasifk = $head['noregistrasi'];
            }
            $EMR->umur = $head['umur'];
            if (isset($head['kelompokpasien'])) {
                $EMR->kelompokpasien = $head['kelompokpasien'];
            }
            if (isset($head['tglregistrasi'])) {
                $EMR->tglregistrasi = $head['tglregistrasi'];
            }
            if (isset($head['norec'])) {
                $EMR->norec_apd = $head['norec'];
            }
            if (isset($head['namakelas'])) {
                $EMR->namakelas = $head['namakelas'];
            }
            if (isset($head['namaruangan'])) {
                $EMR->namaruangan = $head['namaruangan'];
            } else {
                $EMR->namaruangan = "Triage Gawat Darurat";
            }
            if (isset($head['tgllahir'])) {
                $EMR->tgllahir = $head['tgllahir'];
            }
            if (isset($head['notelepon'])) {
                $EMR->notelepon = $head['notelepon'];
            }
            if (isset($head['alamatlengkap'])) {
                $EMR->alamat = $head['alamatlengkap'];
            }
            if (isset($head['jenisemr'])) {
                $EMR->jenisemr = $head['jenisemr'];
            }
            $EMR->pegawaifk = $this->getCurrentUserID();
            $EMR->tglemr = $this->getDateTime()->format('Y-m-d H:i:s');
            $EMR->save();

            $norec_EMR = $EMR->noemr;

            $EMRDelete = EMRPasienD::where('emrpasienfk', $norec_EMR)
                ->where('emrfk', $head['emrfk'])
                ->update([
                    'statusenabled' => false
                ]);
            $i = 0;
            //            foreach ($keys as $ky) {
            //                $emrdfk = $ky;
            //                $valueemr = $dtdt[$i];
            foreach ($data as $item) {
                $emrdfk = $item['id'];
                if (is_array($item['values'])) {
                    $valueemr = $item['values']['id'] . '~' . $item['values']['namalengkap'];
                } else {
                    $valueemr = $item['values'];
                }

                $EMRD = new EMRPasienD();
                $norecD = $EMRD->generateNewId();
                $EMRD->norec = $norecD;
                $EMRD->kdprofile = 1;
                $EMRD->statusenabled = 1;
                $EMRD->emrpasienfk = $norec_EMR;
                $EMRD->value = $valueemr;
                $EMRD->emrdfk = $emrdfk;
                $EMRD->emrfk = $head['emrfk'];
                $EMRD->pegawaifk = $this->getCurrentUserID();
                $EMRD->tgl = $this->getDateTime()->format('Y-m-d H:i:s');
                $EMRD->save();
                $i = $i + 1;
            }

            if (isset($dataReq['image']) && $dataReq['image'] != null) {
                //egi
                $img = $dataReq['image'];
                $datas = unpack("H*hex", $img);
                $datas = '0x' . $datas['hex'];
                #egi
                $dataGambar = \DB::table('emrfoto_t as tt')
                    ->where('tt.noemrpasienfk', '=', $norec_EMR)
                    ->where('tt.emrfk', '=', $head['emrfk'])
                    ->first();
                //                return $this->respond($noRec);
                if ($dataGambar == '' || $dataGambar == null) {
                    $emrFto = new EmrFoto();
                    $norecFto = $emrFto->generateNewId();
                    $emrFto->norec = $norecFto;
                    $emrFto->kdprofile = 12;
                    $emrFto->statusenabled = 1;
                    $emrFto->noemrpasienfk = $norec_EMR;
                    $emrFto->emrfk = $head['emrfk'];
                } else {
                    $emrFto = EmrFoto::where('noemrpasienfk', $norec_EMR)->first();
                }
                $emrFto->image = \DB::raw("CONVERT(VARBINARY(MAX), $datas)");
                $emrFto->save();
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = 'Saving EMR Pasien ';

        if ($transStatus == 'true') {
            $transMessage = $transMessage . "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => $EMR,
                "data2" => $EMRD,
                //                "keys" => $keys,
                //                "dtdt" => $dtdt,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "data" => $data,
                //                "keys" => $keys,
                //                "dtdt" => $dtdt,
                "as" => 'as@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function updatenoemricu(Request $request)
    {
        DB::beginTransaction();
        try {

            $data = RekamMedisICU::where('norec', $request['norec'])->update(['nomoremr' => $request['nomorEMR']]);
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = 'Saving EMR Pasien ';

        if ($transStatus == 'true') {
            $transMessage = $transMessage . "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                //                "keys" => $keys,
                //                "dtdt" => $dtdt,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                //                "keys" => $keys,
                //                "dtdt" => $dtdt,
                "as" => 'as@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    protected function generateCodeEMR($objectModel, $atrribute, $length = 8, $prefix = '')
    {
        DB::beginTransaction();
        try {
            $result = SeqNumberEMR::where('seqnumber', 'ilike', $prefix . '%')
                ->where('seqname', $atrribute)
                ->where('kdprofile', 1)
                ->max('seqnumber');
            $prefixLen = strlen($prefix);
            $subPrefix = substr(trim($result), $prefixLen);
            $SN = $prefix . (str_pad((int)$subPrefix + 1, $length - $prefixLen, "0", STR_PAD_LEFT));

            $newSN = new SeqNumberEMR();
            $newSN->kdprofile = 1;
            $newSN->seqnumber = $SN;
            $newSN->tgljamseq = date('Y-m-d H:i:s');;
            $newSN->seqname = $atrribute;
            $newSN->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            DB::commit();
            return $SN;
        } else {
            DB::rollBack();
            return '';
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getVitalSign(Request $request)
    {
        $objectid = '';
        $noregistrasi = '';
        $idemr = '';

        if (isset($request['objectidawal']) && $request['objectidawal'] != '' && isset($request['objectidakhir']) && $request['objectidakhir'] != '') {
            $objectid = ' and epd.emrdfk BETWEEN ' . $request['objectidawal'] . ' and ' . $request['objectidakhir'];
        }
        if (isset($request['noregistrasi']) && $request['noregistrasi'] != '') {
            $noregistrasi = " and ep.noregistrasifk='" . $request['noregistrasi'] . "'";
        }
        if (isset($request['idemr']) && $request['idemr'] != '') {
            $idemr = ' epd.emrfk=' . $request['idemr'];
        }
        $data = DB::select(DB::raw("SELECT epd.[value], epd.emrdfk FROM emrpasiend_t as epd
            INNER JOIN emrpasien_t as ep ON ep.noemr = epd.emrpasienfk
            WHERE 
            $idemr 
            $noregistrasi 
            $objectid
            AND epd.statusenabled = 1
            ORDER BY epd.emrdfk"));

        $result = array(
            'data' => $data,
            'message' => 'afd@epic',
        );
        return $this->respond($result);
    }
    public function getRiwayatOrderElektro(Request $request)
    {
        $results = [];

        $ruanganRad = explode(',', $this->settingDataFixed('kdRuanganElektromedik'));
        $kdRuangRad = [];
        foreach ($ruanganRad as $item) {
            $kdRuangRad[] = (int)$item;
        }
        $data = \DB::table('strukorder_t as so')
            //            ->LEFTJOIN('orderpelayanan_t as op','op.noorderfk','=','so.norec')
            ->LEFTJOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'so.noregistrasifk')
            ->LEFTJOIN('pasien_m as ps', 'pd.nocmfk', '=', 'ps.id')
            ->LEFTJOIN('ruangan_m as ru', 'ru.id', '=', 'so.objectruanganfk')
            ->LEFTJOIN('ruangan_m as ru2', 'ru2.id', '=', 'so.objectruangantujuanfk')
            ->LEFTJOIN('pegawai_m as p', 'p.id', '=', 'so.objectpegawaiorderfk')
            //            ->LEFTJOIN('ris_order as pp','pp.order_no','=','so.noorder')
            ->select(
                'so.norec',
                'so.tglorder',
                'so.noorder',
                'ru.namaruangan as ruanganasal',
                'ru2.namaruangan as ruangantujuan',
                'p.namalengkap',
                'so.statusorder',
                'pd.noregistrasi',
                'so.objectruangantujuanfk',
                'so.statusorder',
                'so.keteranganlainnya'
                //                DB::raw('case when pp.order_no is null then \'PENDING\' else \'SELESAI DIPERIKSA\' end as statusorder')
            );
        if (isset($request['noregistrasi']) && $request['noregistrasi'] != "" && $request['noregistrasi'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $request['noregistrasi']);
        }
        if (isset($request['NoCM']) && $request['NoCM'] != "" && $request['NoCM'] != "undefined") {
            $data = $data->where('ps.nocm', '=', $request['NoCM']);
        }
        $data = $data->where('so.objectruangantujuanfk',  $this->settingDataFixed('kdRuanganElektromedik'));
        $data = $data->where('so.statusenabled', true);
        $data = $data->orderBy('so.tglorder');
        //        $data = $data->distinct();
        $data = $data->get();
        $status = '';
        foreach ($data as $item) {


            if ($item->statusorder != null) {
                $status = 'Verifikasi';
            } else {
                $status = 'Belum Verifikasi';
            }


            $details = DB::select(
                DB::raw("
                             select so.tglorder,so.noorder,
                            pr.id,pr.namaproduk,op.qtyproduk
                            from strukorder_t as so
                            left join orderpelayanan_t as op on op.noorderfk = so.norec
                            left join pasiendaftar_t as pd on pd.norec=so.noregistrasifk
                            left join produk_m as pr on pr.id=op.objectprodukfk
                            left join ruangan_m as ru on ru.id=so.objectruanganfk
                            left join ruangan_m as ru2 on ru2.id=so.objectruangantujuanfk
                            left join pegawai_m as p on p.id=so.objectpegawaiorderfk
                            where so.noorder=:noorder"),
                array(
                    'noorder' => $item->noorder,
                )
            );
            $results[] = array(
                'noregistrasi' => $item->noregistrasi,
                'tglorder' => $item->tglorder,
                'noorder' => $item->noorder,
                'norec' => $item->norec,
                'namaruanganasal' => $item->ruanganasal,
                'namaruangantujuan' => $item->ruangantujuan,
                'dokter' => $item->namalengkap,
                'statusorder' => $status,
                'keteranganlainnya' =>  $item->keteranganlainnya,
                'details' => $details,
            );
        }

        $result = array(
            'daftar' => $results,
            'message' => 'er@epic',
        );

        return $this->respond($result);
    }

    public function getInfoEMRPasien(Request $request)
    {

        $data = \DB::table('pasiendaftar_t AS pd')
            ->JOIN('pasien_m AS ps', 'ps.id', '=', 'pd.nocmfk')
            ->WHERE('pd.noregistrasi', $request['noregistrasi'])
            ->select('ps.notelepon');

        $data = $data->get();

        $result = array(
            'data' => $data,
            'message' => 'dy@epic',
        );
        return $this->respond($result);
    }

    public function SaveKeteranganDelegasiObatDetail(Request $request)
    {
        DB::beginTransaction();
        try {
            $data = FormulisObatDetail::where('norec', $request['norec'])->update(['keterangan' => $request['keterangan']]);
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "data" => $data,
                "as" => 'dy@epic'
            );
        } else {
            $transMessage = "Simpan Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "noresep" => $data, //$noResep,
                "as" => 'dy@epic'
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function SavePerawatDelegasiObatDetail(Request $request)
    {
        DB::beginTransaction();
        try {

            foreach ($request['data'] as $item) {
                if ($item['waktuminum'] == 'P (6.00 - 7.00)') {
                    $data = FormulisObatDetail::where('norec', $item['norec'])->update(['perawatfk' => $request['perawat'], 'keterangan' => $request['keterangan'], 'tglperawatdelegasi' => $request['jamperawatdelegasi']]);
                } else if ($item['waktuminum'] == 'S (12.00 - 13.00)') {
                    $data = FormulisObatDetail::where('norec', $item['norec'])->update(['perawatsiangfk' => $request['perawat'], 'keterangan' => $request['keterangan'], 'tglperawatdelegasi' => $request['jamperawatdelegasi']]);
                } else if ($item['waktuminum'] == 'SR (18.00 - 19.00)') {
                    $data = FormulisObatDetail::where('norec', $item['norec'])->update(['perawatsorefk' => $request['perawat'], 'keterangan' => $request['keterangan'], 'tglperawatdelegasi' => $request['jamperawatdelegasi']]);
                } else if ($item['waktuminum'] == 'M (23.00 - 24.00)') {
                    $data = FormulisObatDetail::where('norec', $item['norec'])->update(['perawatmalamfk' => $request['perawat'], 'keterangan' => $request['keterangan'], 'tglperawatdelegasi' => $request['jamperawatdelegasi']]);
                }
            }


            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "data" => $data,
                "as" => 'dy@epic'
            );
        } else {
            $transMessage = "Simpan Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "noresep" => $data, //$noResep,
                "as" => 'dy@epic'
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function SavePerawatDelegasiObat(Request $request)
    {
        DB::beginTransaction();
        //        try{

        foreach ($request['data'] as $item) {
            $data = FormulisObat::where('norec1', $item['norec'])->update(['perawatfk' => $request['perawat']]);
            $dataD = FormulisObatDetail::where('formulirobatfk', $item['norec'])->update(['perawatfk' => $request['perawat']]);
        }

        //            $transStatus = 'true';
        //        } catch (\Exception $e) {
        $transStatus = 'false';
        //        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                //                "data" => $data,
                "as" => 'dy@epic'
            );
        } else {
            $transMessage = "Simpan Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                //                "noresep" => $data,//$noResep,
                "as" => 'dy@epic'
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getRekapDelegasiObat(Request $request)
    {
        $data = DB::select(DB::raw("DECLARE @firstmonth INT

            SET @firstmonth = (
            SELECT TOP 1 CAST(SUBSTRING(a.jamdelegasi, 9, 2) AS INT) FROM (
            SELECT pr.namaproduk, rf.name as rute, frd.dosis,
            CASE WHEN frd.ispagi = 1 THEN 'P'
            WHEN frd.issiang = 1 THEN 'S'
            WHEN frd.issore = 1 THEN 'SR'
            WHEN frd.ismalam = 1 THEN 'M' ELSE '-' END AS waktuminum,
            CASE WHEN frd.perawatfk IS NOT NULL THEN SUBSTRING(CONVERT(VARCHAR,frd.tglperawatdelegasi,120), 9, 2)+'-'+SUBSTRING(pg1.namalengkap, 1, 1)+'-'+SUBSTRING(CONVERT(VARCHAR,frd.tglperawatdelegasi,120), 12, 2)+'-'+SUBSTRING(CONVERT(VARCHAR,frd.tglperawatdelegasi,120), 6, 2)
            WHEN frd.perawatsiangfk IS NOT NULL THEN SUBSTRING(CONVERT(VARCHAR,frd.tglperawatdelegasi,120), 9, 2)+'-'+SUBSTRING(pg2.namalengkap, 1, 1)+'-'+SUBSTRING(CONVERT(VARCHAR,frd.tglperawatdelegasi,120), 12, 2)+'-'+SUBSTRING(CONVERT(VARCHAR,frd.tglperawatdelegasi,120), 6, 2)
            WHEN frd.perawatsorefk IS NOT NULL THEN SUBSTRING(CONVERT(VARCHAR,frd.tglperawatdelegasi,120), 9, 2)+'-'+SUBSTRING(pg3.namalengkap, 1, 1)+'-'+SUBSTRING(CONVERT(VARCHAR,frd.tglperawatdelegasi,120), 12, 2)+'-'+SUBSTRING(CONVERT(VARCHAR,frd.tglperawatdelegasi,120), 6, 2)
            WHEN frd.perawatmalamfk IS NOT NULL THEN SUBSTRING(CONVERT(VARCHAR,frd.tglperawatdelegasi,120), 9, 2)+'-'+SUBSTRING(pg4.namalengkap, 1, 1)+'-'+SUBSTRING(CONVERT(VARCHAR,frd.tglperawatdelegasi,120), 12, 2)+'-'+SUBSTRING(CONVERT(VARCHAR,frd.tglperawatdelegasi,120), 6, 2)
            ELSE '-'
            END AS jamdelegasi,
            fr.tglpelayanan
            FROM formulirobat_t AS fr
            INNER JOIN formulirobatdetail_t AS frd ON frd.formulirobatfk = fr.norec
            INNER JOIN pasiendaftar_t AS pd ON pd.norec = fr.norec_pd
            INNER JOIN produk_m AS pr ON pr.id = frd.produkfk
            LEFT JOIN routefarmasi as rf on rf.id=frd.routefk
            LEFT JOIN pegawai_m as pg on pg.id=frd.pegawaifarmasifk
            LEFT JOIN pegawai_m as pg1 on pg1.id=frd.perawatfk
            LEFT JOIN pegawai_m as pg2 on pg2.id=frd.perawatsiangfk
            LEFT JOIN pegawai_m as pg3 on pg3.id=frd.perawatsorefk
            LEFT JOIN pegawai_m as pg4 on pg4.id=frd.perawatmalamfk
            WHERE pd.noregistrasi = " . $request['noreg'] . ") AS a
            WHERE a.jamdelegasi != '-'
            ORDER BY a.tglpelayanan ASC)
            
            SELECT y.namaproduk, y.rute, y.dosis, y.waktuminum,
            STRING_AGG(y.a1, ',') AS 'a1',
            STRING_AGG(y.b1, ',') AS 'b1',
            STRING_AGG(y.c1, ',') AS 'c1',
            STRING_AGG(y.a2, ',') AS 'a2',
            STRING_AGG(y.b2, ',') AS 'b2',
            STRING_AGG(y.c2, ',') AS 'c2',
            STRING_AGG(y.a3, ',') AS 'a3',
            STRING_AGG(y.b3, ',') AS 'b3',
            STRING_AGG(y.c3, ',') AS 'c3',
            STRING_AGG(y.a4, ',') AS 'a4',
            STRING_AGG(y.b4, ',') AS 'b4',
            STRING_AGG(y.c4, ',') AS 'c4',
            STRING_AGG(y.a5, ',') AS 'a5',
            STRING_AGG(y.b5, ',') AS 'b5',
            STRING_AGG(y.c5, ',') AS 'c5',
            STRING_AGG(y.a6, ',') AS 'a6',
            STRING_AGG(y.b6, ',') AS 'b6',
            STRING_AGG(y.c6, ',') AS 'c6',
            STRING_AGG(y.a7, ',') AS 'a7',
            STRING_AGG(y.b7, ',') AS 'b7',
            STRING_AGG(y.c7, ',') AS 'c7',
            STRING_AGG(y.a8, ',') AS 'a8',
            STRING_AGG(y.b8, ',') AS 'b8',
            STRING_AGG(y.c8, ',') AS 'c8',
            STRING_AGG(y.a9, ',') AS 'a9',
            STRING_AGG(y.b9, ',') AS 'b9',
            STRING_AGG(y.c9, ',') AS 'c9',
            STRING_AGG(y.a10, ',') AS 'a10',
            STRING_AGG(y.b10, ',') AS 'b10',
            STRING_AGG(y.c10, ',') AS 'c10',
            STRING_AGG(y.a11, ',') AS 'a11',
            STRING_AGG(y.b11, ',') AS 'b11',
            STRING_AGG(y.c11, ',') AS 'c11',
            STRING_AGG(y.a12, ',') AS 'a12',
            STRING_AGG(y.b12, ',') AS 'b12',
            STRING_AGG(y.c12, ',') AS 'c12',
            STRING_AGG(y.a13, ',') AS 'a13',
            STRING_AGG(y.b13, ',') AS 'b13',
            STRING_AGG(y.c13, ',') AS 'c13',
            STRING_AGG(y.a14, ',') AS 'a14',
            STRING_AGG(y.b14, ',') AS 'b14',
            STRING_AGG(y.c14, ',') AS 'c14',
            STRING_AGG(y.a15, ',') AS 'a15',
            STRING_AGG(y.b15, ',') AS 'b15',
            STRING_AGG(y.c15, ',') AS 'c15',
            STRING_AGG(y.a16, ',') AS 'a16',
            STRING_AGG(y.b16, ',') AS 'b16',
            STRING_AGG(y.c16, ',') AS 'c16',
            STRING_AGG(y.a17, ',') AS 'a17',
            STRING_AGG(y.b17, ',') AS 'b17',
            STRING_AGG(y.c17, ',') AS 'c17',
            STRING_AGG(y.a18, ',') AS 'a18',
            STRING_AGG(y.b18, ',') AS 'b18',
            STRING_AGG(y.c18, ',') AS 'c18',
            STRING_AGG(y.a19, ',') AS 'a19',
            STRING_AGG(y.b19, ',') AS 'b19',
            STRING_AGG(y.c19, ',') AS 'c19',
            STRING_AGG(y.a20, ',') AS 'a20',
            STRING_AGG(y.b20, ',') AS 'b20',
            STRING_AGG(y.c20, ',') AS 'c20',
            STRING_AGG(y.a21, ',') AS 'a21',
            STRING_AGG(y.b21, ',') AS 'b21',
            STRING_AGG(y.c21, ',') AS 'c21',
            STRING_AGG(y.a22, ',') AS 'a22',
            STRING_AGG(y.b22, ',') AS 'b22',
            STRING_AGG(y.c22, ',') AS 'c22',
            STRING_AGG(y.a23, ',') AS 'a23',
            STRING_AGG(y.b23, ',') AS 'b23',
            STRING_AGG(y.c23, ',') AS 'c23',
            STRING_AGG(y.a24, ',') AS 'a24',
            STRING_AGG(y.b24, ',') AS 'b24',
            STRING_AGG(y.c24, ',') AS 'c24',
            STRING_AGG(y.a25, ',') AS 'a25',
            STRING_AGG(y.b25, ',') AS 'b25',
            STRING_AGG(y.c25, ',') AS 'c25',
            STRING_AGG(y.a26, ',') AS 'a26',
            STRING_AGG(y.b26, ',') AS 'b26',
            STRING_AGG(y.c26, ',') AS 'c26',
            STRING_AGG(y.a27, ',') AS 'a27',
            STRING_AGG(y.b27, ',') AS 'b27',
            STRING_AGG(y.c27, ',') AS 'c27',
            STRING_AGG(y.a28, ',') AS 'a28',
            STRING_AGG(y.b28, ',') AS 'b28',
            STRING_AGG(y.c28, ',') AS 'c28',
            STRING_AGG(y.a29, ',') AS 'a29',
            STRING_AGG(y.b29, ',') AS 'b29',
            STRING_AGG(y.c29, ',') AS 'c29',
            STRING_AGG(y.a30, ',') AS 'a30',
            STRING_AGG(y.b30, ',') AS 'b30',
            STRING_AGG(y.c30, ',') AS 'c30',
            STRING_AGG(y.a31, ',') AS 'a31',
            STRING_AGG(y.b31, ',') AS 'b31',
            STRING_AGG(y.c31, ',') AS 'c31'
            FROM (
            SELECT x.namaproduk, x.rute, x.dosis, x.waktuminum,
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '01' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 1 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'a1',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '01' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 2 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'b1',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '01' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 3 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'c1',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '02' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 1 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'a2',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '02' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 2 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'b2',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '02' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 3 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'c2',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '03' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 1 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'a3',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '03' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 2 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'b3',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '03' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 3 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'c3',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '04' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 1 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'a4',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '04' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 2 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'b4',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '04' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 3 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'c4',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '05' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 1 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'a5',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '05' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 2 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'b5',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '05' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 3 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'c5',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '06' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 1 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'a6',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '06' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 2 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'b6',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '06' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 3 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'c6',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '07' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 1 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'a7',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '07' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 2 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'b7',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '07' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 3 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'c7',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '08' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 1 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'a8',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '08' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 2 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'b8',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '08' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 3 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'c8',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '09' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 1 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'a9',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '09' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 2 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'b9',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '09' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 3 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'c9',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '10' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 1 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'a10',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '10' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 2 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'b10',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '10' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 3 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'c10',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '11' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 1 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'a11',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '11' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 2 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'b11',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '11' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 3 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'c11',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '12' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 1 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'a12',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '12' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 2 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'b12',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '12' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 3 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'c12',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '13' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 1 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'a13',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '13' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 2 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'b13',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '13' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 3 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'c13',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '14' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 1 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'a14',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '14' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 2 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'b14',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '14' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 3 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'c14',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '15' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 1 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'a15',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '15' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 2 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'b15',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '15' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 3 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'c15',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '16' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 1 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'a16',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '16' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 2 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'b16',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '16' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 3 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'c16',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '17' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 2 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'b17',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '17' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 1 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'a17',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '17' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 3 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'c17',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '18' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 2 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'b18',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '18' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 1 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'a18',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '18' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 3 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'c18',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '19' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 2 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'a19',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '19' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 2 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'b19',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '19' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 3 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'c19',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '20' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 1 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'a20',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '20' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 2 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'b20',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '20' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 3 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'c20',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '21' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 1 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'a21',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '21' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 2 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'b21',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '21' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 3 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'c21',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '22' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 1 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'a22',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '22' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 2 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'b22',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '22' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 3 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'c22',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '23' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 1 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'a23',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '23' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 2 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'b23',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '23' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 3 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'c23',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '24' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 1 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'a24',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '24' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 2 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'b24',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '24' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 3 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'c24',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '25' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 1 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'a25',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '25' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 2 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'b25',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '25' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 3 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'c25',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '26' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 1 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'a26',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '26' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 2 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'b26',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '26' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 3 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'c26',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '27' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 1 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'a27',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '27' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 2 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'b27',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '27' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 3 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'c27',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '28' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 1 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'a28',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '28' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 2 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'b28',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '28' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 3 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'c28',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '29' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 1 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'a29',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '29' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 2 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'b29',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '29' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 3 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'c29',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '30' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 1 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'a30',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '30' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 2 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'b30',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '30' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 3 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'c30',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '31' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 1 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'a31',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '31' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 2 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'b31',
            CASE WHEN SUBSTRING(x.jamdelegasi, 1, 2) = '31' AND (CAST(SUBSTRING(x.jamdelegasi, 9, 2) AS INT) - @firstmonth + 1) = 3 THEN SUBSTRING(x.jamdelegasi, 4, 4) END AS 'c31'
            FROM (
            SELECT pr.namaproduk, rf.name as rute, frd.dosis,
            CASE WHEN frd.ispagi = 1 THEN 'P'
            WHEN frd.issiang = 1 THEN 'S'
            WHEN frd.issore = 1 THEN 'SR'
            WHEN frd.ismalam = 1 THEN 'M' ELSE '-' END AS waktuminum,
            CASE WHEN frd.perawatfk IS NOT NULL THEN SUBSTRING(CONVERT(VARCHAR,frd.tglperawatdelegasi,120), 9, 2)+'-'+SUBSTRING(pg1.namalengkap, 1, 1)+'-'+SUBSTRING(CONVERT(VARCHAR,frd.tglperawatdelegasi,120), 12, 2)+'-'+SUBSTRING(CONVERT(VARCHAR,frd.tglperawatdelegasi,120), 6, 2)
            WHEN frd.perawatsiangfk IS NOT NULL THEN SUBSTRING(CONVERT(VARCHAR,frd.tglperawatdelegasi,120), 9, 2)+'-'+SUBSTRING(pg2.namalengkap, 1, 1)+'-'+SUBSTRING(CONVERT(VARCHAR,frd.tglperawatdelegasi,120), 12, 2)+'-'+SUBSTRING(CONVERT(VARCHAR,frd.tglperawatdelegasi,120), 6, 2)
            WHEN frd.perawatsorefk IS NOT NULL THEN SUBSTRING(CONVERT(VARCHAR,frd.tglperawatdelegasi,120), 9, 2)+'-'+SUBSTRING(pg3.namalengkap, 1, 1)+'-'+SUBSTRING(CONVERT(VARCHAR,frd.tglperawatdelegasi,120), 12, 2)+'-'+SUBSTRING(CONVERT(VARCHAR,frd.tglperawatdelegasi,120), 6, 2)
            WHEN frd.perawatmalamfk IS NOT NULL THEN SUBSTRING(CONVERT(VARCHAR,frd.tglperawatdelegasi,120), 9, 2)+'-'+SUBSTRING(pg4.namalengkap, 1, 1)+'-'+SUBSTRING(CONVERT(VARCHAR,frd.tglperawatdelegasi,120), 12, 2)+'-'+SUBSTRING(CONVERT(VARCHAR,frd.tglperawatdelegasi,120), 6, 2)
            ELSE '-'
            END AS jamdelegasi
            FROM formulirobat_t AS fr
            INNER JOIN formulirobatdetail_t AS frd ON frd.formulirobatfk = fr.norec
            INNER JOIN pasiendaftar_t AS pd ON pd.norec = fr.norec_pd
            INNER JOIN produk_m AS pr ON pr.id = frd.produkfk
            LEFT JOIN routefarmasi as rf on rf.id=frd.routefk
            LEFT JOIN pegawai_m as pg on pg.id=frd.pegawaifarmasifk
            LEFT JOIN pegawai_m as pg1 on pg1.id=frd.perawatfk
            LEFT JOIN pegawai_m as pg2 on pg2.id=frd.perawatsiangfk
            LEFT JOIN pegawai_m as pg3 on pg3.id=frd.perawatsorefk
            LEFT JOIN pegawai_m as pg4 on pg4.id=frd.perawatmalamfk
            WHERE pd.noregistrasi = " . $request['noreg'] . " 
            AND fr.statusenabled = 1) AS x
            GROUP BY x.namaproduk, x.rute, x.dosis, x.waktuminum, x.jamdelegasi) AS y
            GROUP BY y.namaproduk, y.rute, y.dosis, y.waktuminum"));

        $results = array(
            'data' => $data,
            'message' => 'dy@epic',
        );

        return $this->respond($results);
    }

    public function getPasienTelemedicine(Request $request)
    {
        $data = PasienDaftar::where('noregistrasi', $request['noregistrasi'])->first();

        $result = array(
            'data' => $data,
            'message' => 'dy@epic'
        );
        return $this->respond($result);
    }

    public function tolakOrderKonsul(Request $request)
    {
        DB::beginTransaction();
        try {

            $dataSO = StrukOrder::where('norec', $request['norec_so'])->update([
                'keteranganlainnya' =>  $request['jawaban'],
                'istolak' => 1
            ]);



            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        if ($transStatus == 'true') {
            $transMessage = 'Sukses';
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,

                "as" => 'dy@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "as" => 'dy@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function SaveTransaksiEMRBackup(Request $request)
    {
        
        $dataReq = $request->all();

        $head = $dataReq['head'];
        $data = $dataReq['data'];

        //        foreach ($data as $itm){
        //            $dtdt[] = $itm;
        //        }
        //
        //        $keys = array_keys($data);

        DB::beginTransaction();
        // try {

            if ($head['norec_emr'] == '-') {

                $noemr = $this->generateCodeEMR(new EMRPasien, 'noemr', 15, 'MR' . date('ym') . '/');
                // return $noemr;
                if ($noemr == '') {
                    $transMessage = "Gagal mengumpukan data, Coba lagi.!";
                    DB::rollBack();
                    $result = array(
                        "status" => 400,
                        "message" => $transMessage,
                        "as" => 'as@epic',
                    );
                    return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                }
                //                $noemr = $this->generateCode(new EMRPasien, 'noemr', 12, 'MR' . $this->getDateTime()->format('ym') . '/');
                //                $noemr = $this->generateCode(new EMRPasien, 'noemr', 14, 'MR' . $this->getDateTime()->format('ym') . '/');

                $EMR = new EMRPasien();
                $norecHead = $EMR->generateNewId();
                $EMR->norec = $norecHead;
                $norecTehMenikitunyaeuy = $norecHead;
                $EMR->norec = $norecTehMenikitunyaeuy;
                $EMR->kdprofile = 17;
                $EMR->statusenabled = 1;

                if (isset($head['noregistrasi'])) {
                    $EMR->noregistrasifk = $head['noregistrasi'];
                }
                $EMRPASIENDETAIL = [];
            } else {
                $EMR = EMRPasien::where('noemr', $head['norec_emr'])
                    ->where('noregistrasifk', $head['noregistrasi'])
                    ->first();
                $noemr = $EMR->noemr;

                //LOAD DATA EMR PEMBANDING
                $EMRPASIENDETAIL = EMRPasienD::where('emrpasienfk', $noemr)
                    ->select('emrdfk', 'value')
                    ->where('emrfk', $head['emrfk'])
                    ->where('statusenabled', 1)
                    ->orderBy('emrdfk')
                    ->get();




                //                $EMRDelete = EMRPasienD::where('emrpasienfk', $noemr)
                //                ->where('emrfk', $head['emrfk'])
                //                ->delete();
            }

            //VALIDASI JIKA NOREGISTRASI BEDA //
            if (isset($head['noregistrasi'])) {
                if (trim($EMR->noregistrasifk) != $head['noregistrasi']) {
                    $transMessage = "Kesalahan loading data..!";
                    DB::rollBack();
                    $result = array(
                        "status" => 400,
                        "message" => $transMessage,
                        "as" => 'as@epic',
                    );
                    return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                }
            }


            $EMR->noemr = $noemr;
            $EMR->emrfk = $head['emrfk'];
            //            if (isset($head['norec_pd'])) {
            //                $EMR->noregistrasifk = $head['norec_pd'];
            //            }
            $EMR->nocm = $head['nocm'];
            $EMR->namapasien = $head['namapasien'];
            $EMR->jeniskelamin = $head['jeniskelamin'];

            $EMR->umur = $head['umur'];
            if (isset($head['kelompokpasien'])) {
                $EMR->kelompokpasien = $head['kelompokpasien'];
            }
            if (isset($head['tglregistrasi'])) {
                $EMR->tglregistrasi = $head['tglregistrasi'];
            } else {
                $EMR->tglregistrasi = $this->getDateTime()->format('Y-m-d H:i:s');
            }
            if (isset($head['norec'])) {
                $EMR->norec_apd = $head['norec'];
            }
            if (isset($head['namakelas'])) {
                $EMR->namakelas = $head['namakelas'];
            }
            if (isset($head['namaruangan'])) {
                $EMR->namaruangan = $head['namaruangan'];
            } else {
                $EMR->namaruangan = "Triage Gawat Darurat";
            }
            if (isset($head['tgllahir'])) {
                $EMR->tgllahir = $head['tgllahir'];
            }
            if (isset($head['notelepon'])) {
                $EMR->notelepon = $head['notelepon'];
            }
            if (isset($head['alamatlengkap'])) {
                $EMR->alamat = $head['alamatlengkap'];
            }
            if (isset($head['jenisemr'])) {
                $EMR->jenisemr = $head['jenisemr'];
            }
            $EMR->pegawaifk = $this->getCurrentUserID();
            $EMR->tglemr = $this->getDateTime()->format('Y-m-d H:i:s');
            $EMR->save();

            $norec_EMR = $EMR->noemr;

            //            $EMRDelete = EMRPasienD::where('emrpasienfk', $norec_EMR)
            //                ->where('emrfk', $head['emrfk'])
            //                ->update([
            //                    'statusenabled' => false
            //                ]);
            $i = 0;
            //            foreach ($keys as $ky) {
            //                $emrdfk = $ky;
            //                $valueemr = $dtdt[$i];
            $sama = 0;
            $j = 0;
            $h = 0;
            foreach ($data as $item) {
                $emrdfk = $item['id'];
                if (is_array($item['values'])) {
                    $valueemr = $item['values']['value'] . '~' . $item['values']['text'];
                } else {
                    $valueemr = $item['values'];
                }
                $sama = 0;
                foreach ($EMRPASIENDETAIL as $emrupdate) {
                    $sama = 0;
                    if ($emrupdate->emrdfk == $emrdfk) {
                        $sama =  1;
                        if ($emrupdate->value != $valueemr) {
                            $sama =  2;
                            break;
                        }
                        break;
                    }
                }

                if ($sama ==  2) {
                    $EMRPasienDUpdatekeun = EMRPasienD::where('emrpasienfk', $norec_EMR)
                        ->where('emrfk', $head['emrfk'])
                        ->where('emrdfk', $emrdfk)
                        ->where('statusenabled', 1)
                        ->update([
                            'value' => $valueemr
                        ]);
                    $j++;
                }
                $EMRD = [];
                if ($sama ==  0) {
                    $EMRD = new EMRPasienD();
                    $norecD = $EMRD->generateNewId();
                    $EMRD->norec = $norecD;
                    $EMRD->kdprofile = 1;
                    $EMRD->statusenabled = 1;
                    $EMRD->emrpasienfk = $norec_EMR;
                    $EMRD->value = $valueemr;
                    $EMRD->emrdfk = $emrdfk;
                    $EMRD->emrfk = $head['emrfk'];
                    $EMRD->pegawaifk = $this->getCurrentUserID();
                    $EMRD->tgl = $this->getDateTime()->format('Y-m-d H:i:s');
                    $EMRD->save();
                    $h++;
                }




                //                $EMRD_temp = new EMRPasienD_Temp();
                //                $norecDs = $EMRD_temp->generateNewId();
                //                $EMRD_temp->norec = $norecDs;
                //                $EMRD_temp->kdprofile = 1;
                //                $EMRD_temp->statusenabled = 1;
                //                $EMRD_temp->emrpasienfk = $norec_EMR;
                //                $EMRD_temp->value = $valueemr;
                //                $EMRD_temp->emrdfk = $emrdfk;
                //                $EMRD_temp->emrfk = $head['emrfk'];
                //                $EMRD_temp->pegawaifk = $this->getCurrentUserID();
                //                $EMRD_temp->tgl = $this->getDateTime()->format('Y-m-d H:i:s');
                //                $EMRD_temp->save();
                $i = $i + 1;
            }

            if (isset($dataReq['image']) && $dataReq['image'] != null) {
                //egi
                $img = $dataReq['image'];
                $datas = unpack("H*hex", $img);
                $datas = '0x' . $datas['hex'];
                #egi
                $dataGambar = \DB::table('emrfoto_t as tt')
                    ->where('tt.noemrpasienfk', '=', $norec_EMR)
                    ->where('tt.emrfk', '=', $head['emrfk'])
                    ->first();
                //                return $this->respond($noRec);
                if ($dataGambar == '' || $dataGambar == null) {
                    $emrFto = new EmrFoto();
                    $norecFto = $emrFto->generateNewId();
                    $emrFto->norec = $norecFto;
                    $emrFto->kdprofile = 12;
                    $emrFto->statusenabled = 1;
                    $emrFto->noemrpasienfk = $norec_EMR;
                    $emrFto->emrfk = $head['emrfk'];
                } else {
                    $emrFto = EmrFoto::where('noemrpasienfk', $norec_EMR)->first();
                }
                $emrFto->image = \DB::raw("CONVERT(VARBINARY(MAX), $datas)");
                $emrFto->save();
            }

            $transStatus = 'true';
        // } catch (\Exception $e) {
        //     $transStatus = 'false';
        // }
        $transMessage = 'Saving EMR Pasien ';

        if ($transStatus == 'true') {
            $transMessage = $transMessage . "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => $EMR,
                // "data2" => $EMRD,
                "jumlah" => count($EMRPASIENDETAIL),
                "update" => $j,
                "new" => $h,
                "as" => 'as@epic',
            );
            $this->saveEMRBackup($data, $head, $norec_EMR);
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "data" => $data,
                //                "keys" => $keys,
                //                "dtdt" => $dtdt,
                "as" => 'as@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveemrigd(Request $request)
    {

        DB::beginTransaction();
        // try {
            $EMR = temporariigd::where('norecapd', $request['norecapd'])
            ->delete();
                
            $EMR = new temporariigd();
            $norecHead = $EMR->generateNewId();
            $EMR->norec = $norecHead;
            $EMR->norecapd = $request['norecapd'];
            $EMR->keluhanutama = $request['keluhan'];
            $EMR->dahulu = $request['dahulu'];
            $EMR->sekarang = $request['sekarang'];
            $EMR->pemeriksaanfisik = $request['pemeriksaanfisik'];
            $EMR->save();
            $transStatus = 'true';
        // } catch (\Exception $e) {
        //     $transStatus = 'false';
        // }
        $transMessage = 'Saving EMR Pasien ';

        if ($transStatus == 'true') {
            $transMessage = $transMessage . "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => $EMR,
                // "data2" => $EMRD,
                // "jumlah" => count($EMRPASIENDETAIL),
                // "update" => $j,
                // "new" => $h,
                "as" => 'as@epic',
            );
            // $this->saveEMRBackup($data, $head, $norec_EMR);
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                // "data" => $data,
                //                "keys" => $keys,
                //                "dtdt" => $dtdt,
                "as" => 'as@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function gettempigd(Request $request)
    {
        $data = temporariigd::where('norecapd', $request['norecapd'])
        ->get();
        
        // $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'Inhuman',
        );
        return $this->respond($result);
    }

    public function saveEMRBackup($data, $head, $norec_EMR)
    {
        DB::beginTransaction();
        // try {
        foreach ($data as $item) {
            $emrdfk = $item['id'];
            if (is_array($item['values'])) {
                $valueemr = $item['values']['value'] . '~' . $item['values']['text'];
            } else {
                $valueemr = $item['values'];
            }
            $EMRD_temp = new EMRPasienD_Temp();
            $norecDs = $EMRD_temp->generateNewId();
            $EMRD_temp->norec = $norecDs;
            $EMRD_temp->kdprofile = 1;
            $EMRD_temp->statusenabled = 1;
            $EMRD_temp->emrpasienfk = $norec_EMR;
            $EMRD_temp->value = $valueemr;
            $EMRD_temp->emrdfk = $emrdfk;
            $EMRD_temp->emrfk = $head['emrfk'];
            $EMRD_temp->pegawaifk = $this->getCurrentUserID();
            $EMRD_temp->tgl = $this->getDateTime()->format('Y-m-d H:i:s');
            $EMRD_temp->save();
        }
        $transStatus = 'true';
        // } catch (\Exception $e) {
        //     $transStatus = 'false';
        // }
        $transMessage = 'Saving Backup EMR Pasien ';

        if ($transStatus == 'true') {
            $transMessage = $transMessage . "Sukses";
            DB::commit();
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
        }

        //return $this->setStatusCode($result['status'])->respond($transMessage);
    }



    public function savetatalaksana(Request $request)
    {

        DB::beginTransaction();
        try {

            if ($request['norec'] == '') {

                $newTL = new Tatalaksana();
                $norecTL = $newTL->generateNewId();
                $newTL->norec = $norecTL;

                $newTL->namaproduk = $request['namaproduk'];
                $newTL->jenis = $request['jenis'];
            } else {
                // return ('ada');
                // die();
                $newTL =  Tatalaksana::where('norec', $request['norec'])->first();
            }
            $newTL->noregistrasi = $request['noregistrasi'];
            $newTL->norecpp =  $request['norecpp'];
            $newTL->dosis = $request['dosis'];
            $newTL->carapemberian = $request['carapemberian'];
            $newTL->ttddokter = $request['ttddokter'];
            $newTL->waktupemberian = $request['waktupemberian'];
            $newTL->waktuintruksi = $request['waktuintruksi'];
            $newTL->ttdperawat = $request['ttdperawat'];
            $newTL->catatan = $request['catatan'];
            $newTL->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = 'Saving Tatalaksana ';

        if ($transStatus == 'true') {
            $transMessage = $transMessage . "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'as@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

     public function savemasalah(Request $request)
    {

        DB::beginTransaction();
        try {

            $newTL = new MasalahICU();
            $norecTL = $newTL->generateNewId();
            $newTL->norec = $norecTL;
            $newTL->norecemricufk = $request['norecemricufk'];
            $newTL->jam = $request['jam'];
            $newTL->masalah = $request['masalah'];
            $newTL->intruksi =  $request['intruksi'];
            $newTL->paraf =  $request['paraf'];
            $newTL->jenis =  $request['jenis'];
            $newTL->kelompok =  $request['kelompok'];
            $newTL->save();
            if( $request['jenis'] == 'm2'){
                if (isset($request['norechead']) && $request['norechead'] != "" && $request['norechead'] != "undefined") {         
                    //  return($request['norechead']);    
                    //  die();       
                        $newTL2 =  MasalahICUHead::where('norec', $request['norechead'])
                        ->first();
                }else{
                    $newTL2 = new MasalahICUHead();
                    $norecTL2 = $newTL->generateNewId();
                    $newTL2->norec = $norecTL2;
                }
                $newTL2->norecemr = $request['norecemricufk'];
                $newTL2->kelompok = $request['kelompok'];
                $newTL2->paraf =  $request['paraf'];
                $newTL2->save();
                    
            }
            
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = 'Saving Masalah ICU ';

        if ($transStatus == 'true') {
            $transMessage = $transMessage . "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'as@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function savesoap(Request $request)
    {

        DB::beginTransaction();
        try {
            if (isset($request['norec']) && $request['norec'] != "" && $request['norec'] != "undefined") {         
                    $newTL =  SoapEmr::where('norec', $request['norec'])
                    ->first();
            }else{
                $newTL = new SoapEmr();
                $norecTL = $newTL->generateNewId();
                $newTL->norec = $norecTL;
            }
            $newTL->norecemricufk = $request['norecemricufk'];
            $newTL->noemr = $request['noemr'];
            $newTL->S = $request['S'];
            $newTL->O =  $request['O'];
            $newTL->A =  $request['A'];
            $newTL->P =  $request['P'];
            $newTL->kelompok =  $request['kelompok'];
            $newTL->save();
            
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = 'Saving SOAP ICU ';

        if ($transStatus == 'true') {
            $transMessage = $transMessage . "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'as@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function deletetatalaksana(Request $request)
    {
        DB::beginTransaction();
        try {

            $x = Tatalaksana::where('norecpp', $request['norecpp'])
                ->delete();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = 'Delete Tatalaksana ';

        if ($transStatus == 'true') {
            $transMessage = $transMessage . "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'as@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function gettatalaksana(Request $request)
    {
        //todo : detail
        $data = \DB::table('tatalaksanaemr_t')
            ->where('jenis', $request['jenis'])
            ->where('noregistrasi', $request['noReg']);


        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'as@epic',
        );
        return $this->respond($result);
    }
     public function getmasalah(Request $request)
    {
        //todo : detail
        // return($norecemricufk);
        // die();
        $data = \DB::table('masalahicu_t')
            ->where('norecemricufk', $request['norecemricufk'])
            ->where('jenis','m1');
        
        $data= $data->get();
         $data1= \DB::table('masalahicu_t')
            ->where('norecemricufk', $request['norecemricufk'])
            ->where('kelompok','1')
            ->where('jenis','m2');
        $data1 = $data1->get();
        $data2 = \DB::table('masalahicu_t')
            ->where('norecemricufk', $request['norecemricufk'])
            ->where('kelompok','2')
            ->where('jenis','m2');
        $data2 = $data2->get();
        $data3 = \DB::table('masalahicu_t')
            ->where('norecemricufk', $request['norecemricufk'])
            ->where('kelompok','3')
            ->where('jenis','m2');
        $data3 = $data3->get();


        $datax = \DB::table('masalahicuhead_t')
            ->join('pegawai_m as p','p.namalengkap','=',"masalahicuhead_t.paraf")
            ->select('masalahicuhead_t.*','p.id')
            ->where('norecemr', $request['norecemricufk'])
            ->where('kelompok',"1");
        $datax = $datax->get();

         $datax2 = \DB::table('masalahicuhead_t')
            ->join('pegawai_m as p','p.namalengkap','=',"masalahicuhead_t.paraf")
            ->select('masalahicuhead_t.*','p.id')
            ->where('norecemr', $request['norecemricufk'])
            ->where('kelompok',"2");
        $datax2 = $datax2->get();

         $datax3 = \DB::table('masalahicuhead_t')
            ->join('pegawai_m as p','p.namalengkap','=',"masalahicuhead_t.paraf")
            ->select('masalahicuhead_t.*','p.id')
            ->where('norecemr', $request['norecemricufk'])
            ->where('kelompok',"1");
        $datax3 = $datax3->get();

        $result = array(
            'data' => $data,
            'data1' => $data1,
            'data2' => $data2,
            'data3' => $data3,
            'datax' => $datax,
            'datax2' => $datax2,
            'datax3' => $datax3,
            'message' => 'as@epic',
        );
        return $this->respond($result);
    }

         public function getsoapicu(Request $request)
    {
        //todo : detail
        // return($norecemricufk);
        // die();
        $data = \DB::table('soapemr_t')
            ->where('norecemricufk', $request['norecemricufk'])
            ->where('noemr', $request['noemr'])
            ->where('kelompok','1');
        
        $data= $data->get();
         $data1= \DB::table('soapemr_t')
            ->where('norecemricufk', $request['norecemricufk'])
            ->where('noemr', $request['noemr'])
            ->where('kelompok','1');
        $data1 = $data1->get();
        $data2 = \DB::table('soapemr_t')
            ->where('norecemricufk', $request['norecemricufk'])
            ->where('noemr', $request['noemr'])
            ->where('kelompok','2');
        $data2 = $data2->get();
        $data3 = \DB::table('soapemr_t')
            ->where('norecemricufk', $request['norecemricufk'])
            ->where('noemr', $request['noemr'])
            ->where('kelompok','3');
        $data3 = $data3->get();


     
        $result = array(
            'data' => $data,
            'data1' => $data1,
            'data2' => $data2,
            'data3' => $data3,
            'message' => 'as@epic',
        );
        return $this->respond($result);
    }
    
      public function getmasalahhead(Request $request)
    {
        $data = \DB::table('masalahicuhead_t')
            ->join('pegawai_m as p','p.namalengkap','=',"masalahicuhead_t.paraf")
            ->select('masalahicuhead_t.*','p.id')
            ->where('norecemr', $request['norecemricufk'])
            ->where('kelompok',$request['kelompok']);
            // ->first();
        $data = $data->get();
        // return(count($data));
        // die();
        $result = array(
            'data' => $data,
            'message' => 'as@epic',
        );
        return $this->respond($result);
    }

    public function getsoapkelompok(Request $request)
    {
        $data = \DB::table('soapemr_t')
            ->where('norecemricufk', $request['norecemricufk'])
            ->where('kelompok',$request['kelompok'])
            ->where('noemr',$request['noemr']);
            // ->first();
        $data = $data->get();
        // return(count($data));
        // die();
        $result = array(
            'data' => $data,
            'message' => 'as@epic',
        );
        return $this->respond($result);
    }
    public function getTempEmr(Request $request)
    {
        $data = \DB::table('tempemr_t as temp')
            // ->join('emrpasiend_t as emrpd', 'emrpd.emrpasienfk', '=', 'temp.emrpasienfk')
            ->select('temp.*')
            ->where('temp.emrpasienfk', $request['emrpasien'])
            ->get();

        return $this->respond($data);
    }

     public function getTempEmricu(Request $request)
    {
        $norecicufk=$request['norecicufk'];
        // return($norecicufk);
        // die();
        $EMRDelete = tempviewicu::where('norecemricu', $norecicufk)         
                           ->delete();
       $datamasukin =  DB::select(DB::raw("select    distinct    v_icu.[group], v_icu.[column],'' as a
                        , '' as b, '' as c, '' as d, '' as e, '' as f, '' as g, '' as h, '' as i, '' as j, '' as k, '' as l, '' as m, '' as n, '' as o, '' as p, '' as q, '' as r, '' as s, '' as t, '' as u, '' as v,  '' as w,  '' as x, 
                        '' as a2
                        , '' as b2, '' as c2, '' as d2, '' as e2, '' as f2, '' as g2, '' as h2, '' as i2, '' as j2, '' as k2, '' as l2, '' as m2, '' as n2, '' as o2, '' as p2, '' as q2, '' as r2, '' as s2, '' as t2, '' as u2, '' as v2,  '' as w2,  '' as x2, 
                        mappingcetakanicu.nourut
                        FROM            v_icu INNER JOIN
                        mappingcetakanicu ON v_icu.[column] = mappingcetakanicu.[column] AND v_icu.[group] = mappingcetakanicu.[group]
                        where v_icu.emricufk='$norecicufk'
                        order by nourut"));

          $datamentah =  DB::select(DB::raw("
                        SELECT        v_icu.[group], v_icu.[column], v_icu.a, v_icu.b, v_icu.c, v_icu.d, v_icu.e, v_icu.f, v_icu.g, v_icu.h, v_icu.i, v_icu.j, v_icu.k, v_icu.l, v_icu.m, v_icu.n, v_icu.o, v_icu.p, v_icu.q, v_icu.r, v_icu.s, v_icu.t, v_icu.u, v_icu.v,  v_icu.w,  v_icu.x, 
                        mappingcetakanicu.nourut
                        FROM            v_icu INNER JOIN
                        mappingcetakanicu ON v_icu.[column] = mappingcetakanicu.[column] AND v_icu.[group] = mappingcetakanicu.[group]
                        where  v_icu.emricufk='$norecicufk'
                        order by nourut"));


         $datamentah2 = DB::select(DB::raw("select v_icu.[group], v_icu.[column],
                            v_icu.a, 
                            v_icu.b, 
                            v_icu.c, v_icu.d, v_icu.e, v_icu.f, v_icu.g, v_icu.h, v_icu.i, v_icu.j, v_icu.k, v_icu.l, v_icu.m, v_icu.n, v_icu.o, v_icu.p, v_icu.q, v_icu.r, v_icu.s, v_icu.t, v_icu.u, v_icu.v, v_icu.w, 
                            v_icu.x,
                            v_icu.a2, 
                            v_icu.b2, 
                            v_icu.c2, v_icu.d2, v_icu.e2, v_icu.f2, v_icu.g2, v_icu.h2, v_icu.i2, v_icu.j2, v_icu.k2, v_icu.l2, v_icu.m2, v_icu.n2, v_icu.o2, v_icu.p2, v_icu.q2, v_icu.r2, v_icu.s2, v_icu.t2, v_icu.u2, v_icu.v2, v_icu.w2, 
                            v_icu.x2,mappingcetakanicu.nourut
                            FROM v_icuintake as  v_icu INNER JOIN
                            mappingcetakanicu ON v_icu.[column] = mappingcetakanicu.[column] AND v_icu.[group] = mappingcetakanicu.[group] where  v_icu.emricufk='$norecicufk'"));  

            foreach ($datamasukin as $item) {
                foreach ($datamentah as $item2) {
                    if($item->group == $item2->group && $item->column == $item2->column  ){
                        if($item2->a!== ''){
                            $item->a = $item2->a;
                        }
                        if($item2->b!== ''){
                            $item->b = $item2->b;
                        }
                        if($item2->c!== ''){
                            $item->c = $item2->c;
                        }
                        if($item2->d!== ''){
                            $item->d = $item2->d;
                        }
                        if($item2->e!== ''){
                            $item->e = $item2->e;
                        }
                        if($item2->f!== ''){
                            $item->f = $item2->f;
                        }
                        if($item2->g!== ''){
                            $item->g = $item2->g;
                        }
                        if($item2->h!== ''){
                            $item->h= $item2->h;
                        }
                        if($item2->i!== ''){
                            $item->i = $item2->i;
                        }
                        if($item2->j!== ''){
                            $item->j = $item2->j;
                        }
                        if($item2->k!== ''){
                            $item->k = $item2->k;
                        }
                        if($item2->l!== ''){
                            $item->l = $item2->l;
                        }
                        if($item2->m!== ''){
                            $item->m = $item2->m;
                        }
                        if($item2->n!== ''){
                            $item->n = $item2->n;
                        }
                        if($item2->o!== ''){
                            $item->o = $item2->o;
                        }
                        if($item2->p!== ''){
                            $item->p = $item2->p;
                        }
                        if($item2->q!== ''){
                            $item->q = $item2->q;
                        }
                        if($item2->r!== ''){
                            $item->r = $item2->r;
                        }
                        if($item2->s!== ''){
                            $item->s = $item2->s;
                        }
                        if($item2->t!== ''){
                            $item->t = $item2->t;
                        }
                        if($item2->u!== ''){
                            $item->u = $item2->u;
                        }
                        if($item2->v!== ''){
                            $item->v = $item2->v;
                        }
                        if($item2->w!== ''){
                            $item->w = $item2->w;
                        }
                        if($item2->x!== ''){
                            $item->x = $item2->x;
                        }

                    }

                }
                foreach ($datamentah2 as $item3) {
                    if($item->group == $item3->group && $item->column == $item3->column  ){
                        if($item3->a!== ''){
                            $item->a = $item3->a;
                        }
                        if($item3->b!== ''){
                            $item->b = $item3->b;
                        }
                        if($item3->c!== ''){
                            $item->c = $item3->c;
                        }
                        if($item3->d!== ''){
                            $item->d = $item3->d;
                        }
                        if($item3->e!== ''){
                            $item->e = $item3->e;
                        }
                        if($item3->f!== ''){
                            $item->f = $item3->f;
                        }
                        if($item3->g!== ''){
                            $item->g = $item3->g;
                        }
                        if($item3->h!== ''){
                            $item->h= $item3->h;
                        }
                        if($item3->i!== ''){
                          
                            $item->i = $item3->i;
                        }
                        if($item3->j!== ''){
                            $item->j = $item3->j;
                        }
                        if($item3->k!== ''){
                            $item->k = $item3->k;
                        }
                        if($item3->l!== ''){
                            $item->l = $item3->l;
                        }
                        if($item3->m!== ''){
                            $item->m = $item3->m;
                        }
                        if($item3->n!== ''){
                            $item->n = $item3->n;
                        }
                        if($item3->o!== ''){
                            $item->o = $item3->o;
                        }
                        if($item3->p!== ''){
                            $item->p = $item3->p;
                        }
                        if($item3->q!== ''){
                            $item->q = $item3->q;
                        }
                        if($item3->r!== ''){
                            $item->r = $item3->r;
                        }
                        if($item3->s!== ''){
                            $item->s = $item3->s;
                        }
                        if($item3->t!== ''){
                            $item->t = $item3->t;
                        }
                        if($item3->u!== ''){
                            $item->u = $item3->u;
                        }
                        if($item3->v!== ''){
                            $item->v = $item3->v;
                        }
                        if($item3->w!== ''){
                            $item->w = $item3->w;
                        }
                        if($item3->x!== ''){
                            $item->x = $item3->x;
                        }

                        if($item3->a2!== ''){
                            $item->a2 = $item3->a2;
                        }
                        if($item3->b2!== ''){
                            $item->b2 = $item3->b2;
                        }
                        if($item3->c2!== ''){
                            $item->c2 = $item3->c2;
                        }
                        if($item3->d2!== ''){
                            $item->d2 = $item3->d2;
                        }
                        if($item3->e2!== ''){
                            $item->e2 = $item3->e2;
                        }
                        if($item3->f2!== ''){
                            $item->f2 = $item3->f2;
                        }
                        if($item3->g2!== ''){
                            $item->g2 = $item3->g2;
                        }
                        if($item3->h2!== ''){
                            $item->h2= $item3->h2;
                        }
                        if($item3->i2!== ''){
                            $item->i2 = $item3->i2;
                        }
                        if($item3->j2!== ''){
                            $item->j2 = $item3->j2;
                        }
                        if($item3->k2!== ''){
                            $item->k2 = $item3->k2;
                        }
                        if($item3->l2!== ''){
                            $item->l2 = $item3->l2;
                        }
                        if($item3->m2!== ''){
                            $item->m2 = $item3->m2;
                        }
                        if($item3->n2!== ''){
                            $item->n2 = $item3->n2;
                        }
                        if($item3->o2!== ''){
                            $item->o2 = $item3->o2;
                        }
                        if($item3->p2!== ''){
                            $item->p2 = $item3->p2;
                        }
                        if($item3->q2!== ''){
                            $item->q2 = $item3->q2;
                        }
                        if($item3->r2!== ''){
                            $item->r2 = $item3->r2;
                        }
                        if($item3->s2!== ''){
                            $item->s2 = $item3->s2;
                        }
                        if($item3->t2!== ''){
                            $item->t2 = $item3->t2;
                        }
                        if($item3->u2!== ''){
                            $item->u2 = $item3->u2;
                        }
                        if($item3->v2!== ''){
                            $item->v2 = $item3->v2;
                        }
                        if($item3->w2!== ''){
                            $item->w2 = $item3->w2;
                        }
                        if($item3->x2!== ''){
                            $item->x2 = $item3->x2;
                        }

                    }

                }
            }   
            // return($datamasukin);
            // die();
        foreach ($datamasukin as $item) {
            $EMRD = new tempviewicu();
            $norecD = $EMRD->generateNewId();
            $EMRD->norec = $norecD;
            $EMRD->group = $item->group;
            $EMRD->column = $item->column;
            $EMRD->a = $item->a;
            $EMRD->b = $item->b;
            $EMRD->c =  $item->c;
            $EMRD->d =  $item->d;
            $EMRD->e =  $item->e;
            $EMRD->f =  $item->f;
            $EMRD->g =  $item->g;
            $EMRD->h =  $item->h;
            $EMRD->i =  $item->i;
            $EMRD->j =  $item->j;
            $EMRD->k =  $item->k;
            $EMRD->l =  $item->l;
            $EMRD->m =  $item->m;
            $EMRD->n =  $item->n;
            $EMRD->o =  $item->o;
            $EMRD->p =  $item->p;
            $EMRD->q =  $item->q;
            $EMRD->r =  $item->r;
            $EMRD->s =  $item->s;
            $EMRD->t =  $item->t;
            $EMRD->u =  $item->u;
            $EMRD->v =  $item->v;
            $EMRD->w =  $item->w;
            $EMRD->x =  $item->x;

            $EMRD->a2 = $item->a2;
            $EMRD->b2 = $item->b2;
            $EMRD->c2 =  $item->c2;
            $EMRD->d2 =  $item->d2;
            $EMRD->e2 =  $item->e2;
            $EMRD->f2 =  $item->f2;
            $EMRD->g2 =  $item->g2;
            $EMRD->h2 =  $item->h2;
            $EMRD->i2 =  $item->i2;
            $EMRD->j2 =  $item->j2;
            $EMRD->k2 =  $item->k2;
            $EMRD->l2 =  $item->l2;
            $EMRD->m2 =  $item->m2;
            $EMRD->n2 =  $item->n2;
            $EMRD->o2 =  $item->o2;
            $EMRD->p2 =  $item->p2;
            $EMRD->q2 =  $item->q2;
            $EMRD->r2 =  $item->r2;
            $EMRD->s2 =  $item->s2;
            $EMRD->t2 =  $item->t2;
            $EMRD->u2 =  $item->u2;
            $EMRD->v2 =  $item->v2;
            $EMRD->w2 =  $item->w2;
            $EMRD->x2 =  $item->x2;
            $EMRD->nourut =  $item->nourut;
            $EMRD->norecemricu = $norecicufk;
            $EMRD->save();
        }  
       

        $result = array(
            'data' => $datamasukin,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getHistoryRencana(Request $request)
    {
        $data2 = [];
        $data = \DB::table('rencanaaskep_t as te')
            ->join('emrpasien_t as et', 'et.noemr', '=', 'te.emrpasienfk')
            ->orderBy('te.emrpasienfk', 'desc')
            ->select('te.*');

        if (isset($request['noregistrasifk']) && $request['noregistrasifk'] != "" && $request['noregistrasifk'] != "undefined") {
            $data = $data->where('et.noregistrasifk', '=', $request['noregistrasifk']);
        }else{
            $data = $data->where('te.emrpasienfk', '=', '1');
        }
        $data = $data->get();

        // $handover = '';
        // $hasilpemeriksaan = '';
        // $instruksi = '';
        // foreach ($data as $item) {
        //     if ($item->menyerahkan != '') {
        //         $handover = "Profesi : " . $item->profesi . "," . " Yang Menyerahkan : " . $item->menyerahkan . ", Yang Menerima : " . $item->menerima . " Pasien/Keluarga : " . $item->pasienkeluarga;
        //     } else {
        //         $handover = "Profesi : " . $item->profesi;
        //     }
        //     if ($item->ttd != '') {
        //         $hasilpemeriksaan = $item->hasilpemeriksaan . ", Penulis CPPT : " . $item->ttd;
        //     } else {
        //         $hasilpemeriksaan = $item->hasilpemeriksaan;
        //     }
        //     if ($item->penerimainstruksi != '') {
        //         $instruksi = $item->instruksitenaga . ", Tgl Lapor : " . $item->tgllapor . ", Penerima Instruksi : " . $item->penerimainstruksi . ", Tgl Jawab : " . $item->tgljawab . ", Pemberi Instruksi : " . $item->pemberiinstruksi;
        //     } else {
        //         $instruksi = $item->instruksitenaga;
        //     }
        //     $data2[] = array(
        //         'norec' => $item->norec,
        //         'tgljam' => $item->tgljam,
        //         'handover' => $handover,
        //         'hasilpemeriksaan' => $hasilpemeriksaan,
        //         'instruksi' => $instruksi,
        //         'subjective' => $item->subjective,
        //         'objective' => $item->objective,
        //         'assesment' => $item->assesment,
        //         'plann' => $item->plann,
        //         'dpjp' => $item->pegawai,
        //         'verifikasi' => $item->verifikasi
        //     );
        // }



        return $this->respond($data);
    }
    public function getHistoryCPPT(Request $request)
    {
        $data2 = [];
        $data = \DB::table('tempemr_t as te')
            ->orderBy('te.emrpasienfk', 'desc')
            ->select('te.*');

        if (isset($request['emrpasien']) && $request['emrpasien'] != "" && $request['emrpasien'] != "undefined") {
            $data = $data->where('te.emrpasienfk', '=', $request['emrpasien']);
        }
        $data = $data->get();

        $handover = '';
        $hasilpemeriksaan = '';
        $instruksi = '';
        foreach ($data as $item) {
            if ($item->menyerahkan != '') {
                $handover = "Profesi : " . $item->profesi . "," . " Yang Menyerahkan : " . $item->menyerahkan . ", Yang Menerima : " . $item->menerima . " Pasien/Keluarga : " . $item->pasienkeluarga;
            } else {
                $handover = "Profesi : " . $item->profesi;
            }
            if ($item->ttd != '') {
                $hasilpemeriksaan = $item->hasilpemeriksaan . ", Penulis CPPT : " . $item->ttd;
            } else {
                $hasilpemeriksaan = $item->hasilpemeriksaan;
            }
            if ($item->penerimainstruksi != '') {
                $instruksi = $item->instruksitenaga . ", Tgl Lapor : " . $item->tgllapor . ", Penerima Instruksi : " . $item->penerimainstruksi . ", Tgl Jawab : " . $item->tgljawab . ", Pemberi Instruksi : " . $item->pemberiinstruksi;
            } else {
                $instruksi = $item->instruksitenaga;
            }
            $data2[] = array(
                'norec' => $item->norec,
                'tgljam' => $item->tgljam,
                'handover' => $handover,
                'hasilpemeriksaan' => $hasilpemeriksaan,
                'instruksi' => $instruksi,
                'subjective' => $item->subjective,
                'objective' => $item->objective,
                'assesment' => $item->assesment,
                'plann' => $item->plann,
                'dpjp' => $item->pegawai,
                'verifikasi' => $item->verifikasi
            );
        }



        return $this->respond($data);
    }
    public function getHistoryCPT(Request $request)
    {
        $data = \DB::table('tempemr_t as te')
            ->orderBy('te.tgljam', 'desc')
            ->select('te.*');

        if (isset($request['emrpasien']) && $request['emrpasien'] != "" && $request['emrpasien'] != "undefined") {
            $data = $data->where('te.emrpasienfk', '=', $request['emrpasien']);
        }
        $data = $data->get();

        return $this->respond($data);
    }
    public function getCPPTEdit(Request $request)
    {
        $data = \DB::table('tempemr_t as te')
            ->select('te.*')
            ->where('te.norec', $request['norec'])
            ->get();

        return $this->respond($data);
    }
    public function getrenacanaedit(Request $request)
    {
        $data = \DB::table('rencanaaskep_t as te')
            ->select('te.*')
            ->where('te.norec', $request['norec'])
            ->get();

        return $this->respond($data);
    }
    public function getCPTEdit(Request $request)
    {
        $data = \DB::table('tempemr_t as te')
            ->select('te.*')
            ->where('te.norec', $request['norec'])
            ->get();

        return $this->respond($data);
    }
    public function EditCatatanDokter(Request $request)
    {

        $dataReq = $request->all();
        $temp = $dataReq['temp'];

        // return ($temp[0]['tgl']);
        // die();

        DB::beginTransaction();

        $emr = TempEMR::where('norec', $temp[0]['norec'])
            ->update([
                'tgljam' => $temp[0]['tgl'],
                'profesi' => $temp[0]['jp'],
                'hasilpemeriksaan' => $temp[0]['hp'],
                'instruksitenaga' => $temp[0]['it'],
                'pegawai' => $temp[0]['dk'],
                'menyerahkan' => $temp[0]['menyerahkan'],
                'menerima' => $temp[0]['menerima'],
                'pasienkeluarga' => $temp[0]['pk'],
                'ttd' => $temp[0]['ttd'],
                'tgllapor' => $temp[0]['tgllapor'],
                'penerimainstruksi' => $temp[0]['pi'],
                'tgljawab' => $temp[0]['tgljawab'],
                'pemberiinstruksi' => $temp[0]['instruksi'],
                'subjective' => $temp[0]['s'],
                'objective' => $temp[0]['o'],
                'assesment' => $temp[0]['a'],
                'plann' => $temp[0]['p'],
            ]);
        $transStatus = 'true';
        $transMessage = "SUKSES !";
        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                'data' => $emr,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
        public function EditRencanaAskep(Request $request)
    {

        $dataReq = $request->all();
        $temp = $dataReq['temp'];

        // return ($temp[0]['tgl']);
        // die();

        DB::beginTransaction();

        $emr = RencanaAskep::where('norec', $temp[0]['norec'])
            ->update([
                'diagnosa' => $temp[0]['diagnosa'],
                'tglditegakan' => $temp[0]['tglditegakan'],
                'idperawatditegakan' => $temp[0]['idperawatditegakan'],
                'namaperawat' => $temp[0]['namaperawat'],
                'luaran' => $temp[0]['luaran'],
                'intervensi' => $temp[0]['intervensi'],
                'tglteratasi' => $temp[0]['tglteratasi'],
                'idperawatteratasi' => $temp[0]['idperawatteratasi'],
                'namaperawatteratasi' => $temp[0]['namaperawatteratasi'],
                
            ]);
        $transStatus = 'true';
        $transMessage = "SUKSES !";
        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                'data' => $emr,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function EditCatatanKeperawatan(Request $request)
    {

        $dataReq = $request->all();
        $temp = $dataReq['temp'];

        // return ($temp[0]['tgl']);
        // die();

        DB::beginTransaction();

        $emr = TempEMR::where('norec', $temp[0]['norec'])
            ->update([
                'tgljam' => $temp[0]['tgl'],
                'diagnosa' => $temp[0]['dg'],
                'hasilkeperawatan' => $temp[0]['tkh'],
                'pegawai' => $temp[0]['pg'],
            ]);
        $transStatus = 'true';
        $transMessage = "SUKSES !";
        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                'data' => $emr,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function cekStatusVerif(Request $request)
    {
        $data = \DB::table('tempemr_t as te')
            ->select('te.verifikasi');

        if (isset($request['emrpasien']) && $request['emrpasien'] != "" && $request['emrpasien'] != "undefined") {
            $data = $data->where('te.emrpasienfk', '=', $request['emrpasien']);
        }
        $data = $data->get();

        return $this->respond($data);
    }
     public function getHasillab(Request $request)
    {
    
        $norecapd = $request['norecapd'];
        $umur = $request['umur'];
        $jeniskelamin = $request['jeniskelamin'];
        $data = DB::select(
            DB::raw("select DISTINCT
	*
FROM
	(
		SELECT
			pp.tglpelayanan,
			maps.nourutjenispemeriksaan,
			maps.nourutdetail,
			rj.namaruangan AS ruanganperejuk,
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
			ss.satuanstandar,
			nn.nilaitext,
			nn.nilaimin,
			nn.nilaimax,
			case when hh.hasil is null then '-' else hh.hasil end as hasil,
			jk.jeniskelamin,
			apd.tglmasuk AS tglverif,
			hh.tglhasil AS tglakhir,
			hh. FLAG,
			hh.hasil_s,
			hh.hasil_i,
			hh.catatan
		FROM
			pelayananpasien_t AS pp
		INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.norec = pp.noregistrasifk
		INNER JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk
		LEFT OUTER JOIN strukorder_t AS so ON so.norec = apd.objectstrukorderfk
		LEFT OUTER JOIN ruangan_m AS rj ON pd.objectruanganlastfk = rj. ID
		INNER JOIN pasien_m AS pm ON pm. ID = pd.nocmfk
		LEFT OUTER JOIN jeniskelamin_m AS jk ON jk. ID = pm.objectjeniskelaminfk
		LEFT OUTER JOIN alamat_m AS alm ON alm.nocmfk = pm. ID
		LEFT OUTER JOIN kelompokpasien_m AS kp ON kp. ID = pd.objectkelompokpasienlastfk
		LEFT OUTER JOIN rekanan_m AS rkn ON rkn. ID = pd.objectrekananfk
		LEFT OUTER JOIN pegawai_m AS pg ON pg. ID = so.objectpegawaiorderfk
		LEFT OUTER JOIN pegawai_m AS pg1 ON pg1. ID = apd.objectpegawaifk
		LEFT OUTER JOIN produk_m AS prd ON prd. ID = pp.produkfk
		LEFT OUTER JOIN pelayananpasienpetugas_t AS p3 ON pp.norec = p3.pelayananpasien
		INNER JOIN pegawai_m AS pg2 ON pg2. ID = p3.objectpegawaifk
		INNER JOIN detailjenisproduk_m AS djp ON djp. ID = prd.objectdetailjenisprodukfk
		INNER JOIN maphasillab_m AS maps ON maps.produkfk = prd. ID
		INNER JOIN maphasillabdetail_m AS maps2 ON maps2.maphasilfk = maps. ID
		AND maps2.jeniskelaminfk =  $jeniskelamin
		AND maps2.kelompokumurfk IN (
			SELECT
				ID
			FROM
				kelompokumur_m AS kuu
			WHERE
				(
					$umur BETWEEN umurmin
					AND umurmax
				)
		)
		LEFT OUTER JOIN pegawai_m AS pg3 ON pg3. ID = p3.objectpegawaifk
		AND p3.objectpegawaifk = '4'
		INNER JOIN nilainormal_m AS nn ON nn. ID = maps2.nilainormalfk
		LEFT OUTER JOIN satuanstandar_m AS ss ON ss. ID = maps.satuanstandarfk
		LEFT OUTER JOIN hasillaboratorium_t AS hh ON hh.norecpelayanan = pp.norec
		AND pp.noregistrasifk = hh.noregistrasifk
		AND maps.detailpemeriksaan = hh.detailpemeriksaan
		AND maps. ID = hh.maphasilfk
        $norecapd) as data
        order by
        data.nourutjenispemeriksaan asc")
        );
        return $this->respond($data);
 
    }
    public function saveVerifikasiDokterCppt(Request $request)
    {
        DB::beginTransaction();
        $transStatus = 'true';
        try {
            $verifikasi = TempEMR::where('emrpasienfk', $request['norecemr'])
                ->update([
                    'verifikasi' => 1
                ]);
            $transMessage = "Verifikasi CPPT Berhasil !";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = 'Verifikasi CPPT Gagal !';
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
    public function saveUnverifikasiDokterCppt(Request $request)
    {
        DB::beginTransaction();
        $transStatus = 'true';
        try {
            $verifikasi = TempEMR::where('emrpasienfk', $request['norecemr'])
                ->update([
                    'verifikasi' => NULL
                ]);
            $transMessage = "Unverifikasi CPPT Berhasil !";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = 'Unverifikasi CPPT Gagal !';
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
    public function SaveCatatanDokter(Request $request)
    {

        $dataReq = $request->all();

        $head = $dataReq['head'];
        $data = $dataReq['data'];
        $temp = $dataReq['temp'];



        //        foreach ($data as $itm){
        //            $dtdt[] = $itm;
        //        }
        //
        //        $keys = array_keys($data);

        DB::beginTransaction();
        // try {

        if ($head['norec_emr'] == '-') {

            $noemr = $this->generateCodeEMR(new EMRPasien, 'noemr', 15, 'MR' . date('ym') . '/');
            // return $noemr;
            if ($noemr == '') {
                $transMessage = "Gagal mengumpukan data, Coba lagi.!";
                DB::rollBack();
                $result = array(
                    "status" => 400,
                    "message" => $transMessage,
                    "as" => 'as@epic',
                );
                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }
            //                $noemr = $this->generateCode(new EMRPasien, 'noemr', 12, 'MR' . $this->getDateTime()->format('ym') . '/');
            //                $noemr = $this->generateCode(new EMRPasien, 'noemr', 14, 'MR' . $this->getDateTime()->format('ym') . '/');

            $EMR = new EMRPasien();
            $norecHead = $EMR->generateNewId();
            $EMR->norec = $norecHead;
            $norecTehMenikitunyaeuy = $norecHead;
            $EMR->norec = $norecTehMenikitunyaeuy;
            $EMR->kdprofile = 17;
            $EMR->statusenabled = 1;

            if (isset($head['noregistrasi'])) {
                $EMR->noregistrasifk = $head['noregistrasi'];
            }
            $EMRPASIENDETAIL = [];
        } else {
            $EMR = EMRPasien::where('noemr', $head['norec_emr'])
                ->where('noregistrasifk', $head['noregistrasi'])
                ->first();
            $noemr = $EMR->noemr;

            //DELETE DATA YANG ADA BIAR GAK DOUBLE DOUBLE
            // $EMRPASIENDETAIL = EMRPasienD::where('emrpasienfk', $noemr)
            //     ->select('emrdfk', 'value', 'tgl')
            //     ->where('emrfk', $head['emrfk'])
            //     // ->where('statusenabled', 1)
            //     // ->orderBy('emrdfk')
            //     ->delete();





            //                $EMRDelete = EMRPasienD::where('emrpasienfk', $noemr)
            //                ->where('emrfk', $head['emrfk'])
            //                ->delete();
        }

        //VALIDASI JIKA NOREGISTRASI BEDA //
        if (isset($head['noregistrasi'])) {
            if (trim($EMR->noregistrasifk) != $head['noregistrasi']) {
                $transMessage = "Kesalahan loading data..!";
                DB::rollBack();
                $result = array(
                    "status" => 400,
                    "message" => $transMessage,
                    "as" => 'as@epic',
                );
                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }
        }


        $EMR->noemr = $noemr;
        $EMR->emrfk = $head['emrfk'];
        //            if (isset($head['norec_pd'])) {
        //                $EMR->noregistrasifk = $head['norec_pd'];
        //            }
        $EMR->nocm = $head['nocm'];
        $EMR->namapasien = $head['namapasien'];
        $EMR->jeniskelamin = $head['jeniskelamin'];

        $EMR->umur = $head['umur'];
        if (isset($head['kelompokpasien'])) {
            $EMR->kelompokpasien = $head['kelompokpasien'];
        }
        if (isset($head['tglregistrasi'])) {
            $EMR->tglregistrasi = $head['tglregistrasi'];
        } else {
            $EMR->tglregistrasi = $this->getDateTime()->format('Y-m-d H:i:s');
        }
        if (isset($head['norec'])) {
            $EMR->norec_apd = $head['norec'];
        }
        if (isset($head['namakelas'])) {
            $EMR->namakelas = $head['namakelas'];
        }
        if (isset($head['namaruangan'])) {
            $EMR->namaruangan = $head['namaruangan'];
        } else {
            $EMR->namaruangan = "Triage Gawat Darurat";
        }
        if (isset($head['tgllahir'])) {
            $EMR->tgllahir = $head['tgllahir'];
        }
        if (isset($head['notelepon'])) {
            $EMR->notelepon = $head['notelepon'];
        }
        if (isset($head['alamatlengkap'])) {
            $EMR->alamat = $head['alamatlengkap'];
        }
        if (isset($head['jenisemr'])) {
            $EMR->jenisemr = $head['jenisemr'];
        }
        $EMR->pegawaifk = $this->getCurrentUserID();
        $EMR->tglemr = $this->getDateTime()->format('Y-m-d H:i:s');
        $EMR->save();

        $norec_EMR = $EMR->noemr;

        //            $EMRDelete = EMRPasienD::where('emrpasienfk', $norec_EMR)
        //                ->where('emrfk', $head['emrfk'])
        //                ->update([
        //                    'statusenabled' => false
        //                ]);
        $i = 0;
        //            foreach ($keys as $ky) {
        //                $emrdfk = $ky;
        //                $valueemr = $dtdt[$i];
        $sama = 0;
        $j = 0;
        $h = 0;
        foreach ($data as $item) {
            $emrdfk = $item['id'];
            if (is_array($item['values'])) {
                $valueemr = $item['values']['value'] . '~' . $item['values']['text'];
            } else {
                $valueemr = $item['values'];
            }
            $sama = 0;
            // foreach ($EMRPASIENDETAIL as $emrupdate){
            //     // return ($emrupdate);
            //     // die();
            //     $sama = 0;
            //     if ($emrupdate->tgl == $tgl ){
            //         $sama =  1;
            //         if ($emrupdate->value != $valueemr || $emrupdate->value == $valueemr){
            //             $sama =  0;
            //             break;
            //         }
            //         break;
            //     }
            // }

            // if  ($sama ==  0){
            //     $EMRPasienDUpdatekeun = EMRPasienD::where('emrpasienfk', $norec_EMR)
            //         ->where('emrfk', $head['emrfk'])
            //         ->where('emrdfk', $emrdfk)
            //         ->where('statusenabled', 1)
            //         // ->update([
            //         //     'kodeexternal' => 1,
            //         //     // 'value' => $valueemr
            //         // ]);
            //         // $j++;
            //         ->delete();
            //         // $sama = 0;
            //         // $EMRD =[];
            //         // $EMRD = new EMRPasienD();
            //         // $norecD = $EMRD->generateNewId();
            //         // $EMRD->norec = $norecD;
            //         // $EMRD->kdprofile = 1;
            //         // $EMRD->statusenabled = 1;
            //         // $EMRD->emrpasienfk = $norec_EMR;
            //         // $EMRD->value = $valueemr;
            //         // $EMRD->emrdfk = $emrdfk;
            //         // $EMRD->emrfk = $head['emrfk'];
            //         // $EMRD->pegawaifk = $this->getCurrentUserID();
            //         // $EMRD->tgl = $this->getDateTime()->format('Y-m-d H:i:s');
            //         // $EMRD->save();
            //         // $h++;
            // }
            $EMRD = [];
            if ($sama ==  0) {
                $EMRD = new EMRPasienD();
                $norecD = $EMRD->generateNewId();
                $EMRD->norec = $norecD;
                $EMRD->kdprofile = 1;
                $EMRD->statusenabled = 1;
                $EMRD->emrpasienfk = $norec_EMR;
                $EMRD->value = $valueemr;
                $EMRD->emrdfk = $emrdfk;
                $EMRD->emrfk = $head['emrfk'];
                $EMRD->pegawaifk = $this->getCurrentUserID();
                $EMRD->tgl = $this->getDateTime()->format('Y-m-d H:i:s');
                $EMRD->save();
                $h++;
            }




            //                $EMRD_temp = new EMRPasienD_Temp();
            //                $norecDs = $EMRD_temp->generateNewId();
            //                $EMRD_temp->norec = $norecDs;
            //                $EMRD_temp->kdprofile = 1;
            //                $EMRD_temp->statusenabled = 1;
            //                $EMRD_temp->emrpasienfk = $norec_EMR;
            //                $EMRD_temp->value = $valueemr;
            //                $EMRD_temp->emrdfk = $emrdfk;
            //                $EMRD_temp->emrfk = $head['emrfk'];
            //                $EMRD_temp->pegawaifk = $this->getCurrentUserID();
            //                $EMRD_temp->tgl = $this->getDateTime()->format('Y-m-d H:i:s');
            //                $EMRD_temp->save();
            $i = $i + 1;
        }
        // return ($temp);
        // die();
        // $EMR->namapasien = $head['namapasien'];

        //     foreach ($temp as $item) {
        //         if($item['norec'] == "") {
        // $temp2 = new TempEMR();
        // $temp2->norec = $temp2->generateNewId();
        // $temp2->emrpasienfk = $norec_EMR;
        // // } else {
        // //     $temp2 = TempEMR::whereIn('norec',$item['norec']);
        // // }
        // $temp2->tgljam = $item['tgl'];
        // $temp2->diagnosa = $item['dg'];
        // $temp2->hasilkeperawatan = $item['tkh'];
        // $temp2->pegawai = $item['pg'];
        // $temp2->emrfk = 516;
        // $temp2->save();
        //         // $transStatus = 'true';
        //     }

        // }

        //DELETE DATA YANG ADA BIAR GAK DOUBLE DOUBLE
        // $TempEMR = TempEMR::where('emrpasienfk', $noemr)
        //     ->select('*')
        //     ->where('emrpasienfk', $noemr)
        //     // ->where('statusenabled', 1)
        //     // ->orderBy('emrdfk')
        //     ->delete();
        $a = 0;
        //            foreach ($keys as $ky) {
        //                $emrdfk = $ky;
        //                $valueemr = $dtdt[$i];
        $sama2 = 0;
        // $b = 0;
        $c = 0;
        foreach ($temp as $item) {
            // return ($item);
            // die();
            // $emrpasienfk = $item['emrpasienfk'];
            if (is_array($item['tgl'])) {
                $tgljam = $item['tgl']['tgl'] . '~' . $item['tgl']['text'];
            } else {
                $tgljam = $item['tgl'];
            }
            $sama2 = 0;

            $temp2 = [];
            if ($sama2 ==  0) {
                $temp2 = new TempEMR();
                $temp2->norec = $temp2->generateNewId();
                $temp2->emrpasienfk = $norec_EMR;
                // } else {
                //     $temp2 = TempEMR::whereIn('norec',$item['norec']);
                // }
                $temp2->tgljam = $item['tgl'];
                $temp2->profesi = $item['jp'];
                $temp2->hasilpemeriksaan = $item['hp'];
                $temp2->instruksitenaga = $item['it'];
                $temp2->pegawai = $item['dk'];
                $temp2->emrfk = 518;
                $temp2->menyerahkan = $item['menyerahkan'];
                $temp2->menerima = $item['menerima'];
                $temp2->pasienkeluarga = $item['pk'];
                $temp2->ttd = $item['ttd'];
                $temp2->tgllapor = $item['tgllapor'];
                $temp2->penerimainstruksi = $item['pi'];
                $temp2->tgljawab = $item['tgljawab'];
                $temp2->pemberiinstruksi = $item['instruksi'];
                $temp2->subjective = $item['s'];
                $temp2->objective = $item['o'];
                $temp2->assesment = $item['a'];
                $temp2->plann = $item['p'];
                $temp2->save();
                $c++;
            }
            $a = $a + 1;
        }

        $transStatus = 'true';
        // return ($item);
        //         die();
        // return ($temp2);
        //     die();
        // $transStatus = 'true';
        // } catch (\Exception $e) {
        //     $transStatus = 'false';
        // }
        $transMessage = 'Saving EMR Pasien ';

        if ($transStatus == 'true') {
            $transMessage = $transMessage . "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => $EMR,
                // "data2" => $EMRD,
                //    "jumlah" => count($EMRPASIENDETAIL),
                "update" => $j,
                "new" => $h,
                "as" => 'as@epic',
            );
            $this->saveEMRBackup($data, $head, $norec_EMR);
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "data" => $data,
                //                "keys" => $keys,
                //                "dtdt" => $dtdt,
                "as" => 'as@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function SaveRencana(Request $request)
    {

        $dataReq = $request->all();

        $head = $dataReq['head'];
        // $data = $dataReq['data'];
        $temp = $dataReq['temp'];



        DB::beginTransaction();
        // try {

        if ($head['norec_emr'] == '-') {

            $noemr = $this->generateCodeEMR(new EMRPasien, 'noemr', 15, 'MR' . date('ym') . '/');
            // return $noemr;
            if ($noemr == '') {
                $transMessage = "Gagal mengumpukan data, Coba lagi.!";
                DB::rollBack();
                $result = array(
                    "status" => 400,
                    "message" => $transMessage,
                    "as" => 'as@epic',
                );
                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }

            $EMR = new EMRPasien();
            $norecHead = $EMR->generateNewId();
            $EMR->norec = $norecHead;
            $norecTehMenikitunyaeuy = $norecHead;
            $EMR->norec = $norecTehMenikitunyaeuy;
            $EMR->kdprofile = 17;
            $EMR->statusenabled = 1;

            if (isset($head['noregistrasi'])) {
                $EMR->noregistrasifk = $head['noregistrasi'];
            }
            $EMRPASIENDETAIL = [];
        } else {
            $EMR = EMRPasien::where('noemr', $head['norec_emr'])
                ->where('noregistrasifk', $head['noregistrasi'])
                ->first();
            $noemr = $EMR->noemr;
        }

        //VALIDASI JIKA NOREGISTRASI BEDA //
        if (isset($head['noregistrasi'])) {
            if (trim($EMR->noregistrasifk) != $head['noregistrasi']) {
                $transMessage = "Kesalahan loading data..!";
                DB::rollBack();
                $result = array(
                    "status" => 400,
                    "message" => $transMessage,
                    "as" => 'as@epic',
                );
                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }
        }


        $EMR->noemr = $noemr;
        $EMR->emrfk = $head['emrfk'];
        $EMR->nocm = $head['nocm'];
        $EMR->namapasien = $head['namapasien'];
        $EMR->jeniskelamin = $head['jeniskelamin'];

        $EMR->umur = $head['umur'];
        if (isset($head['kelompokpasien'])) {
            $EMR->kelompokpasien = $head['kelompokpasien'];
        }
        if (isset($head['tglregistrasi'])) {
            $EMR->tglregistrasi = $head['tglregistrasi'];
        } else {
            $EMR->tglregistrasi = $this->getDateTime()->format('Y-m-d H:i:s');
        }
        if (isset($head['norec'])) {
            $EMR->norec_apd = $head['norec'];
        }
        if (isset($head['namakelas'])) {
            $EMR->namakelas = $head['namakelas'];
        }
        if (isset($head['namaruangan'])) {
            $EMR->namaruangan = $head['namaruangan'];
        } else {
            $EMR->namaruangan = "Triage Gawat Darurat";
        }
        if (isset($head['tgllahir'])) {
            $EMR->tgllahir = $head['tgllahir'];
        }
        if (isset($head['notelepon'])) {
            $EMR->notelepon = $head['notelepon'];
        }
        if (isset($head['alamatlengkap'])) {
            $EMR->alamat = $head['alamatlengkap'];
        }
        if (isset($head['jenisemr'])) {
            $EMR->jenisemr = $head['jenisemr'];
        }
        $EMR->pegawaifk = $this->getCurrentUserID();
        $EMR->tglemr = $this->getDateTime()->format('Y-m-d H:i:s');
        $EMR->save();
        $norec_EMR = $EMR->noemr;
        $i = 0;
        $sama = 0;
        $j = 0;
        $h = 0;
        // foreach ($data as $item) {
        //     $emrdfk = $item['id'];
        //     if (is_array($item['values'])) {
        //         $valueemr = $item['values']['value'] . '~' . $item['values']['text'];
        //     } else {
        //         $valueemr = $item['values'];
        //     }
        //     $sama = 0;
            
        //     $EMRD = [];
        //     if ($sama ==  0) {
        //         $EMRD = new EMRPasienD();
        //         $norecD = $EMRD->generateNewId();
        //         $EMRD->norec = $norecD;
        //         $EMRD->kdprofile = 1;
        //         $EMRD->statusenabled = 1;
        //         $EMRD->emrpasienfk = $norec_EMR;
        //         $EMRD->value = $valueemr;
        //         $EMRD->emrdfk = $emrdfk;
        //         $EMRD->emrfk = $head['emrfk'];
        //         $EMRD->pegawaifk = $this->getCurrentUserID();
        //         $EMRD->tgl = $this->getDateTime()->format('Y-m-d H:i:s');
        //         $EMRD->save();
        //         $h++;
        //     }

        //     $i = $i + 1;
        // }

        $a = 0;
        $sama2 = 0;
        $c = 0;
        foreach ($temp as $item) {
            // if (is_array($item['tgl'])) {
            //     $tgljam = $item['tgl']['tgl'] . '~' . $item['tgl']['text'];
            // } else {
            //     $tgljam = $item['tgl'];
            // }
            $sama2 = 0;

            $temp2 = [];
            // return($item['tglteratasi']);
            // die();
            if ($sama2 ==  0) {
                $temp2 = new RencanaAskep();
                $temp2->norec = $temp2->generateNewId();
                $temp2->emrpasienfk = $norec_EMR;
                $temp2->statusenabled = 1;
                $temp2->diagnosa = $item['diagnosa'];
                $temp2->tglditegakan = $item['tglditegakan'];
                $temp2->idperawatditegakan = $item['idperawatditegakan'];
                if(isset($item['idperawatteratasi']) && $item['idperawatteratasi']!="" && $item['idperawatteratasi']!="undefined"){
                    $temp2->idperawatteratasi = $item['idperawatteratasi'];
                    $temp2->namaperawatteratasi = $item['namaperawatteratasi'];
                }
                $temp2->namaperawat = $item['namaperawat'];
                $temp2->luaran = $item['luaran'];
                $temp2->intervensi = $item['intervensi'];
                if(isset($item['tglteratasi']) && $item['tglteratasi']!="" && $item['tglteratasi']!="undefined"){
                    // $temp2->idperawatditegakan = $item['idperawatditegakan'];
                    // $temp2->namaperawatteratasi = $item['namaperawatteratasi'];
                    $temp2->tglteratasi = $item['tglteratasi'];
                }
                $temp2->save();
                $c++;
            }
            $a = $a + 1;
        }

        $transStatus = 'true';        
        $transMessage = 'Saving EMR Pasien ';

        if ($transStatus == 'true') {
            $transMessage = $transMessage . "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => $EMR,
                // "data2" => $EMRD,
                //    "jumlah" => count($EMRPASIENDETAIL),
                "update" => $j,
                "new" => $h,
                "as" => 'as@epic',
            );
            // $this->saveEMRBackup($data, $head, $norec_EMR);
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                // "data" => $data,
                //                "keys" => $keys,
                //                "dtdt" => $dtdt,
                "as" => 'as@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function SaveCatatanKeperawatan(Request $request)
    {

        $dataReq = $request->all();

        $head = $dataReq['head'];
        $data = $dataReq['data'];
        $temp = $dataReq['temp'];



        //        foreach ($data as $itm){
        //            $dtdt[] = $itm;
        //        }
        //
        //        $keys = array_keys($data);

        DB::beginTransaction();
        // try {

        if ($head['norec_emr'] == '-') {

            $noemr = $this->generateCodeEMR(new EMRPasien, 'noemr', 15, 'MR' . date('ym') . '/');
            // return $noemr;
            if ($noemr == '') {
                $transMessage = "Gagal mengumpukan data, Coba lagi.!";
                DB::rollBack();
                $result = array(
                    "status" => 400,
                    "message" => $transMessage,
                    "as" => 'as@epic',
                );
                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }
            //                $noemr = $this->generateCode(new EMRPasien, 'noemr', 12, 'MR' . $this->getDateTime()->format('ym') . '/');
            //                $noemr = $this->generateCode(new EMRPasien, 'noemr', 14, 'MR' . $this->getDateTime()->format('ym') . '/');

            $EMR = new EMRPasien();
            $norecHead = $EMR->generateNewId();
            $EMR->norec = $norecHead;
            $norecTehMenikitunyaeuy = $norecHead;
            $EMR->norec = $norecTehMenikitunyaeuy;
            $EMR->kdprofile = 17;
            $EMR->statusenabled = 1;

            if (isset($head['noregistrasi'])) {
                $EMR->noregistrasifk = $head['noregistrasi'];
            }
            $EMRPASIENDETAIL = [];
        } else {
            $EMR = EMRPasien::where('noemr', $head['norec_emr'])
                ->where('noregistrasifk', $head['noregistrasi'])
                ->first();
            $noemr = $EMR->noemr;

            //DELETE DATA YANG ADA BIAR GAK DOUBLE DOUBLE
            // $EMRPASIENDETAIL = EMRPasienD::where('emrpasienfk', $noemr)
            //     ->select('emrdfk', 'value', 'tgl')
            //     ->where('emrfk', $head['emrfk'])
            //     // ->where('statusenabled', 1)
            //     // ->orderBy('emrdfk')
            //     ->delete();





            //                $EMRDelete = EMRPasienD::where('emrpasienfk', $noemr)
            //                ->where('emrfk', $head['emrfk'])
            //                ->delete();
        }

        //VALIDASI JIKA NOREGISTRASI BEDA //
        if (isset($head['noregistrasi'])) {
            if (trim($EMR->noregistrasifk) != $head['noregistrasi']) {
                $transMessage = "Kesalahan loading data..!";
                DB::rollBack();
                $result = array(
                    "status" => 400,
                    "message" => $transMessage,
                    "as" => 'as@epic',
                );
                return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            }
        }


        $EMR->noemr = $noemr;
        $EMR->emrfk = $head['emrfk'];
        //            if (isset($head['norec_pd'])) {
        //                $EMR->noregistrasifk = $head['norec_pd'];
        //            }
        $EMR->nocm = $head['nocm'];
        $EMR->namapasien = $head['namapasien'];
        $EMR->jeniskelamin = $head['jeniskelamin'];

        $EMR->umur = $head['umur'];
        if (isset($head['kelompokpasien'])) {
            $EMR->kelompokpasien = $head['kelompokpasien'];
        }
        if (isset($head['tglregistrasi'])) {
            $EMR->tglregistrasi = $head['tglregistrasi'];
        } else {
            $EMR->tglregistrasi = $this->getDateTime()->format('Y-m-d H:i:s');
        }
        if (isset($head['norec'])) {
            $EMR->norec_apd = $head['norec'];
        }
        if (isset($head['namakelas'])) {
            $EMR->namakelas = $head['namakelas'];
        }
        if (isset($head['namaruangan'])) {
            $EMR->namaruangan = $head['namaruangan'];
        } else {
            $EMR->namaruangan = "Triage Gawat Darurat";
        }
        if (isset($head['tgllahir'])) {
            $EMR->tgllahir = $head['tgllahir'];
        }
        if (isset($head['notelepon'])) {
            $EMR->notelepon = $head['notelepon'];
        }
        if (isset($head['alamatlengkap'])) {
            $EMR->alamat = $head['alamatlengkap'];
        }
        if (isset($head['jenisemr'])) {
            $EMR->jenisemr = $head['jenisemr'];
        }
        $EMR->pegawaifk = $this->getCurrentUserID();
        $EMR->tglemr = $this->getDateTime()->format('Y-m-d H:i:s');
        $EMR->save();

        $norec_EMR = $EMR->noemr;

        //            $EMRDelete = EMRPasienD::where('emrpasienfk', $norec_EMR)
        //                ->where('emrfk', $head['emrfk'])
        //                ->update([
        //                    'statusenabled' => false
        //                ]);
        $i = 0;
        //            foreach ($keys as $ky) {
        //                $emrdfk = $ky;
        //                $valueemr = $dtdt[$i];
        $sama = 0;
        $j = 0;
        $h = 0;
        foreach ($data as $item) {
            $emrdfk = $item['id'];
            if (is_array($item['values'])) {
                $valueemr = $item['values']['value'] . '~' . $item['values']['text'];
            } else {
                $valueemr = $item['values'];
            }
            $sama = 0;
            // foreach ($EMRPASIENDETAIL as $emrupdate){
            //     // return ($emrupdate);
            //     // die();
            //     $sama = 0;
            //     if ($emrupdate->tgl == $tgl ){
            //         $sama =  1;
            //         if ($emrupdate->value != $valueemr || $emrupdate->value == $valueemr){
            //             $sama =  0;
            //             break;
            //         }
            //         break;
            //     }
            // }

            // if  ($sama ==  0){
            //     $EMRPasienDUpdatekeun = EMRPasienD::where('emrpasienfk', $norec_EMR)
            //         ->where('emrfk', $head['emrfk'])
            //         ->where('emrdfk', $emrdfk)
            //         ->where('statusenabled', 1)
            //         // ->update([
            //         //     'kodeexternal' => 1,
            //         //     // 'value' => $valueemr
            //         // ]);
            //         // $j++;
            //         ->delete();
            //         // $sama = 0;
            //         // $EMRD =[];
            //         // $EMRD = new EMRPasienD();
            //         // $norecD = $EMRD->generateNewId();
            //         // $EMRD->norec = $norecD;
            //         // $EMRD->kdprofile = 1;
            //         // $EMRD->statusenabled = 1;
            //         // $EMRD->emrpasienfk = $norec_EMR;
            //         // $EMRD->value = $valueemr;
            //         // $EMRD->emrdfk = $emrdfk;
            //         // $EMRD->emrfk = $head['emrfk'];
            //         // $EMRD->pegawaifk = $this->getCurrentUserID();
            //         // $EMRD->tgl = $this->getDateTime()->format('Y-m-d H:i:s');
            //         // $EMRD->save();
            //         // $h++;
            // }
            $EMRD = [];
            if ($sama ==  0) {
                $EMRD = new EMRPasienD();
                $norecD = $EMRD->generateNewId();
                $EMRD->norec = $norecD;
                $EMRD->kdprofile = 1;
                $EMRD->statusenabled = 1;
                $EMRD->emrpasienfk = $norec_EMR;
                $EMRD->value = $valueemr;
                $EMRD->emrdfk = $emrdfk;
                $EMRD->emrfk = $head['emrfk'];
                $EMRD->pegawaifk = $this->getCurrentUserID();
                $EMRD->tgl = $this->getDateTime()->format('Y-m-d H:i:s');
                $EMRD->save();
                $h++;
            }




            //                $EMRD_temp = new EMRPasienD_Temp();
            //                $norecDs = $EMRD_temp->generateNewId();
            //                $EMRD_temp->norec = $norecDs;
            //                $EMRD_temp->kdprofile = 1;
            //                $EMRD_temp->statusenabled = 1;
            //                $EMRD_temp->emrpasienfk = $norec_EMR;
            //                $EMRD_temp->value = $valueemr;
            //                $EMRD_temp->emrdfk = $emrdfk;
            //                $EMRD_temp->emrfk = $head['emrfk'];
            //                $EMRD_temp->pegawaifk = $this->getCurrentUserID();
            //                $EMRD_temp->tgl = $this->getDateTime()->format('Y-m-d H:i:s');
            //                $EMRD_temp->save();
            $i = $i + 1;
        }
        // return ($temp);
        // die();
        // $EMR->namapasien = $head['namapasien'];

        //     foreach ($temp as $item) {
        //         if($item['norec'] == "") {
        // $temp2 = new TempEMR();
        // $temp2->norec = $temp2->generateNewId();
        // $temp2->emrpasienfk = $norec_EMR;
        // // } else {
        // //     $temp2 = TempEMR::whereIn('norec',$item['norec']);
        // // }
        // $temp2->tgljam = $item['tgl'];
        // $temp2->diagnosa = $item['dg'];
        // $temp2->hasilkeperawatan = $item['tkh'];
        // $temp2->pegawai = $item['pg'];
        // $temp2->emrfk = 516;
        // $temp2->save();
        //         // $transStatus = 'true';
        //     }

        // }

        //DELETE DATA YANG ADA BIAR GAK DOUBLE DOUBLE
        // $TempEMR = TempEMR::where('emrpasienfk', $noemr)
        //     ->select('*')
        //     ->where('emrpasienfk', $noemr)
        //     // ->where('statusenabled', 1)
        //     // ->orderBy('emrdfk')
        //     ->delete();
        $a = 0;
        //            foreach ($keys as $ky) {
        //                $emrdfk = $ky;
        //                $valueemr = $dtdt[$i];
        $sama2 = 0;
        // $b = 0;
        $c = 0;
        foreach ($temp as $item) {
            // return ($item);
            // die();
            // $emrpasienfk = $item['emrpasienfk'];
            if (is_array($item['tgl'])) {
                $tgljam = $item['tgl']['tgl'] . '~' . $item['tgl']['text'];
            } else {
                $tgljam = $item['tgl'];
            }
            $sama2 = 0;

            $temp2 = [];
            if ($sama2 ==  0) {
                $temp2 = new TempEMR();
                $temp2->norec = $temp2->generateNewId();
                $temp2->emrpasienfk = $norec_EMR;
                // } else {
                //     $temp2 = TempEMR::whereIn('norec',$item['norec']);
                // }
                $temp2->tgljam = $item['tgl'];
                $temp2->diagnosa = $item['dg'];
                $temp2->hasilkeperawatan = $item['tkh'];
                $temp2->pegawai = $item['pg'];
                $temp2->emrfk = 517;
                $temp2->save();
                $c++;
            }
            $a = $a + 1;
        }

        $transStatus = 'true';
        // return ($item);
        //         die();
        // return ($temp2);
        //     die();
        // $transStatus = 'true';
        // } catch (\Exception $e) {
        //     $transStatus = 'false';
        // }
        $transMessage = 'Saving EMR Pasien ';

        if ($transStatus == 'true') {
            $transMessage = $transMessage . "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => $EMR,
                // "data2" => $EMRD,
                //    "jumlah" => count($EMRPASIENDETAIL),
                "update" => $j,
                "new" => $h,
                "as" => 'as@epic',
            );
            $this->saveEMRBackup($data, $head, $norec_EMR);
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "data" => $data,
                //                "keys" => $keys,
                //                "dtdt" => $dtdt,
                "as" => 'as@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getEMRTransaksiDetailPolri2(Request $request)
    {
        //todo : detail
        $data = \DB::table('emrpasiend_t as emrdp')
            //            ->join('emrpasien_t as emrp', 'emrp.noemr', '=', 'emrdp.emrpasienfk')
            ->leftjoin('emrdpolri_t as emrd', 'emrd.id', '=', 'emrdp.emrdfk')
            // ->JOIN('emrd_t as emrd',function ($join){
            // $join->on('emrd.id','=','emrdp.emrdfk');
            // $join->on('emrd.emrfk','=','emrdp.emrfk');
            // })
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'emrdp.pegawaifk')
            //->leftjoin('emrfoto_t as ef', 'ef.noemrpasienfk', '=', 'emrp.noemr')
            ->select('emrdp.*', 'emrd.caption', 'emrd.type', 'emrd.nourut', 'emrdp.emrfk', 'emrd.reportdisplay', 'emrd.kodeexternal as kodeex', 'emrd.satuan', 'pg.namalengkap')
            ->where('emrdp.statusenabled', true);
        // ->orderBy('emrd.nourut');
        // ->orderBy('emrdp.emrdfk','asc');
        if (isset($request['noemr']) && $request['noemr'] != '') {
            $data = $data->where('emrdp.emrpasienfk', $request['noemr']);
        }
        if (isset($request['emrfk']) && $request['emrfk'] != '') {
            $data = $data->where('emrdp.emrfk', $request['emrfk']);
        }
        //        if (isset($request['norec']) && $request['norec'] != '') {
        //            $data = $data->where('emrp.norec', $request['norec']);
        //        }
        //        if (isset($request['noregistrasi']) && $request['noregistrasi'] != '') {
        //            $data = $data->where('emrp.noregistrasifk', $request['noregistrasi']);
        //        }
        if (isset($request['objectid']) && $request['objectid'] != '') {
            $data = $data->where('emrdp.emrdfk', $request['objectid']);
        }
        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'as@epic',
        );
        return $this->respond($result);
    }
}
