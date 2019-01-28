<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use Illuminate\Support\Facades\Auth;
use Lcobucci\JWT\Parser;

class UserController extends Controller
{
    public $successStatus = 200;

    public function login(Request $request)
    {
        $credentials = $request->only('username', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token =  $user->createToken('Menoum')->accessToken;

            return response()->json(['token' => $token], $this->successStatus);
        }

        return response()->json(['error' => 'Unauthorized'], 401);
    }

    public function logout(Request $request)
    {
        $value = $request->bearerToken();
        $id = (new Parser())->parse($value)->getHeader('jti');
        $token = $request->user()->tokens->find($id);
        $token->revoke();

        $response = 'Logged out!';

        return response($response, $this->successStatus);
    }
}
