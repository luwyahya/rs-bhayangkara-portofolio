<?php
/**
 * Created by PhpStorm.
 * User: nengepic
 * Date: 08/08/2019
 * Time: 16:49
 */
namespace App\Http\Controllers\Bedah;

use App\Http\Controllers\ApiController;
use App\Transaksi\AntrianPasienDiperiksa;;
use App\Transaksi\PasienDaftar;;

use App\Traits\Valet;
use App\Traits\PelayananPasienTrait;
use Illuminate\Http\Request;
use DB;
use App\Traits\SettingDataFixedTrait;
use Carbon\Carbon;

class BedahController extends ApiController
{
    use Valet, PelayananPasienTrait;

    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }
    public function getDataComboDokter(Request $request)
    {
        $dataLogin = $request->all();
        $dataInstalasi = \DB::table('departemen_m as dp')
            ->whereIn('dp.id', array(3, 14, 16, 17, 18, 19, 24, 25, 26, 27, 28, 35))
            ->where('dp.statusenabled', true)
            ->orderBy('dp.namadepartemen')
            ->get();

        $dataRuangan = \DB::table('ruangan_m as ru')
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();

        $dept = \DB::table('departemen_m as dept')
            ->where('dept.id', '18')
            ->orderBy('dept.namadepartemen')
            ->get();

        $deptRajalInap = \DB::table('departemen_m as dept')
            ->whereIn('dept.id', [16,17,35])
            ->orderBy('dept.namadepartemen')
            ->get();

        $ruanganRajal = \DB::table('ruangan_m as ru')
            ->where('statusenabled',true)
            ->wherein('ru.objectdepartemenfk', [18,24,28,27,3])
            ->orderBy('ru.namaruangan')
            ->get();

        $ruanganRanap = \DB::table('ruangan_m as ru')
            ->where('statusenabled',true)
            ->wherein('ru.objectdepartemenfk', [16,17,35])
            ->orderBy('ru.namaruangan')
            ->get();
        $ruanganBedah = \DB::table('ruangan_m as ru')
            ->where('statusenabled',true)
            ->wherein('ru.objectdepartemenfk', [25])
            ->orderBy('ru.namaruangan')
            ->get();
        $result = array(
            'dept' => $dept,
            'ruanganRajal' => $ruanganRajal,
            'ruanganRanap' => $ruanganRanap,
            'ruanganbedah' => $ruanganBedah,   
            'deptrirj' => $deptRajalInap,
            'ruanganall' => $dataRuangan,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
    public function getRinciankomponen(Request $request)
    {
        $data4 = \DB::table('jasadokterbedah as jdb')
            ->where('jdb.norecapd', $request['norecapd'])
            ->get();

        $result = array(
            'data'=> $data4,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getDaftarRegistrasiDokterBedah(Request $request)
    {
        $filter = $request->all();
        $ruangId = '';
        if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
            $ruangId = ' AND ru.id = ' . $filter['ruangId'];
        }
        $noreg = '';
        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
            $noreg = " AND pd.noregistrasi = '" .  $filter['noreg']."'";
        }
        $norm = '';
        if (isset($filter['norm']) && $filter['norm'] != "" && $filter['norm'] != "undefined") {
            $norm = "AND ps.nocm = '" .  $filter['norm']."'";
        }
        $nama = '';
        if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $nama = " AND ps.namapasien like '%".  $filter['nama']."%'";
        }
        $tglAwal = $filter['tglawal'];
        $tglAkhir = $filter['tglakhir'];

        $data =DB::select(DB::raw("select * from
                (select pd.tglregistrasi,  ps.id as nocmfk,  ps.nocm, ru1.namaruangan as ruanganasal,  pd.noregistrasi,  ps.namapasien,  ps.tgllahir, 
                 jk.jeniskelamin,  apd.objectruanganfk, ru.namaruangan,  kls.id as idkelas,kls.namakelas,  kp.kelompokpasien,  rek.namarekanan, 
                 apd.objectpegawaifk,  pg.namalengkap as namadokter,  br.norec,pg2.namalengkap as pegawaiverif, 
                 pd.norec as norec_pd, apd.tglmasuk, apd.norec as norec_apd, row_number() over (partition by pd.noregistrasi,apd.tglregistrasi order by apd.tglmasuk desc) as rownum 
                 from antrianpasiendiperiksa_t as apd
                 inner join pasiendaftar_t as pd on pd.norec = apd.noregistrasifk 
                 left join batalregistrasi_t as br on br.pasiendaftarfk = pd.norec
                 inner join pasien_m as ps on ps.id = pd.nocmfk
                 left join ruangan_m as ru1 on ru1.id = apd.objectruanganasalfk
                 left join jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk
                 left join kelas_m as kls on kls.id = pd.objectkelasfk
                 left join ruangan_m as ru on ru.id = apd.objectruanganfk
                 left join departemen_m as dept on dept.id = ru.objectdepartemenfk
                 left join pegawai_m as pg on pg.id = apd.objectpegawaifk
                 left join kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
                 left join rekanan_m as rek on rek.id = pd.objectrekananfk
                 left join strukorder_t as so on so.norec=apd.objectstrukorderfk
                 left join pegawai_m as pg2 on pg2.id = so.objectpetugasfk
                 where br.norec is null 
                and dept.id in (25) 
                and apd.tglmasuk between '$tglAwal' and '$tglAkhir'
                $ruangId $noreg $norm $nama
                 --order by ru.namaruangan asc
                 ) as x where x.rownum=1")
        );
        return $this->respond($data);
    }
    public function getDokters(Request $request)
    {
        $dataLogin = $request->all();
        $dataDokters = \DB::table('pegawai_m as p')
            ->select('p.id','p.namalengkap')
            ->where('p.statusenabled', true)
            ->where('p.objectjenispegawaifk', 1)
            ->orderBy('p.namalengkap')
            ->get();

        $result = array(
            'dokter'=> $dataDokters,
            'message' => 'ramdanegie',
        );

        return $this->respond($result);
    }
    public function updateDokterAntrian(Request $request)
    {
        DB::beginTransaction();
        try {

            if ($request['norec_apd']!=null) {
                $apd =  AntrianPasienDiperiksa::where('norec', $request['norec_apd'])->first();
                $ddddd = AntrianPasienDiperiksa::where('norec', $request['norec_apd'])
                    ->update([
                            'objectpegawaifk' => $request['iddokter']
                        ]

                    );

                $pasienDaftar = PasienDaftar::where('norec',$apd->noregistrasifk)->update([
                    'objectpegawaifk' => $request['iddokter']
                ]);
            }
            $transMessage = "Sukses";

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            DB::commit();
            $result = array(
                "status" => 201,
//                "message" =>   $transMessae,
                "message" => $transMessage,
                "struk" => $ddddd,//$noResep,,//$noResep,
                "as" => 'ramdanegie',
            );
        } else {
            $transMessage = "Simpan  Tanggal Pulang Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "struk" => $ddddd,
                "as" => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
}