<?php

namespace App\Web;

use Illuminate\Database\Eloquent\Model;

class ProfileHistoriLaporan_T extends Model
{
    protected $table = 'profilehistorilaporan_t';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

    public function __construct(){
        //$this->setTransformerPath('App\Transformers\Web\VisiTransformer');
    }
}
