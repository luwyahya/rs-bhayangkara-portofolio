<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use App\Traits\JsonRespon;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that should not be reported.
     *
     * @var array
     */
    protected $dontReport = [
        AuthorizationException::class,
        HttpException::class,
        ModelNotFoundException::class,
        ValidationException::class,
    ];
    use JsonRespon;

    /**
     * Report or log an exception.
     *
     * This is a great spot to send exceptions to Sentry, Bugsnag, etc.
     *
     * @param  \Exception  $e
     * @return void
     */
    public function report(Exception $e)
    {
        parent::report($e);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Exception  $e
     * @return \Illuminate\Http\Response
     */
    public function render($request, Exception $e)
    {
      
        if ($e instanceof DataNotFoundException) {
            return $this->respondNotFound($e->getMessage());
        }

//        if ($e instanceof ExecuteQueryException) {
//            return $this->respondFailed([], $e->getMessage().' Query Salah ');
//        }

//        if ($e instanceof ModelNotFoundException) {
//            return $this->respondNotFound($e->getMessage());
//        }

//        $response = parent::render($request, $e);
//        if ($request->is('api/*')) {
//            app('Barryvdh\Cors\Stack\CorsService')->addActualRequestHeaders($response, $request);
//        }

        if ($e instanceof InternalServerErrorException) {
           return $this->respondInternalServer($e->getMessage());
       }

        return parent::render($request, $e);
    }
}
