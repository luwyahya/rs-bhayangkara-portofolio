<?php

namespace App\Web;


use Illuminate\Database\Eloquent\Model;

class ProfileHistoriLowongan extends Model
{
    protected $table = 'profilehistorilowongan_t';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

}
