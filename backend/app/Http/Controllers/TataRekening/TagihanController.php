<?php

/**
 * Created by PhpStorm.
 * User: Egie Ramdan
 * Date: 8/2/2019
 * Time: 10:46 AM
 */

namespace App\Http\Controllers\TataRekening;

use App\Http\Controllers\ApiController;
use App\Master\Alamat;
use App\Master\AsuransiPasien;
use App\Master\KelompokPasien;
use App\Master\Pasien;
use App\Traits\InternalList;
use App\Transaksi\AntrianPasienDiperiksa;
use App\Transaksi\RegistrasiPelayananPasien;
use App\Transaksi\LoggingUser;
use App\Transaksi\PemakaianAsuransi;
use App\Transaksi\StrukBuktiPenerimaan;
use App\Transaksi\StrukBuktiPenerimaanCaraBayar;
use App\Transaksi\StrukBuktiPengeluaran;
use App\Transaksi\StrukPelayananPenjaminDetail;
use App\Transaksi\StrukVerifikasi;
use App\Transformers\Master\KelompokPasienTransformer;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Transaksi\PelayananPasienPetugas;
use App\Transaksi\PasienDaftar;
use App\Transaksi\StrukPelayanan;
use App\Transaksi\PelayananPasien;
use App\Transaksi\PelayananPasienDetail;
use App\Transaksi\StrukPelayananPenjamin;
use App\Transaksi\TempBilling;
use App\Transaksi\MapRuanganToAkomodasi;
use App\Transaksi\AlasanHapus;
use App\Transaksi\MapPetugasPelaksanaBpjs;
use App\Transaksi\PemeriksaanLuar;
use App\Master\JenisPetugasPelaksana;
use App\Master\Pegawai;
use App\Master\Ruangan;
use App\Master\Departemen;
use App\Transaksi\DiagnosaPasien;
use App\Transaksi\DetailDiagnosaPasien;
use App\Transaksi\StrukResep;
use App\Transaksi\HasilLaboratorium;
use App\Transaksi\HasilRadiologi;

//use App\Transaksi\StrukPelayananDetailK;
use App\Transaksi\HistoriCetakDokumen;
use App\Traits\Valet;
use App\Traits\PelayananPasienTrait;
use DB;
use App\Transaksi\PostingJurnalTransaksi;
use App\Transaksi\LogAcc;
use App\Traits\SettingDataFixedTrait;

use App\Transaksi\PembayaranTindakanPerpenjamin;

use Carbon\Carbon;

class TagihanController  extends ApiController
{


    use Valet, PelayananPasienTrait, SettingDataFixedTrait, InternalList;
    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }

    public function getDataComboDetailRegisSelect(Request $request)
    {
        $result = [];
        $dataLogin = $request->all();

        if (isset($dataLogin['ruangan']) && $dataLogin['ruangan']!="" && $dataLogin['ruangan']!="undefined"){
            $dataRuangan = \DB::table('ruangan_m as ru')
                ->select('ru.id', 'ru.namaruangan')
                ->whereIn('ru.objectdepartemenfk', array(3, 17, 18, 24, 25, 26, 27, 28, 16, 30, 34,73,74,75))
                ->where('ru.statusenabled', true)
                ->orderBy('ru.namaruangan')
                ->get();
            $result['ruangan'] = $dataRuangan;
        }

        if (isset($dataLogin['dataRuanganKonsul']) && $dataLogin['dataRuanganKonsul']!="" && $dataLogin['dataRuanganKonsul']!="undefined"){
            $dataRuanganKonsul = \DB::table('ruangan_m as ru')
                ->select('ru.id', 'ru.namaruangan')
                ->whereIn('ru.objectdepartemenfk', array(3, 17, 18, 24, 25, 26, 27, 28, 30,34, 73, 74, 75))
                ->where('ru.statusenabled', true)
                ->orderBy('ru.namaruangan')
                ->get();
            $result['dataRuanganKonsul'] = $dataRuanganKonsul;
        }


        if (isset($dataLogin['rekanana']) && $dataLogin['rekanana']!="" && $dataLogin['rekanana']!="undefined"){
            $dataRekanan = \DB::table('rekanan_m as ru')
                ->where('ru.statusenabled', true)
                ->select('ru.id', 'ru.namarekanan', 'ru.objectkelompokpasienfk')
                ->orderBy('ru.namarekanan')
                ->get();
            $result['rekanana'] = $dataRekanan;
        }

       
        if (isset($dataLogin['kelas']) && $dataLogin['kelas']!="" && $dataLogin['kelas']!="undefined"){
            $kelas = \DB::table('kelas_m as kls')
                ->select('kls.id', 'kls.namakelas')
                ->where('kls.statusenabled', true)
                ->orderBy('kls.namakelas')
                ->get();
            $result['kelas'] = $kelas;
        }
        if (isset($dataLogin['statuspulang']) && $dataLogin['statuspulang']!="" && $dataLogin['statuspulang']!="undefined"){
            $statuspulang = \DB::table('statuspulang_m as sp')
                ->select('sp.id', 'sp.namaexternal')
                ->where('sp.statusenabled', true)
                ->where('sp.norec', 'like', '%RJ%')
                ->orderBy('sp.namaexternal')
                ->get();
            $result['statuspulang'] = $statuspulang;
        }
        if (isset($dataLogin['pembatalan']) && $dataLogin['pembatalan']!="" && $dataLogin['pembatalan']!="undefined"){
            $pembatalan = \DB::table('pembatal_m as p')
                ->select('p.id', 'p.name')
                ->where('p.statusenabled', true)
                ->orderBy('p.name')
                ->get();
            $result['pembatalan'] = $pembatalan;
        }
      
        if (isset($dataLogin['dokter']) && $dataLogin['dokter']!="" && $dataLogin['dokter']!="undefined"){
            $dataPenulis = Pegawai::where('statusenabled', true)
                ->select('id', 'namalengkap')
                ->where('objectjenispegawaifk', 1)
                ->get();
            $result['dokter'] = $dataPenulis;
        }
      
        
        if (isset($dataLogin['departemen']) && $dataLogin['departemen']!="" && $dataLogin['departemen']!="undefined"){
            $dataInstalasi = \DB::table('departemen_m as dp')
                ->select('dp.id', 'dp.namadepartemen')
                //            ->whereIn('dp.id',[3, 14, 16, 17, 18, 19, 24, 25, 26, 27, 28, 35,30])
                ->where('dp.statusenabled', true)
                ->orderBy('dp.namadepartemen')
                ->get();
            $dataRuanganAll = \DB::table('ruangan_m as ru')
            ->select('ru.namaruangan', 'ru.id', 'ru.objectdepartemenfk')
                ->where('ru.statusenabled', true)
                ->orderBy('ru.namaruangan')
                ->get();

            foreach ($dataInstalasi as $item) {
                $detail = [];
                foreach ($dataRuanganAll as $item2) {
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
        }
        return $this->respond($result);
    }

    public function verifikasiTagihan($noRegister)
    {
        $pasienDaftar = PasienDaftar::where('noregistrasi', $noRegister)->first();
        $pelayanan = $this->getPelayananPasienByNoRegistrasi($noRegister);
        $billing = $this->getBillingFromPelayananPasien($pelayanan);
        $totalBilling = $billing->totalBilling;
        $isRawatInap = $this->isPasienRawatInap($pasienDaftar);

        if ($pasienDaftar->nostruklastfk == null && $isRawatInap) {
            $totalBilling += (int)($totalBilling * $this->getPercentageBiayaAdmin());
            $totalBilling += $this->getBiayaMaterai($totalBilling);
        }

        $totalDeposit = $billing->totalDeposit;
        $totalKlaim = 0;
        $result = array(
            'pasienID' => $pasienDaftar->pasien->id,
            'noCm' => $pasienDaftar->pasien->nocm,
            'noRegistrasi' => $pasienDaftar->noregistrasi,
            'namaPasien' => $pasienDaftar->pasien->namapasien,
            'tglPulang' => $pasienDaftar->tglpulang,
            'jenisPasien' => $pasienDaftar->kelompok_pasien->kelompokpasien,
            'kelasRawat' => $pasienDaftar->kelas->namakelas,
            'noAsuransi' => '-', //ambil dari asuransi pasien -m tapi datanya blum ada brooo..
            'kelasPenjamin' => '-', //ini blum ada datanya gimana mau munculin,, gila yaa ?
            'billing' => $totalBilling,
            'penjamin' => $penjamin = $this->getPenjamin($pasienDaftar)->namarekanan,
            'deposit' => $totalDeposit, //ngambil dari mana
            'totalKlaim' => $totalKlaim, //ngambil dari mana? dihitunga gak
            'jumlahBayar' => $totalBilling - $totalDeposit - $totalKlaim, //jumlah bayar ini perlu gak
            'jumlahPiutang' => 0, //ini ngambil dari pembayaran gak ?
            'needDokument' => true, //ini ngambil ddokument dari mana ? pake datafixed
            'dokuments' => [], // sama ini juga ngambilnya dari mana ..
        );
        return $this->respond($result);
    }
    public function verifikasiTagihan2($noRegister)
    {
        //        $pasienDaftar = PasienDaftar::where('noregistrasi', $noRegister)->first();

        //        $pelayanan = $this->getPelayananPasienByNoRegistrasi($noRegister);
        $pelayanan = DB::select(
            DB::raw("select pd.objectruanganlastfk,pd.nostruklastfk,ps.id as psid,ps.nocm,
            ps.namapasien,pd.tglpulang,kps.kelompokpasien,kl.namakelas,
            pd.objectruanganlastfk,ru.objectdepartemenfk,
            pd.noregistrasi,pd.norec as norecpasiendaftar,kl2.namakelas as kelasPenjamin,kl2.reportdisplay,kl3.namakelas as kelasTindakan,asu.noasuransi,pp.* from pasiendaftar_t pd
            left JOIN antrianpasiendiperiksa_t apd on apd.noregistrasifk=pd.norec
            left JOIN pelayananpasien_t pp on pp.noregistrasifk=apd.norec
            left JOIN pasien_m ps on ps.id=pd.nocmfk
            left JOIN kelas_m kl on kl.id=pd.objectkelasfk
            left JOIN kelompokpasien_m kps on kps.id=pd.objectkelompokpasienlastfk
            left JOIN ruangan_m ru on ru.id=pd.objectruanganlastfk
            left JOIN pemakaianasuransi_t pas on pas.noregistrasifk=pd.norec
            left JOIN asuransipasien_m asu on asu.id=pas.objectasuransipasienfk
            left JOIN kelas_m kl2 on kl2.id=asu.objectkelasdijaminfk
            left JOIN kelas_m kl3 on kl3.id=apd.objectkelasfk
            where pd.noregistrasi=:noregistrasi and pp.strukfk is null;"),
            array(
                'noregistrasi' => $noRegister,
            )
        );

        // kodingan grouping manual
        $x = $pelayanan[0];
        $hakkelas = $x->reportdisplay;
        if ($hakkelas == 'Non Kelas') {
            $b = 0;
        } else if ($hakkelas == 'kelas_3') {
            $b = 1;
        } else if ($hakkelas == 'kelas_2') {
            $b = 2;
        } else if ($hakkelas == 'kelas_1') {
            $b = 3;
        } else if ($hakkelas == 'VIP') {
            $b = 4;
        } else if ($hakkelas == '') {
            $b = 0;
        }

        $datas = DB::select(
            DB::raw("
          select * from ( select tglmasuk,tglkeluar,reportdisplay,	
            CASE antrianpasiendiperiksa_t.objectkelasfk WHEN 6 THEN  0
            WHEN 1 THEN  1  WHEN 2 THEN 2 WHEN 3 THEN 3  WHEN 4 THEN  4
            WHEN 7 THEN  4
            ELSE 1 END AS derajatkelas 
            from 
                antrianpasiendiperiksa_t
            INNER JOIN kelas_m ON antrianpasiendiperiksa_t.objectkelasfk = kelas_m.id
            where noregistrasifk ='$x->norecpasiendaftar'  ) as x where  x.derajatkelas>$b order by x.derajatkelas asc 
            ")
        );


        $a = 0;
        $b = 0;
        $c = 0;
        $biayanaikkelas = 0;
     

        $setBiayaNaikKelas = DB::select(
            DB::raw("
          select totalbiayars,totalpiutangpenjamin,biayanaikkelas from hasilgrouping_t where noregistrasifk='$x->norecpasiendaftar'
            ")
        );
        foreach ($setBiayaNaikKelas as $n) {
            $biayanaikkelas = $n->biayanaikkelas;
        }

        // end

        $pelayanantidakterklaim = DB::select(
            DB::raw("select pd.objectruanganlastfk,pd.nostruklastfk,ps.id as psid,ps.nocm,
            ps.namapasien,pd.tglpulang,kps.kelompokpasien,kl.namakelas,
            pd.objectruanganlastfk,ru.objectdepartemenfk,
            pd.noregistrasi,pp.* from pasiendaftar_t pd
            INNER JOIN antrianpasiendiperiksa_t apd on apd.noregistrasifk=pd.norec
            INNER JOIN pelayananpasientidakterklaim_t pp on pp.noregistrasifk=apd.norec
            INNER JOIN pasien_m ps on ps.id=pd.nocmfk
            INNER JOIN kelas_m kl on kl.id=pd.objectkelasfk
            INNER JOIN kelompokpasien_m kps on kps.id=pd.objectkelompokpasienlastfk
            INNER JOIN ruangan_m ru on ru.id=pd.objectruanganlastfk
            where pd.noregistrasi=:noregistrasi and pp.strukfk is null;"),
            array(
                'noregistrasi' => $noRegister,
            )
        );
        //        $pelayanan=$pelayanan[0];
        //        $billing = $this->getBillingFromPelayananPasien($pelayanan);
        $totalBilling = 0;
        $totalKlaim = 0;
        $totalDeposit = 0;
        $totaltakterklaim = 0;

        foreach ($pelayanantidakterklaim as $values) {
            //            if ($values->produkfk == $this->getProdukIdDeposit()) {
            //                $totalDeposit = $totalDeposit + $values->hargajual;
            //            } else {
            $totaltakterklaim = $totaltakterklaim + (($values->hargajual - $values->hargadiscount) * $values->jumlah) + $values->jasa;
            //            }
        }

        foreach ($pelayanan as $value) {
            if ($value->produkfk == $this->getProdukIdDeposit()) {
                $totalDeposit = $totalDeposit + $value->hargajual;
            } else {
                $totalBilling = $totalBilling + (($value->hargajual - $value->hargadiscount) * $value->jumlah) + $value->jasa;
            }
        }

        //        $billing = new \stdClass();
        //        $billing->totalBilling = $totalBilling;
        //        $billing->totalKlaim= $totalKlaim;
        //        $billing->totalDeposit = $totalDeposit;

        $totalBilling = $totalBilling;
        //        $isRawatInap  = $this->isPasienRawatInap2($pelayanan);
        $pelayanan = $pelayanan[0];
        $isRawatInap = false;
        if ($pelayanan->objectruanganlastfk != null) {
            if ((int)$pelayanan->objectdepartemenfk == 16) {
                $isRawatInap = true;
            }
        }


        //        if ($pelayanan->nostruklastfk == null && $isRawatInap) {
        //            $totalBilling = $totalBilling + number_format($totalBilling * $this->getPercentageBiayaAdmin(), 0, '', '');
        //            $totalBilling = $totalBilling + $this->getBiayaMaterai($totalBilling);
        //        }

        $totalDeposit = $totalDeposit;
        $totalKlaim = 0;
        $result = array(
            'pasienID' => $pelayanan->psid,
            'noCm' => $pelayanan->nocm,
            'noRegistrasi' => $pelayanan->noregistrasi,
            'namaPasien' => $pelayanan->namapasien,
            'tglPulang' => $pelayanan->tglpulang,
            'jenisPasien' => $pelayanan->kelompokpasien,
            'kelasRawat' => $pelayanan->namakelas,
            'noAsuransi' => '-', //ambil dari asuransi pasien -m tapi datanya blum ada brooo..
            'kelasPenjamin' => '-', //ini blum ada datanya gimana mau munculin,, gila yaa ?
            'billing' => $totalBilling,
            'penjamin' => '', //$penjamin=$this->getPenjamin($pelayanan)->namarekanan,
            'deposit' => $totalDeposit, //ngambil dari mana
            'totalKlaim' => $totalKlaim, //ngambil dari mana? dihitunga gak
            'jumlahBayar' => $totalBilling - $totalDeposit - $totalKlaim, //jumlah bayar ini perlu gak
            'jumlahBayarNew' =>  $totalBilling - $totalDeposit - $totalKlaim - $totaltakterklaim, //jumlah bayar dengan tindakan yang tidak d klaim
            'jumlahPiutang' => 0, //ini ngambil dari pembayaran gak ?
            'needDokument' => true, //ini ngambil ddokument dari mana ? pake datafixed
            'dokuments' => [], // sama ini juga ngambilnya dari mana ..
            'totaltakterklaim' => $totaltakterklaim,
            'isRawatInap' => $isRawatInap,
            'biayanaikkelas' => $biayanaikkelas,
        );
        return $this->respond($result);
    }

    public function simpanVerifikasiTagihan(Request $request, $noRegister)
    {
        $dataLogin = $request->all();
        $dataPegawaiUser = DB::select(
            DB::raw("select pg.id,pg.namalengkap from loginuser_s as lu
                INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id
                where lu.id=:idLoginUser"),
            array(
                'idLoginUser' => $dataLogin['userData']['id'],
            )
        );
        $transStatus = true;
        $transMsg = null;
        $totalBilling = 0;
        $totalDeposit = 0;
        DB::beginTransaction();

        $pasienDaftar = PasienDaftar::where('noregistrasi', $noRegister)->first();
        $pelayanan = $pasienDaftar->pelayanan_pasien()->select('pelayananpasien_t.*')->whereNull('strukfk')->get();
        $pelayananDetail = $pasienDaftar->pelayanan_pasien_detail()->whereNull('strukfk')->get();
        $dataPD = \DB::table('pasiendaftar_t as pd')
            ->JOIN('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->select('ru.objectdepartemenfk')
            ->where('pd.noregistrasi', $noRegister)
            ->first();
        //        return $this->respond($dataPD->objectdepartemenfk);
        if ($dataPD->objectdepartemenfk == 16) {
            $isRawatInap = true;
        } else {
            $isRawatInap = false;
        }
        //        $isRawatInap  = $this->isPasienRawatInap($pasienDaftar);
        if (count($pelayanan) == 0) {
            $transStatus = false;
            $transMsg = "Pelayanan yang dilakukan pasien tidak ada.";
        }


        if ($transStatus) {
            $noStruk = $this->generateCode(new StrukPelayanan, 'nostruk', 10, 'S');
            $strukPelayanan = new StrukPelayanan();
            $strukPelayanan->norec = $strukPelayanan->generateNewId();
            $lastPelayanan = null;

            foreach ($pelayanan as $pel) {
                $harga = ($pel->hargajual == null) ? 0 : $pel->hargajual;
                $diskon = ($pel->hargadiscount == null) ? 0 : $pel->hargadiscount;
                if ($pel->nilainormal == -1) {
                    $totalDeposit += ($harga * $pel->jumlah);
                } else {
                    $totalBilling += (($harga - $diskon) * $pel->jumlah) + $pel->jasa;
                }
            }

            $strukPelayanan->kdprofile = $this->getKdProfile();
            $strukPelayanan->nocmfk = $pasienDaftar->nocmfk;
            $strukPelayanan->noregistrasifk = $pasienDaftar->norec;
            $strukPelayanan->objectkelaslastfk = $pasienDaftar->objectkelasfk;
            $strukPelayanan->objectkelompoktransaksifk = 1;
            $strukPelayanan->objectpegawaipenerimafk = $dataPegawaiUser[0]->id; // $this->getCurrentLoginID();
            $strukPelayanan->nostruk = $noStruk;
            $strukPelayanan->totalharusdibayar = $totalBilling - $totalDeposit;
            $strukPelayanan->tglstruk = $this->getDateTime();
            $strukPelayanan->objectruanganfk = $pasienDaftar->objectruanganlastfk;

            //            try{
            $strukPelayanan->save();
            //            }
            //            catch(\Exception $e){
            //                $transStatus= false;
            ////                $transMsg = $e->getMessage();
            ////                throw new \Exception($e);
            //                $transMsg = "Simpan Biaya Administrasi Gagal {SP}";
            //
            //            }

            if ($transStatus) {
                foreach ($pelayanan as $pel) {
                    //                    $harga = ($pel->hargajual==null) ? 0 : $pel->hargajual;
                    //                    if($pel->nilainormal==-1){
                    //                        $totalDeposit += ($harga * $pel->jumlah);
                    //                    }else{
                    //                        $totalBilling += ($harga * $pel->jumlah);
                    //                    }

                    $pel->strukfk = $strukPelayanan->norec;
                    //$norecStukPelayananStr = $strukPelayanan->norec;

                    try {
                        $pel->save();
                    } catch (\Exception $e) {
                        $transStatus = false;
                        //                    throw new \Exception($e);
                        $transMsg = "Transaksi Gagal (update pp)";
                        break;
                    }
                }
            }


            //            if ($transStatus && $isRawatInap) {
            //                $AntrianPasienDiperiksa = $pasienDaftar->antrian_pasien_diperiksa->first();
            //                $biayaAdministrasi = number_format($totalBilling * $this->getPercentageBiayaAdmin(), 0, '', '');
            //                if ($biayaAdministrasi > 0 && $transStatus) {
            //                    $PP = new PelayananPasien();
            //                    $PP->norec = $PP->generateNewId();
            //                    $PP->kdprofile = $this->getKdProfile();
            //                    $PP->kdprofile = $this->getKdProfile();
            //                    $PP->noregistrasifk = $AntrianPasienDiperiksa->norec;
            //                    $PP->aturanpakai = "-";
            //                    $PP->hargasatuan = (float)$biayaAdministrasi;
            //                    $PP->hargajual = (float)$biayaAdministrasi;
            //                    $PP->jumlah = 1;
            //                    $PP->nilainormal = 1;
            //                    $PP->keteranganlain = "Biaya Administrasi";
            //                    $PP->keteranganpakai2 = "-";
            //                    $PP->produkfk = $this->getProdukBiayaAdministrasi()->id;
            //                    $PP->stock = 1;
            //                    $PP->tglpelayanan = $this->getDateTime();
            //                    $PP->strukfk = $strukPelayanan->norec;
            //
            //                    try {
            //                        $PP->save();
            //                    } catch (\Exception $e) {
            //                        $transStatus = false;
            ////                    throw new \Exception($e);
            //                        $transMsg = "Simpan Biaya Administrasi Gagal {BA}";
            //                    }
            //                    $totalBilling += $biayaAdministrasi;
            //                    $strukPelayanan->totalharusdibayar += $biayaAdministrasi;
            //                }
            //            }


            //            if ($transStatus && $isRawatInap) {
            //                $biayaMaterai = $this->getBiayaMaterai($totalBilling);
            //                if ($biayaMaterai > 0 && $transStatus) {
            //                    $totalBilling += $biayaMaterai;
            //                    $PP = new PelayananPasien();
            //                    $PP->norec = $PP->generateNewId();
            //                    $PP->kdprofile = $this->getKdProfile();
            //                    $PP->kdprofile = $this->getKdProfile();
            //                    $PP->noregistrasifk = $AntrianPasienDiperiksa->norec;
            //                    $PP->aturanpakai = "-";
            //                    $PP->hargasatuan = (float)$biayaMaterai;
            //                    $PP->hargajual = (float)$biayaMaterai;
            //                    $PP->jumlah = 1;
            //                    $PP->nilainormal = 1;
            //                    $PP->keteranganlain = "Biaya Administrasi";
            //                    $PP->keteranganpakai2 = "-";
            //                    $PP->produkfk = $this->getProdukBiayaMaterai()->id;
            //                    $PP->stock = 1;
            //                    $PP->tglpelayanan = $this->getDateTime();
            //                    $PP->strukfk = $strukPelayanan->norec;
            //                    try {
            //                        $PP->save();
            //                    } catch (\Exception $e) {
            //                        $transStatus = false;
            //                        $transMsg = "Simpan Biaya Administrasi Gagal {BM}";
            //                    }
            //                    $totalBilling += $biayaMaterai;
            //                    $strukPelayanan->totalharusdibayar += $biayaMaterai;
            //                }
            //            }

        }

        if ($transStatus) {
            foreach ($pelayananDetail as $pelDel) {
                $pelDel->strukfk = $strukPelayanan->norec;
                try {
                    $pelDel->save();
                } catch (\Exception $e) {
                    $transStatus = false;
                    $transMsg = "Transaksi Gagal (insert SP)";
                    break;
                }
            }
        }

        $totalKlaim = (float)$request['totalKlaim'];
        if ($transStatus && $totalKlaim > 0) {
            $strukPelayanan->totalharusdibayar -= $totalKlaim;
            $strukPelayanan->totalprekanan = $totalKlaim;
            if ($pasienDaftar->objectkelompokpasienlastfk == $this->getKelompokPasienPerjanjian()) {
                $rekananpenjamin_id = 0;
            } elseif ($pasienDaftar->objectkelompokpasienlastfk == 2 || $pasienDaftar->objectkelompokpasienlastfk == 4) {
                $rekananpenjamin_id = 2552;
            } else {
                $rekananpenjamin_id = 0; //masih bypass. yang kelompok pasien penjanjian diisini cuma kondisinhya jiga ada klim tapi gak penjaminnya..

            }
            $SPPenjamin = new StrukPelayananPenjamin();
            $SPPenjamin->norec = $SPPenjamin->generateNewId();
            //$norecStukPelayananPenjaminStr =  $SPPenjamin->norec;
            $SPPenjamin->kdprofile = $this->getKdProfile();
            $SPPenjamin->kdkelompokpasien = $pasienDaftar->objectkelompokpasienlastfk;
            $SPPenjamin->kdrekananpenjamin = $rekananpenjamin_id;
            $SPPenjamin->totalbiaya = $totalBilling;
            $SPPenjamin->totalsudahppenjamin = $totalKlaim; //? apa in ?
            $SPPenjamin->totalsisaharusdibayar = $totalKlaim;
            $SPPenjamin->totalppenjamin = $totalKlaim;
            $SPPenjamin->totalharusdibayar = $totalKlaim;
            $SPPenjamin->totalsudahdibayar = 0;
            $SPPenjamin->totalsudahdibebaskan = 0;
            $SPPenjamin->totalsisapiutang = $totalKlaim;
            $SPPenjamin->totaldibayarlebih = 0;
            $SPPenjamin->nostrukfk = $strukPelayanan->norec;

            $pasienDaftar->nostruklastfk = $strukPelayanan->norec;
            //            //jurnal verif SPP
            //            if($transStatus && ($request['totalKlaim']>0)){
            //                $logAcc =new  LogAcc;
            //                $logAcc->norec = $logAcc->generateNewId();
            //                $logAcc->jenistransaksi = 'Verifikasi Penjamin TataRekening';
            //                $logAcc->noreff =$strukPelayanan->norec;
            //                $logAcc->status = 0;
            //                $logAcc->tanggal = $this->getDateTime()->format('Y-m-d H:i:s');
            //                if($transStatus){
            //                    try{
            //                        $logAcc->save();
            //                    }
            //                    catch(\Exception $e){
            //                        $transStatus= false;
            //                        $transMsg = "Simpan logAcc penjamin Gagal {SPP}";
            //
            //                    }
            //                }
            //            }
            //            //end jurnal verif SPP
            try {
                $SPPenjamin->save();
            } catch (\Exception $e) {
                $transStatus = false;
                //                throw new \Exception($e);
                $transMsg = "Transaksi Gagal (Insert SPP)";
            }
        }

        if ($transStatus) {
            $pasienDaftar->nostruklastfk = $strukPelayanan->norec;
            try {
                $pasienDaftar->save();
            } catch (\Exception $e) {
                $transStatus = false;
                $transMsg = "Transaksi Gagal (update Pdaf)";
            }
        }


        if ($transStatus) {
            //JURNAL
            //jurnal verif sP
            $logAcc = new  LogAcc;
            $logAcc->norec = $logAcc->generateNewId();
            $logAcc->jenistransaksi = 'Verifikasi TataRekening';
            $logAcc->noreff = $strukPelayanan->norec;
            $logAcc->status = 0;
            $logAcc->tanggal = $this->getDateTime()->format('Y-m-d H:i:s');
            try {
                $logAcc->save();
            } catch (\Exception $e) {
                $transStatus = false;
                $transMsg = "Simpan logAcc Gagal {SP}";
            }
        }
        //END jurnal verif sP
        // $saldo = ((float)$totalBilling-(float)$request['totalKlaim']);
        //DB::beginTransaction();

        //        if($transStatus && ($totalBilling>$request['totalKlaim'])){
        //            $saldoJurnal = array();
        //            $saldoJurnal[] = array(
        //                'account_id' => 1348, //Piutang Perorangan
        //                'balance'    => 'D',
        //                'saldo'      => $saldo
        //            );
        //            $saldoJurnal[] = array(
        //                'account_id' =>   1356, //Piutang Pasien dalam Pelayanan  Non BPJS
        //                'balance'    =>  'K',
        //                'saldo'      => $saldo
        //            );
        //
        //            $detailJurnal[] = array(
        //                "tgltransaksi" => $this->getDateTime(),
        //                "notransaksi" =>  $strukPelayanan->nostruk,
        //                "saldoJurnal" => $saldoJurnal,
        //                "ruanganid" => $strukPelayanan->objectruanganfk,
        //                "kelompoktransaksiid" => 1,
        //                "nobuktitransaksi" => $strukPelayanan->nostruk,
        //                "tglbuktitransaksi" => $this->getDateTime(),
        //                "keteranganlainnya" => "Verifikasi TataRekening Pasien: ".$pasienDaftar->noregistrasi." - ".$pasienDaftar->pasien->namapasien ,
        //            );
        //
        //            $jurnal = array(
        //                "noposting" => $noPosting = $this->generateCode(new PostingJurnalTransaksi, 'noposting', 14, 'BT-'.$this->getDateTime()->format('ym')),
        //                "detailJurnal" =>$detailJurnal
        //            );
        //            if($this->postingJournal($jurnal)){
        //
        //            }else{
        //                $transStatus = $this->transStatus;
        //                $transMsg= $this->transMessage;
        //            }
        //        }
        //END JURNAL

        if ($transStatus) {
            try {
                $strukPelayanan->save();
            } catch (\Exception $e) {
                $transStatus = false;
                //                $transMsg = $e->getMessage();
                //                throw new \Exception($e);
                $transMsg = "Simpan Biaya Administrasi Gagal {SP}";
            }
        }

        //JURNAL ke penjamin
        //        $detailJurnal = array();
        //        $saldo = (float)$request['totalKlaim'];
        //        $bpjsID=2552;
        //        if($transStatus && ($request['totalKlaim']>0)){
        //            if($pasienDaftar->objectkelompokpasienlastfk == $this->getKelompokPasienPerjanjian()){
        //                $account_id = 1346;//piutang perjanjian
        //                $account_lawan_id =  1356; //Piutang Pasien dalam Pelayanan  Non BPJS
        //            }else{
        //                $penjamin_id = 12;
        //                if($penjamin_id==$bpjsID){
        //                    //cari rawat inap atau tidak ini belum nyentuh ke bpjs sama sekali..
        //                    if(true){//RI
        //                        $account_id = 1359;//Piutang BPJS YBD  Rawat Inap
        //                        $account_lawan_id =  1355; //Piutang Pasien dalam Pelayanan   BPJS
        //                    }else{
        //                        $account_id = 1358;//Piutang BPJS YBD  Rawat Jalan
        //                        $account_lawan_id =  1355; //Piutang Pasien dalam Pelayanan   BPJS
        //                    }
        //
        //                }else{
        //                    $account_id = 1340;//piutang perusahan/asuransi
        //                    $account_lawan_id =  1356; //Piutang Pasien dalam Pelayanan  Non BPJS
        //                }
        //            }
        //            $saldoJurnal = array();
        //            $saldoJurnal[] = array(
        //                'account_id' =>   $account_id, //Piutang Pasien dalam Pelayanan  Non BPJS
        //                'balance'    =>  'D',
        //                'saldo'      => $saldo
        //            );
        //            $saldoJurnal[] = array(
        //                'account_id' => $account_lawan_id, //Piutang Perorangan
        //                'balance'    => 'K',
        //                'saldo'      => $saldo
        //            );
        //
        //
        //            $detailJurnal[] = array(
        //                "tgltransaksi" => $this->getDateTime(),
        //                "notransaksi" =>  $strukPelayanan->nostruk,
        //                "saldoJurnal" => $saldoJurnal,
        //                "ruanganid" => $strukPelayanan->objectruanganfk,
        //                "kelompoktransaksiid" => 1,
        //                "nobuktitransaksi" => $strukPelayanan->nostruk,
        //                "tglbuktitransaksi" => $this->getDateTime(),
        //                "keteranganlainnya" => "Verifikasi TataRekening Pasien: ".$pasienDaftar->noregistrasi." - ".$pasienDaftar->pasien->namapasien,
        //            );
        //
        //            $jurnal = array(
        //                "noposting" => $noPosting = $this->generateCode(new PostingJurnalTransaksi, 'noposting', 14, 'BT-'.$this->getDateTime()->format('ym')),
        //                "detailJurnal" =>$detailJurnal
        //            );
        //            if($this->postingJournal($jurnal)){
        //
        //            }else{
        //                $transStatus = $this->transStatus;
        //                $transMsg= $this->transMessage;
        //            }
        //        }
        //


        if ($transStatus) {
            $this->setStatusCode(201);
            $transMsg = "Transaksi Berhasil";
            //            DB::rollBack();
            DB::commit();
        } else {
            $this->setStatusCode(400);
            DB::rollBack();
        }
        return $this->respond([], $transMsg);
    }
   public function detailTagihan($noRegister, Request $request)
    {
       
        $delete = TempBilling::where('noregistrasi', $noRegister)->delete();
        // //        ini_set('max_execution_time', 3000); //6 minutes
        $dataRuangan = \DB::table('pasiendaftar_t as pd')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftjoin('antrianpasiendiperiksa_t as apd', function ($leftjoin) {
                $leftjoin->on('apd.noregistrasifk', '=', 'pd.norec');
                $leftjoin->on('apd.objectruanganfk', '=', 'pd.objectruanganlastfk');
            })
            ->leftjoin('kamar_m as km', 'km.id', '=', 'apd.objectkamarfk')
            ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('asuransipasien_m as asu', 'asu.id', '=', 'pa.objectasuransipasienfk')
            ->leftjoin('kelas_m as kl', 'kl.id', '=', 'asu.objectkelasdijaminfk')
            ->select('ru.namaruangan as namaruangan', 'km.namakamar', 'kl.namakelas')
            ->where('pd.noregistrasi', $noRegister)
            ->first();
        $riwayatinap = \DB::table('antrianpasiendiperiksa_t as apd')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->select('ru.namaruangan', 'apd.tglmasuk', 'apd.tglkeluar', 'pd.noregistrasi')
            ->where('pd.noregistrasi', $noRegister)
            ->where('ru.objectdepartemenfk', '16')
            ->where('apd.statusenabled', true)
            ->orderBy('apd.tglmasuk')
            ->get();
        $isi = "";
        foreach ($riwayatinap as $x) {
            $isi = $isi . ' ' . $x->namaruangan . ' Tgl.Masuk ' . $x->tglmasuk . ' \ ' . $x->tglkeluar . ' # ';
        }
        // return($isi);
        // die();
        $terbilangtotalBillingNonDiskon = '';
        $pelayanan = [];
        $pelayanan = \DB::table('pasiendaftar_t as pd')
            ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->leftjoin('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->leftjoin('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
            ->leftjoin('jenisproduk_m as jp', 'jp.id', '=', 'djp.objectjenisprodukfk')
            ->leftjoin('kelompokprodukbpjs_m as kpBpjs', 'kpBpjs.id', '=', 'pr.objectkelompokprodukbpjsfk')
            ->leftjoin('kelas_m as kl', 'kl.id', '=', 'apd.objectkelasfk')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('ruangan_m as ru2', 'ru2.id', '=', 'pd.objectruanganlastfk')
            ->join('pasien_m as pas', 'pas.id', '=', 'pd.nocmfk')
            ->leftjoin('agama_m as ag', 'ag.id', '=', 'pas.objectagamafk')
            ->leftjoin('jeniskelamin_m as jkel', 'jkel.id', '=', 'pas.objectjeniskelaminfk')
            ->leftjoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftjoin('kelas_m as kls', 'kls.id', '=', 'apd.objectkelasfk')
            ->leftjoin('kelas_m as kls2', 'kls2.id', '=', 'pd.objectkelasfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            ->leftjoin('pegawai_m as pgpj', 'pgpj.id', '=', 'pd.objectpegawaifk')
            ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('asuransipasien_m as asu', 'asu.id', '=', 'pa.objectasuransipasienfk')
            ->leftjoin('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
            ->leftjoin('strukresep_t as sr', 'sr.norec', '=', 'pp.strukresepfk')
            ->leftjoin('ruangan_m as rusr', 'rusr.id', '=', 'sr.ruanganfk')
            ->leftjoin('kamar_m as kamar', 'kamar.id', '=', 'apd.objectkamarfk')
            ->leftjoin('pegawai_m as pgsr', 'pgsr.id', '=', 'sr.penulisresepfk')
            ->leftjoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
            ->leftjoin('strukpelayananpenjamin_t as sppj', 'sp.norec', '=', 'sppj.nostrukfk')
            ->leftjoin('strukbuktipenerimaan_t as sbm', 'sp.nosbmlastfk', '=', 'sbm.norec')
            ->leftjoin('pegawai_m as pgsbm', 'pgsbm.id', '=', 'sbm.objectpegawaipenerimafk')
            ->select(
                'pp.norec',
                'pp.tglpelayanan',
                'pp.rke',
                'pr.id as prid',
                'pr.namaproduk',
                'pp.jumlah',
                'kl.id as klid',
                'kl.namakelas',
                'ru.id as ruid',
                'ru.namaruangan',
                'pp.produkfk',
                'pp.hargajual',
                'pp.hargadiscount',
                'sp.nostruk',
                'sp.tglstruk',
                'apd.norec as norec_apd',
                'pp.qtydetailresep',
                'pg.id as pgid',
                'pd.objectpegawaifk as pgpjid',
                'asu.objectkelasdijaminfk',
                'pd.objectkelompokpasienlastfk',
                'pg.namalengkap',
                'sbm.nosbm',
                'sp.norec as norec_sp',
                'pp.jasa',
                'pd.nocmfk',
                'ru.objectdepartemenfk as deptid',
                'pd.nocmfk',
                'pd.nostruklastfk',
                'ag.id as agid',
                'ag.agama',
                'pas.tgllahir',
                'kp.id as kpid',
                'kp.kelompokpasien',
                'pas.objectstatusperkawinanfk',
                'pas.namaayah',
                'pas.namasuamiistri',
                'pas.id as pasid',
                'pas.nocm',
                'jkel.id as jkelid',
                'jkel.jeniskelamin',
                'jkel.reportdisplay as jk',
                'pd.noregistrasi',
                'pas.namapasien',
                'pd.tglregistrasi',
                'pd.norec as norec_pd',
                'pd.tglpulang',
                'pas.notelepon',
                'kls.id as klsid',
                'kls.namakelas',
                'pd.objectrekananfk as rekananid',
                'ru2.namaruangan as ruanganlast',
                'kls2.id as klsid2',
                'kls2.namakelas as namakelas2',
                'sr.noresep',
                'rk.namarekanan',
                'rusr.namaruangan as ruanganfarmasi',
                'pgsr.namalengkap as penulisresep',
                'jp.jenisproduk',
                'kpBpjs.kelompokprodukbpjs as kelompokprodukbpjs',
                'pgpj.namalengkap as dokterpj',
                'pp.jasa',
                'kamar.namakamar',
                'sp.totalharusdibayar',
                'sp.totalprekanan',
                'sppj.totalppenjamin',
                'sp.totalbiayatambahan',
                'pgsbm.namalengkap as namalengkapsbm',
                'pd.kdprofile',
                'pp.aturanpakai',
                'pp.iscito',
                'pd.statuspasien',
                'pp.isparamedis',
                'ru2.id as ruanganlastid',
                'pa.nosep'
            )
            ->where('pd.noregistrasi', $noRegister)
            ->orderBy('pp.tglpelayanan', 'pp.rke');


        if ($request['jenisdata'] == 'resep') {
            //                if(isset($request['idruangan']) && $request['idruangan']!="" && $request['idruangan']!="undefined"){
            //                    $pelayanan = $pelayanan->where('apd.objectruanganfk',$request['idruangan']);
            //                };
            $pelayanan = $pelayanan->whereNotNull('pp.aturanpakai');
        }
        if ($request['jenisdata'] == 'layanan') {
            if (isset($request['idruangan']) && $request['idruangan'] != "" && $request['idruangan'] != "undefined") {
                $pelayanan = $pelayanan->where('apd.objectruanganfk', $request['idruangan']);
            };
            $pelayanan = $pelayanan->whereNull('pp.aturanpakai');
        }

        if(isset($request['norecverifikasi']) && $request['norecverifikasi']!="" && $request['norecverifikasi']!="undefined"){
            $pelayanan = $pelayanan->where('pp.strukfk',$request['norecverifikasi']);
        };
           
        $pelayanan = $pelayanan->get();



        // //        return $this->respond($pelayanan);

        // //        if (is_null($pelayanan[0]->kdprofile)==true){
        // //            $pelayanandetail = \DB::table('pasiendaftar_t as pd')
        // //                ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
        // //                ->join('pelayananpasiendetail_t as ppd', 'ppd.noregistrasifk', '=', 'apd.norec')
        // //                ->join('komponenharga_m as kh', 'kh.id', '=', 'ppd.komponenhargafk')
        // //                ->select('ppd.pelayananpasien as norec_pp', 'ppd.norec', 'kh.komponenharga', 'ppd.jumlah', 'ppd.hargasatuan', 'ppd.hargadiscount')
        // //                ->where('pd.noregistrasi', $noRegister)
        // //                ->orderBy('ppd.tglpelayanan')
        // //                ->get();
        // //        }

        $pelayananpetugas = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('pelayananpasienpetugas_t as ptu', 'ptu.nomasukfk', '=', 'apd.norec')
            ->join('jenispetugaspelaksana_m as jpp', 'jpp.id', '=', 'ptu.objectjenispetugaspefk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'ptu.objectpegawaifk')
            ->select('ptu.pelayananpasien', 'pg.namalengkap')
            // ->where('ptu.objectjenispetugaspefk', 4)
            ->orderBy('jpp.kodeexternal', 'desc')
            ->where('pd.noregistrasi', $noRegister)
            ->get();
        if(isset($request['norecverifikasi']) && $request['norecverifikasi']!="" && $request['norecverifikasi']!="undefined"){
            $sudahBayar = DB::select(
                DB::raw("
                select sum(sbm.totaldibayar) sudahbayar from strukbuktipenerimaan_t as sbm
                join strukpelayanan_t as sp on sbm.nostrukfk=sp.norec
                join pasiendaftar_t as pd on pd.norec=sp.noregistrasifk
                where sbm.keteranganlainnya in ('Pembayaran Tagihan Pasien','Pembayaran Cicilan Tagihan Pasien') and pd.noregistrasi=:noregistrasi and sp.norec=:norec;
                "),
                    array(
                        'noregistrasi' => $noRegister,
                        'norec'=> $request['norecverifikasi']
                    )
            );
        }else{
             $sudahBayar = DB::select(
                DB::raw("
                select sum(sbm.totaldibayar) sudahbayar from strukbuktipenerimaan_t as sbm
                join strukpelayanan_t as sp on sbm.nostrukfk=sp.norec
                join pasiendaftar_t as pd on pd.norec=sp.noregistrasifk
                where sbm.keteranganlainnya in ('Pembayaran Tagihan Pasien','Pembayaran Cicilan Tagihan Pasien') and pd.noregistrasi=:noregistrasi;
                "),
                    array(
                        'noregistrasi' => $noRegister,
                    )
            );
        }
           
       
        // // return($sudahBayar[0]->sudahbayar);
        // // die();
            if ($request['jenisdata'] == 'bill') {
                if(isset($request['norecverifikasi']) && $request['norecverifikasi']!="" && $request['norecverifikasi']!="undefined"){
                    $pelayanankelasdijamin = DB::select(
                        DB::raw("
                        select pp.norec, pd.noregistrasi,pd.objectkelasfk,kls_pd.namakelas,asp.objectkelasdijaminfk,
                        kls_dijamin.namakelas as namakelas_dijamin,pp.hargajual, case when qtydetailresep is null then pp.jumlah else qtydetailresep end as jumlah,
                        case when hnpk.harganetto2 is null then pp.hargajual else hnpk.harganetto2 end as harga_kelasdijamin
                        from pasiendaftar_t as pd
                        LEFT JOIN pemakaianasuransi_t as pas on pas.noregistrasifk=pd.norec
                        left join asuransipasien_m as asp on asp.id=pas.objectasuransipasienfk
                        left join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                        left join pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                        left join harganettoprodukbykelas_m as hnpk on hnpk.objectprodukfk=pp.produkfk and hnpk.objectkelasfk=asp.objectkelasdijaminfk
                        left join kelas_m as kls_pd on kls_pd.id=pd.objectkelasfk
                        left join kelas_m as kls_dijamin on kls_dijamin.id=asp.objectkelasdijaminfk
                        where noregistrasi=:noregistrasi and pp.strukfk=:strukfk;
                    "),
                        array(
                            'noregistrasi' => $noRegister,                            
                            'strukfk'=> $request['norecverifikasi']
                        )
                    );
                }else{
                    $pelayanankelasdijamin = DB::select(
                        DB::raw("
                        select pp.norec, pd.noregistrasi,pd.objectkelasfk,kls_pd.namakelas,asp.objectkelasdijaminfk,
                        kls_dijamin.namakelas as namakelas_dijamin,pp.hargajual, case when qtydetailresep is null then pp.jumlah else qtydetailresep end as jumlah,
                        case when hnpk.harganetto2 is null then pp.hargajual else hnpk.harganetto2 end as harga_kelasdijamin
                        from pasiendaftar_t as pd
                        LEFT JOIN pemakaianasuransi_t as pas on pas.noregistrasifk=pd.norec
                        left join asuransipasien_m as asp on asp.id=pas.objectasuransipasienfk
                        left join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                        left join pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                        left join harganettoprodukbykelas_m as hnpk on hnpk.objectprodukfk=pp.produkfk and hnpk.objectkelasfk=asp.objectkelasdijaminfk
                        left join kelas_m as kls_pd on kls_pd.id=pd.objectkelasfk
                        left join kelas_m as kls_dijamin on kls_dijamin.id=asp.objectkelasdijaminfk
                        where noregistrasi=:noregistrasi;
                    "),
                        array(
                            'noregistrasi' => $noRegister,
                        )
                    );
                }
               
            }
            $totototol = 0;
            // return($pelayanan);
            // die();
            $totalBillingNonDiskon = 0;
            $totalDiskon = 0;
        if (count($pelayanan) > 0) {
            $alamat = [];
            $alamat = \DB::table('alamat_m as al')
                ->select('al.alamatlengkap')
                ->where('al.nocmfk', $pelayanan[0]->nocmfk)
                ->first();

            if (empty($alamat)) {
                $alamatTea = '0';
            } else {
                $alamatTea = $alamat->alamatlengkap;
            }

            $totalBilling = 0;
            $totalBillingNonDiskon = 0;
            $terbilangtotalBillingNonDiskon='';
            $totalDiskon = 0;
            $norecAPD = '';
            $norecSP = '';
            $details = array();
            $dibayar = 0;
            $diverif = 0;
            foreach ($pelayanan as $value) {
                $isRawatInap = false;
                if ($value->deptid == 16) {
                    $isRawatInap = true;
                }
                if ($value->produkfk == $this->getProdukIdDeposit()) {
                    continue;
                }
                $komponen = [];
                //            if (is_null($pelayanan[0]->kdprofile)==true){
                //                foreach ($pelayanandetail as $lalala) {
                //                    if ($lalala->norec_pp == $value->norec) {
                //                        $komponen[] = array(
                //                            'norec_pp' => $lalala->norec_pp,
                //                            'norec' => $lalala->norec,
                //                            'komponenharga' => $lalala->komponenharga,
                //                            'jumlah' => $lalala->jumlah,
                //                            'hargasatuan' => $lalala->hargasatuan,
                //                            'hargadiscount' => $lalala->hargadiscount,
                //                        );
                //                    }
                //                }
                //            }


                $dokter = [];
                $NamaDokter = '-';
                // $i=1;
                // if ($request['jenisdata'] == 'resep'){
                //      $NamaDokter = $value->penulisresep;

                // }else{
                //     foreach ($pelayananpetugas as $hahaha) {
                //         // $i+$i+1;
                //         if ($hahaha->pelayananpasien == $value->norec) { 
                //             $NamaDokter = $hahaha->namalengkap;
                //         }
                //     }
                // }

                foreach ($pelayananpetugas as $hahaha) {
                    // $i+$i+1;
                    if ($hahaha->pelayananpasien == $value->norec) {
                        $NamaDokter = $hahaha->namalengkap;
                    }
                }
                if ($value->rke != NULL) {
                    $NamaDokter = $value->penulisresep;
                }

                $jasa = 0;
                if (isset($value->jasa) && $value->jasa != "" && $value->jasa != "undefined") {
                    $jasa = $value->jasa;
                }
                $kmpn = [];
                //            if (is_null($pelayanan[0]->kdprofile)==true) {
                //                foreach ($komponen as $njir) {
                //                    $kmpn[] = array(
                //                        'norec_pp' => $njir['norec_pp'],
                //                        'norec' => $njir['norec'],
                //                        'komponenharga' => $njir['komponenharga'],
                //                        'jumlah' => $njir['jumlah'],
                //                        'hargasatuan' => $njir['hargasatuan'],
                //                        'hargadiscount' => $njir['hargadiscount'],
                //                        'strukfk' => $value->nostruk . ' / ' . $value->nosbm,
                //                    );
                //                }
                //            }

                $harga = (float)$value->hargajual;
                $diskon = (float)$value->hargadiscount;
                // if($value->norec == '2f21b7e0-91e8-11eb-ad85-79dc7571'){
                //     // return($value->qtydetailresep);
                //     // die();
                //     if ($value->qtydetailresep == NULL){
                //     return('a');
                //     } else{
                //     return('b');
                //     }
                // }
                // if ($value->qtydetailresep == NULL){
                $jumlah = $value->jumlah;
                // } else{
                //     $jumlah = $value->qtydetailresep;
                // }

                $detail = array(
                    'norec' => $value->norec,
                    'tglPelayanan' => $value->tglpelayanan,
                    'namaPelayanan' => $value->namaproduk,
                    'dokter' => $NamaDokter,
                    'jumlah' => $jumlah,
                    'kelasTindakan' => @$value->namakelas,
                    'ruanganTindakan' => @$value->namaruangan,
                    'harga' => $harga,
                    'diskon' => $diskon,
                    'total' => (($harga - $diskon) * $jumlah) + $jasa,
                    'jppid' => '',
                    'jenispetugaspe' => '',
                    'strukfk' => $value->nostruk . ' / ' . $value->nosbm,
                    'sbmfk' => $value->nosbm,
                    'pgid' => '',
                    'ruid' => $value->ruid,
                    'prid' => $value->prid,
                    'klid' => $value->klid,
                    'norec_apd' => $value->norec_apd,
                    'norec_pd' => $value->norec_pd,
                    'norec_sp' => $value->norec_sp,
                    'komponen' => $kmpn,
                    'jasa' => $jasa,
                    'aturanpakai' => $value->aturanpakai,
                    'iscito' => $value->iscito,
                    'isparamedis' => $value->isparamedis
                );

                if (is_null($value->nosbm) == true) {
                    $dibayar = $dibayar + (($harga - $diskon) * $value->jumlah) + $jasa;
                }
                if (is_null($value->nostruk) == true) {
                    $diverif = $diverif + (($harga - $diskon) * $value->jumlah) + $jasa;
                }
                $norecAPD = $value->norec_apd;
                $norecSP = $value->norec_sp;
                $totalBilling = $totalBilling + (($harga - $diskon) * $value->jumlah) + $value->jasa;
                $totalBillingNonDiskon = $totalBillingNonDiskon + ($harga * $value->jumlah) + $value->jasa;
                $totalDiskon = $totalDiskon + ($diskon*$value->jumlah);
                $total =  (($harga - $diskon) * $value->jumlah) + $value->jasa;
                $details[] = $detail;

                //                $totototol = $totototol + $total;
                if ($request['jenisdata'] == 'bill') {
                    //                    $delete = TempBilling::where('noregistrasi', $noRegister)->delete();
                    $kelas_dijamin = 0;
                    $harga_dijamin = 0;
                    $total_dijamin = 0;
                    foreach ($pelayanankelasdijamin as $kupret) {
                        if ($value->norec == $kupret->norec) {
                            $kelas_dijamin = $kupret->namakelas_dijamin;
                            $harga_dijamin = $kupret->harga_kelasdijamin;
                            $total_dijamin = ((float)$kupret->harga_kelasdijamin * (float)$value->jumlah) + $value->jasa;
                        }
                    }
                    //                    try {
                    $namakelas = $value->namakelas;
                    $ruanganTindakan = $value->namaruangan;
                    $jenisprodukMaster = $value->jenisproduk;
                    // if ($value->kpid == 2) {
                    $jenisproduk = $value->kelompokprodukbpjs;
                    // } else {
                    //     $jenisproduk = $value->jenisproduk;
                    // }

                    if ($value->noresep != null) {
                        $namakelas = '';
                        $ruanganTindakan = $value->ruanganfarmasi . '     Resep No: ' . $value->noresep;
                        //                    $jenisproduk = 'Resep';
                    }
                    if ($value->namaproduk == 'Biaya Administrasi') {
                        $ruanganTindakan = $dataRuangan->namaruangan;
                    }
                    if ($value->namaproduk == 'Biaya Materai') {
                        $ruanganTindakan = $dataRuangan->namaruangan;
                    }
                    //Biaya Administrasi

                    $namarekanan = '-';
                    if ($value->namarekanan != null) {
                        $namarekanan = $value->namarekanan;
                    }
                    $namaproduk = $value->namaproduk;
                    if ($value->rke != null) {
                        $namaproduk = 'R/' . $value->rke . ' ' . $value->namaproduk;
                    }

                    $hargadiscount = 0;
                    if ($value->hargadiscount != null) {
                        $hargadiscount = $value->hargadiscount;
                    }


                    $hargakurangdiskon = (float)$value->hargajual - $hargadiscount;
                    $hargakalijml = $hargakurangdiskon * (float)$value->jumlah;
                    $jasa = 0;
                    if ($value->jasa != null) {
                        $jasa = $value->jasa;
                    }
                    $total = ((float)$jumlah * ((float)$value->hargajual - $hargadiscount)) + $jasa;


                    $namakamar = '-';
                    if ($value->namakamar != null) {
                        $namakamar = $value->namakamar;
                    }
                    $totalprekanan = 0;
                    if ($value->totalprekanan != null) {
                        $totalprekanan = $value->totalprekanan;
                    }
                    $totalppenjamin = 0;
                    if ($value->totalppenjamin != null) {
                        $totalppenjamin = $value->totalppenjamin;
                    }
                    $totalbiayatambahan = 0;
                    if ($value->totalbiayatambahan != null) {
                        $totalbiayatambahan = $value->totalbiayatambahan;
                    }
                    $totalharusdibayar = $value->totalharusdibayar;
                    if ($value->totalharusdibayar < 0) {
                        $totalharusdibayar = 0;
                    }

                    $temp = new TempBilling(); #
                    $tempNorec = $temp->generateNewId(); #
                    $temp->norec = $tempNorec; #
                    $temp->norec_pp = $value->norec; #
                    $temp->tglstruk = $value->tglstruk; #
                    $temp->nobilling = $noRegister; #
                    $temp->nokwitansi = $value->nosbm; #
                    $temp->noregistrasi = $noRegister; #
                    $temp->nocm = $value->nocm; #
                    $temp->namapasienjk = $value->namapasien . ' ( ' . $value->jk . ' )'; #
                    $temp->unit = $value->ruanganlast; #
                    $temp->objectdepartemenfk = $value->deptid; #
                    $temp->namakelas = $namakelas; #
                    $temp->dokterpj = $value->dokterpj; #
                    $temp->tglregistrasi = $value->tglregistrasi; #
                    $temp->tglpulang = $value->tglpulang; #
                    $temp->namarekanan = $namarekanan; #
                    $temp->tglpelayanan = $value->tglpelayanan; #
                    $temp->ruangantindakan = $ruanganTindakan; #
                    if ($value->iscito == 1) {
                        $temp->namaproduk = $namaproduk . ' -> CITO'; #
                    } else {
                        $temp->namaproduk = $namaproduk;
                    }

                    $temp->penulisresep = $value->penulisresep; #
                    $temp->jenisproduk = $jenisproduk; #
                    $temp->dokter = $NamaDokter; #
                    $temp->jumlah = $jumlah; #
                    $temp->hargajual = $value->hargajual; #
                    $temp->diskon = $hargadiscount; #
                    $temp->total = $total; #
                    $temp->namakamar = $namakamar; #
                    $temp->tipepasien = $value->kelompokpasien; #
                    $temp->totalharusdibayar = $totalharusdibayar; #
                    $temp->totalprekanan = $totalprekanan; #
                    $temp->totalppenjamin = $totalppenjamin; #
                    $temp->totalbiayatambahan = $totalbiayatambahan; #
                    $temp->user = $value->namalengkapsbm; #
                    $temp->namakelaspd = $value->namakelas2; #
                    $temp->nama_kelasasal = $kelas_dijamin; #
                    $temp->hargajual_kelasasal = $harga_dijamin; #
                    $temp->total_kelasasal = $total_dijamin; #
                    $temp->jenisprodukmaster = $jenisprodukMaster;
                    $temp->save();

                    //                        $transStatus = 'true';
                    //                    } catch (\Exception $e) {
                    //                        $transStatus = 'false';
                    //                        $transMessage = "Simpan TEMP";
                    //                    }
                }
            }
        }
        if(isset($request['norecverifikasi']) && $request['norecverifikasi']!="" && $request['norecverifikasi']!="undefined"){
            $dataTotalBill = DB::select(
                    DB::raw("select sum(((case when pp.hargajual is null then 0 else pp.hargajual  end - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah) + case when pp.jasa is null then 0 else pp.jasa end) as total
                        from pasiendaftar_t as pd
                        INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                        INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                        where  pd.noregistrasi=:noregistrasi and pp.produkfk not in (402611) and pp.strukfk=:strukfk;
                    "),
                    array(  
                        'noregistrasi' => $noRegister,
                        'strukfk'=>$request['norecverifikasi']
                    )
                );

        }else{
            $dataTotalBill = DB::select(
                DB::raw("select sum(((case when pp.hargajual is null then 0 else pp.hargajual  end - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah) + case when pp.jasa is null then 0 else pp.jasa end) as total
                        from pasiendaftar_t as pd
                        INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                        INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                        where  pd.noregistrasi=:noregistrasi and pp.produkfk not in (402611) ;
                    "),
                array(
                    'noregistrasi' => $noRegister
                )
            );
        }
       
        $totalBilling = 0;
        $totalBilling = $dataTotalBill[0]->total;
        $terbilang = "";
        if ($totalBilling != 0.0) {
            $terbilang = $this->makeTerbilang($totalBilling);
            // $terbilangtotalBillingNonDiskon = $this->makeTerbilang($totalBillingNonDiskon);
            $terbilangtotalBillingNonDiskon = $this->makeTerbilang($totalBilling);
        }

        if (isset($request['norecverifikasi']) && $request['norecverifikasi'] != "" && $request['norecverifikasi'] != "undefined") {
            $dataTotaldibayar = DB::select(
                        DB::raw("select sum(((case when pp.hargajual is null then 0 else pp.hargajual  end - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah) + case when pp.jasa is null then 0 else pp.jasa end) as total
                            from pasiendaftar_t as pd
                            INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                            INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                            INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                            where  pd.noregistrasi=:noregistrasi and sp.nosbmlastfk is not null and pp.produkfk not in (402611) and pp.strukfk=:strukfk;
                        "),
                        array(
                            'noregistrasi' => $noRegister,
                            'strukfk' => $request['norecverifikasi']
                        )
                    );
        }else{
            $dataTotaldibayar = DB::select(
                DB::raw("select sum(((case when pp.hargajual is null then 0 else pp.hargajual  end - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah) + case when pp.jasa is null then 0 else pp.jasa end) as total
                            from pasiendaftar_t as pd
                            INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                            INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                            INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                            where  pd.noregistrasi=:noregistrasi and sp.nosbmlastfk is not null and pp.produkfk not in (402611);
                        "),
                array(
                    'noregistrasi' => $noRegister,
                )
            );
        }
        
       
        $dibayar = 0;
        $dibayar = $dataTotaldibayar[0]->total;
        if (isset($request['norecverifikasi']) && $request['norecverifikasi'] != "" && $request['norecverifikasi'] != "undefined") {
            
            $dataTotalverif = DB::select(
                DB::raw("select sum(((case when pp.hargajual is null then 0 else pp.hargajual  end - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah) + case when pp.jasa is null then 0 else pp.jasa end) as total
                    from pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                    INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                    where  pd.noregistrasi=:noregistrasi and pp.strukfk is not null and pp.produkfk not in (402611) and pp.strukfk=:strukfk
                "),
                array(
                    'noregistrasi' => $noRegister,
                    'strukfk' => $request['norecverifikasi']
                )
            );
        }else{
                 $dataTotalverif = DB::select(
                DB::raw("select sum(((case when pp.hargajual is null then 0 else pp.hargajual  end - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah) + case when pp.jasa is null then 0 else pp.jasa end) as total
                    from pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                    INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                    where  pd.noregistrasi=:noregistrasi and pp.strukfk is not null and pp.produkfk not in (402611)
                "),
                array(
                    'noregistrasi' => $noRegister
                )
            );
        }
        $diverif = 0;
        $diverif = $dataTotalverif[0]->total;


        if (count($pelayanan) > 0) {
            $komponen = [];
            if ($pelayanan[0]->nostruklastfk == null  && $isRawatInap) {
                $biayaAdministrasi = number_format($totalBilling * $this->getPercentageBiayaAdmin(), 0, '', '');
                //                $detail = array(
                //                    'norec' => 'norecAdmin',
                //                    'tglPelayanan' => Carbon::now()->toDateString(),
                //                    'namaPelayanan' => $this->getProdukBiayaAdministrasi()->namaproduk,
                //                    'dokter' => '-',
                //                    'jumlah' => 1,
                //                    'kelasTindakan' => '',
                //                    'ruanganTindakan' => '',
                //                    'harga' => $biayaAdministrasi,
                //                    'diskon' => 0,
                //                    'total' => $biayaAdministrasi,
                //                    'strukfk' => null,
                //                    'sbmfk' => null,
                //                    'pgid' => '-',
                //                    'ruid' => '-',
                //                    'prid' => '-',
                //                    'klid' => '-',
                //                    'norec_apd' => $norecAPD,
                //                    'norec_sp' => $norecSP,
                //                    'komponen' => $komponen,
                //                    'jasa' => 0,
                //                    'aturanpakai' => null,
                //                );
                //                $totalBilling += $biayaAdministrasi;
                //                if ($biayaAdministrasi > 0) {
                //                    $details[] = $detail;
                //                }

                $biayaMaterai = $this->getBiayaMaterai($totalBilling);
                //                $detail = array(
                //                    'norec' => 'norecMaterai',
                //                    'tglPelayanan' => Carbon::now()->toDateString(),
                //                    'namaPelayanan' => $this->getProdukBiayaMaterai()->namaproduk,
                //                    'dokter' => '-',
                //                    'jumlah' => 1,
                //                    'kelasTindakan' => '',
                //                    'ruanganTindakan' => '',
                //                    'harga' => $biayaMaterai,
                //                    'diskon' => 0,
                //                    'total' => $biayaMaterai,
                //                    'strukfk' => null,
                //                    'sbmfk' => null,
                //                    'pgid' => '-',
                //                    'ruid' => '-',
                //                    'prid' => '-',
                //                    'klid' => '-',
                //                    'norec_apd' => $norecAPD,
                //                    'norec_sp' => $norecSP,
                //                    'komponen' => $komponen,
                //                    'jasa' => 0,
                //                    'aturanpakai' => null,
                //                );

                //                $totalBilling += $biayaMaterai;
                //                if ($biayaMaterai > 0) {
                //                    $details[] = $detail;
                //                }

            }
            if (count($pelayanan) == 0) {
                empty($details);
            }


            try {
                $rekanan = [];
                $rekanan = \DB::table('rekanan_m as al')
                    ->select('al.namarekanan')
                    ->where('al.id', $pelayanan[0]->rekananid)
                    ->first();
                $penjamin = $rekanan->namarekanan;
            } catch (\Exception $e) {
                $penjamin = '-';
            }
            try {
                $kelompokPasien = $pelayanan[0]->kelompokpasien;
            } catch (\Exception $e) {
                $kelompokPasien = '-';
            }

            try {
                $agama = $pelayanan[0]->agama;
                $nosep = $pelayanan[0]->nosep;
            } catch (\Exception $e) {
                $agama = '-';
                $nosep = '-';
            }
            try {
                $umur = $this->hitungUmur($pelayanan[0]->tgllahir);
            } catch (\Exception $e) {
                $umur = '-';
            }

            $keluarga = '-';
            try {
                if ($pelayanan[0]->objectstatusperkawinanfk == '1') {
                    $keluarga = $pelayanan[0]->namaayah;
                } else {
                    $keluarga = $pelayanan[0]->namasuamiistri;
                }
            } catch (\Exception $e) {
                $keluarga = '-';
            }

            $result = array(
                'pasienID' => $pelayanan[0]->pasid,
                'noCm' => $pelayanan[0]->nocm,
                'jenisKelamin' => $pelayanan[0]->jeniskelamin,
                'noRegistrasi' => $pelayanan[0]->noregistrasi,
                'namaPasien' => $pelayanan[0]->namapasien,
                'lastRuangan' => $pelayanan[0]->ruanganlast,
                'tglMasuk' => $pelayanan[0]->tglregistrasi,
                'tglPulang' => $pelayanan[0]->tglpulang,
                'jenisPasien' => $kelompokPasien,
                'kelasRawat' => $pelayanan[0]->namakelas2,
                'kelasId' => $pelayanan[0]->klsid2,
                'noAsuransi' => '-',
                'kelasPenjamin' => $dataRuangan->namakelas,
                'namaPenjamin' => $penjamin,
                'penjamin' => $penjamin,
                'deposit' => $this->getDepositPasien($pelayanan[0]->noregistrasi),
                'totalKlaim' => 0,
                'jumlahBayar' => 0,
                'jumlahPiutang' => 0,
                'billing' => $totalBilling,
                'norec_pd' => $pelayanan[0]->norec_pd,
                'norec_apd' => $pelayanan[0]->norec_apd,
                'strukfk' => $value->nostruk,
                'telepon' => $pelayanan[0]->notelepon,
                'alamat' => $alamatTea,
                'tgllahir' => $pelayanan[0]->tgllahir,
                'agama' => $agama,
                'umur' => $umur,
                'keluarga' => $keluarga,
                'details' => $details,
                'deptid' => $pelayanan[0]->deptid,
                'pgpjid' => $pelayanan[0]->pgpjid,
                'objectkelasdijaminfk' => $pelayanan[0]->objectkelasdijaminfk,
                'objectkelompokpasienlastfk' => $pelayanan[0]->objectkelompokpasienlastfk,
                'lalal' => $pelayanan[0]->nostruklastfk,
                '$isRawatInap' => $isRawatInap,
                'diverif' => $diverif,
                'dibayar' => $dibayar,
                'statuspasien' => $pelayanan[0]->statuspasien,
                'ruanganlastid' => $pelayanan[0]->ruanganlastid,
                'namakamar' => $dataRuangan->namakamar,
                'isi' => $isi,
                'terbilang' => $terbilang,
                'nosep' => $nosep,
                'sudahbayar' => $sudahBayar[0]->sudahbayar,
                'totalDiskon'=>$totalDiskon,
                'totalBillingNonDiskon'=>$totalBillingNonDiskon,
                'terbilangtotalBillingNonDiskon'=>$terbilangtotalBillingNonDiskon,
                'dokterpj'=>$pelayanan[0]->dokterpj
            );
        }
         else {
            $pelayanan = \DB::table('pasiendaftar_t as pd')
                ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
                ->leftjoin('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
                ->leftjoin('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
                ->leftjoin('jenisproduk_m as jp', 'jp.id', '=', 'djp.objectjenisprodukfk')
                ->leftjoin('kelompokprodukbpjs_m as kpBpjs', 'kpBpjs.id', '=', 'pr.objectkelompokprodukbpjsfk')
                ->leftjoin('kelas_m as kl', 'kl.id', '=', 'apd.objectkelasfk')
                ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                ->join('ruangan_m as ru2', 'ru2.id', '=', 'pd.objectruanganlastfk')
                ->join('pasien_m as pas', 'pas.id', '=', 'pd.nocmfk')
                ->leftjoin('agama_m as ag', 'ag.id', '=', 'pas.objectagamafk')
                ->leftjoin('jeniskelamin_m as jkel', 'jkel.id', '=', 'pas.objectjeniskelaminfk')
                ->leftjoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
                ->leftjoin('kelas_m as kls', 'kls.id', '=', 'apd.objectkelasfk')
                ->leftjoin('kelas_m as kls2', 'kls2.id', '=', 'pd.objectkelasfk')
                ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
                ->leftjoin('pegawai_m as pgpj', 'pgpj.id', '=', 'pd.objectpegawaifk')
                ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
                ->leftjoin('asuransipasien_m as asu', 'asu.id', '=', 'pa.objectasuransipasienfk')
                ->leftjoin('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
                ->leftjoin('strukresep_t as sr', 'sr.norec', '=', 'pp.strukresepfk')
                ->leftjoin('ruangan_m as rusr', 'rusr.id', '=', 'sr.ruanganfk')
                ->leftjoin('kamar_m as kamar', 'kamar.id', '=', 'apd.objectkamarfk')
                ->leftjoin('pegawai_m as pgsr', 'pgsr.id', '=', 'sr.penulisresepfk')
                ->leftjoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
                ->leftjoin('strukpelayananpenjamin_t as sppj', 'sp.norec', '=', 'sppj.nostrukfk')
                ->leftjoin('strukbuktipenerimaan_t as sbm', 'sp.nosbmlastfk', '=', 'sbm.norec')
                ->leftjoin('pegawai_m as pgsbm', 'pgsbm.id', '=', 'sbm.objectpegawaipenerimafk')
                ->select(
                    'pp.norec',
                    'pp.tglpelayanan',
                    'pp.rke',
                    'pr.id as prid',
                    'pr.namaproduk',
                    'pp.jumlah',
                    'kl.id as klid',
                    'kl.namakelas',
                    'pd.objectpegawaifk as pgpjid',
                    'asu.objectkelasdijaminfk',
                    'pd.objectkelompokpasienlastfk',
                    'ru.id as ruid',
                    'ru.namaruangan',
                    'pp.produkfk',
                    'pp.hargajual',
                    'pp.hargadiscount',
                    'sp.nostruk',
                    'sp.tglstruk',
                    'apd.norec as norec_apd',
                    'pg.id as pgid',
                    'pg.namalengkap',
                    'sbm.nosbm',
                    'sp.norec as norec_sp',
                    'pp.jasa',
                    'pd.nocmfk',
                    'ru2.objectdepartemenfk as deptid',
                    'pd.nocmfk',
                    'pd.nostruklastfk',
                    'ag.id as agid',
                    'ag.agama',
                    'pas.tgllahir',
                    'kp.id as kpid',
                    'kp.kelompokpasien',
                    'pas.objectstatusperkawinanfk',
                    'pas.namaayah',
                    'pas.namasuamiistri',
                    'pas.id as pasid',
                    'pas.nocm',
                    'jkel.id as jkelid',
                    'jkel.jeniskelamin',
                    'jkel.reportdisplay as jk',
                    'pd.noregistrasi',
                    'pas.namapasien',
                    'pd.tglregistrasi',
                    'pd.norec as norec_pd',
                    'pd.tglpulang',
                    'pas.notelepon',
                    'kls.id as klsid',
                    'kls.namakelas',
                    'pd.objectrekananfk as rekananid',
                    'ru2.namaruangan as ruanganlast',
                    'kls2.id as klsid2',
                    'kls2.namakelas as namakelas2',
                    'sr.noresep',
                    'rk.namarekanan',
                    'rusr.namaruangan as ruanganfarmasi',
                    'pgsr.namalengkap as penulisresep',
                    'jp.jenisproduk',
                    'kpBpjs.kelompokprodukbpjs as kelompokprodukbpjs',
                    'pgpj.namalengkap as dokterpj',
                    'pp.jasa',
                    'kamar.namakamar',
                    'sp.totalharusdibayar',
                    'sp.totalprekanan',
                    'sppj.totalppenjamin',
                    'sp.totalbiayatambahan',
                    'pgsbm.namalengkap as namalengkapsbm',
                    'pd.kdprofile',
                    'pp.aturanpakai',
                    'pd.statuspasien',
                    'ru2.id as ruanganlastid',
                    'pa.nosep'
                )
                ->where('pd.noregistrasi', $noRegister)
                ->orderBy('pp.tglpelayanan', 'pp.rke');
                if(isset($request['norecverifikasi']) && $request['norecverifikasi']!="" && $request['norecverifikasi']!="undefined"){
                    $pelayanan = $pelayanan->where('pp.strukfk',$request['norecverifikasi']);
                };
           

        //     //            if(isset($request['idruangan']) && $request['idruangan']!="" && $request['idruangan']!="undefined"){
        //     //                $pelayanan = $pelayanan->where('apd.objectruanganfk',$request['idruangan']);
        //     //            };
            $pelayanan = $pelayanan->first();

            $isRawatInap = false;
            if ($pelayanan->deptid == 16) {
                $isRawatInap = true;
            }

            $alamat = [];
            $alamat = \DB::table('alamat_m as al')
                ->select('al.alamatlengkap')
                ->where('al.nocmfk', $pelayanan->nocmfk)
                ->get();

            if (count($alamat) == 0) {
                $alamatTea = '0';
            } else {
                $alamatTea = $alamat[0]->alamatlengkap;
            }
            try {
                $rekanan = [];
        //         //                $rekanan = \DB::table('rekanan_m as al')
        //         //                    ->select('al.namarekanan')
        //         //                    ->where('al.id', $pelayanan[0]->rekananid)
        //         //                    ->first();
                $penjamin = $pelayanan->namarekanan;
            } catch (\Exception $e) {
                $penjamin = '-';
            }
            try {
                $kelompokPasien = $pelayanan->kelompokpasien;
            } catch (\Exception $e) {
                $kelompokPasien = '-';
            }

            try {
                $agama = $pelayanan->agama;
                $nosep = $pelayanan->nosep;
            } catch (\Exception $e) {
                $agama = '-';
                $nosep = '-';
            }
            try {
                $umur = $this->hitungUmur($pelayanan->tgllahir);
            } catch (\Exception $e) {
                $umur = '-';
            }

            $keluarga = '-';
            try {
                if ($pelayanan->objectstatusperkawinanfk == '1') {
                    $keluarga = $pelayanan->namaayah;
                } else {
                    $keluarga = $pelayanan->namasuamiistri;
                }
            } catch (\Exception $e) {
                $keluarga = '-';
            }


            $result = array(
                'pasienID' => $pelayanan->pasid,
                'noCm' => $pelayanan->nocm,
                'jenisKelamin' => $pelayanan->jeniskelamin,
                'noRegistrasi' => $pelayanan->noregistrasi,
                'namaPasien' => $pelayanan->namapasien,
                'lastRuangan' => $pelayanan->ruanganlast,
                'tglMasuk' => $pelayanan->tglregistrasi,
                'tglPulang' => $pelayanan->tglpulang,
                'jenisPasien' => $kelompokPasien,
                'kelasRawat' => $pelayanan->namakelas2,
                'kelasId' => $pelayanan->klsid2,
                'noAsuransi' => '-',
                'kelasPenjamin' => $dataRuangan->namakelas,
                'namaPenjamin' => $penjamin,
                'penjamin' => $penjamin,
                'deposit' => $this->getDepositPasien($pelayanan->noregistrasi),
                'totalKlaim' => 0,
                'jumlahBayar' => 0,
                'jumlahPiutang' => 0,
                'billing' => $totalBilling,
                'norec_pd' => $pelayanan->norec_pd,
                'norec_apd' => $pelayanan->norec_apd,
                'strukfk' => $pelayanan->nostruk,
                'telepon' => $pelayanan->notelepon,
                'alamat' => $alamatTea,
                'tgllahir' => $pelayanan->tgllahir,
                'agama' => $agama,
                'deptid' => $pelayanan->deptid,
                'pgpjid' => $pelayanan->pgpjid,
                'objectkelasdijaminfk' => $pelayanan->objectkelasdijaminfk,
                'objectkelompokpasienlastfk' => $pelayanan->objectkelompokpasienlastfk,
                'umur' => $umur,
                'keluarga' => $keluarga,
                'details' => [],
                'lalal' => $pelayanan->nostruklastfk,
                '$isRawatInap' => $isRawatInap,
                'diverif' => $diverif,
                'dibayar' => $dibayar,
                'statuspasien' => $pelayanan->ruanganlastid,
                'ruanganlastid' => $pelayanan->ruanganlastid,
                'namakamar' => $dataRuangan->namakamar,
                'isi' => $isi,
                'terbilang' => $terbilang,
                'nosep' => $nosep,
                'sudahbayar' => $sudahBayar[0]->sudahbayar,
                'totalDiskon'=>$totalDiskon,
                'totalBillingNonDiskon'=>$totalBillingNonDiskon,
                'terbilangtotalBillingNonDiskon'=>$terbilangtotalBillingNonDiskon,
                'dokterpj'=>$pelayanan->dokterpj
            );

            //            $result = array(
            //                'pasienID' => '',
            //                'noCm' => '',
            //                'jenisKelamin' => '',
            //                'noRegistrasi' => $noRegister,
            //                'namaPasien' => '',
            //                'lastRuangan' => '',
            //                'tglMasuk' => '',
            //                'tglPulang' => '',
            //                'jenisPasien' => '',
            //                'kelasRawat' => '',
            //                'kelasId' => '',
            //                'noAsuransi' => '-',
            //                'kelasPenjamin' => '-',
            //                'namaPenjamin' => '',
            //                'penjamin' => '',
            //                'deposit' => '',
            //                'totalKlaim' => 0,
            //                'jumlahBayar' => 0,
            //                'jumlahPiutang' => 0,
            //                'billing' => '',
            //                'norec_pd' =>'',
            //                'telepon' => '',
            //                'alamat' => '',
            //                'tgllahir' => '',
            //                'agama' => '',
            //                'umur' => '',
            //                'keluarga' => '',
            //                'details' => '',
            //                'lalal' => '',
            //                '$isRawatInap' => '',
            //                'diverif' => '',
            //                'dibayar' => '',
            //            );
        }
        return $this->respond($result);
    }
    public function detailTagihanEMR($noRegister, Request $request)
    {
        $pelayanan = [];
        $pelayanan = \DB::table('pasiendaftar_t as pd')
            ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->leftjoin('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->leftjoin('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
            ->leftjoin('jenisproduk_m as jp', 'jp.id', '=', 'djp.objectjenisprodukfk')
            ->leftjoin('kelompokprodukbpjs_m as kpBpjs', 'kpBpjs.id', '=', 'pr.objectkelompokprodukbpjsfk')
            ->leftjoin('kelas_m as kl', 'kl.id', '=', 'apd.objectkelasfk')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('ruangan_m as ru2', 'ru2.id', '=', 'pd.objectruanganlastfk')
            ->join('pasien_m as pas', 'pas.id', '=', 'pd.nocmfk')
            ->leftjoin('agama_m as ag', 'ag.id', '=', 'pas.objectagamafk')
            ->leftjoin('jeniskelamin_m as jkel', 'jkel.id', '=', 'pas.objectjeniskelaminfk')
            ->leftjoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftjoin('kelas_m as kls', 'kls.id', '=', 'apd.objectkelasfk')
            ->leftjoin('kelas_m as kls2', 'kls2.id', '=', 'pd.objectkelasfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            ->leftjoin('pegawai_m as pgpj', 'pgpj.id', '=', 'pd.objectpegawaifk')
            ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('asuransipasien_m as asu', 'asu.id', '=', 'pa.objectasuransipasienfk')
            ->leftjoin('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
            ->leftjoin('strukresep_t as sr', 'sr.norec', '=', 'pp.strukresepfk')
            ->leftjoin('ruangan_m as rusr', 'rusr.id', '=', 'sr.ruanganfk')
            ->leftjoin('kamar_m as kamar', 'kamar.id', '=', 'apd.objectkamarfk')
            ->leftjoin('pegawai_m as pgsr', 'pgsr.id', '=', 'sr.penulisresepfk')
            ->leftjoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
            ->leftjoin('strukpelayananpenjamin_t as sppj', 'sp.norec', '=', 'sppj.nostrukfk')
            ->leftjoin('strukbuktipenerimaan_t as sbm', 'sp.nosbmlastfk', '=', 'sbm.norec')
            ->leftjoin('pegawai_m as pgsbm', 'pgsbm.id', '=', 'sbm.objectpegawaipenerimafk')
            ->select(
                'pp.norec',
                'pp.tglpelayanan',
                'pp.rke',
                'pr.id as prid',
                'pr.namaproduk',
                'pp.jumlah',
                'kl.id as klid',
                'kl.namakelas',
                'ru.id as ruid',
                'ru.namaruangan',
                'pp.produkfk',
                'pp.hargajual',
                'pp.hargadiscount',
                'pp.isobat',
                'sp.nostruk',
                'sp.tglstruk',
                'apd.norec as norec_apd',
                'pp.qtydetailresep',
                'pg.id as pgid',
                'pd.objectpegawaifk as pgpjid',
                'asu.objectkelasdijaminfk',
                'pd.objectkelompokpasienlastfk',
                'pg.namalengkap',
                'sbm.nosbm',
                'sp.norec as norec_sp',
                'pp.jasa',
                'pd.nocmfk',
                'ru.objectdepartemenfk as deptid',
                'ru2.objectdepartemenfk as deptidlast',
                'pd.nocmfk',
                'pd.nostruklastfk',
                'ag.id as agid',
                'ag.agama',
                'pas.tgllahir',
                'kp.id as kpid',
                'kp.kelompokpasien',
                'pas.objectstatusperkawinanfk',
                'pas.namaayah',
                'pas.namasuamiistri',
                'pas.id as pasid',
                'pas.nocm',
                'jkel.id as jkelid',
                'jkel.jeniskelamin',
                'jkel.reportdisplay as jk',
                'pd.noregistrasi',
                'pas.namapasien',
                'pd.tglregistrasi',
                'pd.norec as norec_pd',
                'pd.tglpulang',
                'pas.notelepon',
                'kls.id as klsid',
                'kls.namakelas',
                'pd.objectrekananfk as rekananid',
                'ru2.namaruangan as ruanganlast',
                'kls2.id as klsid2',
                'kls2.namakelas as namakelas2',
                'sr.noresep',
                'rk.namarekanan',
                'rusr.namaruangan as ruanganfarmasi',
                'pgsr.namalengkap as penulisresep',
                'jp.jenisproduk',
                'kpBpjs.kelompokprodukbpjs as kelompokprodukbpjs',
                'pgpj.namalengkap as dokterpj',
                'pp.jasa',
                'kamar.namakamar',
                'sp.totalharusdibayar',
                'sp.totalprekanan',
                'sppj.totalppenjamin',
                'sp.totalbiayatambahan',
                'pgsbm.namalengkap as namalengkapsbm',
                'pd.kdprofile',
                'pp.aturanpakai',
                'pp.iscito',
                'pd.statuspasien',
                'pp.isparamedis',
                'ru2.id as ruanganlastid',
                'pa.nosep'
            )
            ->where('pd.noregistrasi', $noRegister)
            ->orderBy('pp.tglpelayanan', 'pp.rke');



        // if ($request['jenisdata'] == 'layanan') {
        // if (isset($request['idruangan']) && $request['idruangan'] != "" && $request['idruangan'] != "undefined") {
        $pelayanan = $pelayanan->whereIn('apd.objectruanganfk', array(575, 576));
        // $users = User::whereIn('id', array(1, 2, 3))->get();
        // };
        $pelayanan = $pelayanan->whereNull('sr.noresep');
        // }
        $pelayanan = $pelayanan->get();

        return $this->respond($pelayanan);
    }
    public function detailTagihan2($noRegister, Request $request)
    {
        // $delete = TempBilling::where('noregistrasi', $noRegister)->delete();
        //        ini_set('max_execution_time', 3000); //6 minutes
        $dataRuangan = \DB::table('pasiendaftar_t as pd')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftjoin('antrianpasiendiperiksa_t as apd', function ($leftjoin) {
                $leftjoin->on('apd.noregistrasifk', '=', 'pd.norec');
                $leftjoin->on('apd.objectruanganfk', '=', 'pd.objectruanganlastfk');
            })
            ->leftjoin('kamar_m as km', 'km.id', '=', 'apd.objectkamarfk')
            ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('asuransipasien_m as asu', 'asu.id', '=', 'pa.objectasuransipasienfk')
            ->leftjoin('kelas_m as kl', 'kl.id', '=', 'asu.objectkelasdijaminfk')
            ->leftjoin('kendalidokumenrekammedis_t as kdr', 'kdr.noregistrasifk', '=', 'apd.norec')
            ->leftjoin('statuskendalidokumen_m as skd', 'skd.id', '=', 'kdr.objectstatuskendalidokumenfk')
            ->select(
                'ru.namaruangan as namaruangan',
                'km.namakamar',
                'kl.namakelas',
                DB::raw('case when skd.namaexternal is null then \'Belum Di Kirim\' else skd.namaexternal end as namekendali')
            )
            ->where('pd.noregistrasi', (string)$noRegister)
            ->orderBy('apd.tglmasuk', 'asc')
            ->first();
        $riwayatinap = \DB::table('antrianpasiendiperiksa_t as apd')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->select('ru.namaruangan', 'apd.tglmasuk', 'apd.tglkeluar', 'pd.noregistrasi')
            ->where('pd.noregistrasi', (string)$noRegister)
            ->where('ru.objectdepartemenfk', '16')
            ->where('apd.statusenabled', true)
            ->orderBy('apd.tglmasuk')
            ->get();
        $isi = "";
        foreach ($riwayatinap as $x) {
            $isi = $isi . '
                #' . $x->namaruangan . ' Tgl.Masuk ' . $x->tglmasuk . ' \ ' . $x->tglkeluar . ' # ';
        }
        $pelayanan = [];
        $pelayanan = \DB::table('pasiendaftar_t as pd')
            ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->leftjoin('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->leftjoin('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
            ->leftjoin('jenisproduk_m as jp', 'jp.id', '=', 'djp.objectjenisprodukfk')
            ->leftjoin('kelompokprodukbpjs_m as kpBpjs', 'kpBpjs.id', '=', 'pr.objectkelompokprodukbpjsfk')
            ->leftjoin('kelas_m as kl', 'kl.id', '=', 'apd.objectkelasfk')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('ruangan_m as ru2', 'ru2.id', '=', 'pd.objectruanganlastfk')
            ->join('pasien_m as pas', 'pas.id', '=', 'pd.nocmfk')
            ->leftjoin('agama_m as ag', 'ag.id', '=', 'pas.objectagamafk')
            ->leftjoin('jeniskelamin_m as jkel', 'jkel.id', '=', 'pas.objectjeniskelaminfk')
            ->leftjoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftjoin('kelas_m as kls', 'kls.id', '=', 'apd.objectkelasfk')
            ->leftjoin('kelas_m as kls2', 'kls2.id', '=', 'pd.objectkelasfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            ->leftjoin('pegawai_m as pgpj', 'pgpj.id', '=', 'pd.objectpegawaifk')
            ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('asuransipasien_m as asu', 'asu.id', '=', 'pa.objectasuransipasienfk')
            ->leftjoin('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
            ->leftjoin('strukresep_t as sr', 'sr.norec', '=', 'pp.strukresepfk')
            ->leftjoin('ruangan_m as rusr', 'rusr.id', '=', 'sr.ruanganfk')
            ->leftjoin('kamar_m as kamar', 'kamar.id', '=', 'apd.objectkamarfk')
            ->leftjoin('pegawai_m as pgsr', 'pgsr.id', '=', 'sr.penulisresepfk')
            ->leftjoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
            ->leftjoin('strukpelayananpenjamin_t as sppj', 'sp.norec', '=', 'sppj.nostrukfk')
            ->leftjoin('strukbuktipenerimaan_t as sbm', 'sp.nosbmlastfk', '=', 'sbm.norec')
            ->leftjoin('pegawai_m as pgsbm', 'pgsbm.id', '=', 'sbm.objectpegawaipenerimafk')
            // ->leftjoin('KendaliDokumenRekamMedis_t as kdr', 'kdr.noregistrasifk', '=', 'apd.norec')
            // ->leftjoin('statuskendalidokumen_m as skd', 'skd.id', '=', 'kdr.objectstatuskendalidokumenfk')
            ->select(
                'pp.norec',
                'pp.tglpelayanan',
                'pp.rke',
                'pr.id as prid',
                'pr.namaproduk',
                'pp.jumlah',
                'kl.id as klid',
                'kl.namakelas',
                'ru.id as ruid',
                'ru.objectdepartemenfk',
                'ru.namaruangan',
                'pp.produkfk',
                'pp.hargajual',
                'pp.hargadiscount',
                'pp.isobat',
                'sp.nostruk',
                'sp.tglstruk',
                'apd.norec as norec_apd',
                'pp.qtydetailresep',
                'pg.id as pgid',
                'pd.objectpegawaifk as pgpjid',
                'asu.objectkelasdijaminfk',
                'pd.objectkelompokpasienlastfk',
                'pg.namalengkap',
                'sbm.nosbm',
                'sp.norec as norec_sp',
                'pp.jasa',
                'pd.nocmfk',
                'ru.objectdepartemenfk as deptid',
                'ru2.objectdepartemenfk as deptidlast',
                'pd.nocmfk',
                'pd.nostruklastfk',
                'ag.id as agid',
                'ag.agama',
                'pas.tgllahir',
                'kp.id as kpid',
                'kp.kelompokpasien',
                'pas.objectstatusperkawinanfk',
                'pas.namaayah',
                'pas.namasuamiistri',
                'pas.id as pasid',
                'pas.nocm',
                'jkel.id as jkelid',
                'jkel.jeniskelamin',
                'jkel.reportdisplay as jk',
                'pd.noregistrasi',
                'pas.namapasien',
                'pd.tglregistrasi',
                'pd.norec as norec_pd',
                'pd.tglpulang',
                'pas.notelepon',
                'kls.id as klsid',
                'kls.namakelas',
                'pd.objectrekananfk as rekananid',
                'ru2.namaruangan as ruanganlast',
                'kls2.id as klsid2',
                'kls2.namakelas as namakelas2',
                'sr.noresep',
                'rk.namarekanan',
                'rusr.namaruangan as ruanganfarmasi',
                'pgsr.namalengkap as penulisresep',
                'jp.jenisproduk',
                'kpBpjs.kelompokprodukbpjs as kelompokprodukbpjs',
                'pgpj.namalengkap as dokterpj',
                'pp.jasa',
                'kamar.namakamar',
                'sp.totalharusdibayar',
                'sp.totalprekanan',
                'sppj.totalppenjamin',
                'sp.totalbiayatambahan',
                'pgsbm.namalengkap as namalengkapsbm',
                'pd.kdprofile',
                'pp.aturanpakai',
                'pp.iscito',
                'pd.statuspasien',
                'pp.isparamedis',
                'ru2.id as ruanganlastid',
                'pa.nosep'
                // DB::raw('case when skd.namaexternal is null then \'Belum Di Kirim\' else skd.namaexternal end as namekendali')
            )
            ->where('pd.noregistrasi', $noRegister)
            ->orderBy('pp.tglpelayanan', 'pp.rke');


        if ($request['jenisdata'] == 'resep') {
            $pelayanan = $pelayanan->whereNotNull('pp.aturanpakai');
        }
        if ($request['jenisdata'] == 'layanan') {
            if (isset($request['idruangan']) && $request['idruangan'] != "" && $request['idruangan'] != "undefined") {
                $pelayanan = $pelayanan->where('apd.objectruanganfk', $request['idruangan']);
            };
            $pelayanan = $pelayanan->whereNull('pp.aturanpakai');
        }
        $pelayanan = $pelayanan->get();



        $pelayananpetugas = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('pelayananpasienpetugas_t as ptu', 'ptu.nomasukfk', '=', 'apd.norec')
            ->join('jenispetugaspelaksana_m as jpp', 'jpp.id', '=', 'ptu.objectjenispetugaspefk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'ptu.objectpegawaifk')
            ->select('ptu.pelayananpasien', 'pg.namalengkap')
            // ->where('ptu.objectjenispetugaspefk', 4)
            ->orderBy('jpp.kodeexternal', 'desc')
            ->where('pd.noregistrasi', $noRegister)
            ->get();

        $sudahBayar = DB::select(
            DB::raw("
            select sum(sbm.totaldibayar) sudahbayar from strukbuktipenerimaan_t as sbm
            join strukpelayanan_t as sp on sbm.nostrukfk=sp.norec
            join pasiendaftar_t as pd on pd.norec=sp.noregistrasifk
            where pd.noregistrasi=:noregistrasi;
            "),
            array(
                'noregistrasi' => $noRegister,
            )
        );
        if ($request['jenisdata'] == 'bill') {
            $pelayanankelasdijamin = DB::select(
                DB::raw("
                select pp.norec, pd.noregistrasi,pd.objectkelasfk,kls_pd.namakelas,asp.objectkelasdijaminfk,
                kls_dijamin.namakelas as namakelas_dijamin,pp.hargajual, case when qtydetailresep is null then pp.jumlah else qtydetailresep end as jumlah,
                case when hnpk.harganetto2 is null then pp.hargajual else hnpk.harganetto2 end as harga_kelasdijamin
                from pasiendaftar_t as pd
                LEFT JOIN pemakaianasuransi_t as pas on pas.noregistrasifk=pd.norec
                left join asuransipasien_m as asp on asp.id=pas.objectasuransipasienfk
                left join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                left join pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                left join harganettoprodukbykelas_m as hnpk on hnpk.objectprodukfk=pp.produkfk and hnpk.objectkelasfk=asp.objectkelasdijaminfk
                left join kelas_m as kls_pd on kls_pd.id=pd.objectkelasfk
                left join kelas_m as kls_dijamin on kls_dijamin.id=asp.objectkelasdijaminfk
                where noregistrasi=:noregistrasi;
            "),
                array(
                    'noregistrasi' => $noRegister,
                )
            );
        }
        $totototol = 0;
        if (count($pelayanan) > 0) {
            $alamat = [];
            $alamat = \DB::table('alamat_m as al')
                ->select('al.alamatlengkap')
                ->where('al.nocmfk', $pelayanan[0]->nocmfk)
                ->first();

            if (empty($alamat)) {
                $alamatTea = '0';
            } else {
                $alamatTea = $alamat->alamatlengkap;
            }

            $totalBilling = 0;
            $norecAPD = '';
            $norecSP = '';
            $details = array();
            $dibayar = 0;
            $diverif = 0;
            foreach ($pelayanan as $value) {
                $isRawatInap = false;
                if ($value->deptid == 16) {
                    $isRawatInap = true;
                }
                if ($value->produkfk == $this->getProdukIdDeposit()) {
                    continue;
                }
                $komponen = [];
                $dokter = [];
                $NamaDokter = '-';
                foreach ($pelayananpetugas as $hahaha) {
                    // $i+$i+1;
                    if ($hahaha->pelayananpasien == $value->norec) {
                        $NamaDokter = $hahaha->namalengkap;
                    }
                }
                if ($value->rke != NULL) {
                    $NamaDokter = $value->penulisresep;
                }

                $jasa = 0;
                if (isset($value->jasa) && $value->jasa != "" && $value->jasa != "undefined") {
                    $jasa = $value->jasa;
                }
                $kmpn = [];
                $harga = (float)$value->hargajual;
                $diskon = (float)$value->hargadiscount;
                $jumlah = $value->jumlah;
                $detail = array(
                    'norec' => $value->norec,
                    'tglPelayanan' => $value->tglpelayanan,
                    'namaPelayanan' => $value->namaproduk,
                    'dokter' => $NamaDokter,
                    'jumlah' => $jumlah,
                    'kelasTindakan' => @$value->namakelas,
                    'ruanganTindakan' => @$value->namaruangan,
                    'harga' => $harga,
                    'diskon' => $diskon,
                    'total' => (($harga - $diskon) * $jumlah) + $jasa,
                    'jppid' => '',
                    'jenispetugaspe' => '',
                    'strukfk' => $value->nostruk . ' / ' . $value->nosbm,
                    'sbmfk' => $value->nosbm,
                    'pgid' => '',
                    'ruid' => $value->ruid,
                    'objectdepartemenfk' => $value->objectdepartemenfk,
                    'isobat' => $value->isobat,
                    'prid' => $value->prid,
                    'klid' => $value->klid,
                    'norec_apd' => $value->norec_apd,
                    'norec_pd' => $value->norec_pd,
                    'norec_sp' => $value->norec_sp,
                    'komponen' => $kmpn,
                    'jasa' => $jasa,
                    'aturanpakai' => $value->aturanpakai,
                    'iscito' => $value->iscito,
                    'isparamedis' => $value->isparamedis
                );

                if (is_null($value->nosbm) == true) {
                    $dibayar = $dibayar + (($harga - $diskon) * $value->jumlah) + $jasa;
                }
                if (is_null($value->nostruk) == true) {
                    $diverif = $diverif + (($harga - $diskon) * $value->jumlah) + $jasa;
                }
                $norecAPD = $value->norec_apd;
                $norecSP = $value->norec_sp;
                $totalBilling = $totalBilling + (($harga - $diskon) * $value->jumlah) + $value->jasa;
                $total =  (($harga - $diskon) * $value->jumlah) + $value->jasa;
                $details[] = $detail;
            }
        }
        $cetak = '';
        if (isset($request['cetakx']) && $request['cetakx'] == "sudah") {
            $cetak = ' AND pp.strukfk is not null ';
        }
        if (isset($request['cetakx']) && $request['cetakx'] == "belum") {
            $cetak = ' AND pp.strukfk is null ';
        }
        $dataTotalBill = DB::select(
            DB::raw("select sum(((case when pp.hargajual is null then 0 else pp.hargajual  end - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah) + case when pp.jasa is null then 0 else pp.jasa end) as total
                from pasiendaftar_t as pd
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                where  pd.noregistrasi=:noregistrasi and pp.produkfk not in (402611) $cetak;
            "),
            array(
                'noregistrasi' => $noRegister,
            )
        );
        $dataTotalBillJs = DB::select(
            DB::raw("
                SELECT SUM(y.total) AS total
                FROM (
                    SELECT * 
                    FROM (
                        SELECT 
                            ROW_NUMBER() OVER (PARTITION BY norec_pp ORDER BY kodeexternal) AS rownum,
                            total, norec_pp, kodeexternal -- Hindari * untuk efisiensi dan keamanan
                        FROM v_jimat 
                        WHERE noregistrasi = :noregistrasi
                    ) AS x
                    WHERE rownum = 1
                ) AS y
            "),
            ['noregistrasi' => (string)$noRegister] // Parameter binding untuk keamanan
        );
        

        $totalBilling = 0;
        $totalBilling = $dataTotalBill[0]->total;
        $terbilang = "";
        if ($totalBilling != 0.0) {
            $terbilang = $this->makeTerbilang($totalBilling);
        }
        $totalBillingjS = 0;
        if (count($dataTotalBillJs) > 0) {
            $totalBillingjS = $dataTotalBillJs[0]->total;
        }
        $dataTotaldibayarjs = DB::select(
            DB::raw("
                SELECT 
                    CASE 
                        WHEN sp.totalharusdibayar IS NULL THEN 0 
                        ELSE sp.totalharusdibayar 
                    END AS total
                FROM pasiendaftar_t AS pd
                INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
                INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
                INNER JOIN strukpelayanan_t AS sp ON sp.norec = pp.strukfk
                WHERE pd.noregistrasi = :noregistrasi
                  AND sp.nosbmlastfk IS NOT NULL
                  AND pp.produkfk NOT IN (402611)
                ORDER BY sp.tglstruk DESC
            "),
            ['noregistrasi' => $noRegister] // Binding variabel
        );
        

        $dataTotaldibayar = DB::select(
            DB::raw("select sum(((case when pp.hargajual is null then 0 else pp.hargajual  end - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah) + case when pp.jasa is null then 0 else pp.jasa end) as total
                from pasiendaftar_t as pd
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                where  pd.noregistrasi=:noregistrasi and sp.nosbmlastfk is not null and pp.produkfk not in (402611);
            "),
            array(
                'noregistrasi' => (string)$noRegister,
            )
        );
        $dibayar = 0;
        $dibayarjs = 0;
        $dibayar = $dataTotaldibayar[0]->total;
        if (count($dataTotaldibayarjs) > 0) {

            $dibayarjs = $dataTotaldibayarjs[0]->total;
        }


        $dataTotalverif = DB::select(
            DB::raw("select sum(((case when pp.hargajual is null then 0 else pp.hargajual  end - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah) + case when pp.jasa is null then 0 else pp.jasa end) as total
                from pasiendaftar_t as pd
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                where  pd.noregistrasi=:noregistrasi and pp.strukfk is not null and pp.produkfk not in (402611)
            "),
            array(
                'noregistrasi' => $noRegister,
            )
        );
        $dataTotalverif = DB::select(
            DB::raw("select sum(((case when pp.hargajual is null then 0 else pp.hargajual  end - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah) + case when pp.jasa is null then 0 else pp.jasa end) as total
                from pasiendaftar_t as pd
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                where  pd.noregistrasi=:noregistrasi and pp.strukfk is not null and pp.produkfk not in (402611)
            "),
            array(
                'noregistrasi' => $noRegister,
            )
        );
        $diverif = 0;
        $diverif = $dataTotalverif[0]->total;


        if (count($pelayanan) > 0) {
            $komponen = [];
            if ($pelayanan[0]->nostruklastfk == null && $isRawatInap) {
                $biayaAdministrasi = number_format($totalBilling * $this->getPercentageBiayaAdmin(), 0, '', '');


                $biayaMaterai = $this->getBiayaMaterai($totalBilling);
            }
            if (count($pelayanan) == 0) {
                empty($details);
            }


            try {
                $rekanan = [];
                $rekanan = \DB::table('rekanan_m as al')
                    ->select('al.namarekanan')
                    ->where('al.id', $pelayanan[0]->rekananid)
                    ->first();
                $penjamin = $rekanan->namarekanan;
            } catch (\Exception $e) {
                $penjamin = '-';
            }
            try {
                $kelompokPasien = $pelayanan[0]->kelompokpasien;
            } catch (\Exception $e) {
                $kelompokPasien = '-';
            }

            try {
                $agama = $pelayanan[0]->agama;
                $nosep = $pelayanan[0]->nosep;
            } catch (\Exception $e) {
                $agama = '-';
                $nosep = '-';
            }
            try {
                $umur = $this->hitungUmur($pelayanan[0]->tgllahir);
            } catch (\Exception $e) {
                $umur = '-';
            }

            $keluarga = '-';
            try {
                if ($pelayanan[0]->objectstatusperkawinanfk == '1') {
                    $keluarga = $pelayanan[0]->namaayah;
                } else {
                    $keluarga = $pelayanan[0]->namasuamiistri;
                }
            } catch (\Exception $e) {
                $keluarga = '-';
            }

            $result = array(
                'pasienID' => $pelayanan[0]->pasid,
                'noCm' => $pelayanan[0]->nocm,
                'jenisKelamin' => $pelayanan[0]->jeniskelamin,
                'noRegistrasi' => $pelayanan[0]->noregistrasi,
                'namaPasien' => $pelayanan[0]->namapasien,
                'lastRuangan' => $pelayanan[0]->ruanganlast,
                'tglMasuk' => $pelayanan[0]->tglregistrasi,
                'tglPulang' => $pelayanan[0]->tglpulang,
                'jenisPasien' => $kelompokPasien,
                'kelasRawat' => $pelayanan[0]->namakelas2,
                'kelasId' => $pelayanan[0]->klsid2,
                'noAsuransi' => '-',
                'kelasPenjamin' => $dataRuangan->namakelas,
                'namaPenjamin' => $penjamin,
                'penjamin' => $penjamin,
                'deposit' => $this->getDepositPasien($pelayanan[0]->noregistrasi),
                'totalKlaim' => 0,
                'jumlahBayar' => 0,
                'jumlahPiutang' => 0,
                'billing' => $totalBilling,
                'norec_pd' => $pelayanan[0]->norec_pd,
                'norec_apd' => $pelayanan[0]->norec_apd,
                'strukfk' => $value->nostruk,
                'telepon' => $pelayanan[0]->notelepon,
                'alamat' => $alamatTea,
                'tgllahir' => $pelayanan[0]->tgllahir,
                'agama' => $agama,
                'umur' => $umur,
                'keluarga' => $keluarga,
                'details' => $details,
                'deptid' => $pelayanan[0]->deptid,
                'deptidlast' => $pelayanan[0]->deptidlast,
                'pgpjid' => $pelayanan[0]->pgpjid,
                'objectkelasdijaminfk' => $pelayanan[0]->objectkelasdijaminfk,
                'objectkelompokpasienlastfk' => $pelayanan[0]->objectkelompokpasienlastfk,
                'lalal' => $pelayanan[0]->nostruklastfk,
                'namekendali' =>  $dataRuangan->namekendali,
                '$isRawatInap' => $isRawatInap,
                'diverif' => $diverif,
                'dibayar' => $dibayar,
                'statuspasien' => $pelayanan[0]->statuspasien,
                'ruanganlastid' => $pelayanan[0]->ruanganlastid,
                'namakamar' => $dataRuangan->namakamar,
                'isi' => $isi,
                'terbilang' => $terbilang,
                'nosep' => $nosep,
                'sudahbayar' => $sudahBayar[0]->sudahbayar,
                'dibayarjs' => $dibayarjs,
                'totalbilljs' =>  $totalBillingjS

            );
        } else {
            $pelayanan = \DB::table('pasiendaftar_t as pd')
                ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
                ->leftjoin('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
                ->leftjoin('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
                ->leftjoin('jenisproduk_m as jp', 'jp.id', '=', 'djp.objectjenisprodukfk')
                ->leftjoin('kelompokprodukbpjs_m as kpBpjs', 'kpBpjs.id', '=', 'pr.objectkelompokprodukbpjsfk')
                ->leftjoin('kelas_m as kl', 'kl.id', '=', 'apd.objectkelasfk')
                ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                ->join('ruangan_m as ru2', 'ru2.id', '=', 'pd.objectruanganlastfk')
                ->join('pasien_m as pas', 'pas.id', '=', 'pd.nocmfk')
                ->leftjoin('agama_m as ag', 'ag.id', '=', 'pas.objectagamafk')
                ->leftjoin('jeniskelamin_m as jkel', 'jkel.id', '=', 'pas.objectjeniskelaminfk')
                ->leftjoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
                ->leftjoin('kelas_m as kls', 'kls.id', '=', 'apd.objectkelasfk')
                ->leftjoin('kelas_m as kls2', 'kls2.id', '=', 'pd.objectkelasfk')
                ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
                ->leftjoin('pegawai_m as pgpj', 'pgpj.id', '=', 'pd.objectpegawaifk')
                ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
                ->leftjoin('asuransipasien_m as asu', 'asu.id', '=', 'pa.objectasuransipasienfk')
                ->leftjoin('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
                ->leftjoin('strukresep_t as sr', 'sr.norec', '=', 'pp.strukresepfk')
                ->leftjoin('ruangan_m as rusr', 'rusr.id', '=', 'sr.ruanganfk')
                ->leftjoin('kamar_m as kamar', 'kamar.id', '=', 'apd.objectkamarfk')
                ->leftjoin('pegawai_m as pgsr', 'pgsr.id', '=', 'sr.penulisresepfk')
                ->leftjoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
                ->leftjoin('strukpelayananpenjamin_t as sppj', 'sp.norec', '=', 'sppj.nostrukfk')
                ->leftjoin('strukbuktipenerimaan_t as sbm', 'sp.nosbmlastfk', '=', 'sbm.norec')
                ->leftjoin('pegawai_m as pgsbm', 'pgsbm.id', '=', 'sbm.objectpegawaipenerimafk')
                // ->leftjoin('KendaliDokumenRekamMedis_t as kdr', 'kdr.noregistrasifk', '=', 'apd.norec')
                // ->leftjoin('statuskendalidokumen_m as skd', 'skd.id', '=', 'kdr.objectstatuskendalidokumenfk')
                ->select(
                    'pp.norec',
                    'pp.tglpelayanan',
                    'pp.rke',
                    'pr.id as prid',
                    'pr.namaproduk',
                    'pp.jumlah',
                    'kl.id as klid',
                    'kl.namakelas',
                    'pd.objectpegawaifk as pgpjid',
                    'asu.objectkelasdijaminfk',
                    'pd.objectkelompokpasienlastfk',
                    'ru.id as ruid',
                    'ru.namaruangan',
                    'pp.produkfk',
                    'pp.hargajual',
                    'pp.hargadiscount',
                    'sp.nostruk',
                    'sp.tglstruk',
                    'apd.norec as norec_apd',
                    'pg.id as pgid',
                    'pg.namalengkap',
                    'sbm.nosbm',
                    'sp.norec as norec_sp',
                    'pp.jasa',
                    'pd.nocmfk',
                    'ru2.objectdepartemenfk as deptid',
                    'ru2.objectdepartemenfk as deptidlast',
                    'pd.nocmfk',
                    'pd.nostruklastfk',
                    'ag.id as agid',
                    'ag.agama',
                    'pas.tgllahir',
                    'kp.id as kpid',
                    'kp.kelompokpasien',
                    'pas.objectstatusperkawinanfk',
                    'pas.namaayah',
                    'pas.namasuamiistri',
                    'pas.id as pasid',
                    'pas.nocm',
                    'jkel.id as jkelid',
                    'jkel.jeniskelamin',
                    'jkel.reportdisplay as jk',
                    'pd.noregistrasi',
                    'pas.namapasien',
                    'pd.tglregistrasi',
                    'pd.norec as norec_pd',
                    'pd.tglpulang',
                    'pas.notelepon',
                    'kls.id as klsid',
                    'kls.namakelas',
                    'pd.objectrekananfk as rekananid',
                    'ru2.namaruangan as ruanganlast',
                    'kls2.id as klsid2',
                    'kls2.namakelas as namakelas2',
                    'sr.noresep',
                    'rk.namarekanan',
                    'rusr.namaruangan as ruanganfarmasi',
                    'pgsr.namalengkap as penulisresep',
                    'jp.jenisproduk',
                    'kpBpjs.kelompokprodukbpjs as kelompokprodukbpjs',
                    'pgpj.namalengkap as dokterpj',
                    'pp.jasa',
                    'kamar.namakamar',
                    'sp.totalharusdibayar',
                    'sp.totalprekanan',
                    'sppj.totalppenjamin',
                    'sp.totalbiayatambahan',
                    'pgsbm.namalengkap as namalengkapsbm',
                    'pd.kdprofile',
                    'pp.aturanpakai',
                    'pd.statuspasien',
                    'ru2.id as ruanganlastid',
                    'pa.nosep'
                    // DB::raw('case when skd.namaexternal is null then \'Belum Di Kirim\' else skd.namaexternal end as namekendali')
                )
                ->where('pd.noregistrasi', $noRegister)
                ->orderBy('pp.tglpelayanan', 'pp.rke');


            //            if(isset($request['idruangan']) && $request['idruangan']!="" && $request['idruangan']!="undefined"){
            //                $pelayanan = $pelayanan->where('apd.objectruanganfk',$request['idruangan']);
            //            };
            $pelayanan = $pelayanan->first();

            $isRawatInap = false;
            if ($pelayanan->deptid == 16) {
                $isRawatInap = true;
            }

            $alamat = [];
            $alamat = \DB::table('alamat_m as al')
                ->select('al.alamatlengkap')
                ->where('al.nocmfk', $pelayanan->nocmfk)
                ->get();

            if (count($alamat) == 0) {
                $alamatTea = '0';
            } else {
                $alamatTea = $alamat[0]->alamatlengkap;
            }
            try {
                $rekanan = [];
                //                $rekanan = \DB::table('rekanan_m as al')
                //                    ->select('al.namarekanan')
                //                    ->where('al.id', $pelayanan[0]->rekananid)
                //                    ->first();
                $penjamin = $pelayanan->namarekanan;
            } catch (\Exception $e) {
                $penjamin = '-';
            }
            try {
                $kelompokPasien = $pelayanan->kelompokpasien;
            } catch (\Exception $e) {
                $kelompokPasien = '-';
            }

            try {
                $agama = $pelayanan->agama;
                $nosep = $pelayanan->nosep;
            } catch (\Exception $e) {
                $agama = '-';
                $nosep = '-';
            }
            try {
                $umur = $this->hitungUmur($pelayanan->tgllahir);
            } catch (\Exception $e) {
                $umur = '-';
            }

            $keluarga = '-';
            try {
                if ($pelayanan->objectstatusperkawinanfk == '1') {
                    $keluarga = $pelayanan->namaayah;
                } else {
                    $keluarga = $pelayanan->namasuamiistri;
                }
            } catch (\Exception $e) {
                $keluarga = '-';
            }


            $result = array(
                'pasienID' => $pelayanan->pasid,
                'noCm' => $pelayanan->nocm,
                'jenisKelamin' => $pelayanan->jeniskelamin,
                'noRegistrasi' => $pelayanan->noregistrasi,
                'namaPasien' => $pelayanan->namapasien,
                'lastRuangan' => $pelayanan->ruanganlast,
                'tglMasuk' => $pelayanan->tglregistrasi,
                'tglPulang' => $pelayanan->tglpulang,
                'jenisPasien' => $kelompokPasien,
                'kelasRawat' => $pelayanan->namakelas2,
                'kelasId' => $pelayanan->klsid2,
                'noAsuransi' => '-',
                'kelasPenjamin' => $dataRuangan->namakelas,
                'namaPenjamin' => $penjamin,
                'penjamin' => $penjamin,
                'deposit' => $this->getDepositPasien($pelayanan->noregistrasi),
                'totalKlaim' => 0,
                'jumlahBayar' => 0,
                'jumlahPiutang' => 0,
                'billing' => $totalBilling,
                'norec_pd' => $pelayanan->norec_pd,
                'norec_apd' => $pelayanan->norec_apd,
                'strukfk' => $pelayanan->nostruk,
                'telepon' => $pelayanan->notelepon,
                'alamat' => $alamatTea,
                'tgllahir' => $pelayanan->tgllahir,
                'agama' => $agama,
                'deptid' => $pelayanan->deptid,
                'deptidlast' => $pelayanan->deptidlast,
                'pgpjid' => $pelayanan->pgpjid,
                'objectkelasdijaminfk' => $pelayanan->objectkelasdijaminfk,
                'objectkelompokpasienlastfk' => $pelayanan->objectkelompokpasienlastfk,
                'umur' => $umur,
                'keluarga' => $keluarga,
                'details' => [],
                'lalal' => $pelayanan->nostruklastfk,
                '$isRawatInap' => $isRawatInap,
                'diverif' => $diverif,
                'dibayar' => $dibayar,
                'statuspasien' => $pelayanan->ruanganlastid,
                'ruanganlastid' => $pelayanan->ruanganlastid,
                'namakamar' => $dataRuangan->namakamar,
                'namekendali' =>  $dataRuangan->namekendali,
                'isi' => $isi,
                'terbilang' => $terbilang,
                'nosep' => $nosep,
                'sudahbayar' => $sudahBayar[0]->sudahbayar
            );
        }
        return $this->respond($result);
    }
    public function detailTagihanLaporanPolri(Request $request)
    {

        // $dataRuangan = \DB::table('pasiendaftar_t as pd')
        //     ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
        //     ->select( 'ru.namaruangan as namaruangan')
        //     ->where('pd.noregistrasi', $request['noreg']);
        //     if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
        //         $dataRuangan = $dataRuangan->where('pd.tglregistrasi', '>=', $request['tglAwal']);
        //     }
        //     if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
        //         $dataRuangan = $dataRuangan->where('pd.tglregistrasi', '<=', $request['tglAkhir']);
        //     }
        //     if(isset($request['idDept']) && $request['idDept']!="" && $request['idDept']!="undefined"){
        //         $dataRuangan = $dataRuangan->where('ru.objectdepartemenfk',$request['idDept']);
        //     };
        //     $dataRuangan = $dataRuangan->get();
        //     return($dataRuangan);
        // die();

        $pelayanan = [];
        $pelayanan = \DB::table('pasiendaftar_t as pd')
            ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->leftjoin('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->leftjoin('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
            ->leftjoin('jenisproduk_m as jp', 'jp.id', '=', 'djp.objectjenisprodukfk')
            ->leftjoin('kelompokprodukbpjs_m as kpBpjs', 'kpBpjs.id', '=', 'pr.objectkelompokprodukbpjsfk')
            ->leftjoin('kelas_m as kl', 'kl.id', '=', 'apd.objectkelasfk')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('ruangan_m as ru2', 'ru2.id', '=', 'pd.objectruanganlastfk')
            ->join('pasien_m as pas', 'pas.id', '=', 'pd.nocmfk')
            ->leftjoin('agama_m as ag', 'ag.id', '=', 'pas.objectagamafk')
            ->leftjoin('jeniskelamin_m as jkel', 'jkel.id', '=', 'pas.objectjeniskelaminfk')
            ->leftjoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftjoin('kelas_m as kls', 'kls.id', '=', 'apd.objectkelasfk')
            ->leftjoin('kelas_m as kls2', 'kls2.id', '=', 'pd.objectkelasfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            ->leftjoin('pegawai_m as pgpj', 'pgpj.id', '=', 'pd.objectpegawaifk')
            ->leftjoin('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
            ->leftjoin('strukresep_t as sr', 'sr.norec', '=', 'pp.strukresepfk')
            ->leftjoin('ruangan_m as rusr', 'rusr.id', '=', 'sr.ruanganfk')
            ->leftjoin('kamar_m as kamar', 'kamar.id', '=', 'apd.objectkamarfk')
            ->leftjoin('pegawai_m as pgsr', 'pgsr.id', '=', 'sr.penulisresepfk')
            ->leftjoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
            ->leftjoin('strukpelayananpenjamin_t as sppj', 'sp.norec', '=', 'sppj.nostrukfk')
            ->leftjoin('strukbuktipenerimaan_t as sbm', 'sp.nosbmlastfk', '=', 'sbm.norec')
            ->leftjoin('loginuser_s as lg', 'lg.id', '=', 'sbm.objectpegawaipenerimafk')
            ->leftjoin('pegawai_m as pgsbm', 'pgsbm.id', '=', 'lg.objectpegawaifk')
            ->select(
                'pp.norec',
                'pp.tglpelayanan',
                'pp.rke',
                'pr.id as prid',
                'pr.namaproduk',
                'pp.jumlah',
                'kl.id as klid',
                'kl.namakelas',
                'ru.id as ruid',
                'ru.namaruangan',
                'pp.produkfk',
                'pp.hargajual',
                'pp.hargadiscount',
                'sp.nostruk',
                'sp.tglstruk',
                'apd.norec as norec_apd',
                'pg.id as pgid',
                'pg.namalengkap',
                'sbm.nosbm',
                'sp.norec as norec_sp',
                'pp.jasa',
                'pd.nocmfk',
                'ru.objectdepartemenfk as deptid',
                'pd.nocmfk',
                'pd.nostruklastfk',
                'ag.id as agid',
                'ag.agama',
                'pas.tgllahir',
                'kp.id as kpid',
                'kp.kelompokpasien',
                'pas.objectstatusperkawinanfk',
                'pas.namaayah',
                'pas.namasuamiistri',
                'pas.id as pasid',
                'pas.nocm',
                'jkel.id as jkelid',
                'jkel.jeniskelamin',
                'jkel.reportdisplay as jk',
                'pd.noregistrasi',
                'pas.namapasien',
                'pd.tglregistrasi',
                'pd.norec as norec_pd',
                'pd.tglpulang',
                'pas.notelepon',
                'kls.id as klsid',
                'kls.namakelas',
                'pd.objectrekananfk as rekananid',
                'ru2.namaruangan as ruanganlast',
                'kls2.id as klsid2',
                'kls2.namakelas as namakelas2',
                'sr.noresep',
                'rk.namarekanan',
                'rusr.namaruangan as ruanganfarmasi',
                'pgsr.namalengkap as penulisresep',
                'jp.jenisproduk',
                'kpBpjs.kelompokprodukbpjs as kelompokprodukbpjs',
                'pgpj.namalengkap as dokterpj',
                'pp.jasa',
                'kamar.namakamar',
                'sp.totalharusdibayar',
                'sp.totalprekanan',
                'sppj.totalppenjamin',
                'sp.totalbiayatambahan',
                'pgsbm.namalengkap as namalengkapsbm',
                'pd.kdprofile',
                'pp.aturanpakai',
                'pp.iscito',
                'pd.statuspasien',
                'pp.isparamedis',
                'ru2.id as ruanganlastid'
            )
            // ->where('pd.noregistrasi', $request['noreg'])
            ->whereNotNull('sbm.nosbm')
            ->orderBy('pp.tglpelayanan', 'pp.rke');


        if ($request['jenisdata'] == 'resep') {
            $pelayanan = $pelayanan->whereNotNull('pp.aturanpakai');
        }
        if ($request['jenisdata'] == 'layanan') {
            if (isset($request['idruangan']) && $request['idruangan'] != "" && $request['idruangan'] != "undefined") {
                $pelayanan = $pelayanan->where('apd.objectruanganfk', $request['idruangan']);
            };
            $pelayanan = $pelayanan->whereNull('pp.aturanpakai');
        }
        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $pelayanan = $pelayanan->where('pd.tglregistrasi', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $pelayanan = $pelayanan->where('pd.tglregistrasi', '<=', $request['tglAkhir']);
        }
        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
            $pelayanan = $pelayanan->where('ru.objectdepartemenfk', $request['idDept']);
        };
        if (isset($request['noreg']) && $request['noreg'] != "" && $request['noreg'] != "undefined") {
            $pelayanan = $pelayanan->where('pd.noregistrasi', $request['noreg']);
        };
        if (isset($request['idKelompok']) && $request['idKelompok'] != "" && $request['idKelompok'] != "undefined") {
            $pelayanan = $pelayanan->where('rk.id', $request['idKelompok']);
        };

        if (isset($request['kasirArr']) && $request['kasirArr'] != "" && $request['kasirArr'] != "undefined") {
            $arrKasir = explode(',', $request['kasirArr']);
            $kodeRuang = [];
            foreach ($arrKasir as $item) {
                $kodeRuang[] = (int) $item;
            }
            $pelayanan = $pelayanan->whereIn('pgsbm.id', $kodeRuang);
        }

        // return($request['kasirArr']);
        // die();
        $pelayanan = $pelayanan->get();

        // return($pelayanan);
        // die();

        $pelayananpetugas = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('pelayananpasienpetugas_t as ptu', 'ptu.nomasukfk', '=', 'apd.norec')
            ->join('jenispetugaspelaksana_m as jpp', 'jpp.id', '=', 'ptu.objectjenispetugaspefk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'ptu.objectpegawaifk')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->select('ptu.pelayananpasien', 'pg.namalengkap')
            // ->where('ptu.objectjenispetugaspefk', 4)
            ->orderBy('jpp.kodeexternal', 'desc');
        // ->where('pd.noregistrasi', $request['noreg']);
        if (isset($request['noreg']) && $request['noreg'] != "" && $request['noreg'] != "undefined") {
            $pelayananpetugas = $pelayananpetugas->where('pd.noregistrasi', $request['noreg']);
        }
        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $pelayananpetugas = $pelayananpetugas->where('pd.tglregistrasi', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $pelayananpetugas = $pelayananpetugas->where('pd.tglregistrasi', '<=', $request['tglAkhir']);
        }
        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
            $pelayananpetugas = $pelayananpetugas->where('ru.objectdepartemenfk', $request['idDept']);
        };
        $kodeDokter[] = "";
        if (isset($request['dokterArr']) && $request['dokterArr'] != "" && $request['dokterArr'] != "undefined") {
            $arrDokter = explode(',', $request['dokterArr']);
            $kodeDokter = [];
            foreach ($arrDokter as $item) {
                $kodeDokter[] = (int) $item;
            }
            $pelayananpetugas = $pelayananpetugas->whereIn('pg.id', $kodeDokter);
        }

        $pelayananpetugas = $pelayananpetugas->get();

        $totototol = 0;
        // return(count($pelayanan));
        // die();
        if (count($pelayanan) > 0) {
            $alamat = [];
            $alamat = \DB::table('alamat_m as al')
                ->select('al.alamatlengkap')
                ->where('al.nocmfk', $pelayanan[0]->nocmfk)
                ->first();

            if (empty($alamat)) {
                $alamatTea = '0';
            } else {
                $alamatTea = $alamat->alamatlengkap;
            }

            $totalBilling = 0;
            $norecAPD = '';
            $norecSP = '';
            $details = array();
            $dibayar = 0;
            $diverif = 0;
            foreach ($pelayanan as $value) {
                // $dataz =  DB::select(DB::raw("select DISTINCT hnp.objectkomponenhargafk,kh.komponenharga,hnp.hargasatuan,
                //     hnp.objectprodukfk
                //     from harganettoprodukbykelasd_m as hnp   
                //     inner join produk_m as prd on prd.id=hnp.objectprodukfk
                //     inner join komponenharga_m as kh on kh.id=hnp.objectkomponenhargafk
                //     inner join kelas_m as kls on kls.id = hnp.objectkelasfk
                //     where hnp.objectkelasfk='$value->klid'
                //     and prd.id='$value->produkfk'
                //     and hnp.statusenabled =1"));
                //     return($dataz);
                // die();
                $isRawatInap = false;
                if ($value->deptid == 16) {
                    $isRawatInap = true;
                }
                if ($value->produkfk == $this->getProdukIdDeposit()) {
                    continue;
                }
                $komponen = [];
                $dokter = [];
                $NamaDokter = '-';

                foreach ($pelayananpetugas as $hahaha) {
                    // $i+$i+1;
                    if ($hahaha->pelayananpasien == $value->norec) {
                        $NamaDokter = $hahaha->namalengkap;
                    }
                }
                if ($value->rke != NULL) {
                    $NamaDokter = $value->penulisresep;
                }

                $jasa = 0;
                if (isset($value->jasa) && $value->jasa != "" && $value->jasa != "undefined") {
                    $jasa = $value->jasa;
                }
                $kmpn = [];

                $harga = (float)$value->hargajual;
                $diskon = (float)$value->hargadiscount;
                if ($kodeDokter[0] != "" && $NamaDokter != "-") {
                    $detail = array(
                        'norec' => $value->norec,
                        'tglPelayanan' => $value->tglpelayanan,
                        'namaPelayanan' => $value->namaproduk,
                        'dokter' => $NamaDokter,
                        'jumlah' => $value->jumlah,
                        'kelasTindakan' => @$value->namakelas,
                        'ruanganTindakan' => @$value->namaruangan,
                        'harga' => $harga,
                        'diskon' => $diskon,
                        'total' => (($harga - $diskon) * $value->jumlah) + $jasa,
                        'jppid' => '',
                        'jenispetugaspe' => '',
                        'strukfk' => $value->nostruk . ' / ' . $value->nosbm,
                        'sbmfk' => $value->nosbm,
                        'pgid' => '',
                        // 'pgpjid' => $value->pgpjid,
                        'deptid' => $value->deptid,
                        'ruid' => $value->ruid,
                        'prid' => $value->prid,
                        'klid' => $value->klid,
                        'norec_apd' => $value->norec_apd,
                        'norec_pd' => $value->norec_pd,
                        'norec_sp' => $value->norec_sp,
                        'komponen' => $kmpn,
                        'jasa' => $jasa,
                        'aturanpakai' => $value->aturanpakai,
                        'iscito' => $value->iscito,
                        'isparamedis' => $value->isparamedis,
                        'noCm' => $value->nocm,
                        'noRegistrasi' => $value->noregistrasi,
                        'namaPasien' => $value->namapasien,
                        'namalengkapsbm' => $value->namalengkapsbm,
                        'tglregistrasi' => $value->tglregistrasi,
                        'namarekanan' => $value->namarekanan
                    );
                    $details[] = $detail;
                } else if ($kodeDokter[0] == "") {
                    $detail = array(
                        'norec' => $value->norec,
                        'tglPelayanan' => $value->tglpelayanan,
                        'namaPelayanan' => $value->namaproduk,
                        'dokter' => $NamaDokter,
                        'jumlah' => $value->jumlah,
                        'kelasTindakan' => @$value->namakelas,
                        'ruanganTindakan' => @$value->namaruangan,
                        'harga' => $harga,
                        'diskon' => $diskon,
                        'total' => (($harga - $diskon) * $value->jumlah) + $jasa,
                        'jppid' => '',
                        'jenispetugaspe' => '',
                        'strukfk' => $value->nostruk . ' / ' . $value->nosbm,
                        'sbmfk' => $value->nosbm,
                        'pgid' => '',
                        // 'pgpjid' => $value->pgpjid,
                        'deptid' => $value->deptid,
                        'ruid' => $value->ruid,
                        'prid' => $value->prid,
                        'klid' => $value->klid,
                        'norec_apd' => $value->norec_apd,
                        'norec_pd' => $value->norec_pd,
                        'norec_sp' => $value->norec_sp,
                        'komponen' => $kmpn,
                        'jasa' => $jasa,
                        'aturanpakai' => $value->aturanpakai,
                        'iscito' => $value->iscito,
                        'isparamedis' => $value->isparamedis,
                        'noCm' => $value->nocm,
                        'noRegistrasi' => $value->noregistrasi,
                        'namaPasien' => $value->namapasien,
                        'namalengkapsbm' => $value->namalengkapsbm,
                        'tglregistrasi' => $value->tglregistrasi,
                        'namarekanan' => $value->namarekanan
                    );
                    $details[] = $detail;
                }



                if (is_null($value->nosbm) == true) {
                    $dibayar = $dibayar + (($harga - $diskon) * $value->jumlah) + $jasa;
                }
                if (is_null($value->nostruk) == true) {
                    $diverif = $diverif + (($harga - $diskon) * $value->jumlah) + $jasa;
                }
                $norecAPD = $value->norec_apd;
                $norecSP = $value->norec_sp;
                $totalBilling = $totalBilling + (($harga - $diskon) * $value->jumlah) + $value->jasa;
                $total =  (($harga - $diskon) * $value->jumlah) + $value->jasa;
                // $details[] = $detail;

                //                $totototol = $totototol + $total;
                if ($request['jenisdata'] == 'bill') {
                    //                    $delete = TempBilling::where('noregistrasi', $noRegister)->delete();
                    $kelas_dijamin = 0;
                    $harga_dijamin = 0;
                    $total_dijamin = 0;
                    foreach ($pelayanankelasdijamin as $kupret) {
                        if ($value->norec == $kupret->norec) {
                            $kelas_dijamin = $kupret->namakelas_dijamin;
                            $harga_dijamin = $kupret->harga_kelasdijamin;
                            $total_dijamin = ((float)$kupret->harga_kelasdijamin * (float)$value->jumlah) + $value->jasa;
                        }
                    }
                }
            }
        }
        // $tglAwal = $request['tglAwal'];
        // $tglAkhir = $request['tglAkhir'];
        // $dataTotalBill = DB::select(DB::raw("select sum(((case when pp.hargajual is null then 0 else pp.hargajual  end - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah) + case when pp.jasa is null then 0 else pp.jasa end) as total
        //         from pasiendaftar_t as pd
        //         INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
        //         INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
        //         where pp.produkfk not in (402611) and pd.tglregistrasi between '$tglAwal' and '$tglAkhir';
        //     ")
        //     // ,
        //     // array(
        //     //     'noregistrasi' => $request['noreg'] ,
        //     // )
        // );

        // $totalBilling=0;
        // $totalBilling = $dataTotalBill[0]->total;

        // $dataTotaldibayar = DB::select(DB::raw("select sum(((case when pp.hargajual is null then 0 else pp.hargajual  end - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah) + case when pp.jasa is null then 0 else pp.jasa end) as total
        //         from pasiendaftar_t as pd
        //         INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
        //         INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
        //         INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
        //         where  sp.nosbmlastfk is not null and pp.produkfk not in (402611) and pd.tglregistrasi between '$tglAwal' and '$tglAkhir';
        //     ")
        //     // ,
        //     // array(
        //     //     'noregistrasi' => $request['noreg'] ,
        //     // )
        // );
        // $dibayar=0;
        // $dibayar = $dataTotaldibayar[0]->total;

        // $dataTotalverif = DB::select(DB::raw("select sum(((case when pp.hargajual is null then 0 else pp.hargajual  end - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah) + case when pp.jasa is null then 0 else pp.jasa end) as total
        //         from pasiendaftar_t as pd
        //         INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
        //         INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
        //         where pp.strukfk is not null and pp.produkfk not in (402611) and pd.tglregistrasi between '$tglAwal' and '$tglAkhir';
        //     ")
        //     // ,
        //     // array(
        //     //     'noregistrasi' => $request['noreg'] ,
        //     // )
        // );
        // $diverif=0;
        // $diverif = $dataTotalverif[0]->total;


        if (count($pelayanan) > 0) {
            $komponen = [];
            if ($pelayanan[0]->nostruklastfk == null && $isRawatInap) {
                $biayaAdministrasi = number_format($totalBilling * $this->getPercentageBiayaAdmin(), 0, '', '');
                $biayaMaterai = $this->getBiayaMaterai($totalBilling);
            }
            if (count($pelayanan) == 0) {
                empty($details);
            }


            try {
                $rekanan = [];
                $rekanan = \DB::table('rekanan_m as al')
                    ->select('al.namarekanan')
                    ->where('al.id', $pelayanan[0]->rekananid)
                    ->first();
                $penjamin = $rekanan->namarekanan;
            } catch (\Exception $e) {
                $penjamin = '-';
            }
            try {
                $kelompokPasien = $pelayanan[0]->kelompokpasien;
            } catch (\Exception $e) {
                $kelompokPasien = '-';
            }

            try {
                $agama = $pelayanan[0]->agama;
            } catch (\Exception $e) {
                $agama = '-';
            }
            try {
                $umur = $this->hitungUmur($pelayanan[0]->tgllahir);
            } catch (\Exception $e) {
                $umur = '-';
            }

            $keluarga = '-';
            try {
                if ($pelayanan[0]->objectstatusperkawinanfk == '1') {
                    $keluarga = $pelayanan[0]->namaayah;
                } else {
                    $keluarga = $pelayanan[0]->namasuamiistri;
                }
            } catch (\Exception $e) {
                $keluarga = '-';
            }

            $result = array(
                // 'pasienID' => $pelayanan[0]->pasid,
                // 'noCm' => $pelayanan[0]->nocm,
                // 'jenisKelamin' => $pelayanan[0]->jeniskelamin,
                // 'noRegistrasi' => $pelayanan[0]->noregistrasi,
                // 'namaPasien' => $pelayanan[0]->namapasien,
                // 'lastRuangan' => $pelayanan[0]->ruanganlast,
                // 'tglMasuk' => $pelayanan[0]->tglregistrasi,
                // 'tglPulang' => $pelayanan[0]->tglpulang,
                // 'jenisPasien' => $kelompokPasien,
                // 'kelasRawat' => $pelayanan[0]->namakelas2,
                // 'kelasId' => $pelayanan[0]->klsid2,
                // 'noAsuransi' => '-',
                // 'kelasPenjamin' => '-',
                // 'namaPenjamin' => $penjamin,
                // 'penjamin' => $penjamin,
                // 'deposit' => $this->getDepositPasien($pelayanan[0]->noregistrasi),
                // 'totalKlaim' => 0,
                // 'jumlahBayar' => 0,
                // 'jumlahPiutang' => 0,
                // 'billing' => $totalBilling,
                // 'norec_pd' => $pelayanan[0]->norec_pd,
                // 'strukfk' => $value->nostruk,
                // 'telepon' => $pelayanan[0]->notelepon,
                // 'alamat' => $alamatTea,
                // 'tgllahir' => $pelayanan[0]->tgllahir,
                // 'agama' => $agama,
                // 'umur' => $umur,
                // 'keluarga' => $keluarga,
                'details' => $details,
                // 'lalal' => $pelayanan[0]->nostruklastfk,
                // '$isRawatInap' => $isRawatInap,
                // 'diverif' => $diverif,
                // 'dibayar' => $dibayar,
                // 'statuspasien' => $pelayanan[0]->statuspasien,
                // 'ruanganlastid' => $pelayanan[0]->ruanganlastid,
            );
        }
        // else{
        //     $pelayanan = \DB::table('pasiendaftar_t as pd')
        //         ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
        //         ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
        //         ->leftjoin('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
        //         ->leftjoin('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
        //         ->leftjoin('jenisproduk_m as jp', 'jp.id', '=', 'djp.objectjenisprodukfk')
        //         ->leftjoin('kelompokprodukbpjs_m as kpBpjs', 'kpBpjs.id', '=', 'pr.objectkelompokprodukbpjsfk')
        //         ->leftjoin('kelas_m as kl', 'kl.id', '=', 'apd.objectkelasfk')
        //         ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
        //         ->join('ruangan_m as ru2', 'ru2.id', '=', 'pd.objectruanganlastfk')
        //         ->join('pasien_m as pas', 'pas.id', '=', 'pd.nocmfk')
        //         ->leftjoin('agama_m as ag', 'ag.id', '=', 'pas.objectagamafk')
        //         ->leftjoin('jeniskelamin_m as jkel', 'jkel.id', '=', 'pas.objectjeniskelaminfk')
        //         ->leftjoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
        //         ->leftjoin('kelas_m as kls', 'kls.id', '=', 'apd.objectkelasfk')
        //         ->leftjoin('kelas_m as kls2', 'kls2.id', '=', 'pd.objectkelasfk')
        //         ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
        //         ->leftjoin('pegawai_m as pgpj', 'pgpj.id', '=', 'pd.objectpegawaifk')
        //         ->leftjoin('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
        //         ->leftjoin('strukresep_t as sr', 'sr.norec', '=', 'pp.strukresepfk')
        //         ->leftjoin('ruangan_m as rusr', 'rusr.id', '=', 'sr.ruanganfk')
        //         ->leftjoin('kamar_m as kamar', 'kamar.id', '=', 'apd.objectkamarfk')
        //         ->leftjoin('pegawai_m as pgsr', 'pgsr.id', '=', 'sr.penulisresepfk')
        //         ->leftjoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
        //         ->leftjoin('strukpelayananpenjamin_t as sppj', 'sp.norec', '=', 'sppj.nostrukfk')
        //         ->leftjoin('strukbuktipenerimaan_t as sbm', 'sp.nosbmlastfk', '=', 'sbm.norec')
        //         ->leftjoin('pegawai_m as pgsbm', 'pgsbm.id', '=', 'sbm.objectpegawaipenerimafk')
        //         ->select('pp.norec', 'pp.tglpelayanan', 'pp.rke', 'pr.id as prid', 'pr.namaproduk', 'pp.jumlah', 'kl.id as klid', 'kl.namakelas',
        //             'ru.id as ruid', 'ru.namaruangan', 'pp.produkfk', 'pp.hargajual', 'pp.hargadiscount', 'sp.nostruk', 'sp.tglstruk', 'apd.norec as norec_apd',
        //             'pg.id as pgid', 'pg.namalengkap', 'sbm.nosbm', 'sp.norec as norec_sp', 'pp.jasa', 'pd.nocmfk', 'ru2.objectdepartemenfk as deptid',
        //             'pd.nocmfk', 'pd.nostruklastfk', 'ag.id as agid', 'ag.agama', 'pas.tgllahir',
        //             'kp.id as kpid', 'kp.kelompokpasien', 'pas.objectstatusperkawinanfk', 'pas.namaayah', 'pas.namasuamiistri',
        //             'pas.id as pasid', 'pas.nocm', 'jkel.id as jkelid', 'jkel.jeniskelamin', 'jkel.reportdisplay as jk', 'pd.noregistrasi', 'pas.namapasien',
        //             'pd.tglregistrasi', 'pd.norec as norec_pd', 'pd.tglpulang', 'pas.notelepon', 'kls.id as klsid', 'kls.namakelas',
        //             'pd.objectrekananfk as rekananid', 'ru2.namaruangan as ruanganlast', 'kls2.id as klsid2', 'kls2.namakelas as namakelas2',
        //             'sr.noresep', 'rk.namarekanan', 'rusr.namaruangan as ruanganfarmasi', 'pgsr.namalengkap as penulisresep', 'jp.jenisproduk', 'kpBpjs.kelompokprodukbpjs as kelompokprodukbpjs',
        //             'pgpj.namalengkap as dokterpj', 'pp.jasa', 'kamar.namakamar', 'sp.totalharusdibayar', 'sp.totalprekanan', 'sppj.totalppenjamin',
        //             'sp.totalbiayatambahan', 'pgsbm.namalengkap as namalengkapsbm','pd.kdprofile','pp.aturanpakai','pd.statuspasien','ru2.id as ruanganlastid'
        //         )
        //         ->where('pd.noregistrasi', $noRegister)
        //         ->orderBy('pp.tglpelayanan', 'pp.rke');

        //     $pelayanan = $pelayanan->first();

        //     $isRawatInap = false;
        //     if ($pelayanan->deptid == 16) {
        //         $isRawatInap = true;
        //     }

        //     $alamat = [];
        //     $alamat = \DB::table('alamat_m as al')
        //         ->select('al.alamatlengkap')
        //         ->where('al.nocmfk', $pelayanan->nocmfk)
        //         ->get();

        //     if (count($alamat) == 0) {
        //         $alamatTea = '0';
        //     } else {
        //         $alamatTea = $alamat[0]->alamatlengkap;
        //     }
        //     try {
        //         $rekanan = [];
        //         $penjamin = $pelayanan->namarekanan;
        //     } catch (\Exception $e) {
        //         $penjamin = '-';
        //     }
        //     try {
        //         $kelompokPasien = $pelayanan->kelompokpasien;
        //     } catch (\Exception $e) {
        //         $kelompokPasien = '-';
        //     }

        //     try {
        //         $agama = $pelayanan->agama;
        //     } catch (\Exception $e) {
        //         $agama = '-';
        //     }
        //     try {
        //         $umur = $this->hitungUmur($pelayanan->tgllahir);
        //     } catch (\Exception $e) {
        //         $umur = '-';
        //     }

        //     $keluarga = '-';
        //     try {
        //         if ($pelayanan->objectstatusperkawinanfk == '1') {
        //             $keluarga = $pelayanan->namaayah;
        //         } else {
        //             $keluarga = $pelayanan->namasuamiistri;
        //         }
        //     } catch (\Exception $e) {
        //         $keluarga = '-';
        //     }

        //     $result = array(
        //         'pasienID' => $pelayanan->pasid,
        //         'noCm' => $pelayanan->nocm,
        //         'jenisKelamin' => $pelayanan->jeniskelamin,
        //         'noRegistrasi' => $pelayanan->noregistrasi,
        //         'namaPasien' => $pelayanan->namapasien,
        //         'lastRuangan' => $pelayanan->ruanganlast,
        //         'tglMasuk' => $pelayanan->tglregistrasi,
        //         'tglPulang' => $pelayanan->tglpulang,
        //         'jenisPasien' => $kelompokPasien,
        //         'kelasRawat' => $pelayanan->namakelas2,
        //         'kelasId' => $pelayanan->klsid2,
        //         'noAsuransi' => '-',
        //         'kelasPenjamin' => '-',
        //         'namaPenjamin' => $penjamin,
        //         'penjamin' => $penjamin,
        //         'deposit' => $this->getDepositPasien($pelayanan->noregistrasi),
        //         'totalKlaim' => 0,
        //         'jumlahBayar' => 0,
        //         'jumlahPiutang' => 0,
        //         'billing' => $totalBilling,
        //         'norec_pd' => $pelayanan->norec_pd,
        //         'strukfk' => $pelayanan->nostruk,
        //         'telepon' => $pelayanan->notelepon,
        //         'alamat' => $alamatTea,
        //         'tgllahir' => $pelayanan->tgllahir,
        //         'agama' => $agama,
        //         'umur' => $umur,
        //         'keluarga' => $keluarga,
        //         'details' => [],
        //         'lalal' => $pelayanan->nostruklastfk,
        //         '$isRawatInap' => $isRawatInap,
        //         'diverif' => $diverif,
        //         'dibayar' => $dibayar,
        //         'statuspasien' => $pelayanan->ruanganlastid,
        //         'ruanganlastid' => $pelayanan->ruanganlastid,
        //     );
        // }
        return $this->respond($result);
    }



    public function detailTagihanRevKudunaLeuwihGancang($noRegister, Request $request)
    {
        //        $delete = TempBilling::where('noregistrasi', $noRegister)->delete();
        //        $dataRuangan = \DB::table('pasiendaftar_t as pd')
        //            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
        //            ->select( 'ru.namaruangan as namaruangan')
        //            ->where('pd.noregistrasi', $noRegister)
        //            ->first();
        $pelayanan = [];
        $pelayananHead = \DB::table('pasiendaftar_t as pd')
            ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('kelas_m as kl', 'kl.id', '=', 'apd.objectkelasfk')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftjoin('ruangan_m as ru2', 'ru2.id', '=', 'pd.objectruanganlastfk')
            ->leftjoin('pasien_m as pas', 'pas.id', '=', 'pd.nocmfk')
            ->leftjoin('agama_m as ag', 'ag.id', '=', 'pas.objectagamafk')
            ->leftjoin('jeniskelamin_m as jkel', 'jkel.id', '=', 'pas.objectjeniskelaminfk')
            ->leftjoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftjoin('kelas_m as kls2', 'kls2.id', '=', 'pd.objectkelasfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            ->leftjoin('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
            ->leftjoin('kamar_m as kamar', 'kamar.id', '=', 'apd.objectkamarfk')
            ->select(
                'kl.id as klid',
                'kl.namakelas',
                'ru.id as ruid',
                'ru.namaruangan',
                'apd.norec as norec_apd',
                'pg.id as pgid',
                'pg.namalengkap',
                'pd.nocmfk',
                'ru2.objectdepartemenfk as deptid',
                'pd.nocmfk',
                'pd.nostruklastfk',
                'ag.id as agid',
                'ag.agama',
                'pas.tgllahir',
                'kp.id as kpid',
                'kp.kelompokpasien',
                'pas.objectstatusperkawinanfk',
                'pas.namaayah',
                'pas.namasuamiistri',
                'pas.id as pasid',
                'pas.nocm',
                'jkel.id as jkelid',
                'jkel.jeniskelamin',
                'jkel.reportdisplay as jk',
                'pd.noregistrasi',
                'pas.namapasien',
                'pd.tglregistrasi',
                'pd.norec as norec_pd',
                'pd.tglpulang',
                'pas.notelepon',
                'kl.id as klsid',
                'kl.namakelas',
                'pd.objectrekananfk as rekananid',
                'ru2.namaruangan as ruanganlast',
                'kls2.id as klsid2',
                'kls2.namakelas as namakelas2',
                'rk.namarekanan',
                'kamar.namakamar',
                'pd.kdprofile',
                'pd.statuspasien'
            )
            ->where('pd.noregistrasi', $noRegister);
        $pelayananHead = $pelayananHead->first();

        $pelayanan = \DB::table('pasiendaftar_t as pd')
            ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->leftjoin('pegawai_m as pgdokter', 'pgdokter.id', '=', 'pp.pelayananpegawaifk')
            ->leftjoin('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->leftjoin('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
            ->leftjoin('jenisproduk_m as jp', 'jp.id', '=', 'djp.objectjenisprodukfk')
            ->leftjoin('kelompokprodukbpjs_m as kpBpjs', 'kpBpjs.id', '=', 'pr.objectkelompokprodukbpjsfk')
            ->leftjoin('kelas_m as kls', 'kls.id', '=', 'apd.objectkelasfk')
            ->leftjoin('strukresep_t as sr', 'sr.norec', '=', 'pp.strukresepfk')
            ->leftjoin('ruangan_m as rusr', 'rusr.id', '=', 'sr.ruanganfk')
            ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('asuransipasien_m as asu', 'asu.id', '=', 'pa.objectasuransipasienfk')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftjoin('pegawai_m as pgsr', 'pgsr.id', '=', 'sr.penulisresepfk')
            ->leftjoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
            ->leftjoin('strukpelayananpenjamin_t as sppj', 'sp.norec', '=', 'sppj.nostrukfk')
            ->leftjoin('strukbuktipenerimaan_t as sbm', 'sp.nosbmlastfk', '=', 'sbm.norec')
            ->leftjoin('pegawai_m as pgsbm', 'pgsbm.id', '=', 'sbm.objectpegawaipenerimafk')
            ->select(
                'pp.norec',
                'pp.tglpelayanan',
                'pp.rke',
                'pr.id as prid',
                'pr.namaproduk',
                'pp.jumlah',
                'pp.produkfk',
                'pp.hargajual',
                'pp.hargadiscount',
                'sp.nostruk',
                'sp.tglstruk',
                'pd.objectpegawaifk as pgpjid',
                'asu.objectkelasdijaminfk',
                'sbm.nosbm',
                'sp.norec as norec_sp',
                'pp.jasa',
                'ru.id as ruid',
                'ru.namaruangan',
                'sr.noresep',
                'rusr.namaruangan as ruanganfarmasi',
                'pgsr.namalengkap as penulisresep',
                'pgdokter.namalengkap as namadokter_pp',
                'kpBpjs.kelompokprodukbpjs as kelompokprodukbpjs',
                'kls.id as klsid',
                'kls.namakelas',
                'pp.jasa',
                'sp.totalharusdibayar',
                'sp.totalprekanan',
                'sppj.totalppenjamin',
                'sp.totalbiayatambahan',
                'pgsbm.namalengkap as namalengkapsbm',
                'pp.aturanpakai',
                'pp.iscito',
                'pp.isparamedis'
            )
            ->where('pd.noregistrasi', $noRegister)
            ->orderBy('pp.tglpelayanan', 'pp.rke');


        if ($request['jenisdata'] == 'resep') {
            $pelayanan = $pelayanan->whereNotNull('pp.aturanpakai');
        }
        if ($request['jenisdata'] == 'layanan') {
            if (isset($request['idruangan']) && $request['idruangan'] != "" && $request['idruangan'] != "undefined") {
                $pelayanan = $pelayanan->where('apd.objectruanganfk', $request['idruangan']);
            };
            $pelayanan = $pelayanan->whereNull('pp.aturanpakai');
        }
        $pelayanan = $pelayanan->get();

        $pelayananpetugas = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('pelayananpasienpetugas_t as ptu', 'ptu.nomasukfk', '=', 'apd.norec')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'ptu.objectpegawaifk')
            ->select('ptu.pelayananpasien', 'pg.namalengkap')
            ->where('ptu.objectjenispetugaspefk', 4)
            ->where('pd.noregistrasi', $noRegister)
            ->get();


        $totototol = 0;

        if (count($pelayanan) > 0) {
            $alamat = [];
            $alamat = \DB::table('alamat_m as al')
                ->select('al.alamatlengkap')
                ->where('al.nocmfk', $pelayananHead->nocmfk)
                ->first();

            if (empty($alamat)) {
                $alamatTea = '0';
            } else {
                $alamatTea = $alamat->alamatlengkap;
            }

            $totalBilling = 0;
            $norecAPD = '';
            $norecSP = '';
            $details = array();
            $dibayar = 0;
            $diverif = 0;
            foreach ($pelayanan as $value) {
                $isRawatInap = false;
                if ($value->produkfk == 402611) {
                    continue;
                }
                $komponen = [];

                $dokter = [];
                //                $NamaDokter = $value->namadokter_pp;//'-';
                $NamaDokter = '-';
                foreach ($pelayananpetugas as $hahaha) {
                    if ($hahaha->pelayananpasien == $value->norec) {
                        $NamaDokter = $hahaha->namalengkap;
                    }
                }
                $jasa = 0;
                if (isset($value->jasa) && $value->jasa != "" && $value->jasa != "undefined") {
                    $jasa = $value->jasa;
                }
                $kmpn = [];
                $harga = (float)$value->hargajual;
                $diskon = (float)$value->hargadiscount;
                $detail = array(
                    'norec' => $value->norec,
                    'tglPelayanan' => $value->tglpelayanan,
                    'namaPelayanan' => $value->namaproduk,
                    'dokter' => $NamaDokter,
                    'jumlah' => $value->jumlah,
                    'kelasTindakan' => $value->namakelas,
                    'ruanganTindakan' => $value->namaruangan,
                    'harga' => $harga,
                    'pgpjid' => $pelayanan->pgpjid,
                    'objectkelasdijaminfk' => $pelayanan[0]->objectkelasdijaminfk,
                    'deptid' => $pelayanan->deptid,
                    'diskon' => $diskon,
                    'total' => (($harga - $diskon) * $value->jumlah) + $jasa,
                    'jppid' => '',
                    'jenispetugaspe' => '',
                    'strukfk' => $value->nostruk . ' / ' . $value->nosbm,
                    'sbmfk' => $value->nosbm,
                    'pgid' => '',
                    'ruid' => $pelayananHead->ruid,
                    'prid' => $value->prid,
                    'klid' => $pelayananHead->klid,
                    'norec_apd' => $pelayananHead->norec_apd,
                    'norec_pd' => $pelayananHead->norec_pd,
                    'norec_sp' => $value->norec_sp,
                    'komponen' => $kmpn,
                    'jasa' => $jasa,
                    'aturanpakai' => $value->aturanpakai,
                    'iscito' => $value->iscito,
                    'isparamedis' => $value->isparamedis
                );

                if (is_null($value->nosbm) == true) {
                    $dibayar = $dibayar + (($harga - $diskon) * $value->jumlah) + $jasa;
                }
                if (is_null($value->nostruk) == true) {
                    $diverif = $diverif + (($harga - $diskon) * $value->jumlah) + $jasa;
                }
                $norecAPD = $pelayananHead->norec_apd;
                $norecSP = $value->norec_sp;
                $totalBilling = $totalBilling + (($harga - $diskon) * $value->jumlah) + $value->jasa;
                $total =  (($harga - $diskon) * $value->jumlah) + $value->jasa;
                $details[] = $detail;
            }
        }

        $dataTotalBill = DB::select(
            DB::raw("select sum(((case when pp.hargajual is null then 0 else pp.hargajual  end - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah) + case when pp.jasa is null then 0 else pp.jasa end) as total
                from pasiendaftar_t as pd
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                where  pd.noregistrasi=:noregistrasi and pp.produkfk not in (402611) ;
            "),
            array(
                'noregistrasi' => $noRegister,
            )
        );
        $totalBilling = 0;
        $totalBilling = $dataTotalBill[0]->total;

        $dataTotaldibayar = DB::select(
            DB::raw("select sum(((case when pp.hargajual is null then 0 else pp.hargajual  end - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah) + case when pp.jasa is null then 0 else pp.jasa end) as total
                from pasiendaftar_t as pd
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                where  pd.noregistrasi=:noregistrasi and sp.nosbmlastfk is not null and pp.produkfk not in (402611);
            "),
            array(
                'noregistrasi' => $noRegister,
            )
        );
        $dibayar = 0;
        $dibayar = $dataTotaldibayar[0]->total;

        $dataTotalverif = DB::select(
            DB::raw("select sum(((case when pp.hargajual is null then 0 else pp.hargajual  end - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah) + case when pp.jasa is null then 0 else pp.jasa end) as total
                from pasiendaftar_t as pd
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                where  pd.noregistrasi=:noregistrasi and pp.strukfk is not null and pp.produkfk not in (402611)
            "),
            array(
                'noregistrasi' => $noRegister,
            )
        );
        $diverif = 0;
        $diverif = $dataTotalverif[0]->total;

        $biayaAdministrasi = 0;
        $komponen = [];
        //            if ($pelayananHead->nostruklastfk == null && $isRawatInap) {
        //                $biayaAdministrasi = number_format($totalBilling * $this->getPercentageBiayaAdmin(), 0, '', '');
        //                $biayaMaterai = $this->getBiayaMaterai($totalBilling);
        //            }
        if (count($pelayanan) == 0) {
            empty($details);
        }


        try {
            $rekanan = [];
            $rekanan = \DB::table('rekanan_m as al')
                ->select('al.namarekanan')
                ->where('al.id', $pelayananHead->rekananid)
                ->first();
            $penjamin = $rekanan->namarekanan;
        } catch (\Exception $e) {
            $penjamin = '-';
        }
        try {
            $kelompokPasien = $pelayananHead->kelompokpasien;
        } catch (\Exception $e) {
            $kelompokPasien = '-';
        }

        try {
            $agama = $pelayananHead->agama;
        } catch (\Exception $e) {
            $agama = '-';
        }
        try {
            $umur = $this->hitungUmur($pelayananHead->tgllahir);
        } catch (\Exception $e) {
            $umur = '-';
        }

        $keluarga = '-';
        try {
            if ($pelayananHead->objectstatusperkawinanfk == '1') {
                $keluarga = $pelayananHead->namaayah;
            } else {
                $keluarga = $pelayananHead->namasuamiistri;
            }
        } catch (\Exception $e) {
            $keluarga = '-';
        }

        $result = array(
            'pasienID' => $pelayananHead->pasid,
            'noCm' => $pelayananHead->nocm,
            'jenisKelamin' => $pelayananHead->jeniskelamin,
            'noRegistrasi' => $pelayananHead->noregistrasi,
            'namaPasien' => $pelayananHead->namapasien,
            'lastRuangan' => $pelayananHead->ruanganlast,
            'tglMasuk' => $pelayananHead->tglregistrasi,
            'tglPulang' => $pelayananHead->tglpulang,
            'jenisPasien' => $kelompokPasien,
            'kelasRawat' => $pelayananHead->namakelas2,
            'kelasId' => $pelayananHead->klsid2,
            'noAsuransi' => '-',
            'kelasPenjamin' => '-',
            'namaPenjamin' => $penjamin,
            'penjamin' => $penjamin,
            'deposit' => $this->getDepositPasien($pelayananHead->noregistrasi),
            'totalKlaim' => 0,
            'jumlahBayar' => 0,
            'jumlahPiutang' => 0,
            'billing' => $totalBilling,
            'norec_pd' => $pelayananHead->norec_pd,
            'strukfk' => $value->nostruk,
            'telepon' => $pelayananHead->notelepon,
            'alamat' => $alamatTea,
            'tgllahir' => $pelayananHead->tgllahir,
            'agama' => $agama,
            'umur' => $umur,
            'keluarga' => $keluarga,
            'details' => $details,
            'lalal' => $pelayananHead->nostruklastfk,
            '$isRawatInap' => $isRawatInap,
            'diverif' => $diverif,
            'dibayar' => $dibayar,
            'statuspasien' => $pelayananHead->statuspasien,
        );
        return $this->respond($result);
    }

    public function detailTagihanBill($noRegister, Request $request)
    {
        //        ini_set('max_execution_time', 3000); //6 minutes
        $delete = TempBilling::where('noregistrasi', $noRegister)->delete();
        $pelayananHead = \DB::table('pasiendaftar_t as pd')
            ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            //            ->leftjoin('kelas_m as kl', 'kl.id', '=', 'apd.objectkelasfk')
            //            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftjoin('ruangan_m as ru2', 'ru2.id', '=', 'pd.objectruanganlastfk')
            ->leftjoin('pasien_m as pas', 'pas.id', '=', 'pd.nocmfk')
            ->leftjoin('agama_m as ag', 'ag.id', '=', 'pas.objectagamafk')
            ->leftjoin('jeniskelamin_m as jkel', 'jkel.id', '=', 'pas.objectjeniskelaminfk')
            ->leftjoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftjoin('kelas_m as kls2', 'kls2.id', '=', 'pd.objectkelasfk')
            //            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            ->leftjoin('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
            ->leftjoin('kamar_m as kamar', 'kamar.id', '=', 'apd.objectkamarfk')
            ->select(
                'apd.norec as norec_apd',
                'pd.nocmfk',
                'ru2.objectdepartemenfk as deptid',
                'pd.nocmfk',
                'pd.nostruklastfk',
                'ag.id as agid',
                'ag.agama',
                'pas.tgllahir',
                'kp.id as kpid',
                'kp.kelompokpasien',
                'pas.objectstatusperkawinanfk',
                'pas.namaayah',
                'pas.namasuamiistri',
                'pas.id as pasid',
                'pas.nocm',
                'jkel.id as jkelid',
                'jkel.jeniskelamin',
                'jkel.reportdisplay as jk',
                'pd.noregistrasi',
                'pas.namapasien',
                'pd.tglregistrasi',
                'pd.norec as norec_pd',
                'pd.tglpulang',
                'pas.notelepon',
                'pd.objectrekananfk as rekananid',
                'ru2.namaruangan as ruanganlast',
                'kls2.id as klsid2',
                'kls2.namakelas as namakelas2',
                'rk.namarekanan',
                'kamar.namakamar',
                'pd.kdprofile',
                'pd.statuspasien'
            )
            ->where('pd.noregistrasi', $noRegister);
        $pelayananHead = $pelayananHead->first();

        $pelayanan = \DB::table('pasiendaftar_t as pd')
            ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            //            ->leftjoin('kelas_m as kl', 'kl.id', '=', 'apd.objectkelasfk')
            ->leftjoin('pegawai_m as pgdokter', 'pgdokter.id', '=', 'pp.pelayananpegawaifk')
            ->leftjoin('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->leftjoin('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
            ->leftjoin('jenisproduk_m as jp', 'jp.id', '=', 'djp.objectjenisprodukfk')
            ->leftjoin('kelompokprodukbpjs_m as kpBpjs', 'kpBpjs.id', '=', 'pr.objectkelompokprodukbpjsfk')
            ->leftjoin('kelas_m as kls', 'kls.id', '=', 'apd.objectkelasfk')
            ->leftjoin('strukresep_t as sr', 'sr.norec', '=', 'pp.strukresepfk')
            ->leftjoin('ruangan_m as rusr', 'rusr.id', '=', 'sr.ruanganfk')
            ->leftjoin('pegawai_m as pgsr', 'pgsr.id', '=', 'sr.penulisresepfk')
            ->leftjoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
            ->leftjoin('strukpelayananpenjamin_t as sppj', 'sp.norec', '=', 'sppj.nostrukfk')
            ->leftjoin('strukbuktipenerimaan_t as sbm', 'sp.nosbmlastfk', '=', 'sbm.norec')
            ->leftjoin('pegawai_m as pgsbm', 'pgsbm.id', '=', 'sbm.objectpegawaipenerimafk')
            ->select(
                'pp.norec',
                'pp.tglpelayanan',
                'pp.rke',
                'pr.id as prid',
                'pr.namaproduk',
                'pp.jumlah',
                'pp.produkfk',
                'pp.hargajual',
                'pp.hargadiscount',
                'sp.nostruk',
                'sp.tglstruk',
                'sbm.nosbm',
                'sp.norec as norec_sp',
                'pp.jasa',
                'sr.noresep',
                'rusr.namaruangan as ruanganfarmasi',
                'pgsr.namalengkap as penulisresep',
                'pgdokter.namalengkap as namadokter_pp',
                'kpBpjs.kelompokprodukbpjs as kelompokprodukbpjs',
                'kls.id as klsid',
                'kls.namakelas',
                'kpBpjs.id as kpid',
                'pp.jasa',
                'sp.totalharusdibayar',
                'sp.totalprekanan',
                'sppj.totalppenjamin',
                'sp.totalbiayatambahan',
                'pgsbm.namalengkap as namalengkapsbm',
                'pp.aturanpakai',
                'pp.iscito',
                'pp.isparamedis',
                'jp.jenisproduk',
                'ru.id as ruid',
                'ru.namaruangan'
            )
            ->where('pd.noregistrasi', $noRegister)
            ->orderBy('pp.tglpelayanan', 'pp.rke');


        if ($request['jenisdata'] == 'resep') {
            $pelayanan = $pelayanan->whereNotNull('pp.aturanpakai');
        }
        if ($request['jenisdata'] == 'layanan') {
            if (isset($request['idruangan']) && $request['idruangan'] != "" && $request['idruangan'] != "undefined") {
                $pelayanan = $pelayanan->where('apd.objectruanganfk', $request['idruangan']);
            };
            $pelayanan = $pelayanan->whereNull('pp.aturanpakai');
        }
        $pelayanan = $pelayanan->get();

        $pelayananpetugas = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('pelayananpasienpetugas_t as ptu', 'ptu.nomasukfk', '=', 'apd.norec')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'ptu.objectpegawaifk')
            ->select('ptu.pelayananpasien', 'pg.namalengkap')
            ->where('ptu.objectjenispetugaspefk', 4)
            ->where('pd.noregistrasi', $noRegister)
            ->get();

        if ($request['jenisdata'] == 'bill') {
            $pelayanankelasdijamin = DB::select(
                DB::raw("
                select pp.norec, pd.noregistrasi,pd.objectkelasfk,kls_pd.namakelas,asp.objectkelasdijaminfk,
                kls_dijamin.namakelas as namakelas_dijamin,pp.hargajual,pp.jumlah,
                case when hnpk.harganetto2 is null then pp.hargajual else hnpk.harganetto2 end as harga_kelasdijamin
                from pasiendaftar_t as pd
                LEFT JOIN pemakaianasuransi_t as pas on pas.noregistrasifk=pd.norec
                left join asuransipasien_m as asp on asp.id=pas.objectasuransipasienfk
                left join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                left join pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                left join harganettoprodukbykelas_m as hnpk on hnpk.objectprodukfk=pp.produkfk and hnpk.objectkelasfk=asp.objectkelasdijaminfk
                left join kelas_m as kls_pd on kls_pd.id=pd.objectkelasfk
                left join kelas_m as kls_dijamin on kls_dijamin.id=asp.objectkelasdijaminfk
                where noregistrasi=:noregistrasi;
            "),
                array(
                    'noregistrasi' => $noRegister,
                )
            );
        }
        $totototol = 0;

        if (count($pelayanan) > 0) {
            $alamat = [];
            $alamat = \DB::table('alamat_m as al')
                ->select('al.alamatlengkap')
                ->where('al.nocmfk', $pelayananHead->nocmfk)
                ->first();

            if (empty($alamat)) {
                $alamatTea = '0';
            } else {
                $alamatTea = $alamat->alamatlengkap;
            }

            $totalBilling = 0;
            $norecAPD = '';
            $norecSP = '';
            $details = array();
            $dibayar = 0;
            $diverif = 0;
            foreach ($pelayanan as $value) {
                //                $isRawatInap = false;
                //                if ($value->deptid == 16) {
                //                    $isRawatInap = true;
                //                }
                //                if ($value->produkfk == $this->getProdukIdDeposit()) {
                //                    continue;
                //                }
                //                $komponen = [];
                //                $dokter = [];
                $NamaDokter = '-';
                foreach ($pelayananpetugas as $hahaha) {
                    if ($hahaha->pelayananpasien == $value->norec) {
                        $NamaDokter = $hahaha->namalengkap;
                    }
                }
                //
                //                $jasa = 0;
                //                if (isset($value->jasa) && $value->jasa != "" && $value->jasa != "undefined") {
                //                    $jasa = $value->jasa;
                //                }
                //                $kmpn = [];
                //
                //                $harga = (float)$value->hargajual;
                //                $diskon = (float)$value->hargadiscount;
                //                $detail = array(
                //                    'norec' => $value->norec,
                //                    'tglPelayanan' => $value->tglpelayanan,
                //                    'namaPelayanan' => $value->namaproduk,
                //                    'dokter' => $NamaDokter,
                //                    'jumlah' => $value->jumlah,
                //                    'kelasTindakan' => @$value->namakelas,
                //                    'ruanganTindakan' => @$value->namaruangan,
                //                    'harga' => $harga,
                //                    'diskon' => $diskon,
                //                    'total' => (($harga - $diskon) * $value->jumlah) + $jasa,
                //                    'jppid' => '',
                //                    'jenispetugaspe' => '',
                //                    'strukfk' => $value->nostruk . ' / ' . $value->nosbm,
                //                    'sbmfk' => $value->nosbm,
                //                    'pgid' => '',
                //                    'ruid' => $value->ruid,
                //                    'prid' => $value->prid,
                //                    'klid' => $value->klid,
                //                    'norec_apd' => $value->norec_apd,
                //                    'norec_pd' => $value->norec_pd,
                //                    'norec_sp' => $value->norec_sp,
                //                    'komponen' => $kmpn,
                //                    'jasa' => $jasa,
                //                    'aturanpakai' => $value->aturanpakai,
                //                    'iscito' => $value->iscito,
                //                    'isparamedis' => $value->isparamedis
                //                );
                //
                //                if (is_null($value->nosbm) == true) {
                //                    $dibayar = $dibayar + (($harga - $diskon) * $value->jumlah) + $jasa;
                //                }
                //                if (is_null($value->nostruk) == true) {
                //                    $diverif = $diverif + (($harga - $diskon) * $value->jumlah) + $jasa;
                //                }
                //                $norecAPD = $value->norec_apd;
                //                $norecSP = $value->norec_sp;
                //                $totalBilling = $totalBilling + (($harga - $diskon) * $value->jumlah) + $value->jasa;
                //                $total =  (($harga - $diskon) * $value->jumlah) + $value->jasa;
                //                $details[] = $detail;

                //                $totototol = $totototol + $total;
                if ($request['jenisdata'] == 'bill') {
                    $kelas_dijamin = 0;
                    $harga_dijamin = 0;
                    $total_dijamin = 0;
                    foreach ($pelayanankelasdijamin as $kupret) {
                        if ($value->norec == $kupret->norec) {
                            $kelas_dijamin = $kupret->namakelas_dijamin;
                            $harga_dijamin = $kupret->harga_kelasdijamin;
                            $total_dijamin = ((float)$kupret->harga_kelasdijamin * (float)$value->jumlah) + $value->jasa;
                        }
                    }
                    //                    try {
                    $namakelas = $value->namakelas;
                    $ruanganTindakan = $value->namaruangan;
                    $jenisprodukmaster = $value->jenisproduk;
                    if ($value->kpid == 2) {
                        $jenisproduk = $value->kelompokprodukbpjs;
                    } else {
                        $jenisproduk = $value->jenisproduk;
                    }

                    if ($value->noresep != null) {
                        $namakelas = '';
                        $ruanganTindakan = $value->ruanganfarmasi . '     Resep No: ' . $value->noresep;
                        //                    $jenisproduk = 'Resep';
                    }
                    //                    if ($value->namaproduk == 'Biaya Administrasi') {
                    //                        $ruanganTindakan = $dataRuangan->namaruangan;
                    //                    }
                    //                    if ($value->namaproduk == 'Biaya Materai') {
                    //                        $ruanganTindakan = $dataRuangan->namaruangan;
                    //                    }
                    //Biaya Administrasi
                    $namarekanan = '-';
                    if ($pelayananHead->namarekanan != null) {
                        $namarekanan = $pelayananHead->namarekanan;
                    }
                    $namaproduk = $value->namaproduk;
                    if ($value->rke != null) {
                        $namaproduk = 'R/' . $value->rke . ' ' . $value->namaproduk;
                    }

                    $hargadiscount = 0;
                    if ($value->hargadiscount != null) {
                        $hargadiscount = $value->hargadiscount;
                    }


                    $hargakurangdiskon = (float)$value->hargajual - $hargadiscount;
                    $hargakalijml = $hargakurangdiskon * (float)$value->jumlah;
                    $jasa = 0;
                    if ($value->jasa != null) {
                        $jasa = $value->jasa;
                    }
                    $total = ((float)$value->jumlah * ((float)$value->hargajual - $hargadiscount)) + $jasa;


                    $namakamar = '-';
                    if ($pelayananHead->namakamar != null) {
                        $namakamar = $pelayananHead->namakamar;
                    }
                    $totalprekanan = 0;
                    if ($value->totalprekanan != null) {
                        $totalprekanan = $value->totalprekanan;
                    }
                    $totalppenjamin = 0;
                    if ($value->totalppenjamin != null) {
                        $totalppenjamin = $value->totalppenjamin;
                    }
                    $totalbiayatambahan = 0;
                    if ($value->totalbiayatambahan != null) {
                        $totalbiayatambahan = $value->totalbiayatambahan;
                    }
                    $totalharusdibayar = $value->totalharusdibayar;
                    if ($value->totalharusdibayar < 0) {
                        $totalharusdibayar = 0;
                    }

                    $temp = new TempBilling(); #
                    $tempNorec = $temp->generateNewId(); #
                    $temp->norec = $tempNorec; #
                    $temp->norec_pp = $value->norec; #
                    $temp->tglstruk = $value->tglstruk; #
                    $temp->nobilling = $noRegister; #
                    $temp->nokwitansi = $value->nosbm; #
                    $temp->noregistrasi = $noRegister; #
                    $temp->nocm = $pelayananHead->nocm; #
                    $temp->namapasienjk = $pelayananHead->namapasien . ' ( ' . $pelayananHead->jk . ' )'; #
                    $temp->unit = $pelayananHead->ruanganlast; #
                    $temp->objectdepartemenfk = $pelayananHead->deptid; #
                    $temp->namakelas = $namakelas; #
                    $temp->dokterpj = ''; //$value->dokterpj;#
                    $temp->tglregistrasi = $pelayananHead->tglregistrasi; #
                    $temp->tglpulang = $pelayananHead->tglpulang; #
                    $temp->namarekanan = $namarekanan; #
                    $temp->tglpelayanan = $value->tglpelayanan; #
                    $temp->ruangantindakan = $ruanganTindakan; #
                    $temp->namaproduk = $namaproduk; #
                    $temp->penulisresep = $value->penulisresep; #
                    $temp->jenisproduk = $jenisproduk; #
                    $temp->dokter = $value->namadokter_pp; #
                    $temp->jumlah = $value->jumlah; #
                    $temp->hargajual = $value->hargajual; #
                    $temp->diskon = $hargadiscount; #
                    $temp->total = $total; #
                    $temp->namakamar = $namakamar; #
                    $temp->tipepasien = $pelayananHead->kelompokpasien; #
                    $temp->totalharusdibayar = $totalharusdibayar; #
                    $temp->totalprekanan = $totalprekanan; #
                    $temp->totalppenjamin = $totalppenjamin; #
                    $temp->totalbiayatambahan = $totalbiayatambahan; #
                    $temp->user = $value->namalengkapsbm; #
                    $temp->namakelaspd = $pelayananHead->namakelas2; #
                    $temp->nama_kelasasal = $kelas_dijamin; #
                    $temp->hargajual_kelasasal = $harga_dijamin; #
                    $temp->total_kelasasal = $total_dijamin; #
                    $temp->jenisprodukmaster = $value->jenisproduk;
                    $temp->save();

                    //                        $transStatus = 'true';
                    //                    } catch (\Exception $e) {
                    //                        $transStatus = 'false';
                    //                        $transMessage = "Simpan TEMP";
                    //                    }
                }
            }
        }

        return $this->respond('as@epic');
    }
    public function cetakDetailTagihan($noRegister)
    {
        $pasienDaftar = PasienDaftar::where('noregistrasi', $noRegister)->first();
        if (!$pasienDaftar) {
            $this->setStatusCode(400);
            return $this->respond([], 'No registrasi Tidak Terdaftar');
        }
        try {
            //$pelayanan = $this->getPelayananPasienByNoRegistrasi($noRegister);
            $pelayanan = \DB::table('pasiendaftar_t as pd')
                ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                ->join('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
                ->join('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
                ->join('kelas_m as kl', 'kl.id', '=', 'apd.objectkelasfk')
                ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                ->join('pelayananpasienpetugas_t as ptu', 'ptu.pelayananpasien', '=', 'pp.norec')
                ->join('pegawai_m as pg', 'pg.id', '=', 'ptu.objectpegawaifk')
                ->join('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
                ->join('jenisproduk_m as jp', 'jp.id', '=', 'djp.objectjenisprodukfk')
                ->leftjoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
                ->select(
                    'pp.norec',
                    'pp.tglpelayanan',
                    'pr.namaproduk',
                    'pp.jumlah',
                    'kl.namakelas',
                    'ru.namaruangan',
                    'pp.produkfk',
                    'pp.hargajual',
                    'pg.namalengkap',
                    'pr.id as produkId',
                    'jp.jenisproduk',
                    'sp.nostruk'
                )
                ->whereNotNull('pd.tglpulang')
                //->whereNull('pp.strukfk')
                ->where('pd.noregistrasi', $noRegister)
                ->get();;
        } catch (\Exception $e) {
            $pelayanan = array();
        }

        $isRawatInap = $this->isPasienRawatInap($pasienDaftar);

        if (count($pelayanan) == 0) {
        }
        $totalBilling = 0;
        $details = array();
        foreach ($pelayanan as $value) {
            if ($value->produkfk == $this->getProdukIdDeposit()) {
                continue;
            }
            //$pelayananpetugas = PelayananPasienPetugas::where('pelayananpasien', $value->norec)->first();
            $namaDokter = $value->namalengkap; //  ($pelayananpetugas && $pelayananpetugas->pegawai) ? $pelayananpetugas->pegawai->namalengkap : "-";
            $harga = ($value->hargajual == null) ? 0 : $value->hargajual;

            $tglPelayanan = Carbon::createFromFormat('Y-m-d', substr($value->tglpelayanan, 0, 9));
            //            try {
            //                $datatatata = AntrianPasienDiperiksa::where('norec','ff8081815d3a179b015d3a3667590012')->get();
            //                $ruangan = $value->antrian_pasien_diperiksa;//->ruangan->namaruangan;
            //            } catch (\Exception $e) {
            //                $ruangan = '-';
            //            }
            $ruangan = $value->namaruangan;
            //            try {
            //                $jenisProduk = $value->produk->detail_jenis_produk->jenis_produk->jenisproduk;
            //            } catch (\Exception $e) {
            //                $jenisProduk = '-';
            //            }


            $detail = array(
                'tglPelayanan' => $this->getDateReport($tglPelayanan),
                'namaPelayanan' => $value->namaproduk, // $value->produk->namaproduk,
                'dokter' => $namaDokter,
                'jumlah' => $this->getQtyFormatString($value->jumlah),
                'harga' => $this->getMoneyFormatString($harga),
                'total' => $this->getMoneyFormatString($harga * $value->jumlah),
                'noKode' => $value->produkId, // $value->produk->id,
                'kelasrawat' => $value->namakelas,
                'ruangan' => $ruangan,
                'jenisProduk' => $value->jenisproduk, // $jenisProduk,
                'strukfk' => $value->nostruk,
            );
            $totalBilling = $totalBilling + ($value->hargajual * $value->jumlah);
            $details[] = $detail;
        }
        if ($pasienDaftar->nostruklastfk == null && $isRawatInap) {
            $biayaAdministrasi = (int)($totalBilling * $this->getPercentageBiayaAdmin());

            $detail = array(
                'tglPelayanan' => Carbon::now()->toDateString(),
                'namaPelayanan' => $this->getProdukBiayaAdministrasi()->namaproduk,
                'dokter' => '-',
                'jumlah' => 1,
                'harga' => $this->getMoneyFormatString($biayaAdministrasi),
                'total' => $this->getMoneyFormatString($biayaAdministrasi),
                'strukfk' => '-',
            );
            $totalBilling += $biayaAdministrasi;
            if ($biayaAdministrasi > 0) {
                $details[] = $detail;
            }

            $biayaMaterai = $this->getBiayaMaterai($totalBilling);
            $detail = array(
                'tglPelayanan' => Carbon::now()->toDateString(),
                'namaPelayanan' => $this->getProdukBiayaMaterai()->namaproduk,
                'dokter' => '-',
                'jumlah' => 1,
                'harga' => $this->getMoneyFormatString($biayaMaterai),
                'total' => $this->getMoneyFormatString($biayaMaterai),
                'strukfk' => '-',
            );
            $totalBilling += $biayaMaterai;
            if ($biayaMaterai > 0) {
                $details[] = $detail;
            }
        }

        //$penjamin=$this->getPenjamin($pasienDaftar)->namarekanan;
        try {
            $tipe = $pasienDaftar->kelompok_pasien->kelompokpasien;
        } catch (\Exception $e) {
            $tipe = '-';
        }
        try {
            $penjamin = $pasienDaftar->rekanan->namarekanan;
        } catch (\Exception $e) {
            $penjamin = 'A';
        }
        try {
            $unit = $pasienDaftar->last_ruangan->namaruangan;
        } catch (\Exception $e) {
            $unit = '-';
        }
        try {
            $data123 = \DB::table('antrianpasiendiperiksa_t as ap')
                ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'ap.noregistrasifk')
                ->join('kamar_m as k', 'k.id', '=', 'ap.objectkamarfk')
                ->select('k.id as kId', 'k.namakamar')
                ->whereNotNull('ap.objectkamarfk')
                ->where('pd.noregistrasi', $noRegister)
                ->first();
            $kamar = $data123->namakamar;
        } catch (\Exception $e) {
            $kamar = '-';
        }

        try {
            $bed = '-';
        } catch (\Exception $e) {
            $bed = '-';
        }

        try {
            $dokter = $pasienDaftar->dokter->namalengkap;
        } catch (\Exception $e) {
            $dokter = '-';
        }
        try {
            $totalKlaim = $pasienDaftar->dokter->namalengkap;
        } catch (\Exception $e) {
            $totalKlaim = 0;
        }


        $tglMasuk = Carbon::createFromFormat('Y-m-d H:i:s', $this->subDateTime($pasienDaftar->tglregistrasi));

        //return $this->respond(array(isset($pasienDaftar->tglpulang)?"--":"+++"));

        //        isset($pasienDaftar->tglpulang)?
        //            $tglPulang = Carbon::createFromFormat('Y-m-d H:i:s',$this->subDateTime($pasienDaftar->tglpulang)):
        //            $tglPulang =Carbon::createFromFormat('Y-m-d H:i:s',$this->subDateTime($this->getDateTime()));
        //return $this->respond(array($tglPulang));
        if (isset($pasienDaftar->tglpulang)) {
            $tglPulang = Carbon::createFromFormat('Y-m-d H:i:s', $this->subDateTime($pasienDaftar->tglpulang));
        } else {
            $tglPulang = Carbon::createFromFormat('Y-m-d H:i:s', $this->subDateTime($this->getDateTime()));
        }


        //$tglPulang = Carbon::createFromFormat('Y-m-d H:i:s',$this->subDateTime($pasienDaftar->tglpulang));

        $deposit = $this->getDepositPasien($pasienDaftar->noregistrasi);
        $diskonJasaMedis = 0;
        $diskonUmum = 0;
        $sisaDeposit = 0;
        $harusDibayar = $totalBilling - $deposit - $diskonJasaMedis - $diskonUmum - $sisaDeposit;

        //        disini nanti untuk manage cetaknya
        $historiCetak = HistoriCetakDokumen::where('nobuktitransaksi', $pasienDaftar->norec)->where(
            'kdobjeckmodulaplikasi',
            'CETAK01'
        )->get();

        $cetakKe = count($historiCetak);
        $nomorCetak = $cetakKe + 1;
        $tanggalcetak = Carbon::now();
        $historyCetak = new HistoriCetakDokumen();
        $dataCetak = array(
            'norec' => $historyCetak->generateNewId(),
            'kdprofile' => 1,
            'nohistori' => $this->generateCode($historyCetak, 'nohistori', 14, 'CETAK-' . $this->getDateTime()->format('ym')),
            'kdobjeckmodulaplikasi' => 'CETAK01',
            'nobuktitransaksi' => $pasienDaftar->norec,
            'cetakke' => $nomorCetak,
            'tglcetak' => $tanggalcetak,
            'keteranganlainnya' => "cetak detal tagihan No. Registrasi: " . $noRegister,
            'statusenabled' => 1,
        );

        $historyCetak->create($dataCetak);

        $result = array(
            //            'data' => $pelayanan,
            'pasienID' => $pasienDaftar->pasien->id,
            'noCm' => $pasienDaftar->pasien->nocm,
            'jenisKelamin' => $pasienDaftar->pasien->jenis_kelamin->namaexternal,
            'noRegistrasi' => $pasienDaftar->noregistrasi,
            'namaPasien' => $pasienDaftar->pasien->namapasien,
            'lastRuangan' => $pasienDaftar->last_ruangan->namaruangan,
            'unit' => $unit, //$pasienDaftar->last_ruangan->departemen->namadepartemen,
            'kamar' => $kamar,
            'tglMasuk' => $this->getDateReport($tglMasuk),
            'tglPulang' => $this->getDateReport($tglPulang),
            'jenisPasien' => $pasienDaftar->kelompok_pasien->kelompokpasien,
            'penjamin' => $penjamin,
            'tipe' => $tipe,
            'kelasRawat' => $pasienDaftar->kelas->namakelas,
            'dokter' => $dokter,
            'noAsuransi' => '-', //ambil dari asuransi pasien -m tapi datanya blum ada brooo..
            'kelasPenjamin' => '-', //ini blum ada datanya gimana mau liat,, gila yaa ?
            'namaPenjamin' => '-', //ini blum ada datanya gimana mau liat,, gila yaa ?
            'billing' => $this->getMoneyFormatString($totalBilling),
            'deposit' => $this->getMoneyFormatString($deposit), //ngambil dari mana
            'diskonJasaMedis' => $diskonJasaMedis,
            'diskonUmum' => $this->getMoneyFormatString($diskonUmum),
            'sisaDeposit' => $this->getMoneyFormatString($sisaDeposit),
            'totalKlaim' => 0, //ngambil dari mana? dihitunga gak
            'jumlahPiutang' => 0, //ini ngambil dari pembayaran gak ?
            'harusDibayar' => $this->getMoneyFormatString($harusDibayar),
            'terbilangHarusDibayar' => ucwords($this->makeTerbilang($harusDibayar, ' rupiah')),
            'nomorCetak' => $nomorCetak,
            'tglCetak' => $this->getDateTimeReport($tanggalcetak),
            'details' => $details,  //yang udah ada detailnya yang mana yaa ?
        );
        return $this->respond($result);
    }
    public function cetakPasienPulang($noRegister)
    {
        $pasienDaftar = PasienDaftar::where('noregistrasi', $noRegister)->first();
        $result = array(
            'pasienID' => $pasienDaftar->pasien->id,
            'noCm' => $pasienDaftar->pasien->nocm,
            'jenisKelamin' => $pasienDaftar->pasien->jenis_kelamin->namaexternal,
            'noRegistrasi' => $pasienDaftar->noregistrasi,
            'namaPasien' => $pasienDaftar->pasien->namapasien,
            'lastRuangan' => $pasienDaftar->last_ruangan->namaruangan,
            'tglMasuk' => $pasienDaftar->tglregistrasi,
            'tglPulang' => $pasienDaftar->tglpulang,
            'jenisPasien' => $pasienDaftar->kelompok_pasien->kelompokpasien,
        );
        return $this->respond($result);
    }

    public function batalVerifikasiTagihan(Request $request)
    {
        $transMsg = null;
        $totalBilling = 0;
        $totalDeposit = 0;
        $noRegister = $request['noregistrasi'];
        $NorecSP = $request['norec_sp'];

        DB::beginTransaction();
        try {
            $dataSP = \DB::table('pasiendaftar_t as pd')
                ->leftJoin('strukpelayanan_t as sp', 'sp.noregistrasifk', '=', 'pd.norec')
                ->select('sp.norec', 'sp.nostruk', 'pd.norec as norec_pd', 'pd.noregistrasi')
                ->where('pd.noregistrasi', '=', $noRegister)
                ->where('sp.norec', '=', $NorecSP)
                ->where('sp.nosbmlastfk', '=', null)
                ->whereNull('sp.statusenabled')
                ->get();

            foreach ($dataSP as $item) {
                $nostrukPelayananVerifikasi = $NorecSP; //$item->norec;//$pasienDaftar->nostruklastfk;
                $norec_pd = $item->norec_pd; //$pasienDaftar->nostruklastfk;


                $sbm = StrukBuktiPenerimaan::where('nostrukfk', $nostrukPelayananVerifikasi)->first();
                $sbk = StrukBuktiPengeluaran::where('nostrukfk', $nostrukPelayananVerifikasi)->first();
                if ($sbm || $sbk) {
                    $transStatus = false;
                    $transMsg = "Tagihan ini sudah ada pembayarannya";
                }


                $data2 = PelayananPasien::where('strukfk', $nostrukPelayananVerifikasi)
                    ->where('produkfk', 10011572) //$this->getProdukBiayaAdministrasi()->id)
                    //                        ->update([
                    //                            'noregistrasifk' => null,
                    //                            'strukfk' => null,
                    //                            'hargasatuan' => 0,
                    //                            'harganetto' => 0,
                    //                            'jumlah' => 0,
                    //                            'keteranganlain' => 'DELETED',
                    //                        ]);
                    ->delete();
                $data3 = PelayananPasien::where('strukfk', $nostrukPelayananVerifikasi)
                    ->where('produkfk', 10011500) //$this->getProdukBiayaMaterai()->id)
                    //                        ->update([
                    //                            'noregistrasifk' => null,
                    //                            'strukfk' => null,
                    //                            'hargasatuan' => 0,
                    //                            'harganetto' => 0,
                    //                            'jumlah' => 0,
                    //                            'keteranganlain' => 'DELETED',
                    //                        ]);
                    ->delete();
                $data1 = PelayananPasien::where('strukfk', $nostrukPelayananVerifikasi)
                    ->update([
                        'strukfk' => null,
                    ]);
                $data4 = PelayananPasienDetail::where('strukfk', $nostrukPelayananVerifikasi)
                    ->update([
                        'strukfk' => null,
                    ]);
                $data5 = StrukPelayananPenjamin::where('nostrukfk', $nostrukPelayananVerifikasi)
                    ->update([
                        'statusenabled' => 0
                    ]);

                $data6 = PasienDaftar::where('norec', $norec_pd)
                    ->update([
                        'nostruklastfk' => null,
                    ]);

                $data7 = StrukPelayanan::where('norec', $nostrukPelayananVerifikasi)
                    ->update([
                        //                        'statusenabled' => false,
                        'statusenabled' => 0,
                    ]);
                //                $pelayanan = $pasienDaftar->pelayanan_pasien()->select('pelayananpasien_t.*')->where('strukfk', $nostrukPelayananVerifikasi)->get();
                //                $pelayananDetail = $pasienDaftar->pelayanan_pasien_detail()->where('strukfk', $nostrukPelayananVerifikasi)->get();
                //                $strukPelayanan = StrukPelayanan::find($nostrukPelayananVerifikasi);
                //                $SPP = StrukPelayananPenjamin::where('nostrukfk', $strukPelayanan->norec);
                //            }


                //            if ($transStatus) {
                //                foreach ($pelayanan as $pel) {
                //                    $noStrukPelayanan = $pel->strukfk;
                //                    if ($pel->produkfk == $this->getProdukBiayaAdministrasi()->id || $pel->produkfk == $this->getProdukBiayaMaterai()->id) {
                //                        $pel->delete();
                //                    } else {
                //                        $pel->strukfk = null;
                //                        try {
                //                            $pel->save();
                //                        } catch (\Exception $e) {
                //                            $transStatus = false;
                //                            $transMsg = "Transaksi Gagal (update pp)";
                //                            break;
                //                        }
                //                    }
                //
                //                }
                //            }

                //            if ($transStatus) {
                //                foreach ($pelayananDetail as $pelDel) {
                //                    $pelDel->strukfk = null;
                //                    try {
                //                        $pelDel->save();
                //                    } catch (\Exception $e) {
                //                        $transStatus = false;
                //                        $transMsg = "Transaksi Gagal (insert SP)";
                //                        break;
                //                    }
                //                }
                //
                //            }

                //            if ($transStatus) {
                //                //$SPP->statusenabled = 0;
                //                try {
                //                    //$SPP->save();
                //                    $lah = StrukPelayananPenjamin::where('nostrukfk', $strukPelayanan->norec)->update(['statusenabled' => 0]);
                //                } catch (\Exception $e) {
                //                    $transStatus = false;
                //                    $transMsg = $strukPelayanan->norec . "update statusenabled SPP";
                //
                //                }
                //
                //            }


                //            if ($transStatus) {
                //                $pasienDaftar->nostruklastfk = null;
                //                try {
                //                    $pasienDaftar->save();
                //                } catch (\Exception $e) {
                //                    $transStatus = false;
                //                    $transMsg = "Transaksi Gagal (insert SP)";
                //                }
                //            }


                //            if ($transStatus) {
                //                $strukPelayanan->statusenabled = 0;
                //                try {
                //                    //$strukPelayanan->delete();//## ga usah di delete lah sepertinya
                //                    $strukPelayanan->save();
                //                } catch (\Exception $e) {
                //                    $transStatus = false;
                //                    $transMsg = "Transaksi Gagal (insert SP)";
                //                }
                //            }
            }

            $transStatus = true;
        } catch (\Exception $e) {
            $transStatus = false;
        }
        if ($transStatus) {
            //jurnal verif sP
            $logAcc = new  LogAcc;
            $logAcc->norec = $logAcc->generateNewId();
            $logAcc->jenistransaksi = 'Batal Verifikasi TataRekening';
            $logAcc->noreff = $noRegister;
            $logAcc->status = 0;
            $logAcc->tanggal = $this->getDateTime()->format('Y-m-d H:i:s');
            if ($transStatus) {
                try {
                    $logAcc->save();
                } catch (\Exception $e) {
                    $transStatus = false;
                    $transMsg = "Simpan logAcc batal verif tarek Gagal {SP}";
                }
            }
        }

        if ($transStatus == 'true') {
            DB::commit();
            $transMessage = 'Unverifikasi Tagihan Berhasil';
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "data" => $dataSP,
                "as" => 'as@epic',
                "edited" => 'as@epic'
            );
        } else {
            DB::rollBack();
            $transMessage = 'Unverifikasi Tagihan Gagal';
            $result = array(
                "status" => 400,
                "message" => 'Unverifikasi Tagihan Gagal',
                "data" => $dataSP,
                "as" => 'as@epic',
                "edited" => 'as@epic'
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        /* EDITED 24 - Dec - 2019 16:40 */
    }

    public function UpdateHargaPelayananPasien(Request $request)
    {
        //        DB::beginTransaction();
        $transStatus = 'false';
        if ($request['norec'] == 0) {
            //            $data = new PelayananPasien();
            //            $norecHead = $data->generateNewId();
            //            $data->norec = $norecHead;
            //
            //            $data->kdprofile = 0;
            //            $data->statusenabled = true;
            //            $data->noregistrasifk = $request['noregistrasifk'];
            //            $data->tglregistrasi = $request['tglregistrasi'];
            //            $data->hargadiscount = $request['hargadiscount'];
            //            $data->hargajual = $request['hargajual'];
            //            $data->hargasatuan = $request['hargasatuan'];
            //            $data->jumlah = $request['jumlah'];
            //            $data->kelasfk = $request['kelasfk'];
            //            $data->kdkelompoktransaksi = $request['kdkelompoktransaksi'];
            //            $data->keteranganlain = $request['keteranganlain'];
            //            $data->nilainormal = $request['nilainormal'];
            //            $data->piutangpenjamin = $request['piutangpenjamin'];
            //            $data->piutangrumahsakit = $request['piutangrumahsakit'];
            //            $data->produkfk = $request['produkfk'];
            //            $data->status = $request['status'];
            //            $data->tglpelayanan = $request['tglpelayanan'];
            //            $data->harganetto = $request['harganetto'];
            //            $data->stock = $request['stock'];
            //            $data->save();
        } else {
            //            $dataPelayananPasien = PelayananPasien::where('norec', $request['norec'])->first();
            //
            //            $dataPelayananPasien->hargajual = $request['harga'];
            //            $dataPelayananPasien->hargasatuan = $request['harga'];
            //            $dataPelayananPasien->harganetto = $request['harga'];
            //            $dataPelayananPasien->jumlah = $request['jumlah'];
            //            try{
            //                $dataPelayananPasien->save();
            //                $transStatus = 'true';
            //            }
            //            catch(\Exception $e){
            //                $transStatus= false;
            ////                $transMessage = "Transaksi Gagal (insert SP)";
            //            }
            //            try{
            //                PelayananPasien::where('norec', $request['norec'])
            //                    ->update([
            //                            'hargajual' => (float)$request['harga'],
            //                            'hargasatuan' => (float)$request['harga'],
            //                            'harganetto' => (float)$request['harga'],
            //                            'jumlah' => (integer)$request['jumlah']]
            //                    );
            $harga = $request['harga'];
            $jumlah = $request['jumlah'];
            $norec = $request['norec'];
            $result = DB::select(
                DB::raw("update pelayananpasien_t set hargajual=$harga,hargasatuan=$harga,
                  harganetto=$harga, jumlah=$jumlah where norec='$norec'"),
                array()
            );
            //                $transStatus = 'true';
            //            }catch(\Exception $e){
            //                $transStatus= false;
            ////                $transMessage = "Transaksi Gagal (insert SP)";
            //            }
        }

        //        if ($transStatus == 'true') {
        //            DB::commit();
        //            $transMessage = "Simpan Pelayanan Berhasil";
        //            return $this->setStatusCode(201)->respond([], $transMessage);
        //        } else {
        //            DB::rollBack();
        //            $transMessage = "Simpan Pelayanan gagal";
        //            return $this->setStatusCode(400)->respond([], $transMessage);
        //        }
    }
    public function HapusPelayananPasien(Request $request)
    {
        //        DB::beginTransaction();
        $transStatus = 'false';
        if ($request['norec'] != 0) {
            try {
                $data1 = PelayananPasienDetail::where('pelayananpasien', $request['norec'])->delete();
                $transStatus = 'true';
            } catch (\Exception $e) {
                $transStatus = false;
                //                $transMessage = "Transaksi Gagal (insert SP)";
            }
            try {
                $data2 = PelayananPasienPetugas::where('pelayananpasien', $request['norec'])->delete();
                $transStatus = 'true';
            } catch (\Exception $e) {
                $transStatus = false;
                //                $transMessage = "Transaksi Gagal (insert SP)";
            }
            try {
                $data = PelayananPasien::where('norec', $request['norec'])->delete();
                $transStatus = 'true';
            } catch (\Exception $e) {
                $transStatus = false;
                //                $transMessage = "Transaksi Gagal (insert SP)";
            }
        }

        //        if ($transStatus == 'true') {
        //            DB::commit();
        $transMessage = "hapus Pelayanan Berhasil";
        return $this->setStatusCode(201)->respond([], $transMessage);
        //        } else {
        //            DB::rollBack();
        //            $transMessage = "hapus Pelayanan gagal";
        //            return $this->setStatusCode(400)->respond([], $transMessage);
        //        }
    }
    public function getTableMaster(Request $request)
    {
        $dataLogin = $request->all();
        $KelompokUser = DB::select(
            DB::raw("select ku.id,ku.kelompokuser from loginuser_s as lu 
                    INNER JOIN kelompokuser_s as ku on lu.objectkelompokuserfk=ku.id
                    where lu.id =:IDIDID;"),
            array(
                'IDIDID' => $dataLogin['userData']['id'],
            )
        );
        $data1 = JenisPetugasPelaksana::where('statusenabled', true)->get();
        foreach ($data1 as $item1) {
            $data11[] = array(
                'id' => $item1->id,
                'jenispetugaspe' => $item1->jenispetugaspe,
            );
        }
        $data2 = Pegawai::whereIn('objectjenispegawaifk', array(1, 2, 3))->get();
        $dataDokter = Pegawai::whereIn('objectjenispegawaifk', array(1))->get();
        foreach ($data2 as $item2) {
            $data22[] = array(
                'id' => $item2->id,
                'paramedis' => $item2->namalengkap,
            );
        }
        $data3 = Ruangan::whereIn('objectdepartemenfk', array(3, 16, 17, 18, 24, 25, 26, 27, 28))->get();
        foreach ($data3 as $item3) {
            $data33[] = array(
                'id' => $item3->id,
                'ruanganTindakan' => $item3->namaruangan,
            );
        }
        $dataDept = Departemen::whereIn('id', array(3, 16, 17, 18, 24, 25, 26, 27, 28))->get();
        foreach ($dataDept as $item3) {
            $datadept3[] = array(
                'id' => $item3->id,
                'namadepartemen' => $item3->namadepartemen,
            );
        }
        $data3 = Ruangan::whereIn('objectdepartemenfk', array(3, 16, 17, 18, 24, 25, 26, 27, 28))->get();
        foreach ($data3 as $item3) {
            $data33[] = array(
                'id' => $item3->id,
                'ruanganTindakan' => $item3->namaruangan,
            );
        }
        $result = array(
            'JenisPetugasPelaksana' => $data11,
            'Pegawai' => $data22,
            'dokter' => $dataDokter,
            'Ruangan' => $data33,
            'departemen' => $datadept3,
            'datalogin' => $dataLogin,
            'kelompokuser' => $KelompokUser,
            'xby' => 'as@epic',
        );
        return $this->respond($result);
    }
    public function getLogin(Request $request)
    {
        $dataLogin = $request->all();
        $dataPegawai = \DB::table('loginuser_s as lu')
            ->select('lu.objectpegawaifk')
            ->where('lu.id', $dataLogin['userData']['id'])
            ->first();
        $KelompokUser = DB::select(
            DB::raw("select ku.id,ku.kelompokuser from loginuser_s as lu 
                    INNER JOIN kelompokuser_s as ku on lu.objectkelompokuserfk=ku.id
                    where lu.id =:IDIDID;"),
            array(
                'IDIDID' => $dataLogin['userData']['id'],
            )
        );

        $dataAPD = DB::select(
            DB::raw("
                 select x.norec,x.id,x.namaruangan,x.tglmasuk,x.objectkelompokpasienlastfk,x.objectdepartemenfk from (select  apd.norec,ru.id,ru.namaruangan ,apd.tglmasuk,pd.objectkelompokpasienlastfk, ru.objectdepartemenfk
                from pasiendaftar_t as pd
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                where pd.noregistrasi=:noregistrasi and apd.statusenabled=true
                  
                 ) as x group by x.norec,x.id,x.namaruangan,x.tglmasuk,x.objectkelompokpasienlastfk,x.objectdepartemenfk order by x.tglmasuk asc
            "),
            array(
                'noregistrasi' => $request['noRegistrasi'],
            )
        );
        $komponen = \DB::table('komponenharga_m as dp')
            ->select('dp.komponenharga', 'dp.id')
            ->where('dp.statusenabled', true)
            ->orderBy('dp.komponenharga')
            ->get();
        $result = array(
            'datalogin' => $dataLogin,
            'kelompokuser' => $KelompokUser,
            'listRuangan' => $dataAPD,
            'pegawailoginfk' => $dataPegawai,
            'komponen' => $komponen,
            'xby' => 'as@epic',
        );
        return $this->respond($result);
    }
    public function getProdukbyRuangan(Request $request)
    {
        $data4 = \DB::table('produk_m as pr')
            ->join('mapruangantoproduk_m as mrp', 'mrp.objectprodukfk', '=', 'pr.id')
            ->select('pr.id', 'pr.namaproduk as namaPelayanan')
            ->where('mrp.objectruanganfk', $request['objectruanganfk'])
            ->get();
        foreach ($data4 as $item) {
            $result[] = array(
                'id' => $item->id,
                'namaPelayanan' => $item->namaPelayanan,
            );
        };
        $result[] = array(
            'id' => 395,
            'namaPelayanan' => 'Karcis',
        );

        return $this->respond($result);
    }
    public function getKelasByProduk(Request $request)
    {
        $data4 = \DB::table('kelas_m as kl')
            ->join('harganettoprodukbykelas_m as hnp', 'hnp.objectkelasfk', '=', 'kl.id')
            ->select('kl.id', 'kl.namakelas as kelasTindakan', 'hnp.hargasatuan')
            ->where('hnp.objectprodukfk', $request['objectprodukfk'])
            ->get();

        return $this->respond($data4);
    }
    public function getDaftarRegistrasiPasien(Request $request)
    {
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftJoin('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            //            ->join('antrianpasiendiperiksa_t as apd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->leftJoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pd.nostruklastfk')
            ->leftJoin('strukbuktipenerimaan_t as sbm', 'sbm.norec', '=', 'pd.nosbmlastfk')
            ->leftjoin('loginuser_s as lu', 'lu.id', '=', 'sbm.objectpegawaipenerimafk')
            ->leftjoin('pegawai_m as pgs', 'pgs.id', '=', 'lu.objectpegawaifk')
            ->leftjoin('pemakaianasuransi_t as pas', 'pas.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('batalregistrasi_t as br', 'br.pasiendaftarfk', '=', 'pd.norec')
            ->select(
                'pd.norec',
                'pd.tglregistrasi',
                'ps.nocm',
                'pd.noregistrasi',
                'ru.namaruangan',
                'ps.namapasien',
                'kp.kelompokpasien',
                'pd.tglpulang',
                'pd.statuspasien',
                'sp.nostruk',
                'sbm.nosbm',
                'pg.id as pgid',
                'pg.namalengkap as namadokter',
                'pgs.namalengkap as kasir',
                'pd.objectruanganlastfk as ruanganid',
                'pas.nosep',
                'pas.norec as norec_pa',
                'br.norec as norec_br',
                'pd.totalplapon'
            )
            ->whereNull('br.norec');

        $filter = $request->all();
        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $tgl = $filter['tglAkhir']; //." 23:59:59";
            $data = $data->where('pd.tglregistrasi', '<=', $tgl);
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

        // $idDokter = '';
        // if (isset($filter['idDokter']) && $filter['idDokter'] != "" && $filter['idDokter'] != "undefined") {
        //     $data = $data->where('pg.id', '=', $filter['idDokter']);
        // }

        if (isset($filter['sttts']) && $filter['sttts'] != "" && $filter['sttts'] != "undefined") {
            $data = $data->where('pd.statuspasien', '=', $filter['sttts']);
        }
        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', 'like', '%' . $filter['noreg'] . '%');
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

        $data = $data->get();

        return $this->respond($data);
    }
    public function getDaftarRegistrasiPasienJasapelayananByNoRegAll(Request $request)
    {
        $data = DB::select(DB::raw("select sum(Total) AS total from V_TarifPelayananAllNoreg where noregistrasi ='$request[noregistrasi]'"));
        return $this->respond($data);
    }
    public function getDaftarRegistrasiPasienJasapelayanan(Request $request)
    {
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftJoin('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            //            ->join('antrianpasiendiperiksa_t as apd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->leftJoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pd.nostruklastfk')
            ->leftJoin('strukbuktipenerimaan_t as sbm', 'sbm.norec', '=', 'pd.nosbmlastfk')
            ->leftjoin('loginuser_s as lu', 'lu.id', '=', 'sbm.objectpegawaipenerimafk')
            ->leftjoin('pegawai_m as pgs', 'pgs.id', '=', 'lu.objectpegawaifk')
            ->leftjoin('pemakaianasuransi_t as pas', 'pas.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('batalregistrasi_t as br', 'br.pasiendaftarfk', '=', 'pd.norec')
            ->leftjoin('rekanan_m as rm', 'rm.id', '=', 'pd.objectrekananfk')
            ->select(
                'pd.norec',
                'pd.tglpulang',
                'pd.tglregistrasi',
                'ps.nocm',
                'pd.noregistrasi',
                'ru.namaruangan',
                'ps.namapasien',
                'kp.kelompokpasien',
                'pd.tglpulang',
                'pd.statuspasien',
                'sp.nostruk',
                'sbm.nosbm',
                'pg.id as pgid',
                'pg.namalengkap as namadokter',
                'pgs.namalengkap as kasir',
                'pd.objectruanganlastfk as ruanganid',
                'pas.nosep',
                'pas.norec as norec_pa',
                'br.norec as norec_br',
                'rm.namarekanan',
                DB::raw("case when pd.tarifINACBLast is not null then 'SUDAH' else 'BELUM' end as statusBpjs"),
                'pd.tarifINACBLast',
                'pd.persenJasaLast',
                'pd.tglclosing'
            )
            ->whereNull('br.norec');

        $filter = $request->all();
        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglpulang', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $tgl = $filter['tglAkhir']; //." 23:59:59";
            $data = $data->where('pd.tglpulang', '<=', $tgl);
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
            $data = $data->where('pd.noregistrasi', 'like', '%' . $filter['noreg'] . '%');
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
        if (isset($filter['rekanan']) && $filter['rekanan'] != "" && $filter['rekanan'] != "undefined") {
            $data = $data->where('pd.objectrekananfk', 'like', '%' . $filter['rekanan'] . '%');
        }
        $data = $data->orderBy('ps.namapasien');

        $data = $data->get();
        $datax = [];
        foreach ($data as $item) {
            $pelayanandetailverif = \DB::table('jasapelayanan_t')
                ->where('noregistrasi', $item->noregistrasi)
                ->take(1)
                ->get();
            $status = "belum";
            $tglverif = "";
            foreach ($pelayanandetailverif as $itm2) {
                if ($item->noregistrasi == $itm2->noregistrasi) {
                    $status = "verif";
                    $tglverif = $itm2->tglverif;
                }
            }
            $totalharusdibayar = 0;
            $norecpd =  \DB::table('pasiendaftar_t')
                ->where('noregistrasi', $item->noregistrasi)
                ->select('norec')
                ->get();
            foreach ($norecpd as $itm3) {
                $norecapd =  \DB::table('antrianpasiendiperiksa_t')
                    ->where('noregistrasifk', $itm3->norec)
                    ->select('norec')
                    ->get();
                foreach ($norecapd as $itm4) {
                    $pelayanan =  \DB::table('PelayananPasien_t')
                        ->where('noregistrasifk', $itm4->norec)
                        ->where('produkfk', '!=', '402611')
                        ->select('hargajual', 'hargadiscount', 'jasa', 'jumlah')
                        ->get();
                    foreach ($pelayanan as $itm5) {
                        $totalharusdibayar = $totalharusdibayar + (((float)$itm5->hargajual * $itm5->jumlah) - (float)$itm5->hargadiscount + (float)$itm5->jasa);
                    }
                }
            }
            $datax[] = array(
                'norec' => $item->norec,
                'tglpulang' => $item->tglpulang,
                'nocm' => $item->nocm,
                'noregistrasi' => $item->noregistrasi,
                'namaruangan' => $item->namaruangan,
                'namapasien' => $item->namapasien,
                'kelompokpasien' => $item->kelompokpasien,
                'tglpulang' => $item->tglpulang,
                'tglverif' => $tglverif,
                'statuspasien' => $item->statuspasien,
                'nostruk' => $item->nostruk,
                'nosbm' => $item->nosbm,
                'pgid ' => $item->pgid,
                'namadokter' => $item->namadokter,
                'kasir' => $item->kasir,
                'ruanganid' => $item->ruanganid,
                'nosep' => $item->nosep,
                'norec_pa' => $item->norec_pa,
                'norec_br' => $item->norec_br,
                'status' => $status,
                'statusBpjs' => $item->statusBpjs,
                'totalharusdibayar' => $totalharusdibayar,
                // 'totalharusdibayar' => 0,                
                'rekanan' => $item->namarekanan,
                'tarifINACBLast' => $item->tarifINACBLast,
                'persenJasaLast' => $item->persenJasaLast,
                'tglclosing' => $item->tglclosing,
                'tglregistrasi' => $item->tglregistrasi
                // tglclosing
                // 'pd.tarifINACBLast', 'pd.persenJasaLast'
            );
        }


        return $this->respond($datax);
    }
    public function getAPD(Request $request)
    {

        $data = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'pd.norec', '=', 'apd.noregistrasifk')
            //            ->leftjoin('registrasipelayananpasien_t as rpp', 'rpp.noregistrasifk', '=',
            //                DB::raw('pd.norec AND rpp.objectruanganfk=apd.objectruanganfk'))
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftJoin('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            ->leftJoin('kamar_m as km', 'km.id', '=', 'apd.objectkamarfk')
            ->leftJoin('kelas_m as kls', 'kls.id', '=', 'apd.objectkelasfk')
            ->leftJoin('pasien_m as pm', 'pm.id', '=', 'pd.nocmfk')
            ->leftJoin('tempattidur_m as tt', 'tt.id', '=', 'apd.nobed')
            //            ->select('apd.norec', 'apd.tglregistrasi', 'ru.id as ruid_asal', 'ru.namaruangan', 'kls.id as kelasid', 'kls.namakelas', 'km.namakamar', 'apd.nobed', 'apd.statusantrian',
            //                'apd.statuskunjungan', 'apd.tglregistrasi', 'apd.tgldipanggildokter', 'apd.tgldipanggilsuster', 'pg.id as pgid', 'pg.namalengkap as namadokter',
            //                'apd.objectasalrujukanfk','pd.nostruklastfk','pd.nosbmlastfk','rpp.noregistrasifk as rpp','apd.tglmasuk','apd.tglkeluar','ru.objectdepartemenfk','dept.namadepartemen',
            //                DB::raw('case when rpp.israwatgabung is null or rpp.israwatgabung =0 then \' \' else \'Ya\' end as israwatgabung','pm.tglmeninggal' ));
            ->select(
                'apd.norec',
                'pd.tglregistrasi as tglregistrasi_pd',
                'apd.tglregistrasi',
                'ru.id as ruid_asal',
                'ru.namaruangan',
                'kls.id as kelasid',
                'kls.namakelas',
                'km.namakamar',
                'tt.reportdisplay as nobed',
                'apd.statusantrian',
                'apd.statuskunjungan',
                'apd.tglregistrasi',
                'apd.tgldipanggildokter',
                'apd.tgldipanggilsuster',
                'pg.id as pgid',
                'pg.namalengkap as namadokter',
                'apd.objectasalrujukanfk',
                'pd.nostruklastfk',
                'pd.nosbmlastfk',
                'apd.tglmasuk',
                'apd.tglkeluar',
                'ru.objectdepartemenfk',
                'dept.namadepartemen',
                'pm.tglmeninggal',
                'ru.objectruanganfk as iscovid',
                'apd.objectkamarfk',
                'apd.nobed as idnobed',
                'apd.objectruanganfk',
                'apd.israwatgabung',
                'pd.nocmfk',
                'pm.nocm',
                'pd.objectkelompokpasienlastfk',
                'pd.objectrekananfk',
                'pd.catatan',
                'apd.israwattitipan'
            )
            ->where('apd.statusenabled', true);
        //                DB::raw('pm.tglmeninggal' ));

        $filter = $request->all();
        if (isset($filter['noregistrasi']) && $filter['noregistrasi'] != "" && $filter['noregistrasi'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $filter['noregistrasi']);
        }
        //        $data = $data->groupBy('apd.norec', 'apd.tglregistrasi', 'ru.id', 'ru.namaruangan', 'kls.id', 'kls.namakelas', 'km.namakamar', 'apd.nobed', 'apd.statusantrian',
        //                'apd.statuskunjungan', 'apd.tglregistrasi', 'apd.tgldipanggildokter', 'apd.tgldipanggilsuster', 'pg.id', 'pg.namalengkap',
        //                'apd.objectasalrujukanfk','pd.nostruklastfk','pd.nosbmlastfk','rpp.noregistrasifk','pd.noregistrasi','rpp.israwatgabung',
        //                'apd.tglmasuk','apd.tglkeluar','ru.objectdepartemenfk','dept.namadepartemen','pm.tglmeninggal');
        $data = $data->groupBy(
            'apd.norec',
            'pd.tglregistrasi',
            'apd.tglregistrasi',
            'ru.id',
            'ru.namaruangan',
            'kls.id',
            'kls.namakelas',
            'km.namakamar',
            'tt.reportdisplay',
            'apd.statusantrian',
            'pd.nocmfk',
            'pm.nocm',
            'apd.statuskunjungan',
            'apd.tglregistrasi',
            'apd.tgldipanggildokter',
            'apd.tgldipanggilsuster',
            'pg.id',
            'pg.namalengkap',
            'apd.objectasalrujukanfk',
            'pd.nostruklastfk',
            'pd.nosbmlastfk',
            'pd.noregistrasi',
            'pd.objectkelompokpasienlastfk',
            'pd.objectrekananfk',
            'apd.tglmasuk',
            'apd.tglkeluar',
            'ru.objectdepartemenfk',
            'dept.namadepartemen',
            'pm.tglmeninggal',
            'ru.objectruanganfk',
            'apd.objectkamarfk',
            'apd.nobed',
            'apd.objectruanganfk',
            'apd.israwatgabung',
            'pd.catatan',
            'apd.israwattitipan'
        );
        $data = $data->orderBy('apd.tglregistrasi', 'desc');
        $data = $data->get();

        return $this->respond($data);
    }
    public function getDataComboDaftarRegPasien(Request $request)
    {
  
        $dataLogin = $request->all();
        $dataInstalasi = \DB::table('departemen_m as dp')
            //            ->whereIn('dp.id', array(3, 14, 16, 17, 18, 19, 24, 25, 26, 27, 28, 35))
            ->where('dp.statusenabled', true)
            ->orderBy('dp.namadepartemen')
            ->get();

        $dataRuangan = \DB::table('ruangan_m as ru')
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();

        $darah = \DB::table('ruangan_m as ru')
            ->where('ru.kdruangan', '41')
            ->orderBy('ru.namaruangan')
            ->get();

        $dept = \DB::table('departemen_m as dept')
            ->where('dept.id', '18')
            ->orderBy('dept.namadepartemen')
            ->get();

        $departemen = \DB::table('departemen_m as dept')
            ->where('dept.statusenabled', true)
            ->orderBy('dept.namadepartemen')
            ->get();

        $deptRajalInap = \DB::table('departemen_m as dept')
            ->whereIn('dept.id', [18, 16])
            ->orderBy('dept.namadepartemen')
            ->get();

        $ruanganRi = \DB::table('ruangan_m as ru')
            ->whereIn('ru.objectdepartemenfk', [16, 17, 25, 35])
            //            ->wherein('ru.objectdepartemenfk', ['18', '28'])
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();


            // idDokter
        $dataDokter = \DB::table('pegawai_m as ru')
            ->where('ru.statusenabled', true)
            ->where('ru.objectjenispegawaifk', 1)->orderBy('ru.namalengkap')
            ->get();
            

        // if (isset($filter['idDokter']) && $filter['idDokter'] != "" && $filter['idDokter'] != "undefined") {
        //     $data = $data->where('ru.id', '=', $filter['idDokter']);
        // }

            
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

        $kdPelayananRanap = \DB::table('settingdatafixed_m as p')
            ->select('p.nilaifield')
            ->where('p.statusenabled', true)
            ->where('p.namafield', 'kddeptlayananRI')
            ->first();

        $kdPelayananOk = \DB::table('settingdatafixed_m as p')
            ->select('p.nilaifield')
            ->where('p.statusenabled', true)
            ->where('p.namafield', 'KdPelayananOk')
            ->first();

        $dataKelompokTanpaUmum = \DB::table('kelompokpasien_m as kp')
            ->select('kp.id', 'kp.kelompokpasien')
            ->where('kp.statusenabled', true)
            ->where('kp.id', '<>', 1)
            ->orderBy('kp.kelompokpasien')
            ->get();

        $dataJenisDiagnosa = \DB::table('jenisdiagnosa_m as jd')
            ->select('jd.id', 'jd.jenisdiagnosa')
            ->where('jd.statusenabled', true)
            //            ->where('ru.objectjenispegawaifk', 1)
            ->orderBy('jd.jenisdiagnosa')
            ->get();

        $dataRuanganJalan = \DB::table('ruangan_m as ru')
            ->where('ru.statusenabled', true)
            ->whereIn('ru.objectdepartemenfk', [18, 28, 24, 3, 27])
            ->orderBy('ru.namaruangan')
            ->get();
        $datakelompokPasien = \DB::table('jeniskelompokpasien_m as jkm')
            ->select('jkm.id', 'jkm.jeniskelompokpasien')
            ->where('jkm.statusenabled', true)
            ->orderBy('jkm.jeniskelompokpasien')
            ->get();

        $dataRekanan = \DB::table('rekanan_m as ru')
            ->where('ru.statusenabled', true)
            ->select('ru.id', 'ru.namarekanan')
            ->orderBy('ru.namarekanan')
            ->get();

        $kdDiagnosa = \DB::table('diagnosa_m as dg')
            ->select('dg.id', 'dg.kddiagnosa', 'dg.namadiagnosa')
            ->where('dg.statusenabled', true)
            ->orderBy('dg.kddiagnosa')
            ->get();

        $kesatuan = \DB::table('kesatuanpasien_m as kp')
            ->select('kp.id', 'kp.kesatuanpasien')
            ->where('kp.statusenabled', true)
            ->orderBy('kp.id')
            ->get();
        $dataRekanan2 = \DB::table('mapkelompokpasientopenjamin_m as mkp')
            ->join('kelompokpasien_m as kp', 'kp.id', '=', 'mkp.objectkelompokpasienfk')
            ->join('rekanan_m as rk', 'rk.id', '=', 'mkp.kdpenjaminpasien')
            ->select('rk.id', 'rk.namarekanan', 'kp.id as id_kelompokpasien', 'kp.kelompokpasien')
            
            ->where('mkp.statusenabled', true)
            ->get();
        $result = array(
            'departemen' => $dataDepartemen,
            'kelompokpasien' => $dataKelompok,
            'jeniskelompokpasien' => $datakelompokPasien,
            'dokter' => $dataDokter,
            'datalogin' => $dataLogin,
            'kelas' => $dataKelas,
            'darah' => $darah,
            'dept' => $dept,
            'ruanganRi' => $ruanganRi,
            'deptrirj' => $deptRajalInap,
            'ruanganall' => $dataRuangan,
            'pembatalan' => $pembatalan,
            'deptt' => $departemen,
            'rekanan' => $dataRekanan,
            'kelompokpasiensatu' => $dataKelompokTanpaUmum,
            'kddeptlayananranap' => $kdPelayananRanap,
            'kddeptlayananok' => $kdPelayananOk,
            'jenisdiagnosa' => $dataJenisDiagnosa,
            'ruanganjalan' => $dataRuanganJalan,
            'kddiagnosa' => $kdDiagnosa,
            'kesatuan' =>  $kesatuan,
            'rekanan2' =>  $dataRekanan2,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
    public function getComboPenjamin(Request $request)
    {
        $dataPenjamin = \DB::table('kelompokpasien_m as kp')
            ->where('kp.statusenabled', true)
            ->select('kp.id', 'kp.kelompokpasien as penjamin')
            ->orderBy('kp.kelompokpasien')
            ->get();
        $dataRekanan = \DB::table('rekanan_m as rk')
            ->where('rk.statusenabled', true)
            ->select('rk.id', 'rk.namarekanan')
            ->orderBy('rk.namarekanan')
            ->get();
        $jaminanKhusus = \DB::table('jaminankhusus_m as jk')
            ->select('jk.id', 'jk.namaexternal')
            ->where('jk.statusenabled', true)
            ->get();

        $result = array(
            'penjamin' => $dataPenjamin,
            'rekanan' => $dataRekanan,
            'jaminankhusus' => $jaminanKhusus
        );

        return $this->respond($result);
    }
    public function simpanUpdatePenjamin(Request $request)
    {
        DB::beginTransaction();
        $transStatus = 'true';
        try {
            $data = PasienDaftar::where('norec', $request['norec_pd'])
                ->update([
                    'objectkelompokpasienlastfk' => $request['penjamin'],
                    'objectrekananfk' => $request['rekanan'],
                    'objectjaminankhusus' => $request['jaminankhusus'],
                    'tglcsr' => $request['tglcsr'],
                ]);
            //            $data2= AntrianPasienDiperiksa::where('noregistrasifk', $request['norec'])
            //                ->where('objectruanganfk', $data['objectruanganlastfk'])
            //                ->update([
            //                        'objectpegawaifk' => $request['objectpegawaifk']]
            //                );
            $transMessage = "Update Penjamin berhasil!";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Update Penjamin gagal";
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
    public function simpanPenyakitPonekIgd(Request $request)
    {
        DB::beginTransaction();
        $transStatus = 'true';
        try {
            $data = PasienDaftar::where('norec', $request['norec_pd'])
                ->update([
                    'penyakitponekigd' => $request['penyakitponekigd']
                ]);
            $transMessage = "Simpan Penyakit Ponek IGD berhasil!";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Penyakit Ponek IGD gagal";
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
    public function simpanUpdatePenjaminLab(Request $request)
    {
        DB::beginTransaction();
        $transStatus = 'true';
        try {
            $data = PasienDaftar::where('noregistrasi', $request['noregistrasi'])
                ->update([
                    'objectkelompokpasienlastfk' => $request['penjamin']
                ]);
            //            $data2= AntrianPasienDiperiksa::where('noregistrasifk', $request['norec'])
            //                ->where('objectruanganfk', $data['objectruanganlastfk'])
            //                ->update([
            //                        'objectpegawaifk' => $request['objectpegawaifk']]
            //                );
            $transMessage = "Update Penjamin berhasil!";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Update Penjamin gagal";
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
    public function simpanUpdateKedokteranForensik(Request $request)
    {
        DB::beginTransaction();
        $transStatus = 'true';
        try {
            $data = PasienDaftar::where('norec', $request['norec_pd'])
                ->update([
                    'iskedokteranforensik' => $request['iskedokteranforensik'],
                ]);
            $transMessage = "Update Kedokteran Forensik berhasil!";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Update Kedokteran Forensik gagal";
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
    public function simpanUpdateKedokteranForensik2(Request $request)
    {
        DB::beginTransaction();
        $transStatus = 'true';
        try {
            $data = PasienDaftar::where('norec', $request['norec_pd'])
                ->update([
                    'jeniskekerasanfk' => $request['jeniskekerasanfk'],
                    'rujukandokterforensikfk' => $request['rujukandokterforensikfk'],
                    'permintaanpolresfk' => $request['permintaanpolresfk'],
                ]);
            $transMessage = "Sukses !";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Gagal !";
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
    public function getPasienKedokteranForensik(Request $request)
    {
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftjoin('pekerjaan_m as pk', 'pk.id', '=', 'ps.objectpekerjaanfk')
            ->join('alamat_m as al', 'al.nocmfk', '=', 'ps.id')
            ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganasalfk')
            ->join('ruangan_m as ru2', 'ru2.id', '=', 'pd.objectruanganlastfk')
            ->join('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->join('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
            ->leftjoin('jeniskekerasan_t as jkk', 'jkk.id', '=', 'pd.jeniskekerasanfk')
            ->leftjoin('rujukandokterforensik_t as rdf', 'rdf.id', '=', 'pd.rujukandokterforensikfk')
            ->leftjoin('permintaanpolres_t as pp', 'pp.id', '=', 'pd.permintaanpolresfk')
            ->select(
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'ps.nocm',
                'ps.namapasien',
                'ps.tgllahir',
                'pk.pekerjaan',
                'al.alamatlengkap',
                'pd.norec as norec_pd',
                'jk.jeniskelamin',
                'ru.namaruangan as ruanganasal',
                'ru2.namaruangan as ruanganlast',
                'kp.kelompokpasien',
                'rk.namarekanan',
                'jkk.jeniskekerasan',
                'rdf.jenisrujukan',
                'pp.permintaanpolres',
                DB::raw(
                    'case when pd.iskedokteranforensik = 1 then \'Forensik\' else \'-\' end as forensik',
                    'case when pd.rujukandokterforensikfk is null the \'-\' else ps.namapasien end as jenisrujukan2'
                )
            )
            // 'case when pd.jeniskekerasanfk is not null then jkk.jeniskekerasan else \'-\' end as jeniskekerasan2'
            ->where('pd.statusenabled', true)
            ->where('pd.iskedokteranforensik', true);
        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '<=', $request['tglAkhir']);
        }
        if (isset($request['departemen']) && $request['departemen'] != "" && $request['departemen'] != "undefined") {
            $data = $data->where('ru2.objectdepartemenfk', '=', $request['departemen']);
        }
        if (isset($request['ruangan']) && $request['ruangan'] != "" && $request['ruangan'] != "undefined") {
            $data = $data->where('ru2.id', '=', $request['ruangan']);
        }
        if (isset($request['kelompok']) && $request['kelompok'] != "" && $request['kelompok'] != "undefined") {
            $data = $data->where('kp.id', '=', $request['kelompok']);
        }
        if (isset($request['rekanan']) && $request['rekanan'] != "" && $request['rekanan'] != "undefined") {
            $data = $data->where('rk.id', '=', $request['rekanan']);
        }
        if (isset($request['jeniskekerasan']) && $request['jeniskekerasan'] != "" && $request['jeniskekerasan'] != "undefined") {
            $data = $data->where('jkk.id', '=', $request['jeniskekerasan']);
        }
        $data = $data->get();
        // ->get();

        return $this->respond($data);
    }
    public function simpanUpdateDokter(Request $request)
    {
        DB::beginTransaction();
        $transStatus = 'true';
        try {
            $data = PasienDaftar::where('norec', $request['norec'])
                ->update([
                    'objectpegawaifk' => $request['objectpegawaifk'],
                    'objectdokterpemeriksafk' => $request['objectpegawaifk']
                ]);
            //            $data2= AntrianPasienDiperiksa::where('noregistrasifk', $request['norec'])
            //                ->where('objectruanganfk', $data['objectruanganlastfk'])
            //                ->update([
            //                        'objectpegawaifk' => $request['objectpegawaifk']]
            //                );
            $transMessage = "Update Dokter berhasil!";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Update Dokter gagal";
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
    public function simpanPlapon(Request $request)
    {
        DB::beginTransaction();
        $transStatus = 'true';
        try {
            $data = PasienDaftar::where('norec', $request['norec'])
                ->update([
                    'totalplapon' => $request['totalPlapon'],
                ]);
            
            $transMessage = "Simpan Plapon berhasil!";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan Plapon gagal";
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
    public function simpanUpdateDokterAPD(Request $request)
    {
        DB::beginTransaction();
        $transStatus = 'true';
        try {
            //            $data= PasienDaftar::where('norec', $request['norec'])
            //                ->update([
            //                        'objectpegawaifk' => $request['objectpegawaifk']]
            //                );
            $data2 = AntrianPasienDiperiksa::where('norec', $request['norec_apd'])
                ->update(
                    [
                        'objectpegawaifk' => $request['objectpegawaifk']
                    ]
                );
            $transMessage = "Update Dokter berhasil!";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Update Dokter gagal";
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
    public function simpanUpdateRekananPD(Request $request)
    {
        DB::beginTransaction();
        $transStatus = 'true';
        try {
            $data = PasienDaftar::where('norec', $request['norec_pd'])
                ->update(
                    [
                        'objectrekananfk' => $request['objectrekananfk'],
                        'objectkelompokpasienlastfk' => $request['objectkelompokpasienlastfk'],
                    ]
                );
            //            $data2= AntrianPasienDiperiksa::where('norec', $request['norec_apd'])
            //                ->update([
            //                        'objectpegawaifk' => $request['objectpegawaifk']]
            //                );
            $transMessage = "Update Rekanan berhasil!";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Update Rekanan gagal";
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
    public function simpanUpdateDokterPPP(Request $request)
    {
        DB::beginTransaction();
        $transStatus = 'true';
        try {
            $datadata = PelayananPasienPetugas::where('pelayananpasien', $request['norec_pp'])
                ->where('objectjenispetugaspefk', 4)->first();
            if (count($datadata) > 0) {
                $data2 = PelayananPasienPetugas::where('pelayananpasien', $request['norec_pp'])
                    ->where('objectjenispetugaspefk', 4)
                    ->update(
                        [
                            'objectpegawaifk' => $request['objectpegawaifk']
                        ]
                    );
            } else {
                $data1 = new PelayananPasienPetugas;
                $data1->norec = $data1->generateNewId();
                $data1->kdprofile = 0;
                $data1->statusenabled = true;
                $data1->nomasukfk = $request['norec_apd'];
                //                $data1->objectasalprodukfk = true;
                $data1->objectjenispetugaspefk = 4;
                //                $data1->objectprodukfk = true;
                //                $data1->objectruanganfk = true;
                //                $data1->deskripsitugasfungsi = true;
                //                $data1->ispetugaspepjawab = true;
                $data1->pelayananpasien = $request['norec_pp'];
                //                $data1->tglpelayanan = true;
                $data1->objectpegawaifk = $request['objectpegawaifk'];
                $data1->save();
            }
            $transMessage = "Update Dokter berhasil!";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Update Dokter gagal";
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
    public function simpanInsertAPD(Request $request)
    {
        DB::beginTransaction();
        $transStatus = 'true';
        try {
            $pd = PasienDaftar::where('norec', $request['norec_pd'])->first();
            $dataAPD = new AntrianPasienDiperiksa;
            $dataAPD->norec = $dataAPD->generateNewId();
            $dataAPD->kdprofile = 0;
            $dataAPD->statusenabled = true;
            $dataAPD->objectasalrujukanfk = $request['asalrujukanfk'];
            $dataAPD->objectkelasfk = $request['kelasfk'];
            $dataAPD->noantrian = $request['noantrian'];
            $dataAPD->noregistrasifk = $request['norec_pd'];
            $dataAPD->objectpegawaifk = $request['dokterfk'];
            $dataAPD->objectruanganfk = $request['objectruangantujuanfk'];
            $dataAPD->statusantrian = 0;
            $dataAPD->statuspasien = 1;
            $dataAPD->statuskunjungan = 'LAMA';
            $dataAPD->statuspenyakit = 'BARU';
            $dataAPD->objectruanganasalfk = $request['objectruanganasalfk'];
            $dataAPD->tglregistrasi = $pd->tglregistrasi; //date('Y-m-d H:i:s');
            $dataAPD->tglkeluar = date('Y-m-d H:i:s');
            $dataAPD->tglmasuk = date('Y-m-d H:i:s');
            $dataAPD->save();
            $rua =  Ruangan::where('id', $dataAPD->objectruanganfk)->first();

            $dataAPDnorec = $dataAPD->norec;
            $transStatus = 'true';
            $transMessage = "simpan AntrianPasienDiperiksa";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan AntrianPasienDiperiksa";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $ihs=[];
            if($rua->objectdepartemenfk==3){
                if($dataAPD->objectruanganfk !='251' && $dataAPD->objectruanganfk != '453'){
                    $objetoRequest = new \Illuminate\Http\Request();
                    $objetoRequest ['noregistrasi']= $dataAPD->norec;
                    $ihs = app('App\Http\Controllers\Bridging\PHSController')->EncounterLab($objetoRequest,true);
                }
            }
            $result = array(
                "status" => 201,
                "data" => $dataAPD,
                "ihs" =>$ihs,
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
    public function updateRawatTitipan(Request $request)
    {
        DB::beginTransaction();
        $transStatus = 'true';
        try {
            $dataAPD = AntrianPasienDiperiksa::where('norec', $request['norec_apd'])
                    ->update(
                        [
                            'israwattitipan' => $request['statustitipan']
                        ]
                    );
            $transStatus = 'true';
            $transMessage = "update Rawat Titipan";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "update Rawat Titipan";
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
    public function simpanKomorbid(Request $request)
    {
        DB::beginTransaction();
        $transStatus = 'true';
        try {
            $data = PasienDaftar::where('norec', $request['norec_pd'])
                ->update(
                    [
                        'objectkasuspenyakitlastfk' => $request['kasuspenyakit'],
                        'objectkomorbidfk' => $request['objectkomorbidfk'],
                        'objectkomorbiddetailfk' => $request['objectkomorbiddetailfk']
                    ]
                );


            $transStatus = 'true';
            $transMessage = "simpan Pasien Covid";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan Pasien Covid";
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
    public function simpanUpdateTglPelayanan(Request $request)
    {
        DB::beginTransaction();
        $transStatus = 'true';
        try {
            $data = PelayananPasien::where('norec', $request['norec_pp'])
                ->update(
                    [
                        'tglpelayanan' => $request['tanggalPelayanan']
                    ]
                );
            $transMessage = "Update Tanggal Pelayanan berhasil!";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Update Tanggal Pelayanan gagal";
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


    public function simpanUpdateTglPelayananAll(Request $request)
    {
        DB::beginTransaction();
        $transStatus = 'true';
        try {
            // return($request['norec_pp']);
            // die;
            foreach ($request['norec_pp'] as $item) {
                if ($request['status'] == 2) {
                    if ($request['dokterkirim'] == null || $request['dokterkirim'] == "") {
                        $data = PelayananPasien::where('norec', '=', $item['norec_pp'])
                            ->update(
                                [
                                    'tglpelayanan' => $request['tanggalPelayanan']
                                ]
                            );
                    } else {
                        $data = PelayananPasien::where('norec', '=', $item['norec_pp'])
                            ->update(
                                [
                                    'tglpelayanan' => $request['tanggalPelayanan'],
                                    'objectpegawaipengirimfk' => $request['dokterkirim']
                                ]
                            );
                    }
                }

                $dataHasil = DB::table('hasillaboratorium_t')->where(
                    'norec',
                    '=',
                    $item['norec_pp']
                )->get();
                foreach ($dataHasil as $simpenen) {
                }
                $tglcetak = DB::table('hasillaboratorium_t')->where('norecpelayanan', '=', $item['norec_pp'])->update(
                    [
                        'tglcetak' => $request['tglcetak'],
                        // 'tglhasil' => $request['tglhasil'],
                    ]
                );
            }
            $transMessage = 'true';
            $data1  = PelayananPasien::whereIn('norec', [$request['norec_pp']])
                ->get();
            // return(array($request['norec_pp']));
            // die;
            $transMessage = 'Update Tanggal Pelayanan Berhasil';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Update Tanggal Pelayanan gagal";
            $transMessage = $e;
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                // "data" => $data1,
                "norec" =>  $request['norec_pp'],
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                // "data" => $data1,
                "norec" =>  $request['norec_pp'],
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function hapusAPD(Request $request)
    {

        DB::beginTransaction();
        $transStatus = 'true';
        if ($request['norec_apd'] != '') {
            $pelayanan = PelayananPasien::where('noregistrasifk', $request['norec_apd'])
                ->where('isobat', NULL)
                ->first();
            if (!empty($pelayanan)) {
                $transMessage = 'Pasien sudah mendapatkan pelayanan, hapus pelayanan dulu !';
                $pel = array('norec_pp' => $pelayanan->norec);
                return $this->setStatusCode(400)->respond($pel, $transMessage);
            }
            try {
                // $delApd = AntrianPasienDiperiksa::where('norec', $request['norec_apd'])->delete();
                $delApd = AntrianPasienDiperiksa::where('norec', $request['norec_apd'])
                    ->update(
                        [
                            'statusenabled' => false
                        ]
                    );
                $transMessage = "Hapus Registrasi Berhasil";
            } catch (\Exception $e) {
                $transStatus = 'false';
                $transMessage = "Tidak bisa dihapus, sudah ada tindakannya";
            }
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
    public function saveAkomodasiOtomatis(Request $request)
    {
        //        ini_set('max_execution_time', 3000); //6 minutes
        DB::beginTransaction();
        try {

            $data2 = DB::select(
                DB::raw("select apd.tglmasuk,apd.tglkeluar,apd.norec as norec_apd,pd.tglregistrasi,apd.objectruanganfk,apd.objectkelasfk
                    from pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                    INNER JOIN ruangan_m as ru_pd on ru_pd.id=apd.objectruanganfk
                    where ru_pd.objectdepartemenfk=16 and apd.statusenabled='y'
                    and pd.noregistrasi=:noregistrasi and pd.tglpulang is null order by apd.tglmasuk;"),
                array(
                    'noregistrasi' => $request['noregistrasi'],
                )
            );
            // return($data2);
            // die();
            foreach ($data2 as $dateAPD) {
                // return('x');
                // die();
                $tglMasuk = $dateAPD->tglmasuk;
                $ruanganapd = $dateAPD->objectruanganfk;
                if (is_null($dateAPD->tglkeluar) == true) {
                    $tglKeluar = date('Y-m-d 23:59:59');
                    $arrDate = $this->dateRange($tglMasuk, $tglKeluar);
                    // return($arrDate);
                    // die();
                } else {
                    $tglKeluar = $dateAPD->tglkeluar;
                }
                $arrDate = $this->dateRange($tglMasuk, $tglKeluar);
                //                $arrDate = $this->dateRange( '2010-07-26', '2010-08-05');
                foreach ($arrDate as $itemDate) {
                    $tglAwal = $itemDate . ' 00:00';
                    $tglAkhir = $itemDate . ' 23:59';

                    $data = DB::select(
                        DB::raw("select pp.tglpelayanan,rpp.objectkelasfk,
                    rpp.objectruanganfk,rpp.israwatgabung
                    from pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                    INNER JOIN registrasipelayananpasien_t as rpp on rpp.noregistrasifk=pd.norec
                    INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                    INNER JOIN produk_m as pr on pr.id=pp.produkfk
                    INNER JOIN ruangan_m as ru_pd on ru_pd.id=pd.objectruanganlastfk
                    where pd.tglpulang is null  and ru_pd.objectdepartemenfk=16
                    and pp.tglpelayanan between :tglAwal and :tglAkhir and pr.namaproduk like '%akomodasi%'
                    and pd.noregistrasi=:noregistrasi and apd.objectruanganfk=:ruanganfk ;"),
                        array(
                            'tglAwal' => $tglAwal, //date('Y-m-d 00:00:00'),
                            'tglAkhir' => $tglAkhir, //date('Y-m-d 23:59:59'),
                            'noregistrasi' => $request['noregistrasi'],
                            'ruanganfk' => $ruanganapd,
                        )
                    );
                    // return($dateAPD->norec_apd);
                    // die();
                    if (count($data) == 0) {
                        $dataDong = DB::select(
                            DB::raw("select rpp.objectkelasfk,
                            rpp.objectruanganfk,rpp.israwatgabung ,apd.norec as norec_apd,pd.tglregistrasi,pd.objectkelompokpasienlastfk
                            from pasiendaftar_t as pd
                            INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                            INNER JOIN registrasipelayananpasien_t as rpp on rpp.noregistrasifk=pd.norec and rpp.objectruanganfk=apd.objectruanganfk
                            INNER JOIN ruangan_m as ru_pd on ru_pd.id=apd.objectruanganfk
                            where pd.tglpulang is null and  ru_pd.objectdepartemenfk=16
                            and pd.noregistrasi=:noregistrasi and apd.norec=:norec_apd;"),
                            array(
                                'noregistrasi' => $request['noregistrasi'],
                                'norec_apd' => $dateAPD->norec_apd,
                            )
                        );

                        // return($dataDong[0]->objectruanganfk);
                        // die();
                        $kelasid = $dataDong[0]->objectkelasfk;
                        $tglRegis = $dataDong[0]->tglregistrasi;
                        $ruanganfk = $dataDong[0]->objectruanganfk;

                        if ($ruanganfk == '757' || $ruanganfk == '722' || $ruanganfk == '724' || $ruanganfk == '758' || $ruanganfk == '759' || $ruanganfk == '760' || $ruanganfk == '761' || $ruanganfk == '762' || $ruanganfk == '763' || $ruanganfk == '764' || $ruanganfk == '781' || $ruanganfk == '756' || $ruanganfk == '757' || $ruanganfk == '741' || $ruanganfk == '797' || $ruanganfk == '798' || $ruanganfk == '861') {
                        } else {
                            // return($tglRegis);
                            // die();
                            if ($dataDong[0]->objectkelompokpasienlastfk == 2) {
                                $xx = DB::select(
                                    DB::raw("select pd.tglregistrasi, asuransipasien_m.objectkelasdijaminfk
                                    FROM pasiendaftar_t AS pd INNER JOIN
                                     pemakaianasuransi_t ON pd.norec = pemakaianasuransi_t.noregistrasifk INNER JOIN
                                     asuransipasien_m ON pemakaianasuransi_t.objectasuransipasienfk = asuransipasien_m.id CROSS JOIN
                                     ruangan_m AS ru_pd WHERE (pd.tglpulang IS NULL) AND (ru_pd.objectdepartemenfk = 16)
                                    and pd.noregistrasi=:noregistrasi "),
                                    array(
                                        'noregistrasi' => $request['noregistrasi']
                                    )
                                );
                                $kelasid = $xx[0]->objectkelasdijaminfk;
                            }

                            if ($dateAPD->objectkelasfk == 7 || $dateAPD->objectkelasfk == 9) {
                            } else {
                                if ($dateAPD->objectkelasfk > $kelasid) {
                                    $kelasid = $dateAPD->objectkelasfk;
                                }
                            }
                        }


                        // return($kelasid);
                        // die();


                        // if ($dataDong[0]->israwatgabung == 1){
                        //     $sirahMacan = DB::select(DB::raw("select hett.* from mapruangantoakomodasi_t as map
                        //         INNER JOIN harganettoprodukbykelas_m as hett on hett.objectprodukfk=map.objectprodukfk
                        //         where map.objectruanganfk=:ruanganid and hett.objectkelasfk=:kelasid and map.israwatgabung=1"),
                        //         array(
                        //             'ruanganid' => $dataDong[0]->objectruanganfk,
                        //             'kelasid' => $dataDong[0]->objectkelasfk,
                        //         )
                        //     );
                        // }else{

                        // return($kelasid);
                        // die();

                        // $sirahMacan = DB::select(DB::raw("select hett.*,map.idpegawai from mapruangantoakomodasi_t as map
                        //     INNER JOIN eharganettoprodukbykelas_m as hett on hett.objectprodukfk=map.objectprodukfk
                        //     where map.objectruanganfk=:ruanganid and hett.objectkelasfk=:kelasid and map.israwatgabung is null"),
                        //     array(
                        //         'ruanganid' => $ruanganfk,
                        //         'kelasid' => $kelasid,
                        //     )
                        // );
                        // }


                        // return($dataDong[0]->objectkelompokpasienlastfk);
                        // die();
                        if ($ruanganfk == '750') {
                            if ($dataDong[0]->objectkelompokpasienlastfk == 9 || $dataDong[0]->objectkelompokpasienlastfk == 11) {
                                if ($kelasid == 3) {
                                    $objectprodukfk = 4057055;
                                } else if ($kelasid == 2) {
                                    $objectprodukfk = 4057056;
                                } else if ($kelasid == 1) {
                                    $objectprodukfk = 4057057;
                                }
                                // return($objectprodukfk);
                                // die();

                                $sirahMacan = DB::select(
                                    DB::raw("select hett.*,map.idpegawai from mapruangantoakomodasi_t as map
                                INNER JOIN harganettoprodukbykelas_m as hett on hett.objectprodukfk=map.objectprodukfk
                                where map.objectruanganfk=:ruanganid and hett.objectkelasfk=:kelasid and map.objectprodukfk=:objectprodukfk and map.israwatgabung is null"),
                                    array(
                                        'ruanganid' => $ruanganfk,
                                        'kelasid' => $kelasid,
                                        'objectprodukfk' => $objectprodukfk,
                                    )
                                );
                            } else {
                                $sirahMacan = DB::select(
                                    DB::raw("select hett.*,map.idpegawai from mapruangantoakomodasi_t as map
                                    INNER JOIN harganettoprodukbykelas_m as hett on hett.objectprodukfk=map.objectprodukfk
                                    where map.objectruanganfk=:ruanganid and hett.objectkelasfk=:kelasid and map.israwatgabung is null"),
                                    array(
                                        'ruanganid' => $ruanganfk,
                                        'kelasid' => $kelasid,
                                    )
                                );
                            }
                            //     if($dataDong[0]->objectkelompokpasienlastfk == 2){
                            //         $xx = DB::select(DB::raw("select pd.tglregistrasi, asuransipasien_m.objectkelasdijaminfk
                            //            FROM pasiendaftar_t AS pd INNER JOIN
                            //             pemakaianasuransi_t ON pd.norec = pemakaianasuransi_t.noregistrasifk INNER JOIN
                            //             asuransipasien_m ON pemakaianasuransi_t.objectasuransipasienfk = asuransipasien_m.id CROSS JOIN
                            //             ruangan_m AS ru_pd WHERE (pd.tglpulang IS NULL) AND (ru_pd.objectdepartemenfk = 16)
                            //            and pd.noregistrasi=:noregistrasi "),
                            //            array(
                            //                'noregistrasi' => $request['noregistrasi']
                            //            )
                            //        );
                            //        $kelasid = $xx[0]->objectkelasdijaminfk;
                            //    }

                            //    if ($dateAPD->objectkelasfk == 7 || $dateAPD->objectkelasfk == 9) {

                            //    } else {
                            //        if($dateAPD->objectkelasfk > $kelasid) {
                            //            $kelasid = $dateAPD->objectkelasfk;
                            //        }
                            //    }
                        } else {
                            // return($kelasid);
                            // die();
                            $sirahMacan = DB::select(
                                DB::raw("select hett.*,map.idpegawai from mapruangantoakomodasi_t as map
                                INNER JOIN harganettoprodukbykelas_m as hett on hett.objectprodukfk=map.objectprodukfk
                                where map.objectruanganfk=:ruanganid and hett.objectkelasfk=:kelasid and map.israwatgabung is null"),
                                array(
                                    'ruanganid' => $ruanganfk,
                                    'kelasid' => $kelasid,
                                )
                            );
                        }
                        // return($sirahMacan[0]->hargasatuan);
                        // die();

                        // request : RSABHK-1142
                        $diskon = 0;
                        // $tglAwalDiskon = $itemDate . ' 23:59';
                        // $start  = new Carbon($dateAPD->tglregistrasi);
                        // $end    = new Carbon($tglAwalDiskon);
                        // $tglRegis = date('Y-m-d', strtotime($dateAPD->tglregistrasi));
                        // $selisihjam = $start->diff($end)->format('%H');
                        // if ($tglRegis == $itemDate){
                        //     if ((int)$selisihjam <= 6 ){
                        //         $diskon = ((float)$sirahMacan[0]->hargasatuan * 50)/100;
                        //     }
                        // }
                        // ## END ##


                        $PelPasien = new PelayananPasien();
                        $PelPasien->norec = $PelPasien->generateNewId();
                        $PelPasien->kdprofile = 0;
                        $PelPasien->statusenabled = true;
                        $PelPasien->noregistrasifk =  $dateAPD->norec_apd; //$dataDong[0]->norec_apd;
                        $PelPasien->tglregistrasi = $tglRegis;
                        $PelPasien->hargadiscount = $diskon; //0;
                        $PelPasien->hargajual =  $sirahMacan[0]->hargasatuan;
                        $PelPasien->hargasatuan =  $sirahMacan[0]->hargasatuan;
                        $PelPasien->jumlah = 1;
                        $PelPasien->kelasfk =  $dataDong[0]->objectkelasfk;
                        $PelPasien->kdkelompoktransaksi =  1;
                        $PelPasien->piutangpenjamin =  0;
                        $PelPasien->piutangrumahsakit = 0;
                        $PelPasien->produkfk =  $sirahMacan[0]->objectprodukfk;
                        $PelPasien->stock =  1;
                        $PelPasien->tglpelayanan = $tglAwal; // date('Y-m-d H:i:22');
                        $PelPasien->harganetto =  $sirahMacan[0]->harganetto1;

                        $PelPasien->save();
                        $PPnorec = $PelPasien->norec;
                        // $nomasuk = $PelPasien->noregistrasifk;
                        $idpegawai = $sirahMacan[0]->idpegawai;
                        $x = new PelayananPasienPetugas();
                        $x->norec = $x->generateNewId();
                        $x->kdprofile = 44;
                        $x->statusenabled = true;
                        $x->nomasukfk = $dateAPD->norec_apd;
                        $x->objectjenispetugaspefk = 2;
                        $x->objectpegawaifk = $idpegawai;
                        $x->pelayananpasien = $PPnorec;
                        $x->save();

                        // if ($dataDong[0]->israwatgabung == 1){
                        //     $buntutMacan = DB::select(DB::raw("select hett.* from mapruangantoakomodasi_t as map
                        //         INNER JOIN harganettoprodukbykelasd_m as hett on hett.objectprodukfk=map.objectprodukfk
                        //         where map.objectruanganfk=:ruanganid and hett.objectkelasfk=:kelasid  and map.israwatgabung=1"),
                        //         array(
                        //             'ruanganid' => $dataDong[0]->objectruanganfk,
                        //             'kelasid' => $dataDong[0]->objectkelasfk,
                        //         )
                        //     );
                        // }else{
                        $buntutMacan = DB::select(
                            DB::raw("select hett.* from mapruangantoakomodasi_t as map
                                INNER JOIN harganettoprodukbykelasd_m as hett on hett.objectprodukfk=map.objectprodukfk
                                where map.objectruanganfk=:ruanganid and hett.objectkelasfk=:kelasid  and map.israwatgabung is null and map.objectprodukfk =:produkfk"),
                            array(
                                'ruanganid' => $ruanganfk,
                                'kelasid' => $kelasid,
                                'produkfk' => $sirahMacan[0]->objectprodukfk
                            )
                        );
                        // return ($sirahMacan[0]->objectprodukfk);
                        // die();
                        // return($buntutMacan);
                        // die();

                        // }
                        foreach ($buntutMacan as $itemKomponen) {
                            $PelPasienDetail = new PelayananPasienDetail();
                            $PelPasienDetail->norec = $PelPasienDetail->generateNewId();
                            $PelPasienDetail->kdprofile = 0;
                            $PelPasienDetail->statusenabled = true;
                            $PelPasienDetail->noregistrasifk = $dateAPD->norec_apd; //$dataDong[0]->norec_apd;
                            $PelPasienDetail->aturanpakai = '-';
                            $PelPasienDetail->hargadiscount = $diskon;
                            $PelPasienDetail->hargajual = $itemKomponen->hargasatuan;
                            $PelPasienDetail->hargasatuan = $itemKomponen->hargasatuan;
                            $PelPasienDetail->jumlah = 1;
                            $PelPasienDetail->keteranganlain = '-';
                            $PelPasienDetail->keteranganpakai2 = '-';
                            $PelPasienDetail->komponenhargafk = $itemKomponen->objectkomponenhargafk;
                            $PelPasienDetail->pelayananpasien = $PPnorec;
                            $PelPasienDetail->piutangpenjamin = 0;
                            $PelPasienDetail->piutangrumahsakit = 0;
                            $PelPasienDetail->produkfk = $itemKomponen->objectprodukfk;
                            $PelPasienDetail->stock = 1;
                            $PelPasienDetail->tglpelayanan = $tglAwal; //date('Y-m-d H:i:22');
                            $PelPasienDetail->harganetto = $itemKomponen->harganetto1;
                            $PelPasienDetail->save();

                            $diskon = 0;
                        }
                    }
                }
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Akomodasi Otomatis";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . "";
            DB::commit();
            $result = array(
                "status" => 201,
                //                "data" => $selisihjam,
                "as" => 'as@epic',
            );
        } else {
            $transMessage = $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 201,
                "data" => $data2,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        //        return $this->respond($result);

    }
    public function getDataComboAkomodasi(Request $request)
    {
        $dataLogin = $request->all();

        $dataRuanganInap = [];
        if ($request['ruangan'] == 1) {
            $dataRuanganInap = \DB::table('ruangan_m as ru')
                ->select('ru.id', 'ru.namaruangan')
                ->where('ru.objectdepartemenfk', 16)
                ->where('ru.statusenabled', true)
                ->orderBy('ru.namaruangan')
                ->get();
        }

        $dataProduk = [];
        $datalistAkomodasi = [];
        if ($request['produk'] == 1) {
            $dataProduk = \DB::table('produk_m as pr')
                ->JOIN('mapruangantoproduk_m as ma', 'ma.objectprodukfk', '=', 'pr.id')
                ->select('pr.id', 'pr.namaproduk')
                ->where('pr.statusenabled', true)
                ->orderBy('pr.namaproduk');
            if (isset($request['objectruanganfk']) && $request['objectruanganfk'] != "" && $request['objectruanganfk'] != "undefined") {
                $dataProduk = $dataProduk->where('ma.objectruanganfk', '=', $request['objectruanganfk']);
            }
            $dataProduk->where('pr.namaproduk', 'like', '%akomodasi%');
            $dataProduk = $dataProduk->get();

            $datalistAkomodasi = \DB::table('produk_m as pr')
                ->JOIN('mapruangantoakomodasi_t as ma', 'ma.objectprodukfk', '=', 'pr.id')
                ->select('pr.id', 'pr.namaproduk', 'ma.israwatgabung', 'ma.id as maid', 'ma.statusenabled')
                ->where('pr.statusenabled', true)
                ->where('ma.statusenabled', true)
                ->orderBy('pr.namaproduk');
            if (isset($request['objectruanganfk']) && $request['objectruanganfk'] != "" && $request['objectruanganfk'] != "undefined") {
                $datalistAkomodasi = $datalistAkomodasi->where('ma.objectruanganfk', '=', $request['objectruanganfk']);
            }
            $datalistAkomodasi = $datalistAkomodasi->get();
        }


        $result = array(
            'produk' => $dataProduk,
            'ruangan' => $dataRuanganInap,
            'listakomodasi' => $datalistAkomodasi,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }
    public function SaveMapAkomodasiTea(Request $request)
    {
        $data = $request->all();
        try {
            if ($data['status'] == 'HAPUS') {
                $newKS = MapRuanganToAkomodasi::where('id', $request['maid'])->delete();
            } else {
                if ($data['maid'] == '') {
                    if ($data['rg'] == 'YES') {
                        $RG = 1;
                    } else {
                        $RG = null;
                    }
                    $newKS = new MapRuanganToAkomodasi();
                    $norecKS = MapRuanganToAkomodasi::max('id');
                    $norecKS = $norecKS + 1;
                    $newKS->id = $norecKS;
                    $newKS->norec = $norecKS;
                    $newKS->kdprofile = 0;
                    $newKS->statusenabled = true;
                    $newKS->objectprodukfk = $data['pelayanan'];
                    $newKS->objectruanganfk = $data['ruangan'];
                    $newKS->israwatgabung = $RG;

                    $newKS->save();
                } else {
                    if ($data['rg'] == 'YES') {
                        $newKS = MapRuanganToAkomodasi::where('id', $request['maid'])
                            ->update(
                                [
                                    'objectruanganfk' => $data['ruangan'],
                                    'israwatgabung' => 1,
                                ]
                            );
                    } else {
                        $newKS = MapRuanganToAkomodasi::where('id', $request['maid'])
                            ->update(
                                [
                                    'objectruanganfk' => $data['ruangan'],
                                    'israwatgabung' => null,
                                ]
                            );
                    }

                    //                    $newKSasas = MapRuanganToAkomodasi::where('id', $request['maid'])->first();
                }
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        $transMessage = "Simpan Map";

        if ($transStatus == 'true') {
            $transMessage = $transMessage . " Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "data" => $newKS,
                "as" => 'as@epic',
            );
        } else {
            $transMessage =  $transMessage . " Gagal!!";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "noresep" => $newKS,
                "as" => 'as@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDetailpasien(Request $request)
    {
        $pelayanan = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
            ->join('pasien_m as pas', 'pas.id', '=', 'pd.nocmfk')
            ->leftjoin('agama_m as ag', 'ag.id', '=', 'pas.objectagamafk')
            ->leftjoin('jeniskelamin_m as jkel', 'jkel.id', '=', 'pas.objectjeniskelaminfk')
            ->leftjoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftjoin('kelas_m as kls2', 'kls2.id', '=', 'pd.objectkelasfk')
            ->join('ruangan_m as ru2', 'ru2.id', '=', 'pd.objectruanganlastfk')
            ->leftjoin('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
            ->leftjoin('kamar_m as kamar', 'kamar.id', '=', 'apd.objectkamarfk')
            ->leftjoin('jaminankhusus_m as jk', 'jk.id', '=', 'pd.objectjaminankhusus')
            ->select(
                'apd.norec as norec_apd',
                'pd.nocmfk',
                'apd.israwatgabung',
                'pd.nocmfk',
                'pd.nostruklastfk',
                'ag.id as agid',
                'ag.agama',
                'pas.tgllahir',
                'kp.id as kpid',
                'kp.kelompokpasien as jenisPasien',
                'pas.objectstatusperkawinanfk',
                'pas.namaayah',
                'pas.namasuamiistri',
                'pas.id as pasid',
                'pas.nocm as noCm',
                'jkel.id as jkelid',
                'jkel.jeniskelamin',
                'jkel.reportdisplay as jenisKelamin',
                'pd.noregistrasi as noRegistrasi',
                'pas.namapasien as namaPasien',
                'pd.tglregistrasi as tglMasuk',
                'pd.norec as norec_pd',
                'pd.tglpulang as tglPulang',
                'pas.notelepon',
                'pd.objectrekananfk as rekananid',
                'kls2.id as klsid2',
                'kls2.namakelas as kelasRawat',
                'rk.namarekanan as namaPenjamin',
                'ru2.id as idlasrRuangan',
                'ru2.namaruangan as lastRuangan',
                'sp.nostruk',
                'sp.norec as strukfk',
                'pd.statuspasien as StatusPasien',
                'pd.objectjaminankhusus',
                'pd.objectrekananfk',
                'pd.objectkelompokpasienlastfk',
                'jk.namaexternal as jaminanKhusus'
            )
            ->take(1)
            ->where('pd.noregistrasi', $request['noregistrasi'])
            ->get();


        $result = array(
            'data' => $pelayanan,
            'message' => 'as@epic',
        );

        return $this->respond($pelayanan);
    }
    public function getKomponenHargaPelayanan(Request $request)
    {
        $data4 = \DB::table('pelayananpasiendetail_t as ppd')
            //            ->join('pelayananpasiendetail_t as ppd', 'pp.norec', '=', 'ppd.pelayananpasien')
            ->join('komponenharga_m as kh', 'kh.id', '=', 'ppd.komponenhargafk')
            ->select(
                'ppd.pelayananpasien as norec_pp',
                'ppd.norec',
                'kh.komponenharga',
                'ppd.jumlah',
                'ppd.hargasatuan',
                'ppd.hargadiscount',
                'ppd.jasa'
            )
            ->where('ppd.pelayananpasien', $request['norec_pp'])
            ->get();

        $result = array(
            'data' => $data4,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getVerifikasiNoregistrasi(Request $request)
    {
        $status = true;
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->join('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->select('sp.nostruk')
            //            ->where('ru.objectdepartemenfk','=',16)
            ->whereNotIn('apd.objectruanganfk', [36, 309]);

        if (isset($request['noregistrasi']) && $request['noregistrasi'] != "" && $request['noregistrasi'] != "undefined") {
            $data = $data->where('pd.noregistrasi', $request['noregistrasi']);
        }
        if (isset($request['norec_pd']) && $request['norec_pd'] != "" && $request['norec_pd'] != "undefined") {
            $data = $data->where('pd.noregistrasi', $request['norec_pd']);
        }
        $data = $data->get();

        if (count($data) == 0) {
            $status = false;
        }

        $status = array(
            'status' => $status,
        );

        return $this->respond($status);
    }

    public function getPascaRanap(Request $request)
    {
        $status = true;
        $datanoregistrasi = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->join('pasiendaftar_t as pd1', 'pd1.nocmfk', '=', 'ps.id')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd1.objectruanganlastfk')
            ->select('pd1.noregistrasi', 'pd1.tglregistrasi', 'ru.id', 'ru.namaruangan', 'ru.objectdepartemenfk')
            ->where('pd.noregistrasi', $request['noregistrasi'])
            ->where('pd1.statusenabled', true)
            ->orderBy('pd1.tglregistrasi', 'desc')
            ->get();

        // return($datanoregistrasi[0]->objectdepartemenfk);
        // die();

        // return($datanoregistrasi[2]->objectdepartemenfk);
        // die();
        $array = [];
        if (COUNT($datanoregistrasi) > 1) {
            if ($datanoregistrasi[0]->objectdepartemenfk == 18) {
                if ($datanoregistrasi[1]->objectdepartemenfk == 16) {
                    $date = date('Y-m-d');

                    $datas = \DB::table('pasiendaftar_t as pd')
                        ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                        ->join('indikatorpelayananpasien_t as ipp', 'ipp.norec_apd', '=', 'apd.norec')
                        ->join('mappingindikatortoproduk_m as mip', 'mip.id', '=', 'ipp.objectmappingindikatortoprodukfk')
                        ->join('indikatorrensar_m as ind', 'ind.id', '=', 'mip.objectindikatorrensarfk')
                        ->select('ipp.norec', 'ipp.norec_pp', 'ipp.objectmappingindikatortoprodukfk', 'ipp.objectsasaranmutufk', 'ind.indikator', 'mip.id as mipfk', 'ind.id as id_indikator', 'apd.objectruanganfk as asalruanganfk', 'apd.norec as norec_apd', 'ipp.norec_apd')
                        ->where('pd.noregistrasi', '=', $datanoregistrasi[1]->noregistrasi)
                        // ->where('apd.objectruanganfk', $request['idruangan'])
                        ->wherein('apd.objectruanganfk', [$datanoregistrasi[1]->id, 41, 44, 277])
                        ->where('ind.id', 90)
                        ->where('ipp.flag', true)
                        ->orderBy('apd.norec', 'desc')
                        ->get();
                    // return($datas);
                    // die();

                    $no = 0;
                    $norec_apd = '';
                    foreach ($datas as $items) {
                        // return($items->norec);
                        // die();
                        // return($date);
                        // die();
                        $data = \DB::table('detail_ipp_t as dipp')
                            ->select('dipp.*')
                            ->where('dipp.ippfk', '=', $items->norec)
                            ->whereRaw("format( dipp.tgl_indikator, 'yyyy-MM-dd')  = '$date' ")
                            ->get();

                        // return(COUNT($data));
                        // die();
                        if (COUNT($data) == 0) {
                            if ($norec_apd == $items->norec_apd) {
                                // return($norec_apd .' - '. $items->norec_apd);
                                // die();
                                $array[] = array(
                                    'norec_ipp' => $items->norec,
                                    'norec_pp' => $items->norec_pp,
                                    'objectmappingindikatortoprodukfk' => $items->objectmappingindikatortoprodukfk,
                                    'objectsasaranmutufk' => $items->objectsasaranmutufk,
                                    'indikator' => $items->indikator,
                                    'id_indikator' => $items->id_indikator,
                                    'asalruanganfk' => $items->asalruanganfk,
                                    'date' => $date,
                                    'norec_apd' => $items->norec_apd
                                );
                                $norec_apd = '';
                            } else {
                                $norec_apd = $items->norec_apd;
                            }
                        }
                    }
                }
            } else {
            }
        }
        // return($no);
        // die();

        $result = array(
            'data' => $array,
            'message' => 'egie@epic'
        );
        return $this->respond($result);

        // ->whereNotIn('apd.objectruanganfk', [36, 309]);

        // if (isset($request['noregistrasi']) && $request['noregistrasi'] != "" && $request['noregistrasi'] != "undefined") {
        //     $data = $data->where('pd.noregistrasi', $request['noregistrasi']);
        // }
        // $data = $data->get();

        // if (count($data) == 0) {
        //     $status = false;
        // }

    }

    public function getDaftarRegistrasiPasienBD(Request $request)
    {
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->join('antrianpasiendiperiksa_t as apd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftJoin('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            ->leftJoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pd.nostruklastfk')
            ->leftJoin('strukbuktipenerimaan_t as sbm', 'sbm.norec', '=', 'pd.nosbmlastfk')
            ->leftjoin('loginuser_s as lu', 'lu.id', '=', 'sbm.objectpegawaipenerimafk')
            ->leftjoin('pegawai_m as pgs', 'pgs.id', '=', 'lu.objectpegawaifk')
            ->leftjoin('pemakaianasuransi_t as pas', 'pas.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('batalregistrasi_t as br', 'br.pasiendaftarfk', '=', 'pd.norec')
            ->select(
                'pd.norec',
                'pd.tglregistrasi',
                'ps.nocm',
                'pd.noregistrasi',
                'ru.namaruangan',
                'ps.namapasien',
                'kp.kelompokpasien',
                'pd.tglpulang',
                'pd.statuspasien',
                'sp.nostruk',
                'sbm.nosbm',
                'pg.id as pgid',
                'pg.namalengkap as namadokter',
                'pgs.namalengkap as kasir',
                'pd.objectruanganlastfk as ruanganid',
                'pas.nosep',
                'br.norec as norec_br'
            )
            ->whereNull('br.norec');

        $filter = $request->all();
        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '>=', $filter['tglAwal']);
        }
        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $tgl = $filter['tglAkhir']; //." 23:59:59";
            $data = $data->where('pd.tglregistrasi', '<=', $tgl);
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
            $data = $data->where('pd.noregistrasi', 'like', '%' . $filter['noreg'] . '%');
        }
        if (isset($filter['norm']) && $filter['norm'] != "" && $filter['norm'] != "undefined") {
            $data = $data->where('ps.nocm', 'like', '%' . $filter['norm'] . '%');
        }
        if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $data = $data->where('ps.namapasien', 'like', '%' . $filter['nama'] . '%');
        }
        $data = $data->orderBy('pd.noregistrasi');
        $data = $data->take(50);
        $data = $data->get();

        return $this->respond($data);
    }

    public function getTindakanTakTerklaim(Request $request)
    {
        $result = [];
        $total = 0;
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('pelayananpasientidakterklaim_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->join('kelas_m as kl', 'kl.id', '=', 'pp.kelasfk')
            ->join('kelompokpasien_m as kps', 'kps.id', '=', 'pd.objectkelompokpasienlastfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->join('ruangan_m as ru1', 'ru1.id', '=', 'apd.objectruanganfk')
            ->join('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->leftJoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pd.nostruklastfk')
            ->leftJoin('strukbuktipenerimaan_t as sbm', 'sbm.norec', '=', 'pd.nosbmlastfk')
            ->select(DB::raw("pp.norec as norec_pptk,pp.tglpelayanan,pr.namaproduk,
                     pp.jumlah,kl.namakelas,ru1.namaruangan,pp.hargajual as harga,case when pp.hargadiscount is null then 0 else pp.hargadiscount end as diskon,
                     sp.nostruk + ' / ' + sbm.nosbm as nostrukfk,sbm.nosbm,apd.objectruanganfk,
                     pr.id as prid,0 as klid,apd.norec as norec_apd,pd.norec as norec_pd,sp.norec as norec_sp,
                     pp.pelayananpasien as norec_pp,'-' as komponen,case when pp.jasa is null then 0 else pp.jasa end as jasa,
                     pp.aturanpakai"))
            ->where('pd.noregistrasi', $request['noregistrasi'])
            ->distinct()
            ->get();

        foreach ($data as $item) {
            $total = 0;
            if ($item->prid != null) {
                $total = (($total +  $item->harga -  $item->diskon) *  $item->jumlah) + $item->jasa;
            }

            //            $details = DB::select(DB::raw("
            //                select case when jpp.id is null then 0 else jpp.id end as jppid,
            //                case when jpp.jenispetugaspe is null then '-' else jpp.jenispetugaspe end as jenispetugaspe,
            //                case when ppp.objectpegawaifk is null then 0 else ppp.objectpegawaifk end as objectpegawaifk,
            //                case when pg.namalengkap is null then '-' else pg.namalengkap end as namalengkap
            //                from pelayananpasientidakterklaim_t as pptk
            //                LEFT JOIN pelayananpasienpetugas_t as ppp on ppp.pelayananpasien = pptk.pelayananpasien
            //                LEFT JOIN pegawai_m as pg on pg.id = ppp.objectpegawaifk
            //                LEFT JOIN jenispetugaspelaksana_m as jpp on jpp.id = ppp.objectjenispetugaspefk
            //                where pptk.nomasukfk=:norec"),
            //                array(
            //                    'norec' => $item->norec_pd,
            //                )
            //            );
            //            $details=$details->first();
            //            foreach ($details as $data){
            $result[] = array(
                'norec_pptk' => $item->norec_pptk,
                'tglPelayanan' => $item->tglpelayanan,
                'namaPelayanan' => $item->namaproduk,
                'jumlah' => $item->jumlah,
                'kelasTindakan' => $item->namakelas,
                'ruanganTindakan' => $item->namaruangan,
                'harga' => $item->harga,
                'diskon' => $item->diskon,
                'nostrukfk' => $item->nostrukfk,
                'nosbm' => $item->nosbm,
                'ruid' => $item->objectruanganfk,
                'prid' => $item->prid,
                'klid' => $item->klid,
                'total' => $total,
                'norec_apd' => $item->norec_apd,
                'norec_pd' => $item->norec_pd,
                'norec_sp' => $item->norec_sp,
                'norec_pp' => $item->norec_pp,
                'komponen' => $item->komponen,
                'jasa' => $item->jasa,
                'aturanpakai' => $item->aturanpakai,
                //                    'jppid' =>$item->jppid,
                //                    'jenispetugaspe' => $item->jenispetugaspe,
                //                    'dokter' => $item->namalengkap,
                //                    'pgid' => $item->objectpegawaifk,
            );
        }
        $result = array(
            'data' => $result,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }
    public function closePemeriksaan(Request $request)
    {
        DB::beginTransaction();
        $transStatus = 'true';
        try {
            $data = PasienDaftar::where('norec', $request['norec_pd'])
                ->update([
                    'isclosing' => true
                ]);
            $transMessage = "Closing Pemeriksaan Berhasil";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Closing Pemeriksaan Gagal";
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
    public function getStatusClosePemeriksaan(Request $request)
    {
        $data  = PasienDaftar::where('noregistrasi', $request['noregistrasi'])->first();
        $status = false;
        if (!empty($data) && $data->isclosing != null) {
            $status = $data->isclosing;
        }
        $result = array(
            'data' => $status,
            'message' => 'ramdan@epic',
        );
        return $this->respond($result);
    }
    public function getDataComboDetailRegis(Request $request)
    {
        $dataLogin = $request->all();

        $dataRuangan = \DB::table('ruangan_m as ru')
            ->select('ru.id', 'ru.namaruangan')
            ->whereIn('ru.objectdepartemenfk', array(3, 17, 18, 24, 25, 26, 27, 28, 16, 30, 34,73,74,75))
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();

        $dataRuanganKonsul = \DB::table('ruangan_m as ru')
            ->select('ru.id', 'ru.namaruangan')
            ->whereIn('ru.objectdepartemenfk', array(3, 17, 18, 24, 25, 26, 27, 28, 30, 34, 73, 74, 75))
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();

        $dataInstalasi = \DB::table('departemen_m as dp')
            //            ->whereIn('dp.id',[3, 14, 16, 17, 18, 19, 24, 25, 26, 27, 28, 35,30])
            ->where('dp.statusenabled', true)
            ->orderBy('dp.namadepartemen')
            ->get();

        $dataRuanganAll = \DB::table('ruangan_m as ru')
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();

        $dataRekanan = \DB::table('rekanan_m as ru')
            ->where('ru.statusenabled', true)
            ->select('ru.id', 'ru.namarekanan', 'ru.objectkelompokpasienfk')
            ->orderBy('ru.namarekanan')
            ->get();

        $dataKelompokPasien = \DB::table('kelompokpasien_m as ru')
            ->where('ru.statusenabled', true)
            ->select('ru.id', 'ru.kelompokpasien')
            ->orderBy('ru.kelompokpasien')
            ->get();
        $kelas = \DB::table('kelas_m as kls')
            ->select('kls.id', 'kls.namakelas')
            ->where('kls.statusenabled', true)
            ->orderBy('kls.namakelas')
            ->get();
        $statuspulang = \DB::table('statuspulang_m as sp')
            ->select('sp.id', 'sp.namaexternal')
            ->where('sp.statusenabled', true)
            ->where('sp.norec', 'like', '%RJ%')
            ->orderBy('sp.namaexternal')
            ->get();
        $pembatalan = \DB::table('pembatal_m as p')
            ->select('p.id', 'p.name')
            ->where('p.statusenabled', true)
            ->orderBy('p.name')
            ->get();

        $jaminanKhusus = \DB::table('jaminankhusus_m as jk')
            ->select('jk.id', 'jk.namaexternal')
            ->where('jk.statusenabled', true)
            ->get();

        $mapkelompokpasien = \DB::table('mapkelompokpasientopenjamin_m as mkp')
            ->select('mkp.id', 'mkp.objectkelompokpasienfk', 'mkp.kdpenjaminpasien')
            ->where('mkp.statusenabled', true)
            ->get();

        $dataPegawaiUser = DB::select(
            DB::raw("select pg.id,pg.namalengkap from loginuser_s as lu
                INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id
                where lu.id=:idLoginUser"),
            array(
                'idLoginUser' => $dataLogin['userData']['id'],
            )
        );
        $dataPenulis = Pegawai::where('statusenabled', true)
            ->where('objectjenispegawaifk', 1)
            ->get();
        foreach ($dataPenulis as $item) {
            $dataPenulis2[] = array(
                'id' => $item->id,
                'namalengkap' => $item->namalengkap,
            );
        }

        foreach ($dataInstalasi as $item) {
            $detail = [];
            foreach ($dataRuanganAll as $item2) {
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
        // return($dataRekanan);
        // die();
        foreach ($dataKelompokPasien as $itemk) {
            $detailk = [];
            foreach ($mapkelompokpasien as $itemm) {
                if ($itemk->id == $itemm->objectkelompokpasienfk)
                    foreach ($dataRekanan as $item3) {
                        if ($item3->id == $itemm->kdpenjaminpasien) {
                            $detailk[] = array(
                                'id' => $item3->id,
                                'rekanan' => $item3->namarekanan,
                            );
                        }
                    }
            }
            $rekanan[] = array(
                'id' => $itemk->id,
                'kelompok' => $itemk->kelompokpasien,
                'rekanan' => $detailk,
            );
        }

        $result = array(
            'ruangan' => $dataRuangan,
            'dokter' => $dataPenulis2,
            'detaillogin' => $dataPegawaiUser,
            'rekanan' => $dataRekanan,
            'rekanana' => $rekanan,
            'dataRuanganKonsul' => $dataRuanganKonsul,
            'kelompokpasien' => $dataKelompokPasien,
            'kelas' => $kelas,
            'departemen' => $dataDepartemen,
            'statuspulang' => $statuspulang,
            'pembatalan' => $pembatalan,
            'jaminankhusus' => $jaminanKhusus,
            'message' => 'as@epic',
        );
        return $this->respond($result);
    }
    public function getKedokteranForensikCombo(Request $request)
    {
        $jeniskekerasan = \DB::table('jeniskekerasan_t as jk')
            ->select('jk.id', 'jk.jeniskekerasan')
            ->where('jk.statusenabled', true)
            ->orderBy('jk.jeniskekerasan')
            ->get();

        $jenisrujukan = \DB::table('rujukandokterforensik_t as rdf')
            ->select('rdf.id', 'rdf.jenisrujukan as rujukandokter')
            ->where('rdf.statusenabled', true)
            ->orderBy('rdf.jenisrujukan')
            ->get();
        $permintaanpolres = \DB::table('permintaanpolres_t as pp')
            ->select('pp.id', 'pp.permintaanpolres')
            ->where('pp.statusenabled', true)
            ->orderBy('pp.permintaanpolres')
            ->get();

        $result = array(
            'jeniskekerasan' => $jeniskekerasan,
            'jenisrujukan' => $jenisrujukan,
            'permintaanpolres' => $permintaanpolres
        );
        return $this->respond($result);
    }

    public function getRuanganBed(Request $request)
    {
        $dataRuangan = \DB::table('ruangan_m as ru')
            ->select('ru.id', 'ru.namaruangan')
            // ->whereIn('ru.objectdepartemenfk', 16)
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();
        foreach ($dataRuangan as $item) {
            // $detail[];
            $detail[]  = array(
                'id' => $item->id,
                'namaruangan' => $item->namaruangan,
            );
        }
        // $dataRuanganAll = \DB::table('ruangan_m as ru')
        // ->where('ru.statusenabled', true)
        // ->orderBy('ru.namaruangan')
        // ->get();
        // foreach ($dataRuanganAll as $item2) {
        //     if ($item->id == $item2->objectdepartemenfk) {
        //         $detail[] = array(
        //             'id' => $item2->id,
        //             'ruangan' => $item2->namaruangan,
        //         );
        //     }
        // }
        $kelas = \DB::table('kelas_m as kls')
            ->select('kls.id', 'kls.namakelas')
            ->where('kls.statusenabled', true)
            ->orderBy('kls.namakelas')
            ->get();

        $result = array(
            'ruanganbed' => $detail,
            'kelas' => $kelas
        );
        return $this->respond($result);
    }
    public function ubahTanggalDetailRegis(Request $request)
    {
        DB::beginTransaction();
        //##Update Pasiendaftar##
        try {
            $dataRPP = RegistrasiPelayananPasien::where('noregistrasifk', $request['norec_pd'])->count();
            if ($request['tglregistrasi'] != '') {
                if ($dataRPP > 0) {
                    $updatePD = PasienDaftar::where('noregistrasi', $request['noregistrasi'])
                        ->update(
                            [
                                'tglregistrasi' => $request['tglregistrasi']

                            ]
                        );
                    $updateAPDs = AntrianPasienDiperiksa::where('norec', $request['norec_apd'])
                        ->update(
                            [
                                'tglregistrasi' => $request['tglregistrasi'],
                            ]
                        );
                } else {
                    $updatePD = PasienDaftar::where('noregistrasi', $request['noregistrasi'])
                        ->update(
                            [
                                'tglregistrasi' => $request['tglregistrasi'],
                                'tglpulang' => $request['tglregistrasi']
                            ]
                        );
                    $updateAPDs = AntrianPasienDiperiksa::where('norec', $request['norec_apd'])
                        ->update(
                            [
                                'tglregistrasi' => $request['tglregistrasi']
                            ]
                        );
                }
                $updatePD = PasienDaftar::where('noregistrasi', $request['noregistrasi'])
                    ->update(
                        [
                            'tglregistrasi' => $request['tglregistrasi']
                        ]
                    );
                $updateAPDs = AntrianPasienDiperiksa::where('norec', $request['norec_apd'])
                    ->update(
                        [
                            'tglregistrasi' => $request['tglregistrasi']
                        ]
                    );
            }

            if ($request['tglpulang'] != '') {
                if ($dataRPP > 0) {
                    $updatePD = PasienDaftar::where('noregistrasi', $request['noregistrasi'])
                        ->update(
                            [
                                'tglpulang' => $request['tglpulang']
                            ]
                        );
                } else {
                    $updatePD = PasienDaftar::where('noregistrasi', $request['noregistrasi'])
                        ->update(
                            [
                                'tglpulang' => $request['tglpulang'],
                            ]
                        );
                }
                $updatePD = PasienDaftar::where('noregistrasi', $request['noregistrasi'])
                    ->update(
                        [
                            'tglpulang' => $request['tglpulang']
                        ]
                    );
            }

            if ($request['tglkeluar'] != '' && $request['tglmasuk'] != '') {
                $updateAPD = AntrianPasienDiperiksa::where('norec', $request['norec_apd'])
                    ->update(
                        [
                            'tglkeluar' => $request['tglkeluar'],
                            'tglmasuk' => $request['tglmasuk']
                        ]
                    );
                if ($dataRPP > 0) {
                    $updateRPP = \DB::table('registrasipelayananpasien_t')
                        ->select('noregistrasifk', 'objectruanganfk', 'rpp.tglkeluar')
                        ->where('objectruanganfk', $request['ruanganasal'])
                        ->where('noregistrasifk', $request['norec_pd'])
                        ->update(
                            [
                                'tglkeluar' => $request['tglkeluar'],
                                'tglmasuk' => $request['tglmasuk']
                            ]
                        );
                }
            }
            if ($request['tglkeluar'] == '' && $request['tglmasuk'] != '') {
                $updateAssPD = AntrianPasienDiperiksa::where('norec', $request['norec_apd'])
                    ->update(
                        [
                            'tglmasuk' => $request['tglmasuk']

                        ]
                    );
                if ($dataRPP > 0) {
                    $updatessRPP = \DB::table('registrasipelayananpasien_t')
                        ->select('noregistrasifk', 'objectruanganfk', 'tglkeluar')
                        ->where('objectruanganfk', $request['ruanganasal'])
                        ->where('noregistrasifk', $request['norec_pd'])
                        ->update(
                            [
                                'tglmasuk' => $request['tglmasuk']
                            ]
                        );
                }
            }
            if ($request['tglkeluar'] != '' && $request['tglmasuk'] == '') {
                $updatseAPD = AntrianPasienDiperiksa::where('norec', $request['norec_apd'])
                    ->update(
                        [
                            'tglkeluar' => $request['tglkeluar']
                        ]
                    );
                if ($dataRPP  > 0) {
                    $updatsseRPP = \DB::table('registrasipelayananpasien_t')
                        ->select('noregistrasifk', 'objectruanganfk', 'tglkeluar')
                        ->where('objectruanganfk', $request['ruanganasal'])
                        ->where('noregistrasifk', $request['norec_pd'])
                        ->update(
                            [
                                'tglkeluar' => $request['tglkeluar']
                            ]
                        );
                }
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "simpan  Pasien";
        }

        if ($transStatus == 'true') {
            DB::commit();
            $transMessage = 'SUKSES';
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'dataPD' => $dataRPP,
                'as' => 'ramdanegie',
            );
        } else {
            $transMessage = "GAGAL";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'as' => 'ramdanegie',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function getDataLogin(Request $request)
    {
        $data = \DB::table('loginuser_s as lu')
            ->JOIN('pegawai_m as pg', 'pg.id', '=', 'lu.objectpegawaifk')
            ->select('pg.id', 'pg.namalengkap')
            ->where('lu.id', $request['userData']['id'])
            ->get();
        $data = \DB::table('pasiendaftar_t as pd')
            ->JOIN('ruangan_m as rm', 'rm.id', '=', 'pd.objectruanganlastfk')
            ->select('rm.namaruangan')
            ->where('pd.noregistrasi', $request['userData']['id'])
            ->get();

        return $this->respond($data);
    }
    public function getRuanganLast(Request $request)
    {

        $data = \DB::table('pasiendaftar_t as pd')
            ->JOIN('ruangan_m as rm', 'rm.id', '=', 'pd.objectruanganlastfk')
            ->select('rm.namaruangan')
            ->where('pd.noregistrasi', $request['noregistrasi'])
            ->get();

        return $this->respond($data);
    }
    public function getSumJmlByrObat(Request $request)
    {

        $data = DB::select(DB::raw("SELECT        sum(total) as total
        FROM            temp_billing_t
        WHERE        (noregistrasi = '$request[noregistrasi]') and ruangantindakan like '%Resep%'"));



        return $this->respond($data);
    }
    public function getSumJmlByrResepObat(Request $request)
    {

        $data = DB::select(DB::raw("SELECT        sum(totalharga) as totalharga, sum(totaldiscound) as totaldiscound, SUM(totalbiaya) AS totalBiaya
    FROM            V_CetakRincianResepAll
    WHERE        (norec = '$request[norec]')"));



        return $this->respond($data);
    }
    public function getSumJmlByrResepObatRajal(Request $request)
    {

        $data = DB::select(DB::raw("SELECT        sum(totalharga) as totalharga, sum(totaldiscound) as totaldiscound, SUM(totalbiaya) AS totalBiaya
    FROM            V_CetakRincianResepAll
    WHERE        (noregistrasi = '$request[noregistrasi]')"));



        return $this->respond($data);
    }
    public function getSumJmlByrResepObatRajal2(Request $request)
    {

        $data = DB::select(DB::raw("SELECT        sum(totalharga) as totalharga, sum(totaldiscound) as totaldiscound, SUM(totalbiaya) AS totalBiaya, ruanganpasien,norec
    FROM            V_CetakRincianResepAll
    WHERE        (noregistrasi = '$request[noregistrasi]')
    GROUP BY ruanganpasien,norec "));



        return $this->respond($data);
    }
    public function getPegawaiSaeutik(Request $request)
    {
        $req = $request->all();

        $Pegawai = \DB::table('pegawai_m as ru')
            ->select('ru.id', 'ru.namalengkap')
            ->where('ru.statusenabled', true)
            //            ->where('ru.objectjenispegawaifk', 1)
            ->orderBy('ru.namalengkap');

        if (
            isset($req['namapegawai']) &&
            $req['namapegawai'] != "" &&
            $req['namapegawai'] != "undefined"
        ) {
            $Pegawai = $Pegawai->where('ru.namalengkap', 'ilike', '%' . $req['namapegawai'] . '%');
        };
        if (
            isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $Pegawai = $Pegawai
                ->where('ru.namalengkap', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%');
            //                ->orWhere('dg.kddiagnosatindakan','like',$req['filter']['filters'][0]['value'].'%' )  ;
        }

        $Pegawai = $Pegawai->take(10);
        $Pegawai = $Pegawai->get();

        return $this->respond($Pegawai);
    }
    public function getComboJenisPetugasPel(Request $request)
    {

        $JenisPelaksana = \DB::table('jenispetugaspelaksana_m as jpp')
            ->select('jpp.id', 'jpp.jenispetugaspe as jenisPetugasPelaksana')
            ->where('jpp.statusenabled', true)
            ->orderBy('jpp.jenispetugaspe')
            ->get();

        $result = array(

            'jenispetugaspelaksana' => $JenisPelaksana,
            'message' => 'er@epic',
        );

        return $this->respond($result);
    }
    public function getPelPetugasByPelPasien(Request $request)
    {
        $data4 = \DB::table('pelayananpasien_t as pp')
            ->join('pelayananpasienpetugas_t as ppp', 'pp.norec', '=', 'ppp.pelayananpasien')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'ppp.objectpegawaifk')
            ->leftjoin('jenispetugaspelaksana_m as jpp', 'jpp.id', '=', 'ppp.objectjenispetugaspefk')
            ->select(
                'pp.norec as norec_pp',
                'ppp.norec as norec_ppp',
                'pg.id as pg_id',
                'pg.namalengkap',
                'jpp.jenispetugaspe',
                'jpp.id as jpp_id'
            )
            ->where('pp.norec', $request['norec_pp'])
            //->where('jpp.id','<>',2)
            ->distinct()
            ->get();


        $result = array(
            'data' => $data4,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function simpanDokterPPP(Request $request)
    {
        DB::beginTransaction();
        $new_PPP = $request['pelayananpasienpetugas'];

        try {
            if (isset($new_PPP['norec_ppp']) && $new_PPP['norec_ppp'] == '' && isset($new_PPP['objectjenispetugaspefk'])) {
                $data1 = new PelayananPasienPetugas();
                $data1->norec = $data1->generateNewId();
                $data1->kdprofile = 0;
                $data1->statusenabled = true;
            } else {
                $data1 =  PelayananPasienPetugas::where('norec', $new_PPP['norec_ppp'])->first();
            }
            if (!empty($data1)) {
                $data1->nomasukfk = $new_PPP['norec_apd'];
                //                $data1->objectasalprodukfk = true;
                $data1->objectjenispetugaspefk = $new_PPP['objectjenispetugaspefk'];
                //                $data1->objectprodukfk = true;
                //                $data1->objectruanganfk = true;
                //                $data1->deskripsitugasfungsi = true;
                //                $data1->ispetugaspepjawab = true;
                $data1->pelayananpasien = $new_PPP['norec_pp'];
                //                $data1->tglpelayanan = true;
                $data1->objectpegawaifk = $new_PPP['objectpegawaifk'];
                $data1->save();
            }

            if (isset($new_PPP['isparamedis'])) {
                $data2 =  PelayananPasien::where('norec', $new_PPP['norec_pp'])->first();
                if (!empty($data2)) {
                    $data2->isparamedis =  $new_PPP['isparamedis'];
                    $data2->save();
                }
            }
            $transStatus = 'true';
            $transMessage = "Simpan PelayananPasienPetugas berhasil!";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Simpan PelayananPasienPetugas Gagal!";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => $data1 != null ? $data1 : $data2,
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
    public function hapusPPP(Request $request)
    {
        $dataLogin = $request->all();
        DB::beginTransaction();
        $r_PPP = $request['pelayananpasienpetugas'];
        if ($r_PPP['norec_ppp'] != '' || $r_PPP['norec_ppp'] != 'undefined') {
            try {
                $data1 = PelayananPasienPetugas::where('norec', $r_PPP['norec_ppp'])->delete();
                $transStatus = 'true';
            } catch (\Exception $e) {
                $transStatus = false;
            }
        }
        if ($transStatus = 'true') {
            DB::commit();
            $transMessage = "Hapus PelayananPasienPetugas berhasil!";
        } else {
            DB::rollBack();
            $transMessage = "Hapus PelayananPasienPetugas berhasil!";
        }

        return $this->setStatusCode(201)->respond([], $transMessage);
    }
    public function deletePelayananPasien(Request $request)
    {

        DB::beginTransaction();
        try {
            // dataDel
            foreach ($request['dataDel'] as $item) {
                $HapusPP = PelayananPasien::where('norec', $item['norec_pp'])->get();

                foreach ($HapusPP as $pp) {
                    $newHis = new AlasanHapus();
                    $newHis->norec = $newHis->generateNewId();
                    $newHis->noregistrasi = $request['noregistrasi'];
                    $newHis->produkfk = $pp['produkfk'];
                    $newHis->alasan = $request['alasan'];
                    $newHis->jumlah = (float)$pp['jumlah'];
                    $newHis->namauser = $request['pegawai'];
                    $newHis->tglhapus = Carbon::now();
                    $newHis->tglpelayanan = $pp['tglpelayanan'];
                    $newHis->save();

                    $HapusPPD = PelayananPasienDetail::where('pelayananpasien', $pp['norec'])->delete();
                    $HapusPPP = PelayananPasienPetugas::where('pelayananpasien', $pp['norec'])->delete();
                }
                $Edit = PelayananPasien::where('norec', $item['norec_pp'])->delete();
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
    public function gantiRuanganTerakhir(Request $request)
    {

        DB::beginTransaction();
        try {
            // foreach ($request['dataDel'] as $item) {
            // return($request);
            // die();
            $updatePD = PasienDaftar::where('noregistrasi', $request['noregistrasi'])
                ->update(
                    [
                        'objectruanganlastfk' => $request['ruangantujuan'],
                    ]
                );

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = " PP PPD PPP";
        }
        if ($transStatus == 'true') {
            $transMessage = "Ganti Ruangan Pasien Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'tukangkomputer',
            );
        } else {
            $transMessage = "Ganti Ruangan Pasien Berhasil";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'tukangkomputer',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function pindahPelayananPasien(Request $request)
    {

        DB::beginTransaction();
        try {
            // foreach ($request['dataDel'] as $item) {
            // return($request);
            // die();
            $updatePP = PelayananPasien::where('noregistrasifk', $request['norec_apd'])
                ->update(
                    [
                        'noregistrasifk' => $request['norec_apd_tujuan'],
                    ]
                );
            $updatePPD = PelayananPasienDetail::where('noregistrasifk', $request['norec_apd'])
                ->update(
                    [
                        'noregistrasifk' => $request['norec_apd_tujuan'],
                    ]
                );
            $updatePPP = PelayananPasienPetugas::where('nomasukfk', $request['norec_apd'])
                ->update(
                    [
                        'nomasukfk' => $request['norec_apd_tujuan'],
                    ]
                );
            $updateDP = DiagnosaPasien::where('noregistrasifk', $request['norec_apd'])
                ->update(
                    [
                        'noregistrasifk' => $request['norec_apd_tujuan'],
                    ]
                );
            $updateDDP = DetailDiagnosaPasien::where('noregistrasifk', $request['norec_apd'])
                ->update(
                    [
                        'noregistrasifk' => $request['norec_apd_tujuan'],
                    ]
                );
            $updateDDP = StrukResep::where('pasienfk', $request['norec_apd'])
                ->update(
                    [
                        'pasienfk' => $request['norec_apd_tujuan'],
                    ]
                );
            $updateAPD = AntrianPasienDiperiksa::where('norec', $request['norec_apd'])
                ->update(
                    [
                        'statusenabled' => false,
                    ]
                );
            // $delete = AntrianPasienDiperiksa::where('norec', $request['norec_apd'])->delete();

            // foreach ($HapusPP as $pp) {
            $newHis = new AlasanHapus();
            $newHis->norec = $newHis->generateNewId();
            $newHis->noregistrasi = $request['norec_apd_tujuan'];
            $newHis->alasan = $request['norec_apd'] . ' Pindah Tindakan ' . $request['alasan'];
            $newHis->namauser = $request['pegawai'];
            $newHis->tglhapus = Carbon::now();
            $newHis->save();
            // }
            // }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = " PP PPD PPP";
        }
        if ($transStatus == 'true') {
            $transMessage = "Pindah Pelayanan Pasien";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                //                "nokirim" => $dataSO,//$noResep,,//$noResep,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Pindah Pelayanan Pasien Gagal";
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
    public function pindahHistoryAPD(Request $request)
    {

        DB::beginTransaction();
        try {
            $updateAPD = AntrianPasienDiperiksa::where('norec', $request['norec_apd'])
                ->update(
                    [
                        'noregistrasifk' => $request['norec_pd_tujuan'],
                    ]
                );

            $newHis = new AlasanHapus();
            $newHis->norec = $newHis->generateNewId();
            $newHis->noregistrasi = $request['norec_pd_tujuan'];
            $newHis->alasan = $request['norec_apd'] . ' Pindah Tindakan ke norec_PD ' . $request['alasan'];
            $newHis->namauser = $request['pegawai'];
            $newHis->tglhapus = Carbon::now();
            $newHis->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = " PP PPD PPP";
        }
        if ($transStatus == 'true') {
            $transMessage = "Pindah Pelayanan Pasien";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Pindah Pelayanan Pasien Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function pindahHistoryAPDdetail(Request $request)
    {

        DB::beginTransaction();
        try {

            foreach ($request['detail_tindakan'] as $item) {
                $updatePP = PelayananPasien::where('norec', $item['norec'])
                    ->update(
                        [
                            'noregistrasifk' => $request['norec_apd_tujuan'],
                        ]
                    );
                $updatePPP = PelayananPasienPetugas::where('pelayananpasien', $item['norec'])
                    ->update(
                        [
                            'nomasukfk' => $request['norec_apd_tujuan'],
                        ]
                    );
                $updatePPD = PelayananPasienDetail::where('pelayananpasien', $item['norec'])
                    ->update(
                        [
                            'noregistrasifk' => $request['norec_apd_tujuan'],
                        ]
                    );
                $updateHasilLab = HasilLaboratorium::where('norecpelayanan', $item['norec'])
                    ->update(
                        [
                            'noregistrasifk' => $request['norec_apd_tujuan'],
                        ]
                    );
                $updateHasilRad = HasilRadiologi::where('pelayananpasienfk', $item['norec'])
                    ->update(
                        [
                            'noregristrasifk' => $request['norec_apd_tujuan'],
                        ]
                    );
            }


            $newHis = new AlasanHapus();
            $newHis->norec = $newHis->generateNewId();
            $newHis->noregistrasi = $request['norec_apd_tujuan'];
            $newHis->alasan = $request['norec_apd_tujuan'] . ' Pindah Tindakan Detail ke norec_APD ' . $request['alasan'];
            $newHis->namauser = $request['pegawai'];
            $newHis->tglhapus = Carbon::now();
            $newHis->save();
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = " PP PPD PPP";
        }
        if ($transStatus == 'true') {
            $transMessage = "Pindah Pelayanan Pasien";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Pindah Pelayanan Pasien Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message"  => $transMessage,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function simpanUpdateDiskonKomponen(Request $request)
    {
        $dataLog = $request->all();
        DB::beginTransaction();
        $transStatus = 'true';
        $nilaiCito = 0;
        $totalJasa = 0;
        if ($request['hargajasa'] != 0) {
            $nilaiCito = 0.25;
        }
        try {
            $data = PelayananPasienDetail::where('norec', $request['norec_ppd'])
                ->update(
                    [
                        'hargadiscount' => $request['hargadiskon'],
                        'jasa' => ($request['hargakomponen'] - $request['hargadiskon']) * $nilaiCito,
                    ]
                );
            $totalDiskon = 0.0;
            $dataaa = PelayananPasienDetail::where('pelayananpasien', $request['norec_pp'])->get();
            foreach ($dataaa as $item) {
                $totalDiskon = $totalDiskon + $item->hargadiscount;
                $totalJasa = $totalJasa + $item->jasa;
            }
            $data2 = PelayananPasien::where('norec', $request['norec_pp'])
                ->update([
                    'hargadiscount' => $totalDiskon,
                    'jasa' => $totalJasa
                ]);
            $transMessage = "Update Diskon Komponen berhasil!";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Update Diskon Komponen gagal";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => $dataaa,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "data" => $dataLog,
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function simpanUpdateDiskonProposi(Request $request)
    {
        $dataLog = $request->all();
        DB::beginTransaction();
        $transStatus = 'true';
        $nilaiCito = 0;
        try {
            $totalDiskon = 0.0;
            $dataaa = PelayananPasienDetail::where('pelayananpasien', $request['norec_pp'])->get();
            foreach ($dataaa as $item) {
                if ($item->hargasatuan <> 0) {
                    $hargadiscountkomponen = ($item->hargasatuan / $request['hargakomponen']) * $request['hargadiskon'];
                    // return($item->norec_ppd);
                    // die();
                    $data = PelayananPasienDetail::where('norec', $item->norec)
                        ->update(
                            [
                                'hargadiscount' => $hargadiscountkomponen,
                            ]
                        );
                    $totalDiskon = $totalDiskon + $hargadiscountkomponen;
                }
            }
            $cekDiscount = PelayananPasienDetail::where('pelayananpasien', $request['norec_pp'])->select('norec', 'hargadiscount')->orderBy('hargadiscount', 'desc')->get();
            // return($cekDiscount[0]->hargadiscount);
            // die();
            $x = 0.0;
            $y = 0;
            if ($totalDiskon > $request['hargadiskon']) {
                $x = $totalDiskon - $request['hargadiskon'];
                $x = $cekDiscount[0]->hargadiscount - $x;
                $data = PelayananPasienDetail::where('norec', $item->norec)
                    ->update(
                        [
                            'hargadiscount' => $x,
                        ]
                    );
            }
            if ($totalDiskon < $request['hargadiskon']) {
                $x = $request['hargadiskon'] - $totalDiskon;
                $x = $cekDiscount[0]->hargadiscount + $x;
                $data = PelayananPasienDetail::where('norec', $item->norec)
                    ->update(
                        [
                            'hargadiscount' => $x,
                        ]
                    );
            }
            $data2 = PelayananPasien::where('norec', $request['norec_pp'])
                ->update([
                    'hargadiscount' => $request['hargadiskon'],
                ]);
            $transMessage = "Update Diskon Proposi berhasil!";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Update Diskon Proposi gagal";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "status" => 201,
                "data" => $dataaa,
                "message" => $transMessage,
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "data" => $dataLog,
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function simpanDiskonTagihan(Request $request)
    {
        $dataLog = $request->all();
        DB::beginTransaction();
        $transStatus = 'true';
        $nilaiCito = 0;
        $noRegister = $request['noregistrasi'];
        $hargadiskon = $request['hargadiskon'];
        // try{
        $pasienDaftar = PasienDaftar::where('noregistrasi', $noRegister)->first();
        $totalhargatindakan =  DB::select(DB::raw("
                select sum(pp.hargasatuan*pp.jumlah)as totalhargatindakan from pasiendaftar_t as pd
                inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                where pd.noregistrasi='$noRegister' and pp.strukfk is null  and pp.isobat is null            
            "));
        $pelayanan =  DB::select(DB::raw("
                select pp.* from pasiendaftar_t as pd
                inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                where pd.noregistrasi='$noRegister' and pp.strukfk is null  and pp.isobat is null and pp.produkfk<>402611
            "));
        if (count($totalhargatindakan) == 0) {
            $transMsg = "Pelayanan yang dilakukan pasien tidak ada.";
        }
        $totalDiskonTagihan = 0.0;
        foreach ($pelayanan as $itemhead) {
            if ($itemhead->hargasatuan <> 0) {
                $hargadiscountpertindakan = (($itemhead->hargasatuan) / $totalhargatindakan[0]->totalhargatindakan) * $request['hargadiskon'];
                // if($itemhead->norec='1a278870-91d9-11eb-b60e-b782b098'){
                //     return($hargadiscountpertindakan);
                //     die();
                // }
                $data = PelayananPasien::where('norec', $itemhead->norec)
                    ->update(
                        [
                            'hargadiscount' => ceil($hargadiscountpertindakan),
                        ]
                    );
                $totalDiskonTagihan = $totalDiskonTagihan + (ceil($hargadiscountpertindakan) * $itemhead->jumlah);
                $pelayanandetail = PelayananPasienDetail::where('pelayananpasien', $itemhead->norec)->get();
                $totalDiskonKomponen = 0.0;
                foreach ($pelayanandetail as $itemsub) {
                    if ($itemsub->hargasatuan <> 0) {
                        $hargadiscountkomponen = ($itemsub->hargasatuan / $itemhead->hargasatuan) * ceil($hargadiscountpertindakan);
                        // return($hargadiscountkomponen);
                        // die();
                        $data = PelayananPasienDetail::where('norec', $itemsub->norec)
                            ->update(
                                [
                                    'hargadiscount' => ceil($hargadiscountkomponen),
                                ]
                            );
                        $totalDiskonKomponen = $totalDiskonKomponen + ceil($hargadiscountkomponen);
                    }
                }
                $cekDiscount = PelayananPasienDetail::where('pelayananpasien', $itemhead->norec)->select('norec', 'hargadiscount')->orderBy('hargadiscount', 'desc')->get();
                $x = 0.0;
                $y = 0;

                if ($totalDiskonKomponen > ceil($hargadiscountpertindakan)) {
                    $x = $totalDiskonKomponen - ceil($hargadiscountpertindakan);
                    $x = $cekDiscount[0]->hargadiscount - $x;
                    $data = PelayananPasienDetail::where('norec', $cekDiscount[0]->norec)
                        ->update(
                            [
                                'hargadiscount' => $x,
                            ]
                        );
                }
                if ($totalDiskonKomponen < ceil($hargadiscountpertindakan)) {
                    $x = ceil($hargadiscountpertindakan) - $totalDiskonKomponen;
                    $x = $cekDiscount[0]->hargadiscount + $x;
                    $data = PelayananPasienDetail::where('norec', $cekDiscount[0]->norec)
                        ->update(
                            [
                                'hargadiscount' => $x,
                            ]
                        );
                }
            }
        }

        $cekDiscountTagihan =  DB::select(DB::raw("
                select pp.* from pasiendaftar_t as pd
                inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                where pd.noregistrasi='$noRegister' and pp.strukfk is null  and pp.isobat is null and pp.produkfk<>402611
            "));
        $x = 0.0;
        $y = 0;
        // return(ceil($totalDiskonTagihan));
        // die();
        if ($hargadiskon > ceil($totalDiskonTagihan)) {
            $x = $hargadiskon - ceil($totalDiskonTagihan);
            $y = $x;
            $x = $cekDiscountTagihan[0]->hargadiscount + $x;
            $data = PelayananPasien::where('norec', $cekDiscountTagihan[0]->norec)
                ->update(
                    [
                        'hargadiscount' => $x,
                    ]
                );
            $pelayanandetail = PelayananPasienDetail::where('pelayananpasien', $cekDiscountTagihan[0]->norec)->get();
            $x = $pelayanandetail[0]->hargadiscount + $y;
            $data = PelayananPasienDetail::where('norec', $pelayanandetail[0]->norec)
                ->update(
                    [
                        'hargadiscount' => ceil($x),
                    ]
                );
        }
        if ($hargadiskon < ceil($totalDiskonTagihan)) {
            $x = ceil($totalDiskonTagihan) - $hargadiskon;
            $y = $x;
            $x = $cekDiscountTagihan[0]->hargadiscount - $x;
            $data = PelayananPasien::where('norec', $cekDiscountTagihan[0]->norec)
                ->update(
                    [
                        'hargadiscount' => $x,
                    ]
                );
            $pelayanandetail = PelayananPasienDetail::where('pelayananpasien', $cekDiscountTagihan[0]->norec)->get();
            $x = $pelayanandetail[0]->hargadiscount - $y;
            $data = PelayananPasienDetail::where('norec', $pelayanandetail[0]->norec)
                ->update(
                    [
                        'hargadiscount' => ceil($x),
                    ]
                );
        }


        $transMessage = "Update Diskon Proposi berhasil!";
        // }
        // catch(\Exception $e){
        //     $transStatus = 'false';
        //     $transMessage = "Update Diskon Proposi gagal";
        // }

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
                "data" => $dataLog,
                "message" => $transMessage,
            );
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    public function  getHeaderRekapTagihan($noregistrasi)
    {
        $data = \DB::table('pasiendaftar_t as pd')
            ->leftjoin('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftjoin('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->leftjoin('kelompokpasien_m as kps', 'kps.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftjoin('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
            ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->leftjoin('alamat_m as alm', 'alm.id', '=', 'pd.nocmfk')
            ->leftjoin('agama_m as agm', 'agm.id', '=', 'ps.objectagamafk')
            ->select(
                'pd.norec as norec_pd',
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'ps.nocm',
                'ps.namapasien',
                'ps.tgllahir',
                'ps.namakeluarga',
                'ru.namaruangan',
                'kls.namakelas',
                'kps.kelompokpasien',
                'rk.namarekanan',
                'alm.alamatlengkap',
                'jk.jeniskelamin',
                'agm.agama',
                'ps.nohp',
                'pd.statuspasien',
                'pd.tglpulang'
            )
            ->where('pd.noregistrasi', $noregistrasi)
            ->first();

        $result = array(
            'data' => $data,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getRekapTagihan($noregistasi)
    {
        $pelayanan = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->leftjoin('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->join('kelas_m as kl', 'kl.id', '=', 'apd.objectkelasfk')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftjoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
            ->leftjoin('strukbuktipenerimaan_t as sbm', 'sp.nosbmlastfk', '=', 'sbm.norec')
            ->leftjoin('strukresep_t as sre', 'sre.norec', '=', 'pp.strukresepfk')
            ->select(
                'pp.norec',
                'pp.tglpelayanan',
                'pp.rke',
                'pr.id as prid',
                'pr.namaproduk',
                'pp.jumlah',
                'kl.id as klid',
                'kl.namakelas',
                'ru.id as ruid',
                'ru.namaruangan',
                'pp.produkfk',
                'pp.hargajual',
                'pp.hargadiscount',
                'sp.nostruk',
                'sp.tglstruk',
                'apd.norec as norec_apd',
                'sbm.nosbm',
                'sp.norec as norec_sp',
                'pp.jasa',
                'pd.nocmfk',
                'pd.nostruklastfk',
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'pd.norec as norec_pd',
                'pd.tglpulang',
                'pd.objectrekananfk as rekananid',
                'pp.jasa',
                'sp.totalharusdibayar',
                'sp.totalprekanan',
                'sp.totalbiayatambahan',
                'pp.aturanpakai',
                'pp.iscito',
                'pd.statuspasien',
                'pp.isparamedis',
                'pp.strukresepfk'
            )
            ->where('pd.noregistrasi', $noregistasi);
        //			->orderBy('pp.tglpelayanan', 'pp.rke');

        $pelayanan = $pelayanan->get();

        if (count($pelayanan) > 0) {
            $details = array();
            foreach ($pelayanan as $value) {
                if ($value->prid != $this->getProdukIdDeposit()) {
                    $jasa = 0;
                    if (isset($value->jasa) && $value->jasa != "" && $value->jasa != null) {
                        $jasa = (float) $value->jasa;
                    }

                    $harga = (float)$value->hargajual;
                    $diskon = (float)$value->hargadiscount;
                    $detail = array(
                        'norec' => $value->norec,
                        'tglPelayanan' => $value->tglpelayanan,
                        'namaPelayanan' => $value->namaproduk,
                        'jumlah' => (float)$value->jumlah,
                        'kelasTindakan' => @$value->namakelas,
                        'ruanganTindakan' => @$value->namaruangan,
                        'harga' => $harga,
                        'diskon' => $diskon,
                        'total' => (($harga - $diskon) * $value->jumlah) + $jasa,
                        'strukfk' => $value->nostruk,
                        'sbmfk' => $value->nosbm,
                        'pgid' => '',
                        'ruid' => $value->ruid,
                        'prid' => $value->prid,
                        'klid' => $value->klid,
                        'norec_apd' => $value->norec_apd,
                        'norec_pd' => $value->norec_pd,
                        'norec_sp' => $value->norec_sp,
                        'jasa' => $jasa,
                        'aturanpakai' => $value->aturanpakai,
                        'iscito' => $value->iscito,
                        'isparamedis' => $value->isparamedis,
                        'strukresepfk' => $value->strukresepfk
                    );

                    $details[] = $detail;
                }
            }
        }

        $arrHsil = array(
            'details' => $details,
            'deposit' =>  $this->getDepositPasien($noregistasi),
        );
        return $this->respond($arrHsil);
    }

    public function saveLoggingUnverifTarek(Request $request)
    {
        DB::beginTransaction();

        $transStatus = true;
        $dataLogin = $request->all();

        $pasienDaftar = PasienDaftar::where('noregistrasi', $request['noregistrasi'])->first();
        $pasienDaftar = $pasienDaftar->norec;
        $strukPelayanan = StrukPelayanan::where('noregistrasifk', $pasienDaftar)->first();
        $newId = LoggingUser::max('id');
        $newId = $newId + 1;
        $logUser = new LoggingUser();
        $logUser->id = $newId;
        $logUser->norec = $logUser->generateNewId();
        $logUser->kdprofile = 11;
        $logUser->statusenabled = true;
        $logUser->jenislog = 'Unverifikasi TataRekening';
        $logUser->referensi = 'norec Struk Pelayanan';
        $logUser->noreff = $strukPelayanan->norec; //$request['noregistrasi'];
        $logUser->objectloginuserfk =  $dataLogin['userData']['id']; //$dataPegawaiUser[0]->id;
        $logUser->tanggal = $this->getDateTime()->format('Y-m-d H:i:s');
        if (!empty($strukPelayanan)) {
            $logUser->keterangan = 'Unverifikasi TataRekening No ' . $strukPelayanan->nostruk . ' / No Registrasi ' . $request['noregistrasi'];
        }
        //            try {
        $logUser->save();
        $transMsg = "Simpan Log Sukses ";
        //
        //            } catch (\Exception $e) {
        //                $transStatus = false;
        //                $transMsg = "Simpan Log Gagal ";
        //
        //            }

        if ($transStatus == true) {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMsg
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMsg
            );
        }
        return $this->respond($result);
        //        return $this->setStatusCode($result['status'])->respond($result, $transMsg);
    }
    public function saveLoggingClosing(Request $request)
    {
        DB::beginTransaction();
        $transStatus = true;
        $dataLogin = $request->all();
        // $alasan = '';
        // if (isset($request['alasanbatalclosing']) && $request['alasanbatalclosing'] != "" && $request['alasanbatalclosing'] != "undefined") {
        //     $alasan = $request['alasanbatalclosing'];
        // }
        // $pasienDaftar = PasienDaftar::where('noregistrasi', $request['noregistrasi'])->first();

        $newId = LoggingUser::max('id');
        $newId = $newId + 1;
        $logUser = new LoggingUser();
        $logUser->id = $newId;
        $logUser->norec = $logUser->generateNewId();
        $logUser->kdprofile = 0;
        $logUser->statusenabled = true;
        $logUser->jenislog = 'Closing Pemeriksaan';
        $logUser->noreff = $request['noregistrasi'];
        // $logUser->noreff = $pasienDaftar->noregistrasi;
        $logUser->referensi = 'NoRegistrasi Pasien Daftar';
        $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
        $logUser->tanggal = $this->getDateTime()->format('Y-m-d H:i:s');
        $logUser->keterangan = 'Closing Pemeriksaan No Registrasi ' . $request['noregistrasi'];
        $logUser->save();


        if ($transStatus == true) {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => 'ea@epic'
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => 'ea@epic'
            );
        }
        return $this->respond($result);
    }

    public function saveLoggingClosingFaktur(Request $request)
    {
        DB::beginTransaction();
        $transStatus = true;
        $dataLogin = $request->all();
        // $alasan = '';
        // if (isset($request['alasanbatalclosing']) && $request['alasanbatalclosing'] != "" && $request['alasanbatalclosing'] != "undefined") {
        //     $alasan = $request['alasanbatalclosing'];
        // }
        // $pasienDaftar = PasienDaftar::where('noregistrasi', $request['noregistrasi'])->first();

        $newId = LoggingUser::max('id');
        $newId = $newId + 1;
        $logUser = new LoggingUser();
        $logUser->id = $newId;
        $logUser->norec = $logUser->generateNewId();
        $logUser->kdprofile = 0;
        $logUser->statusenabled = true;
        $logUser->jenislog = 'Closing Faktur';
        $logUser->noreff = $request['noregistrasi'];
        // $logUser->noreff = $pasienDaftar->noregistrasi;
        $logUser->referensi = 'NoRegistrasi Pasien Daftar';
        $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
        $logUser->tanggal = $this->getDateTime()->format('Y-m-d H:i:s');
        $logUser->keterangan = 'Closing Faktur No Registrasi ' . $request['noregistrasi'];
        $logUser->save();


        if ($transStatus == true) {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => 'ea@epic'
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => 'ea@epic'
            );
        }
        return $this->respond($result);
    }
    public function saveLoggingUnclosing(Request $request)
    {
        DB::beginTransaction();
        $transStatus = true;
        $dataLogin = $request->all();
        // $alasan = '';
        // if (isset($request['alasanbatalclosing']) && $request['alasanbatalclosing'] != "" && $request['alasanbatalclosing'] != "undefined") {
        //     $alasan = $request['alasanbatalclosing'];
        // }
        // $pasienDaftar = PasienDaftar::where('noregistrasi', $request['noregistrasi'])->first();

        $newId = LoggingUser::max('id');
        $newId = $newId + 1;
        $logUser = new LoggingUser();
        $logUser->id = $newId;
        $logUser->norec = $logUser->generateNewId();
        $logUser->kdprofile = 0;
        $logUser->statusenabled = true;
        $logUser->jenislog = 'Batal Closing ';
        $logUser->noreff = $request['noregistrasi'];
        // $logUser->noreff = $pasienDaftar->noregistrasi;
        $logUser->referensi = 'NoRegistrasi Pasien Daftar';
        $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
        $logUser->tanggal = $this->getDateTime()->format('Y-m-d H:i:s');
        $logUser->keterangan = 'Alasan : ' . $request['alasanbatalclosing'] . ' / Batal Closing No Registrasi :' . $request['noregistrasi'];
        $logUser->save();


        if ($transStatus == true) {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => 'ea@epic'
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => 'ea@epic'
            );
        }
        return $this->respond($result);
    }

    public function saveLoggingClaim(Request $request)
    {
        DB::beginTransaction();
        $transStatus = true;
        $dataLogin = $request->all();
        // $alasan = '';
        // if (isset($request['alasanbatalclosing']) && $request['alasanbatalclosing'] != "" && $request['alasanbatalclosing'] != "undefined") {
        //     $alasan = $request['alasanbatalclosing'];
        // }
        // $pasienDaftar = PasienDaftar::where('noregistrasi', $request['noregistrasi'])->first();

        $newId = LoggingUser::max('id');
        $newId = $newId + 1;
        $logUser = new LoggingUser();
        $logUser->id = $newId;
        $logUser->norec = $logUser->generateNewId();
        $logUser->kdprofile = 0;
        $logUser->statusenabled = true;
        $logUser->jenislog = 'Claim InaCbg';
        $logUser->noreff = $request['noregistrasi'];
        // $logUser->noreff = $pasienDaftar->noregistrasi;
        $logUser->referensi = 'NoRegistrasi Pasien Daftar';
        $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
        $logUser->tanggal = $this->getDateTime()->format('Y-m-d H:i:s');
        $logUser->keterangan = 'Claim No Registrasi ' . $request['noregistrasi'];
        $logUser->save();


        if ($transStatus == true) {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => 'ea@epic'
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => 'ea@epic'
            );
        }
        return $this->respond($result);
    }

    public function saveLoggingPemotonganPajak(Request $request)
    {
        DB::beginTransaction();
        $transStatus = true;
        $dataLogin = $request->all();
        $newId = LoggingUser::max('id');
        $newId = $newId + 1;
        $logUser = new LoggingUser();
        $logUser->id = $newId;
        $logUser->norec = $logUser->generateNewId();
        $logUser->kdprofile = 0;
        $logUser->statusenabled = true;
        $logUser->jenislog = 'Pajak Penghasilan';
        $logUser->noreff = $request['idPegawai'];
        $logUser->referensi = 'Id Data Pegawai';
        $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
        $logUser->tanggal = $this->getDateTime()->format('Y-m-d H:i:s');
        $logUser->keterangan = 'Pajak Penghasilan Pegawai ' . $request['nama'] . ' . NIK : ' . $request['noidentitas'];
        $logUser->save();


        if ($transStatus == true) {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => 'ea@epic'
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => 'ea@epic'
            );
        }
        return $this->respond($result);
    }

    public function saveLoggingUnClaim(Request $request)
    {
        DB::beginTransaction();
        $transStatus = true;
        $dataLogin = $request->all();
        // $alasan = '';
        // if (isset($request['alasanbatalclosing']) && $request['alasanbatalclosing'] != "" && $request['alasanbatalclosing'] != "undefined") {
        //     $alasan = $request['alasanbatalclosing'];
        // }
        // $pasienDaftar = PasienDaftar::where('noregistrasi', $request['noregistrasi'])->first();

        $newId = LoggingUser::max('id');
        $newId = $newId + 1;
        $logUser = new LoggingUser();
        $logUser->id = $newId;
        $logUser->norec = $logUser->generateNewId();
        $logUser->kdprofile = 0;
        $logUser->statusenabled = true;
        $logUser->jenislog = 'Batal Claim InaCbg';
        $logUser->noreff = $request['noregistrasi'];
        // $logUser->noreff = $pasienDaftar->noregistrasi;
        $logUser->referensi = 'NoRegistrasi Pasien Daftar';
        $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
        $logUser->tanggal = $this->getDateTime()->format('Y-m-d H:i:s');
        $logUser->keterangan = 'Alasan : ' . $request['alasanbatalclaim'] . ' / Batal Claim No Registrasi :' . $request['noregistrasi'];
        $logUser->save();

        // return($request['alasanbatalclaim']);
        // die();

        if ($transStatus == true) {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => 'ea@epic'
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => 'ea@epic'
            );
        }
        return $this->respond($result);
    }

    public function saveLoggingUnclosingFaktur(Request $request)
    {
        DB::beginTransaction();
        $transStatus = true;
        $dataLogin = $request->all();
        // $alasan = '';
        // if (isset($request['alasanbatalclosing']) && $request['alasanbatalclosing'] != "" && $request['alasanbatalclosing'] != "undefined") {
        //     $alasan = $request['alasanbatalclosing'];
        // }
        // $pasienDaftar = PasienDaftar::where('noregistrasi', $request['noregistrasi'])->first();

        $newId = LoggingUser::max('id');
        $newId = $newId + 1;
        $logUser = new LoggingUser();
        $logUser->id = $newId;
        $logUser->norec = $logUser->generateNewId();
        $logUser->kdprofile = 0;
        $logUser->statusenabled = true;
        $logUser->jenislog = 'Open Faktur';
        $logUser->noreff = $request['noregistrasi'];
        // $logUser->noreff = $pasienDaftar->noregistrasi;
        $logUser->referensi = 'NoRegistrasi Pasien Daftar';
        $logUser->objectloginuserfk =  $dataLogin['userData']['id'];
        $logUser->tanggal = $this->getDateTime()->format('Y-m-d H:i:s');
        $logUser->keterangan = 'Alasan : ' . $request['alasanbatalclosing'] . ' / Batal Closing No Registrasi : ' . $request['noregistrasi'];
        $logUser->save();


        if ($transStatus == true) {
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => 'ea@epic'
            );
        } else {
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => 'ea@epic'
            );
        }
        return $this->respond($result);
    }

    public function getStatusVerifPiutang(Request $request)
    {
        $data = \DB::table('pasiendaftar_t as pd')
            // ->join('pasien_m as p', 'p.id', '=', 'pd.nocmfk')
            // ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            // ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            // ->leftJoin('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            ->join('antrianpasiendiperiksa_t as apd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->join('pelayananpasien_t as pp', 'apd.norec', '=', 'pp.noregistrasifk')
            ->leftjoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
            ->leftjoin('strukpelayananpenjamin_t as spp', 'spp.nostrukfk', '=', 'sp.norec')
            ->select(
                'pd.norec',
                'pd.noregistrasi',
                'pd.objectstatus',
                'pd.tglpulang',
                'pd.nostruklastfk',
                'pd.nosbmlastfk',
                'spp.noverifikasi as noverif'

            )
            ->whereNotNull('pd.tglpulang')
            ->where('pd.noregistrasi', $request['noReg'])
            ->first();
        return $this->respond($data);
    }

    public function daftarPasienPulang(Request $request)
    {
        ini_set('max_execution_time', 500); //6 minuts
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as p', 'p.id', '=', 'pd.nocmfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            // ->leftjoin('logginguser_t as log', 'log.noreff', '=', 'pd.norec')
            // ->leftjoin('loginuser_s as lg', 'lg.id', '=', 'log.objectloginuserfk')
            ->leftJoin('statuspulang_m as sp', 'sp.id', '=', 'pd.objectstatuspulangfk')
            ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftJoin('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            ->leftJoin('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
            // ->join('pelayananpasien_t as pp', 'apd.norec', '=', 'pp.noregistrasifk')
            // ->leftjoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
            // ->leftjoin('strukpelayananpenjamin_t as spp', 'spp.nostrukfk', '=', 'sp.norec')
            ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftjoin('asuransipasien_m as asu', 'pa.objectasuransipasienfk', '=', 'asu.id')
            ->select(
                'pd.norec',
                'pd.tglregistrasi',
                'p.nocm',
                'pd.noregistrasi',
                'pd.objectrekananfk',
                'ru.namaruangan',
                'p.namapasien',
                'kp.kelompokpasien',
                'kp.id as idkelompokpasien',
                'rk.namarekanan',
                'pd.tglpulang',
                'pd.statuspasien',
                'pd.nostruklastfk',
                'pd.nosbmlastfk',
                'sp.statuspulang',
                'pa.nosep',
                'pg.namalengkap as dpjp',
                // 'spp.noverifikasi',
                'dept.id as deptid',
                'asu.objectkelasdijaminfk',
                'pd.tglclosing', DB::raw("case when  dept.id = 16 then 'Sesuai' end as status")
        
            )
            //            ->whereNull('pd.nostruklastfk')
            //            ->whereNull('pd.nosbmlastfk')
            ->where('pd.statusenabled', true)
            // ->where('log.jenislog','Pendaftaran Pasien')
            ->whereNotNull('pd.tglpulang');

        $filter = $request->all();
        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglpulang', '>=', $filter['tglAwal']);
        }

        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $tgl = $filter['tglAkhir']; //." 23:59:59";
            $data = $data->where('pd.tglpulang', '<=', $tgl);
        }

        if (isset($filter['instalasiId']) && $filter['instalasiId'] != "" && $filter['instalasiId'] != "undefined") {
            $data = $data->where('dept.id', '=', $filter['instalasiId']);
            //     if($filter['instalasiId']=="16") {
            //         $data = $data->where('log.jenislog','=','Pasien Pulang')
            //         ->where('log.jenislog','=','Pendaftaran Pasien');
            //     } else {
            //         $data = $data->where('log.jenislog','=','Pendaftaran Pasien');
            //     }
            // } else {
            //     $data = $data->where('log.jenislog','=','Pendaftaran Pasien');

            //     // DB::raw("CASE when log.jenislog = 'Pendaftaran Pasien' then 1 else 0 end as namauser")
            //     // $data = $filter['namauser'] = '-';
        }

        if (isset($filter['ruanganId']) && $filter['ruanganId'] != "" && $filter['ruanganId'] != "undefined") {
            $data = $data->where('ru.id', '=', $filter['ruanganId']);
        }
        if (isset($filter['rekananPasienId']) && $filter['rekananPasienId'] != "" && $filter['rekananPasienId'] != "undefined") {
            $data = $data->where('pd.objectrekananfk', '=', $filter['rekananPasienId']);
        }

        if (isset($filter['namaPasien']) && $filter['namaPasien'] != "" && $filter['namaPasien'] != "undefined") {
            $data = $data->where('p.namapasien', 'ilike', '%' . $filter['namaPasien'] . '%');
        }

        if (isset($filter['noReg']) && $filter['noReg'] != "" && $filter['noReg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', 'ilike', '%' . $filter['noReg'] . '%');
        }

        if (isset($filter['noRm']) && $filter['noRm'] != "" && $filter['noRm'] != "undefined") {
            $data = $data->where('p.nocm', 'ilike', '%' . $filter['noRm'] . '%');
        }
        if (isset($filter['kelompokPasienId']) && $filter['kelompokPasienId'] != "" && $filter['kelompokPasienId'] != "undefined") {
            $data = $data->where('kp.id', '=', $filter['kelompokPasienId']);
        }

        if (isset($filter['status']) && $filter['status'] != "" && $filter['status'] != "undefined") {
            if ($filter['status'] == 'Belum Verifikasi') {
                $data = $data->whereNull('pd.nostruklastfk')->whereNull('pd.nosbmlastfk');
            } elseif ($filter['status'] == 'Verifikasi') {
                $data = $data->whereNotNull('pd.nostruklastfk')->whereNull('pd.nosbmlastfk');
            } elseif ($filter['status'] == 'Lunas') {
                $data = $data->whereNotNull('pd.nostruklastfk')->whereNotNull('pd.nosbmlastfk');;
            }
        }
        if (isset($filter['jmlRows']) && $filter['jmlRows'] != "" && $filter['jmlRows'] != "undefined") {
            $data = $data->take($filter['jmlRows']);
        }

        // $data=$data->groupBy('pd.norec','pd.tglregistrasi', 'p.nocm', 'pd.noregistrasi', 'ru.namaruangan', 'p.namapasien', 'kp.kelompokpasien',
        //     'pd.tglpulang', 'pd.statuspasien','pd.nostruklastfk', 'pd.nosbmlastfk',
        //     // 'spp.noverifikasi',
        //     'dept.id','pd.tglclosing');


        //         if(!empty($filter['tglAwal']) && !empty($filter['tglAkhir']) && empty($filter['noReg']) && empty($filter['noRm']) && empty($filter['status']) && empty($filter['ruanganId']) && empty($filter['namaPasien']) && empty($filter['instalasiId'])){
        //             $data = $data->limit(10)->get();
        // //            $data = $data->get();

        //         }else if (empty($filter['tglAwal']) && empty($filter['tglAkhir']) && empty($filter['noReg']) && empty($filter['noRm']) && empty($filter['status']) && empty($filter['ruanganId']) && empty($filter['namaPasien']) && empty($filter['instalasiId'])) {

        //             $data = $data->limit(10)->get();

        //         }else if(!empty($filter['tglAwal']) && !empty($filter['tglAkhir']) && empty($filter['noReg']) && empty($filter['noRm']) && $filter['status'] == "undefined" && $filter['ruanganId'] == "undefined" && empty($filter['namaPasien']) && $filter['instalasiId'] == "undefined"){

        //             $data = $data->limit(10)->get();

        //         } else {
        //             $data = $data->limit(10)->get();
        // //            $data =$data->get();
        //         }
        // $data = $data->distinct();
        $data = $data->get();

        
        $result = array();
        foreach ($data as $pasienD) {
            $resumemedis = DB::table('antrianpasiendiperiksa_t as apd')
                ->join('resumemedis_t as rm', 'rm.noregistrasifk', '=', 'apd.norec')
                ->select('rm.tglresume')
                ->where('apd.statusenabled', true)
                ->where('apd.noregistrasifk', '=', $pasienD->norec)
                ->get();
            if (count($resumemedis) > 0) {
                foreach ($resumemedis as $rm) {
                    $tglresume = $rm->tglresume;
                }
            } else {
                $tglresume = null;
            }
            //            $pd=PasienDaftar::find($pasienD->norec);
            //            $totalHrsDibayar = StrukPelayanan::where('noregistrasifk',$pasienD->norec)
            //                ->where('statusenabled',true)
            //                ->orderBy('norec','desc')
            //                ->first();
            //            $pd->DepositId = $this->getProdukIdDeposit();
            $status = "-";

            //            if (isset($totalHrsDibayar)) {
            //                if ($pasienD->nostruklastfk != null && $totalHrsDibayar->totalharusdibayar == 0) {
            //                    $status = '-';//"Lunas";
            //                } else {
            if ($pasienD->nostruklastfk == null && $pasienD->nosbmlastfk == null) {
                $status = "Belum Verifikasi";
            } elseif ($pasienD->nostruklastfk != null && $pasienD->nosbmlastfk == null) {
                $status = "Verifikasi";
            } elseif ($pasienD->nostruklastfk != null && $pasienD->nosbmlastfk != null) {
                $status = '-'; //"Lunas";
            }
            //                }
            //            }else{
            //                if ($pasienD->nostruklastfk == null && $pasienD->nosbmlastfk == null) {
            //                    $status = "Belum Verifikasi";
            //                } elseif ($pasienD->nostruklastfk != null && $pasienD->nosbmlastfk == null) {
            //                    $status = "Verifikasi";
            //                } elseif ($pasienD->nostruklastfk != null && $pasienD->nosbmlastfk != null) {
            //                    $status = '-';//"Lunas";
            //                }
            //            }
            // return($resumemedis);
            // die();
            if($pasienD->deptid==16 && $pasienD->idkelompokpasien == 2){
                $cekKelasTertinggi = DB::select(DB::raw("
                select * from ( select tglmasuk,tglkeluar,reportdisplay,	
                    CASE antrianpasiendiperiksa_t.objectkelasfk WHEN 6 THEN  0
                    WHEN 1 THEN  1  WHEN 2 THEN 2 WHEN 3 THEN 3  WHEN 4 THEN  4
                    WHEN 7 THEN  0 WHEN 5 THEN  0
                    ELSE 1 END AS derajatkelas ,israwattitipan
                    from 
                        antrianpasiendiperiksa_t
                    INNER JOIN kelas_m ON antrianpasiendiperiksa_t.objectkelasfk = kelas_m.id
                    where noregistrasifk ='$pasienD->norec'  ) as x where  x.derajatkelas>$pasienD->objectkelasdijaminfk order by x.derajatkelas asc 
                    ")
                );
                $statusnaikkelas='0';
                foreach($cekKelasTertinggi as $item){
                    if($item->israwattitipan==false){
                        $statusnaikkelas = '1';
                        $pasienD->status = 'Naik Kelas';
                    }
                }

            }
            
            
             $carititipan = DB::table('antrianpasiendiperiksa_t as apd')
                
                ->select('apd.israwattitipan')
                ->where('apd.statusenabled', true)
                ->where('apd.noregistrasifk', '=', $pasienD->norec)
                ->get();
            foreach ($carititipan as $itil) {
               if ($itil->israwattitipan == 1 ){
                   $pasienD->status = 'Titipan';
               };
            }
            $result[] = array(
                'tanggalMasuk'  => $pasienD->tglregistrasi,
                'noCm'  => $pasienD->nocm,
                'noRegistrasi'  => $pasienD->noregistrasi,
                'namaRuangan'  => $pasienD->namaruangan,
                'namaPasien'  => $pasienD->namapasien,
                'nosep'  => $pasienD->nosep,
                'jenisAsuransi'  => $pasienD->kelompokpasien,
                'namarekanan'  => $pasienD->namarekanan,
                'statuspulang'  => $pasienD->statuspulang,
                'tglresume'  => $tglresume,
                // 'namauser' =>$pasienD->namauser,
                'tanggalPulang' => $pasienD->tglpulang,
                //                'isVerified' => $pd->IsVerified,
                'status'    =>  $status,
                // 'noverif'    =>  $pasienD->noverifikasi,
                'deptid' => $pasienD->deptid,
                'tglclosing' => $pasienD->tglclosing,
                'dpjp' => $pasienD->dpjp,
                'statuskelas' => $pasienD->status,
                //                'isPaid' => $pd->isBayar,
                //                'isLunas' => $pd->isBayar,
            );
        }
        return $this->respond($result);
    }
    public function getKamarBed(Request $request)
    {
        $data = \DB::table('antrianpasiendiperiksa_t as apd')
            // ->join('pasiendaftar_t as pd', 'pd.objectruanganlastfk', '=', 'apd.objectruanganfk')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->leftjoin('kamar_m as km', 'km.id', '=', 'apd.objectkamarfk')
            ->leftjoin('tempattidur_m as tt', 'tt.id', '=', 'apd.nobed')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftjoin('kelas_m as kls', 'kls.id', '=', 'apd.objectkelasfk')
            ->select(
                'pd.norec as norec_pd',
                'ru.namaruangan',
                'apd.objectkamarfk',
                'km.namakamar',
                'apd.nobed',
                'tt.namaexternal',
                'apd.tglkeluar',
                'kls.id as id_kelas',
                'namakelas as kelasruangan',
                'ru.id as id_ruangan',
                'apd.norec as norec_apd'
            )
            ->whereNotNull('pd.tglpulang')
            ->where('pd.noregistrasi', $request['noReg'])
            ->where('ru.objectdepartemenfk', 16)
            ->orderBy('apd.tglkeluar', 'DESC')
            ->take(1)
            ->get();

        return $this->respond($data);
    }
    public function getBedSama(Request $request)
    {
        $data = \DB::table('tempattidur_m as tt')
            ->select('tt.objectstatusbedfk', 'tt.namaexternal', 'tt.kodeexternal', 'tt.id as nobed')
            ->where('tt.id', $request['bed'])
            ->get();

        return $this->respond($data);
    }
    public function getRekapBilling(Request $request)
    {
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->join('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->join('kelompokprodukbpjs_m as kpb', 'kpb.id', '=', 'pr.objectkelompokprodukbpjsfk')
            ->leftjoin('pelayananpasienpetugas_t as ppp', 'ppp.pelayananpasien', '=', 'pp.norec')
            ->leftjoin('pegawai_m as pgppp', 'pgppp.id', '=', 'ppp.objectpegawaifk')
            ->select(
                'pgppp.namalengkap as namadokterppp',
                'kpb.kelompokprodukbpjs',
                'kpb.id as id_kpb',
                'pd.noregistrasi',
                DB::raw('sum(case when pp.isobat is not null then pp.hargajual * pp.jumlah + pp.jasa - pp.hargadiscount else 0 end)+
                    sum(case when pp.isobat is null and pp.jasa is not null then pp.hargajual * pp.jumlah + pp.jasa - pp.hargadiscount 
                    when pp.isobat is null and pp.jasa is null then pp.hargajual * pp.jumlah - pp.hargadiscount else 0 end)as total')
            )
            ->where('pd.noregistrasi', $request['noReg'])
            ->groupBy('pgppp.namalengkap', 'kpb.kelompokprodukbpjs', 'kpb.id', 'pd.noregistrasi')
            ->orderBy('kpb.kelompokprodukbpjs', 'ASC')
            ->get();

        $datafix = [];
        foreach ($data as $item)
            $datafix[] = array(
                'namadokterppp' => $item->namadokterppp,
                'kelompokprodukbpjs' => $item->kelompokprodukbpjs,
                'id_kpb' => $item->id_kpb,
                'noregistrasi' => $item->noregistrasi,
                'total' => (float)$item->total
            );

        return $this->respond($datafix);
    }
    // public function getBilling (Request $request){
    //     if($request['setParam']==1){
    //         $data = \DB::table('pasiendaftar_t as pd')
    //             ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
    //             ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
    //             ->leftjoin('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
    //             ->leftjoin('kelompokprodukbpjs_m as kpb', 'kpb.id', '=', 'pr.objectkelompokprodukbpjsfk')
    //             ->leftjoin('pelayananpasienpetugas as ppp', 'ppp.pelayananpasien', '=', 'pp.norec')
    //             ->leftjoin('pegawai_m as pgppp', 'pgppp.id', '=', 'ppp.objectpegawaifk')
    //             ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
    //             ->select('pgppp.namalengkap as namadokterppp', 'kpb.kelompokprodukbpjs', 'pr.namaproduk', 'pp.jumlah', 'pp.hargajual', 'pp.jasa', 'pp.hargadiscount', 'pp.tglpelayanan', 'ru.namaruangan',
    //                     DB::raw('sum(case when pp.isobat is not null then pp.hargajual * pp.jumlah + pp.jasa - pp.hargadiscount else 0 end)+
    //                     sum(case when pp.isobat is null and pp.jasa is not null then pp.hargajual * pp.jumlah + pp.jasa - pp.hargadiscount 
    //                     when pp.isobat is null and pp.jasa is null then pp.hargajual * pp.jumlah - pp.hargadiscount else 0 end)as total'))
    //             ->where('pd.noregistrasi',$request['noreg'])
    //             ->where('kpb.id',1)
    //             ->orderBy('kpb.kelompokprodukbpjs', 'ASC')
    //             ->get();
    //     }
    //     else if($request['setParam']==2){
    //         $data = \DB::table('pasiendaftar_t as pd')
    //             ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
    //             ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
    //             ->leftjoin('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
    //             ->leftjoin('kelompokprodukbpjs_m as kpb', 'kpb.id', '=', 'pr.objectkelompokprodukbpjsfk')
    //             ->leftjoin('pelayananpasienpetugas as ppp', 'ppp.pelayananpasien', '=', 'pp.norec')
    //             ->leftjoin('pegawai_m as pgppp', 'pgppp.id', '=', 'ppp.objectpegawaifk')
    //             ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
    //             ->select('pgppp.namalengkap as namadokterppp', 'kpb.kelompokprodukbpjs', 'pr.namaproduk', 'pp.jumlah', 'pp.hargajual', 'pp.jasa', 'pp.hargadiscount', 'pp.tglpelayanan', 'ru.namaruangan',
    //                     DB::raw('sum(case when pp.isobat is not null then pp.hargajual * pp.jumlah + pp.jasa - pp.hargadiscount else 0 end)+
    //                     sum(case when pp.isobat is null and pp.jasa is not null then pp.hargajual * pp.jumlah + pp.jasa - pp.hargadiscount 
    //                     when pp.isobat is null and pp.jasa is null then pp.hargajual * pp.jumlah - pp.hargadiscount else 0 end)as total'))
    //             ->where('pd.noregistrasi',$request['noreg'])
    //             ->where('kpb.id',2)
    //             ->orderBy('kpb.kelompokprodukbpjs', 'ASC')
    //             ->get();
    //     }
    //     else if($request['setParam']==3){
    //         $data = \DB::table('pasiendaftar_t as pd')
    //             ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
    //             ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
    //             ->leftjoin('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
    //             ->leftjoin('kelompokprodukbpjs_m as kpb', 'kpb.id', '=', 'pr.objectkelompokprodukbpjsfk')
    //             ->leftjoin('pelayananpasienpetugas as ppp', 'ppp.pelayananpasien', '=', 'pp.norec')
    //             ->leftjoin('pegawai_m as pgppp', 'pgppp.id', '=', 'ppp.objectpegawaifk')
    //             ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
    //             ->select('pgppp.namalengkap as namadokterppp', 'kpb.kelompokprodukbpjs', 'pr.namaproduk', 'pp.jumlah', 'pp.hargajual', 'pp.jasa', 'pp.hargadiscount', 'pp.tglpelayanan', 'ru.namaruangan',
    //                     DB::raw('sum(case when pp.isobat is not null then pp.hargajual * pp.jumlah + pp.jasa - pp.hargadiscount else 0 end)+
    //                     sum(case when pp.isobat is null and pp.jasa is not null then pp.hargajual * pp.jumlah + pp.jasa - pp.hargadiscount 
    //                     when pp.isobat is null and pp.jasa is null then pp.hargajual * pp.jumlah - pp.hargadiscount else 0 end)as total'))
    //             ->where('pd.noregistrasi',$request['noreg'])
    //             ->where('kpb.id',3)
    //             ->orderBy('kpb.kelompokprodukbpjs', 'ASC')
    //             ->get();
    //     }
    //     else if($request['setParam']==4){
    //         $data = \DB::table('pasiendaftar_t as pd')
    //             ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
    //             ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
    //             ->leftjoin('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
    //             ->leftjoin('kelompokprodukbpjs_m as kpb', 'kpb.id', '=', 'pr.objectkelompokprodukbpjsfk')
    //             ->leftjoin('pelayananpasienpetugas as ppp', 'ppp.pelayananpasien', '=', 'pp.norec')
    //             ->leftjoin('pegawai_m as pgppp', 'pgppp.id', '=', 'ppp.objectpegawaifk')
    //             ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
    //             ->select('pgppp.namalengkap as namadokterppp', 'kpb.kelompokprodukbpjs', 'pr.namaproduk', 'pp.jumlah', 'pp.hargajual', 'pp.jasa', 'pp.hargadiscount', 'pp.tglpelayanan', 'ru.namaruangan',
    //                     DB::raw('sum(case when pp.isobat is not null then pp.hargajual * pp.jumlah + pp.jasa - pp.hargadiscount else 0 end)+
    //                     sum(case when pp.isobat is null and pp.jasa is not null then pp.hargajual * pp.jumlah + pp.jasa - pp.hargadiscount 
    //                     when pp.isobat is null and pp.jasa is null then pp.hargajual * pp.jumlah - pp.hargadiscount else 0 end)as total'))
    //             ->where('pd.noregistrasi',$request['noreg'])
    //             ->where('kpb.id',4)
    //             ->orderBy('kpb.kelompokprodukbpjs', 'ASC')
    //             ->get();
    //     }
    //     else if($request['setParam']==5){
    //         $data = \DB::table('pasiendaftar_t as pd')
    //             ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
    //             ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
    //             ->leftjoin('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
    //             ->leftjoin('kelompokprodukbpjs_m as kpb', 'kpb.id', '=', 'pr.objectkelompokprodukbpjsfk')
    //             ->leftjoin('pelayananpasienpetugas as ppp', 'ppp.pelayananpasien', '=', 'pp.norec')
    //             ->leftjoin('pegawai_m as pgppp', 'pgppp.id', '=', 'ppp.objectpegawaifk')
    //             ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
    //             ->select('pgppp.namalengkap as namadokterppp', 'kpb.kelompokprodukbpjs', 'pr.namaproduk', 'pp.jumlah', 'pp.hargajual', 'pp.jasa', 'pp.hargadiscount', 'pp.tglpelayanan', 'ru.namaruangan',
    //                     DB::raw('sum(case when pp.isobat is not null then pp.hargajual * pp.jumlah + pp.jasa - pp.hargadiscount else 0 end)+
    //                     sum(case when pp.isobat is null and pp.jasa is not null then pp.hargajual * pp.jumlah + pp.jasa - pp.hargadiscount 
    //                     when pp.isobat is null and pp.jasa is null then pp.hargajual * pp.jumlah - pp.hargadiscount else 0 end)as total'))
    //             ->where('pd.noregistrasi',$request['noreg'])
    //             ->where('kpb.id',5)
    //             ->orderBy('kpb.kelompokprodukbpjs', 'ASC')
    //             ->get();
    //     }
    //     else if($request['setParam']==6){
    //         $data = \DB::table('pasiendaftar_t as pd')
    //             ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
    //             ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
    //             ->leftjoin('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
    //             ->leftjoin('kelompokprodukbpjs_m as kpb', 'kpb.id', '=', 'pr.objectkelompokprodukbpjsfk')
    //             ->leftjoin('pelayananpasienpetugas as ppp', 'ppp.pelayananpasien', '=', 'pp.norec')
    //             ->leftjoin('pegawai_m as pgppp', 'pgppp.id', '=', 'ppp.objectpegawaifk')
    //             ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
    //             ->select('pgppp.namalengkap as namadokterppp', 'kpb.kelompokprodukbpjs', 'pr.namaproduk', 'pp.jumlah', 'pp.hargajual', 'pp.jasa', 'pp.hargadiscount', 'pp.tglpelayanan', 'ru.namaruangan',
    //                     DB::raw('sum(case when pp.isobat is not null then pp.hargajual * pp.jumlah + pp.jasa - pp.hargadiscount else 0 end)+
    //                     sum(case when pp.isobat is null and pp.jasa is not null then pp.hargajual * pp.jumlah + pp.jasa - pp.hargadiscount 
    //                     when pp.isobat is null and pp.jasa is null then pp.hargajual * pp.jumlah - pp.hargadiscount else 0 end)as total'))
    //             ->where('pd.noregistrasi',$request['noreg'])
    //             ->where('kpb.id',6)
    //             ->orderBy('kpb.kelompokprodukbpjs', 'ASC')
    //             ->get();
    //     }
    //     else if($request['setParam']==7){
    //         $data = \DB::table('pasiendaftar_t as pd')
    //             ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
    //             ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
    //             ->leftjoin('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
    //             ->leftjoin('kelompokprodukbpjs_m as kpb', 'kpb.id', '=', 'pr.objectkelompokprodukbpjsfk')
    //             ->leftjoin('pelayananpasienpetugas as ppp', 'ppp.pelayananpasien', '=', 'pp.norec')
    //             ->leftjoin('pegawai_m as pgppp', 'pgppp.id', '=', 'ppp.objectpegawaifk')
    //             ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
    //             ->select('pgppp.namalengkap as namadokterppp', 'kpb.kelompokprodukbpjs', 'pr.namaproduk', 'pp.jumlah', 'pp.hargajual', 'pp.jasa', 'pp.hargadiscount', 'pp.tglpelayanan', 'ru.namaruangan',
    //                     DB::raw('sum(case when pp.isobat is not null then pp.hargajual * pp.jumlah + pp.jasa - pp.hargadiscount else 0 end)+
    //                     sum(case when pp.isobat is null and pp.jasa is not null then pp.hargajual * pp.jumlah + pp.jasa - pp.hargadiscount 
    //                     when pp.isobat is null and pp.jasa is null then pp.hargajual * pp.jumlah - pp.hargadiscount else 0 end)as total'))
    //             ->where('pd.noregistrasi',$request['noreg'])
    //             ->where('kpb.id',7)
    //             ->orderBy('kpb.kelompokprodukbpjs', 'ASC')
    //             ->get();
    //     }
    //     else if($request['setParam']==8){
    //         $data = \DB::table('pasiendaftar_t as pd')
    //             ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
    //             ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
    //             ->leftjoin('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
    //             ->leftjoin('kelompokprodukbpjs_m as kpb', 'kpb.id', '=', 'pr.objectkelompokprodukbpjsfk')
    //             ->leftjoin('pelayananpasienpetugas as ppp', 'ppp.pelayananpasien', '=', 'pp.norec')
    //             ->leftjoin('pegawai_m as pgppp', 'pgppp.id', '=', 'ppp.objectpegawaifk')
    //             ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
    //             ->select('pgppp.namalengkap as namadokterppp', 'kpb.kelompokprodukbpjs', 'pr.namaproduk', 'pp.jumlah', 'pp.hargajual', 'pp.jasa', 'pp.hargadiscount', 'pp.tglpelayanan', 'ru.namaruangan',
    //                     DB::raw('sum(case when pp.isobat is not null then pp.hargajual * pp.jumlah + pp.jasa - pp.hargadiscount else 0 end)+
    //                     sum(case when pp.isobat is null and pp.jasa is not null then pp.hargajual * pp.jumlah + pp.jasa - pp.hargadiscount 
    //                     when pp.isobat is null and pp.jasa is null then pp.hargajual * pp.jumlah - pp.hargadiscount else 0 end)as total'))
    //             ->where('pd.noregistrasi',$request['noreg'])
    //             ->where('kpb.id',8)
    //             ->orderBy('kpb.kelompokprodukbpjs', 'ASC')
    //             ->get();
    //     }
    //     else if($request['setParam']==9){
    //         $data = \DB::table('pasiendaftar_t as pd')
    //             ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
    //             ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
    //             ->leftjoin('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
    //             ->leftjoin('kelompokprodukbpjs_m as kpb', 'kpb.id', '=', 'pr.objectkelompokprodukbpjsfk')
    //             ->leftjoin('pelayananpasienpetugas as ppp', 'ppp.pelayananpasien', '=', 'pp.norec')
    //             ->leftjoin('pegawai_m as pgppp', 'pgppp.id', '=', 'ppp.objectpegawaifk')
    //             ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
    //             ->select('pgppp.namalengkap as namadokterppp', 'kpb.kelompokprodukbpjs', 'pr.namaproduk', 'pp.jumlah', 'pp.hargajual', 'pp.jasa', 'pp.hargadiscount', 'pp.tglpelayanan', 'ru.namaruangan',
    //                     DB::raw('sum(case when pp.isobat is not null then pp.hargajual * pp.jumlah + pp.jasa - pp.hargadiscount else 0 end)+
    //                     sum(case when pp.isobat is null and pp.jasa is not null then pp.hargajual * pp.jumlah + pp.jasa - pp.hargadiscount 
    //                     when pp.isobat is null and pp.jasa is null then pp.hargajual * pp.jumlah - pp.hargadiscount else 0 end)as total'))
    //             ->where('pd.noregistrasi',$request['noreg'])
    //             ->where('kpb.id',9)
    //             ->orderBy('kpb.kelompokprodukbpjs', 'ASC')
    //             ->get();
    //     }
    //     else if($request['setParam']==10){
    //         $data = \DB::table('pasiendaftar_t as pd')
    //             ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
    //             ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
    //             ->leftjoin('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
    //             ->leftjoin('kelompokprodukbpjs_m as kpb', 'kpb.id', '=', 'pr.objectkelompokprodukbpjsfk')
    //             ->leftjoin('pelayananpasienpetugas as ppp', 'ppp.pelayananpasien', '=', 'pp.norec')
    //             ->leftjoin('pegawai_m as pgppp', 'pgppp.id', '=', 'ppp.objectpegawaifk')
    //             ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
    //             ->select('pgppp.namalengkap as namadokterppp', 'kpb.kelompokprodukbpjs', 'pr.namaproduk', 'pp.jumlah', 'pp.hargajual', 'pp.jasa', 'pp.hargadiscount', 'pp.tglpelayanan', 'ru.namaruangan',
    //                     DB::raw('sum(case when pp.isobat is not null then pp.hargajual * pp.jumlah + pp.jasa - pp.hargadiscount else 0 end)+
    //                     sum(case when pp.isobat is null and pp.jasa is not null then pp.hargajual * pp.jumlah + pp.jasa - pp.hargadiscount 
    //                     when pp.isobat is null and pp.jasa is null then pp.hargajual * pp.jumlah - pp.hargadiscount else 0 end)as total'))
    //             ->where('pd.noregistrasi',$request['noreg'])
    //             ->where('kpb.id',10)
    //             ->orderBy('kpb.kelompokprodukbpjs', 'ASC')
    //             ->get();
    //     }
    //     else if($request['setParam']==11){
    //         $data = \DB::table('pasiendaftar_t as pd')
    //             ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
    //             ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
    //             ->leftjoin('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
    //             ->leftjoin('kelompokprodukbpjs_m as kpb', 'kpb.id', '=', 'pr.objectkelompokprodukbpjsfk')
    //             ->leftjoin('pelayananpasienpetugas as ppp', 'ppp.pelayananpasien', '=', 'pp.norec')
    //             ->leftjoin('pegawai_m as pgppp', 'pgppp.id', '=', 'ppp.objectpegawaifk')
    //             ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
    //             ->select('pgppp.namalengkap as namadokterppp', 'kpb.kelompokprodukbpjs', 'pr.namaproduk', 'pp.jumlah', 'pp.hargajual', 'pp.jasa', 'pp.hargadiscount', 'pp.tglpelayanan', 'ru.namaruangan',
    //                     DB::raw('sum(case when pp.isobat is not null then pp.hargajual * pp.jumlah + pp.jasa - pp.hargadiscount else 0 end)+
    //                     sum(case when pp.isobat is null and pp.jasa is not null then pp.hargajual * pp.jumlah + pp.jasa - pp.hargadiscount 
    //                     when pp.isobat is null and pp.jasa is null then pp.hargajual * pp.jumlah - pp.hargadiscount else 0 end)as total'))
    //             ->where('pd.noregistrasi',$request['noreg'])
    //             ->where('kpb.id',11)
    //             ->orderBy('kpb.kelompokprodukbpjs', 'ASC')
    //             ->get();
    //     }
    //     else if($request['setParam']==12){
    //         $data = \DB::table('pasiendaftar_t as pd')
    //             ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
    //             ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
    //             ->leftjoin('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
    //             ->leftjoin('kelompokprodukbpjs_m as kpb', 'kpb.id', '=', 'pr.objectkelompokprodukbpjsfk')
    //             ->leftjoin('pelayananpasienpetugas as ppp', 'ppp.pelayananpasien', '=', 'pp.norec')
    //             ->leftjoin('pegawai_m as pgppp', 'pgppp.id', '=', 'ppp.objectpegawaifk')
    //             ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
    //             ->select('pgppp.namalengkap as namadokterppp', 'kpb.kelompokprodukbpjs', 'pr.namaproduk', 'pp.jumlah', 'pp.hargajual', 'pp.jasa', 'pp.hargadiscount', 'pp.tglpelayanan', 'ru.namaruangan',
    //                     DB::raw('sum(case when pp.isobat is not null then pp.hargajual * pp.jumlah + pp.jasa - pp.hargadiscount else 0 end)+
    //                     sum(case when pp.isobat is null and pp.jasa is not null then pp.hargajual * pp.jumlah + pp.jasa - pp.hargadiscount 
    //                     when pp.isobat is null and pp.jasa is null then pp.hargajual * pp.jumlah - pp.hargadiscount else 0 end)as total'))
    //             ->where('pd.noregistrasi',$request['noreg'])
    //             ->where('kpb.id',12)
    //             ->orderBy('kpb.kelompokprodukbpjs', 'ASC')
    //             ->get();
    //     }
    //     else if($request['setParam']==13){
    //         $data = \DB::table('pasiendaftar_t as pd')
    //             ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
    //             ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
    //             ->leftjoin('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
    //             ->leftjoin('kelompokprodukbpjs_m as kpb', 'kpb.id', '=', 'pr.objectkelompokprodukbpjsfk')
    //             ->leftjoin('pelayananpasienpetugas as ppp', 'ppp.pelayananpasien', '=', 'pp.norec')
    //             ->leftjoin('pegawai_m as pgppp', 'pgppp.id', '=', 'ppp.objectpegawaifk')
    //             ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
    //             ->select('pgppp.namalengkap as namadokterppp', 'kpb.kelompokprodukbpjs', 'pr.namaproduk', 'pp.jumlah', 'pp.hargajual', 'pp.jasa', 'pp.hargadiscount', 'pp.tglpelayanan', 'ru.namaruangan',
    //                     DB::raw('sum(case when pp.isobat is not null then pp.hargajual * pp.jumlah + pp.jasa - pp.hargadiscount else 0 end)+
    //                     sum(case when pp.isobat is null and pp.jasa is not null then pp.hargajual * pp.jumlah + pp.jasa - pp.hargadiscount 
    //                     when pp.isobat is null and pp.jasa is null then pp.hargajual * pp.jumlah - pp.hargadiscount else 0 end)as total'))
    //             ->where('pd.noregistrasi',$request['noreg'])
    //             ->where('kpb.id',13)
    //             ->orderBy('kpb.kelompokprodukbpjs', 'ASC')
    //             ->get();
    //     }
    //     else if($request['setParam']==14){
    //         $data = \DB::table('pasiendaftar_t as pd')
    //             ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
    //             ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
    //             ->leftjoin('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
    //             ->leftjoin('kelompokprodukbpjs_m as kpb', 'kpb.id', '=', 'pr.objectkelompokprodukbpjsfk')
    //             ->leftjoin('pelayananpasienpetugas as ppp', 'ppp.pelayananpasien', '=', 'pp.norec')
    //             ->leftjoin('pegawai_m as pgppp', 'pgppp.id', '=', 'ppp.objectpegawaifk')
    //             ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
    //             ->select('pgppp.namalengkap as namadokterppp', 'kpb.kelompokprodukbpjs', 'pr.namaproduk', 'pp.jumlah', 'pp.hargajual', 'pp.jasa', 'pp.hargadiscount', 'pp.tglpelayanan', 'ru.namaruangan',
    //                     DB::raw('sum(case when pp.isobat is not null then pp.hargajual * pp.jumlah + pp.jasa - pp.hargadiscount else 0 end)+
    //                     sum(case when pp.isobat is null and pp.jasa is not null then pp.hargajual * pp.jumlah + pp.jasa - pp.hargadiscount 
    //                     when pp.isobat is null and pp.jasa is null then pp.hargajual * pp.jumlah - pp.hargadiscount else 0 end)as total'))
    //             ->where('pd.noregistrasi',$request['noreg'])
    //             ->where('kpb.id',14)
    //             ->orderBy('kpb.kelompokprodukbpjs', 'ASC')
    //             ->get();
    //     }
    //     else if($request['setParam']==15){
    //         $data = \DB::table('pasiendaftar_t as pd')
    //             ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
    //             ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
    //             ->leftjoin('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
    //             ->leftjoin('kelompokprodukbpjs_m as kpb', 'kpb.id', '=', 'pr.objectkelompokprodukbpjsfk')
    //             ->leftjoin('pelayananpasienpetugas as ppp', 'ppp.pelayananpasien', '=', 'pp.norec')
    //             ->leftjoin('pegawai_m as pgppp', 'pgppp.id', '=', 'ppp.objectpegawaifk')
    //             ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
    //             ->select('pgppp.namalengkap as namadokterppp', 'kpb.kelompokprodukbpjs', 'pr.namaproduk', 'pp.jumlah', 'pp.hargajual', 'pp.jasa', 'pp.hargadiscount', 'pp.tglpelayanan', 'ru.namaruangan',
    //                     DB::raw('sum(case when pp.isobat is not null then pp.hargajual * pp.jumlah + pp.jasa - pp.hargadiscount else 0 end)+
    //                     sum(case when pp.isobat is null and pp.jasa is not null then pp.hargajual * pp.jumlah + pp.jasa - pp.hargadiscount 
    //                     when pp.isobat is null and pp.jasa is null then pp.hargajual * pp.jumlah - pp.hargadiscount else 0 end)as total'))
    //             ->where('pd.noregistrasi',$request['noreg'])
    //             ->where('kpb.id',15)
    //             ->orderBy('kpb.kelompokprodukbpjs', 'ASC')
    //             ->get();
    //     }
    //     else if($request['setParam']==16){
    //         $data = \DB::table('pasiendaftar_t as pd')
    //             ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
    //             ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
    //             ->leftjoin('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
    //             ->leftjoin('kelompokprodukbpjs_m as kpb', 'kpb.id', '=', 'pr.objectkelompokprodukbpjsfk')
    //             ->leftjoin('pelayananpasienpetugas as ppp', 'ppp.pelayananpasien', '=', 'pp.norec')
    //             ->leftjoin('pegawai_m as pgppp', 'pgppp.id', '=', 'ppp.objectpegawaifk')
    //             ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
    //             ->select('pgppp.namalengkap as namadokterppp', 'kpb.kelompokprodukbpjs', 'pr.namaproduk', 'pp.jumlah', 'pp.hargajual', 'pp.jasa', 'pp.hargadiscount', 'pp.tglpelayanan', 'ru.namaruangan',
    //                     DB::raw('sum(case when pp.isobat is not null then pp.hargajual * pp.jumlah + pp.jasa - pp.hargadiscount else 0 end)+
    //                     sum(case when pp.isobat is null and pp.jasa is not null then pp.hargajual * pp.jumlah + pp.jasa - pp.hargadiscount 
    //                     when pp.isobat is null and pp.jasa is null then pp.hargajual * pp.jumlah - pp.hargadiscount else 0 end)as total'))
    //             ->where('pd.noregistrasi',$request['noreg'])
    //             ->where('kpb.id',16)
    //             ->orderBy('kpb.kelompokprodukbpjs', 'ASC')
    //             ->get();
    //     }
    //     else if($request['setParam']==17){
    //         $data = \DB::table('pasiendaftar_t as pd')
    //             ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
    //             ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
    //             ->leftjoin('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
    //             ->leftjoin('kelompokprodukbpjs_m as kpb', 'kpb.id', '=', 'pr.objectkelompokprodukbpjsfk')
    //             ->leftjoin('pelayananpasienpetugas as ppp', 'ppp.pelayananpasien', '=', 'pp.norec')
    //             ->leftjoin('pegawai_m as pgppp', 'pgppp.id', '=', 'ppp.objectpegawaifk')
    //             ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
    //             ->select('pgppp.namalengkap as namadokterppp', 'kpb.kelompokprodukbpjs', 'pr.namaproduk', 'pp.jumlah', 'pp.hargajual', 'pp.jasa', 'pp.hargadiscount', 'pp.tglpelayanan', 'ru.namaruangan',
    //                     DB::raw('sum(case when pp.isobat is not null then pp.hargajual * pp.jumlah + pp.jasa - pp.hargadiscount else 0 end)+
    //                     sum(case when pp.isobat is null and pp.jasa is not null then pp.hargajual * pp.jumlah + pp.jasa - pp.hargadiscount 
    //                     when pp.isobat is null and pp.jasa is null then pp.hargajual * pp.jumlah - pp.hargadiscount else 0 end)as total'))
    //             ->where('pd.noregistrasi',$request['noreg'])
    //             ->where('kpb.id',17)
    //             ->orderBy('kpb.kelompokprodukbpjs', 'ASC')
    //             ->get();
    //     }
    //     else if($request['setParam']==18){
    //         $data = \DB::table('pasiendaftar_t as pd')
    //             ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
    //             ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
    //             ->leftjoin('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
    //             ->leftjoin('kelompokprodukbpjs_m as kpb', 'kpb.id', '=', 'pr.objectkelompokprodukbpjsfk')
    //             ->leftjoin('pelayananpasienpetugas as ppp', 'ppp.pelayananpasien', '=', 'pp.norec')
    //             ->leftjoin('pegawai_m as pgppp', 'pgppp.id', '=', 'ppp.objectpegawaifk')
    //             ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
    //             ->select('pgppp.namalengkap as namadokterppp', 'kpb.kelompokprodukbpjs', 'pr.namaproduk', 'pp.jumlah', 'pp.hargajual', 'pp.jasa', 'pp.hargadiscount', 'pp.tglpelayanan', 'ru.namaruangan',
    //                     DB::raw('sum(case when pp.isobat is not null then pp.hargajual * pp.jumlah + pp.jasa - pp.hargadiscount else 0 end)+
    //                     sum(case when pp.isobat is null and pp.jasa is not null then pp.hargajual * pp.jumlah + pp.jasa - pp.hargadiscount 
    //                     when pp.isobat is null and pp.jasa is null then pp.hargajual * pp.jumlah - pp.hargadiscount else 0 end)as total'))
    //             ->where('pd.noregistrasi',$request['noreg'])
    //             ->where('kpb.id',18)
    //             ->orderBy('kpb.kelompokprodukbpjs', 'ASC')
    //             ->get();
    //     }
    //     $result = array(
    //         'data' => $data,
    //         'message' => 'ANJAY',
    //     );
    //     return $this->respond($result);

    // }
    public function getBilling(Request $request)
    {
        $data = \DB::table('pasiendaftar_t as pd')
            ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->leftjoin('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->leftjoin('kelompokprodukbpjs_m as kpb', 'kpb.id', '=', 'pr.objectkelompokprodukbpjsfk')
            ->leftjoin('pelayananpasienpetugas_t as ppp', 'ppp.pelayananpasien', '=', 'pp.norec')
            ->leftjoin('pegawai_m as pgppp', 'pgppp.id', '=', 'ppp.objectpegawaifk')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->select(
                'pgppp.namalengkap as namadokterppp',
                'kpb.kelompokprodukbpjs',
                'pr.namaproduk',
                'pp.jumlah',
                'pp.hargajual',
                'pp.jasa',
                'pp.hargadiscount',
                'pp.tglpelayanan',
                'ru.namaruangan',
                'kpb.id',
                DB::raw('sum(case when pp.isobat is not null then pp.hargajual * pp.jumlah + pp.jasa - pp.hargadiscount else 0 end)+
                        sum(case when pp.isobat is null and pp.jasa is not null then pp.hargajual * pp.jumlah + pp.jasa - pp.hargadiscount 
                        when pp.isobat is null and pp.jasa is null then pp.hargajual * pp.jumlah - pp.hargadiscount else 0 end)as total')
            );
        // ->where('pd.noregistrasi',$request['noreg'])
        // ->where('kpb.id',1)
        // ->groupBy('pgppp.namalengkap','kpb.kelompokprodukbpjs','pp.jumlah','pp.hargajual','pp.hargadiscount','ru.namaruangan','pp.jasa','pr.namaproduk','pp.tglpelayanan')
        // ->orderBy('kpb.kelompokprodukbpjs', 'ASC')
        // ->get();
        if (isset($request['id_kpb']) && $request['id_kpb'] != "" && $request['id_kpb'] != "undefined") {
            $data = $data->where('kpb.id', '=', $request['id_kpb']);
        }
        if (isset($request['noreg']) && $request['noreg'] != "" && $request['noreg'] != "undefined") {
            $data = $data->where('pd.noregistrasi', '=', $request['noreg']);
        }
        $data = $data->groupBy('pgppp.namalengkap', 'kpb.kelompokprodukbpjs', 'pp.jumlah', 'pp.hargajual', 'pp.hargadiscount', 'ru.namaruangan', 'pp.jasa', 'pr.namaproduk', 'pp.tglpelayanan', 'kpb.id');
        $data = $data->orderBy('kpb.kelompokprodukbpjs', 'ASC');
        $data = $data->get();

        //     $datafix = [];
        //     foreach ($data as $item)
        //     $datafix [] = array(
        //     'namadokterppp' => $item->namadokterppp,
        //     'kelompokprodukbpjs' => $item->kelompokprodukbpjs,
        //     'id' => $item->id,
        //     'namaproduk' => $item->namaproduk,
        //     'jumlah' => $item->jumlah,
        //     'hargajual' => $item->hargajual,
        //     'jasa' => $item->jasa,
        //     'hargadiscount' => $item->hargadiscount,
        //     'tglpelayanan' => $item->tglpelayanan,
        //     'namaruangan' => $item->namaruangan,
        //     'total' => (float)$item->total
        // );

        $result = array(
            'data' => $data,
            'message' => 'ANJAY',
        );
        return $this->respond($result);
    }
    public function closePemeriksaanPD(Request $request)
    {
        DB::beginTransaction();
        $transStatus = 'true';
        try {
            $status = true;
            $msg = '';
            $tglClose = date('Y-m-d H:i:s');
            if ($request['close'] == false) {
                $status = null;
                $tglClose = null;
                $msg = 'Batal';
            }
            $data = PasienDaftar::where('noregistrasi', $request['noregistrasi'])
                ->update([
                    'isclosing' => $status,
                    'tglclosing' => $tglClose
                ]);
            $transMessage = $msg . " Closing Pemeriksaan Berhasil";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Closing Pemeriksaan Gagal";
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

    public function closePemeriksaanFakturPD(Request $request)
    {
        DB::beginTransaction();
        $transStatus = 'true';
        try {
            $status = true;
            $msg = '';
            $tglTutupFaktur = date('Y-m-d H:i:s');
            if ($request['close'] == false) {
                $status = null;
                $tglTutupFaktur = null;
                $msg = 'Batal';
            }
            $data = PasienDaftar::where('noregistrasi', $request['noregistrasi'])
                ->update([
                    'isclosing' => $status,
                    'tgltutupfaktur' => $tglTutupFaktur
                ]);
            $transMessage = $msg . " Closing Pemeriksaan Berhasil";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Closing Pemeriksaan Gagal";
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

    public function selesaiTransaksiClaim(Request $request)
    {
        DB::beginTransaction();
        $transStatus = 'true';
        try {
            $status = true;
            $msg = '';
            if ($request['claim'] == false) {
                $status = null;
                $msg = 'Batal';
            }
            $data = PasienDaftar::where('noregistrasi', $request['noregistrasi'])
                ->update([
                    'isclaim' => $status,
                ]);
            $transMessage = $msg . " Claim Berhasil";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Claim Gagal";
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

    public function selesaiTransaksiClaimPP(Request $request)
    {
        DB::beginTransaction();
        $transStatus = 'true';
        try {
            // return($request['claim']);
            // die();
            $status = true;
            $msg = '';
            if ($request['claim'] === false) {
                $status = null;
                $msg = 'Batal';
            }
            $data = PelayananPasien::where('norec', $request['norec'])
                ->update([
                    'isclaim' => $status,
                ]);
            $transMessage = $msg . " Claim Berhasil";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Claim Gagal";
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
    public function getSumJmlByrResepObatKronis(Request $request)
    {

        $data = DB::select(DB::raw("SELECT        sum(totalbiaya) as total
    FROM            V_cetak23Kronis
    WHERE        (norec = '$request[norec]')"));



        return $this->respond($data);
    }
    public function selesaiTransaksiAddRM(Request $request)
    {
        // ini yg noregistrasiresume di komen dulu
        DB::beginTransaction();
        $transStatus = 'true';
        try {
            $status = true;
            $msg = '';
            if ($request['isrm'] == false) {
                $status = null;
                $msg = 'Batal';
            }
            $data = PelayananPasien::where('norec', $request['norec'])
                ->update([
                    'isrm' => $status,
                    // 'noregistrasiresume' => $request['noregistrasiresume']
                ]);
            $transMessage = $msg . " Add RM Berhasil";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Add RM Gagal";
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

    public function selesaiKlikCuyy(Request $request)
    {
        DB::beginTransaction();
        $transStatus = 'true';
        try {
            $status = true;
            $msg = '';
            if ($request['cuyy'] == false) {
                $status = null;
                $msg = ' ';
            }
            $data = PasienDaftar::where('noregistrasi', $request['noregistrasi'])
                ->update([
                    'isjanjidisiapkan' => $status,
                ]);
            $transMessage = $msg . "Berhasil";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Gagal";
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


    public function selesaiTransaksiAddBedah(Request $request)
    {
        DB::beginTransaction();
        $transStatus = 'true';
        try {
            $status = true;
            $msg = '';
            if ($request['isbedah'] == false) {
                $status = null;
                $msg = 'Batal';
            }
            $data = PelayananPasien::where('norec', $request['norec'])
                ->update([
                    'isbedah' => $status,
                ]);
            $transMessage = $msg . " Add RM Berhasil";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Add RM Gagal";
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

    public function selesaiTransaksiObatRM(Request $request)
    {
        DB::beginTransaction();
        $transStatus = 'true';
        try {
            // return($request['isrm']);
            // die();
            $status = true;
            $msg = '';
            if ($request['isrm'] == false) {
                $status = null;
                $msg = 'Batal';
            }
            $dataPP = DB::select(DB::raw(" SELECT        pp.norec as norecPP
            FROM            pasiendaftar_t AS pd
            INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
            INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
                WHERE pd.noregistrasi = '$request[noregistrasi]' AND pp.produkfk = '$request[produkfk]'"));

            // return($status);
            // die();
            foreach ($dataPP as $key => $valuePP) {
                // return($valuePP->norecPP);
                // die();
                $data = PelayananPasien::where('norec', $valuePP->norecpp)
                    ->update([
                        'isrm' => $status,
                    ]);
                // $data = PelayananPasien::where('produkfk', $request['produkfk'])
                // ->update([
                //     'dosisobat' => $value['dosisobat'],
                // ]);
            }
            $transMessage = $msg . " Add RM Berhasil";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Add RM Gagal";
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

    public function selesaiTransaksiObatRMPulang(Request $request)
    {
        DB::beginTransaction();
        $transStatus = 'true';
        try {
            // return($request['isrm']);
            // die();
            $status = true;
            $msg = '';
            if ($request['ispulang'] == false) {
                $status = null;
                $msg = 'Batal';
            }
            // $dataPP = DB::select(DB::raw(" SELECT        pp.norec as norecPP
            // FROM            pasiendaftar_t AS pd
            // INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
            // INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
            //     WHERE pd.noregistrasi = '$request[noregistrasi]' AND pp.produkfk = '$request[produkfk]'"));

            // return($dataPP);
            // die();
            // foreach ($dataPP as $key => $valuePP) {
            // return($valuePP->norecPP);
            // die();
            $data = PelayananPasien::where('norec', $request['norec_pp'])
                ->update([
                    'ispulang' => $status,
                ]);
            // $data = PelayananPasien::where('produkfk', $request['produkfk'])
            // ->update([
            //     'dosisobat' => $value['dosisobat'],
            // ]);
            // }
            $transMessage = $msg . " Add RM Berhasil";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Add RM Gagal";
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

    // public function closePemeriksaanClaimPD(Request $request){
    //     DB::beginTransaction();
    //     $transStatus = 'true';
    //     try {
    //         $status = true;
    //         $msg = '';
    //         // $tglTutupFaktur = date('Y-m-d H:i:s');
    //         if($request['claim'] ==false){
    //             $status = null;
    //             $tglTutupFaktur = null;
    //             $msg = 'Batal';
    //         }
    //         $data = PasienDaftar::where('noregistrasi', $request['noregistrasi'])
    //             ->update([
    //                 'isclaim' => $status,
    //             ]);
    //         $transMessage = $msg. " Claim Pemeriksaan Berhasil";
    //     } catch (\Exception $e) {
    //         $transStatus = 'false';
    //         $transMessage = "Claim Pemeriksaan Gagal";
    //     }

    //     if ($transStatus != 'false') {
    //         DB::commit();
    //         $result = array(
    //             "status" => 201,
    //             "message" => $transMessage,
    //         );
    //     } else {
    //         DB::rollBack();
    //         $result = array(
    //             "status" => 400,
    //             "message" => $transMessage,
    //         );
    //     }

    //     return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    // }

    public function updatePetugasPelaksana(Request $request)
    {
        DB::beginTransaction();
        $transStatus = 'true';
        // return($request['id']);
        // die();
        try {
            $data = MapPetugasPelaksanaBpjs::where('id', $request['id'])
                ->update([
                    'statusenabled' => $request['statusenabled'],
                    'objectpegawaifk' => $request['objectpegawaifk'],
                    'objectkelompokprodukbpjsfk' => $request['objectkelompokprodukbpjsfk'],
                    'objectpetugaspelaksanafk' => $request['objectpetugaspelaksanafk']
                ]);
            if ($request['objectpegawaifk'] == 'true') {
                $transMessage = "Update Data Berhasil";
            } else {
                $transMessage = "Hapus Data Berhasil";
            }
        } catch (\Exception $e) {
            $transStatus = 'false';
            // $transMessage = "Update Data Gagal";
            if ($request['objectpegawaifk'] == 'false') {
                $transMessage = "Update Data Gagal";
            } else {
                $transMessage = "Hapus Data Gagal";
            }
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

    public function savePetugasPelaksana(Request $request)
    {
        DB::beginTransaction();
        try {
            $transStatus = 'false';
            if ($request['id'] == "" || $request['id'] == null || $request['id'] == "undefined") {
                $id = MapPetugasPelaksanaBpjs::max('id') + 1;

                if ($id == '') {
                    $id = 1;
                }
                // return($id);
                // die();
                // return($id);
                // die();
                // $statusenabled = true;
                $savex = new MapPetugasPelaksanaBpjs();
                $savex->id = $id;
                $savex->norec = $savex->generateNewId();
                $savex->statusenabled =  $request['statusenabled'];
                $savex->objectkelompokprodukbpjsfk = $request['objectkelompokprodukbpjsfk'];
                $savex->objectpetugaspelaksanafk = $request['objectpetugaspelaksanafk'];
                $savex->objectpegawaifk = $request['objectpegawaifk'];
                $savex->save();
                $transStatus = 'true';
            }
        } catch (\Exception $e) {
            $transStatus = 'false';
        }
        if ($transStatus = 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "message" => $transMessage,
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

    public function getStrukPelayanan($noRegister)
    {
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('strukpelayanan_t as sp', 'pd.nostruklastfk', '=', 'sp.norec')
            ->select(
                'pd.norec as norec_pd',
                'pd.noregistrasi',
                'sp.norec as norec_sp',
                'sp.nosbmlastfk',
                'sp.nostruk',
                'sp.totalharusdibayar',
                'sp.tglstruk'
            )
            ->whereNull('sp.nosbmlastfk')
            ->where('pd.statusenabled', true)
            ->whereNotNull('pd.tglpulang')
            ->where('pd.noregistrasi', $noRegister)
            ->orderBy('sp.tglstruk', 'desc')
            ->get();
        $result  = array(
            'data' => $data,
        );

        return $this->respond($result);
    }

    public function detailTagihanVerifikasi($noRegister, Request $request)
    {
        $dataRuangan = \DB::table('pasiendaftar_t as pd')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->select('ru.namaruangan as namaruangan')
            ->where('pd.noregistrasi', $noRegister)
            ->first();
        $pelayanan = [];
        $pelayanan = \DB::table('pasiendaftar_t as pd')
            ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->leftjoin('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            //            ->leftjoin('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
            //            ->leftjoin('jenisproduk_m as jp', 'jp.id', '=', 'djp.objectjenisprodukfk')
            //            ->leftjoin('kelompokprodukbpjs_m as kpBpjs', 'kpBpjs.id', '=', 'pr.objectkelompokprodukbpjsfk')
            ->leftjoin('kelas_m as kl', 'kl.id', '=', 'apd.objectkelasfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            //            ->join('ruangan_m as ru2', 'ru2.id', '=', 'pd.objectruanganlastfk')
            //            ->join('pasien_m as pas', 'pas.id', '=', 'pd.nocmfk')
            //            ->leftjoin('agama_m as ag', 'ag.id', '=', 'pas.objectagamafk')
            //            ->leftjoin('jeniskelamin_m as jkel', 'jkel.id', '=', 'pas.objectjeniskelaminfk')
            //            ->leftjoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            //            ->leftjoin('kelas_m as kls', 'kls.id', '=', 'apd.objectkelasfk')
            //            ->leftjoin('kelas_m as kls2', 'kls2.id', '=', 'pd.objectkelasfk')
            //            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            //            ->leftjoin('pegawai_m as pgpj', 'pgpj.id', '=', 'pd.objectpegawaifk')
            //            ->leftjoin('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
            //            ->leftjoin('strukresep_t as sr', 'sr.norec', '=', 'pp.strukresepfk')
            //            ->leftjoin('ruangan_m as rusr', 'rusr.id', '=', 'sr.ruanganfk')
            //            ->leftjoin('kamar_m as kamar', 'kamar.id', '=', 'apd.objectkamarfk')
            //            ->leftjoin('pegawai_m as pgsr', 'pgsr.id', '=', 'sr.penulisresepfk')
            ->leftjoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
            //            ->leftjoin('strukpelayananpenjamin_t as sppj', 'sp.norec', '=', 'sppj.nostrukfk')
            ->leftjoin('strukbuktipenerimaan_t as sbm', 'sp.nosbmlastfk', '=', 'sbm.norec')
            //            ->leftjoin('pegawai_m as pgsbm', 'pgsbm.id', '=', 'sbm.objectpegawaipenerimafk')

            ->select(
                'pp.norec',
                'pp.tglpelayanan',
                'pp.rke',
                'pr.id as prid',
                'pr.namaproduk',
                'pp.jumlah',
                'kl.id as klid',
                'kl.namakelas',
                'ru.id as ruid',
                'ru.namaruangan',
                'pp.produkfk',
                'pp.hargajual',
                'pp.hargadiscount',
                'sp.nostruk',
                'sp.tglstruk',
                'apd.norec as norec_apd',
                'sbm.nosbm',
                'sp.norec as norec_sp',
                'pp.jasa',
                'pd.nocmfk',
                'pd.nostruklastfk',
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'pd.norec as norec_pd',
                'pd.tglpulang',
                'pd.objectrekananfk as rekananid',
                'pp.jasa',
                'sp.totalharusdibayar',
                'sp.totalprekanan',
                'sp.totalbiayatambahan',
                'pd.kdprofile',
                'pp.aturanpakai',
                'pp.iscito',
                'pd.statuspasien',
                'pp.isparamedis'
            )
            //            ->select('pp.norec', 'pp.tglpelayanan', 'pp.rke', 'pr.id as prid', 'pr.namaproduk', 'pp.jumlah', 'kl.id as klid', 'kl.namakelas',
            //                'ru.id as ruid', 'ru.namaruangan', 'pp.produkfk', 'pp.hargajual', 'pp.hargadiscount', 'sp.nostruk', 'sp.tglstruk', 'apd.norec as norec_apd',
            //                'pg.id as pgid', 'pg.namalengkap', 'sbm.nosbm', 'sp.norec as norec_sp', 'pp.jasa', 'pd.nocmfk', 'ru2.objectdepartemenfk as deptid',
            //                'pd.nocmfk', 'pd.nostruklastfk', 'ag.id as agid', 'ag.agama', 'pas.tgllahir',
            //                'kp.id as kpid', 'kp.kelompokpasien', 'pas.objectstatusperkawinanfk', 'pas.namaayah', 'pas.namasuamiistri',
            //                'pas.id as pasid', 'pas.nocm', 'jkel.id as jkelid', 'jkel.jeniskelamin', 'jkel.reportdisplay as jk', 'pd.noregistrasi', 'pas.namapasien',
            //                'pd.tglregistrasi', 'pd.norec as norec_pd', 'pd.tglpulang', 'pas.notelepon', 'kls.id as klsid', 'kls.namakelas',
            //                'pd.objectrekananfk as rekananid', 'ru2.namaruangan as ruanganlast', 'kls2.id as klsid2', 'kls2.namakelas as namakelas2',
            //                'sr.noresep', 'rk.namarekanan', 'rusr.namaruangan as ruanganfarmasi', 'pgsr.namalengkap as penulisresep', 'jp.jenisproduk', 'kpBpjs.kelompokprodukbpjs as kelompokprodukbpjs',
            //                'pgpj.namalengkap as dokterpj', 'pp.jasa', 'kamar.namakamar', 'sp.totalharusdibayar', 'sp.totalprekanan', 'sppj.totalppenjamin',
            //                'sp.totalbiayatambahan', 'pgsbm.namalengkap as namalengkapsbm','pd.kdprofile','pp.aturanpakai','pp.iscito','pd.statuspasien','pp.isparamedis'
            //            )
            ->where('pd.noregistrasi', $noRegister)
            ->orderBy('pp.tglpelayanan', 'pp.rke');


        //        if ($request['jenisdata'] == 'resep'){
        //            if(isset($request['idruangan']) && $request['idruangan']!="" && $request['idruangan']!="undefined"){
        //                $pelayanan = $pelayanan->where('apd.objectruanganfk',$request['idruangan']);
        //            };
        //            $pelayanan = $pelayanan->whereNotNull('pp.aturanpakai');
        //        }
        //        if ($request['jenisdata'] == 'layanan'){
        //            if(isset($request['idruangan']) && $request['idruangan']!="" && $request['idruangan']!="undefined"){
        //                $pelayanan = $pelayanan->where('apd.objectruanganfk',$request['idruangan']);
        //            };
        //            $pelayanan = $pelayanan->whereNull('pp.aturanpakai');
        //        }
        $pelayanan = $pelayanan->get();


        if (count($pelayanan) > 0) {

            $totalBilling = 0;
            $norecAPD = '';
            $norecSP = '';
            $details = array();
            $dibayar = 0;
            $diverif = 0;
            foreach ($pelayanan as $value) {
                if ($value->produkfk == $this->getProdukIdDeposit()) {
                    continue;
                }
                if ($value->namaproduk == null) {
                    continue;
                }
                $jasa = 0;
                if (isset($value->jasa) && $value->jasa != "" && $value->jasa != "undefined") {
                    $jasa = $value->jasa;
                }
                $kmpn = [];

                $harga = (float)$value->hargajual;
                $diskon = (float)$value->hargadiscount;
                $detail = array(
                    'norec' => $value->norec,
                    'tglPelayanan' => $value->tglpelayanan,
                    'namaPelayanan' => $value->namaproduk,
                    //                    'dokter' => $NamaDokter,
                    'jumlah' => $value->jumlah,
                    'kelasTindakan' => @$value->namakelas,
                    'ruanganTindakan' => @$value->namaruangan,
                    'harga' => $harga,
                    'diskon' => $diskon,
                    'total' => (($harga - $diskon) * $value->jumlah) + $jasa,
                    'jppid' => '',
                    'jenispetugaspe' => '',
                    'strukfk' => $value->nostruk . ' / ' . $value->nosbm,
                    'sbmfk' => $value->nosbm,
                    'pgid' => '',
                    'ruid' => $value->ruid,
                    'prid' => $value->prid,
                    'klid' => $value->klid,
                    'norec_apd' => $value->norec_apd,
                    'norec_pd' => $value->norec_pd,
                    'norec_sp' => $value->norec_sp,
                    'komponen' => $kmpn,
                    'jasa' => $jasa,
                    'aturanpakai' => $value->aturanpakai,
                    'iscito' => $value->iscito,
                    'isparamedis' => $value->isparamedis
                );
                $details[] = $detail;
            }
        }

        $arrHsil = array(
            'details' => $details
        );
        return $this->respond($arrHsil);
    }
    public function simpanVerifikasiTagihanInacbg(Request $request, $noRegister)
    {
        $noregistrasifk = $request['noregistrasi'];
        // return($request['jumlahBayar']);
        // die();
        $hg = HasilGrouping::where('noregistrasifk', $noregistrasifk)
            ->update([
                'status' => "FINAL CLAIM"
            ]);
        $dataLogin = $request->all();
        // return($noRegister);
        // die();
        //        return $dataLogin;
        $dataPegawaiUser = DB::select(
            DB::raw("select pg.id,pg.namalengkap from loginuser_s as lu
                INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id
                where lu.id=:idLoginUser"),
            array(
                'idLoginUser' => $dataLogin['userData']['id'],
            )
        );
        $transStatus = true;
        $transMsg = null;
        $totalBilling = 0;
        $totalDeposit = 0;
        DB::beginTransaction();

        $pasienDaftar = PasienDaftar::where('noregistrasi', $noRegister)->first();

        $pelayanan =  DB::select(DB::raw("

            select pp.* from pasiendaftar_t as pd
            inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
            INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
            where pd.noregistrasi='$noRegister' and pp.strukfk is null
              
         "));
        $pelayananDetail = $pasienDaftar->pelayanan_pasien_detail()->whereNull('strukfk')->get();


        if (count($pelayanan) == 0) {
            $transStatus = false;
            $transMsg = "Pelayanan yang dilakukan pasien tidak ada.";
        }

        if ($transStatus) {
            $noStruk = $this->generateCode(new StrukPelayanan, 'nostruk', 10, 'S');
            $strukPelayanan = new StrukPelayanan();
            $strukPelayanan->norec = $strukPelayanan->generateNewId();
            $lastPelayanan = null;

            $sama = false;
            foreach ($pelayanan as $pel) {
                $sama = true;

                if ($sama == true) {
                    $harga = ($pel->hargajual == null) ? 0 : $pel->hargajual;
                    $diskon = ($pel->hargadiscount == null) ? 0 : $pel->hargadiscount;
                    if ($pel->nilainormal == -1) {
                        $totalDeposit += ($harga * $pel->jumlah);
                    } else {
                        $totalBilling += (($harga - $diskon) * $pel->jumlah) + $pel->jasa;
                    }
                }
            }


            $totalBilling = (float)$request['jumlahBayar'];
            $strukPelayanan->kdprofile = $this->getKdProfile();
            $strukPelayanan->nocmfk = $pasienDaftar->nocmfk;
            $strukPelayanan->noregistrasifk = $pasienDaftar->norec;
            $strukPelayanan->objectkelaslastfk = $pasienDaftar->objectkelasfk;
            $strukPelayanan->objectkelompoktransaksifk = 1;
            $strukPelayanan->objectpegawaipenerimafk = $dataPegawaiUser[0]->id; // $this->getCurrentLoginID();
            $strukPelayanan->nostruk = $noStruk;
            $strukPelayanan->totalharusdibayar = $totalBilling; //- $totalDeposit;
            $strukPelayanan->tglstruk = $this->getDateTime();
            $strukPelayanan->objectruanganfk = $pasienDaftar->objectruanganlastfk;

            $strukPelayanan->save();

            if ($transStatus) {

                $TotalBiayaPerTindakan = DB::select(
                    DB::raw("select pelayananpasien_t.norec, CASE WHEN hargasatuan <> 0 THEN hargasatuan * jumlah ELSE 0 END AS TotalBiayaPerTindakan, pelayananpasien_t.noregistrasifk, pelayananpasien_t.piutangpenjamin
                FROM pelayananpasien_t INNER JOIN antrianpasiendiperiksa_t ON pelayananpasien_t.noregistrasifk = antrianpasiendiperiksa_t.norec INNER JOIN pasiendaftar_t ON antrianpasiendiperiksa_t.noregistrasifk = pasiendaftar_t.norec
                where pasiendaftar_t.noregistrasi = '$noRegister'")
                );

                foreach ($TotalBiayaPerTindakan as $item) {

                    PelayananPasien::where('norec', $item->norec)
                        ->update(
                            [
                                'strukfk' => $strukPelayanan->norec
                            ]
                        );
                }
            }
        }

        if ($transStatus) {
            foreach ($pelayananDetail as $pelDel) {
                $pelDel->strukfk = $strukPelayanan->norec;
                try {
                    $pelDel->save();
                } catch (\Exception $e) {
                    $transStatus = false;
                    $transMsg = "Transaksi Gagal (insert SP)";
                    break;
                }
            }
        }

        $totalKlaim = (float)$request['totalKlaim'];
        if ($transStatus && $totalKlaim > 0) {
            $strukPelayanan->totalprekanan = $totalKlaim;
            if ($pasienDaftar->objectkelompokpasienlastfk == $this->getKelompokPasienPerjanjian()) {
                $rekananpenjamin_id = 0;
            } elseif ($pasienDaftar->objectkelompokpasienlastfk == 2 || $pasienDaftar->objectkelompokpasienlastfk == 4) {
                $rekananpenjamin_id = 2552;
            } else {
                $rekananpenjamin_id = 0;
            }
            $SPPenjamin = new StrukPelayananPenjamin();
            $SPPenjamin->norec = $SPPenjamin->generateNewId();
            $SPPenjamin->kdprofile = $this->getKdProfile();
            $SPPenjamin->kdkelompokpasien = $pasienDaftar->objectkelompokpasienlastfk;
            $SPPenjamin->kdrekananpenjamin = $rekananpenjamin_id;
            $SPPenjamin->totalbiaya = $totalBilling + $totalKlaim + $totalDeposit;
            $SPPenjamin->totalsudahppenjamin = $totalKlaim;
            $SPPenjamin->totalsisaharusdibayar = $totalKlaim;
            $SPPenjamin->totalppenjamin = $totalKlaim;
            $SPPenjamin->totalharusdibayar = $totalKlaim;
            $SPPenjamin->totalsudahdibayar = 0;
            $SPPenjamin->totalsudahdibebaskan = 0;
            $SPPenjamin->totalsisapiutang = $totalKlaim;
            $SPPenjamin->totaldibayarlebih = 0;
            $SPPenjamin->nostrukfk = $strukPelayanan->norec;

            $pasienDaftar->nostruklastfk = $strukPelayanan->norec;
            try {
                $SPPenjamin->save();
            } catch (\Exception $e) {
                $transStatus = false;
                $transMsg = "Transaksi Gagal (Insert SPP)";
            }
        }
        if ($transStatus) {
            $pasienDaftar->nostruklastfk = $strukPelayanan->norec;
            try {
                $pasienDaftar->save();
            } catch (\Exception $e) {
                $transStatus = false;
                $transMsg = "Transaksi Gagal (update Pdaf)";
            }
        }
        if ($transStatus) {
            try {
                $strukPelayanan->save();
            } catch (\Exception $e) {
                $transStatus = false;
                $transMsg = "Simpan Biaya Administrasi Gagal {SP}";
            }
        }

        if ($transStatus) {
            $this->setStatusCode(201);
            $transMsg = "Transaksi Berhasil";
            DB::commit();
        } else {
            $this->setStatusCode(400);
            DB::rollBack();
        }
        return $this->respond([], $transMsg);
    }
    public function simpanVerifikasiTagihanTatarekening(Request $request)
    {
        $dataLogin = $request->all();
        $noRegister = $request['data']['noRegistrasi'];
        $dataPegawaiUser = DB::select(
            DB::raw("select pg.id,pg.namalengkap from loginuser_s as lu
                INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id
                where lu.id=:idLoginUser"),
            array(
                'idLoginUser' => $dataLogin['userData']['id'],
            )
        );
        $transMsg = null;
        $totalBilling = 0;
        $totalDeposit = 0;
        $totalDiscountSum = 0;
        $totalBillingSum = 0;
        DB::beginTransaction();
        try {
            $pasienDaftar = PasienDaftar::where('noregistrasi', $noRegister)->first();
            //        $pelayanan = $pasienDaftar->pelayanan_pasien()->select('pelayananpasien_t.*')->whereNull('strukfk')->get();
            $pelayanan =  DB::select(DB::raw("
            select pp.* from pasiendaftar_t as pd
            inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
            INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
            where pd.noregistrasi='$noRegister' and pp.strukfk is null              
         "));
            $SPPenjamin = new StrukPelayananPenjamin();
            $pelayananDetail = $pasienDaftar->pelayanan_pasien_detail()->whereNull('strukfk')->get();
            if (count($pelayanan) == 0) {
                $transMsg = "Pelayanan yang dilakukan pasien tidak ada.";
            }
            if (count($dataLogin['data']['datachecklist']) == 0) {
                $transMsg = "Pelayanan blm ada yg di pilih";
            }
            $noStruk = $this->generateCode(new StrukPelayanan, 'nostruk', 10, 'S');
            $strukPelayanan = new StrukPelayanan();
            $strukPelayanan->norec = $strukPelayanan->generateNewId();
            $lastPelayanan = null;

            $sama = false;
            foreach ($pelayanan as $pel) {
                $sama = false;
                foreach ($dataLogin['data']['datachecklist'] as $chklist) {
                    if ($chklist['norec'] == $pel->norec) {
                        $sama = true;
                        break;
                    }
                }
                if ($sama == true) {
                    $harga = ($pel->hargajual == null) ? 0 : $pel->hargajual;
                    $diskon = ($pel->hargadiscount == null) ? 0 : $pel->hargadiscount;
                    if ($pel->nilainormal == -1) {
                        $totalDeposit += ($harga * $pel->jumlah);
                    } else {
                        $totalBilling += (($harga - $diskon) * $pel->jumlah) + $pel->jasa;
                    }
                    $totalDiscountSum = $totalDiscountSum + $diskon;
                }
            }
            $totalBilling = (float)$request['data']['jumlahBayar'];
            $strukPelayanan->kdprofile = $this->getKdProfile();
            $strukPelayanan->nocmfk = $pasienDaftar->nocmfk;
            $strukPelayanan->noregistrasifk = $pasienDaftar->norec;
            $strukPelayanan->objectkelaslastfk = $pasienDaftar->objectkelasfk;
            $strukPelayanan->objectkelompoktransaksifk = 1;
            $strukPelayanan->objectpegawaipenerimafk = $dataPegawaiUser[0]->id; // $this->getCurrentLoginID();
            $strukPelayanan->nostruk = $noStruk;
            $strukPelayanan->totalharusdibayar = $totalBilling; //- $totalDeposit;
            $strukPelayanan->tglstruk = $this->getDateTime();
            $strukPelayanan->objectruanganfk = $pasienDaftar->objectruanganlastfk;
            if (isset($request['corona'])) {
                $strukPelayanan->iscorona = $request['corona'];
            }
            $strukPelayanan->save();
            foreach ($dataLogin['data']['datachecklist'] as $chklist) {
                PelayananPasien::where('norec', $chklist['norec'])
                    ->update([
                        'strukfk' => $strukPelayanan->norec,
                        'iscorona'  =>  $request['corona']
                    ]);
            }

            foreach ($pelayananDetail as $pelDel) {
                $pelDel->strukfk = $strukPelayanan->norec;
                $pelDel->save();
            }

            $pelayananCekDeui =  DB::select(DB::raw("
        select pp.* from pasiendaftar_t as pd
        inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
        INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
        where pd.noregistrasi='$noRegister'             
     "));
            foreach ($pelayananCekDeui as $dataCekCoy) {
                $sama = false;
                foreach ($dataLogin['data']['datachecklist'] as $chklist) {
                    if ($chklist['norec'] == $dataCekCoy->norec) {
                        $sama = true;
                        break;
                    }
                }
                if ($sama == true) {
                    $harga = ($dataCekCoy->hargajual == null) ? 0 : $dataCekCoy->hargajual;
                    $diskon = ($dataCekCoy->hargadiscount == null) ? 0 : $dataCekCoy->hargadiscount;
                    $totalBillingSum = $totalBillingSum + $harga;
                    $totalDiscountSum = $totalDiscountSum + $diskon;
                }
            }
            StrukPelayanan::where('noregistrasifk', '=', $pasienDaftar->norec)
                ->update([
                    'totalfisikdifaktur' =>  (float)$totalBillingSum - (float)$totalDiscountSum,
                    'selisih' => (float)$totalBilling - ((float)$totalBillingSum - (float)$totalDiscountSum)
                ]);
            $totalKlaim = (float)$request['data']['totalKlaim'];
            $jumlahbayar = (float)$request['data']['jumlahBayar'];
            $jumlahbayarnew =
            (float)$request['data']['jumlahBayarNew'];
         
            if ($totalKlaim > 0){
                
                //            $strukPelayanan->totalharusdibayar -= $totalKlaim;
                $strukPelayanan->totalprekanan = $totalKlaim;
                if ($pasienDaftar->objectkelompokpasienlastfk == $this->getKelompokPasienPerjanjian()) {
                    $rekananpenjamin_id = 0;
                } elseif ($pasienDaftar->objectkelompokpasienlastfk == 2 || $pasienDaftar->objectkelompokpasienlastfk == 4) {
                    $rekananpenjamin_id = 2552;
                } else {
                    $rekananpenjamin_id = 0; //masih bypass. yang kelompok pasien penjanjian diisini cuma kondisinhya jiga ada klim tapi gak penjaminnya..
                }
                $SPPenjamin->norec = $SPPenjamin->generateNewId();
                //$norecStukPelayananPenjaminStr =  $SPPenjamin->norec;
                $SPPenjamin->kdprofile = $this->getKdProfile();
                $totalBilling = (float)$request['data']['billing'];
                $SPPenjamin->kdkelompokpasien = $pasienDaftar->objectkelompokpasienlastfk;
                $SPPenjamin->kdrekananpenjamin = $rekananpenjamin_id;
                // $SPPenjamin->totalbiaya = $totalBilling + $totalKlaim + $totalDeposit; diganti
                $SPPenjamin->totalbiaya = $totalBilling;
                $SPPenjamin->totalsudahppenjamin = $totalKlaim; //? apa in ?
                $SPPenjamin->totalsisaharusdibayar = $totalKlaim;
                $SPPenjamin->totalppenjamin = $totalKlaim;
                $SPPenjamin->totalharusdibayar = $totalKlaim;
                $SPPenjamin->totalsudahdibayar = 0;
                $SPPenjamin->totalsudahdibebaskan = 0;
                $SPPenjamin->totalsisapiutang = $totalKlaim;
                $SPPenjamin->totaldibayarlebih = 0;
                $SPPenjamin->nostrukfk = $strukPelayanan->norec;
                $pasienDaftar->nostruklastfk = $strukPelayanan->norec;
                $SPPenjamin->save();
                if ($dataLogin['data']['cekMultiPenjamin'] == true && count($dataLogin['data']['multiPenjamin']) > 0
                ) {
                    $reqDetail = $dataLogin['data']['multiPenjamin'];
                    foreach ($reqDetail as $values) {
                        $SPPenjaminDet = new StrukPelayananPenjaminDetail();
                        $SPPenjaminDet->norec = $SPPenjaminDet->generateNewId();
                        $SPPenjaminDet->statusenabled = true;
                        $SPPenjaminDet->kdprofile = $this->getKdProfile();
                        $SPPenjaminDet->nostrukfk = $strukPelayanan->norec;
                        $SPPenjaminDet->totalppenjamin = $values['klaim'];
                        $SPPenjaminDet->totalharusdibayar = $values['klaim'];
                        $SPPenjaminDet->keteranganlainnya = 'Multi Penjamin';
                        $SPPenjaminDet->kdrekananpenjamin = $values['rekananfk'];
                        $SPPenjaminDet->strukpelayananpenjaminfk = $SPPenjamin->norec;
                        $SPPenjaminDet->kdkelompokpasien = $values['kelompokpasienfk'];
                        $SPPenjaminDet->save();
                    }
                }
            }else if ($jumlahbayar < $jumlahbayarnew) {
                $totalBilling = (float)$request['data']['billing'];
                //            $strukPelayanan->totalharusdibayar -= $totalKlaim;
                $strukPelayanan->totalprekanan = $totalKlaim;
                if ($pasienDaftar->objectkelompokpasienlastfk == $this->getKelompokPasienPerjanjian()) {
                    $rekananpenjamin_id = 0;
                } elseif ($pasienDaftar->objectkelompokpasienlastfk == 2 || $pasienDaftar->objectkelompokpasienlastfk == 4) {
                    $rekananpenjamin_id = 2552;
                } else {
                    $rekananpenjamin_id = 0; //masih bypass. yang kelompok pasien penjanjian diisini cuma kondisinhya jiga ada klim tapi gak penjaminnya..
                }
                $SPPenjamin->norec = $SPPenjamin->generateNewId();
                //$norecStukPelayananPenjaminStr =  $SPPenjamin->norec;
                $SPPenjamin->kdprofile = $this->getKdProfile();
                $SPPenjamin->kdkelompokpasien = $pasienDaftar->objectkelompokpasienlastfk;
                $SPPenjamin->kdrekananpenjamin = $rekananpenjamin_id;
                $SPPenjamin->totalbiaya =
                    $totalBilling;
                $SPPenjamin->totalsudahppenjamin =0; //? apa in ?
                $SPPenjamin->totalsisaharusdibayar = 0;
                $SPPenjamin->totalppenjamin = 0;
                $SPPenjamin->totalharusdibayar =$jumlahbayar;
                $SPPenjamin->totalsudahdibayar = $jumlahbayar;
                $SPPenjamin->totalsudahdibebaskan = 0;
                $SPPenjamin->totalsisapiutang = $totalBilling-$jumlahbayar;
                $SPPenjamin->totaldibayarlebih = 0;
                $SPPenjamin->nostrukfk = $strukPelayanan->norec;
                $pasienDaftar->nostruklastfk = $strukPelayanan->norec;
                $SPPenjamin->save();

              
            }
       
            $pasienDaftar->nostruklastfk = $strukPelayanan->norec;
            $pasienDaftar->save();
            $strukPelayanan->save();

            $transStatus = true;
            $dataLogin = $request->all();
            $struk = StrukPelayanan::where('norec', $pasienDaftar->nostruklastfk)->first();
            $newId = LoggingUser::max('id');
            $newId = $newId + 1;
            $logUser = new LoggingUser();
            $logUser->id = $newId;
            $logUser->norec = $logUser->generateNewId();
            $logUser->kdprofile = 11;
            $logUser->statusenabled = true;
            $logUser->jenislog = 'Verifikasi TataRekening';
            $logUser->noreff = $pasienDaftar->nostruklastfk;
            $logUser->referensi = 'norec Struk Pelayanan';
            $logUser->objectloginuserfk =  $dataLogin['userData']['id']; //$dataPegawaiUser[0]->id;
            $logUser->tanggal = $this->getDateTime()->format('Y-m-d H:i:s');
            if (!empty($struk)) {
                $logUser->keterangan = 'Verifikasi TataRekening No ' . $struk->nostruk . ' / No Registrasi ' . $noRegister;
            }
            $logUser->save();

            if ($request['corona'] == true || $request['corona'] == 'true') {
                $strukBuktiPenerimanan = new StrukBuktiPenerimaan();
                $strukBuktiPenerimanan->norec = $strukBuktiPenerimanan->generateNewId();
                $strukBuktiPenerimanan->kdprofile = $this->getKdProfile();
                $strukBuktiPenerimanan->keteranganlainnya = "Pembayaran Tagihan Pasien";
                $strukBuktiPenerimanan->statusenabled = 1;
                $strukBuktiPenerimanan->nostrukfk = $strukPelayanan->norec;
                $strukBuktiPenerimanan->objectkelompokpasienfk = $strukPelayanan->pasien_daftar->pasien->objectkelompokpasienfk;
                $strukBuktiPenerimanan->objectkelompoktransaksifk = 1;
                $strukBuktiPenerimanan->objectpegawaipenerimafk  = $this->getCurrentLoginID();
                $strukBuktiPenerimanan->tglsbm  =  $this->getDateTime(); // $request['tglsbm'];//$this->getDateTime();
                $strukBuktiPenerimanan->totaldibayar  = $totalBilling; //$pembayaran['nominal'];
                $strukBuktiPenerimanan->nosbm = $this->generateCode(new StrukBuktiPenerimaan, 'nosbm', 14, 'RV-' . $this->getDateTime()->format('ym'));
                $strukBuktiPenerimanan->iscorona = $request['corona'];
                $NOSBM[] = $strukBuktiPenerimanan->nosbm;
                $nostrukfkSTR = $strukPelayanan->norec;
                $strukBuktiPenerimanan->save();

                $SBPCB = new StrukBuktiPenerimaanCaraBayar();
                $SBPCB->norec = $SBPCB->generateNewId();
                $SBPCB->kdprofile = $this->getKdProfile();
                $SBPCB->statusenabled = 1;
                $SBPCB->nosbmfk = $strukBuktiPenerimanan->norec;
                $SBPCB->objectcarabayarfk = 1;
                $SBPCB->totaldibayar = $totalBilling; //$pembayaran['nominal'];
                $SBPCB->save();

                $logAcc = new  LogAcc;
                $logAcc->norec = $logAcc->generateNewId();
                $logAcc->jenistransaksi = 'Pembayaran Tagihan';
                $logAcc->noreff = $nostrukfkSTR;
                $logAcc->status = 0;
                $logAcc->tanggal = $this->getDateTime()->format('Y-m-d H:i:s');
                $logAcc->save();
            }

            $transStatus = true;
        } catch (\Exception $e) {
            $transStatus = false;
            $transMsg = "Transaksi Gagal";
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Sukses";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $strukPelayanan,
                'as' => 'ea@epic',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                //                'result' => $SPPenjamin,
                'as' => 'ea@epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function detailTagihanVerifikasiTatarekening($noRegister, Request $request)
    {
        $dataRuangan = \DB::table('pasiendaftar_t as pd')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->select('ru.namaruangan as namaruangan')
            ->where('pd.noregistrasi', $noRegister)
            ->first();
        $pelayanan = [];
        $pelayanan = \DB::table('pasiendaftar_t as pd')
            ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->leftjoin('pelayananpasientidakterklaim_t as ptt', 'ptt.pelayananpasien', '=', 'pp.norec')
            ->leftjoin('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            //            ->leftjoin('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
            //            ->leftjoin('jenisproduk_m as jp', 'jp.id', '=', 'djp.objectjenisprodukfk')
            //            ->leftjoin('kelompokprodukbpjs_m as kpBpjs', 'kpBpjs.id', '=', 'pr.objectkelompokprodukbpjsfk')
            ->leftjoin('kelas_m as kl', 'kl.id', '=', 'apd.objectkelasfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            //            ->join('ruangan_m as ru2', 'ru2.id', '=', 'pd.objectruanganlastfk')
            //            ->join('pasien_m as pas', 'pas.id', '=', 'pd.nocmfk')
            //            ->leftjoin('agama_m as ag', 'ag.id', '=', 'pas.objectagamafk')
            //            ->leftjoin('jeniskelamin_m as jkel', 'jkel.id', '=', 'pas.objectjeniskelaminfk')
            //            ->leftjoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            //            ->leftjoin('kelas_m as kls', 'kls.id', '=', 'apd.objectkelasfk')
            //            ->leftjoin('kelas_m as kls2', 'kls2.id', '=', 'pd.objectkelasfk')
            //            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            //            ->leftjoin('pegawai_m as pgpj', 'pgpj.id', '=', 'pd.objectpegawaifk')
            //            ->leftjoin('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
            //            ->leftjoin('strukresep_t as sr', 'sr.norec', '=', 'pp.strukresepfk')
            //            ->leftjoin('ruangan_m as rusr', 'rusr.id', '=', 'sr.ruanganfk')
            //            ->leftjoin('kamar_m as kamar', 'kamar.id', '=', 'apd.objectkamarfk')
            //            ->leftjoin('pegawai_m as pgsr', 'pgsr.id', '=', 'sr.penulisresepfk')
            ->leftjoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
            //            ->leftjoin('strukpelayananpenjamin_t as sppj', 'sp.norec', '=', 'sppj.nostrukfk')
            ->leftjoin('strukbuktipenerimaan_t as sbm', 'sp.nosbmlastfk', '=', 'sbm.norec')
            //            ->leftjoin('pegawai_m as pgsbm', 'pgsbm.id', '=', 'sbm.objectpegawaipenerimafk')

            ->select(
                'pp.norec',
                'pp.tglpelayanan',
                'pp.rke',
                'pr.id as prid',
                'pr.namaproduk',
                'pp.jumlah',
                'kl.id as klid',
                'kl.namakelas',
                'ru.id as ruid',
                'ru.namaruangan',
                'pp.produkfk',
                'pp.hargajual',
                'pp.hargadiscount',
                'sp.nostruk',
                'sp.tglstruk',
                'apd.norec as norec_apd',
                'sbm.nosbm',
                'sp.norec as norec_sp',
                'pp.jasa',
                'pd.nocmfk',
                'pd.nostruklastfk',
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'pd.norec as norec_pd',
                'pd.tglpulang',
                'pd.objectrekananfk as rekananid',
                'pp.jasa',
                'sp.totalharusdibayar',
                'sp.totalprekanan',
                'sp.totalbiayatambahan',
                'pd.kdprofile',
                'pp.aturanpakai',
                'pp.iscito',
                'pd.statuspasien',
                'pp.isparamedis',
                'pp.piutangpenjamin',
                DB::raw("CASE when pp.produkfk = ptt.produkfk then 1 else 0 end as istidakterklaim")
            )
            ->where('pd.noregistrasi', $noRegister)
            ->orderBy('pp.tglpelayanan', 'pp.rke');


        //        if ($request['jenisdata'] == 'resep'){
        if (isset($request['idruangan']) && $request['idruangan'] != "" && $request['idruangan'] != "undefined") {
            $pelayanan = $pelayanan->where('apd.objectruanganfk', $request['idruangan']);
        };
        //            $pelayanan = $pelayanan->whereNotNull('pp.aturanpakai');
        //        }
        //        if ($request['jenisdata'] == 'layanan'){
        //            if(isset($request['idruangan']) && $request['idruangan']!="" && $request['idruangan']!="undefined"){
        //                $pelayanan = $pelayanan->where('apd.objectruanganfk',$request['idruangan']);
        //            };
        //            $pelayanan = $pelayanan->whereNull('pp.aturanpakai');
        //        }
        $pelayanan = $pelayanan->get();
        if (count($pelayanan) > 0) {
            $totalBilling = 0;
            $norecAPD = '';
            $norecSP = '';
            $details = array();
            $dibayar = 0;
            $diverif = 0;
            foreach ($pelayanan as $value) {
                if ($value->produkfk == $this->getProdukIdDeposit()) {
                    continue;
                }
                if ($value->namaproduk == null) {
                    continue;
                }
                $jasa = 0;
                if (isset($value->jasa) && $value->jasa != "" && $value->jasa != "undefined") {
                    $jasa = $value->jasa;
                }
                $kmpn = [];
                $harga = (float)$value->hargajual;
                $diskon = (float)$value->hargadiscount;
                $detail = array(
                    'norec' => $value->norec,
                    'tglPelayanan' => $value->tglpelayanan,
                    'namaPelayanan' => $value->namaproduk,
                    // 'dokter' => $NamaDokter,
                    'jumlah' => $value->jumlah,
                    'kelasTindakan' => @$value->namakelas,
                    'ruanganTindakan' => @$value->namaruangan,
                    'harga' => $harga,
                    'diskon' => $diskon * $value->jumlah,
                    'total' => (($harga - $diskon) * $value->jumlah) + $jasa,
                    'jppid' => '',
                    'jenispetugaspe' => '',
                    'strukfk' => $value->nostruk . ' / ' . $value->nosbm,
                    'sbmfk' => $value->nosbm,
                    'pgid' => '',
                    'ruid' => $value->ruid,
                    'prid' => $value->prid,
                    'klid' => $value->klid,
                    'norec_apd' => $value->norec_apd,
                    'norec_pd' => $value->norec_pd,
                    'norec_sp' => $value->norec_sp,
                    'komponen' => $kmpn,
                    'jasa' => $jasa,
                    'aturanpakai' => $value->aturanpakai,
                    'iscito' => $value->iscito,
                    'isparamedis' => $value->isparamedis,
                    'istidakterklaim' => (int)$value->istidakterklaim,
                    'piutangpenjamin' => $value->piutangpenjamin
                );
                $details[] = $detail;
            }
        }

        $arrHsil = array(
            'details' => $details
        );
        return $this->respond($arrHsil);
    }

    public function getPenjaminByKelompokPasien(Request $request)
    {
        $data = \DB::table('mapkelompokpasientopenjamin_m as mkp')
            ->join('kelompokpasien_m as kp', 'kp.id', '=', 'mkp.objectkelompokpasienfk')
            ->join('rekanan_m as rk', 'rk.id', '=', 'mkp.kdpenjaminpasien')
            ->select('rk.id', 'rk.namarekanan', 'kp.id as id_kelompokpasien', 'kp.kelompokpasien')
            ->where('mkp.objectkelompokpasienfk', $request['kdKelompokPasien'])
            ->where('mkp.statusenabled', true)
            ->get();

        $result = array(
            'rekanan' => $data,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }

    public function daftarPiutangPasien(Request $request)
    {
        $filter = $request->all();
        //        $dataPiutang=[];
        $dataPiutang = \DB::table('strukpelayanan_t as sp')
            ->join('strukpelayananpenjamin_t as spp', 'sp.norec', '=', 'spp.nostrukfk')
            ->join('pelayananpasien_t as pp', 'pp.strukfk', '=', 'sp.norec')
            ->join('antrianpasiendiperiksa_t as ap', 'ap.norec', '=', 'pp.noregistrasifk')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'ap.noregistrasifk')
            ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'sp.noregistrasifk')
            // ->leftjoin('bpjsklaimtxt_t as bpjs', 'bpjs.sep', '=', 'pa.nosep')
            ->leftjoin('hasilgrouping_t as bpjs', 'bpjs.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('rekanan_m as rkn', 'rkn.id', '=', 'pd.objectrekananfk')
            ->join('pasien_m as p', 'p.id', '=', 'pd.nocmfk')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftJoin('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            ->leftJoin('rekanan_m as r', 'r.id', '=', 'spp.kdrekananpenjamin')
            ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftJoin('postinghutangpiutang_t as php', 'php.nostrukfk', '=', 'spp.norec')
            ->leftJoin('strukposting_t as spt', 'spt.noposting', '=', 'php.noposting')
            ->LEFTJOIN("strukbuktipenerimaan_t AS sbm", "sbm.norec", '=', "sp.nosbmlastfk")

            ->select(
                'kp.kelompokpasien',
                'spp.norec',
                'sp.tglstruk',
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'p.nocm',
                'p.namapasien',
                'spp.totalppenjamin',
                'spp.totalharusdibayar',
                'bpjs.totalpiutangpenjamin as tarifklaim',
                'spp.totalsudahdibayar',
                'r.namarekanan',
                'spp.totalbiaya',
                'spp.noverifikasi',
                'rkn.namarekanan',
                'pd.norec as norec_pd',
                'pd.tglpulang',
                'php.noposting',
                'spt.statusenabled',
                'bpjs.biayanaikkelas',
            'sbm.totaldibayar'
            )
            ->whereNull('sp.statusenabled');
        //            ->where('php.statusenabled',1);
        //            ->where('spp.kdrekananpenjamin', 0);


        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "") {
            $dataPiutang = $dataPiutang->where('pd.tglpulang', '>=', $filter['tglAwal']);
        }

        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "") {
            $tgl = $filter['tglAkhir'] . " 23:59:59";
            $dataPiutang = $dataPiutang->where('pd.tglpulang', '<=', $tgl);
        }

        if (isset($filter['instalasiId']) && $filter['instalasiId'] != "") {
            $dataPiutang = $dataPiutang->where('dept.id', '=', $filter['instalasiId']);
        }

        if (isset($filter['ruanganId']) && $filter['ruanganId'] != "") {
            $dataPiutang = $dataPiutang->where('ru.id', '=', $filter['ruanganId']);
        }

        if (isset($filter['kelompokpasienlastfk']) && $filter['kelompokpasienlastfk'] != "") {
            $dataPiutang = $dataPiutang->where('pd.objectkelompokpasienlastfk', '=', $filter['kelompokpasienlastfk']);
        }


        if (isset($filter['namaPasien']) && $filter['namaPasien'] != "") {
            $dataPiutang = $dataPiutang->where('p.namapasien', 'like', '%' . $filter['namaPasien'] . '%');
        }

        if (isset($filter['noReg']) && $filter['noReg'] != "") {
            $dataPiutang = $dataPiutang->where('pd.noregistrasi', 'like', '%' . $filter['noReg'] . '%');
        }

        if (isset($filter['status']) && $filter['status'] != "") {
            if ($filter['status'] == 'Verifikasi') {
                $dataPiutang = $dataPiutang->whereNotNull('spp.noverifikasi');
            }
            if ($filter['status'] == 'Belum Verifikasi') {
                $dataPiutang = $dataPiutang->whereNull('spp.noverifikasi');
            }
        }

        $dataPiutang = $dataPiutang->groupBy(
            'kp.kelompokpasien',
            'spp.norec',
            'sp.tglstruk',
            'pd.noregistrasi',
            'pd.tglregistrasi',
            'p.nocm',
            'p.namapasien',
            'spp.totalppenjamin',
            'spp.totalharusdibayar',
            'spp.totalsudahdibayar',
            'r.namarekanan',
            'spp.totalbiaya',
            'spp.noverifikasi',
            'rkn.namarekanan',
            'pd.norec',
            'pd.tglpulang',
            'php.noposting',
            'spt.statusenabled',
            'bpjs.totalpiutangpenjamin',
            'bpjs.biayanaikkelas', 
            'sbm.totaldibayar' 
        );
        $dataPiutang = $dataPiutang->orderBy('p.namapasien');
        //        $dataPiutang =$dataPiutang->take(50);
        $dataPiutang = $dataPiutang->get();
        //        dd($strukPelayanan->items());
        //        $data = $strukPelayanan->items();
        //        $result[] = array() ;
        $result = [];
        foreach ($dataPiutang as $item) {
            if ($item->statusenabled ==  1 || is_null($item->statusenabled)) {
                $statusVerifikasi = "Belum Diverifikasi";
                $isVerified = false;
                if ($item->noverifikasi != null) {
                    $statusVerifikasi = "Verifikasi";
                    $isVerified = true;
                }
                if ($item->tarifklaim == null) {
                    $tarifklaim = 0;
                    $selisihKlaim = 0;
                } else {
                    $tarifklaim = (float)$item->tarifklaim;
                    $selisihKlaim = (float)$item->biayanaikkelas;
                }
                $detailss = DB::select(
                    DB::raw("SELECT spd.norec,sp.nostrukfk,spd.totalppenjamin,kl.kelompokpasien,rek.namarekanan
					 from strukpelayananpenjamindetail_t as spd
					inner join strukpelayananpenjamin_t as sp on sp.norec= spd.strukpelayananpenjaminfk
					inner join kelompokpasien_m as kl on kl.id= spd.kdkelompokpasien
					inner join rekanan_m as rek on rek.id=spd.kdrekananpenjamin
					where spd.strukpelayananpenjaminfk=:norecStruk
	                "),
                    array(
                        'norecStruk' => $item->norec,
                    )
                );
                $result[] = array(
                    'noRec' => $item->norec,
                    'tglTransaksi' => $item->tglstruk,
                    'noRegistrasi' => $item->noregistrasi,
                    'namaPasien' => $item->namapasien,
                    'kelasRawat' => '-',
                    'jenisPasisen' => $item->kelompokpasien,
                    'kelasPenjamin' => "-", //ambilnya dari mana ?
                    'totalBilling' => $item->totalbiaya,
                    'totalKlaim' => $item->totalppenjamin,
                    'totalBayar' => $item->totalsudahdibayar,
                    'statusVerifikasi' => $statusVerifikasi,
                    'rekanan' => $item->namarekanan,
                    'norec_pd' => $item->norec_pd,
                    'tglpulang' => $item->tglpulang,
                    'isVerified' => $isVerified,
                    'noposting' => $item->noposting,
                    'tarifselisihklaim' => $selisihKlaim,
                    'tarifinacbgs' => $tarifklaim,
                    'verifikasi' => $item->noverifikasi,
                    'details' => $detailss


                );
            }
        }
        $dataKelompokPasien = \DB::table('kelompokpasien_m as rt')
            ->select('rt.id', 'rt.kelompokpasien')
            ->where('rt.statusenabled', true)
            ->orderBy('rt.kelompokpasien')
            ->get();

        $datadata = array(
            'data' =>   $result,
            'kelompokpasien' => $dataKelompokPasien,
        );
        return $this->respond($datadata, 'Data Daftar Pasien');
    }

    public function verifyPiutangPasien(Request $request)
    {
        $transMsg = null;
        DB::beginTransaction();
        try {
            $verifikasi = new StrukVerifikasi();
            $noVerif = $this->generateCode(new StrukVerifikasi, 'noverifikasi', 12, 'VP' . $this->getDateTime()->format('dmy'));
            $verifikasi->norec = $verifikasi->generateNewId();
            $verifikasi->kdprofile = $this->getKdProfile();
            $verifikasi->objectkelompoktransaksifk = 1; ///ambil dari datafixed pastinya
            $verifikasi->objectpegawaipjawabfk = 1;
            $verifikasi->objectruanganfk = 1; //ambil dari pegawai yang ada ruangankerja
            $verifikasi->namaverifikasi = "Verifikasi Piutang Penjamin";
            $verifikasi->noverifikasi = $noVerif; //$this->generateCode(new StrukVerifikasi, 'noverifikasi', 10, 'VP');
            $verifikasi->tglverifikasi = $this->getDateTime();
            $verifikasi->save();

            foreach ($request['dataPiutang'] as $norec) {
                $strukPelayanan = StrukPelayananPenjamin::where('norec', $norec)->first();
                if ($strukPelayanan) {
                    $strukPelayanan->noverifikasi = $verifikasi->noverifikasi;
                    $strukPelayanan->save();
                }
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = false;
            $transMsg = "Verifikasi Piutang Gagal";
        }

        //        if($transStatus){
        //            DB::commit();
        //            $transMsg = "Verifikasi Piutang Berhasil";
        //            return $this->setStatusCode(201)->respond([],$transMsg);
        //        }else{
        //            DB::rollBack();
        //            return $this->setStatusCode(400)->respond([],$transMsg);
        //        }

        if ($transStatus == 'true') {
            $transMessage = "Verifikasi Piutang Berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $verifikasi,
                'as' => 'epic',
            );
        } else {
            $transMessage = "Verifikasi Piutang Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'result' => $verifikasi,
                'as' => 'epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function cancelVerifyPiutangPasien(Request $request)
    {
        $transMsg = null;
        DB::beginTransaction();
        try {
            if (count($request['dataPiutang']) > 0) {
                foreach ($request['dataPiutang'] as $norec) {
                    $strukPelayanan = StrukPelayananPenjamin::where('norec', $norec)->first();
                    if ($strukPelayanan) {
                        $strukPelayanan->noverifikasi = null;
                        //                    $strukPelayanan->nostrukfk = null;
                        $strukPelayanan->save();
                    }
                }
            } else {
                $transStatus = false;
                $transMsg = "Transaksi Gagal (0)";
            }

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = false;
            $transMsg = "Unverifikasi Piutang Gagal";
        }

        if ($transStatus == 'true') {
            $transMessage = "Unverifikasi Piutang Berhasil";
            DB::commit();
            $result = array(
                'status' => 201,
                'message' => $transMessage,
                'result' => $strukPelayanan,
                'as' => 'epic',
            );
        } else {
            $transMessage = "Unverifikasi Piutang Gagal";
            DB::rollBack();
            $result = array(
                'status' => 400,
                'message'  => $transMessage,
                'result' => $strukPelayanan,
                'as' => 'epic',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    public function getNorecAPD(Request $request)
    {
        $filter = $request->all();
        $noreg = '';
        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
            $noreg = " AND pd.noregistrasi = '" .  $filter['noreg'] . "'";
        }
        $ruangId = '';
        if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
            $ruangId = ' AND apd.objectruanganfk = ' . $filter['ruangId'];
        }
        $namaRuangan = '';
        if (isset($filter['namaRuangan']) && $filter['namaRuangan'] != "" && $filter['namaRuangan'] != "undefined") {
            $ruangId = " AND ru.namaruangan like '%"  . $filter['namaRuangan'] . "%'";
        }
        $data = DB::select(
            DB::raw("select * from
                (select pd.tglregistrasi,pd.noregistrasi, ru.namaruangan,
                 pd.norec as norec_pd, apd.tglmasuk, apd.norec as norec_apd, 
                 row_number() over (partition by pd.noregistrasi order by apd.tglmasuk desc) as rownum 
                 from antrianpasiendiperiksa_t as apd
                 inner join pasiendaftar_t as pd on pd.norec = apd.noregistrasifk and pd.objectruanganlastfk = apd.objectruanganfk
                 left join batalregistrasi_t as br on br.pasiendaftarfk = pd.norec
                 inner join ruangan_m as ru on ru.id = apd.objectruanganfk
                 where br.norec is null 
                and pd.tglpulang is null --and pd.noregistrasi='1808010084'
                $ruangId $noreg  $namaRuangan
              ) as x where x.rownum=1")
        );
        return $this->respond($data);
    }

    public function simpanPemakaianAsuransi(Request $request)
    {
        DB::beginTransaction();

        try {
            if ($request['norec_pa'] != '') {
                $dataPA = PemakaianAsuransi::where('noregistrasifk', $request['norec'])
                    ->update([
                        'nokepesertaan' => $request['nokepesertaan'],
                        'nosep' => $request['nosep']
                    ]);
                $transMessage = "Update Pemakaian Asuransi berhasil!";
            } else {
                $pasienDaftar = PasienDaftar::where('norec', $request['norec'])->first();
                $pasien = Pasien::where('nocm', $request['nocm'])->first();
                $alamat = Alamat::where('nocmfk', $pasien->id)->first();
                $AsuransiPAsien = AsuransiPasien::where('nocmfk', $pasien->id)->first();
                if (empty($AsuransiPAsien)) {
                    $newId = AsuransiPasien::max('id');
                    $newId = $newId + 1;
                    $dataAP = new AsuransiPasien();
                    $dataAP->id = $newId;
                    $dataAP->kdprofile = 3;
                    $dataAP->statusenabled = true;
                    $dataAP->norec = $dataAP->generateNewId();
                    $dataAP->alamatlengkap = $alamat->alamatlengkap;
                    $dataAP->objecthubunganpesertafk = 1; //PESERTA
                    $dataAP->objectjeniskelaminfk = $pasien->objectjeniskelaminfk;
                    $dataAP->kdinstitusiasal = 2552; //BPJS KESEHATAN
                    $dataAP->notelpmobile = $pasien->notelepon;
                    //                    $dataAP->jenispeserta = $request['asuransipasien']['jenispeserta'];
                    $dataAP->kdprovider = '-';
                    $dataAP->nmprovider = '-';
                    $dataAP->kdpenjaminpasien = 2552;
                    $kelasdijamin = $pasienDaftar->objectkelasfk;
                    if ($pasienDaftar->objectkelasfk != 1 || $pasienDaftar->objectkelasfk != 2 || $pasienDaftar->objectkelasfk != 3) {
                        $kelasdijamin = 1;
                    }
                    $dataAP->objectkelasdijaminfk = $kelasdijamin;
                    $dataAP->namapeserta = $pasien->namapasien;
                    $dataAP->nikinstitusiasal = 2552;
                    $dataAP->noasuransi =  $request['nokepesertaan'];
                    $dataAP->nocmfk = $pasien->id;
                    $dataAP->noidentitas = $pasien->noidentitas;
                    //                    $dataAP->qasuransi = $request['asuransipasien']['qasuransi'];
                    $dataAP->tgllahir = $pasien->tgllahir;
                    $dataAP->save();
                    $idAP = $dataAP->id;
                } else {
                    $idAP = $AsuransiPAsien->id;
                }

                $dataPA = new PemakaianAsuransi();
                $dataPA->norec = $dataPA->generateNewId();;
                $dataPA->kdprofile = 3;
                $dataPA->statusenabled = true;
                $dataPA->noregistrasifk = $request['norec'];
                $dataPA->tglregistrasi = Carbon::now();
                //                $dataPA->diagnosisfk = $request['pemakaianasuransi']['diagnosisfk'];
                //                $dataPA->lakalantas = $request['pemakaianasuransi']['lakalantas'];
                $dataPA->nokepesertaan = $request['nokepesertaan'];
                //                $dataPA->norujukan = $request['pemakaianasuransi']['norujukan'];
                $dataPA->nosep = $request['nosep'];
                //                $dataPA->ppkrujukan = $request['asuransipasien']['kdprovider'];
                //                $dataPA->tglrujukan = $request['pemakaianasuransi']['tglrujukan'];
                $dataPA->objectasuransipasienfk = $idAP;
                //                $dataPA->objectdiagnosafk = $request['pemakaianasuransi']['objectdiagnosafk'];
                $dataPA->tanggalsep = Carbon::now();
                $dataPA->catatan = '-';
                //                $dataPA->lokasilakalantas =$request['pemakaianasuransi']['lokasilaka'];
                //                $dataPA->penjaminlaka =$request['pemakaianasuransi']['penjaminlaka'];

                /*** nu anyar Vclaim 1.1*/
                if (isset($request['pemakaianasuransi']['cob'])) {
                    $dataPA->cob = $request['pemakaianasuransi']['cob'];
                }
                if (isset($request['pemakaianasuransi']['katarak'])) {
                    $dataPA->katarak = $request['pemakaianasuransi']['katarak'];
                }
                if (isset($request['pemakaianasuransi']['keteranganlaka'])) {
                    $dataPA->keteranganlaka = $request['pemakaianasuransi']['keteranganlaka'];
                }
                if (isset($request['pemakaianasuransi']['tglkejadian'])) {
                    $dataPA->tglkejadian = $request['pemakaianasuransi']['tglkejadian'];
                }
                if (isset($request['pemakaianasuransi']['suplesi'])) {
                    $dataPA->suplesi = $request['pemakaianasuransi']['suplesi'];
                }
                if (isset($request['pemakaianasuransi']['nosepsuplesi'])) {
                    $dataPA->nosepsuplesi = $request['pemakaianasuransi']['nosepsuplesi'];
                }
                if (isset($request['pemakaianasuransi']['kdpropinsi'])) {
                    $dataPA->kdpropinsi = $request['pemakaianasuransi']['kdpropinsi'];
                }
                if (isset($request['pemakaianasuransi']['namapropinsi'])) {
                    $dataPA->namapropinsi = $request['pemakaianasuransi']['namapropinsi'];
                }
                if (isset($request['pemakaianasuransi']['kdkabupaten'])) {
                    $dataPA->kdkabupaten = $request['pemakaianasuransi']['kdkabupaten'];
                }
                if (isset($request['pemakaianasuransi']['namakabupaten'])) {
                    $dataPA->namakabupaten = $request['pemakaianasuransi']['namakabupaten'];
                }
                if (isset($request['pemakaianasuransi']['kdkecamatan'])) {
                    $dataPA->kdkecamatan = $request['pemakaianasuransi']['kdkecamatan'];
                }
                if (isset($request['pemakaianasuransi']['namakecamatan'])) {
                    $dataPA->namakecamatan = $request['pemakaianasuransi']['namakecamatan'];
                }
                if (isset($request['pemakaianasuransi']['nosuratskdp'])) {
                    $dataPA->nosuratskdp = $request['pemakaianasuransi']['nosuratskdp'];
                }
                if (isset($request['pemakaianasuransi']['kodedpjp'])) {
                    $dataPA->kodedpjp = $request['pemakaianasuransi']['kodedpjp'];
                }
                if (isset($request['pemakaianasuransi']['namadpjp'])) {
                    $dataPA->namadpjp = $request['pemakaianasuransi']['namadpjp'];
                }
                if (isset($request['pemakaianasuransi']['prolanisprb'])) {
                    $dataPA->prolanisprb = $request['pemakaianasuransi']['prolanisprb'];
                }
                /*** end nu anyar */
                $dataPA->save();
                $transMessage = "Save Pemakaian Asuransi berhasil!";
            }
            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Pemakaian Asuransi gagal";
        }

        if ($transStatus != 'false') {
            DB::commit();
            $result = array(
                "res" => $dataPA,
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

    public function getAntrianPasien(Request $request)
    {
        if ($request['objectruanganlastfk'] != "") {
            $noreg =  $request['noregistrasi'];
            $ruanganLast = $request['objectruanganlastfk'];
            $data = DB::select(DB::raw("
             select apd.norec as norec_apd,  ps.nocm,  ps.id as nocmfk,  ps.namapasien,  pd.noregistrasi,  apd.objectruanganfk, 
             ru.namaruangan,  apd.tglregistrasi,  kls.namakelas,  apd.objectruanganasalfk,
             row_number() over (partition by pd.noregistrasi order by apd.tglmasuk desc) as rownum
             from antrianpasiendiperiksa_t as apd
             inner join pasiendaftar_t as pd on pd.norec = apd.noregistrasifk
             left join ruangan_m as ru on ru.id = apd.objectruanganfk
             inner join pasien_m as ps on ps.id = pd.nocmfk
             inner join kelas_m as kls on kls.id = apd.objectkelasfk
             where pd.noregistrasi = '$noreg' and apd.objectruanganfk = '$ruanganLast'"));
            //                \DB::table('antrianpasiendiperiksa_t as apd')
            //                ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            //                ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            //                ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            //                ->join('kelas_m as kls', 'kls.id', '=', 'apd.objectkelasfk')
            //                ->select('apd.norec as norec_apd', 'ps.nocm', 'ps.id as nocmfk', 'ps.namapasien', 'pd.noregistrasi', 'apd.objectruanganfk',
            //                    'ru.namaruangan', 'apd.tglregistrasi', 'kls.namakelas', 'apd.objectruanganasalfk')
            //                ->where('pd.noregistrasi', $request['noregistrasi'])
            //                ->where('apd.objectruanganfk', $request['objectruanganlastfk'])
            ////            ->whereNull('apd.objectruanganasalfk')
            //                ->get();
        } else {
            $data = \DB::table('antrianpasiendiperiksa_t as apd')
                ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                ->join('kelas_m as kls', 'kls.id', '=', 'apd.objectkelasfk')
                ->select(
                    'apd.norec as norec_apd',
                    'ps.nocm',
                    'ps.id as nocmfk',
                    'ps.namapasien',
                    'pd.noregistrasi',
                    'apd.objectruanganfk',
                    'ru.namaruangan',
                    'apd.tglregistrasi',
                    'kls.namakelas',
                    'apd.objectruanganasalfk'
                )
                ->where('pd.noregistrasi', $request['noregistrasi'])
                //                ->where('apd.objectruanganfk', $request['objectruanganlastfk'])
                ->whereNull('apd.objectruanganasalfk')
                ->get();
        }


        $result = array(
            'data' => $data,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }

    public function getDaftarDepositPasien(Request $request)
    {
        $dataLogin = $request->all();
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->leftJoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pd.nostruklastfk')
            ->leftJoin('strukbuktipenerimaan_t as sbm', 'sbm.norec', '=', 'pd.nosbmlastfk')
            ->leftjoin('produk_m as prd', 'prd.id', '=', 'pp.produkfk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftJoin('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            ->leftjoin('loginuser_s as lu', 'lu.id', '=', 'sbm.objectpegawaipenerimafk')
            ->leftjoin('pegawai_m as pgs', 'pgs.id', '=', 'lu.objectpegawaifk')
            ->select(
                'pd.tglregistrasi',
                'ps.nocm',
                'pd.noregistrasi',
                'ru.namaruangan',
                'ps.namapasien',
                'kp.kelompokpasien',
                'pd.tglpulang',
                'pd.statuspasien',
                'sp.nostruk',
                'sbm.nosbm',
                'pg.id as pgid',
                'pg.namalengkap as namadokter',
                'pgs.namalengkap as kasir',
                'pp.produkfk',
                'apd.norec',
                DB::raw('sum(pp.hargasatuan) as totaldeposit')
            );



        $filter = $request->all();
        if (isset($filter['tglAwal']) && $filter['tglAwal'] != "" && $filter['tglAwal'] != "undefined") {
            $data = $data->where('pd.tglregistrasi', '>=', $filter['tglAwal']);
        }

        if (isset($filter['tglAkhir']) && $filter['tglAkhir'] != "" && $filter['tglAkhir'] != "undefined") {
            $tgl = $filter['tglAkhir']; //." 23:59:59";
            $data = $data->where('pd.tglregistrasi', '<=', $tgl);
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
            $data = $data->where('pd.noregistrasi', 'like', '%' . $filter['noreg'] . '%');
        }
        if (isset($filter['norm']) && $filter['norm'] != "" && $filter['norm'] != "undefined") {
            $data = $data->where('ps.nocm', 'like', '%' . $filter['norm'] . '%');
        }
        if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $data = $data->where('ps.namapasien', 'like', '%' . $filter['nama'] . '%');
        }

        $data = $data->where('prd.id', 402611);
        //        $data=$data->whereNotNull('sbm.nosbm');
        $data = $data->groupBy(
            'pd.norec',
            'pd.tglregistrasi',
            'ps.nocm',
            'pd.noregistrasi',
            'ru.namaruangan',
            'ps.namapasien',
            'kp.kelompokpasien',
            'pd.tglpulang',
            'pd.statuspasien',
            'sp.nostruk',
            'sbm.nosbm',
            'pg.id',
            'pg.namalengkap',
            'pgs.namalengkap',
            'pp.produkfk',
            'apd.norec'
        );
        $data = $data->orderBy('pd.noregistrasi');
        $data = $data->get();

        $result = [];
        foreach ($data as $item) {
            $details = DB::select(
                DB::raw("
                    select pp.tglpelayanan,pr.namaproduk,pp.hargadiscount,
                    pp.hargajual,pp.harganetto,pp.jumlah,pp.hargasatuan
                    from pelayananpasien_t as pp 
                    inner JOIN produk_m as pr on pr.id=pp.produkfk
                    where pp.noregistrasifk=:norec
                    and pr.id=402611"),
                array(
                    'norec' => $item->norec,
                )
            );
            $result[] = array(
                'tglregistrasi' => $item->tglregistrasi,
                'nocm' => $item->nocm,
                'noregistrasi' => $item->noregistrasi,
                'namaruangan' => $item->namaruangan,
                'namapasien' => $item->namapasien,
                'kelompokpasien' => $item->kelompokpasien,
                'tglpulang' => $item->tglpulang,
                'statuspasien' => $item->statuspasien,
                'nostruk' => $item->nostruk,
                'nosbm' => $item->nosbm,
                'pgid' => $item->pgid,
                'namadokter' => $item->namadokter,
                'kasir' => $item->kasir,
                'produkfk' => $item->produkfk,
                'norec' => $item->norec,
                'totaldeposit' => $item->totaldeposit,
                'details' => $details,
            );
        }
        $result = array(
            'daftar' => $result,
            'datalogin' => $dataLogin,
            'message' => 'ramdanegie',
        );

        return $this->respond($result);
    }

    public function getLapPasienDalamPerawatan(Request $request)
    {
        ini_set('max_execution_time', 1000); //6 minutes
        $dataLogin = $request->all();
        //        $tglAwal = $request['tglAwal'];
        //        $tglAkhir = $request['tglAkhir'];
        $paramIdRuang = '';
        $paramKelompokPasien = '';
        $paramNoregistrasi = '';
        $paramNoRM = '';
        $paramPasien = '';
        if (isset($request['ruangId']) && $request['ruangId'] != "" && $request['ruangId'] != "undefined") {
            $paramIdRuang = ' and ru.id=' . $request['ruangId'];
        }
        if (isset($request['kelId']) && $request['kelId'] != "" && $request['kelId'] != "undefined") {
            $paramKelompokPasien = ' and kp.id=' . $request['kelId'];
        }

        if (isset($request['noregistrasi']) && $request['noregistrasi'] != "" && $request['noregistrasi'] != "undefined") {
            $paramNoregistrasi = ' and pd.noregistrasi =' . $request['noregistrasi'];
        }
        if (isset($request['nocm']) && $request['nocm'] != "" && $request['nocm'] != "undefined") {
            $paramNoRM = " and ps.nocm like '%" . $request['nocm'] . "%'";
        }
        if (isset($request['namapasien']) && $request['namapasien'] != "" && $request['namapasien'] != "undefined") {
            $paramPasien = " and ps.namapasien like '%" . $request['namapasien'] . "%'";
        }
        $data = DB::select(DB::raw("
      
          SELECT DATEDIFF(day, pd.tglregistrasi,GETDATE()) AS hari,
                pd.tglregistrasi,pd.noregistrasi,ps.nocm,ps.namapasien,ru.namaruangan,kp.kelompokpasien,kls.namakelas,ps.tgllahir,
                sum((pp.hargasatuan * pp.jumlah) + case when pp.jasa is not null then pp.jasa else 0 end )as total,
                sUM(CASE WHEN (pp.produkfk = 402611) THEN pp.hargasatuan ELSE (0) END * pp.jumlah) AS deposit, 
                SUM(CASE WHEN (pp.hargadiscount IS NULL) THEN (0) ELSE pp.hargadiscount END) AS diskon,
                 sum((((pp.hargasatuan - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah) + case when pp.jasa is not null then pp.jasa else 0 end ) 
                 -(CASE WHEN (pp.produkfk = 402611) THEN pp.hargasatuan ELSE (0) END * pp.jumlah)) as totalkabeh
                FROM
                    pasiendaftar_t AS pd
                INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec
                inner join ruangan_m as ru on ru.id= pd.objectruanganlastfk
                inner join kelas_m as kls on kls.id= pd.objectkelasfk
                inner join kelompokpasien_m as kp on kp.id= pd.objectkelompokpasienlastfk
                inner join pasien_m as ps on ps.id= pd.nocmfk
                LEFT JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec
                WHERE
                
                 pd.tglpulang is null
                $paramIdRuang
                $paramKelompokPasien
                $paramNoregistrasi
                $paramNoRM
                $paramPasien
                GROUP BY pd.tglregistrasi,pd.noregistrasi,ps.nocm,kls.namakelas,ps.tgllahir,
                ps.namapasien,ru.namaruangan,kp.kelompokpasien
                order by pd.tglregistrasi"));
        //            $data = \DB::table('v_pasiendalamperawatan as v');


        $result = array(
            'data' => $data,
            'message' => 'inhuman',
        );
        return $this->respond($result);
    }

    public function getPasienBynorecpdapd($norec_pd, $norec_apd)
    {
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->leftjoin('alamat_m as alm', 'alm.nocmfk', '=', 'ps.id')
            ->leftjoin('pendidikan_m as pdd', 'pdd.id', '=', 'ps.objectpendidikanfk')
            ->leftjoin('pekerjaan_m as pk', 'pk.id', '=', 'ps.objectpekerjaanfk')
            ->leftjoin('kelompokpasien_m as kps', 'kps.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftjoin('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('departemen_m as dpm', 'dpm.id', '=', 'ru.objectdepartemenfk')
            ->leftjoin('pegawai_m as peg', 'peg.id', '=', 'pd.objectpegawaifk')
            ->leftjoin('pegawai_m as peg2', 'pe2g.id', '=', 'apd.objectpegawaifk')
            ->join('kelas_m as kls', 'kls.id', '=', 'apd.objectkelasfk')
            ->LEFTjoin('jenispelayanan_m as jpl', 'jpl.kodeinternal', '=', 'pd.jenispelayanan')
            ->select(
                'ps.nocm',
                'ps.id as nocmfk',
                'ps.noidentitas',
                'ps.namapasien',
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'jk.jeniskelamin',
                'ps.tgllahir',
                'alm.alamatlengkap',
                'pdd.pendidikan',
                'pk.pekerjaan',
                'ps.nohp as notelepon',
                'ps.objectjeniskelaminfk',
                'apd.objectruanganfk',
                'ru.namaruangan',
                'apd.norec as norec_apd',
                'pd.norec as norec_pd',
                'kps.kelompokpasien',
                'kls.namakelas',
                'apd.objectkelasfk',
                'pd.objectkelompokpasienlastfk',
                'pd.objectrekananfk',
                'rk.namarekanan',
                'pd.objectruanganlastfk',
                'jpl.jenispelayanan',
                'apd.objectasalrujukanfk',
                'ru.kdinternal',
                'jpl.kodeinternal as objectjenispelayananfk',
                'pd.objectpegawaifk',
                'pd.statuspasien',
                'ps.nobpjs',
                'pd.statuspasien',
                'apd.israwattitipan',
                'apd.objectpegawaifk',
                'peg2.namalengkap',
                DB::raw('case when ru.objectdepartemenfk in (16,35,17) then \'true\' else \'false\' end as israwatinap')
            )
            ->where('pd.norec', '=', $norec_pd)
            ->where('apd.norec', '=', $norec_apd)
            ->get();
        return $this->respond($data);
    }

    public function getDataComboOrder(Request $request)
    {


        $dataruangan  = \DB::table('ruangan_m as ru')
            ->select('ru.id', 'ru.namaruangan', 'ru.objectdepartemenfk')
            ->wherein('ru.objectdepartemenfk', array(3, 27))
            ->where('ru.statusenabled', true)
            ->orderBy('ru.namaruangan')
            ->get();

        $dataDokter = \DB::table('pegawai_m as dp')
            ->select('dp.id', 'dp.namalengkap')
            ->whereIn('dp.objectjenispegawaifk', array(1))
            ->where('dp.statusenabled', true)
            ->orderBy('dp.namalengkap')
            ->get();

        $result = array(
            'ruangantujuan' => $dataruangan,
            'dokter' => $dataDokter,
            'message' => 'inhuman',
        );
        return $this->respond($result);
    }
    public function getTindakanParts(Request $request)
    {
        //TODO : GET LIST TINDAKAN
        $req = $request->all();
        $data = \DB::table('mapruangantoproduk_m as mpr')
            //            ->join ('harganettoprodukbykelasd_m as hnpd','hnpd.objectprodukfk','=','mpr.objectprodukfk')
            ->join('produk_m as prd', 'prd.id', '=', 'mpr.objectprodukfk')
            //            ->join ('kelas_m as kls','kls.id','=','hnp.objectkelasfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'mpr.objectruanganfk')
            //            ->join ('suratkeputusan_m as sk', 'hnp.suratkeputusanfk','=','sk.id')
            //            ->select('mpr.objectprodukfk','prd.id','prd.namaproduk','hnp.hargasatuan','hnp.objectkelasfk',
            //                'kls.namakelas','mpr.objectruanganfk','ru.namaruangan',
            ->select(
                'mpr.objectprodukfk as id',
                'prd.namaproduk',
                'mpr.objectruanganfk',
                'prd.namaproduk'
            )
            ->where('mpr.objectruanganfk', $request['idRuangan'])
            //            ->wherein('ru.objectdepartemenfk',[27])
            //            ->where('hnp.objectkelasfk',$request['idKelas'])
            //           ->where('hnp.objectjenispelayananfk',$request['idJenisPelayanan'])
            //            ->where('mpr.statusenabled',true)
            //            ->where('hnp.statusenabled',true)
            //            ->where('sk.statusenabled',true)
            ->where('mpr.statusenabled', true)

            // ->where('sk.statusenabled',true)
            ->where('prd.statusenabled', true)
            // ->where('mpr.kodeexternal','2017')
            // ->where('hnp.kodeexternal', '2017')
        ;



        if (
            isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $data = $data
                ->where('prd.namaproduk', 'ilike', '%' . $req['filter']['filters'][0]['value'] . '%');
        }
        $data = $data->orderBy('prd.namaproduk', 'ASC');
        $data = $data->take(15);
        $data = $data->get();
        // $result = array(
        //     'data' => $data,
        //     'message' => 'ramdanegie',
        // );


        return $this->respond($data);
    }
    public function getTindakanOrderPenunjang(Request $request)
    {
        //TODO : GET LIST TINDAKAN
        $req = $request->all();
        $data = \DB::table('mapruangantoproduk_m as mpr')
            //            ->join ('harganettoprodukbykelasd_m as hnpd','hnpd.objectprodukfk','=','mpr.objectprodukfk')
            ->join('produk_m as prd', 'prd.id', '=', 'mpr.objectprodukfk')
            //            ->join ('kelas_m as kls','kls.id','=','hnp.objectkelasfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'mpr.objectruanganfk')
            //            ->join ('suratkeputusan_m as sk', 'hnp.suratkeputusanfk','=','sk.id')
            //            ->select('mpr.objectprodukfk','prd.id','prd.namaproduk','hnp.hargasatuan','hnp.objectkelasfk',
            //                'kls.namakelas','mpr.objectruanganfk','ru.namaruangan',
            ->select(
                'mpr.objectprodukfk as id',
                'prd.namaproduk',
                'mpr.objectruanganfk',
                'prd.namaproduk'
            )
            ->where('mpr.objectruanganfk', $request['idRuangan'])
            //            ->wherein('ru.objectdepartemenfk',[27])
            //            ->where('hnp.objectkelasfk',$request['idKelas'])
            //           ->where('hnp.objectjenispelayananfk',$request['idJenisPelayanan'])
            //            ->where('mpr.statusenabled',true)
            //            ->where('hnp.statusenabled',true)
            //            ->where('sk.statusenabled',true)
            ->where('mpr.statusenabled', true)

            // ->where('sk.statusenabled',true)
            ->where('prd.statusenabled', true)
            // ->where('mpr.kodeexternal','2017')
            // ->where('hnp.kodeexternal', '2017')
        ;



        if (
            isset($req['filter']['filters'][0]['value']) &&
            $req['filter']['filters'][0]['value'] != "" &&
            $req['filter']['filters'][0]['value'] != "undefined"
        ) {
            $data = $data
                ->where('prd.namaproduk', 'like', '%' . $req['filter']['filters'][0]['value'] . '%');
        }
        $data = $data->orderBy('prd.namaproduk', 'ASC');
        $data = $data->take(15);
        $data = $data->get();
        // $result = array(
        //     'data' => $data,
        //     'message' => 'ramdanegie',
        // );


        return $this->respond($data);
    }


    public function getDataLaporanPendapatanPerkelas(Request $request)
    {
        $dataLogin = $request->all();

        $data = \DB::table('pasiendaftar_t AS pd')
            ->LEFTJOIN('antrianpasiendiperiksa_t AS apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->LEFTJOIN('pelayananpasien_t AS pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->JOIN('produk_m AS pro', 'pro.id', '=', 'pp.produkfk')
            ->LEFTJOIN('kelas_m AS kls', 'kls.id', '=', 'apd.objectkelasfk')
            ->LEFTJOIN('detailjenisproduk_m AS djp', 'djp.id', '=', 'pro.objectdetailjenisprodukfk')
            ->LEFTJOIN('jenisproduk_m AS jp', 'jp.id', '=', 'djp.objectjenisprodukfk')
            ->LEFTJOIN('kelompokproduk_m AS kp', 'kp.id', '=', 'jp.objectkelompokprodukfk')
            ->LEFTJOIN('ruangan_m AS ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->LEFTJOIN('departemen_m AS dp', 'dp.id', '=', 'ru.objectdepartemenfk')
            ->JOIN('pasien_m as ps', 'pd.nocmfk', '=', 'ps.id')
            ->select(
                'ps.nocm',
                'ps.namapasien',
                'pd.noregistrasi',
                'ru.namaruangan',
                'kls.namakelas',
                'pro.namaproduk',
                'pp.hargadiscount',
                'kls.namakelas',
                DB::raw('case when djp.id in (58,149,155,161,167,476,477,1435,1440,1539) then sum( pp.jumlah * pp.hargajual) else 0 end as akomodasi,
                        case when djp.id in (58,149,155,161,167,476,477,1435,1440,1539) then sum(pp.jumlah) else 0 end as volakomodasi,
                        case when djp.id=1540 then sum( pp.jumlah * pp.hargajual)else 0 end as visit,
                        case when djp.id=1540 then sum(pp.jumlah)else 0 end as volvisit,
                        case when djp.id in (1408,1462) then sum( pp.jumlah * pp.hargajual)else 0 end as sewaalat,
                        case when djp.id in (1408,1462) then sum( pp.jumlah)else 0 end as volsewaalat,
                        case when djp.id not in (58,149,155,161,167,476,477,1435,1440,1539,1540,1408,1462,1522) then sum( pp.jumlah * pp.hargajual) else 0 end AS tindakan,
                        case when djp.id not in (58,149,155,161,167,476,477,1435,1440,1539,1540,1408,1462,1522) then sum( pp.jumlah) else 0 end AS voltindakan,
                        case when djp.id =1522 then sum( pp.jumlah * pp.hargajual) else 0 end AS konsultasi,
                        case when djp.id =1522 then sum( pp.jumlah) else 0 end AS volkonsultasi,
                        ((case when djp.id in (58,149,155,161,167,476,477,1435,1440,1539) then sum( pp.jumlah * pp.hargajual) else 0 end)       
                        +(case when djp.id=1540 then sum( pp.jumlah * pp.hargajual)else 0 end) 
                        +(case when djp.id in (1408,1462) then sum( pp.jumlah * pp.hargajual)else 0 end )
                         +(case when djp.id not in (58,149,155,161,167,476,477,1435,1440,1539,1540,1408,1462,1522) then sum( pp.jumlah * pp.hargajual) else 0 end)
                          + case when djp.id =1522 then sum( pp.jumlah * pp.hargajual) else 0 end ) * 0.05 as adm,
                         ((case when djp.id in (58,149,155,161,167,476,477,1435,1440,1539) then sum( pp.jumlah * pp.hargajual) else 0 end)       
                        +(case when djp.id=1540 then sum( pp.jumlah * pp.hargajual)else 0 end) 
                        +(case when djp.id in (1408,1462) then sum( pp.jumlah * pp.hargajual)else 0 end )
                         +(case when djp.id not in (58,149,155,161,167,476,477,1435,1440,1539,1540,1408,1462,1522) then sum( pp.jumlah * pp.hargajual) else 0 end)
                          + (case when djp.id =1522 then sum( pp.jumlah * pp.hargajual) else 0 end))
                          +((case when djp.id in (58,149,155,161,167,476,477,1435,1440,1539) then sum( pp.jumlah * pp.hargajual) else 0 end)       
                        +(case when djp.id=1540 then sum( pp.jumlah * pp.hargajual)else 0 end) 
                        +(case when djp.id in (1408,1462) then sum( pp.jumlah * pp.hargajual)else 0 end )
                         +(case when djp.id not in (58,149,155,161,167,476,477,1435,1440,1539,1540,1408,1462,1522) then sum( pp.jumlah * pp.hargajual) else 0 end)
                          +  (case when djp.id =1522 then sum( pp.jumlah * pp.hargajual) else 0 end))* 0.05 as total
                       ')
            );
        //            ->whereIn('jp.id', [25, 99, 101, 102, 27666])
        //            ->Where('djp.objectjenisprodukfk', '<>', 97)
        //            ->whereNotIn('pro.id',[10011572,10011571,402611]);

        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $data = $data->where('pp.tglpelayanan', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tgl = $request['tglAkhir']; //." 23:59:59";
            $data = $data->where('pp.tglpelayanan', '<=', $tgl);
        }

        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
            $data = $data->where('ru.id', '=', $request['idRuangan']);
        }
        if (isset($request['kelompokPasien']) && $request['kelompokPasien'] != "" && $request['kelompokPasien'] != "undefined") {
            $data = $data->where('kp.id', '=', $request['kelompokPasien']);
        }
        if (isset($request['kelas']) && $request['kelas'] != "" && $request['kelas'] != "undefined") {
            $data = $data->where('kls.id', '=', $request['kelas']);
        }
        $data = $data->groupBy(
            'jp.id',
            'ps.nocm',
            'ps.namapasien',
            'pd.noregistrasi',
            'pp.hargadiscount',
            'ru.namaruangan',
            'kls.namakelas',
            'kls.namakelas',
            'pro.namaproduk',
            'djp.id'
        );

        $data = $data->orderBy('pd.noregistrasi', 'ASC');
        $data = $data->get();

        $result = array(
            'data' => $data,
            'message' => 'egie@glory',
        );
        return $this->respond($result);
    }

    public function getDataLaporanVolumeKegiatan(Request $request)
    {
        $data = [];
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $ruanganId = $request['ruanganId'];
        $paramRuangan = ' ';
        if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
            $paramRuangan = ' and pd.objectruanganlastfk = ' . $ruanganId;
        }

        $deptRawatJalan = $this->settingDataFixed('kdDepartemenRawatJalanFix');

        $dataLogin = $request->all();
        $data = DB::select(DB::raw("select [pd].[noregistrasi],kmp.namaexternal, 
            [ru].[namaruangan], 
            [kls].[namakelas] as [namakelas], 
            [pro].[namaproduk], 
            case when djp.id in (58,476,477,1435,1440,1539) then 'Akomodasi' 
            when djp.id in (481,1540) then 'Visit' 
            when djp.id not in (58,476,477,1435,1440,1539,481,1540) then 'Tindakan' end as jenisproduk,
            pp.hargajual, pp.jumlah, pp.hargajual*pp.jumlah as total 
            from [pasiendaftar_t] as [pd] 
            left join [antrianpasiendiperiksa_t] as [apd] on [apd].[noregistrasifk] = [pd].[norec] 
            left join [pelayananpasien_t] as [pp] on [pp].[noregistrasifk] = [apd].[norec] 
            inner join [produk_m] as [pro] on [pro].[id] = [pp].[produkfk] 
            left join [kelas_m] as [kls] on [kls].[id] = [apd].[objectkelasfk] 
            left join [detailjenisproduk_m] as [djp] on [djp].[id] = [pro].[objectdetailjenisprodukfk] 
            left join [jenisproduk_m] as [jp] on [jp].[id] = [djp].[objectjenisprodukfk] 
            left join [kelompokproduk_m] as [kp] on [kp].[id] = [jp].[objectkelompokprodukfk] 
            left join [ruangan_m] as [ru] on [ru].[id] = [apd].[objectruanganfk]
            left join [departemen_m] as [dp] on [dp].[id] = [ru].[objectdepartemenfk] 
            INNER JOIN kelompokpasien_m as kmp on kmp.id = pd.objectkelompokpasienlastfk 
            where pp.strukresepfk is NULL
            AND  [pp].[tglpelayanan] >= '$tglAwal' 
            and [pp].[tglpelayanan] <= '$tglAkhir'
            and ru.objectdepartemenfk in ($deptRawatJalan)
                $paramRuangan "));

        //        $data = \DB::table('pasiendaftar_t as pd')
        ////           ->JOIN('strukpelayanandetail_t as spd','spd.nostrukfk','=','sp.norec')
        //            ->LEFTJOIN('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
        //            ->LEFTJOIN('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
        //            ->JOIN('produk_m as pro', 'pro.id', '=', 'pp.produkfk')
        //            ->LEFTJOIN('kelas_m as kls', 'kls.id', '=', 'apd.objectkelasfk')
        //            ->LEFTJOIN('detailjenisproduk_m as djp', 'djp.id', '=', 'pro.objectdetailjenisprodukfk')
        //            ->LEFTJOIN('jenisproduk_m as jp', 'jp.id', '=', 'djp.objectjenisprodukfk')
        //            ->LEFTJOIN('kelompokproduk_m as kp', 'kp.id', '=', 'jp.objectkelompokprodukfk')
        //            ->LEFTJOIN('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
        //            ->LEFTJOIN('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
        //            ->select('pd.noregistrasi', 'ru.namaruangan', 'kls.namakelas as namakelas',
        //                'pro.namaproduk',
        //                DB::raw('case when jp.id in (99,25) then \'Akomodasi\' when jp.id=101 then \'Visit\' when jp.id =102 then \'Tindakan\' end as jenisproduk,
        //                     pp.hargajual, pp.jumlah, pp.hargajual*pp.jumlah as total')
        //            )
        //            ->where('djp.objectjenisprodukfk', '<>', '97')
        ////          ->where('dp.id','=','14')
        //            ->wherein('jp.id', ['25', '99', '101', '102']);

        //        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
        //            $data = $data->where('pp.tglpelayanan', '>=', $request['tglAwal']);
        //        }
        //        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
        //            $tgl = $request['tglAkhir'];
        //            $data = $data->where('pp.tglpelayanan', '<=', $tgl);
        //        }
        //        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
        //            $data = $data->where('dp.id', '=', $request['idDept']);
        //        }

        //        $data = $data->orderBy('pd.noregistrasi');
        //
        //        $data = $data->get();
        //
        ////        $data=$data->groupby ('sp.totalharusdibayar','sp.totalprekanan','kp.kelompokpasien','spp.norec',
        ////            'stp.tglposting','pd.noregistrasi','pd.tglregistrasi','p.nocm','p.namapasien',
        ////            'ru.namaruangan','pr.id','pp.hargajual','pp.jumlah','pp.hargadiscount','kpr.id',
        ////            'pr.objectdetailjenisprodukfk', 'spp.totalppenjamin','spp.totalharusdibayar',
        ////            'spp.totalsudahdibayar','r.namarekanan','spp.totalbiaya','spp.noverifikasi',
        ////            'php.noposting','stp.kdhistorylogins');
        //
        //
        //        $result = array(
        //            'data' => $data,
        //            'message' => '@vandrian',
        //        );

        //        foreach ($data as $item){
        //            $details = DB::select(DB::raw("
        //                    select spd.tglpelayanan, spd.resepke,jkm.jeniskemasan,pr.namaproduk,
        //                    ss.satuanstandar,spd.qtyproduk,spd.hargasatuan,spd.hargadiscount,
        //                    spd.hargatambahan,((spd.hargasatuan-spd.hargadiscount)*spd.qtyproduk)+spd.hargatambahan as total
        //                    from strukpelayanandetail_t as spd
        //                    left JOIN produk_m as pr on pr.id=spd.objectprodukfk
        //                    left JOIN jeniskemasan_m as jkm on jkm.id=spd.objectjeniskemasanfk
        //                    left JOIN satuanstandar_m as ss on ss.id=spd.objectsatuanstandarfk
        //                    where nostrukfk=:norec"),
        //                array(
        //                    'norec' => $item->norec,
        //                )
        //            );
        //            $result[] = array(
        //                'tglstruk' => $item->tglstruk,
        //                'nostruk' => $item->nostruk,
        //                'nostruk_intern' => $item->nostruk_intern,
        //                'namapasien_klien' => $item->namapasien_klien,
        //                'namalengkap' => $item->namalengkap,
        //                'norec' => $item->norec,
        //                'namaruangan' => $item->namaruangan,
        //                'noteleponfaks' => $item->noteleponfaks,
        //                'namatempattujuan' => $item->namatempattujuan,
        //                'nosbm' => $item->nosbm,
        //                'details' => $details,
        //            );
        //        }
        //
        //        $result = array(
        //            'daftar' => $result,
        //            'datalogin' => $dataLogin,
        //            'message' => 'as@epic',
        //        );
        return $this->respond($data);
    }

    public function getLaporanRehab(Request $request)
    {
        //$lastdate = DB::select(DB::raw("Select DATEADD(day, -1, DATEADD(month, +1, ".$request['tanggal']."))"));

        //        $lastdate = \DB::table('kalender_s')
        //            ->select(DB::raw("(date_trunc('month', tanggal::date) + interval '1 month' - interval '1 day')::date ||' 23:59' as tgl"))
        //            ->Where('tanggal','=',$request->tanggal)
        //            ->get();
        $tglawal = $request['tanggal'];
        $data = \DB::table('pasiendaftar_t as pd')
            ->leftJOIN('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftJOIN('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->leftJOIN('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftJOIN('departemen_m as dp', 'dp.id', '=', 'ru.objectdepartemenfk')
            ->leftJOIN('ruangan_m as ru2', 'ru2.id', '=', 'apd.objectruanganfk')
            ->leftJOIN('departemen_m as dp2', 'dp2.id', '=', 'ru2.objectdepartemenfk')
            ->leftJOIN('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->leftJOIN('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
            ->leftJOIN('kelompokpasien_m as kps', 'kps.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftJOIN('strukpelayanan_t as sp', 'sp.noregistrasifk', '=', 'pd.norec')
            ->select(
                'kps.kelompokpasien',
                'pr.namaproduk',
                DB::raw(
                    'case when pp.hargajual is not null then pp.hargajual else 0 end as harga,
                    sum(pp.jumlah) as jumlah,
                    sum(pp.hargajual*pp.jumlah) as subtotal'
                )
            )
            ->whereNull('sp.statusenabled')
            ->whereRaw("format(pp.tglpelayanan,'yyyy-MM') ='$tglawal'")
            ->Where('pr.objectdepartemenfk', '=', 28)
            ->Where('ru2.objectdepartemenfk', '=', 28);

        //        if (isset($request['tanggal']) && $request['tanggal'] != "" && $request['tanggal'] != "undefined") {
        //            $tgl = $request['tanggal']." 00:00:00";
        //            $data = $data->whereraw('rawpp.tglpelayanan', '>=', "'$tgl'");
        //        }
        //        if (isset($request['tanggal']) && $request['tanggal'] != "" && $request['tanggal'] != "undefined") {
        //            $tglAkhir = $request['tanggal']." 23:59:59";
        //            $data = $data->where('pp.tglpelayanan', '<=', "DATEADD(day, -1, DATEADD(month, +1, '$tglAkhir'))");
        //        }
        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined" && $request['idDept'] && $request['idDept'] == 16) {
            $data = $data->whereIn('dp.id', [16, 28]);
        }
        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined" && $request['idDept'] && $request['idDept'] == 18) {
            $data = $data->whereIn('dp.id', [18, 28]);
        }
        $data = $data->groupBy('kps.kelompokpasien', 'pr.namaproduk', 'pp.hargajual');
        $data = $data->orderBy('kps.kelompokpasien');
        $data = $data->get();

        $results = array();
        foreach ($data as $item) {
            $results[] = array(
                'kelompokpasien' => $item->kelompokpasien,
                'layanan' => $item->namaproduk,
                'harga' => $item->harga,
                'jumlah' => $item->jumlah,
                'subtotal' => $item->subtotal,
            );
        }

        $result = array(
            'data' => $results,
            'message' => 'mn@epic',
        );

        return $this->respond($result);
    }


    public function getDataLaporanDiagnosaPasien(Request $request)
    {
        $data = [];
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $deptId = $request['idDept'];
        $ruanganId = $request['idRuangan'];
        $idJenisDiagnosa = $request['idJenisDiagnosa'];
        $diagnosaId = $request['idDiagnosa'];
        $rekananId = $request['RekananPasien'];
        $kelompokPasien = $request['kelompokPasien'];
        $kelompokPasien1 = "";
        $listDiagnosa = $request['listDiagnosa'];
        $kesatuanId = $request['KesatuanPasien'];
        $paramDep = ' ';
        if (isset($deptId) && $deptId != "" && $deptId != "undefined") {
            $paramDep = ' and ru.objectdepartemenfk = ' . $deptId;
        }

        $paramRuangan = ' ';
        if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
            $paramRuangan = ' and ru.id = ' . $ruanganId;
        }

        $paramJenisDiagnosa = ' ';
        if (isset($idJenisDiagnosa) && $idJenisDiagnosa != "" && $idJenisDiagnosa != "undefined") {
            $paramJenisDiagnosa = ' and jd.id = ' . $idJenisDiagnosa;
        }

        $paramDiagnosa = ' ';
        if (isset($diagnosaId) && $diagnosaId != "" && $diagnosaId != "undefined") {
            $paramDiagnosa = ' and dm.id = ' . $diagnosaId;
        }
        $paramKelompokPasien = ' ';
        if (isset($kelompokPasien) && $kelompokPasien != "" && $kelompokPasien != "undefined") {
            $paramKelompokPasien = ' and jkm.id = ' . $kelompokPasien;
        }
        $paramKelompokPasien1 = "";
        if (isset($request['kelompokPasien1']) && $request['kelompokPasien1'] != "" && $request['kelompokPasien1'] != "undefined") {
            $paramKelompokPasien1 = " and pd.objectkelompokpasienlastfk = '$request[kelompokPasien1]' ";
        }
        $paramRekanan = '';
        if (isset($rekananId) && $rekananId != "" && $rekananId != "undefined") {
            $paramRekanan = ' and rk.id = ' . $rekananId;
        }
        $paramKdDiagnosa = '';
        if (isset($listDiagnosa) && $listDiagnosa != "" && $listDiagnosa != "undefined") {
            $paramKdDiagnosa = ' and dm.id in (' . $listDiagnosa . ')';
        }
        $paramKesatuan = '';
        if (isset($kesatuanId) && $kesatuanId != "" && $kesatuanId != "undefined") {
            $paramKesatuan = ' and pm.objectkesatuanfk = ' . $kesatuanId;
        }

        $data = DB::select(DB::raw("select pd.tglregistrasi,pd.tglpulang,pm.objectjeniskelompokpasienfk,jkm.jeniskelompokpasien,pm.nocm,pd.noregistrasi,pm.namapasien,pm.tgllahir,
        jk.reportdisplay as jeniskelamin,case when sk.statuskeluar is null then '-' else sk.statuskeluar end as statuskeluar,
        case when sp.statuspulang is null then '-' else sp.statuspulang end as statuspulang,ru.namaruangan,
        (case when pg.namalengkap is not null then pg.namalengkap when pg1.namalengkap is not null then pg1.namalengkap else '-' end) as namadokter,
        case when jd.jenisdiagnosa is null then '-' else jd.jenisdiagnosa end as jenisdiagnosa,
        case when dm.namadiagnosa = '-' then '-, ' || ddp.keterangan else dm.kddiagnosa || ', ' || dm.namadiagnosa end as namadiagnosa,
        pm.notelepon || '/' || pm.nohp as notelepon,
        rk.namarekanan, CASE WHEN dp.iskasusbaru = true THEN 'Baru' WHEN dp.iskasuslama= true THEN 'Lama' ELSE 'Tidak DiIsi' END AS status, kp.kesatuanpasien, skp.satuankerjapasien, pkt.namapangkat, pm.nrp, alm.alamatlengkap
        from pasiendaftar_t as pd
        INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
        LEFT JOIN detaildiagnosapasien_t as ddp on ddp.noregistrasifk = apd.norec
        LEFT JOIN diagnosapasien_t as dp on dp.norec = ddp.objectdiagnosapasienfk
        INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
        LEFT JOIN jeniskelompokpasien_m as jkm on jkm.id = pm.objectjeniskelompokpasienfk
        LEFT JOIN jeniskelamin_m as jk on jk.id = pm.objectjeniskelaminfk
        INNER JOIN diagnosa_m as dm on dm.id = ddp.objectdiagnosafk
        LEFT JOIN jenisdiagnosa_m as jd on jd.id = ddp.objectjenisdiagnosafk
        LEFT JOIN pegawai_m as pg on pg.id = apd.objectpegawaifk
        LEFT JOIN pegawai_m as pg1 on pg1.id = pd.objectpegawaifk
        LEFT JOIN rekanan_m as rk on rk.id = pd.objectrekananfk
        INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk
        LEFT JOIN statuskeluar_m as sk on sk.id = pd.objectstatuskeluarfk
        LEFT JOIN statuspulang_m as sp on sp.id = pd.objectstatuspulangfk
        LEFT JOIN batalregistrasi_t as br on br.pasiendaftarfk = pd.norec
        LEFT JOIN kesatuanpasien_m as kp on kp.id = pm.objectkesatuanfk
        LEFT JOIN satuankerjapasien_m as skp on skp.id = pm.objectsatuankerjafk
        LEFT JOIN pangkat_m as pkt on pkt.id = pm.pangkatpolisi
        LEFT JOIN alamat_m as alm on alm.nocmfk = pm.id
        WHERE br.pasiendaftarfk is null and pd.tglregistrasi between '$tglAwal' and '$tglAkhir'
                $paramDep 
                $paramRuangan 
                $paramJenisDiagnosa 
                $paramDiagnosa 
                $paramKelompokPasien 
                $paramRekanan
                $paramKelompokPasien1
                $paramKdDiagnosa
                $paramKesatuan "));

        $result = array(
            'data' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }


    public function getDataLaporanDiagnosaPasienRekap(Request $request)
    {
        $detail = [];
        $data = [];
        $satu = "123123123";
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $deptId = $request['idDept'];
        $ruanganId = $request['idRuangan'];
        $idJenisDiagnosa = $request['idJenisDiagnosa'];
        $diagnosaId = $request['idDiagnosa'];
        $rekananId = $request['RekananPasien'];
        $kelompokPasien = $request['kelompokPasien'];
        $kelompokPasien1 = "";
        $listDiagnosa = $request['listDiagnosa'];
        $paramDep = ' ';
        if (isset($deptId) && $deptId != "" && $deptId != "undefined") {
            $paramDep = ' and ru.objectdepartemenfk = ' . $deptId;
        }

        $paramRuangan = ' ';
        if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
            $paramRuangan = ' and ru.id = ' . $ruanganId;
        }

        $paramJenisDiagnosa = ' ';
        if (isset($idJenisDiagnosa) && $idJenisDiagnosa != "" && $idJenisDiagnosa != "undefined") {
            $paramJenisDiagnosa = ' and jd.id = ' . $idJenisDiagnosa;
        }

        $paramDiagnosa = ' ';
        if (isset($diagnosaId) && $diagnosaId != "" && $diagnosaId != "undefined") {
            $paramDiagnosa = ' and dm.id = ' . $diagnosaId;
        }
        $paramKelompokPasien = ' ';
        if (isset($kelompokPasien) && $kelompokPasien != "" && $kelompokPasien != "undefined") {
            $paramKelompokPasien = ' and jkm.id = ' . $kelompokPasien;
        }
        $paramKelompokPasien1 = "";
        if (isset($request['kelompokPasien1']) && $request['kelompokPasien1'] != "" && $request['kelompokPasien1'] != "undefined") {
            $paramKelompokPasien1 = " and pd.objectkelompokpasienlastfk = '$request[kelompokPasien1]' ";
        }
        $paramRekanan = '';
        if (isset($rekananId) && $rekananId != "" && $rekananId != "undefined") {
            $paramRekanan = ' and rk.id = ' . $rekananId;
        }
        $paramKdDiagnosa = '';
        if (isset($listDiagnosa) && $listDiagnosa != "" && $listDiagnosa != "undefined") {
            $paramKdDiagnosa = ' and dm.id in (' . $listDiagnosa . ')';
        }

        $data = DB::select(DB::raw("select SUM(x.jumlah) as jumlah, x.kddiagnosa, x.namadiagnosa, SUM(x.baru) as baru, SUM(x.lama) as lama, SUM(x.tidakdiisi) as tidakdiisi FROM 
                (select COUNT(dp.norec) AS jumlah,
                dm.kddiagnosa, dm.namadiagnosa, dm.id,
                SUM(CASE WHEN dp.iskasusbaru= true THEN 1 ELSE 0 END) AS baru,
                SUM(CASE WHEN dp.iskasuslama= true THEN 1 ELSE 0 END) AS lama,
                SUM(CASE WHEN dp.iskasusbaru IS NULL AND dp.iskasuslama IS NULL THEN 1 ELSE 0 END) AS tidakdiisi
                from pasiendaftar_t as pd
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                LEFT JOIN detaildiagnosapasien_t as ddp on ddp.noregistrasifk = apd.norec
                LEFT JOIN diagnosapasien_t as dp on dp.norec = ddp.objectdiagnosapasienfk
                INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
                LEFT JOIN jeniskelompokpasien_m as jkm on jkm.id = pm.objectjeniskelompokpasienfk
                LEFT JOIN jeniskelamin_m as jk on jk.id = pm.objectjeniskelaminfk
                INNER JOIN diagnosa_m as dm on dm.id = ddp.objectdiagnosafk
                LEFT JOIN jenisdiagnosa_m as jd on jd.id = ddp.objectjenisdiagnosafk
                LEFT JOIN pegawai_m as pg on pg.id = apd.objectpegawaifk
                LEFT JOIN pegawai_m as pg1 on pg1.id = pd.objectpegawaifk
                LEFT JOIN rekanan_m as rk on rk.id = pd.objectrekananfk
                INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk
                LEFT JOIN statuskeluar_m as sk on sk.id = pd.objectstatuskeluarfk
                LEFT JOIN statuspulang_m as sp on sp.id = pd.objectstatuspulangfk
                LEFT JOIN batalregistrasi_t as br on br.pasiendaftarfk = pd.norec
                WHERE br.pasiendaftarfk is null and pd.tglregistrasi between '$tglAwal' and '$tglAkhir'
                $paramDep 
                $paramRuangan 
                $paramJenisDiagnosa 
                $paramDiagnosa 
                $paramKelompokPasien 
                $paramRekanan
                $paramKelompokPasien1
                $paramKdDiagnosa
                GROUP BY dm.namadiagnosa, dm.kddiagnosa, dp.iskasusbaru, dp.iskasuslama,dm.id) as x 
                GROUP BY x.namadiagnosa, x.kddiagnosa ORDER BY jumlah DESC
                "));
        $jumlah = 0;
        $baru = 0;
        $lama = 0;
        $tidakdiisi = 0;
        $masuk = false;
        $x = 0;
        $asiap = false;
        $hiji = true;
        // return($data);
        // die();
        // foreach($data as $item) {
        //     $asiap = true;
        //     $x += 1;
        //     if($satu == $item->kddiagnosa) {
        //         $jumlah =  $jumlah  + (int)$item->jumlah;
        //         $kddiagnosa = $item->kddiagnosa;
        //         $baru = $baru + (int)$item->baru;
        //         $lama = $lama + (int)$item->lama;
        //         $namadiagnosa = $item->namadiagnosa;
        //         $tidakdiisi = $tidakdiisi + (int)$item->tidakdiisi;
        //     } else {
        //         $asiap = false;
        //         if($jumlah > 0) {
        //             $detail[] = array(
        //                 'jumlah' => (int)$item->jumlah,
        //                 'kddiagnosa' => $item->kddiagnosa,
        //                 'baru' => (int)$item->baru,
        //                 'lama' => (int)$item->lama,
        //                 'namadiagnosa' => $item->namadiagnosa,
        //                 'tidakdiisi' => (int)$item->tidakdiisi
        //             );
        //         }
        //         $satu = $item->kddiagnosa;
        //         $jumlah = (int)$item->jumlah;
        //         $baru = (int)$item->baru;
        //         $lama = (int)$item->lama;
        //         $tidakdiisi = (int)$item->tidakdiisi;
        //     }
        //     // return($x);
        //     // die();
        //     if(count($data) == $x && $asiap == true) {

        //         $detail[] = array(
        //             'jumlah' => (int)$jumlah,
        //             'kddiagnosa' => $item->kddiagnosa,
        //             'baru' => (int)$baru,
        //             'lama' => (int)$lama,
        //             'namadiagnosa' => $item->namadiagnosa,
        //             'tidakdiisi' => (int)$tidakdiisi
        //         );
        //     }
        // }

        foreach ($data as $item) {
            $detail[] = array(
                'jumlah' => (int)$item->jumlah,
                'kddiagnosa' => $item->kddiagnosa,
                'baru' => (int)$item->baru,
                'lama' => (int)$item->lama,
                'namadiagnosa' => $item->namadiagnosa,
                'tidakdiisi' => (int)$item->tidakdiisi
            );
        }

        // array_multisort($detail, SORT_DESC);

        $result = array(
            'data' => $detail,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }


    public function getDataPenyakitPonekIGDRekap(Request $request)
    {
        $detail = [];
        $data = [];
        $satu = "123123123";
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $deptId = $request['idDept'];
        $ruanganId = $request['idRuangan'];
        $idJenisDiagnosa = $request['idJenisDiagnosa'];
        $diagnosaId = $request['idDiagnosa'];
        $rekananId = $request['RekananPasien'];
        $kelompokPasien = $request['kelompokPasien'];
        $kelompokPasien1 = "";
        $listDiagnosa = $request['listDiagnosa'];
        $paramDep = ' ';
        if (isset($deptId) && $deptId != "" && $deptId != "undefined") {
            $paramDep = ' and ru.objectdepartemenfk = ' . $deptId;
        }

        $paramRuangan = ' ';
        if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
            $paramRuangan = ' and ru.id = ' . $ruanganId;
        }

        $paramJenisDiagnosa = ' ';
        if (isset($idJenisDiagnosa) && $idJenisDiagnosa != "" && $idJenisDiagnosa != "undefined") {
            $paramJenisDiagnosa = ' and jd.id = ' . $idJenisDiagnosa;
        }

        $paramDiagnosa = ' ';
        if (isset($diagnosaId) && $diagnosaId != "" && $diagnosaId != "undefined") {
            $paramDiagnosa = ' and dm.id = ' . $diagnosaId;
        }
        $paramKelompokPasien = ' ';
        if (isset($kelompokPasien) && $kelompokPasien != "" && $kelompokPasien != "undefined") {
            $paramKelompokPasien = ' and jkm.id = ' . $kelompokPasien;
        }
        $paramKelompokPasien1 = "";
        if (isset($request['kelompokPasien1']) && $request['kelompokPasien1'] != "" && $request['kelompokPasien1'] != "undefined") {
            $paramKelompokPasien1 = " and pd.objectkelompokpasienlastfk = '$request[kelompokPasien1]' ";
        }
        $paramRekanan = '';
        if (isset($rekananId) && $rekananId != "" && $rekananId != "undefined") {
            $paramRekanan = ' and rk.id = ' . $rekananId;
        }
        $paramKdDiagnosa = '';
        if (isset($listDiagnosa) && $listDiagnosa != "" && $listDiagnosa != "undefined") {
            $paramKdDiagnosa = ' and dm.id in (' . $listDiagnosa . ')';
        }

        $data = DB::select(DB::raw("select SUM(x.jumlah) as jumlah, x.kddiagnosa, x.namadiagnosa, SUM(x.gynaecology) as gynaecology, SUM(x.obstetric) as obstetric, SUM(x.tidakdiisi) as tidakdiisi FROM 
                (select COUNT(ddp.norec) AS jumlah,
                dm.kddiagnosa, dm.namadiagnosa, dm.id,
                SUM(CASE WHEN ddp.penyakitponekigd='gynaecology' THEN 1 ELSE 0 END) AS gynaecology,
                SUM(CASE WHEN ddp.penyakitponekigd='obstetric' THEN 1 ELSE 0 END) AS obstetric,
                SUM(CASE WHEN ddp.penyakitponekigd IS NULL THEN 1 ELSE 0 END) AS tidakdiisi
                from pasiendaftar_t as pd
                INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
                LEFT JOIN detaildiagnosapasien_t as ddp on ddp.noregistrasifk = apd.norec
                LEFT JOIN diagnosapasien_t as dp on dp.norec = ddp.objectdiagnosapasienfk
                INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
                LEFT JOIN jeniskelompokpasien_m as jkm on jkm.id = pm.objectjeniskelompokpasienfk
                LEFT JOIN jeniskelamin_m as jk on jk.id = pm.objectjeniskelaminfk
                INNER JOIN diagnosa_m as dm on dm.id = ddp.objectdiagnosafk
                LEFT JOIN jenisdiagnosa_m as jd on jd.id = ddp.objectjenisdiagnosafk
                LEFT JOIN pegawai_m as pg on pg.id = apd.objectpegawaifk
                LEFT JOIN pegawai_m as pg1 on pg1.id = pd.objectpegawaifk
                LEFT JOIN rekanan_m as rk on rk.id = pd.objectrekananfk
                INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk
                LEFT JOIN statuskeluar_m as sk on sk.id = pd.objectstatuskeluarfk
                LEFT JOIN statuspulang_m as sp on sp.id = pd.objectstatuspulangfk
                LEFT JOIN batalregistrasi_t as br on br.pasiendaftarfk = pd.norec
                WHERE br.pasiendaftarfk is null and apd.objectruanganfk=309 and pd.tglregistrasi between '$tglAwal' and '$tglAkhir'
                $paramDep 
                $paramRuangan 
                $paramJenisDiagnosa 
                $paramDiagnosa 
                $paramKelompokPasien 
                $paramRekanan
                $paramKelompokPasien1
                $paramKdDiagnosa
                GROUP BY dm.namadiagnosa, dm.kddiagnosa, ddp.penyakitponekigd,dm.id) as x 
                GROUP BY x.namadiagnosa, x.kddiagnosa ORDER BY jumlah DESC
                "));
        $jumlah = 0;
        $baru = 0;
        $lama = 0;
        $tidakdiisi = 0;
        $masuk = false;
        $x = 0;
        $asiap = false;
        $hiji = true;

        foreach ($data as $item) {
            $detail[] = array(
                'jumlah' => (int)$item->jumlah,
                'kddiagnosa' => $item->kddiagnosa,
                'gynaecology' => (int)$item->gynaecology,
                'obstetric' => (int)$item->obstetric,
                'namadiagnosa' => $item->namadiagnosa,
                'tidakdiisi' => (int)$item->tidakdiisi
            );
        }

        // array_multisort($detail, SORT_DESC);

        $result = array(
            'data' => $detail,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    
    public function getDataPenyakitPonekIGD(Request $request)
    {
        $data = [];
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $deptId = $request['idDept'];
        $ruanganId = $request['idRuangan'];
        $idJenisDiagnosa = $request['idJenisDiagnosa'];
        $diagnosaId = $request['idDiagnosa'];
        $rekananId = $request['RekananPasien'];
        $kelompokPasien = $request['kelompokPasien'];
        $kelompokPasien1 = "";
        $listDiagnosa = $request['listDiagnosa'];
        $kesatuanId = $request['KesatuanPasien'];
        $jenisPenyakit = $request['jenisPenyakit'];
        $kdDiagnosa = $request['kdDiagnosa'];
        $paramDep = ' ';
        if (isset($deptId) && $deptId != "" && $deptId != "undefined") {
            $paramDep = ' and ru.objectdepartemenfk = ' . $deptId;
        }

        $paramRuangan = ' ';
        if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
            $paramRuangan = ' and ru.id = ' . $ruanganId;
        }

        $paramJenisDiagnosa = ' ';
        if (isset($idJenisDiagnosa) && $idJenisDiagnosa != "" && $idJenisDiagnosa != "undefined") {
            $paramJenisDiagnosa = ' and jd.id = ' . $idJenisDiagnosa;
        }

        $paramDiagnosa = ' ';
        if (isset($diagnosaId) && $diagnosaId != "" && $diagnosaId != "undefined") {
            $paramDiagnosa = ' and dm.id = ' . $diagnosaId;
        }
        $paramKelompokPasien = ' ';
        if (isset($kelompokPasien) && $kelompokPasien != "" && $kelompokPasien != "undefined") {
            $paramKelompokPasien = ' and jkm.id = ' . $kelompokPasien;
        }
        $paramKelompokPasien1 = "";
        if (isset($request['kelompokPasien1']) && $request['kelompokPasien1'] != "" && $request['kelompokPasien1'] != "undefined") {
            $paramKelompokPasien1 = " and pd.objectkelompokpasienlastfk = '$request[kelompokPasien1]' ";
        }
        $paramRekanan = '';
        if (isset($rekananId) && $rekananId != "" && $rekananId != "undefined") {
            $paramRekanan = ' and rk.id = ' . $rekananId;
        }
        $paramKdDiagnosa = '';
        if (isset($listDiagnosa) && $listDiagnosa != "" && $listDiagnosa != "undefined") {
            $paramKdDiagnosa = ' and dm.id in (' . $listDiagnosa . ')';
        }
        $paramKesatuan = '';
        if (isset($kesatuanId) && $kesatuanId != "" && $kesatuanId != "undefined") {
            $paramKesatuan = ' and pm.objectkesatuanfk = ' . $kesatuanId;
        }
        $paramJenisPenyakit = '';
        if (isset($jenisPenyakit) && $jenisPenyakit != "" && $jenisPenyakit != "undefined") {
            if($jenisPenyakit == 'tidakdiisi') {
                $paramJenisPenyakit = " and ddp.penyakitponekigd IS NULL";
            } else {
                $paramJenisPenyakit = " and ddp.penyakitponekigd = '" . $jenisPenyakit . "'";
            }
        }
        //  else {
        //     $paramJenisPenyakit = " and ddp.penyakitponekigd IS NULL";
        // }
        $paramkdDiagnosa = '';
        if (isset($kdDiagnosa) && $kdDiagnosa != "" && $kdDiagnosa != "undefined") {
            $paramkdDiagnosa = " and dm.kddiagnosa = '" . $kdDiagnosa . "'";
        }

        $data = DB::select(DB::raw("select pd.tglregistrasi,pd.tglpulang,pm.objectjeniskelompokpasienfk,jkm.jeniskelompokpasien,pm.nocm,pd.noregistrasi,pm.namapasien,pm.tgllahir,
        jk.reportdisplay as jeniskelamin,case when sk.statuskeluar is null then '-' else sk.statuskeluar end as statuskeluar,
        case when sp.statuspulang is null then '-' else sp.statuspulang end as statuspulang,ru.namaruangan,
        (case when pg.namalengkap is not null then pg.namalengkap when pg1.namalengkap is not null then pg1.namalengkap else '-' end) as namadokter,
        case when jd.jenisdiagnosa is null then '-' else jd.jenisdiagnosa end as jenisdiagnosa,
        case when dm.namadiagnosa = '-' then '-, ' + ddp.keterangan else dm.kddiagnosa + ', ' + dm.namadiagnosa end as namadiagnosa,
        pm.notelepon + '/' + pm.nohp as notelepon,
        rk.namarekanan, CASE WHEN dp.iskasusbaru=1 THEN 'Baru' WHEN dp.iskasuslama=1 THEN 'Lama' ELSE 'Tidak DiIsi' END AS status, kp.kesatuanpasien, skp.satuankerjapasien, pkt.namapangkat, pm.nrp, alm.alamatlengkap, ddp.penyakitponekigd
        from pasiendaftar_t as pd
        INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec
        LEFT JOIN detaildiagnosapasien_t as ddp on ddp.noregistrasifk = apd.norec
        LEFT JOIN diagnosapasien_t as dp on dp.norec = ddp.objectdiagnosapasienfk
        INNER JOIN pasien_m as pm on pm.id = pd.nocmfk
        LEFT JOIN jeniskelompokpasien_m as jkm on jkm.id = pm.objectjeniskelompokpasienfk
        LEFT JOIN jeniskelamin_m as jk on jk.id = pm.objectjeniskelaminfk
        INNER JOIN diagnosa_m as dm on dm.id = ddp.objectdiagnosafk
        LEFT JOIN jenisdiagnosa_m as jd on jd.id = ddp.objectjenisdiagnosafk
        LEFT JOIN pegawai_m as pg on pg.id = apd.objectpegawaifk
        LEFT JOIN pegawai_m as pg1 on pg1.id = pd.objectpegawaifk
        LEFT JOIN rekanan_m as rk on rk.id = pd.objectrekananfk
        INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk
        LEFT JOIN statuskeluar_m as sk on sk.id = pd.objectstatuskeluarfk
        LEFT JOIN statuspulang_m as sp on sp.id = pd.objectstatuspulangfk
        LEFT JOIN batalregistrasi_t as br on br.pasiendaftarfk = pd.norec
        LEFT JOIN kesatuanpasien_m as kp on kp.id = pm.objectkesatuanfk
        LEFT JOIN satuankerjapasien_m as skp on skp.id = pm.objectsatuankerjafk
        LEFT JOIN pangkat_m as pkt on pkt.id = pm.pangkatpolisi
        LEFT JOIN alamat_m as alm on alm.nocmfk = pm.id
        WHERE br.pasiendaftarfk is null and pd.tglregistrasi between '$tglAwal' and '$tglAkhir'
                $paramDep 
                $paramRuangan 
                $paramJenisDiagnosa 
                $paramDiagnosa 
                $paramKelompokPasien 
                $paramRekanan
                $paramKelompokPasien1
                $paramKdDiagnosa
                $paramKesatuan 
                $paramJenisPenyakit 
                $paramkdDiagnosa "));

        $result = array(
            'data' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getDataLaporanPasienBatalRegis(Request $request)
    {
        $data = [];
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $deptId = $request['idDept'];
        $ruanganId = $request['idRuangan'];
        $idJenisDiagnosa = $request['idJenisDiagnosa'];
        $diagnosaId = $request['idDiagnosa'];
        $rekananId = $request['RekananPasien'];
        $kelompokPasien = $request['kelompokPasien'];
        $kelompokPasien1 = "";
        $paramDep = ' ';
        $isRj = $request['isRJ'];
        $paramRuangan = ' ';
        $isRajal = "";
        if (isset($isRj) == true) {
            $isRajal = "and objectruanganfk in (3,4,6,7,8,9,12,13,14,17,19,25,26,27,20,31,33,37,70,89,97,98,130,132,198,230,241,243,245,247,248,249,250,253,255,268,319,322,446,448,456,459,461,462,535,543,552,564)";
        } else {
            if (isset($deptId) && $deptId != "" && $deptId != "undefined") {
                $paramDep = ' and objectdepartemenfk = ' . $deptId;
            }


            if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
                $paramRuangan = ' and objectruanganfk = ' . $ruanganId;
            }
        }

        $paramKelompokPasien = ' ';
        if (isset($kelompokPasien) && $kelompokPasien != "" && $kelompokPasien != "undefined") {
            $paramKelompokPasien = ' and objectkelompokpasienlastfk = ' . $kelompokPasien;
        }
        $paramKelompokPasien1 = "";
        if (isset($request['kelompokPasien1']) && $request['kelompokPasien1'] != "" && $request['kelompokPasien1'] != "undefined") {
            $paramKelompokPasien1 = " and pd.objectkelompokpasienlastfk = '$request[kelompokPasien1]' ";
        }
        $paramRekanan = '';
        if (isset($rekananId) && $rekananId != "" && $rekananId != "undefined") {
            $paramRekanan = ' and objectrekananfk = ' . $rekananId;
        }


        $data = DB::select(DB::raw("select * from  V_DaftarPasienBatal where tglregistrasi  between '$tglAwal' and '$tglAkhir'
                $paramDep 
                $paramRuangan  
                $paramRekanan
                $paramKelompokPasien $isRajal"));

        $result = array(
            'data' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }


    public function getDataLaporanPasienUncloseFaktur(Request $request)
    {
        $data = [];
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $deptId = $request['idDept'];
        $ruanganId = $request['idRuangan'];
        $idJenisDiagnosa = $request['idJenisDiagnosa'];
        $diagnosaId = $request['idDiagnosa'];
        $rekananId = $request['RekananPasien'];
        $kelompokPasien = $request['kelompokPasien'];
        $kelompokPasien1 = "";
        $paramDep = ' ';
        $isRj = $request['isRJ'];
        $paramRuangan = ' ';
        $isRajal = "";
        if (isset($isRj) == true) {
            $isRajal = "and objectruanganfk in (3,4,6,7,8,9,12,13,14,17,19,25,26,27,20,31,33,37,70,89,97,98,130,132,198,230,241,243,245,247,248,249,250,253,255,268,319,322,446,448,456,459,461,462,535,543,552,564)";
        } else {
            if (isset($deptId) && $deptId != "" && $deptId != "undefined") {
                $paramDep = ' and objectdepartemenfk = ' . $deptId;
            }


            if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
                $paramRuangan = ' and objectruanganlastfk = ' . $ruanganId;
            }
        }

        $paramKelompokPasien = ' ';
        if (isset($kelompokPasien) && $kelompokPasien != "" && $kelompokPasien != "undefined") {
            $paramKelompokPasien = ' and objectkelompokpasienlastfk = ' . $kelompokPasien;
        }
        $paramKelompokPasien1 = "";
        if (isset($request['kelompokPasien1']) && $request['kelompokPasien1'] != "" && $request['kelompokPasien1'] != "undefined") {
            $paramKelompokPasien1 = " and pd.objectkelompokpasienlastfk = '$request[kelompokPasien1]' ";
        }
        $paramRekanan = '';
        if (isset($rekananId) && $rekananId != "" && $rekananId != "undefined") {
            $paramRekanan = ' and objectrekananfk = ' . $rekananId;
        }


        $data = DB::select(DB::raw("select * from(SELECT DISTINCT 0 AS no,
                    pasien_m.nocm,
                    pasiendaftar_t.isclosing,
                    pasien_m.namapasien,
                    pasiendaftar_t.tglregistrasi,
                    pasiendaftar_t.tglpulang,
                    pasiendaftar_t.noregistrasi,
                    ruangan_m.namaruangan,
                    pasiendaftar_t.statuspasien,
                    statuspulang_m.statuspulang,
                    pasiendaftar_t.objectstatuspulangfk,
                    pasiendaftar_t.objectrekananfk,
                    pasiendaftar_t.objectkelompokpasienlastfk,
                    ruangan_m.objectdepartemenfk,
                        CASE
                            WHEN pasiendaftar_t.isclosing IS NULL THEN 'Belum Tutup Faktur'::text
                            ELSE 'Belum Tutup Faktur'::text
                        END AS tutupfaktur,
                    rekanan_m.namarekanan,
                    kelompokpasien_m.kelompokpasien,
                    pasiendaftar_t.objectruanganlastfk
                   FROM pasiendaftar_t
                     LEFT JOIN ruangan_m ON ruangan_m.id = pasiendaftar_t.objectruanganlastfk
                     LEFT JOIN pasien_m ON pasiendaftar_t.nocmfk = pasien_m.id
                     LEFT JOIN kelas_m ON pasiendaftar_t.objectkelasfk = kelas_m.id
                     LEFT JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id
                     LEFT JOIN kelompokpasien_m ON pasiendaftar_t.objectkelompokpasienlastfk = kelompokpasien_m.id
                     LEFT JOIN statuspulang_m ON pasiendaftar_t.objectstatuspulangfk = statuspulang_m.id
                  WHERE pasiendaftar_t.tglpulang IS NOT NULL AND pasiendaftar_t.isclosing IS NULL) as datas where tglregistrasi  between '$tglAwal' and '$tglAkhir'
                $paramDep 
                $paramRuangan  
                $paramRekanan
                $paramKelompokPasien $isRajal"));

        $result = array(
            'data' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getDepositPasienPulang(Request $request)
    {
        $filter = $request->all();
        $tglAwal = ' ';
        if (isset($request['tglAwal']) && $request['tglAwal'] != "" && $request['tglAwal'] != "undefined") {
            $tglAwal = $request['tglAwal'];
        }
        $tglAkhir = ' ';
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != "" && $request['tglAkhir'] != "undefined") {
            $tglAkhir =  $request['tglAkhir'];
        }
        $deptId = ' ';
        if (isset($filter['deptId']) && $filter['deptId'] != "" && $filter['deptId'] != "undefined") {
            $deptId = 'and ru.objectdepartemenfk=' . $filter['deptId'];
        }
        $ruangId = ' ';
        if (isset($filter['ruangId']) && $filter['ruangId'] != "" && $filter['ruangId'] != "undefined") {
            $ruangId = 'and ru.id=' . $filter['ruangId'];
        }
        $kelId = ' ';
        if (isset($filter['kelId']) && $filter['kelId'] != "" && $filter['kelId'] != "undefined") {
            $kelId = 'and klp.id=' . $filter['kelId'];
        }
        $noreg = ' ';
        if (isset($filter['noreg']) && $filter['noreg'] != "" && $filter['noreg'] != "undefined") {
            $noreg = "and pd.noregistrasi like '%" . $filter['noreg'] . "%'";
        }
        $norm = ' ';
        if (isset($filter['norm']) && $filter['norm'] != "" && $filter['norm'] != "undefined") {
            $norm = "and ps.nocm like '%" . $filter['norm'] . "%'";
        }
        $nama = ' ';
        if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $nama = "and ps.namapasien like '%" . $filter['nama'] . "%'";
        }

        $data = DB::select(DB::raw("SELECT
            pd.tglregistrasi,
            --(DATEDIFF(DAY, GETDATE(), pd.tglregistrasi)) as hari,
            pd.noregistrasi,	ps.nocm,ps.namapasien,	kl.namakelas,	klp.kelompokpasien,	rk.namarekanan,	ru.namaruangan,
            pd.tglpulang,sbm.nosbm,sp.nostruk,pg.namalengkap as namadokter,
            SUM (
                (
                    CASE WHEN (pp.produkfk = 402611) THEN pp.hargajual
                    ELSE (0)  END * pp.jumlah
                )
            ) AS totaldeposit
        FROM
        pasiendaftar_t pd
        JOIN antrianpasiendiperiksa_t apd ON apd.noregistrasifk = pd.norec
        left join pegawai_m as pg on pg.id= pd.objectpegawaifk
        left JOIN strukbuktipenerimaan_t sbm ON sbm.norec= pd.nosbmlastfk
        left JOIN strukpelayanan_t sp ON sp.norec= pd.nostruklastfk
        JOIN pelayananpasien_t pp ON pp.noregistrasifk = apd.norec
        JOIN ruangan_m ru ON ru.id = pd.objectruanganlastfk
        JOIN pasien_m ps ON ps.id = pd.nocmfk
        LEFT JOIN kelompokpasien_m klp ON klp.id = pd.objectkelompokpasienlastfk
        LEFT JOIN kelas_m kl ON kl.id = pd.objectkelasfk
        LEFT JOIN rekanan_m rk ON rk.id = pd.objectrekananfk
        WHERE ru.objectdepartemenfk IN (35, 16)
        AND pd.tglpulang IS NOT NULL
        AND pp.produkfk = 402611
        AND pd.tglregistrasi BETWEEN '$tglAwal'
        AND '$tglAkhir'
        $deptId
        $ruangId
        $kelId
        $noreg
        $norm
        $nama
        GROUP BY pd.tglregistrasi,pd.noregistrasi,	ps.nocm,	ps.namapasien,kl.namakelas,pg.namalengkap,
            klp.kelompokpasien,	rk.namarekanan,ru.namaruangan,  pd.tglpulang,sbm.nosbm,sp.nostruk"));
        $result = array(
            'daftar' => $data,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }

    public function getRekapKunjunganRJ(Request $request)
    {
        $monthYear = $request['monthYear'];
        $data = DB::select(DB::raw(" 
                select 'Registrasi' as uraian, 'Pengunjung' as satuan,pd.norec, pd.noregistrasi, dp.namadepartemen,ru.id as idruangan,
                ru.namaruangan,kp.id as idkelompokpasien,kp.kelompokpasien,jp.jenispelayanan
                from pasiendaftar_t as pd 
                join kelompokpasien_m as kp on kp.id =pd.objectkelompokpasienlastfk
                join ruangan_m as ru on ru.id =pd.objectruanganlastfk
                join departemen_m as dp on dp.id =ru.objectdepartemenfk
                left join jenispelayanan_m as jp on cast (jp.id as text)=pd.jenispelayanan 
                where to_char( pd.tglregistrasi,'YYYY-MM')='$monthYear'
                and ru.objectdepartemenfk =18
                
                union all 
                 
                select 'Konsultasi' as uraian, 'Kunjungan' as satuan,apd.norec, pd.noregistrasi, dp.namadepartemen,ru.id as idruangan,ru.namaruangan,
                kp.id as idkelompokpasien,kp.kelompokpasien,jp.jenispelayanan
                from antrianpasiendiperiksa_t as apd 
                join pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
                join kelompokpasien_m as kp on kp.id =pd.objectkelompokpasienlastfk
                join ruangan_m as ru on ru.id =apd.objectruanganfk
                join departemen_m as dp on dp.id =ru.objectdepartemenfk
                left join jenispelayanan_m as jp on cast (jp.id as text)=pd.jenispelayanan 
                where to_char( apd.tglregistrasi,'YYYY-MM')='$monthYear'
                and ru.objectdepartemenfk =18
                "));

        $tempData = [];
        if ($data > 0) {
            $rajalRegBPJS = 0;
            $rajalRegNonBPJS = 0;
            $melatiBPJS = 0;
            $melatiNonBPJS = 0;
            $clpBPJS = 0;
            $clpNonBPJS = 0;
            $potasBPJS = 0;
            $potasNonBPJS = 0;
            $klinikRemajaBPJS = 0;
            $klinikRemajaNonBPJS = 0;
            foreach ($data  as $item) {
                $sama = false;
                $i = 0;
                foreach ($tempData as $item2) {
                    if ($item->uraian ==  $tempData[$i]['uraian']) {
                        $sama = true;
                        $jml = (float)$item2['jumlah'] + 1;
                        $tempData[$i]['jumlah'] = $jml;
                        if ($item->jenispelayanan == 'REGULER' && $item->idkelompokpasien == 2) {
                            $tempData[$i]['rajalRegBPJS'] = (float)$item2['rajalRegBPJS'] + 1;
                        }
                        if ($item->jenispelayanan == 'REGULER' && $item->idkelompokpasien != 2) {
                            $tempData[$i]['rajalRegNonBPJS'] = (float)$item2['rajalRegNonBPJS'] + 1;
                        }
                        if ($item->idruangan == 19 && $item->idkelompokpasien == 2) {
                            $tempData[$i]['melatiBPJS'] = (float)$item2['melatiBPJS'] + 1;
                        }
                        if ($item->idruangan == 19 && $item->idkelompokpasien != 2) {
                            $tempData[$i]['melatiNonBPJS'] = (float)$item2['melatiNonBPJS'] + 1;
                        }
                        if ($item->idruangan == 26 && $item->idkelompokpasien == 2) {
                            $tempData[$i]['clpBPJS'] = (float)$item2['clpBPJS'] + 1;
                        }
                        if ($item->idruangan == 26 && $item->idkelompokpasien != 2) {
                            $tempData[$i]['clpNonBPJS'] = (float)$item2['clpNonBPJS'] + 1;
                        }
                        //                        if ($item->idruangan == 322 && $item->idkelompokpasien == 2) {
                        //                            $tempData[$i]['potasBPJS '] = (float)$item2['potasBPJS '] + 1;
                        //                        }
                        //                        if ($item->idruangan == 322 && $item->idkelompokpasien != 2) {
                        //                            $tempData[$i]['potasNonBPJS'] = (float)$item2['potasNonBPJS'] + 1;
                        //                        }
                        //                        if ($item->idruangan == 245 && $item->idkelompokpasien == 2) {
                        //                            $tempData[$i]['klinikRemajaBPJS '] = (float)$item2['klinikRemajaBPJS '] + 1;
                        //                        }
                        //                        if ($item->idruangan == 245 && $item->idkelompokpasien != 2) {
                        //                            $tempData[$i]['klinikRemajaNonBPJS'] = (float)$item2['klinikRemajaNonBPJS'] + 1;
                        //                        }
                        $tempData[$i]['totalRajal'] = $tempData[$i]['rajalRegBPJS'] + $tempData[$i]['rajalRegNonBPJS'];
                        $tempData[$i]['totalMelati'] = $tempData[$i]['melatiBPJS'] + $tempData[$i]['melatiNonBPJS'];
                        $tempData[$i]['totalClp'] = $tempData[$i]['clpNonBPJS'] + $tempData[$i]['clpBPJS'];
                        //                        $tempData[$i]['totalPotas'] = $tempData[$i]['potasNonBPJS'] + $tempData[$i]['potasBPJS'];
                        //                        $tempData[$i]['totalKlinikRemaja'] = $tempData[$i]['klinikRemajaNonBPJS'] + $tempData[$i]['klinikRemajaBPJS'];
                    }
                    $i = $i + 1;
                }
                if ($sama ==  false) {
                    if ($item->jenispelayanan == 'REGULER' && $item->idkelompokpasien == 2) {
                        $rajalRegBPJS = 1;
                        $rajalRegNonBPJS = 0;
                        $melatiBPJS = 0;
                        $melatiNonBPJS = 0;
                        $clpBPJS = 0;
                        $clpNonBPJS = 0;
                        $potasBPJS = 0;
                        $potasNonBPJS = 0;
                        $klinikRemajaBPJS = 0;
                        $klinikRemajaNonBPJS = 0;
                    }
                    if ($item->jenispelayanan == 'REGULER' && $item->idkelompokpasien != 2) {
                        $rajalRegBPJS = 0;
                        $rajalRegNonBPJS = 1;
                        $melatiBPJS = 0;
                        $melatiNonBPJS = 0;
                        $clpBPJS = 0;
                        $clpNonBPJS = 0;
                        $potasBPJS = 0;
                        $potasNonBPJS = 0;
                        $klinikRemajaBPJS = 0;
                        $klinikRemajaNonBPJS = 0;
                    }
                    if ($item->idruangan == 19 && $item->idkelompokpasien == 2) {
                        $rajalRegBPJS = 0;
                        $rajalRegNonBPJS = 0;
                        $melatiBPJS = 1;
                        $melatiNonBPJS = 0;
                        $clpBPJS = 0;
                        $clpNonBPJS = 0;
                        $potasBPJS = 0;
                        $potasNonBPJS = 0;
                        $klinikRemajaBPJS = 0;
                        $klinikRemajaNonBPJS = 0;
                    }
                    //                    if ($item->idruangan == 19 && $item->idkelompokpasien != 2) {
                    //                        $rajalRegBPJS = 0; $rajalRegNonBPJS = 0; $melatiBPJS = 0; $melatiNonBPJS = 1; $clpBPJS = 0;
                    //                        $clpNonBPJS = 0; $potasBPJS = 0; $potasNonBPJS = 0; $klinikRemajaBPJS = 0; $klinikRemajaNonBPJS = 0;
                    //                    }
                    //                    if ($item->idruangan == 26 && $item->idkelompokpasien == 2) {
                    //                        $rajalRegBPJS = 0; $rajalRegNonBPJS = 0; $melatiBPJS = 0; $melatiNonBPJS = 0; $clpBPJS = 1;
                    //                        $clpNonBPJS = 0; $potasBPJS = 0; $potasNonBPJS = 0; $klinikRemajaBPJS = 0; $klinikRemajaNonBPJS = 0;
                    //                    }
                    //                    if ($item->idruangan == 26 && $item->idkelompokpasien != 2) {
                    //                        $rajalRegBPJS = 0; $rajalRegNonBPJS = 0; $melatiBPJS = 0; $melatiNonBPJS = 0; $clpBPJS = 0;
                    //                        $clpNonBPJS = 1; $potasBPJS = 0; $potasNonBPJS = 0; $klinikRemajaBPJS = 0; $klinikRemajaNonBPJS = 0;
                    //                    }
                    //                    if ($item->idruangan == 322 && $item->idkelompokpasien == 2) {
                    //                        $rajalRegBPJS = 0; $rajalRegNonBPJS = 0; $melatiBPJS = 0; $melatiNonBPJS = 0; $clpBPJS = 0;
                    //                        $clpNonBPJS = 0; $potasBPJS = 1; $potasNonBPJS = 0; $klinikRemajaBPJS = 0; $klinikRemajaNonBPJS = 0;
                    //                    }
                    if ($item->idruangan == 322 && $item->idkelompokpasien != 2) {
                        $rajalRegBPJS = 0;
                        $rajalRegNonBPJS = 0;
                        $melatiBPJS = 0;
                        $melatiNonBPJS = 0;
                        $clpBPJS = 0;
                        $clpNonBPJS = 0;
                        $potasBPJS = 0;
                        $potasNonBPJS = 1;
                        $klinikRemajaBPJS = 0;
                        $klinikRemajaNonBPJS = 0;
                    }
                    if ($item->idruangan == 245 && $item->idkelompokpasien == 2) {
                        $rajalRegBPJS = 0;
                        $rajalRegNonBPJS = 0;
                        $melatiBPJS = 0;
                        $melatiNonBPJS = 0;
                        $clpBPJS = 0;
                        $clpNonBPJS = 0;
                        $potasBPJS = 0;
                        $potasNonBPJS = 0;
                        $klinikRemajaBPJS = 1;
                        $klinikRemajaNonBPJS = 0;
                    }
                    if ($item->idruangan == 245 && $item->idkelompokpasien != 2) {
                        $rajalRegBPJS = 0;
                        $rajalRegNonBPJS = 0;
                        $melatiBPJS = 0;
                        $melatiNonBPJS = 0;
                        $clpBPJS = 0;
                        $clpNonBPJS = 0;
                        $potasBPJS = 0;
                        $potasNonBPJS = 0;
                        $klinikRemajaBPJS = 0;
                        $klinikRemajaNonBPJS = 1;
                    }
                    $tempData[] = array(
                        'uraian' => $item->uraian,
                        'satuan' => $item->satuan,
                        'rajalRegBPJS' =>  $rajalRegBPJS,
                        'rajalRegNonBPJS' =>  $rajalRegNonBPJS,
                        'totalRajal' => $rajalRegBPJS + $rajalRegNonBPJS,
                        'melatiBPJS' =>  $melatiBPJS,
                        'melatiNonBPJS' =>  $melatiNonBPJS,
                        'totalMelati' => $melatiBPJS + $melatiNonBPJS,
                        'clpBPJS' =>  $clpBPJS,
                        'clpNonBPJS' =>  $clpNonBPJS,
                        'totalClp' => $clpBPJS + $clpNonBPJS,
                        'potasBPJS' =>  $potasBPJS,
                        'potasNonBPJS' =>  $potasNonBPJS,
                        'totalPotas' => $potasBPJS + $potasNonBPJS,
                        'klinikRemajaBPJS' =>  $klinikRemajaBPJS,
                        'klinikRemajaNonBPJS' =>  $klinikRemajaNonBPJS,
                        'totalKlinikRemaja' => $klinikRemajaBPJS + $klinikRemajaNonBPJS,
                        'jumlah' => 1,
                    );
                }
            }
        }

        $result = array(
            'count' => count($tempData),
            'data' => $tempData,
            'message' => 'inhuman',
        );
        return $this->respond($result);
    }

    public function getRekapPembayaranJasaPelayanan(Request $request)
    {
        $data = [];
        $data2 = [];
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $deptId = $request['deptId'];
        $ruanganId = $request['ruangId'];
        $typePegawaiId = $request['typePegawaiId'];
        $dokterId = $request['dokterId'];
        $TypePasien = $request['tipePasien'];
        $paramJadwalDokter = $request['jadwalKerja'];

        $paramDep =  ' ';
        if (isset($deptId) && $deptId != "" && $deptId != "undefined") {
            $paramDep = ' and ru.objectdepartemenfk = ' . $deptId;
        }
        $paramRuangan = ' ';
        if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
            $paramRuangan = '  and ru.id = ' . $ruanganId;
        }
        $paramTypePegawai = ' ';
        if (isset($typePegawaiId) && $typePegawaiId != "" && $typePegawaiId != "undefined") {
            $paramTypePegawai = '  and pg.objecttypepegawaifk = ' . $typePegawaiId;
        }
        $paramDokter = ' ';
        if (isset($dokterId) && $dokterId != "" && $dokterId != "undefined") {
            $paramDokter = ' and pg.id = ' . $dokterId;
        }
        $paramTypePasien = ' ';
        if (isset($TypePasien) && $TypePasien != "" && $TypePasien != "undefined") {
            $paramTypePasien = '  and kp.id = ' . $TypePasien;
        }

        if ($paramJadwalDokter == '' || $paramJadwalDokter == null) {
            $data = DB::select(DB::raw(" 
                select *, y.jasa - y.pph as diterima
                from(
                select x.dokter,x.namaruangan, x.tglpelayanan,count(*) FILTER (WHERE x.kpid = '1' ) AS jmlch,0  AS jmlkk,
                count(*) FILTER (WHERE x.kpid <> '1' ) AS jmljm, 
                sum(case when x.pendapatancash is null then 0 else x.pendapatancash end) as pendapatancash,
                0 as pendapatankredit,
                sum(case when x.pendapatanjaminan is null then 0 else x.pendapatanjaminan end) as pendapatanjaminan,
                sum(x.jasa ) as jasa, sum(x.remun) as remun,
                sum((x.jasa /100)*7.5) as pph
                from(
                select  UPPER ( pg.namalengkap) as dokter,  UPPER (ru.namaruangan) as namaruangan,  to_char(pp.tglpelayanan,'DD-MM-YYYY') as tglpelayanan, 
                sum( case when ppd.komponenhargafk = 35 then ((ppd.hargajual-case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end )* pp.jumlah) end ) as jasa, 
                0 as remun, sum( pp.jumlah) as jumlah, 
                sum( case when kp.id = 1 then ((ppd.hargajual-case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end )* pp.jumlah) end ) as pendapatancash, 
                sum( case when kp.id <> 1 then ((ppd.hargajual-case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end )* pp.jumlah) end ) as pendapatanjaminan, 
                kp.kelompokpasien,  pg.objecttypepegawaifk ,kp.id as kpid           
                from pasiendaftar_t as pd            
                inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec            
                inner join pelayananpasien_t as pp on pp.noregistrasifk=apd.norec            
                left join pelayananpasiendetail_t as ppd on ppd.pelayananpasien=pp.norec            
                left join pelayananpasienpetugas_t as ppp on ppp.pelayananpasien=pp.norec                            
                inner join pegawai_m as pg on pg.id=ppp.objectpegawaifk            
                left join ruangan_m as ru on ru.id=apd.objectruanganfk            
                left join kelompokpasien_m as kp on kp.id=pd.objectkelompokpasienlastfk            
                where  objectjenispetugaspefk = 4
                and  pp.tglpelayanan BETWEEN '$tglAwal' and '$tglAkhir'    
                 $paramDep
                 $paramRuangan
                 $paramTypePegawai
                 $paramDokter
                 $paramTypePasien
                GROUP BY pg.namalengkap,ru.namaruangan, kp.kelompokpasien, 
                pg.objecttypepegawaifk     ,pp.tglpelayanan,kp.id 
                order by pp.tglpelayanan
                ) as x
                GROUP BY  x.dokter,x.namaruangan,x.tglpelayanan
                ) as y  order by y.tglpelayanan"));

            $data2 = DB::select(DB::raw(" 
                select x.dokter,x.tglpelayanan,
                count(*) FILTER (WHERE x.kpid = '1' ) AS jmlch,0  AS jmlkk,
                count(*) FILTER (WHERE x.kpid <> '1' ) AS jmljm
                from (
                select pd.noregistrasi, UPPER ( pg.namalengkap) as dokter,   to_char(pp.tglpelayanan,'DD-MM-YYYY') as tglpelayanan, 
                kp.kelompokpasien,  pg.objecttypepegawaifk ,kp.id as kpid           
                from pasiendaftar_t as pd            
                inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec            
                inner join pelayananpasien_t as pp on pp.noregistrasifk=apd.norec            
                left join pelayananpasiendetail_t as ppd on ppd.pelayananpasien=pp.norec            
                left join pelayananpasienpetugas_t as ppp on ppp.pelayananpasien=pp.norec                            
                inner join pegawai_m as pg on pg.id=ppp.objectpegawaifk            
                left join ruangan_m as ru on ru.id=apd.objectruanganfk            
                left join kelompokpasien_m as kp on kp.id=pd.objectkelompokpasienlastfk            
                where  objectjenispetugaspefk = 4
                and ppd.komponenhargafk=35
                and  pp.tglpelayanan BETWEEN '$tglAwal' and '$tglAkhir'    
                $paramDep
                $paramRuangan
                $paramTypePegawai
                $paramDokter
                $paramTypePasien
                GROUP BY pg.namalengkap,ru.namaruangan, kp.kelompokpasien, 
                pg.objecttypepegawaifk,pp.tglpelayanan,kp.id ,pd.noregistrasi
                order by pp.tglpelayanan
                ) as x
                GROUP BY x.dokter,x.tglpelayanan"));
        } else if ($paramJadwalDokter == 1 || $paramJadwalDokter == '1') {

            $data = DB::select(DB::raw(" 
                select *, y.jasa - y.pph as diterima
                from(
                select x.dokter,x.namaruangan, x.tglpelayanan,count(*) FILTER (WHERE x.kpid = '1' ) AS jmlch,0  AS jmlkk,
                count(*) FILTER (WHERE x.kpid <> '1' ) AS jmljm, 
                sum(case when x.pendapatancash is null then 0 else x.pendapatancash end) as pendapatancash,
                0 as pendapatankredit,
                sum(case when x.pendapatanjaminan is null then 0 else x.pendapatanjaminan end) as pendapatanjaminan,
                sum(x.jasa ) as jasa, sum(x.remun) as remun,
                sum((x.jasa /100)*7.5) as pph
                from(
                select  UPPER ( pg.namalengkap) as dokter,  UPPER (ru.namaruangan) as namaruangan,  to_char(pp.tglpelayanan,'DD-MM-YYYY') as tglpelayanan, 
                sum( case when ppd.komponenhargafk = 35 then ((ppd.hargajual-case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end )* pp.jumlah) end ) as jasa, 
                0 as remun, sum( pp.jumlah) as jumlah, 
                sum( case when kp.id = 1 then ((ppd.hargajual-case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end )* pp.jumlah) end ) as pendapatancash, 
                sum( case when kp.id <> 1 then ((ppd.hargajual-case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end )* pp.jumlah) end ) as pendapatanjaminan, 
                kp.kelompokpasien,  pg.objecttypepegawaifk ,kp.id as kpid           
                from pasiendaftar_t as pd            
                inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec            
                inner join pelayananpasien_t as pp on pp.noregistrasifk=apd.norec            
                left join pelayananpasiendetail_t as ppd on ppd.pelayananpasien=pp.norec            
                left join pelayananpasienpetugas_t as ppp on ppp.pelayananpasien=pp.norec                            
                inner join pegawai_m as pg on pg.id=ppp.objectpegawaifk            
                left join ruangan_m as ru on ru.id=apd.objectruanganfk            
                left join kelompokpasien_m as kp on kp.id=pd.objectkelompokpasienlastfk
                INNER JOIN pegawaijadwalkerja_m as jdw on jdw.objectpegawaifk=ppp.objectpegawaifk
                INNER JOIN kalender_s as kld on kld.id=jdw.objecttanggalfk
                INNER JOIN shiftkerja_m as sf on sf.id=jdw.objectshiftfk
                where  objectjenispetugaspefk = 4
                and  pp.tglpelayanan BETWEEN '$tglAwal' and '$tglAkhir'    
                 $paramDep
                 $paramRuangan
                 $paramTypePegawai
                 $paramDokter
                 $paramTypePasien
                and (pp.tglpelayanan between  to_timestamp(to_char(kld.tanggal, 'YYYY-MM-DD')  || ' ' || replace(jammasuk,'.',':'),'YYYY-MM-DD HH24:MI')  
                and to_timestamp(to_char(kld.tanggal, 'YYYY-MM-DD')  || ' ' || replace(jampulang,'.',':'),'YYYY-MM-DD HH24:MI'))
                GROUP BY pg.namalengkap,ru.namaruangan, kp.kelompokpasien, 
                pg.objecttypepegawaifk     ,pp.tglpelayanan,kp.id 
                order by pp.tglpelayanan
                ) as x
                GROUP BY  x.dokter,x.namaruangan,x.tglpelayanan
                ) as y  order by y.tglpelayanan"));

            $data2 = DB::select(DB::raw(" 
                select x.dokter,x.tglpelayanan,
                count(*) FILTER (WHERE x.kpid = '1' ) AS jmlch,0  AS jmlkk,
                count(*) FILTER (WHERE x.kpid <> '1' ) AS jmljm
                from (
                select pd.noregistrasi, UPPER ( pg.namalengkap) as dokter,   to_char(pp.tglpelayanan,'DD-MM-YYYY') as tglpelayanan, 
                kp.kelompokpasien,  pg.objecttypepegawaifk ,kp.id as kpid           
                from pasiendaftar_t as pd            
                inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec            
                inner join pelayananpasien_t as pp on pp.noregistrasifk=apd.norec            
                left join pelayananpasiendetail_t as ppd on ppd.pelayananpasien=pp.norec            
                left join pelayananpasienpetugas_t as ppp on ppp.pelayananpasien=pp.norec                            
                inner join pegawai_m as pg on pg.id=ppp.objectpegawaifk            
                left join ruangan_m as ru on ru.id=apd.objectruanganfk            
                left join kelompokpasien_m as kp on kp.id=pd.objectkelompokpasienlastfk
                INNER JOIN pegawaijadwalkerja_m as jdw on jdw.objectpegawaifk=ppp.objectpegawaifk
                INNER JOIN kalender_s as kld on kld.id=jdw.objecttanggalfk
                INNER JOIN shiftkerja_m as sf on sf.id=jdw.objectshiftfk
                where  objectjenispetugaspefk = 4
                and ppd.komponenhargafk=35
                and  pp.tglpelayanan BETWEEN '$tglAwal' and '$tglAkhir'    
                $paramDep
                $paramRuangan
                $paramTypePegawai
                $paramDokter
                $paramTypePasien
                and (pp.tglpelayanan between  to_timestamp(to_char(kld.tanggal, 'YYYY-MM-DD')  || ' ' || replace(jammasuk,'.',':'),'YYYY-MM-DD HH24:MI')  
                and to_timestamp(to_char(kld.tanggal, 'YYYY-MM-DD')  || ' ' || replace(jampulang,'.',':'),'YYYY-MM-DD HH24:MI'))
                GROUP BY pg.namalengkap,ru.namaruangan, kp.kelompokpasien, 
                pg.objecttypepegawaifk,pp.tglpelayanan,kp.id ,pd.noregistrasi
                order by pp.tglpelayanan
                ) as x
                GROUP BY x.dokter,x.tglpelayanan"));
        } else {
            $data = DB::select(DB::raw(" 
                select *, y.jasa - y.pph as diterima
                from(
                select x.dokter,x.namaruangan, x.tglpelayanan,count(*) FILTER (WHERE x.kpid = '1' ) AS jmlch,0  AS jmlkk,
                count(*) FILTER (WHERE x.kpid <> '1' ) AS jmljm, 
                sum(case when x.pendapatancash is null then 0 else x.pendapatancash end) as pendapatancash,
                0 as pendapatankredit,
                sum(case when x.pendapatanjaminan is null then 0 else x.pendapatanjaminan end) as pendapatanjaminan,
                sum(x.jasa ) as jasa, sum(x.remun) as remun,
                sum((x.jasa /100)*7.5) as pph
                from(
                select  UPPER ( pg.namalengkap) as dokter,  UPPER (ru.namaruangan) as namaruangan,  to_char(pp.tglpelayanan,'DD-MM-YYYY') as tglpelayanan, 
                sum( case when ppd.komponenhargafk = 35 then ((ppd.hargajual-case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end )* pp.jumlah) end ) as jasa, 
                0 as remun, sum( pp.jumlah) as jumlah, 
                sum( case when kp.id = 1 then ((ppd.hargajual-case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end )* pp.jumlah) end ) as pendapatancash, 
                sum( case when kp.id <> 1 then ((ppd.hargajual-case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end )* pp.jumlah) end ) as pendapatanjaminan, 
                kp.kelompokpasien,  pg.objecttypepegawaifk ,kp.id as kpid           
                from pasiendaftar_t as pd            
                inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec            
                inner join pelayananpasien_t as pp on pp.noregistrasifk=apd.norec            
                left join pelayananpasiendetail_t as ppd on ppd.pelayananpasien=pp.norec            
                left join pelayananpasienpetugas_t as ppp on ppp.pelayananpasien=pp.norec                            
                inner join pegawai_m as pg on pg.id=ppp.objectpegawaifk            
                left join ruangan_m as ru on ru.id=apd.objectruanganfk            
                left join kelompokpasien_m as kp on kp.id=pd.objectkelompokpasienlastfk
                INNER JOIN pegawaijadwalkerja_m as jdw on jdw.objectpegawaifk=ppp.objectpegawaifk
                INNER JOIN kalender_s as kld on kld.id=jdw.objecttanggalfk
                INNER JOIN shiftkerja_m as sf on sf.id=jdw.objectshiftfk
                where  objectjenispetugaspefk = 4
                and  pp.tglpelayanan BETWEEN '$tglAwal' and '$tglAkhir'    
                $paramDep
                $paramRuangan
                $paramTypePegawai
                $paramDokter
                $paramTypePasien
                and ((pp.tglpelayanan between  to_timestamp(to_char(kld.tanggal, 'YYYY-MM-DD')  || ' 00:00','YYYY-MM-DD HH24:MI')  
                and to_timestamp(to_char(kld.tanggal, 'YYYY-MM-DD')  || ' ' || replace(jammasuk,'.',':'),'YYYY-MM-DD HH24:MI')- interval '1' minute  )
                or (pp.tglpelayanan between  to_timestamp(to_char(kld.tanggal, 'YYYY-MM-DD')  || ' ' || replace(jampulang,'.',':'),'YYYY-MM-DD HH24:MI') + interval '1' minute
                and to_timestamp(to_char(kld.tanggal, 'YYYY-MM-DD')  || ' 23:59:59','YYYY-MM-DD HH24:MI')))
                GROUP BY pg.namalengkap,ru.namaruangan, kp.kelompokpasien, 
                pg.objecttypepegawaifk     ,pp.tglpelayanan,kp.id 
                order by pp.tglpelayanan
                ) as x
                GROUP BY  x.dokter,x.namaruangan,x.tglpelayanan
                ) as y  order by y.tglpelayanan"));

            $data2 = DB::select(DB::raw(" 
                select x.dokter,x.tglpelayanan,
                count(*) FILTER (WHERE x.kpid = '1' ) AS jmlch,0  AS jmlkk,
                count(*) FILTER (WHERE x.kpid <> '1' ) AS jmljm
                from (
                select pd.noregistrasi, UPPER ( pg.namalengkap) as dokter,   to_char(pp.tglpelayanan,'DD-MM-YYYY') as tglpelayanan, 
                kp.kelompokpasien,  pg.objecttypepegawaifk ,kp.id as kpid           
                from pasiendaftar_t as pd            
                inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec            
                inner join pelayananpasien_t as pp on pp.noregistrasifk=apd.norec            
                left join pelayananpasiendetail_t as ppd on ppd.pelayananpasien=pp.norec            
                left join pelayananpasienpetugas_t as ppp on ppp.pelayananpasien=pp.norec                            
                inner join pegawai_m as pg on pg.id=ppp.objectpegawaifk            
                left join ruangan_m as ru on ru.id=apd.objectruanganfk            
                left join kelompokpasien_m as kp on kp.id=pd.objectkelompokpasienlastfk
                INNER JOIN pegawaijadwalkerja_m as jdw on jdw.objectpegawaifk=ppp.objectpegawaifk
                INNER JOIN kalender_s as kld on kld.id=jdw.objecttanggalfk
                INNER JOIN shiftkerja_m as sf on sf.id=jdw.objectshiftfk
                where  objectjenispetugaspefk = 4
                and ppd.komponenhargafk=35
                and  pp.tglpelayanan BETWEEN '$tglAwal' and '$tglAkhir'    
                $paramDep
                $paramRuangan
                $paramTypePegawai
                $paramDokter
                $paramTypePasien
                and ((pp.tglpelayanan between  to_timestamp(to_char(kld.tanggal, 'YYYY-MM-DD')  || ' 00:00','YYYY-MM-DD HH24:MI')  
                and to_timestamp(to_char(kld.tanggal, 'YYYY-MM-DD')  || ' ' || replace(jammasuk,'.',':'),'YYYY-MM-DD HH24:MI')- interval '1' minute  )
                or (pp.tglpelayanan between  to_timestamp(to_char(kld.tanggal, 'YYYY-MM-DD')  || ' ' || replace(jampulang,'.',':'),'YYYY-MM-DD HH24:MI') + interval '1' minute
                and to_timestamp(to_char(kld.tanggal, 'YYYY-MM-DD')  || ' 23:59:59','YYYY-MM-DD HH24:MI')))
                GROUP BY pg.namalengkap,ru.namaruangan, kp.kelompokpasien, 
                pg.objecttypepegawaifk,pp.tglpelayanan,kp.id ,pd.noregistrasi
                order by pp.tglpelayanan
                ) as x
                GROUP BY x.dokter,x.tglpelayanan"));
        }

        $result = array(
            'count' => count($data),
            'data' => $data,
            'jmlpasien' => $data2,
            'message' => 'inhuman',
        );
        return $this->respond($result);
    }

    public function getDetailJasaPelayanan(Request $request)
    {
        $data = [];
        $data2 = [];
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $deptId = $request['deptId'];
        $ruanganId = $request['ruangId'];
        $dokterId = $request['dokterId'];
        $TypePasien = $request['tipePasien'];
        $paramJadwalDokter = $request['jadwalKerja'];
        $typePegawaiId = $request['typePegawaiId'];

        $paramDep = ' ';
        if (isset($deptId) && $deptId != "" && $deptId != "undefined") {
            $paramDep = ' and ru.objectdepartemenfk = ' . $deptId;
        }
        $paramRuangan = ' ';
        if (isset($ruanganId) && $ruanganId != "" && $ruanganId != "undefined") {
            $paramRuangan = " and ru.namaruangan like " . "'%" . $ruanganId . "%'";
        }
        $paramDokter = ' ';
        if (isset($dokterId) && $dokterId != "" && $dokterId != "undefined") {
            $paramDokter = " and pg.namalengkap like " . "'%" . $dokterId . "%'";
        }
        $paramTypePasien = ' ';
        if (isset($TypePasien) && $TypePasien != "" && $TypePasien != "undefined") {
            $paramTypePasien = '  and kp.id = ' . $TypePasien;
        }
        $paramTypePegawai = ' ';
        if (isset($typePegawaiId) && $typePegawaiId != "" && $typePegawaiId != "undefined") {
            $paramTypePegawai = '  and pg.objecttypepegawaifk = ' . $typePegawaiId;
        }

        $data = DB::select(DB::raw("select pd.tglregistrasi,ps.nocm,pd.noregistrasi,ps.namapasien,pro.namaproduk,
                    UPPER ( pg.namalengkap) as dokter,UPPER (ru.namaruangan) as namaruangan,pp.jumlah,
                    pp.tglpelayanan,kp.id as kpid,kp.kelompokpasien,pd.objectkelasfk,kls.namakelas,
                    pg.objecttypepegawaifk,pp.hargajual,case when pp.hargadiscount is null then 0 else pp.hargadiscount end as diskon	
                from pasiendaftar_t as pd            
                inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec            
                inner join pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                inner join pasien_m as ps on ps.id = pd.nocmfk       
                left join pelayananpasiendetail_t as ppd on ppd.pelayananpasien=pp.norec            
                left join pelayananpasienpetugas_t as ppp on ppp.pelayananpasien=pp.norec                            
                inner join pegawai_m as pg on pg.id=ppp.objectpegawaifk            
                left join ruangan_m as ru on ru.id=apd.objectruanganfk            
                left join kelompokpasien_m as kp on kp.id=pd.objectkelompokpasienlastfk 
                left join produk_m as pro on pro.id = pp.produkfk   
                left join kelas_m as kls on kls.id = pd.objectkelasfk       
                where objectjenispetugaspefk = 4 and pp.tglpelayanan BETWEEN '$tglAwal' and '$tglAkhir'
                $paramDep
                $paramDokter
                $paramRuangan
                $paramTypePasien
                $paramTypePegawai
                GROUP BY pd.noregistrasi,pro.namaproduk,pg.namalengkap,ru.namaruangan,pp.tglpelayanan, 
                      kp.kelompokpasien,pg.objecttypepegawaifk,kp.id,pp.hargajual,pp.hargadiscount,
                      pp.jumlah,ps.nocm,ps.namapasien,pd.objectkelasfk,kls.namakelas,pd.tglregistrasi"));


        $result = array(
            'data' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getLaporanKegiatanOperasionalRJ(Request $request)
    {
        $monthYear = $request['monthYear'];
        $jenis = $request['jenisRuanganId'];
        $join = '';
        $paramJenis = '';
        if (isset($jenis) && $jenis != '') {
            $paramJenis = 'and maps.objectjenisruanganfk =' . $jenis;
            $join = 'left JOIN mapruangantojenisruangan_m as maps on maps.objectruanganfk=ru.id';
        }
        $data = DB::select(DB::raw("select pd.objectkelompokpasienlastfk,  pro.namaproduk, 
                    case when pp.hargadiscount is null then 0 else pp.hargadiscount end as diskon,pp.hargajual,pp.jumlah, 
                    (case 
                    when pro.id in (10011572,395,10011571) and pd.objectkelompokpasienlastfk=2 then 'Administrasi BPJS' 
                    when pro.id in (10011572,395,10011571) and pd.objectkelompokpasienlastfk <> 2 then 'Administrasi Non BPJS' 
                    when djp.objectjenisprodukfk =100 and pd.objectkelompokpasienlastfk = 2  then 'Konsultasi BPJS'
                    when djp.objectjenisprodukfk =100 and pd.objectkelompokpasienlastfk <> 2  then 'Konsultasi Non BPJS'
                    when djp.objectjenisprodukfk not in (101,100,99,27666,104,97) --visiste , konsul, akomodasi,alat canggih, usg 
                    then 'Tindakan'
                    when djp.objectjenisprodukfk= 104 then 'USG' end ) as kegiatan
                     from pasiendaftar_t as pd
                    INNER JOIN antrianpasiendiperiksa_t as apd on pd.norec=apd.noregistrasifk
                    INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                    INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                    $join
                    INNER JOIN departemen_m as dp on dp.id=ru.objectdepartemenfk
                    INNER JOIN produk_m as pro on pro.id=pp.produkfk
                    INNER JOIN detailjenisproduk_m as djp on djp.id=pro.objectdetailjenisprodukfk
                    where ru.objectdepartemenfk = 18
                    and pro.id not in (402611)
                    and djp.objectjenisprodukfk not in (97,101,27666)
                    and format(pp.tglpelayanan,'yyyy-MM') ='$monthYear'
                    $paramJenis
                    --order by urutan asc;
            "));

        return $this->respond($data);

        $data10 = [];
        foreach ($data as $item) {
            $sama = false;
            $i = 0;
            foreach ($data10 as $hideung) {
                if ($item->kegiatan == $data10[$i]['kegiatan']) {
                    $sama = true;
                    $jml = (float)$item->jumlah;
                    if ($item->objectkelompokpasienlastfk == 2) {
                        $data10[$i]['VolBpjs'] = (float)$hideung['VolBpjs'] + $jml;
                        $data10[$i]['RupBpjs'] = $data10[$i]['RupBpjs'] + ($jml * $item->hargajual);
                    }
                    if ($item->objectkelompokpasienlastfk != 2) {
                        $data10[$i]['VolNonBpjs'] = (float)$hideung['VolNonBpjs'] + $jml;
                        $data10[$i]['RupNonBpjs'] = $data10[$i]['RupNonBpjs'] + ($jml * ($item->hargajual - $item->diskon));
                    }
                    //
                    $data10[$i]['jmlVol'] =  $data10[$i]['VolNonBpjs'] + $data10[$i]['VolBpjs'];
                    $data10[$i]['jmlRup'] =  $data10[$i]['RupNonBpjs'] + $data10[$i]['RupBpjs'];
                }
                $i = $i + 1;
            }

            if ($sama == false) {
                if ($item->objectkelompokpasienlastfk == 2) {
                    $data10[] = array(
                        //                        'urutan'=>$item->urutan,
                        //                        'idkegiatan'=>$item->idkegiatan,
                        'kegiatan' => $item->kegiatan,
                        'VolBpjs' => $item->jumlah,
                        'VolNonBpjs' => 0,
                        'jmlVol' => $item->jumlah,
                        'RupBpjs' => ($item->hargajual - $item->diskon) * $item->jumlah,
                        'RupNonBpjs' => 0,
                        'jmlRup' => ($item->hargajual - $item->diskon) * $item->jumlah,
                    );
                }
                if ($item->objectkelompokpasienlastfk != 2) {
                    $data10[] = array(
                        //                        'urutan'=>$item->urutan,
                        //                        'idkegiatan'=>$item->idkegiatan,
                        'kegiatan' => $item->kegiatan,
                        'VolBpjs' => 0,
                        'VolNonBpjs' => $item->jumlah,
                        'jmlVol' => $item->jumlah,
                        'RupBpjs' => 0,
                        'RupNonBpjs' => ($item->hargajual - $item->diskon) * $item->jumlah,
                        'jmlRup' => ($item->hargajual - $item->diskon) * $item->jumlah,
                    );
                }
            }
        }
        $kodeExternal = 'IRJ';
        $year = substr($monthYear, 0, 4);
        if (isset($jenis) && $jenis != '') {
            if ($jenis == 1) {
                $kodeExternal = 'ANAK';
            }
            if ($jenis == 2) {
                $kodeExternal = 'BUNDA';
            }
        }


        $RBA = DB::select(DB::raw("
            select id,pelayanan,targetrupiah,targetvolume,tahun,kodeexternal from targetkinerja_m 
            where statusenabled= 1 
            and kodeexternal like '%$kodeExternal%'
            and tahun='$year'
        "));
        //		return $data10;
        //        $this->respond($data10);
        $resultWithRBA = [];
        foreach ($data10 as $item) {
            foreach ($RBA as $rbaa) {
                if ($rbaa->pelayanan == 'Administrasi BPJS') {
                    $urutan = 1;
                } else   if ($rbaa->pelayanan == 'Administrasi Non BPJS') {
                    $urutan = 2;
                } else  if ($rbaa->pelayanan == 'Konsultasi BPJS') {
                    $urutan = 3;
                } else  if ($rbaa->pelayanan == 'Konsultasi Non BPJS') {
                    $urutan = 4;
                } else if ($rbaa->pelayanan == 'Tindakan') {
                    $urutan = 5;
                } else if ($rbaa->pelayanan == 'USG') {
                    $urutan = 6;
                }
                if ($item['kegiatan'] == $rbaa->pelayanan) {
                    $resultWithRBA[] = array(
                        'urutan' => $urutan,
                        'kegiatan' => $item['kegiatan'],
                        'VolBpjs' => $item['VolBpjs'],
                        'VolNonBpjs' => $item['VolNonBpjs'],
                        'jmlVol' => $item['jmlVol'],
                        'RupBpjs' => $item['RupBpjs'],
                        'RupNonBpjs' => $item['RupNonBpjs'],
                        'jmlRup' => $item['jmlRup'],
                        'targetvolume' => $rbaa->targetvolume,
                        'targetrupiah' => (float)$rbaa->targetrupiah,
                        'persentasevolume' => number_format(($item['jmlVol'] / $rbaa->targetvolume) * 100, 2),
                        'persentaserp' => number_format(($item['jmlRup'] / (float)$rbaa->targetrupiah) * 100, 2),
                    );
                }
            }
        }

        if (count($resultWithRBA) != 0) {
            foreach ($resultWithRBA as $key => $row) {
                $count[$key] = $row['urutan'];
            }

            array_multisort($count, SORT_ASC, $resultWithRBA);
        }

        return $this->respond($resultWithRBA);
    }

    public function getLaporanKegiatanOperasionalDetail(Request $request)
    {
        $monthYear = $request['monthYear'];
        $jenis = $request['jenisRuanganId'];
        $join = '';
        $paramJenis = '';
        $Pro = $request['ProJenis'];
        if (isset($jenis) && $jenis != '') {
            $paramJenis = 'and maps.objectjenisruanganfk =' . $jenis;
            $join = 'left JOIN mapruangantojenisruangan_m as maps on maps.objectruanganfk=ru.id';
        }

        $paramPro = '';
        if (isset($Pro) && $Pro != '') {
            if ($Pro == 'Administrasi BPJS') {
                $paramPro = ' and pro.id in (10011572,395,10011571) and pd.objectkelompokpasienlastfk = 2';
            } elseif ($Pro == 'Administrasi Non BPJS') {
                $paramPro = ' and pro.id in (10011572,395,10011571) and pd.objectkelompokpasienlastfk <> 2';
            } elseif ($Pro == 'Konsultasi BPJS') {
                $paramPro = ' and djp.objectjenisprodukfk =100 and pd.objectkelompokpasienlastfk = 2';
            } elseif ($Pro == 'Konsultasi Non BPJS') {
                $paramPro = ' and djp.objectjenisprodukfk =100 and pd.objectkelompokpasienlastfk <> 2';
            } elseif ($Pro == 'Tindakan') {
                $paramPro = ' and djp.objectjenisprodukfk not in (101,100,99,27666,104,97)';
            } elseif ($Pro == 'USG') {
                $paramPro = ' and djp.objectjenisprodukfk= 104';
            }
        }

        $data = DB::select(DB::raw("select pd.tglregistrasi,ps.nocm,ps.nocm || '/ ' || pd.noregistrasi as noregistrasic,pd.noregistrasi,
                    ps.namapasien,ru.namaruangan,pd.objectkelasfk,kls.namakelas,pd.objectkelompokpasienlastfk,kp.kelompokpasien,
                    pd.objectkelompokpasienlastfk,pp.tglpelayanan,pro.namaproduk,pp.hargajual,pp.jumlah,
                    case when pp.hargadiscount is null then 0 else pp.hargadiscount end as diskon,
                    ((pp.hargajual - (case when pp.hargadiscount is null then 0 else pp.hargadiscount end))*pp.jumlah) as subtotal
                    from pasiendaftar_t as pd
                    INNER JOIN pasien_m as ps on ps.id=pd.nocmfk
                    INNER JOIN antrianpasiendiperiksa_t as apd on pd.norec=apd.noregistrasifk
                    INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                    INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
                    $join
                    INNER JOIN departemen_m as dp on dp.id=ru.objectdepartemenfk
                    INNER JOIN produk_m as pro on pro.id=pp.produkfk
                    INNER JOIN detailjenisproduk_m as djp on djp.id=pro.objectdetailjenisprodukfk
                    INNER JOIN kelas_m as kls on kls.id = pd.objectkelasfk
                    INNER JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk
                    where ru.objectdepartemenfk = 18
                    and pro.id not in (402611)
                    and djp.objectjenisprodukfk not in (97,101,27666)
                    and to_char(pp.tglpelayanan,'YYYY-MM') ='$monthYear'
                    $paramJenis
                    $paramPro
                    --order by urutan asc;
            "));

        $result = array(
            'data' => $data,
            'message' => 'ea@epic',
        );
        return $this->respond($result);
    }

    public function getLaporanKegiatanOperasionalRuangan(Request $request)
    {
        $monthYear = $request['monthYear'];
        $jenis = $request['jenisRuanganId'];
        $join = '';
        $paramJenis = '';
        if (isset($jenis) && $jenis != '') {
            $paramJenis = 'and maps.objectjenisruanganfk =' . $jenis;
            $join = 'left JOIN mapruangantojenisruangan_m as maps on maps.objectruanganfk=ru.id';
        }
        $data = DB::select(DB::raw("
				select  COALESCE((sum(x.jumlah) ),0)as volume , 
				COALESCE((sum(x.jumlah * x.hargajual)),0) as rupiah,
				--  COALESCE(( sum(x.jumlah) FILTER (WHERE x.kpid <> '2' ) ),0)as volnonbpjs,
				--  COALESCE(( sum(x.jumlah * x.hargajual) FILTER (WHERE x.kpid <> '2' ) ),0)as rupnonbpjs,
				x.namaruangan,x.jenis
				from (select pd.objectkelompokpasienlastfk as kpid,  pro.namaproduk, 
				
				(	case when pro.id in (10011572,395,10011571) then 'Administrasi'
				when djp.objectjenisprodukfk =100 then 'Konsultasi'
				when djp.objectjenisprodukfk not in (101,100,99,27666,104,97) --visiste , konsul, akomodasi,alat canggih, usg 
				then 'Tindakan'
				when djp.objectjenisprodukfk= 104 then 'USG' end ) as jenis,
				pp.hargajual,pp.jumlah,case when ru.id = 458 then 'Kebidanan'
				when ru.id = 6 then 'THT' 
				when ru.id in (518,5) then 'Mata' 
				when ru.id in (9) then 'Penyakit Dalam'
				when ru.id =  7 then 'Kulit Kelamin'
				when ru.id =  4 then 'Gigi & Mulut'
				when ru.id =  37 then 'Laboratorium Gigi'
				when ru.id =  19 then 'Melati'
				when ru.id =  17 then 'Gizi'
				when ru.id =  311 then 'Anestesi'
				when ru.id =  277 then 'Genetik'
				when ru.id =  230 then 'Akupuntur'
				when ru.id in  (268,98,450,33 ) then 'Klinik Anak'
				when ru.id =   11 then 'Klinik Bedah Anak'
				when ru.id =   322 then 'POTAS'
				when ru.id =   237 then 'DAHLIA'
				when ru.id =   26 then 'CLP'
				when ru.id =   245 then 'Klinik Remaja'	
				when ru.id =   97 then 'Kebidanan Flamboyan'	
				when ru.id =   3 then 'Kebidanan Anyelir'
				end as namaruangan
				from pasiendaftar_t as pd
				INNER JOIN antrianpasiendiperiksa_t as apd on pd.norec=apd.noregistrasifk
				INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
				INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
					$join
				INNER JOIN departemen_m as dp on dp.id=ru.objectdepartemenfk
				INNER JOIN produk_m as pro on pro.id=pp.produkfk
				INNER JOIN detailjenisproduk_m as djp on djp.id=pro.objectdetailjenisprodukfk
				where ru.objectdepartemenfk = 18
				and pro.id not in (402611)
				and djp.objectjenisprodukfk not in (97,101,27666)
				and format(pp.tglpelayanan,'yyyy-MM') ='$monthYear'					$paramJenis
				) as x
				GROUP BY x.namaruangan,x.jenis

            "));

        $data10 = [];
        $namaExternal = '';
        $year = substr($monthYear, 0, 4);
        if (isset($jenis) && $jenis != '') {
            if ($jenis == 1) {
                $namaExternal = 'ANAK';
            }
            if ($jenis == 2) {
                $namaExternal = 'BUNDA';
            }
        }


        $RBA = DB::select(DB::raw("
            select id,pelayanan,targetrupiah,targetvolume,tahun,kodeexternal,namaexternal from targetkinerja_m 
			where statusenabled= 1 
            and namaexternal like '%$namaExternal%'            and tahun='$year'
        "));
        //		return $RBA;
        $resultWithRBA = [];
        foreach ($data as $item) {
            foreach ($RBA as $rbaa) {
                if ($item->namaruangan == $rbaa->pelayanan  && $item->jenis == $rbaa->kodeexternal) {
                    $targetRba =  $rbaa->targetvolume != 0 ? $rbaa->targetvolume : 1;
                    $targetRbaRup =  $rbaa->targetrupiah != 0 ? $rbaa->targetrupiah : 1;
                    $resultWithRBA[] = array(
                        //						'urutan'=> $urutan,
                        'namaruangan' => $item->namaruangan,
                        'rupiah' => (float) $item->rupiah,
                        'volume' => (float)  $item->volume,
                        'jenis' => $item->jenis,
                        'targetvolume' => $rbaa->targetvolume,
                        'targetrupiah' => (float)$rbaa->targetrupiah,
                        'persentasevolume' => number_format(((float)$item->volume / (float)  $targetRba) * 100, 2),
                        'persentaserp' => number_format(((float) $item->rupiah / (float) $targetRbaRup) * 100, 2),
                    );
                }
            }
        }
        if (count($resultWithRBA) != 0) {
            foreach ($resultWithRBA as $key => $row) {
                $count[$key] = $row['jenis'];
            }

            array_multisort($count, SORT_ASC, $resultWithRBA);
        }

        return $resultWithRBA;
    }

    public function getDataPasienPerjanjian($noRegister)
    {
        $pasienDaftar = PasienDaftar::where('noregistrasi', $noRegister)->first();
        if (!$pasienDaftar) {
            //kalau tidak ditemukan
            return false;
        }

        $result = array(
            'noCm'  => $pasienDaftar->pasien->nocm,
            'noRegistrasi' => $pasienDaftar->noregistrasi,
            'jenisPasienLama'   => $pasienDaftar->kelompok_pasien->kelompokpasien,
            'jenisPasienId'   => $pasienDaftar->objectkelompokpasienlastfk,
            'namaPasien'  => $pasienDaftar->pasien->namapasien,
            'status'        => $pasienDaftar->statuspasien
        );
        return $this->respond($result);
    }

    public function getJenisPasienPerjanjian(Request $request)
    {
        $kelompokPasienID =  $this->getKelompokPasienPerjanjian();
        return $this->respond($this->getList(KelompokPasien::where('id', $kelompokPasienID), new KelompokPasienTransformer(), $request));
    }

    public function getDataDetailVerifikasi(Request $request)
    {
        $noRegistrasi = $request['noRegistrasi'];
        $result = [];
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('strukpelayanan_t as sp', 'sp.noregistrasifk', '=', 'pd.norec')
            ->leftJoin('strukbuktipenerimaan_t as sbm', 'sbm.nostrukfk', '=', 'sp.norec')
            //            ->leftJoin('logginguser_t as lg','lg.noreff','=','sp.norec')
            //            ->leftJoin('loginuser_s as lu','lu.id','=','lg.objectloginuserfk')
            //            ->join('pegawai_m as pg','pg.id','=','lu.objectpegawaifk')
            ->join('pegawai_m as pg', 'pg.id', '=', 'sp.objectpegawaipenerimafk')
            ->leftJoin('loginuser_s as lu1', 'lu1.id', '=', 'sbm.objectpegawaipenerimafk')
            ->leftJoin('pegawai_m as pg1', 'pg1.id', '=', 'lu1.objectpegawaifk')
            ->leftJoin('strukpelayananpenjamin_t as spp', 'spp.nostrukfk', '=', 'sp.norec')
            ->select(DB::raw("pd.noregistrasi,sp.norec,sp.nostruk,sp.tglstruk,sp.totalharusdibayar,pg.namalengkap as petugasverif,sbm.tglsbm,
                                    CASE WHEN sp.nosbmlastfk IS NULL THEN 'Belum Bayar' ELSE 'Lunas' END AS status,
		                            CASE WHEN sp.nosbmlastfk IS NULL THEN NULL ELSE pg1.namalengkap END AS kasir,
		                            spp.norec as norec_piutang,pd.objectkelompokpasienlastfk,sp.nosbmlastfk,spp.noverifikasi"))
            ->whereNull('sp.statusenabled')
            //            ->where('lg.jenislog','=','Verifikasi TataRekening')
            ->where('pd.noregistrasi', '=', $noRegistrasi)
            ->get();

        foreach ($data as $item) {
            $details = \DB::select(
                DB::raw("SELECT sbm.norec,sbm.tglsbm,sbm.nosbm,cb.carabayar,sbm.totaldibayar,pg.namalengkap as kasir
                        FROM strukbuktipenerimaan_t as sbm
                        INNER JOIN strukbuktipenerimaancarabayar_t as sbmc on sbmc.nosbmfk = sbm.norec
                        INNER JOIN carabayar_m as cb on cb.id = sbmc.objectcarabayarfk
                        INNER JOIN loginuser_s as lu on lu.id = sbm.objectpegawaipenerimafk
                        INNER JOIN pegawai_m as pg on pg.id = lu.objectpegawaifk
                        WHERE sbm.statusenabled = 'y' AND sbm.nostrukfk =:norec"),
                array(
                    'norec' => $item->norec,
                )
            );

            $result[] = array(
                'norec' => $item->norec,
                'nostruk' => $item->nostruk,
                'tglstruk' => $item->tglstruk,
                'totalharusdibayar' => $item->totalharusdibayar,
                'petugasverif' => $item->petugasverif,
                'tglsbm' => $item->tglsbm,
                'status' => $item->status,
                'kasir' => $item->kasir,
                'norec_piutang' => $item->norec_piutang,
                'objectkelompokpasienlastfk' => $item->objectkelompokpasienlastfk,
                'nosbmlastfk' => $item->nosbmlastfk,
                'noregistrasi' => $item->noregistrasi,
                'noverifikasi' => $item->noverifikasi,
                'details' => $details,
            );
        }

        if (count($data) == 0) {
            $result = [];
        }

        $result = array(
            'data' => $result,
            'message' => 'as@epic',
        );

        return $this->respond($result);
    }

    public function getPendapatanInstalasi(Request $request)
    {
        $data = [];
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $idDept = '';
        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
            $idDept = ' and ru.objectdepartemenfk =  ' . $request['idDept'];
        }
        $idRuangan = '';
        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
            $idRuangan = ' and ru.id = ' . $request['idRuangan'];
        }
        $idKelompok = '';
        if (isset($request['idKelompokPasien']) && $request['idKelompokPasien'] != "" && $request['idKelompokPasien'] != "undefined") {
            if ($request['idKelompokPasien'] == 153) {
                $idKelompok = 'and kps.id not in (2,4)';
            } else {
                $idKelompok = 'and kps.id = ' . $request['idKelompokPasien'];
            }
        }
        $data = DB::select(DB::raw("SELECT x.tglpencarian,x.namaruangan,x.namadepartemen,x.kelompokpasien,SUM (x.total) AS total,x.layanan
                FROM (SELECT Format (pp.tglpelayanan,'yyyy-MM-dd') AS tglpencarian,ru.namaruangan,dpm.namadepartemen,kps.kelompokpasien,
                SUM(((CASE WHEN pp.hargajual IS NULL THEN 0 ELSE pp.hargajual END - 
                CASE WHEN pp.hargadiscount IS NULL THEN 0 ELSE pp.hargadiscount END) * pp.jumlah) + CASE
                WHEN pp.jasa IS NULL THEN 0 ELSE pp.jasa END) AS total,'Layanan' as layanan
                FROM pelayananpasien_t AS pp
                JOIN antrianpasiendiperiksa_t AS apd ON apd.norec = pp.noregistrasifk
                JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk
                JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                LEFT JOIN kelompokpasien_m AS kps ON kps.id = pd.objectkelompokpasienlastfk
                LEFT JOIN departemen_m AS dpm ON dpm.id = ru.objectdepartemenfk
                WHERE  pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
                AND pp.aturanpakai IS NULL AND pd.statusenabled = 1
                $idDept
                $idRuangan
                $idKelompok
                GROUP BY ru.namaruangan,dpm.namadepartemen,kps.kelompokpasien,pp.tglpelayanan
			    UNION ALL
                SELECT Format (sp.tglstruk,'yyyy-MM-dd HH:mm') AS tglpencarian,ru.namaruangan,dp.namadepartemen,
                'Umum/Pribadi' AS kelompokpasien,
                SUM(spd.qtyproduk * (spd.hargasatuan - CASE WHEN spd.hargadiscount IS NULL THEN 0 ELSE spd.hargadiscount END) 
                + CASE WHEN spd.hargatambahan IS NULL THEN 0 ELSE spd.hargatambahan END) AS total,'Non Layanan' as layanan
                FROM strukpelayanan_t AS sp
                JOIN strukpelayanandetail_t AS spd ON spd.nostrukfk = sp.norec
                LEFT JOIN ruangan_m AS ru ON ru.id = sp.objectruanganfk
                LEFT JOIN departemen_m AS dp ON dp.id = ru.objectdepartemenfk
                WHERE sp.tglstruk BETWEEN '$tglAwal' AND '$tglAkhir'
                AND SUBSTRING(sp.nostruk, 1, 2) = 'OB'
                AND sp.statusenabled <> 0
                $idDept
                $idRuangan
                $idKelompok
                GROUP BY sp.tglstruk,ru.namaruangan,dp.namadepartemen
			    UNION ALL
                SELECT Format(pp.tglpelayanan,'yyyy-MM-dd HH:mm') AS tglpencarian,ru.namaruangan,
                dpm.namadepartemen,kps.kelompokpasien,
                SUM(((CASE WHEN pp.hargajual IS NULL THEN 0 ELSE pp.hargajual END - CASE
                WHEN pp.hargadiscount IS NULL THEN 0 ELSE pp.hargadiscount END) * pp.jumlah) + CASE
                WHEN pp.jasa IS NULL THEN 0 ELSE pp.jasa END) AS total,'Layanan' as layanan
                FROM pelayananpasien_t AS pp
                JOIN antrianpasiendiperiksa_t AS apd ON apd.norec = pp.noregistrasifk
                JOIN strukresep_t AS sr ON sr.norec = pp.strukresepfk
                JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk
                JOIN ruangan_m AS ru ON ru.id = sr.ruanganfk
                LEFT JOIN kelompokpasien_m AS kps ON kps.id = pd.objectkelompokpasienlastfk
                LEFT JOIN departemen_m AS dpm ON dpm.id = ru.objectdepartemenfk
                WHERE pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
                AND pp.aturanpakai IS NOT NULL AND pd.statusenabled = 1
                $idDept
                $idRuangan
                $idKelompok
                GROUP BY ru.namaruangan,dpm.namadepartemen,kps.kelompokpasien,pp.tglpelayanan) AS x
                GROUP BY x.tglpencarian,x.kelompokpasien,x.namaruangan,x.namadepartemen,x.layanan"));

        if (count($data) > 0) {
            foreach ($data as $key => $row) {
                $count[$key] = $row->tglpencarian;
            }
            array_multisort($count, SORT_ASC, $data);
        }
        $result = array(
            'data' => $data,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function getDatfarSyncTrans(Request $request)
    {
        // $kdProfile = $this->getDataKdProfile($request);
        $filter = $request->all();
        $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->join('alamat_m as al', 'al.nocmfk', '=', 'ps.id')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->join('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->join('kelas_m as kls', 'kls.id', '=', 'pd.objectkelasfk')
            ->join('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
            ->Join('strukpelayanan_t as sp', 'sp.norec', '=', 'pd.nostruklastfk')
            ->leftjoin('rekanan_m as rek', 'rek.id', '=', 'pd.objectrekananfk')
            ->leftjoin('asuransipasien_m as asu', 'pa.objectasuransipasienfk', '=', 'asu.id')
            ->leftjoin('kelas_m as klstg', 'klstg.id', '=', 'asu.objectkelasdijaminfk')

            ->leftjoin('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->leftjoin('golongandarah_m as gd', 'gd.id', '=', 'ps.objectgolongandarahfk')
            ->leftjoin('pendidikan_m as pdd', 'pdd.id', '=', 'ps.objectpendidikanfk')
            ->leftjoin('agama_m as agm', 'agm.id', '=', 'ps.objectagamafk')
            ->leftjoin('statusperkawinan_m as stt', 'stt.id', '=', 'ps.objectstatusperkawinanfk')
            ->leftjoin('diagnosa_m as dg', 'dg.id', '=', 'pa.objectdiagnosafk')

            ->select(
                'pd.norec',
                'pd.statusenabled',
                'pd.tglregistrasi',
                'ps.nocm',
                'pd.nocmfk',
                'pd.noregistrasi',
                'ru.namaruangan',
                'ps.namapasien',
                'ps.noidentitas',
                'ps.nobpjs',
                'kp.kelompokpasien',
                'rek.namarekanan',
                'pg.id as iddpjp',
                'pg.namalengkap as namadokter',
                'pd.tglpulang',
                'pd.statuspasien',
                'pa.norec as norec_pa',
                'pa.objectasuransipasienfk',
                'pd.objectpegawaifk as pgid',
                'pd.objectruanganlastfk',
                'pa.nosep as nosep',
                'pd.nostruklastfk',
                'klstg.namakelas as kelasditanggung',
                'kls.namakelas',
                'ps.tgllahir',
                'ru.objectdepartemenfk',
                'pd.objectkelasfk',
                'dept.id as deptid',
                'pa.ppkrujukan',
                'ps.objectjeniskelaminfk',
                'ps.objectgolongandarahfk',
                'ps.objectpendidikanfk',
                'ps.objectagamafk',
                'pa.prolanisprb',
                'ps.objectstatusperkawinanfk',
                'ps.tempatlahir',
                'ps.notelepon',
                'ps.nohp',
                'ps.objectpekerjaanfk',
                'pa.norujukan',
                'pa.tglrujukan',
                'pa.tanggalsep as tglsep',
                'pa.ppkrujukan',
                'pa.objectdiagnosafk',
                'klstg.nourut as kelastgfk',
                'pa.keteranganlaka',
                'pa.lokasilakalantas',
                'pa.lakalantas',
                'pa.penjaminlaka',
                'pa.cob',
                'pa.katarak',
                'pa.tglkejadian',
                'pa.suplesi',
                'pa.nosepsuplesi',
                'dg.kddiagnosa',
                'dg.namadiagnosa',
                'al.alamatlengkap',
                'al.objectdesakelurahanfk',
                'al.objectkecamatanfk',
                'al.rtrw',
                'al.objectkotakabupatenfk',
                'al.objectpropinsifk',
                'al.kodepos',
                'al.objectnegarafk'
            )
            ->where('pd.statusenabled', 1);
        // ->whereIn('pd.objectkelompokpasienlastfk',[2,4,10]);

        // ->where('pd.kdprofile', (int)$kdProfile);

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
            $data = $data->where('ps.nocm', 'like', '%' . $filter['norm'] . '%');
        }
        if (isset($filter['nama']) && $filter['nama'] != "" && $filter['nama'] != "undefined") {
            $data = $data->where('ps.namapasien', 'like', '%' . $filter['nama'] . '%');
        }

        if (isset($filter['jmlRows']) && $filter['jmlRows'] != "" && $filter['jmlRows'] != "undefined") {
            $data = $data->take($filter['jmlRows']);
        }

        $data = $data->orderBy('pd.noregistrasi');

        $data = $data->get();

        $data2 = [];
        // foreach ($data as $key => $value) {
        //    $diagnosa = \DB::table('antrianpasiendiperiksa_t AS apd')
        //     ->join('detaildiagnosapasien_t AS ddp','ddp.noregistrasifk','=','apd.norec')
        //     ->where('ddp.objectjenisdiagnosafk',1)
        //     ->where('apd.noregistrasifk',$value->norec)
        //     // ->where('apd.kdprofile', (int)$kdProfile)
        //     ->first();
        //     if(!empty($diagnosa)){
        //         $value->isdiagnosis = true;
        //     }else{
        //         $value->isdiagnosis = false;
        //     }
        //     $data2 []=  $value;

        //     // $i = $i+1;
        // }

        // for ($i = count($data2) - 1; $i >= 0; $i--) {
        //     if (isset($filter['isnotdiagnosis']) && $filter['isnotdiagnosis'] != "" && $filter['isnotdiagnosis'] != "undefined" && $filter['isnotdiagnosis'] != 'false' && $data2[$i]->isdiagnosis == true){
        //          array_splice($data2,$i,1);

        //     } 
        // }
        foreach ($data as $key => $value) {
            $diagnosa = \DB::table('antrianpasiendiperiksa_t AS apd')
                ->join('detaildiagnosapasien_t AS ddp', 'ddp.noregistrasifk', '=', 'apd.norec')
                ->join('diagnosa_m as dg', 'dg.id', '=', 'ddp.objectdiagnosafk')
                ->select('dg.kddiagnosa', 'dg.namadiagnosa')
                ->where('ddp.objectjenisdiagnosafk', 1)
                ->where('dg.kddiagnosa', '<>', '-')
                // ->where('apd.kdprofile', (int)$kdProfile)
                ->where('apd.noregistrasifk', $value->norec)
                // ->where('apd.kdprofile', (int)$kdProfile)
                ->first();
            if (!empty($diagnosa)) {
                $value->kddiagnosa = $diagnosa->kddiagnosa;
                $value->namadiagnosa = $diagnosa->namadiagnosa;
                $value->isdiagnosis = true;
                // $data2 []=  $value;
            } else if ($value->kddiagnosa != null) {
                $value->isdiagnosis = true;
            } else {
                $value->isdiagnosis = false;
            }
        }
        return $this->respond($data);
    }
    public function getSignatureTrans()
    {
        $baseUrl = $this->settingDataFixed('urlTransdataHealthCare');
        // $client = new \GuzzleHttp\Client();
        // $get = $client->get( $baseUrl.'get-signature?username=simrs&password=administrator');
        // $respond = json_decode ( $get->getBody()->getContents());
        // return $respond;
        $curl = curl_init();

        curl_setopt_array($curl, array(
            //                CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL =>  $baseUrl . 'get-signature?username=simrs&password=administrator',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            //            CURLOPT_POSTFIELDS => $dataJsonSend,
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json;",
                // "X-AUTH-TOKEN: ".  (string)$token,

            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result =  json_decode($response);
        }
        return $result;
    }
    public function getPasien($token, $nik)
    {
        $baseUrl = $this->settingDataFixed('urlTransdataHealthCare');
        $curl = curl_init();

        curl_setopt_array($curl, array(
            //                CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL =>  $baseUrl . 'get-pasien?nik=' . $nik,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            //            CURLOPT_POSTFIELDS => $dataJsonSend,
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json;",
                "X-AUTH-TOKEN: " .  (string)$token,

            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result =  json_decode($response);
        }
        return $result;
    }
    public function saveSyncTranss(Request $request)
    {
        $data = $request['data'];
        // $kdProfile = $this->getDataKdProfile($request);
        $getSign = $this->getSignatureTrans();
        $token = $getSign->{'X-AUTH-TOKEN'};
        $baseUrl = $this->settingDataFixed('urlTransdataHealthCare');
        //        $client = new \GuzzleHttp\Client();
        foreach ($data as $item) {
            if ($item['nobpjs'] != null && $item['nik'] != null) {
                $curl = curl_init();
                $dataJsonSend = json_encode($item);
                curl_setopt_array($curl, array(
                    //                CURLOPT_PORT => $this->getPortBrigdingBPJS(),
                    CURLOPT_URL =>  $baseUrl . 'save-pasien',
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_ENCODING => "",
                    CURLOPT_MAXREDIRS => 10,
                    CURLOPT_TIMEOUT => 30,
                    CURLOPT_SSL_VERIFYHOST => 0,
                    CURLOPT_SSL_VERIFYPEER => 0,
                    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                    CURLOPT_CUSTOMREQUEST => "POST",
                    CURLOPT_POSTFIELDS => $dataJsonSend,
                    CURLOPT_HTTPHEADER => array(
                        "Content-Type: application/json;",
                        "X-AUTH-TOKEN: " .  (string)$token,

                    ),
                ));

                $response = curl_exec($curl);
                $err = curl_error($curl);

                curl_close($curl);

                if ($err) {
                    $result = "cURL Error #:" . $err;
                } else {
                    $result =  json_decode($response);
                }
            }
        }
        return $this->respond($result);
    }
    public function saveSyncTrans(Request $request)
    {
        $data = $request['data'];
        // $kdProfile = $this->getDataKdProfile($request);
        $getSign = $this->getSignatureTrans();
        $token = $getSign->{'X-AUTH-TOKEN'};
        $baseUrl = $this->settingDataFixed('urlTransdataHealthCare');
        //        $client = new \GuzzleHttp\Client();
        foreach ($data as $item) {
            if ($item['nik'] != null) {
                $curl = curl_init();
                $dataJsonSend = json_encode($item);
                curl_setopt_array($curl, array(
                    //                CURLOPT_PORT => $this->getPortBrigdingBPJS(),
                    CURLOPT_URL =>  $baseUrl . 'save-pasien',
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_ENCODING => "",
                    CURLOPT_MAXREDIRS => 10,
                    CURLOPT_TIMEOUT => 30,
                    CURLOPT_SSL_VERIFYHOST => 0,
                    CURLOPT_SSL_VERIFYPEER => 0,
                    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                    CURLOPT_CUSTOMREQUEST => "POST",
                    CURLOPT_POSTFIELDS => $dataJsonSend,
                    CURLOPT_HTTPHEADER => array(
                        "Content-Type: application/json;",
                        "X-AUTH-TOKEN: " .  (string)$token,

                    ),
                ));

                $response = curl_exec($curl);
                $err = curl_error($curl);

                curl_close($curl);

                if ($err) {
                    $result = "cURL Error #:" . $err;
                } else {
                    $result =  json_decode($response);
                }
            }
        }
        return $this->respond($result);
    }
    public function saveSyncAlamat(Request $request)
    {
        $data = $request['data'];
        // $kdProfile = $this->getDataKdProfile($request);
        $getSign = $this->getSignatureTrans();
        $token = $getSign->{'X-AUTH-TOKEN'};
        $baseUrl = $this->settingDataFixed('urlTransdataHealthCare');
        //        $client = new \GuzzleHttp\Client();
        foreach ($data as $item) {
            if ($item['nik'] != null) {
                $curl = curl_init();
                $dataJsonSend = json_encode($item);
                curl_setopt_array($curl, array(
                    //                CURLOPT_PORT => $this->getPortBrigdingBPJS(),
                    CURLOPT_URL =>  $baseUrl . 'save-alamat-pasien',
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_ENCODING => "",
                    CURLOPT_MAXREDIRS => 10,
                    CURLOPT_TIMEOUT => 30,
                    CURLOPT_SSL_VERIFYHOST => 0,
                    CURLOPT_SSL_VERIFYPEER => 0,
                    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                    CURLOPT_CUSTOMREQUEST => "POST",
                    CURLOPT_POSTFIELDS => $dataJsonSend,
                    CURLOPT_HTTPHEADER => array(
                        "Content-Type: application/json;",
                        "X-AUTH-TOKEN: " .  (string)$token,

                    ),
                ));

                $response = curl_exec($curl);
                $err = curl_error($curl);

                curl_close($curl);

                if ($err) {
                    $result = "cURL Error #:" . $err;
                } else {
                    $result =  json_decode($response);
                }
            }
        }
        return $this->respond($result);
    }
    public function saveSyncTransEMR(Request $request)
    {
        $data = $request['data'];
        // $kdProfile = $this->getDataKdProfile($request);
        $getSign = $this->getSignatureTrans();
        $token = $getSign->{'X-AUTH-TOKEN'};
        $baseUrl = $this->settingDataFixed('urlTransdataHealthCare');
        //        $client = new \GuzzleHttp\Client();
        $pasien = $this->getPasien($token, $request['data']['nik']);
        if (isset($pasien[0])) {
            $data['pasienfk'] = $pasien[0]->id;
        }

        $noregis = $data['noregistrasi'];
        $pelayananMedis = DB::select(DB::raw("
            select apd.norec,5 as profilefk,format(apd.tglmasuk,'yyyy/MM/dd HH:mm') as tglmasuk,
            case when apd.tglkeluar is not null then  format(apd.tglkeluar,'yyyy/MM/dd HH:mm')  else null end as tglkeluar,
            ru.kdinternal as ruanganfk,
            apd.objectpegawaifk as iddpjp,pg.namalengkap as dpjp
            from antrianpasiendiperiksa_t  as apd 
            join ruangan_m as ru on ru.id =apd.objectruanganfk
            join pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
            left join pegawai_m as pg on pg.id =apd.objectpegawaifk
            where pd.noregistrasi='$noregis'"));

        $data['pelayananmedisdetail'] = [];
        $data['pelayananmedisdetail'] = $pelayananMedis;
        $datassarr = [];
        foreach ($data['pelayananmedisdetail'] as $pm) {
            $norec = $pm->norec;
            // $pm->transaksimedis =[];
            $pmd = DB::select(DB::raw("SELECT 5 as profilefk, emrdp.emrdfk as emrfk,format(emrp.tglemr,'yyyy/MM/dd HH:mm')  as  tgltransaksi,
                    --case when emrd.type='checkbox' then  ( case when emrdp.value =1 then  'Ya' else 'Tidak' end) 
                    --else end
                    emrdp.value   as deskripsi,
                    pg.id as iddpjp,pg.namalengkap as dpjp,
                    0 as jumlah, '-' as satuan, 0 as tarif, null as kelompokvariabelfk
                    FROM
                        emrpasiend_t AS emrdp
                    INNER JOIN emrpasien_t AS emrp ON emrp.noemr = emrdp.emrpasienfk
                    LEFT JOIN emrd_t AS emrd ON emrd.id = emrdp.emrdfk
                    LEFT JOIN pegawai_m AS pg ON pg.id = emrdp.pegawaifk
                    WHERE
                       emrdp.statusenabled = 1
                    -- AND emrp.noemr = 'MR2003/00000002'
                    and emrp.norec_apd='$norec'
                    "));

            //            $pm['transaksimedis'][]=  $pmd;

            // $datassarr= $pmd;
            $pmd2  = DB::select(DB::raw("select  pp.norec,5 as profilefk,  case when pp.strukresepfk is null then 2000000000 else 2000000001 end as emrfk,
            format(pp.tglpelayanan,'yyyy/MM/dd HH:mm')  as  tgltransaksi,pr.namaproduk as deskripsi,
            case when pp.strukresepfk is null then ppd.objectpegawaifk else  sr.penulisresepfk end as iddpjp,
            case when pp.strukresepfk is null then  pg.namalengkap  else    pg2.namalengkap  end as dpjp, pp.jumlah,
            case when pp.strukresepfk is null then '-' else ss.satuanstandar end as satuan,
            (((case when pp.hargasatuan is null then 0 else pp.hargasatuan  end - case when pp.hargadiscount is null then 0 
            else pp.hargadiscount end) * pp.jumlah)
            + case when pp.jasa is null then 0 else pp.jasa end) as tarif, pr.objectkelompokprodukbpjsfk as kelompokvariabelfk
            from pelayananpasien_t as pp
            join produk_m as pr on pr.id=pp.produkfk
            left join satuanstandar_m as ss on ss.id=pp.satuanviewfk
            left join strukresep_t as sr on sr.norec=pp.strukresepfk
            left join pegawai_m as pg2 on pg2.id= sr.penulisresepfk
            left join pelayananpasienpetugas_t as ppd on pp.norec=ppd.pelayananpasien and ppd.objectjenispetugaspefk=4
            left join pegawai_m as pg on pg.id= ppd.objectpegawaifk
            where pp.noregistrasifk ='$norec'"));
            //            $pm['transaksimedis'][]=  $pmd2;
            $datassarr =  array_merge($pmd, $pmd2);
            $pmd = [];
            $pmd2 = [];
            $pm->transaksimedis = $datassarr;
        }

        //   return $this->respond(  $data);

        $curl = curl_init();
        $dataJsonSend = json_encode($data);
        //        return $this->respond(   $baseUrl.'save-medical-record');
        curl_setopt_array($curl, array(
            //                CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL =>  $baseUrl . 'save-medical-record',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 60,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => $dataJsonSend,
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json;",
                "X-AUTH-TOKEN: " .  (string)$token,

            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            $result =  json_decode($response);
        }


        return $this->respond($result);
    }

    function syncAlamat($alamat, $emr, $profileRS)
    {

        // $kdProfile = $this->getDataKdProfile($request);
        $getSign = $this->getSignatureTrans();
        $token = $getSign->{'X-AUTH-TOKEN'};
        $baseUrl = $this->settingDataFixed('urlTransdataHealthCare');

        if ($alamat['nik'] != null) {
            $curl = curl_init();
            $dataJsonSend = json_encode($alamat);
            curl_setopt_array($curl, array(
                CURLOPT_URL =>  $baseUrl . 'save-alamat-pasien',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_SSL_VERIFYHOST => 0,
                CURLOPT_SSL_VERIFYPEER => 0,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => "POST",
                CURLOPT_POSTFIELDS => $dataJsonSend,
                CURLOPT_HTTPHEADER => array(
                    "Content-Type: application/json;",
                    "X-AUTH-TOKEN: " .  (string)$token,

                ),
            ));

            $response = curl_exec($curl);
            $err = curl_error($curl);

            curl_close($curl);

            if ($err) {
                $result = "cURL Error #:" . $err;
            } else {
                $result =  json_decode($response);
            }
            return  $this->syncEmr($emr, $profileRS);
            //            return $response;
        }
    }
    function syncEmr($data, $profileRS)
    {
        // $kdProfile = $this->getDataKdProfile($request);
        $getSign = $this->getSignatureTrans();
        $token = $getSign->{'X-AUTH-TOKEN'};
        $baseUrl = $this->settingDataFixed('urlTransdataHealthCare');
        //        $client = new \GuzzleHttp\Client();

        $pasien = $this->getPasien($token, $data['nik']);
        if (isset($pasien[0])) {
            $data['pasienfk'] = $pasien[0]->id;
        }


        $noregis = $data['noregistrasi'];
        $pelayananMedis = DB::select(DB::raw("
            select apd.norec,$profileRS as profilefk,format(apd.tglmasuk,'yyyy/MM/dd HH:mm') as tglmasuk,
            case when apd.tglkeluar is not null then  format(apd.tglkeluar,'yyyy/MM/dd HH:mm')  else null end as tglkeluar,
            ru.kdinternal as ruanganfk,
            apd.objectpegawaifk as iddpjp,pg.namalengkap as dpjp
            from antrianpasiendiperiksa_t  as apd 
            join ruangan_m as ru on ru.id =apd.objectruanganfk
            join pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
            left join pegawai_m as pg on pg.id =apd.objectpegawaifk
            where pd.noregistrasi='$noregis'"));

        $data['pelayananmedisdetail'] = [];
        $data['pelayananmedisdetail'] = $pelayananMedis;
        $dept = (int) $this->settingDataFixed('KdDepartemenInstalasiRadiologi');
        $deptLab = (int) $this->settingDataFixed('KdDepartemenInstalasiLaboratorium');
        foreach ($data['pelayananmedisdetail'] as $pm) {
            $norec = $pm->norec;
            // $pm->transaksimedis =[];
            $pmd = DB::select(DB::raw("SELECT $profileRS as profilefk, emrdp.emrdfk as emrfk,format(emrp.tglemr,'yyyy/MM/dd HH:mm')  as  tgltransaksi,
                    --case when emrd.type='checkbox' then  ( case when emrdp.value =1 then  'Ya' else 'Tidak' end) 
                    --else end
                    emrdp.value   as deskripsi,
                    pg.id as iddpjp,pg.namalengkap as dpjp,
                    0 as jumlah, '-' as satuan, 0 as tarif, null as kelompokvariabelfk
                    FROM
                        emrpasiend_t AS emrdp
                    INNER JOIN emrpasien_t AS emrp ON emrp.noemr = emrdp.emrpasienfk
                    LEFT JOIN emrd_t AS emrd ON emrd.id = emrdp.emrdfk
                    LEFT JOIN pegawai_m AS pg ON pg.id = emrdp.pegawaifk
                    WHERE
                       emrdp.statusenabled = 1
                    -- AND emrp.noemr = 'MR2003/00000002'
                    and emrp.norec_apd='$norec'
                    "));

            //            $pm['transaksimedis'][]=  $pmd;

            // $datassarr= $pmd;
            $pmd2  = DB::select(DB::raw("select  pp.norec,$profileRS as profilefk,  case when pp.strukresepfk is null then 
                    (case when ru.objectdepartemenfk=$dept then  2000000002
                    when ru.objectdepartemenfk=$deptLab then 2000000003 else 2000000000 end) else 2000000001 end as emrfk,
                    format(pp.tglpelayanan,'yyyy/MM/dd HH:mm')  as  tgltransaksi,pr.namaproduk as deskripsi,
                    case when pp.strukresepfk is null then ppd.objectpegawaifk else  sr.penulisresepfk end as iddpjp,
                    case when pp.strukresepfk is null then  pg.namalengkap  else    pg2.namalengkap  end as dpjp, pp.jumlah,
                    case when pp.strukresepfk is null then '-' else ss.satuanstandar end as satuan,
                    (((case when pp.hargasatuan is null then 0 else pp.hargasatuan  end - case when pp.hargadiscount is null then 0 
                    else pp.hargadiscount end) * pp.jumlah)
                    + case when pp.jasa is null then 0 else pp.jasa end) as tarif, pr.objectkelompokprodukbpjsfk as kelompokvariabelfk
                    from pelayananpasien_t as pp
                    join produk_m as pr on pr.id=pp.produkfk
                    left join satuanstandar_m as ss on ss.id=pp.satuanviewfk
                    left join strukresep_t as sr on sr.norec=pp.strukresepfk
                    left join pegawai_m as pg2 on pg2.id= sr.penulisresepfk
                    left join pelayananpasienpetugas_t as ppd on pp.norec=ppd.pelayananpasien and ppd.objectjenispetugaspefk=4
                    left join pegawai_m as pg on pg.id= ppd.objectpegawaifk
                    left join antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk
                    left join ruangan_m as ru on ru.id=apd.objectruanganfk

            where pp.noregistrasifk ='$norec'"));

            $datassarr =  array_merge($pmd, $pmd2);
            $pmd = [];
            $pmd2 = [];
            $pm->transaksimedis = $datassarr;
        }

        //           return $data;

        $curl = curl_init();
        $dataJsonSend = json_encode($data);
        //        return $this->respond(   $baseUrl.'save-medical-record');
        curl_setopt_array($curl, array(
            //                CURLOPT_PORT => $this->getPortBrigdingBPJS(),
            CURLOPT_URL =>  $baseUrl . 'save-medical-record',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 60,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => $dataJsonSend,
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json;",
                "X-AUTH-TOKEN: " .  (string)$token,

            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "cURL Error #:" . $err;
        } else {
            if (empty(json_decode($response))) {
                $result = $response;
            } else {
                $result =  json_decode($response);
            }
        }

        return $result;
    }
    public function saveSyncTransNEW(Request $request)
    {
        $profileRS = 10635;
        $query = collect(DB::select("select pd.norec,pd.tglregistrasi,
                    ps.nocm,pd.noregistrasi,ru.namaruangan,ps.namapasien,
                    ps.noidentitas as nik,	ps.nobpjs,		pg.id AS iddpjp,	pg.namalengkap AS namadokter,
                    pd.tglpulang,	pd.statuspasien,		pd.objectpegawaifk AS pgid,	pd.objectruanganlastfk,	pa.nosep AS nosep,
                    klstg.namakelas AS kelasditanggung,	kls.namakelas,	ps.tgllahir,	ru.objectdepartemenfk,	pd.objectkelasfk,
                    dept.id AS deptid,	pa.ppkrujukan,	ps.objectjeniskelaminfk,	ps.objectgolongandarahfk,	ps.objectpendidikanfk,
                    ps.objectagamafk,	pa.prolanisprb,	ps.objectstatusperkawinanfk,	ps.tempatlahir,
                    ps.notelepon,	ps.nohp,	ps.objectpekerjaanfk,	pa.norujukan,	pa.tglrujukan,	pa.tanggalsep AS tglsep,		pa.objectdiagnosafk,	klstg.nourut AS kelastgfk,
                    pa.keteranganlaka,	pa.lokasilakalantas,	pa.lakalantas,	pa.penjaminlaka,	pa.cob,	pa.katarak,	pa.tglkejadian,
                    pa.suplesi,	pa.nosepsuplesi,	dg.kddiagnosa,	dg.namadiagnosa,	al.alamatlengkap,
                    al.objectdesakelurahanfk,	al.objectkecamatanfk,	al.rtrw,	al.objectkotakabupatenfk,	al.objectpropinsifk,
                    al.kodepos,	al.objectnegarafk
                FROM
                    pasiendaftar_t AS pd
                INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk
                INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk
                INNER JOIN alamat_m AS al ON al.nocmfk = ps.id
                LEFT JOIN pegawai_m AS pg ON pg.id = pd.objectpegawaifk
                INNER JOIN kelas_m AS kls ON kls.id = pd.objectkelasfk
                INNER JOIN departemen_m AS dept ON dept.id = ru.objectdepartemenfk
                LEFT JOIN pemakaianasuransi_t AS pa ON pa.noregistrasifk = pd.norec
                LEFT JOIN asuransipasien_m AS asu ON pa.objectasuransipasienfk = asu.id
                LEFT JOIN kelas_m AS klstg ON klstg.id = asu.objectkelasdijaminfk
                LEFT JOIN jeniskelamin_m AS jk ON jk.id = ps.objectjeniskelaminfk
                LEFT JOIN golongandarah_m AS gd ON gd.id = ps.objectgolongandarahfk
                LEFT JOIN pendidikan_m AS pdd ON pdd.id = ps.objectpendidikanfk
                LEFT JOIN agama_m AS agm ON agm.id = ps.objectagamafk
                LEFT JOIN statusperkawinan_m AS stt ON stt.id = ps.objectstatusperkawinanfk
                LEFT JOIN diagnosa_m AS dg ON dg.id = pa.objectdiagnosafk
                WHERE
                    pd.statusenabled = 'y'
                    and pd.noregistrasi='$request[noregistrasi]'

                "))->first();
        // if($query->kddiagnosa ==  null){
        //     $diagnosa = \DB::table('antrianpasiendiperiksa_t AS apd')
        //         ->join('detaildiagnosapasien_t AS ddp','ddp.noregistrasifk','=','apd.norec')
        //         ->join('diagnosa_m as dg','dg.id','=','ddp.objectdiagnosafk')
        //         ->select('dg.kddiagnosa','dg.namadiagnosa')
        //         ->where('ddp.objectjenisdiagnosafk',1)
        //         ->where('apd.noregistrasifk',$query->norec)
        //         ->first();
        //     if(!empty($diagnosa)){
        //         $query->kddiagnosa =$diagnosa->kddiagnosa;
        //         $query->namadiagnosa =$diagnosa->namadiagnosa;
        //     }
        // }
        $diagnosa = \DB::table('antrianpasiendiperiksa_t AS apd')
            ->join('detaildiagnosapasien_t AS ddp', 'ddp.noregistrasifk', '=', 'apd.norec')
            ->join('diagnosa_m as dg', 'dg.id', '=', 'ddp.objectdiagnosafk')
            ->select('dg.kddiagnosa', 'dg.namadiagnosa')
            ->where('ddp.objectjenisdiagnosafk', 1)
            ->where('dg.kddiagnosa', '<>', '-')
            ->where('apd.noregistrasifk', $query->norec)
            ->first();
        $diagnosaTD = \DB::table('antrianpasiendiperiksa_t AS apd')
            ->join('diagnosatindakanpasien_t AS dp', 'dp.objectpasienfk', '=', 'apd.norec')
            ->leftjoin('detaildiagnosatindakanpasien_t as ddp', 'ddp.objectdiagnosatindakanpasienfk', '=', 'dp.norec')
            ->leftjoin('diagnosatindakan_m as dg', 'ddp.objectdiagnosatindakanfk', '=', 'dg.id')
            ->select('dg.kddiagnosatindakan', 'dg.namadiagnosatindakan')
            ->where('dg.kddiagnosatindakan', '<>', '-')
            ->where('apd.noregistrasifk', $query->norec)
            ->orderby('ddp.tglinputdiagnosa', 'desc')
            ->first();

        if (!empty($diagnosa)) {
            $query->kddiagnosa = $diagnosa->kddiagnosa;
            $query->namadiagnosa = $diagnosa->namadiagnosa;
        } else {
            // $query->kddiagnosa =$diagnosa->kddiagnosa;
            // $query->namadiagnosa =$diagnosa->namadiagnosa;
        }
        if (!empty($diagnosaTD)) {
            $query->kddiagnosatindakan = $diagnosaTD->kddiagnosatindakan;
            $query->namadiagnosatindakan = $diagnosaTD->namadiagnosatindakan;
        } else {
            $query->kddiagnosatindakan = null;
            $query->namadiagnosatindakan = null;
        }
        // return $this->respond($diagnosa);
        if ($query->kddiagnosa == null || $query->nik == null  || $query->kddiagnosa == '-') {
            $ms = '';
            if ($query->kddiagnosa == null  || $query->kddiagnosa == '-') {
                $ms = ', diagnosa kosong';
            }
            if ($query->nik == null) {
                $ms = ', NIK kosong';
            }
            $transMessage = "Sync EMR Gagal" . $ms;
            DB::rollBack();
            $result = array(
                "status" => 400,
                "message" => $transMessage,
                "as" => 'er@epic',
            );
            return $this->setStatusCode($result['status'])->respond($result, $transMessage);
        }
        //        return $this->respond($query);
        /*
         * Sync Pasien
         */
        $dataPasien = array(
            'namapasien' => $query->namapasien,
            'tgllahir' => $query->tgllahir,
            'tempatlahir' => $query->tempatlahir,
            'nik' => $query->nik,
            'nobpjs' => $query->nobpjs,
            'nokk' => null,
            'kewarganegaraan' => "Indonesia",
            'jeniskelaminfk' => $query->objectjeniskelaminfk != null ? (int)$query->objectjeniskelaminfk : null,
            'agamafk' => $query->objectagamafk != null ? (int)$query->objectagamafk : null,
            'golongandarahfk' => $query->objectgolongandarahfk != null ? (int)$query->objectgolongandarahfk : null,
            'pekerjaanfk' => $query->objectpekerjaanfk != null ? (int)$query->objectpekerjaanfk : null,
            'pendidikanfk' => $query->objectpendidikanfk != null ? (int)$query->objectpendidikanfk : null,
            'statusperkawinanfk' => $query->objectstatusperkawinanfk != null ? (int)$query->objectstatusperkawinanfk : null,
            'notelpon' => $query->notelepon,
            'nohp' => $query->nohp,

        );
        $dataAlamat = array(
            'nik' => $query->nik,
            'alamatlengkap' => $query->alamatlengkap,
            'desakelurahanfk' => $query->objectdesakelurahanfk != null ? (int)$query->objectdesakelurahanfk : null,
            'rtrw' => $query->rtrw,
            'kecamatanfk' => $query->objectkecamatanfk != null ? (int)$query->objectkecamatanfk : null,
            'kotakabupatenfk' => $query->objectkotakabupatenfk != null ? (int)$query->objectkotakabupatenfk : null,
            'provinsifk' => $query->objectpropinsifk != null ? (int)$query->objectpropinsifk : null,
            'negarafk' => $query->objectnegarafk != null ? (int)$query->objectnegarafk : null,
            'kodepos' => $query->kodepos,
        );
        $reservasi = \DB::table('antrianpasienregistrasi_t as apr')
            ->leftJoin('pasien_m as pm', 'pm.id', '=', 'apr.nocmfk')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'apr.objectruanganfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'apr.objectpegawaifk')
            ->leftJoin('kelompokpasien_m as kps', 'kps.id', '=', 'apr.objectkelompokpasienfk')
            ->select(
                DB::raw("apr.norec,
                apr.noreservasi,apr.tanggalreservasi as tanggal,
                ru.namaruangan,pg.namalengkap as dokter,
                apr.notelepon,pm.nohp,pm.noidentitas as nik,
                (case when pm.namapasien is null then apr.namapasien else pm.namapasien end) as namapasien,pm.nocm,
                '' as informasi,'Reservasi' as jenis")

            )
            ->where('apr.noreservasi', '<>', '-')
            ->where('apr.statusenabled', true)
            ->whereNotNull('apr.noreservasi')
            ->where('pm.nocm', '=', $query->nocm)
            ->where('apr.tanggalreservasi', '>=', date('Y-m-d H:i:s'))
            ->get();
        $ecg = \DB::table('eecg_t as emr')
            ->leftJoin('pasien_m as ps', 'ps.nocm', '=', 'emr.customerid')
            ->select('emr.*', 'ps.nocm', 'ps.namapasien', 'ps.noidentitas as nik')
            ->where('ps.nocm', $query->nocm)
            ->get();
        $rencana =   \DB::table('rencana_t as rm')
            ->select(
                'rm.rencana',
                'rm.tanggalinput as tglinput',
                'pg.namalengkap as petugas',
                'ru.namaruangan'
            )
            ->leftJoin('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'rm.noregistrasifk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'rm.objectpetugas')
            ->leftJoin('ruangan_m as ru', 'ru.id', '=', 'rm.objectruanganfk')
            ->where('rm.statusenabled', true)
            ->where('apd.noregistrasifk', $query->norec)
            ->get();

        $jk = $query->objectjeniskelaminfk;
        $labHasil = DB::select(DB::raw("SELECT pp.tglpelayanan as tanggal ,djp.detailjenisproduk as jenispemeriksaan,prd.namaproduk as namapemeriksaan ,
                maps.detailpemeriksaan,maps.memohasil as memohasilperiksa,
                maps.nourutdetail,hh.hasil as hasilpemeriksaan,ss.satuanstandar as satuan,nn.nilaitext as batasnormal,nn.tipedata,
                nn.nilaimin,nn.nilaimax,
                maps.nourutjenispemeriksaan,
                hh.flag,pd.noregistrasi,pd.tglregistrasi,pd.tglpulang
                FROM pelayananpasien_t  as pp
                inner join produk_m as prd on prd.id = pp.produkfk
                inner join detailjenisproduk_m as djp on djp.id = prd.objectdetailjenisprodukfk
                inner join maphasillab_m  as maps on maps.produkfk = prd.id
                inner join maphasillabdetail_m  as maps2 on maps2.maphasilfk = maps.id 
                and maps2.jeniskelaminfk ='$jk'
                inner join nilainormal_m  as nn on nn.id = maps2.nilainormalfk
                inner join antrianpasiendiperiksa_t as apd on apd.norec = pp.noregistrasifk
                inner join pasiendaftar_t as pd on pd.norec = apd.noregistrasifk
                inner join pasien_m as ps on ps.id = pd.nocmfk
                left join satuanstandar_m  as ss on ss.id = maps.satuanstandarfk
                 join hasillaboratorium_t  as hh on hh.norecpelayanan  = pp.norec 
                and pp.noregistrasifk=hh.noregistrasifk
                and maps.detailpemeriksaan =hh.detailpemeriksaan 
                where pd.statusenabled=true
                 and pd.noregistrasi='$request[noregistrasi]'
                group by pp.tglpelayanan ,pp.noregistrasifk ,djp.detailjenisproduk,pp.produkfk,prd.namaproduk ,maps.detailpemeriksaan,maps.memohasil,
                maps.nourutdetail,maps.satuanstandarfk,ss.satuanstandar,nn.nilaitext,nn.tipedata,nn.nilaimin,nn.nilaimax,hh.hasil,
                maps.id ,hh.norec ,maps.nourutjenispemeriksaan,maps.nourutdetail,pp.norec ,
                hh.flag,nn.id ,maps2.jeniskelaminfk,pd.noregistrasi,pd.tglregistrasi,pd.tglpulang
                order by  maps.nourutjenispemeriksaan,maps.nourutdetail asc"));
        $dataEMR = array(
            "nik" => $query->nik,
            "noregistrasi" => $query->noregistrasi,
            "profilefk" => $profileRS,
            "tglregistrasi" => $query->tglregistrasi,
            "norm" => $query->nocm,
            "tglpulang" => $query->tglpulang,
            "norujukan" => $query->norujukan,
            "tglrujukan" => $query->tglrujukan,
            "nosep" => $query->nosep,
            "tglsep" => $query->tglsep != null && $query->tglsep != '' ? $query->tglsep : null,
            "ppkpelayanan" => $query->ppkrujukan,
            "diagnosafk" => $query->objectdiagnosafk,
            "lokasilakalantas" => $query->lokasilakalantas,
            "penjaminlaka" => $query->penjaminlaka,
            "cob" => $query->cob,
            "katarak" => $query->katarak,
            "keteranganlaka" => $query->keteranganlaka,
            "tglkejadian" => $query->tglkejadian,
            "suplesi" => $query->suplesi,
            "nosepsuplesi" => $query->nosepsuplesi,
            "iddpjp" => $query->iddpjp,
            "dpjp" => $query->namadokter,
            "prolanisprb" => $query->prolanisprb,
            "kelasfk" => $query->kelastgfk ==  null ? $query->objectkelasfk :  $query->kelastgfk,
            "kddiagnosa" => $query->kddiagnosa,
            "namadiagnosa" => $query->namadiagnosa,
            "kddiagnosatindakan" => $query->kddiagnosatindakan,
            "namadiagnosatindakan" => $query->namadiagnosatindakan,
            "reservasi" => $reservasi,
            "hasil_lab" => $labHasil,
            "ecg" => $ecg,
            "rencana" => $rencana
        );


        //      return $this->respond($dataEMR);
        $getSign = $this->getSignatureTrans();
        $token = $getSign->{'X-AUTH-TOKEN'};
        $baseUrl = $this->settingDataFixed('urlTransdataHealthCare');

        if ($dataPasien['nik'] != null) {
            $curl = curl_init();
            $dataJsonSend = json_encode($dataPasien);
            curl_setopt_array($curl, array(
                CURLOPT_URL =>  $baseUrl . 'save-pasien',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_SSL_VERIFYHOST => 0,
                CURLOPT_SSL_VERIFYPEER => 0,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => "POST",
                CURLOPT_POSTFIELDS => $dataJsonSend,
                CURLOPT_HTTPHEADER => array(
                    "Content-Type: application/json;",
                    "X-AUTH-TOKEN: " .  (string)$token,

                ),
            ));

            $response = curl_exec($curl);
            $err = curl_error($curl);

            curl_close($curl);

            if ($err) {
                $result = "cURL Error #:" . $err;
            } else {
                $result =  json_decode($response);
            }
            return $this->respond($this->syncAlamat($dataAlamat, $dataEMR, $profileRS));
        }
    }

    public function getPendapatanPerPasien(Request $request)
    {
        $data = [];
        $tglAwal = $request['tglAwal'];
        $tglAkhir = $request['tglAkhir'];
        $idDept = '';
        if (isset($request['idDept']) && $request['idDept'] != "" && $request['idDept'] != "undefined") {
            $idDept = ' and ru.objectdepartemenfk =  ' . $request['idDept'];
        }
        $idRuangan = '';
        if (isset($request['idRuangan']) && $request['idRuangan'] != "" && $request['idRuangan'] != "undefined") {
            $idRuangan = ' and ru.id = ' . $request['idRuangan'];
        }
        $idKelompok = '';
        if (isset($request['idKelompokPasien']) && $request['idKelompokPasien'] != "" && $request['idKelompokPasien'] != "undefined") {
            if ($request['idKelompokPasien'] == 153) {
                $idKelompok = 'and kps.id not in (2,4)';
            } else {
                $idKelompok = 'and kps.id = ' . $request['idKelompokPasien'];
            }
        }
        $data = DB::select(DB::raw("SELECT x.namapasien,x.nocm,x.noregistrasi,x.tglpencarian,x.namaruangan,x.namadepartemen,x.kelompokpasien,SUM (x.total) AS total,x.layanan
                                FROM (SELECT pm.namapasien,pm.nocm,pd.noregistrasi,Format (pp.tglpelayanan,'yyyy-MM-dd') AS tglpencarian,ru.namaruangan,dpm.namadepartemen,kps.kelompokpasien,
                SUM(((CASE WHEN pp.hargajual IS NULL THEN 0 ELSE pp.hargajual END -
                CASE WHEN pp.hargadiscount IS NULL THEN 0 ELSE pp.hargadiscount END) * pp.jumlah) + CASE
                WHEN pp.jasa IS NULL THEN 0 ELSE pp.jasa END) AS total,'Layanan' as layanan
                FROM pelayananpasien_t AS pp
                JOIN antrianpasiendiperiksa_t AS apd ON apd.norec = pp.noregistrasifk
                JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk
                JOIN pasien_m AS pm ON pm.id = pd.nocmfk
                JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk
                LEFT JOIN kelompokpasien_m AS kps ON kps.id = pd.objectkelompokpasienlastfk
                LEFT JOIN departemen_m AS dpm ON dpm.id = ru.objectdepartemenfk
                WHERE  pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
                AND pp.aturanpakai IS NULL AND pd.statusenabled = 1
                $idDept
                $idRuangan
                $idKelompok
                GROUP BY pm.namapasien,pm.nocm,pd.noregistrasi,ru.namaruangan,dpm.namadepartemen,kps.kelompokpasien,pp.tglpelayanan
			    UNION ALL
                SELECT sp.namapasien_klien as namapasien,sp.nostruk_intern as nocm,'-' as noregistrasi,Format (sp.tglstruk,'yyyy-MM-dd HH:mm') AS tglpencarian,ru.namaruangan,dp.namadepartemen,
                'Umum/Pribadi' AS kelompokpasien,
                SUM(spd.qtyproduk * (spd.hargasatuan - CASE WHEN spd.hargadiscount IS NULL THEN 0 ELSE spd.hargadiscount END) 
                + CASE WHEN spd.hargatambahan IS NULL THEN 0 ELSE spd.hargatambahan END) AS total,'Non Layanan' as layanan
                FROM strukpelayanan_t AS sp
                JOIN strukpelayanandetail_t AS spd ON spd.nostrukfk = sp.norec
                LEFT JOIN ruangan_m AS ru ON ru.id = sp.objectruanganfk
                LEFT JOIN departemen_m AS dp ON dp.id = ru.objectdepartemenfk
                WHERE sp.tglstruk BETWEEN '$tglAwal' AND '$tglAkhir'
                AND SUBSTRING(sp.nostruk, 1, 2) = 'OB'
                AND sp.statusenabled <> 0
                $idDept
                $idRuangan
                $idKelompok
                GROUP BY sp.namapasien_klien,sp.nostruk_intern,sp.tglstruk,ru.namaruangan,dp.namadepartemen
			    UNION ALL
                SELECT pm.namapasien,pm.nocm,pd.noregistrasi,Format(pp.tglpelayanan,'yyyy-MM-dd HH:mm') AS tglpencarian,ru.namaruangan,
                dpm.namadepartemen,kps.kelompokpasien,
                SUM(((CASE WHEN pp.hargajual IS NULL THEN 0 ELSE pp.hargajual END - CASE
                WHEN pp.hargadiscount IS NULL THEN 0 ELSE pp.hargadiscount END) * pp.jumlah) + CASE
                WHEN pp.jasa IS NULL THEN 0 ELSE pp.jasa END) AS total,'Layanan' as layanan
                FROM pelayananpasien_t AS pp
                JOIN antrianpasiendiperiksa_t AS apd ON apd.norec = pp.noregistrasifk
                JOIN strukresep_t AS sr ON sr.norec = pp.strukresepfk
                JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk
                JOIN pasien_m AS pm ON pm.id = pd.nocmfk
                JOIN ruangan_m AS ru ON ru.id = sr.ruanganfk
                LEFT JOIN kelompokpasien_m AS kps ON kps.id = pd.objectkelompokpasienlastfk
                LEFT JOIN departemen_m AS dpm ON dpm.id = ru.objectdepartemenfk
                WHERE pp.tglpelayanan BETWEEN '$tglAwal' AND '$tglAkhir'
                AND pp.aturanpakai IS NOT NULL AND pd.statusenabled = 1
                $idDept
                $idRuangan
                $idKelompok
                GROUP BY pm.namapasien,pm.nocm,pd.noregistrasi,ru.namaruangan,dpm.namadepartemen,kps.kelompokpasien,pp.tglpelayanan) AS x
                GROUP BY  x.namapasien,x.nocm,x.noregistrasi,x.tglpencarian,x.kelompokpasien,x.namaruangan,x.namadepartemen,x.layanan"));

        if (count($data) > 0) {
            foreach ($data as $key => $row) {
                $count[$key] = $row->tglpencarian;
            }
            array_multisort($count, SORT_ASC, $data);
        }
        $result = array(
            'data' => $data,
            'message' => 'ramdanegie',
        );
        return $this->respond($result);
    }
    public function detailTagihankomponen($noRegister, Request $request)
    {
        $pelayanan = \DB::table('pasiendaftar_t as pd')
            ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->leftjoin('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->leftjoin('detailjenisproduk_m as djp', 'djp.id', '=', 'pr.objectdetailjenisprodukfk')
            ->leftjoin('jenisproduk_m as jp', 'jp.id', '=', 'djp.objectjenisprodukfk')
            ->leftjoin('kelompokprodukbpjs_m as kpBpjs', 'kpBpjs.id', '=', 'pr.objectkelompokprodukbpjsfk')
            ->leftjoin('kelas_m as kl', 'kl.id', '=', 'apd.objectkelasfk')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('ruangan_m as ru2', 'ru2.id', '=', 'pd.objectruanganlastfk')
            ->join('pasien_m as pas', 'pas.id', '=', 'pd.nocmfk')
            ->leftjoin('agama_m as ag', 'ag.id', '=', 'pas.objectagamafk')
            ->leftjoin('jeniskelamin_m as jkel', 'jkel.id', '=', 'pas.objectjeniskelaminfk')
            ->leftjoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftjoin('kelas_m as kls', 'kls.id', '=', 'apd.objectkelasfk')
            ->leftjoin('kelas_m as kls2', 'kls2.id', '=', 'pd.objectkelasfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            ->leftjoin('pegawai_m as pgpj', 'pgpj.id', '=', 'pd.objectpegawaifk')
            ->leftjoin('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
            ->leftjoin('strukresep_t as sr', 'sr.norec', '=', 'pp.strukresepfk')
            ->leftjoin('ruangan_m as rusr', 'rusr.id', '=', 'sr.ruanganfk')
            ->leftjoin('kamar_m as kamar', 'kamar.id', '=', 'apd.objectkamarfk')
            ->leftjoin('pegawai_m as pgsr', 'pgsr.id', '=', 'sr.penulisresepfk')
            ->leftjoin('strukpelayanan_t as sp', 'sp.norec', '=', 'pp.strukfk')
            ->leftjoin('strukpelayananpenjamin_t as sppj', 'sp.norec', '=', 'sppj.nostrukfk')
            ->leftjoin('strukbuktipenerimaan_t as sbm', 'sp.nosbmlastfk', '=', 'sbm.norec')
            ->leftjoin('pegawai_m as pgsbm', 'pgsbm.id', '=', 'sbm.objectpegawaipenerimafk')
            ->select(
                'pp.norec',
                'pp.tglpelayanan',
                'pp.rke',
                'pr.id as prid',
                'pr.namaproduk',
                'pp.jumlah',
                'kl.id as klid',
                'kl.namakelas',
                'ru.id as ruid',
                'ru.namaruangan',
                'pp.produkfk',
                'pp.hargajual',
                'pp.hargadiscount',
                'sp.nostruk',
                'sp.tglstruk',
                'apd.norec as norec_apd',
                'pg.id as pgid',
                'pg.namalengkap',
                'sbm.nosbm',
                'sp.norec as norec_sp',
                'pp.jasa',
                'pd.nocmfk',
                'ru2.objectdepartemenfk as deptid',
                'pd.nocmfk',
                'pd.nostruklastfk',
                'ag.id as agid',
                'ag.agama',
                'pas.tgllahir',
                'kp.id as kpid',
                'kp.kelompokpasien',
                'pas.objectstatusperkawinanfk',
                'pas.namaayah',
                'pas.namasuamiistri',
                'pas.id as pasid',
                'pas.nocm',
                'jkel.id as jkelid',
                'jkel.jeniskelamin',
                'jkel.reportdisplay as jk',
                'pd.noregistrasi',
                'pas.namapasien',
                'pd.tglregistrasi',
                'pd.norec as norec_pd',
                'pd.tglpulang',
                'pas.notelepon',
                'kls.id as klsid',
                'kls.namakelas',
                'pd.objectrekananfk as rekananid',
                'ru2.namaruangan as ruanganlast',
                'kls2.id as klsid2',
                'kls2.namakelas as namakelas2',
                'sr.noresep',
                'rk.namarekanan',
                'rusr.namaruangan as ruanganfarmasi',
                'pgsr.namalengkap as penulisresep',
                'jp.jenisproduk',
                'kpBpjs.kelompokprodukbpjs as kelompokprodukbpjs',
                'pgpj.namalengkap as dokterpj',
                'pp.jasa',
                'kamar.namakamar',
                'sp.totalharusdibayar',
                'sp.totalprekanan',
                'sppj.totalppenjamin',
                'sp.totalbiayatambahan',
                'pgsbm.namalengkap as namalengkapsbm',
                'pd.kdprofile',
                'pp.aturanpakai',
                'pd.statuspasien',
                'ru2.id as ruanganlastid'
            )
            ->where('pd.noregistrasi', $noRegister)
            ->orderBy('pp.tglpelayanan', 'pp.rke');

        if ($request['jenisdata'] == 'resep') {
            $pelayanan = $pelayanan->whereNotNull('pp.aturanpakai');
        }
        if ($request['jenisdata'] == 'layanan') {
            if (isset($request['idruangan']) && $request['idruangan'] != "" && $request['idruangan'] != "undefined") {
                $pelayanan = $pelayanan->where('apd.objectruanganfk', $request['idruangan']);
            };
            $pelayanan = $pelayanan->whereNull('pp.aturanpakai');
        }
        $pelayanan = $pelayanan->get();


        if (count($pelayanan) > 0) {
            $alamat = [];
            $alamat = \DB::table('alamat_m as al')
                ->select('al.alamatlengkap')
                ->where('al.nocmfk', $pelayanan[0]->nocmfk)
                ->first();

            if (empty($alamat)) {
                $alamatTea = '0';
            } else {
                $alamatTea = $alamat->alamatlengkap;
            }

            $totalBilling = 0;
            $norecAPD = '';
            $norecSP = '';
            $details = array();
            $dibayar = 0;
            $diverif = 0;
            foreach ($pelayanan as $value) {
                $isRawatInap = false;
                if ($value->deptid == 16) {
                    $isRawatInap = true;
                }
                if ($value->produkfk == $this->getProdukIdDeposit()) {
                    continue;
                }
            }
        }
        try {
            $rekanan = [];
            $rekanan = \DB::table('rekanan_m as al')
                ->select('al.namarekanan')
                ->where('al.id', $pelayanan[0]->rekananid)
                ->first();
            $penjamin = $rekanan->namarekanan;
        } catch (\Exception $e) {
            $penjamin = '-';
        }
        try {
            $kelompokPasien = $pelayanan[0]->kelompokpasien;
        } catch (\Exception $e) {
            $kelompokPasien = '-';
        }

        try {
            $agama = $pelayanan[0]->agama;
        } catch (\Exception $e) {
            $agama = '-';
        }
        try {
            $umur = $this->hitungUmur($pelayanan[0]->tgllahir);
        } catch (\Exception $e) {
            $umur = '-';
        }

        $keluarga = '-';
        try {
            if ($pelayanan[0]->objectstatusperkawinanfk == '1') {
                $keluarga = $pelayanan[0]->namaayah;
            } else {
                $keluarga = $pelayanan[0]->namasuamiistri;
            }
        } catch (\Exception $e) {
            $keluarga = '-';
        }




        $pelayanandetail = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('pelayananpasiendetail_t as ppd', 'ppd.noregistrasifk', '=', 'apd.norec')
            ->join('komponenharga_m as kh', 'kh.id', '=', 'ppd.komponenhargafk')
            ->join('produk_m as pr', 'ppd.produkfk', '=', 'pr.id')
            ->join('kelas_m as kl', 'pd.objectkelasfk', '=', 'kl.id')
            ->join('pelayananpasien_t as pp', 'pp.norec', '=', 'ppd.pelayananpasien')
            ->leftjoin('pelayananpasienpetugas_t as ppg', 'pp.norec', '=', 'ppg.pelayananpasien')
            ->leftjoin('pegawai_m as pg', 'ppg.objectpegawaifk', '=', 'pg.id')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->select('pr.namaproduk as namaPelayanan', 'pp.produkfk', 'ppd.komponenhargafk', 'kl.namakelas as kelasTindakan', 'pr.namaproduk', 'ppd.pelayananpasien as norec_pp', 'ppd.norec', 'kh.komponenharga', 'ppd.jumlah', 'ppd.hargasatuan as hargakomponen', 'ppd.hargadiscount', 'ru.namaruangan as ruanganTindakan', 'pp.hargasatuan as tarif', 'pp.tglpelayanan as tglPelayanan ', 'pp.jumlah', DB::raw('pp.jumlah * pp.hargasatuan as totaltarif'), DB::raw('ppd.jumlah * ppd.hargasatuan as totalkomponen'), 'apd.objectruanganfk')
            ->where('pd.noregistrasi', $noRegister)
            ->distinct()
            // ->whereIn('objectjenispetugaspefk', array('4'))
            ->orderBy('pp.tglpelayanan');

        if ($request['jenisdata'] == 'resep') {
            $pelayanandetail = $pelayanandetail->whereNotNull('pp.aturanpakai');
        }
        if ($request['jenisdata'] == 'layanan') {
            if (isset($request['idruangan']) && $request['idruangan'] != "" && $request['idruangan'] != "undefined") {
                $pelayanandetail = $pelayanandetail->where('apd.objectruanganfk', $request['idruangan']);
            };
            $pelayanandetail = $pelayanandetail->whereNull('pp.aturanpakai');
        }
        if (isset($request['komponen']) && $request['komponen'] != "" && $request['komponen'] != "undefined") {
            $pelayanandetail = $pelayanandetail->where('ppd.komponenhargafk', $request['komponen']);
        };
        $pelayanandetail = $pelayanandetail->get();

        $pelayanandetailverif = \DB::table('jasapelayanan_t')
            ->where('noregistrasi', $noRegister)
            ->get();

        $pelayananpetugas = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('pelayananpasienpetugas_t as ptu', 'ptu.nomasukfk', '=', 'apd.norec')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'ptu.objectpegawaifk')
            ->select('ptu.pelayananpasien', 'pg.namalengkap', 'pg.id')
            ->where('ptu.objectjenispetugaspefk', 4)
            ->where('pd.noregistrasi', $noRegister)
            ->get();


        foreach ($pelayanandetail as $itm) {
            $status = "belum";
            foreach ($pelayanandetailverif as $itm2) {
                if ($itm->produkfk == $itm2->produkfk && $itm->komponenhargafk == $itm2->jeniskomponen) {
                    $status = "verif";
                }
            }
            $NamaDokter = '-';
            $iddokter = '000';
            foreach ($pelayananpetugas as $hahaha) {
                if ($hahaha->pelayananpasien == $itm->norec_pp) {
                    $NamaDokter = $hahaha->namalengkap;
                    $iddokter = $hahaha->id;
                }
            }
            $pelayanandetailfix[] = array(
                'namaPelayanan' => $itm->namaproduk,
                'ruanganfk' => $itm->objectruanganfk,
                'produkfk' => $itm->produkfk,
                'komponenhargafk' => $itm->komponenhargafk,
                'dokter' => $NamaDokter,
                'idpetugas' => $iddokter,
                'kelasTindakan' => $itm->kelasTindakan,
                'namaproduk' => $itm->namaproduk,
                'norec' => $itm->norec,
                'norec_pp' => $itm->norec_pp,
                'tglPelayanan' => $itm->tglPelayanan,
                'komponenharga' => $itm->komponenharga,
                'jumlah' => (float)$itm->jumlah,
                'totaltarif' => (float)$itm->totaltarif,
                'totalkomponen' => (float)$itm->totalkomponen,
                'hargakomponen' => $itm->hargakomponen,
                'tarif' => $itm->tarif,
                'ruanganTindakan' => $itm->ruanganTindakan,
                'status' => $status,
                // 'objectjenispetugaspefk' => $itm->objectjenispetugaspefk

            );
        }



        $dataTotalBill = DB::select(
            DB::raw("select sum(((case when pp.hargajual is null then 0 else pp.hargajual  end - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah) + case when pp.jasa is null then 0 else pp.jasa end) as total
                        from pasiendaftar_t as pd
                        INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                        INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                        where  pd.noregistrasi=:noregistrasi and pp.produkfk not in (402611) ;
                    "),
            array(
                'noregistrasi' => $noRegister,
            )
        );
        $totalBilling = 0;
        $totalBilling = $dataTotalBill[0]->total;

        $dataTotaldibayar = DB::select(
            DB::raw("select sum(((case when pp.hargajual is null then 0 else pp.hargajual  end - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah) + case when pp.jasa is null then 0 else pp.jasa end) as total
                        from pasiendaftar_t as pd
                        INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                        INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                        INNER JOIN strukpelayanan_t as sp on sp.norec=pp.strukfk
                        where  pd.noregistrasi=:noregistrasi and sp.nosbmlastfk is not null and pp.produkfk not in (402611);
                    "),
            array(
                'noregistrasi' => $noRegister,
            )
        );
        $dibayar = 0;
        $dibayar = $dataTotaldibayar[0]->total;

        $dataTotalverif = DB::select(
            DB::raw("select sum(((case when pp.hargajual is null then 0 else pp.hargajual  end - case when pp.hargadiscount is null then 0 else pp.hargadiscount end) * pp.jumlah) + case when pp.jasa is null then 0 else pp.jasa end) as total
                        from pasiendaftar_t as pd
                        INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
                        INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec
                        where  pd.noregistrasi=:noregistrasi and pp.strukfk is not null and pp.produkfk not in (402611)
                    "),
            array(
                'noregistrasi' => $noRegister,
            )
        );
        $diverif = 0;
        $diverif = $dataTotalverif[0]->total;

        $result = array(
            'pasienID' => $pelayanan[0]->pasid,
            'noCm' => $pelayanan[0]->nocm,
            'jenisKelamin' => $pelayanan[0]->jeniskelamin,
            'noRegistrasi' => $pelayanan[0]->noregistrasi,
            'namaPasien' => $pelayanan[0]->namapasien,
            'lastRuangan' => $pelayanan[0]->ruanganlast,
            'tglMasuk' => $pelayanan[0]->tglregistrasi,
            'tglPulang' => $pelayanan[0]->tglpulang,
            'jenisPasien' => $kelompokPasien,
            'kelasRawat' => $pelayanan[0]->namakelas2,
            'kelasId' => $pelayanan[0]->klsid2,
            'noAsuransi' => '-',
            'kelasPenjamin' => '-',
            'namaPenjamin' => $penjamin,
            'penjamin' => $penjamin,
            'deposit' => $this->getDepositPasien($pelayanan[0]->noregistrasi),
            'totalKlaim' => 0,
            'jumlahBayar' => 0,
            'jumlahPiutang' => 0,
            'billing' => $totalBilling,
            'norec_pd' => $pelayanan[0]->norec_pd,
            'strukfk' => $value->nostruk,
            'telepon' => $pelayanan[0]->notelepon,
            'alamat' => $alamatTea,
            'tgllahir' => $pelayanan[0]->tgllahir,
            'agama' => $agama,
            'umur' => $umur,
            'keluarga' => $keluarga,
            'details' => $pelayanandetailfix,
            'lalal' => $pelayanan[0]->nostruklastfk,
            '$isRawatInap' => $isRawatInap,
            'diverif' => $diverif,
            'dibayar' => $dibayar,
            'statuspasien' => $pelayanan[0]->statuspasien,
            'ruanganlastid' => $pelayanan[0]->ruanganlastid,
            // 'beratBadan' => $pelayanan[0]->beratbadan,
        );



        return $this->respond($result);
    }
    public function detailTagihanVerifikasipenjamin($noRegister, Request $request)
    {
        $dataRuangan = \DB::table('pasiendaftar_t as pd')
        ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
        ->select('ru.namaruangan as namaruangan')
        ->where('pd.noregistrasi', $noRegister)
            ->first();

        $pelayanan = [];
        $datasudahada = \DB::table('pembayarantindakanperpenjamin_t as pd')
        ->where('pd.noregistrasi', $noRegister)
            ->take(1)
            ->get();
        $ada = false;
        if (count($datasudahada) > 0) {
            $ada = true;
        }
        $dataRekanan2 = \DB::table('mapkelompokpasientopenjamin_m as mkp')
        ->join('kelompokpasien_m as kp', 'kp.id', '=', 'mkp.objectkelompokpasienfk')
        ->join('rekanan_m as rk', 'rk.id', '=', 'mkp.kdpenjaminpasien')
        ->select('rk.id', 'rk.namarekanan', 'kp.id as id_kelompokpasien', 'kp.kelompokpasien')

        ->where('mkp.statusenabled', true)
        ->get();
        if ($ada) {
            $pelayanan = \DB::table('pasiendaftar_t as pd')
            ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->leftjoin('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->leftjoin('kelas_m as kl', 'kl.id', '=', 'apd.objectkelasfk')
            ->leftjoin('pembayarantindakanperpenjamin_t as ptp', 'ptp.norecpp', '=', 'pp.norec')
            ->leftjoin('rekanan_m as rk', DB::raw("rk.id::varchar "), '=', 'ptp.idrekanan1')
            ->leftjoin('kelompokpasien_m as kp',  DB::raw("kp.id::varchar "), '=', 'ptp.jenis1')
            ->leftjoin('rekanan_m as rk2', DB::raw("rk2.id::varchar "), '=', 'ptp.idrekanan2')
            ->leftjoin('kelompokpasien_m as kp2', DB::raw("kp2.id::varchar "), '=', 'ptp.jenis2')

            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->select(
                'pp.norec',
                'pp.tglpelayanan',
                'pp.rke',
                'pr.id as prid',
                'pr.namaproduk',
                'pp.jumlah',
                'kl.id as klid',
                'kl.namakelas',
                'ru.id as ruid',
                'ru.namaruangan',
                'pp.produkfk',
                'pp.hargajual',
                'pp.hargadiscount',
                'apd.norec as norec_apd',
                'pp.jasa',
                'pd.nocmfk',
                'pd.nostruklastfk',
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'pd.norec as norec_pd',
                'pd.tglpulang',
                'pd.objectrekananfk as rekananid',
                'pp.jasa',
                'pd.kdprofile',
                'pp.aturanpakai',
                'pp.iscito',
                'pd.statuspasien',
                'pp.isparamedis',
                'ptp.pasien',
                'ptp.penjamin1',
                'ptp.penjamin2',
                'rk.namarekanan',
                'rk2.namarekanan as namarekanan2',
                'ptp.idrekanan1',
                'ptp.idrekanan2',
                'ptp.jenis1',
                'ptp.jenis2',
                'kp.kelompokpasien',
                'kp2.kelompokpasien as kelompokpasien2'
            )

                ->where('pd.noregistrasi', $noRegister)
                ->orderBy('pp.tglpelayanan', 'pp.rke');
            if (isset($request['pelayanan']) && $request['pelayanan'] != "" && $request['pelayanan'] != "undefined") {
                $pelayanan = $pelayanan->where('pr.namaproduk', 'like', $request['pelayanan']);
            };
            if (isset($request['ruangan']) && $request['ruangan'] != "" && $request['ruangan'] != "undefined") {
                $pelayanan = $pelayanan->where('ru.id', '=', $request['ruangan']);
            };
            $pelayanan = $pelayanan->get();
        } else {
            $pelayanan = \DB::table('pasiendaftar_t as pd')
            ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
            ->leftjoin('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
            ->leftjoin('kelas_m as kl', 'kl.id', '=', 'apd.objectkelasfk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->select(
                'pp.norec',
                'pp.tglpelayanan',
                'pp.rke',
                'pr.id as prid',
                'pr.namaproduk',
                'pp.jumlah',
                'kl.id as klid',
                'kl.namakelas',
                'ru.id as ruid',
                'ru.namaruangan',
                'pp.produkfk',
                'pp.hargajual',
                'pp.hargadiscount',
                'apd.norec as norec_apd',
                'pp.jasa',
                'pd.nocmfk',
                'pd.nostruklastfk',
                'pd.noregistrasi',
                'pd.tglregistrasi',
                'pd.norec as norec_pd',
                'pd.tglpulang',
                'pd.objectrekananfk as rekananid',
                'pp.jasa',
                'pd.kdprofile',
                'pp.aturanpakai',
                'pp.iscito',
                'pd.statuspasien',
                'pp.isparamedis'
            )

                ->where('pd.noregistrasi', $noRegister)
                ->orderBy('pp.tglpelayanan', 'pp.rke');
            if (isset($request['pelayanan']) && $request['pelayanan'] != "" && $request['pelayanan'] != "undefined") {
                $pelayanan = $pelayanan->where('pr.namaproduk', 'ilike', $request['pelayanan']);
            };
            if (isset($request['ruangan']) && $request['ruangan'] != "" && $request['ruangan'] != "undefined") {
                $pelayanan = $pelayanan->where('ru.id', '=', $request['ruangan']);
            };
            $pelayanan = $pelayanan->get();
        }



        if (count($pelayanan) > 0) {

            $totalBilling = 0;
            $norecAPD = '';
            $norecSP = '';
            $details = array();
            $dibayar = 0;
            $diverif = 0;
            foreach ($pelayanan as $value) {
                if ($value->produkfk == $this->getProdukIdDeposit()) {
                    continue;
                }
                if ($value->namaproduk == null) {
                    continue;
                }
                $jasa = 0;
                if (isset($value->jasa) && $value->jasa != "" && $value->jasa != "undefined") {
                    $jasa = $value->jasa;
                }
                $kmpn = [];

                $harga = (float)$value->hargajual;
                $diskon = (float)$value->hargadiscount;
                if ($ada) {
                    $pasien = 0;
                    $penjamin1 = 0;
                    $penjamin2 = 0;
                    if ($value->penjamin1 != null) {
                        $pasien = $value->pasien;
                    }

                    if ($value->penjamin1 != null) {
                        $penjamin1 = $value->penjamin1;
                    }

                    if ($value->penjamin2 != null) {
                        $penjamin2 = $value->penjamin2;
                    }

                    $detail = array(
                        'norec' => $value->norec,
                        'tglPelayanan' => $value->tglpelayanan,
                        'namaPelayanan' => $value->namaproduk,
                        'jumlah' => $value->jumlah,

                        'ruanganTindakan' => $value->namaruangan,
                        'harga' => $harga,
                        'total' => (($harga - $diskon) * $value->jumlah) + $jasa,
                        'pasien' => $pasien,
                        'penjamin1' => $penjamin1,
                        'penjamin2' => $penjamin2,
                        'ruid' => $value->ruid,
                        'prid' => $value->prid,
                        'klid' => $value->klid,
                        'norec_apd' => $value->norec_apd,
                        'norec_pd' => $value->norec_pd,
                        'rekanan1' => $value->namarekanan,
                        'rekanan2' => $value->namarekanan2,
                        'idrekanan1' => $value->idrekanan1,
                        'idrekanan2' => $value->idrekanan2,
                        'jenis1' => $value->jenis1,
                        'jenis2' => $value->jenis2,
                        'kelompokpasien' => $value->kelompokpasien,
                        'kelompokpasien2' => $value->kelompokpasien2

                    );
                } else {
                    $detail = array(
                        'norec' => $value->norec,
                        'tglPelayanan' => $value->tglpelayanan,
                        'namaPelayanan' => $value->namaproduk,
                        'jumlah' => $value->jumlah,

                        'ruanganTindakan' => $value->namaruangan,
                        'harga' => $harga,
                        'total' => (($harga - $diskon) * $value->jumlah) + $jasa,
                        'pasien' => 0,
                        'penjamin1'
                        => (($harga - $diskon) * $value->jumlah) + $jasa,
                        'penjamin2' => 0,

                        'ruid' => $value->ruid,
                        'prid' => $value->prid,
                        'klid' => $value->klid,
                        'norec_apd' => $value->norec_apd,
                        'norec_pd' => $value->norec_pd,
                        'rekanan1' => '',
                        'rekanan2' => '',
                        'idrekanan1' => '',
                        'idrekanan2' => '',
                        'jenis1' => '',
                        'jenis2' => '',
                        'kelompokpasien' => '',
                        'kelompokpasien2' =>
                        '',

                    );
                }
                $details[] = $detail;
            }
        }

        $arrHsil = array(
            'details' => $details
        );
        return $this->respond($arrHsil);
    }
    public function simpanVerifikasiTagihanPenjaminPertindakan(Request $request)
    {

        try {
            DB::beginTransaction();

            $delete = PembayaranTindakanPerpenjamin::where('noregistrasi', $request['noregistrasi'])->delete();
            foreach ($request['data'] as $item) {
                $SPPenjamin = new PembayaranTindakanPerpenjamin();
                $SPPenjamin->norec = $SPPenjamin->generateNewId();
                $SPPenjamin->norecpp = $item['norec'];
                $SPPenjamin->harga = $item['harga'];
                $SPPenjamin->qty = (float)$item['jumlah'];
                $SPPenjamin->total = $item['total'];
                $SPPenjamin->pasien = $item['pasien'];
                $SPPenjamin->penjamin1 = $item['penjamin1'];
                $SPPenjamin->penjamin2 = $item['penjamin2'];
                $SPPenjamin->idrekanan1 = $request['penjamin1'];
                $SPPenjamin->idrekanan2 = $request['penjamin2'];
                $SPPenjamin->jenis1 = $request['jenis1'];
                $SPPenjamin->jenis2 = $request['jenis2'];
                $SPPenjamin->noregistrasi = $request['noregistrasi'];

                $SPPenjamin->save();
            }
            $transStatus = true;
            $transMsg = "TransaksiBerhasil";
        } catch (\Exception $e) {
            $transStatus = false;
            $transMsg = "Transaksi Gagal  ";
        }


        if ($transStatus) {
            $this->setStatusCode(201);
            $transMsg = "Transaksi Berhasil";
            $result = array(
                "status" => 201,
                "message" => $transMsg,
                // "data1" => $datakelompok1, 
                "as" => 'as@epic',
            );
            DB::commit();
        } else {
            $this->setStatusCode(400);
            DB::rollBack();
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMsg);
    }
    public function getfrommamppinganpenjamin($noRegister, Request $request)
    {
        $pd = \DB::table('pasiendaftar_t as pd')
        ->where('pd.noregistrasi', $noRegister)
            ->get();
        foreach ($pd as $kanjut) {
            // dd($kanjut->objectkelompokpasienlastfk); 
            $idkelasfk = $kanjut->objectkelasfk;
        }
        $mappingan = \DB::table('pasiendaftar_t as pd')
        ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
        ->leftjoin('pelayananpasien_t as pp', 'pp.noregistrasifk', '=', 'apd.norec')
        ->leftjoin('produk_m as pr', 'pr.id', '=', 'pp.produkfk')
        ->leftjoin('kelas_m as kl', 'kl.id', '=', 'apd.objectkelasfk')
        ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
        ->join('mappenjamintoproduk_s as mpp', 'mpp.idprodukfk', '=', 'pr.id')
        ->select(
            'mpp.idprodukfk',
            'mpp.potongan'
        )
            ->where('idrekananfk', '=', $request['idrekanan'])
            ->where('idkelasfk', '=', $idkelasfk)
            ->where('pd.noregistrasi', $noRegister)
            ->distinct()
            ->get();

        return ($mappingan);
    }
    public function simpanPemeriksaanLuarLab(Request $request)
    {
        DB::beginTransaction();
        $transStatus = 'true';
    
        try {
            // Cek apakah data sudah ada berdasarkan noregistrasifk
            $PL = PemeriksaanLuar::where('noregistrasifk', $request['noregistrasi'])->first();
    
            if (!$PL) { // Jika data belum ada, insert data baru
                $PL = new PemeriksaanLuar();
                $PL->norec = $PL->generateNewId();
                $PL->statusenabled = true;
            }
    
            // Set nilai (baik untuk insert maupun update)
            $PL->tglkirimsample = $request['tglkirimsample'] ?? null;
            $PL->tarifluar = (float)($request['tarifluar'] ?? 0);
            $PL->namafaskes = $request['namafaskes'] ?? '';
            $PL->tglpelayanan = $request['tglpelayanan'] ?? null;
            $PL->jenispelayanan = $request['jenispelayanan'] ?? null;
            $PL->jenispelayananfk = $request['jenispelayananfk'] ?? null;
            $PL->noregistrasifk = $request['noregistrasi'];
    
            $PL->save();
    
            $transMessage = "Save Pemeriksaan berhasil!";
        } catch (\Exception $e) {
            $transStatus = 'false';
            $transMessage = "Save Pemeriksaan gagal: " . $e->getMessage();
        }
    
        if ($transStatus != 'false') {
            DB::commit();
            $result = [
                "status" => 201,
                "message" => $transMessage,
            ];
        } else {
            DB::rollBack();
            $result = [
                "status" => 400,
                "message" => $transMessage,
            ];
        }
    
        return response()->json($result, $result['status']);
    }
    
    
}
