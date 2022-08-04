<?php

namespace App\Helpers\String;

class DclHashing
{
    const TIME_DIFF_LIMIT = 480; // 8 menit
    public static $time = null;

    public static function hashData(array $json_data, $cid, $secret)
    {
        return self::doubleEncrypt(strrev(''.static::getTime()).'.'.json_encode($json_data), $cid, $secret);
    }

    public static function parseData($hased_string, $cid, $secret)
    {
        $parsed_string = self::doubleDecrypt($hased_string, $cid, $secret);
        list($timestamp, $data) = array_pad(explode('.', $parsed_string, 2), 2, null);
        // var_dump($hased_string, $parsed_string, $timestamp, $data);
        if (self::tsDiff(strrev($timestamp)) === true) {
            return json_decode($data, true);
        }

        return;
    }

    public static function getTime()
    {
        if (static::$time === null) {
            static::$time = time();
        }

        return static::$time;
    }

    private static function tsDiff($ts)
    {
        return abs($ts - static::getTime()) <= self::TIME_DIFF_LIMIT;
    }

    private static function doubleEncrypt($string, $cid, $secret)
    {
        $result = '';
        $result = self::encrypt($string, $cid);
        // var_dump($result);
        $result = self::encrypt($result, $secret);
        // var_dump($result);
        return strtr(rtrim(base64_encode($result), '='), '+/', '-_');
    }

    private static function encrypt($string, $key)
    {
        $result = '';
        $strls = strlen($string);
        $strlk = strlen($key);
        for ($i = 0; $i < $strls; ++$i) {
            $char = substr($string, $i, 1);
            // echo "Test1: $char\n";
            $keychar = substr($key, ($i % $strlk) - 1, 1);
            // echo "Test2: $keychar\n";
            $char = chr((ord($char) + ord($keychar)) % 128);
            // echo "Test3: $char\n";
            // break;
            $result .= $char;
            // echo "Test4: $result\n\n";
        }

        return $result;
    }

    private static function doubleDecrypt($string, $cid, $secret)
    {
        $result = base64_decode(strtr(str_pad($string, ceil(strlen($string) / 4) * 4, '=', STR_PAD_RIGHT), '-_', '+/'));
        // var_dump($result);
        $result = self::decrypt($result, $cid);
        // var_dump($result);
        $result = self::decrypt($result, $secret);
        // var_dump($result);
        return $result;
    }

    private static function decrypt($string, $key)
    {
        $result = '';
        $strls = strlen($string);
        $strlk = strlen($key);
        for ($i = 0; $i < $strls; ++$i) {
            $char = substr($string, $i, 1);
            $keychar = substr($key, ($i % $strlk) - 1, 1);
            $char = chr(((ord($char) - ord($keychar)) + 256) % 128);
            $result .= $char;
        }

        return $result;
    }
}
