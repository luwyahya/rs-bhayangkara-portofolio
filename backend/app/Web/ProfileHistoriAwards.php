<?php

namespace App\Web\Admin;


use Illuminate\Database\Eloquent\Model;

class ProfileHistoriAwards extends Model
{
    protected $table = 'profilehistoriawards_t';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

}
