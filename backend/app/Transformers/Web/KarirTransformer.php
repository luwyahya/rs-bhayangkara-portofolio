<?php
namespace App\Transformers\Web;

use App\Transformers\Transformer;

use League\Fractal\Resource\Collection;

class KarirTransformer extends Transformer{

  protected $list = [
    'id'=> 'id',
    'kdprofile'=> 'kdProfile',
    'statusenabled'=> 'statusEnabled',
    'kodeexternal'=> 'kodeExternal',
    'namaexternal'=> 'namaExternal',
    'norec'=> 'noRec',
    'reportdisplay'=> 'reportDisplay',
    'objectdetailkelompokpegawaifk'=> 'objectDetailKelompokPegawaiFk',
    'jenispegawai'=> 'jenisPegawai',
    'kdjenispegawai'=> 'kdJenisPegawai',
    'qjenispegawai'=> 'qJenisPegawai'
  ];      
}
