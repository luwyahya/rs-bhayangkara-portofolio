<?php

namespace App\Exceptions;

class BillingException extends \Exception
{

    /**
     * Redefine the exception so message isn't optional
     */
    public function __construct($message, $code = 0, Exception $previous = null)
    {
        $message = $this->__toJson($message);
        parent::__construct($message, $code, $previous);
    }

    /**
     * Custom string representation of object with format json
     *
     * @param string  $message  message error
     * @return string           string with format json
     */
    public function __toJson($message)
    {
        return json_encode(['status' => false, 'message' => $message]);
    }
}
