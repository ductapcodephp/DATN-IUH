<?php

namespace App\Exceptions;

use Exception;

class PaymentException extends Exception
{
    public const ORDER_NOT_FOUND = '01';

    public const ORDER_ALREADY_CONFIRMED = '02';

    public const INVALID_SIGNATURE = '97';

    public const UNKNOWN_ERROR = '99';

    protected $errorCode;

    public function __construct(string $message, string $errorCode = self::UNKNOWN_ERROR)
    {
        parent::__construct($message);
        $this->errorCode = $errorCode;
    }

    public function getErrorCode(): string
    {
        return $this->errorCode;
    }
}
