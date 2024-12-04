<?php

/**
 * Created by PhpStorm.
 * MicroServiceController
 * User: Efan Andrian (ea@epic)
 * Date: 24/09/2019
 * Time: 03:48 PM
 */

namespace App\Http\Controllers\MicroService;

use App\Http\Controllers\ApiController;

use App\Traits\Valet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Transaksi\Notifikasi;
use App\Transaksi\PasienDaftar;

class MicroServiceController extends ApiController
{
    use Valet;
    public function __construct(){
        parent::__construct($skip_authentication=false);
    }

    public function GetBuktiPendaftaran (Request $request){

        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps','pd.nocmfk','=','ps.id')
            ->leftJoin('alamat_m as ap', 'ap.nocmfk','=' ,'ps.id')
            ->join('jeniskelamin_m as jk','ps.objectjeniskelaminfk','=','jk.id')
            ->join('ruangan_m as ru','pd.objectruanganlastfk','=','ru.id')
            ->leftJoin('pegawai_m as pp','pd.objectpegawaifk','=','pp.id')
            ->join('kelompokpasien_m as kp','pd.objectkelompokpasienlastfk','=','kp.id')
            ->join('antrianpasiendiperiksa_t as apdp','apdp.noregistrasifk','=','pd.norec')
            ->leftJoin('antrianpasienregistrasi_t as apr','apr.noreservasi','=','pd.statusschedule')
            ->select(DB::raw("pd.noregistrasi,ps.nocm,ps.tgllahir,ps.namapasien,pd.tglregistrasi,jk.reportdisplay AS jk,  
				     ap.alamatlengkap,ap.mobilephone2,ru.namaruangan AS ruanganPeriksa,pp.namalengkap AS namadokter,  
				     kp.kelompokpasien,apdp.noantrian,pd.statuspasien,apr.noreservasi,apr.tanggalreservasi"));

        if (isset($request['noRegistrasi']) && $request['noRegistrasi'] != "" && $request['noRegistrasi'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $request['noRegistrasi']);
        }
        $data = $data->get();
        $hasil=array();
        $fields=array();
        $jumlah = 15;
        foreach ($data as $item){
            $hasil[] = array(
                $item->noregistrasi,
                $item->nocm,
                $item->tgllahir,
                $item->namapasien,
                $item->tglregistrasi,
                $item->jk,
                $item->alamatlengkap,
                $item->mobilephone2,
                $item->ruanganPeriksa,
                $item->namadokter,
                $item->kelompokpasien,
                $item->statuspasien,
                $item->noantrian,
                $item->noreservasi,
                $item->tanggalreservasi,
            );
        }
        foreach ($data as $items){
            if ($items != []){
                $Fields[] = array(
                
                );
            }
        }
        $result = array(
            "RecordCount" => $jumlah,
            "Fields" => 0,
            'RowsCols' => $hasil,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }


    // public function getListNotif(Request $request)
    // {
    //     // $data = \DB::table('notifikasi')
    //     //     ->where('isnotif',false)
    //     //     ->wherein('so.objectruangantujuanfk',array($request['mapruangan']));
    //     // $data = $data->get(); 
    //     $data = DB::select(DB::raw("
    //     select * from notifikasi where isread=0 and idruangan in (" . $request['mapruangan'] . ") order by tglorder desc
    //     "));
    //     $results = [];
    //     $x = 0;
    //     foreach ($data as $item) {
    //         $x = $x + 1;
    //     }
    //     $details = DB::select(DB::raw("
    //     select top 10  * from notifikasi where  idruangan in (" . $request['mapruangan'] . ") order by tglorder desc
    //     "));



    //     foreach ($details as $item) {
    //         $results[] = array(
    //             'title' => $item->title,
    //             'namaruangan' => $item->namaruangan,
    //             'namapasien' => $item->namapasien,
    //             'tglorder' => $item->tglorder,
    //             'nocm' => $item->nocm,
    //             'namatanggal' => $item->namapasien . ' ' . $item->nocm,
    //             'idruangan' => $item->idruangan,
    //             'form' => $item->form,
    //             'isread' => $item->isread

    //         );
    //     }

    //     $result = [];
    //     $result[] = array(
    //         'x' => $x,
    //         'details' => $results,

    //     );

    //     return $this->respond($result);
    // }

    public function getListNotifPerPegawai(Request $request)
    {
        // $data = \DB::table('notifikasi')
        //     ->where('isnotif',false)
        //     ->wherein('so.objectruangantujuanfk',array($request['mapruangan']));
        // $data = $data->get(); 
        $data = DB::select(DB::raw("
        select * from notifikasi where isread=0 and pegawaitujuanfk in (" . $request['pegawaifk'] . ") order by tglorder desc
        "));
        $results = [];
        $x = 0;
        foreach ($data as $item) {
            $x = $x + 1;
        }
        $details = DB::select(DB::raw("
        select top 10  * from notifikasi where  pegawaitujuanfk in (" . $request['pegawaifk'] . ") order by tglorder desc
        "));



        foreach ($details as $item) {
            $results[] = array(
                'title' => $item->title,
                'namaruangan' => $item->namaruangan,
                'namapasien' => $item->namapasien,
                'tglorder' => $item->tglorder,
                'nocm' => $item->nocm,
                'namatanggal' => $item->namapasien . ' ' . $item->nocm,
                'idruangan' => $item->idruangan,
                'form' => $item->form,
                'isread' => $item->isread

            );
        }

        $result = [];
        $result[] = array(
            'x' => $x,
            'details' => $results,

        );

        return $this->respond($result);
    }
    // public function savenotif(Request $request)
    // {
    //     $dataPA = new Notifikasi();
    //     $dataPA->norec = $dataPA->generateNewId();;
    //     $dataPA->title = $request['title'];
    //     $dataPA->namaruangan = $request['namaruangan'];
    //     $dataPA->namapasien = $request['namapasien'];
    //     $dataPA->tglorder = $request['tglorder'];
    //     $dataPA->nocm = $request['nocm'];
    //     $dataPA->idruangan = $request['idruangan'];
    //     $dataPA->form = $request['form'];
    //     $dataPA->isread = 0;
    //     $dataPA->pegawaitujuanfk = $request['pegawaitujuanfk'];

    //     //tambahan buat apotik, lab, dan rad biar gak bikin route save baru lagi
    //     if (isset($request['idruanganorder']) && $request['idruanganorder'] != "" && $request['idruanganorder'] != "undefined") {
    //         $dataPA->idruanganorder = $request['idruanganorder'];
    //     }
    //     if (isset($request['namaruanganorder']) && $request['namaruanganorder'] != "" && $request['namaruanganorder'] != "undefined") {
    //         $dataPA->namaruanganorder = $request['namaruanganorder'];
    //     }
    //     if (isset($request['dokterorder']) && $request['dokterorder'] != "" && $request['dokterorder'] != "undefined") {
    //         $dataPA->dokterorder = $request['dokterorder'];
    //     }
    //     if (isset($request['noorder']) && $request['noorder'] != "" && $request['noorder'] != "undefined") {
    //         $dataPA->noorder = $request['noorder'];
    //     }
    //     $dataPA->save();
    //     return $this->setStatusCode(200)->respond($dataPA, 'kuntul');
    // }
    // public function updatenotif(Request $request)
    // {

    //     $data = DB::statement("
    //     update notifikasi set isread=1
    //     WHERE idruangan in (" . $request['kdruangan'] . ")
    //     ");
    //     $transMessage = "berhasil";
    //     $result = array(
    //         "status" => 200,
    //         "message"  => $transMessage,
    //         "as" => 'as@epic',
    //     );
    //     $data = array(
    //         "data" => $result
    //     );
    //     return $this->setStatusCode(201)->respond($data, 'kuntul');
    // }
    public function getListNotifApotik(Request $request)
    {
        $data = DB::select(DB::raw("
        select * from notifikasi where isread=0 and idruangan in (" . $request['mapruangan'] . ") order by tglorder desc
        "));
        $results = [];
        $x = 0;
        foreach ($data as $item) {
            $x = $x + 1;
        }
        $details = DB::select(DB::raw("
        select top 10  * from notifikasi where  idruangan in (" . $request['mapruangan'] . ") order by tglorder desc
        "));



        foreach ($details as $item) {
            $results[] = array(
                'title' => $item->title,
                'namaruangan' => $item->namaruanganorder,
                'namapasien' => $item->namapasien,
                'tglorder' => Carbon::parse($item->tglorder)->format('Y-m-d H:i:s'),
                'nocm' => $item->nocm,
                'namatanggal' => $item->namapasien . ' ' . $item->nocm,
                'idruangan' => $item->idruanganorder,
                'form' => $item->form,
                'isread' => $item->isread,
                'dokterorder' => $item->dokterorder


            );
        }

        $result = [];
        $result[] = array(
            'x' => $x,
            'details' => $results,

        );

        return $this->respond($result);
    }
    public function getListNotifLabRad(Request $request)
    {
        $data = DB::select(DB::raw("
        select * from notifikasi where isread=0 and idruangan in (" . $request['mapruangan'] . ") order by tglorder desc
        "));
        $results = [];
        $x = 0;
        foreach ($data as $item) {
            $x = $x + 1;
        }
        $details = DB::select(DB::raw("
        select top 10  * from notifikasi where  idruangan in (" . $request['mapruangan'] . ") order by tglorder desc
        "));



        foreach ($details as $item) {
            $results[] = array(
                'title' => $item->title,
                'namaruangan' => $item->namaruanganorder,
                'namapasien' => $item->namapasien,
                'tglorder' => Carbon::parse($item->tglorder)->format('Y-m-d H:i:s'),
                'nocm' => $item->nocm,
                'namatanggal' => $item->namapasien . ' ' . $item->nocm,
                'idruangan' => $item->idruanganorder,
                'form' => $item->form,
                'isread' => $item->isread,
                'dokterorder' => $item->dokterorder,
                'noorder' => $item->noorder

            );
        }

        $result = [];
        $result[] = array(
            'x' => $x,
            'details' => $results,

        );

        return $this->respond($result);
    }
    public function getListNotif(Request $request)
    {
        // $data = \DB::table('notifikasi')
        //     ->where('isnotif',false)
        //     ->wherein('so.objectruangantujuanfk',array($request['mapruangan']));
        // $data = $data->get(); 

        $data = [];
        if (isset($request['mapruangan'])) {
            if (strlen($request['mapruangan']) > 0) {
                $data = DB::select(DB::raw(
                    "SELECT * FROM notifikasi 
                        WHERE isread=0 
                        AND idruangan IN (" . $request['mapruangan'] . ") 
                        ORDER BY tglorder DESC limit 200"
                ));
            }
        }


        $results = [];
        $x = 0;
        foreach ($data as $item) {
            $x = $x + 1;
        }

        $details = [];
        if (strlen($request['mapruangan']) > 0) {
            $details = DB::select(DB::raw(
                "SELECT * FROM notifikasi 
                    WHERE  idruangan IN (" . $request['mapruangan'] . ") 
                    ORDER BY tglorder"
            ));
        }


        foreach ($details as $item) {
            $results[] = array(
                'title' => $item->title,
                'namaruangan' => $item->namaruangan,
                'namapasien' => $item->namapasien,
                'tglorder' => $item->tglorder,
                'nocm' => $item->nocm,
                'namatanggal' => $item->namapasien . ' ' . $item->nocm,
                'idruangan' => $item->idruangan,
                'form' => $item->form,
                'isread' => $item->isread

            );
        }

        $result = [];
        $result[] = array(
            'x' => $x,
            'details' => $results,

        );

        return $this->respond($result);
    }
    // public function savenotif(Request $request)
    // {
    //     $dataPA = new Notifikasi();
    //     $dataPA->norec = $dataPA->generateNewId();;
    //     $dataPA->title = $request['title'];
    //     $dataPA->namaruangan = $request['namaruangan'];
    //     $dataPA->namapasien = $request['namapasien'];
    //     $dataPA->tglorder = $request['tglorder'];
    //     $dataPA->nocm = $request['nocm'];
    //     $dataPA->idruangan = $request['idruangan'];
    //     $dataPA->form = $request['form'];
    //     $dataPA->isread = 0;
    //     $dataPA->save();
    //     return $this->setStatusCode(200)->respond($dataPA, 'kuntul');
    // }

    // key
    public function savenotif(Request $request)
    {
        // return 'aa';
        \DB::beginTransaction();

        try {
            // Mengecek apakah namapasien sudah ada di database
            $existingPatient = Notifikasi::where('namapasien', $request['namapasien'])->first();

            if ($existingPatient) {
                // Jika pasien sudah ada, update data yang ada
                $existingPatient->title = $request['title'];
                $existingPatient->namaruangan = $request['namaruangan'];
                $existingPatient->tglorder = $request['tglorder'];
                $existingPatient->nocm = $request['nocm'];
                $existingPatient->idruangan = $request['idruangan'];
                $existingPatient->form = $request['form'];
                $existingPatient->noregistrasi = $request['noregistrasi'];
                $existingPatient->isread = 0;
                $existingPatient->save();
                $dataPA = $existingPatient;
            } else {
                // Jika pasien belum ada, simpan data baru
                $dataPA = new Notifikasi();
                $dataPA->norec = $dataPA->generateNewId();
                $dataPA->title = $request['title'];
                $dataPA->namaruangan = $request['namaruangan'];
                $dataPA->namapasien = $request['namapasien'];
                $dataPA->tglorder = $request['tglorder'];
                $dataPA->nocm = $request['nocm'];
                $dataPA->idruangan = $request['idruangan'];
                $dataPA->form = $request['form'];
                $dataPA->noregistrasi = $request['noregistrasi'];
                $dataPA->isread = 0;
                $dataPA->save();
            }
            \DB::commit();
            return $this->setStatusCode(200)->respond($dataPA, 'Success');
        } catch (\Exception $e) {
            $transMessage = "Notif Gagal!!";
            \DB::rollBack();
            return $this->setStatusCode(400)->respond($transMessage, 'Notif Gagal');
        }
    }

    public function deleteNotif(Request $request)
    {
        DB::beginTransaction();
        try {
            if ($request['flag'] == 'eresep') {
                $delete = Notifikasi::where('namapasien', 'LIKE', '%~' . $request['noregistrasi'])->where(function ($query) {
                    $query->where('title', 'Resep Elektronik RI')
                        ->orWhere('title', 'Resep Elektronik IGD');
                })
                    ->delete();
                $status = 'true';
            } else {
                $delete = Notifikasi::where('namapasien', 'LIKE', '%~' . $request['noregistrasi'])->where('title', 'Pengembalian Berkas')
                    ->delete();
                $status = 'true';
            }
        } catch (\Exception $e) {
            $status = 'false';
        }

        if ($status != 'false') {
            $transMessage = 'Berhasil!';
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'key'
            );
        } else {
            $transMessage = 'Gagal!';
            DB::rollBack();
            $result = array(
                "status" => 500,
                "message" => $transMessage,
                "as" => 'key'
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getNotifLOS(Request $request)
    {
        $query = DB::table('notifikasi as n')
            ->select('n.*')
            ->where('n.form', '=', 'Peringatan LOS');

        if ($request->has('norm') && !empty($request->input('norm')) && $request->input('norm') !== 'undefined') {
            $query->where('n.nocm', '=', $request->input('norm'));
        }

        if ($request->has('noreg') && !empty($request->input('noreg')) && $request->input('noreg') !== 'undefined') {
            $query->where('n.namapasien', 'ILIKE', '%' . $request->input('noreg') . '%');
        }

        if ($request->has('nama') && !empty($request->input('nama')) && $request->input('nama') !== 'undefined') {
            $query->where('n.namapasien', 'ILIKE', '%' . $request->input('nama') . '%');
        }

        $data = $query->get();

        // Mengumpulkan noregPart untuk penghapusan data
        $noregParts = [];
        foreach ($data as $key) {
            $noregParts[] = $key->noregistrasi;
        }

        // Menghapus data jika ada noregParts
        if (count($noregParts) > 0) {
            \DB::table('notifikasi')
                ->whereIn('noregistrasi', function ($query) use ($noregParts) {
                    $query->select('n.noregistrasi')
                        ->from('notifikasi as n')
                        ->join('pasiendaftar_t as p', 'n.noregistrasi', '=', 'p.noregistrasi')
                        ->where('n.form', 'Peringatan LOS')
                        ->whereIn('n.noregistrasi', $noregParts)
                        ->whereNotNull('p.tglpulang');
                })
                ->delete();
        }

        $result = [
            "data" => $data,
            "status" => 201,
            "as" => 'key'
        ];

        return response()->json($result);
    }

    public function getNotifTarif(Request $request)
    {
        $query = DB::table('notifikasi as n')
            ->select('n.*')
            ->whereIn('n.form', ['Peringatan Tarif 60%', 'Peringatan Tarif 100%']);

        if ($request->has('norm') && !empty($request->input('norm')) && $request->input('norm') !== 'undefined') {
            $query->where('n.nocm', '=', $request->input('norm'));
        }

        if ($request->has('noreg') && !empty($request->input('noreg')) && $request->input('noreg') !== 'undefined') {
            $query->where('n.namapasien', 'ILIKE', '%' . $request->input('noreg') . '%');
        }

        if ($request->has('nama') && !empty($request->input('nama')) && $request->input('nama') !== 'undefined') {
            $query->where('n.namapasien', 'ILIKE', '%' . $request->input('nama') . '%');
        }

        $data = $query->get();

        // Mengumpulkan noregPart untuk penghapusan data
        $noregParts = [];
        foreach ($data as $key) {
            $noregParts[] = $key->noregistrasi;
        }

        // Menghapus data jika ada noregParts
        if (count($noregParts) > 0) {
            \DB::table('notifikasi')
                ->whereIn('noregistrasi', function ($query) use ($noregParts) {
                    $query->select('n.noregistrasi')
                        ->from('notifikasi as n')
                        ->join('pasiendaftar_t as p', 'n.noregistrasi', '=', 'p.noregistrasi')
                        ->whereIn('n.form', ['Peringatan Tarif 60%', 'Peringatan Tarif 100%'])
                        ->whereIn('n.noregistrasi', $noregParts)
                        ->whereNotNull('p.tglpulang');
                })
                ->delete();
        }

        // Menghitung jumlah data berdasarkan namaruangan dan form
        $countPerRuangan = DB::table('notifikasi as n')
            ->join('ruangan_m as r', 'r.namaruangan', '=', 'n.namaruangan')
            ->select('n.namaruangan')
            ->selectRaw("SUM(CASE WHEN n.form = 'Peringatan Tarif 60%' THEN 1 ELSE 0 END) as count60")
            ->selectRaw("SUM(CASE WHEN n.form = 'Peringatan Tarif 100%' THEN 1 ELSE 0 END) as count100")
            ->selectRaw("SUM(CASE WHEN n.form = 'Peringatan LOS' THEN 1 ELSE 0 END) as countlos")
            ->where('r.objectdepartemenfk', '=', 16)
            ->where('r.statusenabled', true)
            ->groupBy('n.namaruangan')
            ->get();


        $result = [
            "data" => $data,
            "countPerRuangan" => $countPerRuangan,
            "status" => 201,
            "as" => 'key'
        ];

        return response()->json($result);
    }

    public function deleteNotifTarif(Request $request)
    {
        DB::beginTransaction();
        try {
            $delete = \DB::table('notifikasi')
                ->where('noregistrasi', $request['noreg'])
                ->whereIn('form', ['Peringatan Tarif 60%', 'Peringatan Tarif 100%'])
                ->delete();
            \DB::commit();
            return $this->setStatusCode(200)->respond(null, 'Success');
        } catch (\Exception $e) {
            \DB::rollBack();
            return $this->setStatusCode(500)->respond(null, 'Error: ' . $e->getMessage());
        }
    }

    public function deleteNotifLOS(Request $request)
    {
        DB::beginTransaction();
        try {
            $noregPart = explode('~', $request['noreg'])[0];
            $delete = \DB::table('notifikasi')
                ->whereRaw('namapasien ILIKE ? AND form = ?', ['%' . $noregPart . '%', 'Peringatan LOS'])
                ->delete();
            $status = 'true';
        } catch (\Exception $e) {
            $status = 'false';
        }
        if ($status != 'false') {
            $message = 'Notif LOS Berhasil Dihapus!';
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $message,
                "as" => "key"
            );
        } else {
            $message = 'Notif Gagal Terhapus!';
            DB::rollBack();
            $result = array(
                "status" => 500,
                "message" => $message,
                "as" => "key"
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $message);
    }

    public function updatenotif(Request $request)
    {

        $data = DB::statement("
        update notifikasi set isread=1
        WHERE idruangan in (" . $request['kdruangan'] . ")
        ");
        $transMessage = "berhasil";
        $result = array(
            "status" => 200,
            "message"  => $transMessage,
            "as" => 'as@epic',
        );
        $data = array(
            "data" => $result
        );
        return $this->setStatusCode(201)->respond($data, 'kuntul');
    }
}
