<?php

namespace App\Transaksi;

use Illuminate\Database\Eloquent\Model;

class CssdPenyimpanan extends Transaksi
{
    protected $table = 'cssdpenyimpanan_t';
    protected $fillable = [];
    public $timestamps = false;





    


//    public function getTableColumns() {
//        $result = [];
//        $case =  $this->getConnection()->getSchemaBuilder()->getColumnListing($this->getTable());
//        return $case;

//        return DB::connection()->getDoctrineColumn($this->getTable())->getType()->getName();
//        cari disini
//        http://stackoverflow.com/questions/18562684/how-to-get-database-field-type-in-laravel
//    }


}