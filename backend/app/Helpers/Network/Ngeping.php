<?php

namespace App\Helpers\Network;

use App\Exceptions\BillingException;
use JJG\Ping as Ping;


class Ngeping
{

    /**
     * ping host
     *
     * @param   string  $host         url bni ecollection
     * @return  boolean true
     * @throws  BillingException  when url cannot ping
     */
    public static function host($host)
    {

        if (filter_var($host, FILTER_VALIDATE_URL) === false)
            throw new BillingException("Invalid Host");

        $ping = new Ping(rtrim(preg_replace('#^https?://#', '', $host), '/'));
        $latency = $ping->ping();

        if ($latency == false)
            throw new BillingException("Cannot reach host");

        return true;
    }
}
