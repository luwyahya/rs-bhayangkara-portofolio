<?php

namespace App\Http\Controllers\EMR;

use App;
use DB;
use App\Traits\Valet;
use Carbon\Carbon;
use Illuminate\Http\Request;

class LaporanEMRController extends  App\Http\Controllers\ApiController
{
    use Valet;

    public function __construct()
    {
        parent::__construct($skip_authentication = false);
    }
    
    public function getLaporanCpptRI(Request $request) {
        ini_set('max_execution_time', 500);
        $dataPengunjung = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftJoin('ruangan_m as ru2', 'ru2.id', '=', 'apd.objectruanganasalfk')
            ->select('pd.noregistrasi', 'pd.norec as norec_pd', 'pd.objectruanganlastfk', 'apd.norec as norec_apd', 'apd.objectruanganasalfk', 'apd.objectruanganfk', 'ru.namaruangan',
            'ru2.namaruangan as namaruanganasal')
            ->where('apd.statusenabled', true)
            ->whereIn('ru.objectdepartemenfk', [16])
            ->where('pd.statusenabled', true);

        if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('apd.tglregistrasi', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('apd.tglregistrasi', '<=', $request['tglAkhir']);
        }
        if (isset($request['StatusPasien']) && $request['StatusPasien'] != '' && $request['StatusPasien'] != 'undefined') {
            if ($request['StatusPasien'] == 'BARU') {
                $dataPengunjung = $dataPengunjung->where('pd.statuspasien', 'Baru');
            } else {
                $dataPengunjung = $dataPengunjung->whereIn('pd.statuspasien', ['Lama', '']);
            }
        }
        if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
            $dataPengunjung = $dataPengunjung->where('apd.objectpegawaifk', '=', $request['dokterfk']);
        } 
        $dataPengunjung = $dataPengunjung->orderBy('ru.id', 'asc');
        $dataPengunjung = $dataPengunjung->get();

        ///////////////////////////////
        $dataPengunjungCppt = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftJoin('ruangan_m as ru2', 'ru2.id', '=', 'apd.objectruanganasalfk')
            ->leftJoin('emrpasien_t as ep', 'ep.norec_apd', '=', 'apd.norec')
            ->select('pd.noregistrasi', 'pd.norec as norec_pd', 'pd.objectruanganlastfk', 'apd.norec as norec_apd', 'apd.objectruanganasalfk', 'apd.objectruanganfk', 'ru.namaruangan',
            'ru2.namaruangan as namaruanganasal')
            ->where('apd.statusenabled', true)
            ->where('ep.jenisemr', '=', 'catatandokter')
            ->whereIn('ru.objectdepartemenfk', [16])
            ->where('pd.statusenabled', true);

