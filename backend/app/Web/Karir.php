<?php

namespace App\Web;

class Karir extends AdminModel
{
    protected $table = 'strukhistori_t';
    protected $fillable = [];
    public $timestamps = false;

    public function __construct(){
        $this->setTransformerPath('App\Transformers\Web\KarirTransformer');
    }

    public function getData(){
        $query = \DB::table('strukhistori_t as sh_t')
            ->join('profilehistorilowongan_t as phl_t', 'sh_t.norec', '=', 'phl_t.nohistorifk')
            ->join('profilehistorilowongand_t as phld_t', 'sh_t.norec', '=', 'phld_t.nohistorifk')
            ->join('profilehistorilowongankj_t as phlkj_t', 'sh_t.norec', '=', 'phlkj_t.nohistorifk')
            ->join('profilehistorilowongans_t as phls_t', 'sh_t.norec', '=', 'phls_t.nohistorifk')
            ->leftJoin('jabatan_m as jab', 'phl_t.jabatanfk', '=', 'jab.id')
            ->leftJoin('jenispegawai_m as jpeg', 'phl_t.jenispegawaifk', '=', 'jpeg.id')
            ->leftJoin('alamat_m as alamat', 'phl_t.alamatprofiletujuanfk', '=', 'alamat.kdalamat')
            ->leftJoin('dokumen_m as doc', 'phld_t.dokumenfk', '=', 'doc.kddokumen')
            ->leftJoin('kategoripegawai_m as kpeg', 'phld_t.kategorypegawaifk', '=', 'kpeg.id')
            ->leftJoin('kualifikasijurusan_m as kjur', 'phlkj_t.kualifikasijurusanfk', '=', 'kjur.kdkualifikasijurusan')
            ->leftJoin('pendidikan_m as pddk', 'kjur.kdpendidikan', '=', 'pddk.id')
            ->leftJoin('spesifikasi_m as spec', 'phls_t.spesifikasifk', '=', 'spec.kdspesifikasi')
            ->select('sh_t.tglawal', 'sh_t.tglahir', 'phl_t.keteranganlainnya','jpeg.jenispegawai','jab.namajabatan','kpeg.kategoripegawai','doc.namajuduldokumen',
                'spec.namaspesifikasi', 'pddk.pendidikan', 'kjur.Kualifikasijurusan' );
        $data = $query->get();
        return $data;
    }
}
