<?php
namespace App\Http\Controllers;

use App\Master\LoginUser;
use App\Traits\JsonRespon;

class ApiController extends Controller
{

    use JsonRespon;
    protected $current_user = null;
    protected $skip_authentication;

    //result
    protected $transStatus=true;
    protected $transMessage = null;

    //other
    protected $kdProfile=1;

    public function __construct($skip_authentication = false)
    {
        $this->skip_authentication = $skip_authentication;
        if (!$this->skip_authentication) {
            $this->middleware('auth.token');
            $this->current_user = (object)\Session::get('userData');
        }
    }

    protected function getCurrentLoginID(){
        $this->current_user = (object)\Session::get('userData');
        return @$this->current_user->id;
    }

    protected function getCurrentUserID(){
        $login = $this->getCurrentLoginID();
        $loginUser= LoginUser::find($login);
        return $loginUser->pegawai->id;
    }


    protected function getKdProfile(){
        return $this->kdProfile;
    }

    public function setKdProfile($kdProfile)
    {
        $this->kdProfile = $kdProfile;
        return $this;
    }

    public function getPegawaiId(){
        return 1;
    }

    /**
     * @param $arr
     * @return bool
     */
    private function isAssoc($arr)
    {
        return array_keys($arr) !== range(0, count($arr) - 1);
    }

    /**
     * @param $dataArray
     * @param bool $isTrim
     * @return array
     */
    protected function clearEmptyArray($dataArray, $isTrim = true)
    {
        $result = array();
        $isAssociative = $this->isAssoc($dataArray);
        foreach ($dataArray as $key => $value) {
            if ($isTrim) {
                $value = trim($value);
            }
            if ($value != "") {
                if ($isAssociative) {
                    $result[$key] = $value;
                } else {
                    $result[] = $value;
                }

            }
        }
        return $result;
    }
}