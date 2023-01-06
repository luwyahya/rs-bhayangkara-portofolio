<?php
/**
 * Created by PhpStorm.
 * User: Egie Ramdan
 * Date: 11/16/2019
 * Time: 3:05 PM
 */

namespace App\Http\Controllers\Perencanaan;

use App\Http\Controllers\ApiController;
use App\Master\KelompokAnggaranHead;
use App\Master\KelompokAnggaranKedua;
use App\Master\KelompokAnggaranKeempat;
use App\Master\KelompokAnggaranKetiga;
use App\Master\KelompokAnggaranPertama;
use App\Master\KelompokAnggaranKelima;
use App\Master\KelompokAnggaranKeenam;
use App\Master\KelompokAnggaranKetujuh;
use App\Transaksi\AntrianPasienDiperiksa;
use App\Transaksi\MataAnggaran;
use App\Transaksi\Realisasi;
use App\Transaksi\KegiatanUnit;
use App\Transaksi\MataAnggaranPerubahan;
use App\Transaksi\PasienDaftar;
use App\Transaksi\PelayananPasien;
use App\Transaksi\PelayananPasienDetail;
use App\Transaksi\PelayananPasienPetugas;
use App\Transaksi\RiwayatRealisasi;
use App\Transaksi\StrukRealisasi;
use App\Transaksi\StrukVerifikasi;
use App\Transaksi\StrukVerifikasiAnggaran;
use Illuminate\Http\Request;
use DB;

use App\Transaksi\StrukOrder;
use App\Transaksi\OrderPelayanan;
use App\Transaksi\OrderProduk;
use App\Master\Pegawai;
use App\Traits\Valet;
use phpDocumentor\Reflection\Types\Null_;
use phpDocumentor\Reflection\Types\Parent_;
use Webpatser\Uuid\Uuid;

class PerencanaanController extends ApiController {
    use Valet;
    public function __construct(){
        parent::__construct($skip_authentication=false);
    }


    public function getPokRKAKL(Request $request)
    {
        $dataLogin = $request->all();
        $data= \DB::table('mataanggaran_t as rk')
            ->JOIN ('kelompokanggaranhead_m as k0','k0.id','=','rk.objectheadfk')
            ->JOIN ('kelompokanggaranpertama_m as k1','k1.id','=','rk.objectchildpertamafk')
            ->JOIN ('kelompokanggarankedua_m as k2','k2.id','=','rk.objectchildkeduafk')
            ->JOIN ('kelompokanggaranketiga_m as k3','k3.id','=','rk.objectchildketigafk')
            ->JOIN ('kelompokanggarankeempat_m as k4','k4.id','=','rk.objectchildkeempatfk')
            ->select( 'rk.norec','k0.kdkelompokhead','k0.id as id0','k0.kelompokhead','k1.id as id1','k1.childpertama',
                'k2.id as id2','k2.childkedua','k3.id as id3','k3.childketiga',
                'k4.id as id4','k4.childkeempat','rk.mataanggaran','rk.saldoawalblu','rk.saldoawalrm',
                'k1.kdchildpertama','k2.kdchildkedua','k3.kdchildketiga','k4.kdchildkeempat',
                'rk.tahun','rk.tglanggaran','rk.revisidivake');

        $saldoBlu = $data->sum('rk.saldoawalblu');
        $saldoRm = $data->sum('rk.saldoawalrm');

        $filter = $request->all();
//        if(isset($filter['tglAwal']) && $filter['tglAwal']!="" && $filter['tglAwal']!="undefined"){
//            $data = $data->where('rk.tglanggaran','>=', $filter['tglAwal']);
//        }
//        if(isset($filter['tglAkhir']) && $filter['tglAkhir']!="" && $filter['tglAkhir']!="undefined"){
//            $tgl= $filter['tglAkhir'];//." 23:59:59";
//            $data = $data->where('rk.tglanggaran','<=', $tgl);
//        }
        if(isset($filter['tahun']) && $filter['tahun']!="" && $filter['tahun']!="undefined"){
            $data = $data->where('rk.tahun','=', $filter['tahun']);
        }
        if(isset($filter['revisike']) && $filter['revisike']!="" && $filter['revisike']!="undefined"){
            $data = $data->where('rk.revisidivake','=', $filter['revisike']);
        }

        if(isset($filter['childPertama']) && $filter['childPertama']!="" && $filter['childPertama']!="undefined"){
            $data = $data->where('k1.id','=', $filter['childPertama']);
        }
        if(isset($filter['childKedua']) && $filter['childKedua']!="" && $filter['childKedua']!="undefined"){
            $data = $data->where('k2.id','=', $filter['childKedua']);
        }
        if(isset($filter['childKetiga']) && $filter['childKetiga']!="" && $filter['childKetiga']!="undefined"){
            $data = $data->where('k3.id','=', $filter['childKetiga']);
        }
        if(isset($filter['childKeempat']) && $filter['childKeempat']!="" && $filter['childKeempat']!="undefined"){
            $data = $data->where('k4.id','=', $filter['childKeempat']);
        }
        if(isset($filter['childMataAnggaran']) && $filter['childMataAnggaran']!="" && $filter['childMataAnggaran']!="undefined"){
            $data = $data->where('rk.mataanggaran','like', '%'.$filter['childMataAnggaran'].'%');
        }

        $data=$data->take(20);
        $data=$data->get();

        $i0=0;
        $s0=0;
        $s1=0;
        $s2=0;
        $a0=[];
        $a1=[];
        $a2=[];
        $a3=[];
        $a4=[];
        $a5=[];
        $t0=0.0;
//        ini_set('max_execution_time', 1000); //6 minutes
        foreach ($data as $item){
            $s0=0;
            $i0=0;
            foreach ($a0 as $a){
                if ($item->id0 == $a0[$i0]['id0']){
                    $s0=1;
                    $a0[$i0]['totalblu'] = $a0[$i0]['totalblu'] + $item->saldoawalblu;
                    $a0[$i0]['totalrm'] = $a0[$i0]['totalrm'] + $item->saldoawalrm;
                }
                $i0 = $i0 + 1;
            }

            foreach ($data as $item1){
                $s1=0;
                $i1=0;
                if ($item1->id0 == $item->id0){
                    foreach ($a1 as $aa){
                        if ( $item1->id1 ==  $a1[$i1]['id1'] ){
                            $s1=1;

                            $a1[$i1]['totalblu'] = $a1[$i1]['totalblu'] + $item1->saldoawalblu;
                            $a1[$i1]['totalrm'] = $a1[$i1]['totalrm'] + $item1->saldoawalrm;
                        }
                        $i1 = $i1 + 1;
                    }
                    foreach ($data as $item2){
                        $s2=0;
                        $i2=0;
                        if ($item1->id0 == $item2->id0 and $item1->id1 == $item2->id1){
                            foreach ($a2 as $aaa){
                                if ($item2->id2 == $a2[$i2]['id2'] ){
                                    $s2=1;
                                    $a2[$i2]['totalblu'] = $a2[$i2]['totalblu'] + $item2->saldoawalblu;
                                    $a2[$i2]['totalrm'] = $a2[$i2]['totalrm'] + $item2->saldoawalrm;
                                }
                                $i2 = $i2 + 1;
                            }
                            foreach ($data as $item3){
                                $s3=0;
                                $i3=0;
                                if ($item3->id0 == $item2->id0 and $item3->id1 == $item2->id1 and  $item3->id2 == $item2->id2){
                                    foreach ($a3 as $aaaa){
                                        if ($item3->id3 == $a3[$i3]['id3']){//$aaaa['id3']   ){
                                            $s3=1;
                                            $a3[$i3]['totalblu'] = $a3[$i3]['totalblu'] + $item3->saldoawalblu;
                                            $a3[$i3]['totalrm'] = $a3[$i3]['totalrm'] + $item3->saldoawalrm;
                                        }
                                        $i3 = $i3 + 1;
                                    }
                                    foreach ($data as $item4){
                                        $s4=0;
                                        $i4=0;
                                        if ($item4->id3 == $item3->id3 and $item4->id0 == $item3->id0 and $item4->id1 == $item4->id1 and  $item4->id2 == $item3->id2){
                                            foreach ($a4 as $aaaaa){
                                                if ($item4->id4 == $a4[$i4]['id4']){
                                                    $s4=1;
                                                    $a4[$i4]['totalblu'] = $a4[$i4]['totalblu'] + $item4->saldoawalblu;
                                                    $a4[$i4]['totalrm'] = $a4[$i4]['totalrm'] + $item4->saldoawalrm;
                                                }
                                                $i4 = $i4 + 1;
                                            }
                                            foreach ($data as $item5){
                                                if ($item5->id4 == $item4->id4 and $item4->id3 == $item5->id3
                                                    and $item4->id0 == $item5->id0 and $item4->id1 == $item5->id1
                                                    and  $item4->id2 == $item5->id2){
                                                    $a5[]= array(
//                                                            'id' => $item5->norec,
//                                                            'id0' => $item5->id0,
//                                                            'kelompokhead' => $item5->kelompokhead,
//                                                            'id1' => $item5->id1,
//                                                            'childpertama' => $item5->childpertama,
//                                                            'id2' => $item5->id2,
//                                                            'childkedua' => $item5->childkedua,
//                                                            'id3' => $item5->id3,
//                                                            'childketiga' => $item5->childketiga,
//                                                            'id4' => $item5->id4,
                                                        'norec' => $item5->norec,
                                                        'mataanggaran' => $item5->mataanggaran,
                                                        'totalblu' => $item5->saldoawalblu,
                                                        'totalrm' => $item5->saldoawalrm,
                                                    );
                                                }
                                            }
                                            if ($s4 == 0 ){
                                                $a4[]= array(
//                                                    'id' => $item4->norec,
//                                                    'id0' => $item4->id0,
//                                                    'kelompokhead' => $item4->kelompokhead,
//                                                    'id1' => $item4->id1,
//                                                    'childpertama' => $item4->childpertama,
//                                                    'id2' => $item4->id2,
//                                                    'childkedua' => $item4->childkedua,
//                                                    'id3' => $item4->id3,
//                                                    'childketiga' => $item4->childketiga,
                                                    'id4' => $item4->id4,
                                                    'kode' => $item4->kdchildkeempat,
                                                    'mataanggaran' => $item4->childkeempat,
                                                    'totalblu' => $item4->saldoawalblu,
                                                    'totalrm' => $item4->saldoawalrm,
                                                    'child' => $a5,
//                                                    'expanded' =>true,
                                                );
                                            }
                                        }
                                        $a5=[];
                                    }
                                    if ($s3 == 0 ){
                                        $a3[]= array(
//                                            'id' => $item3->norec,
//                                            'id0' => $item3->id0,
//                                            'kelompokhead' => $item3->kelompokhead,
//                                            'id1' => $item3->id1,
//                                            'childpertama' => $item3->childpertama,
//                                            'id2' => $item3->id2,
//                                            'childkedua' => $item3->childkedua,
                                            'id3' => $item3->id3,
//                                            'childketiga' => $item3->childketiga,
                                            'kode' => $item3->kdchildketiga,
                                            'mataanggaran' => $item3->childketiga,
                                            'totalblu' => $item3->saldoawalblu,
                                            'totalrm' => $item3->saldoawalrm,
                                            'child' => $a4,
//                                            'expanded' =>true,
                                        );
                                    }
                                }
                                $a4=[];
                            }
                            if ($s2 == 0 ){
                                $a2[]= array(
//                                    'id' => $item2->norec,
//                                    'id0' => $item2->id0,
//                                    'kelompokhead' => $item2->kelompokhead,
//                                    'id1' => $item2->id1,
//                                    'childpertama' => $item2->childpertama,
                                    'id2' => $item2->id2,
//                                    'childkedua' => $item2->childkedua,
                                    'kode' => $item2->kdchildkedua,
                                    'mataanggaran' => $item2->childkedua,
                                    'totalblu' => $item2->saldoawalblu,
                                    'totalrm' => $item2->saldoawalrm,
                                    'child' => $a3,
//                                    'expanded' =>true,
                                );
                            }
                            $a3=[];
                        }
                    }
                    if ($s1 == 0){
                        $a1[]= array(
//                            'id' => $item1->norec,
//                            'id0' => $item1->id0,
//                            'kelompokhead' => $item1->kelompokhead,
                            'id1' => $item1->id1,
//                            'childpertama' => $item1->childpertama,
                            'kode' => $item1->kdchildpertama,
                            'mataanggaran' =>$item1->childpertama,
                            'totalblu' => $item1->saldoawalblu,
                            'totalrm' => $item1->saldoawalrm,
                            'child' => $a2,
//                            'expanded' =>true,
                        );
                    }
                }
                $a2=[];
            }
            if ($s0 == 0){
                $a0[]= array(
//                    'id' => $item->norec,
                    'id0' => $item->id0,
                    'kode'=> $item->kdkelompokhead,
//                    'kelompokhead' => $item->kelompokhead,
                    'mataanggaran' => $item->kelompokhead,
                    'totalblu' => $item->saldoawalblu,
                    'totalrm' => $item->saldoawalrm,
                    'grandtotalblu' => $saldoBlu,
                    'grandtotalrm' => $saldoRm,
                    'child' => $a1,
//                    'expanded' =>true,
                );
            }
            $a1 =[];
        }


        return $this->respond($a0);
    }