        if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
            $dataPengunjungCppt = $dataPengunjungCppt->where('apd.tglregistrasi', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
            $dataPengunjungCppt = $dataPengunjungCppt->where('apd.tglregistrasi', '<=', $request['tglAkhir']);
        }
        if (isset($request['StatusPasien']) && $request['StatusPasien'] != '' && $request['StatusPasien'] != 'undefined') {
            if ($request['StatusPasien'] == 'BARU') {
                $dataPengunjungCppt = $dataPengunjungCppt->where('pd.statuspasien', 'Baru');
            } else {
                $dataPengunjungCppt = $dataPengunjungCppt->whereIn('pd.statuspasien', ['Lama', '']);
            }
        }
        if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
            $dataPengunjungCppt = $dataPengunjungCppt->where('apd.objectpegawaifk', '=', $request['dokterfk']);
        } 
        // $dataPengunjungCppt = $dataPengunjungCppt->orderBy('ru.id', 'asc');
        $dataPengunjungCppt = $dataPengunjungCppt->distinct()->get();
        // return $dataPengunjungCppt;
        $data10 = [];
        $sama = false;
        $jmlPasien = 0;
        $jmlKunj = 0;
        $jmlBelumIsi =0;
        foreach($dataPengunjung as $item) {
            $sama = false;
            $i = 0;
            foreach ($data10 as $he) {
                if ($item->namaruangan == $data10[$i]['namaruangan']) {
                    $sama = true;
                    $found = false;
                    if ($item->objectruanganasalfk == null) {
                        $jmlPasien = (float)$he['jmlPasien'] + 1;
                        $jmlKunj = (float)$he['jmlKunj'] + 1;
                        $data10[$i]['jmlPasien'] = $jmlPasien;
                        $data10[$i]['jmlKunj'] = $jmlKunj;
                    } else {
                        $jmlKunj = (float)$he['jmlKunj'] + 1;
                        $data10[$i]['jmlKunj'] = $jmlKunj;
                    }
 
                    foreach ($dataPengunjungCppt as $cppt) {
                        if (($item->noregistrasi == $cppt->noregistrasi)  && ($item->namaruangan == $cppt->namaruangan)) {
                      
                            $found = true;
                            // break;
                        }
                    }
                    if ($found==false) {
                        $jmlBelumIsi = (float)$he['jmlBelumIsi'] + 1;
                        $data10[$i]['jmlBelumIsi'] = $jmlBelumIsi;
                        // break;
                    }
                    

                }
                $i = $i + 1;
            }
            if ($sama == false) {
                $jmlPasien = 0;
                $jmlKunj = 0;
                $jmlBelumIsi = 0;
                if ($item->objectruanganasalfk == null) {
                    $jmlPasien = 1;
                    $jmlKunj = 1;
                } else {
                    $jmlKunj = 1;
                }
                $found = false;
                foreach ($dataPengunjungCppt as $cppt) {
                    if (($item->noregistrasi  == $cppt->noregistrasi)  && ($item->namaruangan == $cppt->namaruangan)) {
                        $found = true;
                        // break;
                    }
                }
                if ($found==false) {
                    $jmlBelumIsi =1;
                    // break;
                }
                $data10[] = array (
                    'namaruangan' => $item->namaruangan,
                    'jmlPasien' => $jmlPasien,
                    'jmlKunj' => $jmlKunj,
                    'jmlBelumIsi' => $jmlBelumIsi
                );
            }
        }
        $detail = \DB::table('emrpasien_t as ep')
            ->join('tempemr_t as te', 'te.emrpasienfk', '=', 'ep.noemr')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'ep.norec_apd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->select('ru.namaruangan', 'ru.id', 'ep.noregistrasifk', DB::raw("case when te.profesi <> 'Dokter' then 'Perawat' else te.profesi end as profesi"))
            ->where('te.statusenabled', true)
            ->whereIn('ru.objectdepartemenfk', [16])
            ->where('ep.emrfk', 518);
            if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
                $detail = $detail->where('apd.tglmasuk', '>=', $request['tglAwal']);
            }
            if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
                $detail = $detail->where('apd.tglmasuk', '<=', $request['tglAkhir']);
            }
            if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
                $detail = $detail->where('apd.objectpegawaifk', '=', $request['dokterfk']);
            } 
            // $detail = $detail->orderBy('ru.id', 'asc', 'ep.noregistrasifk', 'asc');
            // $detail = $detail->distinct();
            // $detail = $detail->get();
        $detail2 = \DB::table('emrpasien_t as ep')
            ->join('tempemr_t as te', 'te.emrpasienfk', '=', 'ep.noemr')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'ep.norec_apd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->select('ru.namaruangan', 'ru.id', 'ep.noregistrasifk', DB::raw("case when te.profesi <> 'Dokter' then 'Perawat' else te.profesi end as profesi"))
            ->where('te.statusenabled', true)
            ->whereIn('ru.objectdepartemenfk', [16])
            ->where('ep.emrfk', 518);
            if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
                $detail2 = $detail2->where('apd.tglmasuk', '>=', $request['tglAwal']);
            }
            if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
                $detail2 = $detail2->where('apd.tglmasuk', '<=', $request['tglAkhir']);
            }
            if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
                $detail2 = $detail2->where('apd.objectpegawaifk', '=', $request['dokterfk']);
            } 

            $detail = $detail->union($detail2)->orderBy('ru.id', 'asc', 'ep.noregistrasifk', 'asc')->get();

            // $detail = $detail->orderBy('ru.id', 'asc', 'ep.noregistrasifk', 'asc');
            // $detail = $detail->distinct();
            // $detail = $detail->get();
            $data11 = [];
            $sama = false;
            $jmlDokter = 0;
            $jmlPerawat = 0;
            foreach($detail as $item) {
                $sama = false;
                $i = 0;
                foreach ($data11 as $he) {
                    if ($item->namaruangan == $data11[$i]['namaruangan']) {
                        $sama = true;
                        if ($item->profesi == 'Dokter') {
                            $jmlDokter = (float)$he['jmlDokter'] + 1;
                            $data11[$i]['jmlDokter'] = $jmlDokter;
                        } else {
                            $jmlPerawat = (float)$he['jmlPerawat'] + 1;
                            $data11[$i]['jmlPerawat'] = $jmlPerawat;
                        }
                    }
                    $i = $i + 1;
                }
                if ($sama == false) {
                    $jmlDokter = 0;
                    $jmlPerawat = 0;
                    if ($item->profesi == 'Dokter') {
                        $jmlDokter = 1;
                    } else {
                        $jmlPerawat = 1;
                    }
                    $data11[] = array (
                        'namaruangan' => $item->namaruangan,
                        'jmlDokter' => $jmlDokter,
                        'jmlPerawat' => $jmlPerawat,
                    );
                }
            }
        $ruanganInap = \DB::table('ruangan_m')
            ->select('id', 'namaruangan')
            ->where('statusenabled', true)
            ->where('objectdepartemenfk', 16)
            ->whereNotIn('id', [821])
            ->get();
        $result = array (
            'data10' => $data10,
            'data11' => $data11,
            'ruangan' => $ruanganInap,
            'as' => 'epic'
        );
        return $this->respond($result);
    }
    public function getLaporanCpptRIDetail(Request $request) {
        if ($request['setParam'] == 1) {
            $data = DB::table('antrianpasiendiperiksa_t as apd')
                ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
                ->select('ps.nocm', 'pd.noregistrasi', 'ps.namapasien', 'ru.namaruangan', 'pg.namalengkap')
                ->where('apd.statusenabled', true)
                ->where('pd.statusenabled', true);
                
                if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
                    $data = $data->where('apd.tglregistrasi', '>=', $request['tglAwal']);
                }    
                if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
                    $data = $data->where('apd.tglregistrasi', '<=', $request['tglAkhir']);
                }    
                if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
                    $data = $data->where('apd.objectpegawaifk', '=', $request['dokterfk']);
                } 
                if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                    if($request['namaruangan'] == "PICU ") {
                        $data = $data->where('ru.namaruangan', '=', 'PICU & HCU ANAK');
                    } else {
                        $data = $data->where('ru.namaruangan', '=', $request['namaruangan']);
                    }
                }
                $data = $data->get();

                $emr = DB::table('emrpasien_t as ep')
                    ->select('noregistrasifk')
                    ->where('emrfk', 518);
        
                    if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
                        $emr = $emr->where('ep.tglregistrasi', '>=', $request['tglAwal']);
                    }    
                    if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
                        $emr = $emr->where('ep.tglregistrasi', '<=', $request['tglAkhir']);
                    }    
                    if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                        if($request['namaruangan'] == "PICU ") {
                            $emr = $emr->where('ep.namaruangan', '=', 'PICU & HCU ANAK');
                        } else {
                            $emr = $emr->where('ep.namaruangan', '=', $request['namaruangan']);
                        }
                    } 
                    $emr = $emr->get();
                foreach ($data as $item) {
                    $sama = 'false';
                    foreach ($emr as $item2) {
                        if ($item->noregistrasi == $item2->noregistrasifk) {
                            $sama = 'true';
                        }
                    }
                    if ($sama == 'false') {
                        $item->isBelumCppt = 'true';
                    } else {
                        $item->isBelumCppt = 'false';
                    }
                }
        } else if ($request['setParam'] == 2) {
            $data1 = \DB::table('emrpasien_t as ep')
            ->join('tempemr_t as te', 'te.emrpasienfk', '=', 'ep.noemr')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'ep.norec_apd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            ->select('ep.namapasien', 'ep.nocm', 'ep.noregistrasifk as noregistrasi', 'te.hasilpemeriksaan', 'ep.namaruangan', 'pg.namalengkap')
            ->where('te.statusenabled', true)
            ->whereIn('ru.objectdepartemenfk', [16])
            ->where('te.profesi', '<>', 'Dokter')
            ->where('ep.emrfk', 518);

        if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
            $data1 = $data1->where('apd.tglmasuk', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
            $data1 = $data1->where('apd.tglmasuk', '<=', $request['tglAkhir']);
        }
        if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
            $data1 = $data1->where('apd.objectpegawaifk', '=', $request['dokterfk']);
        } 
        if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
            if($request['namaruangan'] == "PICU DAN HCU ANAK") {
                $data1 = $data1->where('ru.namaexternal', $request['namaruangan']);
            } else {
                $data1 = $data1->where('ru.namaruangan', '=', $request['namaruangan']);
            }
        }
        // $data1 = $data1->orderBy('ru.id', 'asc');

        $data2 = \DB::table('emrpasien_t as ep')
            ->join('tempemr_t as te', 'te.emrpasienfk', '=', 'ep.noemr')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'ep.norec_apd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            ->select('ep.namapasien', 'ep.nocm', 'ep.noregistrasifk as noregistrasi', 'te.hasilpemeriksaan', 'ep.namaruangan', 'pg.namalengkap')
            ->where('te.statusenabled', true)
            ->whereIn('ru.objectdepartemenfk', [16])
            ->where('te.profesi', '<>', 'Dokter')
            ->where('ep.emrfk', 518);

        if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
            $data2 = $data2->where('apd.tglmasuk', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
            $data2 = $data2->where('apd.tglmasuk', '<=', $request['tglAkhir']);
        }
        if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
            $data2 = $data2->where('apd.objectpegawaifk', '=', $request['dokterfk']);
        } 
        if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
            if($request['namaruangan'] == "PICU DAN HCU ANAK") {
                $data2 = $data2->where('ru.namaexternal', $request['namaruangan']);
            } else {
                $data2 = $data2->where('ru.namaruangan', '=', $request['namaruangan']);
            }
        }
        $data = $data1->union($data2)->orderBy('ep.namapasien', 'asc')->get();

        } else if ($request['setParam'] == 3) {
            $data1 = \DB::table('emrpasien_t as ep')
            ->join('tempemr_t as te', 'te.emrpasienfk', '=', 'ep.noemr')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'ep.norec_apd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            ->select('ep.namapasien', 'ep.nocm', 'ep.noregistrasifk as noregistrasi', 'te.hasilpemeriksaan', 'ep.namaruangan', 'pg.namalengkap')
            ->where('te.statusenabled', true)
            ->whereIn('ru.objectdepartemenfk', [16])
            ->where('te.profesi', 'Dokter')
            ->where('ep.emrfk', 518);
        
        if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
            $data1 = $data1->where('apd.objectpegawaifk', '=', $request['dokterfk']);
        } 
        if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
            $data1 = $data1->where('apd.tglmasuk', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
            $data1 = $data1->where('apd.tglmasuk', '<=', $request['tglAkhir']);
        }
        if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
            if($request['namaruangan'] == "PICU DAN HCU ANAK") {
                $data1 = $data1->where('ru.namaexternal', $request['namaruangan']);
            } else {
                $data1 = $data1->where('ru.namaruangan', '=', $request['namaruangan']);
            }
        }
        
        $data2 = \DB::table('emrpasien_t as ep')
            ->join('tempemr_t as te', 'te.emrpasienfk', '=', 'ep.noemr')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'ep.norec_apd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            ->select('ep.namapasien', 'ep.nocm', 'ep.noregistrasifk as noregistrasi', 'te.hasilpemeriksaan', 'ep.namaruangan', 'pg.namalengkap')
            ->where('te.statusenabled', true)
            ->whereIn('ru.objectdepartemenfk', [16])
            ->where('te.profesi', 'Dokter')
            ->where('ep.emrfk', 518);
        
        if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
            $data2 = $data2->where('apd.objectpegawaifk', '=', $request['dokterfk']);
        } 
        if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
            $data2 = $data2->where('apd.tglmasuk', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
            $data2 = $data2->where('apd.tglmasuk', '<=', $request['tglAkhir']);
        }
        if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
            if($request['namaruangan'] == "PICU DAN HCU ANAK") {
                $data2 = $data2->where('ru.namaexternal', $request['namaruangan']);
            } else {
                $data2 = $data2->where('ru.namaruangan', '=', $request['namaruangan']);
            }
        }
        
        // $data = $data1->union($data2)->get();
        $data = $data1->union($data2)->orderBy('ep.namapasien', 'asc')->get();
        
        } else if ($request['setParam'] == 4) {
            $data = \DB::table('emrpasien_t as ep')
                ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'ep.norec_apd')
                ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                ->select('ep.namapasien', 'ep.nocm', 'ep.noregistrasifk as noregistrasi', 'ep.namaruangan')
                ->whereIn('ru.objectdepartemenfk', [16])
                ->where('ep.emrfk', 892);
                if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
                    $data = $data->where('apd.tglregistrasi', '>=', $request['tglAwal']);
                }
                if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
                    $data = $data->where('apd.tglregistrasi', '<=', $request['tglAkhir']);
                }
                if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                    $data = $data->where('ru.namaruangan', '=', $request['namaruangan']);
                }
            $data2 = \DB::table('emrpasien_t as ep')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'ep.norec_apd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->select('ep.namapasien', 'ep.nocm', 'ep.noregistrasifk as noregistrasi', 'ep.namaruangan')
            ->whereIn('ru.objectdepartemenfk', [16])
            ->where('ep.emrfk', 892);
            if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
                $data2 = $data2->where('apd.tglregistrasi', '>=', $request['tglAwal']);
            }
            if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
                $data2 = $data2->where('apd.tglregistrasi', '<=', $request['tglAkhir']);
            }
            if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                $data2 = $data2->where('ru.namaruangan', '=', $request['namaruangan']);
            }
            $datas = $data->union($data2)->orderBy('ep.namapasien', 'asc')->get();
              
                $uniqueData = [];
                foreach ($datas as $datay) {
                    // Memeriksa apakah noregistrasi sudah ada dalam array $uniqueData
                    $isDuplicate = false;
                    foreach ($uniqueData as $uniqueItem) {
                        if ($uniqueItem->noregistrasi === $datay->noregistrasi) {
                            $isDuplicate = true;
                            break;
                        }
                    }
                    // Jika noregistrasi belum ada dalam array $uniqueData, tambahkan data tersebut
                    if (!$isDuplicate) {
                        $uniqueData[] = $datay;
                    }
                }
                $data = $uniqueData;
        } else if ($request['setParam'] == 5) {
            $data = \DB::table('tempedukasipasien_t as tep')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'tep.noregistrasifk')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('pegawai_m as pg', 'pg.id', '=', 'tep.pemberiedukasi')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->select('ps.nocm', 'pd.noregistrasi', 'ps.namapasien', 'ru.namaruangan', 'tep.tgljamedukasi', 'tep.materiedukasi', 'pg.namalengkap')
            ->where('ru.objectdepartemenfk', 16)
            ->where('pg.objectjenispegawaifk', 1)
            ->where('tep.statusenabled', true);
            if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
                $data = $data->where('apd.tglregistrasi', '>=', $request['tglAwal']);
            }
            if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
                $data = $data->where('apd.tglregistrasi', '<=', $request['tglAkhir']);
            }
            if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                $data = $data->where('ru.namaruangan', '=', $request['namaruangan']);
            }
            $data = $data->orderBy('ps.namapasien', 'asc');
            $data = $data->get();
        } else if ($request['setParam'] == 6) {
            $data = \DB::table('tempedukasipasien_t as tep')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'tep.noregistrasifk')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('pegawai_m as pg', 'pg.id', '=', 'tep.pemberiedukasi')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->select('ps.nocm', 'pd.noregistrasi', 'ps.namapasien', 'ru.namaruangan', 'tep.tgljamedukasi', 'tep.materiedukasi', 'pg.namalengkap')
            ->where('ru.objectdepartemenfk', 16)
            ->where('pg.objectjenispegawaifk', 2)
            ->where('tep.statusenabled', true);
            if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
                $data = $data->where('apd.tglregistrasi', '>=', $request['tglAwal']);
            }
            if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
                $data = $data->where('apd.tglregistrasi', '<=', $request['tglAkhir']);
            }
            if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                $data = $data->where('ru.namaruangan', '=', $request['namaruangan']);
            }
            $data = $data->orderBy('ps.namapasien', 'asc');
            $data = $data->get();
        } else if ($request['setParam'] == 7) {
            $data = \DB::table('tempedukasipasien_t as tep')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'tep.noregistrasifk')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('pegawai_m as pg', 'pg.id', '=', 'tep.pemberiedukasi')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->select('ps.nocm', 'pd.noregistrasi', 'ps.namapasien', 'ru.namaruangan', 'tep.tgljamedukasi', 'tep.materiedukasi', 'pg.namalengkap')
            ->where('ru.objectdepartemenfk', 16)
            ->whereNotIn('pg.objectjenispegawaifk', [1,2])
            ->where('tep.statusenabled', true);
            if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
                $data = $data->where('apd.tglregistrasi', '>=', $request['tglAwal']);
            }
            if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
                $data = $data->where('apd.tglregistrasi', '<=', $request['tglAkhir']);
            }
            if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                $data = $data->where('ru.namaruangan', '=', $request['namaruangan']);
            }
            $data = $data->orderBy('ps.namapasien', 'asc');
            $data = $data->get();
        } else if ($request['setParam'] == 8) {
            $data1 = \DB::table('emrpasien_t as ep')
            ->join('tempemr_t as te', 'te.emrpasienfk', '=', 'ep.noemr')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'ep.norec_apd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->select('ep.namapasien', 'ep.nocm', 'ep.noregistrasifk as noregistrasi', 'te.hasilkeperawatan', 'ep.namaruangan')
            ->where('te.statusenabled', true)
            ->whereIn('ru.objectdepartemenfk', [16])
            ->where('ep.emrfk', 517);
        
        if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
            $data1 = $data1->where('apd.tglmasuk', '>=', $request['tglAwal']);
        }
        
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
            $data1 = $data1->where('apd.tglmasuk', '<=', $request['tglAkhir']);
        }
        
        if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
            $data1 = $data1->where('ru.namaruangan', '=', $request['namaruangan']);
        }
        
        // $data1 = $data1->orderBy('ru.id', 'asc');
        
        $data2 = \DB::table('emrpasien_t as ep')
            ->join('tempemr_t as te', 'te.emrpasienfk', '=', 'ep.noemr')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'ep.norec_apd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->select('ep.namapasien', 'ep.nocm', 'ep.noregistrasifk as noregistrasi', 'te.hasilkeperawatan', 'ep.namaruangan')
            ->where('te.statusenabled', true)
            ->whereIn('ru.objectdepartemenfk', [16])
            ->where('ep.emrfk', 517);
        
        if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
            $data2 = $data2->where('apd.tglmasuk', '>=', $request['tglAwal']);
        }
        
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
            $data2 = $data2->where('apd.tglmasuk', '<=', $request['tglAkhir']);
        }
        
        if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
            $data2 = $data2->where('ru.namaruangan', '=', $request['namaruangan']);
        }
        
        // $data2 = $data2->orderBy('ru.id', 'asc');
        
        $data = $data1->union($data2)->orderBy('ep.namapasien', 'asc')->get();
        
        } else if ($request['setParam'] == 9) {
            // $data = \DB::table('emrpasien_t as ep')
            // ->join('emr_t as e', 'e.id', '=', 'ep.emrfk')
            // ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'ep.norec_apd')
            // ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            // ->select('ru.namaruangan', 'ep.noemr', 'ep.nocm', 'ep.noregistrasifk as noregistrasi', 'ep.namapasien', 'e.caption as hasil')
            // ->whereIn('ru.objectdepartemenfk', [16])
            // ->where('e.namaemr', 'like', '%'. 'askep'. '%');
            // if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
            //     $data = $data->where('apd.tglmasuk', '>=', $request['tglAwal']);
            // }
            // if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
            //     $data = $data->where('apd.tglmasuk', '<=', $request['tglAkhir']);
            // }
            // if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
            //     $data = $data->where('ru.namaruangan', '=', $request['namaruangan']);
            // }
            // $data = $data->orderBy('ru.id', 'asc');
            // $data = $data->get();
            $data1 = \DB::table('emrpasien_t as ep')
            ->join('emr_t as e', 'e.id', '=', 'ep.emrfk')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'ep.norec_apd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->select('ru.namaruangan', 'ep.noemr', 'ep.nocm', 'ep.noregistrasifk as noregistrasi', 'ep.namapasien', 'e.caption as hasil')
            ->whereIn('ru.objectdepartemenfk', [16])
            ->where('e.namaemr', 'like', '%' . 'askep' . '%');
        if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
            $data1 = $data1->where('apd.tglmasuk', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
            $data1 = $data1->where('apd.tglmasuk', '<=', $request['tglAkhir']);
        }
        if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
            if($request['namaruangan'] == "PICU ") {
                $data1 = $data1->where('ru.id', 901);
            } else {
                $data1 = $data1->where('ru.namaruangan', '=', $request['namaruangan']);
            }
        }
        
        $data2 = \DB::table('emrpasien_t as ep')
            ->join('emr_t as e', 'e.id', '=', 'ep.emrfk')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'ep.norec_apd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->select('ru.namaruangan', 'ep.noemr', 'ep.nocm', 'ep.noregistrasifk as noregistrasi', 'ep.namapasien', 'e.caption as hasil')
            ->whereIn('ru.objectdepartemenfk', [16])
            ->where('e.namaemr', 'like', '%' . 'askep' . '%');
        if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
            $data2 = $data2->where('apd.tglmasuk', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
            $data2 = $data2->where('apd.tglmasuk', '<=', $request['tglAkhir']);
        }
        if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
           
            if($request['namaruangan'] == "PICU ") {
                $data2 = $data2->where('ru.id', 901);
            } else {
                $data2 = $data2->where('ru.namaruangan', '=', $request['namaruangan']);
            }
        }
        
        $data = $data1->union($data2)->orderBy('namaruangan', 'asc')->orderBy('noregistrasi', 'asc')->get();
        
        } else if ($request['setParam'] == 10) {
            $query1 = \DB::table('emrpasien_t as ep')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'ep.norec_apd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            ->select('ep.namapasien', 'ep.nocm', 'ep.noregistrasifk as noregistrasi', 'ep.namaruangan', 'pg.namalengkap')
            ->whereIn('ru.objectdepartemenfk', [16])
            ->where('ep.emrfk', 675);
        if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
            $query1 = $query1->where('apd.tglregistrasi', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
            $query1 = $query1->where('apd.tglregistrasi', '<=', $request['tglAkhir']);
        }
        if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
            $query1 = $query1->where('ru.namaruangan', '=', $request['namaruangan']);
        }
        if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
            $query1 = $query1->where('apd.objectpegawaifk', '=', $request['dokterfk']);
        } 
        // $query1 = $query1->groupBy('ep.namapasien', 'ep.nocm', 'ep.noregistrasifk', 'ep.namaruangan', 'ru.id')
        //     ->orderBy('ru.id', 'asc');
        
        $query2 = \DB::table('emrpasien_t as ep')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'ep.norec_apd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            ->select('ep.namapasien', 'ep.nocm', 'ep.noregistrasifk as noregistrasi', 'ep.namaruangan', 'pg.namalengkap')
            ->whereIn('ru.objectdepartemenfk', [16])
            ->where('ep.emrfk', 675);
        if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
            $query2 = $query2->where('apd.tglregistrasi', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
            $query2 = $query2->where('apd.tglregistrasi', '<=', $request['tglAkhir']);
        }
        if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
            if($request['namaruangan'] == "PICU ") {
                $query2 = $query2->where('ru.namaruangan', '=', 'PICU & HCU ANAK');
            } else {
                $query2 = $query2->where('ru.namaruangan', '=', $request['namaruangan']);
            }
        }
        if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
            $query2 = $query2->where('apd.objectpegawaifk', '=', $request['dokterfk']);
        } 
        // $query2 = $query2->groupBy('ep.namapasien', 'ep.nocm', 'ep.noregistrasifk', 'ep.namaruangan', 'ru.id')
        //     ->orderBy('ru.id', 'asc');
        
        // $data = $data1->union($data2)->orderBy('namaruangan', 'asc')->orderBy('noregistrasi', 'asc')->get();
        $data = $query1->union($query2)->groupBy('ep.namapasien', 'ep.nocm', 'ep.noregistrasifk', 'ep.namaruangan', 'ru.id', 'pg.namalengkap')->get();
        // $data = $query1->union($query2)->get();
        
        }else if ($request['setParam'] == 11) {
            $data = DB::table('antrianpasiendiperiksa_t as apd')
                ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
                ->select('ps.nocm', 'pd.noregistrasi', 'ps.namapasien', 'ru.namaruangan', 'pg.namalengkap')
                ->where('apd.statusenabled', true)
                ->where('pd.statusenabled', true);
                
                if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
                    $data = $data->where('apd.tglregistrasi', '>=', $request['tglAwal']);
                }    
                if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
                    $data = $data->where('apd.tglregistrasi', '<=', $request['tglAkhir']);
                }    
                if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
                    $data = $data->where('apd.objectpegawaifk', '=', $request['dokterfk']);
                } 
                if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                    if($request['namaruangan'] == "PICU ") {
                        $data = $data->where('ru.namaruangan', '=', 'PICU & HCU ANAK');
                    } else {
                        $data = $data->where('ru.namaruangan', '=', $request['namaruangan']);
                    }
                }
                $data = $data->get();

                // return $data;
                $emr = DB::table('emrpasien_t as ep')
                    ->select('noregistrasifk')
                    ->where('emrfk', 675);
        
                    if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
                        $emr = $emr->where('ep.tglregistrasi', '>=', $request['tglAwal']);
                    }    
                    if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
                        $emr = $emr->where('ep.tglregistrasi', '<=', $request['tglAkhir']);
                    }    
                    if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                        if($request['namaruangan'] == "PICU ") {
                            $emr = $emr->where('ep.namaruangan', '=', 'PICU & HCU ANAK');
                        } else {
                            $emr = $emr->where('ep.namaruangan', '=', $request['namaruangan']);
                        }
                    } 
                    // $emr = $emr->get();
                $emr2 = DB::table('emrpasien_t as ep')
                ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'ep.norec_apd')
                ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                ->select('ep.noregistrasifk')
                ->where('emrfk', 675);
    
                if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
                    $emr2 = $emr2->where('ep.tglregistrasi', '>=', $request['tglAwal']);
                }    
                if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
                    $emr2 = $emr2->where('ep.tglregistrasi', '<=', $request['tglAkhir']);
                }    
                if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                    if($request['namaruangan'] == "PICU ") {
                        $emr2 = $emr2->where('ep.namaruangan', '=', 'PICU & HCU ANAK');
                    } else {
                        $emr2 = $emr2->where('ep.namaruangan', '=', $request['namaruangan']);
                    }
                } 
                $emr = $emr->union($emr2)->get();
                foreach ($data as $item) {
                    $sama = 'false';
                    foreach ($emr as $item2) {
                        if ($item->noregistrasi == $item2->noregistrasifk) {
                            $sama = 'true';
                        }
                    }
                    if ($sama == 'false') {
                        $item->isBelumCppt = 'true';
                    } else {
                        $item->isBelumCppt = 'false';
                    }
                }
                $dataBaru = [];
                foreach ($data as $item) {
                    if ( $item->isBelumCppt == 'true' ){
                        $dataBaru[] = $item; 
                    }
                }
                $data = $dataBaru;
           
        }else if ($request['setParam'] == 12) {
            $data = DB::table('antrianpasiendiperiksa_t as apd')
                ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
                ->select('ps.nocm', 'pd.noregistrasi', 'ps.namapasien', 'ru.namaruangan', 'pg.namalengkap')
                ->where('apd.statusenabled', true)
                ->where('pd.statusenabled', true);
                
                if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
                    $data = $data->where('apd.tglregistrasi', '>=', $request['tglAwal']);
                }    
                if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
                    $data = $data->where('apd.tglregistrasi', '<=', $request['tglAkhir']);
                }    
                if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
                    $data = $data->where('apd.objectpegawaifk', '=', $request['dokterfk']);
                } 
                if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                    if($request['namaruangan'] == "PICU DAN HCU ANAK") {
                        $data = $data->where('ru.namaexternal', $request['namaruangan']);
                    } else {
                        $data = $data->where('ru.namaruangan', '=', $request['namaruangan']);
                    }
                }
                $data = $data->get();

                $emr = DB::table('emrpasien_t as ep')
                    ->select('noregistrasifk')
                    ->where('emrfk', 518);
        
                    if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
                        $emr = $emr->where('ep.tglregistrasi', '>=', $request['tglAwal']);
                    }    
                    if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
                        $emr = $emr->where('ep.tglregistrasi', '<=', $request['tglAkhir']);
                    }    
                    if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                        $emr = $emr->where('ep.namaruangan', '=', $request['namaruangan']);
                    } 
                    // $emr = $emr->get();
                $emr2 = DB::table('emrpasien_t as ep')
                ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'ep.norec_apd')
                ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                ->select('ep.noregistrasifk')
                ->where('emrfk', 518);
    
                if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
                    $emr2 = $emr2->where('ep.tglregistrasi', '>=', $request['tglAwal']);
                }    
                if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
                    $emr2 = $emr2->where('ep.tglregistrasi', '<=', $request['tglAkhir']);
                }    
                if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                    $emr2 = $emr2->where('ru.namaruangan', '=', $request['namaruangan']);
                } 
                $emr = $emr->union($emr2)->get();
                foreach ($data as $item) {
                    $sama = 'false';
                    foreach ($emr as $item2) {
                        if ($item->noregistrasi == $item2->noregistrasifk) {
                            $sama = 'true';
                        }
                    }
                    if ($sama == 'false') {
                        $item->isBelumCppt = 'true';
                    } else {
                        $item->isBelumCppt = 'false';
                    }
                }
                $dataBaru = [];
                foreach ($data as $item) {
                    if ( $item->isBelumCppt == 'true' ){
                        $dataBaru[] = $item; 
                    }
                }
                $data = $dataBaru;
            
        }else if ($request['setParam'] == 13) {
            $data = DB::table('antrianpasiendiperiksa_t as apd')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            ->select('ps.nocm', 'pd.noregistrasi', 'ps.namapasien', 'ru.namaruangan', 'pg.namalengkap')
            ->where('apd.statusenabled', true)
            ->where('pd.statusenabled', true); 
            
            if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
                $data = $data->where('apd.tglregistrasi', '>=', $request['tglAwal']);
            }    
            if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
                $data = $data->where('apd.tglregistrasi', '<=', $request['tglAkhir']);
            }    
            if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
                $data = $data->where('apd.objectpegawaifk', '=', $request['dokterfk']);
            } 
            if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                if($request['namaruangan'] == "PICU DAN HCU ANAK") {
                    $data = $data->where('ru.namaexternal', $request['namaruangan']);
                } else {
                    $data = $data->where('ru.namaruangan', '=', $request['namaruangan']);
                }
            }
            $data = $data->get();

            $emr = DB::table('emrpasien_t as ep')
                ->select('noregistrasifk')
                ->where('emrfk', 892);
    
                if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
                    $emr = $emr->where('ep.tglregistrasi', '>=', $request['tglAwal']);
                }    
                if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
                    $emr = $emr->where('ep.tglregistrasi', '<=', $request['tglAkhir']);
                }    
                if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                    $emr = $emr->where('ep.namaruangan', '=', $request['namaruangan']);
                } 
                // $emr = $emr->get();
            $emr2 = DB::table('emrpasien_t as ep')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'ep.norec_apd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->select('ep.noregistrasifk')
            ->where('emrfk', 892);

            if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
                $emr2 = $emr2->where('ep.tglregistrasi', '>=', $request['tglAwal']);
            }    
            if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
                $emr2 = $emr2->where('ep.tglregistrasi', '<=', $request['tglAkhir']);
            }    
            if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                $emr2 = $emr2->where('ru.namaruangan', '=', $request['namaruangan']);
            } 
            $emr = $emr->union($emr2)->get();
            foreach ($data as $item) {
                $sama = 'false';
                foreach ($emr as $item2) {
                    if ($item->noregistrasi == $item2->noregistrasifk) {
                        $sama = 'true';
                    }
                }
                if ($sama == 'false') {
                    $item->isBelumCppt = 'true';
                } else {
                    $item->isBelumCppt = 'false';
                }
            }
            $dataBaru = [];
            foreach ($data as $item) {
                if ( $item->isBelumCppt == 'true' ){
                    $dataBaru[] = $item; 
                }
            }
            $data = $dataBaru;
        
        } else if ($request['setParam'] == 14) {
            $data = \DB::table('emrpasien_t as ep')
                ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'ep.norec_apd')
                ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                ->select('ep.namapasien', 'ep.nocm', 'ep.noregistrasifk as noregistrasi', 'ep.namaruangan')
                ->whereIn('ru.objectdepartemenfk', [16])
                ->where('ep.emrfk', 915);
                if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
                    $data = $data->where('apd.tglregistrasi', '>=', $request['tglAwal']);
                }
                if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
                    $data = $data->where('apd.tglregistrasi', '<=', $request['tglAkhir']);
                }
                if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                    $data = $data->where('ru.namaruangan', '=', $request['namaruangan']);
                }
            $data2 = \DB::table('emrpasien_t as ep')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'ep.norec_apd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->select('ep.namapasien', 'ep.nocm', 'ep.noregistrasifk as noregistrasi', 'ep.namaruangan')
            ->whereIn('ru.objectdepartemenfk', [16])
            ->where('ep.emrfk', 915);
            if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
                $data2 = $data2->where('apd.tglregistrasi', '>=', $request['tglAwal']);
            }
            if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
                $data2 = $data2->where('apd.tglregistrasi', '<=', $request['tglAkhir']);
            }
            if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                $data2 = $data2->where('ru.namaruangan', '=', $request['namaruangan']);
            }
            $datas = $data->union($data2)->orderBy('ep.namapasien', 'asc')->get();
              
                $uniqueData = [];
                foreach ($datas as $datay) {
                    // Memeriksa apakah noregistrasi sudah ada dalam array $uniqueData
                    $isDuplicate = false;
                    foreach ($uniqueData as $uniqueItem) {
                        if ($uniqueItem->noregistrasi === $datay->noregistrasi) {
                            $isDuplicate = true;
                            break;
                        }
                    }
                    // Jika noregistrasi belum ada dalam array $uniqueData, tambahkan data tersebut
                    if (!$isDuplicate) {
                        $uniqueData[] = $datay;
                    }
                }
                $data = $uniqueData;
        }else if ($request['setParam'] == 15) {
            $data = DB::table('antrianpasiendiperiksa_t as apd')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            ->select('ps.nocm', 'pd.noregistrasi', 'ps.namapasien', 'ru.namaruangan', 'pg.namalengkap' , 'apd.norec')
            ->where('apd.statusenabled', true)
            ->where('pd.statusenabled', true); 
            
            if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
                $data = $data->where('apd.tglregistrasi', '>=', $request['tglAwal']);
            }    
            if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
                $data = $data->where('apd.tglregistrasi', '<=', $request['tglAkhir']);
            }    
            if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
                $data = $data->where('apd.objectpegawaifk', '=', $request['dokterfk']);
            } 
            if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                if($request['namaruangan'] == "PICU DAN HCU ANAK") {
                    $data = $data->where('ru.namaexternal', $request['namaruangan']);
                } else {
                    $data = $data->where('ru.namaruangan', '=', $request['namaruangan']);
                }
            }
            $data = $data->get();
            // return $data;
            $emr = DB::table('emrpasien_t as ep')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'ep.norec_apd')
                ->select('ep.noregistrasifk', 'apd.norec')
                ->where('emrfk', 915);
    
                if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
                    $emr = $emr->where('apd.tglregistrasi', '>=', $request['tglAwal']);
                }    
                if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
                    $emr = $emr->where('apd.tglregistrasi', '<=', $request['tglAkhir']);
                }    
                if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                    $emr = $emr->where('ep.namaruangan', '=', $request['namaruangan']);
                } 
                // $emr = $emr->get();
            $emr2 = DB::table('emrpasien_t as ep')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'ep.norec_apd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->select('ep.noregistrasifk', 'apd.norec')
            ->where('emrfk', 915);

            if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
                $emr2 = $emr2->where('apd.tglregistrasi', '>=', $request['tglAwal']);
            }    
            if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
                $emr2 = $emr2->where('apd.tglregistrasi', '<=', $request['tglAkhir']);
            }    
            if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                $emr2 = $emr2->where('ru.namaruangan', '=', $request['namaruangan']);
            } 
            $emr = $emr->union($emr2)->get();
            // return $emr;
            foreach ($data as $item) {
                $sama = 'false';
                foreach ($emr as $item2) {
                    if (($item->noregistrasi == $item2->noregistrasifk) && ($item->norec == $item2->norec)) {
                        $sama = 'true';
                    }
                }
                if ($sama == 'false') {
                    $item->isBelumCppt = 'true';
                } else {
                    $item->isBelumCppt = 'false';
                }
            }
            // return $data;
            $dataBaru = [];
            foreach ($data as $item) {
                if ( $item->isBelumCppt == 'true' ){
                    $dataBaru[] = $item; 
                }
            }
            $data = $dataBaru;
        
        } 
        $result = array (
            'data' => $data,
            'as' => 'hehe'
        );
        return $this->respond($result);
    }
    public function getLaporanPengkajianAwalKeperawatanRI(Request $request) {
        ini_set('max_execution_time', 500); 
        $dataPengunjung = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftJoin('ruangan_m as ru2', 'ru2.id', '=', 'apd.objectruanganasalfk')
            ->select('pd.noregistrasi', 'pd.norec as norec_pd', 'pd.objectruanganlastfk', 'apd.norec as norec_apd', 'apd.objectruanganasalfk', 'apd.objectruanganfk', 'ru.namaruangan',
            'ru2.namaruangan as namaruanganasal')
            ->where('apd.statusenabled', true)
            ->whereIn('ru.objectdepartemenfk', [16])
            ->where('pd.statusenabled', true);

        if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('apd.tglregistrasi', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('apd.tglregistrasi', '<=', $request['tglAkhir']);
        }
        if (isset($request['StatusPasien']) && $request['StatusPasien'] != '' && $request['StatusPasien'] != 'undefined') {
            if ($request['StatusPasien'] == 'BARU') {
                $dataPengunjung = $dataPengunjung->where('pd.statuspasien', 'Baru');
            } else {
                $dataPengunjung = $dataPengunjung->whereIn('pd.statuspasien', ['Lama', '']);
            }
        }
        $dataPengunjung = $dataPengunjung->orderBy('ru.id', 'asc');
        $dataPengunjung = $dataPengunjung->get();
        $dataPengunjung = array_filter($dataPengunjung, function($item) {
            return $item->norec_apd !== '862265302f-2f1b-11ef-9c620240620';
        });
        $data10 = [];
        $sama = false;
        $jmlPasien = 0;
        $jmlKunj = 0;
        foreach($dataPengunjung as $item) {
            $sama = false;
            $i = 0;
            foreach ($data10 as $he) {
                if ($item->namaruangan == $data10[$i]['namaruangan']) {
                    $sama = true;
                    if ($item->objectruanganasalfk == null) {
                        $jmlPasien = (float)$he['jmlPasien'] + 1;
                        $jmlKunj = (float)$he['jmlKunj'] + 1;
                        $data10[$i]['jmlPasien'] = $jmlPasien;
                        $data10[$i]['jmlKunj'] = $jmlKunj;
                    } else {
                        $jmlKunj = (float)$he['jmlKunj'] + 1;
                        $data10[$i]['jmlKunj'] = $jmlKunj;
                    }
                }
                $i = $i + 1;
            }
            if ($sama == false) {
                $jmlPasien = 0;
                $jmlKunj = 0;
                if ($item->objectruanganasalfk == null) {
                    $jmlPasien = 1;
                    $jmlKunj = 1;
                } else {
                    $jmlKunj = 1;
                }
                $data10[] = array (
                    'namaruangan' => $item->namaruangan,
                    'jmlPasien' => $jmlPasien,
                    'jmlKunj' => $jmlKunj
                );
            }
        }

        $detail = \DB::table('emrpasien_t as ep')
            ->join('antrianpasiendiperiksa_t as apd', 'ep.norec_apd', '=', 'apd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->select('ru.namaruangan', 'ep.noemr', 'ep.noregistrasifk')
            ->where('ru.objectdepartemenfk', 16)
            ->where('ep.emrfk', 892);
            if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
                $detail = $detail->where('apd.tglregistrasi', '>=', $request['tglAwal']);
            }
            if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
                $detail = $detail->where('apd.tglregistrasi', '<=', $request['tglAkhir']);
            }

        $detail2 = \DB::table('emrpasien_t as ep')
        ->join('antrianpasiendiperiksa_t as apd', 'ep.norec_apd', '=', 'apd.norec')
        ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
        ->select('ru.namaruangan', 'ep.noemr', 'ep.noregistrasifk')
        ->where('ru.objectdepartemenfk', 16)
        ->where('ep.emrfk', 892);
        if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
            $detail2 = $detail2->where('apd.tglregistrasi', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
            $detail2 = $detail2->where('apd.tglregistrasi', '<=', $request['tglAkhir']);
        }
        $detail = $detail->union($detail2)->get();
            // $detail = $detail->groupBy('ru.namaruangan', 'ep.noemr', 'ru.id');
            // $detail = $detail->orderBy('ru.id', 'asc');
            // $detail = $detail->get();
            $uniqueData = [];
            foreach ($detail as $data) {
                if (!isset($uniqueData[$data->noregistrasifk])) {
                    $uniqueData[$data->noregistrasifk] = $data;
                }
            }
            $detail = $uniqueData;
            $data11 = [];
            $sama = false;
            $jmlPerawat = 0;
            foreach($detail as $item) {
                $sama = false;
                $i = 0;
                foreach ($data11 as $he) {
                    if ($item->namaruangan == $data11[$i]['namaruangan']) {
                        $sama = true;
                        $jmlPerawat = (float)$he['jmlPerawat'] + 1;
                        $data11[$i]['jmlPerawat'] = $jmlPerawat;
                    }
                    $i = $i + 1;
                }
                if ($sama == false) {
                    $jmlPerawat = 1;
                    $data11[] = array (
                        'namaruangan' => $item->namaruangan,
                        'jmlPerawat' => $jmlPerawat,
                    );
                }
            }
        $ruanganInap = \DB::table('ruangan_m')
            ->select('id', 'namaruangan')
            ->where('statusenabled', true)
            ->where('objectdepartemenfk', 16)
            ->whereNotIn('id', [821])
            ->get();
        $result = array (
            'data10' => $data10,
            'data11' => $data11,
            'ruangan' => $ruanganInap,
            'as' => 'epic'
        );
        return $this->respond($result);
    }
    public function getLaporanFormulirEdukasiRI(Request $request) {
        ini_set('max_execution_time', 500);
        $dataPengunjung = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftJoin('ruangan_m as ru2', 'ru2.id', '=', 'apd.objectruanganasalfk')
            ->select('pd.noregistrasi', 'pd.norec as norec_pd', 'pd.objectruanganlastfk', 'apd.norec as norec_apd', 'apd.objectruanganasalfk', 'apd.objectruanganfk', 'ru.namaruangan',
            'ru2.namaruangan as namaruanganasal')
            ->where('apd.statusenabled', true)
            ->whereIn('ru.objectdepartemenfk', [16])
            ->where('pd.statusenabled', true);

        if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('apd.tglregistrasi', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('apd.tglregistrasi', '<=', $request['tglAkhir']);
        }
        if (isset($request['StatusPasien']) && $request['StatusPasien'] != '' && $request['StatusPasien'] != 'undefined') {
            if ($request['StatusPasien'] == 'BARU') {
                $dataPengunjung = $dataPengunjung->where('pd.statuspasien', 'Baru');
            } else {
                $dataPengunjung = $dataPengunjung->whereIn('pd.statuspasien', ['Lama', '']);
            }
        }
        $dataPengunjung = $dataPengunjung->orderBy('ru.id', 'asc');
        $dataPengunjung = $dataPengunjung->get();
        $data10 = [];
        $sama = false;
        $jmlPasien = 0;
        $jmlKunj = 0;
        foreach($dataPengunjung as $item) {
            $sama = false;
            $i = 0;
            foreach ($data10 as $he) {
                if ($item->namaruangan == $data10[$i]['namaruangan']) {
                    $sama = true;
                    if ($item->objectruanganasalfk == null) {
                        $jmlPasien = (float)$he['jmlPasien'] + 1;
                        $jmlKunj = (float)$he['jmlKunj'] + 1;
                        $data10[$i]['jmlPasien'] = $jmlPasien;
                        $data10[$i]['jmlKunj'] = $jmlKunj;
                    } else {
                        $jmlKunj = (float)$he['jmlKunj'] + 1;
                        $data10[$i]['jmlKunj'] = $jmlKunj;
                    }
                }
                $i = $i + 1;
            }
            if ($sama == false) {
                $jmlPasien = 0;
                $jmlKunj = 0;
                if ($item->objectruanganasalfk == null) {
                    $jmlPasien = 1;
                    $jmlKunj = 1;
                } else {
                    $jmlKunj = 1;
                }
                $data10[] = array (
                    'namaruangan' => $item->namaruangan,
                    'jmlPasien' => $jmlPasien,
                    'jmlKunj' => $jmlKunj
                );
            }
        }
        $detail = \DB::table('tempedukasipasien_t as tep')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'tep.noregistrasifk')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('pegawai_m as pg', 'pg.id', '=', 'tep.pemberiedukasi')
            ->select('ru.namaruangan', 'pd.noregistrasi', 'ru.id', DB::raw("case when pg.objectjenispegawaifk = 1 then pg.objectjenispegawaifk when pg.objectjenispegawaifk = 2 then pg.objectjenispegawaifk else 3 end as objectjenispegawaifk"))
            ->where('ru.objectdepartemenfk', 16)
            ->where('tep.statusenabled', true)
            ->where('apd.statusenabled', true);
            if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
                $detail = $detail->where('pd.tglregistrasi', '>=', $request['tglAwal']);
            }
            if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
                $detail = $detail->where('pd.tglregistrasi', '<=', $request['tglAkhir']);
            }
            $detail = $detail->orderBy('ru.id', 'asc', 'pd.noregistrasi', 'asc');
            $detail = $detail->distinct();
            $detail = $detail->get();
            $data11 = [];
            $sama = false;
            $jmlDokter = 0;
            $jmlPerawat = 0;
            $jmlPelaksana = 0;
            foreach($detail as $item) {
                $sama = false;
                $i = 0;
                foreach ($data11 as $he) {
                    if ($item->namaruangan == $data11[$i]['namaruangan']) {
                        $sama = true;
                        if ($item->objectjenispegawaifk == 1) {
                            $jmlDokter = (float)$he['jmlDokter'] + 1;
                            $data11[$i]['jmlDokter'] = $jmlDokter;
                        } else if ($item->objectjenispegawaifk == 2) {
                            $jmlPerawat = (float)$he['jmlPerawat'] + 1;
                            $data11[$i]['jmlPerawat'] = $jmlPerawat;
                        } else {
                            $jmlPelaksana = (float)$he['jmlPelaksana'] + 1;
                            $data11[$i]['jmlPelaksana'] = $jmlPelaksana;
                        }
                    }
                    $i = $i + 1;
                }
                if ($sama == false) {
                    $jmlDokter = 0;
                    $jmlPerawat = 0;
                    $jmlPelaksana = 0;
                    if ($item->objectjenispegawaifk == 1) {
                        $jmlDokter = 1;
                    } else if ($item->objectjenispegawaifk == 2) {
                        $jmlPerawat = 1;
                    } else {
                        $jmlPelaksana = 1;
                    }
                    $data11[] = array (
                        'namaruangan' => $item->namaruangan,
                        'jmlDokter' => $jmlDokter,
                        'jmlPerawat' => $jmlPerawat,
                        'jmlPelaksana' => $jmlPelaksana,
                    );
                }
            }
            $result = array (
                'data10' => $data10,
                'data11' => $data11,
                'as' => 'epic'
            );
            return $this->respond($result);
    }
    public function getLaporanCatatanKeperawatanRI(Request $request) {
        ini_set('max_execution_time', 500);
        $dataPengunjung = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftJoin('ruangan_m as ru2', 'ru2.id', '=', 'apd.objectruanganasalfk')
            ->select('pd.noregistrasi', 'pd.norec as norec_pd', 'pd.objectruanganlastfk', 'apd.norec as norec_apd', 'apd.objectruanganasalfk', 'apd.objectruanganfk', 'ru.namaruangan',
            'ru2.namaruangan as namaruanganasal')
            ->where('apd.statusenabled', true)
            ->whereIn('ru.objectdepartemenfk', [16])
            ->where('pd.statusenabled', true);

        if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('apd.tglmasuk', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('apd.tglmasuk', '<=', $request['tglAkhir']);
        }
        if (isset($request['StatusPasien']) && $request['StatusPasien'] != '' && $request['StatusPasien'] != 'undefined') {
            if ($request['StatusPasien'] == 'BARU') {
                $dataPengunjung = $dataPengunjung->where('pd.statuspasien', 'Baru');
            } else {
                $dataPengunjung = $dataPengunjung->whereIn('pd.statuspasien', ['Lama', '']);
            }
        }
        $dataPengunjung = $dataPengunjung->orderBy('ru.id', 'asc');
        $dataPengunjung = $dataPengunjung->get();
      
        $data10 = [];
        $sama = false;
        $jmlPasien = 0;
        $jmlKunj = 0;
        foreach($dataPengunjung as $item) {
            $sama = false;
            $i = 0;
            foreach ($data10 as $he) {
                if ($item->namaruangan == $data10[$i]['namaruangan']) {
                    $sama = true;
                    if ($item->objectruanganasalfk == null) {
                        $jmlPasien = (float)$he['jmlPasien'] + 1;
                        $jmlKunj = (float)$he['jmlKunj'] + 1;
                        $data10[$i]['jmlPasien'] = $jmlPasien;
                        $data10[$i]['jmlKunj'] = $jmlKunj;
                    } else {
                        $jmlKunj = (float)$he['jmlKunj'] + 1;
                        $data10[$i]['jmlKunj'] = $jmlKunj;
                    }
                }
                $i = $i + 1;
            }
            if ($sama == false) {
                $jmlPasien = 0;
                $jmlKunj = 0;
                if ($item->objectruanganasalfk == null) {
                    $jmlPasien = 1;
                    $jmlKunj = 1;
                } else {
                    $jmlKunj = 1;
                }
                $data10[] = array (
                    'namaruangan' => $item->namaruangan,
                    'jmlPasien' => $jmlPasien,
                    'jmlKunj' => $jmlKunj
                );
            }
        }
        $detail1 = \DB::table('emrpasien_t as ep')
        ->join('tempemr_t as te', 'te.emrpasienfk', '=', 'ep.noemr')
        ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'ep.norec_apd')
        ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
        ->select('ru.namaruangan', 'ru.id', 'ep.noregistrasifk', DB::raw("case when te.profesi <> 'Dokter' then 'Perawat' else te.profesi end as profesi"))
        ->where('te.statusenabled', true)
        ->whereIn('ru.objectdepartemenfk', [16])
        ->where('ep.emrfk', 517);
        if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
        $detail1 = $detail1->where('apd.tglmasuk', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
        $detail1 = $detail1->where('apd.tglmasuk', '<=', $request['tglAkhir']);
        }

        $detail2 = \DB::table('emrpasien_t as ep')
                ->join('tempemr_t as te', 'te.emrpasienfk', '=', 'ep.noemr')
                ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'ep.norec_apd')
                ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                ->select('ru.namaruangan', 'ru.id', 'ep.noregistrasifk', DB::raw("case when te.profesi <> 'Dokter' then 'Perawat' else te.profesi end as profesi"))
                ->where('te.statusenabled', true)
                ->whereIn('ru.objectdepartemenfk', [16])
                ->where('ep.emrfk', 517);
        if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
        $detail2 = $detail2->where('apd.tglmasuk', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
        $detail2 = $detail2->where('apd.tglmasuk', '<=', $request['tglAkhir']);
        }

        $detail = $detail1->union($detail2)->orderBy('id', 'asc')->get();

            $data11 = [];
            $sama = false;
            $jmlPerawat = 0;
            foreach($detail as $item) {
                $sama = false;
                $i = 0;
                foreach ($data11 as $he) {
                    if ($item->namaruangan == $data11[$i]['namaruangan']) {
                        $sama = true;
                            $jmlPerawat = (float)$he['jmlPerawat'] + 1;
                            $data11[$i]['jmlPerawat'] = $jmlPerawat;
                    }
                    $i = $i + 1;
                }
                if ($sama == false) {
                    $jmlPerawat = 1;
                    $data11[] = array (
                        'namaruangan' => $item->namaruangan,
                        'jmlPerawat' => $jmlPerawat,
                    );
                }
            }
        $result = array (
            'data10' => $data10,
            'data11' => $data11,
            'as' => 'epic'
        );
        return $this->respond($result);
    }
    public function getLaporanAskepRI(Request $request) {
        ini_set('max_execution_time', 500);
        $dataPengunjung = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftJoin('ruangan_m as ru2', 'ru2.id', '=', 'apd.objectruanganasalfk')
            ->select('pd.noregistrasi', 'pd.norec as norec_pd', 'pd.objectruanganlastfk', 'apd.norec as norec_apd', 'apd.objectruanganasalfk', 'apd.objectruanganfk', 'ru.namaruangan',
            'ru2.namaruangan as namaruanganasal')
            ->where('apd.statusenabled', true)
            ->whereIn('ru.objectdepartemenfk', [16])
            ->where('pd.statusenabled', true);

        if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('apd.tglregistrasi', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('apd.tglregistrasi', '<=', $request['tglAkhir']);
        }
        if (isset($request['StatusPasien']) && $request['StatusPasien'] != '' && $request['StatusPasien'] != 'undefined') {
            if ($request['StatusPasien'] == 'BARU') {
                $dataPengunjung = $dataPengunjung->where('pd.statuspasien', 'Baru');
            } else {
                $dataPengunjung = $dataPengunjung->whereIn('pd.statuspasien', ['Lama', '']);
            }
        }
        $dataPengunjung = $dataPengunjung->orderBy('ru.id', 'asc');
        $dataPengunjung = $dataPengunjung->get();
        $data10 = [];
        $sama = false;
        $jmlPasien = 0;
        $jmlKunj = 0;
        foreach($dataPengunjung as $item) {
            $sama = false;
            $i = 0;
            foreach ($data10 as $he) {
                if ($item->namaruangan == $data10[$i]['namaruangan']) {
                    $sama = true;
                    if ($item->objectruanganasalfk == null) {
                        $jmlPasien = (float)$he['jmlPasien'] + 1;
                        $jmlKunj = (float)$he['jmlKunj'] + 1;
                        $data10[$i]['jmlPasien'] = $jmlPasien;
                        $data10[$i]['jmlKunj'] = $jmlKunj;
                    } else {
                        $jmlKunj = (float)$he['jmlKunj'] + 1;
                        $data10[$i]['jmlKunj'] = $jmlKunj;
                    }
                }
                $i = $i + 1;
            }
            if ($sama == false) {
                $jmlPasien = 0;
                $jmlKunj = 0;
                if ($item->objectruanganasalfk == null) {
                    $jmlPasien = 1;
                    $jmlKunj = 1;
                } else {
                    $jmlKunj = 1;
                }
                $data10[] = array (
                    'namaruangan' => $item->namaruangan,
                    'jmlPasien' => $jmlPasien,
                    'jmlKunj' => $jmlKunj
                );
            }
        }
     
        // $detail = \DB::table('emrpasien_t as ep')
        //     ->join('emr_t as e', 'e.id', '=', 'ep.emrfk')
        //     ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'ep.norec_apd')
        //     ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
        //     ->select('ru.namaruangan', 'ep.noemr')
        //     ->whereIn('ru.objectdepartemenfk', [16])
        //     ->where('e.namaemr', 'like', '%'. 'askep'. '%');
        //     if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
        //         $detail = $detail->where('apd.tglmasuk', '>=', $request['tglAwal']);
        //     }
        //     if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
        //         $detail = $detail->where('apd.tglmasuk', '<=', $request['tglAkhir']);
        //     }
        //     $detail = $detail->orderBy('ru.id', 'asc');
        //     $detail = $detail->get();
        $detail1 = \DB::table('emrpasien_t as ep')
        ->join('emr_t as e', 'e.id', '=', 'ep.emrfk')
        ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'ep.norec_apd')
        ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
        ->select('ru.namaruangan', 'ep.noemr', 'ep.noregistrasifk')
        ->whereIn('ru.objectdepartemenfk', [16])
        ->where('e.namaemr', 'like', '%'. 'askep'. '%');
        if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
        $detail1 = $detail1->where('apd.tglregistrasi', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
        $detail1 = $detail1->where('apd.tglregistrasi', '<=', $request['tglAkhir']);
        }

        $detail2 = \DB::table('emrpasien_t as ep')
                ->join('emr_t as e', 'e.id', '=', 'ep.emrfk')
                ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'ep.norec_apd')
                ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                ->select('ru.namaruangan', 'ep.noemr', 'ep.noregistrasifk')
                ->whereIn('ru.objectdepartemenfk', [16])
                ->where('e.namaemr', 'like', '%'. 'askep'. '%');
        if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
        $detail2 = $detail2->where('apd.tglregistrasi', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
        $detail2 = $detail2->where('apd.tglregistrasi', '<=', $request['tglAkhir']);
        }

        $detail = $detail1->union($detail2)->orderBy('namaruangan', 'asc')->get();
        $uniqueData = [];
        foreach ($detail as $data) {
            $key = $data->namaruangan . '-' . $data->noregistrasifk;
            if (!isset($uniqueData[$key])) {
                $uniqueData[$key] = $data;
            } 
        }
        
        $detail = $uniqueData;
            $data11 = [];
            $sama = false;
            $jmlPerawat = 0;
            foreach($detail as $item) {
                $sama = false;
                $i = 0;
                foreach ($data11 as $he) {
                    if ($item->namaruangan == $data11[$i]['namaruangan']) {
                        $sama = true;
                            $jmlPerawat = (float)$he['jmlPerawat'] + 1;
                            $data11[$i]['jmlPerawat'] = $jmlPerawat;
                    }
                    $i = $i + 1;
                }
                if ($sama == false) {
                    $jmlPerawat = 1;
                    $data11[] = array (
                        'namaruangan' => $item->namaruangan,
                        'jmlPerawat' => $jmlPerawat,
                    );
                }
            }

            $ruanganInap = \DB::table('ruangan_m')
            ->select('id', 'namaruangan')
            ->where('statusenabled', true)
            ->where('objectdepartemenfk', 16)
            ->whereNotIn('id', [821])
            ->get();
        $result = array (
            'data10' => $data10, 
            'data11' => $data11,
            'ruangan' => $ruanganInap,
            'as' => 'epic'
        );
        return $this->respond($result);
    }
    public function getLaporanPengkajianMedisRI(Request $request) {
        ini_set('max_execution_time', 500);
        $dataPengunjung = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftJoin('ruangan_m as ru2', 'ru2.id', '=', 'apd.objectruanganasalfk')
            ->select('pd.noregistrasi', 'pd.norec as norec_pd', 'pd.objectruanganlastfk', 'apd.norec as norec_apd', 'apd.objectruanganasalfk', 'apd.objectruanganfk', 'ru.namaruangan',
            'ru2.namaruangan as namaruanganasal')
            ->where('apd.statusenabled', true)
            ->whereIn('ru.objectdepartemenfk', [16])
            ->where('pd.statusenabled', true);
  
        if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('apd.tglregistrasi', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('apd.tglregistrasi', '<=', $request['tglAkhir']);
        }
        if (isset($request['StatusPasien']) && $request['StatusPasien'] != '' && $request['StatusPasien'] != 'undefined') {
            if ($request['StatusPasien'] == 'BARU') {
                $dataPengunjung = $dataPengunjung->where('pd.statuspasien', 'Baru');
            } else {
                $dataPengunjung = $dataPengunjung->whereIn('pd.statuspasien', ['Lama', '']);
            }
        }
        if (isset($request['dokterfk']) && $request['dokterfk'] != '' && $request['dokterfk'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('apd.objectpegawaifk',   $request['dokterfk']);
        }
        $dataPengunjung = $dataPengunjung->orderBy('ru.id', 'asc');
        $dataPengunjung = $dataPengunjung->get();
        $data10 = [];
        $sama = false;
        $jmlPasien = 0;
        $jmlKunj = 0;
        foreach($dataPengunjung as $item) {
            $sama = false;
            $i = 0;
            foreach ($data10 as $he) {
                if ($item->namaruangan == $data10[$i]['namaruangan']) {
                    $sama = true;
                    if ($item->objectruanganasalfk == null) {
                        $jmlPasien = (float)$he['jmlPasien'] + 1;
                        $jmlKunj = (float)$he['jmlKunj'] + 1;
                        $data10[$i]['jmlPasien'] = $jmlPasien;
                        $data10[$i]['jmlKunj'] = $jmlKunj;
                    } else {
                        $jmlKunj = (float)$he['jmlKunj'] + 1;
                        $data10[$i]['jmlKunj'] = $jmlKunj;
                    }
                }
                $i = $i + 1;
            }
            if ($sama == false) {
                $jmlPasien = 0;
                $jmlKunj = 0;
                if ($item->objectruanganasalfk == null) {
                    $jmlPasien = 1;
                    $jmlKunj = 1;
                } else {
                    $jmlKunj = 1;
                }
                $data10[] = array (
                    'namaruangan' => $item->namaruangan,
                    'jmlPasien' => $jmlPasien,
                    'jmlKunj' => $jmlKunj
                );
            }
        }
        $detail = \DB::table('emrpasien_t as ep')
            ->join('antrianpasiendiperiksa_t as apd', 'ep.norec_apd', '=', 'apd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->select('ru.namaruangan', 'ep.norec_apd')
            ->where('ru.objectdepartemenfk', 16)
            ->where('ep.emrfk', 675);
            if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
                $detail = $detail->where('apd.tglregistrasi', '>=', $request['tglAwal']);
            }
            if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
                $detail = $detail->where('apd.tglregistrasi', '<=', $request['tglAkhir']);
            }
            if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
                $detail = $detail->where('apd.objectpegawaifk', '=', $request['dokterfk']);
            } 
        $detail2 = \DB::table('emrpasien_t as ep')
            ->join('antrianpasiendiperiksa_t as apd', 'ep.norec_apd', '=', 'apd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->select('ru.namaruangan', 'ep.norec_apd')
            ->where('ru.objectdepartemenfk', 16)
            ->where('ep.emrfk', 675);
            if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
                $detail2 = $detail2->where('apd.tglregistrasi', '>=', $request['tglAwal']);
            }
            if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
                $detail2 = $detail2->where('apd.tglregistrasi', '<=', $request['tglAkhir']);
            }
            if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
                $detail2 = $detail2->where('apd.objectpegawaifk', '=', $request['dokterfk']);
            } 
            
            $detail = $detail->union($detail2)->groupBy('ru.namaruangan', 'ep.norec_apd', 'ru.id')->orderBy('ru.namaruangan', 'asc')->get();
            // $detail = $detail->get();
            $data11 = [];
            $sama = false;
            $jmlPerawat = 0;
            foreach($detail as $item) {
                $sama = false;
                $i = 0;
                foreach ($data11 as $he) {
                    if ($item->namaruangan == $data11[$i]['namaruangan']) {
                        $sama = true;
                        $jmlPerawat = (float)$he['jmlPerawat'] + 1;
                        $data11[$i]['jmlPerawat'] = $jmlPerawat;
                    }
                    $i = $i + 1;
                }
                if ($sama == false) {
                    $jmlPerawat = 1;
                    $data11[] = array (
                        'namaruangan' => $item->namaruangan,
                        'jmlPerawat' => $jmlPerawat,
                    );
                }
            }
        $ruanganInap = \DB::table('ruangan_m')
            ->select('id', 'namaruangan')
            ->where('statusenabled', true)
            ->where('objectdepartemenfk', 16)
            ->whereNotIn('id', [821])
            ->get();
        $result = array (
            'data10' => $data10,
            'data11' => $data11,
            'ruangan' => $ruanganInap,
            'as' => 'epic'
        );
        return $this->respond($result);
    }
    public function getLaporanResumeRJ(Request $request) {
        ini_set('max_execution_time', 500);
        $dataPengunjung = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftJoin('ruangan_m as ru2', 'ru2.id', '=', 'apd.objectruanganasalfk')
            ->select('pd.noregistrasi', 'pd.norec as norec_pd', 'pd.objectruanganlastfk','apd.objectruanganasalfk', 'apd.objectruanganfk', 'ru.namaruangan',
            'ru2.namaruangan as namaruanganasal')
            ->where('apd.statusenabled', true)
            ->whereIn('ru.objectdepartemenfk', [18,28,79,83])
            // ->where('apd.objectstatuspulangfk', '13')
            ->where('pd.statusenabled', true)
            ->whereNull('apd.objectruanganasalfk');

        if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('apd.tglregistrasi', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('apd.tglregistrasi', '<=', $request['tglAkhir']);
        }
        if (isset($request['StatusPasien']) && $request['StatusPasien'] != '' && $request['StatusPasien'] != 'undefined') {
            if ($request['StatusPasien'] == 'BARU') {
                $dataPengunjung = $dataPengunjung->where('pd.statuspasien', 'Baru');
            } else {
                $dataPengunjung = $dataPengunjung->whereIn('pd.statuspasien', ['Lama', '']);
            }
        }
        if (isset($request['dokterfk']) && $request['dokterfk'] != '' && $request['dokterfk'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('apd.objectpegawaifk',   $request['dokterfk']);
        }
        // $dataPengunjung = $dataPengunjung->orderBy('ru.id', 'asc');
        $dataPengunjung = $dataPengunjung->distinct();
        $dataPengunjung = $dataPengunjung->get();
        $data10 = [];
        $sama = false;
        $jmlPasien = 0;
        $jmlKunj = 0;
        foreach($dataPengunjung as $item) {
            $sama = false;
            $i = 0;
            foreach ($data10 as $he) {
                if ($item->namaruangan == $data10[$i]['namaruangan']) {
                    $sama = true;
                    if ($item->objectruanganasalfk == null) {
                        $jmlPasien = (float)$he['jmlPasien'] + 1;
                        $jmlKunj = (float)$he['jmlKunj'] + 1;
                        $data10[$i]['jmlPasien'] = $jmlPasien;
                        $data10[$i]['jmlKunj'] = $jmlKunj;
                    } else {
                        $jmlKunj = (float)$he['jmlKunj'] + 1;
                        $data10[$i]['jmlKunj'] = $jmlKunj;
                    }
                }
                $i = $i + 1;
            }
            if ($sama == false) {
                $jmlPasien = 0;
                $jmlKunj = 0;
                if ($item->objectruanganasalfk == null) {
                    $jmlPasien = 1;
                    $jmlKunj = 1;
                } else {
                    $jmlKunj = 1;
                }
                $data10[] = array (
                    'namaruangan' => $item->namaruangan,
                    'jmlPasien' => $jmlPasien,
                    'jmlKunj' => $jmlKunj
                );
            }
        }

        
        $detail = null;
        if (isset($request['tglAwal']) && strtotime($request['tglAwal']) <= strtotime('2023-12-31 23:59')) {
            $detail = DB::table('antrianpasiendiperiksa_t as apd')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            ->leftJoin('emrpasien_t as ep', 'ep.norec_apd', '=', 'apd.norec')
            ->select('ps.nocm', 'pd.noregistrasi', 'ps.namapasien', 'ru.namaruangan', 'pg.namalengkap')
            ->where('pd.statusenabled', true) 
            ->whereNotNull('pd.tglpulang')
            ->where('apd.statusenabled', true)
            // ->where('apd.objectstatuspulangfk', '13')
            ->whereNull('apd.objectruanganasalfk')
            ///kurang di detailnya disamainnnn
            ->where('ep.emrfk', 698);
        }else{
            $detail = DB::table('antrianpasiendiperiksa_t as apd')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            ->leftJoin('emrpasien_t as ep', 'ep.norec_apd', '=', 'apd.norec')
            ->select('ps.nocm', 'pd.noregistrasi', 'ps.namapasien', 'ru.namaruangan', 'pg.namalengkap')
            ->where('pd.statusenabled', true) 
            ->whereNotNull('pd.tglpulang')
            ->where('apd.statusenabled', true)
            // ->where('apd.objectstatuspulangfk', '13')
            ->whereNull('apd.objectruanganasalfk')
            ///kurang di detailnya disamainnnn
            ->where('ep.emrfk', 698);
        }
         //     ->where('apd.objectstatuspulangfk', '13')
        //     ->whereIn('ru.objectdepartemenfk', [18, 28, 79])
        //     ->where('ep.emrfk', 698);
        
        if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
            $detail = $detail->where('pd.tglregistrasi', '>=', $request['tglAwal']);
        }    
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
            $detail = $detail->where('pd.tglregistrasi', '<=', $request['tglAkhir']);
        }    
        if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
            if($request['namaruangan'] == "PICU DAN HCU ANAK") {
                $detail = $detail->where('ru.namaexternal', $request['namaruangan']);
            } else {
                $detail = $detail->where('ru.namaruangan', '=', $request['namaruangan']);
            }
        }
        if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
            $detail = $detail->where('apd.objectpegawaifk', '=', $request['dokterfk']);
        } 
        // $data = $data->distinct();
        $detail = $detail->get();

        $detail = array_map("unserialize", array_unique(array_map("serialize", $detail)));


        // $detail = \DB::table('emrpasien_t as ep')
        //     ->join('emr_t as e', 'e.id', '=', 'ep.emrfk')
        //     ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'ep.norec_apd')
        //     ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
        //     ->select('ru.namaruangan', 'ep.norec_apd')
        //     ->where('apd.objectstatuspulangfk', '13')
        //     ->whereIn('ru.objectdepartemenfk', [18, 28, 79])
        //     ->where('ep.emrfk', 698);
        //     if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
        //         $detail = $detail->where('apd.tglmasuk', '>=', $request['tglAwal']);
        //     }
        //     if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
        //         $detail = $detail->where('apd.tglmasuk', '<=', $request['tglAkhir']);
        //     }
        //     if (isset($request['dokterfk']) && $request['dokterfk'] != '' && $request['dokterfk'] != 'undefined') {
        //         $detail = $detail->where('ep.pegawaifk',   $request['dokterfk']);
        //     }
        //     $detail = $detail->groupBy('ru.namaruangan', 'ep.norec_apd', 'ru.id');
        //     $detail = $detail->orderBy('ru.id', 'asc');
        //     $detail = $detail->get();
            

            $data11 = [];
            $sama = false;
            $jmlPerawat = 0;
            foreach($detail as $item) {
                $sama = false;
                $i = 0;
                foreach ($data11 as $he) {
                    if ($item->namaruangan == $data11[$i]['namaruangan']) {
                        $sama = true;
                            $jmlPerawat = (float)$he['jmlPerawat'] + 1;
                            $data11[$i]['jmlPerawat'] = $jmlPerawat;
                    }
                    $i = $i + 1;
                }
                if ($sama == false) {
                    $jmlPerawat = 1;
                    $data11[] = array (
                        'namaruangan' => $item->namaruangan,
                        'jmlPerawat' => $jmlPerawat,
                    );
                }
            }
        $ruangan = \DB::table('ruangan_m')
            ->select('id', 'namaruangan')
            ->where('statusenabled', true)
            ->whereIn('objectdepartemenfk', [18,28, 79,83])
            ->get();
        $result = array (
            'data10' => $data10,
            'data11' => $data11,
            'ruangan' => $ruangan,
            'as' => 'epic'
        );
        return $this->respond($result);
    }
    public function getLaporanSudahIsiResumeMedisRJDetail(Request $request) {
        if ($request['setParam'] == 1) { 
            $data = DB::table('antrianpasiendiperiksa_t as apd')
                ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
                ->select('ps.nocm', 'pd.noregistrasi', 'ps.namapasien', 'ru.namaruangan', 'pg.namalengkap')
                ->where('pd.statusenabled', true)
                // ->where('apd.objectstatuspulangfk', '13')
                ->whereNull('apd.objectruanganasalfk')
                ->where('apd.statusenabled', true);
                
                if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
                    $data = $data->where('apd.tglregistrasi', '>=', $request['tglAwal']);
                }    
                if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
                    $data = $data->where('apd.tglregistrasi', '<=', $request['tglAkhir']);
                }    
                if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                    if($request['namaruangan'] == "PICU DAN HCU ANAK") {
                        $data = $data->where('ru.namaexternal', $request['namaruangan']);
                    } else {
                        $data = $data->where('ru.namaruangan', '=', $request['namaruangan']);
                    }
                }
                if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
                    $data = $data->where('apd.objectpegawaifk', '=', $request['dokterfk']);
                } 
                $data = $data->distinct();
                $data = $data->get();
                $result = $data;
        } else if ($request['setParam'] == 2) {
            $data = null;
            if (isset($request['tglAwal']) && strtotime($request['tglAwal']) <= strtotime('2023-12-31 23:59')) {
                $data = DB::table('antrianpasiendiperiksa_t as apd')
                ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
                ->leftJoin('emrpasien_t as ep', 'ep.norec_apd', '=', 'apd.norec')
                ->select('ps.nocm', 'pd.noregistrasi', 'ps.namapasien', 'ru.namaruangan', 'pg.namalengkap')
                ->where('pd.statusenabled', true)
                ->whereNotNull('pd.tglpulang')
                ->where('apd.statusenabled', true)
                // ->where('apd.objectstatuspulangfk', '13')
                ->whereNull('apd.objectruanganasalfk')
                ->where('ep.emrfk', 698);
            }else{
                $data = DB::table('antrianpasiendiperiksa_t as apd')
                ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
                ->leftJoin('emrpasien_t as ep', 'ep.norec_apd', '=', 'apd.norec')
                ->select('ps.nocm', 'pd.noregistrasi', 'ps.namapasien', 'ru.namaruangan', 'pg.namalengkap')
                ->where('pd.statusenabled', true)
                ->whereNotNull('pd.tglpulang')
                ->where('apd.statusenabled', true)
                    // ->where('apd.objectstatuspulangfk', '13')
                    ->whereNull('apd.objectruanganasalfk')
                    ->where('ep.emrfk', 698);
            }
            
            
            if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
                $data = $data->where('pd.tglregistrasi', '>=', $request['tglAwal']);
            }    
            if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
                $data = $data->where('pd.tglregistrasi', '<=', $request['tglAkhir']);
            }    
            if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                if($request['namaruangan'] == "PICU DAN HCU ANAK") {
                    $data = $data->where('ru.namaexternal', $request['namaruangan']);
                } else {
                    $data = $data->where('ru.namaruangan', '=', $request['namaruangan']);
                }
            }
            if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
                $data = $data->where('apd.objectpegawaifk', '=', $request['dokterfk']);
            } 
            // $data = $data->distinct();
            $data = $data->get();
            // $data = array_map("unserialize", array_unique(array_map("serialize", $data)));
            $serializedData = array_map('serialize', $data);
            $uniqueSerializedData = array_unique($serializedData);
            $uniqueData = array_map('unserialize', $uniqueSerializedData);

            $result = [];
            foreach ($uniqueData as $item) {
                $result[] = [
                    'nocm' => $item->nocm,
                    'noregistrasi' => $item->noregistrasi,
                    'namapasien' => $item->namapasien,
                    'namaruangan' => $item->namaruangan,
                    'namalengkap' => $item->namalengkap,
                ];
            }

            // $data = DB::table('emrpasien_t as ep')
            //     ->join('pegawai_m as pg', 'pg.id', '=', 'ep.pegawaifk')
            //     ->join('antrianpasiendiperiksd as apd', 'apd.')
            //     ->select('ep.nocm', 'noregistrasifk as noregistrasi', 'namapasien', 'namaruangan', 'pg.namalengkap')
            //     ->where('apd.objectstatuspulangfk', '13')
            //     ->where('ep.emrfk', 698);
            // if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
            //     $data = $data->where('ep.tglregistrasi', '>=', $request['tglAwal']);
            // }    
            // if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
            //     $data = $data->where('ep.tglregistrasi', '<=', $request['tglAkhir']);
            // }    
            // if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
            //     $data = $data->where('ep.namaruangan', '=', $request['namaruangan']);
            // }
            // if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
            //     $data = $data->where('ep.pegawaifk', '=', $request['dokterfk']);
            // } 
            // $data = $data->groupBy('ep.nocm', 'noregistrasifk', 'namapasien', 'namaruangan', 'pg.namalengkap');
            // $data = $data->orderBy('namapasien');
            // $data = $data->get();
        } else if ($request['setParam'] == 3) {
            $data = null;
            if (isset($request['tglAwal']) && strtotime($request['tglAwal']) <= strtotime('2023-12-31 23:59')) {
                $data = DB::table('antrianpasiendiperiksa_t as apd')
                ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
                ->leftJoin('emrpasien_t as ep', 'ep.norec_apd', '=', 'apd.norec')
                ->select('ps.nocm', 'pd.noregistrasi', 'ps.namapasien', 'ru.namaruangan', 'pg.namalengkap')
                ->where('pd.statusenabled', true)
                ->whereNotNull('pd.tglpulang')
                ->where('apd.statusenabled', true)
                // ->where('apd.objectstatuspulangfk', '13')
                ->whereNull('apd.objectruanganasalfk')
                ->where('ep.emrfk', 698);
            }else{
                $data = DB::table('antrianpasiendiperiksa_t as apd')
                ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
                ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
                ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
                ->leftJoin('emrpasien_t as ep', 'ep.norec_apd', '=', 'apd.norec')
                ->select('ps.nocm', 'pd.noregistrasi', 'ps.namapasien', 'ru.namaruangan', 'pg.namalengkap')
                ->where('pd.statusenabled', true)
                ->whereNotNull('pd.tglpulang')
                ->where('apd.statusenabled', true)
                    // ->where('apd.objectstatuspulangfk', '13')
                    ->whereNull('apd.objectruanganasalfk')
                    ->where('ep.emrfk', 698);
            }
            
            
            if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
                $data = $data->where('pd.tglregistrasi', '>=', $request['tglAwal']);
            }    
            if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
                $data = $data->where('pd.tglregistrasi', '<=', $request['tglAkhir']);
            }    
            if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                if($request['namaruangan'] == "PICU DAN HCU ANAK") {
                    $data = $data->where('ru.namaexternal', $request['namaruangan']);
                } else {
                    $data = $data->where('ru.namaruangan', '=', $request['namaruangan']);
                }
            }
            if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
                $data = $data->where('apd.objectpegawaifk', '=', $request['dokterfk']);
            } 
            // $data = $data->distinct();
            $data = $data->get();
            // $data = array_map("unserialize", array_unique(array_map("serialize", $data)));
            $serializedData = array_map('serialize', $data);
            $uniqueSerializedData = array_unique($serializedData);
            $uniqueData = array_map('unserialize', $uniqueSerializedData);

            $result = [];
            foreach ($uniqueData as $item) {
                $result[] = [
                    'nocm' => $item->nocm,
                    'noregistrasi' => $item->noregistrasi,
                    'namapasien' => $item->namapasien,
                    'namaruangan' => $item->namaruangan,
                    'namalengkap' => $item->namalengkap,
                ];
            }

            $data1 = $result;

            $data = DB::table('antrianpasiendiperiksa_t as apd')
            ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftjoin('ruangan_m as ru2', 'ru2.id', '=', 'apd.objectruanganasalfk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            ->leftJoin('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
            ->leftjoin('jaminankhusus_m as jku', 'jku.id', '=', 'pd.objectjaminankhusus')
            ->select('ps.nocm', 'pd.noregistrasi', 'ps.namapasien', 'ru.namaruangan', 'pg.namalengkap', 'pd.tglregistrasi', 'rk.namarekanan', 'jku.namaexternal as jaminankhusus', DB::raw(' case when ru2.namaruangan is null then \'Registrasi Langsung\' else ru2.namaruangan end as ruanganasal'))
            ->where('pd.statusenabled', true)
            // ->where('apd.objectstatuspulangfk', '13')
            ->whereNull('apd.objectruanganasalfk')
            ->where('apd.statusenabled', true);
            
            if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
                $data = $data->where('apd.tglregistrasi', '>=', $request['tglAwal']);
            }    
            if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
                $data = $data->where('apd.tglregistrasi', '<=', $request['tglAkhir']);
            }    
            if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                if($request['namaruangan'] == "PICU DAN HCU ANAK") {
                    $data = $data->where('ru.namaexternal', $request['namaruangan']);
                } else {
                    $data = $data->where('ru.namaruangan', '=', $request['namaruangan']);
                }
            }
            if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
                $data = $data->where('apd.objectpegawaifk', '=', $request['dokterfk']);
            } 
            $data = $data->distinct();
            $data = $data->get();
            $result = $data;

            $data2 = $result;

            $datanew = [];
            foreach ($data2 as $item){
                $found = false;
                foreach ($data1 as $resume) {
                    if (($item->noregistrasi == $resume['noregistrasi'])  && ($item->namaruangan == $resume['namaruangan'])) {
                
                        $found = true;
                        // break;
                    }
                }
                if ($found==false) {
                    $datanew[]= $item;
                }
            }

            $result = $datanew;
        }
        $result = array (
            'data' => $result,
            'as' => 'hehe'
        );
        return $this->respond($result);
    }
    public function getLaporanResumeIGD(Request $request)
    {
        ini_set('max_execution_time', 500);

        $dataPengunjung = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as p', 'p.id', '=', 'pd.nocmfk')            
            ->leftjoin('papjstatus_t as pj', 'pj.norec_pd', '=', 'pd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftJoin('statuspulang_m as sp', 'sp.id', '=', 'pd.objectstatuspulangfk')
            ->Join('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->Join('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            ->Join('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
            ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftjoin('statusvaksin_m as sv', 'sv.id', '=', 'pd.objectstatusvaksinfk')
            ->Join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->select(
                'p.nocm',
                'pd.noregistrasi',
               'ru.namaruangan',
               'pg.namalengkap',
               'p.namapasien',
               'pd.objectruanganasalfk'
            )
            ->where('pd.statusenabled', true)
            ->where('dept.id', '=', 24)
            ->where(function ($query) {
                $query->where('sp.statuspulang', '=', 'Pulang')
                    ->orWhere('sp.statuspulang', '=', 'Meninggal');
            })
            ->whereNotNull('pd.tglpulang');


        // $dataPengunjung = \DB::table('pasiendaftar_t as pd')
        // ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
        // ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
        // ->leftJoin('ruangan_m as ru2', 'ru2.id', '=', 'apd.objectruanganasalfk')
        // ->join('ruangan_m as ru3', 'ru3.id', '=', 'pd.objectruanganlastfk')
        // ->select(
        //     'pd.noregistrasi',
        //     'pd.norec as norec_pd',
        //     'pd.objectruanganlastfk',
        //     'apd.norec as norec_apd',
        //     'apd.objectruanganasalfk',
        //     'apd.objectruanganfk',
        //     'ru.namaruangan',
        //     'ru2.namaruangan as namaruanganasal'
        // )
        // ->where('apd.statusenabled', true)
        //     ->whereIn('ru3.objectdepartemenfk', [24])
        //     ->whereNotNull('pd.tglpulang')
        //     ->where('pd.statusenabled', true);

        if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('pd.tglpulang', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('pd.tglpulang', '<=', $request['tglAkhir']);
        }
        if (isset($request['StatusPasien']) && $request['StatusPasien'] != '' && $request['StatusPasien'] != 'undefined') {
            if ($request['StatusPasien'] == 'BARU') {
                $dataPengunjung = $dataPengunjung->where('pd.statuspasien', 'Baru');
            } else {
                $dataPengunjung = $dataPengunjung->whereIn('pd.statuspasien', ['Lama', '']);
            }
        }
        if (isset($request['dokterfk']) && $request['dokterfk'] != '' && $request['dokterfk'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('apd.objectpegawaifk',   $request['dokterfk']);
        }
        // $dataPengunjung = $dataPengunjung->orderBy('ru.id', 'asc');
        $dataPengunjung = $dataPengunjung->distinct();
        $dataPengunjung = $dataPengunjung->get();
        $data10 = [];
        $sama = false;
        $jmlPasien = 0;
        $jmlKunj = 0;
        foreach ($dataPengunjung as $item) {
            $sama = false;
            $i = 0;
            foreach ($data10 as $he) {
                if ($item->namaruangan == $data10[$i]['namaruangan']) {
                    $sama = true;
                    if ($item->objectruanganasalfk == null) {
                        $jmlPasien = (float)$he['jmlPasien'] + 1;
                        $jmlKunj = (float)$he['jmlKunj'] + 1;
                        $data10[$i]['jmlPasien'] = $jmlPasien;
                        $data10[$i]['jmlKunj'] = $jmlKunj;
                    } else {
                        $jmlKunj = (float)$he['jmlKunj'] + 1;
                        $data10[$i]['jmlKunj'] = $jmlKunj;
                    }
                }
                $i = $i + 1;
            }
            if ($sama == false) {
                $jmlPasien = 0;
                $jmlKunj = 0;
                if ($item->objectruanganasalfk == null) {
                    $jmlPasien = 1;
                    $jmlKunj = 1;
                } else {
                    $jmlKunj = 1;
                }
                $data10[] = array(
                    'namaruangan' => $item->namaruangan,
                    'jmlPasien' => $jmlPasien,
                    'jmlKunj' => $jmlKunj
                );
            }
        }
        
        $detail = null;
        if (isset($request['tglAwal']) && strtotime($request['tglAwal']) <= strtotime('2023-12-31 23:59')) {
            $detail = \DB::table('pasiendaftar_t as pd')
                ->join('pasien_m as p', 'p.id', '=', 'pd.nocmfk')            
                ->leftjoin('papjstatus_t as pj', 'pj.norec_pd', '=', 'pd.norec')
                ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
                ->leftJoin('statuspulang_m as sp', 'sp.id', '=', 'pd.objectstatuspulangfk')
                ->Join('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
                ->Join('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
                ->Join('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
                ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
                ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
                ->leftjoin('statusvaksin_m as sv', 'sv.id', '=', 'pd.objectstatusvaksinfk')
                ->leftJoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                // ->leftJoin('emrpasien_t as ep', 'ep.norec_apd', '=', 'apd.norec')
                ->leftJoin('emrpasien_t as ep', 'ep.norec_apd', '=', 'apd.norec')
                ->select(
                    'p.nocm',
                    'pd.noregistrasi',
                'ru.namaruangan',
                'pg.namalengkap',
                'p.namapasien'
                )
                ->where('pd.statusenabled', true)
                ->where('dept.id', '=', 24)
                ->where(function ($query) {
                    $query->where('sp.statuspulang', '=', 'Pulang')
                        ->orWhere('sp.statuspulang', '=', 'Meninggal');
                })
                ->where('ep.emrfk', 912)
                ->whereNotNull('pd.tglpulang');
            }else{
                $detail = \DB::table('pasiendaftar_t as pd')
                ->join('pasien_m as p', 'p.id', '=', 'pd.nocmfk')            
                ->leftjoin('papjstatus_t as pj', 'pj.norec_pd', '=', 'pd.norec')
                ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
                ->leftJoin('statuspulang_m as sp', 'sp.id', '=', 'pd.objectstatuspulangfk')
                ->Join('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
                ->Join('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
                ->Join('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
                ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
                ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
                ->leftjoin('statusvaksin_m as sv', 'sv.id', '=', 'pd.objectstatusvaksinfk')
                ->leftJoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                // ->leftJoin('emrpasien_t as ep', 'ep.norec_apd', '=', 'apd.norec')
                ->leftJoin('emrpasien_t as ep', 'ep.norec_apd', '=', 'apd.norec')
                ->select(
                    'p.nocm',
                    'pd.noregistrasi',
                'ru.namaruangan',
                'pg.namalengkap',
                'p.namapasien'
                )
                ->where('pd.statusenabled', true)
                ->where('dept.id', '=', 24)
                ->where(function ($query) {
                    $query->where('sp.statuspulang', '=', 'Pulang')
                        ->orWhere('sp.statuspulang', '=', 'Meninggal');
                })
                ->where('ep.emrfk', 912)
                ->whereNotNull('pd.tglpulang');
            }

        // $detail = \DB::table('emrpasien_t as ep')
        // ->join('emr_t as e', 'e.id', '=', 'ep.emrfk')
        // ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'ep.norec_apd')
        // ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
        // ->select('ru.namaruangan', 'ep.norec_apd')
        // ->whereIn('ru.objectdepartemenfk', [24])
        //     ->where('ep.emrfk', 912);
        if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
            $detail = $detail->where('pd.tglpulang', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
            $detail = $detail->where('pd.tglpulang', '<=', $request['tglAkhir']);
        }
        if (isset($request['dokterfk']) && $request['dokterfk'] != '' && $request['dokterfk'] != 'undefined') {
            $detail = $detail->where('apd.objectpegawaifk',   $request['dokterfk']);
        }
        // $detail = $detail->groupBy('ru.namaruangan', 'ep.norec_apd', 'ru.id');
        // $detail = $detail->orderBy('ru.id', 'asc');
        $detail = $detail->distinct();
        $detail = $detail->get();
        $data11 = [];
        $sama = false;
        $jmlPerawat = 0;
        foreach ($detail as $item) {
            $sama = false;
            $i = 0;
            foreach ($data11 as $he) {
                if ($item->namaruangan == $data11[$i]['namaruangan']) {
                    $sama = true;
                    $jmlPerawat = (float)$he['jmlPerawat'] + 1;
                    $data11[$i]['jmlPerawat'] = $jmlPerawat;
                }
                $i = $i + 1;
            }
            if ($sama == false) {
                $jmlPerawat = 1;
                $data11[] = array(
                    'namaruangan' => $item->namaruangan,
                    'jmlPerawat' => $jmlPerawat,
                );
            }
        }
        $ruangan = \DB::table('ruangan_m')
        ->select('id', 'namaruangan')
        ->where('statusenabled', true)
            ->whereIn('objectdepartemenfk', [24])
            ->get();
        $result = array(
            'data10' => $data10,
            'data11' => $data11,
            'ruangan' => $ruangan,
            // 'datapengunjung' => $data
            'as' => 'epic'
        );
        
        return $this->respond($result);
    }
    public function getLaporanSudahIsiResumeMedisIGDDetail(Request $request)
    {
        if ($request['setParam'] == 1) {

            $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as p', 'p.id', '=', 'pd.nocmfk')            
            ->leftjoin('papjstatus_t as pj', 'pj.norec_pd', '=', 'pd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftJoin('statuspulang_m as sp', 'sp.id', '=', 'pd.objectstatuspulangfk')
            ->Join('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->Join('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            ->Join('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
            ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftjoin('statusvaksin_m as sv', 'sv.id', '=', 'pd.objectstatusvaksinfk')
            ->Join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->select(
                'p.nocm',
                'pd.noregistrasi',
               'ru.namaruangan',
               'pg.namalengkap',
               'p.namapasien'
            )
            ->where('pd.statusenabled', true)
            ->where('dept.id', '=', 24)
            ->where(function ($query) {
                $query->where('sp.statuspulang', '=', 'Pulang')
                      ->orWhere('sp.statuspulang', '=', 'Meninggal');
            })
            ->whereNotNull('pd.tglpulang');


            // $data = DB::table('antrianpasiendiperiksa_t as apd')
            // ->join('pasiendaftar_t as pd', 'pd.norec', '=', 'apd.noregistrasifk')
            // ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            // ->join('ruangan_m as ru2', 'ru2.id', '=', 'pd.objectruanganlastfk')
            // ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            // ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'apd.objectpegawaifk')
            // ->select('ps.nocm', 'pd.noregistrasi', 'ps.namapasien', 'ru.namaruangan', 'pg.namalengkap')
            // ->where('ru2.objectdepartemenfk', 24)
            // ->whereNotNull('pd.tglpulang')
            // ->where('pd.statusenabled', true)
            //     ->where('apd.statusenabled', true);

            if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
                $data = $data->where('pd.tglpulang', '>=', $request['tglAwal']);
            }
            if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
                $data = $data->where('pd.tglpulang', '<=', $request['tglAkhir']);
            }
            if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                if ($request['namaruangan'] == "PICU DAN HCU ANAK") {
                    $data = $data->where('ru.namaexternal', $request['namaruangan']);
                } else {
                    $data = $data->where('ru.namaruangan', '=', $request['namaruangan']);
                }
            }
            if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
                $data = $data->where('apd.objectpegawaifk', '=', $request['dokterfk']);
            } 
            $data = $data->distinct();
            $data = $data->get();
        } else if ($request['setParam'] == 2) {
            $data = null;
            if (isset($request['tglAwal']) && strtotime($request['tglAwal']) <= strtotime('2023-12-31 23:59')) {
                $data = \DB::table('pasiendaftar_t as pd')
                ->join('pasien_m as p', 'p.id', '=', 'pd.nocmfk')            
                ->leftjoin('papjstatus_t as pj', 'pj.norec_pd', '=', 'pd.norec')
                ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
                ->leftJoin('statuspulang_m as sp', 'sp.id', '=', 'pd.objectstatuspulangfk')
                ->Join('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
                ->Join('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
                ->Join('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
                ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
                ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
                ->leftjoin('statusvaksin_m as sv', 'sv.id', '=', 'pd.objectstatusvaksinfk')
                ->leftJoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                ->leftJoin('emrpasien_t as ep', 'ep.norec_apd', '=', 'apd.norec')
                ->select(
                    'p.nocm',
                    'pd.noregistrasi',
                'ru.namaruangan',
                'pg.namalengkap',
                'p.namapasien'
                )
                ->where('pd.statusenabled', true)
                ->where('dept.id', '=', 24)
                ->where(function ($query) {
                    $query->where('sp.statuspulang', '=', 'Pulang')
                        ->orWhere('sp.statuspulang', '=', 'Meninggal');
                })
                ->where('ep.emrfk', 912)
                ->whereNotNull('pd.tglpulang');
                }else{
                    $data = \DB::table('pasiendaftar_t as pd')
                    ->join('pasien_m as p', 'p.id', '=', 'pd.nocmfk')            
                    ->leftjoin('papjstatus_t as pj', 'pj.norec_pd', '=', 'pd.norec')
                    ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
                    ->leftJoin('statuspulang_m as sp', 'sp.id', '=', 'pd.objectstatuspulangfk')
                    ->Join('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
                    ->Join('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
                    ->Join('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
                    ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
                    ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
                    ->leftjoin('statusvaksin_m as sv', 'sv.id', '=', 'pd.objectstatusvaksinfk')
                    ->leftJoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                    ->leftJoin('emrpasien_t as ep', 'ep.norec_apd', '=', 'apd.norec')
                    ->select(
                        'p.nocm',
                        'pd.noregistrasi',
                    'ru.namaruangan',
                    'pg.namalengkap',
                    'p.namapasien'
                    )
                    ->where('pd.statusenabled', true)
                    ->where('dept.id', '=', 24)
                    ->where(function ($query) {
                        $query->where('sp.statuspulang', '=', 'Pulang')
                            ->orWhere('sp.statuspulang', '=', 'Meninggal');
                    })
                    ->where('ep.emrfk', 912)
                    ->whereNotNull('pd.tglpulang');
                }

            // $data = DB::table('emrpasien_t as ep')
            // ->join('pegawai_m as pg', 'pg.id', '=', 'ep.pegawaifk')
            // ->select('ep.nocm', 'noregistrasifk as noregistrasi', 'namapasien', 'namaruangan', 'pg.namalengkap')
            // ->where('ep.emrfk', 912);
            if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
                $data = $data->where('pd.tglpulang', '>=', $request['tglAwal']);
            }
            if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
                $data = $data->where('pd.tglpulang', '<=', $request['tglAkhir']);
            }
            if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                $data = $data->where('ep.namaruangan', '=', $request['namaruangan']);
            }
            if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
                $data = $data->where('apd.objectpegawaifk', '=', $request['dokterfk']);
            } 
            // $data = $data->groupBy('ep.nocm', 'noregistrasifk', 'namapasien', 'namaruangan', 'pg.namalengkap');
            // $data = $data->orderBy('namapasien');
            $data = $data->distinct();
            $data = $data->get();
        } else if ($request['setParam'] == 3){
            
            $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as p', 'p.id', '=', 'pd.nocmfk')            
            ->leftjoin('papjstatus_t as pj', 'pj.norec_pd', '=', 'pd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftJoin('statuspulang_m as sp', 'sp.id', '=', 'pd.objectstatuspulangfk')
            ->Join('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->Join('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
            ->Join('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
            ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftjoin('statusvaksin_m as sv', 'sv.id', '=', 'pd.objectstatusvaksinfk')
            ->Join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->select(
                'p.nocm',
                'pd.noregistrasi',
               'ru.namaruangan',
               'pg.namalengkap',
               'p.namapasien'
            )
            ->where('pd.statusenabled', true)
            ->where('dept.id', '=', 24)
            ->where(function ($query) {
                $query->where('sp.statuspulang', '=', 'Pulang')
                      ->orWhere('sp.statuspulang', '=', 'Meninggal');
            })
            ->whereNotNull('pd.tglpulang');

            if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
                $data = $data->where('pd.tglpulang', '>=', $request['tglAwal']);
            }
            if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
                $data = $data->where('pd.tglpulang', '<=', $request['tglAkhir']);
            }
            if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                if ($request['namaruangan'] == "PICU DAN HCU ANAK") {
                    $data = $data->where('ru.namaexternal', $request['namaruangan']);
                } else {
                    $data = $data->where('ru.namaruangan', '=', $request['namaruangan']);
                }
            }
            if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
                $data = $data->where('apd.objectpegawaifk', '=', $request['dokterfk']);
            } 
            $data = $data->distinct();
            $data = $data->get();

            $dataPasien = $data;

            if (isset($request['tglAwal']) && strtotime($request['tglAwal']) <= strtotime('2023-12-31 23:59')) {
                $data = \DB::table('pasiendaftar_t as pd')
                ->join('pasien_m as p', 'p.id', '=', 'pd.nocmfk')            
                ->leftjoin('papjstatus_t as pj', 'pj.norec_pd', '=', 'pd.norec')
                ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
                ->leftJoin('statuspulang_m as sp', 'sp.id', '=', 'pd.objectstatuspulangfk')
                ->Join('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
                ->Join('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
                ->Join('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
                ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
                ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
                ->leftjoin('statusvaksin_m as sv', 'sv.id', '=', 'pd.objectstatusvaksinfk')
                ->leftJoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                ->leftJoin('emrpasien_t as ep', 'ep.norec_apd', '=', 'apd.norec')
                ->select(
                    'p.nocm',
                    'pd.noregistrasi',
                'ru.namaruangan',
                'pg.namalengkap',
                'p.namapasien'
                )
                ->where('pd.statusenabled', true)
                ->where('dept.id', '=', 24)
                ->where(function ($query) {
                    $query->where('sp.statuspulang', '=', 'Pulang')
                        ->orWhere('sp.statuspulang', '=', 'Meninggal');
                })
                ->where('ep.emrfk', 912)
                ->whereNotNull('pd.tglpulang');
                }else{
                    $data = \DB::table('pasiendaftar_t as pd')
                    ->join('pasien_m as p', 'p.id', '=', 'pd.nocmfk')            
                    ->leftjoin('papjstatus_t as pj', 'pj.norec_pd', '=', 'pd.norec')
                    ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
                    ->leftJoin('statuspulang_m as sp', 'sp.id', '=', 'pd.objectstatuspulangfk')
                    ->Join('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
                    ->Join('departemen_m as dept', 'dept.id', '=', 'ru.objectdepartemenfk')
                    ->Join('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
                    ->leftjoin('pemakaianasuransi_t as pa', 'pa.noregistrasifk', '=', 'pd.norec')
                    ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
                    ->leftjoin('statusvaksin_m as sv', 'sv.id', '=', 'pd.objectstatusvaksinfk')
                    ->leftJoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
                    ->leftJoin('emrpasien_t as ep', 'ep.norec_apd', '=', 'apd.norec')
                    ->select(
                        'p.nocm',
                        'pd.noregistrasi',
                    'ru.namaruangan',
                    'pg.namalengkap',
                    'p.namapasien'
                    )
                    ->where('pd.statusenabled', true)
                    ->where('dept.id', '=', 24)
                    ->where(function ($query) {
                        $query->where('sp.statuspulang', '=', 'Pulang')
                            ->orWhere('sp.statuspulang', '=', 'Meninggal');
                    })
                    ->where('ep.emrfk', 912)
                    ->whereNotNull('pd.tglpulang');
                }

            // $data = DB::table('emrpasien_t as ep')
            // ->join('pegawai_m as pg', 'pg.id', '=', 'ep.pegawaifk')
            // ->select('ep.nocm', 'noregistrasifk as noregistrasi', 'namapasien', 'namaruangan', 'pg.namalengkap')
            // ->where('ep.emrfk', 912);
            if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
                $data = $data->where('pd.tglpulang', '>=', $request['tglAwal']);
            }
            if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
                $data = $data->where('pd.tglpulang', '<=', $request['tglAkhir']);
            }
            if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                $data = $data->where('ep.namaruangan', '=', $request['namaruangan']);
            }
            if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
                $data = $data->where('apd.objectpegawaifk', '=', $request['dokterfk']);
            } 
            // $data = $data->groupBy('ep.nocm', 'noregistrasifk', 'namapasien', 'namaruangan', 'pg.namalengkap');
            // $data = $data->orderBy('namapasien');
            $data = $data->distinct();
            $data = $data->get();
            $dataResume = $data;
            $dataBaru = [];
            foreach ($dataPasien as $item){
                $found=false;
                foreach ($dataResume as $resume) {
                    if (($item->noregistrasi == $resume->noregistrasi)  && ($item->namaruangan == $resume->namaruangan)) {
                  
                        $found = true;
                        // break;
                    }
                }
                if ($found==false) {
                  $dataBaru[] = $item;
                }
            }
            $data = $dataBaru;

        }
        $result = array(
            'data' => $data,
            'as' => 'hehe'
        );
        return $this->respond($result);
    }
    public function getLaporanResumeRI(Request $request)
    {
        ini_set('max_execution_time', 500);
        $dataPengunjung = \DB::table('pasiendaftar_t as pd')
        // ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
        ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
        // ->leftJoin('ruangan_m as ru2', 'ru2.id', '=', 'apd.objectruanganasalfk')
        ->select(
            'pd.noregistrasi',
            'pd.norec as norec_pd',
            'pd.objectruanganlastfk',
            // 'apd.norec as norec_apd',
            // 'apd.objectruanganasalfk',
            // 'apd.objectruanganfk',
            'ru.namaruangan'
            // 'ru2.namaruangan as namaruanganasal'
        )
        // ->where('apd.statusenabled', true)
            ->whereIn('ru.objectdepartemenfk', [16])
            ->whereNotNull('pd.tglpulang')
            ->where('pd.statusenabled', true);

        if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('pd.tglpulang', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('pd.tglpulang', '<=', $request['tglAkhir']);
        }
        if (isset($request['StatusPasien']) && $request['StatusPasien'] != '' && $request['StatusPasien'] != 'undefined') {
            if ($request['StatusPasien'] == 'BARU') {
                $dataPengunjung = $dataPengunjung->where('pd.statuspasien', 'Baru');
            } else {
                $dataPengunjung = $dataPengunjung->whereIn('pd.statuspasien', ['Lama', '']);
            }
        }
        if (isset($request['dokterfk']) && $request['dokterfk'] != '' && $request['dokterfk'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('pd.objectpegawaifk',   $request['dokterfk']);
        }
        $dataPengunjung = $dataPengunjung->orderBy('ru.id', 'asc');
        $dataPengunjung = $dataPengunjung->get();
        $data10 = [];
        $sama = false;
        $jmlPasien = 0;
        $jmlKunj = 0;
        foreach ($dataPengunjung as $item) {
            $sama = false;
            $i = 0;
            foreach ($data10 as $he) {
                if ($item->namaruangan == $data10[$i]['namaruangan']) {
                    $sama = true;
                    // if ($item->objectruanganasalfk == null) {
                    //     $jmlPasien = (float)$he['jmlPasien'] + 1;
                    //     $jmlKunj = (float)$he['jmlKunj'] + 1;
                    //     $data10[$i]['jmlPasien'] = $jmlPasien;
                    //     $data10[$i]['jmlKunj'] = $jmlKunj;
                    // } else {
                        $jmlKunj = (float)$he['jmlKunj'] + 1;
                        $data10[$i]['jmlKunj'] = $jmlKunj;
                    // }
                }
                $i = $i + 1;
            }
            if ($sama == false) {
                $jmlPasien = 0;
                $jmlKunj = 0;
                // if ($item->objectruanganasalfk == null) {
                //     $jmlPasien = 1;
                //     $jmlKunj = 1;
                // } else {
                    $jmlKunj = 1;
                // }
                $data10[] = array(
                    'namaruangan' => $item->namaruangan,
                    // 'jmlPasien' => $jmlPasien,
                    'jmlKunj' => $jmlKunj
                );
            }
        }

        $detail = null;
        if (isset($request['tglAwal']) && strtotime($request['tglAwal']) <= strtotime('2023-12-31 23:59')) {
            $detail =  \DB::table('pasiendaftar_t as pd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('emrpasien_t as ep', 'ep.noregistrasifk', '=', 'pd.noregistrasi')
            ->select(
                'pd.noregistrasi',
                'pd.norec as norec_pd',
                'pd.objectruanganlastfk',
                'ru.namaruangan'
            )
                ->whereIn('ru.objectdepartemenfk', [16])
                ->whereNotNull('pd.tglpulang')
                ->where('ep.emrfk', 104)
                ->where('pd.statusenabled', true);
        }else{
            $detail =  \DB::table('pasiendaftar_t as pd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('emrpasien_t as ep', 'ep.noregistrasifk', '=', 'pd.noregistrasi')
            ->select(
                'pd.noregistrasi',
                'pd.norec as norec_pd',
                'pd.objectruanganlastfk',
                'ru.namaruangan'
            )
                ->whereIn('ru.objectdepartemenfk', [16])
                ->whereNotNull('pd.tglpulang')
                ->where('ep.emrfk', 104)
                ->where('pd.statusenabled', true);
        }
        if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
            $detail = $detail->where('pd.tglpulang', '>=', $request['tglAwal']);
        }    
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
            $detail = $detail->where('pd.tglpulang', '<=', $request['tglAkhir']);
        }    
        if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
            if($request['namaruangan'] == "PICU DAN HCU ANAK") {
                $detail = $detail->where('ru.namaexternal', $request['namaruangan']);
            } else {
                $detail = $detail->where('ru.namaruangan', '=', $request['namaruangan']);
            }
        }
        if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
            $detail = $detail->where('pd.objectpegawaifk', '=', $request['dokterfk']);
        } 
        // $data = $data->distinct();
        $detail = $detail->get();

        $detail = array_map("unserialize", array_unique(array_map("serialize", $detail)));

        // $detail = \DB::table('emrpasien_t as ep')
        // ->join('emr_t as e', 'e.id', '=', 'ep.emrfk')
        // ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'ep.norec_apd')
        // ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
        // ->select('ru.namaruangan', 'ep.norec_apd')
        // ->whereIn('ru.objectdepartemenfk', [16]) 
        //     ->where('ep.emrfk', 104);
        // if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
        //     $detail = $detail->where('apd.tglmasuk', '>=', $request['tglAwal']);
        // }
        // if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
        //     $detail = $detail->where('apd.tglmasuk', '<=', $request['tglAkhir']);
        // }
        // if (isset($request['dokterfk']) && $request['dokterfk'] != '' && $request['dokterfk'] != 'undefined') {
        //     $detail = $detail->where('ep.pegawaifk',   $request['dokterfk']);
        // }
        // $detail = $detail->groupBy('ru.namaruangan', 'ep.norec_apd', 'ru.id');
        // $detail = $detail->orderBy('ru.id', 'asc');
        // $detail = $detail->get();

        
        $data11 = [];
        $sama = false;
        $jmlPerawat = 0;
        foreach ($detail as $item) {
            $sama = false;
            $i = 0;
            foreach ($data11 as $he) {
                if ($item->namaruangan == $data11[$i]['namaruangan']) {
                    $sama = true;
                        $jmlPerawat = (float)$he['jmlPerawat'] + 1;
                        $data11[$i]['jmlPerawat'] = $jmlPerawat;
                }
                $i = $i + 1;
            }
            if ($sama == false) {
                $jmlPerawat = 1;
                $data11[] = array (
                    'namaruangan' => $item->namaruangan,
                    'jmlPerawat' => $jmlPerawat,
                );
            }
        }
    $ruangan = \DB::table('ruangan_m')
        ->select('id', 'namaruangan')
        ->where('statusenabled', true)
        ->whereIn('objectdepartemenfk', [16])
        ->get();
    $result = array (
        'data10' => $data10,
        'data11' => $data11,
        'ruangan' => $ruangan,
        'as' => 'epic'
    );
        return $this->respond($result);
    }
    public function getLaporanSudahIsiResumeMedisRIDetail(Request $request)
    {
        if ($request['setParam'] == 1) {
            $data = \DB::table('pasiendaftar_t as pd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->select('ps.nocm', 'pd.noregistrasi', 'ps.namapasien', 'ru.namaruangan', 'pg.namalengkap')
            ->where('pd.statusenabled', true)
            ->whereNotNull('pd.tglpulang');
            
            if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
                $data = $data->where('pd.tglpulang', '>=', $request['tglAwal']);
            }    
            if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
                $data = $data->where('pd.tglpulang', '<=', $request['tglAkhir']);
            }    
            if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                if($request['namaruangan'] == "PICU DAN HCU ANAK") {
                    $data = $data->where('ru.namaexternal', $request['namaruangan']);
                } else {
                    $data = $data->where('ru.namaruangan', '=', $request['namaruangan']);
                }
            }
            if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
                $data = $data->where('pd.objectpegawaifk', '=', $request['dokterfk']);
            } 
            if ($request['StatusPasien'] == 'BARU') {
                $data = $data->where('pd.statuspasien', '=', 'Baru');
            } else if ($request['StatusPasien'] == 'LAMA') {
                $data = $data->whereIn('pd.statuspasien', ['LAMA', '']);
                // $status = " AND (pd.statuspasien IN ('LAMA', '')) ";
            }
            $data = $data->get();
            $result = $data;
    } else if ($request['setParam'] == 2) {

        $data = null;
        if (isset($request['tglAwal']) && strtotime($request['tglAwal']) <= strtotime('2023-12-31 23:59')) {
            $data =  \DB::table('pasiendaftar_t as pd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftJoin('emrpasien_t as ep', 'ep.noregistrasifk', '=', 'pd.noregistrasi')
            ->select('ps.nocm', 'pd.noregistrasi', 'ps.namapasien', 'ru.namaruangan', 'pg.namalengkap')
                ->whereIn('ru.objectdepartemenfk', [16])
                ->whereNotNull('pd.tglpulang')
                ->where('ep.emrfk', 104)
                ->where('pd.statusenabled', true);
        }else{
            $data =  \DB::table('pasiendaftar_t as pd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftJoin('emrpasien_t as ep', 'ep.noregistrasifk', '=', 'pd.noregistrasi')
            ->select('ps.nocm', 'pd.noregistrasi', 'ps.namapasien', 'ru.namaruangan', 'pg.namalengkap')
                ->whereIn('ru.objectdepartemenfk', [16])
                ->whereNotNull('pd.tglpulang')
                ->where('ep.emrfk', 104)
                ->where('pd.statusenabled', true);
        }
       
            
            if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
                $data = $data->where('pd.tglpulang', '>=', $request['tglAwal']);
            }    
            if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
                $data = $data->where('pd.tglpulang', '<=', $request['tglAkhir']);
            }    
            if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                if($request['namaruangan'] == "PICU DAN HCU ANAK") {
                    $data = $data->where('ru.namaexternal', $request['namaruangan']);
                } else {
                    $data = $data->where('ru.namaruangan', '=', $request['namaruangan']);
                }
            }
            if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
                $data = $data->where('pd.objectpegawaifk', '=', $request['dokterfk']);
            } 
            // $data = $data->distinct();
            $data = $data->get();
            // $data = array_map("unserialize", array_unique(array_map("serialize", $data)));
            $serializedData = array_map('serialize', $data);
            $uniqueSerializedData = array_unique($serializedData);
            $uniqueData = array_map('unserialize', $uniqueSerializedData);

            $result = [];
            foreach ($uniqueData as $item) {
                $result[] = [
                    'nocm' => $item->nocm,
                    'noregistrasi' => $item->noregistrasi,
                    'namapasien' => $item->namapasien,
                    'namaruangan' => $item->namaruangan,
                    'namalengkap' => $item->namalengkap,
                ];
            }

        // $data = DB::table('emrpasien_t as ep')
        //     ->join('pegawai_m as pg', 'pg.id', '=', 'ep.pegawaifk')
        //     ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.')
        //     ->select('ep.nocm',  DB::raw('MAX(noregistrasifk) as noregistrasi'),'namapasien', 'namaruangan',  DB::raw('MAX(pg.namalengkap) as namalengkap'))
        //     ->where('ep.emrfk', 104);
        // if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
        //     $data = $data->where('ep.tglregistrasi', '>=', $request['tglAwal']);
        // }    
        // if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
        //     $data = $data->where('ep.tglregistrasi', '<=', $request['tglAkhir']);
        // }    
        // if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
        //     $data = $data->where('ep.namaruangan', '=', $request['namaruangan']);
        // }
        // if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
        //     $data = $data->where('ep.pegawaifk', '=', $request['dokterfk']);
        // } 
        // $data = $data->groupBy('ep.nocm', 'namapasien', 'namaruangan');
        // $data = $data->orderBy('namapasien');
        // $data = $data->get();
            }else if ($request['setParam'] == 3){
                $dataPulang = \DB::table('pasiendaftar_t as pd')
                ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
                ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                ->leftjoin('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
                ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
                ->leftjoin('jaminankhusus_m as jku', 'jku.id', '=', 'pd.objectjaminankhusus')
                ->select('ps.nocm', 'pd.noregistrasi', 'ps.namapasien', 'ru.namaruangan', 'pg.namalengkap','pd.tglregistrasi', 'rk.namarekanan', 'jku.namaexternal as jaminankhusus')
                ->where('pd.statusenabled', true)
                ->whereNotNull('pd.tglpulang');
                
                if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
                    $dataPulang = $dataPulang->where('pd.tglpulang', '>=', $request['tglAwal']);
                }    
                if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
                    $dataPulang = $dataPulang->where('pd.tglpulang', '<=', $request['tglAkhir']);
                }    
                if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                    if($request['namaruangan'] == "PICU DAN HCU ANAK") {
                        $dataPulang = $dataPulang->where('ru.namaexternal', $request['namaruangan']);
                    } else {
                        $dataPulang = $dataPulang->where('ru.namaruangan', '=', $request['namaruangan']);
                    }
                }
                if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
                    $dataPulang = $dataPulang->where('pd.objectpegawaifk', '=', $request['dokterfk']);
                } 
                // $data = $data->distinct();
                $dataPulang = $dataPulang->get();
           

                $data =  \DB::table('pasiendaftar_t as pd')
                ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
                ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
                ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                ->leftJoin('emrpasien_t as ep', 'ep.noregistrasifk', '=', 'pd.noregistrasi')
                ->select('ps.nocm', 'pd.noregistrasi', 'ps.namapasien', 'ru.namaruangan', 'pg.namalengkap')
                    ->whereIn('ru.objectdepartemenfk', [16])
                    ->whereNotNull('pd.tglpulang')
                    ->where('ep.emrfk', 104)
                    ->where('pd.statusenabled', true);
                
                if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
                    $data = $data->where('pd.tglpulang', '>=', $request['tglAwal']);
                }    
                if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
                    $data = $data->where('pd.tglpulang', '<=', $request['tglAkhir']);
                }    
                if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                    if($request['namaruangan'] == "PICU DAN HCU ANAK") {
                        $data = $data->where('ru.namaexternal', $request['namaruangan']);
                    } else {
                        $data = $data->where('ru.namaruangan', '=', $request['namaruangan']);
                    }
                }
                if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
                    $data = $data->where('pd.objectpegawaifk', '=', $request['dokterfk']);
                } 
                // $data = $data->distinct();
                $data = $data->distinct()->get();
                // $result = $data;
                $temp = [];
                // foreach ($dataPengunjungCppt as $cppt) {
                //     if (($item->noregistrasi == $cppt->noregistrasi)  && ($item->namaruangan == $cppt->namaruangan)) {
                  
                //         $found = true;
                //         // break;
                //     }
                // }
                // if ($found==false) {
                //     $jmlBelumIsi = (float)$he['jmlBelumIsi'] + 1;
                //     $data10[$i]['jmlBelumIsi'] = $jmlBelumIsi;
                //     // break;
                // }

                foreach ($dataPulang as $item){
                    $found = false;
                    foreach ($data as $item2){
                        if (($item->noregistrasi == $item2->noregistrasi) && ($item->namaruangan == $item2->namaruangan) ){
                            $found = true;
                        }
                    }
                    if ($found==false) {
                        $temp [] = $item;
                    }
                }
                $result = $temp;
            }
        $result = array(
            'data' => $result,
            'as' => 'hehe'
        );
        return $this->respond($result);
    }
   
    public function getLaporanSudahCetakSuratKematian(Request $request)
    {
        ini_set('max_execution_time', 500);

        $dataPengunjung = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->join('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftjoin('statuskeluar_m as sk', 'sk.id', '=', 'pd.objectstatuskeluarfk')
            ->leftjoin('rekanan_m as rek', 'rek.id', '=', 'pd.objectrekananfk')
            ->leftjoin('statuspulang_m as sp', 'sp.id', '=', 'pd.objectstatuspulangfk')
            ->leftjoin('penyebabkematian_m as pk', 'pk.id', '=', 'pd.objectpenyebabkematianfk')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftjoin('ruangan_m as ru2', 'ru2.id', '=', 'apd.objectruanganfk')
            ->leftjoin('loggingusernew_t as lu', 'lu.noreff', '=', 'pd.norec')
            ->leftjoin('loginuser_s as lr', 'lr.id', '=', 'lu.objectloginuserfk')
            ->leftjoin('pegawai_m as pm', 'pm.id', '=', 'lr.objectpegawaifk')
            // ->leftjoin ('antrianpasiendiperiksa_t as apd','apd.noregistrasifk','=','pd.norec') apd.norec as norec_apd, yang menyebabkan double
            ->select(DB::raw("pd.norec as norec_pd,pd.tglregistrasi,pd.noregistrasi,ps.nocm,ps.namapasien,jk.jeniskelamin,ps.tgllahir,
                     sk.statuskeluar,sp.statuspulang,pd.namalengkapambilpasien,
                     kp.kelompokpasien, rek.namarekanan, pg.namalengkap as namadokter,
                     case when pd.objectpenyebabkematianfk = 4 then pd.keteranganpenyebabkematian else pk.penyebabkematian end as penyebabkematian,
                     pd.tglmeninggal, ru.namaruangan, pd.objectstatuskependudukanfk, lu.jenislog,
                     lu.objectloginuserfk,
                     lr.namaexternal,
                     pm.namaLengkap, pd.objectruanganasalfk"))
            ->where('pd.objectstatuskeluarfk', 5)
            // ->where('apd.objectruanganfk', 507)
            ->where('apd.statusenabled', 1)
            ->where('lu.jenislog' , '=', 'Meninggal');

        if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('pd.tglmeninggal', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('pd.tglmeninggal', '<=', $request['tglAkhir']);
        }
        if (isset($request['StatusPasien']) && $request['StatusPasien'] != '' && $request['StatusPasien'] != 'undefined') {
            if ($request['StatusPasien'] == 'BARU') {
                $dataPengunjung = $dataPengunjung->where('pd.statuspasien', 'Baru');
            } else {
                $dataPengunjung = $dataPengunjung->whereIn('pd.statuspasien', ['Lama', '']);
            }
        }
        if (isset($request['dokterfk']) && $request['dokterfk'] != '' && $request['dokterfk'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('apd.objectpegawaifk',   $request['dokterfk']);
        }
        // $dataPengunjung = $dataPengunjung->orderBy('ru.id', 'asc');
        $dataPengunjung = $dataPengunjung->distinct();
        $dataPengunjung = $dataPengunjung->get();
        $noregistrasiColumn = array_map(function ($item) {
            return is_object($item) ? $item->noregistrasi : $item['noregistrasi'];
        }, $dataPengunjung);

        $uniqueNoregistrasi = array_unique($noregistrasiColumn);

        $uniqueData = [];
        foreach ($dataPengunjung as $currentData) {
            $currentNoregistrasi = is_object($currentData) ? $currentData->noregistrasi : $currentData['noregistrasi'];
            if (in_array($currentNoregistrasi, $uniqueNoregistrasi)) {
                $uniqueData[] = $currentData;
                $key = array_search($currentNoregistrasi, $uniqueNoregistrasi);
                unset($uniqueNoregistrasi[$key]);
            }
        }

        $dataPengunjung = $uniqueData;
        $data10 = [];
        $sama = false;
        $jmlPasien = 0;
        $jmlKunj = 0;
        foreach ($dataPengunjung as $item) {
            $sama = false;
            $i = 0;
            foreach ($data10 as $he) {
                if ($item->namaruangan == $data10[$i]['namaruangan']) {
                    $sama = true;
                    if ($item->objectruanganasalfk == null) {
                        $jmlPasien = (float)$he['jmlPasien'] + 1;
                        $jmlKunj = (float)$he['jmlKunj'] + 1;
                        $data10[$i]['jmlPasien'] = $jmlPasien;
                        $data10[$i]['jmlKunj'] = $jmlKunj;
                    } else {
                        $jmlKunj = (float)$he['jmlKunj'] + 1;
                        $data10[$i]['jmlKunj'] = $jmlKunj;
                    }
                }
                $i = $i + 1;
            }
            if ($sama == false) {
                $jmlPasien = 0;
                $jmlKunj = 0;
                if ($item->objectruanganasalfk == null) {
                    $jmlPasien = 1;
                    $jmlKunj = 1;
                } else {
                    $jmlKunj = 1;
                }
                $data10[] = array(
                    'namaruangan' => $item->namaruangan,
                    'jmlPasien' => $jmlPasien,
                    'jmlKunj' => $jmlKunj
                );
            }
        }

        $detail = \DB::table('pasiendaftar_t as pd')
        ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
        ->join('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
        ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
        ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
        ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
        ->leftjoin('statuskeluar_m as sk', 'sk.id', '=', 'pd.objectstatuskeluarfk')
        ->leftjoin('rekanan_m as rek', 'rek.id', '=', 'pd.objectrekananfk')
        ->leftjoin('statuspulang_m as sp', 'sp.id', '=', 'pd.objectstatuspulangfk')
        ->leftjoin('penyebabkematian_m as pk', 'pk.id', '=', 'pd.objectpenyebabkematianfk')
        ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
        ->leftjoin('ruangan_m as ru2', 'ru2.id', '=', 'apd.objectruanganfk')
        ->leftjoin('loggingusernew_t as lu', 'lu.noreff', '=', 'pd.norec')
        ->leftjoin('loginuser_s as lr', 'lr.id', '=', 'lu.objectloginuserfk')
        ->leftjoin('pegawai_m as pm', 'pm.id', '=', 'lr.objectpegawaifk')
        ->leftjoin('pasienmeninggal_t as pl', 'pl.noregistrasi', '=', 'pd.noregistrasi')
        // ->leftjoin ('antrianpasiendiperiksa_t as apd','apd.noregistrasifk','=','pd.norec') apd.norec as norec_apd, yang menyebabkan double
        ->select(DB::raw("pd.norec as norec_pd,pd.tglregistrasi,pd.noregistrasi,ps.nocm,ps.namapasien,jk.jeniskelamin,ps.tgllahir,
                 sk.statuskeluar,sp.statuspulang,pd.namalengkapambilpasien,
                 kp.kelompokpasien, rek.namarekanan, pg.namalengkap as namadokter,
                 case when pd.objectpenyebabkematianfk = 4 then pd.keteranganpenyebabkematian else pk.penyebabkematian end as penyebabkematian,
                 pd.tglmeninggal, ru.namaruangan, pd.objectstatuskependudukanfk, lu.jenislog,
                 lu.objectloginuserfk,
                 lr.namaexternal,
                 pm.namaLengkap, pd.objectruanganasalfk"))
        ->where('pd.objectstatuskeluarfk', 5)
        ->whereNotNull('pl.nosuratkematian')

        // ->where('apd.objectruanganfk', 507)
        ->where('apd.statusenabled', 1)
        ->where('lu.jenislog' , '=', 'Meninggal');

        
        if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
            $detail = $detail->where('pd.tglmeninggal', '>=', $request['tglAwal']);
        }    
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
            $detail = $detail->where('pd.tglmeninggal', '<=', $request['tglAkhir']);
        }    
        if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
            if($request['namaruangan'] == "PICU DAN HCU ANAK") {
                $detail = $detail->where('ru.namaexternal', $request['namaruangan']);
            } else {
                $detail = $detail->where('ru.namaruangan', '=', $request['namaruangan']);
            }
        }
        if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
            $detail = $detail->where('apd.objectpegawaifk', '=', $request['dokterfk']);
        } 
        $detail = $detail->distinct();
        $detail = $detail->get();

        $noregistrasiColumn = array_map(function ($item) {
            return is_object($item) ? $item->noregistrasi : $item['noregistrasi'];
        }, $detail);

        $uniqueNoregistrasi = array_unique($noregistrasiColumn);

        $uniqueData = [];
        foreach ($detail as $currentData) {
            $currentNoregistrasi = is_object($currentData) ? $currentData->noregistrasi : $currentData['noregistrasi'];
            if (in_array($currentNoregistrasi, $uniqueNoregistrasi)) {
                $uniqueData[] = $currentData;
                $key = array_search($currentNoregistrasi, $uniqueNoregistrasi);
                unset($uniqueNoregistrasi[$key]);
            }
        }

        $detail = $uniqueData;

        // $detail = array_map("unserialize", array_unique(array_map("serialize", $detail)));

        // $detail = \DB::table('emrpasien_t as ep')
        // ->join('emr_t as e', 'e.id', '=', 'ep.emrfk')
        // ->join('antrianpasiendiperiksa_t as apd', 'apd.norec', '=', 'ep.norec_apd')
        // ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
        // ->select('ru.namaruangan', 'ep.norec_apd')
        // ->whereIn('ru.objectdepartemenfk', [16]) 
        //     ->where('ep.emrfk', 104);
        // if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
        //     $detail = $detail->where('apd.tglmasuk', '>=', $request['tglAwal']);
        // }
        // if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
        //     $detail = $detail->where('apd.tglmasuk', '<=', $request['tglAkhir']);
        // }
        // if (isset($request['dokterfk']) && $request['dokterfk'] != '' && $request['dokterfk'] != 'undefined') {
        //     $detail = $detail->where('ep.pegawaifk',   $request['dokterfk']);
        // }
        // $detail = $detail->groupBy('ru.namaruangan', 'ep.norec_apd', 'ru.id');
        // $detail = $detail->orderBy('ru.id', 'asc');
        // $detail = $detail->get();

        
        $data11 = [];
        $sama = false;
        $jmlPerawat = 0;
        foreach ($detail as $item) {
            $sama = false;
            $i = 0;
            foreach ($data11 as $he) {
                if ($item->namaruangan == $data11[$i]['namaruangan']) {
                    $sama = true;
                        $jmlPerawat = (float)$he['jmlPerawat'] + 1;
                        $data11[$i]['jmlPerawat'] = $jmlPerawat;
                }
                $i = $i + 1;
            }
            if ($sama == false) {
                $jmlPerawat = 1;
                $data11[] = array (
                    'namaruangan' => $item->namaruangan,
                    'jmlPerawat' => $jmlPerawat,
                );
            }
        }
    $ruangan = \DB::table('ruangan_m')
        ->select('id', 'namaruangan')
        ->where('statusenabled', true)
        // ->whereIn('objectdepartemenfk', [16])
        ->get();
    $result = array (
        'data10' => $data10,
        'data11' => $data11,
        'ruangan' => $ruangan,
        'as' => 'epic'
    );
        return $this->respond($result);
    }

    public function getLaporanSudahCetakSuratKematianDetail(Request $request)
    {
        if ($request['setParam'] == 1) {
            $data = \DB::table('pasiendaftar_t as pd')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->join('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
            ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
            ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftjoin('statuskeluar_m as sk', 'sk.id', '=', 'pd.objectstatuskeluarfk')
            ->leftjoin('rekanan_m as rek', 'rek.id', '=', 'pd.objectrekananfk')
            ->leftjoin('statuspulang_m as sp', 'sp.id', '=', 'pd.objectstatuspulangfk')
            ->leftjoin('penyebabkematian_m as pk', 'pk.id', '=', 'pd.objectpenyebabkematianfk')
            ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftjoin('ruangan_m as ru2', 'ru2.id', '=', 'apd.objectruanganfk')
            ->leftjoin('loggingusernew_t as lu', 'lu.noreff', '=', 'pd.norec')
            ->leftjoin('loginuser_s as lr', 'lr.id', '=', 'lu.objectloginuserfk')
            ->leftjoin('pegawai_m as pm', 'pm.id', '=', 'lr.objectpegawaifk')
            // ->leftjoin ('antrianpasiendiperiksa_t as apd','apd.noregistrasifk','=','pd.norec') apd.norec as norec_apd, yang menyebabkan double
            ->select(DB::raw("pd.norec as norec_pd,pd.tglregistrasi,pd.noregistrasi,ps.nocm,ps.namapasien,jk.jeniskelamin,ps.tgllahir,
                     sk.statuskeluar,sp.statuspulang,pd.namalengkapambilpasien,
                     kp.kelompokpasien, rek.namarekanan, pg.namalengkap as namadokter,
                     case when pd.objectpenyebabkematianfk = 4 then pd.keteranganpenyebabkematian else pk.penyebabkematian end as penyebabkematian,
                     pd.tglmeninggal, ru.namaruangan, pd.objectstatuskependudukanfk, lu.jenislog,
                     lu.objectloginuserfk,
                     lr.namaexternal,
                     pm.namaLengkap, pd.objectruanganasalfk, pg.namalengkap"))
            ->where('pd.objectstatuskeluarfk', 5)
            // ->where('apd.objectruanganfk', 507)
            ->where('apd.statusenabled', 1)
            ->where('lu.jenislog' , '=', 'Meninggal');
            
            if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
                $data = $data->where('pd.tglmeninggal', '>=', $request['tglAwal']);
            }    
            if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
                $data = $data->where('pd.tglmeninggal', '<=', $request['tglAkhir']);
            }    
            if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                if($request['namaruangan'] == "PICU DAN HCU ANAK") {
                    $data = $data->where('ru.namaexternal', $request['namaruangan']);
                } else {
                    $data = $data->where('ru.namaruangan', '=', $request['namaruangan']);
                }
            }
            if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
                $data = $data->where('apd.objectpegawaifk', '=', $request['dokterfk']);
            } 
            $data = $data->distinct();
            $data = $data->get();

            $noregistrasiColumn = array_map(function ($item) {
                return is_object($item) ? $item->noregistrasi : $item['noregistrasi'];
            }, $data);
    
            $uniqueNoregistrasi = array_unique($noregistrasiColumn);
    
            $uniqueData = [];
            foreach ($data as $currentData) {
                $currentNoregistrasi = is_object($currentData) ? $currentData->noregistrasi : $currentData['noregistrasi'];
                if (in_array($currentNoregistrasi, $uniqueNoregistrasi)) {
                    $uniqueData[] = $currentData;
                    $key = array_search($currentNoregistrasi, $uniqueNoregistrasi);
                    unset($uniqueNoregistrasi[$key]);
                }
            }
    
            $data = $uniqueData;

            $result = $data;
    } else if ($request['setParam'] == 2) {
        $data = \DB::table('pasiendaftar_t as pd')
        ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
        ->join('jeniskelamin_m as jk', 'jk.id', '=', 'ps.objectjeniskelaminfk')
        ->leftjoin('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
        ->leftJoin('kelompokpasien_m as kp', 'kp.id', '=', 'pd.objectkelompokpasienlastfk')
        ->leftjoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
        ->leftjoin('statuskeluar_m as sk', 'sk.id', '=', 'pd.objectstatuskeluarfk')
        ->leftjoin('rekanan_m as rek', 'rek.id', '=', 'pd.objectrekananfk')
        ->leftjoin('statuspulang_m as sp', 'sp.id', '=', 'pd.objectstatuspulangfk')
        ->leftjoin('penyebabkematian_m as pk', 'pk.id', '=', 'pd.objectpenyebabkematianfk')
        ->leftjoin('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
        ->leftjoin('ruangan_m as ru2', 'ru2.id', '=', 'apd.objectruanganfk')
        ->leftjoin('loggingusernew_t as lu', 'lu.noreff', '=', 'pd.norec')
        ->leftjoin('loginuser_s as lr', 'lr.id', '=', 'lu.objectloginuserfk')
        ->leftjoin('pegawai_m as pm', 'pm.id', '=', 'lr.objectpegawaifk')
        ->leftjoin('pasienmeninggal_t as pl', 'pl.noregistrasi', '=', 'pd.noregistrasi')
        // ->leftjoin ('antrianpasiendiperiksa_t as apd','apd.noregistrasifk','=','pd.norec') apd.norec as norec_apd, yang menyebabkan double
        ->select(DB::raw("pd.norec as norec_pd,pd.tglregistrasi,pd.noregistrasi,ps.nocm,ps.namapasien,jk.jeniskelamin,ps.tgllahir,
                 sk.statuskeluar,sp.statuspulang,pd.namalengkapambilpasien,
                 kp.kelompokpasien, rek.namarekanan, pg.namalengkap as namadokter,
                 case when pd.objectpenyebabkematianfk = 4 then pd.keteranganpenyebabkematian else pk.penyebabkematian end as penyebabkematian,
                 pd.tglmeninggal, ru.namaruangan, pd.objectstatuskependudukanfk, lu.jenislog,
                 lu.objectloginuserfk,
                 lr.namaexternal,
                 pm.namaLengkap, pd.objectruanganasalfk, pg.namalengkap"))
        ->where('pd.objectstatuskeluarfk', 5)
        ->whereNotNull('pl.nosuratkematian')

        // ->where('apd.objectruanganfk', 507)
        ->where('apd.statusenabled', 1)
        ->where('lu.jenislog' , '=', 'Meninggal');
            
            if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
                $data = $data->where('pd.tglmeninggal', '>=', $request['tglAwal']);
            }    
            if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
                $data = $data->where('pd.tglmeninggal', '<=', $request['tglAkhir']);
            }    
            if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                if($request['namaruangan'] == "PICU DAN HCU ANAK") {
                    $data = $data->where('ru.namaexternal', $request['namaruangan']);
                } else {
                    $data = $data->where('ru.namaruangan', '=', $request['namaruangan']);
                }
            }
            if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
                $data = $data->where('apd.objectpegawaifk', '=', $request['dokterfk']);
            } 
            $data = $data->distinct();
            $data = $data->get();
            // $data = array_map("unserialize", array_unique(array_map("serialize", $data)));
            $noregistrasiColumn = array_map(function ($item) {
                return is_object($item) ? $item->noregistrasi : $item['noregistrasi'];
            }, $data);
    
            $uniqueNoregistrasi = array_unique($noregistrasiColumn);
    
            $uniqueData = [];
            foreach ($data as $currentData) {
                $currentNoregistrasi = is_object($currentData) ? $currentData->noregistrasi : $currentData['noregistrasi'];
                if (in_array($currentNoregistrasi, $uniqueNoregistrasi)) {
                    $uniqueData[] = $currentData;
                    $key = array_search($currentNoregistrasi, $uniqueNoregistrasi);
                    unset($uniqueNoregistrasi[$key]);
                }
            }
    
            $data = $uniqueData;


            $result=$data;

            $result = [];
            foreach ($data as $item) {
                $result[] = [
                    'nocm' => $item->nocm,
                    'noregistrasi' => $item->noregistrasi,
                    'namapasien' => $item->namapasien,
                    'namaruangan' => $item->namaruangan,
                    'namalengkap' => $item->namalengkap,
                ];
            }

        }
        $result = array(
            'data' => $result,
            'as' => 'hehe'
        );
        return $this->respond($result);
    }
    public function getLaporanPengkajianAwalKeperawatanKebidananRI(Request $request) {
        ini_set('max_execution_time', 500); 
        $dataPengunjung = \DB::table('pasiendaftar_t as pd')
            ->join('antrianpasiendiperiksa_t as apd', 'apd.noregistrasifk', '=', 'pd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->leftJoin('ruangan_m as ru2', 'ru2.id', '=', 'apd.objectruanganasalfk')
            ->select('pd.noregistrasi', 'pd.norec as norec_pd', 'pd.objectruanganlastfk', 'apd.norec as norec_apd', 'apd.objectruanganasalfk', 'apd.objectruanganfk', 'ru.namaruangan',
            'ru2.namaruangan as namaruanganasal')
            ->where('apd.statusenabled', true)
            ->whereIn('ru.objectdepartemenfk', [16])
            ->where('pd.statusenabled', true);

        if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('apd.tglregistrasi', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('apd.tglregistrasi', '<=', $request['tglAkhir']);
        }
        if (isset($request['StatusPasien']) && $request['StatusPasien'] != '' && $request['StatusPasien'] != 'undefined') {
            if ($request['StatusPasien'] == 'BARU') {
                $dataPengunjung = $dataPengunjung->where('pd.statuspasien', 'Baru');
            } else {
                $dataPengunjung = $dataPengunjung->whereIn('pd.statuspasien', ['Lama', '']);
            }
        }
        $dataPengunjung = $dataPengunjung->orderBy('ru.id', 'asc');
        $dataPengunjung = $dataPengunjung->get();
        $data10 = [];
        $sama = false;
        $jmlPasien = 0;
        $jmlKunj = 0;
        foreach($dataPengunjung as $item) {
            $sama = false;
            $i = 0;
            foreach ($data10 as $he) {
                if ($item->namaruangan == $data10[$i]['namaruangan']) {
                    $sama = true;
                    if ($item->objectruanganasalfk == null) {
                        $jmlPasien = (float)$he['jmlPasien'] + 1;
                        $jmlKunj = (float)$he['jmlKunj'] + 1;
                        $data10[$i]['jmlPasien'] = $jmlPasien;
                        $data10[$i]['jmlKunj'] = $jmlKunj;
                    } else {
                        $jmlKunj = (float)$he['jmlKunj'] + 1;
                        $data10[$i]['jmlKunj'] = $jmlKunj;
                    }
                }
                $i = $i + 1;
            }
            if ($sama == false) {
                $jmlPasien = 0;
                $jmlKunj = 0;
                if ($item->objectruanganasalfk == null) {
                    $jmlPasien = 1;
                    $jmlKunj = 1;
                } else {
                    $jmlKunj = 1;
                }
                $data10[] = array (
                    'namaruangan' => $item->namaruangan,
                    'jmlPasien' => $jmlPasien,
                    'jmlKunj' => $jmlKunj
                );
            }
        }

        $detail = \DB::table('emrpasien_t as ep')
            ->join('antrianpasiendiperiksa_t as apd', 'ep.norec_apd', '=', 'apd.norec')
            ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
            ->select('ru.namaruangan', 'ep.noemr', 'ep.noregistrasifk')
            ->where('ru.objectdepartemenfk', 16)
            ->where('ep.emrfk', 915);
            if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
                $detail = $detail->where('apd.tglregistrasi', '>=', $request['tglAwal']);
            }
            if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
                $detail = $detail->where('apd.tglregistrasi', '<=', $request['tglAkhir']);
            }

        $detail2 = \DB::table('emrpasien_t as ep')
        ->join('antrianpasiendiperiksa_t as apd', 'ep.norec_apd', '=', 'apd.norec')
        ->join('ruangan_m as ru', 'ru.id', '=', 'apd.objectruanganfk')
        ->select('ru.namaruangan', 'ep.noemr', 'ep.noregistrasifk')
        ->where('ru.objectdepartemenfk', 16)
        ->where('ep.emrfk', 915);
        if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
            $detail2 = $detail2->where('apd.tglregistrasi', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
            $detail2 = $detail2->where('apd.tglregistrasi', '<=', $request['tglAkhir']);
        }
        $detail = $detail->union($detail2)->get();
            // $detail = $detail->groupBy('ru.namaruangan', 'ep.noemr', 'ru.id');
            // $detail = $detail->orderBy('ru.id', 'asc');
            // $detail = $detail->get();
            $uniqueData = [];
            foreach ($detail as $data) {
                if (!isset($uniqueData[$data->noregistrasifk])) {
                    $uniqueData[$data->noregistrasifk] = $data;
                }
            }
            $detail = $uniqueData;
            $data11 = [];
            $sama = false;
            $jmlPerawat = 0;
            foreach($detail as $item) {
                $sama = false;
                $i = 0;
                foreach ($data11 as $he) {
                    if ($item->namaruangan == $data11[$i]['namaruangan']) {
                        $sama = true;
                        $jmlPerawat = (float)$he['jmlPerawat'] + 1;
                        $data11[$i]['jmlPerawat'] = $jmlPerawat;
                    }
                    $i = $i + 1;
                }
                if ($sama == false) {
                    $jmlPerawat = 1;
                    $data11[] = array (
                        'namaruangan' => $item->namaruangan,
                        'jmlPerawat' => $jmlPerawat,
                    );
                }
            }
        $ruanganInap = \DB::table('ruangan_m')
            ->select('id', 'namaruangan')
            ->where('statusenabled', true)
            ->where('objectdepartemenfk', 16)
            ->whereNotIn('id', [821])
            ->get();
        $result = array (
            'data10' => $data10,
            'data11' => $data11,
            'ruangan' => $ruanganInap,
            'as' => 'epic'
        );
        return $this->respond($result);
    }
    public function getLaporanPemeriksaaanPsikologi(Request $request)
    {
        ini_set('max_execution_time', 500);
        $dataPengunjung = \DB::table('pasiendaftar_t as pd')
        ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
        ->select(
            'pd.noregistrasi',
            'pd.norec as norec_pd',
            'pd.objectruanganlastfk',
            'ru.namaruangan'
        )
            ->whereIn('ru.id', [1077, 70])
            ->whereNotNull('pd.tglpulang')
            ->where('pd.statusenabled', true);

        if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('pd.tglpulang', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('pd.tglpulang', '<=', $request['tglAkhir']);
        }
        if (isset($request['StatusPasien']) && $request['StatusPasien'] != '' && $request['StatusPasien'] != 'undefined') {
            if ($request['StatusPasien'] == 'BARU') {
                $dataPengunjung = $dataPengunjung->where('pd.statuspasien', 'Baru');
            } else {
                $dataPengunjung = $dataPengunjung->whereIn('pd.statuspasien', ['Lama', '']);
            }
        }
        if (isset($request['dokterfk']) && $request['dokterfk'] != '' && $request['dokterfk'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('pd.objectpegawaifk',   $request['dokterfk']);
        }
        $dataPengunjung = $dataPengunjung->orderBy('ru.id', 'asc');
        $dataPengunjung = $dataPengunjung->get();
        $data10 = [];
        $sama = false;
        $jmlPasien = 0;
        $jmlKunj = 0;
        foreach ($dataPengunjung as $item) {
            $sama = false;
            $i = 0;
            foreach ($data10 as $he) {
                if ($item->namaruangan == $data10[$i]['namaruangan']) {
                    $sama = true;
                        $jmlKunj = (float)$he['jmlKunj'] + 1;
                        $data10[$i]['jmlKunj'] = $jmlKunj;
                }
                $i = $i + 1;
            }
            if ($sama == false) {
                $jmlPasien = 0;
                $jmlKunj = 0;
                    $jmlKunj = 1;
                $data10[] = array(
                    'namaruangan' => $item->namaruangan,
                    'jmlKunj' => $jmlKunj
                );
            }
        }

        $detail = null;
        if (isset($request['tglAwal']) && strtotime($request['tglAwal']) <= strtotime('2023-12-31 23:59')) {
            $detail =  \DB::table('pasiendaftar_t as pd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('emrpasien_t as ep', 'ep.noregistrasifk', '=', 'pd.noregistrasi')
            ->select(
                'pd.noregistrasi',
                'pd.norec as norec_pd',
                'pd.objectruanganlastfk',
                'ru.namaruangan'
            )
                ->whereIn('ru.id', [1077, 70])
                ->whereNotNull('pd.tglpulang')
                ->where('ep.jenisemr', '=', 'pemeriksaanpsikologis')
                ->where('pd.statusenabled', true);
        }else{
            $detail =  \DB::table('pasiendaftar_t as pd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('emrpasien_t as ep', 'ep.noregistrasifk', '=', 'pd.noregistrasi')
            ->select(
                'pd.noregistrasi',
                'pd.norec as norec_pd',
                'pd.objectruanganlastfk',
                'ru.namaruangan'
            )
            ->whereIn('ru.id', [1077, 70])
                ->whereNotNull('pd.tglpulang')
                ->where('ep.jenisemr', '=', 'pemeriksaanpsikologis')
                ->where('pd.statusenabled', true);
        }
        if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
            $detail = $detail->where('pd.tglpulang', '>=', $request['tglAwal']);
        }    
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
            $detail = $detail->where('pd.tglpulang', '<=', $request['tglAkhir']);
        }    
        if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
            if($request['namaruangan'] == "PICU DAN HCU ANAK") {
                $detail = $detail->where('ru.namaexternal', $request['namaruangan']);
            } else {
                $detail = $detail->where('ru.namaruangan', '=', $request['namaruangan']);
            }
        }
        if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
            $detail = $detail->where('pd.objectpegawaifk', '=', $request['dokterfk']);
        } 
        // $data = $data->distinct();
        $detail = $detail->get();

        $detail = array_map("unserialize", array_unique(array_map("serialize", $detail)));

        $data11 = [];
        $sama = false;
        $jmlPerawat = 0;
        foreach ($detail as $item) {
            $sama = false;
            $i = 0;
            foreach ($data11 as $he) {
                if ($item->namaruangan == $data11[$i]['namaruangan']) {
                    $sama = true;
                        $jmlPerawat = (float)$he['jmlPerawat'] + 1;
                        $data11[$i]['jmlPerawat'] = $jmlPerawat;
                }
                $i = $i + 1;
            }
            if ($sama == false) {
                $jmlPerawat = 1;
                $data11[] = array (
                    'namaruangan' => $item->namaruangan,
                    'jmlPerawat' => $jmlPerawat,
                );
            }
        }
    $ruangan = \DB::table('ruangan_m')
        ->select('id', 'namaruangan')
        ->where('statusenabled', true)
        ->whereIn('id', [1077, 70])
        ->get();
    $result = array (
        'data10' => $data10,
        'data11' => $data11,
        'ruangan' => $ruangan,
        'as' => 'epic'
    );
        return $this->respond($result);
    }
    public function getLaporanPemeriksaaanPsikogram(Request $request)
    {
        ini_set('max_execution_time', 500);
        $dataPengunjung = \DB::table('pasiendaftar_t as pd')
        ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
        ->select(
            'pd.noregistrasi',
            'pd.norec as norec_pd',
            'pd.objectruanganlastfk',
            'ru.namaruangan'
        )
            ->whereIn('ru.id', [1077, 70])
            ->whereNotNull('pd.tglpulang')
            ->where('pd.statusenabled', true);

        if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('pd.tglpulang', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('pd.tglpulang', '<=', $request['tglAkhir']);
        }
        if (isset($request['StatusPasien']) && $request['StatusPasien'] != '' && $request['StatusPasien'] != 'undefined') {
            if ($request['StatusPasien'] == 'BARU') {
                $dataPengunjung = $dataPengunjung->where('pd.statuspasien', 'Baru');
            } else {
                $dataPengunjung = $dataPengunjung->whereIn('pd.statuspasien', ['Lama', '']);
            }
        }
        if (isset($request['dokterfk']) && $request['dokterfk'] != '' && $request['dokterfk'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('pd.objectpegawaifk',   $request['dokterfk']);
        }
        $dataPengunjung = $dataPengunjung->orderBy('ru.id', 'asc');
        $dataPengunjung = $dataPengunjung->get();
        $data10 = [];
        $sama = false;
        $jmlPasien = 0;
        $jmlKunj = 0;
        foreach ($dataPengunjung as $item) {
            $sama = false;
            $i = 0;
            foreach ($data10 as $he) {
                if ($item->namaruangan == $data10[$i]['namaruangan']) {
                    $sama = true;
                        $jmlKunj = (float)$he['jmlKunj'] + 1;
                        $data10[$i]['jmlKunj'] = $jmlKunj;
                }
                $i = $i + 1;
            }
            if ($sama == false) {
                $jmlPasien = 0;
                $jmlKunj = 0;
                    $jmlKunj = 1;
                $data10[] = array(
                    'namaruangan' => $item->namaruangan,
                    'jmlKunj' => $jmlKunj
                );
            }
        }

        $detail = null;
        if (isset($request['tglAwal']) && strtotime($request['tglAwal']) <= strtotime('2023-12-31 23:59')) {
            $detail =  \DB::table('pasiendaftar_t as pd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('emrpasien_t as ep', 'ep.noregistrasifk', '=', 'pd.noregistrasi')
            ->select(
                'pd.noregistrasi',
                'pd.norec as norec_pd',
                'pd.objectruanganlastfk',
                'ru.namaruangan'
            )
                ->whereIn('ru.id', [1077, 70])
                ->whereNotNull('pd.tglpulang')
                ->where('ep.jenisemr', '=', 'pemeriksaanpsikogram')
                ->where('pd.statusenabled', true);
        }else{
            $detail =  \DB::table('pasiendaftar_t as pd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('emrpasien_t as ep', 'ep.noregistrasifk', '=', 'pd.noregistrasi')
            ->select(
                'pd.noregistrasi',
                'pd.norec as norec_pd',
                'pd.objectruanganlastfk',
                'ru.namaruangan'
            )
            ->whereIn('ru.id', [1077, 70])
                ->whereNotNull('pd.tglpulang')
                ->where('ep.jenisemr', '=', 'pemeriksaanpsikogram')
                ->where('pd.statusenabled', true);
        }
        if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
            $detail = $detail->where('pd.tglpulang', '>=', $request['tglAwal']);
        }    
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
            $detail = $detail->where('pd.tglpulang', '<=', $request['tglAkhir']);
        }    
        if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
            if($request['namaruangan'] == "PICU DAN HCU ANAK") {
                $detail = $detail->where('ru.namaexternal', $request['namaruangan']);
            } else {
                $detail = $detail->where('ru.namaruangan', '=', $request['namaruangan']);
            }
        }
        if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
            $detail = $detail->where('pd.objectpegawaifk', '=', $request['dokterfk']);
        } 
        // $data = $data->distinct();
        $detail = $detail->get();

        $detail = array_map("unserialize", array_unique(array_map("serialize", $detail)));

        $data11 = [];
        $sama = false;
        $jmlPerawat = 0;
        foreach ($detail as $item) {
            $sama = false;
            $i = 0;
            foreach ($data11 as $he) {
                if ($item->namaruangan == $data11[$i]['namaruangan']) {
                    $sama = true;
                        $jmlPerawat = (float)$he['jmlPerawat'] + 1;
                        $data11[$i]['jmlPerawat'] = $jmlPerawat;
                }
                $i = $i + 1;
            }
            if ($sama == false) {
                $jmlPerawat = 1;
                $data11[] = array (
                    'namaruangan' => $item->namaruangan,
                    'jmlPerawat' => $jmlPerawat,
                );
            }
        }
    $ruangan = \DB::table('ruangan_m')
        ->select('id', 'namaruangan')
        ->where('statusenabled', true)
        ->whereIn('id', [1077, 70])
        ->get();
    $result = array (
        'data10' => $data10,
        'data11' => $data11,
        'ruangan' => $ruangan,
        'as' => 'epic'
    );
        return $this->respond($result);
    }
    public function getLaporanAssesmentFisioterapi(Request $request)
    {
        ini_set('max_execution_time', 500);
        $dataPengunjung = \DB::table('pasiendaftar_t as pd')
        ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
        ->select(
            'pd.noregistrasi',
            'pd.norec as norec_pd',
            'pd.objectruanganlastfk',
            'ru.namaruangan'
        )
            ->whereIn('ru.id', [20])
            ->whereNotNull('pd.tglpulang')
            ->where('pd.statusenabled', true);

        if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('pd.tglpulang', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('pd.tglpulang', '<=', $request['tglAkhir']);
        }
        if (isset($request['StatusPasien']) && $request['StatusPasien'] != '' && $request['StatusPasien'] != 'undefined') {
            if ($request['StatusPasien'] == 'BARU') {
                $dataPengunjung = $dataPengunjung->where('pd.statuspasien', 'Baru');
            } else {
                $dataPengunjung = $dataPengunjung->whereIn('pd.statuspasien', ['Lama', '']);
            }
        }
        if (isset($request['dokterfk']) && $request['dokterfk'] != '' && $request['dokterfk'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('pd.objectpegawaifk',   $request['dokterfk']);
        }
        $dataPengunjung = $dataPengunjung->orderBy('ru.id', 'asc');
        $dataPengunjung = $dataPengunjung->get();
        $data10 = [];
        $sama = false;
        $jmlPasien = 0;
        $jmlKunj = 0;
        foreach ($dataPengunjung as $item) {
            $sama = false;
            $i = 0;
            foreach ($data10 as $he) {
                if ($item->namaruangan == $data10[$i]['namaruangan']) {
                    $sama = true;
                        $jmlKunj = (float)$he['jmlKunj'] + 1;
                        $data10[$i]['jmlKunj'] = $jmlKunj;
                }
                $i = $i + 1;
            }
            if ($sama == false) {
                $jmlPasien = 0;
                $jmlKunj = 0;
                    $jmlKunj = 1;
                $data10[] = array(
                    'namaruangan' => $item->namaruangan,
                    'jmlKunj' => $jmlKunj
                );
            }
        }

        $detail = null;
        if (isset($request['tglAwal']) && strtotime($request['tglAwal']) <= strtotime('2023-12-31 23:59')) {
            $detail =  \DB::table('pasiendaftar_t as pd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('emrpasien_t as ep', 'ep.noregistrasifk', '=', 'pd.noregistrasi')
            ->select(
                'pd.noregistrasi',
                'pd.norec as norec_pd',
                'pd.objectruanganlastfk',
                'ru.namaruangan'
            )
                ->whereIn('ru.id', [20])
                ->whereNotNull('pd.tglpulang')
                ->where('ep.jenisemr', '=', 'assesmentfisioterapi')
                ->where('pd.statusenabled', true);
        }else{
            $detail =  \DB::table('pasiendaftar_t as pd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('emrpasien_t as ep', 'ep.noregistrasifk', '=', 'pd.noregistrasi')
            ->select(
                'pd.noregistrasi',
                'pd.norec as norec_pd',
                'pd.objectruanganlastfk',
                'ru.namaruangan'
            )
            ->whereIn('ru.id', [20])
                ->whereNotNull('pd.tglpulang')
                ->where('ep.jenisemr', '=', 'assesmentfisioterapi')
                ->where('pd.statusenabled', true);
        }
        if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
            $detail = $detail->where('pd.tglpulang', '>=', $request['tglAwal']);
        }    
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
            $detail = $detail->where('pd.tglpulang', '<=', $request['tglAkhir']);
        }    
        if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
            if($request['namaruangan'] == "PICU DAN HCU ANAK") {
                $detail = $detail->where('ru.namaexternal', $request['namaruangan']);
            } else {
                $detail = $detail->where('ru.namaruangan', '=', $request['namaruangan']);
            }
        }
        if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
            $detail = $detail->where('pd.objectpegawaifk', '=', $request['dokterfk']);
        } 
        // $data = $data->distinct();
        $detail = $detail->get();

        $detail = array_map("unserialize", array_unique(array_map("serialize", $detail)));

        $data11 = [];
        $sama = false;
        $jmlPerawat = 0;
        foreach ($detail as $item) {
            $sama = false;
            $i = 0;
            foreach ($data11 as $he) {
                if ($item->namaruangan == $data11[$i]['namaruangan']) {
                    $sama = true;
                        $jmlPerawat = (float)$he['jmlPerawat'] + 1;
                        $data11[$i]['jmlPerawat'] = $jmlPerawat;
                }
                $i = $i + 1;
            }
            if ($sama == false) {
                $jmlPerawat = 1;
                $data11[] = array (
                    'namaruangan' => $item->namaruangan,
                    'jmlPerawat' => $jmlPerawat,
                );
            }
        }
    $ruangan = \DB::table('ruangan_m')
        ->select('id', 'namaruangan')
        ->where('statusenabled', true)
        ->whereIn('id', [20])
        ->get();
    $result = array (
        'data10' => $data10,
        'data11' => $data11,
        'ruangan' => $ruangan,
        'as' => 'epic'
    );
        return $this->respond($result);
    }
        
    public function getDetailPsikologAndFisio(Request $request)
    {
        if ($request['setParam'] == 1) {
            $data = \DB::table('pasiendaftar_t as pd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->select('ps.nocm', 'pd.noregistrasi', 'ps.namapasien', 'ru.namaruangan', 'pg.namalengkap')
            ->where('pd.statusenabled', true)
            ->whereNotNull('pd.tglpulang');
            
            if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
                $data = $data->where('pd.tglpulang', '>=', $request['tglAwal']);
            }    
            if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
                $data = $data->where('pd.tglpulang', '<=', $request['tglAkhir']);
            }    
            if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                if($request['namaruangan'] == "PICU DAN HCU ANAK") {
                    $data = $data->where('ru.namaexternal', $request['namaruangan']);
                } else {
                    $data = $data->where('ru.namaruangan', '=', $request['namaruangan']);
                }
            }
            if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
                $data = $data->where('pd.objectpegawaifk', '=', $request['dokterfk']);
            } 
            $data = $data->get();
            $result = $data;
    } else if ($request['setParam'] == 2) {

        $data = null;
        if (isset($request['tglAwal']) && strtotime($request['tglAwal']) <= strtotime('2023-12-31 23:59')) {
            $data =  \DB::table('pasiendaftar_t as pd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftJoin('emrpasien_t as ep', 'ep.noregistrasifk', '=', 'pd.noregistrasi')
            ->select('ps.nocm', 'pd.noregistrasi', 'ps.namapasien', 'ru.namaruangan', 'pg.namalengkap')
                ->whereNotNull('pd.tglpulang');
                
                if (isset($request['isPsikolog']) && $request['isPsikolog'] ==1 ) {
                    $data = $data->where('ep.jenisemr', '=', 'pemeriksaanpsikologis');
                    $data = $data->where('pd.statusenabled', true);
                    $data = $data->whereIn('ru.id', [1077, 70]);
                }
                if (isset($request['isPsikogram']) && $request['isPsikogram'] ==1 ) {
                    $data = $data->where('ep.jenisemr', '=', 'pemeriksaanpsikogram');
                    $data = $data->where('pd.statusenabled', true);
                    $data = $data->whereIn('ru.id', [1077, 70]);
                }
                if (isset($request['isFisio']) && $request['isFisio'] ==1 ) {
                    $data = $data->where('ep.jenisemr', '=', 'assesmentfisioterapi');
                    $data = $data->where('pd.statusenabled', true);
                    $data = $data->whereIn('ru.id', [20]);
                }
                if (isset($request['laporananestesi']) && $request['laporananestesi'] ==1 ) {
                    $data = $data->where('ep.jenisemr', '=', 'laporananestesi');
                    $data = $data->where('pd.statusenabled', true);
                    $data = $data->whereIn('ru.id', [31,
                    1018,
                    1075]);
                }
                if (isset($request['isFormuGizi']) && $request['isFormuGizi'] ==1 ) {
                    $data = $data->where('ep.jenisemr', '=', 'formulirasuhangizi');
                    $data = $data->where('pd.statusenabled', true);
                    $data = $data->whereIn('ru.id', [9, 1067, 1013]);
                }
                if (isset($request['isOlah']) && $request['isOlah'] ==1 ) {
                    $data = $data->where('ep.jenisemr', '=', 'formulirfisioterapi');
                    $data = $data->where('pd.statusenabled', true);
                    $data = $data->whereIn('ru.id', [1096, 1033 ,564]);
                }
                if (isset($request['isPengOl']) && $request['isPengOl'] ==1 ) {
                    $data = $data->where('ep.jenisemr', '=', 'pengkajianmedisolahraga');
                    $data = $data->where('pd.statusenabled', true);
                    $data = $data->whereIn('ru.id', [1096, 1033 ,564]);
                }
                if (isset($request['isFormuGizi2']) && $request['isFormuGizi2'] ==1 ) {
                    $data = $data->whereIn('ep.jenisemr', ['skrininggizianak', 'skrininggizidewasa']);
                    $data = $data->where('pd.statusenabled', true);
                    $data = $data->whereIn('ru.id', [9, 1067, 1013]);
                }
        }else{
            $data =  \DB::table('pasiendaftar_t as pd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftJoin('emrpasien_t as ep', 'ep.noregistrasifk', '=', 'pd.noregistrasi')
            ->select('ps.nocm', 'pd.noregistrasi', 'ps.namapasien', 'ru.namaruangan', 'pg.namalengkap')
                ->whereNotNull('pd.tglpulang')
                ->where('pd.statusenabled', true);
                if (isset($request['isPsikolog']) && $request['isPsikolog'] ==1 ) {
                    $data = $data->where('ep.jenisemr', '=', 'pemeriksaanpsikologis');
                    $data = $data->where('pd.statusenabled', true);
                    $data = $data->whereIn('ru.id', [1077, 70]);
                }
                if (isset($request['isPsikogram']) && $request['isPsikogram'] ==1 ) {
                    $data = $data->where('ep.jenisemr', '=', 'pemeriksaanpsikogram');
                    $data = $data->where('pd.statusenabled', true);
                    $data = $data->whereIn('ru.id', [1077, 70]);
                }
                if (isset($request['isFisio']) && $request['isFisio'] ==1 ) {
                    $data = $data->where('ep.jenisemr', '=', 'assesmentfisioterapi');
                    $data = $data->where('pd.statusenabled', true);
                    $data = $data->whereIn('ru.id', [20]);
                }
                if (isset($request['laporananestesi']) && $request['laporananestesi'] ==1 ) {
                    $data = $data->where('ep.jenisemr', '=', 'laporananestesi');
                    $data = $data->where('pd.statusenabled', true);
                    $data = $data->whereIn('ru.id', [31,
                    1018,
                    1075]);
                }
                if (isset($request['isFormuGizi']) && $request['isFormuGizi'] ==1 ) {
                    $data = $data->where('ep.jenisemr', '=', 'formulirasuhangizi');
                    $data = $data->where('pd.statusenabled', true);
                    $data = $data->whereIn('ru.id', [9, 1067, 1013]);
                }
                if (isset($request['isOlah']) && $request['isOlah'] ==1 ) {
                    $data = $data->where('ep.jenisemr', '=', 'formulirfisioterapi');
                    $data = $data->where('pd.statusenabled', true);
                    $data = $data->whereIn('ru.id', [1096, 1033 ,564]);
                }
                if (isset($request['isPengOl']) && $request['isPengOl'] ==1 ) {
                    $data = $data->where('ep.jenisemr', '=', 'pengkajianmedisolahraga');
                    $data = $data->where('pd.statusenabled', true);
                    $data = $data->whereIn('ru.id', [1096, 1033 ,564]);
                }
                if (isset($request['isFormuGizi2']) && $request['isFormuGizi2'] ==1 ) {
                    $data = $data->whereIn('ep.jenisemr', ['skrininggizianak', 'skrininggizidewasa']);
                    $data = $data->where('pd.statusenabled', true);
                    $data = $data->whereIn('ru.id', [9, 1067, 1013]);
                }
        }
        
            
            if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
                $data = $data->where('pd.tglpulang', '>=', $request['tglAwal']);
            }    
            if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
                $data = $data->where('pd.tglpulang', '<=', $request['tglAkhir']);
            }    
            if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                if($request['namaruangan'] == "PICU DAN HCU ANAK") {
                    $data = $data->where('ru.namaexternal', $request['namaruangan']);
                } else {
                    $data = $data->where('ru.namaruangan', '=', $request['namaruangan']);
                }
            }
            if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
                $data = $data->where('pd.objectpegawaifk', '=', $request['dokterfk']);
            } 
            // $data = $data->distinct();
            $data = $data->get();
            // $data = array_map("unserialize", array_unique(array_map("serialize", $data)));
            $serializedData = array_map('serialize', $data);
            $uniqueSerializedData = array_unique($serializedData);
            $uniqueData = array_map('unserialize', $uniqueSerializedData);

            $result = [];
            foreach ($uniqueData as $item) {
                $result[] = [
                    'nocm' => $item->nocm,
                    'noregistrasi' => $item->noregistrasi,
                    'namapasien' => $item->namapasien,
                    'namaruangan' => $item->namaruangan,
                    'namalengkap' => $item->namalengkap,
                ];
            }

            }else if ($request['setParam'] == 3){
                $dataPulang = \DB::table('pasiendaftar_t as pd')
                ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
                ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
                ->select('ps.nocm', 'pd.noregistrasi', 'ps.namapasien', 'ru.namaruangan', 'pg.namalengkap')
                ->where('pd.statusenabled', true)
                ->whereNotNull('pd.tglpulang');
                
                if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
                    $dataPulang = $dataPulang->where('pd.tglpulang', '>=', $request['tglAwal']);
                }    
                if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
                    $dataPulang = $dataPulang->where('pd.tglpulang', '<=', $request['tglAkhir']);
                }    
                if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                    if($request['namaruangan'] == "PICU DAN HCU ANAK") {
                        $dataPulang = $dataPulang->where('ru.namaexternal', $request['namaruangan']);
                    } else {
                        $dataPulang = $dataPulang->where('ru.namaruangan', '=', $request['namaruangan']);
                    }
                }
                if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
                    $dataPulang = $dataPulang->where('pd.objectpegawaifk', '=', $request['dokterfk']);
                } 
                // $data = $data->distinct();
                $dataPulang = $dataPulang->get();
            

                $data =  \DB::table('pasiendaftar_t as pd')
                ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
                ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
                ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                ->leftJoin('emrpasien_t as ep', 'ep.noregistrasifk', '=', 'pd.noregistrasi')
                ->select('ps.nocm', 'pd.noregistrasi', 'ps.namapasien', 'ru.namaruangan', 'pg.namalengkap')
                    ->whereNotNull('pd.tglpulang')
                    ->where('pd.statusenabled', true);
                    if (isset($request['isPsikolog']) && $request['isPsikolog'] ==1 ) {
                        $data = $data->where('ep.jenisemr', '=', 'pemeriksaanpsikologis');
                        $data = $data->whereIn('ru.id', [1077, 70]);
                    }
                    if (isset($request['isPsikogram']) && $request['isPsikogram'] ==1 ) {
                        $data = $data->where('ep.jenisemr', '=', 'pemeriksaanpsikogram');
                        $data = $data->whereIn('ru.id', [1077, 70]);
                    }
                    if (isset($request['isFisio']) && $request['isFisio'] ==1 ) {
                        $data = $data->where('ep.jenisemr', '=', 'assesmentfisioterapi');
                        $data = $data->whereIn('ru.id', [20]);
                    }
                    if (isset($request['laporananestesi']) && $request['laporananestesi'] ==1 ) {
                        $data = $data->where('ep.jenisemr', '=', 'laporananestesi');
                        $data = $data->whereIn('ru.id', [31,
                        1018,
                        1075]);
                    }
                    if (isset($request['isFormuGizi']) && $request['isFormuGizi'] ==1 ) {
                        $data = $data->where('ep.jenisemr', '=', 'formulirasuhangizi');
                        $data = $data->whereIn('ru.id', [9, 1067, 1013]);
                    }
                    if (isset($request['isOlah']) && $request['isOlah'] ==1 ) {
                        $data = $data->where('ep.jenisemr', '=', 'formulirfisioterapi');
                        $data = $data->whereIn('ru.id', [1096, 1033 ,564]);
                    }
                    if (isset($request['isPengOl']) && $request['isPengOl'] ==1 ) {
                        $data = $data->where('ep.jenisemr', '=', 'pengkajianmedisolahraga');
                        $data = $data->whereIn('ru.id', [1096, 1033 ,564]);
                    }
                    if (isset($request['isFormuGizi2']) && $request['isFormuGizi2'] ==1 ) {
                        $data = $data->whereIn('ep.jenisemr', ['skrininggizianak', 'skrininggizidewasa']);
                        $data = $data->whereIn('ru.id', [9, 1067, 1013]);
                    }
                
                if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
                    $data = $data->where('pd.tglpulang', '>=', $request['tglAwal']);
                }    
                if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
                    $data = $data->where('pd.tglpulang', '<=', $request['tglAkhir']);
                }    
                if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                    if($request['namaruangan'] == "PICU DAN HCU ANAK") {
                        $data = $data->where('ru.namaexternal', $request['namaruangan']);
                    } else {
                        $data = $data->where('ru.namaruangan', '=', $request['namaruangan']);
                    }
                }
                if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
                    $data = $data->where('pd.objectpegawaifk', '=', $request['dokterfk']);
                } 
                // $data = $data->distinct();
                $data = $data->distinct()->get();
                // $result = $data;
                $temp = [];
                
                foreach ($dataPulang as $item){
                    $found = false;
                    foreach ($data as $item2){
                        if (($item->noregistrasi == $item2->noregistrasi) && ($item->namaruangan == $item2->namaruangan) ){
                            $found = true;
                        }
                    }
                    if ($found==false) {
                        $temp [] = $item;
                    }
                }
                $result = $temp;
            }
        $result = array(
            'data' => $result,
            'as' => 'hehe'
        );
        return $this->respond($result);
    }
    public function getLaporanSudahIsiPengkajianMedisDetail(Request $request)
    {
        if ($request['setParam'] == 1) {
            $data = \DB::table('pasiendaftar_t as pd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->select('ps.nocm', 'pd.noregistrasi', 'ps.namapasien', 'ru.namaruangan', 'pg.namalengkap')
            ->where('pd.statusenabled', true)
            ->whereNotNull('pd.tglpulang');
            
            if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
                $data = $data->where('pd.tglpulang', '>=', $request['tglAwal']);
            }    
            if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
                $data = $data->where('pd.tglpulang', '<=', $request['tglAkhir']);
            }    
            if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                if($request['namaruangan'] == "PICU DAN HCU ANAK") {
                    $data = $data->where('ru.namaexternal', $request['namaruangan']);
                } else {
                    $data = $data->where('ru.namaruangan', '=', $request['namaruangan']);
                }
            }
            if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
                $data = $data->where('pd.objectpegawaifk', '=', $request['dokterfk']);
            } 
            if ($request['StatusPasien'] == 'BARU') {
                $data = $data->where('pd.statuspasien', '=', 'Baru');
            } else if ($request['StatusPasien'] == 'LAMA') {
                $data = $data->whereIn('pd.statuspasien', ['LAMA', '']);
                // $status = " AND (pd.statuspasien IN ('LAMA', '')) ";
            }
            $data = $data->get();
            $result = $data;
    } else if ($request['setParam'] == 2) {
        $data = null;
        if (isset($request['tglAwal']) && strtotime($request['tglAwal']) <= strtotime('2023-12-31 23:59')) {
            $data =  \DB::table('emrpasien_t as ep')
            ->leftJoin('pasiendaftar_t as pd', 'pd.noregistrasi', '=', 'ep.noregistrasifk')
            ->join('ruangan_m as ru', 'ru.namaruangan', '=', 'ep.namaruangan')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->select('ep.nocm', 'pd.noregistrasi', 'ep.namapasien', 'ru.namaruangan', 'pg.namalengkap')
                ->wherein('ep.jenisemr', ['asesmen', 'pengkajianawalmata','pengkajianawaljiwa','Poli Endokrin','Poli Penyakit Dalam', 'laporananestesi', 'pengkajianawalkebidanan']) 
                ->where('pd.statusenabled', true);
        }else{
            $data =  \DB::table('emrpasien_t as ep')
            ->leftJoin('pasiendaftar_t as pd', 'pd.noregistrasi', '=', 'ep.noregistrasifk')
            ->join('ruangan_m as ru', 'ru.namaruangan', '=', 'ep.namaruangan')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->select('ep.nocm', 'pd.noregistrasi', 'ep.namapasien', 'ru.namaruangan', 'pg.namalengkap')
                ->wherein('ep.jenisemr', ['asesmen', 'pengkajianawalmata','pengkajianawaljiwa','Poli Endokrin','Poli Penyakit Dalam', 'laporananestesi', 'pengkajianawalkebidanan']) 
                ->where('pd.statusenabled', true);
        }
       
            if ($request['StatusPasien'] == 'BARU') {
                $data = $data->where('pd.statuspasien', '=', 'Baru');
            } else if ($request['StatusPasien'] == 'LAMA') {
                $data = $data->whereIn('pd.statuspasien', ['LAMA', '']);
                // $status = " AND (pd.statuspasien IN ('LAMA', '')) ";
            }
            if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
                $data = $data->where('ep.tglemr', '>=', $request['tglAwal']);
            }    
            if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
                $data = $data->where('ep.tglemr', '<=', $request['tglAkhir']);
            }    
            if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                if($request['namaruangan'] == "PICU DAN HCU ANAK") {
                    $data = $data->where('ru.namaexternal', $request['namaruangan']);
                } else {
                    $data = $data->where('ru.namaruangan', '=', $request['namaruangan']);
                }
            }
            if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
                $data = $data->where('pd.objectpegawaifk', '=', $request['dokterfk']);
            } 
            // $data = $data->distinct();
            $data = $data->get();
            // $data = array_map("unserialize", array_unique(array_map("serialize", $data)));
            $serializedData = array_map('serialize', $data);
            $uniqueSerializedData = array_unique($serializedData);
            $uniqueData = array_map('unserialize', $uniqueSerializedData);

            $result = [];
            foreach ($uniqueData as $item) {
                $result[] = [
                    'nocm' => $item->nocm,
                    'noregistrasi' => $item->noregistrasi,
                    'namapasien' => $item->namapasien,
                    'namaruangan' => $item->namaruangan,
                    'namalengkap' => $item->namalengkap,
                ];
            }

            }else if ($request['setParam'] == 3){
                $dataPulang = \DB::table('pasiendaftar_t as pd')
                ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
                ->join('pasien_m as ps', 'ps.id', '=', 'pd.nocmfk')
                ->leftjoin('rekanan_m as rk', 'rk.id', '=', 'pd.objectrekananfk')
                ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
                ->select('ps.nocm', 'pd.noregistrasi', 'ps.namapasien', 'ru.namaruangan', 'pg.namalengkap','pd.tglregistrasi', 'rk.namarekanan')
                ->where('pd.statusenabled', true)
                ->whereNotNull('pd.tglpulang');
                
                if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
                    $dataPulang = $dataPulang->where('pd.tglpulang', '>=', $request['tglAwal']);
                }    
                if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
                    $dataPulang = $dataPulang->where('pd.tglpulang', '<=', $request['tglAkhir']);
                }    
                if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                    if($request['namaruangan'] == "PICU DAN HCU ANAK") {
                        $dataPulang = $dataPulang->where('ru.namaexternal', $request['namaruangan']);
                    } else {
                        $dataPulang = $dataPulang->where('ru.namaruangan', '=', $request['namaruangan']);
                    }
                }
                if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
                    $dataPulang = $dataPulang->where('pd.objectpegawaifk', '=', $request['dokterfk']);
                } 
                // $data = $data->distinct();
                if ($request['StatusPasien'] == 'BARU') {
                    $dataPulang = $dataPulang->where('pd.statuspasien', '=', 'Baru');
                } else if ($request['StatusPasien'] == 'LAMA') {
                    $dataPulang = $dataPulang->whereIn('pd.statuspasien', ['LAMA', '']);
                    // $status = " AND (pd.statuspasien IN ('LAMA', '')) ";
                }
                $dataPulang = $dataPulang->get();
           

                $data =  \DB::table('emrpasien_t as ep')
                ->leftJoin('pasiendaftar_t as pd', 'pd.noregistrasi', '=', 'ep.noregistrasifk')
                ->join('ruangan_m as ru', 'ru.namaruangan', '=', 'ep.namaruangan')
                ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
                ->select('ep.nocm', 'pd.noregistrasi', 'ep.namapasien', 'ru.namaruangan', 'pg.namalengkap')
                    ->wherein('ep.jenisemr', ['asesmen', 'pengkajianawalmata','pengkajianawaljiwa','Poli Endokrin','Poli Penyakit Dalam', 'laporananestesi', 'pengkajianawalkebidanan']) 
                    ->where('pd.statusenabled', true);
                
                    if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
                        $data = $data->where('ep.tglemr', '>=', $request['tglAwal']);
                    }    
                    if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
                        $data = $data->where('ep.tglemr', '<=', $request['tglAkhir']);
                    }    
                    if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
                        if($request['namaruangan'] == "PICU DAN HCU ANAK") {
                            $data = $data->where('ru.namaexternal', $request['namaruangan']);
                        } else {
                            $data = $data->where('ru.namaruangan', '=', $request['namaruangan']);
                        }
                    }
                    if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
                        $data = $data->where('pd.objectpegawaifk', '=', $request['dokterfk']);
                    } 
                    if ($request['StatusPasien'] == 'BARU') {
                        $data = $data->where('pd.statuspasien', '=', 'Baru');
                    } else if ($request['StatusPasien'] == 'LAMA') {
                        $data = $data->whereIn('pd.statuspasien', ['LAMA', '']);
                        // $status = " AND (pd.statuspasien IN ('LAMA', '')) ";
                    }
                // $data = $data->distinct();
                $data = $data->distinct()->get();
                // $result = $data;
                $temp = [];
                // foreach ($dataPengunjungCppt as $cppt) {
                //     if (($item->noregistrasi == $cppt->noregistrasi)  && ($item->namaruangan == $cppt->namaruangan)) {
                  
                //         $found = true;
                //         // break;
                //     }
                // }
                // if ($found==false) {
                //     $jmlBelumIsi = (float)$he['jmlBelumIsi'] + 1;
                //     $data10[$i]['jmlBelumIsi'] = $jmlBelumIsi;
                //     // break;
                // }

                foreach ($dataPulang as $item){
                    $found = false;
                    foreach ($data as $item2){
                        if (($item->noregistrasi == $item2->noregistrasi) && ($item->namaruangan == $item2->namaruangan) ){
                            $found = true;
                        }
                    }
                    if ($found==false) {
                        $temp [] = $item;
                    }
                }
                $result = $temp;
            }
        $result = array(
            'data' => $result,
            'as' => 'hehe'
        );
        return $this->respond($result);
    }
    public function getLaporanAssesmentAnestesi(Request $request)
    {
        ini_set('max_execution_time', 500);
        $dataPengunjung = \DB::table('pasiendaftar_t as pd')
        ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
        ->select(
            'pd.noregistrasi',
            'pd.norec as norec_pd',
            'pd.objectruanganlastfk',
            'ru.namaruangan'
        )
            ->whereIn('ru.id', [31,
            1018,
            1075])
            ->whereNotNull('pd.tglpulang')
            ->where('pd.statusenabled', true);

        if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('pd.tglpulang', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('pd.tglpulang', '<=', $request['tglAkhir']);
        }
        if (isset($request['StatusPasien']) && $request['StatusPasien'] != '' && $request['StatusPasien'] != 'undefined') {
            if ($request['StatusPasien'] == 'BARU') {
                $dataPengunjung = $dataPengunjung->where('pd.statuspasien', 'Baru');
            } else {
                $dataPengunjung = $dataPengunjung->whereIn('pd.statuspasien', ['Lama', '']);
            }
        }
        if (isset($request['dokterfk']) && $request['dokterfk'] != '' && $request['dokterfk'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('pd.objectpegawaifk',   $request['dokterfk']);
        }
        $dataPengunjung = $dataPengunjung->orderBy('ru.id', 'asc');
        $dataPengunjung = $dataPengunjung->get();
        $data10 = [];
        $sama = false;
        $jmlPasien = 0;
        $jmlKunj = 0;
        foreach ($dataPengunjung as $item) {
            $sama = false;
            $i = 0;
            foreach ($data10 as $he) {
                if ($item->namaruangan == $data10[$i]['namaruangan']) {
                    $sama = true;
                        $jmlKunj = (float)$he['jmlKunj'] + 1;
                        $data10[$i]['jmlKunj'] = $jmlKunj;
                }
                $i = $i + 1;
            }
            if ($sama == false) {
                $jmlPasien = 0;
                $jmlKunj = 0;
                    $jmlKunj = 1;
                $data10[] = array(
                    'namaruangan' => $item->namaruangan,
                    'jmlKunj' => $jmlKunj
                );
            }
        }

        $detail = null;
        if (isset($request['tglAwal']) && strtotime($request['tglAwal']) <= strtotime('2023-12-31 23:59')) {
            $detail =  \DB::table('pasiendaftar_t as pd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('emrpasien_t as ep', 'ep.noregistrasifk', '=', 'pd.noregistrasi')
            ->select(
                'pd.noregistrasi',
                'pd.norec as norec_pd',
                'pd.objectruanganlastfk',
                'ru.namaruangan'
            )
                ->whereIn('ru.id', [31,
                1018,
                1075])
                ->whereNotNull('pd.tglpulang')
                ->where('ep.jenisemr', '=', 'laporananestesi')
                ->where('pd.statusenabled', true);
        }else{
            $detail =  \DB::table('pasiendaftar_t as pd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('emrpasien_t as ep', 'ep.noregistrasifk', '=', 'pd.noregistrasi')
            ->select(
                'pd.noregistrasi',
                'pd.norec as norec_pd',
                'pd.objectruanganlastfk',
                'ru.namaruangan'
            )
            ->whereIn('ru.id', [31,
            1018,
            1075])
                ->whereNotNull('pd.tglpulang')
                ->where('ep.jenisemr', '=', 'laporananestesi')
                ->where('pd.statusenabled', true);
        }
        if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
            $detail = $detail->where('pd.tglpulang', '>=', $request['tglAwal']);
        }    
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
            $detail = $detail->where('pd.tglpulang', '<=', $request['tglAkhir']);
        }    
        if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
            if($request['namaruangan'] == "PICU DAN HCU ANAK") {
                $detail = $detail->where('ru.namaexternal', $request['namaruangan']);
            } else {
                $detail = $detail->where('ru.namaruangan', '=', $request['namaruangan']);
            }
        }
        if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
            $detail = $detail->where('pd.objectpegawaifk', '=', $request['dokterfk']);
        } 
        // $data = $data->distinct();
        $detail = $detail->get();

        $detail = array_map("unserialize", array_unique(array_map("serialize", $detail)));

        $data11 = [];
        $sama = false;
        $jmlPerawat = 0;
        foreach ($detail as $item) {
            $sama = false;
            $i = 0;
            foreach ($data11 as $he) {
                if ($item->namaruangan == $data11[$i]['namaruangan']) {
                    $sama = true;
                        $jmlPerawat = (float)$he['jmlPerawat'] + 1;
                        $data11[$i]['jmlPerawat'] = $jmlPerawat;
                }
                $i = $i + 1;
            }
            if ($sama == false) {
                $jmlPerawat = 1;
                $data11[] = array (
                    'namaruangan' => $item->namaruangan,
                    'jmlPerawat' => $jmlPerawat,
                );
            }
        }
    $ruangan = \DB::table('ruangan_m')
        ->select('id', 'namaruangan')
        ->where('statusenabled', true)
        ->whereIn('id', [31,
        1018,
        1075])
        ->get();
    $result = array (
        'data10' => $data10,
        'data11' => $data11,
        'ruangan' => $ruangan,
        'as' => 'epic'
    );
        return $this->respond($result);
    }
    public function getLaporanFisioOlahraga(Request $request)
    {
        ini_set('max_execution_time', 500);
        $dataPengunjung = \DB::table('pasiendaftar_t as pd')
        ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
        ->select(
            'pd.noregistrasi',
            'pd.norec as norec_pd',
            'pd.objectruanganlastfk',
            'ru.namaruangan'
        )
            ->whereIn('ru.id', [1096, 1033 ,564])
            ->whereNotNull('pd.tglpulang')
            ->where('pd.statusenabled', true);

        if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('pd.tglpulang', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('pd.tglpulang', '<=', $request['tglAkhir']);
        }
        if (isset($request['StatusPasien']) && $request['StatusPasien'] != '' && $request['StatusPasien'] != 'undefined') {
            if ($request['StatusPasien'] == 'BARU') {
                $dataPengunjung = $dataPengunjung->where('pd.statuspasien', 'Baru');
            } else {
                $dataPengunjung = $dataPengunjung->whereIn('pd.statuspasien', ['Lama', '']);
            }
        }
        if (isset($request['dokterfk']) && $request['dokterfk'] != '' && $request['dokterfk'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('pd.objectpegawaifk',   $request['dokterfk']);
        }
        $dataPengunjung = $dataPengunjung->orderBy('ru.id', 'asc');
        $dataPengunjung = $dataPengunjung->get();
        $data10 = [];
        $sama = false;
        $jmlPasien = 0;
        $jmlKunj = 0;
        foreach ($dataPengunjung as $item) {
            $sama = false;
            $i = 0;
            foreach ($data10 as $he) {
                if ($item->namaruangan == $data10[$i]['namaruangan']) {
                    $sama = true;
                        $jmlKunj = (float)$he['jmlKunj'] + 1;
                        $data10[$i]['jmlKunj'] = $jmlKunj;
                }
                $i = $i + 1;
            }
            if ($sama == false) {
                $jmlPasien = 0;
                $jmlKunj = 0;
                    $jmlKunj = 1;
                $data10[] = array(
                    'namaruangan' => $item->namaruangan,
                    'jmlKunj' => $jmlKunj
                );
            }
        }

        $detail = null;
        if (isset($request['tglAwal']) && strtotime($request['tglAwal']) <= strtotime('2023-12-31 23:59')) {
            $detail =  \DB::table('pasiendaftar_t as pd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('emrpasien_t as ep', 'ep.noregistrasifk', '=', 'pd.noregistrasi')
            ->select(
                'pd.noregistrasi',
                'pd.norec as norec_pd',
                'pd.objectruanganlastfk',
                'ru.namaruangan'
            )
                ->whereIn('ru.id', [1096, 1033 ,564])
                ->whereNotNull('pd.tglpulang')
                ->where('ep.jenisemr', '=', 'formulirfisioterapi')
                ->where('pd.statusenabled', true);
        }else{
            $detail =  \DB::table('pasiendaftar_t as pd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('emrpasien_t as ep', 'ep.noregistrasifk', '=', 'pd.noregistrasi')
            ->select(
                'pd.noregistrasi',
                'pd.norec as norec_pd',
                'pd.objectruanganlastfk',
                'ru.namaruangan'
            )
            ->whereIn('ru.id', [1096, 1033 ,564])
                ->whereNotNull('pd.tglpulang')
                ->where('ep.jenisemr', '=', 'formulirfisioterapi')
                ->where('pd.statusenabled', true);
        }
        if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
            $detail = $detail->where('pd.tglpulang', '>=', $request['tglAwal']);
        }    
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
            $detail = $detail->where('pd.tglpulang', '<=', $request['tglAkhir']);
        }    
        if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
            if($request['namaruangan'] == "PICU DAN HCU ANAK") {
                $detail = $detail->where('ru.namaexternal', $request['namaruangan']);
            } else {
                $detail = $detail->where('ru.namaruangan', '=', $request['namaruangan']);
            }
        }
        if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
            $detail = $detail->where('pd.objectpegawaifk', '=', $request['dokterfk']);
        } 
        // $data = $data->distinct();
        $detail = $detail->get();

        $detail = array_map("unserialize", array_unique(array_map("serialize", $detail)));

        $data11 = [];
        $sama = false;
        $jmlPerawat = 0;
        foreach ($detail as $item) {
            $sama = false;
            $i = 0;
            foreach ($data11 as $he) {
                if ($item->namaruangan == $data11[$i]['namaruangan']) {
                    $sama = true;
                        $jmlPerawat = (float)$he['jmlPerawat'] + 1;
                        $data11[$i]['jmlPerawat'] = $jmlPerawat;
                }
                $i = $i + 1;
            }
            if ($sama == false) {
                $jmlPerawat = 1;
                $data11[] = array (
                    'namaruangan' => $item->namaruangan,
                    'jmlPerawat' => $jmlPerawat,
                );
            }
        }
    $ruangan = \DB::table('ruangan_m')
        ->select('id', 'namaruangan')
        ->where('statusenabled', true)
        ->whereIn('id', [1096, 1033 ,564])
        ->get();
    $result = array (
        'data10' => $data10,
        'data11' => $data11,
        'ruangan' => $ruangan,
        'as' => 'epic'
    );
        return $this->respond($result);
    }
    public function getLaporanPengkajianOlahraga(Request $request)
    {
        ini_set('max_execution_time', 500);
        $dataPengunjung = \DB::table('pasiendaftar_t as pd')
        ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
        ->select(
            'pd.noregistrasi',
            'pd.norec as norec_pd',
            'pd.objectruanganlastfk',
            'ru.namaruangan'
        )
            ->whereIn('ru.id', [1096, 1033 ,564])
            ->whereNotNull('pd.tglpulang')
            ->where('pd.statusenabled', true);

        if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('pd.tglpulang', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('pd.tglpulang', '<=', $request['tglAkhir']);
        }
        if (isset($request['StatusPasien']) && $request['StatusPasien'] != '' && $request['StatusPasien'] != 'undefined') {
            if ($request['StatusPasien'] == 'BARU') {
                $dataPengunjung = $dataPengunjung->where('pd.statuspasien', 'Baru');
            } else {
                $dataPengunjung = $dataPengunjung->whereIn('pd.statuspasien', ['Lama', '']);
            }
        }
        if (isset($request['dokterfk']) && $request['dokterfk'] != '' && $request['dokterfk'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('pd.objectpegawaifk',   $request['dokterfk']);
        }
        $dataPengunjung = $dataPengunjung->orderBy('ru.id', 'asc');
        $dataPengunjung = $dataPengunjung->get();
        $data10 = [];
        $sama = false;
        $jmlPasien = 0;
        $jmlKunj = 0;
        foreach ($dataPengunjung as $item) {
            $sama = false;
            $i = 0;
            foreach ($data10 as $he) {
                if ($item->namaruangan == $data10[$i]['namaruangan']) {
                    $sama = true;
                        $jmlKunj = (float)$he['jmlKunj'] + 1;
                        $data10[$i]['jmlKunj'] = $jmlKunj;
                }
                $i = $i + 1;
            }
            if ($sama == false) {
                $jmlPasien = 0;
                $jmlKunj = 0;
                    $jmlKunj = 1;
                $data10[] = array(
                    'namaruangan' => $item->namaruangan,
                    'jmlKunj' => $jmlKunj
                );
            }
        }

        $detail = null;
        if (isset($request['tglAwal']) && strtotime($request['tglAwal']) <= strtotime('2023-12-31 23:59')) {
            $detail =  \DB::table('pasiendaftar_t as pd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('emrpasien_t as ep', 'ep.noregistrasifk', '=', 'pd.noregistrasi')
            ->select(
                'pd.noregistrasi',
                'pd.norec as norec_pd',
                'pd.objectruanganlastfk',
                'ru.namaruangan'
            )
                ->whereIn('ru.id', [1096, 1033 ,564])
                ->whereNotNull('pd.tglpulang')
                ->where('ep.jenisemr', '=', 'pengkajianmedisolahraga')
                ->where('pd.statusenabled', true);
        }else{
            $detail =  \DB::table('pasiendaftar_t as pd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('emrpasien_t as ep', 'ep.noregistrasifk', '=', 'pd.noregistrasi')
            ->select(
                'pd.noregistrasi',
                'pd.norec as norec_pd',
                'pd.objectruanganlastfk',
                'ru.namaruangan'
            )
            ->whereIn('ru.id', [1096, 1033 ,564])
                ->whereNotNull('pd.tglpulang')
                ->where('ep.jenisemr', '=', 'pengkajianmedisolahraga')
                ->where('pd.statusenabled', true);
        }
        if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
            $detail = $detail->where('pd.tglpulang', '>=', $request['tglAwal']);
        }    
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
            $detail = $detail->where('pd.tglpulang', '<=', $request['tglAkhir']);
        }    
        if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
            if($request['namaruangan'] == "PICU DAN HCU ANAK") {
                $detail = $detail->where('ru.namaexternal', $request['namaruangan']);
            } else {
                $detail = $detail->where('ru.namaruangan', '=', $request['namaruangan']);
            }
        }
        if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
            $detail = $detail->where('pd.objectpegawaifk', '=', $request['dokterfk']);
        } 
        // $data = $data->distinct();
        $detail = $detail->get();

        $detail = array_map("unserialize", array_unique(array_map("serialize", $detail)));

        $data11 = [];
        $sama = false;
        $jmlPerawat = 0;
        foreach ($detail as $item) {
            $sama = false;
            $i = 0;
            foreach ($data11 as $he) {
                if ($item->namaruangan == $data11[$i]['namaruangan']) {
                    $sama = true;
                        $jmlPerawat = (float)$he['jmlPerawat'] + 1;
                        $data11[$i]['jmlPerawat'] = $jmlPerawat;
                }
                $i = $i + 1;
            }
            if ($sama == false) {
                $jmlPerawat = 1;
                $data11[] = array (
                    'namaruangan' => $item->namaruangan,
                    'jmlPerawat' => $jmlPerawat,
                );
            }
        }
    $ruangan = \DB::table('ruangan_m')
        ->select('id', 'namaruangan')
        ->where('statusenabled', true)
        ->whereIn('id', [1096, 1033 ,564])
        ->get();
    $result = array (
        'data10' => $data10,
        'data11' => $data11,
        'ruangan' => $ruangan,
        'as' => 'epic'
    );
        return $this->respond($result);
    }
    public function getLaporanFormulirAsuhanGiziRj(Request $request)
    {
        ini_set('max_execution_time', 500);
        $dataPengunjung = \DB::table('pasiendaftar_t as pd')
        ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
        ->select(
            'pd.noregistrasi',
            'pd.norec as norec_pd',
            'pd.objectruanganlastfk',
            'ru.namaruangan'
        )
            ->whereIn('ru.id', [9, 1067, 1013])
            ->whereNotNull('pd.tglpulang')
            ->where('pd.statusenabled', true);

        if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('pd.tglpulang', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('pd.tglpulang', '<=', $request['tglAkhir']);
        }
        if (isset($request['StatusPasien']) && $request['StatusPasien'] != '' && $request['StatusPasien'] != 'undefined') {
            if ($request['StatusPasien'] == 'BARU') {
                $dataPengunjung = $dataPengunjung->where('pd.statuspasien', 'Baru');
            } else {
                $dataPengunjung = $dataPengunjung->whereIn('pd.statuspasien', ['Lama', '']);
            }
        }
        if (isset($request['dokterfk']) && $request['dokterfk'] != '' && $request['dokterfk'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('pd.objectpegawaifk',   $request['dokterfk']);
        }
        $dataPengunjung = $dataPengunjung->orderBy('ru.id', 'asc');
        $dataPengunjung = $dataPengunjung->get();
        $data10 = [];
        $sama = false;
        $jmlPasien = 0;
        $jmlKunj = 0;
        foreach ($dataPengunjung as $item) {
            $sama = false;
            $i = 0;
            foreach ($data10 as $he) {
                if ($item->namaruangan == $data10[$i]['namaruangan']) {
                    $sama = true;
                        $jmlKunj = (float)$he['jmlKunj'] + 1;
                        $data10[$i]['jmlKunj'] = $jmlKunj;
                }
                $i = $i + 1;
            }
            if ($sama == false) {
                $jmlPasien = 0;
                $jmlKunj = 0;
                    $jmlKunj = 1;
                $data10[] = array(
                    'namaruangan' => $item->namaruangan,
                    'jmlKunj' => $jmlKunj
                );
            }
        }

        $detail = null;
        if (isset($request['tglAwal']) && strtotime($request['tglAwal']) <= strtotime('2023-12-31 23:59')) {
            $detail =  \DB::table('pasiendaftar_t as pd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('emrpasien_t as ep', 'ep.noregistrasifk', '=', 'pd.noregistrasi')
            ->select(
                'pd.noregistrasi',
                'pd.norec as norec_pd',
                'pd.objectruanganlastfk',
                'ru.namaruangan'
            )
                ->whereIn('ru.id', [9, 1067, 1013])
                ->whereNotNull('pd.tglpulang')
                ->where('ep.jenisemr', '=', 'formulirasuhangizi')
                ->where('pd.statusenabled', true);
        }else{
            $detail =  \DB::table('pasiendaftar_t as pd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('emrpasien_t as ep', 'ep.noregistrasifk', '=', 'pd.noregistrasi')
            ->select(
                'pd.noregistrasi',
                'pd.norec as norec_pd',
                'pd.objectruanganlastfk',
                'ru.namaruangan'
            )
            ->whereIn('ru.id', [9, 1067, 1013])
                ->whereNotNull('pd.tglpulang')
                ->where('ep.jenisemr', '=', 'formulirasuhangizi')
                ->where('pd.statusenabled', true);
        }
        if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
            $detail = $detail->where('pd.tglpulang', '>=', $request['tglAwal']);
        }    
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
            $detail = $detail->where('pd.tglpulang', '<=', $request['tglAkhir']);
        }    
        if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
            if($request['namaruangan'] == "PICU DAN HCU ANAK") {
                $detail = $detail->where('ru.namaexternal', $request['namaruangan']);
            } else {
                $detail = $detail->where('ru.namaruangan', '=', $request['namaruangan']);
            }
        }
        if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
            $detail = $detail->where('pd.objectpegawaifk', '=', $request['dokterfk']);
        } 
        // $data = $data->distinct();
        $detail = $detail->get();

        $detail = array_map("unserialize", array_unique(array_map("serialize", $detail)));

        $data11 = [];
        $sama = false;
        $jmlPerawat = 0;
        foreach ($detail as $item) {
            $sama = false;
            $i = 0;
            foreach ($data11 as $he) {
                if ($item->namaruangan == $data11[$i]['namaruangan']) {
                    $sama = true;
                        $jmlPerawat = (float)$he['jmlPerawat'] + 1;
                        $data11[$i]['jmlPerawat'] = $jmlPerawat;
                }
                $i = $i + 1;
            }
            if ($sama == false) {
                $jmlPerawat = 1;
                $data11[] = array (
                    'namaruangan' => $item->namaruangan,
                    'jmlPerawat' => $jmlPerawat,
                );
            }
        }
    $ruangan = \DB::table('ruangan_m')
        ->select('id', 'namaruangan')
        ->where('statusenabled', true)
        ->whereIn('id', [9, 1067, 1013])
        ->get();
    $result = array (
        'data10' => $data10,
        'data11' => $data11,
        'ruangan' => $ruangan,
        'as' => 'epic'
    );
        return $this->respond($result);
    }
    public function getLaporanAsuhanGiziOnly(Request $request)
    {
        ini_set('max_execution_time', 500);
        $dataPengunjung = \DB::table('pasiendaftar_t as pd')
        ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
        ->select(
            'pd.noregistrasi',
            'pd.norec as norec_pd',
            'pd.objectruanganlastfk',
            'ru.namaruangan'
        )
            ->whereIn('ru.id', [9, 1067, 1013])
            ->whereNotNull('pd.tglpulang')
            ->where('pd.statusenabled', true);

        if (isset($request['tglAwal']) && $request['tglAwal'] != '' && $request['tglAwal'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('pd.tglpulang', '>=', $request['tglAwal']);
        }
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '' && $request['tglAkhir'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('pd.tglpulang', '<=', $request['tglAkhir']);
        }
        if (isset($request['StatusPasien']) && $request['StatusPasien'] != '' && $request['StatusPasien'] != 'undefined') {
            if ($request['StatusPasien'] == 'BARU') {
                $dataPengunjung = $dataPengunjung->where('pd.statuspasien', 'Baru');
            } else {
                $dataPengunjung = $dataPengunjung->whereIn('pd.statuspasien', ['Lama', '']);
            }
        }
        if (isset($request['dokterfk']) && $request['dokterfk'] != '' && $request['dokterfk'] != 'undefined') {
            $dataPengunjung = $dataPengunjung->where('pd.objectpegawaifk',   $request['dokterfk']);
        }
        $dataPengunjung = $dataPengunjung->orderBy('ru.id', 'asc');
        $dataPengunjung = $dataPengunjung->get();
        $data10 = [];
        $sama = false;
        $jmlPasien = 0;
        $jmlKunj = 0;
        foreach ($dataPengunjung as $item) {
            $sama = false;
            $i = 0;
            foreach ($data10 as $he) {
                if ($item->namaruangan == $data10[$i]['namaruangan']) {
                    $sama = true;
                        $jmlKunj = (float)$he['jmlKunj'] + 1;
                        $data10[$i]['jmlKunj'] = $jmlKunj;
                }
                $i = $i + 1;
            }
            if ($sama == false) {
                $jmlPasien = 0;
                $jmlKunj = 0;
                    $jmlKunj = 1;
                $data10[] = array(
                    'namaruangan' => $item->namaruangan,
                    'jmlKunj' => $jmlKunj
                );
            }
        }

        $detail = null;
        if (isset($request['tglAwal']) && strtotime($request['tglAwal']) <= strtotime('2023-12-31 23:59')) {
            $detail =  \DB::table('pasiendaftar_t as pd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('emrpasien_t as ep', 'ep.noregistrasifk', '=', 'pd.noregistrasi')
            ->select(
                'pd.noregistrasi',
                'pd.norec as norec_pd',
                'pd.objectruanganlastfk',
                'ru.namaruangan'
            )
                ->whereIn('ru.id', [9, 1067, 1013])
                ->whereNotNull('pd.tglpulang')
                ->whereIn('ep.jenisemr', ['skrininggizianak', 'skrininggizidewasa'])
                ->where('pd.statusenabled', true);
        }else{
            $detail =  \DB::table('pasiendaftar_t as pd')
            ->join('ruangan_m as ru', 'ru.id', '=', 'pd.objectruanganlastfk')
            ->leftJoin('pegawai_m as pg', 'pg.id', '=', 'pd.objectpegawaifk')
            ->leftJoin('emrpasien_t as ep', 'ep.noregistrasifk', '=', 'pd.noregistrasi')
            ->select(
                'pd.noregistrasi',
                'pd.norec as norec_pd',
                'pd.objectruanganlastfk',
                'ru.namaruangan'
            )
            ->whereIn('ru.id', [9, 1067, 1013])
                ->whereNotNull('pd.tglpulang')
                ->whereIn('ep.jenisemr', ['skrininggizianak', 'skrininggizidewasa'])
                ->where('pd.statusenabled', true);
        }
        if (isset($request['tglAwal']) && $request['tglAwal'] != '') {
            $detail = $detail->where('pd.tglpulang', '>=', $request['tglAwal']);
        }    
        if (isset($request['tglAkhir']) && $request['tglAkhir'] != '') {
            $detail = $detail->where('pd.tglpulang', '<=', $request['tglAkhir']);
        }    
        if (isset($request['namaruangan']) && $request['namaruangan'] != '') {
            if($request['namaruangan'] == "PICU DAN HCU ANAK") {
                $detail = $detail->where('ru.namaexternal', $request['namaruangan']);
            } else {
                $detail = $detail->where('ru.namaruangan', '=', $request['namaruangan']);
            }
        }
        if (isset($request['dokterfk']) && $request['dokterfk'] != '') {
            $detail = $detail->where('pd.objectpegawaifk', '=', $request['dokterfk']);
        } 
        // $data = $data->distinct();
        $detail = $detail->get();

        $detail = array_map("unserialize", array_unique(array_map("serialize", $detail)));

        $data11 = [];
        $sama = false;
        $jmlPerawat = 0;
        foreach ($detail as $item) {
            $sama = false;
            $i = 0;
            foreach ($data11 as $he) {
                if ($item->namaruangan == $data11[$i]['namaruangan']) {
                    $sama = true;
                        $jmlPerawat = (float)$he['jmlPerawat'] + 1;
                        $data11[$i]['jmlPerawat'] = $jmlPerawat;
                }
                $i = $i + 1;
            }
            if ($sama == false) {
                $jmlPerawat = 1;
                $data11[] = array (
                    'namaruangan' => $item->namaruangan,
                    'jmlPerawat' => $jmlPerawat,
                );
            }
        }
    $ruangan = \DB::table('ruangan_m')
        ->select('id', 'namaruangan')
        ->where('statusenabled', true)
        ->whereIn('id', [9, 1067, 1013])
        ->get();
    $result = array (
        'data10' => $data10,
        'data11' => $data11,
        'ruangan' => $ruangan,
        'as' => 'epic'
    );
        return $this->respond($result);
    }
      


}