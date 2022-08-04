<?php

namespace App\Web\Admin;
use DB;
class Penghargaan extends AdminModel
{
    protected $table = 'profilehistoriawards_t';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

    public function __construct(){

    }

    public static function getData(){
        /*
        $query = DB::table('profilehistoriawards_t a')
                        ->join('awards_m b', 'a.awardsfk', '=', 'b.id')
                        ->join('strukhistori_t c', 'a.nohistorifk', '=', 'c.norec')
                        ->select('  a.kdprofile,
                                    a.deskripsiawards,
                                    a.namarekananpemberi,
                                    a.tglawardsterima,
                                    b.kdawards,
                                    b.namaawards,
                                    c.nohistori,
                                    c.tglhistori,
                                    c.kdkelompoktransaksi');
        $data = $query->get();
        return $data;
        */
        return 'test';
    }

}
