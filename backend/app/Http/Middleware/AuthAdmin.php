<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

use App\Web\Token;

class AuthAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  $guard
     * @return mixed
     */
    public function handle($request, Closure $next, $guard = null)
    {
        if (Auth::guard($guard)->guest()) {
            if($request->has('auth_token')){
                $checkToken = Token::where([
                    ['token_api',$request->input('auth_token')]
                ])->first();
                if($checkToken==null){
                    $response['message']='Have not Login yet';
                    $response['response']=false;
                    return response($response);
                }
            }else{
                $response['message']='Have not Login yet';
                $response['response']=false;
                return response($response);
            }
        }

        return $next($request);
    }
}
