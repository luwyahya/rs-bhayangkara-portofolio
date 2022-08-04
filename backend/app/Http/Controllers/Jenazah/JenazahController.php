<?php

/**
 * Created by PhpStorm.
 * User: ea
 * Date: 1/10/2018
 * Time: 10:54 AM
 */

namespace App\Http\Controllers\Jenazah;

use App\Http\Controllers\ApiController;
use App\Master\Pasien;
use App\Master\Alamat;
use App\Transaksi\AntrianPasienDiperiksa;
use App\Transaksi\DviPelapor;
use App\Transaksi\FormulirAntemortem;
use App\Transaksi\FotoAntemortem;
use App\Transaksi\LoggingUser;
use App\Transaksi\MappingJenisBencanaToFormulirAntemortem;
use App\Transaksi\OrderPelayanan;
use App\Transaksi\PasienDaftar;
use App\Transaksi\PelayananPasien;
use App\Transaksi\ReleaseDvi;
use App\Transaksi\PelayananPasienDetail;
use App\Transaksi\PelayananPasienPetugas;
use App\Transaksi\PenerimaanJenazahDvi;
use App\Transaksi\IdentifikasiJenazah;
use App\Transaksi\Postmortem;
use App\Transaksi\FotoPostmortem;
use App\Transaksi\StrukOrder;
use App\Transaksi\SuratPermohonanJenazah;
use App\Transaksi\PemeriksaanDokterForensik;
use Carbon\Carbon;
use Illuminate\Http\Request;
use DB;
use App\Traits\Valet;
use Webpatser\Uuid\Uuid;

use App\Transaksi\PengambilanJenazah;



