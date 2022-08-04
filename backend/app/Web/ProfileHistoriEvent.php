<?php

namespace App\Web\Admin;
use Illuminate\Database\Eloquent\Model;

class ProfileHistoriEvent extends Model
{
    protected $table = 'profilehistorievent_t';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

}
