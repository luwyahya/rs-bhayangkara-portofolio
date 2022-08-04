<?php

namespace App\Web\Admin;
use DB;
class Pegawai extends AdminModel
{
    protected $table = 'pegawai_m';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "id";

}
