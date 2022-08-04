<?php

namespace App\Master;

class DetailResepMaster extends MasterModel
{
    protected $table = 'detailresepmaster_m';
    protected $fillable = [];
    public $timestamps = false;

    public $incrementing = false;
    protected $primaryKey = "norec";


}


