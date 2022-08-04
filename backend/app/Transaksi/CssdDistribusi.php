<?php

namespace App\Transaksi;

// use Illuminate\Database\Eloquent\Model;
//use DB;

class CssdDistribusi extends Transaksi
{
    protected $table = 'cssddistribusi_t';
    protected $fillable = [];
    public $timestamps = false;
    
    protected $primaryKey = "norec";


//    public function getTableColumns() {
//        $result = [];
//        $case =  $this->getConnection()->getSchemaBuilder()->getColumnListing($this->getTable());
//        return $case;

//        return DB::connection()->getDoctrineColumn($this->getTable())->getType()->getName();
//        cari disini
//        http://stackoverflow.com/questions/18562684/how-to-get-database-field-type-in-laravel
//    }


}


