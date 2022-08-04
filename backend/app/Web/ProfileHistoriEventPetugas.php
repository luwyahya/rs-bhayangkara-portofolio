<?php

namespace App\Web\Admin;
use Illuminate\Database\Eloquent\Model;
class ProfileHistoriEventPetugas extends Model
{
    protected $table = 'profilehistorieventpetugas_t';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";

}
