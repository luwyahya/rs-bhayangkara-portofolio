<?php

namespace App\Traits;



use App\Exceptions\BillingException;
use App\Helpers\Network\Ngeping;
use App\Helpers\String\DclHashing;
use Respect\Validation\Validator as v;

trait BniTrait
{
    protected $TIME_DIFF_LIMIT = 480;

    public function autoGenerateTrxId()
    {
        $random = new \Rych\Random\Random();
        return $random->getRandomString(30);
    }

    public function modifyTrxId($str)
    {
        $random = new \Rych\Random\Random();
        $remaining = 30 - strlen($str);
        $newRandomString = $random->getRandomString($remaining);
        return $newRandomString.$str;
    }

    public function hitBniEcollection($request)
    {
//        $host = $this->getMode() == 'production' ? 'https://api.bni-ecollection.com/' : 'https://apibeta.bni-ecollection.com/';
        $host = 'https://apibeta.bni-ecollection.com/';
//        Ngeping::host($host);

        $headers = array('Content-Type' => 'application/json');
        $options = array('timeout' => 15);

        $sendRequest = \Requests::post($host, $headers, $request, $options);

        if ($sendRequest->status_code != 200) {
            throw new BillingException('Status HTTP Code ' .$sendRequest->status_code);
        }

        return $sendRequest->body;
    }

    public function responseBniEcollection($response, $clientId, $secretKey)
    {
        if (v::json()->validate($response) === false) {
            throw new BillingException('Format response from bni ecollection is invalid');
        }

        $responseArray = json_decode($response, true);

        if ($responseArray['status'] != '000') {
            return \Response::json($responseArray, 500, []);
//            throw new BillingException($responseArray['message']);
        }

        $decryptData = DclHashing::parseData($responseArray['data'], $clientId, $secretKey);
        if ($decryptData == null) {
            $responseArray ['message'] ='Failed decrypt response from bni ecollection';
            return \Response::json($responseArray, 500, []);
            throw new BillingException('Failed decrypt response from bni ecollection');
        }

        return json_encode(['status' => true, 'data' => $decryptData]);
    }



    public static function encrypt(array $json_data, $cid, $secret) {
        return self::doubleEncrypt(strrev(time()) . '.' . json_encode($json_data), $cid, $secret);
    }

    public static function decrypt($hased_string, $cid, $secret) {
        $parsed_string = self::doubleDecrypt($hased_string, $cid, $secret);
        list($timestamp, $data) = array_pad(explode('.', $parsed_string, 2), 2, null);
        if (self::tsDiff(strrev($timestamp)) === true) {
            return json_decode($data, true);
        }
        return null;
    }

    private static function tsDiff($ts) {
        return abs($ts - time()) <= self::$TIME_DIFF_LIMIT;
    }

    private static function doubleEncrypt($string, $cid, $secret) {
        $result = '';
        $result = self::enc($string, $cid);
        $result = self::enc($result, $secret);
        return strtr(rtrim(base64_encode($result), '='), '+/', '-_');
    }

    private static function enc($string, $key) {
        $result = '';
        $strls = strlen($string);
        $strlk = strlen($key);
        for($i = 0; $i < $strls; $i++) {
            $char = substr($string, $i, 1);
            $keychar = substr($key, ($i % $strlk) - 1, 1);
            $char = chr((ord($char) + ord($keychar)) % 128);
            $result .= $char;
        }
        return $result;
    }

    private static function doubleDecrypt($string, $cid, $secret) {
        $result = base64_decode(strtr(str_pad($string, ceil(strlen($string) / 4) * 4, '=', STR_PAD_RIGHT), '-_', '+/'));
        $result = self::dec($result, $cid);
        $result = self::dec($result, $secret);
        return $result;
    }

    private static function dec($string, $key) {
        $result = '';
        $strls = strlen($string);
        $strlk = strlen($key);
        for($i = 0; $i < $strls; $i++) {
            $char = substr($string, $i, 1);
            $keychar = substr($key, ($i % $strlk) - 1, 1);
            $char = chr(((ord($char) - ord($keychar)) + 256) % 128);
            $result .= $char;
        }
        return $result;
    }

}
