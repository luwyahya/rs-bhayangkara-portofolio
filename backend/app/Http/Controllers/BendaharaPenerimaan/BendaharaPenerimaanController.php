<?php
/**
 * Created by PhpStorm.
 * User: efan (ea@epic)
 * Date: 13/09/2019
 * Time: 09:12
 */

namespace App\Http\Controllers\BendaharaPenerimaan;


use App\Http\Controllers\ApiController;
use App\Master\Pegawai;
use App\Master\TargetKinerja;
use App\Traits\Valet;
use App\Transaksi\StrukBuktiPenerimaan;
use App\Transaksi\StrukBuktiPenerimaanCaraBayar;
use App\Transaksi\StrukBuktiPengeluaran;
use App\Transaksi\StrukClosing;
use App\Transaksi\StrukClosingKasir;
use App\Transaksi\StrukHistori;
use App\Transaksi\TempBeritaAcaraKasBank;
use App\Transaksi\TempBukuKasUmum;
use App\Transaksi\TempLampiranBeritaAcaraKasBank;
use App\Transaksi\NorecVerifikasiJaspel;
use App\Transaksi\PostingJurnal;
use App\Transaksi\PostingJurnalD;
use App\Transaksi\PostingJurnalTransaksiD;
use App\Transaksi\PostingJurnalTransaksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BendaharaPenerimaanController extends ApiController {

    use Valet;
    public function __construct(){
        parent::__construct($skip_authentication = false);
    }

    public function getDataCombo(Request $request){
        $dataLogin = $request->all();
        $caraSetor = \DB::table('carasetor_m as cs')
            ->select('cs.*')
            ->where('cs.statusenabled', true)
            ->orderBy('cs.id');
        if (isset($request['kdcarasetor']) && $request['kdcarasetor'] != "" && $request['kdcarasetor'] != "undefined") {
            $caraSetor = $caraSetor->where('cs.kdcarasetor', '=', $request['kdcarasetor']);
        }
        if (isset($request['id']) && $request['id'] != "" && $request['id'] != "undefined") {
            $caraSetor = $caraSetor->where('cs.id', '=', $request['id']);
        }
        if (isset($request['carasetor']) && $request['carasetor'] != "" && $request['carasetor'] != "undefined") {
            $caraSetor = $caraSetor->where('cs.carasetor', 'LIKE','%'. $request['carasetor'].'%');
        }
        $caraSetor=$caraSetor->get();

        // $dataKasir= \DB::select(DB::raw("select pg.id,pg.namalengkap from loginuser_s lu
        //         INNER JOIN pegawai_m pg on lu.objectpegawaifk=pg.id
        //         where objectkelompokuserfk=:id and pg.statusenabled=1"),
        //     array(
        //         'id' => 20,
        //     )
        // );

        //sementara dibuat gini
        $dataKasir = \DB::table('loginuser_s as lu')
                ->join('pegawai_m as pg', 'pg.id', '=', 'lu.objectpegawaifk')
                ->select('pg.id', 'pg.namalengkap')
                ->where('lu.objectkelompokuserfk', 20)
                // ->where('pg.statusenabled', 1)
                ->get();

        $kelompokTransaksi= \DB::table('mapbkutokelompoktransaksi_m as mp')
            ->join('bku_m as bku','bku.id','=','mp.idbku')
            ->join('kelompoktransaksi_m as kt','kt.id','=','mp.kelompoktransaksifk')
            ->select('mp.id','mp.kelompoktransaksifk','mp.idbku','bku.bku','kt.kelompoktransaksi')
            ->where('mp.statusenabled',true);
        // if (isset($request['keterangan']) && $request['keterangan'] != "" && $request['keterangan'] != "undefined") {
        //     $kelompokTransaksi = $kelompokTransaksi->where('bku.bku', '=', $request['keterangan']);
        // }
        $kelompokTransaksi=$kelompokTransaksi ->get();

        $mataAnggaran= \DB::table('mataanggaran_t as m')
            ->select('m.mataanggaran','m.norec')
            ->where('m.statusenabled',true)
            ->orderBy('m.mataanggaran')
            ->get();

        $mastreMataAnggaran= \DB::table('mataanggaran_m as m')
            ->select('m.namamataanggaran','m.id')
            ->where('m.statusenabled',true)
            ->orderBy('m.namamataanggaran')
            ->get();

        $caraBayar = \DB::table('carabayar_m')
            ->select('id','carabayar as caraBayar','carabayar as namaExternal')
            ->where('statusenabled',true)
            ->get();

        $listBank = \DB::table('bank_m')
            ->select('id','nama')
            ->where('statusenabled',true)
            ->get();

        $listBankAccount = \DB::table('bankaccount_m')
            ->select('id','reportdisplay as bankAccountNama')
            ->where('statusenabled',true)
            ->get();

        $asalProduk = \DB::table('asalproduk_m')
            ->select('id','asalproduk')
            ->where('statusenabled',true)
            ->get();

        $Ruangan = \DB::table('ruangan_m')
            ->select('id','namaruangan')
            ->where('statusenabled',true)
            ->get();

        $listBankKe = DB::table('mapaccountbank_m as kr')
            ->join('bank_m as ba', 'ba.id', '=', 'kr.objectbankfk')
            ->join('chartofaccount_m as coa','coa.id','=','kr.objectcoafk')
            ->select('kr.id','ba.nama', 'coa.namaaccount','coa.noaccount')
            ->get();

        $result = array(
            'carasetor' => $caraSetor,
            'datalogin' => $dataLogin,
            'datakasir' => $dataKasir,
            'kelompoktransaksi' => $kelompokTransaksi,
            'mataanggaran' => $mataAnggaran,
            'carabayar' => $caraBayar,
            'listbank' => $listBank,
            'listbankaccount' => $listBankAccount,
            'asalproduk'=>$asalProduk,
            'ruangan'=>$Ruangan,
            'mastreMataAnggaran'=>$mastreMataAnggaran,
            'listBankKe'=>$listBankKe,
            'message' => 'inhuman',
        );
        return $this->respond($result);
    }

    public function getDaftarSBM(Request $request){
        $data = \DB::table('strukbuktipenerimaan_t as sbm')
            ->join('strukpelayanan_t as sp', 'sbm.nostrukfk', '=', 'sp.norec')
            ->leftjoin('pasiendaftar_t as pd', 'sp.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftjoin('loginuser_s as lu', 'lu.id', '=', 'sbm.objectpegawaipenerimafk')
            ->leftjoin('pegawai_m as p', 'p.id', '=', 'lu.objectpegawaifk')
            ->leftjoin('pasien_m as ps', 'ps.id', '=', 'sp.nocmfk')
            ->leftjoin('strukbuktipenerimaancarabayar_t as sbmcr', 'sbmcr.nosbmfk', '=', 'sbm.norec')
            ->leftjoin('carabayar_m as cb', 'cb.id', '=', 'sbmcr.objectcarabayarfk')
            ->leftjoin('kelompoktransaksi_m as kt', 'kt.id', '=', 'sbm.objectkelompoktransaksifk')
            ->leftjoin('strukclosing_t as sc', 'sc.norec', '=', 'sbm.noclosingfk')
            ->leftjoin('strukverifikasi_t as sv', 'sv.norec', '=', 'sbm.noverifikasifk')
            ->select('pd.objectkelompokpasienlastfk','sbm.norec as noRec','cb.carabayar as caraBayar','sbmcr.objectcarabayarfk as idCaraBayar','sbm.objectkelompoktransaksifk as idKelTransaksi',
                'kt.kelompoktransaksi as kelTransaksi','sbm.keteranganlainnya as keterangan','p.id as idPegawai','p.namalengkap as namaPenerima',
                'sc.noclosing as noClosing','sbm.nosbm as noSbm','sv.noverifikasi as noVerifikasi','sc.tglclosing as tglClosing',
                'sbm.tglsbm as tglSbm','sv.tglverifikasi as tglVerif','sbm.totaldibayar as totalPenerimaan','pd.noregistrasi','ps.namapasien',
                'sp.norec as norec_sp','ru.id as ruid','ru.namaruangan','sp.namapasien_klien','ps.nocm','sbm.noclosingfk','pd.noregistrasi','sbm.tglverifbendahara')
            ->whereNotIn('sbm.keteranganlainnya',['Pembayaran Deposit Pasien','Pengembalian Deposit Pasien']);
        //->whereNull('pd.nostruklastfk');

        $filter = $request->all();
        if(isset($filter['dateStartTglSbm']) && $filter['dateStartTglSbm'] != "" && $filter['dateStartTglSbm'] != "undefined") {
            $tgl2 = $filter['dateStartTglSbm'] ;//. " 00:00:00";
            $data = $data->where('sbm.tglsbm', '>=', $tgl2);
        }

        if(isset($filter['dateEndTglSbm']) && $filter['dateEndTglSbm'] != "" && $filter['dateEndTglSbm'] != "undefined") {
            $tgl = $filter['dateEndTglSbm'] ;//. " 23:59:59";
            $data = $data->where('sbm.tglsbm', '<=', $tgl);
        }

        if(isset($filter['idPegawai']) && $filter['idPegawai'] != "" && $filter['idPegawai'] != "undefined") {
            $data = $data->where('p.id', '=', $filter['idPegawai']);
        }

        if(isset($filter['idCaraBayar']) && $filter['idCaraBayar'] != "" && $filter['idCaraBayar'] != "undefined") {
            $data = $data->where('cb.id', '=', $filter['idCaraBayar']);
        }

        if(isset($filter['idKelTransaksi']) && $filter['idKelTransaksi'] != "" && $filter['idKelTransaksi'] != "undefined") {
            $data = $data->where('kt.id', $filter['idKelTransaksi']);
        }
        if(isset($filter['ins']) && $filter['ins'] != "" && $filter['ins'] != "undefined") {
            $data = $data->where('ru.objectdepartemenfk', $filter['ins']);
        }
        if(isset($filter['nosbm']) && $filter['nosbm'] != "" && $filter['nosbm'] != "undefined") {
            $data = $data->where('sbm.nosbm','like','%'.$filter['nosbm'].'%');
        }
        if(isset($filter['nocm']) && $filter['nocm'] != "" && $filter['nocm'] != "undefined") {
            $data = $data->where('ps.nocm','like','%'.$filter['nocm'].'%');
        }
        if(isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $data = $data->where('ps.namapasien','like','%'.$filter['nama'].'%');
        }
        if(isset($filter['desk']) && $filter['desk'] != "" && $filter['desk'] != "undefined") {
            $data = $data->where('sp.namapasien_klien','like','%'.$filter['desk'].'%');
        }
        if(isset($filter['KetSetor']) && $filter['KetSetor'] != "" && $filter['KetSetor'] != "undefined") {
            if ($filter['KetSetor'] == 1){
                $data = $data->whereNull('sc.noclosing');
            }elseif ($filter['KetSetor'] == 2){
                $data = $data->whereNotNull('sc.noclosing');
            }
        }
        if(isset($filter['isNotDeposit']) && $filter['isNotDeposit'] != "" && $filter['isNotDeposit'] != "undefined" && $filter['isNotDeposit'] != 'false'){
                $data = $data->where('sbm.keteranganlainnya','<>','Pembayaran Deposit Pasien');
        }
//        $data = $data->whereNull('sbm.noclosingfk');
        $data = $data->get();

        $result=[];
        foreach ($data as $item) {
            $noclosingfk = $item->noclosingfk;
            $caraBayar = $item->caraBayar;
            $details= \DB::select(DB::raw("
                    select
                  --count(x.id) as idCaraBayar,x.caraBayar ,sum (x.jumlah) as jumlah from(
                    distinct sck.noclosingfk,cb.id,
                    cb.carabayar as caraBayar,sh.noclosing,sck.totaldibayar as jumlah,
                    sc.totaldibayar as total,
                    sh.objectpegawaiterimafk, pg.namalengkap as pegawaipenerima
                    from strukclosingkasir_t  as sck
                    left join strukclosing_t as sc on sc.norec=sck.noclosingfk
                    left join carabayar_m as cb on cb.id=sck.carabayarfk
                    left join strukhistori_t as sh on sh.noclosing=sc.noclosing
                    LEFT JOIN carasetor_m as cs on cs.id=sck.objectcarasetorfk
                    left join pegawai_m as pg on pg.id=sh.objectpegawaiterimafk
                    where sck.noclosingfk ='$noclosingfk'
                   -- and sc.objectkelompoktransaksifk=60
                   -- and cb.carabayar ='$caraBayar'
                    GROUP BY cs.carasetor,sck.objectcarasetorfk,cb.id,
                    sck.totaldibayar, sc.totaldibayar,sck.noclosingfk, sh.noclosing,
                    sh.objectpegawaiterimafk, pg.namalengkap,sck.totaldibayar,cb.carabayar
                    --)as x GROUP BY x.caraBayar")
            );

            $result[] = array(
                'noRec' => $item->noRec,
                'caraBayar' => $item->caraBayar,
                'idCaraBayar' => $item->idCaraBayar,
                'idKelTransaksi' => $item->idKelTransaksi,
                'kelTransaksi' => $item->kelTransaksi,
                'keterangan' => $item->keterangan,
                'idPegawai' => $item->idPegawai,
                'namaPenerima' => $item->namaPenerima,
                'noClosing' => $item->noClosing,
                'noSbm' => $item->noSbm,
                'tglSbm' =>$item->tglSbm,
                'noVerifikasi' => $item->noVerifikasi,
                'tglClosing' => $item->tglClosing,
                'norec_sp' => $item->norec_sp,
                'totalPenerimaan' => (float)$item->totalPenerimaan,
                'namapasien' => $item->namapasien,
                'ruid' => $item->ruid,
                'namaruangan' => $item->namaruangan,
                'namapasien_klien' => $item->namapasien_klien,
//                'noclosingfk' => $item->noclosingfk,
                'noregistrasi' => $item->noregistrasi,
                'nocm' => $item->nocm,
                'objectkelompokpasienlastfk' => $item->objectkelompokpasienlastfk,
                'details' => $details,
                'tglverifbendahara' =>$item->tglverifbendahara
            );
        }

        $result = array(
            'data' => $result,
            'message' => 'inhuman',
        );
        return $this->respond($result);
    }
     public function getobjeectkelompokpasienlast(Request $request){
        $noregistrasi = $request['noregistrasi'];
   

        $data = \DB::select(DB::raw("select objectkelompokpasienlastfk from pasiendaftar_t where noregistrasi= $noregistrasi"));
        return $this->respond($data);
    }
    public function simpanSetoranKasirpersbm(Request $request){

        $transMsg =null;
        \DB::beginTransaction();
        try{
            $input  = $request->all();
            $dataPegawaiUser = \DB::select(DB::raw("select pg.id,pg.namalengkap,lu.id as userId from loginuser_s as lu
                    INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id
                    where pg.id=:idLoginUser limit 1"),
                array(
                    'idLoginUser' => $input['kdPegawai'],
                )
            );
            $UserId = 0;
            foreach ($dataPegawaiUser as $items){
                $UserId = $items->userid;
            }
            $dataruangan = \DB::table('maploginusertoruangan_s as mlu')
                ->leftjoin('ruangan_m as ru','ru.id','=','mlu.objectruanganfk')
                ->leftjoin('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
                ->select('ru.id','ru.namaruangan','ru.objectdepartemenfk')
                ->where('objectloginuserfk',$input['userData']['id'])
                ->get();
            if (count($dataruangan)> 0){
                $idRuangan=$dataruangan[0]->id;
            }
//            return $this->respond($UserId);
            $pegawai = Pegawai::find($input['kdPegawai']);
            
            $tglAwal=$input['tglAwal'];
            $tglAkhir=$input['tglAkhir'];

            $SC = new StrukClosing();
            $SC->norec  = $SC->generateNewId();
            $SC->kdprofile = $this->getKdProfile();
            $SC->noclosing = $this->generateCode(new StrukClosing, 'noclosing', 10, 'C-'.$this->getDateTime()->format('ym'));
            $SC->objectpegawaidiclosefk = $input['kdPegawai'];
            $SC->tglclosing = $input['tglsetor'];
            $SC->totaldibayar = $input['totalSetoran'];
            $SC->objectkelompoktransaksifk = 60;
            $SC->keteranganlainnya = "Setoran Kasir";
            $SC->tglawal = $tglAwal;
            $SC->tglakhir = $tglAkhir;
            $SC->tglclosing = $this->getDateTime()->format('Y-m-d H:i:s');
            $SC->save();
            $NorecSc = $SC->norec;

            $SH = new StrukHistori();
            $SH->norec  = $SH->generateNewId();
            $SH->nonhistori = $this->generateCode(new StrukHistori(), 'nonhistori', 14, 'SK-'.$this->getDateTime()->format('ym'));
            //$SH->objectbankaccountfk= $item['kdAccountBank'];
            $SH->kdprofile = 0;
            $SH->statusenabled= true;
            $SH->totalsetortarikdeposit =$input['totalSetoran'];
            $SH->tglsetortarikdeposit =  $input['tglsetor'];;//$this->getDateTime();
            $SH->objectpegawaitarikdepositfk = $input['kdPegawai'];
            $SH->objectpegawaiterimafk = $this->getCurrentUserID();
            $SH->objectkelompoktransaksifk =60;
            $SH->noclosing = $NorecSc;//$SC->noclosing;
            // $SH->objectcarasetorfk = $item['idCaraSetor'];
            $SH->ketlainya ='Setoran Kasir';
            if(isset($idRuangan)){
                $SH->objectruanganterimafk = $idRuangan;
                $SH->objectruanganfk = $idRuangan;
            }

            $SH->nobukti = '-';
            $SH->kdperkiraan = '-';//$input['kdperkiraan'];
            $SH->namaperkiraan = 'Penerimaan Kasir ';//$input['keterangan'];
            $SH->kettransaksi = '-';// $input['keterangantransaksi'];
            $SH->save();

            /** @Save_StrukBuktiPenerimaan */
            $strukBuktiPenerimanan = new StrukBuktiPenerimaan();
            $strukBuktiPenerimanan->norec = $strukBuktiPenerimanan->generateNewId();
            $strukBuktiPenerimanan->kdprofile = $this->getKdProfile();
            $strukBuktiPenerimanan->keteranganlainnya = 'Setoran Kasir';//nama perkiraan
            $strukBuktiPenerimanan->statusenabled = 1;
            $strukBuktiPenerimanan->objectpegawaipenerimafk = $this->getCurrentLoginID();
            $strukBuktiPenerimanan->tglsbm =  $input['tglsetor'];;//date('Y-m-d H:i:s');
            $strukBuktiPenerimanan->totaldibayar =  $input['totalSetoran'];//$input['totalSetoran'];
            $strukBuktiPenerimanan->objectkelompoktransaksifk = 60;
            $strukBuktiPenerimanan->nosbm = $this->generateCode(new StrukBuktiPenerimaan, 'nosbm', 14, 'RV-' . $this->getDateTime()->format('ym'));
            $strukBuktiPenerimanan->noclosingfk = $NorecSc;
            $strukBuktiPenerimanan->save();
        
            foreach ($input['detailSBM'] as $item2){
                    $updateSBM = StrukBuktiPenerimaan::where('norec', $item2['norec_sbm'])//$input['kdPegawaiLu'])
                    ->whereNull('noclosingfk')
                        ->update([
                            'noclosingfk' => $NorecSc
                        ]);
            }

        $transStatus = true;
        } catch(\Exception $e){
            $transStatus= false;
        }

        $transMsg = "";
        if ($transStatus == true) {
            $transMsg = 'Simpan Berhasil';
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMsg,
                "data" => $SC,
                "as" => 'as@epic',
            );
        } else {
            $transMsg = 'Simpan Gagal!!';
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMsg,
                "data" => $SC,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMsg);
    }

    public function simpanVerifKasirpersbm(Request $request){

        $transMsg =null;
        \DB::beginTransaction();
        try{
            $input  = $request->all();
           
            
        
            foreach ($input['detailSBM'] as $item2){
                    $updateSBM = StrukBuktiPenerimaan::where('norec', $item2['norec_sbm'])//$input['kdPegawaiLu'])
                        ->update([
                            'isverifkasir' => true,
                            'objectpegawaiverifkasirfk'=>$input['userData']['id'],
                            'tglverifkasir'=>$input['tglsetor']
                        ]);
            }

        $transStatus = true;
        } catch(\Exception $e){
            $transStatus= false;
        }

        $transMsg = "";
        if ($transStatus == true) {
            $transMsg = 'Simpan Berhasil';
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMsg,
                "as" => 'as@epic',
            );
        } else {
            $transMsg = 'Simpan Gagal!!';
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMsg,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMsg);
    }

    public function simpanSetoranKasir(Request $request){

        $transMsg =null;
        \DB::beginTransaction();
        // try{
            $input  = $request->all();
            $dataPegawaiUser = \DB::select(DB::raw("select pg.id,pg.namalengkap,lu.id as userId from loginuser_s as lu
                    INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id
                    where pg.id=:idLoginUser limit 1"),
                array(
                    'idLoginUser' => $input['kdPegawai'],
                )
            );
            $UserId = 0;
            foreach ($dataPegawaiUser as $items){
                $UserId = $items->userid;
            }
            $dataruangan = \DB::table('maploginusertoruangan_s as mlu')
                ->leftjoin('ruangan_m as ru','ru.id','=','mlu.objectruanganfk')
                ->leftjoin('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
                ->select('ru.id','ru.namaruangan','ru.objectdepartemenfk')
                ->where('objectloginuserfk',$input['userData']['id'])
                ->get();
            if (count($dataruangan)> 0){
                $idRuangan=$dataruangan[0]->id;
            }
//            return $this->respond($UserId);
            $pegawai = Pegawai::find($input['kdPegawai']);
            $tglAwal=$input['tglAwal'];
            $tglAkhir=$input['tglAkhir'];

            $SC = new StrukClosing();
            $SC->norec  = $SC->generateNewId();
            $SC->kdprofile = $this->getKdProfile();
            $SC->noclosing = $this->generateCode(new StrukClosing, 'noclosing', 10, 'C-'.$this->getDateTime()->format('ym'));
            $SC->objectpegawaidiclosefk = $input['kdPegawai'];
            $SC->tglclosing = $input['tglsetor'];
            $SC->totaldibayar = $input['totalSetoran'];
            $SC->objectkelompoktransaksifk = 60;
            $SC->keteranganlainnya = "Setoran Kasir";
            $SC->tglawal = $tglAwal;
            $SC->tglakhir = $tglAkhir;
            $SC->tglclosing = $this->getDateTime()->format('Y-m-d H:i:s');
            $SC->save();
            $NorecSc = $SC->norec;

            $SH = new StrukHistori();
            $SH->norec  = $SH->generateNewId();
            $SH->nonhistori = $this->generateCode(new StrukHistori(), 'nonhistori', 14, 'SK-'.$this->getDateTime()->format('ym'));
            //$SH->objectbankaccountfk= $item['kdAccountBank'];
            $SH->kdprofile = 0;
            $SH->statusenabled= true;
            $SH->totalsetortarikdeposit =$input['totalSetoran'];
            $SH->tglsetortarikdeposit =  $input['tglsetor'];;//$this->getDateTime();
            $SH->objectpegawaitarikdepositfk = $input['kdPegawai'];
            $SH->objectpegawaiterimafk = $this->getCurrentUserID();
            $SH->objectkelompoktransaksifk =60;
            $SH->noclosing = $NorecSc;//$SC->noclosing;
            // $SH->objectcarasetorfk = $item['idCaraSetor'];
            $SH->ketlainya ='Setoran Kasir';
            if(isset($idRuangan)){
                $SH->objectruanganterimafk = $idRuangan;
                $SH->objectruanganfk = $idRuangan;
            }

            $SH->nobukti = '-';
            $SH->kdperkiraan = '-';//$input['kdperkiraan'];
            $SH->namaperkiraan = 'Penerimaan Kasir ';//$input['keterangan'];
            $SH->kettransaksi = '-';// $input['keterangantransaksi'];
            $SH->save();

            /** @Save_StrukBuktiPenerimaan */
            $strukBuktiPenerimanan = new StrukBuktiPenerimaan();
            $strukBuktiPenerimanan->norec = $strukBuktiPenerimanan->generateNewId();
            $strukBuktiPenerimanan->kdprofile = $this->getKdProfile();
            $strukBuktiPenerimanan->keteranganlainnya = 'Setoran Kasir';//nama perkiraan
            $strukBuktiPenerimanan->statusenabled = 1;
            //      $strukBuktiPenerimanan->nostrukfk = $strukPelayanan->norec;
            //      $strukBuktiPenerimanan->objectkelompokpasienfk = $strukPelayanan->pasien_daftar->pasien->objectkelompokpasienfk;
            $strukBuktiPenerimanan->objectpegawaipenerimafk = $this->getCurrentLoginID();
            $strukBuktiPenerimanan->tglsbm =  $input['tglsetor'];//date('Y-m-d H:i:s');
            $strukBuktiPenerimanan->totaldibayar =  $input['totalSetoran'];//$input['totalSetoran'];
            $strukBuktiPenerimanan->objectkelompoktransaksifk = 60;
            $strukBuktiPenerimanan->nosbm = $this->generateCode(new StrukBuktiPenerimaan, 'nosbm', 14, 'RV-' . $this->getDateTime()->format('ym'));
            $strukBuktiPenerimanan->noclosingfk = $NorecSc;
            $strukBuktiPenerimanan->save();
            /** @End_Save_StrukBuktiPenerimaan */

            foreach ($input['detailSetoran'] as $item){
                $SCK = new StrukClosingKasir();
                $SCK->norec  = $SCK->generateNewId();
                $SCK->noclosingfk = $NorecSc; //$SC->norec;
                $SCK->totaldibayar = $item['totalPenerimaan'];
                $SCK->totaldibayarcashin = 0;
                $SCK->totaldibayarcashout = 0;
                $SCK->totaldibayarclose = 0;
                $SCK->carabayarfk = $item['kdCaraBayar'];
                $SCK->qtystrukbuktiextclose = 0;
                $SCK->qtystrukbuktiintclose = 0;
                $SCK->objectcarasetorfk = $item['idCaraSetor'];
                $SCK->save();

                /** @Save_StrukBuktiPenerimaanCaraBayar */
                $SBPCB = new StrukBuktiPenerimaanCaraBayar();
                $SBPCB->norec = $SBPCB->generateNewId();
                $SBPCB->kdprofile = $this->getKdProfile();
                $SBPCB->statusenabled = 1;
                $SBPCB->nosbmfk = $strukBuktiPenerimanan->norec;
                $SBPCB->objectcarabayarfk = $item['kdCaraBayar'];
                if (isset($input['detailBank'])) {
                    $SBPCB->objectbankaccountfk = $input['detailBank']['id'];
                    $SBPCB->namabankprovider = $input['detailBank']['namaBank'];
                    $SBPCB->namapemilik = $input['detailBank']['namaKartu'];
                }
                $SBPCB->save();
                /** @End_Save_SStrukBuktiPenerimaanCaraBayar */
            }
            foreach ($input['detailSBM'] as $item2){
//                if ($item2['keteranganlainnya'] != 'keteranganlainnya'){
                    $updateSBM = StrukBuktiPenerimaan::where('norec', $item2['norec_sbm'])//$input['kdPegawaiLu'])
                    ->whereNull('noclosingfk')
                        ->update([
                            'noclosingfk' => $NorecSc
                        ]);
//                }
            }
//            $data2= StrukBuktiPenerimaan::where('objectpegawaipenerimafk', $UserId)//$input['kdPegawaiLu'])
//                ->whereNull('noclosingfk')
//                ->where('tglsbm','>=', $tglAwal)
//                ->where('tglsbm','<=', $tglAkhir)
//                ->update([
//                        'noclosingfk' => $NorecSc
//                ]);

        $transStatus = true;
        // } catch(\Exception $e){
        //     $transStatus= false;
        // }

        $transMsg = "";
        if ($transStatus == true) {
            $transMsg = 'Simpan Berhasil';
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMsg,
                "data" => $SC,
                "as" => 'as@epic',
            );
        } else {
            $transMsg = 'Simpan Gagal!!';
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMsg,
                "data" => $SC,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMsg);
    }

    public function batalVerifKasir(Request $request){
        $transStatus = true;
        \DB::beginTransaction();
        $input  = $request->all();
        try {
            foreach ($input['details'] as $item){
                $sbm = StrukBuktiPenerimaan::where('norec', $item['norec_sbm'])
                        ->update(
                            [
                                'isverifkasir' => false,
                                'objectpegawaiverifkasirfk'=>$input['userData']['id']
                            ]);

            }
        } catch (\Exception $e) {
                $transStatus = false;
        }
        if ($transStatus == true) {
            $transMsg = 'Batal Setor Sukses';
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMsg,
                "as" => 'as@epic',
            );
        } else {
            $transMsg = 'Gagal!!';
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMsg,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMsg);
    }

    public function batalSetoranKasir(Request $request){
        $transStatus = true;
        \DB::beginTransaction();
        $input  = $request->all();
        /** @Save_OLD */
//        $tglAwal=$input['tglAwal'];
//        $tglAkhir=$input['tglAkhir'];
//
//
//        $sbm= StrukBuktiPenerimaan::where('objectpegawaipenerimafk', $input['kdPegawaiLu'])
//            ->whereNotNull('noclosingfk')
//            ->where('tglsbm','>=', $tglAwal)
//            ->where('tglsbm','<=', $tglAkhir)
//            ->first();
//        $sc= StrukClosing::where('norec',$sbm->noclosingfk)->first();
//        $sh= StrukHistori::where('noclosing',$sc->noclosing)->first();
//        try{
//            $data3= StrukHistori::where('norec', $sh->norec)
//                ->update([
//                    'statusenabled' => 'f'
//                ]);
//        }
//        catch(\Exception $e){
//            $transStatus= false;
//            $transMsg = "Transaksi Gagal (update SBP)";
//        }
//        if($transStatus) {
//            try {
//                $data2 = StrukBuktiPenerimaan::where('objectpegawaipenerimafk', $input['kdPegawaiLu'])
//                    ->whereNotNull('noclosingfk')
//                    ->where('tglsbm', '>=', $tglAwal)
//                    ->where('tglsbm', '<=', $tglAkhir)
//                    ->update(
//                        [
//                            'noclosingfk' => null
//                        ]);
//            } catch (\Exception $e) {
//                $transStatus = false;
//                $transMsg = "Transaksi Gagal (update SBP)";
//            }
//        }
        /** @End_Save_OLD */
        try {
            foreach ($input['details'] as $item){
                $sc = StrukClosing::where('noclosing',$item['noclosing'])->first();
                $sh = StrukHistori::where('noclosing', $sc->norec)
                    ->update([
                        'statusenabled' => false
                    ]);
                $sbm = StrukBuktiPenerimaan::where('norec', $item['norec_sbm'])
                        ->whereNotNull('noclosingfk')
                        ->update(
                            [
                                'noclosingfk' => null
                            ]);

            }
        } catch (\Exception $e) {
                $transStatus = false;
        }
        if ($transStatus == true) {
            $transMsg = 'Batal Setor Sukses';
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMsg,
                "data" => $sh,
                "as" => 'as@epic',
            );
        } else {
            $transMsg = 'Gagal!!';
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMsg,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMsg);
    }
    public function daftarBKU(Request $request){
        $list =  explode ( ',',$this->settingDataFixed('KdTransaksiBendaharaPenerimaan'));
        $kdTrans = [];
        $KdTransak = $this->settingDataFixed('KdTransaksiBendaharaPenerimaan');
        foreach ($list as $itemTrans){
            $kdTrans []=  (int)$itemTrans;
        }
        $dataPenerimaanBank= \DB::table('strukhistori_t as sh')
            ->join('strukclosing_t as sc', 'sc.norec', '=', 'sh.noclosing')
            ->leftjoin ('strukbuktipenerimaan_t as spp',function($join)
            {
                $join->on('spp.noclosingfk','=','sc.norec')
                    ->where('spp.keteranganlainnya', 'like', '%'.'Setoran'.'%');
//                    ->whereIn('spp.keteranganlainnya',['Pembayaran Deposit Pasien','Pengembalian Deposit Pasien']);
//                $join->on('spp.keteranganlainnya','=','Setoran Kasir');
            })
//            ->leftjoin('strukbuktipenerimaan_t as spp', 'spp.noclosingfk', '=','sc.norec')
//                \DB::raw("sc.norec and spp.objectkelompoktransaksifk in (60,64,70,105,106,119,120)"))
            ->leftjoin('strukbuktipengeluaran_t as sbk', 'sbk.noclosingfk', '=', 'sc.norec')
            ->leftjoin('loginuser_s as lu', 'lu.id', '=', 'spp.objectpegawaipenerimafk')
            ->leftjoin('loginuser_s as lu2', 'lu2.id', '=', 'sbk.objectpegawaipembayarfk')
            ->leftjoin('pegawai_m as p', 'p.id', '=', 'lu.objectpegawaifk')
            ->leftjoin('pegawai_m as p2', 'p2.id', '=', 'lu2.objectpegawaifk')
            ->leftjoin('pegawai_m as psetor', 'psetor.id', '=', 'sh.objectpegawaitarikdepositfk')
            ->join('kelompoktransaksi_m as kt', 'kt.id', '=', 'sc.objectkelompoktransaksifk')
            ->join('mapbkutokelompoktransaksi_m as mbk','mbk.kelompoktransaksifk','=','kt.id')
            // ->leftjoin('strukbuktipenerimaancarabayar_t as spc', 'spc.nosbmfk', '=', 'spp.norec')
            // ->leftjoin('bankaccount_m as ba', 'ba.id', '=', 'spc.objectbankaccountfk')
            ->select('spp.norec', 'spp.tglsbm', 'spp.keteranganlainnya','spp.nosbm_intern',
                'spp.objectpegawaipenerimafk','p.namalengkap', 'kt.kelompoktransaksi','spp.nostrukfk',
                'sc.objectkelompoktransaksifk',
                'sc.norec as norec_sc',
                // 'spc.objectbankaccountfk','ba.bankaccountnama','spc.namabankprovider','spc.namapemilik',
                'sc.noclosing','sh.nonhistori','sbk.objectpegawaipembayarfk','p2.namalengkap as pegawaibayar',
                'sh.ketlainya','sh.norec as norec_sh','sh.kdperkiraan','sh.namaperkiraan','sh.kettransaksi','sh.nobukti','psetor.namalengkap as penyetor',
                DB::raw(" coalesce((spp.totaldibayar ), 0) debit ,
                     coalesce((sbk.totaldibayar ), 0) kredit ,
                    case when spp.nosbm is null then sbk.nosbk else spp.nosbm end as notransaksi,
                    cast(sh.tglsetortarikdeposit as date)as tglsetortarikdeposit"))
            ->groupBy('spp.norec','spp.tglsbm','spp.keteranganlainnya','spp.nosbm_intern','spp.objectpegawaipenerimafk','p.namalengkap',
                      'kt.kelompoktransaksi','spp.nostrukfk','sc.objectkelompoktransaksifk','sc.norec','sc.noclosing','sh.nonhistori',
                      'sbk.objectpegawaipembayarfk','p2.namalengkap','sh.ketlainya','sh.norec','sh.kdperkiraan',
                      'sh.namaperkiraan','sh.kettransaksi','sh.nobukti','psetor.namalengkap','spp.totaldibayar','sbk.totaldibayar',
                      'spp.nosbm','sbk.nosbk','sh.tglsetortarikdeposit','sc.tglclosing')
            ->orderBy('sc.tglclosing','asc')
            ->where('sh.statusenabled',true)
            ->whereNotIn('sh.objectkelompoktransaksifk',  [154,156,157,127]);
//            ->whereIn('sh.objectkelompoktransaksifk',[60,64,70,105,106,119,120]);

        $filter = $request->all();
//        if($filter['noStruk']!="" && $filter['noStruk']!="undefined"){
//            $dataPenerimaanBank = $dataPenerimaanBank->where('spp.norec', $filter['noStruk']);
//        }
        if($filter['jenisTransaksi']!="" && $filter['jenisTransaksi']!="undefined"){
            $dataPenerimaanBank = $dataPenerimaanBank->where('sh.objectkelompoktransaksifk', $filter['jenisTransaksi']);
        }
        if($filter['noRekening']!="" && $filter['noRekening']!="undefined"){
            $dataPenerimaanBank = $dataPenerimaanBank->where('spc.namabankprovider', $filter['noRekening']);
        }
        if($filter['tglAwal']!=""){
            $dataPenerimaanBank = $dataPenerimaanBank->where('sh.tglsetortarikdeposit','>=', $filter['tglAwal']." 00:00:00");
        }
        if($filter['tglAkhir']!=""){
            $tgl= $filter['tglAkhir']." 23:59:59";
            $dataPenerimaanBank = $dataPenerimaanBank->where('sh.tglsetortarikdeposit','<=', $tgl);
        }
        if($filter['namaPerkiraan']!="" && $filter['namaPerkiraan']!="undefined"){
            $dataPenerimaanBank = $dataPenerimaanBank->where('sh.namaperkiraan', $filter['namaPerkiraan']);
        }
        if($filter['keterangan']!="" && $filter['keterangan']!="undefined"){
            $dataPenerimaanBank = $dataPenerimaanBank->where('psetor.namalengkap','like','%'. $filter['keterangan'].'%');
        }
        if($filter['nohitori']!="" && $filter['nohitori']!="undefined"){
            $dataPenerimaanBank = $dataPenerimaanBank->where('sh.nohitori', $filter['nohitori']);
        }
//        $dataPenerimaanBank = $dataPenerimaanBank->distinct();
        $dataPenerimaanBank = $dataPenerimaanBank->get();



        /** @Function_ Ambil Saldo Satu Bulan Sebelum */
        $explode =  explode("-", $filter['tglAwal']);
        $arr1 = $explode[0];
        $arr2 = $explode[1];
        if ($arr2 == 1){
            $arr2 = $explode[1];
        }else{
            $arr2 = $explode[1] - 1 ; //bulan kurangi 1
        }
        $arr3 = '01'; //ambil tgl 1
        $arr2 = str_pad($arr2, 2, '0', STR_PAD_LEFT);
//        $arrayExplode = array($arr1,$arr2,$arr3);
//        $tglMinSabulan = implode("-", $arrayExplode);
        $tglMinSabulan = $arr1 . '-' . $arr2 . '-' . $arr3;
        /** @End_Function */

        $tglAwal= $filter['tglAwal'];
        $dataSaldo= DB::select(DB::raw(" select sh.tglsetortarikdeposit,
                     coalesce((spp.totaldibayar ), 0) debit ,
                     coalesce((sbk.totaldibayar ), 0) kredit           
                     from strukhistori_t as sh
                     inner join strukclosing_t as sc on sc.noclosing = sh.noclosing 
                     left join strukbuktipenerimaan_t as spp on spp.noclosingfk = sc.norec
                     left join strukbuktipengeluaran_t as sbk on sbk.noclosingfk = sc.norec
                     inner join kelompoktransaksi_m as kt on kt.id = sc.objectkelompoktransaksifk
                     inner join mapbkutokelompoktransaksi_m as mbk on mbk.kelompoktransaksifk = kt.id
                     where sh.tglsetortarikdeposit > '$tglMinSabulan' and sh.tglsetortarikdeposit < '$tglAwal'
                       and sh.statusenabled=true
                       and sh.objectkelompoktransaksifk in ($KdTransak)
                     order by sh.nonhistori asc"));
        $saldolama=0;
        $jmlSaldoLama=0;
        $saldo=0;
        if (count($dataSaldo) > 0) {
            foreach ($dataSaldo as $dataSaldoLama) {
                if ($dataSaldoLama->debit == 0) {
                    $saldolama = $saldolama + (float)$dataSaldoLama->debit - (float)$dataSaldoLama->kredit;
                } else {
                    $saldolama = $saldolama + (float)$dataSaldoLama->debit;
                }
                $jmlSaldoLama = $saldolama;
            }
            $saldo=$jmlSaldoLama;
        }

        $result = array();
        $jumlahD = 0;
        $jumlahK = 0;
        $saldoAkhir = 0;

        foreach ($dataPenerimaanBank as $dataPenerimaan){
            /** @Function_ Non TUNAI Ambil */
            $norec = $dataPenerimaan->norec_sc;
            $dataPenerimaan->nontunai = 0;
            $SBMC = DB::select(DB::raw("
                 select  spc.noclosingfk,spc.carabayarfk,cb.carabayar,
                 coalesce((spc.totaldibayar ), 0) totaldibayar
                 from strukclosingkasir_t as spc 
                 join carabayar_m as cb on cb.id = spc.carabayarfk
                 where spc.noclosingfk ='$norec'
            "));

            if(count($SBMC) > 0){
                $tunai = 0;
                $nonTunai = 0;
                foreach ($SBMC as $itemSbmc){
                    if($itemSbmc->carabayarfk == "1") {//TUNAI
                        $tunai = $tunai + (float) $itemSbmc->totaldibayar;
                    }else{
                        $nonTunai =$nonTunai +  (float)$itemSbmc->totaldibayar ;
                    }
                }

                $dataPenerimaan->debit = $tunai;
                $dataPenerimaan->nontunai =$nonTunai;
            }
            /** @End_Function */
            if ($dataPenerimaan->debit == 0) {
                $saldo = $saldo + (float)$dataPenerimaan->debit + (float)$dataPenerimaan->nontunai - (float)$dataPenerimaan->kredit;
            } else {
                $saldo = $saldo + (float)$dataPenerimaan->debit + (float)$dataPenerimaan->nontunai;
            }
            $jumlahD = $jumlahD + (float)$dataPenerimaan->debit;
            $jumlahK = $jumlahK +  (float)$dataPenerimaan->kredit;
            $saldoAkhir = $saldo;
//            if ($dataPenerimaan->nostrukfk != null){
//                $status = 'Sudah Di Kompensasi';
//            }else{
//                $status = '-';
//            }
            $result[] = array(
                'norec_sh'  =>$dataPenerimaan->norec_sh,
                'noStruk'  =>$dataPenerimaan->norec,
                'tglStruk'  =>$dataPenerimaan->tglsetortarikdeposit,
                'keterangan'  =>$dataPenerimaan->ketlainya,
                'jenisTransaksi'  =>$dataPenerimaan->kelompoktransaksi,
                'idJenisTransaksi'  =>$dataPenerimaan->objectkelompoktransaksifk,
                'kredit'  =>(float) $dataPenerimaan->kredit,
                'debit'  => (float)$dataPenerimaan->debit,
                'saldo'  => $saldo,
                'nontunai'  => $dataPenerimaan->nontunai,
//                'idPegawai'  =>@$login_user->objectpegawaifk,
//                'namaPegawai' => @$login_user->pegawai->namalengkap,
//                'status' => $status,
//                'idPegawai'  =>@$dataPenerimaan->objectpegawaipenerimafk,
//                'namaPegawai' => @$dataPenerimaan->namalengkap,
//                'nostrukfk' => $dataPenerimaan->nostrukfk,
                // 'objectbankaccountfk' => $dataPenerimaan->objectbankaccountfk,
                // 'bankaccountnama' => $dataPenerimaan->bankaccountnama,
                // 'namabankprovider' => $dataPenerimaan->namabankprovider,
                // 'namapemilik' => $dataPenerimaan->namapemilik,
                'nohistori' => $dataPenerimaan->nonhistori,
//                'noclosing' => $dataPenerimaan->noclosing,
                'notransaksi' => $dataPenerimaan->notransaksi,
//                'kdmataanggaran' =>$dataPenerimaan->kdchildkeempat,
//                'mataanggaran' =>$dataPenerimaan->mataanggaran,
                'nobukti' =>$dataPenerimaan->nobukti,
                'kdperkiraan' =>$dataPenerimaan->kdperkiraan,
                'namaperkiraan' =>$dataPenerimaan->namaperkiraan,
                'kettransaksi' =>$dataPenerimaan->kettransaksi,
                'penyetor'=>$dataPenerimaan->penyetor

            );
        }
        $uhman = array(
            'data' =>  $result,
            'saldolama' =>  $jmlSaldoLama,
            'dataawal' => $dataSaldo,
            'jumlahD' => $jumlahD,
            'jumlahK' => $jumlahK,
            'saldoAkhir' => $saldoAkhir,
            'message' => "@Uhman"
        );
        return $this->respond($uhman);
    }
    public function daftarKelompokTransaksi(Request $request){
        $idSetting= (int)$this->settingDataFixed('seeting jurnal');
        $norec_closing=$request['norec_closing'];
        if($idSetting==1){
            $data10= DB::select(DB::raw("select
                    y.idcarabayar,y.idkeltransaksi,y.total,y.objectcoadebitfk,
                    y.objectcoakreditfk,
                    y.namaaccountdebit,
                    y.namaaccountkredit,
                    y.noaccountdebit,
                    y.noaccountkredit,
                    y.kelompoktransaksi,
                    y.carabayar
                    from
                    (
                    SELECT
                    x.idcarabayar,x.idkeltransaksi,sum(x.totalpenerimaan)as total,mj.objectcoadebitfk,
                    mj.objectcoakreditfk,
                    cf.namaaccount as namaaccountdebit,
                    cf2.namaaccount as namaaccountkredit,
                    cf.noaccount as noaccountdebit,
                    cf2.noaccount as noaccountkredit,
                    x.kelompoktransaksi,
                    x.carabayar
                    FROM
                    mapjurnal_m as mj LEFT JOIN
                    (
                    SELECT
                    sbmcr.objectcarabayarfk AS idcarabayar,
                    sbm.objectkelompoktransaksifk AS idkeltransaksi,
                    sbm.totaldibayar :: NUMERIC AS totalpenerimaan,
                    kt.kelompoktransaksi,
                    cb.carabayar
                    FROM
                    strukbuktipenerimaan_t AS sbm
                    INNER JOIN strukpelayanan_t AS sp ON sbm.nostrukfk = sp.norec
                    LEFT JOIN pasiendaftar_t AS pd ON sp.noregistrasifk = pd.norec
                    LEFT JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                    LEFT JOIN loginuser_s AS lu ON lu.id = sbm.objectpegawaipenerimafk
                    LEFT JOIN pegawai_m AS p ON p.id = lu.objectpegawaifk
                    LEFT JOIN pasien_m AS ps ON ps.id = sp.nocmfk
                    LEFT JOIN strukbuktipenerimaancarabayar_t AS sbmcr ON sbmcr.nosbmfk = sbm.norec
                    LEFT JOIN carabayar_m AS cb ON cb.id = sbmcr.objectcarabayarfk
                    LEFT JOIN kelompoktransaksi_m AS kt ON kt.id = sbm.objectkelompoktransaksifk
                    LEFT JOIN strukclosing_t AS sc ON sc.norec = sbm.noclosingfk
                    LEFT JOIN strukverifikasi_t AS sv ON sv.norec = sbm.noverifikasifk
                    WHERE
                    sbm.objectkelompoktransaksifk NOT IN ( 60 )
                    AND sbm.noclosingfk ='$norec_closing'
                    ) AS x
                    on mj.objectkelompoktransaksifk=x.idkeltransaksi and mj.objectcarabayarfk=x.idcarabayar
                    left join chartofaccount_m as cf on cf.id=mj.objectcoadebitfk
                    left join chartofaccount_m as cf2 on cf2.id=mj.objectcoakreditfk
                    GROUP BY x.idcarabayar,x.idkeltransaksi,mj.objectcoadebitfk,
                    mj.objectcoakreditfk,
                    cf.namaaccount,
                    cf2.namaaccount,
                    cf.noaccount,
                    cf2.noaccount,
                    x.kelompoktransaksi,
                    x.carabayar
                    ) as y where y.idcarabayar is not null"));
            // $data10= DB::select(DB::raw("select sum(x.totalpenerimaan) as total,x.kelompoktransaksi,x.objectcoadebitfk,x.objectcoakreditfk,x.namaaccountdebit,x.namaaccountkredit,x.noaccountdebit,x.noaccountkredit
            //         ,x.nostrukfk from (SELECT
            //         sbm.nostrukfk,
            //         sbm.objectkelompoktransaksifk,
            //         cb.carabayar,
            //         mj.objectcoadebitfk,
            //         mj.objectcoakreditfk,
            //         cf.namaaccount as namaaccountdebit,
            //         cf2.namaaccount as namaaccountkredit,
            //         cf.noaccount as noaccountdebit,
            //         cf2.noaccount as noaccountkredit,
            //         pd.objectkelompokpasienlastfk,
            //         sbm.norec AS noRec,
            //         sbm.noclosingfk,
            //         sbm.totaldibayar::numeric AS totalPenerimaan,
            //         sbm.nosbm,
            //         pd.objectrekananfk,
            //         kt.kelompoktransaksi,
            //         ru.namaruangan,
            //         rk.namarekanan,
            //         sbm.noverifikasiveriffk,
            //         rk2.namarekanan as namarekanan2,
            //         sppd.totalppenjamin
            //         FROM
            //         strukbuktipenerimaan_t AS sbm
            //         LEFT JOIN strukpelayanan_t AS sp ON sbm.nostrukfk = sp.norec
            //         LEFT JOIN strukpelayananpenjamin_t as spp on spp.nostrukfk=sp.norec
            //         LEFT JOIN strukpelayananpenjamindetail_t as sppd on sppd.strukpelayananpenjaminfk=spp.norec
            //         LEFT JOIN pasiendaftar_t AS pd ON sp.noregistrasifk = pd.norec
            //         LEFT JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
            //         LEFT JOIN loginuser_s AS lu ON lu.id = sbm.objectpegawaipenerimafk
            //         LEFT JOIN pegawai_m AS p ON p.id = lu.objectpegawaifk
            //         LEFT JOIN pasien_m AS ps ON ps.id = sp.nocmfk
            //         LEFT JOIN strukbuktipenerimaancarabayar_t AS sbmcr ON sbmcr.nosbmfk = sbm.norec
            //         LEFT JOIN carabayar_m AS cb ON cb.id = sbmcr.objectcarabayarfk
            //         LEFT JOIN kelompoktransaksi_m AS kt ON kt.id = sbm.objectkelompoktransaksifk
            //         LEFT JOIN strukclosing_t AS sc ON sc.norec = sbm.noclosingfk
            //         LEFT JOIN strukverifikasi_t AS sv ON sv.norec = sbm.noverifikasifk
            //         left join rekanan_m as rk on rk.id=sppd.kdrekananpenjamin
            //         left join rekanan_m as rk2 on rk2.id=pd.objectrekananfk
            //         LEFT JOIN mapjurnal_m as mj on mj.objectkelompoktransaksifk=sbm.objectkelompoktransaksifk and mj.objectcarabayarfk=sbmcr.objectcarabayarfk
            //         left join chartofaccount_m as cf on cf.id=mj.objectcoadebitfk
            //         left join chartofaccount_m as cf2 on cf2.id=mj.objectcoakreditfk
            //         WHERE sbm.objectkelompoktransaksifk not in (60) and
            //         sbm.noclosingfk='$norec_closing'
            //         ) as x GROUP BY x.totalpenerimaan,x.kelompoktransaksi,x.objectcoadebitfk,x.objectcoakreditfk,x.namaaccountdebit,x.namaaccountkredit,x.noaccountdebit,x.noaccountkredit,x.nostrukfk"));

            // $data10=[];
            // foreach($detailSetor as $key){
            //     $namarekanan=$key->namarekanan;
            //     $totalPenerimaan=(float)$key->totalppenjamin;
            //     if($key->namarekanan==null){
            //         $namarekanan="UMUM";
            //         if($key->namarekanan2==null){
            //             $namarekanan="UMUM";
            //         }else{
            //             $namarekanan=$key->namarekanan2;
            //             $totalPenerimaan=(float)$key->totalpenerimaan;
            //         }
            //     }
            //     $data10[] = array(
            //             'noRec'=> $key->norec,
            //             'totalPenerimaan'=> (float)$totalPenerimaan,
            //             'nosbm'=> $key->nosbm,
            //             'kelompoktransaksi'=> $key->kelompoktransaksi,
            //             'namarekanan'=> $namarekanan,
            //             'namaruangan'=>$key->namaruangan,
            //             'noverifikasiveriffk'=>$key->noverifikasiveriffk,
            //             'objectcoadebitfk'=>$key->objectcoadebitfk,
            //             'namaaccountdebit'=>$key->namaaccountdebit,
            //             'objectcoakreditfk'=>$key->objectcoakreditfk,
            //             'namaaccountkredit'=>$key->namaaccountkredit,
            //             'noaccountdebit'=>$key->noaccountdebit,
            //             'noaccountkredit'=>$key->noaccountkredit,
            //         );
            // }
        }else if($idSetting==2){
            $detailSetor= DB::select(DB::raw("SELECT
                    dp.id,
                    dp.namadepartemen,
                    case when pp.jasa is null then (pp.hargasatuan * pp.jumlah) else (pp.hargasatuan * pp.jumlah) + pp.jasa end as total,
                    pd.objectkelompokpasienlastfk,
                    sbm.norec AS noRec,
                    sbm.noclosingfk,
                    sbm.totaldibayar :: NUMERIC AS totalPenerimaan,
                    sbm.nosbm,
                    pd.objectrekananfk,
                    kt.kelompoktransaksi,
                    ru.namaruangan,
                    rk.namarekanan,
                    sbm.noverifikasiveriffk,
                    rk2.namarekanan AS namarekanan2,
                    sppd.totalppenjamin 
                FROM
                    strukbuktipenerimaan_t AS sbm
                    INNER JOIN strukpelayanan_t AS sp ON sbm.nostrukfk = sp.norec
                    LEFT JOIN strukpelayananpenjamin_t AS spp ON spp.nostrukfk = sp.norec
                    LEFT JOIN strukpelayananpenjamindetail_t AS sppd ON sppd.strukpelayananpenjaminfk = spp.norec
                    LEFT JOIN pasiendaftar_t AS pd ON sp.noregistrasifk = pd.norec
                    LEFT JOIN loginuser_s AS lu ON lu.ID = sbm.objectpegawaipenerimafk
                    LEFT JOIN pegawai_m AS P ON P.ID = lu.objectpegawaifk
                    LEFT JOIN pasien_m AS ps ON ps.ID = sp.nocmfk
                    LEFT JOIN strukbuktipenerimaancarabayar_t AS sbmcr ON sbmcr.nosbmfk = sbm.norec
                    LEFT JOIN carabayar_m AS cb ON cb.ID = sbmcr.objectcarabayarfk
                    LEFT JOIN kelompoktransaksi_m AS kt ON kt.ID = sbm.objectkelompoktransaksifk
                    LEFT JOIN strukclosing_t AS sc ON sc.norec = sbm.noclosingfk
                    LEFT JOIN strukverifikasi_t AS sv ON sv.norec = sbm.noverifikasifk
                    LEFT JOIN rekanan_m AS rk ON rk.ID = sppd.kdrekananpenjamin
                    LEFT JOIN rekanan_m AS rk2 ON rk2.ID = pd.objectrekananfk 
                    left join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                    LEFT JOIN ruangan_m AS ru ON ru.ID = apd.objectruanganfk
                    LEFT JOIN departemen_m AS dp ON dp.ID = ru.objectdepartemenfk
                    INNER join pelayananpasien_t as pp on pp.noregistrasifk=apd.norec AND
                    pp.strukfk=sp.norec
                WHERE
                    sbm.noclosingfk='$norec_closing'"));

                $data10=[];
                $sama = false;
                foreach($detailSetor as $key){
                    $namarekanan=$key->namarekanan;
                    $totalPenerimaan=(float)$key->totalppenjamin;
                    $sama=false;
                    $i = 0;
                    if($key->namarekanan==null){
                        $namarekanan="UMUM";
                        if($key->namarekanan2==null){
                            $namarekanan="UMUM";
                        }else{
                            $namarekanan=$key->namarekanan2;
                            $totalPenerimaan=(float)$key->total;
                        }
                    }
                    foreach ($data10 as $items) {
                        if ($items['namaruangan'] == $key->namadepartemen && $items['namarekanan'] == $namarekanan) {
                            $sama = true;
                            $data10[$i]['totalPenerimaan']=(float)$items['totalPenerimaan']+(float)$totalPenerimaan;
                            break;
                        }
                        $i = $i + 1;
                    }
                    if ($sama == false) {
                        $data10[] = array(
                                'noRec'=> $key->norec,
                                'totalPenerimaan'=> (float)$totalPenerimaan,
                                'nosbm'=> $key->nosbm,
                                'kelompoktransaksi'=> $key->kelompoktransaksi,
                                'namarekanan'=> $namarekanan,
                                'namaruangan'=>$key->namadepartemen,
                                'noverifikasiveriffk'=>$key->noverifikasiveriffk
                            );
                    }
                }
        }else if($idSetting==3){
            $detailSetor= DB::select(DB::raw("SELECT
                    dp.id,
                    dp.namadepartemen,
                    case when pp.jasa is null then (pp.hargasatuan * pp.jumlah) else (pp.hargasatuan * pp.jumlah) + pp.jasa end as total,
                    pd.objectkelompokpasienlastfk,
                    sbm.norec AS noRec,
                    sbm.noclosingfk,
                    sbm.totaldibayar :: NUMERIC AS totalPenerimaan,
                    sbm.nosbm,
                    pd.objectrekananfk,
                    kt.kelompoktransaksi,
                    ru.namaruangan,
                    rk.namarekanan,
                    sbm.noverifikasiveriffk,
                    rk2.namarekanan AS namarekanan2,
                    sppd.totalppenjamin 
                FROM
                    strukbuktipenerimaan_t AS sbm
                    INNER JOIN strukpelayanan_t AS sp ON sbm.nostrukfk = sp.norec
                    LEFT JOIN strukpelayananpenjamin_t AS spp ON spp.nostrukfk = sp.norec
                    LEFT JOIN strukpelayananpenjamindetail_t AS sppd ON sppd.strukpelayananpenjaminfk = spp.norec
                    LEFT JOIN pasiendaftar_t AS pd ON sp.noregistrasifk = pd.norec
                    LEFT JOIN loginuser_s AS lu ON lu.ID = sbm.objectpegawaipenerimafk
                    LEFT JOIN pegawai_m AS P ON P.ID = lu.objectpegawaifk
                    LEFT JOIN pasien_m AS ps ON ps.ID = sp.nocmfk
                    LEFT JOIN strukbuktipenerimaancarabayar_t AS sbmcr ON sbmcr.nosbmfk = sbm.norec
                    LEFT JOIN carabayar_m AS cb ON cb.ID = sbmcr.objectcarabayarfk
                    LEFT JOIN kelompoktransaksi_m AS kt ON kt.ID = sbm.objectkelompoktransaksifk
                    LEFT JOIN strukclosing_t AS sc ON sc.norec = sbm.noclosingfk
                    LEFT JOIN strukverifikasi_t AS sv ON sv.norec = sbm.noverifikasifk
                    LEFT JOIN rekanan_m AS rk ON rk.ID = sppd.kdrekananpenjamin
                    LEFT JOIN rekanan_m AS rk2 ON rk2.ID = pd.objectrekananfk 
                    left join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                    LEFT JOIN ruangan_m AS ru ON ru.ID = apd.objectruanganfk
                    LEFT JOIN departemen_m AS dp ON dp.ID = ru.objectdepartemenfk
                    INNER join pelayananpasien_t as pp on pp.noregistrasifk=apd.norec AND
                    pp.strukfk=sp.norec
                WHERE
                    sbm.noclosingfk='$norec_closing'"));

                $data10=[];
                $sama = false;
                foreach($detailSetor as $key){
                    $namarekanan=$key->namarekanan;
                    $totalPenerimaan=(float)$key->totalppenjamin;
                    $sama=false;
                    $i = 0;
                    if($key->namarekanan==null){
                        $namarekanan="UMUM";
                        if($key->namarekanan2==null){
                            $namarekanan="UMUM";
                        }else{
                            $namarekanan=$key->namarekanan2;
                            $totalPenerimaan=(float)$key->total;
                        }
                    }
                    foreach ($data10 as $items) {
                        if ($items['nosbm'] == $key->nosbm && $items['namaruangan'] == $key->namaruangan && $items['namarekanan'] == $namarekanan) {
                            $sama = true;
                            $data10[$i]['totalPenerimaan']=(float)$items['totalPenerimaan']+(float)$totalPenerimaan;
                            break;
                        }
                        $i = $i + 1;
                    }
                    if ($sama == false) {
                        $data10[] = array(
                                'noRec'=> $key->norec,
                                'totalPenerimaan'=> (float)$totalPenerimaan,
                                'nosbm'=> $key->nosbm,
                                'kelompoktransaksi'=> $key->kelompoktransaksi,
                                'namarekanan'=> $namarekanan,
                                'namaruangan'=>$key->namaruangan,
                                'noverifikasiveriffk'=>$key->noverifikasiveriffk
                            );
                    }
                }
        }
        
        // $dataIn='';
        // return($detailSetor);
        // die();
        // if($idSetting==1){
        //     foreach ($detailSetor as $value) {
        //         $dataIn = $dataIn .','. $value->objectrekananfk;
        //     }
        //     $dataIn=substr($dataIn,1,strlen($dataIn)-1);
        //     $data =  DB::select(DB::raw(" SELECT mj.id,pd.namaproduk,rk.namarekanan,
        //             dp.namadepartemen,ru.namaruangan,kt.kelompoktransaksi,
        //             cf.namaaccount as namaaccountdebit,cf2.namaaccount as namaaccountkredit,ma.namamataanggaran,
        //             mj.objectkelompoktransaksifk,kt.kelompoktransaksi from mapjurnal_m as mj
        //             left join produk_m as pd on pd.id=mj.objectprodukfk
        //             left join rekanan_m as rk on rk.id=mj.objectpenjaminfk
        //             left join departemen_m as dp on dp.id=mj.objectdepartemenfk
        //             left join ruangan_m as ru on ru.id=mj.objectruanganfk
        //             left join kelompoktransaksi_m as kt on kt.id=mj.objectkelompoktransaksifk
        //             left join chartofaccount_m as cf on cf.id=mj.objectcoadebitfk
        //             left join chartofaccount_m as cf2 on cf2.id=mj.objectcoadebitfk
        //             left join mataanggaran_m as ma on ma.id=mj.objectmataanggaranfk
        //             where mj.objectkelompoktransaksifk is not null and mj.objectpenjaminfk in ($dataIn)
        //     "));
        // }
        // return($data);
        // die();

        // $data =  DB::select(DB::raw(" SELECT mj.id,pd.namaproduk,rk.namarekanan,
        //         dp.namadepartemen,ru.namaruangan,kt.kelompoktransaksi,
        //         cf.namaaccount as namaaccountdebit,cf2.namaaccount as namaaccountkredit,ma.namamataanggaran,
        //         mj.objectkelompoktransaksifk from mapjurnal_m as mj
        //         left join produk_m as pd on pd.id=mj.objectprodukfk
        //         left join rekanan_m as rk on rk.id=mj.objectpenjaminfk
        //         left join departemen_m as dp on dp.id=mj.objectdepartemenfk
        //         left join ruangan_m as ru on ru.id=mj.objectruanganfk
        //         left join kelompoktransaksi_m as kt on kt.id=mj.objectkelompoktransaksifk
        //         left join chartofaccount_m as cf on cf.id=mj.objectcoadebitfk
        //         left join chartofaccount_m as cf2 on cf2.id=mj.objectcoadebitfk
        //         left join mataanggaran_m as ma on ma.id=mj.objectmataanggaranfk
        //         where mj.objectkelompoktransaksifk is not null
        // "));
         $result = array(
            'data' => $data10,
            'message' => 'tukangkomputer',
        );
        return $this->respond($result);
    }
    public function daftarKelompokTransaksiPengeluaran(Request $request){
        $idSetting= (int)$this->settingDataFixed('seeting jurnal');
        $norec_closing=$request['norec_closing'];
        if($idSetting==1){
            $data10= DB::select(DB::raw("select
                    y.idcarabayar,y.idkeltransaksi,y.total,y.objectcoadebitfk,
                    y.objectcoakreditfk,
                    y.namaaccountdebit,
                    y.namaaccountkredit,
                    y.noaccountdebit,
                    y.noaccountkredit,
                    y.kelompoktransaksi,
                    y.carabayar
                    from
                    (
                    SELECT
                    x.idcarabayar,x.idkeltransaksi,sum(x.totalpenerimaan)as total,mj.objectcoadebitfk,
                    mj.objectcoakreditfk,
                    cf.namaaccount as namaaccountdebit,
                    cf2.namaaccount as namaaccountkredit,
                    cf.noaccount as noaccountdebit,
                    cf2.noaccount as noaccountkredit,
                    x.kelompoktransaksi,
                    x.carabayar
                    FROM
                    mapjurnal_m as mj LEFT JOIN
                    (
                    SELECT
                    sbmcr.carabayarfk AS idcarabayar,
                    sbm.objectkelompoktransaksifk AS idkeltransaksi,
                    sbm.totaldibayar :: NUMERIC AS totalpenerimaan,
                    kt.kelompoktransaksi,
                    cb.carabayar
                    FROM
                    strukbuktipengeluaran_t AS sbm
                    INNER JOIN strukpelayanan_t AS sp ON sbm.nostrukfk = sp.norec
                    LEFT JOIN pasiendaftar_t AS pd ON sp.noregistrasifk = pd.norec
                    LEFT JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                    LEFT JOIN loginuser_s AS lu ON lu.id = sbm.objectpegawaipenerimafk
                    LEFT JOIN pegawai_m AS p ON p.id = lu.objectpegawaifk
                    LEFT JOIN pasien_m AS ps ON ps.id = sp.nocmfk
                    LEFT JOIN strukbuktipengeluarancarabayar_t AS sbmcr ON sbmcr.nosbmfk = sbm.norec
                    LEFT JOIN carabayar_m AS cb ON cb.id = sbmcr.carabayarfk
                    LEFT JOIN kelompoktransaksi_m AS kt ON kt.id = sbm.objectkelompoktransaksifk
                    LEFT JOIN strukclosing_t AS sc ON sc.norec = sbm.noclosingfk
                    LEFT JOIN strukverifikasi_t AS sv ON sv.norec = sbm.noverifikasifk
                    WHERE
                    sbm.objectkelompoktransaksifk NOT IN ( 60 )
                    AND sbm.noclosingfk ='$norec_closing'
                    ) AS x
                    on mj.objectkelompoktransaksifk=x.idkeltransaksi and mj.objectcarabayarfk=x.idcarabayar
                    left join chartofaccount_m as cf on cf.id=mj.objectcoadebitfk
                    left join chartofaccount_m as cf2 on cf2.id=mj.objectcoakreditfk
                    GROUP BY x.idcarabayar,x.idkeltransaksi,mj.objectcoadebitfk,
                    mj.objectcoakreditfk,
                    cf.namaaccount,
                    cf2.namaaccount,
                    cf.noaccount,
                    cf2.noaccount,
                    x.kelompoktransaksi,
                    x.carabayar
                    ) as y where y.idcarabayar is not null"));
            
        }
        
        
         $result = array(
            'data' => $data10,
            'message' => 'tukangkomputer',
        );
        return $this->respond($result);
    }
    public function daftarSetoranKasir(Request $request){
        $list =  explode ( ',',$this->settingDataFixed('KdTransaksiBendaharaPenerimaan'));
        $kdTrans = [];
        $KdTransak = $this->settingDataFixed('KdTransaksiBendaharaPenerimaan');
        foreach ($list as $itemTrans){
            $kdTrans []=  (int)$itemTrans;
        }
        $dataPenerimaanBank= \DB::table('strukhistori_t as sh')
            ->join('strukclosing_t as sc', 'sc.norec', '=', 'sh.noclosing')
            ->leftjoin ('strukbuktipenerimaan_t as spp',function($join)
            {
                $join->on('spp.noclosingfk','=','sc.norec')
                    ->where('spp.keteranganlainnya', 'like', '%'.'Setoran'.'%');
            })
            ->leftjoin('strukbuktipengeluaran_t as sbk', 'sbk.noclosingfk', '=', 'sc.norec')
            ->leftjoin('loginuser_s as lu', 'lu.id', '=', 'spp.objectpegawaipenerimafk')
            ->leftjoin('loginuser_s as lu2', 'lu2.id', '=', 'sbk.objectpegawaipembayarfk')
            ->leftjoin('pegawai_m as p', 'p.id', '=', 'lu.objectpegawaifk')
            ->leftjoin('pegawai_m as p2', 'p2.id', '=', 'lu2.objectpegawaifk')
            ->leftjoin('pegawai_m as psetor', 'psetor.id', '=', 'sh.objectpegawaitarikdepositfk')
            ->leftjoin('kelompoktransaksi_m as kt', 'kt.id', '=', 'sc.objectkelompoktransaksifk')
            ->leftjoin('mapbkutokelompoktransaksi_m as mbk','mbk.kelompoktransaksifk','=','kt.id')
            ->select('spp.tgltransferkerekbank','spp.norec', 'spp.tglsbm', 'spp.keteranganlainnya','spp.nosbm_intern',
                'spp.objectpegawaipenerimafk','p.namalengkap', 'kt.kelompoktransaksi','spp.nostrukfk',
                'sc.objectkelompoktransaksifk',
                'sc.norec as norec_sc',
                'sc.noclosing','sh.nonhistori','sbk.objectpegawaipembayarfk','p2.namalengkap as pegawaibayar',
                'sh.ketlainya','sh.norec as norec_sh','sh.kdperkiraan','sh.namaperkiraan','sh.kettransaksi','sh.nobukti','psetor.namalengkap as penyetor',
                'spp.noverifikasiveriffk',
                DB::raw(" coalesce((spp.totaldibayar ), 0) debit ,
                     coalesce((sbk.totaldibayar ), 0) kredit ,
                    case when spp.nosbm is null then sbk.nosbk else spp.nosbm end as notransaksi,
                    cast(sh.tglsetortarikdeposit as date)as tglsetortarikdeposit,
                    case when spp.noverifikasiveriffk is not null then 'Unverif' else 'Verifikasi' end as status"))
            ->groupBy('spp.norec','spp.tglsbm','spp.keteranganlainnya','spp.nosbm_intern','spp.objectpegawaipenerimafk','p.namalengkap',
                      'kt.kelompoktransaksi','spp.nostrukfk','sc.objectkelompoktransaksifk','sc.norec','sc.noclosing','sh.nonhistori',
                      'sbk.objectpegawaipembayarfk','p2.namalengkap','sh.ketlainya','sh.norec','sh.kdperkiraan',
                      'sh.namaperkiraan','sh.kettransaksi','sh.nobukti','psetor.namalengkap','spp.totaldibayar','sbk.totaldibayar',
                      'spp.nosbm','sbk.nosbk','sh.tglsetortarikdeposit','sc.tglclosing','spp.noverifikasiveriffk')
            ->orderBy('sc.tglclosing','asc')
            ->where('sh.statusenabled',true);
            // ->whereNotIn('sh.objectkelompoktransaksifk',  [154,156,157,127]);

        $filter = $request->all();
        if($filter['jenisTransaksi']!="" && $filter['jenisTransaksi']!="undefined"){
            $dataPenerimaanBank = $dataPenerimaanBank->where('sh.objectkelompoktransaksifk', $filter['jenisTransaksi']);
        }
        if($filter['noRekening']!="" && $filter['noRekening']!="undefined"){
            $dataPenerimaanBank = $dataPenerimaanBank->where('spc.namabankprovider', $filter['noRekening']);
        }
        if($filter['tglAwal']!=""){
            $dataPenerimaanBank = $dataPenerimaanBank->where('sh.tglsetortarikdeposit','>=', $filter['tglAwal']." 00:00:00");
        }
        if($filter['tglAkhir']!=""){
            $tgl= $filter['tglAkhir']." 23:59:59";
            $dataPenerimaanBank = $dataPenerimaanBank->where('sh.tglsetortarikdeposit','<=', $tgl);
        }
        if($filter['namaPerkiraan']!="" && $filter['namaPerkiraan']!="undefined"){
            $dataPenerimaanBank = $dataPenerimaanBank->where('sh.namaperkiraan', $filter['namaPerkiraan']);
        }
        if($filter['keterangan']!="" && $filter['keterangan']!="undefined"){
            $dataPenerimaanBank = $dataPenerimaanBank->where('psetor.namalengkap','like','%'. $filter['keterangan'].'%');
        }
        if($filter['nohitori']!="" && $filter['nohitori']!="undefined"){
            $dataPenerimaanBank = $dataPenerimaanBank->where('sh.nohitori', $filter['nohitori']);
        }

        $dataPenerimaanBank = $dataPenerimaanBank->get();



        /** @Function_ Ambil Saldo Satu Bulan Sebelum */
        $explode =  explode("-", $filter['tglAwal']);
        $arr1 = $explode[0];
        $arr2 = $explode[1];
        if ($arr2 == 1){
            $arr2 = $explode[1];
        }else{
            $arr2 = $explode[1] - 1 ; //bulan kurangi 1
        }
        $arr3 = '01'; //ambil tgl 1
        $arr2 = str_pad($arr2, 2, '0', STR_PAD_LEFT);
//        $arrayExplode = array($arr1,$arr2,$arr3);
//        $tglMinSabulan = implode("-", $arrayExplode);
        $tglMinSabulan = $arr1 . '-' . $arr2 . '-' . $arr3;
        /** @End_Function */

        $tglAwal= $filter['tglAwal'];
        $dataSaldo= DB::select(DB::raw(" select sh.tglsetortarikdeposit,
                     coalesce((spp.totaldibayar ), 0) debit ,
                     coalesce((sbk.totaldibayar ), 0) kredit           
                     from strukhistori_t as sh
                     inner join strukclosing_t as sc on sc.noclosing = sh.noclosing 
                     left join strukbuktipenerimaan_t as spp on spp.noclosingfk = sc.norec
                     left join strukbuktipengeluaran_t as sbk on sbk.noclosingfk = sc.norec
                     inner join kelompoktransaksi_m as kt on kt.id = sc.objectkelompoktransaksifk
                     inner join mapbkutokelompoktransaksi_m as mbk on mbk.kelompoktransaksifk = kt.id
                     where sh.tglsetortarikdeposit > '$tglMinSabulan' and sh.tglsetortarikdeposit < '$tglAwal'
                       and sh.statusenabled=true
                       and sh.objectkelompoktransaksifk in ($KdTransak)
                     order by sh.nonhistori asc"));
        $saldolama=0;
        $jmlSaldoLama=0;
        $saldo=0;
        if (count($dataSaldo) > 0) {
            foreach ($dataSaldo as $dataSaldoLama) {
                if ($dataSaldoLama->debit == 0) {
                    $saldolama = $saldolama + (float)$dataSaldoLama->debit - (float)$dataSaldoLama->kredit;
                } else {
                    $saldolama = $saldolama + (float)$dataSaldoLama->debit;
                }
                $jmlSaldoLama = $saldolama;
            }
            $saldo=$jmlSaldoLama;
        }

        $result = array();
        $jumlahD = 0;
        $jumlahK = 0;
        $saldoAkhir = 0;

        foreach ($dataPenerimaanBank as $dataPenerimaan){
            /** @Function_ Non TUNAI Ambil */
            $norec = $dataPenerimaan->norec_sc;
            $dataPenerimaan->nontunai = 0;
            $SBMC = DB::select(DB::raw("
                 select  spc.noclosingfk,spc.carabayarfk,cb.carabayar,
                 coalesce((spc.totaldibayar ), 0) totaldibayar
                 from strukclosingkasir_t as spc 
                 join carabayar_m as cb on cb.id = spc.carabayarfk
                 where spc.noclosingfk ='$norec'
            "));

            if(count($SBMC) > 0){
                $tunai = 0;
                $nonTunai = 0;
                foreach ($SBMC as $itemSbmc){
                    if($itemSbmc->carabayarfk == "1") {//TUNAI
                        $tunai = $tunai + (float) $itemSbmc->totaldibayar;
                    }else{
                        $nonTunai =$nonTunai +  (float)$itemSbmc->totaldibayar ;
                    }
                }

                $dataPenerimaan->debit = $tunai;
                $dataPenerimaan->nontunai =$nonTunai;
            }
            /** @End_Function */
            if ($dataPenerimaan->debit == 0) {
                $saldo = $saldo + (float)$dataPenerimaan->debit + (float)$dataPenerimaan->nontunai - (float)$dataPenerimaan->kredit;
            } else {
                $saldo = $saldo + (float)$dataPenerimaan->debit + (float)$dataPenerimaan->nontunai;
            }
            $jumlahD = $jumlahD + (float)$dataPenerimaan->debit;
            $jumlahK = $jumlahK +  (float)$dataPenerimaan->kredit;
            $saldoAkhir = $saldo;
//            if ($dataPenerimaan->nostrukfk != null){
//                $status = 'Sudah Di Kompensasi';
//            }else{
//                $status = '-';
//            }
            $result[] = array(
                'norec_sh'  =>$dataPenerimaan->norec_sh,
                'noStruk'  =>$dataPenerimaan->norec,
                'tglStruk'  =>$dataPenerimaan->tglsetortarikdeposit,
                'keterangan'  =>$dataPenerimaan->ketlainya,
                'jenisTransaksi'  =>$dataPenerimaan->kelompoktransaksi,
                'idJenisTransaksi'  =>$dataPenerimaan->objectkelompoktransaksifk,
                'kredit'  =>(float) $dataPenerimaan->kredit,
                'debit'  => (float)$dataPenerimaan->debit,
                'saldo'  => $saldo,
                'nontunai'  => $dataPenerimaan->nontunai,
//                'idPegawai'  =>@$login_user->objectpegawaifk,
//                'namaPegawai' => @$login_user->pegawai->namalengkap,
//                'status' => $status,
//                'idPegawai'  =>@$dataPenerimaan->objectpegawaipenerimafk,
//                'namaPegawai' => @$dataPenerimaan->namalengkap,
//                'nostrukfk' => $dataPenerimaan->nostrukfk,
                // 'objectbankaccountfk' => $dataPenerimaan->objectbankaccountfk,
                // 'bankaccountnama' => $dataPenerimaan->bankaccountnama,
                // 'namabankprovider' => $dataPenerimaan->namabankprovider,
                // 'namapemilik' => $dataPenerimaan->namapemilik,
                'nohistori' => $dataPenerimaan->nonhistori,
               'norec_closing' => $dataPenerimaan->norec_sc,
                'notransaksi' => $dataPenerimaan->notransaksi,
//                'kdmataanggaran' =>$dataPenerimaan->kdchildkeempat,
//                'mataanggaran' =>$dataPenerimaan->mataanggaran,
                'nobukti' =>$dataPenerimaan->nobukti,
                'kdperkiraan' =>$dataPenerimaan->kdperkiraan,
                'namaperkiraan' =>$dataPenerimaan->namaperkiraan,
                'kettransaksi' =>$dataPenerimaan->kettransaksi,
                'penyetor'=>$dataPenerimaan->penyetor,
                'tgltransferkerekbank' =>$dataPenerimaan->tgltransferkerekbank,
                'noverifikasiveriffk' => $dataPenerimaan->noverifikasiveriffk,
                'status' => $dataPenerimaan->status
            );
        }
        $uhman = array(
            'data' =>  $result,
            'saldolama' =>  $jmlSaldoLama,
            'dataawal' => $dataSaldo,
            'jumlahD' => $jumlahD,
            'jumlahK' => $jumlahK,
            'saldoAkhir' => $saldoAkhir,
            'message' => "@Uhman"
        );
        return $this->respond($uhman);
    }

    public function simpanBKU(Request $request){
        \DB::beginTransaction();
        $input = $request->all();
        $nohistori = '';
        $idRuangan=0;
        $transStatus=true;
//        try{

            $dataruangan = \DB::table('maploginusertoruangan_s as mlu')
                ->leftjoin('ruangan_m as ru','ru.id','=','mlu.objectruanganfk')
                ->leftjoin('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
                ->select('ru.id','ru.namaruangan','ru.objectdepartemenfk')
                ->where('objectloginuserfk',$input['userData']['id'])
                ->get();
            if (count($dataruangan) == 0){
                $idRuangan= 0;
            }else{
                $idRuangan= $dataruangan[0]->id;//471
            }

            $SC = new StrukClosing();
            $SC->norec  = $SC->generateNewId();
            $SC->kdprofile = $this->getKdProfile();
            $SC->noclosing = $this->generateCode(new StrukClosing, 'noclosing', 10, 'C-'.$this->getDateTime()->format('ym'));
            $SC->objectpegawaidiclosefk = $this->getCurrentUserID();
            $SC->totaldibayar = $input['totalSetor'];
            $SC->objectkelompoktransaksifk = $input['jenisTransaksi'];

            if ($input['penerimaan'] == true) {
                $SC->keteranganlainnya = "PENERIMAAN BKU";
            }else{
                $SC->keteranganlainnya = "PENGELUARAN BKU";
            }
            $SC->tglawal = $this->getDateTime()->format('Y-m-d H:i:s');
            $SC->tglakhir = $this->getDateTime()->format('Y-m-d H:i:s');
            $SC->tglclosing = $this->getDateTime()->format('Y-m-d H:i:s');;//$input['tglbku'];
            $SC->save();
            $norec_sc= $SC->norec;
            $noclosing_SC = $SC->noclosing;

            $SH = new StrukHistori();
            $SH->norec  = $SH->generateNewId();
            $nohistori = $this->generateCode(new StrukHistori(), 'nonhistori', 14, 'BKU-'.$this->getDateTime()->format('ym'));
            $SH->nonhistori = $nohistori;
            $SH->kdprofile = 0;
            $SH->statusenabled= true;
            $SH->totalsetortarikdeposit =  $input['totalSetor'];
            $SH->tglsetortarikdeposit = $input['tglbku'];// $this->getDateTime();
            $SH->objectpegawaitarikdepositfk =  $this->getCurrentUserID();
            $SH->objectpegawaiterimafk = $this->getCurrentUserID();
            $SH->objectruanganterimafk = $idRuangan;
            $SH->objectruanganfk = $idRuangan;
            $SH->objectkelompoktransaksifk =$input['jenisTransaksi'];
            $SH->noclosing = $norec_sc;//$SC->noclosing;
            $SH->ketlainya = $input['keterangan'];
            $SH->nobukti = $input['nobukti'];
            $SH->kdperkiraan = $input['kdperkiraan'];
            $SH->namaperkiraan =$input['keterangan'];
            $SH->kettransaksi = $input['keterangantransaksi'];
            $SH->objectasalprodukhasilfk = $input['sumberdana'];
            $SH->save();

            if ($input['penerimaan'] == true) {
                $strukBuktiPenerimanan = new StrukBuktiPenerimaan();
                $strukBuktiPenerimanan->norec = $strukBuktiPenerimanan->generateNewId();
                $strukBuktiPenerimanan->kdprofile = $this->getKdProfile();
                $strukBuktiPenerimanan->keteranganlainnya = 'Setoran';//$input['keterangan'];
                $strukBuktiPenerimanan->statusenabled = 1;
                $strukBuktiPenerimanan->objectpegawaipenerimafk = $this->getCurrentLoginID();
                $strukBuktiPenerimanan->tglsbm = $input['tglbku'];//$this->getDateTime();
                $strukBuktiPenerimanan->totaldibayar = $input['totalSetor'];
                $strukBuktiPenerimanan->objectkelompoktransaksifk = $input['jenisTransaksi'];
                $strukBuktiPenerimanan->nosbm = $this->generateCode(new StrukBuktiPenerimaan, 'nosbm', 14, 'RV-' . $this->getDateTime()->format('ym'));
                $strukBuktiPenerimanan->noclosingfk = $norec_sc;//$SC->norec;
                $strukBuktiPenerimanan->asalprodukfk = $input['sumberdana'];
                $strukBuktiPenerimanan->save();

                $SBPCB = new StrukBuktiPenerimaanCaraBayar();
                $SBPCB->norec = $SBPCB->generateNewId();
                $SBPCB->kdprofile = $this->getKdProfile();
                $SBPCB->statusenabled = 1;
                $SBPCB->nosbmfk = $strukBuktiPenerimanan->norec;
                $SBPCB->objectcarabayarfk = $input['caraBayar'];
                if ($input['detailBank'] != 'KOSONG') {
                    $SBPCB->objectbankaccountfk = $input['detailBank']['id'];
                    $SBPCB->namabankprovider = $input['detailBank']['namaBank'];
                    $SBPCB->namapemilik = $input['detailBank']['namaKartu'];
                }
                $SBPCB->save();

            }else{

                $SBK = new StrukBuktiPengeluaran();
                $SBK->norec = $SBK->generateNewId();
                $SBK->kdprofile = $this->getKdProfile();
                $SBK->keteranganlainnya = $input['keterangan'];
                $SBK->statusenabled = 1;
                $SBK->objectpegawaipembayarfk = $this->getCurrentLoginID();
                $SBK->tglsbk = $input['tglbku'];// $this->getDateTime();
                $SBK->totaldibayar = $input['totalSetor'];
                $SBK->objectkelompoktransaksifk = $input['jenisTransaksi'];
                $SBK->nosbk = $this->generateCode(new StrukBuktiPengeluaran(), 'nosbk', 14, 'PV-' . $this->getDateTime()->format('ym'));
                $SBK->noclosingfk = $SC->norec;
                $SBK->asalprodukfk = $input['sumberdana'];
                $SBK->save();

            }
            $transStatus = true;
//        }
//        catch(\Exception $e){
//            $transStatus = false;
//            $this->transMessage = "Simpan Pembayaran Bank Gagal";
//        }
        if($transStatus){

            $transMessage = "Simpan Sukses";
            $result = array(
                "status" => 201,
                "message"  => $transMessage,
                "nohistori" => $nohistori,
                "as" => 'uhman',
            );
            DB::commit();
        }else{
            $transMessage = "Simpan Gagal";
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
//                "nohistori" => $nohistori,
                "as" => 'uhman',
            );
            DB::rollBack();
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveTempBukuKasUmum(Request $request){
        \DB::beginTransaction();
        try {
            $idbukukasumum = $this->generateCode(new TempBukuKasUmum(),
                'idbukukasumum',14,'IB-'.$this->getDateTime()->format('ym'));
            foreach ($request['tempbku']['data'] as $item) {
                $newBKU = new TempBukuKasUmum();
                $newBKU->norec = $newBKU->generateNewId();;
                $newBKU->nostrukhistorifk = $item['norec_sh'];
                $newBKU->kelompoktransaksifk = $item['idJenisTransaksi'];
                $newBKU->pegawaifk = $item['idPegawai'];
                $newBKU->kdperkiraan = $item['kdperkiraan'];
                $newBKU->namaperkiraan = $item['namaperkiraan'];
                $newBKU->kettransaksi = $item['kettransaksi'];
                $newBKU->namapenerima = $item['namaPegawai'];
//                $newBKU->namabankprovider = $item['namabankprovider'];
//                $newBKU->namapemilikrekening = $item['namapemilik'];
                $newBKU->nobukti = $item['nobukti'];
                $newBKU->nohistori = $item['nohistori'];
                $newBKU->nosbm = $item['notransaksi'];
//                $newBKU->objectbankaccountfk = $item['objectbankaccountfk'];
                $newBKU->debit = $item['debit'];
                $newBKU->kredit = $item['kredit'];
                $newBKU->saldo = $item['saldo'];
                $newBKU->tglpenerimaan = $item['tglStruk'];
                $newBKU->idbukukasumum = $idbukukasumum;
                $newBKU->saldoawal = $request['saldoawal'];
                $newBKU->saldoakhir = $request['saldoakhir'];
                $newBKU->save();
            }
            $transStatus = 'true';
            $transMessage = "Simpan Temp Buku Kas Umum";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Gagal Simpan Temp Buku Kas Umum";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "data" => $newBKU,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "data" => $newBKU,
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function saveBeritaAcara(Request $request){
        \DB::beginTransaction();
        try {
            $id = $this->generateCode(new TempBeritaAcaraKasBank(),
                'idtempberita',14,'KB-'.$this->getDateTime()->format('ym'));
            foreach ($request['tempdata'] as $item) {
                $newBKU = new TempBeritaAcaraKasBank();
                $newBKU->norec = $newBKU->generateNewId();;
                $newBKU->jenis = $item['jenis'];
                $newBKU->penerimaan = $item['penerimaan'];
                $newBKU->pengeluaran = $item['pengeluaran'];
                $newBKU->jumlah = $item['jumlah'];
                $newBKU->saldoawal = $item['saldoawal'];
                $newBKU->saldoakhir = $item['saldoakhir'];
                $newBKU->idtempberita = $id;
                $newBKU->save();
            }
            $transStatus = 'true';
            $transMessage = "Simpan";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Gagal";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "data" => $newBKU,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "data" => $newBKU,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result);
    }

    public function getTrialBalanceBendahara(Request $request) {
        $req=$request->all();
        $aingMacan = \DB::select(DB::raw("select coa.id,coa.noaccount,coa.namaaccount,sum(pjd.hargasatuand) as debet,
                sum(pjd.hargasatuank) as kredit
                from chartofaccount_m as coa
                left JOIN postingjurnald_t as pjd on coa.id=pjd.objectaccountfk
                left JOIN postingjurnal_t as pj on pjd.norecrelated=pj.norec
                where tglbuktitransaksi between :tglAwal and :tglAkhir and coa.statusenabled=true
                and pjd.objectaccountfk in (1760,1754) 
                group by coa.id,coa.noaccount,coa.namaaccount
                order by coa.noaccount;
            "),
            array(
                'tglAwal' => $request['tglAwal'] ,
                'tglAkhir' => $request['tglAkhir'] ,
            )
        );
        $mydate = $request['tglAwal'];
        $daystosum = '1';

        $datesum = date('d-m-Y', strtotime($mydate.' - '.$daystosum.' months'));
        $data = date('Ym', strtotime($datesum));
        $strData = (string)$data;

        $dataCoa = DB::select(DB::raw("
                select coa.id,coa.noaccount,coa.namaaccount,psa.ym,
                case when psa.hargasatuand is null then 0 else psa.hargasatuand end as debet,
                case when psa.hargasatuank is null then 0 else psa.hargasatuank end as kredit
                from chartofaccount_m as coa
                left JOIN (select * from postingsaldoawal_t where statusenabled=1 and ym = '$strData') as psa  on psa.objectaccountfk=coa.id
                where  coa.namaexternal='2018-03-01' and coa.statusenabled=true
                  and coa.id in (1760,1754) 
            ")
        );
        $sama=false;
        foreach ($dataCoa as $coa){
            $sama=false;
            if ($coa->ym == (string)$data) {
                $debetAwal = $coa->debet;
                $kreditAwal = $coa->kredit;
            }else{
                $debetAwal = 0;
                $kreditAwal = 0;
            }


            foreach ($aingMacan as $item) {
                $sama = false;
                if ($item->id == $coa->id) {
                    $debetMutasi = $item->debet;
                    $kreditMutasi = $item->kredit;
                    $result[] = array(
                        'idaccount' => $coa->id,
                        'noaccount' => $item->noaccount,
                        'namaaccount' => $item->namaaccount,
                        'debetAwal' => $debetAwal,
                        'kreditAwal' => $kreditAwal,
                        'debetMutasi' => $debetMutasi,
                        'kreditMutasi' => $kreditMutasi,
                    );
                    $sama = true;
                    break;
                }
            }
            if ($sama == false) {
                $result[] = array(
                    'idaccount' => $coa->id,
                    'noaccount' => $coa->noaccount,
                    'namaaccount' => $coa->namaaccount,
                    'debetAwal' => $debetAwal,
                    'kreditAwal' => $kreditAwal,
                    'debetMutasi' => 0,
                    'kreditMutasi' => 0,
                    'by' => 'as@epic'
                );
            }

        }

        return $this->respond($result);
    }

    public function saveTempLampiranBA(Request $request)
    {
        \DB::beginTransaction();
        try {
            $id = $this->generateCode(new TempLampiranBeritaAcaraKasBank(),
                'idtemplampiran',14,'KB-'.$this->getDateTime()->format('ym'));

            $item =$request['tempdata'] ;
            $newBKU = new TempLampiranBeritaAcaraKasBank();
            $newBKU->norec = $newBKU->generateNewId();;
            $newBKU->idtemplampiran = $id;
            $newBKU->pecahan100k = $item['pecahan100k'];
            $newBKU->pecahan50k = $item['pecahan50k'];
            $newBKU->pecahan20k = $item['pecahan20k'];
            $newBKU->pecahan10k = $item['pecahan10k'];
            $newBKU->pecahan5k = $item['pecahan5k'];
            $newBKU->pecahan2k = $item['pecahan2k'];
            $newBKU->pecahan1k = $item['pecahan1k'];
            $newBKU->pecahan500 = $item['pecahan500'];
            $newBKU->pecahan200 = $item['pecahan200'];
            $newBKU->pecahan100 = $item['pecahan100'];
            $newBKU->bribank = $item['bribank'];
            $newBKU->depositobank = $item['depositobank'];
            $newBKU->terbilangbank = $item['terbilangbank'];
            $newBKU->save();

            $transStatus = 'true';
            $transMessage = "Simpan";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Gagal";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "data" => $newBKU,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "data" => $newBKU,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result);
    }

    public function hapusBKU(Request $request) {

        \DB::beginTransaction();
        try{

            if($request['norec_struk_histori'] != '') {
                $sH = StrukHistori::where('norec', $request['norec_struk_histori'])->first();

                $strukClosing = StrukClosing::where('norec',$sH->noclosing)->first();
                $sbm = StrukBuktiPenerimaan::where('noclosingfk',$strukClosing['norec'])
                    ->where('keteranganlainnya','<>','Setoran Kasir')
                    ->where('statusenabled',true)
                    ->update([ 'noclosingfk' => null ]);
                $disableSH = StrukHistori::where('norec', $request['norec_struk_histori'])->update([
//                        'statusenabled' => false,
                          'statusenabled' => 0,
                    ]
                );

            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "update status enabled";
        }

        if ($transStatus == 'true') {
            $transMessage = "Hapus Berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'inhuman',
            );
        } else {
            $transMessage = "Hapus Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function verifikasiSetoran(Request $request) {

        \DB::beginTransaction();
        try{
            $input  = $request->all();
            if($request['norec_closing'] != '') {
                $getNorec = new StrukBuktiPenerimaan();
                $newGetNorec = $getNorec->generateNewId();
                $sbm = StrukBuktiPenerimaan::where('noclosingfk',$request['norec_closing'])
                    // ->where('keteranganlainnya','<>','Setoran Kasir')
                    ->where('statusenabled',true)
                    ->update([ 
                                'isverifbendahara' => true,
                                'objectpegawaiverifbendaharafk'=>$input['userData']['id'],
                                'tglverifbendahara'=>$request['tglsetor'],
                                'tgltransferkerekbank'=>$request['tgltransferkerekbank'],
                                'nobuktiverif'=>$request['noBukti'],
                                'keteranganverif'=>$request['ketTransaksi'],
                                'noverifikasiveriffk'=>$newGetNorec ]);
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Gagal";
        }

        if ($transStatus == 'true') {
            $transMessage = "Verifikasi Berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'inhuman',
            );
        } else {
            $transMessage = "Verifikasi Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function unverifikasiSetoran(Request $request) {

        \DB::beginTransaction();
        try{
            $input  = $request->all();
            if($request['norec_closing'] != '') {
                $norec_closing=$request['norec_closing'];
                $data = DB::select(DB::raw("
                            select pjt.nojurnal_intern from postingjurnaltransaksi_t as pjt
                            INNER JOIN postingjurnal_t as pj on pj.norecrelated=pjt.nojurnal_intern 
                            where pjt.nobuktitransaksi='$norec_closing'
                        ")
                );
                if(!empty($data)){
                    $transStatus = 'false';
                    $transMessage = "Unverifikasi Gagal, Data Sudah Diposting.. Sialhkan Hubungi Akuntansi..";
                    DB::rollBack();
                    $result = array(
                        'status' => 400,
                        'message'  => $transMessage,
                        'as' => 'inhuman',
                    );
                    return $this->setStatusCode($result['status'])->respond($result, $transMessage);
                }else{
                    $norec_head = DB::select("
                        select norec from postingjurnaltransaksi_t where nobuktitransaksi='$norec_closing'
                    ");
                    foreach ($norec_head as $item) {
                        $HapusPPD = PostingJurnalTransaksiD::where('norecrelated','=',$item->norec)->delete();
                    }
                    $HapusPPD2 = PostingJurnalTransaksi::where('nobuktitransaksi','=',$norec_closing)->delete();
                    $sbm = StrukBuktiPenerimaan::where('noclosingfk',$norec_closing)
                    ->where('statusenabled',true)
                    ->update([ 
                                'isverifbendahara' => false,
                                'objectpegawaiverifbendaharafk'=>$input['userData']['id'],
                                'tglverifbendahara'=>null,
                                'tgltransferkerekbank'=>null,
                                'nobuktiverif'=>null,
                                'keteranganverif'=>null,
                                'noverifikasiveriffk'=>null ]);
                }
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Gagal";
        }

        if ($transStatus == 'true') {
            $transMessage = "Unverifikasi Berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'as' => 'inhuman',
            );
        } else {
            $transMessage = "Verifikasi Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getTargetKinerja (Request $request) {
        $data = \DB::select(DB::raw("
  SELECT * FROM targetkinerja_m
  WHERE statusenabled = 1
            "));


        $result = array(
            'data'  => $data,
            'as' => 'alphazora@epic',
        );
        return $this->respond($result);
    }

    public function saveTargetKinerja(Request $request){
        DB::beginTransaction();
        try{
            if($request['id'] == ''){
                $newId = TargetKinerja::max('id') + 1;
                $newMod = new TargetKinerja();
                $newMod->id = $newId;
            }else{
                $newMod = TargetKinerja::where('id',$request['id'])->first();
            }
            if($request['statusenabled'] == 'true' ){
                $newMod->statusenabled = $request['statusenabled'];
                $newMod->pelayanan = $request['pelayanan'];
                $newMod->targetvolume = $request['targetvolume'];
                $newMod->targetrupiah = $request['targetrupiah'];
                $newMod->tahun = $request['tahun'];
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
                'as' => 'alphazora@epic',
            );
        } else {
            $transMessage = "Data Gagal Disimpan";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'as' => 'alphazora@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }

    public function saveMonitoringKlaim(Request $request){
        DB::beginTransaction();
        // try{
            ini_set('max_execution_time', 500); //6 minuts
            $a = $request['push'];
            foreach ($a as $key ) {
                DB::table('monitoringdataklaim_t')
                ->where('biayanosep',$key['noSEP'])
                ->whereNull('tglnofpk')
                ->delete();
                $TGLNOFPK = null;
                if($key['status']=="Klaim"){
                    $data = \DB::table('monitoringdataklaim_t')
                    ->where('biayanosep',$key['noSEP'])
                    ->whereNotNull('tglnofpk')
                    ->get();
                    $a = 0;
                    foreach ($data as $lop) {
                        $a = $a+1;
                    }
                    // return($a);
                    // die();
                    if($a == 0){
                        $TGLNOFPK = date('Y-m-d');
                        DB::table('monitoringdataklaim_t')->insert(
                            array('biayanosep' => $key['noSEP'],
                            'inacbgkode' => $key['Inacbg']['kode'],
                            'inacbgnama' => $key['Inacbg']['nama'],
                            'biayabypengajuan' => $key['biaya']['byPengajuan'],
                            'biayabysetujui' => $key['biaya']['bySetujui'],
                            'biayabytarifgruper' => $key['biaya']['byTarifGruper'],
                            'biayabytarifrs' => $key['biaya']['byTarifRS'],
                            'biayabytopup' => $key['biaya']['byTopup'],
                            'biayakelasrawat' => $key['kelasRawat'],
                            'biayanofpk' => $key['noFPK'],
                            'pesertanama' => $key['peserta']['nama'],
                            'pesertanokartu' => $key['peserta']['noKartu'],
                            'pesertanomr' => $key['peserta']['noMR'],
                            'pesertapoli' => $key['poli'],
                            'pesertastatus' => $key['status'],
                            'pesertatglpulang' => $key['tglPulang'],
                            'pesertatglsep' => $key['tglSep'],
                            'jenispelayanan' => $request['jnspelayanan'],
                            'tglnofpk' => $TGLNOFPK,
                            )
                        );
                    }
                }else{
                    DB::table('monitoringdataklaim_t')->insert(
                        array('biayanosep' => $key['noSEP'],
                        'inacbgkode' => $key['Inacbg']['kode'],
                        'inacbgnama' => $key['Inacbg']['nama'],
                        'biayabypengajuan' => $key['biaya']['byPengajuan'],
                        'biayabysetujui' => $key['biaya']['bySetujui'],
                        'biayabytarifgruper' => $key['biaya']['byTarifGruper'],
                        'biayabytarifrs' => $key['biaya']['byTarifRS'],
                        'biayabytopup' => $key['biaya']['byTopup'],
                        'biayakelasrawat' => $key['kelasRawat'],
                        'biayanofpk' => $key['noFPK'],
                        'pesertanama' => $key['peserta']['nama'],
                        'pesertanokartu' => $key['peserta']['noKartu'],
                        'pesertanomr' => $key['peserta']['noMR'],
                        'pesertapoli' => $key['poli'],
                        'pesertastatus' => $key['status'],
                        'pesertatglpulang' => $key['tglPulang'],
                        'pesertatglsep' => $key['tglSep'],
                        'jenispelayanan' => $request['jnspelayanan'],
                        )
                    );
                }
            }
            
            
            $transStatus = 'true';
        // } catch (\Exception $e) {
        //     $transStatus = 'false';
        // }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'as' => 'snaps',
            );
        } else {
            $transMessage = "Data Gagal Disimpan";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'as' => 'snaps',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }

    public function saveVerifikasiJaspel(Request $request){
        DB::beginTransaction();
        // try{
            ini_set('max_execution_time', 500); //6 minuts
            $a = $request['push'];
            $TGLNOFPK = date('Y-m-d  H:i:s');
            $PelPasien = new NorecVerifikasiJaspel();
            $PelPasien->norec = $PelPasien->generateNewId();
            foreach ($a as $key ) {
                    $x = new NorecVerifikasiJaspel();
                    $x->norec = $x->generateNewId();
                    DB::table('monitoringdataklaimjaspel_t')->where('BIAYANOSEP',$key['BIAYANOSEP'])->whereNull('objectverifikasifk')->update(
                        array('objectpegawaifk' => $request['objectpegawaifk'],
                        'tglverifikasi' => $TGLNOFPK,
                        'objectverifikasifk' => $x->norec,
                        'objectheadverifikasifk' => $PelPasien->norec
                        )
                    );
                    DB::table('pasiendaftar_t')->where('noregistrasi',$key['noregistrasi'])->whereNull('objectverifikasimonitoringfk')->update(
                        array(
                        'objectverifikasimonitoringfk' => $x->norec,
                        )
                    );
            }
            
            
            $transStatus = 'true';
        // } catch (\Exception $e) {
        //     $transStatus = 'false';
        // }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'as' => 'snaps',
            );
        } else {
            $transMessage = "Data Gagal Disimpan";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'as' => 'snaps',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }
    public function saveMonitoringKlaimJaspel(Request $request){
        DB::beginTransaction();
        // try{
            ini_set('max_execution_time', 500); //6 minuts
            $a = $request['push'];
            foreach ($a as $key ) {
                DB::table('monitoringdataklaimjaspel_t')
                ->where('BIAYANOSEP',$key['noSEP'])
                ->whereNull('TGLNOFPK')
                ->delete();
                $TGLNOFPK = null;
                if($key['status']=="Klaim"){
                    $data = \DB::table('monitoringdataklaimjaspel_t')
                    ->where('BIAYANOSEP',$key['noSEP'])
                    ->whereNotNull('TGLNOFPK')
                    ->get();
                    $a = 0;
                    foreach ($data as $lop) {
                        $a = $a+1;
                    }
                    // return($a);
                    // die();
                    if($a == 0){
                        $TGLNOFPK = date('Y-m-d');
                        DB::table('monitoringdataklaimjaspel_t')->insert(
                            array('BIAYANOSEP' => $key['noSEP'],
                            'INACBGKODE' => $key['Inacbg']['kode'],
                            'INACBGNAMA' => $key['Inacbg']['nama'],
                            'BIAYABYPENGAJUAN' => $key['biaya']['byPengajuan'],
                            'BIAYABYSETUJUI' => $key['biaya']['bySetujui'],
                            'BIAYABYTARIFGRUPER' => $key['biaya']['byTarifGruper'],
                            'BIAYABYTARIFRS' => $key['biaya']['byTarifRS'],
                            'BIAYABYTOPUP' => $key['biaya']['byTopup'],
                            'BIAYAKELASRAWAT' => $key['kelasRawat'],
                            'BIAYANOFPK' => $key['noFPK'],
                            'PESERTANAMA' => $key['peserta']['nama'],
                            'PESERTANOKARTU' => $key['peserta']['noKartu'],
                            'PESERTANOMR' => $key['peserta']['noMR'],
                            'PESERTAPOLI' => $key['poli'],
                            'PESERTASTATUS' => $key['status'],
                            'PESERTATGLPULANG' => $key['tglPulang'],
                            'PESERTATGLSEP' => $key['tglSep'],
                            'JENISPELAYANAN' => $request['jnspelayanan'],
                            'TGLNOFPK' => $TGLNOFPK,
                            )
                        );
                    }
                }else{
                    DB::table('monitoringdataklaimjaspel_t')->insert(
                        array('BIAYANOSEP' => $key['noSEP'],
                        'INACBGKODE' => $key['Inacbg']['kode'],
                        'INACBGNAMA' => $key['Inacbg']['nama'],
                        'BIAYABYPENGAJUAN' => $key['biaya']['byPengajuan'],
                        'BIAYABYSETUJUI' => $key['biaya']['bySetujui'],
                        'BIAYABYTARIFGRUPER' => $key['biaya']['byTarifGruper'],
                        'BIAYABYTARIFRS' => $key['biaya']['byTarifRS'],
                        'BIAYABYTOPUP' => $key['biaya']['byTopup'],
                        'BIAYAKELASRAWAT' => $key['kelasRawat'],
                        'BIAYANOFPK' => $key['noFPK'],
                        'PESERTANAMA' => $key['peserta']['nama'],
                        'PESERTANOKARTU' => $key['peserta']['noKartu'],
                        'PESERTANOMR' => $key['peserta']['noMR'],
                        'PESERTAPOLI' => $key['poli'],
                        'PESERTASTATUS' => $key['status'],
                        'PESERTATGLPULANG' => $key['tglPulang'],
                        'PESERTATGLSEP' => $key['tglSep'],
                        'JENISPELAYANAN' => $request['jnspelayanan'],
                        )
                    );
                }
            }
            
            
            $transStatus = 'true';
        // } catch (\Exception $e) {
        //     $transStatus = 'false';
        // }

        if ($transStatus == 'true') {
            $transMessage = "Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'as' => 'snaps',
            );
        } else {
            $transMessage = "Data Gagal Disimpan";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'as' => 'snaps',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);

    }

    public function getDaftarSBMDeposit(Request $request){
        $data = \DB::table('strukbuktipenerimaan_t as sbm')
            ->join('strukpelayanan_t as sp', 'sbm.nostrukfk', '=', 'sp.norec')
            ->leftjoin('pasiendaftar_t as pd', 'sp.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftjoin('loginuser_s as lu', 'lu.id', '=', 'sbm.objectpegawaipenerimafk')
            ->leftjoin('pegawai_m as p', 'p.id', '=', 'lu.objectpegawaifk')
            ->leftjoin('pasien_m as ps', 'ps.id', '=', 'sp.nocmfk')
            ->leftjoin('strukbuktipenerimaancarabayar_t as sbmcr', 'sbmcr.nosbmfk', '=', 'sbm.norec')
            ->leftjoin('carabayar_m as cb', 'cb.id', '=', 'sbmcr.objectcarabayarfk')
            ->leftjoin('kelompoktransaksi_m as kt', 'kt.id', '=', 'sbm.objectkelompoktransaksifk')
            ->leftjoin('strukclosing_t as sc', 'sc.norec', '=', 'sbm.noclosingfk')
            ->leftjoin('strukverifikasi_t as sv', 'sv.norec', '=', 'sbm.noverifikasifk')
            ->select('sbm.norec as noRec','cb.carabayar as caraBayar','sbmcr.objectcarabayarfk as idCaraBayar','sbm.objectkelompoktransaksifk as idKelTransaksi',
                'kt.kelompoktransaksi as kelTransaksi','sbm.keteranganlainnya as keterangan','p.id as idPegawai','p.namalengkap as namaPenerima',
                'sc.noclosing as noClosing','sbm.nosbm as noSbm','sv.noverifikasi as noVerifikasi','sc.tglclosing as tglClosing',
                'sbm.tglsbm as tglSbm','sv.tglverifikasi as tglVerif','sbm.totaldibayar as totalPenerimaan','pd.noregistrasi','ps.namapasien',
                'sp.norec as norec_sp','ru.id as ruid','ru.namaruangan','sp.namapasien_klien','ps.nocm','sbm.noclosingfk')
            ->whereIn('sbm.keteranganlainnya',['Pembayaran Deposit Pasien','Pengembalian Deposit Pasien']);
        //->whereNull('pd.nostruklastfk');

        $filter = $request->all();
        if(isset($filter['dateStartTglSbm']) && $filter['dateStartTglSbm'] != "" && $filter['dateStartTglSbm'] != "undefined") {
            $tgl2 = $filter['dateStartTglSbm'] ;//. " 00:00:00";
            $data = $data->where('pd.tglpulang', '>=', $tgl2);
        }

        if(isset($filter['dateEndTglSbm']) && $filter['dateEndTglSbm'] != "" && $filter['dateEndTglSbm'] != "undefined") {
            $tgl = $filter['dateEndTglSbm'] ;//. " 23:59:59";
            $data = $data->where('pd.tglpulang', '<=', $tgl);
        }

        if(isset($filter['idPegawai']) && $filter['idPegawai'] != "" && $filter['idPegawai'] != "undefined") {
            $data = $data->where('p.id', '=', $filter['idPegawai']);
        }

        if(isset($filter['idCaraBayar']) && $filter['idCaraBayar'] != "" && $filter['idCaraBayar'] != "undefined") {
            $data = $data->where('cb.id', '=', $filter['idCaraBayar']);
        }

        if(isset($filter['idKelTransaksi']) && $filter['idKelTransaksi'] != "" && $filter['idKelTransaksi'] != "undefined") {
            $data = $data->where('kt.id', $filter['idKelTransaksi']);
        }
        if(isset($filter['ins']) && $filter['ins'] != "" && $filter['ins'] != "undefined") {
            $data = $data->where('ru.objectdepartemenfk', $filter['ins']);
        }
        if(isset($filter['nosbm']) && $filter['nosbm'] != "" && $filter['nosbm'] != "undefined") {
            $data = $data->where('sbm.nosbm','like','%'.$filter['nosbm'].'%');
        }
        if(isset($filter['nocm']) && $filter['nocm'] != "" && $filter['nocm'] != "undefined") {
            $data = $data->where('ps.nocm','like','%'.$filter['nocm'].'%');
        }
        if(isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $data = $data->where('ps.namapasien','like','%'.$filter['nama'].'%');
        }
        if(isset($filter['desk']) && $filter['desk'] != "" && $filter['desk'] != "undefined") {
            $data = $data->where('sp.namapasien_klien','like','%'.$filter['desk'].'%');
        }
        if(isset($filter['KetSetor']) && $filter['KetSetor'] != "" && $filter['KetSetor'] != "undefined") {
            if ($filter['KetSetor'] == 1){
                $data = $data->whereNull('sc.noclosing');
            }elseif ($filter['KetSetor'] == 2){
                $data = $data->whereNotNull('sc.noclosing');
            }
        }
        if(isset($filter['isNotDeposit']) && $filter['isNotDeposit'] != "" && $filter['isNotDeposit'] != "undefined" && $filter['isNotDeposit'] != 'false'){
            $data = $data->where('sbm.keteranganlainnya','<>','Pembayaran Deposit Pasien');
        }
//        $data = $data->whereNull('sbm.noclosingfk');
        $data = $data->get();

        $result=[];
        foreach ($data as $item) {
            $noclosingfk = $item->noclosingfk;
            $caraBayar = $item->caraBayar;
            $details= \DB::select(DB::raw("
                    select
                  --count(x.id) as idCaraBayar,x.caraBayar ,sum (x.jumlah) as jumlah from(
                    distinct sck.noclosingfk,cb.id,
                    cb.carabayar as caraBayar,sh.noclosing,sck.totaldibayar as jumlah,
                    sc.totaldibayar as total,
                    sh.objectpegawaiterimafk, pg.namalengkap as pegawaipenerima
                    from strukclosingkasir_t  as sck
                    left join strukclosing_t as sc on sc.norec=sck.noclosingfk
                    left join carabayar_m as cb on cb.id=sck.carabayarfk
                    left join strukhistori_t as sh on sh.noclosing=sc.noclosing
                    LEFT JOIN carasetor_m as cs on cs.id=sck.objectcarasetorfk
                    left join pegawai_m as pg on pg.id=sh.objectpegawaiterimafk
                    where sck.noclosingfk ='$noclosingfk'
                   -- and sc.objectkelompoktransaksifk=60
                   -- and cb.carabayar ='$caraBayar'
                    GROUP BY cs.carasetor,sck.objectcarasetorfk,cb.id,
                    sck.totaldibayar, sc.totaldibayar,sck.noclosingfk, sh.noclosing,
                    sh.objectpegawaiterimafk, pg.namalengkap,sck.totaldibayar,cb.carabayar
                    --)as x GROUP BY x.caraBayar")
            );

            $result[] = array(
                'noRec' => $item->noRec,
                'caraBayar' => $item->caraBayar,
                'idCaraBayar' => $item->idCaraBayar,
                'idKelTransaksi' => $item->idKelTransaksi,
                'kelTransaksi' => $item->kelTransaksi,
                'keterangan' => $item->keterangan,
                'idPegawai' => $item->idPegawai,
                'namaPenerima' => $item->namaPenerima,
                'noClosing' => $item->noClosing,
                'noSbm' => $item->noSbm,
                'tglSbm' =>$item->tglSbm,
                'noVerifikasi' => $item->noVerifikasi,
                'tglClosing' => $item->tglClosing,
                'norec_sp' => $item->norec_sp,
                'totalPenerimaan' => $item->totalPenerimaan,
                'namapasien' => $item->namapasien,
                'ruid' => $item->ruid,
                'namaruangan' => $item->namaruangan,
                'namapasien_klien' => $item->namapasien_klien,
//                'noclosingfk' => $item->noclosingfk,
                'nocm' => $item->nocm,
                'details' => $details,
            );
        }

        $result = array(
            'data' => $result,
            'message' => 'inhuman',
        );
        return $this->respond($result);
    }

    public function simpanSetoranKasirDeposit(Request $request){
        $transMsg =null;
        $KelTrans= (int)$this->settingDataFixed('KdSetoranDeposit');
        \DB::beginTransaction();
        //try{
        $input  = $request->all();
        $dataPegawaiUser = \DB::select(DB::raw("select top 1 pg.id,pg.namalengkap,lu.id as userId from loginuser_s as lu
                    INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id
                    where pg.id=:idLoginUser"),
            array(
                'idLoginUser' => $input['kdPegawai'],
            )
        );
        $UserId = 0;
        foreach ($dataPegawaiUser as $items){
            $UserId = $items->userId;
        }
        $dataruangan = \DB::table('maploginusertoruangan_s as mlu')
            ->leftjoin('ruangan_m as ru','ru.id','=','mlu.objectruanganfk')
            ->leftjoin('departemen_m as dp','dp.id','=','ru.objectdepartemenfk')
            ->select('ru.id','ru.namaruangan','ru.objectdepartemenfk')
            ->where('objectloginuserfk',$input['userData']['id'])
            ->get();
        if (count($dataruangan)> 0){
            $idRuangan=$dataruangan[0]->id;
        }
//            return $this->respond($UserId);
        $pegawai = Pegawai::find($input['kdPegawai']);
        $tglAwal=$input['tglAwal'];
        $tglAkhir=$input['tglAkhir'];

        $SC = new StrukClosing();
        $SC->norec  = $SC->generateNewId();
        $SC->kdprofile = $this->getKdProfile();
        $SC->noclosing = $this->generateCode(new StrukClosing, 'noclosing', 10, 'C-'.$this->getDateTime()->format('ym'));
        $SC->objectpegawaidiclosefk = $input['kdPegawai'];
        $SC->tglclosing = $input['tglsetor'];
        $SC->totaldibayar = $input['totalSetoran'];
        $SC->objectkelompoktransaksifk = 137;//60;
        $SC->keteranganlainnya = "Setoran Kasir Deposit";
        $SC->tglawal = $tglAwal;
        $SC->tglakhir = $tglAkhir;
        $SC->tglclosing = $this->getDateTime()->format('Y-m-d H:i:s');
        $SC->save();
        $NorecSc = $SC->norec;

        $SH = new StrukHistori();
        $SH->norec  = $SH->generateNewId();
        $SH->nonhistori = $this->generateCode(new StrukHistori(), 'nonhistori', 14, 'SK-'.$this->getDateTime()->format('ym'));
        //$SH->objectbankaccountfk= $item['kdAccountBank'];
        $SH->kdprofile = 0;
        $SH->statusenabled= true;
        $SH->totalsetortarikdeposit =$input['totalSetoran'];
        $SH->tglsetortarikdeposit =  $input['tglsetor'];;//$this->getDateTime();
        $SH->objectpegawaitarikdepositfk = $input['kdPegawai'];
        $SH->objectpegawaiterimafk = $this->getCurrentUserID();
        $SH->objectkelompoktransaksifk = 137;//60;
        $SH->noclosing = $NorecSc;//$SC->noclosing;
        // $SH->objectcarasetorfk = $item['idCaraSetor'];
        $SH->ketlainya ='Setoran Kasir';
        if(isset($idRuangan)){
            $SH->objectruanganterimafk = $idRuangan;
            $SH->objectruanganfk = $idRuangan;
        }

        $SH->nobukti = '-';
        $SH->kdperkiraan = '-';//$input['kdperkiraan'];
        $SH->namaperkiraan = 'Penerimaan Kasir ';//$input['keterangan'];
        $SH->kettransaksi = '-';// $input['keterangantransaksi'];
        $SH->save();

        /** @Save_StrukBuktiPenerimaan */
        $strukBuktiPenerimanan = new StrukBuktiPenerimaan();
        $strukBuktiPenerimanan->norec = $strukBuktiPenerimanan->generateNewId();
        $strukBuktiPenerimanan->kdprofile = $this->getKdProfile();
        $strukBuktiPenerimanan->keteranganlainnya = 'Setoran Kasir Deposit';//nama perkiraan
        $strukBuktiPenerimanan->statusenabled = 1;
        //      $strukBuktiPenerimanan->nostrukfk = $strukPelayanan->norec;
        //      $strukBuktiPenerimanan->objectkelompokpasienfk = $strukPelayanan->pasien_daftar->pasien->objectkelompokpasienfk;
        $strukBuktiPenerimanan->objectpegawaipenerimafk = $this->getCurrentLoginID();
        $strukBuktiPenerimanan->tglsbm =  $input['tglsetor'];;//date('Y-m-d H:i:s');
        $strukBuktiPenerimanan->totaldibayar =  $input['totalSetoran'];//$input['totalSetoran'];
        $strukBuktiPenerimanan->objectkelompoktransaksifk =137;// 60;
        $strukBuktiPenerimanan->nosbm = $this->generateCode(new StrukBuktiPenerimaan, 'nosbm', 14, 'RV-' . $this->getDateTime()->format('ym'));
        $strukBuktiPenerimanan->noclosingfk = $NorecSc;
        $strukBuktiPenerimanan->save();
        /** @End_Save_StrukBuktiPenerimaan */

        foreach ($input['detailSetoran'] as $item){
            $SCK = new StrukClosingKasir();
            $SCK->norec  = $SC->generateNewId();
            $SCK->noclosingfk = $NorecSc; //$SC->norec;
            $SCK->totaldibayar = $item['totalPenerimaan'];
            $SCK->totaldibayarcashin = 0;
            $SCK->totaldibayarcashout = 0;
            $SCK->totaldibayarclose = 0;
            $SCK->carabayarfk = $item['kdCaraBayar'];
            $SCK->qtystrukbuktiextclose = 0;
            $SCK->qtystrukbuktiintclose = 0;
            $SCK->objectcarasetorfk = $item['idCaraSetor'];
            $SCK->save();

            /** @Save_StrukBuktiPenerimaanCaraBayar */
            $SBPCB = new StrukBuktiPenerimaanCaraBayar();
            $SBPCB->norec = $SBPCB->generateNewId();
            $SBPCB->kdprofile = $this->getKdProfile();
            $SBPCB->statusenabled = 1;
            $SBPCB->nosbmfk = $strukBuktiPenerimanan->norec;
            $SBPCB->objectcarabayarfk = $item['kdCaraBayar'];
            if (isset($input['detailBank'])) {
                $SBPCB->objectbankaccountfk = $input['detailBank']['id'];
                $SBPCB->namabankprovider = $input['detailBank']['namaBank'];
                $SBPCB->namapemilik = $input['detailBank']['namaKartu'];
            }
            $SBPCB->save();
            /** @End_Save_SStrukBuktiPenerimaanCaraBayar */
        }
        foreach ($input['detailSBM'] as $item2){
//                if ($item2['keteranganlainnya'] != 'keteranganlainnya'){
            $updateSBM = StrukBuktiPenerimaan::where('norec', $item2['norec_sbm'])//$input['kdPegawaiLu'])
            ->whereNull('noclosingfk')
                ->update([
                    'noclosingfk' => $NorecSc
                ]);
//                }
        }
//            $data2= StrukBuktiPenerimaan::where('objectpegawaipenerimafk', $UserId)//$input['kdPegawaiLu'])
//                ->whereNull('noclosingfk')
//                ->where('tglsbm','>=', $tglAwal)
//                ->where('tglsbm','<=', $tglAkhir)
//                ->update([
//                        'noclosingfk' => $NorecSc
//                ]);

        $transStatus = true;
//        } catch(\Exception $e){
//        $transStatus= false;
//        }

        $transMsg = "";
        if ($transStatus == true) {
            $transMsg = 'Simpan Berhasil';
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMsg,
                "data" => $SC,
                "as" => 'as@epic',
            );
        } else {
            $transMsg = 'Simpan Gagal!!';
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMsg,
                "data" => $SC,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMsg);
    }

    public function getDataLaporanPenerimaanDetail(Request $request){
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $ListRuangan='';
        if(isset( $request['idRuangan'])&&  $request['idRuangan']!=''){
            $ListRuangan = "WHERE x.id in (".$request['idRuangan'].")";
        }
        $data = \DB::select(DB::raw("SELECT x.tglsbm,x.noregistrasi,x.namapasien,x.id,x.namaruangan,x.penerimaankasir,SUM(x.total) as total
                FROM(select sbm.tglsbm,pd.noregistrasi,pm.namapasien,ru.id,ru.namaruangan,ru.penerimaankasir,
                ((pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN pasien_m as pm on pm.id=pd.nocmfk
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk not in (2,4,10)
                and pp.strukresepfk IS NULL
                
                UNION ALL
                
                select sbm.tglsbm,pd.noregistrasi,pm.namapasien,ru.id,ru.namaruangan,ru.penerimaankasir,
                ((pp.hargasatuan - (case when pp.hargadiscount is null then 0 else pp.hargadiscount end)) * pp.jumlah) + CASE when pp.jasa is null then 0 else pp.jasa end as total
                from pelayananpasien_t as pp
                INNER JOIN strukresep_t as sr on sr.norec=pp.strukresepfk
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                INNER JOIN ruangan_m as ru on ru.id=sr.ruanganfk
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk=sp.norec
                INNER JOIN pasien_m as pm on pm.id=pd.nocmfk
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'	
                
                UNION ALL
                
                select sbm.tglsbm,pd.noregistrasi,pm.namapasien,599 as id,'bpjs' as namaruangan,'20. BPJS Kesehatan' as penerimaankasir,sbm.totaldibayar AS total
                from strukpelayanan_t as sp 
                INNER JOIN pasiendaftar_t as pd on pd.norec=sp.noregistrasifk 
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.norec = sp.nosbmlastfk
                INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                and pd.objectkelompokpasienlastfk in (2,4,10,8)
                
                UNION ALL
                
                select sbm.tglsbm,'-' as noregistrasi,sp.namapasien_klien,600 as id,'Jamkesda' as namaruangan,'21. Jamkesda' as penerimaankasir,sp.totalprekanan AS total
                from strukpelayanan_t as sp 
                INNER JOIN pasiendaftar_t as pd on pd.norec=sp.noregistrasifk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.norec = sp.nosbmlastfk
                where sbm.tglsbm between '$tglAwal' and '$tglAkhir'
                and sp.totalprekanan <> 0
                and pd.objectkelompokpasienlastfk=8
                
                union all
                
                select sbm.tglsbm,'-' as noregistrasi,sp.namapasien_klien,579 as id,'DIKLAT' as namaruangan,'1. Diklat' as penerimaankasir,
                CASE WHEN sbm.totaldibayar IS NULL THEN 0 ELSE sbm.totaldibayar END AS total
                from strukpelayanan_t as sp 
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk = sp.norec
                WHERE sp.objectkelompoktransaksifk =13 
                AND sp.tglstruk BETWEEN '$tglAwal' and '$tglAkhir'
                AND sp.nosbmlastfk IS NOT NULL
                
                UNION ALL
                
                select sbm.tglsbm,'-' as noregistrasi,sp.namapasien_klien,604 as id,'Jasa Ketatausahaan' as namaruangan,'2. Jasa Ketatausahaan' as penerimaankasir,
                CASE WHEN sbm.totaldibayar IS NULL THEN 0 ELSE sbm.totaldibayar END AS total
                from strukpelayanan_t as sp 
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk = sp.norec
                WHERE sp.objectkelompoktransaksifk = 2 
                AND sp.keteranganlainnya <> 'Penjualan Obat Bebas'
                AND sbm.tglsbm BETWEEN '$tglAwal' and '$tglAkhir' 
                
                UNION ALL
                
                select sbm.tglsbm,'-' as noregistrasi,sp.namapasien_klien,ru.id,ru.namaruangan,ru.penerimaankasir,
                CASE WHEN sbm.totaldibayar IS NULL THEN 0 ELSE sbm.totaldibayar END AS total
                from strukpelayanan_t as sp 
                INNER JOIN ruangan_m as ru on ru.id = sp.objectruanganfk
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk = sp.norec
                WHERE sp.objectkelompoktransaksifk = 2 AND sp.keteranganlainnya = 'Penjualan Obat Bebas'
                AND sbm.tglsbm BETWEEN '$tglAwal' and '$tglAkhir'
                AND sp.nosbmlastfk IS NOT NULL
                
                UNION ALL
                
                select sbm.tglsbm,'-' as noregistrasi,sp.namapasien_klien,605 as id,'Sewa Ruang' as namaruangan,'1. Sewa Ruang' as penerimaankasir,
                CASE WHEN sbm.totaldibayar IS NULL THEN 0 ELSE sbm.totaldibayar END AS total
                from strukpelayanan_t as sp
                INNER JOIN strukpelayanandetail_t as spd on spd.nostrukfk = sp.norec
                LEFT JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk = sp.norec
                WHERE spd.objectprodukfk in (4041304,4041305,4041306,4041307,4041308,4041309,4041310,4041311,4041312)
                AND sbm.tglsbm BETWEEN '$tglAwal' and '$tglAkhir'
                
                
                UNION ALL
                
                select sbm.tglsbm,'-' as noregistrasi,sp.namapasien_klien,606 as id,'Pendapatan Lainnya' as namaruangan,'2. Pendapatan Lainnya' as penerimaankasir,
                CASE WHEN sbm.totaldibayar IS NULL THEN 0 ELSE sbm.totaldibayar END AS total
                from strukpelayanan_t as sp 
                INNER JOIN strukpelayanandetail_t as spd on spd.nostrukfk = sp.norec
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk = sp.norec
                WHERE spd.objectprodukfk in (1002121435) AND sp.objectkelompoktransaksifk not in (13)
                AND sbm.tglsbm BETWEEN '$tglAwal' and '$tglAkhir'
                GROUP BY sbm.tglsbm,sbm.totaldibayar,sp.namapasien_klien
                
                UNION ALL
                
                select sbm.tglsbm,'-' as noregistrasi,sp.namapasien_klien,ru.id,ru.namaruangan,ru.penerimaankasir,
                CASE WHEN sbm.totaldibayar IS NULL THEN 0 ELSE sbm.totaldibayar END AS total
                from strukpelayanan_t as sp 
                INNER JOIN ruangan_m as ru on ru.id = sp.objectruanganfk
                INNER JOIN strukpelayanandetail_t as spd on spd.nostrukfk = sp.norec
                INNER JOIN strukbuktipenerimaan_t as sbm on sbm.nostrukfk = sp.norec
                WHERE spd.objectprodukfk in (402611)
                AND sbm.tglsbm BETWEEN '$tglAwal' and '$tglAkhir') as x
                $ListRuangan
                GROUP BY x.tglsbm,x.noregistrasi,x.namapasien,x.id,x.namaruangan,x.penerimaankasir"));
        return $this->respond($data);
    }

    public function getDataMonitoringKlaim(Request $request){
        $tglAwal = $request['tglsep'];
        $setTgl = "pesertatglpulang like '%$tglAwal%'";
        $setnoFpk = "";
        $jenispelayanan ="";
        $status = "";
        if(isset($request['noFpk']) && $request['noFpk'] != "" && $request['noFpk'] != "undefined") {
            $noFpk = $request['noFpk'];
            $setnoFpk = "BIAYANOFPK = '$noFpk'";
            $setTgl = "";
        }
        if(isset($request['jenispelayanan']) && $request['jenispelayanan'] != "" && $request['jenispelayanan'] != "undefined") {
            $jenispelayanan = $request['jenispelayanan'];
            $jenispelayanan = "AND JENISPELAYANAN = '$jenispelayanan'";
        }
        if(isset($request['status']) && $request['status'] != "" && $request['status'] != "undefined") {
            $status = $request['status'];
            if($status==3)
                $status="Klaim";
            if($status==2)
                $status="Proses Pending";
            if($status==1)
                $status="Proses Verifikasi";
            $status = "AND PESERTASTATUS = '$status'";
        }
    //    return($tglAwal);
    //    die();
        $data = \DB::select(DB::raw("select * from monitoringdataklaim_t where $setTgl $setnoFpk $jenispelayanan $status"));
        return $this->respond($data);
    }
    public function getDataMonitoringKlaimJaspel(Request $request){
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $setTgl = " mdj.pesertatglpulang between '$tglAwal' and '$tglAkhir'";
        $setnoFpk = "";
        $jenispelayanan ="";
        $status = "";
        $selisihJaspel = "";
        $statusDaftar = "";
        $statusJaspel = "";
        if(isset($request['noFpk']) && $request['noFpk'] != "" && $request['noFpk'] != "undefined") {
            $noFpk = $request['noFpk'];
            $setnoFpk = " mdj.BIAYANOFPK = '$noFpk'";
            $setTgl = "";
        }
        if(isset($request['jenispelayanan']) && $request['jenispelayanan'] != "" && $request['jenispelayanan'] != "undefined") {
            $jenispelayanan = $request['jenispelayanan'];
            if($jenispelayanan==3)
                $jenispelayanan="";
            $jenispelayanan = " AND mdj.JENISPELAYANAN = '$jenispelayanan'";
        }
        if(isset($request['status']) && $request['status'] != "" && $request['status'] != "undefined") {
            $status = $request['status'];
            if($status==3)
                $status="Klaim";
            if($status==2)
                $status="Proses Pending";
            if($status==1)
                $status="Proses Verifikasi";
            $status = " AND mdj.PESERTASTATUS = '$status'";
        }
        if(isset($request['selisihJaspel']) && $request['selisihJaspel'] != "" && $request['selisihJaspel'] != "undefined") {
            $selisihJaspel = $request['selisihJaspel'];
            if($selisihJaspel==1)
                $selisihJaspel=" and mdj.BIAYABYSETUJUI > mdj.BIAYABYTARIFRS";
            if($selisihJaspel==2)
                $selisihJaspel=" and mdj.BIAYABYSETUJUI < mdj.BIAYABYTARIFRS";
            if($selisihJaspel==3)
                $selisihJaspel="";
        }
        if(isset($request['statusDaftar']) && $request['statusDaftar'] != "" && $request['statusDaftar'] != "undefined") {
            $statusDaftar = $request['statusDaftar'];
            if($statusDaftar==1)
                $statusDaftar=" and pd.statusenabled=1";
            if($statusDaftar==2)
                $statusDaftar=" and pd.statusenabled=0";
            if($statusDaftar==3)
                $statusDaftar=" and pd.statusenabled is null";
            if($statusDaftar==4)
                $statusDaftar="";
        }
        if(isset($request['statusJaspel']) && $request['statusJaspel'] != "" && $request['statusJaspel'] != "undefined") {
            $statusJaspel = $request['statusJaspel'];
            if($statusJaspel==1)
                $statusJaspel=" and mdj.objectverifikasifk is not null";
            if($statusJaspel==2)
                $statusJaspel=" and mdj.objectverifikasifk is null";
            if($statusJaspel==3)
                $statusJaspel=" ";
            if($statusJaspel==4)
                $statusJaspel="";
        }
        // $data = \DB::select(DB::raw("select * from monitoringdataklaimjaspel_t where $setTgl $setnoFpk $jenispelayanan $status $selisihJaspel"));
        $data = \DB::select(DB::raw("SELECT        mdj.BIAYANOSEP, mdj.INACBGKODE, mdj.INACBGNAMA, mdj.BIAYABYPENGAJUAN, mdj.BIAYABYSETUJUI,
            mdj.BIAYABYTARIFGRUPER, mdj.BIAYABYTARIFRS, mdj.BIAYABYTOPUP, mdj.BIAYAKELASRAWAT, mdj.BIAYANOFPK, 
            mdj.PESERTANAMA, mdj.PESERTANOKARTU, 
                                    mdj.PESERTANOMR, mdj.PESERTAPOLI, mdj.PESERTASTATUS, mdj.PESERTATGLPULANG, 
            mdj.PESERTATGLSEP, mdj.JENISPELAYANAN, mdj.TGLNOFPK,pa.nosep,pd.tglregistrasi,pd.noregistrasi,ru.namaruangan,
            pd.statusenabled
            FROM            monitoringdataklaimjaspel_t  mdj
            LEFT JOIN pemakaianasuransi_t pa on mdj.BIAYANOSEP=pa.nosep
            LEFT JOIN pasiendaftar_t pd on pd.norec=pa.noregistrasifk
            LEFT JOIN ruangan_m ru on ru.id=pd.objectruanganlastfk where $setTgl $setnoFpk $jenispelayanan $status $selisihJaspel $statusDaftar $statusJaspel
            ORDER BY pd.statusenabled desc"));

        $data10 = [];
        $sama = false;
        foreach ($data as $item) {
            $sama = false;
            $i = 0;
            $o = 0;
            foreach ($data10 as $hideung){
                if($item->BIAYANOSEP == $data10[$i]['BIAYANOSEP']){
                    $sama = true;
                }
                $i = $i + 1;
            }
            if($item->statusenabled==1){
                $item->statusenabled ='DAFTAR';
            }else if(is_null($item->statusenabled)){//$item->statusenabled==0
                $item->statusenabled ='TIDAK ADA DI SIMRS';
            }else{
                $item->statusenabled ='BATAL';
            }
            if($sama == false){
                $data10[] = array(
                    'BIAYANOSEP'=>$item->BIAYANOSEP,
                    'noregistrasi'=>$item->noregistrasi,
                    'tglregistrasi'=>$item->tglregistrasi,
                    'BIAYANOFPK'=>$item->BIAYANOFPK,
                    'PESERTANAMA'=>$item->PESERTANAMA,
                    'INACBGNAMA'=>$item->INACBGNAMA,
                    'PESERTANOKARTU'=>$item->PESERTANOKARTU,
                    'PESERTANOMR'=>$item->PESERTANOMR,
                    'PESERTAPOLI'=>$item->PESERTAPOLI,
                    'BIAYAKELASRAWAT'=>$item->BIAYAKELASRAWAT,
                    'PESERTASTATUS'=>$item->PESERTASTATUS,
                    'BIAYABYTARIFRS'=>$item->BIAYABYTARIFRS,
                    'BIAYABYSETUJUI'=>$item->BIAYABYSETUJUI,
                    'PESERTATGLSEP'=>$item->PESERTATGLSEP,
                    'TGLNOFPK'=>$item->TGLNOFPK,
                    'namaruangan'=>$item->namaruangan,
                    'statusenabledDaftar'=>$item->statusenabled,
                    'PESERTATGLPULANG'=>$item->PESERTATGLPULANG
                );
            }
            foreach ($data10 as $key => $row) {
                $count[$key] = $row['BIAYANOSEP'];
            }            
        }
        return $this->respond($data10);
    }
}