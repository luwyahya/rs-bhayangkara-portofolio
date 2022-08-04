<?php
/**
 * Created by PhpStorm.
 * User: as@epic
 * Date: 14/08/2017
 * Time: 20.22
 */
/**
 * Created by PhpStorm.
 * User: nengepic
 * Date: 09/08/2019
 * Time: 9:42
 */
namespace App\Http\Controllers\Farmasi;

use App\Http\Controllers\ApiController;
use App\Transaksi\AntrianApotik;
use App\Transaksi\LoggingUser;
use App\Transaksi\PenangananKeluhanPelanggan;
use App\Transaksi\PenangananKeluhanPelangganD;
use App\Transaksi\SkriningFarmasi;
use Illuminate\Http\Request;
use App\Traits\Valet;
use DB;

use App\Transaksi\StrukOrder;
use App\Transaksi\StrukResep;
use App\Transaksi\OrderPelayanan;
use App\Master\LoginUser;



class ResepElektronikController extends ApiController
{
    use Valet;

    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }
    public function getDaftarOrder(Request $request)
    {
        $data = \DB::table('strukorder_t as so')
            ->JOIN('pasien_m as ps','ps.id','=','so.nocmfk')
            ->JOIN('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
            ->JOIN('ruangan_m as ru','ru.id','=','so.objectruanganfk')
            ->JOIN('ruangan_m as ru2','ru2.id','=','so.objectruangantujuanfk')
            ->leftJOIN('pegawai_m as pg','pg.id','=','so.objectpegawaiorderfk')
            ->leftJOIN('strukresep_t as sr','sr.orderfk','=','so.norec')
            ->leftJOIN('antrianapotik_t as aa','aa.noresep','=','sr.noresep')
            ->JOIN('pasiendaftar_t as pd','pd.norec','=','so.noregistrasifk')
            ->JOIN('kelas_m as kl','kl.id','=','pd.objectkelasfk')
            ->leftJOIN('antrianpasiendiperiksa_t as apd', function($join){
                $join->on('apd.noregistrasifk','=','pd.norec')
                    ->on('apd.objectruanganfk', '=', 'so.objectruanganfk');
//                    ->on('apd.objectpegawaifk', '=', 'so.objectpegawaiorderfk');
            })
            ->leftJOIN('kelompokpasien_m as kp','kp.id','=','pd.objectkelompokpasienlastfk')
//            ->leftJOIN('strukresep_t as sr','sr.orderfk','=','so.norec')
            ->select('so.norec as norec_order', 'so.noorder','ps.nocm','ps.namapasien','jk.jeniskelamin','ru.namaruangan as namaruanganrawat',
                'so.tglorder','pg.namalengkap','ru2.namaruangan',
                'so.statusorder','so.namapengambilorder','so.noregistrasifk',
                'pd.noregistrasi','kp.kelompokpasien',
                'apd.norec as norec_apd',
                'pd.tglregistrasi','ps.tgllahir','kl.namakelas','kl.id as klid','so.tglambilorder','sr.noresep',
                'aa.noantri as aanoantri','aa.jenis as aajenis','sr.norec as norecresep','sr.noresep',
                'so.nourutruangan as noruangan','so.isreseppulang', 'sr.tglresep AS tanggalresep', 'so.caraambil','pd.istelemedicine','ps.notelepon', 'ps.alamatdomisili');

        if(isset($request['tglAwal']) && $request['tglAwal']!="" && $request['tglAwal']!="undefined"){
            $data = $data->where('so.tglorder','>=', $request['tglAwal']);
        }
        if(isset($request['tglAkhir']) && $request['tglAkhir']!="" && $request['tglAkhir']!="undefined"){
            $tgl= $request['tglAkhir']." 23:59:59";
            $data = $data->where('so.tglorder','<=', $tgl);
        }
        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('ps.nocm','like','%'. $request['nocm'].'%');
        }
        if(isset($request['norec_apd']) && $request['norec_apd']!="" && $request['norec_apd']!="undefined"){
            $data = $data->where('apd.norec',$request['norec_apd']);
        }
        if(isset($request['namaPasien']) && $request['namaPasien']!="" && $request['namaPasien']!="undefined"){
            $data = $data->where('ps.namapasien','like','%'. $request['namaPasien'].'%');
        }
        if(isset($request['noPesanan']) && $request['noPesanan']!="" && $request['noPesanan']!="undefined"){
            $data = $data->where('so.noorder','like','%'. $request['noPesanan'].'%');
        }
        if(isset($request['ruanganId']) && $request['ruanganId']!="" && $request['ruanganId']!="undefined"){
            $data = $data->where('so.objectruanganfk','=',$request['ruanganId']);
        }
        if(isset($request['depoId']) && $request['depoId']!="" && $request['depoId']!="undefined"){
            $data = $data->where('so.objectruangantujuanfk','=',$request['depoId']);
        }
        if(isset($request['departemenId']) && $request['departemenId']!="" && $request['departemenId']!="undefined"){
            $data = $data->where('ru.objectdepartemenfk','=',$request['departemenId']);
        }
        if(isset($request['istelemedicine']) && $request['istelemedicine'] == "true") {
            $data = $data->where('pd.istelemedicine','1');
        }
        if(isset($request['statusId']) && $request['statusId']!="" && $request['statusId']!="undefined"){
            $arrStatus = explode(',',$request['statusId']) ;
            $kode = [];
            foreach ( $arrStatus as $item){
                $kode[] = (int) $item;
            }
            $data = $data->whereIn('so.statusorder',$kode);
        }
// //        if(isset($request['statusId']) && $request['statusId']!="" && $request['statusId']!="undefined"){
// //            $data = $data->where('so.statusorder','=',$request['statusId']);
// //        }
        $data = $data->where('so.keteranganorder','=', 'Order Farmasi');
        $data = $data->where('so.objectkelompoktransaksifk', 4);
        $data = $data->where('so.statusenabled', true);
// //        $data = $data->orderBy('so.noorder');
// //        $data = $data->get();

        $dataResepBiasa = \DB::table('strukresep_t AS sr')
            ->JOIN('antrianpasiendiperiksa_t AS apd','apd.norec','=','sr.pasienfk')
            ->JOIN('pasiendaftar_t AS pd','pd.norec','=','apd.noregistrasifk')
            ->JOIN('pasien_m as ps','ps.id','=','pd.nocmfk')
            ->JOIN('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
            ->JOIN('ruangan_m as ru','ru.id','=','apd.objectruanganfk')
            ->JOIN('ruangan_m as ru2','ru2.id','=','sr.ruanganfk')
            ->JOIN('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
            ->leftJOIN('pegawai_m as pg','pg.id','=','sr.penulisresepfk')
            ->leftJOIN('antrianapotik_t as aa','aa.noresep','=','sr.noresep')
            ->JOIN('kelas_m as kl','kl.id','=','pd.objectkelasfk')
            ->leftJOIN('kelompokpasien_m as kp','kp.id','=','pd.objectkelompokpasienlastfk')
            ->select('sr.norec AS norec_order','sr.noresep as noorder','ps.nocm','ps.namapasien', 'jk.jeniskelamin',  'ru.namaruangan AS namaruanganrawat',
                'sr.tglresep as tglorder',	'pg.namalengkap',	'ru2.namaruangan',	'sr.status as statusorder',	'sr.namalengkapambilresep as namapengambilorder','pd.norec as noregistrasifk',
                'pd.noregistrasi',	'kp.kelompokpasien','apd.norec AS norec_apd','pd.tglregistrasi','ps.tgllahir','kl.namakelas',	'kl.id AS klid','sr.tglambilresep as tglambilorder',
                'sr.noresep','aa.noantri AS aanoantri','aa.jenis AS aajenis','sr.norec AS norecresep','sr.noresep',DB::raw (" null as noruangan,sr.isreseppulang"),'sr.tglresep AS tanggalresep', 'sr.caraambil','pd.istelemedicine','ps.notelepon', 'ps.alamatdomisili');

        if(isset($request['tglAwal']) && $request['tglAwal']!="" && $request['tglAwal']!="undefined"){
            $dataResepBiasa = $dataResepBiasa->where('sr.tglresep','>=', $request['tglAwal']);
        }
        if(isset($request['tglAkhir']) && $request['tglAkhir']!="" && $request['tglAkhir']!="undefined"){
            $tgl= $request['tglAkhir']." 23:59:59";
            $dataResepBiasa = $dataResepBiasa->where('sr.tglresep','<=', $tgl);
        }
        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $dataResepBiasa = $dataResepBiasa->where('ps.nocm','like','%'. $request['nocm'].'%');
        }
        if(isset($request['norec_apd']) && $request['norec_apd']!="" && $request['norec_apd']!="undefined"){
            $dataResepBiasa = $dataResepBiasa->where('apd.norec',$request['norec_apd']);
        }
        if(isset($request['namaPasien']) && $request['namaPasien']!="" && $request['namaPasien']!="undefined"){
            $dataResepBiasa = $dataResepBiasa->where('ps.namapasien','like','%'. $request['namaPasien'].'%');
        }
// //        if(isset($request['noPesanan']) && $request['noPesanan']!="" && $request['noPesanan']!="undefined"){
// //            $data = $data->where('so.noorder','like','%'. $request['noPesanan'].'%');
// //        }
        if(isset($request['ruanganId']) && $request['ruanganId']!="" && $request['ruanganId']!="undefined"){
            $dataResepBiasa = $dataResepBiasa->where('apd.objectruanganfk','=',$request['ruanganId']);
        }
        if(isset($request['depoId']) && $request['depoId']!="" && $request['depoId']!="undefined"){
            $dataResepBiasa = $dataResepBiasa->where('sr.ruanganfk','=',$request['depoId']);
        }
        if(isset($request['departemenId']) && $request['departemenId']!="" && $request['departemenId']!="undefined"){
            $dataResepBiasa = $dataResepBiasa->where('ru.objectdepartemenfk','=',$request['departemenId']);
        }
        if(isset($request['istelemedicine']) && $request['istelemedicine'] == "true") {
            $dataResepBiasa = $dataResepBiasa->where('pd.istelemedicine','1');
        }
// //        if(isset($request['statusId']) && $request['statusId']!="" && $request['statusId']!="undefined"){
// //            $dataResepBiasa = $dataResepBiasa->where('sr.status','=',$request['statusId']);
// //        }
        if(isset($request['statusId']) && $request['statusId']!="" && $request['statusId']!="undefined"){
            $arrStatus = explode(',',$request['statusId']) ;
            $kode = [];
            foreach ( $arrStatus as $item){
                $kode[] = (int) $item;
            }
            $dataResepBiasa = $dataResepBiasa->whereIn('sr.status',$kode);
        }
        // $dataResepBiasa = $dataResepBiasa->whereRaw('(sr.statusenabled = 1 OR sr.statusenabled is null)');
        $dataResepBiasa = $dataResepBiasa->whereRaw('(sr.statusenabled is null)');
        $dataResepBiasa = $dataResepBiasa->whereNull('sr.orderfk');
// //        $data = $data->orderBy('so.noorder');
// //        $dataResepBiasa = $data2->get();
        $data = $data->unionAll($dataResepBiasa);
        // $data = $data->orderby('so.noorder');
        $data = $data->get();

        $status ='';
        $jenis = '';
        $result=[];
        foreach ($data as $item){
            if ($item->statusorder == 0){$status='Menunggu';};
            if ($item->statusorder == 5){$status='Verifikasi';};
            if ($item->statusorder == 1){$status='Produksi';};
            if ($item->statusorder == 2){$status='Packaging';};
            if ($item->statusorder == 3){$status='Selesai';};
            if ($item->statusorder == 4){$status='Penyerahan Obat';};
            if ($item->tglambilorder != null){$status='Sudah Di Ambil';};

            if ($item->aajenis == 'R'){$jenis = 'Racikan';}else if ($item->aajenis == 'N'){$jenis = 'Non Racikan';}else{$jenis = '-';};
            $result[] = array(
                'norec_order' =>$item->norec_order,
                'noregistrasi' => $item->noregistrasi,
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
                'noresep' => $item->noresep,
                'norecresep' => $item->norecresep,
                'noantri' =>  $item->aajenis . '-' . $item->aanoantri,
                'noresep' => $item->noresep,
                'jenis' => $jenis,
                'noruangan' => $item->noruangan,
                'reseppulang' => $item->isreseppulang,
                'tglresep' => $item->tanggalresep,
                'caraambil' => $item->caraambil,
                'istelemedicine' => $item->istelemedicine,
                'notelepon' => $item->notelepon,
                'alamatdomisili' => $item->alamatdomisili
            );
        }

        return $this->respond($result);

    }

    public function getDaftarDetailOrder(Request $request)
    {
        $data = \DB::table('strukorder_t as so')
            ->JOIN('pasien_m as ps','ps.id','=','so.nocmfk')
            ->JOIN('jeniskelamin_m as jk','jk.id','=','ps.objectjeniskelaminfk')
            ->JOIN('ruangan_m as ru','ru.id','=','so.objectruanganfk')
            ->JOIN('ruangan_m as ru2','ru2.id','=','so.objectruangantujuanfk')
            ->leftJOIN('pegawai_m as pg','pg.id','=','so.objectpegawaiorderfk')
            ->JOIN('pasiendaftar_t as pd','pd.norec','=','so.noregistrasifk')
            ->JOIN('kelas_m as kl','kl.id','=','pd.objectkelasfk')
            ->leftJOIN('antrianpasiendiperiksa_t as apd', function($join){
                $join->on('apd.noregistrasifk','=','pd.norec')
                    ->on('apd.objectruanganfk', '=', 'so.objectruanganfk');
//                    ->on('apd.objectpegawaifk', '=', 'so.objectpegawaiorderfk');
            })
            ->leftJOIN('kelompokpasien_m as kp','kp.id','=','pd.objectkelompokpasienlastfk')
            ->leftJOIN('strukresep_t as sr','sr.orderfk','=','so.norec')
            ->select('so.noorder','ps.nocm','ps.namapasien','jk.jeniskelamin','ru.namaruangan as namaruanganrawat',
                'so.tglorder','pg.namalengkap','ru2.namaruangan',
                'so.statusorder','so.namapengambilorder','so.noregistrasifk',
                'pd.noregistrasi','kp.kelompokpasien',
                'apd.norec as norec_apd',
                'pd.tglregistrasi','ps.tgllahir','kl.namakelas','kl.id as klid','so.tglambilorder','sr.norec as norecresep','sr.noresep');

        if(isset($request['tglAwal']) && $request['tglAwal']!="" && $request['tglAwal']!="undefined"){
            $data = $data->where('so.tglorder','>=', $request['tglAwal']);
        }
        if(isset($request['tglAkhir']) && $request['tglAkhir']!="" && $request['tglAkhir']!="undefined"){
            $tgl= $request['tglAkhir']." 23:59:59";
            $data = $data->where('so.tglorder','<=', $tgl);
        }
        if(isset($request['nocm']) && $request['nocm']!="" && $request['nocm']!="undefined"){
            $data = $data->where('ps.nocm','like','%'. $request['nocm'].'%');
        }
        if(isset($request['norec_apd']) && $request['norec_apd']!="" && $request['norec_apd']!="undefined"){
            $data = $data->where('apd.norec',$request['norec_apd']);
        }
        $data = $data->where('so.keteranganorder','like', '%'.'Order Farmasi'.'%');
        $data = $data->where('so.objectkelompoktransaksifk', 4);
        $data = $data->get();
        $status ='';

        $result=[];
        foreach ($data as $item){
            $details = DB::select(DB::raw("
                     SELECT so.noorder,op.rke, jk.jeniskemasan, pr.namaproduk, ss.satuanstandar, op.aturanpakai, op.jumlah, op.hargasatuan from strukorder_t as so 
                    left join orderpelayanan_t as op on op.strukorderfk = so.norec
                    left join produk_m as pr on pr.id=op.objectprodukfk
                    left join jeniskemasan_m as jk on jk.id=op.jeniskemasanfk
                    left join satuanstandar_m as ss on ss.id=op.objectsatuanstandarfk
                    where noorder=:noorder"),
                array(
                    'noorder' => $item->noorder,
                )
            );
            if ($item->statusorder == 0){$status='Menunggu';};
            if ($item->statusorder == 5){$status='Verifikasi';};
            if ($item->statusorder == 1){$status='Produksi';};
            if ($item->statusorder == 2){$status='Packaging';};
            if ($item->statusorder == 3){$status='Selesai';};
            if ($item->statusorder == 4){$status='Penyerahan Obat';};
            if ($item->tglambilorder != null){$status='Sudah Di Ambil';};
            $result[] = array(
                'noregistrasi' => $item->noregistrasi,
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
                'norecresep' => $item->norecresep,
                'noresep' => $item->noresep,
                'details' => $details
            );
        }
        return $this->respond($result);
    }


    public function saveStatusResepElektronik(Request $request) {
        DB::beginTransaction();
        $dataReq = $request->all();
        try{
            if(isset($request['strukresep']) && $request['strukresep'] == ''){
                StrukOrder::where('noorder', $request['noorder'])
                    ->update([
                            'statusorder' => $request['statusorder'],
                            'namapengambilorder' => $request['namapengambil'],
                            'tglambilorder' => $request['tglambil'],
                            'tglkontrol' => $request['tglkontrol']
                        ]
                    );
                $data = StrukOrder::where('noorder', $request['noorder'])->first();

                $dt = StrukResep::where('orderfk',$data->norec)->first();

                AntrianApotik::where('noresep',$dt->noresep)
                    ->update([
                            'status' => $request['statusorder']
                        ]
                    );

            }
            if(isset($request['strukresep']) && $request['strukresep'] == true){
                StrukResep::where('noresep', $request['noorder'])
                    ->update([
                            'status' => $request['statusorder'],
                            'namalengkapambilresep' => $request['namapengambil'],
                            'tglambilresep' => $request['tglambil'],
                            'tglkontrol' => $request['tglkontrol']
                        ]
                    );

                AntrianApotik::where('noresep',$request['noorder'])
                    ->update([
                            'status' => $request['statusorder']
                        ]
                    );
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        $transMessage = "Save Status";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "by" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "by" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveSkriningFarmasi(Request $request){
        $detLogin = $request->all();
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id',$dataLogin['userData']['id'])
            ->first();
        DB::beginTransaction();
        try{

            if ($request['norec'] == ''){
                $dataPP = new SkriningFarmasi();
                $dataPP->kdprofile = 0;
                $dataPP->statusenabled = true;
                $dataPP->norec = $dataPP->generateNewId();
            }else{
                $dataPP =  SkriningFarmasi::where('norec',$request['norec'])->first();
            }
            $dataPP->norec_apd = $request['norec'];
            $dataPP->objectruanganfk = $request['objectruanganfk'];
            $dataPP->rpenulis = $request['rpenulis'];
            $dataPP->rpenulis = $request['rpenulis'];
            $dataPP->rmr = $request['rmr'];
            $dataPP->rpasien = $request['rpasien'];
            $dataPP->rtanggallahir = $request['rtanggallahir'];
            $dataPP->rberatbedan = $request['rberatbedan'];
            $dataPP->rdokter = $request['rdokter'];
            $dataPP->rruang = $request['rruang'];
            $dataPP->rstatusjamin = $request['rstatusjamin'];
            $dataPP->robat = $request['robat'];
            $dataPP->rkekuatan = $request['rkekuatan'];
            $dataPP->rjumlahobat = $request['rjumlahobat'];
            $dataPP->rstabilitas = $request['rstabilitas'];
            $dataPP->raturan = $request['raturan'];
            $dataPP->rindikasiobat = $request['rindikasiobat'];
            $dataPP->ralergi = $request['ralergi'];
            $dataPP->rkonsumsi = $request['rkonsumsi'];
            $dataPP->rduplikat = $request['rduplikat'];
            $dataPP->rinteraksi = $request['rinteraksi'];
            $dataPP->rantibiotik = $request['rantibiotik'];
            $dataPP->rpolifarmasi = $request['rpolifarmasi'];
            $dataPP->namapenyekriningresep = $request['namapenyekriningresep'];
            $dataPP->namaperacik = $request['namaperacik'];
            $dataPP->namapengecek = $request['namapengecek'];
            $dataPP->namapenyrahobat = $request['namapenyrahobat'];
            $dataPP->namapenerimaobat = $request['namapenerimaobat'];
            $dataPP->prinsipbesar = $request['prinsipbesar'];
//                $dataPP->strukresepfk = $request['norec'];
//                $dataPP->noresepfk = $request['norec'];
            $dataPP->ketpenulis = $request['ketpenulis'];
            $dataPP->kettanggal = $request['kettanggal'];
            $dataPP->ketrm = $request['ketrm'];
            $dataPP->ketpasien = $request['ketpasien'];
            $dataPP->kettanggallahir = $request['kettanggallahir'];
            $dataPP->ketberat = $request['ketberat'];
            $dataPP->ketdokter = $request['ketdokter'];
            $dataPP->ketruang = $request['ketruang'];
            $dataPP->ketstatus = $request['ketstatus'];
            $dataPP->ketobat = $request['ketobat'];
            $dataPP->ketkekuatan = $request['ketkekuatan'];
            $dataPP->ketjumlah = $request['ketjumlah'];
            $dataPP->ketstabilitas = $request['ketstabilitas'];
            $dataPP->ketaturan = $request['ketaturan'];
            $dataPP->ketalergi = $request['ketalergi'];
            $dataPP->ketkonsumsi = $request['ketkonsumsi'];
            $dataPP->ketduplikasi = $request['ketduplikasi'];
            $dataPP->ketinteraski = $request['ketinteraski'];
            $dataPP->ketantibiotik = $request['ketantibiotik'];
            $dataPP->ketpolifarmasi = $request['ketpolifarmasi'];
            $dataPP->tglinput = date('Y-m-d H:i:s');
            $dataPP->ketindikasi = $request['ketindikasi'];
            $dataPP->rcek = $request['rcek'];
            $dataPP->strukresepfk = $request['strukresepfk'];
            $dataPP->save();
            $idPP=$dataPP->norec;

            //## Logging User
            $newId = LoggingUser::max('id');
            $newId = $newId +1;
            $logUser = new LoggingUser();
            $logUser->id = $newId;
            $logUser->norec = $logUser->generateNewId();
            $logUser->kdprofile= 0;
            $logUser->statusenabled=true;
            $logUser->jenislog = 'Skrining Farmasi';
            $logUser->noreff =$idPP;
            $logUser->referensi='norec skriningfarmasi_t';
            $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
            $logUser->tanggal = date('Y-m-d H:i:s');
            $logUser->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'ea@epic',
            );
        } else {
            $transMessage = "Gagal Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transStatus,
                'as' => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getDataSkriningFarmasi(Request $request){
        $data = \DB::table('skriningfarmasi_t as sf')
            ->select(DB::raw("sf.rpenulis,rtanggalresep,sf.rmr,sf.rpasien,sf.rtanggallahir,sf.rberatbedan,sf.rdokter,sf.rruang,sf.rstatusjamin,sf.robat,sf.rkekuatan,
                     sf.rjumlahobat,sf.rstabilitas,sf.raturan,sf.rindikasiobat,sf.ralergi,sf.rindikasi,sf.rkonsumsi,sf.rduplikat,sf.rinteraksi,sf.rantibiotik,
                     sf.rpolifarmasi,sf.namapenyekriningresep,sf.namaperacik,sf.namapengecek,sf.namapenyrahobat,sf.namapenerimaobat,sf.prinsipbesar,sf.strukresepfk,
                     sf.ketpenulis,sf.kettanggal,sf.ketrm,sf.ketpasien,sf.kettanggallahir,sf.ketberat,sf.ketdokter,sf.ketruang,sf.ketstatus,sf.ketobat,sf.ketkekuatan,sf.ketjumlah,
                     sf.ketstabilitas,sf.ketaturan,sf.ketalergi,sf.ketkonsumsi,sf.ketduplikasi,sf.ketinteraski,sf.ketantibiotik,sf.ketpolifarmasi,sf.tglinput,sf.ketindikasi,sf.rcek"));
        if(isset($request['norecResep']) && $request['norecResep']!="" && $request['norecResep']!="undefined"){
            $data = $data->where('sf.strukresepfk',$request['norecResep']);
        }
        $data = $data->get();
        return $this->respond($data);
    }
    public function getAlamat(Request $request){
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps','ps.id','=','pd.nocmfk')
            ->leftjoin('alamat_m as alm','alm.nocmfk','=','ps.id')
            ->join('kelompokpasien_m as kp','kp.id','=','pd.objectkelompokpasienlastfk')
            ->select('ps.nocm','alm.alamatlengkap','kp.kelompokpasien');
        if(isset($request['noregistrasi']) && $request['noregistrasi']!="" && $request['noregistrasi']!="undefined"){
            $data = $data->where('pd.noregistrasi',$request['noregistrasi']);
        }
        $data = $data->where('pd.statusenabled',true);
        $data = $data->first();
        return $this->respond($data);
    }


}