    public function saveChild(Request $request) {
        DB::beginTransaction();
       try{
            if ($request['norec']==''){
                $MA = new MataAnggaran();
                $MA->norec = $MA->generateNewId();
                $MA->kdprofile = 0;
                $MA->statusenabled = true;
                $MA->objectheadfk =  $request['objectheadfk'];

            }else{
                $MA= MataAnggaran::where('norec',$request['norec'])
                    ->first();
            }
            $MA->objectchildpertamafk = $request['objectchildpertamafk'];
            $MA->objectchildkeduafk =  $request['objectchildkeduafk'] != '' ? $request['objectchildkeduafk'] : null;
            $MA->objectchildketigafk =  $request['objectchildketigafk'] != '' ? $request['objectchildketigafk'] : null;
            $MA->objectchildkeempatfk =  $request['objectchildkeempatfk'] != '' ? $request['objectchildkeempatfk'] : null;
            $MA->objectchildkelimafk =  $request['objectchildkelimafk'] != '' ? $request['objectchildkelimafk'] : null;
            $MA->objectchildkeenamfk =  $request['objectchildkeenamfk'] != '' ? $request['objectchildkeenamfk'] : null;
            $MA->objectchildketujuhfk =  $request['objectchildketujuhfk'] != '' ? $request['objectchildketujuhfk'] : null; 
            $MA->mataanggaran =  $request['mataanggaran'] != '' ? $request['mataanggaran'] : null;
            $MA->revisidivake =  $request['revisidivake'] != '' ? $request['revisidivake'] : null;
            $MA->objectasalprodukfk =  $request['objectasalprodukfk'] != '' ? $request['objectasalprodukfk'] : null;
            $MA->saldoawalblu =  $request['saldoawalblu'];
            $MA->saldoawalrm =  $request['saldoawalrm'];
            $MA->tglanggaran = date('Y-m-d H:i:s');
            $MA->tahun =  $request['tahun'];
            $MA->kode =   $request['objectchildpertamafk'].$request['objectchildkeduafk'].$request['objectchildketigafk'].$request['objectchildkeempatfk'].$request['objectchildkelimafk'].$request['objectchildkeenamfk'].$request['objectchildketujuhfk'];
            $MA->objectpengendalifk = $request['pengendali'] != '' ? $request['pengendali'] : null;
            $MA->isbiayaoperasional = $request['isoperasional'] != '' ? $request['isoperasional'] : null;
            $MA->jenisbiaya = $request['jenisbiaya'];
            $MA->volume = $request['volume'];
            $MA->pengali = $request['pengali'];
            $MA->satuan = $request['satuan'];
            $MA->hargasatuan = $request['hargasatuan'];

            $MA->save();
           $transStatus = 'true';
       } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan Mata Anggaran";
       }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Mata Anggaran Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $MA,
                'as' => 'ramdanegie',
            );
        } else {
            $transMessage = "Simpan Mata Anggaran Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'result' => $MA,
                'as' => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
//        return $this->respond($requestAll);
    }
    public function getDataCombo(Request $request)
    {
        $dataLogin = $request->all();
        $head = \DB::table('kelompokanggaranhead_m as dp')
            ->select('dp.id','dp.kdkelompokhead','dp.kelompokhead','dp.kodeexternal','dp.namaexternal', DB::raw("CONCAT(dp.kdkelompokhead,' ',dp.kelompokhead) as nama") )
            ->where('dp.statusenabled', true)
            //->orderBy('dp.kelompokhead')
            ->orderBy('id','desc')
            ->get();
        $pertama = \DB::table('kelompokanggaranpertama_m as ru')
            ->JOIN('kelompokanggaranhead_m as k0', 'k0.id','=','ru.objectheadfk')
            ->select('ru.id','ru.kdchildpertama','ru.childpertama','ru.kodeexternal','ru.namaexternal','k0.id as idparent','k0.kdkelompokhead','k0.kelompokhead', DB::raw("CONCAT(k0.kdkelompokhead,' || ',ru.kdchildpertama,' ',ru.childpertama) as nama"))
            ->where('ru.statusenabled', true)
            //->orderBy('ru.childpertama')
            ->orderBy('id','desc')
            ->get();
        $kedua = \DB::table('kelompokanggarankedua_m as ru')
            ->JOIN('kelompokanggaranpertama_m as k1','k1.id','=','ru.objectchildpertamafk')
            ->JOIN('kelompokanggaranhead_m as k0', 'k0.id','=','k1.objectheadfk')
            ->select('ru.id','ru.kdchildkedua','ru.childkedua','ru.kodeexternal','ru.namaexternal','k1.id as idparent','k1.kdchildpertama','k1.childpertama', DB::raw("CONCAT(k0.kdkelompokhead,' || ',k1.kdchildpertama,' || ', ru.kdchildkedua,' ',ru.childkedua) as nama"))
            ->where('ru.statusenabled', true)
            //->orderBy('ru.childkedua')
            ->orderBy('id','desc')
            ->get();
        $ketiga = \DB::table('kelompokanggaranketiga_m as ru')
            ->JOIN('kelompokanggarankedua_m as k2','k2.id','=','ru.objectchildkeduafk')
            ->JOIN('kelompokanggaranpertama_m as k1','k1.id','=','k2.objectchildpertamafk')
            ->select('ru.id','ru.childketiga','ru.kdchildketiga','ru.kodeexternal','ru.namaexternal','k2.id as idparent','k2.kdchildkedua','k2.childkedua', DB::raw("CONCAT(k1.kdchildpertama,' || ',k2.kdchildkedua,' || ',ru.kdchildketiga,' ',ru.childketiga) as nama"))
            ->where('ru.statusenabled', true)
            //->orderBy('ru.childketiga')
            ->orderBy('id','desc')
            ->get();

        $keempat = \DB::table('kelompokanggarankeempat_m as ru')
            ->JOIN('kelompokanggaranketiga_m as k3','k3.id','=','ru.objectchildketigafk')
            ->JOIN('kelompokanggarankedua_m as k2','k2.id','=','k3.objectchildkeduafk')
            ->select('ru.id','ru.kdchildkeempat','ru.childkeempat','ru.kodeexternal','ru.namaexternal','k3.id as idparent','k3.kdchildketiga','k3.childketiga', DB::raw("CONCAT(k2.kdchildkedua,' || ',k3.kdchildketiga,' || ',ru.kdchildkeempat,' ',ru.childkeempat) as nama"))
            ->where('ru.statusenabled', true)
            //->orderBy('ru.childkeempat')
            ->orderBy('id','desc')
            ->get();
        $kelima = \DB::table('kelompokanggarankelima_m as ru')
            ->JOIN('kelompokanggarankeempat_m as k4','k4.id','=','ru.objectchildkeempatfk')
            ->JOIN('kelompokanggaranketiga_m as k3','k3.id','=','k4.objectchildketigafk')
            ->select('ru.id','ru.kdchildkelima','ru.childkelima','ru.kodeexternal','ru.namaexternal','k4.id as idparent','k4.kdchildkeempat','k4.childkeempat', DB::raw("CONCAT(k3.kdchildketiga,' || ',k4.kdchildkeempat,' || ',ru.kdchildkelima,' ',ru.childkelima) as nama"))
            ->where('ru.statusenabled', true)
            //->orderBy('ru.childkelima')
            ->orderBy('id','desc')
            ->get();

        $keenam = \DB::table('kelompokanggarankeenam_m as ru')
            ->JOIN('kelompokanggarankelima_m as k5','k5.id','=','ru.objectchildkelimafk')
            ->JOIN('kelompokanggarankeempat_m as k4','k4.id','=','k5.objectchildkeempatfk')
            ->select('ru.id','ru.kdchildkeenam','ru.childkeenam','ru.kodeexternal','ru.namaexternal','k5.id as idparent','k5.kdchildkelima','k5.childkelima', DB::raw("CONCAT(k4.kdchildkeempat,' || ',k5.kdchildkelima,' || ',ru.kdchildkeenam,' ',ru.childkeenam) as nama"))
            ->where('ru.statusenabled', true)
            //->orderBy('ru.childkeenam')
            ->orderBy('id','desc')
            ->get();

        $ketujuh = \DB::table('kelompokanggaranketujuh_m as ru')
            ->JOIN('kelompokanggarankeenam_m as k6','k6.id','=','ru.objectchildkeenamfk')
            ->JOIN('kelompokanggarankelima_m as k5','k5.id','=','k6.objectchildkelimafk')
            ->select('ru.id','ru.kdchildketujuh','ru.childketujuh','ru.kodeexternal','ru.namaexternal','k6.id as idparent','k6.kdchildkeenam','k6.childkeenam', DB::raw("CONCAT(k5.kdchildkelima,' || ',k6.kdchildkeenam,' || ',ru.kdchildketujuh,' ',ru.childketujuh) as nama"))
            ->where('ru.statusenabled', true)
            //->orderBy('ru.childkeenam')
            ->orderBy('id','desc')
            ->get();

        $Pengendali = \DB::table('pengendali_m as ru')
            ->select('ru.id','ru.pengendali')
            ->where('ru.statusenabled', true)
            ->orderBy('ru.pengendali')
            ->get();


        $result = array(
            'kelompokhead' => $head,
            'kelompokpertama' => $pertama,
            'kelompokkedua' => $kedua,
            'kelompokketiga' => $ketiga,
            'kelompokkeempat' => $keempat,
            'kelompokkelima' => $kelima,
            'kelompokkeenam' => $keenam,
            'kelompokketujuh' => $ketujuh,

            'datalogin' => $dataLogin,
            'pengendali' => $Pengendali,
            'message' => 'ramdanegie',
        );

        return $this->respond($result);
    }
    public function deleteChildAnggaran(Request $request) {
        $dataLogin = $request->all();
        DB::beginTransaction();
        try{
            if ($request['norec'] != ''){
                $data1 = MataAnggaran::where('norec', $request['norec'])->update(['statusenabled'=>false]);
                $transStatus = 'true';
            }
        }
        catch(\Exception $e){
            $transStatus= 'false';
        }
        if ($transStatus=='true')
        {    DB::commit();
            $transMessage = "Data Terhapus";
        }
        else{
            DB::rollBack();
            $transMessage = "Data Gagal Dihapus";
        }

        return $this->setStatusCode(201)->respond([], $transMessage);
    }
    public function getKelAnggaranKeempat(Request $request) {
        $req=$request->all();
        $keempat = \DB::table('kelompokanggarankeempat_m as ru')
            ->select('ru.id','ru.kdchildkeempat','ru.childkeempat')
            ->where('ru.statusenabled', true)
            ->orderBy('ru.childkeempat');

        if(isset($req['childkeempat']) &&
            $req['childkeempat']!="" &&
            $req['childkeempat']!="undefined"){
            $keempat = $keempat->where('ru.childkeempat','like','%'. $req['childkeempat'] .'%');
        };

        if(isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value']!="" &&
            $req['filter']['filters'][0]['value']!="undefined"){
            $keempat = $keempat->where('ru.childkeempat','like','%'.$req['filter']['filters'][0]['value'].'%' );
        };

        $keempat = $keempat->take(20);
        $keempat = $keempat->get();

        foreach ($keempat as $item){
            $data[]=array(
                'id' => $item->id,
                'kdchildkeempat' => $item->kdchildkeempat,
                'childkeempat' =>$item->kdchildkeempat.' - '.$item->childkeempat,
            );
        }
        return $this->respond($data);
    }
    public function getChildByNorec(Request $request)
    {
        $dataLogin = $request->all();
        $data= \DB::table('mataanggaran_t as rk')
            ->JOIN ('kelompokanggaranhead_m as k0','k0.id','=','rk.objectheadfk')
            ->JOIN ('kelompokanggaranpertama_m as k1','k1.id','=','rk.objectchildpertamafk')
            ->JOIN ('kelompokanggarankedua_m as k2','k2.id','=','rk.objectchildkeduafk')
            ->JOIN ('kelompokanggaranketiga_m as k3','k3.id','=','rk.objectchildketigafk')
            ->JOIN ('kelompokanggarankeempat_m as k4','k4.id','=','rk.objectchildkeempatfk')
            ->select( 'rk.norec','k0.kdkelompokhead','k0.id as id0','k0.kelompokhead','k1.id as id1','k1.childpertama',
                'k2.id as id2','k2.childkedua','k3.id as id3','k3.childketiga',
                'k4.id as id4','k4.childkeempat','rk.mataanggaran','rk.saldoawalblu','rk.saldoawalrm',
                'k1.kdchildpertama','k2.kdchildkedua','k3.kdchildketiga','k4.kdchildkeempat',
                'rk.tahun','rk.tglanggaran','rk.revisidivake')
            ->where('rk.norec',$request['norec'])
            ->get();


        $result = array(
            'data' => $data,
            'message' => 'ramdanegie',
        );

        return $this->respond($result);
    }

    public function getChildByNoName(Request $request)
    {
        $dataLogin = $request->all();

        $data= \DB::table('mataanggaran_t as rk')
            ->LEFTJOIN ('kelompokanggaranhead_m as k0','k0.id','=','rk.objectheadfk')
            ->LEFTJOIN ('kelompokanggaranpertama_m as k1','k1.id','=','rk.objectchildpertamafk')
            ->LEFTJOIN ('kelompokanggarankedua_m as k2','k2.id','=','rk.objectchildkeduafk')
            ->LEFTJOIN ('kelompokanggaranketiga_m as k3','k3.id','=','rk.objectchildketigafk')
            ->LEFTJOIN ('kelompokanggarankeempat_m as k4','k4.id','=','rk.objectchildkeempatfk')
            ->LEFTJOIN ('kelompokanggarankelima_m as k5','k5.id','=','rk.objectchildkelimafk')
            ->LEFTJOIN ('kelompokanggarankeenam_m as k6','k6.id','=','rk.objectchildkeenamfk')
            ->LEFTJOIN ('kelompokanggaranketujuh_m as k7','k7.id','=','rk.objectchildketujuhfk')
            ->select( 'rk.norec','k0.kdkelompokhead','k0.id as id0','k0.kelompokhead','k1.id as id1','k1.childpertama',
                'k2.id as id2','k2.childkedua','k3.id as id3','k3.childketiga',
                'k4.id as id4','k4.childkeempat','k5.id as id5','k5.childkelima','k6.id as id6','k6.childkeenam','k7.id as id7','k7.childketujuh','rk.mataanggaran','rk.saldoawalblu','rk.saldoawalrm',
                'k1.kdchildpertama','k2.kdchildkedua','k3.kdchildketiga','k4.kdchildkeempat','k5.kdchildkelima','k6.kdchildkeenam','k7.kdchildketujuh',
                'rk.tahun','rk.tglanggaran','rk.revisidivake');

        if($request['no']== 2){
            $data= $data->where('k1.childpertama', $request['desk']);
        }
        if($request['no']== 3){
            $data= $data->where('k2.childkedua', $request['desk']);
        }
        if($request['no']== 4){
            $data= $data->where('k3.childketiga', $request['desk']);
        }
        if($request['no']== 5){
            $data= $data->where('k4.childkeempat', $request['desk']);
        }
        if($request['no']== 6){
            $data= $data->where('k5.childkelima', $request['desk']);
        }
        if($request['no']== 7){
            $data= $data->where('k6.childkeenam', $request['desk']);
        }
        if($request['no']== 8){
            $data= $data->where('k7.childketujuh', $request['desk']);
        }

        $data = $data->get();

        $result = array(
            'data' => $data,
            'message' => 'dy',
        );

        return $this->respond($result);
    }

    public function getDaftarMataAnggaran(Request $request){
        $dataLogin = $request->all();
        $Pengendali =  ' ';
        $tahun =  ' ';
        $revisiDiva =  ' ';

        if (isset($request['tahun']) && $request['tahun'] != "" && $request['tahun'] != "undefined") {
            $tahun =  ' where tahun =  ' . $request['tahun'];
        }

        if (isset($request['Pengendali']) && $request['Pengendali'] != "" && $request['Pengendali'] != "undefined") {
            $Pengendali =  ' and objectpengendalifk =  ' . $request['Pengendali'];
        }
      
        if (isset($request['revisike']) && $request['revisike'] != "" && $request['revisike'] != "undefined") {
            $revisiDiva =  ' and revisidivake =  ' . $request['revisike'];
        }

        $data = DB::select(DB::raw("select x.kode, x.kd,x.desk,x.totalblu,x.totalrm,x.tahun,x.revisidivake,x.objectpengendalifk from
                    (
											select left(mat.kode,1) + '00000000000000' as kode, ka.kdkelompokhead as kd, upper(ka.kelompokhead) as desk,
											sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake,
											mat.objectpengendalifk
											from mataanggaran_t as mat
											INNER JOIN kelompokanggaranhead_m as ka on ka.id =mat.objectheadfk
											group by left(mat.kode,1),ka.kdkelompokhead,ka.kelompokhead,mat.tahun,mat.revisidivake,
											mat.objectpengendalifk
											--- *** ---
											union all
											--- *** ---
											select left(mat.kode,1)+ '000000000000' as kode,'-' + ka.kdchildpertama as kd,upper(ka.childpertama) as desk,
											sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake,mat.objectpengendalifk
											from mataanggaran_t as mat
											INNER JOIN kelompokanggaranpertama_m ka on ka.id =mat.objectchildpertamafk
											group by left(mat.kode,1),ka.kdchildpertama,ka.childpertama,mat.tahun,mat.revisidivake,mat.objectpengendalifk
										--- *** ---
											union all
											--- *** ---
											select  left(mat.kode,1) + '0000000000'as kode,
											case when ka.kodeexternal is not null and  ka.kdchildkedua is not NULL then '--' + ka.kodeexternal + ' || ' + ka.kdchildkedua 
											when ka.kodeexternal is not null and  ka.kdchildkedua is NULL then '--' + ka.kodeexternal 
											when ka.kodeexternal is  null and  ka.kdchildkedua is not NULL then '--' + ka.kdchildkedua end 
											as kd,

											case when ka.childkedua is not null and  ka.namaexternal is not NULL then  ka.childkedua  + ka.namaexternal 
											when ka.childkedua is not null and  ka.namaexternal is NULL then  ka.childkedua
											when ka.childkedua is  null and  ka.namaexternal is not NULL then  ka.namaexternal end 
											as desk,
									
											sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake,mat.objectpengendalifk
											from mataanggaran_t as mat
											INNER JOIN kelompokanggarankedua_m ka on ka.id =mat.objectchildkeduafk
											group by left(mat.kode,1),ka.kdchildkedua,ka.childkedua,mat.tahun,mat.revisidivake,ka.kodeexternal,mat.objectpengendalifk,ka.namaexternal
											--- *** ---
										 union all
											--- *** ---
											 select  left(mat.kode,1) + '00000000'as kode,
											case when ka.kodeexternal is not null and  ka.kdchildketiga is not NULL then '---' + ka.kodeexternal + ' || ' + ka.kdchildketiga 
											when ka.kodeexternal is not null and  ka.kdchildketiga is NULL then '---' + ka.kodeexternal 
											when ka.kodeexternal is  null and  ka.kdchildketiga is not NULL then '---' + ka.kdchildketiga end 
											as kd,

											case when ka.childketiga is not null and  ka.namaexternal is not NULL then  ka.childketiga  + ka.namaexternal 
											when ka.childketiga is not null and  ka.namaexternal is NULL then  ka.childketiga
											when ka.childketiga is  null and  ka.namaexternal is not NULL then  ka.namaexternal end 
											as desk,
											
											sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake,mat.objectpengendalifk
											from mataanggaran_t as mat
											INNER JOIN kelompokanggaranketiga_m ka on ka.id =mat.objectchildketigafk
											group by left(mat.kode,1),ka.kdchildketiga,ka.childketiga,mat.tahun,mat.revisidivake,ka.kodeexternal,mat.objectpengendalifk,ka.namaexternal

									 union all
					
											select  left(mat.kode,1) + '000000'as kode,
										  case when ka.kodeexternal is not null and  ka.kdchildkeempat is not NULL then '----' + ka.kodeexternal + ' || ' + ka.kdchildkeempat 
											when ka.kodeexternal is not null and  ka.kdchildkeempat is NULL then '----' + ka.kodeexternal 
											when ka.kodeexternal is  null and  ka.kdchildkeempat is not NULL then '----' + ka.kdchildkeempat end 
											as kd,

											case when ka.childkeempat is not null and  ka.namaexternal is not NULL then  ka.childkeempat  + ka.namaexternal 
											when ka.childkeempat is not null and  ka.namaexternal is NULL then  ka.childkeempat
											when ka.childkeempat is  null and  ka.namaexternal is not NULL then  ka.namaexternal end 
											as desk,
				
											sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake,mat.objectpengendalifk
											from mataanggaran_t as mat
											INNER JOIN kelompokanggarankeempat_m ka on ka.id =mat.objectchildkeempatfk
											group by left(mat.kode,1),ka.kdchildkeempat,ka.childkeempat,mat.tahun,mat.revisidivake,ka.kodeexternal,mat.objectpengendalifk,ka.namaexternal
											
										union ALL

											select  left(mat.kode,1) + '0000'as kode,
									   	case when ka.kodeexternal is not null and  ka.kdchildkelima is not NULL then '-----' + ka.kodeexternal + ' || ' + ka.kdchildkelima 
											when ka.kodeexternal is not null and  ka.kdchildkelima is NULL then '-----' + ka.kodeexternal 
											when ka.kodeexternal is  null and  ka.kdchildkelima is not NULL then '-----' + ka.kdchildkelima end 
											as kd,

											case when ka.childkelima is not null and  ka.namaexternal is not NULL then  ka.childkelima  + ka.namaexternal 
											when ka.childkelima is not null and  ka.namaexternal is NULL then  ka.childkelima
											when ka.childkelima is  null and  ka.namaexternal is not NULL then  ka.namaexternal end 
											as desk,
														--'--------' + ka.kodeexternal + ' || ' + ka.kdchildkelima as kd,ka.childkelima + ka.namaexternal as desk,
											sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake,mat.objectpengendalifk
											from mataanggaran_t as mat
											INNER JOIN kelompokanggarankelima_m ka on ka.id =mat.objectchildkelimafk
											group by left(mat.kode,1),ka.kdchildkelima,ka.childkelima,mat.tahun,mat.revisidivake,ka.kodeexternal,mat.objectpengendalifk,ka.namaexternal

										union ALL

											 select  left(mat.kode,1) + '00'as kode,
										case when ka.kodeexternal is not null and  ka.kdchildkeenam is not NULL then '------' + ka.kodeexternal + ' || ' + ka.kdchildkeenam 
											when ka.kodeexternal is not null and  ka.kdchildkeenam is NULL then '------' + ka.kodeexternal 
											when ka.kodeexternal is  null and  ka.kdchildkeenam is not NULL then '------' + ka.kdchildkeenam end 
											as kd,

											case when ka.childkeenam is not null and  ka.namaexternal is not NULL then  ka.childkeenam  + ka.namaexternal 
											when ka.childkeenam is not null and  ka.namaexternal is NULL then  ka.childkeenam
											when ka.childkeenam is  null and  ka.namaexternal is not NULL then  ka.namaexternal end 
											as desk,
									--'----------' + ka.kodeexternal + ' || ' + ka.kdchildkeenam as kd,ka.childkeenam + ka.namaexternal as desk,
											sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake,mat.objectpengendalifk
											from mataanggaran_t as mat
											INNER JOIN kelompokanggarankeenam_m ka on ka.id =mat.objectchildkeenamfk
											group by left(mat.kode,1),ka.kdchildkeenam,ka.childkeenam,mat.tahun,mat.revisidivake,ka.kodeexternal,mat.objectpengendalifk,ka.namaexternal  
								        
								        union ALL

											 select  left(mat.kode,1) + '00'as kode,
										case when ka.kodeexternal is not null and  ka.kdchildketujuh is not NULL then '------' + ka.kodeexternal + ' || ' + ka.kdchildketujuh 
											when ka.kodeexternal is not null and  ka.kdchildketujuh is NULL then '------' + ka.kodeexternal 
											when ka.kodeexternal is  null and  ka.kdchildketujuh is not NULL then '------' + ka.kdchildketujuh end 
											as kd,

											case when ka.childketujuh is not null and  ka.namaexternal is not NULL then  ka.childketujuh  + ka.namaexternal 
											when ka.childketujuh is not null and  ka.namaexternal is NULL then  ka.childketujuh
											when ka.childketujuh is  null and  ka.namaexternal is not NULL then  ka.namaexternal end 
											as desk,
									--'----------' + ka.kodeexternal + ' || ' + ka.kdchildkeenam as kd,ka.childkeenam + ka.namaexternal as desk,
											sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake,mat.objectpengendalifk
											from mataanggaran_t as mat
											INNER JOIN kelompokanggaranketujuh_m ka on ka.id =mat.objectchildketujuhfk
											group by left(mat.kode,1),ka.kdchildketujuh,ka.childketujuh,mat.tahun,mat.revisidivake,ka.kodeexternal,mat.objectpengendalifk,ka.namaexternal  
								
								union ALL
										select left(mat.kode,9) + '~' + norec as kode,'---------------'  as kd,mat.mataanggaran as desk,
                    sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake,mat.objectpengendalifk
                    from mataanggaran_t as mat
                    group by left(mat.kode,9) + '~' +  norec,mat.kode,mat.mataanggaran,mat.tahun,mat.revisidivake,mat.objectpengendalifk
                  ) as x
                    $tahun
                    $revisiDiva
                    $Pengendali      
                GROUP BY x.kode,x.kd,x.desk,x.totalblu,x.totalrm,x.tahun,x.revisidivake,x.objectpengendalifk
            order by x.kd asc;
            
            "));

        foreach ($data as $key => $row) {
            $count[$key] = $row->kd;
        }

//        if ($count[$key] != ''){
            array_multisort($count, SORT_DESC, $data);
//        }
        $result = array(
            'data' => $data,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }

    public function getDaftarMataAnggaranNew(Request $request){
        $dataLogin = $request->all();
        $Pengendali =  ' ';
        $tahun =  ' ';
        $revisiDiva =  ' ';
        $loopingan = 0 ;

        if (isset($request['tahun']) && $request['tahun'] != "" && $request['tahun'] != "undefined") {
            $tahun =  ' where tahun =  ' . $request['tahun'];
        }


        if (isset($request['revisike']) && $request['revisike'] != "" && $request['revisike'] != "undefined") {
            $revisiDiva =  ' and revisidivake =  ' . $request['revisike'];
        }

        if (isset($request['Pengendali']) && $request['Pengendali'] != "" && $request['Pengendali'] != "undefined") {
            $Pengendali =  ' and objectpengendalifk =  ' . $request['Pengendali'];

            $data = DB::select(DB::raw("select x.no, x.kd,x.desk,x.totalblu,x.totalrm,x.tahun,x.revisidivake,x.objectpengendalifk from
                    (
											select 1 as no, ka.kdkelompokhead as kd, upper(ka.kelompokhead) as desk,
											sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake,
											mat.objectpengendalifk
											from mataanggaran_t as mat
											INNER JOIN kelompokanggaranhead_m as ka on ka.id =mat.objectheadfk
                                            WHERE mat.statusenabled = 1
											group by ka.kdkelompokhead,ka.kelompokhead,mat.tahun,mat.revisidivake,
											mat.objectpengendalifk
											--- *** ---
											union all
											--- *** ---
											select 2 as no, ka.kdchildpertama as kd,upper(ka.childpertama) as desk,
											sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake,mat.objectpengendalifk
											from mataanggaran_t as mat
											INNER JOIN kelompokanggaranpertama_m ka on ka.id =mat.objectchildpertamafk
                                            WHERE mat.statusenabled = 1
											group by ka.kdchildpertama,ka.childpertama,mat.tahun,mat.revisidivake,mat.objectpengendalifk
										--- *** ---
											union all
											--- *** ---
											select 3 as no,
											case when ka.kodeexternal is not null and  ka.kdchildkedua is not NULL then ka.kdchildkedua 
											when ka.kodeexternal is not null and  ka.kdchildkedua is NULL then '--' + ka.kodeexternal 
											when ka.kodeexternal is  null and  ka.kdchildkedua is not NULL then ka.kdchildkedua end 
											as kd,

											case when ka.childkedua is not null and  ka.namaexternal is not NULL then  ka.childkedua  + ka.namaexternal 
											when ka.childkedua is not null and  ka.namaexternal is NULL then  ka.childkedua
											when ka.childkedua is  null and  ka.namaexternal is not NULL then  ka.namaexternal end 
											as desk,
									
											sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake,mat.objectpengendalifk
											from mataanggaran_t as mat
											INNER JOIN kelompokanggarankedua_m ka on ka.id =mat.objectchildkeduafk
                                            WHERE mat.statusenabled = 1
											group by ka.kdchildkedua,ka.childkedua,mat.tahun,mat.revisidivake,ka.kodeexternal,mat.objectpengendalifk,ka.namaexternal
											--- *** ---
										 union all
											--- *** ---
											 select 4 as no, 
											case when ka.kodeexternal is not null and  ka.kdchildketiga is not NULL then ka.kdchildketiga 
											when ka.kodeexternal is not null and  ka.kdchildketiga is NULL then '---' + ka.kodeexternal 
											when ka.kodeexternal is  null and  ka.kdchildketiga is not NULL then ka.kdchildketiga end 
											as kd,

											case when ka.childketiga is not null and  ka.namaexternal is not NULL then  ka.childketiga  + ka.namaexternal 
											when ka.childketiga is not null and  ka.namaexternal is NULL then  ka.childketiga
											when ka.childketiga is  null and  ka.namaexternal is not NULL then  ka.namaexternal end 
											as desk,
											
											sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake,mat.objectpengendalifk
											from mataanggaran_t as mat
											INNER JOIN kelompokanggaranketiga_m ka on ka.id =mat.objectchildketigafk
                                            WHERE mat.statusenabled = 1
											group by ka.kdchildketiga,ka.childketiga,mat.tahun,mat.revisidivake,ka.kodeexternal,mat.objectpengendalifk,ka.namaexternal

									 union all
					
											select 5 as no,
										  case when ka.kodeexternal is not null and  ka.kdchildkeempat is not NULL then ka.kdchildkeempat 
											when ka.kodeexternal is not null and  ka.kdchildkeempat is NULL then '----' + ka.kodeexternal 
											when ka.kodeexternal is  null and  ka.kdchildkeempat is not NULL then ka.kdchildkeempat end 
											as kd,

											case when ka.childkeempat is not null and  ka.namaexternal is not NULL then  ka.childkeempat  + ka.namaexternal 
											when ka.childkeempat is not null and  ka.namaexternal is NULL then  ka.childkeempat
											when ka.childkeempat is  null and  ka.namaexternal is not NULL then  ka.namaexternal end 
											as desk,
				
											sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake,mat.objectpengendalifk
											from mataanggaran_t as mat
											INNER JOIN kelompokanggarankeempat_m ka on ka.id =mat.objectchildkeempatfk
                                            WHERE mat.statusenabled = 1
											group by ka.kdchildkeempat,ka.childkeempat,mat.tahun,mat.revisidivake,ka.kodeexternal,mat.objectpengendalifk,ka.namaexternal
											
										union ALL

											select 6 as no,
									   	case when ka.kodeexternal is not null and  ka.kdchildkelima is not NULL then ka.kdchildkelima 
											when ka.kodeexternal is not null and  ka.kdchildkelima is NULL then '-----' + ka.kodeexternal 
											when ka.kodeexternal is  null and  ka.kdchildkelima is not NULL then ka.kdchildkelima end 
											as kd,

											case when ka.childkelima is not null and  ka.namaexternal is not NULL then  ka.childkelima  + ka.namaexternal 
											when ka.childkelima is not null and  ka.namaexternal is NULL then  ka.childkelima
											when ka.childkelima is  null and  ka.namaexternal is not NULL then  ka.namaexternal end 
											as desk,
														--'--------' + ka.kodeexternal + ' || ' + ka.kdchildkelima as kd,ka.childkelima + ka.namaexternal as desk,
											sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake,mat.objectpengendalifk
											from mataanggaran_t as mat
											INNER JOIN kelompokanggarankelima_m ka on ka.id =mat.objectchildkelimafk
                                            WHERE mat.statusenabled = 1
											group by ka.kdchildkelima,ka.childkelima,mat.tahun,mat.revisidivake,ka.kodeexternal,mat.objectpengendalifk,ka.namaexternal

										union ALL

											 select 7 as no, 
										case when ka.kodeexternal is not null and  ka.kdchildkeenam is not NULL then ka.kdchildkeenam 
											when ka.kodeexternal is not null and  ka.kdchildkeenam is NULL then '------' + ka.kodeexternal 
											when ka.kodeexternal is  null and  ka.kdchildkeenam is not NULL then ka.kdchildkeenam end 
											as kd,

											case when ka.childkeenam is not null and  ka.namaexternal is not NULL then  ka.childkeenam  + ka.namaexternal 
											when ka.childkeenam is not null and  ka.namaexternal is NULL then  ka.childkeenam
											when ka.childkeenam is  null and  ka.namaexternal is not NULL then  ka.namaexternal end 
											as desk,
									--'----------' + ka.kodeexternal + ' || ' + ka.kdchildkeenam as kd,ka.childkeenam + ka.namaexternal as desk,
											sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake,mat.objectpengendalifk
											from mataanggaran_t as mat
											INNER JOIN kelompokanggarankeenam_m ka on ka.id =mat.objectchildkeenamfk
                                            WHERE mat.statusenabled = 1
											group by ka.kdchildkeenam,ka.childkeenam,mat.tahun,mat.revisidivake,ka.kodeexternal,mat.objectpengendalifk,ka.namaexternal
								        
								        union ALL

											 select 8 as no, 
										case when ka.kodeexternal is not null and  ka.kdchildketujuh is not NULL then ka.kdchildketujuh 
											when ka.kodeexternal is not null and  ka.kdchildketujuh is NULL then '------' + ka.kodeexternal 
											when ka.kodeexternal is  null and  ka.kdchildketujuh is not NULL then ka.kdchildketujuh end 
											as kd,

											case when ka.childketujuh is not null and  ka.namaexternal is not NULL then  ka.childketujuh  + ka.namaexternal 
											when ka.childketujuh is not null and  ka.namaexternal is NULL then  ka.childketujuh
											when ka.childketujuh is  null and  ka.namaexternal is not NULL then  ka.namaexternal end 
											as desk,
									--'----------' + ka.kodeexternal + ' || ' + ka.kdchildkeenam as kd,ka.childkeenam + ka.namaexternal as desk,
											sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake,mat.objectpengendalifk
											from mataanggaran_t as mat
											INNER JOIN kelompokanggaranketujuh_m ka on ka.id =mat.objectchildketujuhfk
                                            WHERE mat.statusenabled = 1
											group by ka.kdchildketujuh,ka.childketujuh,mat.tahun,mat.revisidivake,ka.kodeexternal,mat.objectpengendalifk,ka.namaexternal  
								
                  ) as x
                    $tahun
                    $revisiDiva
                    $Pengendali      
                --GROUP BY x.no,x.kode,x.kd,x.desk,x.totalblu,x.totalrm,x.tahun,x.revisidivake,x.objectpengendalifk
            order by x.kd asc;
            
            "));
        } else {
            $data = DB::select(DB::raw("select distinct x.no, x.kd ,x.kd2,x.desk,sum(x.totalblu) as totalblu,x.totalrm,x.tahun,x.revisidivake from
                    (
 select 1 as no,ka.kdkelompokhead as kd2,ka.kdkelompokhead as kd, upper(ka.kelompokhead) as desk,
                    sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake
                    from mataanggaran_t as mat
                    INNER JOIN kelompokanggaranhead_m as ka on ka.id =mat.objectheadfk
                    WHERE mat.statusenabled = 1
                    group by ka.kdkelompokhead,ka.kelompokhead,mat.tahun,mat.revisidivake
                    union ALL
select 2 as no,ka.kdkelompokhead + ka1.kdchildpertama as kd2,ka1.kdchildpertama as kd,upper(ka1.childpertama) as desk,
                    sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake
                    from mataanggaran_t as mat
                     INNER JOIN kelompokanggaranhead_m as ka on ka.id =mat.objectheadfk
                    INNER JOIN kelompokanggaranpertama_m ka1 on ka1.id =mat.objectchildpertamafk
                    WHERE mat.statusenabled = 1
                    group by ka1.kdchildpertama,ka1.childpertama,mat.tahun,mat.revisidivake,ka.kdkelompokhead
                    union all
 select 3 as no,ka.kdkelompokhead + ka1.kdchildpertama + ka2.kdchildkedua as kd2,ka2.kdchildkedua as kd,upper(ka2.childkedua) as desk,
                    sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake
                    from mataanggaran_t as mat
                    INNER JOIN kelompokanggaranhead_m as ka on ka.id =mat.objectheadfk
                    INNER JOIN kelompokanggaranpertama_m ka1 on ka1.id =mat.objectchildpertamafk
                    INNER JOIN kelompokanggarankedua_m ka2 on ka2.id =mat.objectchildkeduafk
                    WHERE mat.statusenabled = 1
                    group by ka2.kdchildkedua,ka2.childkedua,mat.tahun,mat.revisidivake,ka.kodeexternal,ka.namaexternal,ka1.kdchildpertama ,ka.kdkelompokhead
                    union all               
 select 4 as no,ka.kdkelompokhead + ka1.kdchildpertama + ka2.kdchildkedua + ka3.kdchildketiga as kd2,ka3.kdchildketiga as kd,upper(ka3.childketiga) as desk,
                    sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake
                    from mataanggaran_t as mat
                    INNER JOIN kelompokanggaranhead_m as ka on ka.id =mat.objectheadfk
                    INNER JOIN kelompokanggaranpertama_m ka1 on ka1.id =mat.objectchildpertamafk
                    INNER JOIN kelompokanggarankedua_m ka2 on ka2.id =mat.objectchildkeduafk
                    INNER JOIN kelompokanggaranketiga_m ka3 on ka3.id =mat.objectchildketigafk
                    WHERE mat.statusenabled = 1
                    group by ka3.kdchildketiga,ka3.childketiga,mat.tahun,mat.revisidivake,ka.kodeexternal,ka.namaexternal,ka1.kdchildpertama   ,ka.kdkelompokhead,ka2.kdchildkedua                         
                    union all
 select 5 as no,ka.kdkelompokhead + ka1.kdchildpertama + ka2.kdchildkedua + ka3.kdchildketiga + ka4.kdchildkeempat as kd2,ka4.kdchildkeempat as kd,upper(ka4.childkeempat) as desk,
                    sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake
                    from mataanggaran_t as mat
                    INNER JOIN kelompokanggaranhead_m as ka on ka.id =mat.objectheadfk
                    INNER JOIN kelompokanggaranpertama_m ka1 on ka1.id =mat.objectchildpertamafk
                    INNER JOIN kelompokanggarankedua_m ka2 on ka2.id =mat.objectchildkeduafk
                    INNER JOIN kelompokanggaranketiga_m ka3 on ka3.id =mat.objectchildketigafk
                    inner join kelompokanggarankeempat_m ka4 on ka4.id = mat.objectchildkeempatfk
                    WHERE mat.statusenabled = 1
                    group by ka3.kdchildketiga,ka3.childketiga,mat.tahun,mat.revisidivake,ka.kodeexternal,ka.namaexternal,ka1.kdchildpertama   ,ka.kdkelompokhead,ka2.kdchildkedua     ,ka3.kdchildketiga,ka4.kdchildkeempat   ,ka4.childkeempat                   
 union all
 select 6 as no,ka.kdkelompokhead + ka1.kdchildpertama + ka2.kdchildkedua + ka3.kdchildketiga + ka4.kdchildkeempat + ka5.kdchildkelima as kd2,ka5.kdchildkelima as kd,upper(ka5.childkelima) as desk,
                    sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake
                    from mataanggaran_t as mat
                    INNER JOIN kelompokanggaranhead_m as ka on ka.id =mat.objectheadfk
                    INNER JOIN kelompokanggaranpertama_m ka1 on ka1.id =mat.objectchildpertamafk
                    INNER JOIN kelompokanggarankedua_m ka2 on ka2.id =mat.objectchildkeduafk
                    INNER JOIN kelompokanggaranketiga_m ka3 on ka3.id =mat.objectchildketigafk
                    inner join kelompokanggarankeempat_m ka4 on ka4.id = mat.objectchildkeempatfk
                    inner join kelompokanggarankelima_m ka5 on ka5.id = mat.objectchildkelimafk
                    WHERE mat.statusenabled = 1
                    group by ka3.kdchildketiga,ka3.childketiga,mat.tahun,mat.revisidivake,ka.kodeexternal,ka.namaexternal,ka1.kdchildpertama   ,ka.kdkelompokhead,ka2.kdchildkedua     ,ka3.kdchildketiga,ka4.kdchildkeempat       , ka5.kdchildkelima ,ka5.childkelima        
                             union all
 select 7 as no,ka.kdkelompokhead + ka1.kdchildpertama + ka2.kdchildkedua + ka3.kdchildketiga + ka4.kdchildkeempat + ka5.kdchildkelima+ ka6.kdchildkeenam as kd2,ka6.kdchildkeenam as kd,upper(ka6.childkeenam) as desk,
                    sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake
                    from mataanggaran_t as mat
                    INNER JOIN kelompokanggaranhead_m as ka on ka.id =mat.objectheadfk
                    INNER JOIN kelompokanggaranpertama_m ka1 on ka1.id =mat.objectchildpertamafk
                    INNER JOIN kelompokanggarankedua_m ka2 on ka2.id =mat.objectchildkeduafk
                    INNER JOIN kelompokanggaranketiga_m ka3 on ka3.id =mat.objectchildketigafk
                    inner join kelompokanggarankeempat_m ka4 on ka4.id = mat.objectchildkeempatfk
                    inner join kelompokanggarankelima_m ka5 on ka5.id = mat.objectchildkelimafk
                    inner join kelompokanggarankeenam_m ka6 on ka6.id = mat.objectchildkeenamfk
                    WHERE mat.statusenabled = 1
                    group by ka3.kdchildketiga,ka3.childketiga,mat.tahun,mat.revisidivake,ka.kodeexternal,ka.namaexternal,ka1.kdchildpertama   ,ka.kdkelompokhead,ka2.kdchildkedua,ka3.kdchildketiga,ka4.kdchildkeempat, ka5.kdchildkelima , ka6.kdchildkeenam     ,ka6.childkeenam
union all
 select 8as no,ka.kdkelompokhead + ka1.kdchildpertama + ka2.kdchildkedua + ka3.kdchildketiga + ka4.kdchildkeempat + ka5.kdchildkelima+ ka6.kdchildkeenam+ ka7.kdchildketujuh as kd2,ka7.kdchildketujuh as kd,upper(ka7.childketujuh) as desk,
                    sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake
                    from mataanggaran_t as mat
                    INNER JOIN kelompokanggaranhead_m as ka on ka.id =mat.objectheadfk
                    INNER JOIN kelompokanggaranpertama_m ka1 on ka1.id =mat.objectchildpertamafk
                    INNER JOIN kelompokanggarankedua_m ka2 on ka2.id =mat.objectchildkeduafk
                    INNER JOIN kelompokanggaranketiga_m ka3 on ka3.id =mat.objectchildketigafk
                    inner join kelompokanggarankeempat_m ka4 on ka4.id = mat.objectchildkeempatfk
                    inner join kelompokanggarankelima_m ka5 on ka5.id = mat.objectchildkelimafk
                    inner join kelompokanggarankeenam_m ka6 on ka6.id = mat.objectchildkeenamfk
                    inner join kelompokanggaranketujuh_m ka7 on ka7.id = mat.objectchildketujuhfk
                    WHERE mat.statusenabled = 1
                    group by ka3.kdchildketiga,ka3.childketiga,mat.tahun,mat.revisidivake,ka.kodeexternal,ka.namaexternal,ka1.kdchildpertama   ,ka.kdkelompokhead,ka2.kdchildkedua,ka3.kdchildketiga,ka4.kdchildkeempat, ka5.kdchildkelima , ka6.kdchildkeenam ,ka7.kdchildketujuh,ka7.childketujuh
                                                    
                    
                    ) as x
                    $tahun
                    $revisiDiva
                    $Pengendali     
                    group by x.no, x.kd,x.desk,x.totalrm,x.tahun,x.revisidivake,x.kd2
                    order by kd2
               
            
            "));
        }
        // $data2 == $data;
        // $result = [];
        // $status = 't';
        //     foreach ($data as $item) {
                
        //         if (count($result) == 0) {
        //            $result[]=array(
        //             'no' => $item->no,
        //             'kode' => $item->kode,
        //             'kd' => $item->kd,
        //             'desk' => $item->desk,
        //             'totalblu' => $item->totalblu,
        //             'totalrm' => $item->totalrm,
        //             'tahun' => $item->tahun,
        //             'revisidivake' => $item->revisidivake,
        //             );
        //         }else{
        //             foreach ($result as $itemx) {
                        
        //                 if( $item->kd ==  $itemx['kd']){
        //                     $status = 'y';  
        //                     // return($result[$loopingan]);
        //                     // die();
        //                     $result[$loopingan]=array(
        //                                         'no' => $result[$loopingan]['no'],
        //                                         'kode' => $result[$loopingan]['kode'],
        //                                         'kd' => $result[$loopingan]['kd'],
        //                                         'desk' => $result[$loopingan]['desk'],
        //                                         'totalblu' => (float)($result[$loopingan]['totalblu'])+(float)$itemx['totalblu'],
        //                                         'totalrm' => $result[$loopingan]['totalrm'],
        //                                         'tahun' => $result[$loopingan]['tahun'],
        //                                         'revisidivake' => $result[$loopingan]['revisidivake'],
        //                                         )          ;                                     
        //                 }
        //                 $loopingan = $loopingan+1;

        //             }
        //             $loopingan = 0;
        //             if($status == 't'){
        //                 $result[]=array(
        //                         'no' => $item->no,
        //                         'kode' => $item->kode,
        //                         'kd' => $item->kd,
        //                         'desk' => $item->desk,
        //                         'totalblu' => $item->totalblu,
        //                         'totalrm' => $item->totalrm,
        //                         'tahun' => $item->tahun,
        //                         'revisidivake' => $item->revisidivake,
        //                     ); 
        //             }
        //             $status = 't';
                 
        //         }
        //     }
           

        // foreach ($data as $key => $row) {
        //     // return($row);
        //     // die();
        //     $count[$key] = $row['kode'];
        // }

//        if ($count[$key] != ''){
        // array_multisort($count, SORT_ASC, $result);
//        }
        $result = array(
            'data' => $data,
            'message' => 'dy',
        );
        return $this->respond($result);
    }

    public function getDaftarMataAnggaranNewBLUD(Request $request){
        $dataLogin = $request->all();
        $Pengendali =  ' ';
        $tahun =  ' ';
        $revisiDiva =  ' ';

        if (isset($request['tahun']) && $request['tahun'] != "" && $request['tahun'] != "undefined") {
            $tahun =  ' where tahun =  ' . $request['tahun'];
        }


        if (isset($request['revisike']) && $request['revisike'] != "" && $request['revisike'] != "undefined") {
            $revisiDiva =  ' and revisidivake =  ' . $request['revisike'];
        }

        if (isset($request['Pengendali']) && $request['Pengendali'] != "" && $request['Pengendali'] != "undefined") {
            $Pengendali =  ' and objectpengendalifk =  ' . $request['Pengendali'];

            $data = DB::select(DB::raw("select x.no, x.kd,x.desk,x.totalblu,x.totalrm,x.tahun,x.revisidivake,x.objectpengendalifk, 
                                            CASE WHEN x.isbiayaoperasional = 0 THEN 'I. BIAYA OPERASIONAL' ELSE 'II. BIAYA NON OPERASIONAL' END AS isbiayaoperasional,
                                            x.jenisbiaya, x.volume, x.pengali, x.satuan, x.hargasatuan, x.reportdisplay, x.turunankelima, x.turunankeenam from
                    (
											
											
											 select 7 as no, 
										case when ka.kodeexternal is not null and  ka.kdchildkeenam is not NULL then ka.kdchildkeenam 
											when ka.kodeexternal is not null and  ka.kdchildkeenam is NULL then '------' + ka.kodeexternal 
											when ka.kodeexternal is  null and  ka.kdchildkeenam is not NULL then ka.kdchildkeenam end 
											as kd,

											case when ka.childkeenam is not null and  ka.namaexternal is not NULL then  ka.childkeenam  + ka.namaexternal 
											when ka.childkeenam is not null and  ka.namaexternal is NULL then  ka.childkeenam
											when ka.childkeenam is  null and  ka.namaexternal is not NULL then  ka.namaexternal end 
											as desk,
									--'----------' + ka.kodeexternal + ' || ' + ka.kdchildkeenam as kd,ka.childkeenam + ka.namaexternal as desk,
											sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake,mat.objectpengendalifk, mat.isbiayaoperasional, mat.jenisbiaya, mat.volume, mat.pengali, mat.satuan, mat.hargasatuan, jb.reportdisplay, CONCAT(k4.kdchildkeempat,' ',k4.childkeempat) as turunankelima, CONCAT(k5.kdchildkelima,' ',k5.childkelima) as turunankeenam
											from mataanggaran_t as mat
											INNER JOIN kelompokanggarankeenam_m ka on ka.id =mat.objectchildkeenamfk
											INNER JOIN kelompokanggarankelima_m k5 on k5.id = ka.objectchildkelimafk
											INNER JOIN kelompokanggarankeempat_m k4 on k4.id = k5.objectchildkeempatfk
											INNER JOIN jabatan_m as jb on jb.id = mat.objectpengendalifk
                                            WHERE mat.statusenabled = 1
											group by ka.kdchildkeenam,ka.childkeenam,mat.tahun,mat.revisidivake,ka.kodeexternal,mat.objectpengendalifk,ka.namaexternal, mat.isbiayaoperasional, mat.jenisbiaya, mat.volume, mat.pengali, mat.satuan, mat.hargasatuan, jb.reportdisplay,k4.kdchildkeempat,k4.childkeempat,k5.kdchildkelima,k5.childkelima
								        
								        union ALL

											 select 8 as no, 
										case when ka.kodeexternal is not null and  ka.kdchildketujuh is not NULL then ka.kdchildketujuh 
											when ka.kodeexternal is not null and  ka.kdchildketujuh is NULL then '------' + ka.kodeexternal 
											when ka.kodeexternal is  null and  ka.kdchildketujuh is not NULL then ka.kdchildketujuh end 
											as kd,

											case when ka.childketujuh is not null and  ka.namaexternal is not NULL then  ka.childketujuh  + ka.namaexternal 
											when ka.childketujuh is not null and  ka.namaexternal is NULL then  ka.childketujuh
											when ka.childketujuh is  null and  ka.namaexternal is not NULL then  ka.namaexternal end 
											as desk,
									--'----------' + ka.kodeexternal + ' || ' + ka.kdchildkeenam as kd,ka.childkeenam + ka.namaexternal as desk,
											sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake,mat.objectpengendalifk, mat.isbiayaoperasional, mat.jenisbiaya, mat.volume, mat.pengali, mat.satuan, mat.hargasatuan, jb.reportdisplay, CONCAT(k4.kdchildkeempat,' ',k4.childkeempat) as turunankelima, CONCAT(k5.kdchildkelima,' ',k5.childkelima) as turunankeenam
											from mataanggaran_t as mat
											INNER JOIN kelompokanggaranketujuh_m ka on ka.id =mat.objectchildketujuhfk
											INNER JOIN kelompokanggarankeenam_m k6 on k6.id = ka.objectchildkeenamfk
											INNER JOIN kelompokanggarankelima_m k5 on k5.id = k6.objectchildkelimafk
											INNER JOIN kelompokanggarankeempat_m k4 on k4.id = k5.objectchildkeempatfk
											INNER JOIN jabatan_m as jb on jb.id = mat.objectpengendalifk
                                            WHERE mat.statusenabled = 1
											group by ka.kdchildketujuh,ka.childketujuh,mat.tahun,mat.revisidivake,ka.kodeexternal,mat.objectpengendalifk,ka.namaexternal, mat.isbiayaoperasional, mat.jenisbiaya, mat.volume, mat.pengali, mat.satuan, mat.hargasatuan, jb.reportdisplay,k4.kdchildkeempat,k4.childkeempat,k5.kdchildkelima,k5.childkelima  
								
                  ) as x
                    $tahun
                    $revisiDiva
                    $Pengendali      
                --GROUP BY x.no,x.kode,x.kd,x.desk,x.totalblu,x.totalrm,x.tahun,x.revisidivake,x.objectpengendalifk, mat.isbiayaoperasional, mat.jenisbiaya, mat.volume, mat.pengali, mat.satuan, mat.hargasatuan, jb.reportdisplay
            order by x.kd asc;
            
            "));
        } else {
            $data = DB::select(DB::raw("select x.no, x.kd,x.desk,x.totalblu,x.totalrm,x.tahun,x.revisidivake, 
                                            CASE WHEN x.isbiayaoperasional = 0 THEN 'I. BIAYA OPERASIONAL' ELSE 'II.BIAYA NON OPERASIONAL' END AS isbiayaoperasional,
                                            x.jenisbiaya, x.volume, x.pengali, x.satuan, x.reportdisplay, x.turunankelima, x.turunankeenam from
                    (
											
											
											 select 7 as no, 
										case when ka.kodeexternal is not null and  ka.kdchildkeenam is not NULL then ka.kdchildkeenam 
											when ka.kodeexternal is not null and  ka.kdchildkeenam is NULL then '------' + ka.kodeexternal 
											when ka.kodeexternal is  null and  ka.kdchildkeenam is not NULL then ka.kdchildkeenam end 
											as kd,

											case when ka.childkeenam is not null and  ka.namaexternal is not NULL then  ka.childkeenam  + ka.namaexternal 
											when ka.childkeenam is not null and  ka.namaexternal is NULL then  ka.childkeenam
											when ka.childkeenam is  null and  ka.namaexternal is not NULL then  ka.namaexternal end 
											as desk,
									--'----------' + ka.kodeexternal + ' || ' + ka.kdchildkeenam as kd,ka.childkeenam + ka.namaexternal as desk,
											sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake, mat.isbiayaoperasional, mat.jenisbiaya, mat.volume, mat.pengali, mat.satuan, jb.reportdisplay, CONCAT(k4.kdchildkeempat,' ',k4.childkeempat) as turunankelima, CONCAT(k5.kdchildkelima,' ',k5.childkelima) as turunankeenam
											from mataanggaran_t as mat
											INNER JOIN kelompokanggarankeenam_m ka on ka.id =mat.objectchildkeenamfk
											INNER JOIN kelompokanggarankelima_m k5 on k5.id = ka.objectchildkelimafk
											INNER JOIN kelompokanggarankeempat_m k4 on k4.id = k5.objectchildkeempatfk
											LEFT JOIN jabatan_m as jb on jb.id = mat.objectpengendalifk
                                            WHERE mat.statusenabled = 1
											group by ka.kdchildkeenam,ka.childkeenam,mat.tahun,mat.revisidivake,ka.kodeexternal,ka.namaexternal, mat.isbiayaoperasional, mat.jenisbiaya, mat.volume, mat.pengali, mat.satuan, jb.reportdisplay,k4.kdchildkeempat,k4.childkeempat,k5.kdchildkelima,k5.childkelima  
								        
								        union ALL

											 select 8 as no, 
										case when ka.kodeexternal is not null and  ka.kdchildketujuh is not NULL then ka.kdchildketujuh 
											when ka.kodeexternal is not null and  ka.kdchildketujuh is NULL then '------' + ka.kodeexternal 
											when ka.kodeexternal is  null and  ka.kdchildketujuh is not NULL then ka.kdchildketujuh end 
											as kd,

											case when ka.childketujuh is not null and  ka.namaexternal is not NULL then  ka.childketujuh  + ka.namaexternal 
											when ka.childketujuh is not null and  ka.namaexternal is NULL then  ka.childketujuh
											when ka.childketujuh is  null and  ka.namaexternal is not NULL then  ka.namaexternal end 
											as desk,
									--'----------' + ka.kodeexternal + ' || ' + ka.kdchildkeenam as kd,ka.childkeenam + ka.namaexternal as desk,
											sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake, mat.isbiayaoperasional, mat.jenisbiaya, mat.volume, mat.pengali, mat.satuan, jb.reportdisplay, CONCAT(k4.kdchildkeempat,' ',k4.childkeempat) as turunankelima, CONCAT(k5.kdchildkelima,' ',k5.childkelima) as turunankeenam
											from mataanggaran_t as mat
											INNER JOIN kelompokanggaranketujuh_m ka on ka.id =mat.objectchildketujuhfk
											INNER JOIN kelompokanggarankeenam_m k6 on k6.id = ka.objectchildkeenamfk
											INNER JOIN kelompokanggarankelima_m k5 on k5.id = k6.objectchildkelimafk
											INNER JOIN kelompokanggarankeempat_m k4 on k4.id = k5.objectchildkeempatfk
											LEFT JOIN jabatan_m as jb on jb.id = mat.objectpengendalifk
                                            WHERE mat.statusenabled = 1
											group by ka.kdchildketujuh,ka.childketujuh,mat.tahun,mat.revisidivake,ka.kodeexternal,ka.namaexternal, mat.isbiayaoperasional, mat.jenisbiaya, mat.volume, mat.pengali, mat.satuan, jb.reportdisplay,k4.kdchildkeempat,k4.childkeempat,k5.kdchildkelima,k5.childkelima  
								
                  ) as x
                    $tahun
                    $revisiDiva
                    $Pengendali      
                --GROUP BY x.no,x.kode,x.kd,x.desk,x.totalblu,x.totalrm,x.tahun,x.revisidivake,x.objectpengendalifk
            order by x.kd asc;
            
            "));
            // $data = DB::select(DB::raw("select x.no, x.kd,x.desk,x.totalblu,x.totalrm,x.tahun,x.revisidivake, 
            //                                 CASE WHEN x.isbiayaoperasional = 0 THEN 'I. BIAYA OPERASIONAL' ELSE 'II.BIAYA NON OPERASIONAL' END AS isbiayaoperasional,
            //                                 x.jenisbiaya, x.volume, x.pengali, x.satuan, x.hargasatuan, x.reportdisplay, x.turunankelima, x.turunankeenam from
            //         (
											
											
			// 								 select 7 as no, 
			// 							case when ka.kodeexternal is not null and  ka.kdchildkeenam is not NULL then ka.kdchildkeenam 
			// 								when ka.kodeexternal is not null and  ka.kdchildkeenam is NULL then '------' + ka.kodeexternal 
			// 								when ka.kodeexternal is  null and  ka.kdchildkeenam is not NULL then ka.kdchildkeenam end 
			// 								as kd,

			// 								case when ka.childkeenam is not null and  ka.namaexternal is not NULL then  ka.childkeenam  + ka.namaexternal 
			// 								when ka.childkeenam is not null and  ka.namaexternal is NULL then  ka.childkeenam
			// 								when ka.childkeenam is  null and  ka.namaexternal is not NULL then  ka.namaexternal end 
			// 								as desk,
			// 						--'----------' + ka.kodeexternal + ' || ' + ka.kdchildkeenam as kd,ka.childkeenam + ka.namaexternal as desk,
			// 								sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake, mat.isbiayaoperasional, mat.jenisbiaya, mat.volume, mat.pengali, mat.satuan, mat.hargasatuan, jb.reportdisplay, CONCAT(k4.kdchildkeempat,' ',k4.childkeempat) as turunankelima, CONCAT(k5.kdchildkelima,' ',k5.childkelima) as turunankeenam
			// 								from mataanggaran_t as mat
			// 								INNER JOIN kelompokanggarankeenam_m ka on ka.id =mat.objectchildkeenamfk
			// 								INNER JOIN kelompokanggarankelima_m k5 on k5.id = ka.objectchildkelimafk
			// 								INNER JOIN kelompokanggarankeempat_m k4 on k4.id = k5.objectchildkeempatfk
			// 								LEFT JOIN jabatan_m as jb on jb.id = mat.objectpengendalifk
			// 								group by ka.kdchildkeenam,ka.childkeenam,mat.tahun,mat.revisidivake,ka.kodeexternal,ka.namaexternal, mat.isbiayaoperasional, mat.jenisbiaya, mat.volume, mat.pengali, mat.satuan, mat.hargasatuan, jb.reportdisplay,k4.kdchildkeempat,k4.childkeempat,k5.kdchildkelima,k5.childkelima  
								        
			// 					        union ALL

			// 								 select 8 as no, 
			// 							case when ka.kodeexternal is not null and  ka.kdchildketujuh is not NULL then ka.kdchildketujuh 
			// 								when ka.kodeexternal is not null and  ka.kdchildketujuh is NULL then '------' + ka.kodeexternal 
			// 								when ka.kodeexternal is  null and  ka.kdchildketujuh is not NULL then ka.kdchildketujuh end 
			// 								as kd,

			// 								case when ka.childketujuh is not null and  ka.namaexternal is not NULL then  ka.childketujuh  + ka.namaexternal 
			// 								when ka.childketujuh is not null and  ka.namaexternal is NULL then  ka.childketujuh
			// 								when ka.childketujuh is  null and  ka.namaexternal is not NULL then  ka.namaexternal end 
			// 								as desk,
			// 						--'----------' + ka.kodeexternal + ' || ' + ka.kdchildkeenam as kd,ka.childkeenam + ka.namaexternal as desk,
			// 								sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake, mat.isbiayaoperasional, mat.jenisbiaya, mat.volume, mat.pengali, mat.satuan, mat.hargasatuan, jb.reportdisplay, CONCAT(k4.kdchildkeempat,' ',k4.childkeempat) as turunankelima, CONCAT(k5.kdchildkelima,' ',k5.childkelima) as turunankeenam
			// 								from mataanggaran_t as mat
			// 								INNER JOIN kelompokanggaranketujuh_m ka on ka.id =mat.objectchildketujuhfk
			// 								INNER JOIN kelompokanggarankeenam_m k6 on k6.id = ka.objectchildkeenamfk
			// 								INNER JOIN kelompokanggarankelima_m k5 on k5.id = k6.objectchildkelimafk
			// 								INNER JOIN kelompokanggarankeempat_m k4 on k4.id = k5.objectchildkeempatfk
			// 								LEFT JOIN jabatan_m as jb on jb.id = mat.objectpengendalifk
			// 								group by ka.kdchildketujuh,ka.childketujuh,mat.tahun,mat.revisidivake,ka.kodeexternal,ka.namaexternal, mat.isbiayaoperasional, mat.jenisbiaya, mat.volume, mat.pengali, mat.satuan, mat.hargasatuan, jb.reportdisplay,k4.kdchildkeempat,k4.childkeempat,k5.kdchildkelima,k5.childkelima  
								
            //       ) as x
            //         $tahun
            //         $revisiDiva
            //         $Pengendali      
            //     --GROUP BY x.no,x.kode,x.kd,x.desk,x.totalblu,x.totalrm,x.tahun,x.revisidivake,x.objectpengendalifk
            // order by x.kd asc;
            
            // "));
        }


        foreach ($data as $key => $row) {
            $count[$key] = $row->kd;
        }

//        if ($count[$key] != ''){
        array_multisort($count, SORT_ASC, $data);
//        }
        $result = array(
            'data' => $data,
            'message' => 'dy',
        );
        return $this->respond($result);
    }

    public function saveKelHead(Request $request) {
        DB::beginTransaction();
        try{
            if ($request['id']==''){
                $newId = KelompokAnggaranHead::max('id');
                $newId= $newId+1;
                $MA = new KelompokAnggaranHead();
                $MA->id = $newId;
                $MA->kdprofile = 0;
                $MA->statusenabled = true;
            }else{
                $MA= KelompokAnggaranHead::where('id',$request['id'])
                    ->first();
            }
            $MA->kdkelompokhead = $request['kdkelompokhead'];
            $MA->kelompokhead =  $request['kelompokhead'];
            $MA->kodeexternal =  $request['kodeexternal'];
            $MA->namaexternal =  $request['namaexternal'];

            $MA->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan Mata Anggaran";
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $MA,
                'as' => 'ramdanegie',
            );
        } else {
            $transMessage = "Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'result' => $MA,
                'as' => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveKelPertama(Request $request) {
        DB::beginTransaction();
        try{
            if ($request['id']==''){
                $newId = KelompokAnggaranPertama::max('id');
                $newId= $newId+1;
                $MA = new KelompokAnggaranPertama();
                $MA->id = $newId;
                $MA->kdprofile = 0;
                $MA->statusenabled = true;
            }else{
                $MA= KelompokAnggaranPertama::where('id',$request['id'])
                    ->first();
            }
            $MA->kdchildpertama = $request['kdchildpertama'];
            $MA->childpertama =  $request['childpertama'];
            $MA->kodeexternal =  $request['kodeexternal'];
            $MA->namaexternal =  $request['namaexternal'];
            $MA->objectheadfk =  $request['idparent'];

            $MA->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan Mata Anggaran";
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $MA,
                'as' => 'ramdanegie',
            );
        } else {
            $transMessage = "Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'result' => $MA,
                'as' => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveKelKedua(Request $request) {
        DB::beginTransaction();
        try{

            if ($request['id']==''){
                $newId = KelompokAnggaranKedua::max('id');
                $newId= $newId+1;
                $MA = new KelompokAnggaranKedua();
                $MA->id = $newId;
                $MA->kdprofile = 0;
                $MA->statusenabled = true;
            }else{
                $MA= KelompokAnggaranKedua::where('id',$request['id'])
                    ->first();
            }
            $MA->kdchildkedua = $request['kdchildkedua'];
            $MA->childkedua =  $request['childkedua'];
            $MA->kodeexternal =  $request['kodeexternal'];
            $MA->namaexternal =  $request['namaexternal'];
            $MA->objectchildpertamafk =  $request['idparent'];

            $MA->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan Mata Anggaran";
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $MA,
                'as' => 'ramdanegie',
            );
        } else {
            $transMessage = "Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'result' => $MA,
                'as' => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveKelKetiga(Request $request) {
        DB::beginTransaction();
        try{
            if ($request['id']==''){
                $newId = KelompokAnggaranKetiga::max('id');
                $newId= $newId+1;
                $MA = new KelompokAnggaranKetiga();
                $MA->id = $newId;
                $MA->kdprofile = 0;
                $MA->statusenabled = true;
            }else{
                $MA= KelompokAnggaranKetiga::where('id',$request['id'])
                    ->first();
            }
            $MA->kdchildketiga = $request['kdchildketiga'];
            $MA->childketiga =  $request['childketiga'];
            $MA->kodeexternal =  $request['kodeexternal'];
            $MA->namaexternal =  $request['namaexternal'];
            $MA->objectchildkeduafk =  $request['idparent'];

            $MA->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan Mata Anggaran";
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $MA,
                'as' => 'ramdanegie',
            );
        } else {
            $transMessage = "Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'result' => $MA,
                'as' => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function saveKelKeempat(Request $request) {
        DB::beginTransaction();
        try{
            // foreach ($request['data'] as $item){


            if ($request['id']==''){
                $newId = KelompokAnggaranKeempat::max('id');
                $newId= $newId+1;
                $MA = new KelompokAnggaranKeempat();
                $MA->id = $newId;
                $MA->kdprofile = 0;
                $MA->statusenabled = true;
            }else{
                $MA= KelompokAnggaranKeempat::where('id',$request['id'])
                    ->first();
            }
            $MA->kdchildkeempat = $request['kdchildkeempat'];
            $MA->childkeempat =  $request['childkeempat'];
            $MA->kodeexternal =  $request['kodeexternal'];
            $MA->namaexternal =  $request['namaexternal'];
            $MA->objectchildketigafk =  $request['idparent'];

            $MA->save();
            // }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan Mata Anggaran";
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $MA,
                'as' => 'ramdanegie',
            );
        } else {
            $transMessage = "Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'result' => $MA,
                'as' => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function deleteKelompokHead(Request $request) {
        $dataLogin = $request->all();
        DB::beginTransaction();
        try{
            if ($request['id'] != ''){
                $data1 = KelompokAnggaranHead::where('id', $request['id'])->delete();
                $transStatus = 'true';
            }
        }
        catch(\Exception $e){
            $transStatus= 'false';
        }
        if ($transStatus=='true')
        {    DB::commit();
            $transMessage = "Data Terhapus";
        }
        else{
            DB::rollBack();
            $transMessage = "Data Gagal Dihapus";
        }

        return $this->setStatusCode(201)->respond([], $transMessage);
    }
    public function deleteKelompokPertama(Request $request) {
        $dataLogin = $request->all();
        DB::beginTransaction();
        try{
            if ($request['id'] != ''){
                $data1 = KelompokAnggaranPertama::where('id', $request['id'])->delete();
                $transStatus = 'true';
            }
        }
        catch(\Exception $e){
            $transStatus= 'false';
        }
        if ($transStatus=='true')
        {    DB::commit();
            $transMessage = "Data Terhapus";
        }
        else{
            DB::rollBack();
            $transMessage = "Data Gagal Dihapus";
        }

        return $this->setStatusCode(201)->respond([], $transMessage);
    }
    public function deleteKelompokKedua(Request $request) {
        $dataLogin = $request->all();
        DB::beginTransaction();
        try{
            if ($request['id'] != ''){
                $data1 = KelompokAnggaranKedua::where('id', $request['id'])->delete();
                $transStatus = 'true';
            }
        }
        catch(\Exception $e){
            $transStatus= 'false';
        }
        if ($transStatus=='true')
        {    DB::commit();
            $transMessage = "Data Terhapus";
        }
        else{
            DB::rollBack();
            $transMessage = "Data Gagal Dihapus";
        }

        return $this->setStatusCode(201)->respond([], $transMessage);
    }
    public function deleteKelompokKetiga(Request $request) {
        $dataLogin = $request->all();
        DB::beginTransaction();
        try{
            if ($request['id'] != ''){
                $data1 = KelompokAnggaranKetiga::where('id', $request['id'])->delete();
                $transStatus = 'true';
            }
        }
        catch(\Exception $e){
            $transStatus= 'false';
        }
        if ($transStatus=='true')
        {    DB::commit();
            $transMessage = "Data Terhapus";
        }
        else{
            DB::rollBack();
            $transMessage = "Data Gagal Dihapus";
        }

        return $this->setStatusCode(201)->respond([], $transMessage);
    }
    public function deleteKelompokKeempat(Request $request) {
        $dataLogin = $request->all();
        DB::beginTransaction();
        try{
            if ($request['id'] != ''){
                $data1 = KelompokAnggaranKeempat::where('id', $request['id'])->delete();
                $transStatus = 'true';
            }
        }
        catch(\Exception $e){
            $transStatus= 'false';
        }
        if ($transStatus=='true')
        {    DB::commit();
            $transMessage = "Data Terhapus";
        }
        else{
            DB::rollBack();
            $transMessage = "Data Gagal Dihapus";
        }

        return $this->setStatusCode(201)->respond([], $transMessage);
    }

    public function getDaftarMonitoringAnggaran(Request $request)
    {
        $dataLogin = $request->all();
        $data = DB::select(DB::raw("select x.kode,x.kd,x.descc,x.totalblu,x.totalrm,x.tahun,x.revisidivake,x.totalbelanja,((x.totalrm + x.totalblu)- x.totalbelanja) as sisabelanja from
                    (select kode,kd,descc,totalblu,totalrm,tahun,revisidivake,sum(totalbelanja)as totalbelanja from (
                    select left(mat.kode,1)|| '00000000' as kode, ka.kdkelompokhead as kd,upper(ka.kelompokhead) as descc,
                    sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm,mat.tahun as tahun,mat.revisidivake,
                    (case when sr.totalbelanja <> 0 then sum(sr.totalbelanja)
					 else 0 end)as totalbelanja
                    from mataanggaran_t as mat
                    INNER JOIN kelompokanggaranhead_m as ka on cast(ka.id as text)=left(mat.kode,1)
										LEFT JOIN strukrealisasi_t as sr on sr.objectmataanggaranfk = mat.norec
                    group by left(mat.kode,1),ka.kdkelompokhead,ka.kelompokhead,mat.tahun,mat.revisidivake,sr.totalbelanja
                    union all
                    select left(mat.kode,3)|| '000000' as kode,'---' || ka.kdchildpertama as kd,upper(ka.childpertama) as descc,
                    sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun ,mat.revisidivake,
                    (case when sr.totalbelanja <> 0 then sum(sr.totalbelanja)
					else 0 end)as totalbelanja
                    from mataanggaran_t as mat
                    INNER JOIN kelompokanggaranpertama_m ka on cast(ka.id as text)=substring(mat.kode,1,2)
										LEFT JOIN strukrealisasi_t as sr on sr.objectmataanggaranfk = mat.norec
                    group by left(mat.kode,3),ka.kdchildpertama,ka.childpertama,mat.tahun,mat.revisidivake,sr.totalbelanja
                    union all
                    select  left(mat.kode,5) || '0000'as kode,'------' || ka.kdchildkedua as kd,ka.childkedua as descc,
                    sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake,
                    (case when sr.totalbelanja <> 0 then sum(sr.totalbelanja)
					 else 0 end)as totalbelanja
                    from mataanggaran_t as mat
                    INNER JOIN kelompokanggarankedua_m ka on cast(ka.id as text)=substring(mat.kode,3,2)
										LEFT JOIN strukrealisasi_t as sr on sr.objectmataanggaranfk = mat.norec
                    group by left(mat.kode,5),ka.kdchildkedua,ka.childkedua,mat.tahun,mat.revisidivake,sr.totalbelanja
                    union all
                    select left(mat.kode,7) || '00'as kode,'---------' || ka.kdchildketiga as kd,ka.childketiga as descc,
                    sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm,mat.tahun as tahun,mat.revisidivake,
                    (case when sr.totalbelanja <> 0 then sum(sr.totalbelanja)
					 else 0 end)as totalbelanja
                    from mataanggaran_t as mat
                    INNER JOIN kelompokanggaranketiga_m as ka on cast(ka.id as text)=substring(mat.kode,5,2)
										LEFT JOIN strukrealisasi_t as sr on sr.objectmataanggaranfk = mat.norec
                    group by left(mat.kode,7),ka.kdchildketiga,ka.childketiga,mat.tahun,mat.revisidivake,sr.totalbelanja
                    union all
                    select  left(mat.kode,9) as kode,'------------' || ka.kdchildkeempat as kd,ka.childkeempat as descc,
                    sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm,mat.tahun as tahun,mat.revisidivake,
                    (case when sr.totalbelanja <> 0 then sum(sr.totalbelanja)
					 else 0 end)as totalbelanja
                    from mataanggaran_t as mat
                    INNER JOIN kelompokanggarankeempat_m as ka on cast(ka.id as text)=substring(mat.kode,7,3)
										LEFT JOIN strukrealisasi_t as sr on sr.objectmataanggaranfk = mat.norec
                    group by left(mat.kode,9),ka.kdchildkeempat,ka.childkeempat,mat.tahun,mat.revisidivake,sr.totalbelanja
                    union all
                    select left(mat.kode,9) || '~' || mat.norec as kode,'---------------'  as kd,mat.mataanggaran as descc,
                    sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake,
                    (case when sr.totalbelanja <> 0 then sum(sr.totalbelanja)
					 else 0 end)as totalbelanja
                    from mataanggaran_t as mat
										LEFT JOIN strukrealisasi_t as sr on sr.objectmataanggaranfk = mat.norec
                    group by left(mat.kode,9)|| '~' || mat.norec,mat.kode,mat.mataanggaran,mat.tahun,mat.revisidivake,sr.totalbelanja
                    ) as x WHERE tahun=:tahun 
                    and revisidivake=:revisidivake
                    group by kode,kd,descc,totalblu,totalrm,tahun,revisidivake
                    order by kode) as x"),
            array(
                'tahun' => $request['tahun'],
                'revisidivake' => $request['revisike'],
            )
        );

        $result = array(
            'data' => $data,
            'message' => 'ramdanegie',
        );

        return $this->respond($result);
    }

    public function getDaftarRiwayatRealisasi(Request $request)
    {
        $dataLogin = $request->all();
        $data = \DB::table('strukpelayanan_t as sp')
            ->LEFTJOIN('riwayatrealisasi_t as rr','rr.penerimaanfk','=','sp.norec')
            ->LEFTJOIN('strukrealisasi_t as sr','sr.norec','=','rr.objectstrukrealisasifk')
            ->LEFTJOIN('mataanggaran_t as ma','ma.norec','=','sr.objectmataanggaranfk')
            ->LEFTJOIN('strukbuktipengeluaran_t as sbk', 'sbk.norec', '=', 'sp.nosbklastfk')
            ->LEFTJOIN('rekanan_m as rkn', 'rkn.id', '=', 'sp.objectrekananfk')
            ->LEFTJOIN('pegawai_m as pg', 'pg.id', '=', 'sp.objectpegawaipenerimafk')
            ->LEFTJOIN('ruangan_m as ru', 'ru.id', '=', 'sp.objectruanganfk')
            ->select('sp.tglstruk', 'sp.nostruk', 'rkn.namarekanan', 'pg.namalengkap',
                'ru.namaruangan','sp.norec','sp.nofaktur','sp.tglfaktur','sp.totalharusdibayar','sbk.nosbk',
                'ma.mataanggaran','sr.totalbelanja','sp.keteranganlainnya'
            );
        if (isset($request['tahun']) && $request['tahun'] != "" && $request['tahun'] != "undefined") {
            $data = $data->where('ma.tahun','=',$request['tahun']);
        }
        $data = $data->where('sp.statusenabled', true);
        $data = $data->whereIn('sp.objectkelompoktransaksifk', [35,92]);
        $data = $data->whereNotIn('sp.kdprofile',[7]);
        $data = $data->orderBy('sp.nostruk');
        $data = $data->get();

        foreach ($data as $item) {
            $details = DB::select(DB::raw("select  pr.namaproduk,ss.satuanstandar,spd.qtyproduk,spd.hargasatuan,spd.hargadiscount,
                                          spd.hargappn,((spd.hargasatuan-spd.hargadiscount+spd.hargappn)*spd.qtyproduk) as total,spd.tglkadaluarsa,spd.nobatch
                                          from strukpelayanandetail_t as spd 
                                          left JOIN produk_m as pr on pr.id=spd.objectprodukfk
                                          left JOIN satuanstandar_m as ss on ss.id=spd.objectsatuanstandarfk
                                          where nostrukfk=:norec"),
                array(
                    'norec' => $item->norec,
                )
            );
            $result[] = array(
                'tglstruk' => $item->tglstruk,
                'nostruk' => $item->nostruk,
                'nofaktur' => $item->nofaktur,
                'tglfaktur' => $item->tglfaktur,
                'namarekanan' => $item->namarekanan,
                'norec' => $item->norec,
                'namaruangan' => $item->namaruangan,
                'namapenerima' => $item->namalengkap,
                'totalharusdibayar' => $item->totalharusdibayar,
                'nosbk' => $item->nosbk,
                'keteranganlainnya' => $item->keteranganlainnya,
                'details' => $details,
            );
        }
        if (count($data) == 0) {
            $result = [];
        }

        $result = array(
            'daftar' => $result,
            'datalogin' => $dataLogin,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }

    public function getDetailVerifikasiUsulan (Request $request) {
        $dataLogin = $request->all();
        $noKonfirmasi =  $request['noKonfirmasi'];
        $data = DB::select(DB::raw("select sk.*,pg.namalengkap
                from strukkonfirmasi_t as sk
                INNER JOIN pegawai_m as pg on pg.id = sk.objectpegawaifk
                where sk.nokonfirmasi='$noKonfirmasi';"));
        $result = array(
            'data' =>$data,
            'message' => 'cepot@epic',
        );
        return $this->respond($result);
    }

    public function getDaftarUsulanAnggaran(Request $request) {
        $dataLogin = $request->all();
        $dataRuangan = \DB::table('maploginusertoruangan_s as mlu')
            ->JOIN('ruangan_m as ru','ru.id','=','mlu.objectruanganfk')
            ->select('ru.id')
            ->where('mlu.objectloginuserfk',$dataLogin['userData']['id'])
            ->get();
        $strRuangan = [];
        foreach ($dataRuangan as $epic){
            $strRuangan[] = $epic->id;
        }

        $data = \DB::table('strukorder_t as sp')
            ->JOIN('orderpelayanan_t as op','op.noorderfk','=','sp.norec')
            ->JOIN('strukverifikasi_t as sv','sv.norec','=','sp.objectsrukverifikasifk')
            ->LEFTJOIN('pegawai_m as pg','pg.id','=','sp.objectpegawaiorderfk')
            ->LEFTJOIN('pegawai_m as pg2','pg2.id','=','sp.objectpetugasfk')
            ->LEFTJOIN('ruangan_m as ru','ru.id','=','sp.objectruanganfk')
            ->LEFTJOIN('ruangan_m as ru2','ru2.id','=','sp.objectruangantujuanfk')
            ->LEFTJOIN('strukverifikasianggaran_t as sk','sk.norec','=','sp.strukverifikasianggaranfk')
            ->LEFTJOIN('mataanggaran_t as ma','ma.norec','=','sp.objectmataanggaranfk')
            ->LEFTJOIN('asalproduk_m as ap','ap.id','=','op.objectasalprodukfk')
            ->select('sp.norec','sp.tglorder','sp.noorder','pg.namalengkap as penanggungjawab','pg2.namalengkap as mengetahui',
                'sp.tglvalidasi as tglkebutuhan','sp.alamattempattujuan','sp.keteranganlainnya','sp.tglvalidasi','sp.noorderintern',
                'sp.keterangankeperluan','sp.keteranganorder','ru.namaruangan as ruangan','ru.id as ruid',
                'ru2.namaruangan as ruangantujuan','ru2.id as ruidtujuan',
                'sp.totalhargasatuan','sp.status','pg2.nippns','sv.noverifikasi','sv.tglverifikasi','sp.noorderhps','sk.noverifikasi',
                'sk.tglverifikasi','sk.statusterima as statusverifikasi','sk.keteranganlainnya as keteranganlainnya1',
                'ma.norec as mataanggaranfk','ma.mataanggaran','ap.id as apid','ap.asalproduk'
            );

        if(isset($request['tglAwal']) && $request['tglAwal']!="" && $request['tglAwal']!="undefined"){
            $data = $data->where('sp.tglorder','>=', $request['tglAwal']);
        }
        if(isset($request['tglAkhir']) && $request['tglAkhir']!="" && $request['tglAkhir']!="undefined"){
            $tgl= $request['tglAkhir'];
            $data = $data->where('sp.tglorder','<=', $tgl);
        }
        if(isset($request['noorder']) && $request['noorder']!="" && $request['noorder']!="undefined"){
            $data = $data->where('sp.noorder','like','%'. $request['noorder']);
        }
        if(isset($request['noKontrak']) && $request['noKontrak']!="" && $request['noKontrak']!="undefined"){
            $data = $data->where('sp.nokontrakspk','like','%'. $request['noKontrak']);
        }
        if(isset($request['keterangan']) && $request['keterangan']!="" && $request['keterangan']!="undefined"){
            $data = $data->where('sp.keteranganorder','like','%'. $request['keterangan']);
        }
        if(isset($request['produkfk']) && $request['produkfk']!="" && $request['produkfk']!="undefined"){
            $data = $data->where('op.objectprodukfk','=',$request['produkfk']);
        }

        $data = $data->distinct();
        $data = $data->where('sp.statusenabled',true);
//        $data = $data->where('sk.statusterima',1);
        $data = $data->where('sp.objectkelompoktransaksifk',89);
        $data = $data->orderBy('sp.tglorder');
        $data = $data->get();

        $results =array();
        foreach ($data as $item){
            $details = DB::select(DB::raw("
                     select pr.namaproduk,
                    ss.satuanstandar,spd.qtyproduk,spd.hargasatuan,spd.hargadiscount,spd.hargappnquo,spd.hargadiscountquo,
                    (spd.qtyproduk*(spd.hargasatuan)) as total,
                    (spd.qtyprodukkonfirmasi*(spd.hargasatuanquo + hargappnquo - hargadiscountquo)) as totalkonfirmasi,
                    spd.tglpelayananakhir as tglkebutuhan,spd.deskripsiprodukquo as spesifikasi,pr.id as prid,
                    spd.hargasatuanquo,spd.qtyprodukkonfirmasi
                     from orderpelayanan_t as spd 
                    left JOIN produk_m as pr on pr.id=spd.objectprodukfk
                    left JOIN satuanstandar_m as ss on ss.id=spd.objectsatuanstandarfk
                    where strukorderfk=:norec"),
                array(
                    'norec' => $item->norec,
                )
            );

            $results[] = array(
                'tglorder' => $item->tglorder,
                'noorder' => $item->noorder,
                'norec' => $item->norec,
                'penanggungjawab' => $item->penanggungjawab,
                'keterangan' => $item->keteranganorder,
                'koordinator' => $item->keteranganlainnya,
                'tglkebutuhan' => $item->tglkebutuhan,
                'tglusulan' => $item->tglorder,
                'nousulan' => $item->noorderintern,
                'namapengadaan' => $item->keterangankeperluan,
                'mengetahui' => $item->mengetahui,
                'ruangan' => $item->ruangan,
                'ruangantujuan' => $item->ruangantujuan,
                'totalhargasatuan' => $item->totalhargasatuan,
                'status' => $item->status,
//                'noverifikasi' => $item->noverifikasi,
                'noorderhps' => $item->noorderhps,
                'tglverifikasi' => $item->tglverifikasi,
                'noverifikasianggaran' => $item->noverifikasi,
                'statusverifikasi' => $item->statusverifikasi,
                'keteranganverifikasi' => $item->keteranganlainnya1,
//                'keteranganverifikasi' => $item->keteranganverifikasi,
//                'tglkonfirmasi' => $item->tglkonfirmasi,
                'mataanggaranfk' => $item->mataanggaranfk,
                'mataanggaran' => $item->mataanggaran,
                'apid' => $item->apid,
                'asalproduk' => $item->asalproduk,
                'details' => $details,
            );
        }
        $result = array(
            'daftar' => $results,
            'datalogin' => $dataLogin,
            'message' => 'as@epic',
        );
        return $this->respond($result);
    }

    public function getDaftarMataAnggaranForUpk(Request $request)
    {
        $dataLogin = $request->all();
        $Pengendali =  ' ';
        if (isset($request['Pengendali']) && $request['Pengendali'] != "" && $request['Pengendali'] != "undefined") {
            $Pengendali =  ' and objectpengendalifk =  ' . $request['Pengendali'];
        }
        $data = DB::select(DB::raw("select * from (
                    select left(mat.kode,1)|| '00000000' as kode, ka.kdkelompokhead as kd, upper(ka.kelompokhead) as desc,
                    sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake,
                    mat.objectpengendalifk,mat.norec
                    from mataanggaran_t as mat
                    INNER JOIN kelompokanggaranhead_m as ka on cast(ka.id as text)=left(mat.kode,1)
                    group by left(mat.kode,1),ka.kdkelompokhead,ka.kelompokhead,mat.tahun,mat.revisidivake,
                    mat.objectpengendalifk,mat.norec
                    union all
                    select left(mat.kode,3)|| '000000' as kode,'---' || ka.kdchildpertama as kd,upper(ka.childpertama) as desc,
                    sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake,mat.objectpengendalifk,mat.norec
                    from mataanggaran_t as mat
                    INNER JOIN kelompokanggaranpertama_m ka on cast(ka.id as text)=substring(mat.kode,1,2)
                    group by left(mat.kode,3),ka.kdchildpertama,ka.childpertama,mat.tahun,mat.revisidivake,mat.objectpengendalifk,mat.norec
                    union all
                    select  left(mat.kode,5) || '0000'as kode,'------' || ka.kdchildkedua as kd,ka.childkedua as desc,
                    sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake,mat.objectpengendalifk,mat.norec
                    from mataanggaran_t as mat
                    INNER JOIN kelompokanggarankedua_m ka on cast(ka.id as text)=substring(mat.kode,3,2)
                    group by left(mat.kode,5),ka.kdchildkedua,ka.childkedua,mat.tahun,mat.revisidivake,mat.objectpengendalifk,mat.norec
                    union all
                    select left(mat.kode,7) || '00'as kode,'---------' || ka.kdchildketiga as kd,ka.childketiga as desc,
                    sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm,mat.tahun as tahun,mat.revisidivake,mat.objectpengendalifk,mat.norec
                    from mataanggaran_t as mat
                    INNER JOIN kelompokanggaranketiga_m as ka on cast(ka.id as text)=substring(mat.kode,5,2)
                    group by left(mat.kode,7),ka.kdchildketiga,ka.childketiga,mat.tahun,mat.revisidivake,mat.objectpengendalifk,mat.norec
                    union all
                    select  left(mat.kode,9) as kode,'------------' || ka.kdchildkeempat as kd,ka.childkeempat as desc,
                    sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm,mat.tahun as tahun,mat.revisidivake,mat.objectpengendalifk,mat.norec
                    from mataanggaran_t as mat
                    INNER JOIN kelompokanggarankeempat_m as ka on cast(ka.id as text)=substring(mat.kode,7,3)
                    group by left(mat.kode,9),ka.kdchildkeempat,ka.childkeempat,mat.tahun,mat.revisidivake,mat.objectpengendalifk,mat.norec
                    union all
                    select left(mat.kode,9) || '~' || norec as kode,'---------------'  as kd,mat.mataanggaran as desc,
                    sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake,mat.objectpengendalifk,mat.norec
                    from mataanggaran_t as mat
                    group by left(mat.kode,9)|| '~' || norec,mat.kode,mat.mataanggaran,mat.tahun,mat.revisidivake,mat.objectpengendalifk,mat.norec
                    ) as x WHERE tahun=:tahun 
                    and revisidivake=:revisidivake
                    $Pengendali 
                    order by kode;"),
            array(
                'tahun' => $request['tahun'],
                'revisidivake' => $request['revisike'],
            )
        );

        $result = array(
            'data' => $data,
            'message' => 'ramdanegie',
        );

        return $this->respond($result);
    }

    public function saveVerifikasiAnggaran (Request $request) {
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id',$dataLogin['userData']['id'])
            ->first();
        $tglAyeuna = date('Y-m-d H:i:s');
        $noveriF='';
        DB::beginTransaction();
        try{
            if ($request['strukverifikasi']['norec'] != '') {

                //#struk Verifikasi
                $noVerifikasi = $this->generateCode(new StrukVerifikasi(),
                    'noverifikasi', 10, 'CA'.$this->getDateTime()->format('Y'));
                $dataSV = new StrukVerifikasiAnggaran();
                $dataSV->norec = $dataSV->generateNewId();
                $dataSV->noverifikasi = $noVerifikasi;
                $dataSV->kdprofile = 0;
                $dataSV->statusenabled = true;
                $dataSV->objectkelompoktransaksifk = 102;
                $dataSV->keteranganlainnya = $request['strukverifikasi']['keterangan'];
                $dataSV->objectpegawaipjawabfk = $dataPegawai->objectpegawaifk;
                $dataSV->namaverifikasi = 'Confirm Anggaran';
                $dataSV->tglverifikasi = $tglAyeuna;
                $dataSV->tgleksekusi = $tglAyeuna;
                $dataSV->statusterima =  $request['strukverifikasi']['status'];
                $dataSV->totalpengajuan = $request['strukverifikasi']['totalpengajuan'];
                $dataSV->totalppn = $request['strukverifikasi']['totalppn'];
                $dataSV->totaldiskon = $request['strukverifikasi']['totaldiskon'];
                $dataSV->save();
                $dataSV = $dataSV->norec;
                $noveriF = $noVerifikasi;
                $dataSO = StrukOrder::where('norec', $request['strukverifikasi']['norec'])
                    ->update([
                            'strukverifikasianggaranfk' => $dataSV,
                        ]
                    );
            }
//                return $this->respond($noveriF);
            //***** Struk Realisasi *****
            $datanorecSR = '';
            if ($request['strukverifikasi']['norecrealisasi'] == '') {
                $dataSR= new StrukRealisasi();
                $norealisasi = $this->generateCode(new StrukRealisasi(),'norealisasi',10,'RA-'.$this->getDateTime()->format('ym'));
                $dataSR->norec = $dataSR->generateNewId();
                $dataSR->kdprofile = 0;
                $dataSR->statusenabled = true;
                $dataSR->norealisasi = $norealisasi;
                $dataSR->tglrealisasi = $tglAyeuna;
                $dataSR->objectmataanggaranfk = $request['strukverifikasi']['mataanggaran'];
//                $dataSR->status = 1;
                $dataSR->save();
                if($datanorecSR == null){
                    $datanorecSR = $request['strukverifikasi']['norecrealisasi'];
                }else{
                    $datanorecSR = $dataSR->norec;
                }
            }else {
                $dataSR = StrukRealisasi::where('norec', $request['strukverifikasi']['norecrealisasi'])->first();
                $dataSR->tglrealisasi = $tglAyeuna;
                $dataSR->objectmataanggaranfk = $request['strukverifikasi']['mataanggaran'];
                $dataSR->save();
                if($datanorecSR == null){
                    $datanorecSR = $request['strukverifikasi']['norecrealisasi'];
                }else{
                    $datanorecSR = $dataSR->norec;
                }
            }

            //***** Riwayat Realisasi *****
            if ($request['strukverifikasi']['norecrealisasi'] != null) {
                $dataRR= new RiwayatRealisasi();
                $dataRR->norec = $dataRR->generateNewId();
                $dataRR->kdprofile = 0;
                $dataRR->statusenabled = true;
                $dataRR->objectkelompoktransaksifk = 102;
            }else {
                $dataRR = RiwayatRealisasi::where('objectstrukrealisasifk', $request['strukverifikasi']['norecrealisasi'])->first();
            }
            $dataRR->objectstrukrealisasifk = $datanorecSR;
            $dataRR->objectstrukfk = $request['strukverifikasi']['norec'];
            $dataRR->tglrealisasi = $tglAyeuna;
            $dataRR->objectpetugasfk = $dataPegawai->objectpegawaifk;
            $dataRR->noorderintern = $request['strukverifikasi']['nousulan'];
            $dataRR->keteranganlainnya = 'Confirm Anggaran';
            $dataRR->objectverifikasifk = $dataSV;
            $dataRR->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Verifikasi Anggaran";
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Verifikasi Anggaran Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "nousulan" => $request['strukverifikasi']['nousulan'],
                "data" => $dataSV,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = "Simpan Verifikasi Anggaran Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "norec" => $request['strukverifikasi']['norec'],
                "data" => $dataSV,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getKelAnggaranKeTiga(Request $request) {
        $req=$request->all();
        $keempat = \DB::table('kelompokanggaranketiga_m as ru')
            ->select('ru.id','ru.kdchildketiga','ru.childketiga')
            ->where('ru.statusenabled', true)
            ->orderBy('ru.childketiga');

        if(isset($req['childketiga']) &&
            $req['childketiga']!="" &&
            $req['childketiga']!="undefined"){
            $keempat = $keempat->where('ru.childketiga','like','%'. $req['childketiga'] .'%');
        };

        if(isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value']!="" &&
            $req['filter']['filters'][0]['value']!="undefined"){
            $keempat = $keempat->where('ru.childketiga','like','%'.$req['filter']['filters'][0]['value'].'%' );
        };

        $keempat = $keempat->take(20);
        $keempat = $keempat->get();

        foreach ($keempat as $item){
            $data[]=array(
                'id' => $item->id,
                'kdchildketiga' => $item->kdchildketiga,
                'childketiga' =>$item->kdchildketiga.' - '.$item->childketiga,
            );
        }
        return $this->respond($data);
    }

    public function getKelAnggaranKedua(Request $request) {
        $req=$request->all();
        $keempat = \DB::table('kelompokanggarankedua_m as ru')
            ->select('ru.id','ru.kodeexternal','ru.kdchildkedua','ru.childkedua','ru.namaexternal')
            ->where('ru.statusenabled', true)
            ->orderBy('ru.childkedua');

        if(isset($req['childkedua']) &&
            $req['childkedua']!="" &&
            $req['childkedua']!="undefined"){
            $keempat = $keempat->where('ru.childkedua','like','%'. $req['childkedua'] .'%');
        };

        if(isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value']!="" &&
            $req['filter']['filters'][0]['value']!="undefined"){
            $keempat = $keempat->where('ru.childkedua','like','%'.$req['filter']['filters'][0]['value'].'%' );
        };

        $keempat = $keempat->take(20);
        $keempat = $keempat->get();

        foreach ($keempat as $item){
            $data[]=array(
                'id' => $item->id,
                'kdchildkedua' => $item->kdchildkedua,
                'childkedua' =>$item->kodeexternal.' - '.$item->kdchildkedua.' - '.$item->childkedua.' - '.$item->namaexternal,
            );
        }
        return $this->respond($data);
    }
     public function deleteKelompokAnggaran(Request $request) {
        $dataLogin = $request->all();
        DB::beginTransaction();
        try{
            if($request['kelompok'] == 5){
                  if ($request['id'] != ''){
                    $data1 = KelompokAnggaranKelima::where('id', $request['id'])->delete();
                    $transStatus = 'true';
                }
            }
            if($request['kelompok'] == 6){
                  if ($request['id'] != ''){
                    $data1 = KelompokAnggaranKeenam::where('id', $request['id'])->delete();
                    $transStatus = 'true';
                }
            }
            if($request['kelompok'] == 7){
                if ($request['id'] != ''){
                    $data1 = KelompokAnggaranKetujuh::where('id', $request['id'])->delete();
                    $transStatus = 'true';
                }
            }
          
        }
        catch(\Exception $e){
            $transStatus= 'false';
        }
        if ($transStatus=='true')
        {    DB::commit();
            $transMessage = "Data Terhapus";
        }
        else{
            DB::rollBack();
            $transMessage = "Data Gagal Dihapus";
        }

        return $this->setStatusCode(201)->respond([], $transMessage);
    }
    public function saveKelompokAnggaran(Request $request) {
        DB::beginTransaction();
        try{
            if($request['kelompok'] == 5){
                if ($request['id']==''){
                    $newId = KelompokAnggaranKelima::max('id');
                    $newId= $newId+1;
                    $MA = new KelompokAnggaranKelima();
                    $MA->id = $newId;
                    $MA->kdprofile = 0;
                    $MA->statusenabled = true;
                }else{
                    $MA= KelompokAnggaranKelima::where('id',$request['id'])
                        ->first();
                }
                $MA->kdchildkelima = $request['kdkelompok'];
                $MA->childkelima =  $request['namakelompok'];
                $MA->kodeexternal =  $request['kodeexternal'];
                $MA->namaexternal =  $request['namaexternal'];
                $MA->objectchildkeempatfk =  $request['idparent'];

                $MA->save();
            }
             if($request['kelompok'] == 6){
                if ($request['id']==''){
                    $newId = KelompokAnggaranKeenam::max('id');
                    $newId= $newId+1;
                    $MA = new KelompokAnggaranKeenam();
                    $MA->id = $newId;
                    $MA->kdprofile = 0;
                    $MA->statusenabled = true;
                }else{
                    $MA= KelompokAnggaranKeenam::where('id',$request['id'])
                        ->first();
                }
                $MA->kdchildkeenam = $request['kdkelompok'];
                $MA->childkeenam =  $request['namakelompok'];
                $MA->kodeexternal =  $request['kodeexternal'];
                $MA->namaexternal =  $request['namaexternal'];
                $MA->objectchildkelimafk =  $request['idparent'];

                $MA->save();
            }
            if($request['kelompok'] == 7){
                if ($request['id']==''){
                    $newId = KelompokAnggaranKetujuh::max('id');
                    $newId= $newId+1;
                    $MA = new KelompokAnggaranKetujuh();
                    $MA->id = $newId;
                    $MA->kdprofile = 0;
                    $MA->statusenabled = true;
                }else{
                    $MA= KelompokAnggaranKetujuh::where('id',$request['id'])
                        ->first();
                }
                $MA->kdchildketujuh = $request['kdkelompok'];
                $MA->childketujuh =  $request['namakelompok'];
                $MA->kodeexternal =  $request['kodeexternal'];
                $MA->namaexternal =  $request['namaexternal'];
                $MA->objectchildkeenamfk =  $request['idparent'];

                $MA->save();
            }
           
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan Mata Anggaran";
        }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $MA,
                'as' => 'ramdanegie',
            );
        } else {
            $transMessage = "Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'result' => $MA,
                'as' => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
     public function getKelAnggaranKelima(Request $request) {
        $req=$request->all();
        $keempat = \DB::table('kelompokanggarankelima_m as ru')
            ->select('ru.id','ru.kdchildkelima','ru.childkelima')
            ->where('ru.statusenabled', true)
            ->orderBy('ru.childkelima');

        if(isset($req['childkelima']) &&
            $req['childkelima']!="" &&
            $req['childkelima']!="undefined"){
            $keempat = $keempat->where('ru.childkelima','like','%'. $req['childkelima'] .'%');
        };

        if(isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value']!="" &&
            $req['filter']['filters'][0]['value']!="undefined"){
            $keempat = $keempat->where('ru.childkelima','like','%'.$req['filter']['filters'][0]['value'].'%' );
        };

        $keempat = $keempat->take(20);
        $keempat = $keempat->get();
         $data=[];
        foreach ($keempat as $item){
            $data[]=array(
                'id' => $item->id,
                'kdchildkelima' => $item->kdchildkelima,
                'childkelima' =>$item->kdchildkelima.' - '.$item->childkelima,
            );
        }
        return $this->respond($data);
    }
     public function getKelAnggaranKeenam(Request $request) {
        $req=$request->all();
        $keempat = \DB::table('kelompokanggarankeenam_m as ru')
            ->select('ru.id','ru.kdchildkeenam','ru.childkeenam')
            ->where('ru.statusenabled', true)
            ->orderBy('ru.childkeenam');

        if(isset($req['childkeenam']) &&
            $req['childkeenam']!="" &&
            $req['childkeenam']!="undefined"){
            $keempat = $keempat->where('ru.childkeenam','like','%'. $req['childkeenam'] .'%');
        };

        if(isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value']!="" &&
            $req['filter']['filters'][0]['value']!="undefined"){
            $keempat = $keempat->where('ru.childkeenam','like','%'.$req['filter']['filters'][0]['value'].'%' );
        };

        $keempat = $keempat->take(20);
        $keempat = $keempat->get();
         $data =[];
        foreach ($keempat as $item){
            $data[]=array(
                'id' => $item->id,
                'kdchildkeenam' => $item->kdchildkeenam,
                'childkeenam' =>$item->kdchildkeenam.' - '.$item->childkeenam,
            );
        }
        return $this->respond($data);
    }

    public function getKelAnggaranKetujuh(Request $request) {
        $req=$request->all();
        $keempat = \DB::table('kelompokanggaranketujuh_m as ru')
            ->select('ru.id','ru.kdchildketujuh','ru.childketujuh')
            ->where('ru.statusenabled', true)
            ->orderBy('ru.childketujuh');

        if(isset($req['childketujuh']) &&
            $req['childketujuh']!="" &&
            $req['childketujuh']!="undefined"){
            $keempat = $keempat->where('ru.childketujuh','like','%'. $req['childketujuh'] .'%');
        };

        if(isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value']!="" &&
            $req['filter']['filters'][0]['value']!="undefined"){
            $keempat = $keempat->where('ru.childketujuh','like','%'.$req['filter']['filters'][0]['value'].'%' );
        };

        $keempat = $keempat->take(20);
        $keempat = $keempat->get();
        $data =[];
        foreach ($keempat as $item){
            $data[]=array(
                'id' => $item->id,
                'kdchildketujuh' => $item->kdchildketujuh,
                'childketujuh' =>$item->kdchildketujuh.' - '.$item->childketujuh,
            );
        }
        return $this->respond($data);
    }

    public function getDataComboSatuan() {

        $data = \DB::table('satuanwaktu_m as sw')
            ->select('sw.id','sw.reportdisplay')
            ->where('sw.statusenabled', true)
            ->orderBy('sw.id','desc')
            ->get();

        return $this->respond($data);
    }
    public function getDataRealisasi(Request $request) {
        $tahun = $request['tahun'];
        $kelompok = $request['kelompok'];
        $data = DB::select(DB::raw("select *,round((bulanlalu/dipa)*100,2) as persenbulanlalu,round((bulanini/dipa)*100,2) as persenbulanini,bulanlalu+bulanini as sdbulanini,round((bulanlalu/dipa)*100,2)+round((bulanini/dipa)*100,2) as persensdini,dipa-bulanlalu-bulanini as sisadana,100-(round((bulanlalu/dipa)*100,2)+round((bulanini/dipa)*100,2)) as persensisa 
                  from v_realisasi
                  where tahun=$tahun
            and kd2 like '%$kelompok%' 
                  order by kd2 "));


        return $this->respond($data);
    }

    public function getDataComboKelompokAnggaranByParent(Request $request)
    {
        $dataLogin = $request->all();
        $idparent1 = "";


        if(isset($request['idparent1']) && $request['idparent1']!="" && $request['idparent1']!="undefined"){
            $idparent1=$request['idparent1'];
        }

        if(isset($request['idparent2']) && $request['idparent2']!="" && $request['idparent2']!="undefined"){
            $idparent2=$request['idparent2'];
        }

        if(isset($request['idparent3']) && $request['idparent3']!="" && $request['idparent3']!="undefined"){
            $idparent3=$request['idparent3'];
        }

        if(isset($request['idparent4']) && $request['idparent4']!="" && $request['idparent4']!="undefined"){
            $idparent4=$request['idparent4'];
        }

        if(isset($request['idparent5']) && $request['idparent5']!="" && $request['idparent5']!="undefined"){
            $idparent5=$request['idparent5'];
        }

        if(isset($request['idparent6']) && $request['idparent6']!="" && $request['idparent6']!="undefined"){
            $idparent6=$request['idparent6'];
        }

//        if(isset($request['idparent1']) && $request['idparent1']!="" && $request['idparent1']!="undefined"){
//            $idparent1=$request['idparent1'];
//        }


        $head = \DB::table('kelompokanggaranhead_m as dp')
            ->select('dp.id','dp.kdkelompokhead','dp.kelompokhead','dp.kodeexternal','dp.namaexternal', DB::raw("CONCAT(dp.kdkelompokhead,' ',dp.kelompokhead) as nama") )
            ->where('dp.statusenabled', true)
            //->orderBy('dp.kelompokhead')
            ->orderBy('id','desc')
            ->get();
        $pertama = \DB::table('kelompokanggaranpertama_m as ru')
            ->JOIN('kelompokanggaranhead_m as k0', 'k0.id','=','ru.objectheadfk')
            ->select('ru.id','ru.kdchildpertama','ru.childpertama','ru.kodeexternal','ru.namaexternal','k0.id as idparent','k0.kdkelompokhead','k0.kelompokhead', DB::raw("CONCAT(ru.kdchildpertama,' ',ru.childpertama) as nama"))
            ->where('ru.statusenabled', true)
            ->where('ru.objectheadfk', $idparent1)
            //->orderBy('ru.childpertama')
            ->orderBy('id','desc')
            ->get();
        $kedua = \DB::table('kelompokanggarankedua_m as ru')
            ->JOIN('kelompokanggaranpertama_m as k1','k1.id','=','ru.objectchildpertamafk')
            ->select('ru.id','ru.kdchildkedua','ru.childkedua','ru.kodeexternal','ru.namaexternal','k1.id as idparent','k1.kdchildpertama','k1.childpertama', DB::raw("CONCAT(ru.kdchildkedua,' ',ru.childkedua) as nama"))
            ->where('ru.statusenabled', true)
            ->where('ru.objectchildpertamafk',$idparent2)
            //->orderBy('ru.childkedua')
            ->orderBy('id','desc')
            ->get();
        $ketiga = \DB::table('kelompokanggaranketiga_m as ru')
            ->JOIN('kelompokanggarankedua_m as k2','k2.id','=','ru.objectchildkeduafk')
            ->select('ru.id','ru.childketiga','ru.kdchildketiga','ru.kodeexternal','ru.namaexternal','k2.id as idparent','k2.kdchildkedua','k2.childkedua', DB::raw("CONCAT(ru.kdchildketiga,' ',ru.childketiga) as nama"))
            ->where('ru.statusenabled', true)
            ->where('ru.objectchildkeduafk',$idparent2)
            //->orderBy('ru.childketiga')
            ->orderBy('id','desc')
            ->get();

        $keempat = \DB::table('kelompokanggarankeempat_m as ru')
            ->JOIN('kelompokanggaranketiga_m as k3','k3.id','=','ru.objectchildketigafk')
            ->select('ru.id','ru.kdchildkeempat','ru.childkeempat','ru.kodeexternal','ru.namaexternal','k3.id as idparent','k3.kdchildketiga','k3.childketiga', DB::raw("CONCAT(ru.kdchildkeempat,' ',ru.childkeempat) as nama"))
            ->where('ru.statusenabled', true)
            ->where('ru.objectchildketigafk',$idparent3)
            //->orderBy('ru.childkeempat')
            ->orderBy('id','desc')
            ->get();
        $kelima = \DB::table('kelompokanggarankelima_m as ru')
            ->JOIN('kelompokanggarankeempat_m as k4','k4.id','=','ru.objectchildkeempatfk')
            ->select('ru.id','ru.kdchildkelima','ru.childkelima','ru.kodeexternal','ru.namaexternal','k4.id as idparent','k4.kdchildkeempat','k4.childkeempat', DB::raw("CONCAT(ru.kdchildkelima,' ',ru.childkelima) as nama"))
            ->where('ru.statusenabled', true)
            ->where('ru.objectchildkeempatfk',$idparent4)
            //->orderBy('ru.childkelima')
            ->orderBy('id','desc')
            ->get();

        $keenam = \DB::table('kelompokanggarankeenam_m as ru')
            ->JOIN('kelompokanggarankelima_m as k5','k5.id','=','ru.objectchildkelimafk')
            ->select('ru.id','ru.kdchildkeenam','ru.childkeenam','ru.kodeexternal','ru.namaexternal','k5.id as idparent','k5.kdchildkelima','k5.childkelima', DB::raw("CONCAT(ru.kdchildkeenam,' ',ru.childkeenam) as nama"))
            ->where('ru.statusenabled', true)
            ->where('ru.objectchildkelimafk',$idparent5)
            //->orderBy('ru.childkeenam')
            ->orderBy('id','desc')
            ->get();

        $ketujuh = \DB::table('kelompokanggaranketujuh_m as ru')
            ->JOIN('kelompokanggarankeenam_m as k6','k6.id','=','ru.objectchildkeenamfk')
            ->select('ru.id','ru.kdchildketujuh','ru.childketujuh','ru.kodeexternal','ru.namaexternal','k6.id as idparent','k6.kdchildkeenam','k6.childkeenam', DB::raw("CONCAT(ru.kdchildketujuh,' ',ru.childketujuh) as nama"))
            ->where('ru.statusenabled', true)
            ->where('ru.objectchildkeenamfk',$idparent6)
            //->orderBy('ru.childkeenam')
            ->orderBy('id','desc')
            ->get();

        $Pengendali = \DB::table('pengendali_m as ru')
            ->select('ru.id','ru.pengendali')
            ->where('ru.statusenabled', true)
            ->orderBy('ru.pengendali')
            ->get();


        $result = array(
            'kelompokhead' => $head,
            'kelompokpertama' => $pertama,
            'kelompokkedua' => $kedua,
            'kelompokketiga' => $ketiga,
            'kelompokkeempat' => $keempat,
            'kelompokkelima' => $kelima,
            'kelompokkeenam' => $keenam,
            'kelompokketujuh' => $ketujuh,

            'datalogin' => $dataLogin,
            'pengendali' => $Pengendali,
            'message' => 'ramdanegie',
        );

        return $this->respond($result);
    }

    public function getDataComboParentKelompokPertama(Request $request)
    {
        $dataLogin = $request->all();
        $idparent1 = "";


        if(isset($request['idparent1']) && $request['idparent1']!="" && $request['idparent1']!="undefined"){
            $idparent1=$request['idparent1'];
        }


        $pertama = \DB::table('kelompokanggaranpertama_m as ru')
            ->JOIN('kelompokanggaranhead_m as k0', 'k0.id','=','ru.objectheadfk')
            ->select('ru.id','ru.kdchildpertama','ru.childpertama','ru.kodeexternal','ru.namaexternal','k0.id as idparent','k0.kdkelompokhead','k0.kelompokhead', DB::raw("CONCAT(ru.kdchildpertama,' ',ru.childpertama) as nama"))
            ->where('ru.statusenabled', true)
            ->where('ru.objectheadfk', $idparent1)
            //->orderBy('ru.childpertama')
            ->orderBy('id','desc')
            ->get();



        $result = array(
            'kelompokpertama' => $pertama,


            'datalogin' => $dataLogin,
            'message' => 'dy',
        );

        return $this->respond($result);
    }

    public function getDataComboParentKelompokKedua(Request $request)
    {
        $dataLogin = $request->all();
        $idparent2 = "";

        if(isset($request['idparent2']) && $request['idparent2']!="" && $request['idparent2']!="undefined"){
            $idparent2=$request['idparent2'];
        }

        $kedua = \DB::table('kelompokanggarankedua_m as ru')
            ->JOIN('kelompokanggaranpertama_m as k1','k1.id','=','ru.objectchildpertamafk')
            ->select('ru.id','ru.kdchildkedua','ru.childkedua','ru.kodeexternal','ru.namaexternal','k1.id as idparent','k1.kdchildpertama','k1.childpertama', DB::raw("CONCAT(ru.kdchildkedua,' ',ru.childkedua) as nama"))
            ->where('ru.statusenabled', true)
            ->where('ru.objectchildpertamafk',$idparent2)
            //->orderBy('ru.childkedua')
            ->orderBy('id','desc')
            ->get();



        $result = array(
            'kelompokkedua' => $kedua,
            'message' => 'dy',
        );

        return $this->respond($result);
    }

    public function getDataComboParentKelompokKetiga(Request $request)
    {
        $dataLogin = $request->all();

        $idparent3 = "";
        if(isset($request['idparent3']) && $request['idparent3']!="" && $request['idparent3']!="undefined"){
            $idparent3=$request['idparent3'];
        }

        $ketiga = \DB::table('kelompokanggaranketiga_m as ru')
            ->JOIN('kelompokanggarankedua_m as k2','k2.id','=','ru.objectchildkeduafk')
            ->select('ru.id','ru.childketiga','ru.kdchildketiga','ru.kodeexternal','ru.namaexternal','k2.id as idparent','k2.kdchildkedua','k2.childkedua', DB::raw("CONCAT(ru.kdchildketiga,' ',ru.childketiga) as nama"))
            ->where('ru.statusenabled', true)
            ->where('ru.objectchildkeduafk',$idparent3)
            //->orderBy('ru.childketiga')
            ->orderBy('id','desc')
            ->get();

        $result = array(
            'kelompokketiga' => $ketiga,
            'message' => 'dy',
        );

        return $this->respond($result);
    }

    public function getDataComboParentKelompokKeempat(Request $request)
    {
        $dataLogin = $request->all();

        $idparent4 = "";

        if(isset($request['idparent4']) && $request['idparent4']!="" && $request['idparent4']!="undefined"){
            $idparent4=$request['idparent4'];
        }



        $keempat = \DB::table('kelompokanggarankeempat_m as ru')
            ->JOIN('kelompokanggaranketiga_m as k3','k3.id','=','ru.objectchildketigafk')
            ->select('ru.id','ru.kdchildkeempat','ru.childkeempat','ru.kodeexternal','ru.namaexternal','k3.id as idparent','k3.kdchildketiga','k3.childketiga', DB::raw("CONCAT(ru.kdchildkeempat,' ',ru.childkeempat) as nama"))
            ->where('ru.statusenabled', true)
            ->where('ru.objectchildketigafk',$idparent4)
            //->orderBy('ru.childkeempat')
            ->orderBy('id','desc')
            ->get();


        $result = array(
            'kelompokkeempat' => $keempat,
            'message' => 'dy',
        );

        return $this->respond($result);
    }

    public function getDataComboParentKelompokKelima(Request $request)
    {
        $dataLogin = $request->all();

        $idparent5 = "";


        $kelima = \DB::table('kelompokanggarankelima_m as ru')
            ->JOIN('kelompokanggarankeempat_m as k4','k4.id','=','ru.objectchildkeempatfk')
            ->select('ru.id','ru.kdchildkelima','ru.childkelima','ru.kodeexternal','ru.namaexternal','k4.id as idparent','k4.kdchildkeempat','k4.childkeempat', DB::raw("CONCAT(ru.kdchildkelima,' ',ru.childkelima) as nama"))
            ->where('ru.statusenabled', true);


        if(isset($request['idparent5']) && $request['idparent5']!="" && $request['idparent5']!="undefined"){
            $kelima = $kelima->where('ru.objectchildkeempatfk',$request['idparent5']);
            //$idparent5=$request['idparent5'];
        }

        $kelima=$kelima->orderBy('id','desc')
               ->get();

        $result = array(

            'kelompokkelima' => $kelima,
            'message' => 'dy',
        );

        return $this->respond($result);
    }

    public function getDataComboParentKelompokKeenam(Request $request)
    {
        $dataLogin = $request->all();

        $idparent6 = "";



        $keenam = \DB::table('kelompokanggarankeenam_m as ru')
            ->JOIN('kelompokanggarankelima_m as k5','k5.id','=','ru.objectchildkelimafk')
            ->select('ru.id','ru.kdchildkeenam','ru.childkeenam','ru.kodeexternal','ru.namaexternal','k5.id as idparent','k5.kdchildkelima','k5.childkelima', DB::raw("CONCAT(ru.kdchildkeenam,' ',ru.childkeenam) as nama"))
            ->where('ru.statusenabled', true);


        if(isset($request['idparent6']) && $request['idparent6']!="" && $request['idparent6']!="undefined"){
            $keenam = $keenam->where('ru.objectchildkelimafk',$request['idparent6']);
        }

        $keenam=$keenam->orderBy('id','desc')
                ->get();

        $result = array(

            'kelompokkeenam' => $keenam,
            'message' => 'dy',
        );

        return $this->respond($result);
    }

    public function getDataComboParentKelompokKetujuh(Request $request)
    {
        $dataLogin = $request->all();

        $idparent7 = "";


        if(isset($request['idparent7']) && $request['idparent7']!="" && $request['idparent7']!="undefined"){
            $idparent7=$request['idparent7'];
        }


        $ketujuh = \DB::table('kelompokanggaranketujuh_m as ru')
            ->JOIN('kelompokanggarankeenam_m as k6','k6.id','=','ru.objectchildkeenamfk')
            ->select('ru.id','ru.kdchildketujuh','ru.childketujuh','ru.kodeexternal','ru.namaexternal','k6.id as idparent','k6.kdchildkeenam','k6.childkeenam', DB::raw("CONCAT(ru.kdchildketujuh,' ',ru.childketujuh) as nama"))
            ->where('ru.statusenabled', true)
            ->where('ru.objectchildkeenamfk',$idparent7)
            //->orderBy('ru.childkeenam')
            ->orderBy('id','desc')
            ->get();

        $result = array(
            'kelompokketujuh' => $ketujuh,

            'message' => 'dy',
        );

        return $this->respond($result);
    }

    public function getInfoMataAnggaran(Request $request){
        $kdmataanggaran =  ' ';
        $kelompokanggaran =  ' ';

        if (isset($request['kelompokanggaran']) && $request['kelompokanggaran'] != "" && $request['kelompokanggaran'] != "undefined") {
            $kelompokanggaran =  ' where x.no =  ' . $request['kelompokanggaran'];
        }

        if (isset($request['kdmataanggaran']) && $request['kdmataanggaran'] != "" && $request['kdmataanggaran'] != "undefined") {
            $kdmataanggaran =  " and x.kd =  '" . $request['kdmataanggaran'] . "'";
        }

        $data = DB::select(DB::raw("select x.no, x.kd,x.desk,x.totalblu,x.totalrm,x.tahun,x.revisidivake, 
                                            CASE WHEN x.isbiayaoperasional = 0 THEN 'I. BIAYA OPERASIONAL' ELSE 'II.BIAYA NON OPERASIONAL' END AS isbiayaoperasional,
                                            x.jenisbiaya, x.volume, x.pengali, x.satuan, x.hargasatuan, x.reportdisplay, x.turunankelima, x.turunankeenam from
                    (
											
											
											 select 7 as no, 
										case when ka.kodeexternal is not null and  ka.kdchildkeenam is not NULL then ka.kdchildkeenam 
											when ka.kodeexternal is not null and  ka.kdchildkeenam is NULL then '------' || ka.kodeexternal 
											when ka.kodeexternal is  null and  ka.kdchildkeenam is not NULL then ka.kdchildkeenam end 
											as kd,

											case when ka.childkeenam is not null and  ka.namaexternal is not NULL then  ka.childkeenam  || ka.namaexternal 
											when ka.childkeenam is not null and  ka.namaexternal is NULL then  ka.childkeenam
											when ka.childkeenam is  null and  ka.namaexternal is not NULL then  ka.namaexternal end 
											as desk,
									--'----------' || ka.kodeexternal || ' || ' || ka.kdchildkeenam as kd,ka.childkeenam || ka.namaexternal as desk,
											sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake, mat.isbiayaoperasional, mat.jenisbiaya, mat.volume, mat.pengali, mat.satuan, mat.hargasatuan, jb.reportdisplay, CONCAT(k4.kdchildkeempat,' ',k4.childkeempat) as turunankelima, CONCAT(k5.kdchildkelima,' ',k5.childkelima) as turunankeenam
											from mataanggaran_t as mat
											INNER JOIN kelompokanggarankeenam_m ka on ka.id =mat.objectchildkeenamfk
											INNER JOIN kelompokanggarankelima_m k5 on k5.id = ka.objectchildkelimafk
											INNER JOIN kelompokanggarankeempat_m k4 on k4.id = k5.objectchildkeempatfk
											LEFT JOIN jabatan_m as jb on jb.id = mat.objectpengendalifk
											group by ka.kdchildkeenam,ka.childkeenam,mat.tahun,mat.revisidivake,ka.kodeexternal,ka.namaexternal, mat.isbiayaoperasional, mat.jenisbiaya, mat.volume, mat.pengali, mat.satuan, mat.hargasatuan, jb.reportdisplay,k4.kdchildkeempat,k4.childkeempat,k5.kdchildkelima,k5.childkelima  
								        
								        union ALL

											 select 8 as no, 
										case when ka.kodeexternal is not null and  ka.kdchildketujuh is not NULL then ka.kdchildketujuh 
											when ka.kodeexternal is not null and  ka.kdchildketujuh is NULL then '------' || ka.kodeexternal 
											when ka.kodeexternal is  null and  ka.kdchildketujuh is not NULL then ka.kdchildketujuh end 
											as kd,

											case when ka.childketujuh is not null and  ka.namaexternal is not NULL then  ka.childketujuh  || ka.namaexternal 
											when ka.childketujuh is not null and  ka.namaexternal is NULL then  ka.childketujuh
											when ka.childketujuh is  null and  ka.namaexternal is not NULL then  ka.namaexternal end 
											as desk,
									--'----------' || ka.kodeexternal || ' || ' || ka.kdchildkeenam as kd,ka.childkeenam || ka.namaexternal as desk,
											sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake, mat.isbiayaoperasional, mat.jenisbiaya, mat.volume, mat.pengali, mat.satuan, mat.hargasatuan, jb.reportdisplay, CONCAT(k4.kdchildkeempat,' ',k4.childkeempat) as turunankelima, CONCAT(k5.kdchildkelima,' ',k5.childkelima) as turunankeenam
											from mataanggaran_t as mat
											INNER JOIN kelompokanggaranketujuh_m ka on ka.id =mat.objectchildketujuhfk
											INNER JOIN kelompokanggarankeenam_m k6 on k6.id = ka.objectchildkeenamfk
											INNER JOIN kelompokanggarankelima_m k5 on k5.id = k6.objectchildkelimafk
											INNER JOIN kelompokanggarankeempat_m k4 on k4.id = k5.objectchildkeempatfk
											LEFT JOIN jabatan_m as jb on jb.id = mat.objectpengendalifk
											group by ka.kdchildketujuh,ka.childketujuh,mat.tahun,mat.revisidivake,ka.kodeexternal,ka.namaexternal, mat.isbiayaoperasional, mat.jenisbiaya, mat.volume, mat.pengali, mat.satuan, mat.hargasatuan, jb.reportdisplay,k4.kdchildkeempat,k4.childkeempat,k5.kdchildkelima,k5.childkelima  
								
                  ) as x
                    $kelompokanggaran
                    $kdmataanggaran    
                --GROUP BY x.no,x.kode,x.kd,x.desk,x.totalblu,x.totalrm,x.tahun,x.revisidivake,x.objectpengendalifk
            order by x.kd asc;
            
            "));


        // foreach ($data as $key => $row) {
        //     $count[$key] = $row->kd;
        // }

//        if ($count[$key] != ''){
//        array_multisort($count, SORT_ASC, $data);
//        }
        $result = array(
            'data' => $data,
            'message' => 'dy',
        );
        return $this->respond($result);
    }

    public function getDataComboSatuanAnggaran() {

        $data = \DB::table('satuananggaran_m as sw')
            ->select('sw.id','sw.reportdisplay')
            ->where('sw.statusenabled', true)
            ->orderBy('sw.id','desc')
            ->get();

        return $this->respond($data);
    }
    public function getLaporanRealisasi(Request $request){
        $dataLogin = $request->all();
        // $Pengendali =  ' ';
        $tahun =  $request['tahun'];
        $bulan =  $request['bulan'];
        $kelompok =  $request['kelompok'];

       
        //tanda
       
        $data = DB::select(DB::raw("select norec,saldoawalblu,tahun,
                                    kdkelompokhead,kelompokhead,kdchildpertama,childpertama,kdchildkedua, childkedua,kdchildketiga,childketiga,kdchildkeempat, childkeempat,kdchildkelima,childkelima,kdchildkeenam,childkeenam,kdchildketujuh,childketujuh 
                                    from v_dataanggaran
                                    where statusenabled=1
                                    and tahun  = $tahun 
                                  "));

        $databulanlalu = DB::select(DB::raw("
                                    select sum(realisasi) as jumlah,norecanggaranfk from realisasianggaran_t
                                    where MONTH(tanggalrealisasi)<$bulan
                                    and year(tanggalrealisasi)=$tahun
                                    group by norecanggaranfk
                                    
                                  "));
        $databulanini= DB::select(DB::raw(" select sum(realisasi) as jumlah,norecanggaranfk  from realisasianggaran_t
                                    where MONTH(tanggalrealisasi)=$bulan
                                    and year(tanggalrealisasi)=$tahun
                                    group by norecanggaranfk
                                  "));

        // $dataalokasi = DB::select(DB::raw("
        //                             select CAST(SUM(saldoawalblu) + SUM(saldoawalrm) AS float) 
        //                             AS dipa from v_dataanggaran
        //                             where 
        //                              tahun  = $tahun 
        //                              and kd like '%$kelompok%'
                                    
        //                           "));
                $dataalokasi = DB::select(DB::raw("
                    select top 1 *,round((bulanlalu/dipa)*100,2) as persenbulanlalu,round((bulanini/dipa)*100,2) as persenbulanini,bulanlalu+bulanini as sdbulanini,round((bulanlalu/dipa)*100,2)+round((bulanini/dipa)*100,2) as persensdini,dipa-bulanlalu-bulanini as sisadana,100-(round((bulanlalu/dipa)*100,2)+round((bulanini/dipa)*100,2)) as persensisa 
                  from v_realisasi
                  where tahun=2021
            and kd2 like '%$kelompok%'  
                                  "));

        $alokasi=0;
         foreach ($dataalokasi as $itemx) {
             $alokasi= $itemx->dipa;
         }

     
        $data1 = MataAnggaran::where('statusenabled', 1)
                    ->update([
                        'bulanlalu' => 0,
                        'bulanini' => 0
                    ]);
        $x=0;
        foreach ($data as $item) {
            // $count[$key] = $row->kd;
            $x=$x+1;
            $bulanlalu= 0;
            $bulansekarang = 0;

            // $norec = $item->norec;
            
            foreach ($databulanlalu as $item2) {
               if($item->norec == $item2->norecanggaranfk){
                    $bulanlalu = $item2->jumlah;
               }
            }
            foreach ($databulanini as $item3) {
            //     return($norec);
            // die();
               if($item->norec == $item3->norecanggaranfk){
                    $bulansekarang = $item3->jumlah;
               }
            }
            // return($item->norec);
            // die();
             $data1 = MataAnggaran::where('norec', $item->norec)
                    ->update([
                        'bulanlalu' => $bulanlalu,
                        'bulanini' => $bulansekarang
                    ]);
        }
        // return($x);
        // die();
        $result = array(
            'data' => $alokasi,
            'message' => 'dy',
        );
        return $this->respond($result);
    }
    public function getDetailDaftarMataAnggaranNew(Request $request){
        $dataLogin = $request->all();
        $Pengendali =  ' ';
        $tahun =  ' ';
        $revisiDiva =  ' ';

        if (isset($request['tahun']) && $request['tahun'] != "" && $request['tahun'] != "undefined") {
            $tahun =  ' and mat.tahun =  ' . $request['tahun'];
        }

        if (isset($request['kd']) && $request['kd'] != "" && $request['kd'] != "undefined") {
            if ($request['turunan'] == "1"){
                $kd =  " and ka.kdkelompokhead = '" . $request['kd']. "'";
            } else if ($request['turunan'] == "2") {
                $kd =  " and ka1.kdchildpertama = '" . $request['kd']. "'";
            } else if ($request['turunan'] == "3") {
                $kd =  " and ka2.kdchildkedua =  '" .$request['kd']. "'"; 
            } else if ($request['turunan'] == "4") {
                $kd =  " and ka3.kdchildketiga =  '". $request['kd']. "'"; 
            } else if ($request['turunan'] == "5") {
                $kd =  " and ka4.kdchildkeempat = '" . $request['kd']. "'"; 
            } else if ($request['turunan'] == "6") {
                $kd =  " and ka5.kdchildkelima = '". $request['kd']. "'";
            } else if ($request['turunan'] == "7") {
                $kd =  " and ka6.kdchildkeenam = '". $request['kd']. "'";
            } else if ($request['turunan'] == "8") {
                $kd =  " and ka7.kdchildketujuh = '" . $request['kd']. "'";
            }
        }

        if (isset($request['revisike']) && $request['revisike'] != "" && $request['revisike'] != "undefined") {
            $revisiDiva =  ' and revisidivake =  ' . $request['revisike'];
        }
        //tanda
        if (isset($request['turunan']) && $request['turunan'] != "" && $request['turunan'] != "undefined") {
            // if ($request['turunan'] == "1"){
                $data = DB::select(DB::raw("select 1 as no, mat.volume, mat.pengali, mat.satuan, mat.hargasatuan, ka.kdkelompokhead as kd, ka.kdkelompokhead + ka1.kdchildpertama + ka2.kdchildkedua + ka3.kdchildketiga + ka4.kdchildkeempat + ka5.kdchildkelima+ ka6.kdchildkeenam+ ka7.kdchildketujuh as kd2,ka7.kdchildketujuh as kd,upper(ka7.childketujuh) as desk,
                                            mat.saldoawalblu as totalblu,mat.saldoawalrm as totalrm ,mat.tahun as tahun,mat.revisidivake, mat.norec
                                            from mataanggaran_t as mat
                                            left JOIN kelompokanggaranhead_m as ka on ka.id =mat.objectheadfk
                                            left JOIN kelompokanggaranpertama_m ka1 on ka1.id =mat.objectchildpertamafk
                                            left JOIN kelompokanggarankedua_m ka2 on ka2.id =mat.objectchildkeduafk
                                            left JOIN kelompokanggaranketiga_m ka3 on ka3.id =mat.objectchildketigafk
                                            left join kelompokanggarankeempat_m ka4 on ka4.id = mat.objectchildkeempatfk
                                            left join kelompokanggarankelima_m ka5 on ka5.id = mat.objectchildkelimafk
                                            left join kelompokanggarankeenam_m ka6 on ka6.id = mat.objectchildkeenamfk
                                            left join kelompokanggaranketujuh_m ka7 on ka7.id = mat.objectchildketujuhfk
                                            WHERE mat.statusenabled = 1
                                            $tahun
                                            $kd
                                          "));

                // // select 8as no,ka.kdkelompokhead + ka1.kdchildpertama + ka2.kdchildkedua + ka3.kdchildketiga + ka4.kdchildkeempat + ka5.kdchildkelima+ ka6.kdchildkeenam+ ka7.kdchildketujuh as kd2,ka7.kdchildketujuh as kd,upper(ka7.childketujuh) as desk,
                //     sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake
                //     from mataanggaran_t as mat
                //     INNER JOIN kelompokanggaranhead_m as ka on ka.id =mat.objectheadfk
                //     INNER JOIN kelompokanggaranpertama_m ka1 on ka1.id =mat.objectchildpertamafk
                //     INNER JOIN kelompokanggarankedua_m ka2 on ka2.id =mat.objectchildkeduafk
                //     INNER JOIN kelompokanggaranketiga_m ka3 on ka3.id =mat.objectchildketigafk
                //     inner join kelompokanggarankeempat_m ka4 on ka4.id = mat.objectchildkeempatfk
                //     inner join kelompokanggarankelima_m ka5 on ka5.id = mat.objectchildkelimafk
                //     inner join kelompokanggarankeenam_m ka6 on ka6.id = mat.objectchildkeenamfk
                //     inner join kelompokanggaranketujuh_m ka7 on ka7.id = mat.objectchildketujuhfk
            // } else if ($request['turunan'] == "2") {
            //     $data = DB::select(DB::raw("select 2 as no, mat.volume, mat.pengali, mat.satuan, mat.hargasatuan, ka.kdchildpertama as kd,upper(ka.childpertama) as desk,
            //                                 sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake, mat.norec
            //                                 from mataanggaran_t as mat
            //                                 INNER JOIN kelompokanggaranpertama_m ka on ka.id =mat.objectchildpertamafk
            //                                 WHERE mat.statusenabled = 1
            //                                 $tahun
            //                                 $kd
            //                                 group by mat.volume, mat.pengali, mat.satuan, mat.hargasatuan, ka.kdchildpertama,ka.childpertama,mat.tahun,mat.revisidivake, mat.norec"));
            // } else if ($request['turunan'] == "3") {
            //     $data = DB::select(DB::raw("select 3 as no, mat.volume, mat.pengali, mat.satuan, mat.hargasatuan, 
            //                                 case when ka.kodeexternal is not null and ka.kdchildkedua is not NULL then ka.kdchildkedua
            //                                 when ka.kodeexternal is not null and ka.kdchildkedua is NULL then '--' + ka.kodeexternal
            //                                 when ka.kodeexternal is null and ka.kdchildkedua is not NULL then ka.kdchildkedua end
            //                                 as kd,
                                            
            //                                 case when ka.childkedua is not null and ka.namaexternal is not NULL then ka.childkedua + ka.namaexternal
            //                                 when ka.childkedua is not null and ka.namaexternal is NULL then ka.childkedua
            //                                 when ka.childkedua is null and ka.namaexternal is not NULL then ka.namaexternal end
            //                                 as desk,
                                            
            //                                 sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake, mat.norec
            //                                 from mataanggaran_t as mat
            //                                 INNER JOIN kelompokanggarankedua_m ka on ka.id =mat.objectchildkeduafk
            //                                 WHERE mat.statusenabled = 1
            //                                 $tahun
            //                                 $kd
            //                                 group by mat.volume, mat.pengali, mat.satuan, mat.hargasatuan, ka.kdchildkedua,ka.childkedua,mat.tahun,mat.revisidivake,ka.kodeexternal,ka.namaexternal, mat.norec"));
            // } else if ($request['turunan'] == "4") {
            //     $data = DB::select(DB::raw("select 4 as no, mat.volume, mat.pengali, mat.satuan, mat.hargasatuan, 
            //                                 case when ka.kodeexternal is not null and ka.kdchildketiga is not NULL then ka.kdchildketiga
            //                                 when ka.kodeexternal is not null and ka.kdchildketiga is NULL then '---' + ka.kodeexternal
            //                                 when ka.kodeexternal is null and ka.kdchildketiga is not NULL then ka.kdchildketiga end
            //                                 as kd,

            //                                 case when ka.childketiga is not null and ka.namaexternal is not NULL then ka.childketiga + ka.namaexternal
            //                                 when ka.childketiga is not null and ka.namaexternal is NULL then ka.childketiga
            //                                 when ka.childketiga is null and ka.namaexternal is not NULL then ka.namaexternal end
            //                                 as desk,

            //                                 sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake, mat.norec
            //                                 from mataanggaran_t as mat
            //                                 INNER JOIN kelompokanggaranketiga_m ka on ka.id =mat.objectchildketigafk
            //                                 WHERE mat.statusenabled = 1
            //                                 $tahun
            //                                 $kd
            //                                 group by mat.volume, mat.pengali, mat.satuan, mat.hargasatuan, ka.kdchildketiga,ka.childketiga,mat.tahun,mat.revisidivake,ka.kodeexternal,ka.namaexternal, mat.norec"));

            // } else if ($request['turunan'] == "5") {
            //     $data = DB::select(DB::raw("select 5 as no, mat.volume, mat.pengali, mat.satuan, mat.hargasatuan, 
            //                                 case when ka.kodeexternal is not null and ka.kdchildkeempat is not NULL then ka.kdchildkeempat
            //                                 when ka.kodeexternal is not null and ka.kdchildkeempat is NULL then '----' + ka.kodeexternal
            //                                 when ka.kodeexternal is null and ka.kdchildkeempat is not NULL then ka.kdchildkeempat end
            //                                 as kd,
                                            
            //                                 case when ka.childkeempat is not null and ka.namaexternal is not NULL then ka.childkeempat + ka.namaexternal
            //                                 when ka.childkeempat is not null and ka.namaexternal is NULL then ka.childkeempat
            //                                 when ka.childkeempat is null and ka.namaexternal is not NULL then ka.namaexternal end
            //                                 as desk,
                                            
            //                                 sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake, mat.norec
            //                                 from mataanggaran_t as mat
            //                                 INNER JOIN kelompokanggarankeempat_m ka on ka.id =mat.objectchildkeempatfk
            //                                 WHERE mat.statusenabled = 1
            //                                 $tahun
            //                                 $kd
            //                                 group by mat.volume, mat.pengali, mat.satuan, mat.hargasatuan, ka.kdchildkeempat,ka.childkeempat,mat.tahun,mat.revisidivake,ka.kodeexternal,ka.namaexternal, mat.norec"));
            // } else if ($request['turunan'] == "6") {
            //     $data = DB::select(DB::raw("select 6 as no, mat.volume, mat.pengali, mat.satuan, mat.hargasatuan, 
            //                                 case when ka.kodeexternal is not null and  ka.kdchildkelima is not NULL then ka.kdchildkelima 
            //                                 when ka.kodeexternal is not null and  ka.kdchildkelima is NULL then '-----' + ka.kodeexternal 
            //                                 when ka.kodeexternal is  null and  ka.kdchildkelima is not NULL then ka.kdchildkelima end 
            //                                 as kd,

            //                                 case when ka.childkelima is not null and  ka.namaexternal is not NULL then  ka.childkelima  + ka.namaexternal 
            //                                 when ka.childkelima is not null and  ka.namaexternal is NULL then  ka.childkelima
            //                                 when ka.childkelima is  null and  ka.namaexternal is not NULL then  ka.namaexternal end 
            //                                 as desk,
            //                                             --'--------' + ka.kodeexternal + ' || ' + ka.kdchildkelima as kd,ka.childkelima + ka.namaexternal as desk,
            //                                 sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake, mat.norec
            //                                 from mataanggaran_t as mat
            //                                 INNER JOIN kelompokanggarankelima_m ka on ka.id =mat.objectchildkelimafk
            //                                 WHERE mat.statusenabled = 1
            //                                 $tahun
            //                                 $kd
            //                                 group by mat.volume, mat.pengali, mat.satuan, mat.hargasatuan, ka.kdchildkelima,ka.childkelima,mat.tahun,mat.revisidivake,ka.kodeexternal,ka.namaexternal, mat.norec"));
            // } else if ($request['turunan'] == "7") {
            //     $data = DB::select(DB::raw("select 7 as no, mat.volume, mat.pengali, mat.satuan, mat.hargasatuan, 
            //                                 case when ka.kodeexternal is not null and  ka.kdchildkeenam is not NULL then ka.kdchildkeenam 
            //                                 when ka.kodeexternal is not null and  ka.kdchildkeenam is NULL then '------' + ka.kodeexternal 
            //                                 when ka.kodeexternal is  null and  ka.kdchildkeenam is not NULL then ka.kdchildkeenam end 
            //                                 as kd,

            //                                 case when ka.childkeenam is not null and  ka.namaexternal is not NULL then  ka.childkeenam  + ka.namaexternal 
            //                                 when ka.childkeenam is not null and  ka.namaexternal is NULL then  ka.childkeenam
            //                                 when ka.childkeenam is  null and  ka.namaexternal is not NULL then  ka.namaexternal end 
            //                                 as desk,
            //                         --'----------' + ka.kodeexternal + ' || ' + ka.kdchildkeenam as kd,ka.childkeenam + ka.namaexternal as desk,
            //                                 sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake, mat.norec
            //                                 from mataanggaran_t as mat
            //                                 INNER JOIN kelompokanggarankeenam_m ka on ka.id =mat.objectchildkeenamfk
            //                                 WHERE mat.statusenabled = 1
            //                                 $tahun
            //                                 $kd
            //                                 group by mat.volume, mat.pengali, mat.satuan, mat.hargasatuan, ka.kdchildkeenam,ka.childkeenam,mat.tahun,mat.revisidivake,ka.kodeexternal,ka.namaexternal, mat.norec"));
            // } else if ($request['turunan'] == "8") {
            //     $data = DB::select(DB::raw("select 8 as no, mat.volume, mat.pengali, mat.satuan, mat.hargasatuan, 
            //                                 case when ka.kodeexternal is not null and  ka.kdchildketujuh is not NULL then ka.kdchildketujuh 
            //                                 when ka.kodeexternal is not null and  ka.kdchildketujuh is NULL then '------' + ka.kodeexternal 
            //                                 when ka.kodeexternal is  null and  ka.kdchildketujuh is not NULL then ka.kdchildketujuh end 
            //                                 as kd,

            //                                 case when ka.childketujuh is not null and  ka.namaexternal is not NULL then  ka.childketujuh  + ka.namaexternal 
            //                                 when ka.childketujuh is not null and  ka.namaexternal is NULL then  ka.childketujuh
            //                                 when ka.childketujuh is  null and  ka.namaexternal is not NULL then  ka.namaexternal end 
            //                                 as desk,
            //                         --'----------' + ka.kodeexternal + ' || ' + ka.kdchildkeenam as kd,ka.childkeenam + ka.namaexternal as desk,
            //                                 sum(mat.saldoawalblu) as totalblu,sum(mat.saldoawalrm) as totalrm ,mat.tahun as tahun,mat.revisidivake, mat.norec
            //                                 from mataanggaran_t as mat
            //                                 INNER JOIN kelompokanggaranketujuh_m ka on ka.id =mat.objectchildketujuhfk
            //                                 WHERE mat.statusenabled = 1
            //                                 $tahun
            //                                 $kd
            //                                 group by mat.volume, mat.pengali, mat.satuan, mat.hargasatuan, ka.kdchildketujuh,ka.childketujuh,mat.tahun,mat.revisidivake,ka.kodeexternal,ka.namaexternal, mat.norec"));
            // }
        }

        


        foreach ($data as $key => $row) {
            $count[$key] = $row->kd;
        }

//        if ($count[$key] != ''){
        // array_multisort($count, SORT_ASC, $data);
//        }
        $result = array(
            'data' => $data,
            'message' => 'dy',
        );
        return $this->respond($result);
    }
    public function getDetailDaftarMataAnggaranNewdetail(Request $request){
        $dataLogin = $request->all();
        $Pengendali =  ' ';
        $tahun =  ' ';
        $revisiDiva =  ' ';
        $kd = ' ';
        $kd2 = ' ';
        if (isset($request['tahun']) && $request['tahun'] != "" && $request['tahun'] != "undefined") {
            $tahun =  ' and tahun =  ' . $request['tahun'];
        }
        if (isset($request['mataanggaran']) && $request['mataanggaran'] != "" && $request['mataanggaran'] != "undefined") {
            $kd =  ' and namaanggaran =  ' . $request['mataanggaran'];
        }
        if (isset($request['namaanggaran']) && $request['namaanggaran'] != "" && $request['namaanggaran'] != "undefined") {
            $kd2 =  " and namaanggaranfix like '%" . $request['namaanggaran'] . "%'";
        }

    
      
        //tanda
        
            // if ($request['turunan'] == "1"){
                $data = DB::select(DB::raw("select * from v_dataanggaran
                                            WHERE statusenabled = 1
                                            $tahun
                                            $kd2
                                          "));

        
        

        


        foreach ($data as $key => $row) {
            $count[$key] = $row->namaanggaran;
        }

        array_multisort($count, SORT_ASC, $data);
//        }
        $result = array(
            'data' => $data,
            'message' => 'dy',
        );
        return $this->respond($result);
    }
    public function getCekTurunanKetujuh(Request $request)
    {
        $dataLogin = $request->all();

        $idparent6 = "";



        $keenam = \DB::table('mataanggaran_t as mat')
            ->select(DB::raw("COUNT(mat.norec) as jumlah"))
            ->where('mat.statusenabled', true);


        if(isset($request['idturunanke6']) && $request['idturunanke6']!="" && $request['idturunanke6']!="undefined"){
            $keenam = $keenam->where('mat.objectchildkeenamfk',$request['idturunanke6']);
        }
        
        $keenam= $keenam->get();

        $result = array(

            'data' => $keenam,
            'message' => 'dy',
        );

        return $this->respond($result);
    }

    public function getCekTurunanKedelapan(Request $request)
    {
        $dataLogin = $request->all();

        $idparent7 = "";



        $ketujuh = \DB::table('mataanggaran_t as mat')
            ->select(DB::raw("COUNT(mat.norec) as jumlah"))
            ->where('mat.statusenabled', true);


        if(isset($request['idturunanke7']) && $request['idturunanke7']!="" && $request['idturunanke7']!="undefined"){
            $ketujuh = $ketujuh->where('mat.objectchildketujuhfk',$request['idturunanke7']);
        }
        
        $ketujuh= $ketujuh->get();

        $result = array(

            'data' => $ketujuh,
            'message' => 'dy',
        );

        return $this->respond($result);
    }

    public function saveEditDetailMataAnggaran(Request $request)
    {
        DB::beginTransaction();

        try{
            $map = new MataAnggaranPerubahan();
            $map->norec = $map->generateNewId();
            $map->objectmataanggaranfk = $request['norec'];
            $map->kdprofile = 12;
            $map->statusenabled = 1;
            $map->kode = $request['kode'];
            $map->tahun = $request['tahun'];
            $map->pegawaifk = $request['pengedit'];
            $map->tgledit = $request['tgledit'];
            $map->keterangan = $request['keterangan'];
            $map->volumeawal = $request['volumeawal'];
            $map->volumeakhir = $request['volumeakhir'];
            $map->pengaliawal = $request['pengaliawal'];
            $map->pengaliakhir = $request['pengaliakhir'];
            $map->satuanawal = $request['satuanawal'];
            $map->satuanakhir = $request['satuanakhir'];
            $map->hargasatuanawal = $request['hargasatuanawal'];
            $map->hargasatuanakhir = $request['hargasatuanakhir'];
            $map->saldormawal = $request['saldormawal'];
            $map->saldormakhir = $request['saldormakhir'];
            $map->saldobluawal = $request['saldobluawal'];
            $map->saldobluakhir = $request['saldobluakhir'];
            $map->save();

            $ma = MataAnggaran::where('norec', $request['norec'])->update([
                'volume'=>$request['volumeakhir'],
                'pengali'=>$request['pengaliakhir'],
                'satuan'=>$request['satuanakhir'],
                'hargasatuan'=>$request['hargasatuanakhir'],
                'saldoawalrm'=>$request['saldormakhir'],
                'saldoawalblu'=>$request['saldobluakhir']
            ]);

            $transStatus = 'true';
        } catch(Exception $e){
            $transStatus = 'false';
            $transMessage = 'Simpan perubahan mata anggaran';
        }

        if ($transStatus == 'true'){
            $transMessage = 'Simpan perubahan mata anggaran sukses!';
            DB::commit();
            $result = [
                'status'=>201,
                'message'=>$transMessage,
                'as'=>'dy' 
            ];
        } else {
            $transMessage = 'Simpan perubahan mata anggaran gagal!';
            DB::rollback();
            $result = [
                'status'=>400,
                'message'=>$transMessage,
                'as'=>'dy' 
            ];
        }

        return $this->respond($result);
    }
    public function saveEditRealisasi(Request $request)
    {
        DB::beginTransaction();

        try{
             if ($request['no'] == '-'){
                // return($request['norecanggaran']);
                // die();
                $x = Realisasi::where('norecanggaranfk','=', $request['norecanggaran'])
                ->where('statusenabled',true)
                ->get();
                $no = $x->count();
                //  return( $no);
                //  die(); 
                // if (count($no) == 0) {
                //     $no = 1;
                // }else{
                    $no = $no + 1 ;
                // }
                // $RL = new Realisasi();
                // $MA->id = $newId;
                // $RL->kdprofile = 17;
                $RL = new Realisasi();
                $RL->norec = $RL->generateNewId();

                
            }else{
                $RL= Realisasi::where('norec',$request['norec'])
                    ->first();
                $no =  $request['no'];
               
            }
            $RL->statusenabled = true;
            $RL->norecanggaranfk = $request['norecanggaran'];
            $RL->realisasi = $request['realisasi'];;
            $RL->tanggalrealisasi = $request['tanggalrealisasi'];;
            $RL->keterangan = $request['keterangan'];;
            $RL->no = $no;
            $RL->save();

           

            $transStatus = 'true';
        } catch(Exception $e){
            $transStatus = 'false';
            $transMessage = 'Simpan perubahan mata anggaran';
        }

        if ($transStatus == 'true'){
            $transMessage = 'Simpan perubahan mata anggaran sukses!';
            DB::commit();
            $result = [
                'status'=>201,
                'message'=>$transMessage,
                'as'=>'dy' 
            ];
        } else {
            $transMessage = 'Simpan perubahan mata anggaran gagal!';
            DB::rollback();
            $result = [
                'status'=>400,
                'message'=>$transMessage,
                'as'=>'dy' 
            ];
        }

        return $this->respond($result);
    }
    public function getRealisasi(Request $request)
    {
        $map = DB::table('realisasianggaran_t')                
                ->where('norecanggaranfk', $request['norecanggaran'])
                ->orderby('no', 'asc')
                ->get();

        $result = array(
            'data'=>$map,
            'as'=>'dy'
        );

        return $this->respond($result);
    }
      public function deleteRealisasi(Request $request) {
        $dataLogin = $request->all();
        DB::beginTransaction();
        try{
            $transStatus = 'false';
            if ($request['norec'] != ''){
                $data1 = Realisasi::where('norec', $request['norec'])->delete();
                $transStatus = 'true';
            }
        }
        catch(\Exception $e){
            $transStatus= 'false';
        }
        if ($transStatus=='true')
        {    DB::commit();
            $transMessage = "Data Terhapus";
        }
        else{
            DB::rollBack();
            $transMessage = "Data Gagal Dihapus";
        }

        return $this->setStatusCode(201)->respond([], $transMessage);
    }
    public function getRiwayatDetailMataAnggaran(Request $request)
    {
        $map = DB::table('mataanggaranperubahan_t AS map')
                ->join('pegawai_m AS pg', 'pg.id', '=', 'map.pegawaifk')
                ->where('map.kode', $request['kode'])
                ->where('map.tahun', $request['tahun'])
                ->select('map.*', 'pg.namalengkap')
                ->orderby('map.tgledit', 'desc')
                ->get();

        $result = array(
            'data'=>$map,
            'as'=>'dy'
        );

        return $this->respond($result);
    }


    public function saveKegiatanUnit(Request $request) {
        DB::beginTransaction();
        try{
            if ($request['id']==''){
                $newId = KegiatanUnit::max('id');
                $newId = $newId + 1 ;
                $MA = new KegiatanUnit();
                $MA->id = $newId;
                $MA->kdprofile = 12;
                $MA->statusenabled = true;

            }else{
                $MA= KegiatanUnit::where('id',$request['id'])
                    ->first();
            }

            $MA->kodeexternal =  $request['kodeexternal'] != '' ? $request['kodeexternal'] : null;
            $MA->namaexternal =  $request['namaexternal'] != '' ? $request['namaexternal'] : null;
            $MA->objectdepartemenfk =  $request['iddepartemen'] != '' ? $request['iddepartemen'] : null;
            $MA->tahun =  $request['tahun'] != '' ? $request['tahun'] : null;

            $MA->save();

            $transStatus = 'true';
        } catch (Exception $e) {
            $transStatus = 'false';
            $transMessage = "Gagal simpan Kegiatan Unit Kerja".$e;
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Kegiatan Unit Kerja Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $MA,
                'as' => 'ramdanegie',
            );
        } else {
            $transMessage = "Simpan Kegiatan Unit Kerja Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'result' => $MA,
                'as' => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
//        return $this->respond($requestAll);
    }

    public function deleteKegiatanUnit(Request $request) {
        $dataLogin = $request->all();
        DB::beginTransaction();
        try{
            if ($request['id'] != ''){
                $data1 = KegiatanUnit::where('id', $request['id'])->update(['statusenabled'=>false]);
                $transStatus = 'true';
            }else{
                $transStatus = 'false';
            }
        }
        catch(\Exception $e){
            $transStatus= 'false';
        }
        if ($transStatus=='true')
        {    DB::commit();
            $transMessage = "Data Terhapus";
            $statuscode = '201';
        }
        else{
            DB::rollBack();
            $transMessage = "Data Gagal Dihapus";
            $statuscode = '400';
        }

        return $this->setStatusCode($statuscode)->respond([], $transMessage);
    }

    public function getPegawaiDepartemen(Request $request)
    {
        $req = $request->all();
        $dataProduk = \DB::table('maploginusertoruangan_s as m')
            ->JOIN ('ruangan_m as r','r.id','=','m.objectruanganfk')
            ->JOIN ('departemen_m as d','d.id','=','r.objectdepartemenfk')
            ->select('d.id', 'd.namaexternal as nama')
            ->where('d.statusenabled', true)
            ->orderBy('d.namaexternal');
//        if (isset($req['filter']['filters'][0]['value']) &&
//            $req['filter']['filters'][0]['value'] != "" &&
//            $req['filter']['filters'][0]['value'] != "undefined") {
//            $dataProduk = $dataProduk->where('namalengkap', 'like', '%' . $req['filter']['filters'][0]['value'] . '%');
//        };
//        if (isset($req['namalengkap']) &&
//            $req['namalengkap'] != "" &&
//            $req['namalengkap'] != "undefined") {
//            $dataProduk = $dataProduk->where('namalengkap', 'like', '%' . $req['namalengkap'] . '%');
//        };
        if (isset($req['id']) &&
            $req['id'] != "" &&
            $req['id'] != "undefined") {
            $dataProduk = $dataProduk->where('m.objectloginuserfk', $req['id']);
        };
        $dataProduk = $dataProduk->take(10);
        $dataProduk = $dataProduk->get();

        return $this->respond($dataProduk);
    }

    public function getDataKegiatan(Request $request)
    {
        $dataLogin = $request->all();
        $head = \DB::table('kegiatanunit_m as k')
            ->JOIN ('departemen_m as d','d.id','=','k.objectdepartemenfk')
            ->select('k.id','k.kodeexternal','k.namaexternal','k.tahun','d.namaexternal as departemen','d.id as iddepartemen')
            ->where('k.statusenabled', true)
            ->orderBy('k.id','desc')
            ->get();


        $result = array(
            'kegiatanunit' => $head,
            'datalogin' => $dataLogin,
            'message' => 'ramdanegie',
        );

        return $this->respond($result);
    }
}