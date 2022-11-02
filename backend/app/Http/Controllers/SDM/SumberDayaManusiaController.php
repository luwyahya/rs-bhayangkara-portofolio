<?php
/**
 * Created by PhpStorm.
 * SumberDayaManusiaController
 * User: Efan Andrian (ea@epic)
 * Date: 12/11/2019
 * Time: 09:30 PM
 */

namespace App\Http\Controllers\SDM;
use App\Master\JamKerja;
use App\Master\Paket;
use App\Master\Agama;
use App\Master\DiklatJurusan;
use App\Master\DiklatKategory;
use App\Master\Eselon;
use App\Master\GolonganPegawai;
use App\Master\HubunganKeluarga;
use App\Master\Jabatan;
use App\Master\JenisJabatan;
use App\Master\JenisKelamin;
use App\Master\JenisPegawai;
use App\Master\JenisProvider;
use App\Master\JurusanPeminatan;
use App\Master\KategoryPegawai;
use App\Master\KelompokJabatan;
use App\Master\KelompokUser;
use App\Master\KeluargaPegawai;
use App\Master\Pegawai;
use App\Master\PemotonganPajak;
use App\Master\PegawaiJadwalKerja;
use App\Master\Pekerjaan;
use App\Master\Pendidikan;
use App\Master\SdmFakultas;
use App\Master\SdmInstitusiPendidikan;
use App\Transaksi\RekapTransferGaji;
use App\Transaksi\RiwayatSpkk;
use App\Transaksi\RiwayatSeminar;
use App\Master\Ruangan;
use App\Master\SdmKedudukan;
use App\Master\SdmShiftKerja;
use App\Master\JenisPetugasPelaksana;
use App\Master\KelompokProdukBpjs;
use App\Master\SettingDataFixed;
use App\Master\ShiftKerja;
use App\Master\StatusPegawai;
use App\Master\StatuspPerkawinanPegawai;
use App\Master\SubUnitKerja;
use App\Master\SuratKeputusan;
use App\Master\Tanggungan;
use App\Master\UnitKerjaPegawai;
use App\Transaksi\KegiatanPendidikan;
use App\Transaksi\MappingKalakToAnggota;
use App\Transaksi\MappingVicToPegawai;
use App\Transaksi\ListTanggalCuti;
use App\Transaksi\MasaBerlakuSipStr;
use App\Transaksi\NomorTelphonePegawai;
use App\Transaksi\PesertaDidik;
use App\Transaksi\PlanningPegawaiStatus;
use App\Transaksi\RiwayatJabatan;
use App\Transaksi\RiwayatPelatihan;
use App\Transaksi\RiwayatPendidikan;
use App\Transaksi\FotoPegawai;
use App\Transaksi\OrganisasiProfesi;
use App\Transaksi\RiwayatDikjur;
use App\Transaksi\TandaJasa;
use App\Transaksi\KecakapanBahasa;
use App\Transaksi\SDM_AbsensiPegawai;
use App\Transaksi\TenagaPengajar;
use App\Transaksi\JadwalKerjaPegawai;
use App\Transaksi\MapPegawaiToAtasan;
use Illuminate\Http\Request;
use DB;
use App\Transaksi\LoggingUser;
use Illuminate\Support\Facades\Storage;
use Response;
use App\Http\Controllers\ApiController;
use App\Notifications\MerryChristmas;
use App\Traits\Valet;
use Carbon\Carbon;
use App\Master\MapPegawaiToUnit;
use Nexmo\Laravel\Facade\Nexmo;
use Nexmo\Notifications\WhatsApp;
use NotificationChannels\ChatAPI\ChatAPI;
use NotificationChannels\ChatAPI\ChatAPIMessage;
use Twilio\Rest\Client;

class SumberDayaManusiaController extends ApiController {

    use Valet;
    public function __construct() {
        parent::__construct($skip_authentication=false);
    }

    public function getComboPegawaiSdm (Request $request){
        $dataLogin = $request->all();
//        $dataPegawai = \DB::table('loginuser_s as lu')
//            ->select('lu.objectpegawaifk','lu.objectkelompokuserfk')
//            ->where('lu.id',$dataLogin['userData']['id'])
//            ->first();
        $agama = Agama::where('statusenabled', true)->get();
        $jeniskelamin = JenisKelamin::where('statusenabled',true)->get();
        $UnitKerja = UnitKerjaPegawai::where('statusenabled',true)->get();
        $SubUnitKerja = SubUnitKerja::where('statusenabled',true)->get();
        $Ruangan = Ruangan::where('statusenabled',true)->get();
        $StatusPegawai = StatusPegawai::where('statusenabled',true)->get();
        $KategoryPegawai = KategoryPegawai::where('statusenabled',true)->get();
        $jabatan = Jabatan::where('statusenabled', true)->get();
        $jenisJabatan = JenisJabatan::where('statusenabled', true)->get();
        $GolonganPegawai = GolonganPegawai::where('statusenabled', true)
                            ->select(DB::raw("id, namaexternal || ' - ' || reportdisplay as golongan"))
                            ->get();
        $KelompokJabatan = KelompokJabatan::where('statusenabled', true)->get();
        $Pendidikan = Pendidikan::where('statusenabled', true)->get();
        $Eselon = Eselon::where('statusenabled', true)->get();
        $ShiftKerja = SdmShiftKerja::where('statusenabled', true)->get();
        $StatusKawin = StatuspPerkawinanPegawai::where('statusenabled', true)->get();
        $HubunganKeluarga = HubunganKeluarga::where('statusenabled', true)->get();
        $Pekerjaan = Pekerjaan::where('statusenabled', true)->get();
        $Tanggungan = Tanggungan::where('statusenabled', true)->get();
        $Kedudukan = SdmKedudukan::where('statusenabled',true)->get();
        $KelompokProdukBpjs = KelompokProdukBpjs::where('statusenabled',true)->get();
        $JenisPetugasPelaksana = JenisPetugasPelaksana::where('statusenabled',true)->get();
        $KelompokUser = KelompokUser::where('statusenabled',true)->get();
        $JenisPegawai = JenisPegawai::where('statusenabled',true)->get();
        $JenisProvider = JenisProvider::where('statusenabled',true)->get();

        $PangkatPegawai = \DB::table('pangkat_m as pk')
            ->where('pk.statusenabled', true)
            ->orderBy('pk.namapangkat')
            ->get();
        $Shift = \DB::table('shiftkerja_m as pk')
            ->where('pk.statusenabled', true)
            ->orderBy('pk.namashift')
            ->get();
        $tahunpajak = [0 => ["id" => "1", "tahun" => "2019"],
            1 => ["id" => "2", "tahun" => "2020"],
            2 => ["id" => "3", "tahun" => "2021"],
            3 => ["id" => "4", "tahun" => "2022"],
        ];

        $jenisBahasa = [0 => ["id" => "1", "jenisbahasa" => "Asing"],
            1 => ["id" => "2", "jenisbahasa" => "Daerah"],
        ];


        $SettingUsiaPensiun = SettingDataFixed::where('statusenabled', true)
            ->select('nilaifield')
            ->where('keteranganfungsi', 'ilike','%'.'Setting Usia Pensiun'.'%')
            ->first();
        $SettingPasswordAwal = SettingDataFixed::where('statusenabled', true)
            ->select('nilaifield')
            ->where('namafield', '=','passworddefault')
            ->first();
        $golonganPegawai = \DB::table('golonganpegawai_m as gp')
            ->select('gp.id', 'gp.golonganpegawai as eselon')
            ->where('gp.statusenabled', true)
            ->get();
        $jabatans = \DB::table('jabatan_m as jbt')
            ->select('jbt.id', 'jbt.namajabatan as detailkelompokjabatan')
            ->where('jbt.statusenabled', true)
            ->get();
        $DataUnitkerja=[];
        foreach ($UnitKerja as $item) {
            $detail = [];
            foreach ($SubUnitKerja as $item2) {
                if ($item->id == $item2->objectunitkerjapegawaifk) {
                    $detail[] = array(
                        'id' => $item2->id,
                        'name' => $item2->name,
                    );
                }
            }

            $DataUnitkerja[] = array(
                'id' => $item->id,
                'name' => $item->name,
                'subunit' => $detail,
            );
        }
        $DataJabatan=[];
        foreach ($jenisJabatan as $datas){
            $details=[];
            foreach ($jabatan as $data){
                if ($datas->id = $data->objectjenisjabatanfk){
                    $details[]=array(
                        'id' => $data->id,
                        'namajabatan' => $data->namajabatan
                    );
                }
            }
            $DataJabatan[] = array(
                'id' => $datas->id,
                'jenisjabatan' => $datas->jenisjabatan,
                'jabatan' => $details
            );
        }

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

        $dataKelompok = \DB::table('kelompokpasien_m as kp')
            ->select('kp.id', 'kp.kelompokpasien')
            ->where('kp.statusenabled', true)
            ->orderBy('kp.kelompokpasien')
            ->get();
        $dataGPP = \DB::table('golonganpajakpegawai_m as gpp')
            ->select('gpp.id', 'gpp.golonganpajakpegawai')
            ->where('gpp.statusenabled', true)
            ->orderBy('gpp.golonganpajakpegawai')
            ->get();
        $pangkatPolisi = \DB::table('pangkatpolisi_m as pp')
            ->select('pp.id', 'pp.namaexternal as pangkatpolisi')
            ->whereNotNull('pp.namaexternal')
            ->get();
        $golonganDarah = \DB::table('golongandarah_m as gd')
            ->select('gd.id', 'gd.golongandarah')
            ->get();

        $pegawai = \DB::table('pegawai_m as pg')
            ->select('pg.id', 'pg.namalengkap')
            ->where('pg.statusenabled', true)
            ->whereNotNull('pg.namalengkap')
            ->whereNotIn('pg.namalengkap', ['-', '- (Petugas Pelaksana Belum Diinput)', '26164', '26904', '27463'])
            ->orderBy('pg.namalengkap')
            ->get();

        $result = array(
            'datalogin'=> $dataLogin,
            'unitkerjapegawai' => $UnitKerja,
            'subunitkerja' => $SubUnitKerja,
            'dataunitkerja' => $DataUnitkerja,
            'statuspegawai' => $StatusPegawai,
            'kategorypegawai' => $KategoryPegawai,
            'jeniskelamin' => $jeniskelamin,
            'ruangan' => $Ruangan,
            'agama' => $agama,
            'jabatan' => $jabatan,
            'jabatans' => $jabatans,
            'golonganPegawai' => $golonganPegawai,
            'golonganpegawai' => $GolonganPegawai,
            'kelompokjabatan' => $KelompokJabatan,
            'pendidikan' =>$Pendidikan,
            'eselon' => $Eselon,
            'shiftkerja' => $ShiftKerja,
            'statuskawin' => $StatusKawin,
            'usiapensiun' => $SettingUsiaPensiun,
            'hubungankeluarga' => $HubunganKeluarga,
            'pekerjaan' => $Pekerjaan,
            'kelompokprodukbpjs' => $KelompokProdukBpjs,
            'tahunpajak' => $tahunpajak,
            'jenispetugaspelaksana' => $JenisPetugasPelaksana,
            'tanggungan' => $Tanggungan,
            'datajabatan' => $DataJabatan,
            'kedudukan' => $Kedudukan,
            'kelompokuser' => $KelompokUser,
            'passwordawal' => $SettingPasswordAwal,
            'jenispegawai' => $JenisPegawai,
            'pangkatpegawai' => $PangkatPegawai,
            'shiftpegawai' => $Shift,
            'jenisprovider' => $JenisProvider,
            'departemen' => $dataDepartemen,
            'kelompokpasien' => $dataKelompok,
            'golonganpajakpegawai' => $dataGPP,
            'pangkatpolisi' => $pangkatPolisi,
            'golongandarah' => $golonganDarah,
            'jenisbahasa' => $jenisBahasa,
            'pegawai' => $pegawai,
            'by' => 'ea@epic',
        );

        return $this->respond($result);
    }

    public function getDaftarPegawai (Request $request) {
        $data = \DB::table('pegawai_m as pg')
            ->leftJoin('agama_m as ag','ag.id','=','pg.objectagamafk')
            ->leftJoin('detailkategorypegawai_m as dkp','dkp.id','=','pg.objectdetailkategorypegawaifk')
            ->leftJoin('golongandarah_m as gd','gd.id','=', 'pg.objectgolongandarahfk')
            ->leftJoin('jabatan_m as jb','jb.id','=','pg.objectjabatanfungsionalfk')
            ->leftJoin('jabatan_m as jb1','jb1.id', '=', 'pg.objectjabatanstrukturalfk')
            ->leftJoin('golonganpegawai_m as gp','gp.id','=', 'pg.objectgolonganpegawaifk')
            ->leftJoin('unitkerjapegawai_m as uk','uk.id','=','pg.objectunitkerjapegawaifk')
            ->leftJoin('statuspegawai_m as sp','sp.id','=','pg.objectstatuspegawaifk')
            ->leftJoin('kelompokjabatan_m as kj','kj.id','=','pg.objectkelompokjabatanfk')
            ->leftJoin('statusperkawinanpegawai_m as spp','spp.id','=','pg.objectstatusperkawinanpegawaifk')
            ->leftJoin('kategorypegawai_m as kp','kp.id','=','pg.kategorypegawai')
            ->leftJoin('eselon_m as ese','ese.id','=','pg.objecteselonfk')
            ->leftJoin('pendidikan_m as pend','pend.id', '=','pg.objectpendidikanterakhirfk')
            ->leftJoin('jeniskelamin_m as jk','jk.id','=','pg.objectjeniskelaminfk')
            ->leftJoin('sdm_golongan_m as gol','gol.id','=','pg.objectgolonganfk')
            ->leftJoin('nilaikelompokjabatan_m as nkj','nkj.id','=','pg.objectkelompokjabatanfk')
            ->leftJoin('sdm_kelompokshift_m as ks','ks.id','=','pg.objectshiftkerja')
            ->leftJoin('sdm_kedudukan_m as kdd','kdd.id','=','pg.kedudukanfk')
            ->leftJoin('petugasdiklat_m as pet','pet.id','=','pg.objectpetugasdiklatfk')
            ->leftJoin('ruangan_m as ru','ru.id','=','pg.objectruangankerjafk')
            // ->leftJoin('pemotonganpajak_t as ptp','ptp.objectpegawaifk','=','pg.id')
            ->select(\DB::raw("pg.*,    CASE WHEN pg.namaexternal IS NULL and pg.namalengkap ilike '%dr.%' THEN 'gakada' else pg.namaexternal end as dl,ag.agama,dkp.detailkategorypegawai,gd.golongandarah,jb.namajabatan as jbfungsional,
			                        jb1.namajabatan as jbstruktural,gp.golonganpegawai,uk.name as unitkerja,sp.statuspegawai,
			                        kj.namakelompokjabatan,spp.statusperkawinan,ese.eselon,kp.kategorypegawai as namakategorypegawai,pend.pendidikan,jk.jeniskelamin,
			                        gol.name as golongan,nkj.detailkelompokjabatan,nkj.grade,ks.kelompokshiftkerja,kdd.name as kedudukan,
			                        pg.objectpetugasdiklatfk,pet.petugasdiklat,pg.objectruangankerjafk,ru.namaruangan"))
            ->where('pg.statusenabled',true)
            ->where('pg.kedudukanfk', 1)
            ->orderBy('pg.namalengkap');

            if (isset($request['idPegawai']) && $request['idPegawai'] != "" && $request['idPegawai'] != "undefined") {
                $arrPegawai = explode(',', $request['idPegawai']);
                $kodePegawai = [];
                foreach ($arrPegawai as $item) {
                    $kodePegawai[] = (int) $item;
                }
                $data = $data->whereIn('pg.id', $kodePegawai);
            }
            if(isset($request['idPegawai2']) && $request['idPegawai2']!="" && $request['idPegawai2']!="undefined"){
            $data = $data->whereIn('pg.id',[$request['idPegawai2']]);
            }
        // if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
        //     $data = $data->whereIn('pg.id',[$request['idPegawai']]);
        // }//getDataLaporanDiagnosaPasien
        // $data = $data->distinct()
        $data = $data->get();
        return $this->respond($data);
    }
    public function getDaftarPegawaiPP (Request $request) {
        // return($request['idPegawai']);
        // die();
        $data = \DB::table('pegawai_m as pg')
            ->join('mappetugaspelaksanabpjs_t as mppb', 'mppb.objectpegawaifk', '=', 'pg.id')
            ->join('kelompokprodukbpjs_m as kpb', 'kpb.id', '=', 'mppb.objectkelompokprodukbpjsfk')
            ->join('jenispetugaspelaksana_m as jpp', 'jpp.id', '=', 'mppb.objectpetugaspelaksanafk')
            ->select("kpb.id as idkpb","kpb.namaexternal as namakpb","jpp.id as idjpp","jpp.namaexternal as namajpp", "mppb.id")
            ->where('pg.statusenabled',true)
            ->where('mppb.statusenabled',true)
            ->where('pg.id', $request['idPegawai'])
            ->orderBy('kpb.id');
        $data = $data->get();
        return $this->respond($data);
    }

    public function getRekeningPegawai (Request $request) {
        // return($request['katagori']);
        // die;
        // foreach ( $request['id'] as $item){
        //     $katagori[] = (int) $item['id'];
        // }
        // //  return($katagori);
        // die;
        if($request['katagori'] == "")
        {
            $data = \DB::table('pegawai_m as pg')
            ->select('pg.*',
                DB::raw('case when pg.bankrekeningnomor is null then \'-\' else pg.bankrekeningnomor end as nomorrekening2,
                         case when pg.salary is null then \'0\' else pg.salary end as salary2,case when pg.bankrekeningatasnama is null then pg.namalengkap else pg.bankrekeningatasnama end as  bankrekeningatasnama2,
                         0 as no '))
            ->whereNotIn('pg.namalengkap',['-','- (Dokter Belum Diinput)','- (Petugas Pelaksana Belum Diinput)'])
            ->where('pg.statusenabled', true)
            // ->whereIn('pg.kategorypegawai',[$request['katagori']])
            ->whereNotIn('pg.id',[2,890,27676,27733,27746])
            ->where('pg.kedudukanfk', 1)
            
            ->orderBy('pg.namalengkap')
            ->get();
        }else{
            $data = \DB::table('pegawai_m as pg')
            ->select('pg.*',
                DB::raw('case when pg.bankrekeningnomor is null then \'-\' else pg.bankrekeningnomor end as nomorrekening2,
                         case when pg.salary is null then \'0\' else pg.salary end as salary2,case when pg.bankrekeningatasnama is null then pg.namalengkap else pg.bankrekeningatasnama end as  bankrekeningatasnama2,
                         0 as no '))
            // ->whereNotIn('pg.namalengkap',['-','- (Dokter Belum Diinput)','- (Petugas Pelaksana Belum Diinput)'])
            ->where('pg.statusenabled', true)
            ->whereIn('pg.kategorypegawai',[$request['katagori']])
            ->whereNotIn('pg.id',[2,890,27676,27733,27746])
            ->where('pg.kedudukanfk', 1)

            ->orderBy('pg.namalengkap')
            ->get();
        }
        

            return $this->respond($data);
    }
    public function getUpdatePegawai (Request $request) {
        $data = \DB::table('pegawai_m as pg')
            ->select('pg.*')
            ->where('pg.statusenabled', true)
            ->whereNotIn('pg.id',[2,890,27676,27733,27746])
            ->where('pg.kedudukanfk', 1)

            ->orderBy('pg.namalengkap')
            ->get();
        
        

            return $this->respond($data);
    }
    public function getEditUpdatePegawai (Request $request) {
        $data = \DB::table('pegawai_m')
            ->select('id as idpegawai', 'salary', 'bankrekeningnomor', 'salarydua', 'bankrekeningnomordua', 'namalengkap','kategorypegawai')
            ->where('statusenabled', true)
            ->whereNotIn('id',[2,890,27676,27733,27746])
            ->where('kedudukanfk', 1);
            $data = $data->groupBy('id','salary','bankrekeningnomor','salarydua','bankrekeningnomordua','namalengkap','kategorypegawai');
            $data = $data->orderBy('namalengkap');
            $data = $data->get();
        
        

            return $this->respond($data);
    }
    public function cekSudahUpdate (Request $request) {
        $data = \DB::table('rekaptransfergaji_t as rtg')
            ->select('rtg.tglupdate','rtg.cekupdate');
            if (isset($request['bulan']) && $request['bulan'] != "" && $request['bulan'] != "undefined") {
                $data = $data->whereMonth('rtg.tglupdate', '=', $request['bulan']);
            }
            if (isset($request['tahun']) && $request['tahun'] != "" && $request['tahun'] != "undefined") {
                $data = $data->whereYear('rtg.tglupdate', '=', $request['tahun']);
            }
            $data = $data->get();

        return $this->respond($data);
    }
    public function getRekeningPegawai2 (Request $request) {
        // return($request['katagori']);
        // die;
        // foreach ( $request['id'] as $item){
        //     $katagori[] = (int) $item['id'];
        // }
        // //  return($katagori);
        // die;
        if($request['katagori'] == "")
        {
            $data = \DB::table('rekaptransfergaji_t as pg')
            ->select('pg.*',
                DB::raw('case when pg.norekening is null then \'-\' else pg.norekening end as nomorrekening2,
                         case when pg.norekeningdua is null then \'-\' else pg.norekeningdua end norekeningdua,
                         case when pg.salary is null then \'0\' else pg.salary end as salary2,
                         ROW_NUMBER() OVER (ORDER BY pg.namapegawai) AS no
                         '))
            ->whereNotIn('pg.namapegawai',['-'])
            ->where('pg.statusenabled', true);
            // ->whereNotIn('pg.namalengkap',['-','- (Dokter Belum Diinput)','- (Petugas Pelaksana Belum Diinput)'])
            // ->where('pg.statusenabled', true)
            // ->whereIn('pg.kategorypegawai',[$request['katagori']])
            // ->whereNotIn('pg.id',[2,890,27676,27733,27746])
            // ->where('pg.kedudukanfk', 1)
            // if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            //     $data = $data->where('pg.tglupdate', '>=', $request['tglAwal']);
            // }
    
            // if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            //     $data = $data->where('pg.tglupdate', '<=', $request['tglAkhir']);
            // }
            if (isset($request['bulan']) && $request['bulan'] != "" && $request['bulan'] != "undefined") {
                $data = $data->whereMonth('pg.tglupdate', '=', $request['bulan']);
            }
            if (isset($request['tahun']) && $request['tahun'] != "" && $request['tahun'] != "undefined") {
                $data = $data->whereYear('pg.tglupdate', '=', $request['tahun']);
            }
            if (isset($request['nama']) && $request['nama'] != "" && $request['nama'] != "undefined") {
                $data = $data->where('pg.namapegawai', 'ilike', '%' . $request['nama'] . '%');
            }
            
            $data = $data->orderBy('pg.namapegawai');
            $data = $data->get();
        }else{
            $data = \DB::table('rekaptransfergaji_t as pg')
            ->select('pg.*',
                DB::raw('case when pg.norekening is null then \'-\' else pg.norekening end as nomorrekening2,
                         case when pg.salary is null then \'0\' else pg.salary end as salary2,
                         ROW_NUMBER() OVER (ORDER BY pg.namapegawai) AS no
                         '))
            ->whereNotIn('pg.namapegawai',['-']);
            // ->whereNotIn('pg.namalengkap',['-','- (Dokter Belum Diinput)','- (Petugas Pelaksana Belum Diinput)'])
            // ->where('pg.statusenabled', true)
            // ->whereIn('pg.kategorypegawai',[$request['katagori']]);
            // ->whereNotIn('pg.id',[2,890,27676,27733,27746])
            // ->where('pg.kedudukanfk', 1)
            // if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            //     $data = $data->where('pg.tglupdate', '>=', $request['tglAwal']);
            // }
    
            // if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            //     $data = $data->where('pg.tglupdate', '<=', $request['tglAkhir']);
            // }
            if (isset($request['bulan']) && $request['bulan'] != "" && $request['bulan'] != "undefined") {
                $data = $data->whereMonth('pg.tglupdate', '=', $request['bulan']);
            }
            if (isset($request['tahun']) && $request['tahun'] != "" && $request['tahun'] != "undefined") {
                $data = $data->whereYear('pg.tglupdate', '=', $request['tahun']);
            }
            if(isset($request['katagori']) && $request['katagori']!="" && $request['katagori']!="undefined"){
                $arrRuang = explode(',',$request['katagori']) ;
                $kodeRuang = [];
                foreach ( $arrRuang as $item){
                    $kodeRuang[] = (int) $item;
                }
                $data = $data->whereIn('pg.kategorypegawai',$kodeRuang);
            }
            if (isset($request['nama']) && $request['nama'] != "" && $request['nama'] != "undefined") {
                $data = $data->where('pg.namapegawai', 'ilike', '%' . $request['nama'] . '%');
            }
            
            $data = $data->orderBy('pg.namapegawai');
            $data = $data->get();
        }
        

            return $this->respond($data);
    }
    public function saveTransferGaji(Request $request) {
        ini_set('max_execution_time', 500); //6 minutes
        // try {
            foreach ($request['updateAnyar'] as $item) {
                $dataAnyar = new RekapTransferGaji();
                $dataAnyar->norec = $dataAnyar->generateNewId();
                $dataAnyar->idpegawai = $item['idPegawai'];
                $dataAnyar->tglupdate = $item['tglUpdate'];
                $dataAnyar->namapegawai = $item['namapegawai'];
                $dataAnyar->kategorypegawai = $item['kategorypegawai'];
                $dataAnyar->norekening = $item['norekening'];
                $dataAnyar->salary = $item['salary'];
                $dataAnyar->statusenabled = true;
                $dataAnyar->cekupdate = 1;
                $dataAnyar->save();
            }
            $transStatus = 'true';
        // } catch (\Exception $e) {
        //     $transStatus = 'false';
        //     $transMessage = " PP PPD PPP";
        // }
        if ($transStatus == 'true') {
            $transMessage = "Update Berhasil !";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            $transMessage = "Update Gagal !";
            DB::rollback();
            $result = array (
                "status" => 400,
                "message" => $transMessage,
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveEditData(Request $request) {
        ini_set('max_execution_time', 500); //6 minutes
        try {
            foreach ($request['updateLuwihAnyar'] as $item) {
                $dataAnyar = new RekapTransferGaji();
                $dataAnyar->norec = $dataAnyar->generateNewId();
                $dataAnyar->idpegawai = $item['idPegawai'];
                $dataAnyar->tglupdate = $item['tglUpdate'];
                $dataAnyar->namapegawai = $item['namapegawai'];
                $dataAnyar->kategorypegawai = $item['kategorypegawai'];
                $dataAnyar->norekening = $item['norekening'];
                $dataAnyar->norekeningdua = $item['norekeningdua'];
                $dataAnyar->salary = $item['salary'];
                $dataAnyar->salarydua = $item['salarydua'];
                $dataAnyar->statusenabled = true;
                $dataAnyar->cekupdate = $item['cekupdate'] + 1;
                $dataAnyar->save();
            }
            foreach ($request['updateLuwihAnyar'] as $item) {
            $cekDataAnyar = RekapTransferGaji::where('cekupdate', $item['cekupdate'])
                ->where('tglupdate', $item['tglUpdate'])
                ->update(array('statusenabled' => false));
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = " PP PPD PPP";
        }
        if ($transStatus == 'true') {
            $transMessage = "Update Berhasil !";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            $transMessage = "Update Gagal !";
            DB::rollback();
            $result = array (
                "status" => 400,
                "message" => $transMessage,
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveEditGaji(Request $request) 
    {
        DB::beginTransaction();
        $transStatus = 'true';
        try {
            $data = RekapTransferGaji::where('idpegawai', $request['idPegawai'])
                ->where('tglupdate', $request['tgl'])
                ->where('statusenabled', true)
                ->update([
                    'salary' => $request['salary']
                ]);
            $transMessage = "Update Salary berhasil!";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Update Salary gagal";
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

    public function getKatagoriPegawai(Request $request) {
        $data = \DB::table('kategorypegawai_m as kg')
            ->select('kg.id','kg.kategorypegawai')
            ->orderBy('kg.kategorypegawai')
            ->get();

            return $this->respond($data);
    }
    public function getComboHonor(Request $request) {
        $kedudukan = \DB::table('sdm_kedudukan_m as kd')
            ->select('kd.id', 'kd.name')
            ->where('kd.statusenabled', true)
            ->whereNotIn('kd.name',['-'])
            ->orderBy('kd.id')
            ->get();

            return $this->respond($kedudukan);
    }
    public function getLaporanPegawai (Request $request) {
        $data = \DB::table('pegawai_m as pg')
            ->leftjoin('kategorypegawai_m as kp', 'kp.id', '=', 'pg.kategorypegawai')
            ->leftjoin('sdm_kedudukan_m as kd', 'kd.id', '=', 'pg.kedudukanfk')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pg.objectruangankerjafk')
            ->leftjoin('sdm_golongan_m as glg', 'glg.id', '=', 'pg.objectgolonganfk')
            ->leftjoin('pangkat_m as pkt', 'pkt.id', '=', 'pg.objectpangkatfk')
            ->select('pg.namalengkap', 'ru.namaruangan', 'kp.kategorypegawai', 'pkt.namapangkat',
                DB::raw("case when pg.objectgolonganfk is not null then glg.namaexternal + glg.name else '-' end as golonganpegawai,
                ROW_NUMBER() OVER (ORDER BY pg.namalengkap) AS no"))
            ->whereNotIn('pg.namalengkap',['-','- (Dokter Belum Diinput)','- (Petugas Pelaksana Belum Diinput)'])
            ->where('pg.statusenabled', true)
            ->whereNotIn('pg.id',[2,890,27676,27733,27746])
            ->orderBy('pg.namalengkap')
            ->get();

            return $this->respond($data);
            //ROW_NUMBER() OVER (ORDER BY pg.namapegawai) AS no
    }
    public function getPembayaranHonorPtt (Request $request) {
        $data = \DB::table('pegawai_m as pg')
            ->join('rekaptransfergaji_t as rtg','rtg.idpegawai','=','pg.id')
            ->leftjoin('pendidikan_m as pnd', 'pnd.id', '=', 'pg.objectpendidikanterakhirfk')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pg.objectruangankerjafk')
            ->leftjoin('statuspegawai_m as sp', 'sp.id', '=', 'pg.objectstatuspegawaifk')
            ->select('pg.id','pg.namalengkap', 'pnd.pendidikan', 'ru.namaruangan', 'pg.tglmasuk', 'ru.id', 'pg.objectstatuspegawaifk', 'sp.statuspegawai', 'pg.kedudukanfk',
                DB::raw('case when pg.objectpendidikanterakhirfk is null then \'-\' else pnd.pendidikan end as pendidikan2,
                         case when pg.objectruangankerjafk is null then \'-\' else ru.namaruangan end as namaruangan2,
                         --case when pg.tglmasuk is null then \'-\' else pg.tglmasuk end as tglmasuk,
                         case when rtg.salary is null then \'0\' else rtg.salary end as salary'))
            ->whereNotIn('pg.namalengkap',['-','- (Dokter Belum Diinput)','- (Petugas Pelaksana Belum Diinput)'])
            ->where('pg.statusenabled', true)
            ->where('rtg.statusenabled', true)
            ->whereNotIn('pg.id',[2,890,27676,27733,27746])
            ->where('pg.kedudukanfk', 1);
            // ->whereNotIn('pg.salary',['-']);

            if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
                $data = $data->where('ru.id','=', $request['ruangan']);
            }
            if(isset($request['spg']) && $request['spg']!="" && $request['spg']!="undefined"){
                $data = $data->where('pg.kategorypegawai','=', $request['spg']);
            }
            if (isset($request['bulan']) && $request['bulan'] != "" && $request['bulan'] != "undefined") {
                $data = $data->whereMonth('rtg.tglupdate', '=', $request['bulan']);
            }
            if (isset($request['tahun']) && $request['tahun'] != "" && $request['tahun'] != "undefined") {
                $data = $data->whereYear('rtg.tglupdate', '=', $request['tahun']);
            }

            $data = $data->orderBy('pg.namalengkap');
            $data = $data->get();

            return $this->respond($data);
    }
    public function getJumlahPembayaranPtt (Request $request) {
        $data = \DB::table('pegawai_m as pg')
        ->join('rekaptransfergaji_t as rtg','rtg.idpegawai','=','pg.id')
        ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pg.objectruangankerjafk')
        ->select('ru.namaruangan',
            DB::raw('sum(case when rtg.salary is not null then rtg.salary else 0 end) as salary2'))
        ->whereNotIn('pg.namalengkap',['-','- (Dokter Belum Diinput)','- (Petugas Pelaksana Belum Diinput)'])
        ->where('pg.statusenabled', true)
        ->whereNotIn('pg.id',[2,890,27676,27733,27746]) 
        ->where('pg.kedudukanfk', 1);
        
        if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
            $data = $data->where('ru.id','=', $request['ruangan']);
        }
        if (isset($request['bulan']) && $request['bulan'] != "" && $request['bulan'] != "undefined") {
            $data = $data->whereMonth('rtg.tglupdate', '=', $request['bulan']);
        }
        if (isset($request['tahun']) && $request['tahun'] != "" && $request['tahun'] != "undefined") {
            $data = $data->whereYear('rtg.tglupdate', '=', $request['tahun']);
        }

        $data = $data->groupBy('ru.namaruangan');
        $data = $data->get();

        return $this->respond($data);
    }
    public function getJumlahPembayaranKelompokPtt (Request $request) {
        $data = \DB::table('pegawai_m as pg')
        ->join('rekaptransfergaji_t as rtg','rtg.idpegawai','=','pg.id')
        ->leftjoin('kategorypegawai_m as sp', 'sp.id', '=', 'pg.kategorypegawai')
        ->select('sp.kategorypegawai',
            DB::raw('sum(case when rtg.salary is not null then rtg.salary else 0 end) as salary2'))
        ->whereNotIn('pg.namalengkap',['-','- (Dokter Belum Diinput)','- (Petugas Pelaksana Belum Diinput)'])
        ->where('pg.statusenabled', true)
        ->whereNotIn('pg.id',[2,890,27676,27733,27746])
        ->where('pg.kedudukanfk', 1);
        
        if(isset($request['spg']) && $request['spg']!="" && $request['spg']!="undefined"){
            $data = $data->where('sp.id','=', $request['spg']);
        }
        if (isset($request['bulan']) && $request['bulan'] != "" && $request['bulan'] != "undefined") {
            $data = $data->whereMonth('rtg.tglupdate', '=', $request['bulan']);
        }
        if (isset($request['tahun']) && $request['tahun'] != "" && $request['tahun'] != "undefined") {
            $data = $data->whereYear('rtg.tglupdate', '=', $request['tahun']);
        }

        $data = $data->groupBy('sp.kategorypegawai');
        $data = $data->get();

        return $this->respond($data);
    }

    public function getTotalPembayaranPtt (Request $request) {
        $data = \DB::table('pegawai_m as pg')
            ->join('rekaptransfergaji_t as rtg','rtg.idpegawai','=','pg.id')
            ->select(DB::raw('sum (case when rtg.salary is not null then cast(rtg.salary as numeric) + 12.0 else 0 end) as salary2'))
            ->whereNotIn('pg.namalengkap',['-','- (Dokter Belum Diinput)','- (Petugas Pelaksana Belum Diinput)'])
            ->where('pg.statusenabled', true)
            ->whereNotIn('pg.id',[2,890,27676,27733,27746])
            ->where('pg.kedudukanfk', 1);

            if (isset($request['bulan']) && $request['bulan'] != "" && $request['bulan'] != "undefined") {
                $data = $data->whereMonth('rtg.tglupdate', '=', $request['bulan']);
            }
            if (isset($request['tahun']) && $request['tahun'] != "" && $request['tahun'] != "undefined") {
                $data = $data->whereYear('rtg.tglupdate', '=', $request['tahun']);
            }

            $data = $data->get();
            
            return $this->respond($data);
    }
    public function getPembayaranRekap (Request $request) {
        $data = \DB::table('pegawai_m as pg')
            ->join('rekaptransfergaji_t as rtg','rtg.idpegawai','=','pg.id')
            ->select(DB::raw('sum (case when rtg.salary is not null then cast(rtg.salary as numeric(12, 0)) else 0 end) as salary2'))
            ->whereNotIn('pg.namalengkap',['-','- (Dokter Belum Diinput)','- (Petugas Pelaksana Belum Diinput)'])
            ->where('pg.statusenabled', true)
            ->whereNotIn('pg.id',[2,890,27676,27733,27746])
            ->where('pg.kedudukanfk', 1);
            // ->whereNotNull('pg.objectruangankerjafk');
            if (isset($request['bulan']) && $request['bulan'] != "" && $request['bulan'] != "undefined") {
                $data = $data->whereMonth('rtg.tglupdate', '=', $request['bulan']);
            }
            if (isset($request['tahun']) && $request['tahun'] != "" && $request['tahun'] != "undefined") {
                $data = $data->whereYear('rtg.tglupdate', '=', $request['tahun']);
            }
            $data = $data->get();

            return $this->respond($data);
    }
    public function getPersonilRekap (Request $request) {
        $data = \DB::table('pegawai_m as pg')
            ->join('rekaptransfergaji_t as rtg','rtg.idpegawai','=','pg.id')
            ->select(DB::raw('sum (case when rtg.salary is null then 0 else 1 end)::float as personil'))
            ->whereNotIn('pg.namalengkap',['-','- (Dokter Belum Diinput)','- (Petugas Pelaksana Belum Diinput)'])
            ->where('pg.statusenabled', true)
            ->whereNotIn('pg.id',[2,890,27676,27733,27746])
            ->where('pg.kedudukanfk', 1)
            ->whereNotNull('pg.objectruangankerjafk');
            if (isset($request['bulan']) && $request['bulan'] != "" && $request['bulan'] != "undefined") {
                $data = $data->whereMonth('rtg.tglupdate', '=', $request['bulan']);
            }
            if (isset($request['tahun']) && $request['tahun'] != "" && $request['tahun'] != "undefined") {
                $data = $data->whereYear('rtg.tglupdate', '=', $request['tahun']);
            }
            $data = $data->get();

            return $this->respond($data);
    }

    public function updateDataIdFingerPrint(Request $request){
        \DB::beginTransaction();
        $tglAyeuna = date('Y-m-d H:i:s');
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id',$dataLogin['userData']['id'])
            ->first();

        try {

            $Kel = Pegawai::where('id', $request['idpegawai'])
                ->update([
                    'fingerprintid' => $request['idfinger'],
                ]);

            /*Logging User*/
            $newId = LoggingUser::max('id');
            $newId = $newId +1;
            $logUser = new LoggingUser();
            $logUser->id = $newId;
            $logUser->norec = $logUser->generateNewId();
            $logUser->kdprofile= 0;
            $logUser->statusenabled=true;
            $logUser->jenislog = 'Update Id Finger Print Pegawai';
            $logUser->noreff =$request['idpegawai'];
            $logUser->referensi='id pegawai';
            $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
            $logUser->tanggal = $tglAyeuna;
            $logUser->save();
            /*End Logging User*/

            $transStatus = true;
        } catch (\Exception $e) {
            $transStatus = false;
        }

        if ($transStatus) {
            $transMessage = 'Simpan Berhasil';
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'ea@epic',
            );
        } else {
            $transMessage = 'Simpan Gagal';
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDetailPegawai (Request $request) {
        $data = \DB::table('pegawai_m as pg')
            ->leftJoin('agama_m as ag','ag.id','=','pg.objectagamafk')
            ->leftJoin('detailkategorypegawai_m as dkp','dkp.id','=','pg.objectdetailkategorypegawaifk')
            ->leftJoin('golongandarah_m as gd','gd.id','=', 'pg.objectgolongandarahfk')
            ->leftJoin('jabatan_m as jb','jb.id','=','pg.objectjabatanfungsionalfk')
            ->leftJoin('jabatan_m as jb1','jb1.id', '=', 'pg.objectjabatanstrukturalfk')
            ->leftJoin('golonganpegawai_m as gp','gp.id','=', 'pg.objectgolonganpegawaifk')
            ->leftJoin('unitkerjapegawai_m as uk','uk.id','=','pg.objectunitkerjapegawaifk')
            ->leftJoin('statuspegawai_m as sp','sp.id','=','pg.objectstatuspegawaifk')
            ->leftJoin('kelompokjabatan_m as kj','kj.id','=','pg.objectkelompokjabatanfk')
            ->leftJoin('statusperkawinanpegawai_m as spp','spp.id','=','pg.objectstatusperkawinanpegawaifk')
            ->leftJoin('eselon_m as ese','ese.id','=','pg.objecteselonfk')
            ->leftJoin('pendidikan_m as pend','pend.id', '=','pg.objectpendidikanterakhirfk')
            ->leftJoin('jeniskelamin_m as jk','jk.id','=','pg.objectjeniskelaminfk')
            ->leftJoin('sdm_golongan_m as gol','gol.id','=','pg.objectgolonganfk')
            ->leftJoin('nilaikelompokjabatan_m as nkj','nkj.id','=','pg.objectkelompokjabatanfk')
            ->leftJoin('sdm_kelompokshift_m as ks','ks.id','=','pg.objectshiftkerja')
            ->leftJoin('sdm_kedudukan_m as kdd','kdd.id','=','pg.kedudukanfk')
            ->leftJoin('kategorypegawai_m as kp','kp.id','=','pg.kategorypegawai')
            ->leftJoin('jenispegawai_m as jp','jp.id','=','pg.objectjenispegawaifk')
            ->leftJoin('ruangan_m as ru', 'ru.id','=', 'pg.objectruangankerjafk')
            ->leftJoin('petugasdiklat_m as petdik', 'petdik.id', '=', 'pg.objectpetugasdiklatfk')
            ->leftJoin('pangkatpolisi_m as pp', 'pp.id', '=', 'pg.objectpangkatpolisifk')
            ->select(\DB::raw("pg.*,ag.agama,dkp.detailkategorypegawai,gd.golongandarah,jb.namajabatan as jbfungsional,
			                        jb1.namajabatan as jbstruktural,gp.golonganpegawai,uk.name as unitkerja,sp.statuspegawai,
			                        kj.namakelompokjabatan,spp.statusperkawinan,ese.eselon,pend.pendidikan,jk.jeniskelamin,
			                        gol.name as golongan,nkj.detailkelompokjabatan,nkj.grade,ks.kelompokshiftkerja,
                                    kp.kategorypegawai as namakategorypegawai,kdd.name as kedudukan,pg.objectjenispegawaifk,jp.jenispegawai,
                                    ru.id as idruangan, ru.namaruangan, petdik.id as idpetdik, petdik.petugasdiklat, pp.id as id_pp, pp.namaexternal as pangkatpolisi"))
            ->where('pg.statusenabled',true)
            ->orderBy('pg.namalengkap');

        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $data = $data->where('pg.id','=',$request['idPegawai']);
        }
        $data = $data->get();

        $dataKeluarga=\DB::table('keluargapegawai_m as kp')
            ->leftJoin('pegawai_m as pg','pg.id','=','kp.objectpegawaifk')
            ->leftJoin('jeniskelamin_m as jk','jk.id','=','kp.objectjeniskelaminfk')
            ->leftJoin('hubungankeluarga_m as hk','hk.id','=','kp.objectkdhubunganfk')
            ->leftJoin('statusperkawinanpegawai_m as spp','spp.id','=','kp.objectstatusperkawinanpegawaifk')
            ->leftJoin('pendidikan_m as pend','pend.id','=','kp.objectpendidikanterakhirfk')
            ->leftJoin('pekerjaan_m as pe','pe.id','=','kp.objectpekerjaanfk')
            ->select(DB::raw("kp.*,pg.namalengkap as namapegawai,jk.jeniskelamin,hk.reportdisplay as hubungankeluarga,
	                          spp.statusperkawinan,pend.pendidikan,pe.pekerjaan"))
            ->where('pg.statusenabled',true)
            ->orderBy('pg.namalengkap');

        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $dataKeluarga = $dataKeluarga->where('pg.id','=',$request['idPegawai']);
        }
        $dataKeluarga = $dataKeluarga->get();

        $dataPendidikan=\DB::table('riwayatpendidikan_t as rp')
            ->leftJoin('pegawai_m as pg','pg.id','=','rp.objectpegawaifk')
            ->leftJoin('pendidikan_m as pend','pend.id','=','rp.objectpendidikanfk')
            ->select(DB::raw("rp.*,pend.pendidikan,pg.namalengkap"))
            ->where('pg.statusenabled',true)
            ->orderBy('rp.tgllulus');

        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $dataPendidikan = $dataPendidikan->where('pg.id','=',$request['idPegawai']);
        }
        $dataPendidikan = $dataPendidikan->get();

        $dataPelatihan=\DB::table('riwayatpelatihan_t as rpl')
            ->leftJoin('pegawai_m as pg','pg.id','=','rpl.objectpegawaifk')
            ->select(DB::raw("rpl.*,pg.namalengkap"))
            ->where('pg.statusenabled',true)
            ->orderBy('rpl.tglmulai');

        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $dataPelatihan = $dataPelatihan->where('pg.id','=',$request['idPegawai']);
        }
        $dataPelatihan = $dataPelatihan->get();

        $dataJabatan=\DB::table('riwayatjabatan_t as rj')
            ->leftJoin('jenisjabatan_m as jb','jb.id','=','rj.objectjenisjabatanfk')
            ->leftJoin('jabatan_m as jab','jab.id','=','rj.objectjabatanttdfk')
            ->leftJoin('pegawai_m as pg','pg.id','=','rj.objectpegawaifk')
            ->leftJoin('pegawai_m as pg1','pg1.id','=','rj.objectpegawaittdfk')
            ->select(DB::raw("rj.*,jb.jenisjabatan,jab.namajabatan as namajabatanttd,
			                  pg.namalengkap as namapegawai,pg1.namalengkap as pegawaittd,
			                  pg1.namalengkap || ' / ' || jab.namajabatan as pegawaipenanggungjawab"))
            ->where('pg.statusenabled',true)
            ->orderBy('rj.tglsk');
        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $dataJabatan = $dataJabatan->where('pg.id','=',$request['idPegawai']);
        }
        $dataJabatan = $dataJabatan->get();

        $dataSip=\DB::table('masaberlakusipstr_t as mbs')
            ->leftJoin('jenismasaberlakustrsip_m as jmb','jmb.id','=','mbs.jenismasaberlakufk')
            ->leftJoin('pegawai_m as pg','pg.id','=','mbs.pegawaifk')
            ->leftJoin('unitkerjapegawai_m as uk','uk.id','=','mbs.unitkerjafk')
            ->leftJoin('unitkerjapegawai_m as uk2','uk2.id','=','mbs.subunitkerjafk')
            ->select(DB::raw("mbs.*,jmb.jenismasaberlaku, pg.namalengkap as namapegawai, uk.name as unitkerja,
			                  uk2.name as subunit"))
            ->where('pg.statusenabled',true)
            ->where('mbs.jenismasaberlakufk',1)
            ->orderBy('mbs.tglberakhir');

        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $dataSip = $dataSip->where('pg.id','=',$request['idPegawai']);
        }
        $dataSip = $dataSip->get();

        $dataStr=\DB::table('masaberlakusipstr_t as mbs')
            ->leftJoin('jenismasaberlakustrsip_m as jmb','jmb.id','=','mbs.jenismasaberlakufk')
            ->leftJoin('pegawai_m as pg','pg.id','=','mbs.pegawaifk')
            ->leftJoin('unitkerjapegawai_m as uk','uk.id','=','mbs.unitkerjafk')
            ->leftJoin('unitkerjapegawai_m as uk2','uk2.id','=','mbs.subunitkerjafk')
            ->select(DB::raw("mbs.*,jmb.jenismasaberlaku, pg.namalengkap as namapegawai, uk.name as unitkerja,
			                  uk2.name as subunit"))
            ->where('pg.statusenabled',true)
            ->where('mbs.jenismasaberlakufk',2)
            ->orderBy('mbs.tglberakhir');

        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $dataStr = $dataStr->where('pg.id','=',$request['idPegawai']);
        }
        $dataStr = $dataStr->get();

        $dataTelp=\DB::table('nomortelphone_t as nt')
            ->leftJoin('jenisprovider_m as jp','jp.id','=','nt.providerfk')
            ->leftJoin('pegawai_m as pg','pg.id','=','nt.pegawaifk')
            ->select(DB::raw("nt.*,jp.namaprovider"))
            ->where('nt.statusenabled',true);
//            ->orderBy('mbs.tglberakhir');

        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $dataTelp = $dataTelp->where('pg.id','=',$request['idPegawai']);
        }
        $dataTelp = $dataTelp->get();

        $dataLogin=\DB::table('riwayatjabatan_t as rj')
            ->leftJoin('jenisjabatan_m as jb','jb.id','=','rj.objectjenisjabatanfk')
            ->leftJoin('jabatan_m as jab','jab.id','=','rj.objectjabatanttdfk')
            ->leftJoin('pegawai_m as pg','pg.id','=','rj.objectpegawaifk')
            ->leftJoin('pegawai_m as pg1','pg1.id','=','rj.objectpegawaittdfk')
            ->select(DB::raw("rj.*,jb.jenisjabatan,jab.namajabatan as namajabatanttd,
			                  pg.namalengkap as namapegawai,pg1.namalengkap as pegawaittd,
			                  pg1.namalengkap || ' / ' || jab.namajabatan as pegawaipenanggungjawab"))
            ->where('pg.statusenabled',true)
            ->orderBy('rj.tglsk');

        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $dataLogin = $dataLogin->where('pg.id','=',$request['idPegawai']);
        }
        $dataLogin = $dataLogin->get();

        $result = array(
            'datapegawai' => $data,
            'datakeluarga' => $dataKeluarga,
            'datapendidikan' => $dataPendidikan,
            'datapelatihan' => $dataPelatihan,
            'datajabatan' => $dataJabatan,
            'datasip'=> $dataSip,
            'datastr'=> $dataStr,
            'datatelp'=> $dataTelp,
            "createby : " => 'ea@epic',

        );
        return $this->respond($result);
    }

    public function getPajakPenghasilanPegawai (Request $request) {
        $data = \DB::table('pegawai_m as pg')
            ->leftJoin('agama_m as ag','ag.id','=','pg.objectagamafk')
            ->leftJoin('detailkategorypegawai_m as dkp','dkp.id','=','pg.objectdetailkategorypegawaifk ')
            ->leftJoin('golongandarah_m as gd','gd.id','=', 'pg.objectgolongandarahfk')
            ->leftJoin('jabatan_m as jb','jb.id','=','pg.objectjabatanfungsionalfk')
            ->leftJoin('jabatan_m as jb1','jb1.id', '=', 'pg.objectjabatanstrukturalfk')
            ->leftJoin('golonganpegawai_m as gp','gp.id','=', 'pg.objectgolonganpegawaifk')
            ->leftJoin('unitkerjapegawai_m as uk','uk.id','=','pg.objectunitkerjapegawaifk')
            ->leftJoin('statuspegawai_m as sp','sp.id','=','pg.objectstatuspegawaifk')
            ->leftJoin('kelompokjabatan_m as kj','kj.id','=','pg.objectkelompokjabatanfk')
            ->leftJoin('statusperkawinanpegawai_m as spp','spp.id','=','pg.objectstatusperkawinanpegawaifk')
            ->leftJoin('eselon_m as ese','ese.id','=','pg.objecteselonfk')
            ->leftJoin('pendidikan_m as pend','pend.id', '=','pg.objectpendidikanterakhirfk')
            ->leftJoin('jeniskelamin_m as jk','jk.id','=','pg.objectjeniskelaminfk')
            ->leftJoin('sdm_golongan_m as gol','gol.id','=','pg.objectgolonganfk')
            ->leftJoin('nilaikelompokjabatan_m as nkj','nkj.id','=','pg.objectkelompokjabatanfk')
            ->leftJoin('sdm_kelompokshift_m as ks','ks.id','=','pg.objectshiftkerja')
            ->leftJoin('sdm_kedudukan_m as kdd','kdd.id','=','pg.kedudukanfk')
            ->leftJoin('kategorypegawai_m as kp','kp.id','=','pg.kategorypegawai')
            ->leftJoin('pangkat_m as pkt','pkt.id','=','pg.objectpangkatfk')
            ->leftJoin('jenispegawai_m as jp','jp.id','=','pg.objectjenispegawaifk')
            ->leftJoin('ruangan_m as ru', 'ru.id','=', 'pg.objectruangankerjafk')
            ->leftJoin('petugasdiklat_m as petdik', 'petdik.id', '=', 'pg.objectpetugasdiklatfk')
            ->select(\DB::raw("pg.*,ag.agama,dkp.detailkategorypegawai,gd.golongandarah,jb.namajabatan as jbfungsional, pkt.namapangkat, pg.objectpangkatfk, pg.noidentitas, pg.nip, pg.nrp,
			                        jb1.namajabatan as jbstruktural,gp.golonganpegawai,uk.name as unitkerja,sp.statuspegawai,
			                        kj.namakelompokjabatan,spp.statusperkawinan,ese.eselon,pend.pendidikan,jk.jeniskelamin,
			                        gol.name as golongan,nkj.detailkelompokjabatan,nkj.grade,ks.kelompokshiftkerja,
                                    kp.kategorypegawai as namakategorypegawai,kdd.name as kedudukan,pg.objectjenispegawaifk,jp.jenispegawai,
                                    ru.id as idruangan, ru.namaruangan, petdik.id as idpetdik, petdik.petugasdiklat"))
            ->where('pg.statusenabled',true)
            ->orderBy('pg.namalengkap');

        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $data = $data->where('pg.id','=',$request['idPegawai']);
        }
        $data = $data->get();

        $dataPemotonganPajak=DB::table('pegawai_m as pg')
            ->Join('pemotonganpajak_t as ptp','ptp.objectpegawaifk','=','pg.id')
            ->select(DB::raw("ptp.id as ptpid, ptp.gpp, ptp.ti, ptp.ta, ptp.jgtk, ptp.tpp, ptp.tsf, ptp.tb, ptp.tk, ptp.tll, ptp.pttlyptdpg, ptp.jpb, ptp.bjbp, ptp.ipai, ptp.jp, ptp.jpn, ptp.jpnms, ptp.jpnuppp, ptp.ptkp, ptp.pkpsd, ptp.dpapkpsd, ptp.ppytdms, ptp.ppt, ptp.ppytdd, ptp.agt, ptp.apttlyptdpg, ptp.ppapkpsd, ptp.nomorsurat, ptp.masapp, ptp.nomor, ptp.sk, ptp.skt, ptp.shb, ptp.kodeop,ptp.pegawaitersebut"))
            ->where('pg.statusenabled',true);
            if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
                $dataPemotonganPajak = $dataPemotonganPajak->where('pg.id','=',$request['idPegawai']);
            }
            if(isset($request['tahunPajak']) && $request['tahunPajak']!="" && $request['tahunPajak']!="undefined"){
                $dataPemotonganPajak = $dataPemotonganPajak->where('ptp.tahunpajak','=',$request['tahunPajak']);
            }
        $dataPemotonganPajak = $dataPemotonganPajak->get();
        
        $dataBendahara=DB::table('pegawai_m as pg')
            ->select(DB::raw("pg.nama, pg.npwp, case when pg.nip IS NULL then pg.nrp else pg.nip end as nip"))
            ->where('pg.statusenabled',true)
            ->where('pg.id',25062);
            // if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            //     $dataPemotonganPajak = $dataPemotonganPajak->where('pg.id','=',$request['idPegawai']);
            // }
        $dataBendahara = $dataBendahara->get();

        $dataKeluarga=\DB::table('keluargapegawai_m as kp')
            ->leftJoin('pegawai_m as pg','pg.id','=','kp.objectpegawaifk')
            ->leftJoin('jeniskelamin_m as jk','jk.id','=','kp.objectjeniskelaminfk')
            ->leftJoin('hubungankeluarga_m as hk','hk.id','=','kp.objectkdhubunganfk')
            ->leftJoin('statusperkawinanpegawai_m as spp','spp.id','=','kp.objectstatusperkawinanpegawaifk')
            ->leftJoin('pendidikan_m as pend','pend.id','=','kp.objectpendidikanterakhirfk')
            ->leftJoin('pekerjaan_m as pe','pe.id','=','kp.objectpekerjaanfk')
            ->select(DB::raw("kp.*,pg.namalengkap as namapegawai,jk.jeniskelamin,hk.reportdisplay as hubungankeluarga,
	                          spp.statusperkawinan,pend.pendidikan,pe.pekerjaan"))
            ->where('pg.statusenabled',true)
            ->orderBy('pg.namalengkap');

        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $dataKeluarga = $dataKeluarga->where('pg.id','=',$request['idPegawai']);
        }
        $dataKeluarga = $dataKeluarga->get();

        $dataPendidikan=\DB::table('riwayatpendidikan_t as rp')
            ->leftJoin('pegawai_m as pg','pg.id','=','rp.objectpegawaifk')
            ->leftJoin('pendidikan_m as pend','pend.id','=','rp.objectpendidikanfk')
            ->select(DB::raw("rp.*,pend.pendidikan,pg.namalengkap"))
            ->where('pg.statusenabled',true)
            ->orderBy('rp.tgllulus');

        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $dataPendidikan = $dataPendidikan->where('pg.id','=',$request['idPegawai']);
        }
        $dataPendidikan = $dataPendidikan->get();

        $dataPelatihan=\DB::table('riwayatpelatihan_t as rpl')
            ->leftJoin('pegawai_m as pg','pg.id','=','rpl.objectpegawaifk')
            ->select(DB::raw("rpl.*,pg.namalengkap"))
            ->where('pg.statusenabled',true)
            ->orderBy('rpl.tglmulai');

        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $dataPelatihan = $dataPelatihan->where('pg.id','=',$request['idPegawai']);
        }
        $dataPelatihan = $dataPelatihan->get();

        $dataJabatan=\DB::table('riwayatjabatan_t as rj')
            ->leftJoin('jenisjabatan_m as jb','jb.id','=','rj.objectjenisjabatanfk')
            ->leftJoin('jabatan_m as jab','jab.id','=','rj.objectjabatanttdfk')
            ->leftJoin('pegawai_m as pg','pg.id','=','rj.objectpegawaifk')
            ->leftJoin('pegawai_m as pg1','pg1.id','=','rj.objectpegawaittdfk')
            ->select(DB::raw("rj.*,jb.jenisjabatan,jab.namajabatan as namajabatanttd,
			                  pg.namalengkap as namapegawai,pg1.namalengkap as pegawaittd,
			                  pg1.namalengkap + ' / ' + jab.namajabatan as pegawaipenanggungjawab"))
            ->where('pg.statusenabled',true)
            ->orderBy('rj.tglsk');
        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $dataJabatan = $dataJabatan->where('pg.id','=',$request['idPegawai']);
        }
        $dataJabatan = $dataJabatan->get();

        $dataSip=\DB::table('masaberlakusipstr_t as mbs')
            ->leftJoin('jenismasaberlakustrsip_m as jmb','jmb.id','=','mbs.jenismasaberlakufk')
            ->leftJoin('pegawai_m as pg','pg.id','=','mbs.pegawaifk')
            ->leftJoin('unitkerjapegawai_m as uk','uk.id','=','mbs.unitkerjafk')
            ->leftJoin('unitkerjapegawai_m as uk2','uk2.id','=','mbs.subunitkerjafk')
            ->select(DB::raw("mbs.*,jmb.jenismasaberlaku, pg.namalengkap as namapegawai, uk.name as unitkerja,
			                  uk2.name as subunit"))
            ->where('pg.statusenabled',true)
            ->where('mbs.jenismasaberlakufk',1)
            ->orderBy('mbs.tglberakhir');

        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $dataSip = $dataSip->where('pg.id','=',$request['idPegawai']);
        }
        $dataSip = $dataSip->get();

        $dataStr=\DB::table('masaberlakusipstr_t as mbs')
            ->leftJoin('jenismasaberlakustrsip_m as jmb','jmb.id','=','mbs.jenismasaberlakufk')
            ->leftJoin('pegawai_m as pg','pg.id','=','mbs.pegawaifk')
            ->leftJoin('unitkerjapegawai_m as uk','uk.id','=','mbs.unitkerjafk')
            ->leftJoin('unitkerjapegawai_m as uk2','uk2.id','=','mbs.subunitkerjafk')
            ->select(DB::raw("mbs.*,jmb.jenismasaberlaku, pg.namalengkap as namapegawai, uk.name as unitkerja,
			                  uk2.name as subunit"))
            ->where('pg.statusenabled',true)
            ->where('mbs.jenismasaberlakufk',2)
            ->orderBy('mbs.tglberakhir');

        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $dataStr = $dataStr->where('pg.id','=',$request['idPegawai']);
        }
        $dataStr = $dataStr->get();

        $dataTelp=\DB::table('nomortelphone_t as nt')
            ->leftJoin('jenisprovider_m as jp','jp.id','=','nt.providerfk')
            ->leftJoin('pegawai_m as pg','pg.id','=','nt.pegawaifk')
            ->select(DB::raw("nt.*,jp.namaprovider"))
            ->where('nt.statusenabled',true);
//            ->orderBy('mbs.tglberakhir');

        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $dataTelp = $dataTelp->where('pg.id','=',$request['idPegawai']);
        }
        $dataTelp = $dataTelp->get();

        $dataLogin=\DB::table('riwayatjabatan_t as rj')
            ->leftJoin('jenisjabatan_m as jb','jb.id','=','rj.objectjenisjabatanfk')
            ->leftJoin('jabatan_m as jab','jab.id','=','rj.objectjabatanttdfk')
            ->leftJoin('pegawai_m as pg','pg.id','=','rj.objectpegawaifk')
            ->leftJoin('pegawai_m as pg1','pg1.id','=','rj.objectpegawaittdfk')
            ->select(DB::raw("rj.*,jb.jenisjabatan,jab.namajabatan as namajabatanttd,
			                  pg.namalengkap as namapegawai,pg1.namalengkap as pegawaittd,
			                  pg1.namalengkap + ' / ' + jab.namajabatan as pegawaipenanggungjawab"))
            ->where('pg.statusenabled',true)
            ->orderBy('rj.tglsk');

        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $dataLogin = $dataLogin->where('pg.id','=',$request['idPegawai']);
        }
        $dataLogin = $dataLogin->get();

        $result = array(
            'datapegawai' => $data,
            'datakeluarga' => $dataKeluarga,
            'datapendidikan' => $dataPendidikan,
            'datapelatihan' => $dataPelatihan,
            'datajabatan' => $dataJabatan,
            'dataBendahara' => $dataBendahara,
            'datasip'=> $dataSip,
            'datapemotonganpajak' => $dataPemotonganPajak,
            'datastr'=> $dataStr,
            'datatelp'=> $dataTelp,
            "createby : " => 'ea@epic',

        );
        return $this->respond($result);
    }

    public function deleteDataPelatihan(Request $request){

        try {
            RiwayatPelatihan::where('norec', $request['norec'])->delete();
            $transMessage = "Sukses ";
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Hapus Data Pelatihan Gagal";
        }

        if ($transStatus != 'false') {

            \DB::commit();
            $result = array(

                "status" => 201,
                "message" => $transMessage,
                "as" => 'ridwan',
            );
        } else {
            DB::rollBack();
            $result = array(

                "status" => 400,
                "message" => $transMessage,
                "as" => 'ridwan',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getFotoProfileDefault(Request $request) {
        $data = \DB::table('jenissurat_m as js')
            ->select('js.*')
            ->where('id', $request['id'])
            ->get();

            return $this->respond($data);
    }
    public function deleteDataSeminar(Request $request){

        try {
            RiwayatSeminar::where('norec', $request['norec'])->delete();
            $transMessage = "Sukses ";
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Hapus Data Seminar Gagal";
        }

        if ($transStatus != 'false') {

            \DB::commit();
            $result = array(

                "status" => 201,
                "message" => $transMessage,
                "as" => 'ridwan',
            );
        } else {
            DB::rollBack();
            $result = array(

                "status" => 400,
                "message" => $transMessage,
                "as" => 'ridwan',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveDataRekamDataPegawai (Request $request) {
        \DB::beginTransaction();
        $tglAyeuna = date('Y-m-d H:i:s');
//        $dataLogin = $request->all();
//        $dataPegawai = \DB::table('loginuser_s as lu')
//            ->select('lu.objectpegawaifk')
//            ->where('lu.id',$dataLogin['userData']['id'])
//            ->first();
        // try{
            #region savePegawai
            $dataPegawai=$request['datapegawai'];
            $dataKeluargaPegawai=$request['datakeluarga'];
            $dataRiwayatPendidikan=$request['riwayatpendidikan'];
            $dataRiwayatPelatihan=$request['riwayatpelatihan'];
            $dataRIwayatJabatan=$request['riwayatjabatan'];
            $dataSip=$request['simpansip'];
            $dataStr=$request['simpanstr'];
            $dataTelp=$request['simpantelp'];
            $dataPhoto = $request['dataphoto'];
            
//            return $this->respond($dataKeluargaPegawai);


            if ($dataPegawai['id'] == '') {
                $idPegawai = Pegawai::max('id') +1 ;
                $dataSavePegawai = new Pegawai();
                $dataSavePegawai->id = $idPegawai;
                $dataSavePegawai->kdprofile = 11;
                $dataSavePegawai->statusenabled=1;
                $dataSavePegawai->norec = $dataSavePegawai->generateNewId();
                $dataSavePegawai->qpegawai=0;
                $dataSavePegawai->objectruangankerjafk = $dataPegawai['idruangan'];
            }else{
                $dataSavePegawai = Pegawai::where('id', $dataPegawai['id'])->first();
            }
            $dataSavePegawai->namalengkap = $dataPegawai['namalengkap'];
            $dataSavePegawai->nama = $dataPegawai['nama'];
            $dataSavePegawai->gelardepan = $dataPegawai['gelardepan'];
            $dataSavePegawai->gelarbelakang = $dataPegawai['gelarbelakang'];
            $dataSavePegawai->tempatlahir = $dataPegawai['tempatlahir'];
            $dataSavePegawai->bankrekeningnomor = $dataPegawai['nomorrekening'];
            $dataSavePegawai->bankrekeningatasnama = $dataPegawai['namarekening'];
            $dataSavePegawai->bankrekeningnama = $dataPegawai['namabank'];
            if (isset($dataPegawai['pangkatpolisifk'])) {
                $dataSavePegawai->objectpangkatpolisifk = $dataPegawai['pangkatpolisifk']; //$statusPasien;
            } 
            $dataSavePegawai->salary = $dataPegawai['salary'];

            $dataSavePegawai->bankrekeningnomordua = $dataPegawai['nomorrekening2'];
            $dataSavePegawai->bankrekeningatasnamadua = $dataPegawai['namarekening2'];
            $dataSavePegawai->bankrekeningnamadua = $dataPegawai['namabank2'];
            $dataSavePegawai->salarydua = $dataPegawai['salary2'];

            $dataSavePegawai->npwp = $dataPegawai['npwp'];
            $dataSavePegawai->nrp = $dataPegawai['nrp'];
            if (isset($dataPegawai['gpp'])  && $dataPegawai['gpp'] != "" && $dataPegawai['gpp'] != "undefined") {
                $dataSavePegawai->objectpajakpegawai = $dataPegawai['gpp']; //$statusPasien;
            } 
            $dataSavePegawai->nik_intern = $dataPegawai['nik'];
            $dataSavePegawai->noidentitas = $dataPegawai['nik'];
            $dataSavePegawai->nobpjs = $dataPegawai['nobpjs'];
            $dataSavePegawai->nocm = $dataPegawai['nocm'];
            if (isset($dataPegawai['golongandarah']) && $dataPegawai['golongandarah'] != "" && $dataPegawai['golongandarah'] != "undefined") {
                $dataSavePegawai->objectgolongandarahfk = $dataPegawai['golongandarah']; //$statusPasien;
            } 
            $dataSavePegawai->email = $dataPegawai['email'];
            // $dataSavePegawai->photo = $dataPegawai['foto'];
            if (isset($dataPegawai['foto'])){
                $dataSavePegawai->photo = $dataPegawai['foto'];
            }
            if (isset($dataPegawai['kodepos'])){
                $dataSavePegawai->kodepos = $dataPegawai['kodepos'];
            }
            if (isset($dataPegawai['poinjpt'])){
                $dataSavePegawai->poinjpt = $dataPegawai['poinjpt'];
            }
            // return($dataPegawai['dl']);
            // die();
            if (isset($dataPegawai['dl']) && $dataPegawai['dl']=="dl"){
                $dataSavePegawai->namaexternal = 'dl';
                // return('x');
                // die();
            }else{
                $dataSavePegawai->namaexternal = $dataPegawai['nama'];
                // return('c');
                // die();
            }
            $dataSavePegawai->alamat = $dataPegawai['alamat'];
            $dataSavePegawai->idfinger = $dataPegawai['idfinger'];
            $dataSavePegawai->nippns = $dataPegawai['nippns'];
            $dataSavePegawai->pensiun =  $dataPegawai['pensiun'];
            $dataSavePegawai->tgllahir = $dataPegawai['tgllahir'];
            $dataSavePegawai->tglmasuk = $dataPegawai['tglmasuk'];
            if (isset($dataPegawai['agama']) && $dataPegawai['agama'] != "" && $dataPegawai['agama'] != "undefined") {
                $dataSavePegawai->objectagamafk = $dataPegawai['agama']; //$statusPasien;
            } 
            if (isset($dataPegawai['jeniskelamin']) && $dataPegawai['jeniskelamin'] != "" && $dataPegawai['jeniskelamin'] != "undefined") {
                $dataSavePegawai->objectjeniskelaminfk = $dataPegawai['jeniskelamin']; //$statusPasien;
            } 
            $dataSavePegawai->kategorypegawai =  $dataPegawai['statuspegawai'];
            $dataSavePegawai->kedudukanfk=  $dataPegawai['kedudukan'];
            if (isset($dataPegawai['golongan']) && $dataPegawai['golongan'] != "" && $dataPegawai['golongan'] != "undefined") {
                $dataSavePegawai->objectgolonganfk = $dataPegawai['golongan']; //$statusPasien;
            } 
            if (isset($dataPegawai['jabatan']) && $dataPegawai['jabatan'] != "" && $dataPegawai['jabatan'] != "undefined") {
                $dataSavePegawai->objectjabatanfungsionalfk = $dataPegawai['jabatan']; //$statusPasien;
            } 
            if (isset($dataPegawai['pendidikan']) && $dataPegawai['pendidikan'] != "" && $dataPegawai['pendidikan'] != "undefined") {
                $dataSavePegawai->objectpendidikanterakhirfk=  $dataPegawai['pendidikan']; //$statusPasien;
            } 
            if (isset($dataPegawai['kelompokjabatan']) && $dataPegawai['kelompokjabatan'] != "" && $dataPegawai['kelompokjabatan'] != "undefined") {
                $dataSavePegawai->objectkelompokjabatanfk=  $dataPegawai['kelompokjabatan']; //$statusPasien;
            }
            if (isset($dataPegawai['statusperkawinan']) && $dataPegawai['agama'] != "" && $dataPegawai['agama'] != "undefined") {
                $dataSavePegawai->objectstatusperkawinanpegawaifk=  $dataPegawai['statusperkawinan']; //$statusPasien;
            } 
            if (isset($dataPegawai['eselon']) && $dataPegawai['eselon'] != "" && $dataPegawai['eselon'] != "undefined") {
                $dataSavePegawai->objecteselonfk=  $dataPegawai['eselon']; //$statusPasien;
            } 
            if (isset($dataPegawai['shiftkerja']) && $dataPegawai['shiftkerja'] != "" && $dataPegawai['shiftkerja'] != "undefined") {
                $dataSavePegawai->objectshiftkerja=  $dataPegawai['shiftkerja']; //$statusPasien;
            } 
            $dataSavePegawai->pensiun = $dataPegawai['pensiun'];
            $dataSavePegawai->nilaijabatan=  $dataPegawai['nilaijabatan'];
            $dataSavePegawai->grade = $dataPegawai['grade'];
            if (isset($dataPegawai['jenispegawai']) && $dataPegawai['jenispegawai'] != "" && $dataPegawai['jenispegawai'] != "undefined") {
                $dataSavePegawai->objectjenispegawaifk=  $dataPegawai['jenispegawai']; //$statusPasien;
            } 
            if (isset($dataPegawai['petugasdiklat']) && $dataPegawai['petugasdiklat'] != "" && $dataPegawai['petugasdiklat'] != "undefined") {
                $dataSavePegawai->objectpetugasdiklatfk=  $dataPegawai['petugasdiklat']; //$statusPasien;
            } 
            if (isset($dataPegawai['unitkerjafk']) && $dataPegawai['unitkerjafk'] != "" && $dataPegawai['unitkerjafk'] != "undefined") {
                $dataSavePegawai->objectunitkerjapegawaifk=  $dataPegawai['unitkerjafk']; //$statusPasien;
            } 
            $dataSavePegawai->objectruangankerjafk = $dataPegawai['idruangan'];
            $dataSavePegawai->nokta = $dataPegawai['nokta'];
            $dataSavePegawai->kta = $dataPegawai['kta'];
            if (isset($dataPegawai['tglmeninggal']) && $dataPegawai['tglmeninggal'] != 'Invalid date'){
                $dataSavePegawai->tanggalmeninggal = $dataPegawai['tglmeninggal'];
            }
            if (isset($dataPegawai['tglpensiun']) && $dataPegawai['tglpensiun'] != 'Invalid date'){
                $dataSavePegawai->tglpensiun = $dataPegawai['tglpensiun'];
            }
            if (isset($dataPegawai['tglkeluar']) && $dataPegawai['tglkeluar'] != 'Invalid date'){
                $dataSavePegawai->tglkeluar = $dataPegawai['tglkeluar'];
            }
            $dataSavePegawai->save();

            $IdPegawais=$dataPegawai['id'];
            if ($IdPegawais == ""){
                $IdPegawais = $idPegawai;
            }

            if ($dataKeluargaPegawai != ""){

                $dataSaveKeluarga = KeluargaPegawai::where('objectpegawaifk',$IdPegawais)
                    ->delete();

                foreach ($dataKeluargaPegawai as $item){

                    $idKeluarga = KeluargaPegawai::max('id') + 1;
                    $dataSaveKeluarga = new KeluargaPegawai();
                    $dataSaveKeluarga->id = $idKeluarga;
                    $dataSaveKeluarga->kdprofile = 11;
                    $dataSaveKeluarga->statusenabled=true;
                    $dataSaveKeluarga->norec = $dataSaveKeluarga->generateNewId();
                    $dataSaveKeluarga->objectpegawaifk = $IdPegawais;

                    $dataSaveKeluarga->alamat = $item['alamat'];
                    $dataSaveKeluarga->objectjeniskelaminfk = $item['objectjeniskelaminfk'];
                    $dataSaveKeluarga->keterangan = $item['keterangan'];
                    $dataSaveKeluarga->namaayah = $item['namaayah'];
                    $dataSaveKeluarga->namaibu = $item['namaibu'];
                    $dataSaveKeluarga->namalengkap = $item['namalengkap'];
                    $dataSaveKeluarga->nipistrisuami = $item['nipistrisuami'];
                    $dataSaveKeluarga->nosuratkuliah = $item['nosuratkuliah'];
                    $dataSaveKeluarga->objectkdhubunganfk = $item['objectkdhubunganfk'];
                    $dataSaveKeluarga->objectpekerjaanfk = $item['objectpekerjaanfk'];
                    $dataSaveKeluarga->objectstatusperkawinanpegawaifk = $item['objectstatusperkawinanpegawaifk'];
                    $dataSaveKeluarga->statustanggungan = $item['statustanggungan'];
                    $dataSaveKeluarga->tgllahir = $item['tgllahir'];
                    if (isset($item['tglsuratkuliah']) && $item['tglsuratkuliah'] != 'Invalid date'){
                        $dataSaveKeluarga->tglsuratkuliah = $item['tglsuratkuliah'];
                    }
                    if (isset($item['kartukeluarga'])){
                        $dataSaveKeluarga->kartukeluarga = $item['kartukeluarga'];
                    }
                    if (isset($item['ktp'])){
                        $dataSaveKeluarga->ktp = $item['ktp'];
                    }
                    $dataSaveKeluarga->statustanggunganfk = $item['statustanggunganfk'];
                    $dataSaveKeluarga->objectpendidikanterakhirfk = $item['objectpendidikanterakhirfk'];
                    $dataSaveKeluarga->save();
                }
            }
// return($dataRiwayatPendidikan);
// die();
            if ($dataRiwayatPendidikan != ""){
                foreach ($dataRiwayatPendidikan as $items){
                    if ($items['norec'] == ""){
                        $dataSavePendidikan = new RiwayatPendidikan();
                        $dataSavePendidikan->kdprofile = 11;
                        $dataSavePendidikan->statusenabled=1;
                        $dataSavePendidikan->norec = $dataSavePendidikan->generateNewId();
                        $dataSavePendidikan->objectpegawaifk = $IdPegawais;
                    }else{
                        $dataSavePendidikan = RiwayatPendidikan::where('norec', $items['norec'])
                            // ->where('objectpegawaifk',$items['objectpegawaifk'])
                            ->first();
                    }
                    $dataSavePendidikan->namatempatpendidikan = $items['namatempatpendidikan'];
                    $dataSavePendidikan->alamattempatpendidikan = $items['alamattempatpendidikan'];
                    $dataSavePendidikan->objectpendidikanfk =$items['objectpendidikanfk'];
                    $dataSavePendidikan->jurusan = $items['jurusan'];
                    $dataSavePendidikan->tglmasuk = $items['tglmasuk'];
                    $dataSavePendidikan->tgllulus = $items['tgllulus'];
                    $dataSavePendidikan->nilaiipk = $items['nilaiipk'];
                    $dataSavePendidikan->noijazah = $items['noijazah'];
                    $dataSavePendidikan->akreditasikampus = $items['akreditasikampus'];
                    // $dataSavePendidikan->ijazah = $items['ijazah'];
                    // $dataSavePendidikan->suratdikti = $items['dikti'];
                    if (isset($items['ijazah'])){
                        $dataSavePendidikan->ijazah = $items['ijazah'];
                    }
                    if (isset($items['suratdikti'])){
                        $dataSavePendidikan->suratdikti = $items['suratdikti'];
                    }
                    if (isset($items['akreditasi'])){
                        $dataSavePendidikan->akreditasi = $items['akreditasi'];
                    }
                    if (isset($items['tglijazah'])){
                        $dataSavePendidikan->tglijazah = $items['tglijazah'];
                    }
                    $dataSavePendidikan->save();
                }
            }

            if ($dataRiwayatPelatihan != ""){
                foreach ($dataRiwayatPelatihan as $itempend){
                    if ($itempend['norec'] == ""){
                        $dataSavePelatihan = new RiwayatPelatihan();
                        $dataSavePelatihan->kdprofile = 11;
                        $dataSavePelatihan->statusenabled=1;
                        $dataSavePelatihan->norec = $dataSavePelatihan->generateNewId();
                        $dataSavePelatihan->objectpegawaifk = $IdPegawais;
                    }else{
                        $dataSavePelatihan = RiwayatPelatihan::where('norec', $itempend['norec'])
                            ->where('objectpegawaifk',$IdPegawais)
                            ->first();
                    }
                    $dataSavePelatihan->instansipenyelenggara = $itempend['instansipenyelenggara'];
                    $dataSavePelatihan->namapelatihan = $itempend['namapelatihan'];
                    $dataSavePelatihan->lokasipelatihan =$itempend['lokasipelatihan'];
                    $dataSavePelatihan->tglmulai = $itempend['tglmulai'];
                    $dataSavePelatihan->tglakhir = $itempend['tglakhir'];
                    $dataSavePelatihan->skp = $itempend['skp'];
                    if (isset($itempend['durasi'])){
                        $dataSavePelatihan->durasi = $itempend['durasi'];
                    }
                    if (isset($itempend['nosertifikat'])){
                        $dataSavePelatihan->nosertifikat = $itempend['nosertifikat'];
                    }
                    if (isset($itempend['keterangan'])){
                        $dataSavePelatihan->keterangan = $itempend['keterangan'];
                    }
                    if (isset($itempend['sertifikat'])){
                        $dataSavePelatihan->sertifikat = $itempend['sertifikat'];
                    }
                    $dataSavePelatihan->save();
                }
            }

            if ($dataRIwayatJabatan != ""){
                foreach ($dataRIwayatJabatan as $hideung){
                    if ($hideung['norec'] == ""){
                        $dataSaveJabatan = new RiwayatJabatan();
                        $dataSaveJabatan->kdprofile = 11;
                        $dataSaveJabatan->statusenabled=1;
                        $dataSaveJabatan->norec = $dataSaveJabatan->generateNewId();
                        $dataSaveJabatan->objectpegawaifk = $IdPegawais;
                    }else{
                        $dataSaveJabatan = RiwayatJabatan::where('norec', $hideung['norec'])
                            ->where('objectpegawaifk',$IdPegawais)
                            ->first();
                    }
                    $dataSaveJabatan->objectjenisjabatanfk = $hideung['objectjenisjabatanfk'];
                    $dataSaveJabatan->objectjabatanfk = $hideung['objectjabatanfk'];
                    $dataSaveJabatan->namajabatan =$hideung['namajabatan'];
                    $dataSaveJabatan->nosk = $hideung['nosk'];
                    $dataSaveJabatan->tglsk = $hideung['tglsk'];
                    if (isset($hideung['objectpegawaittdfk'])){
                        $dataSaveJabatan->objectpegawaittdfk = $hideung['objectpegawaittdfk'];
                    }
                    if (isset($hideung['objectjabatanttdfk'])) {
                        $dataSaveJabatan->objectjabatanttdfk = $hideung['objectjabatanttdfk'];
                    }
                    if (isset($hideung['sprint'])) {
                        $dataSaveJabatan->sprint = $hideung['sprint'];
                    }
                    $dataSaveJabatan->save();
                }
            }

            if ($dataSip != ""){
                foreach ($dataSip as $hideungs){
                    if ($hideungs['norec'] == ""){
                        $dataSaveSip = new MasaBerlakuSipStr();
                        $dataSaveSip->kdprofile = 11;
                        $dataSaveSip->statusenabled=1;
                        $dataSaveSip->jenismasaberlakufk=1;
                        $dataSaveSip->norec = $dataSaveSip->generateNewId();
                        $dataSaveSip->pegawaifk = $IdPegawais;
                    }else{
                        $dataSaveSip = MasaBerlakuSipStr::where('norec', $hideungs['norec'])
                            ->where('pegawaifk',$IdPegawais)
                            ->first();
                    }
                    $dataSaveSip->unitkerjafk = $hideungs['unitkerjafk'];
                    $dataSaveSip->subunitkerjafk = $hideungs['subunitkerjafk'];
                    $dataSaveSip->nomor =$hideungs['nomor'];
                    $dataSaveSip->tglberakhir = $hideungs['tglberakhir'];
                    $dataSaveSip->save();
                }
            }

            if ($dataStr != ""){
                foreach ($dataStr as $hideungx){
                    if ($hideungx['norec'] == ""){
                        $dataSaveStr = new MasaBerlakuSipStr();
                        $dataSaveStr->kdprofile = 11;
                        $dataSaveStr->statusenabled=1;
                        $dataSaveStr->jenismasaberlakufk=2;
                        $dataSaveStr->norec = $dataSaveStr->generateNewId();
                        $dataSaveStr->pegawaifk = $IdPegawais;
                    }else{
                        $dataSaveStr = MasaBerlakuSipStr::where('norec', $hideungx['norec'])
                            ->where('pegawaifk',$IdPegawais)
                            ->first();
                    }
                    $dataSaveStr->unitkerjafk = $hideungx['unitkerjafk'];
                    $dataSaveStr->subunitkerjafk = $hideungx['subunitkerjafk'];
                    $dataSaveStr->nomor =$hideungx['nomor'];
                    $dataSaveStr->tglberakhir = $hideungx['tglberakhir'];
                    $dataSaveStr->save();
                }
            }

            if ($dataTelp != ""){
                foreach ($dataTelp as $hideungtelp){
                    if ($hideungtelp['norec'] == ""){
                        $dataSaveTelp = new NomorTelphonePegawai();
                        $dataSaveTelp->kdprofile = 11;
                        $dataSaveTelp->statusenabled=1;
                        $dataSaveTelp->norec = $dataSaveTelp->generateNewId();
                        $dataSaveTelp->pegawaifk = $IdPegawais;
                    }else{
                        $dataSaveTelp = NomorTelphonePegawai::where('norec', $hideungtelp['norec'])
                            ->where('pegawaifk',$IdPegawais)
                            ->first();
                    }
                    $dataSaveTelp->nomor = $hideungtelp['noTelp'];
                    $dataSaveTelp->providerfk = $hideungtelp['providerfk'];
                    $dataSaveTelp->save();
                }
            }
            if ($dataPhoto != "") {
                //cek udah masuk tabel ini atau belum
                if($dataPhoto[0]['id']==""){
                    $dataSavePhoto = new FotoPegawai();
                    $dataSavePhoto->norec = $dataSavePhoto->generateNewId();
                    $dataSavePhoto->kdprofile = 17;
                    $dataSavePhoto->statusenabled = 1;
                    $dataSavePhoto->objectpegawaifk = $IdPegawais;
                    $dataSavePhoto->foto =$dataPhoto[0]['foto'];
                    $dataSavePhoto->save();
                }else{
                    $cek = FotoPegawai::where('objectpegawaifk', $dataPhoto[0]['id'])
                        ->get();
                    foreach($dataPhoto as $auah) {
                        if (count($cek) == 0) {
                            if ($auah['foto'] != 'null') {
                                $dataSavePhoto = new FotoPegawai();
                                $dataSavePhoto->norec = $dataSavePhoto->generateNewId();
                                $dataSavePhoto->kdprofile = 17;
                                $dataSavePhoto->statusenabled = 1;
                                $dataSavePhoto->objectpegawaifk = $IdPegawais;
                                $dataSavePhoto->foto = $auah['foto'];
                                $dataSavePhoto->save();
                            }
                        } else {
                            $dataSavePhoto = FotoPegawai::where('objectpegawaifk', $auah['id'])
                                ->first();
                            $dataSavePhoto->foto = $auah['foto'];
                            $dataSavePhoto->save();
                        }
                        // if ($auah['foto'] != null) {
                        //     if ($auah['id'] == "") {
                        //         $dataSavePhoto = new FotoPegawai();
                        //         $dataSavePhoto->norec = $dataSavePhoto->generateNewId();
                        //         $dataSavePhoto->kdprofile = 17;
                        //         $dataSavePhoto->statusenabled = 1;
                        //         $dataSavePhoto->objectpegawaifk = $IdPegawais;
                        //     } else {
                        //         $dataSavePhoto = FotoPegawai::where('objectpegawaifk', $auah['id'])
                        //             ->first();
                        //     }
                        //     $dataSavePhoto->foto = $auah['foto'];
                        //     $dataSavePhoto->save();
                        // }
                    }
                }
            }

            //## Logging User
//                if ($dataPegawai['id'] == ""){
//                    $newId = LoggingUser::max('id');
//                    $newId = $newId +1;
//                    $logUser = new LoggingUser();
//                    $logUser->id = $newId;
//                    $logUser->norec = $logUser->generateNewId();
//                    $logUser->kdprofile= 0;
//                    $logUser->statusenabled=true;
//                    $logUser->jenislog = 'Tambah Master Pegawai';
//                    $logUser->noreff =$dataSavePegawai->id;
//                    $logUser->referensi='norec Verifikasi Direktur Terkait';
//                    $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
//                    $logUser->tanggal = $tglAyeuna;
//                    $logUser->save();
//                }else{
//                    $newId = LoggingUser::max('id');
//                    $newId = $newId +1;
//                    $logUser = new LoggingUser();
//                    $logUser->id = $newId;
//                    $logUser->norec = $logUser->generateNewId();
//                    $logUser->kdprofile= 0;
//                    $logUser->statusenabled=true;
//                    $logUser->jenislog = 'Edit Master Pegawai';
//                    $logUser->noreff =$dataSavePegawai->id;
//                    $logUser->referensi='norec Verifikasi Direktur Terkait';
//                    $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
//                    $logUser->tanggal = $tglAyeuna;
//                    $logUser->save();
//                }

            #endregion

            $transStatus = 'true';
        // } catch (\Exception $e) {
        //     $transStatus = 'false';
        //     $transMessage = "Simpan Gagal";
        // }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "idpegawai" => $IdPegawais,
                "datapegawai" => $dataSavePegawai,
                "datakeluarga" => $dataKeluargaPegawai,
                "datapendidian" => $dataRiwayatPendidikan,
                "datapelatihan" => $dataRiwayatPelatihan,
                "datajabatan" => $dataRIwayatJabatan,
                'datasip' => $dataSip,
                'datastr' => $dataStr,
                'datatelp' =>$dataTelp,
                "as" => 'ea@epic',
            );
        } else {
            $transMessage = "Simpan Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
//                "idpegawai" => $IdPegawais,
                "datapegawai" => $dataSavePegawai,
                "datakeluarga" => $dataKeluargaPegawai,
                "datapendidian" => $dataRiwayatPendidikan,
                "datapelatihan" => $dataRiwayatPelatihan,
                "datajabatan" => $dataRIwayatJabatan,
                'datasip' => $dataSip,
                'datastr' => $dataStr,
                "as" => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveDataRekamDataPajakPenghasilan (Request $request) {
        \DB::beginTransaction();
        $tglAyeuna = date('Y-m-d H:i:s');
//        $dataLogin = $request->all();
//        $dataPegawai = \DB::table('loginuser_s as lu')
//            ->select('lu.objectpegawaifk')
//            ->where('lu.id',$dataLogin['userData']['id'])
//            ->first();
// return($request['datapegawai']);
// die();
        try{
            #region savePegawai
            $dataPegawai=$request['datapegawai'];
            $dataPemotonganPajak=$request['datapemotonganpajak'];
            $dataKeluargaPegawai=$request['datakeluarga'];
            $dataRiwayatPendidikan=$request['riwayatpendidikan'];
            $dataRiwayatPelatihan=$request['riwayatpelatihan'];
            $dataRIwayatJabatan=$request['riwayatjabatan'];
            $dataSip=$request['simpansip'];
            // $noIdentitas=$request['noidentitas'];
            $dataStr=$request['simpanstr'];
            $dataTelp=$request['simpantelp'];
//            return $this->respond($dataKeluargaPegawai);

// return($dataPemotonganPajak['ptpid']);
// die();

            // return($dataPegawai['nrp']);
            // die();
            if ($dataPegawai['id'] == '') {
                $idPegawai = Pegawai::max('id') +1 ;
                $dataSavePegawai = new Pegawai();
                $dataSavePegawai->id = $idPegawai;
                $dataSavePegawai->kdprofile = 11;
                $dataSavePegawai->statusenabled=1;
                $dataSavePegawai->norec = $dataSavePegawai->generateNewId();
                $dataSavePegawai->qpegawai=0;
                $dataSavePegawai->objectruangankerjafk = $dataPegawai['idruangan'];
            }else{
                $dataSavePegawai = Pegawai::where('id', $dataPegawai['id'])->first();
            }
            $dataSavePegawai->namalengkap = $dataPegawai['namalengkap'];
            $dataSavePegawai->nama = $dataPegawai['nama'];
            $dataSavePegawai->gelardepan = $dataPegawai['gelardepan'];
            $dataSavePegawai->gelarbelakang = $dataPegawai['gelarbelakang'];
            $dataSavePegawai->objectpangkatfk = $dataPegawai['pangkatpegawai'];
            $dataSavePegawai->tempatlahir = $dataPegawai['tempatlahir'];
            $dataSavePegawai->bankrekeningnomor = $dataPegawai['nomorrekening'];
            $dataSavePegawai->bankrekeningatasnama = $dataPegawai['namarekening'];
            $dataSavePegawai->bankrekeningnama = $dataPegawai['namabank'];
            $dataSavePegawai->salary = $dataPegawai['salary'];
            $dataSavePegawai->npwp = $dataPegawai['npwp'];
            if (isset($dataPegawai['kodepos'])){
                $dataSavePegawai->kodepos = $dataPegawai['kodepos'];
            }
            if (isset($dataPegawai['poinjpt'])){
                $dataSavePegawai->poinjpt = $dataPegawai['poinjpt'];
            }
            $dataSavePegawai->alamat = $dataPegawai['alamat'];
            $dataSavePegawai->idfinger = $dataPegawai['idfinger'];
            // $dataSavePegawai->nippns = $dataPegawai['nippns'];
            $dataSavePegawai->noidentitas = $dataPegawai['noidentitas'];
            $dataSavePegawai->pensiun =  $dataPegawai['pensiun'];
            $dataSavePegawai->tgllahir = $dataPegawai['tgllahir'];
            $dataSavePegawai->tglmasuk = $dataPegawai['tglmasuk'];
            $dataSavePegawai->nip = $dataPegawai['nip'];
            $dataSavePegawai->nrp = $dataPegawai['nrp'];
            $dataSavePegawai->objectagamafk = $dataPegawai['agama'];
            $dataSavePegawai->objectjeniskelaminfk= $dataPegawai['jeniskelamin'];
            $dataSavePegawai->kategorypegawai =  $dataPegawai['statuspegawai'];
            $dataSavePegawai->kedudukanfk=  $dataPegawai['kedudukan'];
            $dataSavePegawai->objectgolonganfk=  $dataPegawai['golongan'];
            $dataSavePegawai->objectjabatanfungsionalfk= $dataPegawai['jabatan'];
            $dataSavePegawai->objectpendidikanterakhirfk=  $dataPegawai['pendidikan'];
            $dataSavePegawai->objectjabatanstrukturalfk=  $dataPegawai['kelompokjabatan'];
            // $dataSavePegawai->objectkelompokjabatanfk=  $dataPegawai['kelompokjabatan'];
            $dataSavePegawai->objectstatusperkawinanpegawaifk= $dataPegawai['statusperkawinan'];
            $dataSavePegawai->objecteselonfk=  $dataPegawai['eselon'];
            $dataSavePegawai->objectshiftkerja=  $dataPegawai['shiftkerja'];
            $dataSavePegawai->pensiun = $dataPegawai['pensiun'];
            $dataSavePegawai->nilaijabatan=  $dataPegawai['nilaijabatan'];
            $dataSavePegawai->grade = $dataPegawai['grade'];
            $dataSavePegawai->objectjenispegawaifk = $dataPegawai['jenispegawai'];
            $dataSavePegawai->objectpetugasdiklatfk = $dataPegawai['petugasdiklat'];
            $dataSavePegawai->objectunitkerjapegawaifk = $dataPegawai['unitkerjafk'];
            $dataSavePegawai->objectruangankerjafk = $dataPegawai['idruangan'];
            if (isset($dataPegawai['tglmeninggal']) && $dataPegawai['tglmeninggal'] != 'Invalid date'){
                $dataSavePegawai->tanggalmeninggal = $dataPegawai['tglmeninggal'];
            }
            if (isset($dataPegawai['tglpensiun']) && $dataPegawai['tglpensiun'] != 'Invalid date'){
                $dataSavePegawai->tglpensiun = $dataPegawai['tglpensiun'];
            }
            if (isset($dataPegawai['tglkeluar']) && $dataPegawai['tglkeluar'] != 'Invalid date'){
                $dataSavePegawai->tglkeluar = $dataPegawai['tglkeluar'];
            }
            $dataSavePegawai->save();

            $IdPegawais=$dataPegawai['id'];
            if ($IdPegawais == ""){
                $IdPegawais = $idPegawai;
            }

            if ($dataKeluargaPegawai != ""){

                $dataSaveKeluarga = KeluargaPegawai::where('objectpegawaifk',$IdPegawais)
                    ->delete();

                foreach ($dataKeluargaPegawai as $item){

                    $idKeluarga = KeluargaPegawai::max('id') + 1;
                    $dataSaveKeluarga = new KeluargaPegawai();
                    $dataSaveKeluarga->id = $idKeluarga;
                    $dataSaveKeluarga->kdprofile = 11;
                    $dataSaveKeluarga->statusenabled=true;
                    $dataSaveKeluarga->norec = $dataSaveKeluarga->generateNewId();
                    $dataSaveKeluarga->objectpegawaifk = $IdPegawais;

                    $dataSaveKeluarga->alamat = $item['alamat'];
                    $dataSaveKeluarga->objectjeniskelaminfk = $item['objectjeniskelaminfk'];
                    $dataSaveKeluarga->keterangan = $item['keterangan'];
                    $dataSaveKeluarga->namaayah = $item['namaayah'];
                    $dataSaveKeluarga->namaibu = $item['namaibu'];
                    $dataSaveKeluarga->namalengkap = $item['namalengkap'];
                    $dataSaveKeluarga->nipistrisuami = $item['nipistrisuami'];
                    $dataSaveKeluarga->nosuratkuliah = $item['nosuratkuliah'];
                    $dataSaveKeluarga->objectkdhubunganfk = $item['objectkdhubunganfk'];
                    $dataSaveKeluarga->objectpekerjaanfk = $item['objectpekerjaanfk'];
                    $dataSaveKeluarga->objectstatusperkawinanpegawaifk = $item['objectstatusperkawinanpegawaifk'];
                    $dataSaveKeluarga->statustanggungan = $item['statustanggungan'];
                    $dataSaveKeluarga->tgllahir = $item['tgllahir'];
                    if (isset($item['tglsuratkuliah']) && $item['tglsuratkuliah'] != 'Invalid date'){
                        $dataSaveKeluarga->tglsuratkuliah = $item['tglsuratkuliah'];
                    }
                    $dataSaveKeluarga->statustanggunganfk = $item['statustanggunganfk'];
                    $dataSaveKeluarga->objectpendidikanterakhirfk = $item['objectpendidikanterakhirfk'];
                    $dataSaveKeluarga->save();
                }
            }

            // return($dataPemotonganPajak['pegawaitersebut']);
            // die();

            if ($dataPemotonganPajak['ptpid'] == '') {
                $idPegawaiPajak = PemotonganPajak::max('id') +1 ;
                $dataSavePemotonganPajak = new PemotonganPajak();
                $dataSavePemotonganPajak->id = $idPegawaiPajak;
                $dataSavePemotonganPajak->statusenabled=true;
                // return($dataPemotonganPajak['gpp']);
                // die();
                $dataSavePemotonganPajak->norec = $dataSavePemotonganPajak->generateNewId();
            }else{
                // return($dataPemotonganPajak);
                // die();
                $dataSavePemotonganPajak = PemotonganPajak::where('id', $dataPemotonganPajak['ptpid'])->first();
            }
            $dataSavePemotonganPajak->gpp = $dataPemotonganPajak['gpp'];
            $dataSavePemotonganPajak->ti = $dataPemotonganPajak['ti'];
            $dataSavePemotonganPajak->ta = $dataPemotonganPajak['ta'];
            $dataSavePemotonganPajak->jgtk = $dataPemotonganPajak['jgtk'];
            $dataSavePemotonganPajak->tpp = $dataPemotonganPajak['tpp'];
            $dataSavePemotonganPajak->tsf = $dataPemotonganPajak['tsf'];
            $dataSavePemotonganPajak->tb = $dataPemotonganPajak['tb'];
            $dataSavePemotonganPajak->tk = $dataPemotonganPajak['tk'];
            $dataSavePemotonganPajak->tll = $dataPemotonganPajak['tll'];
            $dataSavePemotonganPajak->pttlyptdpg = $dataPemotonganPajak['pttlyptdpg'];
            $dataSavePemotonganPajak->jpb = $dataPemotonganPajak['jpb'];
            $dataSavePemotonganPajak->bjbp = $dataPemotonganPajak['bjbp'];
            $dataSavePemotonganPajak->ipai = $dataPemotonganPajak['ipai'];
            $dataSavePemotonganPajak->jp = $dataPemotonganPajak['jp'];
            $dataSavePemotonganPajak->objectpegawaifk = $dataPegawai['id'];
            $dataSavePemotonganPajak->jpn = $dataPemotonganPajak['jpn'];
            $dataSavePemotonganPajak->jpnms = $dataPemotonganPajak['jpnms'];
            $dataSavePemotonganPajak->jpnuppp = $dataPemotonganPajak['jpnuppp'];
            $dataSavePemotonganPajak->ptkp = $dataPemotonganPajak['ptkp'];
            $dataSavePemotonganPajak->pkpsd = $dataPemotonganPajak['pkpsd'];
            $dataSavePemotonganPajak->dpapkpsd = $dataPemotonganPajak['dpapkpsd'];
            $dataSavePemotonganPajak->ppytdms = $dataPemotonganPajak['ppytdms'];
            $dataSavePemotonganPajak->ppt = $dataPemotonganPajak['ppt'];
            $dataSavePemotonganPajak->ppytdd = $dataPemotonganPajak['ppytdd'];
            $dataSavePemotonganPajak->agt = $dataPemotonganPajak['agt'];
            $dataSavePemotonganPajak->apttlyptdpg = $dataPemotonganPajak['apttlyptdpg'];
            $dataSavePemotonganPajak->ppapkpsd = $dataPemotonganPajak['ppapkpsd'];

            $dataSavePemotonganPajak->nomorsurat = $dataPemotonganPajak['nomorsurat'];
            $dataSavePemotonganPajak->masapp = $dataPemotonganPajak['masapp'];
            $dataSavePemotonganPajak->nomor = $dataPemotonganPajak['nomor'];
            $dataSavePemotonganPajak->sk = $dataPemotonganPajak['sk'];
            $dataSavePemotonganPajak->skt = $dataPemotonganPajak['skt'];
            $dataSavePemotonganPajak->shb = $dataPemotonganPajak['shb'];
            $dataSavePemotonganPajak->kodeop = $dataPemotonganPajak['kodeop'];
            $dataSavePemotonganPajak->pegawaitersebut = $dataPemotonganPajak['pegawaitersebut'];
            $dataSavePemotonganPajak->tglttd = $dataPemotonganPajak['tglttd'];
            $dataSavePemotonganPajak->tahunpajak = $dataPemotonganPajak['tahunpajak']; 
            // $dataSavePemotonganPajak->ttd = $dataPemotonganPajak['ttd'];

            $dataSavePemotonganPajak->save();

            if ($dataRiwayatPendidikan != ""){
                foreach ($dataRiwayatPendidikan as $items){
                    if ($items['norec'] == ""){
                        $dataSavePendidikan = new RiwayatPendidikan();
                        $dataSavePendidikan->kdprofile = 11;
                        $dataSavePendidikan->statusenabled=1;
                        $dataSavePendidikan->norec = $dataSavePendidikan->generateNewId();
                        $dataSavePendidikan->objectpegawaifk = $IdPegawais;
                    }else{
                        $dataSavePendidikan = RiwayatPendidikan::where('norec', $items['norec'])
                            ->where('objectpegawaifk',$IdPegawais)
                            ->first();
                    }
                    $dataSavePendidikan->namatempatpendidikan = $items['namatempatpendidikan'];
                    $dataSavePendidikan->alamattempatpendidikan = $items['alamattempatpendidikan'];
                    $dataSavePendidikan->objectpendidikanfk =$items['objectpendidikanfk'];
                    $dataSavePendidikan->jurusan = $items['jurusan'];
                    $dataSavePendidikan->tglmasuk = $items['tglmasuk'];
                    $dataSavePendidikan->tgllulus = $items['tgllulus'];
                    $dataSavePendidikan->nilaiipk = $items['nilaiipk'];
                    $dataSavePendidikan->noijazah = $items['noijazah'];
                    if (isset($items['tglijazah'])){
                        $dataSavePendidikan->tglijazah = $items['tglijazah'];
                    }
                    $dataSavePendidikan->save();
                }
            }

            if ($dataRiwayatPelatihan != ""){
                foreach ($dataRiwayatPelatihan as $itempend){
                    if ($itempend['norec'] == ""){
                        $dataSavePelatihan = new RiwayatPelatihan();
                        $dataSavePelatihan->kdprofile = 11;
                        $dataSavePelatihan->statusenabled=1;
                        $dataSavePelatihan->norec = $dataSavePelatihan->generateNewId();
                        $dataSavePelatihan->objectpegawaifk = $IdPegawais;
                    }else{
                        $dataSavePelatihan = RiwayatPelatihan::where('norec', $itempend['norec'])
                            ->where('objectpegawaifk',$IdPegawais)
                            ->first();
                    }
                    $dataSavePelatihan->instansipenyelenggara = $itempend['instansipenyelenggara'];
                    $dataSavePelatihan->namapelatihan = $itempend['namapelatihan'];
                    $dataSavePelatihan->lokasipelatihan =$itempend['lokasipelatihan'];
                    $dataSavePelatihan->tglmulai = $itempend['tglmulai'];
                    $dataSavePelatihan->tglakhir = $itempend['tglakhir'];
                    if (isset($itempend['durasi'])){
                        $dataSavePelatihan->durasi = $itempend['durasi'];
                    }
                    if (isset($itempend['nosertifikat'])){
                        $dataSavePelatihan->nosertifikat = $itempend['nosertifikat'];
                    }
                    if (isset($itempend['keterangan'])){
                        $dataSavePelatihan->keterangan = $itempend['keterangan'];
                    }
                    $dataSavePelatihan->save();
                }
            }

            if ($dataRIwayatJabatan != ""){
                foreach ($dataRIwayatJabatan as $hideung){
                    if ($hideung['norec'] == ""){
                        $dataSaveJabatan = new RiwayatJabatan();
                        $dataSaveJabatan->kdprofile = 11;
                        $dataSaveJabatan->statusenabled=1;
                        $dataSaveJabatan->norec = $dataSaveJabatan->generateNewId();
                        $dataSaveJabatan->objectpegawaifk = $IdPegawais;
                    }else{
                        $dataSaveJabatan = RiwayatJabatan::where('norec', $hideung['norec'])
                            ->where('objectpegawaifk',$IdPegawais)
                            ->first();
                    }
                    $dataSaveJabatan->objectjenisjabatanfk = $hideung['objectjenisjabatanfk'];
                    $dataSaveJabatan->objectjabatanfk = $hideung['objectjabatanfk'];
                    $dataSaveJabatan->namajabatan =$hideung['namajabatan'];
                    $dataSaveJabatan->nosk = $hideung['nosk'];
                    $dataSaveJabatan->tglsk = $hideung['tglsk'];
                    if (isset($hideung['objectpegawaittdfk'])){
                        $dataSaveJabatan->objectpegawaittdfk = $hideung['objectpegawaittdfk'];
                    }
                    if (isset($hideung['objectjabatanttdfk'])) {
                        $dataSaveJabatan->objectjabatanttdfk = $hideung['objectjabatanttdfk'];
                    }
                    $dataSaveJabatan->save();
                }
            }

            if ($dataSip != ""){
                foreach ($dataSip as $hideungs){
                    if ($hideungs['norec'] == ""){
                        $dataSaveSip = new MasaBerlakuSipStr();
                        $dataSaveSip->kdprofile = 11;
                        $dataSaveSip->statusenabled=1;
                        $dataSaveSip->jenismasaberlakufk=1;
                        $dataSaveSip->norec = $dataSaveSip->generateNewId();
                        $dataSaveSip->pegawaifk = $IdPegawais;
                    }else{
                        $dataSaveSip = MasaBerlakuSipStr::where('norec', $hideungs['norec'])
                            ->where('pegawaifk',$IdPegawais)
                            ->first();
                    }
                    $dataSaveSip->unitkerjafk = $hideungs['unitkerjafk'];
                    $dataSaveSip->subunitkerjafk = $hideungs['subunitkerjafk'];
                    $dataSaveSip->nomor =$hideungs['nomor'];
                    $dataSaveSip->tglberakhir = $hideungs['tglberakhir'];
                    $dataSaveSip->save();
                }
            }

            if ($dataStr != ""){
                foreach ($dataStr as $hideungx){
                    if ($hideungx['norec'] == ""){
                        $dataSaveStr = new MasaBerlakuSipStr();
                        $dataSaveStr->kdprofile = 11;
                        $dataSaveStr->statusenabled=1;
                        $dataSaveStr->jenismasaberlakufk=2;
                        $dataSaveStr->norec = $dataSaveStr->generateNewId();
                        $dataSaveStr->pegawaifk = $IdPegawais;
                    }else{
                        $dataSaveStr = MasaBerlakuSipStr::where('norec', $hideungx['norec'])
                            ->where('pegawaifk',$IdPegawais)
                            ->first();
                    }
                    $dataSaveStr->unitkerjafk = $hideungx['unitkerjafk'];
                    $dataSaveStr->subunitkerjafk = $hideungx['subunitkerjafk'];
                    $dataSaveStr->nomor =$hideungx['nomor'];
                    $dataSaveStr->tglberakhir = $hideungx['tglberakhir'];
                    $dataSaveStr->save();
                }
            }

            if ($dataTelp != ""){
                foreach ($dataTelp as $hideungtelp){
                    if ($hideungtelp['norec'] == ""){
                        $dataSaveTelp = new NomorTelphonePegawai();
                        $dataSaveTelp->kdprofile = 11;
                        $dataSaveTelp->statusenabled=1;
                        $dataSaveTelp->norec = $dataSaveTelp->generateNewId();
                        $dataSaveTelp->pegawaifk = $IdPegawais;
                    }else{
                        $dataSaveTelp = NomorTelphonePegawai::where('norec', $hideungtelp['norec'])
                            ->where('pegawaifk',$IdPegawais)
                            ->first();
                    }
                    $dataSaveTelp->nomor = $hideungtelp['noTelp'];
                    $dataSaveTelp->providerfk = $hideungtelp['providerfk'];
                    $dataSaveTelp->save();
                }
            }

            //## Logging User
//                if ($dataPegawai['id'] == ""){
//                    $newId = LoggingUser::max('id');
//                    $newId = $newId +1;
//                    $logUser = new LoggingUser();
//                    $logUser->id = $newId;
//                    $logUser->norec = $logUser->generateNewId();
//                    $logUser->kdprofile= 0;
//                    $logUser->statusenabled=true;
//                    $logUser->jenislog = 'Tambah Master Pegawai';
//                    $logUser->noreff =$dataSavePegawai->id;
//                    $logUser->referensi='norec Verifikasi Direktur Terkait';
//                    $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
//                    $logUser->tanggal = $tglAyeuna;
//                    $logUser->save();
//                }else{
//                    $newId = LoggingUser::max('id');
//                    $newId = $newId +1;
//                    $logUser = new LoggingUser();
//                    $logUser->id = $newId;
//                    $logUser->norec = $logUser->generateNewId();
//                    $logUser->kdprofile= 0;
//                    $logUser->statusenabled=true;
//                    $logUser->jenislog = 'Edit Master Pegawai';
//                    $logUser->noreff =$dataSavePegawai->id;
//                    $logUser->referensi='norec Verifikasi Direktur Terkait';
//                    $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
//                    $logUser->tanggal = $tglAyeuna;
//                    $logUser->save();
//                }

            #endregion

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
                "idpegawai" => $IdPegawais,
                "datapegawai" => $dataSavePegawai,
                "datapemotonganpajak" => $dataPemotonganPajak,
                "datakeluarga" => $dataKeluargaPegawai,
                "datapendidian" => $dataRiwayatPendidikan,
                "datapelatihan" => $dataRiwayatPelatihan,
                "datajabatan" => $dataRIwayatJabatan,
                'datasip' => $dataSip,
                'datastr' => $dataStr,
                'datatelp' =>$dataTelp,
                "as" => 'ea@epic',
            );
        } else {
            $transMessage = "Simpan Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
//                "idpegawai" => $IdPegawais,
                "datapegawai" => $dataSavePegawai,
                "datapemotonganpajak" => $dataPemotonganPajak,
                "datakeluarga" => $dataKeluargaPegawai,
                "datapendidian" => $dataRiwayatPendidikan,
                "datapelatihan" => $dataRiwayatPelatihan,
                "datajabatan" => $dataRIwayatJabatan,
                'datasip' => $dataSip,
                'datastr' => $dataStr,
                "as" => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDataDaftarUrutKepangkatan (Request $request) {
        $data = \DB::table('pegawai_m as pg')
            ->leftJoin('jenispegawai_m as jp','jp.id','=','pg.objectjenispegawaifk')
            ->leftJoin('pangkat_m as pk','pk.id','=','pg.objectpangkatfk')
            ->leftJoin('jabatan_m as jb','jb.id','=','pg.objectjabatanfungsionalfk')
            ->leftJoin('sdm_golongan_m as sg','sg.id','=','pg.objectgolonganfk')
            ->select(\DB::raw("pg.id as pegawaiid,pg.namalengkap,pg.tempatlahir,pg.tgllahir,pg.nippns,
                             pg.objectjenispegawaifk,jp.jenispegawai,pg.objectpangkatfk,
                             pk.namapangkat,pg.objectjabatanfungsionalfk,jb.namajabatan,
                             pg.objectgolonganfk,sg.reportdisplay as golongan"))
            ->where('pg.statusenabled',true)
            ->where('pg.kdprofile',11);

        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $data = $data->where('pg.id','=',$request['idPegawai']);
        }

        if(isset($request['idJenisPegawai']) && $request['idJenisPegawai']!="" && $request['idJenisPegawai']!="undefined"){
            $data = $data->where('pg.objectjenispegawaifk','=',$request['idJenisPegawai']);
        }

        if(isset($request['idPangkatPe']) && $request['idPangkatPe']!="" && $request['idPangkatPe']!="undefined"){
            $data = $data->where('pg.objectpangkatfk','=',$request['idPangkatPe']);
        }

        $data = $data->orderBy('pg.namalengkap');
        $data = $data->get();
        $result = array(
            'data'  => $data,
            'as' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getDataJadwalKerjaRuangan (Request $request) {
        $data = \DB::table('pegawaijadwalkerja_m as pjk')
            ->leftJoin('pegawai_m as pg','pg.id','=','pjk.objectpegawaifk')
            ->leftJoin('ruangan_m as ru','ru.id','=','pjk.objectruanganfk')
            ->leftJoin('shiftkerja_m as sf','sf.id','=','pjk.objectshiftfk')
            ->leftJoin('kalender_s as kln','kln.id','=','pjk.objecttanggalfk')
            ->select(\DB::raw("pjk.*,pg.namalengkap,ru.namaruangan,sf.namashift,sf.jammasuk,sf.jampulang,kln.reportdisplay"))
            ->where('pg.statusenabled',true)
            ->where('pg.kdprofile',11);

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pjk.tgljadwal', '>=', $request['tglAwal']);
        }

        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];//." 23:59:59";
            $data = $data->where('pjk.tgljadwal', '<=', $tgl);
        }

        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $data = $data->where('pjk.objectpegawaifk','=',$request['idPegawai']);
        }

        if(isset($request['idRuangan']) && $request['idRuangan']!="" && $request['idRuangan']!="undefined"){
            $data = $data->where('pjk.objectruanganfk','=',$request['idRuangan']);
        }

        $data = $data->orderBy('pg.namalengkap');
        $data = $data->get();
        $result = array(
            'data'  => $data,
            'as' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getDataSip (Request $request) {
        $data = \DB::table('masaberlakusipstr_t as mbs')
            ->leftJoin('jenismasaberlakustrsip_m as jmb','jmb.id','=','mbs.jenismasaberlakufk')
            ->leftJoin('pegawai_m as pg','pg.id','=','mbs.pegawaifk')
            ->leftJoin('unitkerjapegawai_m as uk','uk.id','=','pg.objectunitkerjapegawaifk')
            ->leftJoin('unitkerjapegawai_m as uk2','uk2.id','=','mbs.subunitkerjafk')
            ->leftJoin('jenispegawai_m as jsp','jsp.id','=','pg.objectjenispegawaifk')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pg.objectruangankerjafk')
            ->select(\DB::raw("pg.nippns, mbs.*,jmb.jenismasaberlaku, pg.namalengkap as namapegawai,pg.nip_pns as nipPns, uk.name as unitkerja,
			                  uk2.name as subunit,jsp.jenispegawai,mbs.keterangan as keteranganstr, pg.objectruangankerjafk, ru.namaruangan as ruangankerja"))
            ->where('pg.statusenabled',true)
//            ->where('mbs.jenismasaberlakufk',1)
            ->orderBy('mbs.tglberakhir');

//        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
//            $data = $data->where('pjk.tgljadwal', '>=', $request['tglAwal']);
//        }
//
//        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
//            $tgl = $request['tglAkhir'];//." 23:59:59";
//            $data = $data->where('pjk.tgljadwal', '<=', $tgl);
//        }
//
//        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
//            $data = $data->where('pjk.objectpegawaifk','=',$request['idPegawai']);
//        }
            if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
                $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
            }

        $data = $data->get();
        $result = array(
            'data'  => $data,
            'as' => 'ridwan',
        );
        return $this->respond($result);
    }
    public function getDataSipPegawai (Request $request) {
        $data = \DB::table('masaberlakusipstr_t as mbs')
            ->leftJoin('jenismasaberlakustrsip_m as jmb','jmb.id','=','mbs.jenismasaberlakufk')
            ->leftJoin('pegawai_m as pg','pg.id','=','mbs.pegawaifk')
            ->leftJoin('unitkerjapegawai_m as uk','uk.id','=','pg.objectunitkerjapegawaifk')
            ->leftJoin('unitkerjapegawai_m as uk2','uk2.id','=','mbs.subunitkerjafk')
            ->leftJoin('jenispegawai_m as jsp','jsp.id','=','pg.objectjenispegawaifk')
            ->select(\DB::raw("pg.nippns, mbs.*,jmb.jenismasaberlaku, pg.namalengkap as namapegawai,pg.nip_pns as nipPns, uk.name as unitkerja,
			                  uk2.name as subunit,jsp.jenispegawai,mbs.keterangan as keteranganstr"))
            ->where('pg.statusenabled',true)
           ->where('mbs.jenismasaberlakufk',1)
            ->orderBy('mbs.tglberakhir');

//        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
//            $data = $data->where('pjk.tgljadwal', '>=', $request['tglAwal']);
//        }
//
//        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
//            $tgl = $request['tglAkhir'];//." 23:59:59";
//            $data = $data->where('pjk.tgljadwal', '<=', $tgl);
//        }
//
       if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
           $data = $data->where('mbs.pegawaifk','=',$request['idPegawai']);
       }

        $data = $data->get();
        $result = array(
            'data'  => $data,
            'as' => 'ridwan',
        );
        return $this->respond($result);
    }


    public function getDataPegawaiHabisKontrak(Request $request) {
        $tglAwal = $request['tglAwal'];
      $data =  DB::select(DB::raw("SELECT        jenispegawai_m.jenispegawai, pegawai_m.id,pegawai_m.namalengkap, pegawai_m.tglmasuk, pegawai_m.tglkeluar, pegawai_m.nippns
        FROM            pegawai_m INNER JOIN
                                 jenispegawai_m ON pegawai_m.objectjenispegawaifk = jenispegawai_m.id
        WHERE        (pegawai_m.statusenabled = 1) AND (pegawai_m.tglkeluar IS NOT NULL) AND (DATEDIFF(month, pegawai_m.tglkeluar, '$tglAwal') <= 6)
        
    "));

        // $data = $data->get();
        $result = array(
            'data'  => $data,
            'as' => 'noname',
        );
        return $this->respond($result);
    }

    public function getDataStr (Request $request) {
        $data = \DB::table('masaberlakusipstr_t as mbs')
            ->leftJoin('jenismasaberlakustrsip_m as jmb','jmb.id','=','mbs.jenismasaberlakufk')
            ->leftJoin('pegawai_m as pg','pg.id','=','mbs.pegawaifk')
            ->leftJoin('unitkerjapegawai_m as uk','uk.id','=','mbs.unitkerjafk')
            ->leftJoin('unitkerjapegawai_m as uk2','uk2.id','=','mbs.subunitkerjafk')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pg.objectruangankerjafk')
            ->select(\DB::raw("mbs.*,jmb.jenismasaberlaku, pg.namalengkap as namapegawai,pg.nip_pns as nipPns, uk.name as unitkerja, ru.namaruangan as ruangankerja
			                  uk2.name as subunit"))
            ->where('pg.statusenabled',true)
            ->where('mbs.jenismasaberlakufk',2)
            ->orderBy('mbs.tglberakhir');

//        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
//            $data = $data->where('pjk.tgljadwal', '>=', $request['tglAwal']);
//        }
//
//        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
//            $tgl = $request['tglAkhir'];//." 23:59:59";
//            $data = $data->where('pjk.tgljadwal', '<=', $tgl);
//        }
//
//        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
//            $data = $data->where('pjk.objectpegawaifk','=',$request['idPegawai']);
//        }

        $data = $data->get();
        $result = array(
            'data'  => $data,
            'as' => 'ridwan',
        );
        return $this->respond($result);
    }
    public function getDataStrPegawai (Request $request) {
        $data = \DB::table('masaberlakusipstr_t as mbs')
            ->leftJoin('jenismasaberlakustrsip_m as jmb','jmb.id','=','mbs.jenismasaberlakufk')
            ->leftJoin('pegawai_m as pg','pg.id','=','mbs.pegawaifk')
            ->leftJoin('unitkerjapegawai_m as uk','uk.id','=','mbs.unitkerjafk')
            ->leftJoin('unitkerjapegawai_m as uk2','uk2.id','=','mbs.subunitkerjafk')
            ->select(\DB::raw("mbs.*,jmb.jenismasaberlaku, pg.namalengkap as namapegawai,pg.nip_pns as nipPns, uk.name as unitkerja,
			                  uk2.name as subunit"))
            ->where('pg.statusenabled',true)
            ->where('mbs.jenismasaberlakufk',2)
            ->orderBy('mbs.tglberakhir');

//        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
//            $data = $data->where('pjk.tgljadwal', '>=', $request['tglAwal']);
//        }
//
//        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
//            $tgl = $request['tglAkhir'];//." 23:59:59";
//            $data = $data->where('pjk.tgljadwal', '<=', $tgl);
//        }
//
       if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
           $data = $data->where('mbs.pegawaifk','=',$request['idPegawai']);
       }

        $data = $data->get();
        $result = array(
            'data'  => $data,
            'as' => 'ridwan',
        );
        return $this->respond($result);
    }
    public function getDataSpkk(Request $request) {
        $data = \DB::table('riwayatspkk_t as rs')
            ->join('pegawai_m as pg', 'pg.id', '=', 'rs.objectpegawaifk')
            ->select('rs.*', 'pg.namalengkap');

            if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
                $data = $data->where('rs.objectpegawaifk','=',$request['idPegawai']);
            }
            $data = $data->get();
            $result = array(
                'data'  => $data,
                'as' => 'as',
            );
            return $this->respond($result);
            
    }
    public function simpanSpkk(Request $request) {
        \DB::beginTransaction();
        try {
            if ($request['norec'] == "") {
                $dataSpkk = new RiwayatSpkk();
                $dataSpkk->kdprofile = 11;
                $dataSpkk->statusenabled = 1;
                $dataSpkk->norec = $dataSpkk->generateNewId();
            } else {
                $dataSpkk = RiwayatSpkk::where('norec', $request['norec'])
                    ->where('objectpegawaifk', $request['idPegawai'])
                    ->first();
            }
            $dataSpkk->objectpegawaifk = $request['idPegawai'];
            $dataSpkk->nospkk = $request['nomorSpkk'];
            $dataSpkk->tglberlaku = $request['tglBerlaku'];
            $dataSpkk->tglberakhir = $request['tglBerakhir'];
            $dataSpkk->levelspkk = $request['levelSpkk'];
            $dataSpkk->filespkk = $request['filespkk2'];
            $dataSpkk->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus = 'true') {
            $transMessage = "Sukses ";
            \DB::commit();
            $result = array(
                "status" => 201,
                "norec" => $dataSpkk,
                "as" => 'ridwan',
                "by" => 'er@epic',
            );
        } else {
            $transMessage = "Simpan Sip/Str Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'ridwan',
                "by" => 'er@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function simpanSeminar(Request $request) {
        if ($request['tglmulai'] == "") {
            $tglMulai = null;
        } else {
            $tglMulai = $request['tglmulai'];
        }
        if ($request['tglselesai'] == "") {
            $tglSelesai = null;
        } else {
            $tglSelesai = $request['tglselesai'];
        }
        if ($request['durasi'] == "") {
            $durasi = null;
        } else {
            $durasi = $request['durasi'];
        }
        if ($request['nosertifikat'] == "") {
            $nosertifikat = null;
        } else {
            $nosertifikat = $request['nosertifikat'];
        }
        if ($request['keterangan'] == "") {
            $keterangan = null;
        } else {
            $keterangan = $request['keterangan'];
        }
        if ($request['sertifikat'] == "") {
            $sertifikat = null;
        } else {
            $sertifikat = $request['sertifikat'];
        }
        \DB::beginTransaction();
        try {
            if ($request['norec'] == "") {
                $dataSeminar = new RiwayatSeminar();
                $dataSeminar->kdprofile = 11;
                $dataSeminar->statusenabled = 1;
                $dataSeminar->norec = $dataSeminar->generateNewId();
            } else {
                $dataSeminar = RiwayatSeminar::where('norec', $request['norec'])
                    ->where('objectpegawaifk', $request['idPegawai'])
                    ->first();
            }
            $dataSeminar->objectpegawaifk = $request['idPegawai'];
            $dataSeminar->namapenyelenggara = $request['namapenyelenggara'];
            $dataSeminar->lokasi = $request['lokasi'];
            $dataSeminar->namaseminar = $request['namaseminar'];
            $dataSeminar->tglmulai = $tglMulai;
            $dataSeminar->tglselesai = $tglSelesai;
            $dataSeminar->durasi = $durasi;
            $dataSeminar->nosertifikat = $nosertifikat;
            $dataSeminar->keterangan = $keterangan;
            $dataSeminar->sertifikat = $sertifikat;
            $dataSeminar->skp = $request['skp'];
            $dataSeminar->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus = 'true') {
            $transMessage = "Sukses ";
            \DB::commit();
            $result = array(
                "status" => 201,
                "norec" => $dataSeminar,
                "as" => 'ridwan',
                "by" => 'er@epic',
            );
        } else {
            $transMessage = "Simpan Sip/Str Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'ridwan',
                "by" => 'er@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDataSeminar(Request $request) {
        $data = \DB::table('riwayatseminar_t as rs')
            ->join('pegawai_m as pg', 'pg.id', '=', 'rs.objectpegawaifk')
            ->select('rs.*', 'pg.namalengkap');

            if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
                $data = $data->where('rs.objectpegawaifk','=',$request['idPegawai']);
            }
            $data = $data->get();

            $result = array(
                'data'  => $data,
                'as' => 'as',
            );
            return $this->respond($result);

    }

    public function simpanSipStr(Request $request){
         \DB::beginTransaction();
        try {
            if ($request['norec'] == ""){
                $dataSaveSipStr = new MasaBerlakuSipStr();
                $dataSaveSipStr->kdprofile = 11;
                $dataSaveSipStr->statusenabled=1;
                $dataSaveSipStr->norec = $dataSaveSipStr->generateNewId();

            }else{
                $dataSaveSipStr = MasaBerlakuSipStr::where('norec', $request['norec'])
                    ->where('pegawaifk',$request['idPegawai'])
                    ->first();
            }

//            if ($request['jenismasaberlakufk'] == 1){
//                $filename = 'SIP-'.$request['idPegawai'].'.'.$extension;
//            }elseif ($request['jenismasaberlakufk'] == 2) {
//                $filename = 'STR-'.$request['idPegawai'].'.'.$extension;
//            }
//
//            Storage::disk('local')->put('SDM/FileSipStr/'.$filename,file_get_contents($request->file('file')));
//            // $path = $uploadedFile->move('photos',$filename);
//
//            $dataSaveSipStr->pegawaifk=$request['idPegawai'];
//            $dataSaveSipStr->jenismasaberlakufk=$request['jenismasaberlakufk'];
//            $dataSaveSipStr->nomor =$request['nomorSurat'];
//            $dataSaveSipStr->tglberakhir = $request['tglBerakhir'];
//            $dataSaveSipStr->namafileupload = $filename;

            $uploadedFileSip = $request->file('filesip');
            $uploadedFileStr = $request->file('filestr');
            $pegawai = Pegawai::where('id',$request['idPegawai'])->first();
            if(!empty($uploadedFileSip)){
                $extensionSip = $uploadedFileSip->getClientOriginalExtension();
                $filenameSip = 'SIP-'.$pegawai->namalengkap.'.'.$extensionSip;

//                Storage::disk('local')->put('SDM/FileSipStr/'.$filenameSip,file_get_contents($request->file('filesip')));
                $dataSaveSipStr->namafilesip = $filenameSip;
            }
            if(!empty($uploadedFileStr)){
                $extensionStr = $uploadedFileStr->getClientOriginalExtension();
                $filenameStr = 'STR-' .$pegawai->namalengkap . '.' . $extensionStr;
//                Storage::disk('local')->put('SDM/FileSipStr/'.$filenameStr,file_get_contents($request->file('filestr')));
                $dataSaveSipStr->namafilestr =$filenameStr;
            }

            $dataSaveSipStr->pegawaifk=$request['idPegawai'];
            $dataSaveSipStr->nosip=$request['nomorsip'];
            $dataSaveSipStr->terbitsip =$request['terbitsip'];
            $dataSaveSipStr->berakhirsip = $request['berakhirsip'];
            $dataSaveSipStr->namafileupload = $request['namafileupload'];
            $dataSaveSipStr->nostr = $request['nomorstr'];
            $dataSaveSipStr->terbitstr = $request['terbitstr'];
            $dataSaveSipStr->berakhirstr = $request['berakhirstr'];
            $dataSaveSipStr->keterangan = $request['keteranganstr'];
            $dataSaveSipStr->jenismasaberlakufk = $request['jenismasaberlakufk'];
            $dataSaveSipStr->filesip2 = $request['filesip2'];
            $dataSaveSipStr->filestr2 = $request['filestr2'];
            $dataSaveSipStr->save();
            $norec =  $dataSaveSipStr->norec ;
            if(!empty($uploadedFileSip)) {
                $request->file('filesip')->move('SDM/FileSipStr/'.$norec,
                    $filenameSip);
            }
            if(!empty($uploadedFileStr)) {
                $request->file('filestr')->move('SDM/FileSipStr/'.$norec,
                    $filenameStr);
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus = 'true') {
            $transMessage = "Sukses ";
            \DB::commit();
            $result = array(
                "status" => 201,
                "norec" => $dataSaveSipStr,
                "as" => 'ridwan',
                "by" => 'er@epic',
            );
        } else {
            $transMessage = "Simpan Sip/Str Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'ridwan',
                "by" => 'er@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function createZipSipStr(Request $request){

        $zip_file = $request['name'].'.zip';
        $zip = new \ZipArchive();
        $zip->open($zip_file, \ZipArchive::CREATE | \ZipArchive::OVERWRITE);

        $path = public_path('SDM/FileSipStr'.'/'.$request['norec']);
        $files = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($path));

        foreach ($files as $name => $file)
        {
            // We're skipping all subfolders
            if (!$file->isDir()) {
                $filePath     = $file->getRealPath();

                // extracting filename with substr/strlen
                $relativePath =  substr($filePath, strlen($path) + 1);

                $zip->addFile($filePath, $relativePath);
            }
        }

        $zip->close();

        return response()->download($zip_file);
    }
    public function deleteDataSipStr(Request $request){

        try {
            $filename = $request['namafile'];
            $path = public_path('SDM/FileSipStr/'.$request['norec'].'/');

            if (!\File::exists($path)) {
//                abort(404);
            }else{
                $file = \File::deleteDirectory($path);
            }


            Storage::disk('local')->delete('SDM/FileSipStr/'.$filename);
            MasaBerlakuSipStr::where('norec', $request['norec'])->delete();
            $transMessage = "Sukses ";
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Hapus Data Sip/Str Gagal";
        }

        if ($transStatus != 'false') {

            \DB::commit();
            $result = array(

                "status" => 201,
                "message" => $transMessage,
                "as" => 'ridwan',
                "by" => 'er@epic',
            );
        } else {
            DB::rollBack();
            $result = array(

                "status" => 400,
                "message" => $transMessage,
                "as" => 'ridwan',
                "by" => 'er@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function deleteSpkk(Request $request) {
        try {
            RiwayatSpkk::where('norec', $request['norec'])->delete();
            $transMessage = "Sukses ";
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Hapus Data SPKK Gagal";
        }
        if ($transStatus != 'false') {

            \DB::commit();
            $result = array(

                "status" => 201,
                "message" => $transMessage,
                "as" => 'ridwan',
                "by" => 'er@epic',
            );
        } else {
            DB::rollBack();
            $result = array(

                "status" => 400,
                "message" => $transMessage,
                "as" => 'ridwan',
                "by" => 'er@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getPegawaiSudahPensiun (Request $request) {
        $data = \DB::table('pegawai_m as pg')
            ->leftJoin('agama_m as ag','ag.id','=','pg.objectagamafk')
            ->leftJoin('golonganpegawai_m as gp','gp.id','=', 'pg.objectgolonganpegawaifk')
            ->leftJoin('unitkerjapegawai_m as uk','uk.id','=','pg.objectunitkerjafk')
            ->leftJoin('unitkerjapegawai_m as uk2','uk2.id','=','pg.objectsubunitkerjapegawaifk')
            ->leftJoin('sdm_golongan_m as gol','gol.id','=','pg.objectgolonganfk')
//            ->select(DB::raw("pg.id,pg.namalengkap, pg.nippns,pg.tgllahir, pg.pensiun, pg.tglpensiun,pg.objectgolonganfk,
//                    gp.golonganpegawai,uk.name as unitkerja, uk2.name as subunit"))
            ->select(\DB::raw("pg.*,gp.golonganpegawai,uk.name as unitkerja, uk2.name as subunit"))
            ->where('pg.statusenabled',false)
            ->orderBy('pg.namalengkap');

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pg.tglpensiun', '>=', $request['tglAwal']);
        }

        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $data = $data->where('pg.tglpensiun', '<=', $request['tglAkhir']);
        }
//
        if(isset($request['namaPeg']) && $request['namaPeg']!="" && $request['namaPeg']!="undefined"){
            $data = $data->where('pg.namalengkap','ilike','%'.$request['namaPeg'].'%');
        }

        $data = $data->get();
        $result = array(
            'data'  => $data,
            'as' => 'ridwan',
        );
        return $this->respond($result);
    }

    public function getPegawaiPensiun (Request $request) {
        $data = \DB::table('pegawai_m as pg')
            ->leftJoin('agama_m as ag','ag.id','=','pg.objectagamafk')
            ->leftJoin('golonganpegawai_m as gp','gp.id','=', 'pg.objectgolonganpegawaifk')
            ->leftJoin('unitkerjapegawai_m as uk','uk.id','=','pg.objectunitkerjafk')
            ->leftJoin('unitkerjapegawai_m as uk2','uk2.id','=','pg.objectsubunitkerjapegawaifk')
            ->leftJoin('sdm_golongan_m as gol','gol.id','=','pg.objectgolonganfk')
//            ->select(DB::raw("pg.id,pg.namalengkap, pg.nippns,pg.tgllahir, pg.pensiun, pg.tglpensiun,pg.objectgolonganfk,
//                    gp.golonganpegawai,uk.name as unitkerja, uk2.name as subunit"))
            ->select(\DB::raw("pg.*,gp.golonganpegawai,uk.name as unitkerja, uk2.name as subunit"))
            ->where('pg.statusenabled',true)
            ->orderBy('pg.namalengkap');

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pg.tglpensiun', '>=', $request['tglAwal']);
        }

        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $data = $data->where('pg.tglpensiun', '<=', $request['tglAkhir']);
        }
//
        if(isset($request['namaPeg']) && $request['namaPeg']!="" && $request['namaPeg']!="undefined"){
            $data = $data->where('pg.namalengkap','ilike','%'.$request['namaPeg'].'%');
        }

        $data = $data->get();
        $result = array(
            'data'  => $data,
            'as' => 'ridwan',
        );
        return $this->respond($result);
    }

    public function updateDataPegawaiFormPensiun (Request $request) {
        \DB::beginTransaction();
        try{
            #region savePegawaiFormPensiun

//            $dataPegawai=$request['datapegawai'];
            $updatePegFormPensiun = Pegawai::where('id', $request['id'])->first();
            $updatePegFormPensiun->nippns = $request['nippns'];
            $updatePegFormPensiun->nip_pns = $request['nip_pns'];
            $updatePegFormPensiun->pensiun =  $request['pensiun'];
            $updatePegFormPensiun->objectunitkerjapegawaifk =  $request['objectunitkerjapegawaifk'];
            $updatePegFormPensiun->objectunitkerjafk =  $request['objectunitkerjafk'];
            $updatePegFormPensiun->objectsubunitkerjapegawaifk =  $request['objectsubunitkerjapegawaifk'];
            $updatePegFormPensiun->tgllahir = $request['tgllahir'];
            $updatePegFormPensiun->objectgolonganfk=  $request['objectgolonganfk'];
            $updatePegFormPensiun->objectgolonganpegawaifk=  $request['objectgolonganpegawaifk'];
            $updatePegFormPensiun->tglpensiun = $request['tglpensiun'];

            $updatePegFormPensiun->save();

            #endregion savePegawaiFormPensiun
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
                "datapegawai" => $updatePegFormPensiun,
                "as" => 'ridwan',
            );
        } else {
            $transMessage = "Simpan Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "datapegawai" => $updatePegFormPensiun,
                "as" => 'ridwan',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getComboPensiun(Request $request){
        $dataLogin = $request->all();
        $UnitKerja = UnitKerjaPegawai::where('statusenabled',true)->get();
        $SubUnitKerja = SubUnitKerja::where('statusenabled',true)->get();
        $GolonganPegawai = GolonganPegawai::where('statusenabled', true)->get();

        $DataUnitkerja=[];
        foreach ($UnitKerja as $item) {
            $detail = [];
            foreach ($SubUnitKerja as $item2) {
                if ($item->id == $item2->objectunitkerjapegawaifk) {
                    $detail[] = array(
                        'id' => $item2->id,
                        'name' => $item2->name,
                    );
                }
            }

            $DataUnitkerja[] = array(
                'id' => $item->id,
                'name' => $item->name,
                'subunit' => $detail,
            );
        }
        $result = array(
            'datalogin'=> $dataLogin,
            'dataunitkerja' => $DataUnitkerja,
            'unitkerjapegawai' => $UnitKerja,
            'subunitkerja' => $SubUnitKerja,
            'golonganpegawai' => $GolonganPegawai,
            'by' => 'ridwan',
        );

        return $this->respond($result);
    }

    public function SavePensiunPegawai (Request $request) {
        \DB::beginTransaction();
        try{
            #region savePegawaiFormPensiun

//            $dataPegawai=$request['datapegawai'];
            $pensiunkanPegawai = Pegawai::where('id', $request['id'])->first();
            $pensiunkanPegawai->statusenabled = $request['statusenabled'];

            $pensiunkanPegawai->save();

            #endregion savePegawaiFormPensiun
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
                "datapegawai" => $pensiunkanPegawai,
                "as" => 'ridwan',
            );
        } else {
            $transMessage = "Simpan Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "datapegawai" => $pensiunkanPegawai,
                "as" => 'ridwan',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveJadwalBulananPegawai(Request $request) {
        \DB::beginTransaction();
        try {
            foreach ($request['data'] as $item) {
                if ($request['id'] == '') {
                    $id = PegawaiJadwalKerja::max('id');
                    $dataJadwal = new PegawaiJadwalKerja();
                    $dataJadwal->id = $id + 1;
                    $dataJadwal->norec = $dataJadwal->generateNewId();
                    $dataJadwal->kdprofile = 0;
                    $dataJadwal->statusenabled = true;

                } else {
                    $dataJadwal = PegawaiJadwalKerja::where('id', $request['id'])->first();
                }

                $dataJadwal->objectpegawaifk = $item['idpegawai'];
//                $dataJadwal->objectruanganfk = $request['ruanganfk'];
                $dataJadwal->objectunitkerjapegawaifk = $request['ruanganfk'];
                $dataJadwal->objectshiftfk = $request['shiftkerja'];
                $dataJadwal->tgljadwal = $item['tglmulai'];
                $dataJadwal->jammulai = $request['jammulai'];
                $dataJadwal->jamselesai = $request['jamselesai'];
                $dataJadwal->keteranganalasan = $request['keterangan'];
//                $dataJadwal->objectstatushadirfk = 1;//hadir $request['objectstatushadirfk'];
                $dataJadwal->save();
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Jadwal Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "res" => $dataJadwal,
                "as" => 'ramdanegie@epic',
            );
        } else {
            $transMessage = "Simpan Jadwal Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'ramdanegie@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getJadwalBulananPegawai(Request $request){

        $data = \DB::table('pegawaijadwalkerja_m AS pjk')
            ->join('pegawai_m as pg','pg.id','=','pjk.objectpegawaifk')
            ->leftjoin('ruangan_m as ru','ru.id','=','pjk.objectruanganfk')
            ->join('unitkerjapegawai_m as uk','uk.id','=','pjk.objectunitkerjapegawaifk')
            ->select('pjk.*','pg.namalengkap','ru.namaruangan','uk.name as unitkerja')
            ->where('pjk.statusenabled', true)
            ->orderByRaw('pg.namalengkap,pjk.tgljadwal desc');


        if(isset($request['bulan']) &&
            $request['bulan']!="" &&
            $request['bulan']!="undefined"){
            $tgl = $request['bulan']  ;
            $data = $data->whereRaw("STUFF(CONVERT(varchar(10), pjk.tgljadwal,104),1,3,'')  ='$tgl' " );
        };
        if(isset($request['namalengkap']) &&
            $request['namalengkap']!="" &&
            $request['namalengkap']!="undefined"){
            $data = $data->where('pg.namalengkap','ilike','%'. $request['namalengkap'] .'%' );
        };
        if(isset($request['idRuangan']) &&
            $request['idRuangan']!="" &&
            $request['idRuangan']!="undefined"){
            $data = $data->where('uk.id','=', $request['idRuangan'] );
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

    public function hapusJadwalBulananPegawai(Request $request) {
        \DB::beginTransaction();
        try {
            foreach ($request['data'] as $item) {

                $dataJadwal = PegawaiJadwalKerja::where('id', $item['id'])->update(
                    [ 'statusenabled' => false ]
                );

            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Hapus Jadwal Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "res" => $dataJadwal,
                "as" => 'ramdanegie@epic',
            );
        } else {
            $transMessage = "Hapus Jadwal Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'ramdanegie@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getComboPegawaiJadwal(Request $request){
//        $kdJenisPegawaiDokter = $this->settingDataFixed('kdJenisPegawaiDokter');
        $req = $request->all();
        $data = \DB::table('pegawai_m')
            ->select('id','namalengkap')
            ->where('statusenabled', true)
//            ->where('objectjenispegawaifk',$kdJenisPegawaiDokter)
            ->orderBy('namalengkap');

        if(isset($req['namalengkap']) &&
            $req['namalengkap']!="" &&
            $req['namalengkap']!="undefined"){
            $data = $data->where('namalengkap','ilike','%'. $req['namalengkap'] .'%' );
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
                ->where('namalengkap','ilike','%'.$req['filter']['filters'][0]['value'].'%' );
        }

//        $data = $data->take(10);
        $data = $data->get();

        return $this->respond($data);
    }

    public function getMonitoringAbsensiPegawai (Request $request) {
        $data = \DB::table('pegawai_m as pg')
            ->Join('sdm_absensipegawai_t as abn','abn.pegawaifk','=','pg.id')
            ->select(\DB::raw("abn.pegawaifk,pg.namalengkap,abn.jammasuk,abn.jamkeluar,'-' as namaruangan"))
            ->where('pg.statusenabled',true)
            ->where('abn.statusenabled',true);

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('abn.jammasuk', '>=', $request['tglAwal']);
        }

        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];//." 23:59:59";
            $data = $data->where('abn.jammasuk', '<=', $tgl);
        }

        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $data = $data->where('pg.id','=',$request['idPegawai']);
        }
        if(isset($request['norec']) && $request['norec']!="" && $request['norec']!="undefined"){
            $data = $data->where('abn.norec','=',$request['norec']);
        }

        $data = $data->orderBy('pg.namalengkap');
        $data = $data->get();
        $result = array(
            'data'  => $data,
            'as' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function deleteDataKeluarga(Request $request){

        try {
            KeluargaPegawai::where('id',$request['id'])->delete();
            $transMessage = "Sukses ";
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Hapus Data Keluarga Gagal";
        }

        if ($transStatus != 'false') {

            \DB::commit();
            $result = array(

                "status" => 201,
                "message" => $transMessage,
                "as" => 'ridwan',
            );
        } else {
            DB::rollBack();
            $result = array(

                "status" => 400,
                "message" => $transMessage,
                "as" => 'ridwan',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDataKeluarga (Request $request) {
        $dataKeluarga=\DB::table('keluargapegawai_m as kp')
            ->leftJoin('pegawai_m as pg','pg.id','=','kp.objectpegawaifk')
            ->leftJoin('jeniskelamin_m as jk','jk.id','=','kp.objectjeniskelaminfk')
            ->leftJoin('hubungankeluarga_m as hk','hk.id','=','kp.objectkdhubunganfk')
            ->leftJoin('statusperkawinanpegawai_m as spp','spp.id','=','kp.objectstatusperkawinanpegawaifk')
            ->leftJoin('pendidikan_m as pend','pend.id','=','kp.objectpendidikanterakhirfk')
            ->leftJoin('pekerjaan_m as pe','pe.id','=','kp.objectpekerjaanfk')
            ->select(\DB::raw("kp.*,pg.namalengkap as namapegawai,jk.jeniskelamin,hk.reportdisplay as hubungankeluarga,
	                          spp.statusperkawinan,pend.pendidikan,pe.pekerjaan"))
            ->where('pg.statusenabled',true)
            ->orderBy('pg.namalengkap');

        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $dataKeluarga = $dataKeluarga->where('pg.id','=',$request['idPegawai']);
        }
        $dataKeluarga = $dataKeluarga->get();

        $result = array(
            'data'  => $dataKeluarga,
            'as' => 'ridwan',
        );
        return $this->respond($result);
    }

    public function saveDataKeluarga (Request $request) {
        \DB::beginTransaction();
        try{
            #region savePegawaiFormKeluarga

            $dataKeluargaPegawai=$request['datakeluarga'];
            $IdPegawais=$request['idPegawai'];

            if ($dataKeluargaPegawai != ""){
                foreach ($dataKeluargaPegawai as $item){
                    if ($item['id'] == ""){
                        $idKeluarga = KeluargaPegawai::max('id') + 1;
                        $dataSaveKeluarga = new KeluargaPegawai();
                        $dataSaveKeluarga->id = $idKeluarga;
                        $dataSaveKeluarga->kdprofile = 11;
                        $dataSaveKeluarga->statusenabled=true;
                        $dataSaveKeluarga->norec = $dataSaveKeluarga->generateNewId();
                        $dataSaveKeluarga->objectpegawaifk = $IdPegawais;
                    }else{
                        $dataSaveKeluarga = KeluargaPegawai::where('id', $item['id'])
                            ->where('objectpegawaifk',$IdPegawais)
                            ->first();
                    }
                    $dataSaveKeluarga->alamat = $item['alamat'];
                    $dataSaveKeluarga->objectjeniskelaminfk = $item['objectjeniskelaminfk'];
                    $dataSaveKeluarga->keterangan = $item['keterangan'];
                    $dataSaveKeluarga->namaayah = $item['namaayah'];
                    $dataSaveKeluarga->namaibu = $item['namaibu'];
                    $dataSaveKeluarga->namalengkap = $item['namalengkap'];
                    $dataSaveKeluarga->nipistrisuami = $item['nipistrisuami'];
                    $dataSaveKeluarga->nosuratkuliah = $item['nosuratkuliah'];
                    $dataSaveKeluarga->objectkdhubunganfk = $item['objectkdhubunganfk'];
                    $dataSaveKeluarga->objectpekerjaanfk = $item['objectpekerjaanfk'];
                    $dataSaveKeluarga->objectstatusperkawinanpegawaifk = $item['objectstatusperkawinanpegawaifk'];
                    $dataSaveKeluarga->statustanggungan = $item['statustanggungan'];
                    $dataSaveKeluarga->tgllahir = $item['tgllahir'];
                    if (isset($item['tglsuratkuliah']) && $item['tglsuratkuliah'] != 'Invalid date'){
                        $dataSaveKeluarga->tglsuratkuliah = $item['tglsuratkuliah'];
                    }
                    $dataSaveKeluarga->statustanggunganfk = $item['statustanggunganfk'];
                    $dataSaveKeluarga->objectpendidikanterakhirfk = $item['objectpendidikanterakhirfk'];
                    $dataSaveKeluarga->save();
                }
            }

            #endregion savePegawaiFormPensiun
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
                "datapegawai" => $dataSaveKeluarga,
                "as" => 'ridwan',
            );
        } else {
            $transMessage = "Simpan Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "datapegawai" => $dataSaveKeluarga,
                "as" => 'ridwan',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDaftarDiklatKategory(Request $request){
        $data = DiklatKategory::get();

        $result = array(
            'data' => $data,
            'by' => 'asepic',
        );
        return $result;
    }
    public function getInstitusiDiklatKategory(Request $request){
        $data = SdmInstitusiPendidikan::get();

        $result = array(
            'data' => $data,
            'by' => 'asepic',
        );
        return $result;
    }

    public function getFakultasKategory(Request $request){
        $data = \DB::table('sdm_fakultas_m as ru')
        ->get();

        $result = array(
            'data' => $data,
            'by' => 'asepic',
        );

        return $result;

    }

    public function getJurusanKategory(Request $request){
        $data = JurusanPeminatan::get();

        $result = array(
            'data' => $data,
            'by' => 'asepic',
        );
        return $result;
    }

    public function saveDiklatKategory(Request $request){
        DB::beginTransaction();
        try{
            $newId = DiklatKategory::max('id') +1 ;
            if ($request['id'] == ''){
                $TP = new DiklatKategory();
                $TP->id = $newId;
                $TP->kdprofile = 0;
                $TP->norec = $TP->generateNewId();
            }else{
                $TP = DiklatKategory::where('id', $request['id'])->first();
            }
            $TP->statusenabled =  $request['statusenabled'];
            $TP->kodeexternal = $newId;
            $TP->reportdisplay = $request['diklatkategori'];
            $TP->diklatkategori = $request['diklatkategori'];
            $TP->kddiklatkategori = $newId;
            $TP->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Diklat Kategory";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $TP,
                'as' => 'asepic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'asepic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveInstitusiKategory(Request $request){
        DB::beginTransaction();
        try{
            $newId = SdmInstitusiPendidikan::max('id') +1 ;
            if ($request['id'] == ''){
                $institusi = new SdmInstitusiPendidikan();
                $institusi->id = $newId;
                $institusi->kdprofile = 0;
                $institusi->norec = $institusi->generateNewId();
            }else{
                $institusi = SdmInstitusiPendidikan::where('id', $request['id'])->first();
            }
            $institusi->statusenabled =  $request['statusenabled'];
            $institusi->kodeexternal = $newId;
            $institusi->namaexternal = $request['institusipendidikan'];
            $institusi->institusipendidikan = $request['institusipendidikan'];
            $institusi->id = $newId;
            $institusi->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Institusi Pendidikan Kategory";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $institusi,
                'as' => 'asepic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'asepic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveFakultasKategory(Request $request){
        DB::beginTransaction();
        try{
            $newId = SdmFakultas::max('id') +1 ;
            if ($request['id'] == ''){
                $fakultas = new SdmFakultas();
                $fakultas->id = $newId;
                $fakultas->kdprofile = 0;
                $fakultas->norec = $fakultas->generateNewId();
            }else{
                $fakultas = SdmFakultas::where('id', $request['id'])->first();
            }
            $fakultas->statusenabled =  $request['statusenabled'];
            $fakultas->kodeexternal = $newId;
            $fakultas->fakultas = $request['fakultas'];
            $fakultas->reportdisplay = $request['fakultas'];
            $fakultas->id = $newId;
            $fakultas->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Fakultas Kategory";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $fakultas,
                'as' => 'asepic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'asepic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveJurusanKategory(Request $request){
        DB::beginTransaction();
        try{
            $newId = JurusanPeminatan::max('id') +1 ;
            if ($request['id'] == ''){
                $jurusanpeminatan = new JurusanPeminatan();
                $jurusanpeminatan->id = $newId;
                $jurusanpeminatan->kdprofile = 0;
                $jurusanpeminatan->norec = $jurusanpeminatan->generateNewId();
            }else{
                $jurusanpeminatan = JurusanPeminatan::where('id', $request['id'])->first();
            }
            $jurusanpeminatan->statusenabled =  $request['statusenabled'];
            $jurusanpeminatan->kodeexternal = $newId;
            $jurusanpeminatan->jurusanpeminatan = $request['jurusanpeminatan'];
            $jurusanpeminatan->id = $newId;
            $jurusanpeminatan->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Jurusan Peminatan Kategory";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $jurusanpeminatan,
                'as' => 'asepic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'asepic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDaftarDiklatJurusan(Request $request){
        $data = DiklatJurusan::get();

        $result = array(
            'data' => $data,
            'by' => 'asepic',
        );
        return $result;
    }
    public function saveDiklatJurusan(Request $request){
        DB::beginTransaction();
        try{
            $newId = DiklatJurusan::max('id') +1 ;
            if ($request['id'] == ''){
                $TP = new DiklatJurusan();
                $TP->id = $newId;
                $TP->kdprofile = 0;
                $TP->norec = $TP->generateNewId();
            }else{
                $TP = DiklatJurusan::where('id', $request['id'])->first();
            }
            $TP->statusenabled =  $request['statusenabled'];
            $TP->kodeexternal = $newId;
            $TP->reportdisplay = $request['diklatkategori'];
            $TP->diklatjurusan = $request['diklatkategori'];
            $TP->kddiklatjurusan = $newId;
            $TP->qtysksmin = 0;
            $TP->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }


        if ($transStatus == 'true') {
            $transMessage = "Simpan Diklat Jurusan";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $TP,
                'as' => 'asepic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'asepic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDataComboMapKategoriPendidikanToProgramPendidikan(Request $request){
        $data1 = DiklatJurusan::get();
        $data2 = Pendidikan::get();
        $data3 = JurusanPeminatan::get();

        $result = array(
            'data1' => $data1,
            'data2' => $data2,
            'data3' => $data3,
            'by' => 'asepic',
        );
        return $result;
    }
    public function getDataComboPesertaDidik(Request $request){
        $dataJenisKelamin = DB::select(DB::raw("select * from jeniskelamin_m
                where statusenabled='1'")
        );
        $dataAgama = DB::select(DB::raw("select * from agama_m
                where statusenabled='1'")
        );
        $dataInstitusipPendidikan = DB::select(DB::raw("select * from sdm_institusipendidikan_m
                where statusenabled='1'")
        );
        $dataJurusan = DB::select(DB::raw("select * from sdm_jurusanpeminatan_m
                where statusenabled='1'")
        );
        $datafakultas = DB::select(DB::raw("select * from sdm_fakultas_m
                where statusenabled='1'")
        );

        $result = array(
            'dataJenisKelamin' => $dataJenisKelamin,
            'dataAgama' => $dataAgama,
            'dataInstitusipPendidikan' => $dataInstitusipPendidikan,
            'dataJurusan' => $dataJurusan,
            'datafakultas' => $datafakultas,
            'by' => 'asepic',
        );
        return $result;
    }
    public function getDaftarPesertaDidik(Request $request){
        $nama = '';
        if ($request['nama'] != ''){
            $nama = " and a.nama ilike '%" . $request['nama'] . "%'";
        }
        $insts ='';
        if ($request['institusipendidikanfk'] != ''){
            $insts = ' and a.institusipendidikanfk = ' . $request['institusipendidikanfk'];
        }

        $data = DB::select(DB::raw("select a.*,ag.agama,jk.jeniskelamin,sins.institusipendidikan,sjur.jurusanpeminatan,sfak.fakultas ,
            a.tempatlahir || ', ' || to_char(a.tanggallahir,'yyyy-MM-dd')  as ttl
            from sdm_pesertadidik_t as a
            INNER JOIN agama_m as ag on a.agamafk=ag.id
            INNER JOIN jeniskelamin_m as jk on jk.id=a.jeniskelaminfk
            left JOIN sdm_institusipendidikan_m as sins on sins.id=a.institusipendidikanfk
            left JOIN sdm_jurusanpeminatan_m as sjur on sjur.id=a.jurusanpeminatanfk
            left JOIN sdm_fakultas_m as sfak on sfak.id=a.fakultasfk
            where a.statusenabled='1' $nama $insts")
        );
        $result = array(
            'data' => $data,
            'by' => 'asepic',
        );
        return $result;
    }
    public function savePesertaDidik(Request $request){
        DB::beginTransaction();
        try{
//            $newId = PesertaDidik::max('id') +1 ;
            if ($request['norec'] == ''){
                $TP = new PesertaDidik();
//                $TP->id = $newId;
                $TP->kdprofile = 0;
                $TP->norec = $TP->generateNewId();
            }else{
                $TP = PesertaDidik::where('norec', $request['norec'])->first();
            }
            $TP->statusenabled =  true;
            $TP->agamafk = $request['agamafk'];
            $TP->alamat = $request['alamat'];
            $TP->fakultasfk = $request['fakultasfk'];
            $TP->institusipendidikanfk = $request['institusipendidikanfk'];
            $TP->jeniskelaminfk = $request['jeniskelaminfk'];
            $TP->jurusanpeminatanfk = $request['jurusanpeminatanfk'];
            $TP->nama = $request['nama'];
            $TP->nim = $request['nim'];
            $TP->nomorhp = $request['nomorhp'];
            $TP->tanggallahir = $request['tanggallahir'];
            $TP->tempatlahir = $request['tempatlahir'];
            $TP->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }


        if ($transStatus == 'true') {
            $transMessage = "Simpan Peserta Didik";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $TP,
                'as' => 'asepic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'asepic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function hapusPesertaDidik(Request $request){
        DB::beginTransaction();
        try{
            $TP = PesertaDidik::where('norec', $request['norec'])->update([
                'statusenabled' => false
            ]);

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
                'result' => $TP,
                'as' => 'asepic',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'asepic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDataComboTenagaPengajar(Request $request){
        $data1 = DB::select(DB::raw("select id,namalengkap from pegawai_m
                where statusenabled=1")
        );
        $data2= DB::select(DB::raw("select id,fakultas from sdm_fakultas_m
                where statusenabled=1")
        );

        $result = array(
            'dataPegawai' => $data1,
            'dataProgramStudi' => $data2,
            'by' => 'asepic',
        );
        return $result;
    }
    public function getDaftarTenagaPengajar(Request $request){
        $data = DB::select(DB::raw("select a.*,sfak.fakultas,pg.namalengkap from tenagapengajar_m as a
            INNER JOIN sdm_fakultas_m as sfak on sfak.id=a.jurusanpeminatanfk
            INNER JOIN pegawai_m as pg on pg.id=a.pegawaifk
            where a.statusenabled=1")
        );
        $result = array(
            'data' => $data,
            'by' => 'asepic',
        );
        return $result;
    }

    public function getDetailTenagaPengajar(Request $request){
        $idpegawai = $request['id'];
        $data = DB::select(DB::raw("select pg.id,pg.namalengkap,jk.jeniskelamin,ag.agama,pg.nohandphone,pg.tempatlahir + ', ' + format(pg.tgllahir ,'yyyy-MM-dd') as tempatlahir,
                jb.namajabatan,pg.tglmasuk,ru.namaruangan,pg.alamat
                 from  pegawai_m as pg 
                left JOIN jeniskelamin_m as jk on jk.id=pg.objectjeniskelaminfk
                left JOIN agama_m as ag on ag.id=pg.objectagamafk
                left JOIN jabatan_m as jb on jb.id=pg.objectjabatanfungsionalfk
                left JOIN ruangan_m as ru on ru.id=pg.objectruangankerjafk
            where pg.statusenabled=1 and pg.id= $idpegawai")
        );
        $result = array(
            'data' => $data,
            'by' => 'asepic',
        );
        return $result;
    }
    public function saveTenagaPengajar(Request $request){
        DB::beginTransaction();
        try{
            $newId = TenagaPengajar::max('id') +1 ;
            if ($request['norec'] == ''){
                $TP = new TenagaPengajar();
                $TP->id = $newId;
                $TP->kdprofile = 0;
                $TP->norec = $TP->generateNewId();
            }else{
                $TP = TenagaPengajar::where('id', $request['norec'])->first();
            }
            $TP->statusenabled =  true;
            $TP->jurusanpeminatanfk = $request['fakultasfk'];
            $TP->pegawaifk = $request['pegawaifk'];
            $TP->unit_kerja = $request['namaruangan'];
            $TP->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }


        if ($transStatus == 'true') {
            $transMessage = "Simpan Tenaga Pengajar";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $TP,
                'as' => 'asepic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'asepic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function hapusTenagaPengajar(Request $request){
        DB::beginTransaction();
        try{
            $TP = TenagaPengajar::where('id', $request['id'])->update(
                [ 'statusenabled' => false]
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
                'result' => $TP,
                'as' => 'asepic',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'asepic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDataComboMOUPKS(Request $request){
        $data1 = DB::select(DB::raw("select id,namalengkap from pegawai_m
                where statusenabled=true")
        );
        $data2= DB::select(DB::raw("select id,fakultas from sdm_fakultas_m
                where statusenabled=true")
        );

        $result = array(
            'dataPegawai' => $data1,
            'dataProgramStudi' => $data2,
            'by' => 'asepic',
        );
        return $result;
    }
    public function getDaftarKegiatanPendidikan(Request $request){
        $data = DB::select(DB::raw("select a.*,spes.nama,dkat.diklatkategori,sfak.fakultas,djur.diklatjurusan,pg.namalengkap from sdm_kegiatanpendidikan_t as a
            INNER JOIN sdm_pesertadidik_t as spes on spes.norec=a.pesertafk
            INNER JOIN diklatkategori_m as dkat on dkat.id=a.diklatkatregorifk
            INNER JOIN sdm_fakultas_m as sfak on sfak.id=a.fakultasfk
            INNER JOIN diklatjurusan_m as djur on djur.id=a.diklatjurusanfk
            left JOIN tenagapengajar_m as tpeng on tpeng.id=a.tenagapengajarfk
            left JOIN pegawai_m as pg on pg.id=tpeng.pegawaifk")
        );
        $result = array(
            'data' => $data,
            'by' => 'asepic',
        );
        return $result;
    }

    public function getDataComboKegiatanPendidikan(Request $request){
        $dataInstitusipPendidikan = DB::select(DB::raw("select id,institusipendidikan from sdm_institusipendidikan_m
                where statusenabled=true")
        );
        $dataDiklatKategori = DB::select(DB::raw("select id,diklatkategori from diklatkategori_m
                where statusenabled=true")
        );
        $datafakultas = DB::select(DB::raw("select id,fakultas from sdm_fakultas_m
                where statusenabled=true")
        );
        $datadiklatjurusan = DB::select(DB::raw("select id,diklatjurusan from diklatjurusan_m
                where statusenabled=true")
        );
        $dataTenagaPengajar = DB::select(DB::raw("select pg.namalengkap,a.id from tenagapengajar_m as a
            INNER JOIN sdm_fakultas_m as sfak on sfak.id=a.jurusanpeminatanfk
            INNER JOIN pegawai_m as pg on pg.id=a.pegawaifk
            where a.statusenabled=true")
        );

        $result = array(
            'dataInstitusipPendidikan' => $dataInstitusipPendidikan,
            'dataDiklatKategori' => $dataDiklatKategori,
            'datafakultas' => $datafakultas,
            'datadiklatjurusan' => $datadiklatjurusan,
            'dataTenagaPengajar' => $dataTenagaPengajar,
            'by' => 'asepic',
        );
        return $result;
    }

    public function saveKegiatanPendidikan(Request $request){
        DB::beginTransaction();
        try{
//            $newId = KegiatanPendidikan::max('id') +1 ;
            if ($request['norec'] == ''){
                $TP = new KegiatanPendidikan();
//                $TP->id = $newId;
                $TP->kdprofile = 0;
                $TP->norec = $TP->generateNewId();
            }else{
                $TP = KegiatanPendidikan::where('id', $request['norec'])->first();
            }
            $TP->statusenabled =  true;
            $TP->nokegiatan = '0001';
            $TP->pesertafk = $request['pesertafk'];
            $TP->diklatkatregorifk = $request['diklatkatregorifk'];
            $TP->fakultasfk = $request['fakultasfk'];
            $TP->diklatjurusanfk = $request['diklatjurusanfk'];
            $TP->tenagapengajarfk = $request['tenagapengajarfk'];
            $TP->tglmulai = $request['tglmulai'];
            $TP->nilaipraktek = $request['nilaipraktek'];
            $TP->nilaiujian = $request['nilaiujian'];
            $TP->surveykepuasan = $request['surveykepuasan'];
            $TP->biayapendidikan = $request['biayapendidikan'];
            $TP->tglpembayaran = $request['tglpembayaran'];
            $TP->nokwitansi = $request['nokwitansi'];
            $TP->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }


        if ($transStatus == 'true') {
            $transMessage = "Simpan Kegiatan Pendidikan";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $TP,
                'as' => 'asepic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'asepic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getRekapPegawai(Request $request)
    {
        $paramkategId = '';
        $paramjenisPegId = '';
        $paramstatusPegId = '';
        
        if(isset($request['kategId']) && $request['kategId']!=''){
            $paramkategId = ' and pg.kategorypegawai ='.$request['kategId'];
        }
        if(isset($request['statusPegId']) && $request['statusPegId']!=''){
            $paramstatusPegId = ' and pg.objectstatuspegawaifk ='.$request['statusPegId'];
        }
        if(isset($request['jenisPegId']) && $request['jenisPegId']!=''){
            $paramjenisPegId = ' and pg.objectjenispegawaifk ='.$request['jenisPegId'];
        }

        $data = DB::select(DB::raw("
            select * from (
                select  'Jenis Kelamin' as kategory , x.tipe,count ( x.id) as total 
                from (
                select jp.jeniskelamin as tipe ,pg.namalengkap ,pg.id
                from pegawai_m  as pg
                left JOIN jeniskelamin_m as jp on jp.id =pg.objectjeniskelaminfk
                where pg.statusenabled=1
                $paramkategId
                $paramstatusPegId 
                $paramjenisPegId 
                )as x GROUP BY x.tipe

                union all

                select 'Jenis Kepegawaian' as kategory  ,x.tipe ,count ( x.id) as total from (
                select jp.jenispegawai as tipe ,pg.namalengkap ,pg.id
                from pegawai_m  as pg
                left JOIN jenispegawai_m as jp on jp.id =pg.objectjenispegawaifk
                where pg.statusenabled=1
                 $paramkategId
                $paramstatusPegId 
                $paramjenisPegId 
                )as x GROUP BY x.tipe

                union all 

                select 'Agama' as kategory  ,x.tipe ,count ( x.id) as total from (
                select case when jp.agama is null then '-' else jp.agama end as tipe ,pg.namalengkap ,pg.id
                from pegawai_m  as pg
                left JOIN agama_m as jp on jp.id =pg.objectagamafk
                where pg.statusenabled=1
                 $paramkategId
                $paramstatusPegId 
                $paramjenisPegId 
                )as x GROUP BY x.tipe

                union all 

                select 'Pendidikan' as kategory  ,x.tipe ,count ( x.id) as total from (
                select case when jp.pendidikan is null then '-' else jp.pendidikan end as tipe ,pg.namalengkap ,pg.id
                from pegawai_m  as pg
                left JOIN pendidikan_m as jp on jp.id =pg.objectpendidikanterakhirfk
                where pg.statusenabled=1
                 $paramkategId
                $paramstatusPegId 
                $paramjenisPegId 
                )as x GROUP BY x.tipe
                union all 


                select 'Jenis Usia' as kategory  ,z.tipe ,count (z.tipe) as total from (
                select x.id,x.namalengkap, x.tgllahir,case when x.umur is null then '-' 
                when x.umur <= 20 then 'dibawah 20 Tahun' 
                when x.umur >  20 and x.umur <= 30 then '21 s/d 30 Tahun'
                when x.umur > 30 and x.umur <= 40 then '31 s/d 40 Tahun'
                when x.umur > 40 and x.umur <= 50 then '41 s/d 50 Tahun'
                when x.umur > 50 then 'diatas 51 Tahun'
                end as  tipe from (
                select pg.id,pg.namalengkap,pg.tgllahir ,
                CONVERT(int,ROUND(DATEDIFF(hour,pg.tgllahir,GETDATE())/8766.0,0)) AS umur
                from pegawai_m  as pg
                where pg.statusenabled=1
                 $paramkategId
                $paramstatusPegId 
                $paramjenisPegId 
                ) as x
                ) as z
                GROUP BY z.tipe
                 ) as xx order by xx.kategory,xx.total desc"));
        
        $result = array(
           
            'data' => $data,
            'message' => 'er@epic',
        );
        return $this->respond($result);
    }

    public function getDataInformasijabatanStruktural (Request $request) {
        $data = \DB::table('pegawai_m as pg')
            ->leftJoin('jabatan_m as jb','jb.id','=','pg.objectjabatanstrukturalfk')
            ->select(\DB::raw("pg.id as pegawaiid,pg.namalengkap,pg.tempatlahir,pg.tgllahir,pg.nippns,pg.objectjabatanstrukturalfk,jb.namajabatan"))
            ->where('pg.statusenabled',true)
            ->where('pg.kdprofile',12);

        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $data = $data->where('pg.id','=',$request['idPegawai']);
        }

        if(isset($request['JabatanStrukturalfk']) && $request['JabatanStrukturalfk']!="" && $request['JabatanStrukturalfk']!="undefined"){
            $data = $data->where('pg.objectjabatanstrukturalfk','=',$request['JabatanStrukturalfk']);
        }

        $data = $data->orderBy('pg.namalengkap');
        $data = $data->get();
        $result = array(
            'data'  => $data,
            'as' => 'ea@epic',
        );
        return $this->respond($result);
    }
     public function getPegawaiAll (Request $request) {
        $pegawai = \DB::table('pegawai_m as pg')
            ->leftJoin('jabatan_m as jb','jb.id','=','pg.objectjabatanfungsionalfk')
            ->leftJoin('subunitkerja_m as sub','sub.id','=','pg.objectsubunitkerjapegawaifk')
            
            ->select('pg.*','jb.namajabatan','sub.name as subunitkerja')
            ->where('pg.statusenabled',true)
            ->orderBy('pg.namalengkap')
            ->get();
        $jeniscuti = \DB::table('sdm_jeniscuti_m as pg')
            ->select('pg.*')
            ->where('pg.statusenabled',true)
            ->orderBy('pg.name')
            ->get();

         $arrayName = array(
            'pegawai' => $pegawai,
            'jeniscuti' => $jeniscuti,
         );
        return $this->respond($arrayName);
    }
    public function savePermohonanCuti(Request $request){
        DB::beginTransaction();
        $noPlanning = $this->generateCodeBySeqTable(new PlanningPegawaiStatus, 'noplanning', 11, 'P'.date('ym'));

        if ($noPlanning == ''){
            $transMessage = "Gagal mengumpukan data, Coba lagi.!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'as@epic',
            );
            return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        }

        try{

            if ($request['norec'] == ''){
                $TP = new PlanningPegawaiStatus();
                $TP->kdprofile = 12;
                $TP->statusenabled =true;
                $TP->norec = $TP->generateNewId();
            }else{
                $TP = PlanningPegawaiStatus::where('norec', $request['norec'])->first();
                $noPlanning =  $TP->noplanning ;
                $detailss = ListTanggalCuti::where('objectplanningpegawaistatusfk',$TP->norec)->delete();
            }
            $TP->noplanning = $noPlanning;
            $TP->objectpegawaifk = $request['objectpegawaifk'];
            $TP->objectstatuspegawaiplanfk = $request['statuspegawaiplan'];
            $TP->tglpengajuan = $request['tglpengajuan'];
            $TP->jumlahhari = $request['jumlah'];
            $TP->keterangan = $request['keteranganlain'];
            $TP->deskripsistatuspegawaiplan = $request['deskripsi'];
            $TP->keterangan = $request['keteranganlain'];
            $TP->alamatcuti = $request['alamatcuti'];

            $TP->save();
            
//            $sid    = "ACc6ac08ce1cc9096e0fd57a0c38801118";
//            $token  = "cada716b5a36721fd86832662bbd06fe";
//            $twilio = new Client($sid, $token);
//            $array =[
//                "whatsapp:+6285702123354",
//                "whatsapp:+6285702501576",
//                "whatsapp:+6281283757854",
//            ];
//            $i = 0;
//            foreach ($array as $arr){
//                $message = $twilio->messages
//                    ->create($array[$i], // to
//                        array(
//                            "from" => "whatsapp:+14155238886",
//                            "body" => "Permohonan ".$request['statuspegawaiplannama']." dari ".$request['objectpegawainama']." mulai tanggal ".$request['listtanggal']['0']['tgl']." dengan jumlah ".$request['jumlah']." hari, alasan: ".$request['deskripsi']."."
//                        )
//                    );
//                $i = $i+1;
//            }

// ini untuk notif telegram
            // $secret_token = "1298249516:AAEJsI61Wt23U6OO6z2rCF4dI8ifApQ0pTY";
            // $telegram_id = '-1001450592406';
            // $url = "https://api.telegram.org/bot" . $secret_token . "/sendMessage?parse_mode=html&chat_id=" . $telegram_id;
            // $url = $url . "&text=" . urlencode("Permohonan <b>".$request['statuspegawaiplannama']."</b> \n\nNama: <b>".$request['objectpegawainama']."</b> \nMulai tanggal <b>".$request['listtanggal']['0']['tgl']."</b> \nJumlah: <b>".$request['jumlah']." hari</b>, \nAlasan: <b>".$request['deskripsi']."</b>.");
            // $ch = curl_init();
            // $optArray = array(
            //     CURLOPT_URL => $url,
            //     CURLOPT_RETURNTRANSFER => true
            // );
            // curl_setopt_array($ch, $optArray);
            // $result = curl_exec($ch);
            // curl_close($ch);

// end notif telegram

            $details22 = [];
            foreach ($request['listtanggal'] as $item ){
                $details = new ListTanggalCuti();
                $details->norec = $details->generateNewId();
                $details->kdprofile = 12;
                $details->statusenabled =true;
                $details->approvalstatus = null;
                $details->objectplanningpegawaistatusfk =$TP->norec;
                $details->tgl = $item['tgl'];
                $details->save();
                $details22 []= $details;
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
                'result' => $TP,
                'detail' => $details22,
                'as' => 'er@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getPermohonanCuti (Request $request) {
        $data =\DB::table('planningpegawaistatus_t as pps')
            ->leftJoin('pegawai_m as pg','pg.id','=','pps.objectpegawaifk')
            ->leftJoin('sdm_jeniscuti_m as jc','jc.id','=','pps.objectstatuspegawaiplanfk')
            ->leftJoin('jabatan_m as jb','jb.id','=','pg.objectjabatanstrukturalfk')
            ->leftJoin('unitkerja_m as ukp','ukp.id','=','pg.objectunitkerjafk')
            ->select( 'pps.norec','pps.noplanning','pps.tglpengajuan','pps.objectpegawaifk','pps.objectstatuspegawaiplanfk',
                'pps.deskripsistatuspegawaiplan as desk','pps.keterangan','pg.namalengkap','jc.name as statuspermohonan',
                'jb.namajabatan','ukp.unitkerja','pps.approvalstatus')
            ->where('pps.statusenabled',true)
            ->orderBy('pps.tglpengajuan');

        if(isset($request['namaLengkap']) && $request['namaLengkap']!="" && $request['namaLengkap']!="undefined"){
            $data = $data->where('pg.namalengkap','ilike','%'.$request['namaLengkap'].'%');
        }
        if(isset($request['pgId']) && $request['pgId']!="" && $request['pgId']!="undefined"){
            $data = $data->where('pg.id','=',$request['pgId']);
        }
        if(isset($request['unitKerjaId']) && $request['unitKerjaId']!="" && $request['unitKerjaId']!="undefined"){
            $data = $data->where('ukp.id','=',$request['unitKerjaId']);
        }
        if(isset($request['subUnitId']) && $request['subUnitId']!="" && $request['subUnitId']!="undefined"){
            $data = $data->where('pg.objectsubunitkerjapegawaifk','=',$request['subUnitId']);
        }
        if(isset($request['kedudukanId']) && $request['kedudukanId']!="" && $request['kedudukanId']!="undefined"){
            $data = $data->where('pg.kedudukanfk','=',$request['kedudukanId']);
        }
        if(isset($request['statusPegawaiId']) && $request['statusPegawaiId']!="" && $request['statusPegawaiId']!="undefined"){
            $data = $data->where('pg.objectstatuspegawaifk','=',$request['statusPegawaiId']);
        }
        if(isset($request['qstatusApprove']) && $request['qstatusApprove']!="" && $request['qstatusApprove']!="undefined" ){
            if($request['qstatusApprove'] == 0){
                $data = $data->whereNull('pps.approvalstatus');
            }else{
                $data = $data->where('pps.approvalstatus','=',$request['qstatusApprove']);
            }
        }
        if(isset($request['qPermohonan']) && $request['qPermohonan']!="" && $request['qPermohonan']!="undefined"){
            $data = $data->where('jc.id','=',$request['qPermohonan']);
        }

        if(isset($request['tglMasuk']) && $request['tglMasuk']!="" && $request['tglMasuk']!="undefined"){
            $tgl = $request['tglMasuk'];
            $data = $data->whereRaw("format(pg.tglmasuk,'yyyy-MM') = '$tgl'");
        }
        if(isset($request['rows']) && $request['rows']!="" && $request['rows']!="undefined"){
            $data = $data->take($request['rows']);
        }
        $data = $data->get();
        $data2 =[];

        foreach ($data as $item){
            $norec= $item->norec;
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

            $data2 [] =  array(
                'norec' => $item->norec,
                'noplanning' => $item->noplanning,
                'tglpengajuan' => $item->tglpengajuan,
                'objectpegawaifk' => $item->objectpegawaifk,
                'objectstatuspegawaiplanfk' => $item->objectstatuspegawaiplanfk,
                'desk' => $item->desk,
                'keterangan' => $item->keterangan,
                'namalengkap' => $item->namalengkap,
                'statuspermohonan' => $item->statuspermohonan,
                'namajabatan' => $item->namajabatan,
                'unitkerja' => $item->unitkerja,
                'approvalstatus' => $item->approvalstatus,
                'listtanggal' => $details,
                'listtanggalapprove' => $tglVerif,

            );
        }
        $result = array(
            'data'  => $data2,
            'as' => 'er@epic',
        );
        return $this->respond($result);
    }
    public function deletePermohonanCuti(Request $request){
        DB::beginTransaction();
        try{
            $TP = PlanningPegawaiStatus::where('norec',$request['norec'])->update(
                ['statusenabled' =>  false]
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
                'result' => $TP,
                'as' => 'er@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function verifCuti1(Request $request){
        DB::beginTransaction();

        try{

            foreach ($request['data'] as $item ){
                $data = ListTanggalCuti::where('norec', $item['norec'])->first();
                $details = ListTanggalCuti::where('norec', $item['norec'])->update(
                    [ 'approvalstatus' => 2 ]
                );

                $head = PlanningPegawaiStatus::where('norec', $data->objectplanningpegawaistatusfk )->update(
                    [ 'approvalstatus' => 2 ]
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
//                'result' => $TP,
                'as' => 'er@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }   
    public function verifCuti(Request $request){
        DB::beginTransaction();

        try{

            foreach ($request['data'] as $item ){
                $data = ListTanggalCuti::where('norec', $item['norec'])->first();
                $details = ListTanggalCuti::where('norec', $item['norec'])->update(
                    [ 'approvalstatus' => 1 ]
                );

                $head = PlanningPegawaiStatus::where('norec', $data->objectplanningpegawaistatusfk )->update(
                    [ 'approvalstatus' => 1 ]
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
//                'result' => $TP,
                'as' => 'er@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function unverifCuti(Request $request){
        DB::beginTransaction();

        try{

            $data = PlanningPegawaiStatus::where('norec',$request['norec'])->update(
                [ 'approvalstatus' => 1 ]
            );
            $detail =  ListTanggalCuti::where('objectplanningpegawaistatusfk',$request['norec'] )->update(
                [ 'approvalstatus' => 1 ]
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
//                'result' => $TP,
                'as' => 'er@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    
    public function savePermohonanCutiBersama(Request $request){
        DB::beginTransaction();


        try{

            $pegawai = Pegawai::where('statusenabled',true)->get();
            $tanggals = $request['listtanggal'];
            $arrayTgl = [];
            foreach ($tanggals as $tgl){
                $arrayTgl [] = $tgl['tgl'];
            }
            $delete =\DB::table('listtanggalcuti_t as list')
                ->select('pps.norec')
                ->Join('planningpegawaistatus_t as pps','pps.norec','=','list.objectplanningpegawaistatusfk')
                ->where('pps.objectstatuspegawaiplanfk',7)
                ->whereIn('list.tgl',$arrayTgl)
                ->get();
            if(count($delete) > 0){
                $arrNorec=[];
                foreach ($delete as $del){
                    $arrNorec[] = $del->norec;
                }
                $update = PlanningPegawaiStatus::whereIn('norec',$arrNorec)->delete();

            }

//            return $this->respond($delete);

            foreach ($pegawai as $pegawais){
                $noPlanning = $this->generateCodeBySeqTable(new PlanningPegawaiStatus, 'noplanning', 11, 'P'.date('ym'));

                if ($noPlanning == ''){
                    $transMessage = "Gagal mengumpukan data, Coba lagi.!";
                    DB::rollBack();
                    $result = array(
                        "status" => 400,
                        "message"  => $transMessage,
                        "as" => 'as@epic',
                    );
                    return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                }


                $TP = new PlanningPegawaiStatus();
                $TP->kdprofile = 12;
                $TP->statusenabled =true;
                $TP->norec = $TP->generateNewId();
                $TP->noplanning = $noPlanning;
                $TP->objectpegawaifk =  $pegawais->id;
                $TP->objectstatuspegawaiplanfk = 7;
                $TP->tglpengajuan = date('Y-m-d H:i:s');
//                $TP->jumlahhari = $request['jumlah'];
                $TP->keterangan = 'Cuti Bersama';
                $TP->approvalstatus = 1;
//                $TP->deskripsistatuspegawaiplan = $request['deskripsi'];

                $TP->save();

                foreach ($request['listtanggal'] as $item ){
                    $details = new ListTanggalCuti();
                    $details->norec = $details->generateNewId();
                    $details->kdprofile = 12;
                    $details->statusenabled =true;
                    $details->approvalstatus = 1;
                    $details->objectplanningpegawaistatusfk =$TP->norec;
                    $details->tgl = $item['tgl'];
                    $details->save();
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
                'result' => $TP,
                'as' => 'er@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getAbsesnsiPegawai (Request $request) {
        $data = \DB::table('pegawai_m as pg')
            ->Join('sdm_absensipegawai_t as abn','abn.pegawaifk','=','pg.id')
            ->select('pg.namalengkap','abn.*')
            ->where('pg.statusenabled',true)
            ->where('abn.statusenabled',true);

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('abn.jammasuk', '>=', $request['tglAwal']);
        }

        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];//." 23:59:59";
            $data = $data->where('abn.jammasuk', '<=', $tgl);
        }

        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $data = $data->where('pg.id','=',$request['idPegawai']);
        }
        if(isset($request['bulan']) && $request['bulan']!="" && $request['bulan']!="undefined"){
            $bln = $request['bulan'];
            $data = $data->whereRaw("format(abn.jammasuk,'yyyy-MM')= '$bln'");
        }

        $data = $data->orderBy('abn.jammasuk');
        $data = $data->get();



        $result = array(
            'data'  => $data,
            'as' => 'er@epic',
        );
        return $this->respond($result);
    }
    public function saveAbsensi(Request $request){
        DB::beginTransaction();
        try{

            $pegawaifk = $request['pegawaifk']['id'];
            $tglAbsen = substr( $request['absen'][0]['tglabsen'],0,7);
//            return $this->respond($tglAbsen);
//            return $this->respond($pegawaifk);
            $delete = DB::delete("delete from sdm_absensipegawai_t where pegawaifk='$pegawaifk' and  bulan='$tglAbsen' ");

            foreach ($request['absen'] as $item){
                $TP = new SDM_AbsensiPegawai();
                $TP->kdprofile = 12;
                $TP->statusenabled =true;
                $TP->norec = $TP->generateNewId();
                $TP->jamkeluar =$item['jampulang']!=null? $item['tglabsen']. ' '.$item['jampulang']: null;
                $TP->jammasuk = $item['jammasuk']!= null ? $item['tglabsen']. ' '. $item['jammasuk'] : null;
                $TP->pegawaifk = $request['pegawaifk']['id'];
                $TP->tglhistori = date('Y-m-d H:i:s');
                $TP->mesinmasuk =$item['mesinmasuk'];
                $TP->mesinpulang = $item['mesinpulang'];
                $TP->bulan = substr($item['tglabsen'],0,7);
                $TP->status = $item['status'];
                $TP->kwk = $item['kwk'];

                $TP->save();

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
                'result' => $TP,
                'as' => 'er@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getPegawaiByUnitKerja (Request $request) {
        $data = \DB::table('mapunitkerjatopegawai_m as mpkp')
            ->Join('pegawai_m as pg','pg.id','=','mpkp.pegawaifk')
            ->Join('unitkerjapegawai_m as uk','uk.id','=','mpkp.unitkerjafk')
//            ->leftJoin('sdm_kelompokshift_m as ks','ks.id','=','pg.objectshiftkerja')
//            ->select(\DB::raw("pg.id,pg.namalengkap,pg.objectshiftkerja,pg.objectunitkerjapegawaifk,uk.name as unitkerja,
//			                         ks.kelompokshiftkerja"))
            ->select(\DB::raw("pg.id,pg.namalengkap,mpkp.unitkerjafk,uk.name AS unitkerja"))
            ->where('pg.statusenabled',true)
            ->orderBy('pg.namalengkap');

        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $data = $data->where('pg.id','=',$request['idPegawai']);
        }
        if(isset($request['unitkerjaid']) && $request['unitkerjaid']!="" && $request['unitkerjaid']!="undefined"){
            $data = $data->where('uk.id','=',$request['unitkerjaid']);
        }
        $data = $data->get();
        $result = [];
        $bulanTahun = $request['bulantahun'];
        foreach ($data as $key => $value) {
            $idPegawai= $value->id;
            $details = \DB::select(\DB::raw("select jd.*,jk.kode
                    from jadwalkerjapegawai_t as jd 
                    join jamkerja_m as jk on jk.id=jd.jadwalkerjafk
                    where format(tanggal,'yyyy-MM') = '$bulanTahun'
                    and pegawaifk='$idPegawai'
                    and jd.statusenabled=1
                    "));
            $result [] = array(
                'id' => $value->id,
                'namalengkap' => $value->namalengkap,
                'unitkerjafk' => $value->unitkerjafk,
                'unitkerja' => $value->unitkerja,
                'jadwalkerja' => $details,
              
            );
        }
        return $this->respond($result);
    }

    public function getJadwalAbasensiCbo (Request $request){
        $UnitKerja = UnitKerjaPegawai::where('statusenabled',true)->get();
        $SubUnitKerja = SubUnitKerja::where('statusenabled',true)->get();
        $DataUnitkerja=[];
        foreach ($UnitKerja as $item) {
            $detail = [];
            foreach ($SubUnitKerja as $item2) {
                if ($item->id == $item2->objectunitkerjapegawaifk) {
                    $detail[] = array(
                        'id' => $item2->id,
                        'name' => $item2->name,
                    );
                }
            }

            $DataUnitkerja[] = array(
                'id' => $item->id,
                'name' => $item->name,
                'subunit' => $detail,
            );
        }


        $Shift = \DB::table('shiftkerja_m as pk')
            ->where('pk.statusenabled', true)
            ->orderBy('pk.namashift')
            ->get();

        $jenisSK = \DB::table('jeniskeputusan_m as pk')
            ->where('pk.statusenabled', true)
            ->orderBy('pk.jeniskeputusan')
            ->get();

        $UnitKerjaPegawai = \DB::table('unitkerjapegawai_m as pk')
            ->where('pk.statusenabled', true)
//            ->where('pk.kdprofile', 12)
            ->orderBy('pk.name')
            ->get();

        $ShiftKerja = SdmShiftKerja::where('statusenabled', true)->get();
        $JamKerja = JamKerja::where('statusenabled', true)->get();
        $result = array(
            'unitkerjapegawai' => $UnitKerjaPegawai,
            'subunitkerja' => $SubUnitKerja,
            'dataunitkerja' => $DataUnitkerja,
            'shiftkerja' => $ShiftKerja,
            'shiftpegawai' => $Shift,
            'jeniskeputusan' => $jenisSK,
            'jamkerja' => $JamKerja,
            'by' => 'er@epic',
        );

        return $this->respond($result);
    }
    public function getSuratKeputusan (Request $request) {
        $data = \DB::table('suratkeputusan_m as sk')
            ->Join('jeniskeputusan_m as jk','jk.id','=','sk.objectjeniskeputusanfk')
            ->leftJoin('pegawai_m as pg','pg.id','=','sk.objectpegawaiobjekskfk')
            ->select('sk.id','sk.namask','sk.keteranganlainnya','sk.nosk','sk.nosk_intern','sk.tglttsk as tgl','jk.jeniskeputusan',
                'sk.objectjeniskeputusanfk','sk.objectpegawaiobjekskfk as pegawaifk','pg.namalengkap','sk.namaexternal as filename' )
            ->where('sk.statusenabled',true)
            ->where('sk.nosk_intern','SDM')
            ->orderBy('sk.namask');

        $data = $data->get();
        $result = array(
            'data'  => $data,
            'as' => 'er@epic',
        );
        return $this->respond($result);
    }
    public function saveSuratKeputusan(Request $request){
        \DB::beginTransaction();
        try {
            $newID = SuratKeputusan::max('id') + 1;

            if ($request['id'] == ""){
                $new = new SuratKeputusan();
                $new->id = $newID ;
                $new->kdprofile = 11;
                $new->statusenabled=1;
                $new->norec = $new->generateNewId();

            }else{
                $new = SuratKeputusan::where('id', $request['id'])
                    ->first();
                $newID = $new->id;
            }

            $upload = $request->file('file');
            if(!empty($upload)){
                $ext = $upload->getClientOriginalExtension();
                $filename = $request['nosk'] .'-' . $request['namask'].'.'.$ext;
                $new->namaexternal = $filename;
            }

            $new->objectjeniskeputusanfk=$request['jenissk'];
            $new->keteranganlainnya=$request['keterangan'];
            $new->namask =$request['namask'];
            $new->nosk = $request['nosk'];
            $new->nosk_intern = 'SDM';
            $new->objectpegawaiobjekskfk =$this->getCurrentUserID();
            $new->tglttsk = $request['tgl'];
            $new->save();
            $norec =  $new->id ;
            if(!empty($upload)) {
                $request->file('file')->move('SDM/SuratKeputusan/'.$newID,
                    $filename);
            }


            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus = 'true') {
            $transMessage = "Sukses ";
            \DB::commit();
            $result = array(
                "status" => 201,
                "norec" => $new,
                "by" => 'er@epic',
            );
        } else {
            $transMessage = "Simpan SK Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'er@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function deleteSuratKeputusan(Request $request){

        try {
            $filename = $request['namafile'];
            $path = public_path('SDM/SuratKeputusan/'.$request['id'].'/');

            if (!\File::exists($path)) {
//                abort(404);
            }else{
                $file = \File::deleteDirectory($path);
            }



            SuratKeputusan::where('id', $request['id'])->delete();
            $transMessage = "Sukses ";
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Hapus Gagal";
        }

        if ($transStatus != 'false') {

            \DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "by" => 'er@epic',
            );
        } else {
            DB::rollBack();
            $result = array(

                "status" => 400,
                "message" => $transMessage,
                "by" => 'er@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getShiftKerja (Request $request) {
        $data = \DB::select(DB::raw("SELECT sh.id,sh.kodeexternal,sh.namashift,sh.jammasuk,sh.jampulang,
            sh.factorrate,ks.kelompokshiftkerja,sh.objectkelompokshiftfk,sh.waktuistirahat
             FROM shiftkerja_m as sh
            join sdm_kelompokshift_m as ks on sh.objectkelompokshiftfk=ks.id
            where sh.statusenabled=1
            "));


        $result = array(
            'data'  => $data,
            'as' => 'er@epic',
        );
        return $this->respond($result);
    }
    public function saveShiftKerja(Request $request){
        DB::beginTransaction();
        try{
            if($request['id'] == ''){
                $newId = ShiftKerja::max('id') + 1;
                $newMod = new ShiftKerja();
                $newMod->id = $newId;
                $newMod->norec = $newMod->generateNewId();
            }else{
                $newMod = ShiftKerja::where('id',$request['id'])->first();
            }
            if($request['statusenabled'] == 'true' ){
                $newMod->statusenabled = $request['statusenabled'];
                $newMod->kodeexternal = $request['kodeexternal'];
                $newMod->namashift = $request['namashift'];
                $newMod->jammasuk = $request['jammasuk'];
                $newMod->jampulang = $request['jampulang'];
                $newMod->factorrate = $request['factorrate'];
                $newMod->objectkelompokshiftfk = $request['kelompokshift']['id'];
                $newMod->waktuistirahat = $request['waktuistirahat'];
            }else{
                $newMod->statusenabled = $request['statusenabled'];
            }
            $newMod->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'as' => 'er@epic',
            );
        } else {
            $transMessage = "Data Gagal Disimpan";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'as' => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }

    public function getComboPegawai (Request $request){
        $paket = Pegawai::where('statusenabled',true)->get();
        //$produk = Produk::where('statusenabled',true)->get();
        $produk = DB::table('pegawai_m as pg')
//            ->join('produk_m as prd','prd.id','=','hnp.objectprodukfk')
            ->select('pg.id','pg.nama')
            ->where('pg.statusenabled',true)
//            ->where('prd.statusenabled',true)
            ->orderBy('pg.nama')
            ->whereNotIn('pg.id',[2,890,3,1])
            ->distinct()
            ->get();
        $result = array(
            'paket' => $paket,
            'produk' => $produk,
            'as' => 'inhuman'
        );
        return $this->respond($result);
    }

    public function getMappingPegawai (Request $request){
        $paket = DB::table('mapunitkerjatopegawai_m as mukp')
            ->join('pegawai_m as pg','pg.id','=','mukp.pegawaifk')
            ->join('unitkerjapegawai_m as ukp','ukp.id','=','mukp.unitkerjafk')
            ->select('mukp.*','pg.nama','ukp.name')
            ->where('mukp.statusenabled',true);

        if(isset($request['paketId']) && $request['paketId'] !='' ){
            $paket = $paket->where('mukp.unitkerjafk',$request['paketId']);
        }
        if(isset($request['namaProduk']) && $request['namaProduk'] !='' ){
            $paket = $paket->where('pg.nama','ilike','%'.$request['namaProduk'].'%');
        }
        $paket = $paket->get();
        $result = array(
            'data' => $paket,
            'as' => 'khris@epic'
        );
        return $this->respond($result);
    }

    public function saveMapPegawaiToUnit(Request $request)
    {

        DB::beginTransaction();
        try {
            foreach ( $request['details'] as $item){
                $kode[] = (double) $item['id'];

            }

            $hapus = MapPegawaiToUnit::where('statusenabled',true)
                ->where('unitkerjafk',$request['paketId'])
                ->whereIn('pegawaifk',$kode)
                ->delete();
            foreach ( $request['details'] as $item){
                $map = new MapPegawaiToUnit();
                $map->id = MapPegawaiToUnit::max('id') + 1;
                $map->kdprofile = 12;
                $map->statusenabled = true;
                $map->norec =  substr(\Webpatser\Uuid\Uuid::generate(), 0, 32);
                $map->unitkerjafk = $request['paketId'];
                $map->pegawaifk = $item['id'];
                $map->save();
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
                'data' => $map,
                'as' => 'khris@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'as' => 'khris@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function DeleteMapPegawaiToUnit(Request $request)
    {

        DB::beginTransaction();
        try {
            foreach ($request['data'] as $item){
                MapPegawaiToUnit::where('id',$item['id'])->delete();
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
//                'data' => $map,
                'as' => 'er@epic',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'as' => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
      public function saveJadwalKerjaPegawai(Request $request){
        DB::beginTransaction();
        try{
            
            foreach ( $request['data'] as $item){
                $pegawaiId[] = (int) $item['pegawai']['id'];
                $jadwal[] = (int) $item['shift']['id'];
                $tanggal[] = $item['tanggal']['dateformat'];
            }
            // return $this->respond($pegawaiId);

            $hapus = JadwalKerjaPegawai::where('statusenabled',true)
                ->where('unitkerjafk',$request['unitkerjafk'])
                ->whereIn('pegawaifk',$pegawaiId)
                ->whereIn('jadwalkerjafk',$jadwal)
                ->whereIn('tanggal',$tanggal)
                ->delete();

            foreach ($request['data'] as $key) {
                $new = new JadwalKerjaPegawai();
                $new->kdprofile = 12;
                $new->statusenabled = true;
                $new->norec =  $new->generateNewId();
                $new->pegawaifk = $key['pegawai']['id'];
                $new->jadwalkerjafk = $key['shift']['id'];
                $new->tanggal = $key['tanggal']['dateformat'];
                $new->unitkerjafk = $request['unitkerjafk'];
                $new->save();
            }


           $transStatus = 'true';
        } catch (\Exception $e) {
          $transStatus = 'false';
        }
        if ($transStatus = 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                "status" => 201,
                "norec" => $new,
                "by" => 'er@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'er@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getJamKerja (Request $request) {
        $data = \DB::select(DB::raw("
  SELECT * FROM jamkerja_m
  WHERE statusenabled = 1
            "));


        $result = array(
            'data'  => $data,
            'as' => 'er@epic',
        );
        return $this->respond($result);
    }

    public function saveJamKerja(Request $request){
        DB::beginTransaction();
        try{
            if($request['id'] == ''){
                $newId = JamKerja::max('id') + 1;
                $newMod = new JamKerja();
                $newMod->id = $newId;
                $newMod->norec = $newMod->generateNewId();
            }else{
                $newMod = JamKerja::where('id',$request['id'])->first();
            }
            if($request['statusenabled'] == 'true' ){
                $newMod->statusenabled = $request['statusenabled'];
                $newMod->kode = $request['kode'];
                $newMod->jamkerja = $request['jamkerja'];
                $newMod->jammasuk = $request['jammasuk'];
                $newMod->jampulang = $request['jampulang'];
                $newMod->deskripsi = $request['deskripsi'];
            }else{
                $newMod->statusenabled = $request['statusenabled'];
            }
            $newMod->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'as' => 'er@epic',
            );
        } else {
            $transMessage = "Data Gagal Disimpan";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'as' => 'er@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveJadwalKerjaPegawaiMingguan(Request $request){
        DB::beginTransaction();
//        try{
              foreach ($request['listpegawai'] as $item){
                  foreach ($request['tanggal'] as $itemTgl){
                      foreach ($itemTgl as $setTgl){
//                          $hapus = JadwalKerjaPegawai::where('statusenabled',true)
//                           ->where('unitkerjafk',$request['unitkerja'])
//                           ->whereIn('pegawaifk',$item['id'])
//                           ->whereIn('jadwalkerjafk',$request['jamkerja'])
//                           ->whereIn('tanggal',$setTgl['tanggal'])
////                           ->delete();
//                          ->get();
//                          return $this->respond($hapus);

                          $new = new JadwalKerjaPegawai();
                          $new->kdprofile = 12;
                          $new->statusenabled = true;
                          $new->norec =  $new->generateNewId();
                          $new->pegawaifk = $item['id'];
                          $new->jadwalkerjafk = $request['jamkerja'];
                          $new->unitkerjafk = $request['unitkerja'];
                          $new->tanggal = $setTgl['tanggal'];
                          $new->save();
                      }
                  }
              }

//            $transStatus = 'true';
//        } catch (\Exception $e) {
            $transStatus = 'false';
//        }
          if ($transStatus = 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "norec" => $new,
                "by" => 'ea@epic',
            );
          } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'ea@epic',
            );
          }

          return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function updateSIPSTR(Request $request){
        DB::beginTransaction();
        try{
        $data = MasaBerlakuSipStr::where('norec', $request['norec'])->update([  'nosip'=>$request['nosip'],
                                                                                'terbitsip'=>$request['terbitsip'],
                                                                                'nostr'=>$request['nostr'],
                                                                                'terbitstr'=>$request['terbitstr'],
                                                                                'berakhirsip'=>$request['berakhirsip'],
                                                                                'berakhirstr'=>$request['berakhirstr'],
                                                                                'keterangan'=>$request['keteranganstr']
                                                                            ]);

        $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        if ($transStatus = 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "norec" => $data,
                "message"=> $transMessage,
                "by" => 'dy@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'dy@epic',
            );
        }

        return $this->respond($result);
    }

    public function getPetugasDiklat(Request $request) {
        $data = DB::select(DB::raw("SELECT * FROM petugasdiklat_m"));

        $result = array(
            "data" => $data,
            "by" => 'dy@epic',
        );

        return $this->respond($result);
    }

    public function getMapPegawaiToAtasan(Request $request) {
        $data = DB::select(DB::raw("SELECT pg.id AS idpegawai, pg.namalengkap AS namapegawai, kp.kategorypegawai, mpa.norec, 
                mpa.objectpegawaiatasan1fk AS idatasan1, pg1.namalengkap AS namaatasan1, mpa.objectpegawaiatasan2fk AS idatasan2, pg2.namalengkap AS namaatasan2
                FROM pegawai_m AS pg
                INNER JOIN kategorypegawai_m AS kp ON kp.id = pg.kategorypegawai
                LEFT JOIN mappegawaitoatasan_t AS mpa ON mpa.objectpegawaifk = pg.id
                LEFT JOIN pegawai_m AS pg1 ON pg1.id = mpa.objectpegawaiatasan1fk
                LEFT JOIN pegawai_m AS pg2 ON pg2.id = mpa.objectpegawaiatasan2fk
                WHERE pg.kategorypegawai = 20
                AND pg.statusenabled = 1"));

        $result =   [
                        "data" => $data,
                        "by" => "dy"
                    ];
        
        return $this->respond($result);
    }

    public function saveAtasan1 (Request $request) {
        DB::beginTransaction();
        try{
            if ($request['norec'] == "" || $request['norec'] == null){
                $saveAtasan = new MapPegawaiToAtasan();
                $saveAtasan->norec = $saveAtasan->generateNewID();
                $saveAtasan->kdprofile = 12;
                $saveAtasan->statusenabled = 1;
                $saveAtasan->objectpegawaifk = $request['idpegawai'];
                $saveAtasan->objectpegawaiatasan1fk = $request['atasan1'];
                $saveAtasan->save();
            } else {
                $saveAtasan = MapPegawaiToAtasan::where('norec', $request['norec'])->update(['objectpegawaiatasan1fk' => $request['atasan1']]);
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        if ($transStatus = 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message"=> $transMessage,
                "by" => 'dy@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'dy@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveAtasan2 (Request $request) {
        DB::beginTransaction();
        try{
            if ($request['norec'] == "" || $request['norec'] == null){
                $saveAtasan = new MapPegawaiToAtasan();
                $saveAtasan->norec = $saveAtasan->generateNewID();
                $saveAtasan->kdprofile = 12;
                $saveAtasan->statusenabled = 1;
                $saveAtasan->objectpegawaifk = $request['idpegawai'];
                $saveAtasan->objectpegawaiatasan2fk = $request['atasan2'];
                $saveAtasan->save();
            } else {
                $saveAtasan = MapPegawaiToAtasan::where('norec', $request['norec'])->update(['objectpegawaiatasan2fk' => $request['atasan2']]);
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        if ($transStatus = 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message"=> $transMessage,
                "by" => 'dy@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'dy@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getPermohonanCutiVerif (Request $request) {
        $data =\DB::table('planningpegawaistatus_t as pps')
            ->leftJoin('pegawai_m as pg','pg.id','=','pps.objectpegawaifk')
            ->leftJoin('sdm_jeniscuti_m as jc','jc.id','=','pps.objectstatuspegawaiplanfk')
            ->leftJoin('jabatan_m as jb','jb.id','=','pg.objectjabatanstrukturalfk')
            ->leftJoin('unitkerja_m as ukp','ukp.id','=','pg.objectunitkerjafk')
            ->leftJoin('mappegawaitoatasan_t as mpa', 'mpa.objectpegawaifk', '=', 'pg.id')
            ->leftJoin('pegawai_m as pg1', 'pg1.id', '=', 'mpa.objectpegawaiatasan1fk')
            ->leftJoin('pegawai_m as pg2', 'pg2.id', '=', 'mpa.objectpegawaiatasan2fk')
            ->select( 'pps.norec','pps.noplanning','pps.tglpengajuan','pps.objectpegawaifk','pps.objectstatuspegawaiplanfk',
                'pps.deskripsistatuspegawaiplan as desk','pps.keterangan','pg.namalengkap','jc.name as statuspermohonan',
                'jb.namajabatan','ukp.unitkerja','pps.approvalstatus')
            ->where('pps.statusenabled',true)
            ->orderBy('pps.tglpengajuan');

        if(isset($request['namaLengkap']) && $request['namaLengkap']!="" && $request['namaLengkap']!="undefined"){
            $data = $data->where('pg.namalengkap','ilike','%'.$request['namaLengkap'].'%');
        }
        if(isset($request['pgId']) && $request['pgId']!="" && $request['pgId']!="undefined"){
            $data = $data->where('pg.id','=',$request['pgId']);
        }
        if(isset($request['unitKerjaId']) && $request['unitKerjaId']!="" && $request['unitKerjaId']!="undefined"){
            $data = $data->where('ukp.id','=',$request['unitKerjaId']);
        }
        if(isset($request['subUnitId']) && $request['subUnitId']!="" && $request['subUnitId']!="undefined"){
            $data = $data->where('pg.objectsubunitkerjapegawaifk','=',$request['subUnitId']);
        }
        if(isset($request['kedudukanId']) && $request['kedudukanId']!="" && $request['kedudukanId']!="undefined"){
            $data = $data->where('pg.kedudukanfk','=',$request['kedudukanId']);
        }
        if(isset($request['statusPegawaiId']) && $request['statusPegawaiId']!="" && $request['statusPegawaiId']!="undefined"){
            $data = $data->where('pg.objectstatuspegawaifk','=',$request['statusPegawaiId']);
        }
        // if(isset($request['qstatusApprove']) && $request['qstatusApprove']!="" && $request['qstatusApprove']!="undefined" ){
        //     if($request['qstatusApprove'] == 0){
        //         $data = $data->whereNull('pps.approvalstatus');
        //     }else{
        //         $data = $data->where('pps.approvalstatus','=',$request['qstatusApprove']);
        //     }
        // }
        if(isset($request['jabatanLogin']) && $request['jabatanLogin']!="" && $request['jabatanLogin']!="undefined" ){
            if($request['jabatanLogin'] == 'atasan1'){
                $data = $data->whereNull('pps.approvalstatus');
                $data = $data->where('pg1.id', '=', $request['idPegawai']);
                $approvalstatus = null;
            }if($request['jabatanLogin'] == 'atasan2'){
                $data = $data->where('pps.approvalstatus','=','1');
                $data = $data->where('pg2.id', '=', $request['idPegawai']);
                $approvalstatus = 1;
            }if($request['jabatanLogin'] == 'management'){
                $data = $data->where('pps.approvalstatus','=','2');
                $approvalstatus = 2;
            }if($request['jabatanLogin'] == 'sdm'){
                $data = $data->where('pps.approvalstatus','=','2');
                $approvalstatus = 3;
            }if($request['jabatanLogin'] == '-'){
                $data = $data->where('pps.approvalstatus','=',"'-'");
            }
        };
        if(isset($request['qPermohonan']) && $request['qPermohonan']!="" && $request['qPermohonan']!="undefined"){
            $data = $data->where('jc.id','=',$request['qPermohonan']);
        }

        if(isset($request['tglMasuk']) && $request['tglMasuk']!="" && $request['tglMasuk']!="undefined"){
            $tgl = $request['tglMasuk'];
            $data = $data->whereRaw("format(pps.tglpengajuan,'yyyy-MM') = '$tgl'");
        }
        if(isset($request['rows']) && $request['rows']!="" && $request['rows']!="undefined"){
            $data = $data->take($request['rows']);
        }
        $data = $data->get();
        $data2 =[];

        foreach ($data as $item){
            $norec= $item->norec;
            $details = DB::select(DB::raw("select * from listtanggalcuti_t where objectplanningpegawaistatusfk='$norec'"));
            $detailsverif = DB::select(DB::raw("select * from listtanggalcuti_t where objectplanningpegawaistatusfk='$norec' and approvalstatus='$approvalstatus'"));
            $tglVerif = [];
            foreach ($detailsverif as $itmde){
                if( $itmde-> approvalstatus == $approvalstatus){
                    $tglVerif [] = array(
                        'norec' => $itmde->norec,
                        'tgl' => $itmde->tgl,
                        'approvalstatus' => $itmde->approvalstatus,
                        'objectplanningpegawaistatusfk' => $itmde->objectplanningpegawaistatusfk
                    );
                }

            }

            $data2 [] =  array(
                'norec' => $item->norec,
                'noplanning' => $item->noplanning,
                'tglpengajuan' => $item->tglpengajuan,
                'objectpegawaifk' => $item->objectpegawaifk,
                'objectstatuspegawaiplanfk' => $item->objectstatuspegawaiplanfk,
                'desk' => $item->desk,
                'keterangan' => $item->keterangan,
                'namalengkap' => $item->namalengkap,
                'statuspermohonan' => $item->statuspermohonan,
                'namajabatan' => $item->namajabatan,
                'unitkerja' => $item->unitkerja,
                'approvalstatus' => $item->approvalstatus,
                'listtanggal' => $details,
                'listtanggalapprove' => $tglVerif,

            );
        }
        $result = array(
            'data'  => $data2,
            'as' => 'dy@epic',
        );
        return $this->respond($result);
    }

    public function getJabatanLogin(Request $request){
        $data = DB::select(DB::raw("
        SELECT x.id, x.kelompokuser FROM (
            SELECT pg.id, ku.kelompokuser
            FROM kelompokuser_s AS ku 
            INNER JOIN loginuser_s AS lu ON lu.objectkelompokuserfk = ku.id
            INNER JOIN pegawai_m AS pg ON pg.id = lu.objectpegawaifk
            WHERE ku.kelompokuser IN ('sdm','management')
            
            UNION 
            
            SELECT pg.id, 'atasan1' AS kelompokuser
            FROM pegawai_m AS pg
            INNER JOIN mappegawaitoatasan_t AS map ON map.objectpegawaiatasan1fk = pg.id
            
            UNION 
            
            SELECT pg.id, 'atasan2' AS kelompokuser
            FROM pegawai_m AS pg
            INNER JOIN mappegawaitoatasan_t AS map ON map.objectpegawaiatasan2fk = pg.id
            ) AS x
            WHERE x.id = ".$request['idPegawai']."
        "));

        $result = [
            'data' => $data,
            'as' => 'dy@epic'
        ];

        return $this->respond($result);
    }

    public function verifCutiPerTingkat(Request $request){
        DB::beginTransaction();
        try{
            if($request['jabatanLogin'] == 'atasan1'){
                $verifCutiPerTingkat = PlanningPegawaiStatus::where('norec', $request['norechead'])->update(['approvalstatus' => 1]);
                foreach ($request['data'] as $item ){
                    $data = ListTanggalCuti::where('norec', $item['norec'])->first();
                    $details = ListTanggalCuti::where('norec', $item['norec'])->update(
                        [ 'approvalstatus' => 1 ]
                    );
                }
                $transStatus = 'true';
            }else if($request['jabatanLogin'] == 'atasan2'){
                $verifCutiPerTingkat = PlanningPegawaiStatus::where('norec', $request['norechead'])->update(['approvalstatus' => 2]);
                foreach ($request['data'] as $item ){
                    $data = ListTanggalCuti::where('norec', $item['norec'])->first();
                    $details = ListTanggalCuti::where('norec', $item['norec'])->update(
                        [ 'approvalstatus' => 2 ]
                    );
                }
                $transStatus = 'true';
            }else if($request['jabatanLogin'] == 'management'){
                $verifCutiPerTingkat = PlanningPegawaiStatus::where('norec', $request['norechead'])->update(['approvalstatus' => 3]);
                foreach ($request['data'] as $item ){
                    $data = ListTanggalCuti::where('norec', $item['norec'])->first();
                    $details = ListTanggalCuti::where('norec', $item['norec'])->update(
                        [ 'approvalstatus' => 3 ]
                    );
                }
                $transStatus = 'true';
            }else if($request['jabatanLogin'] == 'sdm'){
                $verifCutiPerTingkat = PlanningPegawaiStatus::where('norec', $request['norechead'])->update(['approvalstatus' => 4]);
                foreach ($request['data'] as $item ){
                    $data = ListTanggalCuti::where('norec', $item['norec'])->first();
                    $details = ListTanggalCuti::where('norec', $item['norec'])->update(
                        [ 'approvalstatus' => 4 ]
                    );
                }
                $transStatus = 'true';
            }else{
                $transStatus = 'false';
            };

        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message"=> $transMessage,
                "operasi" => "verif oleh " . $request['jabatanLogin'] . " berhasil!",
                "by" => 'dy@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "operasi" => "verif oleh " . $request['jabatanLogin'] . " gagal!",
                "by" => 'dy@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getIstriSuami(Request $request) {
        $data = \DB::table('keluargapegawai_m as kp')
            ->select(DB::raw("
            case when kp.objectkdhubunganfk = 5 then 'Nama Suami' else 'Nama Istri' end as jenis, kp.namalengkap
            "))
            ->where('kp.objectpegawaifk', $request['idPegawai'])
            ->whereIn('kp.objectkdhubunganfk', [5,2])
            ->get();

        return $this->respond($data);
    }
    public function getJumlahAnak(Request $request) {
        $data = \DB::table('keluargapegawai_m as kp')
            ->select(DB::raw("
            sum(case when kp.objectkdhubunganfk = 3 then 1 else 0 end) as jumlahanak
            "))
            ->where('kp.objectpegawaifk', $request['idPegawai'])
            ->where('kp.objectkdhubunganfk', 3)
            ->get();

        return $this->respond($data);
    }
    public function getAnak(Request $request) {
        $data = \DB::table('keluargapegawai_m as kp')
            ->select('kp.namalengkap')
            ->where('kp.objectpegawaifk', $request['idPegawai'])
            ->whereIn('kp.objectkdhubunganfk', [3,8,9])
            ->get();

            $i = 1;
            $namaanak = '';
        foreach($data as $item) {
            $namaanak2 = $i . '. ' . $item->namalengkap . "\n";
            $namaanak = $namaanak . $namaanak2;
            $i++;
        };

        $result = array (
            'namalengkap' => $namaanak
        );
        return $this->respond($result);
    }
    public function getPendidikan(Request $request) {
        $data = \DB::table('riwayatpendidikan_t as rp')
            ->join('pendidikan_m as p', 'p.id', '=', 'rp.objectpendidikanfk')
            ->select('p.pendidikan','p.id','rp.jurusan', DB::raw("to_char(rp.tgllulus, 'yyyy') as tgllulus"))
            ->where('rp.objectpegawaifk', $request['idPegawai'])
            ->orderBy('rp.tgllulus', 'asc')
            ->get();

            $i = 1;
            $pendidikan = '';
            $tahun = '';
            foreach($data as $item) {
                if ($item->id == 4 || $item->id == 5 || $item->id == 6 || $item->id == 7 || $item->id == 8 || $item->id == 9 || $item->id == 10 || $item->id == 11 || $item->id == 24  || $item->id == 26 || $item->id == 27) {
                    $pendidikan2 = $i . '. ' . $item->pendidikan . ' Jurusan ' . $item->jurusan . "\n";
                    $pendidikan = $pendidikan . $pendidikan2;
                    $i++;
                } else {
                $pendidikan2 = $i . '. ' . $item->pendidikan ."\n";
                $pendidikan = $pendidikan . $pendidikan2;
                $i++;
                }
                $tahun2 = 'Tahun ' . $item->tgllulus . ' **)' . "\n";
                $tahun = $tahun . $tahun2;
            };
            // foreach($data as $item2) {
            //     $tahun2 = 'Tahun ' . $item2->tgllulus . "\n";
            //     $tahun = $tahun . $tahun2;
            // };

            $result = [];
            $result[] = array (
                'pendidikan' => $pendidikan,
                'tahunlulus' => $tahun
            );
            return $this->respond($result);
    }
    public function getTtlIndo(Request $request) {
        $data = \DB::table('pegawai_m as pg')
            ->select('pg.tempatlahir', 'pg.tgllahir', DB::raw("NOW()::timestamp as tglsekarang"))
            ->where('pg.id', $request['idPegawai'])
            ->get();

            $ttl = '';
            $tglsekarang = '';
        foreach($data as $item) {
            if ($item->tgllahir != null) {
                $ttl = $item->tempatlahir . ', ' . Valet::getDateIndo($item->tgllahir) . ' ' . substr($item->tgllahir, 1, 0);
                $tglsekarang = Valet::getDateIndo($item->tglsekarang) . ' ' . substr($item->tglsekarang, 1, 0);
            }
        };

        $result = array (
            'ttl' => $ttl,
            'tglsekarang' => $tglsekarang
        );
        return $this->respond($result);
    }
    public function getTelp(Request $request) {
        $dataTelp=\DB::table('nomortelphone_t as nt')
            ->leftJoin('jenisprovider_m as jp','jp.id','=','nt.providerfk')
            ->leftJoin('pegawai_m as pg','pg.id','=','nt.pegawaifk')
            ->select(DB::raw("nt.*,jp.namaprovider"))
            ->where('nt.statusenabled',true);
//            ->orderBy('mbs.tglberakhir');

        if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
            $dataTelp = $dataTelp->where('pg.id','=',$request['idPegawai']);
        }
        $dataTelp = $dataTelp->get();

        $notelp = '';
        foreach($dataTelp as $item) {
                if($item->nomor != "") {
                $notelp2 = $item->nomor . "\n";
                $notelp = $notelp . $notelp2;
            };
        };
        $result = [];
        $result[] = array (
            'notelp' => $notelp
        );

        return $this->respond($result);
    }
    public function simpanDikJur(Request $request) {
        
        if ($request['tglmulai'] == "") {
            $tglMulai = null;
        } else {
            $tglMulai = $request['tglmulai'];
        }
        if ($request['tglselesai'] == "") {
            $tglSelesai = null;
        } else {
            $tglSelesai = $request['tglselesai'];
        }
        if ($request['sertifikat'] == "") {
            $sertifikat = null;
        } else {
            $sertifikat = $request['sertifikat'];
        }
        if ($request['lokasi'] == "") {
            $lokasi = null;
        } else {
            $lokasi = $request['lokasi'];
        }
        if ($request['namadikjur'] == "") {
            $namadikjur = null;
        } else {
            $namadikjur = $request['namadikjur'];
        }
        if ($request['durasi'] == "") {
            $durasi = null;
        } else {
            $durasi = $request['durasi'];
        }
        if ($request['nosertifikat'] == "") {
            $nosertifikat = null;
        } else {
            $nosertifikat = $request['nosertifikat'];
        }
        if ($request['keterangan'] == "") {
            $keterangan = null;
        } else {
            $keterangan = $request['keterangan'];
        }
        \DB::beginTransaction();
        try {
            if ($request['norec'] == "") {
                $dataSeminar = new RiwayatDikjur();
                $dataSeminar->kdprofile = 11;
                $dataSeminar->statusenabled = 1;
                $dataSeminar->norec = $dataSeminar->generateNewId();
            } else {
                $dataSeminar = RiwayatDikjur::where('norec', $request['norec'])
                    ->where('objectpegawaifk', $request['idPegawai'])
                    ->first();
            }
            $dataSeminar->objectpegawaifk = $request['idPegawai'];
            $dataSeminar->namapenyelenggara = $request['namapenyelenggara'];
            $dataSeminar->tglmulai = $tglMulai;
            $dataSeminar->tglselesai = $tglSelesai;
            $dataSeminar->sertifikat = $sertifikat;
            $dataSeminar->lokasi = $lokasi;
            $dataSeminar->namadikjur = $namadikjur;
            $dataSeminar->durasi = $durasi;
            $dataSeminar->nosertifikat = $nosertifikat;
            $dataSeminar->keterangan = $keterangan;
            $dataSeminar->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus = 'true') {
            $transMessage = "Sukses ";
            \DB::commit();
            $result = array(
                "status" => 201,
                "norec" => $dataSeminar,
                "as" => 'ridwan',
                "by" => 'er@epic',
            );
        } else {
            $transMessage = "Simpan DikJur Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'ridwan',
                "by" => 'er@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDataDikjur(Request $request) {
        $data = \DB::table('riwayatdikjur_t as rd')
            ->join('pegawai_m as pg', 'pg.id', '=', 'rd.objectpegawaifk')
            ->select('rd.*', 'pg.namalengkap');

            if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
                $data = $data->where('rd.objectpegawaifk','=',$request['idPegawai']);
            }
            $data = $data->get();

            $result = array(
                'data'  => $data,
                'as' => 'as',
            );
            return $this->respond($result);

    }
    public function deleteDataDikjur(Request $request){

        try {
            RiwayatDikjur::where('norec', $request['norec'])->delete();
            $transMessage = "Sukses ";
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Hapus Data Dikjur Gagal";
        }

        if ($transStatus != 'false') {

            \DB::commit();
            $result = array(

                "status" => 201,
                "message" => $transMessage,
                "as" => 'ridwan',
            );
        } else {
            DB::rollBack();
            $result = array(

                "status" => 400,
                "message" => $transMessage,
                "as" => 'ridwan',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function simpanTandaJasa(Request $request) {
        
        if ($request['sertifikat'] == "") {
            $sertifikat = null;
        } else {
            $sertifikat = $request['sertifikat'];
        }
        \DB::beginTransaction();
        try {
            if ($request['norec'] == "") {
                $dataSeminar = new TandaJasa();
                $dataSeminar->kdprofile = 11;
                $dataSeminar->statusenabled = 1;
                $dataSeminar->norec = $dataSeminar->generateNewId();
            } else {
                $dataSeminar = TandaJasa::where('norec', $request['norec'])
                    ->where('objectpegawaifk', $request['idPegawai'])
                    ->first();
            }
            $dataSeminar->objectpegawaifk = $request['idPegawai'];
            $dataSeminar->tandajasa = $request['tandajasa'];
            $dataSeminar->sertifikat = $sertifikat;
            $dataSeminar->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus = 'true') {
            $transMessage = "Sukses ";
            \DB::commit();
            $result = array(
                "status" => 201,
                "norec" => $dataSeminar,
                "as" => 'ridwan',
                "by" => 'er@epic',
            );
        } else {
            $transMessage = "Simpan Tanda Jasa Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'ridwan',
                "by" => 'er@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDataTandaJasa(Request $request) {
        $data = \DB::table('tandajasa_t as tj')
            ->join('pegawai_m as pg', 'pg.id', '=', 'tj.objectpegawaifk')
            ->select('tj.*', 'pg.namalengkap');

            if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
                $data = $data->where('tj.objectpegawaifk','=',$request['idPegawai']);
            }
            $data = $data->get();

            $result = array(
                'data'  => $data,
                'as' => 'as',
            );
            return $this->respond($result);

    }
    public function deleteDataTandaJasa(Request $request){

        try {
            TandaJasa::where('norec', $request['norec'])->delete();
            $transMessage = "Sukses ";
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Hapus Data Tanda Jasa Gagal";
        }

        if ($transStatus != 'false') {

            \DB::commit();
            $result = array(

                "status" => 201,
                "message" => $transMessage,
                "as" => 'ridwan',
            );
        } else {
            DB::rollBack();
            $result = array(

                "status" => 400,
                "message" => $transMessage,
                "as" => 'ridwan',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function simpanKecakapanBahasa(Request $request) {
        
        if ($request['sertifikat'] == "") {
            $sertifikat = null;
        } else {
            $sertifikat = $request['sertifikat'];
        }
        \DB::beginTransaction();
        try {
            if ($request['norec'] == "") {
                $dataSeminar = new KecakapanBahasa();
                $dataSeminar->kdprofile = 11;
                $dataSeminar->statusenabled = 1;
                $dataSeminar->norec = $dataSeminar->generateNewId();
            } else {
                $dataSeminar = KecakapanBahasa::where('norec', $request['norec'])
                    ->where('objectpegawaifk', $request['idPegawai'])
                    ->first();
            }
            $dataSeminar->objectpegawaifk = $request['idPegawai'];
            $dataSeminar->jenisbahasa = $request['jenisbahasa'];
            $dataSeminar->bahasa = $request['bahasa'];
            $dataSeminar->sertifikat = $sertifikat;
            $dataSeminar->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus = 'true') {
            $transMessage = "Sukses ";
            \DB::commit();
            $result = array(
                "status" => 201,
                "norec" => $dataSeminar,
                "as" => 'ridwan',
                "by" => 'er@epic',
            );
        } else {
            $transMessage = "Simpan Tanda Jasa Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'ridwan',
                "by" => 'er@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDataKecakapanBahasa(Request $request) {
        $data = \DB::table('kecakapanbahasa_t as kb')
            ->join('pegawai_m as pg', 'pg.id', '=', 'kb.objectpegawaifk')
            ->select('kb.*', 'pg.namalengkap');

            if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
                $data = $data->where('kb.objectpegawaifk','=',$request['idPegawai']);
            }
            $data = $data->get();

            $result = array(
                'data'  => $data,
                'as' => 'as',
            );
            return $this->respond($result);

    }
    public function getDataOrganisasiProfesi(Request $request) {
        $data = \DB::table('organisasiprofesi_t as op')
            ->join('pegawai_m as pg', 'pg.id', '=', 'op.objectpegawaifk')
            ->select('op.*', 'pg.namalengkap');

            if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
                $data = $data->where('op.objectpegawaifk','=',$request['idPegawai']);
            }
            $data = $data->get();

            $result = array(
                'data'  => $data,
                'as' => 'as',
            );
            return $this->respond($result);

    }
    public function deleteDataKecakapanBahasa(Request $request){

        try {
            KecakapanBahasa::where('norec', $request['norec'])->delete();
            $transMessage = "Sukses ";
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Hapus Data Tanda Jasa Gagal";
        }

        if ($transStatus != 'false') {

            \DB::commit();
            $result = array(

                "status" => 201,
                "message" => $transMessage,
                "as" => 'ridwan',
            );
        } else {
            DB::rollBack();
            $result = array(

                "status" => 400,
                "message" => $transMessage,
                "as" => 'ridwan',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDikJur(Request $request) {
        $data = \DB::table('riwayatdikjur_t as rd')
            ->select(DB::raw("rd.namapenyelenggara ,to_char(rd.tglselesai, 'yyyy') as tglselesai"))
            ->where('rd.objectpegawaifk', $request['idPegawai'])
            ->get();

        $i = 1;
        $dikjur = '';
        foreach($data as $item) {
            $dikjur2 = $i . '. ' . $item->namapenyelenggara . ' Tahun ' . $item->tglselesai . "\n";
            $dikjur = $dikjur. $dikjur2;
            $i++;
        };

        $result = [];
        $result[] = array (
            'dikjur' => $dikjur
        );
        return $this->respond($result);
    }
    public function getSisanya(Request $request) {
        $dataRP = \DB::table('riwayatpelatihan_t as rp')
            ->select('rp.namapelatihan')
            ->where('rp.objectpegawaifk', $request['idPegawai'])
            ->get();

        $dataRJ = \DB::table('riwayatjabatan_t as rj')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'rj.objectruanganfk')
            ->select('rj.namajabatan', 'ru.namaruangan')
            ->where('rj.objectpegawaifk', $request['idPegawai'])
            ->get();
        
        $dataTJ = \DB::table('tandajasa_t as tj')
            ->select('tj.tandajasa')
            ->where('tj.objectpegawaifk', $request['idPegawai'])
            ->get();
        
        $dataAsing = \DB::table('kecakapanbahasa_t as kb')
            ->select('kb.bahasa')
            ->where('kb.jenisbahasa', 'Asing')
            ->where('kb.objectpegawaifk', $request['idPegawai'])
            ->get();
        
        $dataDaerah = \DB::table('kecakapanbahasa_t as kb')
            ->select('kb.bahasa')
            ->where('kb.jenisbahasa', 'Daerah')
            ->where('kb.objectpegawaifk', $request['idPegawai'])
            ->get();

        $foto = \DB::table('fotopegawai_t as fp')
            ->select('fp.foto')
            ->where('fp.objectpegawaifk', $request['idPegawai'])
            ->get();

        $i = 1;
        $j = 1;
        $k = 1;
        $l = 1;
        $m = 1;
        $rp = '';
        $rj = '';
        $tj = '';
        $asing = '';
        $daerah = '';

        foreach($dataRP as $item) {
            $rp2 = $i . '. ' . $item->namapelatihan . ' **)' . "\n";
            $rp = $rp . $rp2;
            $i++;
        };
        foreach($dataRJ as $item2) {
            $rj2 = $j . '. ' . $item2->namajabatan . ' Ruang ' . $item2->namaruangan . "\n";
            $rj = $rj . $rj2;
            $j++;
        };
        foreach($dataTJ as $item3) {
            $tj2 = $k . '. ' . $item3->tandajasa . ' **)' . "\n";
            $tj = $tj . $tj2;
            $k++;
        };
        foreach($dataAsing as $item4) {
            $asing2 = $l . '. ' . $item4->bahasa . "\n";
            $asing = $asing . $asing2;
            $l++;
        }
        foreach($dataDaerah as $item5) {
            $daerah2 = $m . '. ' . $item5->bahasa . "\n";
            $daerah = $daerah . $daerah2;
            $m++;
        };

        $result = [];
        $result[] = array(
            'pelatihan' => $rp,
            'jabatan' => $rj,
            'jasa' => $tj,
            'asing' => $asing,
            'daerah' => $daerah,
            'foto' => $foto
        );
        return $this->respond($result);
    }
    public function getVicDataPegawai(Request $request) {
        $data = \DB::table('mappingvictodatapegawai_t as mv')
            ->join('pegawai_m as pg', 'pg.id', '=', 'mv.objectpegawaifk')
            ->select('mv.*', 'pg.namalengkap')
            ->get();

        return $this->respond($data);
    }
    public function saveVicDataPegawai(Request $request) {
        \DB::beginTransaction();
        try {
            $dataMapping = new MappingVicToPegawai();
            $dataMapping->norec = $dataMapping->generateNewId();
            $dataMapping->statusenabled = 1;
            $dataMapping->objectpegawaifk = $request['idPegawai'];
            $dataMapping->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus = 'true') {
            $transMessage = "Sukses ";
            \DB::commit();
            $result = array(
                "status" => 201,
                "norec" => $dataMapping,
                "as" => 'ridwan',
                "by" => 'er@epic',
            );
        } else {
            $transMessage = "Simpan Mapping Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'ridwan',
                "by" => 'er@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function deleteVic(Request $request){

        try {
            MappingVicToPegawai::where('norec', $request['norec'])->delete();
            $transMessage = "Sukses ";
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Hapus Data Tanda Jasa Gagal";
        }

        if ($transStatus != 'false') {

            \DB::commit();
            $result = array(

                "status" => 201,
                "message" => $transMessage,
                "as" => 'ridwan',
            );
        } else {
            DB::rollBack();
            $result = array(

                "status" => 400,
                "message" => $transMessage,
                "as" => 'ridwan',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getKalakRuangan(Request $request) {
        
            $ruangankalak = \DB::table('loginuser_s as log')
                ->leftjoin('maploginusertoruangan_s as map', 'map.objectloginuserfk', '=', 'log.id')
                ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'map.objectruanganfk')
                ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'log.objectpegawaifk')
                ->select('log.objectpegawaifk as idpegawai', 'ru.objectdepartemenfk', 'ru.namaruangan', 'pg.namalengkap')
                ->whereIn('pg.objectjabatanfungsionalfk', [17,1299]);

                if (isset($request['nama']) && $request['nama'] != "" && $request['nama'] != "undefined") {
                $ruangankalak = $ruangankalak->where('pg.namalengkap', 'ilike', '%' . $request['nama'] . '%');
            }
            $ruangankalak = $ruangankalak->get();
                // ->get()

        $result = array(
            'data' => $ruangankalak,
            'as' => "blahblah"
        );

        return $this->respond($result);
    }
    public function getAnggota(Request $request) {
        $data = \DB::table('mappingkalaktoanggota_t as mk')
            ->join('pegawai_m as pg', 'pg.id', '=', 'mk.objectanggotafk')
            ->select('pg.namalengkap','mk.norec','pg.id as idpegawai');

            if(isset($request['idKalak']) && $request['idKalak']!="" && $request['idKalak']!="undefined"){
                $data = $data->where('mk.objectkalakfk','=',$request['idKalak']);
            }
            $data = $data->get();

            return $this->respond($data);
    }
    public function saveAnggotaKalak(Request $request) {
        \DB::beginTransaction();
        try {
            $dataMapping = new MappingKalakToAnggota();
            $dataMapping->norec = $dataMapping->generateNewId();
            $dataMapping->statusenabled = 1;
            $dataMapping->objectkalakfk = $request['idKalak'];
            $dataMapping->objectanggotafk = $request['idAnggota'];
            $dataMapping->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus = 'true') {
            $transMessage = "Sukses ";
            \DB::commit();
            $result = array(
                "status" => 201,
                "norec" => $dataMapping,
                "as" => 'ridwan',
                "by" => 'er@epic',
            );
        } else {
            $transMessage = "Simpan Mapping Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'ridwan',
                "by" => 'er@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function deleteAnggota(Request $request){

        try {
            MappingKalakToAnggota::where('norec', $request['norec'])->delete();
            $transMessage = "Sukses ";
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Hapus Data Tanda Jasa Gagal";
        }

        if ($transStatus != 'false') {

            \DB::commit();
            $result = array(

                "status" => 201,
                "message" => $transMessage,
                "as" => 'ridwan',
            );
        } else {
            DB::rollBack();
            $result = array(

                "status" => 400,
                "message" => $transMessage,
                "as" => 'ridwan',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function simpanOrganisasiProfesi(Request $request) {
        
        \DB::beginTransaction();
        try {
            if ($request['norec'] == "") {
                $dataSeminar = new OrganisasiProfesi();
                $dataSeminar->kdprofile = 11;
                $dataSeminar->statusenabled = 1;
                $dataSeminar->norec = $dataSeminar->generateNewId();
            } else {
                $dataSeminar = OrganisasiProfesi::where('norec', $request['norec'])
                    ->where('objectpegawaifk', $request['idPegawai'])
                    ->first();
            }
            $dataSeminar->objectpegawaifk = $request['idPegawai'];
            $dataSeminar->nokta = $request['nokta'];
            $dataSeminar->kta = $request['kta'];
            $dataSeminar->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus = 'true') {
            $transMessage = "Sukses ";
            \DB::commit();
            $result = array(
                "status" => 201,
                "norec" => $dataSeminar,
                "as" => 'ridwan',
                "by" => 'er@epic',
            );
        } else {
            $transMessage = "Simpan Tanda Jasa Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'ridwan',
                "by" => 'er@epic',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function deleteDataOrganisasiProfesi(Request $request){

        try {
            OrganisasiProfesi::where('norec', $request['norec'])->delete();
            $transMessage = "Sukses ";
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Hapus Data Organisasi Profesi Gagal";
        }

        if ($transStatus != 'false') {

            \DB::commit();
            $result = array(

                "status" => 201,
                "message" => $transMessage,
                "as" => 'ridwan',
            );
        } else {
            DB::rollBack();
            $result = array(

                "status" => 400,
                "message" => $transMessage,
                "as" => 'ridwan',
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getStrPegawai(Request $request) {
        $data = \DB::table('masaberlakusipstr_t as mb')
            ->join('pegawai_m as pg', 'pg.id', '=', 'mb.pegawaifk')
            ->select('mb.pegawaifk as idpegawai', 'mb.nostr', 'mb.terbitstr', 'mb.berakhirstr', 'mb.namafilestr', 'mb.filestr2 as filestr', 'pg.namalengkap as namapegawai')
            ->whereNotNull('mb.nostr');

            if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
                $data = $data->where('mb.pegawaifk','=',$request['idPegawai']);
            }
            $data = $data->take(1);
            $data = $data->orderBy('mb.berakhirstr', 'desc');
            $data = $data->get();

            return $this->respond($data);

    }
    public function getRiwayatRikesla(Request $request) {
        $data = \DB::table('pasien_m as ps')
            ->join('pasiendaftar_t as pd', 'pd.nocmfk', '=', 'ps.id')
            ->join('hasilpemeriksaanmcu_t as hpm', 'hpm.noregistrasifk', '=', 'pd.norec')
            ->join('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->join('alamat_m as al', 'al.nocmfk', '=', 'ps.id')
            ->select('pd.tglregistrasi', 'hpm.norec as norechpm', 'pd.norec', 'pd.noregistrasi', 'ps.nocm', 'hpm.kesimpulan', 'ps.namapasien', 'jk.jeniskelamin', 'al.alamatlengkap', 'ps.tgllahir');
            
            if(isset($request['noCm']) && $request['noCm']!="" && $request['noCm']!="undefined"){
                $data = $data->where('ps.nocm','=',$request['noCm']);
            }

            $data = $data->get();

            return $this->respond($data);
    }
    public function getSipPegawai(Request $request) {
        $data = \DB::table('masaberlakusipstr_t as mb')
            ->join('pegawai_m as pg', 'pg.id', '=', 'mb.pegawaifk')
            ->select('mb.pegawaifk as idpegawai', 'mb.nosip', 'mb.terbitsip', 'mb.berakhirsip', 'mb.namafilesip', 'mb.filesip2 as filesip', 'pg.namalengkap as namapegawai')
            ->whereNotNull('mb.nosip');

            if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
                $data = $data->where('mb.pegawaifk','=',$request['idPegawai']);
            }
            $data = $data->take(1);
            $data = $data->orderBy('mb.berakhirsip', 'desc');
            $data = $data->get();

            return $this->respond($data);

    }
    public function getLoginUserById(Request $request) {
        $data = \DB::table('loginuser_s as log')
            ->join('maploginusertoruangan_s as map', 'map.objectloginuserfk', '=', 'log.id')
            ->join('ruangan_m as ru', 'ru.id', '=', 'map.objectruanganfk')
            ->select('log.namauser', 'ru.namaruangan', 'map.objectruanganfk')
            ->where('log.objectpegawaifk', $request['idPegawai'])
            ->get();

            return $this->respond($data);
    }
    public function getMasaBerlakuSipStrPegawai (Request $request) {
        $data2=[];
        $data = \DB::table('pegawai_m as pg')
            ->leftJoin('unitkerjapegawai_m as uk','uk.id','=','pg.objectunitkerjapegawaifk')
            ->leftJoin('jenispegawai_m as jsp','jsp.id','=','pg.objectjenispegawaifk')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pg.objectruangankerjafk')
            ->select(DB::raw("
            pg.nippns,pg.namalengkap as namapegawai,pg.nip_pns as nipPns, uk.name as unitkerja, pg.id as idPegawai, pg.nip, pg.objectruangankerjafk, ru.namaruangan as ruangankerja, jsp.jenispegawai
            "))
            ->where('pg.statusenabled',true)
            ->where('pg.kedudukanfk', 1)
            ->where('pg.kodeexternal', '<>', 'dua');
            if(isset($request['idPegawai']) && $request['idPegawai']!="" && $request['idPegawai']!="undefined"){
                $data = $data->where('pg.id','=',$request['idPegawai']);
            }
            if(isset($request['idRuangan']) && $request['idRuangan']!="" && $request['idRuangan']!="undefined"){
                $data = $data->where('pg.objectruangankerjafk','=',$request['idRuangan']);
            }
            if(isset($request['idInstalasi']) && $request['idInstalasi']!="" && $request['idInstalasi']!="undefined"){
                $data = $data->where('pg.objectdepartemenkerjafk','=',$request['idInstalasi']);
            }
            if(isset($request['isDokter']) && $request['isDokter']!="" && $request['isDokter']!="undefined"){
                $data = $data->where('pg.objectjenispegawaifk','=',1);
            }
            // ->where('pg.id', 25271)
            $data = $data->get();
        // $data2[] = $data;
        foreach($data as $item) {
            $berakhirsip = '';
            $berakhirstr = '';
            $terbitsip = '';
            $terbitstr = '';
            $nosip = '';
            $nostr = '';
            $sip = DB::table('masaberlakusipstr_t as mas')
                ->select('mas.berakhirsip', 'mas.terbitsip', 'nosip')
                ->where('mas.pegawaifk', $item->idPegawai)
                ->where('mas.jenismasaberlakufk', 1)
                ->orderBy('mas.berakhirsip', 'desc')
                ->take(1)
                ->get();
            foreach($sip as $item2) {
                $berakhirsip = $item2->berakhirsip;
                $terbitsip = $item2->terbitsip;
                $nosip = $item2->nosip;
            }
            $str = DB::table('masaberlakusipstr_t as mas')
                ->select('mas.berakhirstr', 'mas.terbitstr', 'mas.nostr')
                ->where('mas.pegawaifk', $item->idPegawai)
                ->where('mas.jenismasaberlakufk', 2)
                ->orderBy('mas.berakhirstr', 'desc')
                ->take(1)
                ->get();
            foreach($str as $item3) {
                $berakhirstr = $item3->berakhirstr;
                $terbitstr = $item3->terbitstr;
                $nostr = $item3->nostr;
            }
            $data2[] = array (
                'namalengkap' => $item->namapegawai,
                'nippns' => $item->nippns,
                'nipPns' => $item->nipPns,
                'unitkerja' => $item->unitkerja,
                'idPegawai' => $item->idPegawai,
                'nip' => $item->nip,
                'berakhirsip' => $berakhirsip,
                'berakhirstr' => $berakhirstr,
                'objectruangankerjafk' => $item->objectruangankerjafk,
                'ruangankerja' => $item->ruangankerja,
                'terbitsip' => $terbitsip,
                'nosip' => $nosip,
                'terbitstr' => $terbitstr,
                'nostr' => $nostr,
                'jenispegawai' => $item->jenispegawai
            );
        }
        return $this->respond($data2);
    }
    public function getComboSipStr(Request $request) {
        $ruangan = \DB::table('ruangan_m as ru')
            ->select('ru.id', 'ru.namaruangan')
            ->where('ru.statusenabled', true)
            ->get();

        $pegawai = \DB::table('pegawai_m as pg')
            ->select('pg.id', 'pg.namalengkap')
            ->where('pg.statusenabled', true)
            // ->where('pg.id', 25183)
            ->where('pg.kodeexternal', '<>', 'dua')
            ->get();

        $instalasi = \DB::table('departemen_m as dp')
            ->select('dp.id', 'dp.namadepartemen')
            ->where('dp.statusenabled', true)
            ->get();

        $result = array (
            'ruangan' => $ruangan,
            'pegawai' => $pegawai,
            'instalasi' => $instalasi
        );
        return $this->respond($result);
    }
    public function getFileSip(Request $request) {
        $data = DB::table('masaberlakusipstr_t as mbs')
            ->select('mbs.filesip2')
            ->where('pegawaifk', $request['idPegawai'])
            ->where('mbs.jenismasaberlakufk', 1)
            ->orderBy('mbs.berakhirsip', 'desc')
            ->take(1)
            // ->where('berakhirsip', $request['berakhirSip'])
            ->get();

        return $this->respond($data);
    }
    public function getFileStr(Request $request) {
        $data = DB::table('masaberlakusipstr_t as mbs')
            ->select('mbs.filestr2')
            ->where('pegawaifk', $request['idPegawai'])
            ->where('mbs.jenismasaberlakufk', 2)
            ->orderBy('mbs.berakhirstr', 'desc')
            ->take(1)
            // ->where('berakhirsip', $request['berakhirSip'])
            ->get();

        return $this->respond($data);
    }
    public function getCombo2(Request $request) {
        $ruangan = \DB::table('ruangan_m as ru')
            ->select('ru.id', 'ru.namaruangan')
            ->where('ru.statusenabled', true)
            ->get();

        $instalasi = \DB::table('departemen_m as dp')
            ->select('dp.id', 'dp.namadepartemen')
            ->where('dp.statusenabled', true)
            ->get();

        $unitKerja = \DB::table('unitkerjapegawai_m as ukp')
            ->select('ukp.id', 'ukp.name')
            ->where('ukp.statusenabled', true)
            ->get();

        $result = array (
            'ruangan' => $ruangan,
            'instalasi' => $instalasi,
            'unitKerja' => $unitKerja
        );

        return $this->respond($result);
    }
    public function getPegawaiSudahIsi(Request $request) {
        // if ($request['ceklis'] == "nakes") {
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $data = \DB::table('pegawai_m as pg')
        //         ->select('pg.id', 'pg.namalengkap')
        //         ->where('pg.statusenabled', true)
        //         ->where('pg.kedudukanfk', 1)
        //         ->whereIn('pg.kategorypegawai', [18,19,21,22]);
        //         if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
        //             $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
        //         }
        //         if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
        //             $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
        //         }
        //         if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
        //             $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
        //         }
        //         if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
        //             $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
        //         }
        //         $data = $data->get();
        // } else if ($request['ceklis'] == "polpns") {
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $data = \DB::table('pegawai_m as pg')
        //         ->select('pg.id', 'pg.namalengkap')
        //         ->where('pg.statusenabled', true)
        //         ->where('pg.kedudukanfk', 1)
        //         ->whereIn('pg.kategorypegawai', [1,20]);
        //         if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
        //             $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
        //         }
        //         if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
        //             $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
        //         }
        //         if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
        //             $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
        //         }
        //         if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
        //             $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
        //         }
        //         $data = $data->get();
        // } else {
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $data = \DB::table('pegawai_m as pg')
        //         ->select('pg.id', 'pg.namalengkap')
        //         ->where('pg.statusenabled', true)
        //         ->where('pg.kedudukanfk', 1);
        //         if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
        //             $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
        //         }
        //         if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
        //             $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
        //         }
        //         if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
        //             $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
        //         }
        //         if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
        //             $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
        //         }
        //         if(isset($request['ceklis']) && $request['ceklis']!="" && $request['ceklis']!="undefined"){
        //             $data = $data->whereIn('pg.kategorypegawai',[$request['ceklis']]);
        //         }
        //         $data = $data->get();
        // }
        ini_set('max_execution_time', 500); //6 minutes
            $data = \DB::table('pegawai_m as pg')
                ->select('pg.id', 'pg.namalengkap')
                ->where('pg.statusenabled', true)
                ->where('pg.kedudukanfk', 1);
                // ->whereIn('pg.kategorypegawai', [18,19,21,22]);
                if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
                    $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
                }
                if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
                    $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
                }
                if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
                    $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
                }
                if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
                    $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
                }
                if(isset($request['pttnomedis']) && $request['pttnomedis']!="" && $request['pttnomedis']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',23);
                }
                if(isset($request['pttmedis']) && $request['pttmedis']!="" && $request['pttmedis']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',22);
                }
                if(isset($request['pttdokter']) && $request['pttdokter']!="" && $request['pttdokter']!="undefined"){
                    $data = $data->whereIn('pg.kategorypegawai','=',21);
                }
                if(isset($request['pns']) && $request['pns']!="" && $request['pns']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',1);
                }
                if(isset($request['polri']) && $request['polri']!="" && $request['polri']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',20);
                }
                $data = $data->get();
        $data2 = [];
        foreach ($data as $item) {
            $dataKeluarga = \DB::table('keluargapegawai_m as kp')
                ->select('kp.objectpegawaifk')
                ->where('kp.objectpegawaifk', $item->id)
                ->distinct()
                ->get();
            if (count($dataKeluarga) > 0) {
                $item->dataKeluarga = 'Sudah Input';
            } else {
                $item->dataKeluarga = 'Belum Input';
            }

            // $dataPendidikan = \DB::table('riwayatpendidikan_t as rp')
            //     ->where('rp.objectpegawaifk', $item->id)
            //     ->distinct()
            //     ->get();
            // if (count($dataPendidikan) > 0) {
            //     $item->dataPendidikan = 'Sudah Input';
            // } else {
            //     $item->dataPendidikan = 'Belum Input';
            // }

            // $dataPelatihan = \DB::table('riwayatpelatihan_t as rpn')
            //     ->where('rpn.objectpegawaifk', $item->id)
            //     ->get();
            // if (count($dataPelatihan) > 0) {
            //     $item->dataPelatihan = 'Sudah Input';
            // } else {
            //     $item->dataPelatihan = 'Belum Input';
            // }

            // $dataJabatan = \DB::table('riwayatjabatan_t as rj')
            //     ->where('rj.objectpegawaifk', $item->id)
            //     ->get();
            // if (count($dataJabatan) > 0) {
            //     $item->dataJabatan = 'Sudah Input';
            // } else {
            //     $item->dataJabatan = 'Belum Input';
            // }

            // $dataSip = \DB::table('masaberlakusipstr_t as sip')
            //     ->where('sip.pegawaifk', $item->id)
            //     ->where('sip.jenismasaberlakufk', 1)
            //     ->get();
            // if (count($dataSip) > 0) {
            //     $item->dataSip = 'Sudah Input';
            // } else {
            //     $item->dataSip = 'Belum Input';
            // }

            // $dataStr = \DB::table('masaberlakusipstr_t as str')
            //     ->where('str.pegawaifk', $item->id)
            //     ->where('str.jenismasaberlakufk', 2)
            //     ->get();
            // if (count($dataStr) > 0) {
            //     $item->dataStr = 'Sudah Input';
            // } else {
            //     $item->dataStr = 'Belum Input';
            // }

            // $dataSpkk = \DB::table('riwayatspkk_t as rs')
            //     ->where('rs.objectpegawaifk', $item->id)
            //     ->get();
            // if (count($dataSpkk) > 0) {
            //     $item->dataSpkk = 'Sudah Input';
            // } else {
            //     $item->dataSpkk = 'Belum Input';
            // }

            // $dataSeminar = \DB::table('riwayatseminar_t as rss')
            //     ->where('rss.objectpegawaifk', $item->id)
            //     ->get();
            // if (count($dataSeminar) > 0) {
            //     $item->dataSeminar = 'Sudah Input';
            // } else {
            //     $item->dataSeminar = 'Belum Input';
            // }

            // $dataDikjur = \DB::table('riwayatdikjur_t as rd')
            //     ->where('rd.objectpegawaifk', $item->id)
            //     ->get();
            // if (count($dataDikjur) > 0) {
            //     $item->dataDikjur = 'Sudah Input';
            // } else {
            //     $item->dataDikjur = 'Belum Input';
            // }

            // $dataTandaJasa = \DB::table('tandajasa_t as tj')
            //     ->where('tj.objectpegawaifk', $item->id)
            //     ->get();
            // if (count($dataTandaJasa) > 0) {
            //     $item->tandaJasa = 'Sudah Input';
            // } else {
            //     $item->tandaJasa = 'Belum Input';
            // }

            // $dataBahasa = \DB::table('kecakapanbahasa_t as kb')
            //     ->where('kb.objectpegawaifk', $item->id)
            //     ->get();
            // if (count($dataBahasa) > 0) {
            //     $item->dataBahasa = 'Sudah Input';
            // } else {
            //     $item->dataBahasa = 'Belum Input';
            // }

            // $dataOrganisasi = \DB::table('organisasiprofesi_t as op')
            //     ->where('op.objectpegawaifk', $item->id)
            //     ->get();
            // if (count($dataOrganisasi) > 0) {
            //     $item->dataOrganisasi = 'Sudah Input';
            // } else {
            //     $item->dataOrganisasi = 'Belum Input';
            // }
            $data2 []= $item;
        }
        $result = array(
            'data'=> $data2,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getDataPendidikan(Request $request) {
        // if ($request['ceklis'] == "nakes") {
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $data = \DB::table('pegawai_m as pg')
        //         ->select('pg.id', 'pg.namalengkap')
        //         ->where('pg.statusenabled', true)
        //         ->where('pg.kedudukanfk', 1)
        //         ->whereIn('pg.kategorypegawai', [18,19,21,22]);
        //         if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
        //             $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
        //         }
        //         if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
        //             $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
        //         }
        //         if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
        //             $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
        //         }
        //         if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
        //             $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
        //         }
        //         $data = $data->get();
        // } else if ($request['ceklis'] == "polpns") {
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $data = \DB::table('pegawai_m as pg')
        //         ->select('pg.id', 'pg.namalengkap')
        //         ->where('pg.statusenabled', true)
        //         ->where('pg.kedudukanfk', 1)
        //         ->whereIn('pg.kategorypegawai', [1,20]);
        //         if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
        //             $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
        //         }
        //         if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
        //             $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
        //         }
        //         if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
        //             $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
        //         }
        //         if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
        //             $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
        //         }
        //         $data = $data->get();
        // } else {
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $data = \DB::table('pegawai_m as pg')
        //         ->select('pg.id', 'pg.namalengkap')
        //         ->where('pg.statusenabled', true)
        //         ->where('pg.kedudukanfk', 1);
        //         if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
        //             $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
        //         }
        //         if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
        //             $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
        //         }
        //         if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
        //             $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
        //         }
        //         if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
        //             $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
        //         }
        //         if(isset($request['ceklis']) && $request['ceklis']!="" && $request['ceklis']!="undefined"){
        //             $data = $data->whereIn('pg.kategorypegawai',[$request['ceklis']]);
        //         }
        //         $data = $data->get();
        // }
        ini_set('max_execution_time', 500); //6 minutes
            $data = \DB::table('pegawai_m as pg')
                ->select('pg.id', 'pg.namalengkap')
                ->where('pg.statusenabled', true)
                ->where('pg.kedudukanfk', 1);
                // ->whereIn('pg.kategorypegawai', [18,19,21,22]);
                if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
                    $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
                }
                if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
                    $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
                }
                if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
                    $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
                }
                if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
                    $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
                }
                if(isset($request['pttnomedis']) && $request['pttnomedis']!="" && $request['pttnomedis']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',23);
                }
                if(isset($request['pttmedis']) && $request['pttmedis']!="" && $request['pttmedis']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',22);
                }
                if(isset($request['pttdokter']) && $request['pttdokter']!="" && $request['pttdokter']!="undefined"){
                    $data = $data->whereIn('pg.kategorypegawai','=',21);
                }
                if(isset($request['pns']) && $request['pns']!="" && $request['pns']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',1);
                }
                if(isset($request['polri']) && $request['polri']!="" && $request['polri']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',20);
                }
                $data = $data->get();

        $data2 = [];
        foreach ($data as $item) {
            $dataPendidikan = \DB::table('riwayatpendidikan_t as rp')
                ->select('rp.objectpegawaifk')
                ->where('rp.objectpegawaifk', $item->id)
                ->distinct()
                ->get();
            if (count($dataPendidikan) > 0) {
                $item->dataPendidikan = 'Sudah Input';
            } else {
                $item->dataPendidikan = 'Belum Input';
            }
            
            $data2 []= $item;
        }
        $result = array(
            'data'=> $data2,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getDataPelatihan(Request $request) {
        // if ($request['ceklis'] == "nakes") {
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $data = \DB::table('pegawai_m as pg')
        //         ->select('pg.id', 'pg.namalengkap')
        //         ->where('pg.statusenabled', true)
        //         ->where('pg.kedudukanfk', 1)
        //         ->whereIn('pg.kategorypegawai', [18,19,21,22]);
        //         if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
        //             $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
        //         }
        //         if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
        //             $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
        //         }
        //         if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
        //             $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
        //         }
        //         if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
        //             $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
        //         }
        //         $data = $data->get();
        // } else if ($request['ceklis'] == "polpns") {
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $data = \DB::table('pegawai_m as pg')
        //         ->select('pg.id', 'pg.namalengkap')
        //         ->where('pg.statusenabled', true)
        //         ->where('pg.kedudukanfk', 1)
        //         ->whereIn('pg.kategorypegawai', [1,20]);
        //         if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
        //             $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
        //         }
        //         if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
        //             $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
        //         }
        //         if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
        //             $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
        //         }
        //         if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
        //             $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
        //         }
        //         $data = $data->get();
        // } else {
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $data = \DB::table('pegawai_m as pg')
        //         ->select('pg.id', 'pg.namalengkap')
        //         ->where('pg.statusenabled', true)
        //         ->where('pg.kedudukanfk', 1);
        //         if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
        //             $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
        //         }
        //         if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
        //             $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
        //         }
        //         if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
        //             $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
        //         }
        //         if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
        //             $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
        //         }
        //         if(isset($request['ceklis']) && $request['ceklis']!="" && $request['ceklis']!="undefined"){
        //             $data = $data->whereIn('pg.kategorypegawai',[$request['ceklis']]);
        //         }
        //         $data = $data->get();
        // }
        ini_set('max_execution_time', 500); //6 minutes
            $data = \DB::table('pegawai_m as pg')
                ->select('pg.id', 'pg.namalengkap')
                ->where('pg.statusenabled', true)
                ->where('pg.kedudukanfk', 1);
                // ->whereIn('pg.kategorypegawai', [18,19,21,22]);
                if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
                    $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
                }
                if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
                    $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
                }
                if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
                    $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
                }
                if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
                    $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
                }
                if(isset($request['pttnomedis']) && $request['pttnomedis']!="" && $request['pttnomedis']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',23);
                }
                if(isset($request['pttmedis']) && $request['pttmedis']!="" && $request['pttmedis']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',22);
                }
                if(isset($request['pttdokter']) && $request['pttdokter']!="" && $request['pttdokter']!="undefined"){
                    $data = $data->whereIn('pg.kategorypegawai','=',21);
                }
                if(isset($request['pns']) && $request['pns']!="" && $request['pns']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',1);
                }
                if(isset($request['polri']) && $request['polri']!="" && $request['polri']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',20);
                }
                $data = $data->get();

        $data2 = [];
        foreach ($data as $item) {
            $dataPelatihan = \DB::table('riwayatpelatihan_t as rpn')
                ->select('rpn.objectpegawaifk')
                ->where('rpn.objectpegawaifk', $item->id)
                ->distinct()
                ->get();
            if (count($dataPelatihan) > 0) {
                $item->dataPelatihan = 'Sudah Input';
            } else {
                $item->dataPelatihan = 'Belum Input';
            }
            
            $data2 []= $item;
        }
        $result = array(
            'data'=> $data2,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getDataJabatan(Request $request) {
        // if ($request['ceklis'] == "nakes") {
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $data = \DB::table('pegawai_m as pg')
        //         ->select('pg.id', 'pg.namalengkap')
        //         ->where('pg.statusenabled', true)
        //         ->where('pg.kedudukanfk', 1)
        //         ->whereIn('pg.kategorypegawai', [18,19,21,22]);
        //         if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
        //             $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
        //         }
        //         if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
        //             $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
        //         }
        //         if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
        //             $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
        //         }
        //         if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
        //             $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
        //         }
        //         $data = $data->get();
        // } else if ($request['ceklis'] == "polpns") {
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $data = \DB::table('pegawai_m as pg')
        //         ->select('pg.id', 'pg.namalengkap')
        //         ->where('pg.statusenabled', true)
        //         ->where('pg.kedudukanfk', 1)
        //         ->whereIn('pg.kategorypegawai', [1,20]);
        //         if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
        //             $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
        //         }
        //         if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
        //             $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
        //         }
        //         if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
        //             $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
        //         }
        //         if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
        //             $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
        //         }
        //         $data = $data->get();
        // } else {
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $data = \DB::table('pegawai_m as pg')
        //         ->select('pg.id', 'pg.namalengkap')
        //         ->where('pg.statusenabled', true)
        //         ->where('pg.kedudukanfk', 1);
        //         if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
        //             $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
        //         }
        //         if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
        //             $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
        //         }
        //         if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
        //             $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
        //         }
        //         if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
        //             $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
        //         }
        //         if(isset($request['ceklis']) && $request['ceklis']!="" && $request['ceklis']!="undefined"){
        //             $data = $data->whereIn('pg.kategorypegawai',[$request['ceklis']]);
        //         }
        //         $data = $data->get();
        // }
        ini_set('max_execution_time', 500); //6 minutes
            $data = \DB::table('pegawai_m as pg')
                ->select('pg.id', 'pg.namalengkap')
                ->where('pg.statusenabled', true)
                ->where('pg.kedudukanfk', 1);
                // ->whereIn('pg.kategorypegawai', [18,19,21,22]);
                if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
                    $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
                }
                if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
                    $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
                }
                if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
                    $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
                }
                if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
                    $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
                }
                if(isset($request['pttnomedis']) && $request['pttnomedis']!="" && $request['pttnomedis']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',23);
                }
                if(isset($request['pttmedis']) && $request['pttmedis']!="" && $request['pttmedis']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',22);
                }
                if(isset($request['pttdokter']) && $request['pttdokter']!="" && $request['pttdokter']!="undefined"){
                    $data = $data->whereIn('pg.kategorypegawai','=',21);
                }
                if(isset($request['pns']) && $request['pns']!="" && $request['pns']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',1);
                }
                if(isset($request['polri']) && $request['polri']!="" && $request['polri']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',20);
                }
                $data = $data->get();

        $data2 = [];
        foreach ($data as $item) {
            $dataJabatan = \DB::table('riwayatjabatan_t as rj')
                ->select('rj.objectpegawaifk')
                ->where('rj.objectpegawaifk', $item->id)
                ->distinct()
                ->get();
            if (count($dataJabatan) > 0) {
                $item->dataJabatan = 'Sudah Input';
            } else {
                $item->dataJabatan = 'Belum Input';
            }
            
            $data2 []= $item;
        }
        $result = array(
            'data'=> $data2,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getDataSip2(Request $request) {
        // if ($request['ceklis'] == "nakes") {
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $data = \DB::table('pegawai_m as pg')
        //         ->select('pg.id', 'pg.namalengkap')
        //         ->where('pg.statusenabled', true)
        //         ->where('pg.kedudukanfk', 1)
        //         ->whereIn('pg.kategorypegawai', [18,19,21,22]);
        //         if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
        //             $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
        //         }
        //         if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
        //             $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
        //         }
        //         if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
        //             $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
        //         }
        //         if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
        //             $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
        //         }
        //         $data = $data->get();
        // } else if ($request['ceklis'] == "polpns") {
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $data = \DB::table('pegawai_m as pg')
        //         ->select('pg.id', 'pg.namalengkap')
        //         ->where('pg.statusenabled', true)
        //         ->where('pg.kedudukanfk', 1)
        //         ->whereIn('pg.kategorypegawai', [1,20]);
        //         if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
        //             $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
        //         }
        //         if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
        //             $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
        //         }
        //         if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
        //             $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
        //         }
        //         if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
        //             $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
        //         }
        //         $data = $data->get();
        // } else {
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $data = \DB::table('pegawai_m as pg')
        //         ->select('pg.id', 'pg.namalengkap')
        //         ->where('pg.statusenabled', true)
        //         ->where('pg.kedudukanfk', 1);
        //         if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
        //             $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
        //         }
        //         if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
        //             $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
        //         }
        //         if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
        //             $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
        //         }
        //         if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
        //             $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
        //         }
        //         if(isset($request['ceklis']) && $request['ceklis']!="" && $request['ceklis']!="undefined"){
        //             $data = $data->whereIn('pg.kategorypegawai',[$request['ceklis']]);
        //         }
        //         $data = $data->get();
        // }
        ini_set('max_execution_time', 500); //6 minutes
            $data = \DB::table('pegawai_m as pg')
                ->select('pg.id', 'pg.namalengkap')
                ->where('pg.statusenabled', true)
                ->where('pg.kedudukanfk', 1);
                // ->whereIn('pg.kategorypegawai', [18,19,21,22]);
                if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
                    $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
                }
                if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
                    $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
                }
                if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
                    $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
                }
                if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
                    $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
                }
                if(isset($request['pttnomedis']) && $request['pttnomedis']!="" && $request['pttnomedis']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',23);
                }
                if(isset($request['pttmedis']) && $request['pttmedis']!="" && $request['pttmedis']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',22);
                }
                if(isset($request['pttdokter']) && $request['pttdokter']!="" && $request['pttdokter']!="undefined"){
                    $data = $data->whereIn('pg.kategorypegawai','=',21);
                }
                if(isset($request['pns']) && $request['pns']!="" && $request['pns']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',1);
                }
                if(isset($request['polri']) && $request['polri']!="" && $request['polri']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',20);
                }
                $data = $data->get();

        $data2 = [];
        foreach ($data as $item) {
            $dataSip = \DB::table('masaberlakusipstr_t as sip')
                ->select('sip.pegawaifk')
                ->where('sip.pegawaifk', $item->id)
                ->where('sip.jenismasaberlakufk', 1)
                ->distinct()
                ->get();
            if (count($dataSip) > 0) {
                $item->dataSip = 'Sudah Input';
            } else {
                $item->dataSip = 'Belum Input';
            }
            
            $data2 []= $item;
        }
        $result = array(
            'data'=> $data2,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getDataStr2(Request $request) {
        // if ($request['ceklis'] == "nakes") {
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $data = \DB::table('pegawai_m as pg')
        //         ->select('pg.id', 'pg.namalengkap')
        //         ->where('pg.statusenabled', true)
        //         ->where('pg.kedudukanfk', 1)
        //         ->whereIn('pg.kategorypegawai', [18,19,21,22]);
        //         if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
        //             $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
        //         }
        //         if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
        //             $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
        //         }
        //         if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
        //             $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
        //         }
        //         if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
        //             $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
        //         }
        //         $data = $data->get();
        // } else if ($request['ceklis'] == "polpns") {
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $data = \DB::table('pegawai_m as pg')
        //         ->select('pg.id', 'pg.namalengkap')
        //         ->where('pg.statusenabled', true)
        //         ->where('pg.kedudukanfk', 1)
        //         ->whereIn('pg.kategorypegawai', [1,20]);
        //         if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
        //             $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
        //         }
        //         if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
        //             $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
        //         }
        //         if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
        //             $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
        //         }
        //         if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
        //             $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
        //         }
        //         $data = $data->get();
        // } else {
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $data = \DB::table('pegawai_m as pg')
        //         ->select('pg.id', 'pg.namalengkap')
        //         ->where('pg.statusenabled', true)
        //         ->where('pg.kedudukanfk', 1);
        //         if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
        //             $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
        //         }
        //         if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
        //             $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
        //         }
        //         if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
        //             $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
        //         }
        //         if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
        //             $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
        //         }
        //         if(isset($request['ceklis']) && $request['ceklis']!="" && $request['ceklis']!="undefined"){
        //             $data = $data->whereIn('pg.kategorypegawai',[$request['ceklis']]);
        //         }
        //         $data = $data->get();
        // }
        ini_set('max_execution_time', 500); //6 minutes
            $data = \DB::table('pegawai_m as pg')
                ->select('pg.id', 'pg.namalengkap')
                ->where('pg.statusenabled', true)
                ->where('pg.kedudukanfk', 1);
                // ->whereIn('pg.kategorypegawai', [18,19,21,22]);
                if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
                    $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
                }
                if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
                    $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
                }
                if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
                    $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
                }
                if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
                    $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
                }
                if(isset($request['pttnomedis']) && $request['pttnomedis']!="" && $request['pttnomedis']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',23);
                }
                if(isset($request['pttmedis']) && $request['pttmedis']!="" && $request['pttmedis']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',22);
                }
                if(isset($request['pttdokter']) && $request['pttdokter']!="" && $request['pttdokter']!="undefined"){
                    $data = $data->whereIn('pg.kategorypegawai','=',21);
                }
                if(isset($request['pns']) && $request['pns']!="" && $request['pns']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',1);
                }
                if(isset($request['polri']) && $request['polri']!="" && $request['polri']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',20);
                }
                $data = $data->get();

        $data2 = [];
        foreach ($data as $item) {
            $dataStr = \DB::table('masaberlakusipstr_t as str')
                ->select('str.pegawaifk')
                ->where('str.pegawaifk', $item->id)
                ->where('str.jenismasaberlakufk', 2)
                ->distinct()
                ->get();
            if (count($dataStr) > 0) {
                $item->dataStr = 'Sudah Input';
            } else {
                $item->dataStr = 'Belum Input';
            }
            
            $data2 []= $item;
        }
        $result = array(
            'data'=> $data2,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getDataSpkk2(Request $request) {
        // if ($request['ceklis'] == "nakes") {
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $data = \DB::table('pegawai_m as pg')
        //         ->select('pg.id', 'pg.namalengkap')
        //         ->where('pg.statusenabled', true)
        //         ->where('pg.kedudukanfk', 1)
        //         ->whereIn('pg.kategorypegawai', [18,19,21,22]);
        //         if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
        //             $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
        //         }
        //         if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
        //             $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
        //         }
        //         if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
        //             $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
        //         }
        //         if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
        //             $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
        //         }
        //         $data = $data->get();
        // } else if ($request['ceklis'] == "polpns") {
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $data = \DB::table('pegawai_m as pg')
        //         ->select('pg.id', 'pg.namalengkap')
        //         ->where('pg.statusenabled', true)
        //         ->where('pg.kedudukanfk', 1)
        //         ->whereIn('pg.kategorypegawai', [1,20]);
        //         if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
        //             $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
        //         }
        //         if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
        //             $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
        //         }
        //         if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
        //             $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
        //         }
        //         if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
        //             $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
        //         }
        //         $data = $data->get();
        // } else {
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $data = \DB::table('pegawai_m as pg')
        //         ->select('pg.id', 'pg.namalengkap')
        //         ->where('pg.statusenabled', true)
        //         ->where('pg.kedudukanfk', 1);
        //         if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
        //             $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
        //         }
        //         if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
        //             $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
        //         }
        //         if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
        //             $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
        //         }
        //         if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
        //             $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
        //         }
        //         if(isset($request['ceklis']) && $request['ceklis']!="" && $request['ceklis']!="undefined"){
        //             $data = $data->whereIn('pg.kategorypegawai',[$request['ceklis']]);
        //         }
        //         $data = $data->get();
        // }
        ini_set('max_execution_time', 500); //6 minutes
            $data = \DB::table('pegawai_m as pg')
                ->select('pg.id', 'pg.namalengkap')
                ->where('pg.statusenabled', true)
                ->where('pg.kedudukanfk', 1);
                // ->whereIn('pg.kategorypegawai', [18,19,21,22]);
                if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
                    $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
                }
                if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
                    $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
                }
                if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
                    $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
                }
                if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
                    $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
                }
                if(isset($request['pttnomedis']) && $request['pttnomedis']!="" && $request['pttnomedis']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',23);
                }
                if(isset($request['pttmedis']) && $request['pttmedis']!="" && $request['pttmedis']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',22);
                }
                if(isset($request['pttdokter']) && $request['pttdokter']!="" && $request['pttdokter']!="undefined"){
                    $data = $data->whereIn('pg.kategorypegawai','=',21);
                }
                if(isset($request['pns']) && $request['pns']!="" && $request['pns']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',1);
                }
                if(isset($request['polri']) && $request['polri']!="" && $request['polri']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',20);
                }
                $data = $data->get();

        $data2 = [];
        foreach ($data as $item) {
            $dataSpkk = \DB::table('riwayatspkk_t as rs')
                ->select('rs.objectpegawaifk')
                ->where('rs.objectpegawaifk', $item->id)
                ->distinct()
                ->get();
            if (count($dataSpkk) > 0) {
                $item->dataSpkk = 'Sudah Input';
            } else {
                $item->dataSpkk = 'Belum Input';
            }
            
            $data2 []= $item;
        }
        $result = array(
            'data'=> $data2,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getDataSeminar2(Request $request) {
        // if ($request['ceklis'] == "nakes") {
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $data = \DB::table('pegawai_m as pg')
        //         ->select('pg.id', 'pg.namalengkap')
        //         ->where('pg.statusenabled', true)
        //         ->where('pg.kedudukanfk', 1)
        //         ->whereIn('pg.kategorypegawai', [18,19,21,22]);
        //         if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
        //             $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
        //         }
        //         if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
        //             $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
        //         }
        //         if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
        //             $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
        //         }
        //         if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
        //             $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
        //         }
        //         $data = $data->get();
        // } else if ($request['ceklis'] == "polpns") {
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $data = \DB::table('pegawai_m as pg')
        //         ->select('pg.id', 'pg.namalengkap')
        //         ->where('pg.statusenabled', true)
        //         ->where('pg.kedudukanfk', 1)
        //         ->whereIn('pg.kategorypegawai', [1,20]);
        //         if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
        //             $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
        //         }
        //         if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
        //             $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
        //         }
        //         if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
        //             $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
        //         }
        //         if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
        //             $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
        //         }
        //         $data = $data->get();
        // } else {
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $data = \DB::table('pegawai_m as pg')
        //         ->select('pg.id', 'pg.namalengkap')
        //         ->where('pg.statusenabled', true)
        //         ->where('pg.kedudukanfk', 1);
        //         if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
        //             $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
        //         }
        //         if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
        //             $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
        //         }
        //         if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
        //             $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
        //         }
        //         if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
        //             $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
        //         }
        //         if(isset($request['ceklis']) && $request['ceklis']!="" && $request['ceklis']!="undefined"){
        //             $data = $data->whereIn('pg.kategorypegawai',[$request['ceklis']]);
        //         }
        //         $data = $data->get();
        // }
        ini_set('max_execution_time', 500); //6 minutes
            $data = \DB::table('pegawai_m as pg')
                ->select('pg.id', 'pg.namalengkap')
                ->where('pg.statusenabled', true)
                ->where('pg.kedudukanfk', 1);
                // ->whereIn('pg.kategorypegawai', [18,19,21,22]);
                if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
                    $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
                }
                if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
                    $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
                }
                if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
                    $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
                }
                if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
                    $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
                }
                if(isset($request['pttnomedis']) && $request['pttnomedis']!="" && $request['pttnomedis']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',23);
                }
                if(isset($request['pttmedis']) && $request['pttmedis']!="" && $request['pttmedis']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',22);
                }
                if(isset($request['pttdokter']) && $request['pttdokter']!="" && $request['pttdokter']!="undefined"){
                    $data = $data->whereIn('pg.kategorypegawai','=',21);
                }
                if(isset($request['pns']) && $request['pns']!="" && $request['pns']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',1);
                }
                if(isset($request['polri']) && $request['polri']!="" && $request['polri']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',20);
                }
                $data = $data->get();

        $data2 = [];
        foreach ($data as $item) {
            $dataSeminar = \DB::table('riwayatseminar_t as rss')
                ->select('rss.objectpegawaifk')
                ->where('rss.objectpegawaifk', $item->id)
                ->distinct()
                ->get();
            if (count($dataSeminar) > 0) {
                $item->dataSeminar = 'Sudah Input';
            } else {
                $item->dataSeminar = 'Belum Input';
            }
            
            $data2 []= $item;
        }
        $result = array(
            'data'=> $data2,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getDataDikjur2(Request $request) {
        // if ($request['ceklis'] == "nakes") {
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $data = \DB::table('pegawai_m as pg')
        //         ->select('pg.id', 'pg.namalengkap')
        //         ->where('pg.statusenabled', true)
        //         ->where('pg.kedudukanfk', 1)
        //         ->whereIn('pg.kategorypegawai', [18,19,21,22]);
        //         if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
        //             $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
        //         }
        //         if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
        //             $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
        //         }
        //         if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
        //             $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
        //         }
        //         if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
        //             $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
        //         }
        //         $data = $data->get();
        // } else if ($request['ceklis'] == "polpns") {
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $data = \DB::table('pegawai_m as pg')
        //         ->select('pg.id', 'pg.namalengkap')
        //         ->where('pg.statusenabled', true)
        //         ->where('pg.kedudukanfk', 1)
        //         ->whereIn('pg.kategorypegawai', [1,20]);
        //         if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
        //             $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
        //         }
        //         if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
        //             $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
        //         }
        //         if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
        //             $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
        //         }
        //         if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
        //             $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
        //         }
        //         $data = $data->get();
        // } else {
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $data = \DB::table('pegawai_m as pg')
        //         ->select('pg.id', 'pg.namalengkap')
        //         ->where('pg.statusenabled', true)
        //         ->where('pg.kedudukanfk', 1);
        //         if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
        //             $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
        //         }
        //         if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
        //             $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
        //         }
        //         if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
        //             $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
        //         }
        //         if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
        //             $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
        //         }
        //         if(isset($request['ceklis']) && $request['ceklis']!="" && $request['ceklis']!="undefined"){
        //             $data = $data->whereIn('pg.kategorypegawai',[$request['ceklis']]);
        //         }
        //         $data = $data->get();
        // }
        ini_set('max_execution_time', 500); //6 minutes
            $data = \DB::table('pegawai_m as pg')
                ->select('pg.id', 'pg.namalengkap')
                ->where('pg.statusenabled', true)
                ->where('pg.kedudukanfk', 1);
                // ->whereIn('pg.kategorypegawai', [18,19,21,22]);
                if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
                    $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
                }
                if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
                    $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
                }
                if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
                    $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
                }
                if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
                    $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
                }
                if(isset($request['pttnomedis']) && $request['pttnomedis']!="" && $request['pttnomedis']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',23);
                }
                if(isset($request['pttmedis']) && $request['pttmedis']!="" && $request['pttmedis']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',22);
                }
                if(isset($request['pttdokter']) && $request['pttdokter']!="" && $request['pttdokter']!="undefined"){
                    $data = $data->whereIn('pg.kategorypegawai','=',21);
                }
                if(isset($request['pns']) && $request['pns']!="" && $request['pns']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',1);
                }
                if(isset($request['polri']) && $request['polri']!="" && $request['polri']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',20);
                }
                $data = $data->get();

        $data2 = [];
        foreach ($data as $item) {
            $dataDikjur = \DB::table('riwayatdikjur_t as rd')
                ->select('rd.objectpegawaifk')
                ->where('rd.objectpegawaifk', $item->id)
                ->distinct()
                ->get();
            if (count($dataDikjur) > 0) {
                $item->dataDikjur = 'Sudah Input';
            } else {
                $item->dataDikjur = 'Belum Input';
            }
            
            $data2 []= $item;
        }
        $result = array(
            'data'=> $data2,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getDataTandaJasa2(Request $request) {
        // if ($request['ceklis'] == "nakes") {
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $data = \DB::table('pegawai_m as pg')
        //         ->select('pg.id', 'pg.namalengkap')
        //         ->where('pg.statusenabled', true)
        //         ->where('pg.kedudukanfk', 1)
        //         ->whereIn('pg.kategorypegawai', [18,19,21,22]);
        //         if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
        //             $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
        //         }
        //         if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
        //             $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
        //         }
        //         if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
        //             $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
        //         }
        //         if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
        //             $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
        //         }
        //         $data = $data->get();
        // } else if ($request['ceklis'] == "polpns") {
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $data = \DB::table('pegawai_m as pg')
        //         ->select('pg.id', 'pg.namalengkap')
        //         ->where('pg.statusenabled', true)
        //         ->where('pg.kedudukanfk', 1)
        //         ->whereIn('pg.kategorypegawai', [1,20]);
        //         if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
        //             $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
        //         }
        //         if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
        //             $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
        //         }
        //         if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
        //             $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
        //         }
        //         if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
        //             $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
        //         }
        //         $data = $data->get();
        // } else {
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $data = \DB::table('pegawai_m as pg')
        //         ->select('pg.id', 'pg.namalengkap')
        //         ->where('pg.statusenabled', true)
        //         ->where('pg.kedudukanfk', 1);
        //         if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
        //             $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
        //         }
        //         if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
        //             $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
        //         }
        //         if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
        //             $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
        //         }
        //         if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
        //             $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
        //         }
        //         if(isset($request['ceklis']) && $request['ceklis']!="" && $request['ceklis']!="undefined"){
        //             $data = $data->whereIn('pg.kategorypegawai',[$request['ceklis']]);
        //         }
        //         $data = $data->get();
        // }
        ini_set('max_execution_time', 500); //6 minutes
            $data = \DB::table('pegawai_m as pg')
                ->select('pg.id', 'pg.namalengkap')
                ->where('pg.statusenabled', true)
                ->where('pg.kedudukanfk', 1);
                // ->whereIn('pg.kategorypegawai', [18,19,21,22]);
                if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
                    $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
                }
                if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
                    $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
                }
                if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
                    $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
                }
                if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
                    $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
                }
                if(isset($request['pttnomedis']) && $request['pttnomedis']!="" && $request['pttnomedis']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',23);
                }
                if(isset($request['pttmedis']) && $request['pttmedis']!="" && $request['pttmedis']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',22);
                }
                if(isset($request['pttdokter']) && $request['pttdokter']!="" && $request['pttdokter']!="undefined"){
                    $data = $data->whereIn('pg.kategorypegawai','=',21);
                }
                if(isset($request['pns']) && $request['pns']!="" && $request['pns']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',1);
                }
                if(isset($request['polri']) && $request['polri']!="" && $request['polri']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',20);
                }
                $data = $data->get();

        $data2 = [];
        foreach ($data as $item) {
            $dataTandaJasa = \DB::table('tandajasa_t as tj')
                ->select('tj.objectpegawaifk')
                ->where('tj.objectpegawaifk', $item->id)
                ->distinct()
                ->get();
            if (count($dataTandaJasa) > 0) {
                $item->tandaJasa = 'Sudah Input';
            } else {
                $item->tandaJasa = 'Belum Input';
            }
            
            $data2 []= $item;
        }
        $result = array(
            'data'=> $data2,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getDataBahasa2(Request $request) {
        // if ($request['ceklis'] == "nakes") {
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $data = \DB::table('pegawai_m as pg')
        //         ->select('pg.id', 'pg.namalengkap')
        //         ->where('pg.statusenabled', true)
        //         ->where('pg.kedudukanfk', 1)
        //         ->whereIn('pg.kategorypegawai', [18,19,21,22]);
        //         if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
        //             $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
        //         }
        //         if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
        //             $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
        //         }
        //         if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
        //             $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
        //         }
        //         if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
        //             $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
        //         }
        //         $data = $data->get();
        // } else if ($request['ceklis'] == "polpns") {
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $data = \DB::table('pegawai_m as pg')
        //         ->select('pg.id', 'pg.namalengkap')
        //         ->where('pg.statusenabled', true)
        //         ->where('pg.kedudukanfk', 1)
        //         ->whereIn('pg.kategorypegawai', [1,20]);
        //         if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
        //             $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
        //         }
        //         if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
        //             $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
        //         }
        //         if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
        //             $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
        //         }
        //         if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
        //             $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
        //         }
        //         $data = $data->get();
        // } else {
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $data = \DB::table('pegawai_m as pg')
        //         ->select('pg.id', 'pg.namalengkap')
        //         ->where('pg.statusenabled', true)
        //         ->where('pg.kedudukanfk', 1);
        //         if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
        //             $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
        //         }
        //         if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
        //             $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
        //         }
        //         if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
        //             $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
        //         }
        //         if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
        //             $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
        //         }
        //         if(isset($request['ceklis']) && $request['ceklis']!="" && $request['ceklis']!="undefined"){
        //             $data = $data->whereIn('pg.kategorypegawai',[$request['ceklis']]);
        //         }
        //         $data = $data->get();
        // }
        ini_set('max_execution_time', 500); //6 minutes
            $data = \DB::table('pegawai_m as pg')
                ->select('pg.id', 'pg.namalengkap')
                ->where('pg.statusenabled', true)
                ->where('pg.kedudukanfk', 1);
                // ->whereIn('pg.kategorypegawai', [18,19,21,22]);
                if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
                    $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
                }
                if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
                    $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
                }
                if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
                    $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
                }
                if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
                    $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
                }
                if(isset($request['pttnomedis']) && $request['pttnomedis']!="" && $request['pttnomedis']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',23);
                }
                if(isset($request['pttmedis']) && $request['pttmedis']!="" && $request['pttmedis']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',22);
                }
                if(isset($request['pttdokter']) && $request['pttdokter']!="" && $request['pttdokter']!="undefined"){
                    $data = $data->whereIn('pg.kategorypegawai','=',21);
                }
                if(isset($request['pns']) && $request['pns']!="" && $request['pns']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',1);
                }
                if(isset($request['polri']) && $request['polri']!="" && $request['polri']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',20);
                }
                $data = $data->get();

        $data2 = [];
        foreach ($data as $item) {
            $dataBahasa = \DB::table('kecakapanbahasa_t as kb')
                ->select('kb.objectpegawaifk')
                ->where('kb.objectpegawaifk', $item->id)
                ->distinct()
                ->get();
            if (count($dataBahasa) > 0) {
                $item->dataBahasa = 'Sudah Input';
            } else {
                $item->dataBahasa = 'Belum Input';
            }
            
            $data2 []= $item;
        }
        $result = array(
            'data'=> $data2,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getDataOrganisasi2(Request $request) {
        // if ($request['ceklis'] == "nakes") {
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $data = \DB::table('pegawai_m as pg')
        //         ->select('pg.id', 'pg.namalengkap')
        //         ->where('pg.statusenabled', true)
        //         ->where('pg.kedudukanfk', 1)
        //         ->whereIn('pg.kategorypegawai', [18,19,21,22]);
        //         if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
        //             $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
        //         }
        //         if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
        //             $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
        //         }
        //         if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
        //             $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
        //         }
        //         if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
        //             $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
        //         }
        //         $data = $data->get();
        // } else if ($request['ceklis'] == "polpns") {
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $data = \DB::table('pegawai_m as pg')
        //         ->select('pg.id', 'pg.namalengkap')
        //         ->where('pg.statusenabled', true)
        //         ->where('pg.kedudukanfk', 1)
        //         ->whereIn('pg.kategorypegawai', [1,20]);
        //         if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
        //             $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
        //         }
        //         if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
        //             $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
        //         }
        //         if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
        //             $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
        //         }
        //         if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
        //             $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
        //         }
        //         $data = $data->get();
        // } else {
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $data = \DB::table('pegawai_m as pg')
        //         ->select('pg.id', 'pg.namalengkap')
        //         ->where('pg.statusenabled', true)
        //         ->where('pg.kedudukanfk', 1);
        //         if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
        //             $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
        //         }
        //         if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
        //             $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
        //         }
        //         if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
        //             $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
        //         }
        //         if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
        //             $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
        //         }
        //         if(isset($request['ceklis']) && $request['ceklis']!="" && $request['ceklis']!="undefined"){
        //             $data = $data->whereIn('pg.kategorypegawai',[$request['ceklis']]);
        //         }
        //         $data = $data->get();
        // }
        ini_set('max_execution_time', 500); //6 minutes
            $data = \DB::table('pegawai_m as pg')
                ->select('pg.id', 'pg.namalengkap')
                ->where('pg.statusenabled', true)
                ->where('pg.kedudukanfk', 1);
                // ->whereIn('pg.kategorypegawai', [18,19,21,22]);
                if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
                    $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
                }
                if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
                    $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
                }
                if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
                    $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
                }
                if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
                    $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
                }
                if(isset($request['pttnomedis']) && $request['pttnomedis']!="" && $request['pttnomedis']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',23);
                }
                if(isset($request['pttmedis']) && $request['pttmedis']!="" && $request['pttmedis']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',22);
                }
                if(isset($request['pttdokter']) && $request['pttdokter']!="" && $request['pttdokter']!="undefined"){
                    $data = $data->whereIn('pg.kategorypegawai','=',21);
                }
                if(isset($request['pns']) && $request['pns']!="" && $request['pns']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',1);
                }
                if(isset($request['polri']) && $request['polri']!="" && $request['polri']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',20);
                }
                $data = $data->get();

        $data2 = [];
        foreach ($data as $item) {
            $dataOrganisasi = \DB::table('organisasiprofesi_t as op')
                ->select('op.objectpegawaifk')
                ->where('op.objectpegawaifk', $item->id)
                ->distinct()
                ->get();
            if (count($dataOrganisasi) > 0) {
                $item->dataOrganisasi = 'Sudah Input';
            } else {
                $item->dataOrganisasi = 'Belum Input';
            }
            
            $data2 []= $item;
        }
        $result = array(
            'data'=> $data2,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getStatusPegawai(Request $request) {
        // if ($request['ceklis'] == "nakes") {
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $data = \DB::table('pegawai_m as pg')
        //         ->select('pg.id', 'pg.namalengkap', 'pg.kategorypegawai', 'pg.objectjabatanfungsionalfk', 'pg.tglmasuk')
        //         ->where('pg.statusenabled', true)
        //         ->where('pg.kedudukanfk', 1)
        //         ->whereIn('pg.kategorypegawai', [18,19,21,22]);
        //         if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
        //             $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
        //         }
        //         if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
        //             $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
        //         }
        //         if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
        //             $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
        //         }
        //         if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
        //             $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
        //         }
        //         $data = $data->get();
        // } else if ($request['ceklis'] == "polpns") {
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $data = \DB::table('pegawai_m as pg')
        //         ->select('pg.id', 'pg.namalengkap', 'pg.kategorypegawai', 'pg.objectjabatanfungsionalfk', 'pg.tglmasuk')
        //         ->where('pg.statusenabled', true)
        //         ->where('pg.kedudukanfk', 1)
        //         ->whereIn('pg.kategorypegawai', [1,20]);
        //         if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
        //             $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
        //         }
        //         if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
        //             $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
        //         }
        //         if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
        //             $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
        //         }
        //         if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
        //             $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
        //         }
        //         $data = $data->get();
        // } else {
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $data = \DB::table('pegawai_m as pg')
        //         ->select('pg.id', 'pg.namalengkap', 'pg.kategorypegawai', 'pg.objectjabatanfungsionalfk', 'pg.tglmasuk')
        //         ->where('pg.statusenabled', true)
        //         ->where('pg.kedudukanfk', 1);
        //         if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
        //             $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
        //         }
        //         if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
        //             $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
        //         }
        //         if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
        //             $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
        //         }
        //         if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
        //             $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
        //         }
        //         if(isset($request['ceklis']) && $request['ceklis']!="" && $request['ceklis']!="undefined"){
        //             $data = $data->whereIn('pg.kategorypegawai',[$request['ceklis']]);
        //         }
        //         $data = $data->get();
        // }
        ini_set('max_execution_time', 500); //6 minutes
            $data = \DB::table('pegawai_m as pg')
                ->select('pg.id', 'pg.namalengkap', 'pg.kategorypegawai', 'pg.objectjabatanfungsionalfk', 'pg.tglmasuk')
                ->where('pg.statusenabled', true)
                ->where('pg.kedudukanfk', 1);
                // ->whereIn('pg.kategorypegawai', [18,19,21,22]);
                if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
                    $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
                }
                if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
                    $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
                }
                if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
                    $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
                }
                if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
                    $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
                }
                if(isset($request['pttnomedis']) && $request['pttnomedis']!="" && $request['pttnomedis']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',23);
                }
                if(isset($request['pttmedis']) && $request['pttmedis']!="" && $request['pttmedis']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',22);
                }
                if(isset($request['pttdokter']) && $request['pttdokter']!="" && $request['pttdokter']!="undefined"){
                    $data = $data->whereIn('pg.kategorypegawai','=',21);
                }
                if(isset($request['pns']) && $request['pns']!="" && $request['pns']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',1);
                }
                if(isset($request['polri']) && $request['polri']!="" && $request['polri']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',20);
                }
                $data = $data->get();

        $data2 = [];
        foreach ($data as $item) {
            if ($item->kategorypegawai != null) {
                if ($item->objectjabatanfungsionalfk != null) {
                    if ($item->tglmasuk != null) {
                        $item->statusPegawai = 'Sudah Input';
                    } else {
                        $item->statusPegawai = 'Belum Input';
                    }
                } else {
                    $item->statusPegawai = 'Belum Input';
                }
            } else {
                $item->statusPegawai = 'Belum Input';
            }
            $data2 []= $item;
        }
        $result = array(
            'data'=> $data2,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getRiwayatKepangkatan(Request $request) {
        // if ($request['ceklis'] == "nakes") {
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $data = \DB::table('pegawai_m as pg')
        //         ->select('pg.id', 'pg.namalengkap')
        //         ->where('pg.statusenabled', true)
        //         ->where('pg.kedudukanfk', 1)
        //         ->whereIn('pg.kategorypegawai', [18,19,21,22]);
        //         if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
        //             $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
        //         }
        //         if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
        //             $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
        //         }
        //         if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
        //             $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
        //         }
        //         if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
        //             $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
        //         }
        //         $data = $data->get();
        // } else if ($request['ceklis'] == "polpns") {
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $data = \DB::table('pegawai_m as pg')
        //         ->select('pg.id', 'pg.namalengkap')
        //         ->where('pg.statusenabled', true)
        //         ->where('pg.kedudukanfk', 1)
        //         ->whereIn('pg.kategorypegawai', [1,20]);
        //         if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
        //             $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
        //         }
        //         if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
        //             $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
        //         }
        //         if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
        //             $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
        //         }
        //         if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
        //             $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
        //         }
        //         $data = $data->get();
        // } else {
        //     ini_set('max_execution_time', 500); //6 minutes
        //     $data = \DB::table('pegawai_m as pg')
        //         ->select('pg.id', 'pg.namalengkap')
        //         ->where('pg.statusenabled', true)
        //         ->where('pg.kedudukanfk', 1);
        //         if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
        //             $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
        //         }
        //         if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
        //             $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
        //         }
        //         if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
        //             $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
        //         }
        //         if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
        //             $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
        //         }
        //         if(isset($request['ceklis']) && $request['ceklis']!="" && $request['ceklis']!="undefined"){
        //             $data = $data->whereIn('pg.kategorypegawai',[$request['ceklis']]);
        //         }
        //         $data = $data->get();
        // }
        ini_set('max_execution_time', 500); //6 minutes
            $data = \DB::table('pegawai_m as pg')
                ->select('pg.id', 'pg.namalengkap')
                ->where('pg.statusenabled', true)
                ->where('pg.kedudukanfk', 1);
                // ->whereIn('pg.kategorypegawai', [18,19,21,22]);
                if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
                    $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
                }
                if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
                    $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
                }
                if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
                    $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
                }
                if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
                    $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
                }
                if(isset($request['pttnomedis']) && $request['pttnomedis']!="" && $request['pttnomedis']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',23);
                }
                if(isset($request['pttmedis']) && $request['pttmedis']!="" && $request['pttmedis']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',22);
                }
                if(isset($request['pttdokter']) && $request['pttdokter']!="" && $request['pttdokter']!="undefined"){
                    $data = $data->whereIn('pg.kategorypegawai','=',21);
                }
                if(isset($request['pns']) && $request['pns']!="" && $request['pns']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',1);
                }
                if(isset($request['polri']) && $request['polri']!="" && $request['polri']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',20);
                }
                $data = $data->get();

        $data2 = [];
        foreach ($data as $item) {
            $dataRiwayatKepangkatan = \DB::table('riwayatkepangkatan_t as rk')
                ->select('rk.objectpegawaifk')
                ->where('rk.objectpegawaifk', $item->id)
                ->distinct()
                ->get();
            if (count($dataRiwayatKepangkatan) > 0) {
                $item->dataRiwayatKepangkatan = 'Sudah Input';
            } else {
                $item->dataRiwayatKepangkatan = 'Belum Input';
            }
            
            $data2 []= $item;
        }
        $result = array(
            'data'=> $data2,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getRekapPegawaiSudahInput(Request $request) {
        $instalasi = '';
        $ruangan = '';
        $unitKerja = '';
        $pttnomedis = '';
        $pttmedis = '';
        $pttdokter = '';
        $pns = '';
        $polri = '';
        if(isset($request['instalasi']) && $request['instalasi']!=''){
            $instalasi = ' and pg.objectdepartemenkerjafk ='.$request['instalasi'];
        }
        if(isset($request['ruangan']) && $request['ruangan']!=''){
            $ruangan = ' and pg.objectruangankerjafk ='.$request['ruangan'];
        }
        if(isset($request['unitKerja']) && $request['unitKerja']!=''){
            $unitKerja = ' and pg.objectunitkerjapegawaifk ='.$request['unitKerja'];
        }
        if(isset($request['pttnomedis']) && $request['pttnomedis']!=''){
            $pttnomedis = ' and pg.kategorypegawai = 23';
        }
        if(isset($request['pttmedis']) && $request['pttmedis']!=''){
            $pttmedis = ' and pg.kategorypegawai = 22';
        }
        if(isset($request['pttdokter']) && $request['pttdokter']!=''){
            $pttdokter = ' and pg.kategorypegawai = 21';
        }
        if(isset($request['pns']) && $request['pns']!=''){
            $pns = ' and pg.kategorypegawai = 1';
        }
        if(isset($request['polri']) && $request['polri']!=''){
            $polri = ' and pg.kategorypegawai = 20';
        }
        $data = DB::select(DB::raw("
        select case when x.namadepartemen is not null then x.namadepartemen else 'Belum Input Instalasi' end as namadepartemen, count(x.pegawaikp) as jumlahkp, count(x.pegawairp) as jumlahrp, count(x.pegawairpp) as jumlahrpp, count(x.pegawairj) as jumlahrj, count(x.pegawairs) as jumlahrs, count(x.pegawairss) as jumlahrss, count(x.pegawaird) as jumlahrd,
        count(x.pegawaitj) as jumlahtj, count(x.pegawaikb) jumlahkb, count(x.pegawaiop) as jumlahop  from (
        select distinct dp.namadepartemen, kp.objectpegawaifk as pegawaikp, rp.objectpegawaifk as pegawairp , rpp.objectpegawaifk as pegawairpp, rj.objectpegawaifk as pegawairj, rs.objectpegawaifk as pegawairs, rss.objectpegawaifk as pegawairss, 
        rd.objectpegawaifk as pegawaird, tj.objectpegawaifk as pegawaitj, kb.objectpegawaifk as pegawaikb, op.objectpegawaifk as pegawaiop
        from pegawai_m as pg left join
        keluargapegawai_m as kp on kp.objectpegawaifk = pg.id left join
        riwayatpendidikan_t as rp on rp.objectpegawaifk = pg.id left join
        riwayatpelatihan_t as rpp on rpp.objectpegawaifk = pg.id left join
        riwayatjabatan_t as rj on rj.objectpegawaifk = pg.id left join
        riwayatspkk_t as rs on rs.objectpegawaifk = pg.id left join
        riwayatseminar_t as rss on rss.objectpegawaifk = pg.id left join 
        riwayatdikjur_t as rd on rd.objectpegawaifk = pg.id left join
        tandajasa_t as tj on tj.objectpegawaifk = pg.id left join
        kecakapanbahasa_t as kb on kb.objectpegawaifk = pg.id left join
        organisasiprofesi_t as op on op.objectpegawaifk = pg.id left join
        departemen_m as dp on dp.id = pg.objectdepartemenkerjafk
        where pg.kedudukanfk = 1
        $instalasi $ruangan $unitKerja $pttnomedis $pttmedis $pttdokter $pns $polri) as x
        group by x.namadepartemen
        order by x.namadepartemen
        "));
        return $this->respond($data);
    }
    public function getRekapPegawaiSip(Request $request) {
        $instalasi = '';
        $ruangan = '';
        $unitKerja = '';
        $pttnomedis = '';
        $pttmedis = '';
        $pttdokter = '';
        $pns = '';
        $polri = '';
        if(isset($request['instalasi']) && $request['instalasi']!=''){
            $instalasi = ' and pg.objectdepartemenkerjafk ='.$request['instalasi'];
        }
        if(isset($request['ruangan']) && $request['ruangan']!=''){
            $ruangan = ' and pg.objectruangankerjafk ='.$request['ruangan'];
        }
        if(isset($request['unitKerja']) && $request['unitKerja']!=''){
            $unitKerja = ' and pg.objectunitkerjapegawaifk ='.$request['unitKerja'];
        }
        if(isset($request['pttnomedis']) && $request['pttnomedis']!=''){
            $pttnomedis = ' and pg.kategorypegawai = 23';
        }
        if(isset($request['pttmedis']) && $request['pttmedis']!=''){
            $pttmedis = ' and pg.kategorypegawai = 22';
        }
        if(isset($request['pttdokter']) && $request['pttdokter']!=''){
            $pttdokter = ' and pg.kategorypegawai = 21';
        }
        if(isset($request['pns']) && $request['pns']!=''){
            $pns = ' and pg.kategorypegawai = 1';
        }
        if(isset($request['polri']) && $request['polri']!=''){
            $polri = ' and pg.kategorypegawai = 20';
        }
        $data = DB::select(DB::raw("
            select count(x.namalengkap) as jumlahsip, case when x.namadepartemen is not null then x.namadepartemen else 'Belum Input Instalasi' end as namadepartemen from (
            select distinct pg.namalengkap, dp.namadepartemen from masaberlakusipstr_t as mbs inner join
            pegawai_m as pg on pg.id = mbs.pegawaifk left join
            departemen_m as dp on dp.id = pg.objectdepartemenkerjafk
            where mbs.jenismasaberlakufk = 1
            $instalasi $ruangan $unitKerja $pttnomedis $pttmedis $pttdokter $pns $polri) as x
            group by x.namadepartemen
            order by x.namadepartemen
        "));
        return $this->respond($data);
    }
    public function getRekapPegawaiStr(Request $request) {
        $instalasi = '';
        $ruangan = '';
        $unitKerja = '';
        $pttnomedis = '';
        $pttmedis = '';
        $pttdokter = '';
        $pns = '';
        $polri = '';
        if(isset($request['instalasi']) && $request['instalasi']!=''){
            $instalasi = ' and pg.objectdepartemenkerjafk ='.$request['instalasi'];
        }
        if(isset($request['ruangan']) && $request['ruangan']!=''){
            $ruangan = ' and pg.objectruangankerjafk ='.$request['ruangan'];
        }
        if(isset($request['unitKerja']) && $request['unitKerja']!=''){
            $unitKerja = ' and pg.objectunitkerjapegawaifk ='.$request['unitKerja'];
        }
        if(isset($request['pttnomedis']) && $request['pttnomedis']!=''){
            $pttnomedis = ' and pg.kategorypegawai = 23';
        }
        if(isset($request['pttmedis']) && $request['pttmedis']!=''){
            $pttmedis = ' and pg.kategorypegawai = 22';
        }
        if(isset($request['pttdokter']) && $request['pttdokter']!=''){
            $pttdokter = ' and pg.kategorypegawai = 21';
        }
        if(isset($request['pns']) && $request['pns']!=''){
            $pns = ' and pg.kategorypegawai = 1';
        }
        if(isset($request['polri']) && $request['polri']!=''){
            $polri = ' and pg.kategorypegawai = 20';
        }
        $data = DB::select(DB::raw("
            select count(x.namalengkap) as jumlahstr, case when x.namadepartemen is not null then x.namadepartemen else 'Belum Input Instalasi' end as namadepartemen from (
            select distinct pg.namalengkap, dp.namadepartemen from masaberlakusipstr_t as mbs inner join
            pegawai_m as pg on pg.id = mbs.pegawaifk left join
            departemen_m as dp on dp.id = pg.objectdepartemenkerjafk
            where mbs.jenismasaberlakufk = 2
            $instalasi $ruangan $unitKerja $pttnomedis $pttmedis $pttdokter $pns $polri) as x
            group by x.namadepartemen
            order by x.namadepartemen
        "));
        return $this->respond($data);
    }
    public function getRekapDataPegawai(Request $request) {
        $data = \DB::table('pegawai_m as pg')
            ->leftjoin('departemen_m as dp', 'dp.id', '=', 'pg.objectdepartemenkerjafk')
            ->select('pg.namalengkap', 'pg.tempatlahir', 'pg.tgllahir', 'pg.objectunitkerjapegawaifk', 'pg.objectdepartemenkerjafk', 'pg.objectruangankerjafk',
            'pg.objectjeniskelaminfk', 'pg.objectpendidikanterakhirfk', 'pg.objectagamafk', 'pg.nik_intern', 'pg.nocm', 'pg.email', 'dp.namadepartemen')
            ->where('pg.kedudukanfk', 1)
            ->where('pg.statusenabled', true)
            ->where('pg.kodeexternal', '!=', 'dua');

            if(isset($request['instalasi']) && $request['instalasi']!="" && $request['instalasi']!="undefined"){
                $data = $data->where('pg.objectdepartemenkerjafk','=',$request['instalasi']);
            }
            if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
                $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
            }
            if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
                $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
            }
            if(isset($request['pttnomedis']) && $request['pttnomedis']!="" && $request['pttnomedis']!="undefined"){
                $data = $data->where('pg.kategorypegawai','=',23);
            }
            if(isset($request['pttmedis']) && $request['pttmedis']!="" && $request['pttmedis']!="undefined"){
                $data = $data->where('pg.kategorypegawai','=',22);
            }
            if(isset($request['pttdokter']) && $request['pttdokter']!="" && $request['pttdokter']!="undefined"){
                $data = $data->where('pg.kategorypegawai','=',21);
            }
            if(isset($request['pns']) && $request['pns']!="" && $request['pns']!="undefined"){
                $data = $data->where('pg.kategorypegawai','=',1);
            }
            if(isset($request['polri']) && $request['polri']!="" && $request['polri']!="undefined"){
                $data = $data->where('pg.kategorypegawai','=',20);
            }

            $data = $data->orderBy('dp.namadepartemen');
            $data = $data->get();

        $data10 = [];
        $sama = false;
        $jmlSudahLengkap = 0;
        $jmlBelumLengkap = 0;
        foreach ($data as $item) {
            $sama = false;
            $i = 0;
            // return ($data10);
            // die();

            
            foreach ($data10 as $mumet) {
                if ($item->objectdepartemenkerjafk == $data10[$i]['objectdepartemenkerjafk']) {
                    $sama = true;
                    if ($item->namalengkap != null) {
                        if ($item->tempatlahir != null) {
                            if ($item->tgllahir != null) {
                                if ($item->objectunitkerjapegawaifk != null) {
                                    if ($item->objectdepartemenkerjafk != null) {
                                        if ($item->objectruangankerjafk != null) {
                                            if ($item->objectjeniskelaminfk != null) {
                                                if ($item->objectpendidikanterakhirfk != null) {
                                                    if ($item->objectagamafk != null) {
                                                        if ($item->nik_intern != null) {
                                                            if ($item->nocm != null) {
                                                                if ($item->email != null) {
                                                                    $jmlSudahLengkap = (float)$mumet['jmlSudahLengkap'] + 1;
                                                                    $data10[$i]['jmlSudahLengkap'] = $jmlSudahLengkap;
                                                                } else {
                                                                    $jmlBelumLengkap = (float)$mumet['jmlBelumLengkap'] + 1;
                                                                    $data10[$i]['jmlBelumLengkap'] = $jmlBelumLengkap;
                                                                }
                                                            } else {
                                                                $jmlBelumLengkap = (float)$mumet['jmlBelumLengkap'] + 1;
                                                                $data10[$i]['jmlBelumLengkap'] = $jmlBelumLengkap;
                                                            }
                                                        } else {
                                                            $jmlBelumLengkap = (float)$mumet['jmlBelumLengkap'] + 1;
                                                            $data10[$i]['jmlBelumLengkap'] = $jmlBelumLengkap;
                                                        }
                                                    } else {
                                                        $jmlBelumLengkap = (float)$mumet['jmlBelumLengkap'] + 1;
                                                        $data10[$i]['jmlBelumLengkap'] = $jmlBelumLengkap;
                                                    }
                                                } else {
                                                    $jmlBelumLengkap = (float)$mumet['jmlBelumLengkap'] + 1;
                                                    $data10[$i]['jmlBelumLengkap'] = $jmlBelumLengkap;
                                                }
                                            } else {
                                                $jmlBelumLengkap = (float)$mumet['jmlBelumLengkap'] + 1;
                                                $data10[$i]['jmlBelumLengkap'] = $jmlBelumLengkap;
                                            }
                                        } else {
                                            $jmlBelumLengkap = (float)$mumet['jmlBelumLengkap'] + 1;
                                            $data10[$i]['jmlBelumLengkap'] = $jmlBelumLengkap;
                                        }
                                    } else {
                                        $jmlBelumLengkap = (float)$mumet['jmlBelumLengkap'] + 1;
                                        $data10[$i]['jmlBelumLengkap'] = $jmlBelumLengkap;
                                    }
                                } else {
                                    $jmlBelumLengkap = (float)$mumet['jmlBelumLengkap'] + 1;
                                    $data10[$i]['jmlBelumLengkap'] = $jmlBelumLengkap;
                                }
                            } else {
                                $jmlBelumLengkap = (float)$mumet['jmlBelumLengkap'] + 1;
                                $data10[$i]['jmlBelumLengkap'] = $jmlBelumLengkap;
                            }
                        } else {
                            $jmlBelumLengkap = (float)$mumet['jmlBelumLengkap'] + 1;
                            $data10[$i]['jmlBelumLengkap'] = $jmlBelumLengkap;
                        }
                    } else {
                        $jmlBelumLengkap = (float)$mumet['jmlBelumLengkap'] + 1;
                        $data10[$i]['jmlBelumLengkap'] = $jmlBelumLengkap;
                    }
                }
                $i = $i + 1;
            }
            if ($sama == false) {
                $jmlSudahLengkap = 0;
                $jmlBelumLengkap = 0;
                if ($item->namalengkap != null) {
                    if ($item->tempatlahir != null) {
                        if ($item->tgllahir != null) {
                            if ($item->objectunitkerjapegawaifk != null) {
                                if ($item->objectdepartemenkerjafk != null) {
                                    if ($item->objectruangankerjafk != null) {
                                        if ($item->objectjeniskelaminfk != null) {
                                            if ($item->objectpendidikanterakhirfk != null) {
                                                if ($item->objectagamafk != null) {
                                                    if ($item->nik_intern != null) {
                                                        if ($item->nocm != null) {
                                                            if ($item->email != null) {
                                                                $jmlSudahLengkap = 1;
                                                            } else {
                                                                $jmlBelumLengkap = 1;
                                                            }
                                                        } else {
                                                            $jmlBelumLengkap = 1;
                                                        }
                                                    } else {
                                                        $jmlBelumLengkap = 1;
                                                    }
                                                } else {
                                                    $jmlBelumLengkap = 1;
                                                }
                                            } else {
                                                $jmlBelumLengkap = 1;
                                            }
                                        } else {
                                            $jmlBelumLengkap = 1;
                                        }
                                    } else {
                                        $jmlBelumLengkap = 1;
                                    }
                                } else {
                                    $jmlBelumLengkap = 1;
                                }
                            } else {
                                $jmlBelumLengkap = 1;
                            }
                        } else {
                            $jmlBelumLengkap = 1;
                        }
                    } else {
                        $jmlBelumLengkap = 1;
                    }
                } else {
                    $jmlBelumLengkap = 1;
                }
                $data10[] = array (
                    'objectdepartemenkerjafk' => $item->objectdepartemenkerjafk,
                    'departemen' => $item->namadepartemen,
                    'jmlSudahLengkap' => $jmlSudahLengkap,
                    'jmlBelumLengkap' => $jmlBelumLengkap
                );
            }
        }
        $result = array (
            'data' => $data10,
            'message' => 'Anjay Mabar'
        );
        return $this->respond($result);
    }
    public function getRekapDataPegawaiDetail(Request $request) {
        if($request['setParam'] == 1) {
            $data = \DB::table('pegawai_m as pg')
                ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pg.objectruangankerjafk')
                ->select('pg.namalengkap', 'pg.tempatlahir', 'pg.tgllahir', 'pg.objectunitkerjapegawaifk', 'pg.objectdepartemenkerjafk', 'pg.objectruangankerjafk',
                'pg.objectjeniskelaminfk', 'pg.objectpendidikanterakhirfk', 'pg.objectagamafk', 'pg.nik_intern', 'pg.nocm', 'pg.email', 'ru.namaruangan')
                ->where('pg.kedudukanfk', 1)
                ->where('pg.statusenabled', true)
                ->where('pg.kodeexternal', '!=', 'dua');

                if ($request['departemen'] == 'null') {
                    $data = $data->whereNull('pg.objectdepartemenkerjafk');
                } else {
                    if(isset($request['departemen']) && $request['departemen']!="" && $request['departemen']!="undefined"){
                        $data = $data->where('pg.objectdepartemenkerjafk','=',$request['departemen']);
                    }
                }
                if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
                    $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
                }
                if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
                    $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
                }
                if(isset($request['pttnomedis']) && $request['pttnomedis']!="" && $request['pttnomedis']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',23);
                }
                if(isset($request['pttmedis']) && $request['pttmedis']!="" && $request['pttmedis']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',22);
                }
                if(isset($request['pttdokter']) && $request['pttdokter']!="" && $request['pttdokter']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',21);
                }
                if(isset($request['pns']) && $request['pns']!="" && $request['pns']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',1);
                }
                if(isset($request['polri']) && $request['polri']!="" && $request['polri']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',20);
                }
            $data = $data->get();

            for ($i = count($data) - 1; $i >=0; $i--) {
                if ($data[$i]->namalengkap != null) {
                    if ($data[$i]->tempatlahir != null) {
                        if ($data[$i]->tgllahir != null) {
                            if ($data[$i]->objectunitkerjapegawaifk != null) {
                                if ($data[$i]->objectdepartemenkerjafk != null) {
                                    if ($data[$i]->objectruangankerjafk != null) {
                                        if ($data[$i]->objectjeniskelaminfk != null) {
                                            if ($data[$i]->objectpendidikanterakhirfk != null) {
                                                if ($data[$i]->objectagamafk != null) {
                                                    if ($data[$i]->nik_intern != null) {
                                                        if ($data[$i]->nocm != null) {
                                                            if ($data[$i]->email != null) {
                                                                array_splice($data,$i,1);
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else if($request['setParam'] == 2) {
            $data = \DB::table('pegawai_m as pg')
                ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pg.objectruangankerjafk')
                ->select('pg.namalengkap', 'pg.tempatlahir', 'pg.tgllahir', 'pg.objectunitkerjapegawaifk', 'pg.objectdepartemenkerjafk', 'pg.objectruangankerjafk',
                'pg.objectjeniskelaminfk', 'pg.objectpendidikanterakhirfk', 'pg.objectagamafk', 'pg.nik_intern', 'pg.nocm', 'pg.email', 'ru.namaruangan')
                ->where('pg.kedudukanfk', 1)
                ->where('pg.statusenabled', true)
                ->where('pg.kodeexternal', '!=', 'dua');

                if ($request['departemen'] == 'null') {
                    $data = $data->whereNull('pg.objectdepartemenkerjafk');
                } else {
                    if(isset($request['departemen']) && $request['departemen']!="" && $request['departemen']!="undefined"){
                        $data = $data->where('pg.objectdepartemenkerjafk','=',$request['departemen']);
                    }
                }
                if(isset($request['ruangan']) && $request['ruangan']!="" && $request['ruangan']!="undefined"){
                    $data = $data->where('pg.objectruangankerjafk','=',$request['ruangan']);
                }
                if(isset($request['unitkerja']) && $request['unitkerja']!="" && $request['unitkerja']!="undefined"){
                    $data = $data->where('pg.objectunitkerjapegawaifk','=',$request['unitkerja']);
                }
                if(isset($request['pttnomedis']) && $request['pttnomedis']!="" && $request['pttnomedis']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',23);
                }
                if(isset($request['pttmedis']) && $request['pttmedis']!="" && $request['pttmedis']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',22);
                }
                if(isset($request['pttdokter']) && $request['pttdokter']!="" && $request['pttdokter']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',21);
                }
                if(isset($request['pns']) && $request['pns']!="" && $request['pns']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',1);
                }
                if(isset($request['polri']) && $request['polri']!="" && $request['polri']!="undefined"){
                    $data = $data->where('pg.kategorypegawai','=',20);
                }
            $data = $data->get();
            
            $data2 = [];
            for ($i = count($data) - 1; $i >=0; $i--) {
                if ($data[$i]->namalengkap != null) {
                    if ($data[$i]->tempatlahir != null) {
                        if ($data[$i]->tgllahir != null) {
                            if ($data[$i]->objectunitkerjapegawaifk != null) {
                                if ($data[$i]->objectdepartemenkerjafk != null) {
                                    if ($data[$i]->objectruangankerjafk != null) {
                                        if ($data[$i]->objectjeniskelaminfk != null) {
                                            if ($data[$i]->objectpendidikanterakhirfk != null) {
                                                if ($data[$i]->objectagamafk != null) {
                                                    if ($data[$i]->nik_intern != null) {
                                                        if ($data[$i]->nocm != null) {
                                                            if ($data[$i]->email != null) {
                                                                $data2[] = array (
                                                                    'namalengkap' => $data[$i]->namalengkap,
                                                                    'tempatlahir' => $data[$i]->tempatlahir,
                                                                    'tgllahir' => $data[$i]->tgllahir,
                                                                    'objectunitkerjapegawaifk' => $data[$i]->objectunitkerjapegawaifk,
                                                                    'objectdepartemenkerjafk' => $data[$i]->objectdepartemenkerjafk,
                                                                    'objectruangankerjafk' => $data[$i]->objectruangankerjafk,
                                                                    'objectjeniskelaminfk' => $data[$i]->objectjeniskelaminfk,
                                                                    'objectpendidikanterakhirfk' => $data[$i]->objectpendidikanterakhirfk,
                                                                    'objectagamafk' => $data[$i]->objectagamafk,
                                                                    'nik_intern' => $data[$i]->nik_intern,
                                                                    'nocm' => $data[$i]->nocm,
                                                                    'email' => $data[$i]->email,
                                                                    'namaruangan' => $data[$i]->namaruangan
                                                                );
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            $data = $data2;
        }
        $result = array(
            'data' => $data,
            'message' => 'anjay'
        );
        return $this->respond($result);
    }
    public function getKedudukanPegawai(Request $request) {
        $top = $request['top'];
        $data = \DB::table('pegawai_m as pg')
            ->join('loginuser_s as log', 'log.objectpegawaifk', '=', 'pg.id')
            ->leftjoin('sdm_kedudukan_m as ked', 'ked.id', '=', 'pg.kedudukanfk')
            ->select('pg.namalengkap', 'log.namauser', 'ked.name as kedudukan', 'pg.id as idPegawai')
            ->where(function($data) {
                $data->where('pg.kedudukanfk', '<>', 1)
                    ->orWhereNull('pg.kedudukanfk');
            })
            ->where('pg.statusenabled', 1)
            ->whereNotIn('pg.id', [1,2,3,320261183]);

            if (isset($request['namaPegawai']) && $request['namaPegawai'] != "" && $request['namaPegawai'] != "undefined") {
                $data = $data->where('pg.namalengkap', 'like', '%'. $request['namaPegawai'] . '%');
            }
            if (isset($request['namaUser']) && $request['namaUser'] != "" && $request['namaUser'] != "undefined") {
                $data = $data->where('log.namauser', 'like', '%' . $request['namaUser'] . '%');
            }
            
            $data = $data->take($top);
            $data = $data->get();

            return $this->respond($data);
    }
    public function saveKedudukanPegawai(Request $request) {
        DB::beginTransaction();
        try {
            $update = Pegawai::where('id', $request['idPegawai'])
                ->update([
                    'kedudukanfk' => 1
                ]);
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = 'Gagal';
        }
        if ($transStatus == 'true') {
            $transMessage = 'Berhasil';
            DB::commit();
            $result = array (
                "status" => 201,
                "message" => $transMessage,
                "as" => "hehe"
            );
        } else {
            $transMessage = 'Gagal';
            DB::rollBack();
            $result = array (
                "status" => 400,
                "message" => $transMessage,
                "as" => "hehe"
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
}