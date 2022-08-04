<?php

namespace App\Web;

use Illuminate\Database\Eloquent\Model;

class Asal extends Model
{
    protected $table = 'asal_m';
    protected $fillable = [];
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = "norec";
}