class JenazahController extends ApiController
{
    use Valet;

    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }

    public function GetDataForCombo(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $ruangan = \DB::table('ruangan_m as r')
            ->select('r.id', 'r.namaruangan', 'r.objectdepartemenfk')
            // ->where('r.kdprofile', $kdProfile)
            ->where('statusenabled', 'true')
            ->wherein('objectdepartemenfk', ['16', '24'])
            ->get();

        $RuanganJenazah = \DB::table('ruangan_m as r')
            ->select('r.id', 'r.namaruangan', 'r.objectdepartemenfk')
            // ->where('r.kdprofile', $kdProfile)
            ->where('statusenabled', 'true')
            ->wherein('objectdepartemenfk', ['5'])
            ->get();

        $dataInstalasi = \DB::table('departemen_m as dp')
            // ->where('dp.kdprofile', $kdProfile)
            ->whereIn('dp.id', array(5))
            ->where('dp.statusenabled', true)
            ->get();

        $dokter = \DB::table('pegawai_m as p')
            ->select('p.id', 'p.namalengkap as namadokter')
            // ->where('p.kdprofile', $kdProfile)
            ->where('p.objectjenispegawaifk', 1)
            ->where('statusenabled', 'true')
            ->get();

        $hubunganKeluarga = \DB::table('hubungankeluarga_m as h')
            ->select('h.id', 'h.hubungankeluarga')
            // ->where('h.kdprofile', $kdProfile)
            ->where('statusenabled', 'true')
            ->get();

        $dataKelompok = \DB::table('kelompokpasien_m as kp')
            ->select('kp.id', 'kp.kelompokpasien')
            // ->where('kp.kdprofile', $kdProfile)
            ->where('kp.statusenabled', true)
            ->get();

        $dataJenisPetugas = \DB::table('jenispetugaspelaksana_m as kp')
            ->select('kp.id', 'kp.jenispetugaspe')
            // ->where('kp.kdprofile', $kdProfile)
            ->where('kp.statusenabled', true)
            ->get();

        $dataRuanganPelayanan = \DB::table('ruangan_m as r')
            ->select('r.id', 'r.namaruangan')
            // ->where('r.kdprofile', $kdProfile)
            ->where('statusenabled', 'true')
            ->whereIn('objectdepartemenfk', [18, 16, 25, 29, 26, 27, 28, 31, 35, 3])
            ->get();

        $jenisKelamin = \DB::table('jeniskelamin_m as jk')
            ->select('jk.id', 'jk.jeniskelamin')
            ->get();

        $identitassidikjari = \DB::table('identitasdvi_t as dvi')
            ->select('dvi.id', 'dvi.sumber')
            ->where('dvi.identitas', 'sidikjari')
            ->get();

        $identitasgigi = \DB::table('identitasdvi_t as dvi')
            ->select('dvi.id', 'dvi.sumber')
            ->where('dvi.identitas', 'gigi')
            ->get();

        $identitasdna = \DB::table('identitasdvi_t as dvi')
            ->select('dvi.id', 'dvi.sumber')
            ->where('dvi.identitas', 'dna')
            ->get();

        $golonganDarah = \DB::table('golongandarah_m as gd')
            ->select('gd.id', 'gd.golongandarah')
            ->get();

        $jenisBencana = \DB::table('mappingjenisbencanatoformulirantemortem_t as map')
            ->select('map.id', 'map.tglbencana', 'map.jenisbencana')
            ->whereNull('isverifikasi')
            ->where('statusenabled', true)
            ->orderBy('map.id', 'desc')
            ->get();

        $jenisBencana2 = \DB::table('mappingjenisbencanatoformulirantemortem_t as map')
            ->select('map.id', 'map.tglbencana', 'map.jenisbencana')
            ->where('statusenabled', true)
            ->orderBy('map.id', 'desc')
            ->get();

        $suku = \DB::table('suku_m as su')
            ->select('su.id', 'su.suku')
            ->get();

        $pemeriksaan = [
            0 => ["id" => "1", "pemeriksaan" => "Diperiksa"],
            1 => ["id" => "2", "pemeriksaan" => "Tidak Diperiksa"]
        ];

        $jenisKelaminPostmortem = \DB::table('jeniskelamin_m as jk') //case when dp.statusenabled = 0 then \'Belum di Verifikasi\' else dp.nootp end as status
            ->select(DB::raw('
            case when jk.id = 0 then \'POTONGAN TUBUH\' else jk.jeniskelamin end as jeniskelamin
            '), 'jk.id')
            ->get();

        $petugas = \DB::table('pegawai_m as pg')
            ->select('pg.id', 'pg.namalengkap')
            ->where('pg.statusenabled', true)
            ->where('pg.namalengkap', '!=', '-')
            ->where('pg.kodeexternal', '!=', 'dua')
            ->where('pg.namalengkap', '!=', 'Administrator')
            ->where('pg.namalengkap', '!=', '- (Petugas Pelaksana Belum Diinput)')
            ->get();

        $result = array(
            'ruangan' => $ruangan,
            'ruanganjenazah' => $RuanganJenazah,
            'dokter' => $dokter,
            'hubunganKeluarga' => $hubunganKeluarga,
            'departemen' => $dataInstalasi,
            'kelompokpasien' => $dataKelompok,
            'jenispetugaspe' => $dataJenisPetugas,
            'ruanganpelayanan' => $dataRuanganPelayanan,
            'jeniskelamin' => $jenisKelamin,
            'sidikjari' => $identitassidikjari,
            'gigi' => $identitasgigi,
            'dna' => $identitasdna,
            'golongandarah' => $golonganDarah,
            'jenisbencana' => $jenisBencana,
            'suku' => $suku,
            'jenisbencana2' => $jenisBencana2,
            'pemeriksaan' => $pemeriksaan,
            'jenisKelaminPostmortem' => $jenisKelaminPostmortem,
            'petugas' => $petugas
        );

        return $this->respond($result);
    }
    public function getListSuku(Request $request)
    {
        $suku = \DB::table('suku_m as su')
            ->select('su.id', 'su.suku')
            ->get();
        $result = array(
            'suku' => $suku,
        );
        return $this->respond($result);
    }

    public function GetDataantemortem(Request $request)
    {
        $resotp = DB::table('dvipelapor_t as dv')
            ->leftjoin('formulirantemortem_t as fa', 'fa.dvipelaporfk', '=', 'dv.norec')
            ->leftjoin('identitasdvi_t as idv', 'idv.id', '=', 'fa.sumbersidikjari')
            ->leftjoin('identitasdvi_t as idv2', 'idv2.id', '=', 'fa.sumbergigi')
            ->leftjoin('identitasdvi_t as idv3', 'idv3.id', '=', 'fa.sumberdna')
            ->select('fa.*', 'idv.sumber', 'idv2.sumber as namasumbergigi', 'idv3.sumber as namasumberdna')
            ->where('fa.dvipelaporfk', '=', $request['norec'])
            ->where('dv.statusenabled', '=', '1')
            ->get();
        // return($resotp[0]->noregistrasi);
        // die();
        $dataPhoto = DB::table('fotoantemortem_t as fa')
            ->select('fa.*')
            ->where('fa.formulirantemortemfk', '=', $resotp[0]->noregistrasi)
            ->where('fa.objectidentitasdvifk', '=', 1)
            ->get();

        $dataPhotoGigi = DB::table('fotoantemortem_t as fa')
            ->select('fa.*')
            ->where('fa.formulirantemortemfk', '=', $resotp[0]->noregistrasi)
            ->where('fa.objectidentitasdvifk', '=', 2)
            ->get();

        $dataPhotoDna = DB::table('fotoantemortem_t as fa')
            ->select('fa.*')
            ->where('fa.formulirantemortemfk', '=', $resotp[0]->noregistrasi)
            ->where('fa.objectidentitasdvifk', '=', 3)
            ->get();

        $dataPhotoFisik = DB::table('fotoantemortem_t as fa')
            ->select('fa.*')
            ->where('fa.formulirantemortemfk', '=', $resotp[0]->noregistrasi)
            ->where('fa.objectidentitasdvifk', '=', 4)
            ->get();

        $dataPhotoBarang = DB::table('fotoantemortem_t as fa')
            ->select('fa.*')
            ->where('fa.formulirantemortemfk', '=', $resotp[0]->noregistrasi)
            ->where('fa.objectidentitasdvifk', '=', 5)
            ->get();

        $result = array(
            'formulirantemortem' => $resotp,
            'dataPhotoSidikJari' => $dataPhoto,
            'dataPhotoGigi' => $dataPhotoGigi,
            'dataPhotoDna' => $dataPhotoDna,
            'dataPhotoFisik' => $dataPhotoFisik,
            'dataPhotoBarang' => $dataPhotoBarang
        );

        return $this->respond($result);
    }

    public function GetDataPasien(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as p', 'p.id', '=', 'pd.nocmfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftJoin('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            ->leftJoin('jeniskelamin_m as jk', 'jk.id', '=', 'p.objectjeniskelaminfk')
            ->leftJoin('kelas_m as kel', 'kel.id', '=', 'pd.objectkelasfk')

            ->select(
                'pd.norec',
                'pd.tglregistrasi',
                'p.nocm',
                'pd.noregistrasi',
                'ru.namaruangan',
                'ru.id as kderuangan',
                'p.namapasien',
                'kp.kelompokpasien',
                'pd.tglpulang',
                'pd.tglmeninggal',
                'pd.statuspasien',
                'jk.jeniskelamin',
                'p.tgllahir as tgllahir',
                'kel.namakelas',
                'pd.norec'
            );
        //         if (isset($request['noregistrasi']) && $request['noregistrasi'] != "" && $request['noregistrasi'] != "undefined") {
        //             $data = $data->where('pd.noregistrasi', '=',$request['noregistrasi']);
        //         }
        // $data = $data->where('pd.kdprofile', $kdProfile);
        $data = $data->where('pd.norec', '=', $request['objectpasiendaftarfk']);
        $data = $data->take(1);
        $data = $data->get();

        return $this->respond($data);
    }

    public function SimpanDataPengambilanJenazah(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        try {
            $dataLogin = $request->all();
            $r_R = $request['pengambilanjenazah'];
            if ($request['pengambilanjenazah']['norec'] == '') {
                $newR = new PengambilanJenazah();
                $newR->norec = $newR->generateNewId();
                $newR->kdprofile = $kdProfile;
            } else {
                $newR =  PengambilanJenazah::where('norec', $request['pengambilanjenazah']['norec'])
                    // ->where('kdprofile', $kdProfile)
                    ->first();
            }
            $newR->objectpasiendaftarfk = $r_R['objectpasiendaftarfk'];
            $newR->tglpengambilan = $r_R['tanggalpengambilan'];
            $newR->namapengambil = $r_R['namapengambil'];
            $newR->objecthubunganfk = $r_R['objecthubunganfk'];
            $newR->alamatlengkap = $r_R['alamatlengkap'];
            $newR->keterangan = $r_R['keterangan'];
            $newR->objectpegawaifk = $r_R['objectpegawaifk'];
            $newR->objectruanganfk = $r_R['objectruanganmeninggalfk'];
            $newR->objectuserfk = $dataLogin['userData']['id'];
            $newR->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Data Pengambilan Jenazah Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "ruangan" => $newR,
                "as" => 'as@dd5',
            );
        } else {
            $transMessage = "Simpan Data Pengambilan Jenazah Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "ruangan" => $newR,
                "as" => 'as@dd5',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function GetDataJenazah(Request $request)
    {
        $dataLogin = $request->all();
        $dataJenazah = \DB::table('V_DaftarPasienInstalasiJenazah as v')
            ->select('*')
            ->orderBy('v.tglmeninggal')
            ->take(50);

        if (isset($request['noCm']) && $request['noCm'] != "" && $request['noCm'] != "undefined") {
            $dataJenazah = $dataJenazah->where('v.nocm', 'ilike', '%' . $request['noCm'] . '%');
        }

        if (isset($request['nama']) && $request['nama'] != "" && $request['nama'] != "undefined") {
            $dataJenazah = $dataJenazah->where('v.namapasien', 'ilike', '%' . $request['nama'] . '%');
        }

        // if(isset($request['tglAwal']) && $request['tglAwal']!="" && $request['tglAwal']!="undefined"){
        $dataJenazah = $dataJenazah->where('v.tglmeninggal2', '>=', $request['tglAwal']);
        // }

        // if(isset($request['tglAkhir']) && $request['tglAkhir']!="" && $request['tglAkhir']!="undefined"){
        $dataJenazah = $dataJenazah->where('v.tglmeninggal2', '<=', $request['tglAkhir']);
        // }



        $dataJenazah = $dataJenazah->get();
        $result = array(
            'dataJenazah' => $dataJenazah,
            'message' => '2+2=5',
        );

        return $this->respond($result);
    }

    public function getDaftarOrderJenazah(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $dataLogin = $request->all();
        $result = [];
        $data = \DB::table('strukorder_t as so')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'so.noregistrasifk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftJoin('jeniskelamin_m as klm', 'klm.id', '=', 'ps.objectjeniskelaminfk')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'so.objectruanganfk')
            ->leftJoin('ruangan_m as ru2', 'ru2.id', '=', 'so.objectruangantujuanfk')
            ->leftJoin('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
            ->leftJoin('departemen_m as dp2', 'dp2.id', '=', 'ru2.objectdepartemenfk')
            ->leftJoin('kelompokpasien_m as kps', 'kps.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftJoin('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'so.objectpegawaiorderfk')
            ->leftJoin('pegawai_m as pg2', 'pg2.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('pelayananpasien_t as pp', 'pp.strukorderfk', '=', 'so.norec')
            ->leftJoin('jenispelayanan_m as jp', 'jp.kodeinternal', '=', 'pd.jenispelayanan')
            //                ->leftJoin('jenispelayanan_m as jp', function($join){
            //                    $join->on(DB::raw("jp.id = CAST(pd.jenispelayanan AS INTEGER)"));
            //                })
            ->select(
                'so.norec as norec_so',
                'pd.norec as norec_pd',
                'so.noorder',
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'pd.tglpulang',
                'ps.nocm',
                'ps.namapasien',
                'klm.jeniskelamin',
                'ps.tgllahir',
                'kps.kelompokpasien',
                'dp.namadepartemen',
                'pd.objectkelasfk',
                'kls.namakelas',
                'so.objectruangantujuanfk',
                'so.objectruanganfk',
                'pd.objectkelompokpasienlastfk',
                'ru.objectdepartemenfk',
                'ru2.objectdepartemenfk as iddeptujuan',
                'so.objectpegawaiorderfk',
                'pg.namalengkap as pegawaiorder',
                'so.tglorder',
                'pd.jenispelayanan as idjenisPelayanan',
                'jp.jenispelayanan',
                'ru.namaruangan',
                'ru2.namaruangan as ruangantujuan',
                'so.tglpelayananakhir',
                'pg2.namalengkap as dpjp',
                (DB::raw("case when pp.strukorderfk is null then 'MASUK' else 'Sudah Verifikasi' end as status"))
            )
            // ->where('so.kdprofile', $kdProfile)
            ->where('ru2.objectdepartemenfk', $this->settingDataFixed('KdInstalasiJenazah', $kdProfile))
            ->where('so.statusenabled', true);

        if (isset($request['isNotVerif']) && $request['isNotVerif'] != "" && $request['isNotVerif'] != "undefined") {
            if ($request['isNotVerif'] == true) {
                $data = $data->whereNull('pp.strukorderfk');
            }
        }

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('so.tglorder', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir'];
            $data = $data->where('so.tglorder', '<=', $tgl);
        }
        if (isset($request['tglAwalOperasi']) && $request['tglAwalOperasi'] != "" && $request['tglAwalOperasi'] != "undefined") {
            $data = $data->where('so.tglpelayananakhir', '>=', $request['tglAwalOperasi']);
        }
        if (isset($request['tglAkhirOperasi']) && $request['tglAkhirOperasi'] != "" && $request['tglAkhirOperasi'] != "undefined") {
            $tgl = $request['tglAkhirOperasi'];
            $data = $data->where('so.tglpelayananakhir', '<=', $tgl);
        }
        if (isset($request['idRuanganOrder']) && $request['idRuanganOrder'] != "" && $request['idRuanganOrder'] != "undefined") {
            $data = $data->where('so.objectruanganfk', '=', $request['idRuanganOrder']);
        }

        if (isset($request['pegId']) && $request['pegId'] != "" && $request['pegId'] != "undefined") {
            $data = $data->where('so.objectpegawaiorderfk', '=', $request['pegId']);
        }
        if (isset($request['idRuanganTujuan']) && $request['idRuanganTujuan'] != "" && $request['idRuanganTujuan'] != "undefined") {
            $data = $data->where('so.objectruangantujuanfk', '=', $request['idRuanganTujuan']);
        }
        if (isset($request['kelId']) && $request['kelId'] != "" && $request['kelId'] != "undefined") {
            $data = $data->where('pd.objectkelompokpasienlastfk', '=', $request['kelId']);
        }
        if (isset($request['noregistrasi']) && $request['noregistrasi'] != "" && $request['noregistrasi'] != "undefined") {
            $data = $data->where('pd.noregistrasi', 'ilike', '%' . $request['noregistrasi'] . '%');
        }
        if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
            $data = $data->where('ps.nocm', 'ilike', '%' . $request['nocm'] . '%');
        }
        if (isset($request['namapasien']) && $request['namapasien'] != "" && $request['namapasien'] != "undefined") {
            $data = $data->where('ps.namapasien', 'ilike', '%' . $request['namapasien'] . '%');
        }
        if (isset($request['noOrders']) && $request['noOrders'] != "" && $request['noOrders'] != "undefined") {
            $data = $data->where('so.noorder', 'ilike', '%' . $request['noOrders'] . '%');
        }
        if (isset($request['jmlRow']) && $request['jmlRow'] != "" && $request['jmlRow'] != "undefined") {
            $data = $data->take($request['jmlRow']);
        }
        $data = $data->orderBy('so.noorder', 'desc');
        $data = $data->distinct();
        $data = $data->get();

        $dataResult = array(
            'message' =>  'inhuman',
            'data' =>  $data,
        );
        return $this->respond($dataResult);
    }

    public function getPasienForensikMedikolegal(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $filter = $request->all();
        $idRuangan = $filter['idRuangan'];
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as p', 'p.id', '=', 'pd.nocmfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->join('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->join('jeniskelamin_m as jk', 'jk.id', '=', 'p.objectjeniskelaminfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftJoin('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            ->leftJoin('batalregistrasi_t as br', 'pd.norec', '=', 'br.pasiendaftarfk')
            ->join('antrianpasiendiperiksa_t as apd', function ($join) use ($idRuangan) {
                $join->on('apd.noregistrasifk', '=', 'pd.norec')
                    ->where('apd.objectruanganfk', '=', $idRuangan);
            })
            // ->join('strukorder_t as st','st.noregistrasifk','=','pd.norec')
            // ->leftjoin('ruangan_m as ru2', 'ru2.id', '=', 'st.objectruanganfk')
            ->leftjoin('detaildiagnosapasien_t as ddp', 'ddp.noregistrasifk', '=', 'apd.norec')
            ->leftjoin('diagnosapasien_t as dp', 'dp.norec', '=', 'ddp.objectdiagnosapasienfk')
            ->leftjoin('diagnosa_m as dg', 'ddp.objectdiagnosafk', '=', 'dg.id')
            ->leftJoin('pengambilanjenazah_t as pj', 'pj.objectpasiendaftarfk', '=', 'pd.norec')
            ->select(
                'pd.norec as norec_pd',
                'apd.norec as norec_apd',
                'p.tglmeninggal',
                'pd.tglregistrasi',
                'p.nocm',
                'pd.noregistrasi',
                'ru.namaruangan',
                'p.namapasien',
                'kp.kelompokpasien',
                'kls.namakelas',
                'jk.reportdisplay as jeniskelamin',
                'pg.namalengkap as namadokter',
                'pd.norec as norec_pd',
                'pd.tglpulang',
                'pd.statuspasien',
                'p.tgllahir',
                'pd.objectruanganlastfk',
                'pj.norec as norec_pj'
            )
            // ->where('pd.kdprofile', $kdProfile)
            // ->where('st.objectkelompoktransaksifk',99)
            ->whereNotNull('p.tglmeninggal')
            ->whereNull('br.norec');



        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglmeninggal', '>=', $filter['tglAwal']);
        }

        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $tgl = $filter['tglAkhir']; //. " 23:59:59";
            $data = $data->where('pd.tglmeninggal', '<=', $tgl);
        }

        if (isset($filter['instalasiId']) && $filter['instalasiId'] != "" && $filter['instalasiId'] != "undefined") {
            $data = $data->where('dept.id', '=', $filter['instalasiId']);
        }

        // if(isset($filter['idRuangan']) && $filter['idRuangan'] != "" && $filter['idRuangan'] != "undefined") {
        //     $data = $data->where('pd.objectruanganlastfk', '=', $filter['idRuangan']);
        // }

        if (isset($filter['namaPasien']) && $filter['namaPasien'] != "" && $filter['namaPasien'] != "undefined") {
            $data = $data->where('p.namapasien', 'ilike', '%' . $filter['namaPasien'] . '%');
        }

        if (isset($filter['noRegis']) && $filter['noRegis'] != "" && $filter['noRegis'] != "undefined") {
            $data = $data->where('pd.noregistrasi', 'ilike', '%' . $filter['noRegis'] . '%');
        }
        if (isset($filter['noCm']) && $filter['noCm'] != "" && $filter['noCm'] != "undefined") {
            $data = $data->where('p.nocm', 'ilike', '%' . $filter['noCm'] . '%');
        }
        if (isset($filter['jmlRow']) && $filter['jmlRow'] != "" && $filter['jmlRow'] != "undefined") {
            $data = $data->take($filter['jmlRow']);
        }

        $data = $data->groupBy(
            'pd.norec',
            'apd.norec',
            'p.tglmeninggal',
            'pd.tglregistrasi',
            'p.nocm',
            'pd.noregistrasi',
            'ru.namaruangan',
            'p.namapasien',
            'kp.kelompokpasien',
            'kls.namakelas',
            'jk.reportdisplay',
            'pg.namalengkap',
            'pd.norec',
            'pd.tglpulang',
            'pd.statuspasien',
            'p.tgllahir',
            'pd.objectruanganlastfk',
            'pj.norec'
        );
        $data = $data->get();

        $result = array(
            'data' => $data,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }

    public function savePelayananPasienJenazah(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        DB::beginTransaction();
        try {
            $jenisPetugasPe = \DB::table('mapjenispetugasptojenispegawai_m as mpp')
                ->join('jenispegawai_m as jp', 'jp.id', '=', 'mpp.objectjenispegawaifk')
                ->join('pegawai_m as pg', 'pg.objectjenispegawaifk', '=', 'jp.id')
                ->join('jenispetugaspelaksana_m as jpp', 'jpp.id', '=', 'mpp.objectjenispetugaspefk')
                ->select(
                    'mpp.objectjenispegawaifk',
                    'jp.jenispegawai',
                    'mpp.objectjenispetugaspefk',
                    'jpp.jenispetugaspe',
                    'pg.namalengkap',
                    'pg.id'
                )
                // ->where('mpp.kdprofile', $kdProfile)
                ->where('pg.id', $request['objectpegawaiorderfk'])
                ->first();

            if ($request['norec_pp'] == '') {
                $pd = PasienDaftar::where('norec', $request['norec_pd'])->first();
                $dataAPD = new AntrianPasienDiperiksa();
                $dataAPD->norec = $dataAPD->generateNewId();
                $dataAPD->kdprofile = $kdProfile;
                $dataAPD->objectasalrujukanfk = 1;
                $dataAPD->statusenabled = true;
                $dataAPD->objectkelasfk = $request['objectkelasfk'];
                $dataAPD->noantrian = 1;
                $dataAPD->noregistrasifk = $request['norec_pd'];
                $dataAPD->objectpegawaifk = $request['objectpegawaiorderfk'];
                $dataAPD->objectruanganfk = $request['objectruangantujuanfk'];
                $dataAPD->statusantrian = 0;
                $dataAPD->statuspasien = 1;
                $dataAPD->objectstrukorderfk = $request['norec_so'];
                $dataAPD->tglregistrasi = $pd->tglregistrasi; // date('Y-m-d H:i:s');
                $dataAPD->tglmasuk = date('Y-m-d H:i:s');
                $dataAPD->tglkeluar = date('Y-m-d H:i:s');
                $dataAPD->save();

                $dataAPDnorec = $dataAPD->norec;
                $dataAPDtglPel = $dataAPD->tglregistrasi;
            } else {
                $dataAPD =  PelayananPasien::where('norec', $request['norec_pp'])
                    // ->where('kdprofile', $kdProfile)
                    ->first();
                $dataAPDnorec = $dataAPD->noregistrasifk;
                $dataAPDtglPel = $dataAPD->tglregistrasi;

                $HapusPP = PelayananPasien::where('strukorderfk', $request['norec_so'])
                    // ->where('kdprofile', $kdProfile)
                    ->get();
                foreach ($HapusPP as $pp) {
                    $HapusPPD = PelayananPasienDetail::where('pelayananpasien', $pp['norec'])
                        // ->where('kdprofile', $kdProfile)
                        ->delete();
                    $HapusPPP = PelayananPasienPetugas::where('pelayananpasien', $pp['norec'])
                        // ->where('kdprofile', $kdProfile)
                        ->delete();
                }
                $Edit = PelayananPasien::where('strukorderfk', $request['norec_so'])
                    // ->where('kdprofile', $kdProfile)
                    ->delete();
            }


            foreach ($request['bridging'] as $item) {
                $PelPasien = new PelayananPasien();
                $PelPasien->norec = $PelPasien->generateNewId();
                $PelPasien->kdprofile = $kdProfile;
                $PelPasien->statusenabled = true;
                $PelPasien->noregistrasifk =  $dataAPDnorec;
                $PelPasien->tglregistrasi = $dataAPDtglPel;
                $PelPasien->hargadiscount = 0;
                $PelPasien->hargajual =  $item['hargasatuan'];
                $PelPasien->hargasatuan =  $item['hargasatuan'];
                $PelPasien->jumlah =  $item['qtyproduk'];
                $PelPasien->kelasfk =  $request['objectkelasfk'];
                $PelPasien->kdkelompoktransaksi =  1;
                $PelPasien->piutangpenjamin =  0;
                $PelPasien->piutangrumahsakit = 0;
                $PelPasien->produkfk =  $item['produkid'];
                $PelPasien->stock =  1;
                $PelPasien->strukorderfk =  $request['norec_so'];
                $PelPasien->tglpelayanan = date('Y-m-d H:i:s');
                $PelPasien->harganetto =  $item['hargasatuan'];

                $PelPasien->save();
                $PPnorec = $PelPasien->norec;


                $PelPasienPetugas = new PelayananPasienPetugas();
                $PelPasienPetugas->norec = $PelPasienPetugas->generateNewId();
                $PelPasienPetugas->kdprofile = $kdProfile;
                $PelPasienPetugas->statusenabled = true;
                $PelPasienPetugas->nomasukfk = $dataAPDnorec;
                $PelPasienPetugas->objectpegawaifk = $request['iddokterverif']; //$request['objectpegawaiorderfk'];
                $PelPasienPetugas->objectjenispetugaspefk =  $request['idpetugaspe']; //4;//$jenisPetugasPe->objectjenispetugaspefk;
                $PelPasienPetugas->pelayananpasien = $PPnorec;
                $PelPasienPetugas->save();
                $PPPnorec = $PelPasienPetugas->norec;


                foreach ($item['komponenharga'] as $itemKomponen) {

                    $PelPasienDetail = new PelayananPasienDetail();
                    $PelPasienDetail->norec = $PelPasienDetail->generateNewId();
                    $PelPasienDetail->kdprofile = $kdProfile;
                    $PelPasienDetail->statusenabled = true;
                    $PelPasienDetail->noregistrasifk = $dataAPDnorec;
                    $PelPasienDetail->aturanpakai = '-';
                    $PelPasienDetail->hargadiscount = 0;
                    $PelPasienDetail->hargajual = $itemKomponen['hargasatuan'];
                    $PelPasienDetail->hargasatuan = $itemKomponen['hargasatuan'];
                    $PelPasienDetail->jumlah = 1;
                    $PelPasienDetail->keteranganlain = '-';
                    $PelPasienDetail->keteranganpakai2 = '-';
                    $PelPasienDetail->komponenhargafk = $itemKomponen['objectkomponenhargafk'];
                    $PelPasienDetail->pelayananpasien = $PPnorec;
                    $PelPasienDetail->piutangpenjamin = 0;
                    $PelPasienDetail->piutangrumahsakit = 0;
                    $PelPasienDetail->produkfk =  $item['produkid'];
                    $PelPasienDetail->stock = 1;
                    $PelPasienDetail->strukorderfk =  $request['norec_so'];
                    $PelPasienDetail->tglpelayanan = $dataAPDtglPel;
                    $PelPasienDetail->harganetto = $itemKomponen['hargasatuan'];
                    $PelPasienDetail->save();
                    $PPDnorec = $PelPasienDetail->norec;
                    $transStatus = 'true';
                }
            }

            $dataPD = PasienDaftar::where('norec', $request['norec_pd'])
                ->where('kdprofile', $kdProfile)
                ->update(
                    ['objectruanganlastfk' => $request['objectruangantujuanfk']]
                );

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan PelPasien";
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan PelayananPasien Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'dataPP' => $PelPasien,
                //                'dataPPP' => $PelPasienPetugas,
                'dataPPD' => $PelPasienDetail,
                'as' => 'ramdanegie',
            );
        } else {
            $transMessage = "Simpan PelayananPasien Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'dataPP' => $PelPasien,
                //                'dataPPP' => $PelPasienPetugas,
                //                'dataPPD' => $PelPasienDetail,
                'as' => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        //        return $this->respond();
    }
    public function savePasienJenazah(Request $request)
    {
        $detLogin = $request->all();
        DB::beginTransaction();
        // try{

        //region Save Pasien
        if ($request['idpasien'] == '') {
            //				$newId2 = 720000;
            //				$newId = Pasien::where('id','>',(float)720000-1)
            //					->where('id','<',(float)10000000)
            //					->count('id');
            //				$newId = (float)$newId2 + (float)$newId + 4;


            $newId = Pasien::max('id') + 1;
            //region NO CM Jenazah
            $noCm = $this->generateCode(new Pasien, 'nocm', 9, 'J');
            //endregion


            $dataPS = new Pasien();
            $dataPS->id = $newId;
            $dataPS->kdprofile = 12;
            $dataPS->statusenabled = true;
            $dataPS->kodeexternal = $newId;
            $dataPS->norec =  $dataPS->generateNewId();
        } else {
            $dataPS = Pasien::where('id', $request['idpasien'])->first();
            $noCm = $dataPS->nocm;
            if ($noCm == null) {
                $noCm = $this->generateCode(new Pasien, 'nocm', 9, 'J');
            }
            $newId = $dataPS->id;
        }
        $dataPS->statusenabled = true;
        $dataPS->namaexternal =  $request['pasien']['namaPasien'];
        $dataPS->reportdisplay =  $request['pasien']['namaPasien'];
        $dataPS->objectagamafk = $request['agama']['id'];
        $dataPS->objectjeniskelaminfk = $request['jenisKelamin']['id'];
        $dataPS->namapasien = $request['pasien']['namaPasien'];
        $dataPS->objectpekerjaanfk = $request['pekerjaan']['id'];
        $dataPS->objectpendidikanfk = $request['pendidikan']['id'];
        // $dataPS->qpasien = 1;
        $dataPS->objectstatusperkawinanfk = $request['statusPerkawinan']['id'];
        $dataPS->tgldaftar = date('Y-m-d H:i:s');
        $dataPS->tgllahir = $request['pasien']['tglLahir'];
        $dataPS->namaibu = $request['namaIbu'];
        $dataPS->notelepon = $request['noTelepon'];
        $dataPS->noidentitas = $request['pasien']['noIdentitas'];
        $dataPS->noaditional = $request['noAditional'];
        $dataPS->objectkebangsaanfk = $request['kebangsaan']['id'];
        $dataPS->objectnegarafk = $request['negara']['id'];
        $dataPS->namaayah = $request['namaAyah'];
        $dataPS->namasuamiistri = $request['pasien']['namaSuamiIstri'];
        $dataPS->noasuransilain = $request['pasien']['noAsuransiLain'];
        $dataPS->nobpjs = $request['pasien']['noBpjs'];
        $dataPS->nohp = $request['pasien']['noHp'];
        $dataPS->tempatlahir = $request['pasien']['tempatLahir'];
        $dataPS->namakeluarga = $request['pasien']['namaKeluarga'];
        $timeLahir = date('H:i:s', strtotime($request['pasien']['tglLahir']));
        $dataPS->jamlahir = $request['pasien']['tglLahir'];
        $dataPS->objectgolongandarahfk = $request['golonganDarah']['id'];
        $dataPS->objectsukufk = $request['suku']['id'];
        $dataPS->objecttitlefk = $request['titlePasien']['id'];

        $dataPS->nocm = $noCm;
        if (isset($request['penanggungjawab'])) {
            $dataPS->penanggungjawab = $request['penanggungjawab'];
        }
        if (isset($request['hubungankeluargapj'])) {
            $dataPS->hubungankeluargapj = $request['hubungankeluargapj'];
        }
        if (isset($request['pekerjaanpenangggungjawab'])) {
            $dataPS->pekerjaanpenangggungjawab = $request['pekerjaanpenangggungjawab'];
        }
        if (isset($request['ktppenanggungjawab'])) {
            $dataPS->ktppenanggungjawab = $request['ktppenanggungjawab'];
        }
        if (isset($request['alamatrmh'])) {
            $dataPS->alamatrmh = $request['alamatrmh'];
        }
        if (isset($request['alamatktr'])) {
            $dataPS->alamatktr = $request['alamatktr'];
        }
        if (isset($request['bahasa'])) {
            $dataPS->bahasa = $request['bahasa'];
        }
        if (isset($request['teleponpenanggungjawab'])) {
            $dataPS->teleponpenanggungjawab = $request['teleponpenanggungjawab'];
        }
        if (isset($request['dokterpengirim'])) {
            $dataPS->dokterpengirim = $request['dokterpengirim'];
        }
        if (isset($request['alamatdokter'])) {
            $dataPS->alamatdokterpengirim = $request['alamatdokter'];
        }
        if (isset($request['jeniskelaminpenanggungjawab'])) {
            $dataPS->jeniskelaminpenanggungjawab = $request['jeniskelaminpenanggungjawab'];
        }
        if (isset($request['umurpenanggungjawab'])) {
            $dataPS->umurpenanggungjawab = $request['umurpenanggungjawab'];
        }
        if (isset($request['pangkatpolisi'])) {
            $dataPS->pangkatpolisi = $request['pangkatpolisi'];
        }
        if (isset($request['nrp'])) {
            $dataPS->nrp = $request['nrp'];
        }
        if (isset($request['pangkatpns'])) {
            $dataPS->pangkatpns = $request['pangkatpns'];
        }
        if (isset($request['nip'])) {
            $dataPS->nip = $request['nip'];
        }
        if (isset($request['objectjeniskelompokpasienfk'])) {
            $dataPS->objectjeniskelompokpasienfk = $request['objectjeniskelompokpasienfk'];
        }
        if (isset($request['objectkesatuanfk'])) {
            $dataPS->objectkesatuanfk = $request['objectkesatuanfk'];
        }
        if (isset($request['alamatinstansi'])) {
            $dataPS->alamatinstansi = $request['alamatinstansi'];
        }
        if (isset($request['objectkaryawanrsfk'])) {
            $dataPS->objectkaryawanrsfk = $request['objectkaryawanrsfk'];
        }
        if (isset($request['namainstansi'])) {
            $dataPS->namainstansi = $request['namainstansi'];
        }
        if (isset($request['objectkeluargaanggotafk'])) {
            $dataPS->objectkelurgaanggotafk = $request['objectkeluargaanggotafk'];
        }
        if (isset($request['namaanggota'])) {
            $dataPS->namaanggota = $request['namaanggota'];
        }
        if (isset($request['objecthubungananggotafk'])) {
            $dataPS->objecthubungananggotafk = $request['objecthubungananggotafk'];
        }
        if (isset($request['pangkatkeluarga'])) {
            $dataPS->pangkatkeluarga = $request['pangkatkeluarga'];
        }
        if (isset($request['nrpnip'])) {
            $dataPS->nrpnip = $request['nrp'];
        }
        if (isset($request['objectanggotaaktiffk'])) {
            $dataPS->objectanggotaaktiffk = $request['objectanggotaaktiffk'];
        }

        //            $dataPS->foto =   $request['pasien']['image'];
        $dataPS->save();
        $dataNoCMFk = $newId;
        $nocmfk = $dataPS->id;
        $nocmss = $dataPS->nocm;
        //endregion



        //region SaveAlamat
        if ($request['idpasien'] == '') {
            $idAlamat = Alamat::max('id') + 1;
            $dataAL = new Alamat();
            $dataAL->id = $idAlamat;
            $dataAL->kdprofile = 12;
            $dataAL->statusenabled = true;
            $dataAL->kodeexternal = $idAlamat;
            $dataAL->norec = $dataAL->generateNewId();
        } else {
            $dataAL = Alamat::where('nocmfk', $dataNoCMFk)->first();
            if (empty($dataAL)) {
                $idAlamat = Alamat::max('id') + 1;
                $dataAL = new Alamat();
                $dataAL->id = $idAlamat;
                $dataAL->kdprofile = 0;
                $dataAL->statusenabled = true;
                $dataAL->kodeexternal = $idAlamat;
                $dataAL->norec = $dataAL->generateNewId();
                $idAlamat = $dataAL->id;
            } else {
                $idAlamat = $dataAL->id;
            }
        }
        $dataAL->statusenabled = true;
        $dataAL->alamatlengkap = $request['alamatLengkap'];
        $dataAL->objecthubungankeluargafk = 7; //dirisendiri
        $dataAL->objectdesakelurahanfk = $request['desaKelurahan']['id'];
        $dataAL->objectjenisalamatfk = 1;
        $dataAL->kdalamat = $idAlamat;
        $dataAL->objectkecamatanfk = $request['kecamatan']['id'];
        $dataAL->kodepos = $request['kodePos'];
        $dataAL->objectkotakabupatenfk = $request['kotaKabupaten']['id'];
        $dataAL->namadesakelurahan = $request['desaKelurahan']['namaDesaKelurahan'];
        $dataAL->namakecamatan = $request['kecamatan']['namaKecamatan'];
        $dataAL->namakotakabupaten = $request['kotaKabupaten']['namaKotaKabupaten'];
        $dataAL->objectnegarafk = $request['negara']['id'];
        $dataAL->nocmfk = $dataNoCMFk;
        $dataAL->objectpegawaifk = $detLogin['userData']['id'];
        $dataAL->objectpropinsifk = $request['propinsi']['id'];
        $dataAL->kecamatan = $request['kecamatan']['namaKecamatan'];
        $dataAL->kotakabupaten = $request['kotaKabupaten']['namaKotaKabupaten'];
        $dataAL->save();
        //endregion
        $transStatus = 'true';
        // } catch (\Exception $e) {
        //     $transStatus = 'false';
        // }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $dataPS->foto = "data:image/jpeg;base64," . base64_encode($dataPS->foto);
            $result = array(
                'status' => 201,
                'data' => $dataPS,
                'as' => 'ramdanegie',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'as' => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDaftarRegistrasiPasienJenazah(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $filter = $request->all();
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftJoin('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            ->leftjoin('batalregistrasi_t as br', 'br.pasiendaftarfk', '=', 'pd.norec')
            ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
            ->leftJoin('agama_m as ag', 'ag.id', '=', 'ps.objectagamafk')
            ->leftJoin('alamat_m as alm', 'alm.nocmfk', '=', 'ps.id')
            ->leftjoin('rekanan_m as rek', 'rek.id', '=', 'pd.objectrekananfk')
            ->leftjoin('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->leftJoin('jenispelayanan_m as jp', 'jp.kodeinternal', '=', 'pd.jenispelayanan')
            //            ->leftjoin('antrianpasiendiperiksa_t as at2','at2.noregistrasifk','=','pd.norec')
            //            ->leftjoin('detaildiagnosapasien_t as ddp','ddp.noregistrasifk','=','at2.norec')
            //            ->leftjoin('diagnosapasien_t as dp','dp.norec','=','ddp.objectdiagnosapasienfk')
            //            ->leftjoin('diagnosa_m as dg','ddp.objectdiagnosafk','=','dg.id')
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
                'rek.namarekanan',
                'pg.namalengkap as namadokter',
                'pd.tglpulang',
                'pd.statuspasien',
                'ag.agama',
                'pa.norec as norec_pa',
                'pa.objectasuransipasienfk',
                'pd.objectpegawaifk as pgid',
                'pd.objectruanganlastfk',
                'pa.nosep as nosep',
                'br.norec as norec_br',
                'pd.nostruklastfk',
                'pd.objectkelasfk',
                'kls.namakelas',
                'ps.tgllahir',
                'ps.objectjeniskelaminfk',
                'jk.jeniskelamin',
                'alm.alamatlengkap',
                'pd.jenispelayanan as idjenispelayanan',
                'jp.jenispelayanan',
                'ps.tglmeninggal',
                DB::raw("'' AS diagnosa")
            )
            // ->where('pd.kdprofile', $kdProfile)
            ->whereNull('br.norec')
            ->whereNotNull('ps.tglmeninggal')
            ->where('pd.objectstatuskeluarfk', 5);
        //            ->where('pd.statusenabled', null);

        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglmeninggal', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $data = $data->where('pd.tglmeninggal', '<=', $filter['tglAkhir']);
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
            $data = $data->where('ps.nocm', 'like', '%' . $filter['norm'] . '%');
        }
        if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $data = $data->where('ps.namapasien', 'like', '%' . $filter['nama'] . '%');
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
            'rek.namarekanan',
            'pg.namalengkap',
            'pd.tglpulang',
            'pd.statuspasien',
            'ag.agama',
            'pa.nosep',
            'br.norec',
            'pa.norec',
            'pa.objectasuransipasienfk',
            'pd.objectpegawaifk',
            'pd.objectruanganlastfk',
            'pd.nostruklastfk',
            'ps.tgllahir',
            'pd.objectkelasfk',
            'kls.namakelas',
            'ps.objectjeniskelaminfk',
            'jk.jeniskelamin',
            'alm.alamatlengkap',
            'pd.jenispelayanan',
            'jp.jenispelayanan',
            'ps.tglmeninggal'
        );
        $data = $data->get();

        $diagnosa = \DB::table('antrianpasiendiperiksa_t AS apd')
            ->join('pasiendaftar_t AS pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->join('detaildiagnosapasien_t AS ddp', 'ddp.noregistrasifk', '=', 'apd.norec')
            ->leftjoin('diagnosapasien_t as dp', 'dp.norec', '=', 'ddp.objectdiagnosapasienfk')
            ->leftjoin('diagnosa_m as dg', 'ddp.objectdiagnosafk', '=', 'dg.id')
            ->where('ddp.objectjenisdiagnosafk', 1)
            ->where('pd.tglmeninggal', '>=', $filter['tglAwal'])
            ->where('pd.tglmeninggal', '<=', $filter['tglAkhir'])
            // ->where('apd.kdprofile', (int)$kdProfile)
            ->where('pd.statusenabled', true)
            ->select(DB::raw("
                        pd.noregistrasi,dg.kddiagnosa || ', ' || dg.namadiagnosa AS diagnosa
                    "))
            ->get();
        $i = 0;
        $Datadiagnosa = '';
        foreach ($data as $items) {
            foreach ($diagnosa as $gdItems) {
                if ($data[$i]->noregistrasi == $gdItems->noregistrasi && $gdItems->diagnosa != null) {
                    $data[$i]->diagnosa = $gdItems->diagnosa;
                }
            }
            $i = $i + 1;
        }
        return $this->respond($data);
    }
    public function getPelayananPasien(Request $request)
    {
        $filter = $request->all();
        $data = \DB::table('pasiendaftar_t as pd')
            ->leftJoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->Join('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->leftJoin('batalregistrasi_t as br', 'br.pasiendaftarfk', '=', 'pd.norec')
            ->leftJoin('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->select(
                'pd.norec',
                'pd.tglregistrasi',
                'ps.nocm',
                'pd.noregistrasi',
                'ps.namapasien',
                'pd.objectruanganasalfk',
                'ru.namaruangan',
                'br.norec as norec_br',
                'apd.norec as norec_apd',
                'pp.norec as norec_pp'
            )
            ->where('apd.objectruanganfk', 507)
            ->where('apd.statusenabled', true);

        if (isset($filter['norecpd']) && $filter['norecpd'] != "" && $filter['norecpd'] != "undefined") {
            $data = $data->where('pd.norec', '=', $filter['norecpd']);
        }
        $data = $data->orderBy('pd.noregistrasi');
        $data = $data->get();

        return $this->respond($data);
    }
    public function SimpanBatalPeriksa(Request $request)
    {
        $dataLogin = $request->all();
        DB::beginTransaction();
        try {
            $transStatus = 'true';
            $data2 = AntrianPasienDiperiksa::where('noregistrasifk', $request['norec'])
                ->where('objectruanganfk', 507)
                ->update([
                    'statusenabled' => false,
                ]);



            $transMessage = "Batal Periksa Sukses!";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Gagal Batal Periksa";
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
    public function saveLoggingBatalPeriksa(Request $request)
    {
        DB::beginTransaction();
        $transStatus = true;

        try {

            $dataLogin = $request->all();

            $newID = LoggingUser::max('id');
            $newID = $newID + 1;
            $logUser = new LoggingUser();
            $logUser->id = $newID;
            $logUser->norec = $logUser->generateNewId();
            $logUser->kdprofile = 0;
            $logUser->statusenabled = true;
            $logUser->jenislog = 'Batal Periksa Pemulasaran';
            $logUser->noreff = $request['noregistrasi'];
            $logUser->referensi = 'NoRegistrasi Pasien Daftar';
            $logUser->objectloginuserfk = $dataLogin['userData']['id'];
            $logUser->tanggal = $this->getDateTime()->format('Y-m-d H:i:s');
            $logUser->keterangan = 'Batal Periksa Pemulasaran Noregistrasi ' . $request['noregistrasi'];
            $logUser->save();

            $transMessage = "Simpan Pegawai Yang Batal Periksa";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = " ";
        }
        if ($transStatus == true) {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getAPD(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $data = \DB::table('antrianpasiendiperiksa_t as apd')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->join('kelas_m as kls', 'kls.id', '=', 'apd.objectkelasfk')
            ->leftJoin('agama_m as ag', 'ag.id', '=', 'ps.objectagamafk')
            ->select(
                'apd.norec as norec_apd',
                'ps.nocm',
                'ps.id as nocmfk',
                'ps.namapasien',
                'pd.noregistrasi',
                'apd.objectruanganfk as id',
                'ru.objectdepartemenfk',
                'ag.agama',
                'ru.namaruangan',
                'apd.tglregistrasi',
                'kls.namakelas',
                'apd.objectruanganasalfk'
            )
            // ->where('apd.kdprofile', $idProfile)
            ->where('pd.noregistrasi', $request['noregistrasi'])
            ->where('apd.statusenabled', true)
            ->orderBy('pd.objectruanganlastfk')
            ->get();

        $result = array(
            'ruangan' => $data,
            'message' => 'er@epic',
        );
        return $this->respond($result);
    }

    public function getRincianPelayananJenazah(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $dataLogin = $request->all();
        $result = [];
        $dataruangan = \DB::table('maploginusertoruangan_s as mlu')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'mlu.objectruanganfk')
            ->leftjoin('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
            ->select('ru.id', 'ru.namaruangan', 'ru.objectdepartemenfk')
            // ->where('mlu.kdprofile', $kdProfile)
            ->where('objectloginuserfk', $dataLogin['userData']['id'])
            ->get();

        $pelayanan = \DB::table('pelayananpasien_t as pp')
            ->JOIN('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'pp.noregistrasifk')
            ->JOIN('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->JOIN('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftJOIN('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->JOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->JOIN('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->JOIN('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
            ->leftJOIN('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
            ->leftJOIN('strukorder_t as so', 'so.norec', '=', 'pp.strukorderfk')
            //                ->leftJOIN('ris_order as ris', 'ris.order_no', '=',
            //                    DB::raw('so.noorder AND ris.order_code=pp.produkfk'))
            ->select(
                'ps.nocm',
                'ps.namapasien',
                'jk.jeniskelamin',
                'pp.tglpelayanan',
                'pp.produkfk',
                'pr.namaproduk',
                'pp.jumlah',
                'pp.hargasatuan',
                'pp.hargadiscount',
                'sp.nostruk',
                'pd.noregistrasi',
                'ru.namaruangan',
                'dp.namadepartemen',
                'ps.id as psid',
                'apd.norec as norec_apd',
                'sp.norec as norec_sp',
                'pp.norec as norec_pp',
                'ru.objectdepartemenfk',
                'so.noorder',
                'apd.objectruanganfk',
                'pp.iscito',
                'pp.jasa'
            )
            //                    DB::raw('case when ris.order_key is not null then \'Sudah Dikirim\' else \'-\'end as statusbridging'))
            // ->where('pp.kdprofile', $kdProfile)
            ->where('ru.objectdepartemenfk', $this->settingDataFixed('KdInstalasiJenazah', $kdProfile))
            ->orderBy('pp.tglpelayanan');

        if (isset($request['departemenfk']) && $request['departemenfk'] != "" && $request['departemenfk'] != "undefined") {
            $pelayanan = $pelayanan->where('ru.objectdepartemenfk', '=', $request['departemenfk']);
        }
        if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
            $pelayanan = $pelayanan->where('ps.nocm', '=', $request['nocm']);
        }
        if (isset($request['noregistrasifk']) && $request['noregistrasifk'] != "" && $request['noregistrasifk'] != "undefined") {
            $pelayanan = $pelayanan->where('pp.noregistrasifk', '=', $request['noregistrasifk']);
        }
        if (isset($request['noregistrasi']) && $request['noregistrasi'] != "" && $request['noregistrasi'] != "undefined") {
            $pelayanan = $pelayanan->where('pd.noregistrasi', '=', $request['noregistrasi']);
        }
        $pelayanan = $pelayanan->get();
        if (count($pelayanan) > 0) {
            $pelayananpetugas = \DB::table('pasiendaftar_t as pd')
                ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                ->join('pelayananpasienpetugas_t as ptu', 'ptu.nomasukfk', '=', 'apd.norec')
                ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'ptu.objectpegawaifk')
                ->select('ptu.pelayananpasien', 'pg.namalengkap', 'pg.id')
                //                    ->where('ptu.objectjenispetugaspefk', 4)
                // ->where('pd.kdprofile', $kdProfile)
                ->where('pd.noregistrasi', $pelayanan[0]->noregistrasi)
                ->get();


            $result = [];
            foreach ($pelayanan as $item) {
                if (isset($request['noregistrasifk'])) {
                    $diskon = $item->hargadiscount;
                } else {
                    $diskon = 0;
                }
                $NamaDokter = '-';
                $DokterId = '';
                foreach ($pelayananpetugas as $hahaha) {
                    if ($hahaha->pelayananpasien == $item->norec_pp) {
                        $NamaDokter = $hahaha->namalengkap;
                        $DokterId = $hahaha->id;
                    }
                }
                $total = (((float)$item->hargasatuan - (float)$diskon) * (float)$item->jumlah) + (float)$item->jasa;

                $result[] = array(
                    'nocm' => $item->nocm,
                    'namapasien' => $item->namapasien,
                    'jeniskelamin' => $item->jeniskelamin,
                    'tglpelayanan' => $item->tglpelayanan,
                    'produkfk' => $item->produkfk,
                    'namaproduk' => $item->namaproduk,
                    'jumlah' => (float)$item->jumlah,
                    'hargasatuan' => (float)$item->hargasatuan,
                    'hargadiscount' => (float)$diskon,
                    'total' => (float)$total,
                    'nostruk' => $item->nostruk,
                    'noregistrasi' => $item->noregistrasi,
                    'ruangan' => $item->namaruangan,
                    'objectruanganfk' => $item->objectruanganfk,
                    'departemen' => $item->namadepartemen,
                    'objectdepartemenfk' => $item->objectdepartemenfk,
                    'norec_apd' => $item->norec_apd,
                    'norec_sp' => $item->norec_sp,
                    'norec_pp' => $item->norec_pp,
                    'dokter' => $NamaDokter,
                    'dokterid' => $DokterId,
                    'noorder' => $item->noorder,
                    //                        'idbridging' => $item->idbridging,
                    //                        'statusbridging' => $item->statusbridging,
                    'iscito' => $item->iscito,
                    'jasa' => (float)$item->jasa,
                );
            }
        }
        $dataTea = array(
            'data' => $result,
            'detaillogin' => $dataLogin,
            'message' => 'Inhuman'
        );
        return $this->respond($dataTea);
    }

    public function getOrderPelayananJenazah(Request $request)
    {
        $idkelas = $request['objectkelasfk'];
        $norec_so = $request['norec_so'];
        $kdProfile = (int) $this->getDataKdProfile($request);
        $dataOrderPelayanan = DB::select(
            DB::raw("select DISTINCT op.norec as norec_op,pr.id as prid,pr.namaproduk,
                op.tglpelayanan,op.qtyproduk ,ru.namaruangan as ruangantujuan,ru.objectdepartemenfk,op.strukorderfk,so.objectruangantujuanfk,
                hnp.hargasatuan ,kls.namakelas,dpm.namadepartemen,
                pps.norec as norec_pp
                from orderpelayanan_t op
                left join strukorder_t as so on so.norec=op.strukorderfk
                INNER JOIN produk_m as pr on pr.id=op.objectprodukfk
                left JOIN harganettoprodukbykelas_m as hnp on pr.id=hnp.objectprodukfk
                        and '$idkelas' =hnp.objectkelasfk                
                left join kelas_m as kls on kls.id = '$idkelas'                
                left join ruangan_m as ru on ru.id =so.objectruangantujuanfk
                left join departemen_m as dpm on dpm.id=ru.objectdepartemenfk
                left JOIN pelayananpasien_t as pps on pps.strukorderfk=so.norec
                      and op.objectprodukfk =pps.produkfk
                where op.kdprofile = $kdProfile and op.strukorderfk=:norec_so
                and kls.id=:objectkelasfk
                ORDER by op.tglpelayanan"),
            array(
                'norec_so' => $norec_so,
                'objectkelasfk' => $idkelas,
            )
        );

        $result = [];
        foreach ($dataOrderPelayanan as $item) {
            $dataz =  DB::select(DB::raw("select DISTINCT hnp.objectkomponenhargafk,kh.komponenharga,hnp.hargasatuan,
                hnp.objectprodukfk
                from harganettoprodukbykelasd_m as hnp   
                inner join produk_m as prd on prd.id=hnp.objectprodukfk
                inner join komponenharga_m as kh on kh.id=hnp.objectkomponenhargafk
                inner join kelas_m as kls on kls.id = hnp.objectkelasfk
                where hnp.kdprofile = $kdProfile and hnp.objectkelasfk='$idkelas'
                and prd.id='$item->prid'"));

            $result[] = array(
                'norec_op' => $item->norec_op,
                'norec_pp' => $item->norec_pp,
                'prid' => $item->prid,
                'namaproduk' => $item->namaproduk,
                'qtyproduk' => $item->qtyproduk,
                'tglpelayanan' => $item->tglpelayanan,
                'idruangan' => $item->objectruangantujuanfk,
                'ruangantujuan' => $item->ruangantujuan,
                'hargasatuan' => $item->hargasatuan,
                'namakelas' => $item->namakelas,
                'objectdepartemenfk' => $item->objectdepartemenfk,
                'namadepartemen' => $item->namadepartemen,
                'details' => $dataz,
            );
        }

        $result = array(
            'message' =>  'inhuman',
            'data' =>  $result,

        );
        return $this->respond($result);
    }

    public function saveOrderJenazah(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $detLogin = $request->all();
        if ($request['pegawaiorderfk'] == "") {
            $dokter2 = null;
        } else {
            $dokter2 = $request['pegawaiorderfk'];
        }
        DB::beginTransaction();
        try {
            if ($request['departemenfk'] == 3) {
                $noOrder = $this->generateCode(new StrukOrder, 'noorder', 11, 'L' . $this->getDateTime()->format('ym'), $idProfile);
            }
            if ($request['departemenfk'] == 27) {
                $noOrder = $this->generateCode(new StrukOrder, 'noorder', 11, 'R' . $this->getDateTime()->format('ym'), $idProfile);
            }
            if ($request['departemenfk'] == 25) {
                $noOrder = $this->generateCode(new StrukOrder, 'noorder', 11, 'OK' . $this->getDateTime()->format('ym'), $idProfile);
            }
            if ($request['departemenfk'] == 5) {
                $noOrder = $this->generateCode(new StrukOrder, 'noorder', 11, 'PJ' . $this->getDateTime()->format('ym'), $idProfile);
            }
            if ($request['departemenfk'] == 31) {
                $noOrder = $this->generateCode(new StrukOrder, 'noorder', 11, 'ABM' . $this->getDateTime()->format('ym'), $idProfile);
            }

            $dataPD = PasienDaftar::where('norec', $request['norec_pd'])->first();
            if ($request['norec_so'] == "") {
                $dataSO = new StrukOrder;
                $dataSO->norec = $dataSO->generateNewId();
                $dataSO->kdprofile = $idProfile;
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
                            ->where('kdprofile', $idProfile)
                            ->update(
                                [
                                    'strukorderfk' => $dataSOnorec
                                ]
                            );
                    }

                    $dataOP = new OrderPelayanan;
                    $dataOP->norec = $dataOP->generateNewId();
                    $dataOP->kdprofile = $idProfile;
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
                    $dataOP->kdprofile = $idProfile;
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

    public function hapusOrderPelayananJenazah(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        DB::beginTransaction();
        try {
            StrukOrder::where('norec', $request['norec_order'])
                // ->where('kdprofile', $idProfile)
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

    public function getRiwayatOrderPelayananJenazah(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $results = [];
        $ruanganLab = explode(',', $this->settingDataFixed('KdRuanganPemulasaraanJenazah', $idProfile));
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
            );
        // ->where('pd.kdprofile', $idProfile);
        if (isset($request['noregistrasi']) && $request['noregistrasi'] != "" && $request['noregistrasi'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $request['noregistrasi']);
        }
        if (isset($request['NoCM']) && $request['NoCM'] != "" && $request['NoCM'] != "undefined") {
            $data = $data->where('pas.nocm', 'ilike', '%' . $request['NoCM'] . '%');
        }
        $data = $data->whereIn('so.objectruangantujuanfk', $kdRuangLab);
        $data = $data->where('so.statusenabled', true);
        $data = $data->orderBy('so.tglorder');
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
            'message' => 'ea@epic',
        );

        return $this->respond($result);
    }

    public function getDaftarPasienMeninggal(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $filter = $request->all();
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->join('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->leftjoin('statuskeluar_m as sk', 'sk.id', '=', 'pd.objectstatuskeluarfk')
            ->leftjoin('statuspulang_m as sp', 'sp.id', '=', 'pd.objectstatuspulangfk')
            ->leftjoin('penyebabkematian_m as pk', 'pk.id', '=', 'pd.objectpenyebabkematianfk')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->select(DB::raw("pd.tglregistrasi,pd.noregistrasi,ps.nocm,ps.namapasien,jk.jeniskelamin,ps.tgllahir,
                     sk.statuskeluar,sp.statuspulang,pd.namalengkapambilpasien,
                     case when pd.objectpenyebabkematianfk = 4 then pd.keteranganpenyebabkematian else pk.penyebabkematian end as penyebabkematian,
                     pd.tglmeninggal, ru.namaruangan"))
            // ->where('pd.kdprofile', $kdProfile)
            ->where('pd.objectstatuskeluarfk', 5);

        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglmeninggal', '>=', $filter['tglAwal'] . ' 00:00');
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $data = $data->where('pd.tglmeninggal', '<=', $filter['tglAkhir'] . ' 23:59');
        }
        if (isset($filter['noReg']) && $filter['noReg'] != "" && $filter['noReg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', 'ilike', '%' . $filter['noReg'] . '%');
        }
        if (isset($filter['noCm']) && $filter['noCm'] != "" && $filter['noCm'] != "undefined") {
            $data = $data->where('ps.nocm', 'ilike', '%' . $filter['noCm'] . '%');
        }
        if (isset($filter['namaPasien']) && $filter['namaPasien'] != "" && $filter['namaPasien'] != "undefined") {
            $data = $data->where('ps.namapasien', 'ilike', '%' . $filter['namaPasien'] . '%');
        }
        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'er@epic',
        );
        return $this->respond($result);
    }

    public function getDataComboOperator(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->join('pegawai_m as pg', 'pg.id', '=', 'lu.objectpegawaifk')
            ->select('lu.objectpegawaifk', 'pg.namalengkap')
            // ->where('pg.kdprofile',$idProfile)
            ->where('lu.id', $dataLogin['userData']['id'])
            ->first();

        $dataInstalasi = \DB::table('departemen_m as dp')
            //            ->whereIn('dp.id', array(3, 14, 16, 17, 18, 19, 24, 25, 26, 27, 28, 35))
            // ->where('dp.kdprofile',$idProfile)
            ->where('dp.statusenabled', true)
            ->orderBy('dp.namadepartemen')
            ->get();

        $dataRuangan = \DB::table('ruangan_m as ru')
            // ->where('ru.kdprofile',$idProfile)
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();

        $dept = \DB::table('departemen_m as dept')
            // ->where('dept.kdprofile',$idProfile)
            ->where('dept.id', '18')
            ->where('dept.statusenabled', true)
            ->orderBy('dept.namadepartemen')
            ->get();

        $deptRajalInap = \DB::table('departemen_m as dept')
            // ->where('dept.kdprofile',$idProfile)
            ->whereIn('dept.id', [18, 16])
            ->where('dept.statusenabled', true)
            ->orderBy('dept.namadepartemen')
            ->get();

        $ruanganRi = \DB::table('ruangan_m as ru')
            // ->where('ru.kdprofile',$idProfile)
            ->wherein('ru.objectdepartemenfk', ['18', '28'])
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();

        $dataDokter = \DB::table('pegawai_m as ru')
            // ->where('ru.kdprofile',$idProfile)
            ->where('ru.statusenabled', true)
            ->where('ru.objectjenispegawaifk', 1)
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
        $dataKelompok = \DB::table('kelompokpasien_m as kp')
            ->select('kp.id', 'kp.kelompokpasien')
            ->where('kp.statusenabled', true)
            ->orderBy('kp.kelompokpasien')
            ->get();

        $dataKelas = \DB::table('kelas_m as kl')
            ->select('kl.id', 'kl.reportdisplay')
            ->where('kl.statusenabled', true)
            ->orderBy('kl.reportdisplay')
            ->get();

        $pembatalan = \DB::table('pembatal_m as p')
            ->select('p.id', 'p.name')
            ->where('p.statusenabled', true)
            ->orderBy('p.name')
            ->get();

        $jenisDiagnosa = \DB::table('jenisdiagnosa_m as jd')
            ->select('jd.id', 'jd.jenisdiagnosa')
            //            ->where('jd.id',5)
            ->where('jd.statusenabled', true)
            ->orderBy('jd.jenisdiagnosa')
            ->get();

        //        $kdeDiagnosa = \DB::table('diagnosa_m as dm')
        //            ->select('dm.id', 'dm.kddiagnosa')
        //            ->where('dm.statusenabled', true)
        //            ->orderBy('dm.id')
        //            ->get();
        //
        //        $Diagnosa = \DB::table('diagnosa_m as dm')
        //            ->select('dm.id', 'dm.namadiagnosa')
        //            ->where('dm.statusenabled', true)
        //            ->orderBy('dm.id')
        //            ->get();

        $KelompokKerjaHead = \DB::table('kelompokkerjahead_m as dm')
            ->select('dm.id', 'dm.kelompokkerjahead')
            ->where('dm.statusenabled', true)
            ->orderBy('dm.id')
            ->get();

        $KelompokKerja = \DB::table('kelompokkerja_m as dm')
            ->select('dm.id', 'dm.kelompokkerja')
            ->where('dm.statusenabled', true)
            ->orderBy('dm.id')
            ->get();

        $dataJenisKelamin = \DB::table('jeniskelamin_m as jk')
            ->select('jk.id', 'jk.jeniskelamin')
            ->where('jk.statusenabled', true)
            ->orderBy('jk.jeniskelamin')
            ->get();

        $dataHubunganKeluarga = \DB::table('hubungankeluarga_m as jk')
            ->select('jk.id', 'jk.hubungankeluarga')
            ->where('jk.statusenabled', true)
            ->orderBy('jk.hubungankeluarga')
            ->get();
        $tahun =  $this->getDateTime()->format('Y');
        $SuratKematian = "_______/RSUD.C/SKS/_____________/SKK/________/" . $tahun;


        $result = array(
            'departemen' => $dataDepartemen,
            'kelompokpasien' => $dataKelompok,
            'dokter' => $dataDokter,
            'datalogin' => $dataLogin,
            'kelas' => $dataKelas,
            'dept' => $dept,
            'ruanganRi' => $ruanganRi,
            'deptrirj' => $deptRajalInap,
            'ruanganall' => $dataRuangan,
            'pembatalan' => $pembatalan,
            'jenisdiagnosa' => $jenisDiagnosa,
            //            'diagnosa' => $Diagnosa,
            //            'kddiagnosa' => $kdeDiagnosa,
            'kelompokkerjahead' => $KelompokKerjaHead,
            'kelompokkerja' => $KelompokKerja,
            'pegawaiLogin' => $dataPegawai->namalengkap,
            'jeniskelamin' => $dataJenisKelamin,
            'hubungankeluarga' => $dataHubunganKeluarga,
            'suratkematian' => $SuratKematian,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }

    public function getDataDiagnosa(Request $request)
    {
        $req = $request->all();
        $icdIX = \DB::table('diagnosa_m as dg')
            ->select('dg.id', 'dg.kddiagnosa', 'dg.namadiagnosa', 'dg.kddiagnosa as kdDiagnosa', 'dg.namadiagnosa as namaDiagnosa')
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

    public function saveAntrianPasien(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        DB::beginTransaction();
        $transStatus = 'true';
        try {
            $countNoAntrian = AntrianPasienDiperiksa::where('objectruanganfk', $request['objectruanganasalfk'])
                // ->where('kdprofile', $idProfile)
                ->where('tglregistrasi', '>=', $request['tglregistrasidate'] . ' 00:00')
                ->where('tglregistrasi', '<=', $request['tglregistrasidate'] . ' 23:59')
                ->count('norec');
            $pd = PasienDaftar::where('norec', $request['norec_pd'])->first();
            $noAntrian = $countNoAntrian + 1;
            $dataAPD = new AntrianPasienDiperiksa;
            $dataAPD->norec = $dataAPD->generateNewId();
            $dataAPD->kdprofile = $idProfile;
            $dataAPD->statusenabled = true;
            $dataAPD->objectasalrujukanfk = $request['asalrujukanfk'];
            $dataAPD->objectkelasfk = 6;
            $dataAPD->noantrian = $noAntrian;
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
            $dataAPD->save();

            $dataAPDnorec = $dataAPD->norec;
            $transStatus = 'true';
            $transMessage = "simpan AntrianPasienDiperiksa";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan AntrianPasienDiperiksa";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => $dataAPD,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "data" => $dataAPD,
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDataComboLabRab(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataDokter = \DB::table('pegawai_m as dp')
            ->select('dp.id', 'dp.namalengkap')
            ->whereIn('dp.objectjenispegawaifk', array(1))
            ->where('dp.statusenabled', true)
            // ->where('dp.kdprofile',$idProfile)
            ->orderBy('dp.namalengkap')
            ->get();

        $golonganDarah = \DB::table('golongandarah_m')
            ->select('id', 'golongandarah')
            ->where('statusenabled', true)
            // ->where('kdprofile',$idProfile)
            ->orderBy('golongandarah')
            ->get();

        $result = array(
            'dokter' => $dataDokter,
            'golongandarah' =>   $golonganDarah,
            'message' => 'inhuman',
        );
        return $this->respond($result);
    }

    public function deletePelayananPasien(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        DB::beginTransaction();
        try {
            foreach ($request['dataDel'] as $item) {
                $HapusPP = PelayananPasien::where('norec', $item['norec_pp'])->get();
                foreach ($HapusPP as $pp) {
                    $HapusPPD = PelayananPasienDetail::where('pelayananpasien', $pp['norec'])
                        // ->where('kdprofile', $idProfile)
                        ->delete();
                    $HapusPPP = PelayananPasienPetugas::where('pelayananpasien', $pp['norec'])
                        // ->where('kdprofile', $idProfile)
                        ->delete();
                }
                $Edit = PelayananPasien::where('norec', $item['norec_pp'])
                    // ->where('kdprofile', $idProfile)
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
                //                "nokirim" => $dataSO,//$noResep,,//$noResep,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Delete Pelayanan Pasien Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                //                "nokirim" => $dataSO,//$noResep,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getLaporanPasienMeninggal(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $data = \DB::select(DB::raw("select  ddp.objectjenisdiagnosafk, dg.kddiagnosa ,pt.norec,pt.tglmeninggal, pt.objectruanganlastfk , rm.namaruangan , pm.namapasien,jm.jeniskelamin ,pm.nocm, date_part('year',now()) - date_part('year',pm.tgllahir) as umur, km.kondisipasien 
        from antrianpasiendiperiksa_t at2 
        inner join pasiendaftar_t pt on pt.norec = at2.noregistrasifk 
        inner join ruangan_m rm on rm.id = pt.objectruanganlastfk
        inner join pasien_m pm on pm.id = pt.nocmfk 
        inner join jeniskelamin_m jm on jm.id = pm.objectjeniskelaminfk 
        inner join kondisipasien_m km on km.id = pt.objectkondisipasienfk 
        inner join detaildiagnosapasien_t AS ddp on ddp.noregistrasifk=at2.norec
        inner join diagnosapasien_t AS dp on dp.norec=ddp.objectdiagnosapasienfk
        inner join diagnosa_m as dg on ddp.objectdiagnosafk=dg.id
        where at2.tglregistrasi between '$tglAwal' and '$tglAkhir' and pt.tglmeninggal is not null and pt.statusenabled = 1 
        order by rm.namaruangan asc"));

        // $diagnosa = \DB::table('antrianpasiendiperiksa_t AS apd')
        //             ->join('detaildiagnosapasien_t AS ddp','ddp.noregistrasifk','=','apd.norec')
        //             ->join('diagnosapasien_t AS dp','dp.norec','=','ddp.objectdiagnosapasienfk')
        //             ->join ('diagnosa_m as dg','ddp.objectdiagnosafk','=','dg.id')
        //             ->select(DB::raw("apd.noregistrasifk,ddp.objectjenisdiagnosafk,dg.kddiagnosa AS diagnosa,
        //                              CASE WHEN dp.iskasusbaru = true AND dp.iskasuslama = false THEN 'BARU'
        //                              WHEN dp.iskasuslama = true AND dp.iskasusbaru = false THEN 'LAMA' ELSE '' END kasus"))
        //             ->where('apd.kdprofile', $kdProfile)
        //             ->where('apd.statusenabled', true)
        //             ->where('apd.tglregistrasi', '>=', $request['tglAwal'])
        //             ->where('apd.tglregistrasi', '<=', $request['tglAkhir'])
        //             ->get();
        // $bayar = \DB::table('antrianpasiendiperiksa_t AS apd')
        //         ->join('pelayananpasien_t AS pp','pp.noregistrasifk','=', 'apd.norec')
        //         ->leftJoin('strukpelayanan_t AS sp','sp.norec','=','pp.strukfk')
        //         ->leftJoin ('strukbuktipenerimaan_t AS sbm','sbm.nostrukfk','=','sp.norec')
        //         ->select(DB::raw("apd.noregistrasifk,apd.objectruanganfk,CASE WHEN pp.strukfk IS NOT NULL AND sbm.norec IS NOT NULL THEN pp.jumlah*pp.hargajual ELSE 0 END total"))
        //         ->where('apd.kdprofile', $kdProfile)
        //         ->where('apd.statusenabled', true)
        //         ->where('apd.tglregistrasi', '>=', $request['tglAwal'])
        //         ->where('apd.tglregistrasi', '<=', $request['tglAkhir'])
        //         ->get();
        // $i=0;
        // $dataDiagnosa = '';
        // foreach ($data as $items){
        //     foreach ($diagnosa as $dg){
        //         if ($data[$i]->norec == $dg->noregistrasifk){
        //             if ($dataDiagnosa == ''){
        //                 $dataDiagnosa = $dg->diagnosa;
        //             }else{
        //                 $dataDiagnosa = $dataDiagnosa . ',' . $dg->diagnosa;
        //             }
        //             $data[$i]->diagnosa = $dataDiagnosa;
        //             $data[$i]->kasus = $dg->kasus;
        //         }else{
        //             $data[$i]->diagnosa = '';
        //             $data[$i]->kasus = '';
        //         }
        //     }
        //     $i = $i + 1;
        // }

        $result = array(
            'data' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getLaporanPemulasaranJenazah(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $data = \DB::select(DB::raw(
            "select  
                        ddp.objectjenisdiagnosafk, 
                        dg.kddiagnosa,
                        pt.norec,
                        pt.tglmeninggal, 
                        pt.objectruanganlastfk,
                        kp.kelompokpasien,
                        rm.namaruangan, 
                        pm.namapasien,
                        pm.alamatrmh,
                        pm.nobpjs,
                        jm.jeniskelamin,
                        pm.nocm,
                        pm.tgllahir,
                        date_part('year',now()) - date_part('year',pm.tgllahir) as umur, 
                        km.kondisipasien 
                    from antrianpasiendiperiksa_t at2 
                    inner join pasiendaftar_t pt on pt.norec = at2.noregistrasifk 
                    inner join ruangan_m rm on rm.id = pt.objectruanganlastfk
                    inner join pasien_m pm on pm.id = pt.nocmfk 
                    inner join jeniskelamin_m jm on jm.id = pm.objectjeniskelaminfk 
                    inner join kondisipasien_m km on km.id = pt.objectkondisipasienfk 
                    inner join detaildiagnosapasien_t AS ddp on ddp.noregistrasifk=at2.norec
                    inner join diagnosapasien_t AS dp on dp.norec=ddp.objectdiagnosapasienfk
                    inner join diagnosa_m as dg on ddp.objectdiagnosafk=dg.id
                    inner join kelompokpasien_m as kp on kp.id = pt.objectkelompokpasienlastfk
                    where at2.tglregistrasi between '$tglAwal' and '$tglAkhir' 
                        and pt.tglmeninggal is not null 
                        and pt.statusenabled = 1 
                       
                    order by rm.namaruangan asc"
        ));

        $i = 1;
        foreach ($data as $d) {
            $d->tgllahir = date("d-m-Y", strtotime($d->tgllahir));
            $d->no = $i++;
        }

        $result = array(
            'data' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function BatalMeninggalPasien(Request $request)
    {
        $kdProfile = (int) $this->getDataKdProfile($request);
        $tglAyeuna = date('Y-m-d H:i:s');
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id', $dataLogin['userData']['id'])
            ->where('lu.kdprofile', $kdProfile)
            ->first();
        DB::beginTransaction();
        try {

            $pasienDaftar = PasienDaftar::where('noregistrasi', $request['noregistrasi'])
                // ->where('kdprofile', $kdProfile)
                ->select('nocmfk')
                ->first();

            $updatePasien = Pasien::where('id', $pasienDaftar->nocmfk)
                // ->where('kdprofile', $kdProfile)
                ->update([
                    'tglmeninggal' => null,
                ]);

            $upPD = PasienDaftar::where('noregistrasi', $request['noregistrasi'])
                // ->where('kdprofile', $kdProfile)
                ->update([
                    'keteranganpenyebabkematian' => null,
                    'objectkelompokpasiendetailfk' => null,
                    'objectstatuskeluarfk' => null,
                    'tglmeninggal' => null,
                ]);

            /*Logging User*/
            $newId = LoggingUser::max('id');
            $newId = $newId + 1;
            $logUser = new LoggingUser();
            $logUser->id = $newId;
            $logUser->norec = $logUser->generateNewId();
            $logUser->kdprofile = $kdProfile;
            $logUser->statusenabled = true;
            $logUser->jenislog = 'Batal Meninggal Pasien';
            $logUser->noreff = $request['noregistrasi'];
            $logUser->referensi = 'Noregistrasi';
            $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
            $logUser->tanggal = $tglAyeuna;
            $logUser->keterangan = 'Batal Meninggal Pasien Noregistrasi :' . $request['noregistrasi'];
            $logUser->save();
            /*End Logging User*/

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
                //                "nokirim" => $dataSO,//$noResep,,//$noResep,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function savePermohonanPelayananJenazah(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAyeuna = date('Y-m-d H:i:s');
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id', $dataLogin['userData']['id'])
            // ->where('lu.kdprofile', $idProfile)
            ->first();
        $pasien = DB::table('pasiendaftar_t as pd')
            ->join('ruangan_m as ru', 'pd.objectruanganlastfk', '=', 'ru.id')
            ->join('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            ->select('pd.noregistrasi', 'ru.namaruangan', 'pd.tglpulang')
            ->where('pd.norec', '=', $request['nores_pd'])
            // ->where('pd.kdprofile', $idProfile)
            ->where('pd.statusenabled', true)
            ->first();
        //        return $this->respond($pasien->noregistrasi);
        $keterangan = '';
        DB::beginTransaction();
        try {

            if ($request['norec'] == "") {
                $keterangan = "Input Permohonan Pelayanan Jenazah";
                $dataSO = new SuratPermohonanJenazah();
                $dataSO->norec = $dataSO->generateNewId();
                $dataSO->kdprofile = $idProfile;
                $dataSO->statusenabled = true;
                $dataSO->tglsurat = $tglAyeuna;
                $dataSO->pasiendaftarfk = $request['nores_pd'];
            } else {
                $keterangan = "Ubah Permohonan Pelayanan Jenazah";
                $dataSO = SuratPermohonanJenazah::where('norec', $request['norec'])->first();
            }
            $dataSO->nosurat = $request['nosurat'];
            $dataSO->penanggungjawab = $request['penanggungjawab'];
            $dataSO->objectjeniskelaminfk = $request['objectjeniskelaminfk'];
            $dataSO->objecthubungankeluargafk = $request['objecthubungankeluargafk'];
            $dataSO->alamat = $request['alamat'];
            $dataSO->covid = $request['covid'];
            $dataSO->noncovid = $request['noncovid'];
            $dataSO->petugassatu = $request['petugassatu'];
            $dataSO->petugasdua = $request['petugasdua'];
            $dataSO->petugastiga = $request['petugastiga'];
            $dataSO->petugasempat = $request['petugasempat'];
            $dataSO->petugaslima = $request['petugaslima'];
            $dataSO->pemulasaraanjenazah = $request['pemulasaraanjenazah'];
            $dataSO->pengkafanan = $request['pengkafanan'];
            $dataSO->plastisisasi = $request['plastisisasi'];
            $dataSO->kantongjenazah = $request['kantongjenazah'];
            $dataSO->petijenazah = $request['petijenazah'];
            $dataSO->disinfektanjenazah = $request['disinfektanjenazah'];
            $dataSO->pelayanankerohanian = $request['pelayanankerohanian'];
            $dataSO->transportasiambulan = $request['transportasiambulan'];
            $dataSO->disinfektanambulan = $request['disinfektanambulan'];
            $dataSO->save();
            $dataSOnorec = $dataSO->norec;

            /*Logging User*/
            $newId = LoggingUser::max('id');
            $newId = $newId + 1;
            $logUser = new LoggingUser();
            $logUser->id = $newId;
            $logUser->norec = $logUser->generateNewId();
            $logUser->kdprofile = $kdProfile;
            $logUser->statusenabled = true;
            $logUser->jenislog = $keterangan;
            $logUser->noreff = $dataSOnorec;
            $logUser->referensi = 'Norec Surat Permohonan Jenazah';
            $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
            $logUser->tanggal = $tglAyeuna;
            $logUser->keterangan = $keterangan . ' Pasien Dengan No Registrasi ' . $pasien->noregistrasi;
            $logUser->save();
            /*End Logging User*/


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

    public function getDataPermohonanPelayananJenazah(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('suratpermohonanjenazah_t AS spj', 'spj.pasiendaftarfk', '=', 'pd.norec')
            ->leftjoin('jeniskelamin_m AS jk', 'jk.id', '=', 'spj.objectjeniskelaminfk')
            ->leftjoin('hubungankeluarga_m AS hk', 'hk.id', '=', 'spj.objecthubungankeluargafk')
            ->leftjoin('pegawai_m AS pg', 'pg.id', '=', 'spj.petugassatu')
            ->leftjoin('pegawai_m AS pg1', 'pg1.id', '=', 'spj.petugasdua')
            ->leftjoin('pegawai_m AS pg2', 'pg2.id', '=', 'spj.petugastiga')
            ->leftjoin('pegawai_m AS pg3', 'pg3.id', '=', 'spj.petugasempat')
            ->leftjoin('pegawai_m AS pg4', 'pg4.id', '=', 'spj.petugaslima')
            ->select(DB::raw("spj.*,jk.jeniskelamin,hk.hubungankeluarga,pg.namalengkap AS namapetugassatu,
                                    pg1.namalengkap AS namapetugasdua,pg2.namalengkap AS namapetugastiga,
                                    pg3.namalengkap AS namapetugasempat,pg4.namalengkap AS namapetugaslima"))
            // ->where('pd.kdprofile', $kdProfile)
            ->where('pd.statusenabled', true)
            ->where('spj.statusenabled', true);

        if (isset($request['norec_pd']) && $request['norec_pd'] != "" && $request['norec_pd'] != "undefined") {
            $data = $data->where('pd.norec', $request['norec_pd']);
        }
        $data = $data->get();
        $result = array(
            'data' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function HapusPermohonanPelayananJenazah(Request $request)
    {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $tglAyeuna = date('Y-m-d H:i:s');
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id', $dataLogin['userData']['id'])
            ->where('lu.kdprofile', $idProfile)
            ->first();

        $keterangan = '';
        DB::beginTransaction();
        try {

            $dataSO = SuratPermohonanJenazah::where('norec', $request['norec'])
                ->update([
                    "statusenabled" => false,
                ]);

            /*Logging User*/
            $newId = LoggingUser::max('id');
            $newId = $newId + 1;
            $logUser = new LoggingUser();
            $logUser->id = $newId;
            $logUser->norec = $logUser->generateNewId();
            $logUser->kdprofile = $kdProfile;
            $logUser->statusenabled = true;
            $logUser->jenislog = "Hapus Surat Permohonan Jenazah";
            $logUser->noreff  = $request['norec'];
            $logUser->referensi = 'Norec Surat Permohonan Jenazah';
            $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
            $logUser->tanggal = $tglAyeuna;
            $logUser->keterangan = "Hapus Surat Permohonan Jenazah Noregistrasi " . $request['noregistrasi'];
            $logUser->save();
            /*End Logging User*/

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
    public function saveFormulirAntemortem(Request $request)
    {
        $foto = $request['foto'];
        $foto2 = $request['foto2'];
        $foto3 = $request['foto3'];
        $foto4 = $request['foto4'];
        $foto5 = $request['foto5'];
        $foto6 = $request['foto6'];
        $noregistrasiSeq = $this->generateCodeBySeqTable(new FormulirAntemortem, 'noregistrasi_am', 8, date('ym'));
        if ($noregistrasiSeq == '') {
            $transMessage = "Gagal create nomor registrasi, Coba lagi !";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "as" => 'hehe',
            );
            return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        }
        DB::beginTransaction();
        try {
            $dataAM = new FormulirAntemortem();
            $dataAM->norec = $dataAM->generateNewId();
            $dataAM->statusenabled = true;
            $dataAM->noregistrasi = $noregistrasiSeq;
            $dataAM->tglinput = date('Y-m-d H:i:s');
            $dataAM->namapelapor = $request['namapelapor'];
            $dataAM->namadilaporkan = $request['namadilaporkan'];
            $dataAM->namapanggilan = $request['namapanggilan'];
            $dataAM->jeniskelaminfk = $request['jeniskelamin'];
            $dataAM->hubungankeluargafk = $request['hubungankeluarga'];
            $dataAM->tgllahir = $request['tanggallahir'];
            $dataAM->usia = $request['usia'];
            $dataAM->suku = $request['suku'];
            $dataAM->notelepon = $request['notelepon'];
            $dataAM->alamat = $request['alamat'];
            $dataAM->sumbersidikjari = $request['sumbersidikjari'];
            $dataAM->uraiansidikjari = $request['uraiansidikjari'];
            $dataAM->keterangansidikjari = $request['keterangansidikjari'];
            $dataAM->sumbergigi = $request['sumbergigi'];
            $dataAM->uraiangigi = $request['uraiangigi'];
            $dataAM->keterangangigi = $request['keterangangigi'];
            $dataAM->sumberdna = $request['sumberdna'];
            $dataAM->uraiandna = $request['uraiandna'];
            $dataAM->keterangandna = $request['keterangandna'];
            $dataAM->ciricirifisik = $request['ciricirifisik'];
            $dataAM->keteranganfisik = $request['keteranganfisik'];
            $dataAM->barangkepemilikan = $request['barangkepemilikan'];
            $dataAM->keteranganbarang = $request['keteranganbarang'];
            $dataAM->jenisbencanafk = $request['jenisbencana'];
            $dataAM->objectkebangsaanfk = $request['kebangsaan'];
            $dataAM->objectpetugaswawancarafk = $request['petugaswawancara'];
            $dataAM->notelppetugaswawancara = $request['notelpwawancara'];
            $dataAM->tglwawancara = $request['tglwawancara'];
            $dataAM->objectpenginputfk = $request['petugasinput'];
            $dataAM->notelppenginput = $request['notelpinput'];
            $dataAM->petugaswawancaraluar = $request['petugaswawancaraluar'];
            $dataAM->save();

            $norec_AM = $dataAM->noregistrasi;

            foreach ($foto as $f) {
                $fotoAM = new FotoAntemortem();
                $fotoAM->norec = $fotoAM->generateNewId();
                $fotoAM->statusenabled = true;
                $fotoAM->formulirantemortemfk = $norec_AM;
                $fotoAM->foto = $f['foto'];
                $fotoAM->objectidentitasdvifk = $f['id'];
                $fotoAM->save();
            }
            foreach ($foto2 as $f2) {
                $fotoAM = new FotoAntemortem();
                $fotoAM->norec = $fotoAM->generateNewId();
                $fotoAM->statusenabled = true;
                $fotoAM->formulirantemortemfk = $norec_AM;
                $fotoAM->foto = $f2['foto'];
                $fotoAM->objectidentitasdvifk = $f2['id'];
                $fotoAM->save();
            }
            foreach ($foto3 as $f3) {
                $fotoAM = new FotoAntemortem();
                $fotoAM->norec = $fotoAM->generateNewId();
                $fotoAM->statusenabled = true;
                $fotoAM->formulirantemortemfk = $norec_AM;
                $fotoAM->foto = $f3['foto'];
                $fotoAM->objectidentitasdvifk = $f3['id'];
                $fotoAM->save();
            }
            foreach ($foto4 as $f4) {
                $fotoAM = new FotoAntemortem();
                $fotoAM->norec = $fotoAM->generateNewId();
                $fotoAM->statusenabled = true;
                $fotoAM->formulirantemortemfk = $norec_AM;
                $fotoAM->foto = $f4['foto'];
                $fotoAM->objectidentitasdvifk = $f4['id'];
                $fotoAM->save();
            }
            foreach ($foto5 as $f5) {
                $fotoAM = new FotoAntemortem();
                $fotoAM->norec = $fotoAM->generateNewId();
                $fotoAM->statusenabled = true;
                $fotoAM->formulirantemortemfk = $norec_AM;
                $fotoAM->foto = $f5['foto'];
                $fotoAM->objectidentitasdvifk = $f5['id'];
                $fotoAM->save();
            }
            foreach ($foto6 as $f6) {
                $fotoAM = new FotoAntemortem();
                $fotoAM->norec = $fotoAM->generateNewId();
                $fotoAM->statusenabled = true;
                $fotoAM->formulirantemortemfk = $norec_AM;
                $fotoAM->foto = $f6['foto'];
                $fotoAM->objectidentitasdvifk = $f6['id'];
                $fotoAM->save();
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
    public function saveFormulirAntemortemWeb(Request $request)
    {
        // return($request);
        // die();

        //         foreach ($request['nameuploadFile'] as $f) {
        //             return($f['filephoto']);
        //             die();
        //             }
        // if($request['gigi']==[]){
        //     return('test');
        //         die();    
        // }
        // return($request['gigi']);
        //         die();
        if ($request['sidikjari'] == "null" || $request['sidikjari'] == "") {
            DB::rollBack();
            $transStatus = 'false';
            $transMessage = "Gagal Simpan";
            $result = array(
                "status" => 400,
                "message" => "Sumber Sidik Jari harus diisi",
            );
            return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        } else if ($request['uraianSidikjari'] == "null" || $request['uraianSidikjari'] == "") {
            DB::rollBack();
            $transStatus = 'false';
            $transMessage = "Gagal Simpan";
            $result = array(
                "status" => 400,
                "message" => "Uraian Sidik Jari harus diisi",
            );
            return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        } else if ($request['keteranganSidikjari'] == "null" || $request['keteranganSidikjari'] == "") {
            DB::rollBack();
            $transStatus = 'false';
            $transMessage = "Gagal Simpan";
            $result = array(
                "status" => 400,
                "message" => "Keterangan Sidik Jari harus diisi",
            );
            return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        } else if ($request['gigi'] == "null" || $request['gigi'] == "") {
            DB::rollBack();
            $transStatus = 'false';
            $transMessage = "Gagal Simpan";
            $result = array(
                "status" => 400,
                "message" => "Sumber Gigi harus diisi",
            );
            return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        } else if ($request['uraianGigi'] == "null" || $request['uraianGigi'] == "") {
            DB::rollBack();
            $transStatus = 'false';
            $transMessage = "Gagal Simpan";
            $result = array(
                "status" => 400,
                "message" => "Uraian Gigi harus diisi",
            );
            return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        } else if ($request['keteranganGigi'] == "null" || $request['keteranganGigi'] == "") {
            DB::rollBack();
            $transStatus = 'false';
            $transMessage = "Gagal Simpan";
            $result = array(
                "status" => 400,
                "message" => "Keterangan Gigi harus diisi",
            );
            return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        } else if ($request['dna'] == "null" || $request['dna'] == "") {
            DB::rollBack();
            $transStatus = 'false';
            $transMessage = "Gagal Simpan";
            $result = array(
                "status" => 400,
                "message" => "Sumber DNA harus diisi",
            );
            return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        } else if ($request['uraianDna'] == "null" || $request['uraianDna'] == "") {
            DB::rollBack();
            $transStatus = 'false';
            $transMessage = "Gagal Simpan";
            $result = array(
                "status" => 400,
                "message" => "Uraian DNA harus diisi",
            );
            return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        } else if ($request['keteranganDna'] == "null" || $request['keteranganDna'] == "") {
            DB::rollBack();
            $transStatus = 'false';
            $transMessage = "Gagal Simpan";
            $result = array(
                "status" => 400,
                "message" => "Keterangan DNA harus diisi",
            );
            return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        } else if ($request['ciriFisik'] == "null" || $request['ciriFisik'] == "") {
            DB::rollBack();
            $transStatus = 'false';
            $transMessage = "Gagal Simpan";
            $result = array(
                "status" => 400,
                "message" => "Ciri Fisik harus diisi",
            );
            return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        } else if ($request['keteranganCiriFisik'] == "null" || $request['keteranganCiriFisik'] == "") {
            DB::rollBack();
            $transStatus = 'false';
            $transMessage = "Gagal Simpan";
            $result = array(
                "status" => 400,
                "message" => "Keterangan Fisik harus diisi",
            );
            return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        } else if ($request['barang'] == "null" || $request['barang'] == "") {
            DB::rollBack();
            $transStatus = 'false';
            $transMessage = "Gagal Simpan";
            $result = array(
                "status" => 400,
                "message" => "Barang harus diisi",
            );
            return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        } else if ($request['keteranganBarang'] == "null" || $request['keteranganBarang'] == "") {
            DB::rollBack();
            $transStatus = 'false';
            $transMessage = "Gagal Simpan";
            $result = array(
                "status" => 400,
                "message" => "Keterangan Barang harus diisi",
            );
            return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            // } else if ($request['uploadFile'] == "null" || $request['uploadFile'] == "") {
            //     DB::rollBack();
            //     $transStatus = 'false';
            //     $transMessage = "Gagal Simpan";
            //     $result = array(
            //         "status" => 400,
            //         "message" => "Silahkan Uploaf File",
            //     );
            //     return $this->setStatusCode($result['status'])->respond($result, $transMessage);
            // } else if ($request['nameuploadFile'] == "null" || $request['nameuploadFile'] == "") {
            //     DB::rollBack();
            //     $transStatus = 'false';
            //     $transMessage = "Gagal Simpan";
            //     $result = array(
            //         "status" => 400,
            //         "message" => "Silahkan Uploaf File",
            //     );
            //     return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        } else if ($request['norecotp'] == "null" || $request['norecotp'] == "") {
            DB::rollBack();
            $transStatus = 'false';
            $transMessage = "Gagal Simpan";
            $result = array(
                "status" => 400,
                "message" => "Silahkan login ulang, Sesi Anda Sudah Berakhir",
            );
            return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        } else if ($request['ktpKorban'] == "null" || $request['ktpKorban'] == "") {
            DB::rollBack();
            $transStatus = 'false';
            $transMessage = "Gagal Simpan";
            $result = array(
                "status" => 400,
                "message" => "Silahkan KTP/NIK Korban harus diisi",
            );
            return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        }

        $noregistrasiSeq = $this->generateCodeBySeqTable(new FormulirAntemortem, 'noregistrasi_am', 8, date('ym'));
        if ($noregistrasiSeq == '') {
            $transMessage = "Gagal create nomor registrasi, Coba lagi !";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "as" => 'hehe',
            );
            return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        }
        DB::beginTransaction();
        try {
            $delFA = FormulirAntemortem::where('noregistrasi', $request['noregistrasi'])
                ->delete();
            $delFoto = FotoAntemortem::where('formulirantemortemfk', $request['noregistrasi'])
                ->delete();

            $dataAM = new FormulirAntemortem();
            $dataAM->norec = $dataAM->generateNewId();
            $dataAM->statusenabled = true;
            $dataAM->noregistrasi = $noregistrasiSeq;
            $dataAM->tglinput = date('Y-m-d H:i:s');
            $dataAM->sumbersidikjari = $request['sidikjari']['id'];
            $dataAM->uraiansidikjari = $request['uraianSidikjari'];
            $dataAM->keterangansidikjari = $request['keteranganSidikjari'];
            $dataAM->sumbergigi = $request['gigi']['id'];
            $dataAM->uraiangigi = $request['uraianGigi'];
            $dataAM->keterangangigi = $request['keteranganGigi'];
            $dataAM->sumberdna = $request['dna']['id'];
            $dataAM->uraiandna = $request['uraianDna'];
            $dataAM->keterangandna = $request['keteranganDna'];
            $dataAM->ciricirifisik = $request['ciriFisik'];
            $dataAM->keteranganfisik = $request['keteranganCiriFisik'];
            $dataAM->barangkepemilikan = $request['barang'];
            $dataAM->keteranganbarang = $request['keteranganBarang'];
            $dataAM->dvipelaporfk = $request['norecotp'];
            $dataAM->nikkorban =  $request['ktpKorban'];
            // $dataAM->nameuploadfile =  $request['nameuploadFile'];
            $dataAM->save();

            $norec_AM = $dataAM->noregistrasi;

            foreach ($request['nameuploadFile'] as $f) {
                //     return($f['filephoto']);
                // die();
                $fotoAM = new FotoAntemortem();
                $fotoAM->norec = $fotoAM->generateNewId();
                $fotoAM->statusenabled = true;
                $fotoAM->formulirantemortemfk = $norec_AM;
                $fotoAM->foto = $f['filephoto'];
                $fotoAM->objectidentitasdvifk = $f['objectidentitasdvifk'];
                $fotoAM->save();
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
    public function getFormulirAntemortem(Request $request)
    {
        $data = \DB::table('formulirantemortem_t as fa')
            ->leftjoin('dvipelapor_t as dp', 'dp.norec', '=', 'fa.dvipelaporfk')
            ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'fa.jeniskelaminfk')
            ->leftjoin('jeniskelamin_m as jk2', 'jk2.id', '=', 'dp.objectjeniskelaminfk')
            ->leftjoin('hubungankeluarga_m as hk', 'hk.id', '=', 'fa.hubungankeluargafk')
            ->leftjoin('hubungankeluarga_m as hk2', 'hk2.id', '=', 'dp.objecthubunganfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'fa.objectpetugaswawancarafk')
            ->leftjoin('pegawai_m as pg2', 'pg2.id', '=', 'fa.objectpenginputfk')
            ->select(DB::raw("case when fa.namapelapor is null then dp.namapelapor else fa.namapelapor end as namapelapor, case when fa.namadilaporkan is null then dp.namakorban else fa.namadilaporkan end as namadilaporkan,
                    case when fa.namapanggilan is null then dp.namaalias else fa.namapanggilan end as namapanggilan, case when fa.jeniskelaminfk is null then jk2.jeniskelamin else jk.jeniskelamin end as jeniskelamin,
                    case when fa.tgllahir is null then dp.tgllahir else fa.tgllahir end as tgllahir, case when fa.alamat is null then dp.domisilikorban else fa.alamat end as alamat, 
                    case when fa.hubungankeluargafk is not null then hk.hubungankeluarga else hk2.hubungankeluarga end as hubungankeluarga,
                    case when fa.hubungankeluargafk is not null then fa.namapelapor + ' ' + hk.hubungankeluarga else dp.namapelapor + ' ' + hk2.hubungankeluarga end as namahubungan,
                    case when fa.notelepon is not null then fa.notelepon else dp.nohp end as notelepon, case when fa.hubungankeluargafk is not null then hk.id else hk2.id end as idhubungankeluarga,
                    case when fa.jenisbencanafk is not null then fa.jenisbencanafk else dp.objectjenisbencanafk end as idjenisbencana, 
                    case when fa.objectpetugaswawancarafk is not null then pg.namalengkap else fa.petugaswawancaraluar end as petugaswawancara,
                    case when fa.dvipelaporfk is not null then 'Online' else '' end as statusdaftar "), 'fa.noregistrasi', 'fa.tglinput', 'pg.id as idpetugaswawancara', 'pg2.namalengkap as penginput', 'pg2.id as idpenginput', 'fa.notelppetugaswawancara', 'fa.tglwawancara', 'fa.notelppenginput', 'fa.objectpetugaswawancarafk', 'fa.petugaswawancaraluar');
        if (isset($request['jenisbencana']) && $request['jenisbencana'] != "" && $request['jenisbencana'] != "undefined") {
            $data = $data->Where(function ($data) use ($request) {
                $data->where('fa.jenisbencanafk', '=', $request['jenisbencana'])
                    ->orWhere('dp.objectjenisbencanafk', '=', $request['jenisbencana']);
            });
        }
        if (isset($request['namakorban']) && $request['namakorban'] != "" && $request['namakorban'] != "undefined") {
            $data = $data->Where(function ($data) use ($request) {
                $data = $data->where('dp.namakorban', 'like', '%' . $request['namakorban'] . '%')
                    ->orWhere('fa.namadilaporkan', 'like', '%' . $request['namakorban'] . '%');
            });
        }
        if (isset($request['namapelapor']) && $request['namapelapor'] != "" && $request['namapelapor'] != "undefined") {
            $data = $data->Where(function ($data) use ($request) {
                $data = $data->where('dp.namapelapor', 'like', '%' . $request['namapelapor'] . '%')
                    ->orWhere('fa.namapelapor', 'like', '%' . $request['namapelapor'] . '%');
            });
        }
        $data = $data->get();

        return $this->respond($data);
    }
    public function getFotoAntemortem(Request $request)
    {
        $data = \DB::table('fotoantemortem_t as fa')
            ->select('fa.*')
            ->where('formulirantemortemfk', $request['noreg'])
            ->get();

        return $this->respond($data);
    }
    public function saveMappingJenisBencana(Request $request)
    {
        DB::beginTransaction();
        try {
            $newId = MappingJenisBencanaToFormulirAntemortem::max('id');
            $newId = $newId + 1;
            $map = new MappingJenisBencanaToFormulirAntemortem();
            $map->id = $newId;
            $map->statusenabled = true;
            $map->kdprofile = 17;
            $map->jenisbencana = $request['jenisbencana'];
            $map->tglbencana = $request['tglbencana'];
            $map->norec = $map->generateNewid();
            $map->save();

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
    public function getMappingJenisBencana(Request $request)
    {
        $data = \DB::table('mappingjenisbencanatoformulirantemortem_t as map')
            ->select(
                'map.jenisbencana',
                'map.tglbencana',
                'map.isverifikasi',
                'map.id',
                DB::raw('case when map.tglditutup is null then \'Belum di Verifikasi Tutup\' else map.tglditutup end as tglditutup')
            )
            ->where('map.statusenabled', true)
            ->get();

        return $this->respond($data);
    }
    public function getMappingJenisBencanaToFormulirAntemortem(Request $request)
    {
        $data = \DB::table('mappingjenisbencanatoformulirantemortem_t as map')
            ->select('map.jenisbencana', 'map.tglbencana', 'map.id as idjenisbencana')
            ->where('map.statusenabled', true)
            ->orderBy('id', 'desc')
            ->take(1)
            ->get();

        return $this->respond($data);
    }
    public function savePostmortem(Request $request)
    {
        $foto = $request['foto'];
        $foto2 = $request['foto2'];
        $foto3 = $request['foto3'];
        $foto4 = $request['foto4'];

        DB::beginTransaction();

        try {
            $pm = new Postmortem();
            $pm->norec = $pm->generateNewId();
            $pm->kdprofile = 17;
            $pm->statusenabled = true;
            $pm->labeldvi = $request['labeldvi'];
            $pm->tglperiksa = $request['tglperiksa'];
            $pm->jeniskelaminfk = $request['jeniskelaminfk'];
            $pm->perkiraanusia = $request['perkiraanusia'];
            $pm->perkiraantinggibadan = $request['perkiraantinggibadan'];
            $pm->cirikhusus = $request['cirikhusus'];
            $pm->barangbukti = $request['barangbukti'];
            $pm->keteranganbarang = $request['keteranganbarang'];
            $pm->pemeriksaandna = $request['pemeriksaandna'];
            $pm->uraiandna = $request['uraiandna'];
            $pm->keterangandna = $request['keterangandna'];
            // $pm->dna = $request['dna'];
            $pm->golongandarahfk = $request['golongandarahfk'];
            $pm->pemeriksaaninafis = $request['pemeriksaaninavis'];
            $pm->uraianinavis = $request['uraianinavis'];
            $pm->keteranganinavis = $request['keteranganinavis'];
            // $pm->inavis = $request['inavis'];
            $pm->tim = $request['tim'];
            $pm->dokter = $request['dokter'];
            $pm->dokter2 = $request['dokter2'];
            $pm->dokter3 = $request['dokter3'];
            $pm->dokter4 = $request['dokter4'];
            $pm->dokter5 = $request['dokter5'];
            $pm->labeltkp = $request['labeltkp'];
            $pm->pemeriksaangigi = $request['pemeriksaangigi'];
            $pm->uraiangigi = $request['uraiangigi'];
            $pm->keterangangigi = $request['keterangangigi'];
            // $pm->gigi = $request['gigi'];
            $pm->odontologi = $request['odontologi'];
            $pm->hasillab = $request['hasillab'];
            $pm->keterangan = $request['keterangan'];
            $pm->jenisbencanafk = $request['idjenisbencanafk'];
            $pm->sidikjari = $request['sidikjari'];
            $pm->hasilpemeriksaan = $request['hasilpemeriksaan'];
            $pm->keteranganpemeriksaan = $request['keteranganpemeriksaan'];
            $pm->save();
            $postmortemfk = $pm->norec;

            foreach ($foto as $f) {

                $fpm = new FotoPostmortem();
                $fpm->norec = $fpm->generateNewId();
                $fpm->statusenabled = true;
                $fpm->postmortemfk = $postmortemfk;
                $fpm->jenisgambar = $f['jenisgambar'];
                $fpm->foto = $f['foto'];
                $fpm->save();
            }
            foreach ($foto2 as $f2) {
                $fpm = new FotoPostmortem();
                $fpm->norec = $fpm->generateNewId();
                $fpm->statusenabled = true;
                $fpm->postmortemfk = $postmortemfk;
                $fpm->jenisgambar = $f2['jenisgambar'];
                $fpm->foto = $f2['foto'];
                $fpm->save();
            }
            foreach ($foto3 as $f3) {
                $fpm = new FotoPostmortem();
                $fpm->norec = $fpm->generateNewId();
                $fpm->statusenabled = true;
                $fpm->postmortemfk = $postmortemfk;
                $fpm->jenisgambar = $f3['jenisgambar'];
                $fpm->foto = $f3['foto'];
                $fpm->save();
            }
            foreach ($foto4 as $f4) {
                $fpm = new FotoPostmortem();
                $fpm->norec = $fpm->generateNewId();
                $fpm->statusenabled = true;
                $fpm->postmortemfk = $postmortemfk;
                $fpm->jenisgambar = $f4['jenisgambar'];
                $fpm->foto = $f4['foto'];
                $fpm->save();
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = 'Simpan Gagal';
        }
        if ($transStatus == 'true') {
            $transMessage = 'Simpan Berhasil !';
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            $transMessage = 'Simpan Gagal !';
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getPostmortem(Request $request)
    {
        $data = \DB::table('postmortem_t as pm')
            ->join('jeniskelamin_m as jk', 'jk.id', '=', 'pm.jeniskelaminfk')
            ->join('golongandarah_m as glg', 'glg.id', '=', 'pm.golongandarahfk')
            // ->join('pegawai_m as pg', 'pg.id', '=', 'pm.dokterfk')
            ->select(DB::raw('ROW_NUMBER() OVER (order by pm.tglperiksa) as no, pm.norec, pm.labeldvi, pm.tglperiksa,
            jk.jeniskelamin, pm.perkiraanusia, pm.perkiraantinggibadan, pm.cirikhusus, pm.barangbukti, pm.dna, glg.golongandarah,
            pm.inavis, pm.tim, pm.labeltkp, pm.gigi, pm.odontologi, pm.hasillab, pm.keterangan,
            case when pm.dokter is not null and pm.dokter2 is null and pm.dokter3 is null and pm.dokter4 is null and pm.dokter5 is null then pm.dokter
            when pm.dokter is not null and pm.dokter2 is not null and pm.dokter3 is null and pm.dokter4 is null and pm.dokter5 is null then pm.dokter + \', \' + pm.dokter2
            when pm.dokter is not null and pm.dokter2 is not null and pm.dokter3 is not null and pm.dokter4 is null and pm.dokter5 is null then pm.dokter + \', \' + pm.dokter2 + \', \' + pm.dokter3
            when pm.dokter is not null and pm.dokter2 is not null and pm.dokter3 is not null and pm.dokter4 is not null and pm.dokter5 is null then pm.dokter + \', \' + pm.dokter2 + \', \' + pm.dokter3 + \', \' + pm.dokter4
            when pm.dokter is not null and pm.dokter2 is not null and pm.dokter3 is not null and pm.dokter4 is not null and pm.dokter5 is not null then pm.dokter + \', \' + pm.dokter2 + \', \' + pm.dokter3 + \', \' + pm.dokter4 + \', \' + pm.dokter5 else \'\' end as dokter'));

        if (isset($request['jenisbencana']) && $request['jenisbencana'] != "" && $request['jenisbencana'] != "undefined") {
            $data = $data->where('pm.jenisbencanafk', '=', $request['jenisbencana']);
        }
        $data = $data->get();

        return $this->respond($data);
    }
    public function savePenerimaanJenazah(Request $request)
    {
        $noregistrasiSeq = $this->generateCodeBySeqTable(new PenerimaanJenazahDvi, 'nojenazah', 10, 'DIVTI' . '/', date('ym'));
        if ($noregistrasiSeq == '') {
            $transMessage = "Gagal create nomor registrasi, Coba lagi !";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "as" => 'hehe',
            );
            return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        }
        DB::beginTransaction();

        try {
            $pm = new PenerimaanJenazahDvi();
            $pm->norec = $pm->generateNewId();
            $pm->tglinput = date('Y-m-d h:i:s');
            $pm->nojenazah = $noregistrasiSeq;
            $pm->bodybag = $request['bodybag'];
            $pm->keterangan = $request['keterangan'];
            $pm->nobodybag = $request['nobodybag'];
            $pm->jenisbencanafk = $request['jenisbencanafk'];
            $pm->tglterima = $request['tglterima'];
            $pm->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = 'Simpan Gagal';
        }
        if ($transStatus == 'true') {
            $transMessage = 'Simpan Berhasil !';
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            $transMessage = 'Simpan Gagal !';
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getFotoPostmortem(Request $request)
    {
        $data = \DB::table('fotopostmortem_t as fpm')
            ->join('postmortem_t as pm', 'pm.norec', '=', 'fpm.postmortemfk')
            ->select('fpm.*')
            ->where('fpm.postmortemfk', $request['norec'])
            ->get();

        return $this->respond($data);
    }
    public function getAntemortem(Request $request)
    {
        $data = \DB::table('formulirantemortem_t as fa')
            ->leftjoin('dvipelapor_t as dp', 'dp.norec', '=', 'fa.dvipelaporfk')
            ->select(DB::raw("
            case when fa.namadilaporkan is not null then convert(varchar(10),fa.noregistrasi) + ' ' + fa.namadilaporkan else convert(varchar(10),fa.noregistrasi) + ' ' + dp.namakorban end as noregistrasikorban,
            fa.noregistrasi
            "));
        // ->where('fa.jenisbencanafk', $request['jenisbencana'])
        $data = $data->Where(function ($data) use ($request) {
            $data->where('fa.jenisbencanafk', '=', $request['jenisbencana'])
                ->orWhere('dp.objectjenisbencanafk', '=', $request['jenisbencana']);
        });
        $data = $data->get();

        return $this->respond($data);
    }
    public function getFotoIdentifikasiAntemortem(Request $request)
    {
        $data = \DB::table('fotoantemortem_t as fa')
            ->select('fa.*')
            ->where('fa.formulirantemortemfk', $request['noregistrasi'])
            ->get();

        return $this->respond($data);
    }
    public function getIdentifikasiPostmortem(Request $request)
    {
        $data = \DB::table('postmortem_t as pm')
            // ->leftjoin('fotoantemortem_t as foto', 'foto.formulirantemortemfk', '=', 'fa.noregistrasi')
            ->select('pm.labeldvi', 'pm.norec')
            ->where('pm.jenisbencanafk', $request['jenisbencana'])
            ->whereNull('pm.isteridentifikasi')
            ->get();

        return $this->respond($data);
    }
    public function getFotoIdentifikasiPostmortem(Request $request)
    {
        $data = \DB::table('fotopostmortem_t as fpm')
            ->select('fpm.foto')
            ->where('fpm.postmortemfk', $request['labeldvi'])
            ->get();

        return $this->respond($data);
    }
    public function saveIdentifikasiJenazah(Request $request)
    {
        DB::beginTransaction();
        try {
            $ij = new IdentifikasiJenazah();
            $ij->norec = $ij->generateNewId();
            $ij->noregistrasiantemortem = $request['noregistrasi'];
            $ij->labeldvipostmortem = $request['nolabeldvi'];
            $ij->keterangan = $request['keterangan'];
            $ij->jenisbencanafk = $request['jenisbencana'];
            $ij->tglteridentifikasi = $this->getDateTime()->format('Y-m-d H:i:s');
            $ij->save();

            $norec_identifikasi = $ij->norec;

            // $updatematchAM = FormulirAntemortem::where('noregistrasi', $request['noregistrasi'])
            //     ->update([
            //         'isteridentifikasi' => $norec_identifikasi
            //     ]);
            $updatematchPM = Postmortem::where('norec', $request['norecpostmortem'])
                ->update([
                    'isteridentifikasi' => $norec_identifikasi
                ]);
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = 'Simpan Gagal';
        }
        if ($transStatus == 'true') {
            $transMessage = 'Simpan Berhasil !';
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            $transMessage = 'Simpan Gagal !';
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getLaporanPostmortem(Request $request)
    {
        $data = \DB::select(DB::raw("
        select x.jenisbencana,sum(case when x.jenisbencanafk is not null then 1 else 0 end) as jumlahpm,sum(case when x.isteridentifikasi is not null then 1 else 0 end) as teridentifikasi from
        (select map.jenisbencana,postmortem_t.* from postmortem_t join
        mappingjenisbencanatoformulirantemortem_t as map on map.id = postmortem_t.jenisbencanafk) as x group by x.jenisbencana
        "));

        return $this->respond($data);
    }
    public function getLaporanAntemortem(Request $request)
    {
        $data = \DB::select(DB::raw("
        select x.jenisbencana,sum(case when x.jenisbencanafk is not null then 1 else 0 end) as jumlaham from
        (select map.jenisbencana,formulirantemortem_t.* from formulirantemortem_t join
        mappingjenisbencanatoformulirantemortem_t as map on map.id = formulirantemortem_t.jenisbencanafk) as x group by x.jenisbencana
        "));

        return $this->respond($data);
    }
    public function getLaporanAkhirDvi(Request $request)
    {
        $data = \DB::table('formulirantemortem_t as fa')
            // ->join('mappingjenisbencanatoformulirantemortem_t as map', 'map.id', '=', 'fa.jenisbencanafk')
            ->select('fa.noregistrasi')
            ->where('fa.jenisbencanafk', $request['jenisbencana'])
            ->orderBy('fa.jenisbencanafk')
            ->get();

        $data2 = \DB::table('postmortem_t as pm')
            ->select('pm.labeldvi', 'pm.isteridentifikasi')
            ->where('pm.jenisbencanafk', $request['jenisbencana'])
            ->get();

        $data3 = \DB::table('mappingjenisbencanatoformulirantemortem_t as map')
            ->select('map.jenisbencana')
            ->where('map.id', $request['jenisbencana'])
            ->get();

        $data4 = \DB::table('penerimaanjenazahdvi_t as pjd')
            ->select('pjd.nojenazah', 'pjd.bodybag')
            ->where('pjd.jenisbencanafk', $request['jenisbencana'])
            ->get();

        // return ($data3);
        // die();

        $data10 = [];
        $jumlaham = 0;
        $jumlahpm = 0;
        $jumlahbadanbagian = 0;
        $jumlahbadanutuh = 0;
        $teridentifikasi = 0;
        $jenisbencana = '';


        foreach ($data as $am) {
            $jumlaham = $jumlaham + 1;
        }
        foreach ($data2 as $pm) {
            $jumlahpm = $jumlahpm + 1;
            if ($pm->isteridentifikasi != null) {
                $teridentifikasi = $teridentifikasi + 1;
            }
        }
        foreach ($data3 as $bla) {
            $jenisbencana = $bla->jenisbencana;
        }
        foreach ($data4 as $jen) {
            if ($jen->bodybag == 'Body Part') {
                $jumlahbadanbagian = $jumlahbadanbagian + 1;
            }
            if ($jen->bodybag == 'Body Full') {
                $jumlahbadanutuh = $jumlahbadanutuh + 1;
            }
        }
        $data10[] = array(
            'jumlaham' => $jumlaham,
            'jumlahpm' => $jumlahpm,
            'badanutuh' => $jumlahbadanutuh,
            'badanbagian' => $jumlahbadanbagian,
            'jenisbencana' => $jenisbencana,
            'teridentifikasi' => $teridentifikasi
        );

        return $this->respond($data10);
    }
    public function getLaporanAkhirDvi2(Request $request)
    {
        $jenisbencana = '';
        if (isset($request['jenisbencana']) && $request['jenisbencana'] != "" && $request['jenisbencana'] != "undefined") {
            $jenisbencana = ' where map.id = ' . $request['jenisbencana'];
        }
        $jenisbencanaam = '';
        if (isset($request['jenisbencana']) && $request['jenisbencana'] != "" && $request['jenisbencana'] != "undefined") {
            $jenisbencanaam = ' where map.id = ' . $request['jenisbencana'] . ' or dp.objectjenisbencanafk = ' . $request['jenisbencana'];
        }
        $data = DB::select(DB::raw("
        select x.jenisbencana,sum(case when x.jenisbencanafk is not null then 1 else 0 end) as jumlahpm,sum(case when x.isteridentifikasi is not null then 1 else 0 end) as teridentifikasi from
        (select map.jenisbencana,map.id,postmortem_t.* from postmortem_t join
        mappingjenisbencanatoformulirantemortem_t as map on map.id = postmortem_t.jenisbencanafk $jenisbencana) as x group by x.jenisbencana order by x.jenisbencana
        "));

        $data2 = DB::select(DB::raw("
        select y.jenisbencana, sum(y.jumlaham) as jumlaham from (select case when x.jenisbencana is null then x.jenisbencana2 else x.jenisbencana end as jenisbencana,sum(case when x.jenisbencanafk is not null or x.objectjenisbencanafk is not null then 1 else 0 end) as jumlaham from
        (select map.jenisbencana,map2.jenisbencana as jenisbencana2, map.id,formulirantemortem_t.*, dp.objectjenisbencanafk from formulirantemortem_t left join
        mappingjenisbencanatoformulirantemortem_t as map on map.id = formulirantemortem_t.jenisbencanafk left join
        dvipelapor_t as dp on dp.norec = formulirantemortem_t.dvipelaporfk left join
        mappingjenisbencanatoformulirantemortem_t as map2 on map2.id = dp.objectjenisbencanafk $jenisbencanaam) as x group by x.jenisbencana, x.jenisbencana2) as y group by y.jenisbencana order by y.jenisbencana
        "));

        $data3 = DB::select(DB::raw("
        select x.jenisbencana,sum(case when x.jenisbencanafk is not null and x.bodybag = 'Body Part' then 1 else 0 end) as jumlahbadanbagian,sum(case when x.jenisbencanafk is not null and x.bodybag = 'Body Full' then 1 else 0 end) as jumlahbadanutuh from 
        (select map.jenisbencana,map.id, pjd.* from penerimaanjenazahdvi_t as pjd join
        mappingjenisbencanatoformulirantemortem_t as map on map.id = pjd.jenisbencanafk $jenisbencana) as x group by x.jenisbencana order by x.jenisbencana
        "));

        // $data4 = DB::select(DB::raw("
        // select id, jenisbencana from mappingjenisbencanatoformulirantemortem_t as map $jenisbencana
        // "));

        // $jenisbencana = $data4[0]->jenisbencana;
        $data10 = [];
        $data11 = [];
        $data12 = [];
        $datafix = [];
        $jumlahpm = 0;
        $jumlaham = 0;
        $teridentifikasi2 = 0;
        $badanfull = 0;
        $badanpart = 0;

        foreach ($data as $pm) {
            $jumlahpm = $pm->jumlahpm;
            $teridentifikasi2 = $pm->teridentifikasi;
            $data10[] = array(
                'idjenisbencana' => $pm->jenisbencana,
                'jumlahpm' => $jumlahpm,
                'teridentifikasi' => $teridentifikasi2
            );
        }

        foreach ($data2 as $am) {
            $jumlaham = $am->jumlaham;
            $data11[] = array(
                'idjenisbencana' => $am->jenisbencana,
                'jumlaham' => $jumlaham
            );
        }


        foreach ($data3 as $bb) {
            $badanfull = $bb->jumlahbadanutuh;
            $badanpart = $bb->jumlahbadanbagian;
            $data12[] = array(
                'idjenisbencana' => $bb->jenisbencana,
                'jumlahbadanutuh' => $badanfull,
                'jumlahbadanbagian' => $badanpart
            );
        }

        // else {
        //     $data12[] = array(
        //         'idjenisbencana' => $jenisbencana,
        //         'jumlahbadanutuh' => $badanfull,
        //         'jumlahbadanbagian' => $badanpart
        //     );
        // }
        // return (count($data4) - 1);
        // die();
        for ($i = count($data2) - 1; $i >= 0; $i--) {
            if ($data10[$i]['idjenisbencana'] == $data11[$i]['idjenisbencana'] && $data11[$i]['idjenisbencana'] == $data12[$i]['idjenisbencana']) {
                $data10[$i] = array(
                    'jumlaham' => $data11[$i]['jumlaham'],
                    'jenisbencana' => $data10[$i]['idjenisbencana'],
                    'jumlahpm' => $data10[$i]['jumlahpm'],
                    'teridentifikasi' => $data10[$i]['teridentifikasi'],
                    'jumlahbadanutuh' => $data12[$i]['jumlahbadanutuh'],
                    'jumlahbadanbagian' => $data12[$i]['jumlahbadanbagian']
                );
            }
        }

        return $this->respond($data10);
    }
    public function getLaporanDviDetail(Request $request)
    {
        if ($request['setParam'] == 1) {
            $data = \DB::table('formulirantemortem_t as fa')
                ->leftjoin('mappingjenisbencanatoformulirantemortem_t as map', 'map.id', '=', 'fa.jenisbencanafk')
                ->leftjoin('dvipelapor_t as dp', 'dp.norec', '=', 'fa.dvipelaporfk')
                ->leftjoin('mappingjenisbencanatoformulirantemortem_t as map2', 'map2.id', '=', 'dp.objectjenisbencanafk')
                ->leftjoin('identitasdvi_t as idd', 'idd.id', '=', 'fa.sumbersidikjari')
                ->leftjoin('identitasdvi_t as idd2', 'idd2.id', '=', 'fa.sumbergigi')
                ->leftjoin('identitasdvi_t as idd3', 'idd3.id', '=', 'fa.sumberdna')
                ->select(DB::raw("case when fa.namapelapor is null then dp.namapelapor else fa.namapelapor end as namapelapor, case when fa.namadilaporkan is null then dp.namakorban else fa.namadilaporkan end as namadilaporkan,
                                fa.noregistrasi, case when fa.alamat is null then dp.domisilikorban else fa.alamat end as alamat, idd.sumber as sumbersidikjari, idd2.sumber as sumbergigi, idd3.sumber as sumberdna,
                                case when fa.jenisbencanafk is null then map2.jenisbencana else map.jenisbencana end as jenisbencana"));
            // if (isset($request['jenisbencana']) && $request['jenisbencana'] != "" && $request['jenisbencana'] != "undefined") {
            //     $data = $data->where('map.jenisbencana', '=', $request['jenisbencana']);
            // }
            if (isset($request['jenisbencana']) && $request['jenisbencana'] != "" && $request['jenisbencana'] != "undefined") {
                $data = $data->Where(function ($data) use ($request) {
                    $data->where('map.jenisbencana', '=', $request['jenisbencana'])
                        ->orWhere('map2.jenisbencana', '=', $request['jenisbencana']);
                });
            }
            $data = $data->get();
        } else if ($request['setParam'] == 2) {
            $data = \DB::table('postmortem_t as pm')
                ->join('mappingjenisbencanatoformulirantemortem_t as map', 'map.id', '=', 'pm.jenisbencanafk')
                ->select('pm.*', 'map.jenisbencana');
            if (isset($request['jenisbencana']) && $request['jenisbencana'] != "" && $request['jenisbencana'] != "undefined") {
                $data = $data->where('map.jenisbencana', '=', $request['jenisbencana']);
            }
            $data = $data->get();
        } else if ($request['setParam'] == 3) {
            $data = \DB::table('identifikasijenazah_t as ij')
                ->join('formulirantemortem_t as fa', 'fa.noregistrasi', '=', 'ij.noregistrasiantemortem')
                ->join('postmortem_t as p', 'p.labeldvi', '=', 'ij.labeldvipostmortem')
                ->join('identitasdvi_t as idt', 'idt.id', '=', 'fa.sumbersidikjari')
                ->join('identitasdvi_t as idt2', 'idt2.id', '=', 'fa.sumbergigi')
                ->join('identitasdvi_t as idt3', 'idt3.id', '=', 'fa.sumberdna')
                ->join('mappingjenisbencanatoformulirantemortem_t as map', 'map.id', '=', 'ij.jenisbencanafk')
                ->leftjoin('dvipelapor_t as dp', 'dp.norec', '=', 'fa.dvipelaporfk')
                ->select(
                    'fa.noregistrasi',
                    // 'fa.namadilaporkan',
                    'idt.sumber as sumbersidikjari',
                    'idt2.sumber as sumbergigi',
                    'idt3.sumber as sumberdna',
                    'fa.uraiansidikjari',
                    'fa.keterangansidikjari',
                    'fa.uraiangigi',
                    'fa.keterangangigi',
                    'fa.uraiandna',
                    'fa.keterangandna',
                    'fa.ciricirifisik',
                    'fa.keteranganfisik',
                    'fa.barangkepemilikan',
                    'fa.keteranganbarang',
                    'p.labeldvi',
                    'p.cirikhusus',
                    'p.barangbukti',
                    'p.dna',
                    'p.gigi',
                    'p.keterangan as keteranganpostmortem',
                    'p.sidikjari',
                    'p.tglperiksa',
                    'ij.keterangan as keteranganteridentifikasi',
                    'ij.tglteridentifikasi',
                    'map.jenisbencana',
                    'p.norec as postmortemfk',
                    DB::raw(
                        "case when fa.namadilaporkan is null then dp.namakorban else fa.namadilaporkan end as namadilaporkan"
                    )
                );
            if (isset($request['jenisbencana']) && $request['jenisbencana'] != "" && $request['jenisbencana'] != "undefined") {
                $data = $data->where('ij.jenisbencanafk', '=', $request['jenisbencana']);
            };
            $data = $data->get();
        }
        $result = array(
            'data' => $data,
            'message' => 'Snaps',
        );
        return $this->respond($result);
    }
    public function getVerifikasiKeluarga(Request $request)
    {
        $data = \DB::table('dvipelapor_t as dp')
            ->leftjoin('hubungankeluarga_m as hk', 'hk.id', '=', 'dp.objecthubunganfk')
            ->join('jeniskelamin_m as jk', 'jk.id', '=', 'dp.objectjeniskelaminfk')
            ->leftjoin('suku_m as su', 'su.id', '=', 'dp.objectsukufk')
            ->join('kebangsaan_m as keb', 'keb.id', '=', 'dp.objectkebangsaanfk')
            ->select(
                'dp.norec',
                'dp.nootp',
                'dp.namapelapor',
                'dp.domisili',
                'hk.hubungankeluarga',
                'dp.email',
                'dp.nohp',
                'dp.namakorban',
                'dp.namaalias',
                'dp.tgllahir',
                'jk.jeniskelamin',
                'su.suku',
                'keb.name',
                'dp.domisilikorban',
                'dp.tglinput',
                'dp.uploadfile as gambar',
                'dp.email',
                DB::raw('case when dp.statusenabled = 0 and dp.isverifikasibencana is null then \'Belum di Verifikasi\' else dp.nootp end as status')
            );
        if (isset($request['jenisbencana']) && $request['jenisbencana'] != "" && $request['jenisbencana'] != "undefined") {
            $data = $data->where('dp.objectjenisbencanafk', '=', $request['jenisbencana']);
        }
        if (isset($request['namakorban']) && $request['namakorban'] != "" && $request['namakorban'] != "undefined") {
            $data = $data->where('dp.namakorban', 'like', '%' . $request['namakorban'] . '%');
        }
        if (isset($request['isNotVerif']) && $request['isNotVerif'] != "" && $request['isNotVerif'] != "undefined" && $request['isNotVerif'] == true) {
            $data = $data->where('dp.statusenabled', false)
                ->whereNull('dp.isverifikasibencana');
        }
        $data = $data->get();

        return $this->respond($data);
    }
    public function saveVerifikasiKeluargaKorban(Request $request)
    {
        $dataLogin = $request->all();
        DB::beginTransaction();
        try {
            $updatePV = DviPelapor::where('norec', $request['norec'])
                ->update([
                    'statusenabled' => true,
                    'objectjenisbencanafk' => $request['jenisbencana']
                ]);
            $transMessage = "Sukses !";

            $transStatus = 'true';

            if ($transStatus == 'true') {
                $newLog = LoggingUser::max('id');
                $newLog = $newLog + 1;
                $logUser = new LoggingUser();
                $logUser->id = $newLog;
                $logUser->norec = $logUser->generateNewId();
                $logUser->kdprofile = 0;
                $logUser->statusenabled = true;
                $logUser->jenislog = 'Verifikasi DVI';
                $logUser->noreff = $request['norec'];
                $logUser->referensi = 'norec dvi pelapor';
                $logUser->keterangan = 'Verifikasi Keluarga Korban DVI : ' . $request['norec'];
                $logUser->objectloginuserfk = $dataLogin['userData']['id'];
                $logUser->tanggal = $this->getDateTime()->format('Y-m-d H:i:s');
                $logUser->save();
            };
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {

            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Gagal !";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveVerifikasiJenisBencana(Request $request)
    {
        DB::beginTransaction();
        try {
            $updateMap = MappingJenisBencanaToFormulirAntemortem::where('id', $request['id'])
                ->update([
                    'isverifikasi' => true,
                    'tglditutup' => $this->getDateTime()->format('Y-m-d H:i:s')
                ]);
            $updatePelapor = DviPelapor::where('objectjenisbencanafk', $request['id'])
                ->update([
                    'statusenabled' => false,
                    'isverifikasibencana' => true,
                ]);
            $transMessage = "Sukses !";

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {

            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Gagal !";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveBatalVerifikasiJenisBencana(Request $request)
    {
        DB::beginTransaction();
        try {
            $updateMap = MappingJenisBencanaToFormulirAntemortem::where('id', $request['id'])
                ->update([
                    'isverifikasi' => null,
                    'tglditutup' => null,
                ]);
            $updatePelapor = DviPelapor::where('objectjenisbencanafk', $request['id'])
                ->update([
                    'statusenabled' => true,
                    'isverifikasibencana' => null,
                ]);
            $transMessage = "Sukses !";

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {

            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Gagal !";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDataIdentifikasiAntemortem(Request $request)
    {
        $data = \DB::table('formulirantemortem_t as fa')
            ->leftjoin('dvipelapor_t as dp', 'dp.norec', '=', 'fa.dvipelaporfk')
            ->join('identitasdvi_t as idd', 'idd.id', '=', 'fa.sumbersidikjari')
            ->join('identitasdvi_t as idd2', 'idd2.id', '=', 'fa.sumbergigi')
            ->join('identitasdvi_t as idd3', 'idd3.id', '=', 'fa.sumberdna')
            ->select(DB::raw("case when fa.namadilaporkan is null then dp.namakorban else fa.namadilaporkan end as namadilaporkan, idd.sumber as sumbersidikjari, idd2.sumber as sumbergigi, idd3.sumber as sumberdna, fa.uraiansidikjari,
            fa.keterangansidikjari, fa.uraiangigi, fa.keterangangigi, fa.uraiandna, fa.keterangandna, fa.ciricirifisik, fa.keteranganfisik, fa.barangkepemilikan, fa.keteranganbarang"))
            ->where('fa.noregistrasi', $request['noregistrasi'])
            ->get();

        return $this->respond($data);
    }
    public function getDataIdentifikasiPostmortem(Request $request)
    {
        $data = \DB::table('postmortem_t as pm')
            ->select('pm.cirikhusus', 'pm.barangbukti', 'pm.keterangan')
            ->where('pm.norec', $request['norec'])
            ->get();

        return $this->respond($data);
    }
    public function getLihatPostmortem(Request $request)
    {
        $data = \DB::table('postmortem_t as pm')
            ->join('mappingjenisbencanatoformulirantemortem_t as map', 'map.id', '=', 'pm.jenisbencanafk')
            ->join('jeniskelamin_m as jk', 'jk.id', '=', 'pm.jeniskelaminfk')
            // ->join('pegawai_m as pg', 'pg.id', '=', 'pm.dokterfk')
            ->join('golongandarah_m as glg', 'glg.id', '=', 'pm.golongandarahfk')
            ->select('pm.*', 'map.id', 'map.jenisbencana', 'jk.id', 'jk.jeniskelamin', 'glg.id', 'glg.golongandarah')
            ->where('pm.labeldvi', $request['label'])
            ->get();

        $fotogigi = \DB::table('postmortem_t as pm')
            ->leftjoin('fotopostmortem_t as fpm', 'fpm.postmortemfk', '=', 'pm.norec')
            ->select('fpm.norec as norec_foto', 'fpm.foto')
            ->where('pm.labeldvi', $request['label'])
            ->where('fpm.jenisgambar', 'gigi')
            ->get();

        $fotodna = \DB::table('postmortem_t as pm')
            ->leftjoin('fotopostmortem_t as fpm', 'fpm.postmortemfk', '=', 'pm.norec')
            ->select('fpm.norec as norec_foto', 'fpm.foto')
            ->where('pm.labeldvi', $request['label'])
            ->where('fpm.jenisgambar', 'dna')
            ->get();

        $fotosidikjari = \DB::table('postmortem_t as pm')
            ->leftjoin('fotopostmortem_t as fpm', 'fpm.postmortemfk', '=', 'pm.norec')
            ->select('fpm.norec as norec_foto', 'fpm.foto')
            ->where('pm.labeldvi', $request['label'])
            ->where('fpm.jenisgambar', 'sidikjari')
            ->get();

        $fotolampiran = \DB::table('postmortem_t as pm')
            ->leftjoin('fotopostmortem_t as fpm', 'fpm.postmortemfk', '=', 'pm.norec')
            ->select('fpm.norec as norec_foto', 'fpm.foto')
            ->where('pm.labeldvi', $request['label'])
            ->where('fpm.jenisgambar', 'lampiran')
            ->get();

        $result = array(
            'datapostmortem' => $data,
            'fotogigi' => $fotogigi,
            'fotodna' => $fotodna,
            'fotosidikjari' => $fotosidikjari,
            'fotolampiran' => $fotolampiran
        );

        return $this->respond($result);
    }
    public function deleteFotoPostmortem(Request $request)
    {
        DB::beginTransaction();
        try {
            $pm = FotoPostmortem::where('norec', $request['norec'])->delete();
            $transMessage = "Hapus Foto Sukses !";

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {

            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Gagal !";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function editPostmortem(Request $request)
    {
        $foto = $request['foto'];
        $foto2 = $request['foto2'];
        $foto3 = $request['foto3'];
        $foto4 = $request['foto4'];
        $postmortemfk = $request['norec'];
        DB::beginTransaction();
        try {
            $pm = Postmortem::where('norec', $request['norec'])
                ->update([
                    'labeldvi' => $request['labeldvi'],
                    'tglperiksa' => $request['tglperiksa'],
                    'jeniskelaminfk' => $request['jeniskelaminfk'],
                    'perkiraanusia' => $request['perkiraanusia'],
                    'perkiraantinggibadan' => $request['perkiraantinggibadan'],
                    'cirikhusus' => $request['cirikhusus'],
                    'barangbukti' => $request['barangbukti'],
                    'pemeriksaandna' => $request['pemeriksaandna'],
                    'uraiandna' => $request['uraiandna'],
                    'keterangandna' => $request['keterangandna'],
                    // 'dna' => $request['dna'],
                    'golongandarahfk' => $request['golongandarahfk'],
                    'pemeriksaaninafis' => $request['pemeriksaaninavis'],
                    'uraianinavis' => $request['uraianinavis'],
                    'keteranganinavis' => $request['keteranganinavis'],
                    // 'inavis' => $request['inavis'],
                    'tim' => $request['tim'],
                    'dokter' => $request['dokter'],
                    'dokter2' => $request['dokter2'],
                    'dokter3' => $request['dokter3'],
                    'dokter4' => $request['dokter4'],
                    'dokter5' => $request['dokter5'],
                    'labeltkp' => $request['labeltkp'],
                    // 'gigi' => $request['gigi'],
                    'pemeriksaangigi' => $request['pemeriksaangigi'],
                    'uraiangigi' => $request['uraiangigi'],
                    'keterangangigi' => $request['keterangangigi'],
                    'odontologi' => $request['odontologi'],
                    'hasillab' => $request['hasillab'],
                    'keterangan' => $request['keterangan'],
                    'jenisbencanafk' => $request['idjenisbencanafk'],
                    'sidikjari' => $request['sidikjari']
                ]);
            foreach ($foto as $f) {

                $fpm = new FotoPostmortem();
                $fpm->norec = $fpm->generateNewId();
                $fpm->statusenabled = true;
                $fpm->postmortemfk = $postmortemfk;
                $fpm->jenisgambar = $f['jenisgambar'];
                $fpm->foto = $f['foto'];
                $fpm->save();
            }
            foreach ($foto2 as $f2) {
                $fpm = new FotoPostmortem();
                $fpm->norec = $fpm->generateNewId();
                $fpm->statusenabled = true;
                $fpm->postmortemfk = $postmortemfk;
                $fpm->jenisgambar = $f2['jenisgambar'];
                $fpm->foto = $f2['foto'];
                $fpm->save();
            }
            foreach ($foto3 as $f3) {
                $fpm = new FotoPostmortem();
                $fpm->norec = $fpm->generateNewId();
                $fpm->statusenabled = true;
                $fpm->postmortemfk = $postmortemfk;
                $fpm->jenisgambar = $f3['jenisgambar'];
                $fpm->foto = $f3['foto'];
                $fpm->save();
            }
            foreach ($foto4 as $f4) {
                $fpm = new FotoPostmortem();
                $fpm->norec = $fpm->generateNewId();
                $fpm->statusenabled = true;
                $fpm->postmortemfk = $postmortemfk;
                $fpm->jenisgambar = $f4['jenisgambar'];
                $fpm->foto = $f4['foto'];
                $fpm->save();
            }
            $transMessage = "Edit Data Sukses !";

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {

            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Gagal !";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDataEditAntemortem(Request $request)
    { //
        $data = \DB::table('formulirantemortem_t as fa')
            ->leftjoin('dvipelapor_t as dp', 'dp.norec', '=', 'fa.dvipelaporfk')
            ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'fa.jeniskelaminfk')
            ->leftjoin('jeniskelamin_m as jk2', 'jk2.id', '=', 'dp.objectjeniskelaminfk')
            ->leftjoin('hubungankeluarga_m as hk', 'hk.id', '=', 'fa.hubungankeluargafk')
            ->leftjoin('hubungankeluarga_m as hk2', 'hk2.id', '=', 'dp.objecthubunganfk')
            ->leftjoin('suku_m as su', 'su.id', '=', 'fa.suku')
            ->leftjoin('suku_m as su2', 'su2.id', '=', 'dp.objectsukufk')
            ->leftjoin('identitasdvi_t as idd', 'idd.id', '=', 'fa.sumbersidikjari')
            ->leftjoin('identitasdvi_t as idd2', 'idd2.id', '=', 'fa.sumbergigi')
            ->leftjoin('identitasdvi_t as idd3', 'idd3.id', '=', 'fa.sumberdna')
            ->leftjoin('fotoantemortem_t as fot', 'fot.formulirantemortemfk', '=', 'fa.noregistrasi')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'fa.objectpetugaswawancarafk')
            ->leftjoin('pegawai_m as pg2', 'pg2.id', '=', 'fa.objectpenginputfk')
            ->select(DB::raw("case when fa.namapelapor is null then dp.namapelapor else fa.namapelapor end as namapelapor, case when fa.namadilaporkan is null then dp.namakorban else fa.namadilaporkan end as namadilaporkan,
                    case when fa.namapanggilan is null then dp.namaalias else fa.namapanggilan end as namapanggilan, case when fa.jeniskelaminfk is null then jk2.jeniskelamin else jk.jeniskelamin end as jeniskelamin,
                    case when fa.tgllahir is null then dp.tgllahir else fa.tgllahir end as tgllahir, case when fa.alamat is null then dp.domisilikorban else fa.alamat end as alamat, case when fa.jeniskelaminfk is null then dp.objectjeniskelaminfk else fa.jeniskelaminfk end as jeniskelaminfk,
                    case when fa.hubungankeluargafk is null then dp.objecthubunganfk else fa.hubungankeluargafk end as hubungankeluargafk, case when fa.hubungankeluargafk is null then hk2.hubungankeluarga else hk.hubungankeluarga end as hubungankeluarga,
                    case when fa.objectkebangsaanfk is null then dp.objectkebangsaanfk else fa.objectkebangsaanfk end as objectkebangsaanfk, case when fa.suku is null then dp.objectsukufk else fa.suku end as sukufk, case when fa.suku is null then su2.suku else su.suku end as suku,
                    case when fa.notelepon is null then dp.nohp else fa.notelepon end as notelepon, case when fa.alamat is null then dp.domisilikorban else fa.alamat end as alamat, fa.sumbersidikjari as sumbersidikjarifk, idd.sumber as sumbersidikjari, fa.sumbergigi as sumbergigifk, idd2.sumber as sumbergigi,
                    fa.sumberdna as sumberdnafk, idd3.sumber as sumberdna, fa.uraiansidikjari, fa.keterangansidikjari, fa.uraiangigi, fa.keterangangigi, fa.uraiandna, fa.keterangandna, fa.ciricirifisik, fa.keteranganfisik, fa.barangkepemilikan, fa.keteranganbarang, fot.foto, fot.norec as norec_foto, fa.noregistrasi, fa.dvipelaporfk"), 'pg.namalengkap as petugaswawancara', 'pg.id as idpetugaswawancara', 'pg2.namalengkap as penginput', 'pg2.id as idpenginput', 'fa.notelppetugaswawancara', 'fa.tglwawancara', 'fa.notelppenginput', 'fa.objectpetugaswawancarafk', 'fa.petugaswawancaraluar')
            ->where('fa.noregistrasi', $request['noregistrasi'])
            ->get();

        $fotoSidikJari = \DB::table('fotoantemortem_t as fa')
            ->select('fa.norec', 'fa.foto')
            ->where('fa.objectidentitasdvifk', 1)
            ->where('fa.formulirantemortemfk', $request['noregistrasi'])
            ->get();

        $fotoGigi = \DB::table('fotoantemortem_t as fa')
            ->select('fa.norec', 'fa.foto')
            ->where('fa.objectidentitasdvifk', 2)
            ->where('fa.formulirantemortemfk', $request['noregistrasi'])
            ->get();

        $fotoDna = \DB::table('fotoantemortem_t as fa')
            ->select('fa.norec', 'fa.foto')
            ->where('fa.objectidentitasdvifk', 3)
            ->where('fa.formulirantemortemfk', $request['noregistrasi'])
            ->get();

        $fotoLampiran = \DB::table('fotoantemortem_t as fa')
            ->select('fa.norec', 'fa.foto')
            ->whereNull('fa.objectidentitasdvifk')
            ->where('fa.formulirantemortemfk', $request['noregistrasi'])
            ->get();

        $fotoCiriCiriFisik = \DB::table('fotoantemortem_t as fa')
            ->select('fa.norec', 'fa.foto')
            ->where('fa.objectidentitasdvifk', 4)
            ->where('fa.formulirantemortemfk', $request['noregistrasi'])
            ->get();

        $fotoBarangKepemilikan = \DB::table('fotoantemortem_t as fa')
            ->select('fa.norec', 'fa.foto')
            ->where('fa.objectidentitasdvifk', 5)
            ->where('fa.formulirantemortemfk', $request['noregistrasi'])
            ->get();

        $result = array(
            'dataAntemortem' => $data,
            'fotoSidikJari' => $fotoSidikJari,
            'fotoGigi' => $fotoGigi,
            'fotoDna' => $fotoDna,
            'fotoLampiran' => $fotoLampiran,
            'fotoCiriFisik' => $fotoCiriCiriFisik,
            'fotoBarangKepemilikan' => $fotoBarangKepemilikan
        );

        return $this->respond($result);
    }
    public function deleteFotoAntemortem(Request $request)
    {
        DB::beginTransaction();
        try {
            $am = FotoAntemortem::where('norec', $request['norec'])->delete();
            $transMessage = "Hapus Foto Sukses !";

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {

            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Gagal !";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveEditAntemortem(Request $request)
    {
        $foto = $request['foto'];
        $foto2 = $request['foto2'];
        $foto3 = $request['foto3'];
        $foto4 = $request['foto4'];
        $foto5 = $request['foto5'];
        $foto6 = $request['foto6'];
        DB::beginTransaction();
        // return ($request['foto']);
        // die();
        // try {
        if ($request['dvipelaporfk'] == null) {
            FormulirAntemortem::where('noregistrasi', $request['noregistrasi'])
                ->update([
                    'namapelapor' => $request['namapelapor'],
                    'namadilaporkan' => $request['namadilaporkan'],
                    'namapanggilan' => $request['namapanggilan'],
                    'jeniskelaminfk' => $request['jeniskelamin'],
                    'hubungankeluargafk' => $request['hubungankeluarga'],
                    'tgllahir' => $request['tanggallahir'],
                    'suku' => $request['suku'],
                    'notelepon' => $request['notelepon'],
                    'usia' => $request['umur'],
                    'alamat' => $request['alamat'],
                    'objectkebangsaanfk' => $request['kebangsaan'],
                ]);
        } else {
            DviPelapor::where('norec', $request['dvipelaporfk'])
                ->update([
                    'namapelapor' => $request['namapelapor'],
                    'objecthubunganfk' => $request['hubungankeluarga'],
                    'nohp' => $request['notelepon'],
                    'namakorban' => $request['namadilaporkan'],
                    'namaalias' => $request['namapanggilan'],
                    'tgllahir' => $request['tanggallahir'],
                    'objectjeniskelaminfk' => $request['jeniskelamin'],
                    'objectsukufk' => $request['suku'],
                    'objectkebangsaanfk' => $request['kebangsaan'],
                ]);
        }
        FormulirAntemortem::where('noregistrasi', $request['noregistrasi'])
            ->update([
                'sumbersidikjari' => $request['sumbersidikjari'],
                'uraiansidikjari' => $request['uraiansidikjari'],
                'keterangansidikjari' => $request['keterangansidikjari'],
                'sumbergigi' => $request['sumbergigi'],
                'uraiangigi' => $request['uraiangigi'],
                'keterangangigi' => $request['keterangangigi'],
                'sumberdna' => $request['sumberdna'],
                'uraiandna' => $request['uraiandna'],
                'keterangandna' => $request['keterangandna'],
                'ciricirifisik' => $request['ciricirifisik'],
                'keteranganfisik' => $request['keteranganfisik'],
                'barangkepemilikan' => $request['barangkepemilikan'],
                'keteranganbarang' => $request['keteranganbarang'],
                'objectpetugaswawancarafk' => $request['petugaswawancara'],
                'notelppetugaswawancara' => $request['notelpwawancara'],
                'tglwawancara' => $request['tglwawancara'],
                'objectpenginputfk' => $request['petugasinput'],
                'notelppenginput' => $request['notelpinput'],
                'petugaswawancaraluar' => $request['petugaswawancaraluar']
            ]);
        foreach ($foto as $f) {
            $fotoAM = new FotoAntemortem();
            $fotoAM->norec = $fotoAM->generateNewId();
            $fotoAM->statusenabled = true;
            $fotoAM->formulirantemortemfk = $request['noregistrasi'];
            $fotoAM->foto = $f['foto'];
            $fotoAM->objectidentitasdvifk = $f['id'];
            $fotoAM->save();
        }
        foreach ($foto2 as $f2) {
            $fotoAM = new FotoAntemortem();
            $fotoAM->norec = $fotoAM->generateNewId();
            $fotoAM->statusenabled = true;
            $fotoAM->formulirantemortemfk = $request['noregistrasi'];
            $fotoAM->foto = $f2['foto'];
            $fotoAM->objectidentitasdvifk = $f2['id'];
            $fotoAM->save();
        }
        foreach ($foto3 as $f3) {
            $fotoAM = new FotoAntemortem();
            $fotoAM->norec = $fotoAM->generateNewId();
            $fotoAM->statusenabled = true;
            $fotoAM->formulirantemortemfk = $request['noregistrasi'];
            $fotoAM->foto = $f3['foto'];
            $fotoAM->objectidentitasdvifk = $f3['id'];
            $fotoAM->save();
        }
        foreach ($foto4 as $f4) {
            $fotoAM = new FotoAntemortem();
            $fotoAM->norec = $fotoAM->generateNewId();
            $fotoAM->statusenabled = true;
            $fotoAM->formulirantemortemfk = $request['noregistrasi'];
            $fotoAM->foto = $f4['foto'];
            $fotoAM->objectidentitasdvifk = $f4['id'];
            $fotoAM->save();
        }
        foreach ($foto5 as $f5) {
            $fotoAM = new FotoAntemortem();
            $fotoAM->norec = $fotoAM->generateNewId();
            $fotoAM->statusenabled = true;
            $fotoAM->formulirantemortemfk = $request['noregistrasi'];
            $fotoAM->foto = $f5['foto'];
            $fotoAM->objectidentitasdvifk = $f5['id'];
            $fotoAM->save();
        }
        foreach ($foto6 as $f6) {
            $fotoAM = new FotoAntemortem();
            $fotoAM->norec = $fotoAM->generateNewId();
            $fotoAM->statusenabled = true;
            $fotoAM->formulirantemortemfk = $request['noregistrasi'];
            $fotoAM->foto = $f6['foto'];
            $fotoAM->objectidentitasdvifk = $f6['id'];
            $fotoAM->save();
        }
        $transMessage = "Edit Sukses !";

        $transStatus = 'true';
        // } catch (\Exception $e) {
        //     $transStatus = 'false';
        // }

        if ($transStatus == 'true') {

            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Gagal !";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getLaporanPenerimaanJenazahDvi(Request $request)
    {
        $data = \DB::table('penerimaanjenazahdvi_t as pjd')
            ->join('mappingjenisbencanatoformulirantemortem_t as jb', 'jb.id', '=', 'pjd.jenisbencanafk')
            ->select('pjd.nojenazah', 'pjd.bodybag', 'pjd.nobodybag', 'pjd.keterangan', 'jb.jenisbencana', 'pjd.tglterima');
        if (isset($request['jenisbencana']) && $request['jenisbencana'] != "" && $request['jenisbencana'] != "undefined") {
            $data = $data->where('pjd.jenisbencanafk', '=', $request['jenisbencana']);
        };
        $data = $data->get();

        return $this->respond($data);
    }
    public function getLaporanTeridentifikasiJenazah(Request $request)
    {
        $data = \DB::table('identifikasijenazah_t as ij')
            ->join('formulirantemortem_t as fa', 'fa.noregistrasi', '=', 'ij.noregistrasiantemortem')
            ->join('postmortem_t as p', 'p.labeldvi', '=', 'ij.labeldvipostmortem')
            ->join('identitasdvi_t as idt', 'idt.id', '=', 'fa.sumbersidikjari')
            ->join('identitasdvi_t as idt2', 'idt2.id', '=', 'fa.sumbergigi')
            ->join('identitasdvi_t as idt3', 'idt3.id', '=', 'fa.sumberdna')
            ->join('mappingjenisbencanatoformulirantemortem_t as map', 'map.id', '=', 'ij.jenisbencanafk')
            ->leftjoin('dvipelapor_t as dp', 'dp.norec', '=', 'fa.dvipelaporfk')
            ->leftjoin('hubungankeluarga_m as hk', 'hk.id', '=', 'dp.objecthubunganfk')
            ->leftjoin('hubungankeluarga_m as hk2', 'hk2.id', '=', 'fa.hubungankeluargafk')
            ->select(
                'fa.noregistrasi',
                'fa.namadilaporkan',
                'fa.tgllahir',
                'fa.namapelapor',
                'fa.notelepon',
                'fa.alamat',
                'map.id as idjenisbencana',
                'idt.sumber as sumbersidikjari',
                'idt2.sumber as sumbergigi',
                'idt3.sumber as sumberdna',
                'fa.uraiansidikjari',
                'fa.keterangansidikjari',
                'fa.uraiangigi',
                'fa.keterangangigi',
                'fa.uraiandna',
                'fa.keterangandna',
                'fa.ciricirifisik',
                'fa.keteranganfisik',
                'fa.barangkepemilikan',
                'fa.keteranganbarang',
                'p.labeldvi',
                'p.cirikhusus',
                'p.barangbukti',
                'p.dna',
                'p.gigi',
                'p.keterangan as keteranganpostmortem',
                'p.sidikjari',
                'p.tglperiksa',
                'ij.keterangan as keteranganteridentifikasi',
                'ij.tglteridentifikasi',
                'map.jenisbencana',
                'p.norec as postmortemfk',
                DB::raw('case when fa.namadilaporkan is null then dp.namakorban else fa.namadilaporkan end as namadilaporkan, case when fa.tgllahir is null then dp.tgllahir else fa.tgllahir end as tgllahir,
                        case when fa.namapelapor is null then dp.namapelapor else fa.namapelapor end as namapelapor, case when fa.notelepon is null then dp.nohp else fa.notelepon end as notelepon,
                        case when fa.alamat is null then dp.domisilikorban else fa.alamat end as alamat, case when fa.hubungankeluargafk is null then dp.objecthubunganfk else fa.hubungankeluargafk end as idhubungankeluarga,
                        case when fa.hubungankeluargafk is null then hk.hubungankeluarga else hk2.hubungankeluarga end as hubungankeluarga')
            );
        if (isset($request['jenisbencana']) && $request['jenisbencana'] != "" && $request['jenisbencana'] != "undefined") {
            $data = $data->where('ij.jenisbencanafk', '=', $request['jenisbencana']);
        };
        $data = $data->get();

        return $this->respond($data);
    }
    public function getFotoAntemortemNew(Request $request)
    {
        $fotoSidikJari = \DB::table('fotoantemortem_t as fa')
            ->select('fa.foto')
            ->where('fa.formulirantemortemfk', $request['noregistrasi'])
            ->where('objectidentitasdvifk', 1)
            ->get();

        $fotoGigi = \DB::table('fotoantemortem_t as fa')
            ->select('fa.foto')
            ->where('fa.formulirantemortemfk', $request['noregistrasi'])
            ->where('objectidentitasdvifk', 2)
            ->get();

        $fotoDna = \DB::table('fotoantemortem_t as fa')
            ->select('fa.foto')
            ->where('fa.formulirantemortemfk', $request['noregistrasi'])
            ->where('objectidentitasdvifk', 3)
            ->get();

        $fotoLampiran = \DB::table('fotoantemortem_t as fa')
            ->select('fa.foto')
            ->where('fa.formulirantemortemfk', $request['noregistrasi'])
            ->whereNull('objectidentitasdvifk')
            ->get();

        $result = array(
            'fotoSidikJari' => $fotoSidikJari,
            'fotoGigi' => $fotoGigi,
            'fotoDna' => $fotoDna,
            'fotoLampiran' => $fotoLampiran,
        );
        return $this->respond($result);
    }
    public function getFotoPostmortemNew(Request $request)
    {
        $fotoSidikJari = \DB::table('fotopostmortem_t as fp')
            ->select('fp.foto')
            ->where('fp.postmortemfk', $request['postmortemfk'])
            ->where('fp.jenisgambar', 'sidikjari')
            ->get();

        $fotoGigi = \DB::table('fotopostmortem_t as fp')
            ->select('fp.foto')
            ->where('fp.postmortemfk', $request['postmortemfk'])
            ->where('fp.jenisgambar', 'gigi')
            ->get();

        $fotoDna = \DB::table('fotopostmortem_t as fp')
            ->select('fp.foto')
            ->where('fp.postmortemfk', $request['postmortemfk'])
            ->where('fp.jenisgambar', 'dna')
            ->get();

        $fotoLampiran = \DB::table('fotopostmortem_t as fp')
            ->select('fp.foto')
            ->where('fp.postmortemfk', $request['postmortemfk'])
            ->where('fp.jenisgambar', 'lampiran')
            ->get();

        $result = array(
            'fotoSidikJari' => $fotoSidikJari,
            'fotoGigi' => $fotoGigi,
            'fotoDna' => $fotoDna,
            'fotoLampiran' => $fotoLampiran
        );
        return $this->respond($result);
    }
    public function saveReleaseDvi(Request $request)
    {
        DB::beginTransaction();
        try {
            $dataRD = new ReleaseDvi();
            $dataRD->norec = $dataRD->generateNewId();
            $dataRD->tglteridentifikasi = $request['tglteridentifikasi'];
            $dataRD->tglrelease = $request['tglrelease'];
            $dataRD->noregistrasiantemortem = $request['noantemortem'];
            $dataRD->nama = $request['nama'];
            $dataRD->binbinti = $request['binbinti'];
            $dataRD->tgllahir = $request['tgllahir'];
            $dataRD->namakeluarga = $request['keluarga'];
            $dataRD->hubungankeluarga = $request['hubungan'];
            $dataRD->notelepon = $request['telepon'];
            $dataRD->tujuan = $request['tujuan'];
            $dataRD->keterangan = $request['keterangan'];
            $dataRD->objectjenisbencanafk = $request['jenisbencana'];
            $dataRD->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = 'Simpan Gagal';
        }

        if ($transStatus == 'true') {
            $transMessage = 'Simpan Berhasil !';
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'hehe',
            );
        } else {
            $transMessage = "Simpan Gagal !";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "as" => 'hehe',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function cekSudahRelease(Request $request)
    {
        $data = \DB::table('releasedvi_t as rd')
            ->select('rd.noregistrasiantemortem')
            ->where('rd.noregistrasiantemortem', $request['noregistrasi'])
            ->get();

        return $this->respond($data);
    }
    public function getReleaseDvi(Request $request)
    {
        $data = \DB::table('releasedvi_t as rd')
            ->join('hubungankeluarga_m as hk', 'hk.id', '=', 'rd.hubungankeluarga')
            ->join('mappingjenisbencanatoformulirantemortem_t as map', 'map.id', '=', 'rd.objectjenisbencanafk')
            ->select(
                'rd.tglteridentifikasi',
                // 'rd.tglrelease',
                'rd.noregistrasiantemortem',
                'rd.tgllahir',
                'rd.notelepon',
                'rd.tujuan',
                'rd.keterangan',
                'map.jenisbencana',
                DB::raw("case when rd.binbinti is not null then rd.nama + ' ' + rd.binbinti else rd.nama end as namabin, case when rd.hubungankeluarga is not null then rd.namakeluarga + ' ' + hk.hubungankeluarga else '' end as keluarga,
                case when rd.tglrelease != '1900-01-01 00:00:00.000' then convert(varchar, rd.tglrelease, 105) else 'Tidak Input Tanggal Release' end as tglrelease")
            );
        if (isset($request['jenisbencana']) && $request['jenisbencana'] != "" && $request['jenisbencana'] != "undefined") {
            $data = $data->where('rd.objectjenisbencanafk', '=', $request['jenisbencana']);
        };
        $data = $data->get();

        return $this->respond($data);
    }
    public function saveForensikNew(Request $request)
    {
        DB::beginTransaction();
        try {
            if ($request['norec'] == "") {
                $dataPDF = new PemeriksaanDokterForensik();
                $dataPDF->norec = $dataPDF->generateNewId();
                $dataPDF->kdprofile = 0;
                $dataPDF->statusenabled = true;
            } else {
                $dataPDF = PemeriksaanDokterForensik::where('norec', $request['norec'])->first();
            }
            $dataPDF->noregistrasifk = $request['norecpd'];
            $dataPDF->tglpemeriksaanluar = $request['tanggalluar'];
            $dataPDF->tanggalpermintaan = $request['tanggalpermintaan'];
            $dataPDF->ditandatangani = $request['tandatangan'];
            $dataPDF->pangkat = $request['pangkat'];
            $dataPDF->ataspermintaan = $request['ataspermintaan'];
            $dataPDF->tanggalttd = $request['tanggalttd'];
            $dataPDF->nomorsurat = $request['nomorsurat'];
            $dataPDF->nomor2 = $request['nomor'];
            $dataPDF->pegawailuar1 = $request['pegawailuar'];
            $dataPDF->pegawailuar2 = $request['pegawailuar2'];
            $dataPDF->pegawailuar3 = $request['pegawailuar3'];
            $dataPDF->label = $request['label'];
            $dataPDF->bungkusmayat = $request['bungkusmayat'];
            $dataPDF->perhiasanmayat = $request['perhiasan'];
            $dataPDF->pakaianmayat = $request['pakaian'];
            $dataPDF->bendamayat = $request['benda'];
            $dataPDF->kakumayat = $request['kaku'];
            $dataPDF->mayat = $request['mayat'];
            $dataPDF->identitaskhusus = $request['identitaskhusus'];
            $dataPDF->rambutkepala = $request['rambut'];
            $dataPDF->kelopakmatakanan = $request['kelopak'];
            $dataPDF->hidung = $request['hidung'];
            $dataPDF->gigikananatas = $request['gigi'];
            $dataPDF->mulut = $request['mulut'];
            $dataPDF->lukaluka = $request['lukaluka'];
            $dataPDF->patahtulang = $request['patahtulang'];
            $dataPDF->lainlainluar = $request['lainlain'];
            $dataPDF->tglpemeriksaandalam = $request['tanggaldalam'];
            $dataPDF->warnajaringanlemak = $request['jaringanlemak'];
            $dataPDF->tebaljaringanlemak = $request['jaringanikat'];
            $dataPDF->warnaotot = $request['selaputdinding'];
            $dataPDF->tebalotot = $request['lidah'];
            $dataPDF->tulangdada = $request['jantung'];
            $dataPDF->tulangiga = $request['paru'];
            $dataPDF->jarikeduaparu = $request['limpa'];
            $dataPDF->ototleher = $request['hati'];
            $dataPDF->selaputdindingperut = $request['kandungempedu'];
            $dataPDF->ototdindingperut = $request['kelenjarliur'];
            $dataPDF->ronggaperut = $request['lambung'];
            $dataPDF->warnalidah = $request['kelenjaranakginjal'];
            $dataPDF->penampanglidah = $request['ginjal'];
            $dataPDF->tulanglidah = $request['kandungkemih'];
            $dataPDF->rawangondok = $request['indung'];
            $dataPDF->rawancincin = $request['kulitkepala'];
            $dataPDF->perabaangondok = $request['pemeriksaanlab'];
            $dataPDF->saluranluka = $request['saluranluka'];
            $dataPDF->kerongkongan = $request['kesimpulan'];
            $dataPDF->pegawaidalam1 = $request['pegawaidalam'];
            $dataPDF->pegawaidalam2 = $request['pegawaidalam2'];
            $dataPDF->pegawaidalam3 = $request['pegawaidalam3'];
            $dataPDF->foto = $request['file'];
            $dataPDF->foto2 = $request['file2'];
            $dataPDF->keterangangambar = $request['keterangangambar'];
            $dataPDF->keterangangambar2 = $request['keterangangambar2'];
            $dataPDF->foto3 = $request['file3'];
            $dataPDF->keterangangambar3 = $request['keterangangambar3'];
            $dataPDF->foto4 = $request['file4'];
            $dataPDF->keterangangambar4 = $request['keterangangambar4'];
            $dataPDF->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = 'SUKSES !';
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            $transMessage = 'GAGAL !';
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getAngkaTitik(Request $request)
    {
        $datatitle = \DB::table('tempangka_t as ta')
            ->select('ta.angkabiofor');
        if (isset($request['lengthtitle']) && $request['lengthtitle'] != "" && $request['lengthtitle'] != "undefined") {
            $datatitle = $datatitle->where('ta.lengthbiofor', '=', $request['lengthtitle']);
        };
        $datatitle = $datatitle->get();

        $datanama = \DB::table('tempangka_t as ta')
            ->select('ta.angkabiofor');
        if (isset($request['lengthnama']) && $request['lengthnama'] != "" && $request['lengthnama'] != "undefined") {
            $datanama = $datanama->where('ta.lengthbiofor', '=', $request['lengthnama']);
        };
        $datanama = $datanama->get();

        $datattl = \DB::table('tempangka_t as ta')
            ->select('ta.angkabiofor');
        if (isset($request['lengthttl']) && $request['lengthttl'] != "" && $request['lengthttl'] != "undefined") {
            $datattl = $datattl->where('ta.lengthbiofor', '=', $request['lengthttl']);
        };
        $datattl = $datattl->get();

        $dataagama = \DB::table('tempangka_t as ta')
            ->select('ta.angkabiofor');
        if (isset($request['lengthagama']) && $request['lengthagama'] != "" && $request['lengthagama'] != "undefined") {
            $dataagama = $dataagama->where('ta.lengthbiofor', '=', $request['lengthagama']);
        };
        $dataagama = $dataagama->get();

        $datajeniskelamin = \DB::table('tempangka_t as ta')
            ->select('ta.angkabiofor');
        if (isset($request['lengthjeniskelamin']) && $request['lengthjeniskelamin'] != "" && $request['lengthjeniskelamin'] != "undefined") {
            $datajeniskelamin = $datajeniskelamin->where('ta.lengthbiofor', '=', $request['lengthjeniskelamin']);
        };
        $datajeniskelamin = $datajeniskelamin->get();

        $datawarganegara = \DB::table('tempangka_t as ta')
            ->select('ta.angkabiofor');
        if (isset($request['lengthwarganegara']) && $request['lengthwarganegara'] != "" && $request['lengthwarganegara'] != "undefined") {
            $datawarganegara = $datawarganegara->where('ta.lengthbiofor', '=', $request['lengthwarganegara']);
        };
        $datawarganegara = $datawarganegara->get();

        $datapekerjaan = \DB::table('tempangka_t as ta')
            ->select('ta.angkabiofor');
        if (isset($request['lengthpekerjaan']) && $request['lengthpekerjaan'] != "" && $request['lengthpekerjaan'] != "undefined") {
            $datapekerjaan = $datapekerjaan->where('ta.lengthbiofor', '=', $request['lengthpekerjaan']);
        };
        $datapekerjaan = $datapekerjaan->get();

        $result = array(
            'title' => $datatitle,
            'nama' => $datanama,
            'ttl' => $datattl,
            'agama' => $dataagama,
            'jeniskelamin' => $datajeniskelamin,
            'warganegara' => $datawarganegara,
            'pekerjaan' => $datapekerjaan,
        );

        return $this->respond($result);
    }
    public function getBlaBla(Request $request)
    {
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftjoin('agama_m as ag', 'ag.id', '=', 'ps.objectagamafk')
            ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->leftjoin('negara_m as neg', 'neg.id', '=', 'ps.objectnegarafk')
            ->leftjoin('pekerjaan_m as pk', 'pk.id', '=', 'ps.objectpekerjaanfk')
            ->select(
                'ps.namapasien',
                'ag.agama',
                'jk.jeniskelamin',
                'neg.namanegara',
                'pk.pekerjaan',
                DB::raw("
            ps.tempatlahir + ', ' + format(ps.tgllahir, 'D', 'en-gb') as ttl
            ")
            )
            ->where('pd.norec', $request['norecpd'])
            ->get();

        return $this->respond($data);
    }
    public function formatTanggalPakeHurufCoy(Request $request)
    {
        $request['tanggal'];
        // return ($request['tanggal']);
        // die();

        $data = Valet::getDateHuruf2($request['tanggal']) . ' ' . substr($request['tanggal'], 1, 0);
        $data2 = Valet::getDateHuruf2($this->getDateTime()->format('Y-m-d H:i'));
        // ->get();
        $result = array(
            'tglpermintaan' => $data,
            'tglsekarang' => $data2,
        );

        return $this->respond($result);
    }
}
