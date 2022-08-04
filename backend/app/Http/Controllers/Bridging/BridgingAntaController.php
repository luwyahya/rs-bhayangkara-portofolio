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
use App\Transaksi\AntrianPasienAnta;
use App\Traits\Valet;
use Carbon\Carbon;
use Illuminate\Http\Request;
use DB;
use Date;

use App\Traits\PelayananPasienTrait;

class BridgingAntaController  extends ApiController
{

    use Valet, PelayananPasienTrait;
    // protected $url_dinkes_jkt = 'http://eis.dinkes.jakarta.go.id/api-bed/bed';
    public function __construct()
    {
        parent::__construct($skip_authentication = true);
    }

    public function getEkyc(Request $request)
    {

        $tglAwal = Carbon::now()->format('Y-m-d');
        // $data = \DB::table('xaxxxntrianpasienanta_t as pd')
        //     ->select('pd.nik', 'pd.nama')
        //     ->where('pd.tglscan', '=', $tglAwal)
        //     ->where('statusenabled', true);

        $data = DB::select(DB::raw(" select antrianpasienanta_t.norec, antrianpasienanta_t.nik, antrianpasienanta_t.name, antrianpasienanta_t.pob, antrianpasienanta_t.dob, antrianpasienanta_t.phoneNumber, antrianpasienanta_t.email, antrianpasienanta_t.verified, 
        antrianpasienanta_t.provinsi, antrianpasienanta_t.kabupatenKota, antrianpasienanta_t.golonganDarah, antrianpasienanta_t.agama, antrianpasienanta_t.alamat, antrianpasienanta_t.berlakuHingga, 
        antrianpasienanta_t.kewarganegaraan, antrianpasienanta_t.pekerjaan, antrianpasienanta_t.kecamatan, antrianpasienanta_t.jenisKelamin, antrianpasienanta_t.rtRw, antrianpasienanta_t.statusPerkawinan, 
        antrianpasienanta_t.kelurahanDesa, antrianpasienanta_t.statusenabled, antrianpasienanta_t.tglscan, pasien_m.nocm, antrianpasienanta_t.foto from antrianpasienanta_t LEFT OUTER JOIN
        pasien_m ON antrianpasienanta_t.nik = pasien_m.noidentitas where antrianpasienanta_t.tglscan = '$tglAwal' and antrianpasienanta_t.statusenabled='true' order by name
            "));
        // $data10 = [];
        // foreach ($data as $item) {
        //     $data10[] = array(
        //         'nik' => $item->nik,
        //         'nama' => $item->name
        //         // 'TANGGAL' => $item->tgldiagnosa,
        //     );
        // }
        //         $data10[] = array(
        //             'kdruangan' => $item->kdruangan,
        //             'namaruangan' => $item->namaruangan,
        //             'total' => 1,
        //             'diperiksa' => $sudahPeriksa,
        //             'belumperiksa' => $belumPeriksa,
        //             'batalregistrasi' => $batalRegis,
        // //                        'count' => $totalAll,
        //         );
        //     }
        //     foreach ($data10 as $key => $row) {
        //         $count[$key] = $row['total'];
        //     }
        //     array_multisort($count, SORT_DESC, $data10);
        // if ($data10 != []) {
        //     foreach ($data10 as $key => $row) {
        //         $count[$key] = $row['nama'];
        //     }

        //     array_multisort($count, SORT_ASC, $data10);
        // }




        return $this->respond($data);
    }
    public function getEkycpernorec(Request $request)
    {

        // $tglAwal = Carbon::now()->format('Y-m-d');
        $norec = $request['norec'];

        $data = DB::select(DB::raw(" select* from v_ekycpernorec where norec='$norec' "));

        return $this->respond($data);
    }


    public function getPrintNoantrian(Request $request)
    {
        // return($request['norec']);
        // die();
        $norec = $request['norec'];
        $data = DB::select(DB::raw("select * from antrianpasienregistrasi_t where norec = '$norec'"));
        if (strlen($data[0]->noantrian) == 1) {
            $noantrian = "00" . $data[0]->noantrian;
        } else if (strlen($data[0]->noantrian) == 2) {
            $noantrian = "0" . $data[0]->noantrian;
        } else {
            $noantrian = $data[0]->noantrian;
        }

        $jenis = $data[0]->jenis;
        $noantrian = $jenis . "-" . $noantrian;
        // return($data);
        // die();
        $dataj = DB::select(DB::raw("
        SELECT  count(noantrian) as jmlAntri 
        FROM antrianpasienregistrasi_t 
        WHERE jenis='$jenis' AND statuspanggil=0 AND CONVERT(varchar,tanggalreservasi, 111)=CONVERT(varchar, GETDATE(), 111)"));

        if ($jenis == 'A') {
            $ruangan = 'UMUM';
        } else if ($jenis == 'B') {
            $ruangan = 'BPJS BARU';
        } else if ($jenis == 'C') {
            $ruangan = 'BPJS POLRI';
        } else if ($jenis == 'D') {
            $ruangan = 'BPJS NON POLRI';
        } else if ($jenis == 'E') {
            $ruangan = 'BPJS ASURANSI';
        } else if ($jenis == 'F') {
            $ruangan = 'UMUM';
        } else if ($jenis == 'G') {
            $ruangan = 'BPJS BARU';
        } else if ($jenis == 'H') {
            $ruangan = 'BPJS POLRI';
        } else if ($jenis == 'I') {
            $ruangan = 'BPJS NON POLRI';
        } else if ($jenis == 'K') {
            $ruangan = 'KASIR L-1';
        } else if ($jenis == 'L') {
            $ruangan = 'KASIR L-2';
        }
        $result = array(
            'noantrian' => $noantrian,
            'status' => $ruangan,
            'ruangan' => $data[0]->norujukan,
            'jumlahantrian' => $dataj[0]->jmlAntri,
            'tanggalreservasi' => $data[0]->tanggalreservasi
        );

        // return($noantrian);
        // die();
        // $tglAwal = Carbon::now()->format('Y-m-d');
        // $data = \DB::table('xaxxxntrianpasienanta_t as pd')
        //     ->select('pd.nik', 'pd.nama')
        //     ->where('pd.tglscan', '=', $tglAwal)
        //     ->where('statusenabled', true);

        // $data = DB::select(DB::raw(" select * from antrianpasienanta_t where tglscan = '$tglAwal' and statusenabled='true'
        //     "));
        // foreach ($data as $item) {
        //     $data10[] = array(
        //         'nik' => $item->nik,
        //         'nama' => $item->name
        //         // 'TANGGAL' => $item->tgldiagnosa,
        //     );
        // }

        // foreach ($data10 as $key => $row) {
        //     $count[$key] = $row['nama'];
        // }

        // array_multisort($count, SORT_ASC, $data10);


        // $result = array(
        //     'data' => $result,
        //     'message' => 'Inhuman',
        // );
        return $this->respond($result);
    }

    public function SaveEkyc(Request $request)
    {
        \DB::beginTransaction();
        // $dataLogin = $request->all();
        $detail = $request->all();
        try {
            $tglAwal = Carbon::now()->format('Y-m-d');
            // return ($tglAwal);
            // die();
            $data = \DB::table('antrianpasienanta_t as pd')
                ->where('pd.tglscan', '=', $tglAwal)
                ->where('nik', '=', $detail['nik'])
                ->where('statusenabled', true);
            $data = $data->get();
            $status = true;
            foreach ($data as $item) {
                $status = false;
            }

            if ($status == true) {
                $newAnta = new AntrianPasienAnta();
                $norecnewAnta = $newAnta->generateNewId();
                // $noRetur = $this->generateCode(new StrukRetur, 'noretur', 12, 'Ret/' . $this->getDateTime()->format('ym') . '/');
                $newAnta->norec = $norecnewAnta;
                $newAnta->statusenabled = true;
                $newAnta->nik = $detail['nik'];
                $newAnta->name = $detail['name'];
                $newAnta->pob = $detail['pob'];
                $newAnta->dob = $detail['dob'];
                $newAnta->phoneNumber = $detail['phoneNumber'];
                $newAnta->email = $detail['email'];
                $newAnta->verified = $detail['verified'];
                $newAnta->provinsi = $detail['provinsi'];
                $newAnta->kabupatenKota = $detail['kabupatenKota'];
                $newAnta->golonganDarah = $detail['golonganDarah'];
                $newAnta->agama = $detail['agama'];
                $newAnta->alamat = $detail['alamat'];
                $newAnta->berlakuhingga = $detail['berlakuHingga'];
                $newAnta->kewarganegaraan = $detail['kewarganegaraan'];
                $newAnta->pekerjaan = $detail['pekerjaan'];
                $newAnta->kecamatan = $detail['kecamatan'];
                $newAnta->jenisKelamin = $detail['jenisKelamin'];
                $newAnta->rtRw = $detail['rtRw'];
                $newAnta->statusPerkawinan = $detail['statusPerkawinan'];
                $newAnta->kelurahanDesa = $detail['kelurahanDesa'];

                // $newAnta->foto = $detail['foto'];
                $newAnta->tglscan = $tglAwal;
                $newAnta->save();
                $transMessage = "Simpan Berhasil";
            } else {
                $transMessage = "DATA NIK SUDAH DI SCAN HARI INI SILAHKAN LANJUTKAN KE LOKET";
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
            );
        } else {
            $transMessage = "Simpan Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getPrintSEP(Request $request){
        $noregistrasi=$request['noregistrasi'];
        $data = DB::select(DB::raw(
            "select pa.namadjpjpmelayani,pa.polirujukannama as namaruangan,pa.nosep,pa.tanggalsep,pa.nokepesertaan,pi.nocm,pd.noregistrasi, 
                pa.norujukan,ap.namapeserta + '('+jk.jeniskelamin+')' as namapeserta, format(ap.tgllahir,'yyyy-MM-dd') as tgllahir,jk.jeniskelamin, 
                rp.namaruangan as namaruangans,rp.kdinternal as namapolibpjs,pa.ppkrujukan, 
                (CASE WHEN rp.objectdepartemenfk=16 then 'R. Inap' else 'R. Jalan' END) as jenisrawat, 
                dg.kddiagnosa, (case when dg.namadiagnosa is null then '-' else dg.namadiagnosa end) as namadiagnosa , 
                ap.jenispeserta,ap.kdprovider,ap.nmprovider, pa.catatan, 
                (case when rp.objectdepartemenfk=16 then kls2.namakelas else '-' end) as namakelas, 
                (case when rp.objectdepartemenfk=16 then kls.namakelas else '-' end) as namakelas, 
                kls.namakelas as namakelashak, 
                ap.notelpmobile,case when pa.penjaminlaka is null then '-' else pa.penjaminlaka end as penjaminlaka,
                (case when pa.penjaminlaka='1' then 'Jasa Raharja PT' 
                when pa.penjaminlaka='2' then 'BPJS Ketenagakerjaan' 
                when pa.penjaminlaka='3' then 'TASPEN PT' 
                when pa.penjaminlaka='4' then 'ASABRI PT' 
                Else '-' end) as penjaminlakalantas,case when pa.prolanisprb is null then '-' else pa.prolanisprb end as prolanisprb , tp.namaexternal as titlepasien , (kls.namakelas ) as namakelasDitanggung
                ,case when pa.polirujukannama is null then rp.namaruangan+'('+rp.kdinternal+')' else pa.polirujukannama end as namaruanganfix
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
                and pa.nosep is not null  
            "
        ));

        $result = array(
            "namadjpjpmelayani" => $data[0]->namadjpjpmelayani,
            "namaruangan" => $data[0]->namaruangan,
            "nosep" => $data[0]->nosep,
            "tanggalsep" => $data[0]->tanggalsep,
            "nokepesertaan" => $data[0]->nokepesertaan . ' / ' . $data[0]->nocm,
            "nocm" => $data[0]->nocm,
            "noregistrasi" => $data[0]->noregistrasi,
            "norujukan" => $data[0]->norujukan,
            "namapeserta" => $data[0]->namapeserta,
            "tgllahir" => $data[0]->tgllahir,
            "jeniskelamin" => $data[0]->jeniskelamin,
            "namaruangans" => $data[0]->namaruangans,
            "namapolibpjs" => $data[0]->namapolibpjs,
            "ppkrujukan" => $data[0]->ppkrujukan,
            "jenisrawat" => $data[0]->jenisrawat,
            "kddiagnosa" => $data[0]->kddiagnosa,
            "namadiagnosa" => $data[0]->namadiagnosa,
            "jenispeserta" => $data[0]->jenispeserta,
            "kdprovider" => $data[0]->kdprovider,
            "nmprovider" => $data[0]->nmprovider,
            "catatan" => $data[0]->catatan,
            "namakelas" => $data[0]->namakelas,
            "namakelashak" => $data[0]->namakelashak,
            "notelpmobile" => $data[0]->notelpmobile,
            "penjaminlaka" => $data[0]->penjaminlaka,
            "penjaminlakalantas" => $data[0]->penjaminlakalantas,
            "prolanisprb" => $data[0]->prolanisprb,
            "titlepasien" => $data[0]->titlepasien,
            "namakelasDitanggung" => $data[0]->namakelasDitanggung,
            "namaruanganfix" => $data[0]->namaruanganfix,
            "cetakanke" => "1"
        );
        return $this->respond($result);
    }
    
    public function getPrintNoantrianRuangan(Request $request)
    {;
        $noregistrasi = $request['noregistrasi'];
        $data = DB::select(DB::raw("SELECT  pd.noregistrasi,    ps.nocm,    ps.tgllahir,    ps.namapasien,  pd.tglregistrasi,   jk.reportdisplay AS jk, ap.alamatlengkap,   ap.mobilephone2,    
        ru.namaruangan AS ruanganPeriksa,   pp.namalengkap AS namadokter, kp.kelompokpasien,  apdp.noantrian,pd.statuspasien,apr.noreservasi, apr.tanggalreservasi,
        ru.id as ruid 
        FROM    pasiendaftar_t pd 
        INNER JOIN pasien_m ps ON pd.nocmfk = ps.id 
        LEFT JOIN alamat_m ap ON ap.nocmfk = ps.id 
        INNER JOIN jeniskelamin_m jk ON ps.objectjeniskelaminfk = jk.id 
        INNER JOIN ruangan_m ru ON pd.objectruanganlastfk = ru.id 
        LEFT JOIN pegawai_m pp ON pd.objectpegawaifk = pp.id 
        INNER JOIN kelompokpasien_m kp ON pd.objectkelompokpasienlastfk = kp.id 
        INNER JOIN antrianpasiendiperiksa_t apdp ON apdp.noregistrasifk = pd.norec 
        LEFT JOIN antrianpasienregistrasi_t as apr on apr.noreservasi=pd.statusschedule 
        WHERE   pd.noregistrasi = '$noregistrasi'"));
        $result = array(
            'noregistrasi' => $data[0]->noregistrasi,
            'nocm' => $data[0]->nocm,
            'tgllahir' => $data[0]->tgllahir,
            'namapasien' => $data[0]->namapasien,
            'tglregistrasi' => $data[0]->tglregistrasi,
            'jk' => $data[0]->jk,
            'alamatlengkap' => $data[0]->alamatlengkap,
            'mobilephone2' => $data[0]->mobilephone2,
            'ruanganPeriksa' => $data[0]->ruanganPeriksa,
            'namadokter' => $data[0]->namadokter,
            'kelompokpasien' => $data[0]->kelompokpasien,
            'noantrian' => $data[0]->noantrian,
            'statuspasien' => $data[0]->statuspasien,
            'noreservasi' => $data[0]->noreservasi,
            'tanggalreservasi' => $data[0]->tanggalreservasi,
            'ruid' => $data[0]->ruid,
            'petugas' => '-'
        );

        return $this->respond($result);
    }

};
