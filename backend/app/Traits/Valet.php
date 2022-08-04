<?php
namespace App\Traits;

use Carbon\Carbon;

use DB;
use App\Transaksi\SeqNumber;
use Illuminate\Http\Request;
Trait Valet
{
    protected function generateCodeBySeqTable($objectModel, $atrribute, $length=8, $prefix=''){
        DB::beginTransaction();
        try {
            $result = SeqNumber::where('seqnumber', 'LIKE', $prefix.'%')
                ->where('seqname',$atrribute)
                ->where('kdprofile',1)
                ->max('seqnumber');
        
            $prefixLen = strlen($prefix);
            $subPrefix = substr(trim($result),$prefixLen);
            $SN = $prefix.(str_pad((int)$subPrefix+1, $length-$prefixLen, "0", STR_PAD_LEFT));

            $newSN = new SeqNumber();
            $newSN->kdprofile = 1;
            $newSN->seqnumber = $SN;
            $newSN->tgljamseq = date('Y-m-d H:i:s');;
            $newSN->seqname = $atrribute;
            $newSN->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            DB::commit();
            return $SN;
        } else {
            DB::rollBack();
            return '';
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    protected function generateCode($objectModel, $atrribute, $length=8, $prefix='',$kdprofile =null){

        $result = $objectModel->where($atrribute, "ILIKE", $prefix.'%')->max($atrribute);
        $prefixLen = strlen($prefix);
        $subPrefix = substr(trim($result),$prefixLen);
        return $prefix.(str_pad((int)$subPrefix+1, $length-$prefixLen, "0", STR_PAD_LEFT));
    }
    protected function generateCodeDibelakang($objectModel, $atrribute, $length=8, $prefix=''){
        $result = $objectModel->where($atrribute, "ILIKE", '%'.$prefix)->max($atrribute);
        $prefixLen = strlen($prefix);
        $subPrefix = substr(trim($result),$prefixLen);
        return (str_pad((int)$subPrefix+1, $length-$prefixLen, "0", STR_PAD_LEFT)).$prefix;
    }
    protected function generateCode2($objectModel, $atrribute, $length=0, $prefix=''){
        $result = $objectModel->where($atrribute, "ILIKE", $prefix.'%')->max($atrribute);
        $prefixLen = strlen($prefix);
        $subPrefix = substr(trim($result),$prefixLen);
        return $prefix.(str_pad((int)$subPrefix+1, $length-$prefixLen, "0", STR_PAD_LEFT));
    }
    protected function getCountArray($objectArr){
        $counting =0 ;
        foreach ($objectArr as $hint){
            $counting = $counting +1 ;
        }
        return $counting;
    }

    protected function getSequence($name='hibernate_sequence'){
        $result=null;
        if(\DB::connection()->getName() == 'pgsql'){
            $next_id = \DB::select("select nextval('".$name."')");
            $result = $next_id['0']->nextval;
        }
        return $result;
    }

    protected function getDateTime(){
        return Carbon::now();
    }

    protected function terbilang($number){
            $x = abs($number);
            $angka = array("", "satu", "dua", "tiga", "empat", "lima",
                "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas");
            $temp = "";
            if ($number <12) {
                $temp = " ". $angka[$number];
            } else if ($number <20) {
                $temp = $this->terbilang($number - 10). " belas";
            } else if ($number <100) {
                $temp = $this->terbilang($number/10)." puluh". $this->terbilang($number % 10);
            } else if ($number <200) {
                $temp = " seratus" . $this->terbilang($number - 100);
            } else if ($number <1000) {
                $temp = $this->terbilang($number/100) . " ratus" . $this->terbilang($number % 100);
            } else if ($number <2000) {
                $temp = " seribu" . $this->terbilang($number - 1000);
            } else if ($number <1000000) {
                $temp = $this->terbilang($number/1000) . " ribu" . $this->terbilang($number % 1000);
            } else if ($number <1000000000) {
                $temp = $this->terbilang($number/1000000) . " juta" . $this->terbilang($number % 1000000);
            } else if ($number <1000000000000) {
                $temp = $this->terbilang($number/1000000000) . " milyar" . $this->terbilang(fmod($number,1000000000));
            } else if ($number <1000000000000000) {
                $temp = $this->terbilang($number/1000000000000) . " trilyun" . $this->terbilang(fmod($number,1000000000000));
            }
            return $temp;
    }

    protected function makeTerbilang($number, $prefix=' rupiah', $suffix=''){
        if($number<0) {
            $hasil = "negatif ". trim($this->terbilang($number));
        } else {
            $hasil = trim($this->terbilang($number));
        }
        return $suffix.$hasil.$prefix;
    }

    public function getMoneyFormatString($number){
        return number_format($number,2,",",".");
    }

    public function getQtyFormatString($number){
        return str_replace(',00', '',number_format($number,2,",","."));
    }

    public function getDateReport($objectCarbonDate){
        $tahun=$objectCarbonDate->year;
        $bulan=$objectCarbonDate->month;
        $tanggal=$objectCarbonDate->day;
        $labelBulan = array('', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des');
        return $tanggal." ".$labelBulan[$bulan]." ".$tahun;
    }

    public function getDateTimeReport($objectCarbonDate){
        $dateString = $this->getDateReport($objectCarbonDate);
        return $dateString." ".$objectCarbonDate->hour.":".$objectCarbonDate->minute.":".$objectCarbonDate->second;
    }

    public function getBiayaMaterai($total){
        $biayaMaterai = 0;

        if($total > 1000000.99 ){
            $biayaMaterai =6000;
        }elseif($total > 500000.99){
            $biayaMaterai = 3000;
        }
        return $biayaMaterai;
    }

    public function hitungUmur($params){
            $tahun=(int)date('Y', strtotime($params));
            $bulan=(int)date('m', strtotime($params));
            $tanggal=(int)date('d', strtotime($params));
            $selisih_bulan=0;
            $selisih_tahun=0;

            $selisih_tanggal = (int)date('d')-$tanggal;
            if($selisih_tanggal<0){
                $selisih_bulan--;
                $selisih_tanggal+= 30;
            }

            $selisih_bulan += (int)date('m')-$bulan;
            if($selisih_bulan<0){
                $selisih_tahun--;
                $selisih_bulan += 12;
            }


            $selisih_tahun += (int)date('Y') - $tahun;
            $result = "";
            if($selisih_tahun>0){
                $result = abs($selisih_tahun).' Tahun, ';
            }
            if($selisih_bulan>0){
                $result .= abs($selisih_bulan).' Bulan, ';
            }
            if($selisih_tanggal>0){
                $result .= abs($selisih_tanggal).' Hari. ';
            }

            return $result;
    }


    protected function subDateTime($string){
        return substr($string, 0, 19);
    }

    protected function isPasienRawatInap($pasienDaftar){
        if($pasienDaftar->objectruanganlastfk!=null){
            if((int)$pasienDaftar->ruangan->objectdepartemenfk==16){
                return true;
            }
        }
        return false;
    }
    protected function isPasienRawatInap2($pasienDaftar){
        if($pasienDaftar->objectruanganlastfk!=null){
            if((int)$pasienDaftar->objectdepartemenfk==16){
                return true;
            }
        }
        return false;
    }
    protected function KonDecRomawi($angka)
    {
        $hsl = "";
        if ($angka == 1) {
            $hsl='I';
        };
        if ($angka == 2) {
            $hsl='II';
        };
        if ($angka == 3) {
            $hsl='III';
        };
        if ($angka == 4) {
            $hsl='IV';
        };
        if ($angka == 5) {
            $hsl='V';
        };
        if ($angka == 6) {
            $hsl='VI';
        };
        if ($angka == 7) {
            $hsl='VII';
        };
        if ($angka == 8) {
            $hsl='VIII';
        };
        if ($angka == 9) {
            $hsl='IX';
        };
        if ($angka == 10) {
            $hsl='X';
        };
        if ($angka == 11) {
            $hsl='XI';
        };
        if ($angka == 12) {
            $hsl='XII';
        };
        return ($hsl);
    }

    protected function genCode2($objectModel, $atrribute, $length=4, $prefix=''){

        $result = $objectModel->where($atrribute, 'LIKE', '%'.'/RSM/'.'%')->max($atrribute);
        $bln2 = Carbon::now()->format('Y/m');
        $a=substr(trim($result),0,7);

        if($a!=$bln2){
            $subPrefix = '000';
        }else{
            $subPrefix = substr(trim($result),8,11);
        }
        $prefixLen = strlen($prefix);


        return $prefix.(str_pad((int)$subPrefix+1, $length-$prefixLen, "0", STR_PAD_LEFT));
    }
    public function settingDataFixed($NamaField, $KdProfile=null){
        $KdProfile = null;
        $Query = DB::table('settingdatafixed_m')
            ->where('namafield', '=', $NamaField);
        if($KdProfile){
            $Query->where('kdprofile', '=', $KdProfile);
        }
        $settingDataFixed = $Query->first();
        if(!empty($settingDataFixed)){
            return $settingDataFixed->nilaifield;
        }else{
            return null;
        }
    }
    public function getAge($tgllahir,$now){
        $datetime = new \DateTime(date($tgllahir));
        return $datetime->diff(new \DateTime($now))
            ->format('%ythn %mbln %dhr');
    }
    public static  function getDateIndo($date2) { // fungsi atau method untuk mengubah tanggal ke format indonesia
        // variabel BulanIndo merupakan variabel array yang menyimpan nama-nama bulan
        $BulanIndo2 = array("Januari", "Februari", "Maret",
            "April", "Mei", "Juni",
            "Juli", "Agustus", "September",
            "Oktober", "November", "Desember");

        $tahun2 = substr($date2, 0, 4); // memisahkan format tahun menggunakan substring
        $bulan2 = substr($date2, 5, 2); // memisahkan format bulan menggunakan substring
        $tgl2   = substr($date2, 8, 2); // memisahkan format tanggal menggunakan substring

        $result = $tgl2 . " " . $BulanIndo2[(int)$bulan2-1] . " ". $tahun2;
        return($result);
    }
    public static  function getDateInggris($date2) { // fungsi atau method untuk mengubah tanggal ke format indonesia
        // variabel BulanIndo merupakan variabel array yang menyimpan nama-nama bulan
        $BulanIndo2 = array("January", "February", "March",
            "April", "May", "June",
            "July", "August", "September",
            "October", "November", "December");

        $tahun2 = substr($date2, 0, 4); // memisahkan format tahun menggunakan substring
        $bulan2 = substr($date2, 5, 2); // memisahkan format bulan menggunakan substring
        $tgl2   = substr($date2, 8, 2); // memisahkan format tanggal menggunakan substring

        $result = $tgl2 . " " . $BulanIndo2[(int)$bulan2-1] . " ". $tahun2;
        return($result);
    }
    public static  function getBulanAngka($date2) { // fungsi atau method untuk mengubah tanggal ke format indonesia
        // variabel BulanIndo merupakan variabel array yang menyimpan nama-nama bulan
        $BulanIndo2 = array("01", "02", "03",
            "04", "05", "06",
            "07", "08", "09",
            "10", "11", "12");

        $tahun2 = substr($date2, 0, 4); // memisahkan format tahun menggunakan substring
        $bulan2 = substr($date2, 5, 2); // memisahkan format bulan menggunakan substring
        $tgl2   = substr($date2, 8, 2); // memisahkan format tanggal menggunakan substring

        $result = $tgl2 . "-" . $BulanIndo2[(int)$bulan2-1] . "-". $tahun2;
        return($result);
    }
    public static  function getDateRomawi($date2) { // fungsi atau method untuk mengubah tanggal ke format indonesia
        // variabel BulanIndo merupakan variabel array yang menyimpan nama-nama bulan
        $BulanIndo2 = array("I", "II", "III",
            "IV", "V", "VI",
            "VII", "VIII", "IX",
            "X", "XI", "XII");

        $tahun2 = substr($date2, 0, 4); // memisahkan format tahun menggunakan substring
        $bulan2 = substr($date2, 5, 2); // memisahkan format bulan menggunakan substring
        $tgl2   = substr($date2, 8, 2); // memisahkan format tanggal menggunakan substring

        $result = $tgl2 . " / " . $BulanIndo2[(int)$bulan2-1] . " / ". $tahun2;
        return($result);
    }
    public static  function getDateHuruf($date2) { // fungsi atau method untuk mengubah tanggal ke format indonesia
        // variabel BulanIndo merupakan variabel array yang menyimpan nama-nama bulan
        $TanggalHuruf = array("nol satu", "nol dua", "nol tiga",
            "nol empat", "nol lima", "nol enam",
            "nol tujuh", "nol delapan", "nol sembilan",
            "Sepuluh", "Sebelas", "Dua Belas", "Tiga Belas", "Empat Belas", "Lima Belas",
            "Enam Belas", "Tujuh Belas", "Delapan Belas", "Sembilan Belas", "Dua Puluh",
            "Dua Puluh Satu", "Dua Puluh Dua", "Dua Puluh Tiga", "Dua Puluh Empat", "Dua Puluh Lima",
            "Dua Puluh Enam", "Dua Puluh Tujuh", "Dua Puluh Delapan", "Dua Puluh Sembilan", "Tiga Puluh",
            "Tiga Puluh Satu");

        $BulanIndo2 = array("Januari", "Februari", "Maret",
            "April", "Mei", "Juni",
            "Juli", "Agustus", "September",
            "Oktober", "November", "Desember");

        $TahunHuruf = array("Dua Ribu Dua Puluh Satu","Dua Ribu Dua Puluh Dua","Dua Ribu Dua Puluh Tiga","Dua Ribu Dua Puluh Empat","Dua Ribu Dua Puluh Lima"
            ,"Dua Ribu Dua Puluh Enam","Dua Ribu Dua Puluh Tujuh","Dua Ribu Dua Puluh Delapan","Dua Ribu Dua Puluh Sembilan","Dua Ribu Tiga Puluh","Dua Ribu Tiga Puluh Satu"
            ,"Dua Ribu Tiga Puluh Dua","Dua Ribu Tiga Puluh Tiga","Dua Ribu Tiga Puluh Empat","Dua Ribu Tiga Puluh Lima","Dua Ribu Tiga Puluh Enam","Dua Ribu Tiga Puluh Tujuh"
            ,"Dua Ribu Tiga Puluh Delapan","Dua Ribu Tiga Puluh Sembilan","Dua Ribu Empat Puluh","Dua Ribu Empat Puluh Satu","Dua Ribu Empat Puluh Dua","Dua Ribu Empat Puluh Tiga"
            ,"Dua Ribu Empat Puluh Empat","Dua Ribu Empat Puluh Lima","Dua Ribu Empat Puluh Enam","Dua Ribu Empat Puluh Tujuh","Dua Ribu Empat Puluh Delapan","Dua Ribu Empat Puluh Sembilan"
            ,"Dua Ribu Lima Puluh");

        $tahun2 = substr($date2, 0, 4); // memisahkan format tahun menggunakan substring
        $bulan2 = substr($date2, 5, 2); // memisahkan format bulan menggunakan substring
        $tgl2   = substr($date2, 8, 2); // memisahkan format tanggal menggunakan substring

        $result = $TanggalHuruf[(int)$tgl2] . " bulan " . $BulanIndo2[(int)$bulan2-1] . " tahun ". $TahunHuruf[(int)$tahun2-2021];
        return($result);
    }
    public static  function getDateHuruf2($datetime2) { // fungsi atau method untuk mengubah tanggal ke format indonesia
        // variabel BulanIndo merupakan variabel array yang menyimpan nama-nama bulan
        $TanggalHuruf = array("Satu", "Dua", "Tiga",
            "Empat", "Lima", "Enam",
            "Tujuh", "Delapan", "Sembilan",
            "Sepuluh", "Sebelas", "Dua Belas", "Tiga Belas", "Empat Belas", "Lima Belas",
            "Enam Belas", "Tujuh Belas", "Delapan Belas", "Sembilan Belas", "Dua Puluh",
            "Dua Puluh Satu", "Dua Puluh Dua", "Dua Puluh Tiga", "Dua Puluh Empat", "Dua Puluh Lima",
            "Dua Puluh Enam", "Dua Puluh Tujuh", "Dua Puluh Delapan", "Dua Puluh Sembilan", "Tiga Puluh",
            "Tiga Puluh Satu");

        $BulanIndo2 = array("Januari", "Februari", "Maret",
            "April", "Mei", "Juni",
            "Juli", "Agustus", "September",
            "Oktober", "November", "Desember");

        $TahunHuruf = array("Dua Ribu Dua Puluh Satu","Dua Ribu Dua Puluh Dua","Dua Ribu Dua Puluh Tiga","Dua Ribu Dua Puluh Empat","Dua Ribu Dua Puluh Lima"
            ,"Dua Ribu Dua Puluh Enam","Dua Ribu Dua Puluh Tujuh","Dua Ribu Dua Puluh Delapan","Dua Ribu Dua Puluh Sembilan","Dua Ribu Tiga Puluh","Dua Ribu Tiga Puluh Satu"
            ,"Dua Ribu Tiga Puluh Dua","Dua Ribu Tiga Puluh Tiga","Dua Ribu Tiga Puluh Empat","Dua Ribu Tiga Puluh Lima","Dua Ribu Tiga Puluh Enam","Dua Ribu Tiga Puluh Tujuh"
            ,"Dua Ribu Tiga Puluh Delapan","Dua Ribu Tiga Puluh Sembilan","Dua Ribu Empat Puluh","Dua Ribu Empat Puluh Satu","Dua Ribu Empat Puluh Dua","Dua Ribu Empat Puluh Tiga"
            ,"Dua Ribu Empat Puluh Empat","Dua Ribu Empat Puluh Lima","Dua Ribu Empat Puluh Enam","Dua Ribu Empat Puluh Tujuh","Dua Ribu Empat Puluh Delapan","Dua Ribu Empat Puluh Sembilan"
            ,"Dua Ribu Lima Puluh");

        $JamHuruf = array("Nol Nol","Satu", "Dua", "Tiga",
        "Empat", "Lima", "Enam",
        "Tujuh", "Delapan", "Sembilan",
        "Sepuluh", "Sebelas", "Dua Belas", "Tiga Belas", "Empat Belas", "Lima Belas",
        "Enam Belas", "Tujuh Belas", "Delapan Belas", "Sembilan Belas", "Dua Puluh",
        "Dua Puluh Satu", "Dua Puluh Dua", "Dua Puluh Tiga", "Dua Puluh Empat");

        $MenitHuruf = array("Nol Nol","Satu", "Dua", "Tiga",
        "Empat", "Lima", "Enam",
        "Tujuh", "Delapan", "Sembilan",
        "Sepuluh", "Sebelas", "Dua Belas", "Tiga Belas", "Empat Belas", "Lima Belas",
        "Enam Belas", "Tujuh Belas", "Delapan Belas", "Sembilan Belas", "Dua Puluh",
        "Dua Puluh Satu", "Dua Puluh Dua", "Dua Puluh Tiga", "Dua Puluh Empat", "Dua Puluh Lima", "Dua Puluh Enam", "Dua Puluh Tujuh", "Dua Puluh Delapan", "Dua Puluh Sembilan", "Tiga Puluh",
        "Tiga Puluh Satu", "Tiga Puluh Dua", "Tiga Puluh Tiga", "Tiga Puluh Empat", "Tiga Puluh Lima", "Tiga Puluh Enam", "Tiga Puluh Tujuh", "Tiga Puluh Delapan", "Tiga Puluh Sembilan", "Empat Puluh",
        "Empat Puluh Satu", "Empat Puluh Dua", "Empat Puluh Tiga", "Empat Puluh Empat", "Empat Puluh Lima", "Empat Puluh Enam", "Empat Puluh Tujuh", "Empat Puluh Delapan", "Empat Puluh Sembilan", "Lima Puluh",
        "Lima Puluh Satu", "Lima Puluh Dua", "Lima Puluh Tiga", "Lima Puluh Empat", "Lima Puluh Lima", "Lima Puluh Enam", "Lima Puluh Tujuh", "Lima Puluh Delapan", "Lima Puluh Sembilan", "Enam Puluh");

        $tahun2 = substr($datetime2, 0, 4); // memisahkan format tahun menggunakan substring
        $bulan2 = substr($datetime2, 5, 2); // memisahkan format bulan menggunakan substring
        $tgl2   = substr($datetime2, 8, 2); // memisahkan format tanggal menggunakan substring
        $H2   = substr($datetime2, 10, 8); // memisahkan format jam menggunakan substring
        $M2   = substr($datetime2, 14, 2); // memisahkan format menit menggunakan substring

        $result = $TanggalHuruf[(int)$tgl2-1] . " Bulan " . $BulanIndo2[(int)$bulan2-1] . " Tahun ". $TahunHuruf[(int)$tahun2-2021] . ", pukul " . $JamHuruf[(int)$H2] . " titik " . $MenitHuruf[(int)$M2];
        return($result);
    }
    public static function convertangka($angka2) {
        $angka = array("Nol","Satu","Dua","Tiga","Empat","Lima","Enam","Tujuh","Delapan","Sembilan","Sepuluh","Sebelas","Dua Belas");

        $convert = ($angka);
        $result = $convert;
        return($result);
    }
     public function getDataKdProfile(Request $request){
        return null;
        $dataLogin = $request->all();
        $idUser = $dataLogin['userData']['id'];
        $data = LoginUser::where('id', $idUser)->first();
        $idKdProfile = (int)$data->kdprofile;
        $Query = DB::table('profile_m')
            ->where('id', '=', $idKdProfile)
            ->first();
        $Profile = $Query;
        if(!empty($Profile)){
            return (int)$Profile->id;
        }else{
            return null;
        }
    }
      public static  function getDateTimez(){
        return Carbon::now();
    }
    function HTTPClient($url,$header, $post = '') {
//        $usecookie = __DIR__ . "/cookie.txt";
        $header[] = 'Content-Type: application/json';
        $header[] = "Accept-Encoding: gzip, deflate";
        $header[] = "Cache-Control: max-age=0";
        $header[] = "Connection: keep-alive";
        $header[] = "Accept-Language: en-US,en;q=0.8,id;q=0.6";

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_VERBOSE, false);
        // curl_setopt($ch, CURLOPT_NOBODY, true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_ENCODING, true);
        curl_setopt($ch, CURLOPT_AUTOREFERER, true);
        curl_setopt($ch, CURLOPT_MAXREDIRS, 5);

        curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36");

        if ($post)
        {
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
        }

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        $rs = curl_exec($ch);

        if(empty($rs)){
            var_dump($rs, curl_error($ch));
            curl_close($ch);
            return false;
        }
        curl_close($ch);
        return $rs;
    }
    protected function sendBridgingCurl($headers , $dataJsonSend = null, $url,$method){
        $curl = curl_init();
        if($dataJsonSend == null){
            curl_setopt_array($curl, array(
                CURLOPT_URL=> $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 60,
                CURLOPT_SSL_VERIFYHOST => 0,
                CURLOPT_SSL_VERIFYPEER => 0,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => $method,
                CURLOPT_HTTPHEADER => $headers
            ));
        }else{
            curl_setopt_array($curl, array(
                CURLOPT_URL=> $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 60,
                CURLOPT_SSL_VERIFYHOST => 0,
                CURLOPT_SSL_VERIFYPEER => 0,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => $method,
                CURLOPT_POSTFIELDS => $dataJsonSend,
                CURLOPT_HTTPHEADER => $headers
            ));
        }

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $result = "Terjadi Kesalahan #:" . $err;
        } else {
            $result = json_decode($response);
        }
        return $result ;
    }
}